---
id: create-a-new-react-app
title: Yeni bir React Uygulaması Oluşturun
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

En iyi kullanıcı ve geliştirici deneyimi için tümleşik araç kullanın.

Bu sayfa, görevlere yardımcı olan bazı popüler araçları anlatır.

* Birçok dosya ve bileşene ölçeklendirme.
* Npm'den üçüncü parti kütüphanelerin kullanımı.
* Yaygın hataların erken farkedilmesi.
* JS ve CSS'in geliştirme anında canlı olarak güncellenmesi.
* Çıktının canlı ortam (production) için optimize edilmesi.

Bu sayfada tavsiye edilen araçlar **başlangıç için ayarlama gerektirmez**.

## Bir Araca İhtiyacınız Olmayabilir {#you-might-not-need-a-toolchain}

Eğer yukarıda anlatılan sorunlarla karşılaşmazsanız veya henüz kendinizi JavaScript araçları kullanmak konusunda rahat hissetmiyorsanız, [React'i yalın `<script>` etiketi ile HTML sayfasına eklemek](/docs/add-react-to-a-website.html) (isterseniz [JSX ile birlikte](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)) seçeneğini aklınızda bulundurun.

Bu aynı zamanda **Hâlihazırda var olan web sitesine React'i entegre etmenin en kolay yoludur.** Eğer yardımcı olabileceğini düşünüyorsanız, her zaman daha büyük bir araç ekleyebilirsiniz!

## Tavsiye Edilen Araçlar {#recommended-toolchains}

React takımı öncelikli olarak şu çözümleri öneriyor:

- Eğer **React öğreniyorsanız** veya **yeni bir [tek sayfa](/docs/glossary.html#single-page-application) uygulama oluşturuyorsanız,** [Create React App](#create-react-app) kullanın.
- Eğer **Node.js ile sunucu tarafında işlenen bir sayfa** geliştiriyorsanız [Next.js](#nextjs)'i deneyin.
- Eğer **sabit içerikli bir websitesi,** geliştiriyorsanız [Gatsby](#gatsby)'i deneyin.
- Eğer **bileşen kütüphanesi** geliştiriyor veya **var olan bir kod temeli ile entegre ediyorsanız**, [Daha esnek araçlar](#daha-esnek-araclar)'ı deneyin.

### Create React App {#create-react-app}

[Create React App](https://github.com/facebook/create-react-app) **React ögrenmek** için rahat bir ortamdır ve React ile **yeni bir [tek sayfa](/docs/glossary.html#single-page-application) uygulama** geliştirmeye başlamanın en iyi yoludur.

En son JavaScript özelliklerini kullanabilmeniz için geliştirme ortamınızı kurar, güzel bir geliştirici deneyimi sağlar ve uygulamanızı canlı ortam (production) için optimize eder. Bilgisayarınızda Node >= 8.10 ve npm >= 5.6 sürümlerinin yüklü olması gerekir. Bir proje oluşturmak için:

```bash
npx create-react-app my-app
cd my-app
npm start
```

komutlarını çalıştın.

>Not
>
>ilk satırdaki `npx` bir harf hatası değildir. -- [npm 5.2+ ile gelen bir paket çalıştırma aracıdır](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App, backend mantığı veya veritabanlarını idare etmez; sadece frontend geliştirme düzenini oluşturur, yani bunu istediğiniz herhangi bir backend ile kullanabilirsiniz. Arka planda, [Babel](https://babeljs.io/) ve [webpack](https://webpack.js.org/) kullanır, fakat bunlar hakkında hiçbir şey bilmeniz gerekmiyor.

Ürün yayınlamaya hazır olduğunuzda, `npm run build` komutunu çalıştırmak `build` klasöründe uygulamanızın optimize edilmiş bir derlemesini oluşturur. Create React App hakkında daha fazlasını [kendi README'sinden](https://github.com/facebookincubator/create-react-app#create-react-app--) ve [Kullanıcı rehberinden](https://facebook.github.io/create-react-app/) öğrenebilirsiniz.

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) React ile **statik ve sunucu tarafından işlenen uygulamalar** geliştirmek için popüler ve hafif bir çatıdır. Hazır olarak **stillendirme ve yönlendirme çözümleri** içerir, ve sunucu ortamı olarak [Node.js](https://nodejs.org/) kullandığınızı varsayar.

Next.js'i [resmi rehberinden](https://nextjs.org/learn/) öğrenin.

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/), React ile **statik web siteleri** geliştirmenin en iyi yoludur. React bileşenlerini kullanmanıza olanak sağlar, fakat en hızlı yükleme süresini garanti etmek için önceden işlenmiş HTML ve CSS çıktılarını verir.

Gatsby'i [resmi rehberinden](https://www.gatsbyjs.org/docs/) veya [yeni başlayanlar galerisinden](https://www.gatsbyjs.org/docs/gatsby-starters/) öğrenin.

### Daha Esnek Araçlar {#more-flexible-toolchains}

Aşağıdaki araçlar daha fazla esneklik ve seçenek sunmaktadır. Bunları daha tecrübeli kullanıcılar için öneriyoruz:

- **[Neutrino](https://neutrinojs.org/)**; [webpack](https://webpack.js.org/)'in gücünü ön ayarların sadeliği ile birleştirir, [React uygulamaları](https://neutrinojs.org/packages/react/) ve [React bileşenleri](https://neutrinojs.org/packages/react-components/) için bir ön ayar da içerir.

- **[Parcel](https://parceljs.org/)**; [React ile çalışan](https://parceljs.org/recipes.html#react), hızlı, ayarlama gerektirmeyen bir web uygulama paketleyicisidir.

- **[Razzle](https://github.com/jaredpalmer/razzle)**; herhangi bir yapılandırma gerektirmeyen ancak Next.js'e göre daha fazla esneklik sunan, bir sunucu tarafinda işleme çatısıdır.

## Sıfırdan Bir Araç Zinciri Oluşturmak {#creating-a-toolchain-from-scratch}

Bir JavaScript derleme araç zinciri tipik olarak aşağıdakilerden oluşur:

* Bir **paket yöneticisi**, [Yarn](https://yarnpkg.com/) veya [npm](https://www.npmjs.com/) gibi. Bu, uçsuz bucaksız üçüncü parti paket ekosisteminden faydalanmanıza ve bunları kolayca yüklemenize ve güncellemenize olanak sağlar.

* Bir **paketleyici**, [webpack](https://webpack.js.org/) veya [Parcel](https://parceljs.org/) gibi. Bu, modüler kod yazmanıza ve yazdığınız kodları yükleme zamanını optimize etmek için küçük parçalar halinde beraber paketlemenize olanak sağlar.

* Bir **derleyici** [Babel](https://babeljs.io/) gibi. Bu, yazdığınız modern JavaScript kodunun eski tarayıcılarda da çalışmasını sağlar.

Eğer sıfırdan kendi JavaScript araç zincirinizi kurmayı tercih ederseniz, bazı Create React App fonksiyonelliklerini yeniden oluşturan [şu rehbere bir göz atın](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658).

Özel araç zincirinizin [ürün için doğru bir şekilde kurulduğunu](/docs/optimizing-performance.html#use-the-production-build) garanti altına almayı unutmayın.
