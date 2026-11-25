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
  // --- Penalaran Umum (14 soal baru: Induktif 5, Deduktif 5, Kuantitatif 4) ---
  // Semua jawaban dicek tangan 2026-11-25: pola bilangan/huruf dihitung
  // ulang, silogisme diuji validitasnya, soal kuantitatif diselesaikan ulang.
  {
    id: "contoh-pu-1",
    subtest: "penalaran-umum",
    subtopic: "Induktif",
    text: "Perhatikan pola bilangan berikut: 2, 6, 12, 20, 30, .... Bilangan berikutnya adalah ...",
    options: ["38", "40", "42", "44", "46"],
    answerIndex: 2,
    explanation:
      "Selisih antar suku: 4, 6, 8, 10 — bertambah 2 setiap langkah, jadi selisih berikutnya 12. Suku berikutnya = 30 + 12 = 42. (Cara lain: suku ke-n adalah n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, lalu 6×7 = 42.)",
    source: "contoh",
  },
  {
    id: "contoh-pu-2",
    subtest: "penalaran-umum",
    subtopic: "Induktif",
    text: "Perhatikan pola huruf berikut: A, C, F, J, O, .... Huruf berikutnya adalah ...",
    options: ["S", "T", "V", "W", "U"],
    answerIndex: 4,
    explanation:
      "Urutkan huruf menurut abjad: A=1, C=3, F=6, J=10, O=15. Selisihnya 2, 3, 4, 5 — bertambah 1 setiap langkah, jadi selisih berikutnya 6. Huruf berikutnya = 15 + 6 = 21, yaitu U.",
    source: "contoh",
  },
  {
    id: "contoh-pu-3",
    subtest: "penalaran-umum",
    subtopic: "Induktif",
    text: "Perhatikan pola bilangan berikut: 3, 5, 9, 15, 23, .... Bilangan berikutnya adalah ...",
    options: ["33", "29", "31", "35", "37"],
    answerIndex: 0,
    explanation:
      "Selisih antar suku: 2, 4, 6, 8 — bilangan genap yang bertambah 2 setiap langkah, jadi selisih berikutnya 10. Suku berikutnya = 23 + 10 = 33.",
    source: "contoh",
  },
  {
    id: "contoh-pu-4",
    subtest: "penalaran-umum",
    subtopic: "Induktif",
    text: "Jika kata KODE ditulis sebagai 11-15-4-5, kata BUKU ditulis sebagai ...",
    options: ["2-20-11-20", "2-21-11-21", "3-21-11-21", "2-21-10-21", "2-21-11-20"],
    answerIndex: 1,
    explanation:
      "Setiap huruf diganti nomor urutnya dalam abjad: K=11, O=15, D=4, E=5. Maka B=2, U=21, K=11, U=21, sehingga BUKU = 2-21-11-21.",
    source: "contoh",
  },
  {
    id: "contoh-pu-5",
    subtest: "penalaran-umum",
    subtopic: "Induktif",
    text: "Tiga toko buku di kota yang sama mencatat penjualan buku anak naik 25 persen setelah membuka area baca anak. Manakah simpulan yang paling tepat dari temuan tersebut?",
    options: [
      "Semua toko buku di Indonesia akan mengalami kenaikan penjualan yang sama jika membuka area baca anak.",
      "Buku anak adalah buku yang paling laris di semua toko buku.",
      "Toko buku yang tidak membuka area baca pasti akan bangkrut.",
      "Area baca anak mungkin berkontribusi pada kenaikan penjualan buku anak di toko-toko tersebut.",
      "Anak-anak hanya mau membeli buku di toko yang memiliki area baca.",
    ],
    answerIndex: 3,
    explanation:
      "Data hanya berasal dari tiga toko di satu kota, jadi simpulan harus hati-hati: area baca mungkin berkontribusi pada kenaikan itu. Pilihan lain melebih-lebihkan: menggeneralisasi ke semua toko di Indonesia, mengklaim buku anak paling laris, memastikan kebangkrutan, atau memakai kata \"hanya\" yang tidak didukung data.",
    source: "contoh",
  },
  {
    id: "contoh-pu-6",
    subtest: "penalaran-umum",
    subtopic: "Deduktif",
    text: "Semua anggota klub catur adalah siswa kelas 12. Sebagian siswa kelas 12 mengikuti olimpiade matematika. Manakah simpulan yang PASTI benar?",
    options: [
      "Semua anggota klub catur mengikuti olimpiade matematika.",
      "Sebagian anggota klub catur mengikuti olimpiade matematika.",
      "Tidak ada anggota klub catur yang mengikuti olimpiade matematika.",
      "Semua siswa kelas 12 adalah anggota klub catur.",
      "Tidak dapat dipastikan apakah ada anggota klub catur yang mengikuti olimpiade matematika.",
    ],
    answerIndex: 4,
    explanation:
      "Premis hanya menyatakan bahwa sebagian siswa kelas 12 mengikuti olimpiade — tanpa menjelaskan apakah sebagian itu mencakup anggota klub catur atau tidak. Anggota klub bisa saja seluruhnya ikut, sebagian ikut, atau tidak ada yang ikut. Jadi tidak ada simpulan pasti selain ketidakpastian itu sendiri.",
    source: "contoh",
  },
  {
    id: "contoh-pu-7",
    subtest: "penalaran-umum",
    subtopic: "Deduktif",
    text: "Jika hari hujan, jalanan menjadi basah. Hari ini jalanan tidak basah. Manakah simpulan yang pasti benar?",
    options: [
      "Hari ini tidak hujan.",
      "Hari ini hujan.",
      "Jalanan kering karena panas matahari.",
      "Hari ini mungkin hujan, mungkin juga tidak.",
      "Sebagian jalanan basah, sebagian lagi tidak.",
    ],
    answerIndex: 0,
    explanation:
      "Ini modus tollens: jika P maka Q; Q tidak terjadi; maka P tidak terjadi. Hujan mengakibatkan jalanan basah — karena jalanan tidak basah, hujan pasti tidak turun. Pilihan lain tidak mengikuti aturan logika tersebut.",
    source: "contoh",
  },
  {
    id: "contoh-pu-8",
    subtest: "penalaran-umum",
    subtopic: "Deduktif",
    text: "Semua programmer di perusahaan X bisa menulis Python. Andi bisa menulis Python. Manakah simpulan yang tepat?",
    options: [
      "Andi pasti programmer di perusahaan X.",
      "Andi mungkin programmer di perusahaan X, tetapi hal itu tidak dapat dipastikan.",
      "Andi pasti bukan programmer di perusahaan X.",
      "Semua orang yang bisa menulis Python adalah programmer di perusahaan X.",
      "Andi pasti bekerja di perusahaan X.",
    ],
    answerIndex: 1,
    explanation:
      "Premis menyatakan semua programmer X bisa Python — bukan sebaliknya. Kemampuan Python tidak membuktikan seseorang adalah programmer X (kesalahan penalaran affirming the consequent). Andi bisa saja programmer di tempat lain atau belajar Python sendiri. Jadi hanya \"mungkin\" yang benar, tanpa kepastian.",
    source: "contoh",
  },
  {
    id: "contoh-pu-9",
    subtest: "penalaran-umum",
    subtopic: "Deduktif",
    text: "Jika Rani lulus ujian, ia akan mendapat beasiswa. Jika Rani mendapat beasiswa, ia akan kuliah di luar negeri. Ternyata Rani tidak kuliah di luar negeri. Manakah simpulan yang pasti benar?",
    options: [
      "Rani lulus ujian.",
      "Rani mendapat beasiswa.",
      "Rani tidak lulus ujian.",
      "Rani kuliah di dalam negeri.",
      "Tidak dapat disimpulkan apa-apa dari informasi tersebut.",
    ],
    answerIndex: 2,
    explanation:
      "Rantai implikasi: lulus → beasiswa → kuliah di luar negeri. Dengan kontraposisi: tidak kuliah di luar negeri → tidak mendapat beasiswa → tidak lulus ujian. Jadi Rani pasti tidak lulus ujian. Pilihan \"kuliah di dalam negeri\" tidak pasti — ia bisa saja tidak kuliah sama sekali.",
    source: "contoh",
  },
  {
    id: "contoh-pu-10",
    subtest: "penalaran-umum",
    subtopic: "Deduktif",
    text: "Tidak ada siswa yang terlambat yang diizinkan masuk tanpa surat. Dedi masuk tanpa surat. Manakah simpulan yang pasti benar?",
    options: [
      "Dedi terlambat.",
      "Dedi membawa surat.",
      "Dedi tidak diizinkan masuk.",
      "Dedi tidak terlambat.",
      "Tidak dapat dipastikan apakah Dedi terlambat atau tidak.",
    ],
    answerIndex: 3,
    explanation:
      "Aturannya: terlambat → wajib membawa surat. Dedi masuk tanpa surat, jadi ia tidak mungkin termasuk kelompok yang terlambat — jika ia terlambat, ia harus membawa surat. Maka Dedi pasti tidak terlambat.",
    source: "contoh",
  },
  {
    id: "contoh-pu-11",
    subtest: "penalaran-umum",
    subtopic: "Kuantitatif",
    text: "Harga sebuah barang naik 20 persen, kemudian turun 20 persen dari harga setelah kenaikan. Dibandingkan dengan harga awal, harga akhir barang tersebut ...",
    options: ["Sama dengan harga awal", "Turun 4 persen", "Naik 4 persen", "Naik 2 persen", "Turun 2 persen"],
    answerIndex: 1,
    explanation:
      "Misal harga awal 100. Setelah naik 20%: 120. Setelah turun 20% dari 120: 120 × 0,8 = 96. Dibandingkan harga awal 100, harga akhir turun 4 persen. (Turunnya dihitung dari harga yang sudah naik, sehingga lebih besar dari kenaikannya.)",
    source: "contoh",
  },
  {
    id: "contoh-pu-12",
    subtest: "penalaran-umum",
    subtopic: "Kuantitatif",
    text: "Dalam suatu kelompok, perbandingan jumlah siswa laki-laki dan perempuan adalah 3 : 5. Jika jumlah seluruh siswa 40 orang, berapa selisih jumlah siswa perempuan dan laki-laki?",
    options: ["8", "12", "10", "15", "5"],
    answerIndex: 2,
    explanation:
      "Perbandingan 3 : 5 berarti 8 bagian = 40 orang, jadi 1 bagian = 5 orang. Laki-laki = 3 × 5 = 15 orang, perempuan = 5 × 5 = 25 orang. Selisihnya = 25 − 15 = 10 orang.",
    source: "contoh",
  },
  {
    id: "contoh-pu-13",
    subtest: "penalaran-umum",
    subtopic: "Kuantitatif",
    text: "Sebuah kereta menempuh jarak 120 km dalam 2 jam. Jika kecepatannya ditambah 20 km/jam, berapa waktu yang dibutuhkan kereta itu untuk menempuh jarak 240 km?",
    options: ["2 jam", "2,5 jam", "3,5 jam", "3 jam", "4 jam"],
    answerIndex: 3,
    explanation:
      "Kecepatan awal = 120 ÷ 2 = 60 km/jam. Setelah ditambah 20 km/jam menjadi 80 km/jam. Waktu untuk 240 km = 240 ÷ 80 = 3 jam.",
    source: "contoh",
  },
  {
    id: "contoh-pu-14",
    subtest: "penalaran-umum",
    subtopic: "Kuantitatif",
    text: "Rata-rata 4 bilangan adalah 15. Jika tiga bilangan pertama adalah 12, 18, dan 20, bilangan keempat adalah ...",
    options: ["10", "8", "12", "14", "16"],
    answerIndex: 0,
    explanation:
      "Jumlah keempat bilangan = 4 × 15 = 60. Jumlah tiga bilangan pertama = 12 + 18 + 20 = 50. Bilangan keempat = 60 − 50 = 10.",
    source: "contoh",
  },
  // --- Pengetahuan dan Pemahaman Umum (14 soal baru: Leksikal 5, Informasi umum 5, Pengetahuan umum 4) ---
  // Fakta-fakta di bawah ini adalah pengetahuan umum yang mapan dan dapat
  // diverifikasi (misalnya dari KBBI, SNPMB, dan sumber resmi lainnya).
  {
    id: "contoh-ppu-1",
    subtest: "pengetahuan-umum",
    subtopic: "Leksikal",
    text: "Kata \"lestari\" dalam kalimat \"Hutan itu harus dijaga agar tetap lestari\" paling dekat maknanya dengan ...",
    options: ["luas", "abadi dan tetap bertahan", "hijau", "sunyi", "rimbun"],
    answerIndex: 1,
    explanation:
      "Lestari berarti tetap ada dan tidak berubah atau tidak punah — bertahan dalam jangka panjang. \"Abadi dan tetap bertahan\" paling dekat dengan makna itu. \"Luas\", \"hijau\", \"sunyi\", dan \"rimbun\" menggambarkan sifat lain dari hutan, bukan kelestariannya.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-2",
    subtest: "pengetahuan-umum",
    subtopic: "Leksikal",
    text: "Lawan kata dari \"abstrak\" adalah ...",
    options: ["nyata dan konkret", "gaib", "samar", "rumit", "luas"],
    answerIndex: 0,
    explanation:
      "Abstrak berarti tidak berwujud dan hanya ada dalam pikiran. Lawannya adalah \"nyata dan konkret\" — sesuatu yang berwujud dan dapat diamati. \"Gaib\" dan \"samar\" justru sejalan dengan abstrak, bukan lawannya.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-3",
    subtest: "pengetahuan-umum",
    subtopic: "Leksikal",
    text: "Dalam konteks kebencanaan, kata \"mitigasi\" berarti ...",
    options: [
      "peringatan dini sebelum bencana terjadi",
      "upaya mengurangi risiko dan dampak bencana",
      "evakuasi massal penduduk dari daerah bencana",
      "pemulihan pascabencana",
      "pendataan jumlah korban bencana",
    ],
    answerIndex: 1,
    explanation:
      "Mitigasi bencana adalah segala upaya untuk mengurangi risiko dan dampak bencana — misalnya membangun tanggul, menetapkan tata ruang, atau menanam mangrove. Peringatan dini, evakuasi, pemulihan, dan pendataan adalah kegiatan berbeda dalam manajemen bencana.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-4",
    subtest: "pengetahuan-umum",
    subtopic: "Leksikal",
    text: "Kata \"inovasi\" paling dekat maknanya dengan ...",
    options: ["penemuan dan pembaruan", "peniruan", "perbaikan kecil", "tradisi", "peninggalan"],
    answerIndex: 0,
    explanation:
      "Inovasi berarti penemuan atau pembaruan — memperkenalkan sesuatu yang baru atau cara baru yang lebih baik. \"Peniruan\" dan \"tradisi\" justru berlawanan dengan makna itu, sedangkan \"perbaikan kecil\" terlalu sempit.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-5",
    subtest: "pengetahuan-umum",
    subtopic: "Leksikal",
    text: "Dalam kalimat \"Ia bersikap apatis terhadap politik\", kata \"apatis\" berarti ...",
    options: [
      "sangat peduli",
      "acuh tak acuh dan tidak peduli",
      "sangat aktif",
      "penuh semangat",
      "kritis dan tajam",
    ],
    answerIndex: 1,
    explanation:
      "Apatis berarti tidak peduli dan tidak menunjukkan minat terhadap sesuatu — acuh tak acuh. Lawannya adalah peduli, aktif, dan bersemangat, sehingga pilihan-pilihan itu salah.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-6",
    subtest: "pengetahuan-umum",
    subtopic: "Informasi umum",
    text: "Ibukota provinsi Kalimantan Timur adalah ...",
    options: ["Samarinda", "Balikpapan", "Pontianak", "Banjarmasin", "Tarakan"],
    answerIndex: 0,
    explanation:
      "Samarinda adalah ibukota provinsi Kalimantan Timur. Balikpapan adalah kota besar lain di provinsi yang sama; Pontianak adalah ibukota Kalimantan Barat; Banjarmasin adalah ibukota Kalimantan Selatan; Tarakan adalah kota di Kalimantan Utara.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-7",
    subtest: "pengetahuan-umum",
    subtopic: "Informasi umum",
    text: "Sungai terpanjang di Indonesia adalah ...",
    options: ["Mahakam", "Barito", "Kapuas", "Musi", "Bengawan Solo"],
    answerIndex: 2,
    explanation:
      "Sungai Kapuas di Kalimantan Barat, dengan panjang sekitar 1.143 km, adalah sungai terpanjang di Indonesia. Sungai Mahakam (sekitar 920 km), Barito, Musi, dan Bengawan Solo lebih pendek.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-8",
    subtest: "pengetahuan-umum",
    subtopic: "Informasi umum",
    text: "Lembaga yang berwenang menetapkan dan melaksanakan kebijakan moneter di Indonesia adalah ...",
    options: ["Kementerian Keuangan", "Otoritas Jasa Keuangan (OJK)", "Bappenas", "Bank Indonesia", "Lembaga Penjamin Simpanan (LPS)"],
    answerIndex: 3,
    explanation:
      "Bank Indonesia adalah bank sentral yang menetapkan dan melaksanakan kebijakan moneter (misalnya suku bunga acuan). Kementerian Keuangan mengurus kebijakan fiskal, OJK mengawasi jasa keuangan, Bappenas merencanakan pembangunan, dan LPS menjamin simpanan nasabah.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-9",
    subtest: "pengetahuan-umum",
    subtopic: "Informasi umum",
    text: "Bahasa resmi negara Brasil adalah ...",
    options: ["Spanyol", "Inggris", "Portugis", "Prancis", "Italia"],
    answerIndex: 2,
    explanation:
      "Brasil, bekas jajahan Portugal, memakai bahasa Portugis sebagai bahasa resmi — berbeda dari sebagian besar negara Amerika Selatan lainnya yang berbahasa Spanyol.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-10",
    subtest: "pengetahuan-umum",
    subtopic: "Informasi umum",
    text: "Organisasi internasional yang bertujuan menjaga perdamaian dunia dan didirikan pada tahun 1945 adalah ...",
    options: ["ASEAN", "NATO", "Uni Eropa", "APEC", "Perserikatan Bangsa-Bangsa (PBB)"],
    answerIndex: 4,
    explanation:
      "Perserikatan Bangsa-Bangsa (PBB) didirikan pada 1945 setelah Perang Dunia II dengan tujuan menjaga perdamaian dan keamanan internasional. ASEAN (1967) adalah organisasi kawasan Asia Tenggara; NATO adalah aliansi pertahanan; APEC adalah forum kerja sama ekonomi.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-11",
    subtest: "pengetahuan-umum",
    subtopic: "Pengetahuan umum",
    text: "Ilmuwan yang merumuskan hukum gravitasi universal adalah ...",
    options: ["Galileo Galilei", "Albert Einstein", "Johannes Kepler", "Isaac Newton", "Nikola Tesla"],
    answerIndex: 3,
    explanation:
      "Isaac Newton merumuskan hukum gravitasi universal dalam karyanya Philosophiae Naturalis Principia Mathematica (1687). Galileo dikenal lewat teleskop dan gerak benda jatuh, Kepler lewat hukum gerak planet, dan Einstein lewat relativitas.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-12",
    subtest: "pengetahuan-umum",
    subtopic: "Pengetahuan umum",
    text: "Peristiwa Rengasdengklok — ketika Soekarno dan Hatta dibawa ke Rengasdengklok untuk mendesak proklamasi kemerdekaan — terjadi pada tanggal ...",
    options: ["14 Agustus 1945", "15 Agustus 1945", "16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945"],
    answerIndex: 2,
    explanation:
      "Rengasdengklok terjadi pada 16 Agustus 1945 — sehari sebelum proklamasi kemerdekaan pada 17 Agustus 1945. Pada 14 Agustus Jepang menyerah kepada Sekutu, dan pada 18 Agustus PPKI mengesahkan UUD 1945.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-13",
    subtest: "pengetahuan-umum",
    subtopic: "Pengetahuan umum",
    text: "Unsur kimia dengan lambang \"Fe\" adalah ...",
    options: ["Timbal", "Seng", "Tembaga", "Perak", "Besi"],
    answerIndex: 4,
    explanation:
      "Fe berasal dari bahasa Latin ferrum, yaitu besi. Timbal berlambang Pb, seng Zn, tembaga Cu, dan perak Ag.",
    source: "contoh",
  },
  {
    id: "contoh-ppu-14",
    subtest: "pengetahuan-umum",
    subtopic: "Pengetahuan umum",
    text: "Gunung tertinggi di Indonesia adalah ...",
    options: ["Semeru", "Rinjani", "Kerinci", "Puncak Jaya", "Merapi"],
    answerIndex: 3,
    explanation:
      "Puncak Jaya (Carstensz Pyramid) di Papua, dengan ketinggian 4.884 meter di atas permukaan laut, adalah gunung tertinggi di Indonesia. Semeru (3.676 m) adalah yang tertinggi di Pulau Jawa, Kerinci (3.805 m) tertinggi di Sumatra, dan Rinjani 3.726 m.",
    source: "contoh",
  },
  // --- Pengetahuan Kuantitatif (14 soal baru: Bilangan 4, Aljabar 4, Geometri dan pengukuran 3, Data dan peluang 3) ---
  // Semua jawaban dihitung ulang secara independen 2026-11-25.
  {
    id: "contoh-pk-1",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Bilangan",
    text: "Bilangan bulat positif terkecil yang habis dibagi 6, 8, dan 12 adalah ...",
    options: ["24", "12", "48", "72", "96"],
    answerIndex: 0,
    explanation:
      "Dicari KPK dari 6, 8, dan 12. Faktorisasi prima: 6 = 2 × 3; 8 = 2³; 12 = 2² × 3. KPK = 2³ × 3 = 24. Periksa: 24 ÷ 6 = 4, 24 ÷ 8 = 3, 24 ÷ 12 = 2 — semuanya bulat, dan tidak ada bilangan lebih kecil yang memenuhi.",
    source: "contoh",
  },
  {
    id: "contoh-pk-2",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Bilangan",
    text: "Jika a = 2^5 × 3^2, berapa banyak faktor positif dari a?",
    options: ["12", "18", "15", "24", "36"],
    answerIndex: 1,
    explanation:
      "Banyak faktor positif dari a = p^m × q^n adalah (m+1)(n+1). Di sini a = 2^5 × 3^2, jadi banyak faktornya = (5+1) × (2+1) = 6 × 3 = 18.",
    source: "contoh",
  },
  {
    id: "contoh-pk-3",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Bilangan",
    text: "Sisa pembagian 7^2026 oleh 5 adalah ...",
    options: ["1", "2", "4", "3", "0"],
    answerIndex: 2,
    explanation:
      "Perhatikan sisa pembagian pangkat 7 oleh 5: 7^1 bersisa 2, 7^2 = 49 bersisa 4, 7^3 bersisa 3, 7^4 bersisa 1 — lalu polanya berulang setiap 4 pangkat. Karena 2026 = 4 × 506 + 2, sisa 7^2026 sama dengan sisa 7^2, yaitu 4.",
    source: "contoh",
  },
  {
    id: "contoh-pk-4",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Bilangan",
    text: "Jumlah semua bilangan genap antara 10 dan 30 adalah ...",
    options: ["160", "170", "190", "180", "200"],
    answerIndex: 3,
    explanation:
      "Bilangan genap antara 10 dan 30 adalah 12, 14, 16, 18, 20, 22, 24, 26, 28 — sebanyak 9 bilangan. Jumlahnya = (12 + 28) × 9 ÷ 2 = 40 × 9 ÷ 2 = 180.",
    source: "contoh",
  },
  {
    id: "contoh-pk-5",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Aljabar",
    text: "Jika x + y = 10 dan xy = 21, berapa nilai x² + y²?",
    options: ["52", "62", "79", "100", "58"],
    answerIndex: 4,
    explanation:
      "Gunakan identitas x² + y² = (x + y)² − 2xy. Substitusi: (10)² − 2 × 21 = 100 − 42 = 58.",
    source: "contoh",
  },
  {
    id: "contoh-pk-6",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Aljabar",
    text: "Himpunan penyelesaian dari |2x − 3| = 7 adalah ...",
    options: ["{−2, 5}", "{5}", "{2, 5}", "{−5, 2}", "{2, −5}"],
    answerIndex: 0,
    explanation:
      "|2x − 3| = 7 berarti 2x − 3 = 7 atau 2x − 3 = −7. Dari yang pertama: 2x = 10 → x = 5. Dari yang kedua: 2x = −4 → x = −2. Jadi himpunan penyelesaiannya {−2, 5}.",
    source: "contoh",
  },
  {
    id: "contoh-pk-7",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Aljabar",
    text: "Jika f(x) = 2x² − 3x + 1, berapa nilai f(3) − f(1)?",
    options: ["8", "10", "9", "11", "12"],
    answerIndex: 1,
    explanation:
      "f(3) = 2 × 9 − 3 × 3 + 1 = 18 − 9 + 1 = 10. f(1) = 2 × 1 − 3 × 1 + 1 = 0. Jadi f(3) − f(1) = 10 − 0 = 10.",
    source: "contoh",
  },
  {
    id: "contoh-pk-8",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Aljabar",
    text: "Dua bilangan berjumlah 25 dan selisihnya 7. Berapa hasil kali kedua bilangan itu?",
    options: ["132", "150", "144", "156", "162"],
    answerIndex: 2,
    explanation:
      "Misal bilangan-bilangan itu x dan y. x + y = 25 dan x − y = 7. Jumlahkan: 2x = 32 → x = 16, lalu y = 25 − 16 = 9. Hasil kalinya = 16 × 9 = 144.",
    source: "contoh",
  },
  {
    id: "contoh-pk-9",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Geometri dan pengukuran",
    text: "Sebuah persegi panjang memiliki keliling 40 cm dan panjang 12 cm. Berapa luas persegi panjang tersebut?",
    options: ["84 cm²", "88 cm²", "104 cm²", "96 cm²", "120 cm²"],
    answerIndex: 3,
    explanation:
      "Keliling = 2 × (panjang + lebar), jadi 40 = 2 × (12 + lebar) → 12 + lebar = 20 → lebar = 8 cm. Luas = 12 × 8 = 96 cm².",
    source: "contoh",
  },
  {
    id: "contoh-pk-10",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Geometri dan pengukuran",
    text: "Volume sebuah kubus adalah 216 cm³. Berapa luas permukaan kubus itu?",
    options: ["144 cm²", "180 cm²", "240 cm²", "256 cm²", "216 cm²"],
    answerIndex: 4,
    explanation:
      "Volume kubus = s³ = 216 → s = 6 cm (karena 6³ = 216). Luas permukaan = 6 × s² = 6 × 36 = 216 cm². (Kebetulan sama dengan volumenya secara angka, tetapi satuannya berbeda.)",
    source: "contoh",
  },
  {
    id: "contoh-pk-11",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Geometri dan pengukuran",
    text: "Sebuah segitiga siku-siku memiliki dua sisi tegak 9 cm dan 12 cm. Berapa panjang sisi miringnya?",
    options: ["15 cm", "13 cm", "14 cm", "16 cm", "17 cm"],
    answerIndex: 0,
    explanation:
      "Menurut teorema Pythagoras, sisi miring² = 9² + 12² = 81 + 144 = 225. Sisi miring = √225 = 15 cm. (Ini tripel Pythagoras 9-12-15, kelipatan 3 dari 3-4-5.)",
    source: "contoh",
  },
  {
    id: "contoh-pk-12",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Data dan peluang",
    text: "Diketahui data: 4, 7, 7, 8, 9, 12, 13. Berapa median dan modus data tersebut?",
    options: [
      "Median 7, modus 8",
      "Median 8, modus 7",
      "Median 9, modus 7",
      "Median 8, modus 9",
      "Median 7, modus 7",
    ],
    answerIndex: 1,
    explanation:
      "Data sudah terurut dan berjumlah 7 (ganjil), jadi median adalah nilai tengah, yaitu data ke-4 = 8. Modus adalah nilai yang paling sering muncul, yaitu 7 (muncul dua kali, nilai lain hanya sekali).",
    source: "contoh",
  },
  {
    id: "contoh-pk-13",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Data dan peluang",
    text: "Sebuah kantong berisi 6 bola putih dan 4 bola hitam. Satu bola diambil secara acak, lalu tanpa dikembalikan, satu bola lagi diambil. Berapa peluang kedua bola yang terambil berwarna putih?",
    options: ["1/4", "2/5", "1/3", "1/2", "3/5"],
    answerIndex: 2,
    explanation:
      "Peluang bola pertama putih = 6/10. Setelah satu bola putih diambil, tersisa 5 bola putih dari 9 bola, jadi peluang bola kedua putih = 5/9. Peluang keduanya putih = 6/10 × 5/9 = 30/90 = 1/3.",
    source: "contoh",
  },
  {
    id: "contoh-pk-14",
    subtest: "pengetahuan-kuantitatif",
    subtopic: "Data dan peluang",
    text: "Rata-rata nilai 5 siswa adalah 80. Setelah ditambah satu siswa baru, rata-rata keenam siswa menjadi 82. Berapa nilai siswa baru itu?",
    options: ["86", "88", "90", "92", "94"],
    answerIndex: 3,
    explanation:
      "Jumlah nilai 5 siswa awal = 5 × 80 = 400. Jumlah nilai 6 siswa = 6 × 82 = 492. Nilai siswa baru = 492 − 400 = 92.",
    source: "contoh",
  },
  // --- Pemahaman Bacaan dan Menulis (14 soal baru: Pemilihan gagasan 5, Penataan gagasan 5, Perbaikan gagasan 4) ---
  // Bacaan ditulis sendiri 2026-11-25; kunci dibaca ulang dari bacaannya.
  // Catatan: soal Penataan gagasan memakai rangkaian 5 kalimat (~120 kata)
  // dan soal Perbaikan gagasan memakai satu kalimat dalam konteks singkat
  // (~40 kata) — keduanya di bawah target 150 kata, dilaporkan jujur.
  {
    id: "contoh-pbm-1",
    subtest: "bacaan-menulis",
    subtopic: "Pemilihan gagasan",
    text: "Bacalah paragraf berikut.\n\nDalam dua dekade terakhir, luas ruang terbuka hijau di kota-kota besar Indonesia menyusut dengan cepat. Lahan yang dulu berupa taman dan lapangan kini berganti menjadi pusat perbelanjaan, apartemen, dan perkantoran. Padahal, berbagai penelitian menunjukkan bahwa keberadaan ruang hijau berhubungan langsung dengan kesehatan warga: udara menjadi lebih bersih, suhu lingkungan menurun, dan warga memiliki tempat untuk berolahraga serta bersosialisasi. Di beberapa kota, pemerintah daerah mulai menyadari kerugian itu dan menetapkan aturan bahwa setiap pembangunan baru wajib menyediakan sebagian lahannya sebagai ruang hijau. Namun, aturan itu sering kali tidak berjalan karena lemahnya pengawasan dan tingginya harga tanah. Sejumlah kota yang mempertahankan tamannya justru mencatat kunjungan wisata yang lebih tinggi dan nilai properti di sekitarnya yang ikut naik. Tanpa ruang hijau yang cukup, kota akan menjadi tempat yang panas, padat, dan tidak sehat bagi warganya. Oleh karena itu, melindungi ruang terbuka hijau bukan sekadar urusan keindahan kota, melainkan investasi bagi kesehatan dan kualitas hidup warganya.\n\nManakah kalimat yang paling tepat sebagai gagasan utama bacaan tersebut?",
    options: [
      "Ruang terbuka hijau di kota harus dilindungi karena bermanfaat bagi kesehatan dan kualitas hidup warga.",
      "Pembangunan pusat perbelanjaan di kota-kota besar tidak dapat dihindari.",
      "Pemerintah daerah telah menetapkan aturan tentang ruang hijau.",
      "Harga tanah di kota besar terus meningkat setiap tahun.",
    ],
    answerIndex: 0,
    explanation:
      "Seluruh paragraf mengarah pada satu gagasan: ruang hijau penting bagi kesehatan dan kualitas hidup warga sehingga harus dilindungi. Pilihan lain hanya menyebut satu detail (pembangunan mal, aturan pemerintah, harga tanah) tanpa menangkap gagasan menyeluruhnya.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-2",
    subtest: "bacaan-menulis",
    subtopic: "Pemilihan gagasan",
    text: "Bacalah paragraf berikut.\n\nAnak-anak masa kini menghabiskan waktu berjam-jam di depan layar: menonton video, bermain gim, dan menggulir media sosial. Berbagai penelitian menunjukkan bahwa paparan layar yang berlebihan berkaitan dengan menurunnya kemampuan berkonsentrasi dan berkurangnya waktu tidur. Anak yang tidur kurang dari delapan jam cenderung lebih sulit memahami pelajaran di sekolah. Namun, melarang layar sepenuhnya bukanlah jawaban yang realistis — teknologi sudah menjadi bagian dari kehidupan sehari-hari dan banyak materi belajar kini tersedia secara digital. Para ahli menyarankan pendekatan yang seimbang: orang tua menetapkan batas waktu layar, menyediakan waktu membaca bersama, dan memberi contoh dengan membatasi penggunaan gawai mereka sendiri. Sekolah pun dapat membantu dengan mengadakan kegiatan tanpa gawai, seperti olahraga dan kesenian, agar anak terbiasa menikmati waktu tanpa layar. Ketika batas itu diterapkan secara konsisten, anak-anak umumnya menemukan kembali minat pada permainan luar ruang dan percakapan dengan teman sebayanya. Perubahan itu tidak terjadi dalam semalam, tetapi kebiasaan kecil yang dijaga setiap hari perlahan membentuk pola yang lebih sehat.\n\nManakah kalimat yang paling tepat sebagai kalimat penutup bacaan tersebut?",
    options: [
      "Karena itu, semua gawai harus disita dari anak-anak tanpa kecuali.",
      "Dengan batas waktu layar yang jelas dan kebiasaan membaca yang dibangun bersama, anak dapat menikmati manfaat teknologi tanpa kehilangan konsentrasi dan waktu tidurnya.",
      "Sekolah sebaiknya menghapus semua pelajaran yang menggunakan teknologi.",
      "Anak-anak yang menonton video pasti akan gagal di sekolah.",
    ],
    answerIndex: 1,
    explanation:
      "Paragraf membangun gagasan tentang pendekatan seimbang: layar tidak dilarang total, tetapi dibatasi dan diimbangi kebiasaan membaca. Kalimat penutup yang tepat merangkum gagasan itu. Pilihan lain bertentangan dengan isi paragraf (melarang total, menghapus teknologi) atau melebih-lebihkan (\"pasti akan gagal\").",
    source: "contoh",
  },
  {
    id: "contoh-pbm-3",
    subtest: "bacaan-menulis",
    subtopic: "Pemilihan gagasan",
    text: "Bacalah dua paragraf berikut.\n\nPenjualan kendaraan listrik di Indonesia meningkat pesat dalam tiga tahun terakhir. Harganya yang makin terjangkau, biaya operasional yang lebih murah, serta insentif pajak dari pemerintah membuat semakin banyak warga beralih dari kendaraan berbahan bakar minyak. Di sisi lain, kesadaran lingkungan juga mendorong perubahan ini: banyak pembeli muda menyebut emisi yang lebih rendah sebagai alasan utama mereka memilih kendaraan listrik. Sejumlah produsen bahkan mulai merakit kendaraan listrik di dalam negeri, membuka lapangan kerja baru di sektor otomotif.\n\nNamun, pertumbuhan itu menghadapi satu hambatan besar: infrastruktur pengisian daya yang belum merata. Di kota-kota besar, stasiun pengisian mulai bermunculan di mal dan perkantoran, tetapi di luar Jawa jumlahnya masih sangat sedikit. Pengguna di daerah terpencil harus menempuh puluhan kilometer hanya untuk mengisi daya. Para pelaku industri menilai pemerintah perlu mempercepat pembangunan jaringan pengisian, sebab tanpa infrastruktur yang memadai, minat masyarakat akan mentok pada kalangan kota besar saja. Sejumlah perusahaan swasta sudah menyatakan kesiapannya berinvestasi, tetapi mereka menunggu kepastian aturan dan tarif listrik yang jelas dari pemerintah.\n\nGagasan utama paragraf kedua adalah ...",
    options: [
      "Penjualan kendaraan listrik meningkat pesat dalam tiga tahun terakhir.",
      "Kendaraan listrik lebih murah dan ramah lingkungan daripada kendaraan berbahan bakar minyak.",
      "Infrastruktur pengisian daya yang belum merata menjadi hambatan utama adopsi kendaraan listrik.",
      "Pemerintah memberikan insentif pajak bagi pembeli kendaraan listrik.",
    ],
    answerIndex: 2,
    explanation:
      "Paragraf kedua seluruhnya membahas satu hal: stasiun pengisian yang belum merata sebagai penghambat pertumbuhan kendaraan listrik. Pilihan lain adalah gagasan paragraf pertama (penjualan meningkat, harga murah, insentif pajak), bukan paragraf kedua.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-4",
    subtest: "bacaan-menulis",
    subtopic: "Pemilihan gagasan",
    text: "Bacalah paragraf berikut.\n\n(1) Sarapan sering disebut sebagai makanan terpenting dalam sehari, dan penelitian mendukung anggapan itu. (2) Siswa yang sarapan secara teratur cenderung lebih fokus di kelas dan memperoleh nilai yang lebih baik daripada siswa yang berangkat sekolah dengan perut kosong, terutama pada mata pelajaran yang menuntut konsentrasi tinggi seperti matematika. (3) Penjelasannya sederhana: setelah berpuasa semalaman, tubuh membutuhkan energi untuk mengaktifkan otak, dan sarapan yang mengandung protein serta karbohidrat kompleks menyediakan energi yang bertahan lama. (4) Roti pertama kali dibuat di Mesir kuno sekitar 6.000 tahun yang lalu, ketika para pembuat roti menemukan bahwa adonan yang dibiarkan semalaman dapat mengembang. (5) Sayangnya, banyak pelajar melewatkan sarapan karena terburu-buru berangkat sekolah atau karena tidak terbiasa makan di pagi hari, padahal kebiasaan kecil ini berpengaruh besar pada prestasi mereka. (6) Sekolah dapat membantu dengan menyediakan kantin yang buka lebih pagi dan mengedukasi orang tua tentang pentingnya sarapan bergizi. (7) Beberapa sekolah bahkan bekerja sama dengan ahli gizi untuk menyusun menu sarapan yang murah, bergizi, dan disukai anak-anak.\n\nKalimat bernomor berapakah yang tidak relevan dengan gagasan utama bacaan?",
    options: ["Kalimat (1)", "Kalimat (2)", "Kalimat (3)", "Kalimat (4)"],
    answerIndex: 3,
    explanation:
      "Gagasan utama bacaan adalah pentingnya sarapan bagi prestasi pelajar. Kalimat (1), (2), (3), (5), (6), dan (7) semuanya mendukung gagasan itu. Kalimat (4) membahas sejarah roti di Mesir kuno — menarik, tetapi tidak berhubungan dengan manfaat sarapan.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-5",
    subtest: "bacaan-menulis",
    subtopic: "Pemilihan gagasan",
    text: "Bacalah paragraf berikut.\n\nPembelajaran daring telah menjadi bagian tetap dari pendidikan tinggi di Indonesia. Mahasiswa kini dapat mengikuti kuliah dari mana saja, mengulang rekaman materi, dan mengakses perpustakaan digital tanpa datang ke kampus. Fleksibilitas ini sangat membantu mahasiswa yang bekerja atau tinggal jauh dari kota. Namun, pembelajaran daring juga membawa tantangan: banyak mahasiswa mengaku sulit menjaga motivasi tanpa interaksi tatap muka, dan sebagian merasa kesepian karena jarang bertemu teman sekelas. Dosen pun harus beradaptasi — materi yang efektif di kelas belum tentu efektif di layar. Penelitian terhadap kepuasan mahasiswa menunjukkan hasil yang beragam: sebagian besar menyukai fleksibilitas daring, tetapi hampir separuhnya tetap menginginkan pertemuan tatap muka secara berkala. Sejumlah kampus menjawab tantangan ini dengan model hibrida: sebagian pertemuan dilakukan daring, sebagian lagi tatap muka, sehingga mahasiswa mendapat fleksibilitas sekaligus kebersamaan. Model ini tampaknya menjadi jalan tengah yang paling masuk akal: teknologi dimanfaatkan, tetapi interaksi manusia tetap dijaga. Bahkan, beberapa kampus melaporkan bahwa tingkat kehadiran mahasiswa justru meningkat ketika sebagian pertemuan dilakukan secara tatap muka.\n\nManakah judul yang paling tepat untuk bacaan tersebut?",
    options: [
      "Pembelajaran Hibrida: Jalan Tengah antara Daring dan Tatap Muka",
      "Sejarah Pendidikan Tinggi di Indonesia",
      "Cara Membuat Video Kuliah yang Menarik",
      "Mengapa Mahasiswa Harus Tinggal di Kota",
    ],
    answerIndex: 0,
    explanation:
      "Bacaan membahas kelebihan dan kekurangan pembelajaran daring, lalu sampai pada model hibrida sebagai jalan tengah. Judul yang tepat merangkum keseluruhan isi itu. Pilihan lain hanya membahas satu sisi atau topik yang tidak ada dalam bacaan.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-6",
    subtest: "bacaan-menulis",
    subtopic: "Penataan gagasan",
    text: "Susunlah kalimat-kalimat berikut menjadi paragraf yang runtut.\n\n(A) Telur kupu-kupu yang diletakkan di bawah permukaan daun menetas menjadi ulat kecil setelah beberapa hari, dan ulat yang baru menetas itu segera mulai mencari makanan.\n(B) Selama berminggu-minggu, ulat memakan daun sebanyak-banyaknya untuk menyimpan energi, dan tubuhnya tumbuh begitu cepat sehingga kulitnya harus berganti beberapa kali.\n(C) Setelah tubuhnya cukup besar, ulat berhenti makan, menempelkan diri pada ranting, lalu membentuk kepompong keras yang melindunginya dari pemangsa.\n(D) Di dalam kepompong, tubuh ulat berubah secara menyeluruh: sebagian besar jaringannya hancur dan tersusun kembali menjadi tubuh kupu-kupu dewasa.\n(E) Akhirnya, kupu-kupu dewasa keluar dari kepompong dengan sayap yang masih basah dan lemas, lalu menunggu sayapnya mengering sebelum terbang untuk pertama kali.\n\nUrutan kalimat yang tepat adalah ...",
    options: ["B – A – C – D – E", "A – B – C – D – E", "A – C – B – E – D", "C – B – A – D – E"],
    answerIndex: 1,
    explanation:
      "Urutan ini mengikuti daur hidup kupu-kupu secara kronologis: telur menetas menjadi ulat (A), ulat makan dan tumbuh (B), ulat membentuk kepompong (C), perubahan terjadi di dalam kepompong (D), lalu kupu-kupu dewasa keluar (E). Urutan lain melanggar kronologi — misalnya kepompong tidak mungkin terbentuk sebelum ulat makan dan tumbuh.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-7",
    subtest: "bacaan-menulis",
    subtopic: "Penataan gagasan",
    text: "Susunlah kalimat-kalimat berikut menjadi paragraf yang runtut.\n\n(A) Pada awal 1990-an, telepon genggam pertama berukuran besar dan berat, hanya bisa dipakai untuk menelepon, dan harganya sangat mahal.\n(B) Memasuki tahun 2000-an, telepon genggam menjadi lebih kecil, dilengkapi pesan teks, dan mulai terjangkau oleh masyarakat umum.\n(C) Kemunculan telepon pintar pada akhir 2000-an mengubah segalanya: telepon tidak lagi sekadar alat komunikasi, melainkan komputer kecil yang bisa mengakses internet.\n(D) Sejak saat itu, berbagai aplikasi bermunculan — media sosial, peta digital, hingga layanan keuangan — dan telepon pintar menjadi bagian yang tak terpisahkan dari kehidupan sehari-hari.\n(E) Kini, hampir setiap orang membawa telepon pintar ke mana-mana, dan banyak aktivitas — dari belajar hingga berbelanja — dilakukan melalui layar kecil itu.\n\nUrutan kalimat yang tepat adalah ...",
    options: ["B – A – C – D – E", "A – C – B – D – E", "A – B – C – D – E", "C – B – A – E – D"],
    answerIndex: 2,
    explanation:
      "Penanda waktu dalam kalimat menentukan urutannya: awal 1990-an (A), tahun 2000-an (B), akhir 2000-an (C), \"sejak saat itu\" (D), dan \"kini\" (E). Urutan lain menempatkan peristiwa yang lebih baru sebelum yang lebih lama.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-8",
    subtest: "bacaan-menulis",
    subtopic: "Penataan gagasan",
    text: "Susunlah kalimat-kalimat berikut menjadi paragraf yang runtut.\n\n(A) Hujan deras yang mengguyur kota selama tiga hari berturut-turut membuat tanah tidak lagi mampu menyerap air.\n(B) Air yang tidak terserap itu mengalir ke sungai, dan permukaan sungai pun naik dengan cepat hingga melampaui tanggul.\n(C) Ketika tanggul jebol, air meluap ke permukiman di sekitar sungai dan merendam ratusan rumah.\n(D) Warga yang rumahnya terendam terpaksa mengungsi ke tempat yang lebih tinggi sambil menunggu air surut.\n(E) Setelah banjir surut, warga kembali dan membersihkan rumah mereka, sementara pemerintah memperbaiki tanggul yang rusak.\n\nUrutan kalimat yang tepat adalah ...",
    options: ["A – C – B – D – E", "B – A – D – C – E", "A – B – D – C – E", "A – B – C – D – E"],
    answerIndex: 3,
    explanation:
      "Urutan ini mengikuti rantai sebab-akibat: hujan membuat tanah jenuh (A), air mengalir ke sungai hingga meluap (B), tanggul jebol dan permukiman terendam (C), warga mengungsi (D), lalu banjir surut dan pemulihan dimulai (E). Urutan lain memutus rantai itu — misalnya tanggul tidak mungkin jebol sebelum air sungai naik.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-9",
    subtest: "bacaan-menulis",
    subtopic: "Penataan gagasan",
    text: "Susunlah kalimat-kalimat berikut menjadi paragraf yang runtut.\n\n(A) Membaca secara rutin memberikan banyak manfaat bagi pelajar.\n(B) Pertama, membaca memperluas kosakata dan memperdalam pemahaman terhadap berbagai topik.\n(C) Kedua, membaca melatih konsentrasi karena pembaca harus mengikuti alur gagasan dari awal hingga akhir.\n(D) Selain itu, membaca membiasakan seseorang berpikir kritis, sebab ia harus menilai apakah argumen penulis masuk akal.\n(E) Dengan demikian, kebiasaan membaca adalah investasi murah yang hasilnya terasa sepanjang hidup.\n\nUrutan kalimat yang tepat adalah ...",
    options: ["A – B – C – D – E", "B – A – D – C – E", "A – C – B – E – D", "E – A – B – C – D"],
    answerIndex: 0,
    explanation:
      "Paragraf yang baik dimulai dengan gagasan utama (A), diikuti rincian dengan penanda urutan \"pertama\" (B), \"kedua\" (C), \"selain itu\" (D), dan ditutup dengan simpulan \"dengan demikian\" (E). Urutan lain menempatkan simpulan atau rincian sebelum gagasan utamanya.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-10",
    subtest: "bacaan-menulis",
    subtopic: "Penataan gagasan",
    text: "Susunlah kalimat-kalimat berikut menjadi paragraf yang runtut.\n\n(A) Pertama, siapkan wadah berlubang dan kumpulkan sisa sayur, buah, serta daun kering.\n(B) Kemudian, susun bahan-bahan itu berlapis-lapis di dalam wadah dan siram dengan sedikit air agar tetap lembap.\n(C) Setelah itu, tutup wadah dan aduk isinya seminggu sekali supaya udara masuk dan proses pembusukan berjalan merata.\n(D) Dalam dua sampai tiga bulan, bahan-bahan itu akan berubah menjadi kompos yang berwarna gelap dan berbau seperti tanah.\n(E) Terakhir, campurkan kompos tersebut ke dalam tanah kebun agar tanaman tumbuh lebih subur.\n\nUrutan kalimat yang tepat adalah ...",
    options: ["B – A – C – E – D", "A – B – C – D – E", "A – C – B – D – E", "C – A – B – E – D"],
    answerIndex: 1,
    explanation:
      "Langkah-langkah membuat kompos mengikuti urutan waktu yang ditandai kata \"pertama\" (A), \"kemudian\" (B), \"setelah itu\" (C), hasil setelah dua sampai tiga bulan (D), dan \"terakhir\" (E). Urutan lain membalik langkah — misalnya mengaduk sebelum bahan disusun.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-11",
    subtest: "bacaan-menulis",
    subtopic: "Perbaikan gagasan",
    text: "Dalam sebuah laporan tentang banjir di kotanya, seorang siswa menulis kalimat berikut. Kalimat itu kurang efektif karena mengandung kerancuan dan pengulangan yang tidak perlu.\n\n\"Karena disebabkan oleh hujan yang deras, maka jalanan menjadi banjir dan tergenang oleh air yang meluap.\"\n\nManakah perbaikan yang paling tepat untuk kalimat tersebut?",
    options: [
      "Karena hujan yang deras, maka jalanan menjadi banjir.",
      "Jalanan menjadi banjir disebabkan karena hujan yang deras.",
      "Karena hujan yang deras, jalanan menjadi banjir dan tergenang air.",
      "Disebabkan oleh hujan yang deras, maka jalanan menjadi banjir.",
      "Hujan yang deras menyebabkan jalanan menjadi banjir.",
    ],
    answerIndex: 4,
    explanation:
      "Kalimat yang tepat harus menghilangkan tiga kesalahan sekaligus: \"karena disebabkan\" (pengulangan), \"maka\" setelah \"karena\" (salah), dan \"banjir dan tergenang\" (pengulangan makna). Hanya \"Hujan yang deras menyebabkan jalanan menjadi banjir\" yang bersih dari ketiganya. Pilihan lain masih menyisakan satu kesalahan.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-12",
    subtest: "bacaan-menulis",
    subtopic: "Perbaikan gagasan",
    text: "Dalam sebuah laporan kegiatan sekolah, terdapat kalimat berikut yang kurang tepat karena kesalahan pilihan kata.\n\n\"Para siswa sangat antusiasme mengikuti lomba debat.\"\n\nManakah perbaikan yang paling tepat untuk kalimat tersebut?",
    options: [
      "Para siswa sangat antusiasme dalam mengikuti lomba debat.",
      "Para siswa mengikuti lomba debat dengan sangat antusiasme.",
      "Para siswa sangat antusias mengikuti lomba debat.",
      "Para siswa sangat antusiasme mengikuti lomba debat itu.",
    ],
    answerIndex: 2,
    explanation:
      "\"Antusiasme\" adalah kata benda (rasa antusias), sedangkan yang dibutuhkan di sini adalah kata sifat \"antusias\" untuk menerangkan siswa. Hanya pilihan ketiga yang memperbaiki pilihan kata itu; pilihan lain tetap memakai \"antusiasme\" atau hanya mengulang kalimat asal.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-13",
    subtest: "bacaan-menulis",
    subtopic: "Perbaikan gagasan",
    text: "Dalam sebuah cerita pendek, terdapat kalimat berikut yang kurang tepat karena objeknya tidak lengkap.\n\n\"Setelah membaca buku itu, Rani memberikan kepada adiknya.\"\n\nManakah perbaikan yang paling tepat untuk kalimat tersebut?",
    options: [
      "Setelah membaca buku itu, Rani memberikan kepada adiknya.",
      "Setelah membaca buku itu, Rani memberikannya adiknya.",
      "Setelah membaca buku itu, Rani memberikan adiknya.",
      "Setelah membaca buku itu, Rani memberikannya kepada adiknya.",
    ],
    answerIndex: 3,
    explanation:
      "Kata kerja \"memberikan\" membutuhkan objek yang diberikan. \"Memberikannya\" (memberikan + -nya, merujuk pada buku itu) melengkapi kalimat. Pilihan kedua menghilangkan \"kepada\" sehingga salah, dan pilihan ketiga justru bermakna Rani memberikan adiknya sendiri. Hanya pilihan keempat yang lengkap dan tepat.",
    source: "contoh",
  },
  {
    id: "contoh-pbm-14",
    subtest: "bacaan-menulis",
    subtopic: "Perbaikan gagasan",
    text: "Dalam sebuah laporan perusahaan, terdapat kalimat berikut yang kurang efektif karena bertele-tele dan memakai kata sambung yang salah.\n\n\"Dalam rangka untuk meningkatkan kualitas, maka perusahaan melakukan pelatihan, mengadakan seminar, dan juga memberikan beasiswa.\"\n\nManakah perbaikan yang paling tepat untuk kalimat tersebut?",
    options: [
      "Dalam rangka untuk meningkatkan kualitas, maka perusahaan melakukan pelatihan, mengadakan seminar, dan juga memberikan beasiswa.",
      "Dalam rangka untuk meningkatkan kualitas, perusahaan melakukan pelatihan, mengadakan seminar, dan juga memberikan beasiswa.",
      "Dalam rangka meningkatkan kualitas, maka perusahaan melakukan pelatihan dan mengadakan seminar dan memberikan beasiswa.",
      "Untuk meningkatkan kualitas, maka perusahaan melakukan pelatihan, mengadakan seminar, dan memberikan beasiswa.",
      "Untuk meningkatkan kualitas, perusahaan melakukan pelatihan, mengadakan seminar, dan memberikan beasiswa.",
    ],
    answerIndex: 4,
    explanation:
      "Perbaikan harus membuang tiga hal sekaligus: \"dalam rangka untuk\" yang bertele-tele, \"maka\" setelah frasa tujuan (salah), dan \"dan juga\" yang mubazir. Hanya pilihan kelima yang bersih dari ketiganya; pilihan lain masih menyisakan satu kesalahan.",
    source: "contoh",
  },
  // --- Literasi dalam Bahasa Inggris (14 soal baru: Main idea 4, Inference 4, Vocabulary in context 3, Author's purpose 3) ---
  // Bacaan, pertanyaan, dan pilihan jawaban dalam Bahasa Inggris; pembahasan
  // dalam Bahasa Indonesia (konsisten dengan UI app). Kunci dibaca ulang
  // dari bacaannya 2026-11-25; semua bacaan 140-190 kata (target 150-250).
  {
    id: "contoh-le-1",
    subtest: "literasi-inggris",
    subtopic: "Main idea",
    text: "Read the passage below.\n\nIn many large cities, rooftops are being turned into small farms. Residents grow tomatoes, chilies, and leafy greens in containers filled with soil and compost, harvesting enough vegetables to cover part of their weekly needs. The practice began as a hobby, but it is slowly becoming a serious response to rising food prices and concerns about where food comes from. Urban farming also reduces waste: kitchen scraps become compost, and food travels only a few meters from the rooftop to the kitchen, instead of hundreds of kilometers from a distant farm. Some neighborhoods have even started selling their surplus to neighbors, creating a small but real source of extra income. The practice is not without problems. Old buildings may not support the weight of wet soil, and setting up a drip irrigation system can cost millions of rupiah. City farming advocates admit that rooftop gardens cannot feed an entire city. Still, they argue that the value lies elsewhere: it turns residents from passive consumers into producers, even on a small scale, and it reconnects people with the food they eat.\n\nWhat is the main idea of the passage?",
    options: [
      "Urban farming helps cities produce food and reduce waste, though it faces practical limits.",
      "All city residents should grow their own food on their rooftops.",
      "Rooftop farming is too expensive to be useful for anyone.",
      "Cities should stop importing vegetables from distant farms.",
    ],
    answerIndex: 0,
    explanation:
      "Bacaan menyajikan manfaat pertanian kota (hasil panen, kompos, penghasilan tambahan, warga menjadi produsen) sekaligus keterbatasannya (struktur bangunan, biaya irigasi, bukan solusi menyeluruh). Pilihan pertama merangkum keduanya. Pilihan lain melebih-lebihkan (\"semua warga harus\", \"terlalu mahal untuk siapa pun\") atau menyimpulkan hal yang tidak dinyatakan (melarang impor).",
    source: "contoh",
  },
  {
    id: "contoh-le-2",
    subtest: "literasi-inggris",
    subtopic: "Inference",
    text: "Read the passage below.\n\nThe public library in the small town of Waringin used to close at five in the afternoon. Then, during the final exam season, the librarian noticed something: every evening, dozens of students gathered outside the locked doors, reading under the streetlights because their homes were too crowded and noisy to study in. The librarian asked the town council for permission to stay open until nine. The council agreed, on one condition — the library had to pay for its own electricity. The librarian solved that problem by asking local shops to sponsor the extra hours, and within a week, three shop owners had agreed. Soon the library was full every evening. Students shared tables, helped each other with difficult subjects, and borrowed more books than ever before. By the end of the exam season, the average scores at the local high school had risen noticeably. The council, impressed by the result, made the late hours permanent. Today, the library stays open until nine every night, and the librarian says the evening crowd is the best thing that ever happened to the place.\n\nWhat can be inferred from the passage?",
    options: [
      "The students preferred studying under streetlights to studying inside the library.",
      "The library's longer hours helped students study better and improved their exam results.",
      "The town council originally wanted the library to close earlier.",
      "Local shop owners sponsored the library because they wanted more customers.",
    ],
    answerIndex: 1,
    explanation:
      "Bacaan menunjukkan rantai yang jelas: perpustakaan buka lebih lama → siswa belajar bersama setiap malam → pinjaman buku naik → nilai rata-rata sekolah naik. Itu inferensi yang didukung bukti. Siswa berkumpul di bawah lampu jalan karena perpustakaan terkunci, bukan karena lebih suka di luar; dewan tidak pernah mengusulkan tutup lebih awal; dan motif toko tidak disebutkan.",
    source: "contoh",
  },
  {
    id: "contoh-le-3",
    subtest: "literasi-inggris",
    subtopic: "Vocabulary in context",
    text: "Read the passage below.\n\nWhen the river flooded the village of Kalijati for the third time in five years, many outsiders expected the residents to give up and move away. Instead, the villagers rebuilt their homes on taller stilts, planted bamboo along the riverbanks to hold the soil, and formed a warning system in which the first household to spot rising water would ring a bell. What surprised visitors most was not the rebuilding itself, but the mood in which it was done: people worked together, shared tools, and even joked while they worked. The village head said that floods had become a part of life, and the only choice was to live with them wisely. Over time, the damage from each flood became smaller, not because the floods were weaker, but because the village was better prepared. Kalijati became known in the region as a resilient community — one that bends under pressure but does not break.\n\nIn the passage, the word \"resilient\" most nearly means ...",
    options: [
      "very wealthy",
      "extremely large",
      "able to recover quickly from difficulties",
      "difficult to understand",
    ],
    answerIndex: 2,
    explanation:
      "Konteksnya jelas: desa itu dilanda banjir berulang kali, tetapi warganya membangun kembali, bersiap lebih baik, dan kerusakannya makin kecil — bahkan kalimat terakhir menjelaskannya langsung: \"bends under pressure but does not break\" (lentur di bawah tekanan tetapi tidak patah). Jadi \"resilient\" berarti mampu pulih dengan cepat dari kesulitan.",
    source: "contoh",
  },
  {
    id: "contoh-le-4",
    subtest: "literasi-inggris",
    subtopic: "Author's purpose",
    text: "Read the passage below.\n\nMost people assume that a four-day work week must mean less work gets done. The evidence suggests the opposite. When a large company in New Zealand tried a four-day week, productivity stayed the same — and in some teams, it rose. Employees reported less stress, better sleep, and more time with their families, while the company kept its output. The reason is simple: a shorter week forces people to cut the waste out of their days — the long meetings, the unnecessary emails, the hours spent looking busy. Critics say the idea only works for office jobs, and they have a point. A hospital or a factory cannot simply close an extra day. But even there, the principle can be adapted through staggered schedules. The four-day week is not a fantasy. It is a practical change that has already been tested, and the results deserve a serious hearing from every employer.\n\nWhat is the author's main purpose in writing this passage?",
    options: [
      "To describe the history of the working week",
      "To explain how hospitals schedule their staff",
      "To tell a story about a company in New Zealand",
      "To persuade readers that a four-day work week is practical and worth trying",
    ],
    answerIndex: 3,
    explanation:
      "Penulis menyajikan bukti (uji coba di Selandia Baru, produktivitas tetap), mengakui keberatan (tidak semua pekerjaan cocok) lalu menjawabnya, dan menutup dengan ajakan agar pemberi kerja mempertimbangkan gagasan itu secara serius. Itu adalah argumen persuasif, bukan sekadar sejarah, penjelasan jadwal rumah sakit, atau cerita tentang satu perusahaan.",
    source: "contoh",
  },
  {
    id: "contoh-le-5",
    subtest: "literasi-inggris",
    subtopic: "Main idea",
    text: "Read the passage below.\n\nTwo kilometers below the surface of the ocean, sunlight never reaches. Yet this dark world is far from empty. Scientists who send cameras into the deep sea have found fish that glow in the dark, crabs that live around volcanic vents, and worms that survive in water hot enough to boil an egg. These creatures do not depend on sunlight at all; instead, they live on chemicals rising from cracks in the ocean floor. New species are discovered on almost every expedition, and many of them have no eyes at all, having evolved in a world where sight is useless. Studying them has changed how scientists think about life itself. If life can survive in such extreme conditions on Earth, some argue, it might also exist in the dark oceans hidden under the ice of distant moons such as Europa. Exploring the deep sea is therefore not just a curiosity. It is a window into the limits of life — and a guide for the search for life beyond our planet.\n\nWhat is the main idea of the passage?",
    options: [
      "The deep sea is completely empty because sunlight never reaches it.",
      "Deep-sea life survives without sunlight and helps scientists understand the limits of life.",
      "Europa is the only moon that might have life under its ice.",
      "Volcanic vents are the hottest places in the ocean.",
    ],
    answerIndex: 1,
    explanation:
      "Bacaan menjelaskan bahwa kehidupan laut dalam bertahan tanpa cahaya matahari (bergantung pada bahan kimia) dan bahwa mempelajarinya mengubah cara ilmuwan memahami batas-batas kehidupan, bahkan memandu pencarian kehidupan di luar Bumi. Pilihan lain salah: laut dalam justru tidak kosong; Europa disebut sebagai contoh, bukan satu-satunya; dan ventil vulkanik hanya salah satu detail.",
    source: "contoh",
  },
  {
    id: "contoh-le-6",
    subtest: "literasi-inggris",
    subtopic: "Inference",
    text: "Read the passage below.\n\nDr. Lestari spent twelve years studying a single colony of wild bees in a forest in Sumatra. Every morning, she walked two hours to the hive, sat quietly for hours, and wrote down everything she saw: which flowers the bees visited, how they danced to tell each other where food was, and how the colony reacted when a storm approached. Other researchers told her the work was too slow and too narrow. Why study one colony when she could survey a hundred? She answered that only long, patient observation could reveal patterns that quick surveys miss. She was right. In her ninth year, she noticed something no one had recorded before: the bees changed their dance when the forest was about to flower, days before any human observer could see a difference in the trees. Her findings are now used to predict flowering seasons and to help farmers time their planting.\n\nWhat can be inferred from the passage?",
    options: [
      "Dr. Lestari's colleagues thought her research was too broad.",
      "Quick surveys are always more useful than long observations.",
      "Long, patient observation can reveal patterns that short studies miss.",
      "Bees only dance when a storm is approaching.",
    ],
    answerIndex: 2,
    explanation:
      "Bacaan menunjukkan bahwa pengamatan panjang Dr. Lestari menemukan pola yang tidak pernah tercatat (lebah mengubah tariannya sebelum hutan berbunga) — sesuatu yang survei cepat tidak akan menangkap. Rekan-rekannya justru menganggap penelitiannya terlalu sempit, bukan terlalu luas; dan lebah menari untuk menunjukkan lokasi makanan, bukan hanya saat badai.",
    source: "contoh",
  },
  {
    id: "contoh-le-7",
    subtest: "literasi-inggris",
    subtopic: "Vocabulary in context",
    text: "Read the passage below.\n\nThe city of Semarang faces flooding almost every rainy season. The ground is sinking, the sea is rising, and the old drainage canals can no longer carry the water away. The city government has tried several ways to mitigate the problem: it has built a sea wall, raised the roads in the lowest districts, and restored the mangrove forests along the coast. The mangroves are especially important, because their roots slow the waves and trap sediment, gradually rebuilding the shoreline. Residents have also been asked to stop pumping groundwater, which is one of the main reasons the land is sinking in the first place. None of these measures will stop the flooding completely, but together they have reduced the number of flooded days each year. Engineers say the city must keep investing in these defenses for decades, because the forces causing the floods — sinking land and a rising sea — will not disappear soon.\n\nIn the passage, the word \"mitigate\" most nearly means ...",
    options: [
      "to make a problem less severe",
      "to completely eliminate",
      "to ignore",
      "to cause",
    ],
    answerIndex: 0,
    explanation:
      "Konteksnya: pemerintah membangun tanggul laut, meninggikan jalan, dan memulihkan mangrove — dan bacaan menegaskan bahwa langkah-langkah itu tidak menghentikan banjir sepenuhnya, tetapi mengurangi jumlah hari banjir. Jadi \"mitigate\" berarti membuat masalah menjadi kurang parah, bukan menghilangkannya sama sekali.",
    source: "contoh",
  },
  {
    id: "contoh-le-8",
    subtest: "literasi-inggris",
    subtopic: "Author's purpose",
    text: "Read the passage below.\n\nCoral reefs cover less than one percent of the ocean floor, yet they support about a quarter of all marine life. They are also natural breakwaters: a healthy reef can absorb most of the energy of an incoming wave, protecting the coast behind it from erosion and storm damage. When reefs die — bleached by warming water or smothered by pollution — the coast loses that shield, and the fish that depended on the reef disappear with it. In some places, local communities have started growing coral fragments in underwater nurseries and transplanting them onto damaged reefs, a slow but hopeful form of repair. Scientists say that protecting reefs is not only about saving colorful fish; it is about keeping coastlines safe and fishing villages fed. Without reefs, small island nations would face higher waves, saltier farmland, and fewer fish to eat. Yet reefs are disappearing faster than they can recover, and the window to protect them is closing.\n\nWhat is the author's main purpose in writing this passage?",
    options: [
      "To persuade readers to visit coral reefs",
      "To compare different kinds of fish",
      "To describe the history of coral research",
      "To argue that coral reefs are too expensive to protect",
      "To inform readers about the importance of coral reefs and the effects of their loss",
    ],
    answerIndex: 4,
    explanation:
      "Penulis menjelaskan fakta-fakta tentang terumbu karang (menopang seperempat kehidupan laut, melindungi pantai, dan apa yang terjadi bila terumbu mati) tanpa menyerukan tindakan tertentu — tujuannya memberi informasi. Ia tidak mengajak pembaca berkunjung, tidak membandingkan jenis ikan, tidak membahas sejarah penelitian, dan tidak berargumen bahwa perlindungan terumbu terlalu mahal.",
    source: "contoh",
  },
  {
    id: "contoh-le-9",
    subtest: "literasi-inggris",
    subtopic: "Main idea",
    text: "Read the passage below.\n\nThe city of Yogyakarta is famous for its traffic jams. Every morning, thousands of motorcycles and cars crowd the same few roads, and a trip of five kilometers can take an hour. The city government decided to fight the problem with a new bus system: comfortable buses, fixed schedules, and dedicated lanes that other vehicles cannot use. At first, few people rode the buses. Residents were used to their motorcycles and doubted that a bus could be faster. Then the city added free park-and-ride lots on the outskirts, so commuters could leave their motorcycles and take the bus for the last stretch. Ridership doubled within a year. The air became a little cleaner, and travel times on the main roads began to fall. The experiment is far from finished — many routes still need more buses — but it shows that people will switch to public transport when the service is reliable and convenient.\n\nWhat is the main idea of the passage?",
    options: [
      "Motorcycles are the main cause of all traffic problems.",
      "Yogyakarta should ban all private vehicles from its roads.",
      "Public transport in Yogyakarta is free for everyone.",
      "People will use public transport when it is reliable and convenient, as shown by Yogyakarta's bus experiment.",
    ],
    answerIndex: 3,
    explanation:
      "Bacaan menceritakan eksperimen bus Yogyakarta: awalnya sepi, lalu penumpang berlipat ganda setelah layanan dibuat nyaman dan dilengkapi park-and-ride — dan kalimat penutup merangkum gagasannya. Pilihan lain salah: motor tidak disebut sebagai satu-satunya penyebab; tidak ada usulan larangan kendaraan; dan yang gratis hanyalah tempat parkir, bukan busnya.",
    source: "contoh",
  },
  {
    id: "contoh-le-10",
    subtest: "literasi-inggris",
    subtopic: "Inference",
    text: "Read the passage below.\n\nIn the village of Sukamaju, night used to fall early. Without electricity, families cooked and ate by the light of kerosene lamps, and children stopped studying as soon as the sun went down. Then a small aid program installed a solar lamp in every home: a panel on the roof, a battery, and a bright lamp that could burn for five hours. Within months, the village changed. Children studied in the evenings, and their test scores rose. Shops stayed open an hour longer, and their owners earned more. Women wove and sewed after dark, adding to the family income. The lamps also saved money: families no longer bought kerosene every week, and the money they saved was often spent on books and school supplies. When the program ended, the villagers pooled their money to buy replacement batteries themselves — a sign that they valued the lamps enough to pay for them.\n\nWhat can be inferred from the passage?",
    options: [
      "The solar lamps were too expensive for the villagers to maintain.",
      "Access to evening light improved studying, income, and family spending in the village.",
      "The villagers preferred kerosene lamps to solar lamps.",
      "The aid program built a power plant in the village.",
    ],
    answerIndex: 1,
    explanation:
      "Bacaan menunjukkan tiga dampak sekaligus: anak belajar di malam hari dan nilainya naik, toko buka lebih lama dan penghasilan naik, serta uang yang tadinya untuk minyak tanah dialihkan ke buku dan alat sekolah. Warga bahkan patungan membeli baterai pengganti — bukti mereka menghargai lampu itu, bukan menganggapnya terlalu mahal atau lebih memilih lampu minyak.",
    source: "contoh",
  },
  {
    id: "contoh-le-11",
    subtest: "literasi-inggris",
    subtopic: "Vocabulary in context",
    text: "Read the passage below.\n\nIn 1969, a small change in the way rice was planted proved pivotal for Indonesia's food supply. Researchers introduced a new variety of rice that matured faster and produced more grain per hectare. At first, only a few farmers were willing to try it — the seeds cost more, and the new variety needed more fertilizer. But those who tried it harvested nearly twice as much rice as before, and their neighbors quickly followed. Within a decade, rice production had risen so much that the country, which once imported rice every year, could feed itself. The moment the new variety was introduced is now seen as a turning point: a single decision that changed the course of the nation's agriculture. The new rice also needed careful water management, so the government built irrigation channels and trained farmers to use them. Agricultural historians still point to that decade as proof that a well-tested innovation, adopted at the right time, can transform an entire economy.\n\nIn the passage, the word \"pivotal\" most nearly means ...",
    options: [
      "very small",
      "extremely expensive",
      "of crucial importance",
      "quickly forgotten",
    ],
    answerIndex: 2,
    explanation:
      "Konteksnya: perubahan kecil dalam cara menanam padi itu digambarkan sebagai \"turning point\" yang mengubah arah pertanian nasional dan membuat negara bisa swasembada pangan. Jadi \"pivotal\" berarti sangat penting / menentukan. \"Very small\" justru bertentangan dengan dampaknya, dan varietas itu tidak dilupakan — sejarawan masih membahasnya.",
    source: "contoh",
  },
  {
    id: "contoh-le-12",
    subtest: "literasi-inggris",
    subtopic: "Author's purpose",
    text: "Read the passage below.\n\nEvery year, the fashion industry produces billions of garments, and a large share of them are worn only a few times before being thrown away. These cheap clothes are made to be replaced quickly: new styles arrive every week, prices stay low, and shoppers are encouraged to buy more than they need. The cost is hidden. The factories that make these clothes often pay low wages and use large amounts of water and chemicals, while the discarded garments pile up in landfills, where synthetic fabrics can take centuries to break down. The solution is not to stop buying clothes altogether, but to buy fewer, better-made items, to repair what we own, and to think about who made our clothes and at what price. Some shoppers have started buying second-hand clothes, while others mend torn garments instead of replacing them. Fashion does not have to be wasteful — but that will only change when shoppers demand better.\n\nWhat is the author's main purpose in writing this passage?",
    options: [
      "To explain how to start a clothing factory",
      "To describe the latest fashion trends",
      "To list the names of popular clothing brands",
      "To tell readers that synthetic fabrics never break down",
      "To persuade readers to buy less and choose better-made clothes",
    ],
    answerIndex: 4,
    explanation:
      "Penulis memaparkan dampak fesyen cepat (upah rendah, limbah, tumpukan di tempat pembuangan) lalu menyerukan perubahan perilaku: membeli lebih sedikit, memilih barang yang lebih baik, dan memperbaiki yang dimiliki. Itu adalah argumen persuasif. Pilihan lain tidak ada dalam bacaan: tidak ada panduan mendirikan pabrik, tren terbaru, atau daftar merek.",
    source: "contoh",
  },
  {
    id: "contoh-le-13",
    subtest: "literasi-inggris",
    subtopic: "Main idea",
    text: "Read the passage below.\n\nStudents often treat sleep as the enemy of studying: the less they sleep, the more they can cram. Research says the opposite is true. During sleep, the brain replays what it learned during the day and moves memories from short-term storage into long-term storage. In one experiment, students who slept for eight hours after learning a list of words remembered far more of them the next day than students who stayed up all night. The sleep-deprived students also made more mistakes on problem-solving tasks, even though they had spent more hours studying. The lesson is not that students should study less, but that sleep is part of studying. A night of good sleep after a day of focused work consolidates what was learned — while an all-nighter erases much of it before the exam even begins. Teachers who have learned this now advise their students to review material in the evening and then sleep, rather than staying up until dawn with their notes.\n\nWhat is the main idea of the passage?",
    options: [
      "Sleep helps the brain store what was learned, so it is part of effective studying.",
      "Students should never study at night.",
      "Staying up all night is the best way to prepare for an exam.",
      "The brain stops working completely during sleep.",
    ],
    answerIndex: 0,
    explanation:
      "Bacaan berargumen bahwa tidur memindahkan ingatan ke penyimpanan jangka panjang, dan eksperimen menunjukkan siswa yang tidur justru mengingat lebih banyak daripada yang begadang. Pilihan lain bertentangan dengan isi bacaan: belajar di malam hari tidak dilarang (yang ditekankan adalah tidur setelahnya), begadang justru merugikan, dan otak tetap bekerja saat tidur.",
    source: "contoh",
  },
  {
    id: "contoh-le-14",
    subtest: "literasi-inggris",
    subtopic: "Inference",
    text: "Read the passage below.\n\nWhen Rian was fourteen, his village's well water turned brown every rainy season. The water was unsafe to drink, but buying bottled water was expensive for most families. Rian, who liked taking apart old radios, decided to build a filter from materials he could find: sand, gravel, charcoal from the kitchen stove, and a plastic bottle. His first attempts failed — the water came out almost as dirty as it went in. He kept changing the layers, testing each version, and writing down what worked. After six months, his filter produced water that was clear and, when tested at the local health center, safe to drink. Neighbors began copying his design, and within a year, most homes in the village had a filter like Rian's. The health center later used Rian's filter as an example in its hygiene classes, showing other villages how to build one themselves. He never patented the design. He said the idea belonged to anyone who needed clean water.\n\nWhat can be inferred from the passage?",
    options: [
      "Rian became rich by selling his water filter.",
      "The village well water was safe to drink during the dry season.",
      "Rian's filter worked immediately on his first try.",
      "Simple materials and persistent testing can solve a serious everyday problem.",
    ],
    answerIndex: 3,
    explanation:
      "Rian memakai bahan sederhana (pasir, kerikil, arang, botol plastik), gagal berkali-kali, terus menguji hingga berhasil, lalu desainnya ditiru satu desa. Itu menunjukkan bahwa bahan sederhana plus pengujian yang tekun dapat menyelesaikan masalah nyata. Rian tidak mematenkan atau menjual desainnya, percobaan pertamanya justru gagal, dan bacaan tidak pernah menyatakan air sumur aman di musim kemarau.",
    source: "contoh",
  },
];

/** Sample questions for one subtest (15 for matematika/literasi, 14 for the five newer subtests). */
export function sampleQuestionsFor(subtest: Question["subtest"]): Question[] {
  return SAMPLE_QUESTIONS.filter((q) => q.subtest === subtest);
}
