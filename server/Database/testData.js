let keyObject1 = {
    keyway: 'SC1',
    combination: '03056',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'MK',
    hasMK: false,
    bottomPins: null,
    masterPins1: null,
    masterPins2: null,
    MKCombination: null,
    MKJobID: null
}

let keyObject2 = {
    keyway: 'SC1',
    combination: '03456',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'CK',
    hasMK: true,
    masterPins1: '00400',
    masterPins2: '1111',

}

let keyObject3 = {
    keyway: 'SC1',
    combination: '03052',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'CK',
    hasMK: true,
    masterPins1: '00004',
    masterPins2: null,
}

let keyObject4 = {
    keyway: 'SC1',
    combination: '03050',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'CK',
    hasMK: true,
    masterPins1: '00006',
    masterPins2: null,

}


const keyArray = [keyObject1, keyObject2, keyObject3, keyObject4]

let jobObject = {
    numkeys: 4,            //job part start
    numlocks: null,
    cost: 100.20,
    address: '2020 Sac State Road',
    notes:'first tuple'

}

const finalArray = [jobObject,keyArray];

module.exports = finalArray;
