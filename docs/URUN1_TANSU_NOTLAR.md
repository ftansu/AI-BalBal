# Ürün 1 — Tansu Notları

**Tarih:** 06.10.2026 · **Güncelleme:** 07.10.2026 (§1 proje adları kararı, §6 önlisans süreci eklendi) · **Kaynak:** ürün sahibinin web testi (Ürün 1 arayüzü, Balbal soru-cevap ve belge yükleme ekranları)
**Kapsam:** Ürün 1 · Notlar mantığı anlatır; kurulum geliştiriciye aittir.

> Öncelik sırası ürün sahibinindir: **4 (etiketler) acil**, ardından 2 (Balbal davranışı) ve 3 (belge yükleme). 1 (hesaplar) testlerin anlamlı olması için ön koşuldur.

---

## 1. Tüm personel için hesap ve ekip sohbeti

**Beklenen:** Güncel personel listesindeki herkes sisteme giriş yapabilen bir demo kullanıcıdır. Departman adıyla açılmış eski hesapların (`finans`, `hukuk`, `enerji` vb.) yerini alırlar; sistem yöneticisi hesabı listeye dahil değildir.

- Her kişinin pozisyonu, departmanı, alt birimi ve yöneticisi aşağıdaki listeden gelir. Yönetici bilgisi elle girilmez, İK hiyerarşi şemasından türetilir.
- Kullanıcılar sağ alttaki **ekip sohbeti** butonundan birbirleriyle birebir ve grup halinde konuşabilmeli (B-06b). Balbal bu sohbetlere dahil edilemez; Balbal penceresi ile ekip sohbeti ayrıdır.
- Şifreler bu repoya yazılmaz (repo herkese açık). Demo şifreleri ayrı bir kanaldan paylaşılır.
- Kullanıcı adı önerisi: `ad.soyad`, Türkçe karakterler sadeleştirilmiş (ş→s, ç→c, ğ→g, ı→i, ö→o, ü→u). E-posta: `ad.soyad@xyzenerji.example`.
- Stajyer pozisyonu tanımlı ama şu an boş; hesap açılmaz.

**Güncel personel listesi** — 36 kişi, tamamı kurgusal. Kaynak: tasarım kanvasındaki İK şirket yapısı, 05.10.2026.

