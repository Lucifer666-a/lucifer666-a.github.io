// --- BAGIAN TYPEWRITER & OBSERVER ---
const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let index = 0;
const textElement = document.querySelector('.type_write');

function typeNewText() {
    textElement.style.animation = 'none';
    textElement.style.width = '0';
    void textElement.offsetWidth; 
    index = (index + 1) % professions.length;
    textElement.textContent = professions[index];
    textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (!window.typeInterval) {
                window.typeInterval = setInterval(typeNewText, 4000);
            }
        } else {
            clearInterval(window.typeInterval);
            window.typeInterval = null;
        }
    });
}, { threshold: 0.5 }); 

observer.observe(document.querySelector('.sec2'));

// --- BAGIAN PARALLAX TEXT ---
const portfolioText = document.querySelector('.portfolio');
document.addEventListener('mousemove', (e) => {
    if (portfolioText && window.scrollY < window.innerHeight) {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;
        portfolioText.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// --- BAGIAN GTA MENU & AUDIO ---
const hoverSfx = new Audio('assets/sounds/hover.mp3');
const selectSfx = new Audio('assets/sounds/select.mp3');
const backSfx = new Audio('assets/sounds/back.mp3');

function playSound(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// Hover Sound Logic
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.item')) { 
        playSound(hoverSfx);
    }
});

// Navigation Logic
function showPage(pageName) {
    playSound(selectSfx);

    const mainMenu = document.getElementById('main-menu');
    const contentPage = document.getElementById('content-page');
    const pageData = document.getElementById('page-data');
    const header = document.getElementById('header');

    mainMenu.style.display = 'none';
    contentPage.style.display = 'flex';
    header.innerText = pageName;

    // Konten Dinamis
    if(pageName === 'contact') {
        pageData.innerHTML = `
            <div class="item">EMAIL: NANDO@DE.COM</div>
            <div class="item">INSTAGRAM: nand_2956</div>
            <div class="item">GITHUB: lucifer666-a</div>`;
    } else if (pageName === 'projects') {
        pageData.innerHTML = `
            <div class="item">PROJECT 01: API ECOMMERCE</div>
            <div class="item">PROJECT 02: AUTH SYSTEM</div>`;
    } else if (pageName === 'info') {
        pageData.innerHTML = `
            <div class="item">NANDO - BACK END DEVELOPER</div>
            <div class="item">SPECIALIZED IN NODE.JS & GOLANG</div>`;
    } else if (pageName === 'cv') {
        pageData.innerHTML = `<div class="item">DOWNLOAD MY RESUME</div>`;
    }
}

function backToStats() {
    playSound(backSfx);
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('content-page').style.display = 'none';
    document.getElementById('header').innerText = 'Stats';
}

// Unlock Audio Context (Auto-play fix)
const unlockAudio = () => {
    hoverSfx.play().then(() => {
        hoverSfx.pause();
        hoverSfx.currentTime = 0;
    }).catch(e => console.log("Audio unlock failed"));

    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
};

document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio); // Pakai addEventListener di sini