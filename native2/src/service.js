
import TrackPlayer from 'react-native-track-player';

module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => {
        console.log("service: play")
        TrackPlayer.play()
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        console.log("service: pause")
        TrackPlayer.pause()
    });

    TrackPlayer.addEventListener('remote-stop', () => {
        console.log("service: stop")
        TrackPlayer.destroy()
    });

    TrackPlayer.addEventListener('remote-next', () => {
        console.log("service: next")
        TrackPlayer.skipToNext()
    });

    TrackPlayer.addEventListener('remote-previous', () => {
        console.log("service: previous")
        TrackPlayer.skipToPrevious()
    });

    TrackPlayer.addEventListener('remote-duck', (paused, permanent) => {
        console.log("service: duck (" + paused + " : " + permanent + ")")

        if (paused || permanent) {
            TrackPlayer.pause()
        } else {
            TrackPlayer.play()
        }
    });

}