| Departman / birim | Pozisyon | Ad Soyad | Bağlı olduğu | Kullanıcı adı |
|---|---|---|---|---|
| Yönetim | Genel Müdür | Levent Aksoy | Yönetim Kurulu | levent.aksoy |
| Proje Finans | Proje Finans Müdürü | Kaan Turhan | Genel Müdür | kaan.turhan |
| Proje Finans | Proje Finans Uzmanı | Oğuz Tekin | Proje Finans Müdürü | oguz.tekin |
| Mali İşler | Mali İşler Müdürü | Elif Şahin | Genel Müdür | elif.sahin |
| Mali İşler / Muhasebe | Muhasebe Uzmanı | Selin Arslan | Mali İşler Müdürü | selin.arslan |
| Mali İşler / Finansal Muhasebe | Finansal Muhasebe Uzmanı | Gökhan Erdem | Mali İşler Müdürü | gokhan.erdem |
| Hukuk | Hukuk Müdürü | Ayşe Yılmaz | Genel Müdür | ayse.yilmaz |
| Hukuk | Avukat | Burak Çelik | Hukuk Müdürü | burak.celik |
| İK | İK Uzmanı | Zeynep Koç | Genel Müdür | zeynep.koc |
| İdari İşler | İdari İşler Sorumlusu | Deniz Kaya | Genel Müdür | deniz.kaya |
| Enerji | Enerji Grubu Müdürü | Kerem Aydın | Genel Müdür | kerem.aydin |
| Enerji / Proje Geliştirme | Proje Geliştirme Uzmanı | Cem Aktaş | Enerji Grubu Müdürü | cem.aktas |
| Enerji / O&M | O&M Mühendisi | Onur Yıldız | Enerji Grubu Müdürü | onur.yildiz |
| Enerji / Üretim-Piyasa | Üretim/Piyasa Uzmanı | Pınar Güler | Enerji Grubu Müdürü | pinar.guler |
| Enerji / Saha Operasyon | Saha Operasyon Müdürü | Murat Kılınç | Enerji Grubu Müdürü | murat.kilinc |
| Saha Operasyon / Karatepe RES | Saha Teknisyeni | Emre Yalçın | Saha Operasyon Müdürü | emre.yalcin |
| Saha Operasyon / Karatepe RES | Saha Teknisyeni | Furkan Kurt | Saha Operasyon Müdürü | furkan.kurt |
| Saha Operasyon / Karatepe RES | Saha Teknisyeni | Volkan Özdemir | Saha Operasyon Müdürü | volkan.ozdemir |
| Saha Operasyon / Karatepe RES | Saha Teknisyeni | Serkan Doğan | Saha Operasyon Müdürü | serkan.dogan |
| Saha Operasyon / Boztepe RES | Saha Teknisyeni | Uğur Şimşek | Saha Operasyon Müdürü | ugur.simsek |
| Saha Operasyon / Boztepe RES | Saha Teknisyeni | Barış Ateş | Saha Operasyon Müdürü | baris.ates |
| Saha Operasyon / Boztepe RES | Saha Teknisyeni | Sinan Polat | Saha Operasyon Müdürü | sinan.polat |
| Saha Operasyon / Boztepe RES | Saha Teknisyeni | Tolga Aslan | Saha Operasyon Müdürü | tolga.aslan |
| Saha Operasyon / Yeşilova RES | Saha Teknisyeni | Mert Aydoğan | Saha Operasyon Müdürü | mert.aydogan |
| Saha Operasyon / Yeşilova RES | Saha Teknisyeni | Okan Yavuz | Saha Operasyon Müdürü | okan.yavuz |
| Saha Operasyon / Yeşilova RES | Saha Teknisyeni | Gürkan Taş | Saha Operasyon Müdürü | gurkan.tas |
| Saha Operasyon / Yeşilova RES | Saha Teknisyeni | Erkan Bulut | Saha Operasyon Müdürü | erkan.bulut |
| Saha Operasyon / Güneşalan GES | Saha Teknisyeni | Ece Duman | Saha Operasyon Müdürü | ece.duman |
| Saha Operasyon / Güneşalan GES | Saha Teknisyeni | Yusuf Akın | Saha Operasyon Müdürü | yusuf.akin |
| Saha Operasyon / Güneşalan GES | Saha Teknisyeni | Ramazan Er | Saha Operasyon Müdürü | ramazan.er |
| Saha Operasyon / Güneşalan GES | Saha Teknisyeni | Nihat Çetin | Saha Operasyon Müdürü | nihat.cetin |
| Enerji / EPC | EPC Proje Mühendisi | Hakan Tunç | Enerji Grubu Müdürü | hakan.tunc |
| EPC | İnşaat Mühendisi | Caner Doğru | EPC Proje Mühendisi | caner.dogru |
| EPC | Elektrik Mühendisi | Melis Karaca | EPC Proje Mühendisi | melis.karaca |
| EPC | EPC Teknikeri | Halil Öztürk | EPC Proje Mühendisi | halil.ozturk |
| EPC | EPC Teknikeri | Semih Kaplan | EPC Proje Mühendisi | semih.kaplan |

**Proje adları — karar verildi (ürün sahibi, 07.10.2026):** "Ankara RES / İzmir RES" aşaması geride kaldı. Demo veri, kanvastaki kurgu şirket grubuna göre hazırlanır:
- **Ana şirket:** XYZ Enerji A.Ş.
- **İşletmedeki projeler:** Karatepe RES, Yeşilova RES, Boztepe RES, Güneşalan GES
- **Geliştirmedeki projeler:** Kızılova RES, Akyar GES, Demirci RES

`ANK_RES` / `IZM_RES` gibi eski kodlar katalogdan ve belgelerden kalkar. Her departmanda her SPV'nin ayrı klasörü olur; yüklenen belge kendi SPV klasörüne yerleşir. Frontend bittiğinde veri kütüphanesi de bitmiş olmalı ki doğrudan teste geçilebilsin.

---

## 2. Balbal bir iş arkadaşı gibi davranmıyor

**Gözlem (06.10.2026 testi, kapsam: yetkili tüm departmanlar · tüm projeler):**

| Soru | Balbal'ın cevabı |
|---|---|
| ankaranın ilk kredi ödemesi ne zaman ne kadar? | Veri yok |
| peki amendment var mı hiç? | Veri yok |
| amendment ne demek biliyor musun? | Veri yok |

Aynı arşivde `AMD01`, `AMD02` ve `ANK_RES` etiketli belgeler var. Yani en azından tadil belgeleri sistemde mevcut, ama Balbal bunları bulamıyor.

**Sorun:** Balbal "veri yok" kalıbıyla konuşmayı kesip atıyor. Yanlış cevap vermesini kesinlikle istemiyoruz. Ama şu haliyle işlevsel bir iş arkadaşı değil. Bu konu 03.10.2026'da da iletilmişti ("emin değilse / bulamadıysa veri yok" kuralı konuşmayı kesmek değildir); hâlâ uygulanmamış.

