# Balbal Ürün 1 — Test Protokolü ve İlerleme Kaydı

**Oluşturma:** 13.10.2026 · **Son güncelleme:** 13.10.2026 (BT-01; koşu zamanlaması ve BT-02 yükleme testi eklendi) · **Hazırlayan:** Claude (test ve kontrol), ürün sahibi Tansu adına

Bu dosya, Balbal Ürün 1 kabul/gerileme testlerinin **nasıl tekrarlanacağını** ve **koşu sonuçlarını** tutar. Her yeni koşu bu kurallarla yapılır, sonuç aşağıdaki tabloya eklenir. Her koşu kendi tarihli klasöründedir: `docs/testler/<YYYY-MM-DD>_BT-NN/` (rapor PDF, ham sonuçlar JSON, raporu üreten betik). BT-01: `2026-10-13_BT-01/`.

## 1. Soru seti QS-v1 (dondurulmuş, 45 soru)

| Grup | ID | Amaç |
|---|---|---|
| Genel | G1–G5 | Şirket düzeyi: projeler, işletmedeki santraller, bankalar, davalar, yaklaşan tarihler |
| Belge-direkt | B1–B10 | Belgedeki terimlerle sorulan net, tek değerli sorular |
| Belge-dolaylı | C1–C10 | Aynı tür bilgi, anahtar kelime olmadan |
| Excel-direkt | D1–D10 | Dosya/sayfa/dönem adı verilen basit sayısal sorular |
| Excel-dolaylı | E1–E10 | Excel'de cevabı olan, anahtar kelimesiz sorular (göreli zaman, kavram, basit toplama) |

- Soru metinleri ve beklenen cevaplar `2026-10-13_BT-01/BT-01_sonuclar.json` içindedir; **kelimesi kelimesine aynı sorulur**.
- Demo verisi değişirse soru metni değişmez; değişen beklenen değer gerekçesiyle **§5 düzeltme kaydına** yazılır.
- Yeni sorular **QS-v2** olarak ayrı puanlanır; QS-v1 skoru her koşuda ayrıca raporlanır.
- Beklenen cevapların kaynağı: company-ai `seed_data/master` (ledger) ve `seed_data/excel`.

## 2. Yürütme

1. **Koşu öncesi kayıt:** model adı, bayraklar (`EK_F_MODE`, `ASSIST_MODE`, `ANTHROPIC_THINKING`), canlı commit, belge ve proje sayısı.
2. **Kullanıcı:** `admin`. Demo bugünü **06.10.2026** olmalı; değilse göreli zaman soruları (E1, E10, G5) yeniden hesaplanır.
3. **Tur-1:** sorular G1→E10 sırasıyla, **0,8 sn** aralıkla, `POST /api/ask` (oturum çerezli).
4. **Tur-2:** Tur-1'de 503 alanlar **8 sn** aralıkla tekrarlanır; en çok 3 deneme, denemeler arası 20 sn.
5. **Ham veri (her soru):** HTTP ilk/son, deneme sayısı, süre, `query_type`, `answered`, model, token giriş/çıkış, uyarılar, `audit_log_id`, cevap metni, kaynaklar, Excel hücreleri.

## 3. Puanlama

| Puan | Tanım | Ağırlık |
|---|---|---|
| Doğru (OK) | Doğru değer + birim/tarih + geçerli kaynak. Biçim kusuru puanı düşürmez, M9'a yazılır | 1 |
| Kısmi | Çekirdek doğru; eksik kalem, yanlış birim, tekrar, kapsam hatası | 0,5 (yalnız bileşik skor) |
| Bulamadı | Kaynakta olan bilgiye "bulamadım" | 0 |
| KY | Kendinden emin yanlış; eksik listeyi tam gibi sunmak dahil. Kırmızı çizgi 2 | 0, ayrıca sayılır |

Şüpheli durumda düşük puan verilir ve not yazılır. Bileşik skor = (Doğru + 0,5 × Kısmi) / 45.

## 4. Göstergeler ve hedefler

