import React from 'react';

export function Option(props) {
    const option = props.value || {};
    let spanClass = 'OptionText';
    if (option.isSelected) {
        spanClass += ' is-selected bold';
    }

    return (
        <li className={spanClass} onClick={() => props.onClick(option)}>
            <span>{option.description}</span>
        </li>
    )
}
