const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState({ questions: null, solutions: null });
  const [step, setStep] = useState('welcome');
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [ageAnswers, setAgeAnswers] = useState({});
  const [areaAnswers, setAreaAnswers] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('questions.json?v=' + Date.now()).then(r => r.json()),
      fetch('solutions.json?v=' + Date.now()).then(r => r.json())
    ]).then(([questions, solutions]) => {
      setData({ questions, solutions });
    }).catch(err => console.error("Error cargando datos:", err));
  }, []);

  if (!data.questions || !data.solutions) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando aplicaciÃ³n...</div>;
  }

  const startDiagnosis = () => {
    setAgeAnswers({});
    setAreaAnswers({});
    setCurrentAreaIndex(0);
    setStep('age');
  };

  const handleAgeAnswer = (questionId, value) => {
    setAgeAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleAreaAnswer = (questionId, score) => {
    setAreaAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const nextFromAge = () => {
    if (Object.keys(ageAnswers).length < data.questions.ageQuestions.length) {
      alert('Por favor responde todas las preguntas para continuar.');
      return;
    }
    setStep('areas');
  };

  const nextArea = () => {
    const currentArea = data.questions.areas[currentAreaIndex];
    const answeredInArea = currentArea.questions.filter(q => areaAnswers[q.id] !== undefined);
    if (answeredInArea.length < currentArea.questions.length) {
      alert('Por favor responde todas las preguntas de esta Ã¡rea para continuar.');
      return;
    }

    if (currentAreaIndex < data.questions.areas.length - 1) {
      setCurrentAreaIndex(currentAreaIndex + 1);
      window.scrollTo(0,0);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const ageCounts = { infancia: 0, adolescencia: 0, plenitud: 0, burocracia: 0 };
    Object.values(ageAnswers).forEach(val => {
      if (val !== 'NA') {
        ageCounts[val]++;
      }
    });

    const maxCount = Math.max(...Object.values(ageCounts));
    const detectedAges = maxCount > 0 ? Object.keys(ageCounts).filter(k => ageCounts[k] === maxCount) : [];

    const areaScores = data.questions.areas.map(area => {
      let totalScore = 0;
      let maxPossible = 0;
      let leaks = [];
      area.questions.forEach(q => {
        const score = areaAnswers[q.id];
        if (score !== 'NA') {
          totalScore += score;
          maxPossible += 3;
          if (score <= 2) {
            leaks.push({ question: q.text, score });
          }
        }
      });
      const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 100;
      const ipa = 100 - percentage; // Ãndice de Prioridad de AutomatizaciÃ³n
      
      let alertMsg = "";
      if (ipa > 40) {
        if (area.id === 'mercadeo_ventas') alertMsg = "Fuga grave de leads y pÃ©rdida de conversiÃ³n por falta de automatizaciÃ³n comercial y seguimiento.";
        else if (area.id === 'operaciones') alertMsg = "Costos ocultos severos por tareas operativas repetitivas y procesos manuales en almacÃ©n/flota.";
        else if (area.id === 'logistica_compras') alertMsg = "PÃ©rdida de capital de trabajo por quiebres de inventario y falta de optimizaciÃ³n con proveedores.";
        else if (area.id === 'contabilidad_finanzas') alertMsg = "Riesgo alto por flujo de caja descontrolado y falta de automatizaciÃ³n en cotizaciones/cobranza.";
        else if (area.id === 'recursos_humanos') alertMsg = "Alta rotaciÃ³n y desmotivaciÃ³n por falta de procesos centralizados de gestiÃ³n de talento.";
        else alertMsg = "FricciÃ³n administrativa y pÃ©rdida de tiempo valioso en papeleo y aprobaciones manuales.";
      }

      return {
        id: area.id,
        name: area.name,
        percentage,
        ipa,
        leaks,
        alertMsg
      };
    });

    areaScores.sort((a, b) => b.ipa - a.ipa);

    setResults({ detectedAges, areaScores, ageCounts });
    setStep('results');
    window.scrollTo(0,0);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl text-center">
          <i className="fas fa-stethoscope text-5xl text-blue-600 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Plataforma Diagnostico Operativo</h1>
          <p className="text-gray-600 mb-8">
            Bienvenido al sistema de evaluaciÃ³n organizacional. Analizaremos sus procesos actuales y la etapa de madurez de su empresa para identificar fugas operativas e ineficiencias.<br/><br/>
            Al finalizar, nuestro motor lÃ³gico ensamblarÃ¡ recomendaciones personalizadas y un Roadmap de TransformaciÃ³n para escalar y optimizar sus operaciones.
          </p>
          <button onClick={startDiagnosis} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
            Iniciar DiagnÃ³stico
          </button>
        </div>
      </div>
    );
  }

  if (step === 'age') {
    return (
      <div className="min-h-screen p-4 md:p-8 flex justify-center">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">SecciÃ³n 1: Etapa Organizacional</h2>
          <p className="text-gray-600 mb-6">Estas preguntas nos ayudarÃ¡n a determinar la madurez estructural de su empresa.</p>
          <div className="space-y-8">
            {data.questions.ageQuestions.map((q, idx) => (
              <div key={q.id} className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-semibold text-lg mb-4">{idx + 1}. {q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-center space-x-3 p-3 bg-white rounded shadow-sm hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 transition-colors">
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt.value}
                        checked={ageAnswers[q.id] === opt.value}
                        onChange={() => handleAgeAnswer(q.id, opt.value)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={nextFromAge} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow">
              Siguiente <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'areas') {
    const area = data.questions.areas[currentAreaIndex];
    return (
      <div className="min-h-screen p-4 md:p-8 flex justify-center">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-3xl w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Ãrea: {area.name}</h2>
            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Paso {currentAreaIndex + 2} de {data.questions.areas.length + 1}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentAreaIndex) / data.questions.areas.length) * 100}%` }}></div>
          </div>
          <div className="space-y-8">
            {area.questions.map((q, idx) => (
              <div key={q.id} className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-semibold text-lg mb-4">{idx + 1}. {q.text}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-center space-x-3 p-3 bg-white rounded shadow-sm hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200 transition-colors">
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt.score}
                        checked={areaAnswers[q.id] === opt.score}
                        onChange={() => handleAreaAnswer(q.id, opt.score)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <button 
              onClick={() => currentAreaIndex > 0 ? setCurrentAreaIndex(currentAreaIndex-1) : setStep('age')} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded shadow">
              <i className="fas fa-arrow-left mr-2"></i> AtrÃ¡s
            </button>
            <button onClick={nextArea} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow">
              {currentAreaIndex < data.questions.areas.length - 1 ? 'Siguiente' : 'Ver Resultados'} 
              {currentAreaIndex < data.questions.areas.length - 1 && <i className="fas fa-arrow-right ml-2"></i>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center">
        <div className="max-w-5xl w-full space-y-8">
          
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">DiagnÃ³stico y Plan de AcciÃ³n</h1>
            <p className="text-gray-600">Basado en sus respuestas, hemos ensamblado sus recomendaciones personalizadas.</p>
          </div>

          {/* 1. DetecciÃ³n de Fugas EconÃ³micas */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-4 text-red-700"><i className="fas fa-exclamation-triangle mr-2"></i> 1. DetecciÃ³n de Fugas EconÃ³micas (Alertas)</h2>
            <div className="space-y-4">
              {results.areaScores.filter(a => a.ipa > 40).length === 0 ? (
                 <p className="text-green-700">No se detectaron fugas graves en sus procesos evaluados.</p>
              ) : (
                results.areaScores.filter(a => a.ipa > 40).map(area => (
                  <div key={area.id} className="bg-red-50 p-4 border border-red-200 rounded">
                    <h3 className="font-bold text-red-800 mb-1">{area.name}</h3>
                    <p className="text-red-700">{area.alertMsg}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                      {area.leaks.slice(0, 2).map((l, i) => <li key={i}>{l.question}</li>)}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Ãndice de Prioridad de AutomatizaciÃ³n (IPA) */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-4 text-blue-800"><i className="fas fa-sort-amount-down mr-2"></i> 2. Ãndice de Prioridad de AutomatizaciÃ³n (IPA)</h2>
            <p className="text-gray-600 mb-6">Rankeado del 0 al 100, indicando quÃ© Ã¡reas urgen automatizar de inmediato.</p>
            <div className="space-y-6">
              {results.areaScores.map(area => (
                <div key={area.id} className="border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{area.name}</h3>
                    <span className={`font-bold text-lg ${area.ipa > 60 ? 'text-red-600' : area.ipa > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                      IPA: {area.ipa}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className={`h-3 rounded-full ${area.ipa > 60 ? 'bg-red-600' : area.ipa > 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${area.ipa}%` }}></div>
                  </div>
                  {area.ipa > 0 && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-100">
                      <strong>SoluciÃ³n Sugerida:</strong> {
                        area.id === 'mercadeo_ventas' ? "Implementar un bot inteligente (ej. WhatsApp) y conectarlo a un CRM central; eliminar ping-pong de correos con reservas en lÃ­nea." :
                        area.id === 'contabilidad_finanzas' ? "Automatizar la generaciÃ³n de cotizaciones, facturas y recordatorios de cobranza." :
                        data.solutions.areaSolutions[area.id][0]
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. El Roadmap de TransformaciÃ³n */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-4 text-purple-800"><i className="fas fa-route mr-2"></i> 3. El Roadmap de TransformaciÃ³n (Plan de AcciÃ³n)</h2>
            <p className="text-gray-600 mb-6">Basado en la madurez de su empresa ({results.detectedAges.map(a => data.solutions.ages[a]?.title).join(" / ")}), proponemos este plan de consultorÃ­a e implementaciÃ³n tecnolÃ³gica (Consultores NyT):</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-purple-200 rounded p-4 bg-purple-50">
                <h3 className="font-bold text-purple-900 mb-2">Fase 1 (0-30 dÃ­as) - Quick Wins</h3>
                <p className="text-sm text-gray-700">Centralizar bases de datos en un CRM y estandarizar la atenciÃ³n bÃ¡sica. Solucionar las fugas mÃ¡s urgentes del IPA superior a 60.</p>
              </div>
              <div className="border border-purple-200 rounded p-4 bg-purple-50">
                <h3 className="font-bold text-purple-900 mb-2">Fase 2 (30-60 dÃ­as) - EstandarizaciÃ³n</h3>
                <p className="text-sm text-gray-700">Crear embudos automÃ¡ticos y seguimiento por email/WhatsApp sin intervenciÃ³n humana. Estandarizar Ã¡reas operativas.</p>
              </div>
              <div className="border border-purple-200 rounded p-4 bg-purple-50">
                <h3 className="font-bold text-purple-900 mb-2">Fase 3 (60-90 dÃ­as) - IntegraciÃ³n</h3>
                <p className="text-sm text-gray-700">Conectar pasarelas de pago, inventarios y atenciÃ³n al cliente en una sola plataforma ERP/CRM consolidada.</p>
              </div>
              <div className="border border-purple-200 rounded p-4 bg-purple-50">
                <h3 className="font-bold text-purple-900 mb-2">Fase 4 (90-180 dÃ­as) - Escalamiento</h3>
                <p className="text-sm text-gray-700">Implementar tableros de Inteligencia de Negocios (BI) para visualizar mÃ©tricas en tiempo real y escalar con RPA.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center pb-8">
            <button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg">
              <i className="fas fa-redo mr-2"></i> Realizar nuevo diagnÃ³stico
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
