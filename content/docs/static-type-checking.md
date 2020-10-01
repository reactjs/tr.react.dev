---
id: static-type-checking
title: Statik Tip Denetlemesi
permalink: docs/static-type-checking.html
---

[Flow](https://flow.org/) ve [TypeScript](https://www.typescriptlang.org/) gibi statik tip denetleyicileri belli türdeki sorunları siz henüz kodunuzu çalıştırmadan belirlerler. Bunun yanı sıra, otomatik tamamlama gibi özellikleri ekleyerek geliştirici iş akışlarını iyileştirirler. Bu yüzden büyük kod tabanları için `PropTypes` yerine Flow veya TypeScript kullanılmasını tavsiye ediyoruz.

## Flow {#flow}

[Flow](https://flow.org/), JavaScript kodunuz için bir statik tip denetleyicisidir. Facebook'ta geliştirilmiştir ve sıkça React ile birlikte kullanılır. Özel bir tip sözdizimiyle değişkenlerinizi, fonksiyonlarınızı ve React bileşenlerinizi açıklama ve hataları erkenden yakalama şansı verir. [Flow'a giriş](https://flow.org/en/docs/getting-started/)i okuyarak temellerini öğrenebilirsiniz.

Flow'u kullanmak için:

* Flow'u projenize bağımlılık olarak ekleyin.
* Flow sözdiziminin derlenmiş koddan ayrıldığından emin olun.
* Tip açıklamalarını ekleyin ve Flow'u çalıştırarak kodunuzu denetleyin.

Bu maddeleri aşağıda daha detaylı olarak açıklayacağız.

### Flow'u Bir Projeye Ekleme {#adding-flow-to-a-project}

Öncelikle, terminalde proje dizininize gidin. Ardından, aşağıdaki komutu çalıştırmanız gerekecek:

Eğer [Yarn](https://yarnpkg.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn add --dev flow-bin
```

Eğer [npm](https://www.npmjs.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
npm install --save-dev flow-bin
```

Bu komut, Flow'un son sürümünün projenize yüklenmesini sağlar.

Şimdi, bunu terminalde kullanabilmek için `flow`'u `package.json` dosyanızın `"scripts"` kısmına ekleyin:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Son olarak, aşağıdaki komutlardan birini çalıştırın:

Eğer [Yarn](https://yarnpkg.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn run flow init
```

Eğer [npm](https://www.npmjs.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
npm run flow init
```

Bu komut, sizin için commit etmeniz gereken bir Flow ayar dosyası oluşturacaktır.

### Flow Sözdiziminin Derlenmiş Koddan Ayrılması {#stripping-flow-syntax-from-the-compiled-code}

Flow, JavaScript dilini tip açıklamaları için özel bir sözdizimi yardımıyla genişletir. Ancak, tarayıcılar bu sözdiziminden haberdar değildir. Bu yüzden, onun tarayıcıya yollanan JavaScript demetinde yer almadığından emin olmalıyız.

Bunun tam olarak nasıl sağlandığı, JavaScript'i derlemek için kullandığınız araca bağlıdır.

#### Create React App {#create-react-app}

Eğer projeniz [Create React App](https://github.com/facebookincubator/create-react-app) ile oluşturulduysa, tebrikler! Flow açıklamaları zaten öntanımlı olarak ayrılmıştır. Bu yüzden sizin bu adımda herhangi bir şey yapmanıza gerek kalmaz.

#### Babel {#babel}

>Not:
>
>Bu talimatlar Create React App kullanıcıları için *değildir*. Create React App özünde Babel kullanıyor olsa da, zaten Flow'u anlayacak şekilde ayarlanmıştır. Bu adımı sadece eğer Create React App *kullanmıyorsanız* takip ediniz.

Eğer projenizi Babel kullanmak üzere elle ayarladıysanız, Flow için özel bir ön ayar yüklemeniz gerekmektedir.

Eğer yarn kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn add --dev @babel/preset-flow
```

Eğer npm kullanıyorsanız, bu komutu çalıştırın:

```bash
npm install --save-dev @babel/preset-flow
```

Ardından, `flow` ön ayarını [Babel ayarlarınıza](https://babeljs.io/docs/usage/babelrc/) ekleyin. Örneğin, eğer Babel'i `.babelrc` ile ayarlıyorsanız, şöyle görünebilir:

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

Bu size Flow sözdizimini kodunuzda kullanma fırsatı tanır.

>Not:
>
>Flow, `react` ön ayarına ihtiyaç duymaz ancak ikisi genellikle birlikte kullanılır. Flow, JSX sözdizimini kendiliğinden anlayabilir.

#### Diğer İnşa Ayarları {#other-build-setups}

Eğer Create React App veya Babel'den birini kullanmıyorsanırz, [flow-remove-types](https://github.com/flowtype/flow-remove-types) kullanarak tip açıklamalarını kodunuzdan ayırabilirsiniz.

### Flow'u Çalıştırmak {#running-flow}

Eğer yukarıdaki yönergeleri takip ettiyseniz, Flow'u ilk seferde çalıştırabilmelisiniz.

```bash
yarn flow
```

Eğer npm kullanıyorsanız, bu komutu çalıştırın:

```bash
npm run flow
```

Şu şekilde bir mesaj görmelisiniz:

```
No errors!
✨  Done in 0.17s.
```

### Flow Tip Açıklamaları Ekleme {#adding-flow-type-annotations}

Öntanımlı olarak, Flow yalnız şu açıklamayı içeren dosyaları denetler:

```js
// @flow
```

Bu, bir dosyanın genellike en üstünde yer alır. Flow'un herhangi bir sorun bulup bulmadığını görmek için, projenizdeki bazı dosyalara eklemeyi ve `yarn flow` veya `npm run flow` komutlarını çalıştırmayı deneyin.

Bunun yanında, Flow'u açıklamadan bağımsız olarak *tüm* dosyaları denetlemeye zorlamanın [bir yolu daha](https://flow.org/en/docs/config/options/#toc-all-boolean) var. Bu, eski projeleriniz için biraz fazla olabilir; ancak yeni başlanan bir projede Flow ile tip denetimi yapmak isterseniz bu mantıklı olur.

Artık hazırsınız! Flow hakkında daha fazla bilgi için aşağıdaki kaynaklara da bir göz atmanızı öneririz:

* [Flow dokümantasyonu: Tip açıklamaları](https://flow.org/en/docs/types/)
* [Flow dokümantasyonu: Editörler](https://flow.org/en/docs/editors/)
* [Flow dokümantasyonu: React](https://flow.org/en/docs/react/)
* [Flow'da linting](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/), Microsoft tarafından geliştirilmiş bir yazılım dilidir. JavaScript'in bir üst kümesidir ve kendi derleyicisi vardır. TypeScript tipli bir programlama dili olduğundan, hataları ve sorunları inşa sırasında, uygulamanız canlıya geçmeden çok önce yakalayabilir. React'i TypeScript ile kullanmak hakkında [buradan](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter) daha fazla bilgiye ulaşabilirsiniz.

TypeScript'i kullanmak için:
* TypeScript'i projenize bir bağımlılık olarak eklemeye
* TypeScript derleyicisi ayarlarını yapmaya
* Doğru dosya uzantılarını kullanmaya
* Kullandığınız kütüphaneler için tanımları eklemeye

ihtiyacınız vardır.

Gelin şimdi bunların detaylarına inelim.

### TypeScript'i Create React App İle Kullanmak {#using-typescript-with-create-react-app}

Create React App TypeScript'i kendiliğinden destekler.

TypeScript kullanan **yeni bir proje** oluşturmak için, şu komutu çalıştırın:

```bash
npx create-react-app my-app --template typescript
```
Ayrıca, [burada anlatıldığı şekilde](https://facebook.github.io/create-react-app/docs/adding-typescript) **varolan Create React App** projelerinize de ekleyebilirsiniz.

>Not:
>
>Eğer Create React app kullanıyorsanız, **bu sayfanın geri kalanını geçebilirsiniz**. Elle ayarlamayı anlattığı için, Create React App kullanıcıları için geçerli değildir.

### TypeScript'i Bir Projeye Eklemek {#adding-typescript-to-a-project}
Her şey bir komutu terminalde çalıştırmayla başlıyor.

Eğer [Yarn](https://yarnpkg.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn add --dev typescript
```

Eğer [npm](https://www.npmjs.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
npm install --save-dev typescript
```
Tebrikler! TypeScript'in en güncel sürümünü projenize yüklediniz. TypeScript'i yüklemek bize `tsc` komutuna erişim sağlıyor. Ayarlamadan önce, gelin `tsc`'yi `package.json`'umuzun "scripts" kısmına ekleyelim:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### TypeScript Derleyicisini Yapılandırma {#configuring-the-typescript-compiler}
Derleyici, biz ona ne yapacağını söyleyene dek, bize çok da yardımcı olamaz. TypeScript'te, bu kurallar `tsconfig.json` isminde özel bir dosyada tanımlanır. Bu dosyayı oluşturmak için:

Eğer [Yarn](https://yarnpkg.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn run tsc --init
```

Eğer [npm](https://www.npmjs.com/) kullanıyorsanız, bu komutu çalıştırın:

```bash
npx tsc --init
```

Yeni oluşturduğumuz `tsconfig.json`'a baktığımızda, derleyiciyi ayarlayabileceğimiz birçok seçenek olduğunu görebilirsiniz. Tüm seçeneklerin detaylı bir açıklaması için, [buraya](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) bakınız.

Biz, bu birçok seçenekten `rootDir` ve `outDir`'e bakacağız. Kendinden beklendiği gibi derleyici, typescript dosyalarını javascript dosyalarına dönüştürecek. Ancak biz, kendi kaynak dosyalarımızla üretilmiş dosyaların karışmasını istemiyoruz.

Bunu iki adımda çözeceğiz:
* İlk olarak, gelin proje yapımızı aşağıdaki şekilde düzenleyelim. Tüm kaynak kodlarımızı `src` dizinine koyacağız.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```
* Sonra derleyiciye kaynak kodumuzun nerede olduğunu ve derlenmiş dosyaların nereye gideceğini söyleyeceğiz.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```
Harika! Şimdi inşa betiğimizi çalıştırdığımızda, derleyici üretilen javascript'i `build` dizinine koyacak. Ayrıca [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json), başlangıç için uygun bir kurallar bütününü size sunuyor.

Genellikle üretilen javascript'i kaynak kontrolünüzde tutmak istemezsiniz. Bu yüzden, `build` dizininizi `.gitignore` dosyanıza eklediğinizden emin olun.

### Dosya uzantıları {#file-extensions}
React'te bileşenlerinizi muhtemelen bir `.js` dosyasına yazıyorsunuzdur. TypeScript'te ise iki dosya uzantımız var:

`.ts` öntanımlı dosya uzantısıyken, `.tsx` ise `JSX` içeren dosyalar için kullanılan özel bir dosya uzantısıdır.

### TypeScript'i Çalıştırma {#running-typescript}
Eğer yukarıdaki yönergeleri takip ettiyseniz, TypeScript'i ilk kez çalıştırabiliyor olmalısınız.

```bash
yarn build
```

Eğer npm kullanıyorsanız, bu komutu çalıştırın:

```bash
npm run build
```
Eğer bir çıktı görmüyorsanız kodunuz başarılı olarak derlenmiş demektir.


### Tip Tanımlamaları {#type-definitions}
Derleyici, diğer paketlerdeki hataları ve ipuçlarını göstermek için beyan dosyalarına ihtiyaç duyar. Beyan dosyası, bir kütüphane hakkındaki tüm tip bilgilerini sağlar. Bu bize javascript kütüphanelerini tıpkı npm gibi kullanma imkanını verir.

Bir kütüphane için beyana ulaşmanın iki yolu vardır:

__Demet__ - Kütüphaneler kendi beyan dosyasını tanımlar. Bu, tüm yapmamız gerekenin yalnızca kütüphaneyi yüklemek olması ve onu anında kullanmamızı sağladığı için bizim için harikadır. Bir kütüphanenin tiplerinin demetli olup olmadığını denetlemek için projenizde bir `index.d.ts` dosyasının olup olmadığına bakın. Kimi kütüphaneler bunu kendi `package.json` dosyalarında, `typings` veya `types` alanında belirtirler.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped, beyan dosyalarını paketli olarak ulaştırmayan kütüphaneler için kocaman bir beyan deposudur. Beyanlar, kitle kaynaklıdır ve Microsoft ve açık kaynak katkıcılar tarafından yönetilir. Örneğin React kendi beyan dosyasını paketlemez. Bunun yerine onu DefinitelyTyped'dan alabiliriz. Bunun için aşağıdaki komutu terminale girin:

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Yerel Tanımlamalar__
Bazen kullanmak istediğiniz kütüphanenin beyanları ne demetli halde sunulur, ne de DefinitelyTyped'ta mevcuttur. Bu durumda yerel bir beyan dosyamız olabilir. Bunun için kaynak dizininizin kökünde `declarations.d.ts` dosyasını oluşturun. Basit bir beyan dosyası şöyle görünebilir:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```
Şimdi kodlamaya hazırsınız! Size tavsiyemiz, TypeScript hakkında daha fazla bilgiye ulaşmak için aşağıdaki kaynaklara bir göz atmanız:

* [TypeScript Dokümantasyonu: Temel Tipler](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Dokümantasyonu: JavaScript'ten Göç](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Dokümantasyonu: React ve Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) yeni bir dil değil, güvenilirliği zaten kanıtlanmış olan [OCaml](https://ocaml.org/) ile güçlendirmiş yeni bir sözdizimi ve araçlar zincidir. Reason, OCaml'a JavaScript programcılarına yönelik bilindik bir sözdizimi verir ve mevcut NPM/Yarn iş akışlarına hakim kişilerin ihtiyaçlarını karşılar.

Reason Facebook'ta geliştirilmekte ve Messenger gibi kimi ürünlerinde kullanılmaktadır. Hala biraz deneyseldir ama Facebook tarafından sürdürülen [React'e adanmış bağlamaları](https://reasonml.github.io/reason-react/) ve [enerjik bir topluluğu](https://reasonml.github.io/docs/en/community.html) vardır.

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/), JetBrains tarafından geliştirilmiş statik tipli bir dildir. Hedef platformları arasında JVM, Android, LLVM ve [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html) bulunur.

JetBrains React topluluğu için özel olarak kimi araçlar geliştirmekte ve bakımlarını yapmaktadır: [React bağlamaları](https://github.com/JetBrains/kotlin-wrappers) ve [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Bunlardan ikincisi, Kotlin uygulamalarını hiçbir inşa ayarına ihtiyaç duymadan React ile yazmanıza yardımcı olur.

## Diğer Diller {#other-languages}
JavaScript'e derlenebilen ve dolayısıyla React'e uyumlu başka statik tipli diller diller de mevcuttur; örneğin [elmish-react](https://elmish.github.io/react)'li [F#/Fable](https://fable.io/). Daha fazla bilgi için sitelerini ziyaret edin ve React ile çalışan diğer statik tipli dilleri de bu sayfaya eklemekten çekinmeyin.