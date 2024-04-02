const dispatcherService = require('../service/dispatcher-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class DispatcherController {
    async createDispatcher(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { nameDispatcher, dispatcherSurename, phone, email, password } = req.body;
            const dispatcherData = await dispatcherService.createDispatcher(nameDispatcher, dispatcherSurename, phone, email, password);
            res.cookie('refreshToken', dispatcherData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(dispatcherData);
        } catch (e) {
            next(e);
        }
    }

    async updateDispatcher(req, res, next) {
        try {
            const { id } = req.params;
            const dispatcherData = await dispatcherService.updateDispatcher(id, req.body);
            return res.json(dispatcherData);
        } catch (e) {
            next(e);
        }
    }

    async deleteDispatcher(req, res, next) {
        try {
            const { id } = req.params;
            await dispatcherService.deleteDispatcher(id);
            return res.json({ message: 'Диспитчер успешно удален' });
        } catch (e) {
            next(e);
        }
    }

    async getDispatchers(req, res, next) {
        try {
            const dispatchers = await dispatcherService.getAllDispatcher();
            return res.json(dispatchers);
        } catch (e) {
            next(e);
        }
    }

    async loginDispatcher(req, res, next) {
        try {
            const {email, password} = req.body;
            const dispatcherData = await dispatcherService.loginDispatcher(email, password);
            res.cookie('refreshToken', dispatcherData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(dispatcherData);
        } catch (e) {
            next(e);
        }
    } 

    async logoutDispatcher(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await dispatcherService.logoutDispatcher(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refreshDispatcher(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const dispatcherData = await dispatcherService.refreshDispatcher(refreshToken);
            res.cookie('refreshToken', dispatcherData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(dispatcherData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new DispatcherController();