| Kod | Gösterge | Hedef | BT-01 |
|---|---|---|---|
| M1 | Doğru oranı | ≥ %75 | %64 (29/45) |
| M2 | KY sayısı | 0 | 4 (G1, E1, E6, E8) |
| M3 | Bulamadı oranı | ≤ %10 | %18 (8) |
| M4 | Router isabeti (Excel soruları DATA/MIXED'e) | ≥ 18/20 | 14/20 |
| M5 | Excel yolu isabeti (DATA_QUERY doğru/toplam) | ≥ %90 | 10/13 |
| M6 | Tur-1 503 | ≤ 2/45 | 27/45 |
| M7 | Tur-2 sonrası 503 | 0 | 0 |
| M8 | Göreli zaman (E1, E10, G5) | 3/3 | 0/3 |
| M9 | Biçim kusuru | 0 | 4 (C2, D4, D7, D10) |
| M10 | Ortalama süre | ≤ 5 sn | 2,3 sn |

Grup hedefleri: Genel ≥ 4/5 · Belge-direkt ≥ 9/10 · Belge-dolaylı ≥ 8/10 · Excel-direkt ≥ 9/10 · Excel-dolaylı ≥ 7/10.
BT-01: 1/5 · 8/10 · 9/10 · 8/10 · 3/10.

## 5. İlerleme takip tablosu

| Koşu | Tarih | Model / bayraklar | M1 | M2 | M3 | M4 | M6 | Not |
|---|---|---|---|---|---|---|---|---|
| BT-01 | 13.10.2026 | gemini-3.5-flash-lite · EK_F off · ASSIST off | %64 | 4 | %18 | 14/20 | 27/45 | Taban |
| BT-02 | | | | | | | | Haiku + Excel paketi **ve** B2 canlıdayken |
| BT-03 | | | | | | | | Web testi öncesi kabul koşusu |

**Koşu zamanlaması (13.10.2026 kararı):** Ara/küçük test yapılmaz; her koşu 45 sorunun tamamıdır ve yalnız belirli bir seviyeye ulaşıldığında yapılır. Hazırlık, her sabahki "Balbal GitHub günlük rapor" görevinde kontrol edilir; hazır olunca Tansu'ya bildirilir.

**QS-v1 düzeltme kaydı:** B4 beklenen para birimi EUR (ledger `epc_contract_price` EUR) — 13.10.2026.

## 6. BT-01 bulguları (özet, sonraki koşuda kontrol edilecek)

- **F1 Kritik — KY:** E1 "geçen ay" → Haziran satırı; E6 öz kaynak yerine cash-to-equity listesi; E8 belgeden yanlış ay; G1 7 projeden 2'si tam liste gibi.
- **F2 Kritik — 503:** 0,8 sn aralıkta 27/45 hata; 8 sn aralıkta 0. Hipotez: sağlayıcı dakikalık sınır.
- **F3 Yüksek — Router:** D3, D8, D9, E7, E8, E9 belge yoluna gitti.
- **F4 Yüksek — Göreli zaman:** E1, E10, G5 başarısız (D10 aynı bilgiyi buldu, E10 bulamadı).
- **F5 Orta — Bulamadı:** B1/C1 Karatepe kredi tutarı (sürüm zinciri), B7 "kullandırım" ↔ "drawdown/utilization".
- **F6 Orta — Birim/biçim:** E5 USD → EUR; ham tarih ve sayı biçimleri.
- **F7 Düşük — Kaynak:** B2 eski sürümden; G4'te tekrar ve taraf hatası.

## 7. QS-v2 adayları (BT-01 kapsamı dışında)

Yetki negatifleri (departman kullanıcısı), proje adsız değer sorusunda netleştirme, Yeşilova faiz çelişkisi (18.240 / 18.912), Karatepe sonraki taksit tuzağı (07.10.2026, 412.500 USD; 31.12 verilmemeli), 3–5 paralel kullanıcı ile kararlılık, otomatik etiket/alan doldurma.

## 8. BT-02'de ZORUNLU ek bölüm — belge yükleme testi (13.10.2026 kararı)

Tansu'ya BT-02 öncesi **hatırlatılır**. QS-v1 puanından ayrı raporlanır.

- **Ön koşul:** Naci'den ayrı test alanı (Test departmanı/klasörü) istenir; yüklenen belgeler 113 belgelik dondurulmuş kütüphaneyi ve ölçümleri kirletmemeli. Test sonunda belgeleri Naci kaldırır ya da test alanında kalır.
- **Belgeler (5):** dijital PDF sözleşme, taranmış PDF, Excel, fotoğraf (jpg/png), Word — her biri farklı projeye ait, kurgusal (Ç-12).
- **Ölçülenler (belge başına):** Y1 alanları Balbal kendisi dolduruyor mu (başlık, tür, tarih, karşı taraf); Y2 doğru klasör/departman/proje; Y3 etiket kalitesi (anlamlı, Türkçe, katalogdan); Y4 aranabilir olma süresi (yüklemeden "ready"e); Y5 yükleme sonrası ilgili soruda belgeyi buluyor mu; Y6 eminlik %80 altı alanlarda "Onaylıyorum" zorunlu mu.
- **Yükleme canlı veriye yazar:** yalnız Tansu'nun koşu günü onayıyla yapılır.
