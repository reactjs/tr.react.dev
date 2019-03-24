class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar bileşeni fazladan "theme" prop almak zorundadır
  // ve onu ThemedButton'a geçirmek zorundadır. Bu biraz zahmetli olabilir
  // eğer uygulamadaki her button theme'yi bilmek zorunda ise zahmetli olabilir
  // çünkü o tüm bileşenler üzerinden geçirimek zorunda kalır.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
