import { FiActivity, FiShield, FiZap, FiDatabase } from 'react-icons/fi';

export const features = [
  {
    id: 1,
    title: 'Instant Analysis',
    description: 'Upload your blood report and get a comprehensive breakdown within seconds using advanced AI models.',
    icon: FiZap,
  },
  {
    id: 2,
    title: 'Personalized Health Score',
    description: 'Understand your overall well-being with a single, easy-to-read metric based on key biomarkers.',
    icon: FiActivity,
  },
  {
    id: 3,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and processed with strict privacy standards. We never share your reports.',
    icon: FiShield,
  },
  {
    id: 4,
    title: 'Historical Tracking',
    description: 'Keep all your past reports in one place and track how your parameters change over time.',
    icon: FiDatabase,
  }
];
