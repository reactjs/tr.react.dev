---
id: state-and-lifecycle
title: State ve Yaşam Döngüsü
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Bu sayfada, state kavramı ve React bileşlerinin yaşam döngüsü tanıtılacaktır. Bileşen API'si hakkında ayrıntılı bilgi için, [bu dokümana](/docs/react-component.html) bakabilirsiniz.

Önceki bölümlerde bahsettiğimiz](/docs/rendering-elements.html#updating-the-rendered-element), analog saat örneğini ele alalım. [Elemetlerin Render Edilmesi](/docs/rendering-elements.html#rendering-an-element-into-the-dom) bölümünde, kullanıcı arayüzünün yalnızca tek yönlü güncellenmesine yer vermiştik. Bunu `ReactDOM.render()` metodu ile geçekleştirebiliyorduk:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

Bu bölümde ise, `Clock` bileşeninin nasıl tekrar kullanılabilir ve izole hale getireceğimize değineceğiz. Bu bileşen, kendi zamanlayıcısını başlatacak ve her saniye kendisini güncelleyecek. 

Öncelikle Clock'u, ayrı bir bileşen halinde sarmalayarak görüntüleyelim:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Güzel görünüyor ancak kritik bir gereksinimi atladık: `Clock` kendi zamanlayıcısını ayarlaması ve her saniye kullanıcı arayüzünü güncellemesi işi Clock bileşeni içerisinde yer almalıydı.

İdeal olarak aşağıdaki kodu bir kere yazdığımızda, `Clock`'un artık kendi kendisini güncellemesini istiyoruz:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Bunu yapmak için, `Clock` bileşenine "state eklememiz gerekiyor.

State'ler, prop'larla benzerlik gösterir. Fakat sadece ilgili bileşene özeldir ve yalnızca o bileşen tarafından kontrol edilirler.

Sınıf olarak oluşturulan bişeşenlerin, fonksiyon bileşenlerine göre bazı ek özelliklerinin bulunduğundan [bahsetmiştik](/docs/components-and-props.html#functional-and-class-components). Bahsettiğimiz ek özellik yerel state değişkenidir ve sadece sınıf bileşenlerine özgüdür.

## Bir Fonksiyonun Sınıfa Dönüştürülmesi {#converting-a-function-to-a-class}

`Clock` gibi bir fonksiyon bileşenini aşağıdaki 5 adımda sınıf bileşenine dönüştürebilirsiniz:

1. Öncelikle, fonksiyon ismiyle aynı isimde bir [ES6 sınıfı](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) oluşturun. Ve bu sınıfı `React.Component`'tan türetin.

2. Sınıfın içerisine, `render()` adında boş bir fonksiyon ekleyin.

3. Fonksiyon bileşeni içerisindeki kodları `render()` metoduna taşıyın.

4. `render()` metodu içerisindeki `props` yazan yerleri, `this.props` ile değiştirin.

5. İçi boşaltılmış fonksiyonu silin.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

Artık `Clock` bileşeni, fonksiyon yerine, bir sınıf bileşeni haline gelmiş oldu.

`render` metodu her güncelleme olduğunda çağrılacaktır. Fakat `<Clock />`'u aynı DOM düğümünde render ettiğimizden dolayı, `Clock` sınıfının yalnızca bir örneği kullanılacaktır.

## Bir Sınıfa Yerel State'in Eklenmesi {#adding-local-state-to-a-class}

`date` değişkenini, props'tan state'e 3 adımda taşıyacağız:

1) `render()` metodundaki `this.props.date`'i `this.state.date` ile değiştirelim:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) `state`'in ilk oluşturulacağı yer olan [sınıf constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)'ını ekleyelim:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

`props`'ı constructor içerisinde nasıl oluşturduğumuza dikkat edin:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Sınıf bileşenleri `React.Component` sınıfından türetildikleri için, daima `super(props)`'u çağırmaları gerekir.

3) `<Clock />` elementinden `date` prop'unu çıkaralım:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Zamanlayıcı kodunu, daha sonra `Clock` bileşenin içerisine ekleyeceğiz. Fakat şimdilik `Clock` bileşeninin son hali aşağıdaki gibi olacaktır:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Şimdi `Clock` bileşenini, kendi zamanlayıcısını kuracak ve her saniye kendisini güncelleyecek şekilde ayarlayalım.

## Bir Sınıfın Yaşam Döngüsü Kodlarının Eklenmesi {#adding-lifecycle-methods-to-a-class}

Birçok bileşene sahip uygulamalarda, bileşenler yok edildiğinde ilgili kaynakların boşaltılması çok önemlidir.

`Clock` bileşeni ilk kez DOM'a render edildiğinde bir [zamanlayıcı](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) kurmak istiyoruz. React'te bu olaya "mounting" (değişkenin takılması) adı verilir.

