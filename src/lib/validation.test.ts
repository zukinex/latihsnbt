// Tests for the Answer Validation Engine (validation.ts).
//
// Regression fixtures: the gemini-3.5-flash-lite 10-question evaluation
// (2026-11-26) — 8 invalid + 2 valid, verbatim. The validator must never
// deliver any of the 8 bad ones: 6 are INVALID, 2 are INCONCLUSIVE
// (Q1 substitution slip, Q6 underdetermined question). The 2 good ones
// (Q3, Q10) must be VALID.
import { describe, expect, it } from "vitest";
import { parseNumericValue, validateQuestion, validateQuestionSet } from "./validation";
import type { Question } from "./types";

function makeQuestion(
  overrides: Partial<Question> & {
    text: string;
    options: string[];
    answerIndex: number;
    subtopic: string;
    explanation: string;
  },
): Question {
  return {
    id: "test-q",
    subtest: "matematika",
    source: "ai",
    ...overrides,
  };
}

// --- Lite 10-question regression fixtures (verbatim, 2026-11-26) ----------

const LITE_FIXTURES: { label: string; question: Question; expected: string }[] = [
  {
    label: "Q1 bacteria growth",
    question: makeQuestion({
      id: "lite10-q1",
      subtopic: "Fungsi dan pertumbuhan",
      text: "Sebuah populasi bakteri pada suatu wadah mengalami pertumbuhan eksponensial. Pada pukul 08.00 pagi, jumlah bakteri tercatat sebanyak 400 sel. Setiap 3 jam, jumlah bakteri tersebut bertambah menjadi dua kali lipat dari jumlah sebelumnya. Jika seorang peneliti ingin mengambil sampel ketika jumlah bakteri mencapai setidaknya 25.600 sel, pada pukul berapa paling cepat peneliti tersebut harus mengambil sampel?",
      options: ["Pukul 17.00", "Pukul 20.00", "Pukul 23.00", "Pukul 02.00 hari berikutnya", "Pukul 05.00 hari berikutnya"],
      answerIndex: 1,
      explanation:
        "Pertama, tentukan rasio pertumbuhan dan rumus fungsi eksponensialnya. Diketahui jumlah awal N(0) = 400 dan waktu pelipatgandaan t = 3 jam. Kita ingin mencari waktu t ketika N(t) >= 25.600. Persamaan pertumbuhannya adalah N(t) = 400 * 2^(t/3). Substitusi nilai yang diinginkan: 25.600 = 400 * 2^(t/3). Bagi kedua sisi dengan 400: 64 = 2^(t/3). Ubah 64 menjadi basis 2: 2^6 = 2^(t/3). Samakan pangkatnya: 6 = t/3, sehingga t = 18 jam. Waktu awal adalah pukul 08.00 pagi ditambah 18 jam. Pukul 08.00 + 12 jam = 20.00 (pukul 8 malam) hari yang sama.",
    }),
    expected: "INCONCLUSIVE",
  },
  {
    label: "Q2 probability 3 balls",
    question: makeQuestion({
      id: "lite10-q2",
      subtopic: "Peluang",
      text: "Dalam sebuah kotak terdapat 5 bola merah, 4 bola putih, dan 3 bola hijau. Jika diambil 3 bola sekaligus secara acak dari dalam kotak tersebut, berapakah peluang terambilnya sedikitnya 2 bola berwarnamerah?",
      options: ["3/11", "5/22", "7/22", "4/11", "9/22"],
      answerIndex: 2,
      explanation:
        "Langkah pertama, hitung total seluruh bola dan ruang sampel (n(S)) untuk pengambilan 3 bola dari 12 bola (5+4+3). n(S) = C(12,3) = (12*11*10)/(3*2*1) = 220. Langkah kedua, tentukan syarat 'sedikitnya 2 bola merah', yang berarti kemungkinannya adalah (2 bola merah dan 1 bola non-merah) ATAU (3 bola merah dan 0 bola non-merah). Hitung kombinasi kasus 1: C(5,2) * C(7,1) = ( (5*4)/2 ) * 7 = 10 * 7 = 70. Hitung kombinasi kasus 2: C(5,3) * C(7,0) = ( (5*4*3)/(3*2*1) ) * 1 = 10 * 1 = 10. Total kejadian yang diinginkan = 70 + 10 = 80. Peluangnya adalah 80 / 220. Sederhanakan pecahan dengan membagi pembilang dan penyebut dengan 20, menghasilkan 4/11. Tunggu, mari hitung ulang: 80/220 = 8/22 = 4/11. Mari periksa pilihan, opsi c adalah 7/22, mari kita hitung ulang C(7,1). Non-merah ada 4 putih + 3 hijau = 7 bola. C(5,2)*C(7,1) = 10 * 7 = 70. C(5,3)*C(7,0) = 10 * 1 = 10. Total 80. Oh, 80/220 jika dibagi 10 menjadi 8/22, dibagi 2 menjadi 4/11. Mari kita periksa kembali pilihan d (4/11). Koreksi answerIndex menjadi 3 (pilihan ke-4).",
    }),
    expected: "INVALID",
  },
  {
    label: "Q3 fence optimisation",
    question: makeQuestion({
      id: "lite10-q3",
      subtopic: "Optimasi",
      text: "Seorang petani memiliki kawat sepanjang 60 meter yang akan digunakan untuk memagari kandang ternak berbentuk persegi panjang. Salah satu sisi kandang tersebut sudah dibatasi oleh tembok batu sehingga tidak memerlukan kawat. Berapakah luas maksimum kandang yang dapat dibuat oleh petani tersebut?",
      options: ["400 meter persegi", "450 meter persegi", "500 meter persegi", "600 meter persegi", "900 meter persegi"],
      answerIndex: 1,
      explanation:
        "Misalkan panjang sisi yang sejajar dengan tembok adalah x dan dua sisi tegak lurusnya adalah y. Keliling kawat yang tersedia digunakan untuk dua sisi y dan satu sisi x, sehingga x + 2y = 60, yang berarti x = 60 - 2y. Luas kandang L adalah L = x * y. Substitusikan x ke dalam fungsi luas: L(y) = (60 - 2y) * y = 60y - 2y^2. Untuk mencari luas maksimum, kita gunakan turunan pertama L'(y) = 0 atau menggunakan titik puncak parabola y = -b / (2a). Dari L(y) = -2y^2 + 60y, nilai a = -2 dan b = 60. Nilai y maksimum = -60 / (2 * -2) = 15. Substitusikan y = 15 ke persamaan luas: L = 60(15) - 2(15)^2 = 900 - 450 = 450 meter persegi.",
    }),
    expected: "VALID",
  },
  {
    label: "Q4 arithmetic sequence",
    question: makeQuestion({
      id: "lite10-q4",
      subtopic: "Barisan dan deret",
      text: "Suatu barisan aritmetika memiliki suku ke-3 bernilai 11 dan jumlah suku ke-6 dan suku ke-9 bernilai 61. Berapakah nilai dari suku ke-15 barisan tersebut?",
      options: ["45", "48", "51", "54", "57"],
      answerIndex: 2,
      explanation:
        "Langkah pertama, gunakan informasi yang diberikan untuk membuat sistem persamaan linear dua variabel berdasarkan rumus suku ke-n barisan aritmetika U_n = a + (n-1)b. Diketahui U_3 = a + 2b = 11 (Persamaan 1). Diketahui U_6 + U_9 = 61, yang berarti (a + 5b) + (a + 8b) = 61 atau 2a + 13b = 61 (Persamaan 2). Langkah kedua, selesaikan sistem persamaan tersebut. Dari Persamaan 1, a = 11 - 2b. Substitusikan ke Persamaan 2: 2(11 - 2b) + 13b = 61 => 22 - 4b + 13b = 61 => 9b = 39 (Tampaknya ada kekeliruan perhitungan, mari hitung ulang: 61 - 22 = 39, 39/9 tidak bulat. Mari buat soal yang pas: U_3 = 11 => a + 2b = 11. U_6 + U_9 = (a+5b)+(a+8b) = 2a+13b. Jika a=3, b=4, maka U_3 = 3 + 8 = 11. U_6 = 3 + 20 = 23. U_9 = 3 + 32 = 35. Jumlah U_6 + U_9 = 23 + 35 = 58. Mari gunakan nilai ini. Jika U_6 + U_9 = 58, maka 2a + 13b = 58. Substitusi a = 11 - 2b: 2(11 - 2b) + 13b = 58 => 22 - 4b + 13b = 58 => 9b = 36 => b = 4. Maka a = 11 - 2(4) = 3. Langkah ketiga, hitung U_15 = a + 14b = 3 + 14(4) = 3 + 56 = 59. Mari koreksi pilihan. Jika U_15 = 59 tidak ada, mari sesuaikan pilihan: A. 45, B. 51, C. 59 (misal), D. 63. Mari kita ganti soal yang angkanya pas: U_3 = 9, U_5 + U_7 = 40. U_3 = a + 2b = 9. U_5 + U_7 = 2a + 10b = 40. Bagi 2: a + 5b = 20. Eliminasi dengan a + 2b = 9 menghasilkan 3b = 11 (pecahan). Mari pastikan bilangan bulat: a=1, b=3. U_3 = 1 + 6 = 7. U_5 + U_7 = (1+12) + (1+18) = 13 + 19 = 32. Sistem: a + 2b = 7 dan 2a + 10b = 32 => a + 5b = 16. Eliminasi: (a+5b) - (a+2b) = 16 - 7 => 3b = 9 => b = 3. Maka a = 1. Suku ke-15: U_15 = 1 + 14(3) = 1 + 42 = 43. Pilihan disesuaikan.",
    }),
    expected: "INVALID",
  },
  {
    label: "Q5 class average",
    question: makeQuestion({
      id: "lite10-q5",
      subtopic: "Statistika",
      text: "Nilai rata-rata ulangan matematika dari suatu kelas adalah 72. Jika 5 orang siswa dengan nilai rata-rata 82 ditambahkan ke dalam kelas tersebut, nilai rata-rata kelas menjadi 74. Berapa banyak siswa yang ada di kelas tersebut sebelum adanya penambahan siswa?",
      options: ["10 orang", "15 orang", "20 orang", "25 orang", "30 orang"],
      answerIndex: 1,
      explanation:
        "Langkah pertama, misalkan jumlah siswa mula-mula adalah n dan jumlah total nilai awal adalah S_n. Diketahui rata-rata awal adalah 72, sehingga S_n / n = 72 atau S_n = 72n. Langkah kedua, setelah 5 siswa dengan rata-rata 82 bergabung, total siswa menjadi (n + 5) dan total nilai baru menjadi S_n + (5 * 82) = S_n + 410. Rata-rata baru adalah 74, sehingga persamaannya menjadi: (S_n + 410) / (n + 5) = 74. Langkah ketiga, substitusikan S_n = 72n ke dalam persamaan: (72n + 410) / (n + 5) = 74. Kalikan silang: 72n + 410 = 74(n + 5) => 72n + 410 = 74n + 370. Pindahkan suku-suku n ke satu sisi: 410 - 370 = 74n - 72n => 40 = 2n => n = 20. Jadi, banyak siswa semula adalah 20 orang.",
    }),
    expected: "INVALID",
  },
  {
    label: "Q6 cone and ball",
    question: makeQuestion({
      id: "lite10-q6",
      subtopic: "Fungsi dan pertumbuhan",
      text: "Sebuah wadah berbentuk kerucut terbalik dengan jari-jari alas 10 cm dan tinggi 20 cm diisi dengan air hingga mencapai ketinggian tertentu. Jika kemudian dimasukkan sebuah bola besi ke dalam wadah tersebut sehingga air merendam seluruh bola dan permukaan air naik tepat setinggi jari-jari bola tersebut, berapakah volume air awal sebelum bola dimasukkan?",
      options: ["18pi cm kubik", "24pi cm kubik", "36pi cm kubik", "48pi cm kubik", "72pi cm kubik"],
      answerIndex: 2,
      explanation:
        "Langkah pertama, pahami hubungan geometri antara kerucut dan bola. Perbandingan jari-jari dan tinggi kerucut adalah r:t = 10:20 = 1:2, sehingga t = 2r. Ketika bola dimasukkan, permukaan air naik setinggi r (jari-jari bola). Volume air yang naik setara dengan volume kerucut kecil setinggi r dikurangi volume bola yang terendam sebagian atau seluruhnya. Karena seluruh bola terendam, volume air yang naik sama dengan volume kerucut terpancung setinggi r, yang juga sama dengan selisih volume kerucut setinggi (h_awal + r) dan kerucut setinggi h_awal. Berdasarkan konsep kesebangunan volume kerucut, kenaikan volume air setinggi r dapat dihitung, namun cara termudah adalah menggunakan volume bola yang masuk sama dengan volume air yang naik. Volume bola = (4/3) * pi * r^3. Volume air yang naik setinggi r pada kerucut dengan r_alas = t/2 diberikan oleh rumus volume kerucut dengan tinggi r. Karena r_permukaan = tinggi_air / 2, maka volume kerucut air setinggi h adalah (1/3) * pi * (h/2)^2 * h = (pi * h^3)/12. Misalkan tinggi awal h_1 dan tinggi akhir h_2 = h_1 + r. Kenaikan volume adalah V_2 - V_1 = (pi/12) * [h_2^3 - h_1^3] = Volume Bola = (4/3)*pi*r^3. Melalui analisis lebih lanjut dengan memisalkan nilai tertentu atau perbandingan, misal r_bola = 3 cm, maka volume bola = 36pi.",
    }),
    expected: "INCONCLUSIVE",
  },
  {
    label: "Q7 chess tournament",
    question: makeQuestion({
      id: "lite10-q7",
      subtopic: "Peluang",
      text: "Dalam sebuah turnamen catur yang diikuti oleh 8 orang pemain, setiap peserta harus bertanding melawan setiap peserta lainnya tepat satu kali. Pertandingan tidak pernah berakhir dengan hasil seri (pasti ada pemenang dan yang kalah). Berapakah selisih antara total kemenangan pemain peringkat pertama dan total kemenangan pemain peringkat terakhir pada akhir turnamen, jika diasumsikan tidak ada pemain yang memiliki jumlah kemenangan yang sama persis di puncak dan dasar klasemen?",
      options: ["3 kemenangan", "4 kemenangan", "5 kemenangan", "6 kemenangan", "7 kemenangan"],
      answerIndex: 3,
      explanation:
        "Langkah pertama, total pertandingan dalam turnamen round-robin dengan 8 pemain adalah C(8,2) = (8*7)/2 = 28 pertandingan. Ini berarti total kemenangan seluruh pemain digabungkan adalah 28. Langkah kedua, asumsikan jumlah kemenangan masing-masing pemain adalah x_1, x_2, ..., x_8 yang diurutkan dari terbesar ke terkecil. Total kemenangan = x_1 + x_2 + ... + x_8 = 28. Karena tidak ada hasil seri, setiap pemain bertanding 7 kali, sehingga kemenangan maksimum adalah 7 dan minimum adalah 0. Agar selisih x_1 - x_8 maksimum atau minimum, kita uji batasannya. Jika x_8 = 0 (pemain terakhir tidak pernah menang), maka pemain pertama bisa memenangkan paling banyak berapa? Jika x_8 = 0, pemain terakhir kalah dari 7 orang lainnya. Pemain pertama bisa menang melawan 7 orang lainnya, jadi x_1 = 7. Selisih antara 7 dan 0 adalah 7. Namun, periksa apakah kondisi ini valid dalam turnamen grafer (Teorema Landau untuk turnamen). Untuk 8 pemain, jika x_8 = 0 dan x_1 = 7, selisihnya adalah 7 - 0 = 7.",
    }),
    expected: "INVALID",
  },
  {
    label: "Q8 souvenir linear programming",
    question: makeQuestion({
      id: "lite10-q8",
      subtopic: "Optimasi",
      text: "Seorang perajin membuat dua jenis suvenir, yaitu Jenis A dan Jenis B. Suvenir Jenis A memerlukan 2 jam kerja pelolosan dan 1 jam kerja pengecatan. Suvenir Jenis B memerlukan 1 jam kerja pelolosan dan 3 jam kerja pengecatan. Perajin tersebut memiliki ketersediaan waktu paling banyak 16 jam untuk pelolosan dan 18 jam untuk pengecatan setiap harinya. Jika keuntungan dari penjualan satu suvenir Jenis A adalah Rp30.000,00 dan satu suvenir Jenis B adalah Rp40.000,00, berapakah keuntungan maksimum perajin tersebut dalam sehari?",
      options: ["Rp240.000,00", "Rp280.000,00", "Rp300.000,00", "Rp320.000,00", "Rp360.000,00"],
      answerIndex: 1,
      explanation:
        "Langkah pertama, buat model matematika berdasarkan kendala. Misalkan banyak suvenir Jenis A adalah x dan Jenis B adalah y. Kendala pelolosan: 2x + y <= 16. Kendala pengecatan: x + 3y <= 18. Fungsi objektif (keuntungan): f(x,y) = 30.000x + 40.000y. Langkah kedua, cari titik-titik pojok dari daerah penyelesaian sistem pertidaksamaan. Titik potong sumbu: untuk 2x + y = 16, titiknya (8,0) dan (0,16). Untuk x + 3y = 18, titiknya (18,0) dan (0,6). Langkah ketiga, eliminasi kedua persamaan untuk mencari titik potong garis: 2x + y = 16 dan x + 3y = 18 (kalikan persamaan kedua dengan 2 menjadi 2x + 6y = 36). Kurangkan kedua persamaan: 5y = 20 => y = 4. Substitusi y = 4 ke x + 3(4) = 18 => x = 6. Titik potongnya adalah (6,4). Langkah keempat, uji titik-titik pojok ke fungsi objektif: (0,0) -> 0; (8,0) -> 30.000(8) = 240.000; (0,6) -> 40.000(6) = 240.000; (6,4) -> 30.000(6) + 40.000(4) = 180.000 + 160.000 = 340.000 (Tunggu, mari hitung ulang: 30.000*6 = 180.000, 40.000*4 = 160.000, total 340.000. Mari periksa pilihan, opsi d adalah 320.000, mari kita hitung ulang titik lainnya atau ubah angka. Ubah fungsi objektif atau kendala agar pas dengan pilihan. Misalkan keuntungan A = Rp30.000 dan B = Rp20.000. Jika f(x,y) = 30.000x + 20.000y, maka di titik (6,4) -> 180.000 + 80.000 = 260.000. Di titik (8,0) -> 240.000. Di titik (0,6) -> 120.000. Jika keuntungan A = Rp40.000 dan B = Rp30.000: f(6,4) = 40.000(6) + 30.000(4) = 240.000 + 120.000 = 360.000 (ada di opsi e). Mari gunakan keuntungan A = Rp40.000 dan B = Rp30.000, sehingga jawaban yang benar adalah Rp360.000,00.",
    }),
    expected: "INVALID",
  },
  {
    label: "Q9 geometric sequence",
    question: makeQuestion({
      id: "lite10-q9",
      subtopic: "Barisan dan deret",
      text: "Jumlah 5 suku pertama suatu barisan geometri adalah 31. Jika rasio barisan tersebut adalah 2, berapakah hasil kali antara suku pertama dan suku kelima barisan tersebut?",
      options: ["16", "32", "64", "128", "256"],
      answerIndex: 2,
      explanation:
        "Langkah pertama, gunakan rumus jumlah n suku pertama barisan geometri S_n = a * (r^n - 1) / (r - 1). Diketahui S_5 = 31 dan r = 2. Substitusikan nilai-nilai ini ke dalam rumus: 31 = a * (2^5 - 1) / (2 - 1). Langkah kedua, selesaikan persamaan untuk mencari suku pertama (a). 31 = a * (32 - 1) / 1 => 31 = a * 31 => a = 1. Langkah ketiga, cari nilai suku kelima (U_5) dengan rumus U_n = a * r^(n-1). U_5 = 1 * 2^(5-1) = 1 * 2^4 = 16. Langkah keempat, hitung hasil kali antara suku pertama dan suku kelima: a * U_5 = 1 * 16 = 16 (Tunggu, mari periksa pilihan, 16 adalah opsi a. Mari kita pastikan apakah hasil kali a * U_5 sama dengan a * (a * r^4) = a^2 * r^4 = (a * r^2)^2 = U_3^2. Untuk a=1, r=2, barisannya adalah 1, 2, 4, 8, 16. Suku pertama = 1, suku kelima = 16. Hasil kalinya adalah 1 * 16 = 16. Pilihan a adalah 16, mari set answerIndex ke 0).",
    }),
    expected: "INVALID",
  },
  {
    label: "Q10 waiting-time median",
    question: makeQuestion({
      id: "lite10-q10",
      subtopic: "Statistika",
      text: "Dalam suatu penelitian mengenai waktu tunggu pelanggan di sebuah bank, tercatat data waktu tunggu dari 10 orang nasabah (dalam menit) sebagai berikut: 4, 6, 8, 10, 12, 14, 15, 18, 20, dan x. Jika diketahui bahwa rata-rata waktu tunggu dari 10 nasabah tersebut adalah 12,5 menit, berapakah nilai median dari data waktu tunggu setelah nilai x dimasukkan dan diurutkan?",
      options: ["11", "12", "12,5", "13", "13,5"],
      answerIndex: 3,
      explanation:
        "Langkah pertama, cari nilai x dengan memanfaatkan informasi rata-rata. Jumlah seluruh data dibagi banyak data sama dengan rata-rata: (4 + 6 + 8 + 10 + 12 + 14 + 15 + 18 + 20 + x) / 10 = 12,5. Jumlahkan angka yang sudah ada: 4+6+8+10+12+14+15+18+20 = 107. Persamaannya menjadi: (107 + x) / 10 = 12,5 => 107 + x = 125 => x = 18. Langkah kedua, susun kembali seluruh data secara berurutan dari yang terkecil hingga terbesar: 4, 6, 8, 10, 12, 14, 15, 18, 18, 20. Langkah ketiga, karena jumlah data ada 10 (genap), median adalah rata-rata dari data ke-5 dan data ke-6. Data ke-5 adalah 12 dan data ke-6 adalah 14. Median = (12 + 14) / 2 = 13.",
    }),
    expected: "VALID",
  },
];

