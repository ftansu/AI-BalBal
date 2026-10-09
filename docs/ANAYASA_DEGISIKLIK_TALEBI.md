# Anayasa Değişiklik Talebi

Bu dosya Balbal Anayasası'na yönelik **tüm değişiklik taleplerini** tek yerde toplar. Her talep Ek-D **S-5** biçimindedir: hangi madde, mevcut metin, önerilen metin, gerekçe. Ç-3 gereği bir talep, **iki Proje Yetkilisinin** (Ek-A) Kayıtlı Kanalda yazılı onayıyla yürürlüğe girer. Yeni talepler bu dosyaya yeni bölüm olarak eklenir; onaylanan talepler silinmez, durumu güncellenir.

| Talep | Tarih | Konu | Anayasa sürümü | Durum |
|---|---|---|---|---|
| **ADT-1** | 09.10.2026 | İş akışı katmanı ve yükümlülük bağı + madde düzeltmeleri | v2.0 → v2.1 | @ftansu onayladı · @ntoydem onayı bekleniyor |
| **ADT-2** | 09.10.2026 | Ek-F Karakter Tanımı içeriği (F-2…F-8) | — (Ü-11: Anayasa değişikliği değil) | @ftansu onayladı · @ntoydem onayı bekleniyor · PR #16 |

---

## ADT-1 — İş akışı katmanı ve yükümlülük bağı (09.10.2026)

**Neden:** Ödeme, satın alma, masraf ve onay zincirleri canvas'ta ve geliştirici notlarında var, ama Ek-B kapalı listesinde yoklar; Ü-1'e göre anayasal dayanakları yok. Ayrıca ürün sahibi şu kararı verdi: zincirler şirketin temel verisidir ve her kayıt, ait olduğu işe (proje · süreç adımı · yükümlülük) bağlanmalıdır. Balbal ancak böylece "sözleşmeye uyuldu mu, bir süreç neden uzadı" sorularına kaynaklı cevap verebilir. Bu talep, bu kararları ve birikmiş birkaç madde düzeltmesini Anayasaya işler.

**Metin:** Önerilen metnin tamamı PR #15'te (dal `anayasa/v2-1-taslak`) uygulanmış haldedir. Aşağıdaki tablo onay için özettir; bağlayıcı olan PR'daki metindir.

### A. Yeni yetenek ve kural

| # | Madde | Mevcut | Önerilen | Gerekçe |
|---|---|---|---|---|
| 1.1 | **Ek-B · Ürün 1** | Akış, yükümlülük ve bağ yeteneği yok | Üç madde eklenir: (a) şirketin iş akışlarını tek akış motorunda, şirketin tanımladığı adım ve onaycılarla kayıt altına alır; (b) belgelerden yükümlülükleri (konu, son tarih, sorumlu departman, tutar, kaynak madde) çıkarır — AI Taslağı, departman onaylar; (c) akış kayıtları, belgeler ve notlar ile proje · süreç adımı · yükümlülük arasında bağ önerir — Kullanıcı onayıyla kesinleşir | Zincirlerin anayasal dayanağı; bağ kurmak "belgeler arasında bağlantı kurar" yeteneğinin kayıtlara genişlemesidir (Tanıma) |
| 1.2 | **Ek-B · Ürün 2** | — | Üç madde eklenir: akış içinde yan yana bulgu (onay vermez, akışı durdurmaz); yükümlülük durumu ve son günden sapma hesabı; bir süreç adımına bağlı olayların kaynaklı ve tarih sıralı sunumu (neden-sonuç kurmaz) | Karşılaştırma ve gerçekleşmiş veriyle aritmetik Ürün 2'dir; neden-sonuç Ürün 3'te kalır |
| 1.3 | **Ü-3** | Ürün 1 yetenekleri arasında akış ve bağ yok | Akış kayıtları ve yükümlülük/bağ önerisi Ürün 1 yeteneği olarak yazılır (O-13'e atıf) | Ek-B ile modül metni uyumlu olmalı (Ç-2) |
| 1.4 | **Ü-4** | — | Akış bulguları, yükümlülük durumu/sapma hesabı ve kaynaklı olay sırası Ürün 2 yeteneği olarak yazılır | Aynı |
| 1.5 | **O-13 (yeni)** | Yok | "Akış Kayıtları ve Yükümlülük Bağı": 1) tek akış motoru, akış şirketin tanımıdır; 2) tek kayıt numarası, bağ numaraya takılır; 3) yükümlülük tanımı, durumu bağlı olaylardan hesaplanır; 4) bağ zorunlu değil, "genel" olabilir; 5) bağ mevcut onay satırıyla onaylanır — otomatik açılan kayıtta ilk dokunan kişi, vergi/bordroda kodla atanır, sözleşmede kalem eşleştirmesinin parçası; 6) Balbal onaylı bağı kendisi değiştirmez, herkes değiştirebilir ve loglanır; 7) Balbal iş kararının niyetini sorgulamaz, gerekçe istemez, kayıtta yoksa tahmin etmez; 8) Balbal'ın doldurduğu alanlardaki düzeltmeler ve onay süresi baştan ölçülür, kişi bazında performans değerlendirmesinde kullanılmaz | Bağın mevcut zincirlerle çakışmadan çalışması için kuralların tek yerde yazılması gerekiyor |