Ayrıca, `Clock` bileşeni DOM'dan çıkarıldığında silindiğinde zamanlayıcının da [temizlenmesini](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) istiyoruz. React'te bu olaya "unmounting" (değişkenin çıkarılması) adı verilir.

`Clock` bileşeni takılıp çıkarıldığında bazı işleri gerçekleştirebilmek için özel metodlar tanımlayabiliriz:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Bu metodlara "lifecycle methods" (yaşam döngüsü metodları) adı verilir.

Bileşenin çıktısı, DOM'a render edildikten sonra `componentDidMount()` metodu çalıştırılır. Burası aynı zamanda bir zamanlayıcı oluşturmak için en elverişli yerdir:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

`this`'e zamanlayıcı ID'sini nasıl atadığımızı görebilirsiniz.

Daha önce de belirttiğimiz gibi, `this.props` React tarafından yönetiliyor, ve `this.state`'in de özel bir yaşam döngüsü mevcut. Eğer `timerID` gibi veri akışına dahil olmayan değişkenleri saklamanız gerekiyorsa, bu örnekte yaptığımız gibi sınıf içerisinde değişkenler ekleyebilirsiniz.

Oluşturduğumuz zamanlayıcıyı `componentWillUnmount()` yaşam döngüsü metodu içerisinde `Clock` bileşeninden söküp çıkaralım:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Son olarak, `Clock` bileşeninin saniyede bir çalıştıracağı `tick()` fonksiyonunu implement edelim.

`tick()` fonksiyonu, `this.setState()`'i çağırarak `Clock` bileşeninin yerel state'ini güncelleyecektir:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**CodePen'de deneyin**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Artık saat, her saniye başı tikleyerek mevcut zamanı görüntüleyecektir.

Şimdi kısa bir özet geçerek neler yaptığımızı ve sırasıyla hangi metotların çağrıldığını kontrol edelim:

1) `ReactDOM.render()` metoduna `<Clock />` aktarıldığı zaman React, `Clock` bileşeninin constructor'ını çağırır. `Clock` bileşeni, mevcut saati görüntülemesi gerektiğinden dolayı, `this.state`'e o anki zamanı atar. Daha sonra bu state'i güncelleyeceğiz.

2) Daha sonra React, `Clock` bileşeninin `render()` metodunu çağırır. Bu sayede React, ekranda nelerin gösterilmesi gerektiğini bilir. Sonrasında React, `Clock`'un render edilmiş çıktısı ile eşleşmek için ilgili DOM güncellemelerini gerçekleştirir.

3) `Clock` bileşeninin çıktısı DOM'a eklendiğinde React, `componentDidMount()` yaşam döngüsü metodunu çağırır. Bu metodda `Clock` bileşeni, her saniyede bir `tick()` metodunun çalıştırılması gerektiğini tarayıcıya bildirir.

4) Tarayıcı her saniyede bir `tick()` metodunu çağırır. `tick()` metodunda `Clock` bileşeni, kullanıcı arayüzünü güncellemek için `setState()` metodunu çağırır ve bu metoda mevcut tarih/saat değerini aktarır. `setState()`'in çağrılması sayesinde React, state'in değiştiğini anlar ve ekranda neyin görüntüleneceğini anlamak için tekrar `render()` metodunu çağırır. Artık `render()` metodundaki `this.state.date`'in değeri eski halinden farklı olduğundan dolayı, render çıktısı güncellenmiş zamanı içerecek demektir. Buna göre React, DOM'u ilgili şekilde günceller.

5) Eğer `Clock` bileşeni, DOM'dan çıkarılırsa React, `componentWillUnmount()` yaşam döngüsü metodunu çağırır ve zamanlayıcı, tarayıcı tarafından durdurulmuş olur.

## Using State Correctly {#using-state-correctly}

There are three things you should know about `setState()`.

### Do Not Modify State Directly {#do-not-modify-state-directly}

For example, this will not re-render a component:

```js
// Wrong
this.state.comment = 'Hello';
```

Instead, use `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

The only place where you can assign `this.state` is the constructor.

### State Updates May Be Asynchronous {#state-updates-may-be-asynchronous}

React may batch multiple `setState()` calls into a single update for performance.

Because `this.props` and `this.state` may be updated asynchronously, you should not rely on their values for calculating the next state.

For example, this code may fail to update the counter:

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

To fix it, use a second form of `setState()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

We used an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) above, but it also works with regular functions:

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State Updates are Merged {#state-updates-are-merged}

When you call `setState()`, React merges the object you provide into the current state.

For example, your state may contain several independent variables:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Then you can update them independently with separate `setState()` calls:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

The merging is shallow, so `this.setState({comments})` leaves `this.state.posts` intact, but completely replaces `this.state.comments`.

## The Data Flows Down {#the-data-flows-down}

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined as a function or a class.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.

A component may choose to pass its state down as props to its child components:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:

```js
<FormattedDate date={this.state.date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, from the `Clock`'s props, or was typed by hand:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
