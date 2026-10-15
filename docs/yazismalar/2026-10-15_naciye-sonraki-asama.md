# Naci'ye not — Sonraki aşama (Faz 0 + Aşama 2 sonrası)

**Tarih:** 15.10.2026
**Kimden:** Tansu (Ürün Yetkilisi)
**Kime:** Naci
**Tür:** Yönlendirme (talimat)

---

Naci, bugünkü iş çok iyi, eline sağlık. Proje karışmasını kapatmak en büyük düğümdü. Aşama 3'e geçmeden önce aşağıdakileri netleştirelim.

## 1. Canlıya alma

- DB yedeğinden **geri yüklemeyi bir kez gerçekten dene**. Yedeğin alınmış olması yetmez, geri döndüğü görülmeli.
- Şema değişikliğinin **geri alma adımını** yazılı bırak.

## 2. Faz 0 tablosu (yarın Tansu inceleyecek)

- Puanlayıcıda değiştirilen 5 kuralı **tek tabloda** topla:

  | # | Eski kural | Yeni kural | Etkilenen sorular | Puan farkı |
  |---|---|---|---|---|

- Puanlayıcının **fazla cömert** davrandığı yer var mı, ona da bak. Şu anki düzeltmelerin hepsi puanı yukarı çekiyor. Gerçek bir ölçüm hatası iki yönde de çıkar.

## 3. Proje filtresi kontrolleri

- **Etiketsiz ya da şüpheli etiketli belgeler:** sayı ve liste. Etiketleme nasıl yapıldı, elle mi otomatik mi? Yanlış etiketli bir belge artık hiç görünmeyecek; bu, karışmadan daha sinsi bir hata.
- **Grup belgeleri** (garanti, teminat vb.): proje sorusunda hâlâ geliyor mu?
- **Alias tablosu:** "Karatepe RES", "Karatepe A.Ş.", Türkçe karakter ve yazım farkları yanlışlıkla "proje yok" diye reddedilmesin.

## 4. Adsız sorular — karar

- Proje adı geçmiyorsa cevap **proje proje ayrı** verilsin. Konsolide sonuç yalnızca açıkça istenirse üretilsin.
- Kapsam belirsizse sistem tek cümleyle **"hangi proje?"** diye sorsun.
- Bu karar 10.10.2026 kararıyla uyumlu: belge arıyorsa proje başlıklı gruplu liste, değer soruyorsa tek netleştirici soru.

## 5. Faz 2 kapısı — değişiklik

- Tek koşu yerine **3 koşunun ortalaması** alınacak.
- Ek olarak Tansu'nun hazırlayacağı **15–20 soruluk saklı bir set** olacak. Bu set geliştiriciyle paylaşılmayacak.
- **Kapı:** ortalama ≥ %75, KY = 0 ve saklı sette ciddi düşüş olmaması.

## Sıra

1. Canlıya alma (madde 1)
2. Madde 2 ve 3 → yarın Tansu'ya **tek sayfa**
3. Ardından Aşama 3

Yarın Faz 0 tablosu ve saklı set üzerinden karar verilecek.
