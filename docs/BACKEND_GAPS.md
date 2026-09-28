# Balbal Frontend ↔ company-ai Backend — Eksikler ve Uyum Raporu

**Hazırlayan:** Tansu (Claude ile) · **Tarih:** 28.09.2026
**Karşılaştırılan sürümler:** `ntoydem/company-ai` @ `4301968` (Phase 5.4 tamamlandı) ↔ `ftansu/AI-BalBal` (bu repo)
**Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (v160)
**Revizyon:** v5 · 28.09.2026 akşam

> **v5 değişiklikleri:** (1) En üste **Değişmez İlke P-1** eklendi (personel onayı olmadan hiçbir işlem ilerlemez). (2) **B-21** numarası EPİAŞ / mahsuplaşma hesabına ayrıldı (tam metin ayrıca eklenecek, bkz. B-21). (3) **B-22** personel izin sistemi, **B-23** Hukuk ve Enerji-Geliştirme yazışma/dilekçe taslağı eklendi. (4) Öncelik tablosu ve D bölümündeki hazır istem güncellendi.
>
> **Numara notu:** Tansu'ya aynı gün iletilen ayrı bir ek dosyada izin sistemi "B-21", yazışma "B-22" olarak geçiyordu. **Geçerli numaralar bu dosyadakilerdir:** B-21 = mahsuplaşma, B-22 = izin, B-23 = yazışma.

---

## ⛔ Değişmez İlke P-1 — Personel onayı olmadan hiçbir işlem ilerlemez

Bu, platformun **temel felsefesidir**. Hiçbir phase, hiçbir optimizasyon, hiçbir "kullanıcı deneyimi" gerekçesi bu ilkeyi esnetemez. Yeni bir özellik tasarlarken bu ilkeyle çelişen bir yol görürsen **dur ve Tansu'ya sor**.

1. **Balbal yalnızca taslak üretir.** Balbal (LLM) hiçbir zaman kayıt oluşturmaz, göndermez, onaylamaz, imzalamaz, silmez. Anlar, eksik bilgiyi sorar, taslak yazar. Bu kadar.
2. **Taslak önce talep sahibine (personele) gösterilir.** Personel taslağı arayüzde görür, gerekirse düzeltir ve **kendi kimlik doğrulamalı oturumundan, arayüzdeki açık onay butonuyla** onaylar. Personel onaylamadan taslak **hiç kimseye** (yönetici, İK, hukuk, başka departman) görünmez ve hiçbir kuyruğa düşmez.
3. **Sohbette "onaylıyorum / tamam / gönder" yazmak onay değildir.** Onay yalnızca ayrı bir uç (`POST …/approve`) üzerinden gelir; bu uç yalnızca talep sahibinin oturumuyla çağrılabilir. Balbal'ın, bir servisin veya başka bir kullanıcının (yönetici ve admin dahil) personel adına onay vermesi **teknik olarak imkânsız** olmalıdır (403).
4. **Onaydan sonra içerik değişirse onay düşer.** Onaylanmış bir formun içeriği değiştirilemez. Değişiklik gerekiyorsa form "düzeltme istendi" durumuyla personele geri döner; personel düzeltir ve **yeniden onaylar**. Yönetici ve İK formu kendileri düzenleyemez.
5. **Durum geçişlerini kod yönetir, LLM değil.** Durum makinesi deterministik koddur. LLM çıktısı hiçbir zaman bir durum geçişini doğrudan tetiklemez.
6. **Her geçiş denetim kaydına yazılır:** kim, ne zaman, önceki durum, sonraki durum, (varsa) yorum.
7. **Test zorunludur.** Her işlem modülünde en az şu testler olmalı: (a) personel onayı olmadan sonraki duruma geçiş → reddedilir; (b) başkası adına onay → 403; (c) onaydan sonra içerik değişikliği → onay düşer; (d) onaylanmamış taslak başka kullanıcının hiçbir listesinde görünmez.

**Kapsam:** Bu ilke bugün B-22 (izin) ve B-23 (yazışma/dilekçe) için geçerlidir; ileride eklenecek **her** işlem türü (masraf, satın alma talebi, avans, evrak talebi, görüş talebi vb.) için de aynen geçerlidir. Yeni bir işlem türü eklenirken bu bölüm referans alınır.


---

## Naci için kısa özet

- **Önce yukarıdaki P-1 ilkesini oku.** Balbal hiçbir işlemi personel onayı olmadan ilerletemez; bu kural her yeni özellikte geçerli.
- Bu repodaki frontend, senin backend'inin **mevcut API'lerini birebir kullanıyor**: `/api/ask`, `/api/documents/*`, `/api/excel/*`, `/api/projects`, `/api/departments`, `/api/users`, `/api/audit-log`, `/api/auth/*`. Senin backend koduna hiçbir değişiklik yapılmadı.
- Tasarımın ihtiyaç duyup backend'de **olmayan** özellikler için frontend, önerilen endpoint'leri çağırıyor (`frontend/src/api/proposed.ts`). Backend 404/405/501 dönerse arayüz sahte veri göstermiyor. Onun yerine "Backend bekleniyor" kutusu ve çağırdığı endpoint'in adı görünüyor. Yani bir endpoint'i eklediğin anda ilgili ekran kendiliğinden çalışmaya başlar.
- Aşağıdaki **B-xx** maddeleri kod yorumlarında da aynı numarayla geçiyor.
- Ürün veya mimari kararı gerektiren maddeleri **SORU** olarak işaretledim (senin CLAUDE.md kuralına uygun olarak). Bunlarda tahmin yürütüp uygulamaya geçme; önce Tansu ile karar verin.

### Öncelik tablosu

| No | Konu | Tür | Öneri |
|---|---|---|---|
| B-07 | Kaynak kartında güncel/önceki versiyonun **id**'si | Küçük şema ekleme | Hemen |
| B-04 | `/api/ask` cevabında kayıt id + geri bildirim | Küçük | Hemen |
| B-13 | Belge listesinde dosya türü alanı | Küçük | Hemen |
| B-17 | İndirilen dosyanın adı + tarayıcıda açma | Küçük | Hemen |
| B-01 | Gündem (ana ekran özeti) | Orta | V0 sonu |
| B-03 | Balbal sohbet geçmişi + çok turlu soru | Orta | V0 sonu (SORU) |
| B-05 | Şirket rehberi (yönetici olmayan için) | Küçük-orta | V0 sonu |
| B-08 | "Departman yöneticisi" rolü | Yetki modeli | **SORU** |
| B-09 | Kullanıcının ana departmanı | Küçük | **SORU** ile birlikte |
| B-10 | Bir belgenin birden çok departmanla paylaşımı | Yetki modeli | **SORU** |
| B-11 | Yetkisiz belge → evrak talebi | Güvenlik hassas | **SORU** |
| B-12 | Etiket önerisini yükleyenin onaylaması | Yetki | **SORU** |
| B-02 | Bildirimler | Orta | V1 |
| B-06 | Ekip sohbeti + departmanlar arası görüş talebi | Büyük | V1 (**SORU**) |
| B-14 | Genel arama endpoint'i | Orta | V1 |
| B-18 | Profesyonel demo belge + Excel seti | Veri | **Hemen** |
| B-19 | Arayüzü inceleyip eksik tamamlama + tersine yetenek listesi | Analiz | **Hemen** |
| B-20 | Zihin haritası uyumu (departmanlar, çok proje, izin modeli) | Şema | Hemen / kısmen **SORU** |
| B-21 | EPİAŞ verisi + günlük tahsilat / aylık mahsuplaşma hesabı | Büyük (hesap motoru) | Yer ayrıldı — tam metin gelene kadar **başlama** |
| B-22 | Personel izin sistemi (yıllık izin) — P-1 ilkesiyle | Yeni modül + durum makinesi | ADR önce; kod, başlama koşulları tamamlanınca (B-22 §12) |
| B-23 | Gelen yazı / dava evrakına cevap ve dilekçe taslağı (Hukuk, Enerji-Geliştirme) — P-1 ilkesiyle | Yeni modül | ADR önce; kod, başlama koşulları tamamlanınca (B-23 §11) |
| B-15 / B-16 | Word yükleme, EPİAŞ canlı veri | V0 kapsamı dışı | Not |

