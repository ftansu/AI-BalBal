# Balbal Ürün 1 — Ürün testi protokolü

> **Bilgilendirmedir — talimat değildir.** Kontrolörün yöntem belgesidir; geliştirici okuyup bilgilenir.

**Oluşturma:** 13.10.2026 · **Son güncelleme:** 13.10.2026 (ürün sahibinin K1–K5 kararları ve orantılılık ilkesi işlendi) · **Hazırlayan:** Kontrolör (Claude), Ürün Yetkilileri adına

Bu belge, Ürün 1 ürün testlerinin **nasıl yapılacağını** ve **koşu sonuçlarını** tutar. Her koşu `kontrolor/kosular/<YYYY-MM-DD>_BT-NN/` klasöründe kaydedilir. Soru metinleri ve beklenen cevaplar kontrolörde durur, bu repoya konmaz.

## 1. Soru setleri

| Set | Niteliği |
|---|---|
| **QS-v1** (45 soru: Genel, Belge-direkt, Belge-dolaylı, Excel-direkt, Excel-dolaylı) | Dondurulmuş, kelimesi kelimesine aynı sorulur. Metinleri PR #31 ile paylaşıldığı için **açık regresyon seti**dir: gelişmeyi izler, tek başına bağımsız ölçüm sayılmaz. |
| **Gizli set** | Kontrolörde tutulur, metinleri açıklanmaz. Bağımsız ölçüm bu setle yapılır. Açıklanan sorunun yerine yenisi konur. |
| **Genişletilmiş set (≥150 soru)** | Kapı 2 (Ürün 2 kodlamasına başlama) ölçümü içindir; Ürün 1 kapsamı dışındadır. Kontrolör hazırlar, ürün sahibiyle birlikte gözden geçirilir. |

Demo verisi değişirse soru metni değişmez; değişen beklenen değer gerekçesiyle düzeltme kaydına yazılır.

## 2. Yürütme

1. **Koşu öncesi kayıt (zorunlu, kayıt yoksa koşu başlamaz):** model, bayraklar (`EK_F_MODE`, `ASSIST_MODE`, `ANTHROPIC_THINKING`), embedding durumu, canlı commit, belge ve proje sayısı, demo bugünü.
2. **Kullanıcı:** `admin`; yetki soruları ilgili departman kullanıcısıyla.
3. **Tur-1:** sorular sırayla, sabit aralıkla `POST /api/ask`.
4. **Tur-2:** Tur-1'de altyapı hatası (5xx) alan sorular daha uzun aralıkla tekrarlanır; en çok 3 deneme.
5. **Ham veri (her soru):** HTTP ilk/son durum, deneme sayısı, süre, izlenen yol, model, token giriş/çıkış, uyarılar, `audit_log_id`, **altyapı hatasının kök nedeni**.

## 3. Puanlama

| Puan | Tanım | Ağırlık |
|---|---|---|
| Doğru (OK) | Doğru değer + birim/tarih + geçerli kaynak. Biçim kusuru puanı düşürmez, ayrıca sayılır | 1 |
| Netleştirme — gerekli ve kaliteli | Soru gerçekten belirsiz ya da kaynakta çelişki var; seçenekler kalem adıyla, rakamsız; doğru cevabı içeriyor ve kullanıcının işini ilerletiyor | 1 |
| Netleştirme — gereksiz ama kaliteli | Soru zaten netken, yukarıdaki kalitede soru sordu | 0,5 |
| Kısmi | Çekirdek doğru; eksik kalem, yanlış birim, tekrar, kapsam hatası | 0,5 |
| Bulamadı | Kaynakta olan bilgiye "bulamadım" | 0 |
| KY | Kendinden emin yanlış; eksik listeyi tam gibi sunmak dahil. Kırmızı çizgi 2 | 0, ayrıca sayılır |

- Şüpheli durumda düşük puan verilir ve not yazılır.
- **Tekrar denemede gelen doğru cevap puana sayılır** (K1). Altyapı hatası doğruluk puanından ayrı raporlanır.
- Doğru değer ama eski sürümden kaynak: OK + kaynak bayrağı. Çelişkili veride sessizce tek kaynak seçmek kritik bulgudur.
- Model-hakem yalnız ön puan verebilir; KY ve güvenlik kategorilerinde kullanılmaz; son puanı insan verir.

