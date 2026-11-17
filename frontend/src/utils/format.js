export const fullName = (e) => `${e.first_name} ${e.last_name}`;

export const formatSalary = (value) =>
  Number(value).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

// dates are stored as midnight UTC, so format in UTC to avoid showing the previous day
export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });