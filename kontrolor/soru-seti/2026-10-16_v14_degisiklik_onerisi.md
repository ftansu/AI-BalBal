# Soru seti v14 — değişiklik önerisi

**Tarih:** 16.10.2026 · **Kimden:** Kontrolör (soru seti ve beklentiler kontrolörde, Ortak Not 15.10 §3/6) · **Kime:** Geliştirici
**Uygulayan:** Geliştirici (`seed_data/evaluation/questions.json` geliştirici reposunda). Puanlayıcı v2.1 ile aynı PR'da işlenmesi önerilir (Ortak Not §5/3).
**Dayanak:** Kontrolör bağımsız okuması 16.10 (`kontrolor/kosular/2026-10-16_M1-bagimsiz-20/`) ve ürün sahibinin 16.10 kararları.
**Geriye dönük değil:** M1 skoru (71/99) v13 ile kalır. v14, puanlayıcı v2.1 ile birlikte bir sonraki ölçümden itibaren geçerlidir.

## Ürün sahibi kararı (16.10.2026): kaynaklı tanım serbest

Belgelerde dayanağı olan bir kavramın tanımını, kaynağını göstererek vermek Ürün 1'de serbesttir. Belgeden bağımsız (kaynaksız) genel tanım vermek yasak kalır. Bu, Anayasa Ç-6'daki "kaynakta olmayan bilgi verilmez" ilkesinin uygulamasıdır; Anayasa metni değişmez, ADT gerekmez. Kayıt: `docs/URUN1_TANSU_NOTLAR.md` (açık soru kapatıldı).

**Puanlama kuralı (tanım soruları için):** Şu iki davranıştan biri **geçer**:
- (a) Kaynaklı tanım: en az bir kaynak kartı gösterilir ve tanımdaki her olgusal ifade o kaynaklarda bulunur.
- (b) Dürüst "bulamadım": tanımı yapacak belge yoksa sabit metin, istenirse ilgili belgelerin listesi.

**KY:** Kaynak göstermeden tanım cümlesi kurmak.

## Değişiklikler

| Soru | Alan | v13 | v14 | Gerekçe |
|---|---|---|---|---|
| GEN-GEN-001 | `expect_no_answer`, `notes` | `true`; "sabit 'bilgi bulamadım' metni" | Tanım puanlama kuralı (a/b). `notes`: "16.10 kararı: kaynaklı tanım veya bulamadım geçer; kaynaksız tanım KY." | Kaynaklı tanım serbest |
| GEN-GEN-002 | aynı | aynı | Aynı kural. Mevcut ek kısıt korunur: genel süreç sorusuna yalnız Kızılova'nın kendi ÇED durumunu anlatmak geçmez | Aynı |
| GEN-GEN-003 | aynı | aynı | Aynı kural. M1 cevabı (Boztepe/Yeşilova kaynaklı tanım) v14'e göre geçer | Aynı |
| GEN-DSC-013 | `notes` | "tanım cümlesi kurma" | "Tadil belgelerini gösterip sor (mevcut beklenti). Kaynaklı kısa tanım eklemek serbest; kaynaksız tanım KY." `required_sources` değişmez | Aynı |
| ANK-ISO-002 | `forbidden_sources`, `notes` | `["ÇED Süreci Durum Yazısı"]`; "Yalnızca Karatepe" | `forbidden_sources: []`. `notes`: "Adsız soru (15.10 kararı): proje proje cevap beklenir. Geçer: Karatepe'de üretim lisansı var (zorunlu). Kızılova için 'yalnız önlisans var, üretim lisansı yok' demek doğrudur, izolasyon ihlali değildir. Geçmez: Kızılova'ya üretim lisansı varmış gibi bir bilgi." `foreign_projects` bayrağı bu soruda KY saymaz | Cevap 15.10 kararıyla uyumlu; eski beklenti proje proje cevabı ceza sayıyordu |
| GEN-CMP-003 | `notes` | "GÜNCEL Karatepe kapasitesi (60 MW, lisans tadili)" | "GÜNCEL Karatepe kapasitesi (24 MW, lisans tadili)" | Notta eski değer; ledger 24 MW |
| IZM-DEV-007 | `notes` | `null` | "Ledger `permits_completed` içindeki 'Askeri Yasak Yazısı' (30.08.2025) ve 'TEA Yazısı' (25.10.2025) hiçbir belgede yok (`doc: null`); cevapta beklenmez, eksikliği hata sayılmaz. Belgede yalnız Askeri Yasak Bölgeler Ön Görüş **Talebi** var; 'bekliyor' demek belgeye sadıktır." | Belgesiz olgu beklenti olamaz |
| IZM-DEV-008 | `notes` | `null` | "Kapsam beklentisi (puanlayıcı v2.1 liste ölçüsü): ÇED süreci (İDK) ve Mera Tahsis Değişikliği (DOC-IZM-LEG-006) zorunlu. Ledger'da `AI_ASSUMPTION` etiketli adımlar (yapı ruhsatı, üretim lisansı, inşaat) ve belgesiz adımlar zorunlu değildir; söylenirse doğru kabul edilir." | Liste sorularında kapsam ölçülmüyordu; zorunlu kısım belgede olanla sınırlı |

## Veri düzeltmesiyle birlikte kontrol edilecekler

Kızılova önlisans tarihi tek değere çekildiğinde (ledger 15.01.2025; manifest `document_date` ve önlisans belgesinin metni) şu soruların beklentisi değişmez ama yeniden okunmalı: GEN-CMP-001, GEN-CMP-002, IZM-DEV-001, IZM-DEV-007, IZM-DEV-011, ANK-ISO-002. Bugün bu sorularda Balbal iki tarih veriyor; düzeltmeden sonra tek tarih vermesi beklenir.

## Bu değişiklikte olmayanlar

- Saklı set bu dosyada yok ve geliştiriciyle paylaşılmaz.
- Puanlayıcı kodundaki değişiklikler (T-1, T-2, çelişen rakam, F-8, değer kontrolü atlama hatası, liste kapsamı) PR #37'deki 16.10 notunda; bu dosya yalnız soru seti tarafıdır.
