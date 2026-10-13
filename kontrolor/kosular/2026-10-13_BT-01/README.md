# BT-01 — Ürün 1 taban ölçümü (13.10.2026)

> **Bilgilendirmedir — talimat değildir.** Bu klasör, Ürün Yetkilileri adına çalışan bağımsız kontrolörün kaydıdır. Geliştirici bu kaydı okuyup bilgilenir; buradaki hiçbir madde iş emri, onay ya da Anayasa kapsamında karar değildir. Kararlar ve iş emirleri yalnız Kayıtlı Kanaldaki ürün sahibi notlarıyla verilir.

**Ürün etiketi:** Ürün 1 · **Dayanak:** Anayasa T-13 ve Ek-D S-9 (ürün testi Ürün Yetkililerinindir), Ürün 1 notu §G
**Hazırlayan:** Kontrolör (Claude), ürün sahibi adına · **Koşu:** 13.10.2026, 09:40–09:55 (TR)

## 1. Bu klasörde ne var, ne yok

| Dosya | İçerik |
|---|---|
| `README.md` | Bu not: sonuçlar, bulgular, kök neden tahminleri, bilgilendirmeler |
| `BT-01_ozet.json` | Soru başına sayısal kayıt: ID, grup, puan, HTTP durumu, deneme sayısı, süre, izlenen yol, token, kök neden tahmini |

**Bilerek konmayanlar:** soru metinleri, beklenen cevaplar, Balbal'ın cevap metinleri ve tam PDF rapor. Kontrolör kaydı ilke olarak soru metni taşımaz: sorular repoda olursa sistem istemeden onlara göre ayarlanabilir ve ölçüm Balbal'ın gerçek davranışını değil soruların ezberini ölçer (Ürün 1 notu G.2). Bu, kimseye güvensizlik değil; ölçümün güvenilir olması için standart yöntemdir.

**QS-v1'in durumu:** Tam BT-01 raporu ve soru metinleri daha önce PR #31 ile paylaşıldı. Bu yüzden QS-v1 bundan sonra **açık regresyon seti** olarak kullanılır: gelişmeyi koşudan koşuya izlemeye yarar, ama tek başına bağımsız ölçüm sayılmaz. Bağımsız ölçüm için kontrolör ayrıca gizli bir set tutar.

## 2. Ortam

| Kalem | Değer |
|---|---|
| Model | gemini-3.5-flash-lite (router + cevap) |
| Bayraklar | `EK_F_MODE=false`, `ASSIST_MODE=false` (K-B1R raporuna göre) |
| Kod | company-ai `feat/adim5-veri-kutuphanesi` (`0fd26bf`), canlı süreç 12.10.2026 19:18 UTC B1R restart'ı |
| Kütüphane | 113 belge (106 PDF + 7 Excel), 7 proje |
| Demo bugünü | 06.10.2026 |
| Kullanıcı | `admin` (yetki testi bu koşuda yok) |
| Yürütme | Oturum çerezli `POST /api/ask`; Tur-1 0,8 sn aralık; 503 alanlar Tur-2'de 8 sn aralık, en çok 3 deneme |

## 3. Sonuç

| Gösterge | BT-01 | Ürün 1 hedefi |
|---|---|---|
| Doğru (OK) | **29/45 (%64)** — %95 güven aralığı ≈ %50–%77 | ≥ %75 |
| Kendinden emin yanlış (KY) | **4** (G1, E1, E6, E8) | 0 |
| Bulamadı | 8 (%18) | ≤ %10 |
| Kısmi | 4 (G2, G4, G5, E5) | — |
| Excel sorularında doğru yol (router) | 14/20 | ≥ 18/20 |
| Göreli zaman soruları | 0/3 | 3/3 |
| İlk denemede HTTP 503 | 27/45 | ≤ 2/45 |
| Tur-2 sonrası 503 | 0 | 0 |
| Ortalama süre | 2,3 sn | ≤ 5 sn |

