import React from 'react';
import {Option} from "./Option";

export function Choice(props) {
    const choice = props.choice || {};

    return (
        <div className='choice'>
            <div className='flex-container'>
                <div>
                    <span className='bold caret'> > </span>
                </div>
                <div>
                    <span className='bold dir'> ~ </span>
                </div>
                <div className='choice-content'>
                    {choice.content}
                </div>
            </div>

            <ol className='option-list'>
                {(choice.options || []).map(option => (
                    <Option value={option}
                            key={'option-' + option.id}
                            onClick={props.onClick} />
                ))}
            </ol>
        </div>
    );
}

