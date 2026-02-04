# digitalizacion-VibeCoding

## Desarrollado por SMR

## Características

✅ **Datos Reales en Tiempo Real**: Integración con la API de Open-Meteo para obtener datos históricos y actuales de precipitación  
✅ **Selector de Provincias**: Permite visualizar datos de 15 provincias principales de España  
✅ **Comparativa Histórica**: Compara datos actuales con la media de los últimos 5 años  
✅ **Comparador de Años**: Compara precipitación acumulada desde el 1 de enero hasta la fecha actual con años anteriores  
✅ **Mensajes Dinámicos**: Análisis contextual que se adapta automáticamente según los niveles de precipitación  
✅ **Diseño Responsive**: Optimizado para escritorio, tablet y smartphone  
✅ **Gráficas Interactivas**: Visualizaciones dinámicas con Chart.js

## API Utilizada

**Open-Meteo APIs**  
- **Forecast API**: Para datos del año actual (2026)
  - URL: https://api.open-meteo.com/v1/forecast
- **Archive API**: Para datos históricos (hasta 2025)
  - URL: https://archive-api.open-meteo.com/
- Sin necesidad de API key  
- Completamente gratuita  
- Datos de precipitación en L/m² (mm)

## Provincias Disponibles

Sevilla (por defecto), Madrid, Barcelona, Valencia, Málaga, Bilbao, Zaragoza, Alicante, Murcia, A Coruña, Granada, Santander, Toledo, Salamanca, Cádiz, Huelva

## Cómo Ejecutar

```bash
cd rainfall-landing
python -m http.server 8000
```
Luego abre: http://localhost:8000

## 

## 
###### PROMPTS USED: ######
###PROMPT 1###
# Quiero que me hagas una landing page sencilla, usando HTML, CSS y JAVASCRIPT (vanilla, sin ningún tipo de framework).
# La landing debe ser responsive y verse apropiadamente en distintos dispositivos (escritorio, tablet, smartphone) independientemente de la resolución.
# Quiero que la landing muestre una comparativa entre los días de lluvia que llevamos en 2026, y la media de días de lluvia de los últimos 25 años. Con gráficas atractivas y fácilmente entendible, y con imágenes/iconos acorde a la temática.
# Los colores y la estética de la web, también deben ser acordes a la temática, sin dejar de dar sensación de ser una web profesional.
######
###PROMPT 2###
# Quiero añadir una sección más en el menú superior para elegir un año entre 2026 y 2002 y que compare los días de lluvia del mes actual del año ctual con el mes actual del año seleccionado. De nuevo con una gráfica apropiada y mostrando porcentajes.
######
###PROMPT 3###
# Quiero modificar el comparador para que compare litros de lluvia en vez de días de lluvia.
######
###PROMPT 4###
# Los datos están metidos "a fuego". Integrar API externa (Open-Meteo) para obtener datos reales de precipitación.
# Añadir selector de provincias españolas con Sevilla como ubicación por defecto.
# Calcular automáticamente medias históricas de los últimos 25 años con datos reales.
######
###PROMPT 5###
# Mejorar el comparador histórico para que compare la precipitación acumulada desde el 1 de enero hasta la fecha actual (en lugar de solo el mes actual).
# El texto debe mostrar "Compara la precipitación (l/m²) acumulada hasta hoy con la misma fecha de otros años".
# Actualizar dinámicamente el texto con la fecha actual (ej: "hasta el 4 de febrero").
######
###PROMPT 6###
# El mensaje de resumen debe ser dinámico y acorde a los resultados reales.
# Implementar 5 categorías de mensajes basados en la diferencia porcentual:
#   - Extremadamente lluvioso (>+50%)
#   - Más lluvioso (+15% a +50%)
#   - Normal (-15% a +15%)
#   - Poco lluvioso (-15% a -40%)
#   - De los menos lluviosos (<-40%)
# Los mensajes deben incluir el nombre de la provincia, el mes actual y el porcentaje de diferencia.
######
