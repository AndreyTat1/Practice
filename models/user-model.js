const {Schema, model} = require ('mongoose');

const UserSchema = new Schema ({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    userName: {type: String},
    userSurename: {type: String}
})

module.exports = model('User', UserSchema);