**Anayasa dayanağı:** Bu davranış zaten Anayasa **Ç-7.1** (ve Ek-D S-10) ile zorunlu. "Veri Yok" bir cevap sonu değil, başlangıcıdır. Sıra şöyledir: anlama kontrolü → durum bildirimi → yetki içindeki ilgili belgeleri gösterme teklifi → iletişimi açık bırakma. Ekrandaki cevaplar bu dört adımın hiçbirini içermiyor; mevcut davranış Ç-7.1'e aykırı.

Beklenen mantık:

- **Terim soruları.** "Amendment ne demek biliyor musun?" bir belge sorusu değil, bir kavram sorusudur ve "veri yok" bu soruya verilecek bir cevap değildir. Ç-7.1'in ilk adımı (anlama kontrolü) burada doğal yoldur: Balbal "amendment'ı tadil / değişiklik sözleşmesi olarak anlıyorum" der ve bu anlamla arşivde arar. Terimi tanımıyorsa "bu terimi tanımıyorum" diyebilir.
- **Açık soru (Proje Yetkilileri):** Belgeden bağımsız genel bir terim tanımı vermek (ör. "amendment, sözleşmenin değiştirilmesidir") Ürün 1'de serbest mi, yoksa Ç-6'daki "kaynakta olmayan bilgi" sınırına mı girer? Karar verilene kadar Balbal terimi anlama kontrolü ve belge araması üzerinden ele alır; kaynaksız tanım cümlesi kurmaz.
- **Terimden belgeye köprü.** Balbal terimin Türkçe karşılığından (amendment → tadil, değişiklik sözleşmesi, ek protokol) yola çıkıp klasörlerde arayabilmeli. Bulduğu belgeleri kaynağıyla göstermeli. Örneğin "Ankara RES kredisine ait iki tadil belgesi buldum: …".
- **Sohbet bağlamı.** "Peki amendment var mı hiç?" bir önceki sorunun devamıdır (Ankara RES kredisi). Balbal konuşmanın bağlamını taşımalı; her mesajı sıfırdan bağımsız bir soru gibi ele almamalı.
- **Netleştirme ve öneri.** Soru belirsizse ya da terim belgelerle eşleşmiyorsa, Balbal olası karşılıkları önerip "bunu mu kastettiniz?" diye sorar. Bulamadığında ne aradığını ve nerede aradığını söyler: "Ankara RES kredi klasöründe ödeme planı bulamadım; geri ödeme planı Excel'i yüklü mü?" gibi.
- **Güvenlik çizgisi aynı kalır.** Belge içeriği hakkında yorum ve tahmin yok, kaynak gösterilir. Hesaplanmış toplam yoksa Balbal hesaplamaz; bulduğu kayıtları "elimde sadece bunlar var" diye listeler. Kavramsal açıklamanın şirket belgesi olmadığı cevapta görünür olmalı.

**Geliştiriciye soru:** "Ankara'nın ilk kredi ödemesi" sorusu bir bulma hatası mı, yoksa arşivde ödeme planı içeren bir belge mi yok? Hangisi olduğu test raporunda ayrıca belirtilsin.

---

## 3. Belge yüklemede alanları önce kişi dolduruyor

**Gözlem:** Belge yüklenirken sistem alanları önce kişinin doldurmasını istiyor. Etiketlerde "Mevcut: —" görünüyor, yani Balbal hiçbir etiket uygulamamış.

**Bu kesinlikle olmamalı.** Akış şöyledir:

1. Belge atılır, önce Balbal okur.
2. Balbal departmanı, klasörü ve alt klasörü bulur; belge adını, tarihini, karşı tarafı, türü ve etiketleri **kendisi doldurur**.
3. Kişi yalnızca gerekiyorsa düzeltir ve onaylar. Eminlik %80'in altındaki alanlarda "Onaylıyorum" işareti zorunludur ve log tutulur.

Boş form ve "lütfen doldurun" yaklaşımı Ürün 1'in temel iddiasına (veriye hakimiyet, minimum personel yükü) aykırıdır.

---

## 4. Etiketler — ACİL

**Gözlem:** Yükleme ekranında sunulan kimlik etiketleri: `AMD01`, `AMD02`, `ANK_RES`, `COMPANY`, `DRAFT`, `EXECUTED`, `IZM_RES`, `onay akışı`, `test`, `V01`, `V02`.

Sorunlar:

- Bunlar kullanıcı etiketi değil, sistem/geliştirme kodları. Bir personel `AMD01` ya da `V02`'nin neyi bulduğunu anlamaz.
- Dil ve biçim karışık: İngilizce büyük harf kodlar ile Türkçe küçük harf ifade (`onay akışı`) aynı listede.
- `test`, `COMPANY` gibi geliştirme artıkları müşteri kataloğunda olmamalı.
- Sürüm (V01/V02) ve imza durumu (DRAFT/EXECUTED) etiket değil, belgenin kendi bilgisidir. Bunlar belge alanı ve versiyon zinciri (B-07) ile tutulmalı; etiket listesini kalabalıklaştırmamalı.
- Balbal etiketleri otomatik uygulamıyor (madde 3).

