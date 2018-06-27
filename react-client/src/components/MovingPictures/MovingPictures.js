import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './MovingPictures.css'

class MovingPictures extends Component {
    constructor(props){
        super(props);
        this.state = {
            index: 0
        };
    }

    componentDidMount(){
        setInterval(this.changeWord.bind(this), 4000, 1);
    }

    changeWord(i){
        const wordsListLength = this.props.words.length;
        var index = (this.state.index + i) % wordsListLength;

        if (index < 0)
            index = index + wordsListLength;

        this.setState({
            index
        });
    }

    renderSlideshow(){
        const currentWord = this.props.words[this.state.index];

        const pictures = this.props.words.map(word => {

            const nameOfClass = (word == currentWord) ? "slideshow-picture-block show" : "slideshow-picture-block";

            return(
                <div key={word.id} className={nameOfClass}>
                    <Link to={`/words/${word.id}`} className="slideshow-picture-link">
                    <img  className="slideshow-picture" src={word.imageUrl || '/empty-image.png'} />
                    </Link>
                    <Link className="picture-caption link-to-word" to={`/words/${word.id}`}>{word.word}</Link>
                </div>
            );
        });


        return(
            <div className="slideshow-block">
                {pictures}
                <div className="display-container">

                    <i className="fas fa-chevron-left" 
                        onClick={() => this.changeWord(-1)}
                    ></i>
                    <i className="fas fa-chevron-right"
                        onClick={() => this.changeWord(1)}
                    ></i>

                </div>
            </div>
        );
    }

    render(){
        return(
            (this.props.words) ? this.renderSlideshow() : null
        );
    }
}

export default MovingPictures;