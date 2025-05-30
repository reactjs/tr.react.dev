---
title: Yeni bir React Projesi Başlatma
---

<Intro>

Yeni bir uygulama veya tamamen React ile yeni bir web sitesi oluşturmak istiyorsanız, toplulukta popüler olan React destekli framework'lerden birini seçmenizi öneririz.

</Intro>


React'ı bir framework olmadan da kullanabilirsiniz; ancak çoğu uygulamanın ve sitenin sonunda kod bölme, yönlendirme, veri çekme ve HTML oluşturma gibi yaygın sorunlara çözümler ürettiğini gördük. Bu sorunlar yalnızca React için değil, tüm UI kütüphaneleri için ortaktır.

Bir framework'le başlayarak, React'e hızlı bir başlangıç yapabilir ve sonrasında kendi framework'ünüzü oluşturmaktan kurtulabilirsiniz.

<DeepDive>

#### React'ı bir framework olmadan kullanabilir miyim? {/*can-i-use-react-without-a-framework*/}

React'i kesinlikle bir framework olmadan da kullanabilirsiniz - bu, [Sayfanızın bir bölümü için React'ı kullanın](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) ile açıklanmaktadır **Ancak, tamamen React ile yeni bir uygulama veya site oluşturuyorsanız, bir framework kullanmanızı öneririz.**

İşte nedeni.


Başlangıçta yönlendirme veya veri alımına ihtiyaç duymasanız bile, bunlar için bazı kütüphaneler eklemek isteyeceksinizdir. Yeni özelliklerle birlikte JavaScript paketiniz büyüdükçe, her rota için kodu bireysel olarak nasıl böleceğinizi bulmanız gerekebilir. Veri alımı ihtiyaçlarınız daha karmaşık hale geldikçe, uygulamanızın çok yavaş hissettiren sunucu-istemci ağ şelaleleriyle karşılaşma olasılığı yüksektir. Kitleniz, kötü ağ koşullarına sahip ve düşük uçlu cihazları olan daha fazla kullanıcıyı içerdiğinde, bileşenlerinizden HTML oluşturarak içeriği erken göstermek isteyeceksiniz - ister sunucuda, ister derleme sırasında. Kodunuzun bir kısmını sunucuda veya derleme sırasında çalıştırmak için kurulumunuzu değiştirmek oldukça zor olabilir.

**Bu sorunlar React'a özgü değildir. İşte bu yüzden Svelte'nin SvelteKit'i, Vue'nun Nuxt'ı ve daha fazlası vardır.** Bu sorunları kendi başınıza çözmek için, paketleyicinizi yönlendiricinizle ve veri alımı kütüphanenizle entegre etmeniz gerekecektir. İlk kurulumu çalıştırmak zor değildir, ancak zamanla büyüyen bir uygulamanın hızlı bir şekilde yüklenmesiyle ilgili birçok ince nokta vardır. Sayfanın gereken verilerle paralel olarak, mümkün olan en az uygulama kodunu göndermek isteyeceksiniz, ancak bunu tek bir istemci-sunucu turunda yapacaksınız. Muhtemelen sayfanın, progresif iyileştirmeyi desteklemek için JavaScript kodunuz çalışmadan önce etkileşimli olmasını isteyeceksiniz. Pazarlama sayfalarınız için JavaScript devre dışı bırakılsa bile her yerde barındırılabilen ve çalışabilen tamamen statik HTML dosyaları oluşturmak isteyebilirsiniz. Bu yetenekleri kendiniz oluşturmak gerçekten iş gerektirir.

