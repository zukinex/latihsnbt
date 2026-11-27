# #BuildHybridAI 2026 — Syarat Kualifikasi (RESMI, sudah dipelajari)

Sumber: halaman resmi Devpost, dibaca 26 Nov 2026 ~21:15 WIB
- FAQ: https://firebasehybridaihackathon.devpost.com/details/faqs
- Utama: https://firebasehybridaihackathon.devpost.com/
- (halaman di-crawl 26 Nov 2026 14:13 UTC; aturan bisa berubah — cek ulang
  halaman ini sebelum submit)

Proyek: LatihSNBT — https://github.com/zukinex/latihsnbt (public, MIT)
Deadline submit: Senin 30 Nov 2026 14:00 PT = **1 Des 2026 05:00 WIB (TETAP,
tidak bisa diperpanjang)**. Setelah deadline, submission terkunci dan
commit yang di-push sesudahnya TIDAK dinilai. Video YouTube di-upload
lebih awal (processing bisa berjam-jam).

---

## A. Kelayakan (eligibility)

- Peserta harus di atas usia dewasa di negara domisili. Indonesia TIDAK
  ada di daftar negara yang dikecualikan (Brazil, Italia, Quebec, Crimea,
  Kuba, Iran, Suriah, Korea Utara, Sudan, Belarus, Rusia, negara sanksi
  OFAC). → User berdomisili di Indonesia: negara OK. Usia user: belum
  terverifikasi di catatan — pastikan di atas usia dewasa.
- Individu / tim / organisasi boleh. Bukan karyawan Google/Devpost.
- Proyek baru DAN aplikasi lama yang di-update signifikan setelah 11 Nov
  sama-sama boleh. LatihSNBT adalah proyek BARU yang dibangun selama
  periode submission → tidak perlu ringkasan "apa yang dibangun selama
  periode" (itu hanya untuk aplikasi lama).

## B. Yang harus dibangun

- Aplikasi generative AI dengan **Firebase AI Logic** yang menggabungkan
  **on-device + cloud inference**. SEMUA AI inference harus lewat
  Firebase AI Logic. Dilarang memanggil API model lain secara langsung.
- Platform: Web (Chrome) dengan Gemini Nano 4, ATAU Android dengan
  Gemini Nano 4, ATAU iOS dengan Apple Foundation Models — semua via
  Firebase AI Logic. Satu platform cukup; multi-platform lebih disukai
  (pertimbangan kuat untuk Grand Prize).
- **Firebase App Check WAJIB.** Debug token DITERIMA di submission.
  JANGAN commit debug token, service account key, atau file .env ke
  repo publik.
- Produk Firebase lain (Remote Config, Firestore, Authentication):
  **DIANJURKAN tapi OPSIONAL** — bukan syarat. (Koreksi: catatan lama
  menyebut semuanya "required" — itu salah menurut FAQ resmi.)
- **Setidaknya satu fitur HARUS jalan on-device; cloud-only TIDAK
  cukup.** Juri menilai seberapa efektif hybrid inference dipakai.
  `PREFER_ON_DEVICE`: jalan on-device kalau model lokal tersedia,
  fallback ke cloud kalau tidak.
- On-device di web: Gemini Nano 4 lewat Chrome Prompt API; aktifkan
  "Gemma 4 for Built-in AI" di chrome://flags. Hanya jalan di versi
  Chrome + perangkat yang mendukung Nano.
- AI coding assistant (Claude, Cursor, dll.) boleh. Third-party API/SDK/
  open-source boleh kalau berizin — tapi AI inference tetap harus lewat
  Firebase AI Logic.

## C. Yang harus di-submit

1. Pilih minimal satu platform (Web/Chrome untuk LatihSNBT).
2. Text description (Bahasa Inggris): cara memakai Firebase AI Logic,
   fitur-fitur, value proposition. → Draft ada:
   `~/workspace/latihsnbt/DEVPOST-DRAFT.md` (Bahasa Inggris; URL hosting
   diisi setelah deploy).
3. Repo publik GitHub/GitLab + lisensi open-source yang terdeteksi di
   About section (Apache disukai, lisensi OSS apa pun boleh). Harus ada:
   semua source code, aset, instruksi run, DAN Firebase AI Logic
   di-import serta BENAR-BENAR dipanggil saat runtime (bukan cuma disebut
   di README).
