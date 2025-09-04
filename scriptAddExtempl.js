const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio"); // npm install cheerio

// --- STEP 0: Get folder argument ---
const folderArg = process.argv[2];
if (!folderArg) {
  console.error("❌ Please provide a folder name, e.g. node updateHref.js folderforfiles");
  process.exit(1);
}

const folderPath = path.join(__dirname, folderArg);
const newHref = "https://extempl.com/product-category/driving-license-photoshop-examples/";

// --- STEP 1: Check if folder exists ---
if (!fs.existsSync(folderPath)) {
  console.error(`❌ Folder '${folderArg}' not found.`);
  process.exit(1);
}

// --- STEP 2: Get all .html files ---
const htmlFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.error("⚠️ No HTML files found in the folder.");
  process.exit(1);
}

// --- STEP 3: Process each file ---
htmlFiles.forEach(file => {
  const filePath = path.join(folderPath, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const $ = cheerio.load(content);

  // Find div with the specific style
  const targetDiv = $('div[style="width: 100%;margin-bottom: 7%;"]');
  if (targetDiv.length) {
    const aTag = targetDiv.find("a");
    if (aTag.length) {
      aTag.attr("href", newHref);
      fs.writeFileSync(filePath, $.html(), "utf-8");
      console.log(`✅ Updated href in ${file}`);
    }
  }
});

console.log("🎉 All matching <a> tags updated successfully!");
