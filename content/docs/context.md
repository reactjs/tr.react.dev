---
id: context
title: Context
permalink: docs/context.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
> - [`useContext`](https://react.dev/reference/react/useContext)

</div>

Context, prop'ları her seviyede manuel olarak geçmek zorunda kalmadan bileşen ağacı üzerinden veri iletmenin bir yolunu sağlar.

Tipik bir React uygulamasında veri prop'lar aracılığıyla yukarıdan aşağıya aktarılır (üst bileşenlerden alt bileşenlere). Fakat bu tür bir kullanım, uygulamadaki birçok bileşen tarafından ihtiyaç duyulan belirli tipteki prop'lar (örneğin; lokalizasyon, arayüz teması) için kullanışsız olabilir. Context, bileşen ağacın her bir seviyesi üzerinden açıkça bir prop geçirmeden, bileşenler arasında bu gibi değerleri paylaşmanın bir yolunu sağlar.

- [Context Ne Zaman Kullanılır](#when-to-use-context)
- [Context Kullanmadan Önce](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Örnekler](#examples)
  - [Dinamik Context](#dynamic-context)
  - [İç İçe Geçmiş Bileşenden Context Güncelleme](#updating-context-from-a-nested-component)
  - [Çoklu Context’leri Kullanma](#consuming-multiple-contexts)
- [Uyarılar](#caveats)
- [Eski Sürüm API](#legacy-api)

## Context Ne Zaman Kullanılır {#when-to-use-context}

Context; mevcut kullanıcıyı doğrulama, tema veya dil seçimi gibi React bileşen ağacında global olarak düşünülebilecek verileri paylaşmak için tasarlanmıştır. Örneğin aşağıdaki kodda Button bileşenine stil vermek için manuel olarak bir "theme" prop'unu geçiyoruz.

`embed:context/motivation-problem.js`

Context kullanarak, prop'ları ara öğelerden geçirmekten kaçınabiliriz.

`embed:context/motivation-solution.js`

## Context Kullanmadan Önce {#before-you-use-context}

Context esas olarak, bazı verilerin farklı düzeylerdeki iç içe geçmiş *birçok* bileşen tarafından erişilebilir olması gerektiğinde kullanılır. Bileşenin yeniden kullanımını zorlaştırdığından onu ölçülü bir şekilde uygulayın.

**Yalnızca bazı prop'ları birçok aşama üzerinden geçmek istemezseniz, [bileşen kompozisyonu](/docs/composition-vs-inheritance.html) genellikle Context'ten daha basit bir çözümdür.**

Örneğin, derinlemesine iç içe geçmiş `Link` ve `Avatar` bileşenlerinin okuyabilmesi için `avatarSize` ve `user` prop'larını birkaç seviye aşağıya aktaran bir `Page` bileşeni düşünün:

```js
<Page user={user} avatarSize={avatarSize} />
// ... Bu, bunu render ediyor ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... Bu, bunu render ediyor ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... Bu, bunu render ediyor ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Sonunda sadece `Avatar` bileşeni ihtiyaç duyuyorsa, `user` ve `avatarSize` 'ın birçok seviyeden geçmesi gereksiz olabilir. Ayrıca `Avatar` bileşeni yukarıdan daha fazla prop'a ihtiyaç duyduğunda, bu prop'ları tüm ara seviyelerde de eklemeniz gerekir.

Bu sorunu **Context'siz** çözmenin bir yolu [Avatar bileşeninin kendisinin prop olarak geçilmesidir](/docs/composition-vs-inheritance.html#containment), böylece ara bileşenlerin `user` ve `avatarSize` prop'ları hakkında bilgi sahibi olması gerekmez:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Şimdi, bizde olan:
<Page user={user} avatarSize={avatarSize} />
// ... Bu, bunu render ediyor ...
<PageLayout userLink={...} />
// ... Bu, bunu render ediyor ...
<NavigationBar userLink={...} />
// ... Bu, bunu render ediyor ...
{props.userLink}
```

Bu değişiklikle birlikte sadece en üstteki Page bileşeni `Link` ve `Avatar` bileşenlerinin `user` ve `avatarSize` kullanımını bilmesi gerekir.

Bu *kontrolün tersine çevrilmesi*, birçok durumda uygulamanızdan geçirmeniz gereken prop'ların sayısını azaltarak ve kök bileşenlere daha fazla kontrol sağlayarak kodunuzu daha temiz hale getirebilir. Fakat bu her durumda doğru bir seçim değildir: bileşen ağacında daha fazla karmaşıklık taşımak, daha üst seviyeli bileşenleri daha karmaşık hale getirir ve daha düşük seviyeli bileşenleri istediğinizden daha esnek olmaya zorlar.

Bir bileşen için tek bir alt elemanla sınırlı değilsiniz. [Burada belirtildiği gibi](/docs/composition-vs-inheritance.html#containment), alt elemanlar için birden çok alt eleman geçirebilirsiniz, hatta alt bileşenler için birden fazla ayrı "slots"a sahip olabilirsiniz.

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Bu model, bir alt elemanı üst elemanlarından ayırmanız gerektiğinde çoğu durum için yeterlidir. Alt elemanın render olmadan önce üst eleman ile iletişim kurması gerekiyorsa, bunu [render prop'larla](/docs/render-props.html) daha ileriye götürebilirsin.

Fakat, bazen aynı verinin ağaçtaki birçok bileşen tarafından ve farklı iç içe geçmiş seviyelerinde erişilebilir olması gerekir. Context, bu tür verileri ve güncellemeleri ağaçtaki tüm bileşenlere "yaymanızı" sağlar. Context kullanımının diğer alternatiflerden daha basit olabileceği ortak örnekler arasında konum ayarlarının yönetimi, tema veya veri önbelleği bulunur.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Bir Context nesnesi oluşturur. React, bu Context nesnesine abone bir bileşen oluşturduğunda, context'in mevcut değerini ağaçtaki en yakın `Provider'dan` okuyacaktır.

`defaultValue` argümanı **yalnızca**, bir bileşenin üstünde ağaçta eşleşen bir Provider bulunmadığında kullanılır. Bu varsayılan değer, bileşenleri başka bileşenlerin altına koymadan izole bir şekilde test etmek için yardımcı olabilir. Not: Provider value değerini `undefined` geçmek tüketici bileşenlerinin `defaultValue` kullanmasına neden olmaz.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* bir değer */}>
```

Her Context nesnesi, tüketici bileşenlerin context güncellemelerine abone olmasını sağlayan bir React Provider bileşeni ile birlikte gelir.

Provider bileşeni, bu Provider'ın soyundan gelen tüketici bileşenlerine geçirilecek olan bir `value` prop'unu kabul eder. Birçok tüketici bir Provider'a bağlanabilir. Provider'lar ağaçtaki daha derin değerleri değiştirmek için iç içe geçirilebilirler.

Bir Provider'ın soyundan gelen tüm tüketiciler, Provider'ın value prop'u her değiştiğinde yeniden oluşturulur. Provider'ın soyundan gelen tüketicilere ([`.contextType`](#classcontexttype) ve [`useContext`](/docs/hooks-reference.html#usecontext) de dahil olmak üzere) yayılması, `shouldComponentUpdate` metoduna tabi değildir, dolayısıyla herhangi bir bileşen güncellemeyi önlediğinde bile tüketici güncellenir.

[`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) gibi aynı algoritma kullanılarak yeni ve eski değerler karşılaştırıp değişiklikler belirlenir.

> Not
>
> Değişiklikleri belirlerken nesneleri `value` olarak geçmek bazı sorunlara neden olabilir: bakınız [Uyarılar](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* Mycontext değerini kullanarak mount'da yan etki yapma */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* Mycontext değerini esas alarak bir şey render etme */
  }
}
MyClass.contextType = MyContext;
```

Bir sınıftaki `contextType` özelliğine [`React.createContext()`](#reactcreatecontext) tarafından oluşturulan bir Context nesnesi atanabilir. Bu özelliği kullanmak, bu Context türünün en yakın mevcut değerine `this.context` 'i kullanarak erişmenizi sağlar. Bunu render metodu da dahil olmak üzere yaşam döngüsü metodlarından herhangi birinde belirtebilirsiniz. 

> Not:
>
> Bu API'yi kullanarak yalnızca tek bir context'e abone olabilirsiniz. Daha fazla okumanız gerekiyorsa, [Çoklu Context Tüketimi](#consuming-multiple-contexts) kısmına bakabilirsiniz.
>
> Deneysel [public sınıf alanları sözdizimini (public class fields)](https://babeljs.io/docs/plugins/transform-class-properties/) kullanıyorsanız, `contextType'ınızı` başlatmak için **statik** bir sınıf alanı kullanablirsiniz.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* value değerine dayalı bir şey render etmek */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* context değerine dayalı bir şey render etme */}
</MyContext.Consumer>
```

Context değişikliklerine abone olan bir React bileşeni. Bu bileşeni kullanmak, bir [fonksiyon bileşen](/docs/components-and-props.html#function-and-class-components) içindeki bir context'e abone olmanıza izin verir.

[Alt eleman olarak fonksiyon](/docs/render-props.html#using-props-other-than-render) verilmesine ihtiyaç duyar. Fonksiyon geçerli context değerini alır ve bir React düğümü döndürür. Fonksiyona iletilen `value` argümanı, yukarıda bu context için ağaçta en yakın Provider'ın `value` prop'una eşit olacaktır. Yukarıdaki bu context için Provider yoksa, `value` argümanı `createContext()` öğesine iletilmiş `defaultValue` değerine eşit olur.

> Not
>
> Alt eleman olarak fonksiyon modeline dair daha fazla bilgi için, bakınız: [render prop'ları](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Context objeleri `displayName` adında bir string property kabul eder. React DevTools context için ne göstereceğine karar vermek için bu stringi kullanır.

Örneğin, aşağıdaki bileşen DevTools'da MyDisplayName olarak gözükecektir.

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Örnekler {#examples}

### Dinamik Context {#dynamic-context}

Tema için dinamik değerli çok karmaşık bir örnek:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### İç İçe Geçmiş Bileşenden Context Güncelleme {#updating-context-from-a-nested-component}

Context'i bileşen ağacında derinlere yerleştirilmiş bir bileşenden genellikle güncellemek gerekir. Bu durumda, tüketicilerin context'i güncellemesine izin vermek için context'den bir method'u aşağıya iletebilirsiniz:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Çoklu Context’leri Kullanma {#consuming-multiple-contexts}

Context'in yeniden render edilmesini hızlı tutmak için React her context tüketiciyi ağaçta ayrı bir düğüm haline getirmelidir.

`embed:context/multiple-contexts.js`

İki veya daha fazla context değerleri sıklıkla birlikte kullanılıyorsa her ikisini de sağlayan kendi render prop bileşeninizi oluşturmayı düşünmek isteyebilirsiniz.

## Uyarılar {#caveats}

Context, yeniden render edilme zamanını belirlemek için referans kimliği kullandığından, bir Provider'ın üst elemanı yeniden render'landığında tüketicilerdeki istenmeyen render'ları tetikleyebilecek bazı kazanımlar vardır. Örneğin aşağıdaki kodda provider her yeniden render'landığında tüm tüketiciler yeniden render'lanır. Çünkü `value` için her zaman yeni bir obje oluşturulur:

`embed:context/reference-caveats-problem.js`


Bunu aşmak için, value değerini üst elemanın state'ine taşıyın:

`embed:context/reference-caveats-solution.js`

## Eski Sürüm API {#legacy-api}

> Not
> 
> React daha önce deneysel bir context API ile yayınlanmıştı. Eski API tüm 16.x sürümlerinde desteklenecek ancak onu kullanan uygulamalar yeni sürüme geçmelidir. Eski sürüm API'ler önümüzdeki ana React versiyonunda kaldırılacaktır. [Eski sürüm Context dökümanlarını buradan](/docs/legacy-context.html) okuyunuz.