---

## A. Backend'de VAR, frontend'e bu çalışmada eklendi

Bunlar için backend'de değişiklik gerekmiyor; bilgin olsun diye listeliyorum.

1. **`/api/ask` proje kapsamı (`project_id`)**: Eski arayüz bunu hiç göndermiyordu. Artık Balbal penceresinde ve departmanın "Balbal'a Sor" sekmesinde proje seçilebiliyor.
2. **`GET /api/excel/{id}/inspect`**: Hiçbir ekranda kullanılmıyordu. Belge detayında "Excel dosya yapısı" kartı olarak gösteriliyor (sayfalar, adlandırılmış aralıklar, formül sayısı, makro, yeniden hesaplama). Excel olmayan belgede 422 dönüyor, kart gizleniyor.
3. **Excel/CSV yükleme**: Backend `xlsx/xlsm/csv` kabul ediyordu ama yükleme formundaki dosya seçici yalnızca PDF ve görsel kabul ediyordu. Düzeltildi.
4. **Versiyon zinciri**: Belge detayında `supersedes_document_id` / `superseded_by_document_id` ham UUID olarak gösteriliyordu. Artık açılabilir ve indirilebilir link olarak gösteriliyor.
5. **Dosya linki kuralı** (Tansu'nun sabit kuralı): Arayüzdeki her dosya referansı hem tıklanabilir hem indirilebilir olmalı. Belge listesi, kaynak kartları, Excel kaynakları, arama sonuçları ve sohbet ekleri bu kurala göre düzenlendi.

---

## B. Backend'e eklenmesi gerekenler

### B-01 · Gündem — `GET /api/me/agenda`
Ana ekranın en üstündeki "Gündeminiz" kutusu, kişinin takip etmesi gereken profesyonel uyarıları gösterir.
```json
[{ "id": "…", "kind": "approval|opinion_request|deadline|document_request",
   "title": "…", "due_date": "2026-10-02", "document_id": "…|null", "document_title": "…|null" }]
```
- **Hemen yapılabilecek kısım:** `documents.expiration_date` alanı zaten var. Kullanıcının `allowed_document_ids` kümesinde, 60 gün içinde süresi dolacak belgeler `kind: "deadline"` olarak dönülebilir.
- Onay bekleyen AI etiket önerileri (`metadata_suggestions.status = pending`) `kind: "approval"` olarak dönülebilir. Kimin onaylayacağı B-12'ye bağlı.
- Görüş ve evrak talepleri (B-06, B-11) eklenince onlar da bu listeye düşer.
- Kural: `document_id` olan her madde `allowed_document_ids` kontrolünden geçmeli. Yetkisiz bir belgenin başlığı bile dönmemeli.

### B-02 · Bildirimler — `GET /api/notifications`, `POST /api/notifications/read-all`
```json
[{ "id": "…", "kind": "approval|opinion_request|deadline|document_request|document_uploaded|version_changed",
   "text": "…", "created_at": "…", "read": false, "document_id": null, "document_title": null, "chat_id": null }]
```
Olay kaynakları:
- kullanıcının departmanına belge yüklenmesi,
- bir belgenin yerine yeni versiyon gelmesi (`supersedes` zinciri),
- onay bekleyen öneri,
- gelen veya cevaplanan görüş talebi,
- karşılanan evrak talebi.

Arayüz bu listeyi 60 saniyede bir yeniliyor. İleride push gerekmez.

### B-03 · Balbal sohbet geçmişi ve çok turlu soru — **SORU**
- `GET /api/ask/conversations` → `[{ id, title, updated_at }]`
- `GET /api/ask/conversations/{id}` → `{ id, turns: [{ question, response: AskResponse, created_at }] }`
- `AskRequest.conversation_id?` (isteğe bağlı) ve `AskResponse.conversation_id`

Sorular:
- **SORU:** CLAUDE.md "Soru-cevaplar bilgi tabanına GİRMEZ" diyor. Önerim: geçmiş yalnızca kullanıcının kendisine ait ayrı bir tabloda tutulsun (`ask_conversations`), retrieval'a hiç girmesin, 90 gün saklansın (denetim kaydıyla aynı süre). Onaylıyor musunuz?
- **SORU:** Takip sorularında ("peki ya İzmir?") önceki turun sorusu sınıflandırıcıya bağlam olarak verilsin mi? Kaynak kuralı değişmez: her turda retrieval yeniden `allowed_document_ids` üzerinden yapılır.

Şu an frontend geçmişi yalnızca tarayıcı oturumunda tutuyor. Sayfa yenilenince kayboluyor.

### B-04 · Cevap kimliği ve geri bildirim
- `AskResponse`'a `audit_log_id` eklenmeli (denetim kaydı zaten yazılıyor, yalnızca id'si dönmüyor).
- `POST /api/ask/feedback { audit_log_id, rating: "up"|"down", comment? }`: Denetim kaydına bağlanır. "Hatalı bildir" bildirimleri yönetim panelinde filtrelenebilir. Eval setini büyütmek için iyi bir kaynak olur.

### B-05 · Şirket rehberi — `GET /api/directory?q=&department=`
`/api/users` yalnızca admin'e açık. Ekip sohbetinde kişi bulmak ve eklemek için herkesin görebileceği dar bir liste gerekiyor:
```json
[{ "id": "…", "display_name": "…", "title": "Proje Finans Müdürü", "department_slug": "finans", "department_name": "Finans" }]
```
- `users` tablosunda **unvan (`title`) alanı yok**; eklenmeli.
- Şifre özeti, rol ve aktiflik gibi bilgiler bu uçta dönmemeli.

### B-06 · Ekip sohbeti ve departmanlar arası görüş talebi — **SORU (V1)**
```
GET  /api/chats                      → [{ id, kind: direct|group|opinion_request, title, member_ids, includes_balbal,
                                          last_message, updated_at, unread_count, opinion_request: {…}|null }]
POST /api/chats                      { member_ids, title?, include_balbal }
GET  /api/chats/{id}/messages        → [{ id, sender_id|null(=Balbal), sender_name, text, document_id, document_title, created_at, system }]
POST /api/chats/{id}/messages        { text? , document_id? }
POST /api/chats/{id}/members         { member_ids, include_balbal? }
POST /api/opinion-requests           { to_department, subject, body, due_date }
```
- **Güvenlik (kritik):** Balbal bir grup sohbetine eklendiğinde yalnızca **sohbetteki tüm üyelerin ortak görebildiği** belgelerden cevap vermeli. Yani üyelerin `allowed_document_ids` kümelerinin kesişimi. Aksi halde yetkisiz bir üye, yetkili bir üyenin belgesini Balbal üzerinden okumuş olur.
- **Güvenlik:** Sohbette paylaşılan bir belge (`document_id`) her alıcı için indirme anında yeniden yetki kontrolünden geçmeli. Paylaşmak yetki vermez. Arayüz de paylaşım listesinde yalnızca kullanıcının görebildiği belgeleri gösteriyor.
- Kurumsal hafıza kararı (Tansu): **yalnızca departmanlar arası görüş talepleri ve cevapları** otomatik olarak kurumsal hafızaya girer. Kişiler arası sohbetler girmez.
- **SORU:** Kişiler arası sohbet V1'de mi olacak, yoksa önce yalnızca görüş talebi mi yapılacak? Önerim: önce görüş talebi (Ürün 2'nin çekirdeği); serbest sohbet sonra gelsin, gerekirse Teams entegrasyonuyla.

