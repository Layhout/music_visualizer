const av = document.querySelector("#audio_for_visual");
const as = document.querySelector("#audio_for_sound");
const loader = document.querySelector("#loader");
const wrapper = document.querySelector("main .bars_and_info");
const barContainers = document.querySelectorAll(".bar_container");
const num_of_bars = 50;
const lc = document.querySelector("#lyric_container");
const fi = document.querySelector("input[type='file']");
const ctxc = [];
const canvases = document.querySelectorAll(".bar_container");
canvases.forEach(bc => ctxc.push(bc.getContext("2d")));
const cWidth = canvases[0].width, cHeight = canvases[0].height;
let difMusic = false;

let allDiv = "";

const lyrics = [
    {
        m: 0,
        s: 0,
        l: ["we got ups and downs", "i cannot lie"]
    },
    {
        m: 0,
        s: 4,
        l: ["life is like ", "a rollercoaster ride"]
    },
    {
        m: 0,
        s: 8,
        l: ["yesterday is gone", "so cry no more"]
    },
    {
        m: 0,
        s: 11,
        l: ["baby this is what", "i'm living for"]
    },
    {
        m: 0,
        s: 15,
        l: ["when we're in the mood", "and the sun is out"]
    },
    {
        m: 0,
        s: 19,
        l: ["fire in the air", "and the feeling is right"]
    },
    {
        m: 0,
        s: 23,
        l: ["give me one more day", "and i'll take you there"]
    },
    {
        m: 0,
        s: 27,
        l: ["when we're in the mood", "love is everywhere"]
    },
    {
        m: 1,
        s: 0,
        l: ["give me one more day", "just to prove you wrong"]
    },
    {
        m: 1,
        s: 4,
        l: ["i'll take you a place", "where the lovers go"]
    },
    {
        m: 1,
        s: 8,
        l: ["baby in my dreams", "i can see your light"]
    },
    {
        m: 1,
        s: 11,
        l: ["just as long as we burn", "we will be alright"]
    },
    {
        m: 1,
        s: 15,
        l: ["when we're in the mood", "and the sun is out"]
    },
    {
        m: 1,
        s: 19,
        l: ["fire in the air", "and the feeling is right"]
    },
    {
        m: 1,
        s: 23,
        l: ["give me one more day", "and i'll take you there"]
    },
    {
        m: 1,
        s: 26,
        l: ["when we're in the mood", "love is everywhere"]
    },
    {
        m: 1,
        s: 30,
        l: ["when we're in the mood", "and the sun is out"]
    },
    {
        m: 1,
        s: 34,
        l: ["fire in the air", "and the feeling is right"]
    },
    {
        m: 1,
        s: 38,
        l: ["give me one more day", "and i'll take you there"]
    },
    {
        m: 1,
        s: 41,
        l: ["when we're in the mood", "love is everywhere"]
    },
]

window.onload = _ => { loader.style.display = "none" };

let totalMin = null, totalSec = null;
av.addEventListener("canplaythrough", _ => {
    totalSec = av.duration % 60;
    totalMin = ((av.duration - totalSec) / 60);
    totalSec = totalSec.toString().split(".")[0].padStart(2, "0");
    document.querySelector("#timer").innerHTML = `0:00 / ${totalMin}:${totalSec}`;
});

const play = _ => {
    timer();
    const ctx = new AudioContext();
    const audioSource = ctx.createMediaElementSource(av);
    const analyzer = ctx.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(ctx.destination);
    analyzer.fftSize = 128;
    const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
    ctxc.forEach(c => {
        c.shadowBlur = 15;
        c.shadowColor = "lightgray";
        c.fillStyle = "white";
    })

    const renderFrame = _ => {
        analyzer.getByteFrequencyData(frequencyData);
        ctxc.forEach(c => c.clearRect(0, 0, cWidth, cHeight));
        for (let i = 0; i <= num_of_bars; i++) {
            const fd = frequencyData[i];
            const barHeight = fd * 0.5 || 0;
            ctxc.forEach(c => {
                c.fillRect(6 * i, cHeight - barHeight, 5, barHeight);
            });
        }
        wrapper.style.transform = `translate(-50%, -50%) scale(${Math.min(1.5, Math.max(1, frequencyData[1] * 0.006))})`;
        requestAnimationFrame(renderFrame);
    }

    renderFrame();
    av.volume = 0.1;
    av.play();
    as.play();
}

