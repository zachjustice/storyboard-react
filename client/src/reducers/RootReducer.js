import {ActionTypes} from '../actions/ActionTypes';

function rootReducer(state = {choices: []}, action) {
    console.log('rootReducer', state, action);
    if (action.type === ActionTypes.selectOption) {
        return {
            fetchingChoice: false,
            choices: state.choices.splice(0, action.choiceIndex + 1).concat(action.choice),
            createChoice: null,
        }
    } else if (action.type === ActionTypes.createChoice) {
        // replace last choice with newChoice component
        return {
            fetchingChoice: false,
            choices: state.choices.splice(0, action.choiceIndex + 1),
            createChoice: {parentOptionId: action.parentOptionId},
        }
    } else if (action.type === ActionTypes.fetchingChoice) {
        // replace last choice with a "..."
        return {
            ...state,
            fetchingChoice: true,
            choices: state.choices.splice(0, action.choiceIndex + 1),
        }
    }

    return state
}

export default rootReducer;