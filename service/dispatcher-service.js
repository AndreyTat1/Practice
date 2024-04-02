const DispatcherModel = require('../models/dispatcher-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const DispatcherDto = require('../dtos/dispatcher-dto');
const ApiError = require('../exceptions/api-error');


class DispatcherService {
    async createDispatcher(nameDispatcher, dispatcherSurename, phone, email, password) {
        const candidate = await DispatcherModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Диспетчер с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);///hash password
        const activationLink = uuid.v4(); 

        const dispatcher = await DispatcherModel.create({ nameDispatcher, dispatcherSurename, phone, email, password: hashPassword, activationLink });

        const dispatcherDto = new DispatcherDto(dispatcher);
        const tokens = tokenService.generateTokens({...dispatcherDto});
        await tokenService.saveToken(dispatcherDto.id, tokens.refreshToken);

        return {...tokens, dispatcher: dispatcherDto};
    }

    async activateDispatcher(activationLink) {
        const dispatcher = await dispatcher.findOne({ activationLink });
        if (!dispatcher) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        dispatcher.isActivated = true;
        await dispatcher.save();
    }

    async loginDispatcher(email, password) {
        const dispatcher = await DispatcherModel.findOne({ email });
        if (!dispatcher) {
            throw ApiError.BadRequest('Диспитчер с таким email не найден');
        }
        const isPassEquals = await bcrypt.compare(password, dispatcher.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const dispatcherDto = new DispatcherDto(dispatcher);
        const tokens = tokenService.generateTokens({...dispatcherDto});

        await tokenService.saveToken(dispatcherDto.id, tokens.refreshToken);
        return {...tokens, dispatcher: dispatcherDto};
    }

    async logoutDispatcher(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refreshDispatcher(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const dispatcherData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!dispatcherData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const dispatcher = await DispatcherModel.findById(dispatcherData.id);
        const dispatcherDto = new DispatcherDto(dispatcher);
        const tokens = tokenService.generateTokens({...dispatcherDto});

        await tokenService.saveToken(dispatcherDto.id, tokens.refreshToken);
        return {...tokens, dispatcher: dispatcherDto};
    }

    async getAllDispatcher() {
        const dispatcher = await DispatcherModel.find();
        return dispatcher;
    }

    async deleteDispatcher(id) {
        const deletedDispatcher = await DispatcherModel.findByIdAndDelete(id);
        if (!deletedDispatcher) {
            throw ApiError.NotFoundError('Диспитчер не найден');
        }
        return deletedDispatcher;
    }
    async updateDispatcher(id, updateData) {
        const existingDispatcher = await DispatcherModel.findByIdAndUpdate(id);
        if (!existingDispatcher) {
            throw ApiError.NotFoundError('Диспитчер не найден');
        }
        
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 3);
        }
        
        const updatedDispatcher = await DispatcherModel.findByIdAndUpdate(id, updateData, { new: true });
        return updatedDispatcher;
    }
}

module.exports = new DispatcherService();
