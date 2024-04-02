module.exports = class DispatcherDto {
    email;
    id;
    isActivated;
    phone;
    nameDispatcher;
    dispatcherSurename;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.phone = model.phone;
        this.nameDispatcher = model.nameDispatcher;
        this.dispatcherSurename = model.dispatcherSurename;
        this.isActivated = model.isActivated;
    }
}