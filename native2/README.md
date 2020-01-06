

.\node_modules\react-native-track-player\android\src\main\java\com\guichaguri\trackplayer\service\metadata\ButtonEvents.java

    @Override
    public boolean onMediaButtonEvent (Intent mediaButtonIntent) {
        //boolean rv = super.onMediaButtonEvent(mediaButtonIntent);
        //Log.e(TAG, "onintent " + rv );
        //return rv;

        // https://github.com/aosp-mirror/platform_frameworks_base/blob/master/media/java/android/media/session/MediaSession.java

        if (Intent.ACTION_MEDIA_BUTTON.equals(mediaButtonIntent.getAction())) {

            KeyEvent ke = mediaButtonIntent.getParcelableExtra(Intent.EXTRA_KEY_EVENT);


            boolean playing = Utils.isPlaying(manager.getPlayback().getState());

            switch (ke.getKeyCode()) {
                case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
                case KeyEvent.KEYCODE_HEADSETHOOK:

                    if (ke.getRepeatCount() > 0) {
                        // long press
                        if (bEnableLongPress) {
                            onSkipToNext();
                            onPlay();
                            bEnableLongPress = false;
                        }
                    } else {
                        // short press
                        if (playing) {
                            onPause();
                        } else {
                            onPlay();
                        }
                        bEnableLongPress = true;

                    }
                    return true;
                case KeyEvent.KEYCODE_MEDIA_PLAY:
                    onPlay();
                    return true;
                case KeyEvent.KEYCODE_MEDIA_PAUSE:
                    onPause();
                    return true;
                case KeyEvent.KEYCODE_MEDIA_NEXT:
                    onSkipToNext();
                    return true;
                case KeyEvent.KEYCODE_MEDIA_PREVIOUS:
                    onSkipToPrevious();
                    return true;
                case KeyEvent.KEYCODE_MEDIA_STOP:
                    onStop();
                    return true;
                //case KeyEvent.KEYCODE_MEDIA_FAST_FORWARD:
                //    break;
                //case KeyEvent.KEYCODE_MEDIA_REWIND:
                //    break;
            }

        }

        return false;
    }