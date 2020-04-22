---
id: concurrent-mode-reference
title: Eşzamanlı Mod API Kaynağı (Deneysel)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Uyarı:
>
>Bu sayfada, **kararlı bir sürümde [henüz bulunmayan](/docs/concurrent-mode-adoption.html) deneysel özellikler** açıklanmaktadır. Canlı ortam uygulamalarında React'in deneysel sürümlerine güvenmeyin. Bu özellikler React'in bir parçası haline gelmeden önce önemli ölçüde ve bir uyarı olmaksızın değişebilir.
>
>Bu dokümantasyon erken benimseyenlere ve meraklı kişilere yöneliktir. **React'te yeniyseniz, bu özellikler hakkında meraklanmayın** -- bunları şu an öğrenmenize gerek yok.

</div>

Bu sayfa, React [Eşzamanlı Mod](/docs/concurrent-mode-intro.html) için bir API kaynağıdır. Eğer bunun yerine rehberlik eden bir tanıtım arıyorsanız, [Eşzamanlı Kullanıcı Arayüzü Desenlerine](/docs/concurrent-mode-patterns.html) göz atın.

**Not: Bu bir topluluk önizlemesidir ve kararlı final sürümü değildir. Bu API'larda gelecekte değişiklikler olması muhtemeldir. Riskin size ait olduğunu bilerek kullanın!**

