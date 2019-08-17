import React from 'react';
import {createChoice} from '../services/Choices.service';

export class NewChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            choiceContent: '',
            editing: false,
        };
    }

    updateInputValue = (evt) => {
        this.setState({
            ...this.state,
            choiceContent: evt.target.value,
            editing: true,
        });
    };

    submit = async () => {
        await createChoice(this.state.parentOptionId, this.state.choiceContent)
    };

    render() {
        return (
            <div className='choice'>
                <div className='flex-container'>
                    <div>
                        <span className='bold caret'> > </span>
                    </div>
                    <div>
                        <span className='bold dir margin-right-0_5'> ~ </span>
                    </div>
                    <input className='new-choice'
                           placeholder='Continue the story...'
                           value={this.state.choiceContent}
                           onChange={this.updateInputValue}
                           onSubmit={this.submit}
                    >
                    </input>
                </div>
                {this.state.editing &&
                    <ol>
                        <li onClick={this.submit}>Save</li>
                        <li>Delete</li>
                    </ol>
                }
            </div>
        )
    }
}
