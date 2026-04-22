<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoalZone — Resultados de Fútbol</title>
    @vite(['resources/css/app.css', 'resources/js/data.js', 'resources/js/i18n.js', 'resources/js/auth.js', 'resources/js/render.js', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body>
    <div id="app">

        <!-- ===== HEADER ===== -->
        <header class="header">
            <div class="header-inner">
                <div class="logo">
                    <div class="logo-icon">GZ</div>
                    <div class="logo-text">GoalZone</div>
                </div>
                <div class="header-controls">
                    <button class="lang-btn active" id="btn-es" onclick="setLang('es')">ES</button>
                    <button class="lang-btn" id="btn-en" onclick="setLang('en')">EN</button>
                    <div id="auth-area">
                        <button class="login-btn" onclick="openModal('login')" id="login-btn-text">Iniciar Sesión</button>
                        <button class="register-btn" onclick="openModal('register')">Registrarse</button>
                    </div>
                </div>
            </div>
        </header>

        <!-- ===== NAV ===== -->
        <nav class="nav">
            <div class="nav-inner">
                <button class="nav-btn active" onclick="showTab('resultados')" id="nav-resultados" data-i18n="nav_resultados">Resultados</button>
                <button class="nav-btn" onclick="showTab('clasificaciones')" id="nav-clasificaciones" data-i18n="nav_clasificaciones">Clasificaciones</button>
                <button class="nav-btn" onclick="showTab('goleadores')" id="nav-goleadores" data-i18n="nav_goleadores">Goleadores</button>
                <button class="nav-btn" onclick="showTab('leyendas')" id="nav-leyendas" data-i18n="nav_leyendas">Leyendas</button>
                <button class="nav-btn" onclick="showTab('champions')" id="nav-champions">Champions League</button>
                <button class="nav-btn" onclick="showTab('mundial')" id="nav-mundial" data-i18n="nav_mundial">Mundial 2026</button>
                <button class="nav-btn" onclick="showTab('estadisticas')" id="nav-estadisticas" data-i18n="nav_estadisticas">Estadísticas</button>
                <button class="nav-btn" onclick="showTab('nosotros')" id="nav-nosotros" data-i18n="nav_nosotros">Nosotros</button>
                <button class="nav-btn admin-nav" onclick="showTab('crud-admin')" id="nav-crud-admin" data-i18n="nav_crud">Panel Admin</button>
            </div>
        </nav>

        <!-- ===== MAIN ===== -->
        <main class="main">

            <!-- ── TAB: RESULTADOS ── -->
            <div class="tab-content active" id="tab-resultados">
                <div class="hero">
                    <h1 id="hero-title">RESULTADOS EN VIVO</h1>
                    <p id="hero-sub">Premier League · La Liga · Serie A · Champions League</p>
                </div>

                <div class="league-tabs" id="res-tabs">
                    <button class="league-tab pl active" onclick="filterLeague('pl')">Premier League</button>
                    <button class="league-tab ll" onclick="filterLeague('ll')">La Liga</button>
                    <button class="league-tab sa" onclick="filterLeague('sa')">Serie A</button>
                </div>

                <div id="matches-container">
                    @foreach($matches as $match)
                    <div class="match-card" data-league="{{ $match->league }}">
                        <div class="match-header">
                            <span class="league-name">{{ strtoupper($match->league) }}</span>
                            <span class="match-status">{{ $match->status }}</span>
                        </div>
                        <div class="match-teams">
                            <div class="team">
                                <span class="team-name">{{ $match->home_team }}</span>
                            </div>
                            <div class="score">
                                {{ $match->goals_home ?? 0 }} - {{ $match->goals_away ?? 0 }}
                            </div>
                            <div class="team">
                                <span class="team-name">{{ $match->away_team }}</span>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <!-- ── TAB: CLASIFICACIONES ── -->
            <div class="tab-content" id="tab-clasificaciones">
                <div class="section-title">CLASIFICACIONES</div>
                <div class="league-tabs" id="stand-tabs">
                    <button class="league-tab pl active" onclick="filterStandings('pl')">Premier League</button>
                    <button class="league-tab ll" onclick="filterStandings('ll')">La Liga</button>
                    <button class="league-tab sa" onclick="filterStandings('sa')">Serie A</button>
                </div>
                <div id="standings-container"></div>
                <div class="standings-legend">
                    <span class="sl-item"><span class="sl-dot pos-cl"></span> Champions League</span>
                    <span class="sl-item"><span class="sl-dot pos-el"></span> Europa League</span>
                    <span class="sl-item"><span class="sl-dot pos-rel"></span> Descenso</span>
                </div>
            </div>

            <!-- ── TAB: GOLEADORES ── -->
            <div class="tab-content" id="tab-goleadores">
                <div class="section-title">MÁXIMOS GOLEADORES</div>
                <div class="league-tabs" id="scorer-tabs">
                    <button class="league-tab pl active" onclick="filterScorers('pl')">Premier League</button>
                    <button class="league-tab ll" onclick="filterScorers('ll')">La Liga</button>
                    <button class="league-tab sa" onclick="filterScorers('sa')">Serie A</button>
                </div>
                <div id="scorers-container" class="card"></div>
            </div>

            <!-- ── TAB: LEYENDAS ── -->
            <div class="tab-content" id="tab-leyendas">
                <div class="hero" style="background:linear-gradient(135deg,#001428 0%,#3d0060 50%,#8B0000 100%);">
                    <h1>LEYENDAS DEL FÚTBOL</h1>
                    <p>Los jugadores más emblemáticos de cada gran liga</p>
                </div>

                <!-- Premier League -->
                <div class="legend-league-block">
                    <div class="legend-league-header pl-header">
                        <span class="league-flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                        <h2>PREMIER LEAGUE</h2>
                        <span class="league-years">Leyendas históricas</span>
                    </div>
                    <div class="legends-cards-grid">

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/henry.jpeg') }}" alt="Thierry Henry" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇫🇷</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">THIERRY HENRY</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club arsenal-badge">⚫🔴 Arsenal</span>
                                    <span class="legend-years-badge">1999 – 2007</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">228</span><span class="ls-label">Goles PL</span></div>
                                    <div class="ls-stat"><span class="ls-num">4</span><span class="ls-label">Botas de Oro</span></div>
                                    <div class="ls-stat"><span class="ls-num">2</span><span class="ls-label">Títulos Liga</span></div>
                                </div>
                                <p class="legend-bio">
                                    Considerado el mejor delantero de la historia de la Premier League, Henry revolucionó el ataque del Arsenal bajo las órdenes de Arsène Wenger. Rápido, técnico y letal de cara al gol, sus 228 tantos en la Premier League siguen siendo un referente. Fue pieza clave del invicto Arsenal de 2003-04, el legendario equipo de los "Invencibles".
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🏆 Premier League ×2</span>
                                    <span class="achievement-badge">🥅 Pichichi PL ×4</span>
                                    <span class="achievement-badge">🌍 Mundial 1998</span>
                                    <span class="achievement-badge">⭐ Invencibles 04</span>
                                </div>
                            </div>
                        </div>

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/drogba.jpeg') }}" alt="Didier Drogba" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇨🇮</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">DIDIER DROGBA</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club chelsea-badge">💙 Chelsea FC</span>
                                    <span class="legend-years-badge">2004 – 2012</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">164</span><span class="ls-label">Goles PL</span></div>
                                    <div class="ls-stat"><span class="ls-num">4</span><span class="ls-label">Títulos Liga</span></div>
                                    <div class="ls-stat"><span class="ls-num">1</span><span class="ls-label">Champions</span></div>
                                </div>
                                <p class="legend-bio">
                                    Fuerza, potencia y un instinto goleador único. Didier Drogba es sin duda el mayor ídolo de la historia del Chelsea. Marcó en cuatro finales de FA Cup y fue decisivo en la Champions de 2012, empatando en el último minuto y convirtiendo el penalti decisivo. Henry y Drogba no coincidieron en un mismo club, pero su rivalidad Arsenal-Chelsea es eterna.
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🏆 Premier League ×4</span>
                                    <span class="achievement-badge">🏆 Champions 2012</span>
                                    <span class="achievement-badge">🥅 Pichichi PL ×2</span>
                                    <span class="achievement-badge">🌍 Copa África ×1</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div><!-- /Premier -->

                <!-- La Liga -->
                <div class="legend-league-block">
                    <div class="legend-league-header ll-header">
                        <span class="league-flag">🇪🇸</span>
                        <h2>LA LIGA</h2>
                        <span class="league-years">La rivalidad más grande</span>
                    </div>
                    <div class="legends-cards-grid">

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/LeoMessi20092010_pic_fcb-arsenal62.webp') }}" alt="Lionel Messi" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇦🇷</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">LIONEL MESSI</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club barca-badge">🔵🔴 FC Barcelona</span>
                                    <span class="legend-years-badge">2004 – 2021</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">474</span><span class="ls-label">Goles Liga</span></div>
                                    <div class="ls-stat"><span class="ls-num">8</span><span class="ls-label">Balones de Oro</span></div>
                                    <div class="ls-stat"><span class="ls-num">10</span><span class="ls-label">Títulos Liga</span></div>
                                </div>
                                <p class="legend-bio">
                                    El mejor jugador de la historia del FC Barcelona y, para muchos, de la historia del fútbol. Messi llegó a La Masia con 13 años y se convirtió en el símbolo de una era dorada. Con 474 goles en La Liga, es el máximo goleador histórico de la competición. Su magia, regate y visión de juego son irrepetibles. Compartió épica rivalidad con Cristiano Ronaldo durante más de una década.
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🏆 La Liga ×10</span>
                                    <span class="achievement-badge">🏆 Champions ×4</span>
                                    <span class="achievement-badge">🌍 Mundial 2022</span>
                                    <span class="achievement-badge">⭐ Balón de Oro ×8</span>
                                </div>
                            </div>
                        </div>

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/xd.jpeg') }}" alt="Cristiano Ronaldo" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇵🇹</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">CRISTIANO RONALDO</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club rmadrid-badge">⚪ Real Madrid</span>
                                    <span class="legend-years-badge">2009 – 2018</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">450</span><span class="ls-label">Goles Liga</span></div>
                                    <div class="ls-stat"><span class="ls-num">5</span><span class="ls-label">Balones de Oro</span></div>
                                    <div class="ls-stat"><span class="ls-num">4</span><span class="ls-label">Champions</span></div>
                                </div>
                                <p class="legend-bio">
                                    El goleador más devastador que ha visto La Liga. Cristiano Ronaldo llegó al Real Madrid en 2009 y en nueve temporadas marcó 450 goles en Liga, incluyendo cinco temporadas con más de 40 goles. Su rivalidad con Messi elevó el nivel del fútbol mundial a cotas insuperables. Potente, ambicioso y con una capacidad atlética extraordinaria, es el símbolo del Madrid en la era Champions.
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🏆 La Liga ×2</span>
                                    <span class="achievement-badge">🏆 Champions ×4</span>
                                    <span class="achievement-badge">🥅 Pichichi ×3</span>
                                    <span class="achievement-badge">🌍 Euro 2016</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div><!-- /La Liga -->

                <!-- Serie A -->
                <div class="legend-league-block">
                    <div class="legend-league-header sa-header">
                        <span class="league-flag">🇮🇹</span>
                        <h2>SERIE A</h2>
                        <span class="league-years">Dos genios de distinta época</span>
                    </div>
                    <div class="legends-cards-grid">

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/nazario.jpeg') }}" alt="Ronaldo Nazário" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇧🇷</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">RONALDO NAZÁRIO</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club inter-badge">⚫🔵 Inter Milan</span>
                                    <span class="legend-years-badge">1997 – 2002</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">49</span><span class="ls-label">Goles Serie A</span></div>
                                    <div class="ls-stat"><span class="ls-num">2</span><span class="ls-label">Balones de Oro</span></div>
                                    <div class="ls-stat"><span class="ls-num">2</span><span class="ls-label">Mundiales</span></div>
                                </div>
                                <p class="legend-bio">
                                    "El Fenómeno". Antes de que las lesiones frenaran su carrera, Ronaldo Nazário fue simplemente el mejor jugador del mundo. En el Inter de Milán demostró ser imparable: regate imposible, potencia y una definición perfecta. Su corte de pelo dente-de-leite en el Mundial 2002 y sus actuaciones en el Bernabéu son parte de la historia eterna del fútbol. No coincidió con Maradona en activo.
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🌍 Mundial ×2 (94,02)</span>
                                    <span class="achievement-badge">⭐ Balón de Oro ×2</span>
                                    <span class="achievement-badge">🏆 Copa UEFA 1998</span>
                                    <span class="achievement-badge">🐐 El Fenómeno</span>
                                </div>
                            </div>
                        </div>

                        <div class="legend-full-card">
                            <div class="legend-portrait-wrap">
                                <img src="{{ asset('img/images.jpeg') }}" alt="Diego Maradona" class="legend-portrait" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                                <div class="legend-portrait-fallback" style="display:none;">🇦🇷</div>
                            </div>
                            <div class="legend-info">
                                <h3 class="legend-fullname">DIEGO MARADONA</h3>
                                <div class="legend-meta-row">
                                    <span class="legend-club napoli-badge">🔵⚪ SSC Napoli</span>
                                    <span class="legend-years-badge">1984 – 1991</span>
                                </div>
                                <div class="legend-stats-mini">
                                    <div class="ls-stat"><span class="ls-num">115</span><span class="ls-label">Goles Napoli</span></div>
                                    <div class="ls-stat"><span class="ls-num">2</span><span class="ls-label">Scudetti</span></div>
                                    <div class="ls-stat"><span class="ls-num">1</span><span class="ls-label">Mundial 1986</span></div>
                                </div>
                                <p class="legend-bio">
                                    El dios del calcio italiano. Diego Maradona convirtió al humilde Nápoli en el equipo más temido de Europa. Ganó dos Scudetti (1987 y 1990), una Copa UEFA y una Copa Italia, algo impensable antes de su llegada. Su genio individual, su zurda mágica y su liderazgo transformaron una ciudad entera. Maradona y Ronaldo Nazário no coincidieron en activo en la Serie A, pero ambos son eternos.
                                </p>
                                <div class="legend-achievements">
                                    <span class="achievement-badge">🌍 Mundial 1986 🇦🇷</span>
                                    <span class="achievement-badge">🏆 Scudetto ×2</span>
                                    <span class="achievement-badge">🏆 Copa UEFA 1989</span>
                                    <span class="achievement-badge">🐐 Mano de Dios</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- ── TAB: CHAMPIONS ── -->
            <div class="tab-content" id="tab-champions">
                <div class="hero hero-ucl">
                    <h1>UEFA CHAMPIONS LEAGUE</h1>
                    <p>2024/25 · Fase de Grupos &amp; Eliminatorias</p>
                </div>
                <div class="ucl-phase section-gap">
                    <div class="ucl-phase-title">FASE DE GRUPOS</div>
                    <div class="ucl-group-grid" id="ucl-groups"></div>
                </div>
                <div class="ucl-phase section-gap">
                    <div class="ucl-phase-title">OCTAVOS DE FINAL</div>
                    <div class="card">
                        <div class="two-col-grid" id="ucl-r16-content"></div>
                    </div>
                </div>
                <div class="ucl-phase section-gap">
                    <div class="ucl-phase-title">CUARTOS DE FINAL</div>
                    <div class="card">
                        <div class="two-col-grid" id="ucl-qf-content"></div>
                    </div>
                </div>
            </div>

            <!-- ── TAB: MUNDIAL ── -->
            <div class="tab-content" id="tab-mundial">
                <div class="hero hero-wc">
                    <h1>MUNDIAL 2026</h1>
                    <p>🇺🇸 USA · 🇨🇦 CANADÁ · 🇲🇽 MÉXICO · 48 Selecciones · 12 Grupos</p>
                </div>
                <div class="section-title">GRUPOS DE LA FASE INICIAL</div>
                <div class="wc-groups" id="wc-groups"></div>
            </div>

            <!-- ── TAB: ESTADÍSTICAS ── -->
            <div class="tab-content" id="tab-estadisticas">
                <div class="section-title">ESTADÍSTICAS GENERALES</div>
                <div class="grid-4 section-gap" id="stats-cards"></div>
                <div class="section-title">MÉTRICAS POR LIGA</div>
                <div class="grid-3" id="league-stats"></div>
            </div>

            <!-- ── TAB: NOSOTROS ── -->
            <div class="tab-content" id="tab-nosotros">
                <div class="about-section">
                    <h2>SOBRE GOALZONE</h2>
                    <p>GoalZone es una plataforma web dedicada a los amantes del fútbol mundial. Nuestro objetivo es centralizar los resultados, estadísticas y clasificaciones de las tres ligas más importantes del mundo.</p>
                    <p>Diseñada con los colores azulgrana del FC Barcelona y construida con PHP + Laravel 11 + MySQL + los 4 pilares de la POO, GoalZone es también un proyecto académico que demuestra buenas prácticas de desarrollo web.</p>
                    <div class="about-features-grid">
                        <div class="about-feature">
                            <div class="about-icon">⚽</div>
                            <div class="about-text">
                                <h4>RESULTADOS EN VIVO</h4>
                                <p>Partidos de las 3 ligas más grandes del mundo.</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-icon">🏆</div>
                            <div class="about-text">
                                <h4>CHAMPIONS LEAGUE</h4>
                                <p>Fase de grupos, octavos y cuartos de final.</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-icon">⭐</div>
                            <div class="about-text">
                                <h4>LEYENDAS</h4>
                                <p>Los jugadores más icónicos de cada liga con retratos ilustrados.</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-icon">🌍</div>
                            <div class="about-text">
                                <h4>MUNDIAL 2026</h4>
                                <p>Los 12 grupos con las 48 selecciones participantes.</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-icon">🔐</div>
                            <div class="about-text">
                                <h4>SHA-256 + COOKIES</h4>
                                <p>Autenticación segura con hash y sesiones con cookies.</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-icon">🌐</div>
                            <div class="about-text">
                                <h4>ES / EN</h4>
                                <p>Cambio de idioma con localStorage para recordar la preferencia.</p>
                            </div>
                        </div>
                    </div>
                    <div class="section-title" style="margin-top:28px;">TECNOLOGÍAS</div>
                    <div class="tech-badges">
                        <span class="tech-badge">HTML5</span><span class="tech-badge">CSS3</span>
                        <span class="tech-badge">JavaScript ES2023</span><span class="tech-badge">PHP 8 + POO</span>
                        <span class="tech-badge">Laravel 11</span><span class="tech-badge">MySQL Workbench</span>
                        <span class="tech-badge">SHA-256</span><span class="tech-badge">Cookies HTTP</span>
                        <span class="tech-badge">MVC / Eloquent</span><span class="tech-badge">i18n</span>
                    </div>
                    <div class="section-title" style="margin-top:28px;">4 PILARES POO</div>
                    <div class="poo-grid">
                        <div class="poo-card">
                            <div class="poo-icon">🔒</div>
                            <h4>ENCAPSULAMIENTO</h4>
                            <p>Contraseñas privadas con getters. <code>$hidden=['password_hash']</code> en el modelo User.</p>
                        </div>
                        <div class="poo-card">
                            <div class="poo-icon">🧬</div>
                            <h4>HERENCIA</h4>
                            <p><code>BaseModel → User, Match, Scorer</code><br><code>AbstractRepo → MatchRepo</code></p>
                        </div>
                        <div class="poo-card">
                            <div class="poo-icon">🔄</div>
                            <h4>POLIMORFISMO</h4>
                            <p><code>LeagueInterface</code> implementada por PremierLeague, LaLiga y SerieA.</p>
                        </div>
                        <div class="poo-card">
                            <div class="poo-icon">🎭</div>
                            <h4>ABSTRACCIÓN</h4>
                            <p>Clase abstracta <code>AbstractRepository</code> define el contrato CRUD sin implementación.</p>
                        </div>
                    </div>
                    <div class="about-quote">
                        <p>"El fútbol no es solo un deporte, es la emoción de millones de personas unidas por una misma pasión."</p>
                    </div>
                </div>
            </div>

            <!-- ── TAB: ADMIN CRUD ── -->
            <div class="tab-content" id="tab-crud-admin">
                <div id="admin-guard">
                    <div class="card" style="text-align:center;padding:48px;">
                        <div style="font-size:52px;margin-bottom:16px;">🔐</div>
                        <div class="section-title" style="justify-content:center;">ÁREA RESTRINGIDA</div>
                        <p style="color:rgba(245,240,232,0.55);margin-bottom:22px;">Debes iniciar sesión como <strong style="color:var(--dorado);">Administrador</strong> para gestionar partidos.</p>
                        <button class="btn-primary" style="width:auto;padding:10px 28px;" onclick="openModal('login')">Iniciar Sesión</button>
                    </div>
                </div>
                <div id="admin-content" style="display:none;">
                    <div class="admin-panel">
                        <div class="admin-title">🛡️ PANEL DE ADMINISTRACIÓN</div>
                        <div id="admin-user-info"></div>
                        <div class="cookie-info" id="cookie-info"></div>
                    </div>
                    <div class="section-title">GESTIÓN DE PARTIDOS — CRUD</div>
                    <div class="crud-section">
                        <div class="crud-form-grid">
                            <div><label class="crud-label">LOCAL</label><input class="crud-input" id="c-home" placeholder="Ej: Arsenal"></div>
                            <div><label class="crud-label">GOL L</label><input class="crud-input" id="c-gh" type="number" min="0" placeholder="0" style="text-align:center;"></div>
                            <div><label class="crud-label">GOL V</label><input class="crud-input" id="c-ga" type="number" min="0" placeholder="0" style="text-align:center;"></div>
                            <div><label class="crud-label">VISITANTE</label><input class="crud-input" id="c-away" placeholder="Ej: Chelsea"></div>
                            <div><label class="crud-label">LIGA</label>
                                <select class="crud-input" id="c-league">
                                    <option value="pl">Premier League</option>
                                    <option value="ll">La Liga</option>
                                    <option value="sa">Serie A</option>
                                </select>
                            </div>
                            <div><label class="crud-label">ESTADO</label>
                                <select class="crud-input" id="c-status">
                                    <option value="fin">Finalizado</option>
                                    <option value="next">Próximo</option>
                                    <option value="live">En Vivo</option>
                                </select>
                            </div>
                            <div style="align-self:end;"><button class="btn-add" onclick="addMatch()">+ AÑADIR</button></div>
                        </div>
                        <div id="crud-matches-list" style="margin-top:16px;overflow-x:auto;"></div>
                    </div>
                </div>
            </div>

        </main>
    </div><!-- /app -->

    <!-- ===== MODAL: LOGIN / REGISTER ===== -->
    <div class="modal-overlay" id="auth-modal">
        <div class="modal-box">
            <button class="modal-close" onclick="closeModal()">✕</button>

            <!-- TABS dentro del modal -->
            <div class="modal-tabs">
                <button class="modal-tab active" id="mtab-login" onclick="switchModalTab('login')">INICIAR SESIÓN</button>
                <button class="modal-tab" id="mtab-register" onclick="switchModalTab('register')">REGISTRARSE</button>
            </div>

            <!-- LOGIN FORM -->
            <div id="mform-login">
                <div class="form-group">
                    <label>USUARIO</label>
                    <input type="text" id="login-user" placeholder="admin o user1" autocomplete="username">
                </div>
                <div class="form-group">
                    <label>CONTRASEÑA</label>
                    <input type="password" id="login-pass" placeholder="••••••••" autocomplete="current-password" oninput="updateShaDemo('login-pass','sha-display-login')">
                </div>
                <div style="margin-bottom:14px;">
                    <div class="sha-label">SHA-256 en vivo:</div>
                    <div class="sha-demo" id="sha-display-login">Escribe la contraseña para ver su hash...</div>
                </div>
                <button class="btn-primary" onclick="doLogin()">INICIAR SESIÓN</button>
                <p class="modal-hint">Admin: admin / Admin123! &nbsp;|&nbsp; User: user1 / User123!</p>
                <div id="login-error" class="form-error"></div>
            </div>

            <!-- REGISTER FORM -->
            <div id="mform-register" style="display:none;">
                <div class="form-group">
                    <label>NOMBRE COMPLETO</label>
                    <input type="text" id="reg-name" placeholder="Ej: Juan García" autocomplete="name">
                </div>
                <div class="form-group">
                    <label>EMAIL</label>
                    <input type="email" id="reg-email" placeholder="correo@ejemplo.com" autocomplete="email">
                </div>
                <div class="form-group">
                    <label>USUARIO</label>
                    <input type="text" id="reg-user" placeholder="Sin espacios, mín. 4 caracteres" autocomplete="username">
                </div>
                <div class="form-group">
                    <label>CONTRASEÑA</label>
                    <input type="password" id="reg-pass" placeholder="Mín. 8 caracteres" autocomplete="new-password" oninput="updateShaDemo('reg-pass','sha-display-reg');checkPasswordStrength()">
                </div>
                <div class="password-strength" id="pass-strength"></div>
                <div class="form-group">
                    <label>CONFIRMAR CONTRASEÑA</label>
                    <input type="password" id="reg-pass2" placeholder="Repite la contraseña" autocomplete="new-password">
                </div>
                <div style="margin-bottom:14px;">
                    <div class="sha-label">SHA-256 de tu contraseña:</div>
                    <div class="sha-demo" id="sha-display-reg">Escribe la contraseña para ver su hash SHA-256...</div>
                </div>
                <div class="form-group" style="display:flex;align-items:center;gap:10px;">
                    <input type="checkbox" id="reg-terms" style="width:16px;height:16px;accent-color:var(--dorado);">
                    <label style="color:rgba(245,240,232,0.6);font-size:12px;letter-spacing:0;">
                        Acepto los <a href="#" style="color:var(--dorado);">términos de uso</a> de GoalZone
                    </label>
                </div>
                <button class="btn-primary" onclick="doRegister()">CREAR CUENTA</button>
                <div id="register-error" class="form-error"></div>
                <div id="register-success" class="form-success"></div>
            </div>

        </div>
    </div>

</body>

</html>