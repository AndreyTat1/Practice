const OrderModel = require('../models/order-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const OrderDto = require('../dtos/order-dto');
const ApiError = require('../exceptions/api-error');

class OrderService {
    async createOrder( status, addressTo, addressFrom, price, dispatcherId, driverId) {
    
        const order = await OrderModel.create({  status, addressTo, addressFrom, price, dispatcherId, driverId});
        const orderDto = new OrderDto(order);
    
        return {  status, addressTo, addressFrom, price, dispatcherId: orderDto.dispatcherId, driverId: orderDto.driverId};
    }
    

    async activateOrder(activationLink) {
        const order = await OrderModel.findOne({ activationLink });
        if (!order) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        order.isActivated = true;
        await order.save();
    }

    async refreshOrder(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const orderData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!orderData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const order = await OrderModel.findById(orderData.id);
        const orderDto = new OrderDto(order);
        const tokens = tokenService.generateTokens({...orderDto});

        await tokenService.saveToken(orderDto.id, tokens.refreshToken);
        return {...tokens, order: orderDto};
    }

    async getAllOrders() {
        const orders = await OrderModel.find();
        return orders;
    }

    async deleteOrder(id) {
        const deletedOrder = await OrderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw ApiError.NotFoundError('Заказ не найден');
        }
        return deletedOrder;
    }

    async updateOrder(id, updateData) {
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedOrder) {
            throw ApiError.NotFoundError('Заказ не найден');
        }
        return updatedOrder;
    }
}

module.exports = new OrderService();
