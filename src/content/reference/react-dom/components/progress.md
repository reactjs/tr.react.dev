---
title: "<progress>"
---

<Intro>

[Tarayıcıda yerleşik olarak gelen `<progress>` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress), bir ilerleme göstergesi oluşturmanızı sağlar.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<progress>` {/*progress*/}

Ekranda bir ilerleme göstergesi göstermek için [yerleşik tarayıcı bileşeni `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)'i render edin.

```js
<progress value={0.5} />
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Prop'lar {/*props*/}

<<<<<<< HEAD
`<progress>` tüm [ortak eleman prop'larını](/reference/react-dom/components/common#props) destekler.
=======
`<progress>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Ek olarak, `<progress>` bu prop'ları destekler:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): Bir sayı. `value` için maksimum değeri belirtir. Varsayılan değeri `1`'dir.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): `0` ve `max` arasında bir sayı, veya belirsiz (ne zaman tamamlanacağı belli olmayan) ilerlemeler için `null`. Yapılan işin ne kadar tamamlandığını belirtir.

---

## Kullanım {/*usage*/}

### Bir ilerleme göstergesini kontrol etme {/*controlling-a-progress-indicator*/}

Ekranda bir ilerleme göstergesi göstermek için, `<progress>` bileşenini render edin. `0` ve belirlediğiniz `max` değeri arasında bir `value` sayısı girebilirsiniz. Eğer `max` değerini belirtmezseniz, varsayılan değer `1` olarak kabul edilir.

İşlem devam etmiyorsa, ilerleme göstergesini belirsiz bir duruma getirmek için `value={null}` değerini geçin.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
