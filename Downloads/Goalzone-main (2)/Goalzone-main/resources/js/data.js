
// Partidos (BD en memoria; en producción vendrían del API Laravel/MySQL)
let matches = [
  // PREMIER LEAGUE
  { id:1,  home:'Manchester City', away:'Arsenal',       gh:2,    ga:1,    league:'pl', date:'18 Abr 2025', status:'fin'  },
  { id:2,  home:'Liverpool',       away:'Chelsea',       gh:3,    ga:1,    league:'pl', date:'18 Abr 2025', status:'fin'  },
  { id:3,  home:'Man United',      away:'Tottenham',     gh:1,    ga:1,    league:'pl', date:'19 Abr 2025', status:'live' },
  { id:4,  home:'Aston Villa',     away:'Newcastle',     gh:null, ga:null, league:'pl', date:'20 Abr 2025', status:'next' },
  { id:5,  home:'Brighton',        away:'Brentford',     gh:null, ga:null, league:'pl', date:'21 Abr 2025', status:'next' },
  // LA LIGA
  { id:6,  home:'Real Madrid',     away:'FC Barcelona',  gh:2,    ga:2,    league:'ll', date:'17 Abr 2025', status:'fin'  },
  { id:7,  home:'Atlético Madrid', away:'Sevilla',       gh:1,    ga:0,    league:'ll', date:'18 Abr 2025', status:'fin'  },
  { id:8,  home:'Valencia',        away:'Villarreal',    gh:2,    ga:3,    league:'ll', date:'19 Abr 2025', status:'live' },
  { id:9,  home:'Real Sociedad',   away:'Athletic Club', gh:null, ga:null, league:'ll', date:'20 Abr 2025', status:'next' },
  { id:10, home:'Celta Vigo',      away:'Getafe',        gh:null, ga:null, league:'ll', date:'21 Abr 2025', status:'next' },
  // SERIE A
  { id:11, home:'Inter Milan',     away:'AC Milan',      gh:2,    ga:0,    league:'sa', date:'17 Abr 2025', status:'fin'  },
  { id:12, home:'Juventus',        away:'Napoli',        gh:1,    ga:1,    league:'sa', date:'18 Abr 2025', status:'fin'  },
  { id:13, home:'Roma',            away:'Lazio',         gh:null, ga:null, league:'sa', date:'19 Abr 2025', status:'next' },
  { id:14, home:'Atalanta',        away:'Fiorentina',    gh:null, ga:null, league:'sa', date:'20 Abr 2025', status:'next' },
  { id:15, home:'Torino',          away:'Udinese',       gh:1,    ga:2,    league:'sa', date:'16 Abr 2025', status:'fin'  },
];
let nextId = 16;

