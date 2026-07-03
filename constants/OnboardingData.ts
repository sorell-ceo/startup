// constants/OnboardingData.ts
export interface Slide {
  id: string;
  title: string;
  subtitle: string;
}

export const slides: Slide[] = [
  {
    id: '1',
    title: 'YappOut',
    subtitle: 'Only place to Yapp Out securely. \n No Family or Faculty allowed.',
  },
  {
    id: '2',
    title: 'All Verified & \n Safe Accounts',
    subtitle: "Only Verified Students. \n No Fake Accounts",
  },
  {
    id: '3',
    title: 'The Campus Watercooler',
    subtitle: "All rants, events, and memes. See what's happening right now.",
  },
  {
    id: '4',
    title: 'Unfiltered & Fun',
    subtitle: 'No toxicity. Just your college crew. Go cause some trouble (the good kind).',
  },
];