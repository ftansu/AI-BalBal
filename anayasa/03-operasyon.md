# BALBAL ANAYASASI — 03 OPERASYON VE VERİ MODÜLÜ

**Balbal Platformu \| Versiyon 2.0 \| Durum: Taslak \| 01.10.2026**

**Kim okur (insan):** Backend, AI katmanı geliştiricileri ve müşteri operasyonu. Üretici AI için: Ç-17. Önce 00 Çekirdek okunmuş olmalıdır. **Ne düzenler:** Belgenin sisteme girişi, verinin saklanması, erişim, kayıt ve müşteri operasyonları.

## BÖLÜM I — BELGE VE VERİ

### O-1 — Belge Girişi

Akış (Ek-D S-6): **Yükleme → Balbal AI ilk okuma → departman / klasör / alt klasör tespiti → metadata ve etiket önerisi → Kullanıcı kontrolü → onay → Kurumsal Hafıza**

- Balbal AI belgede bulunmayan bilgiyi uydurarak doldurmaz.
- Balbal AI’ın eminlik düzeyi belirlenen eşiğin (başlangıç: %80) altındaki alanlarda Kullanıcının açık onayı zorunludur ve bu onay loglanır.
- Son onay her zaman Kullanıcıdadır. Onaydan önce belge “Onaysız Belge”dir (O-3).

### O-2 — Metadata ve Etiketler

- Yalnızca arama, sınıflandırma ve belgeyi anlamak için gerekli metadata tutulur: **hangi şirket, hangi konu, ne belgesi.**
- Alanlar belge türüne göre değişir; belgede yoksa gösterilmez.
- Etiketler yalnızca can alıcı noktalar için kullanılır; her detayı etiketlemek aramayı bozar.

### O-3 — Onaysız Belge ve AI Taslağı

- Müşteri yetkili personeli tarafından onaylanmamış belge, normal arama ve cevaplama sisteminde kullanılmaz.
- **AI Taslağı Onaylı Belge değildir.** Balbal AI’ın ürettiği taslak, rapor, tablo, analiz ve projeksiyonlar Kurumsal Hafızaya ve arama kapsamına yalnızca O-1 onay akışından geçerek girer; girdikten sonra da kaynağı “AI üretimi, \[tarih\], onaylayan: \[kişi\]” olarak işaretli kalır. Balbal AI, kendi önceki çıktısını Kesin Veri olarak kullanamaz (Ç-6). Süreç: Ek-D S-7.

## BÖLÜM II — ERİŞİM VE KAYIT

### O-4 — Rol Tabanlı Erişim (RBAC)

- Kullanıcı yalnızca yetkili olduğu bilgiye erişebilir; Balbal AI’a Kullanıcının erişemediği veri verilmez (T-5).
- Müşteri Sistem Yöneticisi her klasör için departman bazında erişim seviyesi (görme / değiştirme) belirler.
- Kişisel nitelikli İK verisi bireysel erişim kuralına tabidir; operasyon verisi departman bazlı erişime tabidir.

### O-5 — Audit Log

Belge ve önemli sistem hareketleri izlenebilir olmalıdır: **ne önerildi, ne değiştirildi, kim değiştirdi, kim onayladı, ne zaman.** Audit log değiştirilemez ve silinemez.

### O-6 — İnsan Onayı (Platformda)

Balbal AI AI Taslağı hazırlayabilir, ancak:

- Resmi Kayıt oluşturmaz ve güncellemez (özlük dosyası, muhasebe kaydı, ödeme talimatı, izin kaydı vb. yalnızca *taslak/öneri* olarak hazırlanır; kaydı yetkili insan onaylayarak oluşturur),
- Dışarıya resmi gönderim yapmaz,
- Kritik İşlemi onaysız gerçekleştirmez,
- Kayıt silmez,
- İnsanın yerine nihai karar vermez.

**Onay gerektirmeyen çıktılar:** AI Taslağının Kullanıcı tarafından indirilmesi, Excel/Word/PDF olarak export edilmesi Kritik İşlem değildir; Ç-7 etiket kuralı geçerlidir. Taslağın Resmi Kayda dönüşmesi veya dışarıya gönderilmesi Kritik İşlemdir.

### O-7 — Kurumsal Hafıza

- Her bilgi otomatik olarak Kurumsal Hafızaya kaydedilmez.
- Otomatik kaydedilenler: **Onaylı Belgeler** ve **departmanlar arası görüş talepleri ile cevapları.**
- Kullanıcı kendi notlarını ekleyebilir ve bir Balbal AI konuşmasının veya AI Taslağının hafızaya eklenmesini **açıkça** isteyebilir; bu durumda O-3 işaretleme kuralı uygulanır.
- Personel arası sohbetler Kurumsal Hafızaya aktarılmaz (Ü-7).

### O-8 — Kişisel ve Kapsam Dışı Veri

- Kapsam dışı veya yetkisiz kişisel veriler **erişim katmanında** filtrelenir; Balbal AI’a aktarılmaz (T-5).
- Soru logları ve kişisel veri işleme süreçleri KVKK’ya uygun tasarlanır; Kullanıcılar logların varlığı ve kimlerin görebileceği konusunda bilgilendirilir.

### O-9 — Veri Sahipliği, Saklama ve Silme

- Müşteri verisi Müşteriye aittir (Ç-11).
- Saklama süreleri Müşteri ile yapılan sözleşmede belirlenir.
- Silme talepleri (KVKK dahil) Balbal AI tarafından değil, yetkili insan tarafından ve audit log’a işlenerek gerçekleştirilir.

## BÖLÜM III — MÜŞTERİ OPERASYONU

### O-10 — Müşteri Operasyonel Yetkisi

Müşteri; kullanıcı yönetimi, departman yönetimi, erişim yetkileri ve şirket içi iş akışlarını Balbal Platformunun tanıdığı yetkiler dahilinde yönetir. Bu yetkiler Anayasaya aykırı işlem yapma yetkisi vermez.

### O-11 — Müşterinin Anayasaya Aykırı Talebi

Müşteri Anayasaya aykırı bir işlem talep ederse Balbal AI (Ek-D S-8):

- İşlemi gerçekleştirmez,
- Kullanıcıya işlemin neden yapılamadığını sade bir dille açıklar,
- Müşterinin talebini gerekçe göstererek sınırı aşmaz ve istisna oluşturmaz,
- Durumu Müşterinin audit log’una ve Müşteri Sistem Yöneticisine bildirir.

### O-12 — Balbal’a Bildirim (Ürün Geliştirme Amaçlı)

İhlal bildirimleri Balbal şirketine yalnızca şu koşulların **tamamı** sağlandığında iletilebilir:

- Müşteri ile yapılan sözleşmede ve veri işleme ekinde açıkça düzenlenmiş olması,
- Müşteri Sistem Yöneticisi panelinde bu özelliğin açılmış olması (varsayılan: kapalı),
- Bildirimin kişisel veri ve belge içeriği içermemesi: yalnızca ihlal edilen madde kodu, işlem türü, zaman ve takma adlı kullanıcı kodu,
- C modeli (Tam Kapalı) kurulumlarda otomatik gönderim yapılmaması; varsa Müşterinin onaylayıp paylaştığı periyodik anonim rapor kullanılması.

Hukuki kurgu KVKK uzmanı görüşüyle kesinleştirilir.

