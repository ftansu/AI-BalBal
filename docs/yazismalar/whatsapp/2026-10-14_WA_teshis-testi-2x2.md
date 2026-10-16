# WhatsApp kaydı — Teşhis testi için sistem hazırlığı (2×2)

**Tarih:** 14.10.2026 (Word olarak hazırlandı: `2026-10-14_Teshis_Testi_Sistem_Hazirligi.docx`; repoya geriye dönük kayıt 16.10.2026)
**Kimden:** Tansu (Ürün Yetkilisi)
**Kime:** Naci
**Tür:** Talep (test ortamı hazırlığı)
**Gönderim durumu:** WhatsApp'tan gönderildiği varsayıldı. Naci "Cevap" bölümünde teyit eder.
**Sonraki durum:** 16.10.2026'da bu test "kural merdiveni" olarak genişletildi (bkz. `2026-10-16_WA_verimlilik-gorusune-cevap.md` §3a). Bu notun tek başına yürürlükte bir talebi kalmadı; kayıt bütünlüğü için tutuluyor.

---

Naci merhaba,

Ürün 1'deki düşük başarının kaynağını netleştirmek için kısa bir teşhis testi yapmak istiyoruz. Amaç ürünü değiştirmek değil, sorunun nerede olduğunu ölçmek. Canlı ayarlar ve Anayasa kuralları değişmeyecek; her şey yalnızca test ortamında olacak.

## Hazırlık talebimiz

1. **Model seçimi ayardan yapılabilsin.** Cevap üreten model kod değişmeden ayar/env ile değiştirilebilsin: Haiku (mevcut) ve en güçlü model (Opus ya da Sonnet).
2. **Kural modu bayrağı olsun.** Cevap prompt'unda iki mod bulunsun:
   - *Mevcut:* Bugünkü garanticilik kuralları.
   - *Gevşek:* "Emin değilsen veri yok de" yerine "en olası cevabı ver, kaynağını göster, emin değilsen bunu belirt ve netleştirici soru sor".
   Bu mod yalnızca testte kullanılacak.
3. **Arama kaydı tutulsun.** Her soruda modele hangi belgelerin/parçaların getirildiği loglansın. Yanlış cevabın sebebinin "doğru belge hiç gelmedi" mi, yoksa "geldi ama model yanlış okudu" mu olduğunu buradan ayıracağız.
4. **Veri dondurulsun.** Dört koşu da aynı belge setiyle yapılsın; arada klasör ya da veri değişmesin.

## Koşular (BT-01 soru seti, aynı 45 soru)

| Koşu | Model | Kurallar |
|---|---|---|
| A | Haiku | Mevcut |
| B | Haiku | Gevşek |
| C | Güçlü model | Mevcut |
| D | Güçlü model | Gevşek |

Puanlamayı ve raporu kontrolör tarafı yapacak. Güçlü modelle 45 sorunun maliyeti düşük.

Hazır olduğunda haber vermen yeterli. Takıldığın bir nokta olursa sor, kendi testini yavaşlatmasın.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Not WhatsApp'tan ulaştı mı (evet/hayır):
- Diğer:
