var player = null;
var last_e = null;
var pause_class = "iconfont icon-pausecircle-fill"
var play_class = "iconfont icon-playcircle-fill"

// var pause_class = "fa fa-pause"
// var play_class = "fa fa-play"

function play(e) {
    if (e == last_e) {
        if (player.paused | player.ended) {
            player.play();
            e.setAttribute("class", pause_class);
        } else {
            player.pause();
            e.setAttribute("class", play_class);
        }
    }
    else {
        if (player != null) {
            player.pause()
            last_e.setAttribute("class", play_class);
        }
        last_e = e;
        player = new Audio(e.getAttribute("href"));
        e.setAttribute("class", pause_class);
        player.onended = function () {
            e.setAttribute("class", play_class);
        }
        player.play();
    }
}
