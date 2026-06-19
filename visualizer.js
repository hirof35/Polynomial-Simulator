const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// --- 多項式クラス ---
class Polynomial {
    constructor(coefficients) {
        this.coeffs = [...coefficients];
    }
    evaluate(x) {
        return this.coeffs.reduceRight((acc, coeff) => acc * x + coeff, 0);
    }
}

// --- シミュレーション設定 ---
// P(x) = 3x^2 + 2x + 1 -> 配列は [1, 2, 3]
const p1 = new Polynomial([1, 2, 3]);

const startX = -2.0;
const endX = 2.0;
const step = 0.1;

const xValues = [];
const yValues = [];

// x を変化させてデータを生成 (浮動小数点の誤差を考慮して丸め処理)
for (let x = startX; x <= endX; x = Math.round((x + step) * 10) / 10) {
    xValues.push(x);
    yValues.push(p1.evaluate(x));
}

// ==========================================
// 1. CSV出力の実行
// ==========================================
function exportToCSV(xData, yData, filename = 'output.csv') {
    let csvContent = "x,y\n";
    for (let i = 0; i < xData.length; i++) {
        csvContent += `${xData[i]},${yData[i]}\n`;
    }
    fs.writeFileSync(filename, csvContent, 'utf-8');
    console.log(`✅ CSVファイルを出力しました: ${filename}`);
}

// ==========================================
// 2. グラフ画像(PNG)出力の実行
// ==========================================
async function exportToGraphImage(xData, yData, filename = 'graph.png') {
    const width = 800;  // 画像の幅
    const height = 600; // 画像の高さ
    
    // Chart.js の初期化
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    // Chart.js の設定オブジェクト
    const configuration = {
        type: 'line',
        data: {
            labels: xData,
            datasets: [{
                label: 'y = 3x^2 + 2x + 1',
                data: yData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                fill: true,
                tension: 0.3 // 線を滑らかにする
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'X 軸' }
                },
                y: {
                    title: { display: true, text: 'Y 軸' }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    };

    // 画像をバッファとしてレンダリングし、ファイル保存
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync(filename, imageBuffer);
    console.log(`✅ グラフ画像を保存しました: ${filename}`);
}

// --- メメイン処理の実行 ---
(async () => {
    // 1. CSVエクスポート
    exportToCSV(xValues, yValues);

    // 2. グラフ画像生成
    await exportToGraphImage(xValues, yValues);
})();
