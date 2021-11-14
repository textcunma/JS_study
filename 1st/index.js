//定義
const srcImg = document.getElementById('src-image');
const hiddenImg = document.getElementById('hidden-image');
const fileInput = document.getElementById('file-select-input');
const canvas = document.getElementById('output-canvas');
const hiddenCanvas = document.getElementById('hidden-canvas');
const grayScaleBtn = document.getElementById('gray-scale-btn');
const lineDrawBtn = document.getElementById('linedraw-btn');
const expansionBtn = document.getElementById('expansion-btn');
const downloadBtn = document.getElementById('download-btn');
const dragAndDropArea = document.getElementById('drag-and-drop-area');
const pushBtn = document.querySelectorAll('#drag-and-drop-area');

// ファイル選択ボタン
pushBtn.forEach((ele) => {
    ele.addEventListener('click', () => {
        fileInput.click();      //[fileInput]が押された場合の処理へ移動
    });
});

// ドラッグ中
dragAndDropArea.addEventListener('dragover', (e) => {
    dragAndDropArea.classList.add('active');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

// マウスがドラッグ＆ドロップ領域外に出たとき
dragAndDropArea.addEventListener('dragleave', (e) => {
    dragAndDropArea.classList.remove('active');
});


// ドロップ時
dragAndDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragAndDropArea.classList.add('active');
    const files = e.dataTransfer.files;

    //何も読み込まれていない場合
    if (files.length === 0) {
        return;
    }

    // 画像ファイル以外ならば何もしない
    if (!files[0].type.match(/image\/*/)) {
        return;
    }

    srcImg.src = URL.createObjectURL(files[0]);
    hiddenImg.src = URL.createObjectURL(files[0]);
});


// 画像をグレースケールに変換する
function convertImageToGray(img) {
    let dst = new cv.Mat();
    cv.cvtColor(img, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}

//　画像を線画に変換する
function convertImageToLineDrawing(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));

    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    const imgDilated = new cv.Mat();
    cv.dilate(imgGray, imgDilated, kernel, new cv.Point(-1, 1), 1);

    const imgDiff = new cv.Mat();
    cv.absdiff(imgDilated, imgGray, imgDiff);

    const contour = new cv.Mat();
    cv.bitwise_not(imgDiff, contour);
    return contour;
}

//画像を膨張処理する
function expansion(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3));
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

    const imgDilated = new cv.Mat();
    cv.dilate(imgGray, imgDilated, kernel);
    return imgDilated;
}

//[fileInput]が押された場合の処理
fileInput.addEventListener('change', e => {
    srcImg.src = URL.createObjectURL(e.target.files[0]);
    hiddenImg.src = URL.createObjectURL(e.target.files[0]);
}, false);

//「grayScaleBtn」が押された場合の処理
grayScaleBtn.addEventListener('click', e => {
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
});

//「lineDrawBtn」が押された場合の処理
lineDrawBtn.addEventListener('click', e => {
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
});

//「expansionBtn」が押された場合の処理
expansionBtn.addEventListener('click', e => {
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
});

//ダウンロード時に作用
function dataUriToBlob(dataUri) {
    const b64 = atob(dataUri.split(',')[1]);
    const u8 = Uint8Array.from(b64.split(''), e => e.charCodeAt());
    return new Blob([u8], { type: 'image/png' });
}

//[downloadBtn]が押された場合の処理
downloadBtn.addEventListener('click', e => {
    const data = hiddenCanvas.toDataURL();
    const url = URL.createObjectURL(dataUriToBlob(data));
    downloadBtn.href = url;
});