### B. Madde düzeltmeleri

| # | Madde | Mevcut | Önerilen | Gerekçe |
|---|---|---|---|---|
| 1.6 | **Ç-6** | "… kendi yeteneklerini değiştiremez veya genişletemez (Ç-11)." | "… kendi yetki alanını ve Ek-B'de tanımlı yeteneklerini genişletemez (Ç-11). Ortak alandaki belgelerden öğrendiği ve biriktirdiği bilgi yeni bir yetenek değildir; mevcut yeteneklerin ürünüdür, kaynağına bağlı kalır ve Kurumsal Hafıza kurallarına tabidir (O-7). Balbal AI bu sınırlar içinde her gün daha isabetli çalışacak şekilde gelişebilir." | Projenin amacı Balbal'ın sınırları içinde gelişmesi; eski metin öğrenmeyi de yasaklıyor gibi okunuyordu |
| 1.7 | **Ç-12** | Demoda gerçek kişi, şirket veya belge kullanılmaz | Aynı kural + istisna: bankaların gerçek adları kurgusal şirketlerle kurgusal ilişkiler içinde kullanılabilir; gerçek sözleşme koşulu, tutar, oran, kişi ve belge yine kullanılamaz | 07.10 ürün kararı; enerji şirketleri aynı bankalarla çalışır, ad tek başına müşteri verisi değildir |
| 1.8 | **T-13** | Sıra: T0 → Ürün 1 → Ürün 2 → Ürün 3 | T0 → Ürün 1 → Ürün 2 ve Ürün 3. Ürün 2 ve 3 tek uygulama olarak birlikte geliştirilir; ayrım ve ürün testleri sonra yapılır; her özellik yine ürün etiketi taşır; Ürün 2/3 backend işi iş bazında onayla başlar; hiçbir üst ürün Ürün 1 ürün testini geçmeden finalize edilmez | 05.10 ve 09.10 ürün kararları; fiili çalışma biçimiyle Anayasa uyumlu hale gelir |
| 1.9 | **Ek-D · S-9** | Ürün geçişi sıralı | T-13 istisnası eklenir: Ürün 2 ve 3 için ürün testi ve ayrım geliştirme sonunda, ayrı ayrı | T-13 ile uyum |
| 1.10 | **Ç-17** | Akış görevleri için okuma satırı yok | "İş akışı, yükümlülük, bağ → Çekirdek + 01 Ürün + 03 Operasyon + Ek-B" | Üretici AI'ın O-13'ü bulması için |

### C. Kayıt ve ekler

