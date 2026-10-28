export type UserLevel = 'beginner' | 'experienced';

export type GameScreen = 'onboarding' | 'crisis' | 'result';

export type StepId = 'step1' | 'step2' | 'step3';

export type OutcomeType = 'outcome_a' | 'outcome_b';

export interface DecisionChoice {
  id: 'A' | 'B';
  title: string;
  badge: string;
  description: string;
  hint?: string; // Visible in beginner mode
  riskNote?: string;
  technicalImpact: string;
  consequenceSummary: string;
  logsTriggered: Array<{
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    tag: string;
    message: string;
  }>;
}

export interface DecisionStep {
  id: StepId;
  stepNumber: number;
  totalSteps: number;
  category: 'MİMARİ' | 'TEST' | 'KVKK & PCI-DSS';
  title: string;
  incidentSubtitle: string;
  contextDescription: string;
  sevLevel: 'SEV-1' | 'SEV-2';
  metricsBefore: {
    rps: string;
    p99: string;
    dbPool: string;
    errorRate: string;
    activeThreads: number;
  };
  choices: [DecisionChoice, DecisionChoice];
}

export interface DecisionRecord {
  stepId: StepId;
  stepTitle: string;
  choiceId: 'A' | 'B';
  choiceTitle: string;
  consequenceSummary: string;
  timestamp: string;
  impactScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'socrates';
  text: string;
  timestamp: string;
  isSocraticQuestion?: boolean;
}
