const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let index = 0;
const textElement = document.querySelector('.type_write');

function typeNewText() {
    // 1. Reset text & animation
    textElement.style.animation = 'none';
    textElement.style.width = '0';
    
    // Trigger reflow agar browser sadar ada perubahan
    void textElement.offsetWidth; 

    // 2. Ganti teks
    index = (index + 1) % professions.length;
    textElement.textContent = professions[index];

    // 3. Jalankan lagi animasinya
    textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Mulai interval hanya jika belum ada
            if (!window.typeInterval) {
                window.typeInterval = setInterval(typeNewText, 4000); // 4 detik biar gak kelamaan nunggu
            }
        } else {
            // Opsional: hentikan interval jika user pindah section
            clearInterval(window.typeInterval);
            window.typeInterval = null;
        }
    });
}, { threshold: 0.5 }); 

observer.observe(document.querySelector('.sec2'));

const portfolioText = document.querySelector('.portfolio');

document.addEventListener('mousemove', (e) => {
    if (portfolioText && window.scrollY < window.innerHeight) {
        const x = (e.clientX - window.innerWidth / 2) / 150;
        const y = (e.clientY - window.innerHeight / 2) / 150;

        portfolioText.style.transform = `translate(${x}px, ${y}px)`;
    }
});