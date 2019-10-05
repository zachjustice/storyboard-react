import React from 'react';
import Option from "./Option";
import SubmittableInput from "./SubmittableInput";
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
    createChoice: (choiceIndex, parentChoiceId, parentOptionId) => dispatch(createChoice(choiceIndex, parentChoiceId, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
    undoChoiceSelection: (choiceIndex) => dispatch(undoChoiceSelection(choiceIndex)),
});

class OptionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatingOptionIndex: -1,
            optionDescription: '',
            selectedOptionIndex: -1,
            selectedOptionState: null,
            // focus new-option-input if there are no options
            focusOptionInput: props.options.length === 0,
        };
    }

    render() {
        return (
            <ol className='option-list'>
                {(this.props.options || []).map((option, index) => {
                    if (this.state.updatingOptionIndex === index) {
                        return (<SubmittableInput autofocus={true}
                                                  focus={this.state.focusOptionInput}
                                                  key={'option-' + option.id}
                                                  onClick={this.onClick}
                                                  placeholder='Perhaps something else, then?'
                                                  submit={(description) => this.submitUpdatedOption({
                                                      ...option,
                                                      description
                                                  })}
                                                  initialValue={option.description}/>)
                    } else {
                        return (<Option option={option}
                                        selectOption={(option) => this.selectOption(this.props.choiceIndex, this.props.choiceId, option)}
                                        isSelected={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.selected}
                                        isHovered={this.state.selectedOptionIndex === index && this.state.selectedOptionState === SelectedOptionsStates.hovered}
                                        key={'option-' + option.id}/>)
                    }
                })}

                {this.props.isCurrentChoice && this.state.updatingOptionIndex === -1 && (!this.props.options || this.props.options.length < 3) && (
                    <SubmittableInput autofocus={this.props.options.length === 0}
                                      focus={this.state.focusOptionInput}
                                      onClick={this.onClick}
                                      placeholder='Continue the story...'
                                      submit={this.createOption}
                                      initialValue={''}/>
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
        this.setState({selectedOptionIndex: -1, selectedOptionState: null, focusOptionInput: true});
    };

    onKeyDown = async (event) => {
        console.log('optionlist', event);
        if (event.target.localName === 'input') {
            if (event.key === Keys.escape) {
                console.log('handleKeyDownForInput');
                this.setState({updatingOptionIndex: -1, focusOptionInput: false});
            }
        } else {
            console.log('handleKeyDownDefault');
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
                    console.log('backspace if');
                    this.props.undoChoiceSelection(this.props.choiceIndex);
                    this.removeListener()
                } else {
                    console.log('backspace else');
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
                    await this.selectOption(this.props.choiceIndex, this.props.choiceId, this.props.options[optionIndex]);
                } else if (optionIndex < 3) {
                    // focus new-option input if its available
                    this.setState({
                        selectedOptionIndex: optionIndex,
                        selectedOptionState: null,
                        focusOptionInput: true
                    });
                }
                break;
            case Keys.enter:
                this.selectOption(this.props.choiceIndex, this.props.choiceId, this.props.options[this.state.selectedOptionIndex]);
                break;
            case Keys.e:
                console.log('e', this.state.selectedOptionIndex);
                this.setState({updatingOptionIndex: this.state.selectedOptionIndex, focusOptionInput: true});
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

    selectOption = async (choiceIndex, choiceId, option) => {
        if (!option) return;
        document.removeEventListener('keydown', this.onKeyDown);

        this.setState({
            selectedOptionIndex: this.props.options.findIndex(o => o.id === option.id),
            selectedOptionState: SelectedOptionsStates.selected,
            isCurrentChoice: false,
            focusOptionInput: false,
            updatingOptionIndex: -1
        });

        if (option.nextChoice && option.nextChoice.id) {
            // make sure the user didn't click a new option in the time it took to fetch the choice
            this.setState({ lastRequestedChoiceId: option.nextChoice.id });
            this.props.fetchingChoice(choiceIndex);
            const nextChoice = await getChoice(option.nextChoice.id);

            if (this.state.lastRequestedChoiceId === nextChoice.id) {
                // it'd be cleaner to use rxjs/a subscription/observable, but i'm lazy and this is easy.
                return this.props.addChoice(choiceIndex, nextChoice);
            }
        } else {
            return this.props.createChoice(choiceIndex, choiceId, option.id);
        }
    };

    createOption = async (optionDescription) => {
        return this.props.createOption(optionDescription);
    };

    submitUpdatedOption = async (option) => {
        await this.props.updateOption(option);
        this.setState({updatingOptionIndex: -1});
    }
}

export default connect(null, mapDispatchToProps)(OptionList);
