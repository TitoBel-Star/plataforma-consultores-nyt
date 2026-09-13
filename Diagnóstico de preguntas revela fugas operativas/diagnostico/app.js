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
      fetch('/diagnostico/questions.json?v=' + Date.now()).then(r => r.json()),
      fetch('/diagnostico/solutions.json?v=' + Date.now()).then(r => r.json())
    ]).then(([questions, solutions]) => {
      setData({ questions, solutions });
    }).catch(err => console.error("Error cargando datos:", err));
  }, []);

  if (!data.questions || !data.solutions) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando aplicación...</div>;
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
      alert('Por favor responde todas las preguntas de esta área para continuar.');
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
          maxPossible += 4;
          if (score <= 2) {
            leaks.push({ question: q.text, score });
          }
        }
      });
      const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 100;
      const ipa = 100 - percentage; // Índice de Prioridad de Automatización
      
      let alertMsg = "";
      if (ipa > 40) {
        if (area.id === 'operaciones') alertMsg = "Costos ocultos severos por tareas operativas repetitivas y nula optimización TQM.";
        else if (area.id === 'logistica_compras') alertMsg = "Pérdida de capital de trabajo por quiebres de inventario y falta de visibilidad SCM.";
        else if (area.id === 'recursos_humanos') alertMsg = "Liderazgo inestable y falta de métricas de desempeño o encuestas de clima.";
        else if (area.id === 'mercadeo_ventas') alertMsg = "Fuga grave de leads por falta de CRM y nulo análisis de mercado.";
        else if (area.id === 'administracion') alertMsg = "Falta de control de gestión, documentación y BPMN que frena el escalamiento.";
        else if (area.id === 'contabilidad_finanzas') alertMsg = "Falta de integración financiera, costeo ABC y herramientas de BI.";
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
            Bienvenido al sistema de evaluación organizacional. Analizaremos sus procesos actuales y la etapa de madurez de su empresa para identificar fugas operativas e ineficiencias.<br/><br/>
            Al finalizar, nuestro motor lógico ensamblará recomendaciones personalizadas y un Roadmap de Transformación para escalar y optimizar sus operaciones.
          </p>
          <button onClick={startDiagnosis} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
            Iniciar Diagnóstico
          </button>
        </div>
      </div>
    );
  }

  if (step === 'age') {
    return (
      <div className="min-h-screen p-4 md:p-8 flex justify-center">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Sección 1: Etapa Organizacional</h2>
          <p className="text-gray-600 mb-6">Estas preguntas nos ayudarán a determinar la madurez estructural de su empresa.</p>
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
            <h2 className="text-2xl font-bold text-gray-800">Área: {area.name}</h2>
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
              <i className="fas fa-arrow-left mr-2"></i> Atrás
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Diagnóstico y Plan de Acción</h1>
            <p className="text-gray-600">Basado en sus respuestas, hemos ensamblado sus recomendaciones personalizadas.</p>
          </div>

          {/* 1. Detección de Fugas Económicas */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-4 text-red-700"><i className="fas fa-exclamation-triangle mr-2"></i> 1. Detección de Fugas Económicas (Alertas)</h2>
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

          {/* 2. Índice de Prioridad de Automatización (IPA) */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-4 text-blue-800"><i className="fas fa-sort-amount-down mr-2"></i> 2. Índice de Prioridad de Automatización (IPA)</h2>
            <p className="text-gray-600 mb-6">Rankeado del 0 al 100, indicando qué áreas urgen automatizar de inmediato.</p>
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
                      <strong>Solución Sugerida:</strong> {
                        data.solutions.areaSolutions[area.id] ? data.solutions.areaSolutions[area.id][0] : "Implementar módulos de gestión empresarial."
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. El Roadmap de Transformación */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-purple-600">
            <h2 className="text-2xl font-bold mb-4 text-purple-800"><i className="fas fa-route mr-2"></i> 3. El Roadmap de Transformación (Plan de Acción)</h2>
            <p className="text-gray-600 mb-6">Basado en la madurez de su empresa ({results.detectedAges.map(a => data.solutions.ages[a]?.title).join(" / ")}), proponemos este plan de consultoría e implementación tecnológica (Consultores NyT):</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          </div>
          
          <div className="text-center pb-8">
            <button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg">
              <i className="fas fa-redo mr-2"></i> Realizar nuevo diagnóstico
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

