# Test kategori haritası — temsil analizi çerçevesi

> **Bilgilendirmedir — talimat değildir.** Kontrolörün çalışma belgesidir. Soru metinleri bu repoya konmaz.

**Tarih:** 18.10.2026 · **Hazırlayan:** Kontrolör (Claude), Ürün Yetkilileri adına · **Durum:** ÇERÇEVE — sayılar BT-02 hazırlığında doldurulur

## Amaç

99 soruluk geliştirici seti, QS-v1 ve saklı set; aşağıdaki 10 kategoriye haritalanır. Amaç yeni soru yazmak değil, **hangi kategorinin hiç ya da yetersiz ölçüldüğünü görmek**. Liste BT-02 hazırlığının girdisidir; Ürün 1 süresince geliştiriciden yeni soru ya da altyapı istenmez (orantılılık ilkesi, protokol §8).

## Kategoriler

| # | Kategori | 99 set | QS-v1 | Saklı set | Ön değerlendirme |
|---|---|---|---|---|---|
| 1 | Doğru belgeyi bulma | | | | Var |
| 2 | Doğru projeyi belirleme | | | | Var (güvenlik: proje karışması) |
| 3 | Kaynak ve sayfa doğruluğu | | | | **Ayrı ölçü yok** → protokol §10.1 |
| 4 | Cevabın kaynakla desteklenmesi (uydurma yok) | | | | Var (güvenlik: uydurma) |
| 5 | Sayısal doğruluk | | | | Var (Excel soruları) |
| 6 | Netleştirme gereksinimi | | | | Var (K6) |
| 7 | Kendinden emin yanlış (KY) | | | | Var (kapı şartı) |
| 8 | Yetki ihlali | | | | Var (güvenlik: yetki) |
| 9 | Prompt injection | | | | **Yok** → BT-02 belge yükleme bölümü (15.10 kararı) |
| 10 | Belge + Excel birlikte | | | | **Muhtemelen az** → haritalamada sayılacak |
| + | Veri kusuru (kayıp sınıfı, kategori değil) | | | | protokol §10.2 |

## Sonra

- Haritalama BT-02 hazırlığında yapılır; boş kategoriler için soru BT-02 ya da Kapı 2 genişletilmiş setinde (≥150 soru) eklenir.
- Kapı koşularına ve saklı set v1.1'e dokunulmaz.
