import React from 'react';
import {Option} from "./Option";

export function Choice(props) {
    const choice = props.choice || {};

    return (
        <div className='choice'>
            <div className='flexContainer'>
                <div>
                    <span className='bold'> > </span>
                </div>
                <div className='margin-left-1'>
                    {choice.content}
                </div>
            </div>

            <ol className='margin-left-1'>
                {(choice.options || []).map(option => (
                    <Option value={option}
                            key={'option-' + option.id}
                            onClick={props.onClick} />
                ))}
            </ol>
        </div>
    );
}

