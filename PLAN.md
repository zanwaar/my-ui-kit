# PLAN Pengembangan — My UI Kit

Tujuan akhir: UI Kit berbasis Tailwind, dipakai plug-and-play seperti Bootstrap,
bisa dipakai lintas platform (HTML, React, Laravel, dll), siap dijual di marketplace
(Envato/ThemeForest/Gumroad) atau mandiri.

---

## ✅ Fase 0 — Setup Awal (SUDAH DIBUAT)
- [x] Struktur folder dasar (`core/`, `demo-html/`, `docs/`)
- [x] `package.json`, `tailwind.config.js`, `postcss.config.js`
- [x] `core/scss/main.scss` sebagai entry point
- [x] 4 komponen starter: Button, Card, Alert, Badge
- [x] `demo-html/index.html` untuk validasi visual
- [x] JS dasar: dropdown toggle, dark mode toggle
- [x] README.md

**Langkah selanjutnya biar Fase 0 benar-benar jalan:**
```bash
cd my-ui-kit
npm install
npm run build:css
# lalu buka demo-html/index.html di browser
```

---

## 🔲 Fase 1 — Lengkapi Komponen Inti (core/)
Tambahkan komponen baru satu per satu, ikuti pola yang sudah ada di `_button.scss` dkk:

- [x] Input / Form control (`_form.scss`) — text input, textarea, select, checkbox, radio
- [ ] Modal (`_modal.scss`) + interaksi JS (`core/js/modal.js`)
- [ ] Dropdown menu (`_dropdown.scss`) — lengkapi styling, JS sudah ada
- [ ] Table (`_table.scss`) — striped, bordered, hover
- [ ] Tabs (`_tabs.scss`) + JS switch tab
- [ ] Pagination (`_pagination.scss`)
- [ ] Tooltip (`_tooltip.scss`)
- [ ] Avatar (`_avatar.scss`)
- [ ] Sidebar / Navigation (`_sidebar.scss`) + JS toggle mobile
- [ ] Spinner / Loading state (`_spinner.scss`)

Setiap komponen baru wajib:
1. File SCSS baru di `core/scss/components/`
2. Import di `main.scss`
3. Ditambahkan ke halaman showcase (lihat Fase 2)

---

## 🔲 Fase 2 — Demo HTML Lengkap
- [ ] `demo-html/pages/ui-elements.html` — showcase SEMUA komponen & variant (kitchen sink)
- [ ] `demo-html/pages/dashboard.html` — contoh halaman dashboard nyata (stat card, chart, table)
- [ ] `demo-html/pages/auth-login.html` — halaman login
- [ ] `demo-html/pages/ecommerce.html` (opsional, kalau mau multi-demo)
- [ ] Pasang shared layout (header/sidebar/footer) di semua halaman demo

---

## 🔲 Fase 3 — Wrapper React (`packages/react-ui/`)
- [ ] Setup project React kecil (Vite) di dalam `packages/react-ui/`
- [ ] Buat komponen wrapper tipis: `Button.jsx`, `Card.jsx`, `Alert.jsx`, `Badge.jsx`, dst
  — komponen ini HANYA pasang class dari `ui-kit.css`, tidak menulis style baru
- [ ] `index.js` untuk export semua komponen sekaligus
- [ ] Contoh dashboard React pakai wrapper ini (folder `demo/`)
- [ ] (Opsional) siapkan `package.json` supaya bisa di-`npm pack`/publish

---

## 🔲 Fase 4 — Wrapper Laravel (`packages/laravel-ui/`)
- [ ] Buat Blade components: `button.blade.php`, `card.blade.php`, `alert.blade.php`, dst
- [ ] Copy `ui-kit.css` & `ui-kit.js` ke `resources/css` / `public` project Laravel
- [ ] Contoh dashboard Blade pakai component ini (folder `demo/`)
- [ ] (Opsional) susun jadi Composer package agar bisa `composer require`

---

## 🔲 Fase 5 — Dokumentasi
- [ ] `docs/installation-html.md` — cara pakai di HTML murni
- [ ] `docs/installation-react.md` — cara pakai di React
- [ ] `docs/installation-laravel.md` — cara pakai di Laravel
- [ ] `docs/changelog.md`
- [ ] `docs/index.html` — landing dokumentasi (kalau mau lebih niat, bukan cuma markdown)

---

## 🔲 Fase 6 — QA & Persiapan Rilis
- [ ] Cek konsistensi visual di 3 platform (HTML/React/Laravel)
- [ ] Cek dark mode di semua komponen
- [ ] Cek responsive (mobile, tablet, desktop)
- [ ] Screenshot preview untuk marketplace (1200x800 + beberapa detail)
- [ ] Tentukan lisensi (regular vs extended)
- [ ] Split jadi paket ZIP terpisah per platform kalau mau multi-listing di Envato

---

## Urutan Prioritas Kerja (ringkas)
1. Fase 0 → pastikan bisa `npm run build:css` dan demo tampil benar
2. Fase 1 → tambah komponen bertahap, jangan sekaligus semua
3. Fase 2 → halaman showcase, penting buat validasi visual & materi jualan
4. Fase 3 → React wrapper (biasanya paling banyak diminta pasar)
5. Fase 4 → Laravel wrapper
6. Fase 5 & 6 → dokumentasi + rilis

## Catatan
- Semua warna/spacing sebaiknya HANYA diubah lewat `tailwind.config.js`, jangan hardcode
  hex color langsung di file SCSS komponen, supaya tema tetap konsisten & gampang di-rebrand.
- Kalau nanti mau tambah framework lain (Vue, Svelte, dll), pola wrapper-nya sama seperti
  React/Laravel: tinggal pasang class dari `ui-kit.css`, tidak perlu menulis ulang styling.
