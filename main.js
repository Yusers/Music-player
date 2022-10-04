const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const heading = $('header h2');
const paragraph = $('header p');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'Cupid',
            singer: 'ph-1',
            path: './assests/song/song6.mp4',
            image: './assests/img_song/song6.png',
        },
        {
            name: 'Hope u do',
            singer: 'oceanfromtheblue',
            path: './assests/song/song5.mp4',
            image: './assests/img_song/song5.png',
        },
        {
            name: 'I am',
            singer: 'oceanfromtheblue',
            path: './assests/song/song4.mp4',
            image: './assests/img_song/song4.png',
        },
        {
            name: 'Just',
            singer: 'oceanfromtheblue',
            path: './assests/song/song3.mp4',
            image: './assests/img_song/song3.png',
        },
        {
            name: '2 soon',
            singer: 'keshi',
            path: './assests/song/song2.mp4',
            image: './assests/img_song/song2.png',
        },
        {
            name: 'Counting Star',
            singer: 'BEO4',
            path: './assests/song/song1.mp4',
            image: './assests/img_song/song1.png',
        },
        {
            name: 'Vi anh dau co biet',
            singer: 'Madihu',
            path: './assests/song/song7.mp4',
            image: './assests/img_song/song7.png',
        },
        {
            name: 'Co Ta',
            singer: 'Vu',
            path: './assests/song/song8.mp4',
            image: './assests/img_song/song8.png',
        },
        {
            name: 'Tai vi sao',
            singer: 'MCK',
            path: './assests/song/song9.mp4',
            image: './assests/img_song/song9.png',
        },
        {
            name: 'Chang giong giang sinh',
            singer: 'MCK',
            path: './assests/song/song10.mp4',
            image: './assests/img_song/song10.png',
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        paragraph.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        playList.innerHTML = htmls.join('');
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex === this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    repeatSong: function() {
        audio.play();
    },
    scrollToActiveSongStart: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 100);
    },
    scrollToActiveSongEnd: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 100);
    },
    handleEvents: function() {
        const _this = this;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // CD rotate 360
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // timeline audio
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
        }

        // seek audio
        progress.onchange = function(e) {
            audio.currentTime = (audio.duration / 100) * e.target.value;
            audio.play();
        }

        // play music
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // on play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //on pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // next Song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            _this.render();
            audio.play();
            if (_this.currentIndex < (_this.currentIndex / 2)) {
                _this.scrollToActiveSongEnd();
            } else {
                _this.scrollToActiveSongStart();
            }
        }

        // Prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            _this.render();
            audio.play();
            if (_this.currentIndex < (_this.currentIndex / 2)) {
                _this.scrollToActiveSongEnd();
            } else {
                _this.scrollToActiveSongStart();
            }
        }

        // Random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }

        // Repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }

        // Next Song when audio onended
        audio.onended = function() {
            if (_this.isRepeat) {
                _this.repeatSong();
            } else {
                nextBtn.click();
            }
        }

        // playlist click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.options')) {
                // Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.render();
                    _this.loadCurrentSong();
                    audio.play();
                    if (_this.currentIndex < (_this.currentIndex / 2)) {
                        _this.scrollToActiveSongEnd();
                    } else {
                        _this.scrollToActiveSongStart();
                    }
                }
            }
        }

    },
    start: function() {
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvents();
        this.render();
    }
}
app.start();