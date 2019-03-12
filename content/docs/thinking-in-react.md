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

React’in en harika yanlarından biri de, uygulamaları oluştururken size kazandırdığı bakış açısıdır. Bu dökümanda, React'i kullanarak aranabilir bir ürün tablosu oluşturmanın düşünce sürecinde size yol göstereceğiz.

## Bir Taslakla Başlayın {#start-with-a-mock}

Zaten bir JSON API'ımızın ve tasarımcımızdan gelen bir taslağımızın olduğunu hayal edin. Taslak bunun gibi gözüküyor:

![Mockup](../images/blog/thinking-in-react-mock.png)

JSON API'ımız şuna benzeyen bir veri dönüyor:

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


Ama nelerin kendi başına birer bileşen olacağına nasıl karar vereceksiniz? Yeni bir nesne ya da fonksiyon oluşturup oluşturmayacağınıza karar vermek için yine aynı teknikleri kullanın. Bu tekniklerden biri, [tek sorumluluk ilkesidir](https://eksisozluk.com/tek-sorumluluk-prensibi--1667342); yani bir bileşen ideal olarak sadece tek bir şey yapmalıdır. Bileşen büyüdüğü taktirde, daha küçük alt bileşenlere ayrılmalıdır.

Çoğu zaman kullanıcıya bir JSON veri modeli göstereceğiniz için, modeliniz doğru inşa edildiyse, kullanıcı arayüzünüzün (ve dolayısıyla bileşen yapınızın) güzel bir şekilde eşleşeceğini göreceksiniz. Bunun nedeni, kullanıcı arabirimi ve veri modellerinin aynı *bilgi mimarisine* bağlı kalma eğiliminde olmasıdır. Bu yüzden kullanıcı arayüzünüzü bileşenlere ayırma işi genellikle önemsizdir. Arayüzünüzü sadece, her birisi veri modelinizin bir parçasını temsil edecek şekilde, bileşenlere bölün.

![Bileşen Şeması](../images/blog/thinking-in-react-components.png)

Burada küçük uygulamamızın beş tane bileşeni olduğunu göreceksiniz. Her bileşenin temsil ettiği verileri italik hale getirdik.

  1. **`FilterableProductTable` (turuncu):** örnek uygulamanın tamamnı içerir.
  2. **`SearchBar` (mavi):** bütün *kullanıcı girdilerini* alır.
  3. **`ProductTable` (yeşil):** *kullanıcı girdisine* bağlı olarak *veri koleksiyonunu* görüntüler ve filtreler.
  4. **`ProductCategoryRow` (turkuaz):** her bir *kategori* için bir başlık gösterir.
  5. **`ProductRow` (kırmızı):** her bir *ürün* için bir satır gösterir.

`ProductTable`'a bakarsanız, tablo başlığının ("Name" ve "Price" etiketlerini içeren kısım) kendi bileşeni olmadığını göreceksiniz. Bu bir tercih meselesi ve her iki şekilde de yapılmasını belirten bir argüman var. Bu örnekte, tablo başlığını `ProductTable`’ın bir parçası olarak bıraktık. Çünkü tablo başlığı, ProductTable’ın sorumluluğunda olan *veri koleksiyonunu* render etme işleminin bir parçasıdır. Yine de, eğer bu başlık giderek karmaşık bir hale gelirse (Mesela sıralama özelliği ekleseydik), kendi ayrı `ProductTableHeader` bileşenini yapmak kesinlikle daha mantıklı olurdu.

Şimdi, taslağımızdaki bileşenleri belirlediğimize göre, onları bir hiyerarşiye göre düzenleyelim. Bu kolay. Taslakta başka bir bileşen içinde görünen bileşenler, hiyerarşideki bir alt eleman olarak görünmelidir:

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

Yukarıdan aşağıya veya aşağıdan yukarıya oluşturabilirsiniz. Diğer bir deyişle, oluşturmaya hiyerarşide daha yukaridaki (örneğin, `FilterableProductTable`) veya daha aşağıdaki (`ProductRow`) bileşenler ile başlayabilirsiniz. Daha basit örneklerde, yukarıdan aşağıya gitmek genellikle daha kolaydır ve daha büyük projelerde, aşağıdan yukarıya gitmek ve de bileşenleri oluşturdukça testler yazmak daha kolaydır.

Bu adımın sonunda, veri modelinizi oluşturan yeniden kullanılabilir bileşenlerden oluşan bir kütüphaneye sahip olacaksınız. Bileşenler yalnızca `render()` metotlarına sahip olacaktır, çünkü bu, uygulamanızın statik bir sürümüdür. Hiyerarşinin en üstündeki bileşen (`FilterableProductTable`) veri modelinizi bir prop olarak alır. Temel veri modelinizde değişiklik yaparsanız ve tekrar `ReactDOM.render()`'ı çağırırsanız, kullanıcı arayüzü güncellenecektir. Arayüzünüzün nasıl güncellendiğini ve, karmaşık bir şey olmadığından, nerede değişiklik yapılacağını görmek kolaydır. React'in **tek yönlü veri akışı** (ayrıca *tek yönlü bağlama* olarak da bilinir) her şeyi modüler ve hızlı tutar.

Bu adımı uygulamak için yardıma ihtiyaç duyarsanız, basitçe [React Dokümanlarına](/docs/) bakın.

### Kısa bir araya girme: Prop'lar vs State {#a-brief-interlude-props-vs-state}

There are two types of "model" data in React: props and state. It's important to understand the distinction between the two; skim [the official React docs](/docs/interactivity-and-dynamic-uis.html) if you aren't sure what the difference is.

## Step 3: UI State'inin Minimal (ancak eksiksiz) Temsilini Belirleme {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Kullanıcı arayüzünüzü etkileşimli hale getirmek için, temel veri modelinizde değişiklikleri tetikleyebilmeniz gerekir. React bunu **state** ile kolaylaştırmaktadır.


Uygulamanızı doğru bir şekilde oluşturmak için, öncelikle uygulamanızın ihtiyaç duyduğu minimum değişken `state` kümesini düşünmeniz gerekir. Burada anahtar kelime [*TEK: Tekrar Etme Kendini*](https://eksisozluk.com/entry/35405641) (DRY: *Don't Repeat Yourself*) dir.
Uygulamanızın ihtiyaç duyduğu state'in mutlak asgari temsilini belirleyin ve talep üzerine ihtiyacınız olan her şeyi hesaplayın. Örneğin; bir YAPILACAKLAR listesi oluşturuyorsanız, sadece YAPILACAKLAR listesini tutan bir dizi saklayın; listedeki madde sayısı için ayrı bir state değişkeni tutmayın. Bunun yerine, listedeki madde sayısını render etmek istediğinizde, sadece YAPILACAKLAR dizisinin uzunluğunu alıp kullanın.


Örnek uygulamamızdaki sahip olduğumuz tüm veri parçalarına bakalım:

  * Orijinal ürün listesi
  * Kullanıcının girdiği arama metni
  * Checkbox'ın değeri
  * Filtrelenmiş ürün listesi

Her birini gözden geçirelim ve hangisinin state'e dahil olduğunu bulalım. Bunun için, her veri parçasına dair üç soru sorun:

  1. Üst elemandan prop'lar aracılığıyla mı iletilmiş? Eğer öylese state'e ait değildir.
  2. Zaman içerisinde değişiklik göstermiyor mu? Eğer öyleyse state'e ait değildir.
  3. Bileşeninizdeki herhangi başka bir state'e veya prop'a göre hesaplayabiliyor musunuz? Eğer öyleyse state'e ait değildir.

`Orijinal ürün listesi` prop olarak iletildiği için state'e ait değildir. `Arama metni` ve `checkbox`, zaman içerisinde değiştikleri ve başka bir şey üzerinden hesaplanamadıkları için state'e ait gibi duruyorlar. Ve son olarak, `filtrelenmiş ürün listesi` de; orijinal ürün listesi, arama metni ve checkbox ın değerine göre hesaplanabileceği için, state'e ait değildir.


Sonuç olarak, state'imiz aşağıdaki gibidir:

  * Kullanıcının girdiği arama metni
  * Checkbox'ın değeri

## Step 4: Identify Where Your State Should Live {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="https://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
