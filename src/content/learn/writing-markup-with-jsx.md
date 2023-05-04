---
title: JSX ile İşaretleme (Markup) Yazma
---

<Intro>

*JSX*, bir JavaScript dosyası içinde HTML benzeri biçimlendirme (markup) yazmanıza olanak tanıyan bir JavaScript söz dizimi uzantısıdır. Bileşen yazmanın başka yolları olsa da çoğu React geliştiricisi, JSX'in sağladığı kolaylığı tercih eder ve çoğu kod tabanı (codebase) bunu kullanır.

</Intro>

<YouWillLearn>

* React neden biçimlendirmeyi, render ile birleştirir?
* JSX'in HTML'den farkı nedir?
* JSX ile veri nasıl gösterilir?

</YouWillLearn>

## JSX: Biçimlendirmeyi JavaScript'e dönüştürme {/*jsx-putting-markup-into-javascript*/}

Web; HTML, CSS ve JavaScript üzerine inşa edilmiştir. Uzun yıllar boyunca web geliştiricileri, içeriği HTML'de, tasarımı CSS'te ve mantığı JavaScript'te -genellikle ayrı dosyalarda- tuttular! İçerik, HTML içinde tanımlanırken sayfanın mantığı, JavaScript'te ayrı olarak saklanıyordu:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Ancak Web daha etkileşimli hale geldikçe mantık, içeriğin önüne geçti. HTML'den JavaScript sorumluydu! İşte bu nedenle **React'te render mantığı ve biçimlendirme aynı yerde (bileşenlerde) birlikte bulunur.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Önceki HTML ve JavaScript örneklerinin birlikte kullanıldığı React bileşeni. isLoggedIn fonksiyonunu çağıran sarı ile vurgulanan bölüm Sidebar fonksiyonudur. Mor renkle vurgulanan işlevin içinde, daha önceki p etiketi ve bir sonraki şemada gösterilen bileşene referans veren bir Form etiketi bulunur.">

`Sidebar.js` React bileşeni

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Önceki HTML ve JavaScript örneklerinin birlikte kullanıldığı React bileşeni. Sarı renkle vurgulanmış onClick ve onSubmit yöneticilerini içeren bölüm, Form fonksiyonudur. Bu fonksiyondan sonra, mor renkle vurgulanmış HTML gelir. HTML, her biri onClick prop'una sahip girdilerden oluşan bir form öğesini içerir.">

`Form.js` React bileşeni

</Diagram>

</DiagramGroup>

Bir butonun render mantığını ve biçimlendirmesini bir arada tutmak, her değişiklikte birbirleriyle senkronize kalmalarını sağlar. Aksine, butonun biçimlendirmesi ve kenar çubuğunun biçimlendirmesi gibi birbiriyle ilgisi olmayan ayrıntılar, birbirinden izole edilir. Böylece herhangi birinin tek başına değiştirilmesi daha güvenli hale gelir.

Her React bileşeni; React'ın, tarayıcıda render ettiği bazı işaretlemeler içerebilen bir JavaScript fonksiyonudur. React bileşenleri, bu işaretlemeyi temsil etmek için JSX adı verilen bir söz dizimi uzantısı kullanır. JSX, HTML'e çok benzer ancak biraz daha katı kurallara sahiptir ve dinamik verileri gösterebilir. Bu konuyu anlamanın en etkili yolu, birkaç HTML'i JSX'e dönüştürerek uygulamalı olarak pratik yapmaktır.

<Note>

JSX ve React, iki ayrı kavramdır. Bunlar çoğunlukla birlikte kullanılır. Ancak, [bunları bağımsız olarak da](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) *kullanabilirsiniz*. JSX bir söz dizimi uzantısıdır, React ise bir JavaScript kütüphanesidir.

</Note>

## HTML'i JSX'e Dönüştürme {/*converting-html-to-jsx*/}

Elinizde (tamamen geçerli) bir HTML olduğunu varsayalım:

