module.exports = class OrderDto {

    dispatcherId;
    driverId;

    constructor(model) {

        this.dispatcherId = model.dispatcherId;
        this.driverId = model.driverId;
    }
}