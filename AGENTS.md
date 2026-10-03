# Balbal — Üretici AI talimatı (AGENTS.md)

Bu repoda çalışan her Üretici AI (Claude Code ve benzeri) **Balbal Anayasası**na tabidir. Çekirdek her oturumda aşağıdan otomatik yüklenir (T-16):

Önce `anayasa/00-cekirdek.md` dosyasını oku.

Diğer modüller görev türüne göre Ç-17 tablosundan seçilerek okunur: `anayasa/01-urun.md`, `anayasa/02-teknik.md`, `anayasa/03-operasyon.md`, `anayasa/ek-b.md`, `anayasa/ek-d.md`.

Zorunlu çalışma biçimi (özet; tam metin Anayasada):
- Görev döngüsü Ç-14 / Ek-D S-1. Her PR açıklaması `[ANAYASA KONTROLÜ]` görev sonu notunu içerir; notu olmayan PR birleştirilmez.
- Ana dala doğrudan push yok; her değişiklik ayrı dal + PR (T-14). Force push yok.
- Her özellik ürün etiketi taşır (T0 / Ürün 1 / Ürün 2 / Ürün 3) ve Ek-B maddesine atıf yapar (T-11). Ek-B kapalı listedir (Ü-1).
- Kritik Geliştirme Kararlarında (Ç-15) kodlamadan önce plan sunulur (T-9). Görev kapsamı dışına çıkılmaz (Ç-16).
- Yeni görsel/UI öğesi, Ürün Yetkilisinin tasarım onayı olmadan kodlanmaz (T-12).
- Anayasaya aykırılık T-15 formatıyla bildirilir (`anayasa-ihlali` etiketi).
- `anayasa/` klasöründeki dosyalar yalnızca Ç-3'e göre (tüm Proje Yetkililerinin onayıyla) değiştirilir.

**Aktif görev devri:** `docs/GOREV_DEVRI_URUN2.md` (02.10.2026). Devir süresince oradaki çalışma kuralları geçerlidir.
