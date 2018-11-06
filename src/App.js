import React, {Component} from 'react';
import './App.css';
import {Storyboard} from './components/Storyboard';
import {ChoicesService, INITIAL_CHOICE_ID} from './services/Choices.service';
import { cloneDeep } from 'lodash';

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
    choicesService = new ChoicesService();
    state = { choices: [ cloneDeep(this.choicesService.getChoice(INITIAL_CHOICE_ID)) ] };

    choose = (parentChoice, selectedOption, index) => {
        this.setState((state) => {
            (parentChoice.options || []).forEach(option => {
                option.isSelected = option.id === selectedOption.id;
            });

            const choices = state.choices
                .slice(0, index + 1)
                .concat(cloneDeep(this.choicesService.getChoice(selectedOption.next)));

            return {
                selectedOption: undefined,
                choices,
            }
        });
    };

    onKeyDown = (event) => {
        let currentSelectedOption = this.state.selectedOption;
        const lastChoice = this.state.choices[this.state.choices.length - 1] || {};
        const availableOptions = (lastChoice.options || []);

        if (currentSelectedOption === undefined) currentSelectedOption = -1;

        switch (event.keyCode) {
            case keys.up:
                currentSelectedOption = Math.max(currentSelectedOption - 1, 0);
                event.preventDefault();
                break;
            case keys.down:
                currentSelectedOption = Math.min(currentSelectedOption + 1, availableOptions.length - 1);
                event.preventDefault();
                break;
            case keys.backspace:
                if (this.state.choices.length > 1) {
                    this.setState({ choices: this.state.choices.splice(0, this.state.choices.length - 1) });
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
                    currentSelectedOption = event.keyCode - keys.one;
                } else {
                    break;
                }
            // eslint-disable-next-line no-fallthrough
            case keys.enter:
                if (currentSelectedOption > -1) {
                    this.choose(
                        lastChoice,
                        availableOptions[currentSelectedOption],
                        this.state.choices.length - 1
                    );
                    return;
                }
                break;
            default:
                return;
        }

        if (currentSelectedOption > -1) {
            availableOptions.forEach(option => option.isSelected = false);
            if (availableOptions.length) availableOptions[currentSelectedOption].isSelected = true;
            this.setState({selectedOption: currentSelectedOption});
        }
    };

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyDown);
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    render() {
        return (
            <div className="App">
                <Storyboard choices={this.state.choices} onClick={this.choose}/>
            </div>
        );
    }
}

export default App;
