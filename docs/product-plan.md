# Tripso — Ürün Planı (Frontend)

> Bu doküman Tripso'nun frontend yol haritasını tanımlar: ürün vizyonu, sayfa önerileri,
> özellik fikirleri ve ihtiyaç duyulan entegrasyonlar. Backend tarafı ayrı projede
> (`tripso-backend-feature-sprint-5-trips/`) çalışır; burada yalnızca kullanıcı arayüzü planlanır.

---

## 1. Vizyon

**Tripso, yapay zekâ destekli kişisel bir seyahat planlayıcısıdır.**

Kullanıcı birkaç basit girdiyi doldurur — nereye gitmek istediği, bütçesi, kaç kişi
oldukları ve seyahatin türü (çift tatili, arkadaş grubu, aile, tur) — ve yapay zekâ bu
bilgilere göre kişiselleştirilmiş bir yol haritası çizer: gün gün gezilecek yerler,
kafeler, restoranlar ve aktiviteler.

Öneriler kullanıcının ilgi alanlarına göre şekillenir. Sanata meraklı bir kullanıcıya
Louvre Müzesi önerilirken, "ben sanattan çok eğlence isterim" diyen bir kullanıcıya aynı
şehirde barlar ve gece hayatı önerilir. İstenmeyen her durak tek dokunuşla alternatifiyle
değiştirilebilir.

Tüm mekânlar harita üzerinde gösterilir. Kullanıcı gezdiği yerleri haritaya **pinler**;
arkadaşlarının ve dünyanın nereleri gezdiğini, neleri beğenip önerdiğini görür. Böylece
Tripso yalnızca bir planlayıcı değil, gezginlerin birbirinden ilham aldığı sosyal bir
seyahat platformu olur.

### Temel akış

```
Girdiler (şehir, bütçe, kişi, tür, ilgi alanları)
        │
        ▼
AI plan üretimi (backend)          ← polling ile durum takibi
        │
        ▼
Gün gün rota + harita üzerinde duraklar
        │
        ├── Beğenmediğin durağı değiştir → alternatif öneri
        ├── Gezdiğin yeri pinle → gezi günlüğün oluşur
        └── Topluluk katmanı → başkaları ne gezmiş, ne önermiş
```

---

## 2. Mevcut Durum (özet)

| Alan | Durum |
|---|---|
| Sekmeler | Home / Explore / Trips / Profile (`src/app/(tabs)/`) |
| Arama + destinasyon detayı | Var (`search.tsx`, `destination/[id].tsx`) — mock veriyle |
| Trip oluşturma (`trip/new.tsx`) | **Stub** (ComingSoon) — bu planın 1 numaralı işi |
| Trips sekmesi | **Stub** (ComingSoon) |
| Harita kütüphanesi | **Yok** — kurulması gerekiyor (bkz. §5) |
| Veri tipleri | Hazır: `trip.ts`, `plan.ts`, `place.ts` (Mapbox + Google place ID alanları modellenmiş) |
| Auth | Google / Apple sosyal giriş UI'ı var (mock) |
| Tema & UI kiti | Hazır — turuncu marka rengi, ~40 bileşen, dark mode, en/tr dil desteği |

---

## 3. Sayfa Önerileri

Aşağıda 12 sayfa önerisi var. İlk 5'i uygulamanın omurgası (kesin yapılacaklar),
kalan 7'si aralarından seçim yapılacak adaylar. Hedef: toplamda 5-6 sayfayı kesinleştirmek.

### Kesin yapılacaklar

#### 1. Trip Sihirbazı — `trip/new`
Çok adımlı form (wizard). Mevcut stub'ın yerini alır.
- **Adımlar:** Destinasyon → Tarihler (kesin / ay / esnek) → Bütçe (ekonomik / standart / konfor / lüks + tutar) → Kişiler (yetişkin / çocuk / yaşlı) → Seyahat türü (balayı, doğum günü, yıldönümü, iş+tatil, aile ziyareti) → İlgi alanları + serbest not
- **Destinasyon seçimi serbest metin DEĞİL, API destekli autocomplete olacak:**
  - Kullanıcı yazdıkça Mapbox Geocoding/Search API'den şehir ve ülke önerileri gelir;
    kullanıcı yalnızca bu listeden seçim yapabilir (kafasına göre geçersiz bir yer giremez)
  - Seçilen her destinasyon `mapboxPlaceId` + koordinat + şehir/ülke bilgisiyle kaydedilir —
    böylece backend ve harita her zaman geçerli, konumu bilinen bir yerle çalışır
  - **Çoklu seçim desteklenir:** tek şehir, birkaç şehir (Paris + Amsterdam) veya
    ülke bazlı rota (İtalya turu → Roma, Floransa, Venedik); seçilenler chip olarak listelenir
  - Aynı autocomplete bileşeni `search.tsx` ekranıyla ortak kullanılır (orada zaten
    `usePlaceSearch(query)` Mapbox entegrasyonu TODO olarak planlı)
