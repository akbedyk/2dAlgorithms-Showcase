
/*

### ����� ����������� � �������������� ������� ������  

���� ����� ���������� ����������� ������ ����� � ����������. 
��������: 

    ������� ������ : ����� �����, �������������� ������.
    ��� 1 : ��������� ������ ������ � ����������� ����� ������ ��� �����������.
    ��� 2 : ����� ����������� ����� ������������ ������ ����� �������������, ��������, ������-�������-�������, ����� ��������� ���������� �����.
     
������: 
����������� ����� ��������� ������ ��������� ������, ��� �������� ����������� ������� ���������. 
*/

// ������� ��� ���������� ������� ������ � ������� �����
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

// ������� ��� ��������� ���� ������
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

/* ������ �������������
const points = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 10) + Math.random() * 0.1 // ������ ������
}));

const simplificationLevel = 50; // ������� ��������� � ���������

// ��������� ������ ������
const smoothedPoints = gaussianFilter(points, 2);

console.log('�������� �����:', points);
console.log('���������� �����:', smoothedPoints);
*/

// ������� ������� ��� ������������� � ������ ������
module.exports = {
    gaussianFilter
};