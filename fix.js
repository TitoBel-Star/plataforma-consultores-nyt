const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modulesList = [
  { id: 'Ventas', name: 'NyTEX Ventas', description: 'Gestión de ventas y facturación.' },
  { id: 'CRM', name: 'NyTEX CRM', description: 'Gestión de relaciones con los clientes.' },
  { id: 'Inventario', name: 'NyTEX Inventario', description: 'Control de stock y almacén.' },
  { id: 'Compras', name: 'NyTEX Compras', description: 'Gestión de proveedores y compras.' },
  { id: 'Produccion', name: 'NyTEX Producción', description: 'Control de procesos de manufactura.' },
  { id: 'Contabilidad', name: 'NyTEX Contabilidad', description: 'Gestión contable financiera.' },
  { id: 'CxC', name: 'NyTEX Cuentas por Cobrar (CxC)', description: 'Gestión de cuentas por cobrar.' },
  { id: 'CxP', name: 'NyTEX Cuentas por Pagar (CxP)', description: 'Gestión de cuentas por pagar.' },
  { id: 'Tesoreria', name: 'NyTEX Tesorería', description: 'Control de flujo de caja y bancos.' },
  { id: 'ActivosFijos', name: 'NyTEX Activos Fijos', description: 'Control de bienes de la empresa.' },
  { id: 'Logistica', name: 'NyTEX Logística', description: 'Gestión de despachos y distribución.' },
  { id: 'RRHH', name: 'NyTEX RRHH', description: 'Gestión de recursos humanos.' },
  { id: 'Nomina', name: 'NyTEX Nómina', description: 'Cálculo y pago de planillas.' },
  { id: 'ProcessSuite', name: 'NyTEX Process Suite', description: 'Automatización de procesos.' },
  { id: 'ProcessMining', name: 'NyTEX Process Mining', description: 'Minería de procesos operativos.' },
  { id: 'BusinessPartners', name: 'NyTEX Business Partners', description: 'Gestión de socios de negocio.' },
  { id: 'BIyReportes', name: 'NyTEX BI y Reportes', description: 'Inteligencia de negocios y analítica.' },
  { id: 'Configuracion', name: 'NyTEX Configuración', description: 'Ajustes globales del sistema.' },
  { id: 'WMS', name: 'NyTEX WMS', description: 'Sistema de gestión de almacenes avanzado.' },
  { id: 'Dashboards', name: 'NyTEX Dashboards Operativos', description: 'Visualización de métricas en tiempo real.' },
  { id: 'BI', name: 'NyTEX BI', description: 'Business Intelligence avanzado.' },
  { id: 'BigData', name: 'NyTEX Big Data', description: 'Procesamiento de grandes volúmenes de datos.' },
  { id: 'MineriaDatos', name: 'NyTEX Minería de Datos', description: 'Descubrimiento de patrones de datos.' },
  { id: 'IA', name: 'NyTEX IA', description: 'Inteligencia artificial aplicada a negocios.' },
  { id: 'Predictivos', name: 'NyTEX Modelos Predictivos', description: 'Análisis y proyecciones a futuro.' },
  { id: 'Planeacion', name: 'NyTEX Planeación', description: 'Planificación estratégica y operativa.' }
];

const phasesConfig = {
  1: ['Ventas'],
  2: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras'],
  3: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras', 'Produccion', 'RRHH', 'Nomina', 'ActivosFijos', 'Tesoreria', 'Logistica', 'CRM'],
  4: modulesList.map(m => m.id)
};

let modulesHtml = `
            <!-- Grid Interactivo de Módulos (Replicado del Portal) -->
            <div id="nytex-modules-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-16 px-4">
`;

modulesList.forEach(mod => {
    modulesHtml += `
                <div class="nytex-module-card relative bg-white rounded-xl overflow-hidden border border-gray-200 opacity-60 transition-all duration-300 z-0" data-module="${mod.id}">
                    <div class="p-6 flex flex-col h-full">
                        <h3 class="text-xl font-extrabold text-[#0a2342] mb-2">${mod.name}</h3>
                        <p class="text-gray-600 mb-6 flex-grow text-sm">${mod.description}</p>
                        <a href="/portal/" target="_blank" class="nytex-module-btn mt-auto block w-full text-center bg-[#f0f4f8] text-[#0a2342] py-2 px-4 rounded-md font-bold border border-gray-300 cursor-not-allowed text-sm">
                            Módulo Bloqueado
                        </a>
                    </div>
                    
                    <div class="nytex-module-badge-requerido absolute top-0 right-0 bg-gray-300 text-white px-3 py-1 text-[10px] font-extrabold rounded-bl-lg shadow-sm">
                        REQUERIDO
                    </div>
                    
                    <div class="nytex-module-badge-adquirido absolute top-0 right-0 bg-[#15A36A] text-white px-3 py-1 text-[10px] font-extrabold rounded-bl-lg shadow-sm hidden">
                        ADQUIRIDO
                    </div>

                    <div class="nytex-module-badge-seleccionado absolute top-0 right-0 bg-[#09a9e8] text-white px-3 py-1 text-[10px] font-extrabold rounded-bl-lg shadow-sm hidden">
                        SELECCIONADO
                    </div>
                </div>
`;
});
modulesHtml += `            </div>`;

