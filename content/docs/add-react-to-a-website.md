---
id: add-react-to-a-website
title: Bir Web Sitesine React Eklemek
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

İhtiyacınız kadar az veya daha fazla React kullanın.

React, baştan sona aşamalı olarak benimsenmesi için tasarlandı. React'i **ihtiyacınız kadar az veya daha fazla kullanabilirsiniz**. Belki de sadece varolan bir sayfaya biraz "interaktif parçalar" eklemek istiyorsunuz. React bileşenleri bunu yapmak için harika bir yoldur.

Web sitelerinin çoğu, tek sayfalı uygulamalar değildir ve olması da gerekmez. **Hiçbir kurulum aracı olmadan sadece birkaç satır kod** ile web sitenizin küçük bir bölümünde React'i deneyin. Daha sonra içeriğini aşamalı olarak genişletebilir veya sadece birkaç dinamik bileşen olarak tutabilirsiniz.

---

- [Bir Dakikada React Ekleyin](#add-react-in-one-minute)
- [İsteğe bağlı: JSX ile React'i deneyin](#optional-try-react-with-jsx) (ek pakete gerek yok!)

## Bir Dakikada React Eklemek {#add-react-in-one-minute}

Bu bölümde, mevcut bir HTML sayfasına nasıl React bileşeni ekleneceğini göstereceğiz. Kendi web sitenizle birlikte takip edebilir veya pratik yapmak için boş bir HTML dosyası oluşturabilirsiniz.

Karmaşık bir araç veya yükleme gereksinimi olmayacak. **Bu bölümü tamamlamak için sadece bir internet bağlantısına ve bir dakikanıza ihtiyacınız var.**

İsteğe bağlı: [Tüm örneği indirin (2KB sıkıştırılmış)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Adım 1: HTML koduna bir Div Ekleme {#step-1-add-a-dom-container-to-the-html}

İlk önce, düzenlemek istediğiniz HTML sayfasını açın. React ile bir şey görüntülemek istediğiniz yeri işaretlemek için boş bir `<div>` etiketi ekleyin. Örneğin:

```html{3}
<!-- ... mevcut HTML ... -->

<div id="like_button_container"></div>

<!-- ... mevcut HTML ... -->
```

Bu `<div>`'e özgün bir `id` HTML özelliği verdik. Bu `id`, daha sonra JavaScript kodundan bu `<div>`'i bulmamıza ve içinde bir React bileşeni göstermemize izin verir.

>İpucu
>
>`<body>` etiketinin içinde **herhangi bir yere** böyle bir `<div>` yerleştirebilirsiniz. Tek bir sayfada istediğiniz kadar bağımsız DOM konteynerınız olabilir. Bunlar genellikle boştur. React, DOM konteynerlerinin içindeki mevcut tüm içeriği değiştirir.

### Adım 2: Script Etiketlerini Ekleyin {#step-2-add-the-script-tags}

Daha sonra, `</body>` etiketini kapatmadan hemen önce HTML sayfasına üç `<script>` etiketi ekleyin:

```html{5,6,9}
  <!-- ... diğer HTML ... -->

  <!-- React'i yükle. -->
  <!-- Not: yayınlama için hazırlanırken,  "development.js" yi "production.min.js" ile değiştirin -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- React bileşenimizi yükleyin. -->
  <script src="like_button.js"></script>

</body>
```

İlk iki etiket React'i yükler. Üçüncüsü, bileşen kodunuzu yükleyecektir.

### Adım 3: Bir React Bileşeni Oluşturun {#step-3-create-a-react-component}

HTML sayfanızın yanına `like_button.js` adlı bir dosya oluşturun.

<<<<<<< HEAD
**[Bu başlangıç ​​kodunu](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** açın ve oluşturduğunuz dosyaya yapıştırın.
=======
Open **[this starter code](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** and paste it into the file you created.
>>>>>>> 5c371e5e3fd8f92e1d06dfdf1f28edc50fb5d83f

>İpucu
>
>Bu kod, `LikeButton` adı verilen bir React bileşenini tanımlar. Henüz anlamadıysanız endişelenmeyin. React'in yapı taşlarını daha sonra [uygulamalı eğitim](/tutorial/tutorial.html) ve [ana kavramlar rehberi](/docs/hello-world.html)nde ele alacağız. Şimdilik sadece ekranda gösterelim!

<<<<<<< HEAD
**[Başlangıç ​​kodundan](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** sonra, `like_button.js`'in en altına iki satır ekleyin :
=======
After **[the starter code](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, add two lines to the bottom of `like_button.js`:
>>>>>>> 5c371e5e3fd8f92e1d06dfdf1f28edc50fb5d83f

```js{3,4}
// ... yapıştırdığınız başlangıç kodu ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

Bu iki kod satırı ilk adımda HTML’e eklediğimiz `<div>`'i bulur ve ardından içinde React bileşeni olan “Beğen” düğmesini gösterir.

### Bu kadar! {#thats-it}

Dördüncü adım yok. **Web sitenize ilk React bileşenini eklediniz bile.**

React'i entegre etmekle ilgili daha fazla İpucu için sonraki bölümlere göz atın.

**[Örnek kaynak kodunun tamamını görüntüleyin](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Tüm örneği indirin (2KB sıkıştırılmış)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### İpucu: Bir Bileşeni Yeniden Kullanma {#tip-reuse-a-component}

Genellikle, HTML sayfasındaki React bileşenlerini birden fazla yerde görüntülemek isteyebilirsiniz. “Like” düğmesini üç kez görüntüleyen ve bazı verileri ona ileten bir örnek:

[Örnek kaynak kodunun tamamını görüntüleyin](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Tüm örneği indirin (2KB sıkıştırılmış)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Not
>
>Bu strateji çoğunlukla, sayfanın React destekli bölümleri birbirinden izole edilirken kullanışlıdır. Bunun yerine React kodunun içinde [bileşen kompozisyonu](/docs/components-and-props.html#composing-components) kullanmak daha kolaydır.

### İpucu: Canlı Ortam İçin JavaScript'i Küçültün {#tip-minify-javascript-for-production}

Web sitenizi yayına almadan önce, küçültülmemiş JavaScript'in sayfanızı kullanıcılarınız için önemli ölçüde yavaşlatabileceğine dikkat edin.

Uygulama komut dosyalarını küçültürseniz ve yayınlamaya hazır hale getirilen HTML'in de React'in `production.min.js` içinde biten sürümlerini yüklediğinden emin olursanız **siteniz yayına hazır** olur:

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

JavaScript dosyalarınız için bir küçültme adımınız yoksa, [ayarlamanın bir yolu budur](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## İsteğe bağlı: React'i JSX ile deneyin {#optional-try-react-with-jsx}

Yukarıdaki örneklerde, yalnızca tarayıcılar tarafından doğal olarak desteklenen özelliklere itibar ettik. Bu yüzden React’e ne göstereceğini söylemek için bir JavaScript fonksiyon çağrısı kullandık:

```js
const e = React.createElement;

// Bir "Like" <button>'u göster
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

Bunun yerine, React'te [JSX](/docs/introducing-jsx.html) kullanma seçeneği de mevcuttur:

```js
// Bir "Like" <button>'u göster
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

Bu iki kod parçacığı eşdeğerdir. **JSX [tamamen isteğe bağlı](/docs/react-without-jsx.html)** olsa da, hem React'i hem de diğer kütüphaneleri kullanan birçok kişi, kullanıcı arayüzü kodu yazmak için JSX'i yararlı bulmaktadır.

[Bu çevrimiçi dönüştürücüyü](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3) kullanarak JSX ile oynayabilirsiniz.

### JSX'i hızlıca deneyin {#quickly-try-jsx}

JSX'i projenizde denemenin en hızlı yolu, bu `<script>` etiketini sayfanıza eklemektir:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Şimdi JSX'i, herhangi bir `<script>` etikete `type="text/babel"` niteligini ekleyerek kullanabilirsiniz. İşte indirebileceğiniz ve JSX ile oynayabileceğiniz [örnek bir HTML dosyası](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html).

Bu yaklaşım, öğrenmek ve basit demolar oluşturmak için iyidir. Ancak, web sitenizi yavaşlatır ve **uygulamayı yayınlamaya uygun değildir**. İlerlemeye hazır olduğunuzda, bu yeni `<script>` etiketi ve eklediğiniz `type="text/babel"` özelliklerini kaldırın. Bunun yerine, bir sonraki bölümde tüm `<script>` etiketlerinizi otomatik olarak dönüştürmek için bir JSX ön-işleyici kuracaksınız.

### Bir projeye JSX ekleme {#add-jsx-to-a-project}

Bir projeye JSX eklemek, bir paketleyici veya geliştirme sunucusu gibi karmaşık araçlar gerektirmez. Temel olarak, JSX eklemek **bir CSS ön işleyicisi eklemek gibi bir şeydir.** Tek gereksinim, bilgisayarınızda [Node.js](https://nodejs.org/)'in yüklü olması.

Terminal içinde proje klasörünüze gidin ve şu iki komutu yapıştırın:

1. **Adım 1:** `npm init -y` komutunu çalıştır (başarısız olursa, [ bu düzeltmeye](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d) bakınız.)
2. **Step 2:** `npm install babel-cli@6 babel-preset-react-app@3` komutunu çalıştır

>İpucu
>
>**Burada sadece JSX ön-işleyici yüklemek için npm kullanıyoruz;** başka hiçbir şey için buna ihtiyacınız olmayacak. Hem React hem de uygulama kodu, `<script>` etiketi olarak değişiklik yapılmadan kalabilir.

Tebrikler! Projenize bir **yayına hazır JSX kurulumu** eklediniz bile.


### JSX Ön-işleyicisini Çalıştırın {#run-jsx-preprocessor}

`src` adında bir klasör oluşturun ve bu terminal komutunu çalıştırın:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>Not
>
>`npx` bir harf hatası değildir. [npm 5.2+ ile birlikte gelen bir paket çalıştırma aracıdır.](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>Eğer "You have mistakenly installed the `babel` package" şeklinde bir hata mesajı görürseniz, [bir önceki adımı](#add-jsx-to-a-project) atlamış olabilirsiniz. Aynı klasör altında adımı uygulayıp tekrar deneyin.

Bitmesini beklemeyin -- bu komut JSX için otomatik bir izleyici başlatır.

<<<<<<< HEAD
Şimdi **[JSX başlangıç ​​kodu](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)** ile `src/like_button.js` adlı bir dosya oluşturursanız, izleyici tarayıcıya uygun sade JavaScript koduyla oluşturulmuş bir önişlenmiş `like_button.js` dosyası oluşturur. Kaynak dosyayı JSX ile düzenlediğinizde, dönüştürme otomatik olarak yeniden çalıştırılır.
=======
If you now create a file called `src/like_button.js` with this **[JSX starter code](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, the watcher will create a preprocessed `like_button.js` with the plain JavaScript code suitable for the browser. When you edit the source file with JSX, the transform will re-run automatically.
>>>>>>> 5c371e5e3fd8f92e1d06dfdf1f28edc50fb5d83f

Bu aynı zamanda eski tarayıcılarda çökme konusunda endişelenmeden, sınıflar (classes) gibi modern JavaScript sözdizimi özelliklerini kullanmanızı sağlar. Az önce kullandığımız araca Babel denir ve [bu dokümantasyondan](https://babeljs.io/docs/en/babel-cli/) daha fazla bilgi edinebilirsiniz.

Yapı araçlarıyla rahat edeceğinizi fark ederseniz ve onların sizin için daha fazlasını yapmalarını isterseniz, [bir sonraki bölümde](/docs/create-a-new-react-app.html) en popüler ve ulaşılabilir araç serilerinden bazıları açıklanmaktadır. Yapı araçlarını istemiyorsanız bu script etiketleri de yeterli olacaktır!
