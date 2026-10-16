# WhatsApp kaydı — AI verimlilik raporu: geliştirici görüşü ve ürün sahibinin cevabı

**Tarih:** 16.10.2026 (Word: `Balbal_Naciye_Cevap_Verimlilik_Gorusu_2026-10-16.docx`; aynı gün repoya kaydedildi)
**Kimden:** Tansu (Ürün Yetkilisi)
**Kime:** Naci
**Tür:** Cevap + yönlendirme
**Zincir:**
1. AI kullanım verimliliği raporu (kontrolör) — PR #46, `kontrolor/bilgilendirmeler/2026-10-16_AI-verimlilik-raporu.docx`
2. Geliştiricinin görüşü — `Balbal_Gelistirici_Gorusu_Verimlilik_Raporu_2026-10-16.docx` (WhatsApp). **Repoda yok; Naci ekleyecek** (bkz. `docs/yazismalar/2026-10-16_naciye-github-toparlama.md` madde 2).
3. Ürün sahibinin cevabı — bu dosya.

---

Naci merhaba,

Görüşün için teşekkürler. Ölçülenle ölçülmeyeni ayırman çok işe yaradı. Raporun c074159'a dayandığını ve T3, A2L3 ve TEST_PRJ sonrasında bazı bulguların eskidiğini kabul ediyoruz.

## 1. Cetvel dondurma (en önemli madde)

- V21'e yeni kapsam eklenmesin. Bu sabah istediğimiz T-1, T-2 ve dört düzeltme tamamlansın, bu kadar.
- Kesin bir son tarih koymuyoruz; acele yok. V21'i sağlam şekilde bitir, ardından dondur. Kapı koşuları V21 dondurulduktan sonra başlasın: doğru cetvel, hızdan önemli.
- Dondurulan sürümün numarasını ve commit'ini README'ye yaz. Üç kapı koşusu ve eval ortamındaki tüm denemeler (2×2, embedding, ileride ajan) bu tek sürümle puanlansın. Mimari ile cetvel aynı anda değişirse farkın nereden geldiğini ayıramayız.
- **V22 şimdilik yalnızca bir liste olsun, kod değil.** Yeni ihtiyaçlar buraya yazılır (ör. ❗ çelişkili veri biçimi, çok kaynaklı cevaplar). Kapıdan sonra uygulanırsa eski sonuçlar da yeniden puanlanır, ayrı raporlanır. Resmi skorlar değişmez.

## 2. Huni yeniden ölçümü

Önerine katılıyorum ama ayrı koşu gerekmez. İlk kapı koşusunun kayıplarını aynı huni başlıklarıyla sınıflandır: proje ekseni, ısrarlı red, arama, diğer.

## 3. Eval ortamında iş (canlıya ve kapıya dokunmadan, kendi temponda)

Takvim baskısı yok: önceliğimiz 2 Kasım değil, uzun vadede doğru çalışan bir ana hat.

**a) Kural merdiveni (2×2'nin genişletilmiş hali).** Anayasa'nın yapay zekânın davranışını kısıtlayan kurallarını eval ortamında kaldırıp tek tek geri ekleyerek her kuralın doğruluğa maliyetini ve hataya karşı korumasını ölçmek istiyoruz. Amaç Ürün 2 kurallarını tahminle değil ölçümle yazmak. Ürün 1 kapısı mevcut Anayasa ile yürür.

- **Hiç kaldırılmayacaklar:** yetki filtresi, proje izolasyonu, gizli bilgi kuralları.
- **Bloklar:** A kodla anlama (harf eşleşmesi, AI'sız kalıplar), B ret eğilimi, C kaynak zorunluluğu, D hesap yasağı (Excel rakamı yalnız hesap motoru), E yorum yasağı.
- **Basamaklar (Haiku):** K0 yalnız taban → K1 +C → K2 +D → K3 +E → K4 +B → K5 +A. K5 bugünkü sisteme denk olmalı, M1'e yakın çıkmalı.
- **Model kolu:** güçlü modelle yalnız K0 ve K5.
- **Senden istediklerimiz:** her bloğu tek bayrakla açıp kapatabilen bir eşleme listesi (K0'dan önce); her koşu için ham cevap dosyası (soru ID, cevap, kaynaklar, yol AI/kod, model, token, süre), puanlayıcı çıktısı, bayrak durumu, commit, cetvel sürümü, maliyet ve gecikme.
- Tahmini maliyet: Haiku ile ~5 USD, güçlü model kolu ile toplam ~30–40 USD.
- KY'yi kontrolör elle sayar. Seçilen yapılandırma kontrolörün saklı setiyle ayrıca doğrulanır. Saklı seti sana vermeden eval ortamında nasıl koşturabileceğimizi birlikte netleştirelim.

**b) Embedding ölçümü** aynı ortamda: bge-m3 bellek ve süre, yeniden vektörleme süresi, açık/kapalı kalite. Yeni bağımlılık olduğu için önce kısa bir plan gönder (yalnız eval kapsamında, Ç-15/5 ve Ç-11).

**c) Ajan yolu** kural merdiveni sonucundan sonra açılır.

## 4. Dalga 1

(b) seçeneğine onay: kapı koşularından sonra. Sıra kuralı: saklı setteki skor 99 sorudaki skorun belirgin altında kalırsa kayıp mimaride demektir; o durumda kapıyı tekrar tekrar koşmak yerine önce Dalga 1'e geçilir.

**ADR-032 notu:** Proje ekseni önerimiz ek LLM çağrısı istemiyor. Mevcut router çağrısının JSON'una üç alan ekleniyor (`projects`, `project_bound`, `company_level`). Doğrulamayı ve filtrelemeyi kod yapıyor. Bu ayrıma göre ADR-032 ile çelişki var mı? Router prompt planını (Ç-15/8) uygun olduğunda hazırlarsın; acelesi yok.

## 5. Cevap bekleyen iki soru

- Router çağrısı bugün `previous_question` bilgisini alıyor mu?
- Excel 1×1 sınırı ve B-01 (Yeşilova taksitleri): bir çözüm yolu öneriyor musun?

Rapordaki sıralamanın dışında daha sağlam bir yol görüyorsan yaz.

## 6. Kalanlar

- Ek A şemalarının kod karşılığı: kapıdan sonra.
- Ürün 2-3 V0 kuralları için ADT taslağını ben hazırlayacağım. ADT-4 bitince yürürlüğe girer.
- CLAUDE.md sabitleri: ayrı küçük iş emri, tamam. (→ C1 olarak yapıldı.)

Kolay gelsin.
Tansu

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- §1 V21 dondurma — sürüm/commit:
- §3a blok-bayrak eşleme listesi — durum:
- §3b embedding planı — durum:
- §4 ADR-032 ile çelişki var mı:
- §5 `previous_question`:
- §5 Excel 1×1 / B-01 önerisi:
- Diğer:
