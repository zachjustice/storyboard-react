import React from 'react';
import {Option} from "./Option";
import {cloneDeep} from 'lodash';

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
                                   value={this.state.optionDescription}
                                   onChange={evt => this.onChange(evt)}>
                            </input>
                        </li>
                    )}
                    {(this.state.optionDescription && !this.state.submittingNewOption &&
                        <span className="clickable"
                              onClick={() => this.createOption()}>
                            Submit
                        </span>
                    )}
                    {(this.state.optionDescription && this.state.submittingNewOption &&
                        <span>...</span>
                    )}
                </ol>
            </div>
        );
    }

    createOption = async () => {
        this.setState((state) => {
            return {
                ...state,
                submittingNewOption: true,
            }
        });

        const option = await this.props.createOption(this.state.choice, this.state.optionDescription);
        const choice = cloneDeep(this.state.choice);
        choice.options = this.state.choice.options.concat(option);

        this.setState((state) => {
            return {
                ...state,
                choice,
                optionDescription: '',
                submittingNewOption: false,
            }
        })
    };

    onChange = (evt) => {
        this.setState({
            ...this.state,
            optionDescription: evt.target.value
        });
    }
}

