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
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
>>>>>>> b12743c31af7f5cda2c25534f64281ff030b7205

---

## Kaynak API'ları {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```