## 4. Göstergeler ve Ürün 1 hedefleri

| Kod | Gösterge | Hedef |
|---|---|---|
| M1 | Doğru oranı | ≥ %75 (sabit; Ürün 1 süresince değişmez) |
| M2 | KY sayısı | 0 |
| M3 | Bulamadı oranı | ≤ %10 |
| M4 | Router isabeti (Excel soruları) | ≥ 18/20 |
| M6 | Tur-1 altyapı hatası | ≤ 2/45 |
| M7 | Tur-2 sonrası altyapı hatası | 0 |
| M8 | Göreli zaman soruları | 3/3 |
| M9 | Biçim kusuru (Türkçe sayı/tarih) | 0 |
| M10 | Ortalama süre | ≤ 5 sn |
| M11 | Netleştirme oranı | Raporlanır (hedef yok); skorun netleştirmeyle şişmesi izlenir |

Sonuçlar nokta değer yanında yaklaşık %95 güven aralığıyla da verilir; 45 soruda tek koşunun belirsizliği geniştir.

## 5. Altyapı hata sayacı (K1)

Her altyapı hatasının kök nedeni kaydedilir (hız sınırı/kota, zaman aşımı, sunucu hatası, router geri düşüşü, bilinmiyor) ve koşular boyunca toplam tutulur. Amaç, sayacı zamanla sıfıra indirmektir.

| Koşu | İlk denemede 5xx | Kök neden | Doğrulama |
|---|---|---|---|
| BT-01 | 27/45 | Sağlayıcı dakikalık hız sınırı (hipotez) | Logla doğrulanmadı |

## 6. İlerleme tablosu

| Koşu | Tarih | Model / bayraklar | M1 | M2 | M3 | M4 | M6 | Not |
|---|---|---|---|---|---|---|---|---|
| BT-01 | 13.10.2026 | gemini-3.5-flash-lite · EK_F off · ASSIST off | %64 | 4 | %18 | 14/20 | 27/45 | Taban |
| BT-02 | | | | | | | | B1′ ve B2 canlıdayken; belge yükleme bölümü dahil |
| BT-03 | | | | | | | | Web testi öncesi kabul koşusu |

**Koşu zamanlaması (13.10.2026 kararı):** Ara ya da küçük test yapılmaz. Her koşu komple yapılır ve yalnız hazırlık sinyalleri sağlandığında başlar: geliştiricinin 99 soru ölçümü dört kriteriyle yayınlanmış, duman testleri tekrar denemesiz geçmiş, canlı ayarlar ölçülenle aynı, demo bugünü ve belge/proje sayısı doğru.

## 7. Belge yükleme bölümü (BT-02'den itibaren)

QS puanından ayrı raporlanır. Ayrı bir test alanında yapılır; dondurulmuş kütüphane kirletilmez. Ölçülenler: alanları Balbal'ın kendisinin doldurması, doğru klasör/departman/proje, etiket kalitesi, aranabilir olma süresi, yükleme sonrası bulunabilirlik, eminlik %80 altındaki alanlarda onay zorunluluğu ve belgeler arası tutarlılık. Belge ve senaryo ayrıntıları kontrolörde durur.

## 8. Orantılılık ilkesi

Kontrolörün beklentileri aşamayla orantılıdır. Ürün 1 süresince geliştiriciden yeni veri, yeni belge ya da yeni ölçüm altyapısı istenmez; demo verisi donmuştur. Test materyali kontrolü (beklenen değerin belgede gerçekten geçmesi, kapsam, gerçekçilik) kontrolörün kendi işidir. Ölçülemeyen risk varsa koşu kaydına açıkça yazılır.

## 9. Düzeltme kaydı

- B4 beklenen para birimi EUR (ledger `epc_contract_price` EUR) — 13.10.2026.
- E5: "uydurulmuş birim" ifadesi düzeltildi; birim kodda sabit — 13.10.2026.
