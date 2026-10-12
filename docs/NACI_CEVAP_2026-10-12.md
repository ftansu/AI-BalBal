# Tansu'dan Naci'ye — 7. tur: model kararı, öncelik sırası ve açık sorular — 12.10.2026

**Kimden:** Tansu (ürün sahibi; metni Claude hazırladı, ürün sahibinin talimatıyla) · **Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** company-ai `feat/adim5-veri-kutuphanesi` dalı, 11.10.2026 (94 commit). Özellikle `IS_EMRI_2026-10-11C_adim5`, `IS_EMRI_2026-10-11D_adim1/4/5`, `IS_EMRI_2026-10-11B_adimE`, `ADIM5_TANSU_PR21_ISLEME_PLANI`, `SORULAR_NACIDEN_6`.

Dünkü iş için teşekkürler. Kriteri sonuçlardan önce kilitlemen, ayrı test ortamı kurman ve canlıya dokunmaman doğru yaklaşımdı. Aşağıda senden bekleyen kararlar var.

---

## 0. Özet — ne yapman gerekiyor

1. **Backend modeli:** varsayılan **Haiku + Haiku** (§1).
2. **Kriter (d) değişiyor** (§2).
3. **Öncelik sırası:** önce 500 hatası, sonra yeni kütüphane canlıya, sonra yeniden ölçüm (§3).
4. **PR #15/#16 birleşti** (12.10.2026): gerçek banka adları artık uygulanır (§4).
5. **T-14.1 = B** (PR #22'ye işlendi) (§5).
6. **3 davacı adı** (§6).
7. **Veri dondurma:** bundan sonra demo verisi için yeni soru turu yok (§8).

---

## 1. Backend modeli — karar: Haiku + Haiku (varsayılan)

İş Emri D'nin 99 soruluk ölçümü:

| | C1 Gemini | C2 Haiku/Haiku | C3 Haiku/Sonnet |
|---|---|---|---|
| Doğru | 53/99 | 60/99 | 62/99 |
| Abstention | %71,4 | %66,7 | %76,2 |
| Kritik bulgu | 1 | 1 | 0 |
| Maliyet / soru | $0 (ücretsiz kota, 26 sn pacing) | ~$0,004 | ~$0,076 |

**Gerekçe:** C3, C2'den yalnız 2 soru fazla doğru buluyor (99 soruda istatistik olarak anlamlı değil) ama ~19 kat pahalı. KOBİ fiyatlamasında soru başı 0,076 USD sürdürülebilir değil. Gemini'nin $0'ı ücretsiz kotadan geliyor ve 26 sn pacing gerektiriyor; canlı demo için kabul edilemez.

**Yapılacaklar:**
1. Canlıda `LLM_PROVIDER=anthropic`, router ve answer **Haiku**.
2. **Haiku'nun açığını hedefli kapat:** GEN-AMB-001'de Haiku belirsiz soruya kendinden emin ve yanlış cevap verdi ("vade 14 yıl"). Balbal'da en tehlikeli hata bu. Proje ekseni sınıflandırması (`classify_project_axis`) "disambiguate" dediğinde cevap üretilmesin, netleştirici soru sorulsun. Bu ilkeyi bağlamdan bağımsız olarak, genel kural şeklinde uygula.
3. **Karma yapıyı ölç (karar değil, ölçüm):** belirsiz ya da düşük eşleşmeli sorularda answer = Sonnet, diğerlerinde Haiku. Hedef, maliyetin Haiku'ya yakın, abstention ve kritik bulgunun C3'e yakın olması.
4. **Bağlamı daralt:** soru başına ~44 bin input token gidiyor. top_k ve chunk sayısını azaltmayı ve prompt caching'i ölç; maliyet her iki modelde de düşer.
5. Gemini kodu silinmez; `LLM_PROVIDER` ile geri dönülebilir kalsın.

**Anayasa:** Sağlayıcı değişikliği Ç-11(b) ve Ç-15/5 kapsamında bir dış servis kararıdır. Bu PR, Proje Yetkilisinin Kayıtlı Kanaldaki onayıdır. Madde 2'deki davranış değişikliği ise sistem promptuna dokunuyorsa Ç-15/8 kapsamındadır; kodlamadan önce kısa bir plan sun (T-9).

## 2. Kabul kriteri — (d) değişiyor

İş Emri D'nin sonucu (C2 ❌, C3 ❌) **aynen kalır**; geçmişe dönük yeniden değerlendirme yok. **Bundan sonraki model ölçümlerinde** (d) maddesi şöyledir:

- (a) güvenlik kategorilerinde soru kaybı sıfır ve kritik bulgu ≤ taban (**değişmedi**),
- (b) abstention ≥ taban (**değişmedi**),
- (c) toplam doğru ≥ taban (**değişmedi**),
- (d) **yeni:** kategori başına kayıp sınırı **kalkar**. Yerine: "tek bir belgeye/konuya yoğunlaşan kayıp ayrı bulgu olarak raporlanır, red sebebi değildir".

`document` kategorisindeki "ÇED Süreci Durum Yazısı" (IZM-DEV-002/004/005/006) kaybını **ayrı bir bulgu** olarak incele: belge metni mi zayıf, chunk'lama mı, yoksa model mi?

## 3. Öncelik sırası (bu sırayla)

1. **C1'deki 9 adet HTTP 500** (discovery/data/mixed, `unhandled_exception_handler`) düzeltilsin. Model değişikliğinden önce yapılsın.
2. **Yeni kütüphane canlı DB'ye yüklensin.** İş Emri C §5'e göre C1 başarısızlıklarının bir kısmı canlı DB'nin eski olmasından kaynaklanıyor.
3. **Model geçişi** (§1).
4. **99 soru güncel DB'de yeniden ölçülsün** (Haiku/Haiku + karma).
5. Sonra benim web test turum.

Bizim için asıl ölçü doğruluk oranı. Ledger'daki ayrıntılar bu sıranın önüne geçmesin.

## 4. PR #15 / #16 birleşti — banka adları

Anayasa v2.1 ve Ek-F, **12.10.2026'da main'e birleşti** (`3dfa650`, `4ab767b`). Ç-12 yürürlükte. `ADIM5_TANSU_PR21_ISLEME_PLANI`'nda **BEKLE** olarak işaretlenen satırlar artık uygulanır:

- PQR Bank → **Garanti BBVA** · LMN Bank → **Commerzbank AG** · DEF Bank → **Akbank** · bordro/vergi bankası **İş Bankası**.
- Karatepe teminat mektubu bankası **Garanti BBVA**.
- Sözleşme koşulları, oranlar ve tutarlar kurgusal kalır (Ç-12'nin şartı).

Güncel Anayasa'yı (`main`'deki hâli) company-ai'ye de ekle; bizim o repoya yazma yetkimiz yok.

## 5. T-14.1 — Yeşilova türbin/MW: **B**

- Faz 1: 3 türbin × **4,0 MW** = **12 MWe** (YEKDEM 01.01.2017–31.12.2026, 73 USD/MWh). Canvas aynen kalır.
- Faz 2: 2 türbin × **5,0 MW** = **+10 MWe** (PTF).
- Toplam **5 türbin, 22 MWe**. "5 × 4,4 MW" iptal.
- Faz 2 türbinleri için belgelerde yalnız "Vestas, 5,0 MW sınıfı" yazılır; model adı uydurulmaz.
- Bilinçli sapma #4, "Faz 1'de V136 4,0 MW modu" olarak okunur.
- Kontrol: 3 × 4,0 + 2 × 5,0 = 12 + 10 = 22 ✅

Çelişki bizim 6. tur notumuzdan çıktı; yakaladığın için teşekkürler.

## 6. Atlanan 3 dava dilekçesi — davacı adları (kurgusal)

| Dava | Davacı |
|---|---|
| Karatepe — Elektrik Direği İhlali (Ankara 1. Asliye Hukuk, 2026/356 E.) | **Ramazan Öztürk** (komşu parsel maliki) |
| Yeşilova — Arazi Tahsis Tazminatı (Çanakkale 1. Asliye Hukuk, 2025/208 E.) | **Hasan Çelik** (arazi maliki) |
| Yeşilova — Sınır İhlali (Çanakkale 2. Asliye Hukuk, 2026/511 E.) | **Ayşe Doğan** (komşu parsel maliki) |

Üçü de kurgusal, ürün sahibi onaylı; `AI_ASSUMPTION` gerekmez. Diğer tüm değerler PR #21 §1'deki gibi. Dava belgeleri **restricted**.

## 7. Canvas düzeltmeleri (PR #21 §3.9)

Ürün sahibi onayladı. Yayın kontrolünden geçtikten sonra canlıya ve PR #12'ye çıkacak. Yayınlanana kadar PR #21'deki değerler geçerli; senin tarafında bir iş yok.

## 8. Veri dondurma

Demo kütüphanesi için **yeni soru turu açılmıyor**. Bundan sonra eksik ya da belirsiz bir değer çıkarsa:

1. Tutarlı bir değer seç, `AI_ASSUMPTION` ile işaretle ve devam et.
2. Raporda tek satırla listele; toplu olarak sonra bakarız.

İstisna: **aritmetik çelişki** (T-14.1 gibi) ya da **kanonik bir değerle doğrudan çelişki**. Bunları sormaya devam et, ama günde en çok bir toplu tablo halinde.
