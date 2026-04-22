// ============================================================
//  GoalZone — i18n.js
//  Sistema de internacionalización ES / EN con localStorage
// ============================================================

const translations = {
  es: {
    nav_resultados:    'Resultados',
    nav_clasificaciones:'Clasificaciones',
    nav_goleadores:    'Goleadores',
    nav_mundial:       'Mundial 2026',
    nav_estadisticas:  'Estadísticas',
    nav_nosotros:      'Nosotros',
    nav_crud:          'Panel Admin',
    pl_name:           'Premier League',
    ll_name:           'La Liga',
    sa_name:           'Serie A',
    hero_title:        'RESULTADOS EN VIVO',
    hero_sub:          'Premier League · La Liga · Serie A · Champions League',
    login_btn:         'Iniciar Sesión',
    logout_btn:        'Cerrar Sesión',
    label_user:        'USUARIO',
    label_pass:        'CONTRASEÑA',
    admin_locked:      'ÁREA RESTRINGIDA',
    admin_login_req:   'Debes iniciar sesión como administrador para acceder.',
    btn_add:           '+ AÑADIR PARTIDO',
    cookie_msg:        'Cookie de sesión activa: gz_session guardada (en producción PHP: HTTPOnly; Secure; SameSite=Strict)',
    role_admin:        'Administrador',
    role_user:         'Usuario',
    modal_title:       'INICIAR SESIÓN',
    team_col:          'EQUIPO',
    played_col:        'PJ',
    won_col:           'PG',
    draw_col:          'PE',
    lost_col:          'PP',
    gf_col:            'GF',
    gc_col:            'GC',
    diff_col:          'DG',
    pts_col:           'PTS',
    total_matches:     'PARTIDOS TOTALES',
    played_label:      'JUGADOS',
    total_goals:       'GOLES TOTALES',
    avg_goals:         'MEDIA GOLES',
    top_scorer_label:  'TOP GOLEADOR',
  },
  en: {
    nav_resultados:    'Results',
    nav_clasificaciones:'Standings',
    nav_goleadores:    'Top Scorers',
    nav_mundial:       'World Cup 2026',
    nav_estadisticas:  'Statistics',
    nav_nosotros:      'About',
    nav_crud:          'Admin Panel',
    pl_name:           'Premier League',
    ll_name:           'La Liga',
    sa_name:           'Serie A',
    hero_title:        'LIVE RESULTS',
    hero_sub:          'Premier League · La Liga · Serie A · Champions League',
    login_btn:         'Sign In',
    logout_btn:        'Sign Out',
    label_user:        'USERNAME',
    label_pass:        'PASSWORD',
    admin_locked:      'RESTRICTED AREA',
    admin_login_req:   'You must sign in as administrator to access this section.',
    btn_add:           '+ ADD MATCH',
    cookie_msg:        'Active session cookie: gz_session stored (in PHP production: HTTPOnly; Secure; SameSite=Strict)',
    role_admin:        'Administrator',
    role_user:         'User',
    modal_title:       'SIGN IN',
    team_col:          'TEAM',
    played_col:        'MP',
    won_col:           'W',
    draw_col:          'D',
    lost_col:          'L',
    gf_col:            'GF',
    gc_col:            'GA',
    diff_col:          'GD',
    pts_col:           'PTS',
    total_matches:     'TOTAL MATCHES',
    played_label:      'PLAYED',
    total_goals:       'TOTAL GOALS',
    avg_goals:         'AVG GOALS',
    top_scorer_label:  'TOP SCORER',
  },
};

let lang = localStorage.getItem('gz_lang') || 'es';

function getCurrentUser() {
    try {
        const c = getCookie('gz_session');
        return c ? JSON.parse(atob(c)) : null;
    } catch (e) { return null; }
}

function t(key) {
    return translations[lang][key] || key;
}

function applyTranslations() {
    const user = getCurrentUser();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    if(document.getElementById('hero-title')) document.getElementById('hero-title').textContent = t('hero_title');
    if(document.getElementById('hero-sub'))   document.getElementById('hero-sub').textContent   = t('hero_sub');

    const loginBtn = document.getElementById('login-btn-text');
    if (loginBtn) {
        loginBtn.textContent = user ? t('logout_btn') : t('login_btn');
    }
}

function setLang(l) {
    lang = l;
    localStorage.setItem('gz_lang', l);
    applyTranslations();
}

document.addEventListener('DOMContentLoaded', applyTranslations);
window.setLang = setLang; window.t = t; window.applyTranslations = applyTranslations;

window.setLang = setLang;
window.t = t;
window.applyTranslations = applyTranslations;