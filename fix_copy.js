
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const regex = /<h3 class="text-3xl font-extrabold mb-10 text-center text-white">.*?<\/h3>/g;
const replacement = `<h3 class="text-3xl font-extrabold mb-10 text-center text-white">El antídoto exacto para sus fugas operativas. Conozca nuestros ecosistemas tecnológicos:</h3>`;

if (regex.test(html)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync("index.html", html, "utf8");
    console.log("Text replaced successfully!");
} else {
    console.log("Text not found.");
}

