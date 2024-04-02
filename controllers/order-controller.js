const orderService = require('../service/order-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { status, addressTo, addressFrom, price, dispatcherId, driverId } = req.body; 
            const orderData = await orderService.createOrder(status, addressTo, addressFrom, price, dispatcherId, driverId); 
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async updateOrder(req, res, next) {
        try {
            const { id } = req.params;
            const orderData = await orderService.updateOrder(id, req.body);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async deleteOrder(req, res, next) {
        try {
            const { id } = req.params;
            await orderService.deleteOrder(id);
            return res.json({ message: 'Водитель успешно удален' });
        } catch (e) {
            next(e);
        }
    }

    async getOrders(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();
            return res.json(orders);
        } catch (e) {
            next(e);
        }
    }


    async refreshOrder(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const orderData = await orderService.refreshOrder(refreshToken);
            res.cookie('refreshToken', orderData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrderController();
