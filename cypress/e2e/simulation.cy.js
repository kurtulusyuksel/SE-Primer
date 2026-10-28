describe('SE Primer - Muhteşem Cuma Kriz Odası E2E Testleri', () => {

  beforeEach(() => {
    // Uygulama durumunu sıfırla ve ana sayfaya git
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/', {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });
  });

  it('1. Başarılı Senaryo (Son A - Recovery): Tüm Kararları A Seçerek Tamamlamalı', () => {
    // 1. Onboarding Screen: "YENİ BAŞLAYAN" modunu seç ve bağlan
    cy.contains('YENİ BAŞLAYAN', { matchCase: false, timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Kriz Odasına Bağlan', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 2. Karar 1: A Şıkkını Devreye Al -> Sonraki Adıma Geç
    cy.contains('A ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Sonraki Kriz Adımına Geç', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 3. Karar 2: A Şıkkını Devreye Al -> Sonraki Adıma Geç
    cy.contains('A ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Sonraki Kriz Adımına Geç', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 4. Karar 3: A Şıkkını Devreye Al -> Post-Mortem Raporuna Geç
    cy.contains('A ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Post-Mortem & Sonuç Raporu', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 5. PostMortemScreen: "SON A: BAŞARILI KURTARMA" kartını doğrula
    cy.contains('SON A: BAŞARILI KURTARMA', { matchCase: false, timeout: 8000 })
      .should('be.visible');
      
    cy.contains('Sistem Kurtarıldı', { matchCase: false })
      .should('be.visible');
  });

  it('2. Hatalı Senaryo (Son B - İhlal): B Seçiminde KVKK/PCI-DSS İhlal Kartını Tetiklemeli', () => {
    // 1. Onboarding Screen: "DENEYİMLİ MÜHENDİS" modunu seç ve bağlan
    cy.contains('DENEYİMLİ MÜHENDİS', { matchCase: false, timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Kriz Odasına Bağlan', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 2. Karar 1: B Şıkkını Devreye Al -> Sonraki Adıma Geç
    cy.contains('B ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Sonraki Kriz Adımına Geç', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 3. Karar 2: B Şıkkını Devreye Al -> Sonraki Adıma Geç
    cy.contains('B ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Sonraki Kriz Adımına Geç', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 4. Karar 3: B Şıkkını Devreye Al -> Post-Mortem Raporuna Geç
    cy.contains('B ŞIKKINI DEVREYE AL', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Post-Mortem & Sonuç Raporu', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // 5. PostMortemScreen: "SON B" ihlal kartını doğrula
    cy.contains('SON B', { matchCase: false, timeout: 8000 })
      .should('be.visible');
      
    cy.contains('Resmi İhlal Raporu', { matchCase: false })
      .should('be.visible');
  });

  it('3. Sokratik AI Mentor (AC-5): Yönlendirici Soruları Başarıyla Tetiklemeli', () => {
    // Kriz odasına bağlan
    cy.contains('YENİ BAŞLAYAN', { matchCase: false, timeout: 10000 })
      .should('be.visible')
      .click();
    cy.wait(1000);
      
    cy.contains('Kriz Odasına Bağlan', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // Sokratik mentorun hızlı sorularından birine tıkla
    cy.contains('Hangi şıkkı seçmeliyim?', { matchCase: false })
      .should('be.visible')
      .click();
    cy.wait(1000);

    // Sokratik yönlendirme etiketinin belirdiğini doğrula
    cy.contains('Sokratik Yönlendirme', { matchCase: false, timeout: 8000 })
      .should('be.visible');
  });

});