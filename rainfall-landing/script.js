document.addEventListener('DOMContentLoaded', () => {
    // Provincias españolas con coordenadas
    const provinces = {
        'Sevilla': { lat: 37.3891, lon: -5.9845, name: 'Sevilla' },
        'Madrid': { lat: 40.4168, lon: -3.7038, name: 'Madrid' },
        'Barcelona': { lat: 41.3851, lon: 2.1734, name: 'Barcelona' },
        'Valencia': { lat: 39.4699, lon: -0.3763, name: 'Valencia' },
        'Málaga': { lat: 36.7213, lon: -4.4214, name: 'Málaga' },
        'Bilbao': { lat: 43.2630, lon: -2.9350, name: 'Bilbao' },
        'Zaragoza': { lat: 41.6488, lon: -0.8891, name: 'Zaragoza' },
        'Alicante': { lat: 38.3452, lon: -0.4810, name: 'Alicante' },
        'Murcia': { lat: 37.9922, lon: -1.1307, name: 'Murcia' },
        'A Coruña': { lat: 43.3623, lon: -8.4115, name: 'A Coruña' },
        'Granada': { lat: 37.1773, lon: -3.5986, name: 'Granada' },
        'Santander': { lat: 43.4623, lon: -3.8099, name: 'Santander' },
        'Toledo': { lat: 39.8628, lon: -4.0273, name: 'Toledo' },
        'Salamanca': { lat: 40.9701, lon: -5.6635, name: 'Salamanca' },
        'Cádiz': { lat: 36.5271, lon: -6.2886, name: 'Cádiz' }
    };

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    let currentProvince = 'Sevilla';
    let rainfallChart = null;
    let compChart = null;

    // Poblar selector de provincias
    const provinceSelect = document.getElementById('province-select');
    Object.keys(provinces).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        if (province === 'Sevilla') option.selected = true;
        provinceSelect.appendChild(option);
    });

    // Event listener para cambio de provincia
    provinceSelect.addEventListener('change', (e) => {
        currentProvince = e.target.value;
        loadAllData();
    });

    // Función para obtener datos de precipitación de Open-Meteo
    async function fetchRainfallData(lat, lon, startDate, endDate) {
        // Determinar si necesitamos usar la API de forecast (datos recientes) o archive (históricos)
        const startYear = parseInt(startDate.split('-')[0]);
        const currentYear = new Date().getFullYear();

        let url;

        // Para el año actual (2026), usar la API de forecast que incluye datos recientes
        if (startYear >= currentYear) {
            // La API de forecast no acepta start_date/end_date, solo past_days
            url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&timezone=Europe/Madrid&past_days=92`;
        } else {
            // Para años anteriores, usar la API de archive
            url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=Europe/Madrid`;
        }

        console.log('🌐 Solicitando datos:', url);

        try {
            const response = await fetch(url);
            console.log('📡 Respuesta recibida. Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Datos procesados correctamente');
            return data;
        } catch (error) {
            console.error('❌ Error al obtener datos:', error);
            console.error('Detalles:', error.message);
            return null;
        }
    }

    // Función para procesar datos por mes
    function processMonthlyData(dailyData, year) {
        const monthlyPrecipitation = new Array(12).fill(0);
        const dates = dailyData.time;
        const precipitation = dailyData.precipitation_sum;

        dates.forEach((date, index) => {
            const dateObj = new Date(date);
            if (dateObj.getFullYear() === year) {
                const month = dateObj.getMonth();
                monthlyPrecipitation[month] += precipitation[index] || 0;
            }
        });

        return monthlyPrecipitation;
    }

    // Función para calcular media histórica
    async function calculateHistoricalAverage(lat, lon, startYear, endYear) {
        const yearlyData = {};

        // Obtener datos año por año para evitar límites de la API
        for (let year = startYear; year <= endYear; year++) {
            const data = await fetchRainfallData(
                lat,
                lon,
                `${year}-01-01`,
                `${year}-12-31`
            );

            if (data && data.daily) {
                yearlyData[year] = processMonthlyData(data.daily, year);
            }
        }

        // Calcular promedio
        const avgMonthly = new Array(12).fill(0);
        const years = Object.keys(yearlyData);

        if (years.length === 0) return avgMonthly;

        for (let month = 0; month < 12; month++) {
            let sum = 0;
            years.forEach(year => {
                sum += yearlyData[year][month];
            });
            avgMonthly[month] = sum / years.length;
        }

        return avgMonthly;
    }

    // Cargar todos los datos
    async function loadAllData() {
        const province = provinces[currentProvince];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Mostrar indicador de carga
        document.getElementById('days-2026').textContent = '⏳';
        document.getElementById('avg-historical').textContent = '⏳';
        document.getElementById('diff-value').textContent = '⏳';

        console.log(`📍 Cargando datos para ${currentProvince}...`);

        // Obtener datos del año actual
        const currentYearData = await fetchRainfallData(
            province.lat,
            province.lon,
            `${currentYear}-01-01`,
            `${currentYear}-12-31`
        );

        if (!currentYearData || !currentYearData.daily) {
            console.error('❌ No se pudieron cargar los datos del año actual');
            document.getElementById('days-2026').textContent = 'Error';
            document.getElementById('avg-historical').textContent = 'Error';
            document.getElementById('diff-value').textContent = 'Error';
            alert('⚠️ Error al cargar los datos.\n\n' +
                'Posibles causas:\n' +
                '1. Problema de conexión a Internet\n' +
                '2. Si usas file://, abre con: http://localhost:8000\n\n' +
                'Abre la consola (F12) para más detalles.');
            return;
        }

        console.log('✅ Datos del año actual cargados');

        // Calcular media histórica (últimos 5 años para ser más rápido)
        console.log('📊 Calculando media histórica (últimos 5 años)...');
        const historicalAvg = await calculateHistoricalAverage(
            province.lat,
            province.lon,
            currentYear - 5,
            currentYear - 1
        );

        console.log('✅ Media histórica calculada');

        // Procesar datos del año actual
        const currentYearMonthly = processMonthlyData(currentYearData.daily, currentYear);

        // Preparar datos para el gráfico (solo mostrar hasta el mes actual)
        const currentYearDataForChart = currentYearMonthly.map((value, index) => {
            return index <= currentMonth ? value : null;
        });

        // Actualizar tarjetas de estadísticas
        const currentMonthPrecipitation = currentYearMonthly[currentMonth];
        const avgCurrentMonth = historicalAvg[currentMonth];
        const diff = avgCurrentMonth > 0
            ? ((currentMonthPrecipitation - avgCurrentMonth) / avgCurrentMonth * 100).toFixed(1)
            : 0;

        document.getElementById('days-2026').textContent = currentMonthPrecipitation.toFixed(1) + ' L/m²';
        document.getElementById('avg-historical').textContent = avgCurrentMonth.toFixed(1) + ' L/m²';
        document.getElementById('diff-value').textContent = (diff > 0 ? '+' : '') + diff + '%';
        document.getElementById('diff-value').style.color = diff > 0 ? '#10b981' : '#f43f5e';

        console.log(`📊 Precipitación actual: ${currentMonthPrecipitation.toFixed(1)} L/m²`);
        console.log(`📊 Media histórica (5 años): ${avgCurrentMonth.toFixed(1)} L/m²`);
        console.log(`📊 Diferencia: ${diff}%`);

        // Actualizar mensaje de insights
        updateInsightMessage(diff, currentProvince, currentMonth);

        // Actualizar gráfica principal
        updateMainChart(historicalAvg, currentYearDataForChart);

        // Inicializar comparador de años
        initYearComparator(province, currentYear);
    }

    // Generar mensaje dinámico de insights basado en los datos
    function updateInsightMessage(diffPercent, province, currentMonth) {
        const monthName = months[currentMonth];
        const insightText = document.getElementById('insight-text');

        if (!insightText) return;

        let message = '';
        const diff = parseFloat(diffPercent);

        // Extremadamente lluvioso (más del 50% por encima de la media)
        if (diff > 50) {
            message = `¡${province} está experimentando un período excepcionalmente lluvioso! Con un ${diff > 0 ? '+' : ''}${diff}% respecto a la media histórica, este ${monthName} está siendo uno de los más húmedos de los últimos años. Las precipitaciones acumuladas superan significativamente lo esperado para esta época del año.`;
        }
        // Más lluvioso (entre 15% y 50% por encima)
        else if (diff > 15) {
            message = `${province} registra precipitaciones por encima de lo habitual este ${monthName}. Con un ${diff > 0 ? '+' : ''}${diff}% más que la media de los últimos 5 años, estamos ante un período notablemente más húmedo de lo esperado. Las lluvias han sido más frecuentes e intensas que en años anteriores.`;
        }
        // Similar a la media (entre -15% y +15%)
        else if (diff >= -15) {
            message = `Las precipitaciones en ${province} se mantienen dentro de los valores normales para ${monthName}. Con una variación del ${diff > 0 ? '+' : ''}${diff}% respecto a la media histórica, los niveles de lluvia son similares a los registrados en años anteriores, lo que indica un comportamiento meteorológico típico para esta época.`;
        }
        // Poco lluvioso (entre -15% y -40%)
        else if (diff >= -40) {
            message = `${province} presenta un déficit de precipitaciones este ${monthName}. Con un ${diff}% menos que la media de los últimos 5 años, las lluvias han sido más escasas de lo habitual. Aunque no es una situación extrema, se observa una tendencia más seca que podría requerir seguimiento en los próximos meses.`;
        }
        // De los menos lluviosos (menos del -40%)
        else {
            message = `${province} atraviesa uno de los períodos más secos de los últimos años. Con un ${diff}% por debajo de la media histórica, este ${monthName} destaca por la escasez de precipitaciones. Los niveles de lluvia están significativamente por debajo de lo esperado, lo que podría tener implicaciones para los recursos hídricos de la región.`;
        }

        insightText.textContent = message;
    }

    // Actualizar gráfica principal
    function updateMainChart(historicalAvg, currentYearData) {
        const ctx = document.getElementById('rainfallChart').getContext('2d');

        const gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradientStroke1.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
        gradientStroke1.addColorStop(1, 'rgba(37, 99, 235, 0)');

        if (rainfallChart) {
            rainfallChart.destroy();
        }

        rainfallChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Media Histórica (5 años)',
                        data: historicalAvg,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'transparent',
                        pointBorderColor: 'transparent',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Precipitación ' + new Date().getFullYear(),
                        data: currentYearData,
                        borderColor: '#60a5fa',
                        borderWidth: 4,
                        pointBackgroundColor: '#60a5fa',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        backgroundColor: gradientStroke1,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: {
                                family: 'Outfit',
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1e293b',
                        titleColor: '#fff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + ' L/m²';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            callback: function (value) {
                                return value + ' L/m²';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // Inicializar comparador de años
    async function initYearComparator(province, currentYear) {
        const yearSelect = document.getElementById('year-select');
        yearSelect.innerHTML = '';

        // Actualizar el texto descriptivo con la fecha actual
        const now = new Date();
        const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
        const currentDateFormatted = dateFormatter.format(now);
        const descriptionElement = document.getElementById('comparator-description');
        if (descriptionElement) {
            descriptionElement.textContent = `Compara la precipitación (l/m²) acumulada hasta el ${currentDateFormatted} con la misma fecha de otros años`;
        }

        // Generar años (últimos 10 años)
        for (let year = currentYear - 1; year >= currentYear - 10; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // Event listener para cambio de año
        yearSelect.addEventListener('change', (e) => {
            updateYearComparison(province, parseInt(e.target.value), currentYear);
        });

        // Carga inicial
        updateYearComparison(province, currentYear - 1, currentYear);
    }

    // Actualizar comparación de años
    async function updateYearComparison(province, selectedYear, currentYear) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        const monthName = months[currentMonth];

        // Formatear la fecha actual como "4 de febrero"
        const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
        const currentDateFormatted = dateFormatter.format(now);

        console.log(`📊 Comparando precipitación hasta el ${currentDateFormatted}: ${selectedYear} vs ${currentYear}`);

        // Obtener datos del año seleccionado (desde 1 de enero hasta la fecha actual)
        const selectedYearData = await fetchRainfallData(
            province.lat,
            province.lon,
            `${selectedYear}-01-01`,
            `${selectedYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
        );

        // Obtener datos del año actual (desde 1 de enero hasta hoy)
        const currentYearData = await fetchRainfallData(
            province.lat,
            province.lon,
            `${currentYear}-01-01`,
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`
        );

        if (!selectedYearData || !currentYearData) {
            console.error('❌ Error al cargar datos para comparación');
            return;
        }

        // Calcular totales (precipitación acumulada desde el 1 de enero)
        let selectedYearPrecip = 0;
        let currentYearPrecip = 0;

        if (selectedYearData.daily && selectedYearData.daily.precipitation_sum) {
            selectedYearPrecip = selectedYearData.daily.precipitation_sum.reduce((a, b) => a + (b || 0), 0);
        }

        if (currentYearData.daily && currentYearData.daily.precipitation_sum) {
            currentYearPrecip = currentYearData.daily.precipitation_sum.reduce((a, b) => a + (b || 0), 0);
        }

        // Calcular diferencia porcentual
        const percentDiff = selectedYearPrecip > 0
            ? ((currentYearPrecip - selectedYearPrecip) / selectedYearPrecip * 100).toFixed(1)
            : 0;

        const compPercentage = document.getElementById('comp-percentage');
        compPercentage.textContent = (percentDiff > 0 ? '+' : '') + percentDiff + '%';
        compPercentage.style.color = percentDiff > 0 ? '#10b981' : '#f43f5e';

        console.log(`📊 ${selectedYear} (hasta ${currentDateFormatted}): ${selectedYearPrecip.toFixed(1)} L/m²`);
        console.log(`📊 ${currentYear} (hasta ${currentDateFormatted}): ${currentYearPrecip.toFixed(1)} L/m²`);
        console.log(`📊 Diferencia: ${percentDiff}%`);

        // Actualizar gráfica comparativa con etiquetas más descriptivas
        updateComparisonChart(
            `${selectedYear}\n(hasta ${currentDateFormatted})`,
            `${currentYear}\n(hasta hoy)`,
            selectedYearPrecip,
            currentYearPrecip
        );
    }

    // Actualizar gráfica de comparación
    function updateComparisonChart(selectedYear, currentYear, selectedYearPrecip, currentYearPrecip) {
        const compCtx = document.getElementById('compChart').getContext('2d');

        const data = {
            labels: [selectedYear, currentYear],
            datasets: [{
                label: 'Precipitación (L/m²)',
                data: [selectedYearPrecip, currentYearPrecip],
                backgroundColor: [
                    'rgba(255, 255, 255, 0.1)',
                    '#2563eb'
                ],
                borderColor: [
                    'rgba(255, 255, 255, 0.3)',
                    '#60a5fa'
                ],
                borderWidth: 1,
                borderRadius: 8
            }]
        };

        if (compChart) {
            compChart.destroy();
        }

        compChart = new Chart(compCtx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y.toFixed(1) + ' L/m²';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#64748b',
                            callback: function (value) {
                                return value + ' L';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#fff', font: { weight: 'bold' } }
                    }
                }
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Cargar datos iniciales
    loadAllData();
});
