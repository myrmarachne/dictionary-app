import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class InformationBox extends Component {

    render(){

        const title = (this.props.title) ? (
            <div className="box-title">
                {this.props.title}
            </div>
        ) : (null);

        const upperPart = (this.props.upperPart) ? (
            <div className="upper-part">
                {this.props.upperPart}
            </div>
        ) : (null);

        const bottomPart = (this.props.bottomPart) ? (
            <div className="bottom-part">
                {this.props.bottomPart}
            </div>
        ) : (null);
        
        const button = (this.props.button) ? (
            <Link className="fancy-button not-selectable" to={this.props.button}>{
                (this.props.buttonText) ? (this.props.buttonText) : (null)
            } <i className="fas fa-play-circle"></i></Link>
        ) : (null);

        return(
            <div className={(this.props.bottomBox) ? ("black-box bottom-box") : ("black-box upper-box")}>
                {title}
                {upperPart}
                {bottomPart}
                {button}
            </div>
        );
    }
}

export default InformationBox;