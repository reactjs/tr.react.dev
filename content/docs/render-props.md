---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

["Render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) tabiri, React bileşenleri arasında kod paylaşımının; değerleri birer fonksiyon olan prop’lar kullanılarak yapılmasına denir.

Render prop’lu bir bileşen, prop olarak bir React elemanı döndüren bir fonksyion alır ve kendi render mantığını yürütmek yerine bu fonksiyonu çağırır.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Render prop’ları kullanan kütüphaneler arasında [React Router](https://reacttraining.com/react-router/web/api/Route/render-func) ve [Downshift](https://github.com/paypal/downshift) de var.

Bu dokümanda neden render prop’ların kullanışlı olduğunu tartışıp, bunları nasıl yazabileceğiniz hakkında konuşacağız.

## Render Propları uygulama genelini etkileyen özellikler için Kullanın {#use-render-props-for-cross-cutting-concerns}

Bileşenler React'te yeniden kod kullanımının temel birimidir. Ama state’in nasıl paylaşılacağı veya bir bileşenin başka bir bileşene encapsulate ettiği davranışta hangi state’e ihtiyaç duyulacağı her zaman malum olmayabilir. 

Örneğin, farenin bir web uygulamasındaki posizyonunu takip eden aşağıdaki bileşen:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Fare ekranda hareket ettikçe, bileşen (x,y) koordinatlarını `<p>` içerisinde gösterir.

Şimdi soru şu: Bu davranışı başka bir bileşen içerisinde nasıl tekrar kullanabiliriz? Diğer bir deyişle, Başka bir bileşen farenin pozisyonunu bilmek isterse bu davranışı rahatça bu bileşenle paylaşmak için encapsulate edebilir miyiz?

Bileşenler React'te yeniden kod kullanımının temel birimi olduğundan, istediğimiz davranışı başka bir yerde kullanabilmemiz için `<Mouse>` bileşeninin kodunu biraz değiştirmeyi deneyelim.

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...but how do we render something other than a <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </div>
    );
  }
}
```

Artık `mousemove` olayını ve farenin (x, y) pozisyonunu bulunduran tüm davranışlar `<Mouse>` bileşeni tarafından encapsulate ediliyor, fakat hala tam anlamıyla yeniden kullanılabilir değil.

Örneğin; bir kedi resminin, faremizi ekranda kovalamasını render eden bir `<Cat>` bileşenimiz olduğunu düşünelim.  Bu bileşene farenin koordinatlarını bilmesi ve resmin ekrandaki pozisyonunu ayarlaması için `<Cat mouse={{ x, y }}>` prop’unu kullanabiliriz.

İlk bakışta, <Cat> bileşenini <Mouse> bileşeninin *render metodu içinde* böyle render etmeyi deneyebilirsiniz:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          We could just swap out the <p> for a <Cat> here ... but then
          we would need to create a separate <MouseWithSomethingElse>
          component every time we need to use it, so <MouseWithCat>
          isn't really reusable yet.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Bu yaklaşım bize spesifik durumda çalışacaktır, ama hala hedefimiz olan tam anlamıyla istediğimiz davranışı tekrar kullanılabilir bir halde encapsulate edemedik. Artık ne zaman farenin konumunu başka bir durum için almak istersek, farklı bir bileşen(örn. `<MouseWithCat>`) yaratıp o duruma özel bir şekilde render etmesini sağlamalıyız.

İşte tam da burda devreye render propları giriyor: Doğrudan `<Cat>` bileşenini`<Mouse>` bileşeni içine gömmekten ve render olmuş çıktısını değiştirmektense, `<Mouse>` bileşenine bir fonksiyon prop’u verip dinamik olarak ne render edeceğine karar vermesini sağlayabiliriz-kısacası bir render prop.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Artık `<Mouse>`  bileşenini kopyalayıp, `render` metodunda başka bir şeyleri spesifik durumlar için doğrudan kodlamak yerine bir `render` prop veriyoruz bu sayede `<Mouse>` dinamik olarak ne render edeceğini anlayabiliyor.

Daha anlaşılır bir şekilde söylemek gerekirse; **bir render prop, bir bileşenin ne render etmesi gerektiğini anlaması için kullandığı bir fonksiyon prop’udur.** 

Bu teknik paylaşmamız gereken davranışın son derece portatif olmasını sağlar.Bu davranışı almak için, bir `<Mouse>` bileşeni render edin ve `render` prop olarak, farenin o anki (x,y) değerleriyle ne render etmesi gerektiğini verin.

Render prop’lar hakkında not edilmesi gereken başka bir ilginç şey ise çoğu üst-seviye bileşenler normal bir bileşeni render prop’la kullanarak hayata geçirilebilir. Örneğin; `<Mouse>` bileşeni yerine bir üst seviye bileşen `withMouse` kullanmak isterseniz, normal bir `<Mouse>` bileşenine render prop vererek bunu kolayca yapabilirsiniz:


```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Yani render prop kullanmak iki yapının da kullanılabilmesini mümkün kılar.

## `Render`’dan başka prop’ları kullanmak {#using-props-other-than-render}

Sırf bu teknik “render propları” diye adlandrıldığı için prop isimlerini sadece *render ismiyle* kullanmanıza gerek olmadığını bilmenizde yarar var.Aslında, [bir bileşen tarafından ne render edileceğini bilmek için kullanalın ve fonksyion olan *herhangi* bir prop teknik olarak bir “render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Yukarıdaki örnekler `render`’ı kullanıyor olabilir, ama aynı kolaylıkta `children` prop’u olarak da kullanbiliriz.

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

Ve hatırlayınız, `children` prop’unun JSX elemanınızın özellikler listesinde adlandırılmasına gerek yok. Onun yerine, direkt olarak elemanın *içine* koyabilirsiniz!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Bu tekniğin [react-motion](https://github.com/chenglou/react-motion) API’ında kullanıldığını göreceksiniz.

Bu teknik biraz sıra dışı olduğundan, böyle bir API dizayn ederken muhtemelen `children`’ın bir fonksiyon olduğunu `propTypes` bölümünde şu şekilde belirtmek isteyeceksiniz.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Uyarılar {#caveats}

### Render prop’ları React.PureComponent’le kullanırken dikkatli olun {#be-careful-when-using-render-props-with-reactpurecomponent}

Fonksiyonu `render` metodu içinde yaratırsanız render prop kullanmak, [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) kullanmaktan gelen avantajı yok edebilir. Bunun nedeni ise yüzeysel prop karşılaştırmasının yeni proplar için her zaman `false` döndürecek olmasıdır ve her `render` bu durumda render prop için yeni bir değer üretecektir.

Örneğin; yukarıdaki `<Mouse>` örneğimizle devam edersek, eğer `Mouse` `React.Component` yerine `React.PureComponent`’ten türemiş olsaydı, örneğimiz şu şekilde olacaktı:

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Bu örnekte `<MouseTracker>` bileşeni her render ettiğinde, bileşen `<Mouse render>` prop’u olarak yeni bir değer üretecek bu da `<Mouse>` bileşenin `React.PureComponent`’ten türemesinin efektini yok edecektir.

Bu problemi ortadan kaldırmak için, bazen prop’u bir nesne metoduymuş gibi tanımlayabilirsiniz, şu şekilde:

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Prop’u statik olarak tanımlayamadığınız durumlarda (örn. Bileşenin prop’larını ve/veya state’ini gizlemeniz gerektiği durumlarda) ise `<Mouse>` `React.Component`’ten türemelidir.
