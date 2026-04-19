/* ═══════════════════════════════════════════════════════════
   FUNDACIÓN SCP — SITIO-AXIOM
   app.js v3.0 — Temas por departamento + Light/Dark mode
═══════════════════════════════════════════════════════════ */
'use strict';

/* ───────────────────────────────────────────────────────────
   1. TEMA CLARO / OSCURO
─────────────────────────────────────────────────────────── */

const ThemeManager = {
  STORAGE_KEY: 'scp-theme',
  current: 'dark',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    this.apply(saved);
  },

  apply(theme) {
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    // Actualizar todos los botones de toggle
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', theme === 'dark' ? 'Modo claro' : 'Modo oscuro');
    });
  },

  toggle() {
    this.apply(this.current === 'dark' ? 'light' : 'dark');
  }
};

/* ───────────────────────────────────────────────────────────
   2. DATOS DE DEPARTAMENTOS (con logos y temas)
─────────────────────────────────────────────────────────── */

const DEPARTMENTS = {
  // ── COMBATIVOS ──
  security: {
    id: 'security', name: 'Security Department', shortName: 'SD',
    category: 'combat', level: 1,
    theme: 'security',
    shieldImg: 'assets/logos/dept-seguridad-shield.png',
    bannerImg:  'assets/logos/dept-seguridad-banner.png',
    accentColor: '#8a9aa8',
    description: 'El Departamento de Seguridad protege las instalaciones del Sitio-Axiom contra amenazas internas y externas. Son la primera línea de defensa ante cualquier brecha de contención.',
    functions: ['Patrulla de instalaciones', 'Control de accesos', 'Respuesta a brechas de nivel 1-2', 'Escolta de personal y SCPs'],
    divisions: ['Guardia de Perímetro', 'Control de Accesos', 'Respuesta Rápida'],
    subpages: [], secret: false
  },
  mtf: {
    id: 'mtf', name: 'Fuerzas de Tarea Móvil', shortName: 'MTF',
    category: 'combat', level: 2,
    theme: 'mtf',
    shieldImg: 'assets/logos/dept-trabajo-shield.png',
    bannerImg:  'assets/logos/dept-trabajo-banner.png',
    accentColor: '#4a6fa5',
    description: 'Las Fuerzas de Tarea Móvil son unidades de élite desplegadas para misiones especiales de recontención, recuperación de SCPs y neutralización de amenazas anómalas de alto riesgo.',
    functions: ['Recontención de SCPs fugados', 'Operaciones encubiertas', 'Respuesta a brechas Keter', 'Infiltración en GOIs'],
    divisions: ['Épsilon-11 "Nine-Tailed Fox"', 'Alpha-1 "Red Right Hand"', 'Beta-7 "Maz Hatters"'],
    subpages: [], secret: false
  },
  rrt: {
    id: 'rrt', name: 'Rapid Response Team', shortName: 'RRT',
    category: 'combat', level: 3,
    theme: 'security',
    shieldImg: 'assets/logos/dept-anomala-shield.png',
    bannerImg:  null,
    accentColor: '#6a8090',
    description: 'El Rapid Response Team es una unidad táctica de reacción inmediata, especializada en la contención de brechas de alta velocidad y el apoyo a las MTF en situaciones de emergencia extrema.',
    functions: ['Respuesta inmediata a brechas Keter', 'Apoyo táctico a MTF', 'Contención de emergencia', 'Evacuaciones de personal'],
    divisions: ['Escuadrón Alfa', 'Escuadrón Beta'],
    subpages: [], secret: false, easterEgg: false
  },

  // ── CIVILES ──
  ethics: {
    id: 'ethics', name: 'Ética Legal', shortName: 'CE',
    category: 'civil', level: 2,
    theme: 'ethics',
    shieldImg: 'assets/logos/dept-etica-shield.png',
    bannerImg:  'assets/logos/dept-etica-banner.png',
    accentColor: '#9b1a3a',
    description: 'El Comité de Ética Legal supervisa que todas las operaciones del Sitio-Axiom se realicen dentro del marco ético establecido por la Fundación. Gestiona el CODEX de normativas y audita a los demás departamentos.',
    functions: ['Supervisión de protocolos éticos', 'Gestión del CODEX', 'Auditorías de departamentos', 'Resolución de conflictos internos'],
    divisions: ['Revisión de Protocolos', 'Auditoría Interna'],
    subpages: ['codex'], secret: false
  },
  medical: {
    id: 'medical', name: 'Medicina', shortName: 'MED',
    category: 'civil', level: 1,
    theme: 'medical',
    shieldImg: 'assets/logos/dept-medicina-shield.png',
    bannerImg:  'assets/logos/dept-medicina-banner.png',
    accentColor: '#2e7d52',
    description: 'El Departamento Médico atiende al personal del Sitio-Axiom y gestiona los protocolos de salud relacionados con exposición anómala. También investiga SCPs con propiedades biológicas.',
    functions: ['Atención médica al personal', 'Protocolos post-exposición', 'Cuarentena biológica', 'Investigación médica SCP'],
    divisions: ['Urgencias', 'Investigación Biológica', 'Psiquiatría'],
    subpages: ['inventory', 'firstaid', 'bio-scps', 'bio-threats'], secret: false
  },
  science: {
    id: 'science', name: 'Ciencia', shortName: 'SCI',
    category: 'civil', level: 2,
    theme: 'science',
    shieldImg: 'assets/logos/dept-ciencia-shield.png',
    bannerImg:  'assets/logos/dept-medicina-banner.png',
    accentColor: '#5a7a2a',
    description: 'El Departamento de Ciencia investiga y documenta las propiedades anómalas de los SCPs contenidos. Gestiona todos los registros de pruebas y brechas del Sitio-Axiom.',
    functions: ['Investigación de anomalías', 'Tests con Clase D', 'Registro de brechas', 'Documentación SCP'],
    divisions: ['Investigación Básica', 'Anomalías Cognitivas', 'Física Anómala'],
    subpages: ['scp-register', 'breach-log', 'tests', 'class-d-profiles'], secret: false
  },
  engineering: {
    id: 'engineering', name: 'Ingeniería / ICT', shortName: 'ICT',
    category: 'civil', level: 2,
    theme: 'engineering',
    shieldImg: 'assets/logos/dept-ingenieria-shield.png',
    bannerImg:  'assets/logos/dept-ingenieria-banner.png',
    accentColor: '#8a5200',
    description: 'El departamento de Ingeniería e ICT gestiona toda la infraestructura tecnológica del Sitio-Axiom, incluyendo el sistema de IA ALMA y todos los sistemas de contención digital.',
    functions: ['Mantenimiento de sistemas', 'Control de IA ALMA', 'Gestión de redes internas', 'Sistema de reportes técnicos'],
    divisions: ['Sistemas', 'IA & Automatización', 'Infraestructura'],
    subpages: ['systems', 'alma', 'tech-reports'], secret: false
  },

  // ── OBJETOS DE PRUEBA ──
  class_d: {
    id: 'class_d', name: 'Clase D', shortName: 'D',
    category: 'test', level: 0,
    theme: 'class_d',
    shieldImg: 'assets/logos/dept-anomala-shield.png',
    bannerImg:  null,
    accentColor: '#8a7050',
    description: 'Personal Clase D: sujetos de prueba utilizados en experimentos con SCPs de riesgo. Bajo estricta supervisión del Departamento de Ciencia.',
    functions: ['Participación en tests SCP', 'Apoyo en contención'],
    divisions: [], subpages: [], secret: false
  },
  class_e: {
    id: 'class_e', name: 'Clase E', shortName: 'E',
    category: 'test', level: 0,
    theme: 'class_e',
    shieldImg: 'assets/logos/dept-anomala-shield.png',
    bannerImg:  null,
    accentColor: '#8a6040',
    description: 'Personal Clase E: sujetos que han sido expuestos a SCPs anómalos y se encuentran en observación bajo cuarentena activa.',
    functions: ['Observación post-exposición'],
    divisions: [], subpages: [], secret: false
  },

  // ── ADMINISTRATIVOS (OCULTOS SEGÚN NIVEL) ──
  o5: {
    id: 'o5', name: 'Consejo O5', shortName: 'O5',
    category: 'admin', level: 5,
    theme: 'o5',
    shieldImg: 'assets/logos/dept-gestion-shield.png',
    bannerImg:  'assets/logos/dept-gestion-banner.png',
    accentColor: '#a07820',
    description: 'El Consejo O5 es la máxima autoridad de la Fundación SCP. Sus miembros son conocidos únicamente por sus números. Supervisión absoluta sobre todas las operaciones del Sitio-Axiom.',
    functions: ['Autoridad suprema', 'Decisiones de nivel THAUMIEL', 'Gestión de SCPs de clase máxima'],
    divisions: ['O5-1 a O5-13'],
    subpages: [], secret: false, partiallyVisible: true
  },
  elimination: {
    id: 'elimination', name: '[CLASIFICADO]', shortName: '███',
    category: 'admin', level: 99,
    theme: 'elimination',
    shieldImg: 'assets/logos/dept-eliminacion-shield.png',
    bannerImg:  'assets/logos/dept-eliminacion-banner.png',
    accentColor: '#7a2090',
    description: '[ACCESO DENEGADO]',
    functions: [], divisions: [],
    subpages: [], secret: true, ultraSecret: true
  },
  intelligence: {
    id: 'intelligence', name: '[CLASIFICADO]', shortName: '███',
    category: 'admin', level: 99,
    theme: 'intelligence',
    shieldImg: 'assets/logos/dept-inteligencia-shield.png',
    bannerImg:  'assets/logos/dept-inteligencia-banner.png',
    accentColor: '#6a7a20',
    description: '[ACCESO DENEGADO]',
    functions: [], divisions: [],
    subpages: [], secret: true, ultraSecret: true
  }
};

