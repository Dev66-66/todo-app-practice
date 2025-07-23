const ctx = document.getElementById('cpuChart').getContext('2d');

let cpuData = {
    labels: [],
    datasets: [{
        label: 'CPU %',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3
    }]
};

let chart = new Chart(ctx, {
    type: 'line',
    data: cpuData,
    options: {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 10
                }
            }
        }
    }
});

let totalRequests = 0;
let errorCount = 0;
let lastValidValue = 0;

function updateStats() {
    document.getElementById('total').textContent = totalRequests;
    document.getElementById('errors').textContent = errorCount;
    const percent = ((errorCount / totalRequests) * 100).toFixed(1);
    document.getElementById('errorPercent').textContent = isNaN(percent) ? 0 : percent;
}

async function fetchCpuLoad() {
    try {
        const response = await fetch('https://exercise.develop.maximaster.ru/service/cpu/');
        const value = await response.text();
        const cpu = parseInt(value, 10);

        totalRequests++;

        let result = cpu;
        if (cpu === 0) {
            errorCount++;
            result = lastValidValue;
        } else {
            lastValidValue = cpu;
        }

        const timeLabel = new Date().toLocaleTimeString();
        cpuData.labels.push(timeLabel);
        cpuData.datasets[0].data.push(result);

        // Показывать только последние 20 точек
        if (cpuData.labels.length > 20) {
            cpuData.labels.shift();
            cpuData.datasets[0].data.shift();
        }

        chart.update();
        updateStats();

    } catch (err) {
        console.error("Ошибка запроса", err);
    }
}

// Первая загрузка
fetchCpuLoad();
// Запуск интервала обновления
setInterval(fetchCpuLoad, 5000);
