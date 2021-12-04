//HTMLが全て読み込まれてからjQueryを実行
$(function() {
    //モーダル開ける
    $('.head_num').click(function(){
        $('.modal').fadeIn();
    });

    //モーダル閉じる
    $('button').click(function(){
        $('.modal').fadeOut();
    });

    //文章内容書き換える処理
    $('#lesson_1').click(function(){
        $('#intro').html('<h2>第1回目</h2>\
                            <h2>画像処理の簡単なシステムの作成</h2>\
                            <li>HTML、CSSの基礎知識</li>\
                            <li>opencv.js</li>\
                            <li>ドラッグ&ドロップ</li>\
                            <br>\
                            <a href="./1st/1st.html" id="modal_lan">第1回目へ</a>');
    });

    $('#lesson_2').click(function(){
        $('#intro').html('<h2>第2回目</h2>\
                            <h2>jQuery等を用いたアニメーション</h2>\
                            <li>メインページ、モーダル作成</li>\
                            <li>jQuery</li>\
                            <li>Chart.js</li>\
                            <br>\
                            <a href="./2nd/2nd.html" id="modal_lan">第2回目へ</a>');
    });

    $('#lesson_3').click(function(){
        $('#intro').html('<h2>第3回目(予定)</h2>\
                            <h2>非同期画面遷移</h2>\
                            <li>非同期処理</li>\
                            <li>barba.js(v2)</li>\
                            <li>SNS連動ボタン追加</li>\
                            <br>\
                            <a href="./3rd/3rd.html" id="modal_lan">第3回目へ</a>');
    });

    $('#lesson_4').click(function(){
        $('#intro').html('<h2>第4回目(予定)</h2>\
                            <h2>GitHub Pagesを使った静的ページの作成</h2>\
                            <li>GitHub Pages</li>\
                            <br>\
                            <a href="" id="modal_lan">第4回目へ</a>');
    });
});