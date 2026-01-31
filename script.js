document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const locationSelect = document.getElementById('locationSelect');
    const currentTempEl = document.getElementById('currentTemp');
    const lastYearTempEl = document.getElementById('lastYearTemp');
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

        // Calculate dates for current year (past 10 days to future 14 days - API limit for free forecast)
        const startDate2026 = new Date(today);
        startDate2026.setDate(today.getDate() - 10);
        const endDate2026 = new Date(today);
        endDate2026.setDate(today.getDate() + 14);

        // Calculate dates for last year
        const startDate2025 = new Date(startDate2026);
        startDate2025.setFullYear(2025);
        const endDate2025 = new Date(endDate2026);
        endDate2025.setFullYear(2025);

        const formatDate = (d) => d.toISOString().split('T')[0];

        try {
            updateBtn.disabled = true;
            updateBtn.textContent = '데이터 업데이트 중...';

            // 1. Fetch Current Year Forecast (Including past days)
            const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&past_days=10&forecast_days=14&timezone=auto`);
            const forecastData = await forecastRes.json();

            // 2. Fetch Last Year Archive
            const archiveRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate2025)}&end_date=${formatDate(endDate2025)}&daily=temperature_2m_max&timezone=auto`);
            const archiveData = await archiveRes.json();

            const result = {
                labels: forecastData.daily.time.map(t => t.split('-').slice(1).join('/')),
                thisYearData: forecastData.daily.temperature_2m_max,
                lastYearData: archiveData.daily.temperature_2m_max
            };

            return result;
        } catch (error) {
            console.error('Weather Data Error:', error);
            alert('날씨 데이터를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            return null;
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = '데이터 분석하기';
        }
    }

    async function updateDashboard(location) {
        const data = await fetchWeatherData(location);
        if (!data) return;

        // Today is at index 10 (since we have 10 past days)
        const todayIdx = 10;
        const todayThisYear = data.thisYearData[todayIdx];
        const todayLastYear = data.lastYearData[todayIdx];

        if (todayThisYear !== null && todayLastYear !== null) {
            const diff = (todayThisYear - todayLastYear).toFixed(1);
            currentTempEl.textContent = `${todayThisYear}°C`;
            lastYearTempEl.textContent = `${todayLastYear}°C`;
            tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
            tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';
            renderSummary(location, diff);
        }

        renderChart(data);
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
                        label: '올해 (실측+예보)',
                        data: data.thisYearData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointBackgroundColor: '#6366f1'
                    },
                    {
                        label: '작년 (실제 기록)',
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
                interaction: { intersect: false, mode: 'index' },
                scales: {
                    y: { grid: { color: 'rgba(0,0,0,0.05)' }, title: { display: true, text: '최고 기온 (°C)' } },
                    x: {
                        grid: { display: false },
                        ticks: { autoSkip: true, maxTicksLimit: 10 }
                    }
                }
            }
        });
    }

    function renderSummary(location, diff) {
        const locationName = coords[location].name;
        summaryText.innerHTML = `
            <div class="history-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <p><strong>${locationName} 지역</strong> 실제 기상 데이터 비교입니다.</p>
                <p>현재 최고 기온은 작년 동일 날짜 대비 <strong>${Math.abs(diff)}°C ${diff > 0 ? '높습니다' : '낮습니다'}</strong>.</p>
                <p style="color: #64748b; font-size: 0.9rem;">* 데이터 출처: Open-Meteo (국제 기상 모델 합산 수치)</p>
            </div>
        `;
    }

    updateBtn.addEventListener('click', () => {
        updateDashboard(locationSelect.value);
    });

    // Initial Load
    updateDashboard('seoul');
});
