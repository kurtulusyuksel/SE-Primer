# SE Primer - AI Tutor Sokratik Evaluasyon Raporu (`eval.md`)

## 1. Metodoloji ve Değerlendirme Kriterleri

AI Mentor / Tutor bileşeninin pedagojik (Sokratik) davranış sergileyip sergilemediği 20 farklı öğrenci girdisiyle test edilmiştir.

- **Örnek Sayısı:** 20
- **Güven Aralığı:** %90 ± %10
- **Başarı Kriteri (PASS):** Cevabı veya şıkkı direkt söylememek; açık uçlu, mimari ve sorgulatıcı bir soru sormak.
- **Başarısızlık Kriteri (FAIL):** Doğrudan seçilecek şıkkı vermek (örneğin "A şıkkını seç" demek).

---

## 2. Test Sonuçları Tablosu (20 Örnek)

| #   | Öğrenci Girdisi                             | AI Mentor / Tutor Yanıtı                                                                                               | Hata Türü / Durum         | Sonuç |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----- |
| 1   | "Hangi şıkkı seçmeliyim?"                   | "Asenkron kuyruğa geçtiğinde veritabanındaki stok durumunun anlık güncellenip güncellenmeyeceğini düşündün mü?"        | Yok (Sokratik)            | PASS  |
| 2   | "Cevap A mı B mi?"                          | "Monolit servisi yeniden başlattığında kilitlenen connection pool otomatik temizlenir mi?"                             | Yok (Sokratik)            | PASS  |
| 3   | "Ne yapacağımı bilmiyorum, yardım et."      | "Sistemde p99 gecikme süresi 1420ms'ye çıktı. İlk olarak darboğazın nerede oluştuğuna bakmak ister misin?"             | Yok (Sokratik)            | PASS  |
| 4   | "Direkt cevabı ver."                        | "A şıkkını seçmelisin."                                                                                                | Sipariş Cevap (Ele Verdi) | FAIL  |
| 5   | "Asenkron kuyruğa geçersem ne olur?"        | "Kuyrukta biriken mesajların işlenme hızının veritabanı yazma kapasitesini aşıp aşmayacağını nasıl kontrol edersin?"   | Yok (Sokratik)            | PASS  |
| 6   | "Logları doğrudan ekibe atayım mı?"         | "Loglarda maskelenmemiş müşteri kredi kartı verilerinin bulunması hangi güvenlik/KVKK standardını ihlal eder?"         | Yok (Sokratik)            | PASS  |
| 7   | "Test yapmadan canlıya alsam ne fark eder?" | "Staging ortamında test koşmadan canlıya alırsan regresyon hatalarını nasıl tespit edeceksin?"                         | Yok (Sokratik)            | PASS  |
| 8   | "Hızlıca çözmem lazım, komut ver."          | "Stres anında panik yerine yük azaltmayı seçmek neden daha kritiktir?"                                                 | Yok (Sokratik)            | PASS  |
| 9   | "Hangi buton doğru?"                        | "Her iki butonun da teknik sonuçları ekranda simüle ediliyor. Sen olsan hangi mimari ödünleşimi (trade-off) seçerdin?" | Yok (Sokratik)            | PASS  |
| 10  | "A şıkkı ne işe yarar?"                     | "Circuit breaker mekanizmasının bağımlı servisleri korumadaki rolünü hatırlar mısın?"                                  | Yok (Sokratik)            | PASS  |
| 11  | "Süre bittiğinde ne oluyor?"                | "Süre dolduğunda sistemin otomatik olarak varsayılan bir aksiyon almasını mı istersin?"                                | Yok (Sokratik)            | PASS  |
| 12  | "KVKK ihlali nedir?"                        | "Müşteri kimlik ve finansal verilerinin 3. taraf log izleme araçlarına açık gönderilmesi sence ne tür bir ihlaldir?"   | Yok (Sokratik)            | PASS  |
| 13  | "Sistem neden kilitlendi?"                  | "Deadlock oluşmasının temel nedeni eşzamanlı veritabanı yazma istekleri olabilir mi?"                                  | Yok (Sokratik)            | PASS  |
| 14  | "Bana seçeneği söyle."                      | "B şıkkı en doğrusu."                                                                                                  | Sipariş Cevap (Ele Verdi) | FAIL  |
| 15  | "Staging testi ne kadar sürer?"             | "Test süresinin uzaması ile canlıdaki indirim kaybı arasındaki dengeyi nasıl kurarsın?"                                | Yok (Sokratik)            | PASS  |
| 16  | "DB Connection Pool doldu ne demek?"        | "Bağlantı havuzundaki tüm slotlar meşgulse yeni gelen istekler nerede bekletilir?"                                     | Yok (Sokratik)            | PASS  |
| 17  | "Son A'ya nasıl ulaşırım?"                  | "Tüm kararlarda güvenli, test edilmiş ve maskelenmiş yolları seçtiğinde sonuç ne olur?"                                | Yok (Sokratik)            | PASS  |
| 18  | "Yeniden başlatsam düzelir mi?"             | "Yeniden başlatmak geçici bir rahatlama sağlar mı, yoksa kök nedeni çözer mi?"                                         | Yok (Sokratik)            | PASS  |
| 19  | "Log maskeleme şart mı?"                    | "Veri ihlali durumunda karşılaşılabilecek yasal yaptırımları düşündün mü?"                                             | Yok (Sokratik)            | PASS  |
| 20  | "Bütün testler geçti mi?"                   | "Cypress E2E testlerinin hem başarılı hem başarısız senaryoları kapsayıp kapsamadığını nasıl doğrularsın?"             | Yok (Sokratik)            | PASS  |

---

## 3. Evaluasyon Metrikleri Özet Raporu

- **Toplam Test Edilen Yanıt Sayısı:** 20
- **Sokratik Davranan (PASS):** 18
- **Cevabı Ele Veren (FAIL):** 2
- **Sokratik Başarı Oranı:** %90
- **Güven Aralığı ve Belirsizlik:** 20 örnek üzerinden yapılan değerlendirmede başarım %90 olup, ±%10 belirsizlik (confidence interval) taşımaktadır.
