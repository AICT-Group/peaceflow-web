# peaceflow.ai — Relaunch-Briefing fürs Team

Stand: 2026-06-10 · Branch `relaunch/toolkit-foundation`

Dieses Dokument fasst zusammen, **was am Website-Relaunch umgesetzt wurde**, **was bewusst NICHT
umgesetzt wurde (mit Begründung)**, welche **manuellen Schritte** noch offen sind — und gibt eine
**Empfehlung zum Stack**. Gedacht zum Teilen im Team.

Rahmenbedingungen (so entschieden): bestehendes **HTML/CSS/JS** (kein Framework), Hosting bleibt
**GitHub Pages**, das **visuelle Design bleibt unverändert**. Es wurden nur die technischen,
GEO-, Accessibility-, Rechts- und Security-Bausteine des internen `web-toolkit` angewandt.

---

## 1) Umgesetzt (live-fähig auf GitHub Pages)

- **Accessibility (WCAG 2.2 AA):** „Zum Inhalt springen"-Link, semantische Landmarks
  (`<main>`/`<footer>`/`<nav aria-label>`) auf allen Seiten, sichtbarer Fokus-Ring, `.sr-only`,
  `prefers-reduced-motion`. Kontrast: Teal-Text auf ein AA-konformes Teal (`#47767f`, ≥4,5:1)
  umgestellt — Grafiken/große Headings behalten das Marken-Teal `#5a8a95`.
- **Recht:** Barrierefreiheitserklärung **DE** (`/de/barrierefreiheit/`) + **EN**
  (`/en/accessibility/`), Footer-Link auf allen Seiten. *(Anwaltliche Prüfung empfohlen.)*
- **Structured Data (JSON-LD):** WebPage auf Features- und Rechtsseiten, BreadcrumbList auf allen
  Unterseiten — zusätzlich zur bestehenden Organization/FAQ/SoftwareApplication/AboutPage.
- **Discovery:** `sitemap.xml` aktualisiert (+ Barrierefreiheits-Seiten), `llms.txt` erweitert,
  neue `llms-full.txt` (Volltext-Kontext für KI-Suchsysteme).
- **PWA/Icons:** `manifest.json`, 192/512-Icons, `apple-touch-icon`, `favicon.ico`, Head-Links auf
  allen Seiten; gebrandete `404.html`.
- **Security (Client-seitig):** `/.well-known/security.txt` (RFC 9116) und eine **CSP** als
  `<meta http-equiv>` auf allen Seiten (whitelistet Adobe Typekit, Google Fonts, MailerLite).
- **CI:** IndexNow-Ping nach Deploy (Bing/Copilot), QA-Gate auf Pull Requests (HTML-Lint, Linkcheck,
  Lighthouse-Budgets für A11y/SEO).

---

## 2) NICHT umgesetzt — und warum