Uygulamanızın bu framework'ler tarafından iyi sunulmayan olağandışı kısıtlamaları varsa veya bu sorunları kendiniz çözmeyi tercih ediyorsanız, React ile kendi özel kurulumunuzu yapabilirsiniz. npm'den `react` ve `react-dom`u alın, [Vite](https://vite.dev/) veya [Parcel](https://parceljs.org/) gibi bir bundler ile özel derleme sürecinizi kurun ve yönlendirme, statik oluşturma veya sunucu tarafı oluşturma ve daha fazlası için ihtiyaç duyduğunuz diğer araçları ekleyin.

Eğer hala ikna olmadıysanız veya uygulamanızın bu framework'ler tarafından iyi hizmet edilmeyen sıradışı kısıtlamaları varsa ve kendi özel kurulumunuzu oluşturmak istiyorsanız, sizi durduramayız - devam edin! `react` ve `react-dom`'u npm'den alın, [Vite](https://vitejs.dev/) veya [Parcel](https://parceljs.org/) gibi bir paketleyici ile özel derleme sürecinizi ayarlayın ve yönlendirme, statik üretim veya sunucu tarafı işleme ve daha fazlası için ihtiyaç duyduğunuz diğer araçları ekleyin.
</DeepDive>

## Canlı ortam seviyesi React Framework'leri {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

**[Next.js](https://nextjs.org/), tam özellikli bir React framework'üdür.** Çok yönlüdür ve çoğunlukla, statik bir blogdan karmaşık bir dinamik uygulamaya kadar, her büyüklükte React uygulaması oluşturmanıza olanak tanır. Yeni bir Next.js projesi oluşturmak için terminalinizde şunu çalıştırın:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js'e yeni başlıyorsanız, [Next.js eğitimini](https://nextjs.org/learn/) takip edebilirsiniz.

Next.js [Vercel](https://vercel.com/) tarafından desteklenmektedir. Bir Next.js uygulamasını herhangi bir Node.js sunucusuna, sunucusuz barındırmaya (serverless) veya kendi sunucunuza [yapabilirsiniz](https://nextjs.org/docs/app/building-your-application/deploying). [Tümüyle statik Next.js uygulamaları](https://nextjs.org/docs/advanced-features/static-html-export) herhangi bir statik barındırmaya kurulabilir.

### Remix {/*remix*/}

**[Remix](https://remix.run/) iç içe yönlendirmeye sahip tam özellikli bir React framework'üdür.** Uygulamanızı iç içe geçmiş parçalara bölebilmenizi sağlar ve bu parçalar, kullanıcı işlemlerine karşılık olarak paralel olarak veri yükleyebilir ve yenilenebilir. Yeni bir Remix projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix'e yeni başlıyorsanız [blog eğitimi](https://remix.run/docs/en/main/tutorials/blog) (kısa) veya [uygulama eğitimi](https://remix.run/docs/en/main/tutorials/jokes) (uzun) ni takip edebilirsiniz.

Remix [Shopify](https://www.shopify.com/) tarafından desteklenmektedir. Yeni bir Remix projesi oluşturduğunuzda,  [dağıtım hedefinizi seçmeniz](https://remix.run/docs/en/main/guides/deployment) gerekmektedir. Bir Remix uygulamasını, bir [adaptör](https://remix.run/docs/en/main/other-api/adapter) kullanarak veya yazarak herhangi bir Node.js veya sunucusuz (serverless) barındırmaya dağıtabilirsiniz.

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) hızlı CMS destekli web siteleri için bir React framework'üdür.** Zengin eklenti ekosistemi ve GraphQL veri katmanı, içeriği, API'leri ve hizmetleri tek bir web sitesinde entegre etmeyi basitleştirir. Yeni bir Gatsby projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsby'e yeni başlıyorsanız, [Gatsby eğitimi](https://www.gatsbyjs.com/docs/tutorial/)ni takip edebilirsiniz.

Gatsby [Netlify](https://www.netlify.com/) tarafından desteklenmektedir. [Tam statik Gatsby sitesini barındırma](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) için herhangi bir statik barındırma hizmetini kullanabilirsiniz. Yalnızca sunucu özelliklerini kullanmayı tercih ederseniz, Gatsby için barındırma sağlayıcınızın bunları desteklediğinden emin olun.

### Expo (yerel uygulamalar için) {/*expo*/}

**[Expo](https://expo.dev/), gerçekten yerel kullanıcı arayüzlerine sahip evrensel Android, iOS ve web uygulamaları oluşturmanıza olanak tanıyan bir React framework'üdür.** [React Native](https://reactnative.dev/) için bir SDK sağlar ve yerel parçaların kullanımını kolaylaştırır. Yeni bir Expo projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expo'ya yeni başlıyorsanız, [Expo eğitimi](https://docs.expo.dev/tutorial/introduction/)ni takip edebilirsiniz.

Expo [Expo (firma)](https://expo.dev/about) tarafından desteklenmektedir. Expo ile uygulama oluşturmak ücretsizdir ve uygulamalarınızı Google ve Apple uygulama mağazalarına kısıtlama olmaksızın gönderebilirsiniz. Ayrıca Expo, opsiyonel olarak ücretli bulut hizmetleri sunar.

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

React'ı nasıl daha da geliştirebileceğimizi keşfederken, React'ı framework'lerde (özellikle yönlendirme, paketleme ve sunucu teknolojileriyle) daha yakından entegre etmenin, React kullanıcılarının daha iyi uygulamalar geliştirmelerine yardımcı olmak için en büyük fırsatımız olduğunu fark ettik. Next.js ekibi, [React Sunucu Bileşenleri](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) gibi framework bağımsız ileri seviye React özelliklerinin araştırılması, geliştirilmesi, entegrasyonu ve test edilmesi konusunda bizimle işbirliği yapmayı kabul etti.

Bu özellikler, her geçen gün canlı ortama hazır olmaya daha da yaklaşıyor ve bunları entegre etme konusunda diğer paketleyici ve framework geliştiricileriyle görüşmeler yapıyoruz. Umut ediyoruz ki, bir veya iki yıl içinde bu sayfadaki tüm framework'ler, bu özelliklere tam desteğe sahip olacak. (Eğer bir framework yazarı olarak bu özelliklerle deney yapmak için bizimle ortaklık kurmak istiyorsanız, lütfen bize bildirin!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js App Router (Uygulama Yönlendiricisi)](https://nextjs.org/docs), React ekibinin tam yığın mimari vizyonunu gerçekleştirmeyi amaçlayan Next.js API'lerinin yeniden tasarımıdır.** Bu, sunucuda veya hatta derleme sırasında çalışan eşzamansız bileşenlerde veri getirmenize olanak tanır.

Next.js [Vercel](https://vercel.com/) tarafından desteklenmektedir. Bir Next.js uygulamasını herhangi bir Node.js sunucusuna, sunucusuz barındırmaya (serverless) veya kendi sunucunuza [yapabilirsiniz](https://nextjs.org/docs/app/building-your-application/deploying). [Tümüyle statik Next.js uygulamaları](https://nextjs.org/docs/advanced-features/static-html-export) herhangi bir statik barındırmaya kurulabilir.

<DeepDive>

#### React ekibinin eksiksiz mimari vizyonunu hangi özellikler oluşturur? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js'in Uygulama Yönlendiricisi resmi [React Sunucu bileşenleri spesifikasyonlarını](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) tamamen uygular. Bu size, derleme zamanı bileşenleri, sadece sunucu bileşenleri ve inteaktif bileşenlerini tek React ağacı altında karışık olarak kullanmanıza olanak sağlar.

Mesela, sadece sunucu tarafında çalışan, veritabanından veya dosyadan okuma yapan bir React bileşenini `async` fonksiyon olarak yazabilirsiniz. Ardından veriyi alt taraftaki interaktif bileşenlere geçebilirsiniz.

```js
// Bu bileşen *sadece* sunucu tarafında koşar. (veya toplanma sırasında)
async function Talks({ confId }) {
  // 1. Sunucu tarafındasınız, dolayısıyla data katmanı ile direkt iletişim kurabilirsin. API ucu gerekmiyor.
  const talks = await db.Talks.findAll({ confId });

  // 2. herhangi bir render mantığı oluşturabilirsiniz. Bu istemci tarafındaki javascript boyutunuzu arttırmayacaktır.
  const videos = talks.map(talk => talk.video);

  // 3. Oluşan veriyi tarayıcıda çalışacak ilgili bileşene geçiniz.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js'in Uygulama Yönlendiricisi ayrıca [Suspense ile data getirme](/blog/2022/03/29/react-v18#suspense-in-data-frameworks) ile entegre çalışmaktadır. Bu, React ağacınızdaki kullanıcı arayüzünüzün farklı bölümleri için bir yükleme durumu (iskelet yer tutucu gibi) belirtmenize olanak tanır.

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Sunucu Bileşenleri ve Suspense, Next.js özelliklerinden ziyade React özellikleridir. Bununla birlikte, bu özellikleri framework düzeyinde benimsemek, önemli ölçüde uygulama çalışması gerektiren ve destek almayı gerektiren bir süreçtir. Şu anda, Next.js Uygulama Yönlendiricisi en eksiksiz uygulamadır. React ekibi, bu özellikleri bir sonraki nesil çerçevelerde daha kolay uygulanabilir hale getirmek için paketleyici geliştiricileriyle çalışmaktadır.

</DeepDive>
