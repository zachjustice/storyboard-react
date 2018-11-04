import React, {Component} from 'react';
import './App.css';
import {Storyboard} from './components/Storyboard';
import {ChoicesService, INITIAL_CHOICE_ID} from './services/Choices.service';
import { cloneDeep } from 'lodash';


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
                ...state,
                choices,
            }
        });
    };

    render() {
        console.log('App current choices:', this.state.choices);
        return (
            <div className="App">
                <Storyboard choices={this.state.choices} onClick={this.choose}/>
            </div>
        );
    }
}

export default App;
