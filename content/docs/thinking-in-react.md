---
id: thinking-in-react
title: React'te Düşünmek
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React, bize göre, JavaScript ile büyük ve hızlı Web uygulamaları oluşturmanın en önde gelen yoludur. Bizim için Facebook ve Instagram'ın geliştirilmesinde çok etkili oldu.

React’in en harika yanlarından biri de, uygulamaları oluştururken size kazandırdığı bakış açısıdır. Bu dökümanda, React'i kullanarak arama özelliği olan bir ürün tablosu oluşturmanın düşünce sürecinde size yol göstereceğiz.

## Bir Taslakla Başlayın {#start-with-a-mock}

Zaten bir JSON API'ımızın ve tasarımcımızdan gelen bir taslağımızın olduğunu hayal edin. Taslak bunun gibi gözüküyor:

![Mockup](../images/blog/thinking-in-react-mock.png)

JSON API'ımız aşağıdakine benzeyen bir veri dönüyor:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Adım 1: Kullanıcı Arabirimini Bileşen Hiyerarşisine Bölün {#step-1-break-the-ui-into-a-component-hierarchy}

Yapmak isteyeceğiniz ilk şey, taslaktaki her bileşenin (ve alt bileşenlerin) etrafina kutular çizip, her birisine isimler vermektir.
Eğer bir tasarımcıyla çalışıyorsanız, bunu zaten yapmış olabilirler; o zaman gidip onlarla konuşun! Photoshop'taki katman isimleri React bileşenlerinin isimleri olabilir!

<<<<<<< HEAD

