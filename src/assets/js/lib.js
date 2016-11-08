import 'assets/css/common.css';
import 'assets/css/moble.css';
import Config from './config';
import Common from './common';
import Utils from './utils';
import Pingback from './pingback';
import Server from './server';
import $ from 'jquery'


var Rxports = {
	Common,Config,Utils,Pingback,Server,$
};

module.exports = Rxports