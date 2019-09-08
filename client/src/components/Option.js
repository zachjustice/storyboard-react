import React from 'react';

function Option(props) {
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
        <li className={spanClass} onClick={() => onClick(props.option)}>
            <span>{props.option.description}</span>
        </li>
    )
}

export default Option;
