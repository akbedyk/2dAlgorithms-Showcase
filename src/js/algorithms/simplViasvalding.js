/*
### �������� ����������� (Visvalingam's Algorithm)  

���� ����� ������� �� �������� �������� �������� �����. ��������, ���� � ��� ���� ������, � ���� �� ����� �������� ����������� � ����������� ��������, �� ��� ����� ����� �������, � ������� ����������� �� ���������� ��������� ������ ���������.

��������: 
    ������� ������ : ����� �����, �������������� ������.
    ��� 1 : ��� ������ ����� ��������� ������� ������������, ������������� ���� ������ � � ��������.
    ��� 2 : ������� ����� � ���������� �������� ������������.
    ��� 3 : ��������� ��� 2 �� ��� ���, ���� �� ����� ��������� ������ ������� ��������� ��� ���������� ����� �� ������ ������ ��������� �����.

������ �������������:
```js
const points = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1 // ������ ������
}));

const simplificationLevel = 50; // ������� ��������� � ���������
const simplifiedPoints = visvalingamSimplification(points, simplificationLevel);

console.log('�������� �����:', points);
console.log('���������� �����:', simplifiedPoints);
```
*/

// ������� ��� ���������� ������� ������������, ������������� ����� �������
function triangleArea(p1, p2, p3) {
    return Math.abs(
        p1[0] * (p2[1] - p3[1]) +
        p2[0] * (p3[1] - p1[1]) +
        p3[0] * (p1[1] - p2[1])
    ) / 2;
}

// �������� ����������� ��� ��������� ������
export function visvalingSimplification(points, simplificationLevel) {
    let n = points.length;
    if (n < 3) return points; // ���� ����� ������ ���, ������ �� ��������

    // ������� ������ ��� �������� �������� �������������
    let areas = new Array(n).fill(Infinity);

    for (let i = 1; i < n - 1; i++) {
        areas[i] = triangleArea(points[i - 1], points[i], points[i + 1]);
    }

    // ���������� ���������� �����, ������� ����� �������
    let targetPointsCount = Math.max(2, Math.floor(n * (1 - simplificationLevel / 100)));

    while (points.length > targetPointsCount) {
        // ������ ������ ����� � ����������� �������� ������������
        let minIndex = 1;
        let minArea = areas[1];
        for (let i = 2; i < points.length - 1; i++) {
            if (areas[i] < minArea) {
                minArea = areas[i];
                minIndex = i;
            }
        }

        // ������� ����� � ����������� ��������
        points.splice(minIndex, 1);
        areas.splice(minIndex, 1);

        // ��������� ������� ��� �������� �����
        if (minIndex > 1) {
            areas[minIndex - 1] = triangleArea(points[minIndex - 2], points[minIndex - 1], points[minIndex]);
        }
        if (minIndex < points.length) {
            areas[minIndex] = triangleArea(points[minIndex - 1], points[minIndex], points[minIndex + 1]);
        }
    }
    return points;
}