const scriptHtml = `
            <script>
                const phasesConfig = ${JSON.stringify(phasesConfig)};
                
                document.addEventListener('DOMContentLoaded', () => {
                    const buttons = document.querySelectorAll('.ver-apps-btn');
                    const moduleCards = document.querySelectorAll('.nytex-module-card');
                    
                    buttons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            
                            buttons.forEach(b => {
                                b.innerHTML = 'Ver aplicaciones &darr;';
                                b.classList.remove('bg-[#15A36A]', 'border-[#15A36A]');
                                b.classList.add('bg-transparent', 'border-[#4B2979]', 'hover:bg-[#4B2979]');
                            });
                            
                            btn.innerHTML = 'Aplicaciones incluidas &darr;';
                            btn.classList.remove('bg-transparent', 'border-[#4B2979]', 'hover:bg-[#4B2979]');
                            btn.classList.add('bg-[#15A36A]', 'border-[#15A36A]');
                            
                            const phaseId = btn.getAttribute('data-phase');
                            
                            if (phaseId === '5') {
                                moduleCards.forEach(card => {
                                    card.className = 'nytex-module-card relative bg-white rounded-xl overflow-hidden border transition-all duration-300 border-[#09a9e8] ring-4 ring-[#09a9e8] shadow-[0_0_20px_rgba(9,169,232,0.8)] transform scale-105 z-20';
                                    card.querySelector('.nytex-module-btn').className = 'nytex-module-btn mt-auto block w-full text-center bg-[#09a9e8] text-white py-2 px-4 rounded-md font-bold shadow-lg text-sm';
                                    card.querySelector('.nytex-module-btn').innerText = 'Seleccionar';
                                    card.querySelector('.nytex-module-badge-requerido').classList.add('hidden');
                                    card.querySelector('.nytex-module-badge-adquirido').classList.add('hidden');
                                    card.querySelector('.nytex-module-badge-seleccionado').classList.remove('hidden');
                                });
                            } else {
                                const activeModules = phasesConfig[phaseId] || [];
                                moduleCards.forEach(card => {
                                    const moduleId = card.getAttribute('data-module');
                                    if (activeModules.includes(moduleId)) {
                                        card.className = 'nytex-module-card relative bg-white rounded-xl overflow-hidden border transition-all duration-300 border-[#15A36A] shadow-md opacity-100 z-10';
                                        card.querySelector('.nytex-module-btn').className = 'nytex-module-btn mt-auto block w-full text-center bg-[#15A36A] text-white py-2 px-4 rounded-md font-bold hover:bg-[#108253] transition-colors shadow-lg text-sm';
                                        card.querySelector('.nytex-module-btn').innerText = 'Abrir Módulo';
                                        card.querySelector('.nytex-module-badge-requerido').classList.add('hidden');
                                        card.querySelector('.nytex-module-badge-seleccionado').classList.add('hidden');
                                        card.querySelector('.nytex-module-badge-adquirido').classList.remove('hidden');
                                    } else {
                                        card.className = 'nytex-module-card relative bg-white rounded-xl overflow-hidden border border-gray-200 opacity-60 transition-all duration-300 z-0';
                                        card.querySelector('.nytex-module-btn').className = 'nytex-module-btn mt-auto block w-full text-center bg-[#f0f4f8] text-[#0a2342] py-2 px-4 rounded-md font-bold border border-gray-300 cursor-not-allowed text-sm';
                                        card.querySelector('.nytex-module-btn').innerText = 'Módulo Bloqueado';
                                        card.querySelector('.nytex-module-badge-requerido').classList.remove('hidden');
                                        card.querySelector('.nytex-module-badge-seleccionado').classList.add('hidden');
                                        card.querySelector('.nytex-module-badge-adquirido').classList.add('hidden');
                                    }
                                });
                            }
                        });
                    });
                });
            </script>
`;

const startIndex = html.indexOf('<!-- Grid Interactivo de Módulos (Replicado del Portal) -->');
const endIndex = html.lastIndexOf('</script>') + 9;

if (startIndex > -1) {
    html = html.substring(0, startIndex) + modulesHtml + scriptHtml + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log('Fixed exactly 26 modules');
} else {
    console.log('Could not find existing block to replace');
}
