# Çeviri

Şu anki ilerleme: https://github.com/reactjs/tr.reactjs.org/issues/4

# Stil Rehberi

## Başlık Tanımlayıcıları

Bölümlerin başlıkları aşağıdaki gibi süslü parantezler içerisinde yer alan tanımlayıcılara sahiptir:

```md
## Try React {#try-react}
```

**Bu tanımlayıcıları çevirmeyiniz**. Çünkü bu tanımlayıcılar link mantığında çalışırlar ve sayfalar arası gezinme için kullanılırlar. Bu nedenle harici olarak oluşturulurlarsa düzgün çalışmazlar. 

✅ Doğru:

```md
## React'i deneyin {#try-react}
```

❌ Yanlış:

```md
## React'i deneyin {#react-i-deneyin}
```

Bu kullanım, yukarıdaki bağlantının çalışmamasına neden olur.

## Kod Bloklarındaki Metin

Metindeki yorumlar haricinde yer alan kod bloklarını çevirmeyiniz. İsteğe bağlı olarak HTML'de görüntülenecek metinleri çevirebilirsiniz, ancak değişken, fonksiyon adı, sınıf ismi, DOM elemanı id'si gibi kodun çalışmasını direkt olarak etkileyen kısımları çevirmeyiniz. 

Örnek:
```js
// Example
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ Doğru:

```js
// Örnek
const element = <h1>Hello, world</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

✅ Doğru (HTML metin içeriği değişiyor):

```js
// Örnek
const element = <h1>Merhaba dünya</h1>;
ReactDOM.render(element, document.getElementById('root'));
```

❌ YANLIŞ:

```js
// Örnek
const element = <h1>Merhaba dünya</h1>;
// "root", DOM'da yer alan bir elemanın id'sini ifade eder.
// Çevirmeyiniz
ReactDOM.render (element, document.getElementById ('kök'));
```

❌ Kesinlikle yanlış:

```js
// Örnek
const bileşen = <h1>Merhaba dünya</h1>;
ReactDOM.işle(bileşen, document.idKullanarakElemanıGetir('kök'));
```

## Dış Bağlantılar

Sayfada yer alan [MDN] veya [Wikipedia] gibi harici bağlantılar diğer bir bmakaleye yönelikse ve bu makalenin Türkçe dilinde kabul edilebilir kalitede bir sürümü varsa, bağlantıyı bu sürümünkiyle değiştirmeyi düşününüz. Ayrıca Wikipedia Türkiye'de uzun süredir yasaklı olduğu için, Wikipedia linklerini [MDN] veya [EksiSozluk] gibi tanınmış sitelerdeki versiyonları ile değiştirebilirsiniz.

[MDN]: https://developer.mozilla.org/en-US/
[Wikipedia]: https://en.wikipedia.org/wiki/Main_Page
[EksiSozluk]: https://eksisozluk.com/

Örnek:

```md
React elements are [immutable](https://en.wikipedia.org/wiki/Immutable_object).
```

✅ İYİ:

```md
React elemanları [immutable](https://eksisozluk.com/immutable--258199)'dır.
```

Türkçe'de eşdeğeri olmayan (StackOverflow, YouTube videoları vb.) bağlantıların çevirisini yapmayınız.

## Sen ve Siz Kelimeleri

Tutarlılığı korumak ve okura saygı ve incelik ile hitap etmek için, you kelimesini siz olarak ele alınız.

# Ortak çeviriler

Bu tür teknik belgelerde yaygın olarak kullanılan terimlerin çevirisi için bazı öneriler aşağıdaki şekilde sıralanmıştır.

| Orijinal kelime / terim | Öneri |
| ------------------------- | ---------- |
| array              		| array |
| arrow function 			| arrow fonksiyonu |
| bug 						| hata |
| bundler 					| paketleyici |
| callback 					| callback |
| camelCase 				| camelCase |
| controlled component 		| kontrollü component |
| debugging 				| hata ayıklama |
| DOM 						| DOM |
| framework 				| çatı |
| function component 		| fonksiyon component'i |
| hook 						| hook |
| key 						| anahtar |
| lazy initialization 		| lazy başlatım |
| library 					| kütüphane |
| lowercase 				| küçük harf |
| props 					| prop'ları |
| React element 			| React elemanı |
| render 					| render etmek |
| shallow rendering 		| shallow rendering |
| state 					| state |
| string 					| string |
| template literals 		| template literal'leri |
| uncontrolled component 	| kontrolsüz component |