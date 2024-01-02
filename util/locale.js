// format date to string in appropriate locale
export const formatDate = (dateString) => {
  const localDate = new Date(
    new Date(dateString).getTime() + new Date().getTimezoneOffset() * 60000
  );

  try {
    let locale;
    if (typeof window !== "undefined") locale = window?.navigator?.language;
    else locale = "en-US";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(localDate).toLocaleDateString(locale, options);
  } catch (error) {
    return new Date(localDate).toLocaleDateString();
  }
};
