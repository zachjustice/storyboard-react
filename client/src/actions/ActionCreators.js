import {ActionTypes} from "./ActionTypes";

export const selectOption = (choiceIndex, choice) => ({
  type: ActionTypes.selectOption,
  choiceIndex,
  choice,
});

export const createChoice = (choiceIndex, parentOptionId) => ({
    type: ActionTypes.createChoice,
    choiceIndex,
    parentOptionId,
});

export const fetchingChoice = (choiceIndex) => ({
    type: ActionTypes.fetchingChoice,
    choiceIndex
});