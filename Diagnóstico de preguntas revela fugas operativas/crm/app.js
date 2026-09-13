const { useState } = React;

function CRM() {
  const [activeView, setActiveView] = useState('leads');

  const [leads] = useState([
    { id: 1, name: 'Empresa Alpha S.A.', date: '10/09/2026', age: 'Adolescencia', topLeak: 'Operaciones (IPA: 75)', status: 'Nuevo Lead' },
    { id: 2, name: 'Logística Fast SRL', date: '08/09/2026', age: 'Plenitud', topLeak: 'Mercadeo (IPA: 60)', status: 'En Seguimiento' },
    { id: 3, name: 'Comercializadora X', date: '05/09/2026', age: 'Infancia', topLeak: 'Finanzas (IPA: 90)', status: 'Propuesta Enviada' },
  ]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-purple-900 text-white min-h-screen p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-purple-700 pb-4">Consultores NyT</h2>
        <ul className="space-y-4">
          <li 
            onClick={() => setActiveView('leads')}
            className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${activeView === 'leads' ? 'bg-purple-800' : 'hover:bg-purple-800'}`}>
            <i className="fas fa-users"></i> <span>Leads Recientes</span>
          </li>
          <li 
            onClick={() => setActiveView('propuestas')}
            className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${activeView === 'propuestas' ? 'bg-purple-800' : 'hover:bg-purple-800'}`}>
            <i className="fas fa-file-invoice"></i> <span>Propuestas</span>
          </li>
          <li 
            onClick={() => setActiveView('configuracion')}
            className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${activeView === 'configuracion' ? 'bg-purple-800' : 'hover:bg-purple-800'}`}>
            <i className="fas fa-cogs"></i> <span>Configuración</span>
          </li>
          <li 
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-3 p-3 hover:bg-purple-800 rounded cursor-pointer transition-colors mt-8">
            <i className="fas fa-arrow-left"></i> <span>Volver a Inicio</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control Interno (CRM)</h1>
          <div className="bg-white p-2 rounded shadow flex items-center space-x-2">
            <img src="https://ui-avatars.com/api/?name=Admin&background=6b21a8&color=fff" className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-gray-700">Administrador</span>
          </div>
        </div>

        {activeView === 'leads' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nuevos Leads (Mes)</h3>
                <p className="text-4xl font-bold text-purple-600">24</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Promedio IPA Crítico</h3>
                <p className="text-4xl font-bold text-red-600">68%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Propuestas Aceptadas</h3>
                <p className="text-4xl font-bold text-green-600">7</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Resultados Recientes del Diagnóstico</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                      <th className="p-4 border-b">Empresa</th>
                      <th className="p-4 border-b">Fecha</th>
                      <th className="p-4 border-b">Etapa Detectada</th>
                      <th className="p-4 border-b">Fuga Principal</th>
                      <th className="p-4 border-b">Estado</th>
                      <th className="p-4 border-b">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50 border-b transition-colors">
                        <td className="p-4 font-semibold text-gray-800">{lead.name}</td>
                        <td className="p-4 text-gray-600">{lead.date}</td>
                        <td className="p-4"><span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs">{lead.age}</span></td>
                        <td className="p-4 text-red-600 font-medium">{lead.topLeak}</td>
                        <td className="p-4">
                          <span className={`py-1 px-2 rounded text-xs font-bold ${lead.status === 'Nuevo Lead' ? 'bg-yellow-100 text-yellow-800' : lead.status === 'Propuesta Enviada' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-purple-600 hover:text-purple-900 font-semibold text-sm mr-3" onClick={() => alert('Abriendo expediente de ' + lead.name)}>Ver Detalle</button>
                          <button className="text-blue-600 hover:text-blue-900 font-semibold text-sm" onClick={() => alert('Generando plan para ' + lead.name)}>Generar Plan</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'propuestas' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Propuestas</h2>
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded mb-6">
              <p className="text-yellow-800">Tienes <strong>3 propuestas</strong> pendientes de firma digital por parte de los clientes.</p>
            </div>
            <p className="text-gray-600">Aquí podrás visualizar el historial de documentos PDF enviados al Portal del Cliente, gestionar versiones de la propuesta comercial, y ver si han sido aprobadas o descargadas.</p>
          </div>
        )}

        {activeView === 'configuracion' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Motor Lógico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded">
                <h3 className="font-bold text-gray-700 mb-2"><i className="fas fa-sliders-h mr-2"></i> Algoritmo IPA</h3>
                <p className="text-sm text-gray-600 mb-4">Ajusta los umbrales de alerta del Índice de Prioridad de Automatización.</p>
                <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-semibold text-sm">Editar Parámetros</button>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-bold text-gray-700 mb-2"><i className="fas fa-boxes mr-2"></i> Soluciones NyT</h3>
                <p className="text-sm text-gray-600 mb-4">Actualiza el catálogo de aplicaciones recomendadas por el diagnóstico.</p>
                <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-semibold text-sm">Editar Catálogo</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CRM />);
