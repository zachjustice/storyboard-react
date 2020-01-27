/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStory = `mutation CreateStory(
  $input: CreateStoryInput!
  $condition: ModelStoryConditionInput
) {
  createStory(input: $input, condition: $condition) {
    id
    start {
      id
      content
    }
    description
    author
    editors
    private
  }
}
`;
export const updateStory = `mutation UpdateStory(
  $input: UpdateStoryInput!
  $condition: ModelStoryConditionInput
) {
  updateStory(input: $input, condition: $condition) {
    id
    start {
      id
      content
    }
    description
    author
    editors
    private
  }
}
`;
export const deleteStory = `mutation DeleteStory(
  $input: DeleteStoryInput!
  $condition: ModelStoryConditionInput
) {
  deleteStory(input: $input, condition: $condition) {
    id
    start {
      id
      content
    }
    description
    author
    editors
    private
  }
}
`;
export const createPage = `mutation CreatePage(
  $input: CreatePageInput!
  $condition: ModelPageConditionInput
) {
  createPage(input: $input, condition: $condition) {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const updatePage = `mutation UpdatePage(
  $input: UpdatePageInput!
  $condition: ModelPageConditionInput
) {
  updatePage(input: $input, condition: $condition) {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const deletePage = `mutation DeletePage(
  $input: DeletePageInput!
  $condition: ModelPageConditionInput
) {
  deletePage(input: $input, condition: $condition) {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const createChoice = `mutation CreateChoice(
  $input: CreateChoiceInput!
  $condition: ModelChoiceConditionInput
) {
  createChoice(input: $input, condition: $condition) {
    id
    pageId
    content
    parentPage {
      id
      content
    }
  }
}
`;
export const updateChoice = `mutation UpdateChoice(
  $input: UpdateChoiceInput!
  $condition: ModelChoiceConditionInput
) {
  updateChoice(input: $input, condition: $condition) {
    id
    pageId
    content
    parentPage {
      id
      content
    }
  }
}
`;
export const deleteChoice = `mutation DeleteChoice(
  $input: DeleteChoiceInput!
  $condition: ModelChoiceConditionInput
) {
  deleteChoice(input: $input, condition: $condition) {
    id
    pageId
    content
    parentPage {
      id
      content
    }
  }
}
`;
