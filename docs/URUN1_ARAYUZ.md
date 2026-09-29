# Ürün 1 Arayüzü — yalnızca Ürün 1 içindir

**Tarih:** 29.09.2026 · **Karar:** ürün sahibi

> **Bu arayüz yalnızca Ürün 1 içindir.** Ürün 2 ve Ürün 3'ün arayüzleri ayrıdır ve ayrı canvas'larda tasarlanır. Bu ekrana Ürün 2 veya Ürün 3 özelliği (gündem, görüş talebi, hesaplama, projeksiyon, gösterge tabloları, EPİAŞ verisi) eklenmez.

## Tasarım kaynağı

Claude Design canvas **"X Platformu — Ürün 1"** (her departman için ayrı sayfa, tek ortak şablon). Mevcut "X Platformu — Ana Sayfa" canvas'ı Ürün 1 arayüzü değildir.

## Ne zaman görünür

Şirketin paketinde **yalnızca Ürün 1 açıkken** (`enabled_products` içinde `P2` yokken; B-25) departman giriş sayfası bu ekrandır. Ürün 2 veya 3 açıkken mevcut sekmeli departman arayüzü görünür.

Not: Backend `enabled_products` alanını henüz dönmüyor; alan gelene kadar frontend yalnızca P1 varsayar. Bu yüzden web testinde (B-27) herkes bu ekranı görür. Bu, Ürün 1 testinin amacına uygundur.

## Ekran

- Üst bar: şirket, departman, belge yükle, bildirimler, kullanıcı. Üst bardaki arama bu sayfada yok, çünkü arama ortadaki Balbal çubuğudur.
- Ortada: Balbal simgesi, selamlama, **büyük Balbal çubuğu**, departmana özel örnek sorular.
- Soru sorulunca: soru ve cevaplar ortada akar, çubuk alta iner. Cevap `/api/ask`'ten gelir; kaynaklar tıklanabilir ve indirilebilir (P-4). Kaynak yoksa Balbal uydurmaz.
- Sağ altta yalnızca ekip sohbeti butonu var; ekip sohbeti Balbal'ı içermez (B-06b). Balbal butonu bu sayfada yok, çünkü Balbal ortadaki çubuktur.
- Belgeler ve Belge Yükle sayfaları mevcut ekranlarıyla açılır (`/departman/<slug>/belgeler`, `/yukle`).

## Kod

- `frontend/src/pages/urun1/Urun1Home.tsx` — ekranın kendisi
- `frontend/src/pages/department/AskTab.tsx` — P2 kapalıyken bu ekranı gösterir
- `frontend/src/pages/Department.tsx`, `frontend/src/components/Layout.tsx` — Ürün 1 giriş sayfasında başlık, sekmeler, üst arama ve Balbal butonu gizlenir
- `frontend/src/styles.css` — `.u1-*` sınıfları

**Backend'den ek bir şey beklenmiyor:** ekran mevcut `/api/ask` ucunu kullanır.
