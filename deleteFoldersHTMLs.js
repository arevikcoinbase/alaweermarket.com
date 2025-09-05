// deleteHtml.js
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("❌ Usage: node deleteHtml.js <folder>");
  process.exit(1);
}

const folder = process.argv[2];
const folderPath = path.resolve(folder);

if (!fs.existsSync(folderPath)) {
  console.error("❌ Folder not found:", folderPath);
  process.exit(1);
}

const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".html"));

if (files.length === 0) {
  console.log("ℹ️ No .html files found in", folderPath);
  process.exit(0);
}

files.forEach(file => {
  const filePath = path.join(folderPath, file);
  fs.unlinkSync(filePath);
  console.log("🗑️ Deleted:", file);
});

console.log(`✅ Deleted ${files.length} .html files from ${folderPath}`);
