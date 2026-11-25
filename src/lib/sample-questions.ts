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
  // --- Penalaran Matematika, tambahan (10 soal baru, bank total 15/subtes) ---
  {
    id: "contoh-mat-6",
    subtest: "matematika",
    subtopic: "Fungsi dan pertumbuhan",
    text: "Aplikasi pinjaman online mengenakan bunga majemuk 2% per bulan. Seseorang meminjam Rp5.000.000,00 dan tidak membayar apa pun selama 3 bulan. Berapa total utang setelah 3 bulan (dibulatkan ke rupiah terdekat)?",
    options: ["Rp5.300.000,00", "Rp5.303.020,00", "Rp5.306.000,00", "Rp5.312.000,00", "Rp5.306.040,00"],
    answerIndex: 4,
    explanation:
      "Bunga majemuk berarti bunga bulan berikutnya dihitung dari pokok ditambah bunga sebelumnya. Bulan 1: Rp5.000.000,00 × 1,02 = Rp5.100.000,00. Bulan 2: Rp5.100.000,00 × 1,02 = Rp5.202.000,00. Bulan 3: Rp5.202.000,00 × 1,02 = Rp5.306.040,00. Jadi total utang = Rp5.306.040,00. (Rp5.300.000,00 adalah jebakan bunga sederhana: 3 × 2% × Rp5.000.000,00 = Rp300.000,00.)",
    source: "contoh",
  },
  {
    id: "contoh-mat-7",
    subtest: "matematika",
    subtopic: "Peluang",
    text: "Sebuah dadu bersisi enam dilempar dua kali. Berapa peluang jumlah kedua mata dadu yang muncul sama dengan 8?",
    options: ["5/36", "1/6", "7/36", "1/4", "2/9"],
    answerIndex: 0,
    explanation:
      "Semua hasil yang mungkin ada 6 × 6 = 36. Pasangan mata dadu yang berjumlah 8 adalah (2,6), (3,5), (4,4), (5,3), dan (6,2) — sebanyak 5 pasangan. Peluang = 5/36.",
    source: "contoh",
  },
  {
    id: "contoh-mat-8",
    subtest: "matematika",
    subtopic: "Optimasi",
    text: "Sebuah toko roti membuat dua jenis kue. Satu loyang kue A membutuhkan 3 kg tepung dan 1 kg gula; satu loyang kue B membutuhkan 2 kg tepung dan 2 kg gula. Tersedia 120 kg tepung dan 80 kg gula. Keuntungan per loyang A Rp60.000,00 dan per loyang B Rp50.000,00. Berapa keuntungan maksimum?",
    options: ["Rp2.400.000,00", "Rp2.500.000,00", "Rp2.600.000,00", "Rp2.750.000,00", "Rp2.700.000,00"],
    answerIndex: 4,
    explanation:
      "Misal x loyang A dan y loyang B. Kendala: 3x + 2y ≤ 120 (tepung) dan x + 2y ≤ 80 (gula). Periksa titik sudut daerah layak: (40,0) → 40 × Rp60.000,00 = Rp2.400.000,00; (0,40) → 40 × Rp50.000,00 = Rp2.000.000,00; perpotongan 3x + 2y = 120 dan x + 2y = 80 → kurangkan: 2x = 40 → x = 20, y = 30 → 20 × Rp60.000,00 + 30 × Rp50.000,00 = Rp1.200.000,00 + Rp1.500.000,00 = Rp2.700.000,00. Nilai terbesar adalah Rp2.700.000,00.",
    source: "contoh",
  },
  {
    id: "contoh-mat-9",
    subtest: "matematika",
    subtopic: "Barisan dan deret",
    text: "Suatu barisan geometri memiliki suku ke-2 sama dengan 12 dan suku ke-5 sama dengan 96. Berapa suku ke-8 barisan tersebut?",
    options: ["384", "768", "1.536", "192", "96"],
    answerIndex: 1,
    explanation:
      "Suku ke-n barisan geometri: Un = a × r^(n−1). U2 = a × r = 12 dan U5 = a × r^4 = 96. Bagi keduanya: r^3 = 96 ÷ 12 = 8 → r = 2. Maka a = 12 ÷ 2 = 6. Suku ke-8: U8 = 6 × 2^7 = 6 × 128 = 768.",
    source: "contoh",
  },
  {
    id: "contoh-mat-10",
    subtest: "matematika",
    subtopic: "Statistika",
    text: "Rata-rata nilai ujian 40 siswa adalah 72. Setelah nilai 5 siswa baru ditambahkan, rata-rata seluruh siswa menjadi 74. Berapa rata-rata nilai kelima siswa baru tersebut?",
    options: ["78", "82", "86", "90", "94"],
    answerIndex: 3,
    explanation:
      "Jumlah nilai 40 siswa awal: 40 × 72 = 2.880. Jumlah nilai 45 siswa setelah penambahan: 45 × 74 = 3.330. Jumlah nilai 5 siswa baru: 3.330 − 2.880 = 450. Rata-rata mereka: 450 ÷ 5 = 90.",
    source: "contoh",
  },
  {
    id: "contoh-mat-11",
    subtest: "matematika",
    subtopic: "Fungsi dan pertumbuhan",
    text: "Populasi suatu kota tumbuh 5% per tahun. Jika populasi saat ini 200.000 jiwa, berapa perkiraan populasi setelah 2 tahun (dibulatkan ke jiwa terdekat)?",
    options: ["210.000", "220.000", "220.500", "221.000", "222.500"],
    answerIndex: 2,
    explanation:
      "Pertumbuhan majemuk: populasi setelah 2 tahun = 200.000 × 1,05^2 = 200.000 × 1,1025 = 220.500 jiwa. (210.000 adalah jebakan pertumbuhan sederhana: 200.000 + 2 × 5% × 200.000.)",
    source: "contoh",
  },
  {
    id: "contoh-mat-12",
    subtest: "matematika",
    subtopic: "Peluang",
    text: "Dalam sebuah kantong terdapat 4 kelereng merah, 3 kelereng hijau, dan 2 kelereng kuning. Tiga kelereng diambil sekaligus secara acak. Berapa peluang ketiganya berbeda warna?",
    options: ["1/7", "1/4", "2/9", "1/3", "2/7"],
    answerIndex: 4,
    explanation:
      "Agar ketiga kelereng berbeda warna, harus terambil 1 merah, 1 hijau, dan 1 kuning: banyak cara = 4 × 3 × 2 = 24. Semua cara mengambil 3 dari 9 kelereng: C(9,3) = 84. Peluang = 24/84 = 2/7.",
    source: "contoh",
  },
  {
    id: "contoh-mat-13",
    subtest: "matematika",
    subtopic: "Optimasi",
    text: "Suatu perusahaan menjual x unit produk dengan harga jual (100 − x) ribu rupiah per unit. Biaya produksi total adalah 20x ribu rupiah. Berapa keuntungan maksimum yang dapat diperoleh perusahaan?",
    options: ["Rp1.600.000,00", "Rp1.200.000,00", "Rp1.400.000,00", "Rp1.800.000,00", "Rp1.500.000,00"],
    answerIndex: 0,
    explanation:
      "Keuntungan (dalam ribuan rupiah): P(x) = x(100 − x) − 20x = 100x − x² − 20x = 80x − x². Ini parabola terbuka ke bawah; maksimum di titik puncak x = −b ÷ 2a = 80 ÷ 2 = 40 unit. Keuntungan maksimum: P(40) = 80 × 40 − 40² = 3.200 − 1.600 = 1.600 (ribu rupiah) = Rp1.600.000,00.",
    source: "contoh",
  },
  {
    id: "contoh-mat-14",
    subtest: "matematika",
    subtopic: "Barisan dan deret",
    text: "Jumlah 5 suku pertama suatu deret geometri adalah 93. Jika rasio deret tersebut 2, berapa suku pertama deret tersebut?",
    options: ["2", "3", "4", "5", "6"],
    answerIndex: 1,
    explanation:
      "Jumlah n suku pertama deret geometri: Sn = a × (r^n − 1) ÷ (r − 1). S5 = a × (2^5 − 1) ÷ (2 − 1) = a × 31 = 93, sehingga a = 93 ÷ 31 = 3. Periksa: 3 + 6 + 12 + 24 + 48 = 93.",
    source: "contoh",
  },
  {
    id: "contoh-mat-15",
    subtest: "matematika",
    subtopic: "Statistika",
    text: "Sebuah perpustakaan mencatat jumlah pengunjung selama 6 hari: Senin 120, Selasa 150, Rabu 90, Kamis 180, Jumat 210, Sabtu 240. Berapa median jumlah pengunjung?",
    options: ["150", "160", "175", "165", "180"],
    answerIndex: 3,
    explanation:
      "Urutkan datanya: 90, 120, 150, 180, 210, 240. Karena ada 6 data (genap), median adalah rata-rata dua nilai tengah: (150 + 180) ÷ 2 = 165.",
    source: "contoh",
  },
  // --- Literasi Bahasa Indonesia, tambahan (10 soal baru) ---
  {
    id: "contoh-lit-6",
    subtest: "literasi",
    subtopic: "Simpulan",
    text: "Bacalah paragraf berikut.\n\nDi tengah harga pangan yang fluktuatif, sejumlah warga Jakarta mulai mengubah atap rumah mereka menjadi kebun sayur. Dalam setahun, satu atap seluas 20 meter persegi dapat menghasilkan sekitar 60 kilogram sayur — cukup untuk memenuhi sebagian kebutuhan sebuah keluarga kecil. Selain menekan pengeluaran, kegiatan ini juga mengurangi sampah organik karena sisa dapur diolah menjadi kompos. Beberapa komunitas bahkan menjual kelebihan hasil kebunnya ke tetangga, menciptakan penghasilan tambahan yang kecil tetapi nyata. Namun, tidak semua atap cocok dijadikan kebun: struktur bangunan tua sering kali tidak mampu menahan beban tanah basah, dan biaya awal pemasangan sistem irigasi tetes bisa mencapai jutaan rupiah. Para pegiat pertanian kota mengakui bahwa berkebun di atap bukan solusi untuk ketahanan pangan kota secara keseluruhan, tetapi tetap bernilai sebagai pelengkap — terutama karena ia mengubah warga dari sekadar konsumen menjadi produsen, meski dalam skala kecil.\n\nManakah simpulan yang paling tepat berdasarkan bacaan tersebut?",
    options: [
      "Berkebun di atap dapat menyelesaikan masalah pangan di kota-kota besar.",
      "Semua atap rumah di Jakarta cocok dijadikan kebun sayur.",
      "Pertanian atap gagal karena biaya pemasangannya terlalu mahal.",
      "Sampah organik adalah satu-satunya manfaat berkebun di atap.",
      "Berkebun di atap bermanfaat sebagai pelengkap ketahanan pangan sekaligus mengubah peran warga, meski ada keterbatasan teknis dan biaya.",
    ],
    answerIndex: 4,
    explanation:
      "Bacaan mengakui manfaat nyata (hasil panen, kompos, penghasilan tambahan, warga menjadi produsen) sekaligus keterbatasan (struktur atap tua, biaya irigasi) dan menegaskan ini bukan solusi menyeluruh. Simpulan yang tepat merangkum keduanya. Pilihan lain salah: bacaan justru menyatakan berkebun di atap bukan solusi keseluruhan; tidak semua atap cocok; biaya tidak membuatnya gagal; dan sampah organik hanya satu dari beberapa manfaat.",
    source: "contoh",
  },
  {
    id: "contoh-lit-7",
    subtest: "literasi",
    subtopic: "Sikap penulis",
    text: "Bacalah paragraf berikut.\n\nPergantian ujian nasional menjadi asesmen nasional sering dirayakan sebagai akhir dari budaya menghafal. Memang, asesmen yang mengukur literasi dan numerasi lebih dekat dengan kemampuan berpikir yang dibutuhkan di dunia nyata daripada soal pilihan ganda yang menuntut hafalan rumus. Namun, perayaan itu berisiko prematur. Selama guru masih dinilai dari nilai yang diraih siswanya, godaan untuk 'mengajarkan soal' — melatih siswa menjawab format asesmen tanpa memahami isinya — tetap ada. Yang berubah hanyalah bentuk ujiannya, bukan logika penilaiannya. Karena itu, reformasi asesmen hanya akan bermakna bila dibarengi perubahan cara sekolah memaknai hasil: bukan sebagai vonis atas guru dan siswa, melainkan sebagai peta untuk memperbaiki pembelajaran. Sejumlah sekolah percontohan yang sudah lebih dulu mengubah cara menilai justru menunjukkan hasil yang menjanjikan: guru mulai menggunakan hasil asesmen untuk merancang remedial, bukan untuk menghukum. Tanpa perubahan itu, asesmen nasional hanya akan menjadi ujian nasional dengan nama yang berbeda.\n\nBagaimana sikap penulis terhadap pergantian ujian nasional menjadi asesmen nasional?",
    options: [
      "Mendukung dengan catatan: reformasi asesmen hanya bermakna bila cara memaknai hasil juga berubah.",
      "Menolak sepenuhnya karena asesmen nasional sama buruknya dengan ujian nasional.",
      "Menganggap pergantian itu tidak berpengaruh apa-apa terhadap pembelajaran.",
      "Mendukung tanpa syarat karena asesmen mengukur kemampuan berpikir.",
    ],
    answerIndex: 0,
    explanation:
      "Penulis memuji arah asesmen (lebih dekat dengan kemampuan berpikir) dan memberi contoh sekolah percontohan yang berhasil, tetapi menegaskan perayaan itu prematur: tanpa perubahan cara memaknai hasil, asesmen hanya menjadi ujian nasional dengan nama berbeda. Jadi sikapnya mendukung dengan catatan — bukan menolak (ia melihat nilai positifnya), bukan netral, dan bukan mendukung tanpa syarat.",
    source: "contoh",
  },
  {
    id: "contoh-lit-8",
    subtest: "literasi",
    subtopic: "Evaluasi argumen",
    text: "Bacalah paragraf berikut.\n\nBanyak orang menganggap membaca di layar sama saja dengan membaca di kertas — yang penting isinya. Padahal, sejumlah penelitian menunjukkan perbedaan yang nyata. Dalam sebuah studi, pembaca yang membaca artikel panjang di ponsel beralih ke aplikasi lain rata-rata empat kali selama membaca, sementara pembaca buku cetak hampir tidak pernah berhenti. Kelompok pembaca layar juga menjawab lebih sedikit pertanyaan tentang isi artikel. Menariknya, perbedaan itu tetap muncul bahkan ketika isi artikelnya sama persis — yang berbeda hanya medianya. Temuan serupa juga muncul pada kelompok mahasiswa: mereka yang membaca di layar membutuhkan waktu lebih lama untuk menjawab pertanyaan yang sama. Para peneliti menduga layar melatih otak untuk memindai, bukan menyelami: notifikasi, tautan, dan godaan untuk menggulir cepat membuat perhatian terpecah sebelum pemahaman sempat terbentuk. Karena itu, untuk bacaan yang menuntut pemahaman mendalam, buku cetak masih lebih unggul.\n\nPernyataan manakah yang, jika benar, paling memperkuat argumen penulis?",
    options: [
      "Harga buku cetak lebih mahal daripada perangkat elektronik.",
      "Pembaca yang membaca di layar tanpa notifikasi dan tanpa akses internet tetap beralih tugas lebih sering daripada pembaca buku cetak.",
      "Sebagian orang lebih suka membaca di ponsel karena bisa dilakukan di mana saja.",
      "Jumlah judul buku cetak yang diterbitkan menurun setiap tahun.",
    ],
    answerIndex: 1,
    explanation:
      "Argumen penulis adalah bahwa layar itu sendiri — bukan sekadar gangguan luar — memecah perhatian. Jika pembaca layar tetap beralih tugas lebih sering meski notifikasi dan internet dimatikan, penjelasan alternatif (gangguan notifikasi) gugur dan klaim penulis menguat. Pilihan lain tidak menyentuh klaimnya: harga, selera pribadi, dan tren penerbitan tidak berkaitan dengan pemahaman bacaan.",
    source: "contoh",
  },
  {
    id: "contoh-lit-9",
    subtest: "literasi",
    subtopic: "Struktur teks",
    text: "Bacalah dua paragraf berikut.\n\nJumlah wirausaha muda di Indonesia naik 40 persen dalam lima tahun terakhir. Angka ini kerap dirayakan sebagai tanda bangkitnya semangat kewirausahaan generasi muda: semakin banyak anak muda yang memilih membuka usaha sendiri daripada melamar pekerjaan. Pemerintah pun memperkuat narasi ini dengan berbagai program bantuan modal dan pelatihan bisnis bagi pemula. Program-program itu mencakup pinjaman tanpa bunga dan pelatihan digital bagi pemilik usaha baru.\n\nNamun, para peneliti ketenagakerjaan membaca angka yang sama dengan cara berbeda. Sebagian besar wirausaha muda tersebut, menurut survei, memulai usaha bukan karena melihat peluang, melainkan karena tidak menemukan pekerjaan — mereka adalah wirausaha karena terpaksa. Banyak dari mereka membuka warung makan atau toko kelontong dengan modal pinjaman keluarga, dan sebagian menutup usahanya dalam waktu kurang dari setahun. Penghasilan mereka pun umumnya tidak stabil dan berada di bawah upah minimum. Dengan kata lain, kenaikan jumlah wirausaha muda lebih mencerminkan lemahnya pasar kerja daripada kuatnya semangat berwirausaha.\n\nApa hubungan antara paragraf pertama dan paragraf kedua?",
    options: [
      "Paragraf kedua memberikan contoh yang mendukung paragraf pertama.",
      "Paragraf kedua mengulang kembali isi paragraf pertama dengan kata lain.",
      "Paragraf kedua menjelaskan latar belakang sejarah paragraf pertama.",
      "Paragraf kedua membandingkan dua kota yang berbeda.",
      "Paragraf kedua menafsirkan ulang data pada paragraf pertama dengan sudut pandang yang berlawanan.",
    ],
    answerIndex: 4,
    explanation:
      "Paragraf pertama menyajikan data kenaikan wirausaha muda dengan tafsiran umum (semangat kewirausahaan bangkit). Paragraf kedua mengambil data yang sama — angka 40 persen itu — dan menafsirkannya sebaliknya: kenaikan itu tanda lemahnya pasar kerja, karena sebagian besar memulai usaha karena terpaksa. Jadi paragraf kedua menafsirkan ulang data yang sama dengan sudut pandang berlawanan, bukan mendukung, mengulang, menjelaskan sejarah, atau membandingkan kota.",
    source: "contoh",
  },
  {
    id: "contoh-lit-10",
    subtest: "literasi",
    subtopic: "Inferensi",
    text: "Bacalah paragraf berikut.\n\nDesa Sariwangi dulu dikenal sebagai desa penghasil kopi. Sejak lima tahun lalu, desa ini berubah menjadi destinasi wisata: rumah-rumah penduduk disulap menjadi penginapan, dan para petani kini memandu tur keliling kebun. Pendapatan warga naik dua kali lipat, dan jalan desa yang dulu berlubang kini beraspal mulus. Namun, di balik angka-angka itu, ada perubahan yang jarang dibicarakan. Tarian tradisional yang dulu ditampilkan setahun sekali pada upacara panen kini dipentaskan setiap akhir pekan untuk wisatawan. Beberapa warga muda bahkan mulai mempelajari tarian itu bukan dari para tetua, melainkan dari video pertunjukan untuk wisatawan — sebuah perubahan yang tidak pernah dibayangkan generasi sebelumnya. Para tetua desa mengaku bangga desanya dikenal luas, tetapi mereka juga khawatir: ketika sebuah ritual menjadi pertunjukan rutin, maknanya perlahan bergeser dari ungkapan syukur menjadi sekadar hiburan. Kini, panen raya pun dijadwalkan mengikuti kalender wisata, bukan lagi musim tanam.\n\nApa yang tersirat dari bacaan tersebut?",
    options: [
      "Pariwisata selalu merusak budaya lokal di mana pun ia berkembang.",
      "Pendapatan warga Desa Sariwangi turun sejak desa itu menjadi destinasi wisata.",
      "Pariwisata dapat meningkatkan kesejahteraan sekaligus mengubah makna tradisi menjadi komoditas hiburan.",
      "Para tetua desa menolak seluruh kegiatan pariwisata di desanya.",
    ],
    answerIndex: 2,
    explanation:
      "Bacaan menunjukkan dua sisi sekaligus: kesejahteraan naik (pendapatan dua kali lipat, jalan beraspal), tetapi makna tradisi bergeser (tarian upacara menjadi pertunjukan rutin, panen dijadwalkan mengikuti kalender wisata). Jadi yang tersirat adalah pariwisata membawa kesejahteraan sekaligus menggeser makna tradisi menjadi komoditas hiburan. Pilihan lain salah: \"selalu\" melebih-lebihkan; pendapatan justru naik; dan para tetua bangga, bukan menolak pariwisata.",
    source: "contoh",
  },
  {
    id: "contoh-lit-11",
    subtest: "literasi",
    subtopic: "Simpulan",
    text: "Bacalah paragraf berikut.\n\nPenelitian terhadap 100.000 orang dewasa selama sepuluh tahun menemukan bahwa mereka yang paling banyak mengonsumsi makanan ultra-olahan — mi instan, minuman manis, dan camilan kemasan — memiliki risiko penyakit jantung 20 persen lebih tinggi. Data yang sama juga menunjukkan bahwa makanan ultra-olahan menyumbang hampir 60 persen kalori harian pada kelompok dengan konsumsi tertinggi — angka yang jauh di atas anjuran gizi seimbang. Para peneliti menekankan bahwa temuan ini bersifat korelasi: orang yang banyak mengonsumsi makanan tersebut cenderung juga kurang berolahraga dan lebih jarang memeriksakan kesehatan. Meski begitu, sejumlah negara telah merespons dengan mewajibkan label peringatan pada kemasan. Para ahli gizi menilai label saja tidak cukup; yang dibutuhkan adalah perubahan lingkungan pangan — misalnya membatasi iklan makanan ultra-olahan pada jam anak-anak menonton televisi — karena pilihan makan seseorang sangat dipengaruhi oleh apa yang paling mudah dan murah di sekitarnya.\n\nManakah simpulan yang paling tepat berdasarkan bacaan tersebut?",
    options: [
      "Makanan ultra-olahan berkaitan dengan risiko kesehatan yang lebih tinggi, sehingga penanganannya perlu menyentuh lingkungan pangan, bukan sekadar label.",
      "Makanan ultra-olahan terbukti menjadi penyebab langsung penyakit jantung.",
      "Label peringatan pada kemasan sudah cukup untuk mengatasi masalah ini.",
      "Orang yang mengonsumsi makanan ultra-olahan pasti tidak berolahraga.",
    ],
    answerIndex: 0,
    explanation:
      "Bacaan menyajikan hubungan antara konsumsi makanan ultra-olahan dan risiko jantung, lalu menegaskan bahwa label saja tidak cukup dan yang dibutuhkan adalah perubahan lingkungan pangan. Simpulan yang tepat merangkum keduanya. Pilihan lain salah: temuan dinyatakan bersifat korelasi, bukan bukti sebab-akibat langsung; ahli gizi justru menilai label tidak cukup; dan bacaan memakai kata \"cenderung\", bukan \"pasti\".",
    source: "contoh",
  },
  {
    id: "contoh-lit-12",
    subtest: "literasi",
    subtopic: "Sikap penulis",
    text: "Bacalah paragraf berikut.\n\nSejumlah kota besar di dunia mulai melarang kendaraan pribadi masuk ke pusat kota. Kebijakan ini dipuji karena menurunkan polusi dan mengembalikan ruang jalan bagi pejalan kaki. Namun, larangan total berisiko menjadi kebijakan yang hanya menguntungkan mereka yang tinggal di pusat kota — yang umumnya lebih kaya dan sudah dilayani transportasi umum yang baik. Bagi warga pinggiran yang mengandalkan kendaraan pribadi karena bus yang jarang dan tidak tepat waktu, larangan itu berarti perjalanan yang lebih panjang dan mahal. Beberapa kota yang sudah mencoba larangan total akhirnya melonggarkannya setelah protes dari pekerja shift malam, yang tidak memiliki pilihan transportasi umum pada jam mereka berangkat. Karena itu, sebelum melarang, kota harus lebih dulu membangun alternatifnya: transportasi umum yang andal hingga ke pinggiran. Tanpa itu, larangan kendaraan hanya memindahkan kemacetan dan polusi dari pusat kota ke kantong-kantong warga yang paling tidak mampu membelanya.\n\nBagaimana sikap penulis terhadap larangan kendaraan pribadi di pusat kota?",
    options: [
      "Mendukung penuh tanpa syarat apa pun.",
      "Menolak karena kendaraan pribadi adalah hak setiap warga.",
      "Menganggap kebijakan itu tidak berpengaruh pada polusi.",
      "Mendukung dengan syarat transportasi umum ke pinggiran diperbaiki terlebih dahulu.",
    ],
    answerIndex: 3,
    explanation:
      "Penulis mengakui manfaat larangan (polusi turun, ruang pejalan kaki kembali) tetapi menilai larangan total tidak adil bagi warga pinggiran dan pekerja shift malam, lalu mengajukan syarat: bangun dulu transportasi umum yang andal hingga ke pinggiran. Jadi sikapnya mendukung dengan syarat — bukan mendukung tanpa syarat, bukan menolak atas dasar hak, dan bukan menganggap kebijakan itu tidak berpengaruh.",
    source: "contoh",
  },
  {
    id: "contoh-lit-13",
    subtest: "literasi",
    subtopic: "Evaluasi argumen",
    text: "Bacalah paragraf berikut.\n\nSejumlah penelitian menunjukkan bahwa remaja yang memulai sekolah pukul 08.30 belajar lebih baik daripada yang memulai pukul 07.00. Dalam studi itu, siswa yang masuk lebih siang rata-rata tidur 45 menit lebih lama dan melaporkan rasa kantuk yang lebih rendah pada jam pertama pelajaran. Para peneliti menjelaskan bahwa jam biologis remaja membuat mereka sulit tidur lebih awal, sehingga jam masuk yang lebih siang berarti tidur yang lebih panjang dan konsentrasi yang lebih baik. Temuan ini sejalan dengan rekomendasi sejumlah lembaga kesehatan anak, yang menyarankan sekolah menengah tidak dimulai sebelum pukul 08.30. Para pendukung kebijakan ini berpendapat bahwa perubahan jam masuk adalah intervensi yang murah: tidak membutuhkan anggaran besar, hanya perubahan jadwal. Sebuah distrik sekolah yang memundurkan jam masuknya melaporkan nilai ujian naik dan keterlambatan berkurang. Karena itu, pemerintah daerah sebaiknya memundurkan jam masuk sekolah menengah.\n\nPernyataan manakah yang, jika benar, paling melemahkan argumen penulis?",
    options: [
      "Sebagian guru lebih menyukai jam masuk yang lebih siang.",
      "Dalam penelitian lanjutan, siswa yang tidur sama lamanya menunjukkan hasil belajar yang sama, apa pun jam masuk sekolahnya.",
      "Jam masuk sekolah di beberapa negara lebih siang daripada di Indonesia.",
      "Orang tua siswa sering kesulitan mengantar anak ke sekolah.",
    ],
    answerIndex: 1,
    explanation:
      "Argumen penulis bertumpu pada rantai sebab-akibat: jam masuk lebih siang → tidur lebih lama → belajar lebih baik. Jika siswa yang tidur sama lamanya belajar sama baiknya apa pun jam masuknya, rantai itu putus — yang menentukan adalah durasi tidur, bukan jam masuk. Inilah yang paling melemahkan argumen. Pilihan lain tidak menyentuh rantai sebab-akibat itu: selera guru, perbandingan antarnegara, dan kesulitan antar-jemput tidak berkaitan dengan klaim belajarnya.",
    source: "contoh",
  },
  {
    id: "contoh-lit-14",
    subtest: "literasi",
    subtopic: "Struktur teks",
    text: "Bacalah dua paragraf berikut.\n\nTeknologi sering dipandang sebagai jalan pintas menuju efisiensi: setiap pekerjaan yang didigitalkan diasumsikan menjadi lebih cepat dan lebih murah. Pandangan ini begitu kuat sehingga banyak organisasi mengadopsi sistem baru tanpa bertanya apakah sistem itu benar-benar menyelesaikan masalah yang ada. Anggaran besar pun digelontorkan untuk perangkat dan pelatihan, dengan harapan hasilnya segera terlihat.\n\nPengalaman sebuah rumah sakit daerah menunjukkan sisi lain dari cerita itu. Setelah beralih ke sistem rekam medis digital, waktu yang dihabiskan dokter untuk administrasi justru bertambah: mereka harus mengisi data yang sama di dua sistem yang tidak terhubung, dan ketika jaringan bermasalah, seluruh antrean pasien terhenti. Efisiensi yang dijanjikan baru terwujud setelah dua tahun, ketika sistem lama akhirnya dimatikan dan staf terbiasa. Teknologi memang dapat meningkatkan efisiensi — tetapi hanya bila ia dirancang mengikuti alur kerja penggunanya, bukan memaksa pengguna mengikuti alur sistem.\n\nApa fungsi paragraf kedua dalam bacaan tersebut?",
    options: [
      "Memberikan definisi tentang teknologi digital.",
      "Mengulang kembali klaim pada paragraf pertama.",
      "Menyimpulkan bahwa teknologi tidak pernah meningkatkan efisiensi.",
      "Membandingkan dua rumah sakit yang berbeda.",
      "Memberikan contoh tandingan yang membatasi klaim pada paragraf pertama.",
    ],
    answerIndex: 4,
    explanation:
      "Paragraf pertama menyatakan klaim umum bahwa digitalisasi diasumsikan selalu meningkatkan efisiensi. Paragraf kedua menyajikan pengalaman rumah sakit yang justru menjadi lebih lambat setelah digitalisasi — sebuah contoh tandingan yang membatasi klaim itu: efisiensi hanya terwujud bila sistem mengikuti alur kerja pengguna. Paragraf kedua bukan definisi, bukan pengulangan, bukan kesimpulan bahwa teknologi tidak pernah efisien (paragraf itu justru mengakui efisiensi akhirnya terwujud), dan bukan perbandingan dua rumah sakit.",
    source: "contoh",
  },
  {
    id: "contoh-lit-15",
    subtest: "literasi",
    subtopic: "Inferensi",
    text: "Bacalah paragraf berikut.\n\nSejak dua tahun lalu, sebuah perpustakaan keliling mengunjungi Desa Karangtengah setiap minggu. Pada bulan-bulan pertama, ratusan buku dipinjam warga — sebuah angka yang membuat penyelenggara optimistis. Namun, setelah enam bulan, jumlah pinjaman menurun tajam. Wawancara dengan warga mengungkapkan penyebabnya: sebagian besar warga bekerja di kebun dari pagi hingga sore dan pulang dalam keadaan lelah; membaca buku terasa seperti pekerjaan tambahan. Menanggapi hal itu, penyelenggara mengubah pendekatan: selain meminjamkan buku, mereka mengadakan sesi bercerita pada malam hari, ketika warga berkumpul setelah makan malam. Kehadiran pada sesi itu jauh lebih tinggi daripada angka pinjaman buku, dan beberapa warga mulai meminta buku yang berkaitan dengan cerita yang mereka dengar. Penyelenggara kini merencanakan sesi serupa di desa-desa tetangga, dengan cerita yang disesuaikan dengan kehidupan setempat. Mereka juga mulai melatih warga setempat menjadi pendongeng, agar kegiatan itu dapat berlanjut tanpa bergantung pada tim dari luar.\n\nApa yang tersirat dari bacaan tersebut?",
    options: [
      "Warga Desa Karangtengah tidak tertarik pada buku sama sekali.",
      "Perpustakaan keliling adalah program yang gagal total.",
      "Ketersediaan buku saja tidak cukup; minat baca tumbuh bila membaca disesuaikan dengan waktu dan kebiasaan warga.",
      "Sesi bercerita lebih penting daripada buku itu sendiri.",
    ],
    answerIndex: 2,
    explanation:
      "Buku sudah tersedia dan awalnya banyak dipinjam, tetapi pinjaman turun karena warga lelah sepulang kerja — lalu sesi bercerita malam hari justru ramai dan membuat warga meminta buku. Yang tersirat: menyediakan buku saja tidak cukup; minat baca tumbuh bila kegiatan membaca disesuaikan dengan waktu dan kebiasaan warga. Pilihan lain salah: warga terbukti tertarik (mereka hadir dan meminta buku); programnya tidak gagal (pendekatan baru berhasil); dan sesi bercerita justru mengantar warga kembali ke buku, bukan menggantikannya.",
    source: "contoh",
  },
];

/** Sample questions for one subtest (15 per subtest). */
export function sampleQuestionsFor(subtest: Question["subtest"]): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.subtest === subtest);
}
