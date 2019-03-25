---
title: Don't Call PropTypes Uyarısı
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Not:
>
> `React.PropTypes` React v15.5 sürümünden itibaren farklı bir pakete taşındı. Lütfen onun yerine [`prop-types` kütüphanesini](https://www.npmjs.com/package/prop-types) kullanın.
>
>Dönüşümü otomatikleştirmek için bir [codemod scripti](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) sunuyoruz.

React'in gelecekteki büyük sürümünde, PropType doğrulaması yapan kod bloğu ayrıştırılacak. Bu olduğu zaman, bu kodun elle çağırıldığı yerler hata verecek.

### PropTypes tanımlamak hala iyi {#declaring-proptypes-is-still-fine}

PropTypes'ın normal kullanımı hala destekleniyor:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Burada bir şey değişmiyor.

### PropTypes'ı direkt olarak çağırmayın {#dont-call-proptypes-directly}

PropTypes'ı, React bileşenlerini açıklamak dışında başka bir şekilde kullanmak artık desteklenmemektedir.

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Desteklenmiyor!
var error = apiShape(json, 'response');
```
Eğer PropTypes'ı bu şekilde kullanma zorunluluğunuz varsa, size PropTypes'ın bir kopyasını oluşturmanızı öneririz([Bu](https://github.com/aackerman/PropTypes) [iki](https://github.com/developit/proptypes) paket gibi).

Eğer uyarıyı düzeltmezseniz, bu kod React 16 sürümüyle birlikte canlı ortamda çökecektir.

### Eğer PropTypes'ı direkt çağırmadığınız halde uyarı alıyorsanız {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Uyarıda belirtilen çalışma betiğini inceleyin. PropTypes'ı direkt olarak çağırmaya sebep olan bileşeni bulacaksınız. Büyük ihtimalle uyarının sebebi React'in PropTypes özelliğini sarmallayarak kullanan bir 3. partidir, örneğin:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
} 
```
Bu örnekte, `ThirdPartyPropTypes.deprecated` fonksiyonu `PropTypes.bool`'u çağıran bir sarmalayıcıdır (wrapper). Bu kullanım kendi içerisinde uygun ancak React PropTypes'ı direkt çağırdınızı düşünerek yanlış pozitif olarak tetikler. Bir sonraki bölüm, `ThirdPartyPropTypes` gibi kütüphaneler kullandığınızda oluşan problemleri nasıl düzelteceğinizi açıklıyor. Eğer bu sizin yazdığınız bir kütüphane değilse, ilgili kütüphaneye sorun olarak bildirebilirsiniz.

### Üçüncü-parti PropTypes'lardaki yanlış pozitifleri düzeltmek {#fixing-the-false-positive-in-third-party-proptypes}

Eğer üçüncü parti bir PropTypes kütüphanesinin geliştiricisi iseniz ve kullanıcılara React PropTypes'ı sarmalayan bir şey kullanmalarını sağlıyorsanız, onlar bu uyarının sizin kütüphanenizden geldiğini göreceklerdir. Bu durum, React'in el ile yapılan PropTypes çağrılarını algılamak için geçtiği "gizli" bir son argümanı görmemesi nedeniyle oluşur.

İşte bunu düzeltmenin yolu. Burada örnek olarak [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js)'dan `deprecated` fonksiyonunu kullanacağız. Mevcut uygulamada sadece `props`, `propName`, ve `componentName` argümanları aşağıya gönderiliyor:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${componentName}"in "${propName}" özelliği kullanımdan kaldırıldı.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Bu yanlış pozitifi düzeltmek için, **bütün** argümanları alttaki sarmallanan PropType'a geçtiğinizden emin olun. Bunu ES6 `...rest` notasyonu ile yapmak oldukça kolaydır:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Not ...rest notasyonu burada
    if (props[propName] != null) {
      const message = `"${componentName}"in "${propName}" özelliği kullanımdan kaldırıldı.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // ve burada
  };
}
```

Bu, uyarıyı susturur.
