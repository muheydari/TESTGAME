function get_platform () {
	if (/iPhone|iPad|iPod/i.test(navigator.userAgent))
		return 'ios';
	else if (/Android/i.test(navigator.userAgent))
		return 'android';
	else 
		return 'other';
}

function execute_ios (url)  {
	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", "ab://" + url);
	document.documentElement.appendChild(iframe);
	iframe.parentNode.removeChild(iframe);
	iframe = null;
}

function execute_android(command) {

}

function goto_next() {
	var url = window.location.pathname;
	var filename = url.substring(url.lastIndexOf('/')+1);
	var res = filename.replace(".html", "");
	var a = parseInt(res) + 1;
	open_page(a);
	play_sound('media/button.mp3');
}
function goto_back() {
	var url = window.location.pathname;
	var filename = url.substring(url.lastIndexOf('/')+1);
	var res = filename.replace(".html", "");
	var a = parseInt(res) - 1;
	open_page(a);
	play_sound('media/button.mp3');
}

function init_page () {
	$("*").css({
		"user-select": "none",
		"-webkit-user-select": "none",
		"-o-user-select": "none",
		"-ms-user-select": "none",
		"-moz-user-select": "none"
	});

	var stage = $("#Stage");
	var parent = $("<div style='overflow:hidden'></div>");
	$("body").prepend(parent);
	parent.prepend(stage);

	$(window).on("resize", function() {
		scale_stage();
	});

	$(window).ready(function() {
		scale_stage();
	});
	var url = window.location.pathname;
	var filename = url.substring(url.lastIndexOf('/')+1);
	var res = filename.replace(".html", "");
	var a = parseInt(res) ;
	play_narration('media/'+a+'.mp3');
}

function scale_stage() {
	var stage = $("#Stage");
	var stage_width = $(stage).width();
	var win_width = $(window).width();

	var stage_height = $(stage).height();
	var win_height = $(window).height();

	var ratio_x = win_width / stage_width;
	var ratio_y = win_height / stage_height;

	$(stage).css("transform-origin", "0 0");
	$(stage).css("transform", "scale(" + ratio_x + ", " + ratio_y + ")");

	var parent = $("#Stage").parent();
	parent.height(stage_height * ratio_y);
}

// Sub Status
function check_sub () {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('check_sub');
	else
		execute_android();
}

// Page
function open_page(index) {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('page:' + index);
	else if (platform == 'android')
		alburagh.openPage(index);
}

function book_finished() {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('finished');
	else if (platform == 'android')
		alburagh.bookFinished();
}

function book_exit() {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('exit');
	else if (platform == 'android')
		alburagh.bookExit();
}

// Narration  play_narration('../media/0.mp3);
function play_narration(path, volume) {
	if (volume === 'undefined')
		volume = 1.0;

	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('play_narration:' + path + ':' + volume);
	else if (platform == 'android')
		alburagh.playNarration(path, volume);
	else
		play_audio(path, volume, false);
}

function stop_narration() {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('stop_narration');
	else if (platform == 'android')
		alburagh.stopNarration();
	
	AdobeEdge.getComposition("my_text").getStage.getSymbol("Symbol_1").getSymbol("text_sym").stop();
}

// Music
function play_music(path, volume) {
	if (volume === 'undefined')
		volume = 1.0;

	var platform = get_platform();
	if (platform == 'ios')
		execute_ios("play_music:" + path + ':' + volume);
	else if (platform == 'android')
		alburagh.playMusic(path, volume);
	else
		play_audio(path, volume, true);
}

function stop_music() {
	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('stop_music');
	else if (platform == 'android')
		alburagh.stopMusic();
}

// Sound
function play_sound(path, volume) {
	if (volume === 'undefined')
		volume = 1.0;

	var platform = get_platform();
	if (platform == 'ios')
		execute_ios('sound:' + path + ':' + volume);
	else if (platform == 'android')
		alburagh.playSound(path, volume);
	else
		play_audio(path, volume, false);
}

// Desktop
var players = new Array();
function play_audio (path, volume, loop) {
	var player = new Audio();
	player.volume = volume ? volume : 1;
	player.loop = loop ? loop : 0;
	player.src = '../' + path;

	for (var i = 0; i < players.length; i++) {
		if (players[i].src == player.src)
			return;
	};

	players.push(player);
	player.play();

	player.onended = function (event) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].src == event.srcElement.src)
				players.splice(i, 1);
		};
	}
}