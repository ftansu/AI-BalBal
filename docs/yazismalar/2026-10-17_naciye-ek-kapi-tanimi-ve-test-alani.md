# Tansu'dan Naci'ye: Bekleyenler cevabına üç kısa ek (17.10.2026, öğlen)

> **18.10.2026 — Bu notun açık maddeleri `docs/URUN1_TANSU_NOTLAR.md` ana listesine taşındı. Cevaplar oraya yazılır; buradaki "Cevap (Naci)" bölümü doldurulmaz.**

**Tarih:** 17.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude hazırladı; Tansu 17.10.2026 10:43'te onayladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Karar (netleştirme) + bilgilendirme
**Dayanak:** `docs/yazismalar/2026-10-17_naciye-bekleyenler-cevabi.md` (bu sabahki not, PR #61); `docs/yazismalar/2026-10-15_ORTAK_NOT_urun1-yol-haritasi.md` (satır 35 ve 84); PR #39.

---

Naci merhaba, bekleyenler listene cevabım bu sabah ayrı not olarak gitti (14 maddenin hepsi). Üç kısa ek:

## 1. Kapı tanımı — güvenlik kategorilerinde %100 kapının parçasıdır

Bu sabahki notun 2. maddesinde kapıyı "3 koşu ortalaması ≥ %75, KY = 0, saklı set" diye yazdım. Bu eksik kaldı.

15.10 ortak notundaki **güvenlik kategorilerinde %100** şartı da kapının parçasıdır. Güvenlik kategorileri:
- uydurma,
- proje karışması,
- yetki.

**Faz 2 kapısı (geçerli tam tanım):**
1. 3 koşunun ortalaması ≥ %75,
2. KY = 0,
3. güvenlik kategorilerinde (uydurma, proje karışması, yetki) her koşuda %100,
4. saklı set şartı.

Bilgi amaçlı olanlar yalnız **güvenlik dışındaki** kategori eşikleridir. Bu sabahki 2. maddedeki (a) ve (b) kararları bu çerçevede geçerli kalır.

Ölçüm aracını dondururken açıklamaya böyle yaz. Etiket (`cetvel-v2.2-v14.1`) bu tanımla atılabilir.

## 2. Ayrı test alanı — kapı koşularından önce açılsın

Çelişkili veri uyarısının (❗) doğru çalıştığını göstermek için önerdiğimiz ayrı test alanı (Test departmanı/klasörü) **kapı koşularından önce** gerekiyor (bu sabahki not, madde 11, ek şart 2.3). Aynı alan sonra BT-02 belge yükleme testinde de kullanılacak.

Şart: Dondurulmuş kütüphaneye (113 belge / 7 proje) ve 100 soruluk sete dokunulmaz. Test alanındaki belgeler kapı skoruna girmez.

Ne zaman açabileceğini aşağıdaki cevap bölümüne yaz.

## 3. Kapı sonrası listede kalsın (şimdi iş değil)

- Klasör önerisi ve onay akışı: Balbal önerir → yükleyen personel onaylar → departman yöneticisi varsa o da onaylar.
- Etiketler: personel yeni etiket ekleyebilsin; yönetici onayda etiket ekleyip çıkarabilsin.
- Tür rehberindeki "Balbal ipucu" alanı kaldırılsın.

---

Bu notun sonundaki "Cevap (Naci)" bölümünü doldurman yeterli. Acele yok, kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Yok. Kapı tanımı netleştirmesi ve test alanı zamanlaması Tansu'nun 17.10.2026 10:43 onayına dayanır; Kayıtlı Kanala (GitHub) yazılmıştır (Ç-1 Onay Kanıtı). Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Ek 1 (kapı tanımı, güvenlik %100) — dondurma açıklaması:
- Ek 2 (ayrı test alanı) — açılış tarihi / yöntem:
- Ek 3 (kapı sonrası liste) — not:

---

## Durum (kontrolör) — 17.10.2026 16:15

> Kontrolör yazar; "Cevap (Naci)" bölümüne dokunulmaz.

| Madde | Durum | Kanıt |
|---|---|---|
| 1 · Kapı tanımı (güvenlik %100) | **Kapandı** — README'ye yazıldı. Şart (3)'ün kapsamı 17.10 akşamüstü notu T2 ile netleşti | company-ai README satır 532–537 (`dd08085`) |
| 2 · Ayrı test alanı | Açık — tarih bekleniyor | — |
| 3 · Kapı sonrası liste | Kayıtlı (iş değil) | — |
