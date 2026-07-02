// constants/OnboardingData.ts
export interface Slide {
  id: string;
  title: string;
  subtitle: string;
}

// 👇 Edit these 4 slides whenever you want! Change text, add more, remove some.
export const slides: Slide[] = [
  {
    id: '1',
    title: 'No Aunties Allowed',
    subtitle: 'Your campus. Your rules. No family, no relatives, no judges.',
  },
  {
    id: '2',
    title: 'Verified You, Private Them',
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