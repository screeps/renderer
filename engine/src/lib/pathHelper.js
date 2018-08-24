/**
 * Created by vedi on 28/09/2017.
 */

import md5 from 'md5';

const ROOM_SIZE = 50;

export const getRenderPath = (objectsArray, filter, prevMd5, diagonalConnect = false) => {
    const array = {};
    const visited = {};
    let path = '';

    if (objectsArray.length === 0) {
        return '';
    }

    for (let x = 0; x < ROOM_SIZE; x += 1) {
        array[x] = new Array(ROOM_SIZE);
        visited[x] = {};
    }

    let hasAny;

    objectsArray.forEach((objectArray) => {
        objectArray.forEach((object) => {
            if (filter(object)) {
                array[object.x][object.y] = object;
                hasAny = true;
            }
            visited[object.x][object.y] = false;
        });
    });

    if (!hasAny) {
        return { md5: '', result: null };
    }

    const arrayMd5 = md5(JSON.stringify(array, (key, value) => {
        if (key === '' ||
            Array.isArray(value) ||
            typeof value === 'object' ||
            key === 'x' ||
            key === 'y' ||
            key === 'type') {
            return value;
        }
    }));
    if (arrayMd5 === prevMd5) {
        return { md5: arrayMd5, result: null };
    }

    function topLeftDownR(x, y) {
        if (x > 0 && y > 0 && !array[x - 1][y]) {
            path += 'a 50 50 0 0 0 -50 -50 h 50 ';
        } else {
            path += 'v -50 ';
        }
    }

    function topLeftUpR(x, y) {
        if (y > 0 && x > 0 && !array[x][y - 1]) {
            path += 'v -50 a 50 50 0 0 0 50 50 ';
        } else {
            path += 'h 50 ';
        }
    }

    function topLeftR(x, y) {
        if (x === 0 || array[x - 1][y] || y === 0 || array[x][y - 1]) {
            path += 'v -50 h 50 ';
        } else {
            path += 'a 50 50 0 0 1 50 -50 ';
        }
    }

    function topRightUpR(x, y) {
        if (y > 0 && x < ROOM_SIZE - 1 && !array[x][y - 1]) {
            path += 'a 50 50 0 0 0 50 -50 v 50 ';
        } else {
            path += 'h 50 ';
        }
    }

    function topRightDownR(x, y) {
        if (x < ROOM_SIZE - 1 && y > 0 && !array[x + 1][y]) {
            path += 'h 50 a 50 50 0 0 0 -50 50 ';
        } else {
            path += 'v 50 ';
        }
    }

    function topRightR(x, y) {
        if (x === ROOM_SIZE - 1 || array[x + 1][y] || y === 0 || array[x][y - 1]) {
            path += 'h 50 v 50 ';
        } else {
            path += 'a 50 50 0 0 1 50 50 ';
        }
    }

    function bottomRightR(x, y) {
        if (x === ROOM_SIZE - 1 || array[x + 1][y] || y === ROOM_SIZE - 1 || array[x][y + 1] ||
            (array[x + 1][y + 1] && (array[x + 1][y] || diagonalConnect))) {
            path += 'v 50 h -50 ';
        } else {
            path += 'a 50 50 0 0 1 -50 50 ';
        }
    }

    function bottomLeftR(x, y) {
        if (x === 0 || array[x - 1][y] || y === ROOM_SIZE - 1 || array[x][y + 1] ||
            (array[x - 1][y + 1] && (array[x - 1][y] || diagonalConnect))) {
            path += 'h -50 v -50 ';
        } else {
            path += 'a 50 50 0 0 1 -50 -50 ';
        }
    }

    function recurs(x, y, dx) {
        if (visited[x][y]) {
            if (dx) {
                path += 'v 100 ';
            } else {
                path += 'h -100 ';
            }
            return;
        }

        if (dx) {
            // top left
            if (x === 0 || y === 0 ||
                (array[x - 1][y - 1] &&
                    (diagonalConnect || array[x - 1][y] || array[x][y - 1]))) {
                topLeftUpR(x, y);
            } else {
                path += 'h 50 ';
            }

            if (x < ROOM_SIZE - 1 && array[x + 1][y]) {
                // top right
                if (x === ROOM_SIZE - 1 || y === 0 ||
                    (array[x + 1][y - 1] &&
                        (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                    topRightUpR(x, y);
                } else {
                    path += 'h 50 ';
                }

                recurs(x + 1, y, 1, 0);

                path += 'h -100 ';
            } else {
                // top right
                if (x === ROOM_SIZE - 1 || y === 0 ||
                    (array[x + 1][y - 1] &&
                        (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                    topRightUpR(x, y);
                    topRightDownR(x, y);
                } else {
                    topRightR(x, y);
                }

                // bottom right
                bottomRightR(x, y);

                path += 'h -50 ';
            }
        } else {
            // top right
            if (x === ROOM_SIZE - 1 || y === 0 ||
                (array[x + 1][y - 1] &&
                    (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                topRightDownR(x, y);
            } else {
                path += 'v 50 ';
            }

            if (y < ROOM_SIZE - 1 && array[x][y + 1]) {
                path += 'v 50 ';

                recurs(x, y + 1, 0, 1);

                path += 'v -50 ';
            } else {
                bottomRightR(x, y);
                bottomLeftR(x, y);
            }

            if (x === 0 || y === 0 || array[x - 1][y - 1]) {
                topLeftDownR(x, y);
            } else {
                path += 'v -50 ';
            }
        }

        if (x < ROOM_SIZE && y < ROOM_SIZE) {
            visited[x][y] = true;
        }
    }

    for (let x = 0; x < ROOM_SIZE; x += 1) {
        for (let y = 0; y < ROOM_SIZE; y += 1) {
            if (array[x][y] && !visited[x][y]) {
                path += `M ${x * 100} ${(y * 100) + 50} `;

                visited[x][y] = true;

                let horizontal = 0;
                do {
                    horizontal += 1;
                }
                while (x + horizontal < ROOM_SIZE && array[x + horizontal][y]);

                let vertical = 0;
                do {
                    vertical += 1;
                }
                while (y + vertical < ROOM_SIZE && array[x][y + vertical]);

                if (vertical < horizontal) {
                    if (x === 0 || y === 0 ||
                        (array[x - 1][y - 1] &&
                            (diagonalConnect || array[x - 1][y] || array[x][y - 1]))) {
                        // top left
                        topLeftDownR(x, y);
                        topLeftUpR(x, y);
                    } else {
                        topLeftR(x, y);
                    }

                    if (x < ROOM_SIZE - 1 && array[x + 1][y]) {
                        // top right
                        if (x === ROOM_SIZE - 1 || y === 0 ||
                            (array[x + 1][y - 1] &&
                                (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                            topRightUpR(x, y);
                        } else {
                            path += 'h 50 ';
                        }

                        recurs(x + 1, y, 1, 0);

                        path += 'h -50 ';
                    } else {
                        // top right
                        if (x === ROOM_SIZE - 1 || y === 0 ||
                            (array[x + 1][y - 1] &&
                                (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                            topRightUpR(x, y);
                            topRightDownR(x, y);
                        } else {
                            topRightR(x, y);
                        }

                        bottomRightR(x, y);
                    }

                    bottomLeftR(x, y);
                } else {
                    // top left
                    if (x === 0 || y === 0 ||
                        (array[x - 1][y - 1] &&
                            (diagonalConnect || array[x - 1][y] || array[x][y - 1]))) {
                        topLeftDownR(x, y);
                        topLeftUpR(x, y);
                    } else {
                        topLeftR(x, y);
                    }

                    // top right
                    if (x === ROOM_SIZE - 1 || y === 0 ||
                        (array[x + 1][y - 1] &&
                            (diagonalConnect || array[x + 1][y] || array[x][y - 1]))) {
                        topRightUpR(x, y);
                        topRightDownR(x, y);
                    } else {
                        topRightR(x, y);
                    }

                    if (y < ROOM_SIZE - 1 && array[x][y + 1]) {
                        path += 'v 50 ';
                        recurs(x, y + 1, 0, 1);
                        path += 'v -50 ';
                    } else {
                        bottomRightR(x, y);
                        bottomLeftR(x, y);
                    }
                }

                path += 'Z ';
            }
        }
    }
    return { md5: arrayMd5, result: path };
};

export default getRenderPath;
