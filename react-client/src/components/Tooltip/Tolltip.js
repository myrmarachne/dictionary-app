import React, { Component } from 'react';
import './Tooltip.css'

class Tooltip extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        console.log(this.props.hide);
        return(
            <div className={"tooltip" + ((this.props.hide) ? " disabled" : "")}>
                <span className="tooltip-text">{this.props.text}</span>
                <div class="icons">
                    <i className="far fa-check-circle"
                        onClick={() => this.props.yes()}></i>
                    <i className="far fa-times-circle"
                        onClick={() => this.props.no()}></i>
                </div>

            </div>
        );
    }
}

export default Tooltip;