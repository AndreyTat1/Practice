const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const DriverController = require('../controllers/drivers-controller');
const DispatcherController = require('../controllers/dispatcher-controller');
const OrderController = require('../controllers/order-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.put('/update/:id', userController.updateUsers);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/CreateDriver',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    DriverController.createDriver
);

router.post('/loginDriver', DriverController.loginDriver);
router.post('/logoutDriver', DriverController.logoutDriver);
router.post('/deleteDriver/:id', DriverController.deleteDriver);
router.put('/updateDriver/:id', DriverController.updateDriver);// сделать хэширование как в create
router.get('/getDrivers', DriverController.getDrivers);
router.get('/refreshDriver', DriverController.refreshDriver);

router.post('/CreateDispatcher',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    DispatcherController.createDispatcher
);

router.post('/loginDispatcher', DispatcherController.loginDispatcher);
router.post('/logoutDispatcher', DispatcherController.logoutDispatcher);
router.post('/deleteDispatcher/:id', DispatcherController.deleteDispatcher);
router.put('/updateDispatcher/:id', DispatcherController.updateDispatcher);// сделать хэширование
router.get('/getDispatchers', DispatcherController.getDispatchers);
router.get('/refreshDispatcher', DispatcherController.refreshDispatcher);

router.post('/CreateOrder',
    OrderController.createOrder
);

router.post('/updateOrder/:id', OrderController.updateOrder);
router.put('/updateOrder/:id', OrderController.updateOrder);
router.get('/getOrders', OrderController.getOrders);
router.get('/refreshOrder', OrderController.refreshOrder);

module.exports = router

// сделать order 
/*сделать более удобные схемы 
переписать роуты*/