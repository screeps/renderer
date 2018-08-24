export default (type, additionalWhen) => ({
    type: 'text',
    once: true,
    layer: 'effects',
    when: (params) => {
        const {
            calcs: { isOwner },
            stateExtra: { gameData: { showEnemyNames, showMyNames } },
        } = params;
        return ((isOwner && showMyNames[type]) || (!isOwner && showEnemyNames[type])) &&
            (!additionalWhen || additionalWhen(params));
    },
    payload: {
        text: { $calc: 'displayName' },
        style: {
            align: 'center',
            fill: { $calc: 'playerColorHex' },
            fontFamily: 'Roboto, sans-serif',
            fontSize: 55,
            stroke: '#111',
            strokeThickness: 15,
        },
        anchor: {
            x: 0.5,
            y: 1.7,
        },
    },
});
