import {ActionTypes} from '../actions/ActionTypes';

function rootReducer(state = {choices: []}, action) {
    console.log('rootReducer', state, action)
    if (action.type === ActionTypes.addChoice) {
        return {
            choices: state.choices.concat(action.choice)
        }
    } else if (action.type === ActionTypes.chooseOption) {
        const nextChoiceId = state.option.nextChoice.id;
        const choice = {};
        // const choice = await getChoice(nextChoiceId);

        return {
            ...state,
            choices: state.choices.concat(choice),
        }
    }

    return state
}

export default rootReducer;