// Clasificaciones
const standings = {
  pl: [
    { pos:1,  team:'Arsenal',       pts:75, pj:32, pg:23, pe:6,  pp:3,  gf:71, gc:28 },
    { pos:2,  team:'Man. City',     pts:71, pj:32, pg:21, pe:8,  pp:3,  gf:68, gc:32 },
    { pos:3,  team:'Liverpool',     pts:68, pj:32, pg:20, pe:8,  pp:4,  gf:74, gc:40 },
    { pos:4,  team:'Chelsea',       pts:62, pj:32, pg:18, pe:8,  pp:6,  gf:62, gc:40 },
    { pos:5,  team:'Aston Villa',   pts:59, pj:32, pg:17, pe:8,  pp:7,  gf:68, gc:51 },
    { pos:6,  team:'Newcastle',     pts:55, pj:32, pg:16, pe:7,  pp:9,  gf:64, gc:48 },
    { pos:7,  team:'Tottenham',     pts:51, pj:32, pg:14, pe:9,  pp:9,  gf:57, gc:56 },
    { pos:8,  team:'Brighton',      pts:47, pj:32, pg:13, pe:8,  pp:11, gf:59, gc:54 },
    { pos:9,  team:'Brentford',     pts:44, pj:32, pg:12, pe:8,  pp:12, gf:54, gc:58 },
    { pos:10, team:'Fulham',        pts:42, pj:32, pg:11, pe:9,  pp:12, gf:48, gc:52 },
    { pos:16, team:'Everton',       pts:28, pj:32, pg:6,  pe:10, pp:16, gf:34, gc:60 },
    { pos:17, team:'Burnley',       pts:22, pj:32, pg:4,  pe:10, pp:18, gf:30, gc:71 },
    { pos:18, team:'Sheffield Utd', pts:16, pj:32, pg:3,  pe:7,  pp:22, gf:26, gc:81 },
  ],
  ll: [
    { pos:1,  team:'Real Madrid',      pts:77, pj:32, pg:24, pe:5,  pp:3,  gf:82, gc:28 },
    { pos:2,  team:'FC Barcelona',     pts:73, pj:32, pg:22, pe:7,  pp:3,  gf:77, gc:36 },
    { pos:3,  team:'Atlético Madrid',  pts:66, pj:32, pg:20, pe:6,  pp:6,  gf:64, gc:36 },
    { pos:4,  team:'Athletic Club',    pts:60, pj:32, pg:17, pe:9,  pp:6,  gf:58, gc:38 },
    { pos:5,  team:'Real Sociedad',    pts:55, pj:32, pg:16, pe:7,  pp:9,  gf:52, gc:44 },
    { pos:6,  team:'Villarreal',       pts:50, pj:32, pg:14, pe:8,  pp:10, gf:51, gc:48 },
    { pos:7,  team:'Betis',            pts:47, pj:32, pg:13, pe:8,  pp:11, gf:50, gc:50 },
    { pos:8,  team:'Valencia',         pts:44, pj:32, pg:12, pe:8,  pp:12, gf:44, gc:48 },
    { pos:16, team:'Cádiz',            pts:28, pj:32, pg:7,  pe:7,  pp:18, gf:30, gc:58 },
    { pos:17, team:'Almería',          pts:21, pj:32, pg:4,  pe:9,  pp:19, gf:25, gc:65 },
    { pos:18, team:'Granada',          pts:16, pj:32, pg:3,  pe:7,  pp:22, gf:24, gc:70 },
  ],
  sa: [
    { pos:1,  team:'Inter Milan',   pts:80, pj:32, pg:25, pe:5,  pp:2,  gf:82, gc:24 },
    { pos:2,  team:'AC Milan',      pts:68, pj:32, pg:20, pe:8,  pp:4,  gf:71, gc:40 },
    { pos:3,  team:'Juventus',      pts:65, pj:32, pg:19, pe:8,  pp:5,  gf:58, gc:32 },
    { pos:4,  team:'Atalanta',      pts:63, pj:32, pg:19, pe:6,  pp:7,  gf:76, gc:46 },
    { pos:5,  team:'Roma',          pts:59, pj:32, pg:17, pe:8,  pp:7,  gf:64, gc:48 },
    { pos:6,  team:'Lazio',         pts:55, pj:32, pg:16, pe:7,  pp:9,  gf:60, gc:52 },
    { pos:7,  team:'Fiorentina',    pts:52, pj:32, pg:15, pe:7,  pp:10, gf:58, gc:54 },
    { pos:8,  team:'Napoli',        pts:50, pj:32, pg:14, pe:8,  pp:10, gf:60, gc:56 },
    { pos:16, team:'Frosinone',     pts:28, pj:32, pg:7,  pe:7,  pp:18, gf:38, gc:64 },
    { pos:17, team:'Salernitana',   pts:17, pj:32, pg:3,  pe:8,  pp:21, gf:28, gc:74 },
    { pos:18, team:'Verona',        pts:14, pj:32, pg:3,  pe:5,  pp:24, gf:26, gc:82 },
  ],
};

