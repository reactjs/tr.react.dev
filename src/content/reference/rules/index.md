---
title: React Kuralları
---

<Intro>
Farklı programlama dillerinin kavramları ifade etmek için kendi yolları olduğu gibi, React'in de kalıpları anlaşılması kolay ve yüksek kaliteli uygulamalar üretecek şekilde ifade etmek için kendi deyimleri -veya kuralları- vardır.
</Intro>

<InlineToc />

---

<Note>
React ile kullanıcı arayüzlerini ifade etme hakkında daha fazla bilgi edinmek için [React'te Düşünme](/learn/thinking-in-react) adresini okumanızı öneririz.
</Note>

Bu bölümde deyimsel React kodu yazmak için izlemeniz gereken kurallar açıklanmaktadır. İdiyomatik React kodu yazmak, iyi organize edilmiş, güvenli ve birleştirilebilir uygulamalar yazmanıza yardımcı olabilir. Bu özellikler uygulamanızı değişikliklere karşı daha dayanıklı hale getirir ve diğer geliştiricilerle, kütüphanelerle ve araçlarla çalışmayı kolaylaştırır.

Bu kurallar **React'in Kuralları** olarak bilinir. Bunlar kuraldır - sadece yönergeler değil - eğer ihlal edilirlerse, uygulamanızda muhtemelen hatalar olacaktır. Ayrıca kodunuz tekdüze hale gelir ve anlaşılması ve mantık yürütülmesi zorlaşır.

Kod tabanınızın React Kurallarına uymasına yardımcı olmak için React'in [ESLint eklentisi](https://www.npmjs.com/package/eslint-plugin-react-hooks) ile birlikte [Strict Mode](/reference/react/StrictMode) kullanmanızı şiddetle tavsiye ederiz. React Kurallarını takip ederek bu hataları bulup giderebilir ve uygulamanızın sürdürülebilirliğini koruyabilirsiniz.

---

## Bileşenler ve Hook'lar saf olmalıdır {/*components-and-hooks-must-be-pure*/}

[Bileşenlerde ve Hook'larda Saflık](/reference/rules/components-and-hooks-must-be-pure) React'in uygulamanızı öngörülebilir, hata ayıklaması kolay ve React'in kodunuzu otomatik olarak optimize etmesini sağlayan temel bir kuralıdır.

* [Bileşenler idempotent olmalıdır](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) - React bileşenlerinin girdilerine (props, state ve context) göre her zaman aynı çıktıyı döndürdüğü varsayılır.
* [Yan etkiler render dışında çalışmalıdır](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) - React, mümkün olan en iyi kullanıcı deneyimini oluşturmak için bileşenleri birden çok kez render edebileceğinden, yan etkiler render içinde çalışmamalıdır.
* [Props and state are immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) - Bir bileşenin prop'ları ve state'i tek bir render'a göre değişmez anlık görüntülerdir. Bunları asla doğrudan değiştirmeyin.
* [Return values and arguments to Hooks are immutable](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Once values are passed to a Hook, you should not modify them. Like props in JSX, values become immutable when passed to a Hook.
* [Values are immutable after being passed to JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Don’t mutate values after they’ve been used in JSX. Move the mutation before the JSX is created.

---

## React calls Components and Hooks {/*react-calls-components-and-hooks*/}

[React is responsible for rendering components and hooks when necessary to optimize the user experience.](/reference/rules/react-calls-components-and-hooks) It is declarative: you tell React what to render in your component’s logic, and React will figure out how best to display it to your user.

* [Never call component functions directly](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Components should only be used in JSX. Don’t call them as regular functions.
* [Never pass around hooks as regular values](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hooks should only be called inside of components. Never pass it around as a regular value.

---

## Rules of Hooks {/*rules-of-hooks*/}

Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called. You need to follow the [Rules of Hooks](/reference/rules/rules-of-hooks) when using them.

* [Only call Hooks at the top level](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.
* [Only call Hooks from React functions](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Don’t call Hooks from regular JavaScript functions.

