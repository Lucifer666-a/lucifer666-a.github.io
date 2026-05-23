// ==========================================================================
// 1. AUDIO RESOURCES INITIALIZATION
// ==========================================================================
const sfx = {
  gta: {
    hover: new Audio('assets/sounds/sec3_gta/hover.mp3'),
    select: new Audio('assets/sounds/sec3_gta/select.mp3'),
    back: new Audio('assets/sounds/sec3_gta/back.mp3')
  },
  re: {
    hover: new Audio('assets/sounds/re/hoverre.mp3'),
    select: new Audio('assets/sounds/re/selectre.mp3'),
    back: new Audio('assets/sounds/re/backre.mp3')
  },
  global: {
    flip: new Audio('assets/sounds/sec2_origin/flip.mp3'),
    unlock: new Audio('assets/sounds/unlock.mp3'),
    denied: new Audio('assets/sounds/denied.mp3')
  }
};

// ==========================================================================
// 2. SMART SYSTEM - PLAY SFX UNIVERSAL
// ==========================================================================
const playSfx = (type) => {
  const sec1 = document.querySelector('.sec1');
  if (!sec1) return;

  const isRE = sec1.classList.contains('outbreak-active');
  let targetAudio;

  // Logic pemilihan audio berdasarkan mode (RE vs GTA)
  if (sfx.gta[type] && sfx.re[type]) {
    targetAudio = isRE ? sfx.re[type] : sfx.gta[type];
  } else {
    // Jika input adalah object audio langsung (global sfx)
    targetAudio = sfx.global[type] || type;
  }

  if (targetAudio instanceof Audio) {
    targetAudio.pause();
    targetAudio.currentTime = 0;
    targetAudio.play().catch(() => { });
  }
};

// Unlock Audio Context (Fix browser auto-play block policy)
const unlockAudioContext = () => {
  playSfx('unlock');
  document.removeEventListener('click', unlockAudioContext);
  document.removeEventListener('keydown', unlockAudioContext);
};
document.addEventListener('click', unlockAudioContext);
document.addEventListener('keydown', unlockAudioContext);