function nextChoice(parent, args, context) {
    return context.prisma.option({ id: parent.id }).nextChoice();
}

module.exports = {
    nextChoice,
}