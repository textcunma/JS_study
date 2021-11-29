const srcImg = document.getElementById('src-image');
const hiddenImg = document.getElementById('hidden-image');
const fileInput = document.getElementById('file-select-input');
const canvas = document.getElementById('output-canvas');
const hiddenCanvas = document.getElementById('hidden-canvas');
const grayScaleBtn = document.getElementById('gray-scale-btn');
const lineDrawBtn = document.getElementById('linedraw-btn');
const expansionBtn = document.getElementById('expansion-btn');
const thresholdBtn = document.getElementById('threshold-btn');
const edgeBtn = document.getElementById('edge-btn');
const hsvBtn = document.getElementById('hsv-btn');
const downloadBtn = document.getElementById('download-btn');
const dragAndDropArea = document.getElementById('drag-and-drop-area');
const pushBtn = document.querySelectorAll('#drag-and-drop-area');
const list_element = document.getElementById("comment");
let flg = false;  //画像処理をしているか否かのフラグ

const modal = document.getElementById('modal'); //モーダル
const deleteBtn = document.getElementById('deleteBtn'); //モーダルの×ボタン
const saveCanvasBtn=document.getElementById('saveCanvasBtn');   //モーダルのsaveボタン
let myChart = null;     //グローバル変数として定義（myChart.destroyを使えるようにするため）

//画像をHSVに変換する
function convertImageToHSV(img) {
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_RGB2HSV);
    return dst;
}

//×ボタンを押した時
deleteBtn.addEventListener('click', e => {
    modal.classList.remove('active');
});

// saveボタンを押した時
saveCanvasBtn.addEventListener('click', e => {
    if(myChart){
        saveCanvasBtn.href = myChart.toBase64Image();
    }
});

//グラフ描画関数
function drawChart(h, s, v) {
    const ctx = document.getElementById('mychart');
    let delayed = false;

    myChart = new Chart(ctx, {
        type: 'bar',    //グラフの種類（棒グラフ）
        data: {
            labels: ['H', 'S', 'V'],    //x軸のラベル
            datasets: [{
                label: "",  //上部のラベル（空にする->後に非表示にするため何でもいい）
                data: [h, s, v],
                backgroundColor: [   /*グラフの背景色を指定*/
                    'red',
                    'blue',
                    'green'
                ],
            }],
        },
        options: {
            //グラフ自動設定
            responsive: true,
            //x軸のラベルのフォントサイズを30に設定
            scales: {
                xAxis: {
                    ticks: {
                        font: {
                            size: 30
                        }
                    }
                }
            },
            //y軸範囲設定              
            y: {
                min: 0,
                max: 100,
            },
            //余白設定
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 50
                }
            },
            //イベント設定
            events: [],     //イベントを設定しない =>これしないとマウスが動くと再度グラフ描画されてしまう
            //アニメーション設定
            animation: {
                //アニメーション実行中に何をするのか
                onProgress: function (animation) {
                    let currentPercent = animation.currentStep / animation.numSteps;
                    let current_h = (this.data.datasets[0].data[0] * currentPercent).toFixed(2);    //現在のHの値
                    let current_s = (this.data.datasets[0].data[1] * currentPercent).toFixed(2);    //現在のSの値
                    let current_v = (this.data.datasets[0].data[2] * currentPercent).toFixed(2);    //現在のVの値
                    let ctx = this.ctx; //コンテキストを取得

                    ctx.font = `${13}pt sans-serif`;    //フォントとフォントサイズを指定

                    let pos_h_x = (this.chartArea.right - this.chartArea.left) / 3 - 60;    //Hのx位置
                    let pos_h_y = 280;                                                      //Hのy位置
                    ctx.fillText(current_h, pos_h_x, pos_h_y);                              //Hの文字を描画

                    let pos_s_x = (this.chartArea.left + this.chartArea.right) / 2 - 15;    //Sのx位置
                    let pos_s_y = 280;                                                      //Sのy位置      
                    ctx.fillText(current_s, pos_s_x, pos_s_y);                              //Sの文字を描画

                    let pos_v_x = (this.chartArea.right - this.chartArea.left) / 3 * 2 + 125;   //Vのx位置
                    let pos_v_y = 280;                                                          //Vのy位置
                    ctx.fillText(current_v, pos_v_x, pos_v_y);                                  //Vの文字を描画
                },
                //アニメーション終了後の処理
                onComplete: function () {
                    delayed = true;     //ディレイ処理の終了を示すフラグ
                },
                //ディレイ処理　　Chart.jsのHPに記載されているコード
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                }
            },            
            plugins: {
                //上部ラベル設定
                legend: {
                    display: false     //ラベルを表示しない
                },
                //グラフタイトル設定
                title: {
                    display: true,
                    font: {
                        size: 30
                    },
                    text: '平均HSV'
                }
            }
        }
    });
}


//「hsvBtn」が押された場合の処理
hsvBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        const src = cv.imread(srcImg);
        const dst = convertImageToHSV(src);
        modal.classList.add('active');  //モーダルを表示するための合図

        let sum_h = 0;
        let sum_s = 0;
        let sum_v = 0;

        for (let i = 0; i < dst.data.length; i += 4) {
            sum_h += dst.data[i];
            sum_s += dst.data[i + 1];
            sum_v += dst.data[i + 2];
        }

        const h = (sum_h / dst.data.length).toFixed(3);  //小数点3桁
        const s = (sum_s / dst.data.length).toFixed(3);
        const v = (sum_v / dst.data.length).toFixed(3);

        if (myChart) {      //既にグラフが描画されている場合
            myChart.destroy();  //グラフを削除
        }
        drawChart(h, s, v);     //グラフを描画

    }
});

