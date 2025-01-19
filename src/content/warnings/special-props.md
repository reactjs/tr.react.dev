---
title: Özel Props Uyarısı
---

Bir JSX öğesindeki çoğu prop bileşene iletilir, ancak React tarafından kullanılan ve bu nedenle bileşene iletilmeyen iki özel prop (`ref` ve `key`) vardır.

Örneğin, bir bileşenden `props.key` dosyasını okuyamazsınız. Alt bileşen içinde aynı değere erişmeniz gerekiyorsa, bunu farklı bir prop olarak iletmelisiniz (örn: `<ListItemWrapper key={result.id} id={result.id} />` ve `props.id` oku). Bu gereksiz gibi görünse de, uygulama mantığını ipucundan ayırmak önemlidir