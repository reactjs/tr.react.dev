---
title: <Profiler>
---

<Intro>

`<Profiler>` programatik olarak bir React ağacınının performansını ölçmenizi sağlar.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<Profiler>` {/*profiler*/}

Bir bileşen ağacını `<Profiler>` ile sarmalayarak render performansını ölçebilirsiniz.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Prop'lar {/*props*/}

* `id`: Kullanıcı arayüzünün ölçtüğünüz bölümünü tanımlayan bir string.
* `onRender`: Profilleme yapılan ağaçtaki bileşenler her güncellendiğinde React [`onRender` callback](#onrender-callback)'ini çağırır. Hangi bileşenlerin render edildiği ve ne kadar sürede render edildiği bilgilerini alır.

#### Uyarılar {/*caveats*/}

* Profilleme, ekstra bir yük getirdiği için **varsayılan olarak canlı ortamda devre dışı bırakılmıştır.** Canlı ortamda profilleme yapmak için [profilleme özelliklerinin etkin olduğu özel bir canlı ortam sürümünü etkinleştirmeniz gerekmektedir.](https://fb.me/react-profiling)

---

### `onRender` callback'i {/*onrender-callback*/}

React `onRender` callback`inizi neyin render edildiği bilgisi ile çağıracaktır.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Render zamanlamalarını topla veya log'la...
}
```

#### Parametreler {/*onrender-parameters*/}

<<<<<<< HEAD
* `id`: Yeni commit edilmiş `<Profiler>` ağacının `id` string prop'u. Bu, birden fazla profilleyici kullanıyorsanız ağacın hangi bölümünün commit edildiğini belirlemenizi sağlar.
* `phase`: `"mount"`, `"update"` ya da `"nested-update"`. Bu, ağacın ilk kez mi yüklendiğini yoksa prop, state veya hook'lardaki bir değişiklik nedeniyle mi yeniden render edildiğini bilmenizi sağlar.
* `actualDuration`: Mevcut güncelleme için `<Profiler>` ve onun alt öğelerini render etmek için harcanan milisaniye sayısı. Bu, alt ağacın memoizasyondan ne kadar iyi yararlandığını gösterir (örneğin [`memo`](/reference/react/memo) ve [`useMemo`](/reference/react/useMemo)). İdeal olarak, bu değer ilk yüklemeden sonra önemli ölçüde azalmalıdır, çünkü alt öğelerin birçoğu yalnızca belirli prop'ları değiştiğinde yeniden render edilmedir.
* `baseDuration`: Herhangi bir optimizasyon olmadan tüm `<Profiler>` alt ağacını yeniden render etmenin ne kadar zaman alacağını tahmin eden milisaniye sayısı. Ağaçtaki her bileşenin en son render süreleri toplanarak hesaplanır. Bu değer, render işleminin en kötü senaryo maliyetini tahmin eder (örn. ilk yükleme işlemi veya memoizasyon olmayan bir ağaç). Memoizasyonun çalışıp çalışmadığını görmek için `actualDuration` ile karşılaştırın.
* `startTime`: React'in mevcut güncellemeyi ne zaman render etmeye başladığını gösteren sayısal bir zaman damgası.
* `endTime`: React'in geçerli güncellemeyi ne zaman commit ettiğini gösteren sayısal bir zaman damgası. Bu değer, istenirse gruplandırılabilmeleri için bir committeki tüm profilleyiciler arasında paylaşılır.
=======
* `id`: The string `id` prop of the `<Profiler>` tree that has just committed. This lets you identify which part of the tree was committed if you are using multiple profilers.
* `phase`: `"mount"`, `"update"` or `"nested-update"`. This lets you know whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or Hooks.
* `actualDuration`: The number of milliseconds spent rendering the `<Profiler>` and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. [`memo`](/reference/react/memo) and [`useMemo`](/reference/react/useMemo)). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
* `baseDuration`: The number of milliseconds estimating how much time it would take to re-render the entire `<Profiler>` subtree without any optimizations. It is calculated by summing up the most recent render durations of each component in the tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization). Compare `actualDuration` against it to see if memoization is working.
* `startTime`: A numeric timestamp for when React began rendering the current update.
* `commitTime`: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.
>>>>>>> 556063bdce0ed00f29824bc628f79dac0a4be9f4

---

## Kullanım {/*usage*/}

### Render performansının programatik olarak ölçülmesi {/*measuring-rendering-performance-programmatically*/}

Render performansını ölçmek için `<Profiler>` bileşenini bir React ağacının etrafına sarın.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

`<Profiler>` iki prop alır: bir `id` (string) ve React'in ağaç içinde bir bileşen her güncelleme "commit" ettiğinde çağırdığı `onRender` callback'i (fonksiyon). 

<Pitfall>

Profilleme, ekstra bir yük getirdiği için **varsayılan olarak canlı ortamda devre dışı bırakılmıştır.** Canlı ortamda profilleme yapmak için [profilleme özelliklerinin etkin olduğu özel bir canlı ortam sürümünü etkinleştirmeniz gerekmektedir.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>`, ölçümleri programatik olarak toplamanızı sağlar. Etkileşimli bir profilleyici arıyorsanız, [React Developer Tools](/learn/react-developer-tools) içindeki Profiler sekmesini deneyin. Benzer işlevselliği bir tarayıcı uzantısı olarak sunar.

</Note>

---

### Uygulamanın farklı bölümlerinin ölçülmesi {/*measuring-different-parts-of-the-application*/}

Uygulamanızın farklı bölümlerini ölçmek için birden fazla `<Profiler>` bileşeni kullanabilirsiniz:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Ayrıca `<Profiler>` bileşenlerini iç içe geçirebilirsiniz:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>` bileşeni hafif bir bileşen olsa da, sadece gerektiği zaman kullanılmalıdır. Her kullanım uygulamaya CPU ve bellek yükü ekler.

---

