import StateDrive from '../StateDriver';
import constants from '@screeps/common/lib/constants';

const OWNER = '54bff72ab32a10f73a57d017';

const POWER_ID = {
    CORRUPT_SOURCE: 'CORRUPT_SOURCE',
    DISABLE_SPAWN: 'DISABLE_SPAWN',
    DISABLE_TOWER: 'DISABLE_TOWER',
    DRAIN_EXTENSION: 'DRAIN_EXTENSION',
    EXTEND_MINERAL: 'EXTEND_MINERAL',
    EXTEND_SOURCE: 'EXTEND_SOURCE',
    GENERATE_OPS: 'GENERATE_OPS',
    OPERATE_EXTENSION: 'OPERATE_EXTENSION',
    OPERATE_LAB: 'OPERATE_LAB',
    OPERATE_OBSERVER: 'OPERATE_OBSERVER',
    OPERATE_SPAWN: 'OPERATE_SPAWN',
    OPERATE_STORAGE: 'OPERATE_STORAGE',
    OPERATE_TERMINAL: 'OPERATE_TERMINAL',
    OPERATE_TOWER: 'OPERATE_TOWER',
    SHIELD: 'SHIELD',

    BERSERK: 'BERSERK',
    DEFEND: 'DEFEND',
    DISABLE: 'DISABLE',
    ENCOURAGE: 'ENCOURAGE',
    EXHAUST: 'EXHAUST',
    RENEW: 'RENEW',
    SIGHT: 'SIGHT',
    SUMMON: 'SUMMON',

    DEMOLISH: 'DEMOLISH',
    HARVEST_ENERGY: 'HARVEST_ENERGY',
    HARVEST_MINERAL: 'HARVEST_MINERAL',
    KILL: 'KILL',
    MASS_REPAIR: 'MASS_REPAIR',
    PUNCH: 'PUNCH',
    REFLECT: 'REFLECT',
    REINFORCE: 'REINFORCE',
    REMOTE_TRANSFER: 'REMOTE_TRANSFER',
    SNIPE: 'SNIPE',
};

const COMMON_STATE = {
    info: {},
    gameTime: 30,
    flags: [],
    visual: '',
};

const COMMON_OPERATOR_DATA = {
    _id: 'powerCreepOperator',
    type: 'powerCreep',
    name: 'scout1',
    user: OWNER,
    room: 'sim',
    className: 'operator',
    level: 0,
    x: 19,
    y: 21,
};

const COMMON_EXECUTOR_DATA = {
    ...COMMON_OPERATOR_DATA,
    _id: 'powerCreepExecutor',
    name: 'scout2',
    className: 'executor',
    x: 20,
    y: 24,
};

const COMMON_COMMANDER_DATA = {
    ...COMMON_OPERATOR_DATA,
    _id: 'powerCreepCommander',
    name: 'scout3',
    className: 'commander',
    x: 22,
    y: 27,
};

const COMMON_EXTENSION_DATA = {
    _id: 'extension1',
    type: 'extension',
    user: OWNER,
    room: 'sim',
    x: 28,
    y: 19,
    energy: 20,
    energyCapacity: 100,
};

const COMMON_LAB_DATA = {
    _id: 'lab1',
    type: 'lab',
    user: OWNER,
    room: 'sim',
    x: 30,
    y: 22,
    energy: 30,
    energyCapacity: 100,
    mineralAmount: 40,
    mineralCapacity: 100,
};

const COMMON_MINERAL_DATA = {
    _id: 'mineral1',
    type: 'mineral',
    user: OWNER,
    room: 'sim',
    x: 29,
    y: 20,
    mineralType: 'L',
};

const COMMON_OBSERVER_DATA = {
    _id: 'observer1',
    type: 'observer',
    user: OWNER,
    room: 'sim',
    x: 30,
    y: 24,
};

const COMMON_SOURCE_DATA = {
    _id: 'source1',
    type: 'source',
    user: OWNER,
    room: 'sim',
    x: 23,
    y: 16,
    energy: 50,
    energyCapacity: 100,
};

const COMMON_SPAWN_DATA = {
    _id: 'spawn1',
    type: 'spawn',
    user: OWNER,
    room: 'sim',
    x: 24,
    y: 17,
    energy: 70,
    energyCapacity: 100,
};

const COMMON_STORAGE_DATA = {
    _id: 'storage1',
    type: 'storage',
    user: OWNER,
    room: 'sim',
    x: 30,
    y: 26,
    energy: 50,
    power: 80,
};

const COMMON_TERMINAL_DATA = {
    _id: 'terminal1',
    type: 'terminal',
    user: OWNER,
    room: 'sim',
    x: 21,
    y: 15,
};

const COMMON_TOWER_DATA = {
    _id: 'tower1',
    type: 'tower',
    user: OWNER,
    room: 'sim',
    x: 26,
    y: 18,
    energy: 80,
    energyCapacity: 100,
};

const COMMON_USERS = {
    [OWNER]: {
        ok: 1,
        _id: OWNER,
        email: 'chivcha.lov@gmail.com',
        username: 'artch',
        cpu: 30,
        badge: {
            type: 9,
            color1: 31,
            color2: 53,
            color3: 74,
            param: 0,
            flip: false,
        },
        password: true,
        lastRespawnDate: 1489085471747,
        gcl: 50000000,
        credits: 3000,
        subscription: false,
        money: 0,
        subscriptionTokens: 4,
    },
};

