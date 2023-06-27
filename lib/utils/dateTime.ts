export const formatDate = (date: string) => (new Date(date))
.toLocaleDateString(
  'en-US',
  {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
)