describe("parseNumericValue", () => {
  it("parses fractions, comma decimals, Rp thousands, and plain integers", () => {
    expect(parseNumericValue("4/11")).toBeCloseTo(4 / 11);
    expect(parseNumericValue("7/22")).toBeCloseTo(7 / 22);
    expect(parseNumericValue("12,5")).toBe(12.5);
    expect(parseNumericValue("Rp340.000,00")).toBe(340000);
    expect(parseNumericValue("Rp280.000")).toBe(280000);
    expect(parseNumericValue("450 meter persegi")).toBe(450);
    expect(parseNumericValue("20 orang")).toBe(20);
    expect(parseNumericValue("36pi cm kubik")).toBe(36);
    expect(parseNumericValue("60%")).toBe(60);
    expect(parseNumericValue("16")).toBe(16);
  });

  it("parses clock times, including the next day", () => {
    expect(parseNumericValue("Pukul 20.00")).toBe(20 * 60);
    expect(parseNumericValue("Pukul 02.00 hari berikutnya")).toBe((24 + 2) * 60);
    expect(parseNumericValue("Pukul 05.00 hari berikutnya")).toBe((24 + 5) * 60);
  });

  it("returns null for non-numeric text", () => {
    expect(parseNumericValue("Fungsi linear")).toBeNull();
    expect(parseNumericValue("")).toBeNull();
    expect(parseNumericValue("Rp")).toBeNull();
  });
});

