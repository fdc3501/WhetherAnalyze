// --- i18n Dictionary ---
const i18n = {
    ko: {
        nav_home: "홈",
        nav_analysis: "분석 도구",
        nav_about: "서비스 소개",
        nav_methodology: "분석 방법",
        nav_partnership: "제휴 문의",
        nav_privacy: "개인정보처리방침",
        hero_subtitle: "올해와 작년의 오늘 날씨 비교 분석,<br>기후 변화 데이터를 한눈에 확인하세요.",
        cta_text: "날씨 데이터 비교 시작하기",
        search_placeholder: "도시 이름을 검색하세요... (예: 서울, Tokyo)",
        analyze_btn: "분석하기",
        favorites_label: "즐겨찾기:",
        stat_today: "올해 최고 기온",
        stat_status: "오늘의 날씨",
        stat_variance: "기온 변동 (작년 대비)",
        stat_lastyear: "작년 오늘의 날씨",
        outfit_title: "분석 기반 오늘의 옷차림 추천",
        tab_temp: "기온 변화 그래프",
        tab_grid: "통계 데이터 상세",
        insight_title: "오늘의 날씨 분석 리포트",
        share_label: "분석 결과 공유하고 친구들에게 자랑하기",
        outfit_winter: "롱패딩, 목도리 필수! ❄️",
        outfit_coat: "코트나 가죽자켓이 좋아요! 🧥",
        outfit_jacket: "자켓이나 가디건 추천! 🧥",
        outfit_summer: "가벼운 셔츠나 반팔! 👕",
        clear: "맑음",
        snow: "눈 ❄️",
        rain: "비 🌧️",
        no_results: "검색 결과가 없습니다.",
        analyzing: "분석 중...",
        copy_success: "링크가 복사되었습니다! 🔗",
        insight_intro: "오늘의 최고 기온은 **{curTemp}°C**로, 작년 동일 지점의 **{lastYearTemp}°C**와 비교했을 때 ",
        insight_similar: "거의 비슷한 수준을 유지하고 있습니다. ",
        insight_warmer: "약 **{diff}°C 더 따뜻한** 경향을 보이고 있습니다. ",
        insight_cooler: "약 **{diff}°C 더 서늘한** 날씨입니다. ",
        insight_outro: "추천드리는 옷차림인 **{outfit}**을 착용하시면 야외 활동 시 더욱 쾌적할 것으로 예상됩니다. 지속적인 데이터 트래킹을 통해 나만의 기상 인사이트를 쌓아보세요!",
        share_msg: "[{city}] 오늘 최고 기온은 {temp}! 작년보다 {diff} 달라졌어요. WEATHER ANALYTICS에서 확인해보세요.",
        chart_label_this_year: "올해 최고 기온 ({year}, {city})",
        chart_label_last_year: "작년 최고 기온 ({year})",
        today_star: "오늘 ★",
        today_badge: "오늘",
        my_location: "우리 동네",
        geo_error: "위치정보를 가져올 수 없습니다.",
        geo_denied: "위치 권한이 거부되었습니다.",
        search_first: "먼저 검색 결과에서 도시를 선택해주세요."
    },
    en: {
        nav_home: "Home",
        nav_analysis: "Tools",
        nav_about: "About",
        nav_methodology: "Method",
        nav_partnership: "Contact",
        nav_privacy: "Privacy",
        hero_subtitle: "Comparative analysis of today's weather vs last year,<br>Check climate change data at a glance.",
        cta_text: "Start Weather Comparison",
        search_placeholder: "Search for a city... (e.g. New York, Tokyo)",
        analyze_btn: "Analyze",
        favorites_label: "Favorites:",
        stat_today: "Today's Max",
        stat_status: "Today's Status",
        stat_variance: "Variance (vs Last Year)",
        stat_lastyear: "Last Year's Today",
        outfit_title: "Analysis-based Outfit Recommendation",
        tab_temp: "Temp Variance Graph",
        tab_grid: "Detailed Statistics",
        insight_title: "Today's Weather Analysis Report",
        share_label: "Share your results with friends!",
        outfit_winter: "Puffer coat and scarf are a must! ❄️",
        outfit_coat: "A coat or leather jacket is good! 🧥",
        outfit_jacket: "Recommend a jacket or cardigan! 🧥",
        outfit_summer: "Light shirt or short sleeves! 👕",
        clear: "Clear",
        snow: "Snow ❄️",
        rain: "Rain 🌧️",
        no_results: "No results found.",
        analyzing: "Analyzing...",
        copy_success: "Link copied to clipboard! 🔗",
        insight_intro: "Today's max temperature is **{curTemp}°C**, compared to **{lastYearTemp}°C** at the same location last year, it is ",
        insight_similar: "staying at almost the same level. ",
        insight_warmer: "showing a trend of being about **{diff}°C warmer**. ",
        insight_cooler: "about **{diff}°C cooler**. ",
        insight_outro: "We recommend wearing **{outfit}** for a more comfortable outdoor experience. Build your own weather insights through continuous data tracking!",
        share_msg: "[{city}] Today's max is {temp}! It changed by {diff} compared to last year. Check it out on WEATHER ANALYTICS.",
        chart_label_this_year: "This Year Max ({year}, {city})",
        chart_label_last_year: "Last Year Max ({year})",
        today_star: "Today ★",
        today_badge: "TODAY",
        my_location: "My Location",
        geo_error: "Unable to get location.",
        geo_denied: "Location access denied.",
        search_first: "Please select a city from the search results first."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
    const citySearch = document.getElementById('citySearch');
    const searchResults = document.getElementById('searchResults');
    const favoritesList = document.getElementById('favoritesList');
    const geoBtn = document.getElementById('geoBtn');

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

    const shareKakao = document.getElementById('shareKakao');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareFacebook = document.getElementById('shareFacebook');
    const copyLink = document.getElementById('copyLink');

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

    let currentLang = localStorage.getItem('weatherLang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('weatherLang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[lang][key]) {
                el.innerHTML = i18n[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (i18n[lang][key]) {
                el.placeholder = i18n[lang][key];
            }
        });

        // Update switcher UI
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');

        // Re-render components that depend on language
        if (cachedData) {
            updateDashboard();
        }
        renderFavorites();
    }

    document.getElementById('lang-ko').addEventListener('click', () => applyLanguage('ko'));
    document.getElementById('lang-en').addEventListener('click', () => applyLanguage('en'));

    function getWeatherStatus(temp, precip) {
        if (precip <= 0.1) return i18n[currentLang].clear;
        if (temp <= 0) return i18n[currentLang].snow;
        return i18n[currentLang].rain;
    }

    function getStatusIcon(temp, precip) {
        if (precip <= 0.1) return '☀️';
        if (temp <= 0) return '❄️';
        return '🌧️';
    }

    function getOutfitData(temp) {
        if (temp < 5) return { img: 'outfit_winter.png', text: i18n[currentLang].outfit_winter };
        if (temp < 12) return { img: 'outfit_coat.png', text: i18n[currentLang].outfit_coat };
        if (temp < 20) return { img: 'outfit_jacket.png', text: i18n[currentLang].outfit_jacket };
        return { img: 'outfit_summer.png', text: i18n[currentLang].outfit_summer };
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
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&accept-language=${currentLang}&limit=10`);
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
            searchResults.innerHTML = `<div class="result-item">${i18n[currentLang].no_results}</div>`;
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

    // --- Geolocation Logic ---
    geoBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert(i18n[currentLang].geo_error);
            return;
        }

        geoBtn.classList.add('loading');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${currentLang}`);
                    const data = await res.json();
                    const cityName = data.address.city || data.address.town || data.address.village || data.address.suburb || i18n[currentLang].my_location;

                    selectedCity = {
                        lat: latitude,
                        lon: longitude,
                        name: cityName,
                        country: data.address.country || ''
                    };

                    citySearch.value = selectedCity.name;
                    updateDashboard();
                } catch (err) {
                    console.error(err);
                    selectedCity = { lat: latitude, lon: longitude, name: i18n[currentLang].my_location, country: '' };
                    citySearch.value = selectedCity.name;
                    updateDashboard();
                } finally {
                    geoBtn.classList.remove('loading');
                }
            },
            (err) => {
                geoBtn.classList.remove('loading');
                if (err.code === 1) alert(i18n[currentLang].geo_denied);
                else alert(i18n[currentLang].geo_error);
            }
        );
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
            updateBtn.textContent = i18n[currentLang].analyzing;

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
            alert(i18n[currentLang].geo_error);
            return null;
        } finally {
            updateBtn.disabled = false;
            updateBtn.classList.remove('loading');
            updateBtn.textContent = i18n[currentLang].analyze_btn;
        }
    }

    async function updateDashboard() {
        // Validation: if search results are open but not applied
        if (!searchResults.classList.contains('hidden')) {
            const firstResult = searchResults.querySelector('.city-info');
            if (firstResult) {
                firstResult.click();
                return;
            }
        }

        const data = await fetchWeatherData();
        if (!data) return;

        const container = document.getElementById('analysis');
        const statsArea = document.querySelector('.stats-container');

        // Scroll to results
        statsArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
        outfitImg.src = outfit.img;
        outfitText.textContent = outfit.text;
        outfitCard.classList.remove('hidden');

        // GEO: Generate AI Insight
        const aiInsightArea = document.getElementById('aiInsightArea');
        const aiInsightText = document.getElementById('aiInsightText');
        if (aiInsightArea && aiInsightText) {
            const dict = i18n[currentLang];
            let insight = dict.insight_intro.replace('{curTemp}', curTemp.toFixed(1)).replace('{lastYearTemp}', lastYearTemp.toFixed(1));

            if (Math.abs(diff) < 1) {
                insight += dict.insight_similar;
            } else if (diff > 0) {
                insight += dict.insight_warmer.replace('{diff}', diff);
            } else {
                insight += dict.insight_cooler.replace('{diff}', Math.abs(diff));
            }

            insight += dict.insight_outro.replace('{outfit}', outfit.text);

            aiInsightText.innerHTML = insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            aiInsightArea.classList.remove('hidden');
        }

        // Show Share Area
        const shareArea = document.getElementById('shareArea');
        if (shareArea) shareArea.classList.remove('hidden');

        lucide.createIcons();
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
                        label: i18n[currentLang].chart_label_this_year.replace('{year}', '2026').replace('{city}', selectedCity.name),
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
                        label: i18n[currentLang].chart_label_last_year.replace('{year}', '2025'),
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
                                    label += ` (${i18n[currentLang].today_star})`;
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
                ${isToday ? `<span class="today-badge">${i18n[currentLang].today_badge}</span>` : ''}
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

    // --- Share Logic ---
    function getShareText() {
        const city = citySearch.value || i18n[currentLang].my_location;
        const temp = currentTempEl.textContent;
        const diff = tempDiffEl.textContent;
        return i18n[currentLang].share_msg.replace('{city}', city).replace('{temp}', temp).replace('{diff}', diff);
    }

    shareTwitter.addEventListener('click', () => {
        const text = getShareText();
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    });

    shareFacebook.addEventListener('click', () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    });

    shareKakao.addEventListener('click', () => {
        const url = window.location.href;
        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`, '_blank');
    });

    copyLink.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast(i18n[currentLang].copy_success);
        }).catch(err => {
            console.error('Clipboard error:', err);
        });
    });

    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Initialize
    applyLanguage(currentLang);
});
