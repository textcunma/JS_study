let count=0;

// カウント関数
function counter(){
  count++;          //非同期関数と違って読み込まれない...
  console.log(count);
}

// 非同期関数
function asyncFunction() {
  return new Promise((resolve, reject) => {   //通常の関数と違ってこの時点で読み込まれる
    try {
      setTimeout(() => {
        console.log("非同期処理")   //5番目   9番目   11番目
        counter();                  //6番目  10番目   12番目

        resolve();
      }, 1000)
    } catch (e) {
      reject(e);
    }
  })
}

// 非同期処理が終わったら
asyncFunction().then(() => {
        console.log("非同期処理が終わったら")   //7番目
        counter();                    //8番目
}).catch(e => {
        console.log(e);
})

// もし、ここで非同期関数を呼び出すと,,,,
console.log(asyncFunction());  // Promise {<pending>}  　1番目

console.log(count);       // 0　　　　2番目
console.log("Finish");    // Finish   3番目

// もし、ここで非同期関数を呼び出すと,,,,
console.log(asyncFunction()); // Promise {<pending>}    4番目
