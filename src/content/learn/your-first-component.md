---
title: İlk Bileşeniniz
---

<Intro>

*Bileşenler*, React'in ana konseptlerinden biridir. Bileşenler, kullanıcı arayüzlerini (UI) üzerine inşa ettiğiniz temeldir ve bu da onları React yolculuğunuza başlamak için mükemmel bir yer haline getirir!

</Intro>

<YouWillLearn>

* Bileşen nedir
* React uygulamalarında bileşenler hangi rolü oynar
* İlk React bileşeninizi nasıl yazarsınız

</YouWillLearn>

## Bileşenler: Kullanıcı arayüzü yapı taşları {/*components-ui-building-blocks*/}

Web'de HTML, yerleşik `<h1>` ve `<li>` gibi elemanlar ile zengin yapılandırılmış belgeler oluşturmanıza olanak tanır:

```html
<article>
  <h1>İlk Bileşenim</h1>
  <ol>
    <li>Bileşenler: Kullanıcı arayüzü yapı taşları</li>
    <li>Bileşeni tanımlama</li>
    <li>Bileşeni kullanma</li>
  </ol>
</article>
```

Bu biçimlendirme(markup), makaleyi `<article>`, başlığını `<h1>` ve sıralı bir liste `<ol>` halinde (kısaltılmış) içindekiler tablosunu temsil eder. Stil için CSS ve etkileşim için JavaScript ile birleştirilen bu tür biçimlendirme, Web'de gördüğünüz her kullanıcı arayüzü parçasında, her kenar çubuğunda, avatarda, modal'da ve açılır menünün arkasında bulunur.

React, biçimlendirmenizi, CSS'i ve JavaScript'inizi **uygulamanız için tekrar kullanabilir kullanıcı arayüzü elemanları olarak** kişisel bir "bileşende" toplamanızı sağlar. Yukarıda gördüğünüz içindekiler tablosu kodunu, her sayfada render edilebilecek şekilde bir `<TableOfContents />` bileşenine dönüştürebilirsiniz. Bu bileşen arka planda hala aynı `<article>` ve `<h1>` gibi HTML elemanlarını kullanmaktadır.

