---
id: state-and-lifecycle
title: State ve Yaşam Döngüsü
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Bu sayfada, state kavramı ve React bileşenlerinin yaşam döngüsü tanıtılacaktır. Bileşen API'si hakkında ayrıntılı bilgi için, [bu dokümana](/docs/react-component.html) bakabilirsiniz.

[Önceki bölümlerde bahsettiğimiz](/docs/rendering-elements.html#updating-the-rendered-element), analog saat örneğini ele alacağız. Hatırlayacağınız gibi, [Elementlerin Render Edilmesi](/docs/rendering-elements.html#rendering-an-element-into-the-dom) bölümünde, kullanıcı arayüzünün yalnızca tek yönlü güncellenmesine yer vermiştik. Bunu `ReactDOM.render()` metodu ile geçekleştirebiliyorduk:

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

Bu bölümde ise, `Clock` bileşenini nasıl sarmalayacağımıza ve tekrar kullanılabilir hale getireceğimize değineceğiz. Bu bileşen, kendi zamanlayıcısını başlatacak ve her saniye kendisini güncelleyecek. 

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

[**CodePen'de Deneyin**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Güzel görünüyor ancak bu aşamada kritik bir gereksinimi atladık: `Clock`'un kendi zamanlayıcısını ayarlaması, ve her saniye kullanıcı arayüzünü güncellemesi işini kendi bünyesinde gerçekleştirmesi gerekiyordu.

Aşağıdaki kodu bir kere yazdığımızda, `Clock`'un artık kendi kendisini güncellemesini istiyoruz:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Bunu yapmak için, `Clock` bileşenine **state** eklememiz gerekiyor.

State'ler, prop'larla benzerlik gösterir. Fakat sadece ilgili bileşene özeldir ve yalnızca o bileşen tarafından kontrol edilirler.

Sınıf olarak oluşturulan bileşenlerin, fonksiyon bileşenlerine göre bazı ek özelliklerinin bulunduğundan [bahsetmiştik](/docs/components-and-props.html#functional-and-class-components). Bahsettiğimiz ek özellik yerel state değişkenidir ve sadece sınıf bileşenlerine özgüdür.

## Bir Fonksiyonun Sınıfa Dönüştürülmesi {#converting-a-function-to-a-class}

`Clock` gibi bir fonksiyon bileşenini 5 adımda sınıf bileşenine dönüştürebilirsiniz:

1. Öncelikle, fonksiyon ismiyle aynı isimde bir [ES6 sınıfı](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) oluşturun. Ve bu sınıfı `React.Component`'tan türetin.

2. Sınıfın içerisine, `render()` adında boş bir fonksiyon ekleyin.

3. Fonksiyon bileşeni içerisindeki kodları `render()` metoduna taşıyın.

4. `render()` metodu içerisindeki `props` yazan yerleri, `this.props` ile değiştirin.

5. Son olarak, içi boşaltılmış fonksiyonu tamamen silin.

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

[**CodePen'de Deneyin**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

Önceden fonksiyon bileşeni olan `Clock`, artık bir sınıf bileşeni haline gelmiş oldu.

Bu kodda `render` metodumuz, her güncelleme olduğunda yeniden çağrılacaktır. Fakat `<Clock />` bileşenini aynı DOM düğümünde render ettiğimizden dolayı, `Clock` sınıfının yalnızca bir örneği kullanılacaktır.

## Bir Sınıfa Yerel State'in Eklenmesi {#adding-local-state-to-a-class}

`date` değişkenini, props'tan state'e taşımamız gerekiyor. Bunu 3 adımda gerçekleştirebiliriz:

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

2) `state`'in ilk kez oluşturulacağı yer olan [sınıf constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)'ını ekleyelim:

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

`props`'ı, constructor içerisinde nasıl oluşturduğumuza yakından bakalım:

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

Birçok bileşene sahip uygulamalarda, bileşenler yok edildiğinde ilgili kaynakların bırakılması çok önemlidir.

`Clock` bileşeni ilk kez DOM'a render edildiğinde bir [zamanlayıcı](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) kurmak istiyoruz. React'te bu olaya "mounting" (değişkenin takılması) adı verilir.

Ayrıca, `Clock` bileşeni DOM'dan çıkarıldığında, zamanlayıcının da [temizlenmesini](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) istiyoruz. React'te bu olaya "unmounting" (değişkenin çıkarılması) adı verilir.

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

`this`'e (`this.timerID`) zamanlayıcı ID'sini nasıl atadığımızı inceleyebilirsiniz.

Daha önce de belirttiğimiz gibi, `this.props` React tarafından yönetiliyor, ve `this.state`'in de özel bir yaşam döngüsü var. Eğer `timerID` gibi veri akışına dahil olmayan değişkenleri saklamanız gerekiyorsa, bu örnekte yaptığımız gibi sınıf içerisinde değişkenler tanımlayabilirsiniz.

Oluşturduğumuz zamanlayıcıyı `componentWillUnmount()` yaşam döngüsü metodu içerisinde `Clock` bileşeninden söküp çıkaralım:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Son olarak, `Clock` bileşeninin saniyede bir çalıştıracağı `tick()` fonksiyonunu kodlayalım.

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

[**CodePen'de Deneyin**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Artık saat, her saniye başı tikleyerek mevcut zamanı görüntüleyecektir.

Şimdi kısa bir özet geçerek neler yaptığımızı ve sırasıyla hangi metotların çağrıldığını kontrol edelim:

1) `ReactDOM.render()` metoduna `<Clock />` aktarıldığı zaman React, `Clock` bileşeninin constructor'ını çağırır. `Clock` bileşeni, mevcut saati görüntülemesi gerektiğinden dolayı, `this.state`'e o anki zamanı atar. Daha sonra bu state güncellenecektir.

2) Devamında React, `Clock` bileşeninin `render()` metodunu çağırır. Bu sayede React, ekranda nelerin gösterilmesi gerektiğini bilir. Sonrasında ise `Clock`'un render edilmiş çıktısı ile eşleşmek için ilgili DOM güncellemelerini gerçekleştirir.

3) `Clock` bileşeninin çıktısı DOM'a eklendiğinde, yaşam döngüsündeki `componentDidMount()` metodu çağrılır. Bu metodda `Clock` bileşeni, her saniyede bir `tick()` metodunun çalıştırılması gerektiğini tarayıcıya bildirir.

4) Tarayıcı her saniyede bir `tick()` metodunu çağırır. `tick()` metodunda `Clock` bileşeni, kullanıcı arayüzünü güncellemek için `setState()` metodunu çağırır ve bu metoda mevcut tarih/saat değerini aktarır. `setState()`'in çağrılması sayesinde React, state'in değiştiğini anlar ve ekranda neyin görüntüleneceğini anlamak için tekrar `render()` metodunu çağırır. Artık `render()` metodundaki `this.state.date`'in değeri eski halinden farklı olduğundan dolayı, render çıktısı güncellenmiş zamanı içerecek demektir. Buna göre React, DOM'ı ilgili şekilde günceller.

