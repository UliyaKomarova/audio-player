const activeClass = 'active';
const switchAudioClass = '_next-audio';
const playAndPauseButton = document.getElementById('playAndPauseButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('audioProgress');
const audioDurationContainer = document.querySelector('.progress-bar__end');
const audioProgressContainer = document.querySelector('.progress-bar__progress');

let isPlay = false;

const getAudioDuration = async () => {
    const activeItem = document.querySelector('.player-list-item.active');
    const audio = activeItem.querySelector('.player__audio');
    await fetch(audio.getAttribute('src'));

    return audio.duration;
};

const durationToString = (duration) => {
    const minutes = Math.trunc(duration / 60);
    let seconds = Math.trunc(duration) - minutes * 60;

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return `${minutes}:${seconds}`;
};

const changeDurationContent = (duration) => {
    const durationString = durationToString(duration);

    audioDurationContainer.innerHTML = durationString;
    progressBar.setAttribute('max', duration);
}

const toggleClassPlayPauseButton = () => {
    if (playAndPauseButton.classList.contains('_play')) {
        playAndPauseButton.classList.remove('_play');
        playAndPauseButton.classList.add('_pause');
    } else {
        playAndPauseButton.classList.remove('_pause');
        playAndPauseButton.classList.add('_play');
    }
};

const showAudioProgress = (time) => {
    const durationString = durationToString(time);
    audioProgressContainer.innerHTML = durationString;
}

const changeProgressBar = (audio) => {
    showAudioProgress(audio.currentTime);
    progressBar.value = audio.currentTime;
}

const resetProgressBar = () => {
    progressBar.value = '0';
}

const toggleAudio = () => {
    const activeItem = document.querySelector('.player-list-item.active');
    const audio = activeItem.querySelector('.player__audio');
    const video = activeItem.querySelector('.player__video');

    toggleClassPlayPauseButton();

    if(!isPlay) {
        audio.play();
        video.play();
        isPlay = true;

        audio.addEventListener("timeupdate", () => changeProgressBar(audio));
    } else {
        audio.pause();
        video.pause();
        isPlay = false;
    }
}

const switchTrack = () => {
    let currentAudioItem;
    let currentAudio;
    let currentVideo;
    let nextAudioItem;
    const audioListContainer = document.querySelector('.player-list');
    const audioList = audioListContainer.querySelectorAll('.player-list-item');

    for (i = 0; i < audioList.length; i += 1) {
        if (audioList[i].classList.contains(activeClass)) {
            currentAudioItem = audioList[i];
            currentAudio = currentAudioItem.querySelector('.player__audio');
            currentVideo = currentAudioItem.querySelector('.player__video');
        } else {
            nextAudioItem =  audioList[i];
        }
    }

    if (audioListContainer.classList.contains(switchAudioClass)) {
        audioListContainer.classList.remove(switchAudioClass);
    } else {
        audioListContainer.classList.add(switchAudioClass);
    }

    currentAudioItem.classList.remove(activeClass);
    nextAudioItem.classList.add(activeClass);
    currentAudio.pause();
    currentVideo.pause();
    currentAudio.currentTime = 0;
    currentVideo.currentTime = 0;
    currentAudio.removeEventListener("timeupdate", () => changeProgressBar(audio));
    toggleClassPlayPauseButton();
    resetProgressBar();
    isPlay = false;

    initAudio();
};

const findCurrentAudio = () => {
    let currentAudio;
    const audioListContainer = document.querySelector('.player-list');
    const audioList = audioListContainer.querySelectorAll('.player-list-item');

    for (i = 0; i < audioList.length; i += 1) {
        if (audioList[i].classList.contains(activeClass)) {
            currentAudio = audioList[i].querySelector('.player__audio');
        }
    }

    return currentAudio;
}

const setAudioCurrentTime = (time) => {
    const audio = findCurrentAudio();
    audio.currentTime = time;
};

const initAudio = async () => {
    const duration = await getAudioDuration();

    changeDurationContent(duration);
};

initAudio();

playAndPauseButton.addEventListener('click', () => toggleAudio());
prevButton.addEventListener('click', () => switchTrack());
nextButton.addEventListener('click', () => switchTrack());
progressBar.addEventListener('input', () => {
    showAudioProgress(progressBar.value);
    setAudioCurrentTime(progressBar.value);
});