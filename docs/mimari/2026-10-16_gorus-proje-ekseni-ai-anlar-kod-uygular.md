# Görüş Notu — Proje ekseni: "AI anlar, kod uygular"

**Tarih:** 16.10.2026 · **Hazırlayan:** Kontrolör (Ürün Yetkilileri adına) · **Durum:** Görüş notu — Ürün Yetkilisi onayıyla eklendi (16.10.2026); geliştirici görüşü bekliyor

> Bu not talimat değil, görüştür. Faz 2 kapısı ölçümü tamamlanmadan uygulanması **önerilmez**; amaç, ölçüm bittikten sonra denenecek bir deneyi şimdiden masaya koymaktır.

**İncelenen kod:** `ntoydem/company-ai`, dal `feat/adim5-veri-kutuphanesi` (16.10.2026) — `services/assist.py` (`named_project_codes`, `classify_project_axis`), `services/project_narrowing.py`, `services/router.py`, `services/ask_router.py`.

---

## 1. Kısaca

Bugün "soru hangi projeyi kastediyor?" sorusuna **kod** karar veriyor: proje adı harf eşleşmesiyle aranıyor, ad yoksa aramanın getirdiği parçaların projelere dağılımı sayılıyor. Öneri: **anlamayı** zaten çalışan yönlendirici çağrısına (AI) eklemek, **filtrelemeyi** kodda bırakmak. Ek AI çağrısı yok.

## 2. Bugünkü işleyiş (koddan)

| Adım | Nasıl | Zayıf nokta |
|---|---|---|
| Proje adı tespiti (`named_project_codes`) | Sorudaki kelimeler proje adı kelimeleriyle eşleştirilir; "RES/GES" gibi ortak ekler atılır | Kısaltma ("KRT"), SPV ticari unvanı, yazım hatası, önceki sorudan devam ("peki onun faizi?") yakalanmaz |
| Belirsizlik kararı (`classify_project_axis`) | Ad yoksa aramanın getirdiği parçalar projelere göre sayılır: ilk iki proje yakınsa → netleştirici soru; biri baskınsa → o proje varsayılır | Karar sorunun anlamına değil, **aramanın tesadüfen ne getirdiğine** bağlı. Arama kelime eşleşmesiyle çalışıyorsa (bkz. §6 soru 1) dağılım daha da rastlantısal |
| Daraltma (`narrow_allowed`, `narrow_chunks`) | Adı geçen projenin + grup belgelerinin dışındakiler aday paketinden çıkar | **Sağlam** — korunmalı |

**Olası sonuçlar:** (a) projeye bağlı olmayan soruda gereksiz "hangi proje?" sorusu; (b) baskın dağılım yüzünden yanlış projenin varsayılması; (c) kullanıcının doğal ifadesiyle (kısaltma, SPV adı, bağlam) sorduğu projenin tanınmaması.

## 3. Öneri

1. **Yönlendirici JSON'una üç alan eklenir** (aynı çağrı, ek maliyet yok):
   - `projects`: soruda kastedilen projeler (kısaltma, SPV unvanı ve `previous_question` bağlamı dahil),
   - `project_bound`: soru belirli bir projeye mi bağlı (`true` / `false`),
   - `company_level`: soru şirket geneli mi.
2. **Kod doğrular:** AI'ın döndürdüğü her proje `projects` tablosuyla ve kullanıcının görebildiği projelerle karşılaştırılır. Tanınmayan / yetkisiz değer → yok sayılır, bugünkü kod kuralına dönülür.
3. **Filtreyi kod uygular:** Daraltma bugünkü gibi `narrow_allowed` / `narrow_chunks` ile yapılır. Hangi belgenin cevap modeline gideceğine AI karar vermez.
4. **Dağılım sayımı yalnız yedek kalır:** AI `project_bound=true` dedi ama proje çıkaramadıysa netleştirici soru; `project_bound=false` ise netleştirme yapılmaz.

## 4. Korunan sınırlar

- Yetki kapısı (`allowed_document_ids`) ve "başka projenin belgesi aday paketine girmez" kuralı değişmez.
- Bilinmeyen proje adı ("Bursa RES") kontrolü kodda kalır (`route_without_llm`).
- "Politika kodda" ilkesi (Ortak Not 15.10 §5 ilke 1) korunur: AI yalnız **okur ve işaretler**, karar ve uygulama kodda.

## 5. Ölçüm önerisi (deney)

- **Zamanlama:** Faz 2 kapısı ölçümü (3 koşu) bittikten sonra.
- **Yöntem:** Bayrak arkasında (ör. `PROJECT_AXIS_LLM=true/false`) iki yöntem aynı soru setinde koşulur.
- **Ölçütler:** gereksiz netleştirme sayısı, yanlış proje varsayımı (KY), doğru proje tanıma oranı, token farkı.
- Kontrolör bağımsız ölçümünü kendi örneklemiyle ayrıca yapar (16.10 ilkesi: aynı tanımlar, ayrı yöntem).

## 6. Anayasa ilişkisi

- **Ç-7.1/1 (önce anlama kontrolü):** Öneri bu maddenin uygulamasını güçlendirir.
- **Ç-15/8:** Yönlendirici sistem promptunun değişmesi Kritik Geliştirme Kararıdır (ADT-4 döneminde de plan sunulur). Uygulamaya geçilirse önce plan, sonra Ürün Yetkilisi onayı.

## 7. Geliştiriciye sorular

1. Canlıda `EMBEDDINGS_ENABLED` açık mı? (Kapalıysa §2'deki dağılım sayımı yalnız kelime eşleşmesine dayanıyor.)
2. Yönlendirici çağrısı bugün `previous_question` bilgisini alıyor mu?
3. Bu öneride gördüğün teknik engel veya daha iyi bir yol var mı? Fikrin özellikle isteniyor.
