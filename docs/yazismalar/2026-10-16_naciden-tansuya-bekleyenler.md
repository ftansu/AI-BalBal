# Naci'den Tansu'ya: bekleyenler ve sıradaki işler (16.10.2026)

**Kimden:** Naci (İş Emri 2026-10-16Y7). Metni Claude, Naci'nin talimatıyla hazırladı.
**Kime:** Tansu
**Tür:** Liste

Kararlar #55, #58 ve #59'a dağılmıştı; bu sayfa Tansu'dan beklediğimiz her şeyi tek yerde topluyor. Acele yok; Tansu'nun yarın bakması yeterli.

---

## A. Tansu'dan beklediğimiz kararlar (öncelik sırasıyla)

- [ ] **1. LEG-004 yeni belge tarihi (PR #59, S3).** Biz 10.08.2026 seçtik (ledger tarih vermiyor, AI_ASSUMPTION). İtiraz var mı, başka tarih ister misin?
  **Bu cevap canlı işlemin ön koşulu:** itiraz yoksa K1+LEG-004 canlıya alınacak (yedekli, smoke 9/9, kapı koşularından önce).
- [ ] **2. Q-1 kategori eşiği (PR #59).** Soru sayısı 100, ambiguous 9 soru, %80 eşik; 7/9 tutmaz. Kapı tanımı kategori bayrağını içeriyor mu? İçeriyorsa:
  - (a) GEN-DSC-003-F kapı ölçümünden ayrı tutulsun mu?
  - (b) Ambiguous eşiği 9 soruya göre yeniden mi belirlensin?

  Etiketten önce karar gerekli.
- [ ] **3. Q-2 (PR #59).** "Bulamadım" cümlesinden sonra gelen yardım sorusu ve belge listesi cevabı bozmuyor (şu anki uygulama). Böyle kalsın mı?
- [ ] **4. Madde 1 planı onayı (PR #58).** Plan: company-ai `1810cba`, `docs/reports/IS_EMRI_2026-10-16P1_PLAN.md`. Üçü için onay/itiraz:
  - S-1: Konu belirlenemezse bugünkü tam liste.
  - S-2: Konu hiçbir projede yoksa proje sorulmasın.
  - S-3: Tek aday kalırsa doğrudan cevap bu pakette yok.
- [ ] **5. 6 soruluk LLM'li doğrulama koşusu: hangi 6 soru?** Biz K1'den etkilenen 6 soruyu varsayıyoruz: GEN-CMP-001, GEN-CMP-002, IZM-DEV-001, IZM-DEV-007, IZM-DEV-011, ANK-ISO-002. Doğru mu, değiştirmek ister misin?
- [ ] **6. PR #58 ve #59'un birleştirilmesi** (Tansu birleştirir).

## B. Bizim yapacaklarımız (Tansu'dan bağımsız, sırayla)

- [ ] B-01 (Excel içeriğine ulaşılamıyor) + Excel proje ayrımı için tek sayfalık plan (kod yok); Tansu onayı sonrası kod.
- [ ] Madde 3 (❗ çelişkili veri) planı (prompt değişirse Ç-15/8, önce plan).
- [ ] Hukuk görünürlüğü (Madde 4, KP-3) planı (kod kapıdan sonra, Ç-15/3).
- [ ] Takma ad alanı (Madde 5), kural merdiveni bayrak eşleme listesi, embedding planı: kapıdan sonra.

## C. Tansu cevabından sonra yapılacaklar (sıra, S6)

- [ ] 1. K1+LEG-004 canlı işlem (yedek, smoke 9/9, geri dönüş hazır; açık onay cümlesiyle).
- [ ] 2. 6 soruluk LLM'li doğrulama koşusu (bir kez; kapı koşusu değil).
- [ ] 3. Q-1 kararı → etiket `cetvel-v2.2-v14.1` + README.
- [ ] 4. Kapı öncesi işler: Madde 1 kodu, Madde 3, Excel proje ayrımı, B-01.
- [ ] 5. Kapı koşuları (3 koşu; saklı set kontrolörde).

## D. Canlıda şu an olanlar

- N1 canlıda (Tansu "kalsın" dedi). Etikete kadar canlıya yalnız C-1 ve C-2'deki işler girer.
- K1+LEG-004 canlı işlemi henüz **çalıştırılmadı**.

## E. Son ölçüm sonuçları (LLM'siz yeniden puanlama, v2.2 + v14.1, 99 ölçülen soru)

- M1 70/99, N1 68/99; resmî M1 71/99 değişmedi.
- GEN-DSC-003-F henüz ölçülmedi.

## F. İlgili PR'lar ve commit'ler

- **AI-BalBal:** #55 (birleşti), #56 (birleşti), #57 (Tansu'nun notu, birleşti), #58 (Madde 1 planı), #59 (V22/K2 cevapları).
- **company-ai** (dal `feat/adim5-veri-kutuphanesi`): `c0c0984` (V141), `1810cba` (P1 plan), `c83f40a` (V22), `3026264` (K2).
