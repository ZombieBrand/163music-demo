
import '../lib/usercover.css';
import '../css/reset.css';
import '../css/home.css';
import '../lib/loaders.min.css';
/**将七牛存储数据推送到leancloud */
var APP_ID = 'dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz';
var APP_KEY = 'JVq509599HnbKRiUNthOnDMM';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
});
// var SongObject = AV.Object.extend('Song');
// var songObject = new SongObject();
// songObject.set('name','时光之废')
// songObject.set('singer','许魏洲')
// songObject.set('url','http://oyfnflmnh.bkt.clouddn.com/001.mp3')
// var songs=[songObject,songObject2,songObject3,songObject4,songObject5,songObject6,songObject7,songObject8,songObject9]
// AV.Object.saveAll(songs)

/**
 * 顶部导航栏切换
 */
$(function () {
  function navTabs() {
    $('#navBar').on('click', 'li', function (e) {
      navActive(e);
    });
  }
  navTabs();
  /**
   * 歌单点击事件
   */
  function songlist() {
    $('#warperMusic').on('click', 'li', function (e) {
      window.location.href = './playlist.html';
    });
  }
  songlist();
  /**
   * 数据库获取歌曲
   */
  function querySongs() {
    var query = new AV.Query('Song');
    return query.find();
  }
  /**
   * 获取成功
   */
  function fillSongs() {
    querySongs().then(
      function (results) {
        $('#loader').remove();
        results.forEach(upTemplate);
        results.forEach(hotList);
        results.forEach(hotSearch);
        results.forEach(onhotSearch);
      },
      function (error) {
        alert(error);
      }
    );
  }
  fillSongs();
  /**
   * 生成A标签渲染
   */
  function upTemplate(results, i) {
    var song = results.attributes;
    $('section#updateMusic').append(updateMusic(results, i, song));
  }

  /**
   * 热歌榜
   */

  function hotList(results, i) {
    var song = results.attributes;
    $('.hot-content').append(hotTemplate(results, i, song));
  }


  /**
   * 热搜渲染
   */
  function hotSearch(results) {
    var song = results.attributes;
    $('.songName').append(searchTemplate(results, song));
  }

  /**
   * 热搜点击跳转
   */
  function onhotSearch(results) {
    $('.songName').on('click', 'ol', function (e) {
      var song = results.attributes;
      if (this.innerText === song.name) {
        window.location.href = `song.html?id=${results.id}`;
      }
    });
  }
  var time = null;
  var verdict = null;

  function search() {
    $('#searchIp').on('input', function (e) {
      var $value = $(e.currentTarget).val().trim();
      if (time === true) {
        window.clearTimeout(time);
      }
      time = setTimeout(function () {
        time = null;
        emptySearch();
        if ($value === '') {
          $('.holder').show();
          $('#matching').empty();
          $('.holder').show();
          $('#result').empty();
          $('.hotMusic').show();
          return undefined;
        }
        getSongMessage($value).then(function (results) {
          if (results.length === 0) {
            $('#result').html('没有搜索结果');
          } else {
            $('#result').html('搜索' + '“' + $value + '”');
            results.forEach(resultText);
          }
        });
      }, 200);
    });
  }
  search();

  function resultText(results) {
    var song = results.attributes;
    $('#matching').append(resultTemplate(results, song));
  }

  function emptySearch() {
    $('.holder').hide();
    $('#result').empty();
    $('#matching').empty();
    $('.hotMusic').hide();
  }

  function getSongMessage($value) {
    var queryname = new AV.Query('Song');
    queryname.contains('name', $value);
    var querysinger = new AV.Query('Song');
    querysinger.contains('singer', $value);
    var query = AV.Query.or(queryname, querysinger);
    return query.find();
  }

  /**-----函数依赖----- */
  function navActive(e) {
    var $li = $(e.currentTarget);
    var $index = $li.index();
    $li
      .addClass('active')
      .siblings()
      .removeClass('active');
    $('#contentwarper')
      .children()
      .eq($index)
      .addClass('active')
      .siblings()
      .removeClass('active');
  }

  function updateMusic(results, i, song) {
    return `<a class="songlink" href="song.html?id=${results.id}">
    <h2>${song.name}</h2>
    <div class="description">
    <svg class="icon iconsq" aria-hidden="true">
    <use xlink:href="#icon-SQ"></use>
    </svg>
    <span>${song.singer}</span>
    </div>
    <div class="playbutton">
    <svg class="icon iconplay" aria-hidden="true">
    <use xlink:href="#icon-play"></use>
    </svg>
    </div>
    </a>`;
  }

  function hotTemplate(results, i, song) {
    return `<a href="./song?id=${results.id}" class="hot-item">
    <div class="hot-item-num">${'0' + (i + 1)}</div>
    <div class="hot-item-content border">
    <div class="hot-item-context">
    <h3>${song.name}</h3>
    <p class="textoverflow">
    <svg class="icon iconsq" aria-hidden="true">
    <use xlink:href="#icon-SQ"></use>
    </svg>
    ${song.singer} - ${song.name}
    </div>
    <div class="hot-item-play">
    <svg class="icon iconplay" aria-hidden="true">
    <use xlink:href="#icon-play"></use>
    </svg>
    </div>
    </div>
    </a>`;
  }

  function searchTemplate(results, song) {
    return `<ol data-id="${results.id}">${song.name}</ol>`;
  }
});

function resultTemplate(results, song) {
  return `<li data-id="${results.id}" class="resultsLink">
  <svg class="icon searchicon" aria-hidden="true">
  <use xlink:href="#icon-search"></use>
</svg><a href="./song.html?id=${results.id}">${song.name} - ${song.singer}</a>
  </li>`;
}