### B-07 · Kaynak kartında versiyon id'leri
`SourceCard` şu an `supersedes_title` ve `superseded_by_title` dönüyor, **id dönmüyor**. Bu yüzden "Bu eski bir versiyon, güncel versiyon: X" uyarısındaki X tıklanamıyor. Önerilen ekleme:
```python
supersedes_document_id: UUID | None
superseded_by_document_id: UUID | None
```
Not: Güncel versiyonun id'si dönmeden önce kullanıcının o belgeyi görme yetkisi kontrol edilmeli. Yetki yoksa `None` dönmeli.

### B-08 · "Departman yöneticisi" rolü — **SORU**
Mevcut kural (`authorization.py`):
- `employee`: kendi departmanının yalnızca `normal` belgeleri
- `management`: tüm departmanlar, tüm gizlilik düzeyleri

Tasarımda Tansu (Proje Finans Müdürü) kendi departmanının **kısıtlı** belgelerini de görüyor, ama başka departmanların belgelerini görmüyor. Hukuk'tan Ayşe ve Enerji'den Kerem için de durum aynı. Mevcut iki rolden hiçbiri buna uymuyor.
- Öneri: `department_manager` rolü ekle, kuralı "kendi departman(lar)ı + `normal` ve `restricted`" olsun.
- Alternatif: `user_departments` tablosuna üyelik bazında `max_confidentiality` alanı ekle.

Değişiklik yine yalnızca `allowed_document_ids` içinde olmalı; tek kapı kuralı bozulmamalı.

### B-09 · Ana departman
Demo kullanıcısı `finans` hem `finans` hem `mali_isler` departmanına üye. Tasarım kuralı "bir kişi = tek arayüz" olduğu için kişinin **ana departmanı** bilinmeli.
- Öneri: `users.primary_department_id` alanı eklensin, `/api/auth/me` bunu dönsün.
- Frontend şu an `department_slugs[0]` değerini ana departman kabul ediyor.

### B-10 · Bir belgenin birden çok departmanla paylaşımı — **SORU**
`documents.department` tek değer alıyor. Ama örneğin bir kredi sözleşmesine hem Finans'ın hem Hukuk'un erişmesi gerekiyor. Bugün bu ancak `management` rolüyle mümkün.
- Öneri: `document_shares(document_id, department_id)` tablosu eklensin, `allowed_document_ids` bunu da hesaba katsın.

### B-11 · Yetkisiz belge için evrak talebi — **SORU (güvenlik)**
Tasarımda Balbal "bu belge Mali İşler'in alanında" diyor ve "evrak talep et" butonu sunuyor. **Dikkat:** Bu, kullanıcının görmemesi gereken bir belgenin varlığını ele verir. SECURITY kuralına göre yetkisiz içerik LLM'e bile girmemeli.
- Öneri: Belge başlığını veya içeriğini asla göstermeyen, yalnızca "bu konuda başka bir departmandan belge talep edebilirsiniz" diyen genel bir akış kurulsun: `POST /api/document-requests { to_department, description }`. Talep hedef departmanın gündemine düşer (B-01).
- **SORU:** Balbal kaynak bulamadığında hangi departmana yönlendireceğini söyleyebilir mi, yoksa kullanıcı departmanı kendisi mi seçmeli? Güvenli seçenek: kullanıcı seçsin.

### B-12 · Etiket önerisini kim onaylar — **SORU**
`metadata-suggestion/apply` ve `reject` yalnızca admin'e açık. Tasarımda belgeyi yükleyen kişi (veya o departmanın yöneticisi) Balbal'ın önerisini kendisi onaylıyor. Aksi halde her yükleme admin'i bekler.
- Öneri: Yükleyen kişi veya belgenin departmanındaki `department_manager` (B-08) onaylayabilsin.

### B-13 · Belge listesinde dosya türü
`DocumentListItem` ve `DocumentDetail` dosya türünü içermiyor. Frontend, bir belgenin Excel olup olmadığını anlamak için `inspect` çağırıp 422 alıyor.
- Öneri: `file_kind: "pdf" | "image" | "xlsx" | "xlsm" | "csv"` alanı eklensin.

### B-14 · Genel arama — `GET /api/search?q=`
Üst bardaki arama şu an belge ve projeleri `/api/documents` ve `/api/projects` listeleri üzerinden **istemcide** filtreliyor. Yalnızca başlık, tür ve muhatap alanlarında arıyor.
- Öneri: Retrieval'daki FTS kullanılarak içerikte de arama yapan bir uç eklensin. Dönüş: `{ documents: [{…, snippet, page_number}], projects: [...], people: [...] }`. Yetki yine `allowed_document_ids` üzerinden kontrol edilmeli.

### B-17 · İndirme: dosya adı ve tarayıcıda açma
`download_document` şu an `FileResponse(path, filename=path.name)` dönüyor. Kullanıcıya inen dosyanın adı **`original.pdf`** oluyor.
- Öneri: `filename` olarak belgenin başlığı ve uzantısı verilsin (örn. `Ankara RES Kredi Sözleşmesi.pdf`).
- `?inline=1` parametresiyle `Content-Disposition: inline` desteklensin. Arayüzdeki "Belgeyi aç" linki bunu kullanacak, "İndir" linki ise `attachment` olarak kalacak.

### B-18 · Demo veri seti: arayüzdeki her süreci destekleyen profesyonel belgeler — **ÖNCELİKLİ (Tansu'nun notu)**

Sunucudaki örnek belgeler artık daha profesyonel olmalı ve **arayüzdeki tüm süreçleri kapsamalı**. Arayüzde görünen her adımın arkasında Balbal'ın okuyabileceği gerçekçi (ama kurgusal — gerçek kişi/kurum belgesi değil) bir belge bulunmalı:

- **Enerji — Geliştirme:** ölçüm raporu, önlisans başvurusu ve kararı, YEGM teknik uygunluk, TEİAŞ bağlantı görüşü, tapu/kira, MSB askeri yazı, TEA başvurusu ve sonuç yazısı (olumsuzsa gerekçesiyle), ÇED başvurusu/ek bilgi/karar, jeoteknik etüt, kurum görüşleri, bağlantıya çağrı mektubu, imar, kat-i proje, yapı ruhsatı, lisans. Her belgede başvuru tarihi, sonuç tarihi, sonuç (olumlu/olumsuz) ve olumsuzsa sebep yazmalı; arayüz bunları nokta üzerindeki özet notta gösteriyor.
- **Enerji — İşletme:** bakım sözleşmesi, arıza tutanakları, yıllık bakım raporu, ÇED izleme yükümlülükleri.
- **Proje Finans:** kredi sözleşmesi + tadiller (versiyon zinciri), ödeme planı Excel'i, sigorta poliçeleri, banka raporlama formları.
- **Hukuk:** dava dosyaları, duruşma tutanakları, bilirkişi raporu, sözleşmeler.
- **Mali İşler / İdari İşler / İK:** her birinden en az birkaç temel belge (ör. ticaret sicil gazetesi, vergi levhası, personel yönetmeliği).

