import React, {Component} from 'react';
import './App.css';
import {Storyboard} from './components/Storyboard';
import {ChoicesService, INITIAL_CHOICE_ID} from './services/Choices.service';


class App extends Component {
    choicesService = new ChoicesService();

    state = { choices: [ this.choicesService.getChoice(INITIAL_CHOICE_ID) ] };

    choose = (choiceId, index) => {
        this.setState((state) => {
            const choices = state.choices.slice(0, index + 1).concat(this.choicesService.getChoice(choiceId));
            console.log('    new choices', choices);
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
