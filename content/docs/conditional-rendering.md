---
id: conditional-rendering
title: Koşullu Renderlama
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---
React'te, ihtiyacınız olan duruma göre farklı bileşenler oluşturabilirsiniz. Böylelikle, uygulamanızın durumuna göre, bileşenlerinizin yalnızca  bazılarını render edebilirsiniz.

React'te, koşullu renderlama aynı Javascript'te olduğu gibi çalışır. Javascript'teki [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) veya [koşul operatörü](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), size uygulamanızın durumuna göre bileşen  renderlama imkanı sunar. Ve React, arayüzde uygun bileşeni render eder.

Bu iki bileşeni dikkate alalım:

```js
function UserGreeting(props) {
  return <h1>Hoş geldiniz!</h1>;
}

function GuestGreeting(props) {
  return <h1>Lütfen kayıt olun</h1>;
}
```

`Greeting` adında bir bileşen daha oluşturuyoruz. Bu bileşen, kullanıcının giriş yapma durumuna göre yukarıda yazdığımız bileşenleri gösterecek. 

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Kodu değiştirerek deneyin: isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Codepen'de Deneyin**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Bu örnek uygulama, `isLoggedIn` değerine göre farklı bir karşılama yapacak.

### Eleman Değişkenleri {#element-variables}

HTML elemanlarını saklamak için değişkenleri kullanabilirsiniz. Bu size, bileşen yaratırken, bileşenin bir bölümünü koşullu hale getirmenize yardım eder. 

Aşağıdaki iki yeni bileşenin `Giriş` ve `Çıkış` butonlarını temsil ettiğini varsayalım: 

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Giriş Yap
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Çıkış Yap
    </button>
  );
}
```
Bu örnek bloğunda, `LoginControl`ü  [stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) yardımıyla oluşturacağız.

`LoginControl`, o anki durumuna göre `<LoginButton />` ya da `<LogoutButton />` bileşenlerininden birini render edecek. Ayrıca, önceki örnekteki `<Greeting />` bileşenini de render edecek.

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Bir değişken tanımlamak ve `if` ifadesini kullanmak, bir bileşeni koşullu olarak render etmek için iyi bir yol olsa da, bazen daha kısa bir sözdizimi kullanmak isteyebilirsiniz. JSX'te satir içi koşullama yapmanın, aşağıda açıklanan, birkaç yolu vardır.

### Mantıksal && Operatörü ile Tek Satırda if {#inline-if-with-logical--operator}

Süslü parantez kullanarak istediğiniz ifadeyi [JSX içine gömebilirsiniz.](/docs/introducing-jsx.html#embedding-expressions-in-jsx) Buna Javascript'teki mantıksal `&&` operatörü de dahildir. Bu bileşenin içinde koşul vermek için kullanışlı olabilir:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Merhaba!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          {unreadMessages.length} adet okunmamış mesajınız var.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Bu kod Javascript'te çalışır çünkü `true && expression` her zaman `expression` kısmını çalıştırır fakat `false && expression` her zaman `false` döndürür.

Bu yüzden, eğer koşulunuz `true` ise, `&&`'den sonra yazacaklarınız çıktı olur. Eğer koşulunuz `false` ise, React onu görmezden gelip, atlayacaktir.

### Koşul Operatörü ile Tek Satırda if-else {#inline-if-else-with-conditional-operator}

Koşullu renderlama için farklı bir yöntem ise Javascript koşul operatörünü [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) kullanmaktır.

Bu örnekte, yazının yalnızca bir kısmını koşullayacağız

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      Bu kullanıcı şuan <b>{isLoggedIn ? 'çevrimiçi' : 'çevrimdışı'}</b>.
    </div>
  );
}
```

Her ne kadar neler olduğu daha az belirgin olsa da, daha büyük ifadeler için de kullanılabilir:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Javascript'te olduğu gibi, hangisinin daha iyi bir yaklaşım olduğu, size ve sizin takımınıza kalmıştır. Bu arada, ne zaman koşullandırma çok karmaşık bir hal almaya başlarsa [bir bileşen çıkarmanın](/docs/components-and-props.html#extracting-components) zamanı gelmiştir.

### Bileşenin Render Edilmesini Engellemek {#preventing-component-from-rendering}

Nadir durumlarda, render edilmiş bir bileşenin kendisini gizlemesini isteyebilirsiniz. Böyle durumlarda `null` return edin.

Bu örnekte `WarningBanner` bileşeni, `warn` prop'una göre kendini render edecektir. Eğer bu özellik `false` olursa, bileşen render edilmeyecektir.

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
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
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Gizle' : 'Göster'}
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

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Bir bileşenin, `render` metodundan `null` döndürmesi yaşam döngüsü metotlarının çalışmasını engellemez. Örneğin `componentDidUpdate` gerektiği zaman çalışmaya devam edecektir.
