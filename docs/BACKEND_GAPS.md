# Balbal Frontend ↔ company-ai Backend — Eksikler ve Uyum Raporu

**Hazırlayan:** Tansu (Claude ile) · **Tarih:** 27.09.2026
**Karşılaştırılan sürümler:** `ntoydem/company-ai` @ `4301968` (Phase 5.4 tamamlandı) ↔ `ftansu/AI-BalBal` (bu repo)
**Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (v160)

---

## Naci için kısa özet

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

Beklenen: `seed` komutuyla yüklenen bu belgelerle arayüzdeki her ekran, "backend bekleniyor" kutusu olmadan gerçek veriyle doldurulabilmeli. Proje isimleri arayüzle aynı olmalı (Karatepe, Yeşilova, Boztepe, Güneşalan; geliştirmede Kızılova, Akyar, Demirci).

---

## C. V0 kapsamı dışında olanlar (bilgi için)

- **B-15 · Word (.docx) yükleme:** CLAUDE.md'de V0 dışında. Tasarımda bazı örnek dosyalar `.docx`; ileride gerekecek.
- **B-16 · EPİAŞ canlı veri:** Üretim, PTF ve YEKDEM verisi Excel'den değil **EPİAŞ Şeffaflık Platformu**'ndan gelecek (Tansu'nun kararı). Tasarımda Balbal bu cevaplarda "Canlı veri · EPİAŞ" rozeti ve kaynak linki gösteriyor. Backend'de ileride yeni bir kaynak türü gerekecek. Önerim: `AskResponse` içinde `live_sources: [{ provider: "EPIAS", dataset, period, url }]`. Mevcut Excel motoru bu veriyi karşılamıyor.
- **Dışa aktarma** (Excel/Word/PDF rapor): Ertelenmiş kapsam.

---

## D. Naci'nin yapay zekasına verilebilecek hazır istem

> `docs/BACKEND_GAPS.md` dosyasını oku (ftansu/AI-BalBal reposunda). Kendi CLAUDE.md kurallarına göre şu sırayla phase planı çıkar ve **SORU** işaretli maddelerde benden onay almadan implementasyona geçme:
> 0) B-18 demo veri seti: arayüzdeki tüm süreçleri kapsayan profesyonel, kurgusal belgeler.
> 1) Küçük şema eklemeleri: B-07 (SourceCard'a versiyon id'leri, yetki kontrollü), B-04 (AskResponse.audit_log_id + POST /api/ask/feedback), B-13 (file_kind), B-17 (indirme dosya adı + inline).
> 2) B-01 gündem: önce `expiration_date` ve bekleyen etiket önerilerinden türetilen kısım.
> 3) B-05 rehber (users.title alanı dahil).
> 4) B-08, B-09, B-10, B-11, B-12, B-03 için yalnızca SORU listesi ve önerilen ADR taslakları; kod değil.
> Her endpoint `allowed_document_ids` kuralına uymalı ve en az bir test içermeli. Frontend sözleşmesi `frontend/src/api/proposed.ts` dosyasında; alan adlarını oradaki tiplerle birebir eşleştir.
