"""BT-01 test raporunu (PDF) sonuclar.json'dan üretir. Kullanım: python3 rapor_olustur.py"""
import json, os, statistics
from collections import Counter, defaultdict
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, NextPageTemplate, KeepTogether)

HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, "BT-01_sonuclar.json"), encoding="utf-8"))
R = D["sonuclar"]
OUT = os.path.join(HERE, "BT-01_Balbal_Urun1_Test_Raporu_2026-10-13.pdf")

FD = "/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont("DV", FD + "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DVB", FD + "DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DVC", FD + "DejaVuSansCondensed.ttf"))
pdfmetrics.registerFont(TTFont("DVCB", FD + "DejaVuSansCondensed-Bold.ttf"))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily("DV", normal="DV", bold="DVB", italic="DV", boldItalic="DVB")
registerFontFamily("DVC", normal="DVC", bold="DVCB", italic="DVC", boldItalic="DVCB")

INK = colors.HexColor("#1F2933"); MUTED = colors.HexColor("#616E7C"); LINE = colors.HexColor("#CBD2D9")
ACC = colors.HexColor("#1D4E89"); BG = colors.HexColor("#F2F4F7")
C_OK = colors.HexColor("#DDF3E4"); C_KI = colors.HexColor("#FFF1CC"); C_BU = colors.HexColor("#FDE2CF"); C_KY = colors.HexColor("#F9D0D0")
PCOL = {"OK": C_OK, "KISMI": C_KI, "BULAMADI": C_BU, "KY": C_KY}
PLBL = {"OK": "Doğru", "KISMI": "Kısmi", "BULAMADI": "Bulamadı", "KY": "Kendinden emin yanlış"}

def st(name, **kw):
    base = dict(fontName="DV", fontSize=9.5, leading=13.5, textColor=INK, spaceAfter=4)
    base.update(kw); return ParagraphStyle(name, **base)
H1 = st("h1", fontName="DVB", fontSize=15, leading=19, textColor=ACC, spaceBefore=6, spaceAfter=8, keepWithNext=1)
H2 = st("h2", fontName="DVB", fontSize=11.5, leading=15, textColor=INK, spaceBefore=8, spaceAfter=5, keepWithNext=1)
P = st("p"); PS = st("ps", fontSize=8.5, leading=11.5, textColor=MUTED)
B = st("b", leftIndent=12, bulletIndent=2)
T = st("t", fontName="DVC", fontSize=7.6, leading=9.6, spaceAfter=0)
TB = st("tb", fontName="DVCB", fontSize=7.6, leading=9.6, spaceAfter=0)
TT = st("tt", fontName="DV", fontSize=8.6, leading=11.2, spaceAfter=0)
TTB = st("ttb", fontName="DVB", fontSize=8.6, leading=11.2, spaceAfter=0)

def para(t, s=P): return Paragraph(t, s)
def bullets(items): return [Paragraph(i, B, bulletText="•") for i in items]

