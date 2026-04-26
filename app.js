const chart = LightweightCharts.createChart(document.getElementById('chart'), {
layout: { background: { color: '#0e0e0e' }, textColor: '#DDD' },
grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } }
});

const candleSeries = chart.addCandlestickSeries();
let fullData = [];
let visibleData = [];
let index = 50;
let interval = null;
let speed = 500;

let markers = [];
let mode = 'long';
let trendPoints = [];
let trendLine = null;

// 🔹 SAMPLE DATA (you can replace with CSV later)
for (let i = 0; i < 200; i++) {
fullData.push({
time: i,
open: 100 + Math.random() * 10,
high: 110 + Math.random() * 10,
low: 90 + Math.random() * 10,
close: 100 + Math.random() * 10,
});
}

// Initial load
visibleData = fullData.slice(0, index);
candleSeries.setData(visibleData);

// 🎮 Replay controls
function play() {
if (interval) return;
interval = setInterval(() => {
if (index < fullData.length) {
candleSeries.update(fullData[index]);
index++;
updateMarkers();
}
}, speed);
}

function pause() {
clearInterval(interval);
interval = null;
}

function step() {
if (index < fullData.length) {
candleSeries.update(fullData[index]);
index++;
updateMarkers();
}
}

// 📍 Mode switch
function setMode(m) {
mode = m;
}

// 🖱️ Click handling
chart.subscribeClick((param) => {
if (!param.time) return;

```
const price = param.seriesPrices.get(candleSeries);
const time = param.time;

if (mode === 'long') {
    markers.push({
        time,
        position: 'belowBar',
        color: 'green',
        shape: 'arrowUp',
        text: 'LONG'
    });
    candleSeries.setMarkers(markers);
}

if (mode === 'short') {
    markers.push({
        time,
        position: 'aboveBar',
        color: 'red',
        shape: 'arrowDown',
        text: 'SHORT'
    });
    candleSeries.setMarkers(markers);
}

if (mode === 'trend') {
    trendPoints.push({ time, value: price });

    if (trendPoints.length === 2) {
        if (trendLine) chart.removeSeries(trendLine);

        trendLine = chart.addLineSeries({
            color: 'blue',
            lineWidth: 2
        });

        trendLine.setData(trendPoints);
        trendPoints = [];
    }
}
```

});

// 🔄 Show markers only when candle is reached
function updateMarkers() {
const visibleMarkers = markers.filter(m => m.time <= index);
candleSeries.setMarkers(visibleMarkers);
}
