import NextImage from "next/image";

const Image = ({
  alt = "",
  width = "100%",
  height = "100%",
  src = "",
  aRatio = "1 / 1",
  priority = false,
}) => {
  const urlPrefix = src.slice(0, 4) === "http" ? "" : "/";
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        aspectRatio: aRatio,
      }}
    >
      <NextImage alt={alt} src={urlPrefix + src} priority layout="fill" />
    </div>
  );
};

export default Image;
