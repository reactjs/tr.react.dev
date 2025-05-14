---
title: React Compiler
---

<Intro>
Bu sayfa size React Compiler'ı tanıtacak ve nasıl başarılı bir şekilde deneyebileceğinizi gösterecektir.
</Intro>

<<<<<<< HEAD
<Wip>
Bu dokümanlar üzerinde hala çalışılmaktadır. Daha fazla belge [React Compiler Çalışma Grubu reposu](https://github.com/reactwg/react-compiler/discussions) adresinde mevcuttur ve daha kararlı hale geldiklerinde bu belgelere eklenecektir.
</Wip>

=======
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3
<YouWillLearn>

* Derleyici ile çalışmaya başlama
* Derleyicinin ve ESLint eklentisinin yüklenmesi
* Sorun Giderme

</YouWillLearn>

<Note>
<<<<<<< HEAD
React Compiler, şu anda Beta aşamasında olan ve topluluktan erken geri bildirim almak için açık kaynaklı hale getirdiğimiz yeni bir derleyicidir. Meta gibi şirketlerde üretimde kullanılmış olsa da, derleyiciyi uygulamanız için üretime almak kod tabanınızın sağlığına ve [React Kuralları](/reference/rules)'nı ne kadar iyi takip ettiğinize bağlı olacaktır.

En son Beta sürümü `@beta` etiketiyle, günlük deneysel sürümler ise `@experimental` etiketiyle bulunabilir.
</Note>

React Compiler, topluluktan erken geri bildirim almak için açık kaynaklı hale getirdiğimiz yeni bir derleyicidir. React uygulamanızı otomatik olarak optimize eden yalnızca derleme zamanlı bir araçtır. Düz JavaScript ile çalışır ve [React Kuralları](/reference/rules)'nı anlar, bu nedenle kullanmak için herhangi bir kodu yeniden yazmanıza gerek yoktur.

Derleyici ayrıca, derleyiciden gelen analizi doğrudan düzenleyicinizde ortaya çıkaran bir [ESLint eklentisi](#installing-eslint-plugin-react-compiler) içerir. **Bugün herkesin linter kullanmasını şiddetle tavsiye ediyoruz.** Linter, derleyicinin yüklü olmasını gerektirmez, bu nedenle derleyiciyi denemeye hazır olmasanız bile kullanabilirsiniz.

Derleyici şu anda `beta` olarak yayınlanmaktadır ve React 17+ uygulamaları ve kütüphaneleri üzerinde denenebilir. Beta sürümünü yüklemek için:
=======
React Compiler is a new compiler currently in RC, that we've open sourced to get feedback from the community. We now recommend everyone to try the compiler and provide feedback.

The latest RC release can be found with the `@rc` tag, and daily experimental releases with `@experimental`.
</Note>

React Compiler is a new compiler that we've open sourced to get feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.

eslint-plugin-react-hooks also includes an [ESLint rule](#installing-eslint-plugin-react-compiler) that surfaces the analysis from the compiler right in your editor. **We strongly recommend everyone use the linter today.** The linter does not require that you have the compiler installed, so you can use it even if you are not ready to try out the compiler.

The compiler is currently released as `rc`, and is available to try out on React 17+ apps and libraries. To install the RC:
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

<TerminalBlock>
{`npm install -D babel-plugin-react-compiler@rc eslint-plugin-react-hooks@^6.0.0-rc.1`}
</TerminalBlock>

Ya da Yarn kullanıyorsanız:

<TerminalBlock>
{`yarn add -D babel-plugin-react-compiler@rc eslint-plugin-react-hooks@^6.0.0-rc.1`}
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

<<<<<<< HEAD
Lütfen derleyicinin hala Beta aşamasında olduğunu ve birçok pürüze sahip olduğunu unutmayın. Meta gibi şirketlerde üretimde kullanılmış olsa da, derleyiciyi uygulamanız için üretime almak kod tabanınızın sağlığına ve [React Kuralları](/reference/rules)'nı ne kadar iyi takip ettiğinize bağlı olacaktır.
=======
The compiler is now in RC and has been tested extensively in production. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

**Derleyiciyi şimdi kullanmak için acele etmenize gerek yok. Benimsemeden önce kararlı bir sürüme ulaşmasını beklemenizde bir sakınca yoktur.** Bununla birlikte, derleyiciyi daha iyi hale getirmemize yardımcı olmak için bize [geri bildirim](#reporting-issues) sağlayabilmeniz için uygulamalarınızda küçük deneylerle denemekten memnuniyet duyarız.

## Başlarken {/*getting-started*/}

Bu dokümanlara ek olarak, derleyici hakkında daha fazla bilgi ve tartışma için [React Compiler Working Group](https://github.com/reactwg/react-compiler) adresini kontrol etmenizi öneririz.

<<<<<<< HEAD
### eslint-plugin-react-compiler'ı yükleme {/*installing-eslint-plugin-react-compiler*/}

React Compiler ayrıca bir ESLint eklentisine de güç verir. ESLint eklentisi derleyiciden **bağımsız** olarak kullanılabilir, yani derleyiciyi kullanmasanız bile ESLint eklentisini kullanabilirsiniz.
=======
### Installing eslint-plugin-react-hooks {/*installing-eslint-plugin-react-compiler*/}

React Compiler also powers an ESLint plugin. You can try it out by installing eslint-plugin-react-hooks@^6.0.0-rc.1.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

<TerminalBlock>
{`npm install -D eslint-plugin-react-hooks@^6.0.0-rc.1`}
</TerminalBlock>

<<<<<<< HEAD
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
=======
See our [editor setup](/learn/editor-setup#linting) guide for more details.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

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
{`npm install react-compiler-runtime@rc`}
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
{`npm install babel-plugin-react-compiler@rc`}
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

Vite kullanıyorsanız, eklentiyi vite-plugin-react'e ekleyebilirsiniz:

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

Daha fazla bilgi için lütfen [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) adresine bakın.

### Remix {/*usage-with-remix*/}
`vite-plugin-babel` yükleyin ve derleyicinin Babel eklentisini buna ekleyin:

<TerminalBlock>
{`npm install vite-plugin-babel`}
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
        presets: ["@babel/preset-typescript"], // TypeScript kullanıyorsanız
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Bir topluluk Webpack yükleyicisi [artık burada mevcut](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Expo uygulamalarında React Derleyicisini etkinleştirmek ve kullanmak için lütfen [Expo'nun dokümanlarına](https://docs.expo.dev/guides/react-compiler/) bakın.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native, Babel'i Metro aracılığıyla kullanır, bu nedenle kurulum talimatları için [Babel ile kullanım](#usage-with-babel) bölümüne bakın.

### Rspack {/*usage-with-rspack*/}

Rspack uygulamalarında React Derleyicisini etkinleştirmek ve kullanmak için lütfen [Rspack's docs](https://rspack.dev/guide/tech/react#react-compiler) adresine bakın.

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild uygulamalarında React Derleyicisini etkinleştirmek ve kullanmak için lütfen [Rsbuild'in dokümanlarına](https://rsbuild.dev/guide/framework/react#react-compiler) bakın.

## Troubleshooting {/*troubleshooting*/}

Sorunları bildirmek için lütfen önce [React Compiler Playground](https://playground.react.dev/) üzerinde minimal bir repro oluşturun ve bunu hata raporunuza ekleyin. Sorunları [facebook/react](https://github.com/facebook/react/issues) reposunda açabilirsiniz.

Ayrıca üye olmak için başvurarak React Derleyici Çalışma Grubu'nda geri bildirim sağlayabilirsiniz. Üyelik hakkında daha fazla bilgi için lütfen [README'ye](https://github.com/reactwg/react-compiler) bakın.

### Derleyici ne varsayıyor? {/*what-does-the-compiler-assume*/}

React Compiler kodunuzun olduğunu varsayar:

1. Geçerli, semantik JavaScript'tir.
2. Nullable/opsiyonel değerlerin ve özelliklerin bunlara erişmeden önce tanımlandığını test eder (örneğin, TypeScript kullanılıyorsa [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) etkinleştirilerek), yani `if (object.nullableProperty) { object.nullableProperty.foo }` veya opsiyonel zincirleme `object.nullableProperty?.foo` ile.
3. [React Kuralları](https://react.dev/reference/rules)'nı takip eder.

React Derleyici, React'in birçok kuralını statik olarak doğrulayabilir ve bir hata tespit ettiğinde derlemeyi güvenli bir şekilde atlayacaktır. Hataları görmek için ayrıca [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler) yüklemenizi öneririz.

### Bileşenlerimin optimize edildiğini nasıl bilebilirim? {/*how-do-i-know-my-components-have-been-optimized*/}

[React DevTools](/learn/react-developer-tools) (v5.0+) ve [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) React Compiler için yerleşik desteğe sahiptir ve derleyici tarafından optimize edilen bileşenlerin yanında bir “Memo ✨” rozeti görüntüler.

### Derlemeden sonra bir şey çalışmıyor {/*something-is-not-working-after-compilation*/}
Eğer eslint-plugin-react-compiler yüklüyse, derleyici React kurallarının herhangi bir ihlalini editörünüzde gösterecektir. Bunu yaptığında, derleyicinin o bileşeni veya hook'u optimize etmeyi atladığı anlamına gelir. Bu tamamen normaldir ve derleyici kod tabanınızdaki diğer bileşenleri kurtarabilir ve optimize etmeye devam edebilir. **Tüm ESLint ihlallerini hemen düzeltmek zorunda değilsiniz.** Optimize edilen bileşen ve hook miktarını artırmak için bunları kendi hızınızda ele alabilirsiniz.

Ancak JavaScript'in esnek ve dinamik yapısı nedeniyle, tüm vakaları kapsamlı bir şekilde tespit etmek mümkün değildir. Bu durumlarda hatalar ve sonsuz döngüler gibi tanımlanmamış davranışlar meydana gelebilir.

Uygulamanız derlendikten sonra düzgün çalışmıyorsa ve herhangi bir ESLint hatası görmüyorsanız, derleyici kodunuzu yanlış derliyor olabilir. Bunu doğrulamak için, [`“use no memo”` yönergesi](#opt-out-of-the-compiler-for-a-component) aracılığıyla ilgili olabileceğini düşündüğünüz herhangi bir bileşeni veya hook'u agresif bir şekilde devre dışı bırakarak sorunun ortadan kalkmasını sağlamaya çalışın.

```js {2}
function SuspiciousComponent() {
  "use no memo"; // bu bileşenin React Compiler tarafından derlenmesini engeller
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`“use no memo"`, bileşenlerin ve kancaların React Derleyicisi tarafından derlenmesini engellemenizi sağlayan _geçici_ bir kaçış kapısıdır. Bu direftifin, örneğin [`“use client”`](/reference/rsc/use-client) gibi uzun ömürlü olması amaçlanmamıştır.

Kesinlikle gerekli olmadıkça bu direktife ulaşılması tavsiye edilmez. Bir bileşeni veya hook'u devre dışı bıraktığınızda, direftif kaldırılana kadar sonsuza kadar devre dışı kalır. Bu, kodu düzeltseniz bile, direktifi kaldırmadığınız sürece derleyicinin kodu derlemeyi atlayacağı anlamına gelir.
</Note>

Hatanın ortadan kalkmasını sağladığınızda, devre dışı bırakma yönergesini kaldırmanın sorunu geri getirdiğini doğrulayın. Ardından [React Compiler Playground](https://playground.react.dev) kullanarak bir hata raporunu bizimle paylaşın (küçük bir reproya indirgemeyi deneyebilirsiniz veya açık kaynak koduysa tüm kaynağı da yapıştırabilirsiniz), böylece sorunu belirleyebilir ve düzeltmeye yardımcı olabiliriz.

### Diğer konular {/*other-issues*/}

Lütfen https://github.com/reactwg/react-compiler/discussions/7 adresine bakınız.
