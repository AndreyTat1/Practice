const {Schema, model} = require ('mongoose');

const DriverSchema = new Schema ({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    nameDriver: {type: String, required: true},
    surename: {type: String, required: true},
    phone: {type: Number, required: true},
    sureNameDispatcher: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
})

module.exports = model('Driver', DriverSchema);