// Goleadores
const scorers = {
  pl: [
    { rank:1, name:'Erling Haaland',    club:'Manchester City', goals:23, assists:7  },
    { rank:2, name:'Cole Palmer',       club:'Chelsea',         goals:21, assists:11 },
    { rank:3, name:'Alexander Isak',    club:'Newcastle',       goals:19, assists:5  },
    { rank:4, name:'Mohamed Salah',     club:'Liverpool',       goals:18, assists:13 },
    { rank:5, name:'Son Heung-min',     club:'Tottenham',       goals:15, assists:8  },
    { rank:6, name:'Bukayo Saka',       club:'Arsenal',         goals:14, assists:12 },
    { rank:7, name:'Marcus Rashford',   club:'Man United',      goals:12, assists:5  },
  ],
  ll: [
    { rank:1, name:'Artem Dovbyk',      club:'Girona',           goals:22, assists:6  },
    { rank:2, name:'Jude Bellingham',   club:'Real Madrid',      goals:19, assists:10 },
    { rank:3, name:'Robert Lewandowski',club:'FC Barcelona',     goals:18, assists:8  },
    { rank:4, name:'Antoine Griezmann', club:'Atlético Madrid',  goals:16, assists:10 },
    { rank:5, name:'Vinícius Jr.',      club:'Real Madrid',      goals:15, assists:9  },
    { rank:6, name:'Pedri',             club:'FC Barcelona',     goals:11, assists:14 },
    { rank:7, name:'Iker Bravo',        club:'Real Betis',       goals:10, assists:4  },
  ],
  sa: [
    { rank:1, name:'Lautaro Martínez',  club:'Inter Milan',  goals:27, assists:8 },
    { rank:2, name:'Dusan Vlahovic',    club:'Juventus',     goals:18, assists:4 },
    { rank:3, name:'Romelu Lukaku',     club:'Roma',         goals:15, assists:7 },
    { rank:4, name:'Olivier Giroud',    club:'AC Milan',     goals:14, assists:3 },
    { rank:5, name:'Ademola Lookman',   club:'Atalanta',     goals:13, assists:9 },
    { rank:6, name:'Victor Osimhen',    club:'Napoli',       goals:12, assists:5 },
    { rank:7, name:'Paulo Dybala',      club:'Roma',         goals:11, assists:8 },
  ],
};

// Champions League — Grupos
const uclGroups = [
  { name:'A', teams:[{t:'Real Madrid',pts:16},{t:'Nápoli',pts:10},{t:'Braga',pts:4},{t:'U. Berlín',pts:1}] },
  { name:'B', teams:[{t:'Man. City',pts:16},{t:'RB Leipzig',pts:10},{t:'C. zvezda',pts:4},{t:'Young Boys',pts:1}] },
  { name:'C', teams:[{t:'Bayern',pts:14},{t:'Man. United',pts:10},{t:'Galatasaray',pts:6},{t:'Copenhague',pts:5}] },
  { name:'D', teams:[{t:'Benfica',pts:13},{t:'Inter Milan',pts:13},{t:'R. Sociedad',pts:4},{t:'Salzburgo',pts:1}] },
  { name:'E', teams:[{t:'Atlético',pts:11},{t:'Lazio',pts:11},{t:'Feyenoord',pts:9},{t:'Celtic',pts:3}] },
  { name:'F', teams:[{t:'Paris SG',pts:13},{t:'Dortmund',pts:9},{t:'AC Milan',pts:8},{t:'Newcastle',pts:4}] },
  { name:'G', teams:[{t:'FC Barcelona',pts:15},{t:'Porto',pts:9},{t:'Shakhtar',pts:4},{t:'Amberes',pts:2}] },
  { name:'H', teams:[{t:'Arsenal',pts:15},{t:'PSV',pts:9},{t:'Lens',pts:4},{t:'Sevilla',pts:0}] },
];

