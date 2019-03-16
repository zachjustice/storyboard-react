import React from 'react';
import {Option} from "./Option";

export class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: props.choice || {},
            optionDescription: '',
        }
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
                    <div className='choice-content'>
                        {this.state.choice.content}
                    </div>
                </div>

                <ol className='option-list'>
                    {(this.state.choice.options || []).map(option => (
                        <Option value={option}
                                key={'option-' + option.id}
                                onClick={this.props.onClick}/>
                    ))}
                    {(!this.state.choice.options || this.state.choice.options.length < 3) && (
                        <li>
                            <input className='new-option'
                                   placeholder="Continue the story..."
                                   onChange={evt => this.onChange(evt)}>
                            </input>
                            <br />
                            <br />
                            <span onClick={() => this.props.createOption(this.state.choice, this.state.optionDescription)}>Submit</span>
                        </li>
                    )}
                </ol>
            </div>
        );
    }

    onChange = (evt) => {
        this.setState({
            ...this.state,
            optionDescription: evt.target.value
        });
    }
}