- Son adımda "Planı Oluştur" → AI üretim/bekleme ekranı (progress + eğlenceli ipuçları)
- Tüm girdi tipleri `src/types/trip.ts` içinde zaten modellenmiş; form bu tiplere birebir oturur.

#### 2. Plan / Rota Detayı — `plan/[id]`
AI'nin ürettiği rotanın ana görüntüleme ekranı.
- Gün gün timeline: her gün altında sıralı duraklar (`PlanDay` → `PlanItem`)
- Her durak kartında: fotoğraf, kategori, tahmini süre/maliyet, mini harita önizlemesi
- **"Bunu istemiyorum" etkileşimi:** durağı kaydır/dokun → alternatif öneri iste (Louvre yerine bar senaryosu)
- Plan versiyonları arasında geçiş (backend 5 versiyona kadar saklıyor)
- Üstte "Haritada Gör" butonu → Harita ekranına geçiş

#### 3. Harita Ekranı — `map` (veya plan içinden tam ekran)
Uygulamanın kalbi olan harita görünümü.
- Plan duraklarının tamamı numaralı pinlerle, günler renk kodlu
- Kullanıcının **gezdiği yerler** ayrı pin stiliyle işaretli
- Pin'e dokununca alttan mekân kartı açılır (foto, puan, "detaya git")
- Kategori filtreleri: restoran / kafe / bar / müze / doğa
- "Yakınımda ne var?" — konum izniyle çevredeki önerileri gösterme

#### 4. Sosyal Keşif / Topluluk Haritası — `community`
"Arkadaşlarım ve dünya nereleri gezmiş?" sorusunun cevabı.
- Dünya haritası üzerinde pinler: arkadaşların gezdiği yerler + global popüler noktalar
- Filtre: **Arkadaşlarım / Herkes** anahtarı
- Harita altında akış (feed): "Ayşe, Paris'te Le Marais'yi pinledi", fotoğraflı gönderiler
- Bir pin'e dokununca: kim gitmiş, ne demiş, kaç kişi önermiş

#### 5. "Başkaları Ne Önerdi" — `recommendations/[city]`
Şehir bazlı topluluk önerileri. Destinasyon detayının altında bölüm olarak başlar,
kendi sayfasına genişler.
- Şehirdeki en çok önerilen mekânlar (topluluk oylarıyla sıralı)
- Google puanı + Tripso topluluk puanı yan yana
- Beğen / kaydet / "planıma ekle" aksiyonları
- Kategoriye göre sekmeler: yeme-içme, gezilecek yer, gece hayatı, alışveriş

### Seçilecek adaylar

#### 6. Mekân Detayı — `place/[id]`
Tek bir mekânın (restoran, müze, bar) tam sayfası.
- Fotoğraf galerisi, Google puanı ve **yorumları**, çalışma saatleri, fiyat seviyesi, adres
- "Planıma ekle" ve "Yol tarifi al" (harita uygulamasına yönlendirme)
- Tripso kullanıcılarının bu mekân hakkındaki yorumları
- *Not: Harita ve öneri sayfalarındaki pin kartları buraya açılacağı için pratikte neredeyse zorunlu bir sayfa.*

#### 7. Gezi Günlüğü / "Gezdiklerim" — `journal`
Kullanıcının kişisel seyahat arşivi.
- Check-in: gezilen yeri haritaya pinle, fotoğraf + not ekle
- Zaman çizelgesi görünümü: geziler kronolojik sırayla
- İstatistikler: X ülke, Y şehir, Z mekân — profildeki sayıların kaynağı
- Buradaki pinler Topluluk Haritası'nı (sayfa 4) besler.

#### 8. Arkadaşlar & Sosyal Profil — `profile/[userId]`, `friends`
Sosyal katmanın altyapısı.
- Arkadaş ekleme / takip etme, arkadaş listesi
- Arkadaş profili: gezdiği yerler haritası, önerileri, rozetleri
- Rozet/gamification: "5 ülke gezdi", "Kafe avcısı", "İlk balayı planı"

#### 9. Kaydedilenler / Koleksiyonlar — `saved`
Beğenilen mekân ve destinasyonların organize edildiği yer.
- Koleksiyon oluşturma: "Paris balayı fikirleri", "Roma'da yemek"
- Kaydedilen mekânları doğrudan yeni bir plana aktarma

