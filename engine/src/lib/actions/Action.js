export default class Action {
    reset() {
    }

    update() {
        throw new Error('Override me!');
    }

    finish() {
        this.reset();
    }
}
