type RelativeDateString =
  | 'today'
  | 'yesterday'
  | `${number} days ago`
  | `${number} week${'' | 's'} ago`
  | `${number} month${'' | 's'} ago`
  | `${number} year${'' | 's'} ago`;

function formatRelativeDate(input: Date | number | string): RelativeDateString {
  const date = parseDate(input);
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 0) {
    return 'today';
  } else if (daysDiff === 1) {
    return 'yesterday';
  } else if (daysDiff < 7) {
    return `${daysDiff} days ago`;
  } else if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);

    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);

    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(daysDiff / 365);

    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

function parseDate(input: Date | number | string): Date {
  if (input instanceof Date) {
    return input;
  }
  if (typeof input === 'number') {
    return new Date(input);
  }
  const parsedDate = new Date(input);

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date input');
  }

  return parsedDate;
}

// Export for use in module systems
export { formatRelativeDate };
