const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState({ questions: null, solutions: null });
  const [step, setStep] = useState('welcome');
    const [userInfo, setUserInfo] = useState({ companyName: '', email: '', userName: '', userRole: '' });
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
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
    setAreaAnswers({});
    setCurrentAreaIndex(0);
    setStep('form');
    window.scrollTo(0,0);
  };

  const handleAreaAnswer = (questionId, score) => {
    setAreaAnswers(prev => ({ ...prev, [questionId]: score }));
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
    let totalScore = 0;
    let answeredQuestions = 0;
    
    const areaScores = data.questions.areas.map(area => {
      let areaTotal = 0;
      let areaMax = 0;
      let leaks = [];
      area.questions.forEach(q => {
        const score = areaAnswers[q.id];
        if (score !== undefined && score !== 'NA') {
          totalScore += score;
          answeredQuestions++;
          areaTotal += score;
          areaMax += 4;
          if (score <= 2) {
            leaks.push({ question: q.text, score });
          }
        }
      });
      const percentage = areaMax > 0 ? Math.round((areaTotal / areaMax) * 100) : 100;
      const ipa = 100 - percentage; // Índice de Prioridad de Automatización
      
      let alertMsg = "";
      if (ipa > 40) {
        if (area.id === 'talento') {
          alertMsg = "Fuga Crítica de Capital Intelectual: La falta de evaluación objetiva y métricas de rendimiento genera dependencia de 'héroes operativos', rotación costosa y nóminas sin retorno de inversión claro. Está pagando sueldos por tareas repetitivas que deberían ser automáticas.";
        } else if (area.id === 'procesos') {
          alertMsg = "Hemorragia de Rentabilidad Operativa: Su cadena de valor carece de estandarización formal (BPM). Esto quema dinero a diario en reprocesos, tiempos muertos, fallas de calidad y falta de trazabilidad. Cada tarea manual es una fuga directa de sus márgenes de ganancia.";
        } else if (area.id === 'datos') {
          alertMsg = "Ceguera Estratégica: Operar empíricamente sin Inteligencia de Negocios (BI) causa que solo se apaguen incendios reaccionando al pasado. La falta de alertas predictivas oculta mermas, inventarios mal costeados y oportunidades de venta perdidas que su competencia sí aprovecha.";
        } else if (area.id === 'aplicaciones') {
          alertMsg = "Fragmentación Digital: Los sistemas desconectados y el abuso de hojas de cálculo obligan a su equipo a hacer 'trabajo de robots'. La falta de un ERP integral aumenta drásticamente el riesgo de fraude, pérdida de información e impide escalar el negocio sin inflar sus costos operativos.";
        } else if (area.id === 'cultura') {
          alertMsg = "Estancamiento Estructural: Una cultura centrada en la simple supervivencia, en apagar fuegos o en la microgestión administrativa bloquea la innovación. Altera el techo de crecimiento y limita su capacidad para competir contra organizaciones altamente digitalizadas.";
        } else {
          alertMsg = "Se requieren mejoras estructurales urgentes para frenar la pérdida masiva de valor y competitividad.";
        }
      }

      return { id: area.id, name: area.name, ipa, leaks, alertMsg };
    });

    // Calcular etapa dominante basada en el promedio (1 a 4)
    const avgScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 1;
    let baseTier = 1;
    if (avgScore > 3.25) baseTier = 4;
    else if (avgScore > 2.5) baseTier = 3;
    else if (avgScore > 1.75) baseTier = 2;
    else baseTier = 1;

    // REGLA DE NEGOCIO: Nunca recomendar un paquete que tenga menos tecnología de la que el cliente ya tiene.
    // Verificamos la respuesta de la pregunta 'app1' (Aplicaciones Tecnológicas)
    const techScore = areaAnswers['app1'] || 1;
    const finalTier = Math.max(baseTier, techScore);

    let dominantAgeKey = 'infancia';
    if (finalTier === 4) dominantAgeKey = 'plenitud';
    else if (finalTier === 3) dominantAgeKey = 'madurez';
    else if (finalTier === 2) dominantAgeKey = 'juventud';
    else dominantAgeKey = 'infancia';

    setResults({
      areaScores: areaScores.sort((a,b) => b.ipa - a.ipa),
      dominantAgeKey,
      avgScore
    });

    setStep('results');
    window.scrollTo(0,0);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
        <div className="max-w-2xl bg-white p-8 md:p-12 rounded-xl shadow-xl text-center border-t-8 border-blue-600">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Diagnóstico Operativo NyT</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Descubra su Índice de Prioridad de Automatización (IPA) y el paquete de NyTEX ideal para transformar su empresa.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-blue-800 mb-2"><i className="fas fa-info-circle mr-2"></i>¿Qué obtendrá?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>Identificación del Nivel Evolutivo de su Empresa.</li>
              <li>Roadmap de Transformación (Eficiencia y Dirección).</li>
              <li>Cotización y licenciamiento exacto según su etapa.</li>
            </ul>
          </div>
          <button onClick={startDiagnosis} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg text-lg transition-transform transform hover:-translate-y-1">
            Iniciar Diagnóstico Gratuito <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'form') { return ( <div className="min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center items-center"><div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-600"><h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Registro de Diagnóstico</h2><p className="text-gray-500 text-sm text-center mb-6">Por favor, complete estos datos antes de iniciar.</p><form onSubmit={(e) => { e.preventDefault(); setStep('areas'); window.scrollTo(0,0); }} className="space-y-4 text-left"><div><label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la empresa *</label><input required type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={userInfo.companyName} onChange={e => setUserInfo({...userInfo, companyName: e.target.value})} /></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Correo electrónico *</label><input required type="email" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} /></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Nombre de quien realiza el diagnóstico *</label><input required type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={userInfo.userName} onChange={e => setUserInfo({...userInfo, userName: e.target.value})} /></div><div><label className="block text-sm font-bold text-gray-700 mb-1">Puesto (Rol) *</label><input required type="text" className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={userInfo.userRole} onChange={e => setUserInfo({...userInfo, userRole: e.target.value})} /></div><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded shadow-lg mt-6 transition-all hover:scale-105">Comenzar Evaluación <i className="fas fa-arrow-right ml-2"></i></button></form></div></div> ); }
    if (step === 'areas') {
    const area = data.questions.areas[currentAreaIndex];
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center">
        <div className="max-w-3xl w-full bg-white p-6 md:p-10 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Sección: {area.name}</h2>
            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Paso {currentAreaIndex + 1} de {data.questions.areas.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentAreaIndex) / data.questions.areas.length) * 100}%` }}></div>
          </div>
          <div className="space-y-8">
            {area.questions.map((q, idx) => (
              <div key={q.id} className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-semibold text-lg mb-4">{q.text}</p>
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
              onClick={() => currentAreaIndex > 0 ? setCurrentAreaIndex(currentAreaIndex-1) : setStep('welcome')} 
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
    const ageData = data.solutions.ages[results.dominantAgeKey];
    
    // Calcular paquete de impacto y módulos críticos basados en áreas con fugas
    let maxTier = 1;
    let criticalModulesNeeded = [];

      results.areaScores.forEach(area => {
        if (area.ipa > 30) {
          if (area.id === 'operaciones') {
            maxTier = Math.max(maxTier, 2);
            if (!criticalModulesNeeded.includes('NyTEX Inventario y WMS')) criticalModulesNeeded.push('NyTEX Inventario y WMS');
          }
          else if (area.id === 'logistica_y_compras') {
            maxTier = Math.max(maxTier, 3);
            if (!criticalModulesNeeded.includes('NyTEX Compras y Logística')) criticalModulesNeeded.push('NyTEX Compras y Logística');
          }
          else if (area.id === 'recursos_humanos') {
            maxTier = Math.max(maxTier, 3);
            if (!criticalModulesNeeded.includes('NyTEX Recursos Humanos (HRMS)')) criticalModulesNeeded.push('NyTEX Recursos Humanos (HRMS)');
          }
          else if (area.id === 'mercadeo_y_ventas') {
            maxTier = Math.max(maxTier, 3);
            if (!criticalModulesNeeded.includes('NyTEX CRM y Ventas')) criticalModulesNeeded.push('NyTEX CRM y Ventas');
          }
          else if (area.id === 'administracion') {
            maxTier = Math.max(maxTier, 4);
            if (!criticalModulesNeeded.includes('NyTEX Process Suite (BPM)')) criticalModulesNeeded.push('NyTEX Process Suite (BPM)');
          }
          else if (area.id === 'contabilidad_y_finanzas') {
            maxTier = Math.max(maxTier, 4);
            if (!criticalModulesNeeded.includes('NyTEX BI & Flujo de Caja')) criticalModulesNeeded.push('NyTEX BI & Flujo de Caja');
          }
        }
      });

    const ageToTier = { 'infancia': 1, 'juventud': 2, 'madurez': 3, 'plenitud': 4 };
    const currentTier = ageToTier[results.dominantAgeKey];
    
    // El camino de impacto siempre debe ser al menos el nivel actual, idealmente un paso más si hay fugas, a menos que ya estemos en plenitud
    if (maxTier <= currentTier && currentTier < 4) {
      maxTier = currentTier + 1;
    }
    
    if (criticalModulesNeeded.length === 0) {
      criticalModulesNeeded.push('Módulos de integración avanzada');
    }

    let impactKey = 'plenitud';
    if (maxTier === 1) impactKey = 'infancia';
    else if (maxTier === 2) impactKey = 'juventud';
    else if (maxTier === 3) impactKey = 'madurez';
    
    const impactData = data.solutions.ages[impactKey];

    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center">
        <div className="max-w-5xl w-full space-y-8">
          
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Diagnóstico y Plan de Acción</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200 text-left print:border-gray-800"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-gray-500 font-semibold">Empresa:</p><p className="font-bold text-gray-900">{userInfo.companyName}</p></div><div><p className="text-gray-500 font-semibold">Usuario:</p><p className="font-bold text-gray-900">{userInfo.userName}</p></div><div><p className="text-gray-500 font-semibold">Puesto:</p><p className="font-bold text-gray-900">{userInfo.userRole}</p></div><div><p className="text-gray-500 font-semibold">Email:</p><p className="font-bold text-gray-900">{userInfo.email}</p></div></div></div>
              <p className="text-xl text-blue-800 font-bold mb-4">{ageData.title}</p>
            <p className="text-gray-600">{ageData.description}</p>
          </div>

          {/* 1. Detección de Fugas Económicas */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-4 text-red-700"><i className="fas fa-exclamation-triangle mr-2"></i> 1. Fugas Operativas Detectadas</h2>
            <div className="space-y-4">
              {results.areaScores.filter(a => a.ipa > 40).length === 0 ? (
                 <p className="text-green-700">No se detectaron fugas graves en sus procesos evaluados.</p>
              ) : (
                results.areaScores.filter(a => a.ipa > 40).map(area => (
                  <div key={area.id} className="bg-red-50 p-4 border border-red-200 rounded">
                    <h3 className="font-bold text-red-800 mb-1">{area.name}</h3>
                    <p className="text-red-700 mb-2">{area.alertMsg}</p>
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
            <h2 className="text-2xl font-bold mb-4 text-purple-800"><i className="fas fa-route mr-2"></i> 3. El Roadmap de Transformación</h2>
            <p className="text-gray-600 mb-6">Proponemos este plan de consultoría e implementación tecnológica (Consultores NyT):</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.solutions.methodology && data.solutions.methodology.map((fase, idx) => (
                <div key={idx} className="border border-purple-200 rounded p-4 bg-purple-50 shadow-sm flex flex-col">
                  <h3 className="font-bold text-purple-900 mb-1">{fase.fase}</h3>
                  <p className="text-xs text-purple-700 font-semibold mb-2">{fase.enfoque}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mb-3 flex-grow">
                    {fase.practicas.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                  <div className="space-y-2 mt-auto">
                    <div className="bg-white border border-purple-100 p-2 rounded text-xs font-bold text-gray-800">
                      <i className="fas fa-laptop-code text-purple-600 mr-1"></i> {fase.appDigital}
                    </div>
                    {fase.tiempo && (
                      <div className="bg-purple-100 p-2 rounded text-xs text-purple-800">
                        <div className="font-semibold"><i className="fas fa-clock w-4 text-center"></i> Tiempo de Implementación: {fase.tiempo}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Cotización y Licenciamiento */}
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl border-t-4 border-yellow-500 text-white">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500"><i className="fas fa-file-invoice-dollar mr-2"></i> 4. Propuesta de Implementación (Dos Caminos)</h2>
            <p className="text-gray-300 mb-6">Basado en sus resultados, le ofrecemos dos caminos: <strong>Camino 1: Evolutivo</strong>, para crecer con una solución que se adapta a su empresa y evoluciona con ella, y <strong>Camino 2: Impacto Inmediato</strong>, para corregir de inmediato las debilidades específicas detectadas en su IPA (Índice de Prioridad de Automatización según las Fugas Operativas Detectadas).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Opción 1: Crecimiento Evolutivo */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 relative">
                <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase">Camino 1: Evolutivo</div>
                <h3 className="text-2xl font-black text-white mb-2 mt-2">{ageData.paquete}</h3>
                <p className="text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">Ideal para no abrumar a su equipo y avanzar paso a paso.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Implementación</p>
                    <p className="text-xl font-bold text-white">{ageData.precio_implementacion}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Licencia NyTEX</p>
                    <p className="text-xl font-bold text-yellow-500">{ageData.precio_licencia}</p>
                    <p className="text-[10px] text-gray-500 mt-1">(Tarifa Plana: Fijo para toda la empresa)</p>
                  </div>
                </div>

                <div className="bg-gray-700/50 p-4 rounded-lg mb-4 text-sm text-gray-300">
                  <p className="font-bold text-white mb-2">Módulos clave incluidos en su nivel actual:</p>
                  <p>{ageData.modulos.filter(m => !m.startsWith('Todos')).join(', ')}</p>
                </div>
                <p className="text-xs text-gray-400"><i className="fas fa-headset mr-2"></i> {ageData.soporte}</p>
              </div>

              {/* Opción 2: Impacto Inmediato */}
              <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500 relative shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase">Camino 2: Impacto Inmediato</div>
                <h3 className="text-2xl font-black text-white mb-2 mt-2">{impactData.paquete}</h3>
                <p className="text-sm text-blue-300 mb-6 border-b border-blue-800 pb-4">Implementación avanzada para tapar las fugas críticas HOY.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Implementación</p>
                    <p className="text-xl font-bold text-white">{impactData.precio_implementacion}</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Licencia NyTEX</p>
                    <p className="text-xl font-bold text-yellow-400">{impactData.precio_licencia}</p>
                    <p className="text-[10px] text-blue-300 mt-1">(Tarifa Plana: Fijo para toda la empresa)</p>
                  </div>
                </div>

                <div className="bg-blue-800/40 p-4 rounded-lg mb-4 text-sm text-blue-100">
                  <p className="font-bold text-white mb-2">Incluye los módulos exactos para resolver su IPA:</p>
                  <p className="font-semibold text-yellow-300">{criticalModulesNeeded.join(', ')}</p>
                </div>
                <p className="text-xs text-blue-300"><i className="fas fa-headset mr-2"></i> {impactData.soporte}</p>
              </div>

            </div>
          </div>
          
          <div className="text-center pb-8 flex flex-col md:flex-row justify-center items-center gap-4 print:hidden"><button onClick={() => window.print()} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i className="fas fa-file-pdf mr-2"></i> Imprimir en PDF</button><a href={"mailto:" + userInfo.email + "?subject=Resultados%20Diagnostico%20NyT%20-%20" + encodeURIComponent(userInfo.companyName) + "&body=Adjuntamos%20sus%20resultados%20del%20diagnostico.%20(Nota:%20Para%20adjuntar%20el%20PDF%20debe%20guardarlo%20primero%20usando%20el%20boton%20de%20Imprimir)."} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i className="fas fa-envelope mr-2"></i> Enviar a {userInfo.email}</a><a href="/" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i className="fas fa-home mr-2"></i> Regresar al Inicio</a></div>

        </div>
      </div>
    );
  }

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
