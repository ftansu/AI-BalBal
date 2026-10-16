# WhatsApp kaydı — v14 onayı ve cetvel dondurma

**Tarih:** 16.10.2026 (WhatsApp'tan gönderildi; aynı gün repoya kaydedildi)
**Kimden:** Tansu (Ürün Yetkilisi) — kontrolör önerisiyle
**Kime:** Naci
**Tür:** Karar + iş talebi
**İlgili:** `2026-10-16_WA_verimlilik-gorusune-cevap.md` (§1 ve Naci'nin cevabı), `kontrolor/soru-seti/2026-10-16_v14_degisiklik_onerisi.md`, company-ai `773b3a4` (V21), `ca5d07c` (C1)

---

## Neden bu not

Naci'nin cevabına göre V21 dondu: puanlayıcı v2.1, commit `773b3a4`. Ancak V21 commit'i `questions.json`'a dokunmadı, yani soru seti hâlâ **v13**. v13'te bilinen hatalar var. GEN-CMP-003 notunda eski 60 MW değeri duruyor (ledger 24 MW). ANK-ISO-002 ise 15.10 kararına aykırı biçimde proje proje cevabı ceza sayıyor. Kapı v13 ile koşulursa skor yanlış çıkar. Bu yüzden dondurma, v14 uygulandıktan sonraki commit'e bağlanıyor.

## Mesaj

Naci merhaba,

1. **Puanlayıcı v2.1 (773b3a4) onaylı.** Ancak soru seti hâlâ v13; kapı bununla koşulmasın.
2. **v14 onaylı** (`kontrolor/soru-seti/2026-10-16_v14_degisiklik_onerisi.md`). Yalnızca 8 sorunun alanları değişiyor; kod, prompt ve şema aynı kalıyor. Küçük bir iş emri olarak uygula. Ardından M1'i v2.1+v14 ile LLM'siz yeniden puanla; bu yeni referans olsun. Resmî M1 (71/99, v13) değişmez.
3. **Dondurma = v2.1 + v14 commit'i.** Bu commit'e bir etiket koy (ör. `cetvel-v2.1-v14`) ve README'ye yaz. Üç kapı koşusu ve tüm eval denemeleri (kural merdiveni, embedding, ileride ajan) bu etiketle yapılsın.
4. **Kızılova önlisans tarihi düzeltmesi** (iki tarih → tek tarih, ledger 15.01.2025) kapıdan **önce** yapılsın. Kapı sırasında veri değişirse skorlar kıyaslanamaz. Ayrı küçük iş emri; v14 ile karıştırılmasın.
5. **feat dalının ana dala alınması** (195 commit, C1 dahil) ayrı bir konu, ayrıca konuşalım. Etiket olduğu için kapıyı bekletmez.

Acele yok, kendi temponda. Kolay gelsin.
Tansu

## Sıra (özet)

1. v14 uygulanır → LLM'siz yeniden puanlama → yeni referans skoru
2. Kızılova önlisans tarihi düzeltilir
3. Etiket + README → kontrolör doğrular
4. Kapı koşuları başlar (3 koşu, saklı set kontrolörde)

Dondurmadan önce başlamayacaklar: 7(i) adsız sorular, router ipuçları (madde 12), kural merdiveni, embedding ölçümü.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- v14 uygulandı mı — commit:
  - 16.10.2026 — company-ai b9bfb54. 8 sorudan 5'i uygulandı (ANK-ISO-002, GEN-DSC-013, GEN-CMP-003, IZM-DEV-007, IZM-DEV-008). GEN-GEN-001/002/003 uygulanamadı: "kaynaklı tanım VEYA dürüst bulamadım" kuralı puanlayıcı v2.1 alanlarıyla ifade edilemiyor (expect_no_answer yalnız bool). Puanlayıcı koduna dokunulmadı (cetvel dondurulmuş). Karar sende, aşağıda "Diğer".
- Yeniden puanlama sonucu (v2.1+v14, M1):
  - 16.10.2026 — M1 70/99, S3r 70/99 (v2.1+v13: 69/99). Resmî M1 71/99 (v2.0, v13) değişmedi. v13→v14 farkı yalnız ANK-ISO-002 ❌→✅. Güvenlik 92/99 (değişmedi). GEN-GEN kuralı ifade edilirse GEN-GEN-003 de geçer: M1 ve S3r 71/99. Rapor: company-ai docs/reports/IS_EMRI_2026-10-16V14.md.
- Kızılova önlisans tarihi düzeltmesi — commit:
  - 16.10.2026 — Plan hazır, uygulama onay bekliyor: company-ai e76ae5f, docs/reports/IS_EMRI_2026-10-16K1_PLAN.md. Çelişki kaynağı izmir_res.yaml'daki 2 satır (DOC-IZM-DEV-001, 18.01.2024); ledger 15.01.2025 doğru. Düzeltme için canlıda yalnız bu belge silinip yeniden seed edilecek (yeni UUID, kod yok, ~2 dk); canlı adım Ç-15/6 gereği ayrı onay ister. Sorular aşağıda.
- Dondurma etiketi ve commit:
  - 16.10.2026 — Etiket (cetvel-v2.1-v14) henüz atılmadı; GEN-GEN kararı ve Kızılova düzeltmesinden sonra atılacak.
- Ana dal birleştirme planı (görüş):
  - 16.10.2026 — Ayrıca konuşulacak.
- Diğer:
  - 16.10.2026 — 1) KARAR GEREKİYOR — GEN-GEN-001/002/003: puanlayıcıya "ikisi de olur" diyen küçük bir alan eklenmesini (cetvel v2.2, tek satır, diğer 96 soru aynı) onaylıyor musun? Onaylarsan GEN-GEN-003 geçer (71/99). Onaylamazsan üç soru bugünkü hâliyle kalır. 2) KARAR GEREKİYOR — Kızılova planı SORU 2: belge metni token'dan düzelecek; "…15.01.2025 tarihinde başlatılan işlemler silsilesi, 15.01.2025 tarihli resmi evrak ile teyit edilmiştir" biçiminde totolojik bir cümle olur. Olduğu gibi kalsın mı (önerim), yoksa elle düzeltilip hand_edited notu mu eklensin? 3) KARAR GEREKİYOR — Kızılova planı SORU 3: DOC-IZM-LEG-004'ün document_date'i 01.11.2023 ama içinde 15.01.2025 önlisansı anılıyor (veri hatası, K1 kapsamı dışı). Ayrı küçük emir olarak kapıdan önce düzeltilsin mi (önerim)? Evet ise iki belgeyi tek canlı işlemde yenilerim. 4) BİLGİ — 7(i) adsız sorular (N1) canlıya alındı: company-ai a411c0a, ADR-034, 16.10 15:21 UTC, kod-yalnız, smoke 9/9. Emir senin 17:02 (PR #51) notundan önce verilmişti ve onun tamamlanması senin "dondurmadan önce başlamayacaklar" sıranla çakıştı; bunu şimdi bildiriyorum. Geri alma ≈12 sn, kod-yalnız (rapor §3). Sonuç: M1 v2.0 69/99, v2.1 68/99; 15 adsız değer sorusu model çağırmadan "Hangi proje için sormak istiyorsunuz?" cümlesini alıyor; LLM'siz soru 16→31, maliyet $0,35. Düşen 2 soru (GEN-DSC-003, GEN-DSC-011-K) bilinçli: senin kuralın ↔ questions.json beklentisi çelişiyor. Karar: N1 canlıda kalsın mı, geri mi alınsın? Önerim: kalsın. Ayrıca raporun §6'sı: getirimde tek proje çıkan adsız değer sorusu sorulsun mu doğrudan cevaplansın mı (bugün sorulur) ve GEN-DSC-003/011/011-K, ANK-NEG-004, ANK-MIX-001, GEN-DSC-004 beklentileri 7(i) kuralıyla çelişiyor (soru seti sende). 5) AÇIK SORULAR (önceki mesajdan): Saklı set hangi tarihte hazır olur? "Karatepe GES" son ek uyuşmazlığı (ADR-033'te açık) için karar? Excel proje ayrımı planını (PR #52) yazacağım; görüşüm planda olacak.
