// Copyright (c) HTML5 Boilerplate

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


function init(){
    
    const loader = document.querySelector('.loader');

    gsap.set(loader, {
        x: 0,
        y: 450,
        scaleX: 0,
        scaleY: 1,
        rotation: 0, 
        xPercent: 0,
        yPercent: -90, 
        transformOrigin: 'left center', 
        autoAlpha: 1
    });

    function loaderIn() {
        return gsap.fromTo(loader, 
            {
                rotation: 0,
                scaleX: 0,
                xPercent: 0
            },
            { 
                duration: 0.8,
                xPercent: 0,
                scaleX: 1, 
                rotation: 0,
                ease: 'Power4.inOut', 
                transformOrigin: 'left center'      //左から右に
            });
    }

    function loaderAway() {
        return gsap.to(loader, { 
            duration: 0.8, 
            scaleX: 0,
            xPercent: 0, 
            rotation: 0, 
            transformOrigin: 'right center', 
            ease: 'Power4.inOut'
        });
    }

    //ローディングしたら必ずページトップへ
    barba.hooks.enter(() => {
        window.scrollTo(0, 0);
    });

    // https://leap-in.com/ja/increase-page-transition-speed-by-barbajs-2/
    Barba.Prefetch.init();

    // https://barba.js.org/docs/userguide/analytics/
    barba.hooks.after(() => {
        ga('set', 'page', window.location.pathname);
        ga('send', 'pageview');
      });

    barba.init({
        transitions: [{
            //現在のページを離れる時
            async leave() {
                await loaderIn();
        
            },
            //次のページを表示する時
            enter() {
                loaderAway();
            }
        }]
    })

}

window.addEventListener('load', function(){
    init();
});

// async :非同期関数
// await :非同期処理を待つ


// barba.jsだけではアニメーションできないので、[gsap]を使用する