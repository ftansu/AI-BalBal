# Kontrolör Durum Raporu — 15.10.2026 (akşam)

> **Bilgilendirmedir — talimat değildir.** Bu rapor bağımsız kontrolörün, Ürün Yetkilileri için hazırladığı durum değerlendirmesidir. Geliştiriciye iş emri niteliği taşımaz; bir bulgu iş gerektiriyorsa ürün sahibi bunu kendi notuyla iletir.

**Tarih:** 15.10.2026, 22:00 · **Hazırlayan:** Kontrolör (Ürün Yetkilileri adına) · **Kapsam:** 13.10.2026 (mimari görüş notu, PR #32) sonrasında başlayan süreç — BT-01'den T1 raporuna kadar · **Amaç:** 16.10 sabahı yapılacak "sonraki aşama" kararına kanıt üretmek · **Anayasa:** v2.1 (ADT-4 geçici hükmü yürürlükte)

**İncelenen kaynaklar:** `ntoydem/company-ai` dalı `feat/adim5-veri-kutuphanesi` HEAD `09cb870` (16 iş emri raporu 13–15.10, `results/`, `scripts/`, ADR-031/032, `docs/OPERATIONS.md`); `ftansu/AI-BalBal` HEAD `3192c5e` (PR #33–#40, `kontrolor/`, `docs/yazismalar/`); proje alanındaki 15.10 yol haritası, geliştirici cevabı değerlendirmesi ve ortak not taslağı. **Bakılamayan:** AI-BalBal PR yorumları (bu oturumda erişim yoktu); canlı sistem (komple koşu dışında soru sorulmaz kuralı). Rapordaki rakamlar geliştirici raporlarından alınmış ve mümkün olan her yerde ham dosyayla (`results/*.json`, `results/huni/`, `results/stage2/`) karşılaştırılmıştır; karşılaştırılamayan yerler işaretlidir.

---

## 0. Can alıcı nokta — beş cümle

1. **Elimizdeki tek "skor" (70/99) canlıdaki sistemi ölçmüyor.** 70, 14.10'daki S3 koşusunun ham cevaplarının yeni puanlayıcıyla yeniden puanlanmasıdır. O günden beri canlı kod üç kez değişti (proje daraltma, router öncesi kod kararı, varlık kalıbı daraltma) ve hiçbiri 99 soruyla LLM'li ölçülmedi. Bugünkü canlı sistemin doğruluğu **bilinmiyor**; ancak yapısal kazanımlar (yabancı proje parçası 1.693 → 0, Bursa RES reddi, duman 9/9) LLM'siz ölçülerle kanıtlı.
2. **Ölçü aleti düzeldi ama tek yöne esnedi.** 59 → 70 artışının tamamı puanlayıcı ve altın küme gevşemesinden; T1 raporu ters örnek bulamadı. 70 geçen sorunun 30'unda gevşeme bir yanlışı gizleyebilir (17 cevap otomatik doğrulanmadı, 11 karma cevapta uydurma-sayı denetimi çalışmıyor). Geliştiricinin elle okumasında KY 0; **kontrolörün bağımsız okuması henüz yapılmadı** (bu raporun açık işi).
3. **Dondurulmuş kütüphane kaydı yanlış anlaşılıyor.** Protokoldeki "113 belge / 7 proje" kaydındaki 7. proje Güneşalan değil, canlıya 23.09'da eklenmiş `TEST_PRJ` satırıdır; Güneşalan hiçbir veritabanında yok. 15.10 yol haritasındaki "7 tanımlı / 6'sında belge, Güneşalan belgesiz" cümlesi kontrolörün hatalı okumasıdır ve bu raporla düzeltilir. `TEST_PRJ` canlıda üç soruyu ve GEN-GEN-003'ü bozuyor; eval ortamında yok, dolayısıyla **canlı ≠ eval**.
4. **Test seti tek projeye yaslanmış.** 99 sorunun Excel'e giden 20'sinin hepsi Karatepe dosyalarına ait; Yeşilova ve Boztepe ödeme planları hiçbir soruda ölçülmemiş. Bu akşam açılan B-01 bilgilendirmesi ("Excel içeriğine hiçbir hat ulaşamıyor") **fazla geniş yazılmıştır**; doğrusu "Karatepe dışı Excel dosyalarına ulaşılamıyor, kök neden ölçülmedi" olmalıdır. Düzeltme önerisi §4'te.
5. **Çalışma düzeni değişikliği işliyor.** 15.10 ortak notu (tek iş paketi, tarihsiz çıkış ölçütleri, günde tek karar penceresi, LLM'siz huni ölçüleri, `results/` repoda) geliştirici tarafından aynı gün uygulanmaya başlandı: Faz 0, huni tablosu, Aşama 2, değer kontrollü duman, geri alma provası bir günde tamamlandı. Darboğaz kapasite değil; **karar yığını** (Tansu'da 14, Naci'de 4, kontrolörde 5 açık madde — §5).

---

## 1. Zaman çizelgesi — 13.10 (mimari görüş notu) sonrası

| Tarih | Olay | Kim | Sonuç / kanıt |
|---|---|---|---|
| 13.10 | Mimari görüş notu (PR #32); BT-01 ilk kontrolör koşusu, 45 soru | Kontrolör | **%64** (M1), 503 hataları; kontrolör çerçevesi onaylandı; test protokolü v1 |
| 13.10 | Güncel iş listesi (PR #35), S0 Excel paketi emirleri | Ürün sahibi | S0-a/b/c/d sırası |
| 13.10 | S0-a/b: Excel koruması (tek değer kuralı, bir yeniden plan), TODAY, USD, closing sütunu, `extra_fields` | Geliştirici | Kod, 706 test; canlı dokunulmadı |
| 13.10 | S0-c: Excel paketi eval, Haiku düşünme kapalı | Geliştirici | **40/99**; 23 yanlış red; E1/E5/E6/E8 doğru |
| 13.10 | S0-d: teşhis — 39 soruda Haiku+düşünme 28 = Sonnet 28 | Geliştirici | Kayıp modelde değil; öneri B kabul (PR #37) |
| 13.10 | S1: Haiku + cevap düşünmesi + Sonnet plan canlıya | Geliştirici | Duman 7/7, kesinti 11,7 s |
| 13.10 | S4-a: açılış örnek soruları kaldırıldı (PR #38) | Geliştirici | Kod hazır, **canlıya dağıtılmadı** |
| 14.10 | B2-a/b: kural 12, netleştirmede yalnız soru, `EK_F_MODE=true` canlıya | Geliştirici | Duman 7/7; (g) borç sorusu Excel'de 0 verdi |
| 14.10 | S2-c: "tarih ≤ bugün" kuralı + bekçi canlıya | Geliştirici | (g) 11.671.800 ✅; `make test` 25 kırmızı (canlı .env) |
| 14.10 | S3: 99 soru, canlıyla birebir ayar | Geliştirici | **59/99 (%59,6)**; KY listesi 13 (ledger'a aykırı 0, kural ihlali 3); $0,54 |
| 15.10 sabah | Yol haritası (tıkanıklık teşhisi) → Word ile geliştiriciye; geliştirici cevabı; ortak not taslağı | Kontrolör / ürün sahibi / geliştirici | Mutabakat: K-A…K-G, tarihsiz çıkış ölçütleri, Şart 1–2, kalıcı ilkeler |
| 15.10 | F0: puanlayıcı v2.0, soru seti v13, S3 yeniden puanlama | Geliştirici | **70/99 (%70,7)**, LLM'siz; `results/` repoya |
| 15.10 | A2: `project_scope` + migration 0016 + proje daraltma; huni tablosu | Geliştirici | Yabancı parça 1.693 → 0 (LLM'siz); 757 test; canlıya alınmadı |
| 15.10 | A2L: canlıya alma → duman 7/9 → **geri alındı** (pg_restore, 22,4 s) | Geliştirici | İki düşen satır migration kaynaklı değil |
| 15.10 | A2L2: router öncesi kod kararı (olmayan proje, varlık sorusu) → canlıya | Geliştirici | Duman **9/9**; varlık yolu 22 soruyu yakalıyor (7'si yanlış) |
| 15.10 | A2L3: varlık kalıbı daraltıldı; yedekten geri yükleme provası; runbook | Geliştirici | 22 → 15; prova temiz; duman 9/9; 787 test |
| 15.10 | Sonraki aşama notu (PR #39): Faz 2 kapısı 3 koşu ortalaması + saklı set | Ürün sahibi | Faz 0 tablosu + proje filtresi kontrolleri istendi |
| 15.10 | T1: kural tablosu, cömertlik kontrolü, etiket/grup/alias ölçümleri | Geliştirici | 6 karar isteği |
| 15.10 akşam | B-01 bilgilendirmesi (PR #40): Yeşilova ödeme planı Excel'i | Kontrolör | Bu raporla daraltılıyor (§4, B-5) |

**Skor serisi (karşılaştırılabilirlik uyarısıyla):** 40 (S0-c, v11, düşünme kapalı) → 59 (S3, v12, canlı ayar) → 70 (S3 ham cevapları, v13 + puanlayıcı v2.0) → **? (canlı kod A2L3, ölçülmedi)**. İlk üçü ne aynı kodu ne aynı puanlayıcıyı kullanıyor; ortak nottaki "tek referans Faz 0 sonrası taban" kuralı gereği **70/99 taban kabul edilebilir**, ama bu taban *14.10 kodunun* tabanıdır.

---

## 2. Nerede duruyoruz

### 2.1 Canlı sistem (15.10, 16:43 UTC restart sonrası; geliştirici raporlarından)

| Kalem | Durum |
|---|---|
| Kod | `64c8966` (A2L3); HEAD `09cb870` yalnız ölçüm/rapor ekledi, restart gerekmedi |
| Şema | migration **0016** (`documents.project_scope`: project 103 / group 10, CHECK) |
| Modeller | router Haiku 5.5 · cevap Haiku 5.5 (adaptif düşünme, 8192) · Excel plan Sonnet 5.5 |
| Bayraklar | `EK_F_MODE=true` · `ASSIST_MODE=false` · `ANSWER_THINKING=true` · `ANTHROPIC_THINKING=false` · `EMBEDDINGS=false` · `RETRIEVAL_TOP_K=80` |
| Veri | 113 belge (106 PDF + 7 xlsx), 461 parça, 6 kullanıcı, **7 proje = 6 ledger + `TEST_PRJ`**, demo bugünü 06.10.2026 |
| Duman | `scripts/smoke_live.py` 9 soru, **değer kontrollü**, son sonuç 9/9 (exit 0) |
| Yedek | `live_pre_A2L_20261015-1501.dump` (0015 anı); `.env` yedekleri S1 ve B2b; geri alma runbook'u `docs/OPERATIONS.md`; downgrade 0016→0015 geçici DB'de denendi, temiz |
| Frontend | Canlı Caddy imajı **03.10** — PR #38 (örnek soruların kaldırılması) **dağıtılmadı** |
| Test paketi | 787/787 **yalnız** `EK_F_MODE=false` ile; canlı `.env` ile 25 kırmızı (S2-c'den beri, Ç-16 gerekçesiyle düzeltilmedi) |
| Kesintiler | 13–15.10 arasında 6 restart × ≈11,7 s + 1 geri alma 22,4 s; A2L3 dumanı sırasında canlıda başka bir kullanıcı soru sordu (sistem kullanımda) |

### 2.2 Ortak nottaki sıra — hangi adım nerede

| Adım (ortak not §6) | Çıkış ölçütü | Durum 15.10 akşamı |
|---|---|---|
| Faz 0 — ölçü aleti | S3 yeniden puanlandı; taban kilitlendi; **kontrolör ≥20 soruyu bağımsız puanladı ve uyuştu** | Geliştirici kısmı ✅ (70/99; `results/s3_rescored/kontrolor_20.md` + T1 `kontrolor_20` hazır). **Kontrolör kısmı ✗ — yapılmadı.** Faz 0 bu yüzden resmen kapanmış sayılmaz |
| Huni tablosu | Her kayıp tek aşamada; repoda | ✅ `results/huni/s3_rescored_huni.md` — 29 kayıp: Arama 2 · Proje ekseni 14 · Router 1 · Israrlı red 5 · Kural 2 · Excel 1 · Puanlama-kaynak 4. 11 satır geliştiricinin elle atamasıyla (OVERRIDES); kontrolör onayı bekliyor (A2 karar isteği 5) |
| Aşama 2 — proje daraltma (Şart 1) | Adlı sorularda yabancı parça 0; eksen kararı doğru; grup belgeleri kapsamda; olmayan proje reddi — LLM'siz | ✅ Adlı 66 soruda 1.693 → 0 (eval DB); karar 65/65; sentetik olmayan proje 3/3; canlıda duman (c)/(d)/(h)/(i) ile görüldü. **Eksik:** adsız 13 soru (proje ekseni hunisinin kalanı) tasarım gereği dokunulmadı; ürün sahibinin 15.10 kararı ("proje proje ayrı") koda yansımadı |
| Router — ayrı ölçü | Rota doğruluğu kayıtlı | ✗ Başlanmadı (hunide 1 soru: ANK-OPS-003) |
| Aşama 3 — ısrarlı red + kural | 4(+1) soru geçiyor; 6 kural sorusu geçiyor | ✗ Başlanmadı; etkisi "ancak LLM koşusuyla görülür" (A2 §4). Prompt paketi 80 → ~23 parçaya indiği için bu 5 sorunun kendiliğinden düzelmiş olma ihtimali var — ölçülmedi |
| Aşama 4 — Excel | 21 Excel sorusu ölçüldü | ✗ Başlanmadı; hunide 1 soru (GEN-DSC-011, ataması tartışmalı) |
| Duman + testler | Değer kontrollü duman; 25 testin bayrakları fixture'da | Duman ✅ (9 soru, kalıcı araç). **25 test ✗** — hâlâ canlı `.env` mirası |
| Faz 2 kapısı | 3 koşu ortalaması ≥ %75 · KY 0 (K-F tanımı) · saklı set · kontrolör ≥20 bağımsız | ✗ Henüz tek koşu bile yok. **Saklı set (15–20 soru) ürün sahibinde, hazırlanmadı** |

### 2.3 Mutabakat ve iletişim

- 15.10 ortak not taslağı ürün sahibi tarafından onaylandı, geliştiriciye WhatsApp/Word ile iletildi; geliştirici aynı gün uygulamaya başladı (Faz 0 → T1). **Ancak:** ortak not ve geliştiricinin cevabı **hiçbir repoda yok**; ortak not §8 "itiraz yoksa ortak not olarak repoya girer" diyor — girmedi. Mutabakatın Kayıtlı Kanalda kanıtı yok (Ç-1 Onay Kanıtı).
- Geliştirici AI-BalBal'ı çekmiyor: T1 raporu "ai-balbal deposundaki not bu VM'de yok; emrin metni esas" diyor. PR #39 notu geliştiriciye iş emri metniyle ulaştı; **PR #40 (B-01) ve `kontrolor/` klasörü geliştiricinin önünde değil.** `kontrolor/` "geliştirici okur" ilkesine dayanıyor; fiilen okunmuyor.
- Geliştirici raporlarında 15.10 boyunca bizim notlarımıza atıf doğru ve hızlı (Ortak Not §8 → A2; PR #39 §1–§3 → A2L3/T1). İletişim tek yönlü değil; ama kanal WhatsApp + iş emri, GitHub değil.

---

## 3. Neleri fark ettik — bulgular

Önem sırası: **Kritik** (kapı kararını etkiler / kırmızı çizgi) · **Yüksek** (skoru veya ölçümü bozar) · **Orta** · **Düşük**. Her bulguda kanıt ve tahmini kök neden (kod / ayar / model / veri / süreç) yazılıdır.

### Kritik

**B-1 · Canlıdaki sistemin doğruluğu ölçülmedi.** Kanıt: A2, A2L2, A2L3 raporlarının üçü de "99-soru LLM ölçümü ayrı emir" diyor; `results/` klasöründe 14.10'dan sonra LLM'li 99-soru koşusu yok. Canlı kod üç kez değişti (ADR-031, ADR-032 Karar 1–3). Kök neden: **süreç** — ortak not "tam koşu yalnız kapıda" dedi; bu doğru ilke, ama Aşama 2 gibi büyük bir yapısal değişiklikten sonra bir ara ölçüm olmadan Aşama 3'e girmek, Aşama 3'ün hedef 5 sorusunun hâlâ kayıp olup olmadığını bilmeden iş yapmak demek. Etki: Aşama 3–4 planı yanlış soruları hedefleyebilir; Faz 2'de sürpriz. Öneri §6.

**B-2 · KY (kendinden emin yanlış) = 0 iddiası henüz bağımsız doğrulanmadı.** Kanıt: T1 §A2 — 70 geçen sorunun 17'sinde ledger değeri biçimlenemediği için otomatik değer kontrolü yok, 11 MIXED/DATA cevabında G1 "uydurma sayı" denetimi belge kısmına uygulanmıyor; geliştirici 17'yi elle okudu (0 yanlış, 3 sınır). Kontrolörün Faz 0 çıkış ölçütü olan ≥20 bağımsız puanlama **yapılmadı**. Kök neden: kontrolör iş yükü / sıra. Etki: Faz 0 resmen kapanmadı; KY = 0 kırmızı çizgisi için tek kaynak geliştiricinin kendi okuması. **Bu raporun kendi açık işi (§5-C).**

**B-3 · Canlı ile eval ortamı aynı değil: `TEST_PRJ`.** Kanıt: T1 §B5 — canlı `projects` tablosunda 23.09.2026 tarihli `TEST_PRJ / Test Project` satırı var, eval DB'de yok. Alt dize eşleşmesi ("test" ⊂ "testi") yüzünden canlıda ANK-FIN-010, ANK-AUT-003, ANK-EPC-005 ("covenant testi", "performans testi") {ANK_RES, TEST_PRJ} adlı sayılıyor → eksen `none`; GEN-GEN-003 yalnız TEST_PRJ adlı sayılıp aday küme 10 grup belgesine iniyor. Kök neden: **veri** (canlıya özgü satır) + **kod** (alt dize eşleşmesi, `is_active` süzgeci yok). Etki: Aşama 2'nin eval'da ölçülen "yabancı parça 0" sonucu canlıda bu 4 soru için geçerli değil; protokolün 4. hazırlık sinyali ("belge/proje sayısı dondurulmuş kütüphaneyle aynı: 113 / 7") yanıltıcı — 7'nin biri test satırı. Kontrolör çerçevesindeki kayıt bu raporla düzeltilmelidir: **"113 belge / 6 ledger projesi (+ canlıda 1 test satırı)"**.

### Yüksek

**B-4 · Puanlayıcı düzeltmeleri tek yönlü; cömertlik sınıfı (d) 30 soru.** Kanıt: T1 §A1 — A1 +8, A3 +1, A4 +2 yalnız gevşetir; A2 ve A5 iki yönlü tanımlı ama S3'te sıkılaştırdığı soru yok; ters örnek bulunmadı. Geliştirici bunu açıkça yazdı ve sebebini (v1 kalıpları yanlış negatifti) doğru açıkladı. Kontrolör görüşü: açıklama tutarlı, ama "ters örnek yok" demek "ölçü aleti artık simetrik" demek değil — simetri ancak yeni bir koşuda v2 ile ❌ olan bir sorunun v1 ile ✅ olduğu görülünce kanıtlanır. GEN-GEN-002 (genel bilgi sorusuna "hangi proje?" netleştirmesiyle geçti) kontrolör gözüyle **gereksiz netleştirme = 0,5 puan**, tam puan değil; T1 karar 5'e cevabımız "hayır". Kök neden: ölçüm tasarımı. Etki: taban 70 iyimser olabilir; gerçek aralık 68–70.

**B-5 · Test seti Karatepe ağırlıklı; Excel hattı yalnız Karatepe'de ölçülüyor — B-01 bilgilendirmesi düzeltilmeli.** Kanıt: `results/s3_rescored/results.json` — Excel'e yönlenen 20 sorunun (17 MIXED + 3 DATA) gösterdiği dosyalar Financial Model 2026, Covenant Report, Budget vs Actual 2026, Monthly Production 2026 — dördü de ANK_RES; 99 soruda Yeşilova/Boztepe adı geçen soru **0**. `seed_data/excel/manifest.json`'da Yeşilova (2 sürüm) ve Boztepe ödeme planları kayıtlı. Excel yolu `_load_workbooks` ile kullanıcının yetkili **tüm** Excel'lerini yüklüyor, projeye daraltmıyor (A2: "Excel yolu daraltılmadı"). Bu akşam canlıda gözlenen "Yeşilova ödeme planı → yalnız belge hattı, 'kesin bilgi bulamadım'" davranışında en olası kök neden **router** (soru DOCUMENT sayıldı, Excel hattı hiç çalışmadı) ya da **sözlük** (`search_glossary.py`: "ödeme planı" → Financial Model/Debt/Repayment/Ödeme Planı); sözlükte "Repayment" anahtarı olduğu için sözlük tek başına açıklama değil. **B-01'in başlığı "Excel içeriğine hiçbir hat ulaşamıyor" yanlış genellemedir;** Excel hattı Karatepe'de doğru çalışıyor (DSCR, covenant, Ağustos üretimi, bütçe sapması, kalan borç). Düzeltme önerisi: başlık "Karatepe dışı Excel dosyalarına (Yeşilova/Boztepe ödeme planı) ulaşılamıyor; kök neden ölçülmedi", teşhis sorusu "bu soru router'da hangi türe gitti?" olarak değiştirilir; ürün sahibi onaylarsa `kontrolor/bilgilendirmeler/` dosyası güncellenir. Ayrıca: Excel yolu projeye daraltılmadığı için **Excel'de proje karışması riski** (kırmızı çizgi 3) açık — Karatepe'nin Financial Model'i ile Yeşilova'nın ödeme planı aynı katalogda planlayıcıya gidiyor; BT-02 belge yükleme bölümündeki "Karatepe dışı aylık üretim dosyası" senaryosu tam bu riski ölçmek için var.

**B-6 · Adsız sorularda proje seçimi — karar verildi, koda girmedi.** Kanıt: huni Aşama 2'nin 14 kaybından 13'ü adsız (GEN-DSC-002/004/006/007/009/010/006-M/007-K/011-K, ANK-ISO-002/003, ANK-MIX-001, ANK-NEG-004); A2 karar isteği 2 ("adsız keşifte `dominant`'ı listeye uygula ya da kullanıcının projesine daralt") açık. Ürün sahibi PR #39 §4'te kararı verdi: proje adı geçmiyorsa **proje proje ayrı** cevap, konsolide yalnız istenirse, kapsam belirsizse tek cümle "hangi proje?". Bu karar geliştiriciye iş emri metniyle ulaştıysa bile T1'de ele alınmadı. Kök neden: süreç (karar → iş emri köprüsü). Etki: Aşama 2'nin en büyük kalan kaybı (13/29) bekliyor; bu 13 soru düzelmeden %75 zor (70 + 13 = teorik üst sınır 83).

**B-7 · Alias / yazım toleransı yok — kullanıcı deneyimi riski.** Kanıt: T1 §B5 — 45 vektörde 9 sapma: "X GES" her zaman Akyar GES'i de adlandırıyor (5 satır; "ges" yalnız Akyar'ın adında geçtiği için "özgü" sayılıyor); ASCII yazım (Kizilova, Yesilova) → "Bu adda bir proje kayıtlı değil" (**yanlış ret**); küçük harf / karışık ("bursa RES", "Bursa Res") olmayan proje yakalanmıyor → router + `dominant` tahmini (GEN-HAL-003 sınıfı geri gelir). Kök neden: **kod** (`named_project_codes` alt dize + "özgü kelime" sayımı; `_PROJECT_MENTION` büyük harf regex'i; `unknown_project_names` ASCII katlamasız). Etki: web testinde (S4) gerçek kullanıcı "Kizilova" yazar; yanlış ret = güven kaybı. Geliştiricinin önerileri (RES/GES son-ek listesi, ASCII katlama ya da alias alanı, harf duyarsız eşleşme, kelime sınırı + `is_active`) makul ve dar. Ürün 1 kapsamında mı? Orantılılık ilkesine göre: **ASCII katlama ve kelime sınırı** Ürün 1'de gerekli (yanlış ret kırmızı çizgi değil ama "sistem tutmalı" ilkesine aykırı); alias tablosu Ürün 2 (bilgi katmanı).

**B-8 · Grup belgeleri proje sorularında görünmüyor — sebebi yetki, tasarım kararı gerekiyor.** Kanıt: T1 §B4 — 10 grup belgesinin departmanı `idari_isler`; enerji/finans/hukuk/finans_mudur kullanıcılarının 64 adlı sorusunda bu belgeler `allowed_document_ids`'e hiç girmiyor; yalnız `yonetim` görüyor. Daraltma tasarlandığı gibi (`proje ∪ grup`) çalışıyor, ama grup belgeleri zaten yetki süzgecinde eleniyor. Soru: holding garantisi, teminat mektubu, YK kararı gibi grup belgelerini finans ve hukuk görmeli mi? Demo veri kurgusuna göre büyük ihtimalle **evet** (Proje Finans'ın kredi sorusunda holding garantisi gerekir). Bu bir **demo veri / yetki şeması** kararıdır, kod hatası değil. T1 §B3'teki 3 şüpheli etiket (DOC-CO-ADM-001/002/003 — YK/pay sahipleri kararları tek proje anıyor) aynı kümede; kontrolör görüşü: **grup kalsın**, bunlar şirket organı kararıdır, proje bağı Ürün 2'nin "bağ" alanıyla kurulur.

**B-9 · Test altyapısı kırılganlığı.** Kanıt: S2-c'den beri `make test` canlı `.env`'i devralıyor (EK_F açıkken 25 kırmızı); A2'de yalnız backend paketi koşulmuş, ocr-worker fixture kırığı A2L2'de çıktı; ADR-031 ile "bayrak kapalı = bayt-aynı" sözleşmesi adlı ve olmayan-proje sorularında kaldırıldı (11 test güncellendi). Ortak not bunu "Faz 1'de fixture ile sabitlenir" diye kapsama aldı; henüz yapılmadı. Kök neden: Ç-16 (kapsam dışı düzeltme yapılmaz) ile "iş emri yazılmadı" birleşimi. Etki: yeşil test sayısı (787) ancak özel bayrakla elde ediliyor; CI yok; her yayın öncesi regresyon (Kapı 2 ön koşulu) bu hâliyle kurulamaz.

### Orta

**B-10 · Geri alma provası yapıldı, iyi; ama geri alma yolu artık iki katmanlı.** Kanıt: A2L3 — dump → geçici DB (0,74 s), md5 aynı, 0015→0016→0015 turu temiz; runbook `docs/OPERATIONS.md`. A2L'de gerçek geri alma da yapıldı (22,4 s). Dikkat: S1'de belgelenen "Gemini'ye dönüş" komutu artık tek başına yetmez — şema 0016'da; raporlarda bu not yok. Kök neden: dokümantasyon. Etki: düşük olasılık, yüksek maliyet; runbook'a tek satır yeter.

**B-11 · Belge tarihi ↔ olgu tarihi karışıklığı ele alınmadı.** Kanıt: S0-c raporu — model belge tarihini olgu tarihi sanıyor (Kızılova önlisans: belge 18.01.2024, olgu 15.01.2025). Hiçbir sonraki emirde hedeflenmedi; hunide ayrı sınıf yok. Kök neden: model + prompt. Etki: KY üretebilir (yanlış tarih, emin cevap); gizli sette "sürüm zinciri / göreli zaman" soruları bunu yakalayacak şekilde tasarlanmalı.

**B-12 · (g) borç sorusu: Sonnet ilk planı hep 3 sütun.** Kanıt: S2-c — bekçi tetiklenmedi ama S0-a "tek değer" kuralı yeniden plan tetikledi; her (g) tipi soruda ek ≈$0,007 ve +10 s. Kök neden: plan promptu. Etki: maliyet/gecikme, doğruluk değil. Aşama 4 (Excel) kapsamında.

**B-13 · Varlık sorusu kalıbı (ADR-032) kodla "liste + sabit soru" veriyor.** Kanıt: A2L2 22 soruyu, A2L3 daraltma sonrası 15'ini (14 discovery + GEN-GEN-001) LLM'siz yola alıyor. Avantaj: 0 LLM, 0 $, kararlı davranış. Risk: "ÇED raporu var mı" → liste (doğru), "üretim lisansı var mı" → olgu (doğru) ayrımı 28 kelimelik belge sözcüğü listesine dayanıyor; gerçek kullanıcı dili bu listeyi aşacak. Ürün 1 için kabul edilebilir; Kapı 2 held-out setinde bu kalıbı zorlayan sorular olmalı. Kontrolör görüşü: **politika kodda** ilkesine uygun, kalıcı ilke 1 ile tutarlı.

**B-14 · Kontrolörün yol haritasındaki hatalı varsayım.** 15.10 yol haritası §2.1: "7. proje (Güneşalan, GNS_GES) ana veride tanımlı ama hiç belgesi yok; kayıt 7 tanımlı / 6'sında belge diye düzeltilir." Geliştirici F0 karar 8: "eval DB projects 6, canlıda TEST_PRJ var, Güneşalan hiçbirinde yok." T1 §B5 alias vektörü satır 27 bunu teyit ediyor ("Güneşalan GES" → olmayan proje). **Kontrolörün okuması yanlıştı**; kanonik demo ledger'daki 7 SPV ile veritabanındaki projeler birebir değil (Güneşalan ledger'da var, DB'de yok). Düzeltme bu raporla kayda geçer; protokol ve çerçevedeki "113 / 7" ifadesi §5-C'de düzeltilecek.

### Düşük

**B-15 · Frontend PR #38 canlıda değil.** Canlı Caddy imajı 03.10; açılış örnek soruları ve "yalnızca … belgelerinde arar" metni hâlâ görünüyor. Web testi (S4) öncesi dağıtılmalı; S1 raporu "dağıtım ayrı" demişti, sonraki hiçbir raporda yapıldığı yazmıyor.

**B-16 · Rapor hacmi.** K-C ("tek sayfa rapor") kararına rağmen 15.10'da 6 rapor + 7 ek dosya; T1 60 satır ama 6 ek. Geliştirici K-C'yi "tek sayfa özet + ayrıntı ekte" diye yorumlamış; bu kabul edilebilir, ekler okunmak zorunda değil. Gözlem, bulgu değil.

**B-17 · Maliyet.** 13–15.10 toplam LLM maliyeti ≈ $4,9 (S0-d teşhisi $3,4'ü tek başına; Sonnet 39 soru). Günlük koşu ≈ $0,55. Faz 2 kapısı 3 koşu ≈ $1,7. Bütçe sorunu yok; bilgi.

---

## 4. Düzeltme kaydı (kontrolörün kendi hataları)

| # | Nerede | Yanlış | Doğru | Nasıl kapanır |
|---|---|---|---|---|
| D-1 | 15.10 yol haritası §2.1 | "7. proje Güneşalan, belgesiz" | 7. satır canlıya özgü `TEST_PRJ`; Güneşalan DB'de yok | Bu rapor; protokol kaydı "113 / 6 (+1 test satırı)" |
| D-2 | PR #40 B-01 başlığı ve okuması | "Excel içeriğine hiçbir hat ulaşamıyor" | Karatepe Excel'leri çalışıyor (S3'te Excel'e yönlenen 20 sorunun 12'si geçti); Karatepe dışı ödeme planları ölçülmemiş ve canlıda ulaşılamıyor; kök neden (router/sözlük/katalog) ölçülmedi | Ürün sahibi onayıyla B-01 metni daraltılır; teşhis sorusu router türüne çevrilir |
| D-3 | 15.10 yol haritası §2.2 ("proje süzgeci altyapıda var ama kullanılmıyor" → "10 satırlık iş" izlenimi) | v2 fact-check'te düzeltilmişti; A2 gerçekte şema + migration + yeni servis oldu | Kayıt için | — |

---

## 5. Açık kararlar ve işler — kime ait

### 5-A · Ürün sahibi (Tansu) — karar bekleyen 14 madde

Kaynak: T1 (6), A2 (3 kalan), F0 (4 kalan), kontrolör (1).

| # | Konu | Kaynak | Kontrolör önerisi |
|---|---|---|---|
| 1 | DOC-CO-ADM-001/002/003 grup mu proje mi? | T1-1 | **Grup** kalsın; proje bağı Ürün 2'de "bağ" alanıyla |
| 2 | Canlı `TEST_PRJ` satırı | T1-2 | **Pasife al** (`is_active=false`), silme; kod tarafında `is_active` süzgeci + kelime sınırı eşleşmesi tek küçük iş emri |
| 3 | GES-eki / ASCII / harf duyarlılığı düzeltmeleri | T1-2 | ASCII katlama + kelime sınırı + harf duyarsız: **Ürün 1, tek iş emri** (yanlış ret "sistem tutmalı"ya aykırı). Alias tablosu: Ürün 2 |
| 4 | 13 belge sorusunda ledger değeri biçimlenemiyor → değer kontrolü yok | T1-3 | **Biçimlendirici genişletilsin**; kontrolör okuması 3 koşuluk kapıda ölçeklenmez |
| 5 | G1 "uydurma sayı" denetimi MIXED/DATA belge kısmına | T1-4 | **Evet**; KY = 0 kriteri 11 soruda ölçülmüyor |
| 6 | GEN-GEN-002 netleştirmeyle geçmesi | T1-5 | **Hayır** — gereksiz netleştirme 0,5; taban 70 → 69,5 (kayıt için; kapı kararını etkilemez) |
| 7 | Adsız keşif sorularında proje seçimi (13 soru) | A2-2 | PR #39 §4 kararı zaten verildi ("proje proje ayrı; belirsizse tek soru") — **iş emrine dönüştürülmesi** gerekiyor; kontrolör görüşü: listede yabancı proje = yalnız kullanıcının yetkili olduğu projeler, proje başlıklı gruplu |
| 8 | `unknown_project_names` yalnız "RES/GES" ekli adları tanıyor | A2-3 | Madde 3 ile birlikte |
| 9 | Huni OVERRIDES (11 elle atama) + GEN-DSC-011 "4 Excel" ataması | A2-5 | Kontrolör onayı: 10 atama makul; GEN-DSC-011 "2 Proje ekseni" değil "4 Excel" kalabilir (tek hücre kuralı tarihi düşürdü) — **onaylıyorum** |
| 10 | A5 "en az bir gösterilen kaynak yetkili kümede" yorumu — 5 satır kontrolör teyidi | F0-1 | Kontrolör işi (§5-C-2); karar sonra |
| 11 | G3 "başka projenin belgesi" kuralı yalnız ANK/IZM tanıyor | F0-5 | **Genişletilsin** (6 proje); aksi hâlde YSV/BOZ karışması puanlayıcıda görünmez |
| 12 | A7 maliyet bölüşümü: AskResponse'a çağrı dökümü mü, log yeter mi | F0-6 | **Log yeter** (Ürün 1); orantılılık |
| 13 | Saklı set (15–20 soru) — PR #39 §5 | Tansu | Hazırlanmadı; Faz 2 kapısından önce gerekli; kontrolör şablon ve beklenen cevap denetimi için hazır |
| 14 | B-01 bilgilendirmesinin daraltılması (D-2) | Kontrolör | Onay bekliyor |

### 5-B · Geliştirici (Naci) — onay bekleyen / açık 4 madde

| # | Konu | Durum |
|---|---|---|
| 1 | Ortak notun repoya girmesi (§8) | İtiraz gelmedi; dosya repoda yok — ürün sahibi hangi repoya (AI-BalBal `docs/yazismalar/` önerilir) koyacağına karar verir |
| 2 | 25 ortam-bağımlı testin fixture'a alınması | Ortak not kapsamında; iş emri yok |
| 3 | PR #38 frontend dağıtımı | S4 öncesi |
| 4 | Runbook'a "S1 Gemini'ye dönüş artık 0016 downgrade gerektirir" notu | Tek satır |

### 5-C · Kontrolör — kendi açık işleri (öncelik sırasıyla)

1. **T1 "kontrolör bakmalı 7 satır" + 20'lik örneklem** (ANK-FIN-007, ANK-FIN-011, GEN-GEN-002, ANK-FIN-010, IZM-DEV-001, ANK-MIX-002, GEN-DSC-001): ham cevap + ledger değeri yan yana, bağımsız puan. Faz 0'ın kontrolör çıkış ölçütü. **Tahmini süre: 1–2 saat; yarın sabah.**
2. **F0 karar 1 — A5 yorumu için 5 satır teyidi** (ANK-FIN-005 ✅, FIN-011 ✅, FIN-014 ✅, OPS-003 ❌, IZM-DEV-007 ❌).
3. **Protokol ve çerçeve kaydı düzeltmesi:** "113 / 7" → "113 belge / 6 ledger projesi (+ canlıda 1 test satırı)"; hazırlık sinyali 4 buna göre.
4. **Soru seti kapsam denetimi** (yol haritası Faz 0): 99 soruda Ürün 1 kapsamı dışı (hesap isteyen: "kaçıncı işletme yılı" ANK-OPS-001; karşılaştırma GEN-CMP-*) soruların "kapsam dışı — puan dışı" işaretlenmesi; ürün sahibiyle kilitlenir. Henüz yapılmadı; kapı eşiğini değiştirmez ama paydayı netleştirir.
5. **BT-02 hazırlığı:** 5 belge (biri Karatepe dışı aylık üretim Excel'i — B-5'teki Excel proje karışması riskini ölçer) + 1–2 injection belgesi; gizli set QS-v2 güncellemesi (alias/ASCII, belge tarihi ↔ olgu tarihi, Karatepe dışı Excel, grup belgesi görünürlüğü senaryoları eklenir); test alanı için ürün sahibinin geliştiriciye isteği.
6. **Günlük rapor doğruluk satırı:** 16.10 raporuna "geliştirici 70/99 (yeniden puanlama, 14.10 kodu) · kontrolör BT-01 %64 · canlı kod ölçülmedi" yazılır.

---

## 6. Sonraki aşama için seçenekler (16.10 kararı)

Ortak not sırası: Router → Aşama 3 → Aşama 4 → Duman/testler → Faz 2 kapısı. Kontrolör, B-1 nedeniyle bu sıraya **bir ara ölçüm** eklenmesini öneriyor. Üç seçenek:

| Seçenek | Ne yapılır | Artı | Eksi | Kontrolör görüşü |
|---|---|---|---|---|
| **A — Önce ölç, sonra Aşama 3** | Geliştirici canlı kodla (A2L3) 99 soruyu **bir kez** koşar (≈$0,55, ≈15 dk), `results/`'a yazar; kontrolör aynı gün 20 soruyu bağımsız puanlar + 7 satırı okur; huni yeniden kurulur; Aşama 3 yalnız **hâlâ kayıp** sorulara yapılır | Aşama 3'ün hedefi doğru belirlenir; B-1 ve B-2 birlikte kapanır; Faz 2'ye giden ilk veri noktası | "Tam koşu yalnız kapıda" ilkesinden bir kez sapma; tek koşu oynaklığa açık (3 koşu kuralı kapıda zaten var) | **Önerilen.** Bu koşu kapı koşusu değil, huni girdisidir; ilkeyle çelişmez ("her aşama kendi ölçüsüyle" — Aşama 3'ün ölçüsü LLM'li olmak zorunda) |
| **B — Önce T1 kararları, sonra ölç** | Tansu'nun 14 kararı (özellikle 2, 3, 7) iş emrine dönüşür; TEST_PRJ pasif, ASCII/kelime sınırı, adsız sorular; sonra A | Ölçüm daha temiz koda yapılır; adsız 13 soru da hedeflenmiş olur | 1–2 gün gecikme; adsız soru tasarımı A2L gibi geri dönüş riski taşır | İyi ikinci seçenek; adsız soru işi büyükse A → B sırası daha güvenli |
| **C — Ortak not sırası aynen** | Router → Aşama 3 (5 soru tek tek) → Aşama 4 → duman → Faz 2 | İlkeye sadık | Aşama 3 belki artık gerekmeyen 5 soruya yapılır; Faz 2'de ilk gerçek sayı görülür — sürpriz riski | Önerilmez |

**Her seçenekte ortak:** (i) Kontrolör işleri §5-C 1–3 yarın sabah; (ii) Saklı set (Tansu) Faz 2'den önce; (iii) B-01 daraltma onayı; (iv) ortak not repoya.

**Kapı için hatırlatma:** Faz 2 kapısı = 3 koşu ortalaması ≥ %75 · KY 0 (K-F tanımıyla: ledger'a aykırı rakam + kural ihlaliyle emin cevap + proje karışması + eksik listeyi tam sunma) · güvenlik %100 · saklı sette ciddi düşüş yok · kontrolör ≥20 bağımsız. Mevcut veriyle (70 taban, 13 adsız kayıp, 5 ısrarlı red belki düzeldi) **%75 ulaşılabilir görünüyor ama kanıtı yok** — kanıt A seçeneğindeki koşudur.

**Dürüst takvim notu:** Ortak not tarihsiz. Bilgi için: A seçeneği 16.10'da yapılırsa, Aşama 3–4 ve adsız soru işi 17–20.10, Faz 2 ilk koşusu en erken 21.10; BT-02 için test alanı ve belge hazırlığı paralel yürür. 2 Kasım hâlâ mümkün, taahhüt değil.

---

## 7. Ölçülemeyen riskler (orantılılık gereği istenmedi)

- **Excel'de proje karışması:** Excel yolu projeye daraltılmıyor; 99 soruda Karatepe dışı Excel sorusu yok → ölçülemedi. BT-02 belge yükleme senaryosu ölçecek.
- **Aşama 3'ün 5 sorusunun güncel durumu:** LLM koşusu olmadan bilinmiyor.
- **Oynaklık:** aynı sorunun 3 koşuda aynı puanı alma oranı (kararlılık) hiç ölçülmedi; BT-02 tekrar alt örneklemi ile.
- **Eşzamanlı kullanım / gecikme:** p90 12,8 s (S3); 5 eşzamanlı kullanıcı ölçülmedi (Kapı 2 ön koşulu, Ürün 1'de istenmez).
- **Prompt injection:** Ç-6 tek cümle kuralı Ürün 1 promptuna girdi mi, raporlarda görülmedi (ortak not karar 3 "evet" dedi); BT-02'de ölçülecek.
- **Canlı ≠ eval farkı:** TEST_PRJ dışında başka fark var mı (audit satırları, kullanıcı tablosu) — doğrulanamadı.

---

## 8. Anayasa kontrolü

```
[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (ADT-4 geçici hükmü yürürlükte)
Okunan modüller   : Çekirdek (Ç-1, Ç-6, Ç-7, Ç-9, Ç-10, Ç-12, Ç-14, Ç-16), kontrolör çerçevesi, test protokolü
Ürün etiketi      : Ürün 1 — T-11 (rapor; kod değişikliği yok)
Gizli bilgi / yeni bağımlılık : Yok — şifre, API anahtarı, gerçek müşteri verisi yok; gizli soru seti metni yok (B-01'deki üç soru kontrolörün kendi canlı denemesidir, gizli set değildir)
Kapsam dışı değişiklik        : Yok — yalnız kontrolor/durum/ altına yeni dosya
Kendi başına verilen kararlar : (1) rapor yeri kontrolor/durum/ (yeni klasör; kosular/ koşu kayıtları içindir, bu bir koşu değil); (2) geliştirici raporlarındaki rakamlar ham dosyayla karşılaştırıldı, karşılaştırılamayanlar işaretlendi; (3) B-01 düzeltmesi önerildi, dosya değiştirilmedi (ürün sahibi onayı); (4) öneri tablolarında "önerilen" seçenek tek, karar ürün sahibinin — Ç-9
Anayasa ile çelişki : Görülmedi. Not: Ortak not ve geliştirici cevabı Kayıtlı Kanalda değil (Ç-1 Onay Kanıtı); §5-B-1'de öneri olarak yazıldı — Ç-10 ihlali değil, kayıt eksiği.
```

---

## 9. Kaynak dizini

- company-ai (dal `feat/adim5-veri-kutuphanesi`): `docs/reports/IS_EMRI_2026-10-13S0a…S4a.md`, `…2026-10-14B2a/B2b/S2c/S3.md`, `…2026-10-15F0/A2/A2L/A2L2/A2L3/T1.md`, `docs/reports/assets/T1_*.md`, `docs/ARCHITECTURE.md` (ADR-031, ADR-032), `docs/OPERATIONS.md`, `results/s3_final_2026-10-14/`, `results/s3_rescored/` (results.json, rescore_diff.md, kontrolor_20.md), `results/huni/s3_rescored_huni.md`, `results/stage2/measure_2026-10-15.md`, `results/t1/`, `scripts/smoke_live.py`, `seed_data/evaluation/smoke.json`, `seed_data/excel/manifest.json`, `backend/app/services/excel_ask.py`, `backend/app/services/search_glossary.py`.
- AI-BalBal: PR #32 (mimari görüş), #33 (kontrolor/), #35 (güncel liste), #37 (S0-d kararı), #38 (örnek sorular), #39 (sonraki aşama notu), #40 (B-01); `kontrolor/protokol/TEST_PROTOKOLU.md`; `kontrolor/kosular/2026-10-13_BT-01/`.
- Proje alanı (özel): 15.10 yol haritası v2, geliştirici cevabı değerlendirmesi, ortak not taslağı, kontrolör çerçevesi (13.10), günlük rapor 15.10.