HTML elemanlarında olduğu gibi, bütün bir sayfayı tasarlamak için bileşenleri oluşturabilir, sıralayabilir ve iç içe yerleştirebilirsiniz. Örneğin, şu anda okumakta olduğunuz dökümantasyon sayfası React bileşenleri ile yapılmıştır.

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Dökümantasyon</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Projeniz büyüdükçe, yaptığınız dizaynların pek çoğunun, geliştirme aşamasını hızlandıracak şekilde zaten yazmış olduğunuz bileşenleri yeniden kullanarak oluşturabileceğini fark edeceksiniz. Yukarıdaki içindekiler tablosu herhangi bir ekrana `<TableOfContents />` bileşeni ile eklenilebilir! Hatta React açık kaynak topluluğu tarafından paylaşılan [Chakra UI](https://chakra-ui.com/) ve [Material UI](https://material-ui.com/) gibi binlerce bileşenle projenize hızlı bir başlangıç yapabilirsiniz.

## Bileşeni tanımlama {/*defining-a-component*/}

Geleneksel olarak web sayfaları oluşturulurken, web geliştiricileri içeriklerini tanımladılar ve ardından biraz JavaScript serpiştirerek sayfaları etkileşimli hale getirdiler. Web'de etikeleşimin olsa da olur olmasa da olduğu zamanlarda bu harika bir yaklaşımdı. Ancak şimdi etkileşim birçok site ve tüm uygulamalar için beklenmektedir. React, hala aynı teknolojiyi kullanırken etkileşimi ön sıraya koyar: **React bileşeni, _biçimlendirme serpiştirebileceğiniz_ bir JavaScript fonksiyonudur.** Aşağıdaki örnekte nasıl olduğunu görelim (aşağıdaki örneği düzenleyebilirsiniz):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Ve işte bir bileşenin nasıl oluşturulacağı:

### Adım 1: Bileşeni dışa aktar {/*step-1-export-the-component*/}

`export default` ön adı [standart bir JavaScript sözdizimidir](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (React'e özel değildir). Bir dosyadaki ana fonksiyonu işaretlemenize izin vererek o fonksiyonu başka dosyalarda içe aktarmanızı sağlar. (İçe aktarmak hakkında daha fazla bilgi için [Bileşenleri İçe ve Dışa Aktarma](/learn/importing-and-exporting-components)!)

### Adım 2: Fonksiyonu tanımlama {/*step-2-define-the-function*/}

`function Profile() { }` ile `Profile` adında bir JavaScript fonksiyonu tanımlarsınız.

<Pitfall>

React bileşenleri sıradan JavaScript fonksiyonlarıdır ama **bu bileşenlerin isimleri büyük harfle başlamak zorundadır,** aksi halde çalışmayacaklardır!

</Pitfall>

### Adım 3: Biçimlendirme ekle(markup) {/*step-3-add-markup*/}

Bu bileşen `src` ve `alt` özelliklerine sahip bir `<img />` elemanı döndürmektedir. `<img />` elemanı HTML gibi yazılmıştır ama aslında arka planda JavaScript'tir! Bu sözdizimine [JSX](/learn/writing-markup-with-jsx) denir ve biçimlendirmeyi JavaScript'in içine yerleştirmenize olanak tanır.

Bileşenin ne döndüreceği aşağıdaki bileşende olduğu gibi tek bir satır halinde yazılabilir:

```js
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Ancak biçimlendirmenizin hepsi `return` kelimesi ile aynı satırda değilse, biçimlendirmenizin parantez içine almak zorundasınız:

```js
return (
  <div>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Eğer parantez içine almayı unutursanız, `return` kelimesinden sonraki her kod [görmezden gelinecektir](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Bileşeni kullanma {/*using-a-component*/}

Artık `Profile` bileşenini tanımladığınıza göre, bu bileşeni başka bileşenler içine koyabilirsiniz. Örneğin, birden fazla `Profile` bileşeni kullanan bir `Gallery` bileşeni oluşturabilirsiniz:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Tarayıcı ne görür {/*what-the-browser-sees*/}

Baş harflerdeki farklılığa dikkat edin:

* `<section>` küçük harfle başlıyor, bu yüzden React, bunun bir HTML elemanı olduğu bilir.
* `<Profile />` bileşeni büyük `P` harfi ile başlıyor, bu yüzden React, `Profile` isimli bileşeni kullanmak istediğimizi bilir.

Hatta `Profile` bileşeni daha da fazla HTML içermektedir:: `<img />`. Sonuçta tarayıcı şunu görür:

```html
<section>
<<<<<<< HEAD
  <h1>Muhteşem bilim insanları</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
=======
  <h1>Amazing scientists</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
</section>
```

### Bileşenleri iç içe koymak ve düzenlemek {/*nesting-and-organizing-components*/}

Bileşenler sıradan JavaScript fonksiyonlarıdır, yani birden fazla bileşeni aynı dosya içinde tutabilirsiniz. Bileşenlerin görece küçük ve birbirleriyle ilişkili olduğu durumlarda bunu yapmak kullanışlıdır. Eğer dosya kalabalık bir hale gelirse, `Profile` bileşeneni ayrı başka bir dosyaya taşıyabilirsiniz. Bunun nasıl yapılacağını kısa süre içinde [içe ve dışa aktarmakla alakalı sayfada](/learn/importing-and-exporting-components) öğreneceksiniz.

`Profile` bileşenleri `Gallery` bileşeni içinde render edildiğinden—hatta birden fazla kere!—`Gallery` bileşeninin **üst bileşen olduğunu** ve her `Profile` bileşeninin "alt bileşen" olduğunu söyleyebiliriz. Bu React'in büyüsünün bir parçasıdır: bir bileşeni bir kere tanımlayabilirsiniz ve daha sonra bu bileşeni istediğiniz kadar ve istediğiniz yerde kullanabilirsiniz.

<Pitfall>

Bileşenler başka bileşenleri render edebilirler ama **bileşenlerin tanımlarını asla iç içe koymamalısınız:**

```js {2-5}
export default function Gallery() {
  // 🔴 Asla bir bileşen içinde başka bileşen tanumlamayın!
  function Profile() {
    // ...
  }
  // ...
}
```

Yukarıdaki kod parçası [çok yavaştır ve hatalara neden olur.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Bunun yerine, her bileşeni üst seviyede tanımlayın:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Bileşeni üst seviyede bildirin
function Profile() {
  // ...
}
```

Alt bileşen, üst bileşenden gelecek bir veriye ihtiyaç duyduğunda, tanımlamaları iç içe yapmak yerine [prop olarak iletin.](/learn/passing-props-to-a-component)

</Pitfall>

<DeepDive>

#### Baştan aşağı bileşenler {/*components-all-the-way-down*/}

React uygulamanız "kök" bileşeninde başlar. Bu bileşen genel olarak yeni bir proje başlattığınızda otomatik olarak oluşturulur. Örneğin, [CodeSandbox](https://codesandbox.io/) ya da [Next.js](https://nextjs.org/) framework'ünü kullanırsanız, kök bileşeni `pages/index.js` sayfasında tanımlanmıştır. Bu örneklerde, kök bileşenlerini dışa aktarıyoruz.

Çoğu React uygulaması baştan aşağı bileşenleri kullanır. Bu, bileşenleri yalnızca butonlar gibi yeniden kullanılabilir parçalar için değil, aynı zamanda kenar çubukları, listeler ve hatta sayfanın bütünü için de kullanabileceğiniz anlamına gelir! Bileşenler, bazıları yalnızca bir defa kullanılsa bile kullanıcı arayüzü kodunu ve biçimlendirmeyi düzenlemenin kullanışlı bir yoludur.

[React tabanlı framework’ler](/learn/creating-a-react-app) bunu bir adım daha ileri taşır. Boş bir HTML dosyası kullanıp sayfanın yönetimini JavaScript ile React’in “ele almasına” izin vermek yerine, React component’larınızdan HTML’i *otomatik olarak* üretirler. Bu sayede, JavaScript kodu yüklenmeden önce uygulamanız bazı içerikleri gösterebilir.

Yine de pek çok site, React'i sadece [halihazırda olan HTML sayfalarına etkileşim eklemek için](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) kullanır. Sayfanın tamamı için tek bir tane yerine birçok kök bileşeni vardır. İhtiyacınız olan kadar çok veya az React kullanabilirsiniz.

</DeepDive>

<Recap>

Az önce React'in tadını ilk kez aldınız! Bazı önemli noktaların üzerinden tekrar geçelim.

* React, **uygulamanız için tekrar kullanabilir kullanıcı arayüzü elemanları** yaratmanızı sağlar.
* Bir React uygulamasında her kullanıcı arayüzü parçası bir bileşendir.
* React bileşenleri şunların dışında sıradan JavaScript fonksiyonlarıdır:

  1. İsimleri her zaman büyük harfle başlar.
  2. Bu bileşenler JSX biçimlendirmesi döndürür.

</Recap>



<Challenges>

#### Bileşeni dışa aktarma {/*export-the-component*/}

Bu sandbox çalışmamaktadır çünkü kök bileşeni dışarı aktarılmamıştır:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Çözüme bakmadan önce kendiniz çözmeye çalışın!

<Solution>

Şu şekilde fonksiyon tanımlamasından önce `export default` ifadesini ekleyin:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Burada neden sadece `export` yazmanın bu örnekteki sorunu çözmeye yeterli olmadığını merak edebilirsiniz. `export` ve `export default` arasındaki farklılıkları [Bileşenleri İçe ve Dışa Aktarma](/learn/importing-and-exporting-components) sayfasından öğrenebilirsiniz.

</Solution>

#### Dönüş ifadesini düzelt {/*fix-the-return-statement*/}

Bu `return` ifadesiyle ilgili bir şey doğru değil. Düzeltebilir misin?

<Hint>

Hatayı düzeltmeye çalışırken "Unexpected token" hatası alabilirsiniz. Bu durumda, noktalı virgülün kapanış parantezinden *sonra* olup olmadığını kontrol edin. `return ( )` içinde noktalı virgül bırakmak bu hataya neden olacaktır.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Bu bileşeni, return ifadesini tek bir satır halinde yazarak düzeltebilirsiniz:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Ya da döndürülen JSX biçimlendirmesini, `return` ifadesinin hemen ardından açılan parantezlerin içine alabilirsiniz:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Hatayı saptayın {/*spot-the-mistake*/}

`Profile` bileşeninin nasıl bildirildiği ve kullanıldığı ile ilgili bazı sorunlar vardır. Hatayı saptayabilir misiniz? (React'in, bileşenleri sıradan HTML elemanlarından nasıl ayırt ettiğini hatırlamaya çalışın!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React bileşen isimleri büyük harfle başlamak zorundadır.

`function profile()` foksiyonun adını `function Profile()` ile değiştirin ve ardından her `<profile />` bileşenini `<Profile />` ile değiştirin:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Kendi bileşeniniz {/*your-own-component*/}

Sıfırdan bir bileşen yazın. Bu bileşene herhangi bir isim verebilir ve istediğiniz biçimlendirmeyi döndürebilirsiniz. Eğer aklınıza gelen bir fikir yoksa, `<h1>Aferin!</h1>` gösteren bir `Congratulations` bileşeni yazın. Bileşeni dışarı aktarmayı unutmayın!

<Sandpack>

```js
// Aşağı bileşeninizi yazın!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Aferin!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