4. Video demo ≤3 menit, publik di YouTube, link di form submission,
   Bahasa Inggris atau subtitle Inggris, menunjukkan proyek berjalan di
   platform yang dibangun. 30 detik pertama: ide, untuk siapa, masalah
   yang diselesaikan, dan bagaimana Firebase AI Logic membuatnya bekerja.
   Juri bisa menilai HANYA dari video — tunjukkan fitur hybrid bekerja
   sejak awal. Jangan pakai logo/trademark/konten pihak ketiga tanpa hak.
5. Hosted project URL SANGAT dianjurkan (tapi opsional). Juri tidak wajib
   mengetes; bisa menilai dari deskripsi, gambar, dan video saja. Kalau
   butuh login, taruh kredensial di testing instructions. Jangan taruh
   production API key, secret, atau PII.
6. Semua materi submission dalam Bahasa Inggris (atau ada terjemahan
   Inggrisnya). **Aplikasi minimal harus mendukung Bahasa Inggris.**
7. Proyek harus gratis.

## D. Penjurian & hadiah

- Stage 1: pass/fail — submission memuat SEMUA syarat dan cukup menjawab
  tantangan. Gagal di sini = tidak dinilai sama sekali.
- Stage 2: skor 1–5 untuk empat kriteria BERBOBOT SAMA: Technological
  Implementation, Design, Potential Impact, Quality of the Idea.
  Seri diputus oleh urutan kriteria. Juri bisa pakai panel ahli + analisis
  berbantuan AI. Skor/feedback individu umumnya tidak dibagikan.
- Hadiah $30.000: Grand Prize $10.000 (+interview, blog, social),
  1st Runner-Up $7.000, 2nd Runner-Up $4.000, Best iOS/Android/Web
  masing-masing $3.000. Satu proyek bisa menang satu grand prize + satu
  "Best of". Pembayaran ke individu/perwakilan tim/organisasi setelah
  formulir (W-9 AS / W-8BEN non-AS) dikembalikan ≤10 hari kerja,
  dibayar ≤60 hari. Pemenang tanggung pajak + biaya transfer.
- Penjurian 10–16 Des; pemenang diumumkan ~21 Des 12:00 PT.
- Kuota: tidak perlu bayar. Text inference gratis dalam batas pemakaian.
  Google Account Quota (untuk model berbayar: image gen, TTS) — Sprint 3
  terakhir: request s/d 25 Nov 10:00 PT, dikirim 27 Nov. LatihSNBT
  text-only → tidak butuh.

---

## E. Status LatihSNBT per syarat (dicek 26 Nov 2026 ~21:15 WIB)

