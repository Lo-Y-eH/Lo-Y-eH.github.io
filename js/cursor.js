// 鼠标点击雪花特效
(function fairyDustCursor() {
  const possibleColors = ["#D61C59", "#E7D84B", "#1B8798"];
  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: width / 2 };
  const particles = [];

  function init() {
    bindEvents();
    loop();
  }

  // 绑定所需的事件
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (const touch of e.touches) {
        addParticle(touch.clientX, touch.clientY, getRandomColor());
      }
    }
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    addParticle(cursor.x, cursor.y, getRandomColor());
  }

  function addParticle(x, y, color) {
    const particle = new Particle();
    particle.init(x, y, color);
    particles.push(particle);
  }

  function updateParticles() {
    for (const particle of particles) {
      particle.update();
    }

    particles.forEach((particle, index) => {
      if (particle.lifeSpan < 0) {
        particle.die();
        particles.splice(index, 1);
      }
    });
  }

  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }

  class Particle {
    constructor() {
      this.character = "*";
      this.lifeSpan = 120; // ms
      this.initialStyles = {
        position: "fixed",
        top: "0",
        display: "block",
        pointerEvents: "none",
        "z-index": "100000000",
        fontSize: "20px",
        "will-change": "transform",
      };
    }

    init(x, y, color) {
      this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1,
      };
      this.position = { x: x - 10, y: y - 20 };
      this.initialStyles.color = color;

      this.element = document.createElement('span');
      this.element.innerHTML = this.character;
      applyProperties(this.element, this.initialStyles);
      this.update();

      document.body.appendChild(this.element);
    }

    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;

      this.element.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) scale(${this.lifeSpan / 120})`;
    }

    die() {
      this.element.parentNode.removeChild(this.element);
    }
  }

  function applyProperties(target, properties) {
    for (const key in properties) {
      if (Object.hasOwnProperty.call(properties, key)) {
        target.style[key] = properties[key];
      }
    }
  }

  function getRandomColor() {
    return possibleColors[Math.floor(Math.random() * possibleColors.length)];
  }

  init();
})();


// 添加鼠标样式
var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style.left = `${left}px`;
        this.cursor.style.top = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        this.pt = Array.from(document.querySelectorAll('*[style*="cursor:pointer"]')).map(el => el.outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12px' height='12px'><circle cx='6' cy='6' r='6' opacity='1.0' fill='rgb(57, 197, 187)'/></svg>") 6 6, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = { curr: null, prev: null };
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.body.addEventListener('mouseover', e => {
            if (this.pt.includes(e.target.outerHTML)) {
                this.cursor.classList.add("hover");
            }
        });

        document.body.addEventListener('mouseout', e => {
            if (this.pt.includes(e.target.outerHTML)) {
                this.cursor.classList.remove("hover");
            }
        });

        document.body.addEventListener('mousemove', e => {
            if (!this.pos.curr) {
                this.move(e.clientX - 8, e.clientY - 8);
            }
            this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 };
            this.cursor.classList.remove("hidden");
        });

        document.body.addEventListener('mouseenter', e => {
            this.cursor.classList.remove("hidden");
        });

        document.body.addEventListener('mouseleave', e => {
            this.cursor.classList.add("hidden");
        });

        document.body.addEventListener('mousedown', e => {
            this.cursor.classList.add("active");
        });

        document.body.addEventListener('mouseup', e => {
            this.cursor.classList.remove("active");
        });
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    CURSOR.refresh();
})();
