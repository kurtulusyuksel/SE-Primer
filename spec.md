---

## 4. Durum Makinesi ve Akış Şeması (State Machine Diagram)

```mermaid
stateDiagram-v2
    [*] --> Giriş: Profil Seçimi (Seviye/Rol)
    Giriş --> Kriz_Sahnesi: Kriz Başlangıcı (Muhteşem Cuma 00:00 Çöküşü)

    Kriz_Sahnesi --> Karar_1_Mimari: Senaryo Yüklenir

    state Karar_1_Mimari {
        [*] --> Seçim_1
        Seçim_1 --> Asenkron_Kuyruk: A) Asenkron Ödeme Kuyruğuna Geç
        Seçim_1 --> Monolit_Restart: B) Monolit Servisi Yeniden Başlat (Çöküş)
    }

    Karar_1_Mimari --> Karar_2_Test: Mimari Etki Gösterilir

    state Karar_2_Test {
        [*] --> Seçim_2
        Seçim_2 --> Staging_Test: A) Önce Staging'de Kısa Test Koş
        Seçim_2 --> Direkt_Canli: B) Hemen Canlıya Al (Çift Çekim Hatası)
    }

    Karar_2_Test --> Karar_3_Guvenlik: Test Etkisi Gösterilir

    state Karar_3_Guvenlik {
        [*] --> Seçim_3
        Seçim_3 --> Log_Maskele: A) Kart/Müşteri Verilerini Maskele
        Seçim_3 --> Log_Direkt: B) Logları Ekibe Olduğu Gibi At (KVKK İhlali)
    }

    Karar_3_Guvenlik --> Son_A_Iyi: Yalnızca (A-A-A) Seçimleri
    Karar_3_Guvenlik --> Son_B_Kotu: Herhangi bir (B) Seçimi İçeriyorsa

    Son_A_Iyi --> [*]: Teknik Özet Kartı (Ödeme ve Sistem Ayakta)
    Son_B_Kotu --> [*]: Başarısız Kararlara Göre Sistem ve/veya KVKK/PCI-DSS Raporu
```

    Sonuç kuralı: Üç kararın tamamı A ise Son A oluşur. Herhangi bir adımda B seçilirse Son B oluşur. KVKK/PCI-DSS ihlal raporu yalnızca üçüncü adımda B seçildiğinde gösterilir.
