---
id: handling-events
title: Olay Yönetimi
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

React ile olayların yönetimi, DOM elementlerindeki olay yönetimi ile oldukça benzerdir. Bazı söz dizimsel olarak farklılıklar bulunmaktadır: 

* Olay isimleri, DOM'da lowercase iken, React'te camelCase olarak adlandırılır.
* DOM'da fonksiyon isimleri, ilgili olaya string olarak atanırken, JSX'te fonksiyon olarak atanır.

Örneğin HTML'de aşağıdaki gibi olan kod:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React'te biraz daha farklıdır:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

React'teki diğer bir farklılık ise, olaylardaki varsayılan davranışı, `false` değeri döndürerek engelleyemezsiniz. Bunun için `preventDefault` şeklinde yazarak tarayıcıya belirtmeniz gerekir. Örneğin düz bir HTML kodunda, bir `<a>` elementinin yeni bir sayfayı açmasını engellemek için aşağıdaki şekilde yazabilirsiniz:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

React'te ise varsayılan link davranışını `e.preventDefault()` kodu ile engellemeniz gerekir:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

Burada `e`, bir sentetik olaydır. React bu sentetik olayları [W3C şarnamesine](https://www.w3.org/TR/DOM-Level-3-Events/) göre tanımlar. Bu sayede tarayıcılar arası uyumsuzluk problemi oluşmaz. Daha fazla bilgi edinmek için [`Sentetik Olaylar`](/docs/events.html) rehberini inceleyebilirsiniz.

React ile kod yazarken, bir DOM elementi oluşturulduktan sonra ona bir listener atamak için, `addEventListener` fonksiyonunu çağırmanıza gerek yoktur. Bunun yerine, ilgili element ilk kez render olduğunda ona bir listener atamanız doğru olacaktır.

[ES6 sınıfı](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) kullanarak bir bileşen oluşturduğunuzda, ilgili olayın oluşturulması için en yaygın yaklaşım, o sınıf içerisinde bir metodun tanımlanmasıdır. Örneğin aşağıdaki `Toggle` bileşeni, "ON" ve "OFF" durumlarının gerçekleştirilmesi için bir butonu render etmektedir:

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Callback içerisinde `this` erişiminin çalışabilmesi için, `bind(this)` gereklidir
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

JSX callback'lerinde `this` kullanırken dikkat etmeniz gerekmektedir. JavaScript'te, sınıf metotları varsayılan olarak [bağlanmazlar](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind). `this.handleClick`'i `bind(this)` ile bağlamayı unutarak `onClick`'e yazarsanız, fonksiyon çağrıldığında `this` değişkeni `undefined` hale gelecek ve hatalara sebep olacaktır.

Bu durum React'e özgü bir davranış biçimi değildir. Aslen, [fonksiyonların JavaScript'te nasıl çalıştığı](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/) ile ilgilidir. Genellikle, `onClick={this.handleClick}` gibi bir metodu parantez kullanmadan `()`  çağırırken, o metodu `bind` etmeniz gerekir.

Eğer sürekli her metot için `bind` ekleyleyip durmayı istemiyorsanız, bunun yerine farklı yöntemler de kullanabilirsiniz. Eğer henüz deneysel bir özellik olan [public class fields](https://babeljs.io/docs/plugins/transform-class-properties/) yöntemini kullanırsanız, callback'leri bağlamak için sınıf değişkenlerini kullanabilirsiniz:

```js{2-6}
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

Bu yöntem, [Create React App](https://github.com/facebookincubator/create-react-app) ile oluşturulan geliştirim ortamında, varsayılan olarak gelir. Böylece hiçbir ayarlama yapmadan bu yöntemi kullanabilirsiniz.

Eğer bu yöntemi kullanmak istemiyorsanuz, callback içerisinde [ok fonksiyonunu](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) kullanabilirsiniz:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

Bu yöntemin bir dezavantajı vardır. `LoggingButton` bileşeni her render olduğu anda yeni bir callback oluşturulur. Bu olay birçok durumda bir sorun teşkil etmez. Ancak bu callback, prop aracılığıyla alt bileşenlere aktarılırsa, bu bileşenler fazladan render edilebilir. Bu tarz problemlerle karşılaşmamak için, binding işleminin ya sınıfın constructorın'da ya da class fields yöntemi ile yapılmasını öneririz.

## Olay Fonksiyonlarına Parametre Gönderimi {#passing-arguments-to-event-handlers}

Bir döngü içerisinde, olay fonksiyonuna fazladan parametre göndermek isteyebilirsiniz. Örneğin, bir satır `id`'si için, aşağıdaki kodlardan her ikisi de işinizi görecektir: 

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Üstteki iki satır birbiriyle eş niteliktedir. Ve sırasıyla [ok fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ile [`Function.prototype.bind` fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) kullanırlar.

Her iki durum için de `e` parametresi, ID'den sonra ikinci parametre olarak aktarılacak bir React olayını temsil eder. Ok fonksiyonunda bu parametre açık bir şekilde tanımlanırken, `bind` fonksiyonunda ise otomatik olarak diğer parametreler ile birlikte gönderilir.
