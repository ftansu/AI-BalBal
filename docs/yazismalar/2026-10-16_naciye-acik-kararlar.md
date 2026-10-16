# Tansu'dan Naci'ye: Açık kararlar — kapı öncesi ve sonrası (16.10.2026)

**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla (16.10.2026, 20:21) hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** İş Emri 2026-10-16N1 raporu §6 (öneriler 1–4); ürün sahibinin 16.10 kararları (çelişkili veri, adsız soruda seçenekler, Hukuk görünürlüğü); `docs/yazismalar/whatsapp/2026-10-16_WA_v14-ve-cetvel-dondurma.md`.
**Ek:** Soru seti değişikliği ayrı dosyada — `kontrolor/soru-seti/2026-10-16_v14-1_ek.md`.
**Usul değişikliği:** Bundan sonra notlar mümkün olduğunca doğrudan GitHub'dan (bu klasöre PR) gider. Cevabını bu dosyanın sonundaki "Cevap" bölümüne yaz. WhatsApp'tan yalnızca "PR açıldı" bilgisi gelir.

---

## Sıra (özet)

1. **Dondurmadan önce:** v14 + **v14.1 eki** birlikte uygulanır. Dondurma etiketi v14.1 commit'ine konur.
2. **Dondurmadan sonra, kapıdan önce:** Madde 1 ve 3 (kod). Excel proje ayrımı notundaki sırayla aynı mantık.
3. **Kapıdan sonra:** Madde 4 ve 5.

N1 (adsız değer sorusu → tek soru) uygulandı ve canlıda. Ellerine sağlık. Aşağıdaki 1. madde N1'in üstüne küçük bir düzeltmedir.

---

## A. Kapıdan önce

### 1. Netleştirme seçenekleri yalnız veriye sahip projelerle kurulsun (N1 düzeltmesi)

**Bugün:** Adsız değer sorusunda parantezde kullanıcının yetkili olduğu **tüm** projeler sayılıyor (ör. "Sözleşmenin vadesi ne zaman doluyor?" → 6 proje).
**Karar (16.10):** Seçenekler yalnız **sorulan veriye sahip** projelerle kurulur; o veriye sahip olmayan projeler sayılmaz. Sorulan bilgi hiçbir projede yoksa ve bağlam bulunamıyorsa "veri yok" demek doğru davranıştır. Bu kural Excel notunda Excel yolu için yazılmıştı; belge yolu için de geçerli.

**Tek şart (nasıl yapılacağı senin):** Daraltma, en üst sıradaki parçalara (top-k sıralaması) değil, **belge düzeyine** dayansın. İki yönde de hata olmamalı:
- Veriye sahip **hiçbir** proje seçeneklerden düşmemeli.
- Verisi olmayan **hiçbir** proje seçeneklere girmemeli.

Neden: Demo veride sigorta belgesi birden fazla projede var. Bugünkü getirim GEN-DSC-003'te tek proje gösteriyor. Sıralamaya dayanan bir daraltma, kullanıcıya eksik seçenek sunar.

**Usul:** Kısa plan (yöntem + ölçü), sonra kod. Yetki kuralına dokunmaz; filtre yetki kümesinin **içinden** uygulanır (belge yolundaki ilke).

### 2. Tek aday — şimdilik sorulsun (N1 öneri 1'e cevap)

**Karar:** Bugünkü davranış kalsın: getirimde tek proje çıksa da proje sorulur.
**Gerekçe:** Tek aday bugün sıralamadan çıkıyor; yukarıdaki sigorta örneğinde olduğu gibi gerçekte başka projelerde de veri olabilir. Doğrudan cevap, eksik cevabı tam gibi sunar (T-1 → KY riski).
**Sonra:** Madde 1 belge düzeyinde güvenilir çalıştığında, daraltma sonucunda tek proje kalırsa **doğrudan cevap** verilir, cevabın başında proje adı yazılır ("Karatepe RES için: …"). Bunu madde 1'in planına seçenek olarak ekleyebilirsin; aynı paket olabilir, ölçüleri ayrı raporlansın.
**ANK-NEG-004** beklentisi değişmez (doğrudan Karatepe cevabı). O güne kadar bilinen kayıp olarak kalır.

### 3. Çelişkili veride ❗ uyarısı (kod)

**Karar (16.10):** İki **güncel** kaynak aynı olgu için farklı değer veriyorsa:
- Cevapta **"❗ Çelişkili veri"** uyarısı ünlem işaretiyle görünür.
- İki değer de **kaynağıyla** verilir.
- Balbal birini seçmez, birini "doğru" diye sunmaz.

Sürüm farkı çelişki değildir (10.10 kararı aynen): güncel + "tarihsel" eski. Yalnız iki güncel kaynak farklıysa çelişki.

V22 listesine yalnız puanlayıcı tarafı girmişti; bu madde **Balbal'ın davranışıdır** ve kapıdan önce kodda olmalı. Kapı ölçümünde bu davranış aranacak. Prompt değişikliği gerekiyorsa Ç-15/8 gereği önce kısa plan.

---

## B. Kapıdan sonra

### 4. Hukuk çalışanı kendi dava dosyalarını göremiyor (KP-3)

**Bugün:** Hukuk departmanının 25 belgesinden 18'i (tüm dava dosyaları dahil) "restricted". Çalışan rolündeki Hukuk Müşaviri kendi departmanının dava dosyalarını göremiyor.
**Karar:** Çözülmeli. **Plan şimdi, uygulama kapıdan sonra** (yetki kuralı kapı sırasında değişmesin; kontrolör ölçümü buna göre ayarlandı).
**Önerilen kurgu (yöntem senin):**
- "Restricted" = departman **dışına** kapalı, departman **içinde** açık.
- Yalnız yöneticinin göreceği belgeler (ör. maaş, kişisel İK belgeleri) için ayrı bir "gizli" düzey.
- Sınır korunmalı: başka departmanın çalışanı (ör. Enerji) Hukuk'un dava dosyalarından hiçbir bilgi alamaz.