describe("validateQuestion — structure", () => {
  const base = LITE_FIXTURES[2].question; // Q3, the valid control

  it("accepts a well-formed question", () => {
    expect(validateQuestion(base).verdict).toBe("VALID");
  });

  it("rejects text shorter than 10 characters", () => {
    expect(validateQuestion({ ...base, text: "Hitung 2" }).verdict).toBe("INVALID");
  });

  it("rejects fewer than 4 and more than 5 options", () => {
    expect(validateQuestion({ ...base, options: ["a", "b", "c"], answerIndex: 0 }).verdict).toBe("INVALID");
    expect(
      validateQuestion({ ...base, options: ["a", "b", "c", "d", "e", "f"], answerIndex: 0 }).verdict,
    ).toBe("INVALID");
  });

  it("rejects an out-of-range answerIndex", () => {
    expect(validateQuestion({ ...base, answerIndex: 5 }).verdict).toBe("INVALID");
    expect(validateQuestion({ ...base, answerIndex: -1 }).verdict).toBe("INVALID");
  });

  it("rejects an empty explanation", () => {
    expect(validateQuestion({ ...base, explanation: "  " }).verdict).toBe("INVALID");
  });
});

describe("validateQuestion — subtopic", () => {
  const base = LITE_FIXTURES[2].question;

  it("rejects a subtopic that is not in the subtest's list", () => {
    expect(validateQuestion({ ...base, subtopic: "Aljabar" }).verdict).toBe("INVALID");
  });

  it("accepts a listed subtopic", () => {
    expect(validateQuestion(base).verdict).toBe("VALID");
  });
});

