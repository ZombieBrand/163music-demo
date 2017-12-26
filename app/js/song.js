import '../lib/usercover.css';
import '../css/reset.css';
import '../css/song.css';
/**将七牛存储数据推送到leancloud */
var APP_ID = 'dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz';
var APP_KEY = 'JVq509599HnbKRiUNthOnDMM';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
});

$(function () {
  /**-------正则获取id------- */
  var id = getParameterByName('id');
  var query = new AV.Query('Song');
  var audio = document.createElement('audio');

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  /**--------获取及渲染--------- */
  let array = [];
  let songreset = true;

  function rendering(id, query) {
    query.get(id).then(function (results) {
      let {
        url,
        lyric,
        name,
        singer,
        cover,
      } = results.attributes;
      initPlayer(url);
      initLyric(lyric, name, singer, cover);
      coverimg(cover);
      lyricRendering();
    });
  }
  rendering(id, query);
  /**--------背景操作--------- */
  function coverimg(cover) {
    let img = $('.coverimg').attr('src', cover);
    let style = `
    <style>
    .page::before {
      background: transparent url(${cover})no-repeat center;
      background-size:cover;
    }
    </style>`;
    $('head').append(style);
  }
  /**--------播放操作--------- */
  function initPlayer(url) {
    audio.src = url;
    audio.oncanplay = function () {
      audio.pause();
      $('.iconstop').on('click', songStop);
      $('.iconplay').on('click', songPlay);
    };
  }

  function songStop() {
    if (audio.duration <= audio.currentTime) {
      console.log('stop2');
      $('.iconstop').removeClass('active');
      $('.iconplay').addClass('active');
      $('.circle').removeClass('playing');
      $('.stylus').removeClass('playing');
      audio.currentTime = 0;
    } else {
      console.log('stop');
      $('.iconstop').removeClass('active');
      $('.iconplay').addClass('active');
      audio.pause();
      $('.circle').removeClass('playing');
      $('.stylus').removeClass('playing');
    }
  }

  function songPlay() {
    console.log('play');
    $('.iconplay').removeClass('active');
    $('.iconstop').addClass('active');
    audio.play();
    $('.circle').addClass('playing');
    $('.stylus').addClass('playing');
  }
  /**--------歌词渲染--------- */
  function lyricRendering() {
    $pTag();
    setInterval(function () {
      let current = audio.currentTime;
      songReset(current);
      $.map(array, function (value, index) {
        if (array[index + 1] !== undefined) {
          if (value.time <= current && array[index + 1].time > current) {
            lyricActive(index);
          }
        } else {
          return undefined;
        }
      });
    }, 400);
  }

  /**--------获取歌词和时间--------- */
  function initLyric(lyric, name, singer, cover) {
    let parts = lyric.split('\n');
    $('.songlyric>h1').text(name + '-' + singer);
    parts.forEach(function (string, index) {
      let lyricSplit = string.split(']');
      let lyricText = lyricSplit[0].substring(1);
      let timeSplit = lyricText.split(':');
      array.push({
        time: Number(timeSplit[0] * 60) + Number(timeSplit[1]),
        lyric: lyricSplit[1],
      });
    });
  }

  /**--------歌词滚动高度计算--------- */
  function lyricActive(index) {
    let lyricTop = $('.lyricTransform>p')
      .eq(index)
      .offset().top;
    let pHeight = $('.lyricTransform>p').height();
    let lyricTransformTop = $('.lyricTransform').offset().top;
    let delta = '-' + (lyricTop - lyricTransformTop - pHeight) + 'px';
    lyricRoll(index, delta);
  }
  /**--------初始化歌词标签--------- */
  function $pTag() {
    array.map(function (value, index) {
      let p = $('<p></p>');
      p.attr('data-time', value.time).text(value.lyric);
      $('.lyricTransform').append(p);
    });
  }

  /**--------歌词切换active--------- */
  function lyricRoll(index, delta) {
    if (index === array.length - 1) {
      $('.lyricTransform>p')
        .eq(array.lenght - 1)
        .addClass('active')
        .siblings()
        .removeClass('active');
      return undefined;
    } else {
      $('.lyricTransform>p')
        .eq(index)
        .addClass('active')
        .siblings()
        .removeClass('active');
      $('.lyricTransform').css('transform', `translateY(${delta})`);
    }
  }
  /**--------播放完重置--------- */
  function songReset(current) {
    if (current >= audio.duration && songreset === true) {
      songreset = false;
      $('.iconstop').click();
    } else {
      songreset = true;
    }
  }
});