import React, { Component } from 'react';

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
            <a className="fancy-button not-selectable">Przejdź do ćwiczeń<i className="fas fa-play-circle"></i></a>
        ) : (null);

        return(
            <div className="black-box upper-box">
                {title}
                {upperPart}
                {bottomPart}
                {button}
        </div>
        );
    }
}

export default InformationBox;