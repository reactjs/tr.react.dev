---
id: hooks-rules
title: Hook Kuralları
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hook'lar* React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

Hooks JavaScript fonksiyonlarıdır, ancak bunları kullanırken iki kurala uymanız gerekir. Bu kuralları otomatik olarak uygulamak için bir [linter eklentisi](https://www.npmjs.com/package/eslint-plugin-react-hooks) sunuyoruz:

### Sadece En Üst Seviyede Hooks Çağrısı Yapın {#only-call-hooks-at-the-top-level}

**Döngülerde, koşullarda veya iç içe geçmiş fonksiyonlarda Hooks çağrısı yapmayın.** Bunun yerine, Hook'ları her zaman React fonksiyonunuzun en üst seviyesinde kullanın. Bu kuralı uygulayarak, bir bileşenin her render edildiğinde *Hook*'ların aynı sırada çağrıldığından emin olursunuz. React'in çoklu `useState` ve `useEffect` çağrıları arasındaki Hook'ların durumunu doğru şekilde korumasını sağlayan şey budur. Merak ediyorsanız, bunu [aşağıda](#explanation) detaylıca açıklayacağız.

### Sadece React Fonksiyonlarında Hook'ları Çağırın {#only-call-hooks-from-react-functions}

**Sıradan JavaScript fonksiyonlarında Hook'ları çağırmayın** Bunun yerine, bunları yapabilirsiniz:

* ✅ React fonksiyon bileşenlerinden Hook'ları çağırın.
* ✅ Özel Hook'lardan Hook'ları çağırın. [Bir sonraki sayfada](/docs/hooks-custom.html) bunları öğreneceğiz.

Bu kuralı uygulayarak, bir bileşendeki tüm durum bilgisi mantığının kaynak kodundan açıkça görülebildiğinden emin olursunuz.

## ESLint Eklentisi {#eslint-plugin}

Bu iki kuralı uygulayan [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) adında bir ESLint eklentisini yayınladık. Denemek isterseniz, bu eklentiyi projenize ekleyebilirsiniz:

```bash
npm install eslint-plugin-react-hooks
```

```js
// Sizin ESLint yapılandırmanız
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Hook'ların kurallarını kontrol eder
    "react-hooks/exhaustive-deps": "warn" // Efekt bağımlılıklarını kontrol eder
  }
}
```

Gelecekte, bu eklentiyi varsayılan olarak Create React App ve benzeri araç takımlarına eklemeyi düşünüyoruz.

**[Kendi Hook'larınızı](/docs/hooks-custom.html) nasıl yazacağınızı anlatan bir sonraki sayfaya şimdi atlayabilirsiniz.** Bu sayfada, bu kuralların arkasındaki gerekçeyi açıklayarak devam edeceğiz.

## Açıklama {#explanation}

[Daha önce öğrendiğimiz](/docs/hooks-state.html#tip-using-multiple-state-variables) gibi, tek bir bileşende birden fazla State veya Effect Hook'larını kullanabiliriz:


```js
function Form() {
  // 1. name state değişkenini kullan
  const [name, setName] = useState('Mary');

  // 2. Formun devamlılığını sağlamak için bir efekt kullan
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. surname state değişkenini kullan
  const [surname, setSurname] = useState('Poppins');

  // 4. Başlığı güncellemek için bir efekt kullan
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

Peki React, hangi state'in hangi `useState` çağrısına karşılık geldiğini nasıl biliyor? Cevap, **React'in Hook'ların çağrılma sırasına dayalı olmasıdır.** Örneğimiz çalışıyor çünkü Hook çağrılarının sırası her render etmede aynı:

```js
// ------------
// İlk render etme
// ------------
useState('Mary')           // 1. name state değişkenini 'Mary' ile başlat
useEffect(persistForm)     // 2. Formun devamlılığını sağlamak için bir efekt ekle
useState('Poppins')        // 3. surname state değişkenini 'Poppins' ile başlat
useEffect(updateTitle)     // 4. Başlığı güncellemek için bir efekt ekle

// -------------
// İkinci render etme
// -------------
useState('Mary')           // 1. name state değişkenini oku (değişken yoksayılmıştır)
useEffect(persistForm)     // 2. Formun devamlılığını sağlamak efekti değiştir
useState('Poppins')        // 3. Read the surname state variable (değişken yoksayılmıştır)
useEffect(updateTitle)     // 4. Başlığı güncellemek için efekti değiştir

// ...
```

Hook çağrılarının sırası render etmeler arasında aynı olduğu sürece, React bazı yerel state'leri bu çağrıların her biriyle ilişkilendirebilir. Ancak bir koşulun içine bir Hook çağrısı (örneğin, `persistForm` efekti) koyarsak ne olur?

```js
  // 🔴 Bir koşul içerisinde Hook kullanarak ilk kuralı çiğniyoruz
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

İlk render etmede `name !== ''` koşulu `true`, bu yüzden bu Hook'u çalıştırıyoruz. Bununla birlikte, bir sonraki render etmede kullanıcı formu temizleyerek koşulu `false` hale getirebilir. Artık render etme sırasında bu Hook'u atladığımız için, Hook çağrılarının sırası farklılaşıyor:

```js
useState('Mary')           // 1. name state değişkenini oku (değişken yoksayılmıştır)
// useEffect(persistForm)  // 🔴 Bu Hook atlandı!
useState('Poppins')        // 🔴 2 (ama 3'tü). surname state değişkeni okunamadı
useEffect(updateTitle)     // 🔴 3 (ama 4'tü). Efekt değiştirilemedi
```

React, ikinci `useState` Hook çağrısı için ne döneceğini bilemezdi. React, bu bileşendeki ikinci Hook çağrısının, önceki render etme sırasında olduğu gibi, `persistForm` efektine karşılık gelmesini bekliyordu, ancak artık gelmiyor. Bu noktadan itibaren, atladığımızdan sonraki her bir Hook çağrısı da birer birer kayıp, hatalara yol açacaktır.

**Bu yüzden Hook'lar bileşenlerimizin en üst seviyesinde çağrılmalıdır.** Eğer bir efekti koşullu olarak çalıştırmak istiyorsak, bu koşulu Hook'umuzun *içerisine* koyabiliriz:

```js
  useEffect(function persistForm() {
    // 👍 Artık ilk kuralı çiğnemiyoruz
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Eğer [verilen lint kuralını](https://www.npmjs.com/package/eslint-plugin-react-hooks) kullanırsanız, bu sorun için endişelenmenize gerek olmadığını unutmayın.** Ama artık Hook'ların *neden* bu şekilde çalıştığını ve kuralın hangi sorunları önlediğini de biliyorsunuz.

## Sonraki Adımlar {#next-steps}

Sonunda, [kendi Hook'larınızı yazmayı](/docs/hooks-custom.html) öğrenmeye hazırız. Özel Hook'lar, React tarafından sağlanan Hook'ları kendi soyutlamalarınızla birleştirmenize ve farklı bileşenler arasındaki ortak durum mantığını yeniden kullanmanıza olanak sağlar.
