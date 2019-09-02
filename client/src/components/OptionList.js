import React from 'react';
import Option from "./Option";
import {addChoice, createChoice, fetchingChoice, undoChoiceSelection} from "../actions/ActionCreators";
import {connect} from "react-redux";
import {getChoice} from "../services/Choices.service";
import {Keys} from "../util/Keys";

const SelectedOptionsStates = {
    selected: 'selected',
    hovered: 'hovered'
};

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice)),
    createChoice: (choiceIndex, parentOptionId) => dispatch(createChoice(choiceIndex, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
    undoChoiceSelection: (choiceIndex) => dispatch(undoChoiceSelection(choiceIndex)),
});

class OptionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionDescription: '',
            selectedOptionIndex: -1,
            selectedOptionState: null,
            submittingNewOption: false,
        };

        this.newOptionInputFocus = this.useFocus();
    }

    render() {
        return (
            <ol className='option-list'>
                {(this.props.options || []).map((option, index) => (
                    <Option value={option}
                            selectOption={(option) => this.selectOption(this.props.choiceIndex, option)}
                            isSelected={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.selected}
                            isHovered={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.hovered}
                            key={'option-' + option.id}/>
                ))}

                {this.props.isCurrentChoice && (!this.props.options || this.props.options.length < 3) && (
                    <li>
                        <input className='new-option'
                               placeholder='Continue the story...'
                               value={this.state.optionDescription}
                               autoFocus={this.props.options.length === 0}
                               onClick={this.onClick}
                               onChange={evt => this.setOptionDescription(evt.target.value)}
                               ref={this.newOptionInputFocus.ref}>
                        </input>
                    </li>
                )}

                {this.state.optionDescription && !this.state.submittingNewOption && (
                    <span className="clickable"
                          onClick={() => this.createOption(this.state.optionDescription)}>
                            Submit
                    </span>
                )}

                {(this.state.optionDescription && this.state.submittingNewOption &&
                    <span>...</span>
                )}
            </ol>
        )
    }

    componentDidMount() {
        this.addListener();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.isCurrentChoice && this.props.isCurrentChoice) {
            this.setState({selectedOptionState: SelectedOptionsStates.hovered})
        }

        if (this.props.isCurrentChoice) {
            this.addListener();
        } else {
            this.removeListener()
        }
    }

    componentWillUnmount() {
        this.removeListener()
    }

    addListener() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    removeListener() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    useFocus = () => {
        const ref = React.createRef();
        const setFocus = (isFocused) => {
            if (!ref.current) return;
            if (isFocused) {
                ref.current.focus();
            } else {
                ref.current.blur();
            }
        };

        return { setFocus, ref }
    };

    onClick = () => {
        // reset the selectedOptionIndex so that when the user is no longer using the input, and hits up- or down-arrow
        // it starts at the last/first element, respectively.
        this.setState({selectedOptionIndex: -1, selectedOptionState: null});
        this.newOptionInputFocus.setFocus(true);
    };

    onKeyDown = async (event) => {
        const activeElement = document.activeElement;
        if (activeElement.localName === 'input') {
            await this.handleKeyDownForInput(event);
        } else {
            await this.handleKeyDownDefault(event);
        }
    };

    handleKeyDownDefault = async (event) => {
        switch (event.keyCode) {
            case Keys.up:
                event.preventDefault();
                this.moveHoveredOption(-1);
                break;
            case Keys.down:
                event.preventDefault();
                this.moveHoveredOption(1);
                break;
            case Keys.backspace:
                event.preventDefault();
                if (this.props.choiceIndex > 0) {
                    this.props.undoChoiceSelection(this.props.choiceIndex);
                    this.removeEventListener()
                } else {
                    this.setState({selectedOptionIndex: -1, selectedOptionState: null});
                }
                break;
            case Keys.one:
            case Keys.two:
            case Keys.three:
            case Keys.four:
            case Keys.five:
            case Keys.six:
            case Keys.eight:
            case Keys.nine:
                event.preventDefault();
                const availableOptions = (this.props.options || []);
                const optionIndex = event.keyCode - Keys.one;
                if (optionIndex < availableOptions.length) {
                    await this.selectOption(this.props.choiceIndex, this.props.options[optionIndex]);
                    this.newOptionInputFocus.setFocus(false)
                } else if (optionIndex < 3) {
                    // focus new-option input if its available
                    console.log('blur');
                    this.setState({selectedOptionIndex: optionIndex, selectedOptionState: null});
                    this.newOptionInputFocus.setFocus(true)
                }
                break;
            case Keys.enter:
                event.preventDefault();
                this.selectOption(this.props.choiceIndex, this.props.options[this.state.selectedOptionIndex]);
                break;
            default:
                break;
        }
    };

    handleKeyDownForInput = async (event) => {
        switch (event.keyCode) {
            case Keys.escape:
                // remove focus from the new-option input.
                this.newOptionInputFocus.setFocus(false);
                break;
            case Keys.enter:
                this.createOption(this.state.optionDescription);
                break;
            default:
                break;
        }
    };

    moveHoveredOption = (delta) => {
        let availableOptions = (this.props.options || []);
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
    };

    selectOption = async (choiceIndex, option) => {
        if (!option) return;
        document.removeEventListener('keydown', this.onKeyDown);

        this.setState({
            selectedOptionIndex: this.props.options.findIndex(o => o.id === option.id),
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

    setOptionDescription = (optionDescription) => {
        this.setState({optionDescription});
    };

    createOption = async (optionDescription) => {
        this.setState({submittingNewOption: true});
        await this.props.createOption(optionDescription);
        this.setState({optionDescription: '', submittingNewOption: false});
    };
}

export default connect(null, mapDispatchToProps)(OptionList);
