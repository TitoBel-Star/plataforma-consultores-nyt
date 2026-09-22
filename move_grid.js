
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const gridStartStr = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-left mt-8 mb-16">`;
const gridEndStr = `<!-- 3. FRASE INFERIOR -->`;

const gridStartIdx = html.indexOf(gridStartStr);
const gridEndIdx = html.indexOf(gridEndStr);

let chunk = html.substring(gridStartIdx, gridEndIdx);

const heroReplacement = `
            <div class="mt-12 mb-16">
                <a href="/diagnostico/" class="bg-brand-accent text-brand font-bold py-4 px-10 rounded-full shadow-lg text-lg hover:-translate-y-1 transition-all inline-block text-center uppercase tracking-wide">
                    DIAGNOSTICAR MI EMPRESA <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>

            `;

html = html.substring(0, gridStartIdx) + heroReplacement + html.substring(gridEndIdx);

const sec13Start = html.indexOf("<!-- 13. DIAGN");
const sec13End = html.indexOf("</section>", sec13Start);

const insertPoint = sec13End;

const destReplacement = `
            <div class="mt-16 border-t border-white/10 pt-16 max-w-[95%] mx-auto pb-10">
                <h3 class="text-3xl font-extrabold mb-10 text-center text-white">Vea cómo coordina las ofertas de los 6 paquetes con la prueba:</h3>
                ` + chunk + `
            </div>
        `;

html = html.substring(0, insertPoint) + destReplacement + html.substring(insertPoint);

fs.writeFileSync("index.html", html);
console.log("Moved via file!");

