---
title: "Yerleşik React API'leri"
---

<Intro>

`react` paketi, [Hook](/reference/react)'ların ve [Bileşen](/reference/react/components)'lerin yanı sıra, bileşen tanımlarken kullanışlı olan birkaç farklı API içerir. Bu sayfa, tüm modern React API'lerini listeler.

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

>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
---

## Kaynak API'ları {/*resource-apis*/}

*Kaynaklar*, bir bileşen tarafından durumlarının bir parçası olmadan erişilebilir. Örneğin, bir bileşen, bir Promise'den mesaj okuyabilir veya bir context'ten stil bilgisi alabilir.

Bir kaynaktan değer okumak için bu API'yi kullanın:

* [`use`](/reference/react/use), bir kaynağın değerini okumayı sağlar, örneğin bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) veya [context](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```