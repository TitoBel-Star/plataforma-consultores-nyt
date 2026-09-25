
const fs = require("fs");
let appJs = fs.readFileSync("diagnostico/app.js", "utf8");

// We need to inject a button that goes to /portal/
const oldButtons = `<a href="/" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i className="fas fa-home mr-2"></i> Regresar al Inicio</a>`;
const newButtons = `<a href="/portal/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i className="fas fa-arrow-right mr-2"></i> Ir al Portal / Contratar</a>` + oldButtons;

appJs = appJs.replace(oldButtons, newButtons);
fs.writeFileSync("diagnostico/app.js", appJs, "utf8");
console.log("Portal button added to diagnostic end!");

