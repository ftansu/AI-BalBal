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

## Geliştiricinin yapay zekâsı için

WhatsApp'tan gelen bir konuşmayı işlerken, işi bitirdiğinde bu klasöre yukarıdaki formatta kaydet; cevabını ilgili dosyanın "Cevap" bölümüne yaz.
