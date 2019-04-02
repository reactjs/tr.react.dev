// highlight-range{1-4}
// Context her bir bileşene bağlanmadan bileşen 
// ağacının derinliklerine value geçmemizi sağlar.
// Mevcut tema için bir context oluşturun (varsayılan olarak "light" ile).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Geçerli temayı aşağıdaki ağaca iletmek için bir Provider kullanın.
    // Herhangi bir bileşen ne kadar derin de olursa olsun okuyabilir.
    // Bu örnekte, mevcut değer olarak "dark" geçiyoruz.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// Aradaki bir bileşen artık temayı aşağı aktarmak zorunda değil.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Mevcut tema context'ini okumak için bir contextType atayın.
  // React, en yakın temayı Provider'ı bulacak ve değerini kullanacak.
  // Bu örnekte mevcut tema "dark" 'tır.
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
