export const inr = (n) => `₹${Number(n || 0).toFixed(2)}`;
export const dateTime = (s) => new Date(s).toLocaleString('en-IN', {
  dateStyle: 'medium', timeStyle: 'short',
});