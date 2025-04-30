/*
### ����� ����������� � �������������� ������� ������  

���� ����� ���������� ����������� ������ ����� � ����������. ��������, ����������� ����� ��������� ������ ��������� ������, ��� �������� ����������� ������� ���������.

��������: 
    ������� ������ : ����� �����, �������������� ������.
    ��� 1 : ��������� ������ ������ � ����������� ����� ������ ��� �����������.
    ��� 2 : ����� ����������� ����� ������������ ������ ����� �������������, ��������, ������-�������-�������, ����� ��������� ���������� �����.

������ �������������:
```js
const points = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1 // ������ ������
}));

const simplificationLevel = 50; // ������� ��������� � ���������
const smoothedPoints = gaussianFilter(points, 2); // ��������� ������ ������

console.log('�������� �����:', points);
console.log('���������� �����:', smoothedPoints);
```
*/

const abs = Math.abs

function generateGaussianKernel(sigma) {
    const size = Math.ceil(6 * sigma); // ������ ����
    const kernel = [];

    for (let i = 0; i < size; i++) {
        const x = i - Math.floor(size / 2);
        const value = (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-(x * x) / (2 * sigma * sigma));
        kernel.push(value);
    }

    const sum = kernel.reduce((a, b) => a + b, 0);
    return kernel.map(v => v / sum); // ��������� ����
}

export function gaussianFilter(points, sigma = 1) {
    const n = points.length;
    const gaussKernel = generateGaussianKernel(sigma);

    const smoothedPoints = points.map(point => ([...point]));

    for (let i = 0; i < n; i++) {
        let sumX = 0;
        let sumY = 0;
        let weightSum = 0;

        for (let j = -gaussKernel.length + 1; j < gaussKernel.length; j++) {
            const index = i + j;
            if (index >= 0 && index < n) {
                const weight = gaussKernel[abs(j)];
                sumX += points[index][0] * weight;
                sumY += points[index][1] * weight;
                weightSum += weight;
            }
        }

        smoothedPoints[i][0] = sumX / weightSum;
        smoothedPoints[i][1] = sumY / weightSum;
    }
    return smoothedPoints;
}