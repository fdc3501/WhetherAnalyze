document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const locationSelect = document.getElementById('locationSelect');
    const currentTempEl = document.getElementById('currentTemp');
    const currentPrecipEl = document.getElementById('currentPrecip');
    const lastYearPrecipEl = document.getElementById('lastYearPrecip');
    const tempDiffEl = document.getElementById('tempDiff');
    const summaryText = document.getElementById('summaryText');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const ctx = document.getElementById('weatherChart').getContext('2d');

    let weatherChart;
    let cachedData = null;
    let currentTab = 'temp';

    const coords = {
        seoul: { lat: 37.5665, lon: 126.9780, name: '서울' },
        busan: { lat: 35.1796, lon: 129.0756, name: '부산' },
        incheon: { lat: 37.4563, lon: 126.7052, name: '인천' },
        daegu: { lat: 35.8714, lon: 128.6014, name: '대구' },
        jeju: { lat: 33.4890, lon: 126.4983, name: '제주' }
    };

    function getWeatherStatus(temp, precip) {
        if (precip <= 0.1) return '맑음';
        if (temp <= 0) return '눈 ❄️';
        return '비 🌧️';
    }

    async function fetchWeatherData(location) {
        const { lat, lon } = coords[location];
        const today = new Date();

        const startDate2026 = new Date(today);
        startDate2026.setDate(today.getDate() - 10);
        const endDate2026 = new Date(today);
        endDate2026.setDate(today.getDate() + 14);

        const startDate2025 = new Date(startDate2026);
        startDate2025.setFullYear(2025);
        const endDate2025 = new Date(endDate2026);
        endDate2025.setFullYear(2025);

        const formatDate = (d) => d.toISOString().split('T')[0];

        try {
            updateBtn.disabled = true;
            updateBtn.textContent = '데이터 업데이트 중...';

            // 1. Fetch Current Year
            const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&past_days=10&forecast_days=14&timezone=auto`);
            const forecastData = await forecastRes.json();

            // 2. Fetch Last Year Archive
            const archiveRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate2025)}&end_date=${formatDate(endDate2025)}&daily=temperature_2m_max,precipitation_sum&timezone=auto`);
            const archiveData = await archiveRes.json();

            cachedData = {
                labels: forecastData.daily.time.map(t => t.split('-').slice(1).join('/')),
                thisYearTemp: forecastData.daily.temperature_2m_max,
                thisYearPrecip: forecastData.daily.precipitation_sum,
                lastYearTemp: archiveData.daily.temperature_2m_max,
                lastYearPrecip: archiveData.daily.precipitation_sum
            };

            return cachedData;
        } catch (error) {
            console.error('Weather Data Error:', error);
            alert('날씨 데이터를 가져오는데 실패했습니다.');
            return null;
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = '데이터 분석하기';
        }
    }

    async function updateDashboard(location) {
        const data = await fetchWeatherData(location);
        if (!data) return;

        const todayIdx = 10;
        const curTemp = data.thisYearTemp[todayIdx];
        const curPrecip = data.thisYearPrecip[todayIdx];
        const lyTemp = data.lastYearTemp[todayIdx];
        const lyPrecip = data.lastYearPrecip[todayIdx];

        if (curTemp !== null && lyTemp !== null) {
            const diff = (curTemp - lyTemp).toFixed(1);
            currentTempEl.textContent = `${curTemp.toFixed(1)}°C`;

            currentPrecipEl.textContent = getWeatherStatus(curTemp, curPrecip);
            lastYearPrecipEl.textContent = getWeatherStatus(lyTemp, lyPrecip);

            tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
            tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';
            renderSummary(location, diff, curTemp, curPrecip, lyTemp, lyPrecip);
        }

        renderChart();
    }

    function renderChart() {
        if (!cachedData) return;
        if (weatherChart) {
            weatherChart.destroy();
        }

        const isTemp = currentTab === 'temp';

        const thisYearStatusData = cachedData.thisYearPrecip.map((p, i) => {
            if (p <= 0.1) return 0; // Clear
            return cachedData.thisYearTemp[i] <= 0 ? 2 : 1; // 2: Snow, 1: Rain
        });

        const lastYearStatusData = cachedData.lastYearPrecip.map((p, i) => {
            if (p <= 0.1) return 0;
            return cachedData.lastYearTemp[i] <= 0 ? 2 : 1;
        });

        const datasets = isTemp ? [
            {
                label: '올해 최고 기온 (°C)',
                data: cachedData.thisYearTemp,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: '작년 최고 기온 (°C)',
                data: cachedData.lastYearTemp,
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4
            }
        ] : [
            {
                label: '올해 날씨 상태',
                data: thisYearStatusData,
                backgroundColor: thisYearStatusData.map(v => v === 2 ? '#93c5fd' : (v === 1 ? '#3b82f6' : 'rgba(0,0,0,0.05)')),
                borderRadius: 5
            },
            {
                label: '작년 날씨 상태',
                data: lastYearStatusData,
                backgroundColor: lastYearStatusData.map(v => v === 2 ? '#cbd5e1' : (v === 1 ? '#94a3b8' : 'rgba(0,0,0,0.02)')),
                borderRadius: 5
            }
        ];

        weatherChart = new Chart(ctx, {
            type: isTemp ? 'line' : 'bar',
            data: {
                labels: cachedData.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: isTemp ? undefined : 2.5,
                        ticks: isTemp ? undefined : {
                            stepSize: 1,
                            callback: function (value) {
                                if (value === 0) return '맑음';
                                if (value === 1) return '비 🌧️';
                                if (value === 2) return '눈 ❄️';
                                return '';
                            }
                        },
                        title: { display: true, text: isTemp ? '기온 (°C)' : '기상 상태' },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: { grid: { display: false } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                if (isTemp) return context.dataset.label + ': ' + context.parsed.y + '°C';
                                const val = context.parsed.y;
                                const status = val === 0 ? '맑음' : (val === 2 ? '눈 ❄️' : '비 🌧️');
                                return context.dataset.label + ': ' + status;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderSummary(location, diff, curTemp, curPrecip, lyTemp, lyPrecip) {
        const name = coords[location].name;
        const curStatus = getWeatherStatus(curTemp, curPrecip);
        const lyStatus = getWeatherStatus(lyTemp, lyPrecip);

        summaryText.innerHTML = `
            <div class="history-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <p><strong>${name} 지역</strong> 날씨 현황 비교</p>
                <p>기온: 작년에 비해 <strong>${Math.abs(diff)}°C ${diff > 0 ? '따뜻해졌습니다' : '추워졌습니다'}</strong>.</p>
                <p>상세상태: 올해는 <strong>${curStatus}</strong>, 작년에는 <strong>${lyStatus}</strong> 이었습니다.</p>
            </div>
        `;
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderChart();
        });
    });

    updateBtn.addEventListener('click', () => updateDashboard(locationSelect.value));
    updateDashboard('seoul');
});
