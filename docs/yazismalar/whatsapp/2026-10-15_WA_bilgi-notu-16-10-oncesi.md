# WhatsApp kaydı — Naci'ye bilgi notu: 16.10 sabahına kadar yapılacaklar

**Tarih:** 15.10.2026 akşam (Word: `2026-10-15_Naciye_Bilgi_Notu_Yarin_Oncesi.docx`; repoya geriye dönük kayıt 16.10.2026)
**Kimden:** Tansu (Ürün Yetkilisi)
**Kime:** Naci ve Naci'nin yapay zekâsı
**Tür:** Yönlendirme (talimat) — 16.10 karar penceresine hazırlık
**Dayanak:** Ortak not (15.10), Naci'ye sonraki aşama notu (PR #39), T1 raporu, kontrolör durum raporu (PR #41)
**Sonraki durum:** Uygulandı. Ölçüm M1 iş emriyle yapıldı (company-ai `IS_EMRI_2026-10-16M1.md`); B tablosundaki konular 16.10 karar penceresinde karara bağlandı (PR #37 yorumu). Madde 7'deki geliştirici cevabı company-ai `docs/yazismalar/2026-10-15_gelistirici-cevabi-yol-haritasi.md` olarak eklendi (yan dalda).

---

**Özet:** Yarın sabah kontrolörün durum raporu üzerinden sonraki aşamayı birlikte belirleyeceğiz. Toplantıdan önce bir şeyin hazır olması gerekiyor: **bugünkü canlı kodun gerçek skoru.** Elimizdeki 70/99, 14.10 koşusunun ham cevaplarının yeniden puanlanması; A2/A2L2/A2L3 sonrası kod hiç 99 soruyla ölçülmedi. Bu gece/sabah için istenenler **ölçüm, okuma ve kayıt; kod, prompt ve şema değişikliği yok.** Kod işleri yarınki kararla başlar.

## A. Toplantıdan önce yapılacaklar (sırayla)

1. **99 soru ölçümü — canlıdaki kodla, tek koşu.** Kod A2L3 (64c8966), migration 0016, canlıyla birebir ayar (Haiku router/cevap + cevap düşünmesi, Sonnet Excel planı, EK_F_MODE=true, DEMO_TODAY 06.10.2026). Puanlayıcı v2.0 ve soru seti v13 **değişmez**. Sonuç `results/` altına; tek sayfa rapor: toplam ve kategori skorları, router düşüşü, maliyet, Excel tek değer oranı. Bu bir **kapı koşusu değil, huni girdisidir**; Faz 2'nin 3 koşu kuralını etkilemez. Maliyet ≈ $0,55.
2. **Kendinden emin yanlış (KY) listesi genişletilmiş tanımla.** Ortak nottaki K-F tanımı: ledger'a aykırı rakam + kural ihlaliyle verilmiş emin cevap + proje karışması + başka projenin belgesini doğru diye sunma + eksik listeyi tam gibi sunma. Her KY için: soru ID, verilen cevap, doğrusu, tahmini kök neden.
3. **Huni tablosunu yeni koşuya göre yenile.** Aynı 7 aşama (Arama, Proje ekseni, Router, Israrlı red, Kural, Excel, Puanlama-kaynak). Özellikle: Aşama 3'ün 5 sorusu (IZM-DEV-004/005/006, ANK-COR-001, ANK-OPS-001) daraltma sonrası düzeldi mi; adsız 13 soru hâlâ aynı yerde mi; önce ✅ sonra ❌ olan her soru tek tek.
4. **AI-BalBal reposunu çek ve iki dosyayı oku.** PR #40 (B-01 — Yeşilova ödeme planı; başlık "Karatepe dışı Excel dosyalarına ulaşılamıyor" olarak daraltılacak) ve PR #41 (kontrolör durum raporu). İkisi de bilgilendirmedir. İtiraz/ek bulgu varsa yarınki tek mesaja yazılır.
5. **B-01 için tek teşhis sorusu (LLM'siz, audit SELECT).** Yeşilova ödeme planı sorusu router'da hangi türe gitti (DOCUMENT / DATA / MIXED) ve Excel hattı çalıştı mı? Kod değişikliği istenmiyor, cevap yeter.
6. **OPERATIONS.md'ye tek satır.** "Gemini'ye dönüş" komutu artık tek başına yetmez; önce 0016 → 0015 downgrade gerekir.
7. **Geliştirici cevabın repoya.** 15.10 "Yol haritasına geliştirici cevabı" Word dosyası company-ai `docs/` altına tarih önekli markdown olarak. Ortak not AI-BalBal `docs/yazismalar/` altına (Tansu tarafı).

**Bu gece yapılmayacaklar:** TEST_PRJ satırı, alias/ASCII/GES-eki düzeltmeleri, adsız sorularda proje seçimi, 25 ortam-bağımlı test, PR #38 dağıtımı.

## B. 16.10'da karara bağlanacak konular

Kararı Tansu verir; geliştiriciden her biri için bir cümlelik uygulama görüşü (büyüklük, risk, sıra) istendi.

| # | Konu | Kaynak |
|---|---|---|
| 1 | DOC-CO-ADM-001/002/003 grup mu, proje mi | T1-1 |
| 2 | Canlı TEST_PRJ satırı: silme / pasife alma; alt dize eşleşmesi ve is_active süzgeci | T1-2 |
| 3 | ASCII katlama (Kizilova), harf duyarsız eşleşme (bursa RES), RES/GES eki — tek iş emri mi | T1-2, A2-3 |
| 4 | 13 belge sorusunda ledger değeri biçimlenemiyor → biçimlendirici genişletilsin mi | T1-3 |
| 5 | G1 "uydurma sayı" denetimi MIXED/DATA cevaplarının belge kısmına | T1-4 |
| 6 | GEN-GEN-002 netleştirmeyle geçmesi (kontrolör: gereksiz netleştirme, 0,5) | T1-5 |
| 7 | Adsız sorularda proje seçimi: PR #39 §4 kararı esas — uygulama önerisi | A2-2 |
| 8 | G3 "başka projenin belgesi" kuralı yalnız ANK/IZM tanıyor → 6 projeye | F0-5 |
| 9 | Grup belgeleri idari_isler'de; finans/hukuk görmeli mi | T1-B4 |
| 10 | 25 ortam-bağımlı testin fixture'a alınması — ne zaman | Ortak not |
| 11 | PR #38 (açılış örnek soruları) canlıya dağıtım — ne zaman | S1 §9 |

## C. Bilgi

- Kontrolörün 16.10 sabah işleri (20 soruluk bağımsız puanlama vb.) 1. maddedeki koşunun `results.json`'una bağlı; koşu 08:00'e kadar bitmeli.
- Faz 2 kapısı değişmedi: 3 koşu ortalaması ≥ %75, KY = 0, güvenlik %100, saklı sette ciddi düşüş yok.
- Karar penceresi K-D: 08:00 geliştirici raporu → 12:00 tek mesaj → akşam uygulama.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Diğer:
