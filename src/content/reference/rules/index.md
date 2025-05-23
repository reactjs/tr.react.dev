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
* [Hook'ların dönüş değerleri ve argümanları değişmezdir](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) - Değerler bir Hook'a aktarıldıktan sonra onları değiştirmemelisiniz. JSX'teki prop'lar gibi, değerler bir Hook'a aktarıldığında değişmez hale gelir.
* [Değerler JSX'e aktarıldıktan sonra değişmez](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) - JSX'te kullanıldıktan sonra değerleri mutasyona uğratmayın. Mutasyonu JSX oluşturulmadan önce taşıyın.

---

## React Bileşenleri ve Hook'ları çağırır {/*react-calls-components-and-hooks*/}

[React, kullanıcı deneyimini optimize etmek için gerektiğinde bileşenleri ve hook'ları oluşturmaktan sorumludur](/reference/rules/react-calls-components-and-hooks) Bildirimseldir: React'e bileşeninizin mantığında neyi oluşturacağını söylersiniz ve React bunu kullanıcınıza en iyi nasıl göstereceğini bulur.

* [Asla bileşen fonksiyonlarını doğrudan çağırmayın](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) - Bileşenler yalnızca JSX içinde kullanılmalıdır. Onları normal fonksiyonlar olarak çağırmayın.
* [Hook'ları asla normal değerler olarak geçirmeyin](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) - Hook'lar yalnızca bileşenlerin içinde çağrılmalıdır. Asla normal bir değer olarak aktarmayın.

---

## Hook Kuralları {/*rules-of-hooks*/}

Hook'lar JavaScript fonksiyonları kullanılarak tanımlanır, ancak nerede çağrılabilecekleri konusunda kısıtlamaları olan özel bir yeniden kullanılabilir UI mantığı türünü temsil ederler. Bunları kullanırken [Hook Kuralları](/reference/rules/rules-of-hooks) kurallarına uymanız gerekir.

* [Hook'ları yalnızca en üst seviyede çağırın](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) - Hook'ları döngüler, koşullar veya iç içe geçmiş fonksiyonlar içinde çağırmayın. Bunun yerine, Hook'ları her zaman React fonksiyonunuzun en üst seviyesinde, herhangi bir erken dönüşten önce kullanın.
* [Hook'ları sadece React fonksiyonlarından çağırın](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) - Hook'ları normal JavaScript fonksiyonlarından çağırmayın.

