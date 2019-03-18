---
id: composition-vs-inheritance
title: Bileşim vs Kalıtım
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React güçlü bir bileşim modeline sahiptir. Aynı kodu bileşenler arasında tekrar kullanmak için kalıtım yerine bileşim modelini kullanmanızı öneririz.

Bu bölümde, React'te yeni geliştiricilerin kalıtım ile ilgili karşılaştığı birkaç sorunu ele alacağız ve bunları bileşimlerle nasıl çözebileceğimizi göstereceğiz.

## Kapsama {#containment}

Bazı bileşenler önceden alt elemanlarını bilmezler. Bu, özellikle genel "kutuları" temsil eden `Sidebar` veya `Dialog` gibi bileşenler için geçerlidir.

Bu tür bileşenlerin, alt elemanlarını doğrudan çıktılarına geçirmek için özel `children` prop'unu kullanmasını öneririz:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Bu, JSX'i iç içe koyarak diğer bileşenlere geçirmelerini sağlar:


```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Hoşgeldiniz
      </h1>
      <p className="Dialog-message">
        Uzay aracımızı ziyaret ettiğiniz için teşekkür ederiz!
      </p>
    </FancyBorder>
  );
}
```

**[CodePen'de Deneyin](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

`FancyBorder` JSX etiketinin içindeki herhangi bir şey `children` prop'u olarak `FancyBorder` bileşenine geçer. `FancyBorder`, bir `<div>` içinde `{props.children}` render edildiğinden, iletilen öğeler son çıktıda görünür.

Daha az yaygın olsa da, bazen bir bileşende birden fazla "delik" gerekebilir. Bu gibi durumlarda, `children` kullanmak yerine kendi yönteminizi uygulayabilirsiniz:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

`<Contacts />` ve `<Chat />` gibi React elementleri yalnızca nesnelerdir, bu nedenle bunları diğer veriler gibi prop'lar olarak geçirebilirsiniz. Bu yaklaşım size diğer kütüphanelerdeki "slotları" hatırlatabilir ancak React'te prop olarak ne geçeceğiniz konusunda hiçbir sınırlama yoktur.

## Özelleşme {#specialization}

Bazen bileşenleri diğer bileşenlerin "özel durumları" olarak düşünüyoruz. Örneğin, bir `WelcomeDialog` `Dialog`un özel bir durumu olduğunu söyleyebiliriz.

React'te, aynı zamanda daha "spesifik" bir bileşenin daha "jenerik" bir bileşen oluşturduğu ve onu prop gereçleriyle konfigüre ettiği bileşimlerle de elde edilir:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Hoşgeldiniz"
      message="Uzay aracımızı ziyaret ettiğiniz için teşekkür ederiz!" />
  );
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Bileşim, sınıf olarak tanımlanan bileşenler için eşit derecede iyi çalışır:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Keşif Programı"
              message="Size nasıl başvurabiliriz?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Beni kaydet!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## Kalıtım Hakkında Ne Söyleyebiliriz? {#so-what-about-inheritance}

Facebook binlerce bileşende React kullanıyor ve bileşen hiyerarşileri oluştururken önerdiğimiz herhangi bir kullanım durumu bulamadık.

Prop'lar ve bileşimler, bir bileşenin görünüşünü ve davranışını açık ve güvenli bir şekilde özelleştirmek için ihtiyacınız olan tüm esnekliği sunar. Bileşenlerin, ilkel değerler, React öğeleri veya fonksiyonlar dahil olmak üzere isteğe bağlı prop'ları kabul edebileceğini unutmayın.

UI (Kullanıcı Arayüzü) dışı işlevselliği bileşenler arasında yeniden kullanmak istiyorsanız, ayrı bir JavaScript modülüne çıkarmanızı öneririz. Bileşenler onu içe dahil edebilir ve genişletmeden bu fonksiyonu, nesneyi veya bir sınıfı kullanabilir.