//以下、1回目から変更なし--------------------
pushBtn.forEach((ele) => {
    ele.addEventListener('click', () => {
        fileInput.click();
    });
});

dragAndDropArea.addEventListener('dragover', (e) => {
    dragAndDropArea.classList.add('active');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

dragAndDropArea.addEventListener('dragleave', (e) => {
    dragAndDropArea.classList.remove('active');
});

dragAndDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragAndDropArea.classList.add('active');
    const files = e.dataTransfer.files;
    if (files.length === 0) {
        return;
    }
    if (!files[0].type.match(/image\/*/)) {
        return;
    }
    list_element.remove();
    srcImg.src = URL.createObjectURL(files[0]);
    hiddenImg.src = URL.createObjectURL(files[0]);
});

fileInput.addEventListener('change', e => {
    list_element.remove();
    srcImg.src = URL.createObjectURL(e.target.files[0]);
    hiddenImg.src = URL.createObjectURL(e.target.files[0]);
}, false);

function convertImageToGray(img) {
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_BGR2GRAY, 0);
    return dst;
}

function convertImageToLineDrawing(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    const imgGray = convertImageToGray(img);
    const imgDilated = new cv.Mat();
    cv.dilate(imgGray, imgDilated, kernel, new cv.Point(-1, 1), 1);
    const imgDiff = new cv.Mat();
    cv.absdiff(imgDilated, imgGray, imgDiff);
    const contour = new cv.Mat();
    cv.bitwise_not(imgDiff, contour);
    return contour;
}

function expansion(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3));
    const imgGray = convertImageToGray(img);

    const imgDilated = new cv.Mat();
    cv.dilate(imgGray, imgDilated, kernel);
    return imgDilated;
}

function threshold(img) {
    let imgthresh = new cv.Mat();
    cv.threshold(img, imgthresh, 126, 255, cv.THRESH_BINARY);
    return imgthresh;
}

function edge(img) {
    let imgedge = convertImageToGray(img);
    cv.Canny(img, imgedge, 50, 100, 3, false);
    return imgedge;
}

grayScaleBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        flg = true;
        let src = cv.imread(srcImg);
        const dst = convertImageToGray(src);
        cv.imshow('output-canvas', dst);
        src.delete();
        dst.delete();
        let hiddenSrc = cv.imread(hiddenImg);
        const hiddenDst = convertImageToGray(hiddenSrc);
        cv.imshow('hidden-canvas', hiddenDst);
        hiddenSrc.delete();
        hiddenDst.delete();
    }
});

lineDrawBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        flg = true;
        const src = cv.imread(srcImg);
        const dst = convertImageToLineDrawing(src);
        cv.imshow('output-canvas', dst);
        src.delete();
        dst.delete();
        const hiddenSrc = cv.imread(hiddenImg);
        const hiddenDst = convertImageToLineDrawing(hiddenSrc);
        cv.imshow('hidden-canvas', hiddenDst);
        hiddenSrc.delete();
        hiddenDst.delete();
    }
});

expansionBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        flg = true;
        const src = cv.imread(srcImg);
        const dst = expansion(src);
        cv.imshow('output-canvas', dst);
        src.delete();
        dst.delete();

        const hiddenSrc = cv.imread(hiddenImg);
        const hiddenDst = expansion(hiddenSrc);
        cv.imshow('hidden-canvas', hiddenDst);
        hiddenSrc.delete();
        hiddenDst.delete();
    }
});

thresholdBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        flg = true;
        const src = cv.imread(srcImg);
        const dst = threshold(src);
        cv.imshow('output-canvas', dst);
        src.delete();
        dst.delete();
        const hiddenSrc = cv.imread(hiddenImg);
        const hiddenDst = threshold(hiddenSrc);
        cv.imshow('hidden-canvas', hiddenDst);
        hiddenSrc.delete();
        hiddenDst.delete();
    }
});

edgeBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else {
        flg = true;
        const src = cv.imread(srcImg);
        const dst = edge(src);
        cv.imshow('output-canvas', dst);
        src.delete();
        dst.delete();
        const hiddenSrc = cv.imread(hiddenImg);
        const hiddenDst = edge(hiddenSrc);
        cv.imshow('hidden-canvas', hiddenDst);
        hiddenSrc.delete();
        hiddenDst.delete();
    }
});

function dataUriToBlob(dataUri) {
    const base64 = atob(dataUri.split(',')[1]);
    const utf8 = Uint8Array.from(base64.split(''), e => e.charCodeAt());
    return new Blob([utf8], { type: 'image/png' });
}

downloadBtn.addEventListener('click', e => {
    if (srcImg.src == "") {
        alert("画像が入力されていません");
    } else if (!flg) {
        alert("画像処理をしていません");
    } else {
        const data = hiddenCanvas.toDataURL();
        const url = URL.createObjectURL(dataUriToBlob(data));
        downloadBtn.href = url;
    }
});