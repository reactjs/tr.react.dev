---
id: create-fragment
title: Anahtarlı Fragment'ler
permalink: docs/create-fragment.html
layout: docs
category: Add-Ons
---

> Note:
>
> `React.addons` giriş noktası React v15.5 sürümünden itibaren kullanımdan kaldırılmıştır. Şu anda Fragment'ler için [burada](/docs/fragments.html) okuyabileceğiniz birinci sınıf desteğe sahibiz.

## Import etmek {#importing}

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

## Genel Bakış {#overview}

Çoğu durumda, `render` fonksiyonundan döndürdüğünüz öğelerdeki anahtarları belirlemek için `key` prop'unu kullanabilirsiniz. Fakat, bu bir durumda çalışmaz: yeniden sıralamak zorunda olduğunuz iki çocuk grubunuz varsa, bir sarmalayıcı öğe eklemeden her gruba anahtar koymanın yolu yoktur.

Yani, şu şekilde bir bileşeniniz var ise:

```js
function Swapper(props) {
  let children;
  if (props.swapped) {
    children = [props.rightChildren, props.leftChildren];
  } else {
    children = [props.leftChildren, props.rightChildren];
  }
  return <div>{children}</div>;
}
```

İki grup çocukta da herhangi bir işaretlenmiş anahtar olmadığı için, her `swapped` prop'unu değiştirdiğinizde çocuk çıkarılıp yeniden eklenecektir.

Bu sorunu çözmek için, çocuk gruplarına `createFragment` eklentisini kullanarak anahtarlar verebilirsiniz.

#### `Array<ReactNode> createFragment(object children)` {#arrayreactnode-createfragmentobject-children}

Diziler oluşturmak yerine, şunu yazıyoruz:

```javascript
import createFragment from 'react-addons-create-fragment';

function Swapper(props) {
  let children;
  if (props.swapped) {
    children = createFragment({
      right: props.rightChildren,
      left: props.leftChildren
    });
  } else {
    children = createFragment({
      left: props.leftChildren,
      right: props.rightChildren
    });
  }
  return <div>{children}</div>;
}
```

İletilen nesnenin anahtarları (yani, `left` ve `right`) tüm çocuklar için anahtar olarak kullanılır ve nesnenin anahtarlarının sırası, 'render' edilen çocukların sırasını belirlemek için kullanılır. Bu değişilik ile birlikte, bu iki grup çocuk DOM içerisinde çıkarılmaya gerek kalmadan, düzgün bir şekilde yeniden sıralanacaktır.


`createFragment` öğesinin dönüş değeri, opak bir nesne olarak değerlendirilmelidir; [`React.Children`](/docs/react-api.html#react.children) yardımcılarını, bir 'fragment' içerisinde döngü ile gezinmek için kullanabilirsiniz ancak doğrudan erişmemelisiniz. Ayrıca, tanımlamalarında garanti edilmemişte olsa, tüm önemli tarayıcılar ve VM'ler tarafından sayısal olmayan anahtarlara sahip nesneler için uygulanmış bulunan, nesne numaralandırma düzenini muhafaza eden JavaScript motoruna güvendiğimizi unutmayın.
