import React, {Component} from 'react';
import './App.css';
import {NewChoice} from './components/NewChoice';
import {getChoice, INITIAL_CHOICE_ID} from './services/Choices.service';
import {cloneDeep} from 'lodash';
import {createChoice} from "./services/Choices.service";
import {createOption} from "./services/Choices.service";
import {Choice} from "./components/Choice";

class App extends Component {
    render() {
        if (!this.state || !this.state.choices) return 'Fetching...';
        if (this.state.error) return 'Error!';

        console.log('App.render', this.state.choices);
        return (
            <div className="App margin-left-1 margin-top-1">
                <div className='storyboard'>
                    {this.state.choices.map((choice, index) => {
                        return (
                            <Choice key={'choice-' + choice.id}
                                    choice={choice}
                                    isCurrentChoice={index === this.state.choices.length - 1}
                                    onClick={(option) => this.choose(choice, option, index)}
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

    async componentWillMount() {
        const firstChoice = await getChoice(INITIAL_CHOICE_ID);
        this.setState({choices: [firstChoice]})
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    choose = async (parentChoice, selectedOption, index) => {
        // update the highlight option
        parentChoice.options = (parentChoice.options || []).map(option => {
            return {
                ...option,
                // isHovered: false,
                // isSelected: option.id === selectedOption.id
            }
        });

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
                // selectedOption: undefined,
                choices: this.state.choices,
                createNewChoice: !nextChoice,
                parentOptionId: selectedOption.id,
            }
        });
    };

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

function hoverSelectedOption(options, selectedOptionIndex) {
    options = cloneDeep(options || []);
    options.forEach(option => option.isHovered = false);
    if (options.length) options[selectedOptionIndex].isHovered = true;
    return options;
}

export default App;
