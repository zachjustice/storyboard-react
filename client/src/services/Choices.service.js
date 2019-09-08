import {client} from './GraphQLClient';
import gql from 'graphql-tag'

export const INITIAL_CHOICE_ID = "cjsv4z9uxo0vg0b794bjfwjvu";
const createOptionQuery = gql`
    mutation createOption($parentChoiceId: String!, $optionDescription: String!) {
        createOption(parentChoiceId: $parentChoiceId, description: $optionDescription) {
            id,
            description,
            nextChoice {
                id,
                content
            }
        }
    }`;

const createChoiceQuery = gql`
    mutation createChoice($content: String!, $parentOptionId: String) {
        createChoice(content: $content, parentOptionId: $parentOptionId) {
            id,
            content,
            options {
                id,
                description
            }
        }
    }`;

const getChoiceQuery = gql`
    query choice($id: String!) {
        choice(id: $id) {
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
    }
`;

const updateOptionQuery = gql`
    mutation updateOption($id: String!, $description: String!) {
        updateOption(id: $id, description: $description) {
            id
        }
    }
`;

export async function createChoice(parentOptionId, content) {
    return await client.mutate({
        variables: {
            content,
            parentOptionId
        },
        mutation: createChoiceQuery,
        update: (store, {data: {createChoice}}) => {
            console.log('createChoice', createChoice);
            store.writeQuery({
                query: getChoiceQuery,
                variables: {id: createChoice.id},
                data: {
                    choice: {...createChoice}
                },
            })
        }
    }).then(({data}) => {
        return data.createChoice;
    }).catch(console.error)
}

export async function createOption(parentChoiceId, optionDescription) {
    return await client.mutate({
        variables: {
            parentChoiceId,
            optionDescription
        },
        mutation: createOptionQuery,
        update: (store, {data: {createOption}}) => {
            const {choice} = store.readQuery({query: getChoiceQuery, variables: {id: parentChoiceId}});
            const updatedChoice = {
                choice: {
                    ...choice,
                    options: choice.options.concat(createOption)
                }
            };

            store.writeQuery({query: getChoiceQuery, variables: {id: parentChoiceId}, data: updatedChoice});
        }
    }).then(({data}) => {
        return data.createOption;
    }).catch(console.error)
}

export async function getChoice(choiceId) {
    return await client.query({
        query: getChoiceQuery,
        variables: {id: choiceId},
    }).then(response => {
        return response.data.choice;
    }).catch(console.error)
}

export async function updateOption(parentChoiceId, {id, description}) {
    return await client.mutate({
        mutation: updateOptionQuery,
        variables: {id, description},
    }).then(({data: {updateOption}}) => {
        return updateOption
    });
}
