# Naci'den Tansu'ya — Kalan Sorular (A/B), 2. tur — 09.10.2026

**Kimden:** Naci (ve geliştirme tarafı) · **Kime:** Tansu (ürün sahibi) · **Konu:** `NACI_CEVAP_2026-10-08.md` (PR #13) sonrası planımızda kalan açık noktalar. Her soruda iki seçenek var; **"Cevap:"** satırına A ya da B (ya da kendi cümlenizi) yazmanız yeter.

## Üç satırda özet

1. Cevaplarınız için teşekkürler; 17 sorunun hepsi PR #13'teki dosyadan işlendi, planımız buna göre yeniden sıralandı. Önceki soru dosyası (PR #14) kapatıldı; cevaplar orada değil PR #13'te olduğu için orası kapanmış sayılır.
2. Anayasa v2.1 (PR #15) ve Ek-F (PR #16) Naci tarafından 09.10.2026'da onaylandı; Ek-F davranışı planımızın ilk kod adımı oldu.
3. Bunlar kalan 9 soru: biri eski sorunun teyidi (#4), diğerleri yeniden test (§G) ve veri kütüphanesi hakkında. Ürün 1 testinin soru metinlerini **istemiyoruz**; yalnızca sayı ve kapsam soruyoruz.

---

## A. Davranış

### 1. Proje adı geçmeyen soru: gruplu liste doğru mu? (önceki #4'ün teyidi)
**Bağlam:** "ÇED raporu nerede?" gibi proje adı geçmeyen soruda Balbal iki projenin belgesini de buluyor. Ek-F F-3 "birden fazla projeyle ilgili soruda her proje ayrı başlık" diyor; İ-8 (1) ise gerçek belirsizlikte "içerik sıralanmaz, tek soru; seçenekler belge veya proje adıyla verilebilir" diyor. İkisini şöyle birleştirdik: belgeler **proje başlıkları altında gruplu** listelenir, altında tek soru: "Hangi projeyi kastediyorsunuz?"
- **A:** Evet, böyle: proje başlıkları altında gruplu liste + tek soru. (Seçenekler proje adı olduğu için "liste yok" kuralının istisnası.)
- **B:** Hayır: liste yok, yalnızca "Hangi projeyi kastediyorsunuz: Karatepe mi, Kızılova mı?" sorusu.
- **Önerimiz:** A — kullanıcı tek tıkla doğru belgeye gider, projeler karışmaz.
- **Cevap:** **Ayrımlı.** Belirleyici olan, kullanıcının ne istediği:
  - *Belge arıyorsa* («ÇED raporu nerede?», «… göster»): cevabın kendisi belgedir; proje başlıkları altında linkli gruplu liste (A). Liste net ve kısaysa ayrıca soru gerekmez.
  - *Değer veya bilgi soruyorsa* («vadesi ne zaman?», «faiz ne?»): projelerin değerleri alt alta sıralanmaz; yalnız tek netleştirici soru: «Hangi projeyi kastediyorsunuz: Karatepe mi, Boztepe mi?» (B, İ-8). Değer listesi birleştirme ve karşılaştırmaya kayar, Ürün 1 sınırını zorlar.
  - *Soru yalnız bir projede karşılık buluyorsa* sorulmaz, doğrudan cevap verilir (F-4).

### 2. Test soruları ve bizim açık soru setimiz (SORU 8 ↔ §G.2)
**Bağlam:** Cevabınızda (§5, SORU 8) notunuzdaki 10 doğal dil sorusunun bizim test dosyamıza eklenmesini istediniz. §G.2 ise yeniden test sorularının repoda tutulmamasını, ürün sahibinde kalmasını söylüyor. Bizim test dosyamız herkese açık; bu yüzden şöyle anlıyoruz: o 10 soru **geliştirici setine** girer (regresyon için), sizin kör testinizde **kullanılmaz**; kör test soruları hiçbir zaman repoya girmez, bir tur bitince açıklanan sorular geliştirici setine eklenir.
- **A:** Doğru anladınız; 10 soru geliştirici setine, kör test ayrı.
- **B:** 10 soruyu da repoya koymayın; geliştirici seti yalnızca sizin yazdığınız sorulardan oluşsun.
- **Önerimiz:** A.
- **Cevap:** **A.** Doğru anladınız. 10 soru geliştirici setine girer (regresyon). Kör test soruları hiçbir zaman repoya girmez; tur bitince açıklanan sorular geliştirici setine eklenir ve sonraki turda yenileriyle değiştirilir.

### 3. Çelişkili Veri ve eksik belge kalıpları (K3)
**Bağlam:** Yeniden testin K3 kategorisi 5/5 ister ve "Çelişkili Veri'de sessizce bir kaynağın seçilmesi" kritik bulgudur. Bugün Balbal'da bu davranış yok; kütüphaneyle gelen tuzaklar (14,0 / 13,6 mn, 18.912 / 18.240, iki ödeme planı sürümü) için kör testten önce ekleyeceğiz. Ek-F F-6 kalıbını temel alacağız: "Kaynaklar farklı söylüyor: … (belge, tarih) ve … (belge, tarih). Fark: … Hangisinin geçerli olduğunu teyit edebilir misiniz?"
- **A:** F-6 kalıbı aynen; eksik belge (ör. Annex F teminat mektubu yok) için F-5 "Veri Yok" kalıbı, belgenin adıyla ("… belgesi arşivde yok").
- **B:** Farklı bir metin istiyorsunuz (Cevap satırına yazın).
- **Önerimiz:** A.
- **Cevap:** **A, üç durum ayrılarak:**
  - *Gerçek çelişki* (iki güncel kaynak aynı şeye farklı değer veriyor): F-6 kalıbı aynen; belge adı ve tarihiyle iki kaynak, sayıyla fark, seçim yok, teyit sorusu.
  - *Sürüm farkı* (ödeme planının iki sürümü, tadil edilmiş sözleşme): çelişki değildir. Güncel sürüm söylenir, eski sürüm «tarihsel» işaretiyle yanında gösterilir. Hangisinin güncel olduğu belge tarihinden/tadil bağından anlaşılmıyorsa ancak o zaman F-6.
  - *Mükerrer kayıt* (aynı belgenin iki kaydı): ikisi de gösterilir, mükerrer olabileceği veriyle (aynı numara, tutar, tarih) belirtilir; biri sessizce seçilmez.
  - *Eksik belge:* F-5 «Veri Yok», ancak «arşivde yok» denmez; **«erişebildiğim kaynaklarda bulamadım»** denir (yetkisi olmayan belge için «yok» demek hem yanlış hem yetki sızıntısı olur). Ardından ilgili erişilebilir belgeler söylenir; yükleme önerisi en sonda, ilk cümle olmaz.

### 4. Belirsiz ve kapsam dışı sorular (K6): kaçı hangisi?
**Bağlam:** K6'da 3 soru var; "tek netleştirici soru" ile "kapsam dışında kibar yönlendirme" ayrı davranışlar. Belirsizlik tespitimizi yalnızca **proje** eksenine kurduk (hangi proje?); "hangi belge?" türü belirsizlikte liste + teyit yolu çalışır. Hangisine ağırlık vereceğimizi bilmek için yalnızca **sayı** soruyoruz, soru metni değil.
- **A:** 2 belirsiz (en az biri "hangi proje?" türü) + 1 kapsam dışı.
- **B:** Başka dağılım (Cevap satırına sayıyı yazın; metin gerekmez).
- **Önerimiz:** Yok; bilgi sorusu.
- **Cevap:** **A** (2 belirsiz + 1 kapsam dışı). Not: belirsizlik tespitini yalnız proje eksenine kurmayın; F-4 genel bir kuraldır. Kullanıcının kastettiği nesne belgelerden tek anlamlı çıkmıyorsa (proje, kredi, sözleşme, belge… ne olursa) davranış aynıdır: tek netleştirici soru, içerik sıralanmaz.

---

## B. Veri kütüphanesi ve teslim

### 5. Bütçe/gerçekleşen dosyası hangi departmanda?
**Bağlam:** Ölçümde "Bütçe dosyası var mı?" sorusuna Proje Finans uzmanı cevap alamadı; sebep gizlilik değil, dosyanın **Enerji (O&M)** klasöründe olması. Soru 15 cevabınız (A) gizliliği çözüyor, klasörü çözmüyor. Yeni kütüphanede bakım bütçesi/gerçekleşen workbook'u nerede dursun?
- **A:** Enerji › O&M klasöründe kalır; Proje Finans'a bu kayıt için görme yetkisi verilir (görüş talebi modeliniz gibi).
- **B:** Proje Finans klasörüne taşınır; Enerji'ye görme yetkisi verilir.
- **Önerimiz:** A — belge sahibi Enerji, okuyucu Finans.
- **Cevap:** **A.** Bakım bütçesi/gerçekleşen workbook'u Enerji › O&M klasöründe, ilgili SPV klasöründe kalır (belge sahibi Enerji); Proje Finans'a görme yetkisi verilir (Soru 15 kararı). Balbal, kullanıcının yetkisi olan her klasörde arar. Not: bankaya giden işletme bütçesi ayrı bir belgeyse o Proje Finans'ta durur; ikisi karıştırılmasın.

### 6. Demo "bugün" tarihi sabit mi?
**Bağlam:** Demo bugünü 06.10.2026 olacak (İ-6). Kredi bakiyesi, "kaç gün kaldı", kaçıncı işletme yılı gibi değerler bu tarihe göre hesaplanıyor. Kör test gerçek takvimde daha sonra yapılacak.
- **A:** 06.10.2026 **sabit** kalır; test sırasında "bugün" hep bu tarihtir.
- **B:** Test gününe göre kayar (her kayma, bugüne bağlı tüm değerlerin yeniden üretilmesi demek).
- **Önerimiz:** A.
- **Cevap:** **A.** 06.10.2026 sabit. Kod içine gömülmesin, tek bir ayardan okunsun; ileride kaydırmak gerekirse tek yerden değişir.

### 7. "Klasörler tamamlandı" ne demek; test parti parti başlayabilir mi?
**Bağlam:** §9 cevabınız: önce Proje Finans ve Hukuk belgeleri; hazır olunca haber verelim. §G.1: klasör yapısı ve demo kütüphanesi tamamlanınca test. Kütüphane departman departman üretilecek (Proje Finans → Hukuk → Enerji → Mali İşler → İdari → İK).
- **A:** Proje Finans + Hukuk hazır olunca test **o bölümlerle başlar**; diğer departmanlar geldikçe test genişler.
- **B:** Tüm departmanlar bitmeden test başlamaz.
- **Önerimiz:** A — hataları erken görürüz.
- **Cevap:** **A, şartlı.** Proje Finans + Hukuk hazır olunca **ön test** başlar; bulunan hatalar beklenmeden düzeltilir. **Resmi tur 1 sonucu** (`TEST_DEFTERI.md`'ye geçti/kaldı) tüm departmanlar gelince yazılır; yetki ve departmanlar arası erişim, diğer departmanların belge ve kullanıcıları olmadan ölçülemez.

### 8. Ekip sohbeti ve önlisans süreç modeli test turu 1'de var mı?
**Bağlam:** Ç-5 ve Ç-6 cevabınız "Ürün 1'de, şimdi". K1–K6 kategorileri bu ikisini ölçmüyor. Sıramızda ikisi kör test turu 1'den **sonra** (Naci kararı). Turda ölçülecekse öne alırız.
- **A:** Tur 1'de yok; sonra yapılsın.
- **B:** Tur 1'de ölçülecek; öne alın.
- **Önerimiz:** A.
- **Cevap:** **A.** Tur 1'de yok, sonra yapılsın. Şart: 36 kişilik hesaplar tur 1'den önce açılıyorsa, herkesin giriş yapıp ekip sohbetinde en azından mesajlaşabilmesi de o adımla gelsin (06.10 web testinin acil notu, küçük iş). Süreç modeli (Proje Geliştirme ağacı) tur 1 sonrasına kalabilir.

### 9. Türbin üreticisi adları (Ç-12, Ek-E 8)
**Bağlam:** Anayasa v2.1 ile banka adları serbest; Enercon ve Vestas gibi üretici adları için karar Ek-E 8'de açık. Kütüphane başlarken bu adları ledger'da **tek tablodan** yöneteceğiz; karar gelince toplu değişir, belge yeniden üretimi gerekmez (adlar belgelere ledger'dan giriyor).
- **A:** Karar kütüphane bitmeden gelir; o zamana kadar mevcut adlarla üretin.
- **B:** Şimdiden kurgusal adlara geçin (ör. üretici için kurgusal ad); karar sonra teyit edilir.
- **Önerimiz:** A.
- **Cevap:** **A.** Mevcut adlarla üretin (Anayasa v2.1 Ek-E 8 ile uyumlu); adlar ledger'da tek tablodan yönetilsin. Kararı ayrı bir Anayasa değişiklik talebiyle (ADT-3) yazacağız; eğilim: üretici adları bankalar gibi kurgusal ilişki içinde serbest, kamu kurumu adları (EPDK, EPİAŞ, TEİAŞ, vergi dairesi) mevzuatla iç içe olduğu için gerçek kalır.

---

## C. Bilgi için (cevap gerekmez)

- **Planımız:** Soru 15 (finansal model normal sınıfa) → Ek-F davranışı (F-3/F-5/F-8 metin ve biçim; sonra proje eksenli belirsizlik) → veri kütüphanesi (yeniden adlandırma + sizin §3 değerleri, demo bugün 06.10) → hesaplar (36 kişi) → Çelişkili Veri → sözlük tablosu → ölçüm kaydı (G.4) → kör test turu 1 → ekip sohbeti → süreç modeli.
- **Ölçüm kaydı (G.4, O-13/8):** baştan tutulacak; yalnızca toplu yönetici görünümü, kişi bazında rapor yok.
- **Mevzuat değerleri (Ç-8 B):** webden araştırılmış öneri listesini ayrı bir notla göndereceğiz; onayınız gelmeden ledger'a yazılmaz.
