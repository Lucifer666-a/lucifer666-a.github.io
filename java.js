const professions = ["Back End Developer", "Mobile Developer", "Freelancer"];
let index = 0;
const textElement = document.querySelector('.type_write');

function typeNewText() {
    // 1. Reset: Matike animasi & lebar 0 biar kursor ilang dulu
    textElement.style.animation = 'none';
    textElement.style.width = '0';
    
    // Trigger reflow (wajib)
    textElement.offsetHeight; 

    // 2. Kasih jeda dikit (misal 500ms) baru ganti teks & mulai ngetik
    // Ini biar mator kito sempet liat jeda kosong bentar
    setTimeout(() => {
        index = (index + 1) % professions.length;
        textElement.textContent = professions[index];

        // 3. Pasang lagi animasinyo
        // Pake 'forwards' biar kursor dak ilang pas lah selesai ngetik
        textElement.style.animation = 'typing 2s steps(30) forwards, blink 0.75s step-end infinite';
    }, 500); 
}


//on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            if (!window.typeInterval) {
                window.typeInterval = setInterval(typeNewText, 9000);
            }
        }
    });
},  {threshold: 0.3 }); 

observer.observe(document.querySelector('.sec2'));