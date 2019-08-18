import React, {Component} from 'react';
import './App.css';
import {NewChoice} from './components/NewChoice';
import {getChoice, INITIAL_CHOICE_ID} from './services/Choices.service';
import {cloneDeep} from 'lodash';
import {createChoice} from "./services/Choices.service";
import {createOption} from "./services/Choices.service";
import {Choice} from "./components/Choice";

const keys = {
    backspace: 8,
    enter: 13,
    escape: 27,
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
        document.addEventListener('keydown', this.onKeyDown);

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

    onKeyDown = async (event) => {
        const activeElement = document.activeElement;
        if (activeElement.localName === 'input') {
            if (event.keyCode === keys.escape) {
                activeElement.blur();
            }
            return;
        }

        const lastChoice = this.state.choices[this.state.choices.length - 1] || {};
        let availableOptions = (lastChoice.options || []);


        switch (event.keyCode) {
            case keys.up:
                // currOptionIndex = Math.max(currOptionIndex - 1, 0);
                // lastChoice.options = hoverSelectedOption(availableOptions, currOptionIndex);
                event.preventDefault();
                break;
            case keys.down:
                // currOptionIndex = Math.min(currOptionIndex + 1, availableOptions.length - 1);
                // lastChoice.options = hoverSelectedOption(availableOptions, currOptionIndex);
                event.preventDefault();
                break;
            case keys.backspace:
                if (this.state.choices.length > 1 && !this.state.createNewChoice) {
                    this.setState({
                        ...this.state,
                        choices: this.state.choices.splice(0, this.state.choices.length - 1)
                    });
                }
                this.setState((state) => {
                    state.choices[state.choices.length - 1].options.forEach((o, index) => {
                        if (o.isSelected) {
                            // currOptionIndex = index
                        }
                        // o.isHovered = o.isSelected;
                        // o.isSelected = false;
                    });
                    return {
                        choices: state.choices,
                        createNewChoice: false
                    }
                });
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
                    // currOptionIndex = event.keyCode - keys.one;
                } else {
                    break;
                }
            // eslint-disable-next-line no-fallthrough
            case keys.enter:
                let currOptionIndex = this.state.selectedOption === undefined
                    ? -1
                    : this.state.selectedOption;
                if (currOptionIndex > -1) {
                    await this.choose(
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

        // if (currOptionIndex > -1) {
        //   this.setState({...this.state, selectedOption: currOptionIndex});
        // }
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