**Beklenen** (BACKEND_GAPS §4.7.4 ile aynı ilke): Etiketin görevi belgeyi 5 yıl sonra bulmaktır. Az, Türkçe, okunur ve sabit katalogdan gelir. Kimlik etiketleri proje, konu ve tür bildirir, örneğin `#karatepe-res #pf-kredi #tadil`. Değişiklik etiketleri yalnızca tadil ailesinde ve belge o konuyu gerçekten değiştiriyorsa kullanılır, örneğin `#faiz-değişikliği`, `#teminat-yapısı-değişikliği`. Hedef, "hangi tadille Karatepe RES'te faiz değişti?" sorusuna Balbal'ın hemen cevap verebilmesi.

Mevcut katalog bu ilkeye göre temizlenmeli. Ardından demo belgeler yeniden etiketlenmeli.

---

## 5. Gerçekçi test belgeleri

Testlerin anlamlı olması için sunucudaki demo belgeler gerçekçi sözleşme, Excel, taranmış PDF, fotoğraf, Word ve mail karışımıyla yenilenecek. Kredi sözleşmesi bölümleri, tadil zinciri, nakit akış Excel'i, yeni proje finansal modeli ve test soruları ayrı bir "Test Belge Seti Rehberi" ile paylaşıldı. Belgelerdeki kişiler yukarıdaki listeden seçilir; listede olmayan bir çalışan adı belgelerde geçmez.

---

## 6. Şirket önlisans süreci — geliştirme projelerinin belge seti

**Neden önemli:** Proje geliştirme süreçlerinin Enerji ekranlarında ayrıntılı gösterilmesi, Ürün 2'ye geçişte en önemli konulardan biridir (03.10.2026). Enerji ana sayfasındaki **Geliştirme** çizelgesi ve **Süreç ağacı** bu belgelerden beslenir. Ekranda adı geçen her dosya gerçekten indirilebilir olmalı (P-4). Belge yoksa link kırılır ve Balbal "veri yok" der.

**Kaynak:** Bu bölümdeki adım listesi, süreler ve dosya adları tasarım kanvasından alınmıştır: `Ana-Sayfa-Enerji.dc.html`, `NODES`, `TREE`, `devProjectsRaw`, `TREE_EXTRA` ve `TREE_NOTES`. Kanvas tek kaynaktır. Belge setinde kanvastan farklı bir ad, tarih veya durum çıkarsa bu bir sapmadır ve bize sorulur.

**Mevzuat uyarısı:** Kurallar sık değişiyor. Bunlara örnek EPDK'nın yıllık teminat ve başvuru bedeli kararları, ÇED eşikleri ve kanvasta atıf yapılan 24.07.2026 tarihli imar/ruhsat düzenlemesi. Belgeleri üretmeden önce güncel mevzuat webden kontrol edilmeli. Başlıca dayanaklar:
- 6446 sayılı Elektrik Piyasası Kanunu
- Elektrik Piyasası Lisans Yönetmeliği
- ÇED Yönetmeliği
- Rüzgâr ve güneş başvurularına ilişkin teknik değerlendirme ve yarışma düzenlemeleri
- TEİAŞ bağlantı mevzuatı

Tutarlar kurgusaldır, ama mertebeleri gerçekçi olmalı. Burada anlatılan yol **YEKA dışı, lisanslı** RES/GES yoludur; YEKA bu bölümün kapsamında değildir.

### 6.1 Süreç mantığı

Süreç tek bir çizgi değil, bir önkoşul ağıdır. Önlisans verildiği anda birçok yükümlülük paralel başlar; bazılarının yasal son başvuru tarihi önlisans tebliğinden itibaren işler. Balbal'ın ileride "Kızılova'da lisans başvurusunu ne engelliyor?" gibi soruları cevaplayabilmesi için her belgede iki şey açıkça yazmalı: hangi adıma ait olduğu ve tarihi.

**A. Önlisans öncesi**

