export const storyKeys = {
  all: ['stories'],
  // Remove isKid from dashboard query key as we now filter on the client
  dashboard: (userId) => ['stories', 'dashboard', userId],
  detail: (slug) => ['stories', 'detail', slug],
  saved: (userId) => ['stories', 'saved', userId],
  read: (userId) => ['stories', 'read', userId],
  ratings: (storyId) => ['stories', 'ratings', storyId],
};

export const userKeys = {
  profile: (userId) => ['user', 'profile', userId],
  savedWords: (userId, filters) => ['user', 'savedWords', userId, filters],
  wordCategories: (userId) => ['user', 'wordCategories', userId],
  stats: (userId) => ['user', 'stats', userId],
  streak: (userId) => ['user', 'streak', userId],
  activity: (userId) => ['user', 'activity', userId],
};

export const lessonKeys = {
  all: ['lessons'],
  categories: (level) => ['lessons', 'categories', level],
  list: (categoryId) => ['lessons', 'list', categoryId],
  detail: (lessonId) => ['lessons', 'detail', lessonId],
  progress: (userId) => ['lessons', 'progress', userId],
  notes: (lessonId, userId) => ['lessons', 'notes', lessonId, userId],
};

export const adminKeys = {
  all: ['admin'],
  users: ['admin', 'users'],
  stories: ['admin', 'stories'],
  lessons: ['admin', 'lessons'],
  testimonials: ['admin', 'testimonials'],
  announcements: ['admin', 'announcements'],
  blogPosts: ['admin', 'blogPosts'],
};

export const blogKeys = {
  all: ['blog'],
  posts: (page, limit) => ['blog', 'posts', page, limit],
  detail: (slug) => ['blog', 'detail', slug],
};

export const communityKeys = {
  all: ['community'],
  posts: (feedType, topicId) => ['community', 'posts', feedType, topicId],
  post: (postId) => ['community', 'post', postId],
  comments: (postId) => ['community', 'comments', postId],
  topics: ['community', 'topics'],
  discover: ['community', 'discover'],
};