---
title: React Compiler
---

<Intro>
Bu sayfa size React Compiler'ı tanıtacak ve nasıl başarılı bir şekilde deneyebileceğinizi gösterecektir.
</Intro>

<Wip>
Bu dokümanlar üzerinde hala çalışılmaktadır. Daha fazla belge [React Compiler Çalışma Grubu reposu](https://github.com/reactwg/react-compiler/discussions) adresinde mevcuttur ve daha kararlı hale geldiklerinde bu belgelere eklenecektir.
</Wip>

<YouWillLearn>

* Derleyici ile çalışmaya başlama
* Derleyicinin ve ESLint eklentisinin yüklenmesi
* Sorun Giderme

</YouWillLearn>

<Note>
React Compiler, şu anda Beta aşamasında olan ve topluluktan erken geri bildirim almak için açık kaynaklı hale getirdiğimiz yeni bir derleyicidir. Meta gibi şirketlerde üretimde kullanılmış olsa da, derleyiciyi uygulamanız için üretime almak kod tabanınızın sağlığına ve [React Kuralları](/reference/rules)'nı ne kadar iyi takip ettiğinize bağlı olacaktır.

En son Beta sürümü `@beta` etiketiyle, günlük deneysel sürümler ise `@experimental` etiketiyle bulunabilir.
</Note>

React Compiler, topluluktan erken geri bildirim almak için açık kaynaklı hale getirdiğimiz yeni bir derleyicidir. React uygulamanızı otomatik olarak optimize eden yalnızca derleme zamanlı bir araçtır. Düz JavaScript ile çalışır ve [React Kuralları](/reference/rules)'nı anlar, bu nedenle kullanmak için herhangi bir kodu yeniden yazmanıza gerek yoktur.

Derleyici ayrıca, derleyiciden gelen analizi doğrudan düzenleyicinizde ortaya çıkaran bir [ESLint eklentisi](#installing-eslint-plugin-react-compiler) içerir. **Bugün herkesin linter kullanmasını şiddetle tavsiye ediyoruz.** Linter, derleyicinin yüklü olmasını gerektirmez, bu nedenle derleyiciyi denemeye hazır olmasanız bile kullanabilirsiniz.

Derleyici şu anda `beta` olarak yayınlanmaktadır ve React 17+ uygulamaları ve kütüphaneleri üzerinde denenebilir. Beta sürümünü yüklemek için:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Ya da Yarn kullanıyorsanız:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Henüz React 19 kullanmıyorsanız, daha fazla talimat için lütfen [aşağıdaki bölüme](#using-react-compiler-with-react-17-or-18) bakın.

### Derleyici ne yapar? {/*what-does-the-compiler-do*/}

Uygulamaları optimize etmek için React Compiler kodunuzu otomatik olarak memoize eder. Bugün `useMemo`, `useCallback` ve `React` gibi API'ler aracılığıyla memoizasyona aşina olabilirsiniz.memo`. Bu API'ler ile React'e, girdileri değişmediyse uygulamanızın belirli bölümlerinin yeniden hesaplanmasına gerek olmadığını söyleyebilir, güncellemeler üzerindeki çalışmayı azaltabilirsiniz. Güçlü olmalarına rağmen, memoizasyon uygulamayı unutmak veya yanlış uygulamak kolaydır. React, kullanıcı arayüzünüzün herhangi bir _anlamlı_ değişikliğe sahip olmayan kısımlarını kontrol etmek zorunda olduğundan, bu durum verimsiz güncellemelere yol açabilir.

Derleyici, JavaScript ve React'in kuralları hakkındaki bilgisini kullanarak bileşenleriniz ve kancalarınızdaki değerleri veya değer gruplarını otomatik olarak hafızaya alır. Kuralların ihlal edildiğini tespit ederse, otomatik olarak sadece bu bileşenlerin veya kancaların üzerinden atlayacak ve diğer kodu güvenli bir şekilde derlemeye devam edecektir.

<Note>
React Compiler, React kurallarının ne zaman bozulduğunu statik olarak tespit edebilir ve yalnızca etkilenen bileşenleri veya kancaları optimize etmeyi güvenli bir şekilde devre dışı bırakabilir. Derleyicinin kod tabanınızın %100'ünü optimize etmesi gerekli değildir.
</Note>

Kod tabanınız zaten çok iyi ezberlenmişse, derleyici ile büyük performans iyileştirmeleri görmeyi beklemeyebilirsiniz. Ancak, pratikte performans sorunlarına neden olan doğru bağımlılıkları elle not etmek zordur.

<DeepDive>
#### React Compiler ne tür notlar ekliyor? {/*what-kind-of-memoization-does-react-compiler-add*/}

React Compiler'ın ilk sürümü öncelikle **güncelleme performansını iyileştirmeye** (mevcut bileşenleri yeniden oluşturma) odaklanmıştır, bu nedenle şu iki kullanım durumuna odaklanmaktadır:

1. **Bileşenlerin basamaklı olarak yeniden oluşturulması atlanıyor**
    * `<Parent />` bileşeninin yeniden oluşturulması, yalnızca `<Parent />` değişmiş olsa bile bileşen ağacındaki birçok bileşenin yeniden oluşturulmasına neden olur
1. **Pahalı hesaplamaları React'in dışından atlama**
    * Örneğin, bu verilere ihtiyaç duyan bileşeninizin veya kancanızın içinde `expensivelyProcessAReallyLargeArrayOfObjects()` çağrısı yapmak

#### Yeniden Oluşturmaları Optimize Etme {/*optimizing-re-renders*/}

React, kullanıcı arayüzünüzü mevcut durumlarının bir fonksiyonu olarak ifade etmenizi sağlar (daha somut olarak: props, state ve context). Mevcut uygulamasında, bir bileşenin durumu değiştiğinde, React o bileşeni _ve tüm alt bileşenlerini_ yeniden oluşturacaktır - eğer `useMemo()`, `useCallback()` veya `React.memo()` ile bir çeşit manuel memoizasyon uygulamadıysanız. Örneğin, aşağıdaki örnekte `<MessageButton>`, `<FriendList>`'in durumu her değiştiğinde yeniden oluşturulur:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} çevrimiçi</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_React Compiler Playground'daki bu örneğe bakın_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler, manuel memoizasyonun eşdeğerini otomatik olarak uygulayarak, bir uygulamanın yalnızca ilgili bölümlerinin durum değiştikçe yeniden oluşturulmasını sağlar; bu bazen “ince taneli reaktivite” olarak adlandırılır. Yukarıdaki örnekte React Compiler, `<FriendListCard />`ın geri dönüş değerinin `friends` değişse bile yeniden kullanılabileceğini belirler ve bu JSX'i yeniden oluşturmaktan _ve_ sayı değiştikçe `<MessageButton>`'ı yeniden oluşturmaktan kaçınabilir.

#### Pahalı hesaplamalar da hafızaya alınır {/*expensive-calculations-also-get-memoized*/}

Derleyici ayrıca render sırasında kullanılan pahalı hesaplamalar için otomatik olarak memoize edebilir:

```js
// **Not** Bu bir bileşen veya hook olmadığı için React Compiler tarafından memoized
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Bu bir bileşen olduğu için React Compiler tarafından not edilir
function TableContainer({ items }) {
  // Bu fonksiyon çağrısı hafızaya alınacaktır:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Bu örneğe şuradan bakabilirsiniz React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Ancak, `expensivelyProcessAReallyLargeArrayOfObjects` gerçekten pahalı bir işlevse, React dışında kendi memoizasyonunu uygulamayı düşünebilirsiniz, çünkü:

- React Derleyici her işlevi değil, yalnızca React bileşenlerini ve hook'larını belleğe alır
- React Compiler'ın memoizasyonu birden fazla bileşen veya hook arasında paylaşılmaz

Dolayısıyla, `expensivelyProcessAReallyLargeArrayOfObjects' birçok farklı bileşende kullanılmışsa, aynı öğeler aşağı aktarılsa bile, bu pahalı hesaplama tekrar tekrar çalıştırılacaktır. Kodu daha karmaşık hale getirmeden önce gerçekten bu kadar pahalı olup olmadığını görmek için önce [profiling](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) öneririz.
</DeepDive>

### Derleyiciyi denemeli miyim? {/*should-i-try-out-the-compiler*/}

Lütfen derleyicinin hala Beta aşamasında olduğunu ve birçok pürüze sahip olduğunu unutmayın. Meta gibi şirketlerde üretimde kullanılmış olsa da, derleyiciyi uygulamanız için üretime almak kod tabanınızın sağlığına ve [React Kuralları](/reference/rules)'nı ne kadar iyi takip ettiğinize bağlı olacaktır.

**Derleyiciyi şimdi kullanmak için acele etmenize gerek yok. Benimsemeden önce kararlı bir sürüme ulaşmasını beklemenizde bir sakınca yoktur.** Bununla birlikte, derleyiciyi daha iyi hale getirmemize yardımcı olmak için bize [geri bildirim](#reporting-issues) sağlayabilmeniz için uygulamalarınızda küçük deneylerle denemekten memnuniyet duyarız.

## Başlarken {/*getting-started*/}

Bu dokümanlara ek olarak, derleyici hakkında daha fazla bilgi ve tartışma için [React Compiler Working Group](https://github.com/reactwg/react-compiler) adresini kontrol etmenizi öneririz.

### eslint-plugin-react-compiler'ı yükleme {/*installing-eslint-plugin-react-compiler*/}

React Compiler ayrıca bir ESLint eklentisine de güç verir. ESLint eklentisi derleyiciden **bağımsız** olarak kullanılabilir, yani derleyiciyi kullanmasanız bile ESLint eklentisini kullanabilirsiniz.

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Ardından, ESLint yapılandırmanıza ekleyin:

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

Ya da kullanımdan kaldırılmış eslintrc yapılandırma biçiminde:

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

ESLint eklentisi, editörünüzde React kurallarının herhangi bir ihlalini gösterecektir. Bunu yaptığında, derleyicinin o bileşeni veya hook'u optimize etmeyi atladığı anlamına gelir. Bu tamamen normaldir ve derleyici kod tabanınızdaki diğer bileşenleri kurtarabilir ve optimize etmeye devam edebilir.

<Note>
**Tüm ESLint ihlallerini hemen düzeltmek zorunda değilsiniz.** Optimize edilen bileşen ve hook miktarını artırmak için bunları kendi hızınızda ele alabilirsiniz, ancak derleyiciyi kullanmadan önce her şeyi düzeltmeniz gerekmez.
</Note>

### Derleyiciyi kod tabanınızda kullanıma sunma {/*using-the-compiler-effectively*/}

#### Mevcut projeler {/*existing-projects*/}
Derleyici, [React Kuralları](/reference/rules)'na uyan işlevsel bileşenleri ve kancaları derlemek için tasarlanmıştır. Ayrıca, bu bileşenleri veya hook'ları atlayarak (üzerinden atlayarak) bu kuralları ihlal eden kodlarla da başa çıkabilir. Ancak JavaScript'in esnek yapısı nedeniyle derleyici olası her ihlali yakalayamaz ve yanlış negatiflerle derleme yapabilir: Yani, derleyici yanlışlıkla React kurallarını ihlal eden bir bileşeni/hook'u derleyebilir ve bu da tanımlanmamış davranışlara yol açabilir.

Bu nedenle, derleyiciyi mevcut projelere başarıyla uyarlamak için önce ürün kodunuzdaki küçük bir dizinde çalıştırmanızı öneririz. Bunu, derleyiciyi yalnızca belirli bir dizin kümesinde çalışacak şekilde yapılandırarak yapabilirsiniz:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

Derleyiciyi yayma konusunda kendinize daha fazla güvendiğinizde, kapsamı diğer dizinlere de genişletebilir ve yavaş yavaş tüm uygulamanıza yayabilirsiniz.

#### Yeni projeler {/*new-projects*/}

Yeni bir proje başlatıyorsanız, varsayılan davranış olan kod tabanınızın tamamında derleyiciyi etkinleştirebilirsiniz.

### React Compiler'ı React 17 veya 18 ile Kullanma {/*using-react-compiler-with-react-17-or-18*/}

React Compiler en iyi React 19 RC ile çalışır. Yükseltme yapamıyorsanız, derlenen kodun 19'dan önceki sürümlerde çalışmasına izin verecek ekstra `react-compiler-runtime` paketini yükleyebilirsiniz. Ancak, desteklenen minimum sürümün 17 olduğunu unutmayın.

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

Ayrıca derleyici yapılandırmanıza doğru `target`ı eklemelisiniz, burada `target` hedeflediğiniz React'in ana sürümüdür:

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Derleyiciyi kütüphaneler üzerinde kullanma {/*using-the-compiler-on-libraries*/}

React Compiler, kütüphaneleri derlemek için de kullanılabilir. React Compiler'ın herhangi bir kod dönüşümünden önce orijinal kaynak kod üzerinde çalışması gerektiğinden, bir uygulamanın derleme hattının kullandıkları kütüphaneleri derlemesi mümkün değildir. Bu nedenle, önerimiz kütüphane sorumlularının kütüphanelerini derleyici ile bağımsız olarak derleyip test etmeleri ve derlenmiş kodu npm'ye göndermeleridir.

Kodunuz önceden derlendiğinden, kütüphanenizin kullanıcılarının kütüphanenize uygulanan otomatik bellekleştirmeden yararlanmak için derleyiciyi etkinleştirmeleri gerekmeyecektir.Kütüphaneniz henüz React 19'da olmayan uygulamaları hedefliyorsa, minimum [`target` belirtin ve doğrudan bağımlılık olarak `react-compiler-runtime` ekleyin](#using-react-compiler-with-react-17-or-18). Çalışma zamanı paketi, uygulamanın sürümüne bağlı olarak API'lerin doğru uygulamasını kullanacak ve gerekirse eksik API'leri çoklu dolduracaktır.

Kütüphane kodu genellikle daha karmaşık kalıplar ve kaçış kapaklarının kullanılmasını gerektirebilir. Bu nedenle, kütüphanenizde derleyiciyi kullanırken ortaya çıkabilecek sorunları tespit etmek için yeterli test yapmanızı öneririz. Herhangi bir sorun tespit ederseniz, [`'use no memo'` yönergesi](#something-is-working-notafter-compilation) ile belirli bileşenleri veya hook'ları her zaman devre dışı bırakabilirsiniz.

Uygulamalara benzer şekilde, kütüphanenizin faydalarını görmek için bileşenlerinizin veya hook'larınızın %100'ünü tamamen derlemeniz gerekmez. İyi bir başlangıç noktası, kütüphanenizin performansa en duyarlı kısımlarını belirlemek ve tanımlamak için `eslint-plugin-react-compiler` kullanabileceğiniz [React Kuralları](/reference/rules)'nı ihlal etmediklerinden emin olmak olabilir.

## Kullanım {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@beta
</TerminalBlock>

Derleyici, derleyiciyi çalıştırmak için derleme hattınızda kullanabileceğiniz bir Babel eklentisi içerir.

Yükledikten sonra Babel yapılandırmanıza ekleyin. Lütfen derleyicinin pipeline'da **ilk** olarak çalışmasının kritik olduğunu unutmayın:

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // önce koşmalı!
      // ...
    ],
  };
};
```

Derleyici ses analizi için girdi kaynak bilgisine ihtiyaç duyduğundan `babel-plugin-react-compiler` diğer Babel eklentilerinden önce çalıştırılmalıdır.

### Vite {/*usage-with-vite*/}

If you use Vite, you can add the plugin to vite-plugin-react:

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Please refer to the [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) for more information.

### Remix {/*usage-with-remix*/}
Install `vite-plugin-babel`, and add the compiler's Babel plugin to it:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

A community Webpack loader is [now available here](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Please refer to [Expo's docs](https://docs.expo.dev/guides/react-compiler/) to enable and use the React Compiler in Expo apps.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native uses Babel via Metro, so refer to the [Usage with Babel](#usage-with-babel) section for installation instructions.

### Rspack {/*usage-with-rspack*/}

Please refer to [Rspack's docs](https://rspack.dev/guide/tech/react#react-compiler) to enable and use the React Compiler in Rspack apps.

### Rsbuild {/*usage-with-rsbuild*/}

Please refer to [Rsbuild's docs](https://rsbuild.dev/guide/framework/react#react-compiler) to enable and use the React Compiler in Rsbuild apps.

## Troubleshooting {/*troubleshooting*/}

To report issues, please first create a minimal repro on the [React Compiler Playground](https://playground.react.dev/) and include it in your bug report. You can open issues in the [facebook/react](https://github.com/facebook/react/issues) repo.

You can also provide feedback in the React Compiler Working Group by applying to be a member. Please see [the README for more details on joining](https://github.com/reactwg/react-compiler).

### What does the compiler assume? {/*what-does-the-compiler-assume*/}

React Compiler assumes that your code:

1. Is valid, semantic JavaScript.
2. Tests that nullable/optional values and properties are defined before accessing them (for example, by enabling [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) if using TypeScript), i.e., `if (object.nullableProperty) { object.nullableProperty.foo }` or with optional-chaining `object.nullableProperty?.foo`.
3. Follows the [Rules of React](https://react.dev/reference/rules).

React Compiler can verify many of the Rules of React statically, and will safely skip compilation when it detects an error. To see the errors we recommend also installing [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### How do I know my components have been optimized? {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) has built-in support for React Compiler and will display a "Memo ✨" badge next to components that have been optimized by the compiler.

### Something is not working after compilation {/*something-is-not-working-after-compilation*/}
If you have eslint-plugin-react-compiler installed, the compiler will display any violations of the rules of React in your editor. When it does this, it means that the compiler has skipped over optimizing that component or hook. This is perfectly okay, and the compiler can recover and continue optimizing other components in your codebase. **You don't have to fix all ESLint violations straight away.** You can address them at your own pace to increase the amount of components and hooks being optimized.

Due to the flexible and dynamic nature of JavaScript however, it's not possible to comprehensively detect all cases. Bugs and undefined behavior such as infinite loops may occur in those cases.

If your app doesn't work properly after compilation and you aren't seeing any ESLint errors, the compiler may be incorrectly compiling your code. To confirm this, try to make the issue go away by aggressively opting out any component or hook you think might be related via the [`"use no memo"` directive](#opt-out-of-the-compiler-for-a-component).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // opts out this component from being compiled by React Compiler
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` is a _temporary_ escape hatch that lets you opt-out components and hooks from being compiled by the React Compiler. This directive is not meant to be long lived the same way as eg [`"use client"`](/reference/rsc/use-client) is.

It is not recommended to reach for this directive unless it's strictly necessary. Once you opt-out a component or hook, it is opted-out forever until the directive is removed. This means that even if you fix the code, the compiler will still skip over compiling it unless you remove the directive.
</Note>

When you make the error go away, confirm that removing the opt out directive makes the issue come back. Then share a bug report with us (you can try to reduce it to a small repro, or if it's open source code you can also just paste the entire source) using the [React Compiler Playground](https://playground.react.dev) so we can identify and help fix the issue.

### Other issues {/*other-issues*/}

Please see https://github.com/reactwg/react-compiler/discussions/7.
