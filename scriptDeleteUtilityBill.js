// save this as fixImages.js
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node fixImages.js <folder>");
  process.exit(1);
}

const folder = process.argv[2];

// go through files in the given folder
fs.readdir(folder, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folder, file);

    // only process HTML files
    if (file.endsWith(".html")) {
      let content = fs.readFileSync(filePath, "utf8");

      // regex: look for <div class="generatedImage"> ... <img src="./utility-bill/...">
      const updated = content.replace(
        /(<div[^>]*class=["']generatedImage["'][^>]*>[\s\S]*?<img[^>]*src=["'])(\.\/)utility-bill(\/[^"']*["'][^>]*>)/g,
        (_, before, dotSlash, after) => before + dotSlash + "driving-license" + after
      );

      if (updated !== content) {
        fs.writeFileSync(filePath, updated, "utf8");
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`ℹ️ No changes: ${file}`);
      }
    }
  });
});
