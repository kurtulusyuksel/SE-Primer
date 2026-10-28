import React from 'react';
import { DecisionRecord, OutcomeType, UserLevel } from '../types/simulation';
import { CheckCircle2, ShieldAlert, AlertTriangle, FileText, RefreshCw, Award, Scale, Zap, Terminal } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PostMortemScreenProps {
  outcome: OutcomeType;
  decisions: DecisionRecord[];
  userLevel: UserLevel;
  onRestart: () => void;
}

export const PostMortemScreen: React.FC<PostMortemScreenProps> = ({
  outcome,
  decisions,
  userLevel,
  onRestart,
}) => {
  const isGoodEnding = outcome === 'outcome_a';

  const step1 = decisions.find((d) => d.stepId === 'step1');
  const step2 = decisions.find((d) => d.stepId === 'step2');
  const step3 = decisions.find((d) => d.stepId === 'step3');
  const hasSecurityBreach = step3?.choiceId === 'B';
  const failedDecisions = decisions.filter((decision) => decision.choiceId === 'B');

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Top Banner / Outcome Card */}
      <div
        className={`relative overflow-hidden rounded-[8px] border p-6 shadow-2xl transition-all ${
          isGoodEnding
            ? 'border-[#10B981] bg-[#10B981]/10 glow-emerald'
            : 'border-[#EF4444] bg-[#EF4444]/10 glow-sev1'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-[4px] border px-2.5 py-0.5 font-mono text-xs font-bold">
              {isGoodEnding ? (
                <span className="border-[#10B981]/40 bg-[#10B981]/20 text-[#10B981]">
                  SON A: BAŞARILI KURTARMA
                </span>
              ) : hasSecurityBreach ? (
                <span className="border-[#EF4444]/40 bg-[#EF4444]/20 text-[#EF4444] animate-pulse">
                  SON B: KVKK & PCI-DSS İHLALİ
                </span>
              ) : (
                <span className="border-[#EF4444]/40 bg-[#EF4444]/20 text-[#EF4444] animate-pulse">
                  SON B: KRİZ VE SİSTEM KAYBI
                </span>
              )}
              <span className="text-[#9CA3AF]">|</span>
              <span className="text-[#F9FAFB]">
                {userLevel === 'experienced' ? 'Deneyimli Modu (Stres)' : 'Yeni Başlayan (Rehberli)'}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-3xl">
              {isGoodEnding
                ? 'Sistem Kurtarıldı: Muhteşem Cuma Felaketi Önendi!'
                : hasSecurityBreach
                  ? 'Kriz Büyüdü: Ağır Veri İhlali ve Güvenlik Soruşturması!'
                  : 'Kriz Derinleşti: Sistem Müdahalesi Başarısız!'}
            </h1>

            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-2xl">
              {isGoodEnding
                ? 'Asenkron mesaj kuyruğu sayesinde veritabanı bağlantı havuzu kontrol altına alındı ve müşteri finansal verileri PCI-DSS / KVKK standartlarına uygun şekilde maskelendi. Şirket 1.4 milyon başarılı işlemi sıfır veri sızıntısıyla tamamladı.'
                : hasSecurityBreach
                  ? 'Ödeme loglarının açık metin olarak paylaşılması sonucu müşterilerin kredi kartı (PAN), CVV ve kimlik verileri yetkisiz erişime maruz kaldı. PCI-DSS ve KVKK ihlali raporlandı.'
                  : `Başarısız müdahale sistemi krizde bıraktı: ${failedDecisions.map((decision) => decision.consequenceSummary).join(' ')}`}
            </p>
          </div>

          {/* Badge Icon */}
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] border shadow-lg ${
              isGoodEnding
                ? 'border-[#10B981]/50 bg-[#10B981]/20 text-[#10B981]'
                : 'border-[#EF4444]/50 bg-[#EF4444]/20 text-[#EF4444]'
            }`}
          >
            {isGoodEnding ? <CheckCircle2 className="h-9 w-9" /> : <ShieldAlert className="h-9 w-9" />}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#1F2937]/80 pt-4 sm:grid-cols-4">
          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-3">
            <span className="font-mono text-[10px] text-[#9CA3AF] uppercase">Kalan Sistem SLA</span>
            <div className={`font-mono text-lg font-bold ${isGoodEnding ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isGoodEnding ? '%99.8' : '%61.2'}
            </div>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-3">
            <span className="font-mono text-[10px] text-[#9CA3AF] uppercase">Kurtarılan Sipariş</span>
            <div className={`font-mono text-lg font-bold ${isGoodEnding ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
              {isGoodEnding ? '1,420,000+' : '412,000'}
            </div>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-3">
            <span className="font-mono text-[10px] text-[#9CA3AF] uppercase">PCI-DSS Uyumu</span>
            <div className={`font-mono text-lg font-bold ${hasSecurityBreach ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {hasSecurityBreach ? 'İHLAL TESPİTİ' : 'VERİ GÜVENLİ'}
            </div>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-3">
            <span className="font-mono text-[10px] text-[#9CA3AF] uppercase">KVKK Riski</span>
            <div className={`font-mono text-lg font-bold ${hasSecurityBreach ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
              {hasSecurityBreach ? 'AĞIR YAPTIRIM' : 'İHLAL YOK'}
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Violation Audit Report (Shown if Bad Ending) */}
      {!isGoodEnding && hasSecurityBreach && (
        <div className="rounded-[8px] border border-[#EF4444]/60 bg-[#111827] p-5 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-[#1F2937] pb-3">
            <Scale className="h-5 w-5 text-[#EF4444]" />
            <h2 className="text-base font-bold text-[#F9FAFB]">
              Resmi İhlal Raporu & Hukuki Değerlendirme (Post-Mortem Audit)
            </h2>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="rounded-[4px] border border-[#EF4444]/30 bg-[#EF4444]/10 p-3">
              <span className="font-bold text-[#EF4444]">1. PCI-DSS Requirement 3.4 & 3.2 İhlali:</span>
              <p className="mt-1 font-sans text-xs text-[#E5E7EB]">
                Kredi kartı birincil hesap numarası (PAN) açık metin olarak loglara aktarıldı. 
                Daha da ağırı, <strong>CVV/CVC güvenlik kodu</strong> log havuzuna kaydedildi. PCI-DSS standardı, 
                yetkilendirme sonrasında CVV kodunun hiçbir şart altında saklanamayacağını kesin hükümle belirtir.
              </p>
            </div>

            <div className="rounded-[4px] border border-[#EF4444]/30 bg-[#EF4444]/10 p-3">
              <span className="font-bold text-[#EF4444]">2. 6698 Sayılı KVKK Madde 12 İhlali:</span>
              <p className="mt-1 font-sans text-xs text-[#E5E7EB]">
                Veri sorumlusu, kişisel verilerin hukuka aykırı olarak işlenmesini ve erişilmesini önlemekle yükümlüdür. 
                Geliştirici ekibinin açık Slack kanalına ve log sunucularına ham kimlik ve kart verilerinin basılması, 
                kurum içi ve dışı veri sızıntısı (Data Breach) olarak kayıtlara geçmiştir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decision Trace (Alınan Kararların Mühendislik İncelemesi) */}
      <div className="rounded-[8px] border border-[#1F2937] bg-[#111827] p-5 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-[#1F2937] pb-3">
          <FileText className="h-5 w-5 text-[#6366F1]" />
          <h2 className="text-base font-bold text-[#F9FAFB]">
            Mühendislik Karar İzi (Decision Trace & Root Cause Analysis)
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {decisions.map((dec, idx) => (
            <div
              key={dec.stepId}
              className="flex flex-col sm:flex-row sm:items-start justify-between rounded-[6px] border border-[#1F2937] bg-[#0A0F1D] p-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-[#6366F1]">Adım {idx + 1}: {dec.stepTitle}</span>
                  <span
                    className={`rounded-[3px] px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                      dec.choiceId === 'A'
                        ? 'border border-[#10B981]/50 bg-[#10B981]/15 text-[#10B981]'
                        : 'border border-[#EF4444]/50 bg-[#EF4444]/15 text-[#EF4444]'
                    }`}
                  >
                    ŞIK {dec.choiceId}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#F9FAFB]">{dec.choiceTitle}</div>
                <p className="text-[#9CA3AF] text-xs leading-relaxed">{dec.consequenceSummary}</p>
              </div>

              <div className="mt-2 sm:mt-0 sm:text-right font-mono text-[11px] text-[#6B7280]">
                <span>Etki: </span>
                <span className={dec.choiceId === 'A' ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                  {dec.choiceId === 'A' ? '+ Pozitif Mimari' : '- Kriz Yükü'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Socratic Reflection Summary */}
      <div className="rounded-[8px] border border-[#6366F1]/40 bg-[#6366F1]/5 p-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-[#6366F1]" />
          <h3 className="font-mono text-xs font-bold text-[#C7D2FE]">
            SOCRATES CORE // MİMARİ POST-MORTEM ÇIKARIMI
          </h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
          Yüksek ölçekli sistemlerde kriz anları refleksle değil, prensiplerle yönetilir:
          <br />
          1. <strong>Trafik Asimetrisi:</strong> Ani yük patlamalarında monolit servisi restart etmek problemi çözmez; kuyruk mimarisi (backpressure) zorunludur.
          <br />
          2. <strong>Hızlı Çıkış Yanılgısı:</strong> Staging testini atlamak 30 saniye kazandırabilir ancak regresyon kaynaklı çift çekim milyonlarca liralık zarara yol açar.
          <br />
          3. <strong>Güvenlik Taviz Vermez:</strong> Kriz ne kadar büyük olursa olsun, açık loglama yapmak teknik bir çözüm değil, hukuki ve etik bir iflastır.
        </p>
      </div>

      {/* Restart CTA Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          onRestart();
        }}
        className="flex w-full items-center justify-center space-x-2 rounded-[4px] bg-[#6366F1] py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:bg-[#4F46E5] active:scale-[0.99]"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Tekrar Başla (Farklı Senaryo ve Kararları Dene)</span>
      </button>
    </div>
  );
};
