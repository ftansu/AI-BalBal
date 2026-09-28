# X Platformu (Balbal) — Backend Talepleri ve Çalışma Esasları

**Kime:** Naci ve Naci'nin yapay zekası
**Hazırlayan:** Tansu (Claude ile) · **Revizyon:** v6 · 28.09.2026
**Karşılaştırılan sürümler:** `ntoydem/company-ai` @ `4301968` (Phase 5.4) ↔ `ftansu/AI-BalBal`
**Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (v165). Repo ile canvas farklıysa **canvas esastır**.

---

## İçindekiler

0. [Bu belge nasıl okunur](#0-bu-belge-nasıl-okunur)
1. [Genel sistemin çalışma prensibi](#1-genel-sistemin-çalışma-prensibi)
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

- Belge **konu başlıklarına** göre düzenlendi. Her talebin yanında bir **B kodu** var (B-01 … B-23). Frontend kodundaki yorumlar (`// BACKEND_GAPS B-07` gibi) bu kodlara atıf yapar; kodlar değişmedi. Hangi kodun hangi bölümde olduğu **Ek A**'da.
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

Bunlar için backend'de değişiklik gerekmiyor.
1. **`/api/ask` proje kapsamı (`project_id`)** frontend'e bağlanmıştı; canvas v165'te **proje seçimi kaldırıldı** (bkz. §3.3). Kod henüz buna uyarlanmadı; `project_id` gönderimi kalkacak.
2. **`GET /api/excel/{id}/inspect`** belge detayında "Excel dosya yapısı" kartı olarak gösteriliyor (sayfalar, adlandırılmış aralıklar, formül sayısı, makro). Excel olmayan belgede 422 → kart gizleniyor.
3. **Excel/CSV yükleme:** Backend `xlsx/xlsm/csv` kabul ediyordu, formdaki dosya seçici yalnızca PDF/görsel alıyordu. Düzeltildi.
4. **Versiyon zinciri:** `supersedes_document_id` / `superseded_by_document_id` artık açılabilir ve indirilebilir link.
5. **Dosya linki kuralı (P-4):** belge listesi, kaynak kartları, Excel kaynakları, arama, sohbet ekleri bu kurala göre düzenlendi.

---

## 2. Kurumsal yapı, kişiler ve yetki

Kurumsal yapı hem backend'de hem frontend'de **zihin haritasıyla (bible) birebir aynı** olmalı. Bir uyumsuzluk görürsen Tansu'ya rapor et; kendin karar verme.

### 2.1 Departman yapısı — **B-20 (1–5)** · HEMEN

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

- P-5 gereği kişinin **ana departmanı** bilinmeli: `users.primary_department_id` eklensin, `/api/auth/me` dönsün.
- Frontend şu an `department_slugs[0]`'ı ana departman kabul ediyor; alan gelince ona geçecek.

### 2.3 Unvan ve yönetici bilgisi · HEMEN

- `users.title` (unvan, ör. "Proje Finans Müdürü") — rehber ve onay ekranları için (§6.1).
- `users.manager_id` (nullable) — izin ve diğer işlem onayları için (§8.1).

### 2.4 "Departman yöneticisi" rolü — **B-08** · ÖNERİLEN KARAR

Mevcut kural (`authorization.py`):
- `employee`: kendi departmanının yalnızca `normal` belgeleri
- `management`: tüm departmanlar, tüm gizlilik düzeyleri

Tasarımda departman müdürleri (Proje Finans müdürü, Hukuk müdürü, Enerji müdürü) **kendi departmanlarının `restricted` belgelerini de** görüyor ama başka departmanların belgelerini görmüyor. Mevcut iki rol buna uymuyor.

- **Önerilen karar:** `department_manager` rolü; kural: "kendi departman(lar)ı, `normal` + `restricted`". (Alternatif: `user_departments` üyeliğine `max_confidentiality` alanı.)
- Bu rol aynı zamanda: etiket önerisi onayı (§4.2), işlem onay zinciri (§8.1), yazışma ikinci onayı (§8.2) için kullanılır.
- Değişiklik yalnızca `allowed_document_ids` içinde (P-2).
- **Not (Tansu'nun yaklaşımı):** yetki yapısı her şirkette farklı yapılandırılabilir olmalı (P-8). İK'da erişim **bireysel**, operasyonel departmanlarda (Enerji, Hukuk, Finans…) **departman bazlı** düşünülür.

### 2.5 Bir belgenin birden çok departmanla paylaşımı — **B-10** · ÖNERİLEN KARAR

`documents.department` tek değer alıyor. Oysa bir kredi sözleşmesine hem Proje Finans hem Hukuk erişmeli; bugün bu ancak `management` ile mümkün.
- **Önerilen karar:** `document_shares(document_id, department_id)` tablosu; `allowed_document_ids` bunu da hesaba katar. Paylaşımı belgenin sahibi departmanın `department_manager`'ı yapar.

---

## 3. Balbal için notlar

Balbal, platformun yapay zeka asistanı. Kullanıcı bilgiye ekranda gezinerek değil, **Balbal'a sorarak** ulaşır (P-7).

### 3.1 Balbal'ın davranış kuralları (BİLGİ — mevcut kurallar, bozulmamalı)

1. **Kaynak göstermeden cevap vermez.** Her olgusal ifade numaralı kaynak kartına bağlanır. Kaynak yoksa "bulunamadı" der; tahmin etmez.
2. **Ürün seviyesine uyar (§1.1).** Ürün 1 cevabı yorumsuzdur; Ürün 2 hesabı yalnızca gerçekleşmiş veriyle yapılır.
3. **Yetkisiz içerik LLM'e girmez (P-2).** Balbal "bu belge Mali İşler'de" gibi cümlelerle yetkisiz bir belgenin varlığını ele vermez (bkz. §6.4).
4. **Kapsam sınırı:** Balbal yalnızca şirket arşivi ve iş süreçleri için cevap verir. Şahsi veya kapsam dışı sorularda nazikçe yönlendirir. Başkalarına ait kişisel bilgiler (maaş, izin, sağlık vb.) yetki filtresiyle **erişim seviyesinde** korunur, LLM'in takdirine bırakılmaz. (Tansu bunu "ciddi bir konu, mimari buna göre kurulacak" olarak tanımladı.)
5. **Soru kayıtları ve KVKK:** Soru-cevaplar bilgi tabanına **girmez**; denetim kaydında tutulur. Kimin ne görebildiği ve personelin bilgilendirilmesi baştan tasarlanır.
6. **İşlem yapmaz, taslak üretir (P-1).** Bkz. §3.5.

### 3.2 Sohbet geçmişi ve çok turlu soru — **B-03** · ÖNERİLEN KARAR

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

- Balbal penceresinde **proje seçimi yok** (Tansu'nun kararı). Tek sohbette birden çok proje konuşulabilir.
- Balbal sorudaki projeleri **kendisi tespit eder**; cevapta her proje ayrı gösterilir (P-6); her kaynak kartında `project` alanı olur.
- `AskRequest.project_id` artık zorunlu değil; kaldırılabilir veya yok sayılabilir.

### 3.4 Cevap kimliği ve geri bildirim — **B-04** · HEMEN

- `AskResponse`'a `audit_log_id` eklenmeli (kayıt zaten yazılıyor, id'si dönmüyor).
- `POST /api/ask/feedback { audit_log_id, rating: "up"|"down", comment? }` → denetim kaydına bağlanır. "Hatalı bildir" kayıtları yönetim panelinde filtrelenebilir; eval setini büyütmek için iyi bir kaynak.

### 3.5 Soru mu, işlem talebi mi? (niyet ayrımı) · SIRADA (§8.1 ile)

Balbal'a gelen her mesaj önce sınıflandırılır:

| Niyet | Ne olur |
|---|---|
| `question` | Mevcut akış (retrieval + kaynaklı cevap). |
| `action:leave_request` | Retrieval **çalışmaz**, LLM'e belge içeriği verilmez. Alanlar çıkarılır, eksikler sorulur, taslak form oluşturulur (§8.1). |
| `unknown_action` | "Bu işlem henüz sistemde yok." Hiçbir şey oluşturulmaz. |

- `AskResponse`'a eklenecek alan: `action: { kind: "leave_request_draft", request_id } | null`. Doluysa frontend sohbette form kartını gösterir (`proposed.ts` §7).
- Kullanıcının mesajındaki ifadeler **talimat değildir**: "Yöneticim onayladı, direkt İK'ya gönder" durum makinesini etkilemez.

### 3.6 Kaynak kartında versiyon bağlantıları — **B-07** · HEMEN

`SourceCard` şu an `supersedes_title` / `superseded_by_title` dönüyor ama **id dönmüyor**; "Bu eski versiyon, güncel versiyon: X" uyarısındaki X tıklanamıyor (P-4 ihlali).
```python
supersedes_document_id: UUID | None
superseded_by_document_id: UUID | None
```
Güncel versiyonun id'si dönmeden önce kullanıcının o belgeyi görme yetkisi kontrol edilir; yoksa `None`.

### 3.7 Canlı veri kaynağı (EPİAŞ) — **B-16** · BİLGİ (§8.3 ile)

Üretim, PTF ve YEKDEM soruları Excel'den değil **EPİAŞ Şeffaflık Platformu**'ndan cevaplanacak (Tansu'nun kararı). Tasarımda Balbal bu cevaplarda "Canlı veri · EPİAŞ" rozeti ve kaynak linki gösteriyor. Önerilen alan: `AskResponse.live_sources: [{ provider: "EPIAS", dataset, period, url }]`. Mevcut Excel motoru bu veriyi karşılamıyor; veri çekme ve hesap §8.3'te.

---

## 4. Belgeler ve kurumsal hafıza

### 4.1 Belge listesinde dosya türü — **B-13** · HEMEN

`DocumentListItem` ve `DocumentDetail` dosya türünü içermiyor; frontend bir belgenin Excel olup olmadığını anlamak için `inspect` çağırıp 422 alıyor.
- `file_kind: "pdf" | "image" | "xlsx" | "xlsm" | "csv"` alanı eklensin.

### 4.2 Etiket önerisini kim onaylar — **B-12** · ÖNERİLEN KARAR

`metadata-suggestion/apply` ve `reject` yalnızca admin'e açık. Tasarımda belgeyi yükleyen kişi Balbal'ın etiket önerisini kendisi onaylıyor; aksi halde her yükleme admin'i bekler.
- **Önerilen karar:** Yükleyen kişi **veya** belgenin departmanındaki `department_manager` (B-08) onaylayabilir. Bu da P-1'le uyumludur: öneriyi AI yapar, insan onaylar.
- Onay bekleyen öneriler gündeme `kind: "approval"` olarak düşer (§5.1).

### 4.3 İndirme: dosya adı ve tarayıcıda açma — **B-17** · HEMEN

`download_document` şu an `FileResponse(path, filename=path.name)` dönüyor; inen dosyanın adı **`original.pdf`** oluyor.
- `filename` = belge başlığı + uzantı (ör. `Karatepe RES Kredi Sözleşmesi.pdf`).
- `?inline=1` ile `Content-Disposition: inline` desteklensin. Arayüzde "Belgeyi aç" inline, "İndir" attachment kullanır.

### 4.4 Genel arama — **B-14** · SIRADA (V1)

Üst bardaki arama şu an `/api/documents` ve `/api/projects` listelerini **istemcide** filtreliyor; yalnızca başlık, tür ve muhatapta arıyor.
- `GET /api/search?q=` → retrieval'daki FTS ile **içerikte** de arar. Dönüş: `{ documents: [{…, snippet, page_number}], projects: [...], people: [...] }`. Yetki `allowed_document_ids` (P-2).

### 4.5 Kurumsal hafıza kuralı (BİLGİ — Tansu'nun kararı)

- Kurumsal hafızaya **otomatik** giren tek şey: **departmanlar arası görüş talepleri ve cevapları** (§6.2).
- Kişiler arası sohbetler, Balbal soru-cevapları, işlem taslakları (izin, yazışma) **girmez**.
- Personel isterse kendi "bilgi notu"nu belge olarak ilgili klasöre yükler; sistem onu normal belge gibi işler.
- "Her soru-cevabı kaydet" butonu fikri **ertelendi** (kurumsal ortamda her şeyin kaydedilmesi rahatsızlık yaratabilir).

---

## 5. Ana ekran: gündem ve bildirimler

### 5.1 Gündem — **B-01** · HEMEN (ilk kısım)

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
| **3. Ekip sohbeti** (kişiler arası, grup) | Günlük yazışma | Hayır | ÖNERİLEN KARAR — sonra |
| **4. Evrak talebi** | Yetkisi olmayan bir belgeye ihtiyaç duyulduğunda | Hayır | ÖNERİLEN KARAR |

### 6.1 Şirket rehberi — **B-05** · HEMEN

`/api/users` yalnızca admin'e açık. Kişi bulmak ve sohbete eklemek için herkesin görebileceği **dar** bir liste gerekiyor:
```
GET /api/directory?q=&department=
→ [{ id, display_name, title, department_slug, department_name }]
```
- `users.title` alanı eklenmeli (§2.3).
- Şifre özeti, rol, aktiflik, e-posta gibi bilgiler bu uçta **dönmez**.

### 6.2 Departmanlar arası görüş talebi — **B-06 (a)** · ÖNERİLEN KARAR (öncelikli)

Bu, Ürün 2'nin çekirdek özelliği: bir departman başka bir departmandan konu, açıklama ve son tarih belirterek görüş ister; cevap gelir; **ikisi birlikte kurumsal hafızaya girer** ve ileride Balbal tarafından bulunabilir.
```
POST /api/opinion-requests  { to_department, subject, body, due_date }
```
- Talep, hedef departmanın gündemine (`opinion_request`) ve bildirimine düşer.
- Cevabı hedef departmanın yetkili kişisi yazar. Balbal cevap **taslağı** önerebilir; gönderen yine insandır (P-1).
- Talebe eklenen belgeler alıcı için indirme anında **yeniden** yetki kontrolünden geçer. Paylaşmak yetki vermez.
- **Önerilen karar:** Önce yalnızca görüş talebi yapılsın; serbest sohbet sonra.

### 6.3 Ekip sohbeti (kişiler arası ve grup) — **B-06 (b)** · ÖNERİLEN KARAR (V1, görüş talebinden sonra)

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

**Backend'den beklenen**
- Günlük yatan tutar, ay içi toplam, ertesi ay mahsuplaşma tutarı ve tarihi — proje proje, kesin/tahmini etiketli → **§8.3 (B-21)**.
- Demo belgeler: kredi sözleşmesi + tadiller (versiyon zinciri), ödeme planı Excel'i, sigorta poliçeleri, banka raporlama formları → §9.

**Ürün 3 yol haritası (BİLGİ):** kredi, teminat ve sigorta sürelerini takip; nakit akış raporu; banka sorularına cevap taslağı; EPİAŞ verisini işleme; ödeme ve tahsilat takvimi; kredi dashboard'u (önümüzdeki 6 ayda hangi projenin hangi kredisi var); birikmiş hafızadan sapma görüşü.

### 7.2 Mali İşler (Muhasebe, Finansal Muhasebe)

**Backend'den beklenen**
- Alt birimlerin eklenmesi (§2.1).
- Finansal Muhasebe ana ekranında da mahsuplaşma bilgisi gösteriliyor → §8.3.
- Demo belgeler: ticaret sicil gazetesi, vergi levhası vb. → §9.

**Ürün 3 yol haritası (BİLGİ):** fatura verisi çıkarma, muhasebe kodu önerisi, cari mutabakat desteği, ödeme talimatı taslağı, banka hareketi eşleştirme, bütçe–fatura eşleştirme, ERP adaptasyonu.

### 7.3 Hukuk

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

**Backend'den beklenen:** Şimdilik yalnızca demo belgeler (§9). Ana sayfa canvas'ta var; ihtiyaçlar §10'daki analizle çıkarılacak.

**Ürün 3 yol haritası (BİLGİ):** araç, bina, ekipman takibi; bakım, muayene, sigorta hatırlatması; destek hizmeti talepleri; idari satın alma desteği; demirbaş ve zimmet takibi; idari raporlar. (Satın alma/destek talebi eklendiğinde §8.1'deki işlem talebi iskeleti ve P-1 kullanılır.)

### 7.5 İK

**Backend'den beklenen**
- İK departmanının eklenmesi (§2.1).
- **Personel izin talebi** → **§8.1 (B-22)**. Onaylanan izinler İK kuyruğuna düşer; izin belgeleri İK klasörüne girer.
- Demo belgeler: personel yönetmeliği vb. → §9.

**Ürün 3 yol haritası (BİLGİ):** özlük dosyası güncelleme, işe giriş/çıkış işlemleri, puantaj, bordro girdisi, iş ilanı taslağı, oryantasyon planı, İK raporları.

**Erişim notu:** İK verisinde erişim **bireysel**dir (kişi kendi kaydını görür; İK ve onay zinciri ilgili kaydı görür), departman bazlı değildir.

### 7.6 Enerji

#### 7.6.1 Proje Geliştirme — **B-20/7** · ÖNERİLEN KARAR (veri modeli)

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

**Backend'den beklenen:** demo belgeler (bakım sözleşmesi, arıza tutanakları, yıllık bakım raporu, ÇED izleme yükümlülükleri) → §9.
**Ürün 3 yol haritası (BİLGİ):** bakım takibi, arıza geçmişi, üretim performansı, emre amadelik, kayıp üretim, arıza–üretim kaybı ilişkisi görüşü.

#### 7.6.3 EPC (İnşaat)

**Ürün 3 yol haritası (BİLGİ):** teklif karşılaştırma, milestone takibi, ilerleme raporu, hakediş ve metraj desteği, toplantı tutanağı.

#### 7.6.4 Üretim/Piyasa

**Backend'den beklenen:** birimin eklenmesi (§2.1); EPİAŞ verisi → §8.3.
**Ürün 3 yol haritası (BİLGİ):** üretim, PTF, YEKDEM, uzlaştırma ve gelir verisi; günlük/haftalık/aylık rapor; yıl sonu gelir projeksiyonu; kaynak bazlı üretim tablosu; "hangi projede üretim sapması var, nedeni ne?" sorusuna görüş.

---

## 8. Ortak modüller

### 8.1 İşlem talepleri ve personel izni — **B-22** · ADR ÖNCE

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

Ana ekrandaki "günlük yatan tutar" ve "mahsuplaşmada yatacak tutar" hesabı. Formül, veri modeli, uçlar ve test örnekleri Tansu ile ayrı bir çalışmada, **gerçek faturayla doğrulanmış referans Excel'den** çıkarıldı. **Tam metin bu belgeye ayrı bir commit ile eklenecek.**

Değişmeyecek kararlar:
- Hesap **backend'de**. Frontend yalnızca gösterir; tarayıcıdan EPİAŞ'a bağlanılmaz; EPİAŞ şifresi yalnızca ortam değişkeninde.
- Her proje ayrı hesaplanır ve döner; konsolide toplam dönülmez (P-6).
- Oranlar (avans oranı, yönetim bedeli, KDV, YEK payı vb.) koda gömülmez; proje bazlı, **geçerlilik tarihli** parametre tablosunda (P-8).
- Public repo: gerçek oranlar, toplayıcı adı, gerçek EPİAŞ kimlikleri yazılmaz; testlerde kurgusal değerler (P-9).
- Kullanılacak yerler: Proje Finans ve Mali İşler > Finansal Muhasebe ana ekranı; Balbal'ın EPİAŞ cevapları (§3.7).

**Talimat:** Tam metin eklenmeden B-21 için kod yazma, tablo açma, EPİAŞ istemcisi kurma.

---

## 9. Demo veri seti — **B-18** · HEMEN (öncelikli)

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
- **Proje adları arayüzle aynı:** işletmede Karatepe, Yeşilova, Boztepe, Güneşalan; geliştirmede Kızılova, Akyar, Demirci.

---

## 10. Naci'den beklenen analiz — **B-19** · HEMEN

1. `ftansu/AI-BalBal` frontend'ini ve Claude Design canvas'ını ("X Platformu — Ana Sayfa", v165) incele. Backend'de karşılığı olmayan her ekran/alan için eksiği tespit et ve (bu belgede karar verilmiş olanları) tamamla. Bu belgedeki maddelerle sınırlı değil.
2. **Tersine liste:** Backend'inde olup arayüzde **olmayan** her yeteneği yaz: uç, ne yaptığı, örnek istek/cevap, hangi ekranda kullanılmasını önerdiğin. Arayüzü buna göre tamamlayacağız.
3. Canvas'ta olup bu belgede **hiç geçmeyen** bir ihtiyaç bulursan (özellikle Mali İşler, İdari İşler, İK ana sayfaları) önce listele, Tansu'ya sor; kendin karar verme.

---

## 11. Ertelenen ve kapsam dışı işler

| Kod | Konu | Durum |
|---|---|---|
| B-15 | Word (.docx) **yükleme** | V0 dışı. Tasarımda bazı örnek dosyalar `.docx`; ileride gerekecek. |
| — | **Dışa aktarma** (Excel/Word/PDF rapor, şablon doldurma) | Ertelendi. İlk öncelik: yazışma/dilekçe taslağının Word çıktısı (§8.2.10). |
| — | "Her soru-cevabı kurumsal hafızaya kaydet" butonu | Ertelendi (§4.5). |
| — | KEP otomatik çekme, UYAP, e-imza | Ertelendi (§8.2.13). |
| — | Kıdemden otomatik izin hakkı, vekalet, rapor izni | Ertelendi (§8.1.13). |
| — | Teams entegrasyonu | Ekip sohbetine alternatif olarak ileride (§6.3). |
| — | ERP adaptasyonu (Mali İşler) | Ürün 3 yol haritası (§7.2). |

---

## 12. Yol haritası ve öncelik sırası

| Sıra | Kod | Konu | Bölüm | Etiket |
|---|---|---|---|---|
| 1 | B-18 | Demo veri seti | §9 | HEMEN |
| 1 | B-19 | Arayüz incelemesi + tersine liste | §10 | HEMEN |
| 1 | B-20 (1–5) | Departman yapısını zihin haritasına uyarla | §2.1 | HEMEN |
| 2 | B-07 | Kaynak kartında versiyon id'leri | §3.6 | HEMEN |
| 2 | B-04 | Cevap kimliği + geri bildirim | §3.4 | HEMEN |
| 2 | B-13 | Dosya türü alanı | §4.1 | HEMEN |
| 2 | B-17 | İndirme adı + tarayıcıda açma | §4.3 | HEMEN |
| 2 | B-20/6 | Tek sohbette çok proje | §3.3 | HEMEN |
| 3 | B-01 | Gündem (ilk kısım) | §5.1 | HEMEN |
| 3 | B-05 | Şirket rehberi + `users.title` | §6.1 | HEMEN |
| 3 | B-09 | Ana departman | §2.2 | HEMEN (B-08 ile) |
| 4 | B-08 | Departman yöneticisi rolü | §2.4 | ÖNERİLEN KARAR |
| 4 | B-10 | Belgenin çok departmanla paylaşımı | §2.5 | ÖNERİLEN KARAR |
| 4 | B-11 | Evrak talebi (varlık ele vermeden) | §6.4 | ÖNERİLEN KARAR |
| 4 | B-12 | Etiket önerisi onayı | §4.2 | ÖNERİLEN KARAR |
| 4 | B-03 | Sohbet geçmişi + çok turlu soru | §3.2 | ÖNERİLEN KARAR |
| 4 | B-20/7 | Enerji izin adımları veri modeli | §7.6.1 | ÖNERİLEN KARAR |
| 5 | B-02 | Bildirimler | §5.2 | SIRADA |
| 5 | B-06a | Departmanlar arası görüş talebi | §6.2 | ÖNERİLEN KARAR |
| 5 | B-14 | Genel arama | §4.4 | SIRADA |
| 6 | B-22 | İşlem talepleri + personel izni | §8.1 | ADR ÖNCE |
| 6 | B-23 | Resmî yazışma ve dilekçe taslağı | §8.2 | ADR ÖNCE |
| 6 | — | Hukuk dava veri modeli | §7.3 | ADR ÖNCE (B-23 ile) |
| 7 | B-06b | Ekip sohbeti | §6.3 | ÖNERİLEN KARAR (V1) |
| — | B-21 | EPİAŞ + mahsuplaşma | §8.3 | BEKLEMEDE |
| — | B-15, B-16 | Word yükleme, EPİAŞ canlı kaynak alanı | §11, §3.7 | BİLGİ |

---

## 13. Naci'nin yapay zekasına hazır istem

> `docs/BACKEND_GAPS.md` dosyasını (ftansu/AI-BalBal) baştan sona oku. Önce **§1.2 Değişmez ilkeler**'i oku; bunlar her phase'de geçerli, özellikle **P-1 (personel onayı olmadan hiçbir işlem ilerlemez)** ve **P-2 (yetki tek kapıdan)**. Kendi CLAUDE.md kurallarına göre §12'deki sırayla phase planı çıkar:
>
> 1) **Sıra 1:** B-18 demo veri seti (önce webde resmî yazı, sözleşme, dilekçe formatlarını araştır; kurgusal, profesyonel belgeler ve orta karmaşıklıkta, formüllü, proje proje ayrı Excel'ler üret). B-19 arayüz incelemesi ve tersine liste. B-20 (1–5) departman yapısı.
> 2) **Sıra 2–3:** küçük şema eklemeleri ve ilk ekran uçları: B-07, B-04, B-13, B-17, B-20/6, B-01 (ilk kısım), B-05, B-09.
> 3) **ÖNERİLEN KARAR etiketli maddeler** (B-08, B-10, B-11, B-12, B-03, B-06, B-20/7): Tansu önerilen kararı onaylamadıysa yalnızca ADR taslağı + soru listesi; kod yok. Onaylandıysa uygula.
> 4) **ADR ÖNCE maddeleri** (B-22, B-23, Hukuk dava modeli): Her bölümün "Başlama koşulu"ndaki ön koşullar tamamlanmadıysa yalnızca ADR + migration taslağı + test listesi. Tamamlandıysa ADR'yi Tansu'ya onaya sun, onaydan sonra uygula. Bölümlerdeki varsayılan kararları aynen al; farklı bir önerin varsa ADR'de gerekçesiyle yaz, kendin değiştirme.
> 5) **B-21:** tam metin bu belgeye eklenene kadar başlama.
> 6) **Her işlem modülünde** P-1'in dört testini yaz. **Her uç** `allowed_document_ids` kuralına uymalı ve en az bir test içermeli.
> 7) **B-23'te yasaklar:** kanun/karar uydurmak, kaynaksız olgusal iddia, sistemden herhangi bir gönderim (KEP, UYAP, e-posta).
> 8) **Frontend'e dokunma.** Sözleşme `frontend/src/api/proposed.ts`; alan adlarını birebir eşleştir. Tip değişikliği gerekiyorsa önerini ayrı liste olarak Tansu'ya ver.
> 9) Her phase sonunda: ne yapıldı, hangi dosyalar değişti, hangi testler eklendi, hangi sorular açık kaldı — kısa özet.

