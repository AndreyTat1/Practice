const {Schema, model} = require ('mongoose');

const DispatcherSchema = new Schema ({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    nameDispatcher: {type: String, required: true},
    dispatcherSurename: {type: String, required: true},
    phone: {type: Number, required: true}
})

module.exports = model('Dispatcher', DispatcherSchema);


///nameDispatcher, dispatcherSurname, phone,