// Hand-written ORIGINAL sample questions at REAL SNBT level (SMA kelas 12),
// used ONLY when Firebase is not configured — so the app stays demoable
// without a real Firebase project. These are written by us for this app; they
// are NOT copied from real SNBT questions (those belong to SNPMB and are not
// freely published). Every sample question is labelled "Soal contoh" in the
// UI and carries source: "contoh". All math answers hand-verified 2026-11-25.

import { Question } from "./types";

export const SAMPLE_QUESTIONS: Question[] = [
  // --- Penalaran Matematika (5) ---
  {
    id: "contoh-mat-1",
    subtest: "matematika",
    subtopic: "Fungsi dan pertumbuhan",
    text: "Suatu jenis bakteri membelah diri menjadi dua setiap 20 menit. Jika mula-mula terdapat 100 bakteri, berapa banyak bakteri setelah 2 jam?",
    options: ["1.600", "3.200", "6.400", "12.800", "25.600"],
    answerIndex: 2,
    explanation:
      "2 jam = 120 menit, jadi terjadi 120 ÷ 20 = 6 kali pembelahan. Banyak bakteri = 100 × 2^6 = 100 × 64 = 6.400.",
    source: "contoh",
  },
  {
    id: "contoh-mat-2",
    subtest: "matematika",
    subtopic: "Peluang",
    text: "Dalam sebuah kotak terdapat 5 bola merah dan 3 bola biru. Dua bola diambil sekaligus secara acak. Berapa peluang kedua bola yang terambil berwarna sama?",
    options: ["3/14", "5/14", "3/7", "13/28", "1/2"],
    answerIndex: 3,
    explanation:
      "Pasangan sewarna: C(5,2) + C(3,2) = 10 + 3 = 13. Semua pasangan yang mungkin: C(8,2) = 28. Peluang = 13/28.",
    source: "contoh",
  },
  {
    id: "contoh-mat-3",
    subtest: "matematika",
    subtopic: "Optimasi",
    text: "Sebuah perusahaan memproduksi barang A dan barang B. Satu unit A membutuhkan 2 jam mesin dan 1 jam tenaga kerja; satu unit B membutuhkan 1 jam mesin dan 2 jam tenaga kerja. Tersedia 100 jam mesin dan 80 jam tenaga kerja per minggu. Keuntungan per unit A Rp50.000,00 dan per unit B Rp40.000,00. Berapa keuntungan maksimum per minggu?",
    options: ["Rp2.500.000,00", "Rp2.800.000,00", "Rp2.600.000,00", "Rp3.000.000,00", "Rp3.200.000,00"],
    answerIndex: 1,
    explanation:
      "Misal x unit A dan y unit B. Kendala: 2x + y ≤ 100 dan x + 2y ≤ 80. Periksa titik sudut daerah layak: (50,0) → Rp2.500.000,00; (0,40) → Rp1.600.000,00; perpotongan 2x + y = 100 dan x + 2y = 80 → x = 40, y = 20 → 40 × Rp50.000,00 + 20 × Rp40.000,00 = Rp2.800.000,00. Nilai terbesar adalah Rp2.800.000,00.",
    source: "contoh",
  },
  {
    id: "contoh-mat-4",
    subtest: "matematika",
    subtopic: "Barisan dan deret",
    text: "Suatu deret aritmetika memiliki suku ke-3 sama dengan 12 dan suku ke-7 sama dengan 28. Berapa jumlah 10 suku pertama deret tersebut?",
    options: ["200", "210", "230", "220", "240"],
    answerIndex: 3,
    explanation:
      "a + 2d = 12 dan a + 6d = 28, sehingga 4d = 16 → d = 4 dan a = 4. Jumlah 10 suku pertama: S10 = 10/2 × (2×4 + 9×4) = 5 × 44 = 220.",
    source: "contoh",
  },
  {
    id: "contoh-mat-5",
    subtest: "matematika",
    subtopic: "Statistika",
    text: "Sebuah survei terhadap 200 siswa tentang moda transportasi ke sekolah mencatat: 120 siswa naik bus, 50 siswa naik motor, dan 30 siswa berjalan kaki. Di antara siswa yang naik bus, 60% adalah perempuan; di antara yang naik motor, 40% adalah perempuan; dan 10 dari 30 siswa yang berjalan kaki adalah perempuan. Berapa persen siswa perempuan dari seluruh siswa yang disurvei?",
    options: ["51%", "45%", "48%", "54%", "60%"],
    answerIndex: 0,
    explanation:
      "Siswa perempuan: naik bus 120 × 60% = 72; naik motor 50 × 40% = 20; berjalan kaki 10. Total = 72 + 20 + 10 = 102 dari 200 siswa = 51%.",
    source: "contoh",
  },

  // --- Literasi Bahasa Indonesia (5) ---
  {
    id: "contoh-lit-1",
    subtest: "literasi",
    subtopic: "Simpulan",
    text: "Bacalah paragraf berikut.\n\nPemerintah Kota Bandung menguji coba sistem bus listrik di tiga koridor utama sejak awal 2026. Selama enam bulan pertama, jumlah penumpang naik 18 persen, sementara emisi karbon di koridor tersebut turun 12 persen. Namun, survei terhadap 400 penumpang menunjukkan bahwa 35 persen masih mengeluhkan jadwal yang tidak menentu, terutama pada jam sibuk. Para pengamat menilai hasil ini menunjukkan bahwa kendaraan listrik saja tidak cukup; tanpa perbaikan frekuensi dan ketepatan waktu, kenaikan penumpang akan sulit dipertahankan. Di sisi lain, Dinas Perhubungan menyatakan anggaran untuk menambah armada baru baru tersedia pada 2027, sehingga perbaikan layanan dalam waktu dekat hanya bisa dilakukan dengan mengatur ulang jadwal yang ada.\n\nManakah simpulan yang paling tepat berdasarkan bacaan tersebut?",
    options: [
      "Bus listrik terbukti gagal karena penumpang masih mengeluh.",
      "Keberhasilan bus listrik bergantung pada perbaikan layanan, bukan hanya pada pergantian kendaraan.",
      "Penambahan armada baru pada 2027 akan menyelesaikan seluruh masalah jadwal.",
      "Emisi karbon turun karena jumlah penumpang berkurang.",
    ],
    answerIndex: 1,
    explanation:
      "Data menunjukkan penumpang naik dan emisi turun, tetapi keluhan jadwal tetap ada dan pengamat menilai kendaraan listrik saja tidak cukup. Anggaran armada baru baru tersedia 2027, jadi simpulan yang tepat: keberhasilan bergantung pada perbaikan layanan, bukan sekadar ganti kendaraan. Pilihan lain bertentangan dengan data (penumpang naik, bukan berkurang) atau melebih-lebihkan (armada baru menyelesaikan segalanya).",
    source: "contoh",
  },
  {
    id: "contoh-lit-2",
    subtest: "literasi",
    subtopic: "Sikap penulis",
    text: "Bacalah paragraf berikut.\n\nKehadiran kecerdasan buatan di ruang kelas sering digambarkan sebagai ancaman bagi kemandirian berpikir siswa. Kekhawatiran itu tidak sepenuhnya salah: ketika jawaban tersedia dalam hitungan detik, godaan untuk menyalin tanpa memahami menjadi besar. Namun, menutup pintu bagi teknologi ini juga bukan jawaban. AI dapat menjadi mitra belajar yang efektif bila dipakai untuk menguji pemahaman — misalnya meminta AI mengajukan pertanyaan lanjutan, bukan sekadar meminta jawaban. Kuncinya bukan pada alatnya, melainkan pada cara guru dan siswa menggunakannya. Sekolah yang hanya melarang tanpa membimbing hanya akan memindahkan masalah itu ke luar kelas, di mana tidak ada yang mengawasi.\n\nBagaimana sikap penulis terhadap penggunaan AI dalam pembelajaran?",
    options: [
      "Menolak sepenuhnya karena AI merusak kemandirian berpikir.",
      "Menganggap AI tidak berpengaruh apa-apa terhadap pembelajaran.",
      "Mendukung dengan syarat AI dipakai untuk menguji pemahaman, bukan menyalin jawaban.",
      "Menyerahkan sepenuhnya keputusan kepada sekolah masing-masing.",
    ],
    answerIndex: 2,
    explanation:
      "Penulis mengakui kekhawatiran itu beralasan, tetapi menolak pelarangan total dan mengajukan syarat: AI efektif bila dipakai untuk menguji pemahaman. Jadi sikapnya mendukung dengan syarat — bukan menolak, bukan netral, dan bukan tanpa pendapat.",
    source: "contoh",
  },
  {
    id: "contoh-lit-3",
    subtest: "literasi",
    subtopic: "Evaluasi argumen",
    text: "Bacalah paragraf berikut.\n\nSejumlah penelitian menunjukkan bahwa pembaca buku cetak mengingat isi bacaan lebih baik daripada pembaca layar. Dalam sebuah eksperimen, kelompok yang membaca cerita pendek di atas kertas menjawab 20 persen lebih banyak pertanyaan pemahaman daripada kelompok yang membaca di tablet. Para peneliti menduga hal ini terjadi karena buku cetak memudahkan pembaca mengingat letak informasi di halaman — sebuah petunjuk spasial yang tidak dimiliki layar yang terus bergulir. Karena itu, sekolah sebaiknya tetap menyediakan buku cetak, terutama untuk bacaan panjang yang menuntut pemahaman mendalam.\n\nPernyataan manakah yang, jika benar, paling melemahkan argumen penulis?",
    options: [
      "Buku cetak lebih mahal diproduksi daripada e-book.",
      "Sebagian siswa lebih menyukai membaca di tablet karena praktis.",
      "Jumlah buku cetak di perpustakaan sekolah menurun dalam lima tahun terakhir.",
      "Dalam eksperimen lanjutan dengan layar yang menampilkan nomor halaman tetap, selisih skor pemahaman antara kedua kelompok menghilang.",
    ],
    answerIndex: 3,
    explanation:
      "Argumen penulis bertumpu pada petunjuk spasial (letak informasi di halaman) sebagai penyebab keunggulan buku cetak. Jika selisih skor menghilang begitu layar diberi nomor halaman tetap, mekanisme yang diklaim penulis runtuh — inilah yang paling melemahkan argumen. Pilihan lain membahas biaya, selera, atau tren, yang tidak menyentuh klaim pemahamannya.",
    source: "contoh",
  },
  {
    id: "contoh-lit-4",
    subtest: "literasi",
    subtopic: "Struktur teks",
    text: "Bacalah dua paragraf berikut.\n\nSetiap tahun, jutaan ton makanan layak konsumsi terbuang dari restoran dan supermarket di Indonesia, sementara di sisi lain jutaan orang masih mengalami kerawanan pangan. Makanan yang terbuang bukan hanya soal pemborosan: sampah organik yang membusuk di tempat pembuangan menghasilkan gas metana, salah satu gas rumah kaca yang kuat. Masalahnya bukan pada jumlah makanan yang tersedia, melainkan pada distribusinya — makanan menumpuk di tempat yang salah dan membusuk sebelum sampai ke orang yang membutuhkan.\n\nBeberapa kota mulai menjawab masalah ini dengan bank makanan: restoran dan toko menyumbangkan makanan berlebih yang masih layak, lalu relawan mendistribusikannya pada hari yang sama ke panti asuhan dan dapur umum. Sistem ini tidak menyelesaikan seluruh masalah — makanan yang mudah rusak tetap sulit disimpan — tetapi membuktikan bahwa sebagian besar pemborosan terjadi bukan karena kekurangan, melainkan karena tidak adanya jembatan antara kelebihan dan kebutuhan.\n\nApa fungsi paragraf kedua dalam bacaan tersebut?",
    options: [
      "Menawarkan solusi atas masalah yang dijelaskan pada paragraf pertama.",
      "Membantah seluruh isi paragraf pertama.",
      "Memberikan contoh lain dari masalah yang sama.",
      "Menyimpulkan bahwa masalah tersebut tidak dapat diatasi.",
    ],
    answerIndex: 0,
    explanation:
      "Paragraf pertama memaparkan masalah (makanan terbuang vs kerawanan pangan, distribusi yang gagal). Paragraf kedua memperkenalkan bank makanan sebagai jawaban atas masalah itu — lengkap dengan catatan keterbatasannya. Jadi fungsinya menawarkan solusi, bukan membantah, memberi contoh masalah lain, atau menyerah.",
    source: "contoh",
  },
  {
    id: "contoh-lit-5",
    subtest: "literasi",
    subtopic: "Inferensi",
    text: "Bacalah paragraf berikut.\n\nKetika sebuah perusahaan teknologi mengumumkan kebijakan kerja jarak jauh permanen, sambutan karyawan terbagi dua. Sebagian merayakan penghematan waktu dan biaya perjalanan; sebagian lain justru khawatir kehilangan batas antara pekerjaan dan kehidupan pribadi. Menariknya, data internal perusahaan menunjukkan bahwa produktivitas tim naik 12 persen pada kuartal pertama, tetapi tingkat pengunduran diri karyawan baru juga naik — banyak yang merasa sulit membangun kedekatan dengan rekan kerja yang belum pernah mereka temui. Manajemen akhirnya memutuskan untuk mempertahankan kebijakan itu, tetapi menambahkan pertemuan tatap muka wajib satu minggu setiap kuartal.\n\nApa yang tersirat dari bacaan tersebut?",
    options: [
      "Kerja jarak jauh selalu meningkatkan produktivitas setiap karyawan.",
      "Semua karyawan lebih menyukai bekerja dari rumah.",
      "Keberhasilan kerja jarak jauh membutuhkan upaya sengaja untuk menjaga hubungan antarkaryawan.",
      "Perusahaan akan membatalkan kebijakan kerja jarak jauh.",
    ],
    answerIndex: 2,
    explanation:
      "Bacaan tidak menyatakan langsung, tetapi dua petunjuk mengarah ke sana: karyawan baru mengundurkan diri karena sulit membangun kedekatan, dan manajemen menambahkan pertemuan tatap muka wajib. Artinya, hubungan antarkaryawan tidak terbentuk sendiri dalam kerja jarak jauh — perlu upaya yang disengaja. Pilihan lain melebih-lebihkan (\"selalu\", \"semua\") atau bertentangan dengan keputusan manajemen yang mempertahankan kebijakan.",
    source: "contoh",
  },
];

/** Sample questions for one subtest (5 per subtest). */
export function sampleQuestionsFor(subtest: Question["subtest"]): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.subtest === subtest);
}
