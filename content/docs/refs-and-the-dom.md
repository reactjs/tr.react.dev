---
id: refs-and-the-dom
title: Ref'ler ve DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Ref'ler, render metodu içerisinde oluşturulan DOM node'larına veya React elemanlarına erişmeyi sağlar. 

React'ın tipik veri akışında, [prop'lar](/docs/components-and-props.html) üst bileşenlerin alt bileşenleri ile etkileşime geçmelerinin tek yoludur. Bir alt bileşeni düzenlemek için, onu yeni prop'lar ile yeniden render edersiniz. Fakat, birkaç senaryo vardır ki bir alt bileşeni tipik veri akışının dışında mecburi olarak düzenlemeniz gerekebilir. Düzenlenecek olan bir alt bileşen, bir React bileşeni'nin nesnesi veya bir DOM elemanı olabilir. Her iki durum içinde, React bir çıkış yolu sağlar. 

### Ref'ler Ne Zaman Kullanılmalıdır {#when-to-use-refs}

Ref'leri kullanmak için birkaç iyi kullanım senaryosu bulunmaktadır: 

* Managing focus, text selection, or media playback.
* Triggering imperative animations.
* Integrating with third-party DOM libraries.

Avoid using refs for anything that can be done declaratively.

Örneğin, bir `Dialog` bileşen'i için `open()` ve `close()` metodlarını kullanmak yerine, `isOpen` prop'unu `Dialog`'a atayabilirsiniz.

### Ref'leri fazla kullanmayın {#dont-overuse-refs}

