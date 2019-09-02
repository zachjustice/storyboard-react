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

export const createChoice = (choiceIndex, parentOptionId) => ({
    type: ActionTypes.createChoice,
    choiceIndex,
    parentOptionId,
});

export const undoChoiceSelection = (choiceIndex) => ({
    type: ActionTypes.undoChoiceSelection,
    choiceIndex,
});
