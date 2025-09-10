const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

// Files you want to modify
// const files = ["id-card.html", "travel-visa.html"];
const files = ["utility-bill.html", "bank-statement.html","business-bank-statement.html","business-utility-bill.html","certificate.html","credit-card.html","driving-license-photolook.html","driving-license.html","id-card-photolook.html","passport-photolook.html","passport.html","residence-permit.html","travel-visa.html"];

// Menu template
const menuTemplate = `
<div class="nav-menu"> 
  <a href="./index.html#home">Home</a>
  <a href="./index.html#about">About Us</a>
  <a href="./index.html#services">Services</a>
  <a href="./index.html#specialties">Our Specialties</a>
  <a href="./index.html#gallery">Gallery</a>
  <a href="./index.html#contactus">Contact us</a>
  <a href="../utility-bill.html">Utility Bill</a>
  <a href="../driving-license.html">Driving License</a>
  <a href="../bank-statement.html">Bank Statement</a>
  <a href="../id-card.html">ID Card</a>
  <a href="../passport.html">Passport</a>
  <a href="../certificate.html">Certificate</a>
  <a href="../driving-license-photolook.html">Driving License Photolook</a>
  <a href="../business-utility-bill.html">Business Utility Bill</a>
  <a href="../travel-visa.html">Travel Visa</a>
  <a href="../credit-card.html">Credit Card</a>
  <a href="../id-card-photolook.html">ID Card Photolook</a>
  <a href="../business-bank-statement.html">Business Bank Statement</a>
  <a href="../residence-permit.html">Residence Permit</a>
  <a href="../passport-photolook.html">Passport Photolook</a>
  <a href="../mix.html">Mix</a> 
</div>
`;

// Extra CSS to inject
const extraCSS = `
.mastbody.menu-open { 
  margin-top: 1300px;
}

.nav-menu {
  flex-wrap: wrap;
}
`;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let html = fs.readFileSync(filePath, "utf-8");

  const $ = cheerio.load(html);

  // 1. Add CSS inside <style> (append to first <style> found)
  let styleTag = $("style").first();
  if (styleTag.length > 0) {
    styleTag.append(extraCSS);
  } else {
    $("head").append(`<style>${extraCSS}</style>`);
  }

  // 2. Find which <a> has class="highlight"
  let highlightedHref = $(".nav-menu a.highlight").attr("href");

  // 3. Replace nav-menu div with new menu template
  $(".nav-menu").replaceWith(menuTemplate);

  // 4. Restore highlight class on correct link
  if (highlightedHref) {
    $(`.nav-menu a[href="${highlightedHref}"]`).addClass("highlight");
  }

  // Write back file
  fs.writeFileSync(filePath, $.html(), "utf-8");
  console.log(`✅ Updated ${file}`);
});
