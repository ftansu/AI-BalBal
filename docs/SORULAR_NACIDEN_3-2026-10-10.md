# Naci'den Tansu'ya — Kalan Eksik Değerler + PR Ricası, 3. tur — 10.10.2026

> **Cevaplandı — Tansu, 11.10.2026.** Değerler birbiriyle tutarlı seçildi; Claude ürün sahibi adına hazırladı, Tansu onayıyla işlendi. Karatepe EPC tutarı (T-11.3) ve Boztepe KGF düzeltmesi ayrıca isteniyor.

**Kimden:** Naci (ve geliştirme tarafı) · **Kime:** Tansu (ürün sahibi) · **Konu:** PF-1 (Proje Finans) partisinin kodla üretilen belgeleri tamamlandı (Karatepe + Kızılova + Yeşilova). Kaynak: `docs/plans/ADIM5_ASAMA_B_PLAN.md` §4.1 (T-10 listesi) + `docs/reports/ADIM5_ASAMA_C_REPORT.md`'nin "Verilmeyen/pending" notları.

Bunlar demo kütüphanesi için eksik değerler. Gerçek bir şirkete ait olmak zorunda değil, tutarlı olması yeterli. Bildiğin gerçekçi bir değer yaz; boş bırakırsan varsayımla ilerleriz ve raporda açıkça işaretleriz. Değerler birbiriyle tutarlı olsun (örn. kredi toplamı <= capex − özkaynak). **Bu değerler gelene kadar Yeşilova ve Kızılova'nın Facility Agreement ile Annex F belgeleri üretilmeyecek** (bunlar LLM prose, PF-1'in bu turda kapsam dışı bırakılan kısmı).

---

## T-11. Eksik değerler