5) Eğer `Clock` bileşeni, DOM'dan çıkarılırsa, yaşam döngüsündeki `componentWillUnmount()` metodu çağrılır ve tarayıcı tarafından zamanlayıcı durdurulmuş olur.

## State'in Doğru Kullanımı {#using-state-correctly}

`setState()` hakkında bilmeniz gereken 3 şey bulunmaktadır.

### State'i Direkt Olarak Değiştirmeyiniz {#do-not-modify-state-directly}

Aşağıdaki kod, bileşenin yeniden render edilmesini **gerçekleştirmez**:

```js
// Yanlış kullanım
this.state.comment = 'Hello';
```

Bunun yerine `setState()` kullanınız:

```js
// Doğru kullanım
this.setState({comment: 'Hello'});
```

`this.state`'e atama yapmanız gereken tek yer, ilgili bileşenin constructor'ıdır.

### State Güncellemeleri Asenkron Olabilir {#state-updates-may-be-asynchronous}

React, çoklu `setState()` çağrılarını, performans için tekil bir güncellemeye dönüştürebilir.

`this.props` ve `this.state`, asenkron olarak güncellenebildiklerinden dolayı, sonraki state'i hesaplarken bu nesnelerin mevcut değerlerine **güvenmemelisiniz**.

Örneğin, aşağıdaki kod `counter`'ı güncellemeyebilir:

