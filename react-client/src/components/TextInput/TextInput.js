import React, { Component } from 'react';
import './TextInput.css';

class TextInput extends Component {

  constructor(props){
    super(props);

    this.state = {
        className: undefined,
        inValidClassName: " not-valid"

    };
  }

  static getDerivedStateFromProps(props, state){
    
    const newState = {};

    if (state.className == null && props.className != null){
      newState.className = props.className;
      newState.inValidClassName = " not-valid";
      
      return newState;
    } else return null;
  }

  validate(text){
      if (text.length == 0) {
          this.setState({
            className: this.props.className.concat(this.state.inValidClassName)
          });
        //this.props.validate(false);
      } else {
          this.setState({
              className: this.props.className
          });
        //  this.props.validate(true);
      }
  }

  inputHandler(event){
    this.validate(event.target.value.replace(/\s+/g, ' ').trim());

  }

  render() {

      return(
        <input 
            type="text"
            defaultValue={this.props.defaultValue || ""}
            className={this.state.className || ""}
            onBlur={(event) => this.inputHandler(event)}
            onChange={(event) => this.props.setTranslationParameter(event)} />          
      );
  }
}

export default TextInput;
