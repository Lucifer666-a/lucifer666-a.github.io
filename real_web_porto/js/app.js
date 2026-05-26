// Mengimpor modul Firebase SDK yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Konfigurasi Firebase asli milikmu
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

        // Template HTML untuk kartu project bertema gelap modern
        const projectCard = `
            <div class="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between">
                <div>
                    <img src="${data.gambar || 'https://picsum.photos/400/250'}" alt="${data.judul}" class="w-full h-48 object-cover opacity-80 hover:opacity-100 transition">
                    <div class="p-5">
                        <h3 class="text-lg font-bold text-white mb-2">${data.judul}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed">${data.deskripsi}</p>
                    </div>
                </div>
                <div class="p-5 pt-0">
                    <a href="${data.link || '#'}" target="_blank" class="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 gap-1 group">
                        Lihat Project 
                        <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>
            </div>
        `;

        // Masukkan kartu ke dalam container halaman utama
        projectContainer.innerHTML += projectCard;
    });
});