# X Platformu (Balbal) — Backend Talepleri ve Çalışma Esasları

**Kime:** Naci ve Naci'nin yapay zekası
**Hazırlayan:** Tansu (Claude ile) · **Revizyon:** v7.6 · 28.09.2026
**Karşılaştırılan sürümler:** `ntoydem/company-ai` @ `4301968` (Phase 5.4) ↔ `ftansu/AI-BalBal`
**Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (v165). Repo ile canvas farklıysa **canvas esastır**.

---

## İçindekiler

0. [Bu belge nasıl okunur](#0-bu-belge-nasıl-okunur)
1. [Genel sistemin çalışma prensibi](#1-genel-sistemin-çalışma-prensibi) — **1.5 Ürün katmanları: her özellik hangi üründe?** · **1.6 Uyum denetimi** · **1.7 İki ayrı test ve soru kuralı**
2. [Kurumsal yapı, kişiler ve yetki](#2-kurumsal-yapı-kişiler-ve-yetki)
3. [Balbal için notlar](#3-balbal-için-notlar)
4. [Belgeler ve kurumsal hafıza](#4-belgeler-ve-kurumsal-hafıza)
5. [Ana ekran: gündem ve bildirimler](#5-ana-ekran-gündem-ve-bildirimler)
6. [Departmanlar arası iletişim yöntemleri](#6-departmanlar-arası-iletişim-yöntemleri)
7. [Departman bazlı talepler](#7-departman-bazlı-talepler)
   - 7.1 Proje Finans · 7.2 Mali İşler · 7.3 Hukuk · 7.4 İdari İşler · 7.5 İK · 7.6 Enerji
8. [Ortak modüller (birden çok departmanın kullandığı)](#8-ortak-modüller)
   - 8.1 İşlem talepleri ve personel izni (B-22) · 8.2 Resmî yazışma ve dilekçe taslağı (B-23) · 8.3 EPİAŞ ve mahsuplaşma hesabı (B-21)
9. [Demo veri seti](#9-demo-veri-seti)
10. [Naci'den beklenen analiz](#10-naciden-beklenen-analiz)
11. [Ertelenen ve kapsam dışı işler](#11-ertelenen-ve-kapsam-dışı-işler)
12. [Yol haritası ve öncelik sırası](#12-yol-haritası-ve-öncelik-sırası)
13. [Naci'nin yapay zekasına hazır istem](#13-nacinin-yapay-zekasına-hazır-istem)
- [Ek A — B kodu dizini](#ek-a--b-kodu-dizini)

---

## 0. Bu belge nasıl okunur

- Belge **konu başlıklarına** göre düzenlendi. Her talebin yanında bir **B kodu** var (B-01 … B-26). Frontend kodundaki yorumlar (`// BACKEND_GAPS B-07` gibi) bu kodlara atıf yapar; kodlar değişmedi. Hangi kodun hangi bölümde olduğu **Ek A**'da.
- Her talebin başlığının altında **"Ürün:"** satırı var: o özelliğin hangi ürün katmanına (Ürün 1 Tanıma / Ürün 2 Birleştirme / Ürün 3 Yorumlama / ortak altyapı) ait olduğu. Ayrıntı ve kurallar **§1.5**'te.
- Her talebin başında bir **durum etiketi** var:

| Etiket | Anlamı |
|---|---|
| **HEMEN** | Kararı verilmiş, küçük/orta iş. Doğrudan uygulanabilir. |
| **SIRADA** | Kararı verilmiş ama başka bir işin bitmesini bekliyor. Başlama koşulu yazılıdır. |
| **ADR ÖNCE** | Kod yazılmadan önce mimari karar kaydı (ADR) taslağı hazırlanıp Tansu'ya onaya sunulur. |
| **ÖNERİLEN KARAR** | Tansu'ya bir karar önerildi, onay bekleniyor. Onaylanana kadar yalnızca ADR/soru listesi; kod yok. |
| **BİLGİ** | Uygulama talebi değil; bağlam veya ileride yapılacak iş. |
| **BEKLEMEDE** | Metni tamamlanmadı; başlanmaz. |

- "Frontend" = `ftansu/AI-BalBal` (Tansu tarafı). "Backend" = `ntoydem/company-ai` (Naci tarafı). **Backend tarafı frontend'e dokunmaz**; frontend tarafı backend'e dokunmaz.
- Backend'de olmayan uçlar için frontend `frontend/src/api/proposed.ts` içindeki **sözleşmeyi** çağırır. Backend 404/405/501 dönerse ekran sahte veri göstermez; "Backend bekleniyor" kutusu ve uç adı görünür. Yani bir ucu eklediğin anda ilgili ekran kendiliğinden çalışır. **Alan adlarını `proposed.ts` ile birebir eşleştir.**

---

## 1. Genel sistemin çalışma prensibi

### 1.1 Ürünün mantığı: Tanı → Birleştir → Yorumla

Platform, şirketin kendi verisini yapay zekaya üç kademede kullandırır. Her kademe ayrı satılabilir bir üründür; ama hepsi **tek ortak altyapı** üzerinde çalışır.

| Ürün | Ne yapar | Ne yapmaz |
|---|---|---|
| **Ürün 1 — Kurumsal Bilgi ve Doküman Sistemi** (Tanıma) | Departman yapısını kurar. Belgeleri toplar, sınıflandırır, indeksler, bağlar. Yetkiye göre bulur, okur, **kaynak göstererek, yorum katmadan** cevap verir. | Yorum, görüş, projeksiyon üretmez. |
| **Ürün 2 — AI Destek Beyni** (Birleştirme) | Farklı kaynaklardaki kesin bilgiyi birleştirir, yan yana gösterir; **yalnızca gerçekleşen veriyle** aritmetik yapar; şirket şablonlarını doldurur; **yazı ve form taslağı** hazırlar; eksik bilgi/belgeyi gösterir; deadline hatırlatır; departmanlar arası **görüş talebini** yönetir. | Karar vermez, kritik işlem yapmaz. **İnsan onaylar.** |
| **Ürün 3 — Departman Bazlı AI Araçları** (Yorumlama) | Departman bazında detaylı görüş, projeksiyon, sapma analizi. | Son onay yine insanda. |

**Pratik sonuç:** Bir özelliği tasarlarken önce "bu Ürün 1 mi, 2 mi, 3 mü?" diye bak. Ürün 1 seviyesindeki bir cevapta yorum görürsen hatadır. Ürün 2 seviyesinde tahmin/projeksiyon görürsen hatadır.

### 1.2 Değişmez ilkeler

Bu ilkeler hiçbir phase'de, hiçbir gerekçeyle esnetilmez. Bir tasarım bunlardan biriyle çelişiyorsa **dur ve Tansu'ya sor**.

#### P-1 · Personel onayı olmadan hiçbir işlem ilerlemez ⛔

Platformun temel felsefesi budur.

1. **Balbal yalnızca taslak üretir.** Kayıt oluşturmaz, göndermez, onaylamaz, imzalamaz, silmez. Anlar, eksik bilgiyi sorar, taslak yazar.
2. **Taslak önce talep sahibine gösterilir.** Personel taslağı arayüzde görür, gerekirse düzeltir ve **kendi kimlik doğrulamalı oturumundan, arayüzdeki açık onay butonuyla** onaylar. Onaylamadan taslak **hiç kimseye** (yönetici, İK, hukuk, başka departman) görünmez ve hiçbir kuyruğa düşmez.
3. **Sohbette "onaylıyorum / tamam / gönder" yazmak onay değildir.** Onay yalnızca ayrı bir uçtan (`POST …/approve`) ve yalnızca talep sahibinin oturumuyla gelir. Balbal'ın, bir servisin veya başka bir kullanıcının (yönetici ve admin dahil) personel adına onay vermesi **teknik olarak imkânsız** olmalı (403).
4. **Onaydan sonra içerik değişirse onay düşer.** Yönetici, İK veya ikinci onaycı formu **düzenleyemez**; yalnızca onaylar, reddeder ya da yorumla "düzeltme iste" der. Form personele döner, personel düzeltir ve **yeniden onaylar**.
5. **Durum geçişlerini kod yönetir, LLM değil.** LLM çıktısı hiçbir zaman bir durum geçişini doğrudan tetiklemez.
6. **Her geçiş denetim kaydına yazılır:** kim, ne zaman, önceki durum, sonraki durum, yorum.
7. **Her işlem modülünde dört zorunlu test:** (a) personel onayı olmadan sonraki duruma geçiş reddedilir; (b) başkası adına onay → 403; (c) onaydan sonra içerik değişikliği onayı düşürür; (d) onaylanmamış taslak başka kullanıcının hiçbir listesinde (kuyruk, gündem, bildirim, arama, Balbal) görünmez.

**Kapsam:** Bugün izin talebi (§8.1) ve yazışma/dilekçe (§8.2). İleride eklenecek **her** işlem (masraf, satın alma, avans, evrak talebi, görüş talebi vb.) aynı kurala tabidir.

#### P-2 · Yetki tek kapıdan geçer

- Belgeye dayanan **her** çıktı (cevap, kaynak kartı, arama sonucu, gündem maddesi, bildirim, sohbette paylaşılan belge, taslak) `allowed_document_ids` üzerinden süzülür. Yetki kontrolü **arama/erişim seviyesinde** yapılır; LLM'e bırakılmaz.
- Yetkisiz içerik **LLM'e bile girmez**. Yetkisiz bir belgenin başlığı, varlığı, sayısı dahi ele verilmez.
- Yeni bir yetki kuralı gerekirse (ör. departman yöneticisi, belge paylaşımı) değişiklik **yalnızca** `allowed_document_ids` hesabında yapılır; ikinci bir yetki yolu açılmaz.

#### P-3 · Sahte veri yok

Backend'de olmayan bir özellik için arayüz uydurma veri göstermez. Backend de "boş ama başarılı" cevap yerine gerçekten yoksa 404/501 döner. Tahmini bir değer gösteriliyorsa **"tahmini"** diye etiketlenir.

#### P-4 · Her dosya referansı açılabilir ve indirilebilir

Arayüzde görünen her belge, Excel, sözleşme adı hem tıklanıp açılabilen hem indirilebilen bir link olmalı. Bu yüzden belgeye atıf yapan **her** API cevabı `document_id` taşır (yetki kontrolünden geçmiş olarak).

#### P-5 · Bir kişi = bir arayüz

Her kişinin tek bir ana departmanı ve tek bir arayüzü vardır; arayüzde departman değiştirme yoktur. Departman seçme ekranını yalnızca yönetim ve admin görür.

#### P-6 · Her proje ayrı gösterilir

Birden çok proje söz konusu olduğunda cevaplar, tablolar ve API çıktıları **proje proje ayrı** döner. Konsolide/toplam satırı yalnızca açıkça istenirse üretilir; API varsayılan olarak konsolide dönmez.

#### P-7 · Sadelik

Ekran bilgiyle doldurulmaz. İlk bakışta göze çarpması gerekenler görünür; detay isteyen Balbal'a sorar. Backend tarafında bunun anlamı: ana ekran uçları (gündem, bildirim) **kısa ve öncelikli** liste döner, her şeyi dökmez.

#### P-8 · Sabit motor, yapılandırılabilir şablon

İş mantığı (durum makineleri, hesap motoru, yetki) sabittir. Şirkete özel değerler (oranlar, süreler, şablonlar, tatiller, departman yapısı) **tablo/parametre** olarak tutulur, koda gömülmez.

#### P-9 · Kurgusal demo, açık repo

- Demo ortamında gerçek kişi, gerçek kurum logosu, gerçek belge numarası yok; her şey kurgusal.
- `ftansu/AI-BalBal` **public** bir repo: gerçek sözleşme oranları, gerçek santral/EPİAŞ kimlikleri, şifre, anahtar asla yazılmaz.

#### P-10 · Karar gerektiren yerde dur

Ürün veya yetki kararı gerektiren bir noktada (belgede **ÖNERİLEN KARAR** veya **ADR ÖNCE** etiketli maddeler) tahmin yürütüp uygulamaya geçme. Önce ADR taslağı ve soru listesi.

### 1.3 İş bölümü

| Kim | Sorumluluk |
|---|---|
| **Tansu** | Ürün kararları, zihin haritası (bible), tasarım. Görsel her değişiklik önce Claude Design canvas'ında tasarlanır ve onaylanır, sonra frontend koduna girer. |
| **Frontend** (`ftansu/AI-BalBal`) | Ekranlar. Backend'e yalnızca API üzerinden bağlanır. Yeni uç ihtiyacını `proposed.ts`'e sözleşme olarak yazar ve bu belgeye ekler. |
| **Naci / backend** (`ntoydem/company-ai`) | API, veri modeli, yetki, retrieval, LLM akışları, entegrasyonlar (EPİAŞ vb.), testler. Frontend'e dokunmaz; tip değişikliği önerisini Tansu'ya liste olarak verir. |

### 1.4 Bugünkü durum: backend'de var, frontend'e bağlandı (BİLGİ)
**Ürün:** Ürün 1 — Tanıma

Bunlar için backend'de değişiklik gerekmiyor.
1. **`/api/ask` proje kapsamı (`project_id`)** frontend'e bağlanmıştı; canvas v165'te **proje seçimi kaldırıldı** (bkz. §3.3). Kod henüz buna uyarlanmadı; `project_id` gönderimi kalkacak.
2. **`GET /api/excel/{id}/inspect`** belge detayında "Excel dosya yapısı" kartı olarak gösteriliyor (sayfalar, adlandırılmış aralıklar, formül sayısı, makro). Excel olmayan belgede 422 → kart gizleniyor.
3. **Excel/CSV yükleme:** Backend `xlsx/xlsm/csv` kabul ediyordu, formdaki dosya seçici yalnızca PDF/görsel alıyordu. Düzeltildi.
4. **Versiyon zinciri:** `supersedes_document_id` / `superseded_by_document_id` artık açılabilir ve indirilebilir link.
5. **Dosya linki kuralı (P-4):** belge listesi, kaynak kartları, Excel kaynakları, arama, sohbet ekleri bu kurala göre düzenlendi.

### 1.5 Ürün katmanları: her özellik hangi üründe? (projenin belkemiği)

> **Referans:** "X Platformu — Mimari ve Süreç Haritası" (Tansu). Bu belgedeki **her** talep aşağıdaki katmanlardan birine bağlıdır ve her başlığın altında **"Ürün:"** satırıyla işaretlenmiştir. Bir özelliği yazarken önce katmanını kontrol et: **bir alt katmandaki özellik, üst katmanın yeteneğini kullanamaz.**

#### 1.5.1 Katmanlar ve kesin sınırları

| Kriter | T0 — Test | Ürün 1 — Tanıma | Ürün 2 — Birleştirme | Ürün 3 — Yorumlama |
|---|---|---|---|---|
| Ana amaç | Kavramsal kanıtlama | Veri varlığını kanıtlama: bulur, sınıflandırır, gösterir | Kesin veriyi birleştirme | Analiz, görüş, projeksiyon |
| Departman yapısı | Yok | **Tanımlanır (RBAC)** — Ürün 1'in ilk görevi | Ürün 1 yapısında çalışır | Departmana özel araçlar |
| Cevap tipi | Anlamlı yanıt testi | Kesin bilgi, **yorumsuz**, kaynaklı | Kesin veri, yan yana karşılaştırma | Serbest kurgulu rapor ve yorum |
| Hesaplama | Yok | **Yok** | Yalnızca aritmetik (toplam, ortalama, fark), **yalnızca gerçekleşmiş veriyle** | Aritmetik + projeksiyon |
| Tahmin / projeksiyon | Yok | **Yasak** | **YASAK** (varsayım = yorum) | Serbest |
| Raporlama | Yok | Arama ve gösterme | **Şablon doldurma** (şirketin Word/Excel şablonları) | Serbest tasarım |
| Departmana göre farklılaşma | — | **Farklılaşmaz** (ortak motor) | Farklılaşmaz; departman kendi yetki alanında genel görevleri kullanır | Yalnızca bu katman departmanlara ayrılır |
| Karar / onay | İnsan | İnsan | Son onay insanda (P-1) | Son onay insanda (P-1) |

**Ürün 1 veri grupları** (Ortak Veri Alanı'na yüklenenler): (1) Dokümanlar: PDF, Word, Excel · (2) İletişim ve sözleşme: e-posta içerikleri ve resmî sözleşmeler; sözleşmeyle ilgili e-postalar ilişkilendirilir · (3) Departman belgeleri: yetki matrisine göre erişim · (4) Proje belgeleri ve süreçlere bırakılan personel yorum/notları.

**Ürün 2'nin özellikleri:** şablon tabanlı raporlama · yazı taslağı · eksik belge/bilgi gösterme · deadline hatırlatma · birikmiş notları derleme · departmanlar arası görüş talebi (görüş insanındır; sistem iletir ve kurumsal hafızaya kaydeder) · insan onayı.

**Ürün 3'ün özellikleri:** departman bazlı araçlar (bkz. §7) · sapma ve kök neden analizi · projeksiyon (ör. yıl sonu gelir tahmini) · serbest rapor · risk değerlendirmesi.

#### 1.5.2 Backend için kurallar

1. **Katmanı karıştırma.** Ürün 1 cevabında yorum, Ürün 2 hesabında tahmin çıkarsa bu **hatadır**. Ürün 2'de "yıl sonunda ne olur?" gibi bir soruya cevap *"Bu bir projeksiyondur; Ürün 3 yeteneğidir"* olmalı.
2. **Her ürün ayrı satılabilir.** Bir müşteri yalnızca Ürün 1 alabilir. Bu yüzden her yetenek hangi ürüne ait olduğunu bilmeli ve o ürün lisanslı değilse **kapalı** olmalı (bkz. §1.5.4, B-25).
3. **Tahmin etiketi Ürün 3'e aittir.** Bir değer tahminle üretiliyorsa (eksik veriyi oranla tamamlama, gelecek ayı öngörme) o özellik **Ürün 3**'tür. Ürün 2'de yalnızca "kesin" ve "veri yok" durumları olabilir.
4. **Alt katman üst katmanın ön koşuludur.** Ürün 2 özelliği yazılmadan önce ilgili Ürün 1 altyapısı (yetki, belge, bağlantı) çalışıyor olmalı; Ürün 3 aracı Ürün 1–2 üzerine kurulur, kendi hafıza veya yetki mekanizmasını ayrıca inşa etmez.

#### 1.5.3 Bu belgedeki taleplerin ürünlere dağılımı

| Katman | Talepler |
|---|---|
| **Ortak altyapı** (her ürünün ön koşulu, ürünlere göre açılıp kapanmaz) | B-18 demo veri · B-19 analiz · B-02 bildirim altyapısı · B-25 ürün katmanı anahtarı · P-1…P-10 ilkeleri |
| **Ürün 1 — Tanıma** | B-20 (1–5) departman yapısı · B-08 departman yöneticisi rolü · B-09 ana departman · B-10 belge paylaşımı (→ B-26) · **B-26 klasör ve departman erişim yetkileri** · B-05 rehber · B-13 dosya türü · B-17 indirme · B-07 versiyon bağlantısı · B-14 genel arama · B-12 etiket önerisi onayı · B-03 sohbet geçmişi · B-04 geri bildirim · B-20/6 çok proje · B-11 evrak talebi (bulur ve yönlendirir) · B-15 Word yükleme · **B-24 e-posta ve sözleşme ilişkilendirme** · §1.4'teki mevcut özellikler (ask, Excel inspect, versiyon zinciri) |
| **Ürün 2 — Birleştirme** | B-01 gündem (deadline hatırlatma, bekleyen onaylar) · B-06a departmanlar arası görüş talebi · B-22 işlem talebi iskeleti ve izin formu taslağı · B-23 yazışma: özet, süre, **olgusal** cevap taslağı · şablon tabanlı dışa aktarma (§11) · §3.5 niyet ayrımı |
| **Ürün 3 — Yorumlama** | B-21 EPİAŞ + mahsuplaşma (tahmini değerler içerdiği için; bkz. §8.3) · B-16 EPİAŞ canlı veri · B-20/7 Enerji izin/ruhsat takibi · §7.3 Hukuk dava ve icra süresi takibi · B-23'ün hukuki gerekçe ve savunma kısmı · §7'deki bütün departman yol haritaları |
| **Ürün 2 sonrası (Tansu'nun kararı)** | B-06b kişiler arası ve grup sohbeti, Balbal dahil edilebilir (bkz. §6.3) |

#### 1.5.4 Ürün katmanı anahtarı — **B-25** · KARAR VERİLDİ (Tansu, 28.09.2026) · Ürün: ortak altyapı

**Karar:** Ürünler için ayrı uygulama/repo YOK. Tek frontend (`ftansu/AI-BalBal`), tek backend (`ntoydem/company-ai`); müşteride hangi ürünlerin açık olduğu aşağıdaki anahtarla kontrol edilir. Naci'nin daha önce gündeme getirdiği "her ürün için ayrı frontend" fikri bu nedenle uygulanmayacak — Ürün 2 ve 3, Ürün 1'in departman yapısı, yetki ve belge altyapısı üzerine kurulu; ayrı uygulamalar bu altyapıyı üçe katlardı.

- Şirket ayarlarında hangi ürünlerin açık olduğu tutulur: `company_settings.enabled_products = ["P1","P2","P3"]`.
- Her uç ve her Balbal akışı bir katmana bağlanır (`requires_product = "P1"|"P2"|"P3"`). Kapalı katmanın ucu `403 product_not_enabled` döner; Balbal *"Bu özellik şirketinizin paketinde yok"* der.
- `AskResponse`'a `product_level: "P1"|"P2"|"P3"` eklenir: cevabın hangi katmanda üretildiği görünür ve test edilebilir olur. (Mevcut `query_type` alanı buna eşlenebilir.)
- **`GET /api/auth/me` cevabına `enabled_products: ("P1"|"P2"|"P3")[]` eklenir.** Frontend bunu `CurrentUser.enabled_products` olarak zaten bekliyor (bkz. `frontend/src/api/products.ts`, `frontend/src/api/types.ts`) — alan gelene kadar frontend yalnızca P1 varsayar, kimseye yanlışlıkla Ürün 2/3 göstermez. Alan adı ve değerler (`"P1"|"P2"|"P3"`) birebir bu şekilde olmalı; farklıysa frontend tarafında ayrı bir eşleme yazılması gerekir.
- Demo ortamında üç ürün de açıktır.
- **Kabul testi:** Yalnızca P1 açıkken (a) taslak, görüş talebi, gündem uçları 403 döner; (b) Balbal hesap veya tahmin yapmaz; (c) yalnızca P1+P2 açıkken projeksiyon sorusu reddedilir; (d) `GET /api/auth/me` cevabında `enabled_products: ["P1"]` döner.

**Frontend tarafında yapıldı (bu commit):** `enabled_products` alanı ve `hasProduct()` yardımcı fonksiyonu (`api/products.ts`), `useHasProduct()` hook'u ve `RequireProduct` route guard'ı (`auth/`) eklendi. Bugün Ürün 2'ye bağlı tek somut ekran olan **ekip sohbeti** (görüş talebi içerdiği için) bu anahtara bağlandı: P2 kapalıyken launcher görünmez ve `openTeam()` no-op'tur. Henüz yazılmamış Ürün 2/3 ekranları (gündem, işlem talebi, yazışma taslağı vb.) yazılırken route'ları `RequireProduct` ile sarmalamak yeterli.

#### 1.5.5 Süreç haritasıyla karşılaştırırken bulunan noktalar

1. **B-21 mahsuplaşma Ürün 3'e taşındı.** Hesap, UEVM gelmeden gerçek zamanlı üretimi, KGÜP yoksa oranla tahmini KGÜP'ü ve tahmini KÜPST'ü kullanıyor; ekranda "tahmini" değer gösteriyor. Süreç haritasına göre tahmin Ürün 2'de **yasak**. Ayrıca haritada "EPİAŞ verisi işleme, ödeme/tahsilat takvimi" Proje Finans, "uzlaştırma verisi" Enerji-Piyasa **Ürün 3** aracıdır. Ay kapandıktan sonra **kesin** veriyle yapılan mahsuplaşma hesabı ise Ürün 2 aritmetiği sayılabilir. B-21 tam metni bu ayrımla yazılacak.
2. **İzin talebi hem Ürün 2 hem Ürün 3'te geçiyor.** Ürün 2 tanımında örnek olarak ("AI form hazırlar, insan onaylar"), Ürün 3 İK tablosunda araç olarak. Bu belgedeki ayrım: **işlem talebi iskeleti + form taslağı + onay akışı = Ürün 2** (tüm departmanlar kullanır); **İK'ya özel kurallar (bakiye türetme, puantaj, bordro girdisi) ve izin kullanım trendi analizi = Ürün 3 İK**.
3. **Yazışma/dilekçe de iki katmanlı.** Ürün 2 "yazı taslağı" hazırlar ama yorum katmaz: özet, süre, olgusal anlatım, istenen belgelerin listesi. Dilekçedeki **hukuki gerekçe, savunma argümanı, risk değerlendirmesi** yorumdur → **Ürün 3 Hukuk**. Yalnızca P2 açıkken taslakta "Hukuki sebepler" bölümü boş bırakılır ve `[AVUKAT DOLDURACAK]` yazılır.
4. **Word, Ürün 1'in çekirdek veri türü.** Haritada Ürün 1 dokümanları "PDF, Word, Excel". V0'da `.docx` yükleme ertelenmişti (B-15); bu **Ürün 1'in eksiği** olarak kayıtlıdır, sıradaki Ürün 1 genişletmesinin ilk işidir.
5. **E-posta ve sözleşme ilişkilendirme bu belgede hiç yoktu.** Ürün 1'in 2. veri grubu. **B-24** olarak eklendi (§4.6).
6. **Kişiler arası ekip sohbeti haritada yok → karar verildi (Tansu, 28.09.2026):** Ürün 2 tamamlandıktan sonra eklenecek; sohbete Balbal da dahil edilebilecek. Haritaya da bu şekilde işlenecek.
7. **Şablon tabanlı raporlama Ürün 2'nin çekirdeği** ama "dışa aktarma" olarak ertelenmiş durumda (§11). Ürün 2 tamamlanmış sayılmaz.

### 1.6 Uyum denetimi: backend bu belgeye göre kontrol edilir

Bu belge, backend'in **bağlayıcı çerçevesidir**. Tansu tarafı (Tansu ve Claude) `ntoydem/company-ai` reposunu düzenli olarak **salt okuma** ile bu belgeye göre denetler ve sapmaları Tansu'ya raporlar. Backend koduna Tansu tarafından dokunulmaz; düzeltmeyi Naci tarafı yapar.

**Sapma sayılan durumlar (her biri Tansu'ya bildirilir):**
1. **İlke ihlali:** P-1…P-10'dan biriyle çelişen kod. Örnek: personel onayı olmadan durum geçişi, LLM çıktısının doğrudan kayıt oluşturması, `allowed_document_ids` dışından beslenen bir cevap, konsolide dönen bir uç, koda gömülmüş oran/süre/şablon.
2. **Katman ihlali (§1.5):** Ürün 1 cevabında yorum, Ürün 2'de tahmin veya projeksiyon, ürün anahtarına bağlı olmayan bir yetenek.
3. **Karar beklemeden uygulama:** ÖNERİLEN KARAR veya ADR ÖNCE etiketli bir maddenin, onay veya başlama koşulu olmadan koda dönüşmesi; BEKLEMEDE (B-21) için kod yazılması.
4. **Sözleşme uyumsuzluğu:** `proposed.ts`'teki alan adlarından, tiplerden veya uç yollarından farklı bir uygulama.
5. **Zihin haritasına aykırılık:** departman yapısı, adlar veya proje adları bible'dan farklı.
6. **Kapsam dışı iş:** bu belgede olmayan bir özelliğin Tansu'ya sorulmadan eklenmesi (öneri serbesttir; uygulama sorulduktan sonra).
7. **Eksik test:** P-1'in dört testi, yetki testi veya katman testleri olmadan birleştirilmiş kod.

**Naci'nin yapay zekasından beklenen:** Her phase özetinde **"Bu belgeden sapmalar"** başlığı olsun. Sapma yoksa "yok" yazılsın; varsa madde numarası, gerekçe ve Tansu'nun onayını bekleyip beklemediği yazılsın. Bilerek yapılan ve gerekçeli bir sapma, denetimde bulunan sapmadan her zaman iyidir.

### 1.7 İki ayrı test: kod testi ve ürün testi (Tansu'nun kararı, 28.09.2026)

Bu projede iki farklı test var. Birbirine karıştırılmaz, biri diğerinin yerine geçmez.

| | **Kod testi** | **Ürün testi (satılabilirlik)** |
|---|---|---|
| Sorusu | Ürün yazıldı mı, doğru çalışıyor mu? | Gerçek hayatta karşılığı var mı, biri bunu kullanır ve parasını öder mi? |
| Kim yapar | Backend tarafı | Tansu tarafı |
| Nasıl | Otomatik testler (P-1 testleri, `allowed_document_ids`, katman testleri) ve belgelerdeki kabul testleri (`BAGLANTI_YOL_HARITASI.md` §9, T-01…T-18) | Önce arayüz testleri (T-19…T-25), sonra gerçek kullanıcı ve gerçek işle satılabilirlik testi |
| Geçerse | Ürün **çalışıyor** demektir, **satılabilir** demek değildir | Bir sonraki ürüne geçilir |

**Sonuç:**
1. **Bir ürünün "testleri bitti / finalize oldu" sayılmasının tek anlamı, Tansu tarafının ürün testinden geçmesidir.** Kod testini geçmek ürünün finalize olduğu anlamına gelmez.
2. Ürün 2'ye geçiş, Ürün 1'in finalize olmasına (ürün testinden geçmesine) bağlıdır. Bu bilgi Tansu'dan gelir.
3. Ürün testini yavaşlatan en büyük risk, backend tarafının belirsiz bir noktada tahminle ilerlemesi ya da cevap bekleyerek durmasıdır. Bu yüzden aşağıdaki soru kuralı geçerlidir.

#### 1.7.1 Soru kuralı: sor, tahmin etme, durma

- **Belirsizlik varsa sor.** Belgede açık olmayan, iki türlü okunabilen ya da ürün kararı gerektiren her noktada Tansu'ya sor (P-10). Tahminle kod yazma.
- **Soruyu bekletme.** Soru ne zaman çıktıysa o an ilet; phase sonundaki özeti bekleme.
- **Soruyu cevaplanması kolay yaz:** tek cümlelik soru, 2–3 seçenek, önerdiğin seçenek ve gerekçesi, cevap gelmezse neyin bekleyeceği.
- **Cevap beklerken durma.** O maddeyi beklet, sıradaki bağımsız maddeyle devam et. Bekleyen soruları her özette "Açık sorular" başlığında tekrar listele.
- **Ürün testi için gereken bilgiyi erken sor.** Örneğin demo kullanıcı adları, backend adresi, test ortamının ne zaman hazır olacağı, bir belgenin hangi departmana ait olacağı. Bunlar son güne kalırsa ürün testi bekler.

---

## 2. Kurumsal yapı, kişiler ve yetki

Kurumsal yapı hem backend'de hem frontend'de **zihin haritasıyla (bible) birebir aynı** olmalı. Bir uyumsuzluk görürsen Tansu'ya rapor et; kendin karar verme.

### 2.1 Departman yapısı — **B-20 (1–5)** · HEMEN
**Ürün:** Ürün 1 — Tanıma (departman yapısını kurmak Ürün 1'in ilk görevi)

Zihin haritasındaki yapı:

| Departman | Alt birimler |
|---|---|
| Proje Finans | — |
| Mali İşler | Muhasebe, Finansal Muhasebe |
| Hukuk | — |
| İdari İşler | — |
| İK | — |
| Enerji | Proje Geliştirme, O&M (İşletme ve Bakım), EPC (İnşaat), Üretim/Piyasa |

Backend'de tespit edilen farklar:
1. **İK departmanı yok** → eklenmeli.
2. **Enerji altında Üretim/Piyasa yok** → eklenmeli.
3. **"Finans" adı** → "Proje Finans" olmalı (slug değişecekse frontend'e haber ver).
4. **Mali İşler alt birimleri yok** → Muhasebe ve Finansal Muhasebe eklenmeli.
5. **Demo kullanıcısı `finans` hem Finans hem Mali İşler'de** → P-5'e ters. Arayüz, "Proje Finans, Mali İşler belgesini göremez" senaryosunu örnek olarak kullanıyor; kullanıcı yalnızca Proje Finans'ta olmalı.

### 2.2 Ana departman — **B-09** · HEMEN (B-08 ile birlikte)
**Ürün:** Ürün 1 — Tanıma (RBAC)

- P-5 gereği kişinin **ana departmanı** bilinmeli: `users.primary_department_id` eklensin, `/api/auth/me` dönsün.
- Frontend şu an `department_slugs[0]`'ı ana departman kabul ediyor; alan gelince ona geçecek.

### 2.3 Unvan ve yönetici bilgisi · HEMEN
**Ürün:** Ürün 1 — Tanıma (unvan); `manager_id` Ürün 2 işlem onayları için

- `users.title` (unvan, ör. "Proje Finans Müdürü") — rehber ve onay ekranları için (§6.1).
- `users.manager_id` (nullable) — izin ve diğer işlem onayları için (§8.1).

### 2.4 "Departman yöneticisi" rolü — **B-08** · ÖNERİLEN KARAR
**Ürün:** Ürün 1 — Tanıma (RBAC)

Mevcut kural (`authorization.py`):
- `employee`: kendi departmanının yalnızca `normal` belgeleri
- `management`: tüm departmanlar, tüm gizlilik düzeyleri

Tasarımda departman müdürleri (Proje Finans müdürü, Hukuk müdürü, Enerji müdürü) **kendi departmanlarının `restricted` belgelerini de** görüyor ama başka departmanların belgelerini görmüyor. Mevcut iki rol buna uymuyor.

- **Önerilen karar:** `department_manager` rolü; kural: "kendi departman(lar)ı, `normal` + `restricted`". (Alternatif: `user_departments` üyeliğine `max_confidentiality` alanı.)
- Bu rol aynı zamanda: etiket önerisi onayı (§4.2), işlem onay zinciri (§8.1), yazışma ikinci onayı (§8.2) için kullanılır.
- Değişiklik yalnızca `allowed_document_ids` içinde (P-2).
- **Not (Tansu'nun yaklaşımı):** yetki yapısı her şirkette farklı yapılandırılabilir olmalı (P-8). İK'da erişim **bireysel**, operasyonel departmanlarda (Enerji, Hukuk, Finans…) **departman bazlı** düşünülür.

### 2.5 Bir belgenin birden çok departmanla paylaşımı — **B-10** · ÖNERİLEN KARAR
**Ürün:** Ürün 1 — Tanıma (RBAC)

`documents.department` tek değer alıyor. Oysa bir kredi sözleşmesine hem Proje Finans hem Hukuk erişmeli; bugün bu ancak `management` ile mümkün.
- ~~Önerilen karar: `document_shares(document_id, department_id)` tablosu~~ → **Bu ihtiyaç §2.6 (B-26) ile karşılanır (Tansu'nun kararı, 28.09.2026):** belge bazında paylaşım yerine **klasör bazında departman yetkisi**; yetkiyi sistem yöneticisi verir. `document_shares` tablosu açılmaz.

### 2.6 Klasör yapısı ve departman erişim yetkileri (sistem yöneticisi sayfası) — **B-26** · KARAR VERİLDİ (Tansu, 28.09.2026)
**Ürün:** Ürün 1 — Tanıma (RBAC, ortak alan)

**Amaç:** Sistem yöneticisi, şirketin ortak alanında hangi klasörlerin olduğunu ve her klasöre hangi departmanın **görme** ya da **değiştirme** yetkisiyle erişeceğini tek bir sayfadan belirler. Örnek: proje sözleşmeleri Hukuk'un klasöründe durur, sistem yöneticisi Proje Finans'a o klasörü **görme** yetkisi verir.

**Backend bu sayfanın uçlarını açar; sayfanın arayüzünü Tansu tarafı tasarlar** (önce canvas, sonra `ftansu/AI-BalBal`). Uç sözleşmesi netleşince frontend `proposed.ts`'e eklenir.

#### 2.6.1 Kurallar

1. **Klasör ağacı şirkete özeldir ve veridir, koda gömülmez** (P-8). Her müşteri şirketin sistem yöneticisi kendi ağacını kurar. Demo için örnek ağaç seed ile gelir (§2.6.4).
2. **SPV'ler üst şirket tarafından yönetilir; bu yüzden yetkilendirme şirket düzeyinde tektir ve bütün SPV'lere/projelere aynı uygulanır.** Klasör yetkisi projeye veya SPV'ye göre değişmez. Belgenin projesi (`project_id`) bugünkü gibi filtre ve bağlam alanıdır, yetki birimi değildir (ADR-004 korunur).
3. Her klasörün bir **sahibi departman** vardır; sahibi departman klasörde her zaman **değiştirme** yetkisine sahiptir. Her belge **tek bir klasörde** durur; belgenin departmanı klasörün sahibi departmanıdır.
4. Diğer departmanlar için erişim düzeyi: **yok** (varsayılan) · **görme** · **değiştirme**.
   - **Görme:** belgeyi listede, aramada, Balbal'ın cevabında ve kaynak kartında görür; açar ve indirir.
   - **Değiştirme:** görmeye ek olarak klasöre belge yükler, meta veriyi düzenler, yeni versiyon yükler. (Silme bu yetkiye dahil değil; sistemde belge silme zaten yok.)
5. **Alt klasör, üst klasörün yetkisini miras alır.** Sistem yöneticisi bir alt klasörde farklı yetki tanımlayabilir; tanımlarsa o alt klasör için geçerli olan odur.
6. **Klasör yetkisi gizlilik düzeyini aşmaz.** Yetki verilen departmanın kullanıcısı, o klasördeki belgeleri kendi departmanında sahip olduğu gizlilik düzeyleriyle görür (bugün çalışan: `normal`; departman yöneticisi rolü B-08 kararına bağlı). `management` ve `admin` kuralları değişmez.
7. **Tek kapı (P-2):** Klasör yetkisi yalnızca `allowed_document_ids` hesabına eklenir; ikinci bir yetki yolu açılmaz. Aynı kural liste, arama, indirme, Balbal ve "Bu belgeyi kim görebilir?" (`GET /api/documents/{id}/visibility`) için geçerlidir.
8. **Her yetki değişikliği denetim kaydına yazılır:** kim, ne zaman, hangi klasör, hangi departman, önceki ve yeni düzey.
9. **Yetkinin kaldırılması anında geçerlidir:** kaldırıldığı anda o departman belgeleri hiçbir yerde göremez.
10. İK'daki bireysel erişim (kişi bazında yetki) bu maddenin dışındadır; ayrıca ele alınacak.

#### 2.6.2 Önerilen uçlar (alan adları frontend ile birlikte kesinleşir)

| Uç | Kim | Ne yapar |
|---|---|---|
| `GET /api/admin/folders` | admin | Ağaç: `id, name, parent_id, owner_department_slug, grants[{department_slug, access: "read"\|"write", inherited: bool}], document_count` |
| `POST /api/admin/folders` | admin | Klasör oluştur: `name, parent_id, owner_department_slug` |
| `PATCH /api/admin/folders/{id}` | admin | Ad değiştir, taşı |
| `DELETE /api/admin/folders/{id}` | admin | Yalnızca boş klasör; doluysa 409 |
| `PUT /api/admin/folders/{id}/grants` | admin | O klasörün yetki listesini topluca yazar: `[{department_slug, access}]`; sahibi departman listede olmaz |
| `GET /api/admin/access-matrix` | admin | Klasör × departman tablosu (her hücrede `none/read/write` ve miras bilgisi) — sayfanın genel görünümü için |
| `GET /api/admin/folders/audit` | admin | Yetki değişikliği geçmişi |
| `GET /api/folders` | her kullanıcı | Kullanıcının görebildiği klasörler ve her birindeki erişim düzeyi (belge yükleme ekranındaki klasör seçimi ve belge ağacı için) |
| `POST /api/documents/upload` | — | `folder_id` alanı eklenir; kullanıcının o klasörde `write` yetkisi yoksa 403 |

Admin olmayan kullanıcı `/api/admin/*` uçlarına 403 alır.

#### 2.6.3 Veri modeli (öneri)

`folders(id, name, parent_id, owner_department_id, created_at)` · `folder_grants(folder_id, department_id, access)` · `documents.folder_id` (mevcut belgeler migration ile sahibi departmanın kök klasörüne taşınır) · yetki değişiklikleri için denetim tablosu. Veri modeli için kısa bir ADR yazılır; belirsiz nokta varsa §1.7.1'e göre sor.

#### 2.6.4 Demo verisi (B-18 ile)

- Her departman için örnek klasör ağacı (ör. Hukuk → Proje Sözleşmeleri, Davalar, Kurum Yazışmaları; Proje Finans → Kredi, Sigorta, Banka Raporlama; Enerji → alt birim klasörleri).
- En az iki çapraz yetki örneği: **Hukuk / Proje Sözleşmeleri → Proje Finans: görme**; bir de **değiştirme** örneği.
- Demo belgeler bu klasörlere yerleşir.

#### 2.6.5 Kabul testleri

1. Proje Finans'a Hukuk/Proje Sözleşmeleri için **görme** verilince Proje Finans çalışanı o belgeleri listede, aramada, Balbal'da görür, açar ve indirir; yükleme ve düzenleme 403.
2. **Değiştirme** verilince yükleme, meta düzenleme ve yeni versiyon çalışır.
3. Yetki kaldırılınca belge hiçbir yerde görünmez (liste, arama, Balbal, indirme, bildirim).
4. Alt klasör mirası ve alt klasörde ayrı yetki doğru çalışır.
5. Klasör yetkisi gizlilik düzeyini aşmaz.
6. Aynı yetki iki projenin/SPV'nin belgelerine aynı şekilde uygulanır.
7. Her yetki değişikliği denetim kaydında.
8. Admin olmayan kullanıcı admin uçlarına 403 alır.
9. "Bu belgeyi kim görebilir?" cevabı klasör yetkileriyle tutarlı.

---

## 3. Balbal için notlar

Balbal, platformun yapay zeka asistanı. Kullanıcı bilgiye ekranda gezinerek değil, **Balbal'a sorarak** ulaşır (P-7).

### 3.1 Balbal'ın davranış kuralları (BİLGİ — mevcut kurallar, bozulmamalı)
**Ürün:** Ürün 1 kuralları (yorumsuz, kaynaklı cevap); üst katmanlar bu kuralların üzerine eklenir

1. **Kaynak göstermeden cevap vermez.** Her olgusal ifade numaralı kaynak kartına bağlanır. Kaynak yoksa "bulunamadı" der; tahmin etmez.
2. **Ürün seviyesine uyar (§1.1).** Ürün 1 cevabı yorumsuzdur; Ürün 2 hesabı yalnızca gerçekleşmiş veriyle yapılır.
3. **Yetkisiz içerik LLM'e girmez (P-2).** Balbal "bu belge Mali İşler'de" gibi cümlelerle yetkisiz bir belgenin varlığını ele vermez (bkz. §6.4).
4. **Kapsam sınırı:** Balbal yalnızca şirket arşivi ve iş süreçleri için cevap verir. Şahsi veya kapsam dışı sorularda nazikçe yönlendirir. Başkalarına ait kişisel bilgiler (maaş, izin, sağlık vb.) yetki filtresiyle **erişim seviyesinde** korunur, LLM'in takdirine bırakılmaz. (Tansu bunu "ciddi bir konu, mimari buna göre kurulacak" olarak tanımladı.)
5. **Soru kayıtları ve KVKK:** Soru-cevaplar bilgi tabanına **girmez**; denetim kaydında tutulur. Kimin ne görebildiği ve personelin bilgilendirilmesi baştan tasarlanır.
6. **İşlem yapmaz, taslak üretir (P-1).** Bkz. §3.5.

### 3.2 Sohbet geçmişi ve çok turlu soru — **B-03** · ÖNERİLEN KARAR
**Ürün:** Ürün 1 — Tanıma (Balbal altyapısı; Ürün 2 diyaloglarının ön koşulu)

Şu an frontend geçmişi yalnızca tarayıcı oturumunda tutuyor; sayfa yenilenince kayboluyor.

```
GET  /api/ask/conversations        → [{ id, title, updated_at }]
GET  /api/ask/conversations/{id}   → { id, turns: [{ question, response: AskResponse, created_at }] }
AskRequest.conversation_id?        (isteğe bağlı)
AskResponse.conversation_id
```
**Önerilen karar:**
- Geçmiş yalnızca kullanıcının kendisine ait ayrı tabloda (`ask_conversations`) tutulur, **retrieval'a hiç girmez**, 90 gün saklanır (denetim kaydıyla aynı).
- Takip sorularında ("peki ya Yeşilova?") önceki turun sorusu **sınıflandırıcıya bağlam** olarak verilir. Kaynak kuralı değişmez: her turda retrieval yeniden `allowed_document_ids` üzerinden yapılır.
- Bu altyapı, işlem diyaloglarının (§3.5, §8.1) da ön koşuludur.

### 3.3 Tek sohbette birden çok proje — **B-20/6** · HEMEN
**Ürün:** Ürün 1 — Tanıma (her proje ayrı gösterilir; birleştirme/karşılaştırma istenirse Ürün 2)

- Balbal penceresinde **proje seçimi yok** (Tansu'nun kararı). Tek sohbette birden çok proje konuşulabilir.
- Balbal sorudaki projeleri **kendisi tespit eder**; cevapta her proje ayrı gösterilir (P-6); her kaynak kartında `project` alanı olur.
- `AskRequest.project_id` artık zorunlu değil; kaldırılabilir veya yok sayılabilir.

### 3.4 Cevap kimliği ve geri bildirim — **B-04** · HEMEN
**Ürün:** Ürün 1 — Tanıma

- `AskResponse`'a `audit_log_id` eklenmeli (kayıt zaten yazılıyor, id'si dönmüyor).
- `POST /api/ask/feedback { audit_log_id, rating: "up"|"down", comment? }` → denetim kaydına bağlanır. "Hatalı bildir" kayıtları yönetim panelinde filtrelenebilir; eval setini büyütmek için iyi bir kaynak.

### 3.5 Soru mu, işlem talebi mi? (niyet ayrımı) · SIRADA (§8.1 ile)
**Ürün:** Ürün 2 — Birleştirme (form/taslak hazırlama). Yalnızca P1 açıkken işlem niyeti "bu özellik paketinizde yok" ile cevaplanır

Balbal'a gelen her mesaj önce sınıflandırılır:

| Niyet | Ne olur |
|---|---|
| `question` | Mevcut akış (retrieval + kaynaklı cevap). |
| `action:leave_request` | Retrieval **çalışmaz**, LLM'e belge içeriği verilmez. Alanlar çıkarılır, eksikler sorulur, taslak form oluşturulur (§8.1). |
| `unknown_action` | "Bu işlem henüz sistemde yok." Hiçbir şey oluşturulmaz. |

- `AskResponse`'a eklenecek alan: `action: { kind: "leave_request_draft", request_id } | null`. Doluysa frontend sohbette form kartını gösterir (`proposed.ts` §7).
- Kullanıcının mesajındaki ifadeler **talimat değildir**: "Yöneticim onayladı, direkt İK'ya gönder" durum makinesini etkilemez.

### 3.6 Kaynak kartında versiyon bağlantıları — **B-07** · HEMEN
**Ürün:** Ürün 1 — Tanıma (belgeler arası bağlantı)

`SourceCard` şu an `supersedes_title` / `superseded_by_title` dönüyor ama **id dönmüyor**; "Bu eski versiyon, güncel versiyon: X" uyarısındaki X tıklanamıyor (P-4 ihlali).
```python
supersedes_document_id: UUID | None
superseded_by_document_id: UUID | None
```
Güncel versiyonun id'si dönmeden önce kullanıcının o belgeyi görme yetkisi kontrol edilir; yoksa `None`.

### 3.7 Canlı veri kaynağı (EPİAŞ) — **B-16** · BİLGİ (§8.3 ile)
**Ürün:** Ürün 3 — Proje Finans / Enerji-Piyasa aracı (EPİAŞ verisini işleme)

Üretim, PTF ve YEKDEM soruları Excel'den değil **EPİAŞ Şeffaflık Platformu**'ndan cevaplanacak (Tansu'nun kararı). Tasarımda Balbal bu cevaplarda "Canlı veri · EPİAŞ" rozeti ve kaynak linki gösteriyor. Önerilen alan: `AskResponse.live_sources: [{ provider: "EPIAS", dataset, period, url }]`. Mevcut Excel motoru bu veriyi karşılamıyor; veri çekme ve hesap §8.3'te.

---

## 4. Belgeler ve kurumsal hafıza

### 4.1 Belge listesinde dosya türü — **B-13** · HEMEN
**Ürün:** Ürün 1 — Tanıma

`DocumentListItem` ve `DocumentDetail` dosya türünü içermiyor; frontend bir belgenin Excel olup olmadığını anlamak için `inspect` çağırıp 422 alıyor.
- `file_kind: "pdf" | "image" | "xlsx" | "xlsm" | "csv"` alanı eklensin.

### 4.2 Etiket önerisini kim onaylar — **B-12** · ÖNERİLEN KARAR
**Ürün:** Ürün 1 — Tanıma (sınıflandırma; öneriyi AI yapar, insan onaylar)

`metadata-suggestion/apply` ve `reject` yalnızca admin'e açık. Tasarımda belgeyi yükleyen kişi Balbal'ın etiket önerisini kendisi onaylıyor; aksi halde her yükleme admin'i bekler.
- **Önerilen karar:** Yükleyen kişi **veya** belgenin departmanındaki `department_manager` (B-08) onaylayabilir. Bu da P-1'le uyumludur: öneriyi AI yapar, insan onaylar.
- Onay bekleyen öneriler gündeme `kind: "approval"` olarak düşer (§5.1).

### 4.3 İndirme: dosya adı ve tarayıcıda açma — **B-17** · HEMEN
**Ürün:** Ürün 1 — Tanıma

`download_document` şu an `FileResponse(path, filename=path.name)` dönüyor; inen dosyanın adı **`original.pdf`** oluyor.
- `filename` = belge başlığı + uzantı (ör. `Ankara RES Kredi Sözleşmesi.pdf`).
- `?inline=1` ile `Content-Disposition: inline` desteklensin. Arayüzde "Belgeyi aç" inline, "İndir" attachment kullanır.

### 4.4 Genel arama — **B-14** · SIRADA (V1)
**Ürün:** Ürün 1 — Tanıma (bulur)

Üst bardaki arama şu an `/api/documents` ve `/api/projects` listelerini **istemcide** filtreliyor; yalnızca başlık, tür ve muhatapta arıyor.
- `GET /api/search?q=` → retrieval'daki FTS ile **içerikte** de arar. Dönüş: `{ documents: [{…, snippet, page_number}], projects: [...], people: [...] }`. Yetki `allowed_document_ids` (P-2).

### 4.5 Kurumsal hafıza kuralı (BİLGİ — Tansu'nun kararı)
**Ürün:** Ürün 1 toplar (veri grubu 4: yorum ve notlar) · Ürün 2 düzenler ve derler · Ürün 3 hafızadan görüş üretir

- Kurumsal hafızaya **otomatik** giren tek şey: **departmanlar arası görüş talepleri ve cevapları** (§6.2).
- Kişiler arası sohbetler, Balbal soru-cevapları, işlem taslakları (izin, yazışma) **girmez**.
- Personel isterse kendi "bilgi notu"nu belge olarak ilgili klasöre yükler; sistem onu normal belge gibi işler.
- "Her soru-cevabı kaydet" butonu fikri **ertelendi** (kurumsal ortamda her şeyin kaydedilmesi rahatsızlık yaratabilir).

### 4.6 E-posta içerikleri ve sözleşme–e-posta ilişkilendirme — **B-24** · ÖNERİLEN KARAR (sıra)
**Ürün:** Ürün 1 — Tanıma (veri grubu 2: İletişim ve sözleşme)

Süreç haritasına göre Ürün 1, e-posta içeriklerini de ortak veri alanına alır ve **bir sözleşmeyi onunla ilgili e-posta zinciriyle ilişkilendirir**. Backend'de ve bu belgede şimdiye kadar yoktu.
- V0'da kapsam dışı (CLAUDE.md: V0 yalnızca PDF, görsel, Excel/CSV). Ürün 1'in eksik parçası olarak kayda alındı.
- **Önerilen ilk adım:** `.eml` / `.msg` dosyası **elle yükleme** (posta sunucusu entegrasyonu yok). Gönderen, alıcılar, tarih, konu, gövde ve ekler ayrıştırılır; ekler ayrı belge olarak zincire bağlanır.
- İlişkilendirme: `document_links(from_document_id, to_document_id, link_type: "email_about"|"attachment_of"|"amends"|…, created_by: "ai"|user_id, confirmed)` — Balbal bağlantıyı **önerir**, belgenin sahibi onaylar (P-1, B-12 ile aynı mantık).
- Yetki: e-posta da bir belgedir, `allowed_document_ids` kuralına girer (P-2). Kişisel e-posta içeriği için KVKK değerlendirmesi ADR'de yapılır.
- **Sıra sorusu (Tansu):** B-15 Word yüklemeden önce mi, sonra mı?

---

## 5. Ana ekran: gündem ve bildirimler

### 5.1 Gündem — **B-01** · HEMEN (ilk kısım)
**Ürün:** Ürün 2 — Birleştirme (deadline hatırlatma, eksik/bekleyen işleri gösterme)

Ana ekranın en üstündeki "Gündeminiz" kutusu: kişinin takip etmesi gereken **kısa, öncelikli** liste (P-7).
```
GET /api/me/agenda
→ [{ id, kind: "approval"|"opinion_request"|"deadline"|"document_request",
     title, due_date, document_id|null, document_title|null }]
```
Kaynaklar (hepsi yetki süzgecinden geçer, P-2):
1. **Hemen yapılabilir:** `documents.expiration_date` 60 gün içinde dolacak belgeler → `deadline`.
2. **Hemen yapılabilir:** onay bekleyen etiket önerileri → `approval` (kimin göreceği B-12'ye bağlı).
3. Sonra: görüş talepleri (§6.2), evrak talepleri (§6.4), işlem onayları (§8.1), yazışma süreleri (§8.2).
- `document_id` olan her madde `allowed_document_ids` kontrolünden geçer; yetkisiz belgenin **başlığı bile** dönmez.

### 5.2 Bildirimler — **B-02** · SIRADA (V1)
**Ürün:** Ortak altyapı (her ürünün olayları buradan akar)

```
GET  /api/notifications
→ [{ id, kind: "approval"|"opinion_request"|"deadline"|"document_request"|"document_uploaded"|"version_changed",
     text, created_at, read, document_id|null, document_title|null, chat_id|null }]
POST /api/notifications/read-all
```
Olay kaynakları: kullanıcının departmanına belge yüklenmesi, bir belgenin yeni versiyonla değişmesi, onay bekleyen öneri, gelen/cevaplanan görüş talebi, karşılanan evrak talebi, işlem durum değişiklikleri (§8). Arayüz listeyi 60 saniyede bir yeniliyor; push gerekmez.

---

## 6. Departmanlar arası iletişim yöntemleri

Platformda kişiler ve departmanlar arasında **dört iletişim yolu** var. Her biri farklı bir ihtiyaç için; birbirine karıştırılmamalı.

| Yol | Ne için | Kurumsal hafızaya girer mi | Durum |
|---|---|---|---|
| **1. Şirket rehberi** | Kişiyi bulmak | — | HEMEN |
| **2. Departmanlar arası görüş talebi** | Bir departmanın başka bir departmandan resmî görüş istemesi | **Evet** (talep + cevap) | ÖNERİLEN KARAR — önce bu |
| **3. Ekip sohbeti** (kişiler arası, grup; Balbal eklenebilir) | Günlük yazışma | Hayır | KARAR VERİLDİ — Ürün 2 tamamlandıktan sonra |
| **4. Evrak talebi** | Yetkisi olmayan bir belgeye ihtiyaç duyulduğunda | Hayır | ÖNERİLEN KARAR |

### 6.1 Şirket rehberi — **B-05** · HEMEN
**Ürün:** Ürün 1 — Tanıma (departman ve kişi yapısı)

`/api/users` yalnızca admin'e açık. Kişi bulmak ve sohbete eklemek için herkesin görebileceği **dar** bir liste gerekiyor:
```
GET /api/directory?q=&department=
→ [{ id, display_name, title, department_slug, department_name }]
```
- `users.title` alanı eklenmeli (§2.3).
- Şifre özeti, rol, aktiflik, e-posta gibi bilgiler bu uçta **dönmez**.

### 6.2 Departmanlar arası görüş talebi — **B-06 (a)** · ÖNERİLEN KARAR (öncelikli)
**Ürün:** Ürün 2 — Birleştirme (süreç haritasında açıkça Ürün 2)

Bu, Ürün 2'nin çekirdek özelliği: bir departman başka bir departmandan konu, açıklama ve son tarih belirterek görüş ister; cevap gelir; **ikisi birlikte kurumsal hafızaya girer** ve ileride Balbal tarafından bulunabilir.
```
POST /api/opinion-requests  { to_department, subject, body, due_date }
```
- Talep, hedef departmanın gündemine (`opinion_request`) ve bildirimine düşer.
- Cevabı hedef departmanın yetkili kişisi yazar. Balbal cevap **taslağı** önerebilir; gönderen yine insandır (P-1).
- Talebe eklenen belgeler alıcı için indirme anında **yeniden** yetki kontrolünden geçer. Paylaşmak yetki vermez.
- **Önerilen karar:** Önce yalnızca görüş talebi yapılsın; serbest sohbet sonra.

### 6.3 Ekip sohbeti (kişiler arası ve grup) — **B-06 (b)** · SIRADA (Ürün 2 tamamlandıktan sonra)
**Ürün:** Ürün 2 sonrası — **Tansu'nun kararı (28.09.2026):** kişiler arası ve grup sohbeti Ürün 2 tamamlandıktan sonra eklenecek; **Balbal sohbete dahil edilebilecek.**

**Başlama koşulu:** Ürün 2 kalemleri (gündem, bildirim, görüş talebi, işlem talebi iskeleti, yazışma taslağı) tamamlanmış olmalı. O zamana kadar yalnızca ADR ve veri modeli taslağı.

**Balbal sohbette nasıl davranır:**
- Balbal yalnızca kullanıcı onu sohbete **eklediğinde** vardır; kendiliğinden katılmaz, mesajları okumaz.
- Balbal'a sohbette açıkça seslenildiğinde (`@Balbal` veya "Balbal'a sor") cevap verir; diğer mesajlara karışmaz.
- Cevap, **sohbetteki tüm üyelerin ortak görebildiği belgelerle** sınırlıdır (aşağıdaki güvenlik kuralı). Kimin yetkisi daha genişse ona göre genişlemez.
- Balbal sohbette **işlem başlatmaz** (P-1): izin, yazışma vb. taslak yalnızca kişinin kendi Balbal penceresinde, kendisi için hazırlanır.
- Sohbet içeriği, Balbal eklenmiş olsa bile kurumsal hafızaya girmez (§4.5).

```
GET  /api/chats                   → [{ id, kind: direct|group|opinion_request, title, member_ids, includes_balbal,
                                       last_message, updated_at, unread_count, opinion_request: {…}|null }]
POST /api/chats                   { member_ids, title?, include_balbal }
GET  /api/chats/{id}/messages     → [{ id, sender_id|null(=Balbal), sender_name, text, document_id, document_title, created_at, system }]
POST /api/chats/{id}/messages     { text?, document_id? }
POST /api/chats/{id}/members      { member_ids, include_balbal? }
```
**Güvenlik (kritik):**
- Balbal bir grup sohbetine eklendiğinde yalnızca **sohbetteki tüm üyelerin ortak görebildiği** belgelerden (üyelerin `allowed_document_ids` kümelerinin **kesişimi**) cevap verir. Aksi halde yetkisiz üye, yetkili üyenin belgesini Balbal üzerinden okumuş olur.
- Sohbette paylaşılan belge her alıcı için indirme anında yeniden yetki kontrolünden geçer.
- Kişiler arası sohbetler kurumsal hafızaya **girmez** (§4.5).
- İleride Teams entegrasyonu bu yolun alternatifi olabilir.

### 6.4 Yetkisi olmayan belge için evrak talebi — **B-11** · ÖNERİLEN KARAR (güvenlik hassas)
**Ürün:** Ürün 1 — Tanıma (bulur ve **yönlendirir**)

Eski tasarımda Balbal "bu belge Mali İşler'in alanında" deyip "evrak talep et" butonu sunuyordu. **Bu, yetkisiz bir belgenin varlığını ele verir** (P-2 ihlali).
- **Önerilen karar:** Balbal hiçbir zaman belge başlığı, içeriği veya varlığını söylemez. Kaynak bulamadığında yalnızca *"Bu konuda erişiminizde belge yok. İsterseniz başka bir departmandan belge talep edebilirsiniz."* der. **Departmanı kullanıcı seçer**; Balbal önermez.
```
POST /api/document-requests { to_department, description }
```
- Talep hedef departmanın gündemine düşer (`document_request`). Karşılanınca talep edene bildirim gider.

---

## 7. Departman bazlı talepler

Her departman için: **bugün arayüzün backend'den beklediği** + **zihin haritasındaki Ürün 3 yol haritası** (bağlam için; şimdi uygulanmayacak).

### 7.1 Proje Finans
**Ürün:** Ürün 3 — Proje Finans aracı (bu departmanın Ürün 1–2 ihtiyaçları ortak bölümlerde)

**Backend'den beklenen**
- Günlük yatan tutar, ay içi toplam, ertesi ay mahsuplaşma tutarı ve tarihi — proje proje, kesin/tahmini etiketli → **§8.3 (B-21)**.
- Demo belgeler: kredi sözleşmesi + tadiller (versiyon zinciri), ödeme planı Excel'i, sigorta poliçeleri, banka raporlama formları → §9.

**Ürün 3 yol haritası (BİLGİ):** kredi, teminat ve sigorta sürelerini takip; nakit akış raporu; banka sorularına cevap taslağı; EPİAŞ verisini işleme; ödeme ve tahsilat takvimi; kredi dashboard'u (önümüzdeki 6 ayda hangi projenin hangi kredisi var); birikmiş hafızadan sapma görüşü.

### 7.2 Mali İşler (Muhasebe, Finansal Muhasebe)
**Ürün:** Ürün 3 — Mali İşler aracı

**Backend'den beklenen**
- Alt birimlerin eklenmesi (§2.1).
- Finansal Muhasebe ana ekranında da mahsuplaşma bilgisi gösteriliyor → §8.3.
- Demo belgeler: ticaret sicil gazetesi, vergi levhası vb. → §9.

**Ürün 3 yol haritası (BİLGİ):** fatura verisi çıkarma, muhasebe kodu önerisi, cari mutabakat desteği, ödeme talimatı taslağı, banka hareketi eşleştirme, bütçe–fatura eşleştirme, ERP adaptasyonu.

### 7.3 Hukuk
**Ürün:** Ürün 3 — Hukuk aracı (dava/icra süre takibi, hukuki değerlendirme). Gelen yazıdan özet ve olgusal taslak Ürün 2 (§8.2)

**Arayüzde olan:** Hukuk ana sayfasında davalar, Enerji'deki geliştirme projeleri gibi **aşamalı zaman çizelgesi** olarak görünüyor: noktanın üzerine gelince kısa bilgi (aşama, tarih), tıklayınca detay paneli ve belgeler.

**Backend'den beklenen**
1. **Dava dosyası veri modeli** (§8.2'deki `legal_cases` tablosu) ve aşamaları:
   - `legal_cases(id, court, case_no, parties, case_type, status, project_ids)`
   - `legal_case_stages(case_id, stage, date, result, note, document_ids)` — ör. dava açıldı, dilekçeler aşaması (cevap, replik, düplik), ön inceleme, tahkikat, bilirkişi, duruşmalar, karar, istinaf, temyiz, kesinleşme.
   - `GET /api/legal/cases` ve `GET /api/legal/cases/{id}` → zaman çizelgesi için aşamalar, tarihler, bağlı belge id'leri. Yetki: Hukuk departmanı (+ `management`).
   - Aşama listesi dava türüne göre **parametre** tablosunda tutulur (P-8), koda gömülmez.
2. **Gelen yazılar ve dava evrakına cevap / dilekçe taslağı** → **§8.2 (B-23)**. Hukuk için kapsam: dava dilekçesine cevap, ihtarnameye cevap, itiraz; KEP ile gelen resmî yazıların analizi ve cevap taslağı.
3. **Dava ve icra süreleri** gündeme ve bildirime düşer (§8.2 §5 süre takibi).
4. Demo belgeler: dava dosyaları, duruşma tutanakları, bilirkişi raporu, ihtarname, sözleşmeler → §9.

**Ürün 3 yol haritası (BİLGİ):** mevzuat değişikliği takibi (dashboard'a mevzuat güncellemeleri), resmî yazı taslağı, KEP yazı analizi, cevap taslağı, dava ve icra süresi takibi, sözleşme taslağı, dilekçe/ihtarname taslağı.

### 7.4 İdari İşler
**Ürün:** Ürün 3 — İdari İşler aracı

**Backend'den beklenen:** Şimdilik yalnızca demo belgeler (§9). Ana sayfa canvas'ta var; ihtiyaçlar §10'daki analizle çıkarılacak.

**Ürün 3 yol haritası (BİLGİ):** araç, bina, ekipman takibi; bakım, muayene, sigorta hatırlatması; destek hizmeti talepleri; idari satın alma desteği; demirbaş ve zimmet takibi; idari raporlar. (Satın alma/destek talebi eklendiğinde §8.1'deki işlem talebi iskeleti ve P-1 kullanılır.)

### 7.5 İK
**Ürün:** Ürün 3 — İK aracı. İzin formunun hazırlanması ve onay akışı Ürün 2 (§8.1)

**Backend'den beklenen**
- İK departmanının eklenmesi (§2.1).
- **Personel izin talebi** → **§8.1 (B-22)**. Onaylanan izinler İK kuyruğuna düşer; izin belgeleri İK klasörüne girer.
- Demo belgeler: personel yönetmeliği vb. → §9.

**Ürün 3 yol haritası (BİLGİ):** özlük dosyası güncelleme, işe giriş/çıkış işlemleri, puantaj, bordro girdisi, iş ilanı taslağı, oryantasyon planı, İK raporları.

**Erişim notu:** İK verisinde erişim **bireysel**dir (kişi kendi kaydını görür; İK ve onay zinciri ilgili kaydı görür), departman bazlı değildir.

### 7.6 Enerji

#### 7.6.1 Proje Geliştirme — **B-20/7** · ÖNERİLEN KARAR (veri modeli)
**Ürün:** Ürün 3 — Enerji-Proje Geliştirme aracı (izin/ruhsat ve deadline takibi). Adımlardaki belgeler Ürün 1 ile bulunur

**Arayüzde olan:** Her proje için **yatay nokta çizelgesi**. Noktaya tıklayınca önkoşulları ek nokta olarak açılır; tamamlanmış adıma tıklayınca gerçekleşen alt süreçler açılır; üzerine gelince başvuru/sonuç tarihi ve olumsuzsa kısa sebep görünür; tıklayınca belge açılır. Minimum yazı; detay isteyen Balbal'a sorar.

**Backend'den beklenen**
- `permit_steps` — adım tanımı + önkoşullar (adım A bitmeden B başlayamaz) + yasal süre.
- `project_permit_status` — proje × adım: başvuru tarihi, sonuç tarihi, sonuç (olumlu/olumsuz/bekliyor), olumsuzluk sebebi, belge id'leri.
- `GET /api/projects/{id}/permits`.
- Yasal süreler parametre olarak: önlisans 24/36 ay, ÇED başvurusu 90 gün, TEA başvurusu 180 gün (örnek değerler; tablo ile yönetilir).
- Kurumlardan gelen yazılar ilgili adıma bağlanır; olumsuz sonuç yazısı gelince sebep ve tarih adıma işlenir → §8.2 §6.

> **Karışmasın:** Buradaki "izin süreçleri" enerji projelerinin **lisans/ruhsat izinleridir**. §8.1 ise **personel iznidir**. Tablo ve uç adları bilerek farklı (`permit_*` ↔ `requests`, `leave_*`).

**Ürün 3 yol haritası (BİLGİ):** izin/ruhsat ve deadline takibi, proje süreçleri, bütçe sapması raporu, kök neden görüşü.

#### 7.6.2 O&M (İşletme ve Bakım)
**Ürün:** Ürün 3 — Enerji-O&M aracı

**Backend'den beklenen:** demo belgeler (bakım sözleşmesi, arıza tutanakları, yıllık bakım raporu, ÇED izleme yükümlülükleri) → §9.
**Ürün 3 yol haritası (BİLGİ):** bakım takibi, arıza geçmişi, üretim performansı, emre amadelik, kayıp üretim, arıza–üretim kaybı ilişkisi görüşü.

#### 7.6.3 EPC (İnşaat)
**Ürün:** Ürün 3 — Enerji-EPC aracı

**Ürün 3 yol haritası (BİLGİ):** teklif karşılaştırma, milestone takibi, ilerleme raporu, hakediş ve metraj desteği, toplantı tutanağı.

#### 7.6.4 Üretim/Piyasa
**Ürün:** Ürün 3 — Enerji-Piyasa aracı (yıl sonu projeksiyonu yalnızca burada serbest)

**Backend'den beklenen:** birimin eklenmesi (§2.1); EPİAŞ verisi → §8.3.
**Ürün 3 yol haritası (BİLGİ):** üretim, PTF, YEKDEM, uzlaştırma ve gelir verisi; günlük/haftalık/aylık rapor; yıl sonu gelir projeksiyonu; kaynak bazlı üretim tablosu; "hangi projede üretim sapması var, nedeni ne?" sorusuna görüş.

---

## 8. Ortak modüller

### 8.1 İşlem talepleri ve personel izni — **B-22** · ADR ÖNCE
**Ürün:** Ürün 2 — Birleştirme: işlem iskeleti, form taslağı, onay akışı · Ürün 3 — İK: izin bakiyesi türetme, İK kuralları, izin trendi analizi (bkz. §1.5.5/2)

> **P-1 bu bölümün tamamına uygulanır.**

Zihin haritasında bu, Ürün 2'nin tanımındaki örnektir: *"izin talebi → AI form hazırlar → insan onaylar → sistem kaydeder."* İlk işlem türü **yıllık izin**; aynı iskelet ileride masraf, satın alma, avans gibi talepler için kullanılacak.

#### 8.1.1 Kullanıcının gözünden

Personel Balbal'a yazar: *"Yarın yıllık izin kullanacağım."* Balbal:
1. Bunun bir soru değil **işlem talebi** olduğunu anlar (§3.5),
2. Eksik bilgiyi **sohbet içinde** sorar,
3. Bilgi tamamlanınca sohbette bir **izin formu kartı** gösterir,
4. Personel formu kontrol eder, gerekirse düzeltir, **"Onayla ve gönder"**e basar,
5. Form **yöneticinin** onayına düşer,
6. Yönetici onaylayınca onay kayıtlı **izin belgesi** (PDF) oluşur ve **İK klasörüne** girer; İK işler ve kayıt kapanır,
7. Personel her adımda bildirim alır.

#### 8.1.2 Örnek diyalog (hedef davranış)

```
Personel : Yarın yıllık izin kullanacağım.
Balbal   : Anladım, 29.09.2026 Salı için yıllık izin formu hazırlıyorum.
           Tam gün mü, yarım gün mü olacak?
Personel : Tam gün. Aslında perşembeye kadar.
Balbal   : 29.09.2026 Salı – 01.10.2026 Perşembe, 3 iş günü. İşe dönüş: 02.10.2026 Cuma.
           Bu talepten sonra kalan yıllık izniniz 11 gün görünüyor (kaynak: [1] 2026 izin hakkı belgesi,
           [2]–[3] onaylı izin belgeleri).
           İzindeyken size ulaşılacak bir telefon eklemek ister misiniz? (isteğe bağlı)
Personel : Gerek yok.
Balbal   : [İZİN FORMU KARTI]
           Tür: Yıllık izin · 29.09.2026 – 01.10.2026 · 3 iş günü · Dönüş: 02.10.2026
           Onaylayacak yönetici: <yönetici adı>
           [Düzenle]  [Onayla ve gönder]  [Vazgeç]
           Siz onaylamadan bu form kimseye gönderilmez.
```
Kurallar:
- Balbal **"gönderdim"** demez; **"formu hazırladım, onayınızı bekliyor"** der.
- Personel sohbete "onaylıyorum" yazarsa: *"Göndermek için formdaki 'Onayla ve gönder' butonunu kullanın."* Kayıt oluşmaz.
- Tarih ifadeleri için LLM'e **bugünün tarihi ve saat dilimi (Europe/Istanbul)** verilir; LLM ISO tarih önerir, **backend doğrular** (geçmiş tarih, bitiş < başlangıç vb.). **İş günü sayısı ve dönüş tarihini LLM hesaplamaz**, backend hesaplar.

#### 8.1.3 Form alanları

| Alan | Tip | Zorunlu | Kim doldurur | Not |
|---|---|---|---|---|
| `leave_type` | enum | evet | Balbal önerir | V0'da yalnızca `annual`. `excuse` (mazeret), `unpaid` (ücretsiz) enum'da tanımlı ama kapalı. **Rapor/hastalık izni V0'da yok** (özel nitelikli sağlık verisi). |
| `start_date` | date | evet | Balbal önerir | Geçmiş tarih olamaz. |
| `end_date` | date | evet | Balbal önerir | `>= start_date` |
| `half_day` | `none` \| `start_afternoon` \| `end_morning` | evet (varsayılan `none`) | Balbal sorar | |
| `working_days` | ondalık (0,5 adım) | — | **Backend** | Hafta sonu ve `holidays` tablosundaki resmî tatiller düşülür; arife yarım gün. |
| `return_date` | date | — | **Backend** | Bitişten sonraki ilk iş günü. |
| `note` | metin | hayır | Personel | |
| `contact_during_leave` | metin | hayır | Personel | |
| `substitute_user_id` | uuid | hayır | Personel | V0'da yalnızca bilgi; yetki devri yok. |

Zorunlu alanlar tamamlanmadan taslak **oluşturulmaz**; Balbal sormaya devam eder.

#### 8.1.4 Durum makinesi (kod yönetir)

```
            personel onaylar          yönetici onaylar             İK işler
 draft ─────────────────▶ submitted ─────────────────▶ manager_approved ─────────────▶ hr_recorded (son)
   │                        │   │                          │
   │ personel vazgeçer      │   │ yönetici reddeder        │ İK reddeder
   ▼                        │   ▼                          ▼
 cancelled                  │  rejected (son)             rejected (son)
   ▲                        │
   │ 72 saat onaylanmazsa   │ yönetici "düzeltme iste" (yorum zorunlu)
 expired (silinir)          ▼
                     changes_requested ──(personel düzeltir + yeniden onaylar)──▶ submitted
```
- `draft`: **yalnızca talep sahibi** görür. 72 saatte onaylanmazsa `expired`; içerik silinir, denetim kaydında yalnızca "süresi doldu" olayı kalır.
- `submitted`: yöneticinin kuyruğunda. Personel geri çekebilir → `cancelled`.
- `changes_requested`: yönetici/İK formu düzenlemez, yorumla geri gönderir.
- `manager_approved`: onay kayıtlı izin belgesi (PDF) üretilir, İK kuyruğuna düşer. Bu aşamada iptal için V0'da İK'ya bildirim gider, İK `rejected` ile kapatır.
- `hr_recorded`: izin belgesi personelin İK klasörüne eklendi, kayıt kapandı.
- **Kural:** `draft → submitted` yalnızca `POST /api/requests/{id}/approve` ile ve yalnızca `request.owner_id == current_user.id` iken. Başka yol yok.

#### 8.1.5 Kim onaylar

1. `users.manager_id`
2. yoksa personelin ana departmanının `department_manager`'ı (B-08)
3. o da yoksa (ör. genel müdür veya departman yöneticisinin kendisi) İK departmanının `department_manager`'ı
4. hiçbiri yoksa `submitted` olurken `409 approver_not_configured`, admin'e bildirim; Balbal: "Onay mercii tanımlı değil, İK'ya bildirildi."
- Kimse **kendi talebini** onaylayamaz (bir üst basamağa geçilir).
- Vekil yönetici V0'da yok.

#### 8.1.6 İzin bakiyesi ve takvim — Tansu'nun kararına göre

- **Sistem izin bakiyesini ayrı bir sayaç olarak veritabanında tutmaz.** Bakiye, İK klasöründeki belgelerden **türetilir ve kaynağıyla gösterilir**:
  - yıllık izin hakkı belgesi (İK yükler; yıl, hak edilen gün, devreden gün),
  - onaylanmış izin belgeleri (§8.1.4'te `manager_approved`/`hr_recorded` ile oluşan PDF'ler).
- Balbal "kalan izin" sorusunda bu belgeleri **kaynak kartı** olarak gösterir. Bekleyen (`submitted`) talepler ayrıca "onay bekleyen" olarak belirtilir ve sonuç **tahmini** etiketlenir.
- Kıdeme göre otomatik hak hesabı **yok** (V1'de, 4857 sayılı İş Kanunu md. 53 İK ile doğrulanarak).
- Bakiye yetersizse taslak yine oluşturulabilir; personel bilgilendirilir; karar yönetici ve İK'dadır.
- `holidays(date, name, half_day)` — admin yükler. Dini bayram tarihleri her yıl değiştiği için koda gömülmez.
- Aynı personelin tarihleri çakışan açık talebi varsa taslak oluşmaz; Balbal bunu söyler.

#### 8.1.7 Uçlar

```
POST  /api/requests/draft                  { conversation_id, kind: "annual_leave", fields }  ← yalnızca Balbal akışı
GET   /api/requests/mine                   → kendi talepleri
GET   /api/requests/{id}                   → talep sahibi, onay zincirindeki yönetici, İK
PATCH /api/requests/{id}                   { fields }  ← yalnızca talep sahibi; yalnızca draft / changes_requested
POST  /api/requests/{id}/approve           ← yalnızca talep sahibi (P-1)
POST  /api/requests/{id}/cancel            ← yalnızca talep sahibi
GET   /api/requests/inbox                  → yöneticinin / İK'nın kendi kuyruğu
POST  /api/requests/{id}/manager-decision  { decision: "approve"|"reject"|"request_changes", comment }
POST  /api/requests/{id}/hr-decision       { decision: "record"|"reject", comment }
GET   /api/me/leave-balance                → { year, entitled, carried_over, used, pending, remaining_estimated,
                                               source_document_ids: [...] }   ← belgelerden türetilir
GET   /api/holidays?year=
```
Sözleşme tipleri `proposed.ts` **§8**'de. Yönetici ve İK kuyruğu gündeme (`approval`), her durum değişikliği bildirime düşer.

#### 8.1.8 Veri modeli (öneri)

```
requests(id, kind, owner_id, status, fields jsonb, approver_id, created_at, updated_at,
         submitted_at, decided_at, expires_at, result_document_id)
request_events(id, request_id, actor_id, from_status, to_status, comment, created_at)   ← denetim
holidays(date, name, half_day)
users.manager_id
```
`requests` genel tutulur (`kind`), çünkü masraf, satın alma vb. aynı tabloya ve aynı durum makinesi iskeletine girecek. `result_document_id` = onay kayıtlı izin belgesi.

#### 8.1.9 KVKK

- Görebilenler: talep sahibi, onay zincirindeki yönetici(ler), İK. `management` dahil **başka kimse** görmez.
- İzin talepleri retrieval'a, kurumsal hafızaya, Balbal'ın bilgi tabanına **girmez**. İzin **belgeleri** İK klasöründe bireysel erişimle durur; Balbal onları yalnızca belgenin sahibine ve İK'ya kaynak olarak gösterebilir. Balbal "Ahmet ne zaman izinde?" sorusuna cevap vermez.
- `expired`/`cancelled` taslakların içeriği silinir. Kapanmış kayıtlar için saklama süresi parametre (`leave_retention_years`); varsayılan boş = silinmez; süreyi İK ve hukuk belirler.

#### 8.1.10 Arayüz

Tansu tarafı yapar; önce canvas'ta tasarlanır (sohbette form kartı, "Taleplerim", yönetici/İK "Onay kuyruğu"). Backend frontend'e dokunmaz.

#### 8.1.11 Başlama koşulu

Kod, **ancak** şunlar tamamlanınca: B-03 çok turlu sohbet · B-08 `department_manager` ve B-09 ana departman · B-01 gündem ve B-02 bildirim · İK departmanı (§2.1) · bu bölüme dayanan **ADR**'nin Tansu tarafından onaylanması. O zamana kadar: yalnızca ADR + migration taslağı + test listesi.

#### 8.1.12 Kabul testleri

1. Personel onayı olmadan `submitted` olunamaz (P-1a).
2. Yönetici, İK, admin veya servis hesabı personel adına `approve` → 403 (P-1b).
3. `changes_requested` sonrası personel yeniden onaylamadan yönetici kuyruğuna düşmez (P-1c).
4. `draft` başka kullanıcının hiçbir listesinde görünmez (P-1d).
5. Sohbette "onaylıyorum" yazmak durum değiştirmez.
6. İş günü hesabı: hafta sonu, resmî tatil, arife yarım günü doğru (en az 5 senaryo).
7. Çakışan tarih → taslak oluşmaz.
8. Onay mercii zinciri her basamakta doğru (manager_id → department_manager → İK yöneticisi → 409).
9. Kimse kendi talebini onaylayamaz.
10. İzin talepleri retrieval sonuçlarında çıkmaz; başkasının izin belgesi Balbal'da görünmez.
11. 72 saat sonra `draft` → `expired`, içerik silinir.
12. Bakiye cevabı her zaman kaynak belgelerle döner; kaynaksız bakiye dönmez.

#### 8.1.13 Kapsam dışı (V0)

Vekile yetki devri, kıdemden otomatik hak hesabı, rapor/hastalık izni, geriye dönük izin girişi, e-imza, dış İK/bordro sistemine aktarım, ekip izin takvimi.

---

### 8.2 Resmî yazışma ve dilekçe taslağı (Hukuk + Enerji-Geliştirme) — **B-23** · ADR ÖNCE
**Ürün:** Ürün 2 — Birleştirme: özet, süre, olgusal taslak · Ürün 3 — Hukuk / Enerji-Geliştirme: hukuki gerekçe, savunma, risk değerlendirmesi (bkz. §1.5.5/3)

> **P-1 bu bölümün tamamına uygulanır.** Balbal yalnızca taslak yazar. Hiçbir yazı, dilekçe veya cevap sistemden **gönderilmez**: KEP ile otomatik cevap yok, UYAP'a otomatik yükleme yok, e-posta yok.

#### 8.2.1 Kapsam

- **Hukuk:** açılan davalara **cevap dilekçesi**, gelen ihtarnameye **cevap**, **itiraz** dilekçesi.
- **Enerji / Proje Geliştirme:** kurumlardan (EPDK, ETKB/YEGM, TEİAŞ, MSB, Çevre ve Şehircilik/ÇED, belediye, tapu, valilik vb.) gelen resmî yazılara **cevap yazısı**: ek bilgi/belge talebine cevap, olumsuz sonuç yazısına itiraz veya açıklama.
- "KEP" = **Kayıtlı Elektronik Posta**; resmî yazılar KEP ile gelir.

#### 8.2.2 Akış (iki adımlı: özet onayı olmadan taslak yazılmaz)

1. Kullanıcı gelen yazıyı / dava evrakını yükler (V0: PDF elle yükleme).
2. Balbal **özet** çıkarır: gönderen kurum/mahkeme · tarih · sayı · konu · ilgi · istenen işlem · istenen belgeler · süre önerisi · ilgili proje(ler).
3. Kullanıcı özeti düzeltir ve **onaylar**. Tebliğ tarihini kullanıcı girer; süre ve proje eşleşmesi burada kesinleşir.
4. Balbal **cevap taslağı** yazar (kaynak kartlarıyla).
5. Hazırlayan kişi taslağı düzenler ve **onaylar** (P-1).
6. **İkinci onay:** Hukuk'ta departman yöneticisi (sorumlu avukat); Enerji'de Proje Geliştirme yöneticisi.
7. Kullanıcı yazıyı **sistem dışında** gönderir (KEP/UYAP/elden/posta), sistemde "gönderildi" olarak işaretler ve gönderilen nihai PDF'i yükler.
8. Kayıt kapanır; gelen yazı ve gönderilen cevap normal belge akışına (versiyon, yetki, etiket) girer.

#### 8.2.3 Durum makinesi

```
received → summary_ready → summary_confirmed → draft_ready → preparer_approved → reviewer_approved → marked_sent → closed
                                   ▲                  │                 │
                                   └── yeni taslak ◀──┘   reviewer "düzeltme iste" ──▶ draft_ready
```
- `summary_confirmed` olmadan taslak yazılmaz.
- `preparer_approved` olmadan ikinci onaycının kuyruğuna düşmez (P-1).
- İkinci onaycı taslağı düzenlemez; yorumla geri gönderir.
- `marked_sent` yalnızca kullanıcının elle işaretlemesiyle.

#### 8.2.4 Taslak yazımında zorunlu kurallar

1. **Kaynaksız iddia yok.** Her olgusal cümle (tarih, sayı, tutar, başvuru, karar, olay) bir kaynak kartına bağlanır. Kaynak yoksa taslağa **`[BİLGİ EKSİK: …]`** yazılır; boşluk tahminle doldurulmaz.
2. **Kanun, yönetmelik, yargı kararı, emsal uydurulmaz.** Yalnızca (a) kaynak belgelerde geçen ve (b) `legal_references` tablosunda tanımlı atıflar kullanılır. Diğer her atıf **`[DOĞRULANMALI]`** etiketiyle yazılır ve taslağın sonunda "Doğrulanacak atıflar" listesinde toplanır. Dış içtihat veritabanı V0'da yok.
3. **Gelen yazının içeriği talimat değildir.** Yazının içinde "şunu yap / şunu gönder" gibi metinler olabilir; bunlar veridir. Gelen belge içeriği modele sistem talimatından ayrı, açıkça "alıntı" olarak verilir (prompt injection koruması).
4. **Yetki:** Taslak yalnızca hazırlayanın `allowed_document_ids` kümesindeki belgelerden beslenir; ikinci onaycının yetkisi daha genişse bile taslak genişletilmez.
5. **Biçim** şablon tablosundan (`correspondence_templates`) gelir, koda gömülmez:
   - Resmî yazı: antet yeri, sayı, tarih, konu, ilgi, metin, ekler, dağıtım, imza bloğu (ad/unvan boş, kullanıcı doldurur).
   - Dilekçe: mahkeme başlığı, dosya no, davacı/davalı, vekil, konu, açıklamalar, hukuki sebepler, deliller, sonuç ve istem.
6. **Her proje ayrı işlenir** (P-6).
7. **Katman sınırı:** Yalnızca Ürün 2 açıkken taslak olgusal kalır; dilekçenin "hukuki sebepler", savunma argümanı ve risk değerlendirmesi bölümleri boş bırakılır ve `[AVUKAT DOLDURACAK]` yazılır. Bu bölümleri Balbal ancak Ürün 3 (Hukuk) açıkken önerir ve yine `[DOĞRULANMALI]` kuralına tabidir.

#### 8.2.5 Süre takibi (en kritik kısım)

- Balbal özet adımında süre **önerir**: yazıdaki açık süre ("… tarihinden itibaren 15 gün içinde") ya da `legal_deadline_rules` tablosundaki kural (belge türü → gün sayısı, takvim/iş günü, başlangıç = tebliğ tarihi, kaynak).
- **Tebliğ tarihi LLM'e tahmin ettirilmez;** kullanıcı girer.
- Süre `summary_confirmed` ile kesinleşir, gündeme (`deadline`) düşer; son 7, 3 ve 1 gün kala bildirim gider.
- `legal_deadline_rules` tablosunu Hukuk departmanı yöneticisi doldurur ve onaylar. Örnek başlangıç satırları (**hukuk birimi doğrulamadan kullanılmaz**): HMK cevap dilekçesi — tebliğden itibaren 2 hafta; İYUK savunma — tebliğden itibaren 30 gün. Kuralı olmayan belge türünde süre boş kalır, kullanıcıdan istenir.
- Aynı mekanizma dava aşamalarında ve icra takiplerinde de kullanılır (§7.3).

#### 8.2.6 Enerji-Geliştirme bağlantısı

- Gelen kurum yazısı ilgili projenin izin adımına bağlanır (§7.6.1).
- Olumsuz sonuç yazısında, özet onaylanınca adıma **sonuç = olumsuz, sonuç tarihi, sebep** işlenir (nokta çizelgesi bunu gösterir).
- İtiraz/cevap taslağı o adımın başvuru belgelerinden ve kurum yazısından beslenir.

#### 8.2.7 Uçlar

```
POST  /api/correspondence                       { document_id, department: "hukuk"|"enerji", kind: "incoming_letter"|"lawsuit"|"notice" }
GET   /api/correspondence?status=&department=
GET   /api/correspondence/{id}
POST  /api/correspondence/{id}/summary          → Balbal özet üretir
PATCH /api/correspondence/{id}/summary          { fields }
POST  /api/correspondence/{id}/summary/confirm  { service_date, deadline_date, project_ids }
POST  /api/correspondence/{id}/drafts           { instructions? }
PATCH /api/correspondence/{id}/drafts/{v}       { body }      ← yalnızca hazırlayan
POST  /api/correspondence/{id}/drafts/{v}/approve              ← yalnızca hazırlayan (P-1)
POST  /api/correspondence/{id}/review           { decision: "approve"|"request_changes", comment }  ← ikinci onaycı
POST  /api/correspondence/{id}/mark-sent        { sent_at, channel: "KEP"|"UYAP"|"elden"|"posta", sent_document_id }
```
Sözleşme tipleri `proposed.ts` **§9**'da.

#### 8.2.8 Veri modeli (öneri)

```
correspondence(id, department, kind, incoming_document_id, owner_id, reviewer_id, status,
               summary jsonb, service_date, deadline_date, project_ids uuid[], legal_case_id, created_at, …)
correspondence_drafts(id, correspondence_id, version, body, source_cards jsonb,
                      unverified_references jsonb, missing_info jsonb, created_by, created_at)
correspondence_events(id, correspondence_id, actor_id, from_status, to_status, comment, created_at)
legal_cases(...), legal_case_stages(...)          ← §7.3
legal_deadline_rules(id, doc_type, days, day_type: "calendar"|"business", starts_from, source, approved_by)
legal_references(id, code, article, title, text_excerpt, approved_by)
correspondence_templates(id, kind, body_template)
```

#### 8.2.9 Gizlilik

- Gelen yazı, dava evrakı ve taslaklar **`restricted`**; yalnızca ilgili departman ve onay zinciri görür.
- Yetkisiz kullanıcıya kaydın **varlığı bile** gösterilmez (P-2).
- Taslaklar retrieval'a ve kurumsal hafızaya girmez; yalnızca `marked_sent` sonrasında gelen yazı ve gönderilen nihai cevap belge olarak girer.

#### 8.2.10 Çıktı biçimi

V0'da arayüzde metin + "kopyala". **V1'in ilk işi Word (.docx) dışa aktarma**; dilekçe ve resmî yazıda kullanıcı Word ister.

#### 8.2.11 Başlama koşulu

B-08 `department_manager` · B-01 gündem · B-02 bildirim · §9'daki dava ve kurum yazısı demo belgeleri · §7.6.1 izin adımları veri modeli · §7.3 dava veri modeli · bu bölüme dayanan **ADR**'nin onayı. O zamana kadar yalnızca ADR + migration taslağı + test listesi.

#### 8.2.12 Kabul testleri

1. `summary_confirmed` olmadan taslak üretilemez.
2. Hazırlayan onayı olmadan ikinci onaycı kuyruğuna düşmez; başkası adına onay → 403.
3. Kaynaksız olgusal cümle `[BİLGİ EKSİK]` olarak çıkar (eval seti ile).
4. `legal_references` dışındaki her atıf `[DOĞRULANMALI]` etiketli ve listede.
5. Gelen yazıya gömülü talimat hiçbir durum geçişi veya gönderim tetiklemez.
6. Sistemde KEP/UYAP/e-posta gönderen hiçbir kod yolu yoktur.
7. Yetkisiz kullanıcı listelerde, aramada, Balbal'da kaydın varlığını göremez.
8. Süre `legal_deadline_rules` ve tebliğ tarihinden deterministik hesaplanır; gündeme ve bildirime düşer.

#### 8.2.13 Kapsam dışı (V0)

KEP kutusundan otomatik çekme (V2, KEP sağlayıcı API'si), UYAP entegrasyonu, dış içtihat veritabanı, e-imza, sistemden gönderim (hiçbir sürümde planlanmıyor).

---

### 8.3 EPİAŞ verisi ve günlük tahsilat / aylık mahsuplaşma hesabı — **B-21** · BEKLEMEDE
**Ürün:** Ürün 3 — Proje Finans ve Enerji-Piyasa aracı (tahmini değer içerir). Ay kapandıktan sonra kesin veriyle yapılan hesap Ürün 2 aritmetiğidir (bkz. §1.5.5/1)

Ana ekrandaki "günlük yatan tutar" ve "mahsuplaşmada yatacak tutar" hesabı. Formül, veri modeli, uçlar ve test örnekleri Tansu ile ayrı bir çalışmada, **gerçek faturayla doğrulanmış referans Excel'den** çıkarıldı. **Tam metin bu belgeye ayrı bir commit ile eklenecek.**

Değişmeyecek kararlar:
- Hesap **backend'de**. Frontend yalnızca gösterir; tarayıcıdan EPİAŞ'a bağlanılmaz; EPİAŞ şifresi yalnızca ortam değişkeninde.
- Her proje ayrı hesaplanır ve döner; konsolide toplam dönülmez (P-6).
- Oranlar (avans oranı, yönetim bedeli, KDV, YEK payı vb.) koda gömülmez; proje bazlı, **geçerlilik tarihli** parametre tablosunda (P-8).
- Public repo: gerçek oranlar, toplayıcı adı, gerçek EPİAŞ kimlikleri yazılmaz; testlerde kurgusal değerler (P-9).
- Kullanılacak yerler: Proje Finans ve Mali İşler > Finansal Muhasebe ana ekranı; Balbal'ın EPİAŞ cevapları (§3.7).

- **Katman ayrımı (§1.5.5/1):** Tahmini değer üreten her parça (UEVM gelmeden gerçek zamanlı üretimle hesap, oranla tahmini KGÜP, tahmini KÜPST, gelecek ödeme öngörüsü) Ürün 3'tür. Kapanmış ayın kesin verisiyle yapılan mahsuplaşma aritmetiği Ürün 2'dir. Tam metin bu ayrımla yazılacak; P3 kapalıysa yalnızca kesin değerler döner.

**Talimat:** Tam metin eklenmeden B-21 için kod yazma, tablo açma, EPİAŞ istemcisi kurma.

---

## 9. Demo veri seti — **B-18** · HEMEN (öncelikli)
**Ürün:** Ortak altyapı (üç ürünün de testi bu veriyle yapılır)

Sunucudaki örnek belgeler **profesyonel** olmalı ve **arayüzdeki her süreci** kapsamalı. Hedef: `seed` komutuyla yüklenen belgelerle her ekran "Backend bekleniyor" kutusu olmadan gerçek veriyle dolsun.

### 9.1 Kapsanacak belgeler

| Departman | Belgeler |
|---|---|
| **Enerji — Geliştirme** | ölçüm raporu, önlisans başvurusu ve kararı, YEGM teknik uygunluk, TEİAŞ bağlantı görüşü, tapu/kira, MSB askeri yazı, TEA başvurusu ve sonuç yazısı (olumsuzsa gerekçesiyle), ÇED başvurusu/ek bilgi/karar, jeoteknik etüt, kurum görüşleri, bağlantıya çağrı mektubu, imar, kati proje, yapı ruhsatı, lisans. **Her belgede** başvuru tarihi, sonuç tarihi, sonuç ve olumsuzsa sebep yazmalı (nokta çizelgesi bunları gösteriyor). |
| **Enerji — O&M** | bakım sözleşmesi, arıza tutanakları, yıllık bakım raporu, ÇED izleme yükümlülükleri |
| **Proje Finans** | kredi sözleşmesi + tadiller (versiyon zinciri), ödeme planı Excel'i, sigorta poliçeleri, banka raporlama formları |
| **Hukuk** | dava dosyaları (her biri aşamalarıyla, §7.3), duruşma tutanakları, bilirkişi raporu, ihtarname, sözleşmeler, en az bir KEP ile gelmiş kurum yazısı |
| **Mali İşler / İdari İşler / İK** | her birinden birkaç temel belge (ticaret sicil gazetesi, vergi levhası, personel yönetmeliği vb.). İK için ayrıca kurgusal **yıllık izin hakkı belgesi** ve birkaç **onaylı izin belgesi** (§8.1.6 bakiye türetme testi için). |

### 9.2 Profesyonel seviye — nasıl hazırlanmalı

- **Önce webde araştır:** gerçek bir idareden (EPDK, ETKB/YEGM, TEİAŞ, MSB, Çevre Bakanlığı, belediye, tapu) gelen resmî yazı nasıl görünür (antet, sayı, konu, ilgi, dağıtım, imza bloğu, ekler); kredi, bakım, kira sözleşmesi nasıl yapılandırılır (madde numaralandırma, tanımlar, teminatlar, fesih, ekler); dilekçe ve ihtarname nasıl yazılır. Belgeleri bu formatlara göre üret.
- İçerik **kurgusal** (P-9): gerçek kurum logosu, gerçek kişi adı, gerçek belge numarası yok.
- **Excel dosyaları mutlaka olmalı ve orta karmaşıklıkta** olmalı (Proje Finans ve Enerji ekranlarında Excel testi çok önemli):
  - Proje Finans: kredi ödeme planı (dönem, anapara, faiz, bakiye, döviz; formüllü), aylık nakit akış tablosu (birden çok sayfa), DSCR hesabı (tadil öncesi 1,25x / sonrası 1,20x eşiği), banka raporlama formu (Annex tipi).
  - Enerji: santral bazlı aylık üretim ve kapasite faktörü, bakım maliyet takibi (bütçe/gerçekleşen), izin süreçleri takip tablosu (başvuru/sonuç tarihleri, durum).
  - Birden çok sayfa, formül, birleştirilmiş başlık, tarih ve para formatları; **her proje ayrı** (konsolide yok, P-6).
- **Projeler — karar (Tansu, 28.09.2026):** şimdilik **2 proje**, mevcut adlarıyla: Ankara RES (işletme) ve İzmir RES (geliştirme). Canvas'taki 7 proje adı (işletmede Karatepe, Yeşilova, Boztepe, Güneşalan; geliştirmede Kızılova, Akyar, Demirci) ertelendi; bu dönemde demo verinin canvas'tan farklı proje adı taşıması sapma sayılmaz.

### 9.3 Kurgu şirket: 15 kişilik personel ve tamamen kurgusal sözleşmeler (Tansu'nun kararı, 28.09.2026)

**Ortak alanda belge türetmek (B-18) backend'in öncelikli işidir.** Bu bölüm B-18'in parçasıdır.

**Neden:** Arayüz kişiye göre açılır: kullanıcı şifresini girer girmez kendi departmanının sayfasına gider (P-5). Ürün 1, ayrı bir ana sayfa değil, bu departman sayfasının kısıtlı (yalnızca Ürün 1 yetenekleri açık) halidir. Personel hiyerarşisi için daha detaylı bir arayüz tasarlanacak. Bunun için önce kurgu şirketin **kim kimdir** bilgisi backend'de netleşmeli. **Backend kurguyu çıkarır, Tansu tarafı canvas'ı ve arayüzü ona göre tasarlar/değiştirir.** Canvas'taki bugünkü isimler (kişi, şirket, banka) geçicidir; tek kaynak backend'in ledger'ı olacak.

#### 9.3.1 15 kişilik personel listesi

- Her kişi için: **ad soyad** (kurgusal), **unvan**, **departman** ve varsa **alt birim**, **yöneticisi** (kime bağlı), **rol** (`employee` / `management`), **kullanıcı adı**.
- Kayıt yeri: ledger (`seed_data/master/company.yaml` içinde ayrı bir `personnel` bölümü veya yeni bir `personnel.yaml`). Tek kaynak orası; seed kullanıcıları buradan üretir.
- Her kişi sisteme giriş yapabilen bir demo kullanıcıdır. Bugünkü `yonetim`, `finans`, `hukuk`, `enerji` gibi departman adıyla açılmış hesapların yerini alır (sistem yöneticisi `admin` hesabı bu 15 kişiye dahil değildir).
- `users.title` ve `users.manager_id` (§2.3) bu listeden doldurulur; ana departman (B-09) da buradan gelir.
- Departman yapısı §2.1 ile birebir; **her departmanda ve her alt birimde en az bir kişi** olmalı.
- **Önerilen dağılım** (farklı önerin varsa §1.7.1'e göre sor):

| Departman / alt birim | Kişi | Önerilen unvanlar |
|---|---|---|
| Yönetim | 1 | Genel Müdür (`management`) |
| Proje Finans | 2 | Proje Finans Müdürü, Proje Finans Uzmanı |
| Mali İşler | 3 | Mali İşler Müdürü; Muhasebe Uzmanı (Muhasebe); Finansal Muhasebe Uzmanı (Finansal Muhasebe) |
| Hukuk | 2 | Hukuk Müdürü, Avukat |
| İdari İşler | 1 | İdari İşler Sorumlusu |
| İK | 1 | İK Uzmanı |
| Enerji | 5 | Enerji Grubu Müdürü; Proje Geliştirme Uzmanı; O&M Mühendisi; EPC Proje Mühendisi; Üretim/Piyasa Uzmanı |
| **Toplam** | **15** | |

- Müdürlerin kendi departmanlarının kısıtlı belgelerini görmesi B-08'e (departman yöneticisi rolü, **ÖNERİLEN KARAR**) bağlıdır. Karar gelene kadar müdürler `employee` rolüyle, unvan ve `manager_id` bilgisiyle açılır.
- Adlar tamamen kurgusal; gerçek bir kişiyle eşleşmemeli (P-9).

#### 9.3.2 Sözleşmeler ve belgeler tamamen kurguya geçer

- Şirketteki **bütün sözleşmeler ve belgeler** kurgusal olmalı: şirket adı, SPV'ler, bankalar, sigorta, EPC yüklenicisi, danışmanlar, imza yetkilileri, tutarlar, oranlar, belge numaraları.
- Belgelerdeki kişiler (imzacı, yazışan, hazırlayan) **9.3.1'deki 15 kişiden** seçilir; şirket içi hiçbir belgede listede olmayan bir çalışan adı geçmez.
- **Şirket adı tek olmalı.** Bugün ledger'da "ABC Enerji A.Ş." (ve SPV'ler), canvas'ta "NATA Enerji A.Ş." geçiyor. Backend kurgu şirket adını belirler; canvas buna göre değiştirilir.
- Gerçek kamu kurumları (EPDK, TEİAŞ, bakanlıklar, mahkemeler) süreç bağlamında geçebilir (mevcut ledger kuralı); özel şirket ve bankalar kurgusal olur.
- Projeler: §9.2'deki karar geçerli (şimdilik 2 proje, mevcut adlarıyla).

#### 9.3.3 Tansu tarafına teslim

Liste ve kurgu şirket künyesi (şirket adı, SPV'ler, karşı taraflar) ledger'a yazılınca **ilk özette haber ver**; Tansu tarafı backend reposunu salt okuma ile okuyup canvas'ı ve arayüzü (personel hiyerarşisi ekranları, kullanıcı menüsü, üst bar, belge örnekleri) buna göre tasarlar. Liste, belge üretiminden **önce** paylaşılırsa tasarım ve belge üretimi paralel yürür.

---

## 10. Naci'den beklenen analiz — **B-19** · HEMEN
**Ürün:** Ortak altyapı. Tersine listede her yeteneğin hangi ürüne ait olduğunu da yaz

1. `ftansu/AI-BalBal` frontend'ini ve Claude Design canvas'ını ("X Platformu — Ana Sayfa", v165) incele. Backend'de karşılığı olmayan her ekran/alan için eksiği tespit et ve (bu belgede karar verilmiş olanları) tamamla. Bu belgedeki maddelerle sınırlı değil.
2. **Tersine liste:** Backend'inde olup arayüzde **olmayan** her yeteneği yaz: uç, ne yaptığı, örnek istek/cevap, hangi ekranda kullanılmasını önerdiğin. Arayüzü buna göre tamamlayacağız.
3. Canvas'ta olup bu belgede **hiç geçmeyen** bir ihtiyaç bulursan (özellikle Mali İşler, İdari İşler, İK ana sayfaları) önce listele, Tansu'ya sor; kendin karar verme.

---

## 11. Ertelenen ve kapsam dışı işler

| Kod | Konu | Durum |
|---|---|---|
| B-15 | Word (.docx) **yükleme** | V0 dışı ama **Ürün 1'in çekirdek veri türü** (§1.5.5/4). Sıradaki Ürün 1 genişletmesinin ilk işi. |
| B-24 | E-posta içerikleri, sözleşme–e-posta ilişkilendirme | Ürün 1 eksiği; V0 dışı (§4.6). |
| — | **Dışa aktarma** (Excel/Word/PDF rapor, şablon doldurma) | Ertelendi. **Ürün 2'nin çekirdek yeteneği** (şablon tabanlı raporlama); bu yapılmadan Ürün 2 tamamlanmış sayılmaz. İlk öncelik: yazışma/dilekçe taslağının Word çıktısı (§8.2.10). |
| — | "Her soru-cevabı kurumsal hafızaya kaydet" butonu | Ertelendi (§4.5). |
| — | KEP otomatik çekme, UYAP, e-imza | Ertelendi (§8.2.13). |
| — | Kıdemden otomatik izin hakkı, vekalet, rapor izni | Ertelendi (§8.1.13). |
| — | Teams entegrasyonu | Ekip sohbetine alternatif olarak ileride (§6.3). |
| — | ERP adaptasyonu (Mali İşler) | Ürün 3 yol haritası (§7.2). |

---

## 12. Yol haritası ve öncelik sırası

Sıra **ürün katmanına göre** kurulur (§1.5): önce ortak altyapı ve **Ürün 1 (belkemiği)** tamamlanır, sonra Ürün 2, en son Ürün 3. Aynı katmanda küçük işler önce.

> **Frontend'i backend'e bağlamak için gereken asgari set: B-25, B-20 (1–5) + B-09 ve B-18.** Uygulama planı, backend'in bugünkü durumu, kabul testleri ve bağlantı günü kontrol listesi: [`BAGLANTI_YOL_HARITASI.md`](BAGLANTI_YOL_HARITASI.md). Bu üçü bitmeden frontend–backend bağlantı testi yapılmaz.

| Sıra | Ürün | Kod | Konu | Bölüm | Etiket |
|---|---|---|---|---|---|
| 1 | Ortak | B-18 | Demo veri seti | §9 | HEMEN |
| 1 | Ortak | B-19 | Arayüz incelemesi + tersine liste (ürün etiketli) | §10 | HEMEN |
| 1 | Ortak | B-25 | Ürün katmanı anahtarı | §1.5.4 | HEMEN (karar verildi) |
| 2 | Ürün 1 | B-20 (1–5) | Departman yapısını zihin haritasına uyarla | §2.1 | HEMEN |
| 2 | Ürün 1 | B-09 | Ana departman | §2.2 | HEMEN (B-08 ile) |
| 2 | Ürün 1 | B-08 | Departman yöneticisi rolü | §2.4 | ÖNERİLEN KARAR |
| 2 | Ürün 1 | B-10 | Belgenin çok departmanla paylaşımı | §2.5 | B-26 ile karşılanır |
| 2 | Ürün 1 | B-26 | Klasör yapısı ve departman erişim yetkileri (sistem yöneticisi sayfası) | §2.6 | KARAR VERİLDİ (kısa ADR) |
| 3 | Ürün 1 | B-07 | Kaynak kartında versiyon id'leri | §3.6 | HEMEN |
| 3 | Ürün 1 | B-04 | Cevap kimliği + geri bildirim | §3.4 | HEMEN |
| 3 | Ürün 1 | B-13 | Dosya türü alanı | §4.1 | HEMEN |
| 3 | Ürün 1 | B-17 | İndirme adı + tarayıcıda açma | §4.3 | HEMEN |
| 3 | Ürün 1 | B-20/6 | Tek sohbette çok proje | §3.3 | HEMEN |
| 3 | Ürün 1 | B-05 | Şirket rehberi + `users.title` | §6.1 | HEMEN |
| 4 | Ürün 1 | B-03 | Sohbet geçmişi + çok turlu soru | §3.2 | ÖNERİLEN KARAR |
| 4 | Ürün 1 | B-12 | Etiket önerisi onayı | §4.2 | ÖNERİLEN KARAR |
| 4 | Ürün 1 | B-11 | Evrak talebi (varlık ele vermeden) | §6.4 | ÖNERİLEN KARAR |
| 4 | Ürün 1 | B-14 | Genel arama | §4.4 | SIRADA |
| 4 | Ürün 1 | B-15 | Word yükleme | §11 | ÖNERİLEN KARAR (sıra) |
| 4 | Ürün 1 | B-24 | E-posta, sözleşme–e-posta ilişkilendirme | §4.6 | ÖNERİLEN KARAR (sıra) |
| 5 | Ortak | B-02 | Bildirimler | §5.2 | SIRADA |
| 5 | Ürün 2 | B-01 | Gündem (ilk kısım: süre dolacak belgeler, bekleyen onaylar) | §5.1 | HEMEN |
| 5 | Ürün 2 | B-06a | Departmanlar arası görüş talebi | §6.2 | ÖNERİLEN KARAR |
| 6 | Ürün 2 | B-22 | İşlem talebi iskeleti + izin formu | §8.1 | ADR ÖNCE |
| 6 | Ürün 2 | B-23 | Yazışma: özet, süre, olgusal taslak | §8.2 | ADR ÖNCE |
| 6 | Ürün 2 | — | Şablon tabanlı dışa aktarma (Word/Excel) | §11 | ertelendi — Ürün 2'nin çekirdeği |
| 7 | Ürün 3 | B-20/7 | Enerji izin/ruhsat adımları | §7.6.1 | ÖNERİLEN KARAR |
| 7 | Ürün 3 | — | Hukuk dava veri modeli, dava/icra süre takibi | §7.3 | ADR ÖNCE (B-23 ile) |
| 7 | Ürün 3 | B-22 (İK kısmı) | İzin bakiyesi türetme, İK kuralları | §8.1.6 | ADR ÖNCE |
| 7 | Ürün 3 | B-23 (hukuk kısmı) | Hukuki gerekçe ve savunma önerisi | §8.2.4/7 | ADR ÖNCE |
| 8 | Ürün 3 | B-21 | EPİAŞ + mahsuplaşma | §8.3 | BEKLEMEDE |
| 8 | Ürün 3 | B-16 | EPİAŞ canlı kaynak alanı | §3.7 | BİLGİ |
| 9 | Ürün 2 sonrası | B-06b | Ekip sohbeti (Balbal dahil edilebilir) | §6.3 | SIRADA (Ürün 2 bitince) |

---

## 13. Naci'nin yapay zekasına hazır istem

> `docs/BACKEND_GAPS.md` dosyasını (ftansu/AI-BalBal) baştan sona oku. Önce **§1.2 Değişmez ilkeler**'i ve **§1.5 Ürün katmanları**'nı oku. §1.5 projenin belkemiğidir: her özellik Ürün 1 (Tanıma), Ürün 2 (Birleştirme) ya da Ürün 3 (Yorumlama) katmanına aittir; her başlığın altında **"Ürün:"** satırı var. Ürün 1'de yorum, Ürün 2'de tahmin/projeksiyon **yasak**; bir özellikte tahmin varsa o Ürün 3'tür. Kendi CLAUDE.md kurallarına göre §12'deki sırayla phase planı çıkar:
>
> 0) **Önce `docs/BAGLANTI_YOL_HARITASI.md`'yi oku.** B-25 → B-20 (1–5) + B-09 → B-18 sırası ve her birinin adım adım planı, kabul testleri orada. Bu üçü frontend'i backend'e bağlamanın ön koşulu; §6'daki noktalardan karar verilmemiş olanlarda onay gelmeden o kısmı kodlama (proje sayısı kararı verildi: şimdilik 2 proje).
> 1) **Sıra 1 — ortak altyapı:** B-18 demo veri seti (önce webde resmî yazı, sözleşme, dilekçe formatlarını araştır; kurgusal, profesyonel belgeler ve orta karmaşıklıkta, formüllü, proje proje ayrı Excel'ler üret). B-19 arayüz incelemesi ve tersine liste — **her yeteneğin ürün katmanını da yaz**. B-25 ürün katmanı anahtarı **karar verildi (§1.5.4), ADR gerekmez** — doğrudan uygula: `company_settings.enabled_products`, uç bazlı `requires_product`, `GET /api/auth/me` cevabına `enabled_products` alanı (frontend zaten bunu bekliyor, alan adını ve değerleri birebir eşleştir).
> 2) **Sıra 2–4 — Ürün 1 (belkemiği):** departman yapısı ve yetki (B-20 1–5, B-09, B-08, **B-26 klasör yetkileri** — B-10'un yerine), küçük şema eklemeleri (B-07, B-04, B-13, B-17, B-20/6, B-05), sonra B-03, B-12, B-11, B-14. **Ürün 2 koduna, Ürün 1'in finalize olduğunu (ürün testinden geçtiğini) Tansu bildirmeden geçme** (§1.7); kod testlerinin geçmesi finalize demek değildir.
> 3) **Sıra 5–6 — Ürün 2:** bildirim altyapısı (B-02), gündem (B-01), görüş talebi (B-06a), işlem talebi iskeleti (B-22) ve yazışma taslağı (B-23). Ürün 2'de hesap yalnızca gerçekleşmiş veriyle, taslak yalnızca olgusal.
> 4) **Sıra 7–8 — Ürün 3:** Enerji izin adımları, Hukuk dava modeli, İK ve hukuk kısımları, B-21. Bunlar için şimdilik yalnızca ADR ve veri modeli taslağı.
> 5) **ÖNERİLEN KARAR** etiketli maddelerde Tansu onaylamadıysa yalnızca ADR taslağı + soru listesi; kod yok. **ADR ÖNCE** maddelerinde "Başlama koşulu" tamamlanmadıysa yalnızca ADR + migration taslağı + test listesi. Varsayılan kararları aynen al; farklı önerin varsa ADR'de gerekçesiyle yaz, kendin değiştirme.
> 6) **B-21:** tam metin bu belgeye eklenene kadar başlama.
> 7) **Her işlem modülünde** P-1'in dört testini, **her uçta** `allowed_document_ids` testini, **her katmanda** §1.5.4'teki katman testlerini yaz.
> 8) **B-23'te yasaklar:** kanun/karar uydurmak, kaynaksız olgusal iddia, sistemden herhangi bir gönderim (KEP, UYAP, e-posta).
> 9) **Frontend'e dokunma.** Sözleşme `frontend/src/api/proposed.ts`; alan adlarını birebir eşleştir. Tip değişikliği gerekiyorsa önerini ayrı liste olarak Tansu'ya ver.
> 10) **Soru kuralı (§1.7.1):** belirsizlikte tahminle ilerleme; soruyu o an, seçenekli ve önerili sor; cevap beklerken bağımsız maddeyle devam et. Bir ürün yalnızca Tansu tarafının ürün testinden geçince finalize sayılır (§1.7).
> 11) Her phase sonunda: ne yapıldı, hangi ürün katmanına ait, hangi dosyalar değişti, hangi testler eklendi, hangi sorular açık kaldı ve **"Bu belgeden sapmalar"** (§1.6; yoksa "yok") — kısa özet.

---

## Ek A — B kodu dizini

Frontend kod yorumlarındaki B kodlarının bu belgedeki yeri.

| Kod | Konu | Bölüm | Ürün |
|---|---|---|---|
| B-01 | Gündem | §5.1 | Ürün 2 |
| B-02 | Bildirimler | §5.2 | Ortak |
| B-03 | Balbal sohbet geçmişi, çok turlu soru | §3.2 | Ürün 1 |
| B-04 | Cevap kimliği, geri bildirim | §3.4 | Ürün 1 |
| B-05 | Şirket rehberi | §6.1 | Ürün 1 |
| B-06 | Görüş talebi (a) ve ekip sohbeti (b) | §6.2, §6.3 | a: Ürün 2 · b: Ürün 2 sonrası |
| B-07 | Kaynak kartında versiyon id'leri | §3.6 | Ürün 1 |
| B-08 | Departman yöneticisi rolü | §2.4 | Ürün 1 |
| B-09 | Ana departman | §2.2 | Ürün 1 |
| B-10 | Belgenin çok departmanla paylaşımı (→ B-26) | §2.5 | Ürün 1 |
| B-11 | Evrak talebi | §6.4 | Ürün 1 |
| B-12 | Etiket önerisi onayı | §4.2 | Ürün 1 |
| B-13 | Dosya türü | §4.1 | Ürün 1 |
| B-14 | Genel arama | §4.4 | Ürün 1 |
| B-15 | Word yükleme | §11 | Ürün 1 |
| B-16 | EPİAŞ canlı veri kaynağı alanı | §3.7 | Ürün 3 |
| B-17 | İndirme adı, tarayıcıda açma | §4.3 | Ürün 1 |
| B-18 | Demo veri seti | §9 | Ortak |
| B-19 | Arayüz incelemesi, tersine liste | §10 | Ortak |
| B-20 | Zihin haritası uyumu (1–5 yapı, 6 çok proje, 7 izin adımları) | §2.1, §3.3, §7.6.1 | 1–6: Ürün 1 · 7: Ürün 3 |
| B-21 | EPİAŞ + mahsuplaşma hesabı | §8.3 | Ürün 3 (kesin kısım Ürün 2) |
| B-22 | İşlem talepleri, personel izni | §8.1 | Ürün 2 (İK kısmı Ürün 3) |
| B-23 | Resmî yazışma, dilekçe taslağı | §8.2 | Ürün 2 (hukuki gerekçe Ürün 3) |
| B-24 | E-posta, sözleşme–e-posta ilişkilendirme | §4.6 | Ürün 1 |
| B-25 | Ürün katmanı anahtarı | §1.5.4 | Ortak |
| B-26 | Klasör yapısı ve departman erişim yetkileri | §2.6 | Ürün 1 |

### Revizyon geçmişi

- **v7.6 (28.09.2026 gece):** **§2.6 B-26** eklendi: sistem yöneticisi sayfası — şirketin klasör ağacı ve her klasör için departman bazında görme/değiştirme yetkisi; SPV'lere aynı yetki uygulanır; B-10 bununla karşılanır. Arayüzü Tansu tarafı tasarlar.
- **v7.5 (28.09.2026 gece):** **§9.3 Kurgu şirket** eklendi: 15 kişilik kurgusal personel listesi (ad, unvan, departman, yönetici, rol), bütün sözleşme ve belgelerin kurguya geçmesi, tek şirket adı; backend kurguyu çıkarır, arayüz ona göre tasarlanır. Ürün 1 = departman sayfasının kısıtlı hali (ayrı ana sayfa yok).
- **v7.4 (28.09.2026 gece):** **§1.7 İki ayrı test** eklendi: kod testi (backend) ile ürün testi (satılabilirlik, Tansu) ayrıldı; "Finalize" = ürün testinden geçmek; Ürün 2'ye geçiş buna bağlandı; soru kuralı (sor, tahmin etme, durma) getirildi. §13 buna göre güncellendi.
- **v7.3 (28.09.2026 gece):** Demo veri projeleri: şimdilik 2 proje, mevcut adlarıyla (§9.2, yol haritası §6/1).
- **v7.2 (28.09.2026 gece):** B-25 karar verildi (tek uygulama, `enabled_products` anahtarı; frontend tarafı uygulandı). Frontend–backend bağlantısı için **`BAGLANTI_YOL_HARITASI.md`** eklendi: B-25, B-20 (1–5) + B-09, B-18 adım adım plan, backend @ `4301968` durum tespiti, kabul testleri, bağlantı günü kontrol listesi.

- **v7.1 (28.09.2026 akşam):** Tansu'nun kararı işlendi: kişiler arası ve grup sohbeti (B-06b) Ürün 2 tamamlandıktan sonra eklenecek, Balbal sohbete dahil edilebilecek. Sohbette Balbal davranış kuralları eklendi (§6.3).
- **v7 (28.09.2026 akşam):** "X Platformu — Mimari ve Süreç Haritası"na göre **§1.5 Ürün katmanları** eklendi; her talebin altına **"Ürün:"** satırı kondu. Öncelik sırası katmana göre yeniden kuruldu (önce Ürün 1). Bulunanlar: B-21 tahmin içerdiği için Ürün 3; izin ve yazışma Ürün 2 + Ürün 3 olarak ikiye ayrıldı; Word yükleme Ürün 1 çekirdeği; **B-24** e-posta/sözleşme ilişkilendirme ve **B-25** ürün katmanı anahtarı eklendi; ekip sohbeti haritada yok. **§1.6 Uyum denetimi** eklendi.
- **v6 (28.09.2026 akşam):** Belge konu başlıklarına göre yeniden düzenlendi (genel prensip, Balbal, kurumsal yapı, belgeler, gündem, departmanlar arası iletişim, departman bazlı talepler, ortak modüller). Değişmez ilkeler P-1…P-10 olarak toplandı. **Hukuk dava veri modeli** eklendi (§7.3). İzin bakiyesi, Tansu'nun kararına göre **belgelerden türetilecek** şekilde düzeltildi (§8.1.6). Her departmana zihin haritasındaki Ürün 3 yol haritası bağlam olarak eklendi. Durum etiketleri (HEMEN, SIRADA, ADR ÖNCE, ÖNERİLEN KARAR, BİLGİ, BEKLEMEDE) getirildi.
- **v5 (28.09.2026):** P-1, B-21 yer tutucu, B-22, B-23 eklendi.
- **v1–v4:** B-01…B-20; canvas v160 → v165; proje seçiminin kaldırılması.
