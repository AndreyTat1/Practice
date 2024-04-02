module.exports = class UserDto {
    email;
    id;
    isActivated;
    userName;
    userSurename;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.userName = model.userName;
        this.Surename = model.userSurename;
    }
}