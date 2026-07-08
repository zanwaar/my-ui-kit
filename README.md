# My UI Kit

UI Kit berbasis **Tailwind CSS**, tapi dipakai dengan cara **plug-and-play seperti Bootstrap**
(class siap pakai: `.btn`, `.card`, `.alert`, dll) — bukan pola shadcn (copy-paste per komponen).

Dibuat agar bisa dipakai di **berbagai jenis project**: HTML murni, React, Laravel (Blade), dan
project lain yang bisa menyertakan file CSS/JS.

## Konsep

1. Semua styling didefinisikan sekali di `core/scss/` menggunakan Tailwind `@apply`.
2. `core/scss/main.scss` di-compile menjadi `core/dist/ui-kit.css` — satu file CSS jadi sumber
   kebenaran (single source of truth) untuk semua platform.
3. Setiap platform (HTML, React, Laravel, dll) tinggal memakai class hasil compile ini,
   tanpa perlu menulis ulang styling.
4. Interaktivitas (dropdown, modal, dark mode toggle) ditulis pakai **vanilla JS**
   di `core/js/`, supaya tidak terikat ke satu framework.

## Struktur Folder

```
my-ui-kit/
├── core/                 # Sumber utama (framework-agnostic)
│   ├── scss/              # Source SCSS + Tailwind @apply
│   │   ├── abstracts/     # variables & mixins
│   │   ├── components/    # 1 file per komponen (button, card, alert, dst)
│   │   ├── themes/        # override light/dark
│   │   └── main.scss      # entry point, import semua partial
│   ├── js/                # Interaksi vanilla JS (dropdown, toggle tema, dll)
│   └── dist/              # HASIL COMPILE — ini yang didistribusikan/dipakai
│       ├── ui-kit.css
│       └── ui-kit.min.css
│
├── demo-html/             # Contoh pemakaian di HTML murni
│   ├── index.html
│   └── pages/             # (nanti) dashboard.html, ui-elements.html, dst
│
├── packages/              # (tahap berikutnya) wrapper per framework
│   ├── react-ui/          # wrapper komponen React
│   └── laravel-ui/        # wrapper Blade component
│
├── docs/                  # Dokumentasi untuk pembeli/pengguna
│
├── tailwind.config.js     # Design token: warna, radius, dark mode, dll
├── postcss.config.js
├── package.json
└── PLAN.md                # Rencana kerja & tahapan pengembangan
```

## Cara Menjalankan (Development)

1. Install dependency:
   ```bash
   npm install
   ```

2. Compile SCSS ke CSS:
   ```bash
   npm run build:css
   ```
   Perintah ini menjalankan 2 tahap otomatis: Sass mengompilasi semua partial `_*.scss`
   jadi satu file (`core/dist/_compiled.css`), lalu Tailwind CLI memproses `@apply`/`@tailwind`
   di file itu jadi `core/dist/ui-kit.css` (file final yang dipakai di HTML).

   Untuk auto-recompile sekali jalan (SCSS + Tailwind sekaligus):
   ```bash
   npm run dev
   ```

3. Buka `demo-html/index.html` di browser (disarankan pakai extension **Live Server**
   di VS Code) untuk melihat hasilnya secara langsung.

4. Untuk build versi production (minified):
   ```bash
   npm run build:css:prod
   ```

## Komponen yang Sudah Tersedia (starter)

- `Button` — `.btn`, variant: primary/danger/success/warning/outline/ghost, size: sm/lg
- `Card` — `.card`, `.card-header`, `.card-body`, `.card-footer`
- `Alert` — `.alert`, variant: primary/success/danger/warning
- `Badge` — `.badge`, variant: primary/success/danger/warning
- `Form` — `.form-control`, `.form-label`, `.form-check`, `.form-check-input`, `.form-check-label`

Komponen berikutnya (modal, dropdown, table, tabs, pagination, sidebar) mengikuti
pola yang sama: buat file baru di `core/scss/components/`, lalu import di `main.scss`.

## Cara Menambah Komponen Baru

1. Buat file baru, misal `core/scss/components/_modal.scss`
2. Tulis class pakai `@apply`, ikuti pola penamaan `.nama-komponen` + `.nama-komponen-variant`
3. Tambahkan `@import "components/modal";` di `core/scss/main.scss`
4. Jalankan `npm run build:css` untuk lihat hasilnya
5. Cek checklist konsistensi di `docs/design-consistency-skill.md` sebelum dianggap selesai

## Roadmap

Lihat detail tahapan di [PLAN.md](./PLAN.md).

## Lisensi

Tentukan sebelum dijual (mis. regular license vs extended license jika dirilis di marketplace).
