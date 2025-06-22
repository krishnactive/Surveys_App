export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
};

export const getPollBookmarked = (pollId, userBookmarks = []) => {
  return userBookmarks.includes(pollId);
};  