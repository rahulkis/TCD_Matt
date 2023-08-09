const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')
const Partner = require('../models/partner/partnerModel')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
var ObjectId = require('mongodb').ObjectId;

exports.protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 200))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //console.log(decoded)
        const user = await User.findOne({ _id: decoded._id })
        if (!user) {
            throw next(new ErrorResponse('Authorization failed', 401))
        }
        req.user = user
        next()
    } catch (err) {
        console.log(err)
    }
});

exports.partnerAuth = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 200))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //const partner = await Partner.findOne({ _id: ObjectId(decoded._id), 'token': token })
        const partner = await Partner.findOne({ _id: ObjectId(decoded._id)})
        //console.log(decoded)
        //console.log({partner})
        if (!partner) {
            throw next(new ErrorResponse('Authorization failed', 401))
        }
        req.user = partner
        next()
    } catch (err) {
        console.log(err)
    }
})