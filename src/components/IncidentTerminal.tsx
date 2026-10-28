import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Bug, Copy, Check } from 'lucide-react';

export interface IncidentLogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  tag: string;
  message: string;
}

interface IncidentTerminalProps {
  logs: IncidentLogItem[];
  highlightSeverity?: boolean;
}

export const IncidentTerminal: React.FC<IncidentTerminalProps> = ({ logs, highlightSeverity = false }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARN'>('ALL');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'CRITICAL') return log.level === 'FATAL' || log.level === 'ERROR';
    if (filter === 'WARN') return log.level === 'WARN' || log.level === 'FATAL' || log.level === 'ERROR';
    return true;
  });

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.level}] [${l.tag}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level: IncidentLogItem['level']) => {
    switch (level) {
      case 'FATAL':
        return <span className="bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 px-1 py-0.2 rounded-[2px] font-bold">FATAL</span>;
      case 'ERROR':
        return <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 px-1 py-0.2 rounded-[2px]">ERROR</span>;
      case 'WARN':
        return <span className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-1 py-0.2 rounded-[2px]">WARN</span>;
      default:
        return <span className="bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 px-1 py-0.2 rounded-[2px]">INFO</span>;
    }
  };

  return (
    <div className="flex flex-col rounded-[8px] border border-[#1F2937] bg-[#0A0F1D] shadow-xl overflow-hidden">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between border-b border-[#1F2937] bg-[#111827] px-3 py-2">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-[#6366F1]" />
          <span className="font-mono text-xs font-semibold text-[#F9FAFB]">
            CANLI OLAY TERMİNALİ (INCIDENT STREAM)
          </span>
          <span className="hidden font-mono text-[10px] text-[#9CA3AF] sm:inline">
            // pod/payment-consumer-v2
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Filters */}
          <div className="flex items-center space-x-1 font-mono text-[10px]">
            <button
              onClick={() => setFilter('ALL')}
              className={`rounded-[3px] px-1.5 py-0.5 transition ${
                filter === 'ALL' ? 'bg-[#6366F1] text-white font-bold' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
              }`}
            >
              HEPSİ
            </button>
            <button
              onClick={() => setFilter('CRITICAL')}
              className={`rounded-[3px] px-1.5 py-0.5 transition ${
                filter === 'CRITICAL' ? 'bg-[#EF4444] text-white font-bold' : 'text-[#9CA3AF] hover:text-[#EF4444]'
              }`}
            >
              ALARM
            </button>
          </div>

          <button
            onClick={handleCopy}
            title="Logları Kopyala"
            className="flex items-center space-x-1 rounded-[3px] border border-[#1F2937] bg-[#0A0F1D] px-1.5 py-0.5 font-mono text-[10px] text-[#9CA3AF] transition hover:text-white"
          >
            {copied ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="relative max-h-56 min-h-[160px] overflow-y-auto p-3 font-mono text-xs text-[#9CA3AF] sm:max-h-64 sm:text-[12.5px] leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-[#6B7280]">Log akışı bekleniyor...</div>
        ) : (
          filteredLogs.map((log) => {
            const isFatal = log.level === 'FATAL';
            const isDoubleCharge = log.message.includes('Double Charge') || log.message.includes('çift çekim');
            const isBreach = log.message.includes('RAW CARD') || log.message.includes('EXPOSED');

            return (
              <div
                key={log.id}
                className={`flex flex-col py-1 transition-colors border-b border-[#1F2937]/30 sm:flex-row sm:items-start sm:space-x-2 ${
                  isFatal
                    ? 'bg-[#EF4444]/10 text-[#FCA5A5] px-1.5 rounded-[3px]'
                    : isDoubleCharge
                    ? 'bg-[#EF4444]/20 text-red-200 border-l-2 border-[#EF4444] px-1.5'
                    : isBreach
                    ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 px-1.5'
                    : 'hover:bg-[#111827]/60'
                }`}
              >
                <div className="flex shrink-0 items-center space-x-1.5 text-[11px] text-[#6B7280]">
                  <span>{log.timestamp}</span>
                  {getLevelBadge(log.level)}
                  <span className="text-[#38BDF8]">[{log.tag}]</span>
                </div>
                <div className="mt-0.5 break-all sm:mt-0 font-medium">
                  {log.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Command prompt footer */}
      <div className="flex items-center border-t border-[#1F2937] bg-[#0A0F1D] px-3 py-1.5 font-mono text-xs text-[#6B7280]">
        <span className="text-[#10B981] mr-2">kriz-komuta $</span>
        <span className="text-[#9CA3AF] animate-pulse">tail -f /var/log/payment-service/incident.log _</span>
      </div>
    </div>
  );
};