const CATEGORY_LABELS = {
  combat: 'Combativos',
  civil:  'Civiles',
  test:   'Objetos de Prueba',
  admin:  'Administrativos'
};

const SUBPAGE_LABELS = {
  'scp-register':     'Registro SCP',
  'breach-log':       'Registro de Brechas',
  'tests':            'Tests Clase D',
  'class-d-profiles': 'Perfiles Clase D',
  'inventory':        'Inventario Médico',
  'firstaid':         'Primeros Auxilios',
  'bio-scps':         'SCPs Biológicos',
  'bio-threats':      'Amenazas Biológicas',
  'codex':            'CODEX',
  'systems':          'Gestión Sistemas',
  'alma':             'IA ALMA',
  'tech-reports':     'Reportes Técnicos'
};

/* ───────────────────────────────────────────────────────────
   3. USUARIOS SIMULADOS (reemplazar con backend real)
─────────────────────────────────────────────────────────── */

const USERS = {
  'admin':        { password:'axiom2024', name:'Administrador', initials:'AD', dept:'ADMINISTRACIÓN', level:'OMNI', levelNum:99, depts:['all'] },
  'o5-7':         { password:'consejo7',  name:'O5-7',          initials:'O5', dept:'CONSEJO O5',    level:'OMNI', levelNum:99, depts:['all'] },
  'agente':       { password:'1234',      name:'Agente Demo',   initials:'AG', dept:'SEGURIDAD',     level:'NV-2', levelNum:2,  depts:['security'] },
  'investigador': { password:'1234',      name:'Dr. Investigador', initials:'DR', dept:'CIENCIA',    level:'NV-3', levelNum:3,  depts:['science'] }
};

let currentUser = null;

/* ───────────────────────────────────────────────────────────
   4. ESTADO DE NAVEGACIÓN
─────────────────────────────────────────────────────────── */

const AppState = {
  section:  'welcome',
  dept:     null,
  subpage:  null,
  dropdown: false
};

/* ───────────────────────────────────────────────────────────
   5. UTILIDADES
─────────────────────────────────────────────────────────── */

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

function canSee(dept) {
  if (!currentUser) return false;
  if (currentUser.levelNum === 99) return true;
  if (dept.ultraSecret) return false;
  if (dept.secret && currentUser.levelNum < dept.level) return false;
  return true;
}

function hasAccess(dept) {
  if (!currentUser) return false;
  if (currentUser.levelNum === 99) return true;
  if (dept.ultraSecret) return false;
  if (currentUser.depts.includes('all')) return true;
  return currentUser.depts.includes(dept.id);
}

