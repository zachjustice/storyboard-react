/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStory = `query GetStory($id: ID!) {
  getStory(id: $id) {
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
export const listStorys = `query ListStorys(
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listStorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      description
      author
      editors
      private
    }
    nextToken
  }
}
`;
export const getPage = `query GetPage($id: ID!) {
  getPage(id: $id) {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const listPages = `query ListPages(
  $filter: ModelPageFilterInput
  $limit: Int
  $nextToken: String
) {
  listPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      content
    }
    nextToken
  }
}
`;
export const getChoice = `query GetChoice($id: ID!) {
  getChoice(id: $id) {
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
export const listChoices = `query ListChoices(
  $filter: ModelChoiceFilterInput
  $limit: Int
  $nextToken: String
) {
  listChoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      pageId
      content
    }
    nextToken
  }
}
`;
