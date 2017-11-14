/*tab页面切换*/
$(function() {
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
  query.find().then(
    function(results) {
      $("#loader").remove();
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        let song = results[i].attributes;
        console.log(song);
        console.log(results[i]);
        let a = `
        <a class="songlink" href="song.html?id=${results[i].id}">
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
  /**------------search------------*/
  var timer = null;
  $("#searchIp").on("input", function(e) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      $(".holder").hide();
      let $value = $(e.currentTarget)
        .val()
        .trim();
      if ($value === "") {
        $("#matching").empty();
        $(".holder").show();
        $("#result").empty();
        return;
      }
      var queryname = new AV.Query("Song");
      queryname.contains("name", $value);
      var querysinger = new AV.Query("Song");
      querysinger.contains("singer", $value);
      var query = AV.Query.or(queryname, querysinger);
      query.find().then(
        function(results) {
          $("#result").empty();
          $("#matching").empty();
          if (results.length === 0) {
            $("#result").html("没有搜索结果");
          } else {
            $("#result").html("搜索" + "“" + $value + "”");
            for (let i = 0; i < results.length; i++) {
              let song = results[i].attributes;
              let li = `
               <li data-id="${results[i].id}" class="resultsLink">
               <svg class="icon searchicon" aria-hidden="true">
               <use xlink:href="#icon-search"></use>
             </svg><a href="./song.html?id=${results[i]
               .id}">${song.name} - ${song.singer}</a>
               </li>
              `;
              $("#matching").append(li);
            }
          }
        },
        function(error) {
          alert("出错了");
        }
      );
    }, 400);
  });
});
