# WhatsApp yazışma kayıtları

**Oluşturulma:** 16.10.2026

Pratik olsun diye bazı notlar WhatsApp'tan gidip geliyor. WhatsApp kayıtlı kanal değildir; orada konuşulan her şey bu klasöre de yazılır ki karar ve bulgular kaybolmasın.

## Kural (iki taraf için de geçerli)

1. **WhatsApp'tan yapılan her konuşma, aynı gün bu klasöre kaydedilir.** Notu kim attıysa kaydı o açar; karşı taraf cevabını aynı dosyaya, kendi bölümüne yazar.
2. **Dosya adı:** `YYYY-AA-GG_WA_<kısa-konu>.md`. Bir günde birden fazla konu varsa her konu ayrı dosya.
3. **İçerik:** WhatsApp metni birebir kopya değil, düzenlenmiş özettir: kim, ne zaman, ne dedi, hangi karar/aksiyon çıktı. Kararı değiştiren bir ifade varsa aynen alınır.
4. **Cevap bölümü:** Her dosyanın sonunda "Cevap" bölümü olur. Karşı taraf cevabını oraya tarihle yazar; eski satırlar silinmez, üstüne yeni tarihli satır eklenir.
5. **Bağlayıcılık:** WhatsApp'ta verilen bir karar, bu klasöre kaydedilene kadar resmî sayılmaz. İş emri gerektiren konular ayrıca kendi notuyla (`docs/yazismalar/`) iletilir.
6. **Gizli içerik yok:** Saklı soru seti, beklenen cevaplar ve injection test içerikleri buraya yazılmaz (kontrolör kuralı 1).

## Dizin

Yeni kayıt açan, satırını buraya ekler. Durum: **Açık** (cevap bekliyor) · **Kapandı** (cevap geldi / uygulandı).

| Tarih | Dosya | Kimden | Durum |
|---|---|---|---|
| 14.10 | `2026-10-14_WA_teshis-testi-2x2.md` | Tansu | Kural merdivenine dönüştü; ulaştı mı teyidi bekleniyor |
| 15.10 | `2026-10-15_WA_bilgi-notu-16-10-oncesi.md` | Tansu | Kapandı (M1 ile uygulandı) |
| 15.10 | company-ai `docs/yazismalar/2026-10-15_gelistirici-cevabi-yol-haritasi.md` | Naci | Kapandı (ortak nota bağlandı) |
| 16.10 | `2026-10-16_WA_gelistirici-gorusu-verimlilik.md` | Naci | Kapandı (PR #50 ile repoya eklendi) |
| 16.10 | `2026-10-16_WA_verimlilik-gorusune-cevap.md` | Tansu | Kapandı (Naci cevapladı, PR #49; §1 devamı v14 notunda) |
| 16.10 | `2026-10-16_WA_C1-dogrulama-ve-kontrolor-notlari.md` | Tansu | Kapandı (Naci cevapladı, PR #49; ana dal birleştirme v14 notunda ayrıca) |
| 16.10 | `2026-10-16_WA_v14-ve-cetvel-dondurma.md` | Tansu | Açık |

Toparlama notu: `docs/yazismalar/2026-10-16_naciye-github-toparlama.md`.

## Geliştiricinin yapay zekâsı için

WhatsApp'tan gelen bir konuşmayı işlerken, işi bitirdiğinde bu klasöre yukarıdaki formatta kaydet; cevabını ilgili dosyanın "Cevap" bölümüne yaz.
