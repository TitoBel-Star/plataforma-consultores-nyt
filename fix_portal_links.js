
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

html = html.replace(/http:\/\/localhost:5173\/portal\?phase=1/g, "/portal/?phase=1");
html = html.replace(/http:\/\/localhost:5173\/portal\?phase=2/g, "/portal/?phase=2");
html = html.replace(/http:\/\/localhost:5173\/portal\?phase=3/g, "/portal/?phase=3");
html = html.replace(/http:\/\/localhost:5173\/portal\?phase=4/g, "/portal/?phase=4");
html = html.replace(/http:\/\/localhost:5173\/portal\?phase=custom/g, "/portal/?phase=custom");

// Actually, in the history I originally set them to `https://portal.nytex.com/` as a placeholder! 
// Let me check if they were changed to localhost by the user. Yes, they were.
// Let us replace them all with `/portal/?phase=X`
fs.writeFileSync("index.html", html, "utf8");
console.log("Portal links updated!");

