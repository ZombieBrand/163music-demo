/**-------七牛初始化AV------- */
var APP_ID = "dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz";
var APP_KEY = "JVq509599HnbKRiUNthOnDMM";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
/**-------正则获取id------- */
$(function() {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  /**--------获取歌曲ID等信息--------- */
  var id = getParameterByName("id");
  var query = new AV.Query("Song");
  var audio = document.createElement("audio");
  query.get(id).then(function(song) {
    let { url, lyric, name, singer, cover } = song.attributes;
    console.log(song);
    initPlayer.call(undefined, url);
    initLyric.call(undefined, lyric, name, singer);
    $(".coverimg").attr("src", cover);
    let style = `
      <style>
      .page::before {
        background: transparent url(${cover})no-repeat center;
        background-size:cover;
      }
      </style>
    `;
    $("head").append(style);
  });
  /**--------播放操作--------- */
  function initPlayer(url) {
    audio.src = url;
    audio.oncanplay = function() {
      audio.pause();
      $(".iconstop").on("click", function() {
        $(this).toggleClass("active");
        $(".iconplay").toggleClass("active");
        audio.pause();
        $(".circle").toggleClass("playing");
        $(".stylus").toggleClass("playing");
      });
      $(".iconplay").on("click", function() {
        $(this).toggleClass("active");
        $(".iconstop").toggleClass("active");
        audio.play();
        $(".circle").toggleClass("playing");
        $(".stylus").toggleClass("playing");
      });
    };
  }
  /**--------歌词操作--------- */
  function initLyric(lyric, name, singer) {
    let array = [];
    let parts = lyric.split("\n");
    $(".songlyric>h1").text(name + "-" + singer);
    parts.forEach(function(string, index) {
      let xxx = string.split("]");
      let yyy = xxx[0].substring(1);
      let zzz = yyy.split(":");
      array.push({
        time: Number(zzz[0] * 60) + Number(zzz[1]),
        lyric: xxx[1]
      });
    });
    setInterval(function() {
      let current = audio.currentTime;
      for (var i = 0; i < array.length; i++) {
        if (i === array.lenght - 1) {
          $(".lyricTransform>p")
            .eq(array.lenght - 1)
            .addClass("active")
            .siblings()
            .removeClass("active");
          break;
        } else if (
          array[i].time <= current &&
          array[i + 1].time > current &&
          array[i + 1].time !== undefined
        ) {
          let lyricTop = $(".lyricTransform>p")
            .eq(i)
            .offset().top;
          let lyricTransformTop = $(".lyricTransform").offset().top;
          let pHeight = $(".lyricTransform>p").height();
          let delta = "-" + (lyricTop - lyricTransformTop - pHeight) + "px";
          $(".lyricTransform>p")
            .eq(i)
            .addClass("active")
            .siblings()
            .removeClass("active");
          $(".lyricTransform").css("transform", `translateY(${delta})`);
          break;
        }
      }
    }, 300);
    array.map(function(object) {
      if (!object) {
        return;
      }
      let $p = $("<p></p>");
      $p.attr("data-time", object.time).text(object.lyric);
      $(".lyricTransform").append($p);
    });
  }
});