| # | Syarat | Status | Bukti / catatan |
|---|--------|--------|-----------------|
| 1 | Semua AI lewat Firebase AI Logic | ✅ TERPENUHI | `ai.ts`: getAI + getGenerativeModel, generateContent dipanggil live (terbukti oleh respons 429 dari server). Tidak ada panggilan API model lain. |
| 2 | Platform Web (Chrome) + Gemini Nano 4 | ✅ DI KODE, ⚠️ BELUM TERBUKTI LIVE | Drill memakai PREFER_ON_DEVICE (Nano kalau tersedia, fallback cloud); Tryout PREFER_IN_CLOUD. Jalur on-device belum pernah dites live. Perlu Chrome dengan flag "Gemma 4 for Built-in AI" + perangkat yang mendukung Nano. |
| 3 | Setidaknya satu fitur on-device | ⚠️ BELUM TERBUKTI | Sama seperti #2: fitur drill dirancang on-device, tapi belum ada bukti live Nano jalan. Ini yang dinilai juri ("how effectively you use hybrid inference") dan harus tampil di video. |
| 4 | App Check wajib | ✅ DI PROYEK, ⚠️ PRODUCTION BELUM | Enforcement AKTIF (terbukti 403). Debug token "Muse test" terdaftar & dipakai buat testing. Untuk app yang di-host: butuh provider production = reCAPTCHA Enterprise — BELUM di-setup. Tanpa ini AI di web deploy akan gagal. |
| 5 | Remote Config / Firestore / Auth | ✅ OPSIONAL | Tidak dipakai; tidak wajib menurut FAQ. Firestore Fase 3 ditunda sampai setelah submission. Bukan blocker. |
| 6 | Repo publik + lisensi MIT terdeteksi | ✅ TERPENUHI | GitHub API: public, license MIT, file LICENSE di root. HEAD d5d8922e. |
| 7 | AI Logic di-import + dipanggil saat runtime | ✅ TERPENUHI | Live test memanggil generateContent (timeout/429 dari server = bukti runtime call). |
| 8 | Text description (Inggris) | ✅ DRAFT SIAP | DEVPOST-DRAFT.md Bahasa Inggris; isi URL hosting setelah deploy; cek akhir sebelum paste: bagian "how Firebase AI Logic is used" harus eksplisit. |
| 9 | Video demo ≤3 mnt, YouTube publik, Inggris | ⚠️ BELUM DIREKAM | Script ada (DEMO-VIDEO-SCRIPT.md): 0:00–0:30 ide, 0:30–1:00 drill on-device, 1:00–1:40 tryout cloud. Rekam SETELAH live AI test lolos. Upload lebih awal (processing lama). |
| 10 | Hosted URL | ⚠️ BELUM DEPLOY | Butuh reCAPTCHA + env vars Vercel (langkah user) baru deploy. Sangat dianjurkan juri, tapi opsional. |
| 11 | App minimal mendukung Bahasa Inggris | ✅ TERPENUHI (26 Nov ~21:27 WIB) | Toggle ID/EN ditambahkan (commit 5c205944, 191/191 tests): semua teks UI diterjemahkan, default Indonesia, tersimpan di localStorage; konten soal/nama subtes/subtopik tetap Indonesia (istilah ujian). Deskripsi sasaran ditambahkan di home: "Dibuat untuk pelajar Indonesia yang bersiap menghadapi SNBT" (EN: "Built for Indonesian students preparing for SNBT"). |
| 12 | Materi submission Bahasa Inggris | ✅ (draft Inggris) | Description + video (narasi Inggris) sudah direncanakan Inggris. |
| 13 | Proyek gratis | ✅ TERPENUHI | Free, no login. |
| 14 | Deadline 1 Des 05:00 WIB | ⏰ 3 HARI LAGI | Commit setelah deadline tidak dinilai. |
| 15 | Live AI berfungsi | ✅ TERBUKTI (Hydrogen, 27 Nov ~23:48 WIB) | Model diganti ke gemini-4-hydrogen + ThinkingLevel.LOW (commit e24d176e): tryout e2e 1/3 soal dari AI (validator-verified) + 2/3 dari bank — regenerasi tidak selesai dalam jendela tes 65 detik (budget produk 90 detik); drill plan AI 7 hari penuh dalam 16,5 detik (pertama kalinya AI drill plan berhasil). 3.8-flash tidak pernah jawab dalam 60 detik (3 timeout). Limit Hydrogen 5 request/menit; limit harian belum diketahui. |

## F. Gap yang harus diberesin (urut prioritas)

1. **Bukti on-device Nano jalan live** — butuh Chrome yang mendukung
   Nano + flag diaktifkan, lalu satu drill direkam/dites. Tanpa ini,
   klaim hybrid + segmen video 0:30–1:00 tidak bisa dibuktikan.
2. **Live AI test ulang besok (27 Nov 16:00 WIB)** — sudah dijadwalkan.
   Kalau berhasil → live AI kembali; kalau tetap timeout 60 detik →
   kirim dengan fallback bank (jujur, sudah terbukti bekerja).
3. **reCAPTCHA Enterprise + deploy Vercel** — langkah user di console;
   tanpa ini tidak ada hosted URL dan AI production gagal.
4. **Video demo + submit Devpost** — sebelum 1 Des 05:00 WIB.
   Registrasi Devpost user (bonyonkar) belum terkonfirmasi.

(Selesai 26 Nov ~21:27 WIB: toggle ID/EN + deskripsi sasaran Indonesia —
commit 5c205944, 191/191 tests. Dulu gap #1, kini syarat #11 terpenuhi.)

## G. Catatan kuota (risiko saat penjurian)

Kuota Free Tier gemini-3.8-flash: 20 request/hari per project per model
(5 RPM). Satu sesi tryout = 1–2 panggilan. Juri mengetes 10–16 Des —
kalau kuota hari itu habis, mereka melihat fallback bank. Fallback itu
jujur dan berfungsi, tapi demo video + deskripsi harus menunjukkan live
AI bekerja saat kuota tersedia. Hemat pemakaian selama testing.
