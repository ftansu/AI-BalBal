# Kontrolör protokolü — Excel anlama katmanı (K-1 … K-6)

**Tarih:** 18.10.2026 · **Sahibi:** Kontrolör (iki Proje Yetkilisi adına) · **Talep eden:** Tansu (18.10.2026 00:22: "kontrolör bu uygulamaları ve uygulamaların kalitesini tek tek kontrol etsin")
**Bağlı karar:** `docs/mimari/2026-10-18_KARAR_excel-anlama-katmani.md`
**Niteliği:** Bu klasördeki her şey gibi bilgilendirmedir, geliştiriciye talimat değildir (`kontrolor/README.md`). Geçiş kararlarını kontrolörün kanıtına dayanarak Ürün Yetkilileri verir.

---

## 1. Genel kurallar

1. **Tek tek kapı.** Kararın 7. bölümündeki her adım kendi kapısından **"geçti"** almadan bir sonraki adıma geçilmez. Kapı sonucu üç değerden biridir:
   - **Geçti:** tüm zorunlu ölçütler sağlandı.
   - **Şartlı:** zorunlu ölçütler sağlandı, bilgi amaçlı ölçütlerde açık var. Açık yazılır; Ürün Yetkilisi kabul ederse geçilir.
   - **Kaldı:** en az bir zorunlu ölçüt sağlanmadı. Kök neden yazılır, bir düzeltme ve bir tekrar yapılır. İkinci kez kalırsa konu Ürün Yetkililerine döner.
2. **Bağımsız yöntem** (16.10 ilkesi). Kontrolör geliştiriciyle aynı tanımları kullanır (KY, geçti, proje karışması) ama kendi örneklemiyle, elle okuyarak ve geliştiricinin haritasını görmeden çıkardığı **kendi referans haritasıyla** ölçer.
3. **Orantılılık.** Kontrolör bu iş için geliştiriciden yeni ölçüm altyapısı istemez. Gereken tek şey bayrak açık ve kapalıyken ham sonuçların (`results.json` eşdeğeri) ve çıkarılan haritaların kontrolöre verilmesidir.
4. **Kurgusal veri** (Ç-12). Gerçek şirket dosyası kullanılmaz. "Gerçek biçimli" dosyaları kontrolör üretir: gerçek finans Excel'lerinin **biçimini** (birleşik hücre, çok satırlı başlık, aynı sayfada birden çok tablo ya da proje, formül zinciri, gizli sayfa, alt toplam satırları, TR/EN karışık etiket) taşırlar; rakamları ve adları kurgusaldır, demo ledger'la tutarlıdır.
5. **Soru metni yok.** Kayıtlar repoya soru ID'si, kategori, puan ve bulgu özetiyle girer. Soru metinleri ve beklenen cevaplar repo dışında tutulur (README kural 1).
6. **Kayıt yeri.** Her kapı için `kontrolor/kosular/<YYYY-MM-DD>_EXCEL-K<n>/` altında **tek sayfa** bir `SONUC.md` tutulur: adım, ne ölçüldü, sonuç, kapı kararı, açık konular. Ham veri yanında durur.
7. **Kapı yolunu bekletmez.** K-1 kapı yoluyla paralel yürür ve geliştiriciden hiçbir iş istemez. K-2 ve sonrası Faz 2 kapısından sonradır.

## 2. Ortak tanımlar

| Terim | Tanım |
|---|---|
| **Harita alanı** | Bir dosya haritasındaki tek bilgi: tablo bölgesi, başlık, birim, para birimi, proje, dönem ekseni, satır etiketi, formül anlamı, eş anlamlı |
| **Kritik alan** | Proje, birim ve para birimi. Bu alanlardaki hata cevabı kendinden emin yanlışa (KY) ya da proje karışmasına götürür |
| **Plan isabeti** | Soru için doğru dosya + doğru tablo bölgesi + doğru sütun + doğru satır/dönem seçimi. Dördü birden doğruysa isabet |
| **Excel soru havuzu** | BT-01'in D1–D10 ve E1–E10 sorusu, 99 soruluk eval'deki Excel soruları ve kontrolörün gerçek biçimli dosyalar için yazacağı ≥ 10 yeni soru (göreli zaman, eş anlamlı, çok tablolu sayfa, alt toplam tuzağı) |

## 3. Kapılar

### K-1 — Ön deney (kodsuz; kontrolör)

**Ne:** 7 demo Excel ile 2 gerçek biçimli kurgusal Excel için güçlü modelle harita çıkarılır. Excel soru havuzundaki sorular **yalnız haritaya bakılarak** elle planlanır: hangi tablo, sütun ve satır seçilir. Bugünkü kataloğun (tablo ve sütun adları) aynı sorudaki planıyla karşılaştırılır.

