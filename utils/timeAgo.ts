const timeAgo = (date: string): string => {
  const now = new Date();
  const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;

  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)} seconds ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast < 604800) {
    // 7 * 86400
    return `${Math.floor(secondsPast / 86400)} days ago`;
  }
  if (secondsPast < 2592000) {
    // 30 * 86400
    return `${Math.floor(secondsPast / 604800)} weeks ago`;
  }
  if (secondsPast < 31104000) {
    // 12 * 2592000
    return `${Math.floor(secondsPast / 2592000)} months ago`;
  }
  return `${Math.floor(secondsPast / 31104000)} years ago`;
};

export default timeAgo;