Yetki kuralı (Ç-15/3) → önce plan, Ürün Yetkilisi onayı, sonra kod; yetki soruları yeniden koşulur.

### 5. Eski adlar ve proje kodları (N1 öneri 3–4)

"Ankara/İzmir" gibi eski adlar ve "ANK_RES" gibi kodlar bugün adsız sayılıyor. **Karar:** Ayrı iş açılmaz; planlandığı gibi Dalga 1'deki **takma ad alanı** ile kapıdan sonra çözülür. Soru seti tarafı v14.1 ekinde çözüldü.

---

## C. Senden beklenenler (hatırlatma — yeni iş değil)

- v14 + v14.1, Kızılova önlisans tarihi düzeltmesi, dondurma etiketi (WA notu 16.10).
- Ana dala birleştirme hakkında görüşün.
- Kural merdiveni için blok-bayrak eşlemesi.
- B-01 (Excel içeriğine ulaşılamıyor) çözüm yolu — kapı için kritik.

Acele yok, kendi temponda. Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11 (proje-proje tam cevap Ürün 2'de kalır; bu not onu açmaz)
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu ve soru seti eki) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Madde 1 (seçenekleri daraltma) — plan:
  - 16.10.2026: Plan henüz yazılmadı. Sıra: etiketten sonra önce kısa plan (yöntem + ölçü), sonra kod. Plan yazılınca bu satırın altına eklenecek.
  - 16.10.2026 — **Bulgu (GEN-DSC-003), karar senin:** "enerji" kullanıcısı yalnız Karatepe'nin sigorta belgelerini görüyor. Yeşilova Sigorta Zeyilnamesi ve Karatepe Insurance Assignment (finans), Sigorta Programı notları ve grup özeti (idari_isler) enerjiye kapalı. Yetki içinde beklenen seçenek yalnız Karatepe. Yeşilova'yı seçenek olarak beklemek, görünmeyen belgenin varlığını sızdırır (değişmez kural 1); bu yüzden öyle kodlamadık. Çok projeli sigorta vakası ölçülmek istenirse iki yol var: (a) `ask_as_user` finans yapılır (Karatepe + Yeşilova), (b) ayrı varyant GEN-DSC-003-F eklenir. Bu bir soru seti kararı; uygulanmadı.
- Madde 2 (tek aday) — görüş:
  - 16.10.2026: "Bugünkü davranış kalsın" kararını gördük ve kabul ettik; bu doğrultuda hareket ediyoruz.
- Madde 3 (❗ çelişkili veri) — plan / commit:
  - 16.10.2026: Plan henüz yazılmadı. Prompt değişirse önce kısa plan (Ç-15/8), sonra kod. Plan yazılınca buraya eklenecek.
- Madde 4 (Hukuk görünürlüğü) — plan:
  - 16.10.2026: Kapıdan sonra; önce plan. Plan henüz yazılmadı.
- v14.1 uygulandı mı — commit:
  - 16.10.2026: Uygulandı — commit `c0c0984` (ntoydem/company-ai, dal `feat/adim5-veri-kutuphanesi`). 5 sorunun 5'i de uygulandı. Puanlayıcı kodu değişmedi. Sürüm alanı int olduğu için "14" kaldı; v14.1 kaydı soru notlarında. Rapor: `docs/reports/IS_EMRI_2026-10-16V141.md`.
  - LLM'siz yeniden puanlama: M1 70/99, N1 70/99 (resmî M1 71/99 değişmedi).
  - Önce/sonra: GEN-DSC-004 ❌→✅ (M1, N1). GEN-DSC-003: M1 ✅→❌ (proje sormadan cevapladı), N1 ❌ (Kızılova'yı da saydı). ANK-MIX-001 ikisinde ❌ (M1 projesiz rakam verdi, N1 Kızılova'yı da saydı). GEN-DSC-011/011-K: ham cevaplar eski metne ait; yeni metin sonraki canlı koşuda ölçülecek.
  - Alan seçimi bildirimi (itiraz edersen geri alınır): GEN-DSC-003/004 kategorisi discovery → ambiguous yapıldı (discovery, `answered_ok`'u koşulsuz True yapıyor ve belge gösterimi istiyor; `validate_ledger` Q8 discovery + expect_no_answer birleşimini reddediyor). ANK-MIX-001 kategorisi mixed kaldı, `required_sources` boşaltıldı (proje seçildikten sonraki MIXED cevap kapsam dışı). GEN-DSC-011 `required_sources` "Financial Model 2026" oldu.
- Diğer:
  - 16.10.2026 — Dondurma etiketi `cetvel-v2.1-v14.1` henüz atılmadı. Şartlar: (1) GEN-GEN-001/002/003 puanlayıcı kararı — v2.2 `answer_policy: either` önerimiz, onayını bekliyor (PR #55); (2) Kızılova tarih düzeltmesi — K1 planı hazır (`docs/reports/IS_EMRI_2026-10-16K1_PLAN.md`), canlı adım için açık onay gerekir.
  - 16.10.2026 — Etiketten sonraki sıra: Madde 1 (önce kısa plan, sonra kod), Madde 3 ❗ çelişkili veri (prompt değişirse önce plan), Excel proje ayrımı (önce tek sayfalık plan). Bu planlar henüz yazılmadı; yazılınca ilgili Cevap satırına eklenecek. Madde 4 (KP-3) ve Madde 5 (takma ad alanı) kapıdan sonra, plan önce.