| Adım | Kurum | Mantık ve süre | Tipik belgeler |
|---|---|---|---|
| Rüzgâr / güneş ölçümü | Ölçüm danışmanı | En az 12 aylık ölçüm, son 3 yıl içinde yapılmış olmalı | Ölçüm istasyonu kurulum tutanağı, 12 aylık ölçüm raporu (Excel veri eki ile), kalibrasyon sertifikaları |
| Önlisans başvurusu | EPDK | Ekim başvuru penceresi: RES için ilk 5, GES için son 5 iş günü. Teminat mektubu ve asgari sermaye şartı aranır | Başvuru dilekçesi, başvuru formu, Lisans Yönetmeliği'ne uygun esas sözleşme, ortaklık yapısı, teminat mektubu, başvuru bedeli dekontu, saha koordinatları (KML/Excel), ölçüm raporu |
| Teknik değerlendirme | ETKB (YEGM) | Teknik uygunluk verilir; uygun bulunmayan başvuru reddedilir | Teknik uygunluk yazısı |
| Bağlantı görüşü | TEİAŞ / dağıtım şirketi | Görüş 45 günde verilir, 10 iş günü içinde kabul edilir. Aynı bağlantı noktasına birden çok başvuru varsa yarışma yapılır | Bağlantı görüşü yazısı, kabul yazısı, varsa yarışma tutanağı |
| Önlisans | EPDK Kurul kararı | 24 ay geçerlidir; Kurul kararıyla 36 aya uzatılabilir. Yükümlülüklerin süresi bu tarihten başlar | Kurul kararı ve önlisans belgesi (numarası, süresi ve **bitiş tarihi açıkça yazılı**), EPDK sunum yazısı |

**B. Önlisans dönemindeki yükümlülükler** (paralel yürür, önkoşulludur)

| Adım | Kurum | Önkoşul | Mantık ve süre | Tipik belgeler |
|---|---|---|---|---|
| Edinim (saha hakları) | Tapu, malikler | Önlisans | Mülkiyet veya kullanım hakkı: satış, kira veya irtifak. GES'te özel arazide en az 10 yıllık kira/irtifak tapuya şerh edilir | Değerleme raporu, malik görüşme tutanağı, satış vaadi, tapu devri, kira sözleşmesi, şerh |
| Arazi izinleri | Orman Genel Müdürlüğü, mera komisyonu, tarım | Edinim | Orman ön izni ve kesin izni, mera tahsis amacı değişikliği, tarım dışı kullanım | Başvurular, ön izin ve kesin izin kararları, komisyon yazıları |
| ÇED | Çevre, Şehircilik ve İklim Değişikliği Bakanlığı | Önlisans | **Başvuru önlisanstan itibaren 90 gün içinde yapılmalı.** Rapor süreci gerekebilir | Başvuru / proje tanıtım dosyası, ek bilgi talebi, halkın katılımı toplantı tutanağı, kurum görüş yazısı, ÇED kararı |
| Teknik Etkileşim Analizi (TEA) — yalnızca RES | TEİAŞ / ETKB | Önlisans | **Başvuru önlisanstan itibaren 180 gün içinde yapılmalı.** Radar ve haberleşme etkisi değerlendirilir; olumsuz sonuç yerleşim revizyonu gerektirir | TEA başvurusu, olumlu veya olumsuz görüş (olumsuzsa etkilenen türbinler ve gerekçe) |
| Askeri yasak yazısı | MSB / Genelkurmay | Önlisans | Askeri yasak ve güvenlik bölgesi görüşü | Başvuru yazısı, görüş yazısı |
| Jeolojik-jeoteknik etüt | Etüt onayı | Önlisans | İmar planı için kurum görüşlerinden önce onaylanmalı | Etüt raporu, onay yazısı |
| Kurum görüşleri | İlgili kurumlar (DSİ, Karayolları, kültür varlıkları, BOTAŞ, maden vb.) | Etüt | Kurumlar 30 gün (gerekirse +30) içinde görüş verir; süresinde cevap gelmezse itiraz yok sayılır | Kurum görüşleri dosyası (her kurumun yazısı ayrı) |
| Bağlantı anlaşmasına çağrı | TEİAŞ | Önlisans | Çağrı başvurusu ve katkı payı anlaşması | Çağrı mektubu, katkı payı anlaşması |
| İmar planı onayı | ETKB | Kurum görüşleri, ÇED, TEA, askeri yazı, arazi izinleri | **Kritik yol.** 30 gün inceleme, 15 gün askı, 15 gün itiraz; ardından parselasyon | Plan onay yazısı, askı ilanı |
| Kamulaştırma | EPDK kamu yararı kararı | İmar | Gerekirse; malikle anlaşılamazsa | Kamu yararı kararı, kamulaştırma dosyası, dava evrakı |
| Ön proje / kat'i proje onayı | ETKB (veya yetkili kuruluş) | İmar, TEA, edinim | İnşaata başlamak için gereken proje onayı | Proje onay yazısı |
| Yapı ruhsatı | ETKB | Proje onayı | Ruhsat 30 günde verilir; inşaata 2 yıl içinde başlanmalı, 5 yılda bitirilmeli | Yapı ruhsatı |
| Sermaye artırımı | Şirket (Genel Kurul) | Yapı ruhsatı | Lisans öncesi sermaye yatırımın %20'sine çıkarılır | Genel kurul kararı, ticaret sicil gazetesi, sermaye yatırıldı dekontu |

