import React, {Component} from 'react';
import './App.css';
import {Storyboard} from './components/Storyboard';
import {NewChoice} from './components/NewChoice';
import {getChoice, INITIAL_CHOICE_ID} from './services/Choices.service';
import {cloneDeep} from 'lodash';
import {createChoice} from "./services/Choices.service";
import {createOption} from "./services/Choices.service";

const keys = {
    backspace: 8,
    enter: 13,
    up: 38,
    down: 40,

    one: 49,
    two: 50,
    three: 51,
    four: 52,
    five: 53,
    six: 54,
    seven: 55,
    eight: 56,
    nine: 57
};

class App extends Component {
    render() {
        if (!this.state || !this.state.choices) return 'Fetching...';
        if (this.state && this.state.error) return 'Error!';

        return (
            <div className="App margin-left-1 margin-top-1">
                <Storyboard choices={this.state.choices}
                            onClick={async (parentChoice, selectedOption, index) => await this.choose(parentChoice, selectedOption, index)}
                            createOption={this.createOption}/>
                {this.state.createNewChoice && (
                    <NewChoice parentOption={this.getParentOption()} createChoice={this.createChoice}/>
                )}
                {this.state.loading && '...'}
            </div>
        );
    }

    async componentWillMount() {
        // document.addEventListener('keydown', this.onKeyDown);

        const firstChoice = await getChoice(INITIAL_CHOICE_ID);
        this.setState({choices: [firstChoice]})
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    choose = async (parentChoice, selectedOption, index) => {
        // update the highlight option
        (parentChoice.options || []).forEach(option => {
            option.isSelected = option.id === selectedOption.id;
        });

        // while we fetch the next choice, update the loading prompt
        this.setState((state) => {
            // if we are click an old option, get rid of all the choices after the newly selected current one
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
            let choices = state.choices;
            let createNewChoice = false;
            if (nextChoice) {
                choices = choices.concat(nextChoice);
            } else {
                createNewChoice = true;
            }

            return {
                loading: false,
                selectedOption: undefined,
                choices,
                createNewChoice,
            }
        });
    };

    onKeyDown = (event) => {

        const lastChoice = this.state.choices[this.state.choices.length - 1] || {};
        let availableOptions = (lastChoice.options || []);

        let currOptionIndex = this.state.selectedOption === undefined
            ? -1
            : this.state.selectedOption;

        switch (event.keyCode) {
            case keys.up:
                currOptionIndex = Math.max(currOptionIndex - 1, 0);
                lastChoice.options = updateSelectedOption(availableOptions, currOptionIndex);
                event.preventDefault();
                break;
            case keys.down:
                currOptionIndex = Math.min(currOptionIndex + 1, availableOptions.length - 1);
                lastChoice.options = updateSelectedOption(availableOptions, currOptionIndex);
                event.preventDefault();
                break;
            // todo backspace handling breaks typing
            // case keys.backspace:
            // if (this.state.choices.length > 1) {
            //     this.setState({choices: this.state.choices.splice(0, this.state.choices.length - 1)});
            // }
            // break;
            case keys.one:
            case keys.two:
            case keys.three:
            case keys.four:
            case keys.five:
            case keys.six:
            case keys.eight:
            case keys.nine:
                if (event.keyCode - keys.one < availableOptions.length) {
                    currOptionIndex = event.keyCode - keys.one;
                } else {
                    break;
                }
            // eslint-disable-next-line no-fallthrough
            case keys.enter:
                if (currOptionIndex > -1) {
                    this.choose(
                        lastChoice,
                        availableOptions[currOptionIndex],
                        this.state.choices.length - 1
                    );
                    return;
                }
                break;
            default:
                return;
        }

        if (currOptionIndex > -1) {
            this.setState({selectedOption: currOptionIndex});
        }
    };

    getParentOption() {
        return this.state.choices.flatMap(choice => choice.options).find(option => option.isSelected);
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
        this.setState((state) => {
            return {
                ...state,
                loading: false,
                createNewChoice: false,
                choices: state.choices.concat(choice),
            }
        });
    };

    createOption = async (parentChoice, optionDescription) => {
        const option = await createOption(parentChoice.id, optionDescription);

        this.setState((state) => {
            const choices = cloneDeep(state.choices);
            const choice = choices.find(c => parentChoice.id === c.id);
            choice.options = choice.options.concat(option);

            return {
                ...state,
                choices,
            }
        });

        return option;
    }
}

function updateSelectedOption(options, selectedOptionIndex) {
    options = cloneDeep(options || []);
    options.forEach(option => option.isSelected = false);
    if (options.length) options[selectedOptionIndex].isSelected = true;
    return options;
}

export default App;
