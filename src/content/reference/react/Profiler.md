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

<<<<<<< HEAD
* `id`: Kullanıcı arayüzünün ölçtüğünüz bölümünü tanımlayan bir string.
* `onRender`: Profilleme yapılan ağaçtaki bileşenler her güncellendiğinde React [`onRender` callback](#onrender-callback)'ini çağırır. Hangi bileşenlerin yeniden render edildiği ve ne kadar sürede render edildiği bilgilerini alır.
=======
* `id`: A string identifying the part of the UI you are measuring.
* `onRender`: An [`onRender` callback](#onrender-callback) that React calls every time components within the profiled tree update. It receives information about what was rendered and how much time it took.
>>>>>>> da93812c7802e916d75bbb293889fda42c8d06aa

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

* `id`: Yeni commit edilmiş `<Profiler>` ağacının `id` string prop'u. Bu, birden fazla profilleyici kullanıyorsanız ağacın hangi bölümünün commit edildiğini belirlemenizi sağlar.
* `phase`: `"mount"`, `"update"` or `"nested-update"`. Bu, ağacın ilk kez mi yüklendiğini yoksa prop, state veya hook'lardaki bir değişiklik nedeniyle mi yeniden render edildiğini bilmenizi sağlar.
* `actualDuration`: Mevcut güncelleme için `<Profiler>` ve onun alt öğelerini render etmek için harcanan milisaniye sayısı. Bu, alt ağacın memoizasyondan ne kadar iyi yararlandığını gösterir (örneğin [`memo`](/reference/react/memo) ve [`useMemo`](/reference/react/useMemo)). İdeal olarak, bu değer ilk yüklemeden sonra önemli ölçüde azalmalıdır, çünkü alt öğelerin birçoğu yalnızca belirli prop'ları değiştiğinde yeniden render edilmedir.
* `baseDuration`: Herhangi bir optimizasyon olmadan tüm `<Profiler>` alt ağacını yeniden render etmenin ne kadar zaman alacağını tahmin eden milisaniye sayısı. Ağaçtaki her bileşenin en son render süreleri toplanarak hesaplanır. Bu değer, render işleminin en kötü senaryo maliyetini tahmin eder (örn. ilk yükleme işlemi veya memoizasyon olmayan bir ağaç). Memoizasyonun çalışıp çalışmadığını görmek için `actualDuration` ile karşılaştırın.
* `startTime`: React'in mevcut güncellemeyi ne zaman render etmeye başladığını gösteren sayısal bir zaman damgası.
* `endTime`: React'in geçerli güncellemeyi ne zaman commit ettiğini gösteren sayısal bir zaman damgası. Bu değer, istenirse gruplandırılabilmeleri için bir committeki tüm profilleyiciler arasında paylaşılır.

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

