
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const modalHTML = `
    <!-- MODAL DE REGISTRO PRE-DIAGNÓSTICO -->
    <div id="leadModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300 relative" id="leadModalContent">
            <button onclick="closeLeadModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                <i class="fas fa-times text-xl"></i>
            </button>
            <div class="bg-brand text-white p-6 text-center">
                <h2 class="text-2xl font-bold mb-1">Registro de Diagnóstico</h2>
                <p class="text-brand-accent text-sm">Complete sus datos para iniciar la evaluación gratuita</p>
            </div>
            <div class="p-8">
                <form id="leadForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Nombre de la empresa *</label>
                        <input required type="text" id="lead_company" class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Ej. Corporación XYZ" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Correo electrónico *</label>
                        <input required type="email" id="lead_email" class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="ejemplo@empresa.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Nombre de quien realiza la prueba *</label>
                        <input required type="text" id="lead_name" class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Su nombre completo" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Puesto (Rol) *</label>
                        <input required type="text" id="lead_role" class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Ej. Director de Operaciones" />
                    </div>
                    <button type="submit" class="w-full bg-brand-accent hover:bg-yellow-400 text-brand font-bold py-4 px-4 rounded shadow-lg mt-6 transition-all hover:scale-[1.02]">
                        COMENZAR EVALUACIÓN <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Modal Logic
        const modal = document.getElementById("leadModal");
        const modalContent = document.getElementById("leadModalContent");
        const leadForm = document.getElementById("leadForm");

        function openLeadModal(e) {
            if(e) e.preventDefault();
            modal.classList.remove("hidden");
            // small delay to allow display:block to apply before animating opacity
            setTimeout(() => {
                modal.classList.remove("opacity-0");
                modalContent.classList.remove("scale-95");
            }, 10);
        }

        function closeLeadModal() {
            modal.classList.add("opacity-0");
            modalContent.classList.add("scale-95");
            setTimeout(() => {
                modal.classList.add("hidden");
            }, 300);
        }

        // Intercept all links going to /diagnostico/
        document.querySelectorAll("a[href=\"/diagnostico/\"]").forEach(link => {
            link.addEventListener("click", openLeadModal);
        });

        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                companyName: document.getElementById("lead_company").value,
                email: document.getElementById("lead_email").value,
                userName: document.getElementById("lead_name").value,
                userRole: document.getElementById("lead_role").value
            };
            localStorage.setItem("nyt_user_info", JSON.stringify(data));
            window.location.href = "/diagnostico/";
        });
    </script>
`;

html = html.replace("</body>", modalHTML + "\n</body>");
fs.writeFileSync("index.html", html, "utf8");
console.log("Modal injected into index.html");

