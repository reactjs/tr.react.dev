---
title: React Element Factories and JSX Uyarısı
layout: single
permalink: warnings/legacy-factories.html
---

Muhtemelen buraya kodunuz, bileşeninizi sade bir fonksiyon olarak çağırdığı için geldiniz. Bu artık kullanımdan kaldırıldı:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // UYARI
}
```

## JSX {#jsx}

React bileşenleri artık bu şekilde direkt olarak çağırılamaz. Bunun yerine [JSX kullanabilirsiniz](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## JSX Olmadan {#without-jsx}

Eğer JSX kullanmak istemiyorsanız ya da kullanamıyorsanız bileşeninizi çağırmadan önce onu bir [`createFactory`(/docs/react-api.html#createfactory)] ile sarmallamanız gerekiyor:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Eğer halihazırda çok fazla fonksiyon çağrınız varsa bu onları yükseltmek için kolay bir yoldur.

## JSX Olmadan dinamik bileşenler {#dynamic-components-without-jsx}

Eğer bir bileşen sınıfını dinamik bir kaynaktan alıyorsanız, anlık olarak çalıştırdığınız için bir Factory oluşturmak gereksiz olabilir. Bunun yerine sadece elemanınızı satır içi şeklinde oluşturabilirsiniz:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Daha derin detay {#in-depth}

[Bu değişikliği NEDEN yaptığımıza dair daha fazla detayı okuyun.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
