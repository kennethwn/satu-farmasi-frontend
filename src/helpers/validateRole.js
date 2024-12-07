export const validateRole = (currRole, targetRole) => {
    targetRole.forEach(role => {
        if (role === currRole) {
            return true;
        }
    });
    return false;
}
