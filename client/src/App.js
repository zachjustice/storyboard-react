import React, {Component} from 'react';
import './App.css';
import {Storyboard} from './components/Storyboard';
import {NewChoice} from './components/NewChoice';
import {getChoice, INITIAL_CHOICE_ID} from './services/Choices.service';
import {cloneDeep} from 'lodash';

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
                ...state,
                loading: false,
                selectedOption: undefined,
                choices,
                createNewChoice,
                parentOptionId: selectedOption.id,
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
            case keys.backspace:
                if (this.state.choices.length > 1) {
                    this.setState({...this.state, choices: this.state.choices.splice(0, this.state.choices.length - 1)});
                }
                break;
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
            this.setState({...this.state, selectedOption: currOptionIndex});
        }
    };

    async componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown);

        const firstChoice = await getChoice(INITIAL_CHOICE_ID);
        this.setState({...this.state, choices: [firstChoice]})
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }


    render() {
        if (!this.state || !this.state.choices) return 'Fetching...';
        if (this.state && this.state.error) return 'Error!';

        return (
            <div className="App margin-left-1 margin-top-1">
                <Storyboard choices={this.state.choices} onClick={this.choose}/>
                { this.state.createNewChoice && <NewChoice /> }
                { this.state.loading && '...' }
            </div>
        );
    }
}

function updateSelectedOption(options, selectedOptionIndex) {
    options = cloneDeep(options || []);
    options.forEach(option => option.isSelected = false);
    if (options.length) options[selectedOptionIndex].isSelected = true;
    return options;
}

export default App;
