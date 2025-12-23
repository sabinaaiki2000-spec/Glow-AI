export interface ParsedAnalysis {
  analysisSummary: string;
  enhancementOpportunities: string;
  visualDescription: string;
  transformationPlan: string;
  motivationalClosing: string;
  rawText: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export enum Tab {
  ANALYSIS = 'ANALYSIS',
  VISUALIZE = 'VISUALIZE',
  PLAN = 'PLAN'
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}
