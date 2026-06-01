import sharp from "sharp";

const width = 1200;
const height = 630;

await sharp("public/og.svg")
  .resize(width, height, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile("public/og.png");

const meta = await sharp("public/og.png").metadata();
console.log(`Generated public/og.png (${meta.width}x${meta.height})`);
