
// Función auxiliar para obtener el usuario de la cookie (Sincronizado con auth.js)
function getSessionUser() {
    try {
        const c = document.cookie.split(';').find(c => c.trim().startsWith('gz_session='));
        if (c) {
            const payload = c.trim().split('=')[1];
            return JSON.parse(atob(payload));
        }
    } catch (e) { return null; }
    return null;
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const tab = document.getElementById('tab-' + id);
    const navBtn = document.getElementById('nav-' + id);
    if (tab) tab.classList.add('active');
    if (navBtn) navBtn.classList.add('active');

    // --- LÓGICA DE DESBLOQUEO ADMIN ---
    if (id === 'crud-admin') {
        const user = getSessionUser();
        const guard = document.getElementById('admin-guard');
        const content = document.getElementById('admin-content');

        if (user && user.role === 'admin') {
            if (guard) guard.style.display = 'none';
            if (content) content.style.display = 'block';
            if (window.renderCrudList) window.renderCrudList();
        } else {
            if (guard) guard.style.display = 'block';
            if (content) content.style.display = 'none';
        }
    }

    // Renderizado de contenidos
    switch (id) {
        case 'resultados':      if(window.renderMatches) window.renderMatches(window.currentLeague || 'pl'); break;
        case 'clasificaciones': if(window.renderStandings) window.renderStandings('pl'); break;
        case 'goleadores':      if(window.renderScorers) window.renderScorers('pl'); break;
        case 'champions':       if(window.renderUCL) window.renderUCL(); break;
        case 'mundial':         if(window.renderWorldCup) window.renderWorldCup(); break;
        case 'estadisticas':    if(window.renderStats) window.renderStats(); break;
    }
}

function refreshCurrentTab() {
    const active = document.querySelector('.tab-content.active');
    if (!active) return;
    const id = active.id.replace('tab-', '');
    if (id === 'estadisticas' && window.renderStats) window.renderStats();
    if (id === 'clasificaciones' && window.renderStandings) window.renderStandings('pl');
    if (window.applyTranslations) window.applyTranslations();
}

// ── CRUD: añadir partido ──
function addMatch() {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
        alert('Solo el Administrador puede añadir partidos.');
        return;
    }
    
    const home   = document.getElementById('c-home').value.trim();
    const away   = document.getElementById('c-away').value.trim();
    const gh     = parseInt(document.getElementById('c-gh').value);
    const ga     = parseInt(document.getElementById('c-ga').value);
    const league = document.getElementById('c-league').value;
    const status = document.getElementById('c-status').value;

    if (!home || !away) { alert('Introduce los nombres de ambos equipos.'); return; }

    const today  = new Date();
    const dateStr = today.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });

    if(window.matches) {
        window.matches.push({
            id: window.nextId++, home, away,
            gh: status !== 'next' ? (isNaN(gh) ? 0 : gh) : null,
            ga: status !== 'next' ? (isNaN(ga) ? 0 : ga) : null,
            league, date: dateStr, status,
        });
    }

    // Limpiar campos
    ['c-home', 'c-away', 'c-gh', 'c-ga'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
    });

    if(window.renderCrudList) window.renderCrudList();
    if (window.currentLeague === league && window.renderMatches) window.renderMatches(league);
}

function deleteMatch(id) {
    const user = getSessionUser();
    if (!user || user.role !== 'admin') {
        alert('Solo el Administrador puede eliminar partidos.');
        return;
    }
    if(window.matches) {
        window.matches = window.matches.filter(m => m.id !== id);
    }
    if(window.renderCrudList) window.renderCrudList();
    if(window.renderMatches) window.renderMatches(window.currentLeague);
}

// --- EXPOSICIÓN GLOBAL ---
window.showTab = showTab;
window.refreshCurrentTab = refreshCurrentTab;
window.addMatch = addMatch;
window.deleteMatch = deleteMatch;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    const initialLang = window.lang || localStorage.getItem('gz_lang') || 'es';
    
    if(window.setLang) window.setLang(initialLang);
    if(window.renderMatches) window.renderMatches('pl');
    if(window.updateAuthUI) window.updateAuthUI();
    if(window.applyTranslations) window.applyTranslations();

    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape' && window.closeModal) window.closeModal(); 
    });

    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this && window.closeModal) window.closeModal();
        });
    }
});