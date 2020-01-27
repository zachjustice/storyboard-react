/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStory = `subscription OnCreateStory {
  onCreateStory {
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
export const onUpdateStory = `subscription OnUpdateStory {
  onUpdateStory {
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
export const onDeleteStory = `subscription OnDeleteStory {
  onDeleteStory {
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
export const onCreatePage = `subscription OnCreatePage {
  onCreatePage {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const onUpdatePage = `subscription OnUpdatePage {
  onUpdatePage {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const onDeletePage = `subscription OnDeletePage {
  onDeletePage {
    id
    content
    choices {
      nextToken
    }
  }
}
`;
export const onCreateChoice = `subscription OnCreateChoice {
  onCreateChoice {
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
export const onUpdateChoice = `subscription OnUpdateChoice {
  onUpdateChoice {
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
export const onDeleteChoice = `subscription OnDeleteChoice {
  onDeleteChoice {
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
