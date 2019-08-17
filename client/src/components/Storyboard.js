import React from 'react';
import {Choice} from "./Choice";

export function Storyboard(props) {
    return (
        <div className='storyboard'>
            {props.choices.map((choice, index) => {
                return (
                    <Choice key={'choice-' + choice.id}
                            choice={choice}
                            isCurrentChoice={index === props.choices.length - 1}
                            onClick={(option) => props.onClick(choice, option, index)}
                            createOption={props.createOption}/>
                )
            })}
        </div>
    )
}
