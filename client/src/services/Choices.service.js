import {client} from './GraphQLClient';
import gql from 'graphql-tag'

export const INITIAL_CHOICE_ID = "cjsv4z9uxo0vg0b794bjfwjvu";

export async function getChoice(choiceId) {
    console.log('getChoice', choiceId);
    return await client.query({
        query: gql`{
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
        }`
    }).then(response => {
        console.log("got choice", response.data.choice)
        return response.data.choice;
    })
    .catch(console.error)
}

export async function createChoice(parentOptionId, content) {
    console.log('createChoice', parentOptionId, content);
    return await client.mutate({
        variables: {
            content,
            parentOptionId
        },
        mutation: gql`mutation {
            createChoice(content: $content, parentOptionId: $parentOptionId) {
                id,
                content,
            }
        }`
    }).then(response => {
        console.log(response);
        return response.choice
    })
    .catch(console.error)
}

export function createNewOption() {
    return {}
}
