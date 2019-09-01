const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {APP_SECRET, getUserId} = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({...args, password})
    const token = jwt.sign({userId: user.id}, APP_SECRET)
    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user({email: args.email})
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({userId: user.id}, APP_SECRET)
    return {
        token,
        user,
    }
}

async function createChoice(parent, args, context, info) {
    const userId = getUserId(context)
    const choice = await context.prisma.createChoice({
        content: args.content,
        // postedBy: { connect: { id: userId } },
    })

    await context.prisma.updateOption({
        data: { nextChoice: { connect: { id: choice.id } } },
        where: { id: args.parentOptionId },
    })

    return choice;
}

async function createOption(parent, args, context, info) {
    // const userId = getUserId(context)

    const option = await context.prisma.createOption({
        // user: { connect: { id: userId } },
        description: args.description,
    })

    await context.prisma.updateChoice({
        data: { options: { connect: { id: option.id } } },
        where: { id: args.parentChoiceId },
    })

    return option
}

async function updateChoice(parent, args, context, info) {
    const updateChoiceData = {};

    if (args.content) {
        updateChoiceData.content = args.content
    }

    if (args.nextOptionId) {
        updateChoiceData.options = { connect: { id: args.nextOptionId } }
    }

    return context.prisma.updateChoice({
        data: updateChoiceData,
        where: { id: args.id } ,
    });
}

async function updateOption(parent, args, context, info) {
    const updateOptionData = {};

    if (args.description) {
        updateOptionData.description = args.description
    }

    if (args.nextChoiceId) {
        updateOptionData.nextChoice = { connect: { id: args.nextChoiceId } }
    }

    const option = await context.prisma.updateOption({
        data: updateOptionData,
        where: { id: args.id },
    });

    if (args.parentChoiceId) {
        await context.prisma.updateChoice({
            data: { options: { connect: { id: option.id } } },
            where: { id: args.parentChoiceId },
        })
    }

    return option;
}

function deleteChoice(parent, args, context, info) {
   return context.prisma.deleteChoice({ id: args.id })
}

function deleteOption(parent, args, context, info) {
    return context.prisma.deleteOption({ id: args.id })
}

function deleteOptions(parent, args, context, info) {
    args.ids.forEach(async (id) => await context.prisma.deleteOption({ id }));
    return args.ids;
}

module.exports = {
    signup,
    login,
    createChoice,
    createOption,
    updateChoice,
    updateOption,
    deleteChoice,
    deleteOption,
    deleteOptions,
};