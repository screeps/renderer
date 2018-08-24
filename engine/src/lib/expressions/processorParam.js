import resolveProp from '../utils/resolveProp';

export default (paramName, { default: defaultValue, koef = 1 }, stateParams) => {
    let result = resolveProp(stateParams, paramName);
    if (result === undefined) {
        result = defaultValue;
    }
    return typeof result === 'number' ? koef * result : result;
};
