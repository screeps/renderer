import resolveProp from '../utils/resolveProp';

export default (fieldName, { default: defaultValue, koef = 1 }, stateParams) => {
    let result = resolveProp(stateParams.state, fieldName);
    if (result === undefined) {
        result = defaultValue;
    }
    return typeof result === 'number' ? koef * result : result;
};
