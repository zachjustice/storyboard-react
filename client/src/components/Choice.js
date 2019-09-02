import React from 'react';
import {addChoice, createChoice, fetchingChoice, undoChoiceSelection} from "../actions/ActionCreators";
import {connect} from "react-redux";
import OptionList from "./OptionList";
import {Keys} from "../util/Keys";
import {createOption, getChoice} from "../services/Choices.service";

const SelectedOptionsStates = {
    selected: 'selected',
    hovered: 'hovered',
};

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice)),
    createChoice: (choiceIndex, parentOptionId) => dispatch(createChoice(choiceIndex, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
    undoChoiceSelection: (choiceIndex) => dispatch(undoChoiceSelection(choiceIndex)),
});

export class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptionIndex: -1,
            selectedOptionState: null,
            focusNewOptionInput: false,
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
                    isCurrentChoice={this.props.isCurrentChoice}
                    selectOption={(option) => this.selectOption(this.props.choiceIndex, option)}
                    createOption={(optionDescription) => this.createOption(this.props.choiceIndex, this.props.choice, optionDescription)}
                    selectedOptionIndex={this.state.selectedOptionIndex}
                    selectedOptionState={this.state.selectedOptionState}
                    focusNewOptionInput={this.state.focusNewOptionInput}
                    options={this.props.choice.options}/>
            </div>
        );
    }

    componentDidMount() {
        this.addListener();
    }

    componentWillUnmount() {
        this.removeListener()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isCurrentChoice) {
            this.addListener();
        } else {
            this.removeListener()
        }

        if (!prevProps.isCurrentChoice && this.props.isCurrentChoice) {
            this.setState({selectedOptionState: SelectedOptionsStates.hovered})
        }
    }

    addListener() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    removeListener() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = async (event) => {
        event.preventDefault();
        const activeElement = document.activeElement;
        if (activeElement.localName === 'input' && this.state.focusNewOptionInput) {
            if (event.keyCode === Keys.escape) {
                // remove focus from the new-option input.
                // reset the selectedOptionIndex so that when the user hits up- or down-arrow it starts at the
                // last/first element, respectively.
                activeElement.blur();
                this.setState({
                    focusNewOptionInput: false,
                    selectedOptionIndex: -1,
                    selectedOptionState: null
                });
            }
            return;
        }

        switch (event.keyCode) {
            case Keys.up:
                this.moveHoveredOption(-1);
                break;
            case Keys.down:
                this.moveHoveredOption(1);
                break;
            case Keys.backspace:
                this.props.undoChoiceSelection(this.props.choiceIndex);
                document.removeEventListener('keydown', this.onKeyDown);
                break;
            case Keys.one:
            case Keys.two:
            case Keys.three:
            case Keys.four:
            case Keys.five:
            case Keys.six:
            case Keys.eight:
            case Keys.nine:
                const availableOptions = (this.props.choice.options || []);
                const optionIndex = event.keyCode - Keys.one;
                if (optionIndex < availableOptions.length) {
                    this.selectOption(this.props.choiceIndex, this.props.choice.options[optionIndex]);
                    this.setState({focusNewOptionInput: false});
                } else if (optionIndex < 3) {
                    // focus new-option input if its available
                    this.setState({selectedOptionIndex: optionIndex, selectedOptionState: null});
                    this.setState({focusNewOptionInput: true});
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
        let currOptionIndex = (this.state.selectedOptionIndex + delta) % availableOptions.length;
        if (currOptionIndex < 0) currOptionIndex = availableOptions.length - 1;
        // TODO:
        // if next option is new-option input, focus new option input
        // if on new-option input and input is empty, move to next option
        // if not new-option input and input is not empty, flash text red (?)
        // if currOptionIndex is greater than three, move to next option

        this.setState({
            selectedOptionIndex: currOptionIndex,
            selectedOptionState: SelectedOptionsStates.hovered
        });
    }
}

export default connect(null, mapDispatchToProps)(Choice);
