<div align="center">
  <img width="30%" alt="Giriş Ekranı" src="./assets/Stitch1.png" />
  <img width="30%" alt="Kriz Odası" src="./assets/Stitch2.png" />
  <img width="30%" alt="Sonuç Analizi" src="./assets/Stitch3.png" />
  <h1>SE Primer — Muhteşem Cuma Kriz Odası</h1>
  <p><b>YZM301 Yazılım Gerçekleme ve Test · AI-DLC İnteraktif Eğitim Simülasyonu</b></p>
</div>

---

## Proje Hakkında

**SE Primer**, yüksek trafikli bir e-ticaret altyapısında Muhteşem Cuma gecesi yaşanan ödeme servisi kilitlenmesini simüle eden, mobil öncelikli ve etkileşimli bir eğitim uygulamasıdır.

Oyuncu, kriz sırasında mimari, test ve veri güvenliği (KVKK/PCI-DSS) kararları alır. Kararların sonuçları uygulamada simüle edilir; Sokratik mentor ise doğrudan yanıt vermek yerine yönlendirici sorularla kök neden analizine teşvik eder.

## Demo ve Tasarım

- 🌐 **Canlı uygulama:** [SE Primer](https://se-primer-muhte-em-cuma-kriz-odas.ai.studio/)
- 🎥 **Cypress E2E demo videosu:** [Videoyu görüntüle](<./cypress/e2e/Kayıt 2026-10-26 232608.mp4>)
- 🎨 **Tasarım sistemi:** [design.md](./design.md)
- 📊 **Sokratik mentor değerlendirmesi:** [eval.md](./eval.md)
- 📋 **Proje kapsamı ve kabul kriterleri:** [spec.md](./spec.md)

## Teknolojiler

- React, TypeScript ve Vite
- Express sunucusu
- Google Gemini API (isteğe bağlı; anahtar olmadan yerel Sokratik yanıt motoru kullanılır)
- Cypress E2E testleri

## Yerel Kurulum

**Gereksinimler:** Node.js `^20.19.0` veya `>=22.12.0` ve npm.

```bash
npm ci
npm run dev
```

Uygulamayı `http://localhost:3000` adresinde açın.

Gemini API kullanmak isterseniz `.env.example` dosyasını `.env` olarak kopyalayıp `GEMINI_API_KEY` değerini ekleyin. API anahtarı olmadan uygulama yerel yanıt motoruyla çalışır. Gerçek anahtarları GitHub'a yüklemeyin; `.env` Git tarafından yok sayılır.

## Testler

Önce `npm run dev` komutuyla sunucuyu başlatın. Ardından ikinci bir terminalde E2E testlerini çalıştırın:

```bash
npm run test:e2e
```

Cypress arayüzüyle çalıştırmak için:

```bash
npm run test:e2e:open
```

TypeScript kontrolü ve üretim derlemesi:

```bash
npm run lint
npm run build
```

## Proje Dosyaları

- `src/`: React arayüzü, bileşenler, senaryolar ve yardımcı kodlar.
- `server.ts`: Express sunucusu ve Sokratik mentor API uç noktası.
- `cypress/e2e/simulation.cy.js`: Başarılı ve başarısız karar akışlarını ve Sokratik mentor arayüzünü doğrulayan E2E testleri.
- `spec.md`: Problem tanımı, kapsam ve kabul kriterleri.
- `design.md`: Arayüz tasarımı ve tasarım sistemi.
- `eval.md`: Sokratik mentor değerlendirme raporu.

## Kapsam Dışı Bırakılan Özellikler

MVP kapsamı ve önceliklendirme doğrultusunda aşağıdaki özellikler ilk sürüme dahil edilmemiştir:

1. **Çok oyunculu kriz odası:** İlk sürüm tek kullanıcılı simülasyona odaklanır; gerçek zamanlı işbirliği ve WebSocket altyapısı kapsam dışıdır.
2. **Zaman serisi metrik panosu:** Simülasyon karar akışına odaklanmak için ayrıntılı grafik ve metrik panosu ertelenmiştir.
3. **Çoklu dil desteği:** İlk sürüm Türkçe eğitim senaryolarına odaklanır; i18n altyapısı kapsam dışıdır.
