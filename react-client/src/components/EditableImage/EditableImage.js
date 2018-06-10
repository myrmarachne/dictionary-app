 
import React, { Component } from 'react';
import './EditableImage.css'

class EditableImage extends Component {
    constructor(props){
        super(props);

        this.state = {
            editIconVisible: true,
        };
    }

    render(){

        if(this.props.word){

            return (
                <div className="word-photo">
                    <div className="wrapper">
                    <i className="fas fa-pencil-alt pencil-icon"></i>
                    <img src={this.props.word.imageUrl} alt={this.props.word.word} />
                    </div>
                </div>
            );
        } else return (
            <p>Ładowanie ilustracji</p>
        )
    }
}

export default EditableImage;