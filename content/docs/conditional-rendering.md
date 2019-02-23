---
id: conditional-rendering
title: Koşullu Renderlama
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---
React'te ihtiyacınız olan duruma göre farklı componentler oluşturabilirsiniz. Böylelikle, uygulamanızın durumuna göre, yalnızca componentlerinizin bazılarını renderlayabilirsiniz.

React'te, koşullu renderlama aynı Javascript'te olduğu gibi çalışır. Javascript'teki [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) veya [koşul operatörü](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), size uygulamanızın durumuna göre component renderlama imkanı sunar. Ve React, arayüzde uygun componenti render eder.

Bu iki componenti dikkate alalım:

```js
function SadeceKullanicilarIcin(props) {
  return <h1>Hoş geldiniz!</h1>;
}

function SadeceMisafirlerIcin(props) {
  return <h1>Önce bir giriş yapın...</h1>;
}
```
`Karsilama` adında bir component daha oluşturuyoruz, bu component kullanıcının giriş yapma durumuna göre yukarıda yazdığımız componentleri render edecektir. 

```javascript{3-7,11,12}
function Karsilama(props) {
  const kullaniciGirisYapmis = props.kullaniciGirisYapmis;
  if (kullaniciGirisYapmis) {
    return <SadeceKullanicilarIcin />;
  }
  return <SadeceMisafirlerIcin />;
}

ReactDOM.render(
  // Kodu değiştirerek deneyin: kullaniciGirisYapmis={true}:
  <Karsilama kullaniciGirisYapmis={false} />,
  document.getElementById('root')
);
```

[**CodePen üzerinde deneyin**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Bu örnek uygulama, `kullaniciGirisYapmis` değerine göre farklı bir karşılama yapacak.

### Element Değişkenleri {#element-variables}

HTML elementlerini saklamak için değişkenleri kullanabilirsiniz. Bu size component yaratırken, componentin bir bölümünü koşullu hale getimenize yardım eder. 

İçerisinde `GirisYap` ve `CikisYap` componentlerinin olduğu iki yeni componentimizin olduğunu varsayalım:

```js
function GirisYap(props) {
  return (
    <button onClick={props.onClick}>
      Giriş Yap
    </button>
  );
}

function CikisYap(props) {
  return (
    <button onClick={props.onClick}>
      Çıkış Yap
    </button>
  );
}
```
Bu örnek bloğunda, `GirisKontrol`ü  [stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) yardımıyla oluşturacağız.

`GirisKontrol`, `<GirisYap />` ya da `<CikisYap />` componentlerini kendi state'tine göre render edecek. Ayrıca önceki örnekteki `<Karsilama />` componentini de render edecek.

```javascript{20-25,29,30}
class GirisKontrol extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {kullaniciGirisYapmis: false};
  }

  handleLoginClick() {
    this.setState({kullaniciGirisYapmis: true});
  }

  handleLogoutClick() {
    this.setState({kullaniciGirisYapmis: false});
  }

  render() {
    const kullaniciGirisYapmis = this.state.kullaniciGirisYapmis;
    let button;

    if (kullaniciGirisYapmis) {
      button = <CikisYap onClick={this.handleLogoutClick} />;
    } else {
      button = <GirisYap onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Karsilama kullaniciGirisYapmis={kullaniciGirisYapmis} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <GirisKontrol />,
  document.getElementById('root')
);
```

[**CodePen üzerinde deneyin**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)


Bir değişken tanımlamak ve `ìf` koşulunu kullanarak bir componenti koşullu renderlamak için iyi bir yöntemdir. Bazen zamanlarda daha kısa bir syntax kullanmak isteyebilirsiniz. Aşağıdaki örnekte olduğu gibi JSX'te tek satırda koşullamanın birkaç yolu vardır.

### Mantıksal && Operatörü ile Tek Satırda if {#inline-if-with-logical--operator}

Süslü parantez kullanarak istediğiniz ifadeyi [JSX içine gömebilirsiniz.](/docs/introducing-jsx.html#embedding-expressions-in-jsx) Buna Javascript'teki mantıksal `&&` operatörü de dahildir. Bu componentin içinde koşul vermek için kullanışlı olabilir:

```js{6-10}
function Mailbox(props) {
  const okunmamisMesajlar = props.okunmamisMesajlar;
  return (
    <div>
      <h1>Merhaba!</h1>
      {okunmamisMesajlar.length > 0 &&
        <h2>
          {okunmamisMesajlar.length} adet okunmamış mesajınız var.
        </h2>
      }
    </div>
  );
}

const mesajlar = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox okunmamisMesajlar={mesajlar} />,
  document.getElementById('root')
);
```

[**CodePen üzerinde deneyin**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Bu Javascript üzerinde çalışır çünkü `true && expression` her zaman `expression` kısmını çalıştırır fakat `false && expression` her zaman `false` döndürür.

Bu yüzden, eğer koşulunuz `true` ise, `&&`'den sonra yazacaklarınız çıktı olur. Eğer koşulunuz `false` ise, React onu görmezden gelip, geçececektir.

### Koşul Operatörü ile Tek Satırda if-else {#inline-if-else-with-conditional-operator}

Koşullu renderlama için farklı bir yöntem ise Javascript koşul operatörünü [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) kullanmaktır.

Bu örnekte, yazının yalnızca bir kısmını koşullayacağız

```javascript{5}
render() {
  const kullaniciGirisYapmis = this.state.kullaniciGirisYapmis;
  return (
    <div>
      Bu kullanıcı şuan <b>{kullaniciGirisYapmis ? 'çevrimiçi' : 'çevrimdışı'}</b>.
    </div>
  );
}
```

Neler olduğu daha az belirgin olsa da, daha büyük ifadeler için de kullanılabilir:

```js{5,7,9}
render() {
  const kullaniciGirisYapmis = this.state.kullaniciGirisYapmis;
  return (
    <div>
      {kullaniciGirisYapmis ? (
        <CikisYap onClick={this.handleLogoutClick} />
      ) : (
        <GirisYap onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Javascript'te olduğu gibi, hangisinin daha iyi bir yaklaşım olduğu, size ve sizin takımınıza kalmıştır. Bu arada, ne zaman koşullandırma çok karmaşık bir hal almaya başlarsa [extract a component](/docs/components-and-props.html#extracting-components) yapmanın zamanı gelmiştir.

### Component'in Renderlanmasını Engellemek {#preventing-component-from-rendering}

Nadir durumlarda, renderlanmış bir componentin kendini gizlemesini isteyebilirsiniz. Böyle durumlarda `null` return edin.

Bu örnekle, `UyariMesaji` componenti kendisinin `uyariGoster` özelliğine göre kendini render edecektir. Eğer bu özellik `false` olursa, component render edilmeyecek.

```javascript{2-4,29}
function UyariMesaji(props) {
  if (!props.uyariGoster) {
    return null;
  }

  return (
    <div className="warning">
      Bu konuda seni uyarıyorum!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uyariyiGoster: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      uyariyiGoster: !state.uyariyiGoster
    }));
  }

  render() {
    return (
      <div>
        <UyariMesaji uyariGoster={this.state.uyariyiGoster} />
        <button onClick={this.handleToggleClick}>
          {this.state.uyariyiGoster ? 'Gizle' : 'Göster'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**CodePen üzerinde deneyin**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Bir componentin `null` döndürmesi yaşam döngüsü metodlarının çalışmasını engellemez. Örneğin `componentDidUpdate` gerektiği zaman çalışmaya devam edecek. 
