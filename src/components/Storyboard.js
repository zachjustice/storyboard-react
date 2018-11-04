import React from 'react';
import {Choice} from "./Choice";

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

export class Storyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: [getChoice(INITIAL_CHOICE_ID)]
        }
    }

    choose(option, index) {
        this.setState((state) => {
            const choices = state.choices.slice(0, index + 1).concat(getChoice(option.next));
            return {
                ...state,
                choices,
            }
        });
    }

    render() {
        const choices = this.state.choices.map((choice, index) => (
            <Choice key={'choice-' + choice.id}
                    value={choice}
                    onClick={(option) => this.choose(option, index)}/>
        ));

        return (
            <div className='storyboard'>
                {choices}
            </div>
        )
    }
}