let interval = null;
const timer = () => {
    let min = 0;
    let sec = 0;
    lc.innerHTML = `
                <div class="ani_container e${Math.floor(Math.random() * 7) + 1}">
                    <div>
                        <p>${lyrics.find(l => l.m === min && l.s === sec).l[0]}</p>
                        <p>${lyrics.find(l => l.m === min && l.s === sec).l[1]}</p>
                    </div>
                </div>
            `
    interval = setInterval(_ => {
        sec++;
        if (sec > 59) {
            min++;
            sec = 0;
        }
        document.querySelector("#timer").innerHTML = `${min}:${sec.toString().padStart(2, "0")} / ${totalMin}:${totalSec}`;
        if (difMusic) return;
        if (lyrics.some(l => l.m === min && l.s === sec)) {
            lc.innerHTML = `
                <div class="ani_container e${Math.floor(Math.random() * 7) + 1}">
                    <div>
                        <p>${lyrics.find(l => l.m === min && l.s === sec).l[0]}</p>
                        <p>${lyrics.find(l => l.m === min && l.s === sec).l[1]}</p>
                    </div>
                </div>
            `
        }
        if ((min === 0 && sec === 31)) {
            lc.innerHTML = "";
            wrapper.classList.add("long_fade_in");
        };
        if (min === 0 && sec === 59) {
            wrapper.classList.remove("long_fade_in");
            wrapper.classList.add("fade_out");
            setTimeout(_ => { wrapper.classList.remove("fade_out") }, 5000)
        }
        if ((min === 1 && sec === 45)) {
            lc.innerHTML = "";
            wrapper.classList.add("short_fade_in");
        }
    }, 1000);
}

av.addEventListener("ended", _ => {
    clearInterval(interval);
    document.querySelector("footer").style.display = "flex";
    document.querySelector("footer").classList.add("fade_in_go_up");
    document.querySelector("main").classList.add("fade_out");
});

const handleSwitch = el => {
    if (el.dataset.switch === "false") {
        el.dataset.switch = "true";
        document.body.dataset.guide = "true";
    }
    else {
        el.dataset.switch = "false";
        document.body.dataset.guide = "false";
    }
}

const start = _ => {
    document.querySelector("header").classList.add("fade_out_go_down");
    setTimeout(_ => { play() }, 1000);
}

fi.addEventListener("change", function () {
    loader.style.display = "grid";
    const file = this.files[0];
    if (!file.type.includes("audio")) {
        alert("The file you selected is not an audio file!");
        loader.style.display = "none";
        return;
    }
    difMusic = true;
    document.querySelector("#music_title").innerHTML = file.name;
    document.querySelector(".music_detail h3").innerHTML = file.name;
    document.body.dataset.dm = "true";
    av.src = URL.createObjectURL(file);
    as.src = URL.createObjectURL(file);
    av.load();
    as.load();
    loader.style.display = "none";
});

const playAgain = _ => {
    document.querySelector("main").classList.remove("fade_out");
    wrapper.classList.remove("short_fade_in");
    document.querySelector("footer").classList.remove("fade_in_go_up");
    document.querySelector("footer").classList.add("fade_out_go_down");
    setTimeout(_ => {
        document.querySelector("footer").style.display = "none";
        document.querySelector("footer").classList.remove("fade_in_go_up");
    }, 5000);
    setTimeout(_ => {
        timer();
        av.play();
        as.play();
    }, 1000);
}