import {ActionTypes} from "./ActionTypes";

export const addChoice = (choiceIndex, choice) => ({
  type: ActionTypes.addChoice,
  choiceIndex,
  choice,
});