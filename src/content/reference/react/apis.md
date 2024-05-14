---
title: "Yerleşik React API'leri"
---

<Intro>

`react` paketi, [Hook](/reference/react)'ların ve [Bileşen](/reference/react/components)'lerin yanı sıra, bileşen tanımlarken kullanışlı olan birkaç farklı API içerir. Bu sayfa, tüm modern React API'lerini listeler.

</Intro>

---

* [`createContext`](/reference/react/createContext), context tanımlamanıza ve alt bileşenlere iletmenizi sağlar. [`useContext`](/reference/react/useContext) ile birlikte kullanılır.
* [`forwardRef`](/reference/react/forwardRef), bir DOM düğümünü üst bileşene ref olarak göstermenizi sağlar. [`useRef`](/reference/react/useRef) ile birlikte kullanılır.
* [`lazy`](/reference/react/lazy), bileşen kodunun yüklenmesini ilk kez render edilene kadar ertelemenizi sağlar.
* [`memo`](/reference/react/memo), bileşeninizin aynı prop'larla yeniden render edilmesini engellemenizi sağlar. [`useMemo`](/reference/react/useMemo) ve [`useCallback`](/reference/react/useCallback) ile birlikte kullanılır.
* [`startTransition`](/reference/react/startTransition), state güncellemesini acil olmadığını belirtecek şekilde işaretlemenizi sağlar. [`useTransition`](/reference/react/useTransition)'a benzerdir.

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