**Profesyonel seviye — nasıl hazırlanmalı:**
- Önce webde araştır: gerçek bir idareden (EPDK, ETKB/YEGM, TEİAŞ, MSB, Çevre Bakanlığı, belediye, tapu) gelen resmi yazı nasıl görünür (antet, sayı, konu, ilgi, dağıtım, imza bloğu, ekler), kredi/bakım/kira sözleşmesi nasıl yapılandırılır (madde numaralandırma, tanımlar, teminatlar, fesih, ekler). Belgeleri bu formatlara göre üret. İçerik kurgusal olacak; gerçek kurum logosu, gerçek kişi adı veya gerçek belge numarası kullanılmayacak.
- **Excel dosyaları mutlaka olmalı ve basit değil, orta karmaşıklıkta olmalı.** Arayüz testlerinde Excel testi çok önemli (Proje Finans ve Enerji ekranları). Örnekler:
  - Proje Finans: kredi ödeme planı (dönem, anapara, faiz, bakiye, döviz; formüllü), nakit akış tablosu (aylık, birden çok sayfa), DSCR hesabı (tadil öncesi 1,25x / sonrası 1,20x eşiği), banka raporlama formu (Annex tipi).
  - Enerji: santral bazlı aylık üretim ve kapasite faktörü, bakım maliyet takibi (bütçe/gerçekleşen), izin süreçleri takip tablosu (başvuru/sonuç tarihleri, durum).
  - Birden çok sayfa, formül, birleştirilmiş başlık, tarih ve para formatları içermeli; her proje ayrı gösterilmeli (konsolide tablo yok).
- Beklenen sonuç: `seed` komutuyla yüklenen bu belgelerle arayüzdeki her ekran, "backend bekleniyor" kutusu olmadan gerçek veriyle dolmalı. Proje isimleri arayüzle aynı olmalı (Karatepe, Yeşilova, Boztepe, Güneşalan; geliştirmede Kızılova, Akyar, Demirci).

### B-19 · Arayüzü incele, kendi eksiklerini tamamla — **Naci'den**

- `ftansu/AI-BalBal` reposundaki frontend'i ve Claude Design canvas'ını ("X Platformu — Ana Sayfa") incele. Backend'de karşılığı olmayan her ekran/alan için eksiği kendin tespit edip tamamla (bu rapordaki maddeler dahil, ama bunlarla sınırlı değil).
- **Tersine liste:** Backend'inde olup bizim arayüzde **olmayan** her yeteneği bize detaylı olarak yaz: endpoint, ne yaptığı, örnek istek/cevap, hangi ekranda kullanılmasını önerdiğin. Arayüzü buna göre tamamlayacağız.

### B-20 · Zihin haritasıyla (proje bible'ı) uyumsuzluklar

Kurumsal yapı hem backend'de hem frontend'de zihin haritasıyla aynı olmalı. Tespit edilenler:

