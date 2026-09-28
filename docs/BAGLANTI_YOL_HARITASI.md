# Frontend ↔ Backend Bağlantı Yol Haritası — B-25 · B-20 · B-18

**Kime:** Backend tarafı ve backend tarafının yapay zekası
**Hazırlayan:** Ürün sahibi (Claude ile) · **Tarih:** 28.09.2026
**İncelenen backend sürümü:** `ntoydem/company-ai` @ `4301968` (salt okuma)
**Bağlayıcı çerçeve:** [`BACKEND_GAPS.md`](BACKEND_GAPS.md) — bu belge onun §12'deki Sıra 1–2'nin **uygulama planıdır**, yerine geçmez. Çelişki olursa `BACKEND_GAPS.md` esastır.

---

## 0. Özet

**Bu üç madde, `ftansu/AI-BalBal` frontend'ini backend'e bağlayıp Ürün 1'i kendi arayüzüyle, gerçek veriyle test edebilmemiz için ihtiyacımız olan asgari settir.** Üçü bitmeden yapılan bir bağlantı testi, yapı ve veri değişeceği için geçersiz kalır.

**Geçme ölçütü (ürün sahibinin kararı, 28.09.2026):** Bu belgedeki **bütün beklentiler karşılanırsa Ürün 1 testi geçmiş sayılır** ve Ürün 2'ye geçilir. Tek tek izlenecek liste: **§9**.

