module.exports = class DriverDto {
    email;
    id;
    isActivated;
    nameDriver;
    surename;
    phone;
    sureNameDispatcher;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.nameDriver = model.nameDriver;
        this.surename = model.surename;
        this.phone = model.phone;
        this.sureNameDispatcher = model.sureNameDispatcher;
    }
}