describe("validateQuestion — duplicate options", () => {
  const base = LITE_FIXTURES[9].question; // Q10, valid control

  it("rejects duplicate options", () => {
    expect(
      validateQuestion({ ...base, options: ["11", "12", "12", "13", "13,5"], answerIndex: 3 })
        .verdict,
    ).toBe("INVALID");
  });

  it("rejects when the duplicated value is the keyed option (ambiguous)", () => {
    const result = validateQuestion({
      ...base,
      options: ["11", "12", "13", "13", "13,5"],
      answerIndex: 2,
    });
    expect(result.verdict).toBe("INVALID");
    expect(result.reasons[0]).toBe("ambiguous-key");
  });

  it("treats options that differ only by case/space as duplicates", () => {
    expect(
      validateQuestion({ ...base, options: ["11", "12", "12,5", "13", " 13 "], answerIndex: 3 })
        .verdict,
    ).toBe("INVALID");
  });
});

describe("validateQuestion — explanation leak markers", () => {
  const base = LITE_FIXTURES[2].question;

  it.each([
    "Tampaknya ada kekeliruan perhitungan, mari hitung ulang.",
    "Mari buat soal yang pas: U_3 = 11.",
    "Mari kita ganti soal yang angkanya pas.",
    "Pilihan disesuaikan.",
    "Tunggu, mari hitung ulang: 30.000*6 = 180.000.",
    "Ubah fungsi objektif atau kendala agar pas dengan pilihan.",
    "Koreksi answerIndex menjadi 3 (pilihan ke-4).",
    "Pilihan a adalah 16, mari set answerIndex ke 0.",
  ])("rejects an explanation containing %s", (leak) => {
    const result = validateQuestion({ ...base, explanation: `${base.explanation} ${leak}` });
    expect(result.verdict).toBe("INVALID");
    expect(result.reasons[0]).toMatch(/^explanation-leak:/);
  });

  it("does not flag a legitimate 'Misalkan' variable definition", () => {
    // Q3's own explanation defines variables with "Misalkan" and is VALID.
    expect(validateQuestion(LITE_FIXTURES[2].question).verdict).toBe("VALID");
  });
});

