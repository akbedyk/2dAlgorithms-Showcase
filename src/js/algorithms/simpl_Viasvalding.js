/*
### Алгоритм Висвалдинга (Visvalingam's Algorithm)  

Этот метод основан на удалении наименее значимых точек. 
Описание: 

    Входные данные : Набор точек, представляющих кривую.
    Шаг 1 : Для каждой точки вычислить площадь треугольника, образованного этой точкой и её соседями.
    Шаг 2 : Удалить точку с наименьшей площадью треугольника.
    Шаг 3 : Повторять шаг 2 до тех пор, пока не будет достигнут нужный уровень упрощения или количество точек не станет равным заданному числу.
     
Пример: 
Если у нас есть кривая, и одна из точек образует треугольник с минимальной площадью, то эта точка будет удалена, и процесс продолжится до достижения желаемого уровня упрощения. 
*/

// Функция для вычисления площади треугольника, образованного тремя точками
function triangleArea(p1, p2, p3) {
    return Math.abs(
        p1.x * (p2.y - p3.y) +
        p2.x * (p3.y - p1.y) +
        p3.x * (p1.y - p2.y)
    ) / 2;
}

// Алгоритм Висвалдинга для упрощения кривой
function visvalingamSimplification(points, simplificationLevel) {
    let n = points.length;
    if (n < 3) return points; // Если точек меньше трёх, ничего не упрощаем

    // Создаем массив для хранения площадей треугольников
    let areas = new Array(n).fill(Infinity);

    for (let i = 1; i < n - 1; i++) {
        areas[i] = triangleArea(points[i - 1], points[i], points[i + 1]);
    }

    // Определяем количество точек, которые нужно удалить
    let targetPointsCount = Math.max(2, Math.floor(n * (1 - simplificationLevel / 100)));

    while (points.length > targetPointsCount) {
        // Найдем индекс точки с минимальной площадью треугольника
        let minIndex = 1;
        let minArea = areas[1];
        for (let i = 2; i < points.length - 1; i++) {
            if (areas[i] < minArea) {
                minArea = areas[i];
                minIndex = i;
            }
        }

        // Удаляем точку с минимальной площадью
        points.splice(minIndex, 1);
        areas.splice(minIndex, 1);

        // Обновляем площади для соседних точек
        if (minIndex > 1) {
            areas[minIndex - 1] = triangleArea(points[minIndex - 2], points[minIndex - 1], points[minIndex]);
        }
        if (minIndex < points.length) {
            areas[minIndex] = triangleArea(points[minIndex - 1], points[minIndex], points[minIndex + 1]);
        }
    }

    return points;
}

// Пример использования
const points = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1 // Пример данных
}));

const simplificationLevel = 50; // Уровень упрощения в процентах
const simplifiedPoints = visvalingamSimplification(points, simplificationLevel);

console.log('Исходные точки:', points);
console.log('Упрощённые точки:', simplifiedPoints);