Ama nelerin kendi başına birer bileşen olacağına nasıl karar vereceksiniz? Yeni bir nesne ya da fonksiyon oluşturup oluşturmayacağınıza karar vermek için yine aynı teknikleri kullanın. Bu tekniklerden biri, [tek sorumluluk ilkesidir](https://eksisozluk.com/tek-sorumluluk-prensibi--1667342); yani bir bileşen ideal olarak sadece tek bir şey yapmalıdır. Bileşen büyüdüğü taktirde, daha küçük alt bileşenlere ayrılmalıdır.
=======
But how do you know what should be its own component? Use the same techniques for deciding if you should create a new function or object. One such technique is the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is, a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents.

Since you're often displaying a JSON data model to a user, you'll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely. That's because UI and data models tend to adhere to the same *information architecture*. Separate your UI into components, where each component matches one piece of your data model.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

Çoğu zaman kullanıcıya bir JSON veri modeli göstereceğiniz için, modeliniz doğru inşa edildiyse, kullanıcı arayüzünüzün (ve dolayısıyla bileşen yapınızın) güzel bir şekilde eşleşeceğini göreceksiniz. Bunun nedeni, kullanıcı arabirimi ve veri modellerinin aynı *bilgi mimarisine* bağlı kalma eğiliminde olmasıdır. Bu yüzden kullanıcı arayüzünüzü bileşenlere ayırma işi genellikle önemsizdir. Arayüzünüzü sadece, her birisi veri modelinizin bir parçasını temsil edecek şekilde, bileşenlere bölün.

<<<<<<< HEAD
![Bileşen Şeması](../images/blog/thinking-in-react-components.png)
=======
You'll see here that we have five components in our app. We've italicized the data each component represents.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

Burada küçük uygulamamızın beş tane bileşeni olduğunu göreceksiniz. Her bileşenin temsil ettiği verileri italik hale getirdik.

  1. **`FilterableProductTable` (turuncu):** örnek uygulamanın tamamını içerir.
  2. **`SearchBar` (mavi):** bütün *kullanıcı girdilerini* alır.
  3. **`ProductTable` (yeşil):** *kullanıcı girdisine* bağlı olarak *veri koleksiyonunu* görüntüler ve filtreler.
  4. **`ProductCategoryRow` (turkuaz):** her bir *kategori* için bir başlık gösterir.
  5. **`ProductRow` (kırmızı):** her bir *ürün* için bir satır gösterir.

<<<<<<< HEAD
`ProductTable`'a bakarsanız, tablo başlığının ("Name" ve "Price" etiketlerini içeren kısım) kendi bileşeni olmadığını göreceksiniz. Bu bir tercih meselesi ve her iki şekilde de yapılmasını savunan bir argüman var. Bu örnekte, tablo başlığını `ProductTable`’ın bir parçası olarak bıraktık. Çünkü tablo başlığı, ProductTable’ın sorumluluğunda olan *veri koleksiyonunu* render etme işleminin bir parçasıdır. Yine de, eğer bu başlık giderek karmaşık bir hale gelirse (Mesela sıralama özelliği ekleseydik), kendi ayrı `ProductTableHeader` bileşenini yapmak kesinlikle daha mantıklı olurdu.

Şimdi, taslağımızdaki bileşenleri belirlediğimize göre, onları bir hiyerarşiye göre düzenleyelim. Bu kolay. Taslakta başka bir bileşen içinde görünen bileşenler, hiyerarşideki bir alt eleman olarak görünmelidir:
=======
Now that we've identified the components in our mock, let's arrange them into a hierarchy. Components that appear within another component in the mock should appear as a child in the hierarchy:
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Adım 2: React'te Statik Versiyonunu Oluşturun {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="https://codepen.io">CodePen</a>'deki <a href="https://codepen.io/gaearon/pen/BwWzwm">React'te Düşünmek: Adım 2</a> sayfasını ziyaret edin.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Artık bileşen hiyerarşisine sahip olduğunuza göre, uygulamanızı hayata geçirme vakti geldi. Bunun en kolay yolu, veri modelinizi alıp, kullanıcı arayüzünü oluşturan; ancak etkileşimli (interaktif) olmayan bir sürüm oluşturmaktır. Bu noktada en iyi yaklaşım bu süreçleri birbirinden ayırmaktır. Çünkü statik bir versiyonu oluşturmak çok fazla yazmayı ama çok az düşünmeyi gerektirir. Bunun yanında etkileşimli (interaktif) versiyonunu yapmak çok daha fazla düşünmeyi ama daha az yazmayı gerektirir. Neden böyle olduğunu göreceğiz.

Veri modelinizi render eden bir statik versiyonu yapmak için, diğer bileşenleri kullanan ve *prop'lar* aracılığıyla veri ileten bileşenler oluşturmak isteyeceksiniz. *prop'lar* bileşenler arasında yukarıdan aşağıya veri iletmenin bir yoludur. Eğer *state* konseptina aşinaysanız, bu statik versiyonu oluşturmak için **state'leri hiçbir şekilde kullanmayın.** State konsepti sadece etkileşim, yani zaman içinde değişen verilerin olduğu durumlar, için ayrılmıştır. Buna, uygulamanın statik bir sürümü olduğundan, ihtiyacınız yoktur.

Yukarıdan aşağıya veya aşağıdan yukarıya oluşturabilirsiniz. Diğer bir deyişle, oluşturmaya hiyerarşide daha yukarıdaki (örneğin, `FilterableProductTable`) veya daha aşağıdaki (`ProductRow`) bileşenler ile başlayabilirsiniz. Daha basit örneklerde, yukarıdan aşağıya gitmek genellikle daha kolaydır ve daha büyük projelerde, aşağıdan yukarıya gitmek ve de bileşenleri oluşturdukça testler yazmak daha kolaydır.

Bu adımın sonunda, veri modelinizi oluşturan yeniden kullanılabilir bileşenlerden oluşan bir kütüphaneye sahip olacaksınız. Bileşenler yalnızca `render()` metotlarına sahip olacaktır, çünkü bu, uygulamanızın statik bir sürümüdür. Hiyerarşinin en üstündeki bileşen (`FilterableProductTable`) veri modelinizi bir prop olarak alır. Temel veri modelinizde değişiklik yaparsanız ve tekrar `ReactDOM.render()`'ı çağırırsanız, kullanıcı arayüzü güncellenecektir. Arayüzünüzün nasıl güncellendiğini ve, karmaşık bir şey olmadığından, nerede değişiklik yapılacağını görmek kolaydır. React'in **tek yönlü veri akışı** (ayrıca *tek yönlü bağlama* olarak da bilinir) her şeyi modüler ve hızlı tutar.

Bu adımı uygulamak için yardıma ihtiyaç duyarsanız, basitçe [React Dokümanlarına](/docs/) bakın.

### Kısa bir araya girme: Prop'lar vs State {#a-brief-interlude-props-vs-state}

<<<<<<< HEAD
React'ta iki tür "model" datası vardır: props ve state. Bunlar arasındaki farkı anlamak önemlidir. Eğer aradaki farkın ne olduğundan emin değilseniz [React Dokümanlarına](/docs/interactivity-and-dynamic-uis.html) a göz gezdirin.

## Adım 3: UI State'inin Minimal (ancak eksiksiz) Temsilini Belirleme {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}
=======
At the end of this step, you'll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `ReactDOM.render()` again, the UI will be updated. You can see how your UI is updated and where to make changes. React's **one-way data flow** (also called *one-way binding*) keeps everything modular and fast.

Refer to the [React docs](/docs/) if you need help executing this step.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

Kullanıcı arayüzünüzü etkileşimli hale getirmek için, temel veri modelinizde değişiklikleri tetikleyebilmeniz gerekir. React bunu **state** ile kolaylaştırmaktadır.


Uygulamanızı doğru bir şekilde oluşturmak için, öncelikle uygulamanızın ihtiyaç duyduğu minimum değişken `state` kümesini düşünmeniz gerekir. Burada anahtar kelime [*TEK: Tekrar Etme Kendini*](https://eksisozluk.com/entry/35405641) (DRY: *Don't Repeat Yourself*) dir.
Uygulamanızın ihtiyaç duyduğu state'in mutlak asgari temsilini belirleyin ve talep üzerine ihtiyacınız olan her şeyi hesaplayın. Örneğin; bir YAPILACAKLAR listesi oluşturuyorsanız, sadece YAPILACAKLAR listesini tutan bir dizi saklayın; listedeki madde sayısı için ayrı bir state değişkeni tutmayın. Bunun yerine, listedeki madde sayısını render etmek istediğinizde, sadece YAPILACAKLAR dizisinin uzunluğunu alıp kullanın.

<<<<<<< HEAD

Örnek uygulamamızdaki sahip olduğumuz tüm veri parçalarına bakalım:
=======
To make your UI interactive, you need to be able to trigger changes to your underlying data model. React achieves this with **state**.

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you're building a TODO list, keep an array of the TODO items around; don't keep a separate state variable for the count. Instead, when you want to render the TODO count, take the length of the TODO items array.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

  * Orijinal ürün listesi
  * Kullanıcının girdiği arama metni
  * Checkbox'ın değeri
  * Filtrelenmiş ürün listesi

Her birini gözden geçirelim ve hangisinin state'e dahil olduğunu bulalım. Bunun için, her veri parçasına dair üç soru sorun:

<<<<<<< HEAD
  1. Üst elemandan prop'lar aracılığıyla mı iletilmiş? Öyleyse state'e ait değildir.
  2. Zaman içerisinde değişiklik göstermiyor mu? Öyleyse state'e ait değildir.
  3. Bileşeninizdeki herhangi başka bir state'e veya prop'a göre hesaplayabiliyor musunuz? Öyleyse state'e ait değildir.
=======
Let's go through each one and figure out which one is state. Ask three questions about each piece of data:
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

`Orijinal ürün listesi` prop olarak iletildiği için state'e ait değildir. `Arama metni` ve `checkbox`, zaman içerisinde değiştikleri ve başka bir şey üzerinden hesaplanamadıkları için state'e ait gibi duruyorlar. Ve son olarak, `filtrelenmiş ürün listesi` de; orijinal ürün listesi, arama metni ve checkbox ın değerine göre hesaplanabileceği için, state'e ait değildir.


Sonuç olarak, state'imiz aşağıdaki gibidir:

  * Kullanıcının girdiği arama metni
  * Checkbox'ın değeri

## Adım 4: State'inizin Nerede Yaşaması Gerektiğini Belirleyin {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="https://codepen.io">CodePen</a>'deki <a href="https://codepen.io/gaearon/pen/qPrNQZ">React'te Düşünmek: Adım 4</a> sayfasını ziyaret edin.</p>

Evet, uygulama state'inin asgari düzeydeki setinin ne olduğunu belirledik. Şimdi, hangi bileşenin bu state'i değiştirdiğini veya *sahip olduğunu* belirlememiz gerekir.

Unutmayın: React'in tüm olayı, bileşen hiyerarşisinde yukarıdan aşağı doğru tek yönlü veri akışıdır. Hangi bileşenin hangi state'e sahip olması gerektiği hemen belli olmayabilir. **Bu, yeni gelenlerin anlaması için en zor kısımdır.** Bu yüzden, bunu anlamak için şu adımları izleyin:

Uygulamanızdaki her state parçası için:

<<<<<<< HEAD
  * O state göre bir şeyler render eden her bileşeni belirleyin.
  * Ortak bir sahip bileşen bulun. (Hiyerarşide, state'e ihtiyaç duyan bütün bileşenlerin üzerinde bulunan tek bir bileşen)
  * *Ya ortak bir sahip bileşen ya da hiyerarşide daha yüksekte bulunan bir bileşen* state'e sahip olmalıdır.
  * State'e sahip olması mantıklı olmayan bir bileşen bulamazsanız, yalnızca state'i tutması için yeni bir bileşen oluşturun ve onu hiyerarşide ortak sahip bileşeninin üzerindeki bir yere ekleyin.
=======
  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component solely for holding the state and add it somewhere in the hierarchy above the common owner component.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

Şimdi bu stratejiyi uygulamamız için hayata geçirelim:

  * `ProductTable` ürün listesini state'e göre filtrelemeli ve `SearchBar` arama metnini ve *Checkbox*'ın durumunu göstermelidir.
  * Ortak sahip bileşen `FilterableProductTable` bileşinidir.
  * Filtre metninin ve *Checkbox* değerininin `FilterableProductTable` içinde yaşaması mantıklıdır.

Harika; state'imizin `FilterableProductTable` bileşeninde yaşamasına karar verdik. İlk olarak, uygulamanın başlangıç state'ini belirlemek için `this.state = {filterText: '', inStockOnly: false}` nesne özelliğini `constructor`'a ekleyin. Devamında, `filterText` ve `inStockOnly` değerlerini `ProductTable` ve `SearchBar` bileşenlerine prop olarak iletin. Son olarak, `ProductTable`'daki satırları filtrelemek ve form alanlarının değerlerini `SearchBar`'da ayarlamak için bu prop'ları kullanın.

Uygulamanızın nasıl davranacağını görmeye başlayabilirsiniz: `filterText`'i `ball` olarak ayarlayın ve uygulamanızı yenileyin. Veri tablosunun doğru bir şekilde güncellendiğini göreceksiniz.

## Adım 5: Ters Veri Akışı Ekleyin {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="https://codepen.io">CodePen</a>'deki <a href="https://codepen.io/gaearon/pen/LzWZvb">React'te Düşünmek: Adım 5</a> sayfasını ziyaret edin.</p>

Şimdiye kadar, hiyerarşide `yukarıdan aşağı` akan prop'ların ve state'in bir fonksiyonu olarak doğru şekilde işleyen bir uygulama geliştirdik. Şimdi diğer tarafa doğru akan verileri destekleme zamanı: Hiyerarşide derinlerde bulunan form bileşenlerinin `FilterableProductTable`'da state 'i güncellemesi gerekir.

<<<<<<< HEAD
React, programınızın nasıl çalıştığını anlamayı kolaylaştırmak için bu veri akışını açık bir hale getirir, ancak geleneksel iki yönlü (yukarıdan aşağı ve aşağıdan yukarı) veri akışından biraz daha fazla yazma gerektirir.
=======
React makes this data flow explicit to help you understand how your program works, but it does require a little more typing than traditional two-way data binding.
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014

Eğer yukarıdaki örnekte metin kutusuna yazmayı ya da kutucuğu işaretlemeyi denediğiniz taktirde, React'in bunu yoksaydığını göreceksiniz. Bu kasıtlı olarak böyledir. Çünkü `input` un `value` prop'unu, her zaman `FilterableProductTable` bileşeninden gelen `state`'e eşit olacak şekilde ayarladık.

Ne olmasını istediğimizi düşünelim. Kullanıcı form'u her değiştirdiğinde, kullanıcının yaptığı değişikliği yansıtacak şekilde state'i güncellediğimizden emin olmak istiyoruz. Bileşenlerin yalnızca kendi state'lerini güncellemesi gerektiği için, `FilterableProductTable` bileşeni, `SearchBar` bileşenine, state'in her güncellenmesinde çağrılacak `callback`'ler iletir. Girdilerin (input) `OnChange` olayını, `SearchBar` bileşenini bilgilendirmek için kullanabiliriz. `FilterableProductTable` tarafından iletilen callBack'ler `setState()`'i çağıracak ve uygulama güncellenecektir.

<<<<<<< HEAD
Karışık görünmesine rağmen, aslında sadece birkaç kod satırından ibaret. Ve verilerinizin uygulama boyunca nasıl aktığı da gerçekten çok belirgindir.

## Ve Bu Kadar {#and-thats-it}

Umuyoruz ki bu bölüm, React ile bileşen ve uygulamalar oluştururken nasıl düşünmeniz gerektiği hakkında size bir fikir vermiştir. Normalde alıştığınızdan biraz daha fazla kod yazmanız gerekebilir. Ancak kodun yazıldığından çok daha fazla okunduğunu; ve bu modüler, açık kodun okumak için oldukça kolay olduğunu unutmayın. Büyük bileşen kütüphaneleri oluşturmaya başladığınızda, bu açıklık ve modülerliği takdir edeceksiniz ve yazdığınız kodu yeniden kullandıkça kod satırlarınız küçülmeye başlayacak. :)
=======
## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's less difficult to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
>>>>>>> e1abbdecfd1a5a804bd38852e88373f54ddde014
