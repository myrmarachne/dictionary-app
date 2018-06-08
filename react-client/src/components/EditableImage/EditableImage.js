 
import React, { Component } from 'react';

class EditableImage extends Component {

    render(){

        if(this.props.word){

            return (
                <div className="word-photo">
                    <img src={this.props.word.imageUrl} />
                </div>
            );
        } else return (
            <p>Ładowanie ilustracji</p>
        )
    }
}

export default EditableImage;