
const fs = require("fs");
let code = fs.readFileSync("diagnostico/app.js", "utf8");

code = code.replace(
    "const [step, setStep] = useState(\"welcome\");",
    "const [step, setStep] = useState(\"welcome\");\n    const [userInfo, setUserInfo] = useState({ companyName: \"\", email: \"\", userName: \"\", userRole: \"\" });"
);
code = code.replace(
    /const \[step, setStep\] = useState\('welcome'\);/,
    "const [step, setStep] = useState('welcome');\n    const [userInfo, setUserInfo] = useState({ companyName: '', email: '', userName: '', userRole: '' });"
);

code = code.replace(/setStep\('areas'\);/g, "setStep('form');");

const formBlock = "if (step === 'form') { return ( <div className=\"min-h-screen p-4 md:p-8 bg-gray-100 flex justify-center items-center\"><div className=\"max-w-xl w-full bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-600\"><h2 className=\"text-2xl font-bold text-gray-800 mb-2 text-center\">Registro de Diagnóstico</h2><p className=\"text-gray-500 text-sm text-center mb-6\">Por favor, complete estos datos antes de iniciar.</p><form onSubmit={(e) => { e.preventDefault(); setStep('areas'); window.scrollTo(0,0); }} className=\"space-y-4 text-left\"><div><label className=\"block text-sm font-bold text-gray-700 mb-1\">Nombre de la empresa *</label><input required type=\"text\" className=\"w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none\" value={userInfo.companyName} onChange={e => setUserInfo({...userInfo, companyName: e.target.value})} /></div><div><label className=\"block text-sm font-bold text-gray-700 mb-1\">Correo electrónico *</label><input required type=\"email\" className=\"w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none\" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} /></div><div><label className=\"block text-sm font-bold text-gray-700 mb-1\">Nombre de quien realiza el diagnóstico *</label><input required type=\"text\" className=\"w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none\" value={userInfo.userName} onChange={e => setUserInfo({...userInfo, userName: e.target.value})} /></div><div><label className=\"block text-sm font-bold text-gray-700 mb-1\">Puesto (Rol) *</label><input required type=\"text\" className=\"w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none\" value={userInfo.userRole} onChange={e => setUserInfo({...userInfo, userRole: e.target.value})} /></div><button type=\"submit\" className=\"w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded shadow-lg mt-6 transition-all hover:scale-105\">Comenzar Evaluación <i className=\"fas fa-arrow-right ml-2\"></i></button></form></div></div> ); }";

code = code.replace("if (step === 'areas') {", formBlock + "\n    if (step === 'areas') {");

const newButtons = "<div className=\"text-center pb-8 flex flex-col md:flex-row justify-center items-center gap-4 print:hidden\"><button onClick={() => window.print()} className=\"bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full shadow-lg\"><i className=\"fas fa-file-pdf mr-2\"></i> Imprimir en PDF</button><a href={\"mailto:\" + userInfo.email + \"?subject=Resultados%20Diagnostico%20NyT%20-%20\" + encodeURIComponent(userInfo.companyName) + \"&body=Adjuntamos%20sus%20resultados%20del%20diagnostico.%20(Nota:%20Para%20adjuntar%20el%20PDF%20debe%20guardarlo%20primero%20usando%20el%20boton%20de%20Imprimir).\"} className=\"bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg\"><i className=\"fas fa-envelope mr-2\"></i> Enviar a {userInfo.email}</a><a href=\"/\" className=\"bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg\"><i className=\"fas fa-home mr-2\"></i> Regresar al Inicio</a></div>";

code = code.replace(/<div className=\"text-center pb-8\">[\s\S]*?<\/div>/, newButtons);

const infoDisplay = "<div className=\"bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200 text-left print:border-gray-800\"><div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm\"><div><p className=\"text-gray-500 font-semibold\">Empresa:</p><p className=\"font-bold text-gray-900\">{userInfo.companyName}</p></div><div><p className=\"text-gray-500 font-semibold\">Usuario:</p><p className=\"font-bold text-gray-900\">{userInfo.userName}</p></div><div><p className=\"text-gray-500 font-semibold\">Puesto:</p><p className=\"font-bold text-gray-900\">{userInfo.userRole}</p></div><div><p className=\"text-gray-500 font-semibold\">Email:</p><p className=\"font-bold text-gray-900\">{userInfo.email}</p></div></div></div>";

code = code.replace(/<p className=\"text-xl text-blue-800 font-bold mb-4\">\{ageData\.title\}<\/p>/, infoDisplay + "\n              <p className=\"text-xl text-blue-800 font-bold mb-4\">{ageData.title}</p>");

fs.writeFileSync("diagnostico/app.js", code, "utf8");
console.log("App successfully modified");