- [Eşzamanlı Mod'u Etkinleştirme](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Eşzamanlı Mod'u Etkinleştirme {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

`ReactDOM.render(<App />, rootNode)` yerine geçer ve Eşzamanlı Mod'u etkinleştirir.

Eşzamanlı Mod hakkında daha fazla bilgi için, [Eşzamanlı Mod dökümanına](/docs/concurrent-mode-intro.html) göz atın.

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

`ReactDOM.render(<App />, rootNode)` yerine geçer ve [Engelleme Mod'unu](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode) etkinleştirir.

Eşzamanlı Mod'u tercih etmek React'in çalışma mantığında anlamsal değişiklikler meydana getirir. Bu, Eşzamanlı Mod'u yalnızca birkaç bileşende kullanamayacağınız anlamına gelir. Bu nedenle, bazı uygulamalar Eşzamanlı Mod'a doğrudan geçemeyebilir.

Engelleme Mod'u, Eşzamanlı Mod özelliklerinin yalnızca küçük bir alt kümesini içerir ve doğrudan taşınamayan uygulamalar için ara bir geçiş adımı olarak tasarlanmıştır.

## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Yükleniyor...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense`, bileşenlerinizin bir şey render etmeden önce "beklemelerini" sağlar ve beklerken bir yedek gösterir.

Bu örnekte, `ProfileDetails` bazı verileri almak için asenkron bir API çağrısını bekliyor. `ProfileDetails` ve `ProfilePhoto` için beklerken bunun yerine `Loading...` yedeğini göstereceğiz. Şunu vurgulamakta yarar var: `<Suspense>` içinde bulunan tüm alt bileşenler yüklenene kadar, yedeği göstermeye devam ederiz.

`Suspense` iki prop alır:
* **fallback** bir yükleme göstergesi alır. Bu yedek `Suspense` bileşenine ait tüm alt bileşenlerin render edilmesini tamamlayana kadar gösterilir.
* **unstable_avoidThisFallback** bir boolean alır. React'e ilk yüklenme sırasında bu sınırların açığa çıkmasını "atlayıp atlamayacağını" bildirir. Bu API büyük olasılıkla gelecekteki bir sürümde kaldırılacaktır.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Yükleniyor...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Yükleniyor...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Yükleniyor...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` bileşenlerin kullanıcıya gösterilme sırasını yöneterek beklemekte olan birçok bileşeni koordine etmeye yardımcı olur.

Birden fazla bileşenin veri getirmesi gerektiğinde, bu veriler öngörülemeyen bir sıralama ile gelebilir. Ancak, bu öğeleri bir `SuspenseList` içine yerleştirirseniz, React önceki öğeler görüntülenene kadar listede bir öğe göstermez (bu davranış ayarlanabilir).

`SuspenseList` iki prop alır:
* **revealOrder (forwards, backwards, together)** `SuspenseList` alt elemanlarının hangi sırayla gösterilmesi gerektiğini tanımlar.
  * `together` tek tek yerine, hazır olduğunda *tümü* birlikte gösterilir.
* **tail (collapsed, hidden)** `SuspenseList` içindeki yüklenmemiş alt elemanların nasıl gösterileceğini belirler.
  * Varsayılan olarak, `SuspenseList` listedeki tüm yedekleri gösterir.
  * `collapsed` yalnızca listedeki bir sonraki yedeği gösterir.
  * `hidden` yüklenmemiş hiçbir alt elemanı göstermez.

`SuspenseList` öğesinin yalnızca en yakın `Suspense` ve `SuspenseList` bileşenlerinde çalıştığını unutmayın. Birinci seviyeden daha derinde bulunan içerikler için arama yapmaz. Ancak, ızgara yapısı oluşturmak için birden fazla `SuspenseList` bileşenini iç içe yerleştirmek mümkündür.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` **bir sonraki ekrana geçmeden** önce içeriğin yüklenmesini bekleyerek bileşenlerin istenmeyen yükleme durumlarından kaçınmasını sağlar. Ayrıca bileşenlerin bir sonraki render işlemine kadar veri getirme güncellemelerini ertelemesine izin verir, böylece daha önemli güncellemeler hemen render edilebilir.

`useTransition` hook'u bir dizide iki değer döndürür.
* `startTransition` callback alan bir fonksiyondur. React'a hangi state'i ertelemek istediğimizi söylemek için kullanabiliriz.
* `isPending` bir boolean. React'in geçişin bitmesini bekleyip beklemediğimizi bize bildirmesinin yoludur.

**Bazı state güncellemeleri bir bileşenin beklemesine neden oluyorsa, bu durum güncellemesi bir geçiş içine yerleştirilmelidir.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Yükleniyor..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

Bu kodda, veri getirme işlemimizi `startTransition` içine yerleştirdik. Bu bir sonraki profil sayfasının ve ilişkili `Spinner`'ın render edilmesini 2 saniye (`timeoutMs` ile gösterilen zaman) erteleyerek, profil verilerini hemen almaya başlamamızı sağlar.

`isPending` boolean'ı React'ın bileşenimizin geçiş yaptığını bilmesine izin verir, böylece önceki profil sayfasında bir yükleme metni göstererek kullanıcıya bunu bildirebiliriz.

**Geçişleri derinlemesine incelemek için, [Eşzamanlı Kullanıcı Arayüzü Desenlerine](/docs/concurrent-mode-patterns.html#transitions) göz atabilirsiniz.**

#### useTransition Yapılandırması {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` **isteğe bağlı Suspense Yapılandırması** ile bir `timeoutMs` alır. Bu zaman aşımı (milisaniye cinsinden) React'a bir sonraki state'i (yukarıdaki örnekte yeni Profil Sayfası) göstermeden önce ne kadar bekleyeceğini bildirir.

**Not: Suspense Yapılandırmanızı farklı modüller arasında ortak kullanmanızı öneririz.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

En fazla `timeoutMs` "geride kalarak" değerin gecikmiş bir halini döndürür.

Bu, genellikle kullanıcı girdisine göre anında render ettiğiniz bir şey olduğunda ve bir veriyi getirmeyi beklemesi gerektiğinde arayüzü duyarlı tutmak için kullanılır.

Bunun iyi bir örneği bir metin input'tur.

```js
function App() {
  const [text, setText] = useState("merhaba");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Güncel metni input'a iletmeye devam eder */}
      <input value={text} onChange={handleChange} />
      ...
      {/* Ancak listenin gerektiğinde "geride kalmasına" izin verilir */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

Bu, web sayfasının duyarlı hissedilmesini sağlayan `input` için yeni metni hemen göstermeye başlamamızı sağlar. Bu arada, `MySlowList` güncellenmeden önce `timeoutMs` değerine göre 2 saniye kadar "geride kalır" ve arka plandaki mevcut metinle render edilmesine izin verir.

**Değerleri geciktirmeyi derinlemesine incelemek için, [Eşzamanlı Kullanıcı Arayüzü Desenlerine](/docs/concurrent-mode-patterns.html#deferring-a-value) göz atabilirsiniz.**

#### useDeferredValue Yapılandırması {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` **isteğe bağlı Suspense Yapılandırması** ile bir `timeoutMs` alır. Bu zaman aşımı (milisaniye cinsinden) React'e ertelenen değerin ne kadar gecikmesine izin verildiğini bildirir.

React, ağ ve cihaz şartları mumkün olduğunda her zaman daha kısa bir gecikme kullanmaya çalışacaktır.
