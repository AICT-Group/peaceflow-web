# web-toolkit — Umsetzungsstand & bewusst verschobene Punkte

Stand: 2026-06-09 · Branch `relaunch/toolkit-foundation`

Diese Site wird nach dem `web-toolkit`-Standard betrieben, aber unter zwei Rahmenbedingungen:
**statisches HTML/CSS/JS** (kein Next.js) und **Hosting auf GitHub Pages** (kein eigener Server/PHP).
Daher sind einige Toolkit-Bausteine bewusst **nicht** umgesetzt. Dieses Dokument hält fest, was fehlt
und was ein Hosting-Wechsel (EU-PHP, z. B. Hetzner) freischalten würde.

## Umgesetzt (GitHub-Pages-tauglich)
- **A11y (WCAG 2.2 AA):** Skip-Link, `<main id="main">` / `<footer>` / `nav[aria-label]`, Fokus-Ring, `.sr-only`, `prefers-reduced-motion` (bereits vorhanden).
- **Recht:** Barrierefreiheitserklärung DE (`/de/barrierefreiheit/`) + EN (`/en/accessibility/`), Footer-Link auf allen Seiten.
- **Structured Data:** WebPage auf Features + Legal-Seiten, BreadcrumbList auf allen Unterseiten (zusätzlich zu bestehender Organization/FAQ/SoftwareApplication/AboutPage).
- **Discovery:** `sitemap.xml` (lastmod aktualisiert + Barrierefreiheits-Seiten), `llms.txt` erweitert, neue `llms-full.txt`.
- **PWA/Icons:** `manifest.json`, `img/icon-192.png` / `icon-512.png`, `apple-touch-icon.png`, `favicon.ico`, Head-Links auf allen Seiten. Gebrandete `404.html`.
- **Security (Client-seitig):** `/.well-known/security.txt` (RFC 9116), **CSP via `<meta http-equiv>`** auf allen Seiten (whitelistet Adobe Typekit, Google Fonts, MailerLite-iframe).

## Bewusst verschoben — braucht eigenen Server (EU-PHP-Hosting)
- **Phase 2 — Privacy-Beacon-Analytics** (`track.php`): PHP läuft auf GitHub Pages nicht. Messung läuft vorerst über **Google Search Console** (cookiefrei). Bei Hosting-Wechsel: `web-toolkit/2-beacon/` deployen.
- **Phase 3 — echte HTTP-Security-Header:** GitHub Pages setzt keine Custom-Header. Damit fehlen:
  - `Strict-Transport-Security` (HSTS) inkl. preload,
  - `X-Frame-Options` / CSP `frame-ancestors` (Clickjacking-Schutz — in `<meta>`-CSP wirkungslos, nur als echter Header),
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-*`-Header.
  Die Meta-CSP ist ein Teil-Ersatz, aber `frame-ancestors`, HSTS und Report-Only sind **nur** per Header möglich.
  Bei Hosting-Wechsel: `web-toolkit/3-deploy/.htaccess` übernehmen, Ziel A/A+ auf securityheaders.com.
- **Phase 7 — Passwortgeschützte Kundenbereiche** (Magic-Link/Basic-Auth, PHP): nicht lauffähig auf GitHub Pages.

## Ebenfalls offen / Folgeaufgaben
- **EN-Newsletter-Formular:** `en/index.html` bindet aktuell noch das **deutsche** MailerLite-Formular ein → eigenes EN-Formular nötig.
- **Adobe-Typekit-Kit `uus7iqo`:** Domain `peaceflow.ai` im Adobe-Fonts-Web-Projekt whitelisten, sonst greift der Google-Fonts-Fallback.
- **Phase 5 — Off-Site-Authority:** Wikidata-Item für AICT Group/peaceflow anlegen, Q-ID anschließend ins `sameAs` der Organization eintragen.
- **CSP härten:** Sobald eigener Server vorhanden, CSP als echten Header mit `report-uri`/`report-to` testen, dann `'unsafe-inline'` wo möglich reduzieren.

## Visuelles Design
Das bestehende Peaceflow-Design/Layout wurde **bewusst nicht verändert** (kein Re-Skin nach `design-system/`).
Alle Maßnahmen oben sind rein additiv/technisch und designneutral.
