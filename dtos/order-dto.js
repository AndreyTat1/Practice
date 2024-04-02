module.exports = class OrderDto {

    dispatcherId;
    driverId;
    status;
    addressTo;
    addressFrom;
    price;

    constructor(model) {
        this.dispatcherId = model.dispatcherId;
        this.driverId = model.driverId;
        this.status = model.status;
        this.addressTo = model.addressTo;
        this.addressFrom = model.addressFrom;
    }
}