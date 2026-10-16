# WhatsApp kaydı — C1 doğrulaması ve kontrolör notları

**Tarih:** 16.10.2026 (WhatsApp'ta konuşuldu, aynı gün repoya kaydedildi)
**Kimden:** Tansu (Ürün Yetkilisi) — kontrolör notları
**Kime:** Naci
**Tür:** Bilgilendirme + 2 kısa kontrol talebi (aşağıda "Naci'den beklenen")
**İlgili:** İş emri C1 (`IS_EMRI_2026-10-16C1.md`, company-ai commit `ca5d07c`), PR #37

---

## 1. C1 doğrulandı

C1 kontrolörce incelendi, kapsamına uygun.

- **Kapsam:** Yalnız `CLAUDE.md` (2 satır) ve rapor `IS_EMRI_2026-10-16C1.md`. Kod, test ve ayar dosyasına dokunulmamış.
- **Proje satırı:** Eski "Ankara RES / İzmir RES" yerine ledger'daki 7 proje yazılmış. Karatepe RES → `ANK_RES`, Kızılova RES → `IZM_RES` kodlarıyla eşlenmiş; eski dosya adları (`ankara_res.yaml`, `izmir_res.yaml`) bu sayede kafa karıştırmıyor.
- **Tarih satırı:** `DEMO_TODAY=06.10.2026`, `DEMO_MODE=true` koşuluyla (ADR-026).
- **Rakam kuralı:** Aynen duruyor (ledger'dan gelmeyen rakam uydurulmaz).

Sonuç: Claude Code her oturumda doğru demo kurgusunu okuyacak — **ana dala alındıktan sonra** (bkz. 2.2).

## 2. Kontrolör uyarıları

### 2.1 Eski kurgu kalıntıları: dokümanlar zararsız, YAML'lar değil (öncelikli)

C1 raporu şu kalıntıları "kapsam dışı, zararsız" diye bıraktı: `DOMAIN_MODEL.md`, `PHASES.md`, `SPEC_03`, `ankara_res.yaml:54`, `fx_rates.yaml:8`.

- İlk üçü doküman — gerçekten zararsız, toplu doküman temizliğine kalabilir.
- **`ankara_res.yaml:54` ve `fx_rates.yaml:8` ayar dosyası.** Kod tarafından okunuyorsa eski kurgudaki bir değer (proje adı, kur, tarih) demo ekranına sızabilir ve "ledger dışı rakam yok" kuralı sessizce delinir.

### 2.2 C1 commit'i henüz dalda

`CLAUDE.md` değişikliği ana dala geçmeden açılan Claude Code oturumları hâlâ eski Ankara/İzmir kurgusunu görür. Merge edilmesi gerekiyor.

### 2.3 Kod adı – proje adı kopukluğu (bilgi)

`ANK_RES`/`IZM_RES` eşlemesi şimdilik doğru bir köprü. Kalıcı olursa ileride yine kafa karıştırır. Toplu doküman temizliği listesine "kod adlarını yeniden adlandırma (ayrı ADR)" maddesinin eklenmesi önerilir; acelesi yok.

## 3. Naci'den beklenen

1. **2.1 için salt okuma kontrol:** `ankara_res.yaml:54` ve `fx_rates.yaml:8` runtime'da okunuyor mu, okunuyorsa değer ekranda/cevapta görünüyor mu? Kod değişikliği istenmiyor; sonucu aşağıdaki "Cevap" bölümüne bir iki satır yaz. Sorun çıkarsa düzeltme ayrı iş emriyle gelir.
2. **2.2:** C1'in ana dala alınıp alınmadığını "Cevap" bölümüne yaz.
3. **Kural (yeni):** WhatsApp'tan konuştuğumuz her şey bundan sonra `docs/yazismalar/whatsapp/` altına kaydedilecek. Kurallar klasördeki `README.md`'de. Sen de WhatsApp'tan attığın notları bu klasöre kendi dosyasıyla kaydet; bana cevabını ilgili dosyanın "Cevap" bölümüne yaz.

## 4. Bekleyenler (değişmedi)

- PR #37'deki V21 mesajına cevap: v2.1 resmî mi sayılacak, `questions.json` v14.
- Verimlilik raporuna (PR #46) geliştirici yanıtı.

Bu ikisi gelince sıradaki iş emri yazılır: 7(i) adsız sorular ya da v14 sonrası yeniden ölçüm.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- 2.1 (YAML'lar runtime'da okunuyor mu?): 16.10.2026 — backend/app bu iki YAML'ı okumuyor; yalnız seed_data/generator okuyor. ankara_res.yaml:54 bir `note` alanı (3. işletme yılı; değer hâlâ doğru). fx_rates.yaml:8 bir etiket; demo_today zaten 2026-10-06. Üretilen belgelere yazılıp yazılmadığı henüz doğrulanmadı.
- 2.2 (C1 ana dalda mı?): 16.10.2026 — Hayır. C1 (ca5d07c) feat/adim5-veri-kutuphanesi dalında; dal ana dalın 195 commit önünde. Ana dala alma planı Tansu ile konuşulacak.
- 3 (WhatsApp kayıt kuralı — okundu / itiraz): 16.10.2026 — Okundu.
- Diğer:
