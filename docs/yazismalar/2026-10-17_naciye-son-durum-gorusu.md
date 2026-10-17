# Tansu'dan Naci'ye: Son durum — görüşlerimiz ve beklentilerimiz (17.10.2026, öğleden sonra)

**Tarih:** 17.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatıyla hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Görüş + beklenti (bilgilendirme; yeni karar yok)
**Dayanak:** company-ai `feat/adim5-veri-kutuphanesi` — İş Emri raporları E1 (`dd08085`), K2CANLI (`b2a4c68`), D1 (`9a2c027`), D2 (`add0473`); bu reponun PR #61 ve #62 notları.

---

Naci merhaba, bugünkü dört raporu okuduk. Kısaca görüşümüz ve bundan sonrası için beklentimiz aşağıda.

## 1. Görüşlerimiz

**Bugünkü iş temiz ve doğru sırayla yapılmış.** PR #61'deki sıranın ilk üç adımı tamam:

| Adım | Durum |
|---|---|
| Cetvel dondurma (`cetvel-v2.2-v14.1`), tam kapı tanımı README'de | ✅ |
| K1 + LEG-004 canlıda — yedek, 113 belge, smoke 9/9 | ✅ |
| 7 soruluk doğrulama — 6/7, eski tarih (18.01.2024) hiçbir cevapta yok | ✅ |
| Eval DB canlıyla aynı (113/113) | ✅ |

Raporlarda yedek, dur koşulları, onay kanıtı ve Anayasa kontrolü eksiksiz. Eval DB'nin eski kaldığını fark edip durman, silme adımında ikinci onayı beklemen tam istediğimiz davranış.

**Kapı koşularına henüz hazır değiliz.** Sıranın 4. adımı (kapı öncesi kod) başlamadı; şu an yalnız planlar var.

**Dikkatimizi çeken iki nokta:**

1. **Excel yolunun oynaklığı.** Smoke'un ilk koşusunda aynı Karatepe sorusu Excel kısmından "bulamadım" döndü, ikinci koşuda doğru geldi. Raporda "tek seferlik LLM sapması" olarak kapandı. Kapı 3 koşunun ortalamasına baktığı için bu tür sapma doğrudan puan kaybıdır. Görüşümüz: bu bir gözlem olarak kalmasın, ölçülsün.
2. **Eval ve canlı ortamın karışma riski.** D2'de yazdığın gibi compose dosyasında proje adı sabit olduğu için `make … ENV_FILE=infra/.env.eval` canlıya gidiyor. Bu sefer fark edildi ve elle aşıldı. Kapı koşuları ve kural merdiveni eval ortamında çok kez çalışacağı için bunun tesadüfe kalmaması iyi olur.

## 2. Beklentilerimiz

**Kapıdan önce:**
1. Kapı öncesi kod, PR #61'deki sırayla ve her biri kendi kabul ölçüsüyle:
   - Madde 1 (P1) — netleştirme seçeneklerinin daraltılması,
   - P2 — önce proje ayrımı, sonra B-01,
   - "Tek satır, iki değer" (vade + tutar),
   - P3 + kural 13 (d).
2. Ayrı test alanının (Test departmanı/klasörü) açılması; ne zaman açılabileceğini PR #62'deki cevap bölümüne yazman.
3. Excel oynaklığının P2 sonrasında küçük bir tekrar örneklemiyle ölçülmesi (aynı Excel soruları birkaç kez; kaç kez aynı sonuç döndüğü).
4. Eval komutunun canlıya gitme riskinin kapatılması (yöntem senin).
5. PR #61 ve #62'nin sonundaki "Cevap (Naci)" bölümlerinin doldurulması.

**Kapı koşusu için hazır sayacağımız durum:**
- Dört paket canlıda, kabul ölçüleri raporlu,
- test alanı açık,
- canlı commit = etiketli/ölçülen commit (mümkünse `main` üzerinde),
- 99 soruda tek koşu hazırlık sinyali: ≥ %75, güvenlik kategorilerinde %100, KY = 0.

Bunlar tamamlandığında kapı koşuları ve kontrolörün bağımsız ölçümü birlikte planlanır.

Acele yok, kendi temponda. Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Yok — yeni karar içermez; görüş ve beklentiler PR #61/#62 kararlarına dayanır. Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Kapı öncesi kod — tahmini sıra/tarih:
- Test alanı — ne zaman:
- Excel oynaklığı ölçümü — yöntem:
- Eval komutu riski — çözüm:
