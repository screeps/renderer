export default (args) => {
    let result = 1;
    args.forEach((arg) => {
        result *= arg;
    });
    return result;
};
