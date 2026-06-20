// ═══════════════════════════════════════════════════════════════════
// BREIN GYM - app.js
// Slim leer-app vir kinders en grootmense (Sessie 2: Multi-vak)
// ═══════════════════════════════════════════════════════════════════
const { useState, useEffect, useRef } = React;



// ═══════════════════════════════════════════════════════════════════
// BREIN GYM — Slim leer-app vir kinders en grootmense
// Sessie 2: Multi-vak (Optel, Aftrek, Maal, Deel)
// ═══════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'breingym_v1';

// ═══════════════ VAKKE EN VLAKKE ═══════════════
// Vier vakke: Optel, Aftrek, Maal, Deel
// Optel & Aftrek: alle vlakke oop (kind scroll en kies waar te begin)
// Maal & Deel: vergrendel (moet bemeester om aan te beweeg)
// Deel: ekstra slot - vereis Maal Vlak 1 (2× tafel) bemeester voor enige deel oop is

const SUBJECTS = {
  add: {
    id: 'add', name: 'Optel', symbol: '+', emoji: '➕',
    color: '#10b981',
    description: 'Tel getalle bymekaar',
    locked: false,  // alle vlakke oop, kind kies
    skills: [
      { level: 1,  name: '+1 (een meer)',           emoji: '🌱', tip: 'Net een meer as die getal' },
      { level: 2,  name: '+0 en +10',               emoji: '🌿', tip: 'Niks, of net \'n tien' },
      { level: 3,  name: '+2 (twee meer)',          emoji: '🍀', tip: 'Twee meer as die getal' },
      { level: 4,  name: 'Doubles (3+3, 4+4)',      emoji: '🌳', tip: 'Tel \'n getal by homself' },
      { level: 5,  name: '+5 (tot 10)',             emoji: '🌿', tip: 'Vyf bymekaar' },
      { level: 6,  name: 'Maak 10 (8+2, 7+3)',      emoji: '🍃', tip: 'Hoe kry jy presies tien?' },
      { level: 7,  name: 'Optel binne 10',          emoji: '🌲', tip: 'Alle kombinasies onder tien' },
      { level: 8,  name: '+10 met 2-syfer (15+10)', emoji: '🏔️', tip: 'Net die tienetal verander' },
      { level: 9,  name: 'Doubles +1 (3+4, 5+6)',   emoji: '🗻', tip: 'Een meer as \'n double' },
      { level: 10, name: 'Brug oor 10 (8+5)',       emoji: '🌋', tip: 'Maak eers 10, dan voeg by' },
      { level: 11, name: 'Optel binne 20',          emoji: '🔥', tip: 'Alle optel onder twintig' },
      { level: 12, name: '2-syfer + 1-syfer (23+5)', emoji: '💥', tip: 'Net die ene verander' },
      { level: 13, name: '2-syfer + 2-syfer (geen oordra)', emoji: '🚀', tip: 'Net optel - geen leen' },
      { level: 14, name: '2-syfer + 2-syfer (oordra)', emoji: '⚡', tip: 'Met oordra (28+15)' },
      { level: 15, name: '3-syfer optel',           emoji: '🏆', tip: 'Honderde plus honderde' },
      { level: 16, name: 'Optel meester',           emoji: '⭐', tip: 'Bewys jy is meester' }
    ],
    // ═══════════════ LANG OPTEL ═══════════════
    papermethod: {
      id: 'longadd',
      name: 'Lang Optel',
      shortName: 'Op papier',
      emoji: '✏️',
      color: '#22c55e',
      description: 'Lang optel onder mekaar',
      levels: [
        { level: 1, name: '2-syfer + 2-syfer (geen oordra)', emoji: '🌱', digits: 2, carry: false, tip: 'Bv. 23 + 14' },
        { level: 2, name: '2-syfer + 2-syfer (met oordra)',  emoji: '🌿', digits: 2, carry: true,  tip: 'Bv. 47 + 28' },
        { level: 3, name: '3-syfer + 3-syfer (geen oordra)', emoji: '🍀', digits: 3, carry: false, tip: 'Bv. 234 + 145' },
        { level: 4, name: '3-syfer + 3-syfer (met oordra)',  emoji: '🌳', digits: 3, carry: true,  tip: 'Bv. 678 + 254' },
        { level: 5, name: '4-syfer + 4-syfer (geen oordra)', emoji: '🍃', digits: 4, carry: false, tip: 'Bv. 1234 + 2345' },
        { level: 6, name: '4-syfer + 4-syfer (met oordra)',  emoji: '🌲', digits: 4, carry: true,  tip: 'Bv. 4567 + 3789' },
        { level: 7, name: '5-syfer + 5-syfer',                emoji: '🏔️', digits: 5, carry: true,  tip: 'Groot getalle' },
        { level: 8, name: 'Lang Optel meester',               emoji: '⭐', digits: 5, carry: true,  tip: 'Bewys jy is meester' }
      ]
    }
  },
  sub: {
    id: 'sub', name: 'Aftrek', symbol: '−', emoji: '➖',
    color: '#3b82f6',
    description: 'Trek getalle af van mekaar',
    locked: false,
    skills: [
      { level: 1,  name: '−1 (een minder)',         emoji: '🌱', tip: 'Net een minder' },
      { level: 2,  name: '−0 en −10',               emoji: '🌿', tip: 'Niks weg, of net \'n tien' },
      { level: 3,  name: '−2 (twee minder)',        emoji: '🍀', tip: 'Twee minder' },
      { level: 4,  name: 'Halves (10-5, 8-4)',      emoji: '🌳', tip: 'Helfte van die getal' },
      { level: 5,  name: 'Aftrek binne 10',         emoji: '🌿', tip: 'Klein aftrek' },
      { level: 6,  name: '10 minus iets (10-7)',    emoji: '🍃', tip: 'Vat van 10 af' },
      { level: 7,  name: 'Aftrek binne 20 (geen leen)', emoji: '🌲', tip: 'Sonder om te leen' },
      { level: 8,  name: '−10 met 2-syfer (35-10)', emoji: '🏔️', tip: 'Net die tienetal verander' },
      { level: 9,  name: 'Aftrek binne 20 (met leen) 13-5', emoji: '🗻', tip: 'Leen by die tienetal' },
      { level: 10, name: '2-syfer − 1-syfer (geen leen)', emoji: '🌋', tip: '27 − 3 = 24' },
      { level: 11, name: '2-syfer − 1-syfer (met leen)',  emoji: '🔥', tip: '23 − 5 (leen)' },
      { level: 12, name: '2-syfer − 2-syfer (geen leen)', emoji: '💥', tip: '47 − 23' },
      { level: 13, name: '2-syfer − 2-syfer (met leen)',  emoji: '🚀', tip: '43 − 27 (leen)' },
      { level: 14, name: 'Aftrek van 100',          emoji: '⚡', tip: '100 − 37' },
      { level: 15, name: '3-syfer aftrek',          emoji: '🏆', tip: 'Groot getalle' },
      { level: 16, name: 'Aftrek meester',          emoji: '⭐', tip: 'Bewys jy is meester' }
    ],
    // ═══════════════ LANG AFTREK ═══════════════
    papermethod: {
      id: 'longsub',
      name: 'Lang Aftrek',
      shortName: 'Op papier',
      emoji: '✏️',
      color: '#6366f1',
      description: 'Lang aftrek onder mekaar (met leen)',
      levels: [
        { level: 1, name: '2-syfer − 2-syfer (geen leen)', emoji: '🌱', digits: 2, borrow: false, tip: 'Bv. 47 − 23' },
        { level: 2, name: '2-syfer − 2-syfer (met leen)',  emoji: '🌿', digits: 2, borrow: true,  tip: 'Bv. 43 − 27' },
        { level: 3, name: '3-syfer − 3-syfer (geen leen)', emoji: '🍀', digits: 3, borrow: false, tip: 'Bv. 678 − 234' },
        { level: 4, name: '3-syfer − 3-syfer (met leen)',  emoji: '🌳', digits: 3, borrow: true,  tip: 'Bv. 432 − 187' },
        { level: 5, name: '4-syfer − 4-syfer (geen leen)', emoji: '🍃', digits: 4, borrow: false, tip: 'Bv. 5678 − 2345' },
        { level: 6, name: '4-syfer − 4-syfer (met leen)',  emoji: '🌲', digits: 4, borrow: true,  tip: 'Bv. 4321 − 2789' },
        { level: 7, name: '5-syfer − 5-syfer',              emoji: '🏔️', digits: 5, borrow: true,  tip: 'Groot getalle' },
        { level: 8, name: 'Lang Aftrek meester',            emoji: '⭐', digits: 5, borrow: true,  tip: 'Bewys jy is meester' }
      ]
    }
  },
  mult: {
    id: 'mult', name: 'Maal', symbol: '×', emoji: '✖️',
    color: '#f59e0b',
    description: 'Vermenigvuldig (maaltafels)',
    locked: false,  // alle vlakke oop, kind kies
    skills: [
      { level: 1,  name: '2× Tafel',         emoji: '🌱', tables: [2],   tip: 'Dubbel die getal' },
      { level: 2,  name: '10× Tafel',        emoji: '🌿', tables: [10],  tip: 'Sit \'n nul agteraan' },
      { level: 3,  name: '5× Tafel',         emoji: '🍀', tables: [5],   tip: 'Eindig altyd op 0 of 5' },
      { level: 4,  name: 'Mengelmoes 2, 5, 10', emoji: '🌳', tables: [2, 5, 10], tip: 'Toets jou kennis' },
      { level: 5,  name: '4× Tafel',         emoji: '🌿', tables: [4],   tip: 'Dubbel die 2× tafel' },
      { level: 6,  name: '3× Tafel',         emoji: '🍃', tables: [3],   tip: 'Net een meer as 2×' },
      { level: 7,  name: 'Mengelmoes 2-5',   emoji: '🌲', tables: [2, 3, 4, 5], tip: 'Alles tot dusver' },
      { level: 8,  name: '6× Tafel',         emoji: '🏔️', tables: [6],   tip: 'Dubbel die 3× tafel' },
      { level: 9,  name: '8× Tafel',         emoji: '🗻', tables: [8],   tip: 'Dubbel die 4× tafel' },
      { level: 10, name: '9× Tafel',         emoji: '🌋', tables: [9],   tip: 'Vinger-truuk werk' },
      { level: 11, name: '7× Tafel',         emoji: '🔥', tables: [7],   tip: 'Die moeilikste' },
      { level: 12, name: 'Mengelmoes 2-10',  emoji: '💥', tables: [2,3,4,5,6,7,8,9,10], tip: 'Alles 2 tot 10' },
      { level: 13, name: '11× Tafel',        emoji: '🚀', tables: [11],  tip: 'Pragtige patroon tot 9' },
      { level: 14, name: '12× Tafel',        emoji: '⚡', tables: [12],  tip: '10× plus 2×' },
      { level: 15, name: 'Meester 2-12',     emoji: '🏆', tables: [2,3,4,5,6,7,8,9,10,11,12], tip: 'Bewys jy is meester' },
      { level: 16, name: 'Weerlig 2-12',     emoji: '⭐', tables: [2,3,4,5,6,7,8,9,10,11,12], tip: 'Spoed-toets' }
    ],
    // ═══════════════ LANG MAAL ═══════════════
    // Aparte progressie - kind kies tussen "Vinnig" (kop-rekene) en "Op papier" (lang maal)
    // Alle vlakke oop - kind kies waar hy wil begin
    papermethod: {
      id: 'longmult',
      name: 'Lang Maal',
      shortName: 'Op papier',
      emoji: '✏️',
      color: '#0ea5e9',
      description: 'Lang maal stap-vir-stap',
      levels: [
        { level: 1, name: '2-syfer × 2-syfer (klein)',     emoji: '🌱', aDigits: 2, bDigits: 2, aMax: 30,  bMax: 20,  tip: 'Bv. 23 × 12' },
        { level: 2, name: '2-syfer × 2-syfer (medium)',    emoji: '🌿', aDigits: 2, bDigits: 2, aMax: 60,  bMax: 40,  tip: 'Bv. 47 × 23' },
        { level: 3, name: '2-syfer × 2-syfer (groot)',     emoji: '🍀', aDigits: 2, bDigits: 2, aMax: 99,  bMax: 99,  tip: 'Bv. 87 × 64' },
        { level: 4, name: '3-syfer × 2-syfer (klein)',     emoji: '🌳', aDigits: 3, bDigits: 2, aMax: 300, bMax: 30,  tip: 'Bv. 234 × 12' },
        { level: 5, name: '3-syfer × 2-syfer (groot)',     emoji: '🍃', aDigits: 3, bDigits: 2, aMax: 999, bMax: 99,  tip: 'Bv. 786 × 47' },
        { level: 6, name: '2-syfer × 3-syfer',              emoji: '🌲', aDigits: 2, bDigits: 3, aMax: 99,  bMax: 999, tip: 'Bv. 47 × 234' },
        { level: 7, name: '3-syfer × 3-syfer',              emoji: '🏔️', aDigits: 3, bDigits: 3, aMax: 999, bMax: 999, tip: 'Bv. 345 × 287' },
        { level: 8, name: 'Lang Maal meester',              emoji: '⭐', aDigits: 3, bDigits: 3, aMax: 999, bMax: 999, tip: 'Bewys jy is meester' }
      ]
    }
  },
  div: {
    id: 'div', name: 'Deel', symbol: '÷', emoji: '➗',
    color: '#8b5cf6',
    description: 'Deel getalle (omgekeerd van maal)',
    locked: false,  // alle vlakke oop, kind kies
    skills: [
      { level: 1,  name: '÷1 (deel deur 1)',  emoji: '🌱', tables: [1],  tip: 'Bly dieselfde' },
      { level: 2,  name: '÷2 (helfte)',       emoji: '🌿', tables: [2],  tip: 'Helfte van die getal' },
      { level: 3,  name: '÷10',               emoji: '🍀', tables: [10], tip: 'Verwyder die nul' },
      { level: 4,  name: '÷5',                emoji: '🌳', tables: [5],  tip: 'Omgekeerd van 5×' },
      { level: 5,  name: 'Mengel ÷2, ÷5, ÷10', emoji: '🌿', tables: [2, 5, 10], tip: 'Toets kennis' },
      { level: 6,  name: '÷4',                emoji: '🍃', tables: [4],  tip: 'Helfte twee keer' },
      { level: 7,  name: '÷3',                emoji: '🌲', tables: [3],  tip: 'Omgekeerd van 3×' },
      { level: 8,  name: 'Mengel ÷2-5',       emoji: '🏔️', tables: [2, 3, 4, 5], tip: 'Alles tot dusver' },
      { level: 9,  name: '÷6',                emoji: '🗻', tables: [6],  tip: 'Omgekeerd van 6×' },
      { level: 10, name: '÷8',                emoji: '🌋', tables: [8],  tip: 'Omgekeerd van 8×' },
      { level: 11, name: '÷9',                emoji: '🔥', tables: [9],  tip: 'Omgekeerd van 9×' },
      { level: 12, name: '÷7',                emoji: '💥', tables: [7],  tip: 'Die moeilikste' },
      { level: 13, name: 'Mengel ÷2-10',      emoji: '🚀', tables: [2,3,4,5,6,7,8,9,10], tip: 'Alles 2-10' },
      { level: 14, name: 'Deel met restant (10÷3)', emoji: '⚡', tables: [2,3,4,5,6,7,8,9,10], remainder: true, tip: '10÷3 = 3 res 1' },
      { level: 15, name: '÷11 en ÷12',        emoji: '🏆', tables: [11, 12], tip: 'Groot getalle' },
      { level: 16, name: 'Deel meester',      emoji: '⭐', tables: [2,3,4,5,6,7,8,9,10,11,12], tip: 'Bewys jy is meester' }
    ],
    // ═══════════════ STAARTDELING (LANG DEEL) ═══════════════
    // Aparte progressie - kind kies tussen "Vinnig" (kop-rekene) en "Op papier" (staartdeling)
    // Alle vlakke oop - kind kies waar hy wil begin
    papermethod: {
      id: 'longdiv',
      name: 'Staartdeling',
      shortName: 'Op papier',
      emoji: '✏️',
      color: '#a855f7',
      description: 'Lang somme stap-vir-stap',
      levels: [
        { level: 1, name: '2-syfer ÷ 1-syfer (geen restant)', emoji: '🌱', digits: 2, divisorRange: [2, 5], remainder: false, tip: 'Begin maklik: 48÷2' },
        { level: 2, name: '3-syfer ÷ 1-syfer (geen restant)', emoji: '🌿', digits: 3, divisorRange: [2, 5], remainder: false, tip: 'Bv. 369÷3' },
        { level: 3, name: '3-syfer ÷ 1-syfer (met restant)',  emoji: '🍀', digits: 3, divisorRange: [2, 5], remainder: true,  tip: 'Bv. 437÷5 = 87 res 2' },
        { level: 4, name: '4-syfer ÷ 1-syfer (geen restant)', emoji: '🌳', digits: 4, divisorRange: [2, 5], remainder: false, tip: 'Bv. 2654÷2' },
        { level: 5, name: '4-syfer ÷ 1-syfer (met restant)',  emoji: '🍃', digits: 4, divisorRange: [2, 6], remainder: true,  tip: 'Bv. 2654÷3' },
        { level: 6, name: '4-syfer ÷ 1-syfer (groot deler)',  emoji: '🌲', digits: 4, divisorRange: [6, 9], remainder: true,  tip: 'Bv. 5683÷7' },
        { level: 7, name: '5-syfer ÷ 1-syfer',                 emoji: '🏔️', digits: 5, divisorRange: [2, 9], remainder: true,  tip: 'Groot getalle: 12345÷7' },
        { level: 8, name: 'Staartdeling meester',             emoji: '⭐', digits: 5, divisorRange: [2, 9], remainder: true,  tip: 'Bewys jy is meester' }
      ]
    }
  }
};

// Volgorde van vakke (vir vertoning)
const SUBJECT_ORDER = ['add', 'sub', 'mult', 'div'];

const AVATARS = ['🦊', '🐯', '🦁', '🐻', '🐼', '🐨', '🦄', '🐲', '🦋', '🐙', '🦉', '🐧', '🦜', '🐢'];

const DEFAULT_FRIDAY_REWARD = 5; // R5 globaal verstek

// ═══════════════ STORAGE ═══════════════
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profiles: [], activeProfileId: null, settings: { soundOn: true, globalFridayReward: DEFAULT_FRIDAY_REWARD } };
    const parsed = JSON.parse(raw);
    if (!parsed.settings) parsed.settings = { soundOn: true, globalFridayReward: DEFAULT_FRIDAY_REWARD };
    if (parsed.settings.soundOn === undefined) parsed.settings.soundOn = true;
    if (parsed.settings.globalFridayReward === undefined) parsed.settings.globalFridayReward = DEFAULT_FRIDAY_REWARD;

    // Migrasie: ou profiele het nie levelStats / sprintRecords nie
    if (parsed.profiles) {
      parsed.profiles = parsed.profiles.map(p => {
        const updated = { ...p };
        if (!updated.levelStats) updated.levelStats = {};
        if (!updated.sprintRecords) updated.sprintRecords = { mult: updated.sprintRecord || 0 };
        // Migrasie: ou factStats het sleutels soos "3x7" - migreer na "mult:3x7"
        if (updated.factStats) {
          const newFactStats = {};
          let needsMigration = false;
          for (const [key, val] of Object.entries(updated.factStats)) {
            if (!key.includes(':')) {
              // Ou formaat - aanvaar as maal
              newFactStats[`mult:${key}`] = val;
              needsMigration = true;
            } else {
              newFactStats[key] = val;
            }
          }
          if (needsMigration) updated.factStats = newFactStats;
        }
        return updated;
      });
    }
    return parsed;
  } catch {
    return { profiles: [], activeProfileId: null, settings: { soundOn: true, globalFridayReward: DEFAULT_FRIDAY_REWARD } };
  }
};

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

const newProfile = (name, avatar, dyslexiaMode) => ({
  id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
  name, avatar, dyslexiaMode,
  customFridayReward: null,  // null = gebruik global; nommer = oorskryf
  totalEarned: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  streakDays: 0,
  lastPracticeDate: null,
  factStats: {},  // "add:3+5" -> { correct, wrong, avgMs }
  levelStats: {}, // "add_L3" -> { correct, wrong } - per vlak counter
  bestRecord: { score: 0, time: 999 },
  sprintRecord: 0,  // 60-sek wedren rekord (per vak)
  sprintRecords: {}, // { add: 25, sub: 18, mult: 30, div: 12 }
  achievements: [],
  weeklyEarnings: [],
  createdAt: new Date().toISOString()
});

// ═══════════════ FACT KEYS PER VAK ═══════════════
// Ons stoor stats per vak om vermenging te voorkom:
// Optel:  "add:3+5"
// Aftrek: "sub:7-3"
// Maal:   "mult:3x4"
// Deel:   "div:12÷3"
const factKey = (subject, a, b) => {
  const ops = { add: '+', sub: '-', mult: 'x', div: '÷' };
  return `${subject}:${a}${ops[subject]}${b}`;
};

// ═══════════════ ADAPTIEWE TYD-SISTEEM ═══════════════
// Slim per-feit tyd berekening
const getTimePerQuestion = (profile, factKeyStr, currentSkillLevel) => {
  const stats = profile.factStats || {};
  const fact = stats[factKeyStr];

  let baseTime;
  if (currentSkillLevel <= 4) baseTime = 15;
  else if (currentSkillLevel <= 8) baseTime = 12;
  else if (currentSkillLevel <= 12) baseTime = 9;
  else baseTime = 7;

  if (profile.dyslexiaMode) {
    baseTime = Math.round(baseTime * 1.6);
  }

  if (!fact) return baseTime;

  const correct = fact.correct || 0;
  const wrong = fact.wrong || 0;
  const avgMs = fact.avgMs || 0;

  if (correct >= 5 && avgMs > 0 && avgMs < 4000) {
    return profile.dyslexiaMode ? 6 : 4;
  }

  let time = baseTime;
  const total = correct + wrong;
  if (total >= 3) {
    const accuracy = correct / total;
    if (accuracy >= 0.9) time -= 3;
    else if (accuracy >= 0.7) time -= 1;
    else if (accuracy < 0.5) time += 2;
  }

  const floor = profile.dyslexiaMode ? 6 : 3;
  const ceiling = profile.dyslexiaMode ? 25 : 18;
  return Math.max(floor, Math.min(ceiling, time));
};

// ═══════════════ VRAAG GENERATORS PER VAK ═══════════════
// Genereer 'n vraag vir 'n bepaalde vak en vlak

// HOOF GENERATOR
const generateQuestion = (profile, subjectId, level) => {
  if (subjectId === 'add') return generateAddQuestion(level);
  if (subjectId === 'sub') return generateSubQuestion(level);
  if (subjectId === 'mult') return generateMultQuestion(profile, level);
  if (subjectId === 'div') return generateDivQuestion(level);
  return generateMultQuestion(profile, 1); // fallback
};

// OPTEL VRAE
const generateAddQuestion = (level) => {
  let a, b;
  switch (level) {
    case 1:  // +1
      a = randInt(0, 20); b = 1; break;
    case 2:  // +0 en +10
      a = randInt(0, 50); b = Math.random() < 0.5 ? 0 : 10; break;
    case 3:  // +2
      a = randInt(0, 20); b = 2; break;
    case 4:  // doubles
      a = randInt(2, 10); b = a; break;
    case 5:  // +5
      a = randInt(0, 10); b = 5; break;
    case 6: { // make 10
      const pairs = [[1,9],[2,8],[3,7],[4,6],[5,5],[6,4],[7,3],[8,2],[9,1]];
      const p = pairs[randInt(0, pairs.length - 1)];
      a = p[0]; b = p[1]; break;
    }
    case 7:  // optel binne 10
      a = randInt(1, 9); b = randInt(1, 9 - a + 1); if (a + b > 10) b = 10 - a; break;
    case 8:  // +10 met 2-syfer
      a = randInt(11, 89); b = 10; break;
    case 9: { // doubles +1
      const d = randInt(2, 9); a = d; b = d + 1; break;
    }
    case 10: { // brug oor 10 (8+5, 7+6, 9+4)
      a = randInt(6, 9); b = randInt(11 - a, 9); break;
    }
    case 11: // optel binne 20
      a = randInt(2, 18); b = randInt(2, 20 - a); break;
    case 12: // 2-syfer + 1-syfer
      a = randInt(11, 89); b = randInt(2, 9); break;
    case 13: { // 2-syfer + 2-syfer (geen oordra)
      const aTen = randInt(1, 7), aOne = randInt(0, 4);
      const bTen = randInt(1, 8 - aTen), bOne = randInt(0, 9 - aOne);
      a = aTen * 10 + aOne; b = bTen * 10 + bOne; break;
    }
    case 14: { // 2-syfer + 2-syfer (oordra)
      a = randInt(15, 79); b = randInt(15, 89);
      // forseer oordra
      if ((a % 10) + (b % 10) < 10) b = b - (b % 10) + (10 - (a % 10) + randInt(0, 4));
      if (a + b > 99) b = 99 - a;
      break;
    }
    case 15: // 3-syfer optel
      a = randInt(100, 800); b = randInt(100, 199); break;
    case 16: // meester
      a = randInt(50, 500); b = randInt(50, 499); break;
    default:
      a = randInt(1, 10); b = randInt(1, 10);
  }
  return { a, b, answer: a + b, op: '+' };
};

// AFTREK VRAE
const generateSubQuestion = (level) => {
  let a, b;
  switch (level) {
    case 1:  // -1
      a = randInt(2, 20); b = 1; break;
    case 2:  // -0 en -10
      a = randInt(10, 50); b = Math.random() < 0.5 ? 0 : 10; break;
    case 3:  // -2
      a = randInt(2, 20); b = 2; break;
    case 4: { // halves
      const e = randInt(2, 10) * 2; a = e; b = e / 2; break;
    }
    case 5:  // aftrek binne 10
      a = randInt(2, 10); b = randInt(1, a); break;
    case 6: { // 10 minus iets
      a = 10; b = randInt(1, 9); break;
    }
    case 7: { // aftrek binne 20 (geen leen)
      a = randInt(11, 19); b = randInt(1, a % 10); break;
    }
    case 8:  // -10 met 2-syfer
      a = randInt(15, 89); b = 10; break;
    case 9: { // aftrek binne 20 (met leen)
      const aTen = randInt(1, 1), aOne = randInt(0, 4);
      a = 10 + aTen * 10 + aOne;
      b = randInt(aOne + 1, 9);
      if (a < 11) a = 13;
      break;
    }
    case 10: { // 2-syfer - 1-syfer (geen leen)
      a = randInt(11, 89); b = randInt(1, a % 10 || 1); break;
    }
    case 11: { // 2-syfer - 1-syfer (met leen)
      a = randInt(11, 89);
      const aOne = a % 10;
      b = randInt(aOne + 1, 9);
      if (b > 9) b = 9;
      break;
    }
    case 12: { // 2-syfer - 2-syfer (geen leen)
      const aTen = randInt(2, 9), aOne = randInt(0, 9);
      a = aTen * 10 + aOne;
      const bTen = randInt(1, aTen - 1), bOne = randInt(0, aOne);
      b = bTen * 10 + bOne;
      break;
    }
    case 13: { // 2-syfer - 2-syfer (met leen)
      a = randInt(20, 89); b = randInt(11, a - 1);
      // forseer leen
      if ((a % 10) >= (b % 10)) b = b - (b % 10) + (a % 10) + randInt(1, 9 - (a % 10));
      if (b > a) b = a - randInt(11, 20);
      if (b < 11) b = randInt(11, a - 1);
      break;
    }
    case 14: // aftrek van 100
      a = 100; b = randInt(11, 89); break;
    case 15: // 3-syfer aftrek
      a = randInt(200, 900); b = randInt(50, a - 50); break;
    case 16: // meester
      a = randInt(100, 999); b = randInt(50, a - 1); break;
    default:
      a = randInt(2, 10); b = randInt(1, a);
  }
  return { a, b, answer: a - b, op: '-' };
};

// MAAL VRAE
const generateMultQuestion = (profile, level) => {
  const skill = SUBJECTS.mult.skills[level - 1] || SUBJECTS.mult.skills[0];
  const tables = skill.tables;

  // 30% kans: fokus op swak feite van hierdie vak
  const stats = profile.factStats || {};
  const weakFacts = Object.entries(stats)
    .filter(([key, s]) => {
      if (!key.startsWith('mult:')) return false;
      const total = (s.correct || 0) + (s.wrong || 0);
      if (total < 3) return false;
      return (s.wrong || 0) / total >= 0.3;
    })
    .map(([key]) => key);

  if (weakFacts.length > 0 && Math.random() < 0.3) {
    const pick = weakFacts[Math.floor(Math.random() * weakFacts.length)];
    const m = pick.match(/mult:(\d+)x(\d+)/);
    if (m) {
      const a = parseInt(m[1]), b = parseInt(m[2]);
      // Net gebruik as die feit by huidige tafels pas
      if (tables.includes(a) || tables.includes(b)) {
        return { a, b, answer: a * b, op: '×' };
      }
    }
  }

  const a = tables[Math.floor(Math.random() * tables.length)];
  const b = randInt(2, 12);
  return { a, b, answer: a * b, op: '×' };
};

