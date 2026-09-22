const fs = require('fs');
let code = fs.readFileSync('diagnostico/app.js', 'utf8');

const oldState = "const [userInfo, setUserInfo] = useState({ companyName: '', email: '', userName: '', userRole: '' });";
const newState = \const [userInfo, setUserInfo] = useState(() => {
        try {
            const saved = localStorage.getItem("nyt_user_info");
            return saved ? JSON.parse(saved) : { companyName: "", email: "", userName: "", userRole: "" };
        } catch(e) {
            return { companyName: "", email: "", userName: "", userRole: "" };
        }
    });\;
code = code.replace(oldState, newState);

code = code.replace(/const startDiagnosis = \\(\\).+?setStep\\('form'\\);.+?window\\.scrollTo\\(0,0\\);.+?\\};/s, 
\const startDiagnosis = () => {
      setAreaAnswers({});
      setCurrentAreaIndex(0);
      if (userInfo && userInfo.companyName) {
          setStep('areas');
      } else {
          setStep('form');
      }
      window.scrollTo(0,0);
    };\);

code = code.replace(/onSubmit=\\{\\(e\\).+?setStep\\('areas'\\).+?\\}\\}/s, 
\onSubmit={(e) => { e.preventDefault(); localStorage.setItem('nyt_user_info', JSON.stringify(userInfo)); setStep('areas'); window.scrollTo(0,0); }}\);

fs.writeFileSync('diagnostico/app.js', code, 'utf8');
console.log('Done!');