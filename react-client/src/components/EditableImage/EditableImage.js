 
import React, { Component } from 'react';
import './EditableImage.css';
import PictureAddBox from '../PictureAddBox/PictureAddBox.js';

class EditableImage extends Component {
    constructor(props){
        super(props);

        this.state = {
            addNewPicture: false
        };
    }

    addNewPicture(){
        this.setState({
            addNewPicture: !this.state.addNewPicture
        });
    }

    render(){

        if(this.props.word){
            return (
                <div className="word-photo">
                        <div className="wrapper" onClick={() => this.addNewPicture()}>
                            <i className="fas fa-pencil-alt pencil-icon"></i>
                            <img src={this.props.word.imageUrl || '/empty-image.png'} alt={this.props.word.word || ''} />
                        </div>
                        
                        <PictureAddBox hidden={!this.state.addNewPicture}
                            toggleVisibility={() => this.addNewPicture()}
                            changePhoto={(link) => this.props.changePhoto(link)} />

                </div>
            );
        } else return (
            <p>Ładowanie ilustracji...</p>
        )
    }
}

export default EditableImage;
