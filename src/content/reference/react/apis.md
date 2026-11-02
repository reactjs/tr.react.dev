---
title: "Yerleşik React API'leri"
---

<Intro>

[Hooks](/reference/react/hooks) ve [Components](/reference/react/components)’e ek olarak,
`react` paketi bileşen tanımlamak için faydalı birkaç başka API daha dışa aktarır (**export eder**). Bu sayfa, modern React API’lerinin geri kalanını listeler.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext), context tanımlamanızı ve child component’lere sağlamanızı sağlar. [`useContext`](/reference/react/useContext) ile birlikte kullanılır.
* [`lazy`](/reference/react/lazy), bir component’in code’unun yüklenmesini ilk kez render edilene kadar ertelemenizi sağlar.
* [`memo`](/reference/react/memo), component’inizin aynı prop’larla gerçekleşen re-render’ları atlamasını sağlar. [`useMemo`](/reference/react/useMemo) ve [`useCallback`](/reference/react/useCallback) ile birlikte kullanılır.
* [`startTransition`](/reference/react/startTransition), bir state update’i non-urgent olarak işaretlemenizi sağlar. [`useTransition`](/reference/react/useTransition) ile benzerdir.
* [`act`](/reference/react/act), testlerde render ve interaction’ları sarmalamanızı sağlar; böylece assertion yapmadan önce update’lerin işlendiğinden emin olabilirsiniz.
* [`cache`](/reference/react/cache), bir data fetch veya computation sonucunu cache’lemenizi sağlar.
* [`cacheSignal`](/reference/react/cacheSignal), `cache()` lifetime’ının ne zaman sona erdiğini bilmenizi sağlar.
* [`captureOwnerStack`](/reference/react/captureOwnerStack), development ortamında mevcut Owner Stack’i okur ve mevcutsa string olarak döndürür.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`addTransitionType`](/reference/react/addTransitionType) lets you specify the cause of a Transition. Used with [`startTransition`](/reference/react/startTransition) and [`<ViewTransition>`.](/reference/react/ViewTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.
>>>>>>> 0821e7d9428a6c58c922765b891bbffba9ed6249

---

## Kaynak API'ları {/*resource-apis*/}

*Kaynaklar*, bir bileşen tarafından durumlarının bir parçası olmadan erişilebilir. Örneğin, bir bileşen, bir Promise'den mesaj okuyabilir veya bir context'ten stil bilgisi alabilir.

[`use`](/reference/react/use)’a şu resource type’larını geçirebilirsiniz:

<<<<<<< HEAD
* Resolved value’sunu okumak için bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
* Value’sunu okumak için bir [context](/learn/passing-data-deeply-with-context).
* <CanaryBadge /> Server rendering sırasında bir component’i browser-only olarak işaretlemek için [`browser`](/reference/react-dom/browser) tarafından döndürülen value.
=======
* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.
>>>>>>> 0821e7d9428a6c58c922765b891bbffba9ed6249

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```