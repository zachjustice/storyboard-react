export const INITIAL_CHOICE_ID = 1;

export class ChoicesService {
    choiceId = INITIAL_CHOICE_ID;
    choices = [];

    getChoice(choiceId) {
        let selectedChoice = this.choices.find(choice => choice.id === choiceId);

        if (!selectedChoice) {
            selectedChoice = this.fetchChoice(choiceId);
        }

        return selectedChoice;
    }

    fetchChoice(choiceId) {
        const newChoice = this.createNewChoice(choiceId);
        this.choices.push(newChoice);
        return newChoice;
    }

    createNewChoice(choiceId) {
        return {
            id: choiceId,
            content: randomWords(10, 20),
            options: Array(randomInt(2,5)).fill(null).map(() => this.createNewOption())
        };
    }

    createNewOption() {
        return {
            id: randomInt(0, 1000000000),
            description: randomWords(3, 7),
            next: ++this.choiceId
        }
    }
}

function randomInt(min, max) {
    return ( Math.random() * ( max - min ) + min ) >> 0
}

function randomWords(min, max) {
    let str = '';

    const num = randomInt(min, max);
    for (let i = 0; i < num; i++) {
        str += ' ' + words[Math.random() * words.length >> 0];
    }

    return str;
}

const words = [
    'Lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'Ut',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
    'ullamco',
    'laboris',
    'nisi',
    'ut',
    'aliquip',
    'ex',
    'ea',
    'commodo',
    'consequat',
    'Duis',
    'aute',
    'irure',
    'dolor',
    'in',
    'reprehenderit',
    'in',
    'voluptate',
    'velit',
    'esse',
    'cillum',
    'dolore',
    'eu',
    'fugiat',
    'nulla',
    'pariatur',
    'Excepteur',
    'sint',
    'occaecat',
    'cupidatat',
    'non',
    'proident',
    'sunt',
    'in',
    'culpa',
    'qui',
    'officia',
    'deserunt',
    'mollit',
    'anim',
    'id',
    'est',
    'laborum'
];
