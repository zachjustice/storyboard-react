import React from 'react';

export function Option(props) {
    const option = props.value || {};

    let spanClass = 'OptionText';
    if (props.isSelected) spanClass += ' bold';

    return (
        <li onClick={props.onClick}>
            <span className={spanClass}>{option.description}</span>
        </li>
    )
}
