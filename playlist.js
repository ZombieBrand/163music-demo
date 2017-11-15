var APP_ID = "dkIJBHfaV9puzkRqVipWFH8s-gzGzoHsz";
var APP_KEY = "JVq509599HnbKRiUNthOnDMM";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


$(function(){
    var query = new AV.Query("Song");
    var $updateMusic = $("#updateMusic");
    query.find().then(function(results){
        console.log(results) 
        for(var i = 0;i<results.length;i++){
            let song = results[i].attributes
            console.log(song)
            let a=`
            <a class="songlink" href="song.html?id=${results[i].id}">
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
        </a>`
        $('.updateMusic').append(a)
        }      
    },function(error){
        console.log(error)
    })
})