```js
// Yanlış kullanım
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Bunu düzeltmek için, `setState()`'in ikinci formunu kullanmamız gerekir. Bu formda  `setState()` fonksiyonu, parametre olarak nesne yerine fonksiyon alır. Bu fonksiyon, ilk parametre olarak önceki state'i, ikinci parametre olarak da o anda güncellenen props değerini alır:

```js
// Doğru kullanım
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Yukarıda bir [ok fonksiyonu](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) kullandık. Fakat normal fonksiyonlarla da gayet çalışabilir:

```js
// Doğru kullanım
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State Güncellemeleri Birleştirilir {#state-updates-are-merged}

React, `setState()`'i çağırdığınızda, parametre olarak verdiğiniz nesneyi alıp mevcut state'e aktarır.

Örneğin, state'iniz aşağıdaki gibi birçok bağımsız değişkeni içerebilir:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Ve siz de bu değişkenleri, ayrı birer `setState()` çağrıları ile güncellemek isteyebilirsiniz:

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

Birleşme işlemi yüzeysel olduğundan dolayı, `this.setState({comments})` çağrısı `this.state.posts` değişkenini değişmeden bırakırken, `this.state.comments`'i tamamıyla değiştirecektir.

## Verinin Alt Bileşenlere Aktarılması {#the-data-flows-down}

Ne üst, ne de alt bileşenler, belirli bir bileşenin state'li veya state'siz olduğunu bilemez. Ayrıca o bileşenin fonksiyon veya sınıf olarak tanımlanmasını da önemsemezler.

Bu nedenle state'e, **yerel state** denir. State, kendisine sahip olan ve kendisini ayarlayan bileşen haricinde hiçbir bileşen için erişilebilir değildir.

Bir bileşen kendi state'ini, prop'lar aracılığıyla alt bileşenlere aktarabilir:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

Kullanıcı tanımlı bileşenler için de bu durum geçerlidir:

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` bileşeni, `date` değişkenini props'tan alabilir. Ve bunu alırken `Clock`'un state'inden mi yoksa prop'undan mı geldiğini bilemez. Hatta `date` değişkeni, `Clock` bileşeni içerisinde state'ten harici olarak tanımlanmış bir değer de olabilir ve bunu da bilmesine imkanı yoktur:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**CodePen'de Deneyin**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Bu olaya genellikle **yukarıdan-aşağıya** veya **tek yönlü** veri akışı denir. Her state, belirli bir bileşen tarafından tutulur. Bu bileşenden türetilen herhangi bir veri veya kullanıcı arayüzü, yalnızca bu bileşenin altındaki bileşen ağacına etki edebilir.

Bileşen ağacını, prop'lardan oluşan bir şelale olarak düşünebilirsiniz. Her bileşenin state'i, prop'ları istenilen bir noktada birleştirebilen ve aynı zamanda alt bileşenlere de akıtan ek bir su kaynağı gibidir.

Tüm bileşenlerin tamamen izole olduğunu göstermek için, 3 adet `<Clock>` render eden bir `App` bileşeni oluşturabiliriz:

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

[**CodePen'de Deneyin**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Bu örnekte yer alan her bir `Clock` bileşeni, kendi zamanlayıcısını oluşturup, birbirinden bağımsız bir şekilde güncellemektedir.

React uygulamalarında, bir bileşenin state'li veya state'siz olması, bir kodlama detayıdır ve zaman içerisinde değişkenlik gösterebilir. State'li bileşenler içerisinde, state'siz bileşenleri kullanabilirsiniz. Veya bu durumun tam tersi de geçerlidir.
