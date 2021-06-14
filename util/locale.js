// format date to string in appropriate locale
export const formatDate = (dateString) => {
  try {
    let locale;
    if (typeof window !== "undefined") locale = window?.navigator?.language;
    else locale = "en-US";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString(locale, options);
  } catch (error) {
    return new Date(dateString).toLocaleDateString();
  }
};
