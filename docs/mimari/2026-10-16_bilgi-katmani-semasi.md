# Bilgi Katmanı Şeması — TASLAK v0.1

**Tarih:** 16.10.2026 · **Hazırlayan:** Kontrolör, ürün sahibi adına · **Durum:** Taslak; ürün sahibi onayı ve geliştirici görüşü bekliyor
**Dayanak:** Ortak Not 15.10 §4 Şart 2 ("şema kâğıtta, kodda değil"), 09.10 bağ kararı (Anayasa O-13), mimari görüş notu G-2, kanonik demo ledger (`company-ai/seed_data/master/*.yaml`, `ledger_schema.py`).

## 1. Amaç ve sınır

Frontend'in (canvas v138) dayandığı bilgi katmanını tek yerde tanımlar: hangi kayıt türleri var, hangi alanları taşır, belgeden nasıl çıkar, nasıl onaylanır, birbirine nasıl bağlanır.

- **Ürün 1'de bu şemanın kodu yazılmaz.** Ürün 1'de yazılan her şey (belge alanları, proje tablosu, etiket kataloğu, Excel manifesti, yükleme testinde çıkarılan alanlar) bu şemayla **aynı adları ve anlamı** kullanır; çelişmez.
- Mimari takipte her iş için iki soru sorulur: "skor ne?" ve "omurgayla uyumlu mu?"
- Ledger'daki demo veri bu şemanın ilk örneğidir; ledger'da olup şemada olmayan alan, şemaya eklenmeden koda girmez.

## 2. Ortak kurallar (her kayıt türü için)

| Kural | Açıklama | Ledger'daki karşılığı |
|---|---|---|
| **Kaynak** | Her olgu bir belgeye (ve mümkünse sayfa/maddeye) bağlıdır. Kaynaksız olgu kayda girmez; "bilinmiyor" olarak kalır | `source_doc`, `doc` |
| **Köken etiketi** | Kullanıcının verdiği / belgeden onaylı çıkarılan / AI taslağı (onaysız) ayrılır. AI taslağı cevapta "onaysız" diye görünür | `tag`: USER_FACT · AI_ASSUMPTION |
| **Onay** | Balbal'ın belgeden çıkardığı değer, kişi tek satırla ("Balbal tarafından doldurulan bilgilerin doğruluğunu onaylıyorum") onaylayınca kesinleşir. Balbal onaylı değeri kendisi değiştirmez (O-13/6) | — (Ürün 2) |
| **Değişen değer** | İlk değer, güncel değer ve değiştiren belge birlikte tutulur. Eski değer silinmez, "tarihsel" olur | `ChangedFact`: initial · current · changed_by |
| **Sürüm** | Belgenin yeni sürümü eskisinin yerine geçer (`supersedes`); güncel > tarihsel. Sürüm farkı çelişki değildir | `supersedes_ref`, `status: superseded` |
| **Çelişki** | İki **güncel** kaynak aynı olgu için farklı değer veriyorsa ikisi de tutulur ve kayıt "Çelişkili veri" olur; Balbal birini seçmez | `deliberate_conflict`, `conflict_group` |
| **Bağ** | Her kayıt proje · süreç adımı · yükümlülük üçlüsüne bağlanabilir; merkez yükümlülüktür. Bağ zorunlu değildir ("genel") | O-13 |
| **Kapsam** | Kayıt ya bir projeye aittir ya da grup kaydıdır (`project_scope: project / group`). Projesiz olmak eksik alan değil, açık niteliktir | `documents.project_scope` (migration 0016) |
| **Yetki** | Kayıt, kaynak belgenin departmanını ve gizlilik düzeyini miras alır. Kaynak belgeyi göremeyen, kaydı da göremez | `department`, `confidentiality` |

## 3. Kayıt türleri

Durum sütunu: **Var** = Ürün 1 kodunda karşılığı var · **Ledger** = yalnız demo veride var · **Yok** = henüz hiçbir yerde yok.

