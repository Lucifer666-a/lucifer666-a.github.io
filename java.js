// --- 1. CONFIG & INITIALIZATION ---
const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let profIndex = 0;
const textElement = document.querySelector('.type_write');

// Inisialisasi Audio
const hoverSfx = new Audio('assets/sounds/hover.mp3');
const selectSfx = new Audio('assets/sounds/select.mp3');
const backSfx = new Audio('assets/sounds/back.mp3');

// Fungsi universal untuk putar suara agar tidak tumpang tindih
const playSfx = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.play().catch(() => {}); // Biar gak error kalau diblokir browser
};

// --- 2. TYPEWRITER LOGIC (SECTION 2) ---
function typeNewText() {
    textElement.style.animation = 'none';
    void textElement.offsetWidth; // Trigger reflow
    profIndex = (profIndex + 1) % professions.length;
    textElement.textContent = professions[profIndex];
    textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
}

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
observer.observe(document.querySelector('.sec2'));

// --- 3. PARALLAX EFFECT (SECTION 1) ---
const portfolioText = document.querySelector('.portfolio');
document.addEventListener('mousemove', (e) => {
    if (portfolioText && window.scrollY < window.innerHeight) {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;
        portfolioText.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// --- 4. GTA MENU LOGIC (SECTION 3) ---
function showPage(pageName) {
    playSfx(selectSfx);
    
    // Mapping Konten (Efisiensi ganti IF-ELSE)
    const contents = {
        contact: `<div class="item">EMAIL: NANDO@DE.COM</div>
                  <div class="item">INSTAGRAM: nand_2956</div>
                  <div class="item">GITHUB: lucifer666-a</div>`,
        projects: `<div class="item">PROJECT 01: API ECOMMERCE</div>
                   <div class="item">PROJECT 02: AUTH SYSTEM</div>`,
        info: `<div class="item">NANDO - BACK END DEVELOPER</div>
               <div class="item">SPECIALIZED IN NODE.JS & GOLANG</div>`,
        cv: `<div class="item">DOWNLOAD MY RESUME</div>`
    };

    document.getElementById('main-menu').style.display = 'none';
    const contentPage = document.getElementById('content-page');
    contentPage.style.display = 'flex';
    document.getElementById('header').innerText = pageName;
    document.getElementById('page-data').innerHTML = contents[pageName] || '';
}

function backToStats() {
    playSfx(backSfx);
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('content-page').style.display = 'none';
    document.getElementById('header').innerText = 'Stats';
}

// --- 5. GLOBAL EVENT LISTENERS ---

// Hover Sound Delegasi
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.item')) playSfx(hoverSfx);
});

// Unlock Audio (Auto-play fix)
const unlock = () => {
    playSfx(hoverSfx); // "Pancing" audio context
    document.removeEventListener('click', unlock);
    document.removeEventListener('keydown', unlock);
};
document.addEventListener('click', unlock);
document.addEventListener('keydown', unlock);




// war mode
function toggleTheme() {
    const sec2 = document.querySelector('.sec2');
    const profileCard = document.getElementById('profileCard');
    if(profileCard) {
    profileCard.classList.toggle('flipped');

    sec2.classList.toggle('war-mode');

        if(typeof playSfx === "function") {
            playSfx(selectSfx);
        }
    }
}