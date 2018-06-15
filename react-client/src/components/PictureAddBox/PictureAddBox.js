import React, { Component } from 'react';
import './PictureAddBox.css';
import InformationBox from '../InformationBox/InformationBox';

class PictureAddBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            link: undefined
        }
    }

    componentDidUpdate(prevProps,prevState,snapshot){
        if(this.nameInput)
            this.nameInput.focus();
    }

    changePhoto(){
        this.props.changePhoto(this.state.link);
        this.props.toggleVisibility();
    }

    setLink(event){
        this.setState({
            link: event.target.value
        });
    }
    
    render(){
        const classNames = (this.props.hidden == false) ? ("picture-add") : ("picture-add hidden");
        return (
            <div className={classNames}>
                <div className="fancy-text">Wybierz zdjęcie</div>
                <div className="picture-add-text">Ułatw sobie naukę nowych słówek dodając zdjęcie najlepiej ilustrujące wybrane słówko!</div>
                <input onChange={(event) => this.setLink(event)}
                    className="picture-link" type="text" />

                <i className="far fa-check-circle"
                    onClick={() => this.changePhoto()}></i>

                <i className="far fa-times-circle" 
                    onClick={() => this.props.toggleVisibility()}></i>
            </div>
        );
    }

}

export default PictureAddBox;
