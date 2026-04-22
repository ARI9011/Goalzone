
let currentLeague = 'pl';

// ===== PARTIDOS =====
function renderMatches(league) {
    currentLeague = league;
    const filtered = (window.matches || []).filter(m => m.league === league);
    let html = '';

    filtered.forEach(m => {
        const scoreHtml = m.status === 'next'
            ? `<div class="score-box upcoming">vs</div>`
            : `<div class="score-box">${m.gh} &ndash; ${m.ga}</div>`;

        const statusHtml = {
            fin:  `<span class="match-status status-fin">FINALIZADO</span>`,
            live: `<span class="match-status status-live">🔴 EN VIVO</span>`,
            next: `<span class="match-status status-next">PRÓXIMO</span>`,
        }[m.status] || '';

        html += `
            <div class="match-card">
                <div class="match-teams">
                    <div class="team-name">${m.home}</div>
                    ${scoreHtml}
                    <div class="team-name right">${m.away}</div>
                </div>
                <div class="match-info">
                    <span class="match-meta">${m.date} &middot; ${league.toUpperCase()}</span>
                    ${statusHtml}
                </div>
            </div>`;
    });

    const container = document.getElementById('matches-container');
    if (container) {
        container.innerHTML = html || '<div class="card" style="text-align:center;padding:24px;color:rgba(245,240,232,0.45);">No hay partidos disponibles.</div>';
    }

    // Mostrar/Ocultar leyendas de liga
    ['pl', 'll', 'sa'].forEach(l => {
        const el = document.getElementById(`legends-${l}`);
        if(el) el.style.display = league === l ? 'block' : 'none';
    });

    // Activar pestaña visual
    document.querySelectorAll('#res-tabs .league-tab').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active', onclickAttr.includes(`'${league}'`));
    });
}

function filterLeague(l) { renderMatches(l); }

