# Ürün 2 Arayüzü — Frontend Tasarımı ve Backend'den Beklenenler

**Kime:** Backend tarafı ve backend tarafının yapay zekâsı
**Hazırlayan:** Ürün sahibi (Claude ile) · **Tarih:** 05.10.2026 · **Durum:** Tasarım onaylı (canvas) · **Backend tarafından uygulanacak**
**Tasarım kaynağı:** Claude Design canvas **"X Platformu — Ürün 2"** (sürüm 39). Bağlantıyı ürün sahibi paylaşır. Bu belge ile canvas farklıysa **canvas esastır**.
**Belge önceliği:** Anayasa (v2.0) > Süreç haritası > `BACKEND_GAPS.md` > bu belge.

> **KARAR (05.10.2026, ürün sahibi): Mevcut geliştirmelerin tamamı backend tarafından uygulanır.** Amaç ürün ayırmak değil, uygulamayı bitirmektir. Bu belgedeki ve canvas'taki her özellik — Ürün 3 olarak işaretlenenler dahil — ürün anahtarıyla (B-25) kapatılmadan geliştirilir. **Ürünlerin ayrılması, tüm arayüz ve backend tamamlandıktan sonra Anayasa'da veya uygulamada ayrıca yapılacaktır.** Ürün etiketleri bu ayrım için bilgi olarak korunur (T-11); bugün iş sırasını veya görünürlüğü belirlemez.
>
> Bu belge mantığı anlatır; uygulama kurgusu geliştiriciye aittir (T-9). Veri modeli ve uç adları öneridir; geliştirici daha iyisini seçebilir, seçtiğini görev sonu notunda yazar. Frontend kodu canvas'tan parça parça gelir; bu PR yalnızca belgedir.
>
> **Hâlâ geçerli olan iki sınır:** (1) P-1 insan onayı ve O-6 — Balbal yalnızca taslak üretir; (2) yeni dış bağlantı (mevzuat dış taraması) güvenlik kuralıdır (T-14, Ç-11), ürün ayrımı değildir: bağlantı eklenmeden önce ürün sahibinin onayı kayda geçer.

---

## İçindekiler

