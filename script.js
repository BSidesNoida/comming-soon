// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Global player variable
var player;

const VIDEO_ID = 'IyGVVbztz1w';

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        height: '100%',
        width: '100%',
        videoId: VIDEO_ID,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'fs': 0,
            'cc_load_policy': 0,
            'iv_load_policy': 3,
            'autohide': 0,
            'playlist': VIDEO_ID,
            'origin': window.location.origin,
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}

// Audio Toggle Logic
const audioBtn = document.getElementById('audio-toggle');
if (audioBtn) {
    audioBtn.addEventListener('click', () => {
        if (!player) return;
        if (player.isMuted()) {
            player.unMute();
            audioBtn.classList.add('active');
        } else {
            player.mute();
            audioBtn.classList.remove('active');
        }
    });
}

/* --- Loader Logic (Retro Terminal) --- */
document.addEventListener('DOMContentLoaded', () => {
    const loaderText = document.querySelector('.loader-text');
    const loader = document.getElementById('loader');
    const mainContainer = document.querySelector('.container');

    // Boot Sequence Lines
    const logs = [
        "INITIALIZING BSIDES NOIDA...",
        "SYSTEM FLAGGED... [TERMINATED]",
        "STATUS: DECLARED DEAD... [TERMINATED]",
        "...",
        "...",
        "...",
        "THE WORLD THOUGHT WE WERE GONE...",
        "THEY WERE WRONG...",
        "WE ARE BACK...",
        "ACCESS RECLAIMED..."
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex < logs.length) {
            const currentLine = logs[lineIndex];

            // If it's the last character of the line
            if (charIndex < currentLine.length) {
                loaderText.innerHTML += currentLine.charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, Math.random() * 30 + 10); // Random typing speed
            } else {
                // Line finished
                loaderText.innerHTML += "<br/>> ";
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 300); // Pause between lines
            }
        } else {
            // Sequence complete, wait briefly then fade out
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContainer.classList.add('visible');

                // Initialize Matrix Rain only after loader is done (perf optimization)
                new MatrixEffect('particle-canvas');

                // Try to remove loader from DOM after transition
                setTimeout(() => { loader.style.display = 'none'; }, 1000);
            }, 800);
        }
    }

    // Start with a prompt
    loaderText.innerHTML = "> ";
    setTimeout(typeLine, 500);
});

/* --- Cool Matrix Rain Background --- */
class MatrixEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Characters: Katakana + Hex + Binary for "Hacker" feel
        this.chars = 'BSIDESNOIDA0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = []; // Keep track of y-coordinate for each column

        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;

        this.columns = this.canvas.width / this.fontSize;
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = Math.random() * -100; // Start at random heights above
        }
    }

    init() {
        // Just ensures we have initial state
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    animate() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#F7931E'; // BSides Orange
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));

            // Draw
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            // Reset drop to top with randomness if it's below screen
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Move drop down
            this.drops[i]++;
        }

        requestAnimationFrame(() => this.animate());
    }
}
