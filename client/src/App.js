import React, {Component} from 'react';
import './App.css';
import {NewChoice} from './components/NewChoice';
import {cloneDeep} from 'lodash';
import {createChoice, createOption} from "./services/Choices.service";
import Choice from "./components/Choice";
import {connect} from "react-redux";

const mapStateToProps = ({ choices }) => ({choices});

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: props.choices
        }
    }

    render() {
        console.log('App.render', this.props.choices);
        if (!this.props || !this.props.choices || !this.props.choices.length) return 'Fetching...';
        if (this.state.error) return 'Error!';

        return (
            <div className="App margin-left-1 margin-top-1">
                <div className='storyboard'>
                    {this.props.choices.map((choice, index) => {
                        return (
                            <Choice key={'choice-' + choice.id}
                                    choice={choice}
                                    choiceIndex={index}
                                    createOption={this.createOption}/>
                        )
                    })}
                </div>
                {this.state.createNewChoice && (
                    <NewChoice parentOption={this.getParentOption()} createChoice={this.createChoice}/>
                )}
                {this.state.loading && '...'}
            </div>
        );
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    /*
    choose = async (parentChoice, selectedOption, index) => {
        // while we fetch the next choice, update the loading prompt
        this.setState((state) => {
            let choices = state.choices.slice(0, index + 1);
            return {
                ...state,
                loading: true,
                createNewChoice: false,
                choices,
            }
        });

        // get the next choice if its available
        let nextChoice;
        if (selectedOption.nextChoice && selectedOption.nextChoice.id) {
            const nextChoiceId = selectedOption.nextChoice.id;
            nextChoice = await getChoice(nextChoiceId);
        }

        this.setState((state) => {
            if (nextChoice) {
                this.state.choices = this.state.choices.concat(nextChoice);
            }

            return {
                ...state,
                loading: false,
                choices: this.state.choices,
                createNewChoice: !nextChoice,
                parentOptionId: selectedOption.id,
            }
        });
    };
     */

    getParentOption() {
        const choicesLen = this.state.choices.length - 1;
        return this.state.choices[choicesLen].options.find(option => option.isSelected);
    }

    createChoice = async (parentOptionId, choiceContent) => {
        this.setState((state) => {
            return {
                ...state,
                loading: true,
                createNewChoice: false,
            };
        });

        const choice = await createChoice(parentOptionId, choiceContent);

        this.state.choices.forEach(currChoice => {
            currChoice.options.forEach(currOption => {
                if (currOption.id === parentOptionId) {
                    currOption.nextChoice = choice;
                }
            })
        });

        this.setState((state) => {
            return {
                ...state,
                loading: false,
                createNewChoice: false,
                choices: state.choices.concat(choice),
            }
        });
    };

    createOption = async (choice, optionDescription) => {
        const option = await createOption(choice.id, optionDescription);

        this.setState((state) => {
            const choices = cloneDeep(state.choices);
            const choiceIndex = state.choices.findIndex(c => choice.id === c.id);
            choices[choiceIndex].options = choices[choiceIndex].options.concat(option);

            return {
                ...state,
                choices,
            }
        });

        return option;
    }
}

const App = connect(mapStateToProps)(ConnectedApp);

export default App;
