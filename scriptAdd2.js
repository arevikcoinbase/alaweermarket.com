const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Get folder name from command-line argument
const folderName = process.argv[2];
if (!folderName) {
  console.error("Usage: node script.js <folderName>");
  process.exit(1);
}

const folderPath = path.resolve(folderName);

// Check if folder exists
if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
  console.error("❌ Folder does not exist:", folderPath);
  process.exit(1);
}

// Process each .html file in the folder
fs.readdirSync(folderPath).forEach((file) => {
  const filePath = path.join(folderPath, file);

  if (path.extname(file) !== ".html") return; // only process .html

  let html;
  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("❌ Error reading file:", filePath, err.message);
    return;
  }

  const $ = cheerio.load(html);

  // Find <img> inside <div class="generatedImage">
  $("div.generatedImage img").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.startsWith("./")) {
      const newSrc = src.replace("./", "https://alaweermarket.com/");
      $(el).attr("src", newSrc);
    }
  });

  // Write back updated HTML
  fs.writeFileSync(filePath, $.html(), "utf8");
  console.log(`✅ Updated: ${file}`);
});

console.log("🎉 All HTML files processed!");
