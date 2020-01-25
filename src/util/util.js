function immutableyReassign(rootObject, objectPath, newVal) {
    if (!rootObject) {
        return rootObject;
    }
    if (!objectPath) {
        return rootObject;
    }
    if (objectPath.length === 1) {
        return {...rootObject, [objectPath[0]]: newVal};
    }

    const prop = objectPath[0];
    const restOfObjectPath = objectPath.splice(1);

    return {
        ...rootObject,
        [prop]: this.immutableyReassign(rootObject[prop], restOfObjectPath, newVal)
    };
}
