---
title: Geçersiz Hook Çağrıları
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

 Muhtemelen aşağıdaki hatayı aldığınız için buradasınız:

 > Hooks can only be called inside the body of a function component.

Yaygın 3 sebebi vardır:

1. React ve React DOM sürümleriniz  **uyumsuz** olabilir.
2.  **[Hook Kuralları](/docs/hooks-rules.html)'nı çiğnemiş** olabilirsiniz.
3. Aynı uygulama içerisinde  **birden fazla React kopyası** mevcuttur.

Tüm bu durumları tek tek inceleyelim.

## React ve React DOM sürümlerinin uyumsuz olması {#mismatching-versions-of-react-and-react-dom}

Henüz Hook desteklemeyen `react-dom` (< 16.8.0) veya `react-native` (< 0.59) bir sürüm kullanıyor olabilirsiniz. Kullanılan sürümü öğrenmek için `npm ls react-dom` veya `npm ls react-native` komutlarını çalıştırabilirsiniz. Eğer birden fazla sürüm bulundu ise sorun bundan olabilir (devamı aşağıda).

## Hook Kurallarını Çiğnemek {#breaking-the-rules-of-hooks}

Hook'ları yalnızca **fonksiyon bileşenlerinin içinde** kullanabilirsiniz:

* ✅ Hook'ları fonksiyon bileşenin en tepesinde çağırın.
* ✅ Özel Hook'ların içinde de en tepede çağırın [özel Hook](/docs/hooks-custom.html).

**Bu konuya dair daha fazlasını [Hook kuralları](/docs/hooks-rules.html) bölümünde öğrenin.**

```js{2-3,8-9}
function Counter() {
  // ✅ İyi: fonksiyon bileşenin tepesinde çağırılmış
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ İyi: zel Hook'un tepesinde çağırılmış
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Karışıklığı önlemek için, diğer durumlarda Hook'ları kullanmak **desteklenmez**:

* 🔴 Sınıf bileşenin içinde çağırmayın.
* 🔴 Olay yöneticisi içinde çağırmayın.
* 🔴 `useMemo`, `useReducer`, veya `useEffect` içinde Hook'ları kullanmayın

Bu kuralları çiğnerseniz aşağadıki hataları görebilirsiniz.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Kötü: Olay yöneticisi içinde (düzeltmek için dışarı taşı!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Kötü: useMemo içinde (düzeltmek için dışarı taşı!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Kötü: Sınıf bileşenin içinde
    useEffect(() => {})
    // ...
  }
}
```

[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) eklentisini kullanarak bu hataları yakalayabilirsiniz.

>Not
>
>[Özel Hook'lar](/docs/hooks-custom.html) başka Hook'ları çağıralabilir(tüm amaçları budur). Bu işe yarar, çünkü Hook'lar yalnızca bir fonksiyon bileşeni içerisindeszn çağırılabiliyordu.


## Birden Fazla React {#duplicate-react}

Hook'ların çalışması için, uygulama kodunuza import ettiğiniz `react` ile `react-dom` içerisindeki  `react` aynı olmalıdır.

Eğer bunlar farklı ise bu uyarıyı alabilirsiniz . **Yanlışlıkla 2 farklı react sürümüne ait paket kurulmuş olabilir**.

Paket yönetimi için node kullanıyorsanız bu komutu proje içerisinde çalıştırabilirsiniz:

    npm ls react

Eğer birden fazla react sürümü görürseniz bu sorunu çözmeniz gerekmektedir. Örneğin yanlış kullandığınız bir kütüphane `React`'ı bağımlılık olarak belirtir(aynı react'ı kullanmak yerine).Bu kütüphane düzeltilinceye kadar,  [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) olası geçici çözümdür.

Ayrıca, bazı log'lar ekleyerek ve sunucuyu yeniden başlatarak bu sorunu çözmeyi deneyebilirsiniz:

```js
// Bunu node_modules/react-dom/index.js dosyasına ekleyin
window.React1 = require('react');

// Bunu bileşen dosyanıza ekleyin
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Eğer ekrana `false` yazıyorsa iki farklı react olabilir ve bunun neden olduğunu çözmeniz gerekebilir. [Bu sorun](https://github.com/facebook/react/issues/13991) topluluğun karşılaştığı bazı genel nedenleri içerir.

Bu sorun, `npm link` veya eşdeğer bir komut kullandığınızda ortaya çıkabilir. Bu durumda paket yöneticiniz, biri uygulama içerisinde bir diğeri kütüphane klasörü içerisinde olmak üzere 2 farklı React görebilir.
`myapp` ve `mylib` kardeş klasöler olduğu varsayılırsa olası bir düzeltme için `mylib` klasöründe `npm link` komutu çalıştırılmalıdır.Bu, kütüphanenin uygulama içerisindeki React kopyasını kullanmasını sağlar

>Not
>
>Genel olarak , React bir sayfada birden fazla bağımsız kopya kullanmayı destekler(örneğin bir uygulama ve third-party eklenti kullanıyorsa). `require('react')` sadece , bileşen içerisindeki ile `react-dom` içerisindeki sürümler farklı ise çalışmaz.    

## Diğer Nedenler {#other-causes}

Bunların hiçbiri işe yaramaz ise lütfen bize [bu sorun başlığı](https://github.com/facebook/react/issues/13991) altında bildirin. Küçük bir uygulama oluşturarak tekrar deneyebilirsiniz — belki hatayı bu şekilde bulabilirsiniz.
