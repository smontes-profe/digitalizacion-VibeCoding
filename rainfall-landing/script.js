document.addEventListener('DOMContentLoaded', () => {
    // Datos simulados (Días de lluvia)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Media histórica (últimos 25 años)
    const historicalAvg = [8, 7, 9, 11, 8, 5, 2, 3, 6, 10, 11, 9];

    // Datos actuales 2026 (Simulados hasta hoy 28 Ene, resto estimado/pasado)
    // Supongamos que estamos en Enero de 2026
    const currentYearData = [12, null, null, null, null, null, null, null, null, null, null, null];

    // Actualizar tarjetas de estadísticas
    const days2026 = 12; // Enero
    const avgJan = historicalAvg[0];
    const diff = ((days2026 - avgJan) / avgJan * 100).toFixed(1);

    document.getElementById('days-2026').textContent = days2026;
    document.getElementById('avg-historical').textContent = avgJan;
    document.getElementById('diff-value').textContent = (diff > 0 ? '+' : '') + diff + '%';
    document.getElementById('diff-value').style.color = diff > 0 ? '#10b981' : '#f43f5e';

    // Gráfica con Chart.js
    const ctx = document.getElementById('rainfallChart').getContext('2d');

    const gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradientStroke1.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
    gradientStroke1.addColorStop(1, 'rgba(37, 99, 235, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Media Histórica (25 años)',
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
                    label: 'Días Lluvia 2026',
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
                    displayColors: true
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
                            return value + ' días';
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

    // --- COMPARADOR DE AÑOS ---
    const yearSelect = document.getElementById('year-select');
    const compPercentage = document.getElementById('comp-percentage');
    const currentMonthDays = 12; // Enero 2026

    // Generar años 2002-2025 (Excluimos 2026 de la comparación con sí mismo)
    for (let year = 2025; year >= 2002; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Inicializar Chart Comparativo
    const compCtx = document.getElementById('compChart').getContext('2d');
    let compChart;

    function updateComparison(selectedYear) {
        // Simulamos un valor aleatorio coherente para el mes de enero del año seleccionado (entre 2 y 20)
        // Para que sea determinista en esta demo, usaremos una semilla basada en el año
        const seededRain = Math.floor(((selectedYear * 13) % 18) + 3);
        const percentDiff = (((currentMonthDays - seededRain) / seededRain) * 100).toFixed(1);

        compPercentage.textContent = (percentDiff > 0 ? '+' : '') + percentDiff + '%';
        compPercentage.style.color = percentDiff > 0 ? '#10b981' : '#f43f5e';

        const data = {
            labels: [selectedYear, '2026'],
            datasets: [{
                label: 'Días de Lluvia (Enero)',
                data: [seededRain, currentMonthDays],
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
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#fff', font: { weight: 'bold' } }
                    }
                }
            }
        });
    }

    // Event listener para cambio de año
    yearSelect.addEventListener('change', (e) => {
        updateComparison(e.target.value);
    });

    // Carga inicial (2025)
    updateComparison(2025);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
