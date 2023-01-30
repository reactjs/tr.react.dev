---
id: refs-and-the-dom
title: Ref'ler ve DOM
permalink: docs/refs-and-the-dom.html
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
---

<<<<<<< HEAD
Ref'ler, render metodu içerisinde oluşturulan DOM düğümümlerine veya React elemanlarına erişmeyi sağlar. 
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Referencing Values with Refs](https://beta.reactjs.org/learn/referencing-values-with-refs)
> - [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
> - [`useRef`](https://beta.reactjs.org/reference/react/useRef)
> - [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Refs provide a way to access DOM nodes or React elements created in the render method.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

React'ın tipik veri akışında, [prop'lar](/docs/components-and-props.html) üst bileşenlerin alt bileşenleri ile etkileşime geçmelerinin tek yoludur. Bir alt bileşeni düzenlemek için, onu yeni prop'lar ile yeniden render edersiniz. Fakat, birkaç senaryo vardır ki bir alt bileşeni tipik veri akışının dışında mecburi olarak düzenlemeniz gerekebilir. Düzenlenecek olan bir alt bileşen, bir React bileşeni'nin nesnesi veya bir DOM elemanı olabilir. Her iki durum için de React bir çıkış yolu sağlar. 

### Ref'ler Ne Zaman Kullanılmalıdır {#when-to-use-refs}

Ref'leri kullanmak için birkaç iyi kullanım senaryosu bulunmaktadır: 

* Focus olayını, metin seçmeyi veya yeniden ortam oynatmayı yönetmek,
* Animasyonları tetiklemek,
* Üçüncü-parti DOM kütüphanelerini entegre etmek

Bildirimsel (declarative) olarak halledilebilecek durumlar için ref'leri kullanmaktan kaçının.

Örneğin, bir `Dialog` bileşeni için `open()` ve `close()` metodlarını kullanmak yerine, `isOpen` prop'unu `Dialog`'a atayabilirsiniz.

### Ref'leri Aşırı Kullanmayın {#dont-overuse-refs}

Ref'leri kullanmaktaki ilk eğiliminiz uygulamanızdaki bazı şeyleri gerçekleştirmek için olabilir. Eğer durum bu ise bekleyin ve state'in bileşen hiyerarşisinde nerede tutulması gerektiği hakkında biraz daha eleştirel düşünün. Bununla ilgili örnekler için [State'i Yukarı Taşıma](/docs/lifting-state-up.html) rehberini inceleyebilirsiniz.

> Not
>
> Aşağıdaki örnekler React 16.3 ile gelen `React.createRef()` API'sini kullanabilmek için güncellenmiştir. React'in önceki sürümlerini kullanıyorsanız, [callback ref'lerini](#callback-refs) kullanmanızı tavsiye ederiz.

### Ref'ler Oluşturma {#creating-refs}

Ref'ler, `React.createRef()` kullanılarak oluşturulur ve React elemanlarına `ref` özelliğini kullanarak eklenir. Ref'ler genellikle bir bileşen oluşturulduğunda, bir nesnenin özelliğine atanır. Böylelikle refler bileşen boyunca referans alınabilir.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Ref'lere Erişim {#accessing-refs}

Bir ref, `render` içerisinde bir elemena aktarıldığında, o düğüme bağlı bir referans, ref'in `current` özelliğinde erişilebilir hale gelir.

```javascript
const node = this.myRef.current;
```

Ref'in değeri, düğüm türüne bağlı olarak değişir.

- `ref` özelliği bir HTML elemanında kullanıldığında, constructorda `React.createRef()` ile oluşturulan `ref`, esas DOM elemanını kendisinin `current` özelliği olarak alır.
- `ref` özelliği özel bir sınıf bileşininde kullanıldığında, ref nesnesi yerleştirilmiş bileşeninin nesnesini `current` olarak alır.
- **`ref` özelliğini fonksiyon bileşeni içerisinde kullanamazsınız** çünkü fonksiyon bileşenlerinin nesneleri olmaz.

Aşağıdaki örnekler farklılıkları göstermektedir.

#### DOM Elemanına Ref Ekleme {#adding-a-ref-to-a-dom-element}

Bu kod, bir DOM düğümüne bağlı referans tutmak için `ref` kullanır:


```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // textInput DOM elemanını kaydetmek için bir ref oluşturun
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // DOM API kullanarak text input'a odaklanın
    // Not : DOM düğümünü getirmek için "current"ı kullanırız.
    this.textInput.current.focus();
  }

  render() {
    // React’a, constructor içerisinde oluşturduğumuz `textInput`u ile
    //<input> ref'i ile ilişkilendirmek istediğimizi belirtin.
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

Bileşen eklendiğinde, React, `current` özelliğini DOM elemanı ile atar ve bileşen çıkarıldığında geri `null` atanır. `ref` güncellemeleri `componentDidMount` veya `componentDidUpdate` yaşam döngüsü metodlarından önce gerçekleşir.

#### Sınıf Bileşenine Ref Ekleme {#adding-a-ref-to-a-class-component}

Yukarıdaki `CustomTextInput`un, eklendikten hemen sonra tıklandığı senaryosunu simüle etmek istediğimizde, özel input'a erişmek için ve onun `focusTextInput` metodunu çağırmak için ref kullanabiliriz.

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Bu sadece `CustomTextInput` bir sınıf olarak tanımlandığında çalışır.

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refler ve Fonksiyon Bileşenleri {#refs-and-function-components}

** Varsayılan olarak, `ref` özelliğini fonksiyon bileşenleri içerisinde kullanmazsınız**. Çünkü fonksiyon bileşenlerinin nesneleri olmaz.

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Bu çalışmayacaktır!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Insanların fonksiyon bileşeniniz için `ref` kullanmalarına izin vermek isterseniz, [`forwardRef`](/docs/forwarding-refs.html) (muhtemelen [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) ile birlikte) kullanabilir, ya da bileşeninizi bir sınıfa çevirebilirsiniz.

Bir DOM elemanına veya sınıf bileşenine işaret ettiğiniz sürece **fonksiyon bileşeni içerisinde `ref` kullanabilirsiniz**

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput'u burada tanımlanmalıdır. Böylelikle ref onu işaret edebilir.
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### DOM Ref'lerini Üst Bileşenlerde Açığa Çıkarma {#exposing-dom-refs-to-parent-components}

Nadir durumlarda, bir alt bileşenin DOM düğümüne üst bileşenden erişmek isteyebilirsiniz. Bu genelde önerilmez; çünkü bileşenin kapsüllemesini (encapsulation) bozar. Ancak bazen odağı tetiklemek veya bir child DOM düğümünün boyutunu veya konumunu hesaplamak için faydalı olabilir.

[Alt bileşene ref ekleyebilirsiniz](#adding-a-ref-to-a-class-component). Ancak bu ideal bir çözüm değildir. DOM düğümünden ziyade sadece bir tane bileşen nesnesi alırsınız. Ek olarak bu, fonksiyon bileşenleri ile çalışmaz.

React 16.3 veya daha üst bir versiyonunu kullanırsanız, bu durumlar için [Ref Yönlendirme](/docs/forwarding-refs.html) kullanmanızı tavsite ederiz. **Ref yönlendirme, bileşenlerin, alt bileşenin ref'ini kendilerinin gibi göstermesini sağlar**. Bir alt bileşenin Dom düğümünü üst bileşende nasıl kullanacağınızın daha detaylı örneğini [Ref Yönlendirme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) dökümanında bulabilirsiniz.

React 16.2 veya daha eski bir versiyonu kullanıyorsanız, veya ref yönlendirme ile sağlanan esneklikten daha fazla esnekliğe ihtiyacınız varsa, [bu alternatif yaklaşımı](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) kullanabilirsiniz ve bir ref'i farklı isimlendirilmiş bir prop olarak aktarabilirsiniz.

Mümkünse, DOM birimlerini açığa çıkarmamanızı tavsiye ederiz. Ancak faydalı bir kaçış yolu olabilir. Bu yaklaşımın, alt bileşene bazı kodlar eklemenizi gerektirdiğini unutmayın. Alt bileşen üzerinde herhangi bir kontrolünüz yoksa, son seçeneğiniz [`findDOMNode()`](/docs/react-dom.html#finddomnode) kullanmak olabilir. Ama bu [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) içerisinde kullanımdan kaldırılmıştır.

### Callback Refs {#callback-refs}

React ayrıca, "callback refs" adı verilen refleri ayarlamanın başka bir yolunu da destekler. Bu, ref'ler ayarlandıklarında veya ayarlanmadıkları zamanlarda daha fazla kontrol'e sahip olmalarını sağlar.

`createRef()` tarafından oluşturulan bir `ref`i aktarmaktansa, bir fonksiyon aktarabilirsiniz. Fonksiyon, React bileşeninin nesnesini veya HTML DOM elemanını bir argüman olarak alır, böylelikle bileşenin nesnesi başka bir yerde saklanabilir ve erişilebilir.

Aşağıdaki örnekte yaygın bir kullanım uygulanmıştır. `ref` callback'i kullanarak bir nesnenin özelliğinde
DOM düğümüne bir referans kaydedilir.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
    // DOM API kullanark text input'a odaklanın
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // Eklendikten sonra otomatik olarak odaklanma
    this.focusTextInput();
  }

  render() {
    // Nesne alanında bulunan metin girdisi elemanına bir referans
    // tutmak için `ref` callback'i kullanın. (örneğin, this.textInput)
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React, bileşen eklendiğinde DOM elemanı ile beraber `ref` callback'ini çağırır ve bileşen çıkarıldığında da `null` ile çağırır. Ref'lerin, `componentDidMount` veya `componentDidUpdate` tetiklenmeden önce güncel oldukları garanti edilir.

`React.createRef()` ile oluşturulan nesne ref'leri gibi, Callback ref'lerini de bileşenler arasında aktarabilirsiniz.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

Yukarıdaki örnekte, `Parent`, ref callback'ini `inputRef` prop'u olarak `CustomTextInput`una aktarır ve `CustomTextInput`u aynı fonksiyonu özel bir `ref` özelliği olarak `<input>`a aktarır. Sonuç olarak, `Parent`taki `this.inputElement`i, `CustomTextInput`taki `<input>` elemanına karşılık gelen DOM düğümüne set edilir.

### Eski API: String Refler {#legacy-api-string-refs}

Daha önceden React ile uğraştıysanız, `ref` özelliğinin `"textInput"` gibi bir string olduğu ve DOM düğümüne de `this.refs.textInput` şeklinde erişildiği eski API'a aşina olabilirsiniz. String ref'lerin [bazı sorunlarının](https://github.com/facebook/react/pull/8333#issuecomment-271648615) olması ve **muhtemelen gelecek sürümlerden birinde kaldırılacağı için,** bu kullanımı önermiyoruz.


> Not
> 
> Eğer `this.refs.textInput`'u reflere erişmek için kullanıyorsanız, [`createRef` API](#creating-refs) veya [callback refleri](#callback-refs) seçeneklerinden birini kullanmanızı tavsiye ederiz.

### Callback Ref'lerine Dair Uyarılar {#caveats-with-callback-refs}

Eğer `ref` callback bir satıriçi fonksiyon olarak tanımlanmışsa, güncelleme anında iki kez çağırılacaktır. İlk olarak `null` ile, sonrasında DOM elemanı yeniden çağrılır. Bunun sebebi, fonksiyonun bir nesnesi her render'da oluşturulur. Bu yüzden React eski ref'i kaldırır ve yenisini ekler. Bunu önlemek için  `ref` callback'ini sınıfa bağlı bir metod olarak tanımlayabilirsiniz. Ancak bu, birçok durumda önemli değildir.