#### 10. Bütçe Takibi — `plan/[id]/budget`
Plan bütçesi ile gerçekleşen harcamanın karşılaştırılması.
- Kategori kırılımı: konaklama / yeme-içme / aktivite / ulaşım
- Gezi sırasında harcama ekleme, "bütçenin %70'indesin" uyarıları
- Backend'deki `budgetAmount` / `budgetCurrency` alanlarıyla birebir uyumlu.

#### 11. Ortak Plan / Davet — `plan/[id]/collaborate`
Grup seyahatleri için birlikte planlama.
- Planı arkadaşlarla paylaşma (davet linki)
- Duraklar üzerinde oylama: "bu restorana gidelim mi?"
- Grup sohbeti veya durak bazlı yorumlar

#### 12. Bildirim Merkezi — `notifications`
- "Planın hazır!", "Arkadaşın Paris'i pinledi", "Gezine 3 gün kaldı"
- Backend'de FCM + bildirim kuyruğu altyapısı **zaten hazır**; frontend'de yalnızca liste ekranı + push izni akışı gerekir.

### Önerilen seçim (5-6 sayfa hedefi için)

Kesin 5 sayfa + **Mekân Detayı (6)** = 6 sayfa. Mekân detayı olmadan harita pinleri ve
öneri kartları "çıkmaz sokak" olur; bu yüzden ilk seçim o olmalı. İkinci parti olarak
7 (Gezi Günlüğü) ve 8 (Arkadaşlar) sosyal vizyonu tamamlar.

---

## 4. Özellik / Eklenti Fikirleri

Sayfa gerektirmeyen, mevcut ekranlara güç katan fikirler:

- **Hava durumu entegrasyonu** — yağmurlu güne açık hava aktivitesi koyulmuşsa uyarı + kapalı mekân önerisi
- **Döviz çevirici** — bütçe ve fiyatları kullanıcının para biriminde gösterme
- **Offline mod** — plan ve harita bölgesini indirme (yurtdışında internet sorunu için kritik)
- **Paylaşılabilir plan linki** — planı uygulama dışına (WhatsApp, Instagram) güzel bir kartla paylaşma
- **Gezi geri sayımı + valiz checklist'i** — gezi yaklaşırken hatırlatmalar
- **Rezervasyon yönlendirmeleri** — otel/uçak/restoran için dış linkler (ileride affiliate gelir kapısı)
- Halihazırda mevcut: dark mode, en/tr çoklu dil, onboarding akışı

### Yeni Özellik Önerileri (v2)

Yukarıdakilerle çakışmayan, çoğu **admin paneliyle beslenen** ikinci dalga fikirler
(sayfa bazlı veri beklentileri için bkz. [admin-panel-expectations.json](admin-panel-expectations.json)):

1. **Admin yönetimli kampanya / öne çıkan içerik** — Home'daki PromoBanner ve "Top
   Destinations" sıralaması admin panelinden yönetilir (kampanya metni, görsel, hedef
   link, yayın tarihi aralığı). Uygulama güncellemesi olmadan vitrin değiştirilebilir.
2. **Sezonluk / küratörlü koleksiyonlar** — "Yaz 2026 Akdeniz", "Vizesiz Rotalar" gibi
   editör seçkileri; mevcut `SavedCollection` altyapısını yeniden kullanır, admin
   `curate/publish` eder.
3. **Fiyat düşüş alarmları** — kaydedilen destinasyon/otel için fiyat düşünce push
   bildirimi; `Notification` tipine yeni bir tür eklenir, backend fiyat izleme yapar.
4. **Referral programı** — davet linkiyle gelen her arkadaş için rozet/premium hakkı;
   Ortak Plan'daki davet linki altyapısı yeniden kullanılır.
5. **eSIM + seyahat sigortası upsell** — plan detayında destinasyona göre bağlamsal
   affiliate kartları ("Japonya için eSIM", "Schengen sigortası"); admin panelinden
   sağlayıcı/komisyon yönetimi.
6. **Mini şehir rehberleri / ipuçları** — admin'in yayınladığı kısa içerik kartları
   ("Paris'te metro nasıl kullanılır"); şehir öneri sayfasını ve plan detayını besler.

---

## 5. Entegrasyonlar

### 5.1 Harita: **Mapbox önerilir** (`@rnmapbox/maps`)

| Kriter | Mapbox | Google Maps (`react-native-maps`) |
|---|---|---|
| Backend uyumu | ✅ Backend zaten Mapbox geocoding kullanıyor; `place.ts`'te `mapboxPlaceId` hazır | Ayrı bir place ID dünyası |
| Özel stil | ✅ Marka turuncusuna uygun tam özelleştirme, güzel dark mode | Sınırlı stil desteği |
| Ücretsiz kota | ✅ Aylık 25.000 mobil kullanıcıya (MAU) kadar ücretsiz — başlangıç için fazlasıyla yeterli | iOS'ta Google Maps SDK ücretli katmana daha erken girer; Apple Maps ücretsiz ama Android'de yok |
| Vektör harita / performans | ✅ Vektör tabanlı, akıcı | Platforma göre değişken |

