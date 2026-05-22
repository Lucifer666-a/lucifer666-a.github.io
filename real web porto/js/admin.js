import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

// Inisialisasi
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elemen DOM HTML
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const projectForm = document.getElementById("project-form");
const tableBody = document.getElementById("admin-table-body");
const btnLogout = document.getElementById("btn-logout");

/* ==========================================================================
   1. SISTEM PROTEKSI & AUTHENTICATION (LOGIN/LOGOUT)
   ========================================================================== */

// Mengecek status login user secara real-time
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jika berhasil login, tampilkan dashboard & sembunyikan form login
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        loadAdminData(); // Muat data tabel
    } else {
        // Jika logout atau belum login, tampilkan form login & sembunyikan dashboard
        loginSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
    }
});

// Proses Submit Form Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch(error => {
            alert("Login Gagal! Periksa email dan password kembali.\nError: " + error.message);
        });
});

// Proses Tombol Logout
btnLogout.addEventListener("click", () => {
    signOut(auth);
});


/* ==========================================================================
   2. SISTEM MANAJEMEN DATA (CRUD - CREATE, READ, DELETE)
   ========================================================================== */

// Fungsi membaca data (READ) khusus untuk tabel admin
function loadAdminData() {
    onSnapshot(collection(db, "projects"), (snapshot) => {
        tableBody.innerHTML = "";
        
        if (snapshot.empty) {
            tableBody.innerHTML = `<tr><td class="py-4 text-gray-500 text-center" colspan="2">Belum ada project terdaftar.</td></tr>`;
            return;
        }

        snapshot.forEach((snapshotDoc) => {
            const data = snapshotDoc.data();
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-800 hover:bg-gray-900/30 transition";
            tr.innerHTML = `
                <td class="py-4 pr-4">
                    <div class="font-semibold text-white">${data.judul}</div>
                    <div class="text-xs text-gray-400 mt-0.5 truncate max-w-xs md:max-w-md">${data.deskripsi}</div>
                </td>
                <td class="py-4">
                    <button class="btn-delete text-xs bg-red-950/40 border border-red-900/60 text-red-400 px-3 py-1 rounded hover:bg-red-900/40 transition" data-id="${snapshotDoc.id}">
                        Hapus
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Hubungkan event click tombol hapus setelah element dirender
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const docId = e.target.getAttribute("data-id");
                if (confirm("Apakah Anda yakin ingin menghapus project ini?")) {
                    deleteDoc(doc.db, doc(db, "projects", docId));
                }
            });
        });
    });
}

// Proses Menambah Data Baru (CREATE)
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newProject = {
        judul: document.getElementById("p-title").value,
        deskripsi: document.getElementById("p-desc").value,
        gambar: document.getElementById("p-image").value || "https://picsum.photos/400/250",
        link: document.getElementById("p-link").value || "#"
    };

    addDoc(collection(db, "projects"), newProject)
        .then(() => {
            projectForm.reset(); // Kosongkan isi form setelah sukses input
            alert("Project berhasil disimpan ke Firestore Database!");
        })
        .catch(err => alert("Gagal menyimpan data: " + err.message));
});