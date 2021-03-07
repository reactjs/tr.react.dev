---
id: integrating-with-other-libraries
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React, herhangi bir web uygulamasında kullanılabilir. Diğer uygulamalara yerleştirilebilir ve biraz özenle React'e başka uygulamalar da yerleştirilebilir. Bu rehber, [jQuery](https://jquery.com/) ve [Backbone](https://backbonejs.org/) ile bütünleşmeye odaklanarak çok yaygın kullanım örneklerinin bazılarını inceleyecek, ancak aynı fikirler, bileşenleri varolan herhangi bir kodla bütünleştirmek için de uygulanabilir.

## DOM Manipülasyon Eklentileri ile Bütünleşmek {#integrating-with-dom-manipulation-plugins}

React, React dışında DOM'a yapılan değişikliklerin farkında değildir. Güncellemeleri kendi iç temsiline göre belirler, ve eğer aynı DOM düğümleri başka bir kütüphane tarafından değiştirilmişse, React şaşırır ve bunu kurtarmanın yolu yoktur.

Bu demek değildir ki, o imkansızdır veya DOM'u etkileyen diğer yollarla React'i birleştirmek gerekli olarak zor olsa bile, her birinin ne yaptığını dikkate almanız yeterlidir.

Çakışmaları önlemenin en kolay yolu, React bileşeninin güncellenmesini önlemektir. Bunu, boş bir `<div />` gibi React'in güncellemek için bir nedeni olmayan öğelerini oluşturarak yapabilirsiniz.

### Soruna Nasıl Yaklaşılmalı {#how-to-approach-the-problem}

Bunu göstermek için, genel bir jQuery eklentisi için bir sarmalayıcı çizelim.

Kök DOM öğesine bir [ref](/docs/refs-and-the-dom.html) ekleyeceğiz. `componentDidMount` içinde, jQuery eklentisine iletebilmemiz için ona bir referans alacağız.