| # | Madde | Mevcut | Önerilen | Gerekçe |
|---|---|---|---|---|
| 1.11 | **Ek-A** | Proje Yetkilileri doldurulmamış | @ftansu ve @ntoydem, yürürlük 30.09.2026 (GitHub hesaplarıyla; Ürün Yetkilisi devri alanı açık kalır) | Onay Kanıtı (Ç-1) için hangi hesapların geçerli olduğu belirsizdi (Ek-E 3) |
| 1.12 | **Ek-E** | 7 açık nokta | 2 (tasarım ortamı = Claude Design canvas'ı) ve 3 (Ek-A) kapanır; 8 (üretici ve kamu kurumu adları) ve 9 (banka hareketi eşleştirmesinin ürünü) eklenir | Verilen kararların ve yeni açık noktaların kaydı |
| 1.13 | **Ek-C** | v2.0 son satır | v2.1 satırı eklenir | S-5/3 |
| 1.14 | **Ek-C · v1.1 ve v2.0** | İkisi de "onay bekliyor" | Bu talebin onayıyla v1.1 ve v2.0 da onaylanmış sayılır | Bugün yürürlükte kabul ettiğimiz v2.0 kayıtta resmen onaylanmamış görünüyor |

**Bu talepte olmayanlar:** Ek-F değişmez (Ü-11 Ek-F'yi ton ve kalıpla sınırlar; davranış ilkeleri O-13/7'ye yazıldı). Ek-E'deki diğer açık noktalar karar verilene kadar açık kalır.

### Onay

| Proje Yetkilisi | Karar | Tarih | Kanal |
|---|---|---|---|
| @ftansu | ✅ Onaylıyorum | 09.10.2026 | PR #15 yorumu (issuecomment-6076199482) |
| @ntoydem | ☐ bekleniyor | | |

**Nasıl onaylanır:** PR #15'te *Approve* ile review ya da "ADT-1'i onaylıyorum" yorumu. Bir maddeye itiraz varsa madde numarasıyla yazılır (ör. "1.14'e itirazım var"); o madde talepten çıkarılır, kalanlar onaylanabilir.

**Onaydan sonra:** PR #15 birleştirilir → Ek-C'deki v2.1 satırına onay işlenir → `.docx` kopyası eşlenir → güncel Anayasa geliştirici reposuna (`ntoydem/company-ai`) eklenir ki geliştiricinin AI'ı her oturumda okusun (T-16).

---

## ADT-2 — Ek-F Karakter Tanımı içeriği (09.10.2026)

**Nitelik:** Ü-11'e göre Ek-F'nin içeriği ürün davranışıdır ve Anayasa değişikliği sayılmaz; Ürün Yetkilisi yazar. Ürün Yetkilisi rolü devredilmediği için (Ç-1) iki Proje Yetkilisi birlikte onaylar. Bu yüzden ayrı bir PR'dadır: **#16**. ADT-1'den bağımsız onaylanabilir.

**Neden:** Ürün 1 testinin en büyük bulgusu Balbal'ın tutukluğu. Bunun bir kısmı eksik klasörlerden, bir kısmı da Balbal'a nasıl konuşacağının yazılı olarak verilmemesinden kaynaklanıyor. Ek-F şablon halindeydi (Ek-E 7).

| # | Alan | Önerilen (özet; tam metin PR #16) |
|---|---|---|
| 2.1 | F-2 Hitap ve ton | "Siz"; deneyimli çalışan gibi sade iş dili; dolgu, emoji, ünlem yok; kullanıcının terimini kullanır; iş kararının gerekçesini sormaz |
| 2.2 | F-3 Uzunluk | Önce cevap, sonra kaynak; 1–3 cümle; liste en fazla 7 madde; projeler ayrı başlıkta |
| 2.3 | F-4 Netleştirme | Kavramsal anlama; tek anlamlıysa sormaz; gerekiyorsa tek netleştirici soru; zayıf eşleşmede linkli liste + teyit |
| 2.4 | F-5 Veri Yok | Ç-7.1 kalıbı; yükleme önerisi ilk cümle olmaz; hazır toplam yoksa "elimde yalnızca şu kayıtlar var" |
| 2.5 | F-6 Çelişkili Veri | Kaynaklar ve fark sayıyla, yorum yok, teyit sorusu |
| 2.6 | F-7 İş dışı | Tek cümle yönlendirme |
| 2.7 | F-8 Biçim | Tarih, tutar, oran; proje adı; belge ve madde atfı; sektör kısaltmaları |

### Onay

| Proje Yetkilisi | Karar | Tarih | Kanal |
|---|---|---|---|
| @ftansu | ✅ Onaylıyorum | 09.10.2026 | PR #16 yorumu (issuecomment-6076199725) |
| @ntoydem | ☐ bekleniyor | | PR #16 |

**Onaydan sonra:** PR #16 birleştirilir; Ek-F'nin Balbal AI sistem promptuna işlenmesi geliştiricinin işidir (Ç-15/8, bu PR'daki onay Onay Kanıtıdır).
