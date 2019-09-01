import React from 'react';
import Option from "./Option";
import {Keys} from '../util/Keys';
import {selectOption, createChoice, fetchingChoice} from "../actions/ActionCreators";
import {connect} from "react-redux";
import {getChoice} from "../services/Choices.service";

const SelectedOptionsStates = {
    selected: 'selected',
    hovered: 'hovered'
};

const mapDispatchToProps = dispatch => ({
    selectOption: (choiceIndex, choice)  => dispatch(selectOption(choiceIndex, choice)),
    createChoice: (choiceIndex, parentOptionId) => dispatch(createChoice(choiceIndex, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
});

export class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: props.choice,
            optionDescription: '',
            selectedOptionIndex: null,
            selectedOptionState: SelectedOptionsStates.hovered
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
                    {(this.state.choice.options || []).map((option, index) => (
                        <Option value={option}
                                selectOption={(option) => this.selectOption(this.props.choiceIndex, option)}
                                isSelected={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.selected}
                                isHovered={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.hovered}
                                key={'option-' + option.id}/>
                    ))}
                    {(!this.state.choice.options || this.state.choice.options.length < 3) && (
                        <li>
                            <input className='new-option'
                                   placeholder="Continue the story..."
                                   value={this.state.optionDescription}
                                   onChange={evt => this.onOptionDescriptionChange(evt)}>
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

    componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = async (event) => {
        const activeElement = document.activeElement;
        if (activeElement.localName === 'input') {
            if (event.keyCode === Keys.escape) {
                activeElement.blur();
            }
            return;
        }

        switch (event.keyCode) {
            case Keys.up:
                this.moveHoveredOption(-1);
                event.preventDefault();
                break;
            case Keys.down:
                this.moveHoveredOption(1);
                event.preventDefault();
                break;
            case Keys.backspace:
                /*
                TODO dispatch event
                if (this.state.choices.length > 1 && !this.state.createChoice) {
                    this.setState({
                        ...this.state,
                        choices: this.state.choices.splice(0, this.state.choices.length - 1)
                    });
                }
                this.setState((state) => {
                    state.choices[state.choices.length - 1].options.forEach((o, index) => {
                        if (o.isSelected) {
                            // currOptionIndex = index
                        }
                        // o.isHovered = o.isSelected;
                        // o.isSelected = false;
                    });
                    return {
                        choices: state.choices,
                        createChoice: false
                    }
                });
                 */
                break;
            case Keys.one:
            case Keys.two:
            case Keys.three:
            case Keys.four:
            case Keys.five:
            case Keys.six:
            case Keys.eight:
            case Keys.nine:
                let availableOptions = (this.state.choice.options || []);
                if ((event.keyCode - Keys.one) < availableOptions.length) {
                    this.selectOption(this.props.choiceIndex, this.state.choice.options[event.keyCode - Keys.one]);
                }
                break;
            case Keys.enter:
                this.selectOption(this.props.choiceIndex, this.state.choice.options[this.state.selectedOptionIndex]);
                break;
            default:
                return;
        }
    };

    createOption = async () => {
        this.setState({ submittingNewOption: true, });

        const option = await this.props.createOption(this.state.choice, this.state.optionDescription);

        this.setState((state) => ({
            choice: {
                ...state.choice,
                options: state.choice.options.concat(option)
            },
            optionDescription: '',
            submittingNewOption: false,
        }))
    };

    onOptionDescriptionChange = (evt) => {
        this.setState({optionDescription: evt.target.value});
    };

    selectOption = async (choiceIndex, option) => {
        if (!option) return;
        document.removeEventListener('keydown', this.onKeyDown);

        this.setState((state) => ({
            selectedOptionIndex: state.choice.options.findIndex(o => o.id === option.id),
            selectedOptionState: SelectedOptionsStates.selected
        }));

        if (option.nextChoice && option.nextChoice.id) {
            this.props.fetchingChoice(choiceIndex);
            const nextChoice = await getChoice(option.nextChoice.id);
            return this.props.selectOption(choiceIndex, nextChoice);
        } else {
            return this.props.createChoice(choiceIndex, option.id);
        }
    };

    moveHoveredOption(delta) {
        let availableOptions = (this.state.choice.options || []);
        let currOptionIndex;
        if (this.state.selectedOptionIndex === null) {
            currOptionIndex = 0;
        } else {
            currOptionIndex = (this.state.selectedOptionIndex + delta) % availableOptions.length;
        }

        if (currOptionIndex === -1) currOptionIndex = availableOptions.length - 1;

        this.setState({
            selectedOptionIndex: currOptionIndex,
            selectedOptionState: SelectedOptionsStates.hovered
        });
    }
}

export default connect(null, mapDispatchToProps)(Choice);
