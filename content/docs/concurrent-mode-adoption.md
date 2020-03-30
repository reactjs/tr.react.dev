---
id: concurrent-mode-adoption
title: Eşzamanlı Mod'u Benimsemek (Deneysel)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Dikkat:
>
>Bu sayfa, **henüz stabil sürümde yer almayan deneysel özellikleri** anlatmaktadır. Canlı ortamda React'in deneysel versiyonlarına güvenmeyin. Bu özellikler, React'in bir parçası olmadan önce büyük oranda ve haber verilmeden değişikliğe uğrayabilir.
>
>Bu dokümantasyonla erken adaptasyon yapanlar ve meraklı insanlar hedeflenmektedir. **Eğer React'te yeniyseniz, bu özellikleri önemsemeyin** -- bunları şu an öğrenmenize gerek yok.

</div>

- [Yükleme](#installation)
  - [Bu Deneysel Sürüm Kimin İçin?](#who-is-this-experimental-release-for)
  - [Eşzamanlı Modu Etkinleştirmek](#enabling-concurrent-mode)
- [Beklenmesi Gerekenler](#what-to-expect)
  - [Göç Adımı: Engelleme Modu](#migration-step-blocking-mode)
  - [Neden Bu Kadar Çok Mod Var?](#why-so-many-modes)
  - [Özellik Karşılaştırması](#feature-comparison)

## Yükleme {#installation}

Eşzamanlı mod sadece React'in [deneysel versiyonlarında](/blog/2019/10/22/react-release-channels.html#experimental-channel) bulunmaktadır. Onları yüklemek için, şu komutu çalıştırın:

```
npm install react@experimental react-dom@experimental
```
**Deneysel versiyonlar için mantıksal versiyonlamanın garantisi yoktur.** Herhangi bir `@experimental` sürümde API'lar eklenebilir, değişebilir veya kaldırılabilir.

**Deneysel versiyonlar sıkça bozucu değişimler içerirler.**

Bu sürümleri kişisel projelerinizde veya bir branch üzerinde deneyebilirsiniz, ancak canlıda kullanılmasını tavsiye etmeyiz. Biz Facebook'ta onları canlıda *kullanıyoruz*, ama bunun nedeni eğer bir şey bozulursa bugları düzeltmek için bizim varolmamız. Sizi uyardık!

### Bu Deneysel Sürüm Kimin İçin? {#who-is-this-experimental-release-for}

Bu sürüm birincil olarak erken adapte edenler, kütüphane yazarları ve meraklı insanlar içindir.

Biz bu kodu canlıda kullanıyoruz (ve işimizi görüyor) ancak hala kimi buglar, eksik özellikler ve dokümantasyonda boşluklar var. Gelecekte yayınlanacak olan kararlı sürüme daha iyi hazırlanabilmek için eşzamanlı modda nelerin çalışmadığı konusunda bilgiye toplamak istiyoruz.

### Eşzamanlı Modu Etkinleştirmek {#enabling-concurrent-mode}

Normalde React'e bir özellik eklediğimizde onu hemen kullanmaya başlayabilirsiniz. Fragment, Context ve hatta Hooks böyle özelliklere bir örnek. Bunları eski kodda herhangi bir değişiklik yapmadan yeni kodda kulanabilirsiniz.

Eşzamanlı mod ise farklı. React'in nasıl çalıştığı konusunda mantıksal değişiklikler ekliyor. Aksi takdirde onun etkinleştirdiği [yeni özellikler](/docs/concurrent-mode-patterns.html) *mümkün  olamazdı*. Bu yüzden izole bir şekilde teker teker yayınlanmak yerine yeni bir "mod" altında gruplandırıldılar.

Eşzamanlı modu sadece belli alt ağaçlarda kullanamazsınız. Onun yerine bugün `ReactDOM.render()` metodunu çağırdığınız yerde kullanmanız gerekiyor.

**Bu tüm `<App />` ağacı için eşzamanlı modu etkinleştirir:**

```js
import ReactDOM from 'react-dom';

// Eğer eskiden
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// kullanıyorduysanız, eşzamanlı modu şunu yazarak etkinleştirebilirsiniz:

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

>Not:
>
>`createRoot` gibi eşzamanlı mod APIları React'in sadece deneysel versiyonlarında bulunmaktadır.

Eşzamanlı modda [daha önce](/blog/2018/03/27/update-on-async-rendering.html) "güvensiz" olarak işaretlenmiş yaşam döngüsü metotları bu sefer gerçekten *güvensizdir* ve bugünkü React'ten dahi daha çok hataya sebep olurlar. Uygulamanızın [Strict Mode](/docs/strict-mode.html) desteği olana dek eşzamanlı modu kullanmanızı önermiyoruz.

## Beklenmesi Gerekenler {#what-to-expect}

If you have a large existing app, or if your app depends on a lot of third-party packages, please don't expect that you can use the Concurrent Mode immediately. **For example, at Facebook we are using Concurrent Mode for the new website, but we're not planning to enable it on the old website.** This is because our old website still uses unsafe lifecycle methods in the product code, incompatible third-party libraries, and patterns that don't work well with the Concurrent Mode.

In our experience, code that uses idiomatic React patterns and doesn't rely on external state management solutions is the easiest to get running in the Concurrent Mode. We will describe common problems we've seen and the solutions to them separately in the coming weeks.

### Migration Step: Blocking Mode {#migration-step-blocking-mode}

For older codebases, Concurrent Mode might be a step too far. This is why we also provide a new "Blocking Mode" in the experimental React builds. You can try it by substituting `createRoot` with `createBlockingRoot`. It only offers a *small subset* of the Concurrent Mode features, but it is closer to how React works today and can serve as a migration step.

To recap:

* **Legacy Mode:** `ReactDOM.render(<App />, rootNode)`. This is what React apps use today. There are no plans to remove the legacy mode in the observable future — but it won't be able to support these new features.
* **Blocking Mode:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. It is currently experimental. It is intended as a first migration step for apps that want to get a subset of Concurrent Mode features.
* **Concurrent Mode:** `ReactDOM.createRoot(rootNode).render(<App />)`. It is currently experimental. In the future, after it stabilizes, we intend to make it the default React mode. This mode enables *all* the new features.

### Why So Many Modes? {#why-so-many-modes}

We think it is better to offer a [gradual migration strategy](/docs/faq-versioning.html#commitment-to-stability) than to make huge breaking changes — or to let React stagnate into irrelevance.

In practice, we expect that most apps using Legacy Mode today should be able to migrate at least to the Blocking Mode (if not Concurrent Mode). This fragmentation can be annoying for libraries that aim to support all Modes in the short term. However, gradually moving the ecosystem away from the Legacy Mode will also *solve* problems that affect major libraries in the React ecosystem, such as [confusing Suspense behavior when reading layout](https://github.com/facebook/react/issues/14536) and [lack of consistent batching guarantees](https://github.com/facebook/react/issues/15080). There's a number of bugs that can't be fixed in Legacy Mode without changing semantics, but don't exist in Blocking and Concurrent Modes.

You can think of the Blocking Mode as a "gracefully degraded" version of the Concurrent Mode. **As a result, in longer term we should be able to converge and stop thinking about different Modes altogether.** But for now, Modes are an important migration strategy. They let everyone decide when a migration is worth it, and upgrade at their own pace.

### Feature Comparison {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Legacy Mode  |Blocking Mode  |Concurrent Mode  |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: Legacy mode has automatic batching in React-managed events but it's limited to one browser task. Non-React events must opt-in using `unstable_batchedUpdates`. In Blocking Mode and Concurrent Mode, all `setState`s are batched by default.

\*\*: Warns in development.
