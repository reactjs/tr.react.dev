---
title: "Yerleşik React API'leri"
---

<Intro>

<<<<<<< HEAD
`react` paketi, [Hook](/reference/react)'ların ve [Bileşen](/reference/react/components)'lerin yanı sıra, bileşen tanımlarken kullanışlı olan birkaç farklı API içerir. Bu sayfa, tüm modern React API'lerini listeler.
=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

</Intro>

---

* [`createContext`](/reference/react/createContext), context tanımlamanıza ve alt bileşenlere iletmenizi sağlar. [`useContext`](/reference/react/useContext) ile birlikte kullanılır.
* [`forwardRef`](/reference/react/forwardRef), bir DOM düğümünü üst bileşene ref olarak göstermenizi sağlar. [`useRef`](/reference/react/useRef) ile birlikte kullanılır.
* [`lazy`](/reference/react/lazy), bileşen kodunun yüklenmesini ilk kez render edilene kadar ertelemenizi sağlar.
* [`memo`](/reference/react/memo), bileşeninizin aynı prop'larla yeniden render edilmesini engellemenizi sağlar. [`useMemo`](/reference/react/useMemo) ve [`useCallback`](/reference/react/useCallback) ile birlikte kullanılır.
* [`startTransition`](/reference/react/startTransition), state güncellemesini acil olmadığını belirtecek şekilde işaretlemenizi sağlar. [`useTransition`](/reference/react/useTransition)'a benzerdir.
* [`act`](/reference/react/act) doğrulamalarınızı (assertions) yapmadan önce önce güncellemelerin işlendiğinden emin olmak için testlerinizdeki renderları ve etkileşimleri sarmalamanıza olanak tanır.
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