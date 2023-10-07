/*
// 获取 canvas 元素
var canvas = document.querySelector('#DynamicBackground canvas');
var ctx = canvas.getContext('2d');

// 设置 canvas 的宽度和高度
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义星星的数量
var numStars = 500;

// 创建星星数组
var stars = [];

// 创建星星对象
for (var i = 0; i < numStars; i++) {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  var radius = Math.random() * 2;
  var opacity = Math.random();

  stars.push({
    x: x,
    y: y,
    radius: radius,
    opacity: opacity,
    speed: Math.random() * 0.2 + 0.2, // 控制星星闪烁速度
  });
}

// 绘制星星
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < numStars; i++) {
    var star = stars[i];

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
    ctx.fill();
    star.x -= star.speed;

    if (star.x < 0) {
      star.x = canvas.width;
    }
  }

  requestAnimationFrame(drawStars);
}

// 初始化星星
drawStars();
*/