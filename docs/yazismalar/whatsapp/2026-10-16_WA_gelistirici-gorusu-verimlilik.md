# WhatsApp kaydı — AI verimlilik raporu: geliştirici görüşü

**Tarih:** 16.10.2026 (WhatsApp'tan Word olarak gönderildi; aynı gün repoya kaydedildi)
**Kimden:** Naci (geliştirici tarafı)
**Kime:** Tansu (Ürün Yetkilisi)
**Tür:** Görüş notu (talimat değil)
**İlgili:** PR #46 (AI verimlilik raporu), `Balbal_Gelistirici_Gorusu_Verimlilik_Raporu_2026-10-16.docx`

---

# Backend geliştirici görüşü — AI Kullanım Verimliliği Raporu

Rapor c074159 sürümünü incelemiş. T2, T3 ve V21 sonrası bazı bulgular eskidi.

## Rapordan sonra değişenler
- Harf katlama yapıldı (T3, ADR-033): "Kizilova"/"kizilova", büyük-küçük harf, ASCII yazım, RES/GES/santral son ekleri, kelime sınırı.
- Var mı / nerede / neler kalıpları daraltıldı (A2L3): 99 sorunun 22'si yerine 15'i bu yola giriyor.
- Pasif proje (TEST_PRJ) artık eşleşmiyor.
- Kayıp hunisi T3'ten önce ölçüldü; proje ekseni kayıplarının (13) bir kısmı kapanmış olabilir. Yeniden ölçmeden söylenemez.
- V21 bitti: puanlayıcı v2.1 (773b3a4). Resmî M1 71/99 aynı; v2.1 referansı M1 69/99, S3r 69/99; kontrolör uyumu 15/20.

## Yedi soruya cevap
1. Paralel yol: Teknik olarak uygun. Belge, proje, sürüm zinciri ve yetki modeli araçları taşır; yetki filtresi sorgu katmanında. Engel yok. İş büyük: araç katmanı, döngü sınırı, adım başına log. Ayrı ortamda (company-ai-eval) denenmeli.
2. Dalga 1: Harf katlama yapıldı. Kalıp kararlarının AI'a devri ADR-032'yi tersine çevirir (maliyet ve tekrarlanabilirlik için kodla karar), mümkün ama router promptu değişikliği Ç-15/8 kapsamında, önce plan, sonuç ölçülmeli. Anlamsal arama: madde 3. Red yerine kaynaklı cevap: orta büyüklükte, ürün davranışı kararı Ürün Yetkilisinin. Hunisiyle büyük ölçüde uyuşuyor; sayılar T3 sonrası yeniden ölçülmeli.
3. Anlamsal arama: EMBEDDINGS_ENABLED=false canlıda. Açmak için bge-m3 servisi (bellek/süre), chunk'ların yeniden vektörlenmesi ve açık/kapalı kalite ölçümü gerekir. Henüz ölçülmedi, rakam yok. Yeni bağımlılık: Ç-15/5 ve Ç-11 onayı. Kapı ölçümü sürerken canlıda açılmamalı.
4. V0 kuralları: CLAUDE.md eski demo sabitleri güncellendi (C1). "Otonom ajan yok", "LLM'in yazdığı Python çalıştırılmaz", "yorum yok" V0 için doğru; Ürün 2-3 için ADT ile yeniden yazılmalı (ADT-4 bitene kadar yürürlükte).
5. Maliyet: Bugünkü ölçüm soru başına yaklaşık 0,004 USD; raporun bugünkü mimari için ayda 60-85 USD tahmini buna uyuyor. Planlanan mimarinin 2.300-7.100 USD/ay rakamı tahmin, ölçümü yok. Departman bazlı bütçe tavanı iyi fikir.
6. Sorumluluk şemaları: "AI önerir, kod sınırı tutar, kişi onaylar" ilkesine katılıyorum. Şemaların adım adım kod karşılığı henüz doğrulanmadı.
7. Daha iyi yol: Rapordaki sıra doğru: Faz 2 kapı ölçümü bozulmadan bitsin, sonra Dalga 1 tek iş paketi, sonra 2×2 testi. Eklemem: Dalga 1'den önce T3 sonrası huni yeniden ölçülsün.

## Karar noktaları
1. Dalga 1 ne zaman: (b) kapı koşuları biter bitmez.
2. 2×2 teşhis testi: Evet (yaklaşık 25 USD makul).
3. Ürün 2 mimarisi gündemi: Evet; ADT taslağını Tansu hazırlasın.
4. Ürün 3 hazırlık sırası: Uygun; Ürün 2 kapısından sonra.
5. CLAUDE.md sabitleri: Güncellendi (C1, ca5d07c).

## Ölçülenler ve ölçülmeyenler
- Doğrulanan: harf katlama (T3), daralan kalıplar (A2L3), soru başı maliyet ~0,004 USD, EMBEDDINGS_ENABLED=false, Excel 1×1 sınırı, tek çağrılık mimari.
- Ölçülmeyen: embedding bellek/süre/kalite etkisi, ajan mimarisinin gerçek maliyeti ve gecikmesi, T3 sonrası kayıp hunisi, Ek A şemalarının kod karşılığı.

---

## Cevap (Tansu)

> Bu bölüme Tansu yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.
