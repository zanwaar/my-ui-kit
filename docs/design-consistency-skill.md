# Skill: Konsistensi Desain UI (untuk My UI Kit)

Panduan pribadi ini dipakai setiap kali merancang komponen atau halaman baru,
supaya hasilnya konsisten dan tidak "berantakan" walau dikerjakan bertahap.

---

## 1. Kunci Dulu Token, Baru Desain

Sebelum bikin komponen baru, semua nilai berikut HARUS sudah ada di
`tailwind.config.js` — jangan pernah menulis angka baru langsung di file SCSS
komponen.

### Spacing Scale
Pakai kelipatan tetap, jangan angka bebas.
```
4px  8px  12px  16px  24px  32px  48px  64px
```
Aturan: jarak antar-elemen dalam satu komponen pakai skala kecil (4–16px),
jarak antar-section pakai skala besar (32–64px). Jangan campur, mis. jangan
ada padding 10px atau 22px nyempil di antara komponen lain.

### Color Scale
Satu warna dasar (neutral/gray) dengan 9–10 shade + maksimal 1–2 accent color,
masing-masing juga dengan shade lengkap (50 → 900).
```
neutral: 50 100 200 300 400 500 600 700 800 900
primary: 50 100 200 300 400 500 600 700 800 900
```
Aturan: JANGAN pernah pakai warna hex baru di luar palet ini, sekalipun
"cuma sedikit beda". Kalau butuh warna baru, tambahkan dulu ke config,
baru dipakai.

### Typography Scale
Maksimal 5–6 ukuran font untuk seluruh UI kit:
```
xs (12px)  sm (14px)  base (16px)  lg (18px)  xl (20px)  2xl (24px)  3xl (30px)
```
Aturan: satu halaman idealnya cuma pakai 3–4 ukuran ini, bukan semua sekaligus.
Body text konsisten di satu ukuran (biasanya `base` atau `sm`) di seluruh kit.

### Border Radius & Shadow
Tentukan 2–3 varian saja (mis. `sm`, `md`, `lg`) dan pakai konsisten — jangan
ada komponen dengan radius 4px sementara yang lain 10px tanpa alasan.

---

## 2. Aturan Hierarchy (Biar Tidak "Rata Semua")

- **Satu elemen paling penting per section** — jangan semua teks/tombol punya
  bobot visual yang sama. Tentukan mana yang harus paling menonjol (biasanya
  1 primary action), sisanya turunkan (secondary/ghost button).
- **Ukuran bukan satu-satunya alat hierarchy.** Gunakan juga: warna (netral
  vs primary), font-weight (regular vs semibold), dan spacing (elemen penting
  dikasih ruang lebih lega).
- **Hindari label kalau bisa dijelaskan lewat posisi/style.** Label tambahan
  = tanda desainnya belum cukup jelas secara visual.
- **Kontras teks:** teks sekunder/keterangan boleh abu-abu, tapi JANGAN abu-abu
  di atas background berwarna (accent/primary) — pakai putih atau warna solid
  dengan kontras cukup.

---

## 3. Checklist Sebelum Komponen Baru Dianggap "Selesai"

Setiap komponen baru di Fase 1 wajib lolos checklist ini sebelum lanjut ke
komponen berikutnya:

- [ ] Semua warna diambil dari palet `tailwind.config.js`, tidak ada hex baru
- [ ] Semua spacing pakai skala yang sudah ditentukan
- [ ] Sudah ada varian dark mode dan sudah dicek kontrasnya
- [ ] Sudah ada state: default, hover, focus, disabled (minimal untuk elemen interaktif)
- [ ] Radius & shadow konsisten dengan komponen lain yang sudah ada
- [ ] Tidak menambah ukuran font baru di luar typography scale

---

## 4. Checklist Konsistensi Antar-Halaman (Fase 2 ke atas)

- [ ] Header/sidebar/footer sama di semua halaman demo (bukan dibuat ulang tiap halaman)
- [ ] Jarak antar-section di semua halaman pakai skala spacing besar yang sama
- [ ] Warna primary dipakai untuk hal yang sama di semua halaman (jangan primary
      dipakai untuk "Simpan" di satu halaman, tapi untuk "Hapus" di halaman lain)
- [ ] Komponen yang sama (mis. Card) terlihat identik di semua halaman kecuali
      memang sengaja beda varian

---

## 5. Kebiasaan yang Bikin Desain Berantakan (Hindari)

- Menambah warna/ukuran baru "cuma buat kasus ini doang" — nanti menumpuk jadi
  puluhan variasi yang tidak konsisten.
- Mendesain komponen dalam isolasi tanpa melihat bagaimana dia dipakai bareng
  komponen lain di halaman nyata.
- Menyelesaikan satu halaman 100% detail sebelum struktur keseluruhan produk
  jelas (baiknya: rancang alur/skeleton semua halaman dulu, baru detail).
- Terlalu banyak pilihan (banyak varian button/warna) padahal user cuma butuh
  beberapa yang benar-benar dipakai.

---

## Cara Pakai Skill Ini

Setiap kali mau menambah komponen atau halaman baru di My UI Kit:
1. Cek token yang relevan sudah ada di `tailwind.config.js` (bagian 1)
2. Terapkan aturan hierarchy (bagian 2)
3. Jalankan checklist komponen (bagian 3) sebelum dianggap selesai
4. Kalau sudah masuk demo halaman penuh, jalankan checklist bagian 4
