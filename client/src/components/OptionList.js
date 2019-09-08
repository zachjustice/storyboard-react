import React from 'react';
import Option from "./Option";
import OptionInput from "./OptionInput";
import {addChoice, createChoice, fetchingChoice, createUpdateOptionAction, undoChoiceSelection} from "../actions/ActionCreators";
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
            editingOptionIndex: -1,
            optionDescription: '',
            selectedOptionIndex: -1,
            selectedOptionState: null,
            focusNewOptionInput: false
        };
    }

    render() {
        return (
            <ol className='option-list'>
                {(this.props.options || []).map((option, index) => {
                    if (this.state.editingOptionIndex === index) {
                        return (<OptionInput initialValue={option.description}
                                             onClick={this.onClick}
                                             focus={this.state.focusNewOptionInput}
                                             autofocus={true}
                                             submit={(description) => this.submitOption({...option, description})}
                                             key={'option-' + option.id}/>)
                    } else {
                        return (<Option option={option}
                                        selectOption={(option) => this.selectOption(this.props.choiceIndex, option)}
                                        isSelected={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.selected}
                                        isHovered={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.hovered}
                                        key={'option-' + option.id}/>)
                    }
                })}

                {this.props.isCurrentChoice && (!this.props.options || this.props.options.length < 3) && (
                    <OptionInput initialValue={''}
                                 onClick={this.onClick}
                                 focus={this.state.focusNewOptionInput}
                                 autofocus={this.props.options.length === 0}
                                 submit={this.createOption}/>
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

    onClick = (event) => {
        // reset the selectedOptionIndex so that when the user is no longer using the input, and hits up- or down-arrow
        // it starts at the last/first element, respectively.
        // TODO if event is new-option-input
        this.setState({selectedOptionIndex: -1, selectedOptionState: null, focusNewOptionInput: true});
    };

    onKeyDown = async (event) => {
        const activeElement = document.activeElement;
        console.log('optionlist', event);
        if (activeElement.localName === 'input') {
            console.log('handleKeyDownForInput')
            await this.handleKeyDownForInput(event);
        } else {
            await this.handleKeyDownDefault(event);
        }
    };

    handleKeyDownDefault = async (event) => {
        event.preventDefault();
        switch (event.key) {
            case Keys.up:
                this.moveHoveredOption(-1, this.props.options, this.state.selectedOptionIndex);
                break;
            case Keys.down:
                this.moveHoveredOption(1, this.props.options, this.state.selectedOptionIndex);
                break;
            case Keys.backspace:
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
                const availableOptions = (this.props.options || []);
                const optionIndex = Number(event.key) - Number(Keys.one);
                if (optionIndex < availableOptions.length) {
                    await this.selectOption(this.props.choiceIndex, this.props.options[optionIndex]);
                    this.setState({focusNewOptionInput: false});
                } else if (optionIndex < 3) {
                    // focus new-option input if its available
                    this.setState({selectedOptionIndex: optionIndex, selectedOptionState: null, focusNewOptionInput: true});
                }
                break;
            case Keys.enter:
                this.selectOption(this.props.choiceIndex, this.props.options[this.state.selectedOptionIndex]);
                break;
            case Keys.e:
                console.log('e', this.state.selectedOptionIndex);
                this.setState({editingOptionIndex: this.state.selectedOptionIndex});
                break;
            default:
                break;
        }
    };

    handleKeyDownForInput = async (event) => {
        switch (event.key) {
            case Keys.escape:
                // remove focus from the new-option input.
                this.setState({focusNewOptionInput: false});
                break;
            default:
                break;
        }
    };

    moveHoveredOption = (delta, options, selectedOptionIndex) => {
        let availableOptions = (options || []);
        let currOptionIndex = (selectedOptionIndex + delta) % availableOptions.length;
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

    createOption = async (optionDescription) => {
        return this.props.createOption(optionDescription);
    };

    submitOption = async (option)  => {
        this.props.updateOption(option);
        this.setState({ editingOptionIndex: -1 });
    }
}

export default connect(null, mapDispatchToProps)(OptionList);
