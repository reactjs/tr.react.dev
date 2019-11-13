---
id: tutorial
title: "Öğretici: React'e giriş"
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

Bu öğreticide küçük bir oyun geliştireceğiz. **Oyun geliştiricisi olmadığınızdan dolayı bu öğreticiyi atlamak istiyor olabilirsiniz -- ama bir şans vermeniz iyi olacaktır.** Zira bu öğreticide edineceğiniz teknikler herhangi bir React uygulaması geliştirmek için temel niteliğindedir, ve bu temeller üzerinde uzmanlaşmak React'i daha derinlemesine öğrenmenizi sağlayacaktır.

>Not:
>
>Bu öğretici, **kodlayarak öğrenmek** isteyen kişiler için tasarlanmıştır. Eğer bu konseptleri her yönüyle edinmek isterseniz [adım adım öğrenme rehberini](/docs/hello-world.html) inceleyebilirsiniz. İncelediğinizde, öğreticinin ve adım adım öğrenme rehberinin birbirini tamamlayıcı nitelikte olduğunu görebilirsiniz.  

Bu öğretici birkaç bölüme ayrılmıştır:

* [Öğretici İçin Kurulum Rehberi:](#setup-for-the-tutorial) bu öğreticiyi takip etmek için size bir **başlangıç noktası** sunar. 
* [Genel bakış:](#overview) React'in **temellerini** öğretecektir: `component`'lar, `prop`'lar, ve uygulama `state`'i.
* [Oyunun Tamamlanması:](#completing-the-game) React geliştirimindeki **en yaygın teknikleri** aktaracaktır.
* [Zamanda Yolculuğun Eklenmesi:](#adding-time-travel) React'in benzersiz özellikleri hakkında **daha derinlemesine** bilgiler edinmenizi sağlayacaktır.

Bu öğreticiden yararlanmanız için tüm bölümleri tamamen bitirmek zorunda değilsiniz. Bir-iki bölüm tamamlamanız bile sizin için yararlı olacaktır. Fakat yine de tüm bölümleri tamamlamaya çalışınız.

Bu öğreticiyi takip ederken kodları kopyala-yapıştır yaparak denemenizde bizce hiçbir sorun yoktur. Fakat elle kodlayarak ilerlemenizi tavsiye ederiz. Bu sayede kas hafızanız gelişecek ve React'i daha güçlü bir şekilde öğrenmiş hale geleceksiniz. 

### Ne kodlayacağız? {#what-are-we-building}

Bu öğreticide, React ile bir tic-tac-toe (XOX oyunu) nasıl geliştirilir onu göstereceğiz. 

**[Buradan](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)** oyunun son halini görebilirsiniz. Eğer bu kodlara aşina değilseniz ve size karışık geliyorsa endişelenmeyin. Çünkü bu öğreticinin amacı, React'in ve React'teki kod yapısının anlaşılmasında size yardımcı olmaktır. 

Bu öğreticiye başlamadan önce, yukarıda belirttiğimiz linke giderek oyunu oynamanızı ve incelemenizi tavsiye ediyoruz. Oyunu oynadığınızda farkedeceğiniz gibi; oyun tahtasının sağında, numaralandırılmış bir liste bulunmaktadır. Bu liste size, oyunda oluşan hamlelerin bir geçmişini sunar ve oyunda ilerledikçe liste de otomatik olarak güncellenir.

Oyunu inceledikten sonra ilgili sayfayı kapatabilirsiniz. Çünkü bu öğreticiye sıfırdan bir şablonla başlayacağız. 

Gelin şimdi oyunu kodlamak için gereken geliştirme ortamının kurulumuna değinelim.

### Ön gereksinimler {#prerequisites}

Bu öğreticide, HTML ve JavaScript'i az-çok bildiğinizi varsayacağız. Fakat herhangi bir programlama dilinden gelseniz bile aşamaları takip edebilirsiniz. Ayrıca temel programlama konseptleri olan fonksiyonlara, nesnelere, dizilere ve az da olsa sınıflara aşina olduğunuzu varsayıyoruz.

Eğer JavaScript hakkında bilgi edinmeniz gerekiyorsa, [bu rehberi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) okumanızı tavsiye ederiz. JavaScript'in en güncel versiyonu olan ES6 (EcmaScript 6)'dan bazı özellikleri kullanacağız. Bu öğreticide de hepsi birer ES6 özelliği olan [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), ve [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) ifadelerini kullanıyor olacağız. ES6, henüz her tarayıcı tarafından tam olarak desteklenmediği için [Babel REPL](babel://es5-syntax-example)'ı kullanarak ES6 kodunun derlenmiş halini görebilirsiniz.

## Öğretici İçin Kurulum {#setup-for-the-tutorial}

Bu öğreticiyi tamamlamanın iki yolu bulunmaktadır: kodu tarayıcınızda yazabilir veya bilgisayarınıza yerel geliştirme ortamını kurabilirsiniz. 

### Kurulum Seçeneği 1: Kodu Tarayıcıda Yazma {#setup-option-1-write-code-in-the-browser}

Başlamanız için en kolay olan yöntemdir.

Öncelikle, buradaki **[başlangıç kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** yeni sekmede açınız. Yeni sekme, React kodu ile birlikte boş bir tic-tac-toe oyununu görüntülüyor olacaktır. Bu öğreticide React kodunu düzenliyor olacağız.

Bu seçeneği tercih ediyorsanız, ikinci seçeneği es geçebilir, ve [Genel bakış](#overview) bölümüne giderek genel bilgi edinebilirsiniz.

### Kurulum Seçeneği 2: Yerel Geliştirme Ortamı {#setup-option-2-local-development-environment}

Bu seçenek tamamen isteğe bağlıdır ve bu öğreticiyi takip etmek için zorunlu değildir.

<br>

<details>

<summary><b>İsteğe bağlı: Projeyi yerel ortamınızda geliştirmek için tıklayınız.</b></summary>

Bu kurulum seçeneği, üzerinde daha fazla çalışmayı gerektirir. Fakat aynı zamanda favori metin editörünüzü kullanarak projeyi geliştirmenize de olanak sağlar. İzlenecek adımlar aşağıdaki gibidir:

1. [Node.js](https://nodejs.org/en/)'in güncel versiyonunun yüklü olduğundan emin olunuz.
2. Yeni bir proje oluşturmak için [Create React App uygulaması kurulum yönergelerini](/docs/create-a-new-react-app.html#create-react-app) takip ediniz. Aşağıdaki komutla my-app adında yeni bir React uygulaması oluşturunuz:

```bash
npx create-react-app my-app
```

3. Yeni projenin `src/` dizininin içerisindeki tüm dosyaları siliniz:

> Uyarı:
>
>**`src` dizininin kendisini silmeyiniz, sadece içerisinde yer alan ve varsayılan olarak gelen kaynak dosyalarını siliniz.** Çünkü 4. adımda, yeni React uygulaması ile gelen varsayılan dosyaları, bu projenin dosyaları ile değiştireceğiz. 

```bash
# Aşağıdaki komutlar yardımıyla projenin src dizinine gidiniz:
cd my-app
cd src

# Daha sonra rm veya del kullanarak src dizininin içerisindeki dosyaları siliniz.

# Eğer Mac veya Linux kullanıyorsanız rm komutunu kullanabilirsiniz:
rm -f *

# Windows kullanıyorsanız del komutunu kullanabilirsiniz:
del *

# Proje dizinine geri dönünüz:
cd ..
```

4. `src/` dizininde `index.css` dosyasını oluşturup [buradaki CSS kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0100) ekleyiniz.

5. `src/` dizininde `index.js` dosyasını oluşturup [buradaki JS kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010) ekleyiniz.

6. `src/` dizinindeki `index.js` dosyasını açıp, en üste aşağıdaki import satırlarını ekleyiniz:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Artık projeyi çalıştırabilirsiniz. Konsolda proje dizinindeyken `npm start` komutunu girdiğinizde, tarayıcıda `http://localhost:3000` url'i açılacak ve devamında boş bir tic-tac-toe oyunu görüyor olacaksınız.

Metin editörünüzde, kodun renkli halde görüntülenmesini sağlamak için [buradaki yönergeleri](https://babeljs.io/docs/editors/) izlemenizi tavsiye ederiz.

</details>

### Takıldım, Yardım Edin! {#help-im-stuck}

Eğer bu öğreticiyi takip ederken herhangi bir yerde takıldıysanız, [topluluk destek kaynaklarına](/community/support.html) bakınız. Özellikle Discord'da yer alan [Reactiflux Chat](https://discord.gg/reactiflux) kanalı, hızlıca yardım almak için oldukça elverişlidir. Eğer bir cevap alamadıysanız veya hala takıldığınız için devam edemiyorsanız lütfen bize GitHub üzerinden issue açınız. Devamında size yardımıcı olacağız.

## Genel Bakış {#overview}

Kurulumu tamamladığınıza göre artık, React'e giriş yapabiliriz.

### React Nedir? {#what-is-react}

React, kullanıcı arayüzleri oluşturmak için açık, verimli ve esnek bir JavaScript kütüphanesidir. Component (bileşen) denilen küçük ve izole parçalar sayesinde karmaşık arayüz birimlerini oluşturmanıza olanak tanır. 

React'te birkaç tipte bileşen bulunmaktadır. Fakat şimdilik `React.Component`'e değinelim:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Örnek kullanım: <ShoppingList name="Mark" />
```

Birazdan yukarıda kullandığımız XML-tarzı etiketlere değineceğiz. React bileşenleri sayesinde, ekranda görmek istediğimiz arayüz birimlerini React'e belirtmiş oluyoruz. Verilerimiz değiştiği zaman React, etkili bir şekilde bileşenlerimizi güncelleyecek ve tekrar render edecektir (arayüze işleyecektir). 

Buradaki ShoppingList, **React bileşen sınıfıdır**, veya **React bileşen tipidir** diyebiliriz. Bir React bileşeni, özellikler anlamına gelen "properties"'in kısaltması olan `props` isimli parametreleri alır, ve arayüzü görüntülemek amacıyla `render` metodundan geriye bir görünüm hiyerarşisi (XML kodu) döndürür. 

`render` metodu, ekranda neyi görüntülemek istiyorsanız onunla ilgili bir *tanımlama* geri döndürür. React de bu tanımlamayı alır ve görüntüler. Bilhassa `render` metodu, neyi render edeceği ile ilgili bir tanımlama olan **React elemanı** (React element) geri döndürür. Birçok React geliştiricisi, bu tanımlamaları kolayca kodlamak için "JSX" denilen özel bir kod dili kullanır. `<div />` içeriği bir JSX kodu teşkil eder. Bu kod derlendiğinde, `React.createElement('div')` şeklinde bir JavaScript metot çağrısına dönüştürülür. Üstteki örneğin derlenmiş hali aşağıdaki gibidir:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 içeriği ... */),
  React.createElement('ul', /* ... ul içeriği ... */)
);
```

[Kodun tam hali için tıklayınız.](babel://tutorial-expanded-version)

Eğer `createElement()` fonksiyonu hakkında daha fazla bilgi almak istiyorsanız [API dokümanını](/docs/react-api.html#createelement) inceleyebilirsiniz. Fakat bu öğreticide `createElement()` fonksiyonunu kullanmayacağız. Bunun yerine daha basit ve okunaklı olan JSX gösterimini ele alacağız.

JSX, JavaScript'in bütün gücünü kullanacak şekilde tasarlanmıştır. Bu sayede, JSX kodu içerisinde süslü parantezler kullanarak herhangi bir JavaScript kodunu çalıştırabilirsiniz. Her React elemanı bir JavaScript nesnesi olduğu için, herhangi bir değişkene atayabilir veya uygulama içerisinde herhangi bir yere koyabilirsiniz.

Yukarıdaki `ShoppingList` bileşeni, yalnızca `<div />` ve `<li />` gibi HTML bileşenlerini render eder. Fakat uygulamanıza özel React bileşenleri oluşturarak, toplu halde render edilmesini sağlayabilirsiniz. Örneğin sadece `<ShoppingList />` yazarak bütün alışveriş listesinin görüntülenmesini sağlayabilirsiniz. Her React bileşeni birbirinden izole edilmiştir ve birbirinden bağımsız olarak çalışabilir. Bu sayede basit bileşenleri bir araya getirerek karmaşık kullanıcı arayüzleri oluşturabilirsiniz.

## Başlangıç Kodunun İncelenmesi {#inspecting-the-starter-code}

Eğer bu öğreticiyi **tarayıcınızda** takip ediyorsanız, **[başlangıç kodunu](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** yeni sekmede açınız. Eğer öğreticiyi **yerel makinenizde** takip ediyorsanız, bunun yerine proje dizininde yer alan `src/index.js` dosyasını açınız (kurulum](#setup-option-2-local-development-environment) aşamasında bu dosyaya değinmiştik). 

Bu başlangıç kodu, yapacağımız proje ile ilgili bir temel niteliğindedir. tic-tac-toe oyununu programlayarak React öğreniminize yoğunlaşabilmeniz için size CSS kodlarını hazır olarak sunduk. Bu nedenle öğretici boyunca CSS kodu yazmanız gerekli değildir.

Kodu incelediğinizde aşağıdaki 3 React bileşenini fark edeceksiniz:

* Square (Kare)
* Board (Tahta)
* Game (Oyun)

Şu an Square bileşeni yalnızca bir adet `<button>` elemanını, Board ise 9 adet Square bileşenini render ediyor. Game bileşeni ise Board bileşenini ve daha sonra değiştireceğimiz kısa bir metni render ediyor. Henüz uygulama içerisinde etkileşimli bir bileşen yer almıyor.

### Prop'lar Aracılığıyla Veri Aktarımı {#passing-data-through-props}

Şimdi işe koyulalım ve Board bileşeninden Square bileşenimize bazı verileri göndermeyi deneyelim.

Öğretici üzerinde çalışırken ve kopyala / yapıştır yerine, kodu elle yazmanızı şiddetle öneriyoruz. Bu, kas hafızanızı ve daha güçlü bir kavrayış geliştirmenize yardımcı olacaktır.

Board bileşeninin `renderSquare` metodunda, `value` prop'unu Square bileşenine gönderecek şekilde kodu değiştirelim:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

Square bileşeninin `render` metodunu, ilgili değeri göstermesi için `{/* TODO */}` kısmını `{this.props.value}` şekilde değiştirelim:

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

Sonrası: Eğer değişiklikleri doğru bir şekilde uyguladıysanız render işlemi bitiminde her kare içerisinde bir sayı görüyor olmalısınız. 

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Tebrikler! Board bileşeninden Square bileşenine "prop ile veri geçirmeyi" başardınız. React uygulamalarında prop'ların üst bileşenden alt bileşene geçişi sayesinde veri akışının oluşması sağlanır.

### Etkileşimli bir Bileşen Yapımı {#making-an-interactive-component}

Haydi şimdi Square bileşenine tıkladığımızda içini "X" ile dolduralım. 
Öncelikle, Square bileşeninin `render()` fonksiyonundan dönen button etiketini bu şekilde değiştirelim:

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

Şimdi herhangi bir kareye tıkladığımızda tarayıcınızda bir alert mesajı görüntülenecektir. 

>Not:
>
>Daha az kod yazmak ve [`this`'in kafa karıştırıcı kullanımından](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) kaçınmak için, butona tıklanması gibi olay fonksiyonlarında, [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) kullanacağız:
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
>Farkedeceğiniz üzere, `onClick={() => alert('click')}` kısmında butonun `onClick` prop'una *bir fonksiyon* ataması gerçekleştiriyoruz. Bu fonksiyon sadece butona tıkladığımızda çalışıyor. Genellikle bir yazılımcı hatası olarak parantezli ok `() =>` ifadesinin unutulması yerine direkt olarak `onClick={alert('click')}` ifadesinin yazılması gerçekleşebiliyor. Bu durumda tıklama anında gerçekleşmesi istenen olay yanlış bir şekilde çalışarak, bileşen tekrar render edildiğinde gerçekleşmiş oluyor.

Sonraki adımda Square bileşeninin, tıklandığı durumu "hatırlamasını" ve "X" işareti ile doldurulmasını sağlayacağız. Bir şeyleri "hatırlamak" için bileşenler **state** (durum)'u kullanırlar.

React bileşenleri, constructor (yapıcı) fonksiyonlarında `this.state`'e atama yaparak bir state'e sahip olurlar. React bileşeni içerisinde tanımlanan `this.state` özelliğinin erişim belirleyicisi private olarak düşünülmelidir. Çünkü sadece o bileşene özeldir ve diğer bileşenler tarafından direkt olarak erişilemezler.

Şimdi Square'in mevcut değerini `this.state` içerisinde saklayalım ve Square'e tıklandığında değiştirelim. Bunun için öncelikle Square sınfına bir constructor ekleyeceğiz ve içerisinde state'in başlangıç değerlerini oluşturacağız:

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
>[JavaScript class'larında](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), alt sınıfın constructor'ını oluştururken her zaman `super` fonksiyonunu çağırmanız gerekmektedir. Her bir React sınıf bileşeni içerisinde `super(props)` çağrısı ile başlayan bir constructor barındırmalıdır.

Şimdi, Square'e tıklanıldığında, state'indeki `value` değerinin `render` metodunda görüntülenebilmesi için aşağıdaki adımları izleyelim:

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

Square'in `render` metodundaki `onClick` metodundan, `this.setState`'in çağrılmasını sağladık. Bu sayede Square'deki `<button>` elemanına her tıklandığında React, Square bileşenini tekrar render edecektir.  Güncelleme sonrasında Square'in `this.state.value` değerine `'X'` ataması gerçekleşecektir, ve bu sayede oyun tahtasında 'X''i göreceğiz. Herhangi bir Square bileşenine tıklandığı anda içerisinde 'X' görüntülenecektir.

Bir bileşenteki `setState` fonksiyonunu çağırdığınızda, React otomatik olarak içerisindeki alt bileşenleri de güncellemiş oluyor.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Geliştirici Araçları {#developer-tools}

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) ve [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) için React Devtools eklentisi sayesinde herhangi bir React bileşen ağacını, tarayıcınızın geliştirici araçları kısmından görüntüleyebilirsiniz.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools, React bileşenlerinizin state'ini ve prop'larını kontrol etmenize olanak tanır.

React DevTools kurulumundan sonra, sayfa içerisindeki herhangi bir elemana sağ tıklayarak çıkan menüde "İncele"'yi seçerseniz, geliştirici araçlarını açabilir, ve devamında en sağda yer alan React sekmesinde ("⚛️ Components" and "⚛️ Profiler") incelemelerinizi yürütebilirsiniz. Bileşen ağacını incelemek için "⚛️ Components" tabına bakın.

**Eklentinin CodePen ile çalışabilmesi için harici olarak birkaç adım daha vardır:**

1. CodePen'e e-posta adresiniz ile giriş yapınız veya kayıt olunuz (spam'lerin engellenmesi için gereklidir).
2. "Fork" butonuna basınız.
3. "Change View"'a tıklayarak devamında "Debug mode"'u seçiniz.
4. Açılan yeni sekmede, Devtools içerisinde React sekmesi yer alacaktır.

## Oyunun Tamamlanması {#completing-the-game}

Artık tic-tac-toe oyunumuz için temel kod bloklarına sahibiz. Oyunun tamamlanması için tahta üzerinde "X" ve "O"'ların birbiri ardına yerleştirilmesi gerekiyor. Sonrasında oyunda bir kazananın belirlenmesi için değişiklikler yapılmasına ihtiyaç var. 

### State'in Yukarı Taşınması {#lifting-state-up}

Şu an her bir Square bileşeni oyunun state'ini değiştirebiliyor. Kazananı belirleyebilmemiz için, 9 square'in de değerine ihtiyacımız var.

Bunu gerçekleştirmek için Board'un, her bir Square'e, kendi state'inin ne olduğunu sorması gerektiğini düşünebiliriz. Bu yöntem her ne kadar React'te uygulanabilir olsa da, yapmanızı tavsiye etmiyoruz. Çünkü bu şekilde yazılan kod; anlaşılabilirlikten uzak olacak, hataların oluşmasına daha müsait hale gelecek ve kodu refactor etmek istediğimizde bize çok daha büyük zorluklar çıkaracaktır. Bu nedenle, her bir Square sınıfında, kendi state'inin tutulmasının yerine, üst bileşen olan Board bileşeninde oyunun tüm state'ini tutmak en iyi çözümdür. Bunun sonucunda Board bileşeni, her bir Square'e neyi göstermesi gerektiğini prop'lar aracılığıyla aktarır ([daha önce de prop'lar aracılığıyla her bir Square'e bir sayı atamıştık](#passing-data-through-props)).

**Bu örnekteki gibi, birçok alt bileşenden verilerin toplanması veya iki çocuğun birbirleri arasında iletişim kurabilmesi için, üst bileşende paylaşımlı bir state oluşturmanız gerekmektedir. Üst bileşen, prop'lar aracılığıyla state'ini alt bileşenlere aktarabilir. Bu sayede alt bileşenler hem birbirleri arasında hem de üst bileşen ile senkronize hale gelirler.**

React bileşenleri refactor edilirken, state'in yukarı taşınması çok yaygın bir durumdur. Şimdi bu fırsatı değerlendirelim ve işe koyulalım.

Board'a bir constructor ekleyelim ve Board'un başlangıç state'ine bir dizi atayarak içerisinde 9 adet null değerinin bulunmasını sağlayalım. 9 kareye, 9 adet null karşılık gelecektir:

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
```

Daha sonra Board'u doldurdukça, `this.state.squares` dizisinin içeriği aşağıdaki gibi görünmeye başlayacaktır: 

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Board'un `renderSquare` metodu aşağıdaki gibi görünüyor:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Projeye başladığımızda, 0'dan 8'e kadar olan sayıları her bir karede göstermek için, Board'daki `value` prop'unu alt bileşenlere [aktarmıştık](#passing-data-through-props). Bir diğer önceki aşamada ise sayıların yerine [mevcut Square bileşeninin kendi state'i tarafından belirlenen](#making-an-interactive-component) "X" işaretinin almasını sağlamıştık. İşte bu nedenle Square bileşeni, Board tarafından kendisine gönderilen `value` prop'unu göz ardı ediyor.

Şimdi prop aktarma mekanizmasını tekrar kullanacağız. Bunun için her bir Square'e kendi mevcut değerini (`'X'`, `'O'`, or `null`) atamak için Board bileşeninde değişiklik yapalım. Board'un constructor'ında halihazırda tanımladığımız bir `squares` dizisi bulunuyor. Board'un `renderSquare` metodunu, bu diziden verileri alacak şekilde değiştirelim: 

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Artık her bir Square bileşeni `value` prop'unu alacak ve 'X', 'O' veya boş square'ler için `null` değerini edinecektir. 

Şimdi Square'e tıklandığında ne olacağına karar vermemiz gerekiyor. Board bileşeni artık hangi Square'in doldurulacağına karar verebildiğine göre, Square'e tıklandığında Board bileşeninin state'inin güncellenmesini sağlamalıyız. State her bir bileşene private olduğundan dolayı Square üzerinden direkt olarak Board'un state'ini değiştiremeyiz. 

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

Bu değişikliklerin ardından, Square bileşeni aşağıdaki gibi görüntülenecektir:

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

Artık Square'e tıklandığında, Board tarafından aktarılan `onClick` fonksiyonu çağrılacaktır. Bunun nasıl gerçekleştiğini açıklayalım:

1. HTML'de varsayılan olan `<button>` bileşeninin `onClick` prop'u React'e, tıklama olayını oluşturmasını söyler.
2. Butona tıklandığında React, Square'in `render()` metodunda tanımlanan `onClick` fonksiyonunu çalıştırır.
3. Bu fonksiyon ise, `this.props.onClick()` çağrısını gerçekleştirir. Square'in `onClick` prop'u, Board tarafından kendisine aktarılmıştır.
4. Board, Square'e `onClick={() => this.handleClick(i)}` kodunu aktardığı için, Square'e tıklandığında Board'un `this.handleClick(i)` metodu çağrılır.
5. Şu an `handleClick()` metodunu oluşturmadığımız için kodumuz hata verecektir.

>Not
>
>HTML'deki `<button>` elemanı varsayılan bileşen olarak geldiği için, `onClick` fonksiyonu, React için özel bir anlam ihtiva eder. Fakat Square gibi özel olarak yazılan bileşenlerde, prop isimlendirmesi size kalmıştır. Bu nedenle Square'in `onClick` prop'unu veya Board'un `handleClick` metodunu daha farklı şekillerde isimlendirebilirsiniz. Ancak React'teki isimlendirme kuralına uymak gereklidir. Bu kural şu şekildedir: olayları temsil eden prop'lar için `on[Olay]`, olayları handle eden metodlar için ise `handle[Olay]` ifadeleri kullanılır. 

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

Bu değişikliklerden sonra, oyundaki karelere tıkladığımızda içeriğinin "X" ile doluyor olduğunu tekrar görebiliyoruz. Fakat her bir Square'in ayrı ayrı state'e sahip olması yerine, Board bileşeninde tek bir state barındırılmış hale geldi. Bu sayede Board'daki state değiştiğinde tüm Square bileşenleri otomatik olarak tekrar render edilecektir. Bunun yanında, bütün Square'lerin state'inin Board bileşeninde tutulması, gelecekte kazananı belirlememiz için önemli bir yöntem teşkil edecektir.

Square bileşenleri artık state'i direkt olarak değiştirmediği için, değerleri Board bileşeninden alıyorlar ve tıklandıklarında Board'u haberdar ediyorlar. React terminolojisinde Square bileşenleri için **controlled components** (kontrol edilen bileşenler) adı verilir. Çünkü tüm kontrol Board bileşeninin elindedir. 

Fark edeceğiniz gibi, `handleClick` fonksiyonu içerisinde, halihazırda var olan `squares` dizisini direkt olarak değiştirmek yerine, `.slice()`'ı kullanarak bir kopyasını oluşturduk ve bu kopyayı değiştirdik. Şimdi `squares` dizisinin neden bir kopyasını oluşturduğumuza değineceğiz. 

### Neden Immutability Önemlidir {#why-immutability-is-important}

**Immutability**, anlam olarak **mutate** (değişmek) kelimesinin zıttı olan **değişmezlik** kavramını oluşturmaktadır. Önceki kod örneğinde, mevcut `squares` dizisini değiştirmek yerine, dizinin `.slice()` metodu ile bir kopyasının oluşturulması gerektiğini önermiştik. Şimdi ise immutability kavramına ve immutability'i öğrenmenin neden önemli olduğuna değineceğiz.

Genellikle verinin değiştirilmesi için iki farklı yaklaşım vardır. İlk yaklaşımda, verinin değerleri direkt olarak değiştirilerek ilgili verinin değişmesi (mutate) sağlanır. İkinci yaklaşımda ise, ilgili veri **kopyalanarak**, kopya veri üzerinde istenen değişiklikler gerçekleştirildikten sonra, kopya verinin ana veriye atanması işlemidir.

#### Mutasyon Kullanılarak Verinin Değiştirilmesi {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Oyuncu nesnesinin son hali: {score: 2, name: 'Jeff'}
```

#### Mutasyon Kullanılmadan Verinin Değiştirilmesi {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Şu an oyuncu nesnesi değişmedi, fakat oyuncu nesnesinden yeniOyuncu nesnesi oluşturuldu: {score: 2, name: 'Jeff'}

// Object spread syntax proposal'ı kullanarak aşağıdaki gibi de yazabilirsiniz:
// var yeniOyuncu = {...player, score: 2};
```

Sonuç iki durumda da aynı oldu ama direkt olarak veriyi değiştirmeden kopya üzerinde değişiklikler yapmanın aşağıdaki gibi birçok yararı vardır. 

#### Karmaşık Özellikleri Basit Hale Getirir {#complex-features-become-simple}

Immutability sayesinde karmaşık özellikleri kodlamak çok daha kolaydır. Bu öğreticinin sonunda, tic-tac-toe oyunundaki hamlelerin geçmişini incelemeyi ve önceki hamlelere geri dönmeyi sağlayan "zaman yolculuğu" özelliğini kodlayacağız.  Bu özellik sadece oyunlarda değil, birçok uygulamada ileri ve geri alma işlemlerinin kurgulanması için bir gereksinim teşkil edebilir. Direkt olarak veri mutasyonundan kaçınarak, oyunun önceki versiyonlarını oyun geçmişinde bozmadan tutabilir ve daha sonra, önceki bir versiyona geri dönmeyi sağlayabilirsiniz.

#### Değişikliklerin Tespit Edilmesini Kolaylaştırır {#detecting-changes}

Mutable nesneler, direkt olarak değiştirilebildikleri için, değişip/değişmediklerinin tespit edilmesi güçtür. Değişikliğin tespit edilebilmesi için, nesnenin kendisi ile önceki kopyalarının karşılaştırılması ve bütün nesne ağacı üzerinde gezilmesi gereklidir.

Immutable nesnelerdeki değişikliklerin tespit edilmesi daha kolaydır. Immutable nesne kopyalanarak ataması yapıldığı için, ilgili değişken, öncekinden farklı bir değişkene referans edilmişse o halde nesne değişmiştir diyebiliriz.

#### Tekrar Render Etme Zamanını Belirlemek {#determining-when-to-re-render-in-react}

React'te Immutability'nin ana faydası ise, _pure component_'ler (saf/katıksız bileşenler) yapmayı kolaylaştırmasıdır. Immutable veriler, değişiklik yapıldığını kolayca tespit edebilirler. Bu sayede değişiklik olduğunda ilgili bileşenin tekrar render edilmesine yardımcı olurlar.

[Performansın iyileştirmesi](/docs/optimizing-performance.html#examples) yazısında  `shouldComponentUpdate()` fonksiyonunun ne olduğuna ve nasıl *pure component*'leri oluşturabileceğiniz hakkında bilgi edinebilirsiniz.

### Fonksiyon bileşenleri {#function-components}

Square bileşenini nasıl **fonksiyon bileşeni** haline getireceğimize değinelim.

React'te **fonksiyon bileşen**leri, sadece `render` metodunu içerirler. İçerisinde herhangi bir state bulundurmadıkları için daha kolay bir şekilde bileşen oluşturmayı sağlarlar. `React.Component`'tan türetilen bir sınıf bileşeni oluşturmak yerine, sadece `prop`ları girdi olarak alan ve render edilecek kısımları döndüren bir fonksiyon bileşeni yazabiliriz. Fonksiyon bileşenleri kısa bir şekilde yazıldığı için, sizi sınıf bileşenlerine göre daha az yorar.

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

Dikkat edecek olursanız sınıf bileşeninde kullandığımız `this.props` ifadesi yerine sadece `props`'u kullandık.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Not
>
>Square'i, fonksiyon bileşeni olarak değiştirdiğimiz için, uzun olan `onClick={() => this.props.onClick()}` kod parçasını, `onClick={props.onClick}` şeklinde yazarak daha kısa hale getirmiş olduk (her iki taraftaki parantezlerin de gittiğine dikkat ediniz). Sınıf bileşeninde gerçek `this` değerine ulaşmak için arrow (ok) fonksiyonu kullanmıştık. Bunun aksine fonksiyon bileşenlerinde `this` ile uğraşmanıza gerek yoktur.

### Hamle Sırası Değişikliği {#taking-turns}

Şimdi tic-tac-toe oyunumuzdaki hatayı çözmemiz gerekiyor. Oyunun son hali ile sadece "X" eklenebiliyor ama "O" eklenemiyor.

Oyuna varsayılan olarak "X" başlıyor. X'in ilk başlayıp/başlamayacağını Board'un constructor'ındaki başlangıç state'inde belirleyebiliriz:

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

Herhangi bir oyuncu hamlesini yaptığında `xIsNext` (xSonrakiElemanMı) boolean değişkeninin tersini alarak hangi oyuncunun sonraki hamleyi yapacağını belirleyebiliriz. Ayrıca oyunun state'inde bu değişkeni kaydedebiliriz. Board'un `handleClick` fonksiyonunu, `xIsNext` değişkeninin tersini alacak şekilde ilgili değişikliği yapalım:

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

Bu değişiklik ile sayesinde, "X"'ler ve "O"'lar sırasıyla hamle yapabiliyor olacaklar.

Ayrıca oyunda, sıradaki hamlenin kimde olduğunu gösteren metni değiştirmek için, Board'un `render` metodunda "status" değişkenini oluşturabiliriz:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // Kalan kısımlar değişmedi
```

Bu değişikliklerden sonra Board bileşeninin son hali aşağıdaki gibi olacaktır:

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

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Kazananın Belirlenmesi {#declaring-a-winner}

Artık sonraki oyuncuyu görüntüleyebiliyoruz. Bundan sonraki amacımız olarak, oyunun bitmesi durumunu belirtmek için, oyunun kazanıldığını ve artık başka bir hamle kalmadığını göstermemiz gerekiyor. Bunun için, kazanan oyuncuyu belirtmek amacıyla, dosyanın sonuna yardımcı bir fonksiyon ekleyebiliriz:

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

9 kareden oluşan bir dizi göz önüne alındığında, bu fonksiyon kazananı kontrol edecek ve uygun şekilde `'X'`, `'O'` veya `null` döndürecektir.

Board'un `render` fonksiyonunda, `calculateWinner(squares)` fonksiyonunu çağırarak, ilgili oyuncunun kazanma durumunun kontrol edilmesini sağlayabiliriz. Hamleyi yapan oyuncu kazandıysa, "Winner: X" veya "Winner: O" gibi kazananı belirten bir metin görüntüleyebiliriz. Şimdi, Board'un `render` fonksiyonunda yer alan `status` değişkenini aşağıdaki şekilde değiştirelim:

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
      // geriye kalan kısımlar değiştirilmedi
```

Oyunda farkettiyseniz bir oyuncu, diğer oyuncunun işaretlediği karenin üstüne tekrar işaretleme yapabiliyor. Buna ek olarak oyun kazanıldığı durumda da tekrar işaretleme yapmayı engellemeliyiz. Bunun için Board'un `handleClick` fonksiyonunu, belirli koşullarda return edecek şekilde değiştirelim: 

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

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Tebrikler. Artık çalışan bir tic-tac-toe oyununuz var. Ayrıca bu kısma kadar React'in temel özelliklerini de öğrenmiş durumdasınız. Bu nedenle aslında gerçek kazanan *sizsiniz*.

## Zamanda Yolculuğun Eklenmesi {#adding-time-travel}

Son çalışma olarak, oyunda önceki hamlelere gitmeyi sağayacak olan "zamanda geriye gitme" özelliğini ekleyelim.

### Hamlelerin Geçmişinin Saklanması {#storing-a-history-of-moves}

Eğer `squares` dizisine direkt olarak elle müdahale ederek değiştirseydik, zaman yolculuğu özelliğini geliştirmemiz daha zor olurdu.

Ancak, `slice()` fonksiyonu yardımıyla her hamleden sonra `squares` dizisinin kopyasını alarak [immutable olarak değiştirilmesini sağladık](#why-immutability-is-important). Bu durum bize, `squares` dizisinin geçmişteki her halinin kaydedebilmemize, ve halihazırda oluşan hamleler arasında gezinebilmemize imkan sağlamış oldu.

`squares` dizisinin geçmiş hallerini tutabilmek için `history` adında başka bir dizi oluşturabiliriz. `history` dizisi, oyunda ilk hamleden son hamleye kadar tahtanın tüm durumlarını barındırıyor olacaktır: 

```javascript
history = [
  // İlk hamleden öncesi
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // İlk hamleden sonrası
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // İkinci hamleden sonrası
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

Şimdi `history` dizisinin, hangi bileşenin state'inde yer alması gerektiğine karar vereceğiz.

### State'in Yukarı Taşınması (Tekrar) {#lifting-state-up-again}

En üst seviyedeki Game bileşeninin, geçmiş hamlelerin listesini görüntülemesini istiyoruz. Bunun için, Game bileşeninin `history`'e erişebilmesi gerekiyor. Bunu sağlamanın yolu, `history`'i Game bileşenine taşımaktan geçiyor.

`history` state'ini, Game bileşenine yerleştireceğimiz için, bir alt bileşen olan Board'dan `squares` state'ini çıkarmamız gerekiyor. [State'in Yukarı Taşınması](#lifting-state-up) bölümünde Square bileşeninden Board bileşenine taşıma yaptığımız gibi, şimdi de Board bileşeninden Game bileşenine taşıma işlemini gerçekleştirmemiz gerekiyor. Bu sayede Game bileşeni, Board'un verisi üzerinde tamamen kontrolü ele almış olacak ve `history`'deki önceki hamlelerin Board'a işlemesini bildirebilecektir.

Öncelikle, Game bileşeninin constructor'ında, state'in ilk halini oluşturmamız gerekiyor: 

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

Şimdi `squares` dizisini ve `onClick` event'ini, prop'lar aracılığıyla Game bileşeninden, Board bileşenine aktarmamız gerekiyor. Birden fazla Square için Board'da sadece bir tane click handler'ı bulunduğundan dolayı, tıklanan square'in hangisi olduğunun belirlenebilmesi için, `onClick` handler'ına her bir Square'in konumunu iletmemiz gerekiyor. Bu gereksinimler için Board bileşenini aşağıdaki gibi değiştirebilirsiniz: 

* Board'daki `constructor`'ı siliniz.
* Board'un `renderSquare` metodunda `this.state.squares[i]` yerine `this.props.squares[i]` yazınız.
* Board'un `renderSquare` metodunda `this.handleClick(i)` yerine `this.props.onClick(i)` yazınız.

Board'un son hali aşağıdaki gibi olmalıdır:

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

Şimdi de oyun geçmişindeki son girdiyi kullanarak, oyunun son durumunun belirlenmesi ve görüntülenmesi için, Game bileşenindeki `render` fonksiyonunu değiştirelim:

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

Oyunun durumunu Game bileşeni render ettiği için, Board'daki `render` metodundan oyunun durumunu ilgilendiren kısımları çıkarabiliriz:

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

Son olarak, Board bileşenindeki `handleClick` metodunu Game bileşenine taşıyacağız. Ayrıca, Game bileşeni Board'a göre daha farklı oluşturulduğu için, `handleClick` metodunu da uygun şekilde değiştirmemiz gerekiyor. Bunun için Game'in `handleClick` metodu içerisinde, oyundaki hamleleri `history` dizisine ekleyeceğiz:

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

>Not
>
>Bir diziye eleman eklemek için, genellikle dizinin `push()` metodu kullanılır. Fakat `push()`'un aksine `concat()` metodu orijinal diziyi değiştirmez. Bu nedenle immutability'nin sağlanması için `concat()`fonksiyonunun kullanılması önem teşkil etmektedir.

Geldiğimiz noktada, Board bileşeni sadece `renderSquare` ve `render` metotlarına ihtiyaç duyuyor. Oyunun durumu ve `handleClick` metodu ise artık Game bileşeninde yer alıyor.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Geçmiş Hamlelerin Görüntülenmesi {#showing-the-past-moves}

tic-tac-toe oyununun geçmişini kaydedebildiğimize göre, artık oyuncuya geçmiş hamlelerin görüntülenmesini sağlayabiliriz. 

Daha önce React elemanlarının, birinci kalite JavaScript nesneleri olduğunu öğrenmiştik. Bu sayede React elemanlarını, uygulama içerisinde istediğimiz yere aktarabiliyoruz. Bu nedenle JavaScript mantığıyla düşündüğümüzde, React'te birden fazla elemanı render edebilmek için, React elemanlarından oluşan bir diziyi kullabiliriz.

JavaScript'te diziler bir [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (harita) metodu içerirler. Bu metod sayesinde verileri istenilen şekilde haritalayabilirler. Örneğin 1, 2, 3 sayılarının, iki katını alan bir dizinin oluşturulmasını sağlayabilirler:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

`map` metodunu kullanarak oyunun hamle geçmişini, ekranda butonlar halinde görüntülemek için React elemanlarına map edebiliriz. Ve bu butonlara tıklayarak geçmiş hamlelere atlanmasını sağlayabiliriz.

Game'in `render` metodunda yer alan `history` diziyi üzerinde `map` fonksiyonunun çalıştırılmasını sağlayalım: 

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

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

tic-tac-toe oyununun geçmişindeki her bir hamle için, `<button>` içeren bir `<li>` elemanı oluşturuyoruz. Butondaki `onClick` metodu, üzerine tıklandığında `this.jumpTo()` fonksiyonunu çağırıyor fakat, henüz `jumpTo()` metodunu oluşturmadık. Şu an, oyun içerisinde oluşan hamlelerin bir listesini görüyor olmanız lazım. Ayrıca geliştirici araçları konsolunda da aşağıdaki şekilde bir uyarı vermiş olmalıdır:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Üstteki uyarının ne anlama geldiğine bakalım.

### Key seçimi {#picking-a-key}

Bir liste görüntüledğimizde React, render edilen her bir liste elemanı için bazı bilgileri saklar. Listeyi güncellediğimizde ise listede neyin değiştiğine karar vermesi gerekir. Çünkü listenin elemanlarını eklemiş, silmiş, tekrar düzenlemiş veya güncellemiş olabilirirz. 

Örnek olarak bir listenin kodlarının bu şekilde olup:

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

bu koda değiştiğini düşünelim: 

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Bu iki kodu okuyan bir kişi, sayıların değişmesine ek olarak Alexa ile Ben'in sıralamasının değiştiğini,ve araya Claudia'nın eklendiğini farkedecektir. Ancak React bir bilgisayar programıdır, ve amacımızın ne olduğunu kestiremez. React uygulamada listeyi değiştirmemizdeki maksadımızın ne olduğunu bilemeyeceğindan dolayı, her liste eleamanını birbirinden ayırt etmek için, liste elemanlarına bir *key* (anahtar değer) vermemiz gerekir. Bu örnekte, `alexa`, `ben`, `claudia` isimlerini key olarak kullanabilirz. Fakat bu verileri veritabanından getirseydik key olarak; Alexa, Ben, ve Claudia'nın ID'lerini kullanabilirdik:

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

Bir liste tekrar render edileceği zaman React, her liste elemanının key'ini alır ve önceki listenin elemanlarıyla karşılaştırır. Eğer yeni listede, önceki listede bulunmayan bir key varsa, React bir `<li>` bileşeni oluşturur. Eğer önceki listede bulunan bir key, yeni listede bulunmuyorsa React, ilgili `<li>`'yi yok eder. Eğer iki key eşleşiyorsa, eski liste elemanı yeni listeye taşınır. Render etme aşamaları arasında, state'in korunması amacıyla key'ler, her bir bileşenin kimliği hakkında React'e bilgi sunar. Bu sayede eğer bir bileşenin key'i değiştiyse, ilgili bileşen React tarafından yok edilir ve yeni bir state ile tekrar oluşturulur.

React'teki `key` kelimesi özeldir ve React içerisinde rezerve edilmiş kelimeler arasındadır (`ref` de rezerve edilmiştir, fakat daha gelişmiş bir özelliktir). Bir eleman oluşturulduğunda React, elemanın `key` özellğini alır ve direkt olarak return edilen elemanın üzerinde saklar. `key`, `props`'a ait gibi görünse de, `this.props.key` kullanılarak erişilemez. Çünkü `key` özelliği, React'in otomatik olarak hangi bileşeni güncelleyeceğine karar vermesi için tasarlanmıştır. Bu nedenle `props` bir bileşenin, `key`'i hakkında bilgi edinemez.

**Dinamik listeler oluştururken, benzersiz key değerleri atamanız kesinlikle tavsiye edilir.** Eğer uygun key değerine sahip değilseniz, verinizi gözden geçirerek uygun bir id değerin bulmak mantıklı olacaktır. 

Eğer bir key ataması yapmazsanız React, ekranda bir uyarı görüntüler ve varsayılan olarak ilgili liste elemanının index'ini key olarak kullanır. Dizinin indeksini key olarak kullanmak, liste elemanlarına ekleme/çıkarma veya tekrar sıralama yapılırken problem oluşturabilir. `key={i}` ataması yapmak uyarının susturulmasını sağlar fakat dizi indeksleri üzerindeki problemi gidermiş olmaz. Bu nedenle birçok durum için bu kullanım önerilmez. 

Key'lerin uygulama içerisinde global olarak benzersiz olmasına gerek yoktur. Sadece bulunduğu bileşenin içerisinde yer alan diğer list elemanları arasında benzersiz olması yeterlidir. 


### Zaman Yolculuğunun Kodlanması {#implementing-time-travel}

tic-tac-toe oyununun geçmişinde, her bir geçmiş hamlenin benzersiz bir ID'si bulunmaktadır. Bu ID'ler, ardışık hamle sayılarından oluşurlar. Hamleler asla silinmezler, ortadan eklenmezler ve tekrar sıralanmazlar. Bu nedenle key olarak hamle index'inin kullanılması bu durum için uygundur. 

Game bileşenindeki render metoduna  `<li key={move}>` olacak şekilde key'imizi ekleyelim ve bu sayede React'in key hakkındaki uyarısını kaldıralım:

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

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Liste elemanlarındaki butonlara tıklamak, `jumpTo` metodunun bulunmadığı için bir hata oluşturur. `jumpTo`'yu kodlamadan önce, mevcut durumda hangi adımın görüntülendiğini belirtmek için Game bileşeninin state'ine `stepNumber` değişkenini eklememiz gerekiyor.

Game'in `constructor`'ındaki başlangıç state'ine `stepNumber: 0`'ı ekleyelim:

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

Sonra, Game'in içerisinde `stepNumber` değişkenini güncelleyecek olan `jumpTo` metodunu oluşturalım. Ayrıca değiştirdiğimiz `stepNumber` değişkeni çift ise `xIsNext` değişkenine true'yu atayalım: 

```javascript{5-10}
  handleClick(i) {
    // Bu metot değişmedi
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // Bu metod değişmedi
  }
```

Şimdi, oyundaki bir kareye tıklandığında çağrılan `handleClick` metodunda birkaç değişiklik yapalım. 

Artık eklediğimiz `stepNumber` değişkeni, kullanıcının mevcut hamlesini gösteriyor. Yeni bir hamle yaptıktan sonra, `stepNumber` değerini güncellememiz için `this.setState()` çağrısına `stepNumber: history.length`'i eklememiz gerekiyor. Bu sayede, yeni bir hamle yapıldıktan sonra, sürekli aynı hamleyi görüntülemekten dolayı oluşan takılmayı engellemiş oluyoruz.

Ayrıca oyun geçmişine atama yapmak için `this.state.history` yerine `this.state.history.slice(0, this.state.stepNumber + 1)` yazacağız. Bu sayede, "zamanda geriye döndüğümüzde" o noktadan devam edebileceğiz, ve gelecekte yaptığımız hamleler işe yaramaz hale geleceğinden dolayı bu hamlelerin de `slice()` ile oyun tahtasından atılmasını sağlamış olacağız:

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

Son olarak, Game bileşeninin `render` metodunda, her zaman yapılan son hamlenin render edilmesi yerine, `stepNumber`'a göre mevcut seçilen hamlenin render edilmesini sağlayacağız:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Kalan kısımlar değişmedi
```

Oyun geçmişinde herhangi bir adıma tıkladığımızda, tic-tac-toe tahtası o adım bittikten sonraki halini alacak şekilde anında güncellenecektir.

**[Kodun bu kısma kadar olan son halini görüntülemek için tıklayınız](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Sonuç Olarak {#wrapping-up}

Tebrikler, bir tic-tac-toe oyunu kodladınız. Bu oyun:

* Kendisinden de bekleyeceğiniz gibi bir tic-tac-toe oynamanızı sağlar,
* Bir oyuncu kazandığında bunu gösterir, 
* Oyun ilerledikçe oyun geçmişini saklar,
* Oyunculara oyun geçmişini görüntüleyebilmelerini ve oyun tahtasının önceji versiyonlarına gidebilmelerini sağlar.

İyi iş çıkardınız. Umarız artık React'in nasıl çalıştığını öğrenmişsinizdir.

Kodun son haline **[buradan(https://codepen.io/gaearon/pen/gWWZgR?editors=0010)** bakabilirsiniz.

Eğer biraz daha boş vaktiniz varsa ve yeni edindiğiniz React yetenekleriniz ile ilgili pratik yapmak istiyorsanız, aşağıda zorluk derecesine göre sıralanmış işler sayesinde, tic-tac-toe oyununuzu geliştirerek daha ileriye götürebilirsiniz:

1. Oyun geçmişinde, her hamlenin konumunun "(satır,sütun)" formatına göre görüntülenmesi.
2. Oyun geçmişi listesinde tıklanan liste elemanının, seçili olarak işaretlenmesi.
3. Board'daki karelerin, elle hardcoded olarak kodlanmasının yerine iki for döngüsü kullanılarak Board bileşeninin düzenlenmesi.
4. Bir buton eklenerek, tıklandığında oyun geçmişinin artan veya azalan şekilde sıralanmasının sağlanması. 
5. Bir kişi kazandığında, kazanmasına vesile olan 3 karenin renklendirilerek vurgulanması. 
6. Eğer hiç kazanan yoksa, berabere mesajının görüntülenmesi.

Bu öğreticide, React konseptleri olan elemanlar, bileşenler, prop'lar, ve state'e değindik. Bu konular hakkında daha detaylı bir açıklama için [dokümanın geri kalanını](/docs/hello-world.html) inceleyebilirsiniz. Bileşen tanımlama hakkında daha fazla bilgi almak için [`React.Component` API dokümanını](/docs/react-component.html) inceleyebilirsiniz.
