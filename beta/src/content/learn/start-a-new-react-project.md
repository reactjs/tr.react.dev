---
title: Bir React Projesi Oluşturun
---

<Intro>

Eğer yeni bir React projesine başlıyorsanız, araç zinciri veya bir çatı kullanmanızı öneriyoruz. Bu araçlar rahat bir geliştirme ortamı sağlar ancak yerel bir Node.js kurulumuna ihtiyaç duyarlar.

</Intro>

<YouWillLearn>

* Araç zincirleri ile çatılar arasındaki farklar
* Minimal araç zinciri ile yeni bir proje oluşturmak
* Tam donanımlı bir çatı ile yeni bir proje oluşturmak
* Popüler araç zincirlerinin ve çatıların içinde neler var

</YouWillLearn>

## Kendi Serüvenini seç {/*choose-your-own-adventure*/}

React, UI kodunu bileşen adı verilen küçük parçalara ayırarak yönetmenizini sağlayan bir kütüphanedir. React, yönlendirme ve veri yönetimi ile ilgilenmez. Bu, yeni bir React projesine başlamanın birkaç yolu olduğu anlamına gelir:

* [**HTML dosyası ve bir script etiketi**](/learn/add-react-to-a-website) ile başlayın. Bu yöntem, Node.js kurulumu gerektirmez ancak sunulan özellikler limitlidir.
* **Minimal araç zinciri** ile başlayın ve ilerledikçe projenize daha fazla özellik ekleyin. (Öğrenmek için harikadır!)
* Veri çekme ve yönlendirme gibi yaygın özelliklerin yerleşik olarak geldiği **iddiali çatı** ile başlayın.

## Minimal araç zinciri ile başlarken {/*getting-started-with-a-minimal-toolchain*/}

Eğer **React öğreniyorsanız,** [Create React App](https://create-react-app.dev/)'i öneriyoruz. Creact React App, React'i denemek için ve tarayıcı bazlı yeni bir tekil sayfa uygulamaları geliştirmek için en popüler araç zinciridir. React için geliştirilmiştir ancak yönlendirme ya da veri çekme için iddialı değildir.

İlk olarak, [Node.js.](https://nodejs.org/en/) yükleyin. Ardından terminalinizi açın ve yeni bir proje oluşturmak için bu satırı çalıştırın:

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Şimdi, şu komutlar ile uygulamanızı çalıştırabilirsiniz:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Daha fazal bilgi için, [resmi dokümantasyona göz atın.](https://create-react-app.dev/docs/getting-started)

> Create React App backend veya veritabanı işlemlerini sunmaz. Herhangi bir backend ile kullanabilirsiniz. Bir proje oluşturduğunuzda statik HTML, CSS ve JS dosyalarının olduğu bir klasör elde edersiniz. Create React App sunucu avantajlarından yararlanamadığı için en iyi performansı sağlamaz. Eğer daha hızlı yükleme veya yönlendirme ve sunucu taraflı işlemler arıyorsanız, bir çatı kullanmanızı öneriyoruz.

### Popüler alternatifler {/*toolkit-popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## Tam donanımlı bir çatı ile proje oluşturmak {/*building-with-a-full-featured-framework*/}

Eğer **canlı ortama hazır proje oluşturmak istiyorsanız,** [Next.js](https://nextjs.org/) başlamak için harika bir başlangıç noktasıdır. Next js, React ile oluşturulmuş statik ve sunucu taraflı uygulamalar için popüler, hafif bir çatıdır. Yönlendirme, stil oluşturma ve sunucu taraflı render etme, projeyi hızlıca başlatma ve çalıştırma gibi özelliklerin olduğu hazır paketlerle birlikte gelmektedir.

[Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) öğreticisi, React ve Next js ile proje oluşturmaya harika bir giriştir.

### Popüler alternatifler {/*framework-popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Özel araç zincirleri {/*custom-toolchains*/}

Kendi araç zincirinizi kurmayı ve özelleştirmeyi tercih edebilirsiniz. Bir alet zinciri tipik olarak şunlardan oluşur:

* 3. parti paketleri yüklemenizi, güncellemenizi ve yönetmezini sağlayan **paket yöneticisi**. Popüler paket yöneticileri: [npm](https://www.npmjs.com/) (Node.js'e gömülüdür), [Yarn](https://yarnpkg.com/), [pnpm.](https://pnpm.io/)
* Tarayıcılar için modern dil özelliklerini ve JSX gibi ek sözdizimini derlemenizi veya ek açıklamalar yazmanızı sağlayan **derleyici**. Popüler derleyiciler: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc.](https://swc.rs/)
* Yükleme süresini optimize etmek ve modüler kod yazımını sağlayan **paketleyici**. Popüler paketleyiciler: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc.](https://swc.rs/)
* Kodunuzu daha kompakt hale getirerek daha hızlı yüklenmesini sağlayan **sıkıştırıcı**. Popüler sıkıştırıcılar: [Terser](https://terser.org/), [swc.](https://swc.rs/)
* Bileşenleri HTML'ye dönüştürebilmeniz için sunucu isteklerini işleyen **sunucu**. Popüler sunucular: [Express.](https://expressjs.com/)
* Kodunuzu yaygın hatalar için kontrol eden **kod denetleyici**. Popüler kod denetleyecileri: [ESLint.](https://eslint.org/)
* Testlerinizi çalıştırabilmenizi sağlayan **test çalıştırıcı**. Popüler test çalıştırıcıları: [Jest.](https://jestjs.io/)

Eğer kendi Javascript araç zincirinizi sıfırdan kurmak isterseniz, Create React App işlevselliğinin bazılarını tekrar oluşturan [bu rehbere bir göz atın.](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658). Bir çatı, genellikle yönlendirme ve veri çekme için bir çözüm sunar. Daha büyük bir projede, [Nx](https://nx.dev/react) veya [Turborepo](https://turborepo.org/) gibi araçla tek bir depoda birden fazla paketi yönetmek isteyebilirsiniz.