# Naci Notu — ÜRÜN 2 ve sonrası (Balbal tam arayüzü)

**Kimden:** Ürün sahibi (Claude ile) · **Kime:** Naci ve Naci'nin AI'ı · **Son güncelleme:** 09.10.2026 (veriler canvas ile tekleştirildi · Bölüm F: yükümlülük bağı · Bölüm G: dış veri bağlantı katmanı)
**Tasarım kaynağı:** Claude Design canvas "X Platformu — Ürün 2" (ad tarihsel; Balbal uygulamasının tam arayüzü). Repoda tek kopya `tasarim/canvas/` (PR #12, güncel sürüm `1791471743-c7f2`, v135); okuma kılavuzu `tasarim/README.md`. Canvas ile fark varsa **canvas esastır**.

> ## ⛔ ONAY GELMEDEN BAŞLANMAZ
> Bu nottaki hiçbir iş (kod, uç, şema, migration, ADR uygulaması) ürün sahibinden **Kayıtlı Kanalda (PR ya da issue) yazılı onay** gelmeden başlamaz. Onay iş bazında verilir: "Bölüm D.5 başlayabilir" gibi. Sohbetteki ifade onay değildir (Ç-1 Onay Kanıtı).
> Bu arada yapılabilecek tek şey: notu okumak, soruları ve çelişkileri yazmak, demo belgeleri üretmek (Ürün 1 notu Bölüm D–E).
> Notun içinde geçen eski "05.10.2026 — tamamı uygulanır / HEMEN" ifadeleri bu kuralla **askıya alınmıştır**; sıra: frontend tamamlanır → ürün sahibi iş bazında onay verir → backend uygular.

> **Naci'ye yalnızca iki not var:** [`NACI_NOTU_URUN1.md`](NACI_NOTU_URUN1.md) (✅ hemen başlanabilir) ve bu not. Önceki `BALBAL_ARAYUZ.md`, `NACI_NOTU_2026-10-06.md` §7 ve `NACI_NOTU_2026-10-08.md` buraya taşındı.
> **Belge önceliği:** Anayasa (v2.0) > Süreç haritası > `BACKEND_GAPS.md` > bu not.
> **Ürün etiketi notu:** Bölüm B'deki B-29…B-33 katman olarak "Ürün 1" etiketlidir (şema yönetimi Tanıma kapsamında), ama canvas'taki Balbal tam arayüzünün parçasıdır; bu yüzden bu nottadır ve onay bekler.

## İçindekiler

| Bölüm | Konu | Kaynak tarihi |
|---|---|---|
| A | Genel ilkeler ve sıra | 05–08.10 |
| B | Balbal arayüzü: pencere ve cevap blokları, onay akışları, İK Şirket Yapısı, Kişiler, İzin/Kıdem, Mevzuat, Yönetim paneli, bağlı alanlar · **B-29…B-36** · Anayasa uyarıları · açık sorular | 05–06.10 |
| C | Mali İşler, İdari İşler, Akış Zincirleri 1–3 kuralları · **B-37…B-42** | 06–07.10 |
| D | **Ödeme zincirleri ve Finansal Muhasebe** (08.10): TEMEL İLKE (belgeden öğrenme), ortak onay kuralı, Zincir 4–7, ödeme listesi (Seçilileri öde, Acil öde), banka ekstresinden otomatik tanıma, masraf / avans ve "+ Ödeme talebi" menüsü, açık kararlar | 08.10 |
| E | Anayasa uyarıları (Ürün 2) | 06–08.10 |
| F | **Yükümlülük bağı** (09.10): yükümlülük · olay · bağ modeli, zincirlerle uyum, ölçüm kaydı · Anayasa v2.1 taslağı (PR #15) O-13 | 09.10 |
| G | **Dış veri bağlantı katmanı** (09.10): EPİAŞ, e-Fatura, banka, TCMB, ERP — "bağlanacakmış gibi" altyapı, demo kaynak formatları, gerçek PTF/YEKDEM, uyarıların kaynaktan bağımsızlığı | 09.10 |

Atıflar: `§D.5.3` = bu notun D bölümü 5.3. Başka belgeye atıf dosya adıyla yazılır.

---

## A. Genel ilkeler ve sıra

1. **Balbal şirketin hareket alanını daraltmaz, sorumluluk almaz.** Riskli durumda not düşer; işlemi yapan kişi "Onaylıyorum" der, kayıt loglanır. Tek istisna: Balbal'ın otomatik doldurduğu bilgi için kullanıcı onayı zorunludur (§D.2).
2. **Süreç akışı şirketin sorumluluğundadır.** Kim onaylar, hangi sırayla — şirket nasıl talep ederse sistem öyle kurulur; kurulan akış tutarlı çalışmalı ("sistem tutmalı").
3. **Ödeme akışı:** zincirlerde "talimat imzası" aşaması yoktur. Her zincir Finansal Muhasebe'ye gelir → onaylarsa kayıt ödeme listesine düşer, tarihi kendi nakit akışına göre belirler → talimat ve ıslak imza Finansal Muhasebe'nin arka plan işidir → ödeme → sistem kayda "ödendi" yazar.
4. **Fatura tek kapıdan girer** (e-Fatura entegratörü → Muhasebe). Balbal faturayı ödemeden önce de sonra da gelse PO / sözleşmeyle eşleştirir. PO; ödeme + teslim + fatura eşleşince kapanır. Kayıt mantığı: önce ödendiyse 159 kapanışı, fatura önce geldiyse 320.
5. **Red → revize:** reddedilen talep aynı PO / kayıt üzerinde düzeltilip yeniden gönderilir; red gerekçesi ve değişen alanlar geçmişte kalır.
6. **Balbal ERP değildir;** ERP'ye yazmaz, kayıt önerir.
7. Frontend tamamlanmadı; canvas değişebilir. Canvas ile not çelişirse canvas geçerlidir.

---

## B. Balbal arayüzü — ekranlar ve backend beklentileri (B-29…B-36)

> Bu bölüm 05.10 durumunu anlatır (06.10 güncellemesiyle). İçinde geçen "05.10 kararı: tamamı uygulanır" ifadeleri yukarıdaki ⛔ kuralla askıya alınmıştır.


### B.0 Özet: bu tasarımda ne var

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

### B.1 Temel ilkeler

1. **Sadelik.** Ekrana açıklama metni, örnek soru çipi, öneri düğmesi konmaz. **Hiçbir Balbal panelinde öneri çipi yoktur.** Kullanıcı ne istediğini yazar.
2. **Yetenek ≠ ekran (Ü-10).** Anayasa'da bir yeteneğin yazması, onun için sayfa olacağı anlamına gelmez. Ekranda yalnızca ilk bakışta gerekenler durur; gerisi Balbal'a sorulur.
3. **İnsan onayı (P-1, O-6).** Balbal yalnızca taslak üretir. Onay, arayüzdeki açık onay düğmesiyle olur; sohbette "onaylıyorum" yazmak onay değildir.
4. **Ana veri tek yerde.** Kişi–pozisyon–departman–üst pozisyon ilişkisi yalnızca İK'nın Şirket Yapısı'nda yazılır. Yönetim panelindeki rol, kapsam, yönetici, onaycı **türetilir**; orada salt okunurdur (P-8).
5. **Öncül kilit.** Önceki bir bilgi sonraki adımı işlevsiz kılıyorsa sonraki alan silik görünür ve kilitlenir; değer silinmez, uygulanmaz. Örnek: Şirket Yapısı onay sürecindeyken Kişiler'de pozisyon değişikliği kilitli.
6. **Renk dili.** Balbal sekmesi turuncu dolgulu (`#D97706`); Balbal dışındaki açık çalışma sekmeleri açık turuncu. Balbal'ın düzenleyici panelleri de turuncu sekmeyle ayrılır.
7. **İç notlar arayüze girmez.** Canvas'taki yeşil/mavi not kartları geliştirici içindir; ekrana metin olarak konmaz.
8. **Kurgusal veri (P-9).** Canvas'taki tüm kişi, ücret ve tarihler kurgusaldır.

---

### B.2 Ekran envanteri

Canvas sayfaları: Proje Finans · Ürün 2 (Balbal penceresi ve onay akışları) · Hukuk · İK · Enerji · Sistem Yönetimi (admin) · Ortak Bileşenler. Mali İşler, İdari İşler ve Akış Zincirleri 06.10.2026'da eklendi (taslak) — bkz. Bölüm C ve D.

| Ekran / bileşen (canvas dosyası) | Ürün | Ek-B atfı | Mevcut B kodu | Durum |
|---|---|---|---|---|
| Departman ana sayfaları (`Main`, `Ana-Sayfa-Hukuk`, `Ana-Sayfa-Enerji`) — onay bekleyen Balbal çıktıları, bildirimler, canlı veri | Ürün 2 | "Takip eder / hatırlatır", "Eksik bilgiyi gösterir" | B-01, B-02 | Tasarım onaylı |
| Balbal penceresi, 3 hal (`Balbal-Sohbet`) | Ürün 2 (pencere davranışı ortak) | "Birleştirme sonuçlarını sözlü yanıtlar" | B-03, B-04, **B-36** | Tasarım onaylı |
| Ekip sohbeti + rehber (`Ekip-Sohbet`) | Ürün 1; Balbal'ı sohbete ekleme Ürün 2 (Ü-7.3) | "Personel arası sohbet" | B-05, B-06b | Tasarım onaylı |
| Şablon doldurma onayı (`Sablon-Doldur`) | Ürün 2 | "Kısıtlı raporlama: şablona işler" | B-22 | Tasarım onaylı |
| Yazı taslağı onayı (`Yazi-Taslagi`) | Ürün 2 (olgusal) · hukuki gerekçe Ürün 3 | "Veri taslağı hazırlar" | B-23 | Tasarım onaylı |
| Görüş talebi (`Gorus-Talebi`) | Ürün 2 | "Başka departmandan görüş talep eder" | B-06a | Tasarım onaylı |
| İzin talebi (`Izin-Talebi`) | **Ürün 3 (İK)** — §B.12 | İK: "izin talebini doğal dille alır" | B-22 (İK kısmı) | Tasarım onaylı, ürün etiketi düzeltilecek |
| İK › Şirket Yapısı (`IK-Sirket-Yapisi`, İK sekmesine gömülü) | Ürün 1 | Ürün 1: "Şirketin departman yapısını tanımlar" | B-09, B-20, **B-29, B-30, B-31** | Tasarım onaylı |
| İK › Balbal — Hiyerarşi Düzenleyici | Ürün 2 (taslak) — §B.12 | "Veri taslağı hazırlar" | **B-35** | Tasarım onaylı, Ek-B sorusu açık |
| İK › Kişiler (salt okunur + kişi kartı) | Ürün 1 (yapı) · işe giriş/çıkış taslağı Ürün 3 | Ürün 1 yapı; İK: "işe giriş ve işten çıkış işlem taslakları" | **B-30** | Tasarım onaylı |
| İK › İzin Yönetimi, İzin Hakları | Ürün 3 (İK) — §B.12 | İK izin maddesi | B-22 | Tasarım onaylı |
| İK › Kıdem ve İhbar ("bugün çıkarılsa") | **Ürün 3** — §B.12 | Varsayım içerir | — | Tasarım onaylı |
| İK › Mevzuat | Ürün 2 (güncellik gösterimi) · dış tarama Ç-11 — §B.12 | Ek-E/6 | **B-34** | Tasarım onaylı |
| İK › Maaş 🔒 | **Ürün 3 (İK)** — §B.12 | "Bordro girdisi taslağı" | — | Tasarım onaylı |
| Yönetim › Klasör Erişimi, Pozisyon Yetkileri, kişi kartı, Yetkiyi sına (`Yonetim*`) | Ürün 1 | "Departman yapısı üzerinden yetkiye göre erişim" | B-08, B-26, B-28, **B-33** | Tasarım onaylı |
| Yönetim › Yapı Değişikliği Uyumsuzlukları (`Yonetim-Yapi-Uyum`) | Ürün 1 | Aynı | **B-32** | Tasarım onaylı |
| Bildirimler, Arama, Kullanıcı menüsü, Giriş, Belge Yükle, Departman Belgeleri | Ürün 1 (ortak) | — | B-02, B-14, B-26, B-28 | Mevcut kodla uyumlu |

---

### B.3 Balbal penceresi ve cevap blokları

#### B.3.1 Pencerenin üç hali (tüm departman ana sayfalarında aynı)

1. **Yüzen pencere (varsayılan):** Balbal düğmesinden "şişeden çıkan cin" gibi büyüyerek açılır. Üst çubuğundan taşınır, köşesinden boyutlandırılır. Daralınca geçmiş sorular sütunu gizlenir. Konum ve boyut kullanıcı bazında hatırlanır (frontend).
2. **Yan panel:** Sağa yaslanır, sayfa daralır; kullanıcı sayfaya bakarken konuşmaya devam eder.
3. **Tam ekran sekme:** Sayfa sekmelerinin yanına turuncu dolgulu **"Balbal"** sekmesi gelir. Başka sekmeye geçince Balbal sekmesi açık kalır (turuncu kenarlık), tıklayınca konuşmaya döner. Sekmede "Pencereye küçült" ve "Kapat" vardır.

Geçiş tek tıkla olur; **konuşma kesilmez**. Ekip sohbeti aynı pencere davranışını taşır ama ayrı penceredir (Ü-7).

#### B.3.2 Cevap blokları

- Cevap = metin + gerektiğinde **yapılandırılmış blok** (tablo, hesap kartı, liste). Blok cevabın içinde doğar; ayrı sayfa değildir.
- Her blok **Ç-7 veri durumunu** taşır: Kesin Veri / Veri Yok / Yeterli Veri Bulunmamaktadır / Çelişkili Veri. Çelişkide iki kaynak birlikte gösterilir, seçim yapılmaz.
- Her satır/hücre kaynağına bağlıdır (belge · sayfa · versiyon · GÜNCEL/TARİHSEL; Excel · sayfa · aralık; dış veri · dönem).
- **Hesap kartı** açılır: girdiler + her girdinin kaynağı + yöntem + kapsam dışı bırakılanlar (T-4). Hesap yalnızca gerçekleşmiş veriyle (toplam, ortalama, fark).
- "Tam ekranda aç" = aynı konuşmanın Balbal sekmesinde açılması.
- Excel'e aktarma cevap üzerinden.
- Projeler varsayılan olarak ayrı; birleştirme yalnızca kullanıcı açıkça isterse (Ü-8).
- Tahmin/projeksiyon istenirse Balbal yapmaz; gerçekleşen ve planlananı ayrı ayrı sunabileceğini söyler.
- "Hafızaya ekle" yalnızca kullanıcının açık isteğiyle (O-7).

#### B.3.3 Ana sayfada kalanlar

- **Onayınızı Bekleyen Balbal Çıktıları** (tek kutu: şablon, taslak, görüş talebi).
- Bildirimler ve görevler. Bildirim gerekirse soruyu hazır yazılmış halde Balbal'ı açar.
- İşe yarayan canlı bilgiler (örn. piyasa verisi, kurlar) — kaynak ve dönem etiketiyle.

Son tarihler, eksik belgeler, hafıza **liste olarak durmaz**; bildirim olarak düşer veya Balbal'a sorulur.

---

### B.4 Onaya bağlı akışlar

Bunlar Balbal cevabından veya ana sayfadaki onay kutusundan açılır; menüde ayrı modül değildir.

| Akış | Mantık | Kural |
|---|---|---|
| Şablon doldurma | Balbal şirket şablonunu gerçekleşmiş veriyle doldurur; %80 altı güvenli alan turuncu, açık onay ister; boş alan tahminle doldurulmaz. | O-1, O-6 |
| Yazı taslağı | Olgusal taslak; gönderim yok, indirme var. | O-6, B-23 yasakları |
| Görüş talebi | Talep ve cevap kurumsal hafızaya yazılır; Balbal ilgili belgeleri bağlar, kullanıcı çıkarabilir. | O-7 |
| İzin talebi | Balbal eksik bilgiyi sorar (tür, sebep); formu doldurur; personel onaylar; İK'nın tür bazlı onay zinciri işler; vekâlet desteklenir. Belge onayından **ayrı**. | **Ürün 3** (§B.12) |

---

### B.5 İK — Şirket Yapısı

İK ana sayfasında **"Şirket Yapısı"** sekmesi. Eski "Hiyerarşi Şeması" tablosu kaldırıldı. Yönetim panelindeki hiyerarşi görünümü bu verinin salt okunur halidir.

#### B.5.1 Veri modeli (mantık)

- **Düğüm türleri:** `kurul` (Yönetim Kurulu) → `poz` (Genel Müdür) → `dept` (departman) → `birim` (isteğe bağlı) → `poz` (pozisyon).
- Her düğüm: kimlik, ad, üst düğüm, tür. Pozisyonda ek olarak **kapasite** (kaç kişi oturabilir; varsayılan 1).
- **Şema isimsizdir:** kişiler ağaçta değil, ayrı bir **atama** tablosunda (kişi → pozisyon) durur.
- **Sürüm:** her devreye alma yeni bir şema sürümü (v1, v2 …) üretir. Yürürlükteki sürüm salt okunur; değişiklikler **çalışma kopyasında** yapılır.

#### B.5.2 Bağlılık kuralı (kod zorlar)

- Bir pozisyon yalnızca **kendi departmanındaki** bir pozisyona ya da **üst yönetime** (Genel Müdür / YK) bağlanır. **Departmanlar arası raporlama yoktur.**
- Döngü engeli: bir düğüm kendisine veya altındakilere bağlanamaz.
- Birim, pozisyonlarıyla birlikte başka departmana taşınabilir (pozisyonların departmanı da değişir).
- Kademe atlama engeli: kişi yerleşiminde ve pozisyon değişikliğinde kapasite ve kademe kontrolü (örn. Genel Müdür'ü stajyer pozisyonuna indirmek → aşağı yönlü uyarı + zorunlu gerekçe + YK onayı; §B.6.3).

#### B.5.3 Akış (5 adım, üstte adım çubuğu)

| # | Adım | Kim | Ne olur |
|---|---|---|---|
| 1 | Şema çalışması | İK | Çalışma kopyasında kol ekler, adını değiştirir, taşır, departman birleştirir, kapasite değiştirir. **Yalnızca Balbal — Hiyerarşi Düzenleyici ile** (§B.5.4). Her değişiklik listelenir ve tek tek geri alınabilir. |
| 2 | Şema onayı | Yönetim Kurulu | Onaycı **yeni şemayı** ve hemen altında **"Eski hali · yürürlükteki vN"** şemasını görür. Değişiklik etiketleri (yeni / birleşti / adı değişti / taşındı / kapasite / kaldırıldı) yeni şemada işaretlidir. Onay veya geri gönderme. |
| 3 | Kişi yerleşimi | İK | Çalışanlar mevcut pozisyonlarıyla yeni şemaya taşınır; kaldırılan pozisyondakiler **"Yerleştirilmemiş"** listesine düşer. Kapasite dolu pozisyona yerleştirme yapılamaz. |
| 4 | Kişi onayı | Yönetim Kurulu | Yerleşimi onaylar. |
| 5 | Devreye alma | İK | Tetik noktaları aynı anda güncellenir (§B.5.6). Devreye alınana kadar **sistem eski şemayla çalışır**. |

Görünümler: Yürürlükteki · Çalışma kopyası · Önceki sürüm. Ağaç başlığında **"Tam ekran"** düğmesi; Esc veya × ile eski görünüme döner.

#### B.5.4 Balbal — Hiyerarşi Düzenleyici

Sağ panelde iki sekme: **"Seçili Kol"** (koyu; seçili düğümün bilgisi) ve **"Balbal"** (turuncu). Balbal sekmesi şema düzenlemenin **tek** yoludur; elle sürükle-bırak veya form yoktur.

- Selamlama: "Ne değiştirmek istiyorsunuz?" Öneri çipi yok.
- **Kapsam:** yalnızca şirket yapısı. Konu dışı soruya kapsam cevabı verir; proje/belge bilgisi anlatmaz.
- Anladığı işler: birleştir, adını … yap, taşı / bağla, ekle, kaldır, kapasite N, değişiklikleri listele, geri al (son / bir kol / numara ile), sıfırla, onaya gönder.
- **Önce önizleme:** Balbal "Şunu yapayım mı?" der, değişikliği gösterir; kullanıcı **"Taslağa uygula"** veya **"Vazgeç"** seçer. Onaysız hiçbir değişiklik taslağa yazılmaz.
- Kural ihlalinde (örn. departmanlar arası bağlama) Balbal reddeder ve nedenini tek cümleyle söyler.
- Panelin altında: **"YK onayına gönder · N değişiklik"**.

**Backend için önemli:** LLM yalnızca niyeti yapılandırılmış bir komuta çevirir (`{op, hedef, yeni_üst, ad, kapasite}`). Komutun geçerliliğini (bağlılık, döngü, kapasite) **kod** denetler; LLM kural uygulamaz. Canvas'taki demo deterministik bir ayrıştırıcıyla çalışır.

#### B.5.5 Kapasite

- Her pozisyonun kapasitesi vardır; doluluk = atanmış kişi sayısı.
- Kişi yerleşiminde, işe girişte ve pozisyon değişikliğinde **yalnızca boş kapasiteli** pozisyonlar seçilebilir.
- Kapasite azaltılırsa fazla kişiler "Yerleştirilmemiş"e düşer (kişi yerleşimi adımında).

#### B.5.6 Devreye alma: güncellenen tetik noktaları

Devreye almada aşağıdakiler **tek işlemde** yeni şemaya geçer:

1. Belge onay akışı (kim kimi onaylar; B-28).
2. İzin onay zinciri ve vekâlet.
3. Departman sayfaları (yeni departmana sayfa, birleşen departmanların sayfası).
4. Görüş talebi ve bildirim alıcı listeleri.
5. Hatırlatma alıcıları (Ürün 2 süre takibi).
6. Balbal erişim filtresi (`allowed_document_ids`, P-2 tek kapı).
7. Kişi listelerinin hiyerarşik sırası.

**Klasör yetkileri otomatik değişmez.** Yeni yapıyla uyumsuz klasör yetkileri yönetim paneline **uyumsuzluk** olarak düşer (§B.9.3). Çözülene kadar kimseye **otomatik yeni erişim açılmaz**; eski erişimler geçiş kuralına göre korunur veya askıya alınır. Boş pozisyonun onayları bir üste geçer.

---

### B.6 İK — Kişiler

#### B.6.1 Liste (salt okunur)

- Sütunlar: **Kişi · Pozisyon (+rol) · Yönetici · Dosya · Durum**.
- Sıralama: departman başlığı → departman başı → altındakiler (şema ağacının sırası, girintili). Gruplar: departmanlar + **"Yerleştirilmemiş"** + **"Ayrılanlar"**.
- Yapı Şirket Yapısı'nın **yürürlükteki** sürümünden okunur; devreye alma olunca liste kendiliğinden yeniden gruplanır.
- Şirket Yapısı onay sürecindeyken (adım 2–5) üstte kilit şeridi görünür ve pozisyon değişikliği kapalıdır (öncül kilit).

#### B.6.2 Kişi kartı

Satıra tıklayınca sağda açılır: pozisyon, departman, yönetici, işe giriş, personel dosyası durumu, eksik belgeler, bekleyen talepler. İşlemler: **Pozisyon değiştir**, **Pasife al / Aktife al**.

#### B.6.3 Pozisyon değişikliği (talep → onay)

- Hedef pozisyonlar departman gruplarıyla listelenir; her birinde doluluk (`dolu/kapasite`). Dolu pozisyon seçilemez.
- **Aşağı yönlü değişiklik** (daha alt kademe) → uyarı + **zorunlu gerekçe**.
- Kişinin ayrılmasıyla **boşalacak pozisyon** varsa uyarı (onayları bir üste geçer).
- **Onaycılar şemadan türer:** hedef pozisyon üst yönetim kademesindeyse **YK**; değilse **mevcut yönetici + yeni yönetici**.
- Talep "beklemede" görünür; talep sahibi geri çekebilir. Onaylanınca atama değişir ve tetik noktaları (§B.5.6) o kişi için güncellenir.

#### B.6.4 İşe giriş ve işten çıkış

- **İşe giriş:** ad soyad, pozisyon (yalnızca boş kapasiteli), başlangıç. Departman, rol, yönetici, onaycı otomatik. Ortak alanda `İK / Personel Dosyaları / <kişi> (işe giriş)` klasörü açılır; gerekli belgeler listelenir; Balbal tanıdıkça işaretlenir.
- **İşten çıkış (Pasife al):** ayrılış türü (istifa / işveren feshi / emeklilik / süre sonu), son çalışma günü, vekâlet etkisi (şemadan), türe göre toplanacak belgeler, `(ayrılış)` klasörü. Kişi "Ayrılanlar"a geçer; pozisyon kapasitesi boşalır.
- İşten çıkışın ayrıca onaya bağlanması ve adının "İşten çıkış" olması **açık soru** (§B.13).

---

### B.7 İK — İzin, Haklar, Kıdem, Maaş

Ayrıntılı hesap mantığı canvas'taki İK panolarındadır; burada yalnızca backend'i ilgilendiren çerçeve var. **Bu sekmelerin tamamı Ek-B'ye göre Ürün 3 (İK)'tür (§B.12).**

- **İzin Yönetimi:** bekleyen talepler; izin türüne göre onay zinciri (İK belirler; tablo olarak, P-8): yıllık / ücretli mazeret → yönetici → İK kaydı; ücretsiz → yönetici → Genel Müdür → İK kaydı; rapor → İK kaydı. Onaycı şemadan; vekâlet belge onayıyla aynı veri.
- **İzin Hakları:** kişi bazında hak / devir / kullanılan / kalan; durumlar (normal, bitmek üzere, ekside, hak doğmadı). Hak kuralları mevzuat parametresinden.
- **Kıdem ve İhbar:** her aktif çalışan için "bugün işten çıkarılsa" kıdem, ihbar, kullanılmayan izin ücreti; her gün 06:00 yeniden hesap; satırda adım adım hesap açıklaması.
- **Maaş 🔒:** her açılışta ikinci doğrulama; brüt→net, net→brüt; bordro Finansal Muhasebe'ye iletilir; açılış denetim kaydına yazılır.

Hesaplar **hesaplama katmanında** yapılır; parametreler (kıdem tavanı, oranlar, tarife) onaylı mevzuat tablosundan gelir (T-4). Canvas'taki değerler yalnızca gösterim içindir.

---

### B.8 İK — Mevzuat

Eski tasarımdaki tikler, "+ Ekle" ve "önemli bilgi" sütunu **kaldırıldı**.

#### B.8.1 Sekme: yalnızca kaynak gösterimi + güncellik

- Sütunlar: **Mevzuat · Referans / Belge · Klasör (ortak alan) · Kullanıldığı yer · Güncellik**.
- Güncellik durumları: **Güncel** · **Değişiklik şüphesi** · **Yeni eklendi**. Şüpheli satırda yalnızca "Balbal'a sor" var.
- İK Balbal'ı soruları zaten bu kaynaklarla cevaplar; sekme cevap üretmez, kaynağı gösterir.

#### B.8.2 Ekleme / güncelleme: Balbal mevzuat sohbeti

1. İK yan paneldeki Balbal'a sorar: "kıdem tavanı güncel mi?"
2. Balbal mevcut kaynağı ve (bulduysa) daha güncelini **öneri** olarak gösterir.
3. İK okur ve onaylar.
4. **Hangi klasöre ekleneceğini** kullanıcı seçer/onaylar.
5. Balbal belgeyi ortak alana ekler; satır "Yeni eklendi" olur; eski sürüm tarihsel işaretlenir.
6. Mevcut kaynak güncelse İK "güncel" diye teyit eder; durum güncellenir.

**Kısıt:** "Daha güncelini bulmak" dış kaynağa erişim demektir → **Ek-E/6, Ç-11 kararı** gerekir (§B.12). Karar gelene kadar Balbal yalnızca sistemde zaten bulunan belgeler arasında karşılaştırma yapar; yeni mevzuat belgesini kullanıcı yükler.

---

### B.9 Yönetim paneli

Ayrıntı: ürün sahibinin "Yönetim ekranı — kullanıcılar, yetkiler ve onay mekanizması" notu. Burada yalnızca bu tasarımda eklenenler.

#### B.9.1 Yapı türetilir

Rol, görüntüleme kapsamı, yönetici, "kimleri onaylar" ve belge akışı Şirket Yapısı'ndan türetilir; panelde salt okunur.

#### B.9.2 Ortak klasör onay kuralı

Bir klasörde **birden fazla departmanın Değiştirme yetkisi** varsa (sahibi + Değiştirme verilen departman; üst klasörden gelen yetki dahil) o klasör **ortak klasördür**.

- **Departman başı yüklerse:** **eş pozisyon** onaylar (Değiştirme yetkili diğer departmanın başı). Hiyerarşideki üst bu durumda onaycı değildir.
- **Alt pozisyon yüklerse:** **iki yönetici** onaylar (kendi departman başı + eş pozisyon).
- Onaylar birlikte gerekir; biri eksikse belge kaydedilmez. Departman başı yoksa vekili; o da yoksa uyarı.
- Ayrı ayar yoktur; kural klasör yetkilerinden türetilir. Klasör Erişimi'nde başlıkta "Ortak klasör" etiketi; kişi kartındaki "Yetkiyi sına" iki onay adımını gösterir.

#### B.9.3 Yapı Değişikliği Uyumsuzlukları

Devreye almadan sonra otomatik oluşur. Türler:

| Tür | Örnek | Geçiş kuralı (çözülene kadar) |
|---|---|---|
| Sahiplik | Birleşen departmanların klasörlerinin sahibi kalmadı | Klasör silinmez; eski erişim korunur; yeni erişim kapalı |
| Erişim | Kalkan departmana verilmiş görme yetkisi | Yetki askıya alınır |
| Yeni departman | Yeni departmanın klasörü yok | Sayfa açık, belge ekleme kapalı |
| Kişiye özel | Departmanı değişen kişinin çapraz yetkisi | Askıya alınır; yeniden onay gerekir |

Akış: **Uyumsuzluk açıldı → Sistem güncelleme talebi (ilgili departman başına) → Departman başı yanıtladı → Yönetici uyguladı**. Talep departman başının bildirim ve görevlerine düşer. Uygulama Değişiklik Geçmişi'ne yazılır.

---

### B.10 Bağlı alanlar

| Değişiklik | Etkilediği yerler |
|---|---|
| Şema devreye alındı | Kişiler listesi ve grupları · Yönetim panelinde rol/kapsam/yönetici · belge onay akışı · izin zinciri · vekâlet · departman sayfaları · bildirim/hatırlatma alıcıları · Balbal erişim filtresi · uyumsuzluk listesi |
| Pozisyon değişikliği onaylandı | O kişinin yöneticisi, onaycıları, onayladıkları, erişim kapsamı, kişiye özel yetkileri (askıya), kapasite doluluğu |
| İşe giriş / işten çıkış | Kapasite · onay akışı (boşalan pozisyon → bir üst) · personel dosyası klasörü · izin/kıdem/maaş listeleri |
| Klasör yetkisi değişti | Ortak klasör tespiti → onay adımları · Yetkiyi sına sonucu |
| Mevzuat onaylandı | İzin hakkı, kıdem, maaş parametreleri · Balbal İK cevaplarının kaynağı |

Kural: **türetilen hiçbir şey tabloya kopyalanmaz**; her istekte ana veriden hesaplanır veya devreye almada tek işlemde yeniden üretilir (P-8).

---

### B.11 Backend'den beklenenler

Etiket: hepsi **HEMEN** (05.10.2026 kararı). Kritik veri modeli kararları için kısa bir ADR yazılır ama iş onu beklemez; ADR görev sonu notuyla birlikte sunulur.

#### B-29 — Şirket yapısı sürümleri ve onay paketi · Ürün 1

- Tablolar (mantık): `org_version` (no, durum: taslak/YK onayında/kişi yerleşimi/kişi onayında/hazır/yürürlükte/arşiv, oluşturan, tarihler) · `org_node` (version, id, tür, ad, üst, kapasite) · `org_change` (taslağın yürürlüğe göre değişiklik listesi; tür, hedef, önce/sonra; tek tek geri alınabilir).
- Aynı anda en fazla **bir** açık çalışma kopyası.
- **YK onay paketi:** onaya gönderildiği anın **yeni şema anlık görüntüsü + yürürlükteki şema anlık görüntüsü + değişiklik listesi**. Onaycı ikisini birlikte görür; paket sonradan değişmez (onaydan sonra içerik değişirse onay düşer, P-1).
- Doğrulamalar kodda: bağlılık kuralı, döngü, kapasite ≥ 1, birleştirmede kaynak departmanların tüm pozisyonları hedefe geçer.
- Uç önerisi: `GET /api/org/versions`, `GET /api/org/versions/{v}/tree`, `POST /api/org/drafts`, `POST /api/org/drafts/{id}/changes`, `DELETE …/changes/{cid}`, `POST …/submit`, `POST …/review` (onayla / geri gönder + yorum).

#### B-30 — Kapasite, atama ve pozisyon değişikliği talepleri · Ürün 1

- `assignment` (kişi, pozisyon, başlangıç, bitiş) — şemadan ayrı.
- Kişi yerleşimi (B-29 adım 3) taslak atamalar üzerinde çalışır; kapasite aşılamaz; "yerleştirilmemiş" hesaplanır.
- `position_change_request` (kişi, eski/yeni pozisyon, yön: yukarı/yatay/aşağı, gerekçe — aşağıda zorunlu, onaycılar, durum). Onaycılar şemadan: hedef üst yönetimse YK; değilse eski + yeni yönetici.
- Şema onay sürecindeyken pozisyon değişikliği talebi açılamaz (öncül kilit).
- İşe giriş/işten çıkış atama kaydını açar/kapatır; Ürün 3 işlem taslağı (§B.12) ayrıdır.

#### B-31 — Devreye alma ve tetik noktaları · Ürün 1

- Devreye alma **tek transaction**: yeni sürüm "yürürlükte", eski "arşiv"; §B.5.6'daki tüm türetilmiş yapılar yeniden hesaplanır.
- **Tetik noktası kaydı:** şemaya bağlı her tüketici (onay akışı, izin zinciri, bildirim listeleri, hatırlatmalar, departman sayfaları, erişim filtresi) kayıtlı bir dinleyici olmalı; devreye almada hepsi çağrılır; biri başarısızsa devreye alma geri alınır.
- Devreye almadan önce **etki önizleme** sorgusu: kaç akış, kaç kişi, kaç klasör etkilenir.
- Açık belge onayları ve izin talepleri: devreye alma anında bekleyen talepler hangi şemayla devam eder? → **açık soru** (§B.13).

#### B-32 — Klasör uyumsuzlukları ve sistem güncelleme talepleri · Ürün 1

- Devreye almada klasör yetkileri (B-26) yeni yapıyla karşılaştırılır; uyumsuzluklar `org_mismatch` (tür, klasör, eski sahip/erişen, önerilen muhatap, geçiş durumu, süreç durumu) olarak açılır.
- Geçiş kuralları §B.9.3 tablosundaki gibi; **otomatik yeni erişim yok**.
- Talep → departman başının bildirim + görevine; yanıt metni; yönetici "uygula" ile yetkiyi değiştirir; Değişiklik Geçmişi'ne yazılır.

#### B-33 — Ortak klasör onayı · Ürün 1 (B-28'in genişlemesi)

- Ortak klasör tespiti: klasörde (kalıtımlı) Değiştirme yetkili departman sayısı > 1.
- Onay adımları: `[yükleyen baş değilse kendi departman başı] + [diğer Değiştirme yetkili departmanların başları]`.
- B-28 onay kaydı **birden çok onaycı tarafını** desteklemeli; hepsi onaylamadan belge kaydedilmez; biri geri gönderirse belge geri döner.
- "Yetkiyi sına" ve "Belge eklese ne olur?" aynı motoru kullanır (P-2).

#### B-34 — Mevzuat kaynakları ve güncellik · Ürün 2 (dış tarama Ç-11 bekliyor)

- `regulation_source` (başlık, referans, belge id, klasör, kullanıldığı parametreler, durum: güncel/şüpheli/yeni, son kontrol).
- Balbal'ın "daha güncel" önerisi: **şimdilik yalnızca sistemdeki belgelerden**. Dış kaynak (Resmî Gazete vb.) taraması Ek-E/6 kararına kadar yapılmaz.
- Ekleme: kullanıcı onayı + klasör seçimi zorunlu; eski kaynak tarihsel işaretlenir; parametreler yeni kaynaktan güncellenir ve hesaplar yeniden çalışır.

#### B-35 — Balbal Hiyerarşi Düzenleyici · Ürün 2 (Ek-B sorusu açık)

- Ayrı bir Balbal kapsamı: yalnızca şirket yapısı; RAG yok; proje/belge bilgisi yok.
- LLM çıktısı **yapılandırılmış komut** (§B.5.4); doğrulama kodda (B-29 kuralları); geçersiz komut kullanıcıya gerekçeyle döner.
- Önizleme → "Taslağa uygula" → `org_change` kaydı. Balbal doğrudan taslağa yazamaz; kullanıcının düğmesi yazar (P-1).
- Komut ve sonuç denetim kaydına yazılır.

#### B-36 — Yapılandırılmış cevap blokları ve pencere sürekliliği · Ürün 2

- `/api/ask` cevabı metne ek olarak blok listesi döndürebilmeli: `table | calc | list`; her blokta Ç-7 durumu; her satır/hücrede kaynak referansı; hesap bloğunda girdiler + yöntem + kapsam dışı.
- Çelişkili veride iki kaynak birlikte döner.
- Konuşma kimliği pencere hali değişiminde aynı kalır (frontend tarafı); geçmiş B-03'e bağlı.
- "Hafızaya ekle" cevap kimliğiyle (B-04, O-7).

---

### B.12 Anayasa uyarıları

**05.10.2026 kararıyla bu maddeler geliştirmeyi durdurmaz.** Tüm özellikler uygulanır; aşağıdakiler, uygulama bittikten sonra yapılacak ürün ayrımında (Anayasa veya uygulama) kullanılmak üzere kayıttır. İstisna: madde 3'teki dış bağlantı, güvenlik kuralı olduğu için bağlantı eklenmeden önce ürün sahibinin onayını gerektirir.

1. **İK izin talebi, izin yönetimi, izin hakları, maaş/bordro, işe giriş–çıkış işlem taslağı → Ek-B'de Ürün 3 (İnsan Kaynakları).** Canvas bunları onay akışları sayfasında ve İK ana sayfasında gösteriyor. Ürün ayrımı yapıldığında bu sekmeler ve akışlar `P3` anahtarına bağlanacak (B-25); **şimdilik açık geliştirilir.** `BACKEND_GAPS.md` B-22 de "İK kısmı Ürün 3" diyor; tutarlı.
2. **Kıdem ve İhbar "bugün işten çıkarılsa"** varsayımsal bir hesaptır (gerçekleşmemiş olay) → Ürün 2'nin "yalnızca gerçekleşmiş veri" sınırını aşar → **Ürün 3**. Varsayımlar ekranda açıkça listelenmeli (T-4).
3. **Mevzuat güncelliği için dış kaynak taraması** yeni dış bağlantıdır → **Ek-E/6 + Ç-11 kararı** gerekir. Önce sistem içi karşılaştırma ve kullanıcı yüklemesi yapılır; dış tarama, ürün sahibi kaynağı (Resmî Gazete vb.) onaylayınca eklenir.
4. **Balbal — Hiyerarşi Düzenleyici** Ek-B'de adıyla geçmiyor. En yakın madde Ürün 2 "Veri taslağı hazırlar". Geliştirilir; Ek-B'deki yeri ürün ayrımında netleşir (Ç-11/a ise Ç-3 oybirliği gerekir). Şema yönetimi (ağaç, onay, devreye alma) Ürün 1 "departman yapısını tanımlar" kapsamındadır; soru yalnızca Balbal'ın düzenleme aracı olmasıyla ilgili.
5. **Balbal'ın ekip sohbetine eklenmesi** Anayasa v2.0 Ü-7.3 ile Ürün 2'den itibaren serbest; `BACKEND_GAPS.md` v8.0 §6.3 ise "dahil edilemez" diyor. Anayasa esastır; `BACKEND_GAPS.md` §6.3'ün güncellenmesi gerekir (bu PR'da yapılmadı, ayrı karar).

---

### B.13 Açık sorular

1. Devreye alma anında **bekleyen belge onayları ve izin talepleri** eski şemayla mı tamamlansın, yeni onaycıya mı taşınsın? (Öneri: eskiyle tamamlansın, yeni talepler yeni şemayla.)
2. **İşten çıkış** ayrıca onaya bağlansın mı (yönetici + İK / YK)? Düğmenin adı "Pasife al" yerine **"İşten çıkış"** olsun mu?
3. Kişi onayı adımında (adım 4) YK'ya da **yeni yerleşim + eski yerleşim** karşılaştırması gösterilsin mi?
4. Adım çubuğundaki onaycı etiketi: "Yönetim Kurulu" sabit mi, şirket ayarı mı?
5. Kapasite değişikliği tek başına (yapı değişmeden) YK onayı gerektirsin mi?
6. Hiyerarşi Düzenleyici'nin Ek-B kapsamı (§B.12/4).
7. Mevzuat dış kaynak kararı (§B.12/3).
8. Ortak klasörde iki onay **eşzamanlı** mı (tasarım) yoksa sıralı mı?
9. Üçüncü bir departman da Değiştirme yetkiliyse onun başı da onaylasın mı? (Tasarım: evet.)


---

## C. Mali İşler, İdari İşler, Akış Zincirleri 1–3 (06–07.10.2026)

Canvas'a eklenenler: **Mali İşler** (Finansal Muhasebe: özet, ödeme talepleri, ödeme listesi, Şirket Bilgileri · Muhasebe: gelen evrak, evrak kartı, kayıt önerileri, cari, kontroller), **İdari İşler** (Genel Bakış, Talepler ve Satın Alma, Zimmet ve Varlıklar, Şirket Yapısı, Onay Ayarları), satın alma onay kartı, fatura kartı, sözleşme kartı, TCMB döviz kurları (PF ve Mali İşler'de birebir aynı), **Akış Zincirleri** (Zincir 1 satın alma talebi · Zincir 2 İdari İşler'in kendi alımı · Zincir 3 sözleşme usulü ödeme; her adım ayrı pano, gerçek ekranı `dc-import` ile çağırır).

Netleşen kurallar (backend mantığı için): onay yalnız inceleme ekranında, bildirimden onay yok · Balbal fatura/ödemede **onay vermez**, bulgu sunar, her bulgunun kaynağı gri notla yazılır · eksik belge onayı durdurmaz, silinemez not düşer, belge sonra gelirse tarih eklenir · teklif seçimi yalnız yöneticide · "teslim aldım"ı talep eden işaretler · **tek PO numarası** zincir boyunca · ödeme listesine alma ≠ ödeme · ödeme kategorileri (sözleşme usulü / sipariş usulü / maaş / vergi-yasal / finansman / eşleşmeyen) · faturalar e-Fatura entegratöründen Muhasebe'ye gelir · Balbal **ERP değildir**, ERP'ye yazmaz · ödeme listesinde "Talimat oluştur" (turuncu halkalı Balbal ikonu) · tüm sayfalar aynı iskelet, vurgu `#2FA968` · hiçbir ekran donuk değil · vardiya/fazla mesai Enerji'de, zimmet İdari İşler'de.

Backend beklentileri (frontend bitince ve ⛔ onaydan sonra uygulanır): **B-37** Şirket Bilgileri + cari listesi + ödeme talimatı şablonları + "Talimat oluştur" (Word) + **kodla deterministik son kontrol** (ödeyen/lehtar/IBAN/tutar/mükerrer/ön koşul/hesap kısıtı/iş günü/imza grubu/açıklama/boş alan — biri geçmezse belge üretilmez; ödeme en hassas konu) · **B-38** tek PO ve zincir durum modeli · **B-39** ödeme kategorileri ve sözleşme bakiyesi/avans mahsubu · **B-40** gelen evrak, eşleştirme, itiraz süresi, kayıt önerisi, ERP eşitlemesi · **B-41** eksik belge isteme ve silinemez not · **B-42** varlık/zimmet otomatik kayıt. Numara notu: proje dosyalarındaki "B-29 ödeme talimatı" talebi PR #7'deki B-29 ile çakıştığı için **B-37** oldu.

---

## D. Ödeme zincirleri ve Finansal Muhasebe (08.10.2026)

Numaralama: `PO-26-0xx` satın alma · `SÖ-26-0xx` sözleşme ödemesi · `FT-26-0xx` eşleşmeyen fatura · `KR-26-0xx` kredi · `VG-26-0xx` vergi/yasal · `BR-26-0xx` bordro · `AÖ-26-0xx` acil ödeme · `MS-26-0xx` masraf · `AV-26-0xx` avans. Her tür kendi serisini kullanır.

### D.1 TEMEL İLKE — Balbal belgeden öğrenir, bilgi kümülatif kalır

**Önem:** Projenin temeli bu mantığa dayanıyor; tüm backend tasarımı (veri modeli, belge işleme, Balbal'ın cevapları) buna göre kurulmalı.

Balbal, işini yapmak için ihtiyaç duyduğu parametreleri **ortak alandaki klasörlerden kendisi öğrenir**. Hiçbir iş parametresi koda, ekrana ya da demo dosyasına sabit yazılmaz.

- Bir belge onaylanıp ortak alana girdiğinde Balbal ondan yapılandırılmış bilgiyi çıkarır ve ilgili kaydın **bilgi kartına** ekler.
- Bilgi **kümülatif** kalır: her yeni belge (tadil, yeni ödeme tablosu, banka bildirimi) kartı günceller. Eski değer silinmez, tarihsel durur ("hangi tadille faiz değişti" sorusu 5 yıl sonra da cevaplanabilmeli; B-28 etiket ilkesiyle aynı amaç).
- Balbal bir süreçte hesap yaparken ya da bulgu verirken bu kartı kullanır; kaynağı her zaman gösterir.

**Örnek — kredi:** Her kredi için sözleşme, tadiller, ödeme tabloları, banka ödeme ve faiz belirleme bildirimleri okunur. Kartta biriken: banka, kredi no, proje/SPV, para birimi, tutar, vade; anapara planı ve kalan anapara; faiz yapısı (baz oran türü, marj, gün sayım esası, dönemler, temerrüt faizi); hesaplar (borç servis hesabı, DSRA ve kısıtları); teminatlar, covenant'lar, raporlama yükümlülükleri; tadiller ve her birinin neyi değiştirdiği. Zincir 5'teki Balbal bulguları bu karttan beslenir. Demo kartın değerleri: Ürün 1 notu §E.1.

**Yalnız kredi değil:** EPC/O&M/kira sözleşmeleri (ödeme kalemleri, avans ve teminat koşulları, eskalasyon formülü); sigorta poliçeleri, lisanslar, izinler (süreler, yenileme); imza sirküleri ve vekaletnameler (güncel yetkililer, limitler); cari kayıtlar (IBAN, VKN, geçmiş fatura kalıpları → masraf yeri önerisi); banka tarifeleri (komisyon oranları); abonelik sözleşmeleri (abone numaraları).

**Anayasa ile uyum (kodlamadan önce):**
1. "Skill" kelimesi yeni yetenek demek değildir; mevcut yeteneklerin (Tanıma, Birleştirme) ürettiği birikmiş bilgidir. Ek-B dışına taşacaksa önce bildir (Ç-3, Ç-11).
2. Kurumsal Hafızaya neyin, hangi koşulla yazılacağı Kritik Geliştirme Kararıdır (Ç-15/7, O-7): bilgi kartının veri modeli için önce kısa ADR, onaya sunulur.
3. Kartın her alanı kaynak belgeye (belge, versiyon, madde/sayfa) bağlıdır. Balbal'ın çıkarımı AI Taslağıdır (O-3). Eminlik %80'in altındaysa ilgili departman alanı onaylar.
4. Çelişki gizlenmez (Ç-7): iki belge farklı değer veriyorsa kart ikisini de gösterir.
5. Yetki (T-5): kart, kaynak belgeyi görebilen kişiye görünür.
6. Aritmetik (faiz, kalan anapara, eskalasyon, kur) deterministik koddadır, LLM'e bırakılmaz; her hesap denetim kaydına yazılır.
7. Ürün etiketi: belgeden bilgi çıkarma = Ürün 1 (Tanıma); kart verisiyle karşılaştırma ve aritmetik = Ürün 2 (Birleştirme); tahmin ve neden-sonuç = Ürün 3. Ürün 2 notları veri diliyle yazılır ("takvim oranı %X, bildirim oranı %Y"); "baz oran yenilendiği için" Ürün 3 yorumudur — canvas'taki bazı demo metinleri bu açıdan sadeleştirilecek.

---

### D.2 ORTAK KURAL — Balbal'ın otomatik doldurduğu bilgi için kullanıcı onayı (ZORUNLU)

- Balbal'ın otomatik doldurduğu **her** bilgi için kullanıcı tek satırla onaylar: **"☐ Yukarıda Balbal tarafından doldurulan bilgilerin doğruluğunu onaylıyorum"** (talimat kartında "…talimat bilgilerinin…"). Uzun açıklama yok.
- Onay yoksa kayıt **bir sonraki aşamaya geçmez** (gönder/kaydet/talimat düğmesi kapalı).
- Balbal'ın doldurduğu alanlar arayüzde ayrı işaretlidir (turuncu çerçeve). Kullanıcı bir alanı düzeltirse o alanın işareti kalkar; onay sıfırlanmaz.
- **Balbal yeni bir şey doldurursa (yeni belge okundu, mail seçildi, hesap yeniden seçildi) onay sıfırlanır**; kullanıcı güncel hali yeniden onaylar.
- Uygulandığı yerler: Seçilileri öde, Acil öde, ödeme kartındaki Talimat oluştur, banka hareketinden kayıt, masraf / avans formu, banka ekstresinden otomatik tanınan kayıtlar.
- Bu kural "Balbal engellemez" ilkesinin **tek istisnasıdır**. Diğer bulgularda Balbal yalnızca not düşer ve "Onaylıyorum" ister; kişi riski üstlenir, kayda geçer. Not değişirse (tutar, tarih, seçim) önceki onay geçersiz olur.
- Her kayıtta tutulacaklar: doldurulan alanlar listesi, kaynak (belge id + sayfa / mail id / cari kaydı / ekstre satırı), güven skoru, onaylayan + zaman.

P-1 ile ilişkisi: P-1 "personel onayı olmadan işlem ilerlemez"in ödeme süreçlerindeki somut biçimidir.

---

### D.3 Zincir 4 (eşleşmeyen fatura) ve Zincir 5 (kredi ödemesi)

**Ürün:** Ürün 2 · **Ortak bileşen:** `Odeme-Zinciri` (PO kartı altyapısı). Genel ilke: Balbal ödemeyi engellemez, onay vermez; yalnızca bulgu sunar; riskli durumda not + "Onaylıyorum".

#### D.3.1 Zincir 4 — eşleşmeyen fatura (Muhasebe başlatır)
- 1. adımda Balbal bulguları: açık ödeme (aynı tedarikçiye faturası gelmemiş ödeme var mı), masraf yeri (tedarikçinin geçmiş kayıtları), cari (IBAN doğrulanmış mı). Her bulgunun kaynağı yazar.
- Onaycı şemadan otomatik gelmez; Muhasebe kendisi seçer (işi Genel Müdür aldırmış olabilir).
- İtiraz son günü (geliş + 8 gün) fatura bilgilerinde ve onaycının karar alanında görünür.
- **Önceden ödendi → eşleştirme (3b):** Finansal Muhasebe faturayı açık ödemeyle (acil ödeme / PO) eşleştirip kapatır. Seçilen ödeme tedarikçi ya da tutar olarak tutmuyorsa Balbal sorusu + "Onaylıyorum" zorunlu; geçmişe "eşleşme farkını onayladı" yazılır.
- **Mükerrer (3c):** yeni ödeme seçildi ama aynı tedarikçiye aynı tutarda açık ödeme varsa mükerrer uyarısı + "Onaylıyorum". Bu kontrol **kodla** (deterministik) yapılır.
- Eşleşme sonrası Muhasebe'ye görev düşer (açık ödeme kapanışı — 159 — ve fatura kaydı).
- Demo: ana akışta (1-2-3-4) açık ödeme yok; 3b ve 3c panolarında 03.10.2026 tarihli acil ödeme var. İki senaryo ayrı tutulmalı.

#### D.3.2 Zincir 5 — kredi ödemesi
- Asıl olan bankanın ödeme bildirimidir; iki tarafa da (Proje Finans, Finansal Muhasebe) düşer. Proje Finans'ın düğmesi "Kaydet"tir (not / onaycı ekler), "ilet" değil.
- **İki giriş yolu, tek kayıt:** banka bildirimi otomatik açar **ya da** Proje Finans "+ Ödeme talebi → Kredi ödemesi" ile elle açar. Elle açıldıktan sonra bildirim gelirse Balbal aynı KR kaydına bağlar, yeni kayıt açmaz (bu yön şu an eksik).
- Taksit iki satır: anapara ve faiz ayrı (muhasebe kaydı ve kontrol için).
- **Balbal'ın bağımsız faiz hesabı:** kalan anapara × (baz oran + marj) × gün / 360. Kaynak: kredi sözleşmesinin faiz maddesi ve bankanın faiz belirleme bildirimi (§D.1 bilgi kartı). Karşılaştırma bankanın rakamıyla değil, bu hesapla ve Proje Finans ödeme takvimiyle yapılır. "Banka bildirimiyle mutabık" çipi kaldırıldı (bankayı bankayla doğruluyordu).
- Takvim farkı kalem bazında (anapara / faiz). Anapara farkı yanlış taksit işaretidir.
- Hesap bakiyesi: borç servis hesabında vade günü yeterli bakiye var mı; eksikse tutar + "TL'den döviz alımı ya da hesaplar arası transfer" notu. Kısıtlı hesaplar (DSRA vb.) kullanılabilir bakiyeye sayılmaz.
- Finansal Muhasebe onayından önce Balbal notları (varsa): takvim farkı, bildirimden farklı tutar, vadeden sonraki tarih (gecikme faizi ve temerrüt riski), bakiye eksiği. Liste varsa "Onaylıyorum" zorunlu.
- Ödeme şekli: "Talimatla ödenir" ya da "Banka vade günü hesaptan tahsil eder" (kredi sözleşmesine göre). Otomatik tahsilde tarih vadedir; kayıt nakit planı için ödeme listesinde durur, talimat hazırlanmaz.
- Ödendi: banka hareketiyle eşleşince kapanır → Proje Finans ödeme takvimi güncellenir (kalan anapara, sıradaki taksit) → Muhasebe'ye görev: anapara, faiz, kur farkı kaydı; yurt dışı kredide stopaj / sorumlu sıfatıyla beyan kontrolü — oranları Muhasebe teyit eder, Balbal hesaplamaz.

---

### D.4 Zincir 6 (vergi / yasal yükümlülük) ve Zincir 7 (bordro)

- **Zincir 6 sade kalır:** Muhasebe tahakkuk fişini gönderir, Finansal Muhasebe öder; onaycı isteğe bağlı. **Balbal'ın vergi için uyarısı yok**; yasal yükümlülükte Balbal'ın sorumluluğu yoktur, gecikmenin sorumluluğu şirkettedir. "Son gün geçerse uyarı" yalnızca Finansal Muhasebe'nin kendi tarih alanında görünür.
- **Zincir 7 bordro:** İK bordro toplamlarını gönderir, onaycıyı kendisi seçer (personel gönderdiyse Genel Müdür onaylar (İK'nın bağlı olduğu yönetici; İK'da müdür yok) — Mali İşler Müdürü değil); Finansal Muhasebe üç satırı (net maaş, SGK, muhtasar) ayrı tarihlerle ödeme listesine alır.

---

### D.5 Finansal Muhasebe ödeme listesi (`Ana-Sayfa-Mali`, Ödeme Listesi sekmesi)

**Ürün:** Ürün 2. **Akış (07.10 düzeltmesi, değişmedi):** her zincir Finansal Muhasebe'ye gelir → onaylarsa kayıt ödeme listesine düşer, tarihi kendi nakit akışına göre belirler → talimat ve ıslak imza Finansal Muhasebe'nin arka plan işidir → ödeme → sistem kayda "ödendi" yazar. Zincir adımlarında "talimat imzası" diye bir aşama yoktur.

#### D.5.1 "Talimat oluştur ▾" menüsü — iki seçenek
"+ Elle ödeme" düğmesi kaldırıldı. Üst sağda yalnızca "Talimat oluştur ▾": **Seçilileri öde** · **Acil öde**.

#### D.5.2 Seçilileri öde
- Listeden seçilen N ödeme için onay penceresi. Satır başına: dayanak (zincir / PO / SÖ / fatura), karşı taraf, **IBAN (kaynağıyla:** cari / fatura / mail), **ödeyen hesap** (ödemeyi yapan şirketin kendi hesaplarından, para birimine göre Balbal seçer), tutar.
- Balbal'ın doldurduğu IBAN ve ödeyen hesap turuncu; §D.2 onayı işaretlenince "N talimat oluştur" açılır.
- Talimat belgesi şirket bazında üretilir; imza yetkilileri bilgi kartından (imza sirküleri, §D.1) gelir. Islak imza zaten şart; ek "görünürlük / ikinci göz" kontrolü istenmez.
- `Talimat` kaydı: {doc, bank, sigs, ok, okBy}.

#### D.5.3 Acil öde — listede olmayan ödeme için kayıt + talimat tek adımda
- Alanlar: Şirket, Karşı taraf, **IBAN (zorunlu)**, Tutar + para birimi, Ödeme tarihi (varsayılan bugün), Talimatı veren (isteğe bağlı), Ödeyen hesap, Açıklama.
- Kayıt numarası `AÖ-26-0xx`. Dayanak yoksa listede "**Eşleşmeyen ödeme · N gün**" uyarısı durur; zorlama yok, uyarı hiç kalkmaz. Dayanak (fatura / PO / sözleşme) sonradan gelince Balbal eşleştirir (Zincir 4 3b mantığı).
- **+ Belge ekle:** fatura yüklenince Balbal okur ve alanları doldurur (karşı taraf, VKN, tutar, para birimi, IBAN faturada yazıyorsa); belge ödemeye eklenir; fatura ayrıca Muhasebe'ye kayıt için gider. Fatura eklenen acil ödeme "eşleşmiş" sayılır mı → **açık karar (§D.9)**; şu an sayılıyor.
- **✉ Mailden al:** Balbal, banka / şirket bilgisi (IBAN, ünvan, tutar) içeren mailleri listeler; seçilen mail alanları doldurur. Kaynak notu: "mailden geldi, karşı tarafla teyit et".
- **Kayıtlı IBAN farklı** uyarısı: cari kaydındaki IBAN ile girilen / okunan IBAN farklıysa not düşer (kaynağıyla); engellemez.
- **Hızlı ani ödeme zinciri oluştur** (isteğe bağlı): bir ya da daha fazla onaycı eklenir; onay gelene kadar ödeme bekler. Onaycı yoksa doğrudan ödeme listesi.
- §D.2 onayı: Balbal bir şey doldurduysa (belge / mail / ödeyen hesap) onay şart.
- Fatura ve banka tutarı farklıysa not: "Fatura tutarı X · banka çıkışı Y · farklı".

#### D.5.4 Başarılı ödeme sonrası (otomatik, her yol için)
- Başarılı her ödeme **otomatik kaydedilir**; ilgili PO / SÖ / KR / FT kaydına "ödendi" yazılır, belgeler Muhasebe'ye gider.
- **Cari güncelleme:** ödemede cari kaydındakinden farklı IBAN kullanıldıysa cari güncellenir (eski IBAN tarihsel kalır, §D.1); karşı tarafın carisi yoksa **yeni cari açılır**. Hazine ve banka masrafı satırları için cari açılmaz.
- ⚠ Tutarsızlık (açık karar §D.9): Muhasebe Cari Hesaplar ekranında IBAN değişikliği hâlâ "doğrulama isteği + Mali İşler Müdürü onayı" ile; Finansal Muhasebe tarafında ödeme sonrası otomatik. Ürün sahibi karar verecek; o zamana kadar iki kuralı da kodlama.

#### D.5.5 Banka hareketleri sekmesi
- Ödeme listesindeki bir kayıtla eşleşen hareket "✓"; elle/acil kayıtla eşleşen "AÖ-… ✓" ya da "· eşleşmeyen".
- Ödeme listesinde olmayan çıkış: "**Ödeme listesinde yok**" + "**Listeye ekle**" → Acil öde penceresi banka modunda açılır (ödendi kaydı; tutar ve tarih bankadan gelir, değiştirilemez). Fatura eklenirse açıklamasız havalenin kime gittiği belli olur.
- Sisteme hiç girmeden talimatla çıkan ödemeyi Balbal böyle yakalar ve uyarır; kayıt zorlamaz.

---

### D.6 Banka ekstresinden otomatik tanıma — ZİNCİR YOK, backend'de şart

**Karar (ürün sahibi, 08.10.2026):** Hazine işlemleri, banka masraf / komisyonları ve otomatik ödeme talimatlı faturalar için ödeme zinciri kurulmayacak. Balbal bu hareketleri **banka ekstresinden tanır ve kaydı kendisi doldurur**; Finansal Muhasebe §D.2 onayıyla geçirir. Arayüzde yeri: Finansal Muhasebe → Ödeme Listesi → Banka hareketleri.

#### D.6.1 Girdi
- Banka API (hesap hareketleri) ya da yüklenen ekstre: MT940, camt.053, Excel, PDF.
- Aynı hareket hem API'den hem ekstreden gelebilir. Tekilleştirme anahtarı: hesap + valör + tutar + banka referans no.

#### D.6.2 Sınıflandırma (her çıkış ve giriş hareketi için)

| Tür | Nasıl tanınır | Balbal ne doldurur |
|---|---|---|
| **Hazine · şirketler arası virman** | Karşı IBAN grubun kendi hesaplarından biri (Şirket Bilgileri'ndeki hesaplar). İki bacak eşleşir: çıkış ve giriş, aynı tutar, aynı ya da ertesi gün | Gönderen ve alan şirket, hesaplar, tutar; "virman" türü |
| **Hazine · döviz alım / satım** | Aynı bankada aynı gün TL ve döviz bacakları; açıklamada "DÖVİZ ALIŞ/SATIŞ" ya da işlem kodu | İki bacak, uygulanan kur, o günün TCMB kuruyla farkı (not) |
| **Hazine · vadeli mevduat / repo** | Vadeli hesaba aktarım ve vade dönüşü; faiz ve stopaj satırları | Anapara, vade, faiz, stopaj |
| **Hazine · DSRA / rezerv hesabı** | Karşı hesap, kredi sözleşmesinde tanımlı rezerv hesabı (§D.1 kart) | Tutar; sözleşmedeki rezerv yükümlülüğü ile karşılaştırma (not) |
| **Hazine · ortaklık ödemeleri** (temettü, sermaye avansı) | Karşı taraf ortak; açıklama | Tutar, ortak; yönetim kurulu kararı belge olarak istenir |
| **Banka masraf / komisyon** | Banka işlem kodları ve açıklama (EFT/havale ücreti, hesap işletim, teminat mektubu komisyonu, BSMV). Ana işlemle aynı referansa bağlı olabilir | Masraf türü, bağlı olduğu ana işlem, BSMV ayrımı; sözleşme ya da tarifedeki orandan sapma varsa not |
| **Otomatik ödeme talimatlı fatura** (elektrik, su, telefon, abonelik) | Açıklamada abone / tesisat no, kurum adı | Kurum, abone no, dönem; entegratörden gelen e-faturayla eşleştirme (tutar + abone no + dönem) |

- Tanınamayan çıkış mevcut davranışla devam eder: "Ödeme listesinde yok" + "Listeye ekle" (§D.5.5).

#### D.6.3 Kayıt ve onay
- Balbal tanıdığı hareket için ödendi kaydını doldurur: tür, şirket, karşı taraf, masraf yeri / proje, tutar, döviz, kur, ilgili belge.
- §D.2 onayı şart; onaysız kayıt muhasebe kaydı önerisine / ERP'ye geçmez.
- **Toplu onay:** aynı gün tanınan N hareket tek tabloda, tek onayla geçer ("Seçilileri öde" penceresinin kalıbı).

#### D.6.4 Öğrenme (§D.1)
- Açıklama / kod → tür eşlemeleri ve kullanıcı düzeltmeleri kümülatif saklanır; sonraki ekstrede kural olarak uygulanır.
- Komisyon oranları, rezerv yükümlülükleri ve abone numaraları ortak klasördeki belgelerden (kredi sözleşmesi, banka tarifesi, abonelik sözleşmesi) öğrenilir.

#### D.6.5 Teknik notlar
- Her kayıtta: kaynak satır referansı (ekstre id + satır), güven skoru, doldurulan alanlar, onaylayan + zaman.
- Mükerrer kontrolü: aynı hareket iki kez kayda girmemeli.
- Hazine ve masraf satırları için cari açılmaz.

---

### D.7 Personel masrafı / iş avansı ve "+ Ödeme talebi" menüsü

**Ürün:** Ürün 2 (belge okuma Ürün 1 altyapısı; tablo, kur, avans netleme Ürün 2). **Ortak bileşen:** `Masraf-Formu` (canvas: Ortak Bileşenler, demo panoları `Masraf-Demo-*`).

#### D.7.1 Her ana ekranda tek menü: "+ Ödeme talebi ▾" (üst bar, "Belge yükle"nin yanında)
- Her departmanda aynı başlık; açılınca o departmanın açabileceği ödeme talepleri sıralanır. En üstte **Taleplerim** (kişinin açtığı talepler ve durumları — `Yeni-Odeme-Talebi` listesi pencere olarak açılır).
- Tür listesi tek kaynaktan gelir (`Yeni-Odeme-Talebi` TYPES); menü ve "+ Yeni ödeme talebi → Tür" ekranı aynı listeyi gösterir. İki ayrı liste tutulmaz.
- Herkeste: **Masraf · Avans**. Departmana / kişiye göre ek: Ürün/hizmet (PO) · Sözleşmeye istinaden (yalnızca sözleşme klasörüne erişimi olana) · Kredi ödemesi (Proje Finans) · Bordro (İK) · Vergi / yasal (Muhasebe) · İdari İşler talebi (İdari İşler). Finansal Muhasebe'nin Acil öde'si bu menüde değil, "Talimat oluştur ▾"de kalır.
- Kişinin erişebildiği klasörlere göre liste değişir (T-5): Hakan Tunç'ta PO var, Kerem Aydın'da yok (demo).

#### D.7.2 Masraf formu
- İki seçenek: **Masraf** (harcanmış; fiş / fatura var) · **Avans** (ileride harcanacak; tutar, amaç, harcama tarihi, masraf yeri).
- **Çoklu yükleme:** fotoğraf, PDF, e-Arşiv / e-Fatura XML; tek seferde birden çok belge. Balbal her belgeden çıkarır: tarih, satıcı, VKN, belge no, tutar, KDV, para birimi, kategori (yol, konaklama, yemek, akaryakıt, diğer), masraf yeri / proje (kişinin biriminden; değiştirilebilir).
- **Tablo:** her belge bir satır; Balbal'ın doldurduğu hücreler turuncu, personel düzeltebilir. Satır altında kısa uyarılar:
  - **Okunamadı** → elle doldurulmadan ya da satır çıkarılmadan gönderilemez (tek engelleyen uyarı; tutar yoksa toplam yanlış olur).
  - **Mükerrer** → aynı belge no daha önce bir masraf talebinde verilmiş (deterministik kontrol, belge no + VKN).
  - **Alıcı şirket değil** → e-fatura şirket değil personel adına; not düşer, engellemez.
  - **Yabancı para** → kur Balbal'dan (TCMB, belge tarihi); satırda "≈ X TL", toplamda para birimi başına ara toplam ve ≈ TL genel toplam. Kur ve tarihi kayda yazılır.
- **Açık avans:** kişinin kapanmamış avansı varsa "Açık avans AV-… · N TL · bu masrafla kapanır" seçeneği; işaretlenince sonuç: "Personele ödenecek X TL" ya da "Şirkete iade X TL" (masraf toplamı − avans). Avans formunda açık avans varsa uyarı çipi çıkar (engellemez).
- **Ödeme hesabı:** personelin İK kaydındaki maaş hesabı (IBAN girilmez, gösterilir).
- **Onaycılar:** personel istediği kadar onaycı seçer, sıra verir (departman → kişi). Onaycı yoksa doğrudan Finansal Muhasebe. **Sonraki her aşama araya onaycı ekleyebilir** (Zincir 1/3 ile aynı kural). Zorunlu "birim yöneticisi" onayı yoktur.
- §D.2 onayı: Balbal bir hücre doldurduysa onay şart; yeni belge eklenince sıfırlanır.
- Gönderilince `MS-26-0xx` / `AV-26-0xx` açılır; süreç şeridi: Talep → onaylar → Finansal Muhasebe → Ödendi (maaş hesabı).

#### D.7.3 Sonrası (öneri, canvas'ta henüz çizilmedi — Z8)
- Onaycı(lar) onaylar / reddeder / revize ister / araya onaycı ekler.
- Finansal Muhasebe ödeme listesine "Masraf · MS-26-0xx" düşer; avans kapanıyorsa net tutar listeye girer; IBAN maaş hesabından.
- Ödenir; belgeler Muhasebe'ye kayıt için gider (personel masrafı / avans hesapları).
- Kapanmayan avans için personele ve Finansal Muhasebe'ye hatırlatma (süre: açık karar).
- **Kurumsal kredi kartı:** kart ekstresi gelince (banka ekstresiyle aynı giriş, §D.6) harcamalar karta sahip personele düşer; personel fişini aynı formla yükler; ekstre satırı ↔ fiş eşleşmesi.

---

### D.8 Backend davranışında düzeltilmesi gerekenler

1. **Vadesi geçmiş kredi kaydı alarmı yok.** KR-26-007 (Garanti BBVA, 412.500 USD, vade 07.10.2026) ödenmeden "Ödeme listesinde" duruyor. Vadesi geçen ve ödenmemiş kayıt kırmızıya dönmeli; Proje Finans'a ve Mali İşler Müdürü'ne bildirim.
2. **Ürün 2 metinleri:** canvas'taki bazı Balbal notlarında neden-sonuç yorumu var ("baz oran yenilendi") → Ürün 3'e ait; Ürün 2 notu veri diliyle üretilmeli.
3. Demo belge eklemeleri (Kredi 2023-YS, masraf belgeleri, banka ekstreleri, takvim düzeltmeleri) **Ürün 1 notu Bölüm E**'ye taşındı.

---

### D.9 Açık kararlar (ürün sahibinde — kodlama bekler)

1. Fatura eklenen acil ödeme "eşleşmeyen" sayılmasın mı? (Şu an sayılmıyor; onaylanmadı.)
2. Cari IBAN değişikliği: Muhasebe ekranında onaylı değişiklik, Finansal Muhasebe'de ödeme sonrası otomatik — hangisi? (§D.5.4)
3. Acil öde'ye mükerrer fatura uyarısı (Zincir 4 3c mantığıyla) eklensin mi?
4. Onaycı başka onaycı ekleyebilir mi (pano 4-2)? Masraf/avans için "evet" kararı verildi; diğer zincirlerde teyit bekliyor.
5. Ürün/hizmet (PO) talebi herkese açılacak mı? (Satın alma formu şu an yalnızca Hakan Tunç için kurulu.)
6. Muhasebe menüsünde "Eşleşmeyen fatura" olsun mu? (Zincir 4 gelen e-faturadan başlıyor; boş talep olarak açılamıyor.)
7. Hakan'ın Görevler kartındaki "+ Satın alma talebi" ve İdari İşler'deki "+ İdari İşler talebi" düğmeleri menüyle mükerrer — kaldırılsın mı?
8. Hukuk ödemeleri (harç, icra, noter, avukat): öneri Zincir 6'ya "yasal" alt türü, başlatan Hukuk.
9. Piyasa ve şebeke ödemeleri (EPİAŞ, YEKDEM, TEİAŞ, dağıtım, EPDK, teminat): öneri ayrı zincir; Balbal tutarı piyasa verisiyle karşılaştırıp not düşer.
10. Kapanmayan avans hatırlatma süresi; kurumsal kart ekstresi girişi.


---

## E. Anayasa uyarıları (Ürün 2)

1. Dış bağlantılar (e-Fatura entegratörü, ERP, banka API'leri, TCMB, EPİAŞ) Ç-11/b ve T-14: kodlanmadan önce bir Proje Yetkilisinin Kayıtlı Kanalda onayı. Demo veride bunlar **dosya olarak** (dışa aktarım, .eml, Excel, MT940) simüle edilir; bağlantı kurulmaz.
2. Ödeme talimatı Resmi Kayıttır; Balbal yalnız taslak üretir (Ç-6, O-6).
3. Kurumsal Hafızaya neyin, hangi koşulla yazılacağı (belgeden öğrenilen bilgi kartı, §D.1) Kritik Geliştirme Kararıdır (Ç-15/7, O-7): onaydan sonra önce ADR.
4. Ürün 2'de yorum yoktur: karşılaştırma ve aritmetik veri diliyle yazılır; neden-sonuç ve tahmin Ürün 3'tür.
5. Aritmetik (faiz, kur, avans netleme, mükerrer kontrolü) deterministik koddadır, LLM'e bırakılmaz; her hesap denetim kaydına yazılır.


---

## F. Yükümlülük bağı (09.10.2026)

**Ürün:** bağı önermek ve kaydetmek Ürün 1 (Tanıma), yükümlülük durumu ve sapma hesabı Ürün 2 (Birleştirme), neden-sonuç Ürün 3. **Anayasa dayanağı:** v2.1 taslağı, PR #15 — Ek-B, Ü-3, Ü-4 ve yeni **O-13**. PR onaylanana kadar bu bölüm de ⛔ kuralına tabidir. **Canvas:** bu bölüm için ekran değişikliği yok; bağ veride yaşar, değeri Balbal'a soru sorulunca ortaya çıkar (Ü-10).

### F.1 Neden

Belgeler şirketin ne planladığını, akış kayıtları ne yaşadığını anlatır. Balbal'ın "sözleşmeye uyuldu mu", "bu süreç neden uzadı" gibi sorulara cevap verebilmesi için bir ödemenin, belgenin ya da notun **hangi işe ait olduğunu** bilmesi gerekir. Bugün kayıtlar yalnızca şirket ve masraf yerine bağlı; süreç adımına ve yükümlülüğe bağlı değil. Bu bağ olayın doğduğu anda kurulmazsa sonradan kurulamaz.

**Örnek (demo, mantığı anlatmak için; birebir uygulanacak senaryo değildir):** Kızılova'nın TEİ başvurusu için kurum yazısında başvuru bedelinin son günü 12.09. Enerji ödeme talebini açarken Balbal bağı önerir: *Kızılova RES › TEİ başvurusu › Başvuru bedeli*. Finansal Muhasebe ödeme tarihini kendi nakit planına göre 15.09 seçer ve not düşer. Başvuru 16.09'da yapılır, kurum yazısıyla bir sonraki döneme kalır. Yıllar sonra "TEİ sonucu neden geç çıktı?" sorusuna Balbal bu bağlar üzerinden tarih sırasıyla, kaynaklarıyla ve notu aynen aktararak cevap verir; kendi neden-sonuç cümlesini kurmaz.

### F.2 Model

- **Yükümlülük:** belgeden çıkarılan, konusu ve son tarihi olan madde (kredi taksiti, teminat mektubu, raporlama, harç, sigorta yenileme, eskalasyon yıldönümü vb.). Alanları: konu, son tarih, sorumlu departman, varsa tutar, kaynak (belge · versiyon · madde/sayfa). §D.1'deki bilgi kartlarının takvimli maddeleridir; ayrı bir öğrenme mekanizması kurulmaz. Balbal çıkarır (AI Taslağı), ilgili departman onaylar.
- **Olay:** sistemde zaten olan her kayıt — talep, PO, ödeme, fatura, belge, Kullanıcı Notu, görüş talebi, mail.
- **Bağ:** olayın bir ana bağı olabilir: **proje · süreç adımı · yükümlülük**. Ek bağlar en aza indirilir. Bağ zorunlu değildir; "genel" olabilir (telefon faturası gibi).
- **Yükümlülük durumu** elle girilmez; bağlı olaylardan hesaplanır: bekliyor / yerine getirildi / son gün geçti / kısmi, ve son günden sapma (gün). Hesap kodda yapılır (T-4).
- Süreç adımları mevcut Proje Geliştirme ağacından gelir; bu bölüm ağacı genişletmez.

### F.3 Bağı kim kurar ve onaylar (mevcut zincirlerle uyum)

Ayrı bir onay adımı **eklenmez**. Bağ, Balbal'ın doldurduğu bilgiler için zaten var olan onay satırının (§D.2) içindedir ve kayıt numarasına takılır; numara zincir boyunca taşındığı için bağ her adıma kendiliğinden geçer.

| Zincir | Bağ nerede kurulur | Not |
|---|---|---|
| Z1 satın alma, Z2 İdari alım | Talep formunda; talebi açan onaylar | Red → revizede bağ aynı PO'da kalır |
| Z3 sözleşme ödemesi | Balbal'ın sözleşme kalemi eşleştirmesinin parçası | Ayrıca sorulmaz; mükerrer satır açılmaz |
| Z4 eşleşmeyen fatura | Muhasebe'nin ilk ekranında | Çoğu zaman "genel" kalır |
| Z5 kredi, banka ekstresinden tanınan kayıtlar | Kayıt otomatik açılır | Bağ, kayda **ilk dokunan** kişinin onay satırıyla kesinleşir |
| Z6 vergi/yasal, Z7 bordro | Türden belli (vergi takvimi, bordro dönemi) | Bağ **kurala göre kodda** atanır; Balbal önerisi, notu ve onay satırı yoktur ("Balbal girmez" kararıyla uyumlu) |
| Masraf/avans, acil öde | Mevcut onay satırının içinde | — |

**Değişiklik kuralları:**
- Balbal onaylanmış bir bağı **kendisi değiştirmez**. Daha uygun eşleşme görürse yalnızca not düşer. (§D.2'deki "Balbal yeni bir şey doldurursa onay sıfırlanır" kuralı ilerlemiş bir zincirde başkasının onayını sıfırlamasın diye.)
- Zincirdeki her kişi bağı değiştirebilir; bu yeni onay turu başlatmaz, denetim kaydına yazılır (kim, ne zaman, önce/sonra).

### F.4 Balbal'ın tutumu

- Balbal iş kararlarının niyetini ve zamanlamasını sorgulamaz; ödemeyi öne çekmeye zorlamaz. Şirket bir işlemi bilerek bekletiyor olabilir.
- Seçilen tarih yükümlülüğün son gününü geçiyorsa yalnızca bilgi notu + "Onaylıyorum"; gerekçe istenmez. Ödeme listesinde ayrıca uyarı rengi yoktur.
- Kayıtta gerekçe yoksa sonradan sorulduğunda "kayıtta gerekçe bulunmuyor" der; tahmin etmez (Ç-6).

### F.5 Ölçüm kaydı (baştan, ekran değişikliği yok)

Ürün testinde Balbal'ın doldurma yaklaşımının sahada tutup tutmadığı ölçülecek. Bu veriler geriye dönük toplanamadığı için kayıt baştan tutulmalı:
- Balbal'ın doldurduğu her alan için kullanıcı düzeltmesi: alan, Balbal'ın değeri, kullanıcının değeri, güven skoru.
- Onay ekranının açılması ile onay satırının işaretlenmesi arasındaki süre.
- Bağın önerildiği, kabul edildiği, değiştirildiği ya da "genel" seçildiği bilgisi.

Bu kayıtlar toplu değerlendirilir (alan bazında düzeltme oranı, ortalama onay süresi); kişi bazında performans değerlendirmesinde kullanılmaz (O-13/8). Üzerine kural ya da uyarı kurulmaz; aksiyon ölçüm sonuçlarından sonra ürün sahibince belirlenir.

### F.6 Kodlamadan önce

- Yükümlülük ve bağın veri modeli Kurumsal Hafızaya ne yazıldığını belirlediği için Kritik Geliştirme Kararıdır (Ç-15/7, O-7): onaydan sonra önce kısa bir ADR.
- Tek akış motoru ilkesi (O-13/1): zincirler motorun yapılandırmalarıdır; zincir başına ayrı kod yolu kurulmaz.


---

## G. Dış veri bağlantı katmanı (09.10.2026)

**Ürün:** ortak altyapı (T-1); bağlantıyı kullanan özellik kendi ürün etiketini taşır. ⛔ kuralı geçerli. **Canvas:** ekran değişikliği yok.

### G.1 Karar

Ürün sahibi: dış kaynaklar **bağlanacakmış gibi** kurulur; gerçek bağlantının ne zaman ve hangi kaynakla açılacağına sonra karar verilir. Demo şirketler kurgusal olduğu için santrallerimiz EPİAŞ'ta yok, faturalarımız entegratörde yok; altyapı buna rağmen gerçek bağlantıya hazır olmalı.

### G.2 Mantık — tek arayüz, değişebilir kaynak

- Her dış kaynak için **tek bir bağlantı arayüzü** vardır: EPİAŞ Şeffaflık, e-Fatura/e-Arşiv entegratörü, banka (hareket ve ekstre), TCMB (döviz kurları), ERP (cari, muavin, kayıt dışa aktarımı).
- Uygulamanın geri kalanı (Balbal, zincirler, ekranlar, hesap katmanı) yalnızca bu arayüzle konuşur; verinin dosyadan mı canlı bağlantıdan mı geldiğini bilmez.
- Her arayüzün iki kaynak modu vardır:
  - **Dosya modu (şimdi):** veri, gerçek formatta hazırlanmış dosyalardan okunur.
  - **Canlı mod (sonra):** aynı arayüze gerçek bağlantı takılır. Uygulamada başka hiçbir şey değişmez.
- Gelen her kayıt kaynağını taşır: kaynak türü, mod, dosya ya da çağrı kimliği, çekme zamanı. Balbal cevaplarında kaynak gösterimi buradan beslenir (Ç-7).
- Dosya modu yalnızca demo için değildir. Tam kapalı kurulumda (model C) dış bağlantı açılamayabilir; müşteri o durumda dışa aktarımları elle yükleyerek aynı sistemi kullanmaya devam eder.

### G.3 Demo kaynak formatları (dosya modu)

| Kaynak | Demo verinin biçimi | Not |
|---|---|---|
| EPİAŞ — piyasa fiyatları (PTF, YEKDEM birim fiyatı) | EPİAŞ Şeffaflık yanıt yapısında | **Gerçek, kamuya açık değerler** kullanılır (ürün sahibi kararı, 09.10). Değerler Şeffaflık Platformu'ndan demo dönemi için bir kez dışa aktarılıp dosya olarak konur; canlı çekme yapılmaz. Piyasa fiyatı müşteri verisi değildir, demo inandırıcılığı için gerçektir |
| EPİAŞ — santral üretimi, uzlaştırma | EPİAŞ Şeffaflık yanıt yapısında | **Kurgusal.** Santral kimlikleri gerçek bir santrale ait olmaz (Ürün 1 notu §D.5/7); üretim değerleri kurulu güç ve kapasite faktörleriyle tutarlı |
| e-Fatura / e-Arşiv | UBL-TR XML (gelen ve giden) | Kurgusal taraflar ve VKN'ler; ledger ile aynı |
| Banka | MT940 / camt.053 / Excel ekstre | Ürün 1 notu §E.6'daki örnekler; API yanıtı biçimi de aynı kayıt modeline dönüşür |
| TCMB döviz kurları | TCMB'nin günlük kur dosyası yapısında | Değerler demo tek değer listesindeki kur serisidir |
| ERP | Cari listesi, muavin ve kayıt dışa aktarımı (Excel/CSV) | Hangi ERP olduğu müşteriye göre değişir; arayüz ERP'den bağımsız |

PTF gerçek, üretim kurgusal olduğu için elektrik satış hesabı (B-21) gerçek fiyat × kurgusal üretim ile çalışır. Bu bilinçli bir tercihtir.

### G.4 Uyarılar kaynaktan bağımsızdır (TEMEL)

Balbal'ın asıl işi form doldurmak değildir; form işi kolaylaştırır. Asıl değer, personeli destekleyen uyarılardır: çift ödeme, eşleşmeyen ödeme, son günü geçen yükümlülük, fatura ve banka tutarı farkı, sözleşme dışı kalem. Bu yüzden:

- Bu kontroller, kayıt **hangi yoldan gelirse gelsin** aynı şekilde çalışır: Balbal formu, banka hareketi, e-fatura, ERP dışa aktarımı ya da elle yüklenen dosya.
- Bir işlem Balbal'ın hiçbir formundan geçmeden, örneğin doğrudan ERP'de ya da bankada yapıldıysa, Balbal onu bağlantı katmanından görür ve aynı uyarıyı üretir. Bankadan tanıma (Bölüm D.6) bunun ilk örneğidir.
- Kontroller deterministik koddadır (T-4); LLM kural uygulamaz, bulguyu açıklar.
- Uyarı engellemez: not + gerekirse "Onaylıyorum" (Bölüm A/1).

### G.5 Kodlamadan önce

- Canlı modun açılması her kaynak için ayrı bir dış bağlantı kararıdır (Ç-11/b, T-14): bir Proje Yetkilisinin Kayıtlı Kanalda onayı olmadan canlı bağlantı kodu çalıştırılmaz. Dosya modu ve arayüzün kendisi bu onayı beklemez; bu not ⛔ kuralına tabidir.
- Kimlik bilgileri ve uç adresleri koda yazılmaz; yapılandırmada durur.
- Gerçek PTF/YEKDEM dosyasının alınması tek seferlik bir dışa aktarımdır, canlı bağlantı değildir; dosyanın kaynağı ve alındığı tarih ledger'a yazılır.
