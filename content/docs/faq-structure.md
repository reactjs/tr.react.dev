---
id: faq-structure
title: Dosya Yapısı
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### React projelerini yapılandırmak için önerilen bir yol var mı? {#is-there-a-recommended-way-to-structure-react-projects}

React dosyalarını klasörlere nasıl yerleştireceğinize dair genel bir kanaat bulunmamaktadır. Ancak dikkate almak isteyebileceğiniz ve ekosistemde popüler birkaç yaygın yaklaşım bulunmaktadır.

#### Özelliklere veya rotalara göre gruplandırma {#grouping-by-features-or-routes}

<<<<<<< HEAD
Projeleri yapılandırmak için kullanılan yaygın yöntemlerden biri; CSS, JS ve testleri özellik veya rotalara göre gruplanan klasörlerin içine beraber koymaktır.
=======
One common way to structure projects is to locate CSS, JS, and tests together inside folders grouped by feature or route.
>>>>>>> e548bd7e65086a8206fee46bd9e24b18b68bf045

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

"Özellik" tanımı evrensel değildir ve ayrıntı derecesini seçmek size bırakılmıştır. Eğer bir üst düzey klasörler listesi ortaya çıkaramazsanız, kullanıcılarınıza ürününüzün hangi ana bölümlerden oluştuğunu sorabilir ve akıllarındaki modeli bir taslak olarak kullanabilirsiniz.

#### Dosya türüne göre gruplandırma {#grouping-by-file-type}

Projeleri yapılandırmanın bir diğer popüler yöntemi ise benzer dosyaları birlikte gruplandırmaktır. Örneğin;

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Bazı insanlar daha da ileri gidip, bileşenleri uygulamadaki rollerine göre farklı klasörlere ayırmayı tercih ederler. Örneğin [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/), bu ilkeye dayalı bir tasarım metodolojisidir. Bu tür metodolojilerin takip edilmesi gereken katı kurallardan ziyade, yardımcı örnekler olarak değerlendirilmesi  daha verimli olacaktır.

#### Çok fazla iç içe koymaktan kaçının {#avoid-too-much-nesting}

Javascript projelerinde klasörleri derinlemesine iç içe koymanın çok fazla zararlı noktası bulunmaktadır. Klasörler arası bağıl import'lar yazmak veya dosyalar taşındığında bu import'ları güncellemek git gide zorlaşır. Derinlemesine bir dizin yapısı kullanmak için çok zorlayıcı bir nedeniniz olmadığı sürece, kendinizi tek bir proje için en fazla üç ya da dört iç içe klasör kullanmakla sınırlamayı düşünebilirsiniz. Tabii ki bu sadece bir öneridir ve sizin projeniz için uygun olmayabilir.

#### Çok fazla düşünmeyin {#dont-overthink-it}

Eğer bir projeye henüz yeni başlıyorsanız, dizin yapısı üzerine [beş dakikadan daha fazla zaman harcamayın](https://eksisozluk.com/analysis-paralysis--833201). Yukarıdaki yaklaşımlardan herhangi birini seçin (veya kendi yönteminizi getirin) ve kod yazmaya başlayın! Biraz gerçek kod yazdıktan sonra bu husus hakkında muhtemelen yeniden düşünmek isteyeceksinizdir.

Eğer tamamen çıkmaza girdiyseniz, tüm dosyaları tek bir klasörde tutarak başlayın. Eninde sonunda projeniz bazı dosyaları diğerlerinden ayırmak isteyeceğiniz kadar büyüyecek. O zamana kadar hangi dosyaları çoğu kez birlikte düzenlediğinizi söylemeye yetecek kadar bilginiz olacaktır. Genel olarak, sıklıkla birlikte değiştirilen dosyaları birbirlerine yakın tutmak iyi bir fikirdir. Bu prensip, "ortak yerleşim" olarak adlandırılır.

Projeler büyüdükçe, pratikte yukarıdaki yaklaşımların her ikisinin de bir karışımı uygulanır. Yani başlangıçta "doğru" olanı seçmek çok önemli değil.
