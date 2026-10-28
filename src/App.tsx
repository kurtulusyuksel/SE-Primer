import React, { useState, useEffect } from 'react';
import { GameScreen, UserLevel, DecisionChoice, DecisionRecord, OutcomeType, StepId } from './types/simulation';
import { CRISIS_SCENARIOS } from './data/scenarios';
import { TopStatusBar } from './components/TopStatusBar';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DecisionHub } from './components/DecisionHub';
import { IncidentTerminal, IncidentLogItem } from './components/IncidentTerminal';
import { SocratesWidget } from './components/SocratesWidget';
import { PostMortemScreen } from './components/PostMortemScreen';
import { soundManager } from './utils/audio';

const INITIAL_LOGS: IncidentLogItem[] = [
  {
    id: 'l-0',
    timestamp: '00:00:01.002',
    level: 'INFO',
    tag: 'TRAFFIC_MONITOR',
    message: 'Black Friday sale campaign opened globally. RPS jumping from 1,200 to 42,500 RPS.',
  },
  {
    id: 'l-1',
    timestamp: '00:00:04.221',
    level: 'WARN',
    tag: 'HTTP_GATEWAY',
    message: 'Upstream payment cluster latency spiked to 1,850ms. p99 SLA breached (>250ms).',
  },
  {
    id: 'l-2',
    timestamp: '00:00:08.840',
    level: 'ERROR',
    tag: 'DB_CONNECTION',
    message: 'HikariCP connection pool saturated: 98/100 active connections in use. Waiting queue: 4,120.',
  },
  {
    id: 'l-3',
    timestamp: '00:00:14.390',
    level: 'FATAL',
    tag: 'PG_DEADLOCK',
    message: 'SEV-1 ALERT: Deadlock detected in table "orders_v2". Transaction rollback rate %38.4.',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('onboarding');
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Partial<Record<StepId, DecisionChoice['id']>>>({});
  const [decisionRecords, setDecisionRecords] = useState<DecisionRecord[]>([]);
  const [currentStepChoice, setCurrentStepChoice] = useState<DecisionChoice | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [incidentLogs, setIncidentLogs] = useState<IncidentLogItem[]>(INITIAL_LOGS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Each decision in Experienced Mode has its own 60-second timer.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (currentScreen === 'crisis' && userLevel === 'experienced' && !currentStepChoice && countdownSeconds > 0) {
      interval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            soundManager.playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [currentScreen, userLevel, currentStepIndex, currentStepChoice]);

  const handleStartSimulation = (level: UserLevel) => {
    setUserLevel(level);
    setCurrentScreen('crisis');
    setCurrentStepIndex(0);
    setSelectedChoices({});
    setDecisionRecords([]);
    setCurrentStepChoice(null);
    setCountdownSeconds(60);
    setIncidentLogs(INITIAL_LOGS);
  };

  const handleRestart = () => {
    setCurrentScreen('onboarding');
    setCurrentStepIndex(0);
    setSelectedChoices({});
    setDecisionRecords([]);
    setCurrentStepChoice(null);
    setCountdownSeconds(60);
    setIncidentLogs(INITIAL_LOGS);
  };

  const currentScenario = CRISIS_SCENARIOS[currentStepIndex];

  const handleMakeChoice = (choice: DecisionChoice) => {
    setIsProcessing(true);
    setCurrentStepChoice(choice);

    // Save choice in state
    setSelectedChoices((prev) => ({
      ...prev,
      [currentScenario.id]: choice.id,
    }));

    // Record decision for post-mortem trace
    const record: DecisionRecord = {
      stepId: currentScenario.id,
      stepTitle: currentScenario.title,
      choiceId: choice.id,
      choiceTitle: choice.title,
      consequenceSummary: choice.consequenceSummary,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      impactScore: choice.id === 'A' ? 100 : 0,
    };
    setDecisionRecords((prev) => [...prev, record]);

    // Append consequence logs into terminal
    const newLogs: IncidentLogItem[] = choice.logsTriggered.map((l, idx) => ({
      id: `choice-log-${Date.now()}-${idx}`,
      timestamp: l.timestamp,
      level: l.level,
      tag: l.tag,
      message: l.message,
    }));

    setIncidentLogs((prev) => [...prev, ...newLogs]);
    setIsProcessing(false);
  };

  const handleProceedNext = () => {
    if (currentStepIndex < CRISIS_SCENARIOS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentStepChoice(null);
      setCountdownSeconds(60);
    } else {
      // Reached end of simulation -> evaluate outcome
      setCurrentScreen('result');
      if (soundEnabled) {
        const isGood = evaluateOutcome() === 'outcome_a';
        if (isGood) soundManager.playSuccess();
        else soundManager.playCriticalBreach();
      }
    }
  };

  // Any B choice represents a failed intervention and results in Son B.
  const evaluateOutcome = (): OutcomeType => {
    return Object.values(selectedChoices).includes('B') ? 'outcome_b' : 'outcome_a';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#F9FAFB] flex flex-col justify-between selection:bg-[#6366F1] selection:text-white">
      {/* Top Navigation & Live Telemetry Bar */}
      <TopStatusBar
        currentScreen={currentScreen}
        userLevel={userLevel}
        countdownSeconds={countdownSeconds}
        currentStepNumber={currentStepIndex + 1}
        totalSteps={CRISIS_SCENARIOS.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(soundManager.toggleSound())}
        onRestart={handleRestart}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onStart={handleStartSimulation} />
        )}

        {currentScreen === 'crisis' && currentScenario && (
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
            {/* Desktop 2-Column Layout / Mobile Stacked Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Decision Hub (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <DecisionHub
                  currentScenario={currentScenario}
                  userLevel={userLevel}
                  onMakeChoice={handleMakeChoice}
                  isProcessing={isProcessing}
                  selectedChoice={currentStepChoice}
                  onProceedNext={handleProceedNext}
                  isLastStep={currentStepIndex === CRISIS_SCENARIOS.length - 1}
                />
              </div>

              {/* Right Column: Live Incident Terminal & Telemetry (5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-4">
                <IncidentTerminal
                  logs={incidentLogs}
                  highlightSeverity={currentScenario.sevLevel === 'SEV-1'}
                />

                {/* Tactical Incident Status Helper */}
                <div className="rounded-[8px] border border-[#1F2937] bg-[#111827] p-3 text-xs font-mono text-[#9CA3AF]">
                  <div className="flex items-center justify-between border-b border-[#1F2937] pb-1.5 mb-2">
                    <span className="text-[#F9FAFB] font-bold">KONSOL DURUMU:</span>
                    <span className="text-[#10B981]">[TELEMETRİ AKTİF]</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Sistem durumu: <span className="text-[#EF4444]">Muhteşem Cuma Kriz Odası</span>. 
                    Seçtiğiniz her müdahale kararı anında yukarıdaki olay terminaline ve servis telemetrisine yansır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'result' && (
          <PostMortemScreen
            outcome={evaluateOutcome()}
            decisions={decisionRecords}
            userLevel={userLevel}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Bottom Sticky Socratic AI Tutor (Socrates Core) */}
      <SocratesWidget
        currentStepId={currentScenario ? currentScenario.id : 'step1'}
        userLevel={userLevel}
        selectedChoices={selectedChoices}
      />
    </div>
  );
}
