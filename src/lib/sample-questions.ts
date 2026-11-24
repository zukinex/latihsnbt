// Hand-written ORIGINAL sample questions (SNBT-style), used ONLY when
// Firebase is not configured — so the app stays demoable without a real
// Firebase project. These are written by us for this app; they are NOT
// copied from real SNBT questions (those belong to SNPMB and are not
// freely published). Every sample question is labelled "Soal contoh" in
// the UI and carries source: "contoh".

import { Question } from "./types";

export const SAMPLE_QUESTIONS: Question[] = [
  // --- Penalaran Matematika (5) ---
  {
    id: "contoh-mat-1",
    subtest: "matematika",
    subtopic: "Aljabar",
    text: "Sebuah toko menjual 3 buku dan 2 pensil dengan total harga Rp47.000,00. Jika harga 1 buku adalah Rp13.000,00, berapa harga 1 pensil?",
    options: ["Rp3.000,00", "Rp4.000,00", "Rp5.000,00", "Rp6.000,00", "Rp7.000,00"],
    answerIndex: 1,
    explanation:
      "Harga 3 buku = 3 × Rp13.000,00 = Rp39.000,00. Sisa untuk 2 pensil = Rp47.000,00 − Rp39.000,00 = Rp8.000,00. Jadi harga 1 pensil = Rp8.000,00 ÷ 2 = Rp4.000,00.",
    source: "contoh",
  },
  {
    id: "contoh-mat-2",
    subtest: "matematika",
    subtopic: "Aritmetika",
    text: "Harga sebuah tas adalah Rp240.000,00. Toko memberikan diskon 25%. Berapa harga tas setelah diskon?",
    options: ["Rp150.000,00", "Rp160.000,00", "Rp170.000,00", "Rp180.000,00", "Rp200.000,00"],
    answerIndex: 3,
    explanation:
      "Diskon 25% berarti pembeli membayar 75% dari harga awal. Rp240.000,00 × 75% = Rp240.000,00 × 0,75 = Rp180.000,00.",
    source: "contoh",
  },
  {
    id: "contoh-mat-3",
    subtest: "matematika",
    subtopic: "Geometri",
    text: "Sebuah persegi panjang memiliki panjang 12 cm dan lebar 8 cm. Berapa luas persegi panjang tersebut?",
    options: ["20 cm²", "40 cm²", "80 cm²", "96 cm²", "100 cm²"],
    answerIndex: 3,
    explanation: "Luas persegi panjang = panjang × lebar = 12 cm × 8 cm = 96 cm².",
    source: "contoh",
  },
  {
    id: "contoh-mat-4",
    subtest: "matematika",
    subtopic: "Pola bilangan",
    text: "Perhatikan barisan bilangan berikut: 2, 6, 12, 20, 30, … Berapa suku berikutnya?",
    options: ["40", "42", "44", "46", "48"],
    answerIndex: 1,
    explanation:
      "Selisih antarsuku: 6−2=4, 12−6=6, 20−12=8, 30−20=10. Selisihnya bertambah 2 setiap langkah, jadi selisih berikutnya 12. Suku berikutnya = 30 + 12 = 42.",
    source: "contoh",
  },
  {
    id: "contoh-mat-5",
    subtest: "matematika",
    subtopic: "Statistika",
    text: "Nilai ulangan lima siswa adalah 70, 80, 75, 85, dan 90. Berapa rata-rata nilai kelima siswa tersebut?",
    options: ["78", "80", "82", "84", "86"],
    answerIndex: 1,
    explanation:
      "Jumlah nilai = 70 + 80 + 75 + 85 + 90 = 400. Rata-rata = 400 ÷ 5 = 80.",
    source: "contoh",
  },

  // --- Literasi Bahasa Indonesia (5) ---
  {
    id: "contoh-lit-1",
    subtest: "literasi",
    subtopic: "Ide pokok",
    text: "Bacalah paragraf berikut.\n\nWarga Desa Sukamaju bergotong royong membersihkan selokan yang tersumbat sampah setiap hari Minggu pagi. Kegiatan ini sudah berjalan selama dua tahun dan membuat lingkungan desa menjadi lebih bersih serta bebas dari genangan air saat hujan. Selain itu, kegiatan ini mempererat hubungan antartetangga.\n\nApa ide pokok paragraf tersebut?",
    options: [
      "Selokan di Desa Sukamaju sering tersumbat sampah.",
      "Warga Desa Sukamaju bergotong royong membersihkan selokan setiap Minggu pagi.",
      "Lingkungan Desa Sukamaju bebas dari genangan air.",
      "Gotong royong mempererat hubungan antartetangga.",
    ],
    answerIndex: 1,
    explanation:
      "Ide pokok adalah gagasan utama yang dibahas dalam paragraf. Paragraf ini terutama membahas kegiatan gotong royong warga membersihkan selokan — kalimat lain hanya menjelaskan dampaknya.",
    source: "contoh",
  },
  {
    id: "contoh-lit-2",
    subtest: "literasi",
    subtopic: "Makna kata",
    text: "Bacalah kalimat berikut.\n\n\"Meskipun sering gagal, Rani tetap konsisten berlatih menari setiap sore.\"\n\nApa makna kata \"konsisten\" dalam kalimat tersebut?",
    options: [
      "Cepat dan bersemangat",
      "Terus-menerus dan tidak berubah-ubah",
      "Berani dan pantang menyerah",
      "Teliti dan penuh perhitungan",
    ],
    answerIndex: 1,
    explanation:
      "Kata \"konsisten\" berarti tetap, ajek, dan tidak berubah-ubah. Dalam kalimat ini, Rani berlatih setiap sore tanpa berhenti meskipun sering gagal.",
    source: "contoh",
  },
  {
    id: "contoh-lit-3",
    subtest: "literasi",
    subtopic: "Simpulan",
    text: "Bacalah paragraf berikut.\n\nSampah plastik yang dibuang ke sungai tidak hanya mengotori air, tetapi juga membahayakan ikan dan hewan air lainnya. Plastik membutuhkan waktu ratusan tahun untuk terurai. Karena itu, banyak daerah mulai membatasi penggunaan kantong plastik sekali pakai.\n\nApa simpulan yang tepat dari paragraf tersebut?",
    options: [
      "Ikan dan hewan air memakan sampah plastik di sungai.",
      "Sampah plastik merusak lingkungan sehingga penggunaannya perlu dikurangi.",
      "Semua daerah sudah melarang kantong plastik sekali pakai.",
      "Plastik membutuhkan waktu ratusan tahun untuk diproduksi.",
    ],
    answerIndex: 1,
    explanation:
      "Simpulan merangkum isi paragraf: sampah plastik merusak sungai dan makhluk hidup serta sulit terurai, sehingga penggunaannya perlu dikurangi. Pilihan lain melebih-lebihkan atau tidak sesuai isi.",
    source: "contoh",
  },
  {
    id: "contoh-lit-4",
    subtest: "literasi",
    subtopic: "Tujuan penulis",
    text: "Bacalah paragraf berikut.\n\nMembaca buku selama lima belas menit setiap hari dapat memperkaya kosakata, melatih daya ingat, dan memperluas wawasan. Kebiasaan sederhana ini tidak membutuhkan biaya besar, tetapi manfaatnya terasa seumur hidup. Mulailah dari buku yang paling kamu sukai.\n\nApa tujuan penulis menulis paragraf tersebut?",
    options: [
      "Menjelaskan sejarah perkembangan buku bacaan.",
      "Mengajak pembaca membiasakan diri membaca buku setiap hari.",
      "Membandingkan buku cetak dengan buku digital.",
      "Menceritakan pengalaman penulis saat membaca buku.",
    ],
    answerIndex: 1,
    explanation:
      "Penulis menyebutkan manfaat membaca lalu menutup dengan ajakan \"Mulailah dari buku yang paling kamu sukai.\" Jadi tujuannya persuasif: mengajak pembaca membiasakan membaca.",
    source: "contoh",
  },
  {
    id: "contoh-lit-5",
    subtest: "literasi",
    subtopic: "Hubungan antarkalimat",
    text: "Bacalah dua kalimat berikut.\n\n(1) Hujan deras mengguyur kota sejak sore hari.\n(2) Akibatnya, beberapa ruas jalan tergenang air.\n\nApa hubungan antara kalimat (1) dan kalimat (2)?",
    options: [
      "Kalimat (2) adalah sebab dari kalimat (1).",
      "Kalimat (2) adalah akibat dari kalimat (1).",
      "Kalimat (2) bertentangan dengan kalimat (1).",
      "Kalimat (2) adalah contoh dari kalimat (1).",
    ],
    answerIndex: 1,
    explanation:
      "Kata \"akibatnya\" menandai hubungan sebab-akibat: hujan deras (sebab) menyebabkan jalan tergenang (akibat).",
    source: "contoh",
  },
];

/** Sample questions for one subtest (5 per subtest). */
export function sampleQuestionsFor(subtest: Question["subtest"]): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.subtest === subtest);
}
