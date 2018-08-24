/**
 * Created by vedi on 07/04/2017.
 */

export const calculateAngle = (x0, y0, x, y) => {
    let angle = Math.atan2(y - y0, x - x0) + (Math.PI / 2);
    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    } else if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
};
export const convertGameXYToWorld = ({ x, y }, { CELL_SIZE }) => ({
    x: (CELL_SIZE * x),
    y: (CELL_SIZE * y),
});
export const scaleGameToWorld = (value, { CELL_SIZE }) => CELL_SIZE * value;

export default {
    calculateAngle,
    convertGameXYToWorld,
    scaleGameToWorld,
};
