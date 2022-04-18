let gmKeyObject1 = {
    keyway: 'SC1',
    combination: '4444',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'GMK',
    hasMK: false,
    bottomPins: null,
    masterPins1: null,
    masterPins2: null,
    MKCombination: null,
    MKJobID: null
}

let keyObject1 = {
    keyway: 'SC1',
    combination: '03056',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'MK',
    hasMK: true,
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
    masterPins2: null,
    MKCombination: "03056"

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
    MKCombination: "03056"
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
    MKCombination: "03056"

}

let ckOnly = {
    keyway: 'SC1',
    combination: '12345',
    unit: 'unit 1',
    door: 'door 1',
    keyLevelType: 'CK',
    hasMK: false,
    masterPins1: null,
    masterPins2: null,
    MKCombination: null

}

//let keyArray = [keyObject1, keyObject2, keyObject3, keyObject4, gmKeyObject1]
//let keyArray = [keyObject1, keyObject2, keyObject3, keyObject4]
let keyArray = [ckOnly]

let jobObject = {
    numkeys: 4,            //job part start
    cost: 100.20,
    address: '2020 Sac State Road',
    notes:'first tuple'

}

const finalArray = {"job":jobObject,"keys": keyArray};

module.exports = finalArray;
