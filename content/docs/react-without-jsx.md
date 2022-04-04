---
id: react-without-jsx
title: JSX Olmadan React
permalink: docs/react-without-jsx.html
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />);
```

JSX kullanmayan bu koda derlenebilir:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'World'}, null));
```

JSX'in JavaScript'e nasıl dönüştürüldüğüne dair daha fazla örnek görmek isterseniz, [çevrimiçi Babel derleyicisi](babel://jsx-simple-example)ni deneyebilirsiniz.

Bileşen bir string, `React.Component`'in alt sınıfı, ya da düz bir fonksiyon olarak sağlanabilir.

Eğer çok fazla `React.createElement` yazmaktan bıktıysanız, genel çözüm bir kısaltmaya atamaktır:

```js
const e = React.createElement;

<<<<<<< HEAD
ReactDOM.render(
  e('div', null, 'Merhaba Dünya'),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
```

Eğer bu kısaltma halini `React.createElement` için kullanırsanız, JSX olmadan React'i kullanmak daha pratik olabilir.

Alternatif olarak, [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ve [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) gibi `terser` sözdizimi sunan topluluk projelerine göz atabilirsiniz.