**C. Lisans ve sonrası**

| Adım | Kurum | Mantık | Tipik belgeler |
|---|---|---|---|
| Lisans başvurusu | EPDK | Tüm yükümlülükler bitince ve **önlisans süresi dolmadan** başvurulur; değerlendirme 45 gün | Başvuru dilekçesi, yükümlülüklerin tamamlandığını gösteren belge listesi, lisans kararı |
| Bağlantı ve sistem kullanım anlaşmaları | TEİAŞ | Lisans sonrası imzalanır | Anlaşmalar |
| EPC'ye devir | İnşaat (EPC) ekibi | Proje, Enerji › Proje Geliştirme'den İnşaat ekibine geçer | Devir tutanağı |

**Önlisans dönemi boyunca sürekli belgeler:** EPDK'ya dönemsel ilerleme raporları, süre uzatımı talebi ve kararı, teminat mektubu ve yenilemeleri, yönetim kurulu kararları, iç yazışma ve mailler.

**Kim nerede geçer:**
- Proje Geliştirme Uzmanı (Cem Aktaş) hazırlar ve takip eder; Enerji Grubu Müdürü (Kerem Aydın) onaylar.
- Arazi, kira ve kamulaştırma belgelerinde Hukuk (Ayşe Yılmaz, Burak Çelik) yer alır.
- Teminat mektubunu Proje Finans (Kaan Turhan) bankadan aldırır.
- Başvuru bedeli ödemeleri Finansal Muhasebe'den (Gökhan Erdem) çıkar.
- Resmî başvurularda imza Genel Müdür (Levent Aksoy) ile Mali İşler Müdürü (Elif Şahin) çift imzadır.

### 6.2 Proje bazlı belge seti

Aşağıdaki dosya adları kanvasta **link olarak** geçer. Bu adlarla üretilmeli ve ilgili SPV klasörüne konmalıdır. Tarihler kanvastaki tarihlerdir; belge içinde de aynı tarih geçmeli. Durumu "Başlamadı" olan adımlar için belge üretilmez. Format önerisi gerçekçiliğe göre seçilmiştir: resmî kurum yazıları çoğunlukla taranmış PDF, tutanaklar fotoğraf, ölçüm verisi Excel.

#### Kızılova RES — 42 MW · önlisans 15.01.2025 · 24 ay (bitiş 15.01.2027)

| Adım | Durum | Belge(ler) — tarih | Not |
|---|---|---|---|
| Ölçüm | Tamamlandı | `Kizilova_Ruzgar_Olcum_Raporu_12ay.pdf` — 30.06.2023 | Ölçüm dönemi 01.06.2022–30.06.2023; ayrıca Excel veri eki |
| Önlisans başvurusu | Tamamlandı | `Kizilova_Onlisans_Basvurusu.pdf` — 04–18.10.2023 | Ekim RES penceresi |
| Teknik değerlendirme | Tamamlandı | `YEGM_Teknik_Uygunluk_Kizilova.pdf` — 20.02.2024 | |
| Bağlantı görüşü | Tamamlandı | `TEIAS_Baglanti_Gorusu_Kizilova.pdf` — 12.06.2024 | |
| Önlisans | Tamamlandı | `EPDK_Sunum_Yazisi_Kizilova.pdf` — 20.06.2024; `EPDK_Onlisans_Karari_Kizilova.pdf` — 15.01.2025 | Önlisans no ÖL/13085-3 |
| Edinim | Tamamlandı | `Kizilova_Satis_Vaadi.pdf` — 20.01.2025; `Kizilova_Arazi_Tapu_Devri.pdf` — 15.02.2025 | ENH güzergâhındaki 3 parselin kira sözleşmesi imzalı, tapuya şerh bekliyor (Avukat notu 12.09.2026) |
| Arazi izinleri | Devam ediyor | `Kizilova_Orman_On_Izin_Basvurusu.pdf` — 03.02.2026; `OGM_On_Izin_Karari_Kizilova.pdf` — 30.06.2026; `Kizilova_Mera_Tahsis_Degisikligi_Talebi.pdf` — 21.08.2026 | Mera komisyonu Kasım öncesi toplanmıyor |
| Askeri yazı | Tamamlandı | `MSB_Askeri_Yasak_Bolge_Yazisi_Kizilova.pdf` — 30.08.2025 | |
| TEA | Tamamlandı (olumlu) | `TEA_Olumlu_Gorus_Kizilova.pdf` — 25.10.2025 | TEA-2025-301 |
| ÇED | Devam ediyor | `CED_Basvurusu_Kizilova.pdf` — 10.04.2025; `CED_Ek_Bilgi_Talebi_Kizilova.pdf` — 18.07.2026; `CED_Kurum_Gorus_Yazisi_Kizilova.pdf` — 12.09.2026 | ÇED-2026-057; İDK toplantısı bekleniyor |
| Jeoteknik etüt | Tamamlandı | `Kizilova_Jeoteknik_Etut_Raporu.pdf` — 20.05.2025 | |
| Kurum görüşleri | Tamamlandı | `Kizilova_Kurum_Gorusleri_Dosyasi.pdf` — 10.12.2025 | |
| Bağlantı çağrısı | Tamamlandı | `TEIAS_Baglanti_Cagri_Mektubu_Kizilova.pdf` — 14.07.2025 | BA-2025-042 |

