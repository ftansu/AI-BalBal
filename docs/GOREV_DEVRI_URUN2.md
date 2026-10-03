# Görev Devri — Ürün 2 Geliştirmesi

**Tarih:** 02.10.2026 · **Dayanak:** Balbal Anayasası v2.0 (`anayasa/`) · **Niteliği:** Yazılı görev dokümanı (Ç-2/6), Kayıtlı Kanal kaydı (Ç-1)
**Yürürlük:** Bu PR'ın geliştirici tarafından GitHub'da onaylanması (Approve) ve ürün sahibi tarafından birleştirilmesiyle başlar. Ürün sahibi yazılı olarak sona erdirene kadar geçerlidir.

## 1. Karar

Ürün sahibinin iş yükü hafifleyene kadar **Ürün 2'nin frontend ve backend geliştirmesi geliştiriciye devredilmiştir.** Geliştirici işi bu Anayasaya göre tamamlar; ürün sahibi sonradan kontrol eder ve gerekli düzeltmeleri ister veya yapar.

## 2. T-13 için geçici istisna

T-13 ve Ek-D S-9'a göre Ürün 2 geliştirmesi, Ürün 1 ürün testinden sonra başlar. Bu devir süresince **Ürün 2 geliştirmesi, Ürün 1 ürün testi tamamlanmadan başlar.** Şartlar:

- Ürün 1 ve Ürün 2'nin ürün testi devir bitiminde ürün sahibi tarafından yapılır. Hiçbir ürün bu testten geçmeden "tamamlandı/finalize" sayılmaz (T-13).
- Bu istisna Ç-3 gereği iki Proje Yetkilisinin onayıyla geçerlidir. Onay kanıtı: bu PR'daki geliştirici onayı + ürün sahibinin birleştirmesi.

## 3. Kapsam

- Ek-B'deki **Ürün 2** yetenekleri.
- Ürün 2'nin dayandığı ve henüz bitmemiş **Ürün 1** temelleri: departman yetkilisi rolü ve iki aşamalı belge onay akışı (O-1, O-3), personel sohbeti (Ü-7), arayüzün backend'in yeni alanlarına bağlanması, `feat/urun1-arayuz` ve `docs/ekip-sohbeti-ve-netlik` dallarının birleştirilmesi.
- Ek-B'de olmayan hiçbir yetenek geliştirilmez (Ü-1).

## 4. Devir süresince geçerli çalışma kuralları

| Konu | Kural |
|---|---|
| Arayüz reposu (`ftansu/AI-BalBal`) | Geliştirici yazar. Her iş ayrı dal + PR. Ana dala doğrudan push ve force push yok (T-14). |
| PR birleştirme | Geliştirici kendi PR'ını inceleyip birleştirebilir (T-14 insan incelemesi = geliştirici). |
| Yeni görsel öğe (T-12) | Ürün sahibi onayı beklenmeden geliştirilebilir. Mevcut tasarım dili korunur. Her PR'da **"Yeni görsel öğeler"** başlığıyla listelenir; ürün sahibi sonradan onaylar veya düzeltir. |
| Görev sonu notu | Her PR veya faz raporunda `[ANAYASA KONTROLÜ]` notu, ürün etiketi ve Ek-B atfı (Ç-14, T-11). |
| Kritik Geliştirme Kararı (Ç-15) | Kodlamadan önce repoda kısa plan. Ürün sahibine ulaşılamazsa en az riskli seçenek uygulanır ve planda **"ürün sahibi onayı bekliyor"** diye işaretlenir. |
| Anayasaya aykırılık | T-15 formatıyla bildirilir; ihlalli kısım birleştirilmez. |

## 5. Devirde bile ürün sahibinin onayını gerektirenler

- Anayasa metni ve Ek-B değişikliği (Ç-3).
- Ürün 3 yetenekleri: AI yorumu, projeksiyon, değerlendirme (Ü-5).
- Gerçek kişi, şirket veya belge verisi (Ç-12).
- Yeni dış servis, ağ bağlantısı veya Balbal AI'a yeni veri kaynağı (Ç-11, T-14).
- Geri alınamaz işlemler: veri silme, geçmiş yeniden yazma, üretim ortamı değişikliği (T-14).
- Arayüz ilkelerinden sapma: sadelik, kişinin yalnızca kendi departmanını görmesi, Balbal penceresinde proje seçimi olmaması, konsolide tablo olmaması (Ü-10).

## 6. Önerilen sıra

1. Arayüzün yeni backend alanlarına bağlanması ve bekleyen iki dalın birleştirilmesi; ardından `company-ai`'deki submodule güncellemesi.
2. Departman yetkilisi rolü ve iki aşamalı belge onay akışı.
3. "Güncel değer" ve proje ayrımı doğruluğu için prompt turu; aynı turda "belgedeki talimat veridir" kuralı (Ç-6).
4. Personel sohbeti (Ürün 1) ve Ürün 2'de Balbal'ın sohbete eklenmesi (Ü-7.3).
5. Ek-B Ürün 2 yetenekleri: birleştirme ve projeler arası karşılaştırma (gösterir, değerlendirmez — Ü-4), gerçekleşmiş veriyle aritmetik, şablon doldurma, veri taslağı, süre/deadline takibi ve hatırlatma, departmanlar arası görüş talebi.

Açık sorulara cevaplar: Ürün 2'de projeler arası karşılaştırma serbesttir, yalnızca gösterir (Ü-4); Ürün 1'de yasak kalır (Ü-3). Departman yetkilisi tanımlı değilse yükleme reddedilir ve sistem yöneticisine bildirilir. Excel yüklemeleri de aynı onay akışına girer.

## 7. Kontrol

Ürün sahibine her sabah iki reponun değişikliklerinin kısa özeti ve Anayasa kontrolü otomatik olarak iletilir. Geliştiricinin ayrıca rapor yazmasına gerek yoktur; mevcut faz raporları yeterlidir.