0. [Özet: Ürün 2'de ne değişti](#0-özet-ürün-2de-ne-değişti)
1. [Temel ilkeler](#1-temel-ilkeler)
2. [Ekran envanteri (ürün etiketi + Ek-B atfı)](#2-ekran-envanteri)
3. [Balbal penceresi ve cevap blokları](#3-balbal-penceresi-ve-cevap-blokları)
4. [Onaya bağlı akışlar](#4-onaya-bağlı-akışlar)
5. [İK — Şirket Yapısı (organizasyonun ana verisi)](#5-ik--şirket-yapısı)
6. [İK — Kişiler](#6-ik--kişiler)
7. [İK — İzin, Haklar, Kıdem, Maaş](#7-ik--izin-haklar-kıdem-maaş)
8. [İK — Mevzuat](#8-ik--mevzuat)
9. [Yönetim paneli — yetkiler, ortak klasör, uyumsuzluklar](#9-yönetim-paneli)
10. [Bağlı alanlar: bir değişiklik neyi etkiler](#10-bağlı-alanlar)
11. [Backend'den beklenenler (yeni B kodları)](#11-backendden-beklenenler)
12. [Anayasa uyarıları](#12-anayasa-uyarıları)
13. [Açık sorular (ürün sahibine)](#13-açık-sorular)

---

## 0. Özet: Ürün 2'de ne değişti

| # | Değişiklik | Neden önemli |
|---|---|---|
| 1 | **Yetenek ≠ ekran.** Karşılaştırma, hesap, eksik belge, son tarih listeleri sabit ekran değil; Balbal'ın cevabındaki bloklardır. | Backend cevabı **yapılandırılmış blok** döndürmeli (B-36). |
| 2 | **Balbal penceresinin 3 hali** (yüzen / yan panel / tam ekran sekme). | Konuşma kimliği hal değişiminde kesilmemeli. |
| 3 | **Şirket Yapısı** (İK): isimsiz ağaç, çalışma kopyası, YK onayı, kişi yerleşimi, kişi onayı, devreye alma. | Organizasyonun **tek ana verisi**. Onay akışı, yetki, izin zinciri buradan türer (B-29 … B-31). |
| 4 | **Balbal — Hiyerarşi Düzenleyici**: şema elle değil, Balbal'a yazarak düzenlenir. | Komutlar koddan doğrulanır; Balbal yalnızca taslağa öneri yapar (B-35). |
| 5 | **Pozisyon kapasitesi** ve **bağlılık kuralı** (departmanlar arası raporlama yok). | Kişi yerleşimi ve pozisyon değişikliği bu iki kurala göre kilitlenir (B-30). |
| 6 | **Ortak klasör onay kuralı** (iki yönetici / eş pozisyon). | Belge onay kaydı birden çok onaylayıcıyı desteklemeli (B-33). |
| 7 | **Yapı değişikliği uyumsuzlukları** (yönetim paneli). | Devreye almada klasör yetkileri otomatik açılmaz; talep–yanıt–uygula akışı (B-32). |
| 8 | **Mevzuat sekmesi sadeleşti**: yalnızca kaynak gösterimi + güncellik; ekleme/güncelleme Balbal sohbetiyle. | Dış kaynak taraması Ç-11 kararına bağlı (B-34). |
| 9 | **Kişiler sekmesi salt okunur**; kişi kartından pozisyon değişikliği ve işten çıkış talebi. | Kişi yapısı Şirket Yapısı'ndan beslenir; onaycılar şemadan türer. |

---

## 1. Temel ilkeler

1. **Sadelik.** Ekrana açıklama metni, örnek soru çipi, öneri düğmesi konmaz. **Hiçbir Balbal panelinde öneri çipi yoktur.** Kullanıcı ne istediğini yazar.
2. **Yetenek ≠ ekran (Ü-10).** Anayasa'da bir yeteneğin yazması, onun için sayfa olacağı anlamına gelmez. Ekranda yalnızca ilk bakışta gerekenler durur; gerisi Balbal'a sorulur.
3. **İnsan onayı (P-1, O-6).** Balbal yalnızca taslak üretir. Onay, arayüzdeki açık onay düğmesiyle olur; sohbette "onaylıyorum" yazmak onay değildir.
4. **Ana veri tek yerde.** Kişi–pozisyon–departman–üst pozisyon ilişkisi yalnızca İK'nın Şirket Yapısı'nda yazılır. Yönetim panelindeki rol, kapsam, yönetici, onaycı **türetilir**; orada salt okunurdur (P-8).
5. **Öncül kilit.** Önceki bir bilgi sonraki adımı işlevsiz kılıyorsa sonraki alan silik görünür ve kilitlenir; değer silinmez, uygulanmaz. Örnek: Şirket Yapısı onay sürecindeyken Kişiler'de pozisyon değişikliği kilitli.
6. **Renk dili.** Balbal sekmesi turuncu dolgulu (`#D97706`); Balbal dışındaki açık çalışma sekmeleri açık turuncu. Balbal'ın düzenleyici panelleri de turuncu sekmeyle ayrılır.
7. **İç notlar arayüze girmez.** Canvas'taki yeşil/mavi not kartları geliştirici içindir; ekrana metin olarak konmaz.
8. **Kurgusal veri (P-9).** Canvas'taki tüm kişi, ücret ve tarihler kurgusaldır.

---

## 2. Ekran envanteri

Canvas sayfaları: Proje Finans · Ürün 2 (Balbal penceresi ve onay akışları) · Hukuk · İK · Enerji · Sistem Yönetimi (admin) · Ortak Bileşenler. Mali İşler ve İdari İşler henüz tasarlanmadı.

| Ekran / bileşen (canvas dosyası) | Ürün | Ek-B atfı | Mevcut B kodu | Durum |
|---|---|---|---|---|
| Departman ana sayfaları (`Main`, `Ana-Sayfa-Hukuk`, `Ana-Sayfa-Enerji`) — onay bekleyen Balbal çıktıları, bildirimler, canlı veri | Ürün 2 | "Takip eder / hatırlatır", "Eksik bilgiyi gösterir" | B-01, B-02 | Tasarım onaylı |
| Balbal penceresi, 3 hal (`Balbal-Sohbet`) | Ürün 2 (pencere davranışı ortak) | "Birleştirme sonuçlarını sözlü yanıtlar" | B-03, B-04, **B-36** | Tasarım onaylı |
| Ekip sohbeti + rehber (`Ekip-Sohbet`) | Ürün 1; Balbal'ı sohbete ekleme Ürün 2 (Ü-7.3) | "Personel arası sohbet" | B-05, B-06b | Tasarım onaylı |
| Şablon doldurma onayı (`Sablon-Doldur`) | Ürün 2 | "Kısıtlı raporlama: şablona işler" | B-22 | Tasarım onaylı |
| Yazı taslağı onayı (`Yazi-Taslagi`) | Ürün 2 (olgusal) · hukuki gerekçe Ürün 3 | "Veri taslağı hazırlar" | B-23 | Tasarım onaylı |
| Görüş talebi (`Gorus-Talebi`) | Ürün 2 | "Başka departmandan görüş talep eder" | B-06a | Tasarım onaylı |
| İzin talebi (`Izin-Talebi`) | **Ürün 3 (İK)** — §12 | İK: "izin talebini doğal dille alır" | B-22 (İK kısmı) | Tasarım onaylı, ürün etiketi düzeltilecek |
| İK › Şirket Yapısı (`IK-Sirket-Yapisi`, İK sekmesine gömülü) | Ürün 1 | Ürün 1: "Şirketin departman yapısını tanımlar" | B-09, B-20, **B-29, B-30, B-31** | Tasarım onaylı |
| İK › Balbal — Hiyerarşi Düzenleyici | Ürün 2 (taslak) — §12 | "Veri taslağı hazırlar" | **B-35** | Tasarım onaylı, Ek-B sorusu açık |
| İK › Kişiler (salt okunur + kişi kartı) | Ürün 1 (yapı) · işe giriş/çıkış taslağı Ürün 3 | Ürün 1 yapı; İK: "işe giriş ve işten çıkış işlem taslakları" | **B-30** | Tasarım onaylı |
| İK › İzin Yönetimi, İzin Hakları | Ürün 3 (İK) — §12 | İK izin maddesi | B-22 | Tasarım onaylı |
| İK › Kıdem ve İhbar ("bugün çıkarılsa") | **Ürün 3** — §12 | Varsayım içerir | — | Tasarım onaylı |
| İK › Mevzuat | Ürün 2 (güncellik gösterimi) · dış tarama Ç-11 — §12 | Ek-E/6 | **B-34** | Tasarım onaylı |
| İK › Maaş 🔒 | **Ürün 3 (İK)** — §12 | "Bordro girdisi taslağı" | — | Tasarım onaylı |
| Yönetim › Klasör Erişimi, Pozisyon Yetkileri, kişi kartı, Yetkiyi sına (`Yonetim*`) | Ürün 1 | "Departman yapısı üzerinden yetkiye göre erişim" | B-08, B-26, B-28, **B-33** | Tasarım onaylı |
| Yönetim › Yapı Değişikliği Uyumsuzlukları (`Yonetim-Yapi-Uyum`) | Ürün 1 | Aynı | **B-32** | Tasarım onaylı |
| Bildirimler, Arama, Kullanıcı menüsü, Giriş, Belge Yükle, Departman Belgeleri | Ürün 1 (ortak) | — | B-02, B-14, B-26, B-28 | Mevcut kodla uyumlu |

---

## 3. Balbal penceresi ve cevap blokları

### 3.1 Pencerenin üç hali (tüm departman ana sayfalarında aynı)

1. **Yüzen pencere (varsayılan):** Balbal düğmesinden "şişeden çıkan cin" gibi büyüyerek açılır. Üst çubuğundan taşınır, köşesinden boyutlandırılır. Daralınca geçmiş sorular sütunu gizlenir. Konum ve boyut kullanıcı bazında hatırlanır (frontend).
2. **Yan panel:** Sağa yaslanır, sayfa daralır; kullanıcı sayfaya bakarken konuşmaya devam eder.
3. **Tam ekran sekme:** Sayfa sekmelerinin yanına turuncu dolgulu **"Balbal"** sekmesi gelir. Başka sekmeye geçince Balbal sekmesi açık kalır (turuncu kenarlık), tıklayınca konuşmaya döner. Sekmede "Pencereye küçült" ve "Kapat" vardır.

Geçiş tek tıkla olur; **konuşma kesilmez**. Ekip sohbeti aynı pencere davranışını taşır ama ayrı penceredir (Ü-7).

### 3.2 Cevap blokları

- Cevap = metin + gerektiğinde **yapılandırılmış blok** (tablo, hesap kartı, liste). Blok cevabın içinde doğar; ayrı sayfa değildir.
- Her blok **Ç-7 veri durumunu** taşır: Kesin Veri / Veri Yok / Yeterli Veri Bulunmamaktadır / Çelişkili Veri. Çelişkide iki kaynak birlikte gösterilir, seçim yapılmaz.
- Her satır/hücre kaynağına bağlıdır (belge · sayfa · versiyon · GÜNCEL/TARİHSEL; Excel · sayfa · aralık; dış veri · dönem).
- **Hesap kartı** açılır: girdiler + her girdinin kaynağı + yöntem + kapsam dışı bırakılanlar (T-4). Hesap yalnızca gerçekleşmiş veriyle (toplam, ortalama, fark).
- "Tam ekranda aç" = aynı konuşmanın Balbal sekmesinde açılması.
- Excel'e aktarma cevap üzerinden.
- Projeler varsayılan olarak ayrı; birleştirme yalnızca kullanıcı açıkça isterse (Ü-8).
- Tahmin/projeksiyon istenirse Balbal yapmaz; gerçekleşen ve planlananı ayrı ayrı sunabileceğini söyler.
- "Hafızaya ekle" yalnızca kullanıcının açık isteğiyle (O-7).

### 3.3 Ana sayfada kalanlar

- **Onayınızı Bekleyen Balbal Çıktıları** (tek kutu: şablon, taslak, görüş talebi).
- Bildirimler ve görevler. Bildirim gerekirse soruyu hazır yazılmış halde Balbal'ı açar.
- İşe yarayan canlı bilgiler (örn. piyasa verisi, kurlar) — kaynak ve dönem etiketiyle.

Son tarihler, eksik belgeler, hafıza **liste olarak durmaz**; bildirim olarak düşer veya Balbal'a sorulur.

---

## 4. Onaya bağlı akışlar

Bunlar Balbal cevabından veya ana sayfadaki onay kutusundan açılır; menüde ayrı modül değildir.

| Akış | Mantık | Kural |
|---|---|---|
| Şablon doldurma | Balbal şirket şablonunu gerçekleşmiş veriyle doldurur; %80 altı güvenli alan turuncu, açık onay ister; boş alan tahminle doldurulmaz. | O-1, O-6 |
| Yazı taslağı | Olgusal taslak; gönderim yok, indirme var. | O-6, B-23 yasakları |
| Görüş talebi | Talep ve cevap kurumsal hafızaya yazılır; Balbal ilgili belgeleri bağlar, kullanıcı çıkarabilir. | O-7 |
| İzin talebi | Balbal eksik bilgiyi sorar (tür, sebep); formu doldurur; personel onaylar; İK'nın tür bazlı onay zinciri işler; vekâlet desteklenir. Belge onayından **ayrı**. | **Ürün 3** (§12) |

---

## 5. İK — Şirket Yapısı

İK ana sayfasında **"Şirket Yapısı"** sekmesi. Eski "Hiyerarşi Şeması" tablosu kaldırıldı. Yönetim panelindeki hiyerarşi görünümü bu verinin salt okunur halidir.

### 5.1 Veri modeli (mantık)

- **Düğüm türleri:** `kurul` (Yönetim Kurulu) → `poz` (Genel Müdür) → `dept` (departman) → `birim` (isteğe bağlı) → `poz` (pozisyon).
- Her düğüm: kimlik, ad, üst düğüm, tür. Pozisyonda ek olarak **kapasite** (kaç kişi oturabilir; varsayılan 1).
- **Şema isimsizdir:** kişiler ağaçta değil, ayrı bir **atama** tablosunda (kişi → pozisyon) durur.
- **Sürüm:** her devreye alma yeni bir şema sürümü (v1, v2 …) üretir. Yürürlükteki sürüm salt okunur; değişiklikler **çalışma kopyasında** yapılır.

### 5.2 Bağlılık kuralı (kod zorlar)

- Bir pozisyon yalnızca **kendi departmanındaki** bir pozisyona ya da **üst yönetime** (Genel Müdür / YK) bağlanır. **Departmanlar arası raporlama yoktur.**
- Döngü engeli: bir düğüm kendisine veya altındakilere bağlanamaz.
- Birim, pozisyonlarıyla birlikte başka departmana taşınabilir (pozisyonların departmanı da değişir).
- Kademe atlama engeli: kişi yerleşiminde ve pozisyon değişikliğinde kapasite ve kademe kontrolü (örn. Genel Müdür'ü stajyer pozisyonuna indirmek → aşağı yönlü uyarı + zorunlu gerekçe + YK onayı; §6.3).

### 5.3 Akış (5 adım, üstte adım çubuğu)

| # | Adım | Kim | Ne olur |
|---|---|---|---|
| 1 | Şema çalışması | İK | Çalışma kopyasında kol ekler, adını değiştirir, taşır, departman birleştirir, kapasite değiştirir. **Yalnızca Balbal — Hiyerarşi Düzenleyici ile** (§5.4). Her değişiklik listelenir ve tek tek geri alınabilir. |
| 2 | Şema onayı | Yönetim Kurulu | Onaycı **yeni şemayı** ve hemen altında **"Eski hali · yürürlükteki vN"** şemasını görür. Değişiklik etiketleri (yeni / birleşti / adı değişti / taşındı / kapasite / kaldırıldı) yeni şemada işaretlidir. Onay veya geri gönderme. |
| 3 | Kişi yerleşimi | İK | Çalışanlar mevcut pozisyonlarıyla yeni şemaya taşınır; kaldırılan pozisyondakiler **"Yerleştirilmemiş"** listesine düşer. Kapasite dolu pozisyona yerleştirme yapılamaz. |
| 4 | Kişi onayı | Yönetim Kurulu | Yerleşimi onaylar. |
| 5 | Devreye alma | İK | Tetik noktaları aynı anda güncellenir (§5.6). Devreye alınana kadar **sistem eski şemayla çalışır**. |

Görünümler: Yürürlükteki · Çalışma kopyası · Önceki sürüm. Ağaç başlığında **"Tam ekran"** düğmesi; Esc veya × ile eski görünüme döner.

### 5.4 Balbal — Hiyerarşi Düzenleyici

Sağ panelde iki sekme: **"Seçili Kol"** (koyu; seçili düğümün bilgisi) ve **"Balbal"** (turuncu). Balbal sekmesi şema düzenlemenin **tek** yoludur; elle sürükle-bırak veya form yoktur.

- Selamlama: "Ne değiştirmek istiyorsunuz?" Öneri çipi yok.
- **Kapsam:** yalnızca şirket yapısı. Konu dışı soruya kapsam cevabı verir; proje/belge bilgisi anlatmaz.
- Anladığı işler: birleştir, adını … yap, taşı / bağla, ekle, kaldır, kapasite N, değişiklikleri listele, geri al (son / bir kol / numara ile), sıfırla, onaya gönder.
- **Önce önizleme:** Balbal "Şunu yapayım mı?" der, değişikliği gösterir; kullanıcı **"Taslağa uygula"** veya **"Vazgeç"** seçer. Onaysız hiçbir değişiklik taslağa yazılmaz.
- Kural ihlalinde (örn. departmanlar arası bağlama) Balbal reddeder ve nedenini tek cümleyle söyler.
- Panelin altında: **"YK onayına gönder · N değişiklik"**.

**Backend için önemli:** LLM yalnızca niyeti yapılandırılmış bir komuta çevirir (`{op, hedef, yeni_üst, ad, kapasite}`). Komutun geçerliliğini (bağlılık, döngü, kapasite) **kod** denetler; LLM kural uygulamaz. Canvas'taki demo deterministik bir ayrıştırıcıyla çalışır.

### 5.5 Kapasite

- Her pozisyonun kapasitesi vardır; doluluk = atanmış kişi sayısı.
- Kişi yerleşiminde, işe girişte ve pozisyon değişikliğinde **yalnızca boş kapasiteli** pozisyonlar seçilebilir.
- Kapasite azaltılırsa fazla kişiler "Yerleştirilmemiş"e düşer (kişi yerleşimi adımında).

### 5.6 Devreye alma: güncellenen tetik noktaları

Devreye almada aşağıdakiler **tek işlemde** yeni şemaya geçer:

1. Belge onay akışı (kim kimi onaylar; B-28).
2. İzin onay zinciri ve vekâlet.
3. Departman sayfaları (yeni departmana sayfa, birleşen departmanların sayfası).
4. Görüş talebi ve bildirim alıcı listeleri.
5. Hatırlatma alıcıları (Ürün 2 süre takibi).
6. Balbal erişim filtresi (`allowed_document_ids`, P-2 tek kapı).
7. Kişi listelerinin hiyerarşik sırası.

**Klasör yetkileri otomatik değişmez.** Yeni yapıyla uyumsuz klasör yetkileri yönetim paneline **uyumsuzluk** olarak düşer (§9.3). Çözülene kadar kimseye **otomatik yeni erişim açılmaz**; eski erişimler geçiş kuralına göre korunur veya askıya alınır. Boş pozisyonun onayları bir üste geçer.

---

## 6. İK — Kişiler

### 6.1 Liste (salt okunur)

- Sütunlar: **Kişi · Pozisyon (+rol) · Yönetici · Dosya · Durum**.
- Sıralama: departman başlığı → departman başı → altındakiler (şema ağacının sırası, girintili). Gruplar: departmanlar + **"Yerleştirilmemiş"** + **"Ayrılanlar"**.
- Yapı Şirket Yapısı'nın **yürürlükteki** sürümünden okunur; devreye alma olunca liste kendiliğinden yeniden gruplanır.
- Şirket Yapısı onay sürecindeyken (adım 2–5) üstte kilit şeridi görünür ve pozisyon değişikliği kapalıdır (öncül kilit).

### 6.2 Kişi kartı

Satıra tıklayınca sağda açılır: pozisyon, departman, yönetici, işe giriş, personel dosyası durumu, eksik belgeler, bekleyen talepler. İşlemler: **Pozisyon değiştir**, **Pasife al / Aktife al**.

### 6.3 Pozisyon değişikliği (talep → onay)

- Hedef pozisyonlar departman gruplarıyla listelenir; her birinde doluluk (`dolu/kapasite`). Dolu pozisyon seçilemez.
- **Aşağı yönlü değişiklik** (daha alt kademe) → uyarı + **zorunlu gerekçe**.
- Kişinin ayrılmasıyla **boşalacak pozisyon** varsa uyarı (onayları bir üste geçer).
- **Onaycılar şemadan türer:** hedef pozisyon üst yönetim kademesindeyse **YK**; değilse **mevcut yönetici + yeni yönetici**.
- Talep "beklemede" görünür; talep sahibi geri çekebilir. Onaylanınca atama değişir ve tetik noktaları (§5.6) o kişi için güncellenir.

### 6.4 İşe giriş ve işten çıkış

- **İşe giriş:** ad soyad, pozisyon (yalnızca boş kapasiteli), başlangıç. Departman, rol, yönetici, onaycı otomatik. Ortak alanda `İK / Personel Dosyaları / <kişi> (işe giriş)` klasörü açılır; gerekli belgeler listelenir; Balbal tanıdıkça işaretlenir.
- **İşten çıkış (Pasife al):** ayrılış türü (istifa / işveren feshi / emeklilik / süre sonu), son çalışma günü, vekâlet etkisi (şemadan), türe göre toplanacak belgeler, `(ayrılış)` klasörü. Kişi "Ayrılanlar"a geçer; pozisyon kapasitesi boşalır.
- İşten çıkışın ayrıca onaya bağlanması ve adının "İşten çıkış" olması **açık soru** (§13).

---

## 7. İK — İzin, Haklar, Kıdem, Maaş

Ayrıntılı hesap mantığı canvas'taki İK panolarındadır; burada yalnızca backend'i ilgilendiren çerçeve var. **Bu sekmelerin tamamı Ek-B'ye göre Ürün 3 (İK)'tür (§12).**

- **İzin Yönetimi:** bekleyen talepler; izin türüne göre onay zinciri (İK belirler; tablo olarak, P-8): yıllık / ücretli mazeret → yönetici → İK kaydı; ücretsiz → yönetici → Genel Müdür → İK kaydı; rapor → İK kaydı. Onaycı şemadan; vekâlet belge onayıyla aynı veri.
- **İzin Hakları:** kişi bazında hak / devir / kullanılan / kalan; durumlar (normal, bitmek üzere, ekside, hak doğmadı). Hak kuralları mevzuat parametresinden.
- **Kıdem ve İhbar:** her aktif çalışan için "bugün işten çıkarılsa" kıdem, ihbar, kullanılmayan izin ücreti; her gün 06:00 yeniden hesap; satırda adım adım hesap açıklaması.
- **Maaş 🔒:** her açılışta ikinci doğrulama; brüt→net, net→brüt; bordro Finansal Muhasebe'ye iletilir; açılış denetim kaydına yazılır.

Hesaplar **hesaplama katmanında** yapılır; parametreler (kıdem tavanı, oranlar, tarife) onaylı mevzuat tablosundan gelir (T-4). Canvas'taki değerler yalnızca gösterim içindir.

---

## 8. İK — Mevzuat

Eski tasarımdaki tikler, "+ Ekle" ve "önemli bilgi" sütunu **kaldırıldı**.

### 8.1 Sekme: yalnızca kaynak gösterimi + güncellik

- Sütunlar: **Mevzuat · Referans / Belge · Klasör (ortak alan) · Kullanıldığı yer · Güncellik**.
- Güncellik durumları: **Güncel** · **Değişiklik şüphesi** · **Yeni eklendi**. Şüpheli satırda yalnızca "Balbal'a sor" var.
- İK Balbal'ı soruları zaten bu kaynaklarla cevaplar; sekme cevap üretmez, kaynağı gösterir.

### 8.2 Ekleme / güncelleme: Balbal mevzuat sohbeti

1. İK yan paneldeki Balbal'a sorar: "kıdem tavanı güncel mi?"
2. Balbal mevcut kaynağı ve (bulduysa) daha güncelini **öneri** olarak gösterir.
3. İK okur ve onaylar.
4. **Hangi klasöre ekleneceğini** kullanıcı seçer/onaylar.
5. Balbal belgeyi ortak alana ekler; satır "Yeni eklendi" olur; eski sürüm tarihsel işaretlenir.
6. Mevcut kaynak güncelse İK "güncel" diye teyit eder; durum güncellenir.

**Kısıt:** "Daha güncelini bulmak" dış kaynağa erişim demektir → **Ek-E/6, Ç-11 kararı** gerekir (§12). Karar gelene kadar Balbal yalnızca sistemde zaten bulunan belgeler arasında karşılaştırma yapar; yeni mevzuat belgesini kullanıcı yükler.

---

## 9. Yönetim paneli

Ayrıntı: ürün sahibinin "Yönetim ekranı — kullanıcılar, yetkiler ve onay mekanizması" notu. Burada yalnızca Ürün 2 döneminde eklenenler.

### 9.1 Yapı türetilir

Rol, görüntüleme kapsamı, yönetici, "kimleri onaylar" ve belge akışı Şirket Yapısı'ndan türetilir; panelde salt okunur.

### 9.2 Ortak klasör onay kuralı

Bir klasörde **birden fazla departmanın Değiştirme yetkisi** varsa (sahibi + Değiştirme verilen departman; üst klasörden gelen yetki dahil) o klasör **ortak klasördür**.

- **Departman başı yüklerse:** **eş pozisyon** onaylar (Değiştirme yetkili diğer departmanın başı). Hiyerarşideki üst bu durumda onaycı değildir.
- **Alt pozisyon yüklerse:** **iki yönetici** onaylar (kendi departman başı + eş pozisyon).
- Onaylar birlikte gerekir; biri eksikse belge kaydedilmez. Departman başı yoksa vekili; o da yoksa uyarı.
- Ayrı ayar yoktur; kural klasör yetkilerinden türetilir. Klasör Erişimi'nde başlıkta "Ortak klasör" etiketi; kişi kartındaki "Yetkiyi sına" iki onay adımını gösterir.

### 9.3 Yapı Değişikliği Uyumsuzlukları

Devreye almadan sonra otomatik oluşur. Türler:

| Tür | Örnek | Geçiş kuralı (çözülene kadar) |
|---|---|---|
| Sahiplik | Birleşen departmanların klasörlerinin sahibi kalmadı | Klasör silinmez; eski erişim korunur; yeni erişim kapalı |
| Erişim | Kalkan departmana verilmiş görme yetkisi | Yetki askıya alınır |
| Yeni departman | Yeni departmanın klasörü yok | Sayfa açık, belge ekleme kapalı |
| Kişiye özel | Departmanı değişen kişinin çapraz yetkisi | Askıya alınır; yeniden onay gerekir |

Akış: **Uyumsuzluk açıldı → Sistem güncelleme talebi (ilgili departman başına) → Departman başı yanıtladı → Yönetici uyguladı**. Talep departman başının bildirim ve görevlerine düşer. Uygulama Değişiklik Geçmişi'ne yazılır.

---

## 10. Bağlı alanlar

| Değişiklik | Etkilediği yerler |
|---|---|
| Şema devreye alındı | Kişiler listesi ve grupları · Yönetim panelinde rol/kapsam/yönetici · belge onay akışı · izin zinciri · vekâlet · departman sayfaları · bildirim/hatırlatma alıcıları · Balbal erişim filtresi · uyumsuzluk listesi |
| Pozisyon değişikliği onaylandı | O kişinin yöneticisi, onaycıları, onayladıkları, erişim kapsamı, kişiye özel yetkileri (askıya), kapasite doluluğu |
| İşe giriş / işten çıkış | Kapasite · onay akışı (boşalan pozisyon → bir üst) · personel dosyası klasörü · izin/kıdem/maaş listeleri |
| Klasör yetkisi değişti | Ortak klasör tespiti → onay adımları · Yetkiyi sına sonucu |
| Mevzuat onaylandı | İzin hakkı, kıdem, maaş parametreleri · Balbal İK cevaplarının kaynağı |

Kural: **türetilen hiçbir şey tabloya kopyalanmaz**; her istekte ana veriden hesaplanır veya devreye almada tek işlemde yeniden üretilir (P-8).

---

## 11. Backend'den beklenenler

Etiket: hepsi **HEMEN** (05.10.2026 kararı). Kritik veri modeli kararları için kısa bir ADR yazılır ama iş onu beklemez; ADR görev sonu notuyla birlikte sunulur.

### B-29 — Şirket yapısı sürümleri ve onay paketi · Ürün 1

- Tablolar (mantık): `org_version` (no, durum: taslak/YK onayında/kişi yerleşimi/kişi onayında/hazır/yürürlükte/arşiv, oluşturan, tarihler) · `org_node` (version, id, tür, ad, üst, kapasite) · `org_change` (taslağın yürürlüğe göre değişiklik listesi; tür, hedef, önce/sonra; tek tek geri alınabilir).
- Aynı anda en fazla **bir** açık çalışma kopyası.
- **YK onay paketi:** onaya gönderildiği anın **yeni şema anlık görüntüsü + yürürlükteki şema anlık görüntüsü + değişiklik listesi**. Onaycı ikisini birlikte görür; paket sonradan değişmez (onaydan sonra içerik değişirse onay düşer, P-1).
- Doğrulamalar kodda: bağlılık kuralı, döngü, kapasite ≥ 1, birleştirmede kaynak departmanların tüm pozisyonları hedefe geçer.
- Uç önerisi: `GET /api/org/versions`, `GET /api/org/versions/{v}/tree`, `POST /api/org/drafts`, `POST /api/org/drafts/{id}/changes`, `DELETE …/changes/{cid}`, `POST …/submit`, `POST …/review` (onayla / geri gönder + yorum).

### B-30 — Kapasite, atama ve pozisyon değişikliği talepleri · Ürün 1

- `assignment` (kişi, pozisyon, başlangıç, bitiş) — şemadan ayrı.
- Kişi yerleşimi (B-29 adım 3) taslak atamalar üzerinde çalışır; kapasite aşılamaz; "yerleştirilmemiş" hesaplanır.
- `position_change_request` (kişi, eski/yeni pozisyon, yön: yukarı/yatay/aşağı, gerekçe — aşağıda zorunlu, onaycılar, durum). Onaycılar şemadan: hedef üst yönetimse YK; değilse eski + yeni yönetici.
- Şema onay sürecindeyken pozisyon değişikliği talebi açılamaz (öncül kilit).
- İşe giriş/işten çıkış atama kaydını açar/kapatır; Ürün 3 işlem taslağı (§12) ayrıdır.

### B-31 — Devreye alma ve tetik noktaları · Ürün 1

- Devreye alma **tek transaction**: yeni sürüm "yürürlükte", eski "arşiv"; §5.6'daki tüm türetilmiş yapılar yeniden hesaplanır.
- **Tetik noktası kaydı:** şemaya bağlı her tüketici (onay akışı, izin zinciri, bildirim listeleri, hatırlatmalar, departman sayfaları, erişim filtresi) kayıtlı bir dinleyici olmalı; devreye almada hepsi çağrılır; biri başarısızsa devreye alma geri alınır.
- Devreye almadan önce **etki önizleme** sorgusu: kaç akış, kaç kişi, kaç klasör etkilenir.
- Açık belge onayları ve izin talepleri: devreye alma anında bekleyen talepler hangi şemayla devam eder? → **açık soru** (§13).

### B-32 — Klasör uyumsuzlukları ve sistem güncelleme talepleri · Ürün 1

- Devreye almada klasör yetkileri (B-26) yeni yapıyla karşılaştırılır; uyumsuzluklar `org_mismatch` (tür, klasör, eski sahip/erişen, önerilen muhatap, geçiş durumu, süreç durumu) olarak açılır.
- Geçiş kuralları §9.3 tablosundaki gibi; **otomatik yeni erişim yok**.
- Talep → departman başının bildirim + görevine; yanıt metni; yönetici "uygula" ile yetkiyi değiştirir; Değişiklik Geçmişi'ne yazılır.

### B-33 — Ortak klasör onayı · Ürün 1 (B-28'in genişlemesi)

- Ortak klasör tespiti: klasörde (kalıtımlı) Değiştirme yetkili departman sayısı > 1.
- Onay adımları: `[yükleyen baş değilse kendi departman başı] + [diğer Değiştirme yetkili departmanların başları]`.
- B-28 onay kaydı **birden çok onaycı tarafını** desteklemeli; hepsi onaylamadan belge kaydedilmez; biri geri gönderirse belge geri döner.
- "Yetkiyi sına" ve "Belge eklese ne olur?" aynı motoru kullanır (P-2).

### B-34 — Mevzuat kaynakları ve güncellik · Ürün 2 (dış tarama Ç-11 bekliyor)

- `regulation_source` (başlık, referans, belge id, klasör, kullanıldığı parametreler, durum: güncel/şüpheli/yeni, son kontrol).
- Balbal'ın "daha güncel" önerisi: **şimdilik yalnızca sistemdeki belgelerden**. Dış kaynak (Resmî Gazete vb.) taraması Ek-E/6 kararına kadar yapılmaz.
- Ekleme: kullanıcı onayı + klasör seçimi zorunlu; eski kaynak tarihsel işaretlenir; parametreler yeni kaynaktan güncellenir ve hesaplar yeniden çalışır.

### B-35 — Balbal Hiyerarşi Düzenleyici · Ürün 2 (Ek-B sorusu açık)

- Ayrı bir Balbal kapsamı: yalnızca şirket yapısı; RAG yok; proje/belge bilgisi yok.
- LLM çıktısı **yapılandırılmış komut** (§5.4); doğrulama kodda (B-29 kuralları); geçersiz komut kullanıcıya gerekçeyle döner.
- Önizleme → "Taslağa uygula" → `org_change` kaydı. Balbal doğrudan taslağa yazamaz; kullanıcının düğmesi yazar (P-1).
- Komut ve sonuç denetim kaydına yazılır.

### B-36 — Yapılandırılmış cevap blokları ve pencere sürekliliği · Ürün 2

- `/api/ask` cevabı metne ek olarak blok listesi döndürebilmeli: `table | calc | list`; her blokta Ç-7 durumu; her satır/hücrede kaynak referansı; hesap bloğunda girdiler + yöntem + kapsam dışı.
- Çelişkili veride iki kaynak birlikte döner.
- Konuşma kimliği pencere hali değişiminde aynı kalır (frontend tarafı); geçmiş B-03'e bağlı.
- "Hafızaya ekle" cevap kimliğiyle (B-04, O-7).

---

## 12. Anayasa uyarıları

**05.10.2026 kararıyla bu maddeler geliştirmeyi durdurmaz.** Tüm özellikler uygulanır; aşağıdakiler, uygulama bittikten sonra yapılacak ürün ayrımında (Anayasa veya uygulama) kullanılmak üzere kayıttır. İstisna: madde 3'teki dış bağlantı, güvenlik kuralı olduğu için bağlantı eklenmeden önce ürün sahibinin onayını gerektirir.

1. **İK izin talebi, izin yönetimi, izin hakları, maaş/bordro, işe giriş–çıkış işlem taslağı → Ek-B'de Ürün 3 (İnsan Kaynakları).** Canvas bunları "Ürün 2" sayfasında ve İK ana sayfasında gösteriyor. Ürün ayrımı yapıldığında bu sekmeler ve akışlar `P3` anahtarına bağlanacak (B-25); **şimdilik açık geliştirilir.** `BACKEND_GAPS.md` B-22 de "İK kısmı Ürün 3" diyor; tutarlı.
2. **Kıdem ve İhbar "bugün işten çıkarılsa"** varsayımsal bir hesaptır (gerçekleşmemiş olay) → Ürün 2'nin "yalnızca gerçekleşmiş veri" sınırını aşar → **Ürün 3**. Varsayımlar ekranda açıkça listelenmeli (T-4).
3. **Mevzuat güncelliği için dış kaynak taraması** yeni dış bağlantıdır → **Ek-E/6 + Ç-11 kararı** gerekir. Önce sistem içi karşılaştırma ve kullanıcı yüklemesi yapılır; dış tarama, ürün sahibi kaynağı (Resmî Gazete vb.) onaylayınca eklenir.
4. **Balbal — Hiyerarşi Düzenleyici** Ek-B'de adıyla geçmiyor. En yakın madde Ürün 2 "Veri taslağı hazırlar". Geliştirilir; Ek-B'deki yeri ürün ayrımında netleşir (Ç-11/a ise Ç-3 oybirliği gerekir). Şema yönetimi (ağaç, onay, devreye alma) Ürün 1 "departman yapısını tanımlar" kapsamındadır; soru yalnızca Balbal'ın düzenleme aracı olmasıyla ilgili.
5. **Balbal'ın ekip sohbetine eklenmesi** Anayasa v2.0 Ü-7.3 ile Ürün 2'den itibaren serbest; `BACKEND_GAPS.md` v8.0 §6.3 ise "dahil edilemez" diyor. Anayasa esastır; §6.3'ün güncellenmesi gerekir (bu PR'da yapılmadı, ayrı karar).

---

## 13. Açık sorular

1. Devreye alma anında **bekleyen belge onayları ve izin talepleri** eski şemayla mı tamamlansın, yeni onaycıya mı taşınsın? (Öneri: eskiyle tamamlansın, yeni talepler yeni şemayla.)
2. **İşten çıkış** ayrıca onaya bağlansın mı (yönetici + İK / YK)? Düğmenin adı "Pasife al" yerine **"İşten çıkış"** olsun mu?
3. Kişi onayı adımında (adım 4) YK'ya da **yeni yerleşim + eski yerleşim** karşılaştırması gösterilsin mi?
4. Adım çubuğundaki onaycı etiketi: "Yönetim Kurulu" sabit mi, şirket ayarı mı?
5. Kapasite değişikliği tek başına (yapı değişmeden) YK onayı gerektirsin mi?
6. Hiyerarşi Düzenleyici'nin Ek-B kapsamı (§12/4).
7. Mevzuat dış kaynak kararı (§12/3).
8. Ortak klasörde iki onay **eşzamanlı** mı (tasarım) yoksa sıralı mı?
9. Üçüncü bir departman da Değiştirme yetkiliyse onun başı da onaylasın mı? (Tasarım: evet.)
