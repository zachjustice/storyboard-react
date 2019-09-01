import React from 'react';
import {addChoice, createChoice, fetchingChoice} from "../actions/ActionCreators";
import {connect} from "react-redux";
import OptionList from "./OptionList";
import {Keys} from "../util/Keys";
import {createOption, getChoice} from "../services/Choices.service";

const SelectedOptionsStates = {
    selected: 'selected',
    hovered: 'hovered'
};

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice)  => dispatch(addChoice(choiceIndex, choice)),
    createChoice: (choiceIndex, parentOptionId) => dispatch(createChoice(choiceIndex, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
});

export class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCurrentChoice: true
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
                        {this.props.choice.content}
                    </div>

                </div>
                <OptionList
                    isCurrentChoice={this.state.isCurrentChoice}
                    selectOption={(option) => this.selectOption(this.props.choiceIndex, option)}
                    createOption={(optionDescription) => this.createOption(this.props.choiceIndex, this.props.choice, optionDescription)}
                    selectedOptionIndex={this.state.selectedOptionIndex}
                    selectedOptionState={this.state.selectedOptionState}
                    options={this.props.choice.options} />
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
                break;
            case Keys.one:
            case Keys.two:
            case Keys.three:
            case Keys.four:
            case Keys.five:
            case Keys.six:
            case Keys.eight:
            case Keys.nine:
                let availableOptions = (this.props.choice.options || []);
                if ((event.keyCode - Keys.one) < availableOptions.length) {
                    this.selectOption(this.props.choiceIndex, this.props.choice.options[event.keyCode - Keys.one]);
                }
                break;
            case Keys.enter:
                this.selectOption(this.props.choiceIndex, this.props.choice.options[this.state.selectedOptionIndex]);
                break;
            default:
                return;
        }
    };

    selectOption = async (choiceIndex, option) => {
        if (!option) return;
        document.removeEventListener('keydown', this.onKeyDown);

        this.setState({
            selectedOptionIndex: this.props.choice.options.findIndex(o => o.id === option.id),
            selectedOptionState: SelectedOptionsStates.selected,
            isCurrentChoice: false,
        });

        if (option.nextChoice && option.nextChoice.id) {
            this.props.fetchingChoice(choiceIndex);
            const nextChoice = await getChoice(option.nextChoice.id);
            return this.props.addChoice(choiceIndex, nextChoice);
        } else {
            return this.props.createChoice(choiceIndex, option.id);
        }
    };

    createOption = async (choiceIndex, choice, optionDescription) => {
        const option = await createOption(choice.id, optionDescription);
        const newChoice = {
            ...choice,
            options: choice.options.concat(option)
        };
        return this.props.addChoice(choiceIndex - 1, newChoice);
    };

    moveHoveredOption(delta) {
        let availableOptions = (this.props.choice.options || []);
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
