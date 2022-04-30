class HelloMessage extends React.Component {
  render() {
    return <div>Merhaba {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Ali" />);
