const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    dispatcherId: { type: Schema.Types.ObjectId, ref: 'Dispatcher', required: true}, 
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    status: {type: Boolean, required: true},
    addressTo: {type: String,required: true},
    addressFrom: {type: String, required: true},
    price: {type: Number, required: true}
});


module.exports = model('Order', OrderSchema);
