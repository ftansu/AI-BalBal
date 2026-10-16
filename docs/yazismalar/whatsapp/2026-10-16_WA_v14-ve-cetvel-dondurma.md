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
- Yeniden puanlama sonucu (v2.1+v14, M1):
- Kızılova önlisans tarihi düzeltmesi — commit:
- Dondurma etiketi ve commit:
- Ana dal birleştirme planı (görüş):
- Diğer:
