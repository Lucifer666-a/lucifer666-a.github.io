// Mengimpor modul Firebase SDK yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Konfigurasi Firebase asli milikmu (TETAP UTUH & TERHUBUNG)
const firebaseConfig = {
    apiKey: "AIzaSyBmeQH4b3_c2PboAsjv7Xpqts0LFuDhhmc",
    authDomain: "fir-app-17717.firebaseapp.com",
    projectId: "fir-app-17717",
    storageBucket: "fir-app-17717.firebasestorage.app",
    messagingSenderId: "665964692179",
    appId: "1:665964692179:web:9671d0259cb0c2d8f58a26",
    measurementId: "G-ZMJBK15950"
};

// Inisialisasi Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referensi ke elemen HTML tempat kartu project akan ditampilkan
const projectContainer = document.getElementById("project-container");

// Fungsi Mendengarkan Data Firestore secara Real-Time (onSnapshot)
onSnapshot(collection(db, "projects"), (snapshot) => {
    // Kosongkan container dari text loading bawaan HTML
    projectContainer.innerHTML = "";

    if (snapshot.empty) {
        projectContainer.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-10">
                Belum ada project yang di-upload di database.
            </div>
        `;
        return;
    }

    // Perulangan untuk setiap dokumen data project di Firestore
    snapshot.forEach((doc) => {
        const data = doc.data();

        // Template HTML untuk kartu project bertema Monokrom Modern dengan Gradasi
        const projectCard = `
            <div class="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:border-gray-600 transition duration-300 flex flex-col justify-between group/card">
                <div>
                    <!-- Efek gambar: saat card di-hover, gambar akan sedikit lebih terang secara smooth -->
                    <img src="${data.gambar || 'https://picsum.photos/400/250'}" alt="${data.judul}" class="w-full h-48 object-cover opacity-70 group-hover/card:opacity-90 transition duration-300">
                    <div class="p-5">
                        <h3 class="text-base font-bold text-white mb-2 tracking-wide">${data.judul}</h3>
                        <p class="text-gray-400 text-xs sm:text-sm leading-relaxed">${data.deskripsi}</p>
                    </div>
                </div>
                
                <!-- Tombol dengan gradasi monokrom perak tipis -->
                <div class="p-5 pt-0">
                    <a href="${data.link || '#'}" target="_blank" 
                       class="w-full inline-flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-white hover:via-gray-100 hover:to-gray-300 text-gray-300 hover:text-gray-900 border border-gray-800 hover:border-white text-xs font-semibold py-2.5 rounded-lg transition-all duration-300 gap-1.5 shadow-sm">
                        <span>Lihat Project</span> 
                        <span class="transform group-hover/card:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>
            </div>
        `;

        // Masukkan kartu ke dalam container halaman utama
        projectContainer.innerHTML += projectCard;
    });
});