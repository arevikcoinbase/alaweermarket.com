const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Get filename from command-line argument
const fileName = process.argv[2];
if (!fileName) {
  console.error("Usage: node script.js <file.html>");
  process.exit(1);
}

const filePath = path.resolve(fileName);

// Read HTML file
let html;
try {
  html = fs.readFileSync(filePath, "utf8");
} catch (err) {
  console.error("Error reading file:", err.message);
  process.exit(1);
}

// Load HTML into cheerio
const $ = cheerio.load(html);

// Find all img tags with class "custome_image_class" inside div.d-flex
$("div.d-flex img.custome_image_class").each((i, el) => {
  const src = $(el).attr("src");
  if (src && src.includes("https://alaweermarket.com/")) {
    const newSrc = src.replace("https://alaweermarket.com/", ".");
    $(el).attr("src", newSrc);
  }
});

// Write updated HTML back to file
fs.writeFileSync(filePath, $.html(), "utf8");

console.log(`✅ Updated file saved: ${filePath}`);