```html
<h1>Hedy Lamarr's Todos</h1>
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

Ve bunu bileşeninize koymak istiyorsunuz:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Olduğu gibi kopyalayıp yapıştırırsanız çalışmayacaktır:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Bunun nedeni JSX'in HTML'den daha katı ve fazla kurala sahip olmasıdır! Yukarıdaki hata mesajları, biçimlendirmeyi düzeltmeniz için size yol gösterecektir. Hatayı çözmek için aşağıdaki kılavuzu da takip edebilirsiniz.

<Note>

Çoğu zaman, React'ın ekrandaki hata mesajları, sorunun nerede olduğunu bulmanıza yardımcı olacaktır. Takıldığınız yerde onları okuyun!

</Note>

## JSX Kuralları {/*the-rules-of-jsx*/}

### 1. Tek bir kök eleman döndürür {/*1-return-a-single-root-element*/}

Bileşenden birden fazla öğe döndürmek için **bunları, tek bir ana etiketle sarın**

Örneğin, `<div>` kullanabilirsiniz:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Eğer fazladan bir `<div>` eklemek istemezseniz `<>` and `</>` kullanabilirsiniz:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Bu boş etiket, *[Fragment](/reference/react/Fragment)* olarak adlandırılır. Fragment'lar, tarayıcı HTML ağacında, herhangi bir iz bırakmadan, öğeleri gruplandırmanıza olanak tanır.

<DeepDive>

#### Neden birden fazla JSX etiketinin sarılması gerekiyor? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX, HTML gibi görünür ancak arka planda JavaScript nesnelerine dönüştürülür. Bir fonksiyondan iki nesneyi, bir diziye sarmadan döndüremezsiniz. Bu, iki JSX etiketini başka bir etikete veya bir Fragment'e sarmadan neden döndüremediğinizi de açıklar.

</DeepDive>

### 2. Tüm etiketleri kapatın {/*2-close-all-the-tags*/}

JSX, etiketlerin bariz bir şekilde kapatılmasını gerektirir: `<img>` gibi kendiliğinden kapanan etiketler, `<img />` bu şekilde kapatılmalıdır.`<li>oranges` gibi etiketler`<li>oranges</li>` şeklinde sarmalanmalıdır.

Hedy Lamarr'ın fotoğraf ve liste öğeleri bu şekilde kapatılmıştır:

```js {2-6,8-10}
<>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>her şey</s> çoğu şey! {/*3-camelcase-salls-most-of-the-things*/}

JSX, JavaScript'e dönüşür ve JSX'te yazılan özellikler JavaScript nesnelerinin anahtarları haline gelir. Kendi bileşenlerinizde, genellikle bu özellikleri, değişken olarak okumak isteyeceksiniz. Ancak JavaScript'in değişken adları konusunda sınırlamaları vardır. Örneğin, adları tire içeremez veya `class` gibi rezerve edilmiş sözcükler olamaz.

Bu nedenle, React'te, birçok HTML ve SVG özellikleri camelCase ile yazılır. Örneğin, `stroke-width` yerine `strokeWidth`. `class` rezerve edilmiş sözcük olduğu için React'te, bunun yerine [ilgili DOM özelliğinden](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) sonra `className` yazarsınız:

```js {4}
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

[Tüm bu nitelikleri DOM bileşeni prop'ları listesinde](/reference/react-dom/components/common) bulabilirsiniz. Eğer yanlış yaparsanız endişelenmeyin-React [tarayıcı konsoluna](https://developer.mozilla.org/docs/Tools/Browser_Console), yanlışınızı düzeltmeniz için bir mesaj yazdıracaktır.

<Pitfall>

Tarihi nedenlerden dolayı, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) ve [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) özellikleri HTML'de olduğu gibi tire ile yazılır.

</Pitfall>

### Uzman Tavsiyesi: JSX Dönüştürücü Kullanın {/*pro-tip-use-a-jsx-converter*/}

Mevcut biçimlendirmede, tüm bu özellikleri dönüştürmek can sıkıcı olabilir! Mevcut HTML ve SVG'nizi JSX'e çevirmek için bir [dönüştürücü](https://transform.tools/html-to-jsx) kullanmanızı öneririz. Dönüştürücüler pratikte çok kullanışlıdır. Yine de kendi başınıza rahatça JSX yazabilmeniz için neler olup bittiğini anlamakta fayda vardır.

İşte final sonucunuz:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Artık JSX'in neden var olduğunu ve bileşenlerde nasıl kullanılacağını biliyorsunuz:

* React bileşenleri, birbirleriyle ilişkili oldukları için render mantığını biçimlendirme ile birlikte gruplandırır.
* JSX, birkaç farkla HTML'e benzer. Eğer ihtiyacınız olursa [dönüştürücü](https://transform.tools/html-to-jsx) kullanabilirsiniz.
* Hata mesajları, genellikle biçimlendirmenizi düzeltmeniz için size doğru yolu gösterecektir.

</Recap>



<Challenges>

#### Aşağıdaki HTML'i JSX'e dönüştürün {/*convert-some-html-to-jsx*/}

Bu HTML bir bileşene eklenmiş ancak geçerli bir JSX değildir. Bunu düzeltiniz:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Elle mi yoksa dönüştürücü kullanarak mı yapacağınız size kalmış!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
