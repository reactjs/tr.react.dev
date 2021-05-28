---
id: hooks-state
title: Effect Hook'unu Kullanmak
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

Hooks, React 16.8 ile beraber gelen yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

*Effect Hook'u* fonksiyon bileşenlerinde yan etkiler oluşturmanıza olanak sağlar:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentDidMount ve componentDidUpdate kullanımına benzer bir kullanım sunar:
  useEffect(() => {
    // tarayıcının başlık bölümünü değiştirmemizi sağlar
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
Bu kod parçacığı [bir önceki sayfadaki sayaç uygulamasına](/docs/hooks-state.html) dayanmaktadır, fakat bir yeni özellik eklenmiştir: sayacın tıklanma sayısına göre tarayıcının başlığı tıklanma sayısını göstermektedir.

React bileşenlerinde veri getirme, bir abonelik oluşturma ve DOM'u manuel olarak değiştirme yan etkilere örnek olarak verilebilir. Bu işlemleri "yan etkiler" (veya sadece "etkiler") olarak adlandırsanızda adlandırmasanızda, bunları muhtemelen daha önce bileşenlerinizde kullanmışsınızdır.

>İpucu
>
>Eğer React sınıf yaşam döngülerini (lifecycle) biliyorsanız, `useEffect` Hook'unu `componentDidMount`, `componentDidUpdate`, ve `componentWillUnmount` yaşam döngüsü methodlarının birleşimi olarak düşünebilirsiniz.

React bileşenlerinde iki tür yan etki vardır: temizlik gerektirmeyenler ve ihtiyaç duyanlar. Gelin bu aradaki farka detaylı olarak bakalım.

## Temizlik Gerektirmeyen Etkiler {#effects-without-cleanup}

Bazen **React DOM'u güncelledikten sonra bazı ek kodları çalıştırmak** isteriz. Ağ istekleri, manuel DOM değişiklikleri ve günlük uygulama kayıtları, temizleme gerektirmeyen yaygın etkilere örnektir. Bu şekilde örneklendirebiliriz, çünkü onları çalıştırabilir ve ardından tamamen unutabiliriz. Sınıfların ve Hook'ların bu tür yan etkileri nasıl ifade etmemize izin verdiğini karşılaştıralım.

### Örnek: Sınıflar Kullanılarak Gerçekleştirilmesi {#example-using-classes}

React ta oluşturulan sınıf bileşenlerinde, `render` methodunun kendisi yan etkilere neden olmamalıdır. Aksi takdirde bu çok erken bir şekilde gerçekleşecektir -- genellikle React'ın DOM'u güncellemesinden **sonra** bu yan etkilerin gerçekleşmesini isteriz.

Bu nedenle React sınıflarında, `componentDidMount` ve `componentDidUpdate` yan etkileri tanımlanmıştır. Örneğe geri dönecek olursak, React DOM'da değişiklik yaptıktan hemen sonra belge başlığını güncelleyen bir React sayaç sınıfı bileşeni aşağıdaki gibidir:

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
**Sınıftaki bu iki yaşam döngüsü yöntemi arasındaki kodu nasıl tekrarlamamız gerektiğine** dikkat edin. 

Bunun nedeni çoğu durumda, bileşenin yeni oluşturulduğuna veya güncellenmiş olup olmadığına bakılmaksızın aynı yan etkiyi gerçekleştirmek istememizdir. Kavramsal olarak, her işlemeden sonra gerçekleşmesini isteriz - ancak React sınıf bileşenlerinin böyle bir methodu yoktur. Ayrı bir method olarak oluşturulabilirdi ama yine de ilgili kodu iki yerde çağırmamız gerekir.

Şimdi aynı işlemlerin `useEffect` Hook'u ile nasıl yapılabileceğine bakalım.

### Örnek: Hook Kullanılarak Gerçekleştirilmesi {#example-using-hooks}

Bu örneği daha önce bu sayfanın en üstünde görmüştük, ama hadi bu örneğe daha yakından bakalım:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**`useEffect` Hook'u ne yapar?** Bu Hook'u kullanarak, React'e bileşenininiz oluştuktan sonra bir şeyler yapması gerektiğini söylersiniz. React, geçtiğiniz fonksiyonu hatırlayacak (buna "effect (etki)" olarak değineceğiz) ve DOM güncellemelerini yaptıktan sonra onu çağıracaktır. Bu etki de, tarayıcı başlığını atadık fakat aynı şekilde veri getirebilir veya bazı API'ları çağırabilirdik.

**Neden `useEffect` Hook'u bir bileşen içinde çağırılıyor?** Bileşenin içine "useEffect" yerleştirmek, "count" durum değişkenine (veya herhangi bir props'a) bu efektten (etkiden) erişmemizi sağlar. "Count" durum değişkenini okumak için özel bir API'a ihtiyacımız yok -- fonksiyon kapanışlarında bu değişkene ulaşılabilmektedir. Hooklar, JavaScript kapanışlarını benimser ve JavaScript'in zaten bir çözüm sağladığı yerlerde React'e özgü API'leri tanımlamaktan kaçınır.

**`useEffect` Hook'u her render (işlem) den sonra çağırılır mı?** Evet! Varsayılan olarak, hem ilk oluşturmadan sonra *hem de her güncellemeden sonra* çalışır. [Bunun nasıl özelleştirilebileceğinden](#tip-optimizing-performance-by-skipping-effects). daha sonra bahsedeceğiz.) "Bileşenin oluşması" ve "güncelleme" terimleriyle düşünmek yerine, etkilerin "oluşturulduktan sonra" oluştuğunu düşünmeyi daha kolay bulabilirsiniz. React, DOM'un etkileri çalıştırdığında güncellendiğini garanti eder.

### Detaylı Açıklama {#detailed-explanation}

Artık etkiler hakkında daha fazla şey bildiğimize göre, bu satırlar bir anlam ifade etmeli:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

Burada "Count" durum değişkenini tanımlıyoruz ve ardından React'e bir etki (effect) kullanmamız gerektiğini söylüyoruz. Daha sonra ise `useEffect` Hook'una bir fonksiyonu geçiyoruz. Geçmiş olduğumuz *fonksiyon* bizim etkimizdir. Etkimizin içinde, belge başlığını "document.title" tarayıcı API'ını kullanarak belirliyoruz. Etkinin içindeki en son "count" değişkenini okuyabiliriz çünkü bu, fonksiyonumuzun kapsamındadır. React bileşenimizi oluşturduğunda, kullandığımız efekti hatırlayacak ve ardından DOM'u güncelledikten sonra etkimizi çalıştıracak. Bu işlem her render işleminde gerçekleşecektir.

Deneyimli JavaScript geliştiricileri, `useEffect` e geçilen fonksiyonun her işlemde farklı olacağını düşünebilir. Bu kasıtlı olarak yapılmıştır. Aslında bu, verinin güncel olmaması endişesi olmadan etkinin içinden "count" değerini okumamıza izin veren şeydir. Her yeniden oluşturduğumuzda, bir öncekinin yerine bir _farklı_ etki planlarız. Bir bakıma, bu, etkilerin daha çok oluşturma sonucunun bir parçası gibi davranmasını sağlar - her etki belirli bir render a "aittir". Bu durumunu daha net bir şekilde [bir sonraki sayfada](#explanation-why-effects-run-on-each-update) göreceğiz.

>İpucu
>
>`componentDidMount` veya `componentDidUpdate` ten farklı olarak, `useEffect` ile planlanan etkiler tarayıcının ekranı güncellemesini engellemez. Bu, uygulamanızı daha duyarlı hale getirir. Etkilerin çoğunun eşzamanlı olarak gerçekleşmesi gerekmez. Yaptıkları nadir durumlarda (düzeni belirlemek gibi), [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) adında `useEffect` ile aynı yapıda bir Hook vardır.

## Temizlenen(CleanUp) Etkiler {#effects-with-cleanup}

Daha önce, herhangi bir temizlik gerektirmeyen yan etkilerin nasıl ifade edileceğine bakmıştır. Bununla birlikte, bazı etkiler bunu yapar. Örneğin, **bazı harici veri kaynaklarına bir abonelik** ayarlamak isteyebiliriz. Bunun gibi durumlarda, bellek sızıntısına neden olmamak için temizlemek önemlidir! Bunu nasıl yapabileceğimizi sınıflarla ve Hook'larla karşılaştıralım.

### Örnek: Sınıflar Kullanılarak Gerçekleştirilmesi {#example-using-classes-1}

Bir React sınıfında, genellikle `componentDidMount` da bir abonelik oluşturulur ve `componentWillUnmount` ta temizlenir. Örneğin, `ChatAPI` adında arkadaşlarımızın çevrimiçi durumunu görmemize olanak sağlayan bir modülümüz olduğunu varsayalım. Bu durumu bir sınıf kullanarak şu şekilde abone olabilir ve gösterebiliriz: 

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

`componentDidMount` ve `componentWillUnmount` un birbirlerini nasıl yansıtması gerektiğine dikkat edin. Yaşam döngüsü methodları, kavramsal olarak birbiriyle ilişkili kodlar ise mantıksal olarak bizi bölmeye zorlar.

>Not
>
>Kartal gözlü okuyucular, bu örneğin tamamen doğru olması için bir `componentDidUpdate` methoduna da ihtiyaç duyduğunu fark edebilir. Şimdilik bunu görmezden geleceğiz fakat bu sayfanın bir [sonraki bölümünde](#explanation-why-effects-run-on-each-update) bundan bahsedeceğiz.

### Örnek: Hook Kullanarak Gerçekleştirilmesi {#example-using-hooks-1}

Bu bileşeni Hook'lar kullanarak nasıl yazabileceğimize bakalım.

Temizlemeyi gerçekleştirmek için ayrı bir etkiye ihtiyacımız olduğunu düşünüyor olabilirsiniz. Ancak bir abonelik eklemek ve kaldırmak için olan kod o kadar yakından ilişkilidir ki, `useEffect` onu bir arada tutmak için tasarlanmıştır. Etkiniz bir işlev döndürürse, React temizleme zamanı geldiğinde onu çalıştırır:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**Neden etkimizden bir işlevi döndürdük?** Bu, etkiler için isteğe bağlı temizleme mekanizmasıdır. Her etki, arkasından temizleyen bir işlev döndürebilir. Bu, abonelik ekleme ve kaldırma mantığını birbirine yakın tutmamızı sağlar. Aynı etkinin parçalarıdırlar!

**React bir efekti tam olarak ne zaman temizler?** React temizleme işlemini bileşen ayrıldığında gerçekleştirir. Ancak, daha önce öğrendiğimiz gibi, etkiler yalnızca bir kez değil, her render da çalışır. Bu nedenle React *ayrıca*, etkileri bir sonraki sefer çalıştırmadan önce önceki işlemdeki etkileri temizler. [Bunun neden hatalardan kaçınmaya yardımcı olduğunu](#explanation-why-effects-run-on-each-update) ve [performans sorunları yaratması durumunda bu davranışın nasıl devre dışı bırakılacağından](#tip-optimizing-performance-by-skipping-effects) aşağıda daha sonra bahsedeceğiz.

>Not
>
>Etkilerden adlandırılmış bir fonksiyon dönmek zorunda değiliz. Buraada amacını belli etmesi açısından `temizleme(cleanup)` olarak adlandırdık fakat arrow fonksiyon döndürülebilir veya başka bir fonksiyon şeklinde çağırabilir.

## Tekrar {#recap}

`useEffect` in bir bileşen oluşturulduktan sonra farklı yan etkileri ifade etmemize izin verdiğini öğrendik. Bazı efektler temizleme gerektirebilmektedir, bu nedenle bir fonksiyon döndürürler:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Diğer etkilerin temizleme aşaması olmayabilir ve hiçbir şey döndürmeyebilirler.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

Etki Hook'u, her iki kullanım durumunu da tek bir API altında birleştirir.

-------------

**Effect Hook'unun nasıl çalıştığını iyi bir şekilde anladığınızı düşünüyorsanız veya bunalmış hissediyorsanız, [Hook Kuralları hakkındaki bir sonraki sayfaya](/docs/hooks-rules.html) geçebilirsiniz.**

-------------

## Etkileri Kullanmak İçin İpuçları {#tips-for-using-effects}

Bu sayfaya, deneyimli React kullanıcılarının muhtemelen merak edeceği `useEffect` in bazı yönlerine derinlemesine bir bakışla devam edeceğiz. Kendinizi onları daha derinden incelemek zorunda hissetmeyin. Efekt Hook'u hakkında daha fazla ayrıntı öğrenmek için her zaman bu sayfaya geri dönebilirsiniz.

### İpucu: Kavramları Daha İyi Ayırmak İçin Birden Çok Efekt Kullanın {#tip-use-multiple-effects-to-separate-concerns}

Hooks için [Motivasyon](/docs/hooks-intro.html#complex-components-become-hard-to-understand)'da  ana hatlarıyla belirttiğimiz sorunlardan biri, sınıf yaşam döngüsü yöntemlerinin genellikle ilgisiz mantık içermesi, fakat ilgili mantığın birden fazla methodta bozulmasıdır. Önceki örneklerden sayaç ve arkadaş durumu göstergesi mantığını birleştiren bir bileşen:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

`document.title` öğesini ayarlayan mantığın `componentDidMount` ve `componentDidUpdate` arasında nasıl bölündüğüne dikkat edin. Abonelik mantığı ayrıca `componentDidMount` ve `componentWillUnmount` arasında da yayılır. Ve `componentDidMount`, her iki görev için kod içerir.

Tıpkı [*State* Hook'unu birden fazla kullanabildiğiniz](/docs/hooks-state.html#tip-using-multiple-state-variables) gibi, birkaç efekt de kullanabilirsiniz. Bu, alakasız uygulama mantığını farklı etkilere ayırmamızı sağlar:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

Yaşam döngüsü methodları yerine **Hook'lar, kodu yaptığı işe göre bölmemize izin verir**. React, bileşen tarafından kullanılan *her* etkiyi, belirtilen sırayla uygulayacaktır.

### Açıklama: Neden Her Güncellemede Etkiler Çalışıyor? {#explanation-why-effects-run-on-each-update}

Sınıf kavramına alışkınsanız, efekt temizleme aşamasının neden her yeniden oluşturmadan sonra olduğunu, bileşenin işleminin bitmesi sırasında bir kez olmayıp neden gerçekleştiğini merak ediyor olabilirsiniz. Bu tasarımın neden daha az hata içeren bileşenler oluşturmamıza yardımcı olduğunu görmek için aşağıdaki örneğe bakalım.


[Bu sayfanın önceki kısımlarında](#example-using-classes-1), bir arkadaşın çevrimiçi olup olmadığını gösteren bir örnek `FriendStatus` bileşenini tanıttık. Sınıfımız `this.props` dan `friend.id` yi okur ve daha sonra bileşen bağlandıktan sonra arkadaş durumunu öğrenir (abone olur) ve bağlantıyı kesme sırasında aboneliği iptal eder:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**Peki bileşen ekranda iken `friend` değeri değişirse** ne olur? Bileşenimiz, farklı bir arkadaşın çevrimiçi durumunu göstermeye devam edecektir. Bu bir hatadır (bug). Ayrıca abonelikten çıkma çağrısı yanlış arkadaş kimliğini (friend ID) kullanacağından, bağlantıyı keserken bellek sızıntısına veya çökmeye neden olabiliriz.

Bir sınıf bileşeninde, bu durumu ele almak için `componentDidUpdate` Hook'unu eklememiz gerekir:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

React uygulamalarında `componentDidUpdate` Hook'unu doğru bir şekilde yönetmeyi unutmak yaygın bir hata kaynağıdır.

Şimdi bu bileşenin Hook'ları kullanan sürümünü düşünelim:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Bu hatadan dolayı kaynaklanmıyor. (Fakat biz de herhangi bir değişiklik yapmadık.)

Güncellemeleri işlemek için özel bir kod yoktur çünkü `useEffect` bunları *varsayılan olarak* yönetir. Sonraki efektleri uygulamadan önce önceki efektleri temizler. Bunu somutlaştırmak için, bir grup abone olma ve abonelikten çıkma çağırısının olduğu bir bileşen kullanılabilir:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

Bu davranış, varsayılan olarak tutarlılığı sağlar ve eksik güncelleme mantığı nedeniyle sınıf bileşenlerinde yaygın olan hataları önler.

### İpucu: Efektleri Atlayarak Performansı Optimize Etme {#tip-optimizing-performance-by-skipping-effects}

Bazı durumlarda, her işlemeden sonra efekti temizlemek veya uygulamak bir performans sorunu yaratabilir. Sınıf bileşenlerinde, `componentDidUpdate` içinde `prevProps` veya `prevState` ile ekstra bir karşılaştırma yazarak bunu çözebiliriz:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

Bu gereksinim, `useEffect` Hook API'ında yerleşik olması için yeterince yaygındır. Yeniden render olması arasında belirli değerler değişmediyse React'e bir efekti uygulamayı *atlamasını* söyleyebilirsiniz. Bunu yapmak için, bir diziyi `useEffect` e isteğe bağlı ikinci bir parametre olarak iletin:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

Yukarıdaki örnekte, ikinci argüman olarak `[count]` u iletiyoruz. Peki bu ne anlama geliyor? `count` eğer `5` ise ve daha sonra bileşenimiz `count` hala `5` e eşit olacak şekilde yeniden oluşturulursa, React önceki render daki `[5]` ile sonraki render daki `[5]` 'i karşılaştırır. Dizideki tüm öğeler aynı olduğundan (`5 === 5`), React efekti atlar. Gerçekleştirdiğimiz iyileştirme bu şekildedir.

`6` olarak güncellenen `count` ile oluşturduğumuzda, React, önceki işlemedeki `[5]` dizisindeki öğeleri bir sonraki işlemedeki `[6]` dizisindeki öğelerle karşılaştıracaktır. Bu sefer React efekti yeniden uygulayacak çünkü `5 !== 6`. Dizide birden fazla öğe varsa, React, yalnızca biri farklı olsa bile efekti yeniden çalıştıracaktır.

Bu, temizleme aşaması olan efektler için de aynı şekilde işe yarar:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

Gelecekte, ikinci argüman bir derleme zamanı dönüşümü ile otomatik olarak eklenebilir.

>Not
>
>Bu optimizasyonu kullanırsanız, dizinin **bileşen kapsamındaki zamanla değişen ve efekt tarafından kullanılan tüm değerleri (props ve state gibi) içerdiğinden emin olun**. Aksi takdirde, kodunuz önceki render'lardan eski değerlere başvurur. [Fonksiyonlar ile nasıl başa çıkılır](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) ve [diziler çok fazla değiştiğinde ne yapılır](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-ofte) hakkında daha fazla bilgi için tıklayınız.

>Bir efekt çalıştırmak ve yalnızca bir kez temizlemek istiyorsanız (mount ve unmount sırasında), boş bir diziyi (`[]`) ikinci argüman olarak iletebilirsiniz. Bu, React'e efektinizin props veya state'deki *hiçbir* değere bağlı olmadığını, bu yüzden asla yeniden çalıştırılması gerekmediğini söyler. Bu özel bir durum olarak ele alınmaz - doğrudan bağımlılıklar dizisinin her zaman çalıştığı gibi çalışmasını sağlar.
>

>Boş bir dizi geçirirseniz (`[]`), efektin içindeki props ve state her zaman başlangıç değerlerine sahip olacaktır. İkinci argüman olarak `[]` geçerken tanıdık `componentDidMount` ve `componentWillUnmount` modelleri, çok sık yeniden çalışan efektleri önlemek için genellikle [daha iyi](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [çözümler](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) kullanılır.

>
>["Eslint-plugin-react-hooks"](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) paketimizin bir parçası olan [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) kuralını kullanmanızı öneririz. Bağımlılıklar yanlış belirlendiğinde uyarı verir ve bir düzeltme önerir.

## İleriki Adımlar {#next-steps}

Tebrikler! Bu uzun bir sayfaydı, ama umarız sonunda etkilerle ilgili sorularınızın çoğu yanıtlanmıştır. Hem State Hook'unu hem de Effect Hook'unu öğrendiniz ve ikisini birleştirerek yapabileceğiniz *çok fazla* şey var. Sınıflar için kullanım durumlarının çoğunu kapsar - ve olmadıkları yerlerde, [ek Hook'lar](/docs/hooks-reference.html) yararlı olabilir.

Ayrıca Hooks'un [Motivasyon](/docs/hooks-intro.html#motivation) bölümünde ana hatlarıyla belirtilen sorunları nasıl çözdüğünü görmeye başlıyoruz. Etkili temizlemenin `componentDidUpdate` ve `componentWillUnmount` ta yinelemeyi nasıl önlediğini, ilgili kodu birbirine yaklaştırdığını ve hataları önlememize yardımcı olduğunu gördük. Ayrıca etkileri amaçlarına göre nasıl ayırabileceğimizi de gördük, ki bu sınıflarda hiç yapamayacağımız bir şey.

Bu noktada Hook'ların nasıl çalıştığını sorguluyor olabilirsiniz. React, hangi `useState` çağrısının yeniden renderlar arasındaki hangi durum değişkenine karşılık geldiğini nasıl bilebilir? React her güncellemede önceki ve sonraki efektleri nasıl "eşleştirir"?  **Bir sonraki sayfada [Hook Kuralları](/docs/hooks-rules.html) hakkında bilgi edineceğiz - bunlar Hook'ların çalışması için önemlidir.**
