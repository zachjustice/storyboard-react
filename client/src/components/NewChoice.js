import React from 'react';

export function NewChoice(props) {
    return (
        <div className='choice'>
            <div className='flex-container'>
                <div>
                    <span className='bold caret'> > </span>
                </div>
                <div>
                    <span className='bold dir margin-right-0_5'> ~ </span>
                </div>
                <input className='new-choice' placeholder='Continue the story...' onSubmit={() => console.log(this.value)}>
                </input>
            </div>
        </div>
    )
}