// UCL — Octavos
const uclR16 = [
  { h:'Manchester City', a:'Real Madrid',    score:'3-3 (4-3 pen)' },
  { h:'Arsenal',         a:'Bayern Múnich',  score:'3-2' },
  { h:'Atlético Madrid', a:'Inter Milan',    score:'1-2' },
  { h:'FC Barcelona',    a:'Paris SG',       score:'4-2' },
  { h:'B. Dortmund',     a:'PSV',            score:'3-2' },
  { h:'Liverpool',       a:'Benfica',        score:'3-1' },
  { h:'Juventus',        a:'Feyenoord',      score:'2-1' },
  { h:'R. Sociedad',     a:'RB Leipzig',     score:'2-4' },
];

// UCL — Cuartos
const uclQF = [
  { h:'Manchester City', a:'Real Madrid',    score:'3-3 (4-3 pen)' },
  { h:'Arsenal',         a:'FC Barcelona',   score:'TBD' },
  { h:'B. Dortmund',     a:'Atlético Madrid',score:'TBD' },
  { h:'Liverpool',       a:'RB Leipzig',     score:'TBD' },
];

// Mundial 2026 — 12 Grupos · 48 selecciones
const wcGroups = [
  { g:'A', teams:[{n:'Argentina 🇦🇷'},{n:'Ecuador 🇪🇨'},{n:'Bolivia 🇧🇴'},{n:'Marruecos 🇲🇦'}] },
  { g:'B', teams:[{n:'México 🇲🇽',s:'S'},{n:'USA 🇺🇸',s:'S'},{n:'Canadá 🇨🇦',s:'S'},{n:'Jamaica 🇯🇲'}] },
  { g:'C', teams:[{n:'Francia 🇫🇷'},{n:'Países Bajos 🇳🇱'},{n:'Turquía 🇹🇷'},{n:'Uruguay 🇺🇾'}] },
  { g:'D', teams:[{n:'Brasil 🇧🇷'},{n:'Colombia 🇨🇴'},{n:'Japón 🇯🇵'},{n:'Corea del Sur 🇰🇷'}] },
  { g:'E', teams:[{n:'España 🇪🇸'},{n:'Alemania 🇩🇪'},{n:'Bélgica 🇧🇪'},{n:'Serbia 🇷🇸'}] },
  { g:'F', teams:[{n:'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿'},{n:'Portugal 🇵🇹'},{n:'Polonia 🇵🇱'},{n:'Nigeria 🇳🇬'}] },
  { g:'G', teams:[{n:'Italia 🇮🇹'},{n:'Suiza 🇨🇭'},{n:'Irán 🇮🇷'},{n:'Senegal 🇸🇳'}] },
  { g:'H', teams:[{n:'Croacia 🇭🇷'},{n:'Dinamarca 🇩🇰'},{n:'Egipto 🇪🇬'},{n:'Arabia Saudí 🇸🇦'}] },
  { g:'I', teams:[{n:'Australia 🇦🇺'},{n:'Ghana 🇬🇭'},{n:'Costa Rica 🇨🇷'},{n:'Albania 🇦🇱'}] },
  { g:'J', teams:[{n:'Camerún 🇨🇲'},{n:'Rep. Checa 🇨🇿'},{n:'Venezuela 🇻🇪'},{n:'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿'}] },
  { g:'K', teams:[{n:'Chile 🇨🇱'},{n:'Grecia 🇬🇷'},{n:'Nueva Zelanda 🇳🇿'},{n:'Guinea 🇬🇳'}] },
  { g:'L', teams:[{n:'Perú 🇵🇪'},{n:'Rumania 🇷🇴'},{n:'Qatar 🇶🇦'},{n:'Gabón 🇬🇦'}] },
];
window.matches = matches;
window.standings = standings;
window.scorers = scorers;
window.uclGroups = uclGroups;
window.uclR16 = uclR16;
window.uclQF = uclQF;
window.wcGroups = wcGroups;
window.nextId = nextId;