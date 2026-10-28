import React, { useState } from 'react';
import { UserLevel } from '../types/simulation';
import { ShieldAlert, Zap, Timer, Sparkles, Terminal, ArrowRight, Server, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OnboardingScreenProps {
  onStart: (level: UserLevel) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart }) => {
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>('beginner');

  const handleSelectLevel = (level: UserLevel) => {
    setSelectedLevel(level);
    soundManager.playClick();
  };

  const handleConnect = () => {
    soundManager.playAlarm();
    onStart(selectedLevel);
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-60px)] max-w-4xl flex-col justify-center px-4 py-8">
      {/* Background Cyber Grid Accent */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Hero Incident Header */}
      <div className="mb-6 space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 rounded-[4px] border border-[#EF4444]/40 bg-[#EF4444]/15 px-3 py-1 font-mono text-xs text-[#EF4444] glow-sev1">
          <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping" />
          <span className="font-bold">SEV-1 OLAĞANÜSTÜ DURUM</span>
          <span className="text-[#9CA3AF]">|</span>
          <span>MUHTEŞEM CUMA: 00:00:00 CANLI</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#F9FAFB] sm:text-4xl">
          SE Primer: Muhteşem Cuma Kriz Odası
        </h1>

        <p className="text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
          Saat tam <span className="font-mono text-[#F9FAFB]">00:00</span>. Türkiye'nin en büyük e-ticaret platformunda indirimler açıldı. 
          Saniyede <span className="font-mono font-semibold text-[#EF4444]">42.500 istek</span> ödeme servisine yüklendi ve veritabanı kilitlendi. 
          Sistem mimarisi, test stratejisi ve veri güvenliği (KVKK / PCI-DSS) kararlarını vererek kriz odasını yönet!
        </p>
      </div>

      {/* Live Pre-Flight Telemetry Preview */}
      <div className="mb-6 rounded-[8px] border border-[#1F2937] bg-[#111827] p-4">
        <div className="mb-3 flex items-center justify-between border-b border-[#1F2937] pb-2">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#9CA3AF]">
            <Server className="h-4 w-4 text-[#6366F1]" />
            <span>CANLI TRAFİK SAYAÇ TELEMETRİSİ</span>
          </div>
          <span className="rounded-[4px] border border-[#EF4444]/40 bg-[#EF4444]/10 px-2 py-0.5 font-mono text-[10px] text-[#EF4444]">
            CRITICAL LATENCY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-2.5">
            <span className="font-mono text-[10px] uppercase text-[#9CA3AF]">Anlık İstek (RPS)</span>
            <div className="font-mono text-lg font-bold text-[#EF4444] sm:text-xl">42,500 RPS</div>
            <span className="font-mono text-[10px] text-[#F59E0B]">▲ %340 Trafik Patlaması</span>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-2.5">
            <span className="font-mono text-[10px] uppercase text-[#9CA3AF]">DB Connection Pool</span>
            <div className="font-mono text-lg font-bold text-[#EF4444] sm:text-xl">98 / 100</div>
            <span className="font-mono text-[10px] text-[#EF4444]">Deadlock Riski Yüksek</span>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-2.5">
            <span className="font-mono text-[10px] uppercase text-[#9CA3AF]">Gecikme (p99)</span>
            <div className="font-mono text-lg font-bold text-[#F59E0B] sm:text-xl">1,850 ms</div>
            <span className="font-mono text-[10px] text-[#9CA3AF]">SLA: &lt; 250ms</span>
          </div>

          <div className="rounded-[4px] border border-[#1F2937] bg-[#0A0F1D] p-2.5">
            <span className="font-mono text-[10px] uppercase text-[#9CA3AF]">Hata Oranı (5xx)</span>
            <div className="font-mono text-lg font-bold text-[#EF4444] sm:text-xl">%38.4</div>
            <span className="font-mono text-[10px] text-[#EF4444]">Gateway Timeout</span>
          </div>
        </div>
      </div>

      {/* Level Selection Cards (spec.md AC-1) */}
      <div className="mb-6 space-y-3">
        <label className="block font-mono text-xs font-semibold tracking-wider uppercase text-[#9CA3AF]">
          Mühendislik Deneyim Seviyesini Seçin:
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Beginner Mode */}
          <button
            type="button"
            onClick={() => handleSelectLevel('beginner')}
            className={`flex flex-col justify-between rounded-[8px] border p-4 text-left transition ${
              selectedLevel === 'beginner'
                ? 'border-[#6366F1] bg-[#6366F1]/10 glow-indigo'
                : 'border-[#1F2937] bg-[#111827] hover:border-[#374151]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 font-mono text-xs font-bold text-[#6366F1]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>YENİ BAŞLAYAN</span>
                </span>
                <span className="rounded-[4px] border border-[#10B981]/40 bg-[#10B981]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#10B981]">
                  Rehberli Mod
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-[#F9FAFB]">
                Mimari İpuçları & Rehberli Kök Neden Analizi
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">
                Karar anlarında açıklayıcı mimari ipuçları, risk notları ve teknik gerekçeler ekranda açık kalır. 
                Süre kısıtı yoktur, sakin öğrenme sağlar.
              </p>
            </div>

            <div className="mt-4 flex items-center space-x-2 font-mono text-[11px] text-[#9CA3AF]">
              <span className="font-bold text-[#6366F1]">[✓]</span>
              <span>Mimari İpuçları Açık</span>
              <span className="text-white/20">•</span>
              <span>Sayaç Baskısı Yok</span>
            </div>
          </button>

          {/* Experienced Mode */}
          <button
            type="button"
            onClick={() => handleSelectLevel('experienced')}
            className={`flex flex-col justify-between rounded-[8px] border p-4 text-left transition ${
              selectedLevel === 'experienced'
                ? 'border-[#EF4444] bg-[#EF4444]/10 glow-sev1'
                : 'border-[#1F2937] bg-[#111827] hover:border-[#374151]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 font-mono text-xs font-bold text-[#EF4444]">
                  <Zap className="h-3.5 w-3.5" />
                  <span>DENEYİMLİ MÜHENDİS</span>
                </span>
                <span className="rounded-[4px] border border-[#EF4444]/40 bg-[#EF4444]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#EF4444]">
                  Stres Modu (60s)
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-[#F9FAFB]">
                60 Saniyelik Sayaç Baskısı & Salt Telemetri
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">
                Mimari ipuçları tamamen gizlenir. Gerçek kriz odası gibi 60 saniyelik geri sayım sayacı çalışır. 
                Sadece loglara ve metrik verilerine dayanarak karar ver!
              </p>
            </div>

            <div className="mt-4 flex items-center space-x-2 font-mono text-[11px] text-[#EF4444]">
              <Timer className="h-3.5 w-3.5 animate-pulse" />
              <span>60s Acil Karar Sayacı Aktif</span>
              <span className="text-white/20">•</span>
              <span>İpuçları Gizli</span>
            </div>
          </button>
        </div>
      </div>

      {/* Socratic Mentor Info Preview */}
      <div className="mb-6 flex items-start space-x-3 rounded-[6px] border border-[#6366F1]/30 bg-[#6366F1]/5 p-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-[#6366F1]/50 bg-[#6366F1]/20 text-[#6366F1]">
          <Terminal className="h-3.5 w-3.5" />
        </div>
        <p className="text-xs leading-relaxed text-[#9CA3AF]">
          <strong className="text-[#F9FAFB]">Sokratik AI Mentor Ekranın Altında Hazır:</strong> Simülasyon boyunca dilediğin an soru sorabilirsin. 
          Mentor doğrudan cevabı vermez; kıdemli bir mimar gibi seni kök neden analizine ve doğru karara götürecek yönlendirici sorular sorar.
        </p>
      </div>

      {/* CTA Button: Kriz Odasına Bağlan [CANLI] */}
      <button
        onClick={handleConnect}
        className="group relative flex w-full items-center justify-center space-x-3 rounded-[4px] bg-[#6366F1] px-6 py-3.5 font-mono text-sm font-bold tracking-wider uppercase text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition hover:bg-[#4F46E5] active:scale-[0.99]"
      >
        <span>Kriz Odasına Bağlan [CANLI]</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="mt-3 text-center font-mono text-[11px] text-[#6B7280]">
        3 Karar Noktası (Mimari → Test → KVKK/PCI-DSS) • 2 Farklı Son (Kurtarma veya Ağır İhlal)
      </p>
    </div>
  );
};
