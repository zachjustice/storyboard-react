import React from 'react';
import PropTypes from 'prop-types';
import {Choice} from "./Choice";

export class Storyboard extends React.Component {

    render() {
        console.log('choices', this.props.choices);
        return (
            <div className='storyboard'>
                {this.props.choices.map((choice, index) => (
                    <Choice key={'choice-' + choice.id}
                            choice={choice}
                            onClick={(choiceId) => this.props.onClick(choiceId, index)}/>
                ))}
            </div>
        )
    }
}

Storyboard.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            next: PropTypes.number.isRequired,
            description: PropTypes.string.isRequired,
        }))
    }))
};