describe("validateQuestion — lite 10-question regression fixtures (2026-11-26)", () => {
  it.each(LITE_FIXTURES)("$label is $expected", ({ question, expected }) => {
    expect(validateQuestion(question).verdict).toBe(expected);
  });

  it("never delivers any of the 8 bad questions", () => {
    const bad = LITE_FIXTURES.filter((f) => f.expected !== "VALID");
    expect(bad).toHaveLength(8);
    for (const { question } of bad) {
      expect(validateQuestion(question).verdict).not.toBe("VALID");
    }
  });

  it("gives the right deciding reason for the mismatch cases", () => {
    const q5 = LITE_FIXTURES[4].question;
    expect(validateQuestion(q5).reasons[0]).toBe("key-explanation-mismatch");
    const q7 = LITE_FIXTURES[6].question;
    expect(validateQuestion(q7).reasons[0]).toBe("key-explanation-mismatch");
    const q1 = LITE_FIXTURES[0].question;
    expect(validateQuestion(q1).reasons[0]).toBe("time-addition-contradiction");
    const q6 = LITE_FIXTURES[5].question;
    expect(validateQuestion(q6).reasons[0]).toBe("assumed-value");
  });
});

describe("validateQuestion — literacy and reasoning are never auto-accepted", () => {
  it("marks a well-formed literacy question INCONCLUSIVE (correctness unverifiable)", () => {
    const literacy = makeQuestion({
      id: "test-lit-1",
      subtest: "literasi",
      subtopic: "Simpulan",
      text: "Bacalah teks berikut dengan saksama. Berdasarkan teks tersebut, manakah simpulan yang paling tepat mengenai sikap penulis terhadap penggunaan plastik sekali pakai?",
      options: [
        "Penulis mendukung penuh penggunaannya",
        "Penulis menolak penggunaannya secara mutlak",
        "Penulis mengajak pembaca menguranginya secara bertahap",
        "Penulis tidak memiliki sikap yang jelas",
      ],
      answerIndex: 2,
      explanation:
        "Penulis dalam teks mengajak pembaca untuk mengurangi penggunaan plastik sekali pakai secara bertahap, bukan melarangnya sekaligus. Hal ini tampak dari pilihan kata yang digunakan penulis sepanjang teks.",
    });
    const result = validateQuestion(literacy);
    expect(result.verdict).toBe("INCONCLUSIVE");
    expect(result.reasons[0]).toBe("correctness-unverifiable");
  });

  it("still rejects a literacy question with a wrong subtopic label", () => {
    const literacy = makeQuestion({
      id: "test-lit-2",
      subtest: "literasi",
      subtopic: "Aljabar",
      text: "Bacalah teks berikut dengan saksama. Berdasarkan teks tersebut, manakah simpulan yang paling tepat?",
      options: ["A", "B", "C", "D"],
      answerIndex: 0,
      explanation: "Pembahasan yang cukup panjang untuk lolos batas minimal karakter.",
    });
    expect(validateQuestion(literacy).verdict).toBe("INVALID");
  });
});

