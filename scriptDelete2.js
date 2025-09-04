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

// Process each file in the folder
fs.readdirSync(folderPath).forEach((file) => {
  const filePath = path.join(folderPath, file);

  // Only process .html files
  if (path.extname(file) !== ".html") return;

  let html;
  try {
    html = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("Error reading file:", filePath, err.message);
    return;
  }

  const $ = cheerio.load(html);

  // Find img inside div.generatedImage
  $("div.generatedImage img").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.includes("https://alaweermarket.com/")) {
      const newSrc = src.replace("https://alaweermarket.com/", ".");
      $(el).attr("src", newSrc);
    }
  });

  // Save changes back to same file
  fs.writeFileSync(filePath, $.html(), "utf8");
  console.log(`✅ Updated: ${file}`);
});

console.log("🎉 All HTML files processed!");