function formatTime() {
  const now = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${p(now.getUTCHours())}:${p(now.getUTCMinutes())}:${p(now.getUTCSeconds())} UTC`;
}

/* ───────────────────────────────────────────────────────────
   6. RELOJ
─────────────────────────────────────────────────────────── */

function startClock() {
  const el = $('#topnav-clock');
  if (!el) return;
  const tick = () => { el.textContent = formatTime(); };
  tick();
  setInterval(tick, 1000);
}

/* ───────────────────────────────────────────────────────────
   7. TOAST SYSTEM
─────────────────────────────────────────────────────────── */

function showToast(msg, type = 'info') {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ───────────────────────────────────────────────────────────
   8. THEME TOGGLE INIT
─────────────────────────────────────────────────────────── */

function initThemeToggles() {
  $$('[data-action="toggle-theme"]').forEach(btn => {
    btn.addEventListener('click', () => {
      ThemeManager.toggle();
      showToast(ThemeManager.current === 'light' ? 'Modo claro activado' : 'Modo oscuro activado', 'info');
    });
  });
}

/* ───────────────────────────────────────────────────────────
   9. LOGIN / LOGOUT
─────────────────────────────────────────────────────────── */

function initLogin() {
  const overlay = $('#login-overlay');

  $$('[data-action="open-login"]').forEach(btn => {
    btn.addEventListener('click', () => overlay?.classList.remove('hidden'));
  });

  $('#login-close')?.addEventListener('click', () => overlay?.classList.add('hidden'));
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });

  $('#login-submit')?.addEventListener('click', attemptLogin);
  $('#login-form')?.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });

  $('#login-discord')?.addEventListener('click', () => {
    showToast('Discord OAuth disponible cuando el backend esté conectado.', 'info');
  });

  $('#hero-scroll-btn')?.addEventListener('click', () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function attemptLogin() {
  const username = $('#login-username')?.value.trim().toLowerCase();
  const password = $('#login-password')?.value;
  const errorEl  = $('#login-error');

  if (!username || !password) { showLoginError('Introduce usuario y contraseña.'); return; }

  const user = USERS[username];
  if (!user || user.password !== password) {
    showLoginError('Credenciales incorrectas. Acceso registrado.');
    if ($('#login-username')) $('#login-username').value = '';
    if ($('#login-password')) $('#login-password').value = '';
    return;
  }

  currentUser = { ...user, username };
  errorEl?.classList.remove('visible');
  $('#login-overlay')?.classList.add('hidden');
  enterApp();
}

function showLoginError(msg) {
  const el = $('#login-error');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 4000);
}

function logout() {
  currentUser = null;
  Object.assign(AppState, { section: 'welcome', dept: null, subpage: null, dropdown: false });
  $('#app')?.classList.remove('visible');
  $('#landing')?.classList.remove('hidden');
  closeDropdown();
  window.scrollTo(0, 0);
}

/* ───────────────────────────────────────────────────────────
   10. ENTRAR A LA APP
─────────────────────────────────────────────────────────── */

function enterApp() {
  $('#landing')?.classList.add('hidden');
  $('#app')?.classList.add('visible');
  renderUserPanel();
  unlockNav();
  startClock();
  initTopNav();
  navigateTo('welcome');
}

/* Desbloquea los botones de nav según los permisos del usuario */
function unlockNav() {
  if (!currentUser) return;

  // "Fundación / Empleado" — accesible para cualquier usuario logeado (cada uno ve solo lo suyo)
  const foundationBtn = $('#nav-foundation') || $('[data-nav="foundation"]');
  if (foundationBtn) foundationBtn.classList.remove('locked');

  // "Mapa" — accesible para combativos (security, mtf, rrt) y administrativos (o5, omni)
  // En práctica: nivel 2+ combativo o admin/omni
  const canSeeMap =
    currentUser.levelNum === 99 ||                          // OMNI
    currentUser.depts.includes('all') ||                   // acceso total
    currentUser.depts.some(d => ['security','mtf','rrt','o5','elimination','intelligence'].includes(d)) ||
    currentUser.levelNum >= 2;                             // cualquier NV2+ puede ver el mapa

  const mapBtn = $('#nav-map') || $('[data-nav="map"]');
  if (mapBtn) {
    if (canSeeMap) {
      mapBtn.classList.remove('locked');
    } else {
      mapBtn.classList.add('locked');
    }
  }
}

/* ───────────────────────────────────────────────────────────
   11. PANEL DE USUARIO
─────────────────────────────────────────────────────────── */

function renderUserPanel() {
  if (!currentUser) return;

  const av = $('#topnav-avatar');
  if (av) av.textContent = currentUser.initials;

  const nameEl = $('#topnav-username');
  const deptEl = $('#topnav-userdept');
  if (nameEl) nameEl.textContent = currentUser.name;
  if (deptEl) deptEl.textContent = `${currentUser.dept} · ${currentUser.level}`;

  const lvl = currentUser.levelNum === 99 ? 5 : Math.min(currentUser.levelNum, 5);
  $$('.clearance-pip').forEach((pip, i) => {
    pip.classList.remove('active', 'omni');
    if (i < lvl) pip.classList.add(currentUser.levelNum === 99 ? 'omni' : 'active');
  });

  const clearVal = $('#clearance-value');
  if (clearVal) clearVal.textContent = currentUser.levelNum === 99 ? 'AUTORIZACIÓN: OMNI' : `AUTORIZACIÓN: NIVEL ${currentUser.levelNum} / 5`;

  const dropDept = $('#dropdown-dept');
  if (dropDept) dropDept.textContent = `${currentUser.dept} · ${currentUser.level}`;
}

/* ───────────────────────────────────────────────────────────
   12. TOPNAV
─────────────────────────────────────────────────────────── */

function initTopNav() {
  $$('.nav-btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('locked')) { triggerDenied(btn); return; }
      navigateTo(btn.dataset.nav);
    });
  });

  $('#topnav-user-btn')?.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('#user-dropdown') && !e.target.closest('#topnav-user-btn')) closeDropdown();
  });
  $('#logout-btn')?.addEventListener('click', logout);
}

function toggleDropdown() {
  AppState.dropdown = !AppState.dropdown;
  $('#user-dropdown')?.classList.toggle('hidden', !AppState.dropdown);
  $('#topnav-user-btn')?.setAttribute('aria-expanded', AppState.dropdown);
}

function closeDropdown() {
  AppState.dropdown = false;
  $('#user-dropdown')?.classList.add('hidden');
  $('#topnav-user-btn')?.setAttribute('aria-expanded', 'false');
}

function triggerDenied(btn) {
  btn.classList.add('denied');
  setTimeout(() => btn.classList.remove('denied'), 600);
}

function setActiveNav(section) {
  $$('.nav-btn[data-nav]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === section);
  });
}

/* ───────────────────────────────────────────────────────────
   13. NAVEGACIÓN PRINCIPAL
─────────────────────────────────────────────────────────── */

function navigateTo(section, dept = null, subpage = null) {
  Object.assign(AppState, { section, dept, subpage });
  setActiveNav(section);
  closeDropdown();

  const sidebar = $('#app-sidebar');
  if (sidebar) sidebar.classList.toggle('hidden-sidebar', section !== 'foundation');

  // Limpiar tema de departamento del content
  const content = $('#app-content');
  if (content) content.removeAttribute('data-dept-theme');

  switch (section) {
    case 'welcome':    renderWelcome(); break;
    case 'foundation': renderFoundation(dept, subpage); break;
    case 'map':        renderMap(); break;
    default:           renderWelcome();
  }
}

/* ───────────────────────────────────────────────────────────
   14. BREADCRUMB
─────────────────────────────────────────────────────────── */

function setBreadcrumb(parts) {
  const el = $('#breadcrumb');
  if (!el) return;
  el.innerHTML = parts.map((p, i) =>
    i === parts.length - 1
      ? `<span class="crumb">${p}</span>`
      : `<span>${p}</span><span class="sep">//</span>`
  ).join('');
}

/* ───────────────────────────────────────────────────────────
   15. RENDER: BIENVENIDA
─────────────────────────────────────────────────────────── */

