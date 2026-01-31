document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const locationSelect = document.getElementById('locationSelect');
    const currentTempEl = document.getElementById('currentTemp');
    const currentPrecipEl = document.getElementById('currentPrecip');
    const lastYearPrecipEl = document.getElementById('lastYearPrecip');
    const tempDiffEl = document.getElementById('tempDiff');
    const summaryText = document.getElementById('summaryText');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const chartWrapper = document.getElementById('chartWrapper');
    const weatherGrid = document.getElementById('weatherGrid');
    const outfitCard = document.getElementById('outfitCard');
    const outfitImg = document.getElementById('outfitImg');
    const outfitText = document.getElementById('outfitText');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
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

    function getStatusIcon(temp, precip) {
        if (precip <= 0.1) return '☀️';
        if (temp <= 0) return '❄️';
        return '🌧️';
    }

    function getOutfitData(temp) {
        if (temp < 5) return { img: 'outfit_winter.png', text: '롱패딩, 목도리 필수! ❄️' };
        if (temp < 12) return { img: 'outfit_coat.png', text: '코트나 가죽자켓이 좋아요! 🧥' };
        if (temp < 20) return { img: 'outfit_jacket.png', text: '자켓이나 가디건 추천! 🧥' };
        return { img: 'outfit_summer.png', text: '가벼운 셔츠나 반팔! 👕' };
    }

    async function fetchWeatherData(location) {
        const { lat, lon } = coords[location];
        const today = new Date();
        const formatDate = (d) => d.toISOString().split('T')[0];

        const startDate2025 = new Date();
        startDate2025.setFullYear(2025);
        startDate2025.setDate(today.getDate() - 10);
        const endDate2025 = new Date(startDate2025);
        endDate2025.setDate(startDate2025.getDate() + 24);

        try {
            updateBtn.disabled = true;
            updateBtn.textContent = '업데이트 중...';

            const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&past_days=10&forecast_days=14&timezone=auto`);
            const forecastData = await forecastRes.json();

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
        const diff = (curTemp - data.lastYearTemp[todayIdx]).toFixed(1);

        currentTempEl.textContent = `${curTemp.toFixed(1)}°C`;
        currentPrecipEl.textContent = getWeatherStatus(curTemp, curPrecip);
        lastYearPrecipEl.textContent = getWeatherStatus(data.lastYearTemp[todayIdx], data.lastYearPrecip[todayIdx]);
        tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
        tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';

        // Update Outfit
        const outfit = getOutfitData(curTemp);
        outfitImg.src = outfit.img;
        outfitText.textContent = outfit.text;
        outfitCard.classList.remove('hidden');

        renderContent();
    }

    function renderContent() {
        if (!cachedData) return;

        if (currentTab === 'temp') {
            chartWrapper.classList.remove('hidden');
            weatherGrid.classList.add('hidden');
            renderChart();
        } else {
            chartWrapper.classList.add('hidden');
            weatherGrid.classList.remove('hidden');
            renderGrid();
        }
    }

    function renderChart() {
        if (weatherChart) weatherChart.destroy();

        const todayIdx = 10;
        const pointRadii = new Array(cachedData.labels.length).fill(3);
        const pointHoverRadii = new Array(cachedData.labels.length).fill(5);
        const pointBackgrounds = new Array(cachedData.labels.length).fill('#6366f1');
        const pointBorderWidths = new Array(cachedData.labels.length).fill(1);

        // Highlight today point
        pointRadii[todayIdx] = 8;
        pointHoverRadii[todayIdx] = 10;
        pointBackgrounds[todayIdx] = '#ef4444'; // Bright red for today
        pointBorderWidths[todayIdx] = 3;

        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cachedData.labels,
                datasets: [
                    {
                        label: '올해 최고 기온 (2026)',
                        data: cachedData.thisYearTemp,
                        borderColor: '#6366f1',
                        fill: true,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        pointRadius: pointRadii,
                        pointHoverRadius: pointHoverRadii,
                        pointBackgroundColor: pointBackgrounds,
                        pointBorderColor: '#fff',
                        pointBorderWidth: pointBorderWidths
                    },
                    {
                        label: '작년 최고 기온 (2025)',
                        data: cachedData.lastYearTemp,
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 0 // Hide points for last year to focus on this year
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) label += context.parsed.y + '°C';
                                if (context.dataIndex === todayIdx && context.datasetIndex === 0) {
                                    label += ' (오늘 ★)';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderGrid() {
        weatherGrid.innerHTML = '';
        cachedData.labels.forEach((date, i) => {
            const isToday = i === 10;
            const tile = document.createElement('div');
            tile.className = `status-tile ${isToday ? 'is-today' : ''}`;

            const curIcon = getStatusIcon(cachedData.thisYearTemp[i], cachedData.thisYearPrecip[i]);
            const lyIcon = getStatusIcon(cachedData.lastYearTemp[i], cachedData.lastYearPrecip[i]);

            tile.innerHTML = `
                ${isToday ? '<span class="today-badge">TODAY</span>' : ''}
                <div class="tile-date">${date}</div>
                <div class="tile-comparison">
                    <div class="compare-item">
                        <span class="compare-label">'26</span>
                        <span class="compare-icon">${curIcon}</span>
                    </div>
                    <div class="compare-item">
                        <span class="compare-label">'25</span>
                        <span class="compare-icon">${lyIcon}</span>
                    </div>
                </div>
            `;
            weatherGrid.appendChild(tile);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderContent();
        });
    });

    updateBtn.addEventListener('click', () => updateDashboard(locationSelect.value));

    // Scroll To Top Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll Reveal Logic
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    updateDashboard('seoul');
});
