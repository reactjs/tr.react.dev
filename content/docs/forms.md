---
id: forms
title: Forms
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML form elemanları, React’te diğer DOM elemanlarından biraz farklı çalışır, çünkü form elemanlarının kendilerine has iç stateleri vardır. Örneğin, bu kod HTML’de bir form içerisinde name girişi ister:

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

This form has the default HTML form behavior of browsing to a new page when the user submits the form. If you want this behavior in React, it just works. But in most cases, it's convenient to have a JavaScript function that handles the submission of the form and has access to the data that the user entered into the form. The standard way to achieve this is with a technique called "controlled components".

## Kontrollü Componentler {#controlled-components}

HTML’de, `<input>`, `<textarea>` ve `<select>` gibi form elemanları genellikle kendi state’ini korur ve kullanıcı girdisine dayalı olarak güncelleşir. React’te ise state’ler genellikle componentlerin this.state özelliğinde saklanır ve yalnızca  [`setState()`](/docs/react-component.html#setstate). ile güncellenir.

React state’te tek kaynak olarak ikisini birleştirebiliriz. Ardından form oluşturan React componenti, sonraki kullanıcı girişi üzerinde bu formda olanı da kontrol eder. Değeri React tarafından bu şekilde kontrol edilen bir giriş form elemanına kontrollü component denir.

Örneğin, bir önceki örnekte, name değerinin yazılıp submit edildiğinde name i alert ile yazdırmak istiyorsak, formu kontrollü bir component olarak oluşturabiliriz:

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

`value` attribute’ü input’un kendisinde zaten var. Öyleyse bu değeri almak için yeni bir React state’i oluşturmaya gerek yok. Bu inputta `value` olarak state’i yazdıracağız ve input’ta her değişiklik olduğunda bu state’i güncelleyeceğiz.

Kontrollü bir componentte her state değişimi, `handleChange` fonksiyonunu çalıştıracaktır. Örneğin, adın büyük harflerle yazılmasını isteseydik, `handleChange` fonksiyonunu şu şekilde yazabilirdik:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Textarea Tagı {#the-textarea-tag}

HTML’de, `<textarea>` tagı yazıyı çocuğunda tanımlar:

```html
<textarea>
  Merhaba, burası textarea yazı alanıdır.
</textarea>
```

Bunun yerine React, `<textarea>` için bir `value` attribute’ü kullanır. Bu şekilde `<textarea>` kullanan bir form, tek satırlı bir girdi kullanan bir forma çok benzer şekilde yazılabilir:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Bu kısma bir şeyler yazınız.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Gönderilen değer: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Gönder" />
      </form>
    );
  }
}
```

`this.state.value` 'in constructor’te başlatıldığına dikkat edin, böylece textarea içerisinde varsayılan olarak bu yazı bulunacaktır

## Select Tagı {#the-select-tag}

HTML’de `<select>`, bir açılır liste oluşturur. Örneğin, aşağıdaki kod bazı meyveleri listeler:

```html
<select>
  <option value="elma">Elma</option>
  <option value="armut">Armut</option>
  <option selected value="havuç">Havuç</option>
  <option value="muz">Muz</option>
</select>
```

`Havuç` seçeneğinin başlangıçta `selected` attribute’ü yüzünden seçili olarak geleceğini unutmayın. React, bu `selected` attribute’ünü kullanmak yerine, `select` etiketinde bir `value` attribute’ü kullanır. Kontrollü bir componentte bu daha kullanışlıdır çünkü yalnızca bir yerde güncelleme yapmanızı sağlar. Örneğin:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'havuç'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Favori meyveniz: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Favori meyveni seç:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="elma">Elma</option>
            <option value="armut">Armut</option>
            <option value="havuç">Havuç</option>
            <option value="muz">Muz</option>
          </select>
        </label>
        <input type="submit" value="Gönder" />
      </form>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Genel olarak bu, `<input type="text">`, `<textarea>` ve `<select>` elementlerinin çok benzer şekilde çalışmasını sağlar.

> Not
>
> Bir `select` etiketinde birden fazla seçeneği seçmenize izin veren bir diziyi `value` attribute’üne yazabilirsiniz:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## The file input Tag {#the-file-input-tag}

In HTML, an `<input type="file">` lets the user choose one or more files from their device storage to be uploaded to a server or manipulated by JavaScript via the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Because its value is read-only, it is an **uncontrolled** component in React. It is discussed together with other uncontrolled components [later in the documentation](/docs/uncontrolled-components.html#the-file-input-tag).

## Çoklu Girişleri Ele Alma {#handling-multiple-inputs}

Çoklu kontrollü `input` öğelerini ele almanız gerektiğinde, her öğeye bir `name` özniteliği ekleyebilir ve işleyici işlevinin `event.target.name` değerine dayanarak ne yapılacağını seçmesine izin verebilirsiniz.

Örneğin:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Verilen girdi ismine karşılık gelen state keyini güncellemek için [ES6 syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names)’ını nasıl kullandığımıza dikkat edin:

```js{2}
this.setState({
  [name]: value
});
```

Bu da ES5’teki eşdeğer kodudur.

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Also, since `setState()` automatically [merges a partial state into the current state](/docs/state-and-lifecycle.html#state-updates-are-merged), we only needed to call it with the changed parts.

## Kontrollü Giriş Boş Değer {#controlled-input-null-value}

[Kontrollü bir component](/docs/forms.html#controlled-components) üzerindeki props’u belirlemek, kullanıcının isteği dışında girişi değiştirmesini önler. `value` belirttiyseniz ancak girdi hala düzenlenebilir ise, yanlışlıkla `value`'i `undefined` veya `null` olarak ayarlamış olabilirsiniz.

Aşağıdaki kod bunu göstermektedir. (Giriş ilk önce kilitlenir ancak kısa bir gecikme sonrasında düzenlenebilir hale gelir.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatives to Controlled Components {#alternatives-to-controlled-components}

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, you might want to check out [uncontrolled components](/docs/uncontrolled-components.html), an alternative technique for implementing input forms.

## Fully-Fledged Solutions {#fully-fledged-solutions}

If you're looking for a complete solution including validation, keeping track of the visited fields, and handling form submission, [Formik](https://jaredpalmer.com/formik) is one of the popular choices. However, it is built on the same principles of controlled components and managing state — so don't neglect to learn them.
