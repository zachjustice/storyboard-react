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
        }`
    }).then(response => {
        return response.data.createChoice;
    })
    .catch(console.error)
}

export async function createOption(parentChoiceId, optionDescription) {
    return await client.mutate({
        variables: {
            parentChoiceId,
            optionDescription
        },
        mutation: gql`mutation createOption($parentChoiceId: String!, $optionDescription: String!) {
            createOption(parentChoiceId: $parentChoiceId, description: $optionDescription) {
                id,
                description,
                nextChoice {
                    id,
                    content
                }
            }
        }`
    }).then(response => {
        return response.data.createOption;
    })
    .catch(console.error)
}

export async function getChoice(choiceId) {
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
        return response.data.choice;
    })
    .catch(console.error)
}