**Test değeri:** Önlisans 15.01.2027'de bitiyor. ÇED sonuçlanmadı; imar, proje onayı, yapı ruhsatı ve sermaye artırımı başlamadı. Bu, süre uzatımı ihtiyacını gösteren gerçekçi bir risk senaryosu ve özellikle korunmalı.

#### Akyar GES — 60 MW · önlisans 03.03.2026 · 24 ay (bitiş 03.03.2028)

| Adım | Durum | Belge(ler) — tarih | Not |
|---|---|---|---|
| Ölçüm | Tamamlandı | `Akyar_Gunes_Olcum_Raporu.pdf` — 31.08.2024 | Ölçüm dönemi 01.08.2023–31.08.2024 |
| Önlisans başvurusu | Tamamlandı | `Akyar_Onlisans_Basvurusu.pdf` — 28.10–12.11.2024 | Ekim GES penceresi |
| Teknik değerlendirme | Tamamlandı | `YEGM_Teknik_Uygunluk_Akyar.pdf` — 14.03.2025 | |
| Bağlantı görüşü | Tamamlandı | `TEIAS_Baglanti_Gorusu_Akyar.pdf` — 02.07.2025 | |
| Önlisans | Tamamlandı | `EPDK_Onlisans_Karari_Akyar.pdf` — 03.03.2026 | ÖL/14120-7 |
| Edinim | Bekliyor | `Akyar_Arazi_Degerleme_Raporu.pdf` — 10.04.2026; `Akyar_Arazi_Sahibi_Gorusme_Tutanagi.pdf` — 05.09.2026 | Malik ikinci görüşmede bedeli iki katına çıkardı; kamulaştırma değerlendiriliyor. Bu bilgi tutanağın içinde yazmalı |
| Askeri yazı | Devam ediyor | `MSB_Basvuru_Yazisi_Akyar.pdf` — 12.05.2026 | |
| TEA | Gerekmez | — | GES |
| ÇED | Devam ediyor | `CED_Basvuru_Dosyasi_Akyar.pdf` — 20.05.2026; `CED_Halkin_Katilimi_Toplantisi_Akyar.pdf` — 28.08.2026 | ÇED-2026-112; toplantı itirazsız geçti |

#### Demirci RES — 80 MW · önlisans 10.10.2024 · 36 ay (uzatıldı; bitiş 10.10.2027)

| Adım | Durum | Belge(ler) — tarih | Not |
|---|---|---|---|
| Ölçüm | Tamamlandı | `Demirci_Ruzgar_Olcum_Raporu_12ay.pdf` — 31.08.2022 | Ölçüm dönemi 01.08.2021–31.08.2022 |
| Önlisans başvurusu | Tamamlandı | `Demirci_Onlisans_Basvurusu.pdf` — 05–19.10.2022 | |
| Teknik değerlendirme | Tamamlandı | `YEGM_Teknik_Uygunluk_Demirci.pdf` — 18.04.2023 | |
| Bağlantı görüşü | Tamamlandı | `TEIAS_Baglanti_Gorusu_Demirci.pdf` — 07.09.2023 | |
| Önlisans | Tamamlandı | `EPDK_Onlisans_Karari_Demirci.pdf` — 10.10.2024 (24 ay); `EPDK_Sure_Uzatim_Karari_Demirci.pdf` — 15.06.2026 (36 ay) | ÖL/12877-2. Uzatma talep dilekçesi de ayrı belge olarak üretilmeli |
| Edinim | Tamamlandı | `Demirci_Arazi_Kira_Sozlesmesi.pdf` — 20.01.2025 | |
| Arazi izinleri | Tamamlandı | `Demirci_Orman_Izni_Basvurusu.pdf` — 01.03.2025; `OGM_Kesin_Izin_Demirci.pdf` — 16.09.2025 | |
| Askeri yazı | Tamamlandı | `MSB_Askeri_Yasak_Bolge_Yazisi_Demirci.pdf` — 09.11.2025 | |
| TEA | **Olumsuz** | `TEA_Basvurusu_Demirci.pdf` — 20.03.2025; `TEA_Olumsuz_Gorus_Demirci.pdf` — 08.09.2026 | TEA-2026-119. Gerekçe: T-04 ve T-07 türbinleri meteoroloji radarının etki alanında; yerleşim revizyonu isteniyor |
| ÇED | Tamamlandı (olumlu) | `CED_Olumlu_Karari_Demirci.pdf` — 02.06.2025 | ÇED-2025-031 |
| Jeoteknik etüt | Tamamlandı | `Demirci_Jeoteknik_Etut_Raporu.pdf` — 15.04.2025 | |
| Kurum görüşleri | Tamamlandı | `Demirci_Kurum_Gorusleri_Dosyasi.pdf` — 01.09.2025 | |
| Bağlantı çağrısı | Tamamlandı | `TEIAS_Baglanti_Cagri_Mektubu_Demirci.pdf` — 18.08.2025 | BA-2025-077 |

