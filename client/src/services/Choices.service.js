import {client} from './GraphQLClient';
import gql from 'graphql-tag'

export const INITIAL_CHOICE_ID = "cjsv4z9uxo0vg0b794bjfwjvu";

export async function createChoice(parentOptionId, content) {
    return await client.mutate({
        variables: {
            content,
            parentOptionId
        },
        mutation: gql`mutation createChoice($content: String!, $parentOptionId: String) {
            createChoice(content: $content, parentOptionId: $parentOptionId) {
                id,
                content,
                options {
                    id,
                    description
                }
            }
        }`}).then(response => {
        console.log("got choice", response.data.choice);
        return response.data.choice;
    })
    .catch(console.log)
}

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
