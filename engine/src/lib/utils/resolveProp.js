/**
 * Created by vedi on 21/04/2017.
 */

export default function (obj, stringPath) {
    if (!obj || stringPath === '^') {
        return obj;
    }
    stringPath = stringPath.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    stringPath = stringPath.replace(/^\./, ''); // strip a leading dot
    const pathArray = stringPath.split('.');
    while (pathArray.length && obj) {
        const pathItem = pathArray.shift();
        if (pathItem in obj) {
            obj = obj[pathItem];
        } else {
            return;
        }
    }
    return obj;
}

