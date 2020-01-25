import {ActionTypes} from "./ActionTypes";

export const addChoice = (choiceIndex, choice) => ({
  type: ActionTypes.addChoice,
  choiceIndex,
  choice,
});

export const fetchingChoice = (choiceIndex) => ({
    type: ActionTypes.fetchingChoice,
    choiceIndex
});

export const createChoice = (choiceIndex, parentChoiceId, parentOptionId) => ({
    type: ActionTypes.createChoice,
    choiceIndex,
    parentChoiceId,
    parentOptionId,
});

export const createdChoice = (choiceIndex, parentOptionId, createdChoice) => ({
    type: ActionTypes.createdChoice,
    choiceIndex,
    parentOptionId,
    createdChoice,
});

export const undoChoiceSelection = (choiceIndex) => ({
    type: ActionTypes.undoChoiceSelection,
    choiceIndex,
});

export const createUpdateOptionAction = (option) => ({
    type: ActionTypes.updateOption,
    option,
});
