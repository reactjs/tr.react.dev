---
id: context
title: Context
permalink: docs/context.html
---

Context, prop'ları her seviyede manuel olarak geçmek zorunda kalmadan bileşen ağacı üzerinden veriye ulaşmayı sağlar.

Klasik bir React uygulamasında veri prop'lar aracılığıyla yukarıdan aşağıya aktarılır (üst bileşenlerden alt bileşenlere), fakat bu bir uygulamada birçok bileşene ihtiyaç duyulan belirli tipteki prop'lar (örneğin; mahal tercihi, UI tema) için kullanışsız olabilir. Context, bileşenler arasında ağacın her seviyesi üzerinden doğrudan bir prop'a geçiş yapmadan veri paylaşımı sağlar.


- [Context ne zaman kullanılır](#when-to-use-context)
- [Context kullanmadan önce](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
- [Örnekler](#examples)
  - [Dinamik Context](#dynamic-context)
  - [İç içe geçmiş bileşenden Context güncelleme](#updating-context-from-a-nested-component)
  - [Çoklu Context'leri kullanma](#consuming-multiple-contexts)
- [Caveats](#caveats)
- [Legacy API](#legacy-api)

## Context ne zaman kullanılır {#when-to-use-context}

Context mevcut kullanıcı doğrulama, tema veya dil seçimi gibi React bileşen ağacında global olarak düşünülebilecek verileri paylaşmak için tasarlanmıştır. Örneğin aşağıdaki kodda Button bileşenine stil vermek için manuel olarak bir "tema" prop'unu geçiyoruz.

`embed:context/motivation-problem.js`

Context kullanarak ara elementler üzerinden prop'ları geçmekten kaçınabiliriz.

`embed:context/motivation-solution.js`

## Context Kullanmadan Önce {#before-you-use-context}

Context öncelikle bazı verilere farklı seviyedeki iç içe geçmiş *birçok* bileşen tarafından erişilmesi gerektiğinde kullanılır. Bileşenin yeniden kullanımını daha zor kıldığı için onu tedbirli bir şekilde uygulayın.

**Eğer sadece bazı prop'ları birçok seviye üzerinden geçmekten kaçınmak isterseniz, [bileşen kompozisyonu](/docs/composition-vs-inheritance.html) genellikle Context'ten daha basit bir çözümdür.**

Örneğin, iç içe geçmiş `Link` ve `Avatar` bileşenlerinin okuyabilmesi için `avatarSize` ve `user` prop'larını birkaç seviye aşağıya aktaran bir `Sayfa` bileşeni düşünün:

```js
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... which renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... which renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Sadece `Avatar` bileşeni ihtiyaç duyarsa, `user` ve `avatarSize` prop'larını birçok seviye üzerinden geçmek gereksiz hissettirebilir. `Avatar` bileşeni ne zamanki üstten daha fazla prop'lara ihtiyaç duyar, bu prop'ları ara seviyelerde de eklemeniz gerekir.

Bu sorunu **Context'siz** çözmenin yolu [Avatar bileşenin kendisini aşağıya çekmesidir](/docs/composition-vs-inheritance.html#containment), böylece ara bileşenlerin `user` ve `avatarSize` prop'larını bilmesine gerek kalmaz:

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

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
```

Bu değişiklikle sadece en üstteki Page bileşeni `Link` ve `Avatar` bileşenlerinin `user` ve `avatarSize` prop'larını geçmesini bilmelidir.

Bu *kontrolün tersine çevrilmesi*, birçok durumda uygulamanızda geçirmeniz gereken prop'ların miktarını azaltarak ve kök bileşenlere daha fazla kontrol vererek kodunuzu daha temiz hale getirebilir. Ancak bu her durumda doğru bir seçim değildir: ağaçta yukarıya daha fazla karmaşıklık taşımak, daha üst düzey bileşenleri daha karmaşık hale getirir ve daha düşük düzeydeki bileşenleri istediğinizden daha esnek olmaya zorlar.

Bir bileşen için sadece tek bir alt elemanla sınırlı değilsiniz. [Burada belirtildiği gibi](/docs/composition-vs-inheritance.html#containment), alt elemanlar için birden çok alt eleman geçilebilir, hatta alt bileşenler için birden fazla ayrı "slots'a" sahip olabilirsiniz.

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

Bu patern, bir alt elemanı mevcut elemanlarından ayırmanız gerektiğinde çoğu durum için yeterlidir. Alt elemanın render olmadan önce üst eleman ile iletişim kurması gerekiyorsa, bunu [render prop'larla](/docs/render-props.html) daha ileriye götürebilirsin.

Fakat, bazen aynı verinin ağaçtaki birçok bileşen tarafından ve farklı seviyedeki bileşenlerde erişebilir olması gerekir. Context, bu tür verileri "yayınlamanıza" izin verir ve tüm alt bileşenlerdeki datayı değiştirir. Context'in kullanıldığı yaygın örnekler mevcut yerel ayarı, temayı veya bir veri önbelleği yönetmeyi içeren alternatiflerden daha basit olabilir.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Bir Context objesi yaratır. React bu Context objesine bağlanan bir bileşen oluşturduğunda, mevcut Context değerini ağaçta en yakın eşleşen `Provider'dan` okuyacaktır.

`defaultValue` argümanı **yanlızca**, bir bileşenin üstünde ağaçta eşleşen bir Provider bulunmadığında kullanılır. Bu, bileşenlerin sarılmadan yanlız bir şekilde test edilmesine yardımcı olabilir. Not: Provider value değerini `tanımsız` geçmek alt bileşenlerin `defaultValue` tüketmeye sebep olmaz.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* some value */}>
```

Her Context objesi dağıtıcı bileşenlerin context değişliklerine bağlı olmalarına sağlayan bir React Provider bileşeni ile birlikte gelir.

Bu Provider'ın devamından(soyundan) gelen dağıtıcı bileşenlere geçirilecek bir prop `değerini` kabul eder. Bir Provider, birçok dağıtıcıya bağlanabilir. Provider'lar ağacın derinliklerinde değerleri geçersiz kılmak için iç içe geçebilir.

Bir Provider'ın soyundan(devamından) gelen tüm dağıtıcılar, Provider'ın değeri prop değiştiğinde yeniden oluşturulur. Provider'ın devamından(soyundan) gelen dağıtıcılara yayılma, `shouldComponentUpdate` fonksiyonuna bağlı değildir, bu nedenle bir dağıtıcı bileşeni güncellemeden düştüğünde bile dağıtıcı güncellenir.

[`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) ile aynı algoritmayı kullanarak yeni ve eski değerler karşılaştırarak değişiklikler belirlenir.

> Not
>
> Değişimlerin belirlenme şekli, nesneleri `değer` olarak geçirirken bazı sorunlara neden olabilir: [Uyarılara](#caveats) bakınız.

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
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
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```

The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). This lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.

Bir sınıftaki `contextType` özelliğine [`React.createContext()`](#reactcreatecontext) tarafıdan oluşturulan bir Context nesnesi atanabilir. Bu `this.context'i` kullanarak bu Context türünün en yakın o anki değerine dağıtmanıza olanak sağlar. Bu render işlevi de dahil olmak üzere yaşam döngüsü yöntemlerinden herhangi birinde başvuruda bulunabilir. 

> Not:
>
> Bu API'yi kullanarak yalnızca tek bir içeriğe abone olabilirsiniz. Birden fazla okumanız gerekiyorsa, bakınız [Çoklu Context Dağıtımı](#consuming-multiple-contexts).
>
> Deneysel olarak [açık sınıf alanları sözdizimini](https://babeljs.io/docs/plugins/transform-class-properties/) kullanıyorsanız, `contextType'ınızı` başlatmak için **statik** bir sınıf alanı kullanablirsiniz.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* render something based on the value */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* render something based on the context value */}
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

## Legacy API {#legacy-api}

> Not
> 
> React önceleri deneysel bir context API ile yayınlanmıştı. Eski API tüm 16.x sürümlerinde desteklenecek ancak kullanan uygulamalar yeni süreme geçmelidir. Eski sürüm API'ler gelecekteki ana React versiyonundan kaldırılacaktır. [Eski sürüm Context dökümanlarını buradan](/docs/legacy-context.html) okuyun.
