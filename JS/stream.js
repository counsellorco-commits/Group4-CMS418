const canvas = document.getElementById("ecgCanvas");
const ctx = canvas.getContext("2d");
const ECG_BASELINE = 500;
const ECG_GAIN = 2.5;

const sampleBuffer = [];
let streamFinished = false;

function resizeCanvas() {

    canvas.width =
        canvas.parentElement.clientWidth;

    canvas.height = 350;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

const source =
    new EventSource("/ECGApp/stream");

source.onmessage = (event) => {

    const samples =
        JSON.parse(event.data);

    sampleBuffer.push(...samples);
};

source.addEventListener(
    "end",
    () => {

        streamFinished = true;

        source.close();

        console.log(
            "ECG stream finished"
        );
    }
);

const waveform = [];

const MAX_POINTS = 2000;

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();

    /*
     * Consume samples
     */

    const samplesPerFrame = 17;

    for (
        let i = 0;
        i < samplesPerFrame &&
        sampleBuffer.length > 0;
        i++
    ) {

        const point =
            sampleBuffer.shift();

        waveform.push(point[1]);

        if (
            waveform.length >
            MAX_POINTS
        ) {
            waveform.shift();
        }
    }

    drawWaveform();

    if (
        !streamFinished ||
        sampleBuffer.length > 0
    ) {
        requestAnimationFrame(render);
    }
}

function drawGrid() {

    ctx.beginPath();

    for (
        let x = 0;
        x < canvas.width;
        x += 25
    ) {

        ctx.moveTo(x, 0);
        ctx.lineTo(
            x,
            canvas.height
        );
    }

    for (
        let y = 0;
        y < canvas.height;
        y += 25
    ) {

        ctx.moveTo(0, y);
        ctx.lineTo(
            canvas.width,
            y
        );
    }

    ctx.strokeStyle =
        "#eeeeee";

    ctx.stroke();
}

function drawWaveform() {

    if (waveform.length < 2) {
        return;
    }

    const MIN_A2 = 250;
    const MAX_A2 = 750;
    const RANGE = MAX_A2 - MIN_A2;

    ctx.beginPath();

    for (let i = 0; i < waveform.length; i++) {

        const x =
            (i / (MAX_POINTS - 1))
            * canvas.width;

        let value = waveform[i];

        /*
         * Clamp values outside expected range
         */
        if (value < MIN_A2) value = MIN_A2;
        if (value > MAX_A2) value = MAX_A2;

        const normalized =
            (value - MIN_A2) / RANGE;

        const y =
            canvas.height -
            (normalized * canvas.height);

        if (i === 0) {

            ctx.moveTo(x, y);

        } else {

            ctx.lineTo(x, y);
        }
    }

    ctx.strokeStyle = "#00aa00";
    ctx.lineWidth = 2;
    ctx.stroke();
}
requestAnimationFrame(render);