import {client} from './GraphQLClient';
import gql from 'graphql-tag'

export const INITIAL_CHOICE_ID = "cjsv4z9uxo0vg0b794bjfwjvu";


export class ChoicesService {
    choiceId = INITIAL_CHOICE_ID;
    choices = [];

    async getChoice(choiceId) {
        console.log("getChoice", choiceId)
        return await client({
            query: gql`query {
                choice(id:"cjsv4z9uxo0vg0b794bjfwjvu") {
                id,
                content,
                options {
                  id,
                  description,
                  nextChoice {
                    id
                  }
                }
              }
}`
        })
    }

    createNewChoice(choiceId) {
        return {
            id: choiceId,
            content: randomWords(10, 20),
            options: Array(randomInt(2, 5)).fill(null).map(() => this.createNewOption())
        };
    }

    createNewOption() {
        return {
            description: randomWords(3, 7)
        }
    }
}

function randomInt(min, max) {
    return (Math.random() * (max - min) + min) >> 0
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
