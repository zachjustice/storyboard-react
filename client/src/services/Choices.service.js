import {client} from './GraphQLClient';
import gql from 'graphql-tag'

export const INITIAL_CHOICE_ID = "cjsv4z9uxo0vg0b794bjfwjvu";

export async function getChoice(choiceId) {
    console.log('getChoice', choiceId);
    return await client.query({query: gql`{
        choice(id: "${choiceId}") {
            id
            content
            options {
                id
                description
                nextChoice {
                    id
                }
            }
        }
    }`}).then(response => {
        console.log("got choice", response.data.choice)
        return response.data.choice;
    })
    .catch(console.log)
}

export function createNewChoice(choiceId) {
    return {
    };
}

export function createNewOption() {
    return {
    }
}
