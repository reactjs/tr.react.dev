---
id: react-without-jsx
title: JSX Olmadan React
permalink: docs/react-without-jsx.html
prev: react-without-es6.html
next: reconciliation.html
---

JSX, React'i kullanmak için bir gereksinim değildir. JSX olmadan React'i kullanmak özellikle, geliştirme ortamınızda derleme ayarlarıyla uğraşmak istemediğiniz durumlarda daha uygundur.

Her JSX elementi sadece `React.createElement(component, props, ...children)`'i çağırmak için sözdizimsel şekerdir. Yani, JSX ile yapabileceğiniz her şeyi sadece düz JavaScript ile yapabilirsiniz.

Örneğin, bu kod JSX ile yazılmış:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

JSX kullanmayan bu koda derlenebilir:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

JSX'in JavaScript'e nasıl dönüştürüldüğüne dair daha fazla örnek görmek isterseniz, [çevrimiçi Babel derleyicisi](babel://jsx-simple-example)ni deneyebilirsiniz.

Bileşen bir string, `React.Component`'in alt sınıfı, ya da düz bir fonksiyon olarak sağlanabilir.

Eğer çok fazla `React.createElement` yazmaktan bıktıysanız, genel çözüm bir kısaltmaya atamaktır:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Merhaba Dünya'),
  document.getElementById('root')
);
```

Eğer bu kısaltma halini `React.createElement` için kullanırsanız, JSX olmadan React'i kullanmak daha pratik olabilir.

Alternatif olarak, [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ve [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) gibi `terser` sözdizimi sunan topluluk projelerine göz atabilirsiniz.
