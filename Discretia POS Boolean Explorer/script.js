// ================= 1. EFEK BUNGA JATUH =================
const petalContainer = document.getElementById('petals-container');
const petals = ['🌸', '💮', '💖', '✨'];

setInterval(() => {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.innerText = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = Math.random() * 3 + 4 + 's'; // Durasi jatuh 4s - 7s
    petal.style.fontSize = Math.random() * 10 + 15 + 'px';
    petalContainer.appendChild(petal);
    
    // Mencegah memory leak dengan menghapus elemen yang sudah jatuh
    setTimeout(() => { petal.remove(); }, 7000);
}, 400);

// ================= 2. LOGIKA KALKULATOR POS =================
const tbody = document.getElementById('truth-table-body');
const resultBox = document.getElementById('pos-result');
let outputs = [1, 1, 1, 1, 1, 1, 1, 1]; // Semua nilai default f = 1

// Format angka ke biner 3 digit (0 -> 000, 1 -> 001)
function getBinary(num) {
    return num.toString(2).padStart(3, '0');
}

// Generate rumus Maxterm berdasarkan baris tabel (sesuai aturan aljabar boolean)
function getMaxtermFormula(num) {
    const bin = getBinary(num);
    const x = bin[0] === '0' ? 'x' : "x'";
    const y = bin[1] === '0' ? 'y' : "y'";
    const z = bin[2] === '0' ? 'z' : "z'";
    return `(${x} + ${y} + ${z})`;
}

// Generate Tabel Interaktif
for (let i = 0; i < 8; i++) {
    const bin = getBinary(i);
    const maxterm = getMaxtermFormula(i);
    
    const tr = document.createElement('tr');
    tr.id = `row-${i}`;
    tr.innerHTML = `
        <td>${bin[0]}</td>
        <td>${bin[1]}</td>
        <td>${bin[2]}</td>
        <td class="maxterm-label">M${i} = ${maxterm}</td>
        <td>
            <button class="toggle-btn" data-val="1" onclick="toggleBtn(${i}, this)">
                1
                <div class="bloom-effect" id="bloom-${i}"></div>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Fungsi ketika tombol f(x,y,z) di-klik
function toggleBtn(index, btn) {
    // Ubah nilai (Toggle antara 0 dan 1)
    outputs[index] = outputs[index] === 1 ? 0 : 1;
    btn.setAttribute('data-val', outputs[index]);
    
    const row = document.getElementById(`row-${index}`);
    
    // Jika user memilih 0 (Bentuk Maxterm POS aktif)
    if (outputs[index] === 0) {
        row.classList.add('active-row');
        btn.innerHTML = `0 <div class="bloom-effect bloom-animate"></div>`; // Picu bunga mekar
    } else {
        row.classList.remove('active-row');
        btn.innerHTML = `1 <div class="bloom-effect"></div>`;
    }

    updateFormula();
}

// Update pengetikan rumus kanonik POS di kotak hasil
function updateFormula() {
    let selectedMaxterms = [];
    let indexM = [];
    
    for (let i = 0; i < 8; i++) {
        if (outputs[i] === 0) {
            selectedMaxterms.push(getMaxtermFormula(i));
            indexM.push(i);
        }
    }

    if (selectedMaxterms.length === 0) {
        resultBox.innerHTML = `<span class="placeholder-text">f(x,y,z) = 1 (Pilih nilai 0 pada tabel)</span>`;
    } else {
        const funcStr = `f(x,y,z) = Π(${indexM.join(', ')}) <br><br> = ${selectedMaxterms.join(' . ')}`;
        resultBox.innerHTML = `<span class="typing-text">${funcStr}</span>`;
    }
}

// Fungsi untuk menerapkan soal custom dari user (Fitur Baru)
function applyCustomMaxterms() {
    const inputVal = document.getElementById('custom-maxterms').value;
    
    // Ambil angka dari input, pisahkan dengan koma, dan filter hanya angka valid (0-7)
    const maxterms = inputVal.split(',')
                             .map(n => parseInt(n.trim()))
                             .filter(n => !isNaN(n) && n >= 0 && n <= 7);
    
    // Reset semua nilai tabel ke 1 (Default)
    outputs = [1, 1, 1, 1, 1, 1, 1, 1];
    
    // Ubah nilai baris yang sesuai dengan input user menjadi 0
    maxterms.forEach(m => {
        outputs[m] = 0;
    });
    
    // Perbarui tampilan tabel dan tombol secara otomatis
    for (let i = 0; i < 8; i++) {
        const btn = document.querySelector(`#row-${i} .toggle-btn`);
        const row = document.getElementById(`row-${i}`);
        
        btn.setAttribute('data-val', outputs[i]);
        
        if (outputs[i] === 0) {
            row.classList.add('active-row');
            btn.innerHTML = `0 <div class="bloom-effect bloom-animate"></div>`;
        } else {
            row.classList.remove('active-row');
            btn.innerHTML = `1 <div class="bloom-effect"></div>`;
        }
    }
    
    // Perbarui hasil rumus
    updateFormula();
}

// ================= 3. ANIMASI SCROLL REVEAL =================
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
reveal(); // Panggil sekali saat web pertama dibuka

// ================= 4. DATA & LOGIKA LATIHAN SOAL =================
const dataSoal = [
    {
        tanya: "1. Tentukan POS dari f(x,y,z) = Π(0, 2)",
        jawab: "Maxterm 0 (000) ➡️ (x + y + z)<br>Maxterm 2 (010) ➡️ (x + y' + z)<br><b>Hasil: f(x,y,z) = (x+y+z)(x+y'+z)</b>"
    },
    {
        tanya: "2. Apakah (x+y)(x+y') bentuk kanonik untuk 2 peubah?",
        jawab: "Ya, karena setiap suku penjumlahan sudah mengandung tepat 2 buah peubah (x dan y)."
    },
    {
        tanya: "3. Ubah f(x,y) = x menjadi bentuk POS kanonik!",
        jawab: "f(x,y) = x + 0 = x + yy'<br>Dengan distributif: <b>(x + y)(x + y')</b>"
    },
    {
        tanya: "4. Jika f bernilai 0 saat input bernilai 111, apa maxtermnya?",
        jawab: "Input 111 berarti x=1, y=1, z=1. Pada POS, angka 1 berarti komplemen.<br><b>Hasil: (x' + y' + z')</b> atau M7."
    },
    {
        tanya: "5. Apa perbedaan utama POS dan SOP?",
        jawab: "POS melihat output <b>0</b>, menjumlahkan literal lalu mengalikannya (Maxterm).<br>SOP melihat output <b>1</b>, mengalikan literal lalu menjumlahkannya (Minterm)."
    }
];

const soalContainer = document.getElementById('soal-container');
dataSoal.forEach((soal, index) => {
    soalContainer.innerHTML += `
        <div class="soal-item">
            <div class="soal-header" onclick="toggleSoal(${index})">${soal.tanya} <span>+</span></div>
            <div class="soal-content" id="soal-isi-${index}">
                <b>Solusi:</b><br>${soal.jawab}
            </div>
        </div>
    `;
});

function toggleSoal(id) {
    const content = document.getElementById(`soal-isi-${id}`);
    const isVisible = content.style.display === "block";
    
    // Tutup semua tab jawaban terlebih dahulu
    document.querySelectorAll('.soal-content').forEach(el => el.style.display = "none");
    
    // Buka hanya yang di-klik
    if (!isVisible) {
        content.style.display = "block";
    }
}
