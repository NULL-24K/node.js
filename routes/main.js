/**
 * Created by chubin on 2018/4/20.
 */


var express = require('express');
var router = express.Router();
var User = require('./UserModel.js');
var URL = require('url');
var Msg = require('./Msg');
var ResModel = require('./responseModel');
var util = require('./util');
var db = require('../sqldb');