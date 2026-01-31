document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const locationSelect = document.getElementById('locationSelect');
    const currentTempEl = document.getElementById('currentTemp');
    const currentPrecipEl = document.getElementById('currentPrecip');
    const lastYearPrecipEl = document.getElementById('lastYearPrecip');
    const tempDiffEl = document.getElementById('tempDiff');
    const summaryText = document.getElementById('summaryText');
    const ctx = document.getElementById('weatherChart').getContext('2d');

    let weatherChart;

    const coords = {
        seoul: { lat: 37.5665, lon: 126.9780, name: '서울' },
        busan: { lat: 35.1796, lon: 129.0756, name: '부산' },
        incheon: { lat: 37.4563, lon: 126.7052, name: '인천' },
        daegu: { lat: 35.8714, lon: 128.6014, name: '대구' },
        jeju: { lat: 33.4890, lon: 126.4983, name: '제주' }
    };

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

            // 1. Fetch Current Year (Including precipitation)
            const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&past_days=10&forecast_days=14&timezone=auto`);
            const forecastData = await forecastRes.json();

            // 2. Fetch Last Year Archive
            const archiveRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate2025)}&end_date=${formatDate(endDate2025)}&daily=temperature_2m_max,precipitation_sum&timezone=auto`);
            const archiveData = await archiveRes.json();

            return {
                labels: forecastData.daily.time.map(t => t.split('-').slice(1).join('/')),
                thisYearTemp: forecastData.daily.temperature_2m_max,
                thisYearPrecip: forecastData.daily.precipitation_sum,
                lastYearTemp: archiveData.daily.temperature_2m_max,
                lastYearPrecip: archiveData.daily.precipitation_sum
            };
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
            currentTempEl.textContent = `${curTemp}°C`;
            currentPrecipEl.textContent = `${curPrecip}mm`;
            lastYearPrecipEl.textContent = `${lyPrecip}mm`;
            tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
            tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';
            renderSummary(location, diff, curPrecip, lyPrecip);
        }

        renderChart(data);
    }

    function renderChart(data) {
        if (weatherChart) {
            weatherChart.destroy();
        }

        weatherChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        type: 'line',
                        label: '올해 기온 (°C)',
                        data: data.thisYearTemp,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: '작년 기온 (°C)',
                        data: data.lastYearTemp,
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: '올해 강수량 (mm)',
                        data: data.thisYearPrecip,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        yAxisID: 'y1'
                    },
                    {
                        label: '작년 강수량 (mm)',
                        data: data.lastYearPrecip,
                        backgroundColor: 'rgba(209, 213, 219, 0.4)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        position: 'left',
                        title: { display: true, text: '기온 (°C)' },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y1: {
                        position: 'right',
                        title: { display: true, text: '강수량 (mm)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function renderSummary(location, diff, curP, lyP) {
        const name = coords[location].name;
        const pStatus = curP > lyP ? '작년보다 비/눈이 많이 오거나 올 예정' : '작년보다 건조한';

        summaryText.innerHTML = `
            <div class="history-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <p><strong>${name} 지역</strong> 복합 기상 분석</p>
                <p>기온: 작년 대비 <strong>${Math.abs(diff)}°C ${diff > 0 ? '상승' : '하강'}</strong></p>
                <p>강수: <strong>${pStatus}</strong> 상태입니다. (오늘 기준 ${curP}mm vs 작년 ${lyP}mm)</p>
            </div>
        `;
    }

    updateBtn.addEventListener('click', () => updateDashboard(locationSelect.value));
    updateDashboard('seoul');
});
