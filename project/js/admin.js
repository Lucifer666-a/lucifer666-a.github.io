import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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

// Elemen DOM Utama Lapis Pelindung
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");

// 🛡️ AMANKAN TEMPLATE DASHBOARD: Simpan struktur ke memori, lalu kosongkan HTML aslinya
const secureDashboardTemplate = dashboardSection.innerHTML;
dashboardSection.innerHTML = "";

// Deklarasi variabel penampung elemen dinamis dashboard
let projectForm, tableBody, btnLogout;
let pIdInput, formTitle, btnSubmit, btnCancel;

/* ==========================================================================
   1. SISTEM PROTEKSI & AUTHENTICATION (ANTI-BYPASS SECURE)
   ========================================================================== */

// Mengecek status login user secara real-time
onAuthStateChanged(auth, (user) => {
    if (user) {
        // 🔒 JIKA LOGIN BERHASIL: Amankan visual, rakit ulang struktur dashboard dari memori
        dashboardSection.innerHTML = secureDashboardTemplate;
        
        // Inisialisasi ulang seluruh penunjuk elemen DOM yang baru saja dilahirkan
        reinitDashboardDOM();
        
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        loadAdminData(); // Jalankan penarikan data
    } else {
        // ❌ JIKA LOGOUT/BELUM LOGIN: Hancurkan total isi HTML dashboard dari browser
        dashboardSection.innerHTML = "";
        loginSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
    }
});

// Fungsi membangun ulang jembatan selector DOM & Event Listener setelah HTML disuntik balik
function reinitDashboardDOM() {
    projectForm = document.getElementById("project-form");
    tableBody = document.getElementById("admin-table-body");
    btnLogout = document.getElementById("btn-logout");
    pIdInput = document.getElementById("p-id");
    formTitle = document.getElementById("form-title");
    btnSubmit = document.getElementById("btn-submit");
    btnCancel = document.getElementById("btn-cancel");

    // Pasang ulang event listener tombol logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (confirm("Apakah kamu yakin ingin keluar dari dashboard?")) {
                signOut(auth);
            }
        });
    }

    // Pasang ulang event listener tombol batal edit
    if (btnCancel) {
        btnCancel.addEventListener("click", () => {
            resetFormMode();
        });
    }

    // Pasang ulang event listener submisi data CRUD
    if (projectForm) {
        projectForm.addEventListener("submit", handleFormSubmit);
    }
}

// Proses Submit Form Login (Tetap aktif di luar pelindung)
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch(error => {
            alert("Login Gagal! Periksa email dan password kembali.\nError: " + error.message);
        });
});

/* ==========================================================================
   2. SISTEM MANAJEMEN DATA (CRUD ENGINE)
   ========================================================================== */

// Fungsi membaca data (READ) khusus untuk tabel admin
function loadAdminData() {
    onSnapshot(collection(db, "projects"), (snapshot) => {
        if (!tableBody) return; // Penjaga jika elemen belum siap
        tableBody.innerHTML = "";

        if (snapshot.empty) {
            tableBody.innerHTML = `<tr><td class="py-4 text-gray-500 text-center" colspan="2">Belum ada project terdaftar.</td></tr>`;
            return;
        }

        snapshot.forEach((snapshotDoc) => {
            const data = snapshotDoc.data();
            const id = snapshotDoc.id;
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-800 hover:bg-gray-900/30 transition";
            tr.innerHTML = `
                <td class="py-4 pr-4">
                    <div class="font-semibold text-white">${data.judul}</div>
                    <div class="text-xs text-gray-400 mt-0.5 truncate max-w-xs md:max-w-md">${data.deskripsi}</div>
                </td>
                <td class="py-4">
                    <div class="flex justify-end gap-2">
                        <button class="btn-edit text-xs bg-amber-950/40 border border-amber-900/60 text-amber-400 px-3 py-1 rounded hover:bg-amber-900/40 transition" 
                            data-id="${id}" 
                            data-judul="${data.judul}" 
                            data-deskripsi="${data.deskripsi}" 
                            data-gambar="${data.gambar}" 
                            data-link="${data.link}">
                            Edit
                        </button>
                        <button class="btn-delete text-xs bg-red-950/40 border border-red-900/60 text-red-400 px-3 py-1 rounded hover:bg-red-900/40 transition" data-id="${id}">
                            Hapus
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Hubungkan event click tombol edit setelah elemen selesai dirender
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const target = e.target;
                
                // Masukkan data lama dari dataset tombol ke dalam form input
                pIdInput.value = target.getAttribute("data-id");
                document.getElementById("p-title").value = target.getAttribute("data-judul");
                document.getElementById("p-desc").value = target.getAttribute("data-deskripsi");
                document.getElementById("p-image").value = target.getAttribute("data-gambar");
                document.getElementById("p-link").value = target.getAttribute("data-link");

                // Ubah status visual form ke Mode Edit
                formTitle.innerText = "Edit Project";
                btnSubmit.innerText = "Perbarui Database";
                btnSubmit.className = "w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 rounded-lg text-sm transition";
                btnCancel.classList.remove("hidden"); // Tampilkan tombol batal

                // Animasi scroll halus ke atas form biar ngetiknya gampang
                projectForm.scrollIntoView({ behavior: "smooth" });
            });
        });

        // Hubungkan event click tombol hapus
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const docId = e.target.getAttribute("data-id");
                if (confirm("Apakah Anda yakin ingin menghapus project ini?")) {
                    deleteDoc(doc(db, "projects", docId))
                        .then(() => {
                            if (pIdInput.value === docId) resetFormMode();
                        })
                        .catch(err => alert("Gagal menghapus: " + err.message));
                }
            });
        });
    });
}

// Fungsi Reset Form ke Mode Tambah Biasa
function resetFormMode() {
    if (!projectForm) return;
    projectForm.reset();
    pIdInput.value = "";
    formTitle.innerText = "Tambah Project Baru";
    btnSubmit.innerText = "Simpan ke Database";
    btnSubmit.className = "w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-lg text-sm transition";
    btnCancel.classList.add("hidden");
}

// Fungsi Pemroses Tambah & Perbarui Data (CREATE & UPDATE)
function handleFormSubmit(e) {
    e.preventDefault();

    const docId = pIdInput.value;
    const projectData = {
        judul: document.getElementById("p-title").value,
        deskripsi: document.getElementById("p-desc").value,
        gambar: document.getElementById("p-image").value || "https://picsum.photos/400/250",
        link: document.getElementById("p-link").value || "#"
    };

    if (docId) {
        // A. MODE UPDATE: Jika p-id ada isinya, perbarui dokumen lama
        updateDoc(doc(db, "projects", docId), projectData)
            .then(() => {
                alert("Project berhasil diperbarui!");
                resetFormMode();
            })
            .catch(err => alert("Gagal memperbarui data: " + err.message));
    } else {
        // B. MODE CREATE: Jika p-id kosong, daftarkan dokumen baru
        addDoc(collection(db, "projects"), projectData)
            .then(() => {
                projectForm.reset();
                alert("Project berhasil disimpan ke Firestore Database!");
            })
            .catch(err => err => alert("Gagal menyimpan data: " + err.message));
    }
}