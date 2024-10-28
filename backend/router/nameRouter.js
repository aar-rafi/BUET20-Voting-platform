const express = require('express');
const nameController = require('../controller/nameController');
const {authenticate} = require('../controller/adminController');
const nameRouter = express.Router();

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all(no) requests
nameRouter.use(limiter);

nameRouter.route('/')
.get(authenticate,nameController.getAllNames);

nameRouter.route('/vote')
.post(authenticate,nameController.castVote);

nameRouter.route('/result')
.get(authenticate,nameController.getVotingResult);



module.exports = nameRouter