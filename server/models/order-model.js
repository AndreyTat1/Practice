const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
    dispatcherId: { type: Schema.Types.ObjectId, ref: 'Dispatcher', required: true}, 
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
});


module.exports = model('Order', OrderSchema);