**Test değeri:** Olumsuz TEA, olumlu ÇED kararını ve imar koordinatlarını etkiliyor. ÇED tadili gerekip gerekmediği Hukuk'a soruldu (Enerji Grubu Müdürü notu, 10.09.2026). Revize mikro-yerleşim rüzgâr danışmanından 10.10.2026'da bekleniyor. Bu zincir, Balbal'ın çelişkili ve bağlantılı belgeleri bir arada gösterme testi için en değerli set.

### 6.3 Geliştiricinin bize sorması gereken tutarsızlıklar

Bunlar kanvasta görülen tutarsızlıklar. Belge üretmeden önce ürün sahibine sorulmalı; tahminle düzeltilmemeli.

1. **Otomatik "Basvuru_" dosya adları:** Kanvas, kendi belge listesi tanımlı olmayan adımlarda başvuru belgesini `Basvuru_` + sonuç belgesinin adı şeklinde üretiyor (ör. `Basvuru_YEGM_Teknik_Uygunluk_Kizilova.pdf`). Bu adlar gerçekçi değil. Öneri: Bu adımlara gerçek başvuru belgesi adı tanımlanır ve kanvas buna göre düzeltilir. Karar gelene kadar bu adlarla belge üretilmez.
2. **ÇED yolu ve kapasite:** Kızılova RES (42 MW) ve Akyar GES (60 MW) için kanvasta İDK toplantısı, halkın katılımı ve "PTD inceleme komisyonu" gibi ÇED raporu süreci terimleri birlikte geçiyor. Güncel ÇED Yönetmeliği eşiklerine göre her projenin hangi yoldan (seçme-eleme ya da ÇED raporu) ilerlediği belirlenmeli. Belge zinciri o yola uygun kurulmalı. Kanvas gerekirse düzeltilir.
3. **Kızılova'da şantiye kaydı:** İdari ve satın alma tarafında "Kızılova RES (şantiye)" ve "hafriyat metrajı" geçiyor. Oysa proje önlisans aşamasında; imar ve yapı ruhsatı yok. İnşaat öncesi saha işi mi (ör. ölçüm ya da etüt), yoksa hata mı?
4. **Kapasite birimleri:** Kanvas yalnızca "MW" yazıyor. Belgelerde MWm ve MWe ayrımı tutarlı olmalı. ÇED eşikleri MWm, lisans kapasitesi MWe üzerinden değerlendirilir.

### 6.4 Bu setle Balbal'a sorulacak örnek sorular

Örnekler test içindir; prompt veya şart değildir.

| Soru | Beklenen davranış |
|---|---|
| Kızılova'nın önlisansı ne zaman bitiyor? | 15.01.2027, kaynak `EPDK_Onlisans_Karari_Kizilova.pdf`. Bitiş tarihi belgede yazılı olmalı; Ürün 1 kendisi hesaplamaz |
| Demirci'nin önlisans süresi uzatıldı mı? | Evet, 36 aya (15.06.2026 kararı); iki belge birlikte gösterilir |
| Demirci TEA neden olumsuz? | T-04 ve T-07 meteoroloji radarı etki alanında; kaynak olumsuz görüş yazısı |
| Akyar'da arazi meselesi ne durumda? | Değerleme raporu ve görüşme tutanağı; malikin bedeli iki katına çıkardığı tutanaktan aktarılır |
| Kızılova ÇED'de son durum ne? | 12.09.2026 kurum görüş yazısı; süreç devam ediyor |
| Hangi projelerde orman izni var? | Birden çok projeyi yan yana getirmek Birleştirme'dir (Ürün 2). Ürün 1 bulduğu belgeleri proje proje listeler |
| Kızılova lisans başvurusuna yetişir mi? | Yorum ve tahmin Ürün 3'tür. Ürün 1 eksik adımları belgelerle gösterir ve "değerlendirme yapamam" der |
