import Common from 'assets/js/common';

var Rxports = {
	// 生成32位事件id-e
	getEventId : function() {
		return Common.randomWord(false, 32);
	}

	
}
	
module.exports = Rxports