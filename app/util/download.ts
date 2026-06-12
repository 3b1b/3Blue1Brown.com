// download url as file
export const download = (url: string, filename: string, ext: string) => {
  if (!filename.endsWith("." + ext)) filename += "." + ext;
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// make url to download
const getUrl = (data: BlobPart, type: string) =>
  typeof data === "string" && data.startsWith("data:")
    ? data
    : window.URL.createObjectURL(new Blob([data], { type }));

// download string as text file
export const downloadTxt = (data: string, filename: string) =>
  download(getUrl(data, "text/plain"), filename, "txt");
