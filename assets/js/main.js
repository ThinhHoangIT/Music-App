/**
*1. Render songs
*2. Scroll top
*3. Play / pause / seek /
*4. CD rotate
*5. Next / prev
*6. Ramdom
*7. Next / repeat when ended
*8. active song
*9. Scroll active song into view
*10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Music_Player'

const heading = $("header h2");
const cdThumb = $('.cd-thumb')
const audio = $("#audio");
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $(".player");
const progress = $("#progress");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
var playedSongs = []

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone (ft. Cozi Zuehlsdorff)',
            path: './assets/music/song1.mp3',
            image: 'http://loopcentral.vn/uploads/thumbnail/529e3d417f4c27a956f7554820387000.jpg',
        },
        {
            name: 'Something Just Like This',
            singer: 'The Chainsmokers & Coldplay',
            path: './assets/music/song2.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/f/f7/All_We_Know_%28featuring_Phoebe_Ryan%29_%28Official_Single_Cover%29_by_The_Chainsmokers.png',
        },
        {
            name: 'Walk Thru Fire',
            singer: 'Victone (ft. Meron Ryan)',
            path: './assets/music/song3.mp3',
            image: 'https://i.ytimg.com/vi/WyA4mcrkswA/maxresdefault.jpg',
        },
        {
            name: 'Dancing With Your Ghost',
            singer: 'Sasha Alex Sloan',
            path: './assets/music/song4.mp3',
            image: 'https://data.chiasenhac.com/data/cover/156/155959.jpg',
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: './assets/music/song5.mp3',
            image: 'https://irishheritagefestival.com/wp-content/uploads/2019/06/image5-16.jpg',
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './assets/music/song5.mp3',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnFJQgRzf0Am1vwQoazr6aRYked2o2rRVVrQ&usqp=CAU',
        },
        {
            name: 'Play Date',
            singer: 'Melanie Martinez',
            path: './assets/music/song5.mp3',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsayWfeTbnx-qbf-8Ora4nPPKnok4mTyssOw&usqp=CAU',
        }

    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"> 
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
        })

        playlist.innerHTML = htmls.join('');
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // X??? l?? cd quay v?? d???ng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity //  s??? l???n l???p : v?? h???n
        })
        cdThumbAnimate.pause()


        // X??? l?? ph??ng to thu nh??? cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }

        }
        // Khi b??i h??t ???????c play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play()
        }
        // Khi b??i h??t ???????c pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }

        // c???p nh???t ti???n ????? b??i h??t khi quay   
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua b??i h??t
        progress.oninput = function (e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi next b??i h??t
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                playedSongs.push(_this.currentIndex)
                _this.playRandomSong();
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            // let activeElement = $('.song.active') || $('.song');
            // if (activeElement.classList.contains('active')) {
            //     $('.song.active').classList.remove("active")
            // }

        }

        // Khi previous b??i h??t
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // X??? l?? b???t/ t???t random b??i h??t
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
            // toggle trong classList v???i ?????i s??? th??? 2 l?? boolean, n???u true th?? add kh??ng th?? remove                     
        }

        // X??? l?? l???p l??i m???t b??i h??t
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // X??? l?? next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                playedSongs.push(_this.currentIndex)
                nextBtn.click();
            }
        }
        // L???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            // X??? l?? khi click v??o song
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index); // songNode.getAttribute('data-index')
                    _this.loadCurrentSong()
                    _this.render();
                    audio.play();
                }
                // X??? l?? khi click v??o option
                if (e.target.closest('.option')) {

                }
            }

        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (playedSongs.includes(newIndex)); //newIndex === this.currentIndex
        if(playedSongs.length === this.songs.length -1 ) {
            playedSongs = []
        }
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    start: function () {
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig()

        // ?????nh ngh??a c??c thu???c t??nh cho Object
        this.defineProperty();

        // L???ng nghe // x??? l?? c??c s??? ki???n 
        this.handleEvent();

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();

        //Render playlist
        this.render()

        // Hi???n th??? tr???ng th??i ban ????u c???a button repeat v?? random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()