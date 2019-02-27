function options(parent, args, context) {
    return context.prisma.choice({ id: parent.id }).options()
}

module.exports = {
    // postedBy,
    options,
}