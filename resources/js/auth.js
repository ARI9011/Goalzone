
// --- Helpers de Cookies ---
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Strict`;
}
function getCookie(name) {
    const c = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
    return c ? c.trim().split('=').slice(1).join('=') : null;
}
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
}

// --- 2. Función SHA-256 ---
if (typeof window.sha256 === 'undefined') {
    window.sha256 = async function(message) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    };
}

// --- 3. FUNCIONES DE MODALES (Lo que faltaba) ---
function openModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('open');
        switchModalTab(tab);
        // Limpiar mensajes antiguos
        if(document.getElementById('login-error')) document.getElementById('login-error').textContent = '';
        if(document.getElementById('register-error')) document.getElementById('register-error').textContent = '';
        if(document.getElementById('register-success')) document.getElementById('register-success').textContent = '';
    }
}

function closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
}

function switchModalTab(tab) {
    const loginForm = document.getElementById('mform-login');
    const regForm = document.getElementById('mform-register');
    const loginTab = document.getElementById('mtab-login');
    const regTab = document.getElementById('mtab-register');

    if (loginForm) loginForm.style.display = tab === 'login' ? 'block' : 'none';
    if (regForm) regForm.style.display = tab === 'register' ? 'block' : 'none';
    if (loginTab) loginTab.classList.toggle('active', tab === 'login');
    if (regTab) regTab.classList.toggle('active', tab === 'register');
}

// --- 4. ACCIONES DE BASE DE DATOS ---
async function doLogin() {
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const errEl    = document.getElementById('login-error');

    if (!username || !password) {
        if(errEl) errEl.textContent = "Completa todos los campos.";
        return;
    }

    const hash = await window.sha256(password);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ username, password: hash })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            const userPayload = { username: data.username, role: data.role, name: data.name };
            setCookie('gz_session', btoa(JSON.stringify(userPayload)), 1);
            location.reload(); 
        } else {
            if(errEl) errEl.textContent = "❌ " + (data.message || "Credenciales incorrectas");
        }
    } catch (e) {
        if(errEl) errEl.textContent = "❌ Error de conexión.";
    }
}

async function doRegister() {
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-user').value.trim();
    const pass     = document.getElementById('reg-pass').value;
    const errEl    = document.getElementById('register-error');
    const okEl     = document.getElementById('register-success');

    if(!name || !email || !username || !pass) {
        if(errEl) errEl.textContent = "Completa todos los campos.";
        return;
    }

    const hash = await window.sha256(pass);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ name, email, username, password: hash })
        });

        const data = await response.json();

        if (response.ok && data.status === 'ok') {
            if(okEl) okEl.textContent = "✅ ¡Registrado con éxito!";
            setTimeout(() => { location.reload(); }, 1500);
        } else {
            if(errEl) errEl.textContent = "❌ Error: " + (data.errors?.username || "Usuario ya existe");
        }
    } catch (e) {
        if(errEl) errEl.textContent = "❌ Error de comunicación.";
    }
}

function doLogout() {
    deleteCookie('gz_session');
    location.reload();
}

// --- 5. ACTUALIZAR UI ---
function updateAuthUI() {
    const area = document.getElementById('auth-area');
    if (!area) return;

    const session = getCookie('gz_session');
    if (session) {
        try {
            const user = JSON.parse(atob(session));
            area.innerHTML = `
                <div class="user-badge" onclick="doLogout()">
                    <span class="role-badge ${user.role}">${user.role.toUpperCase()}</span>
                    <span class="user-name">${user.username}</span>
                    <span class="logout-icon">✕</span>
                </div>`;
        } catch (e) { deleteCookie('gz_session'); }
    }
}

// --- 6. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

// Exportar funciones globales para el HTML
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModalTab = switchModalTab;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.doLogout = doLogout;