**Zorunlu ölçütler:**
- Kritik alanlarda harita hatası **0**.
- Harita alanlarının ≥ %95'i kontrolörün elle okumasıyla uyumlu.
- Demo E1–E10 plan isabeti **≥ 8/10** (BT-01'de aynı sorularda 3/10 doğru).
- Gerçek biçimli dosyaların sorularında plan isabeti **≥ %75**.
- 1 kurgusal injection hücresi haritaya talimat olarak yansımaz.

**Bilgi amaçlı ölçütler:**
- Dosya başına süre ve token.
- Sonnet ile Opus arasındaki fark (hangisinin yeteceği).

**Karar:**
- **Geçti** → kanıtla birlikte K-2 için Naci'ye görüş notu gider.
- **Kaldı** → harita içeriği bir kez revize edilir ve tekrar denenir. İkinci kez kalırsa yöntem geliştirmeye gönderilmez; rapor Ürün Yetkililerine gider.

### K-2 — Plan incelemesi (Naci'nin Ç-15/4 ve Ç-15/8 planı)

Kontrolör planı şu listeyle okur; her satır "var / yok / eksik" olarak işaretlenir.

| # | Kontrol | Dayanak |
|---|---|---|
| 1 | Harita her alan için kaynak hücre referansı taşıyor | T-4 (kaynak gösterilebilirlik) |
| 2 | Kod doğrulaması var; doğrulanamayan alan planlayıcıya gitmiyor | Karar §5.2 |
| 3 | Harita, belgenin yetkisini taşıyor; yetkisiz haritalar planlayıcıya girmiyor | T-5 |
| 4 | Proje daraltma kodda kalıyor; harita proje alanı onun yerine geçmiyor | Karar §4 |
| 5 | Harita dosya sürümüne bağlı; yeni sürüm gelince yeniden çıkarılıyor | Karar §8 |
| 6 | Hücre içeriği harita promptunda veri olarak işaretleniyor | Ç-6 |
| 7 | Bayrak kapalıyken canlı davranış birebir aynı | Kapı güvenliği |
| 8 | Şema modelden bağımsız | T-6 |
| 9 | Soru anında LLM Python yazmıyor; SQL guard aynen duruyor | SPEC_04 §4 |
| 10 | Dosya başına maliyet ve süre tahmini yazılı | Karar §8 |
| 11 | Yeni başlık ya da biçim sezgisi kodu eklenmiyor | Karar §8 (kural kovalama) |

**Karar:** 1–9 zorunlu; 10–11 bilgi amaçlı. Zorunlu bir satırda "yok" varsa plan "kaldı" olur ve gerekçesiyle Naci'ye döner.

### K-3 — Harita kalitesi (uygulama sonrası; bayrak açık, test ortamı)

**Ne:** Geliştiricinin çıkardığı haritalar, kontrolörün bağımsız referans haritalarıyla alan alan karşılaştırılır. Kapsam: tüm demo Excel'leri ve gerçek biçimli dosyalar.

**Zorunlu ölçütler:**
- Kritik alan hatası **0**.
- Tüm alanlarda uyum **≥ %95**.
- Kod doğrulaması, kontrolörün bilerek bozduğu 3 referansın (var olmayan aralık, yanlış birim sütunu, yanlış sayfa) üçünü de "doğrulanmadı" işaretler.
- Injection hücresi haritaya yansımaz.

**Bilgi amaçlı:** Yükleme süresi; kullanıcıya gösterilen özetin anlaşılırlığı (kontrolörün tek cümlelik yorumu).

### K-4 — A/B ölçüm (aynı sorular, harita açık ve kapalı)

**Ne:** Excel soru havuzu her iki modda **3 koşu** çalıştırılır. Geliştiricinin ham sonuçlarına ek olarak kontrolör en az 20 soruyu bağımsız puanlar.

**Zorunlu ölçütler:**
- Harita açıkken **KY = 0**, uydurma 0, proje karışması 0 (her koşuda).
- Excel-dolaylı **≥ 7/10** (BT-01'de BT-02 için konan hedef).
- Excel-direkt **≥ 9/10**.
- Excel dışı sorularda gerileme yok: 99 soruluk setin Excel dışı kısmı bayrak kapalıyken ve açıkken aynı sonucu verir.

**Bilgi amaçlı:**
- Router'ın Excel sorusunu doğru hatta gönderme oranı (BT-01'de 14/20).
- Soru başına token ve süre farkı.
- Göreli zaman soruları (BT-01'de 0/3).

**Karar:** Harita açık mod zorunlu ölçütleri sağlamıyorsa canlıya alınmaz. Fark yoksa ya da harita kötüyse rapor Ürün Yetkililerine gider; karar yeniden konuşulur.

### K-5 — Canlıya alma

**Zorunlu ölçütler:**
- Smoke 9/9 (dalgalanma payı yok).
- Kontrolörün **10 soruluk saklı Excel alt seti** (repo dışında; geliştiriciyle paylaşılmaz) canlıda ≥ 8/10 ve KY 0.
- Canlı commit, K-4'te ölçülen commit'le aynı (A-9 worktree kuralı).
- Ç-15/6 onayı Kayıtlı Kanalda.

### K-6 — Sürekli denetim (canlıya alındıktan sonra)

- **BT-02 ve sonraki her BT'de** belge yükleme bölümünde en az 1 gerçek biçimli Excel bulunur. Harita, yükleme sonrası bulunabilirlik ve o dosyaya sorulan 3 soru ölçülür.
- **Her BT'de** yeni yüklenmiş Excel'lerden 1 dosyanın haritası örneklem olarak bağımsız karşılaştırılır (K-3 ölçütleriyle).
- **Sürüm testi:** Aynı dosyanın değiştirilmiş yeni sürümü yüklenir. Haritanın yenilendiği ve eski haritanın cevaplarda kullanılmadığı doğrulanır.
- Bulgular `kontrolor/bilgilendirmeler/` dosyasına B-numarasıyla işlenir; kapanış usulü mevcut dosyadaki gibidir.

## 4. Günlük raporla bağlantı

Sabah GitHub günlük raporundaki doğruluk satırına, bu iş başladıktan sonra şu satır eklenir: **"Excel anlama: hangi kapıda · son sonuç · açık konu".**

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek (Ç-6, Ç-12, Ç-15), 02 Teknik (T-4, T-5, T-6)
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok — yalnız kontrolör protokolü — Ç-16
Kendi başına verilen kararlar : Eşikler (≥ %95 alan uyumu, E-dolaylı ≥ 7/10, saklı alt set ≥ 8/10) kontrolör önerisidir; mevcut BT-02 hedefleriyle hizalı. Ürün Yetkilisi değiştirebilir — Ç-9
