---
title: Component
---

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#alternatives)

</Pitfall>

<Intro>

`Component`, [JavaScript sınıfları](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) olarak tanımlanan React bileşenlerinin temel sınıfıdır. Sınıf bileşenleri hâlâ React tarafından desteklenmektedir, ancak yeni kodda kullanılmasını önermiyoruz.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `Component` {/*component*/}

Bir React bileşenini sınıf olarak tanımlamak için yerleşik `Component` sınıfını genişletin ve bir [`render` metodu](#render) tanımlayın:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Yalnızca `render` metodu zorunludur, diğer metodlar isteğe bağlıdır.

[Aşağıda daha fazla örneğe bakın.](#usage)

---

### `context` {/*context*/}

Bir sınıf bileşeninin [context](/learn/passing-data-deeply-with-context) değeri `this.context` olarak erişilebilir. Yalnızca [`static contextType`](#static-contexttype) kullanarak *hangi* context'i almak istediğinizi belirtirseniz kullanılabilir.

Bir sınıf bileşeni aynı anda yalnızca bir context okuyabilir.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Sınıf bileşenlerinde `this.context` okumak, fonksiyon bileşenlerindeki [`useContext`](/reference/react/useContext) ile eşdeğerdir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Bir sınıf bileşenine iletilen prop'lar `this.props` olarak erişilebilir.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Sınıf bileşenlerinde `this.props` okumak, fonksiyon bileşenlerinde [prop'ları bildirmek](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) ile eşdeğerdir.

[Nasıl taşınacağını görün.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

Bir sınıf bileşeninin state'i `this.state` olarak erişilebilir. `state` alanı bir nesne olmalıdır. State'i doğrudan değiştirmeyin (mutate etmeyin). State'i değiştirmek istiyorsanız, yeni state ile `setState`'i çağırın.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Sınıf bileşenlerinde `state` tanımlamak, fonksiyon bileşenlerinde [`useState`](/reference/react/useState) çağırmak ile eşdeğerdir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor), sınıf bileşeniniz *bağlanmadan* (ekrana eklenmeden) önce çalışır. Genellikle React'te constructor yalnızca iki amaç için kullanılır. State bildirmenizi ve sınıf metodlarınızı sınıf örneğine [bağlamanızı (bind)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) sağlar:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Modern JavaScript sözdizimi kullanıyorsanız, constructor'lara nadiren ihtiyaç duyulur. Bunun yerine, yukarıdaki kodu hem modern tarayıcılar hem de [Babel](https://babeljs.io/) gibi araçlar tarafından desteklenen [public sınıf alanı sözdizimi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) kullanarak yeniden yazabilirsiniz:

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Bir constructor yan etki veya abonelik içermemelidir.

#### Parametreler {/*constructor-parameters*/}

* `props`: Bileşenin başlangıç prop'ları.

#### Dönüş Değeri {/*constructor-returns*/}

`constructor` hiçbir şey döndürmemelidir.

#### Uyarılar {/*constructor-caveats*/}

* Constructor içinde yan etki veya abonelik çalıştırmayın. Bunun yerine [`componentDidMount`](#componentdidmount) kullanın.

* Constructor içinde, diğer tüm ifadelerden önce `super(props)` çağırmanız gerekir. Bunu yapmazsanız, constructor çalışırken `this.props` `undefined` olacaktır; bu kafa karıştırıcı olabilir ve hatalara neden olabilir.

* Constructor, [`this.state`](#state) değerini doğrudan atayabileceğiniz tek yerdir. Diğer tüm metodlarda bunun yerine [`this.setState()`](#setstate) kullanmanız gerekir. Constructor içinde `setState` çağırmayın.

* [Sunucu taraflı renderlama](/reference/react-dom/server) kullandığınızda, constructor sunucuda da çalışacak ve ardından [`render`](#render) metodu gelecektir. Ancak `componentDidMount` veya `componentWillUnmount` gibi yaşam döngüsü metodları sunucuda çalışmaz.

* [Strict Mode](/reference/react/StrictMode) açık olduğunda, React geliştirme ortamında `constructor`'ı iki kez çağırır ve ardından örneklerden birini atar. Bu, `constructor` dışına taşınması gereken kazara oluşan yan etkileri fark etmenize yardımcı olur.

<Note>

Fonksiyon bileşenlerinde `constructor` için tam bir karşılık yoktur. Bir fonksiyon bileşeninde state bildirmek için [`useState`](/reference/react/useState) çağırın. Başlangıç state'ini yeniden hesaplamaktan kaçınmak için [`useState`'e bir fonksiyon iletin.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

`componentDidCatch` tanımlarsanız, bir alt bileşen (uzak alt bileşenler dahil) renderlama sırasında bir hata fırlattığında React bunu çağırır. Bu, hatayı production ortamında bir hata raporlama servisine kaydetmenizi sağlar.

Genellikle, bir hataya yanıt olarak state'i güncellemenize ve kullanıcıya bir hata mesajı görüntülemenize olanak tanıyan [`static getDerivedStateFromError`](#static-getderivedstatefromerror) ile birlikte kullanılır. Bu metodlara sahip bir bileşene *Hata Sınırı (Error Boundary)* denir.

[Bir örnek görün.](#catching-rendering-errors-with-an-error-boundary)

#### Parametreler {/*componentdidcatch-parameters*/}

* `error`: Fırlatılan hata. Pratikte genellikle bir [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) örneği olacaktır, ancak JavaScript dizeler veya hatta `null` dahil herhangi bir değeri [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) etmeye izin verdiği için bu garanti edilmez.

* `info`: Hata hakkında ek bilgi içeren bir nesne. `componentStack` alanı, hatayı fırlatan bileşenin yanı sıra tüm üst bileşenlerinin adlarını ve kaynak konumlarını içeren bir yığın izlemesi (stack trace) içerir. Production ortamında bileşen adları küçültülmüş (minified) olacaktır. Production hata raporlaması kurarsanız, normal JavaScript hata yığınlarında yapacağınız gibi bileşen yığınını kaynak haritalarını (sourcemaps) kullanarak çözümleyebilirsiniz.

#### Dönüş Değeri {/*componentdidcatch-returns*/}

`componentDidCatch` hiçbir şey döndürmemelidir.

#### Uyarılar {/*componentdidcatch-caveats*/}

* Geçmişte, kullanıcı arayüzünü güncellemek ve yedek hata mesajını görüntülemek için `componentDidCatch` içinde `setState` çağırmak yaygındı. Bu, [`static getDerivedStateFromError`](#static-getderivedstatefromerror) tanımlamak lehine kullanımdan kaldırılmıştır (deprecated).

* React'in production ve geliştirme yapıları, `componentDidCatch`'in hataları işleme biçiminde hafifçe farklılık gösterir. Geliştirme ortamında hatalar `window`'a kadar yükselir, bu da herhangi bir `window.onerror` veya `window.addEventListener('error', callback)` ifadesinin `componentDidCatch` tarafından yakalanan hataları yakalayacağı anlamına gelir. Production ortamında ise hatalar yükselmez; bu, herhangi bir üst hata işleyicisinin yalnızca `componentDidCatch` tarafından açıkça yakalanmayan hataları alacağı anlamına gelir.

<Note>

Fonksiyon bileşenlerinde henüz `componentDidCatch` için doğrudan bir karşılık yoktur. Sınıf bileşeni oluşturmaktan kaçınmak istiyorsanız, yukarıdaki gibi tek bir `ErrorBoundary` bileşeni yazın ve uygulamanız boyunca kullanın. Alternatif olarak, bunu sizin için yapan [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) paketini kullanabilirsiniz.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

`componentDidMount` metodunu tanımlarsanız, bileşeniniz ekrana eklendiğinde *(bağlandığında/mount edildiğinde)* React bunu çağırır. Bu, veri getirmeye başlamak, abonelikler kurmak veya DOM node'larını manipüle etmek için yaygın bir yerdir.

`componentDidMount` uygularsanız, hataları önlemek için genellikle diğer yaşam döngüsü metodlarını da uygulamanız gerekir. Örneğin, `componentDidMount` bazı state veya prop'ları okuyorsa, değişikliklerini işlemek için [`componentDidUpdate`](#componentdidupdate) ve `componentDidMount`'un yaptığı şeyi temizlemek için [`componentWillUnmount`](#componentwillunmount) uygulamanız gerekir.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Daha fazla örnek görün.](#adding-lifecycle-methods-to-a-class-component)

#### Parametreler {/*componentdidmount-parameters*/}

`componentDidMount` hiçbir parametre almaz.

#### Dönüş Değeri {/*componentdidmount-returns*/}

`componentDidMount` hiçbir şey döndürmemelidir.

#### Uyarılar {/*componentdidmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) açık olduğunda, geliştirme ortamında React `componentDidMount`'u çağırır, ardından hemen [`componentWillUnmount`'u](#componentwillunmount) çağırır ve sonra `componentDidMount`'u tekrar çağırır. Bu, `componentWillUnmount`'u uygulamayı unuttuğunuzu veya mantığının `componentDidMount`'un yaptığını tam olarak "yansıtmadığını" fark etmenize yardımcı olur.

- `componentDidMount` içinde hemen [`setState`](#setstate) çağırabilseniz de, mümkün olduğunda bundan kaçınmanız en iyisidir. Bu, ekstra bir renderlama tetikler, ancak tarayıcı ekranı güncellemeden önce gerçekleşir. Bu, bu durumda [`render`](#render) iki kez çağrılsa bile kullanıcının ara state'i görmeyeceğini garanti eder. Bu kalıbı dikkatli kullanın çünkü genellikle performans sorunlarına neden olur. Çoğu durumda, başlangıç state'ini [`constructor`](#constructor) içinde atayabilmeniz gerekir. Ancak, render ettiğiniz bir şeyin boyutuna veya konumuna bağlı olarak bir DOM node'unu ölçmeniz gereken modal ve tooltip gibi durumlar için gerekli olabilir.

<Note>

Birçok kullanım durumunda, sınıf bileşenlerinde `componentDidMount`, `componentDidUpdate` ve `componentWillUnmount`'u birlikte tanımlamak, fonksiyon bileşenlerinde [`useEffect`](/reference/react/useEffect) çağırmakla eşdeğerdir. Kodun tarayıcı boyamasından önce çalışmasının önemli olduğu nadir durumlarda, [`useLayoutEffect`](/reference/react/useLayoutEffect) daha yakın bir eşleşmedir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

`componentDidUpdate` metodunu tanımlarsanız, bileşeniniz güncellenmiş prop'lar veya state ile yeniden renderlandıktan hemen sonra React bunu çağırır. Bu metod ilk renderlama için çağrılmaz.

Bir güncellemeden sonra DOM'u manipüle etmek için kullanabilirsiniz. Ayrıca, mevcut prop'ları önceki prop'larla karşılaştırdığınız sürece (örneğin, prop'lar değişmediyse bir ağ isteği gerekli olmayabilir) ağ istekleri yapmak için de yaygın bir yerdir. Genellikle [`componentDidMount`](#componentdidmount) ve [`componentWillUnmount`](#componentwillunmount) ile birlikte kullanırsınız:

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Daha fazla örnek görün.](#adding-lifecycle-methods-to-a-class-component)


#### Parametreler {/*componentdidupdate-parameters*/}

* `prevProps`: Güncellemeden önceki prop'lar. Neyin değiştiğini belirlemek için `prevProps`'u [`this.props`](#props) ile karşılaştırın.

* `prevState`: Güncellemeden önceki state. Neyin değiştiğini belirlemek için `prevState`'i [`this.state`](#state) ile karşılaştırın.

* `snapshot`: [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) uyguladıysanız, `snapshot` o metoddan döndürdüğünüz değeri içerecektir. Aksi takdirde `undefined` olacaktır.

#### Dönüş Değeri {/*componentdidupdate-returns*/}

`componentDidUpdate` hiçbir şey döndürmemelidir.

#### Uyarılar {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) tanımlanmışsa ve `false` döndürürse `componentDidUpdate` çağrılmaz.

- `componentDidUpdate` içindeki mantık genellikle `this.props`'u `prevProps` ile ve `this.state`'i `prevState` ile karşılaştıran koşullarla sarmalanmalıdır. Aksi takdirde sonsuz döngü oluşturma riski vardır.

- `componentDidUpdate` içinde hemen [`setState`](#setstate) çağırabilseniz de, mümkün olduğunda bundan kaçınmanız en iyisidir. Bu, ekstra bir renderlama tetikler, ancak tarayıcı ekranı güncellemeden önce gerçekleşir. Bu, bu durumda [`render`](#render) iki kez çağrılsa bile kullanıcının ara state'i görmeyeceğini garanti eder. Bu kalıp genellikle performans sorunlarına neden olur, ancak render ettiğiniz bir şeyin boyutuna veya konumuna bağlı olarak bir DOM node'unu ölçmeniz gereken modal ve tooltip gibi nadir durumlar için gerekli olabilir.

<Note>

Birçok kullanım durumunda, sınıf bileşenlerinde `componentDidMount`, `componentDidUpdate` ve `componentWillUnmount`'u birlikte tanımlamak, fonksiyon bileşenlerinde [`useEffect`](/reference/react/useEffect) çağırmakla eşdeğerdir. Kodun tarayıcı boyamasından önce çalışmasının önemli olduğu nadir durumlarda, [`useLayoutEffect`](/reference/react/useLayoutEffect) daha yakın bir eşleşmedir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Bu API, `componentWillMount` yerine [`UNSAFE_componentWillMount`](#unsafe_componentwillmount) olarak yeniden adlandırılmıştır. Eski ad kullanımdan kaldırılmıştır. React'in gelecekteki bir ana sürümünde yalnızca yeni ad çalışacaktır.

Bileşenlerinizi otomatik olarak güncellemek için [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)'u çalıştırın.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Bu API, `componentWillReceiveProps` yerine [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) olarak yeniden adlandırılmıştır. Eski ad kullanımdan kaldırılmıştır. React'in gelecekteki bir ana sürümünde yalnızca yeni ad çalışacaktır.

Bileşenlerinizi otomatik olarak güncellemek için [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)'u çalıştırın.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Bu API, `componentWillUpdate` yerine [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) olarak yeniden adlandırılmıştır. Eski ad kullanımdan kaldırılmıştır. React'in gelecekteki bir ana sürümünde yalnızca yeni ad çalışacaktır.

Bileşenlerinizi otomatik olarak güncellemek için [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)'u çalıştırın.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

`componentWillUnmount` metodunu tanımlarsanız, bileşeniniz ekrandan kaldırılmadan *(unmount edilmeden)* önce React bunu çağırır. Bu, veri getirmeyi iptal etmek veya abonelikleri kaldırmak için yaygın bir yerdir.

`componentWillUnmount` içindeki mantık, [`componentDidMount`](#componentdidmount) içindeki mantığı "yansıtmalıdır". Örneğin, `componentDidMount` bir abonelik kuruyorsa, `componentWillUnmount` o aboneliği temizlemelidir. `componentWillUnmount` içindeki temizleme mantığı bazı prop'ları veya state'i okuyorsa, eski prop'lara ve state'e karşılık gelen kaynakları (abonelikler gibi) temizlemek için genellikle [`componentDidUpdate`](#componentdidupdate) uygulamanız da gerekecektir.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Daha fazla örnek görün.](#adding-lifecycle-methods-to-a-class-component)

#### Parametreler {/*componentwillunmount-parameters*/}

`componentWillUnmount` hiçbir parametre almaz.

#### Dönüş Değeri {/*componentwillunmount-returns*/}

`componentWillUnmount` hiçbir şey döndürmemelidir.

#### Uyarılar {/*componentwillunmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) açık olduğunda, geliştirme ortamında React [`componentDidMount`'u](#componentdidmount) çağırır, ardından hemen `componentWillUnmount`'u çağırır ve sonra `componentDidMount`'u tekrar çağırır. Bu, `componentWillUnmount`'u uygulamayı unuttuğunuzu veya mantığının `componentDidMount`'un yaptığını tam olarak "yansıtmadığını" fark etmenize yardımcı olur.

<Note>

Birçok kullanım durumunda, sınıf bileşenlerinde `componentDidMount`, `componentDidUpdate` ve `componentWillUnmount`'u birlikte tanımlamak, fonksiyon bileşenlerinde [`useEffect`](/reference/react/useEffect) çağırmakla eşdeğerdir. Kodun tarayıcı boyamasından önce çalışmasının önemli olduğu nadir durumlarda, [`useLayoutEffect`](/reference/react/useLayoutEffect) daha yakın bir eşleşmedir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Bir bileşeni yeniden renderlamaya zorlar.

Genellikle bu gerekli değildir. Bileşeninizin [`render`](#render) metodu yalnızca [`this.props`](#props), [`this.state`](#state) veya [`this.context`](#context)'ten okuyorsa, bileşeniniz veya üst bileşenlerinden biri içinde [`setState`](#setstate) çağırdığınızda otomatik olarak yeniden renderlanır. Ancak bileşeninizin `render` metodu harici bir veri kaynağından doğrudan okuyorsa, o veri kaynağı değiştiğinde React'e kullanıcı arayüzünü güncellemesini söylemeniz gerekir. `forceUpdate` bunu yapmanızı sağlar.

`forceUpdate`'in tüm kullanımlarından kaçınmaya çalışın ve `render` içinde yalnızca `this.props` ve `this.state`'ten okuyun.

#### Parametreler {/*forceupdate-parameters*/}

* **isteğe bağlı** `callback`: Belirtilirse, React güncelleme uygulandıktan sonra sağladığınız `callback`'i çağırır.

#### Dönüş Değeri {/*forceupdate-returns*/}

`forceUpdate` hiçbir şey döndürmez.

#### Uyarılar {/*forceupdate-caveats*/}

- `forceUpdate` çağırırsanız, React [`shouldComponentUpdate`](#shouldcomponentupdate) çağırmadan yeniden renderlar.

<Note>

Harici bir veri kaynağını okumak ve sınıf bileşenlerini değişikliklere yanıt olarak `forceUpdate` ile yeniden renderlamaya zorlamak, fonksiyon bileşenlerinde [`useSyncExternalStore`](/reference/react/useSyncExternalStore) ile değiştirilmiştir.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

`getSnapshotBeforeUpdate` uygularsanız, React DOM'u güncellemeden hemen önce bunu çağırır. Bileşeninizin potansiyel olarak değiştirilmeden önce DOM'dan bazı bilgileri (örneğin kaydırma konumu) yakalamasını sağlar. Bu yaşam döngüsü metodunun döndürdüğü herhangi bir değer, [`componentDidUpdate`'e](#componentdidupdate) parametre olarak iletilir.

Örneğin, güncellemeler sırasında kaydırma konumunu korumak gereken bir sohbet dizisi gibi bir kullanıcı arayüzünde kullanabilirsiniz:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

Yukarıdaki örnekte, `scrollHeight` özelliğini doğrudan `getSnapshotBeforeUpdate` içinde okumak önemlidir. [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) veya [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) içinde okumak güvenli değildir çünkü bu metodların çağrılması ile React'in DOM'u güncellemesi arasında potansiyel bir zaman aralığı vardır.

#### Parametreler {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Güncellemeden önceki prop'lar. Neyin değiştiğini belirlemek için `prevProps`'u [`this.props`](#props) ile karşılaştırın.

* `prevState`: Güncellemeden önceki state. Neyin değiştiğini belirlemek için `prevState`'i [`this.state`](#state) ile karşılaştırın.

#### Dönüş Değeri {/*getsnapshotbeforeupdate-returns*/}

İstediğiniz herhangi bir türde bir anlık görüntü (snapshot) değeri döndürmelisiniz, veya `null`. Döndürdüğünüz değer, [`componentDidUpdate`'e](#componentdidupdate) üçüncü argüman olarak iletilecektir.

#### Uyarılar {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) tanımlanmışsa ve `false` döndürürse `getSnapshotBeforeUpdate` çağrılmaz.

<Note>

Şu anda fonksiyon bileşenlerinde `getSnapshotBeforeUpdate` için bir karşılık yoktur. Bu kullanım durumu çok nadir olmakla birlikte, buna ihtiyacınız varsa şimdilik bir sınıf bileşeni yazmanız gerekecektir.

</Note>

---

### `render()` {/*render*/}

`render` metodu, bir sınıf bileşenindeki tek zorunlu metoddur.

`render` metodu, ekranda ne görüntülenmesini istediğinizi belirtmelidir, örneğin:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React, `render`'ı herhangi bir anda çağırabilir, bu yüzden belirli bir zamanda çalıştığını varsaymamalısınız. Genellikle `render` metodu bir [JSX](/learn/writing-markup-with-jsx) parçası döndürmelidir, ancak birkaç [başka dönüş türü](#render-returns) (dizeler gibi) de desteklenir. Döndürülen JSX'i hesaplamak için `render` metodu [`this.props`](#props), [`this.state`](#state) ve [`this.context`](#context) okuyabilir.

`render` metodunu saf bir fonksiyon olarak yazmalısınız; yani prop'lar, state ve context aynıysa aynı sonucu döndürmelidir. Ayrıca yan etkiler (abonelik kurma gibi) içermemeli veya tarayıcı API'leri ile etkileşime girmemelidir. Yan etkiler ya olay işleyicilerinde ya da [`componentDidMount`](#componentdidmount) gibi metodlarda gerçekleşmelidir.

#### Parametreler {/*render-parameters*/}

`render` hiçbir parametre almaz.

#### Dönüş Değeri {/*render-returns*/}

`render`, herhangi bir geçerli React node'u döndürebilir. Bu, `<div />` gibi React elemanlarını, dizeleri, sayıları, [portal'ları](/reference/react-dom/createPortal), boş node'ları (`null`, `undefined`, `true` ve `false`) ve React node'larından oluşan dizileri içerir.

#### Uyarılar {/*render-caveats*/}

- `render`, prop'ların, state'in ve context'in saf bir fonksiyonu olarak yazılmalıdır. Yan etkileri olmamalıdır.

- [`shouldComponentUpdate`](#shouldcomponentupdate) tanımlanmışsa ve `false` döndürürse `render` çağrılmaz.

- [Strict Mode](/reference/react/StrictMode) açık olduğunda, React geliştirme ortamında `render`'ı iki kez çağırır ve ardından sonuçlardan birini atar. Bu, `render` metodunun dışına taşınması gereken kazara oluşan yan etkileri fark etmenize yardımcı olur.

- `render` çağrısı ile ardından gelen `componentDidMount` veya `componentDidUpdate` çağrısı arasında bire bir karşılık yoktur. Bazı `render` çağrı sonuçları, faydalı olduğunda React tarafından atılabilir.

---

### `setState(nextState, callback?)` {/*setstate*/}

React bileşeninizin state'ini güncellemek için `setState`'i çağırın.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState`, bileşen state'ine değişiklikleri kuyruğa alır. React'e bu bileşenin ve alt bileşenlerinin yeni state ile yeniden renderlanması gerektiğini söyler. Bu, etkileşimlere yanıt olarak kullanıcı arayüzünü güncellemenin ana yoludur.

<Pitfall>

`setState` çağırmak, halihazırda çalışan koddaki mevcut state'i **değiştirmez**:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Hâlâ "Taylor"!
}
```

Yalnızca *sonraki* renderlamadan itibaren `this.state`'in döndüreceği değeri etkiler.

</Pitfall>

`setState`'e bir fonksiyon da iletebilirsiniz. Önceki state'e dayalı olarak state güncellemenizi sağlar:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Bunu yapmak zorunda değilsiniz, ancak aynı olay sırasında state'i birden çok kez güncellemek istiyorsanız kullanışlıdır.

#### Parametreler {/*setstate-parameters*/}

* `nextState`: Bir nesne veya bir fonksiyon.
  * `nextState` olarak bir nesne iletirseniz, `this.state` ile yüzeysel (shallow) olarak birleştirilir.
  * `nextState` olarak bir fonksiyon iletirseniz, bir _güncelleyici fonksiyonu_ olarak işlenir. Saf olmalı, bekleyen state ve prop'ları argüman olarak almalı ve `this.state` ile yüzeysel olarak birleştirilecek nesneyi döndürmelidir. React güncelleyici fonksiyonunuzu bir kuyruğa alır ve bileşeninizi yeniden renderlar. Sonraki renderlama sırasında React, kuyruğa alınmış tüm güncelleyicileri önceki state'e uygulayarak sonraki state'i hesaplar.

* **isteğe bağlı** `callback`: Belirtilirse, React güncelleme uygulandıktan sonra sağladığınız `callback`'i çağırır.

#### Dönüş Değeri {/*setstate-returns*/}

`setState` hiçbir şey döndürmez.

#### Uyarılar {/*setstate-caveats*/}

- `setState`'i, bileşeni güncellemenin anlık bir komutu yerine bir *istek* olarak düşünün. Birden fazla bileşen bir olaya yanıt olarak state'lerini güncellediğinde, React güncellemelerini toplu hale getirir ve olayın sonunda tek bir geçişte birlikte yeniden renderlar. Belirli bir state güncellemesinin eşzamanlı olarak uygulanmasını zorlamanız gereken nadir durumlarda, [`flushSync`](/reference/react-dom/flushSync) ile sarmalayabilirsiniz, ancak bu performansı olumsuz etkileyebilir.

- `setState`, `this.state`'i hemen güncellemez. Bu, `setState` çağrısından hemen sonra `this.state` okumayı potansiyel bir tuzak haline getirir. Bunun yerine, güncellemenin uygulandığından emin olan [`componentDidUpdate`](#componentdidupdate) veya setState `callback` argümanını kullanın. Önceki state'e dayalı olarak state ayarlamanız gerekiyorsa, yukarıda açıklandığı gibi `nextState`'e bir fonksiyon iletebilirsiniz.

<Note>

Sınıf bileşenlerinde `setState` çağırmak, fonksiyon bileşenlerinde bir [`set` fonksiyonu](/reference/react/useState#setstate) çağırmaya benzer.

[Nasıl taşınacağını görün.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

`shouldComponentUpdate` tanımlarsanız, React bir yeniden rendermanın atlanıp atanamayacağını belirlemek için bunu çağırır.

Elle yazmak istediğinizden eminseniz, `this.props`'u `nextProps` ile ve `this.state`'i `nextState` ile karşılaştırabilir ve güncellemenin atlanabileceğini React'e söylemek için `false` döndürebilirsiniz.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

React, yeni prop'lar veya state alındığında renderlama öncesinde `shouldComponentUpdate`'i çağırır. Varsayılan olarak `true` döndürür. Bu metod ilk renderlama veya [`forceUpdate`](#forceupdate) kullanıldığında çağrılmaz.

#### Parametreler {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Bileşenin renderlanmak üzere olduğu sonraki prop'lar. Neyin değiştiğini belirlemek için `nextProps`'u [`this.props`](#props) ile karşılaştırın.
- `nextState`: Bileşenin renderlanmak üzere olduğu sonraki state. Neyin değiştiğini belirlemek için `nextState`'i [`this.state`](#props) ile karşılaştırın.
- `nextContext`: Bileşenin renderlanmak üzere olduğu sonraki context. Neyin değiştiğini belirlemek için `nextContext`'i [`this.context`](#context) ile karşılaştırın. Yalnızca [`static contextType`](#static-contexttype) belirtirseniz kullanılabilir.

#### Dönüş Değeri {/*shouldcomponentupdate-returns*/}

Bileşenin yeniden renderlanmasını istiyorsanız `true` döndürün. Bu varsayılan davranıştır.

React'e yeniden rendermanın atlanabileceğini söylemek için `false` döndürün.

#### Uyarılar {/*shouldcomponentupdate-caveats*/}

- Bu metod *yalnızca* bir performans optimizasyonu olarak mevcuttur. Bileşeniniz onsuz bozuluyorsa, önce onu düzeltin.

- `shouldComponentUpdate`'i elle yazmak yerine [`PureComponent`](/reference/react/PureComponent) kullanmayı düşünün. `PureComponent`, prop'ları ve state'i yüzeysel olarak karşılaştırır ve gerekli bir güncellemeyi atlama şansınızı azaltır.

- `shouldComponentUpdate` içinde derin eşitlik kontrolleri veya `JSON.stringify` kullanmanızı önermiyoruz. Bu, performansı öngörülemez hale getirir ve her prop ve state'in veri yapısına bağımlı kılar. En iyi durumda, uygulamanıza çok saniyelik duraklamalar ekleme riskiyle karşılaşırsınız; en kötü durumda uygulamayı çökertme riskiniz vardır.

- `false` döndürmek, alt bileşenlerin *kendi* state'leri değiştiğinde yeniden renderlanmasını engellemez.

- `false` döndürmek, bileşenin yeniden renderlanmayacağını *garanti etmez*. React dönüş değerini bir ipucu olarak kullanır, ancak başka nedenlerle bileşeninizi yeniden renderlamayı yine de seçebilir.

<Note>

Sınıf bileşenlerini `shouldComponentUpdate` ile optimize etmek, fonksiyon bileşenlerini [`memo`](/reference/react/memo) ile optimize etmeye benzer. Fonksiyon bileşenleri ayrıca [`useMemo`](/reference/react/useMemo) ile daha ayrıntılı optimizasyon sunar.

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

`UNSAFE_componentWillMount` tanımlarsanız, React bunu [`constructor`'dan](#constructor) hemen sonra çağırır. Yalnızca tarihsel nedenlerle mevcuttur ve yeni kodda kullanılmamalıdır. Bunun yerine alternatiflerden birini kullanın:

- State'i başlatmak için [`state`](#state)'i bir sınıf alanı olarak bildirin veya [`constructor`](#constructor) içinde `this.state`'i ayarlayın.
- Bir yan etki çalıştırmanız veya abonelik kurmanız gerekiyorsa, o mantığı [`componentDidMount`'a](#componentdidmount) taşıyın.

[Güvensiz yaşam döngülerinden göç örneklerini görün.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parametreler {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` hiçbir parametre almaz.

#### Dönüş Değeri {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` hiçbir şey döndürmemelidir.

#### Uyarılar {/*unsafe_componentwillmount-caveats*/}

- Bileşen [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) veya [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) uyguluyorsa `UNSAFE_componentWillMount` çağrılmaz.

- Adlandırmasına rağmen, uygulamanız [`Suspense`](/reference/react/Suspense) gibi modern React özelliklerini kullanıyorsa `UNSAFE_componentWillMount`, bileşenin bağlanacağını (mount edileceğini) *garanti etmez*. Bir renderlama girişimi askıya alınırsa (örneğin, bir alt bileşenin kodu henüz yüklenmediyse), React devam eden ağacı atar ve bir sonraki denemede bileşeni sıfırdan oluşturmaya çalışır. Bu yüzden bu metod "güvensiz"dir. Bağlanmaya (mounting) dayanan kod (abonelik ekleme gibi) [`componentDidMount`'a](#componentdidmount) konulmalıdır.

- `UNSAFE_componentWillMount`, [sunucu taraflı renderlama](/reference/react-dom/server) sırasında çalışan tek yaşam döngüsü metodudur. Tüm pratik amaçlar için [`constructor`](#constructor) ile aynıdır, bu yüzden bu tür mantık için `constructor`'ı kullanmalısınız.

<Note>

Sınıf bileşeninde state'i başlatmak için `UNSAFE_componentWillMount` içinde [`setState`](#setstate) çağırmak, fonksiyon bileşeninde o state'i [`useState`'e](/reference/react/useState) başlangıç state'i olarak iletmekle eşdeğerdir.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

`UNSAFE_componentWillReceiveProps` tanımlarsanız, bileşen yeni prop'lar aldığında React bunu çağırır. Yalnızca tarihsel nedenlerle mevcuttur ve yeni kodda kullanılmamalıdır. Bunun yerine alternatiflerden birini kullanın:

- Prop değişikliklerine yanıt olarak **bir yan etki çalıştırmanız** gerekiyorsa (örneğin, veri getirme, animasyon çalıştırma veya aboneliği yeniden başlatma), o mantığı [`componentDidUpdate`'e](#componentdidupdate) taşıyın.
- Yalnızca **bir prop değiştiğinde bazı verileri yeniden hesaplamaktan kaçınmanız** gerekiyorsa, bunun yerine bir [memoizasyon yardımcısı](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) kullanın.
- **Bir prop değiştiğinde bazı state'i "sıfırlamanız"** gerekiyorsa, bileşeni [tamamen kontrollü](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) veya [bir anahtar ile tamamen kontrolsüz](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) yapmayı düşünün.
- **Bir prop değiştiğinde bazı state'i "ayarlamanız"** gerekiyorsa, renderlama sırasında yalnızca prop'lardan gerekli tüm bilgileri hesaplayıp hesaplayamayacağınızı kontrol edin. Yapamıyorsanız, bunun yerine [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) kullanın.

[Güvensiz yaşam döngülerinden göç örneklerini görün.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parametreler {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Bileşenin üst bileşeninden almak üzere olduğu sonraki prop'lar. Neyin değiştiğini belirlemek için `nextProps`'u [`this.props`](#props) ile karşılaştırın.
- `nextContext`: Bileşenin en yakın sağlayıcıdan almak üzere olduğu sonraki context. Neyin değiştiğini belirlemek için `nextContext`'i [`this.context`](#context) ile karşılaştırın. Yalnızca [`static contextType`](#static-contexttype) belirtirseniz kullanılabilir.

#### Dönüş Değeri {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` hiçbir şey döndürmemelidir.

#### Uyarılar {/*unsafe_componentwillreceiveprops-caveats*/}

- Bileşen [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) veya [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) uyguluyorsa `UNSAFE_componentWillReceiveProps` çağrılmaz.

- Adlandırmasına rağmen, uygulamanız [`Suspense`](/reference/react/Suspense) gibi modern React özelliklerini kullanıyorsa `UNSAFE_componentWillReceiveProps`, bileşenin bu prop'ları *alacağını* garanti etmez. Bir renderlama girişimi askıya alınırsa (örneğin, bir alt bileşenin kodu henüz yüklenmediyse), React devam eden ağacı atar ve bir sonraki denemede bileşeni sıfırdan oluşturmaya çalışır. Bir sonraki renderlama denemesinde prop'lar farklı olabilir. Bu yüzden bu metod "güvensiz"dir. Yalnızca kaydedilmiş (committed) güncellemeler için çalışması gereken kod (abonelik sıfırlama gibi) [`componentDidUpdate`'e](#componentdidupdate) konulmalıdır.

- `UNSAFE_componentWillReceiveProps`, bileşenin son seferden *farklı* prop'lar aldığı anlamına gelmez. Bir şeyin değişip değişmediğini kontrol etmek için `nextProps` ve `this.props`'u kendiniz karşılaştırmanız gerekir.

- React, bağlanma (mounting) sırasında ilk prop'larla `UNSAFE_componentWillReceiveProps`'u çağırmaz. Bu metodu yalnızca bileşenin prop'larından bazıları güncellenecekse çağırır. Örneğin, [`setState`](#setstate) çağırmak genellikle aynı bileşen içinde `UNSAFE_componentWillReceiveProps`'u tetiklemez.

<Note>

Sınıf bileşeninde state'i "ayarlamak" için `UNSAFE_componentWillReceiveProps` içinde [`setState`](#setstate) çağırmak, fonksiyon bileşeninde [renderlama sırasında `useState`'den `set` fonksiyonunu çağırmak](/reference/react/useState#storing-information-from-previous-renders) ile eşdeğerdir.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


`UNSAFE_componentWillUpdate` tanımlarsanız, React yeni prop'lar veya state ile renderlamadan önce bunu çağırır. Yalnızca tarihsel nedenlerle mevcuttur ve yeni kodda kullanılmamalıdır. Bunun yerine alternatiflerden birini kullanın:

- Prop veya state değişikliklerine yanıt olarak bir yan etki çalıştırmanız gerekiyorsa (örneğin, veri getirme, animasyon çalıştırma veya aboneliği yeniden başlatma), o mantığı [`componentDidUpdate`'e](#componentdidupdate) taşıyın.
- DOM'dan bazı bilgileri (örneğin, mevcut kaydırma konumunu kaydetmek için) okumak istiyorsanız ve [`componentDidUpdate`](#componentdidupdate) içinde kullanmak üzere saklayacaksanız, bunun yerine [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) içinde okuyun.

[Güvensiz yaşam döngülerinden göç örneklerini görün.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parametreler {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Bileşenin renderlanmak üzere olduğu sonraki prop'lar. Neyin değiştiğini belirlemek için `nextProps`'u [`this.props`](#props) ile karşılaştırın.
- `nextState`: Bileşenin renderlanmak üzere olduğu sonraki state. Neyin değiştiğini belirlemek için `nextState`'i [`this.state`](#state) ile karşılaştırın.

#### Dönüş Değeri {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` hiçbir şey döndürmemelidir.

#### Uyarılar {/*unsafe_componentwillupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) tanımlanmışsa ve `false` döndürürse `UNSAFE_componentWillUpdate` çağrılmaz.

- Bileşen [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) veya [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) uyguluyorsa `UNSAFE_componentWillUpdate` çağrılmaz.

- `componentWillUpdate` sırasında [`setState`](#setstate) (veya `setState`'in çağrılmasına yol açan herhangi bir metod, örneğin bir Redux eylemi göndermek) çağırmak desteklenmez.

- Adlandırmasına rağmen, uygulamanız [`Suspense`](/reference/react/Suspense) gibi modern React özelliklerini kullanıyorsa `UNSAFE_componentWillUpdate`, bileşenin *güncelleneceğini* garanti etmez. Bir renderlama girişimi askıya alınırsa (örneğin, bir alt bileşenin kodu henüz yüklenmediyse), React devam eden ağacı atar ve bir sonraki denemede bileşeni sıfırdan oluşturmaya çalışır. Bir sonraki renderlama denemesinde prop'lar ve state farklı olabilir. Bu yüzden bu metod "güvensiz"dir. Yalnızca kaydedilmiş (committed) güncellemeler için çalışması gereken kod (abonelik sıfırlama gibi) [`componentDidUpdate`'e](#componentdidupdate) konulmalıdır.

- `UNSAFE_componentWillUpdate`, bileşenin son seferden *farklı* prop'lar veya state aldığı anlamına gelmez. Bir şeyin değişip değişmediğini kontrol etmek için `nextProps`'u `this.props` ile ve `nextState`'i `this.state` ile kendiniz karşılaştırmanız gerekir.

- React, bağlanma (mounting) sırasında ilk prop'lar ve state ile `UNSAFE_componentWillUpdate`'i çağırmaz.

<Note>

Fonksiyon bileşenlerinde `UNSAFE_componentWillUpdate` için doğrudan bir karşılık yoktur.

</Note>

---

### `static contextType` {/*static-contexttype*/}

Sınıf bileşeninizden [`this.context`](#context-instance-field) okumak istiyorsanız, hangi context'i okuması gerektiğini belirtmelisiniz. `static contextType` olarak belirttiğiniz context, daha önce [`createContext`](/reference/react/createContext) ile oluşturulmuş bir değer olmalıdır.

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Sınıf bileşenlerinde `this.context` okumak, fonksiyon bileşenlerindeki [`useContext`](/reference/react/useContext) ile eşdeğerdir.

[Nasıl taşınacağını görün.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Sınıf için varsayılan prop'ları ayarlamak üzere `static defaultProps` tanımlayabilirsiniz. `undefined` ve eksik prop'lar için kullanılırlar, ancak `null` prop'lar için kullanılmazlar.

Örneğin, `color` prop'unun varsayılan olarak `'blue'` olması gerektiğini şu şekilde tanımlarsınız:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

`color` prop'u sağlanmazsa veya `undefined` ise, varsayılan olarak `'blue'` ayarlanır:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Sınıf bileşenlerinde `defaultProps` tanımlamak, fonksiyon bileşenlerinde [varsayılan değerler](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) kullanmaya benzer.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

`static getDerivedStateFromError` tanımlarsanız, bir alt bileşen (uzak alt bileşenler dahil) renderlama sırasında bir hata fırlattığında React bunu çağırır. Bu, kullanıcı arayüzünü temizlemek yerine bir hata mesajı görüntülemenizi sağlar.

Genellikle, hata raporunu bir analiz servisine göndermenizi sağlayan [`componentDidCatch`](#componentdidcatch) ile birlikte kullanılır. Bu metodlara sahip bir bileşene *Hata Sınırı (Error Boundary)* denir.

[Bir örnek görün.](#catching-rendering-errors-with-an-error-boundary)

#### Parametreler {/*static-getderivedstatefromerror-parameters*/}

* `error`: Fırlatılan hata. Pratikte genellikle bir [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) örneği olacaktır, ancak JavaScript dizeler veya hatta `null` dahil herhangi bir değeri [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) etmeye izin verdiği için bu garanti edilmez.

#### Dönüş Değeri {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError`, bileşene hata mesajını görüntülemesini söyleyen state'i döndürmelidir.

#### Uyarılar {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` saf bir fonksiyon olmalıdır. Bir yan etki gerçekleştirmek istiyorsanız (örneğin, bir analiz servisini çağırmak), [`componentDidCatch`'i](#componentdidcatch) de uygulamanız gerekir.

<Note>

Fonksiyon bileşenlerinde henüz `static getDerivedStateFromError` için doğrudan bir karşılık yoktur. Sınıf bileşeni oluşturmaktan kaçınmak istiyorsanız, yukarıdaki gibi tek bir `ErrorBoundary` bileşeni yazın ve uygulamanız boyunca kullanın. Alternatif olarak, bunu yapan [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) paketini kullanın.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

`static getDerivedStateFromProps` tanımlarsanız, React bunu hem ilk bağlanmada (mount) hem de sonraki güncellemelerde [`render`'ı](#render) çağırmadan hemen önce çağırır. State'i güncellemek için bir nesne döndürmeli veya hiçbir şeyi güncellememek için `null` döndürmelidir.

Bu metod, state'in zaman içindeki prop değişikliklerine bağlı olduğu [nadir kullanım durumları](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) için mevcuttur. Örneğin, bu `Form` bileşeni `userID` prop'u değiştiğinde `email` state'ini sıfırlar:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Bu kalıbın, state'te prop'un önceki bir değerini (örneğin `prevUserID` gibi `userID`) tutmanızı gerektirdiğini unutmayın.

<Pitfall>

State türetmek ayrıntılı koda yol açar ve bileşenlerinizi düşünmeyi zorlaştırır. [Daha basit alternatiflere aşina olduğunuzdan emin olun:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Bir prop değişikliğine yanıt olarak **bir yan etki gerçekleştirmeniz** gerekiyorsa (örneğin, veri getirme veya animasyon), bunun yerine [`componentDidUpdate`](#componentdidupdate) metodunu kullanın.
- Yalnızca **bir prop değiştiğinde bazı verileri yeniden hesaplamak** istiyorsanız, [bunun yerine bir memoizasyon yardımcısı kullanın.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- **Bir prop değiştiğinde bazı state'i "sıfırlamak"** istiyorsanız, bileşeni [tamamen kontrollü](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) veya [bir anahtar ile tamamen kontrolsüz](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) yapmayı düşünün.

</Pitfall>

#### Parametreler {/*static-getderivedstatefromprops-parameters*/}

- `props`: Bileşenin renderlanmak üzere olduğu sonraki prop'lar.
- `state`: Bileşenin renderlanmak üzere olduğu sonraki state.

#### Dönüş Değeri {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps`, state'i güncellemek için bir nesne döndürür veya hiçbir şeyi güncellememek için `null` döndürür.

#### Uyarılar {/*static-getderivedstatefromprops-caveats*/}

- Bu metod, nedeni ne olursa olsun *her* renderlamada tetiklenir. Bu, yalnızca üst bileşenin yeniden renderlamaya neden olduğunda tetiklenen ve yerel `setState` sonucu olarak tetiklenmeyen [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops)'tan farklıdır.

- Bu metod, bileşen örneğine erişime sahip değildir. İsterseniz, `static getDerivedStateFromProps` ve diğer sınıf metodları arasında, bileşen prop'larının ve state'inin saf fonksiyonlarını sınıf tanımının dışında çıkararak bazı kodları yeniden kullanabilirsiniz.

<Note>

Sınıf bileşeninde `static getDerivedStateFromProps` uygulamak, fonksiyon bileşeninde [renderlama sırasında `useState`'den `set` fonksiyonunu çağırmak](/reference/react/useState#storing-information-from-previous-renders) ile eşdeğerdir.

</Note>

---

## Kullanım {/*usage*/}

### Bir sınıf bileşeni tanımlama {/*defining-a-class-component*/}

Bir React bileşenini sınıf olarak tanımlamak için yerleşik `Component` sınıfını genişletin ve bir [`render` metodu](#render) tanımlayın:

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React, ekranda ne görüntüleneceğini belirlemesi gerektiğinde [`render`](#render) metodunuzu çağırır. Genellikle ondan bir [JSX](/learn/writing-markup-with-jsx) döndürürsünüz. `render` metodunuz [saf bir fonksiyon](https://en.wikipedia.org/wiki/Pure_function) olmalıdır: yalnızca JSX'i hesaplamalıdır.

[Fonksiyon bileşenlerine](/learn/your-first-component#defining-a-component) benzer şekilde, bir sınıf bileşeni üst bileşeninden [prop'lar aracılığıyla bilgi alabilir](/learn/your-first-component#defining-a-component). Ancak prop'ları okuma sözdizimi farklıdır. Örneğin, üst bileşen `<Greeting name="Taylor" />` renderlarsa, `name` prop'unu [`this.props`](#props)'tan, yani `this.props.name` olarak okuyabilirsiniz:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Hook'ların (`use` ile başlayan fonksiyonlar, örneğin [`useState`](/reference/react/useState)) sınıf bileşenleri içinde desteklenmediğini unutmayın.

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Bir sınıf bileşenine state ekleme {/*adding-state-to-a-class-component*/}

Bir sınıfa [state](/learn/state-a-components-memory) eklemek için [`state`](#state) adlı bir özelliğe bir nesne atayın. State'i güncellemek için [`this.setState`](#setstate) çağırın.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Bir sınıf bileşenine yaşam döngüsü metodları ekleme {/*adding-lifecycle-methods-to-a-class-component*/}

Sınıfınızda tanımlayabileceğiniz birkaç özel metod vardır.

[`componentDidMount`](#componentdidmount) metodunu tanımlarsanız, bileşeniniz ekrana eklendiğinde *(bağlandığında/mount edildiğinde)* React bunu çağırır. React, bileşeniniz değişen prop'lar veya state nedeniyle yeniden renderlandıktan sonra [`componentDidUpdate`'i](#componentdidupdate) çağırır. React, bileşeniniz ekrandan kaldırıldıktan *(unmount edildikten)* sonra [`componentWillUnmount`'u](#componentwillunmount) çağırır.

`componentDidMount` uygularsanız, hataları önlemek için genellikle üç yaşam döngüsünü de uygulamanız gerekir. Örneğin, `componentDidMount` bazı state veya prop'ları okuyorsa, değişikliklerini işlemek için `componentDidUpdate`'i ve `componentDidMount`'un yaptığı şeyi temizlemek için `componentWillUnmount`'u da uygulamanız gerekir.

Örneğin, bu `ChatRoom` bileşeni bir sohbet bağlantısını prop'lar ve state ile senkronize tutar:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Geliştirme ortamında [Strict Mode](/reference/react/StrictMode) açık olduğunda, React'in `componentDidMount`'u çağıracağını, ardından hemen `componentWillUnmount`'u çağıracağını ve sonra `componentDidMount`'u tekrar çağıracağını unutmayın. Bu, `componentWillUnmount`'u uygulamayı unuttuğunuzu veya mantığının `componentDidMount`'un yaptığını tam olarak "yansıtmadığını" fark etmenize yardımcı olur.

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Renderlama hatalarını bir Hata Sınırı ile yakalama {/*catching-rendering-errors-with-an-error-boundary*/}

Varsayılan olarak, uygulamanız renderlama sırasında bir hata fırlatırsa, React kullanıcı arayüzünü ekrandan kaldırır. Bunu önlemek için, kullanıcı arayüzünüzün bir bölümünü bir *Hata Sınırı (Error Boundary)* ile sarmalayabilirsiniz. Hata Sınırı, çöken kısmın yerine bazı yedek kullanıcı arayüzünü — örneğin bir hata mesajını — görüntülemenizi sağlayan özel bir bileşendir.

<Note>
Hata sınırları şunlar için hataları yakalamaz:

- Olay işleyicileri [(daha fazla bilgi)](/learn/responding-to-events)
- [Sunucu taraflı renderlama](/reference/react-dom/server)
- Hata sınırının kendisinde (alt bileşenleri yerine) fırlatılan hatalar
- Asenkron kod (örneğin `setTimeout` veya `requestAnimationFrame` geri çağrıları); bunun bir istisnası [`useTransition`](/reference/react/useTransition) Hook'u tarafından döndürülen [`startTransition`](/reference/react/useTransition#starttransition) fonksiyonunun kullanımıdır. Geçiş fonksiyonu içinde fırlatılan hatalar hata sınırları tarafından yakalanır [(daha fazla bilgi)](/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

</Note>

Bir Hata Sınırı bileşeni uygulamak için, bir hataya yanıt olarak state'i güncellemenize ve kullanıcıya bir hata mesajı görüntülemenize olanak tanıyan [`static getDerivedStateFromError`](#static-getderivedstatefromerror) sağlamanız gerekir. Ayrıca isteğe bağlı olarak [`componentDidCatch`'i](#componentdidcatch) uygulayarak ekstra mantık ekleyebilirsiniz, örneğin hatayı bir analiz servisine kaydetmek için.

[`captureOwnerStack`](/reference/react/captureOwnerStack) ile geliştirme sırasında Sahip Yığınını (Owner Stack) dahil edebilirsiniz.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Ardından bileşen ağacınızın bir bölümünü onunla sarmalayabilirsiniz:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

`Profile` veya alt bileşeni bir hata fırlatırsa, `ErrorBoundary` o hatayı "yakalar", sağladığınız hata mesajıyla birlikte bir yedek kullanıcı arayüzü görüntüler ve hata raporlama servisinize bir production hata raporu gönderir.

Her bileşeni ayrı bir Hata Sınırı ile sarmalamanız gerekmez. [Hata Sınırlarının ayrıntı düzeyini](https://www.brandondail.com/posts/fault-tolerance-react) düşünürken, bir hata mesajı görüntülemenin nerede mantıklı olacağını değerlendirin. Örneğin, bir mesajlaşma uygulamasında, konuşma listesinin etrafına bir Hata Sınırı yerleştirmek mantıklıdır. Her bir mesajın etrafına da yerleştirmek mantıklıdır. Ancak her avatarın etrafına bir sınır yerleştirmek mantıklı olmaz.

<Note>

Şu anda bir Hata Sınırını fonksiyon bileşeni olarak yazmanın bir yolu yoktur. Ancak Hata Sınırı sınıfını kendiniz yazmak zorunda değilsiniz. Örneğin, bunun yerine [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) kullanabilirsiniz.

</Note>

---

## Alternatifler {/*alternatives*/}

### Basit bir bileşeni sınıftan fonksiyona taşıma {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Genellikle, bileşenleri bunun yerine [fonksiyon olarak tanımlarsınız](/learn/your-first-component#defining-a-component).

Örneğin, bu `Greeting` sınıf bileşenini bir fonksiyona dönüştürdüğünüzü varsayalım:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

`Greeting` adlı bir fonksiyon tanımlayın. `render` fonksiyonunuzun gövdesini buraya taşıyacaksınız.

```js
function Greeting() {
  // ... render metodundaki kodu buraya taşıyın ...
}
```

`this.props.name` yerine, `name` prop'unu [yapısal ayrıştırma sözdizimini kullanarak](/learn/passing-props-to-a-component) tanımlayın ve doğrudan okuyun:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

İşte tam bir örnek:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### State içeren bir bileşeni sınıftan fonksiyona taşıma {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Bu `Counter` sınıf bileşenini bir fonksiyona dönüştürdüğünüzü varsayalım:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Gerekli [state değişkenleriyle](/reference/react/useState#adding-state-to-a-component) bir fonksiyon bildirerek başlayın:

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Sonra olay işleyicilerini dönüştürün:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Son olarak, `this` ile başlayan tüm referansları bileşeninizde tanımladığınız değişkenler ve fonksiyonlarla değiştirin. Örneğin, `this.state.age`'i `age` ile ve `this.handleNameChange`'i `handleNameChange` ile değiştirin.

İşte tamamen dönüştürülmüş bileşen:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Yaşam döngüsü metodlarına sahip bir bileşeni sınıftan fonksiyona taşıma {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Yaşam döngüsü metodlarına sahip bu `ChatRoom` sınıf bileşenini bir fonksiyona dönüştürdüğünüzü varsayalım:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Önce [`componentWillUnmount`'unuzun](#componentwillunmount) [`componentDidMount`'un](#componentdidmount) tersini yaptığını doğrulayın. Yukarıdaki örnekte bu doğrudur: `componentDidMount`'un kurduğu bağlantıyı keser. Böyle bir mantık eksikse, önce ekleyin.

Sonra, [`componentDidUpdate`](#componentdidupdate) metodunuzun `componentDidMount`'ta kullandığınız tüm prop'lar ve state'deki değişiklikleri işlediğini doğrulayın. Yukarıdaki örnekte, `componentDidMount` `this.state.serverUrl` ve `this.props.roomId`'yi okuyan `setupConnection`'ı çağırır. Bu yüzden `componentDidUpdate`, `this.state.serverUrl` ve `this.props.roomId`'nin değişip değişmediğini kontrol eder ve değiştiyse bağlantıyı sıfırlar. `componentDidUpdate` mantığınız eksikse veya ilgili tüm prop'lar ve state'deki değişiklikleri işlemiyorsa, önce düzeltin.

Yukarıdaki örnekte, yaşam döngüsü metodlarının içindeki mantık bileşeni React dışındaki bir sisteme (sohbet sunucusu) bağlar. Bir bileşeni harici bir sisteme bağlamak için [bu mantığı tek bir Effect olarak tanımlayın:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Bu [`useEffect`](/reference/react/useEffect) çağrısı, yukarıdaki yaşam döngüsü metodlarındaki mantıkla eşdeğerdir. Yaşam döngüsü metodlarınız birbiriyle ilişkisiz birden fazla şey yapıyorsa, [bunları birden fazla bağımsız Effect'e bölün.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) İşte deneyebileceğiniz tam bir örnek:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Bileşeniniz herhangi bir harici sistemle senkronize olmuyorsa, [bir Effect'e ihtiyacınız olmayabilir.](/learn/you-might-not-need-an-effect)

</Note>

---

### Context içeren bir bileşeni sınıftan fonksiyona taşıma {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

Bu örnekte, `Panel` ve `Button` sınıf bileşenleri [context](/learn/passing-data-deeply-with-context)'i [`this.context`'ten](#context) okur:

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Bunları fonksiyon bileşenlerine dönüştürdüğünüzde, `this.context`'i [`useContext`](/reference/react/useContext) çağrılarıyla değiştirin:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