// DEEL VRAE
const generateDivQuestion = (level) => {
  const skill = SUBJECTS.div.skills[level - 1] || SUBJECTS.div.skills[0];
  const tables = skill.tables;
  const allowRemainder = skill.remainder === true;

  const divisor = tables[Math.floor(Math.random() * tables.length)];

  if (allowRemainder) {
    // Vlak 14: deel met restant
    const quotient = randInt(2, 9);
    const remainder = randInt(1, divisor - 1);
    const a = quotient * divisor + remainder;
    return { a, b: divisor, answer: quotient, remainder, op: '÷', hasRemainder: true };
  }

  // Gewone deel - antwoord moet 'n heelgetal wees
  const quotient = randInt(2, 12);
  const a = quotient * divisor;
  return { a, b: divisor, answer: quotient, op: '÷' };
};

// ═══════════════ STAARTDELING ENGINE ═══════════════
// Genereer 'n staartdeling-probleem en los dit op as 'n reeks stappe.
// Elke stap is 'n highlight + verwagte invoer (digit) + verduideliking + hint.

const generateLongDivProblem = (level) => {
  const skill = SUBJECTS.div.papermethod.levels[level - 1] || SUBJECTS.div.papermethod.levels[0];
  const digits = skill.digits;
  const [dMin, dMax] = skill.divisorRange;
  const allowRem = skill.remainder;

  let dividend, divisor, attempts = 0;
  do {
    divisor = randInt(dMin, dMax);
    if (allowRem) {
      // Enige getal in die syfer-reeks
      const minDvd = Math.pow(10, digits - 1);
      const maxDvd = Math.pow(10, digits) - 1;
      dividend = randInt(minDvd, maxDvd);
    } else {
      // Geen restant: kies 'n heelgetal-quotient en vermenigvuldig
      const minQ = Math.ceil(Math.pow(10, digits - 1) / divisor);
      const maxQ = Math.floor((Math.pow(10, digits) - 1) / divisor);
      const q = randInt(minQ, maxQ);
      dividend = q * divisor;
    }
    attempts++;
  } while (attempts < 20 && String(dividend).length !== digits);

  return { dividend, divisor, level, allowRemainder: allowRem };
};

// Los staartdeling op stap-vir-stap. Lewer 'n array van stappe wat die UI lei.
// Elke stap dui aan: tipe ('quotient_digit' | 'multiply' | 'subtract' | 'bring_down' | 'final_remainder'),
// posisie waar getal kom, verwagte waarde, verduideliking, en hint.
const solveLongDivision = (dividend, divisor) => {
  const digits = String(dividend).split('').map(d => parseInt(d, 10));
  const N = digits.length;
  const steps = [];
  const quotientDigits = []; // syfers van die antwoord
  let workingNumber = 0; // huidige getal waarmee ons werk (na bring-down)

  // Vir UI: 'n grid stelsel. Ry 0 = antwoord (quotient), Ry 1 = dividend (statiese),
  // dan vir elke posisie: 'n trekruimte rij vir multiply, 'n minus rij, en bring-down.
  // Maar ons hou dit eenvoudig met 'n logiese model: per dividend-posisie kry ons:
  //   - quotient digit (bo)
  //   - multiplication (subtrahend onder)
  //   - subtraction (verskil)
  //   - bring down (volgende digit langs verskil)

  for (let i = 0; i < N; i++) {
    workingNumber = workingNumber * 10 + digits[i];

    // Quotient digit op posisie i (0-indexed van links)
    const qDigit = Math.floor(workingNumber / divisor);
    const product = qDigit * divisor;
    const difference = workingNumber - product;

    // Slaan eerste leidende nulle oor in die kwosient (bv. 234÷5 begin op 4 nie 0)
    const isFirstNonZero = quotientDigits.length === 0;
    if (qDigit === 0 && isFirstNonZero && i < N - 1) {
      // Trek volgende digit af - probeer weer
      // (workingNumber bly soos dit is; 'n 0 word nie geskryf as eerste digit nie)
      continue;
    }

    quotientDigits.push(qDigit);

    // STAP A: Skryf kwosient-syfer bo posisie i
    steps.push({
      type: 'quotient_digit',
      position: i,
      value: qDigit,
      workingNumber,
      explanation: `Hoeveel keer pas ${divisor} in ${workingNumber}? ${qDigit} keer (want ${divisor}×${qDigit} = ${product}, en ${divisor}×${qDigit + 1} = ${divisor * (qDigit + 1)} is te groot).`,
      hint: `Kyk na die maaltafel van ${divisor}. Wat is die grootste getal × ${divisor} wat onder of gelyk aan ${workingNumber} is?`,
      shortHint: `${divisor} pas ${qDigit} keer in ${workingNumber}.`
    });

    // STAP B: Skryf vermenigvuldiging onder
    steps.push({
      type: 'multiply',
      position: i,
      value: product,
      explanation: `Skryf ${divisor}×${qDigit} = ${product} onder ${workingNumber}, om af te trek.`,
      hint: `Bereken ${divisor} × ${qDigit}. Wat kry jy?`,
      shortHint: `${divisor} × ${qDigit} = ${product}`,
      multiplicand: qDigit,
      multiplier: divisor
    });

    // STAP C: Trek af
    steps.push({
      type: 'subtract',
      position: i,
      value: difference,
      explanation: `Trek af: ${workingNumber} − ${product} = ${difference}.`,
      hint: `Wat is ${workingNumber} minus ${product}?`,
      shortHint: `${workingNumber} − ${product} = ${difference}`,
      minuend: workingNumber,
      subtrahend: product
    });

    workingNumber = difference;

    // STAP D: Bring volgende digit af (as daar nog een is)
    if (i < N - 1) {
      const nextDigit = digits[i + 1];
      const newWorking = workingNumber * 10 + nextDigit;
      steps.push({
        type: 'bring_down',
        position: i + 1,
        value: nextDigit,
        explanation: `Bring die volgende syfer (${nextDigit}) af. Nou werk ons met ${newWorking}.`,
        hint: `Skryf die volgende syfer (${nextDigit}) langs ${difference}.`,
        shortHint: `Bring ${nextDigit} af → ${newWorking}`
      });
    }
  }

  const quotient = parseInt(quotientDigits.join(''), 10);
  const remainder = workingNumber;

  return {
    steps,
    quotient,
    remainder,
    quotientDigits,
    digits  // dividend syfers
  };
};

// ═══════════════ LANG MAAL ENGINE ═══════════════
// Genereer 'n lang-maal probleem (a × b waar beide multi-syfer is).
const generateLongMultProblem = (level) => {
  const skill = SUBJECTS.mult.papermethod.levels[level - 1] || SUBJECTS.mult.papermethod.levels[0];
  const aMin = Math.pow(10, skill.aDigits - 1);
  const aMaxLim = Math.min(skill.aMax, Math.pow(10, skill.aDigits) - 1);
  const bMin = Math.pow(10, skill.bDigits - 1);
  const bMaxLim = Math.min(skill.bMax, Math.pow(10, skill.bDigits) - 1);
  const a = randInt(aMin, aMaxLim);
  const b = randInt(bMin, bMaxLim);
  return { a, b, level };
};

// Los lang maal op stap-vir-stap met PER-SYFER breakdown.
// Vir a × b waar a het m syfers en b het n syfers:
//   Per b-syfer (van regs na links):
//     Per a-syfer (van regs na links):
//       'n digit_step: a-syfer × b-syfer + carry → write digit + new carry
//   Dan partial product is opgebou
//   Aan einde: final_sum stap
const solveLongMultiplication = (a, b) => {
  const aStr = String(a);
  const aDigits = aStr.split('').map(d => parseInt(d, 10));  // [4, 7] vir 47
  const bStr = String(b);
  const bDigits = bStr.split('').map(d => parseInt(d, 10));  // [2, 3] vir 23
  const M = aDigits.length;
  const N = bDigits.length;

  const partials = [];  // [{ digit, place, partialValue, partialDigits[] }]
  const steps = [];

  // Loop oor b-syfers van regs na links (place 0 eerste)
  for (let bi = N - 1; bi >= 0; bi--) {
    const bDigit = bDigits[bi];
    const bPlace = N - 1 - bi;  // 0=ones, 1=tens, 2=hundreds
    const bPlaceValue = bDigit * Math.pow(10, bPlace);  // bv. b-syfer 2 in tens place = 20

    // Per a-syfer (van regs na links), bereken digit-stap met carry
    let carry = 0;
    for (let ai = M - 1; ai >= 0; ai--) {
      const aDigit = aDigits[ai];
      const aPlace = M - 1 - ai;  // 0=ones, 1=tens
      const product = aDigit * bDigit + carry;
      const isLastADigit = (ai === 0);
      // Vir laaste a-syfer: skryf die HELE product (dalk multi-digit) saam.
      // Anders: skryf net die ene-syfer en dra die res.
      const writeValue = isLastADigit ? product : (product % 10);
      const newCarry = isLastADigit ? 0 : Math.floor(product / 10);

      // Posisie waar hierdie syfer(s) verskyn in die partial:
      // bPlace = b-syfer se plek, aPlace = a-syfer se kolom.
      // Vir laaste a-syfer met multi-digit waarde: partialColPos is die regs-mees plek
      // (dieselfde formule, want die multi-digit waarde versprei van partialColPos na links)
      const partialColPos = bPlace + aPlace;

      // Verduideliking
      const carryStr = carry > 0 ? ` + ${carry} (dra)` : '';
      const writeStr = isLastADigit
        ? `Skryf ${product}.`
        : `Skryf ${writeValue}${newCarry > 0 ? `, dra ${newCarry}` : ''}.`;
      const explanation = `${bDigit} × ${aDigit}${carryStr} = ${product}. ${writeStr}`;
      const hint = carry > 0
        ? `Wat is ${bDigit} × ${aDigit}? Tel dan die ${carry} (dra) by.`
        : `Wat is ${bDigit} × ${aDigit}?`;
      const shortHint = `${bDigit} × ${aDigit}${carryStr} = ${product}`;

      steps.push({
        type: 'mult_digit',
        // Wat die kind moet tik: die VOLLEDIGE waarde (writeValue),
        // want dis hoe skole dit leer skryf
        value: writeValue,
        // Visuele inligting:
        bDigit,
        aDigit,
        bPlace,
        aPlace,
        partialColPos,
        writeDigit: writeValue,
        newCarry,
        carryUsed: carry,
        isLastADigit,
        partialIdx: partials.length,
        explanation,
        hint,
        shortHint,
        stepName: `${bDigit} × ${aDigit}${carry > 0 ? ` + ${carry}` : ''}`
      });

      carry = newCarry;
    }

    // Bereken die volledige partial value
    const partialBase = a * bDigit;
    const partialValue = partialBase * Math.pow(10, bPlace);

    partials.push({
      digit: bDigit,
      place: bPlace,
      partialValue,
      baseProduct: partialBase
    });
  }

  // Finale stap: tel die partials op (slegs as daar > 1 partial is)
  const finalAnswer = partials.reduce((acc, p) => acc + p.partialValue, 0);
  if (partials.length > 1) {
    const partialList = partials.map(p => p.partialValue).join(' + ');
    steps.push({
      type: 'final_sum',
      value: finalAnswer,
      explanation: `Tel die antwoorde bymekaar: ${partialList} = ${finalAnswer}.`,
      hint: `Tel hierdie getalle op: ${partialList}`,
      shortHint: `Antwoord: ${finalAnswer}`,
      stepName: 'Tel saam'
    });
  } else {
    // Net een partial = die finale antwoord is reeds opgebou
    // Voeg 'n confirmation stap by waar kind die antwoord skryf
    steps.push({
      type: 'final_sum',
      value: finalAnswer,
      explanation: `Die antwoord is ${finalAnswer}.`,
      hint: `Wat is ${a} × ${b}?`,
      shortHint: `Antwoord: ${finalAnswer}`,
      stepName: 'Antwoord'
    });
  }

  return {
    steps,
    answer: finalAnswer,
    partials,
    a, b,
    aDigits,
    bDigits
  };
};

// Bou 'n display-grid vir lang maal (per-syfer breakdown).
// Layout (vir 47 × 23):
//   Row 0:           4 7        ← a (statiese)
//   Row 1:         × 2 3        ← b (statiese, met × in linker kolom)
//   Row 2: ─────                ← lyn na b
//   Row 3:         _ _ _        ← partial 1 (cells gevul deur mult_digit stappe)
//   Row 4:       _ _ _ _        ← partial 2 (cells gevul deur mult_digit stappe)
//   Row 5: ─────                ← lyn voor final
//   Row 6:       1 0 8 1        ← finale antwoord
const buildLongMultGrid = (a, b, solution) => {
  const aStr = String(a);
  const bStr = String(b);
  const finalStr = String(solution.answer);
  const widthA = aStr.length;
  const widthB = bStr.length;
  const widthFinal = finalStr.length;
  const maxPartialW = Math.max(...solution.partials.map(p => String(p.partialValue).length));
  const cols = Math.max(widthFinal, maxPartialW, widthA + 1, widthB + 1) + 1;
  const RIGHT_COL = cols - 1; // rightmost column (units)

  const rows = [];

  // Row 0: a (regs-belyn)
  const aRow = { kind: 'a_row', cells: new Array(cols).fill(null) };
  for (let k = 0; k < aStr.length; k++) {
    const col = RIGHT_COL - (aStr.length - 1 - k);
    // aPlace: 0 = ones, 1 = tens, ens. (van regs-na-links)
    const aPlace = aStr.length - 1 - k;
    aRow.cells[col] = { type: 'static_a', value: parseInt(aStr[k], 10), col, row: 0, aPlace };
  }
  rows.push(aRow);

  // Row 1: × b (regs-belyn met × teken)
  const bRow = { kind: 'b_row', cells: new Array(cols).fill(null) };
  for (let k = 0; k < bStr.length; k++) {
    const col = RIGHT_COL - (bStr.length - 1 - k);
    const bPlace = bStr.length - 1 - k;
    bRow.cells[col] = { type: 'static_b', value: parseInt(bStr[k], 10), col, row: 1, showTimes: k === 0, bPlace };
  }
  rows.push(bRow);

  // Underline na b
  rows.push({ kind: 'underline', startCol: RIGHT_COL - Math.max(widthA, widthB) + 1, endCol: RIGHT_COL, cells: new Array(cols).fill(null) });

  // Per partial: 'n rij waar elke cell gekoppel is aan die spesifieke mult_digit stap
  // wat dit gevul het.
  solution.partials.forEach((p, pi) => {
    const pStr = String(p.partialValue);
    const partialDigits = pStr.split('').map(d => parseInt(d, 10));  // links na regs
    const partialLen = partialDigits.length;
    const pRow = { kind: 'partial', cells: new Array(cols).fill(null), partialIdx: pi };

    // Vir hierdie partial: identifiseer al die mult_digit stappe wat dit raak
    const stepsForPartial = solution.steps
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => s.type === 'mult_digit' && s.partialIdx === pi);

    // Vir elke kolom van die partial, vind welke step die syfer skryf
    // Posisie binne partial (van regs): 0, 1, 2, ...
    // Step.partialColPos == k beteken die step skryf 'n syfer in posisie k (regs-na-links).
    // Vir 'n laaste-a-syfer step met multi-digit waarde (bv. 14), word DIE STAP self versprei
    //   oor partialColPos en partialColPos+1, ..., met ander digitIndexe.
    // Maar omdat ons elke cel slegs een step kan toeken, hanteer ons multi-digit deur
    //   die LAASTE step se digit-versprei tracking (digitIndex en digitTotal).

    for (let k = 0; k < partialLen; k++) {
      // colPos vanaf regs = k word genormaliseer: posisie k vanaf regs
      const colPosFromRight = partialLen - 1 - k;
      const col = RIGHT_COL - (partialLen - 1 - k);

      // Vind die step wat hierdie cel vul
      // 'n step se direkte target is partialColPos. As die step is "isLastADigit" en sy waarde
      //   is multi-digit, dan vul dit cells partialColPos, partialColPos+1, ... (na links)
      let owningStep = null;
      let digitIndex = 0;
      let digitTotal = 1;

      for (const { s, idx } of stepsForPartial) {
        const valStr = String(s.writeDigit);
        const stepLen = valStr.length;
        // Step se cells span van partialColPos (regs) tot partialColPos+stepLen-1 (links)
        const stepRight = s.partialColPos;
        const stepLeft = s.partialColPos + stepLen - 1;
        if (colPosFromRight >= stepRight && colPosFromRight <= stepLeft) {
          owningStep = { s, idx, stepLen, stepRight };
          // digitIndex (links=0): omgekeerd van colPos
          digitIndex = stepLeft - colPosFromRight;
          digitTotal = stepLen;
          break;
        }
      }

      if (owningStep) {
        pRow.cells[col] = {
          type: 'partial_digit',
          value: partialDigits[k],
          stepIndex: owningStep.idx,
          col, row: rows.length,
          digitIndex,
          digitTotal,
          partialIdx: pi,
          colPosFromRight
        };
      } else {
        // Geen step vul dit nie — hierdie is 'n placeholder 0 (vir 2de+ partial se trailing zeros)
        // bv. partial 940 het 'n 0 by colPos=0 wat nie deur 'n mult_digit stap geskryf word nie.
        // Hierdie cells word gevul wanneer die *eerste* step van hierdie partial begin.
        // Ons koppel dit aan die eerste step van die partial.
        const firstStepOfPartial = stepsForPartial[0];
        if (firstStepOfPartial) {
          pRow.cells[col] = {
            type: 'partial_placeholder_zero',
            value: 0,
            stepIndex: firstStepOfPartial.idx,
            col, row: rows.length,
            partialIdx: pi,
            colPosFromRight
          };
        }
      }
    }

    rows.push(pRow);
  });

  // Lyn voor finale antwoord (slegs as daar > 1 partial is)
  if (solution.partials.length > 1) {
    rows.push({ kind: 'underline', startCol: RIGHT_COL - widthFinal + 1, endCol: RIGHT_COL, cells: new Array(cols).fill(null) });

    // Finale antwoord ry
    const finalStepIndex = solution.steps.findIndex(s => s.type === 'final_sum');
    const fRow = { kind: 'final', cells: new Array(cols).fill(null) };
    for (let k = 0; k < finalStr.length; k++) {
      const col = RIGHT_COL - (finalStr.length - 1 - k);
      fRow.cells[col] = {
        type: 'final_digit',
        value: parseInt(finalStr[k], 10),
        stepIndex: finalStepIndex,
        col, row: rows.length,
        digitIndex: k,
        digitTotal: finalStr.length
      };
    }
    rows.push(fRow);
  } else {
    // Een partial = die antwoord IS die partial (geen aparte final-rij nodig)
    // Maar ons benodig steeds 'n stepIndex vir die final_sum stap; dit hoef nie sigbaar te wees nie
  }

  return { rows, cols, solution, RIGHT_COL };
};

