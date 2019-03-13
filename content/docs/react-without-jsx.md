---
id: react-without-jsx
title: JSX Olmadan React
permalink: docs/react-without-jsx.html
---

JSX, React'i kullanmak için bir gereklilik değildir. JSX olmadan React'i kullanmak geliştirme ortamınızda özellikle derleme ayarlamak istemediğinizde uygundur.

Her JSX elementi sadece `React.createElement(component, props, ...children)`'i çağırmak için sözdizimsel şekerdir. Yani, JSX ile yapabileceğiniz her şeyi sadece düz JavaScript ile yapabilirsiniz.

Örneğin, bu kod JSX ile yazılmış:

```js
class Merhaba extends React.Component {
  render() {
    return <div>Merhaba {this.props.neye}</div>;
  }
}

ReactDOM.render(
  <Merhaba neye="Dünya" />,
  document.getElementById('root')
);
```

JSX kullanmayan bu koda derlenebilir:

```js
class Merhaba extends React.Component {
  render() {
    return React.createElement('div', null, `Merhaba ${this.props.neye}`);
  }
}

ReactDOM.render(
  React.createElement(Merhaba, {neye: 'Dünya'}, null),
  document.getElementById('root')
);
```

JSX'in JavaScript'e nasıl dönüştürüldüğüne dair daha fazla örnek görmek isterseniz, [çevrimiçi Babel derleyicisi](babel://jsx-simple-example)ni deneyebilirsiniz.

Bileşen bir dize olarak veya `React.Component`'in alt sınıfı olarak veya durumsuz bileşenler için düz bir fonksiyon olarak sağlanabilir.

Eğer çok fazla `React.createElement` yazmaktan bıktıysanız, genel çözüm bir kısaltmaya atamaktır:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Merhaba Dünya'),
  document.getElementById('root')
);
```

Eğer bu kısaltma halini `React.createElement` için kullanırsanız, JSX olmadan React'i kullanmak daha pratik olabilir.

Alternatif olarak, [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ve [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) gibi terser sözdizimi sunan topluluk projelerine göz atabilirsiniz.