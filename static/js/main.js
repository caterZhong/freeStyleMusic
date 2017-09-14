var songList = [
{"name":"成都","singer":"赵雷","edtion":"赵雷","duration":"5:28","url":"http://m10.music.126.net/20170915012759/cce9d0c4505d6032c9516d08a3c55a50/ymusic/fa90/df9c/59f7/95c4a2802e0b9191ae1a048f127e53c5.mp3"},
{"name":"南山南","singer":"cater","edtion":"张磊","duration":"3:53","url":"http://upuwmp3.changba.com/userdata/userwork/89/580263089.mp3"},
{"name":"愿得一人心","singer":"cater","edtion":"张行亮","duration":"3:53","url":"http://upuwmp3.changba.com/userdata/userwork/15/468071015.mp3"}
];
var song_now_rank=0;

console.log(songList[0].url);

$("#music_video").attr("src",songList[0].url);

$("#btn-next").bind("click touchstart",function(){
	if(song_now_rank<songList.length-1){
		song_now_rank++;
		if(song_now_rank == 1){
			alert("你点了下一首哦，是我的歌哦，不听就马上关闭tab页面吧！")
		}
		$("#music_video").attr("src",songList[song_now_rank].url);
		$(song_info).text(songList[song_now_rank].name + '-' + songList[song_now_rank].singer);
		video.play();
	}
});

$("#btn-pre").bind("click touchstart",function(){
	if(song_now_rank>0){
		song_now_rank--;
		$("#music_video").attr("src",songList[song_now_rank].url);
		$(song_info).text(songList[song_now_rank].name + '-' + songList[song_now_rank].singer);
		video.play();
	}
});

var video = $("#music_video")[0];
var song_info = $("#song-info");
var timeDrag = false;   /* Drag status */
var currentPos=0;
var playProgress = 0;
var volume=0;
var volumeDrag = false;
// var musilList = 
$(function(){
	video.play();

	/*音乐播放暂停*/
	$("#btn-play-pause").bind("click touchstart",function(event){
		// var video = $("#music_video");
		console.log("play/pause");
		if(video.paused){
			video.play();
			$(".icon-play").removeClass("active");
			$(".icon-pause").addClass("active");
	    }
	    else{
	        video.pause();
	        $(".icon-pause").removeClass("active");
			$(".icon-play").addClass("active");

	    }
	    return false;
	});

	$(video).on('loadedmetadata', function() {
	   setDuration();
	});

	/*更新进度条*/
	$(video).on('timeupdate', function() { 
	   if(!timeDrag){
	   		var currentPos = video.currentTime; //Get currenttime
	   		modifyProgress(currentPos);
	   }
	  //  if(percentage == 100){
	  //  		$(".icon-pause").removeClass("active");
			// $(".icon-play").addClass("active");
	  //  }
	});

	$('.player-progress').mousedown(function(e) {
	   timeDrag = true;
	   // updatebar(e.pageX);
	});

	$(document).mouseup(function(e) {
	   if(timeDrag) {
	      timeDrag = false;
	      updatebar(e.pageX);
	      updateProgress();
	   }
	});
	$(document).mousemove(function(e) {
	   if(timeDrag) {
	      updatebar(e.pageX);
	   }
	});
	 
	//update Progress Bar control
	var updatebar = function(x) {
	   // video.pause();
	   var progress = $('.player-progress');
	   var maxduration = video.duration; //Video duraiton
	   var position = x - progress.offset().left; //Click pos
	   var percentage = 100 * position / progress.width();
	 
	   //Check within range
	   if(percentage > 100) {
	      percentage = 100;
	   }
	   if(percentage < 0) {
	      percentage = 0;
	   }
	 
	   //Update progress bar and video currenttime
	   // $('.timeBar').css('width', percentage+'%');
	   currentPos = Math.round(maxduration * percentage / 100);
	   modifyProgress(currentPos);
	};

	var updateProgress = function(){
		video.currentTime = currentPos;
	}

	var startBuffer = function() {
	   var maxduration = video.duration;
	   var currentBuffer = video.buffered.end(0);
	   // console.log(currentBuffer);
	   var percentage = 100 * currentBuffer / maxduration;
	   $('.loading').css('width', percentage+'%');
	 
	   if(currentBuffer < maxduration) {
	      setTimeout(startBuffer, 100);
	   }
	};
	setTimeout(startBuffer, 500);


	//Mute/Unmute control clicked
	$('.horn-box').click(function() {
	   video.muted = !video.muted;
	   return false;
	});

	$('.volume-progress').mousedown(function(e) {
	   volumeDrag = true;
	   // updatebar(e.pageX);
	});

	$(document).mouseup(function(e) {
	   if(volumeDrag) {
	      volumeDrag = false;
	      updateVolumeBar(e.pageX);//更新音量条
	      updateVolume();//更新音量
	   }
	});
	$(document).mousemove(function(e) {
	   if(volumeDrag) {
	      updateVolumeBar(e.pageX);
	      updateVolume();
	   }
	});
	 
	var updateVolumeBar = function(x){
		var position = x - $("#volume-progress").offset().left;
		console.log(position);
	   
	   var percentage = 100 * position / $("#volume-progress").children('.max').width();
	   if(percentage > 100) {
	      percentage = 100;
	   }
	   if(percentage < 0) {
	      percentage = 0;
	   }
	   $(".volume-progress").children('.current').css('width', percentage+'%');
	   $('.volume-dot').css('left', percentage+'%');
	   volume = percentage;
	}

	//Volume control clicked
	// $('.volume-progress').on('mousedown', function(e) {
	//    var position = e.pageX - $(this).children('.current').offset().left;
	//    if(position<0){
	//    		position = 0;
	//    }
	//    var percentage = 100 * position / $(this).children('.max').width();
	//    $(this).children('.current').css('width', percentage+'%');
	//    $('.volume-dot').css('left', percentage+'%');
	//    video.volume = percentage / 100;
	// });

	var updateVolume = function(){
		video.volume = volume / 100;
	}
});

function modifyProgress(currentPos){
	   var maxduration = video.duration; //Get video duration
	   var percentage = 100 * currentPos / maxduration; //in %
	   var minute = Math.floor(currentPos/60);
	   var second = Math.round(currentPos%60);
	   
	   var currentTimeStr = (minute>9?(""+minute):("0"+minute)) + ":" + (second>9?(""+second):("0"+second));
	   $('.playing').css('width', percentage+'%');
	   $('.progress-dot').css('left', percentage+'%');
	   $(".player-position-time").text(currentTimeStr);
}

function setDuration(){
	var maxduration = video.duration; //Get video duration
	console.log(maxduration);
	var minute = Math.floor(maxduration/60);
   	var second = Math.round(maxduration%60);
   
   	var maxdurationTimeStr = (minute>9?(""+minute):("0"+minute)) + ":" + (second>9?(""+second):("0"+second));
   	$(".total-time").text(maxdurationTimeStr);
}