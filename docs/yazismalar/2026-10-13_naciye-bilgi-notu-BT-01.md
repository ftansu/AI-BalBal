# Tansu'dan Naci'ye — Bilgi notu: Ürün 1 canlı test sonucu (BT-01)

**Tarih:** 13.10.2026 · **Kimden:** Tansu (ürün sahibi); metni Claude, ürün sahibinin talimatıyla hazırladı · **Kime:** Naci ve Naci'nin AI'ı
**Tür:** Bilgi notu. **Sıra ve kararlar değişmiyor** (11. ve 12. tur geçerli). Senden yalnızca §2'deki iki şey isteniyor.
**Rapor:** `docs/testler/2026-10-13_BT-01/BT-01_Balbal_Urun1_Test_Raporu_2026-10-13.pdf` · Ham veri: aynı klasörde `BT-01_sonuclar.json` · Tekrar kuralları: `docs/testler/TEST_PROTOKOLU.md`

---

## 1. Ne yapıldı, ne çıktı

13.10.2026 09:40–09:55 arasında canlı sisteme (admin, demo bugünü 06.10.2026, model `gemini-3.5-flash-lite`, `EK_F_MODE`/`ASSIST_MODE` kapalı) 45 soru soruldu: 5 genel, 10 belge-direkt, 10 belge-dolaylı, 10 Excel-direkt, 10 Excel-dolaylı. Beklenen cevaplar `seed_data/master` ve `seed_data/excel`'den alındı.

| Gösterge | BT-01 | Ürün 1 hedefi |
|---|---|---|
| Doğru | 29/45 (%64) | ≥ %75 |
| Kendinden emin yanlış | 4 (G1, E1, E6, E8) | 0 |
| Bilgi varken "bulamadım" | 8 (%18) | ≤ %10 |
| Excel sorularında doğru yol (router) | 14/20 | ≥ 18/20 |
| İlk denemede 503 (0,8 sn aralık) | 27/45 | ≤ 2/45 |

Grup bazında doğru: Genel 1/5 · Belge-direkt 8/10 · Belge-dolaylı 9/10 · Excel-direkt 8/10 · Excel-dolaylı 3/10.

Belge yolu güçlü. Kayıpların çoğu Excel yolunda ve şirket düzeyi sorularda. Bu, 11. turdaki "önce Excel paketi" sırasını doğruluyor; yeni bir iş açmıyor.

## 2. Senden istenen iki şey

**İ-1. 503 bulgusunu loglardan teyit et (yeni, sırayı değiştirmez).**
0,8 sn aralıkla gönderilen 45 sorunun 27'si `"Yapay zeka servisi geçici olarak kullanılamıyor."` (HTTP 503) aldı. İlk 8 soru geçti, sonra 18 ve 14 soruluk bloklar halinde hata geldi. 8 sn aralıkla tekrarda 25'i ilk tekrarda, 2'si ikinci tekrarda geçti. Örnek request_id: `e5c6630ec41c493b8168d71d7a02ca2e`.
Hipotezimiz: sağlayıcının dakikalık istek sınırı (her soru en az iki model çağrısı yapıyor). Sebebi kısaca yazman yeterli; çözümü Haiku geçişiyle birlikte değerlendiririz. Web testinde birkaç kişi aynı anda sorarsa ilk görülecek sorun bu.

**İ-2. Excel paketinin duman testine şu dört soruyu ekle.**
Bunlar paketin hedeflediği hatanın canlıdaki örnekleri:

| ID | Soru | Beklenen | BT-01'de |
|---|---|---|---|
| E1 | Karatepe geçen ay ne kadar elektrik üretti? | Eylül verisi yok; son veri Ağustos 2026 = 13.538 MWh | 10.951 MWh (Haziran satırı) |
| E5 | Karatepe için bankaya hâlâ ne kadar borcumuz var? | 11.671.800 USD | Rakam doğru, birim EUR |
| E6 | Karatepe yatırımına kendi cebimizden ne kadar para koyduk? | 6.400.000 USD (Inputs: Equity) | 11 çeyreklik cash-to-equity rakamı |
| E8 | Karatepe en çok elektriği hangi ayda üretti? | Aralık 2023, 17.218 MWh | Mart 2026 (belge yolundan) |

## 3. Bilgi için (aksiyon istemiyor)

- **Router:** D3, D8, D9, E7, E8, E9 belge yoluna gitti. D8'de dosya ve sayfa adı (`Financial Model 2026`, `Inputs`) verildiği halde.
- **Göreli zaman:** E1, E10, G5 başarısız. D10 Yeşilova 11. taksitini bulurken E10 ("bir sonraki ödememiz") bulamadı.
- **"Bulamadım":** B1/C1 Karatepe FA kredi tutarı (14.000.000 USD; sürüm zinciri olabilir), B7 Kızılova kullandırım şartı ("kullandırım" ↔ "drawdown/utilization").
- **Proje listesi:** G1 "Hangi projelerimiz var?" → yalnız Kızılova ve Karatepe; proje kaydı yerine belge parçalarından üretiliyor.
- **Biçim:** "%2.9", "98000", "2026-10-14 00:00:00", birimsiz tutar (D4). B2'deki biçim düzeltmesinin kapsamında.

Bunların çözümünü bir sonraki ölçüm (BT-02, Haiku + Excel paketi sonrası) sonucuna göre konuşacağız. Aynı 45 soru aynı kuralla tekrar sorulacak.

---

## [ANAYASA KONTROLÜ]

- Anayasa versiyonu: v2.1 · Okunan modüller: Çekirdek · Ürün etiketi: Ürün 1
- Gizli bilgi: yok (test kullanıcı şifresi notta ve rapor dosyalarında yer almıyor)
- Kapsam: yalnız `docs/` altında yeni dosyalar; kod ve Anayasa değişikliği yok
- Kırmızı çizgi 2 (kendinden emin yanlış cevap yok): BT-01'de 4 ihlal tespit edildi; düzeltmesi 11. tur Excel paketi kapsamında
