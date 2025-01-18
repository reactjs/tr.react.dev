---
title: "Legacy React API'leri"
---

<Intro>

Bu API'ler `react` paketinden export edilir, ancak yeni yazılmış kodlarda kullanılmaları önerilmez. Önerilen alternatifler için bağlantılı olan her bir API sayfasına bakın.

</Intro>

---

## Legacy APIs {/*legacy-apis*/}

* [`Children`](/reference/react/Children), `children` prop'u olarak alınan JSX'i manipüle etmenizi ve dönüştürmenizi sağlar. [Alternatiflere bakın.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement), başka bir elemanı başlangıç noktası olarak kullanarak bir React elemanı oluşturmanıza olanak tanır. [Alternatiflere bakın.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component), bir React bileşenini JavaScript sınıfı olarak tanımlamanızı sağlar. [Alternatiflere bakın.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement), bir React elemanı oluşturmanıza olanak tanır. Genellikle, bunun yerine JSX kullanırsınız.
* [`createRef`](/reference/react/createRef), keyfi bir değeri içerebilen bir ref nesnesi oluşturur. [Alternatiflere bakın.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef), bileşeninizin bir DOM düğümünü ebeveyn bileşene [ref](/learn/manipulating-the-dom-with-refs) ile açığa çıkarmasına olanak tanır.
* [`isValidElement`](/reference/react/isValidElement), bir değerin bir React elemanı olup olmadığını kontrol eder. Genellikle [`cloneElement` ile](/reference/react/cloneElement) kullanılır.
* [`PureComponent`](/reference/react/PureComponent), [`Bileşen`'e](/reference/react/Component) benzer, ancak aynı prop'larla yeniden render yapmayı atlar. [Alternatiflere bakın.](/reference/react/PureComponent#alternatives)

---

## Kaldırılan API'ler {/*removed-apis*/}

Bu API'ler React 19'da kaldırıldı:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): bunun yerine JSX kullanın.
* Sınıf Bileşenleri: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): bunun yerine [`static contextType`](#static-contexttype) kullanın.
* Sınıf Bileşenleri: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): bunun yerine [`static contextType`](#static-contexttype) kullanın.
* Sınıf Bileşenleri: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): bunun yerine [`Context.Provider`](/reference/react/createContext#provider) kullanın.
* Sınıf Bileşenleri: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): bunun yerine [TypeScript](https://www.typescriptlang.org/) gibi bir tip sistemi kullanın.
* Sınıf Bileşenleri: [`this.refs`](https://18.react.dev//reference/react/Component#refs): bunun yerine [`createRef`](/reference/react/createRef) kullanın.
