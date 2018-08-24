export default ([arg0, ...args]) => {
    let result = arg0;
    args.forEach((arg) => {
        result -= arg;
    });
    return result;
};
