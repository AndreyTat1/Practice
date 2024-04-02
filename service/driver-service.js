const DriverModel = require('../models/driver-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const DriverDto = require('../dtos/driver-dto');
const ApiError = require('../exceptions/api-error');

class DriverService {
    async createDriver(nameDriver, surename, phone, sureNameDispatcher, email, password) {
        const candidate = await DriverModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Водитель с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); 

        const driver = await DriverModel.create({ nameDriver, surename, phone, sureNameDispatcher, email, password: hashPassword, activationLink });

        const driverDto = new DriverDto(driver);
        const tokens = tokenService.generateTokens({...driverDto});
        await tokenService.saveToken(driverDto.id, tokens.refreshToken);

        return {...tokens, driver: driverDto};
    }

    async activateDriver(activationLink) {
        const driver = await DriverModel.findOne({ activationLink });
        if (!driver) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        driver.isActivated = true;
        await driver.save();
    }

    async loginDriver(email, password) {
        const driver = await DriverModel.findOne({ email });
        if (!driver) {
            throw ApiError.BadRequest('Водитель с таким email не найден');
        }
        const isPassEquals = await bcrypt.compare(password, driver.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const driverDto = new DriverDto(driver);
        const tokens = tokenService.generateTokens({...driverDto});

        await tokenService.saveToken(driverDto.id, tokens.refreshToken);
        return {...tokens, driver: driverDto};
    }

    async logoutDriver(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refreshDriver(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const driverData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!driverData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const driver = await DriverModel.findById(driverData.id);
        const driverDto = new DriverDto(driver);
        const tokens = tokenService.generateTokens({...driverDto});

        await tokenService.saveToken(driverDto.id, tokens.refreshToken);
        return {...tokens, driver: driverDto};
    }

    async getAllDrivers() {
        const drivers = await DriverModel.find();
        return drivers;
    }

    async deleteDriver(id) {
        const deletedDriver = await DriverModel.findByIdAndDelete(id);
        if (!deletedDriver) {
            throw ApiError.NotFoundError('Водитель не найден');
        }
        return deletedDriver;
    }
    
    async updateDriver(id, updateData) {
        const existingDriver = await DriverModel.findById(id);
        if (!existingDriver) {
            throw ApiError.NotFoundError('Водитель не найден');
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 3);
        }
    
        const updatedDriver = await DriverModel.findByIdAndUpdate(id, updateData, { new: true });
    
        return updatedDriver;
    }
    

}

module.exports = new DriverService();
