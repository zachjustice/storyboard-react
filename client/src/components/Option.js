import React from 'react';
import { connect } from "react-redux";
import {addChoice} from "../actions/ActionCreators";
import {getChoice} from "../services/Choices.service";

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice))
});

function ConnectedOption(props) {
    const option = props.value || {};
    let spanClass = 'OptionText clickable';

    if (props.isHovered) {
        spanClass += ' is-selected';
    }
    if (props.isSelected) {
        spanClass += ' is-selected bold';
    }

    const onClick = async (choiceIndex, option) => {
       const choice = await getChoice(option.nextChoice.id);
       props.addChoice(choiceIndex, choice);
    };

    return (
        <li className={spanClass} onClick={() => onClick(props.choiceIndex, option)}>
            <span>{option.description}</span>
        </li>
    )
}

export default connect(null, mapDispatchToProps)(ConnectedOption);
