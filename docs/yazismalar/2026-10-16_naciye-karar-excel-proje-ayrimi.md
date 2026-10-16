# Tansu'dan Naci'ye: Excel yolunda proje ayrımı — kapı öncesi iş (16.10.2026)

**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla (16.10.2026, 18:24) hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** Kontrolör mimari takip notu 16.10.2026 (ilke b, gündem G-3); görüş notu `2026-10-16_GORUS_proje-ekseni-ai-anlar-kod-uygular`; Naci'nin 16.10 cevabı (B-01 kök nedeni router promptu, onaylı 12. madde).
**Önceki notlarla ilişki:** 16.10 karar penceresindeki sıralamaya **ek**tir. Dalga 1'in geri kalanı (proje ekseninde AI'ın anlaması, takma ad alanı, embedding) planlandığı gibi kapı koşularından **sonra** kalır. Bu not yalnız aşağıdaki işi kapı öncesine alır.

---

## 1. Karar

Excel yolundaki proje ayrımı **Faz 2 kapı koşularından önce** yapılır.

## 2. Sorun (hedef düzeyinde)

- Belge yolunda proje daraltması doğru yerden kuruldu: belgenin proje bağı üzerinden, yetki kapısından sonra. Bu, sağlam ve korunmalı.
- Excel yolu bu ayrımın dışında kaldı: hesap motoru fonksiyonları proje bilgisi almıyor ve uygun ilk dosyayı kullanıyor. Aynı tür dosya birden fazla projede olduğunda (ör. her SPV'nin kredi ödeme planı) rakam yanlış projeden gelebilir.
- Bu, kendinden emin yanlış (KY) riskidir ve proje karışması kırmızı çizgisine girer. Kapıda KY = 0 koşulu var.

## 3. Hedef (nasıl yapılacağı senin)

1. Soruda proje adı geçiyorsa Excel yolu **yalnız o projeye bağlı çalışma kitaplarını** kullanır. Başka projenin dosyası aday olamaz.
2. Proje adı geçmiyorsa ve birden fazla projede uygun dosya varsa motor tek dosya seçmez. 16.10 kararı uygulanır: tek netleştirici soru, seçenekler yalnız o veriye sahip projeler.
3. Grup belgesi niteliği belge yolundakiyle aynı mantıkta Excel'de de geçerli olur.
4. Filtre yetki kümesinin **içinden** uygulanır. Yetki girdisi olarak kullanılmaz (belge yolundaki ilke).

## 4. Ölçü

- Proje adı geçen Excel sorularında **yabancı proje dosyası kullanımı = 0**.
- Mevcut 21 Excel sorusu önce/sonra aynı cetvelle (V21). Belge yolu ölçüsü bozulmamalı (yan etki kontrolü).
- Kontrolör BT-02'deki Yeşilova yükleme testinde bunu ayrıca ölçecek.

## 5. Usul

- Hesap motoru fonksiyonlarının imzası değişeceği için **önce kısa plan** (Ç-15), Ürün Yetkilisi onayından sonra kod. Plan tek sayfa yeterli.
- B-01 ayrı: kök nedeni router promptu, onaylı 12. madde ile çözülüyor. İkisi aynı pakette yapılabilir, ama ölçüleri ayrı raporlansın.
- Kapı koşuları bu iş canlıya alındıktan ve V21 dondurulduktan sonra başlar. Takvim baskısı yok.

## 6. Senden görüş

Bu işte gördüğün teknik engel ya da daha iyi bir yol varsa planda yaz. Fikrin özellikle isteniyor.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9