Monte edildikten sonra, React'in DOM'a dokunmasını önlemek icin, `render()` metodundan boş bir `<div />` döndüreceğiz. `<div />` öğesinin herhangi bir özelliği veya alt öğesi yoktur, bu yüzden React'in onu güncellemek için bir nedeni yoktur, DOM'un bu bölümünü yönetmek için jQuery eklentisi serbest bırakılır:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Dikkate alın ki, biz hem `componentDidMount` hem de `componentWillUnmount` [yaşam döngüsü metotları](/docs/react-component.html#the-component-lifecycle)'nı tanımladık. Birçok jQuery eklentisi, olay dinleyicilerini DOM'a ekler, bu nedenle onları `componentWillUnmount`'tan ayırmak önemlidir. Eğer eklenti düzeltme için bir metot sağlamıyorsa, muhtemelen bellek sızıntılarını önlemek için eklentinin kaydettiği herhangi bir olay dinleyicisini kaldırmayı hatırlayarak, kendi önleminizi almak zorunda olacaksınız. 

###  jQuery Chosen Eklentisi ile Bütünleşmek {#integrating-with-jquery-chosen-plugin}

Bu kavramların daha kesin bir örneği için, `<select>` girdilerini genişleten [Chosen](https://harvesthq.github.io/chosen/) eklentisi için küçük bir sarmalayıcı yazalım.

>**Not:**
>
>Bunun mümkün olması demek, React uygulamaları için en iyi yaklaşım olduğu anlamına gelmez. Yapabildiğiniz zaman, sizi React bileşenlerini kullanmanız için cesaretlendiriyoruz. React uygulamalarında, React bileşenlerini yeniden kullanmak daha kolaydır, ve sıklıkla davranışları ve görünümleri üzerinde daha fazla kontrol sağlar.

Öncelikle, `Chosen`'ın DOM'a ne yaptığına bakalım.

Eğer bunu bir `<select>` DOM ​​düğümünde çağırırsanız, orijinal DOM düğümünün niteliklerini okur, bir satır içi stil ile onu saklar, ve hemen `<select>`'ten sonra, kendi görsel temsili ile ayrı bir DOM düğümü ekler. Ardından, değişiklikleri bize bildirmek için jQuery olaylarını tetikler.

Diyelim ki, bu `<Chosen>` sarmalayıcısı, React bileşenimizle uğraştığımız API'dır:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Basit olması için onu [kontrolsüz bileşen](/docs/uncontrolled-components.html) olarak uygulayacağız.

İlk önce, bir `<div>` içine sarılmış `<select>`'i döndürdüğümüz yerde, `render()` metoduyla boş bir bileşen oluşturacağız:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Fazladan bir `<div>` içinde `<select>`'i nasıl sardığımıza dikkat edin. Bu gereklidir, çünkü Chosen, ona geçtiğimiz `<select>` düğümünün hemen arkasına başka bir DOM öğesi ekleyecektir. Ancak, React söz konusu olduğunda, `<div>`'in her zaman yalnızca tek bir alt öğesi vardır. Bu, React güncellemelerinin, Chosen tarafından eklenmiş fazladan DOM düğümüyle çakışmamasını sağlama şeklimizdir. Önemlidir ki, eğer DOM'u React akışının dışında değiştirirseniz, React'in bu DOM düğümlerine dokunmak için bir nedeni olmadığından emin olmalısınız.

Ardından, yaşam döngüsü metodunu uygulayacağız. `componentDidMount`'de `<select>` düğümüne ref ile Chosen'i başlatmamız ve `componentWillUnmount`'da parçalamamız gerek:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Dikkat edin ki, React `this.el` alanına özel bir anlam atamaz. O sadece, öncesinde bu alana `render()` metodundaki bir `ref`'den atama yapılmış olduğunda çalışır:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Bu, bileşenimizin oluşturulması için yeterlidir, ama değer değişiklikleri hakkında da bilgilendirilmek istiyoruz. Bunu yapmak için, Chosen tarafından yönetilen `<select>` üzerindeki jQuery `change` olayına abone olacağız.

`this.props.onChange`'i doğrudan Chosen'a geçmeyecegiz, çünkü bileşenin prop'u zamanla değişebilir, ve bu olay yöneticisini içerir. Bunun yerine, `this.props.onChange`'i çağıran bir `handleChange()` metodu tanımlayacağız, ve onu jQuery `change` olayına abone olacağız:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Son olarak, yapılması gereken bir şey daha var. React'te, props zaman içinde değişir. Örneğin, ana bileşenin durumu değişirse, `<Chosen>` bileşeni, farklı alt öğeler alabilir. Bu, React'in DOM'u bizim için yönetmesine izin vermediğimizden, bütünleşme noktalarında, prop güncellemelerine yanıt olarak DOM'u manuel olarak güncellememizin önemli olduğu anlamına gelir. 

Chosen'in dökümantasyonu, orijinal DOM öğesine yapılan değişiklikler hakkında, jQuery `trigger ()` API'ını kullanabileceğimizi önerir. React'in `<select>` içindeki `this.props.children`'i güncellemesine izin vereceğiz, ancak Chosen'ı alt öğeler listesindeki değişiklikler hakkında bilgilendiren bir `componentDidUpdate()`'e yaşam döngüsü yöntemini de ekleyeceğiz: 

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Bu şekilde Chosen, React tarafından yönetilen `<select>` alt öğeleri değiştiğinde DOM öğesini güncelleyeceğini bilecektir.

 `Chosen` bileşeninin tam uygulanması şu şekildedir:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrating with Other View Libraries {#integrating-with-other-view-libraries}

React can be embedded into other applications thanks to the flexibility of [`ReactDOM.render()`](/docs/react-dom.html#render).

Although React is commonly used at startup to load a single root React component into the DOM, `ReactDOM.render()` can also be called multiple times for independent parts of the UI which can be as small as a button, or as large as an app.

In fact, this is exactly how React is used at Facebook. This lets us write applications in React piece by piece, and combine them with our existing server-generated templates and other client-side code.

### Replacing String-Based Rendering with React {#replacing-string-based-rendering-with-react}

A common pattern in older web applications is to describe chunks of the DOM as a string and insert it into the DOM like so: `$el.html(htmlString)`. These points in a codebase are perfect for introducing React. Just rewrite the string based rendering as a React component.

So the following jQuery implementation...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...could be rewritten using a React component:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

From here you could start moving more logic into the component and begin adopting more common React practices. For example, in components it is best not to rely on IDs because the same component can be rendered multiple times. Instead, we will use the [React event system](/docs/handling-events.html) and register the click handler directly on the React `<button>` element:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

You can have as many such isolated components as you like, and use `ReactDOM.render()` to render them to different DOM containers. Gradually, as you convert more of your app to React, you will be able to combine them into larger components, and move some of the `ReactDOM.render()` calls up the hierarchy.

### Embedding React in a Backbone View {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) views typically use HTML strings, or string-producing template functions, to create the content for their DOM elements. This process, too, can be replaced with rendering a React component.

Below, we will create a Backbone view called `ParagraphView`. It will override Backbone's `render()` function to render a React `<Paragraph>` component into the DOM element provided by Backbone (`this.el`). Here, too, we are using [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

It is important that we also call `ReactDOM.unmountComponentAtNode()` in the `remove` method so that React unregisters event handlers and other resources associated with the component tree when it is detached.

When a component is removed *from within* a React tree, the cleanup is performed automatically, but because we are removing the entire tree by hand, we must call this method.

## Integrating with Model Layers {#integrating-with-model-layers}

While it is generally recommended to use unidirectional data flow such as [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), or [Redux](https://redux.js.org/), React components can use a model layer from other frameworks and libraries.

### Using Backbone Models in React Components {#using-backbone-models-in-react-components}

The simplest way to consume [Backbone](https://backbonejs.org/) models and collections from a React component is to listen to the various change events and manually force an update.

Components responsible for rendering models would listen to `'change'` events, while components responsible for rendering collections would listen for `'add'` and `'remove'` events. In both cases, call [`this.forceUpdate()`](/docs/react-component.html#forceupdate) to rerender the component with the new data.

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracting Data from Backbone Models {#extracting-data-from-backbone-models}

The approach above requires your React components to be aware of the Backbone models and collections. If you later plan to migrate to another data management solution, you might want to concentrate the knowledge about Backbone in as few parts of the code as possible.

One solution to this is to extract the model's attributes as plain data whenever it changes, and keep this logic in a single place. The following is [a higher-order component](/docs/higher-order-components.html) that extracts all attributes of a Backbone model into state, passing the data to the wrapped component.

This way, only the higher-order component needs to know about Backbone model internals, and most components in the app can stay agnostic of Backbone.

In the example below, we will make a copy of the model's attributes to form the initial state. We subscribe to the `change` event (and unsubscribe on unmounting), and when it happens, we update the state with the model's current attributes. Finally, we make sure that if the `model` prop itself changes, we don't forget to unsubscribe from the old model, and subscribe to the new one.

Note that this example is not meant to be exhaustive with regards to working with Backbone, but it should give you an idea for how to approach this in a generic way:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

To demonstrate how to use it, we will connect a `NameInput` React component to a Backbone model, and update its `firstName` attribute every time the input changes:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

This technique is not limited to Backbone. You can use React with any model library by subscribing to its changes in the lifecycle methods and, optionally, copying the data into the local React state.
