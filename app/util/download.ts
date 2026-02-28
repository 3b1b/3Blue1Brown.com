import { toJpeg } from "html-to-image";
import { slugify } from "~/util/string";

// download url as file
const download = (
  // url to download
  url: string,
  // filename, without extension
  filename: string,
  // extension, without dot
  ext: string,
) => {
  // add extension
  if (!filename.endsWith("." + ext)) filename += "." + ext;

  // trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = slugify(filename);
  link.click();
  window.URL.revokeObjectURL(url);
};

// make url from blob
const getUrl = (
  // blob data to download
  data: BlobPart,
  // mime type
  type: string,
) =>
  typeof data === "string" && data.startsWith("data:")
    ? data
    : window.URL.createObjectURL(new Blob([data], { type }));

// download blob as jpg
export const downloadJpg = async (element: Element, filename: string) => {
  try {
    // @ts-expect-error typing says lib funcs don't support svg elements, but in practice it does
    const blob = await toJpeg(element);
    download(getUrl(blob, "image/jpeg"), filename, "jpg");
  } catch (error) {
    console.error(error);
  }
};