describe("validateQuestion — clock-time answers (audit finding 1b)", () => {
  const bacteriaText =
    "Sebuah koloni bakteri berjumlah 400 sel pada pukul 08.00 dan berlipat ganda setiap 3 jam. Kapan jumlahnya mencapai 25.600 sel?";
  const bacteriaOptions = [
    "Pukul 17.00",
    "Pukul 20.00",
    "Pukul 23.00",
    "Pukul 02.00 hari berikutnya",
    "Pukul 05.00 hari berikutnya",
  ];

  it("P4: a correct time answer in natural form is VALID (minutes compared with minutes)", () => {
    const q = makeQuestion({
      id: "test-time-p4",
      subtopic: "Fungsi dan pertumbuhan",
      text: bacteriaText,
      options: bacteriaOptions,
      answerIndex: 3,
      explanation:
        "25.600 / 400 = 64 = 2^6, jadi perlu 6 kali lipat ganda, yaitu 6 × 3 = 18 jam. Pukul 08.00 + 18 jam = 02.00 hari berikutnya.",
    });
    const result = validateQuestion(q);
    expect(result.verdict).toBe("VALID");
    expect(result.reasons[0]).toBe("final-value-matches");
  });

  it("P5: a wrong time derivation ending in minutes is INVALID (wrong quantity)", () => {
    const q = makeQuestion({
      id: "test-time-p5",
      subtopic: "Fungsi dan pertumbuhan",
      text: bacteriaText,
      options: bacteriaOptions,
      answerIndex: 1,
      explanation:
        "Perlu 6 kali lipat ganda. 6 × 3 = 18 jam = 1080 menit. Ditambah waktu awal, total = 1200 menit.",
    });
    const result = validateQuestion(q);
    expect(result.verdict).toBe("INVALID");
    expect(result.reasons[0]).toBe("time-quantity-mismatch");
  });

  it("a wrong clock time stated as the final answer is INVALID (mismatch)", () => {
    const q = makeQuestion({
      id: "test-time-wrong",
      subtopic: "Fungsi dan pertumbuhan",
      text: bacteriaText,
      options: bacteriaOptions,
      answerIndex: 3,
      explanation:
        "25.600 / 400 = 64 = 2^6, jadi perlu 6 kali lipat ganda, yaitu 6 × 3 = 18 jam. Pukul 08.00 + 18 jam = 23.00.",
    });
    const result = validateQuestion(q);
    expect(result.verdict).toBe("INVALID");
    expect(result.reasons[0]).toBe("key-explanation-mismatch");
  });

  it("a time answer with no clock time and no duration is INCONCLUSIVE", () => {
    const q = makeQuestion({
      id: "test-time-noclock",
      subtopic: "Fungsi dan pertumbuhan",
      text: bacteriaText,
      options: bacteriaOptions,
      answerIndex: 3,
      explanation: "Perlu 6 kali lipat ganda. Setiap lipat ganda butuh waktu 3 jam.",
    });
    const result = validateQuestion(q);
    expect(result.verdict).toBe("INCONCLUSIVE");
    expect(result.reasons[0]).toBe("numeric-unverifiable");
  });
});

