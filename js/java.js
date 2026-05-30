// ==========================================================================
// 1. CONFIG & ELEMENT SELECTORS
// ==========================================================================
const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let profIndex = 0;
const textElement = document.querySelector('.type_write');
const portfolioText = document.querySelector('.portfolio');
const sec1 = document.querySelector('.sec1');
const sec2 = document.querySelector('.sec2');

// ==========================================================================
// 2. SECTION 1: MOUSE PARALLAX & PORTFOLIO TRIGGER
// ==========================================================================
document.addEventListener('mousemove', (e) => {
    if (portfolioText && window.scrollY < window.innerHeight) {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;
        portfolioText.style.transform = `translate(${x}px, ${y}px)`;
    }
});

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

// ==========================================================================
// 3. SECTION 2: INTERSECTION OBSERVER, TYPEWRITER, & CARD FLIP
// ==========================================================================
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
    void textElement.offsetWidth; // Trigger reflow
    profIndex = (profIndex + 1) % professions.length;
    textElement.textContent = professions[profIndex];
    textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
}

function toggleTheme() {
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
        profileCard.classList.toggle('flipped');
        sec2.classList.toggle('war-mode');
        playSfx('flip');
    }
}

// ==========================================================================
// 4. SECTION 3: GAME MENU & NAVIGATION LOGIC
// ==========================================================================
function showPage(pageName) {
    if (pageName === 'projects') {
        window.location.href = "project/index.html";
        return;
    }
    playSfx('select');

    const contents = {
        contact: `<div class="item">Email: nando@de.com</div>
                  <div class="item">Instagram: nand_2956</div>
                  <div class="item">Github: lucifer666-a</div>`,
        projects: `<div class="item">Project 01: Api Ecommerce</div>
                   <div class="item">Project 02: Auth System</div>`,
        info: `<div class="item">Nando - Back End Developer</div>
               <div class="item">Specialized In Node.js & Golang</div>`,
        cv: `<a href="assets/profile/CV_Fernando_Hasiholan.pdf" download="CV_Fernando_Hasiholan.pdf" style="text-decoration: none; color: inherit;">
                <div class="item">Download My Resume</div>
             </a>`
    };

    document.getElementById('main-menu').style.display = 'none';
    const contentPage = document.getElementById('content-page');
    contentPage.style.display = 'flex';

    document.getElementById('header').innerText = pageName;
    document.getElementById('page-data').innerHTML = contents[pageName] || '';
}

function backToStats() {
    playSfx('back');
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('content-page').style.display = 'none';
    document.getElementById('header').innerText = 'Stats';
}

// Global Hover UI Sound Listener
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.item') || e.target.closest('.back-btn')) {
        playSfx('hover');
    }
});