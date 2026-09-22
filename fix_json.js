
const fs = require("fs");
let data = JSON.parse(fs.readFileSync("diagnostico/questions.json", "utf8"));

data.areas.forEach(area => {
    area.questions.forEach(q => {
        q.options.forEach(opt => {
            if (opt.text === "|") {
                opt.text = "Gestión por correo electrónico y órdenes de compra en ERP básico.";
            }
        });
    });
});

fs.writeFileSync("diagnostico/questions.json", JSON.stringify(data, null, 2), "utf8");
console.log("Fixed missing text in questions.json");

