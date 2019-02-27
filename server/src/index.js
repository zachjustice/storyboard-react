const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Choice = require('./resolvers/Choice')
const Option = require('./resolvers/Option')

const resolvers = {
    Query,
    Mutation,
    User,
    Choice,
    Option,
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
        }
    },
});
server.start(() => console.log(`Server is running on http://localhost:4000`))
