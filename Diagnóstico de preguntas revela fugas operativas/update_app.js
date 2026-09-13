const fs = require('fs');
const content = fs.readFileSync('diagnostico/app.js', 'utf8');

// Replace maxPossible += 3 with += 4
let newContent = content.replace(/maxPossible \+= 3;/g, 'maxPossible += 4;');

// Update alertMsg logic
newContent = newContent.replace(/let alertMsg = \"\";[\s\S]*?alertMsg\n        \};/m, \let alertMsg = \"\";
        if (ipa > 40) {
          if (area.id === 'operaciones') alertMsg = "Costos ocultos severos por tareas operativas repetitivas y nula optimización TQM.";
          else if (area.id === 'logistica_compras') alertMsg = "Pérdida de capital de trabajo por quiebres de inventario y falta de visibilidad SCM.";
          else if (area.id === 'recursos_humanos') alertMsg = "Liderazgo inestable y falta de métricas de desempeño o encuestas de clima.";
          else if (area.id === 'mercadeo_ventas') alertMsg = "Fuga grave de leads por falta de CRM y nulo análisis de ingeniería de mercado.";
          else if (area.id === 'administracion') alertMsg = "Falta de control de gestión, documentación y BPMN que frena el escalamiento.";
          else if (area.id === 'contabilidad_finanzas') alertMsg = "Falta de integración financiera, costeo ABC y herramientas de BI para flujo de caja.";
        }
        
        return {
          id: area.id,
          name: area.name,
          percentage,
          ipa,
          leaks,
          alertMsg
        };\);

// Update Solucion Sugerida dynamically
newContent = newContent.replace(/<strong>Solucin Sugerida:<\/strong> \{[\s\S]*?\}/m, \<strong>Solucin Estratgica:<\/strong> {
                        data.solutions.areaSolutions[area.id][0]
                      }\);

// Update Roadmap dynamically
const roadmapStart = newContent.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">');
const roadmapEnd = newContent.indexOf('</div>\\n          </div>\\n          \\n          <div className="text-center pb-8">');
if (roadmapStart !== -1 && roadmapEnd !== -1) {
    const dynamicRoadmap = \<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.solutions.methodology && data.solutions.methodology.map((fase, idx) => (
                <div key={idx} className="border border-purple-200 rounded p-4 bg-purple-50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-purple-900 mb-1">{fase.fase}</h3>
                  <p className="text-xs text-purple-700 font-semibold mb-2">Enfoque: {fase.enfoque}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
                    {fase.practicas.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                  <div className="bg-white border border-purple-100 p-2 rounded text-xs font-bold text-gray-800">
                    <i className="fas fa-laptop-code text-purple-600 mr-1"></i> {fase.appDigital}
                  </div>
                </div>
              ))}
            </div>\;
    newContent = newContent.substring(0, roadmapStart) + dynamicRoadmap + newContent.substring(roadmapEnd + 6);
}

fs.writeFileSync('diagnostico/app.js', newContent);
