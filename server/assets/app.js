$(function () {

    'use strict';

    var SERVER_ADDRESS = window.location.origin,
        socket = io.connect(SERVER_ADDRESS),
        updateTrack,
        togglePlay;

    /**
     * Updates the play/pause button label
     * with the correct text depending on the state of the track
     * @param isPlaying
     */
    togglePlay = function (isPlaying) {
        var $button = $('#play-pause i');
        if (isPlaying) {
            $button.removeClass('fa-play');
            $button.addClass('fa-pause');
        } else {
            $button.addClass('fa-play');
            $button.removeClass('fa-pause');
        }
    };

    /**
     * Updates the UI with the track information
     * @param data
     */
    updateTrack = function (data) {
        $('#track-name').text(data.name);
        document.title = 'Remote - ' + data.name + ' - ' + data.artists[0].name;
        $('#track-artist').text(data.artists[0].name);
        togglePlay(data.playing);
        $('#track-art').attr('src', data.image);
    };

    socket.emit('modify-track', 'info');
    socket.on('track-modified', function (data) {updateTrack(data); });
    $('#next').click(function () { socket.emit('modify-track', 'next'); });
    $('#prev').click(function () { socket.emit('modify-track', 'prev'); });
    $('#play-pause').click(function () { socket.emit('modify-track', 'play-pause'); });
    $('#blacklist').click(function () { socket.emit('blacklist-track'); });

});