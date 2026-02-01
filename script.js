document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const citySearch = document.getElementById('citySearch');
    const searchResults = document.getElementById('searchResults');
    const favoritesList = document.getElementById('favoritesList');

    const currentTempEl = document.getElementById('currentTemp');
    const currentPrecipEl = document.getElementById('currentPrecip');
    const lastYearPrecipEl = document.getElementById('lastYearPrecip');
    const tempDiffEl = document.getElementById('tempDiff');
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
    let selectedCity = { lat: 37.5665, lon: 126.9780, name: '서울', country: 'South Korea' };
    let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [
        { lat: 37.5665, lon: 126.9780, name: '서울', country: 'South Korea' },
        { lat: 35.1796, lon: 129.0756, name: '부산', country: 'South Korea' },
        { lat: 33.4890, lon: 126.4983, name: '제주', country: 'South Korea' },
        { lat: 35.6895, lon: 139.6917, name: 'Tokyo', country: 'Japan' },
        { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'USA' }
    ];

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

    // --- Search Logic ---
    let searchTimeout;
    citySearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }
        searchTimeout = setTimeout(() => searchCities(query), 300);
    });

    async function searchCities(query) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&accept-language=ko&limit=10`);
            const results = await res.json();

            // Map Nominatim results to our expected format
            const mappedResults = results.map(r => ({
                latitude: parseFloat(r.lat),
                longitude: parseFloat(r.lon),
                name: r.name || r.display_name.split(',')[0],
                country: r.address.country || '',
                admin1: r.address.state || r.address.province || r.address.region || (r.address.city !== r.name ? r.address.city : '')
            }));

            renderSearchResults(mappedResults);
        } catch (err) {
            console.error('Search error:', err);
        }
    }

    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="result-item">검색 결과가 없습니다.</div>';
        } else {
            results.forEach(city => {
                const isFav = favorites.some(f => f.lat.toFixed(2) === city.latitude.toFixed(2) && f.lon.toFixed(2) === city.longitude.toFixed(2));
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <div class="city-info" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}" data-country="${city.country}">
                        <span class="city-name">${city.name}${city.admin1 ? ', ' + city.admin1 : ''}</span>
                        <span class="city-country">${city.country}</span>
                    </div>
                    <button class="fav-star ${isFav ? 'active' : ''}" data-city='${JSON.stringify({ lat: city.latitude, lon: city.longitude, name: city.name, country: city.country })}'>★</button>
                `;

                // Select city click
                item.querySelector('.city-info').addEventListener('click', () => {
                    selectedCity = {
                        lat: city.latitude,
                        lon: city.longitude,
                        name: city.name,
                        country: city.country
                    };
                    citySearch.value = city.country && city.name !== city.country ? `${city.name} (${city.country})` : city.name;
                    searchResults.classList.add('hidden');
                    updateDashboard();
                });

                // Favorite toggle click
                item.querySelector('.fav-star').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const cityData = JSON.parse(e.target.dataset.city);
                    toggleFavorite(cityData);
                    e.target.classList.toggle('active');
                });

                searchResults.appendChild(item);
            });
        }
        searchResults.classList.remove('hidden');
    }

    // Click outside search results to hide
    document.addEventListener('click', (e) => {
        if (!citySearch.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // --- Favorites Logic ---
    function toggleFavorite(city) {
        const index = favorites.findIndex(f => f.lat.toFixed(2) === city.lat.toFixed(2) && f.lon.toFixed(2) === city.lon.toFixed(2));
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(city);
        }
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        renderFavorites();
    }

    function renderFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(city => {
            const chip = document.createElement('div');
            const isActive = selectedCity.lat.toFixed(2) === city.lat.toFixed(2) && selectedCity.lon.toFixed(2) === city.lon.toFixed(2);
            chip.className = `fav-chip ${isActive ? 'active' : ''}`;
            chip.innerHTML = `<span>${city.name}</span>`;
            chip.addEventListener('click', () => {
                selectedCity = city;
                citySearch.value = `${city.name} (${city.country})`;
                updateDashboard();
            });
            favoritesList.appendChild(chip);
        });
    }

    // --- Weather Data Logic ---
    async function fetchWeatherData() {
        const { lat, lon } = selectedCity;
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

            if (!forecastData.daily || !archiveData.daily) throw new Error('Invalid data');

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
            alert('날씨 데이터를 가져오는 중 오류가 발생했습니다.');
            return null;
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = '분석하기';
        }
    }

    async function updateDashboard() {
        const data = await fetchWeatherData();
        if (!data) return;

        const todayIdx = 10;
        const curTemp = data.thisYearTemp[todayIdx];
        const curPrecip = data.thisYearPrecip[todayIdx];
        const lastYearTemp = data.lastYearTemp[todayIdx];
        const diff = (curTemp - lastYearTemp).toFixed(1);

        currentTempEl.textContent = `${curTemp !== null ? curTemp.toFixed(1) : '--'}°C`;
        currentPrecipEl.textContent = getWeatherStatus(curTemp, curPrecip);
        lastYearPrecipEl.textContent = getWeatherStatus(lastYearTemp, data.lastYearPrecip[todayIdx]);
        tempDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff}°C`;
        tempDiffEl.style.color = diff > 0 ? '#ef4444' : '#3b82f6';

        const outfit = getOutfitData(curTemp);
        const outfitWebp = document.getElementById('outfitWebp');
        if (outfitWebp) outfitWebp.srcset = outfit.img.replace('.png', '.webp');
        outfitImg.src = outfit.img;
        outfitText.textContent = outfit.text;
        outfitCard.classList.remove('hidden');

        // GEO: Generate AI Insight
        const aiInsightArea = document.getElementById('aiInsightArea');
        const aiInsightText = document.getElementById('aiInsightText');
        if (aiInsightArea && aiInsightText) {
            let insight = `오늘의 최고 기온은 **${curTemp.toFixed(1)}°C**로, 작년 동일 지점의 **${lastYearTemp.toFixed(1)}°C**와 비교했을 때 `;
            if (Math.abs(diff) < 1) {
                insight += `거의 비슷한 수준을 유지하고 있습니다. `;
            } else if (diff > 0) {
                insight += `약 **${diff}°C 더 따뜻한** 경향을 보이고 있습니다. `;
            } else {
                insight += `약 **${Math.abs(diff)}°C 더 서늘한** 날씨입니다. `;
            }

            insight += `추천드리는 옷차림인 **${outfit.text}**을 착용하시면 야외 활동 시 더욱 쾌적할 것으로 예상됩니다. `;
            insight += `지속적인 데이터 트래킹을 통해 나만의 기상 인사이트를 쌓아보세요!`;

            aiInsightText.innerHTML = insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            aiInsightArea.classList.remove('hidden');
        }

        renderFavorites();
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
        const pointBackgrounds = new Array(cachedData.labels.length).fill('#6366f1');

        pointRadii[todayIdx] = 8;
        pointBackgrounds[todayIdx] = '#ef4444';

        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cachedData.labels,
                datasets: [
                    {
                        label: `올해 최고 기온 (2026, ${selectedCity.name})`,
                        data: cachedData.thisYearTemp,
                        borderColor: '#6366f1',
                        fill: true,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        pointRadius: pointRadii,
                        pointBackgroundColor: pointBackgrounds,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: '작년 최고 기온 (2025)',
                        data: cachedData.lastYearTemp,
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 0
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

    updateBtn.addEventListener('click', updateDashboard);

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

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Initialize
    renderFavorites();
    updateDashboard();
});