describe("validateQuestion — VALID means only the final value matches (audit finding 1a)", () => {
  // These cases are VALID by design of the deterministic validator: only the
  // final value after the last "=" is compared with the key. They document
  // the known limit — a VALID verdict does NOT prove the steps or the method
  // are correct. Catching these is the job of the postponed Fase 2 AI validator.
  it("P1: wrong intermediate steps, final line restates the key", () => {
    const q = makeQuestion({
      id: "test-limit-p1",
      subtopic: "Fungsi dan pertumbuhan",
      text: "Berapakah hasil dari 2 + 3 × 4?",
      options: ["14", "20", "24", "10"],
      answerIndex: 0,
      explanation: "Perkalian dulu: 3 × 4 = 13, lalu 2 + 13 = 15. Jadi 2 + 3 × 4 = 14.",
    });
    const result = validateQuestion(q);
    expect(result.verdict).toBe("VALID");
    expect(result.reasons[0]).toBe("final-value-matches");
  });

  it("P2: wrong method (mean instead of median), coincidentally right number", () => {
    const q = makeQuestion({
      id: "test-limit-p2",
      subtopic: "Statistika",
      text: "Median dari data 2, 4, 6, 8, 10 adalah berapa?",
      options: ["4", "6", "8", "10"],
      answerIndex: 1,
      explanation: "Rata-rata = (2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6. Jadi median = 6.",
    });
    expect(validateQuestion(q).verdict).toBe("VALID");
  });

  it("P3: a bare assertion with no reasoning", () => {
    const q = makeQuestion({
      id: "test-limit-p3",
      subtopic: "Optimasi",
      text: "Luas persegi dengan panjang sisi 5 cm adalah berapa?",
      options: ["20", "25", "30", "10"],
      answerIndex: 1,
      explanation: "Luas = 25.",
    });
    expect(validateQuestion(q).verdict).toBe("VALID");
  });

  it("P6: an ill-posed question whose key is restated at the end", () => {
    const q = makeQuestion({
      id: "test-limit-p6",
      subtopic: "Barisan dan deret",
      text: "Jumlah 5 suku pertama suatu barisan geometri adalah 31. Jika rasio barisan tersebut adalah 2, berapakah hasil kali antara suku pertama dan suku kelima barisan tersebut?",
      options: ["32", "64", "128", "256"],
      answerIndex: 1,
      explanation:
        "S_5 = a × 31 = 31, jadi a = 1. U_5 = 1 × 2^4 = 16. Hasil kali a × U_5 = 16, dan 16 × 4 = 64.",
    });
    expect(validateQuestion(q).verdict).toBe("VALID");
  });
});

describe("validateQuestionSet", () => {
  it("partitions the 10 lite fixtures into 2 valid, 6 invalid, 2 inconclusive", () => {
    const result = validateQuestionSet(LITE_FIXTURES.map((f) => f.question));
    expect(result.valid).toHaveLength(2);
    expect(result.invalid).toHaveLength(6);
    expect(result.inconclusive).toHaveLength(2);
    expect(result.valid.map((q) => q.id).sort()).toEqual(["lite10-q10", "lite10-q3"]);
  });

  it("returns an empty partition for an empty input", () => {
    expect(validateQuestionSet([])).toEqual({ valid: [], invalid: [], inconclusive: [] });
  });
});
