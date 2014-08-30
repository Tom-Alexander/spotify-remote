require(['$api/models'], function (models) {
    'use strict';

    var SERVER_ADDRESS = 'http://localhost:3000',
        socket = io.connect(SERVER_ADDRESS),
        togglePlay,
        getTrackImage,
        updateTrack;

    /**
     * updates the spotify track information and emits
     * an event with track data to update clients
     */
    updateTrack = function () {
        models.player.load('track').done(function () {
            models.player.track.load('album').done(function () {
                models.player.track.album.load('uri', 'name', 'image').done(function () {

                    $('#track-art').attr('src', models.player.track.album.image);
                    $('#track-name').text(models.player.track.name);
                    $('#track-artist').text(models.player.track.artists[0].name);

                    getTrackImage(models.player.track.uri.split(':')[2], function (image) {
                        socket.emit('updateTrack', {
                            name: models.player.track.name,
                            uri: models.player.track.uri,
                            artists: models.player.track.artists,
                            album: models.player.track.album.name,
                            playing: models.player.playing,
                            image: image
                        });
                    });
                });
            });
        });
    };

    /**
     * Retrieves the track artwork from the
     * Spotify web API.
     *
     * @param id
     * @param callback
     */
    getTrackImage = function (id, callback) {
        $.get('https://api.spotify.com/v1/tracks/' + id, function (data) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image();

            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL();
                callback.call(this, dataURL);
                canvas = null;
            };

            img.src = data.album.images[1].url;
        });
    };

    /**
     * pauses the track if it is currently playing, otherwise
     * plays the track
     */
    togglePlay = function () {
        return models.player.playing ? models.player.pause() : models.player.play();
    };

    updateTrack();
    socket.on('info', function () { updateTrack(); });
    socket.on('play-pause', function () { togglePlay(); });
    socket.on('next', function () { models.player.skipToNextTrack(); });
    socket.on('prev', function () { models.player.skipToPrevTrack(); });
    models.player.addEventListener('change', function () { updateTrack(); });
});