def tbl(rows, widths, head=True, style=TT, hstyle=TTB, extra=None):
    data = [[c if not isinstance(c, str) else Paragraph(c, hstyle if (head and i == 0) else style) for c in r]
            for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    s = [("GRID", (0, 0), (-1, -1), 0.4, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
         ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
         ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    if head: s.append(("BACKGROUND", (0, 0), (-1, 0), BG))
    if extra: s += extra
    t.setStyle(TableStyle(s)); return t

# ---------- metrics ----------
N = len(R); cnt = Counter(r["puan"] for r in R)
groups = ["Genel", "Belge-direkt", "Belge-dolaylı", "Excel-direkt", "Excel-dolaylı"]
gc = defaultdict(Counter)
for r in R: gc[r["grup"]][r["puan"]] += 1
first503 = sum(1 for r in R if r["http1"] == 503)
excelq = [r for r in R if r["grup"].startswith("Excel")]
router_ok = sum(1 for r in excelq if r["qt"] in ("DATA_QUERY", "MIXED_QUERY"))
ms = [r["ms"] for r in R]
doc_tin = [r["tin"] for r in R if r["qt"] == "DOCUMENT_QUERY"]
dat_tin = [r["tin"] for r in R if r["qt"] == "DATA_QUERY"]
pct = lambda a, b: f"%{100*a/b:.0f}"

# ---------- page decor ----------
def deco(c, doc):
    c.saveState(); c.setFont("DV", 7.5); c.setFillColor(MUTED)
    w, h = doc.pagesize
    c.drawString(15*mm, 9*mm, "Balbal Ürün 1 — Test Raporu BT-01 · Soru seti QS-v1 · 13.10.2026")
    c.drawRightString(w - 15*mm, 9*mm, f"Sayfa {doc.page}")
    c.setStrokeColor(LINE); c.line(15*mm, 12*mm, w - 15*mm, 12*mm); c.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=15*mm, bottomMargin=17*mm,
                      title="BT-01 Balbal Ürün 1 Test Raporu", author="Claude (test ve kontrol)", subject="Balbal Ürün 1 kabul/gerileme testi")
pw, ph = A4; lw, lh = landscape(A4)
doc.addPageTemplates([
    PageTemplate("p", [Frame(15*mm, 17*mm, pw - 30*mm, ph - 32*mm, id="f")], onPage=deco),
    PageTemplate("l", [Frame(12*mm, 17*mm, lw - 24*mm, lh - 30*mm, id="fl")], onPage=deco, pagesize=landscape(A4)),
])
W = pw - 30*mm
S = []

# ---------- 1. Kapak + özet ----------
S += [para("Balbal Ürün 1 — Kabul ve Gerileme Testi", st("ct", fontName="DVB", fontSize=20, leading=25, textColor=ACC)),
      para("Test No: <b>BT-01</b> &nbsp;·&nbsp; Soru seti: <b>QS-v1</b> (45 soru) &nbsp;·&nbsp; Test tarihi: <b>13.10.2026</b> &nbsp;·&nbsp; Demo tarihi: 06.10.2026", P),
      para("Hazırlayan: Claude — yazılım test ve kontrol rolü, ürün sahibi Tansu için. Bu rapor, sonraki koşularda aynı soruların sorulup gelişmenin ölçüleceği <b>taban (baseline)</b> kayıttır.", PS),
      Spacer(1, 6)]

S.append(para("1. Yönetici özeti", H1))
kpi = [["Gösterge", "BT-01 sonucu", "Ürün 1 hedefi"],
       ["Doğru cevap", f"{cnt['OK']}/{N} ({pct(cnt['OK'], N)})", "≥ %75"],
       ["Kendinden emin yanlış (KY)", f"{cnt['KY']}", "0"],
       ["Bulamadı (bilgi varken)", f"{cnt['BULAMADI']} ({pct(cnt['BULAMADI'], N)})", "≤ %10"],
       ["Kısmi", f"{cnt['KISMI']}", "—"],
       ["Excel sorularında doğru yol (router)", f"{router_ok}/{len(excelq)} ({pct(router_ok, len(excelq))})", "≥ %90"],
       ["İlk denemede servis hatası (503), 0,8 sn aralık", f"{first503}/{N} ({pct(first503, N)})", "≤ %5"],
       ["Ortalama cevap süresi", f"{statistics.mean(ms)/1000:.1f} sn", "≤ 5 sn"]]
S.append(tbl(kpi, [W*0.48, W*0.27, W*0.25], extra=[("BACKGROUND", (1, 2), (1, 2), C_KY), ("BACKGROUND", (1, 6), (1, 6), C_KY)]))
S.append(Spacer(1, 6))
S.append(para("<b>Karar: Ürün 1 kabul kriterlerini karşılamıyor.</b> Doğruluk hedefin 11 puan altında; kırmızı çizgi 2 (kendinden emin yanlış cevap) 4 kez ihlal edildi; servis aynı anda gelen birkaç soruda çöküyor.", P))
S.append(para("Öne çıkanlar", H2))
S += bullets([
    "<b>Belgeden okuma güçlü:</b> Belge sorularında 20'de 17 doğru; kelimeler değiştirildiğinde bile (dolaylı grup) 10'da 9.",
    "<b>Excel'den dolaylı sorular zayıf:</b> 10'da 3 doğru. Yanlış satır seçimi (E1), yanlış kavram (E6) ve uydurulmuş para birimi (E5).",
    "<b>Genel/şirket düzeyi sorular zayıf:</b> \"Hangi projelerimiz var?\" sorusuna 7 projeden 2'si, tam liste gibi sunuldu (G1).",
    "<b>Göreli zaman mantığı yok:</b> \"geçen ay\", \"bir sonraki\", \"önümüzdeki iki hafta\" sorularının hepsi yanlış ya da eksik (E1, E10, G5).",
    "<b>Servis kararlılığı:</b> 0,8 sn aralıkla gönderilen 45 sorunun 27'si \"Yapay zeka servisi geçici olarak kullanılamıyor\" (HTTP 503) aldı; 8 sn aralıkla hepsi geçti.",
])

# ---------- 2. Ortam ----------
S.append(para("2. Test ortamı ve yapılandırma", H1))
o = D["ortam"]
env = [["Kalem", "Değer"], ["Adres", o["adres"]], ["Kullanıcı", o["kullanici"] + " — yetki testi bu koşuda yok"],
       ["Demo bugünü", "06.10.2026 (sistem ayarı)"], ["Model", o["model"]], ["Bayraklar", o["bayraklar"]],
       ["Kod / süreç", o["kod"]], ["Kütüphane", f"{o['belge_sayisi']} belge (106 PDF + 7 Excel), veritabanında {o['proje_sayisi_db']} proje"],
       ["Yürütme", o["yontem"]], ["Saat", D["saat_araligi"]]]
S.append(tbl(env, [W*0.22, W*0.78]))
S.append(para("Not: Model ve bayraklar canlı backend'in 12.10.2026 geri dönüş (K-B1R) durumundan alınmıştır; cevaplardaki <i>model</i> alanı her soruda <b>gemini-3.5-flash-lite</b> olarak doğrulandı.", PS))

# ---------- 3. Yöntem ----------
S.append(PageBreak()); S.append(para("3. Yöntem", H1))
S.append(para("3.1 Soru seti QS-v1 (dondurulmuş)", H2))
S.append(tbl([["Grup", "Adet", "Amaç"],
              ["Genel (G1–G5)", "5", "Şirket düzeyinde bilgi: proje listesi, işletmedeki santraller, bankalar, davalar, yaklaşan tarihler"],
              ["Belge-direkt (B1–B10)", "10", "Belgedeki terimleri aynen kullanan, tek değerli, net sorular"],
              ["Belge-dolaylı (C1–C10)", "10", "Aynı türde bilgi; anahtar kelime kullanılmadan, gündelik dille"],
              ["Excel-direkt (D1–D10)", "10", "Dosya/sayfa/dönem adı verilen basit sayısal sorular"],
              ["Excel-dolaylı (E1–E10)", "10", "Excel'de cevabı olan, anahtar kelimesiz sorular (göreli zaman, kavram eşleme, basit toplama dahil)"]],
             [W*0.25, W*0.08, W*0.67]))
S.append(para("Beklenen cevaplar, canlıya yüklenen kütüphanenin kaynağı olan company-ai deposundaki ledger (<i>seed_data/master</i>) ve Excel dosyalarından (<i>seed_data/excel</i>) çıkarıldı; belge listesi canlı sistemden (113 belge) teyit edildi. B4'te beklenen para birimi ledger'a göre EUR'dur.", P))
S.append(para("3.2 Puanlama kuralı", H2))
S.append(tbl([["Puan", "Tanım", "Ağırlık"],
              ["Doğru", "Doğru değer + doğru birim/tarih + geçerli kaynak. Biçim kusuru (\"%2.9\", \"98000\") puanı düşürmez, ayrıca kayda geçer.", "1"],
              ["Kısmi", "Çekirdek doğru ama eksik kalem, yanlış birim, tekrar ya da kapsam hatası.", "0,5 (yalnız bileşik skorda)"],
              ["Bulamadı", "Kaynakta olan bilgiye \"bulamadım\" dedi. Güvenli ama işlevsiz.", "0"],
              ["Kendinden emin yanlış (KY)", "Yanlış bilgiyi doğruymuş gibi verdi ya da eksik listeyi tam gibi sundu. Kritik; kırmızı çizgi 2.", "0 ve ayrı sayılır"]],
             [W*0.22, W*0.6, W*0.18],
             extra=[("BACKGROUND", (0, 1), (0, 1), C_OK), ("BACKGROUND", (0, 2), (0, 2), C_KI), ("BACKGROUND", (0, 3), (0, 3), C_BU), ("BACKGROUND", (0, 4), (0, 4), C_KY)]))
S.append(para("Ana gösterge <b>Doğru oranı</b>dır. <b>Bileşik skor</b> = (Doğru + 0,5 × Kısmi) / 45. Bir cevap hem eksik hem tam gibi sunulmuşsa (G1) KY sayılır.", P))

# ---------- 4. Sonuçlar ----------
S.append(para("4. Sonuçlar", H1))
rows = [["Grup", "Doğru", "Kısmi", "Bulamadı", "KY", "Doğru oranı"]]
for g in groups:
    c = gc[g]; n = sum(c.values())
    rows.append([g, str(c["OK"]), str(c["KISMI"]), str(c["BULAMADI"]), str(c["KY"]), pct(c["OK"], n)])
rows.append(["<b>Toplam</b>", f"<b>{cnt['OK']}</b>", f"<b>{cnt['KISMI']}</b>", f"<b>{cnt['BULAMADI']}</b>", f"<b>{cnt['KY']}</b>", f"<b>{pct(cnt['OK'], N)}</b>"])
S.append(tbl(rows, [W*0.3] + [W*0.14]*5))
bil = (cnt["OK"] + 0.5*cnt["KISMI"]) / N
S.append(Spacer(1, 4))
tr = lambda v, d=1: f"{v:,.{d}f}".replace(",", "X").replace(".", ",").replace("X", ".")
S.append(para(f"Bileşik skor: <b>{tr(bil*100)}</b>. Ortalama süre {tr(statistics.mean(ms)/1000, 2)} sn (en uzun {tr(max(ms)/1000)} sn). Ortalama giriş tokenı: belge yolu {tr(statistics.mean(doc_tin), 0)}, Excel yolu {tr(statistics.mean(dat_tin), 0)}.", P))

M_HEAD = para("4.1 Ek gösterge tanımları ve BT-01 değerleri", H2)
excel_cell_ok = sum(1 for r in R if r["qt"] == "DATA_QUERY" and r["puan"] == "OK")
data_total = sum(1 for r in R if r["qt"] == "DATA_QUERY")
fmt_issue = ["C2", "D4", "D7", "D10"]
S.append(KeepTogether([M_HEAD, tbl([["Kod", "Gösterge", "Nasıl ölçülür", "BT-01"],
              ["M1", "Doğru oranı", "Doğru / 45", pct(cnt["OK"], N)],
              ["M2", "KY sayısı", "Kendinden emin yanlış adedi", str(cnt["KY"])],
              ["M3", "Bulamadı oranı", "Bulamadı / 45", pct(cnt["BULAMADI"], N)],
              ["M4", "Router isabeti", "Excel gruplarında DATA/MIXED yoluna giden / 20", f"{router_ok}/20"],
              ["M5", "Excel yolu isabeti", "DATA_QUERY cevaplarından doğru olan / DATA_QUERY", f"{excel_cell_ok}/{data_total}"],
              ["M6", "İlk deneme 503", "Tur-1 (0,8 sn aralık) 503 / 45", f"{first503}/45"],
              ["M7", "Tekrar sonrası 503", "Tur-2 sonunda hâlâ hata", "0/45"],
              ["M8", "Göreli zaman soruları", "E1, E10, G5 doğru adedi", "0/3"],
              ["M9", "Biçim kusuru", "Doğru ama ham biçim (nokta-virgül, ham tarih, birimsiz)", f"{len(fmt_issue)} ({', '.join(fmt_issue)})"],
              ["M10", "Ortalama süre", "Başarılı cevap süresi ortalaması", f"{statistics.mean(ms)/1000:.1f} sn"]],
             [W*0.08, W*0.22, W*0.5, W*0.2])]))

# ---------- 5. Detay (yatay) ----------
S.append(NextPageTemplate("l")); S.append(PageBreak())
S.append(para("5. Soru bazında sonuçlar", H1))
LW = lw - 24*mm
cw = [LW*0.045, LW*0.2, LW*0.17, LW*0.25, LW*0.085, LW*0.17, LW*0.08]
det = [["ID", "Soru", "Beklenen", "Balbal'ın cevabı", "Yol / deneme", "Not", "Puan"]]
ex = []
for i, r in enumerate(R, start=1):
    qt = {"DOCUMENT_QUERY": "Belge", "DATA_QUERY": "Excel", "MIXED_QUERY": "Karma"}.get(r["qt"], r["qt"])
    det.append([r["id"], r["soru"], r["beklenen"], r["cevap"], f"{qt} · {r['deneme']}. deneme", r["not"] or "—", PLBL[r["puan"]]])
    ex.append(("BACKGROUND", (6, i), (6, i), PCOL[r["puan"]]))
S.append(tbl(det, cw, style=T, hstyle=TB, extra=ex))
S.append(Spacer(1, 4))
S.append(para("Yol: Balbal'ın soruyu yönlendirdiği hat (Belge = DOCUMENT_QUERY, Excel = DATA_QUERY, Karma = MIXED_QUERY). Deneme: Tur-1'de 503 alan sorular Tur-2'de tekrarlandı; 2. ya da 3. deneme sonucu puanlandı.", PS))
S.append(NextPageTemplate("p")); S.append(PageBreak())

# ---------- 6. Bulgular ----------
S.append(para("6. Bulgular ve kök neden değerlendirmesi", H1))
finds = [
 ("F1 · Kritik", "Kendinden emin yanlış cevaplar (G1, E1, E6, E8)",
  "E1: \"geçen ay\" için Haziran 2026 satırı (10.951 MWh) seçildi; Eylül verisi yok, son veri Ağustos 13.538. E6: öz kaynak (6.400.000 USD) yerine 11 çeyreklik ortağa dağıtılan nakit sıralandı. E8: Excel'e bakılmadan belgeden Mart 2026 dendi; doğrusu Aralık 2023. G1: 7 projeden 2'si tam liste gibi verildi.",
  "Excel yolunda rakamı model ham tablodan seçiyor (J §3a ile aynı kök neden). Proje listesi proje kaydından değil belge parçalarından üretiliyor. Bu iki konu 11. tur Excel paketi ve önerilen \"uzman araçlar\" kapsamında."),
 ("F2 · Kritik", "Servis kararlılığı: 27/45 ilk denemede 503",
  "İlk 8 soru geçti, ardından bloklar halinde 503 geldi (18 + 14 ardışık). 8 sn aralıkla tekrarda 25'i 1. tekrarda, 2'si 2. tekrarda geçti.",
  "Hipotez: model sağlayıcısının dakikalık istek sınırı (her soru en az 2 model çağrısı yapıyor). Birkaç kullanıcı aynı anda sorduğunda canlıda hata görülür. Doğrulama Naci'nin logunda."),
 ("F3 · Yüksek", "Router Excel sorularını kaçırıyor (6/20)",
  "D3 (Temmuz 2024 kullanılabilirlik), D8 (dosya ve sayfa adı verilmiş Capex), E7 (bütçe aşımı), E8, E9 belge yoluna gitti ve \"bulamadım\" ya da yanlış cevap döndü.",
  "Router kararı Excel kataloğunu bilmiyor; belge yoluna düşünce Excel'e hiç bakılmıyor. MIXED yolu daha güvenli varsayılan olabilir."),
 ("F4 · Yüksek", "Göreli zaman mantığı yok (E1, E10, G5)",
  "\"Geçen ay\", \"bir sonraki ödeme\", \"önümüzdeki iki hafta\" soruları demo bugününe (06.10.2026) göre hesaplanmıyor. D10'da aynı Yeşilova taksiti bulunurken E10'da \"bulamadım\" dendi.",
  "Tarih filtreli seçim (bugünden sonraki ilk satır, önceki ay) kodla yapılmalı; model tahminine bırakılmamalı."),
 ("F5 · Orta", "Bilgi belgede varken \"bulamadım\" (B1, C1, B7)",
  "Karatepe kredi tutarı (14.000.000 USD) iki farklı sorulduğunda da bulunamadı; Kızılova kullandırım şartı bulunamadı.",
  "B1/C1: 6 halkalı sözleşme sürüm zinciri (Draft, V01, V02, FA, Amendment 01/02) aramayı dağıtıyor olabilir. B7: Türkçe soru (kullandırım) ile İngilizce metin (drawdown / utilization) eşleşmiyor; sözlük genişletmesi gerekli."),
 ("F6 · Orta", "Birim ve biçim",
  "E5'te USD tutar EUR olarak verildi (uydurulmuş birim). D4 birimsiz; C2/D7 ondalık nokta; D10 ham tarih \"2026-10-14 00:00:00\" ve \"98000\"; D7 \"fail\" çevrilmemiş.",
  "Birim, Excel sütun başlığından (\"(USD)\") okunmalı; biçim düzeltmesi B2'de açılacak EK_F_MODE / polish_answer ile beklenir."),
 ("F7 · Düşük", "Kaynak seçimi",
  "B2 doğru değeri eski sürümden (Facility Agreement — V01, superseded) verdi; G4'te bir dava iki kez sayıldı ve ilk maddede taraf yanlış yazıldı.",
  "Güncel sürüm önceliği ve tekilleştirme."),
]
for code, title, obs, cause in finds:
    S.append(KeepTogether([para(f"<b>{code}</b> — {title}", H2), para(f"<b>Gözlem:</b> {obs}", P), para(f"<b>Değerlendirme:</b> {cause}", P)]))
S.append(para("Güçlü yönler", H2))
S += bullets(["Belge yolunda kaynak kartı (belge adı, tarih, sürüm) her doğru cevapta mevcut (G1 ilkesi).",
              "Dolaylı dille sorulan belge sorularında yüksek isabet (9/10): anlam eşleşmesi çalışıyor.",
              "Excel yolu doğru yola girdiğinde doğru hücreyi çoğunlukla buluyor (D1, D2, D5, D6, E2, E3 doğrudan hücre referanslı).",
              "Karma yol (E4) belge ve Excel'i birleştirip bağlamlı, doğru cevap verdi."])

# ---------- 7. Karşılaştırma ve tekrar protokolü ----------
S.append(para("7. Sonraki koşular için karşılaştırma protokolü", H1))
S.append(para("Gelişmenin ölçülebilmesi için her koşu aşağıdaki kurallarla yapılır. Kural dışına çıkılan koşu, karşılaştırma tablosuna \"kural dışı\" notuyla girer.", P))
S += bullets([
 "<b>Soru seti dondurulmuştur (QS-v1).</b> 45 soru kelimesi kelimesine aynı sorulur. Yeni sorular <b>QS-v2</b> olarak ayrı puanlanır; QS-v1 skoru her koşuda ayrıca raporlanır.",
 "<b>Beklenen cevaplar</b> bu raporun 5. bölümündeki gibidir. Demo verisi değişirse (ledger/Excel), değişen beklenen değer gerekçesiyle \"QS-v1 düzeltme kaydı\"na yazılır; soru metni değişmez.",
 "<b>Kullanıcı:</b> admin. Demo bugünü 06.10.2026 olmalı; değilse göreli zaman soruları (E1, E10, G5) yeniden hesaplanır.",
 "<b>Yürütme:</b> Tur-1 sorular 0,8 sn aralıkla sırayla (G1→E10). Tur-1'de 503 alanlar Tur-2'de 8 sn aralıkla, en çok 3 deneme (denemeler arası 20 sn). M6 Tur-1'den, puanlar son denemeden alınır.",
 "<b>Kaydedilecek ham veri</b> (her soru): HTTP kodu (ilk/son), deneme sayısı, süre, yol (query_type), answered, model, token giriş/çıkış, uyarılar, audit_log_id, cevap metni, kaynaklar, Excel hücreleri. Ham veri <i>sonuclar.json</i> biçimindedir.",
 "<b>Puanlama</b> 3.2'deki kurala göre; şüpheli durumda daha düşük puan verilir ve not yazılır.",
 "<b>Koşu öncesi kayıt:</b> model adı, bayraklar (EK_F_MODE, ASSIST_MODE, ANTHROPIC_THINKING), canlı commit, belge ve proje sayısı.",
])
S.append(para("7.1 İlerleme takip tablosu", H2))
trk = [["Koşu", "Tarih", "Model / bayraklar", "M1 Doğru", "M2 KY", "M3 Bulamadı", "M4 Router", "M6 503 (Tur-1)", "Not"],
       ["BT-01", "13.10.2026", "Gemini flash-lite · EK_F off", pct(cnt["OK"], N), str(cnt["KY"]), pct(cnt["BULAMADI"], N), f"{router_ok}/20", f"{first503}/45", "Taban"],
       ["BT-02", "", "", "", "", "", "", "", "Haiku + Excel paketi sonrası"],
       ["BT-03", "", "", "", "", "", "", "", "B2 sonrası"],
       ["BT-04", "", "", "", "", "", "", "", "Web testi öncesi"]]
S.append(tbl(trk, [W*0.08, W*0.11, W*0.18, W*0.09, W*0.07, W*0.11, W*0.09, W*0.11, W*0.16], style=T, hstyle=TB))
S.append(para("7.2 Grup bazında taban değerler", H2))
S.append(tbl([["Grup", "BT-01 Doğru", "Hedef"]] + [[g, f"{gc[g]['OK']}/{sum(gc[g].values())}", h] for g, h in
             zip(groups, ["≥ 4/5", "≥ 9/10", "≥ 8/10", "≥ 9/10", "≥ 7/10"])], [W*0.4, W*0.3, W*0.3]))

# ---------- 8. Kapsam dışı ----------
S.append(PageBreak()); S.append(para("8. Bu koşunun kapsamı dışında kalanlar (QS-v2 önerisi)", H1))
S += bullets([
 "<b>Yetki negatifleri:</b> departman kullanıcısıyla, yetkisi olmayan belgenin (ör. Boztepe hukuk) anılmaması. Admin ile ölçülemez.",
 "<b>Netleştirme:</b> proje adı olmadan değer sorusu (ör. \"Kredinin bir sonraki taksiti ne zaman?\") → tek netleştirici soru beklenir (10.10 kararı).",
 "<b>Çelişkili veri:</b> Yeşilova taksit #11 faizi plan 18.240 / banka 18.912 → iki kaynak birlikte gösterilmeli.",
 "<b>Tarih tuzağı:</b> Karatepe sonraki taksit 07.10.2026, 412.500 USD; finansal modeldeki 31.12.2026 dönem sonu tarihi verilmemeli.",
 "<b>Eşzamanlılık:</b> 3–5 paralel kullanıcıyla servis kararlılığı (F2).",
 "<b>Etiket ve yükleme akışı:</b> otomatik etiket/alan doldurma (Ürün 1 notu madde 3–4).",
])
S.append(Spacer(1, 6))
S.append(para("Ham sonuçlar ve bu raporu üreten betik aynı klasördedir: <i>BT-01_sonuclar.json</i>, <i>BT-01_rapor_olustur.py</i>. Rapor, ham veriden yeniden üretilebilir.", PS))

doc.build(S)
print(OUT)
