---
id: context
title: Context
permalink: docs/context.html
---

Context, prop'ları her seviyede manuel olarak geçmek zorunda kalmadan bileşen ağacı üzerinden veri iletmenin bir yolunu sağlar.

Tipik bir React uygulamasında veri prop'lar aracılığıyla yukarıdan aşağıya aktarılır (üst bileşenlerden alt bileşenlere), fakat bu bir uygulamada birçok bileşene ihtiyaç duyulan belirli tipteki prop'lar (örneğin; lokalizasyon, arayüz teması) için kullanışsız olabilir. Context, ağacın her bir seviyesi üzerinden açıkça bir prop geçirmeden, bileşenler arasında bu gibi değerleri paylaşmanın bir yolunu sağlar.


- [Context ne zaman kullanılır](#when-to-use-context)
- [Context kullanmadan önce](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
- [Örnekler](#examples)
  - [Dinamik Context](#dynamic-context)
  - [İç İçe Geçmiş Bileşenden Context Güncelleme](#updating-context-from-a-nested-component)
  - [Çoklu Context'leri Kullanma](#consuming-multiple-contexts)
- [Uyarılar](#caveats)
- [Eski Sürüm API](#legacy-api)

## Context Ne Zaman Kullanılır {#when-to-use-context}

Context mevcut kullanıcı doğrulama, tema veya dil seçimi gibi React bileşen ağacında global olarak düşünülebilecek verileri paylaşmak için tasarlanmıştır. Örneğin aşağıdaki kodda Button bileşenine stil vermek için manuel olarak bir "theme" prop'unu geçiyoruz.

`embed:context/motivation-problem.js`

Context kullanarak, prop'ları ara öğelerden geçirmekten kaçınabiliriz.

`embed:context/motivation-solution.js`

## Context Kullanmadan Önce {#before-you-use-context}

Context esas olarak bazı verilere farklı düzeylerdeki iç içe geçmiş *birçok* bileşen tarafından erişilebilir olması gerektiğinde kullanılır. Bileşenin yeniden kullanımını zorlaştırdığından onu ölçülü bir şekilde uygulayın.

**Yanlızca bazı prop'ları birçok aşama üzerinden geçmek istemezseniz, [bileşen kompozisyonu](/docs/composition-vs-inheritance.html) genellikle Context'ten daha basit bir çözümdür.**

Örneğin, derinlemesine iç içe geçmiş `Link` ve `Avatar` bileşenlerinin okuyabilmesi için `avatarSize` ve `user` prop'larını birkaç seviye aşağıya aktaran bir `Page` bileşeni düşünün:

```js
<Page user={user} avatarSize={avatarSize} />
// ... render eden ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... render eden ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... render eden ...
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

// Şimdi, Bizde olan:
<Page user={user} avatarSize={avatarSize} />
// ... render eden ...
<PageLayout userLink={...} />
// ... render eden ...
<NavigationBar userLink={...} />
// ... render eden ...
{props.userLink}
```

Bu değişiklikle birlikte sadece en üstteki Page bileşeni `Link` ve `Avatar` bileşenlerinin `user` ve `avatarSize` kullanımını bilmesi gerekir.

Bu *kontrolün tersine çevrilmesi*, birçok durumda uygulamanızdan geçirmeniz gereken prop'ların sayısını azaltarak ve kök bileşenlere daha fazla kontrol sağlayarak kodunuzu daha temiz hale getirebilir. Fakat bu her durumda doğru bir seçim değildir: ağaçta daha fazla karmaşıklık taşımak, daha üst seviyeli bileşenleri daha karmaşık hale getirir ve daha düşük seviyeli bileşenleri istediğinizden daha esnek olmaya zorlar.

Bir bileşen için tek bir alt elemanla sınırlı değilsiniz. [Burada belirtildiği gibi](/docs/composition-vs-inheritance.html#containment), alt elemanlar için birden çok alt eleman geçirebilirsiniz, hatta alt bileşenler için birden fazla ayrı "slots'a" sahip olabilirsiniz.

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

Bu patern, bir alt elemanı üst elemanlarından ayırmanız gerektiğinde çoğu durum için yeterlidir. Alt elemanın render olmadan önce üst eleman ile iletişim kurması gerekiyorsa, bunu [render prop'larla](/docs/render-props.html) daha ileriye götürebilirsin.

Fakat, bazen aynı verinin ağaçtaki birçok bileşen tarafından ve farklı iç içe geçmiş seviyelerinde erişilebilir olması gerekir. Context, bu tur verileri ve güncellemeleri ağaçtaki tüm bileşenlere "yaymanızı" sağlar. Context kullanımının diğer alternatiflerden daha basit olabileceği ortak örnekler arasında konum ayarlarının yönetimi, tema veya veri önbelleği bulunur.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Bir Context objesi yaratır. React bu Context objesine bağlanan bir bileşen oluşturduğunda, mevcut Context değerini ağaçta en yakın eşleşen `Provider'dan` okuyacaktır.

`defaultValue` argümanı **yanlızca**, bir bileşenin üstünde ağaçta eşleşen bir Provider bulunmadığında kullanılır. Bu, bileşenlerin sarılmadan yanlız bir şekilde test edilmesine yardımcı olabilir. Not: Provider value değerini `tanımsız` geçmek alt bileşenlerin `defaultValue` tüketmeye sebep olmaz.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* bazı değer */}>
```

Her Context objesi dağıtıcı bileşenlerin context değişliklerine bağlı olmalarına sağlayan bir React Provider bileşeni ile birlikte gelir.

Bu Provider'ın devamından(soyundan) gelen dağıtıcı bileşenlere geçirilecek bir prop `değerini` kabul eder. Bir Provider, birçok dağıtıcıya bağlanabilir. Provider'lar ağaçtaki daha derin değerleri değiştirmek için iç içe geçirilebilirler.

Bir Provider'ın soyundan(devamından) gelen tüm dağıtıcılar, Provider'ın değeri prop değiştiğinde yeniden oluşturur. Provider'ın devamından(soyundan) gelen dağıtıcılara yayılma, `shouldComponentUpdate` fonksiyonuna bağlı değildir, bu nedenle bir dağıtıcı bileşeni güncellemeden düştüğünde bile dağıtıcı güncellenir.

Bir Provider'ın soyundan gelen tüm tüketiciler, Provider'ın prop değeri her değiştiğinde yeniden oluşturulur. Provider'ın soyundan gelen tüketicilere yayılması, `shouldComponentUpdate` fonksiyonuna tabi değildir, dolayısıyla bir ana bileşen güncellemeyi önlediğinde bile tüketici güncellenir.

[`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) gibi aynı algoritmayı kullanarak yeni ve eski değerleri karşılaştırarak değişiklikler belirlenir.

> Not
>
> Değişimlerin belirlenme şekli, nesneleri `değer` olarak geçirirken bazı sorunlara neden olabilir: bakınız [Uyarılar](#caveats).

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
    /* Mycontext değerini esas alarak bir şey oluşturma */
  }
}
MyClass.contextType = MyContext;
```

Bir sınıftaki `contextType` özelliğine [`React.createContext()`](#reactcreatecontext) tarafından oluşturulan bir Context nesnesi atanabilir. Bu `this.context'i` kullanarak bu Context türünün en yakın mevcut değerini dağıtmanıza olanak sağlar. Bu render işlevi de dahil olmak üzere yaşam döngüsü yöntemlerinden herhangi birinde başvuruda bulunabilirsiniz. 

> Not:
>
> Bu API'yi kullanarak yalnızca tek bir içeriğe abone olabilirsiniz. Daha fazla okumanız gerekiyorsa, bakınız [Çoklu Context Dağıtımı](#consuming-multiple-contexts).
>
> Deneysel [açık sınıf alanları sözdizimini](https://babeljs.io/docs/plugins/transform-class-properties/) kullanıyorsanız, `contextType'ınızı` başlatmak için **statik** bir sınıf alanı kullanablirsiniz.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* value'ya bağlı bir şey yapmak. */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* context değerine göre bir şey oluşturma */}
</MyContext.Consumer>
```

Context değişikliklerine abone olan bir React bileşeni. Bu, bir [fonksiyon bileşen](/docs/components-and-props.html#function-and-class-components) içindeki bir context'e abone olmanıza izin verir.

[Alt eleman gibi fonksiyonlar](/docs/render-props.html#using-props-other-than-render) gereklidir. Fonksiyon geçerli context değerini alır ve bir React düğümü döndürür. Fonksiyona iletilen `value` argümanı, yukarıda bu context için ağaçta en yakın Provider'ın `value` prop'una eşit olacaktır. Yukarıdaki bu context için Provider yoksa, `value` argümanı `createContext()` öğesine iletilmiş `defaultValue` değerine eşit olur.

> Not
> 
> Alt eleman gibi fonksiyonlar paternleri hakkında daha çok  bilgi için, bakınız: [prop'ları renderlamak](/docs/render-props.html).

## Örnekler {#examples}

### Dinamik Context {#dynamic-context}

Tema için dinamik değerli çok karmaşık bir örnek:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### İç içe geçmiş bileşenden Context güncelleme {#updating-context-from-a-nested-component}

Context'i bileşen ağacında derin bir yere yerleştirilmiş bir bileşenden güncellemek genellikle gerekir. Bu durumda, tüketicilerin içeriği güncellemesine izin vermek için içeriğin bir işlevini aşağı iletebilirsiniz:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Çoklu Context’leri kullanma {#consuming-multiple-contexts}

Context'in yeniden oluşturulmasını hızlı tutmak için React her context tüketiciyi ağaçta ayrı bir düğüm haline getirmelidir.

`embed:context/multiple-contexts.js`

İki veya daha fazla contex değeri sıklıkla birlikte kullanılıyorsa her ikisini de sağlayan kendi render prop bileşeninizi oluşturmayı düşünebilirsiniz.

## Uyarılar {#caveats}

Context ne zaman yeniden oluşturulacağını belirlemek için referans kimliğini kullandığından bir Provider'ın üst elemanları yeniden işlendiğinde dağıtıcılarda ki istenmeyen işleyicileri tetikleyebilecek bazı kazançlar vardır. Örneğin aşağıdaki kod dağıtıcının her yeniden oluşturuşunda  tüm dağıtıcıları yeniden oluşturur. Çünkü her zaman `value` içim yeni bir obje oluşturulur:

`embed:context/reference-caveats-problem.js`


Bunu aşmak için, değeri üst eleman'ın state'ine getirin:

`embed:context/reference-caveats-solution.js`

## Eski Sürüm API {#legacy-api}

> Not
> 
> React önceleri deneysel bir context API ile yayınlanmıştı. Eski API tüm 16.x sürümlerinde desteklenecek ancak kullanan uygulamalar yeni süreme geçmelidir. Eski sürüm API'ler gelecekteki ana React versiyonundan kaldırılacaktır. [Eski sürüm Context dökümanlarını buradan](/docs/legacy-context.html) okuyun.
