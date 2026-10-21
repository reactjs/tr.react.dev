---
title: "Yerleşik React API'leri"
---

<Intro>

[Hooks](/reference/react/hooks) ve [Components](/reference/react/components)’e ek olarak,
`react` paketi bileşen tanımlamak için faydalı birkaç başka API daha dışa aktarır (**export eder**). Bu sayfa, modern React API’lerinin geri kalanını listeler.

</Intro>

---

* [`createContext`](/reference/react/createContext), context tanımlamanızı ve child component’lere sağlamanızı sağlar. [`useContext`](/reference/react/useContext) ile birlikte kullanılır.
* [`lazy`](/reference/react/lazy), bir component’in code’unun yüklenmesini ilk kez render edilene kadar ertelemenizi sağlar.
* [`memo`](/reference/react/memo), component’inizin aynı prop’larla gerçekleşen re-render’ları atlamasını sağlar. [`useMemo`](/reference/react/useMemo) ve [`useCallback`](/reference/react/useCallback) ile birlikte kullanılır.
* [`startTransition`](/reference/react/startTransition), bir state update’i non-urgent olarak işaretlemenizi sağlar. [`useTransition`](/reference/react/useTransition) ile benzerdir.
* [`act`](/reference/react/act), testlerde render ve interaction’ları sarmalamanızı sağlar; böylece assertion yapmadan önce update’lerin işlendiğinden emin olabilirsiniz.
* [`cache`](/reference/react/cache), bir data fetch veya computation sonucunu cache’lemenizi sağlar.
* [`cacheSignal`](/reference/react/cacheSignal), `cache()` lifetime’ının ne zaman sona erdiğini bilmenizi sağlar.
* [`captureOwnerStack`](/reference/react/captureOwnerStack), development ortamında mevcut Owner Stack’i okur ve mevcutsa string olarak döndürür.

---

## Kaynak API'ları {/*resource-apis*/}

*Kaynaklar*, bir bileşen tarafından durumlarının bir parçası olmadan erişilebilir. Örneğin, bir bileşen, bir Promise'den mesaj okuyabilir veya bir context'ten stil bilgisi alabilir.

[`use`](/reference/react/use)’a şu resource type’larını geçirebilirsiniz:

* Resolved value’sunu okumak için bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
* Value’sunu okumak için bir [context](/learn/passing-data-deeply-with-context).
* <CanaryBadge /> Server rendering sırasında bir component’i browser-only olarak işaretlemek için [`browser`](/reference/react-dom/browser) tarafından döndürülen value.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```