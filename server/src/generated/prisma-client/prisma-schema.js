module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.27.3). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateChoice {
  count: Int!
}

type AggregateOption {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Choice {
  id: ID!
  content: String!
  options(where: OptionWhereInput, orderBy: OptionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Option!]
}

type ChoiceConnection {
  pageInfo: PageInfo!
  edges: [ChoiceEdge]!
  aggregate: AggregateChoice!
}

input ChoiceCreateInput {
  content: String!
  options: OptionCreateManyWithoutNextChoiceInput
}

input ChoiceCreateOneWithoutOptionsInput {
  create: ChoiceCreateWithoutOptionsInput
  connect: ChoiceWhereUniqueInput
}

input ChoiceCreateWithoutOptionsInput {
  content: String!
}

type ChoiceEdge {
  node: Choice!
  cursor: String!
}

enum ChoiceOrderByInput {
  id_ASC
  id_DESC
  content_ASC
  content_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ChoicePreviousValues {
  id: ID!
  content: String!
}

type ChoiceSubscriptionPayload {
  mutation: MutationType!
  node: Choice
  updatedFields: [String!]
  previousValues: ChoicePreviousValues
}

input ChoiceSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ChoiceWhereInput
  AND: [ChoiceSubscriptionWhereInput!]
  OR: [ChoiceSubscriptionWhereInput!]
  NOT: [ChoiceSubscriptionWhereInput!]
}

input ChoiceUpdateInput {
  content: String
  options: OptionUpdateManyWithoutNextChoiceInput
}

input ChoiceUpdateManyMutationInput {
  content: String
}

input ChoiceUpdateOneWithoutOptionsInput {
  create: ChoiceCreateWithoutOptionsInput
  update: ChoiceUpdateWithoutOptionsDataInput
  upsert: ChoiceUpsertWithoutOptionsInput
  delete: Boolean
  disconnect: Boolean
  connect: ChoiceWhereUniqueInput
}

input ChoiceUpdateWithoutOptionsDataInput {
  content: String
}

input ChoiceUpsertWithoutOptionsInput {
  update: ChoiceUpdateWithoutOptionsDataInput!
  create: ChoiceCreateWithoutOptionsInput!
}

input ChoiceWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  options_every: OptionWhereInput
  options_some: OptionWhereInput
  options_none: OptionWhereInput
  AND: [ChoiceWhereInput!]
  OR: [ChoiceWhereInput!]
  NOT: [ChoiceWhereInput!]
}

input ChoiceWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createChoice(data: ChoiceCreateInput!): Choice!
  updateChoice(data: ChoiceUpdateInput!, where: ChoiceWhereUniqueInput!): Choice
  updateManyChoices(data: ChoiceUpdateManyMutationInput!, where: ChoiceWhereInput): BatchPayload!
  upsertChoice(where: ChoiceWhereUniqueInput!, create: ChoiceCreateInput!, update: ChoiceUpdateInput!): Choice!
  deleteChoice(where: ChoiceWhereUniqueInput!): Choice
  deleteManyChoices(where: ChoiceWhereInput): BatchPayload!
  createOption(data: OptionCreateInput!): Option!
  updateOption(data: OptionUpdateInput!, where: OptionWhereUniqueInput!): Option
  updateManyOptions(data: OptionUpdateManyMutationInput!, where: OptionWhereInput): BatchPayload!
  upsertOption(where: OptionWhereUniqueInput!, create: OptionCreateInput!, update: OptionUpdateInput!): Option!
  deleteOption(where: OptionWhereUniqueInput!): Option
  deleteManyOptions(where: OptionWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type Option {
  id: ID!
  description: String!
  nextChoice: Choice
}

type OptionConnection {
  pageInfo: PageInfo!
  edges: [OptionEdge]!
  aggregate: AggregateOption!
}

input OptionCreateInput {
  description: String!
  nextChoice: ChoiceCreateOneWithoutOptionsInput
}

input OptionCreateManyWithoutNextChoiceInput {
  create: [OptionCreateWithoutNextChoiceInput!]
  connect: [OptionWhereUniqueInput!]
}

input OptionCreateWithoutNextChoiceInput {
  description: String!
}

type OptionEdge {
  node: Option!
  cursor: String!
}

enum OptionOrderByInput {
  id_ASC
  id_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type OptionPreviousValues {
  id: ID!
  description: String!
}

input OptionScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  AND: [OptionScalarWhereInput!]
  OR: [OptionScalarWhereInput!]
  NOT: [OptionScalarWhereInput!]
}

type OptionSubscriptionPayload {
  mutation: MutationType!
  node: Option
  updatedFields: [String!]
  previousValues: OptionPreviousValues
}

input OptionSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: OptionWhereInput
  AND: [OptionSubscriptionWhereInput!]
  OR: [OptionSubscriptionWhereInput!]
  NOT: [OptionSubscriptionWhereInput!]
}

input OptionUpdateInput {
  description: String
  nextChoice: ChoiceUpdateOneWithoutOptionsInput
}

input OptionUpdateManyDataInput {
  description: String
}

input OptionUpdateManyMutationInput {
  description: String
}

input OptionUpdateManyWithoutNextChoiceInput {
  create: [OptionCreateWithoutNextChoiceInput!]
  delete: [OptionWhereUniqueInput!]
  connect: [OptionWhereUniqueInput!]
  set: [OptionWhereUniqueInput!]
  disconnect: [OptionWhereUniqueInput!]
  update: [OptionUpdateWithWhereUniqueWithoutNextChoiceInput!]
  upsert: [OptionUpsertWithWhereUniqueWithoutNextChoiceInput!]
  deleteMany: [OptionScalarWhereInput!]
  updateMany: [OptionUpdateManyWithWhereNestedInput!]
}

input OptionUpdateManyWithWhereNestedInput {
  where: OptionScalarWhereInput!
  data: OptionUpdateManyDataInput!
}

input OptionUpdateWithoutNextChoiceDataInput {
  description: String
}

input OptionUpdateWithWhereUniqueWithoutNextChoiceInput {
  where: OptionWhereUniqueInput!
  data: OptionUpdateWithoutNextChoiceDataInput!
}

input OptionUpsertWithWhereUniqueWithoutNextChoiceInput {
  where: OptionWhereUniqueInput!
  update: OptionUpdateWithoutNextChoiceDataInput!
  create: OptionCreateWithoutNextChoiceInput!
}

input OptionWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  nextChoice: ChoiceWhereInput
  AND: [OptionWhereInput!]
  OR: [OptionWhereInput!]
  NOT: [OptionWhereInput!]
}

input OptionWhereUniqueInput {
  id: ID
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  choice(where: ChoiceWhereUniqueInput!): Choice
  choices(where: ChoiceWhereInput, orderBy: ChoiceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Choice]!
  choicesConnection(where: ChoiceWhereInput, orderBy: ChoiceOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ChoiceConnection!
  option(where: OptionWhereUniqueInput!): Option
  options(where: OptionWhereInput, orderBy: OptionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Option]!
  optionsConnection(where: OptionWhereInput, orderBy: OptionOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): OptionConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  choice(where: ChoiceSubscriptionWhereInput): ChoiceSubscriptionPayload
  option(where: OptionSubscriptionWhereInput): OptionSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  name: String!
  email: String!
  password: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  name: String
  email: String
  password: String
}

input UserUpdateManyMutationInput {
  name: String
  email: String
  password: String
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    