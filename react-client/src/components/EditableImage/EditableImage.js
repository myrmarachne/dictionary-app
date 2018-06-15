 
import React, { Component } from 'react';
import './EditableImage.css'

class EditableImage extends Component {
    constructor(props){
        super(props);

        this.state = {
        };
    }

    render(){

        if(this.props.word){
            console.log(this.props.word.imageUrl);
            return (
                <div className="word-photo">
                        {(this.props.word.imageUrl != null) ? (
                            <div className="wrapper">
                                <i className="fas fa-pencil-alt pencil-icon"></i>
                                <img src={this.props.word.imageUrl} alt={this.props.word.word} />
                            </div>
                        ) : (
                            <div className="wrapper">
                                <i className="fas fa-pencil-alt pencil-icon"></i>
                                <div className="empty"></div>
                            </div>
                        )} 
                                            
                </div>
            );
        } else return (
            <p>Ładowanie ilustracji</p>
        )
    }
}

export default EditableImage;