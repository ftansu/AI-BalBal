# Kontrolör — bağımsız ürün testi kayıtları

> **Bu klasördeki her şey bilgilendirmedir — talimat değildir.** Geliştirici bu klasörü okuyup bilgilenir; buraya yazmaz. İş emirleri ve kararlar yalnız ürün sahibinin Kayıtlı Kanaldaki notlarıyla (`docs/` altındaki geliştirici notları) verilir.

## Bu klasör ne için var

- **Ürün testi Ürün Yetkililerinindir** (Anayasa T-13, Ek-D S-9). Kod testini geçmek, ürünün bittiği anlamına gelmez. Ürünü ürün testi finalize eder.
- **Kontrolör,** iki Proje Yetkilisi adına çalışan bağımsız test ve kontrol rolüdür. BT koşularını hazırlar, yürütür ve raporlar. "Ürün testi geçti" kararını Ürün Yetkilileri Kayıtlı Kanalda verir.
- **Bağımsızlık:** Bu klasör geliştirici dokümanlarından (`docs/`) ve geliştiricinin kendi eval sisteminden ayrı tutulur. Geliştiricinin ölçümleri (ör. 99 soruluk eval) hazırlık sinyalidir. Kapıyı bağlayan ölçüm kontrolörün ürün testidir. İkisi çelişirse fark ayrıca raporlanır ve kök neden birlikte aranır.

## Düzen

| Yol | İçerik |
|---|---|
| `protokol/TEST_PROTOKOLU.md` | Ürün testinin kuralları: puanlama, göstergeler, koşu öncesi kayıt, ilerleme tablosu |
| `kosular/<YYYY-MM-DD>_BT-NN/` | Her komple koşunun kaydı: sonuç özeti, soru başına sayısal veri, kök neden tahminleri, bilgilendirmeler |

## Kurallar

1. **Soru metni yok.** Gizli soru setleri, beklenen cevaplar ve cevap metinleri bu repoya konmaz (Ürün 1 notu G.2). Kayıtlar soru ID'si, kategori, puan ve bulgu özeti taşır. Açıklanan bir sorunun yerine sonraki koşuda yenisi konur.
2. **Talep değil, bilgi.** Kontrolör geliştiriciye talimat vermez. Bulgular görüş ve mantık diliyle yazılır. Bir bulgu iş gerektiriyorsa ürün sahibi bunu ayrıca, kendi notuyla iletir.
3. **Orantılılık.** Kontrolörün beklentileri projenin bulunduğu aşamayla orantılıdır. Ürün 1'in %75 hedefi için geliştiriciden yeni veri seti ya da yeni ölçüm altyapısı istenmez. Ölçülemeyen risk varsa kayıtta açıkça yazılır.
4. **Canlı sistem.** Kontrolör canlıya yalnız komple koşularda soru sorar. Canlıya yazma ya da belge yükleme yalnız ürün sahibinin koşu günü onayıyla yapılır.
5. **Kurgusal veri.** Demo ve test verisi kurgusaldır (Anayasa Ç-12).
