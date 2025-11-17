---
title: Var Olan Bir Projeye React Eklemek
---

<Intro>

Mevcut projenize biraz etkileşim eklemek istiyorsanız, onu React'te yeniden yazmak zorunda değilsiniz. React'i mevcut yığınınıza ekleyin ve etkileşimli React bileşenlerini istediğiniz yerde render edin.

</Intro>

<Note>

**Yerel geliştirme ortamınız için [Node.js](https://nodejs.org/en/) yüklemeniz gerekmektedir.** React'i çevrimiçi olarak veya basit bir HTML sayfası ile [deneyebilseniz de](/learn/installation#try-react), gerçekte geliştirme için kullanmak isteyeceğiniz JavaScript araçlarının çoğu Node.js gerektirir.

</Note>

## Mevcut web sitenizin tüm alt yolu için React kullanımı {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Diyelim ki `example.com`'da başka bir sunucu teknolojisi (Rails gibi) ile oluşturulmuş mevcut bir web uygulamanız var ve `example.com/some-app/` ile başlayan tüm rotaları tamamen React ile oluşturmak istiyorsunuz.

Kurulumu şu şekilde yapmanızı öneririz:

<<<<<<< HEAD
1. **Uygulamanızın React kısmını**, [React tabanlı framework'lerden](/learn/start-a-new-react-project) birini kullanarak oluşturun.  
2. **`/some-app` yolunu *base path* olarak belirtin** framework’ünüzün konfigürasyonunda (işte nasıl yapılır: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).  
3. **Sunucunuzu veya bir proxy’i yapılandırın** ki `/some-app/` altındaki tüm istekler React uygulamanız tarafından işlenebilsin.
=======
1. **Build the React part of your app** using one of the [React-based frameworks](/learn/creating-a-react-app).
2. **Specify `/some-app` as the *base path*** in your framework's configuration (here's how: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configure your server or a proxy** so that all requests under `/some-app/` are handled by your React app.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

Bu, React uygulamanızın o framework’lere dahil edilmiş [en iyi uygulamalardan yararlanmasını](/learn/build-a-react-app-from-scratch#consider-using-a-framework) sağlar.

Birçok React tabanlı kütüphaneler, ön ve arka yüz geliştirmede kullanılabilir ve React uygulamanızın sunucudan yararlanmasına izin verir. Ancak, sunucuda JavaScript çalıştıramasanız veya istemeseniz bile aynı yaklaşımı kullanabilirsiniz. Bu durumda HTML/CSS/JS dışa aktarımını (Next.js için [`next export` çıktısı](https://nextjs.org/docs/advanced-features/static-html-export), Gatsby için varsayılan) bunun yerine `/some-app/` konumunda sunun.

## Mevcut sayfanızın bir bölümü için React kullanımı {/*using-react-for-a-part-of-your-existing-page*/}

Diyelim ki başka bir teknoloji (Rails gibi bir sunucu veya Backbone gibi bir istemci) ile oluşturulmuş mevcut bir sayfanız var ve o sayfada bir yerde etkileşimli React bileşenleri render etmek istiyorsunuz. Bu, React'i entegre etmenin yaygın bir yoludur - aslında, Meta'daki çoğu React kullanımı yıllarca bu şekilde görünüyordu!

Bunu iki adımda yapabilirsiniz:

1. [JSX syntax'inizi](/learn/writing-markup-with-jsx) kullanmanıza, kodunuzu [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) syntax'i ile modüllere ayırmanıza ve [npm](https://www.npmjs.com/) paket kayıt defterinden paketleri (örneğin, React) kullanmanıza izin veren  **bir JavaScript ortamı kurun**.
2. React bileşenlerinizi sayfada görmek istediğiniz yerde **render edin**.

Kesin yaklaşımınız, mevcut sayfa kurulumunuza bağlıdır, bu nedenle bazı ayrıntılara göz atalım.

### 1. Adım: Modüler bir JavaScript ortamı kurun {/*step-1-set-up-a-modular-javascript-environment*/}

Modüler bir JavaScript ortamı, tüm kodunuzu tek bir dosyaya yazmak yerine, React bileşenlerinizi ayrı ayrı dosyalara yazmanıza olanak tanır. Ayrıca, diğer geliştiriciler tarafından [npm](https://www.npmjs.com/) kayıt defterinde yayınlanan tüm harika paketleri, React'in kendisi de dahil olmak üzere kullanmanızı sağlar! Bunu nasıl yapacağınız mevcut kurulumunuza bağlıdır:

* **Uygulamanız zaten `import` ifadelerini kullanan dosyalara bölünmüşse,** mevcut kurulumunuzu kullanmayı deneyin. JS kodunuza `<div />` yazmanın bir syntax hatasına neden olup olmadığını kontrol edin. Bir syntax hatasına neden olursa, [JavaScript kodunuzu Babel ile dönüştürmeniz](https://babeljs.io/setup), ve JSX kullanmak için [Babel React ön ayarını](https://babeljs.io/docs/babel-preset-react) etkinleştirmeniz gerekebilir.

* **Uygulamanızın JavaScript modüllerini derlemek için mevcut bir kurulumu yoksa,** [Vite](https://vite.dev/) ile kurun. Vite topluluğu, Rails, Django ve Laravel dahil olmak üzere [backend frameworkleriyle birçok entegrasyonu](https://github.com/vitejs/awesome-vite#integrations-with-backends) sürdürmektedir. Backend framework'ünüz listelenmemişse, Vite derlemelerini arka ucunuzla manuel olarak entegre etmek için [bu kılavuzu izleyin](https://vite.dev/guide/backend-integration.html).

Kurulumunuzun çalışıp çalışmadığını kontrol etmek için proje klasörünüzde şu komutu çalıştırın:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Ardından, ana JavaScript dosyanızın en üstüne şu kod satırlarını ekleyin (buna `index.js` veya `main.js` adı verilebilir):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Mevcut sayfa içeriğiniz (bu örnekte, değiştiriliyor) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Var olan HTM içeriğini temizleyin
document.body.innerHTML = '<div id="app"></div>';

// Bunun yerine React bileşeninizi render edin
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Sayfanızın tüm içeriği “Merhaba dünya!” ile değiştirildiyse, her şey yolunda gitti! Okumaya devam edin.

<Note>

Modüler bir JavaScript ortamını mevcut bir projeye ilk kez entegre etmek göz korkutucu gelebilir, ancak buna değer! Eğer takılırsanız, [topluluk kaynakları](/community) veya [Vite Chat](https://chat.vite.dev/) adreslerini deneyin.

</Note>

### 2. Adım: React bileşenlerini sayfanın herhangi bir yerinde render edin {/*step-2-render-react-components-anywhere-on-the-page*/}

Önceki adımda, bu kodu ana dosyanızın en üstüne koyarsnız:

```js
import { createRoot } from 'react-dom/client';

// Var olan HTM içeriğini temizleyin
document.body.innerHTML = '<div id="app"></div>';

// Bunun yerine React bileşeninizi render edin
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Tabii ki, aslında mevcut HTML içeriğini temizlemek istemezsiniz!

Bu kodu silin.

Bunun yerine, muhtemelen React bileşenlerinizi HTML'nizin belirli yerlerinde oluşturmak istiyorsunuz. HTML sayfanızı (veya onu oluşturan sunucu şablonlarını) açın ve herhangi bir etikete benzersiz bir [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) niteliği ekleyin, örneğin:

```html
<!-- ... html'inizin herhangi bir yeri ... -->
<nav id="navigation"></nav>
<!-- ... daha fazla html ... -->
```

Bu, [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) ile o HTML öğesini bulmanızı ve içinde kendi React bileşeninizi render edebilmeniz için onu [`createRoot'a`](/reference/react-dom/client/createRoot) geçirmenizi sağlar:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // YAPILACAK: Bir navigasyon barı oluşturun
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

`index.html'deki` orijinal HTML içeriğinin nasıl korunduğuna dikkat edin, ancak kendi `NavigationBar` React bileşeniniz artık HTML'nizden `<nav id="navigation">` içinde görünüyor. React bileşenlerini mevcut bir HTML sayfasında render etme hakkında daha fazla bilgi edinmek için [`createRoot` dökümantasyonunu](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) okuyun.

<<<<<<< HEAD
Mevcut bir projeye React eklerken, genellikle küçük etkileşimli bileşenlerle (örneğin butonlar) başlamak ve ardından yavaş yavaş “yukarı doğru ilerleyerek” sonunda tüm sayfanızı React ile oluşturmak yaygındır. Bu noktaya ulaşırsanız, React’ten en iyi şekilde yararlanmak için hemen [bir React framework’üne](/learn/start-a-new-react-project) geçmenizi öneririz.
=======
When you adopt React in an existing project, it's common to start with small interactive components (like buttons), and then gradually keep "moving upwards" until eventually your entire page is built with React. If you ever reach that point, we recommend migrating to [a React framework](/learn/creating-a-react-app) right after to get the most out of React.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

## React Native'i mevcut bir yerel mobil uygulamada kullanma {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) ayrıca mevcut yerel uygulamalara kademeli olarak entegre edilebilir. Android (Java veya Kotlin) veya iOS (Objective-C veya Swift) için mevcut bir yerel uygulamanız varsa, ona bir React Native ekranı eklemek için [bu kılavuzu inceleyin](https://reactnative.dev/docs/integration-with-existing-apps).