function renderWelcome() {
  setBreadcrumb(['SITIO-AXIOM', 'BIENVENIDA']);
  const content = $('#page-content');
  if (!content) return;
  const isOmni = currentUser?.levelNum === 99;

  content.innerHTML = `
    <div class="welcome-banner">
      <div class="welcome-banner-code">DOCUMENTO: BIENVENIDA-01 · CLASIFICACIÓN: INTERNA · SITIO-AXIOM</div>
      <div class="welcome-banner-title">Portal Operativo — Fundación SCP</div>
      <p>Bienvenido de nuevo, <strong class="text-accent">${currentUser?.name}</strong>. Este es el portal interno del <strong class="text-hi">Sitio-Axiom</strong>. Desde aquí podrás acceder a tu ficha de departamento, consultar los comunicados administrativos y monitorizar el estado de las instalaciones.</p>
      <p>Recuerda: la información a la que accedes está protegida bajo el Protocolo de Confidencialidad de la Fundación. <span class="redacted">█████████████████████████████</span></p>
    </div>

    ${isOmni ? `<div class="ssu-banner"><div class="ssu-banner-dot"></div><span class="ssu-banner-text">SSU EN CURSO — Sesión activa en Sitio-Axiom</span><span class="ssu-banner-time" id="ssu-clock">--:-- UTC</span></div>` : ''}

    <div class="grid-4 mb-24">
      <div class="card card-accent-top">
        <div class="card-label">SCPs Registrados</div>
        <div class="card-value accent">247</div>
        <div class="card-caption">+3 esta semana</div>
      </div>
      <div class="card" style="border-color:rgba(192,57,43,0.25)">
        <div class="card-label">Brechas activas</div>
        <div class="card-value danger">2</div>
        <div class="card-caption">Contención comprometida</div>
      </div>
      <div class="card">
        <div class="card-label">Personal activo</div>
        <div class="card-value">1.847</div>
        <div class="card-caption">Todos los departamentos</div>
      </div>
      <div class="card">
        <div class="card-label">Tu nivel de acceso</div>
        <div class="card-value ${currentUser?.levelNum === 99 ? '' : 'accent'}" ${currentUser?.levelNum === 99 ? 'style="color:#c39bd3;font-size:18px"' : ''}>${currentUser?.level}</div>
        <div class="card-caption">${currentUser?.dept}</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="card-label mb-12">COMUNICADOS RECIENTES</div>
        <div class="announcement priority">
          <div class="ann-header"><span class="badge badge-danger">URGENTE</span><span class="ann-date">HOY · 22:47 UTC</span></div>
          <div class="ann-title">Brecha de contención — SCP-████ — Ala Este</div>
          <div class="ann-body">Situación EUCLID-ROJO activa. Personal de contención: presentarse en Ala Este inmediatamente. Niveles 1-2: evacuar plantas inferiores.</div>
          <div class="ann-author">— DIRECTOR SITIO-AXIOM · AUTORIZACIÓN O5-7</div>
        </div>
        <div class="announcement info">
          <div class="ann-header"><span class="badge badge-accent">SSU</span><span class="ann-date">PRÓX. VIERNES · 20:00</span></div>
          <div class="ann-title">Sesión SSU — Infiltración en instalaciones GOC</div>
          <div class="ann-body">Fichas de personaje actualizadas obligatorias. Revisar expedientes SCP-049, SCP-096 y SCP-682 antes de la sesión.</div>
          <div class="ann-author">— GAME MASTER · #anuncios-axiom</div>
        </div>
        <div class="announcement routine">
          <div class="ann-header"><span class="badge badge-neutral">RUTINA</span><span class="ann-date">AYER · 09:00 UTC</span></div>
          <div class="ann-title">Actualización protocolos de contención v4.2</div>
          <div class="ann-body">Personal NV-2+ debe firmar acuse de recibo. Cambios en procedimientos de <span class="redacted">████████████</span> y protocolos de emergencia.</div>
          <div class="ann-author">— COMITÉ DE PROTOCOLOS</div>
        </div>
      </div>
      <div>
        <div class="card-label mb-12">ACTIVIDAD DEL SISTEMA</div>
        <div class="terminal mb-16">
          <div class="terminal-line info">Conexión — ${currentUser?.name} · ${currentUser?.dept}</div>
          <div class="terminal-line">Brecha en SITIO-AXIOM/ALA-E controlada — 14:22 UTC</div>
          <div class="terminal-line">Nuevo expediente SCP-████ clasificado EUCLID</div>
          <div class="terminal-line warn">Protocolo cuarentena activo — Sector 7</div>
          <div class="terminal-line">Transferencia Clase-D completada — Bloque D-12</div>
          <div class="terminal-line err">ALERTA: Acceso no autorizado — Nivel -3</div>
          <div class="terminal-line">ALMA operativo — Ciclo 447</div>
        </div>
        <div class="card-label mb-12">ESTADO DE CONTENCIÓN</div>
        <div class="card">
          ${[
            {label:'SAFE',     cls:'safe',     pct:100, count:'142/142'},
            {label:'EUCLID',   cls:'euclid',   pct:97,  count:'89/91'},
            {label:'KETER',    cls:'keter',    pct:100, count:'14/14'},
            {label:'THAUMIEL', cls:'thaumiel', pct:100, count:'2/2'}
          ].map(c => `
            <div class="mb-12">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="badge badge-${c.cls}">${c.label}</span>
                <span class="card-caption">${c.count}</span>
              </div>
              <div style="height:3px;background:var(--c-border);border-radius:1px;">
                <div style="height:100%;width:${c.pct}%;background:var(--c-${c.cls === 'safe' ? 'success' : c.cls === 'euclid' ? 'warning' : c.cls === 'keter' ? 'danger' : 'text-muted'});border-radius:1px;transition:width 1s;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;">
      <a href="https://discord.gg/TU_SERVIDOR" target="_blank" rel="noopener" class="btn btn-discord btn-sm">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.11 18.1.128 18.14.157 18.16a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
        Discord
      </a>
      <a href="https://www.roblox.com/groups/TU_GRUPO" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.926 23.998L0 18.491 5.075.002 24 5.51z"/></svg>
        Roblox
      </a>
      <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg>
        Mi Departamento
      </button>
    </div>
  `;

  // SSU clock
  if (isOmni) {
    const el = $('#ssu-clock');
    if (el) { const t = () => el.textContent = formatTime(); t(); setInterval(t, 1000); }
  }
}

/* ───────────────────────────────────────────────────────────
   16. RENDER: FUNDACIÓN
─────────────────────────────────────────────────────────── */

function renderFoundation(deptId = null, subpage = null) {
  setBreadcrumb(['SITIO-AXIOM', 'FUNDACIÓN / EMPLEADO']);
  renderSidebar(deptId, subpage);

  if (!deptId) { renderDeptOverview(); return; }
  const dept = DEPARTMENTS[deptId];
  if (!dept || !canSee(dept)) { renderDeptOverview(); return; }

  // Aplicar tema de departamento al contenido
  const appContent = $('#app-content');
  if (appContent) appContent.setAttribute('data-dept-theme', dept.theme);

  if (subpage) renderSubpage(dept, subpage);
  else renderDeptPage(dept);
}

/* ── SIDEBAR ── */
function renderSidebar(activeDept, activeSubpage) {
  const sidebar = $('#app-sidebar');
  if (!sidebar) return;

  const categories = ['combat', 'civil', 'test', 'admin'];
  sidebar.innerHTML = categories.map(cat => {
    const depts = Object.values(DEPARTMENTS).filter(d => d.category === cat && canSee(d));
    if (!depts.length) return '';

    return `
      <div class="sidebar-section">
        <div class="sidebar-section-label">${CATEGORY_LABELS[cat]}</div>
        ${depts.map(dept => {
          const isActive  = dept.id === activeDept;
          const access    = hasAccess(dept);
          const hasSubs   = dept.subpages.length > 0 && access;
          const isExp     = isActive && hasSubs;

          return `
            <button
              class="sidebar-item ${isActive ? 'active' : ''} ${!access && !dept.partiallyVisible ? 'locked' : ''} ${isExp ? 'expanded' : ''}"
              data-dept="${dept.id}"
              onclick="handleSidebarClick('${dept.id}')"
            >
              ${dept.shieldImg ? `<img src="${dept.shieldImg}" style="width:16px;height:16px;object-fit:contain;opacity:0.8;flex-shrink:0;" alt="">` : ''}
              <span>${dept.ultraSecret ? `<span class="redacted">${dept.name}</span>` : dept.name}</span>
              ${hasSubs ? `<svg class="sidebar-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l4 4-4 4"/></svg>` : ''}
              ${!access && !dept.ultraSecret ? `<svg class="lock-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="10" height="8" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>` : ''}
            </button>
            ${hasSubs ? `
              <div class="sidebar-submenu ${isExp ? 'open' : ''}" id="submenu-${dept.id}">
                ${dept.subpages.map(sp => `
                  <button class="sidebar-subitem ${activeSubpage === sp ? 'active' : ''}" onclick="navigateTo('foundation','${dept.id}','${sp}')">
                    ${SUBPAGE_LABELS[sp] || sp}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function handleSidebarClick(deptId) {
  const dept = DEPARTMENTS[deptId];
  if (!dept || !canSee(dept)) return;

  if (AppState.dept === deptId && dept.subpages.length > 0 && hasAccess(dept)) {
    $(`#submenu-${deptId}`)?.classList.toggle('open');
    $(`.sidebar-item[data-dept="${deptId}"]`)?.classList.toggle('expanded');
    return;
  }
  navigateTo('foundation', deptId, null);
}

/* ── DEPT OVERVIEW ── */
function renderDeptOverview() {
  const content = $('#page-content');
  if (!content) return;
  setBreadcrumb(['SITIO-AXIOM', 'FUNDACIÓN / EMPLEADO']);

  content.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-heading">Fundación / Empleado</div>
        <div class="page-subheading">ACCESO POR DEPARTAMENTO — SITIO-AXIOM</div>
      </div>
      <span class="badge badge-accent">SITIO-AXIOM</span>
    </div>
    ${['combat','civil','test','admin'].map(cat => {
      const depts = Object.values(DEPARTMENTS).filter(d => d.category === cat && canSee(d));
      if (!depts.length) return '';
      return `
        <div class="mb-24">
          <div class="card-label mb-12">${CATEGORY_LABELS[cat]}</div>
          <div class="grid-3">
            ${depts.map(dept => {
              const access = hasAccess(dept);
              return `
                <div class="card" style="cursor:pointer;transition:all 0.2s;${access ? `border-color:${dept.accentColor}22;` : ''}"
                  onclick="navigateTo('foundation','${dept.id}')">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                    ${dept.shieldImg ? `<img src="${dept.shieldImg}" style="width:36px;height:36px;object-fit:contain;" alt="">` : ''}
                    <div>
                      <div style="font-family:var(--font-display);font-size:11px;font-weight:700;color:${access ? dept.accentColor : 'var(--c-text-dim)'};letter-spacing:0.1em;text-transform:uppercase;">
                        ${dept.ultraSecret ? `<span class="redacted">${dept.name}</span>` : dept.name}
                      </div>
                      <div style="font-family:var(--font-mono);font-size:9px;color:var(--c-text-muted);margin-top:2px;">
                        ${access ? 'ACCESO VERIFICADO' : dept.ultraSecret ? '████████████' : `NV-${dept.level}+ REQUERIDO`}
                      </div>
                    </div>
                    ${access
                      ? `<svg style="margin-left:auto;width:12px;height:12px;color:var(--c-accent)" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l4 4-4 4"/></svg>`
                      : `<svg style="margin-left:auto;width:12px;height:12px;color:var(--c-text-muted)" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="10" height="8" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>`}
                  </div>
                  <div style="font-size:12px;color:var(--c-text-dim);line-height:1.5;">
                    ${dept.ultraSecret ? '[ACCESO DENEGADO]' : dept.description.slice(0, 80) + '...'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

/* ── DEPT PAGE ── */
function renderDeptPage(dept) {
  const content = $('#page-content');
  if (!content) return;
  const access = hasAccess(dept);
  setBreadcrumb(['SITIO-AXIOM', 'FUNDACIÓN', dept.name.toUpperCase()]);

  // Banner de departamento
  const bannerHTML = `
    <div class="dept-banner" ${dept.bannerImg ? `style="--dept-banner-url:url('${dept.bannerImg}');"` : ''}>
      ${dept.bannerImg ? `<div class="dept-banner-bg"></div><div class="dept-banner-overlay"></div>` : `<div style="position:absolute;inset:0;background:${dept.accentColor}22;"></div>`}
      <div class="dept-banner-content">
        ${dept.shieldImg ? `<img class="dept-banner-shield" src="${dept.shieldImg}" alt="${dept.name}">` : ''}
        <div class="dept-banner-info">
          <div class="dept-banner-name">${dept.ultraSecret ? `<span class="redacted">${dept.name}</span>` : dept.name}</div>
          <div class="dept-banner-sub">${access ? '✓ ACCESO VERIFICADO — BIENVENIDO' : `NIVEL ${dept.level}+ REQUERIDO`}</div>
        </div>
        <span class="badge ${access ? 'badge-success' : 'badge-neutral'}" style="margin-left:auto">${access ? 'MIEMBRO' : 'SIN ACCESO'}</span>
      </div>
    </div>
  `;

  if (!access && !dept.ultraSecret) {
    content.innerHTML = `
      ${bannerHTML}
      <div class="page-header">
        <div>
          <div class="page-heading">${dept.name}</div>
          <div class="page-subheading">ACCESO RESTRINGIDO — CONSULTA PÚBLICA</div>
        </div>
        <span class="badge badge-neutral">NV-${dept.level}+</span>
      </div>
      <div class="card mb-16">
        <div class="card-label" style="margin-bottom:8px;">Descripción</div>
        <p style="font-size:14px;color:var(--c-text-dim);line-height:1.75;">${dept.description}</p>
      </div>
      <div class="grid-2 mb-16">
        <div class="card">
          <div class="card-label" style="margin-bottom:10px;">Funciones</div>
          ${dept.functions.map(f => `<div style="padding:5px 0;border-bottom:1px solid var(--c-border);font-size:13px;color:var(--c-text-dim);">· ${f}</div>`).join('')}
        </div>
        <div class="card">
          <div class="card-label" style="margin-bottom:10px;">Divisiones</div>
          ${dept.divisions.length ? dept.divisions.map(d => `<div style="padding:5px 0;border-bottom:1px solid var(--c-border);font-size:13px;color:var(--c-text-dim);">· ${d}</div>`).join('') : '<p style="font-size:13px;color:var(--c-text-muted);">Sin divisiones registradas.</p>'}
        </div>
      </div>
      <div class="card" style="background:rgba(74,158,255,0.04);border-color:rgba(74,158,255,0.15);">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:var(--c-text-hi);margin-bottom:4px;">¿Quieres unirte a ${dept.name}?</div>
            <div style="font-size:13px;color:var(--c-text-dim);">Solicita acceso a través del servidor de Discord. Un administrador evaluará tu solicitud.</div>
          </div>
          <a href="https://discord.gg/TU_SERVIDOR" target="_blank" rel="noopener" class="btn btn-discord btn-sm">Solicitar Acceso</a>
        </div>
      </div>
    `;
    return;
  }

  // ACCESO COMPLETO
  content.innerHTML = `
    ${bannerHTML}
    <div class="page-header">
      <div>
        <div class="page-heading">${dept.name}</div>
        <div class="page-subheading">PORTAL DE DEPARTAMENTO — SITIO-AXIOM</div>
      </div>
      <span class="badge badge-success">ACCESO VERIFICADO</span>
    </div>
    <div class="card card-dept-top mb-16">
      <p style="font-size:14px;color:var(--c-text-dim);line-height:1.75;">${dept.description}</p>
    </div>
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-label" style="margin-bottom:10px;">Funciones</div>
        ${dept.functions.map(f => `<div style="padding:6px 0;border-bottom:1px solid var(--c-border);font-size:13px;color:var(--c-text-dim);">· ${f}</div>`).join('')}
      </div>
      <div class="card">
        <div class="card-label" style="margin-bottom:10px;">Divisiones</div>
        ${dept.divisions.length ? dept.divisions.map(d => `<div style="padding:6px 0;border-bottom:1px solid var(--c-border);font-size:13px;color:var(--c-text-dim);">· ${d}</div>`).join('') : '<p style="font-size:13px;color:var(--c-text-muted);">Sin divisiones registradas.</p>'}
      </div>
    </div>
    ${dept.subpages.length ? `
      <div class="card" style="background:var(--dept-color-glow,var(--c-accent-glow));border-color:var(--dept-color,var(--c-accent-dim))22;">
        <div class="card-label" style="margin-bottom:12px;">Módulos disponibles</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${dept.subpages.map(sp => `
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','${dept.id}','${sp}')">${SUBPAGE_LABELS[sp] || sp}</button>
          `).join('')}
        </div>
      </div>
    ` : ''}
    <div style="margin-top:20px;">
      <div class="card-label mb-12">COMUNICADOS INTERNOS</div>
      <div class="announcement info">
        <div class="ann-header"><span class="badge badge-accent">INFO</span><span class="ann-date">RECIENTE</span></div>
        <div class="ann-title">Panel de ${dept.name} — Bienvenida</div>
        <div class="ann-body">Los comunicados específicos de tu departamento aparecerán aquí. Contacta con tu superior para más información.</div>
        <div class="ann-author">— SISTEMA SITIO-AXIOM</div>
      </div>
    </div>
  `;
}

/* ── SUBPÁGINAS ── */
function renderSubpage(dept, sp) {
  const content = $('#page-content');
  if (!content) return;
  setBreadcrumb(['SITIO-AXIOM', 'FUNDACIÓN', dept.name.toUpperCase(), (SUBPAGE_LABELS[sp] || sp).toUpperCase()]);

  switch (`${dept.id}:${sp}`) {
    case 'science:scp-register':      renderSCPRegister(content, dept); break;
    case 'science:breach-log':        renderBreachLog(content, dept); break;
    case 'science:tests':             renderTests(content, dept); break;
    case 'science:class-d-profiles':  renderClassDProfiles(content, dept); break;
    case 'engineering:alma':          renderALMA(content, dept); break;
    case 'engineering:tech-reports':  renderTechReports(content, dept); break;
    case 'medical:inventory':         renderMedInventory(content, dept); break;
    default:                          renderGenericSubpage(dept, sp, content);
  }
}

function renderGenericSubpage(dept, sp, content) {
  const bannerSmall = dept.shieldImg
    ? `<img src="${dept.shieldImg}" style="width:24px;height:24px;object-fit:contain;opacity:0.7;" alt="">`
    : '';
  content.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px;">
        ${bannerSmall}
        <div>
          <div class="page-heading">${SUBPAGE_LABELS[sp] || sp}</div>
          <div class="page-subheading">${dept.name.toUpperCase()} — MÓDULO EN DESARROLLO</div>
        </div>
      </div>
    </div>
    <div class="card" style="text-align:center;padding:48px;">
      <div class="card-label" style="margin-bottom:8px;">MÓDULO EN DESARROLLO</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--c-text-muted);">Disponible cuando la base de datos esté conectada.</div>
    </div>
    <div class="mt-12"><button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','${dept.id}')">← Volver a ${dept.name}</button></div>
  `;
}

function renderSCPRegister(content, dept) {
  content.innerHTML = `
    <div class="page-header">
      <div><div class="page-heading">Registro de Anomalías SCP</div><div class="page-subheading">CIENCIA — BASE DE DATOS SCP · SITIO-AXIOM</div></div>
      <span class="badge badge-danger">CLASIFICADO</span>
    </div>
    <div class="card mb-16">
      <table class="data-table">
        <thead><tr><th>Nº SCP</th><th>Denominación</th><th>Clase</th><th>Ubicación</th><th>Estado</th><th>Responsable</th></tr></thead>
        <tbody>
          <tr><td><span class="scp-num">SCP-001</span></td><td><span class="redacted">████████████████████</span></td><td><span class="badge badge-thaumiel">THAUMIEL</span></td><td>CLASIFICADO</td><td class="text-success">Contenido</td><td>O5-1</td></tr>
          <tr><td><span class="scp-num">SCP-049</span></td><td>El Médico de la Peste</td><td><span class="badge badge-euclid">EUCLID</span></td><td>AX-CELDA-04</td><td class="text-success">Contenido</td><td>Dr. <span class="redacted">███</span></td></tr>
          <tr><td><span class="scp-num">SCP-096</span></td><td>El Tímido</td><td><span class="badge badge-euclid">EUCLID</span></td><td>AX-ALA-C</td><td class="text-danger">⚠ BRECHA</td><td>Agente <span class="redacted">████</span></td></tr>
          <tr><td><span class="scp-num">SCP-173</span></td><td>La Escultura</td><td><span class="badge badge-euclid">EUCLID</span></td><td>AX-CELDA-01</td><td class="text-success">Contenido</td><td>Dr. <span class="redacted">██████</span></td></tr>
          <tr><td><span class="scp-num">SCP-682</span></td><td>El Reptil Indestructible</td><td><span class="badge badge-keter">KETER</span></td><td>AX-NIVEL -7</td><td class="text-warning">En revisión</td><td>Múltiples</td></tr>
        </tbody>
      </table>
    </div>
    <div class="mt-12"><button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','science')">← Volver a Ciencia</button></div>
  `;
}

function renderBreachLog(content, dept) {
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Registro de Brechas</div><div class="page-subheading">CIENCIA — LOG DE INCIDENTES</div></div><span class="badge badge-danger">2 ACTIVAS</span></div>
    <div class="grid-3 mb-16">
      <div class="card"><div class="card-label">Brechas totales</div><div class="card-value">47</div><div class="card-caption">Histórico del sitio</div></div>
      <div class="card"><div class="card-label">Activas ahora</div><div class="card-value danger">2</div><div class="card-caption">Intervención requerida</div></div>
      <div class="card"><div class="card-label">Resueltas este mes</div><div class="card-value success">8</div><div class="card-caption">Tiempo medio: 4.2h</div></div>
    </div>
    <div class="card mb-16">
      <table class="data-table">
        <thead><tr><th>ID</th><th>SCP</th><th>Fecha</th><th>Causa</th><th>Estado</th><th>MTF</th></tr></thead>
        <tbody>
          <tr><td class="text-danger">BR-094</td><td><span class="scp-num">SCP-096</span></td><td>HOY 14:22</td><td>Fallo eléctrico</td><td class="text-danger">ACTIVA</td><td>Épsilon-11</td></tr>
          <tr><td class="text-danger">BR-093</td><td><span class="scp-num">SCP-███</span></td><td>HOY 11:07</td><td><span class="redacted">██████████████</span></td><td class="text-danger">ACTIVA</td><td><span class="redacted">████</span></td></tr>
          <tr><td>BR-092</td><td><span class="scp-num">SCP-049</span></td><td>AYER</td><td>Brecha Clase I</td><td class="text-success">RESUELTA</td><td>Alpha-1</td></tr>
        </tbody>
      </table>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','science')">← Volver a Ciencia</button>
  `;
}

function renderTests(content, dept) {
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Tests con Clase D</div><div class="page-subheading">CIENCIA — EXPERIMENTOS</div></div></div>
    <div class="card mb-16">
      <table class="data-table">
        <thead><tr><th>ID Test</th><th>SCP</th><th>Sujeto</th><th>Investigador</th><th>Resultado</th><th>Fecha</th></tr></thead>
        <tbody>
          <tr><td>T-0244</td><td><span class="scp-num">SCP-049</span></td><td>D-9341</td><td>Dr. <span class="redacted">███</span></td><td class="text-danger">FATALIDAD</td><td>HOY</td></tr>
          <tr><td>T-0243</td><td><span class="scp-num">SCP-049</span></td><td>D-9338</td><td>Dr. <span class="redacted">███</span></td><td class="text-warning">INCONCL.</td><td>AYER</td></tr>
          <tr><td>T-0242</td><td><span class="scp-num">SCP-173</span></td><td>D-9310</td><td>Dr. García</td><td class="text-success">EXITOSO</td><td>HACE 2d</td></tr>
        </tbody>
      </table>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','science')">← Volver a Ciencia</button>
  `;
}

function renderClassDProfiles(content, dept) {
  const subjects = [
    {id:'D-9341', alias:'Sujeto Alfa', status:'Fallecido', statusCls:'danger', test:'SCP-049'},
    {id:'D-9338', alias:'Sujeto Beta', status:'En cuarentena', statusCls:'warning', test:'SCP-049'},
    {id:'D-9310', alias:'Sujeto Gamma', status:'Activo', statusCls:'success', test:'SCP-173'},
    {id:'D-9302', alias:'<span class="redacted">████████</span>', status:'Desaparecido', statusCls:'danger', test:'SCP-███'}
  ];
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Perfiles Clase D</div><div class="page-subheading">CIENCIA — SUJETOS DE PRUEBA</div></div><span class="badge badge-neutral">147 ACTIVOS</span></div>
    <div class="grid-3">
      ${subjects.map(s => `
        <div class="char-card">
          <div class="char-header">
            <div class="char-avatar-box">D</div>
            <div><div class="char-name">${s.id}</div><div class="char-code">${s.alias}</div></div>
            <span class="badge badge-${s.statusCls}" style="margin-left:auto">${s.status}</span>
          </div>
          <div class="char-body">
            <div class="char-stat"><span class="stat-lbl">Último test</span><span class="stat-val"><span class="scp-num">${s.test}</span></span></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="mt-12"><button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','science')">← Volver a Ciencia</button></div>
  `;
}

function renderALMA(content, dept) {
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Sistema IA — ALMA</div><div class="page-subheading">INGENIERÍA — CONTROL DE IA</div></div><span class="badge badge-success">OPERATIVA</span></div>
    <div class="ssu-banner"><div class="ssu-banner-dot"></div><span class="ssu-banner-text">ALMA — Ciclo de procesamiento 447 activo</span><span class="ssu-banner-time" id="alma-clock">--:-- UTC</span></div>
    <div class="grid-4 mb-16">
      <div class="card"><div class="card-label">Estado</div><div class="card-value success" style="font-size:16px">ONLINE</div></div>
      <div class="card"><div class="card-label">Ciclo activo</div><div class="card-value accent">447</div></div>
      <div class="card"><div class="card-label">Carga CPU</div><div class="card-value">34%</div></div>
      <div class="card"><div class="card-label">Alertas</div><div class="card-value danger">3</div></div>
    </div>
    <div class="card card-dept-top mb-16">
      <div class="card-label" style="margin-bottom:10px;">Log de ALMA</div>
      <div class="terminal">
        <div class="terminal-line info">ALMA v3.2 — Iniciando ciclo 447</div>
        <div class="terminal-line">Escaneando instalaciones — 100% completado</div>
        <div class="terminal-line">Cámaras operativas: 312/318</div>
        <div class="terminal-line warn">ALERTA: Cámara 7G sin señal — Contención</div>
        <div class="terminal-line warn">ALERTA: Temperatura anómala — Nivel -3</div>
        <div class="terminal-line err">ALERTA CRÍTICA: Firma anómala — Ala Este</div>
        <div class="terminal-line">Protocolo contención automática — ACTIVADO</div>
      </div>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','engineering')">← Volver a Ingeniería</button>
  `;
  const el = $('#alma-clock');
  if (el) { const t = () => el.textContent = formatTime(); t(); setInterval(t, 1000); }
}

function renderTechReports(content, dept) {
  const isEng = currentUser && (currentUser.depts.includes('engineering') || currentUser.levelNum === 99);
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Reportes Técnicos</div><div class="page-subheading">INGENIERÍA — SISTEMA DE REPORTES</div></div></div>
    <div class="card card-dept-top mb-16">
      <div class="card-label" style="margin-bottom:14px;">ENVIAR REPORTE TÉCNICO</div>
      <div class="grid-2" style="margin-bottom:12px;">
        <div class="input-group">
          <label class="input-label">Usuario</label>
          <input class="input-field" type="text" value="${currentUser?.name || ''}" readonly>
        </div>
        <div class="input-group">
          <label class="input-label">Fecha / Hora (UTC)</label>
          <input class="input-field" type="text" id="report-dt" readonly>
        </div>
      </div>
      <div class="input-group mb-12">
        <label class="input-label">Descripción del fallo</label>
        <textarea class="input-field" id="report-desc" rows="3" placeholder="Describe el problema..."></textarea>
      </div>
      <button class="btn btn-primary btn-sm" onclick="submitReport()">Enviar Reporte</button>
    </div>
    ${isEng ? `
      <div class="card">
        <div class="card-label" style="margin-bottom:12px;">REPORTES RECIBIDOS</div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Usuario</th><th>Fecha</th><th>Descripción</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>TR-041</td><td>Agente Demo</td><td>HOY 15:30</td><td>Cámara 7G sin señal</td><td class="text-warning">Pendiente</td></tr>
            <tr><td>TR-040</td><td>Dr. García</td><td>AYER</td><td>Terminal laboratorio</td><td class="text-success">Resuelto</td></tr>
          </tbody>
        </table>
      </div>
    ` : ''}
    <div class="mt-12"><button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','engineering')">← Volver a Ingeniería</button></div>
  `;
  const dtEl = $('#report-dt');
  if (dtEl) dtEl.value = new Date().toISOString().slice(0,16).replace('T',' ') + ' UTC';
}

function submitReport() {
  const desc = $('#report-desc')?.value.trim();
  if (!desc) { showToast('Escribe una descripción del fallo.', 'warning'); return; }
  showToast('Reporte enviado al departamento de Ingeniería.', 'success');
  if ($('#report-desc')) $('#report-desc').value = '';
}

function renderMedInventory(content, dept) {
  content.innerHTML = `
    <div class="page-header"><div><div class="page-heading">Inventario Médico</div><div class="page-subheading">MEDICINA — STOCK DE SUMINISTROS</div></div><span class="badge badge-accent">ACTUALIZADO HOY</span></div>
    <div class="card mb-16">
      <table class="data-table">
        <thead><tr><th>Ítem</th><th>Cantidad</th><th>Estado</th><th>Ubicación</th></tr></thead>
        <tbody>
          <tr><td>Suero anticoagulante</td><td>42</td><td class="text-success">OK</td><td>Farmacia A-3</td></tr>
          <tr><td>Kit decontaminación tipo B</td><td>8</td><td class="text-warning">BAJO</td><td>Almacén Q-1</td></tr>
          <tr><td>Morfosupresores neuronales</td><td>0</td><td class="text-danger">AGOTADO</td><td>—</td></tr>
          <tr><td>Antídoto Clase-V SCP</td><td><span class="redacted">██</span></td><td class="text-accent">CLASIFICADO</td><td><span class="redacted">████</span></td></tr>
        </tbody>
      </table>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="navigateTo('foundation','medical')">← Volver a Medicina</button>
  `;
}

/* ───────────────────────────────────────────────────────────
   17. RENDER: MAPA
─────────────────────────────────────────────────────────── */

function renderMap() {
  setBreadcrumb(['SITIO-AXIOM', 'MAPA DE INSTALACIONES']);
  const content = $('#page-content');
  if (!content) return;
  const isOmni = currentUser?.levelNum === 99;

  content.innerHTML = `
    <div class="page-header">
      <div><div class="page-heading">Mapa de Instalaciones</div><div class="page-subheading">SITIO-AXIOM — RED GLOBAL · RADAR TÁCTICO</div></div>
      <div style="display:flex;gap:8px;">
        ${isOmni ? '<span class="badge badge-omni">PANEL ADMIN</span>' : ''}
        <span class="badge badge-accent">EN VIVO</span>
      </div>
    </div>

    <div class="map-container mb-16">
      <div class="map-grid-bg"></div>
      <svg style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.06" viewBox="0 0 900 450" preserveAspectRatio="xMidYMid meet">
        <path fill="var(--c-text)" d="M150,100 Q180,80 220,90 Q260,85 280,100 Q300,110 310,130 Q290,140 270,135 Q250,145 240,160 Q210,155 190,140 Q160,130 150,100Z M320,90 Q360,70 410,75 Q450,65 490,80 Q530,85 560,100 Q580,120 570,140 Q540,150 510,145 Q480,160 450,155 Q420,145 400,130 Q370,120 340,115 Q310,105 320,90Z M470,160 Q500,150 530,165 Q560,170 580,185 Q570,200 545,205 Q520,195 495,185 Q475,175 470,160Z M200,200 Q230,185 260,195 Q290,205 300,225 Q280,240 255,235 Q225,225 200,200Z M550,190 Q590,175 630,185 Q670,195 690,215 Q670,230 640,225 Q610,215 580,205 Q560,200 550,190Z M120,250 Q160,235 200,245 Q230,260 240,280 Q215,295 185,285 Q155,270 120,250Z M700,130 Q730,110 760,120 Q790,130 800,150 Q780,165 750,158 Q720,145 700,130Z"/>
      </svg>

      <div class="map-site" style="left:25%;top:38%"><div class="site-dot red"></div><div class="site-label">SITIO-AXIOM ★</div></div>
      <div class="map-site" style="left:22%;top:50%"><div class="site-dot blue"></div><div class="site-label">SITE-23</div></div>
      <div class="map-site" style="left:45%;top:35%"><div class="site-dot blue"></div><div class="site-label">SITE-01</div></div>
      <div class="map-site" style="left:55%;top:42%"><div class="site-dot green"></div><div class="site-label">SITE-76</div></div>
      <div class="map-site" style="left:70%;top:38%"><div class="site-dot green"></div><div class="site-label">SITE-103</div></div>
      <div class="map-site" style="left:78%;top:55%"><div class="site-dot red"></div><div class="site-label">AREA-02</div></div>
      <div class="map-site" style="left:35%;top:62%"><div class="site-dot green"></div><div class="site-label">AREA-14</div></div>

      <div class="map-legend">
        <div class="legend-item"><div class="legend-dot" style="background:var(--c-danger)"></div>Brecha activa / Alerta</div>
        <div class="legend-item"><div class="legend-dot" style="background:var(--c-accent)"></div>Site principal / Axiom</div>
        <div class="legend-item"><div class="legend-dot" style="background:var(--c-success)"></div>Operativo normal</div>
      </div>
    </div>

    ${isOmni ? `
      <div class="card card-accent-top mb-16">
        <div class="card-label" style="margin-bottom:14px;">PANEL DE CONTROL — SOLO ADMIN / O5</div>
        <div class="grid-4">
          <button class="btn btn-ghost btn-sm btn-full">+ Añadir Site</button>
          <button class="btn btn-ghost btn-sm btn-full">Marcar Brecha</button>
          <button class="btn btn-danger-ghost btn-sm btn-full">Evacuar Zona</button>
          <button class="btn btn-ghost btn-sm btn-full">Exportar Mapa</button>
        </div>
        <div style="margin-top:12px;font-family:var(--font-mono);font-size:10px;color:var(--c-text-muted);">Panel completo disponible cuando el mapa esté conectado a la base de datos.</div>
      </div>
    ` : `<div style="font-family:var(--font-mono);font-size:10px;color:var(--c-text-muted);text-align:center;padding:8px;">Panel de control reservado para Admin / O5.</div>`}

    <div class="mt-24">
      <div class="card-label mb-12">GRUPOS DE INTERÉS CONOCIDOS</div>
      <div class="grid-2">
        ${[
          {name:'G.O.C.', full:'Global Occult Coalition', rel:'hostile', lbl:'HOSTIL — Conflictos documentados', desc:'Organización paragubernamental que neutraliza anomalías. Consideran el enfoque de la Fundación un riesgo sistémico.'},
          {name:'C.I.', full:'Chaos Insurgency — Escisión disidente', rel:'hostile', lbl:'HOSTIL — Amenaza prioritaria', desc:'Facción escindida de la Fundación. Se apropian de SCPs para operaciones armadas y desestabilización global.'},
          {name:"Serpent's Hand", full:'La Mano de la Serpiente', rel:'hostile', lbl:'HOSTIL — Sabotaje activo', desc:'Colectivo anarquista. Buscan liberar todas las anomalías. Acceso a la Biblioteca extradimensional.'},
          {name:'M.C.&D.', full:'Marshall, Carter and Dark Ltd.', rel:'neutral', lbl:'NEUTRAL — Acuerdos puntuales', desc:'Club de élite que comercia con objetos anómalos. Motivados por beneficio económico.'}
        ].map(f => `
          <div class="faction-card">
            <div class="faction-name">${f.name}</div>
            <div class="faction-full">${f.full}</div>
            <div class="faction-desc">${f.desc}</div>
            <div class="faction-rel rel-${f.rel}"><div class="rel-dot"></div><span class="rel-lbl">${f.lbl}</span></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ───────────────────────────────────────────────────────────
   18. INIT
─────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initThemeToggles();
  initLogin();

  // Exponer al scope global para onclick en HTML
  window.navigateTo         = navigateTo;
  window.logout             = logout;
  window.handleSidebarClick = handleSidebarClick;
  window.submitReport       = submitReport;
  window.showToast          = showToast;
});
