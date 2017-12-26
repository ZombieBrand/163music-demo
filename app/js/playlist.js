import '../lib/usercover.css';
import '../css/reset.css';
import '../css/playlist.css';


/**将七牛存储数据推送到leancloud */
var APP_ID = 'dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz';
var APP_KEY = 'JVq509599HnbKRiUNthOnDMM';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
});
$(function() {
  function querySongs() {
    var query = new AV.Query('Song');
    return query.find();
  }
  function updateMusic() {
    querySongs().then(function(results) {
      results.forEach(applyList);
    },function(error){alert(error);});
  }
  updateMusic();

  /**------依赖体 ------*/
  function applyList(results){
    var song = results.attributes;
    $('.updateMusic').append(listTemplate(results, song));
  }
  function listTemplate(results, song) {
    return `<a class="songlink" href="song.html?id=${results.id}">
    <h2>${song.name}</h2>
    <div class="description">
        <svg class="icon iconsq" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-SQ"></use>
        </svg>
        <span>${song.singer}</span>
    </div>
    <div class="playbutton">
        <svg class="icon iconplay" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
        </svg>
    </div>
</a>`;
  }
});
