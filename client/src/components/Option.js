import React from 'react';

export function Option(props) {
    const option = props.value || {};
    let spanClass = 'OptionText clickable';
    if (props.isHovered) {
        spanClass += ' is-selected';
    }
    if (props.isSelected) {
        spanClass += ' is-selected bold';
    }

    return (
        <li className={spanClass} onClick={() => props.onClick(option)}>
            <span>{option.description}</span>
        </li>
    )
}
