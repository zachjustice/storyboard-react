import React from 'react';
import {addChoice} from "../actions/ActionCreators";
import {connect} from "react-redux";
import OptionList from "./OptionList";
import {createOption, updateChoice, updateOption} from "../services/Choices.service";
import {Keys} from "../util/Keys";
import SubmittableInput from "./SubmittableInput";

const mapDispatchToProps = dispatch => ({
    addChoice: (choiceIndex, choice) => dispatch(addChoice(choiceIndex, choice)),
});

export class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatingChoice: false,
        };
    }

    render() {
        return (
            <div className='choice'>
                <div className='flex-container choice-content-container'>
                    <div>
                        <span className='bold caret'> > </span>
                    </div>
                    <div>
                        <span className='bold dir margin-right-0_5'> ~ </span>
                    </div>
                    {this.state.updatingChoice && (
                        <SubmittableInput initialValue={this.props.choice.content}
                                          onClick={() => console.log('TODO Give focus')}
                                          autofocus={true}
                                          focus={this.state.updatingChoice}
                                          submit={(content) => this.submitChoice({...this.props.choice, content})}/>
                    )}
                    {!this.state.updatingChoice && (
                        <div className='choice-content'>
                            {this.props.choice.content}
                        </div>
                    )}

                </div>
                <OptionList
                    choiceId={this.props.choice.id}
                    choiceIndex={this.props.choiceIndex}
                    isCurrentChoice={this.props.isCurrentChoice}
                    createOption={this.createOption}
                    updateOption={this.updateOption}
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
    }

    onKeyDown = (event) => {
        if (event.target.localName === 'input') return;

        if (event.key === Keys.E) {
            console.log('Edit choice content');
            this.setState({updatingChoice: true})
        } else if (event.key === Keys.escape) {
            this.setState({updatingChoice: false})
        }
    };

    addListener() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    removeListener() {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    createOption = async (optionDescription) => {
        const option = await createOption(this.props.choice.id, optionDescription);
        const updatedChoice = {
            ...this.props.choice,
            options: this.props.choice.options.concat(option)
        };
        this.props.addChoice(this.props.choiceIndex - 1, updatedChoice);
        return option;
    };

    updateOption = async (updatedOption) => {
        await updateOption(this.props.choice.id, updatedOption);
        const updatedChoice = {
            ...this.props.choice,
            options: this.props.choice.options.map(oldOption => {
                if (oldOption.id === updatedOption.id) return updatedOption;
                return oldOption;
            })
        };
        this.props.addChoice(this.props.choiceIndex - 1, updatedChoice);
        return updatedOption;
    };

    submitChoice = async (updatedChoice) => {
        await updateChoice(updatedChoice);
        this.props.addChoice(this.props.choiceIndex - 1, updatedChoice);
        this.setState({updatingChoice: false});
        return updatedChoice;
    }
}

export default connect(null, mapDispatchToProps)(Choice);
