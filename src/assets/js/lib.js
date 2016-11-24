import 'assets/css/common.css';
import 'assets/css/moble.css';
import Config from './config';
import Utils from './utils';
import Pingback from './pingback';
import Storage from './storage';
import Server from './server';
import $ from 'jquery'


var Rxports = {
	Config,Utils,Pingback,Storage,Server,$
};

module.exports = Rxports