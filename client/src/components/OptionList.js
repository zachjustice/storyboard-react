import React from 'react';
import Option from "./Option";
import {addChoice, createChoice, fetchingChoice} from "../actions/ActionCreators";
import {connect} from "react-redux";

const SelectedOptionsStates = {
    selected: 'selected',
    hovered: 'hovered'
};

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice)),
    createChoice: (choiceIndex, parentOptionId) => dispatch(createChoice(choiceIndex, parentOptionId)),
    fetchingChoice: (choiceIndex) => dispatch(fetchingChoice(choiceIndex)),
});

class OptionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: true,
            optionDescription: '',
        };
    }

    render() {
        return (
            <ol className='option-list'>
                {(this.props.options || []).map((option, index) => (
                    <Option value={option}
                            selectOption={(option) => this.props.selectOption(option)}
                            isSelected={this.props.selectedOptionIndex === index && this.props.selectedOptionState === SelectedOptionsStates.selected}
                            isHovered={this.props.selectedOptionIndex === index && this.props.selectedOptionState === SelectedOptionsStates.hovered}
                            key={'option-' + option.id}/>
                ))}

                {this.props.isCurrentChoice && (!this.props.options || this.props.options.length < 3) && (
                    <li>
                        <input className='new-option'
                               placeholder='Continue the story...'
                               value={this.state.optionDescription}
                               autoFocus={this.props.options.length === 0}
                               ref={this.newOptionInputFocus.ref}
                               onChange={evt => this.onOptionDescriptionChange(evt)}>
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
        this.newOptionInputFocus = this.useFocus();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.newOptionInputFocus.setFocus(this.props.focusNewOptionInput);
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

    createOption = async (optionDescription) => {
        this.setState({submittingNewOption: true});
        await this.props.createOption(optionDescription);
        this.setState({optionDescription: '', submittingNewOption: false});
    };

    onOptionDescriptionChange = (evt) => {
        this.setState({optionDescription: evt.target.value});
    };
}

export default connect(null, mapDispatchToProps)(OptionList);
