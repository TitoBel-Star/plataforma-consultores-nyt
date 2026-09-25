const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const diagram = `
            <!-- Diagrama de Ecosistema NyTEX -->
            <div class="bg-gray-900 rounded-2xl p-6 shadow-2xl overflow-x-auto border border-gray-700 mt-12 mb-12">
                <h3 class="text-2xl font-extrabold mb-4 text-brand-accent text-center">Ecosistema Operativo NyTEX</h3>
                <pre class="mermaid">
flowchart TD
    classDef core fill:#1E293B,stroke:#0F172A,stroke-width:3px,color:#FFFFFF,font-size:16px,border-radius:8px
    classDef sales fill:#0284C7,stroke:#0369A1,stroke-width:3px,color:#FFFFFF,font-size:16px,border-radius:8px
    classDef supply fill:#16A34A,stroke:#15803D,stroke-width:3px,color:#FFFFFF,font-size:16px,border-radius:8px
    classDef finance fill:#D97706,stroke:#B45309,stroke-width:3px,color:#FFFFFF,font-size:16px,border-radius:8px
    classDef hr fill:#9333EA,stroke:#7E22CE,stroke-width:3px,color:#FFFFFF,font-size:16px,border-radius:8px
    classDef data fill:#000000,stroke:#38BDF8,stroke-width:3px,color:#38BDF8,font-size:16px,border-radius:8px

    BP["<b>NyTEX Business Partners</b><br/>Clientes y Proveedores"]:::core
    CONF["<b>NyTEX Configuración</b><br/>Parámetros Globales"]:::core
    PS["<b>NyTEX Process Suite</b><br/>Reglas de Negocio"]:::core
    
    CRM["<b>NyTEX CRM</b><br/>Embudo de Ventas"]:::sales
    VTS["<b>NyTEX Ventas</b><br/>Cotizaciones y Pedidos"]:::sales
    CXC["<b>NyTEX CxC</b><br/>Gestión de Cobranza"]:::sales

    PLAN["<b>NyTEX Planeación</b><br/>MRP y Pronósticos"]:::supply
    COMP["<b>NyTEX Compras</b><br/>Órdenes y Requisiciones"]:::supply
    INV["<b>NyTEX Inventario</b><br/>Control de Stock"]:::supply
    WMS["<b>NyTEX WMS</b><br/>Gestión de Bodegas"]:::supply
    PROD["<b>NyTEX Producción</b><br/>Recetas y Órdenes"]:::supply
    LOG["<b>NyTEX Logística</b><br/>Rutas y Despachos"]:::supply

    CXP["<b>NyTEX CxP</b><br/>Control de Deudas"]:::finance
    TES["<b>NyTEX Tesorería</b><br/>Flujo de Efectivo"]:::finance
    CONT["<b>NyTEX Contabilidad</b><br/>Pólizas y Balances"]:::finance
    AF["<b>NyTEX Activos Fijos</b><br/>Depreciaciones"]:::finance

    RRHH["<b>NyTEX RRHH</b><br/>Expedientes"]:::hr
    NOM["<b>NyTEX Nómina</b><br/>Cálculo de Sueldos"]:::hr

    DASH["<b>NyTEX Dashboards</b><br/>KPIs Operativos"]:::data
    BI_R["<b>NyTEX BI y Reportes</b><br/>Consultas"]:::data
    BI["<b>NyTEX BI</b><br/>Inteligencia"]:::data
    BD["<b>NyTEX Big Data</b><br/>Lagos de Datos"]:::data
    PRED["<b>NyTEX Modelos Predictivos</b>"]:::data
    IA["<b>NyTEX IA</b><br/>Decisiones Autónomas"]:::data

    BP ==> CRM
    BP ==> VTS
    BP ==> COMP
    CONF -.-> PS
    RRHH -.-> PS
    CRM ==> VTS
    VTS ==> CXC
    CXC ==> TES
    PLAN ==> COMP
    PLAN ==> PROD
    COMP ==> CXP
    CXP ==> TES
    COMP ===> INV
    INV ===> WMS
    INV ===> PROD
    PROD ===> INV
    VTS ===> LOG
    INV ===> LOG
    TES ===> CONT
    AF ===> CONT
    RRHH ===> NOM
    NOM ===> TES
    CONT -.-> DASH
    VTS -.-> BI_R
    INV -.-> BI
    WMS -.-> BD
    BD -.-> PRED
    PRED -.-> IA
    IA -.-> PLAN
                </pre>
            </div>
`;

// Find where to insert it using regex that ignores line endings and spaces
const targetRegex = /(<div class="w-24 h-1 bg-brand mx-auto"><\/div>\s*<\/div>\s*)(<div class="grid grid-cols-1)/;

if (targetRegex.test(html)) {
    html = html.replace(targetRegex, `$1${diagram}$2`);
    console.log("Successfully replaced!");
    fs.writeFileSync('index.html', html);
} else {
    console.log("Could not find the target text.");
}
