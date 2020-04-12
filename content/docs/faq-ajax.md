---
id: faq-ajax
title: AJAX ve APİ'ler
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Nasıl AJAX isteği yapabilirim ? {#how-can-i-make-an-ajax-call}

React ile istediğiniz AJAX kütüphanesini kullanabilirsiniz. Bazı popüler kütüphaneler [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), ve tarayıcıda yerleşik bulunan [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### AJAX isteğini hangi yaşam döngüsü metodunda yapmalıyım ? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Verilerinizi [`componentDidMount`](/docs/react-component.html#mounting) yaşam döngüsü metodu içinde AJAX isteği yaparak doldurabilirsiniz. Veriler alındığında `setState` fonksiyonu ile bileşeninizi güncelleyebilirsiniz.

### Örnek: Yerel bileşen durumlarını ayarlamak için AJAX isteği {#example-using-ajax-results-to-set-local-state}

Aşağıda bulunan bileşende `componentDidMount` içinde AJAX isteği yaparak yerel bileşen durumunuzu nasıl güncelleyeceğinizi gösterir. 

API'dan dönen örnek bir JSON verisi:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Not: Burada hataları yakalamak önemlidir.
        // Bileşenimizde bug bulunmaması için, 'catch ()' bloğu yerine bulunan
        // bu blok içinde hatalar yakalanır.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

[Hooks](https://reactjs.org/docs/hooks-intro.html) ile karşılığı burada: 

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.items);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.name}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
```
