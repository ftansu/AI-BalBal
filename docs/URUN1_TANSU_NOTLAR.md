# Ürün 1 — Tansu Notları

**Tarih:** 06.10.2026 · **Kaynak:** ürün sahibinin web testi (Ürün 1 arayüzü, Balbal soru-cevap ve belge yükleme ekranları)
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

**Proje adları için açık konu:** Demo belgelerde "Ankara RES / İzmir RES" (etiketlerde `ANK_RES`, `IZM_RES`) geçiyor. Personel ve ekranlar ise Karatepe, Boztepe, Yeşilova RES ve Güneşalan GES'e bağlı. Yeni gerçekçi belge seti üretilmeden önce tek ad setine karar verilecek; karar ürün sahibinindir.

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
