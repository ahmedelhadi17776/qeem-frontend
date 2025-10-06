export interface MarketRateData {
  skill: string;
  rate: number;
  demand: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

export interface RegionalRateData {
  region: string;
  rate: number;
  currency: string;
}

export interface SkillDemandData {
  name: string;
  demand: number; // percentage
  growth: number; // percentage change
}

export interface MarketInsights {
  averageRates: MarketRateData[];
  regionalRates: RegionalRateData[];
  topSkills: SkillDemandData[];
  marketTrends: {
    totalJobs: number;
    averageRate: number;
    growthRate: number;
  };
}

export const mockMarketData: MarketInsights = {
  averageRates: [
    { skill: 'Web Development', rate: 250, demand: 'high', trend: 'up' },
    { skill: 'Mobile Development', rate: 280, demand: 'high', trend: 'up' },
    { skill: 'Backend Development', rate: 300, demand: 'high', trend: 'up' },
    { skill: 'Frontend Development', rate: 220, demand: 'high', trend: 'stable' },
    { skill: 'Full Stack Development', rate: 350, demand: 'high', trend: 'up' },
    { skill: 'UI/UX Design', rate: 200, demand: 'medium', trend: 'up' },
    { skill: 'Graphic Design', rate: 150, demand: 'medium', trend: 'stable' },
    { skill: 'DevOps', rate: 400, demand: 'medium', trend: 'up' },
    { skill: 'Data Science', rate: 450, demand: 'medium', trend: 'up' },
    { skill: 'Machine Learning', rate: 500, demand: 'medium', trend: 'up' },
    { skill: 'Digital Marketing', rate: 180, demand: 'medium', trend: 'stable' },
    { skill: 'Content Writing', rate: 120, demand: 'low', trend: 'stable' },
    { skill: 'Video Editing', rate: 200, demand: 'medium', trend: 'up' },
    { skill: 'Project Management', rate: 300, demand: 'medium', trend: 'stable' },
    { skill: 'Quality Assurance', rate: 180, demand: 'medium', trend: 'stable' },
  ],

  regionalRates: [
    { region: 'Egypt', rate: 250, currency: 'EGP' },
    { region: 'MENA', rate: 275, currency: 'EGP' },
    { region: 'Europe', rate: 450, currency: 'EUR' },
    { region: 'USA', rate: 500, currency: 'USD' },
    { region: 'UK', rate: 400, currency: 'GBP' },
    { region: 'Canada', rate: 450, currency: 'CAD' },
    { region: 'Australia', rate: 420, currency: 'AUD' },
  ],

  topSkills: [
    { name: 'React', demand: 95, growth: 15 },
    { name: 'Node.js', demand: 88, growth: 12 },
    { name: 'Python', demand: 85, growth: 18 },
    { name: 'JavaScript', demand: 92, growth: 8 },
    { name: 'TypeScript', demand: 78, growth: 25 },
    { name: 'AWS', demand: 70, growth: 20 },
    { name: 'Docker', demand: 65, growth: 22 },
    { name: 'Kubernetes', demand: 45, growth: 35 },
    { name: 'GraphQL', demand: 55, growth: 28 },
    { name: 'Next.js', demand: 60, growth: 30 },
    { name: 'Vue.js', demand: 40, growth: 10 },
    { name: 'Angular', demand: 35, growth: 5 },
    { name: 'PHP', demand: 50, growth: 2 },
    { name: 'Laravel', demand: 45, growth: 8 },
    { name: 'Django', demand: 55, growth: 12 },
  ],

  marketTrends: {
    totalJobs: 15420,
    averageRate: 275,
    growthRate: 12.5,
  },
};

// Helper functions for data manipulation
export const getSkillRates = (skillType: 'tech' | 'design' | 'marketing' | 'all' = 'all'): MarketRateData[] => {
  if (skillType === 'all') return mockMarketData.averageRates;

  const skillCategories = {
    tech: [
      'Web Development',
      'Mobile Development',
      'Backend Development',
      'Frontend Development',
      'Full Stack Development',
      'DevOps',
      'Data Science',
      'Machine Learning',
    ],
    design: ['UI/UX Design', 'Graphic Design', 'Video Editing'],
    marketing: ['Digital Marketing', 'Content Writing'],
  };

  return mockMarketData.averageRates.filter(skill => skillCategories[skillType].includes(skill.skill));
};

export const getTopSkillsByDemand = (limit: number = 10): SkillDemandData[] => {
  return mockMarketData.topSkills.sort((a, b) => b.demand - a.demand).slice(0, limit);
};

export const getFastestGrowingSkills = (limit: number = 5): SkillDemandData[] => {
  return mockMarketData.topSkills.sort((a, b) => b.growth - a.growth).slice(0, limit);
};

export const getRegionalComparison = (_baseCurrency: string = 'EGP'): RegionalRateData[] => {
  // For demo purposes, we'll return the rates as-is
  // In a real app, you'd convert currencies here
  return mockMarketData.regionalRates;
};

export const getMarketInsights = () => {
  const totalSkills = mockMarketData.averageRates.length;
  const highDemandSkills = mockMarketData.averageRates.filter(skill => skill.demand === 'high').length;
  const growingSkills = mockMarketData.averageRates.filter(skill => skill.trend === 'up').length;

  return {
    ...mockMarketData.marketTrends,
    totalSkills,
    highDemandSkills,
    growingSkills,
    averageDemandScore: Math.round(
      mockMarketData.averageRates.reduce((acc, skill) => {
        const demandScore = skill.demand === 'high' ? 3 : skill.demand === 'medium' ? 2 : 1;
        return acc + demandScore;
      }, 0) / totalSkills,
    ),
  };
};