| # | Kayıt | Temel alanlar | Kaynak belge türü | Durum |
|---|---|---|---|---|
| K-1 | **Proje** | kod (ANK_RES…), ad, tür (RES/GES), SPV, aşama (geliştirme / inşaat / işletme), kurulu güç (ilk/güncel, MW/MWp), aktif/pasif | Lisans, önlisans, lisans tadili | Var (projeler tablosu; aktif/pasif onaylandı, 16.10 madde 2) |
| K-2 | **Taraf** | ad, tür (banka, EPC, OEM, sigortacı, kamu kurumu, malik, avukat), ilişkili projeler | Sözleşmeler, yazışmalar | Ledger (`parties`) |
| K-3 | **Belge** | kimlik, başlık, tür, departman, gizlilik, kapsam, proje, belge/yürürlük tarihi, durum, sürüm zinciri, etiketler | — | Var |
| K-4 | **Sözleşme** | tür (kredi, EPC, O&M, PPA, sigorta…), taraflar, imza ve yürürlük tarihi, bitiş, tutar, para birimi, tadil zinciri | Sözleşme ve tadiller | Ledger (`facility_chain`, `epc`) |
| K-5 | **Yükümlülük** *(merkez)* | konu, dayanak madde (sözleşme + madde no), son tarih veya periyot, sorumlu departman, tutar, durum (bağlı olaylardan hesaplanır) | Sözleşmeler | Yok |
| K-6 | **Kredi** | sözleşme, banka, tutar, faiz bazı + marj (değişen değer), vade, ödemesiz dönem, geri ödeme profili, DSRA şartı, DSCR eşiği | Kredi sözleşmesi, tadiller | Ledger (`finance`) |
| K-7 | **Taksit** | kredi, taksit no, vade, anapara, faiz, durum (ödendi / bekliyor), kaynak plan sürümü | Ödeme planı (Excel), banka bildirimi | Ledger + Excel |
| K-8 | **Covenant testi** | kredi, dönem (Q_YYYY), değer, sonuç (geçti/kaldı), feragat (waiver) | Covenant raporu, waiver mektubu | Ledger + Excel |
| K-9 | **Hesap bakiyesi** | hesap türü (DSRA, borç servis…), tarih, bakiye, para birimi | Banka ekstresi | Ledger |
| K-10 | **Süreç adımı** | proje, adım (önlisans, ÇED, imar, TEA, askeri görüş, bağlantı, lisans, yapı ruhsatı, COD…), durum (tamamlandı / bekliyor), tarih, sıradaki beklenen olay | İzin ve kurum yazıları | Ledger (`timeline`, `development`) |
| K-11 | **Dava** | proje, mahkeme, esas no, taraflar, konu, talep tutarı, durum, sonraki duruşma | Dilekçe, savunma, ara karar, bilirkişi | Ledger (`legal_case`) |
| K-12 | **Teminat ve poliçe** | tür (teminat mektubu, sigorta poliçesi, kefalet), no, veren (banka/sigortacı), tutar, bitiş tarihi | Mektup, poliçe, zeyilname | Ledger (`guarantee_letters`) |
| K-13 | **Gerçekleşen veri** | proje, dönem, ölçü (üretim MWh, kullanılabilirlik, bütçe/gerçekleşen, CFADS, DSCR) | Excel (salt okunur tablo) | Var (Excel hattı) |
| K-14 | **Olay** | tarih, tür (arıza, kesinti, ödeme, karar, yazı…), proje, açıklama; bağ üzerinden süreç adımı/yükümlülüğe bağlanır | Raporlar, yazışmalar, banka hareketi | Ledger (`incidents`) |

## 4. Belgeden kayda akış (hedef, Ürün 2)

1. Belge yüklenir → Balbal türünü, projesini ve departmanını önerir; kişi onaylar (bugünkü yükleme akışı).
2. Balbal belge türüne göre kayıt alanlarını çıkarır (ör. kredi sözleşmesi → K-6; ödeme planı → K-7 satırları) → **AI taslağı**.
3. Kişi tek satırla onaylar → kayıt kesinleşir, köken etiketi "belgeden onaylı" olur.
4. Mevcut kayıtla karşılaştırma: aynı olgu farklıysa ve yeni belge eskisinin sürümüyse → değişen değer; değilse → "Çelişkili veri" ve kişiye yazılı soru (13.10 kararı).
5. Bağ önerisi (proje · süreç adımı · yükümlülük) aynı onay satırıyla.

## 5. Ürün 1'de bugünden uyum gereken yerler

| Yer | Ne yapılmalı | Sahibi |
|---|---|---|
| Projeler tablosu | K-1 alan adlarıyla; aktif/pasif niteliği (TEST_PRJ işi) | Geliştirici |
| `documents.project_scope` | K-3 "kapsam" kuralıyla aynı anlam (yapıldı) | — |
| Etiket kataloğu | Kimlik etiketleri K-1 proje kodu ve kayıt türü adlarıyla tutarlı (`#karatepe-res #kredi #tadil`) | Ürün sahibi + geliştirici |
| Excel manifesti | Workbook türleri K-7, K-8, K-13 adlarıyla (Repayment Schedule → Taksit) | Geliştirici |
| Router ipucu (16.10 madde 12) | Ödeme planı sözcükleri K-7 dilinden (taksit, anapara, vade) | Geliştirici |
| BT-02 yükleme testi | Çıkarılan alanlar bu tablodaki adlarla raporlanır | Kontrolör |
| Puanlayıcı | "Çelişkili veri" ve "tarihsel" kuralları §2 ile aynı | Geliştirici + kontrolör |

## 6. Açık sorular

1. **Ürün sahibine:** K-5 Yükümlülük merkez kayıt olarak doğru mu, yoksa başlangıçta K-6 Kredi ve K-11 Dava gibi somut türlerle mi başlanmalı?
2. **Ürün sahibine:** Hukuk departmanının 25 belgesinden 18'i "restricted"; Hukuk çalışanı dava kayıtlarını (K-11) göremiyor. Dava kaydının gizlilik düzeyi kaynak belgeden miras mı alınsın, yoksa Hukuk için ayrı mı tanımlansın?
3. **Geliştiriciye:** Bu kayıt türleri bugünkü veri modeline (documents, chunks, projects, Excel tabloları) hangi sırayla ve hangi maliyetle eklenebilir? Ürün 1'i bozmadan hazırlık olarak yapılabilecek bir şey var mı (ör. alan adlarının sabitlenmesi)?
4. **Geliştiriciye:** Ledger şeması (`ledger_schema.py`) bu tablonun doğrudan atası mı olmalı, yoksa demo verisi olarak ayrı mı kalmalı?
