
/*

### Метод сглаживания с использованием фильтра Гаусса  

Этот метод использует сглаживание кривой перед её упрощением. 
Описание: 

    Входные данные : Набор точек, представляющих кривую.
    Шаг 1 : Применить фильтр Гаусса к координатам точек кривой для сглаживания.
    Шаг 2 : После сглаживания можно использовать другой метод симплификации, например, Рамера-Дугласа-Пеккера, чтобы уменьшить количество точек.
     
Пример: 
Сглаживание может устранить мелкие колебания кривой, что облегчит последующий процесс упрощения. 
*/

// Функция для применения фильтра Гаусса к массиву точек
function gaussianFilter(points, sigma = 1) {
    const n = points.length;
    const gaussKernel = generateGaussianKernel(sigma);

    const smoothedPoints = points.map(point => ({ ...point }));

    for (let i = 0; i < n; i++) {
        let sumX = 0;
        let sumY = 0;
        let weightSum = 0;

        for (let j = -gaussKernel.length + 1; j < gaussKernel.length; j++) {
            const index = i + j;
            if (index >= 0 && index < n) {
                const weight = gaussKernel[Math.abs(j)];
                sumX += points[index].x * weight;
                sumY += points[index].y * weight;
                weightSum += weight;
            }
        }

        smoothedPoints[i].x = sumX / weightSum;
        smoothedPoints[i].y = sumY / weightSum;
    }

    return smoothedPoints;
}

// Функция для генерации ядра Гаусса
function generateGaussianKernel(sigma) {
    const size = Math.ceil(6 * sigma); // Размер ядра
    const kernel = [];

    for (let i = 0; i < size; i++) {
        const x = i - Math.floor(size / 2);
        const value = (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-(x * x) / (2 * sigma * sigma));
        kernel.push(value);
    }

    const sum = kernel.reduce((a, b) => a + b, 0);
    return kernel.map(v => v / sum); // Нормируем ядро
}

/* Пример использования
const points = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1 // Пример данных
}));

const simplificationLevel = 50; // Уровень упрощения в процентах

// Применяем фильтр Гаусса
const smoothedPoints = gaussianFilter(points, 2);

console.log('Исходные точки:', points);
console.log('Сглаженные точки:', smoothedPoints);
*/

// Экспорт функций для использования в других файлах
module.exports = {
    gaussianFilter
};