Grup bazında: Genel 1/5 · Belge-direkt 8/10 · Belge-dolaylı 9/10 · Excel-direkt 8/10 · Excel-dolaylı 3/10.
**Okuma:** Belgeden okuma güçlü (20'de 17). Kayıplar Excel-dolaylı, şirket düzeyi ve göreli zaman sorularında yoğun.

## 4. Kök neden tahminleri

Kontrolörün kod okuması ve demo Excel'lerinin yerelde geliştiricinin motoruyla çalıştırılmasıyla eşleştirildi; canlıda doğrulanmadı. Ayrıntılı gerekçe ürün sahibinin 13.10.2026 mimari görüş notu §7'dedir.

| Soru | Puan | Tahmini kök neden | Tür |
|---|---|---|---|
| G1, G2 | KY / Kısmi | Proje tablosu cevap yolunda okunmuyor | Kod |
| G4 | Kısmi | Tekilleştirme / taraf hatası | Model + kod |
| G5 | Kısmi | Göreli tarih aracı yok | Kod |
| B1, C1 | Bulamadı | FTS + 80 parça + sürüm zinciri (doğrulanmadı) | Ayar + kod |
| B7 | Bulamadı | Anlamsal arama kapalı; TR–EN sözlükte terim yok | Ayar |
| D3, D8 | Bulamadı | Router belge yoluna gönderdi (olası sessiz geri düşüş) | Kod |
| E1 | KY | Excel planlayıcısına bugünün tarihi verilmiyor | Kod |
| E5 | Kısmi | Para birimi fonksiyonda sabit (EUR); model doğru aktardı | Kod |
| E6 | KY | Katalog, anahtar-değer sayfalarının satır etiketlerini göstermiyor | Kod |
| E7 | Bulamadı | Router + yıllık bütçe fonksiyonu yok | Kod |
| E8 | KY | Router; Excel'e bakılmadı | Kod |
| E9, E10 | Bulamadı | Router / göreli tarih + başlık satırı | Kod |

**Düzeltme kaydı:** İlk raporda E5 için "uydurulmuş birim" denmişti; doğrusu, birimin kodda sabit olmasıdır. Model doğru aktarmıştır.

## 5. Altyapı hata sayacı (13.10.2026 kararı)

Tekrar denemede gelen doğru cevap puana sayılır; ama her hatanın kök nedeni kaydedilir ve sayısı koşular boyunca tutulur. Amaç sayacı zamanla sıfıra indirmek.

| Koşu | İlk denemede 5xx | Kök neden | Durum |
|---|---|---|---|
| BT-01 | 27/45 (0,8 sn aralık) · 8 sn aralıkta 0 | Sağlayıcı dakikalık hız sınırı (hipotez: ücretsiz katman; istemcide `max_retries=1`; 429'un 503'e dönüşmesi) | Logla doğrulanmadı |

## 6. Bilgilendirmeler (talimat değildir)

1. **Held-out soruları:** `seed_data/evaluation/questions.json` içindeki 16 `held_out` sorusu herkese açık repoda duruyor. Koşucu bu alanı okumasa da, repoyu okuyan herhangi bir araç soruları görebilir; bu durumda "sistem bu soruları görmedi" garantisi zayıflıyor. Bilgi olarak iletilmiştir. Kontrolör, bağımsız ölçüm için kendi gizli setini ayrıca tutuyor.
2. **Ölçüm ilişkisi:** Geliştiricinin 99 soruluk eval'ı hazırlık sinyalidir; Ürün 1'in kapısını bağlayan ölçüm, kontrolörün yürüttüğü ürün testidir (Anayasa T-13). İkisi çelişirse fark ayrıca raporlanır ve kök nedeni birlikte aranır.
3. **Sonraki koşu:** BT-02, B1′ ve B2 canlıdayken yapılır; belge yükleme bölümü (Y1–Y7) içerir. Canlı ayar kaydı (model, bayraklar, embedding, commit, belge/proje sayısı) koşu öncesi alınır.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1
Okunan modüller   : Çekirdek, 02 Teknik (T-13), Ek-D (S-9)
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14 (şifre, adres dışı erişim bilgisi, gerçek veri yok; demo veri kurgusal, Ç-12)
Kapsam dışı değişiklik        : Yok — yalnız `kontrolor/` altına kayıt eklendi; kod ve Anayasa dosyalarına dokunulmadı — Ç-16
Kendi başına verilen kararlar : Tam PDF rapor repoya konmadı, çünkü QS-v1 soru metinlerini içeriyor (G.2); yerine soru metinsiz özet kondu — Ç-9
