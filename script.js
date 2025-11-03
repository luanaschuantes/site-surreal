// === PARTE 1: EFEITO DE FUNDO ANIMADO (Canvas) ===

const canvas = document.getElementById('fundoSurreal');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Estrutura de Partículas
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        // Velocidade mais errática para o efeito surreal
        this.speedX = Math.random() * 4 - 2; 
        this.speedY = Math.random() * 4 - 2;
        this.color = color;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Colisão com as bordas
        if (this.x > width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particlesArray = [];
// Cores que pulsam no fundo
const cores = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF4500']; 

function init() {
    for (let i = 0; i < 150; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        let color = cores[Math.floor(Math.random() * cores.length)];
        particlesArray.push(new Particle(x, y, color));
    }
}

// Conecta partículas próximas com linhas, criando uma "teia" surreal
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + 
                           ((particlesArray[a].y - particlesArray[b].y) ** 2);
            
            if (distance < (width/7) * (height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)'; // Fundo escuro com rastro
    ctx.fillRect(0, 0, width, height);
    
    connect();
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particlesArray = [];
    init(); 
});

init();
animate();

// === PARTE 2: DISTORÇÃO SUTIL DO TÍTULO COM O MOUSE ===

const titulo = document.getElementById('tituloDistorcido');

document.addEventListener('mousemove', (e) => {
    // Calcula a posição do mouse em relação ao centro da tela
    const offsetX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 a 1
    const offsetY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 a 1

    // Aplica uma transformação 3D sutil (efeito paralaxe)
    titulo.style.transform = `
        skewX(${offsetX * -3}deg) 
        translateY(${offsetY * -10}px)
        translateX(${offsetX * -10}px)
    `;
});
