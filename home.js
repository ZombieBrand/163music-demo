/*tab页面切换*/
$(".globaltabs").on("click", "li", function(e) {
  let li = $(e.currentTarget);
  let index = li.index();
  li
    .addClass("active")
    .siblings()
    .removeClass("active");
  $(".contentwarper")
    .children()
    .eq(index)
    .addClass("active")
    .siblings()
    .removeClass("active");
});

/**将七牛存储数据推送到leancloud */
var APP_ID = "dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz";
var APP_KEY = "JVq509599HnbKRiUNthOnDMM";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
// var SongObject = AV.Object.extend('Song');
// var songObject = new SongObject();
// songObject.set('name','时光之废')
// songObject.set('singer','许魏洲')
// songObject.set('url','http://oyfnflmnh.bkt.clouddn.com/001.mp3')
// var songs=[songObject,songObject2,songObject3,songObject4,songObject5,songObject6,songObject7,songObject8,songObject9]
// AV.Object.saveAll(songs)

/**将leancloud数据提取append到html */
var query = new AV.Query("Song");
var $a = $("section#updateMusic");
console.log($a);
query.find().then(
  function(results) {
    $("#loader").remove();
    for (var i = 0; i < results.length; i++) {
      let song = results[i].attributes;
      console.log(song);
      let a = `
        <a class="songlink">
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
        </a>
        `;
      $a.append(a);
    }
  },
  function(error) {}
);
