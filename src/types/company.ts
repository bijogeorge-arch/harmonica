export interface EnrichedData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  thesisMatchScore: number;
  matchExplanation: string;
  sources: { url: string; timestamp: string }[];
}

export interface Company {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  industry: string;
  employeeCount: number;
  foundedYear: number;
  lastFundingRound: string;
}

