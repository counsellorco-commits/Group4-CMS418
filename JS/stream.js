const canvas = document.getElementById("ecgCanvas");
const ctx = canvas.getContext("2d");

const sampleBuffer = [];
const waveform = [];

let streamFinished = false;

const MAX_POINTS = 2000;

const MIN_A2 = 250;
const MAX_A2 = 750;
const RANGE = MAX_A2 - MIN_A2;

/* -----------------------------
   VITALS
------------------------------ */

let pulse = 72;
let spo2 = 98;
let systolic = 120;
let diastolic = 80;
let temperature = 36.8;

let lastPeakTime = null;
const rrIntervals = [];

/* -----------------------------
   DOM REFERENCES
------------------------------ */

const pulseElement =
    document.getElementById("pulseValue");

const bpElement =
    document.getElementById("bpValue");

const tempElement =
    document.getElementById("tempValue");

const spo2Element =
    document.getElementById("spo2Value");

/* -----------------------------
   CANVAS
------------------------------ */

function resizeCanvas() {

    const width =
        canvas.parentElement.clientWidth;

    if (canvas.width !== width) {
        canvas.width = width;
    }

    canvas.height = 350;
}

resizeCanvas();

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawGrid();
        drawWaveform();
    }
);

/* -----------------------------
   SSE
------------------------------ */

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

        drawGrid();
        drawWaveform();

        console.log(
            "ECG stream finished"
        );
    }
);

/* -----------------------------
   ECG PROCESSING
------------------------------ */

function detectPeak(value, timestamp) {

    if (waveform.length < 5) {
        return;
    }

    const threshold = 620;

    const prev =
        waveform[waveform.length - 2];

    if (
        value > threshold &&
        value > prev
    ) {

        if (lastPeakTime !== null) {

            const rr =
                timestamp - lastPeakTime;

            if (
                rr > 400 &&
                rr < 1500
            ) {

                rrIntervals.push(rr);

                if (
                    rrIntervals.length > 8
                ) {
                    rrIntervals.shift();
                }

                const avgRR =
                    rrIntervals.reduce(
                        (a, b) => a + b,
                        0
                    ) /
                    rrIntervals.length;

                pulse =
                    Math.round(
                        60000 / avgRR
                    );
            }
        }

        lastPeakTime = timestamp;
    }
}

function updateVitals() {

    spo2 =
        Math.max(
            95,
            Math.min(
                100,
                spo2 +
                (Math.random() * 2 - 1)
            )
        );

    temperature =
        Math.max(
            36.4,
            Math.min(
                37.4,
                temperature +
                (Math.random() * 0.08 - 0.04)
            )
        );

    systolic =
        Math.round(
            100 +
            (pulse * 0.3) +
            ((spo2 - 95) * 2)
        );

    diastolic =
        Math.round(
            systolic * 0.67
        );

    if (pulseElement) {
        pulseElement.textContent =
            pulse;
    }

    if (bpElement) {
        bpElement.textContent =
            diastolic +
            "/" +
            systolic;
    }

    if (tempElement) {
        tempElement.textContent =
            temperature.toFixed(1);
    }

    if (spo2Element) {
        spo2Element.textContent =
            Math.round(spo2);
    }
}

setInterval(
    updateVitals,
    1000
);

/* -----------------------------
   RENDERING
------------------------------ */

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();

    const samplesPerFrame = 17;

    for (
        let i = 0;
        i < samplesPerFrame &&
        sampleBuffer.length > 0;
        i++
    ) {

        const point =
            sampleBuffer.shift();

        const timestamp =
            point[0];

        const ecgValue =
            point[1];

        detectPeak(
            ecgValue,
            timestamp
        );

        waveform.push(ecgValue);

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

/* -----------------------------
   ECG GRID
------------------------------ */

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
        "#e6e6e6";

    ctx.lineWidth = 1;

    ctx.stroke();
}

/* -----------------------------
   WAVEFORM
------------------------------ */

function drawWaveform() {

    if (waveform.length < 2) {
        return;
    }

    ctx.beginPath();

    for (
        let i = 0;
        i < waveform.length;
        i++
    ) {

        const x =
            (i / (MAX_POINTS - 1))
            * canvas.width;

        let value =
            waveform[i];

        if (value < MIN_A2) {
            value = MIN_A2;
        }

        if (value > MAX_A2) {
            value = MAX_A2;
        }

        const normalized =
            (value - MIN_A2)
            / RANGE;

        const y =
            canvas.height -
            (
                normalized *
                canvas.height
            );

        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );
        }
    }

    ctx.strokeStyle =
        "#00aa00";

    ctx.lineWidth = 2;

    ctx.stroke();
}

requestAnimationFrame(render);