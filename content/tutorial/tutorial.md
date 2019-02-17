---
id: tutorial
title: "Öğretici: React'a giriş"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
  - "docs/tutorial-tr.html"
---

Bu öğretici, herhangi bir React bilginizin olmadığını varsayar.

## Öğreticiye Başlamadan Önce {#before-we-start-the-tutorial}

Bu öğreticide küçük bir oyun geliştireceğiz. **Oyun yapmadığınızdan dolayı bu öğreticiyi atlamak istiyor olabilirsiniz -- ama bir şans vermeniz iyi olacaktır.** Zira bu öğreticide edineceğiniz teknikler herhangi bir React uygulaması geliştirmek için temel niteliğindedir, ve bu temeller üzerinde uzmanlaşmak React'ı daha derinlemesine öğrenmenizi sağlayacaktır.

>İpucu
>
>Bu öğretici, **kodlayarak öğrenmek** isteyen kişiler için tasarlanmıştır. Eğer bu konseptleri her yönüyle edinmek isterseniz [adım adım öğrenme rehberini](/docs/hello-world.html) inceleyebilirsiniz. Bu öğretici ve adım adım öğrenme rehberinin birbirini tamamlayıcı nitelikte olduğunu görebilirsiniz.  

Bu öğretici birkaç bölüme ayrılmıştır:

