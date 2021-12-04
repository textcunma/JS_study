const works1 = document.getElementById('works_id');
const deleteBtn=document.getElementById('deleteBtn');
const modal = document.getElementById('modal');

let canvas = document.getElementById('works1');
let ctx = canvas.getContext('2d');
ctx.font = '30pt Arial';
ctx.fillStyle = '#fff';
ctx.fillText('作品1',50,60);

let canvas2 = document.getElementById('works2');
let ctx2 = canvas2.getContext('2d');
ctx2.font = '30pt Arial';
ctx2.fillStyle = '#fff';
ctx2.fillText('作品2',50,60);

let canvas3 = document.getElementById('works3');
let ctx3 = canvas3.getContext('2d');
ctx3.font = '30pt Arial';
ctx3.fillStyle = '#fff';
ctx3.fillText('作品3',50,60);

//works1ボタンを押した時
works1.addEventListener('click', e => {
    modal.classList.add('active');
});

deleteBtn.addEventListener('click', e => {
    modal.classList.remove('active');
});

// https://liginc.co.jp/500530
ScrollReveal().reveal('#About',{duration: 800,reset: true});
ScrollReveal().reveal('#Skill',{duration: 800,reset: true});
ScrollReveal().reveal('#Works',{duration: 800,reset: true});
ScrollReveal().reveal('#Contact',{duration: 800,reset: true});

// グラフ描画
function drawChart(name,score,canvas){
    const ctx = document.getElementById(canvas);
    let string='';
    for(let i = 0; i < score; i++){
        string += '★';
    }
    for(let i = 0; i < 5-score; i++){
        string += '☆';
    }
    
    let color='#EF4123';

    let  data= {
        labels: "",  
        datasets: [{
            label: "", 
            data: [score,5-score],
            backgroundColor:[color,'#000'],
            borderColor:[color,'#000'],
        }],
    };

    
    let options={
        responsive: false,
        cutout:140, //中心穴の大きさ：デフォルト50
        events: [],
        animation: {
            delay:100,
            duration: 1200,
        },
        plugins:{
            legend: {
                display: false
            }
        }
    };

    let tmp = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
        plugins:[{
            afterRender: function (chart, args, options) {
                let text=string;
                let width = chart.width;    // グラフの幅
                let height = chart.height;  // グラフの高さ
                let ctx = chart.ctx;        // グラフのコンテキスト
                ctx.restore();

                //☆を描く
                let fontSize = (height / 114).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                let textX = Math.round((width - ctx.measureText(text).width) / 2);
                let textY = height / 1.5;
                ctx.fillStyle=color;
                ctx.fillText(text, textX, textY);

                //言語名を描く
                fontSize=2.27;
                ctx.font = fontSize + "em sans-serif";
                ctx.fillStyle="#000";
                let nameX=Math.round((width - ctx.measureText(name).width) / 2);
                let nameY=height / 2.5;
                ctx.fillText(name, nameX, nameY);

                ctx.save();
            }
        }]
    });
    return tmp;
}


barba.init({
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0
        });
      }
    }]
  });