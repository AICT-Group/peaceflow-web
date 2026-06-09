#!/usr/bin/env python3
"""
IndexNow-Ping — beschleunigt Bing-/Copilot-/Yandex-Indexierung.

Statische Variante für peaceflow.ai (GitHub Pages, kein public/-Ordner):
- Key-File liegt im Repo-Root als <32-hex>.txt (Inhalt = der Key) und wird
  unter https://peaceflow.ai/<key>.txt ausgeliefert (verifiziert Domain-Besitz).
- Die zu meldenden URLs werden aus sitemap.xml gelesen.

Aufruf (nach jedem Deploy):  python3 scripts/indexnow_ping.py
IndexNow wird von Bing (Index hinter Microsoft Copilot) und Yandex genutzt;
Google nutzt es nicht, es schadet Google aber nicht.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

SITE = "peaceflow.ai"
HOST = f"https://{SITE}"
ROOT = Path(__file__).resolve().parent.parent


def find_key() -> str | None:
    """Key-File = einzige 32-Hex-stellige .txt im Repo-Root."""
    for f in ROOT.glob("*.txt"):
        stem = f.stem
        if len(stem) == 32 and all(c in "0123456789abcdef" for c in stem):
            return stem
    return None


def collect_urls() -> list[str]:
    """Alle <loc>-URLs aus sitemap.xml."""
    sm = ROOT / "sitemap.xml"
    if not sm.exists():
        return [f"{HOST}/de/", f"{HOST}/en/"]
    text = sm.read_text(encoding="utf-8")
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", text)


def main() -> int:
    key = find_key()
    if not key:
        print("Kein IndexNow-Key-File (<32-hex>.txt) im Repo-Root gefunden.", file=sys.stderr)
        return 1
    urls = collect_urls()
    if not urls:
        print("Keine URLs in sitemap.xml gefunden.", file=sys.stderr)
        return 1
    payload = {
        "host": SITE,
        "key": key,
        "keyLocation": f"{HOST}/{key}.txt",
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"IndexNow: HTTP {resp.status} für {len(urls)} URLs")
    except Exception as e:  # noqa: BLE001
        print(f"IndexNow-Ping fehlgeschlagen: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
