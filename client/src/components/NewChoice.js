import React from 'react';

export class NewChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentOption: props.parentOption,
            choiceContent: ''
        };
    }

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
                           placeholder="What's next...?"
                           onChange={evt => this.onChange(evt)}>
                    </input>
                </div>

                {this.state.choiceContent && (
                    <ol>
                        <span className="clickable" onClick={() => this.props.createChoice(this.state.parentOption.id, this.state.choiceContent)}>
                            Submit
                        </span>
                    </ol>
                )}
            </div>
        )
    }

    onChange(evt) {
        this.setState({
            ...this.state,
            choiceContent: evt.target.value
        });
    }
}
