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
    subtitle: 'Indias First App for Only Verified Students, No Family member watching here!',
  },
  {
    id: '2',
    title: 'Verified you, private them',
    subtitle: "Prove you're a real student. Post under your chosen persona, not your real name.",
  },
  {
    id: '3',
    title: 'The Campus Watercooler',
    subtitle: "Real-time rants, events, memes, and academic help. See what's happening right now.",
  },
  {
    id: '4',
    title: 'Unfiltered & Fun',
    subtitle: 'No toxicity. Just your college crew. Go cause some trouble (the good kind).',
  },
];