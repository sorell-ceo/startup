// data/mockFeed.js
// Placeholder feed + rivalry data, shaped the way the real backend response
// is expected to look. Once the backend exists, swap MOCK_POSTS and the body
// of fetchFeedByFilter() for real API calls - HomeScreen.js doesn't need to
// change at all as long as the shape stays the same.

export const MOCK_POSTS = [
  {
    id: 'post-1',
    promoted: false,
    tags: ['following', 'social_event'], // which filter pill(s) this post shows under
    user: {
      name: 'Kinjal Sharma',
      handle: '@kinjalsharmaa',
      avatar: null, // placeholder - drop a real image uri here
      verified: true,
    },
    location: 'The Mall Road',
    date: '23 December 2025',
    media: null, // placeholder - drop a real image/video uri here
    caption: 'Feathers and Frost: A cozy winter goodbye. Farewell 2K26...',
    stats: { likes: 125000, comments: 125000, shares: 125000, saves: 125000 },
  },
  {
    id: 'post-2',
    promoted: true,
    tags: ['following', 'social_event', 'hackathons', 'clubs'], // ads can show under every filter
    user: {
      name: 'Meta',
      handle: '@metaofficial',
      avatar: null,
      verified: true,
    },
    location: 'Bangalore, Tech Valley',
    date: 'Yesterday',
    media: null,
    caption: 'You can improve your business sales and marketing with Meta Ads...',
    stats: { likes: 125000, comments: 125000, shares: 125000, saves: 125000 },
  },
];

// Stand-in for the real network call. Keep this same function signature when
// you wire up the backend - just swap the body for a fetch()/axios call, e.g:
//
//   export async function fetchFeedByFilter(filterId) {
//     const res = await fetch(`${API_BASE_URL}/feed?tag=${filterId}`);
//     return res.json();
//   }
export async function fetchFeedByFilter(filterId) {
  await new Promise((resolve) => setTimeout(resolve, 250)); // simulated network delay
  if (filterId === 'following') return MOCK_POSTS;
  return MOCK_POSTS.filter((post) => post.tags.includes(filterId));
}

// Rivalry bar data - swap for a live API response with the same shape.
export const MOCK_RIVALRY = {
  left: {
    label: 'Chandigarh University',
    percent: 70,
    count: 3500,
    status: 'Keep Pushing!',
  },
  right: {
    label: 'Amity Mohali',
    percent: 30,
    count: 1500,
    status: 'Comeback?',
  },
  topPercentBadge: "You're among Top 5% of Your Campus",
};