| Punkt | Warum nicht | Voraussetzung zum Nachholen |
|---|---|---|
| **Privacy-Beacon-Analytics** (eigene, cookiefreie Zugriffsmessung) | Braucht serverseitiges **PHP** (`track.php`). GitHub Pages liefert nur statische Dateien aus. | Eigenes Hosting mit PHP. Solange: Messung über Google Search Console. |
| **Echte HTTP-Security-Header** (HSTS/Preload, `X-Frame-Options` bzw. CSP `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) | GitHub Pages erlaubt **keine** eigenen Response-Header. Die gesetzte Meta-CSP ist nur ein Teil-Ersatz: Clickjacking-Schutz (`frame-ancestors`), HSTS und CSP-Reporting funktionieren **ausschließlich** als echter Header. | Eigenes Hosting (z. B. Hetzner) mit `.htaccess`/Server-Config. Ziel: A/A+ auf securityheaders.com. |
| **Passwortgeschützte Kundenbereiche** (Magic-Link / Basic-Auth) | Braucht serverseitige Logik (PHP). | Eigenes Hosting. |
| **Visuelles Redesign / Design-System-Angleichung** | Bewusst ausgeklammert — das bestehende peaceflow-Design soll bleiben. | — (Produktentscheidung) |

> Kurz: Die drei großen Lücken (Analytics, Security-Header, Kundenbereiche) hängen **alle am
> selben Punkt** — GitHub Pages kann keinen Server-Code ausführen und keine Header setzen.

---

## 3) Offene manuelle Schritte (kann das Team in Minuten erledigen)

1. **EN-Newsletter-Formular mit Inhalt füllen.** Das englische Formular ist angelegt
   („Peaceflow Newsletter Form (EN)", Gruppe *Newsletter*, Double-Opt-In) und auf `/en/` eingebunden.
   Der **Text/die Felder** lassen sich per API nicht setzen — bitte **einmalig im MailerLite-Dashboard**
   anlegen: <https://dashboard.mailerlite.com/forms/189872920836703814/overview>.
   Bis dahin liefert die Einbettung HTTP 503 (kein Inhalt). **→ vor dem Deploy erledigen.**
2. **Adobe Fonts: Domain whitelisten.** Damit die Marken-Schriften (Microgramma, PF Videotext,
   Courier) live laden, muss `peaceflow.ai` im Adobe-Fonts-Web-Projekt (Kit `uus7iqo`) als erlaubte
   Domain hinterlegt sein. Pfad: Adobe Fonts → *Web Projects* → Kit `uus7iqo` → *Edit project* →
   Domains → `peaceflow.ai` (und ggf. `www.peaceflow.ai`) hinzufügen → speichern.
   Ohne das greift der Google-Fonts-Fallback (Orbitron/VT323/Courier Prime) — die Seite bleibt
   funktionsfähig, sieht aber nicht 1:1 nach Marke aus. *(Nur ihr habt Account-Zugriff.)*
3. **Wikidata-Item** für AICT Group / peaceflow anlegen (Off-Site-Authority) und die Q-ID ins
   `sameAs` der Organization eintragen — stärkster Off-Site-GEO-Hebel, niedrige Hürde.

---

## 4) Empfehlung: Stack- bzw. Hosting-Wechsel erwägen

**Empfehlung:** Mittelfristig von „statisches HTML auf GitHub Pages" auf den **Toolkit-Zielstack
umsteigen — Next.js (Static Export) auf EU-Hosting mit PHP (z. B. Hetzner)** — sofern eines der
folgenden Themen geschäftlich relevant wird:

- **Eigene, DSGVO-freundliche Analytics** (wer kommt woher, was konvertiert) statt nur Search Console.
- **Security-Rating A/A+** (HSTS, Clickjacking-Schutz, echte CSP mit Reporting) — relevant für
  Vertrauen/B2B und Security-Reviews von Kund:innen.
- **Passwortgeschützte Kundenbereiche** (Magic-Link/Basic-Auth).
- **Wartbarkeit:** aktuell wird jede Kopf-/Footer-Änderung in ~15 HTML-Dateien manuell wiederholt
  (kein Templating). Next.js bringt Komponenten/Layouts → eine Änderung statt fünfzehn.
- **EU-Datensouveränität**: Hosting-Standort + Zustelldienste vollständig in eigener Hand.

**Aufwand/Risiko:** Migration ist ein Projekt (Inhalte portieren, Build/Deploy, DNS-Umstellung,
Redirect-Map), aber das `web-toolkit` liefert für **alle** oben genannten Bausteine fertige Vorlagen
(Phasen 0–7). Das Design kann dabei 1:1 übernommen werden.

**Wenn die Seite eine reine Marketing-Visitenkarte bleibt** (kein Analytics-/Security-/Login-Bedarf),
ist der aktuelle statische Stand völlig ausreichend — dann kein Wechsel nötig.

---

## Referenz
Interne Vorlagen: `web-toolkit/` (Phasen 0–7). Technische Details zum Datenfluss/Privacy-Modell:
`web-toolkit/docs/architecture.md`. Alle Änderungen dieses Relaunches liegen auf dem Branch
`relaunch/toolkit-foundation`.
