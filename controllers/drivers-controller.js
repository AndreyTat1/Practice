const driverService = require('../service/driver-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class DriverController {
    async createDriver(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {  nameDriver, surename, phone, sureNameDispatcher, email, password } = req.body;
            const driverData = await driverService.createDriver(nameDriver, surename, phone, sureNameDispatcher, email, password);
            res.cookie('refreshToken', driverData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(driverData);
        } catch (e) {
            next(e);
        }
    }

    async updateDriver(req, res, next) {
        try {
            const { id } = req.params;
            const driverData = await driverService.updateDriver(id, req.body);
            return res.json(driverData);
        } catch (e) {
            next(e);
        }
    }

    async deleteDriver(req, res, next) {
        try {
            const { id } = req.params;
            await driverService.deleteDriver(id);
            return res.json({ message: 'Водитель успешно удален' });
        } catch (e) {
            next(e);
        }
    }

    async getDrivers(req, res, next) {
        try {
            const drivers = await driverService.getAllDrivers();
            return res.json(drivers);
        } catch (e) {
            next(e);
        }
    }

    async loginDriver(req, res, next) {
        try {
            const {email, password} = req.body;
            const driverData = await driverService.loginDriver(email, password);
            res.cookie('refreshToken', driverData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(driverData);
        } catch (e) {
            next(e);
        }
    } 

    async logoutDriver(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await driverService.logoutDriver(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refreshDriver(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const driverData = await driverService.refreshDriver(refreshToken);
            res.cookie('refreshToken', driverData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(driverData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new DriverController();
