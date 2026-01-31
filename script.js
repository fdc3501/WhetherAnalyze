document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const locationSelect = document.getElementById('locationSelect');
    const currentTempEl = document.getElementById('currentTemp');
    const lastYearTempEl = document.getElementById('lastYearTemp');
    const tempDiffEl = document.getElementById('tempDiff');
    const summaryText = document.getElementById('summaryText');
    const ctx = document.getElementById('weatherChart').getContext('2d');

    let weatherChart;

    function generateWeatherData(baseTemp) {
        const labels = [];
        const thisYearData = [];
        const lastYearData = [];

        // From 10 days ago to 30 days later
        for (let i = -10; i <= 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            labels.push(dateStr);

            // Simulation logic
            // Base seasonality + random noise
            const seasonFactor = Math.sin((date.getMonth() * 30 + date.getDate()) / 365 * 2 * Math.PI);
            const trend = i * 0.15; // Warming trend for 30 days forecast

            const lastYear = baseTemp + (seasonFactor * 5) + (Math.random() * 4 - 2);
            const thisYear = baseTemp + (seasonFactor * 5) + trend + (Math.random() * 6 - 3);

            lastYearData.push(parseFloat(lastYear.toFixed(1)));
            thisYearData.push(parseFloat(thisYear.toFixed(1)));
        }

        return { labels, thisYearData, lastYearData };
    }

    function updateDashboard(location) {
        // Base temperatures for different locations
        const baseTemps = {
            seoul: 3,
            busan: 8,
            incheon: 2,
            daegu: 5,
            jeju: 12
        };

        const data = generateWeatherData(baseTemps[location]);

        // Update stats (today is index 10)
        const todayIdx = 10;
        const todayThisYear = data.thisYearData[todayIdx];
        const todayLastYear = data.lastYearData[todayIdx];
        const diff = (todayThisYear - todayLastYear).toFixed(1);

        currentTempEl.textContent = `${todayThisYear}°C`;
        lastYearTempEl.textContent = `${todayLastYear}°C`;
        tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
        tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';

        renderChart(data);
        renderSummary(location, diff);
    }

    function renderChart(data) {
        if (weatherChart) {
            weatherChart.destroy();
        }

        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: '올해 (2026)',
                        data: data.thisYearData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: '작년 (2025)',
                        data: data.lastYearData,
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { usePointStyle: true }
                    }
                }
            }
        });
    }

    function renderSummary(location, diff) {
        const locationNames = {
            seoul: '서울',
            busan: '부산',
            incheon: '인천',
            daegu: '대구',
            jeju: '제주'
        };

        const trendText = diff > 0 ? '작년보다 따뜻한' : '작년보다 쌀쌀한';

        summaryText.innerHTML = `
            <div class="history-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <p><strong>${locationNames[location]} 지역</strong> 분석 결과입니다.</p>
                <p>현재 기온은 작년 대비 <strong>${Math.abs(diff)}°C ${diff > 0 ? '높게' : '낮게'}</strong> 나타나고 있습니다.</p>
                <p style="color: #64748b; font-size: 0.9rem;">향후 30일간은 기온이 점진적으로 상승하는 추세가 예상됩니다.</p>
            </div>
        `;
    }

    updateBtn.addEventListener('click', () => {
        updateDashboard(locationSelect.value);
    });

    // Initial Load
    updateDashboard('seoul');
});
