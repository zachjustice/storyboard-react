import React from 'react';

function Option(props) {
    const option = props.value || {};
    let spanClass = 'OptionText clickable';

    if (props.isHovered) {
        spanClass += ' is-selected';
    }
    if (props.isSelected) {
        spanClass += ' is-selected bold';
    }

    const onClick = async (option) => {
       return await props.selectOption(option);
    };

    return (
        <li className={spanClass} onClick={() => onClick(option)}>
            <span>{option.description}</span>
        </li>
    )
}

export default Option;