| Sıra | Kod | Konu | Büyüklük | Neden bağlantı için şart |
|---|---|---|---|---|
| 1 | **B-25** | Ürün katmanı anahtarı | Küçük | Frontend `enabled_products` alanını bekliyor; gelmezse herkes yalnızca P1 görür ve Ürün 2/3 ayrımı sunucuda hiç korunmaz. |
| 2 | **B-20 (1–5)** + **B-09** | Departman yapısı + ana departman | Orta | Departman sayfaları canvas'la birebir aynı olmalı. Bugün İK yok, "Finans" adı yanlış, demo `finans` kullanıcısı iki departmanda. Şimdi test edilen her ekran, yapı değişince yeniden test edilmek zorunda kalır. |
| 3 | **B-18** | Demo veri seti | Büyük | Ekranlar gerçekçi belgeyle dolmadan Ürün 1 test edilemez. İK ve Üretim/Piyasa için hiç belge yok; Hukuk ve Enerji Geliştirme süreçleri eksik. (Proje sayısı şimdilik 2'de kalıyor, §6/1.) |

**Sıra neden bu:** B-25 bağımsız ve küçük, hemen yapılabilir. B-18'deki her belge bir departman slug'ı taşıdığı için B-18, B-20'nin bitmesini bekler (İK belgesi, İK departmanı olmadan yüklenemez).

```
B-25 ─────────────────────────────┐
                                  ├──► Bağlantı günü (§5) ──► §9 listesi tamamen yeşil ──► Ürün 2
B-20 (1–5) + B-09 ──► B-18 ───────┘
```

---

## 1. Backend'in bugünkü durumu (incelemede bulunanlar)

| Konu | Bugün | Dosya |
|---|---|---|
| `/api/auth/me` ve `/api/auth/login` cevabı | `id, username, display_name, role, department_slugs` — `enabled_products` ve ana departman yok | `backend/app/schemas/auth.py` (`CurrentUserResponse`) |
| Şirket/ürün ayarı | Yok. Tüm ayarlar ortam değişkeni (`core/config.py`) | — |
| Departman ağacı | `enerji_grubu` "Enerji Grubu" (Geliştirme, EPC-İnşaat, Bakım) · `finans` "Finans" · `hukuk` · `mali_isler` (alt birim yok) · `idari_isler` · **İK yok** · **Üretim/Piyasa yok** | `backend/app/services/demo_departments_seed.py` |
| Alt birim ve yetki | Alt birim yetki birimi değil; belge `department=<üst slug>` + `subdepartment=<alt slug>` taşır. Bu desen korunmalı. | aynı dosya, docstring |
| Demo kullanıcılar | `yonetim` (management), `finans` (finans + mali_isler ⚠️ P-5'e ters), `hukuk`, `enerji`. Mali İşler, İdari İşler, İK için kullanıcı yok | `demo_users_seed.py`, `demo_departments_seed.py` |
| Seed davranışı | Her seed "yoksa oluştur, **varsa dokunma**". `make reset-demo` yalnızca belgeleri sıfırlıyor, kullanıcı/departman/proje korunuyor | seed dosyaları, `Makefile` |
| Demo projeler | 2 proje: `ANK_RES` "Ankara RES" (işletme), `IZM_RES` "İzmir RES" (geliştirme) | `demo_projects_seed.py` |
| Demo belgeler | 74 belge + 4 Excel. Dağılım: enerji_grubu 36, finans 16, idari_isler 12, hukuk 7, mali_isler 3, **İK 0**. Gizlilik: 68 normal, 5 board, **yalnızca 1 restricted** | `seed_data/master/*.yaml`, `seed_data/excel/manifest.json` |
| Değerlendirme seti | `evaluation/questions.json` proje adlarına **178 satırda** atıf yapıyor | `seed_data/evaluation/questions.json` |
| Son migration | `0008_documents_has_macros` | `backend/alembic/versions/` |

**İyi haber:** Sağlam bir sentetik veri altyapısı zaten var (ledger → prose → PDF/Excel → doğrulayıcılar → manifest → seed). B-18 **sıfırdan yazılmaz, bu altyapı genişletilir** (ADR-013 korunur: generator backend'e import edilmez).

**Dikkat edilmesi gereken en önemli nokta:** Seed'ler mevcut kayıtları değiştirmediği ve `reset-demo` departman/projeye dokunmadığı için, **departman adı değişikliği, yeni departman, üyelik düzeltmesi ve proje adı değişikliği mevcut veritabanlarına ancak Alembic veri migration'ı ile yansır.** Yalnızca seed dosyasını değiştirmek yetmez; yeni kurulumlar doğru, mevcut kurulum yanlış kalır.

---

## 2. Adım 1 — B-25 Ürün katmanı anahtarı (küçük)

Karar metni: `BACKEND_GAPS.md` §1.5.4. Karar verildi, ADR gerekmez.

### 2.1 Yapılacaklar

1. **Migration `0009_company_settings`:** tek satırlık `company_settings` tablosu; `enabled_products` alanı (`text[]`, değerler yalnızca `P1`, `P2`, `P3`). Varsayılan ve demo değeri `{P1,P2,P3}`. Koda gömülmez (P-8).
2. **`CurrentUserResponse`'a `enabled_products: list[Literal["P1","P2","P3"]]` ekle.** Bu şema hem `GET /api/auth/me` hem **`POST /api/auth/login`** tarafından dönüyor; ikisi de alanı taşımalı. Frontend giriş sonrası kullanıcıyı doğrudan login cevabından kuruyor (`pages/Login.tsx`); alan yalnızca `/me`'de olursa kullanıcı sayfayı yenileyene kadar yalnızca P1 görür.
3. **Ortak bağımlılık `require_product("P2")`** (FastAPI dependency). Kapalı katmanda `403` ve gövdede `{"detail": "product_not_enabled"}`. Bugün backend'de Ürün 2/3 ucu yok; mekanizma şimdi yazılır, her Ürün 2/3 ucu eklendiğinde bu bağımlılıkla gelir.
4. **`AskResponse`'a `product_level: "P1"|"P2"|"P3"`** ekle. Bugün her cevap Ürün 1 olduğu için `"P1"` döner.
5. **Demo ve test için CLI komutu:** `python -m app.cli set-enabled-products P1` / `P1,P2` / `P1,P2,P3` (+ `make` hedefi). Bağlantı günü paket değiştirerek ekranları test etmek için gerekli; admin arayüzü şimdilik gerekmez.

### 2.2 Kabul testleri

- `/api/auth/me` ve `/api/auth/login` cevabında `enabled_products` var; demo'da `["P1","P2","P3"]`.
- `set-enabled-products P1` sonrası `/me` → `["P1"]`.
- `require_product("P2")` ile korunan test ucu, P2 kapalıyken `403 product_not_enabled`, açıkken 200.
- Geçersiz değer (`"P4"`) tabloya yazılamaz.
- `/api/ask` cevabında `product_level: "P1"`.

### 2.3 Frontend'e etkisi

Frontend hazır (`frontend/src/api/products.ts`, `types.ts`, `auth/useProduct.ts`, `auth/RequireProduct.tsx`). **Alan adı ve değerler birebir `enabled_products` / `"P1"|"P2"|"P3"` olmalı**; farklı olursa frontend'e haber verilmeli.

---

## 3. Adım 2 — B-20 (1–5) Departman yapısı + B-09 Ana departman (orta)

Karar metni: `BACKEND_GAPS.md` §2.1 ve §2.2. İkisi de HEMEN.

### 3.1 Hedef yapı (zihin haritası, birebir)

| Departman | Önerilen slug | Alt birimler (önerilen slug) |
|---|---|---|
| Proje Finans | `finans` (**değişmez**) | — |
| Mali İşler | `mali_isler` | Muhasebe (`mali_isler_muhasebe`), Finansal Muhasebe (`mali_isler_finansal_muhasebe`) |
| Hukuk | `hukuk` | — |
| İdari İşler | `idari_isler` | — |
| İK | `ik` (**yeni**) | — |
| Enerji | `enerji_grubu` (**değişmez**) | Proje Geliştirme (`enerji_gelistirme`), O&M — İşletme ve Bakım (`enerji_bakim`), EPC — İnşaat (`enerji_epc_insaat`), Üretim/Piyasa (`enerji_uretim_piyasa`, **yeni**) |

**Slug önerisi:** Mevcut slug'lar **değiştirilmesin, yalnızca görünen adlar** değişsin. Frontend slug'ları API'den okuyor ve canvas `finans` slug'ını kullanıyor; slug sabit kalırsa frontend'de hiçbir şey kırılmaz, belgelerin `department` alanı da taşınmaz. (Slug değiştirmek gerekirse önce frontend'e haber verilir — `BACKEND_GAPS.md` §2.1/3.)

### 3.2 Yapılacaklar

1. **Veri migration'ı `0010_department_structure`** (seed yetmez, bkz. §1):
   - Ad değişiklikleri: `finans` → "Proje Finans", `enerji_grubu` → "Enerji", `enerji_gelistirme` → "Proje Geliştirme", `enerji_bakim` → "O&M (İşletme ve Bakım)", `enerji_epc_insaat` → "EPC (İnşaat)".
   - Yeni departmanlar: `ik`; `enerji_uretim_piyasa` (üst: `enerji_grubu`); `mali_isler_muhasebe` ve `mali_isler_finansal_muhasebe` (üst: `mali_isler`).
   - Üyelik düzeltmesi: demo `finans` kullanıcısının `mali_isler` üyeliği silinir (P-5).
   - Alt birimler mevcut desende kalır: yetki birimi üst departmandır, alt birim görüntü/filtre alanıdır.
2. **`demo_departments_seed.py` aynı yapıya güncellenir** — temiz kurulum da migration sonrası ile birebir aynı sonucu versin.
3. **Yeni demo kullanıcılar:** Mali İşler, İdari İşler ve İK için birer `employee` (önerilen kullanıcı adları: `mali`, `idari`, `ik`). Amaç: her departman ana sayfasına o departmanın kullanıcısıyla girilip test edilebilmesi. Görünen adlar kurgusal/jenerik (P-9).
4. **B-09 ana departman:**
   - `users.primary_department_id` (nullable FK). Migration mevcut kullanıcılar için ilk üyelikten doldurur.
   - Kural: ana departman, kullanıcının üyeliklerinden biri olmak zorunda (management/admin için boş olabilir).
   - `CurrentUserResponse`'a **`primary_department_slug: str | None`** eklenir (hem `/me` hem `/login`). Frontend bugün `department_slugs[0]`'ı ana departman sayıyor; bu alan gelince ona geçecek. Alan adı farklı olacaksa frontend'e haber verilmeli.
   - Admin kullanıcı oluşturma/güncellemede ana departman verilmezse ilk departman atanır (admin formunun güncellenmesi ayrı iş, bağlantıyı engellemez).

### 3.3 Kabul testleri

- `GET /api/departments` sonucu §3.1 tablosuyla **birebir** aynı (ad, slug, üst ilişki) — snapshot testi.
- Aynı sonucu hem temiz kurulum (seed) hem mevcut veritabanı (migration) veriyor.
- Demo `finans` kullanıcısı yalnızca `finans` üyesi; Mali İşler belgesini **göremez** (listede, aramada, `/api/ask`'te; `allowed_document_ids` testi).
- Her demo çalışan için `/me` → tek `primary_department_slug`, üyelikleri arasında.
- Enerji kullanıcısı dört alt birimin belgelerini görüyor (alt birim yetki birimi değil).

### 3.4 Bu adımın dışında kalanlar

B-08 (departman yöneticisi rolü) ve B-10 (belge paylaşımı) **ÖNERİLEN KARAR** durumunda; bağlantı için şart değil. Ama B-18'de onları test edecek belgeler şimdiden hazırlanır (§4.2/7).

---

## 4. Adım 3 — B-18 Demo veri seti (büyük)

Karar metni: `BACKEND_GAPS.md` §9. Başlama koşulu: Adım 2 bitmiş olmalı.

### 4.1 Mevcut veriyle hedef arasındaki farklar

| # | Fark | Bugün | Hedef (§9) |
|---|---|---|---|
| 1 | **Proje sayısı ve adları** | Ankara RES (işletme), İzmir RES (geliştirme) | **Karar verildi (28.09.2026): şimdilik 2 proje, mevcut adlarıyla kalır** (§6/1). Canvas'taki 7 proje ertelendi. |
| 2 | İK belgeleri | 0 | Temel belgeler + kurgusal yıllık izin hakkı belgesi + birkaç onaylı izin belgesi |
| 3 | Mali İşler | 3 belge, alt birimsiz | Muhasebe ve Finansal Muhasebe alt birimlerine dağılmış temel belgeler |
| 4 | Enerji — Üretim/Piyasa | 0 | Santral bazlı aylık üretim ve kapasite faktörü (mevcut `Monthly_Production_2026.xlsx` bu alt birime alınabilir) |
| 5 | Enerji — Geliştirme | 14 belge | §9.1'deki tam liste; **her belgede** başvuru tarihi, sonuç tarihi, sonuç ve olumsuzsa gerekçe |
| 6 | Hukuk | 7 belge | Aşamalarıyla dava dosyaları, duruşma tutanağı, bilirkişi raporu, ihtarname, en az bir KEP ile gelmiş kurum yazısı |
| 7 | Gizlilik çeşitliliği | 1 restricted | Her operasyonel departmanda en az 2 `restricted` belge (B-08 testi için hazır olsun) |
| 8 | Excel seti | 4 dosya | §9.2 listesi (aşağıda) |
| 9 | Değerlendirme seti | 178 satırda proje adı | Proje adları değişmediği için mevcut sorular geçerli; yeni belgeler için soru eklenir, eval geçmeli |

**Excel hedefi (§9.2):** orta karmaşıklıkta, çok sayfalı, formüllü, tarih ve para formatlı, **her proje ayrı** (konsolide sayfa yok, P-6).
- Proje Finans: kredi ödeme planı (dönem, anapara, faiz, bakiye, döviz; formüllü) · aylık nakit akış tablosu (çok sayfa) · DSCR hesabı (tadil öncesi 1,25x / sonrası 1,20x eşiği; kredi sözleşmesi tadil zinciriyle tutarlı) · banka raporlama formu (Annex tipi).
- Enerji: santral bazlı aylık üretim ve kapasite faktörü · bakım maliyet takibi (bütçe/gerçekleşen) · izin süreçleri takip tablosu (başvuru/sonuç tarihleri, durum).

### 4.2 Yapılacaklar (önerilen iç sıra)

1. **Projeler aynen kalır** (§6/1): `ANK_RES` Ankara RES ve `IZM_RES` İzmir RES. Yeni belgelerin tamamı bu iki projeye (veya şirket geneline) bağlanır; yeni proje eklenmez, proje adı değiştirilmez, bu yüzden proje migration'ı gerekmez.
2. **Yeni departman belgeleri:** İK, Mali İşler alt birimleri, Enerji Üretim/Piyasa.
3. **Eksik süreç belgeleri:** Enerji Geliştirme tam listesi, Hukuk dava dosyaları ve KEP yazısı.
4. **Excel seti** §4.1'deki listeye tamamlanır.
5. **`restricted` belgeler** eklenir.
6. **Belge paylaşımı adayı (B-10 için):** en az bir kredi sözleşmesi Proje Finans + Hukuk ilişkisine uygun hazırlanır (B-10 onaylanana kadar yalnızca Proje Finans'ta durur).
7. **Prose yalnızca yeni belgeler için** üretilir (LLM bir kez, çıktı commit edilir; `make seed` LLM çağırmaz — mevcut kural).
8. **Doğrulayıcılar ve eval:** isim beyaz listesi (P-9), `validate_documents`, `validate_excel`; yeni belgeler için `questions.json`'a soru eklenir ve `make eval` tekrar geçer.
9. **Boş veritabanında `make seed`**, ardından her demo kullanıcıyla ekran ekran kontrol.

**Profesyonel seviye (§9.2):** önce resmî yazı, sözleşme, dilekçe ve ihtarname formatları araştırılır; içerik kurgusaldır — gerçek kurum logosu, gerçek kişi adı, gerçek belge numarası yok.

### 4.3 Kabul testleri

- Boş veritabanında `make seed` hatasız biter; bütün belgeler `ready` olur.
- Her departmanın demo kullanıcısı kendi departmanında belge görür, **başka departmanın belgesini görmez**.
- Canvas'taki her departman ana sayfası (Proje Finans, Hukuk, Enerji ve alt birimleri) en az bir gerçek belgeyle dolar.
- Her Excel için `GET /api/excel/{id}/inspect` çalışır; hiçbir Excel'de projeler tek sayfada toplanmaz (P-6).
- Kredi sözleşmesi + tadiller versiyon zinciri olarak görünür (`supersedes` / `superseded_by`).
- Enerji Geliştirme belgelerinin her birinde başvuru tarihi, sonuç tarihi ve sonuç var.
- İsim doğrulayıcısı geçer; gerçek kişi/kurum adı yok.
- `make eval` geçer.

---

## 5. Bağlantı günü — kontrol listesi

Üç adım birleştirildikten sonra:

**Backend tarafı**
1. Mevcut veritabanında `make migrate`, ardından `make reset-demo` + `make seed` (veya boş veritabanıyla `make seed`).
2. Backend'in frontend geliştirme sunucusundan erişilebilir adresini paylaş (aynı makinede `http://localhost:8000`; VM'de ise VM IP'si ve açık port).
3. Demo kullanıcı adlarını ve şifre bilgisini güvenli kanaldan ilet (repoya yazılmaz, P-9).

**Frontend tarafı**
1. `cd frontend && npm install && VITE_DEV_API_TARGET=<backend adresi> npm run dev`
2. Vite proxy `/api` isteklerini backend'e iletir; tarayıcı tek origin gördüğü için CORS gerekmez, `httponly` çerez çalışır (backend V0'da `secure=False`).

**Birlikte kontrol**

| # | Kontrol | Beklenen |
|---|---|---|
| 1 | Her demo kullanıcıyla giriş | Doğrudan kendi ana departman sayfası (P-5) |
| 2 | Departman listesi (yönetim kullanıcısı) | §3.1 ile birebir |
| 3 | `finans` kullanıcısı Mali İşler belgesi arar | Bulamaz; Balbal varlığını ele vermez |
| 4 | `set-enabled-products P1` | Ekip sohbeti butonu kaybolur |
| 5 | `set-enabled-products P1,P2,P3` | Ekip sohbeti butonu görünür |
| 6 | Belge listesi, belge detayı, Excel yapısı, versiyon zinciri | Gerçek demo belgeleriyle dolu, her dosya açılır ve indirilir (P-4) |
| 7 | Balbal'a demo sorular | Kaynaklı, yorumsuz cevap; `product_level: "P1"` |

Bu liste, §9'daki T-19…T-25 maddeleridir.

---

## 6. Ürün sahibinin kararını bekleyen noktalar

Bunlar netleşmeden ilgili kısım kodlanmaz (P-10). Önerilen varsayımlar yazıldı; onaylanırsa aynen uygulanır.

1. **Proje sayısı ve adları (B-18) — KARAR VERİLDİ (28.09.2026):** Şimdilik **2 proje**, mevcut adlarıyla: Ankara RES (işletme), İzmir RES (geliştirme). Canvas'taki 7 proje adı (Karatepe, Yeşilova, Boztepe, Güneşalan, Kızılova, Akyar, Demirci) ve ek projeler **ertelendi**; ileride açılırsa ledger, veritabanı migration'ı ve eval seti birlikte güncellenir. Bu dönemde demo verideki proje adlarının canvas'tan farklı olması **sapma sayılmaz**.
2. **Slug'lar sabit kalsın mı?** Önerilen: evet, yalnızca görünen adlar değişsin (§3.1).
3. **Enerji alt birim adları.** Önerilen: zihin haritasındaki adlar birebir — "Proje Geliştirme", "O&M (İşletme ve Bakım)", "EPC (İnşaat)", "Üretim/Piyasa"; üst departman adı "Enerji".
4. **Ürün ayarının yeri.** Önerilen: `company_settings` tablosu (`BACKEND_GAPS.md` §1.5.4'teki karar). Uygulama tek şirketli olduğu için tek satır yeterli.

---

## 7. Frontend tarafında bizim yapacaklarımız

Backend adımları ilerledikçe, frontend reposunda (önce canvas'ta görünür değişiklik varsa canvas, sonra kod):

| Tetikleyen | Frontend işi |
|---|---|
| B-25 | 403 `product_not_enabled` cevabı için "Bu özellik paketinizde yok" durumu; `AskResponse.product_level` tipi |
| B-09 | `department_slugs[0]` yerine `primary_department_slug` kullanımı (`Home.tsx`, `ShellContext.tsx`) |
| B-20 | İK, Mali İşler alt birimleri, Üretim/Piyasa için departman sayfalarının kontrolü (adlar API'den geliyor, slug sabit kalırsa kod değişikliği beklenmiyor) |
| B-18 | Proje adları aynı kaldığı için Balbal örnek soruları (`lib/strings.ts`, "Ankara RES") geçerli; değişiklik gerekmez |
| Bağlantı günü | §5 kontrol listesi ve bulunan hataların bu belgeye/`BACKEND_GAPS.md`'ye işlenmesi |

---

## 8. Her adım sonunda beklenen özet

`BACKEND_GAPS.md` §1.6 ve §13/10 geçerli. Her adım (B-25, B-20+B-09, B-18) sonunda kısa özet:

- Ne yapıldı, hangi ürün katmanına ait
- Değişen dosyalar ve migration'lar
- Eklenen testler (bu belgedeki kabul testleri tek tek işaretli)
- Açık kalan sorular
- **Bu belgeden sapmalar** (yoksa "yok")

---

## 9. Ürün 1 testi — geçme ölçütü ve takip listesi

**Kural:** Aşağıdaki maddelerin **hepsi** "Geçti" olduğunda Ürün 1 testi geçmiş sayılır ve Ürün 2'ye odaklanılır. Bir madde kalırsa düzeltilir ve o madde (ve etkilediği maddeler) tekrar test edilir. Maddeler bu belgedeki kabul testlerinin birebir kopyasıdır; yeni beklenti eklenmedi.

Test, **`ftansu/AI-BalBal` arayüzü üzerinden** yapılır (T-19…T-25); backend testleri (T-01…T-18) backend tarafının otomatik testleri ve özetiyle kanıtlanır.

| No | Adım | Beklenti | Kaynak | Durum |
|---|---|---|---|---|
| T-01 | B-25 | `/api/auth/me` ve `/api/auth/login` cevabında `enabled_products` var; demo'da `["P1","P2","P3"]` | §2.2 | ☐ |
| T-02 | B-25 | `set-enabled-products P1` sonrası `/me` → `["P1"]` | §2.2 | ☐ |
| T-03 | B-25 | `require_product("P2")` ile korunan uç, P2 kapalıyken `403 product_not_enabled`, açıkken 200 | §2.2 | ☐ |
| T-04 | B-25 | Geçersiz değer (`"P4"`) yazılamaz | §2.2 | ☐ |
| T-05 | B-25 | `/api/ask` cevabında `product_level: "P1"` | §2.2 | ☐ |
| T-06 | B-20 | `GET /api/departments` §3.1 tablosuyla birebir (ad, slug, üst ilişki) | §3.3 | ☐ |
| T-07 | B-20 | Temiz kurulum (seed) ve mevcut veritabanı (migration) aynı sonucu veriyor | §3.3 | ☐ |
| T-08 | B-20 | Demo `finans` kullanıcısı yalnızca Proje Finans üyesi; Mali İşler belgesini listede, aramada ve Balbal'da göremez | §3.3 | ☐ |
| T-09 | B-09 | Her demo çalışan için `/me` → tek `primary_department_slug`, üyelikleri arasında | §3.3 | ☐ |
| T-10 | B-20 | Enerji kullanıcısı dört alt birimin belgelerini görüyor | §3.3 | ☐ |
| T-11 | B-18 | Boş veritabanında `make seed` hatasız; bütün belgeler `ready` | §4.3 | ☐ |
| T-12 | B-18 | Her departmanın demo kullanıcısı kendi belgelerini görür, başka departmanınkini görmez | §4.3 | ☐ |
| T-13 | B-18 | Canvas'taki her departman ana sayfası en az bir gerçek belgeyle dolu | §4.3 | ☐ |
| T-14 | B-18 | Her Excel için `/api/excel/{id}/inspect` çalışıyor; hiçbir Excel projeleri tek sayfada toplamıyor (P-6) | §4.3 | ☐ |
| T-15 | B-18 | Kredi sözleşmesi + tadiller versiyon zinciri olarak görünüyor | §4.3 | ☐ |
| T-16 | B-18 | Enerji Geliştirme belgelerinin her birinde başvuru tarihi, sonuç tarihi ve sonuç var | §4.3 | ☐ |
| T-17 | B-18 | İsim doğrulayıcısı geçiyor; gerçek kişi/kurum adı yok (P-9) | §4.3 | ☐ |
| T-18 | B-18 | `make eval` geçiyor | §4.3 | ☐ |
| T-19 | Arayüz | Her demo kullanıcıyla giriş → doğrudan kendi ana departman sayfası (P-5) | §5/1 | ☐ |
| T-20 | Arayüz | Yönetim kullanıcısında departman listesi §3.1 ile birebir | §5/2 | ☐ |
| T-21 | Arayüz | `finans` kullanıcısı Mali İşler belgesini bulamaz; Balbal varlığını ele vermez | §5/3 | ☐ |
| T-22 | Arayüz | Paket P1 → ekip sohbeti butonu görünmez | §5/4 | ☐ |
| T-23 | Arayüz | Paket P1,P2,P3 → ekip sohbeti butonu görünür | §5/5 | ☐ |
| T-24 | Arayüz | Belge listesi, belge detayı, Excel yapısı, versiyon zinciri gerçek belgelerle dolu; her dosya açılıyor ve iniyor (P-4) | §5/6 | ☐ |
| T-25 | Arayüz | Balbal demo sorularına kaynaklı, yorumsuz cevap veriyor; `product_level: "P1"` | §5/7 | ☐ |

**Durum işaretleme:** ☐ test edilmedi · ✅ geçti · ❌ kaldı (yanına kısa not). Arayüz testlerini (T-19…T-25) ürün sahibi yapar ve işaretler; backend maddelerini (T-01…T-18) backend tarafı her adımın özetinde işaretler (§8).
