# digitalizacion-VibeCoding

## Desarrollado por SMR

## Características

✅ **Datos Reales en Tiempo Real**: Integración con la API de Open-Meteo para obtener datos históricos y actuales de precipitación  
✅ **Selector de Provincias**: Permite visualizar datos de 15 provincias principales de España  
✅ **Comparativa Histórica**: Compara datos actuales con la media de los últimos 25 años  
✅ **Comparador de Años**: Analiza diferencias entre el año actual y años anteriores desde 2000  
✅ **Diseño Responsive**: Optimizado para escritorio, tablet y smartphone  
✅ **Gráficas Interactivas**: Visualizaciones dinámicas con Chart.js

## API Utilizada

**Open-Meteo Archive API**  
- URL: https://archive-api.open-meteo.com/  
- Datos históricos desde 1940  
- Sin necesidad de API key  
- Completamente gratuita  
- Datos de precipitación en L/m² (mm)

## Provincias Disponibles

Sevilla (por defecto), Madrid, Barcelona, Valencia, Málaga, Bilbao, Zaragoza, Alicante, Murcia, A Coruña, Granada, Santander, Toledo, Salamanca, Cádiz

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
