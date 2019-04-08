---
id: static-type-checking
title: Statik tip denetlemesi
permalink: docs/static-type-checking.html
prev: typechecking-with-proptypes.html
next: refs-and-the-dom.html
---

[Flow](https://flow.org/) ve [TypeScript](https://www.typescriptlang.org/) gibi statik tip denetleyicileri belli türdeki sorunları siz henüz kodunuzu çalıştırmadan belirlerler. Bunun yanı sıra, otomatik tamamlama gibi özellikleri ekleyerek geliştirici iş akışlarını iyileştirirler. Bu yüzden büyük kod tabanları için `PropTypes` yerine Flow veya TypeScript kullanılmasını tavsiye ediyoruz.

## Flow {#flow}

[Flow](https://flow.org/), JavaScript kodunuz için bir statik tip denetleyicisidir. Facebook'ta geliştirilmiştir ve sıkça React ile birlikte kullanılır. Özel bir tip sözdizimiyle değişkenlerinizi, fonksiyonlarınızı ve React bileşenlerinizi açıklama şansı ve hataları erkenden yakalama şansı verir. [Flow'a giriş](https://flow.org/en/docs/getting-started/)i okuyarak temellerini öğrenebilirsiniz.

Flow'u kullanmak için:

* Flow'u projenize bağımlılık olarak ekleyin.
* Flow sözdiziminin derlenmiş koddan ayrıldığından emin olun.
* Tip açıklamalarını ekleyin ve Flow'u çalıştırarak kodunuzu denetleyin.

Bu maddeleri aşağıda daha detaylı olarak açıklayacağız.

### Flow'u Bir Projeye Ekleme {#adding-flow-to-a-project}

Öncelikle, terminalde proje dizininize gidin. Sonra aşağıdaki komutu çalıştırmanız gerekecek:

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

Flow, JavaScript dilini tip açıklamaları için özel bir sözdizimi ile genişletir. Ancak, tarayıcılar bu sözdiziminden haberdar değildir. Bu güzden, onun tarayıcıya yollanan JavaScript demetinde yer almadığından emin olmalıyız.

Bunun tam olarak nasıl sağlandığı, JavaScript'i derlemek için kullandığınız araca bağlıdır.

#### Create React App {#create-react-app}

Eğer projeniz [Create React App](https://github.com/facebookincubator/create-react-app) ile oluşturulduysa, tebrikler! Flow açıklamaları zaten öntanımlı olarak saf dışı bırakılmıştır. Bu yüzden sizin bu adımda herhangi bir şey yapmanıza gerek yok.

#### Babel {#babel}

>Not:
>
> Bu talimatlar Create React App kullanıcıları için *değildir*. Create React App özünde Babel kullanıyor olsa da, o zaten Flow'u anlayacak şekilde ayarlanmıştır. Bu adımı sadece eğer Create React App *kullanmıyorsanız* takip ediniz.

Eğer projenizi Babel kullanmak üzere elle ayarladıysanız, Flow için özel bir önayar yüklemeniz gerekmektedir.

Eğer yarn kullanıyorsanız, bu komutu çalıştırın:

```bash
yarn add --dev babel-preset-flow
```

Eğer npm kullanıyorsanız, bu komutu çalıştırın:

```bash
npm install --save-dev babel-preset-flow
```
Ardından, `flow` ön ayarını [Babel ayarlarınıza](https://babeljs.io/docs/usage/babelrc/) ekleyin. Örneğin, eğer Babel'i `.babelrc` ile ayarlıyorsanız, şöyle görünebilir:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

Bu size Flow sözdizimini kodunuzda kullanma fırsatı tanır.

>Not:
>
>Flow, `react` ön ayarına ihtiyaç duymaz, ancak ikisi genellikle birlikte kullanılır. Flow, JSX sözdizimini kendiliğinden anlayabilir.

#### Diğer İnşa Ayarları {#other-build-setups}

Eğer Create React App veya Babel'den birini kullanmıyorsanırz, [flow-remove-types](https://github.com/flowtype/flow-remove-types) kullanarak tip açıklamalarını ayırabilirsiniz.

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

Bu, genellike dosyanın en üstünde yer alır. Flow'un hiç sorun bulup bulmadığını görmek için, projenizdeki bazı dosyalara eklemeyi ve `yarn flow` veya `npm run flow` komutlarını çalıştırmayı deneyin.

Bunun yanında, Flow'u açıklamaya bağlı olmadan *tüm* dosyaları denetlemeye zorlamanın [bir yolu daha](https://flow.org/en/docs/config/options/#toc-all-boolean) var. Eski projeleriniz için biraz fazla olabilir, ancak yeni başlanan bir projelede Flow ile tip denetimi isterseniz mantıklı olur.

Artık hazırsınız! Flow hakkında daha fazla bilgi için aşağıdaki kaynaklara da bir göz atmanızı öneririz:

* [Flow dokümantasyonu: Tip açıklamaları](https://flow.org/en/docs/types/)
* [Flow dokümantasyonu: Editörler](https://flow.org/en/docs/editors/)
* [Flow dokümantasyonu: React](https://flow.org/en/docs/react/)
* [Flow'da linting](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/), Microsoft tarafından geliştirilmiş bir yazılım dilidir. JavaScript'in bir üst kümesidir ve kendi derleyicisi vardır. TypeScript tipli bir programlama dili olduğundan, hataları ve sorunları inşa sırasında, uygulamanız canlıya geçmeden çok önce yakalayabilir. React'i TypeScript ile kullanma hakkında [buradan](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter) daha fazla bilgiye ulaşabilirsiniz.

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
npx create-react-app my-app --typescript
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
Tebrikler! TypeScript'in en güncel sürümünü projenize yüklediniz. TypeScript'i yüklemek bize `tsc` komutuna erişim sağlıyor. Ayarlamadan önce, gelin `tsc`'yi `package.json`'umuzun "script" kısmına ekleyelim:

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

### TypeScript Derleyicisini Ayarlama {#configuring-the-typescript-compiler}
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
* İlk olarak, gelin proje yapımızı şu sekilde düzenleyelim. Tüm kaynak kodlarımızı `src` dizinine koyacağız.

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
Harika! Şimdi inşa betiğimizi çalıştırdığımızda, derleyici üretilen javascript'i `build` dizinine koyacak. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) başlangıç için iyi bir kurallar bütününü size sunuyor.

Genellikle üretilen javascript'i kaynak kontrolünüzde tutmak istemezsiniz. Bu yüzden, `build` dizininizi `.gitignore` dosyanıza eklediğinizden emin olun.

### File extensions {#file-extensions}
In React, you most likely write your components in a `.js` file. In TypeScript we have 2 file extensions:

`.ts` is the default file extension while `.tsx` is a special extension used for files which contain `JSX`.

### Running TypeScript {#running-typescript}

If you followed the instructions above, you should be able to run TypeScript for the first time.

```bash
yarn build
```

If you use npm, run:

```bash
npm run build
```

If you see no output, it means that it completed successfully.


### Type Definitions {#type-definitions}
To be able to show errors and hints from other packages, the compiler relies on declaration files. A declaration file provides all the type information about a library. This enables us to use javascript libraries like those on npm in our project. 

There are two main ways to get declarations for a library:

__Bundled__ - The library bundles its own declaration file. This is great for us, since all we need to do is install the library, and we can use it right away. To check if a library has bundled types, look for an `index.d.ts` file in the project. Some libraries will have it specified in their `package.json` under the `typings` or `types` field.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped is a huge repository of declarations for libraries that don't bundle a declaration file. The declarations are crowd-sourced and managed by Microsoft and open source contributors. React for example doesn't bundle its own declaration file. Instead we can get it from DefinitelyTyped. To do so enter this command in your terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
Sometimes the package that you want to use doesn't bundle declarations nor is it available on DefinitelyTyped. In that case, we can have a local declaration file. To do this, create a `declarations.d.ts` file in the root of your source directory. A simple declaration could look like this:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

You are now ready to code! We recommend to check out the following resources to learn more about TypeScript:

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](https://ocaml.org/). Reason gives OCaml a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

Reason is developed at Facebook, and is used in some of its products like Messenger. It is still somewhat experimental but it has [dedicated React bindings](https://reasonml.github.io/reason-react/) maintained by Facebook and a [vibrant community](https://reasonml.github.io/docs/en/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) is a statically typed language developed by JetBrains. Its target platforms include the JVM, Android, LLVM, and [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains develops and maintains several tools specifically for the React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) as well as [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). The latter helps you start building React apps with Kotlin with no build configuration.

## Other Languages {#other-languages}

Note there are other statically typed languages that compile to JavaScript and are thus React compatible. For example, [F#/Fable](https://fable.io/) with [elmish-react](https://elmish.github.io/react). Check out their respective sites for more information, and feel free to add more statically typed languages that work with React to this page!
