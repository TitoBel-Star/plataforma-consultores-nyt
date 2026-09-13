const { useState } = React;

function Portal() {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
    alert("¡Felicidades! Has aprobado la propuesta comercial. El equipo de Consultores NyT se pondrá en contacto contigo a la brevedad para agendar la reunión de arranque (Kick-off).");
  };

  const handleDownload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración básica del PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PROPUESTA COMERCIAL V.2", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Consultores NyT", 20, 30);
    doc.text("Para: Empresa Alpha S.A.", 20, 38);
    
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN DE FUGAS", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text("- Operaciones: IPA 75/100", 25, 58);
    doc.text("- Mercadeo: IPA 45/100", 25, 66);
    
    doc.setFont("helvetica", "bold");
    doc.text("PLAN DE ACCIÓN (ROADMAP)", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text("- Fase 1: Quick Wins (0-30 días)", 25, 88);
    doc.text("- Fase 2: Estandarización (30-60 días)", 25, 96);
    doc.text("- Fase 3: Integración (60-90 días)", 25, 104);
    doc.text("- Fase 4: Escalamiento (90-180 días)", 25, 112);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("(Este es un archivo PDF generado automáticamente por el sistema)", 20, 130);
    
    doc.save("Propuesta_Comercial_NyT.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center border-b-4 border-green-500">
        <div className="flex items-center space-x-4">
          <i className="fas fa-rocket text-3xl text-green-500"></i>
          <h1 className="text-2xl font-bold text-gray-800">Mi Portal de Transformación</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Bienvenido, Empresa Alpha S.A.</span>
          <a href="/" className="text-gray-400 hover:text-red-500 transition-colors" title="Salir"><i className="fas fa-sign-out-alt text-xl"></i></a>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 mt-4">
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b pb-2">
          <button 
            onClick={() => setActiveTab('roadmap')} 
            className={`font-semibold pb-2 px-4 ${activeTab === 'roadmap' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <i className="fas fa-route mr-2"></i> Mi Roadmap
          </button>
          <button 
            onClick={() => setActiveTab('fugas')} 
            className={`font-semibold pb-2 px-4 ${activeTab === 'fugas' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <i className="fas fa-exclamation-triangle mr-2"></i> Reporte de Fugas
          </button>
          <button 
            onClick={() => setActiveTab('propuesta')} 
            className={`font-semibold pb-2 px-4 ${activeTab === 'propuesta' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <i className="fas fa-file-signature mr-2"></i> Propuesta Comercial
          </button>
        </div>

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Su Plan de Acción Personalizado</h2>
              <p className="text-gray-600">Basado en su diagnóstico (Etapa: Adolescencia), hemos preparado un roadmap de 4 fases para eliminar el 85% de sus fugas operativas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border-t-4 border-gray-300 p-6 rounded shadow opacity-50 relative">
                 <div className="absolute top-2 right-2 text-green-500"><i className="fas fa-check-circle text-2xl"></i></div>
                 <h3 className="font-bold text-gray-800 mb-2">Fase 1 (0-30 días)</h3>
                 <p className="text-sm text-gray-600">Quick Wins: Centralizar bases de datos en CRM y estandarizar la atención básica.</p>
                 <span className="mt-4 inline-block text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Completado</span>
              </div>
              <div className="bg-white border-t-4 border-green-500 p-6 rounded shadow relative transform scale-105 z-10">
                 <h3 className="font-bold text-gray-800 mb-2">Fase 2 (30-60 días)</h3>
                 <p className="text-sm text-gray-600">Estandarización: Crear embudos automáticos y seguimiento por WhatsApp sin intervención humana.</p>
                 <span className="mt-4 inline-block text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">En Progreso (Semana 5)</span>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-4"><div className="bg-green-500 h-2 rounded-full w-1/2"></div></div>
              </div>
              <div className="bg-white border-t-4 border-gray-300 p-6 rounded shadow">
                 <h3 className="font-bold text-gray-800 mb-2">Fase 3 (60-90 días)</h3>
                 <p className="text-sm text-gray-600">Integración: Conectar pasarelas de pago, inventarios y atención en un ERP.</p>
                 <span className="mt-4 inline-block text-xs font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded">Próximamente</span>
              </div>
              <div className="bg-white border-t-4 border-gray-300 p-6 rounded shadow">
                 <h3 className="font-bold text-gray-800 mb-2">Fase 4 (90-180 días)</h3>
                 <p className="text-sm text-gray-600">Escalamiento: Tableros BI y automatización robótica (RPA).</p>
                 <span className="mt-4 inline-block text-xs font-bold bg-gray-100 text-gray-800 px-2 py-1 rounded">Próximamente</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fugas' && (
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporte de Fugas Detectadas</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded border border-red-100">
                <h3 className="font-bold text-red-800">Operaciones (IPA: 75/100)</h3>
                <p className="text-sm text-red-700 mt-1">Costos ocultos severos por tareas operativas repetitivas y procesos manuales en almacén.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
                <h3 className="font-bold text-yellow-800">Mercadeo y Ventas (IPA: 45/100)</h3>
                <p className="text-sm text-yellow-700 mt-1">Fuga moderada de leads por seguimiento deficiente en el CRM actual.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'propuesta' && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center transition-all">
            {isApproved ? (
              <div className="animate-pulse">
                <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Propuesta Aprobada Exitosamente!</h2>
                <p className="text-gray-600 mb-6">Hemos notificado a su consultor asignado. Nos pondremos en contacto con usted en breve para la reunión de Kick-off.</p>
              </div>
            ) : (
              <div>
                <i className="fas fa-file-pdf text-6xl text-red-500 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Propuesta Comercial V.2</h2>
                <p className="text-gray-600 mb-6">Hemos actualizado la propuesta de implementación del CRM y la Fase 2 del Roadmap.</p>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition-colors" onClick={handleDownload}>
                  <i className="fas fa-download mr-2"></i> Descargar Propuesta (PDF)
                </button>
                <button onClick={handleApprove} className="ml-4 border border-green-600 text-green-600 hover:bg-green-50 font-bold py-2 px-6 rounded shadow transition-colors">
                  <i className="fas fa-check mr-2"></i> Aprobar Propuesta
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Portal />);
