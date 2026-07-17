// data/filters.js
// The pill filter list shown under the rivalry bar. `id` is what gets passed
// to fetchFeedByFilter() and matched against each post's `tags` array -
// add, remove, or rename filters here and the whole app follows.

export const FILTERS = [
  { id: 'following', label: 'Following' },
  { id: 'social_event', label: 'Social Event' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'clubs', label: 'Clubs' },
];
