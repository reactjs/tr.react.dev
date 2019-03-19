---
id: hooks-intro
title: Hook Tanıtımı
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hook'lar* React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" diyeceğimiz yeni bir state değişkeni tanımlayın
  const [count, setCount] = useState(0);

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

Bu yeni `useState` fonksiyonu öğreneceğimiz ilk "Hook", ancak bu örnek sadece kısa bir tanıtım. Henüz bir anlam ifade etmiyorsa endişelenmeyin!

**[Bir sonraki sayfada](/docs/hooks-overview.html) Hook'ları öğrenmeye başlayabilirsiniz.** Bu sayfada, React'e Hook'ları neden eklediğimizi ve harika uygulamalar yazmanıza nasıl yardımcı olabileceklerini açıklayarak devam edeceğiz.

>Not
>
>React 16.8.0, Hook'ları destekleyen ilk sürümdür. Sürüm yükseltme yaparken, React DOM dahil olmak üzere tüm paketleri güncellemeyi unutmayın. React Native, Hook'ları bir sonraki stabil sürümde destekleyecek.

## Tanıtım Videosu {#video-introduction}

React 2018 Konferansı'nda, Sophie Alpert ve Dan Abramov Hook'ları tanıttı, ardından Ryan Florence bunları kullanmak için bir uygulamanın nasıl yeniden yapılandırılacağını gösterdi. Videoyu buradan izleyin:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Mevcut Kodu Bozan Değişiklikler Yok {#no-breaking-changes}

Devam etmeden önce, unutmayın ki Hook'lar:

* **Tamamen yerleşiktir.** Hook'ları mevcut herhangi bir kodu tekrar yazmadan birkaç bileşende deneyebilirsiniz. Fakat istemiyorsanız şu anda Hook'ları öğrenmek veya kullanmak zorunda değilsiniz.
* **100% geriye uyumludur.** Hook'lar mevcut kodu bozan herhangi bir değişiklik içermiyor.
* **Şu an kullanılabilir.** Hook'lar v16.8.0 sürümünün yayımlanması ile şu an kullanıma uygundur.

**React'ten sınıfları kaldırmak gibi bir planımız yok.** Hook'lar için kademeli kabul stratejisi hakkında daha fazla bilgiyi bu sayfanın [alt kısmında](#gradual-adoption-strategy) bulabilirsiniz.

**Hook'lar, React kavramları hakkındaki bilgilerinizin yerini almaz.** Bunun yerine, Hook'lar zaten bildiğiniz React kavramlarına (props, state, context, refs ve lifecycle) daha doğrudan bir API sağlar. Daha sonra göstereceğimiz gibi, Hook'lar bunları bir araya getirmek için yeni bir güçlü yol sunar.

**Sadece Hook'ları öğrenmeye başlamak istiyorsanız, [doğrudan bir sonraki sayfaya atlamaktan](/docs/hooks-overview.html) çekinmeyin!** Ayrıca neden Hook'ları eklediğimizi ve uygulamalarımızı yeniden kodlamadan nasıl kullanmaya başlayacağımızı öğrenmek için bu sayfayı okumaya devam edebilirsiniz.

## Motivasyon {#motivation}

Hook'lar, React'te beş yıldan fazla bir süredir yazdığımız ve on binlerce bileşenin bakımını yaptığımız çok çeşitli görünüşte birbirinden bağımsız sorunları çözüyor. React'i öğreniyor, günlük hayatınızda kullanıyor veya hatta benzer bir bileşen modeline sahip farklı bir kütüphaneyi tercih ediyor da olsanız, bu sorunların bazılarını fark edebilirsiniz.

### It's hard to reuse stateful logic between components {#its-hard-to-reuse-stateful-logic-between-components}

React doesn't offer a way to "attach" reusable behavior to a component (for example, connecting it to a store). If you've worked with React for a while, you may be familiar with patterns like [render props](/docs/render-props.html) and [higher-order components](/docs/higher-order-components.html) that try to solve this. But these patterns require you to restructure your components when you use them, which can be cumbersome and make code harder to follow. If you look at a typical React application in React DevTools, you will likely find a "wrapper hell" of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions. While we could [filter them out in DevTools](https://github.com/facebook/react-devtools/pull/503), this points to a deeper underlying problem: React needs a better primitive for sharing stateful logic.

With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. **Hooks allow you to reuse stateful logic without changing your component hierarchy.** This makes it easy to share Hooks among many components or with the community.

We'll discuss this more in [Building Your Own Hooks](/docs/hooks-custom.html).

### Complex components become hard to understand {#complex-components-become-hard-to-understand}

We've often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in `componentDidMount` and `componentDidUpdate`. However, the same `componentDidMount` method might also contain some unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

In many cases it's not possible to break these components into smaller ones because the stateful logic is all over the place. It's also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.

To solve this, **Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)**, rather than forcing a split based on lifecycle methods. You may also opt into managing the component's local state with a reducer to make it more predictable.

We'll discuss this more in [Using the Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Classes confuse both people and machines {#classes-confuse-both-people-and-machines}

In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, **Hooks let you use more of React's features without classes.** Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don't require you to learn complex functional or reactive programming techniques.

>Examples
>
>[Hooks at a Glance](/docs/hooks-overview.html) is a good place to start learning Hooks.

## Gradual Adoption Strategy {#gradual-adoption-strategy}

>**TLDR: There are no plans to remove classes from React.**

We know that React developers are focused on shipping products and don't have time to look into every new API that's being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** There is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mindshift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.

We intend for Hooks to cover all existing use cases for classes, but **we will keep supporting class components for the foreseeable future.** At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

## Frequently Asked Questions {#frequently-asked-questions}

We've prepared a [Hooks FAQ page](/docs/hooks-faq.html) that answers the most common questions about Hooks.

## Next Steps {#next-steps}

By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don't worry! **Let's now go to [the next page](/docs/hooks-overview.html) where we start learning about Hooks by example.**
