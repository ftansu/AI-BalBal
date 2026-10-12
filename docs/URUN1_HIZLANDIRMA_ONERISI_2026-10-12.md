# Ürün 1'i bitirmek için hızlandırma önerisi — görüşüne açık — 12.10.2026

**Kimden:** Tansu (ürün sahibi). Metni Claude, ürün sahibinin talimatıyla hazırladı. · **Kime:** Naci
**Niteliği:** Bu bir **karar değil, öneri**. Görüşünü PR yorumu olarak yazmanı rica ediyorum. Ortak karar verdikten sonra uygulanır.

---

## Neden bu not

Ürün 1 uzadı. Kendi payımızı da görüyoruz:
- Ürün 1 bitmeden sana Ürün 2'nin zincirleri, onay akışları ve Anayasa revizyonları gitti.
- Demo verisi için 8 soru turu açtık.
- "Bitti"nin ne olduğunu yazılı olarak hiç tanımlamadık. Hedef sürekli hareket etti.

Amacımız mükemmel bir Ürün 1 değil. **Güvenli, kullanılabilir ve gerçek kullanıcıyla test edilebilir** bir Ürün 1. Aşağıdaki öneriler bu yönde.

---

## 1. Kırmızı çizgiler — bunlardan taviz yok

1. **Yetki sızıntısı yok.** Kullanıcı yetkisi olmayan belgeyi görmez.
2. **Kendinden emin yanlış cevap yok.** Balbal emin değilse netleştirici soru sorar ya da "bulamadım, şunlar var" der. GEN-AMB-001'deki "vade 14 yıl" tipi hata kabul edilmez.
3. **Proje karışması yok.** Bir projenin sorusuna başka projenin verisiyle cevap verilmez.

## 2. Ürün 1 "bitti" tanımı (öneri)

| Kriter | Hedef |
|---|---|
| Güncel kütüphane canlı DB'de | ✅ |
| 99 soruda toplam doğru | **≥ %75** |
| Güvenlik kategorileri (yetki, izolasyon, negatif kontroller) | **%100**, kritik bulgu **0** |
| Gerçek kullanım | 3–5 kişiyle 1 hafta web testi |
| **Hedef tarih** | **Senin önerine göre**. Bizim beklentimiz 2–3 hafta. |

Bu çıta geçilince Ürün 1 "bitti" sayılır. Sonrası iyileştirmedir, Ürün 1'in bitişini bekletmez.

## 3. Önerdiğimiz tavizler

| # | Taviz | Ne kazanırız | Ne kaybederiz |
|---|---|---|---|
| 1 | **Demo verisi tamamen donar.** Ledger, belge ve isim düzeltmesi durur. Çelişki çıkarsa tek satır listeye yazılır, düzeltilmez. Bugün işlenen PR #24 maddeleri (Karatepe kredi tutarı, Boztepe hukuk maddesi) son veri işidir. | En büyük zaman kazancı | Demoda birkaç küçük tutarsızlık |
| 2 | **Doğruluk hedefi %75** (§2). Güvenlik kategorilerinde ise %100. | Ölçüm–düzeltme döngüsü biter | Bazı sorularda "bulamadım, şunlar var" cevabı. Ç-7.1 zaten bunu öngörüyor. |
| 3 | **Ürün 2 Ürün 1 bitene kadar donar.** Bizden sana yeni Ürün 2 notu gitmez. Canvas çalışması bizim tarafta devam eder. | Hedef sabitlenir | Ürün 2 notları birkaç hafta bekler |
| 4 | **Raporlama hafifler.** Adım adım rapor yerine iş emri başına tek özet. "Kriteri sonuçlardan önce ayrı commit'le kilitle" yalnızca model ve kriter kararlarında kalır. | Sana daha çok kodlama zamanı | İz sürmek biraz zorlaşır |
| 5 | **Cevap turları haftalık olur.** Bizden haftada bir toplu not gider. Acil olan (aritmetik ya da kanonik çelişki, güvenlik) ayrıca iletilir. | Daha az kesinti | Kararlar birkaç gün gecikebilir |
| 6 | **Tur 1 testinin kapsamı daralır.** Belge bulma ve cevaplama önce oturur. Excel/hesaplama soruları ve ekip sohbeti ikinci tura kalır. | Odak | Demoda "hesap yapan Balbal" ilk turda gösterilmez |
| 7 | **Eşikler tek ölçümle kilitlenir.** Discovery düzeltmesinden sonra bir kez ölçülür, eşik sabitlenir, Ürün 1 süresince yeniden açılmaz. | Ayar döngüsü biter | İnce ayar eksik kalır |
| 8 | **Anayasa süreci Ürün 1 süresince sadeleşir.** "Önce plan" (T-9) yalnızca sistem promptu, yetki ve şema değişikliklerinde kalır. | Daha az bekleme | Daha az ön kontrol. **Anayasa değişikliğidir (Ç-3), ikimizin onayı gerekir.** Uygun görürsen tarihli, geçici bir istisna olarak ADT'ye yazarız. |

## 4. Geliştirme modeli (öneri)

Max paketinde kota yeterli, o yüzden maliyet değil hız açısından öneriyorum:
- **Varsayılan Opus** olsun: `/model opus`.
- **Teşhis ve ölçüm işlerinde** (discovery düzeltmesi, 99 soru ölçümü, kök neden araştırması) menüde görünüyorsa **Fable** dene: `/model fable`. Claude Code v2.1.257 veya üstü gerekiyor.
- **Mekanik işlerde** (test sabitleri, raporlar) Sonnet yeterli.

Gerekçe: Son iş emirlerinde zamanın bir kısmı ilk teşhisin yanlış çıkmasına gitti. 500 hataları önce "Gemini'ye özgü" sanıldı, bir tur sonra tek kök neden bulundu. Bu tür işlerde güçlü model tur sayısını azaltır. Senin deneyimin farklıysa onu esas alırız.

## 5. Önerilen sıra (PR #23 ve #24 ile uyumlu)

1. PR #24 paketi: discovery (1)+(2), Karatepe kredi tutarı, Boztepe hukuk maddesi
2. Yeni kütüphane canlı DB'ye
3. Haiku geçişi + belirsiz soruda netleştirici soru
4. 99 soru tek ölçüm; §2 kriterleriyle değerlendirme
5. Kriter geçerse: 3–5 kişiyle web testi. Geçmezse: yalnızca güvenlik kategorisi ve en büyük tek kayıp kaynağı düzeltilir, tekrar ölçülür.

---

## 6. Senden görüş istediğimiz konular

PR'a yorum olarak madde numarasıyla yazman yeterli:

1. §2'deki "bitti" tanımı sana gerçekçi geliyor mu? **%75 hedefi** ve **hedef tarih** için önerin nedir?
2. §3'teki tavizlerden katılmadığın, eklemek ya da değiştirmek istediğin var mı?
3. Senin tarafında seni en çok yavaşlatan şey ne? Bizim görmediğimiz bir engel (zaman, altyapı, sunucu, bizden gelen belirsizlik) varsa bilmek isteriz.
4. Taviz 8 (Anayasa sadeleştirme) için ADT açalım mı, yoksa mevcut haliyle mi devam edelim?
5. Model önerisi (§4) hakkında görüşün nedir?

Görüşün gelince ortak kararı tek bir notla kesinleştiririz.