const operatorDriver = new StateDrive(COMMON_OPERATOR_DATA);
const commanderDriver = new StateDrive(COMMON_COMMANDER_DATA);
const executorDriver = new StateDrive(COMMON_EXECUTOR_DATA);
const extensionDriver = new StateDrive(COMMON_EXTENSION_DATA);
const labDriver = new StateDrive(COMMON_LAB_DATA);
const mineralDriver = new StateDrive(COMMON_MINERAL_DATA);
const observerDriver = new StateDrive(COMMON_OBSERVER_DATA);
const sourceDriver = new StateDrive(COMMON_SOURCE_DATA);
const spawnDriver = new StateDrive(COMMON_SPAWN_DATA);
const storageDriver = new StateDrive(COMMON_STORAGE_DATA);
const terminalDriver = new StateDrive(COMMON_TERMINAL_DATA);
const towerDriver = new StateDrive(COMMON_TOWER_DATA);

const COMMON_OBJECTS = [
    operatorDriver.createState(),
    commanderDriver.createState(),
    executorDriver.createState(),
    extensionDriver.createState(),
    labDriver.createState(),
    mineralDriver.createState(),
    observerDriver.createState(),
    sourceDriver.createState(),
    spawnDriver.createState(),
    storageDriver.createState(),
    terminalDriver.createState(),
    towerDriver.createState(),
];

const createState = (objects, users = COMMON_USERS) =>
    ({ ...COMMON_STATE, objects: [...COMMON_OBJECTS, ...objects], users });


export default [
    createState([
        operatorDriver.say({
            message: 'Hello from powerCreep!',
            isPublic: true,
        }).createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
    createState([
        operatorDriver.say().moveBy(2, 0).createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
    createState([
        operatorDriver.createState({ level: 2 }),
        commanderDriver.createState({ level: 2 }),
        executorDriver.createState({ level: 2 }),
    ]),
    createState([
        operatorDriver.createState({ level: 3 }),
        commanderDriver.createState({ level: 3 }),
        executorDriver.createState({ level: 3 }),
    ]),
    createState([
        operatorDriver.createState({ level: 4 }),
        commanderDriver.createState({ level: 4 }),
        executorDriver.createState({ level: 4 }),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_CORRUPT_SOURCE, ...sourceDriver.getState('x', 'y') },
                spawned: true
            })
            .say({
                message: 'CORRUPT_SOURCE',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_BERSERK, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'BERSERK',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_DEMOLISH, ...spawnDriver.getState('x', 'y') },
            })
            .say({
                message: 'DEMOLISH',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_DISABLE_SPAWN, ...spawnDriver.getState('x', 'y') },
            })
            .say({
                message: 'DISABLE_SPAWN',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_DEFEND, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'DEFEND',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_HARVEST_ENERGY, ...spawnDriver.getState('x', 'y') },
            })
            .say({
                message: 'HARVEST_ENERGY',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_DISABLE_TOWER, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'DISABLE_TOWER',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_DISABLE, ...sourceDriver.getState('x', 'y') },
            })
            .say({
                message: 'DISABLE',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_HARVEST_MINERAL, ...mineralDriver.getState('x', 'y') },
            })
            .say({
                message: 'HARVEST_MINERAL',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_DRAIN_EXTENSION, ...extensionDriver.getState('x', 'y') },
            })
            .say({
                message: 'DRAIN_EXTENSION',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_ENCOURAGE, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'ENCOURAGE',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_KILL, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'KILL',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_EXTEND_MINERAL, ...mineralDriver.getState('x', 'y') },
            })
            .say({
                message: 'EXTEND_MINERAL',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_EXHAUST, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'EXHAUST',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_MASS_REPAIR, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'MASS_REPAIR',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_EXTEND_SOURCE, ...sourceDriver.getState('x', 'y') },
            })
            .say({
                message: 'EXTEND_SOURCE',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_RENEW, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'RENEW',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_PUNCH, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'PUNCH',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_GENERATE_OPS, ...sourceDriver.getState('x', 'y') },
            })
            .say({
                message: 'GENERATE_OPS',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_SIGHT, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'SIGHT',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_PUNCH, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'PUNCH',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_EXTENSION, ...extensionDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_EXTENSION',
                isPublic: true,
            })
            .createState(),
        commanderDriver
            .setActionLog({
                power: { id: constants.PWR_SUMMON, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'SUMMON',
                isPublic: true,
            })
            .createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_REFLECT, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'REFLECT',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_LAB, ...labDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_LAB',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_REINFORCE, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'REINFORCE',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_OBSERVER, ...observerDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_OBSERVER',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_REMOTE_TRANSFER, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'REMOTE_TRANSFER',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_SPAWN, ...spawnDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_SPAWN',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver
            .setActionLog({
                power: { id: constants.PWR_SNIPE, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'SNIPE',
                isPublic: true,
            })
            .createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_STORAGE, ...storageDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_STORAGE',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_TERMINAL, ...terminalDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_TERMINAL',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_OPERATE_TOWER, ...towerDriver.getState('x', 'y') },
            })
            .say({
                message: 'OPERATE_TOWER',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
    createState([
        operatorDriver
            .setActionLog({
                power: { id: constants.PWR_SHIELD, ...extensionDriver.getState('x', 'y') },
            })
            .say({
                message: 'SHIELD',
                isPublic: true,
            })
            .createState(),
        commanderDriver.createState(),
        executorDriver.createState(),
    ]),
];
