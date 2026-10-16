# Tansu'dan Naci'ye: 20:44 sorularına cevap (16.10.2026)

**Tarih:** 16.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla (16.10.2026, 21:45) hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Karar + onay (soru–cevap)
**Dayanak:** `docs/yazismalar/whatsapp/2026-10-16_WA_v14-ve-cetvel-dondurma.md` (Naci'nin 16.10 20:44 cevabı); company-ai `docs/reports/IS_EMRI_2026-10-16V14.md` §3, `IS_EMRI_2026-10-16K1_PLAN.md` (SORU 1–4), `IS_EMRI_2026-10-16N1.md` §5–6; PR #53, PR #54; Naci'nin cevapları PR #55 ve PR #56.

---

Naci merhaba, 20:44 cevabın için teşekkürler. Sorularını sırayla cevaplıyorum.

### S1 — GEN-GEN tanım soruları: puanlayıcıya "ikisi de olur" alanı eklensin mi (v2.2)?

**Evet**, V14 raporu §3'te önerdiğin şema alanıyla (seçenek 1). Tek şart var. Geçer sayılacak iki cevap şunlar:
- Kaynağı gösterilmiş tanım.
- Sabit "bulamadım" cümlesi.

**Netleştirici soru ("Hangi proje için…?") bu üç soruda geçmez.**

Bugün N1, tanım sorularını da adsız değer sorusu sayıyor (N1 raporu §5.1: "keşif olmayan her soru"). Ancak "DSCR ne demek?" sorusuna proje sormak doğru davranış değil.

Bunu düzeltmek için **koda yeni kelime kuralı yazma** (PR #54 ilkesi). Raporuna "AI konumlandırma adayı" diye bir satır eklemen yeterli. O sorular kapıda bilinen kayıp olarak kalır; ölçüm dürüst olsun.

GEN-GEN-002 için önerdiğin "Kızılova yasağı"nı (seçenek 4) şimdilik eklemiyoruz. O soruyu kontrolör elle okur.

### S2 — Kızılova belgesindeki totolojik cümle kalsın mı? (K1 SORU 2)

**Kalsın.** Metin token'dan üretiliyor ve olgu doğru. Elle düzeltme yapıp `hand_edited` eklemek, ledger ile belge arasında yeni bir sapma yaratır.

### S3 — LEG-004'teki tarih düzeltilsin mi? (K1 SORU 3)

**Evet, kapıdan önce.** K1'den ayrı küçük bir emir olsun, ama canlıdaki işlem tek seferde ve iki belge birlikte yapılsın.

Hangi tarihin yanlış olduğunu (belge tarihi mi, metindeki önlisans tarihi mi) **ledger'a göre** belirle. Ledger bunu açıkça göstermiyorsa düzeltmeden önce bize sor.

### S4 — K1 canlı yöntemi: A mı, B mi? (K1 SORU 1)

**A uygun**: sil ve yeniden yükle, kod yok. Yalnız silinen eski UUID'ye bağlı bir bağ ya da kayıt kalmadığını rapora tek satırla yaz.

### S5 — Canlı işlem onayı (Ç-15/6)

**Onaylıyorum** (K1 ve LEG-004 birlikte). Şartlar:
- İşlemden önce yedek alınacak.
- Geri dönüş, plandaki gibi hazır olacak.
- İşlem sonrası smoke testi 9/9 geçecek.
- İşlem kapı koşularından önce bitmiş olacak.

### S6 — Sıra, etiket ve LLM'li koşu (K1 SORU 4)

1. v14.1 `c0c0984`'te uygulandı. Şimdi yalnız v2.2 alanı (`answer_policy: either`, S1'deki şartla) ve S11'deki yeni soru uygulanır, ardından modelsiz yeniden puanlama yapılır.
2. K1 ve LEG-004 canlıya alınır.
3. 6 soruluk LLM'li koşu **bir kez** yapılır. Bu yalnız düzeltmenin doğrulamasıdır, kapı koşusu değildir.
4. Etiket **`cetvel-v2.2-v14.1`** olarak konur ve README'ye yazılır. Kontrolör etiketi doğrular.
   - Not: Puanlayıcı v2.2'ye geçtiği için etiket adı değişiyor. PR #54'teki `cetvel-v2.1-v14.1` önerisinin yerine geçer.
5. Kapı öncesi işler yapılır: PR #52 (Excel proje ayrımı), PR #53 madde 1 ve 3, B-01.
6. Kapı koşuları başlar (3 koşu, saklı set kontrolörde).

### S7 — N1 canlıda kalsın mı?

**Kalsın.** Sabah onayı ile dondurma notu çakıştı. Bunu açıkça bildirdiğin için teşekkürler, bir sorun yok. Bundan sonra etiket konana kadar canlıya yalnız S6'nın 1–3. adımlarındaki işler girsin.

### S8 — PR #53 ve #54'e cevapların (PR #56)

PR #56'daki cevapların için teşekkürler; kabullerini gördük (tek aday, saklı set, "Karatepe GES", AI konumlandırması, v14.1).

GEN-DSC-003/004'ün kategorisinin discovery'den ambiguous'a çevrilmesine **itirazımız yok**.

### S9 — B-01 (Excel içeriğine ulaşılamıyor)

**Kapı için en kritik madde bu**, 20:44 cevabında yoktu. Çözüm yolunu Excel proje ayrımı planıyla aynı pakette ya da ayrı yazabilirsin; seçim senin. Ancak kapıdan önce çözülmüş olması şart.

### S10 — Ana dala birleştirme

Kapıyı bekletmiyor. **Kapıdan sonra** konuşalım.

### S11 — GEN-DSC-003 yetki bulgusu (PR #56): (a) mı, (b) mi?

**(b).** Ayrı bir `GEN-DSC-003-F` varyantı eklensin, finans kullanıcısıyla sorulsun. Beklenen cevap: seçenekleri yalnız Karatepe ve Yeşilova olan tek netleştirici soru.

Mevcut GEN-DSC-003 (enerji kullanıcısı) olduğu gibi kalır; yetki sızıntısı testi olarak işe yarıyor. Bulgu için teşekkürler, doğru tespit.

Varyant, etiketten önce v2.2 ile aynı commit'e girer (S6 adım 1). Daraltma (PR #53 madde 1) bitene kadar bu varyantın ❌ çıkması beklenir; bilinen durum.

---

Acele yok, kendi temponda. Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9. Ç-15/6 canlı işlem onayı bu notla Kayıtlı Kanala (GitHub) yazılmıştır (Ç-1 Onay Kanıtı).

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- S1 (v2.2 alanı) — commit:
  - 16.10.2026 (Naci): Commit: ntoydem/company-ai `c83f40a` (dal `feat/adim5-veri-kutuphanesi`). Rapor: `docs/reports/IS_EMRI_2026-10-16V22.md`.
    - `answer_policy: either` uygulandı (R10, ablasyon bayrağıyla; Q9 doğrulama kuralı). GEN-GEN-001/002/003'e verildi. GEN-GEN-002'ye Kızılova yasağı eklenmedi.
    - Netleştirici soru bu üç soruda geçmiyor.
    - LLM'siz yeniden puanlama (99 ölçülen soru):
      - M1: 70/99. Net değişim 0: GEN-GEN-003 ❌→✅, GEN-GEN-002 ✅→❌.
      - N1: 68/99. GEN-GEN-002 ve 003 düştü, çünkü N1 tanım sorusuna proje soruyor.
      - Resmî M1 71/99 değişmedi.
    - V14 raporundaki "M1 71/99 olur" tahminimiz GEN-GEN-002 için yanlıştı: M1'in cevabı "bulamadım" değil, yalnız proje sorusu. Düzelttik.
    - N1'in tanım sorusuna proje sorması rapora "AI konumlandırma adayı" olarak yazıldı. Koda kelime kuralı yazılmadı.
- S3 (LEG-004) — ledger'a göre hangi tarih:
- S4/S5 (canlı işlem) — yedek, smoke, rapor:
- S6 (etiket) — commit:
- S9 (B-01) — çözüm yolu:
- S11 (GEN-DSC-003-F) — commit:
  - 16.10.2026 (Naci): Commit: `c83f40a`.
    - Soru: finans kullanıcısıyla "Sigorta ne zaman bitiyor?". Beklenen: seçenekleri yalnız Karatepe ve Yeşilova olan tek netleştirici soru. Kızılova vb. yasak.
    - Veri eval DB'den (yalnız SELECT) doğrulandı: finans kullanıcısı yalnız Karatepe ve Yeşilova sigorta belgesini görüyor.
    - GEN-DSC-003 (enerji) değişmedi.
    - Henüz ölçülmedi; eski koşularda ham cevabı yok. İlk ölçüm 6 soruluk koşuda olacak. Madde 1 uygulanana kadar ❌ beklenir.
- Diğer:
  - 16.10.2026 (Naci): V22 sonucundan Tansu'ya 2 karar sorusu:
    - Q-1 (kategori eşiği): Soru sayısı 99'dan 100'e çıktı; "ambiguous" kategorisi 8'den 9 soruya çıktı. Kategori eşiği %80.
      - 8 soruda 7 geçen eşiği tutuyordu (%87,5). 9 soruda 7/9 = %77,8 tutmaz; en az 8/9 gerekir.
      - GEN-DSC-003 zaten ❌. 003-F de beklendiği gibi ❌ olursa ambiguous 7/9 olur ve kategori bayrağı düşer.
      - Toplam %75 kapısı etkilenmiyor: 75/100 = %75,0, yani yine aynı sayıda (75) geçen soru gerekiyor.
      - Soru: Kapı tanımı kategori bayrağını da içeriyor mu? İçeriyorsa (a) 003-F kapı ölçümünden ayrı mı tutulsun, yoksa (b) ambiguous eşiği 9 soruya göre yeniden mi belirlensin? Karar Tansu'nun; kodda sayma kuralını değiştirmedik.
    - Q-2 ("bulamadım" sonrası yardım): "Bulamadım" cümlesinden sonra gelen yardım sorusu ve belge listesi şu an (b) cevabını bozmuyor; GEN-GEN-001 iki koşuda böyle geçiyor.
      - Daha katı okuma ("yardım sorusu taşıyan her yanıt düşer") S1 metninde yok; uygulamadık.
      - Soru: Böyle kalsın mı?
