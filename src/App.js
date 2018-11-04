import React, { Component } from 'react';
import './App.css';
import {Storyboard} from "./components/Storyboard";

const INITIAL_CHOICE_ID = 1;

function getChoice(choiceId) {
    const choices = [
        {
            id: 1,
            content: 'You have a choice. What will you do?',
            options: [
                {
                    id: 1,
                    description: 'Go right',
                    next: 2,
                },
                {
                    id: 2,
                    description: 'Go left',
                    next: 3,
                }
            ],
        },
        {
            id: 2,
            content: 'You went right',
            options: [],
        },
        {
            id: 3,
            content: 'You went left',
            options: [],
        }
    ];

    return choices.find(choice => choice.id === choiceId);
}

class App extends Component {
    state = { choices: [ getChoice(INITIAL_CHOICE_ID) ] };

    choose = (choiceId, index) => {
        console.log('choose', choiceId, index);
        this.setState((state) => {
            const choices = state.choices.slice(0, index + 1).concat(getChoice(choiceId));
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