| Kod | Proje | Eksik değer | Şu anki varsayım | Cevap |
|---|---|---|---|---|
| T-11.1 | Karatepe | Lisans alırken ilk onaylanan kapasite (MW) | **AI_ASSUMPTION**: 22 MW (yalnız mevcut DOC-ANK-DEV-002 kapasite-tadili belgesinin anlatısını korumak için seçildi, Tansu'dan gelmedi; güncel 24 MW USER_FACT) | **21 MW.** 8 türbin × 3,0 MW = 24 MW; tadil 7 türbinden 8 türbine çıkış olarak kurgulansın (DOC-ANK-DEV-002 anlatısı buna göre güncellensin). 22 MW türbin aritmetiğiyle tutmuyor. |
| T-11.2 | Karatepe | Kredi sözleşmesi imza tarihi / financial close tarihi | **AI_ASSUMPTION**: imza 20.11.2021, financial close 25.11.2021 | **İmza 20.06.2022, financial close 08.07.2022.** 2021 varsayımı kredinin kodu (2022-KT, kod yılı = imza yılı) ve T-11.15 notuyla çelişiyor; ilk kullanım 15.07.2022 ile de uyumlu. |
| T-11.3 | Karatepe | Capex (toplam yatırım, **USD**) | **AI_ASSUMPTION**: 20.000.000 USD — total_debt+equity'den %70/30 varsayımıyla türetildi | **20.000.000 USD** (onay). **Şart:** ledger'daki Karatepe EPC tutarı 41.500.000 EUR, toplam yatırımdan büyük; eski Ankara RES verisinden kalmış. EPC **14.500.000 EUR**'ya (~17 mn USD) çekilsin; kalan ~3 mn USD geliştirme, şebeke, finansman maliyeti. |
| T-11.4 | Karatepe | Özkaynak/equity (**USD**) | **AI_ASSUMPTION**: 6.400.000 USD — aynı %70/30 varsayımı | **6.400.000 USD** (onay). Fiilen kullandırılan 13,6 mn kredi + 6,4 mn özkaynak = 20 mn. |
| T-11.5 | Kızılova | İmzalı-kullanılmamış kredinin (2026-KZ) tam imza tarihi | **Tamamen pending** — ledger'da hiç tarih alanı yok, yalnızca "2026-KZ" kodundan 2026 yılı biliniyor | **05.10.2026** (Pazartesi). 61.333 USD taahhüt komisyonu 05.10.2026 → 05.01.2027 = 92 gün üzerinden birebir çıkıyor (ilk tam dönem). |
| T-11.6 | Boztepe | Toplam kredi tutarı (anapara) | **Pending** — yalnız aylık faiz tutarı (84.300 USD) ve iki tarih var | **15.000.000 USD.** |
| T-11.7 | Boztepe | Faiz oranı (taban endeks + marj) | **Pending** — yalnız aylık TUTAR verildi, oran verilmedi | **Faiz swap ile sabitlenmiş: %3,894 + %2,85 marj = %6,744 sabit.** 15.000.000 × %6,744 / 12 = tam 84.300 USD; sabit aylık faiz tutarını bu yapı açıklıyor. |
| T-11.8 | Boztepe | Tenor (vade, yıl) | **Pending** | **10 yıl** (imza Mayıs 2024); ilk 3 yıl yalnız faiz, anapara Mayıs 2027'den itibaren aylık eşit taksit. 02.11.2026 ödemesinin yalnız faiz olması buna dayanır. |
| T-11.9 | Boztepe | DSCR covenant eşiği | **Pending** | **1,20x** (Karatepe ile aynı banka, aynı politika). |
| T-11.10 | Boztepe | DSRA bakiyesi | **Pending** | **505.800 USD** (6 aylık borç servisi = 6 × 84.300). |
| T-11.11 | Yeşilova | Capex (toplam yatırım, USD) | **Pending** | **26.400.000 USD** (~1,2 mn USD/MW). Kurgu: santral özkaynakla inşa edildi; 2023-YS (2.352.000 USD) sonradan alınmış kısmi kredi, ana inşaat kredisi değil. Canvas ve taksitler değişmez. |
| T-11.12 | Yeşilova | Özkaynak/equity (USD) | **Pending** | **24.048.000 USD** (26.400.000 − 2.352.000). |

**Not — Kızılova EPC:** T-10'un orijinal sorusu Kızılova'nın kredisi VE EPC sözleşmesinin tam tutar/taraf/tarihini soruyordu; EPC tarafı (ABC İnşaat A.Ş., 10.000.000 USD KDV hariç, imza 15.09.2026) Aşama C4'te zaten cevaplandı — yalnızca T-11.5 (kredi imza tarihi) hâlâ eksik, EPC için tekrar sormuyoruz.

**Not — Kızılova Hakediş 1:** Bu listede yok — Hakediş 1 (SÖ-26-014) tutarları Enerji/EPC partisinin konusu (onaylı karar), Proje Finans'ın kapsamı dışında.

### Düşük öncelik

| Kod | Proje | Eksik değer | Şu anki varsayım | Cevap |
|---|---|---|---|---|
| T-11.13 | Yeşilova | Türbin adedi | Model verildi (Vestas V136), adet verilmedi | **5 adet** (Vestas V136, 4,4 MW modda; 5 × 4,4 = 22 MW). |
| T-11.14 | Yeşilova | DSCR covenant'ının tarihsel test sonucu (geçti/kaldı, hangi dönem) | Yalnız eşik (1,15x) verildi, test sonucu verilmedi | **Yıllık test (31.12): 2024 → 3,9x geçti; 2025 → 3,6x geçti.** Kredi küçük olduğu için oran yüksek; 2025 sonucu Annex F (raporlama yılı 2025) ile uyumlu olsun. |
| T-11.15 | Karatepe | Grace süresi (ay) | **AI_ASSUMPTION**: 10 ay — imza (20.06.2022) ile ilk taksit (07.04.2023) arasındaki boşluktan türetildi | **10 ay** (onay). Not: ilk taksit (07.04.2023) COD'den (15.10.2023) önce düşüyor, gerçekçi değil; ama düzeltmek canvas'taki 8/24'ü bozar, demo için bilinçli olarak bırakıyoruz. |

---

## PR ricası

**PR #15** (Anayasa v2.1 taslak) ve **PR #16** (Ek-F Karakter Tanımı) hâlâ açık (OPEN). İkisi de bizim tarafta onaylanmış/kullanılmaya başlanmış durumda — mümkünse merge edebilir misiniz?

**Cevap (Tansu, 11.10.2026):** **Evet, birleştiriyoruz.** Birleştirmeden önce v2.1 sürüm tablosundaki "[onay bekliyor]" ifadesi "onaylandı (Tansu 09.10.2026, Naci 10.10.2026)" olarak güncellenecek; Naci'nin onayı bu cevapla yazılı kayda geçer. Birleştirme sonrası güncel Anayasa company-ai'ye de eklenmeli. Üretici adları kararı (ADT-3) ayrı değişiklik talebiyle sonra gelir.

## İK (İnsan Kaynakları) sorusu

ADIM5_PF_PARTISI_PLAN'ın parti sırası PF → Hukuk → Enerji → Mali İşler → İdari İşler → **İK**; İK'nın demo kütüphanesine girişi Adım 6'da ayrıca ele alınacak şekilde not edildi. Bu doğru mu, yoksa İK'nın bir kısmı Adım 5 kapsamına şimdiden girsin mi?

**Cevap (Tansu, 11.10.2026):** Sıra aynı kalsın (İK sonda), ama **İK resmi test turu 1'den önce mutlaka kütüphanede olmalı**; hangi adım numarasıyla olduğu önemli değil. Gerekçe: resmi tur 1 sonucu tüm departmanlar gelince yazılacak (T-8) ve kısıtlı (restricted) belgeler (bordro, dava) İK'da; yetki sızıntısı testi İK olmadan yapılamaz. Asgari set: 36 kişilik personel listesi, bordro özeti (restricted), izin belgeleri, birkaç iş sözleşmesi örneği.

---

## ÖNEMLİ NOT — Süre ve verim (Tansu → Naci)

Bu bir değerlendirme değil, verimi artırmak için bir soru. İlk iskelet çok kısa sürede çıkmıştı; şimdi her iş daha uzun sürüyor. Bir kısmı normal (yetki, onay akışı, test seti ve belge kütüphanesi koddan çok doğrulama işi), ama nedenini ve bizim payımızı netleştirmek istiyoruz.

**Soru:** Son iki haftada zamanın kabaca yüzde kaçı şuna gitti?
1. Kodlama (yeni özellik)
2. Bizden cevap veya onay beklemek
3. Düzeltme ve geri dönüş (tutarsız ledger/canvas verisi, eski veriden kalan değerler, yeniden üretilen belgeler)
4. Test, ölçüm ve değerlendirme
5. Belge üretimi ve tutarlılık kontrolü
6. Diğer

**Bizden beklentilerin neler?** Verimi artırmak için şunları yaz:
- Hangi kararlar veya cevaplar bizde bekliyor ve seni en çok yavaşlatan hangisi?
- Dönüş sıklığı nasıl olsun: anında, günlük ya da haftalık toplu?
- Hangi bilgiyi baştan verirsek tekrar soru sormana gerek kalmaz?
- Hangi PR/onay kuralı (Anayasa dahil) işi gereğinden fazla yavaşlatıyor?
- Verimini düşüren başka bir engel veya eksik var mı (araç, erişim, token, ortam, veri)?

Cevabını bu PR'a yaz. Bir sonraki turda beklentilerini önceliklendirip işleyeceğiz.

---

## Tansu'dan Naci'ye: yapılacaklar

1. T-11 değerlerini ledger'a işle; kredi toplamı <= capex − özkaynak tutarlılığını kontrol et.
2. **Karatepe EPC'yi** 41.500.000 EUR'dan 14.500.000 EUR'ya çek; bağlı belge ve ödemeleri güncelle (T-11.3).
3. **Karatepe** kapasite-tadili belgesi (DOC-ANK-DEV-002) anlatısını 21 MW → 24 MW (7 → 8 türbin) olarak güncelle (T-11.1).
4. **Karatepe** kredi tarihlerini 2022'ye taşı (imza 20.06.2022, financial close 08.07.2022) ve ilgili tüm belgelerde tutarlı yap (T-11.2).
5. **Boztepe KGF kefaletini** demo verisinden tamamen çıkar (USD krediyle uyumsuz); ona bağlı belge ve ekran varsa listele.
6. **Yeşilova ve Kızılova** Facility Agreement + Annex F belgelerini üret. Yeşilova Annex F raporlama yılı 2025 olsun (DSCR 3,6x).
7. **İK asgari setini** (36 kişilik liste, bordro özeti, izin belgeleri, birkaç iş sözleşmesi) resmi Tur 1'den önce kütüphaneye al.
8. PR #15 ve #16 için GitHub'da yazılı **Approve** onayını ver (v2.1 tablosundaki Naci onayı buna dayanır). Birleştirme sonrası güncel Anayasa'yı company-ai'ye ekle.
9. Bu değerlerden Tansu'nun kendi yazmadığı seçimleri (T-11.2 tarihleri, T-11.6–T-11.10 Boztepe yapısı, T-11.14 test sonuçları) raporda "ürün sahibi onaylı" diye işaretle.

## Tansu'dan Naci'ye: sorular

1. Karatepe EPC düşürülünce ledger'da bağlı hakediş, ödeme veya taksit kaydı etkileniyor mu? Etkilenen belge sayısını ve kodlarını yaz.
2. Karatepe kredi tarihleri 2021 → 2022 kayınca canvas veya mevcut belgelerle çelişen yer çıkıyor mu (faiz hesabı, ödeme planı, DSRA)?
3. Boztepe KGF kaldırılınca teminat yapısında veya bir ekranda boşluk kalıyor mu?
4. Yeşilova capex 26,4 mn USD ile 2023-YS kredisi ve canvas taksitleri çelişmeden duruyor mu? Çelişki varsa hangi satır?
5. İK asgari setini Tur 1'den önce almak PF-1 sonrası parti takvimini ne kadar öteliyor? Önerdiğin adım numarası ve süre nedir?
6. Boztepe faiz swap yapısı (%3,894 + %2,85) senin tarafındaki Boztepe belgelerinde (sözleşme, ödeme planı) başka bir oranla çakışıyor mu?

---

Hiçbir rakam bu dosyayla ledger'a yazılmadı. Cevaplar işlenince ledger güncellenecek.
