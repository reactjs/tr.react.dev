class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Merhaba {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Ali" />,
  document.getElementById('hello-example')
);