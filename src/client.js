const R = require("ramda");
const Eth = require("./../../../eth/ethfp");
const eth = Eth.Api(Eth.Provider("http://maiavictor.com:8545"));
const defaultAccount = Eth.Account.fromPrivate("0x0000000000000000000000000000000000000000000000000000000000000001");

class Input extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: props.value || "",
      focused: false
    };
  }
  onFocus(e) {
    if (!this.props.disabled) {
      this.setState({focused: true});
    }
  }
  onBlur(e) {
    if (!this.props.disabled) {
      this.setState({focused: false});
    }
  }
  onChange(e) {
    if (!this.props.disabled) {
      this.setState({value: e.target.value});
      this.props.onChange && this.props.onChange(e.target.value);
    } else {
      e.preventDefault();
    }
  }
  render() {
    const defaulted = this.state.value === "" && !this.state.focused;
    return <input
      style={R.merge(this.props.style, !defaulted ? {} : {fontStyle: "italic", color: "#A0A0A0"})}
      value={!defaulted ? this.state.value : this.props.defaultValue}
      onChange={this.onChange.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onBlur={this.onBlur.bind(this)}/>
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bytecode: "",
      privateKey: "",
      gas: "",
      chainId: "",
      rawTransaction: "",
      signedTransaction: ""
    }
  }
  set(field) {
    return value => this.setState({[field]: value});
  }
  sign() {
    console.log(this.state.bytecode);
    eth.addTransactionDefaults({
      data: this.state.bytecode,
      from: this.state.address || defaultAccount.address,
      gas: this.state.gas,
      chainId: this.state.chainId,
    }).then(tx => {
      tx.to = "0x";
      this.setState({
        rawTransaction: JSON.stringify(tx),
        signedTransaction: Eth.Account.signTransaction(tx, this.state.privateKey || defaultAccount.privateKey)
      });
    }).catch(e => console.log(e));
  }
  render() {
    return <div>
      <table>
        <tbody>
          <tr>
            <td>Bytecode</td>
            <td><input onChange={e => this.set("bytecode")(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Private Key</td>
            <td><input onChange={e => this.set("privateKey")(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Gas</td>
            <td><input onChange={e => this.set("gas")(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Chain ID</td>
            <td><input onChange={e => this.set("chainId")(e.target.value)}/></td>
          </tr>
          <tr>
            <td>
              <button onClick={this.sign.bind(this)}>
                SIGN
              </button>
            </td>
            <td>
              <p>Raw:</p>
              <p><textarea cols={40} rows={5} value={this.state.rawTransaction}/></p>
              <p>Signed:</p>
              <p><textarea cols={40} rows={5} value={this.state.signedTransaction}/></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

window.onload = function(){
  ReactDOM.render(
    React.createElement(Main),
    document.getElementById("main"));
};
