import React from 'react';

export function Option(props) {
    const option = props.value || {};

    let spanClass = 'OptionText';
    if (option.isSelected) spanClass += ' bold';

    return (
        <li onClick={() => props.onClick(option)}>
            <span className={spanClass}>{option.description}</span>
        </li>
    )
}
