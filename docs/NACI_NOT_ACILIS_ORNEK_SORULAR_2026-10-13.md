# Tansu'dan Naci'ye — Balbal açılışındaki örnek sorular — 13.10.2026

**Kimden:** Tansu (ürün sahibi). Metni Claude, ürün sahibinin talimatıyla hazırladı. · **Kime:** Naci ve Naci'nin AI'ı
**Ürün etiketi:** Ürün 1 · **Test ve kontrol çalışmasıyla ilgisi yoktur**; ayrı bir ürün davranışı notudur.

---

## Konu

Balbal'ın soru ekranı açılır açılmaz kullanıcıya örnek sorular öneriyor. Bunların kaldırılmasını istiyorum.

## Mantık

- **Bu karar yeni değil.** 05.10.2026'da verildi: hiçbir Balbal arayüzünde öneri çipi ya da örnek soru olmaz. Ürün 1 notu §B/6'ya da yazılmıştı. Canlı dalda (`feat/adim5-veri-kutuphanesi`) hâlâ duruyor; soru panelinde "Örnek:" satırıyla dört soru çıkıyor.
- **Neden istemiyorum:**
  - Balbal bir iş arkadaşı gibi davranmalı; iş arkadaşı size ne soracağınızı önermez.
  - Öneriler kullanıcıyı sistemin iyi bildiği sorulara yönlendirir. Bu da gerçek kullanımı ve web testinin ölçtüğü davranışı çarpıtır.
  - Mevcut örnekler eski demo adlarını taşıyor ("Ankara RES", "İzmir RES"); güncel kurgu şirket grubuyla (Karatepe, Yeşilova…) uyumsuz. Kullanıcı var olmayan projeler hakkında soru sormaya yönlendiriliyor.
- **Aynı yerde, aynı karar:** soru alanının üstündeki "Yalnızca … belgelerinde arar" açıklama metni de ekranda durmamalı (Ürün 1 notu §B/6).

## Beklenen sonuç

Soru ekranı açıldığında yalnız soru alanı ve "Sor" düğmesi görünür; örnek soru ya da açıklama metni görünmez. Nasıl kaldırılacağı sana ait.

Zamanlama: acele değil, ama web testinden (S4) önce yapılması gerekiyor. Mevcut sıraya (Excel paketi → B1′ → B2 → ölçüm) uygun düştüğü bir yerde yapabilirsin.

---

## [ANAYASA KONTROLÜ]

- **Tür:** Ürün sahibi notu; 05.10.2026 kararının hatırlatılmasıdır. Yeni karar ya da yeni yetenek getirmez.
- **Ürün etiketi:** Ürün 1 (T-11).
- **T-12:** UI öğesinin kaldırılması tasarım kararıdır ve ürün sahibi tarafından verilmiştir.
- **Kırmızı çizgiler** aynen geçerli.
