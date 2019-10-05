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
                description,
                nextChoice {
                    id
                }
            }
        }
    }`;

const getChoiceQuery = gql`
    query choice($id: String!) {
        choice(id: $id) {
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
    }
`;

const updateChoiceQuery = gql`
    mutation updateChoice($id: String!, $content: String!) {
        updateChoice(id: $id, content: $content) {
            id
            content
        }
    }
`;

const updateOptionQuery = gql`
    mutation updateOption($id: String!, $description: String!) {
        updateOption(id: $id, description: $description) {
            id
            description
            nextChoice {
                id
            }
        }
    }
`;

export async function createChoice(parentChoiceId, parentOptionId, content) {
    return await client.mutate({
        variables: {
            content,
            parentOptionId
        },
        mutation: createChoiceQuery,
        // refetch the parentChoiceId so that its option points to the newly created choice
        refetchQueries: [{
            query: getChoiceQuery,
            variables: {id: parentChoiceId}
        }],
        update: (store, {data: {createChoice}}) => {
            console.log('createChoice', createChoice);

            // cache the choice we just created
            store.writeQuery({
                query: getChoiceQuery,
                variables: {id: createChoice.id},
                data: {
                    choice: {...createChoice}
                },
            });
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

            store.writeQuery({
                query: getChoiceQuery,
                variables: {id: parentChoiceId},
                data: updatedChoice
            });
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

export async function updateChoice({id, content}) {
    return await client.mutate({
        mutation: updateChoiceQuery,
        variables: {id, content},
        update: (store, {data: {updateChoice}}) => {
            const {choice} = store.readQuery({query: getChoiceQuery, variables: {id}});
            const updatedChoice = {
                choice: {
                    ...choice,
                    content: updateChoice.content
                }
            };

            store.writeQuery({query: getChoiceQuery, variables: {id}, data: updatedChoice});
        }
    }).then(({data: {updateChoice}}) => {
        return updateChoice
    });
}

export async function updateOption(parentChoiceId, {id, description}) {
    return await client.mutate({
        mutation: updateOptionQuery,
        variables: {id, description},
        update: (store, {data: {updateOption}}) => {
            const {choice} = store.readQuery({query: getChoiceQuery, variables: {id: parentChoiceId}});
            const updatedChoice = {
                choice: {
                    ...choice,
                    options: choice.options.map(oldOption => {
                        if (oldOption.id === updateOption.id) return updateOption;
                        return oldOption;
                    })
                }
            };

            store.writeQuery({query: getChoiceQuery, variables: {id: parentChoiceId}, data: updatedChoice});
        }
    }).then(({data: {updateOption}}) => {
        return updateOption
    });
}