1. **İK departmanı yok** — eklenmeli.
2. **Enerji altında Üretim/Piyasa birimi yok** — Proje Geliştirme, İnşaat (EPC), İşletme ve Bakım var; Üretim/Piyasa eklenmeli.
3. **"Finans" adı** — zihin haritasında "Proje Finans".
4. **Mali İşler alt birimleri yok** — Muhasebe ve Finansal Muhasebe.
5. **Demo "finans" kullanıcısı hem Finans hem Mali İşler'de** — "tek kişi = tek departman" kuralına ters; arayüz Proje Finans'ın Mali İşler belgesini görememesini örnek senaryo olarak kullanıyor.
6. **Tek proje seçimi (`project_id`)** — Artık proje seçimi yok; tek sohbette birden çok proje konuşulabiliyor. Balbal sorudaki projeleri kendisi tespit etmeli, cevapta her proje ayrı gösterilmeli (birleştirme yok) ve her kaynak kartında `project` alanı olmalı.
7. **İzin süreçleri veri modeli yok** — Enerji/Geliştirme ekranı her proje için adımlar, önkoşullar (adım A bitmeden B başlayamaz), başvuru tarihi, sonuç tarihi, sonuç, olumsuzluk sebebi, belge bağlantısı ve yasal süreler (önlisans 24/36 ay, ÇED başvurusu 90 gün, TEA başvurusu 180 gün) istiyor. Önerilen: `permit_steps` (tanım + önkoşullar) ve `project_permit_status` (proje × adım, tarihler, sonuç, sebep, belge id'leri) tabloları ve `GET /api/projects/{id}/permits`.
8. (Departman yöneticisi rolü → B-08.)


---

### B-21 · EPİAŞ verisi ve günlük tahsilat / aylık mahsuplaşma hesabı — **YER AYRILDI, henüz başlama**

Bu numara, ana ekrandaki "günlük yatan tutar" ve "mahsuplaşmada yatacak tutar" hesabına ayrıldı. Formül, veri modeli, endpoint'ler ve test örnekleri Tansu ile ayrı bir çalışmada, gerçek faturayla doğrulanmış referans Excel'den çıkarıldı. **Tam metin bu dosyaya ayrı bir commit ile eklenecek.**

Metin gelene kadar bilinmesi gereken ve değişmeyecek kararlar:
- Hesap **backend'de** yapılır. Frontend yalnızca gösterir; tarayıcıdan EPİAŞ'a bağlanılmaz, EPİAŞ şifresi yalnızca ortam değişkeninde durur.
- Her proje **ayrı** hesaplanır ve ayrı döner; konsolide toplam satırı dönülmez.
- Oranlar (avans oranı, yönetim bedeli, KDV, YEK payı vb.) koda gömülmez; proje bazlı ve **geçerlilik tarihli** parametre tablosundan okunur.
- Bu repo herkese açık (public) olduğu için gerçek sözleşme oranları, toplayıcı adı ve gerçek EPİAŞ kimlikleri bu dosyaya yazılmaz; testlerde kurgusal değerler kullanılır.

**Talimat:** B-21 tam metni bu dosyaya eklenmeden B-21 için kod yazma, tablo açma, EPİAŞ istemcisi kurma.

---

### B-22 · Kurumsal işlemler: personel izin sistemi (ilk örnek: yıllık izin) — **ADR önce, sonra kod**

> **P-1 bu maddenin tamamına uygulanır.** Aşağıdaki her karar P-1 ile birlikte okunmalıdır.
>
> **Karışmasın:** B-20/7'deki "izin süreçleri" enerji projelerinin **lisans/ruhsat izinleridir** (`permit_steps`). Bu madde **personel izinleri** (yıllık izin vb.) içindir; tablo ve uç adları bilerek farklıdır (`requests`, `leave_*`).

#### 1. Ne istiyoruz (kullanıcının gözünden)

Personel Balbal'a doğal dille yazar: *"Yarın yıllık izin kullanacağım."* Balbal:
1. Bunun bir **soru değil, işlem talebi** olduğunu anlar,
2. Eksik bilgiyi **sohbet içinde** sorar,
3. Bilgi tamamlanınca sohbet içinde bir **izin formu kartı** gösterir,
4. Personel formu kontrol eder, gerekirse düzeltir, **"Onayla ve gönder"** butonuna basar,
5. Form personelin **yöneticisinin** onayına düşer,
6. Yönetici onaylayınca **İK kuyruğuna** düşer; İK işler ve kayıt kapanır,
7. Personel her adımda bildirim alır.

#### 2. Örnek diyalog (hedef davranış)

```
Personel : Yarın yıllık izin kullanacağım.
Balbal   : Anladım, 29.09.2026 Salı için yıllık izin formu hazırlıyorum.
           Tam gün mü, yarım gün mü olacak?
Personel : Tam gün. Aslında perşembeye kadar.
Balbal   : 29.09.2026 Salı – 01.10.2026 Perşembe, 3 iş günü. İşe dönüş: 02.10.2026 Cuma.
           Kalan yıllık izin bakiyeniz bu talepten sonra 11 gün olacak.
           İzindeyken size ulaşılacak bir telefon eklemek ister misiniz? (isteğe bağlı)
Personel : Gerek yok.
Balbal   : [İZİN FORMU KARTI]
           Tür: Yıllık izin · 29.09.2026 – 01.10.2026 · 3 iş günü · Dönüş: 02.10.2026
           Onaylayacak yönetici: <yönetici adı>
           [Düzenle]  [Onayla ve gönder]  [Vazgeç]
           Not: Siz onaylamadan bu form kimseye gönderilmez.
```

Kurallar:
- Balbal **"gönderdim"** demez; yalnızca **"formu hazırladım, onayınızı bekliyor"** der.
- Personel sohbete "onaylıyorum" yazarsa Balbal: *"Göndermek için lütfen formdaki 'Onayla ve gönder' butonunu kullanın."* der. Kayıt oluşturmaz.
- Tarih ifadeleri ("yarın", "pazartesiden itibaren 3 gün", "gelecek hafta cuma") için LLM'e **bugünün tarihi ve kullanıcının saat dilimi (Europe/Istanbul)** verilir; LLM ISO tarih önerir, **backend doğrular** (geçmiş tarih, bitiş < başlangıç, tatil günü başlangıcı vb.). İş günü sayısı ve dönüş tarihi **LLM'e hesaplatılmaz**, backend hesaplar.

#### 3. Form alanları

| Alan | Tip | Zorunlu | Kim doldurur | Not |
|---|---|---|---|---|
| `leave_type` | enum | evet | Balbal önerir, personel onaylar | V0'da yalnızca `annual` açık. `excuse` (mazeret), `unpaid` (ücretsiz) enum'da tanımlı ama kapalı. **Rapor / hastalık izni V0 kapsamında yok** (özel nitelikli sağlık verisi). |
| `start_date` | date | evet | Balbal önerir | Geçmiş tarih olamaz (İK'nın geriye dönük kayıt yetkisi V1). |
| `end_date` | date | evet | Balbal önerir | `>= start_date` |
| `half_day` | enum `none` \| `start_afternoon` \| `end_morning` | evet (varsayılan `none`) | Balbal sorar | |
| `working_days` | decimal (0,5 adımlı) | — | **Backend hesaplar** | Hafta sonu ve `holidays` tablosundaki resmî tatiller düşülür; arife günü yarım gün sayılır. |
| `return_date` | date | — | **Backend hesaplar** | Bitişten sonraki ilk iş günü. |
| `note` | text | hayır | Personel | |
| `contact_during_leave` | text | hayır | Personel | |
| `substitute_user_id` | uuid | hayır | Personel | V0'da yalnızca bilgi amaçlı; vekile yetki devri **yok**. |

Zorunlu alanlar tamamlanmadan taslak **oluşturulmaz**; Balbal sormaya devam eder.

#### 4. Durum makinesi (kod yönetir)

```
            personel onaylar          yönetici onaylar          İK işler
 draft ─────────────────▶ submitted ─────────────────▶ manager_approved ─────────────▶ hr_recorded (son)
   │                        │   │                          │
   │ personel vazgeçer      │   │ yönetici reddeder        │ İK reddeder (ör. bakiye yetersiz)
   ▼                        │   ▼                          ▼
 cancelled                  │  rejected (son)             rejected (son)
   ▲                        │
   │ 72 saat onaylanmazsa   │ yönetici "düzeltme iste" (yorum zorunlu)
 expired (silinir)          ▼
                     changes_requested ──(personel düzeltir + yeniden onaylar)──▶ submitted
```

- `draft`: **yalnızca talep sahibi** görür. 72 saat içinde onaylanmazsa `expired` olur ve veri silinir (denetim kaydında yalnızca "süresi doldu" olayı kalır, form içeriği kalmaz).
- `submitted`: personel onayladı; yöneticinin kuyruğuna düştü. Personel bu aşamada talebi **geri çekebilir** → `cancelled`.
- `changes_requested`: yönetici veya İK formu **düzenlemez**; yorumla geri gönderir. Personel düzeltir, yeniden onaylar → tekrar `submitted` (yönetici onayı yeniden gerekir).
- `manager_approved`: İK kuyruğuna düştü. Personel bu aşamada geri çekmek isterse "iptal talebi" oluşturur (V1); V0'da İK'ya bildirim gider, İK `rejected` ile kapatır.
- `hr_recorded`: izin bakiyesinden düşüldü, kayıt kapandı.
- **Kural:** `draft → submitted` geçişi yalnızca `POST /api/requests/{id}/approve` ile ve yalnızca `request.owner_id == current_user.id` iken yapılabilir. Başka hiçbir yol yok.

#### 5. Kim onaylar

- Onay mercii: `users.manager_id` (yeni alan, nullable).
- `manager_id` boşsa: personelin ana departmanının (`primary_department_id`, B-09) `department_manager`'ı (B-08).
- O da yoksa (ör. genel müdür, departman yöneticisinin kendisi): İK departmanının `department_manager`'ı onaylar.
- Hiçbiri tanımlı değilse: taslak onaylanabilir ama `submitted` olurken **hata döner** (`409 approver_not_configured`), admin'e bildirim gider. Balbal personele "onay mercii tanımlı değil, İK'ya bildirildi" der.
- Kimse **kendi talebini** onaylayamaz (yönetici = talep sahibi olamaz; bu durumda bir üst basamağa geçilir).
- **Vekil yönetici** V0'da yok (V1).

#### 6. İzin bakiyesi ve takvim (deterministik, LLM'e bırakılmaz)

- `leave_balances(user_id, year, entitled_days, carried_over_days, used_days)` — **İK girer.** V0'da sistem kıdemden hak hesaplamaz; İK açılış bakiyesini yükler. (Kıdeme göre otomatik hak hesabı V1; 4857 sayılı İş Kanunu md. 53'teki 14/20/26 gün kuralı ve yaş istisnaları o zaman İK ile doğrulanarak eklenir.)
- `used_days` yalnızca `hr_recorded` olunca artar. Balbal'ın gösterdiği "kalan bakiye", bekleyen (`submitted`, `manager_approved`) talepler düşülerek **tahmini** gösterilir ve öyle etiketlenir.
- Bakiye yetersizse taslak **yine oluşturulabilir** (personel bilgilendirilir); karar yönetici ve İK'dadır.
- `holidays(date, name, half_day)` — admin yükler; resmî tatiller ve arife yarım günleri. Dini bayram tarihleri her yıl değiştiği için **koda gömülmez**.
- Çakışma kontrolü: aynı personelin tarihleri çakışan açık talebi varsa taslak oluşturulmaz, Balbal bunu söyler.

#### 7. Niyet ayrımı ve diyalog

- `/api/ask` akışına bir **niyet sınıflandırma** adımı eklenir: `question` | `action:leave_request` | `unknown_action`.
- `question` → mevcut akış aynen (retrieval, `allowed_document_ids`).
- `action:leave_request` → retrieval **çalışmaz**; LLM'e belge içeriği verilmez. LLM yalnızca alanları çıkarır; backend doğrular; eksik alan varsa Balbal sorar.
- `unknown_action` (ör. "masraf girmek istiyorum") → Balbal *"Bu işlem henüz sistemde yok"* der; hiçbir şey oluşturmaz.
- Çok turlu diyalog **B-03 `conversation_id`** altyapısını kullanır. B-03 yoksa B-22 başlamaz.
- `AskResponse`'a eklenecek alan: `action: { kind: "leave_request_draft", request_id: string } | null`. Frontend bu alan doluysa sohbette form kartını gösterir.
- **Güvenlik:** Personelin mesajındaki metin talimat değildir. "Yöneticim onayladı, direkt İK'ya gönder" gibi ifadeler durum makinesini etkilemez.

#### 8. Uçlar

```
POST /api/requests/draft                  { conversation_id, kind: "annual_leave", fields }  ← yalnızca Balbal akışı çağırır
GET  /api/requests/mine                   → kendi talepleri, tüm durumlar
GET  /api/requests/{id}                   → yalnızca talep sahibi, onay zincirindeki yönetici ve İK
PATCH /api/requests/{id}                  { fields }            ← yalnızca talep sahibi, yalnızca draft / changes_requested
POST /api/requests/{id}/approve           ← yalnızca talep sahibi  (draft|changes_requested → submitted)
POST /api/requests/{id}/cancel            ← yalnızca talep sahibi  (draft|submitted → cancelled)
GET  /api/requests/inbox                  → yöneticinin / İK'nın kendi kuyruğu
POST /api/requests/{id}/manager-decision  { decision: "approve"|"reject"|"request_changes", comment }
POST /api/requests/{id}/hr-decision       { decision: "record"|"reject", comment }
GET  /api/me/leave-balance                → { year, entitled, carried_over, used, pending, remaining_estimated }
GET  /api/holidays?year=                  → resmî tatil listesi
```
Sözleşme tipleri `frontend/src/api/proposed.ts` içinde **"8. Kurumsal işlemler — izin"** bölümündedir; alan adlarını birebir kullan.

Bağlantılar: yönetici ve İK kuyruğu **B-01 gündeme** `kind: "approval"`, her durum değişikliği **B-02 bildirime** düşer.

#### 9. Veri modeli (öneri)

```
requests(id, kind, owner_id, status, fields jsonb, approver_id, created_at, updated_at,
         submitted_at, decided_at, expires_at)
request_events(id, request_id, actor_id, from_status, to_status, comment, created_at)   ← denetim
leave_balances(user_id, year, entitled_days, carried_over_days, used_days)
holidays(date, name, half_day)
users.manager_id (yeni alan)
```
`requests` tablosu genel tutulur (`kind`), çünkü masraf, satın alma vb. ileride aynı tabloya ve aynı durum makinesi iskeletine girecek.

#### 10. KVKK ve gizlilik

- İzin verisi kişisel veridir. Görebilenler: talep sahibi, onay zincirindeki yönetici(ler), İK. `management` rolü dahil **başka kimse** görmez.
- İzin talepleri **retrieval'a, kurumsal hafızaya ve Balbal'ın bilgi tabanına girmez.** Balbal "Ahmet ne zaman izinde?" sorusuna cevap vermez (V1'de yalnızca "ekip takvimi" gibi ayrı ve yetkili bir görünümle).
- `expired` / `cancelled` taslakların içeriği silinir. Kapanmış kayıtlar için saklama süresi **parametre** (`leave_retention_years`); varsayılan boş = silinmez. Süreyi İK ve hukuk belirler, koda yazılmaz.
- Rapor/hastalık izni (özel nitelikli sağlık verisi) V0'da **yok**; eklenirse ayrı ADR gerekir.

#### 11. Arayüz kimde

- Arayüzü **Tansu tarafı** yapar. Görsel kural gereği önce Claude Design canvas'ında tasarlanır (sohbette form kartı, "Taleplerim" listesi, yönetici/İK "Onay kuyruğu"), onaylanır, sonra bu repoya kod olarak gelir.
- Backend tarafı **frontend'e dokunmaz**. Tip değişikliği gerekiyorsa önerisini ayrı liste olarak Tansu'ya verir.

#### 12. Başlama koşulu ve sıra

B-22'nin koduna **ancak şunlar tamamlanınca** başlanır:
1. B-03 çok turlu sohbet (`conversation_id`) çalışıyor,
2. B-08 `department_manager` rolü ve B-09 `primary_department_id` var,
3. B-01 gündem ve B-02 bildirim uçları çalışıyor,
4. B-20/1 İK departmanı eklendi,
5. Bu maddeye dayanan **ADR** Tansu tarafından onaylandı.

Koşullar tamamlanmadıysa yapılacak iş: yalnızca ADR taslağı + migration taslağı + test listesi. **Kod yok.**

#### 13. Kabul kriterleri (testler)

1. Personel onayı olmadan `submitted` olunamaz (P-1/a).
2. Yönetici, İK, admin veya servis hesabı personel adına `approve` çağırırsa **403** (P-1/b).
3. `changes_requested` sonrası personel yeniden onaylamadan yönetici kuyruğuna düşmez (P-1/c).
4. `draft` başka kullanıcının hiçbir listesinde (`inbox`, gündem, bildirim, arama, Balbal) görünmez (P-1/d).
5. Sohbette "onaylıyorum" yazmak durum değiştirmez.
6. İş günü hesabı: hafta sonu, resmî tatil ve arife yarım günü doğru düşülür (en az 5 senaryo).
7. Çakışan tarih → taslak oluşmaz.
8. Onay mercii zinciri (manager_id → department_manager → İK yöneticisi → 409) her basamak için test edilir.
9. Kimse kendi talebini onaylayamaz.
10. İzin talepleri retrieval sonuçlarında hiçbir zaman çıkmaz.
11. 72 saat sonra `draft` → `expired` ve içerik silinir.

#### 14. Kapsam dışı (V0)

Vekile yetki devri, kıdemden otomatik hak hesabı, rapor/hastalık izni, geriye dönük izin girişi, dış İK/bordro sistemine aktarım, ekip izin takvimi, personeller arası serbest yazışma (B-06'daki karar geçerli, V1).

---

### B-23 · Hukuk ve Enerji-Geliştirme: gelen yazılara cevap ve dava evrakına taslak — **ADR önce, sonra kod**

> **P-1 bu maddenin tamamına uygulanır.** Balbal yalnızca taslak yazar. Hiçbir yazı, dilekçe veya cevap sistemden **gönderilmez**; KEP ile otomatik cevap **gitmez**; UYAP'a otomatik bir şey **yüklenmez**.

#### 1. Ne istiyoruz

İki kullanım:
- **Hukuk:** Açılan davalara ve gelen ihtarnamelere karşı **cevap dilekçesi, ihtarnameye cevap, itiraz dilekçesi** taslağı.
- **Enerji / Proje Geliştirme:** Kurumlardan (EPDK, ETKB/YEGM, TEİAŞ, MSB, Çevre ve Şehircilik Bakanlığı / ÇED, belediye, tapu, valilik vb.) gelen resmî yazılara **cevap yazısı** taslağı: ek bilgi/belge talebine cevap, olumsuz sonuç yazısına itiraz veya açıklama.

"KEP" = **Kayıtlı Elektronik Posta.** Resmî yazılar KEP ile gelir.

#### 2. Akış (iki adımlı — özet onayı olmadan taslak yazılmaz)

```
1. Kullanıcı gelen yazıyı/dava evrakını yükler (V0: PDF elle yükleme)
2. Balbal ÖZET çıkarır:
     gönderen kurum/mahkeme · tarih · sayı · konu · ilgi · tebliğ tarihi (kullanıcı girer/onaylar)
     istenen işlem · istenen belgeler · cevap için süre önerisi · ilgili proje(ler)
3. Kullanıcı özeti kontrol eder, düzeltir, ONAYLAR           ← süre ve proje eşleşmesi burada kesinleşir
4. Balbal CEVAP TASLAĞI yazar (kaynak kartlarıyla)
5. Hazırlayan kişi taslağı düzenler ve ONAYLAR               ← P-1 personel onayı
6. İkinci onay: Hukuk'ta departman yöneticisi (sorumlu avukat), Enerji'de Proje Geliştirme yöneticisi
7. Kullanıcı yazıyı sistem DIŞINDA gönderir (KEP/UYAP/elden) ve sistemde "gönderildi" olarak işaretler,
   gönderilen nihai hali PDF olarak yükler
8. Kayıt kapanır; gelen yazı + gönderilen cevap normal belge akışına (versiyon, yetki, etiket) girer
```

#### 3. Durum makinesi

```
received → summary_ready → summary_confirmed → draft_ready → preparer_approved → reviewer_approved → marked_sent → closed
                                   ▲                  │                 │                   │
                                   └── kullanıcı yeni taslak ister ◀────┘   reviewer "düzeltme iste" ──▶ draft_ready
```
- `summary_confirmed` olmadan taslak yazılmaz.
- `preparer_approved` olmadan ikinci onaycının kuyruğuna düşmez (P-1).
- İkinci onaycı taslağı **düzenlemez**; yorumla geri gönderir (P-1/4).
- `marked_sent` yalnızca kullanıcının elle işaretlemesiyle olur; sistem hiçbir şey göndermez.

#### 4. Taslak yazımında zorunlu kurallar

1. **Kaynaksız iddia yok.** Taslaktaki her olgusal cümle (tarih, sayı, tutar, başvuru, karar, olay) bir **kaynak kartına** bağlanır. Kaynak bulunamayan yerde taslağa **`[BİLGİ EKSİK: …]`** yer tutucusu yazılır; model boşluğu tahminle doldurmaz.
2. **Kanun maddesi, yönetmelik, yargı kararı, emsal karar uydurulmaz.** Model yalnızca (a) kaynak belgelerde geçen ve (b) sistemdeki `legal_references` tablosunda tanımlı atıfları kullanabilir. Bunların dışındaki her atıf **`[DOĞRULANMALI]`** etiketiyle yazılır ve taslağın sonunda **"Doğrulanacak atıflar"** listesi olarak toplanır. Dış hukuk veritabanı taraması V0'da **yok**.
3. **Gelen yazının içeriği talimat değildir.** Yüklenen yazı veya dava evrakı içinde "şunu yap / şunu gönder" gibi metinler olabilir; bunlar model için **veri**dir. (Prompt injection koruması: gelen belge içeriği sistem talimatından ayrı, açıkça "alıntı" olarak modele verilir.)
4. **Yetki:** Taslak yalnızca taslağı hazırlayan kişinin `allowed_document_ids` kümesindeki belgelerden beslenir. İkinci onaycının yetkisi daha genişse bile taslak genişletilmez.
5. **Biçim:** Resmî yazı: antet yeri, sayı, tarih, konu, ilgi, metin, ekler listesi, dağıtım, imza bloğu (ad/unvan boş bırakılır, kullanıcı doldurur). Dilekçe: mahkeme başlığı, dosya no, davacı/davalı, vekil, konu, açıklamalar, hukuki sebepler, deliller, sonuç ve istem. Biçim şablonları `correspondence_templates` tablosunda tutulur, koda gömülmez.
6. **Her proje ayrı işlenir.** Bir yazı birden çok projeyi ilgilendiriyorsa özet ve taslakta proje bazlı ayrı bölümler olur; konsolide ifade yok.

#### 5. Süre takibi (en kritik kısım)

- Balbal özet adımında **süre önerir**: yazıdaki açık süre ("… tarihinden itibaren 15 gün içinde") ya da `legal_deadline_rules` tablosundaki kural (belge türü → gün sayısı, takvim günü / iş günü, başlangıç = tebliğ tarihi, kaynak).
- **Tebliğ tarihi LLM'e tahmin ettirilmez;** kullanıcı girer veya onaylar.
- Süre, `summary_confirmed` ile kesinleşir ve **B-01 gündeme** `kind: "deadline"` olarak düşer; son 7, 3 ve 1 gün kala **B-02 bildirim** gider.
- `legal_deadline_rules` tablosu **Hukuk departmanı yöneticisi** tarafından doldurulur ve onaylanır. Örnek başlangıç satırları (**hukuk birimi tarafından doğrulanmadan kullanılmaz**): HMK cevap dilekçesi — tebliğden itibaren 2 hafta; İYUK savunma — tebliğden itibaren 30 gün. Kuralı olmayan belge türü için süre alanı boş kalır ve kullanıcıdan istenir.

#### 6. Enerji / Geliştirme entegrasyonu

- Gelen kurum yazısı, ilgili projenin izin adımına bağlanır (B-20/7: `permit_steps`, `project_permit_status`).
- Olumsuz sonuç yazısı geldiğinde, özet onaylanınca ilgili adıma **sonuç = olumsuz, sonuç tarihi, sebep** işlenir (arayüzdeki nokta çizelgesi bunu gösterir).
- İtiraz/cevap taslağı o adımın başvuru belgelerinden ve kurum yazısından beslenir.

#### 7. Uçlar

```
POST /api/correspondence                     { document_id, department: "hukuk"|"enerji", kind: "incoming_letter"|"lawsuit"|"notice" }
GET  /api/correspondence?status=&department= → kendi departmanının kayıtları (yetkiye göre)
GET  /api/correspondence/{id}                → kayıt + özet + taslak versiyonları + olaylar
POST /api/correspondence/{id}/summary        → Balbal özet üretir
PATCH /api/correspondence/{id}/summary       { fields }       ← kullanıcı düzeltir
POST /api/correspondence/{id}/summary/confirm { service_date, deadline_date, project_ids }
POST /api/correspondence/{id}/drafts         { instructions? } → yeni taslak versiyonu (kaynak kartlarıyla)
PATCH /api/correspondence/{id}/drafts/{v}    { body }         ← yalnızca hazırlayan
POST /api/correspondence/{id}/drafts/{v}/approve              ← yalnızca hazırlayan (P-1)
POST /api/correspondence/{id}/review         { decision: "approve"|"request_changes", comment }  ← yalnızca ikinci onaycı
POST /api/correspondence/{id}/mark-sent      { sent_at, channel: "KEP"|"UYAP"|"elden"|"posta", sent_document_id }
```
Sözleşme tipleri `frontend/src/api/proposed.ts` içinde **"9. Yazışma ve dilekçe taslağı"** bölümündedir.

#### 8. Veri modeli (öneri)

```
correspondence(id, department, kind, incoming_document_id, owner_id, reviewer_id, status,
               summary jsonb, service_date, deadline_date, project_ids uuid[], legal_case_id, created_at, …)
correspondence_drafts(id, correspondence_id, version, body, source_cards jsonb,
                      unverified_references jsonb, created_by, created_at)
correspondence_events(id, correspondence_id, actor_id, from_status, to_status, comment, created_at)
legal_cases(id, court, case_no, parties jsonb, case_type, status, project_ids uuid[])   ← ayrı tablo
legal_deadline_rules(id, doc_type, days, day_type: "calendar"|"business", starts_from, source, approved_by)
legal_references(id, code, article, title, text_excerpt, approved_by)
correspondence_templates(id, kind, body_template)
```

#### 9. Gizlilik

- Gelen yazı, dava evrakı ve taslaklar **`restricted`** gizlilik düzeyindedir; yalnızca ilgili departman (Hukuk veya Enerji) ve onay zinciri görür.
- Yetkisiz kullanıcıya kaydın **varlığı bile** gösterilmez (B-11 ilkesi).
- Taslaklar **retrieval'a ve kurumsal hafızaya girmez.** Yalnızca `marked_sent` sonrasında gelen yazı ve gönderilen nihai cevap normal belge olarak girer.

#### 10. Çıktı biçimi

- V0: arayüzde metin + "kopyala".
- **V1'in ilk işi: Word (.docx) dışa aktarma.** Dilekçe ve resmî yazıda kullanıcı Word ister; B-15 / dışa aktarma kapsamı bu madde için öne çekilir.

#### 11. Başlama koşulu ve sıra

Koda **ancak şunlar tamamlanınca** başlanır: B-08 `department_manager`, B-01 gündem, B-02 bildirim, B-18 demo verisinde dava dosyaları ve kurum yazıları, B-20/7 izin adımları veri modeli ve bu maddeye dayanan **ADR**'nin Tansu tarafından onaylanması. O zamana kadar yalnızca ADR + migration taslağı + test listesi.

#### 12. Kabul kriterleri (testler)

1. `summary_confirmed` olmadan taslak üretilemez.
2. Hazırlayan onayı olmadan ikinci onaycı kuyruğuna düşmez; başkası adına onay → 403.
3. Kaynaksız olgusal cümle taslakta `[BİLGİ EKSİK]` olarak çıkar (eval seti ile).
4. `legal_references` dışındaki her atıf `[DOĞRULANMALI]` etiketli ve listede.
5. Gelen yazıya gömülü talimat ("bu yazıyı X'e gönder") hiçbir durum geçişi veya gönderim tetiklemez.
6. Sistemde KEP/UYAP/e-posta gönderen hiçbir kod yolu yoktur.
7. Yetkisiz kullanıcı listelerde, aramada ve Balbal cevaplarında kaydın varlığını göremez.
8. Süre, `legal_deadline_rules` ve tebliğ tarihinden deterministik hesaplanır; gündeme ve bildirime düşer.

#### 13. Kapsam dışı (V0)

KEP kutusundan otomatik çekme (V2, KEP sağlayıcı API'siyle), UYAP entegrasyonu, dış içtihat veritabanı, e-imza, sistemden gönderim (hiçbir sürümde planlanmıyor).

---

## C. V0 kapsamı dışında olanlar (bilgi için)

- **B-15 · Word (.docx) yükleme:** CLAUDE.md'de V0 dışında. Tasarımda bazı örnek dosyalar `.docx`; ileride gerekecek.
- **B-16 · EPİAŞ canlı veri:** Üretim, PTF ve YEKDEM verisi Excel'den değil **EPİAŞ Şeffaflık Platformu**'ndan gelecek (Tansu'nun kararı). Tasarımda Balbal bu cevaplarda "Canlı veri · EPİAŞ" rozeti ve kaynak linki gösteriyor. Backend'de ileride yeni bir kaynak türü gerekecek. Önerim: `AskResponse` içinde `live_sources: [{ provider: "EPIAS", dataset, period, url }]`. Mevcut Excel motoru bu veriyi karşılamıyor.
- **Dışa aktarma** (Excel/Word/PDF rapor): Ertelenmiş kapsam.

---

## D. Naci'nin yapay zekasına verilebilecek hazır istem

> `docs/BACKEND_GAPS.md` dosyasını oku (ftansu/AI-BalBal reposunda). Kendi CLAUDE.md kurallarına göre şu sırayla phase planı çıkar ve **SORU** işaretli maddelerde benden onay almadan implementasyona geçme:
> 0) B-18 demo veri seti: önce webde gerçek resmi yazı ve sözleşme formatlarını araştır; arayüzdeki tüm süreçleri kapsayan profesyonel, kurgusal belgeler ve orta karmaşıklıkta Excel dosyaları üret. B-19: frontend'i ve canvas'ı incele, eksiklerini tamamla, backend'inde olup bizde olmayan yetenekleri detaylı listele. B-20: kurumsal yapıyı zihin haritasına uyarla (6. ve 7. maddeler SORU — önce Tansu ile netleştir).
> 1) Küçük şema eklemeleri: B-07 (SourceCard'a versiyon id'leri, yetki kontrollü), B-04 (AskResponse.audit_log_id + POST /api/ask/feedback), B-13 (file_kind), B-17 (indirme dosya adı + inline).
> 2) B-01 gündem: önce `expiration_date` ve bekleyen etiket önerilerinden türetilen kısım.
> 3) B-05 rehber (users.title alanı dahil).
> 4) B-08, B-09, B-10, B-11, B-12, B-03 için yalnızca SORU listesi ve önerilen ADR taslakları; kod değil.
> 5) **Değişmez ilke P-1'i her adımda uygula:** Balbal hiçbir aşamada personel onayı olmadan işlem ilerletmez; yalnızca taslak üretir. Durum geçişlerini LLM değil kod yönetir. P-1 madde 7'deki dört testi her işlem modülünde yaz.
> 6) **B-21:** Tam metin bu dosyaya eklenene kadar başlama.
> 7) **B-22 (izin) ve B-23 (yazışma):** Her maddenin "Başlama koşulu" bölümündeki ön koşullar tamamlanmadıysa yalnızca ADR taslağı, migration taslağı ve test listesi üret; **kod yazma**. Koşullar tamamlanınca ADR'yi Tansu'ya onaya sun, onaydan sonra uygula. Maddelerde yazan varsayılan kararları (onay mercii zinciri, form alanları, 72 saat, V0 kapsamı vb.) aynen al; farklı bir şey önermek istiyorsan ADR'de gerekçesiyle yaz, kendin değiştirme.
> 8) **B-23'te yasaklar:** kanun/karar uydurmak, kaynaksız olgusal iddia, sistemden herhangi bir gönderim (KEP, UYAP, e-posta). Her atıf kaynak kartına bağlı ya da `[DOĞRULANMALI]` etiketli olmalı.
> 9) Frontend'e dokunma. B-22 ve B-23 sözleşme tipleri `frontend/src/api/proposed.ts` içinde (bölüm 8 ve 9). Tip değişikliği gerekiyorsa önerini ayrı liste olarak Tansu'ya ver.
> Her endpoint `allowed_document_ids` kuralına uymalı ve en az bir test içermeli. Frontend sözleşmesi `frontend/src/api/proposed.ts` dosyasında; alan adlarını oradaki tiplerle birebir eşleştir.
