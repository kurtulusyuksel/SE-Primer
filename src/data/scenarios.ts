import { DecisionStep } from '../types/simulation';

export const CRISIS_SCENARIOS: DecisionStep[] = [
  {
    id: 'step1',
    stepNumber: 1,
    totalSteps: 3,
    category: 'MİMARİ',
    title: 'Ödeme Kuyruğu Yapısı ve Yük Dağıtımı',
    incidentSubtitle: 'Muhteşem Cuma 00:00:14 – Ödeme Servisi Kilitlendi (DB Deadlock)',
    contextDescription:
      'İndirimlerin başlamasıyla birlikte ödeme servisine saniyede 42.500 istek (RPS) yığıldı. Senkron monolit mimari nedeniyle veritabanı bağlantı havuzu (Connection Pool) 98/100 seviyesine ulaştı ve sipariş tablosunda ardışık kilitlenmeler (Deadlock) başladı. Kullanıcılar ödeme butonuna tekrar tekrar basıyor.',
    sevLevel: 'SEV-1',
    metricsBefore: {
      rps: '42,500',
      p99: '1,850ms',
      dbPool: '%98 (98/100 Dolu)',
      errorRate: '%38.4 (504 Gateway Timeout)',
      activeThreads: 1420,
    },
    choices: [
      {
        id: 'A',
        title: 'Asenkron Ödeme Kuyruğuna Geç (RabbitMQ / Kafka)',
        badge: 'Event-Driven / Buffer',
        description:
          'Gelen sipariş isteklerini anlık senkron DB yazımından çıkar; RabbitMQ/Kafka kuyruğuna aktararak kontrollü worker thread havuzu ile asenkron işle.',
        hint: '💡 Mimari İpucu: Kuyruk mimarisi (Message Broker), ani trafik patlamalarını bir akümülatör gibi tamponlar. DB yazma hızını ve transaction sürelerini dengeler, backpressure kontrolü sağlar.',
        riskNote: 'Kullanıcıya siparişin "Alındı, işleniyor" durumu gösterilmeli ve idempotency korunmalıdır.',
        technicalImpact:
          'Trafik tamponlandı. DB Connection Pool %98\'den %42\'ye geriledi. Deadlock kilitlenmeleri çözüldü, kuyruk akışı dengelendi.',
        consequenceSummary:
          'Asenkron kuyruk yapısı veritabanı darboğazını çözdü ve sistem yükünü güvenle dağıttı.',
        logsTriggered: [
          {
            timestamp: '00:00:24.112',
            level: 'INFO',
            tag: 'MESSAGE_BROKER',
            message: 'Queue "payment-events-v1" initialized. Partition workers (16 instances) connected.',
          },
          {
            timestamp: '00:00:25.040',
            level: 'INFO',
            tag: 'DB_POOL',
            message: 'PostgreSQL thread pool recovered. Active connections dropped from 98 to 42. Locks released.',
          },
          {
            timestamp: '00:00:25.890',
            level: 'INFO',
            tag: 'TRAFFIC_SHAPER',
            message: 'Backpressure mechanism operational. Rate: 42,500 RPS buffered gracefully.',
          },
        ],
      },
      {
        id: 'B',
        title: 'Monolit Ödeme Servisini Yeniden Başlat (Restart Pods)',
        badge: 'Force Reboot / Brute Force',
        description:
          'Kilitlenen ödeme monolit pod\'larını restart et ve bağlantıları temizleyerek servisin sıfırdan ayağa kalkmasını bekle.',
        hint: '⚠️ Mimari İpucu: Kök nedeni (mimari darboğazı) çözmeden yapılan restart operasyonları, kapıda birikmiş 120.000 bekleyen isteğin aynı anda tekrar DB\'ye hücum etmesine (thundering herd) yol açar.',
        riskNote: 'Geçici 5 saniyelik rahatlama ardından veritabanı kilitlenmesi katlanarak geri gelir.',
        technicalImpact:
          'Servis restart oldu ancak kuyrukta biriken yüz binlerce istek aynı anda tekrar DB bağlantı havuzuna saldırdı! Connection Pool yeniden %100 kilitlendi.',
        consequenceSummary:
          'Monolit restart geçici bir yara bandı oldu; istek yığılması nedeniyle veritabanı kilitlenmesi (Deadlock) devam etti.',
        logsTriggered: [
          {
            timestamp: '00:00:24.050',
            level: 'WARN',
            tag: 'KUBERNETES',
            message: 'Pod payment-monolith-7b4f terminated (SIGKILL). Restarting container...',
          },
          {
            timestamp: '00:00:26.410',
            level: 'FATAL',
            tag: 'DB_POOL',
            message: 'Thundering Herd problem! 120,000 hanging TCP connections flooded DB pool.',
          },
          {
            timestamp: '00:00:27.102',
            level: 'ERROR',
            tag: 'PG_DEADLOCK',
            message: 'deadlock detected on relation "orders_v2" txid=904289. Transactions aborted.',
          },
        ],
      },
    ],
  },
  {
    id: 'step2',
    stepNumber: 2,
    totalSteps: 3,
    category: 'TEST',
    title: 'Yeni Sürüm ve Tüketici Test Stratejisi',
    incidentSubtitle: 'Ödeme Kuyruk Tüketicisi (Worker) Kod Değişikliği Canlıya Çıkış Kararı',
    contextDescription:
      'Ödeme kuyruğu için hazırlanan yeni consumer worker kodu hazırlandı. Ancak banka gateway entegrasyonunda idempotency token ve callback imza doğrulaması içeren yeni bir kütüphane güncellemesi var. Muhteşem Cuma gecesi her saniye yüz binlerce lira ciro kaybı riski varken nasıl bir test stratejisi izleyeceksin?',
    sevLevel: 'SEV-1',
    metricsBefore: {
      rps: '41,200',
      p99: '820ms',
      dbPool: '%54 (54/100 Dolu)',
      errorRate: '%12.1',
      activeThreads: 890,
    },
    choices: [
      {
        id: 'A',
        title: 'Önce Staging\'de Kısa Test Koş (Sanity / Regression Check)',
        badge: 'Sanity Suite / CI Gate',
        description:
          '30 saniyelik otomatik regresyon ve sahte banka gateway webhook testini staging ortamında çalıştır, çift işlem kontrolünü doğrula.',
        hint: '💡 Test İpucu: Finansal sistemlerde ödeme kuralı: "Hızlı gitmek istiyorsan önce regresyon testini koş." 30 saniyelik bir sanity testi, milyonlarca liralık çift çekim felaketini önler.',
        riskNote: 'Canlıya çıkış 30 saniye gecikir ancak finansal risk sıfırlanır.',
        technicalImpact:
          'Staging testinde gizli bir "çift çekim" (double-charge) regresyon hatası yakalandı ve canlıya gitmeden düzeltildi!',
        consequenceSummary:
          'Staging testleri sayesinde gizli regresyon hatası canlıya sızmadan engellendi; çift çekim riski sıfırlandı.',
        logsTriggered: [
          {
            timestamp: '00:00:41.200',
            level: 'INFO',
            tag: 'TEST_RUNNER',
            message: 'Staging regression suite triggered with 500 simulated parallel transactions.',
          },
          {
            timestamp: '00:00:43.010',
            level: 'WARN',
            tag: 'STAGING_GATEWAY',
            message: 'FLAW CAUGHT: Idempotency token header null in fast retries. Regression patch #44 applied!',
          },
          {
            timestamp: '00:00:44.330',
            level: 'INFO',
            tag: 'CD_PIPELINE',
            message: 'Regression suite passed [100% green]. Verified clean container deployed to production.',
          },
        ],
      },
      {
        id: 'B',
        title: 'Hemen Canlıya Al (Testleri Atla - Hızlı Deploy)',
        badge: 'Direct Prod Push / No Tests',
        description:
          'Vakit kaybetmeden kodu doğrudan canlı kümeye (Production) gönder. Müşteriler bekliyor, her saniye ciro kaybı.',
        hint: '⚠️ Test İpucu: Kriz esnasında "testleri atlayarak canlıya almak" en yaygın felaket tuzaklarından biridir. İdempotency anahtarı kontrol edilmezse mükerrer kart çekimleri tetiklenir.',
        riskNote: 'Gizli regresyon hataları doğrudan gerçek müşteri kartları üzerinde patlar!',
        technicalImpact:
          'KRİTİK HATA: Test edilmeyen kodda gizli çift çekim (double-charge) regresyon hatası patladı! Müşterilerin kartlarından mükerrer para çekildi!',
        consequenceSummary:
          'Testler atlandığı için gizli regresyon canlıya sızdı; müşterilerden çift çekim yapıldı ve çağrı merkezi kilitlendi!',
        logsTriggered: [
          {
            timestamp: '00:00:40.910',
            level: 'WARN',
            tag: 'DEPLOY_BOT',
            message: 'Bypassing Staging & CI tests per operator override. Deploying directly to prod-cluster.',
          },
          {
            timestamp: '00:00:42.502',
            level: 'FATAL',
            tag: 'PAYMENT_PROCESSOR',
            message: 'Duplicate transaction generated for Order #TR-994821 (Double Charge Triggered!)',
          },
          {
            timestamp: '00:00:43.190',
            level: 'FATAL',
            tag: 'FINANCIAL_ALARM',
            message: 'CRITICAL REGRESSION: 1,420 customers double-charged within 10 seconds. Webhook loop!',
          },
        ],
      },
    ],
  },
  {
    id: 'step3',
    stepNumber: 3,
    totalSteps: 3,
    category: 'KVKK & PCI-DSS',
    title: 'Hata Tespiti, Güvenlik ve Log Yönetimi',
    incidentSubtitle: 'Ödeme Hatalarını Çözmek İçin Log Paylaşımı ve Veri Güvenliği Protokolü',
    contextDescription:
      'Ödeme hatalarını inceleyen operasyon ve geliştirme ekibi, gateway ile iletişimdeki payload verilerini görmek istiyor. Loglarda müşterilerin kredi kartı numaraları (PAN), CVV kodları, T.C. kimlik ve sipariş tutarları bulunuyor. Hata ayıklama logları nasıl yönetilmeli?',
    sevLevel: 'SEV-1',
    metricsBefore: {
      rps: '39,800',
      p99: '640ms',
      dbPool: '%48',
      errorRate: '%4.2',
      activeThreads: 620,
    },
    choices: [
      {
        id: 'A',
        title: 'Kart / Müşteri Verilerini Maskele & Öyle Logla',
        badge: 'PCI-DSS Req 3.4 & KVKK Uyumlu',
        description:
          'Kredi kartı numarasını (PAN) ilk 6 ve son 4 harici maskele (4543 **** **** 1290), CVV kodunu asla kaydetme, kimlik verilerini hashle.',
        hint: '💡 Güvenlik İpucu: PCI-DSS Kural 3.4 gereğince PAN açık tutulamaz; CVV ise işlem sonrasında hiçbir koşulda depolanamaz veya loglanamaz. KVKK Madde 12 veri güvenliği yükümlülüğü getirir.',
        riskNote: 'Log filtreleme 1 milisaniye ek yük getirir ancak şirket lisansını ve yasal varlığını korur.',
        technicalImpact:
          'Tüm hassas finansal veriler maskelendi. PCI-DSS ve KVKK regülasyonlarına tam uyum sağlandı, denetimden başarıyla geçildi.',
        consequenceSummary:
          'Veriler maskelenerek loglandı; PCI-DSS ve KVKK kurallarına tam uyum sağlandı, veri ihlali önlendi.',
        logsTriggered: [
          {
            timestamp: '00:01:05.100',
            level: 'INFO',
            tag: 'SECURITY_FILTER',
            message: 'Sanitizing payload stream: PAN masked [4543********1290], CVV removed from memory buffer.',
          },
          {
            timestamp: '00:01:06.004',
            level: 'INFO',
            tag: 'PCI_DSS_AUDIT',
            message: 'Requirement 3.4 and KVKK Art. 12 compliance: VERIFIED. Zero sensitive data leakage.',
          },
          {
            timestamp: '00:01:06.820',
            level: 'INFO',
            tag: 'APM_LOGGER',
            message: 'Masked debug telemetry forwarded to engineering team Slack channel & Datadog.',
          },
        ],
      },
      {
        id: 'B',
        title: 'Logları Ekibe Olduğu Gibi At (Hızlı Debug İçin Açık Log)',
        badge: 'Raw Dump / Critical Breach',
        description:
          'Hatanın çok hızlı çözülmesi için ham HTTP request/response yüklerini, kart numaraları ve CVV ile birlikte açık metin olarak log havuzuna ve paylaşılan kanallara dök.',
        hint: '⚠️ Güvenlik İpucu: Kriz anında bile ham kart verisini loglamak ağır suç ve regülasyon ihlalidir. Bu adım doğrudan lisans iptali ve devasa cezalarla sonuçlanan "Son B" kartını tetikler.',
        riskNote: 'Milyonlarca müşterinin kredi kartı ve kimlik verileri açık şekilde log servislerine sızar.',
        technicalImpact:
          'AĞIR VERİ İHLALİ (DATA BREACH): Kredi kartı PAN, CVV ve T.C. kimlik bilgileri açık log havuzuna saçıldı! PCI-DSS ve KVKK ihlali tespit edildi!',
        consequenceSummary:
          'Açık loglama nedeniyle müşterilerin kredi kartı ve kimlik verileri sızdı; PCI-DSS ve KVKK ihlali gerçekleşti!',
        logsTriggered: [
          {
            timestamp: '00:01:04.912',
            level: 'FATAL',
            tag: 'SECURITY_BREACH',
            message: 'RAW CARD DATA EXPOSED: {"pan": "4543 9012 3412 8821", "cvv": "912", "holder": "Mehmet K****"}',
          },
          {
            timestamp: '00:01:05.880',
            level: 'FATAL',
            tag: 'COMPLIANCE_VIOLATION',
            message: 'PCI-DSS Req 3.2 Violation: Card Verification Code stored in plaintext incident logs!',
          },
          {
            timestamp: '00:01:06.910',
            level: 'FATAL',
            tag: 'KVKK_REGULATOR',
            message: 'KVKK Madde 12 ihlali: Müşteri finansal verilerinin yetkisiz erişime açıldığı raporlandı!',
          },
        ],
      },
    ],
  },
];
