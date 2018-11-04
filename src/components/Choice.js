import React from 'react';
import {Option} from "./Option";

export function Choice(props) {
    const renderOptions = (options) => {
        return (options || []).map(option => (
            <Option value={option}
                    key={'option-' + option.id}
                    onClick={props.onClick} />
        ));
    };

    const choice = props.choice || {};
    const content = choice.content;

    return (
        <div className='choice'>
            <p>{content}</p>
            <ul>
                {renderOptions(choice.options)}
            </ul>
        </div>
    );
}

