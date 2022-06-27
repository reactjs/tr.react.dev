---
id: faq-functions
title: Bileşenlere Fonksiyon Gönderilmesi
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Bir bileşene nasıl olay yöneticisi gönderebilirim? (onClick gibi) {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Olay yöneticileri ve diğer fonksiyonlar alt bileşenlere prop olarak aktarılabilir:

```jsx
<button onClick={this.handleClick}>
```

Eğer olay yöneticisi içinden  bir üst bileşene erişmeniz gerekiyorsa, fonksiyonu aynı zamanda bileşene bağlamanız gerekir. (aşağıya bakın).

### Bir fonksiyonu bir bileşene nasıl bağlarım? {#how-do-i-bind-a-function-to-a-component-instance}

Fonksiyonların `this.props` ve `this.state` gibi bileşen niteliklerine erişmelerini sağlamak için çeşitli yollar vardır. Bunlar hangi sözdizimi ve yapı adımlarını kullandığınıza bağlı olarak değişebilir.

#### Yapılandırıcı içinde bağlamak (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

<<<<<<< HEAD
#### Sınıf Özellikleri {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Not: bu sözdizimi deneyseldir ve henüz standartlaştırılmamıştır.
=======
#### Class Properties (ES2022) {#class-properties-es2022}

```jsx
class Foo extends Component {
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246
  handleClick = () => {
    console.log('Click happened');
  };
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Render içerisinde bağlamak {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>**Not:**
>
>Render içerisinde `Function.prototype.bind` kullanmak, bileşen her render edildiğinde yeni bir fonksiyon oluşturur. Bu da performans kayıplarına sebep olabilir.

#### Render içerisinde ok fonksiyonu {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**Not:**
>
>Render içerisinde ok fonksiyonu kullanmak, bileşen her render edildiğinde yeni bir fonksiyon oluşturur. Bu da, katı bir kimlik karşılaştırmasına dayalı performans kayıplarına yol açabilir.

### Render metodu içerisinde ok fonksiyonu kullanmak doğru mudur? {#is-it-ok-to-use-arrow-functions-in-render-methods}

Genel olarak konuşursak, evet doğrudur ve genellikle parametreleri geri çağırma fonksiyonlarına (callback) göndermenin en kolay yoludur.

Eğer performans sorunlarınız varsa, optimize edin!

### Fonksiyonları bağlamak neden gerekli? {#why-is-binding-necessary-at-all}

JavaScript'te aşağıdaki iki kod parçacığı aynı **değil**dir.

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Metodları bağlamak, ikinci kod parçacığının birincisiyle aynı şekilde çalışmasını sağlar.

React'te genellikle sadece diğer bileşenlere *gönderdiğiniz* metodları bağlamanız gerekir. Örneğin `<button onClick={this.handleClick}>`, `this.handleClick` fonksiyonunu göndermektedir. Bu yüzden bu metodu bağlamanız gerekir. Ancak `render` metodunu veya diğer yaşam döngüsü metodlarını bağlamak gereksizdir çünkü bunlar diğer bileşenlere aktarılmazlar.

[Yehuda Katz'ın bu yazısı](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) bağlamanın ne olduğunu ve fonksiyonların JavaScript'te nasıl çalıştıklarını detaylı olarak açıklamaktadır.

### Neden fonksiyonum, bileşen her render olduğunda yeniden çağırılıyor? {#why-is-my-function-being-called-every-time-the-component-renders}

Fonksiyonu bir bileşene aktardığınızda, onu _çağırmadığınızdan_ emin olun.

```jsx
render() {
  // Yanlış: handleClick referans olarak aktarılmak yerine çağırılıyor!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

Bunun yerine, *fonksiyonun kendisini aktarın* (parantezler olmadan):

```jsx
render() {
  // Doğru: handleClick referans olarak aktarılıyor!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### Bir olay yöneticisine veya geri çağırma fonksiyonuna nasıl parametre gönderirim? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Bir olay yöneticisini sarmalamak ve parametre göndermek için ok fonksiyonunu kullanabilirsiniz:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Bu `.bind`'ı çağırmakla aynıdır:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Örnek: Parametreleri ok fonksiyonu kullanarak göndermek {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII karakter kodu

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Örnek: Veri niteliklerini kullanarak parametre göndermek {#example-passing-params-using-data-attributes}

Alternatif olarak, olay yöneticileri için gereken verileri saklamak için DOM API'lerini kullanabilirsiniz. Çok sayıda öğeyi optimize etmeniz gerekiyorsa veya React.PureComponent eşitlik kontrollerine dayanan bir render ağacına sahipseniz bu yaklaşımı göz önünde bulundurun.

```jsx
const A = 65 // ASCII karakter kodu

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Bir fonksiyonun arka arkaya çok defa veya çok hızlı bir şekilde çağırılmasını nasıl önleyebilirim? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

`onClick` veya `onScroll` gibi bir olay yöneticiniz varsa ve geri çağırılmanın çok hızlı bir şekilde başlatılmasını istemiyorsanız, aşağıdaki yöntemlerle yürütülme sıklığını sınırlayabilirsiniz. 

- **daraltma**: değişiklikleri zamana dayalı bir frekansa göre örnekler (örneğin [`_.throttle`](https://lodash.com/docs#throttle))
- **sıçrama önleme**: belirli bir süre işlem yapılmadığında tetiklenir (örneğin [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` daraltması**: değişiklikleri [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)'e dayanarak örnekler (örneğin [`raf-schd`](https://github.com/alexreardon/raf-schd))

`Daraltma` ve `sıçrama önleme` karşılaştırması için [bu görselleştirme](http://demo.nimius.net/debounce_throttle/)'ye bakınız.

> Not:
>
> `_.debounce`, `_.throttle` ve `raf-schd` geciken geri çağırmaları iptal etmek için bir `cancel` metodu sağlarlar.  Bu metodu `componentWillUnmount` içinden çağırmalı _ya da_ bileşenin hala geciken fonksiyon içinde bağlı olduğundan emin olmalısınız.

#### Daraltma {#throttle}

Daraltma, bir fonksiyonun belirli bir zaman aralığında bir defadan fazla çağırılmasını önler. Aşağıdaki örnekte bir "tıklama" olay yöneticisinin saniyede birden çok kez çağırılması daraltma yöntemiyle önlenmiştir.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Sıçrama önleme {#debounce}

Sıçrama önleme, bir fonksiyonun son çağırıldığı andan itibaren belirli bir süre geçinceye kadar tekrar yürütülmemesini sağlar. Bu, çok hızlı bir şekilde tetiklenebilecek bir olay yöneticisine (örneğin klavye veya kaydırma olaylarına) yanıt olarak masraflı hesaplamalar yapmanız gerektiği zamanlarda çok yararlı olabilir. Aşağıdaki örnekte olay yöneticisi, 250ms boyunca metin girişi olmadığında çağırılmak üzere kurulmuştur.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` daraltması {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), render edilme performansını artırmak için bir metodun tarayıcıda en uygun zamanda çalıştırılmak üzere sıraya konulması işlemidir. `requestAnimationFrame` ile sıraya konulan bir fonksiyon, bir sonraki çerçevede çalıştırılır. Tarayıcılar, saniyede 60 kare (60 fps) görüntü sunulduğundan emin olmak için yüksek çaba sarf eder. Ancak bunu başaramadıklarında, saniyede gösterilen kare sayısı doğal olarak limitlenecektir. Örneğin bir cihaz saniyede sadece 30 kare işleyebilecek kapasitedeyse, saniyede maksimum 30 kare görüntü gösterebilir. `requestAnimationFrame` daraltması, bir saniyede 60'tan fazla güncelleme yapılmasını önleyen kullanışlı bir tekniktir. Eğer saniyede 100 güncelleme yapıyorsanız, kullanıcılarınızın zaten göremeyeceği ama tarayıcıya ek yük bindiren gereksiz işlemler yapıyor olabilirsiniz.

>**Not:**
>
>Bu tekniğin kullanılması sadece bir çerçevede yayınlanan son değeri yakalayacaktır. Bu optimizasyonun nasıl çalıştığının bir örneğini [`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)'de görebilirsiniz.

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Güncellemeleri planlamak için yeni bir fonksiyon oluşturulur.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Bir kaydırma etkinliği alındığında, bir güncelleme planlanır.
    // Bir çerçeve içinde birçok güncelleme alınırsa, sadece en son değer yayınlanır.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Bileşen umnount edileceğinden, bekleyen tüm güncellemeler iptal edilir.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Sıklık sınırlamasının test edilmesi {#testing-your-rate-limiting}

Sıklık sınırlaması (rate limiting) kodunuzun doğru çalışıp çalışmadığını test ederken, zamanı ileri sarabilme özelliğine sahip olmak çok yardımcı olacaktır. Eğer [`jest`](https://facebook.github.io/jest/) kullanıyorsanız, zamanı ileri sarmak için [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) kullanabilirsiniz. Eğer `requestAnimationFrame` daraltması kullanıyorsanız, [`raf-stub`](https://github.com/alexreardon/raf-stub) animasyon çerçevelerini ileri sarmak için kullanışlı bir araç olabilir.