Ref'leri kullanmakta ki ilk eğiliminiz uygulamanızda ki bazı şeyleri gerçekleştirmek için olabilir. Eğer durum bu ise bekleyin ve state'in bileşen hiyerarşisinde nerede tutulması gerektiği hakkında biraz daha eleştirel düşünün. Bunun ile ilgili örnekler için [State'i yukarı taşıma](/docs/lifting-state-up.html) rehberini inceleyebilirsiniz.

> Not
>
> Aşağıdaki örnekler React 16.3 ile gelen `React.createRef()` API'sini kullanabilmek için güncellenmiştir. React'ın erken sürümlerini kullanıyorsanız eğer, [callback ref'leri](#callback-refs) kullanmanızı tavsiye ederiz.

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

Bir ref, `render` içerisinde bir elemena aktarıldığında, node'a bir referans, ref'in `current` özelliğinde erişilebilir hale gelir.

```javascript
const node = this.myRef.current;
```

Ref'in değeri, node'un türüne bağlı olarak değişir.

- `ref` özelliği bir HTML elemanında kullanıldığında, constructorda `React.createRef()` ile oluşturulan `ref`, esas DOM elemanını kendisinin `current` özelliği olarak alır.
- `ref` özelliği özel bir sınıf bileşininde kullanıldığında,ref nesnesi yerleştirilmiş bileşeninin nesnesini `current` olarak alır.
- **`ref` özelliğini fonksiyon bileşeni içerisinde kullanmayabilirsiniz** çünkü fonksiyon bileşenlerinin nesneleri olmaz.

Aşağıdaki örnekler farklılıkları göstermektedir.

#### DOM Elemanına Ref Ekleme {#adding-a-ref-to-a-dom-element}

Bu kod bir DOM node'una bir referans tutmak için `ref` kullanır:


```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // textInput DOM elemanını kaydetmek için bir ref oluşturulur
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // DOM API kullanark text input'a odaklanın
    // Not : DOM node'unu getirmek için "current"ı kullanırız.
    this.textInput.current.focus();
  }

  render() {
    // React’a <input> ref'i ile ilişkilendirmek istediğimizi belirtiriz.
    // constructor içerisinde oluşturduğumuz `textInput`u ile
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

Yukarıda `CustomTextInput`u eklendikten hemen sonra tıklandığını simüle etmek için,  özel input'a erişmek için ve onun `focusTextInput` metodunu çağırmak için ref kullanabiliriz.

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

#### Refler ve fonksiyon bileşenleri {#refs-and-function-components}

**`ref` özelliğini fonksiyon bileşeni içerisinde kullanmayabilirsiniz** çünkü fonksiyon bileşenlerinin nesneleri olmaz.

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
    //Bu çalışmayacaktır!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Eğer bir ref'e ihtiyacınız varsa, bileşeni sınıfa dönüştürmelisiniz. Tıpkı yaşam döngüsü metodlarında veya state ihtiyacınız olduğunda yaptığınız gibi.


You can, however, **use the `ref` attribute inside a function component** as long as you refer to a DOM element or a class component:
Bir DOM elemanına veya sınıf bileşenine işaret ettiğiniz sürece **fonksiyon bileşeni içerisinde `ref` kullanabilirsiniz**

```javascript{2,3,6,13}
function CustomTextInput(props) {
  //textInput'u burada tanımlanmalıdır. Böylelikle ref onu işaret edebilir
  let textInput = React.createRef();

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

Nadir durumlarda, bir alt bileşenin DOM node'una üst bileşenden erişmek isteyebilirsiniz. Bu genelde önerilmez çünkü bileşenin bileşenin kapsüllemesini bozar. Ancak bazen odağı tetiklemek veya bir child DOM node'un boyutunu veya konumunu hesaplamak için faydalı olabilir.

[Alt bileşene ref ekleyebilirsiniz](#adding-a-ref-to-a-class-component). Ancak bu ideal bir çözüm değildir. DOM node'undan ziyade sadece bir tane bileşen nesnesi alırsınız. Ek olarak, bu fonksiyon bileşenleri ile çalışmaz.

React 16.3 veya daha üst bir versiyonunu kullanırsanız, bu durumlar için [ref yönlendirme](/docs/forwarding-refs.html) kullanmanızı tavsite ederiz. **Ref yönlendirme, bileşenlerin, alt bileşenin ref'ini kendilerinin gibi göstermesini sağlar**. Bir alt bileşenin Dom node'unu üst bileşende nasıl kullanacağınızın daha detaylı örneğini [ref yönlendirme](/docs/forwarding-refs.html#forwarding-refs-to-dom-components) dökümanında bulabilirsiniz.

React 16.2 veya daha eski bir versiyonu kullanıyorsanız, veya ref yönlendirme ile sağlanan esneklikten daha fazla esnekliğe ihtiyacınız varsa, [bu alternatif yaklaşımı](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) kullanabilirsiniz ve bir ref'i farklı isimlendirilmiş bir prop olarak aktarabilirsiniz.

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](/docs/react-dom.html#finddomnode), but it is discouraged and deprecated in [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

Mümkünse, DOM birimlerini açığa çıkarmamanızı tavsiye ederiz. Ancak faydalı bir kaçış yolu olabilir. Bu yaklaşımın, alt bileşene bazı kodlar eklemenizi gerektirdiğini unutmayın. Alt bileşen üzerinde herhangi bir kontrolünüz yoksa, son seçeneğiniz [`findDOMNode()`](/docs/react-dom.html#finddomnode) kullanmak olabilir. Ama bu [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) içerisinde kullanımdan kaldırıldı.

### Callback Refs {#callback-refs}

React ayrıca, "callback refs" adı verilen refleri ayarlamanın başka bir yolunu da destekler. Bu, ref'ler ayarlandıklarında veya ayarlanmadıkları zamanlarda daha fazla kontrol'e sahip olmalarını sağlar.

 
`createRef()` tarafından oluşturulan bir `ref`i aktarmaktansa, bir fonksiyon aktarabilirsiniz. Fonksiyon, React bileşeninin nesnesini veya HTML DOM elemanını bir argüman olarak alır, böylelikle bileşenin nesnesi başka bir yerde saklanabilir ve erişilebilir.



Aşağıdaki örnekte yaygın bir kullanım uygulanmıştır. `ref` callback'i kullanarak bir nesnenin özelliğinde
DOM node'una bir referans kaydedilir.

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
    // DOM text input'unda bir referans kaydetmek için `ref` callback'i kullanın
    // Nesne alanında bir eleman(örneğin, this.textInput)
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

React, bileşen eklendiğinde DOM elemanı ile beraber `ref` callback'ini çağırır ve bileşen çıkarıldığında da `null` ile çağırır. Ref'ler `componentDidMount` veya `componentDidUpdate` tetiklenmeden önce güncel oldukları garanti edilir.

`React.createRef()` ile oluşturulan nesne refleri gibi, Callback ref'lerini de bileşenler arasında aktarabilirsiniz.

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

Yukarıda ki örnekte, `Parent`, ref callback'ini `inputRef` prop'u olarak `CustomTextInput`una aktarır ve `CustomTextInput`u aynı fonksiyonu özel bir `ref` özelliği olarak `<input>`a aktarır. Sonuç olarak, `Parent`taki `this.inputElement`i, `CustomTextInput`taki `<input>` elemanına karşılık gelen DOM node'una set edilir.

### Eski API: String Refler {#legacy-api-string-refs}

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**. 
Daha önceden React ile uğraştıysanız, `ref` özelliğinin `"textInput"` gibi bir string olduğu eski API'ya aşina olabilirsiniz ve DOM node'una da `this.refs.textInput` şeklinde erişilirdi. [Bazı sorunlar](https://github.com/facebook/react/pull/8333#issuecomment-271648615) are considered legacy ve **gelecek sürümlerden birinde kaldırılması muhtemeldir**. 


> Not
> 
> Eğer `this.refs.textInput`'u reflere erişmek için kullanıyorsanız, [`createRef` API](#creating-refs) veya [callback refleri](#callback-refs)nden birini kullanmanızı tavsiye ederiz.

### Caveats with callback refs {#caveats-with-callback-refs}

Eğer `ref` callback bir inline fonksiyon olarak tanımlanmışsa, güncelleme anında iki kez çağırılacaktır. İlk olarak `null` ve daha sonrasında DOM elemanı yeniden çağrılır.. Bunun sebebi, fonksiyonun bir nesnesi her render'da oluşturulur. Bu yüzden React eski ref'i kaldırır ve yenisini ekler. Bunu önlemek için  `ref` callback'ini sınıfa bağlı bir method olarak tanımlayabilirsiniz. Ancak bu birçok durumda önemli değildir.