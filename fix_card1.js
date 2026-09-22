
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const startStr = `<!-- 1. INSTRUCCI`;
const startIdx = html.indexOf(startStr);
if (startIdx === -1) {
    console.log("Could not find start block");
    process.exit(1);
}

const endStr = `<!-- 2. Fase 1 -->`;
const endIdx = html.indexOf(endStr);
if (endIdx === -1) {
    console.log("Could not find end block");
    process.exit(1);
}

const newCard = `<!-- 1. INSTRUCCIÓN DIAGNÓSTICO -->
                <div class="bg-brand-accent/5 border border-brand-accent/30 rounded-xl p-5 flex flex-col relative overflow-hidden text-center justify-center items-center">
                    <div class="absolute top-0 right-0 bg-brand-accent text-brand text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Paso 1</div>
                    <i class="fas fa-arrow-up text-3xl text-brand-accent mb-4 animate-bounce"></i>
                    <h3 class="text-white font-bold text-lg mb-2 leading-tight">Inicie con el Diagnóstico</h3>
                    <p class="text-gray-300 text-[11px] leading-relaxed mt-2">
                        Haga clic en el <strong class="text-brand-accent">botón amarillo superior</strong>. 
                        Nuestro algoritmo detectará sus fugas y calculará matemáticamente cuál de los siguientes paquetes es el antídoto exacto para su nivel de madurez.
                    </p>
                </div>

                `;

html = html.substring(0, startIdx) + newCard + html.substring(endIdx);
fs.writeFileSync("index.html", html, "utf8");
console.log("Card replaced successfully!");