// ===== CLASIFICACIONES =====
function renderStandings(league) {
    const data = window.standings ? window.standings[league] : [];
    let rows = '';
    data.forEach(r => {
        let posClass = r.pos <= 4 ? 'pos-cl' : (r.pos <= 6 ? 'pos-el' : (r.pos >= 16 ? 'pos-rel' : 'pos-n'));
        const diff = r.gf - r.gc;
        
        rows += `
            <tr>
                <td><span class="pos-badge ${posClass}">${r.pos}</span></td>
                <td>${r.team}</td>
                <td>${r.pj}</td><td>${r.pg}</td><td>${r.pe}</td><td>${r.pp}</td>
                <td>${r.gf}</td><td>${r.gc}</td>
                <td>${diff > 0 ? '+' : ''}${diff}</td>
                <td style="font-weight:700;color:var(--dorado);">${r.pts}</td>
            </tr>`;
    });

    const container = document.getElementById('standings-container');
    if (container) {
        container.innerHTML = `
            <div class="card" style="overflow-x:auto;">
                <table class="standings-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>${window.t ? window.t('team_col') : 'Equipo'}</th>
                            <th>${window.t ? window.t('played_col') : 'PJ'}</th>
                            <th>${window.t ? window.t('won_col') : 'PG'}</th>
                            <th>${window.t ? window.t('draw_col') : 'PE'}</th>
                            <th>${window.t ? window.t('lost_col') : 'PP'}</th>
                            <th>${window.t ? window.t('gf_col') : 'GF'}</th>
                            <th>${window.t ? window.t('gc_col') : 'GC'}</th>
                            <th>${window.t ? window.t('diff_col') : 'DG'}</th>
                            <th>${window.t ? window.t('pts_col') : 'PTS'}</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }
}
function filterStandings(l) { renderStandings(l); }

// ===== GOLEADORES =====
function renderScorers(league) {
    const data = window.scorers ? window.scorers[league] : [];
    let html = '';
    data.forEach(s => {
        const medal = s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank;
        html += `
            <div class="scorer-row">
                <div class="scorer-rank">${medal}</div>
                <div class="scorer-info">
                    <div class="scorer-name">${s.name}</div>
                    <div class="scorer-club">${s.club}</div>
                </div>
                <div style="text-align:right;">
                    <div class="scorer-goals">${s.goals}</div>
                    <div class="scorer-assists">${s.assists} ast.</div>
                </div>
            </div>`;
    });
    const container = document.getElementById('scorers-container');
    if (container) container.innerHTML = html;
}
function filterScorers(l) { renderScorers(l); }

// ===== UCL / MUNDIAL / STATS =====
function renderUCL() {
    if(!window.uclGroups) return;
    let groupHtml = '';
    window.uclGroups.forEach(g => {
        const teamRows = g.teams.map(tm =>
            `<div class="ucl-team"><span>${tm.t}</span><span class="ucl-pts">${tm.pts}</span></div>`
        ).join('');
        groupHtml += `<div class="ucl-group"><div class="ucl-group-title">GRUPO ${g.name}</div>${teamRows}</div>`;
    });
    const container = document.getElementById('ucl-groups');
    if(container) container.innerHTML = groupHtml;
}

function renderWorldCup() {
    if(!window.wcGroups) return;
    let html = '';
    window.wcGroups.forEach(g => {
        const teams = g.teams.map(tm => {
            const seed = tm.s ? `<span class="wc-seed">SEDE</span>` : '';
            return `<div class="wc-team"><span>${tm.n}</span>${seed}</div>`;
        }).join('');
        html += `<div class="wc-group"><div class="wc-group-title">GRUPO ${g.g}</div>${teams}</div>`;
    });
    const container = document.getElementById('wc-groups');
    if(container) container.innerHTML = html;
}

function renderStats() {
    if(!window.matches) return;
    const finished = window.matches.filter(m => m.status === 'fin');
    const totalGoals = finished.reduce((s, m) => s + (m.gh || 0) + (m.ga || 0), 0);
    const avg = (totalGoals / Math.max(finished.length, 1)).toFixed(1);

    const container = document.getElementById('stats-cards');
    if (container) {
        container.innerHTML = `
            <div class="stat-card"><div class="stat-num">${window.matches.length}</div><div class="stat-label">${window.t ? window.t('total_matches') : 'Partidos'}</div></div>
            <div class="stat-card"><div class="stat-num">${finished.length}</div><div class="stat-label">${window.t ? window.t('played_label') : 'Jugados'}</div></div>
            <div class="stat-card"><div class="stat-num">${totalGoals}</div><div class="stat-label">${window.t ? window.t('total_goals') : 'Goles'}</div></div>
            <div class="stat-card"><div class="stat-num">${avg}</div><div class="stat-label">${window.t ? window.t('avg_goals') : 'Media'}</div></div>`;
    }
}

// ===== CRUD LIST (Panel Admin) =====
function renderCrudList() {
    const el = document.getElementById('crud-matches-list');
    if (!el || !window.matches) return;

    if (window.matches.length === 0) {
        el.innerHTML = `<div style="text-align:center;padding:20px;color:gray;">No hay partidos.</div>`;
        return;
    }

    let rows = window.matches.map(m => `
        <tr>
            <td style="color:rgba(245,240,232,0.4);">#${m.id}</td>
            <td style="text-align:left;font-weight:600;">${m.home}</td>
            <td style="color:var(--dorado);font-weight:700;">${m.gh !== null ? m.gh : '-'}</td>
            <td style="color:rgba(245,240,232,0.4);">&ndash;</td>
            <td style="color:var(--dorado);font-weight:700;">${m.ga !== null ? m.ga : '-'}</td>
            <td style="text-align:left;font-weight:600;">${m.away}</td>
            <td style="color:rgba(245,240,232,0.5); font-size:11px;">${m.league.toUpperCase()}</td>
            <td><span class="status-badge ${m.status}" style="font-size:9px;">${m.status.toUpperCase()}</span></td>
            <td><button class="btn-del" onclick="deleteMatch(${m.id})" title="Eliminar">🗑</button></td>
        </tr>`).join('');

    el.innerHTML = `
        <table class="standings-table crud-table">
            <thead>
                <tr>
                    <th>ID</th><th style="text-align:left;">LOCAL</th><th>L</th><th>-</th><th>V</th><th style="text-align:left;">VISITANTE</th><th>LIGA</th><th>ESTADO</th><th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// --- EXPOSICIÓN GLOBAL ---
window.currentLeague = currentLeague;
window.renderMatches = renderMatches;
window.filterLeague = filterLeague;
window.renderStandings = renderStandings;
window.filterStandings = filterStandings;
window.renderScorers = renderScorers;
window.filterScorers = filterScorers;
window.renderUCL = renderUCL;
window.renderWorldCup = renderWorldCup;
window.renderStats = renderStats;
window.renderCrudList = renderCrudList;