* [Öğretici İçin Kurulum](#oretici-icin-kurulum) bu öğreticiyi takip etmek için size bir **başlangıç noktası** sunar. 
* [Genel bakış](#overview) React'ın **temellerini** öğretecektir: `component`'lar, `prop`'lar, ve uygulama `state`'i.
* [Oyunun Tamamlanması](#completing-the-game) React geliştirimindeki **en yaygın teknikleri** aktaracaktır.
* [Zaman Yolculuğunun Eklenmesi](#zaman-yolculugunun-eklenmesi) React'ın benzersiz özelliklerini ile ilgili **daha derinlemesine** kavramanızı sağlayacaktır.

Bu öğreticiden yararlanmanız için tüm bölümleri tamamen bitirmek zorunda değilsiniz. Bir-iki bölüm tamamlasanız bile sizin için yararlı olacaktır.

Bu öğreticiyi takip ederken kodları kopyala-yapıştır yaparak denemenizde hiçbir sorun yoktur fakat elle kodlayarak ilerlemenizi tavsiye ederiz. Bu sayede kas hafızanız gelişecek ve React'ı daha güçlü bir şekilde öğrenmiş hale geleceksiniz. 

### Ne kodlayacağız? {#what-are-we-building}

Bu öğreticide, React ile bir tic-tac-toe (XOX oyunu) nasıl geliştirilir onu göstereceğiz. 

**[Buradan](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)** oyunun son halini görebilirsiniz. Eğer kodlar size karışık geliyorsa veya koda aşina değilseniz endişelenmeyin. Çünkü bu öğreticinin amacı, React'ın ve React'taki kod yapısının anlaşılmasında size yardımcı olmaktır. 

Bu öğreticiye başlamadan önce yukarıda belirttiğimiz tic-tac-toe oyununu incelemenizi tavsiye ediyoruz. Oyunu oynadığınızda farkedeceğiniz gibi oyun tahtasının sağında numaralandırılmış bir liste bulunmaktadır. Bu liste size, oyunda oluşan hamlelerin bir geçmişini sunar ve oyunda ilerledikçe liste de otomatik olarak güncellenir.

tic-tac-toe oyununu inceledikten sonra kapatabilirsiniz. Bu öğreticide daha basit bir şablondan başlayacağız. Sonraki adımımızda oyunu geliştirmek için gereken ortamın kurulumuna değineceğiz.

### Ön gereksinimler {#prerequisites}

Bu öğreticide, HTML ve JavaScript'i az-çok bildiğinizi varsayacağız, fakat herhangi bir programlama dilinden gelmiş olsanız bile aşamaları takip edebiliyor olmalısınız. Ayrıca temel programlama konseptleri olan fonksiyonlar, nesneler, diziler ve daha az oranda da sınıflar hakkında aşina olduğunuzu varsayıyoruz.

Eğer JavaScript hakkında bilgi edinmeniz gerekiyorsa, [bu rehberi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) okumanızı tavsiye ederiz. JavaScript'in en güncel versiyonu olan ES6'dan bazı özellikleri kullanıyoruz. Bu öğreticide de ES6 özelliği olan [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), ve [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ifadelerini kullanıyor olacağız. [Babel REPL](babel://es5-syntax-example)'ı kullanarak ES6 kodunun derlenmiş halini görebilirsiniz.

## Öğretici İçin Kurulum {#setup-for-the-tutorial}

Bu öğreticiyi tamamlamanın iki yolu bulunmaktadır: kodu tarayıcınızda yazabilir veya bilgisayarınızdaki yerel geliştirim ortamını kurabilirsiniz. 

### Kurulum Seçeneği 1: Kodu Tarayıcıda Yazma {#setup-option-1-write-code-in-the-browser}

Başlamanız için en kolay yol budur!

Öncelikle, bu **[başlangıç kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** yeni sekmede açınız. Yeni sekme boş bir tic-tac-toe oyunu ve React kodu görüntülüyor olacaktır. Bu öğreticide React kodunu düzenliyor olacağız.

Bu seçeneği istiyorsanıaz ikinci seçeneği es geçebilir, ve [Genel bakış](#overview) bölümüne giderekn genel bilgi edinebilirsiniz.

### Kurulum Seçeneği 2: Yerel Geliştirim Ortamı {#setup-option-2-local-development-environment}

Bu seçenek tamamen isteğe bağlıdır ve bu öğretici için gerekli değildir!

<br>

<details>

<summary><b>İsteğe bağlı: Tercih ettiğiniz metin editörünü kullanarak projeyi yerel ortamınızda geliştirmeniz için yönergeler</b></summary>

Bu kurulum daha fazla çalışmayı gerektirir fakat aynı zamanda favori editörünüzü kullanarak projeyi tamamlamanıza da olanak tanır. İzlenecek adımlar aşağıdaki gibidir:

1. [Node.js](https://nodejs.org/en/)'in güncel versiyonunun yüklü olduğundan emin olunuz.
2. Yeni bir proje oluşturmak için [Create React App uygulaması kurulum yönergelerini](/docs/create-a-new-react-app.html#create-react-app) takip ediniz.

```bash
npx create-react-app my-app
```

3. Yeni projenin `src/` dizininin içerisindeki tüm dosyaları siliniz

> Not:
>
>**`src` dizininin kendisini silmeyiniz, sadece içerisinde yer alan ve varsayılan olarak gelen kaynak dosyalarını siliniz.** Sonraki adımda oluşan varsayılan dosyaları, bu projenin dosyaları ile değiştireceğiz. 

```bash
# Proje dizinindeki src'nin içine gitmek için aşağıdaki komutlar kullanılır:
cd my-app
cd src

# Daha sonra dizin içerisindeki dosyaları silmek içim işletim sistemine göre rm veya del komutu kullanılır.
# Eğer Mac veya Linux kullanıyorsanız:
rm -f *

# Windows kullanıyorsanız:
del *

# Then, switch back to the project folder
cd ..
```

4. `src/` dizininde `index.css` dosyasını oluşturup [buradaki CSS kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0100) ekleyiniz.

5. `src/` dizininde `index.js` dosyasını oluşturup [buradaki JS kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010) ekleyiniz.

6. `src/` dizinindeki `index.js` dosyasını açıp en üste bu 3 satırı ekleyiniz:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Artık projeyi çalıştırabilirsiniz. Proje dizininde iken `npm start` yazıp enter'a bastığınızda, tarayıcıda `http://localhost:3000` url'i açılacak ve devamında boş bir tic-tac-toe oyunu görüyor olacaksınız.

Metin editörünüzde, kodun renkli halde görüntülenmesini sağlamak için [buradaki yönergeleri](https://babeljs.io/docs/editors/) izlemenizi tavsiye ederiz.

</details>

### Bir Yerde Takıldım, Yardım! {#help-im-stuck}

Eğer bu öğreticiyi takip ederken herhangi bir yerde takıldıysanız, [topluluk destek kaynaklarına](/community/support.html) bakınız. Özellikle Discord'da yer alan [Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n) kanalı, hızlıca yardım almak için oldukça elverişlidir. Eğer bir cevap alamadıysanız veya hala takıldığınızdan dolayı devam edemiyorsanız lütfen bize GitHub üzerinden issue açınız devamında size yardımıcı olacağız.

## Genel Bakış {#overview}

Kurulumu tamamladığınıza göre haydi şimdi React'e giriş yapalım!

### React Nedir? {#what-is-react}

React, kullanıcı arayüzleri oluşturmak için açık, verimli ve esnek bir JavaScript kütüphanesidir. Component (bileşen) denilen küçük ve izole parçalar sayesinde karmaşık arayüz birimlerini oluşturmanıza olanak tanır. 

React'te birkaç tipte component bulunmaktadır. `React.Component` alt sınıflarına değinelim:

```javascript
class AlisverisListesi extends React.Component {
  render() {
    return (
      <div className="alisveris-listesi">
        <h1>{this.props.adi}e ait Alışveriş Listesi</h1>
        <ul>
          <li>Elma</li>
          <li>Armut</li>
          <li>Muz</li>
        </ul>
      </div>
    );
  }
}

// Örnek kullanım: <AlisverisListesi adi="Mehmet" />
```

Birazdan üstte kullandığımız XML-tarzı etiketlere değineceğiz. Component'leri kulanarak ekranda görmek istediğimiz arayüz birimlerini React'a belirtmiş oluyoruz. Verilerimiz değiştiği zaman React, etkili bir şekilde component'lerimizi güncelleyecek ve tekrar render edecektir (arayüze işleyecektir). 

Burada AlisverisListesi için bir **React component sınıfıdır**, veya **React component tipidir** diyebiliriz. Bir component, "properties" (özellikler)'in kısaltması olan `props` adı verilen parametreleri alır, ve `render` metodu aracılığıyla görüntülemek için bir görünüm hiyerarşisi (XML) return eder. 

`render` metodu, ekranda neyi görüntülemek istiyorsanız onunla ilgili bir *tanımlama* return eder. React bu tanımlamayı alır ve görüntüler. Bilhassa `render` metodu, neyi render edeceği ile ilgili bir tanımlama olan **React elemanı** return eder. Birçok React geliştiricisi, bu tanımlamaları kolayca kodlamayı sağlayan ve "JSX" denilen özel bir kod dili kullanır. JSX olan `<div />` içeriği ise derleme zamanında `React.createElement('div')` JavaScript metod çağrısına dönüştürülür. Üstteki örneğin derlenmiş hali aşağıdaki gibidir:

```javascript
return React.createElement('div', {className: 'alisveris-listesi'},
  React.createElement('h1', /* ... h1 içeriği ... */),
  React.createElement('ul', /* ... ul içeriği ... */)
);
```

[Tam hali için tıklayınız.](babel://tutorial-expanded-version)

Eğer `createElement()` fonksiyonunu merak ediyorsanız, [API dokümanında](/docs/react-api.html#createelement) daha detaylı şekilde ele alınacaktır, fakat bu öğreticide `createElement()` fonksiyonunu kullanmayacağız. Bunun yerine JSX notasyonunu ele alacağız.

JSX, JavaScript'in bütün gücünü kullanacak şekilde tasarlanmıştır. Bu sayede JSX kodu içerisinde süslü parantezler kullanarak herhangi bir JavaScript ifadesini çalıştırabilirsiniz. Her React elemanı, bir değişkende saklayabileceğiniz veya uygulama içerisinde herhangi bir yere aktarabileceğiniz bir JavaScript nesnesidir.

Yukarıdaki `AlisverisListesi` component'i, yalnızca `<div />` ve `<li />` gibi yerleşik DOM bileşenlerini render eder. Fakat uygulamanıza özel React component'leri oluşturarak ve birleştirerek bu React component'lerinin de render edilmesini sağlayabilirsiniz. Örneğin sadece `<AlisverisListesi />` yazarak bütün alışveriş listesinin görüntülenmesini sağlayabiliriz. Her React component'i izole edilmiştir ve birbirlerinden bağımsız olarak çalışabilir. Bu sayede basit component'leri bir araya getirerek kompleks kullanıcı arayüzleri oluşturabilirsiniz.

## Başlangıç Kodunun İncelenmesi {#inspecting-the-starter-code}

Eğer bu öğreticiyi **tarayıcınızda** takip edecekseniz, **[başlangıç kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** yeni sekmede açınız. Eğer öğreticiyi **yerel makinenizde** takip edecekseniz, bunun yerine proje dizininde yer alan `src/index.js` dosyasını açınız (bu dosyaya daha önce [kurulum](#setup-option-2-local-development-environment) aşamasında değinmiştik). 

Bu başlangıç kodu, yapacağımız proje ile ilgili bir temel niteliğindedir. Size CSS kodlarını hazır olarak sunduk, bu sayede CSS ile uğraşmaksızın yalnızca React'i öğrenmeye ve tic-tac-toe oyununun programlanmasına yoğunlaşacabileceksiniz.

Kodu incelediğinizde aşağıdaki 3 React component'ini fark edeceksiniz:

* Square (Kare)
* Board (Tahta)
* Game (Oyun)

Şu an Square component'i yalnızca bir adet `<button>` elemanını, Board ise 9 adet Square component'ini render ediyor. Game component'i ise Board component'ini ve daha sonra değiştireceğimiz bir kısa metni render ediyor. Henüz uygulama içerisinde etkileşimli bir component yer almamaktadır.

### Prop'lar Aracılığıyla Veri Aktarımı {#passing-data-through-props}

Şimdi işe koyulalım ve Board component'inden Square component'imize bazı verileri göndermeyi deneyelim.

Board'ın `renderSquare` metodunda, `value` (değer) adındaki prop'u Square'e gönderecek şekilde kodu değiştirelim:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Square's `render` metodunu ilgili değeri göstermesi için `{/* TODO */}` kısmını `{this.props.value}` şekilde değiştirelim:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Öncesi:

![React Devtools](../images/tutorial/tictac-empty.png)

Sonrası: Eğer değişiklikleri doğru bir şekilde uyguladıysanız render işlemi bitiminde her karede içerisinde bir sayı görüyor olmalısınız. 

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Tebrikler! Board component'inden Square component'ine "prop ile veri geçirmeyi" başardınız. React uygulamalarında prop'ların ebeveyn component'ten çocuk component'e geçişi sayesinde veri akışının oluşması sağlanır.

### Etkileşimli bir Component Yapımı {#etkilesimli-bir-component-yapimi}

Haydi şimdi Square component'ine tıkladığımızda içini "X" ile dolduralım. 
Öncelikle, Square component'inin `render()` fonksiyonundan dönen button etiketini bu şekilde değiştirelim:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Şimdi herhangi bir kareye tıkladığımızda tarayıcıda bir alert mesajı görüntülenecektir. 

>Not:
>
>Daha az kod yazmak ve [`this`'in kafa karıştırıcı kullanımından](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) kaçınmak için, event handler gibi kısımlarda [arrow function syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)'ını kullanacağız:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Farkedeceğiniz üzere, `onClick={() => alert('click')}` kısmında butonun `onClick` prop'una *bir fonksiyon* ataması gerçekleştiriyoruz. Bu fonksiyon sadece butona tıkladığımızda çalışıyor. Genellikle bir yazılımcı hatası olarak parantezli ok `() =>` ifadesinin unutulması yerine direkt olarak `onClick={alert('click')}` ifadesinin yazılması gerçekleşebiliyor. Bu durumda tıklama anında gerçekleşmesi istenen olay yanlış bir şekilde çalışarak, component tekrar render edildiğinde gerçekleşmiş oluyor.

Sonraki adım olarak, Square component'inin tıklandığı zamanı "hatırlamasını" ve "X" işareti ile doldurulmasını isteyeceğiz. Bir şeyleri "hatırlamak" için component'ler **state**'i (durum) kullanırlar.

React component'leri constructor (yapıcı) fonksiyonlarında `this.state`'e atama yaparak bir state'e sahip olurlar. React component'i içerisinde tanımlanan `this.state` özelliğinin erişim belirleyicisi private olarak düşünülmelidir. Şimdi Square'in mevcut değerini `this.state` içerisinde saklayalım ve Square'e tıklandığında değiştirelim. 

Öncelikle class'a bir constructor ekleyeceğiz ve içerisinde state'in başlangıç değerlerini oluşturacağız:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Not:
>
>[JavaScript class'larında](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), alt sınıfın constructor'ını oluştururken her zaman `super` fonksiyonunu çağırmanız gerekmektedir. Her bir React component class'ı içerisinde `super(props)` çağrısı ile başlayan bir constructor barındırmalıdır.

Şimdi Square'e tıklandığında state'in mevcut değerinin görüntülenmesi için Square'in `render` metodunu değiştireceğiz:

* `<button>` etiketi içerisinde yer alan `this.props.value` yerine `this.state.value` yazalım.
* `() => alert()` event handler'ını `() => this.setState({value: 'X'})` ile değiştirelim.
* Okunabilirliği arttırmak için `className` ve `onClick` prop'larını ayrı satırlara alalım.

Bu değişikliklerden sonra Square'in `render` metodundan dönen `<button>` etiketi aşağıdaki gibi görüntülenecektir:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Square'in `render` metodundaki bir `onClick` metodundan `this.setState`'in çağrılması ile, Square'in `<button>` elemanına her tıklandığında tekrar render edilmesi gerektiğini React'a belirtiyoruz.  Güncelleme sonrasında Square'in `this.state.value` değerine `'X'` ataması gerçekleşiyor, ve bu sayede oyun tahtasında 'X''i görüyoruz. Herhangi bir kareye tıklandığı anda içerisinde 'X' görüntülenecektir.

Bir component'teki `setState` fonksiyonunu çağırdığınızda, React otomatik olarak içerisindeki çocuk component'leri de güncellemiş oluyor.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Geliştirici Araçları {#developer-tools}

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) ve [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) için React Devtools eklentisi sayesinde herhangi bir React component ağacını, tarayıcınızın geliştirici araçları kısmından görüntüleyebilirsiniz.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools, React component'lerinizin state'ini ve prop'larını kontrol etmenize olanak tanır.

React DevTools kurulumundan sonra, sayfa içerisindeki herhangi bir elemana sağ tıklayarak çıkan menüde "İncele"'yi seçerek geliştirici araçlarını açabilir, ve devamında en sağda yer alan React sekmesinde incelemelerinizi yürütebilirsiniz.

**Eklentinin CodePen ile çalışabilmesi için harici olarak birkaç adım daha vardır:**

1. CodePen'e e-posta adresiniz ile giriş yapın veya kaydolunuz (spam'lerin engellenmesi için gereklidir).
2. "Fork" butonuna basınız.
3. "Change View"'a tıklayarak devamında "Debug mode"'u seçiniz.
4. Açılan yeni sekmede, artık Devtools içerisinde React sekmesi yer alacaktır.

## Oyunun Tamamlanması {#completing-the-game}

Artık tic-tac-toe oyunumuz için temel kod bloklarına sahibiz. Oyunun tamamlanması için tahta üzerinde "X" ve "O"'ların birbiri ardına yerleştirilmesi ve devamında bir kazananın belirlenmesi için değişiklikler yapmamız gerekiyor. 

### State'in Ebeveyn Component'e Taşınması {#lifting-state-up}

Şu an her bir Square component'i oyunun state'ini değiştirebiliyor. Kazananı belirleyebilmemiz için her bir 9 square'in değerine ihtiyacımız var.

Board'ın her bir Square'e, kendi state'inin ne olduğunu sorması gerektiğini düşünebiliriz. Bu yöntem her ne kadar React'te uygulanabilir olsa da yapmanızı tavsiye etmiyoruz. Çünkü bu şekilde kod anlaşılabilirlikten uzak hale gelecek, hataların oluşmasına daha müsait olacak ve kodu refactor etmek istediğimizde bize çok daha büyük zorluklar çıkaracaktır. Bu nedenle, her bir Square'de kendi state'inin tutulmasının yerine, ebeveyn olan Board component'inde oyunun tüm state'ini tutmak en iyi yaklaşımdır. Bunun sonucunda Board component'i, her bir Square'e neyi göstermesi gerektiğini prop'lar aracılığıyla aktarır [daha önce her bir Square'e bir sayı atadığımız gibi](#passing-data-through-props).

**Birçok çocuk component'ten verilerin toplanması için veya iki çocuğun birbirleri arasında iletişim kurabilmesi için ebeveyn component'te paylaşımlı bir state oluşturmanız gerekmektedir. Ebeveyn component, prop'lar aracılığıyla state'ini çocuklara aktarabilir. Bu sayede çocuk component'ler hem birbirleri arasında hem de ebeveyn ile senkronize hale gelirler.**

State'in ebeveyn'e taşınması React component'leri refactor edilirken çok yaygın bir durumdur -- haydi şimdi bu fırsatı değerlendirelim ve işe koyulalım. Board'a bir constructor ekleyelim ve Board'ın başlangıç state'ine bir array atayarak içerisinde 9 adet null değerinin bulunmasını sağlayalım. 9 adet null, 9 kareye karşılık gelecektir:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Daha sonra Board'ı doldurdukça , array içeriği aşağıdaki gibi görünmeye başlayacaktır: 

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Board'ın `renderSquare` metodu aşağıdaki gibi görünüyor:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Projeye başladığımızda her bir karede 0'dan 8'e kadar olan sayıları göstermek için Board'daki `value` prop'unu çocuk component'lere [aktarmıştık](#passing-data-through-props). Bir diğer önceki aşamada ise sayıların yerine [mevcut Square component'inin kendi state'i tarafından belirlenen](#making-an-interactive-component) "X" işaretinin almasını sağlamıştık. İşte bu nedenle Square component'i, Board tarafından kendisine gönderilen `value` prop'unu göz ardı ediyor.

Şimdi prop aktarma mekanizmasını tekrar kullanacağız. Bunun için her bir Square'e kendi mevcut değerini (`'X'`, `'O'`, or `null`) atamak için Board component'inde değişiklik yapalım. Board'un constructor'ında halihazırda tanımladığımız bir `squares` array'i bulunuyor. Board'un `renderSquare` metodunu, bu array'den verileri alacak şekilde değiştirelim: 

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Artık her bir Square component'i `value` prop'unu alacak ve 'X', 'O' veya boş square'ler için `null` değerini edinecektir. 

Şimdi Square'e tıklandığında ne olacağona karar vermemiz gerekiyor. Board component'i artık hangi square'in doldurulacağına karar verebildiğine göre Square'e tıklandığında Board component'inin state'inin güncellenmesini sağlamalıyız. State her bir component'e private olduğundan dolayı Square üzerinden direkt olarak Board'un state'ini değiştiremeyiz. 

Board'un state'inin gizliliğini korumak için, Board'dan Square'e bir fonksiyon aktarmamız gerekiyor. Square'e her tıklama anında bu fonksiyonun otomatik olarak çağrısı gerçekleşecektir. Şimdi Board'un `renderSquare` metodunu aşağıdaki şekilde değiştirelim:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Not
>
>Kodun okunabilirliği için geri dönüş elemanını birçok satıra böldük ve parantezler ekledik. Bu sayede JavaScript, `return`'den sonra otomatik olarak bir noktalı virgül eklemeyecek ve bundan dolayı kodun bozulması engellenmiş hale gelecektir.

Artık Board'dan Square'e, `value` ve `onClick` olmak üzere iki tane prop gönderiyoruz. Square'e tıklandığında ise prop olarak gelen `onClick` fonksiyonu çağrılmasına ihtiyacımız var. Bunun için Square'e aşağıdaki değişiklikleri uygulamamız gerekiyor:

* Square'in `render` metodu içerisinde yer alan `this.state.value` yerine `this.props.value` yazınız.
* Yine Square'in `render` metodundaki `this.setState()` yerine `this.props.onClick()` yazınız.
* Square artık oyunun state'ini değiştirmeyeceği için, Square'in `constructor` metodunu siliniz.

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

Artık Square'e tıklandığında, Board tarafından aktarılan `onClick` fonksiyonu çağrılacaktır. Here's a review of how this is achieved:

1. HTML'de varsayılan olan `<button>` component'inin `onClick` prop'u React'e, tıklama olayını oluşturmasını söyler.
2. Butona tıklandığında React, Square'in `render()` metodunda tanımlanan `onClick` fonksiyonunu çalıştırır.
3. Bu fonksiyon ise, `this.props.onClick()` çağrısını gerçekleştirir. Square'in `onClick` prop'u, Board tarafından kendisine aktarılmıştır.
4. Board, Square'e `onClick={() => this.handleClick(i)}` kodunu aktardığı için, Square'e tıklandığında Board'un `this.handleClick(i)` metodu çağrılır.
5. Şu an `handleClick()` metodunu tanımlamadığımız için kodumuz hata verecektir.

>Not
>
>DOM'daki `<button>` elemanı varsayılan component olarak geldiği için, `onClick` fonksiyonu, React için özel bir anlam ihtiva eder. Fakat Square gibi custom component'lerde, prop isimlendirmesi size kalmıştır. Bu nedenle Square'in `onClick` prop'unu veya Board'un `handleClick` metodunu daha farklı şekilde isimlendirebilirsiniz. Ancak React'teki isimlendirme kuralına uymak gereklidir. Bu kural şu şekildedir: olayları temsil eden prop'lar için `on[Olay]`, olayları handle eden metodlar için ise `handle[Olay]` ifadeleri kullanılır. 

Square'e tıkladığımızda, `handleClick`'i tanımlamadığımız için hata aldığımızdan bahsetmiştik. Gelin şimdi Board sınıfına `handleClick`'i ekleyelim:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

Bu değişikliklerden sonra, oyundaki karelere tıkladığımızda içeriğinin "X" ile doluyor olduğunu tekrar görebiliyoruz. Fakat, artık state'in her bir Square'de ayrı ayrı yer alması yerine Board component'inde barındırılmış hale geldi. Bu sayede Board'daki state değiştiğinde tüm Square component'leri otomatik olarak tekrar render edilecektir. Bunun yanında, bütün Square'lerin state'inin Board component'inde tutulması, gelecekte kazananı belirlememiz için önemli bir yol teşkil edecektir.

Square component'leri artık state'i direkt olarak değiştirmediği için, değerleri Board component'inden alıyorlar ve tıklandıklarında Board'u haberdar ediyorlar. React terminolojisinde Square component'leri için **controlled components** (kontrollü bileşenler) adı verilir. Çünkü tüm kontrol Board component'inin elindedir. 

Fark ettiyseniz `handleClick` fonksiyonu içerisinde, halihazırda var olan `squares` array'ini direkt olarak değiştirmek yerine, `.slice()`'ı kullanarak bir kopyasını oluşturduk ve bu kopyayı değiştirdik. Sonraki bölümde neden `squares` array'inin bir kopyasını oluşturduğumuza değineceğiz. 

### Neden Immutability Önemlidir {#why-immutability-is-important}

**Immutability**, anlam olarak **mutate** (değişmek) kelimesinin zıttı olan **değişmezlik** kavramını oluşturmaktadır. Önceki kod örneğinde, mevcut `squares` array'ini değiştirmek yerine array'in `.slice()` metodu ile bir kopyasının oluşturulması gerektiğini önermiştik. Şimdi ise immutability'i ve immutability'i öğrenmenin neden önemli olduğunu tartışacağız.

Genellikle verinin değiştirilmesi için iki farklı yaklaşım vardır. İlk yaklaşımda, verinin değerleri direkt olarak değiştirilerek ilgili verinin değişmesi (mutate) sağlanır. İkinci yaklaşımda ise, ilgili veri kopyalanarak, kopya veri üzerinde istenen değişiklikler gerçekleştirildikten sonra kopya verinin, ana veriye atanması işlemidir.

#### Mutasyon Kullanılarak Verinin Değiştirilmesi {#data-change-with-mutation}
```javascript
var oyuncu = {skor: 1, adi: 'Zafer'};
oyuncu.skor = 2;
// Oyuncu nesnesinin son hali: {score: 2, name: 'Jeff'}
```

#### Mutasyon Kullanılmadan Verinin Değiştirilmesi {#data-change-without-mutation}
```javascript
var oyuncu = {skor: 1, adi: 'Zafer'};

var yeniOyuncu = Object.assign({}, oyuncu, {skor: 2});
// Şu an oyuncu nesnesi değişmedi, fakat oyuncu nesnesinden yeniOyuncu nesnesi oluşturuldu: {skor: 2, adi: 'Zafer'}

// Object spread syntax proposal'ı kullanarak aşağıdaki gibi de yazabilirsiniz:
// var yeniOyuncu = {...oyuncu, skor: 2};
```

Sonuç iki durumda da aynı oldu ama direkt olarak veriyi değiştirmeden kopya üzerinde değişiklikler yapmanın aşağıdaki gibi birçok yararı vardır. 

#### Karmaşık Özellikleri Basit Hale Getirir {#complex-features-become-simple}

Immutability sayesinde karmaşık özellikleri kodlamak çok daha kolaydır. Bu öğreticinin sonunda, tic-tac-toe oyunundaki hamlelerin geçmişini incelemeyi ve önceki hamlelere geri dönmeyi sağlayan "zaman yolculuğu" özelliğini kodlayacağız.  Bu özellik sadece oyunlarda değil birçok uygulamada ileri ve geri alma işlemlerinin kurgulanması için bir gereksinim teşkil edebilir. Direkt olarak veri mutasyonundan kaçınarak, oyunun önceki versiyonlarını oyun geçmişinde bozmadan tutabilir ve daha sonra, önceki bir versiyona geri dönmeyi sağlayabilirsiniz.

#### Değişikliklerin Tespit Edilmesini Kolaylaştırır {#detecting-changes}

Mutable nesneler, direkt olarak değiştirilebildikleri için, değişip/değişmediklerinin tespit edilmesi güçtür. Değişikliğin tespit edilebilmesi için, nesnenin öneki kopyaları ile kendisinin karşılaştırılması ve bütün nesne ağacı üzerinde gezilmesi gereklidir.

Immutable nesnelerdeki değişikliklerin tespit edilmesi daha kolaydır. Immutable nesne, öncekinden farklı bir değişkene referans edilmişse o halde nesne değişmiştir diyebiliriz.

#### Tekrar Render Etme Zamanı Kolayca Belirlenebilir {#determining-when-to-re-render-in-react}

React'te Immutability'nin ana faydası ise, _pure component_'ler (saf/katıksız bileşenler) yapmayı kolaylaştırmasıdır. Immutable veriler, değişiklik yapıldığını kolayca tespit edebilirler. Bu sayede değişiklik olduğunda ilgili component'in tekrar render edilmesine yardımcı olurlar.

[Performansın iyileştirmesi](/docs/optimizing-performance.html#examples) yazısında  `shouldComponentUpdate()` fonksiyonunun ne olduğunu ve nasıl *pure component*'leri oluşturabileceğiniz hakkında bilgi edinebilirsiniz.

### Fonksiyon Component'leri {#function-components}

Square component'ini masıl **fonksiyon component**'i haline getireceğimize değinelim.

React'te **fonksiyon component**'leri sadece `render` metodunu içerdikleri ve state'leri bulunmadıkları için daha kolay bir şekilde component oluşturmayı sağlarlar. `React.Component`'tan türetilen bir sınıf oluşturmak yerine, sadece `prop`'ları girdi olarak alan ve neyin render edileceğini döndüren bir fonksiyon yazabiliriz. Fonksiyon component'leri kısa bir şekilde yazıldığı için, sınıf component'lerine göre sizi mental açıdan daha az yorar.

Square sınıfını aşağıdaki fonksiyon ile değiştirelim: 

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Kodda iki yerde `this.props` yerine `props` terimini kullandık.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Not
>
>Square'i, fonksiyon component olarak değiştirerek aynı zamanda uzun olan `onClick={() => this.props.onClick()}` kod parçasını, `onClick={props.onClick}` şeklinde yazarak daha kısa hale getirmiş olduk (her iki taraftaki parantezlerin de gittiğine dikkat ediniz). Sınıf component'inde gerçek `this` değerine ulaşmak için arrow (ok) fonksiyonu kullanmıştık. Bunun tersine fonksiyon component'lerinde `this` ile uğraşmanıza gerek yoktur.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
