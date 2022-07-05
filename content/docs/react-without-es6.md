---
id: react-without-es6
title: React Without ES6
permalink: docs/react-without-es6.html
---

Normalde bir React bileşenini düz JavaScript sınıfı olarak tanımlarsınız:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Merhaba, {this.props.name}</h1>;
  }
}
```

Henüz ES6 kullanmıyorsanız, sınıf yerine `create-react-class` modülünü kullanabilirsiniz:

```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 sınıflarının çalışma şekli bir kaç istisna dışında `createReactClass()`'a benzer.

## Varsayılan Prop'ları Tanımlama {#declaring-default-props}

Fonksiyonlarda ve ES6 sınıflarında `defaultProps`, bileşenin kendisinde özellik olarak tanımlanır.

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

`createReactClass()` ile birlikte obje iletilen bir `getDefaultProps()` fonksiyonu tanımlamanız gerekir.

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## Başlangıç State'ini Ayarlamak {#setting-the-initial-state}

ES6 sınıflarında, başlangıç state'inizi constructor içindeki `this.state`'e atayarak tanımlayabilirsiniz.

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

`createReactClass()` ile birlikte, başlangıç state'inizi döndüren ayrı bir `getInitialState` metodu sağlamanız gerekir.

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding {#autobinding}

ES6 sınıfı olarak kullanılan React bileşenlerinde metodlar, normal ES6 sınıflarındaki mantığın aynısını kullanırlar. Yani nesne ile `this`'i otomatik olarak ilişkilendirmezler. Constructor'da açık bir şekilde `.bind(this)` kullanmanız gerekir.

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Merhaba!'};
    // Bu satır önemli!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // `this.handleClick` bağlı olduğu için olay yöneticisi olarak kullanabiliriz.
    return (
      <button onClick={this.handleClick}>
        Merhaba de
      </button>
    );
  }
}
```

Tüm metodları ilişkilendirdiği için `createReactClass()` ile birlikte bunu kullanmak gereksizdir:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Merhaba!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Merhaba de
      </button>
    );
  }
});
```

Yani ES6 sınıfları ile yazmak, olay yöneticileri için biraz daha taslak kod yazmayı gerektirir ama iyi tarafıysa şudur: Büyük uygulamalarda biraz daha iyi performans gösterir.

Eğer taslak kod yazmak size itici geliyorsa, [ES2022 Sınıf Özellikleri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields) sözdizimini kullanabilirsiniz.


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Merhaba!'};
  }
  // Burada arrow kullanmak, metodu ilişkilendirir.
  handleClick = () => {
    alert(this.state.message);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Merhaba de
      </button>
    );
  }
}
```

Ayrıca başka birkaç tane daha seçeniğiniz bulunmaktadır:

## Mixinler {#mixins}

>**Not:**
>
>ES6, hiç mixin desteği olmadan başlatıldı. Bu nedenle, ES6 sınıfları ile React kullandığınızda mixin desteği yoktur.
>
>**Aynı zamanda, mixin kullanan kod tabanlarında sayısız sorun bulduk [ve yeni kodlarda kullanmanızı tavsiye etmiyoruz](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Bu alan sadece referans için bulunmaktadır.

Bazen çok farklı bileşenler aynı fonksiyonaliteyi paylaşabilirler. Bazen buna [kesişen endişe](https://eksisozluk.com/aspect-oriented-programming--574712?nr=true&rf=cross%20cutting%20concern) denir. `createReactClass` bunun için eski `mixins` sistemini kullanmanıza izin verir.

Sık kullanılan durumlardan biri, bileşenin bir zaman aralığında kendisini güncellemek istemesidir. `setInterval()` kullanmak kolaydır ama hafızadan yer kazanmak için ona ihtiyacınız olmadığında zaman aralığını iptal etmek önemlidir. React size bileşenin yaratılmak ya da yok edilmek üzere olduğunu anlamanız için [hayat döngüsü](/docs/react-component.html#the-component-lifecycle) metodlarını sağlar. Gelin bileşeniniz yok edildiğinde otomatik olarak temizlenen basit bir `setInterval()` fonksiyonunu yaratmak için bu metodları kullanan basit bir mixin yazalım.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Mixin kullan
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Mixinde metod çağır
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React {this.state.seconds} saniyedir çalışıyor.
      </p>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('example'));
root.render(<TickTock />);
```

Eğer bir bileşen birden çok mixin kullanıyor ve birkaç mixini aynı hayat döngüsü metodunda tanımlıyorsa (yani bileşen yok edildiğinde birkaç mixin temizlenmek isteniyorsa), tüm yaşam döngüsü metodlarının çağrılması garanti edilir. Mixin'lerde tanımlanan metodlar, bileşendeki metod çağrılarından sonra listelenen sırayla çalıştırılırlar.
