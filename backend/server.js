const RandomDie = require('./types/RandomDie.js');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Option {
    id: ID!
    description: String!
    next: ID!
  }

  type Choice {
    id: ID!
    content: String!
    options: [Option]!
  }

  type Query {
    getChoices(choiceId: ID!, subLevels: Int = 0): [Choice]
    ip(args: String = ""): String
  }
`);

// type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
// }

// If Message had any complex fields, we'd put them on this object.
class Choice {
    constructor(id, {content, options}) {
        this.id = id;
        this.content = content;
        this.options = options;
    }
}

class Option {
    constructor(id, {description, next}) {
        this.id = id;
        this.description = description;
        this.next = next;
    }
}

// Maps username to content
const fakeDatabase = {
    1: {
        content: 'asdf',
        options: [
            {
                id: 1,
                description: 'a f'
            }
        ]
    }
};

const root = {
    getChoices: function ({choiceId, subLevels}) {
        if (!fakeDatabase[choiceId]) {
            throw new Error('no message exists with id ' + choiceId);
        }

        return [new Choice(choiceId, fakeDatabase[choiceId])]
    },
    ip: function ({}, request) {
        return request.ip
    }
};

const logIpAddress = (req, res, next) => {
    console.log(`ip: ${req.ip}`);
    next();
};

const app = express();
app.use(logIpAddress);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});