---

## Ek A — B kodu dizini

Frontend kod yorumlarındaki B kodlarının bu belgedeki yeri.

| Kod | Konu | Bölüm |
|---|---|---|
| B-01 | Gündem | §5.1 |
| B-02 | Bildirimler | §5.2 |
| B-03 | Balbal sohbet geçmişi, çok turlu soru | §3.2 |
| B-04 | Cevap kimliği, geri bildirim | §3.4 |
| B-05 | Şirket rehberi | §6.1 |
| B-06 | Görüş talebi (a) ve ekip sohbeti (b) | §6.2, §6.3 |
| B-07 | Kaynak kartında versiyon id'leri | §3.6 |
| B-08 | Departman yöneticisi rolü | §2.4 |
| B-09 | Ana departman | §2.2 |
| B-10 | Belgenin çok departmanla paylaşımı | §2.5 |
| B-11 | Evrak talebi | §6.4 |
| B-12 | Etiket önerisi onayı | §4.2 |
| B-13 | Dosya türü | §4.1 |
| B-14 | Genel arama | §4.4 |
| B-15 | Word yükleme | §11 |
| B-16 | EPİAŞ canlı veri kaynağı alanı | §3.7 |
| B-17 | İndirme adı, tarayıcıda açma | §4.3 |
| B-18 | Demo veri seti | §9 |
| B-19 | Arayüz incelemesi, tersine liste | §10 |
| B-20 | Zihin haritası uyumu (1–5 yapı, 6 çok proje, 7 izin adımları) | §2.1, §3.3, §7.6.1 |
| B-21 | EPİAŞ + mahsuplaşma hesabı | §8.3 |
| B-22 | İşlem talepleri, personel izni | §8.1 |
| B-23 | Resmî yazışma, dilekçe taslağı | §8.2 |

### Revizyon geçmişi

- **v6 (28.09.2026 akşam):** Belge konu başlıklarına göre yeniden düzenlendi (genel prensip, Balbal, kurumsal yapı, belgeler, gündem, departmanlar arası iletişim, departman bazlı talepler, ortak modüller). Değişmez ilkeler P-1…P-10 olarak toplandı. **Hukuk dava veri modeli** eklendi (§7.3). İzin bakiyesi, Tansu'nun kararına göre **belgelerden türetilecek** şekilde düzeltildi (§8.1.6). Her departmana zihin haritasındaki Ürün 3 yol haritası bağlam olarak eklendi. Durum etiketleri (HEMEN, SIRADA, ADR ÖNCE, ÖNERİLEN KARAR, BİLGİ, BEKLEMEDE) getirildi.
- **v5 (28.09.2026):** P-1, B-21 yer tutucu, B-22, B-23 eklendi.
- **v1–v4:** B-01…B-20; canvas v160 → v165; proje seçiminin kaldırılması.
