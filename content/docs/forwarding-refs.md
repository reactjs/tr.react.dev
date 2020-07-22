---
id: forwarding-refs
title: Ref'leri yönlendirme
permalink: docs/forwarding-refs.html
---

Ref yönlendirme, bir [ref](/docs/refs-and-the-dom.html)'i üst bileşenlerden alt bileşenlerin birine otomatik olarak aktarma tekniğidir. Bu genellikle uygulamadaki çoğu bileşen için gerekli değildir. Ama, bazı bileşen türleri için faydalı olabilir, özellikle yeniden kullanılabilir bileşen kütüphaneleri. En yaygın senaryolar aşağıda açıklanmaktadır.

## Ref'leri DOM bileşenlerine aktarmak {#forwarding-refs-to-dom-components}

Yerel (native) `button` öğesisini oluşturan `FancyButton` bileşeni düşünün:
`embed:forwarding-refs/fancy-button-simple.js`

React bileşenleri, uygulama ayrıntılarını gizler. `FancyButton` bileşenini kullanan diğer bileşenler, genellikle, inner `button` için [ref oluşturması](/docs/refs-and-the-dom.html) **gerekmez**. Bu iyi bir şeydir, çünkü bileşenlerin birbirilerinin DOM yapısına fazla bağımlı olmasını önler.

Her ne kadar bu kapsülleme (encapsulation) `FeedStory` veya `Comment` gibi uygulama seviyesi bileşenler için arzu edilirse de, `FancyButton` veya `MyTextInput` gibi yüksek oranda yeniden kullanılabilir "yaprak" bileşenler için sakıncalı olabilir. Bu bileşenler uygulama boyunca normal bir DOM `button` ve `input` öğeleri gibi benzer şekilde kullanılma eğilimindedir, odaklama, seçim veya animasyonları yönetmek için DOM node'larına erişmek kaçınılmaz olabilir.

**Ref yönlendirme, bazı bileşenlerin aldıkları bir ref'yi almasını ve daha alt elemene aktarmasını sağlayan bir etkinleştirme özelliğidir**

Alttaki örnekte, `FancyButton` kendisine aktarılan ref'yi elde etmek için `React.forwardRef` kullanılır ve ardından oluşturduğu DOM `button`'a iletir:

`embed:forwarding-refs/fancy-button-simple-ref.js`

Bu şekilde, `FancyButton` kullanan bileşenler, temelde bulunan `button` DOM node'una bir ref oluşturabilir ve gerekirse doğrudan bir DOM `button` kullanmış gibi erişebilir.

Yukarıdaki örnekte neler olduğuna dair adım adım açıklama:

1. `React.createRef`'i çağırarak bir [React ref](/docs/refs-and-the-dom.html) oluşturuyoruz ve bir `ref` değişkenine atama yapıyoruz.
1. JSX özelliği olarak belirterek `ref`'i `<FancyButton ref={ref}>` bileşenine aktarıyoruz.
1. React, ikinci bir argüman olarak `ref`'yi `forwardRef` içindeki `(props, ref) => ...` fonksiyonuna iletir.
1. JSX özelliği olarak belirterek, `ref` argümanını `<button ref={ref}>`'a aktarıyoruz.
1. Ref eklendiğinde. `ref.current`, `<button>` DOM node'una işaret edecektir.

>Not
>
>İkinci `ref` argümanı yalnızca `React.forwardRef` çağrısıyla oluşur. Normal fonksiyon veya sınıf bileşenleri `ref` argümanı almaz, ayrıca ref prop'larda da mevcut değildir.
>
>Ref yönlendirme yalnızca DOM bileşenleri ile sınırlı değildir. ref'leri sınıf bileşenlerinden türetilen nesnelere de aktarabilirsiniz.

## Bileşen kütüphanesine bakım yapanlara not {#note-for-component-library-maintainers}

**`forwardRef`'i bir bileşen içinde kullanmaya başladığınızda, Bunu tehlikeli bir değişim olarak değerlendirmelisiniz ve yeni bir sürüm yayınlamalısınız.** Bunun nedeni, kütüphanenizin büyük olasılıkla gözle görülür şekilde farklı bir yaklaşıma sahip olmasıdır (ref'lerin ataması ve hangi türlerin dışa aktarıldığı gibi), ve eski yaklaşıma bağlı uygulamaları ve diğer kütüphaneleri etkiliyebilir.

Mevcut olduğunda `React.forwardRef`'i koşullu olarak uygulamak da aynı nedenlerle önerilmez:
Kütüphanenizin biçimini değiştirir ve React'i yükselttiklerinde kullanıcılarınızın uygulamalarını bozabilir.

## Üst-Seviye Bileşenlerde ref'leri yönlendirme {#forwarding-refs-in-higher-order-components}

Bu teknik, üst-seviye bileşenlerde özellikle yararlı olabilir [higher-order components](/docs/higher-order-components.html) (HOC olarak da bilinir). Konsola bileşen prop'larını kaydeden örnek bir HOC ile başlayalım:
`embed:forwarding-refs/log-props-before.js`

"logProps" HOC, tüm prop'ları kapladığı bileşene aktarır, böylece sonuç aynı olacaktır.
Örneğin, "fancy button" bileşenimize iletilen tüm prop'ları log etmek için bu HOC'u kullanabiliriz.
`embed:forwarding-refs/fancy-button.js`

Yukarıdaki örnekle ilgili bir uyarı: ref'ler iletilmeyecek. Bunun nedeni `ref` prop değildir. `key` gibi, React tarafından farklı şekilde ele alınır. Bir HOC'a ref eklerseniz, ref, kaplanmış bileşene değil, en dıştaki kapsaycı bileşene atıfta bulunacaktır.

Bu, `FancyButton` bileşeni için istenilen ref'lerin aslında `LogProps` bileşenine ekleneceği anlamına gelir.
`embed:forwarding-refs/fancy-button-ref.js`

Neyse ki, ref'leri `React.forwardRef` API'sını kullanarak iç `FancyButton` bileşenine iletebiliriz. `React.forwardRef`, `props` ve `ref` parametrelerini alan ve bir React node'u döndüren render fonksiyonu kabul eder. Örneğin:
`embed:forwarding-refs/log-props-after.js`

## Displaying a custom name in DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` render fonksiyonu kabul eder. React DevTools, ref yönlendirme bileşeni için neyin görüntüleneceğini belirlemek için bu fonksiyonu kullanır.

Örneğin, aşağıdaki bileşen DevTools'ta "*ForwardRef*" olarak görünür

`embed:forwarding-refs/wrapped-component.js`

Oluşturma fonksiyonunu adlandırırsanız, DevTools ayrıca adını da ekler (örn. "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Hatta fonksiyonun `displayName` özelliğini kapladığınız bileşeni içerecek şekilde ayarlayabilirsiniz:

`embed:forwarding-refs/customized-display-name.js`