// Render-komponent vir die lang-maal grid.
function LongMultGrid({ grid, fillUpTo, activeStep, currentStep, userInput, wrongFlash, dyslexiaMode }) {
  const cellW = dyslexiaMode ? 38 : 32;
  const cellH = dyslexiaMode ? 46 : 40;
  const fontSize = dyslexiaMode ? 28 : 24;
  const opSize = dyslexiaMode ? 50 : 44;

  // Bepaal welke cells "verbonde" is aan die huidige stap (wys 'n ring om hulle)
  // Vir 'n mult_digit step: highlight die a-cel by aPlace en die b-cel by bPlace
  const isMultDigit = currentStep && currentStep.type === 'mult_digit';
  const isFinalSum = currentStep && currentStep.type === 'final_sum';
  const aHighlight = isMultDigit ? currentStep.aPlace : -1;     // welke aPlace om te ring
  const bHighlight = isMultDigit ? currentStep.bPlace : -1;     // welke bPlace om te ring

  return (
    <div style={{
      display: 'inline-block',
      fontFamily: 'monospace',
      padding: '20px 16px',
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid rgba(14, 165, 233, 0.25)',
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      <div style={{ position: 'relative' }}>
        {grid.rows.map((row, ri) => {
          if (row.kind === 'underline') {
            const left = (row.startCol) * cellW;
            const width = (row.endCol - row.startCol + 1) * cellW;
            return (
              <div key={ri} style={{
                height: 2, marginLeft: left, width,
                background: '#1f2937', marginBottom: 4, marginTop: 2
              }}></div>
            );
          }
          // Vir final_sum: highlight die hele partial-rij as een groep
          const isPartialRow = row.kind === 'partial';

          return (
            <div key={ri} style={{
              display: 'flex',
              height: cellH,
              alignItems: 'center',
              position: 'relative',
              // Vir final_sum: ring die hele partial-rij groen om te wys "tel hierdie saam"
              outline: isFinalSum && isPartialRow ? '2px dashed #10b981' : 'none',
              outlineOffset: isFinalSum && isPartialRow ? 2 : 0,
              borderRadius: isFinalSum && isPartialRow ? 6 : 0
            }}>
              {row.cells.map((cell, ci) => {
                if (!cell) return <div key={ci} style={{ width: cellW, height: cellH }}></div>;
                const isStatic = cell.type === 'static_a' || cell.type === 'static_b';
                const isPlaceholderZero = cell.type === 'partial_placeholder_zero';
                const cellFilled = isStatic || (cell.stepIndex !== undefined && cell.stepIndex <= fillUpTo);
                const isActive = !isStatic && cell.stepIndex === activeStep;

                let bg = 'transparent';
                let color = '#1f2937';
                let border = '2px solid transparent';
                let fontWeight = 700;

                if (isActive) {
                  bg = wrongFlash ? '#fee2e2' : '#fef3c7';
                  border = wrongFlash ? '2px solid #ef4444' : '2px solid #f59e0b';
                  if (wrongFlash) color = '#991b1b';
                } else if (cellFilled) {
                  if (cell.type === 'partial_digit') color = '#3b82f6';
                  else if (cell.type === 'partial_placeholder_zero') color = '#9ca3af';
                  else if (cell.type === 'final_digit') { color = '#0ea5e9'; fontWeight = 900; }
                }

                // Verband-highlight: ring die a-syfer en b-syfer wat in hierdie stap betrokke is
                if (cell.type === 'static_a' && cell.aPlace === aHighlight) {
                  border = '3px solid #22c55e';   // groen vir a-syfer
                  bg = 'rgba(34,197,94,0.12)';
                } else if (cell.type === 'static_b' && cell.bPlace === bHighlight) {
                  border = '3px solid #3b82f6';   // blou vir b-syfer
                  bg = 'rgba(59,130,246,0.12)';
                }

                const showTimes = cell.showTimes && cellFilled;

                return (
                  <div key={ci} style={{
                    width: cellW, height: cellH,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {showTimes && (
                      <span style={{
                        position: 'absolute',
                        left: -10,
                        fontSize: fontSize - 2,
                        color: '#6b7280',
                        fontWeight: 700
                      }}>×</span>
                    )}
                    <div style={{
                      width: cellW - 4, height: cellH - 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize, fontWeight, color, background: bg,
                      border, borderRadius: 6,
                      transition: 'all 0.2s ease'
                    }}>
                      {(() => {
                        if (isActive) {
                          const total = cell.digitTotal || 1;
                          const idx = cell.digitIndex !== undefined ? cell.digitIndex : 0;
                          const inp = userInput || '';
                          if (!inp) {
                            return idx === total - 1 ? '?' : '';
                          }
                          const padded = inp.padStart(total, ' ');
                          const ch = padded[idx];
                          return ch === ' ' ? '' : ch;
                        }
                        return cellFilled ? cell.value : '';
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* GROOT × OPERASIE-TEKEN regs van die grid wanneer mult_digit aktief is */}
        {isMultDigit && (
          <div style={{
            position: 'absolute',
            top: 0,
            // Plaas dit regs van die laaste kolom
            left: grid.cols * cellW + 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: cellH * 0.3
          }}>
            <div style={{
              fontSize: opSize,
              fontWeight: 900,
              color: '#3b82f6',
              lineHeight: 1,
              animation: 'pulse 1.2s ease-in-out infinite'
            }}>×</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#3b82f6',
              marginTop: 4,
              letterSpacing: 1
            }}>MAAL</div>
          </div>
        )}

        {/* GROOT + OPERASIE-TEKEN vir final_sum stap */}
        {isFinalSum && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: grid.cols * cellW + 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: cellH * 0.5
          }}>
            <div style={{
              fontSize: opSize,
              fontWeight: 900,
              color: '#10b981',
              lineHeight: 1,
              animation: 'pulse 1.2s ease-in-out infinite'
            }}>+</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#10b981',
              marginTop: 4,
              letterSpacing: 1
            }}>TEL SAAM</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ LANG OPTEL ENGINE ═══════════════
// Vir a + b: stappe gaan kolom-vir-kolom van regs (ene) na links.
// Per kolom: tel die syfers + carry (van vorige kolom). Skryf die ene-syfer in
// die antwoord, dra die tien-syfer (as enige) na volgende kolom.
const generateLongAddProblem = (level) => {
  const skill = SUBJECTS.add.papermethod.levels[level - 1] || SUBJECTS.add.papermethod.levels[0];
  const digits = skill.digits;
  const allowCarry = skill.carry;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  let a, b, attempts = 0;
  do {
    a = randInt(min, max);
    b = randInt(min, max);
    attempts++;
    // As geen oordra, kontroleer dat geen kolom > 9 nie
    if (!allowCarry) {
      const aD = String(a).split('').map(Number);
      const bD = String(b).split('').map(Number);
      const len = Math.max(aD.length, bD.length);
      let ok = true;
      for (let i = 0; i < len; i++) {
        const ad = aD[aD.length - 1 - i] || 0;
        const bd = bD[bD.length - 1 - i] || 0;
        if (ad + bd > 9) { ok = false; break; }
      }
      if (ok) break;
    } else {
      // As ons oordra wil hê, vereis ten minste een kolom met carry
      const aD = String(a).split('').map(Number);
      const bD = String(b).split('').map(Number);
      const len = Math.max(aD.length, bD.length);
      let hasCarry = false;
      for (let i = 0; i < len; i++) {
        const ad = aD[aD.length - 1 - i] || 0;
        const bd = bD[bD.length - 1 - i] || 0;
        if (ad + bd >= 10) { hasCarry = true; break; }
      }
      if (hasCarry) break;
    }
  } while (attempts < 30);

  return { a, b, level };
};

const solveLongAdd = (a, b) => {
  const aDigits = String(a).split('').map(Number);  // van mees-belangrik na minste
  const bDigits = String(b).split('').map(Number);
  const maxLen = Math.max(aDigits.length, bDigits.length);
  // Pad links met 0
  const aPadded = Array(maxLen - aDigits.length).fill(0).concat(aDigits);
  const bPadded = Array(maxLen - bDigits.length).fill(0).concat(bDigits);

  const steps = [];
  const answerDigits = [];  // van mees-belangrik na minste, opgebou regs-na-links
  let carry = 0;

  // Werk regs-na-links (van laagste plek tot hoogste)
  for (let i = maxLen - 1; i >= 0; i--) {
    const place = maxLen - 1 - i;  // 0=ones, 1=tens, ens.
    const ad = aPadded[i];
    const bd = bPadded[i];
    const sum = ad + bd + carry;
    const writeDigit = sum % 10;
    const newCarry = Math.floor(sum / 10);

    const carryStr = carry > 0 ? ` + ${carry} (dra)` : '';
    const writeStr = newCarry > 0
      ? `Skryf ${writeDigit}, dra ${newCarry}.`
      : `Skryf ${writeDigit}.`;

    let placeName = place === 0 ? 'enes' : place === 1 ? 'tieneetalle' : place === 2 ? 'honderdetalle' : place === 3 ? 'duisendetalle' : 'tien-duisendetalle';

    steps.push({
      type: 'add_column',
      place,
      colIndex: i,
      ad, bd,
      carryUsed: carry,
      sum,
      writeDigit,
      newCarry,
      value: writeDigit,
      explanation: `${placeName.charAt(0).toUpperCase() + placeName.slice(1)}-kolom: ${ad} + ${bd}${carryStr} = ${sum}. ${writeStr}`,
      hint: carry > 0
        ? `Wat is ${ad} + ${bd} + ${carry}?`
        : `Wat is ${ad} + ${bd}?`,
      shortHint: `${ad} + ${bd}${carryStr} = ${sum}`,
      stepName: `${ad} + ${bd}${carry > 0 ? ` + ${carry}` : ''}`
    });

    answerDigits.unshift(writeDigit);
    carry = newCarry;
  }

  // As daar 'n laaste carry oor is, voeg dit by die antwoord links (met 'n ekstra stap)
  if (carry > 0) {
    answerDigits.unshift(carry);
    steps.push({
      type: 'add_final_carry',
      colIndex: -1,  // links van alles
      place: maxLen,
      writeDigit: carry,
      value: carry,
      explanation: `Daar bly nog 'n ${carry} oor om te dra. Skryf dit links voor in die antwoord.`,
      hint: `Wat is die laaste oordra?`,
      shortHint: `Laaste dra: ${carry}`,
      stepName: `Skryf laaste ${carry}`
    });
  }

  const answer = a + b;
  return { steps, answer, a, b, aDigits: aPadded, bDigits: bPadded, answerDigits, maxLen };
};

// ═══════════════ LANG AFTREK ENGINE ═══════════════
// Vir a − b: stappe gaan kolom-vir-kolom van regs (ene) na links.
// Per kolom: as a-syfer < b-syfer, leen 1 by die volgende kolom (verminder
// volgende a-syfer met 1, hierdie a-syfer + 10).
const generateLongSubProblem = (level) => {
  const skill = SUBJECTS.sub.papermethod.levels[level - 1] || SUBJECTS.sub.papermethod.levels[0];
  const digits = skill.digits;
  const allowBorrow = skill.borrow;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  let a, b, attempts = 0;
  do {
    a = randInt(min, max);
    b = randInt(min, max);
    if (a < b) { const t = a; a = b; b = t; }
    attempts++;
    // Maak seker geen leen of wel leen, soos vereis
    const aD = String(a).split('').map(Number);
    const bD = String(b).split('').map(Number);
    let needsBorrow = false;
    for (let i = 0; i < aD.length; i++) {
      const ad = aD[aD.length - 1 - i];
      const bd = bD[bD.length - 1 - i] || 0;
      if (ad < bd) { needsBorrow = true; break; }
    }
    if (allowBorrow && needsBorrow) break;
    if (!allowBorrow && !needsBorrow) break;
  } while (attempts < 30);

  return { a, b, level };
};

const solveLongSub = (a, b) => {
  const aDigits = String(a).split('').map(Number);
  const bDigits = String(b).split('').map(Number);
  const maxLen = Math.max(aDigits.length, bDigits.length);
  const aPadded = Array(maxLen - aDigits.length).fill(0).concat(aDigits);
  const bPadded = Array(maxLen - bDigits.length).fill(0).concat(bDigits);

  // Bereken werk-uitvloei eerste (om te weet hoe leen werk per kolom)
  // working[i] = die effektiewe a-syfer NA leen (kan verminder of vermeerder)
  const working = [...aPadded];
  const borrowedFrom = new Array(maxLen).fill(false);  // is hierdie kolom verminder weens leen vir die kolom regs?
  const borrowedInto = new Array(maxLen).fill(false);  // het hierdie kolom 'n 10 ontvang weens leen?

  // Werk regs-na-links
  for (let i = maxLen - 1; i >= 0; i--) {
    if (working[i] < bPadded[i]) {
      // Moet leen by kolom links
      // Vind eerste kolom links wat nie 0 is nie (dalk meervoudige leen)
      let j = i - 1;
      while (j >= 0 && working[j] === 0) {
        working[j] = 9;  // word 9 weens chained leen (hierdie kolom kry 10, gee 1)
        borrowedFrom[j] = true;
        borrowedInto[j] = true;
        j--;
      }
      if (j >= 0) {
        working[j] -= 1;
        borrowedFrom[j] = true;
        working[i] += 10;
        borrowedInto[i] = true;
      }
    }
  }

  const steps = [];
  const answerDigits = [];

  // Genereer stappe per kolom (regs na links)
  for (let i = maxLen - 1; i >= 0; i--) {
    const place = maxLen - 1 - i;
    const originalA = aPadded[i];
    const effectiveA = working[i];
    const bd = bPadded[i];
    const wasBorrowed = borrowedInto[i] && originalA !== effectiveA;  // hierdie kolom + 10
    const lentToRight = borrowedFrom[i];  // hierdie kolom -1 (gegee aan regs)

    const writeDigit = effectiveA - bd;

    let placeName = place === 0 ? 'enes' : place === 1 ? 'tieneetalle' : place === 2 ? 'honderdetalle' : place === 3 ? 'duisendetalle' : 'tien-duisendetalle';

    let explanation, hint, shortHint, stepName;

    if (wasBorrowed) {
      // Hierdie kolom het 10 ontvang weens leen
      const sourceText = originalA === 0
        ? `(was 0, het 10 geleen)`
        : `(was ${originalA}, het 10 geleen → ${effectiveA})`;
      explanation = `${placeName.charAt(0).toUpperCase() + placeName.slice(1)}-kolom: jy moet ${bd} aftrek van ${originalA}, maar ${originalA} is te klein. Leen 1 by die kolom links. Nou is dit ${effectiveA}. ${effectiveA} − ${bd} = ${writeDigit}.`;
      hint = `Jy het geleen, so kolom is nou ${effectiveA}. Wat is ${effectiveA} − ${bd}?`;
      shortHint = `${effectiveA} − ${bd} = ${writeDigit}`;
      stepName = `Leen! ${effectiveA} − ${bd}`;
    } else if (originalA !== effectiveA) {
      // Hierdie kolom is verminder weens leen vir kolom regs (kan ook +10 ontvang het bo)
      // Dis 'n chain-leen geval — al hanteer
      explanation = `${placeName.charAt(0).toUpperCase() + placeName.slice(1)}-kolom: hierdie kolom is ${effectiveA} (na leen). ${effectiveA} − ${bd} = ${writeDigit}.`;
      hint = `Hierdie kolom is nou ${effectiveA}. Wat is ${effectiveA} − ${bd}?`;
      shortHint = `${effectiveA} − ${bd} = ${writeDigit}`;
      stepName = `${effectiveA} − ${bd}`;
    } else {
      explanation = `${placeName.charAt(0).toUpperCase() + placeName.slice(1)}-kolom: ${originalA} − ${bd} = ${writeDigit}.`;
      hint = `Wat is ${originalA} − ${bd}?`;
      shortHint = `${originalA} − ${bd} = ${writeDigit}`;
      stepName = `${originalA} − ${bd}`;
    }

    steps.push({
      type: 'sub_column',
      place,
      colIndex: i,
      originalA,
      effectiveA,
      bd,
      writeDigit,
      value: writeDigit,
      wasBorrowed,
      lentToRight,
      explanation,
      hint,
      shortHint,
      stepName
    });

    answerDigits.unshift(writeDigit);
  }

  const answer = a - b;
  return { steps, answer, a, b, aDigits: aPadded, bDigits: bPadded, answerDigits, maxLen, working, borrowedFrom, borrowedInto };
};

// ═══════════════ GEDEELDE GRID-BOUER (Lang Optel/Aftrek) ═══════════════
// Bou 'n grid vir lang optel/aftrek. Layout (vir 47 + 28):
//   Row 0:  ¹             ← carry (boontoe; vir lang optel) of leen-merk (vir aftrek)
//   Row 1:    4 7         ← a (statiese)
//   Row 2:  + 2 8         ← b (statiese, met operasie-teken)
//   Row 3:  ─────         ← lyn
//   Row 4:    7 5         ← antwoord
const buildLongAddSubGrid = (a, b, solution, opSymbol) => {
  const aDigits = solution.aDigits;
  const bDigits = solution.bDigits;
  const answerDigits = solution.answerDigits;
  const maxLen = solution.maxLen;
  const answerLen = answerDigits.length;
  const cols = Math.max(maxLen, answerLen) + 2;  // ekstra links vir operasie-teken en moontlike carry-uit
  const RIGHT_COL = cols - 1;
  const FIRST_DIGIT_COL_FOR_AB = RIGHT_COL - maxLen + 1;  // waar a/b se mees-links syfer kom

  const rows = [];

  // Row 0: carry/leen indikators (boontoe) - vir optel
  if (opSymbol === '+') {
    const cRow = { kind: 'carry_indicator', cells: new Array(cols).fill(null) };
    // Per kolom (regs na links): as die "newCarry" van die step regs van hier > 0, wys dit hier
    for (let i = 0; i < maxLen; i++) {
      const colInGrid = RIGHT_COL - i;
      // Carry op kolom i kom van die step wat colIndex = i + 1 verwerk het (een kolom regs)
      // Eintlik: die carry wat oor i kom, is die newCarry van die step van kolom i+1.
      // Maar daar's geen step regs-van-die-laaste nie. So eerste kolom (i=0, regs) het geen carry.
      // Ons soek: vir hierdie display-kolom, watter step het sy newCarry hier?
      const sourceStepIdx = solution.steps.findIndex(
        s => s.type === 'add_column' && s.colIndex === maxLen - i  // step wat colIndex hierdie+1 verwerk het
      );
      if (sourceStepIdx !== -1) {
        const sourceStep = solution.steps[sourceStepIdx];
        if (sourceStep.newCarry > 0) {
          cRow.cells[colInGrid] = {
            type: 'carry_mark',
            value: sourceStep.newCarry,
            stepIndex: sourceStepIdx,
            col: colInGrid,
            row: 0
          };
        }
      }
    }
    // As daar 'n laaste oordra is, wys dit ook (op kolom 1 verder links)
    rows.push(cRow);
  }

  // Row 1: a (regs-belyn) — vir aftrek wys ons ook leen-merke as ¯-deurgehaalde syfer
  const aRow = { kind: 'a_row', cells: new Array(cols).fill(null) };
  for (let k = 0; k < maxLen; k++) {
    const col = RIGHT_COL - (maxLen - 1 - k);
    aRow.cells[col] = {
      type: 'static_a',
      value: aDigits[k],
      col, row: rows.length,
      colIndex: k
    };
  }
  rows.push(aRow);

  // Row 2: b (regs-belyn met operasie-teken bo-links)
  const bRow = { kind: 'b_row', cells: new Array(cols).fill(null) };
  for (let k = 0; k < maxLen; k++) {
    const col = RIGHT_COL - (maxLen - 1 - k);
    bRow.cells[col] = {
      type: 'static_b',
      value: bDigits[k],
      col, row: rows.length,
      showSign: k === 0,
      sign: opSymbol,
      colIndex: k
    };
  }
  rows.push(bRow);

  // Underline
  rows.push({
    kind: 'underline',
    startCol: FIRST_DIGIT_COL_FOR_AB - 1,  // 'n bietjie wyer om operasie-teken in te sluit
    endCol: RIGHT_COL,
    cells: new Array(cols).fill(null)
  });

  // Antwoord-rij: per syfer, gekoppel aan die step wat dit skryf
  const ansRow = { kind: 'answer', cells: new Array(cols).fill(null) };
  // answerDigits is van mees-belangrik na minste; lengte == answerLen
  // antwoord se mees-regs cell is by RIGHT_COL
  for (let k = 0; k < answerLen; k++) {
    const col = RIGHT_COL - (answerLen - 1 - k);
    // Vind die step wat hierdie syfer skryf
    const placeFromRight = answerLen - 1 - k;  // 0 = ene
    let stepIdx;
    if (opSymbol === '+') {
      // Vir optel: kolom-stap by colIndex = maxLen - 1 - placeFromRight (vir die ones-tens-...),
      // OF die add_final_carry stap as placeFromRight === maxLen
      if (placeFromRight === maxLen) {
        stepIdx = solution.steps.findIndex(s => s.type === 'add_final_carry');
      } else {
        stepIdx = solution.steps.findIndex(
          s => s.type === 'add_column' && s.place === placeFromRight
        );
      }
    } else {
      // Aftrek: kolom-stap by place === placeFromRight
      stepIdx = solution.steps.findIndex(
        s => s.type === 'sub_column' && s.place === placeFromRight
      );
    }
    ansRow.cells[col] = {
      type: 'answer_digit',
      value: answerDigits[k],
      stepIndex: stepIdx,
      col, row: rows.length,
      digitIndex: 0,
      digitTotal: 1
    };
  }
  rows.push(ansRow);

  return { rows, cols, solution, opSymbol };
};

// ═══════════════ RENDER (Lang Optel/Aftrek Grid) ═══════════════
function LongAddSubGrid({ grid, fillUpTo, activeStep, currentStep, userInput, wrongFlash, dyslexiaMode, themeColor }) {
  const cellW = dyslexiaMode ? 38 : 32;
  const cellH = dyslexiaMode ? 46 : 40;
  const fontSize = dyslexiaMode ? 28 : 24;
  const opSize = dyslexiaMode ? 50 : 44;

  // Operasie-info vir GROOT teken regs van grid
  let opSymbol = null, opLabel = null, opColor = null;
  if (currentStep) {
    if (currentStep.type === 'add_column' || currentStep.type === 'add_final_carry') {
      opSymbol = '+'; opLabel = 'TEL OP'; opColor = '#22c55e';
    } else if (currentStep.type === 'sub_column') {
      opSymbol = currentStep.wasBorrowed ? '−' : '−';
      opLabel = currentStep.wasBorrowed ? 'LEEN!' : 'TREK AF';
      opColor = currentStep.wasBorrowed ? '#f59e0b' : '#6366f1';
    }
  }

  // Watter kolom is aktief? (vir highlight van a en b syfers in daardie kolom)
  const activeColIndex = currentStep && (currentStep.type === 'add_column' || currentStep.type === 'sub_column')
    ? currentStep.colIndex
    : -1;

  return (
    <div style={{
      display: 'inline-block',
      fontFamily: 'monospace',
      padding: '20px 16px',
      background: 'rgba(255,255,255,0.95)',
      border: `2px solid ${themeColor}40`,
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      <div style={{ position: 'relative' }}>
        {grid.rows.map((row, ri) => {
          if (row.kind === 'underline') {
            const left = (row.startCol) * cellW;
            const width = (row.endCol - row.startCol + 1) * cellW;
            return (
              <div key={ri} style={{
                height: 2, marginLeft: left, width,
                background: '#1f2937', marginBottom: 4, marginTop: 2
              }}></div>
            );
          }
          // Carry-indicator rij is kleiner
          const isCarryRow = row.kind === 'carry_indicator';
          const rowH = isCarryRow ? Math.max(20, cellH * 0.55) : cellH;
          const rowFontSize = isCarryRow ? Math.max(14, fontSize * 0.6) : fontSize;

          return (
            <div key={ri} style={{
              display: 'flex',
              height: rowH,
              alignItems: 'center'
            }}>
              {row.cells.map((cell, ci) => {
                if (!cell) return <div key={ci} style={{ width: cellW, height: rowH }}></div>;
                const isStatic = cell.type === 'static_a' || cell.type === 'static_b';
                const isCarryMark = cell.type === 'carry_mark';
                const cellFilled = isStatic || (cell.stepIndex !== undefined && cell.stepIndex <= fillUpTo);
                const isActive = !isStatic && cell.stepIndex === activeStep;

                let bg = 'transparent';
                let color = '#1f2937';
                let border = '2px solid transparent';
                let fontWeight = 700;

                if (isActive) {
                  bg = wrongFlash ? '#fee2e2' : '#fef3c7';
                  border = wrongFlash ? '2px solid #ef4444' : '2px solid #f59e0b';
                  if (wrongFlash) color = '#991b1b';
                } else if (cellFilled) {
                  if (cell.type === 'answer_digit') { color = themeColor; fontWeight = 900; }
                  else if (cell.type === 'carry_mark') { color = '#f59e0b'; fontWeight = 900; }
                }

                // Highlight a-cell en b-cell wat in die aktiewe kolom is
                if (cell.type === 'static_a' && cell.colIndex === activeColIndex) {
                  border = '3px solid #22c55e';
                  bg = 'rgba(34,197,94,0.12)';
                  // Vir aftrek met leen: as hierdie kolom geleen het, verander syfer-kleur
                  if (currentStep && currentStep.type === 'sub_column' && currentStep.wasBorrowed) {
                    color = '#f59e0b';
                  }
                } else if (cell.type === 'static_b' && cell.colIndex === activeColIndex) {
                  border = `3px solid ${themeColor}`;
                  bg = `${themeColor}1f`;
                }

                const showSign = cell.showSign && cellFilled;

                return (
                  <div key={ci} style={{
                    width: cellW, height: rowH,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {showSign && (
                      <span style={{
                        position: 'absolute',
                        left: -10,
                        fontSize: rowFontSize - 2,
                        color: '#6b7280',
                        fontWeight: 700
                      }}>{cell.sign}</span>
                    )}
                    <div style={{
                      width: cellW - 4, height: rowH - 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: rowFontSize, fontWeight, color, background: bg,
                      border, borderRadius: 6,
                      transition: 'all 0.2s ease'
                    }}>
                      {(() => {
                        if (isActive) {
                          const total = cell.digitTotal || 1;
                          const idx = cell.digitIndex !== undefined ? cell.digitIndex : 0;
                          const inp = userInput || '';
                          if (!inp) {
                            return idx === total - 1 ? '?' : '';
                          }
                          const padded = inp.padStart(total, ' ');
                          const ch = padded[idx];
                          return ch === ' ' ? '' : ch;
                        }
                        return cellFilled ? cell.value : '';
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* GROOT OPERASIE-TEKEN regs van die grid */}
        {opSymbol && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: grid.cols * cellW + 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: cellH * 0.3
          }}>
            <div style={{
              fontSize: opSize,
              fontWeight: 900,
              color: opColor,
              lineHeight: 1,
              animation: 'pulse 1.2s ease-in-out infinite'
            }}>{opSymbol}</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: opColor,
              marginTop: 4,
              letterSpacing: 1
            }}>{opLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hulpfunksie
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ═══════════════ SKILL HELPERS PER VAK ═══════════════

// Is 'n vlak bemeester? (>= 80% akkuraatheid op >= 10 vrae)
const isSkillMastered = (profile, subjectId, level) => {
  const stats = getSkillStats(profile, subjectId, level);
  return stats.attempts >= 10 && stats.accuracy >= 0.8;
};

// Sterre vir 'n vlak (0, 1, 2, of 3)
const getSkillStars = (profile, subjectId, level) => {
  const stats = getSkillStats(profile, subjectId, level);
  if (stats.attempts < 10) return 0;
  if (stats.accuracy >= 0.9) return 3;
  if (stats.accuracy >= 0.7) return 2;
  if (stats.accuracy >= 0.5) return 1;
  return 0;
};

// Kry stats vir 'n spesifieke vak + vlak
const getSkillStats = (profile, subjectId, level) => {
  const stats = profile.factStats || {};
  const prefix = `${subjectId}:`;
  // Ons stoor 'n aparte teller per vlak ook (omdat optel/aftrek vrae verskillende a, b genereer)
  const levelKey = `${subjectId}_L${level}`;
  const levelStat = (profile.levelStats || {})[levelKey] || { correct: 0, wrong: 0 };
  const totalCorrect = levelStat.correct || 0;
  const totalAttempts = (levelStat.correct || 0) + (levelStat.wrong || 0);
  return {
    correct: totalCorrect,
    attempts: totalAttempts,
    accuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0
  };
};

// Is 'n vlak oop?
// add/sub: alle vlakke altyd oop
// mult: vlak 1 altyd oop, dan moet vorige bemeester wees
// div: vlak 1 altyd oop MAAR die hele vak is toe tot mult vlak 1 (2× tafel) bemeester is
const isSkillUnlocked = (profile, subjectId, level) => {
  const subject = SUBJECTS[subjectId];
  if (!subject) return false;

  // Optel & Aftrek: altyd oop
  if (!subject.sequential) return true;

  // Deel: hele vak toe as vereiste maal-vlak nie bemeester is nie
  if (subject.requiresMultLevel) {
    if (!isSkillMastered(profile, 'mult', subject.requiresMultLevel)) {
      return false;
    }
  }

  // Sequentiële vakke: vlak 1 altyd oop, andersinds vorige bemeester
  if (level === 1) return true;
  return isSkillMastered(profile, subjectId, level - 1);
};

// Huidige vlak vir 'n vak (eerste een wat nog nie bemeester is, en oop is)
const getCurrentSkillLevel = (profile, subjectId) => {
  const subject = SUBJECTS[subjectId];
  if (!subject) return 1;

  for (let i = 0; i < subject.skills.length; i++) {
    const lvl = subject.skills[i].level;
    if (isSkillUnlocked(profile, subjectId, lvl) && !isSkillMastered(profile, subjectId, lvl)) {
      return lvl;
    }
  }
  return subject.skills[subject.skills.length - 1].level;
};

// Tel hoeveel vlakke bemeester is oor alle vakke
const countMasteredAll = (profile) => {
  let count = 0;
  for (const sid of SUBJECT_ORDER) {
    const subject = SUBJECTS[sid];
    for (const sk of subject.skills) {
      if (isSkillMastered(profile, sid, sk.level)) count++;
    }
  }
  return count;
};

// Totaal aantal vlakke
const TOTAL_LEVELS = SUBJECT_ORDER.reduce((sum, sid) => sum + SUBJECTS[sid].skills.length, 0);

// Tel sterre oor alle vakke
const countStarsAll = (profile) => {
  let stars = 0;
  for (const sid of SUBJECT_ORDER) {
    const subject = SUBJECTS[sid];
    for (const sk of subject.skills) {
      stars += getSkillStars(profile, sid, sk.level);
    }
  }
  return stars;
};

// Kry effektiewe Vrydag beloning vir 'n speler
const getFridayReward = (profile, settings) => {
  if (profile.customFridayReward !== null && profile.customFridayReward !== undefined) {
    return profile.customFridayReward;
  }
  return settings.globalFridayReward || DEFAULT_FRIDAY_REWARD;
};

// ═══════════════ KLANKE (WEB AUDIO API - GEEN LeERS) ═══════════════
let audioCtx = null;
const getAudio = () => {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
};

const playTone = (freq, duration, type = 'sine', volume = 0.15) => {
  const ctx = getAudio();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

const sounds = {
  correct: (on) => {
    if (!on) return;
    // Duolingo-styl "ding" - twee toon stygende
    playTone(660, 0.08, 'sine', 0.12);
    setTimeout(() => playTone(880, 0.15, 'sine', 0.12), 60);
  },
  wrong: (on) => {
    if (!on) return;
    // Sagte "buzz" - dalende toon
    playTone(220, 0.15, 'triangle', 0.1);
    setTimeout(() => playTone(180, 0.2, 'triangle', 0.08), 80);
  },
  tick: (on) => {
    if (!on) return;
    playTone(800, 0.04, 'square', 0.05);
  },
  celebration: (on) => {
    if (!on) return;
    // Triomf-fanfare
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.25, 'triangle', 0.15), i * 100);
    });
  },
  levelUp: (on) => {
    if (!on) return;
    // Stygende arpeggio
    [392, 523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.18, 'sine', 0.15), i * 80);
    });
  },
  click: (on) => {
    if (!on) return;
    playTone(600, 0.03, 'sine', 0.08);
  },
  countdown: (on) => {
    if (!on) return;
    playTone(440, 0.1, 'sine', 0.12);
  },
  start: (on) => {
    if (!on) return;
    [523, 659, 784].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.12, 'sine', 0.12), i * 100);
    });
  },
  timeUp: (on) => {
    if (!on) return;
    playTone(330, 0.4, 'sawtooth', 0.12);
  },
  // Game-laag (praktyk-skerm karakter feedback)
  ping: (on) => {
    if (!on) return;
    // Helder, vrolike "ping!" - vinnige stygende klingel
    playTone(1320, 0.06, 'sine', 0.14);
    setTimeout(() => playTone(1760, 0.12, 'sine', 0.10), 50);
  },
  poep: (on) => {
    if (!on) return;
    // Kort "fffrrt!" - lae sawtooth met vinnige pitch-drop, speels nie hard
    playTone(180, 0.08, 'sawtooth', 0.13);
    setTimeout(() => playTone(120, 0.10, 'sawtooth', 0.10), 70);
  }
};

// ═══════════════ MAIN APP ═══════════════
function BreinGym() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState('home');
  // Practice & sprint sleutel data
  const [practiceData, setPracticeData] = useState(null);  // { subjectId, level, count }
  const [sprintData, setSprintData] = useState(null);       // { subjectId, duration, score?, results?, isNewRecord? }
  const [fridayMode, setFridayMode] = useState(null);
  const [pickerContext, setPickerContext] = useState(null); // 'practice', 'sprint', 'friday'
  const [pickedSubject, setPickedSubject] = useState(null);

  useEffect(() => { saveState(state); }, [state]);

  const updateProfile = (id, updates) => {
    setState(s => ({
      ...s,
      profiles: s.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const addProfile = (data) => {
    const profile = newProfile(data.name, data.avatar, data.dyslexiaMode);
    setState(s => ({ ...s, profiles: [...s.profiles, profile], activeProfileId: profile.id }));
  };

  const deleteProfile = (id) => {
    setState(s => ({
      ...s,
      profiles: s.profiles.filter(p => p.id !== id),
      activeProfileId: s.activeProfileId === id ? null : s.activeProfileId
    }));
  };

  const updateSettings = (updates) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }));
  };

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
  const soundOn = state.settings.soundOn;

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>

      {view === 'home' && (
        <HomeScreen
          profiles={state.profiles}
          settings={state.settings}
          onSelectProfile={(id) => { sounds.click(soundOn); setState(s => ({ ...s, activeProfileId: id })); setView('profile'); }}
          onAddProfile={addProfile}
          onParentMode={() => { sounds.click(soundOn); setView('parent'); }}
          onToggleSound={() => updateSettings({ soundOn: !soundOn })}
          soundOn={soundOn}
        />
      )}

      {view === 'profile' && activeProfile && (
        <ProfileScreen
          profile={activeProfile}
          settings={state.settings}
          soundOn={soundOn}
          onPickSubject={(subjectId) => {
            // Wys vlakke vir hierdie vak
            sounds.click(soundOn);
            setPickedSubject(subjectId);
            setView('subjectLevels');
          }}
          onSprint={() => {
            // Vir wedren - wys vak picker
            sounds.click(soundOn);
            setPickerContext('sprint');
            setView('subjectPicker');
          }}
          onFriday={() => { sounds.click(soundOn); setView('friday'); }}
          onBack={() => { sounds.click(soundOn); setView('home'); }}
        />
      )}

      {view === 'subjectLevels' && activeProfile && pickedSubject && (
        <SubjectLevelsScreen
          profile={activeProfile}
          subjectId={pickedSubject}
          soundOn={soundOn}
          onPickLevel={(level, methodKind) => {
            sounds.start(soundOn);
            if (methodKind === 'paper' && pickedSubject === 'div') {
              setPracticeData({ subjectId: 'longdiv', level, count: 6, parentSubject: 'div' });
              setView('longdivDemo');
            } else if (methodKind === 'paper' && pickedSubject === 'mult') {
              setPracticeData({ subjectId: 'longmult', level, count: 6, parentSubject: 'mult' });
              setView('longmultDemo');
            } else if (methodKind === 'paper' && pickedSubject === 'add') {
              setPracticeData({ subjectId: 'longadd', level, count: 6, parentSubject: 'add' });
              setView('longaddDemo');
            } else if (methodKind === 'paper' && pickedSubject === 'sub') {
              setPracticeData({ subjectId: 'longsub', level, count: 6, parentSubject: 'sub' });
              setView('longsubDemo');
            } else {
              setPracticeData({ subjectId: pickedSubject, level, count: 15 });
              setView('practice');
            }
          }}
          onBack={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'longdivDemo' && activeProfile && practiceData && (
        <LongDivisionDemoScreen
          profile={activeProfile}
          level={practiceData.level}
          soundOn={soundOn}
          onContinue={() => { sounds.click(soundOn); setView('longdivPractice'); }}
          onSkip={() => { sounds.click(soundOn); setView('longdivPractice'); }}
        />
      )}

      {view === 'longmultDemo' && activeProfile && practiceData && (
        <LongMultDemoScreen
          profile={activeProfile}
          level={practiceData.level}
          soundOn={soundOn}
          onContinue={() => { sounds.click(soundOn); setView('longmultPractice'); }}
          onSkip={() => { sounds.click(soundOn); setView('longmultPractice'); }}
        />
      )}

      {view === 'longaddDemo' && activeProfile && practiceData && (
        <LongAddSubDemoScreen
          profile={activeProfile}
          level={practiceData.level}
          kind="add"
          soundOn={soundOn}
          onContinue={() => { sounds.click(soundOn); setView('longaddPractice'); }}
          onSkip={() => { sounds.click(soundOn); setView('longaddPractice'); }}
        />
      )}

      {view === 'longsubDemo' && activeProfile && practiceData && (
        <LongAddSubDemoScreen
          profile={activeProfile}
          level={practiceData.level}
          kind="sub"
          soundOn={soundOn}
          onContinue={() => { sounds.click(soundOn); setView('longsubPractice'); }}
          onSkip={() => { sounds.click(soundOn); setView('longsubPractice'); }}
        />
      )}

      {view === 'longaddPractice' && activeProfile && practiceData && (
        <LongAddSubScreen
          profile={activeProfile}
          level={practiceData.level}
          kind="add"
          questionCount={practiceData.count}
          soundOn={soundOn}
          onComplete={(results) => {
            const updates = applyResults(activeProfile, results, 'longadd', practiceData.level);
            updateProfile(activeProfile.id, updates);
            setPracticeData({ ...practiceData, results });
            setView('results');
          }}
          onQuit={() => { sounds.click(soundOn); setView('subjectLevels'); }}
          onShowDemo={() => { sounds.click(soundOn); setView('longaddDemo'); }}
        />
      )}

      {view === 'longsubPractice' && activeProfile && practiceData && (
        <LongAddSubScreen
          profile={activeProfile}
          level={practiceData.level}
          kind="sub"
          questionCount={practiceData.count}
          soundOn={soundOn}
          onComplete={(results) => {
            const updates = applyResults(activeProfile, results, 'longsub', practiceData.level);
            updateProfile(activeProfile.id, updates);
            setPracticeData({ ...practiceData, results });
            setView('results');
          }}
          onQuit={() => { sounds.click(soundOn); setView('subjectLevels'); }}
          onShowDemo={() => { sounds.click(soundOn); setView('longsubDemo'); }}
        />
      )}

      {view === 'longmultPractice' && activeProfile && practiceData && (
        <LongMultScreen
          profile={activeProfile}
          level={practiceData.level}
          questionCount={practiceData.count}
          soundOn={soundOn}
          onComplete={(results) => {
            const updates = applyResults(activeProfile, results, 'longmult', practiceData.level);
            updateProfile(activeProfile.id, updates);
            setPracticeData({ ...practiceData, results });
            setView('results');
          }}
          onQuit={() => { sounds.click(soundOn); setView('subjectLevels'); }}
          onShowDemo={() => { sounds.click(soundOn); setView('longmultDemo'); }}
        />
      )}

      {view === 'longdivPractice' && activeProfile && practiceData && (
        <LongDivisionScreen
          profile={activeProfile}
          level={practiceData.level}
          questionCount={practiceData.count}
          soundOn={soundOn}
          onComplete={(results) => {
            // Resultate stoor onder 'longdiv' subject (nie 'div' nie) sodat sterre apart tracke
            const updates = applyResults(activeProfile, results, 'longdiv', practiceData.level);
            updateProfile(activeProfile.id, updates);
            setPracticeData({ ...practiceData, results });
            setView('results');
          }}
          onQuit={() => { sounds.click(soundOn); setView('subjectLevels'); }}
          onShowDemo={() => { sounds.click(soundOn); setView('longdivDemo'); }}
        />
      )}

      {view === 'subjectPicker' && activeProfile && (
        <SubjectPickerScreen
          profile={activeProfile}
          context={pickerContext}
          soundOn={soundOn}
          onPick={(subjectId) => {
            sounds.start(soundOn);
            if (pickerContext === 'sprint') {
              setSprintData({ subjectId, duration: 60 });
              setView('sprint');
            }
          }}
          onBack={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'practice' && activeProfile && practiceData && (
        <PracticeScreen
          profile={activeProfile}
          subjectId={practiceData.subjectId}
          level={practiceData.level}
          questionCount={practiceData.count}
          soundOn={soundOn}
          onComplete={(results) => {
            const updates = applyResults(activeProfile, results, practiceData.subjectId, practiceData.level);
            updateProfile(activeProfile.id, updates);
            setPracticeData({ ...practiceData, results });
            setView('results');
          }}
          onQuit={() => { sounds.click(soundOn); setView('subjectLevels'); }}
        />
      )}

      {view === 'sprint' && activeProfile && sprintData && (
        <SprintScreen
          profile={activeProfile}
          subjectId={sprintData.subjectId}
          duration={sprintData.duration}
          soundOn={soundOn}
          onComplete={(score, results) => {
            const sid = sprintData.subjectId;
            const prevRec = (activeProfile.sprintRecords || {})[sid] || 0;
            const newRecord = Math.max(prevRec, score);
            // Pas results toe per vlak (gebruik die hoogste vlak van die kind in die vak)
            const lvl = getCurrentSkillLevel(activeProfile, sid);
            const updates = applyResults(activeProfile, { questions: results }, sid, lvl);
            const newSprintRecords = { ...(activeProfile.sprintRecords || {}), [sid]: newRecord };
            updateProfile(activeProfile.id, { ...updates, sprintRecords: newSprintRecords });
            setSprintData({ ...sprintData, score, results, isNewRecord: score > prevRec, prevRecord: prevRec });
            setView('sprintResults');
          }}
          onQuit={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'sprintResults' && activeProfile && sprintData && (
        <SprintResults
          profile={activeProfile}
          subjectId={sprintData.subjectId}
          score={sprintData.score}
          results={sprintData.results}
          isNewRecord={sprintData.isNewRecord}
          prevRecord={sprintData.prevRecord}
          soundOn={soundOn}
          onContinue={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'friday' && (
        <FridayScreen
          profiles={state.profiles}
          settings={state.settings}
          soundOn={soundOn}
          onStartGame={(mode, players, subjectId) => {
            sounds.start(soundOn);
            setFridayMode({ mode, players, subjectId });
            setView('fridayPlay');
          }}
          onBack={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'fridayPlay' && fridayMode && (
        <FridayGameScreen
          mode={fridayMode.mode}
          players={fridayMode.players}
          subjectId={fridayMode.subjectId}
          settings={state.settings}
          soundOn={soundOn}
          onComplete={(rewards) => {
            rewards.forEach(r => {
              const p = state.profiles.find(pp => pp.id === r.profileId);
              if (p) {
                updateProfile(p.id, {
                  totalEarned: (p.totalEarned || 0) + r.amount,
                  weeklyEarnings: [...(p.weeklyEarnings || []), {
                    date: new Date().toISOString(),
                    amount: r.amount,
                    mode: fridayMode.mode,
                    subject: fridayMode.subjectId
                  }]
                });
              }
            });
            setFridayMode({ ...fridayMode, rewards });
            setView('fridayResults');
          }}
          onQuit={() => { sounds.click(soundOn); setView('friday'); }}
        />
      )}

      {view === 'fridayResults' && fridayMode && (
        <FridayResults
          rewards={fridayMode.rewards}
          profiles={state.profiles}
          soundOn={soundOn}
          onDone={() => { sounds.click(soundOn); setFridayMode(null); setView('home'); }}
        />
      )}

      {view === 'results' && practiceData && activeProfile && (
        <ResultsScreen
          profile={activeProfile}
          subjectId={practiceData.subjectId}
          level={practiceData.level}
          results={practiceData.results}
          soundOn={soundOn}
          onContinue={() => {
            sounds.click(soundOn);
            if (practiceData.subjectId === 'longdiv') setView('longdivDemo');
            else if (practiceData.subjectId === 'longmult') setView('longmultDemo');
            else if (practiceData.subjectId === 'longadd') setView('longaddDemo');
            else if (practiceData.subjectId === 'longsub') setView('longsubDemo');
            else setView('subjectLevels');
          }}
          onDone={() => { sounds.click(soundOn); setView('profile'); }}
        />
      )}

      {view === 'parent' && (
        <ParentScreen
          profiles={state.profiles}
          settings={state.settings}
          soundOn={soundOn}
          onUpdateProfile={updateProfile}
          onUpdateSettings={updateSettings}
          onDeleteProfile={deleteProfile}
          onBack={() => { sounds.click(soundOn); setView('home'); }}
        />
      )}
    </div>
  );
}

// ═══════════════ APPLY PRACTICE RESULTS ═══════════════
const applyResults = (profile, results, subjectId, level) => {
  const today = new Date().toISOString().slice(0, 10);
  const factStats = { ...(profile.factStats || {}) };
  const levelStats = { ...(profile.levelStats || {}) };

  // Per-vlak teller (gebruik vir stars/mastery)
  const levelKey = `${subjectId}_L${level}`;
  const levelStat = levelStats[levelKey] || { correct: 0, wrong: 0 };

  results.questions.forEach(q => {
    // Per-feit stats (gebruik vir adaptiewe tyd en swak-feit detectie)
    const key = factKey(subjectId, q.a, q.b);
    const stat = factStats[key] || { correct: 0, wrong: 0, avgMs: 0 };
    if (q.correct) {
      stat.correct = (stat.correct || 0) + 1;
      const n = stat.correct;
      stat.avgMs = Math.round(((stat.avgMs || 0) * (n - 1) + q.timeMs) / n);
      levelStat.correct = (levelStat.correct || 0) + 1;
    } else {
      stat.wrong = (stat.wrong || 0) + 1;
      levelStat.wrong = (levelStat.wrong || 0) + 1;
    }
    factStats[key] = stat;
  });

  levelStats[levelKey] = levelStat;

  // Streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let streak = profile.streakDays || 0;
  if (profile.lastPracticeDate === today) {
    // niks
  } else if (profile.lastPracticeDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  return {
    factStats,
    levelStats,
    totalCorrect: (profile.totalCorrect || 0) + results.questions.filter(q => q.correct).length,
    totalAttempts: (profile.totalAttempts || 0) + results.questions.length,
    streakDays: streak,
    lastPracticeDate: today
  };
};

// ═══════════════ HOME SCREEN ═══════════════
function HomeScreen({ profiles, settings, onSelectProfile, onAddProfile, onParentMode, onToggleSound, soundOn }) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoEmoji}>🧠</span>
            <span style={styles.logoText}>BREIN GYM</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onToggleSound} style={styles.iconBtn} title={soundOn ? 'Klanke aan' : 'Klanke af'}>
              {soundOn ? '🔊' : '🔇'}
            </button>
            <button onClick={onParentMode} style={styles.parentBtn}>
              🔧 Ouer
            </button>
          </div>
        </header>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={styles.tagline}>Wie speel vandag?</h1>
          <p style={styles.subtitle}>Kies jou speler om te begin</p>
        </div>

        <div style={styles.profileGrid}>
          {profiles.map(p => {
            const masteredCount = countMasteredAll(p);
            const multLevel = getCurrentSkillLevel(p, 'mult');
            const multSkill = SUBJECTS.mult.skills[multLevel - 1];
            return (
              <button key={p.id} onClick={() => onSelectProfile(p.id)} style={styles.profileCard}>
                <div style={{ ...styles.profileAvatar, background: '#3b82f6' }}>
                  {p.avatar}
                </div>
                <div style={styles.profileName}>{p.name}</div>
                <div style={styles.profileLevel}>
                  {masteredCount} / {TOTAL_LEVELS} bemeester
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  {multSkill ? `✖️ Vlak ${multLevel}` : ''}
                </div>
                {(p.totalEarned > 0) && (
                  <div style={styles.profileEarnings}>R{p.totalEarned}</div>
                )}
                {p.streakDays > 0 && (
                  <div style={styles.streakBadge}>🔥 {p.streakDays} dae</div>
                )}
              </button>
            );
          })}

          <button onClick={() => setShowAdd(true)} style={styles.addProfileCard}>
            <div style={styles.addIcon}>+</div>
            <div style={styles.addText}>Voeg Speler By</div>
          </button>
        </div>
      </div>

      {showAdd && <AddProfileModal onAdd={(data) => { onAddProfile(data); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}
    </div>
  );
}

// ═══════════════ ADD PROFILE MODAL ═══════════════
function AddProfileModal({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), avatar, dyslexiaMode });
  };

  return (
    <div style={styles.modalBg} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Nuwe Speler</h2>

        <div style={styles.field}>
          <label style={styles.label}>Naam</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Bv. Jan"
            style={styles.input}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Karakter</label>
          <div style={styles.avatarGrid}>
            {AVATARS.map(a => (
              <button key={a} onClick={() => setAvatar(a)} style={{
                ...styles.avatarOption,
                ...(avatar === a ? styles.avatarOptionSelected : {})
              }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
          fontSize: 13,
          color: '#374151',
          lineHeight: 1.5
        }}>
          <strong>🌱 Begin by die begin!</strong><br/>
          Almal begin by die 2× tafel. Soos jy beter raak, sluit nuwe vlakke oop.
          Geen druk, geen vergelyking — net jy en jou eie reis.
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={dyslexiaMode}
              onChange={e => setDyslexiaMode(e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer' }}
            />
            <span>📖 Dyslexie modus (groter teks, meer tyd)</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onCancel} style={styles.btnSecondary}>Kanselleer</button>
          <button onClick={handleSubmit} style={styles.btnPrimary} disabled={!name.trim()}>Skep Speler</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ PROFILE SCREEN ═══════════════
function ProfileScreen({ profile, settings, soundOn, onPickSubject, onSprint, onFriday, onBack }) {
  const dayOfWeek = new Date().getDay();
  const isFriday = dayOfWeek === 5;
  const fridayReward = getFridayReward(profile, settings);

  const masteredCount = countMasteredAll(profile);
  const totalStars = countStarsAll(profile);

  // Stats per vak
  const subjectsInfo = SUBJECT_ORDER.map(sid => {
    const subject = SUBJECTS[sid];
    const skills = subject.skills;
    const masteredInSubject = skills.filter(sk => isSkillMastered(profile, sid, sk.level)).length;
    const currentLevel = getCurrentSkillLevel(profile, sid);
    const currentSkill = skills[currentLevel - 1] || skills[0];

    // Vir Deel: kontrolleer of die vak heeltemal toe is
    const isLockedSubject = subject.requiresMultLevel && !isSkillMastered(profile, 'mult', subject.requiresMultLevel);

    return {
      ...subject,
      masteredInSubject,
      totalSkills: skills.length,
      currentLevel,
      currentSkill,
      isLockedSubject
    };
  });

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Terug</button>
          <div style={styles.profileTopBar}>
            <span style={{ fontSize: 32 }}>{profile.avatar}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {masteredCount}/{TOTAL_LEVELS} bemeester · ⭐ {totalStars} sterre
              </div>
            </div>
          </div>
        </header>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statValue}>R{profile.totalEarned || 0}</div>
            <div style={styles.statLabel}>Verdien</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statValue}>{profile.streakDays || 0}</div>
            <div style={styles.statLabel}>Dag-streep</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statValue}>{totalStars}</div>
            <div style={styles.statLabel}>Sterre</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statValue}>{masteredCount}</div>
            <div style={styles.statLabel}>Bemeester</div>
          </div>
        </div>

        {/* AKSIE KNOPPIES */}
        <div style={styles.bigButtonRow}>
          <button onClick={onSprint} style={{ ...styles.bigBtn, ...styles.bigBtnSprint }}>
            <div style={{ fontSize: 56 }}>⚡</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>WEDREN</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>60 sekondes</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Kies jou vak</div>
          </button>

          <button onClick={onFriday} style={{
            ...styles.bigBtn,
            ...styles.bigBtnFriday,
            ...(isFriday ? styles.bigBtnFridayActive : {})
          }}>
            <div style={{ fontSize: 56 }}>🏆</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>VRYDAG</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{isFriday ? '✨ Dis VANDAG!' : `Speel om R${fridayReward}`}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Almal kry 'n kans</div>
          </button>
        </div>

        {/* VAK KEUSE */}
        <div style={styles.progressSection}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#6b7280' }}>
            KIES JOU VAK OM TE OEFEN
          </h3>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
            Tik 'n vak om die vlakke te sien
          </p>

          <div style={styles.subjectGrid}>
            {subjectsInfo.map(sub => (
              <button
                key={sub.id}
                onClick={() => !sub.isLockedSubject && onPickSubject(sub.id)}
                disabled={sub.isLockedSubject}
                style={{
                  ...styles.subjectCard,
                  borderColor: sub.color,
                  ...(sub.isLockedSubject ? styles.subjectCardLocked : {})
                }}
              >
                <div style={{
                  fontSize: 56,
                  filter: sub.isLockedSubject ? 'grayscale(1)' : 'none'
                }}>
                  {sub.isLockedSubject ? '🔒' : sub.emoji}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8, color: sub.color, fontFamily: 'Georgia, serif' }}>
                  {sub.name}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {sub.description}
                </div>
                {sub.isLockedSubject ? (
                  <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, marginTop: 12, padding: '6px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                    Bemeester eers ✖️ Vlak {sub.requiresMultLevel} (2× tafel)
                  </div>
                ) : (
                  <>
                    <div style={{
                      marginTop: 12,
                      width: '100%',
                      height: 8,
                      background: '#e5e7eb',
                      borderRadius: 999,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: ((sub.masteredInSubject / sub.totalSkills) * 100) + '%',
                        background: sub.color,
                        borderRadius: 999,
                        transition: 'width 0.4s'
                      }}></div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginTop: 6 }}>
                      {sub.masteredInSubject} / {sub.totalSkills} bemeester
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      Huidig: Vlak {sub.currentLevel}
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ SUBJECT LEVELS SCREEN ═══════════════
// Wys al die vlakke vir 'n vak. Kind kies waar te begin.
function SubjectLevelsScreen({ profile, subjectId, soundOn, onPickLevel, onBack }) {
  const subject = SUBJECTS[subjectId];
  if (!subject) return null;

  const skills = subject.skills.map(sk => {
    const isMastered = isSkillMastered(profile, subjectId, sk.level);
    const stars = getSkillStars(profile, subjectId, sk.level);
    const stats = getSkillStats(profile, subjectId, sk.level);
    const unlocked = isSkillUnlocked(profile, subjectId, sk.level);
    const isCurrent = !isMastered && unlocked && (sk.level === 1 || isSkillMastered(profile, subjectId, sk.level - 1));
    const accuracy = stats.attempts > 0 ? Math.round(stats.accuracy * 100) : 0;
    return { ...sk, isMastered, stars, stats, unlocked, isCurrent, accuracy };
  });

  // ═══ STAARTDELING (paper method) - aparte stroke vir Deel ═══
  const paperMethod = subject.papermethod || null;
  let paperSkills = [];
  let paperUnlocked = false;
  if (paperMethod) {
    // Vereis dat 'n minimum vlak in die hoof-vak bemeester is voor enige paper-vlak oop is
    paperUnlocked = paperMethod.requiresLevel
      ? isSkillMastered(profile, subjectId, paperMethod.requiresLevel)
      : true;

    paperSkills = paperMethod.levels.map((sk, idx) => {
      const pmId = paperMethod.id;  // 'longdiv'
      const isMastered = isSkillMastered(profile, pmId, sk.level);
      const stars = getSkillStars(profile, pmId, sk.level);
      const stats = getSkillStats(profile, pmId, sk.level);
      // Alle vlakke oop - kind kies waar hy wil oefen
      const prevMastered = idx === 0 ? true : isSkillMastered(profile, pmId, sk.level - 1);
      const unlocked = paperUnlocked;  // alle vlakke oop binne paper-method
      const isCurrent = !isMastered && unlocked && prevMastered;
      const accuracy = stats.attempts > 0 ? Math.round(stats.accuracy * 100) : 0;
      return { ...sk, isMastered, stars, stats, unlocked, isCurrent, accuracy };
    });
  }

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Terug</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 32 }}>{subject.emoji}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: 22, color: subject.color, fontFamily: 'Georgia, serif' }}>
                {subject.name.toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{subject.description}</div>
            </div>
          </div>
          <div style={{ width: 60 }}></div>
        </header>

        {!subject.sequential && (
          <div style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
            fontSize: 13,
            color: '#374151',
            textAlign: 'center'
          }}>
            💡 <strong>Begin waar jy gemaklik voel!</strong> Scroll deur die vlakke en tik op een wat na 'n uitdaging lyk.
          </div>
        )}

        {subject.sequential && (
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
            fontSize: 13,
            color: '#374151',
            textAlign: 'center'
          }}>
            🔒 <strong>Stelselmatig opbou!</strong> Bemeester elke vlak (80%+) om die volgende oop te sluit.
          </div>
        )}

        {/* HOOF (KOP-REKENE) STROOK */}
        {paperMethod && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            padding: '8px 14px',
            background: 'rgba(139, 92, 246, 0.08)',
            borderRadius: 10
          }}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: subject.color }}>VINNIG (KOP-REKENE)</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Tafels en kop-rekene</div>
            </div>
          </div>
        )}

        <div style={styles.skillsList}>
          {skills.map((sk) => (
            <button
              key={sk.level}
              onClick={() => sk.unlocked && onPickLevel(sk.level, 'quick')}
              disabled={!sk.unlocked}
              style={{
                ...styles.skillCard,
                width: '100%',
                cursor: sk.unlocked ? 'pointer' : 'not-allowed',
                background: sk.isMastered ? 'rgba(16,185,129,0.1)' :
                            sk.isCurrent ? 'rgba(59,130,246,0.08)' :
                            !sk.unlocked ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.85)',
                border: sk.isMastered ? '2px solid rgba(16,185,129,0.3)' :
                        sk.isCurrent ? '2px solid #3b82f6' :
                        '2px solid transparent',
                opacity: !sk.unlocked ? 0.55 : 1,
                textAlign: 'left'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: sk.isMastered ? '#10b981' : sk.isCurrent ? subject.color : !sk.unlocked ? '#d1d5db' : '#f3f4f6',
                color: 'white', fontSize: 20, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {!sk.unlocked ? '🔒' : sk.level}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 22 }}>{sk.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{sk.name}</span>
                  {sk.isCurrent && (
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      background: subject.color, color: 'white',
                      padding: '2px 8px', borderRadius: 999
                    }}>NOU HIER</span>
                  )}
                  {sk.isMastered && (
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      background: '#10b981', color: 'white',
                      padding: '2px 8px', borderRadius: 999
                    }}>✓ BEMEESTER</span>
                  )}
                </div>
                {sk.unlocked && (
                  <>
                    {sk.stats.attempts > 0 && (
                      <div style={styles.skillBar}>
                        <div style={{
                          ...styles.skillBarFill,
                          width: sk.accuracy + '%',
                          background: sk.isMastered ? '#10b981' : sk.accuracy >= 50 ? '#f59e0b' : '#3b82f6'
                        }}></div>
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span>
                        {sk.stats.attempts === 0 ? `💡 ${sk.tip}` :
                         sk.isMastered ? `✓ Bemeester (${sk.accuracy}%)` :
                         `${sk.accuracy}% · ${sk.stats.attempts} pogings`}
                      </span>
                      {sk.stats.attempts >= 10 && (
                        <span style={{ letterSpacing: 2 }}>
                          {'⭐'.repeat(sk.stars)}{'☆'.repeat(3 - sk.stars)}
                        </span>
                      )}
                    </div>
                  </>
                )}
                {!sk.unlocked && (
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    Bemeester eers Vlak {sk.level - 1} om dit oop te sluit
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* PAPER METHOD STROOK (Op papier — staartdeling vir Deel) */}
        {paperMethod && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 28,
              marginBottom: 12,
              padding: '10px 14px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '2px solid rgba(168, 85, 247, 0.25)',
              borderRadius: 12
            }}>
              <span style={{ fontSize: 26 }}>{paperMethod.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 15, color: '#a855f7' }}>
                  OP PAPIER ({paperMethod.name.toUpperCase()})
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{paperMethod.description}</div>
              </div>
            </div>

            {!paperUnlocked && (
              <div style={{
                background: 'rgba(0,0,0,0.04)',
                border: '1px dashed rgba(0,0,0,0.15)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                textAlign: 'center',
                fontSize: 13,
                color: '#6b7280'
              }}>
                🔒 Bemeester eers Vlak {paperMethod.requiresLevel} ({subject.skills[paperMethod.requiresLevel - 1].name}) om staartdeling oop te sluit.
              </div>
            )}

            {paperUnlocked && (
              <div style={styles.skillsList}>
                {paperSkills.map((sk) => (
                  <button
                    key={'pm_' + sk.level}
                    onClick={() => sk.unlocked && onPickLevel(sk.level, 'paper')}
                    disabled={!sk.unlocked}
                    style={{
                      ...styles.skillCard,
                      width: '100%',
                      cursor: sk.unlocked ? 'pointer' : 'not-allowed',
                      background: sk.isMastered ? 'rgba(16,185,129,0.1)' :
                                  sk.isCurrent ? 'rgba(168, 85, 247, 0.08)' :
                                  !sk.unlocked ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.85)',
                      border: sk.isMastered ? '2px solid rgba(16,185,129,0.3)' :
                              sk.isCurrent ? '2px solid #a855f7' :
                              '2px solid transparent',
                      opacity: !sk.unlocked ? 0.55 : 1,
                      textAlign: 'left'
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: sk.isMastered ? '#10b981' : sk.isCurrent ? '#a855f7' : !sk.unlocked ? '#d1d5db' : '#f3f4f6',
                      color: 'white', fontSize: 20, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {!sk.unlocked ? '🔒' : sk.level}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 22 }}>{sk.emoji}</span>
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{sk.name}</span>
                        {sk.isCurrent && (
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            background: '#a855f7', color: 'white',
                            padding: '2px 8px', borderRadius: 999
                          }}>NOU HIER</span>
                        )}
                        {sk.isMastered && (
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            background: '#10b981', color: 'white',
                            padding: '2px 8px', borderRadius: 999
                          }}>✓ BEMEESTER</span>
                        )}
                      </div>
                      {sk.unlocked && (
                        <>
                          {sk.stats.attempts > 0 && (
                            <div style={styles.skillBar}>
                              <div style={{
                                ...styles.skillBarFill,
                                width: sk.accuracy + '%',
                                background: sk.isMastered ? '#10b981' : sk.accuracy >= 50 ? '#f59e0b' : '#a855f7'
                              }}></div>
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                            <span>
                              {sk.stats.attempts === 0 ? `💡 ${sk.tip}` :
                               sk.isMastered ? `✓ Bemeester (${sk.accuracy}%)` :
                               `${sk.accuracy}% · ${sk.stats.attempts} pogings`}
                            </span>
                            {sk.stats.attempts >= 10 && (
                              <span style={{ letterSpacing: 2 }}>
                                {'⭐'.repeat(sk.stars)}{'☆'.repeat(3 - sk.stars)}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                      {!sk.unlocked && (
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                          Bemeester eers Vlak {sk.level - 1} om dit oop te sluit
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════ SUBJECT PICKER SCREEN ═══════════════
// Vir wedren - kies watter vak
function SubjectPickerScreen({ profile, context, soundOn, onPick, onBack }) {
  const title = context === 'sprint' ? '⚡ KIES VAK VIR WEDREN' : '🏆 KIES VAK';
  const sub = context === 'sprint' ? 'In watter vak wil jy 60 sekondes wedren?' : 'Kies watter vak om te speel';

  const subjectsInfo = SUBJECT_ORDER.map(sid => {
    const subject = SUBJECTS[sid];
    const isLockedSubject = subject.requiresMultLevel && !isSkillMastered(profile, 'mult', subject.requiresMultLevel);
    const sprintRecord = (profile.sprintRecords || {})[sid] || 0;
    return { ...subject, isLockedSubject, sprintRecord };
  });

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Terug</button>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
          <div style={{ width: 60 }}></div>
        </header>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 16, color: '#6b7280' }}>{sub}</p>
        </div>

        <div style={styles.subjectGrid}>
          {subjectsInfo.map(sub => (
            <button
              key={sub.id}
              onClick={() => !sub.isLockedSubject && onPick(sub.id)}
              disabled={sub.isLockedSubject}
              style={{
                ...styles.subjectCard,
                borderColor: sub.color,
                ...(sub.isLockedSubject ? styles.subjectCardLocked : {})
              }}
            >
              <div style={{ fontSize: 64, filter: sub.isLockedSubject ? 'grayscale(1)' : 'none' }}>
                {sub.isLockedSubject ? '🔒' : sub.emoji}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8, color: sub.color, fontFamily: 'Georgia, serif' }}>
                {sub.name}
              </div>
              {!sub.isLockedSubject && context === 'sprint' && (
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8, fontWeight: 700 }}>
                  🏆 Rekord: {sub.sprintRecord}
                </div>
              )}
              {sub.isLockedSubject && (
                <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginTop: 12 }}>
                  Toe (bemeester eers 2× tafel)
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════ PRACTICE SCREEN ═══════════════
function PracticeScreen({ profile, subjectId, level, questionCount, soundOn, onComplete, onQuit }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [inputRem, setInputRem] = useState(''); // vir restant
  const [feedback, setFeedback] = useState(null);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(15);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const subject = SUBJECTS[subjectId];
  const skill = subject.skills[level - 1] || subject.skills[0];

  useEffect(() => {
    const qs = [];
    for (let i = 0; i < questionCount; i++) qs.push(generateQuestion(profile, subjectId, level));
    setQuestions(qs);
    setQuestionStart(Date.now());
  }, []);

  // Stel tyd per vraag - aangepas volgens kind se geskiedenis met daardie feit
  useEffect(() => {
    if (questions[current]) {
      const q = questions[current];
      const limit = getTimePerQuestion(profile, factKey(subjectId, q.a, q.b), level);
      setQuestionTimeLimit(limit);
      setTimeLeft(limit);
      setQuestionStart(Date.now());
    }
  }, [current, questions]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [current]);

  // Aftel timer
  useEffect(() => {
    if (feedback || !questions[current]) return;
    if (timeLeft <= 0) {
      const q = questions[current];
      sounds.timeUp(soundOn);
      const updated = [...questions];
      updated[current] = { ...q, userAnswer: null, correct: false, timeMs: questionTimeLimit * 1000, timedOut: true };
      setQuestions(updated);
      setFeedback('wrong');

      setTimeout(() => {
        setFeedback(null);
        setInput('');
        setInputRem('');
        if (current + 1 >= questionCount) {
          onComplete({ questions: updated });
        } else {
          setCurrent(current + 1);
        }
      }, 1800);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => +(t - 0.1).toFixed(1)), 100);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, feedback, current, questions]);

  const q = questions[current];
  if (!q) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const handleSubmit = () => {
    if (!input.trim() || feedback) return;
    const ans = parseInt(input, 10);
    let correct;
    if (q.hasRemainder) {
      const remAns = parseInt(inputRem, 10);
      correct = ans === q.answer && remAns === q.remainder;
    } else {
      correct = ans === q.answer;
    }
    const timeMs = Date.now() - questionStart;

    if (correct) sounds.correct(soundOn);
    else sounds.wrong(soundOn);

    const updated = [...questions];
    updated[current] = { ...q, userAnswer: ans, userRemainder: q.hasRemainder ? parseInt(inputRem, 10) : undefined, correct, timeMs };
    setQuestions(updated);
    setFeedback(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setInputRem('');
      if (current + 1 >= questionCount) {
        onComplete({ questions: updated });
      } else {
        setCurrent(current + 1);
      }
    }, correct ? 800 : 1800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // Pas font size aan vir groter getalle
  const numLength = String(q.a).length + String(q.b).length;
  const baseFontSize = profile.dyslexiaMode ? 90 : 70;
  const fontSize = numLength > 4 ? Math.max(40, baseFontSize - (numLength - 4) * 8) : baseFontSize;
  const inputFontSize = profile.dyslexiaMode ? 64 : 50;
  const timePct = (timeLeft / questionTimeLimit) * 100;
  const timerColor = timePct > 50 ? '#10b981' : timePct > 20 ? '#f59e0b' : '#ef4444';

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={styles.questionCounter}>
            {subject.emoji} Vlak {level} · {current + 1}/{questionCount}
          </div>
          <div style={{ fontSize: 24 }}>{profile.avatar}</div>
        </header>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: ((current / questionCount) * 100) + '%', background: subject.color }}></div>
        </div>

        {/* Adaptiewe tyd-indikator */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...styles.timerBar, height: 8 }}>
            <div style={{ ...styles.timerFill, width: timePct + '%', background: timerColor }}></div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: timerColor, fontWeight: 700, marginTop: 4 }}>
            ⏱️ {timeLeft.toFixed(1)}s
          </div>
        </div>

        <div style={styles.questionBox}>
          {feedback === 'correct' && <div style={styles.feedbackCorrect}>✓ Reg!</div>}
          {feedback === 'wrong' && (
            <div style={styles.feedbackWrong}>
              Antwoord: {q.answer}{q.hasRemainder ? ` res ${q.remainder}` : ''}
            </div>
          )}

          <div style={{ ...styles.question, fontSize }}>
            <span>{q.a}</span>
            <span style={{ color: subject.color, margin: '0 16px' }}>{q.op}</span>
            <span>{q.b}</span>
            <span style={{ color: '#6b7280', margin: '0 16px' }}>=</span>
            <span style={{ color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : subject.color }}>
              {input || '?'}
              {q.hasRemainder && (
                <>
                  <span style={{ color: '#9ca3af', fontSize: '0.6em', margin: '0 8px' }}>res</span>
                  <span>{inputRem || '?'}</span>
                </>
              )}
            </span>
          </div>

          {q.hasRemainder ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (input && inputRem) handleSubmit();
                  }
                }}
                disabled={!!feedback}
                style={{ ...styles.answerInput, fontSize: 36, width: 120, opacity: feedback ? 0.5 : 1 }}
                placeholder="Antw"
              />
              <span style={{ fontSize: 18, color: '#6b7280', fontWeight: 700 }}>res</span>
              <input
                type="number"
                inputMode="numeric"
                value={inputRem}
                onChange={e => setInputRem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && input && inputRem) handleSubmit();
                }}
                disabled={!!feedback}
                style={{ ...styles.answerInput, fontSize: 36, width: 100, opacity: feedback ? 0.5 : 1 }}
                placeholder="Res"
              />
            </div>
          ) : (
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={!!feedback}
              style={{ ...styles.answerInput, fontSize: inputFontSize, opacity: feedback ? 0.5 : 1 }}
              placeholder="Antwoord..."
            />
          )}

          <button onClick={handleSubmit} disabled={!input.trim() || (q.hasRemainder && !inputRem.trim()) || !!feedback} style={styles.submitBtn}>
            Stuur (Enter)
          </button>
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => {
              if (q.hasRemainder && document.activeElement && document.activeElement.placeholder === 'Res') {
                setInputRem(inputRem + n);
              } else {
                setInput(input + n);
              }
            }} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => {
            if (q.hasRemainder && document.activeElement && document.activeElement.placeholder === 'Res') {
              setInputRem(inputRem.slice(0, -1));
            } else {
              setInput(input.slice(0, -1));
            }
          }} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => {
            if (q.hasRemainder && document.activeElement && document.activeElement.placeholder === 'Res') {
              setInputRem(inputRem + '0');
            } else {
              setInput(input + '0');
            }
          }} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!input.trim() || (q.hasRemainder && !inputRem.trim()) || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ STAARTDELING SKERMS ═══════════════
// Een gedeelde grid-renderer wat beide demo en praktyk gebruik.
// Die grid wys: rij 0 = quotient, rij 1 = dividend met deler, dan iterasies van multiply/subtract/bring-down.

// Bou 'n cell-matrix wat ALLE syfers in posisies plaas vir die gegewe stappe.
// Elke cell: { type, value, position, row, filled (boolean), step (index of step that fills it) }
const buildLongDivGrid = (dividend, divisor, solution) => {
  const dividendDigits = solution.digits;
  const N = dividendDigits.length;
  const cols = N + 2; // 2 ekstra kolomme links: deler en bracket
  const DIVISOR_COL = 0;
  const FIRST_DIGIT_COL = 2;

  // Rye:
  // 0: quotient digits (bo)
  // 1: dividend (statiese)
  // Daarna: per "blok" (voorgekomp deur i in solveLongDivision), kry ons:
  //   - multiply row (subtrahend, regs-belyn op posisie i)
  //   - subtract row (verskil; voor bring-down dis verskil; na bring-down dis nuwe getal)
  //   - bring-down: voeg next digit by die subtract-row se regterkant
  // Ons rangskik dit visueel onder mekaar.

  // Maak eers 'n gestruktureerde stappe-lys per "blok" (per kwosient-syfer)
  const blocks = [];
  let cur = null;
  solution.steps.forEach((s, idx) => {
    if (s.type === 'quotient_digit') {
      if (cur) blocks.push(cur);
      cur = { qDigit: s, multiply: null, subtract: null, bringDown: null };
    } else if (s.type === 'multiply') {
      cur.multiply = s;
    } else if (s.type === 'subtract') {
      cur.subtract = s;
    } else if (s.type === 'bring_down') {
      cur.bringDown = s;
    }
  });
  if (cur) blocks.push(cur);

  // Bou cell-matrix
  // Gebruik 'n object-array, gegroepeer per displayRow
  const rows = [];

  // Row 0: quotient (boonste). Lê ooreenkomstig dividend posisies.
  const qRow = { kind: 'quotient', cells: new Array(cols).fill(null) };
  blocks.forEach(b => {
    const col = FIRST_DIGIT_COL + b.qDigit.position;
    qRow.cells[col] = {
      type: 'quotient_digit',
      value: b.qDigit.value,
      stepIndex: solution.steps.indexOf(b.qDigit),
      col, row: 0
    };
  });
  rows.push(qRow);

  // Row 1: dividend - ALTYD ingevul, statiese
  const dRow = { kind: 'dividend', cells: new Array(cols).fill(null) };
  dRow.cells[DIVISOR_COL] = { type: 'static_divisor', value: divisor, col: DIVISOR_COL, row: 1 };
  dRow.cells[1] = { type: 'static_bracket', value: ')', col: 1, row: 1 };
  dividendDigits.forEach((d, i) => {
    dRow.cells[FIRST_DIGIT_COL + i] = { type: 'static_dividend', value: d, col: FIRST_DIGIT_COL + i, row: 1 };
  });
  rows.push(dRow);

  // Vir elke blok: 1 multiply rij, 1 onderstreep, 1 subtract rij (wat ook bring-down kan insluit)
  blocks.forEach((b, bi) => {
    // Multiply row: regs-belyn op b.qDigit.position. Die multiply waarde se laaste digit lê by FIRST_DIGIT_COL + b.qDigit.position.
    const mulStr = String(b.multiply.value);
    const mulRow = { kind: 'multiply', cells: new Array(cols).fill(null), hasMinusSign: true };
    const lastCol = FIRST_DIGIT_COL + b.qDigit.position;
    for (let k = 0; k < mulStr.length; k++) {
      const col = lastCol - (mulStr.length - 1 - k);
      mulRow.cells[col] = {
        type: 'multiply_digit',
        value: parseInt(mulStr[k], 10),
        stepIndex: solution.steps.indexOf(b.multiply),
        col, row: rows.length,
        showMinus: k === 0,  // wys minus links van eerste digit
        digitIndex: k,        // posisie binne multi-digit waarde (0 = links)
        digitTotal: mulStr.length
      };
    }
    rows.push(mulRow);

    // Underline ry (visueel - onderstreep onder multiply)
    rows.push({ kind: 'underline', startCol: lastCol - mulStr.length + 1, endCol: lastCol, cells: new Array(cols).fill(null) });

    // Subtract row: verskil regs-belyn op posisie b.qDigit.position; as bring-down bestaan, voeg ook digit by ry langs.
    const subVal = b.subtract.value;
    const subRow = { kind: 'subtract', cells: new Array(cols).fill(null) };

    if (subVal === 0 && !b.bringDown) {
      // Skryf 0
      subRow.cells[lastCol] = {
        type: 'subtract_digit',
        value: 0,
        stepIndex: solution.steps.indexOf(b.subtract),
        col: lastCol, row: rows.length,
        digitIndex: 0,
        digitTotal: 1
      };
    } else {
      const subStr = String(subVal);
      // Regs-belyn op posisie lastCol
      for (let k = 0; k < subStr.length; k++) {
        const col = lastCol - (subStr.length - 1 - k);
        subRow.cells[col] = {
          type: 'subtract_digit',
          value: parseInt(subStr[k], 10),
          stepIndex: solution.steps.indexOf(b.subtract),
          col, row: rows.length,
          digitIndex: k,
          digitTotal: subStr.length
        };
      }
    }

    // Bring-down digit: in dieselfde subtract row, langs subtract regs
    if (b.bringDown) {
      const bdCol = FIRST_DIGIT_COL + b.bringDown.position;
      subRow.cells[bdCol] = {
        type: 'bring_down_digit',
        value: b.bringDown.value,
        stepIndex: solution.steps.indexOf(b.bringDown),
        col: bdCol, row: rows.length
      };
    }

    // As laaste blok en daar's 'n nie-nul restant: merk subtract as final remainder vir styling
    if (bi === blocks.length - 1) {
      subRow.cells.forEach(c => { if (c && c.type === 'subtract_digit') c.isFinalRemainder = true; });
    }

    rows.push(subRow);
  });

  return { rows, cols, blocks, solution };
};

// Render-komponent vir die staartdeling-grid.
// fillUpTo: stepIndex tot waar cells gevul wys (inklusief). Cells na fillUpTo wys leeg (of gehighlight as actiwe).
// activeStep: die huidige stap-index (gehighlight)
// userInput: string van wat die kind tot dusver getik het (vir actiwe stap)
// wrongFlash: boolean, flash rooi as wrong
// ghostAnim: {fromCol, fromRow, toCol, toRow, value, color, key} - skuif 'n syfer-spook van bron na teiken
function LongDivisionGrid({ grid, fillUpTo, activeStep, currentStep, userInput, wrongFlash, dyslexiaMode, ghostAnim }) {
  const cellW = dyslexiaMode ? 38 : 32;
  const cellH = dyslexiaMode ? 46 : 40;
  const fontSize = dyslexiaMode ? 28 : 24;
  const opSize = dyslexiaMode ? 50 : 44;

  // Bereken die top-pixel van 'n gegewe row-index, met inagneming dat
  // underline rows 8px hoog is (2px lyn + 2px top + 4px bottom marge).
  const rowTop = (targetRow) => {
    let y = 0;
    for (let r = 0; r < targetRow && r < grid.rows.length; r++) {
      const row = grid.rows[r];
      y += row.kind === 'underline' ? 8 : cellH;
    }
    return y;
  };

  // Bepaal operasie-teken vir huidige stap
  let opSymbol = null, opLabel = null, opColor = null;
  if (currentStep) {
    if (currentStep.type === 'quotient_digit') { opSymbol = '÷'; opLabel = 'DEEL'; opColor = '#a855f7'; }
    else if (currentStep.type === 'multiply') { opSymbol = '×'; opLabel = 'MAAL'; opColor = '#3b82f6'; }
    else if (currentStep.type === 'subtract') { opSymbol = '−'; opLabel = 'TREK AF'; opColor = '#10b981'; }
    else if (currentStep.type === 'bring_down') { opSymbol = '↓'; opLabel = 'BRING AF'; opColor = '#f59e0b'; }
  }

  return (
    <div style={{
      display: 'inline-block',
      fontFamily: 'monospace',
      padding: '20px 16px',
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid rgba(168, 85, 247, 0.25)',
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      <div style={{ position: 'relative' }}>
        {grid.rows.map((row, ri) => {
          if (row.kind === 'underline') {
            // Trek 'n lyn onder die multiply
            const left = (row.startCol) * cellW;
            const width = (row.endCol - row.startCol + 1) * cellW;
            return (
              <div key={ri} style={{
                height: 2,
                marginLeft: left,
                width,
                background: '#1f2937',
                marginBottom: 4,
                marginTop: 2
              }}></div>
            );
          }
          return (
            <div key={ri} style={{ display: 'flex', height: cellH, alignItems: 'center' }}>
              {row.cells.map((cell, ci) => {
                // Empty cell - check if it's the active position to highlight
                if (!cell) {
                  return <div key={ci} style={{ width: cellW, height: cellH }}></div>;
                }
                const isStatic = cell.type === 'static_dividend' || cell.type === 'static_divisor' || cell.type === 'static_bracket';
                const cellFilled = isStatic || (cell.stepIndex !== undefined && cell.stepIndex <= fillUpTo);
                const isActive = !isStatic && cell.stepIndex === activeStep;

                // Bracket-styling
                if (cell.type === 'static_bracket') {
                  return (
                    <div key={ci} style={{
                      width: cellW, height: cellH,
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      fontSize: fontSize + 8, fontWeight: 700, color: '#1f2937'
                    }}>
                      {/* Use a vertical line + horizontal line at top to mimic the bracket */}
                      <div style={{
                        width: cellW * 0.6,
                        height: cellH * 0.7,
                        borderLeft: '2px solid #1f2937',
                        borderTop: '2px solid #1f2937',
                        borderRadius: '6px 0 0 0'
                      }}></div>
                    </div>
                  );
                }

                let bg = 'transparent';
                let color = '#1f2937';
                let border = 'none';
                let fontWeight = 700;

                if (isActive) {
                  bg = wrongFlash ? '#fee2e2' : '#fef3c7';
                  border = wrongFlash ? '2px solid #ef4444' : '2px solid #f59e0b';
                  if (wrongFlash) color = '#991b1b';
                } else if (cellFilled) {
                  if (cell.type === 'quotient_digit') { color = '#a855f7'; fontWeight = 900; }
                  else if (cell.type === 'multiply_digit') color = '#3b82f6';
                  else if (cell.type === 'subtract_digit') color = cell.isFinalRemainder ? '#ef4444' : '#10b981';
                  else if (cell.type === 'bring_down_digit') color = '#f59e0b';
                }

                // Optional minus sign for multiply rows (links van eerste digit)
                const minusBefore = cell.showMinus && cellFilled;

                return (
                  <div key={ci} style={{
                    width: cellW, height: cellH,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {minusBefore && (
                      <span style={{
                        position: 'absolute',
                        left: -8,
                        fontSize: fontSize - 4,
                        color: '#6b7280',
                        fontWeight: 700
                      }}>−</span>
                    )}
                    <div style={{
                      width: cellW - 4, height: cellH - 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize, fontWeight, color, background: bg,
                      border, borderRadius: 6,
                      transition: 'all 0.15s ease'
                    }}>
                      {(() => {
                        if (isActive) {
                          // Multi-digit waardes: versprei userInput regs-belyn oor die cells.
                          // Die laaste cell is digitIndex = digitTotal - 1.
                          // userInput word regs-belyn: laaste karakter sit in die laaste cell, ens.
                          const total = cell.digitTotal || 1;
                          const idx = cell.digitIndex !== undefined ? cell.digitIndex : 0;
                          const inp = userInput || '';
                          if (!inp) {
                            // Leë invoer: wys '?' net by die regte (eerste in te tik) cell
                            return idx === total - 1 ? '?' : '';
                          }
                          // Regs-belyn: as kind '21' getik en daar's 2 cells (idx 0 en 1),
                          // dan idx 0 = '2', idx 1 = '1'. As kind net '1' getik, dan
                          // idx 0 = '' (leeg), idx 1 = '1'.
                          const padded = inp.padStart(total, ' ');
                          const ch = padded[idx];
                          return ch === ' ' ? '' : ch;
                        }
                        return cellFilled ? cell.value : '';
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* GROOT OPERASIE-TEKEN regs van die grid */}
        {opSymbol && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: grid.cols * cellW + 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: cellH * 0.3
          }}>
            <div style={{
              fontSize: opSize,
              fontWeight: 900,
              color: opColor,
              lineHeight: 1,
              animation: 'pulse 1.2s ease-in-out infinite'
            }}>{opSymbol}</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: opColor,
              marginTop: 4,
              letterSpacing: 1
            }}>{opLabel}</div>
          </div>
        )}

        {/* GHOST-SYFER ANIMASIE: klein-skuif-na-groot */}
        {ghostAnim && (
          <div
            key={ghostAnim.key}
            style={{
              position: 'absolute',
              width: cellW,
              height: cellH,
              left: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: fontSize + 6,
              fontWeight: 900,
              color: ghostAnim.color || '#a855f7',
              textShadow: `0 0 12px ${ghostAnim.color || '#a855f7'}66, 0 0 4px white`,
              pointerEvents: 'none',
              zIndex: 50,
              animation: 'ghostSlide 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              '--fromX': `${ghostAnim.fromCol * cellW}px`,
              '--fromY': `${rowTop(ghostAnim.fromRow)}px`,
              '--toX': `${ghostAnim.toCol * cellW}px`,
              '--toY': `${rowTop(ghostAnim.toRow)}px`
            }}
          >
            {ghostAnim.value}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ DEMO SKERM (Staartdeling) ═══════════════
// 3 voorbeelde, 4s outo-progress, knoppies vir Back/Volgende/Vorige voorbeeld/Uit
function LongDivisionDemoScreen({ profile, level, soundOn, onContinue, onSkip }) {
  const skill = SUBJECTS.div.papermethod.levels[level - 1] || SUBJECTS.div.papermethod.levels[0];
  const [problems] = useState(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      const p = generateLongDivProblem(level);
      const sol = solveLongDivision(p.dividend, p.divisor);
      const grid = buildLongDivGrid(p.dividend, p.divisor, sol);
      arr.push({ ...p, solution: sol, grid });
    }
    return arr;
  });

  const PAUSE_MS = 5000; // 5s outo-progress (stadiger vir Gr1)

  const [exampleIdx, setExampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [ghostAnim, setGhostAnim] = useState(null);
  // visibleStepIdx loop 1.4s agter stepIdx aan — sodat die syfer EERS verskyn NA
  // die ghost-animasie klaar is (anders is dit verwarrend).
  const [visibleStepIdx, setVisibleStepIdx] = useState(-1);

  const current = problems[exampleIdx];
  const totalSteps = current.solution.steps.length;

  // Trigger ghost-animasie wanneer 'n nuwe stap begin (klein-skuif-na-groot).
  // Loop 1.4s, daarna word ghost weggesteek EN word die regte syfer ingevul.
  useEffect(() => {
    if (stepIdx < 0 || stepIdx >= totalSteps) {
      setGhostAnim(null);
      setVisibleStepIdx(stepIdx);
      return;
    }
    const step = current.solution.steps[stepIdx];
    if (!step) { setGhostAnim(null); setVisibleStepIdx(stepIdx); return; }

    const DIVISOR_COL = 0;
    const FIRST_DIGIT_COL = 2;
    const pos = step.position || 0;

    // Tel hoeveel blokke (quotient digits) tot by hierdie stap geprosesseer is.
    // Elke "blok" beslaan 3 rye in die grid: multiply, underline, subtract.
    // Rye: 0=quotient, 1=dividend, blok 0 = rye 2-4, blok 1 = rye 5-7, ...
    // Vir blok b: multiply-rij = 2 + b*3, subtract-rij = 4 + b*3.
    // Die "werking-getal" vir blok b sit in rij 1 (as b=0) of in vorige blok se subtract-rij (4 + (b-1)*3 = b*3 + 1) as b>=1.
    let blockIdx = -1;
    for (let i = 0; i <= stepIdx; i++) {
      if (current.solution.steps[i].type === 'quotient_digit') blockIdx++;
    }
    const workingRow = blockIdx <= 0 ? 1 : (blockIdx * 3 + 1); // waar die huidige werking-getal staan
    const multiplyRow = 2 + blockIdx * 3;
    const subtractRow = 4 + blockIdx * 3;

    let anim = null;

    if (step.type === 'quotient_digit') {
      // Divisor (klein, links) skuif SKUINS na werking-getal (kan in rij 1 wees of in vorige subtract-rij)
      anim = {
        fromCol: DIVISOR_COL, fromRow: 1,
        toCol: FIRST_DIGIT_COL + pos, toRow: workingRow,
        value: current.divisor,
        color: '#a855f7',
        key: `div-${exampleIdx}-${stepIdx}-q`
      };
    } else if (step.type === 'multiply') {
      // Kwosient-syfer (bo regs) skuif SKUINS na die divisor (links onder) om die "× 4" aksie te wys
      anim = {
        fromCol: FIRST_DIGIT_COL + pos, fromRow: 0,
        toCol: DIVISOR_COL, toRow: 1,
        value: step.multiplicand || '×',
        color: '#3b82f6',
        key: `div-${exampleIdx}-${stepIdx}-m`
      };
    } else if (step.type === 'bring_down') {
      // Volgende dividend syfer (van dividend bo) skuif skuins af na die subtract-rij langs verskil
      anim = {
        fromCol: FIRST_DIGIT_COL + pos, fromRow: 1,
        toCol: FIRST_DIGIT_COL + pos, toRow: subtractRow,
        value: step.value,
        color: '#f59e0b',
        key: `div-${exampleIdx}-${stepIdx}-b`
      };
    }
    // 'subtract' kry geen ghost — die syfer kom net direk in

    if (anim) {
      setGhostAnim(anim);
      // visibleStepIdx bly steeds 1 agter — syfer verskyn EERS NA animasie klaar
      const t = setTimeout(() => {
        setGhostAnim(null);
        setVisibleStepIdx(stepIdx);
      }, 1400);
      return () => clearTimeout(t);
    } else {
      // Geen animasie (bv. subtract): syfer kan dadelik verskyn
      setGhostAnim(null);
      setVisibleStepIdx(stepIdx);
    }
  }, [stepIdx, exampleIdx, totalSteps, current]);

  // Reset visibleStepIdx wanneer 'n nuwe voorbeeld begin
  useEffect(() => {
    setVisibleStepIdx(-1);
  }, [exampleIdx]);

  useEffect(() => {
    if (paused) return;
    if (stepIdx >= totalSteps - 1) return;
    const timer = setTimeout(() => {
      setStepIdx(s => s + 1);
      sounds.click(soundOn);
    }, PAUSE_MS);
    return () => clearTimeout(timer);
  }, [stepIdx, paused, totalSteps, soundOn]);

  const currentStep = stepIdx >= 0 ? current.solution.steps[stepIdx] : null;
  const finishedExample = stepIdx >= totalSteps - 1;
  const isLastExample = exampleIdx >= problems.length - 1;
  const isFirstExample = exampleIdx === 0;
  const finishedAll = finishedExample && isLastExample;

  const goNextStep = () => {
    if (stepIdx < totalSteps - 1) {
      sounds.click(soundOn);
      setStepIdx(s => s + 1);
    }
  };
  const goPrevStep = () => {
    if (stepIdx >= 0) {
      sounds.click(soundOn);
      setStepIdx(s => s - 1);
    }
  };
  const goNextExample = () => {
    sounds.click(soundOn);
    setExampleIdx(i => i + 1);
    setStepIdx(-1);
    setPaused(false);
  };
  const goPrevExample = () => {
    if (exampleIdx > 0) {
      sounds.click(soundOn);
      setExampleIdx(i => i - 1);
      setStepIdx(-1);
      setPaused(false);
    }
  };

  // Operasie-info vir badge in die uitleg-boks (klein, naas die stap-titel)
  let opSymbol = null, opLabel = null, opColor = null;
  if (currentStep) {
    if (currentStep.type === 'quotient_digit') { opSymbol = '÷'; opLabel = 'DEEL'; opColor = '#a855f7'; }
    else if (currentStep.type === 'multiply') { opSymbol = '×'; opLabel = 'MAAL'; opColor = '#3b82f6'; }
    else if (currentStep.type === 'subtract') { opSymbol = '−'; opLabel = 'TREK AF'; opColor = '#10b981'; }
    else if (currentStep.type === 'bring_down') { opSymbol = '↓'; opLabel = 'BRING AF'; opColor = '#f59e0b'; }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onSkip} style={styles.backBtn}>✕ Uit</button>
          <div style={styles.questionCounter}>✏️ Voorbeeld {exampleIdx + 1}/3 · Vlak {level}</div>
          <div style={{ fontSize: 24 }}>{profile.avatar}</div>
        </header>

        <div style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '2px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 16,
          padding: 14,
          marginBottom: 14,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#a855f7', marginBottom: 4 }}>
            👀 KYK HOE EK DIT DOEN
          </div>
          <div style={{ fontSize: 12, color: '#374151' }}>
            {exampleIdx === 0
              ? 'Eerste voorbeeld — kyk mooi na elke stap.'
              : exampleIdx === 1
              ? 'Tweede voorbeeld — sien jy die patroon?'
              : 'Derde voorbeeld — daarna oefen jy self.'}
          </div>
        </div>

        {/* Voortgangs-stippels */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          {problems.map((_, i) => (
            <div key={i} style={{
              width: i === exampleIdx ? 26 : 12,
              height: 12,
              borderRadius: 6,
              background: i < exampleIdx ? '#10b981' : i === exampleIdx ? '#a855f7' : 'rgba(0,0,0,0.15)',
              transition: 'all 0.3s'
            }}></div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.dividend} ÷ {current.divisor} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongDivisionGrid
            grid={current.grid}
            fillUpTo={visibleStepIdx}
            activeStep={!finishedExample ? stepIdx + 1 : -1}
            currentStep={!finishedExample ? current.solution.steps[stepIdx + 1] : null}
            userInput=""
            wrongFlash={false}
            dyslexiaMode={profile.dyslexiaMode}
            ghostAnim={ghostAnim}
          />
        </div>

        {currentStep && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid rgba(168, 85, 247, 0.25)',
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
            minHeight: 70
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#a855f7' }}>
                STAP {stepIdx + 1} VAN {totalSteps}
              </div>
              {opSymbol && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  background: opColor + '22',
                  color: opColor,
                  borderRadius: 999,
                  fontWeight: 900,
                  fontSize: 13,
                  border: `2px solid ${opColor}55`
                }}>
                  <span style={{ fontSize: 18 }}>{opSymbol}</span>
                  {opLabel}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
              {currentStep.explanation}
            </div>
          </div>
        )}

        {/* NAVIGASIE-KNOPPIES (altyd sigbaar) */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <button onClick={goPrevStep} disabled={stepIdx < 0} style={{
            padding: '10px 16px',
            background: stepIdx < 0 ? 'rgba(0,0,0,0.05)' : 'rgba(168,85,247,0.15)',
            color: stepIdx < 0 ? '#9ca3af' : '#a855f7',
            border: stepIdx < 0 ? '2px solid rgba(0,0,0,0.05)' : '2px solid rgba(168,85,247,0.35)',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: stepIdx < 0 ? 'not-allowed' : 'pointer'
          }}>
            ← Terug
          </button>
          <button onClick={() => setPaused(p => !p)} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : (paused ? '#10b981' : '#f59e0b'),
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>
            {paused ? '▶ Gaan voort' : '⏸ Wag'}
          </button>
          <button onClick={goNextStep} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : '#a855f7',
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>
            Volgende stap →
          </button>
        </div>

        {/* VOORBEELD-NAVIGASIE */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {!isFirstExample && (
            <button onClick={goPrevExample} style={{
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.85)',
              color: '#374151',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              ⤺ Vorige voorbeeld
            </button>
          )}
          {finishedExample && !isLastExample && (
            <button onClick={goNextExample} style={{
              padding: '12px 22px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)'
            }}>
              Volgende voorbeeld →
            </button>
          )}
          {finishedAll && (
            <button onClick={onContinue} style={{
              padding: '12px 24px',
              background: '#a855f7',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(168,85,247,0.35)'
            }}>
              ✓ Ek verstaan — probeer self
            </button>
          )}
        </div>

        {finishedExample && (
          <div style={{
            marginTop: 8,
            padding: 12,
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid rgba(16,185,129,0.3)',
            borderRadius: 14,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#065f46' }}>
              {current.dividend} ÷ {current.divisor} = {current.solution.quotient}
              {current.solution.remainder > 0 && <span> res {current.solution.remainder}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ PRAKTYK SKERM (Staartdeling) ═══════════════
function LongDivisionScreen({ profile, level, questionCount, soundOn, onComplete, onQuit, onShowDemo }) {
  const skill = SUBJECTS.div.papermethod.levels[level - 1] || SUBJECTS.div.papermethod.levels[0];
  const [problems, setProblems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);  // huidige verwagte stap-index in oplossing
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0); // pogings op die huidige stap
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | 'finished_problem'
  const [completedSteps, setCompletedSteps] = useState(new Set()); // step indekse wat reg gedoen is
  const [results, setResults] = useState([]); // per probleem: { dividend, divisor, totalSteps, totalErrors, finished }
  const [problemErrors, setProblemErrors] = useState(0);

  // ── GAME-LAAG: karakter-emoji + aanhitsende bubble + streak ──
  const [streak, setStreak] = useState(0);       // hoeveel reg agtermekaar
  const [charMood, setCharMood] = useState('🤔'); // huidige karakter-gesig
  const [bubble, setBubble] = useState(null);    // {text, key} - klein boodskap-bubble

  // REG-feedback woorde
  const RIGHT_WORDS = ['Mooi so!', 'Slim!', 'Reg jy!', 'Knap!', 'Genius!', 'Briljant!', 'Yes!', 'Jy weet!'];
  const STREAK_WORDS = {
    3: '3 op \'n ry! 🔥',
    5: 'Onstuitbaar! 🌟',
    7: 'Wow, jy\'s op fire! ⚡',
    10: 'Brand die sisteem! 🚀'
  };
  const SOFT_WRONG_WORDS = ['Kyk weer...', 'Amper!', 'Probeer weer', 'Net mooi dink'];

  const showBubble = (text) => {
    setBubble({ text, key: Date.now() });
    setTimeout(() => setBubble(null), 2000);
  };

  // Genereer probleme een keer
  useEffect(() => {
    const ps = [];
    for (let i = 0; i < questionCount; i++) {
      const p = generateLongDivProblem(level);
      const sol = solveLongDivision(p.dividend, p.divisor);
      ps.push({ ...p, solution: sol, grid: buildLongDivGrid(p.dividend, p.divisor, sol) });
    }
    setProblems(ps);
  }, []);

  const current = problems[currentIdx];
  if (!current) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const totalSteps = current.solution.steps.length;
  const currentStep = current.solution.steps[stepIdx];
  const expected = String(currentStep.value);

  const handleSubmit = () => {
    if (!userInput.trim() || feedback) return;
    const correct = userInput === expected;

    if (correct) {
      sounds.correct(soundOn);
      sounds.ping(soundOn); // game-laag: helder ping
      setFeedback('correct');
      setCompletedSteps(s => new Set([...s, stepIdx]));

      // ── GAME-LAAG: karakter + bubble + streak ──
      const newStreak = attempts === 0 ? streak + 1 : 1; // streak breek as hulle gestoei het
      setStreak(newStreak);
      // Karakter-gesig: eerste-tik-reg is 🤩, anders 😊
      if (newStreak >= 10) setCharMood('🚀');
      else if (newStreak >= 5) setCharMood('🦸');
      else if (newStreak >= 3) setCharMood('🔥');
      else if (attempts === 0) setCharMood('🤩');
      else setCharMood('😊');
      // Bubble: streak-boodskap as milestone, anders random reg-woord
      if (STREAK_WORDS[newStreak]) {
        showBubble(STREAK_WORDS[newStreak]);
      } else {
        showBubble(RIGHT_WORDS[Math.floor(Math.random() * RIGHT_WORDS.length)]);
      }

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        setAttempts(0);
        setShowHint(false);

        if (stepIdx + 1 >= totalSteps) {
          // Probleem klaar
          setCharMood('🥳'); // som klaar - vier
          const newResults = [...results, {
            dividend: current.dividend,
            divisor: current.divisor,
            totalSteps,
            totalErrors: problemErrors,
            answer: current.solution.quotient,
            remainder: current.solution.remainder,
            finished: true
          }];
          setResults(newResults);

          if (currentIdx + 1 >= questionCount) {
            // Alles klaar - bou results vir applyResults
            // Per "vraag" gee ons stappe wat dieselfde resultate-formaat het
            const questions = newResults.map(r => ({
              a: r.dividend,
              b: r.divisor,
              answer: r.answer,
              remainder: r.remainder,
              correct: r.totalErrors === 0,
              userAnswer: r.answer,
              timeMs: 0,
              op: '÷',
              hasRemainder: r.remainder > 0
            }));
            onComplete({ questions });
          } else {
            // Volgende probleem
            setCurrentIdx(currentIdx + 1);
            setStepIdx(0);
            setProblemErrors(0);
            setCompletedSteps(new Set());
            setCharMood('🤔'); // nuwe som - dink
          }
        } else {
          setStepIdx(stepIdx + 1);
          // Karakter "dink" weer aan volgende stap (maar nie as streak ≥ 3 is — laat hulle vlieg!)
          setTimeout(() => {
            if (newStreak < 3) setCharMood('🤔');
          }, 800);
        }
      }, 600);
    } else {
      sounds.wrong(soundOn);
      sounds.poep(soundOn); // game-laag: speelse fffrt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setProblemErrors(problemErrors + 1);
      setFeedback('wrong');

      // ── GAME-LAAG: karakter verbaas, NOOIT spot ──
      setStreak(0); // streak breek
      setCharMood('😯'); // verbaas, simpatiek
      showBubble(SOFT_WRONG_WORDS[Math.floor(Math.random() * SOFT_WRONG_WORDS.length)]);

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        if (newAttempts >= 2) {
          // Wys hint na 2de fout
          setShowHint(true);
        }
        setCharMood('🤔'); // terug na dink
      }, 900);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const giveAnswer = () => {
    // Hint kan kind antwoord wys met een tik
    setUserInput(expected);
    setTimeout(handleSubmit, 100);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={styles.questionCounter}>
            ✏️ Vlak {level} · Som {currentIdx + 1}/{questionCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onShowDemo && (
              <button onClick={onShowDemo} title="Wys voorbeeld weer" style={{
                padding: '8px 12px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7',
                border: '2px solid rgba(168, 85, 247, 0.35)',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                👀 Wys weer
              </button>
            )}
            {/* GAME-LAAG: karakter-emoji + bubble (klein dier-gesig wat reageer) */}
            <div style={{
              position: 'relative',
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease',
              transform: bubble ? 'scale(1.15)' : 'scale(1)'
            }}>
              {charMood}
              {bubble && (
                <div
                  key={bubble.key}
                  style={{
                    position: 'absolute',
                    top: -38,
                    right: 0,
                    background: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                    animation: 'bubbleUp 2s ease forwards',
                    pointerEvents: 'none',
                    zIndex: 100
                  }}
                >
                  {bubble.text}
                  <div style={{
                    position: 'absolute',
                    bottom: -5,
                    right: 14,
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1f2937'
                  }}></div>
                </div>
              )}
            </div>
            <div style={{ fontSize: 24 }}>{profile.avatar}</div>
          </div>
        </header>

        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: ((currentIdx + stepIdx / totalSteps) / questionCount * 100) + '%',
            background: '#a855f7'
          }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12, marginTop: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.dividend} ÷ {current.divisor} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongDivisionGrid
            grid={current.grid}
            fillUpTo={stepIdx - 1}
            activeStep={stepIdx}
            currentStep={currentStep}
            userInput={userInput}
            wrongFlash={feedback === 'wrong'}
            dyslexiaMode={profile.dyslexiaMode}
          />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '2px solid ' + (feedback === 'wrong' ? 'rgba(239,68,68,0.4)' :
                                   feedback === 'correct' ? 'rgba(16,185,129,0.4)' :
                                   'rgba(168, 85, 247, 0.25)'),
          borderRadius: 14,
          padding: 14,
          marginBottom: 12,
          minHeight: 70
        }}>
          {feedback === 'correct' && (
            <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981', textAlign: 'center' }}>
              ✓ Reg! Op die volgende stap →
            </div>
          )}
          {feedback === 'wrong' && (
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', textAlign: 'center' }}>
              {attempts === 1 ? '✗ Probeer weer!' : '✗ Hou kop, kyk hint hieronder.'}
            </div>
          )}
          {!feedback && !showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#a855f7', marginBottom: 6 }}>
                STAP {stepIdx + 1} VAN {totalSteps}
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
                {currentStep.shortHint ? `Vraag: ${currentStep.hint}` : currentStep.hint}
              </div>
            </>
          )}
          {!feedback && showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>
                💡 HULP
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5, marginBottom: 8 }}>
                {currentStep.shortHint || currentStep.hint}
              </div>
              <button onClick={giveAnswer} style={{
                padding: '6px 14px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Gee my die antwoord vir hierdie stap
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              ...styles.answerInput,
              fontSize: 36,
              width: 130,
              textAlign: 'center',
              opacity: feedback ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
              color: userInput ? '#1f2937' : '#cbd5e1',
              cursor: 'default'
            }}>
            {userInput || '?'}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || !!feedback}
            style={styles.submitBtn}>
            Stuur
          </button>
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setUserInput(userInput + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setUserInput(userInput.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setUserInput(userInput + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!userInput.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ DEMO SKERM (Lang Maal) ═══════════════
function LongMultDemoScreen({ profile, level, soundOn, onContinue, onSkip }) {
  const skill = SUBJECTS.mult.papermethod.levels[level - 1] || SUBJECTS.mult.papermethod.levels[0];
  const [problems] = useState(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      const p = generateLongMultProblem(level);
      const sol = solveLongMultiplication(p.a, p.b);
      const grid = buildLongMultGrid(p.a, p.b, sol);
      arr.push({ ...p, solution: sol, grid });
    }
    return arr;
  });

  const PAUSE_MS = 5000; // 5s outo-progress (stadiger vir Gr1)

  const [exampleIdx, setExampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [paused, setPaused] = useState(false);

  const current = problems[exampleIdx];
  const totalSteps = current.solution.steps.length;

  useEffect(() => {
    if (paused) return;
    if (stepIdx >= totalSteps - 1) return;
    const timer = setTimeout(() => {
      setStepIdx(s => s + 1);
      sounds.click(soundOn);
    }, PAUSE_MS);
    return () => clearTimeout(timer);
  }, [stepIdx, paused, totalSteps, soundOn]);

  const currentStep = stepIdx >= 0 ? current.solution.steps[stepIdx] : null;
  const finishedExample = stepIdx >= totalSteps - 1;
  const isLastExample = exampleIdx >= problems.length - 1;
  const isFirstExample = exampleIdx === 0;
  const finishedAll = finishedExample && isLastExample;

  const goNextStep = () => {
    if (stepIdx < totalSteps - 1) {
      sounds.click(soundOn);
      setStepIdx(s => s + 1);
    }
  };
  const goPrevStep = () => {
    if (stepIdx >= 0) {
      sounds.click(soundOn);
      setStepIdx(s => s - 1);
    }
  };
  const goNextExample = () => {
    sounds.click(soundOn);
    setExampleIdx(i => i + 1);
    setStepIdx(-1);
    setPaused(false);
  };
  const goPrevExample = () => {
    if (exampleIdx > 0) {
      sounds.click(soundOn);
      setExampleIdx(i => i - 1);
      setStepIdx(-1);
      setPaused(false);
    }
  };

  // Operasie-simbool per stap (vir badge in uitleg-boks)
  let opSymbol = null, opLabel = null, opColor = null;
  if (currentStep) {
    if (currentStep.type === 'mult_digit') { opSymbol = '×'; opLabel = 'MAAL'; opColor = '#3b82f6'; }
    else if (currentStep.type === 'final_sum') { opSymbol = '+'; opLabel = 'TEL SAAM'; opColor = '#10b981'; }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onSkip} style={styles.backBtn}>✕ Uit</button>
          <div style={styles.questionCounter}>✏️ Voorbeeld {exampleIdx + 1}/3 · Vlak {level}</div>
          <div style={{ fontSize: 24 }}>{profile.avatar}</div>
        </header>

        <div style={{
          background: 'rgba(14, 165, 233, 0.1)',
          border: '2px solid rgba(14, 165, 233, 0.3)',
          borderRadius: 16,
          padding: 14,
          marginBottom: 14,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0ea5e9', marginBottom: 4 }}>
            👀 KYK HOE EK DIT DOEN
          </div>
          <div style={{ fontSize: 12, color: '#374151' }}>
            {exampleIdx === 0
              ? 'Eerste voorbeeld — kyk mooi na elke stap.'
              : exampleIdx === 1
              ? 'Tweede voorbeeld — sien jy die patroon?'
              : 'Derde voorbeeld — daarna oefen jy self.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          {problems.map((_, i) => (
            <div key={i} style={{
              width: i === exampleIdx ? 26 : 12,
              height: 12,
              borderRadius: 6,
              background: i < exampleIdx ? '#10b981' : i === exampleIdx ? '#0ea5e9' : 'rgba(0,0,0,0.15)',
              transition: 'all 0.3s'
            }}></div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.a} × {current.b} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongMultGrid
            grid={current.grid}
            fillUpTo={stepIdx}
            activeStep={!finishedExample ? stepIdx + 1 : -1}
            currentStep={!finishedExample ? current.solution.steps[stepIdx + 1] : null}
            userInput=""
            wrongFlash={false}
            dyslexiaMode={profile.dyslexiaMode}
          />
        </div>

        {currentStep && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid rgba(14, 165, 233, 0.25)',
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
            minHeight: 70
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9' }}>
                STAP {stepIdx + 1} VAN {totalSteps}
              </div>
              {opSymbol && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  background: opColor + '22',
                  color: opColor,
                  borderRadius: 999,
                  fontWeight: 900,
                  fontSize: 13,
                  border: `2px solid ${opColor}55`
                }}>
                  <span style={{ fontSize: 18 }}>{opSymbol}</span>
                  {opLabel}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
              {currentStep.explanation}
            </div>
          </div>
        )}

        {/* NAVIGASIE-KNOPPIES */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <button onClick={goPrevStep} disabled={stepIdx < 0} style={{
            padding: '10px 16px',
            background: stepIdx < 0 ? 'rgba(0,0,0,0.05)' : 'rgba(14,165,233,0.15)',
            color: stepIdx < 0 ? '#9ca3af' : '#0ea5e9',
            border: stepIdx < 0 ? '2px solid rgba(0,0,0,0.05)' : '2px solid rgba(14,165,233,0.35)',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: stepIdx < 0 ? 'not-allowed' : 'pointer'
          }}>
            ← Terug
          </button>
          <button onClick={() => setPaused(p => !p)} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : (paused ? '#10b981' : '#f59e0b'),
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>
            {paused ? '▶ Gaan voort' : '⏸ Wag'}
          </button>
          <button onClick={goNextStep} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : '#0ea5e9',
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>
            Volgende stap →
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {!isFirstExample && (
            <button onClick={goPrevExample} style={{
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.85)',
              color: '#374151',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              ⤺ Vorige voorbeeld
            </button>
          )}
          {finishedExample && !isLastExample && (
            <button onClick={goNextExample} style={{
              padding: '12px 22px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)'
            }}>
              Volgende voorbeeld →
            </button>
          )}
          {finishedAll && (
            <button onClick={onContinue} style={{
              padding: '12px 24px',
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(14,165,233,0.35)'
            }}>
              ✓ Ek verstaan — probeer self
            </button>
          )}
        </div>

        {finishedExample && (
          <div style={{
            marginTop: 8,
            padding: 12,
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid rgba(16,185,129,0.3)',
            borderRadius: 14,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#065f46' }}>
              {current.a} × {current.b} = {current.solution.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ PRAKTYK SKERM (Lang Maal) ═══════════════
function LongMultScreen({ profile, level, questionCount, soundOn, onComplete, onQuit, onShowDemo }) {
  const skill = SUBJECTS.mult.papermethod.levels[level - 1] || SUBJECTS.mult.papermethod.levels[0];
  const [problems, setProblems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [problemErrors, setProblemErrors] = useState(0);

  useEffect(() => {
    const ps = [];
    for (let i = 0; i < questionCount; i++) {
      const p = generateLongMultProblem(level);
      const sol = solveLongMultiplication(p.a, p.b);
      ps.push({ ...p, solution: sol, grid: buildLongMultGrid(p.a, p.b, sol) });
    }
    setProblems(ps);
  }, []);

  const current = problems[currentIdx];
  if (!current) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const totalSteps = current.solution.steps.length;
  const currentStep = current.solution.steps[stepIdx];
  const expected = String(currentStep.value);

  const handleSubmit = () => {
    if (!userInput.trim() || feedback) return;
    const correct = userInput === expected;

    if (correct) {
      sounds.correct(soundOn);
      setFeedback('correct');

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        setAttempts(0);
        setShowHint(false);

        if (stepIdx + 1 >= totalSteps) {
          const newResults = [...results, {
            a: current.a, b: current.b,
            totalSteps, totalErrors: problemErrors,
            answer: current.solution.answer,
            finished: true
          }];
          setResults(newResults);

          if (currentIdx + 1 >= questionCount) {
            const questions = newResults.map(r => ({
              a: r.a, b: r.b,
              answer: r.answer,
              correct: r.totalErrors === 0,
              userAnswer: r.answer,
              timeMs: 0,
              op: '×'
            }));
            onComplete({ questions });
          } else {
            setCurrentIdx(currentIdx + 1);
            setStepIdx(0);
            setProblemErrors(0);
          }
        } else {
          setStepIdx(stepIdx + 1);
        }
      }, 600);
    } else {
      sounds.wrong(soundOn);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setProblemErrors(problemErrors + 1);
      setFeedback('wrong');

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        if (newAttempts >= 2) setShowHint(true);
      }, 900);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const giveAnswer = () => {
    setUserInput(expected);
    setTimeout(handleSubmit, 100);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={styles.questionCounter}>
            ✏️ Vlak {level} · Som {currentIdx + 1}/{questionCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onShowDemo && (
              <button onClick={onShowDemo} title="Wys voorbeeld weer" style={{
                padding: '8px 12px',
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#0ea5e9',
                border: '2px solid rgba(14, 165, 233, 0.35)',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                👀 Wys weer
              </button>
            )}
            <div style={{ fontSize: 24 }}>{profile.avatar}</div>
          </div>
        </header>

        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: ((currentIdx + stepIdx / totalSteps) / questionCount * 100) + '%',
            background: '#0ea5e9'
          }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12, marginTop: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.a} × {current.b} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongMultGrid
            grid={current.grid}
            fillUpTo={stepIdx - 1}
            activeStep={stepIdx}
            currentStep={currentStep}
            userInput={userInput}
            wrongFlash={feedback === 'wrong'}
            dyslexiaMode={profile.dyslexiaMode}
          />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '2px solid ' + (feedback === 'wrong' ? 'rgba(239,68,68,0.4)' :
                                   feedback === 'correct' ? 'rgba(16,185,129,0.4)' :
                                   'rgba(14, 165, 233, 0.25)'),
          borderRadius: 14,
          padding: 14,
          marginBottom: 12,
          minHeight: 70
        }}>
          {feedback === 'correct' && (
            <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981', textAlign: 'center' }}>
              ✓ Reg! Op die volgende stap →
            </div>
          )}
          {feedback === 'wrong' && (
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', textAlign: 'center' }}>
              {attempts === 1 ? '✗ Probeer weer!' : '✗ Hou kop, kyk hint hieronder.'}
            </div>
          )}
          {!feedback && !showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', marginBottom: 6 }}>
                STAP {stepIdx + 1} VAN {totalSteps} · {currentStep.stepName}
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
                {currentStep.hint}
              </div>
            </>
          )}
          {!feedback && showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>
                💡 HULP
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5, marginBottom: 8 }}>
                {currentStep.shortHint}
              </div>
              <button onClick={giveAnswer} style={{
                padding: '6px 14px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Gee my die antwoord vir hierdie stap
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              ...styles.answerInput,
              fontSize: 36,
              width: 160,
              textAlign: 'center',
              opacity: feedback ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
              color: userInput ? '#1f2937' : '#cbd5e1',
              cursor: 'default'
            }}>
            {userInput || '?'}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || !!feedback}
            style={styles.submitBtn}>
            Stuur
          </button>
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setUserInput(userInput + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setUserInput(userInput.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setUserInput(userInput + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!userInput.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ DEMO SKERM (Lang Optel/Aftrek - generies) ═══════════════
// Een komponent wat beide lang optel en lang aftrek hanteer.
// `kind` = 'add' of 'sub'
function LongAddSubDemoScreen({ profile, level, kind, soundOn, onContinue, onSkip }) {
  const isAdd = kind === 'add';
  const subjectKey = isAdd ? 'add' : 'sub';
  const opSymbol = isAdd ? '+' : '−';
  const themeColor = isAdd ? '#22c55e' : '#6366f1';
  const skill = SUBJECTS[subjectKey].papermethod.levels[level - 1] || SUBJECTS[subjectKey].papermethod.levels[0];

  const [problems] = useState(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      const p = isAdd ? generateLongAddProblem(level) : generateLongSubProblem(level);
      const sol = isAdd ? solveLongAdd(p.a, p.b) : solveLongSub(p.a, p.b);
      const grid = buildLongAddSubGrid(p.a, p.b, sol, opSymbol);
      arr.push({ ...p, solution: sol, grid });
    }
    return arr;
  });

  const PAUSE_MS = 5000; // 5s outo-progress (stadiger vir Gr1)
  const [exampleIdx, setExampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [paused, setPaused] = useState(false);

  const current = problems[exampleIdx];
  const totalSteps = current.solution.steps.length;

  useEffect(() => {
    if (paused) return;
    if (stepIdx >= totalSteps - 1) return;
    const timer = setTimeout(() => {
      setStepIdx(s => s + 1);
      sounds.click(soundOn);
    }, PAUSE_MS);
    return () => clearTimeout(timer);
  }, [stepIdx, paused, totalSteps, soundOn]);

  const currentStep = stepIdx >= 0 ? current.solution.steps[stepIdx] : null;
  const finishedExample = stepIdx >= totalSteps - 1;
  const isLastExample = exampleIdx >= problems.length - 1;
  const isFirstExample = exampleIdx === 0;
  const finishedAll = finishedExample && isLastExample;

  const goNextStep = () => { if (stepIdx < totalSteps - 1) { sounds.click(soundOn); setStepIdx(s => s + 1); } };
  const goPrevStep = () => { if (stepIdx >= 0) { sounds.click(soundOn); setStepIdx(s => s - 1); } };
  const goNextExample = () => { sounds.click(soundOn); setExampleIdx(i => i + 1); setStepIdx(-1); setPaused(false); };
  const goPrevExample = () => { if (exampleIdx > 0) { sounds.click(soundOn); setExampleIdx(i => i - 1); setStepIdx(-1); setPaused(false); } };

  // Operasie-info vir badge
  let badgeOp = null, badgeLabel = null, badgeColor = null;
  if (currentStep) {
    if (isAdd) { badgeOp = '+'; badgeLabel = 'TEL OP'; badgeColor = '#22c55e'; }
    else if (currentStep.wasBorrowed) { badgeOp = '↘'; badgeLabel = 'LEEN!'; badgeColor = '#f59e0b'; }
    else { badgeOp = '−'; badgeLabel = 'TREK AF'; badgeColor = '#6366f1'; }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onSkip} style={styles.backBtn}>✕ Uit</button>
          <div style={styles.questionCounter}>✏️ Voorbeeld {exampleIdx + 1}/3 · Vlak {level}</div>
          <div style={{ fontSize: 24 }}>{profile.avatar}</div>
        </header>

        <div style={{
          background: `${themeColor}1a`,
          border: `2px solid ${themeColor}55`,
          borderRadius: 16,
          padding: 14,
          marginBottom: 14,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: themeColor, marginBottom: 4 }}>
            👀 KYK HOE EK DIT DOEN
          </div>
          <div style={{ fontSize: 12, color: '#374151' }}>
            {exampleIdx === 0 ? 'Eerste voorbeeld — kyk mooi na elke stap.'
              : exampleIdx === 1 ? 'Tweede voorbeeld — sien jy die patroon?'
              : 'Derde voorbeeld — daarna oefen jy self.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          {problems.map((_, i) => (
            <div key={i} style={{
              width: i === exampleIdx ? 26 : 12,
              height: 12,
              borderRadius: 6,
              background: i < exampleIdx ? '#10b981' : i === exampleIdx ? themeColor : 'rgba(0,0,0,0.15)',
              transition: 'all 0.3s'
            }}></div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.a} {opSymbol} {current.b} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongAddSubGrid
            grid={current.grid}
            fillUpTo={stepIdx}
            activeStep={!finishedExample ? stepIdx + 1 : -1}
            currentStep={!finishedExample ? current.solution.steps[stepIdx + 1] : null}
            userInput=""
            wrongFlash={false}
            dyslexiaMode={profile.dyslexiaMode}
            themeColor={themeColor}
          />
        </div>

        {currentStep && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            border: `2px solid ${themeColor}40`,
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
            minHeight: 70
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: themeColor }}>
                STAP {stepIdx + 1} VAN {totalSteps}
              </div>
              {badgeOp && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  background: badgeColor + '22',
                  color: badgeColor,
                  borderRadius: 999,
                  fontWeight: 900,
                  fontSize: 13,
                  border: `2px solid ${badgeColor}55`
                }}>
                  <span style={{ fontSize: 18 }}>{badgeOp}</span>
                  {badgeLabel}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
              {currentStep.explanation}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <button onClick={goPrevStep} disabled={stepIdx < 0} style={{
            padding: '10px 16px',
            background: stepIdx < 0 ? 'rgba(0,0,0,0.05)' : `${themeColor}26`,
            color: stepIdx < 0 ? '#9ca3af' : themeColor,
            border: stepIdx < 0 ? '2px solid rgba(0,0,0,0.05)' : `2px solid ${themeColor}55`,
            borderRadius: 10, fontSize: 13, fontWeight: 800,
            cursor: stepIdx < 0 ? 'not-allowed' : 'pointer'
          }}>← Terug</button>
          <button onClick={() => setPaused(p => !p)} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : (paused ? '#10b981' : '#f59e0b'),
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>{paused ? '▶ Gaan voort' : '⏸ Wag'}</button>
          <button onClick={goNextStep} disabled={finishedExample} style={{
            padding: '10px 16px',
            background: finishedExample ? 'rgba(0,0,0,0.05)' : themeColor,
            color: finishedExample ? '#9ca3af' : 'white',
            border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800,
            cursor: finishedExample ? 'not-allowed' : 'pointer'
          }}>Volgende stap →</button>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {!isFirstExample && (
            <button onClick={goPrevExample} style={{
              padding: '10px 18px',
              background: 'rgba(255,255,255,0.85)',
              color: '#374151',
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}>⤺ Vorige voorbeeld</button>
          )}
          {finishedExample && !isLastExample && (
            <button onClick={goNextExample} style={{
              padding: '12px 22px',
              background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59,130,246,0.35)'
            }}>Volgende voorbeeld →</button>
          )}
          {finishedAll && (
            <button onClick={onContinue} style={{
              padding: '12px 24px',
              background: themeColor, color: 'white',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 900, cursor: 'pointer',
              boxShadow: `0 4px 14px ${themeColor}55`
            }}>✓ Ek verstaan — probeer self</button>
          )}
        </div>

        {finishedExample && (
          <div style={{
            marginTop: 8,
            padding: 12,
            background: 'rgba(16,185,129,0.1)',
            border: '2px solid rgba(16,185,129,0.3)',
            borderRadius: 14,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#065f46' }}>
              {current.a} {opSymbol} {current.b} = {current.solution.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════ PRAKTYK SKERM (Lang Optel/Aftrek - generies) ═══════════════
function LongAddSubScreen({ profile, level, kind, questionCount, soundOn, onComplete, onQuit, onShowDemo }) {
  const isAdd = kind === 'add';
  const subjectKey = isAdd ? 'add' : 'sub';
  const opSymbol = isAdd ? '+' : '−';
  const themeColor = isAdd ? '#22c55e' : '#6366f1';
  const skill = SUBJECTS[subjectKey].papermethod.levels[level - 1] || SUBJECTS[subjectKey].papermethod.levels[0];

  const [problems, setProblems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [problemErrors, setProblemErrors] = useState(0);

  useEffect(() => {
    const ps = [];
    for (let i = 0; i < questionCount; i++) {
      const p = isAdd ? generateLongAddProblem(level) : generateLongSubProblem(level);
      const sol = isAdd ? solveLongAdd(p.a, p.b) : solveLongSub(p.a, p.b);
      ps.push({ ...p, solution: sol, grid: buildLongAddSubGrid(p.a, p.b, sol, opSymbol) });
    }
    setProblems(ps);
  }, []);

  const current = problems[currentIdx];
  if (!current) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const totalSteps = current.solution.steps.length;
  const currentStep = current.solution.steps[stepIdx];
  const expected = String(currentStep.value);

  const handleSubmit = () => {
    if (!userInput.trim() || feedback) return;
    const correct = userInput === expected;

    if (correct) {
      sounds.correct(soundOn);
      setFeedback('correct');

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        setAttempts(0);
        setShowHint(false);

        if (stepIdx + 1 >= totalSteps) {
          const newResults = [...results, {
            a: current.a, b: current.b,
            totalErrors: problemErrors,
            answer: current.solution.answer,
            finished: true
          }];
          setResults(newResults);

          if (currentIdx + 1 >= questionCount) {
            const questions = newResults.map(r => ({
              a: r.a, b: r.b,
              answer: r.answer,
              correct: r.totalErrors === 0,
              userAnswer: r.answer,
              timeMs: 0,
              op: opSymbol
            }));
            onComplete({ questions });
          } else {
            setCurrentIdx(currentIdx + 1);
            setStepIdx(0);
            setProblemErrors(0);
          }
        } else {
          setStepIdx(stepIdx + 1);
        }
      }, 600);
    } else {
      sounds.wrong(soundOn);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setProblemErrors(problemErrors + 1);
      setFeedback('wrong');

      setTimeout(() => {
        setFeedback(null);
        setUserInput('');
        if (newAttempts >= 2) setShowHint(true);
      }, 900);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };
  const giveAnswer = () => { setUserInput(expected); setTimeout(handleSubmit, 100); };

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={styles.questionCounter}>
            ✏️ Vlak {level} · Som {currentIdx + 1}/{questionCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onShowDemo && (
              <button onClick={onShowDemo} title="Wys voorbeeld weer" style={{
                padding: '8px 12px',
                background: `${themeColor}26`,
                color: themeColor,
                border: `2px solid ${themeColor}55`,
                borderRadius: 10,
                fontSize: 12, fontWeight: 800,
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}>👀 Wys weer</button>
            )}
            <div style={{ fontSize: 24 }}>{profile.avatar}</div>
          </div>
        </header>

        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: ((currentIdx + stepIdx / totalSteps) / questionCount * 100) + '%',
            background: themeColor
          }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12, marginTop: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1f2937', fontFamily: 'monospace' }}>
            {current.a} {opSymbol} {current.b} = ?
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <LongAddSubGrid
            grid={current.grid}
            fillUpTo={stepIdx - 1}
            activeStep={stepIdx}
            currentStep={currentStep}
            userInput={userInput}
            wrongFlash={feedback === 'wrong'}
            dyslexiaMode={profile.dyslexiaMode}
            themeColor={themeColor}
          />
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)',
          border: '2px solid ' + (feedback === 'wrong' ? 'rgba(239,68,68,0.4)' :
                                   feedback === 'correct' ? 'rgba(16,185,129,0.4)' :
                                   `${themeColor}40`),
          borderRadius: 14,
          padding: 14,
          marginBottom: 12,
          minHeight: 70
        }}>
          {feedback === 'correct' && (
            <div style={{ fontSize: 16, fontWeight: 900, color: '#10b981', textAlign: 'center' }}>
              ✓ Reg! Op die volgende stap →
            </div>
          )}
          {feedback === 'wrong' && (
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', textAlign: 'center' }}>
              {attempts === 1 ? '✗ Probeer weer!' : '✗ Hou kop, kyk hint hieronder.'}
            </div>
          )}
          {!feedback && !showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: themeColor, marginBottom: 6 }}>
                STAP {stepIdx + 1} VAN {totalSteps} · {currentStep.stepName}
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5 }}>
                {currentStep.hint}
              </div>
            </>
          )}
          {!feedback && showHint && (
            <>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>
                💡 HULP
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.5, marginBottom: 8 }}>
                {currentStep.shortHint}
              </div>
              <button onClick={giveAnswer} style={{
                padding: '6px 14px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Gee my die antwoord vir hierdie stap
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              ...styles.answerInput,
              fontSize: 36,
              width: 130,
              textAlign: 'center',
              opacity: feedback ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 60,
              color: userInput ? '#1f2937' : '#cbd5e1',
              cursor: 'default'
            }}>
            {userInput || '?'}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || !!feedback}
            style={styles.submitBtn}>
            Stuur
          </button>
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setUserInput(userInput + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setUserInput(userInput.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setUserInput(userInput + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!userInput.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ SPRINT SCREEN (60-SEK WEDREN) ═══════════════
function SprintScreen({ profile, subjectId, duration, soundOn, onComplete, onQuit }) {
  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionStart, setQuestionStart] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const subject = SUBJECTS[subjectId];
  // Vir wedren: gebruik die hoogste vlak wat oop is vir hierdie kind in hierdie vak
  const sprintLevel = getCurrentSkillLevel(profile, subjectId);
  const prevRecord = (profile.sprintRecords || {})[subjectId] || 0;

  // Countdown 3-2-1-GO
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown > 0) {
      sounds.countdown(soundOn);
      const t = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(t);
    } else {
      sounds.start(soundOn);
      setPhase('playing');
      setCurrentQ(generateQuestion(profile, subjectId, sprintLevel));
      setQuestionStart(Date.now());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, countdown]);

  // Spel timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      sounds.timeUp(soundOn);
      setPhase('done');
      setTimeout(() => onComplete(score, results), 600);
      return;
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft(t => {
        const newT = +(t - 0.1).toFixed(1);
        if (newT > 0 && newT <= 5 && Math.abs(newT - Math.floor(newT)) < 0.05) {
          sounds.tick(soundOn);
        }
        return newT;
      });
    }, 100);
    return () => clearTimeout(timerRef.current);
  }, [phase, timeLeft, score, results]);

  const handleSubmit = () => {
    if (!input.trim() || feedback || phase !== 'playing') return;
    const ans = parseInt(input, 10);
    // Wedren: ignoreer restant - net hoofantwoord vir spoed
    const correct = ans === currentQ.answer;
    const timeMs = Date.now() - questionStart;

    if (correct) sounds.correct(soundOn);
    else sounds.wrong(soundOn);

    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);

    setResults(r => [...r, { ...currentQ, userAnswer: ans, correct, timeMs }]);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (timeLeft > 0.2) {
        setCurrentQ(generateQuestion(profile, subjectId, sprintLevel));
        setQuestionStart(Date.now());
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, correct ? 250 : 600);
  };

  if (phase === 'countdown') {
    const showText = countdown > 0 ? countdown : 'BEGIN!';
    return (
      <div style={styles.screen}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <h1 style={{ fontSize: 24, color: '#6b7280', marginBottom: 12, fontWeight: 700 }}>
              ⚡ 60-SEKONDE WEDREN ⚡
            </h1>
            <div style={{ fontSize: 32, color: subject.color, marginBottom: 24, fontWeight: 900, fontFamily: 'Georgia, serif' }}>
              {subject.emoji} {subject.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 24, color: '#374151', marginBottom: 16, fontWeight: 600 }}>
              {profile.avatar} {profile.name}
            </div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 48 }}>
              Hoeveel kan jy in 60 sekondes regkry?<br/>
              Jou rekord: <strong>{prevRecord}</strong>
            </div>
            <div style={{
              fontSize: 200,
              fontWeight: 900,
              color: countdown === 0 ? '#10b981' : subject.color,
              fontFamily: 'Georgia, serif',
              animation: 'pop 0.4s ease-out',
              lineHeight: 1
            }}>
              {showText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done' || !currentQ) {
    return (
      <div style={styles.screen}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 100, marginBottom: 16 }}>⏱️</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Georgia, serif' }}>TYD OP!</h1>
            <p style={{ fontSize: 18, color: '#6b7280', marginTop: 12 }}>Telling word bereken...</p>
          </div>
        </div>
      </div>
    );
  }

  const numLength = String(currentQ.a).length + String(currentQ.b).length;
  const baseFontSize = profile.dyslexiaMode ? 80 : 64;
  const fontSize = numLength > 4 ? Math.max(36, baseFontSize - (numLength - 4) * 8) : baseFontSize;
  const timePct = (timeLeft / duration) * 100;
  const timerColor = timePct > 50 ? '#10b981' : timePct > 20 ? '#f59e0b' : '#ef4444';

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {subject.emoji} {subject.name}
          </div>
          <div style={{ fontWeight: 800, fontSize: 22, color: '#10b981' }}>{score}</div>
        </header>

        <div style={{ ...styles.timerBar, background: '#e5e7eb', height: 16 }}>
          <div style={{ ...styles.timerFill, width: timePct + '%', background: timerColor }}></div>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 32, color: timerColor, marginTop: 8, fontFamily: 'Georgia, serif' }}>
          {timeLeft.toFixed(1)}s
        </div>

        <div style={styles.gameStatBar}>
          <div>⭐ Telling: <strong>{score}</strong></div>
          <div>🏆 Rekord: <strong>{prevRecord}</strong></div>
        </div>

        <div style={styles.questionBox}>
          {feedback === 'correct' && <div style={styles.feedbackCorrect}>✓</div>}
          {feedback === 'wrong' && (
            <div style={styles.feedbackWrong}>
              {currentQ.answer}{currentQ.hasRemainder ? ` res ${currentQ.remainder}` : ''}
            </div>
          )}

          <div style={{ ...styles.question, fontSize }}>
            <span>{currentQ.a}</span>
            <span style={{ color: subject.color, margin: '0 16px' }}>{currentQ.op}</span>
            <span>{currentQ.b}</span>
            <span style={{ color: '#6b7280', margin: '0 16px' }}>=</span>
            <span style={{ color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : subject.color }}>
              {input || '?'}
            </span>
          </div>

          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={!!feedback}
            style={{ ...styles.answerInput, fontSize: 48 }}
            placeholder="?"
          />
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setInput(input + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setInput(input.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setInput(input + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!input.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ SPRINT RESULTS ═══════════════
function SprintResults({ profile, subjectId, score, results, isNewRecord, prevRecord, soundOn, onContinue }) {
  useEffect(() => {
    if (isNewRecord && score > 0) {
      sounds.celebration(soundOn);
    } else if (score > 0) {
      sounds.levelUp(soundOn);
    }
  }, []);

  const subject = SUBJECTS[subjectId] || SUBJECTS.mult;
  const correctCount = results.filter(r => r.correct).length;
  const wrongCount = results.filter(r => !r.correct).length;

  const message = isNewRecord ? '🏆 NUWE REKORD!'
    : score >= 30 ? '🚀 Pragtig vinnig!'
    : score >= 20 ? '⭐ Lekker werk!'
    : score >= 10 ? '👍 Goed gedoen!'
    : '💪 Probeer weer!';

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <div style={styles.resultHero}>
          <div style={{ fontSize: 80 }}>{profile.avatar}</div>
          <h1 style={styles.resultTitle}>{message}</h1>
          <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 700, marginTop: 8 }}>
            {subject.emoji} {subject.name.toUpperCase()} · 60 SEKONDES
          </div>
          <div style={{ ...styles.resultScore, color: subject.color }}>{score}</div>
          <div style={styles.resultPct}>vrae reg</div>
          {isNewRecord && (
            <div style={{
              marginTop: 16,
              display: 'inline-block',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: 'white',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 16,
              animation: 'pulse 1s ease-in-out infinite'
            }}>
              ⭐ Vorige rekord: {prevRecord || 0} ⭐
            </div>
          )}
        </div>

        <div style={styles.resultDetails}>
          <h3 style={{ fontSize: 14, color: '#6b7280', fontWeight: 700, marginBottom: 12 }}>OPSOMMING</h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{correctCount}</div>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>REG</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'rgba(239,68,68,0.1)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>{wrongCount}</div>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>VERKEERD</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: 'rgba(59,130,246,0.1)', borderRadius: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{results.length}</div>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>TOTAAL</div>
            </div>
          </div>

          {wrongCount > 0 && (
            <>
              <h3 style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, marginBottom: 8, marginTop: 16 }}>FOUTE OM TE OEFEN</h3>
              <div style={styles.resultGrid}>
                {results.filter(r => !r.correct).map((q, i) => (
                  <div key={i} style={{
                    ...styles.resultItem,
                    background: 'rgba(239,68,68,0.1)',
                    borderColor: '#ef4444'
                  }}>
                    <div style={{ fontWeight: 700 }}>{q.a} {q.op} {q.b}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      = <strong>{q.answer}{q.hasRemainder ? ` r${q.remainder}` : ''}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button onClick={onContinue} style={{ ...styles.btnPrimary, marginTop: 24, width: '100%' }}>
          Klaar
        </button>
      </div>
    </div>
  );
}

// ═══════════════ RESULTS SCREEN (DAILY) ═══════════════
function ResultsScreen({ profile, subjectId, level, results, soundOn, onContinue, onDone }) {
  const correct = results.questions.filter(q => q.correct).length;
  const total = results.questions.length;
  const pct = Math.round((correct / total) * 100);

  // Hanteer paper-method (longdiv, longmult) — wys onder die hoof-vak (Deel/Maal) maar gebruik paper-method skill name
  let subject, skill;
  if (subjectId === 'longdiv') {
    subject = {
      ...SUBJECTS.div,
      name: 'Staartdeling',
      emoji: '✏️',
      color: '#a855f7'
    };
    skill = SUBJECTS.div.papermethod.levels[level - 1] || SUBJECTS.div.papermethod.levels[0];
  } else if (subjectId === 'longmult') {
    subject = {
      ...SUBJECTS.mult,
      name: 'Lang Maal',
      emoji: '✏️',
      color: '#0ea5e9'
    };
    skill = SUBJECTS.mult.papermethod.levels[level - 1] || SUBJECTS.mult.papermethod.levels[0];
  } else if (subjectId === 'longadd') {
    subject = {
      ...SUBJECTS.add,
      name: 'Lang Optel',
      emoji: '✏️',
      color: '#22c55e'
    };
    skill = SUBJECTS.add.papermethod.levels[level - 1] || SUBJECTS.add.papermethod.levels[0];
  } else if (subjectId === 'longsub') {
    subject = {
      ...SUBJECTS.sub,
      name: 'Lang Aftrek',
      emoji: '✏️',
      color: '#6366f1'
    };
    skill = SUBJECTS.sub.papermethod.levels[level - 1] || SUBJECTS.sub.papermethod.levels[0];
  } else {
    subject = SUBJECTS[subjectId] || SUBJECTS.mult;
    skill = subject.skills[level - 1] || subject.skills[0];
  }

  // Kontrolleer of die kind nou hierdie vlak bemeester het (na hierdie sessie)
  const justMastered = isSkillMastered(profile, subjectId, level);

  useEffect(() => {
    if (pct >= 90) sounds.celebration(soundOn);
    else if (pct >= 70) sounds.levelUp(soundOn);
  }, []);

  const message = pct >= 90 ? 'Pragtig! 🌟'
    : pct >= 70 ? 'Lekker werk!'
    : pct >= 50 ? 'Hou aan oefen!'
    : 'Volgende keer beter!';

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <div style={styles.resultHero}>
          <div style={{ fontSize: 80 }}>{profile.avatar}</div>
          <h1 style={styles.resultTitle}>{message}</h1>
          <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 700, marginTop: 8 }}>
            {subject.emoji} {subject.name.toUpperCase()} · VLAK {level}
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{skill.name}</div>
          <div style={{ ...styles.resultScore, color: subject.color }}>{correct}<span style={{ fontSize: 30, opacity: 0.6 }}> / {total}</span></div>
          <div style={styles.resultPct}>{pct}% reg</div>
          {justMastered && (
            <div style={{
              marginTop: 16,
              display: 'inline-block',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 16,
              animation: 'pulse 1s ease-in-out infinite'
            }}>
              🎉 VLAK BEMEESTER! 🎉
            </div>
          )}
        </div>

        <div style={styles.resultDetails}>
          <h3 style={{ fontSize: 14, color: '#6b7280', fontWeight: 700, marginBottom: 12 }}>JOU ANTWOORDE</h3>
          <div style={styles.resultGrid}>
            {results.questions.map((q, i) => (
              <div key={i} style={{
                ...styles.resultItem,
                background: q.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                borderColor: q.correct ? '#10b981' : '#ef4444'
              }}>
                <div style={{ fontWeight: 700 }}>{q.a} {q.op} {q.b}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  Jou: {q.userAnswer == null ? '—' : q.userAnswer}{q.hasRemainder && q.userRemainder != null ? ` r${q.userRemainder}` : ''}
                  {!q.correct && ` (reg: ${q.answer}${q.hasRemainder ? ` r${q.remainder}` : ''})`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={onContinue} style={{ ...styles.btnPrimary, flex: 1 }}>
            Speel weer
          </button>
          <button onClick={onDone} style={{ ...styles.btnSecondary, flex: 1 }}>
            Terug
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ FRIDAY GAME PICKER ═══════════════
function FridayScreen({ profiles, settings, soundOn, onStartGame, onBack }) {
  const [selected, setSelected] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [mode, setMode] = useState(null);

  const togglePlayer = (id) => {
    sounds.click(soundOn);
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const players = selected.map(id => profiles.find(p => p.id === id)).filter(Boolean);

  const canStart = subjectId && (
    mode === 'personalBest' ? players.length >= 1
    : mode === 'handicap' ? players.length >= 2
    : mode === 'team' ? players.length >= 2
    : false
  );

  // Bepaal watter vakke beskikbaar is - 'n vak is beskikbaar as ALLE gekose spelers ten minste
  // Vlak 1 daarvoor kan speel (deel is geblokkeer tot 2× tafel bemeester)
  const subjectAvailable = (sid) => {
    if (players.length === 0) return true;
    const subject = SUBJECTS[sid];
    if (subject.requiresMultLevel) {
      // Almal moet 2× tafel bemeester het, anders kan hulle nie deel speel nie
      return players.every(p => isSkillMastered(p, 'mult', subject.requiresMultLevel));
    }
    return true;
  };

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Terug</button>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🏆 Vrydag Spel</div>
          <div style={{ width: 80 }}></div>
        </header>

        <h2 style={{ fontSize: 18, color: '#6b7280', fontWeight: 700, marginTop: 24, marginBottom: 12 }}>
          1. KIES SPELERS
        </h2>
        <div style={styles.playerPickGrid}>
          {profiles.map(p => {
            const multLevel = getCurrentSkillLevel(p, 'mult');
            const reward = getFridayReward(p, settings);
            return (
              <button key={p.id} onClick={() => togglePlayer(p.id)} style={{
                ...styles.playerPick,
                ...(selected.includes(p.id) ? { ...styles.playerPickSelected, borderColor: '#3b82f6' } : {})
              }}>
                <span style={{ fontSize: 36 }}>{p.avatar}</span>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>✖️ Vlak {multLevel}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>R{reward} prys</span>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, color: '#6b7280', fontWeight: 700, marginTop: 32, marginBottom: 12 }}>
              2. KIES VAK
            </h2>
            <div style={styles.subjectGrid}>
              {SUBJECT_ORDER.map(sid => {
                const sub = SUBJECTS[sid];
                const available = subjectAvailable(sid);
                return (
                  <button
                    key={sid}
                    onClick={() => available && (sounds.click(soundOn), setSubjectId(sid))}
                    disabled={!available}
                    style={{
                      ...styles.subjectCard,
                      borderColor: sub.color,
                      ...(subjectId === sid ? {
                        background: `${sub.color}22`,
                        boxShadow: `0 0 0 4px ${sub.color}66`,
                        transform: 'scale(1.02)'
                      } : {}),
                      ...(!available ? styles.subjectCardLocked : {}),
                      minHeight: 140
                    }}
                  >
                    <div style={{ fontSize: 56, filter: !available ? 'grayscale(1)' : 'none' }}>
                      {!available ? '🔒' : sub.emoji}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6, color: sub.color, fontFamily: 'Georgia, serif' }}>
                      {sub.name}
                    </div>
                    {!available && (
                      <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 4 }}>
                        Een speler nog nie reg
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {selected.length > 0 && subjectId && (
          <>
            <h2 style={{ fontSize: 18, color: '#6b7280', fontWeight: 700, marginTop: 32, marginBottom: 12 }}>
              3. KIES SPEL MODUS
            </h2>
            <div style={styles.modeGrid}>
              <button onClick={() => { sounds.click(soundOn); setMode('personalBest'); }} style={{
                ...styles.modeCard,
                ...(mode === 'personalBest' ? styles.modeCardSelected : {})
              }}>
                <div style={{ fontSize: 48 }}>⭐</div>
                <div style={styles.modeTitle}>Persoonlike Beste</div>
                <div style={styles.modeDesc}>
                  Klop jou eie record. Wen jou prys vir elke speler wat hulle vorige beste klop.
                </div>
                <div style={styles.modeBest}>1+ spelers · Almal kan wen</div>
              </button>

              <button onClick={() => { sounds.click(soundOn); setMode('handicap'); }} style={{
                ...styles.modeCard,
                ...(mode === 'handicap' ? styles.modeCardSelected : {})
              }}>
                <div style={{ fontSize: 48 }}>🏁</div>
                <div style={styles.modeTitle}>Handicap Wedren</div>
                <div style={styles.modeDesc}>
                  Elke speler kry hulle eie tyd-toelating. Eerste klaar wen die prys.
                </div>
                <div style={styles.modeBest}>2+ spelers · Regverdige kompetisie</div>
              </button>

              <button onClick={() => { sounds.click(soundOn); setMode('team'); }} style={{
                ...styles.modeCard,
                ...(mode === 'team' ? styles.modeCardSelected : {})
              }}>
                <div style={{ fontSize: 48 }}>🤝</div>
                <div style={styles.modeTitle}>Span Bonus</div>
                <div style={styles.modeDesc}>
                  Werk saam. As die span 30 vrae reg kry, kry ELKE speler hul prys.
                </div>
                <div style={styles.modeBest}>2+ spelers · Almal wen of niemand</div>
              </button>
            </div>

            {mode && canStart && (
              <button onClick={() => onStartGame(mode, players, subjectId)} style={{ ...styles.btnPrimary, width: '100%', marginTop: 24, fontSize: 22, padding: '20px' }}>
                ▶ BEGIN {SUBJECTS[subjectId].emoji} {SUBJECTS[subjectId].name.toUpperCase()} ({players.length} {players.length === 1 ? 'speler' : 'spelers'})
              </button>
            )}
            {mode && !canStart && (
              <div style={{ textAlign: 'center', marginTop: 16, color: '#ef4444', fontWeight: 600 }}>
                Hierdie modus benodig {mode === 'personalBest' ? '1+' : '2+'} speler(s)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════ FRIDAY GAME ENGINE ═══════════════
function FridayGameScreen({ mode, players, subjectId, settings, soundOn, onComplete, onQuit }) {
  if (mode === 'personalBest') return <PersonalBestGame players={players} subjectId={subjectId} settings={settings} soundOn={soundOn} onComplete={onComplete} onQuit={onQuit} />;
  if (mode === 'handicap') return <HandicapGame players={players} subjectId={subjectId} settings={settings} soundOn={soundOn} onComplete={onComplete} onQuit={onQuit} />;
  if (mode === 'team') return <TeamGame players={players} subjectId={subjectId} settings={settings} soundOn={soundOn} onComplete={onComplete} onQuit={onQuit} />;
  return null;
}

// ═══════════════ PERSONAL BEST GAME ═══════════════
function PersonalBestGame({ players, subjectId, settings, soundOn, onComplete, onQuit }) {
  const subject = SUBJECTS[subjectId] || SUBJECTS.mult;
  const [playerIdx, setPlayerIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [showHandover, setShowHandover] = useState(false);
  const inputRef = useRef(null);
  const TOTAL_QUESTIONS = 10;

  const player = players[playerIdx];

  useEffect(() => {
    if (player) {
      const qs = [];
      for (let i = 0; i < TOTAL_QUESTIONS; i++) qs.push(generateQuestion(player, subjectId, getCurrentSkillLevel(player, subjectId)));
      setQuestions(qs);
      setCurrent(0);
      setScore(0);
      setStartTime(Date.now());
      setShowHandover(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [playerIdx, player]);

  if (showHandover) {
    return (
      <div style={styles.screen}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
            <h2 style={styles.resultTitle}>{player.name} klaar!</h2>
            <p style={{ fontSize: 18, color: '#6b7280', marginTop: 8 }}>
              Telling: {results[results.length - 1]?.score} / {TOTAL_QUESTIONS}
            </p>
            {playerIdx + 1 < players.length ? (
              <button
                onClick={() => { sounds.click(soundOn); setPlayerIdx(playerIdx + 1); }}
                style={{ ...styles.btnPrimary, marginTop: 32, fontSize: 22, padding: '18px 40px' }}
              >
                {players[playerIdx + 1].avatar} {players[playerIdx + 1].name} se beurt →
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.celebration(soundOn);
                  const rewards = results.map(r => {
                    const p = players.find(pp => pp.id === r.profileId);
                    const beat = r.score > (p.bestRecord?.score || 0)
                      || (r.score === (p.bestRecord?.score || 0) && r.time < (p.bestRecord?.time || 999));
                    const reward = getFridayReward(p, settings);
                    return {
                      profileId: r.profileId,
                      profileName: p.name,
                      avatar: p.avatar,
                      score: r.score,
                      time: r.time,
                      beat,
                      previousBest: p.bestRecord || { score: 0, time: 999 },
                      amount: beat ? reward : 0
                    };
                  });
                  onComplete(rewards);
                }}
                style={{ ...styles.btnPrimary, marginTop: 32, fontSize: 22, padding: '18px 40px' }}
              >
                Sien Uitslae 🏆
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q || !player) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const handleSubmit = () => {
    if (!input.trim() || feedback) return;
    const correct = parseInt(input, 10) === q.answer;
    if (correct) sounds.correct(soundOn);
    else sounds.wrong(soundOn);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (current + 1 >= TOTAL_QUESTIONS) {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const finalScore = correct ? score + 1 : score;
        setResults(r => [...r, { profileId: player.id, score: finalScore, time: elapsed }]);
        setShowHandover(true);
      } else {
        setCurrent(current + 1);
      }
    }, correct ? 600 : 1500);
  };

  const fontSize = player.dyslexiaMode ? 80 : 64;

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{player.avatar}</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>{player.name}</span>
          </div>
          <div style={{ fontWeight: 700 }}>{current + 1}/{TOTAL_QUESTIONS}</div>
        </header>

        <div style={styles.gameStatBar}>
          <div>⭐ Telling: <strong>{score}</strong></div>
          <div>🎯 Vorige beste: <strong>{player.bestRecord?.score || 0}/{TOTAL_QUESTIONS}</strong></div>
        </div>

        <div style={styles.questionBox}>
          {feedback === 'correct' && <div style={styles.feedbackCorrect}>✓</div>}
          {feedback === 'wrong' && <div style={styles.feedbackWrong}>{q.answer}</div>}

          <div style={{ ...styles.question, fontSize }}>
            <span>{q.a}</span>
            <span style={{ color: subject.color, margin: '0 20px' }}>{q.op}</span>
            <span>{q.b}</span>
            <span style={{ color: '#6b7280', margin: '0 20px' }}>=</span>
            <span style={{ color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : '#3b82f6' }}>
              {input || '?'}
            </span>
          </div>

          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={!!feedback}
            style={{ ...styles.answerInput, fontSize: 48 }}
            placeholder="?"
          />
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setInput(input + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setInput(input.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setInput(input + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!input.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ HANDICAP RACE GAME ═══════════════
function HandicapGame({ players, subjectId, settings, soundOn, onComplete, onQuit }) {
  const subject = SUBJECTS[subjectId] || SUBJECTS.mult;
  const [playerIdx, setPlayerIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [showHandover, setShowHandover] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const TOTAL_QUESTIONS = 10;

  const player = players[playerIdx];

  // Bereken handicap volgens huidige skill vlak (gevorderdes kry minder tyd)
  const calcAllowance = (p) => {
    const skillLevel = getCurrentSkillLevel(p);
    let perQ;
    if (skillLevel <= 4) perQ = 10;        // Vroee skills: meer tyd
    else if (skillLevel <= 8) perQ = 7;    // Medium
    else if (skillLevel <= 12) perQ = 5;   // Vinnig
    else perQ = 4;                          // Meester
    if (p.dyslexiaMode) perQ = Math.round(perQ * 1.6);
    return perQ * TOTAL_QUESTIONS;
  };

  useEffect(() => {
    if (player) {
      const qs = [];
      for (let i = 0; i < TOTAL_QUESTIONS; i++) qs.push(generateQuestion(player, subjectId, getCurrentSkillLevel(player, subjectId)));
      setQuestions(qs);
      setCurrent(0);
      setScore(0);
      const allowance = calcAllowance(player);
      setTotalAllowance(allowance);
      setTimeLeft(allowance);
      setShowHandover(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [playerIdx, player]);

  useEffect(() => {
    if (showHandover || !player) return;
    if (timeLeft <= 0) {
      sounds.timeUp(soundOn);
      setResults(r => [...r, { profileId: player.id, allowance: totalAllowance, used: totalAllowance, finishedInTime: false, score }]);
      setShowHandover(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => +(t - 0.1).toFixed(1)), 100);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, showHandover, player]);

  if (showHandover) {
    const lastResult = results[results.length - 1];
    return (
      <div style={styles.screen}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>{lastResult?.finishedInTime ? '🏆' : '⏱️'}</div>
            <h2 style={styles.resultTitle}>{player.name} klaar!</h2>
            <p style={{ fontSize: 18, color: '#6b7280', marginTop: 8 }}>
              Telling: {lastResult?.score} / {TOTAL_QUESTIONS}
            </p>
            <p style={{ fontSize: 16, color: '#6b7280', marginTop: 4 }}>
              Tyd gebruik: {lastResult?.used.toFixed(1)}s / {lastResult?.allowance}s
            </p>
            {playerIdx + 1 < players.length ? (
              <button
                onClick={() => { sounds.click(soundOn); setPlayerIdx(playerIdx + 1); }}
                style={{ ...styles.btnPrimary, marginTop: 32, fontSize: 22, padding: '18px 40px' }}
              >
                {players[playerIdx + 1].avatar} {players[playerIdx + 1].name} se beurt →
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.celebration(soundOn);
                  const finishers = results.filter(r => r.finishedInTime && r.score >= TOTAL_QUESTIONS * 0.7);
                  let winnerId = null;
                  if (finishers.length > 0) {
                    finishers.sort((a, b) => {
                      if (b.score !== a.score) return b.score - a.score;
                      return (a.used / a.allowance) - (b.used / b.allowance);
                    });
                    winnerId = finishers[0].profileId;
                  }
                  const rewards = results.map(r => {
                    const p = players.find(pp => pp.id === r.profileId);
                    const reward = getFridayReward(p, settings);
                    return {
                      profileId: r.profileId,
                      profileName: p.name,
                      avatar: p.avatar,
                      score: r.score,
                      time: r.used.toFixed(1),
                      allowance: r.allowance,
                      isWinner: r.profileId === winnerId,
                      amount: r.profileId === winnerId ? reward : 0
                    };
                  });
                  onComplete(rewards);
                }}
                style={{ ...styles.btnPrimary, marginTop: 32, fontSize: 22, padding: '18px 40px' }}
              >
                Sien Uitslae 🏆
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q || !player) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const handleSubmit = () => {
    if (!input.trim() || feedback) return;
    const correct = parseInt(input, 10) === q.answer;
    if (correct) sounds.correct(soundOn);
    else sounds.wrong(soundOn);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (current + 1 >= TOTAL_QUESTIONS) {
        const used = totalAllowance - timeLeft;
        const finalScore = correct ? score + 1 : score;
        setResults(r => [...r, { profileId: player.id, allowance: totalAllowance, used, finishedInTime: true, score: finalScore }]);
        setShowHandover(true);
      } else {
        setCurrent(current + 1);
      }
    }, correct ? 400 : 1000);
  };

  const timePct = (timeLeft / totalAllowance) * 100;
  const timerColor = timePct > 50 ? '#10b981' : timePct > 20 ? '#f59e0b' : '#ef4444';
  const fontSize = player.dyslexiaMode ? 80 : 64;

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{player.avatar}</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>{player.name}</span>
          </div>
          <div style={{ fontWeight: 700 }}>{current + 1}/{TOTAL_QUESTIONS}</div>
        </header>

        <div style={{ ...styles.timerBar, background: '#e5e7eb' }}>
          <div style={{ ...styles.timerFill, width: timePct + '%', background: timerColor }}></div>
        </div>
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 24, color: timerColor, marginTop: 8 }}>
          {timeLeft.toFixed(1)}s
        </div>

        <div style={styles.gameStatBar}>
          <div>⭐ Telling: <strong>{score}</strong></div>
          <div>🏁 Jou tyd: <strong>{totalAllowance}s</strong></div>
        </div>

        <div style={styles.questionBox}>
          {feedback === 'correct' && <div style={styles.feedbackCorrect}>✓</div>}
          {feedback === 'wrong' && <div style={styles.feedbackWrong}>{q.answer}</div>}

          <div style={{ ...styles.question, fontSize }}>
            <span>{q.a}</span>
            <span style={{ color: subject.color, margin: '0 20px' }}>{q.op}</span>
            <span>{q.b}</span>
            <span style={{ color: '#6b7280', margin: '0 20px' }}>=</span>
            <span style={{ color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : '#3b82f6' }}>
              {input || '?'}
            </span>
          </div>

          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={!!feedback}
            style={{ ...styles.answerInput, fontSize: 48 }}
            placeholder="?"
          />
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setInput(input + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setInput(input.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setInput(input + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!input.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ TEAM GAME ═══════════════
function TeamGame({ players, subjectId, settings, soundOn, onComplete, onQuit }) {
  const subject = SUBJECTS[subjectId] || SUBJECTS.mult;
  const TARGET = 30;
  const [turnIdx, setTurnIdx] = useState(0);
  const [teamScore, setTeamScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [currentQ, setCurrentQ] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [perPlayerCorrect, setPerPlayerCorrect] = useState({});
  const inputRef = useRef(null);
  const MAX_QUESTIONS = 50;

  const player = players[turnIdx];

  useEffect(() => {
    if (player && !done) {
      setCurrentQ(generateQuestion(player, subjectId, getCurrentSkillLevel(player, subjectId)));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [turnIdx, player, done]);

  const handleSubmit = () => {
    if (!input.trim() || feedback) return;
    const correct = parseInt(input, 10) === currentQ.answer;
    if (correct) sounds.correct(soundOn);
    else sounds.wrong(soundOn);
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setTeamScore(s => s + 1);
      setPerPlayerCorrect(p => ({ ...p, [player.id]: (p[player.id] || 0) + 1 }));
    }
    setQuestionsAsked(q => q + 1);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      const newScore = correct ? teamScore + 1 : teamScore;
      const newAsked = questionsAsked + 1;

      if (newScore >= TARGET || newAsked >= MAX_QUESTIONS) {
        setDone(true);
      } else {
        setTurnIdx((turnIdx + 1) % players.length);
      }
    }, correct ? 500 : 1100);
  };

  if (done) {
    const teamWon = teamScore >= TARGET;
    if (teamWon) sounds.celebration(soundOn);
    return (
      <div style={styles.screen}>
        <div style={styles.heroBg}></div>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 100, marginBottom: 16 }}>{teamWon ? '🏆' : '💪'}</div>
            <h2 style={styles.resultTitle}>{teamWon ? 'SPAN WEN!' : 'Volgende keer!'}</h2>
            <p style={{ fontSize: 22, color: '#6b7280', marginTop: 12 }}>
              {teamScore} / {TARGET} reg in {questionsAsked} vrae
            </p>

            <div style={{ marginTop: 32, padding: 20, background: 'rgba(255,255,255,0.6)', borderRadius: 16 }}>
              <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 700, marginBottom: 12 }}>SPAN BYDRAES</div>
              {players.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span><span style={{ fontSize: 28 }}>{p.avatar}</span> {p.name}</span>
                  <span style={{ fontWeight: 800 }}>{perPlayerCorrect[p.id] || 0} reg</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const rewards = players.map(p => {
                  const reward = getFridayReward(p, settings);
                  return {
                    profileId: p.id,
                    profileName: p.name,
                    avatar: p.avatar,
                    contribution: perPlayerCorrect[p.id] || 0,
                    amount: teamWon ? reward : 0,
                    teamWon
                  };
                });
                onComplete(rewards);
              }}
              style={{ ...styles.btnPrimary, marginTop: 32, fontSize: 22, padding: '18px 40px' }}
            >
              {teamWon ? 'Eis pryse 💰' : 'Klaar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ || !player) return <div style={styles.screen}><div style={styles.container}>Laai...</div></div>;

  const fontSize = player.dyslexiaMode ? 80 : 64;
  const progressPct = Math.min(100, (teamScore / TARGET) * 100);

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onQuit} style={styles.backBtn}>← Stop</button>
          <div style={{ fontWeight: 800, fontSize: 18 }}>🤝 SPAN</div>
          <div style={{ fontWeight: 700 }}>{teamScore}/{TARGET}</div>
        </header>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: progressPct + '%', background: '#10b981' }}></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 700 }}>NOU IS DIT</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <span style={{ fontSize: 56 }}>{player.avatar}</span>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{player.name}</span>
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>se beurt</div>
        </div>

        <div style={styles.questionBox}>
          {feedback === 'correct' && <div style={styles.feedbackCorrect}>✓</div>}
          {feedback === 'wrong' && <div style={styles.feedbackWrong}>{currentQ.answer}{currentQ.hasRemainder ? ` res ${currentQ.remainder}` : ''}</div>}

          <div style={{ ...styles.question, fontSize }}>
            <span>{currentQ.a}</span>
            <span style={{ color: subject.color, margin: '0 20px' }}>{currentQ.op}</span>
            <span>{currentQ.b}</span>
            <span style={{ color: '#6b7280', margin: '0 20px' }}>=</span>
            <span style={{ color: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : '#3b82f6' }}>
              {input || '?'}
            </span>
          </div>

          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={!!feedback}
            style={{ ...styles.answerInput, fontSize: 48 }}
            placeholder="?"
          />
        </div>

        <div style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setInput(input + n)} disabled={!!feedback} style={styles.numKey}>{n}</button>
          ))}
          <button onClick={() => setInput(input.slice(0, -1))} disabled={!!feedback} style={styles.numKey}>⌫</button>
          <button onClick={() => setInput(input + '0')} disabled={!!feedback} style={styles.numKey}>0</button>
          <button onClick={handleSubmit} disabled={!input.trim() || !!feedback} style={{ ...styles.numKey, background: '#10b981', color: 'white' }}>✓</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ FRIDAY RESULTS SCREEN ═══════════════
function FridayResults({ rewards, profiles, soundOn, onDone }) {
  const totalAwarded = rewards.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 100, marginBottom: 16 }}>🏆</div>
          <h1 style={{ ...styles.resultTitle, fontSize: 42 }}>VRYDAG UITSLAE</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
            {rewards.map((r, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20,
                background: r.amount > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.05)',
                borderRadius: 16,
                border: r.amount > 0 ? '2px solid #10b981' : '2px solid #d1d5db'
              }}>
                <span style={{ fontSize: 56 }}>{r.avatar}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{r.profileName}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {r.beat ? '🌟 Klop persoonlike beste!' : ''}
                    {r.isWinner ? '🏁 Wedren wenner!' : ''}
                    {r.teamWon ? '🤝 Span het gewen!' : ''}
                    {r.score !== undefined && ` Telling: ${r.score}`}
                    {r.contribution !== undefined && ` ${r.contribution} bydraes`}
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: r.amount > 0 ? '#10b981' : '#9ca3af' }}>
                  {r.amount > 0 ? `+R${r.amount}` : 'R0'}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32,
            padding: 20,
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: 16,
            color: 'white'
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.9 }}>TOTAAL UITBETAAL</div>
            <div style={{ fontSize: 48, fontWeight: 900, marginTop: 4 }}>R{totalAwarded}</div>
          </div>

          <button onClick={onDone} style={{ ...styles.btnPrimary, marginTop: 24, width: '100%', fontSize: 22, padding: '18px' }}>
            Klaar
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ PARENT MODE ═══════════════
function ParentScreen({ profiles, settings, soundOn, onUpdateProfile, onUpdateSettings, onDeleteProfile, onBack }) {
  const [selected, setSelected] = useState(null);
  const [globalRewardInput, setGlobalRewardInput] = useState(String(settings.globalFridayReward || DEFAULT_FRIDAY_REWARD));

  const profile = profiles.find(p => p.id === selected);

  const saveGlobalReward = () => {
    const val = parseInt(globalRewardInput, 10);
    if (!isNaN(val) && val >= 0 && val <= 1000) {
      onUpdateSettings({ globalFridayReward: val });
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.heroBg}></div>
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← Terug</button>
          <div style={{ fontWeight: 800, fontSize: 22 }}>🔧 Ouer Modus</div>
          <div style={{ width: 80 }}></div>
        </header>

        <div style={styles.parentContent}>
          {!selected && (
            <>
              {/* GLOBALE INSTELLINGS */}
              <h2 style={{ fontSize: 16, color: '#6b7280', fontWeight: 700, marginBottom: 12 }}>GLOBALE INSTELLINGS</h2>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={styles.field}>
                  <label style={styles.label}>Vrydag prys (verstek vir alle kinders)</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>R</span>
                    <input
                      type="number"
                      value={globalRewardInput}
                      onChange={e => setGlobalRewardInput(e.target.value)}
                      onBlur={saveGlobalReward}
                      min="0"
                      max="1000"
                      style={{ ...styles.input, width: 120 }}
                    />
                    <button onClick={saveGlobalReward} style={{ ...styles.btnSecondary, padding: '10px 20px', flex: 'none' }}>
                      Stoor
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                    Hierdie is die verstek bedrag wat 'n kind verdien as hulle die Vrydag spel wen.
                    Jy kan dit per kind oorskryf hieronder.
                  </div>
                </div>

                <div style={{ ...styles.field, marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.soundOn}
                      onChange={e => onUpdateSettings({ soundOn: e.target.checked })}
                      style={{ width: 20, height: 20 }}
                    />
                    <span style={styles.label}>🔊 Klanke aan</span>
                  </label>
                </div>
              </div>

              <h2 style={{ fontSize: 16, color: '#6b7280', fontWeight: 700, marginBottom: 12 }}>KIES SPELER OM TE BESTUUR</h2>
              <div style={styles.profileGrid}>
                {profiles.map(p => (
                  <button key={p.id} onClick={() => setSelected(p.id)} style={styles.profileCard}>
                    <div style={{ ...styles.profileAvatar, background: '#3b82f6' }}>
                      {p.avatar}
                    </div>
                    <div style={styles.profileName}>{p.name}</div>
                    <div style={styles.profileLevel}>R{p.totalEarned || 0} verdien</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {profile && (
            <ProfileEditor
              profile={profile}
              settings={settings}
              onUpdateProfile={onUpdateProfile}
              onDeleteProfile={onDeleteProfile}
              onBack={() => setSelected(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════ PROFILE EDITOR (in Parent Mode) ═══════════════
function ProfileEditor({ profile, settings, onUpdateProfile, onDeleteProfile, onBack }) {
  const masteredCount = countMasteredAll(profile);
  const multLevel = getCurrentSkillLevel(profile, 'mult');
  const multSkill = SUBJECTS.mult.skills[multLevel - 1];

  const [customRewardInput, setCustomRewardInput] = useState(
    profile.customFridayReward !== null && profile.customFridayReward !== undefined
      ? String(profile.customFridayReward)
      : ''
  );
  const [useCustom, setUseCustom] = useState(profile.customFridayReward !== null && profile.customFridayReward !== undefined);

  const effectiveReward = getFridayReward(profile, settings);

  const saveCustomReward = () => {
    if (!useCustom) {
      onUpdateProfile(profile.id, { customFridayReward: null });
      return;
    }
    const val = parseInt(customRewardInput, 10);
    if (!isNaN(val) && val >= 0 && val <= 1000) {
      onUpdateProfile(profile.id, { customFridayReward: val });
    }
  };

  const toggleCustom = (use) => {
    setUseCustom(use);
    if (!use) {
      onUpdateProfile(profile.id, { customFridayReward: null });
      setCustomRewardInput('');
    }
  };

  return (
    <div style={styles.parentDetail}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <span style={{ fontSize: 48 }}>{profile.avatar}</span>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{profile.name}</h2>
          <div style={{ color: '#6b7280' }}>
            {masteredCount}/{TOTAL_LEVELS} vlakke bemeester · ✖️ Vlak {multLevel}: {multSkill ? multSkill.name : ''}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <button onClick={onBack} style={styles.btnSecondary}>← Ander Speler</button>
        </div>
      </div>

      {/* DYSLEXIE */}
      <div style={styles.field}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={profile.dyslexiaMode}
            onChange={e => onUpdateProfile(profile.id, { dyslexiaMode: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          <span style={styles.label}>📖 Dyslexie modus (groter teks, meer tyd)</span>
        </label>
      </div>

      {/* PER-KIND VRYDAG PRYS */}
      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 16, marginTop: 24 }}>
        <label style={styles.label}>💰 {profile.name} se Vrydag prys</label>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          Globaal verstek is <strong>R{settings.globalFridayReward || DEFAULT_FRIDAY_REWARD}</strong>.
          Jy kan 'n ander bedrag spesifiek vir {profile.name} stel.
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              checked={!useCustom}
              onChange={() => toggleCustom(false)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Gebruik globaal (R{settings.globalFridayReward || DEFAULT_FRIDAY_REWARD})</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              checked={useCustom}
              onChange={() => toggleCustom(true)}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Pasgemaak:</span>
          </label>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>R</span>
          <input
            type="number"
            value={customRewardInput}
            onChange={e => setCustomRewardInput(e.target.value)}
            onBlur={saveCustomReward}
            disabled={!useCustom}
            min="0"
            max="1000"
            placeholder="bv. 10"
            style={{ ...styles.input, width: 100, opacity: useCustom ? 1 : 0.5 }}
          />
          {useCustom && (
            <button onClick={saveCustomReward} style={{ ...styles.btnSecondary, padding: '8px 16px', flex: 'none', fontSize: 14 }}>
              Stoor
            </button>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#10b981' }}>
          Effektiewe prys: R{effectiveReward}
        </div>
      </div>

      {/* STATISTIEK */}
      <h3 style={{ marginTop: 32, marginBottom: 12, fontSize: 16, color: '#6b7280', fontWeight: 700 }}>STATISTIEK</h3>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>R{profile.totalEarned || 0}</div>
          <div style={styles.statLabel}>Totaal verdien</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{profile.totalAttempts || 0}</div>
          <div style={styles.statLabel}>Vrae geantw.</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {profile.totalAttempts > 0 ? Math.round((profile.totalCorrect / profile.totalAttempts) * 100) : 0}%
          </div>
          <div style={styles.statLabel}>Akkuraat</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{profile.streakDays || 0}</div>
          <div style={styles.statLabel}>Dag-streep</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{profile.sprintRecord || 0}</div>
          <div style={styles.statLabel}>60s Rekord</div>
        </div>
      </div>

      {(profile.weeklyEarnings || []).length > 0 && (
        <>
          <h3 style={{ marginTop: 32, marginBottom: 12, fontSize: 16, color: '#6b7280', fontWeight: 700 }}>VERDIEN GESKIEDENIS</h3>
          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 16, maxHeight: 200, overflowY: 'auto' }}>
            {profile.weeklyEarnings.slice(-20).reverse().map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  {new Date(e.date).toLocaleDateString('af-ZA')} · {e.mode === 'personalBest' ? 'Persoonlike Beste' : e.mode === 'handicap' ? 'Handicap' : 'Span'}
                </span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>+R{e.amount}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => {
          if (confirm(`Skrap ${profile.name} permanent?`)) {
            onDeleteProfile(profile.id);
            onBack();
          }
        }}
        style={{ ...styles.btnDanger, marginTop: 32, width: '100%' }}
      >
        🗑️ Skrap Speler
      </button>
    </div>
  );
}

// ═══════════════ STYLES ═══════════════
const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
  button { cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; font-family: inherit; }
  button:active:not(:disabled) { transform: scale(0.97); }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  input { font-family: inherit; }
  @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes ghostSlide {
    0%   { transform: translate(var(--fromX), var(--fromY)) scale(0.7); opacity: 0; }
    15%  { transform: translate(var(--fromX), var(--fromY)) scale(1.4); opacity: 1; }
    85%  { transform: translate(var(--toX), var(--toY)) scale(1.4); opacity: 1; }
    100% { transform: translate(var(--toX), var(--toY)) scale(1); opacity: 0; }
  }
  @keyframes bubbleUp {
    0%   { transform: translateY(10px) scale(0.7); opacity: 0; }
    15%  { transform: translateY(0) scale(1.1); opacity: 1; }
    25%  { transform: translateY(0) scale(1); opacity: 1; }
    80%  { transform: translateY(-2px) scale(1); opacity: 1; }
    100% { transform: translateY(-12px) scale(0.9); opacity: 0; }
  }
`;

const styles = {
  app: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #dbeafe 100%)',
    color: '#1f2937',
    overflowX: 'hidden'
  },
  screen: { minHeight: '100vh', position: 'relative' },
  heroBg: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(251,191,36,0.15) 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(236,72,153,0.12) 0%, transparent 40%),
                      radial-gradient(circle at 50% 90%, rgba(59,130,246,0.12) 0%, transparent 40%)`,
    pointerEvents: 'none',
    zIndex: 0
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '16px 12px',
    position: 'relative',
    zIndex: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoEmoji: { fontSize: 36, animation: 'float 3s ease-in-out infinite' },
  logoText: {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 1.5,
    color: '#1f2937',
    fontFamily: 'Georgia, serif'
  },
  parentBtn: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.7)',
    border: '2px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    color: '#374151'
  },
  iconBtn: {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.7)',
    border: '2px solid rgba(0,0,0,0.1)',
    borderRadius: 12,
    fontSize: 16
  },
  backBtn: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    color: '#374151'
  },
  tagline: {
    fontSize: 36,
    fontWeight: 900,
    color: '#1f2937',
    fontFamily: 'Georgia, serif',
    letterSpacing: -0.5,
    margin: 0
  },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16
  },
  profileCard: {
    background: 'rgba(255,255,255,0.85)',
    border: '3px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    position: 'relative'
  },
  profileAvatar: {
    width: 80, height: 80,
    borderRadius: '50%',
    fontSize: 48,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    border: '4px solid white'
  },
  profileName: { fontSize: 18, fontWeight: 800, color: '#1f2937' },
  profileLevel: { fontSize: 12, color: '#6b7280', fontWeight: 600 },
  profileEarnings: {
    fontSize: 16,
    fontWeight: 800,
    color: '#10b981',
    background: 'rgba(16,185,129,0.1)',
    padding: '4px 12px',
    borderRadius: 999
  },
  streakBadge: {
    position: 'absolute',
    top: -8, right: -8,
    background: '#f59e0b',
    color: 'white',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  addProfileCard: {
    background: 'rgba(255,255,255,0.4)',
    border: '3px dashed rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    color: '#6b7280'
  },
  addIcon: { fontSize: 48, fontWeight: 200, color: '#6b7280' },
  addText: { fontSize: 14, fontWeight: 700, marginTop: 4 },
  modalBg: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 16
  },
  modal: {
    background: 'white',
    borderRadius: 24,
    padding: 28,
    maxWidth: 480,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalTitle: { fontSize: 24, fontWeight: 900, marginBottom: 20, fontFamily: 'Georgia, serif' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    outline: 'none'
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 6
  },
  avatarOption: {
    aspectRatio: '1',
    background: '#f3f4f6',
    border: '2px solid transparent',
    borderRadius: 12,
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarOptionSelected: {
    background: '#fef3c7',
    borderColor: '#f59e0b',
    transform: 'scale(1.1)'
  },
  worldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 6
  },
  worldOption: {
    background: '#f3f4f6',
    border: '2px solid transparent',
    borderRadius: 10,
    padding: 8,
    color: '#374151',
    textAlign: 'center'
  },
  worldOptionSelected: { color: 'white' },
  btnPrimary: {
    flex: 1,
    padding: 14,
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 800,
    boxShadow: '0 4px 14px rgba(245,158,11,0.4)'
  },
  btnSecondary: {
    flex: 1,
    padding: 14,
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700
  },
  btnDanger: {
    padding: 14,
    background: '#fee2e2',
    color: '#991b1b',
    border: '2px solid #fca5a5',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700
  },
  profileTopBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(255,255,255,0.7)',
    padding: '8px 16px',
    borderRadius: 999
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginBottom: 24
  },
  statCard: {
    background: 'rgba(255,255,255,0.85)',
    padding: 16,
    borderRadius: 16,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  statIcon: { fontSize: 28, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: 900, color: '#1f2937', fontFamily: 'Georgia, serif' },
  statLabel: { fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  bigButtonRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 32
  },
  bigBtn: {
    border: 'none',
    borderRadius: 24,
    padding: 28,
    color: 'white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center'
  },
  bigBtnPrimary: { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
  bigBtnSprint: { background: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  bigBtnFriday: { background: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  bigBtnFridayActive: {
    animation: 'pulse 2s ease-in-out infinite',
    boxShadow: '0 8px 32px rgba(245,158,11,0.5)'
  },
  progressSection: { marginTop: 24 },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 24
  },
  subjectCard: {
    background: 'rgba(255,255,255,0.85)',
    border: '3px solid',
    borderRadius: 20,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
    minHeight: 200,
    color: '#1f2937'
  },
  subjectCardLocked: {
    background: 'rgba(0,0,0,0.04)',
    cursor: 'not-allowed',
    opacity: 0.7
  },
  skillCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'rgba(255,255,255,0.85)',
    padding: 14,
    borderRadius: 14,
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  skillMastered: {
    background: 'rgba(16,185,129,0.1)',
    border: '2px solid rgba(16,185,129,0.3)'
  },
  skillCurrent: {
    background: 'rgba(59,130,246,0.08)',
    border: '2px solid #3b82f6',
    boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
  },
  skillLocked: {
    opacity: 0.55
  },
  skillBar: {
    flex: 1,
    height: 8,
    background: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6
  },
  skillBarFill: { height: '100%', borderRadius: 999, transition: 'width 0.4s' },
  questionCounter: {
    fontWeight: 800,
    fontSize: 16,
    color: '#374151',
    background: 'rgba(255,255,255,0.7)',
    padding: '8px 16px',
    borderRadius: 999
  },
  progressBar: {
    height: 8,
    background: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 32
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    borderRadius: 999,
    transition: 'width 0.4s'
  },
  questionBox: {
    background: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 32,
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    position: 'relative',
    marginBottom: 20
  },
  question: {
    fontWeight: 900,
    fontFamily: 'Georgia, serif',
    color: '#1f2937',
    margin: '20px 0',
    animation: 'pop 0.4s ease-out'
  },
  feedbackCorrect: {
    position: 'absolute',
    top: 16, right: 16,
    fontSize: 32,
    color: '#10b981',
    fontWeight: 900,
    animation: 'pop 0.4s'
  },
  feedbackWrong: {
    position: 'absolute',
    top: 16, left: '50%',
    transform: 'translateX(-50%)',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '8px 16px',
    borderRadius: 12,
    fontWeight: 800,
    animation: 'shake 0.4s'
  },
  answerInput: {
    width: 200,
    padding: 16,
    border: '3px solid #3b82f6',
    borderRadius: 16,
    textAlign: 'center',
    fontWeight: 800,
    outline: 'none',
    background: 'white'
  },
  submitBtn: {
    display: 'block',
    margin: '20px auto 0',
    padding: '14px 36px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 800
  },
  numpad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    maxWidth: 320,
    margin: '0 auto'
  },
  numKey: {
    padding: 18,
    fontSize: 22,
    fontWeight: 800,
    background: 'rgba(255,255,255,0.85)',
    border: '2px solid rgba(0,0,0,0.06)',
    borderRadius: 12,
    color: '#1f2937'
  },
  resultHero: { textAlign: 'center', padding: '32px 0' },
  resultTitle: {
    fontSize: 36,
    fontWeight: 900,
    fontFamily: 'Georgia, serif',
    margin: '12px 0',
    color: '#1f2937'
  },
  resultScore: {
    fontSize: 64,
    fontWeight: 900,
    fontFamily: 'Georgia, serif',
    color: '#3b82f6',
    margin: '8px 0'
  },
  resultPct: { fontSize: 18, color: '#6b7280', fontWeight: 600 },
  resultDetails: { background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: 20 },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: 8
  },
  resultItem: {
    padding: 10,
    borderRadius: 10,
    border: '2px solid',
    textAlign: 'center'
  },
  playerPickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 12
  },
  playerPick: {
    background: 'rgba(255,255,255,0.7)',
    border: '3px solid transparent',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    color: '#1f2937'
  },
  playerPickSelected: {
    background: 'rgba(255,255,255,0.95)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12
  },
  modeCard: {
    background: 'rgba(255,255,255,0.7)',
    border: '3px solid transparent',
    borderRadius: 20,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    color: '#1f2937',
    textAlign: 'center'
  },
  modeCardSelected: {
    borderColor: '#f59e0b',
    background: 'rgba(255,255,255,1)',
    boxShadow: '0 8px 24px rgba(245,158,11,0.25)',
    transform: 'translateY(-4px)'
  },
  modeTitle: { fontSize: 18, fontWeight: 800, marginTop: 4, fontFamily: 'Georgia, serif' },
  modeDesc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5 },
  modeBest: {
    fontSize: 11,
    fontWeight: 700,
    color: '#10b981',
    background: 'rgba(16,185,129,0.1)',
    padding: '4px 10px',
    borderRadius: 999,
    marginTop: 6
  },
  gameStatBar: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.7)',
    padding: '10px 16px',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    color: '#374151'
  },
  timerBar: {
    height: 14,
    borderRadius: 999,
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
  },
  timerFill: { height: '100%', borderRadius: 999, transition: 'width 0.1s linear, background 0.3s' },
  parentContent: { background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 24 },
  parentDetail: {}
};


// ═══════════════════════════════════════════════════════════════════
// MOUNT NA DOM
// ═══════════════════════════════════════════════════════════════════
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BreinGym />);
