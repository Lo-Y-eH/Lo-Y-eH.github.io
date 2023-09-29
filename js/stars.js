// stars.js
const starCount = 200;

const generateStars = () => {
  let stars = [];

  for(let i = 0; i < starCount; i++) {
    let x = Math.floor(Math.random() * window.innerWidth);
    let y = Math.floor(Math.random() * window.innerHeight);
    let size = Math.random() * 50;

    stars.push(`${x}px ${y}px ${size}px #fff`);
  }

  return stars.join(', ');
}

export { generateStars };