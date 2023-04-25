---
title: Yeni bir React Projesi Başlatma
---

<Intro>

Yeni bir uygulama veya tamamen React ile yeni bir web sitesi oluşturmak istiyorsanız, toplulukta popüler olan React destekli çatılardan birini seçmenizi öneririz. Çatılar, uygulamaların ve sitelerin eninde sonunda ihtiyaç duyacağı yönlendirme, veri alımı ve HTML oluşturma gibi özellikler sunar.

</Intro>

<Note>

**Yerel geliştirme için [Node.js](https://nodejs.org/en/) yüklemelisiniz.** Node.js i canlı ortamda da kullanmayı tercih edebilirsiniz, fakat kullanmak zorunda değilsiniz. Birçok React çatısı, statik bir HTML/CSS/JS klasörüne dışa aktarmayı destekler.

</Note>

## Canlı ortam seviyesi React Çatıları {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/), tam özellikli bir React çatısıdır.** Çok yönlüdür ve her büyüklükte React uygulaması oluşturmanıza olanak tanır-çoğunlukla statik bir blogdan karmaşık bir dinamik uygulamaya kadar. Yeni bir Next.js projesi oluşturmak için terminalinizde şunu çalıştırın:

<TerminalBlock>
npx create-next-app
</TerminalBlock>

Next.js'e yeni başlıyorsanız, [Next.js eğitimi](https://nextjs.org/learn/foundations/about-nextjs)ni takip edebilirsiniz.

Next.js [Vercel](https://vercel.com/) tarafından desteklenmektedir. [Next.js kurulumunu](https://nextjs.org/docs/deployment) herhangi bir Node.js sunucusuna, sunucusuz barındırmaya veya kendi sunucunuza yapabilirsiniz. [Tümüyle statik Next.js uygulamaları](https://nextjs.org/docs/advanced-features/static-html-export) herhangi bir statik barındırmaya kurulabilir.

### Remix {/*remix*/}

**[Remix](https://remix.run/) iç içe yönlendirmeye sahip tam özellikli bir React çatısıdır.** Uygulamanızı iç içe geçmiş parçalara bölebilmenizi sağlar ve bu parçalar, kullanıcı işlemlerine karşılık olarak paralel olarak veri yükleyebilir ve yenilenebilir. Yeni bir Remix projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix'e yeni başlıyorsanız [blog eğitimi](https://remix.run/docs/en/main/tutorials/blog) (kısa) veya [uygulama eğitimi](https://remix.run/docs/en/main/tutorials/jokes) (uzun) ni takip edebilirsiniz.

Remix [Shopify](https://www.shopify.com/) tarafından desteklenmektedir. Yeni bir Remix projesi oluşturduğunuzda,  [dağıtım hedefinizi seçmeniz](https://remix.run/docs/en/main/guides/deployment) gerekmektedir. Bir Remix uygulamasını, bir [adaptör](https://remix.run/docs/en/main/other-api/adapter) kullanarak veya yazarak herhangi bir Node.js veya sunucusuz (serverless) barındırmaya dağıtabilirsiniz.

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) hızlı CMS destekli web siteleri için bir React çatısıdır.** Zengin eklenti ekosistemi ve GraphQL veri katmanı, içeriği, API'leri ve hizmetleri tek bir web sitesinde entegre etmeyi basitleştirir. Yeni bir Gatsby projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsby'e yeni başlıyorsanız, [Gatsby eğitimi](https://www.gatsbyjs.com/docs/tutorial/)ni takip edebilirsiniz.

Gatsby [Netlify](https://www.netlify.com/) tarafından desteklenmektedir. [Tam statik Gatsby sitesini barındırma](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) için herhangi bir statik barındırma hizmetini kullanabilirsiniz. Yalnızca sunucu özelliklerini kullanmayı tercih ederseniz, Gatsby için barındırma sağlayıcınızın bunları desteklediğinden emin olun.

### Expo (yerel uygulamalar için) {/*expo*/}

**[Expo](https://expo.dev/), gerçekten yerel kullanıcı arayüzlerine sahip evrensel Android, iOS ve web uygulamaları oluşturmanıza olanak tanıyan bir React çatısıdır.** [React Native](https://reactnative.dev/) için bir SDK sağlar ve yerel parçaların kullanımını kolaylaştırır. Yeni bir Expo projesi oluşturmak için şunu çalıştırın:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expo'ya yeni başlıyorsanız, [Expo eğitimi](https://docs.expo.dev/tutorial/introduction/)ni takip edebilirsiniz.

Expo [Expo (firma)](https://expo.dev/about) tarafından desteklenmektedir. Expo ile uygulama oluşturmak ücretsizdir ve uygulamalarınızı Google ve Apple uygulama mağazalarına kısıtlama olmaksızın gönderebilirsiniz. Ayrıca Expo, opsiyonel olarak ücretli bulut hizmetleri sunar.

<DeepDive>

#### React'ı bir çatı olmadan kullanabilir miyim? {/*can-i-use-react-without-a-framework*/}

React'i kesinlikle bir çatı (framework) olmadan da kullanabilirsiniz - bu, [Sayfanızın bir bölümü için React'ı kullanın](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) ile açıklanmaktadır **Ancak, tamamen React ile yeni bir uygulama veya site oluşturuyorsanız, bir çatı kullanmanızı öneririz.**

İşte nedeni.


Başlangıçta yönlendirme veya veri alımına ihtiyaç duymasanız bile, bunlar için bazı kütüphaneler eklemek isteyeceksinizdir. Yeni özelliklerle birlikte JavaScript paketiniz büyüdükçe, her rota için kodu bireysel olarak nasıl böleceğinizi bulmanız gerekebilir. Veri alımı ihtiyaçlarınız daha karmaşık hale geldikçe, uygulamanızın çok yavaş hissettiren sunucu-istemci ağ şelaleleriyle karşılaşma olasılığı yüksektir. Kitleniz, kötü ağ koşullarına sahip ve düşük uçlu cihazları olan daha fazla kullanıcıyı içerdiğinde, bileşenlerinizden HTML oluşturarak içeriği erken göstermek isteyeceksiniz - ister sunucuda, ister derleme sırasında. Kodunuzun bir kısmını sunucuda veya derleme sırasında çalıştırmak için kurulumunuzu değiştirmek oldukça zor olabilir.

**Bu sorunlar React'a özgü değildir. İşte bu yüzden Svelte'nin SvelteKit'i, Vue'nun Nuxt'ı ve daha fazlası vardır.** Bu sorunları kendi başınıza çözmek için, paketleyicinizi yönlendiricinizle ve veri alımı kütüphanenizle entegre etmeniz gerekecektir. İlk kurulumu çalıştırmak zor değildir, ancak zamanla büyüyen bir uygulamanın hızlı bir şekilde yüklenmesiyle ilgili birçok ince nokta vardır. Sayfanın gereken verilerle paralel olarak, mümkün olan en az uygulama kodunu göndermek isteyeceksiniz, ancak bunu tek bir istemci-sunucu turunda yapacaksınız. Muhtemelen sayfanın, progresif iyileştirmeyi desteklemek için JavaScript kodunuz çalışmadan önce etkileşimli olmasını isteyeceksiniz. Pazarlama sayfalarınız için JavaScript devre dışı bırakılsa bile her yerde barındırılabilen ve çalışabilen tamamen statik HTML dosyaları oluşturmak isteyebilirsiniz. Bu yetenekleri kendiniz oluşturmak gerçekten iş gerektirir.

**Bu sayfadaki React çatıları, bu tür sorunları varsayılan olarak çözer ve sizden ekstra çalışma gerektirmeden bunları yapar.** Sizin için çok hafif başlamalarına ve ardından uygulamanızı ihtiyaçlarınızla birlikte ölçeklendirmelerine izin verirler. Her React çatısının bir topluluğu vardır, bu nedenle sorulara yanıt bulmak ve araçları yükseltmek daha kolaydır. Çatılar ayrıca kodunuza yapı sağlar, böylece siz ve diğerleri farklı projeler arasında bağlam ve becerileri koruyabilirsiniz. Öte yandan, özel bir kurulumla desteklenmeyen bağımlılık sürümlerinde sıkışma olasılığı daha yüksektir ve esasen kendi çatınızı oluşturacaksınız - her ne kadar topluluksuz ve yükseltme yolu olmayan bir çatı olsa da (ve geçmişte yaptığımızlar gibi daha dağınık tasarlanmış).

Eğer hala ikna olmadıysanız veya uygulamanızın bu çatılar tarafından iyi hizmet edilmeyen sıradışı kısıtlamaları varsa ve kendi özel kurulumunuzu oluşturmak istiyorsanız, sizi durduramayız - devam edin! `react` ve `react-dom`'u npm'den alın, [Vite](https://vitejs.dev/) veya [Parcel](https://parceljs.org/) gibi bir paketleyici ile özel derleme sürecinizi ayarlayın ve yönlendirme, statik üretim veya sunucu tarafı işleme ve daha fazlası için ihtiyaç duyduğunuz diğer araçları ekleyin.
</DeepDive>

## Gelişmiş React çatıları {/*bleeding-edge-react-frameworks*/}

React'ı nasıl daha da geliştirebileceğimizi keşfederken, React'ı çatılarla (özellikle yönlendirme, paketleme ve sunucu teknolojileriyle) daha yakından entegre etmenin, React kullanıcılarının daha iyi uygulamalar geliştirmelerine yardımcı olmak için en büyük fırsatımız olduğunu fark ettik. Next.js ekibi, [React Sunucu Bileşenleri](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) gibi çatı bağımsız gelişmiş React özelliklerinin araştırılması, geliştirilmesi, entegrasyonu ve test edilmesi konusunda bizimle işbirliği yapmayı kabul etti.

Bu özellikler, her geçen gün canlı ortama hazır olmaya daha da yaklaşıyor ve bunları entegre etme konusunda diğer paketleyici ve çatı geliştiricileriyle görüşmeler yapıyoruz. Umut ediyoruz ki, bir veya iki yıl içinde bu sayfadaki tüm çatılar, bu özelliklere tam desteğe sahip olacak. (Eğer bir çatı yazarı olarak bu özelliklerle deney yapmak için bizimle ortaklık kurmak istiyorsanız, lütfen bize bildirin!)

### Next.js (Uygulama Yönlendirici) {/*nextjs-app-router*/}

**[Next.js Uygulama Yönlendiricisi](https://beta.nextjs.org/docs/getting-started), React ekibinin tam yığın mimari vizyonunu gerçekleştirmeyi amaçlayan Next.js API'lerinin yeniden tasarımıdır.** Bu, sunucuda veya hatta derleme sırasında çalışan eşzamansız bileşenlerde veri almanıza olanak tanır.

Next.js [Vercel](https://vercel.com/) tarafından desteklenmektedir. [Next.js uygulama kurulumunu](https://nextjs.org/docs/deployment) herhangi bir NodeJS sunucusu, sunucusuz barındırma veya kendi sunucunuza yapabilirsiniz. Next.js ayrıca [statik dışa aktarma](https://beta.nextjs.org/docs/configuring/static-export)yı da destekler ve bu bir sunucu gerektirmez.

<Pitfall>

Next.js'in Uygulama Yönlendiricisi **şu an beta aşamasında ve henüz canlı ortam kullanımı tavsiye edilmemektedir.** (Mart 2023 itibariyle). Var olan bir Next JS uygulamasında test etmek için, [bu geçiş kılavuzunu takip edebilirsiniz.](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

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

Sunucu Bileşenleri ve Suspense, Next.js özelliklerinden ziyade React özellikleridir. Bununla birlikte, bu özellikleri çatı düzeyinde benimsemek, önemli ölçüde uygulama çalışması gerektiren ve destek almayı gerektiren bir süreçtir. Şu anda, Next.js Uygulama Yönlendiricisi en eksiksiz uygulamadır. React ekibi, bu özellikleri bir sonraki nesil çerçevelerde daha kolay uygulanabilir hale getirmek için paketleyici geliştiricileriyle çalışmaktadır.

</DeepDive>