**Karar:** Mapbox. Hem backend ile aynı ekosistem, hem stil özgürlüğü, hem maliyet avantajı.

Mapbox'tan iki ayrı hizmet kullanılacak:
- **Haritanın kendisi** — `@rnmapbox/maps` ile ekranda harita çizimi ve pinler
- **Geocoding / Search Box API** — Trip Sihirbazı'ndaki destinasyon autocomplete'i:
  kullanıcı yazdıkça geçerli şehir/ülke önerileri döner, seçim `mapboxPlaceId` +
  koordinatla kaydedilir. Serbest metin girişi yoktur; her destinasyon API'den
  doğrulanmış bir kayıttır. (Backend zaten aynı geocoding servisini kullanıyor.)

> ⚠️ **Önemli:** `@rnmapbox/maps` (ve `react-native-maps`) native modül içerir — **Expo Go'da
> çalışmaz**. Harita eklendiği anda `npx expo prebuild` + development build'e geçmek gerekir.
> Bu, harita işine başlamadan önce verilecek tek altyapı kararıdır.

### 5.2 Mekân verisi & yorumlar: **Google Places API (New)**

Kullanıcıya "bu restoranın Google puanı 4.6, işte yorumları" gösterebilmek için tek ciddi
kaynak Google. `place.ts`'te `googlePlaceId` alanı zaten modellenmiş — hibrit yaklaşım baştan öngörülmüş.

- **Kullanım:** Mekân Detayı sayfasında puan, yorumlar, fotoğraflar, çalışma saatleri, fiyat seviyesi
- **Dikkat:** Google TOS gereği yorumlar **kalıcı olarak cache'lenemez/veritabanına yazılamaz** — her seferinde canlı çekilir, yalnızca place ID saklanır
- **Maliyet:** Aylık belli bir ücretsiz kredi var; Place Details çağrıları alan maskesiyle (field mask) ucuzlatılır
- **Alternatifler:** Foursquare Places (cömert ücretsiz katman, yorum derinliği az), Yelp Fusion (batı pazarları ağırlıklı), TripAdvisor Content API (başvuru/onay gerekir)

**Önerilen model:** Google yorumları "dış dünya puanı" olarak gösterilir; **Tripso'nun kendi
topluluk öneri/yorum sistemi** (backend'de) asıl sosyal katmanı oluşturur. Böylece hem TOS
sorunu yaşanmaz hem de "başkaları ne önermiş" verisi bize ait olur.

### 5.3 Diğer entegrasyonlar

| Entegrasyon | Paket | Ne için | Hangi sayfalar |
|---|---|---|---|
| Konum | `expo-location` | "Yakınımda ne var", check-in doğrulama | Harita (3), Gezi Günlüğü (7) |
| Push bildirim | `expo-notifications` + FCM | Plan hazır, sosyal bildirimler — **backend hazır** | Bildirim Merkezi (12), genel |
| Paylaşım | `expo-sharing` / RN Share | Plan linki, mekân paylaşma | Plan Detayı (2), Mekân (6) |
| Fotoğraflar | Google Places Photos + Unsplash | Mekân fotoğrafları / destinasyon hero görselleri | Tümü |
| Takvim | `expo-calendar` (opsiyonel) | Planı telefon takvimine ekleme | Plan Detayı (2) |
| Hava durumu | OpenWeatherMap / Open-Meteo (ücretsiz) | Plan uyarıları | Plan Detayı (2) |

---

## 6. Öncelik Sırası (öneri)

**Faz 1 — Çekirdek döngü (MVP):**
1. Trip Sihirbazı (`trip/new`) — girdiler + AI üretim ekranı
2. Plan / Rota Detayı — timeline + alternatif önerme
3. Harita Ekranı — Mapbox kurulumu + plan pinleri *(dev build'e geçiş burada)*
4. Mekân Detayı — Google Places entegrasyonu

**Faz 2 — Sosyal katman:**
5. Gezi Günlüğü ("Gezdiklerim") — pinleme altyapısı
6. Sosyal Keşif / Topluluk Haritası — arkadaşlar + dünya
7. "Başkaları Ne Önerdi" — topluluk önerileri

**Faz 3 — Derinleştirme:**
8. Arkadaşlar & profil, Kaydedilenler, Bütçe Takibi, Ortak Plan, Bildirim Merkezi (seçime göre)

Bu sıralamanın mantığı: önce kullanıcıya tek başına değer veren döngü (plan al → haritada gez),
sonra o döngüyü besleyen sosyal veri (pinler → topluluk haritası → öneriler).
