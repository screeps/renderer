import resolveProp from '../utils/resolveProp';

export default (calcName, { default: defaultValue, koef = 1 }, stateParams) => {
    let result = resolveProp(stateParams.calcs, calcName);
    if (result === undefined) {
        result = defaultValue;
    }
    return typeof result === 'number' ? koef * result : result;
};
