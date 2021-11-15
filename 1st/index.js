//定義
/*
document.getElementById('id')
HTMLファイル内で使われるidを取得して処理をしたい場合に使用
*/
const srcImg = document.getElementById('src-image');                    //入力画像
const hiddenImg = document.getElementById('hidden-image');              //入力画像の代替
const fileInput = document.getElementById('file-select-input');         //ファイル選択
const canvas = document.getElementById('output-canvas');                //表示画像
const hiddenCanvas = document.getElementById('hidden-canvas');          //隠しキャンバス
const grayScaleBtn = document.getElementById('gray-scale-btn');         //グレースケール化ボタン
const lineDrawBtn = document.getElementById('linedraw-btn');            //線画化ボタン
const expansionBtn = document.getElementById('expansion-btn');          //膨張処理ボタン
const thresholdBtn = document.getElementById('threshold-btn');          //2値化ボタン
const edgeBtn = document.getElementById('edge-btn');                    //エッジボタン
const downloadBtn = document.getElementById('download-btn');            //ダウンロードボタン
const dragAndDropArea = document.getElementById('drag-and-drop-area');  //ドラッグ＆ドロップエリア
const pushBtn = document.querySelectorAll('#drag-and-drop-area');       //ドラッグ＆ドロップエリア
const list_element = document.getElementById("comment");
let flg=false;

// ファイル選択ボタン
//ドラッグ＆ドロップエリアでマウスクリックが行われた場合ファイル選択処理を行う
pushBtn.forEach((ele) => {
    ele.addEventListener('click', () => {
        //[fileInput]が押された場合の処理へ（ファイル選択処理へ）
        fileInput.click();
    });
});

/*
e.preventDefault();　　デフォルト動作をキャンセル
ブラウザは「ドロップ操作」をすると画像を表示する機能がデフォルトで存在
ドラッグ&ドロップで画像を読み込む時に、この機能が邪魔をするのでここでキャンセルする

datatransferはドラッグしている要素のデータを保持するために使用
*/

// ドラッグ＆ドロップ領域にドラッグしている要素がある場合
dragAndDropArea.addEventListener('dragover', (e) => {
    dragAndDropArea.classList.add('active');    //「active」クラスを追加
    e.preventDefault();                         //デフォルト動作をキャンセル
    e.dataTransfer.dropEffect = 'copy';         //ドロップ領域に入力画像をコピー
});

// ドラッグしている要素がドラッグ＆ドロップ領域外に出たとき
dragAndDropArea.addEventListener('dragleave', (e) => {
    dragAndDropArea.classList.remove('active'); //「active」クラスを除去
});

// ドラッグ＆ドロップ領域に画像ファイルをドロップされたとき
dragAndDropArea.addEventListener('drop', (e) => {
    e.preventDefault();                         //デフォルト動作をキャンセル
    dragAndDropArea.classList.add('active');    //「active」クラスを追加
    const files = e.dataTransfer.files;         //ファイル情報を取得

    //何も読み込まれていない場合
    if (files.length === 0) {
        return;
    }

    // 画像ファイル以外ならば何もしない
    if (!files[0].type.match(/image\/*/)) {
        return;
    }

    list_element.remove();//「ここをクリック or　ドラッグ&ドロップ」の文字を消去
    srcImg.src = URL.createObjectURL(files[0]);     //ファイル情報から画像を読み込む(src属性に代入)
    hiddenImg.src = URL.createObjectURL(files[0]);  //ファイル情報から画像を読み込む(src属性に代入)
});

//[fileInput]が押された場合の処理（画像入力の処理）
fileInput.addEventListener('change', e => {
    list_element.remove();      //「ここをクリック or　ドラッグ&ドロップ」の文字を消去
    srcImg.src = URL.createObjectURL(e.target.files[0]);
    hiddenImg.src = URL.createObjectURL(e.target.files[0]);
}, false);


// 画像をグレースケールに変換する
function convertImageToGray(img) {
    let dst = new cv.Mat();     //JSの場合，画像を変換するならば空の画像を用意する必要がある
    cv.cvtColor(img, dst, cv.COLOR_RGBA2GRAY, 0);
    return dst;
}

//　画像を線画に変換する
function convertImageToLineDrawing(img) {
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));

    // グレースケール画像でないと線画変換が出来ない仕様なので...
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

//画像を２値価処理する
function threshold(img) {
    let imgthresh = new cv.Mat();
    cv.threshold(img,imgthresh, 126, 255, cv.THRESH_BINARY);
    return imgthresh;
}

//画像にエッジ処理をかける
function edge(img) {
    let imgedge = new cv.Mat()
    cv.cvtColor(img, img, cv.COLOR_RGB2GRAY, 0);
    cv.Canny(img, imgedge, 50, 100, 3, false );
    return imgedge;
}

//「grayScaleBtn」が押された場合の処理（グレースケール化の処理）
grayScaleBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else{
        flg=true;
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

//「lineDrawBtn」が押された場合の処理（線画化の処理）
lineDrawBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else{
        flg=true;
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

//「expansionBtn」が押された場合の処理（膨張処理）
expansionBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else{
        flg=true;
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

//「thresholdBtn」が押された場合の処理（2値化処理）
thresholdBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else{
        flg=true;
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

//「edgeBtn」が押された場合の処理（エッジ処理）
edgeBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else{
        flg=true;
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
        input.disabled = true;
    }
});

/*
Blob(Binary Large Object):バイナリを扱うクラス
base64：バイナリを文字列に変換する際に使われる方式
*/

//ダウンロード時に作用（Data URIからBlobを作成する）
function dataUriToBlob(dataUri) {
    const base64 = atob(dataUri.split(',')[1]);                             //DataURIをデコード
    const utf8 = Uint8Array.from(base64.split(''), e => e.charCodeAt());    //デコードしたものをバイト列に
    return new Blob([utf8], { type: 'image/png' });                         //バイト列からBlobを作成
}

//[downloadBtn]が押された場合の処理（ダウンロード処理）
downloadBtn.addEventListener('click', e => {
    if (srcImg.src==""){
        alert("画像が入力されていません");
    }else if(!flg){
        alert("画像処理をしていません");
    }else{
        const data = hiddenCanvas.toDataURL();  //キャンバスをData URIに変換
        const url = URL.createObjectURL(dataUriToBlob(data));   //BlobをData URI(Data URL)にへ変換
        downloadBtn.href = url;
    }
});