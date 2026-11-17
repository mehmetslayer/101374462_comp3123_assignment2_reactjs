// turns an axios error into a short message that is safe to show the user
export default function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) {
    return 'Cannot reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;
  if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
  if (status >= 500) return 'The server had a problem. Please try again later.';

  if (Array.isArray(data?.errors) && data.errors.length) {
    return [...new Set(data.errors.map((e) => e.message))].join('. ');
  }
  return typeof data?.message === 'string' ? data.message : fallback;
}