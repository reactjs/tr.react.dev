---
title: "Yerleşik React API'leri"
---

<Intro>

[Hooks](/reference/react/hooks) ve [Components](/reference/react/components)’e ek olarak,
`react` paketi bileşen tanımlamak için faydalı birkaç başka API daha dışa aktarır (**export eder**). Bu sayfa, modern React API’lerinin geri kalanını listeler.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext), context tanımlamanıza ve alt bileşenlere iletmenizi sağlar. [`useContext`](/reference/react/useContext) ile birlikte kullanılır.
* [`forwardRef`](/reference/react/forwardRef), bir DOM düğümünü üst bileşene ref olarak göstermenizi sağlar. [`useRef`](/reference/react/useRef) ile birlikte kullanılır.
* [`lazy`](/reference/react/lazy), bileşen kodunun yüklenmesini ilk kez render edilene kadar ertelemenizi sağlar.
* [`memo`](/reference/react/memo), bileşeninizin aynı prop'larla yeniden render edilmesini engellemenizi sağlar. [`useMemo`](/reference/react/useMemo) ve [`useCallback`](/reference/react/useCallback) ile birlikte kullanılır.
* [`startTransition`](/reference/react/startTransition), state güncellemesini acil olmadığını belirtecek şekilde işaretlemenizi sağlar. [`useTransition`](/reference/react/useTransition)'a benzerdir.
* [`act`](/reference/react/act) doğrulamalarınızı (assertions) yapmadan önce önce güncellemelerin işlendiğinden emin olmak için testlerinizdeki renderları ve etkileşimleri sarmalamanıza olanak tanır.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.

>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec
---

## Kaynak API'ları {/*resource-apis*/}

*Kaynaklar*, bir bileşen tarafından durumlarının bir parçası olmadan erişilebilir. Örneğin, bir bileşen, bir Promise'den mesaj okuyabilir veya bir context'ten stil bilgisi alabilir.

<<<<<<< HEAD
Bir kaynaktan değer okumak için bu API'yi kullanın:

* [`use`](/reference/react/use), bir kaynağın değerini okumayı sağlar, örneğin bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya [context](/learn/passing-data-deeply-with-context).
=======
You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* <CanaryBadge /> The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```