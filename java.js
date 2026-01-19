// --- 1. CONFIG & INITIALIZATION ---
const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let profIndex = 0;
const textElement = document.querySelector('.type_write');
const sec1 = document.querySelector('.sec1');
const sec2 = document.querySelector('.sec2');

// Audio Resources
const sfx = {
    gta: {
        hover: new Audio('assets/sounds/sec3_gta/hover.mp3'),
        select: new Audio('assets/sounds/sec3_gta/select.mp3'),
        back: new Audio('assets/sounds/sec3_gta/back.mp3')
    },
    re: {
        // Nama file sudah direvisi (ditambah 're' di belakang)
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

// Fungsi Universal Play SFX (Cerdas Mode)
const playSfx = (type) => {
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
        targetAudio.play().catch(() => {});
    }
};

// --- 2. OBSERVER & TYPEWRITER (SEC 2) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (!window.typeInterval) window.typeInterval = setInterval(typeNewText, 4000);
        } else {
            clearInterval(window.typeInterval);
            window.typeInterval = null;
        }
    });
}, { threshold: 0.5 });

if (sec2) observer.observe(sec2);

function typeNewText() {
    if (!textElement) return;
    textElement.style.animation = 'none';
    void textElement.offsetWidth;
    profIndex = (profIndex + 1) % professions.length;
    textElement.textContent = professions[profIndex];
    textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
}

// --- 3. PARALLAX EFFECT (SEC 1) ---
const portfolioText = document.querySelector('.portfolio');
document.addEventListener('mousemove', (e) => {
    if (portfolioText && window.scrollY < window.innerHeight) {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;
        portfolioText.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// --- 4. MENU LOGIC (SECTION 3) ---
function showPage(pageName) {
    playSfx('select'); // Otomatis milih selectSfx (GTA) atau selectreSfx (RE)
    
    const contents = {
        contact: `<div class="item">Email: nando@de.com</div>
                  <div class="item">Instagram: nand_2956</div>
                  <div class="item">Github: lucifer666-a</div>`,
        projects: `<div class="item">Project 01: Api Ecommerce</div>
                   <div class="item">Project 02: Auth System</div>`,
        info: `<div class="item">Nando - Back End Developer</div>
               <div class="item">Specialized In Node.js & Golang</div>`,
        cv: `<div class="item">Download My Resume</div>`
    };

    document.getElementById('main-menu').style.display = 'none';
    const contentPage = document.getElementById('content-page');
    contentPage.style.display = 'flex';
    
    document.getElementById('header').innerText = pageName;
    document.getElementById('page-data').innerHTML = contents[pageName] || '';
}

function backToStats() {
    playSfx('back'); // Otomatis milih backSfx (GTA) atau backreSfx (RE)
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('content-page').style.display = 'none';
    document.getElementById('header').innerText = 'Stats';
}

// --- 5. GLOBAL EVENT LISTENERS ---

// Hover Sound Delegasi
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.item') || e.target.closest('.back-btn')) {
        playSfx('hover'); // Otomatis milih hoverSfx (GTA) atau hoverreSfx (RE)
    }
});

// Unlock Audio (Auto-play fix)
const unlock = () => {
    playSfx('unlock');
    document.removeEventListener('click', unlock);
    document.removeEventListener('keydown', unlock);
};
document.addEventListener('click', unlock);
document.addEventListener('keydown', unlock);

// Theme Toggle (War Mode)
function toggleTheme() {
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
        profileCard.classList.toggle('flipped');
        sec2.classList.toggle('war-mode');
        playSfx('flip');
    }
}

// Access Portfolio Logic
if (portfolioText) {
    portfolioText.addEventListener('click', () => {
        if (!sec2.classList.contains('war-mode')) {
            playSfx('denied');
            portfolioText.classList.add('denied');
            setTimeout(() => portfolioText.classList.remove('denied'), 300);
        } else {
            if (!sec1.classList.contains('outbreak-active')) {
                sec1.classList.add('outbreak-active');
                sec1.classList.add('screen-shake');
                setTimeout(() => sec1.classList.remove('screen-shake'), 500);
            }
        }
    });
}