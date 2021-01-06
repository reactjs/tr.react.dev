---
id: hooks-reference
title: Hooks API Reference
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook'lar* React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

Bu sayfa React içinde gelen Hook'ların kullanım arayüzünü (API) açıklamaktadır.

Eğer Hook'lara yeniyseniz önce [Bir Bakışta Hook'lar](/docs/hooks-overview.html) bölümüne göz atın. [Sıkça sorulan sorular](/docs/hooks-faq.html) bölümünde de işe yarar bilgiler bulabilirsiniz.

- [Basit Hook'lar](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Diğer Hook'lar](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Basit Hook'lar {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Bir state parçası ve onu güncellemek için bir fonksiyon döndürür.

İlk render aşamasında, döndürülen state parçası (`state`) başlangıçta girilen değerle (`initialState`) aynıdır.

`setState` fonksiyonu state parçasını güncellemek için kullanılır. Yeni bir state değeri kabul eder ve bileşenin yeniden render edilmesini işlem sırasına koyar.

```js
setState(newState);
```

Sonra gelen yeniden-render aşamalarında, `useState` tarafından döndürülen ilk değer, güncelleme uygulandıktan sonraki en son state değerine eşittir.

>Not
>
>React, `setState` fonksiyonunun yeniden-render aşamalarında kimliğini sabit tutulacağı garantisini verir. Bu yüzden `setState` fonksiyonunu `useEffect` ya da `useCallback` hook'larının bağımlı değişkenler listesine eklemenize gerek yoktur.

#### Fonksiyonlu Güncellemeler {#functional-updates}

Eğer yeni state, bir önceki state değerine bağlı olarak hesaplanıyorsa, `setState` içine fonksiyon girebilirsiniz. Bu fonksiyon bir önceki state değerini parametre olarak alır ve güncel state değerini döndürür. `setState` fonksiyonunun her iki çeşidini de kullanan bir örnek sayaç fonksiyonu oluşturalım:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

"+" ve "-" butonları fonksiyonlu çeşidi kullanır, çünkü güncellenen değer bir önceki değere bağlıdır. Ancak "Reset" butonu normal çeşidi kullanır, çünkü her seferinde sayacı başlangıç değerine sıfırlar.

Eğer bu güncelleme fonksiyonunuz mevcut state ile aynı değeri döndürürse, sıradaki yeniden-render işlemi tamamen göz ardı edilir.

> Not
>
> Sınıf bileşenlerindeki `setState` metodunun aksine, `useState` objeleri otomatik olarak birleştirmez. Fonksiyonlu güncelleme metodu ve obje yayma (spread) operatörü birlikte kullanılarak bu özellik yeniden üretilebilir:
>
> ```js
> setState(prevState => {
>   // Object.assign da kullanılabilir
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Diğer bir seçenek ise `useReducer` hook'udur, ki bu birden fazla alt değeri olan objelerin yönetimine daha uygundur.

#### Tembel (lazy) başlangıç state değeri {#lazy-initial-state}

`initialState` değeri ilk render aşamasında kullanılan state değeridir. Sonra gelen render işlemlerinde göz ardı edilir. Eğer başlangıç state değeri ağır bir işlemin sonucu olarak hesaplanıyorsa, bunun yerine yalnızca ilk render aşamasında çalışacak bir fonksiyon girebilirsiniz:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### State güncellemesinden kurtulmak {#bailing-out-of-a-state-update}

Bir State Hook'unu mevcut state değeri ile aynı olan bir değerle güncellerseniz, React render işlemini yapmaz ya da efektleri işleme sokmaz. (React [`Object.is` karşılaştırma algoritmasını](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) kullanır.)

Unutmayın, React yine de bu spesifik bileşeni tekrar render edebilir. Bu durum sorun teşkil etmez çünkü React gereksiz bir şekilde bileşen ağacında derinlere doğru inmez. Render aşamasında ağır hesaplamalar yapıyorsanız, bunları `useMemo` ile optimize edebilirsiniz.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Zorunlu yan etkileri olan bir fonksiyonu parametre olarak alır.

Mutasyonlar, abonelikler, zamanlayıcılar, loglama, ve diğer yan etkisi olan işlemler fonksiyonel bir bileşenin ana gövdesinde bulunamazlar (React'ın _render aşaması_ olarak da bilinir). Böyle yapmak kafa karıştıran hatalara ve kullanıcı arayüzünde (UI) tutarsızlıklara sebep olacaktır.

Bunun yerine, `useEffect` kullanın. `useEffect` içine girilen fonksiyon, render işlemi gerçekleşip bileşenler ekrana yazdırıldıktan sonra çalışacaktır. Efekleri, React'ın tamamen fonksiyonel olan dünyasından gerçek dünyaya bir yangın çıkışı olarak görebilirsiniz.

Varsayılan olarak, efektler her tamamlanan render işleminden sonra çalışır, ancak [sadece belli değerler değiştiğinde](#conditionally-firing-an-effect) çalıştırmak da sizin elinizde.

#### Bir efekti temizlemek {#cleaning-up-an-effect}

Genelde, efektler bileşen ekrandan kaldırılmadan önce temizlenmesi gereken bazı kaynaklar oluşturur, bir abonelik ve zamanlayıcı gibi. Bunu yapmak için, `useEffect` içine girilen fonksiyon bir temizlik fonksiyonu döndürülebilir. Örneğin bir abonelik oluşturalım:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    //Aboneliği temizle
    subscription.unsubscribe();
  };
});
```

Temizlik fonksiyonu, bellek sızıntılarını önlemek için, bileşen ekrandan kaldırılmadan hemen önce çalıştırılır. Ek olarak, bileşen birkaç defa render edilirse (ki genelde edilir), **bir önceki efekt yeni efekt çalıştırılmadan temizlenir**. Bizim örneğimizde bu demektir ki her güncellemede yeni bir abonelik oluşturuluyor. Bir efekti her güncellemede çalıştırmanın önüne geçmek için bir sonraki bölüme bakınız.

#### Efektlerin zamanlaması {#timing-of-effects}

`componentDidMount` ve `componentDidUpdate`'in aksine, `useEffect` içine girilen fonksiyon ekrana yazdırma işleminden **sonra**, gecikmeli bir olay olarak çalışır. Bu `useEffect`'i birçok yaygın yan etki için uygun getirir, mesela aboneliklerin ve olay yöneticilerinin oluşturulması, çünkü birçok işlem türü aslında tarayıcının ekranı güncellemesini engellememelidir.

Buna rağmen, tüm efekler ertelenemeyebilir. Mesela, kullanıcının görebildiği, DOM üzerindeki bir değişiklik bir sonraki ekrana yazdırma aşamasından önce gerçekleşmelidir ki kullanıcı görsel bir uyumsuzluk yaşamasın. (Aradaki ayırım konsept olarak pasif vs. aktif olay dinleyicilerine benzer.) Bu tip efekler için React, [`useLayoutEffect`](#uselayouteffect) adında başka bir hook daha sağlar. Bu hook da `useEffect` ile aynı şekilde çalışır, sadece ne zaman çalıştırılacağı farklıdır.

`useEffect` tarayıcı ekrana yazdırma işlemini tamamlanana kadar geciktirilmiş olmasına rağmen, herhangi bir yeniden-render işleminden önce çalışması da garanti edilir. React her zaman bir önceki render işleminin efektlerini, yeni bir güncellemeye başlamadan önce temizleyecektir.

#### Şartlı olarak bir efekti çalıştırmak {#conditionally-firing-an-effect}

Efektler için varsayılan davranış, her bir tamamlanmış render işleminden sonra efekti çalıştırmaktır. Bu şekilde bir efekt, bağımlı olduğu değişkenlerden birisi değiştiğinde yeniden oluşturulur. 

Ancak, bazı durumlarda bu aşırı güç kullanımı gibi gelebilir, mesela bir önceki bölümdeki abonelik örneğinde olduğu gibi. Her bir güncellemede yeni bir abonelik oluşturmamıza gerek yoktur, sadece `source` prop değeri değişirse.

Bunu uygulamak için, `useEffect`'e efektin bağımlı olduğu değerlerden oluşan bir diziyi ikinci bir argüman girin. Yeni örneğimiz şimdi şu şekilde görünüyor:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Şimdi abonelik yalnızca `props.source` değiştiğinde yeniden oluşturulacaktır.

>Not
>
>Eğer bu optimizasyonu kullanırsanız, diziye **bileşenin içindeki zaman içinde değişen ve efekt içinde kullanılan tüm değerleri** dahil etmeyi unutmayın. Aksi takdirde kodunuz bir önceki render işleminden kalma geçerliliğini yitirmiş değerlere referans gösterecektir. [Fonksiyonlarla nasıl çalışılır](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) ve [dizinin değerleri çok sık değiştiğinde ne yapılır](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) konuları hakkında daha fazla bilgi edinin.
>
>Bir efekti yalnızca bir kere çalıştırıp temizlemek istediğinizde (mount ve unmount aşamalarında), ikinci argüman olarak boş bir dizi (`[]`) gönderebilirsiniz. Böylece React'a, efektin state veya props içindeki hiçbir değere bağlı olmadığını söylemiş olursunuz, böylece efekt *hiçbir* zaman yeniden çalıştırılmaz. Bu özel bir durum değildir -- bağımlı değişkenler dizisinin çalışma prensibi bu şekildedir.
>
>Boş bir dizi girdiğinizde (`[]`), efekt içindeki props ve state her zaman başlangıç değerlerini alırlar. İkinci argüman olarak boş dizi `[]` girmek `componentDidMount` ve `componentWillUnmount` modeline benzese de, efektlerin çok fazla yeniden çalışmasını engellemek için genelde [daha iyi](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [çözümler](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) mevcuttur. Ayrıca, React'ın `useEffect`'in çalıştırılmasını tarayıcı ekrana yazdırdıktan sonraya bıraktığını unutmayın, yani fazladan iş yapmak çok da önemli değil.
>
>
>Biz [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) kuralının [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) paketinin bir parçası olarak kullanılmasını öneriyoruz. Bu paket bağımlı değişkenler yanlış bir şekilde belirtildiğinde uyarır ve bir çözüm önerir.

Bağımlı değişkenler dizisi efekt fonksiyonuna argüman olarak girilmez. Ancak konsept olarak temsil ettikleri şey odur: efekt fonksiyonu içerisinde referans gösterilen her değer bağımlı değişkenler dizisinde de bulunmalıdır. Gelecekte, yeterince gelişmiş bir derleyici bu diziyi otomatik olarak oluşturabilir.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Bir context objesi alır (`React.createContext`'den döndürülen değer) ve mevcut context için o andaki context değerini döndürür. Mevcut context değeri, bileşen ağacında yukarı doğru çıkarken en yakında bulunan `<MyContext.Provider>` ifadesinin `value` değeri tarafından belirlenir. 

Yukarı doğru en yakındaki `<MyContext.Provider>` güncellendiğinde, bu Hook en güncel context `value` değerini `MyContext` sağlayıcısına göndererek bir yeniden-render işlemi tetikler. Yukarıdaki bileşenler [`React.memo`](/docs/react-api.html#reactmemo) ya da [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate) kullansa bile, yeniden-render işlemi `useContext`'i kullanan bileşenden başlayarak yine de gerçekleşir.

`useContext`'e girilen argümanın *context objesinin kendisi* olduğunu unutmayın:

 * **Doğru:** `useContext(MyContext)`
 * **Yanlış:** `useContext(MyContext.Consumer)`
 * **Yanlış:** `useContext(MyContext.Provider)`

`useContext`'i çağıran bir bileşen context değeri her değiştiğinde yeniden-render edilecektir. Eğer bileşenin yeniden-render edilmesi ağır bir işlem ise, [memoization kullanarak](https://github.com/facebook/react/issues/15156#issuecomment-474590693) optimize edebilirsiniz.

>İpucu
>
>Context API ile Hook'lardan önce tanıştıysanız, `useContext(MyContext)` ile sınıf bileşenlerindeki `static contextType = MyContext` ya da `<MyContext.Consumer>` aynı şeylerdir.
>
>`useContext(MyContext)` sadece context'i *okumanıza* olanak sağlar ve oradaki değişikliklere abone olur. Bileşen ağacınızın üst kısımlarında, bu context'in değerinin *sağlayıcısı* olarak `<MyContext.Provider>`'a hala ihtiyacınız vardır. 

**Context.Provider ile parçaları birleştirelim**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
Bu örnek, Context'i ne zaman ve nasıl kullanacağınıza dair bilgiler bulabileceğiniz bir önceki [Context Gelişmiş Rehberi](/docs/context.html) örneğinden alınıp Hook'lar için düzenlenmiştir.


## Additional Hooks {#additional-hooks}

The following Hooks are either variants of the basic ones from the previous section, or only needed for specific edge cases. Don't stress about learning them up front.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to [`useState`](#usestate). Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method. (If you're familiar with Redux, you already know how this works.)

`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because [you can pass `dispatch` down instead of callbacks](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Here's the counter example from the [`useState`](#usestate) section, rewritten to use a reducer:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Note
>
>React guarantees that `dispatch` function identity is stable and won't change on re-renders. This is why it's safe to omit from the `useEffect` or `useCallback` dependency list.

#### Specifying the initial state {#specifying-the-initial-state}

There are two different ways to initialize `useReducer` state. You may choose either one depending on the use case. The simplest way is to pass the initial state as a second argument:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Note
>
>React doesn’t use the `state = initialState` argument convention popularized by Redux. The initial value sometimes needs to depend on props and so is specified from the Hook call instead. If you feel strongly about this, you can call `useReducer(reducer, undefined, reducer)` to emulate the Redux behavior, but it's not encouraged.

#### Lazy initialization {#lazy-initialization}

You can also create the initial state lazily. To do this, you can pass an `init` function as the third argument. The initial state will be set to `init(initialArg)`.

It lets you extract the logic for calculating the initial state outside the reducer. This is also handy for resetting the state later in response to an action:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Bailing out of a dispatch {#bailing-out-of-a-dispatch}

If you return the same value from a Reducer Hook as the current state, React will bail out without rendering the children or firing effects. (React uses the [`Object.is` comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) callback.

Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. `shouldComponentUpdate`).

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

> Note
>
> The array of dependencies is not passed as arguments to the callback. Conceptually, though, that's what they represent: every value referenced inside the callback should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.

Pass a "create" function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

If no array is provided, a new value will be computed on every render.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

> Note
>
> The array of dependencies is not passed as arguments to the function. Conceptually, though, that's what they represent: every value referenced inside the function should also appear in the dependencies array. In the future, a sufficiently advanced compiler could create this array automatically.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

A common use case is to access a child imperatively:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Essentially, `useRef` is like a "box" that can hold a mutable value in its `.current` property.

You might be familiar with refs primarily as a way to [access the DOM](/docs/refs-and-the-dom.html). If you pass a ref object to React with `<div ref={myRef} />`, React will set its `.current` property to the corresponding DOM node whenever that node changes.

However, `useRef()` is useful for more than the `ref` attribute. It's [handy for keeping any mutable value around](/docs/hooks-faq.html#is-there-something-like-instance-variables) similar to how you'd use instance fields in classes.

This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that `useRef` will give you the same ref object on every render.

Keep in mind that `useRef` *doesn't* notify you when its content changes. Mutating the `.current` property doesn't cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) instead.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` customizes the instance value that is exposed to parent components when using `ref`. As always, imperative code using refs should be avoided in most cases. `useImperativeHandle` should be used with [`forwardRef`](/docs/react-api.html#reactforwardref):

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

In this example, a parent component that renders `<FancyInput ref={inputRef} />` would be able to call `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.

Prefer the standard `useEffect` when possible to avoid blocking visual updates.

> Tip
>
> If you're migrating code from a class component, note `useLayoutEffect` fires in the same phase as `componentDidMount` and `componentDidUpdate`. However, **we recommend starting with `useEffect` first** and only trying `useLayoutEffect` if that causes a problem.
>
>If you use server rendering, keep in mind that *neither* `useLayoutEffect` nor `useEffect` can run until the JavaScript is downloaded. This is why React warns when a server-rendered component contains `useLayoutEffect`. To fix this, either move that logic to `useEffect` (if it isn't necessary for the first render), or delay showing that component until after the client renders (if the HTML looks broken until `useLayoutEffect` runs).
>
>To exclude a component that needs layout effects from the server-rendered HTML, render it conditionally with `showChild && <Child />` and defer showing it with `useEffect(() => { setShowChild(true); }, [])`. This way, the UI doesn't appear broken before hydration.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` can be used to display a label for custom hooks in React DevTools.

For example, consider the `useFriendStatus` custom Hook described in ["Building Your Own Hooks"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> Tip
>
> We don't recommend adding debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries.

#### Defer formatting debug values {#defer-formatting-debug-values}

In some cases formatting a value for display might be an expensive operation. It's also unnecessary unless a Hook is actually inspected.

For this reason `useDebugValue` accepts a formatting function as an optional second parameter. This function is only called if the Hooks are inspected. It receives the debug value as a parameter and should return a formatted display value.

For example a custom Hook that returned a `Date` value could avoid calling the `toDateString` function unnecessarily by passing the following formatter:

```js
useDebugValue(date, date => date.toDateString());
```
