// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hitBtn = document.getElementById('hitBtn');
const resetBtn = document.getElementById('resetBtn');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Helper function for random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Circle properties
const circle = {
    x: 100,  
    y: canvas.height / 2,  
    radius: 45,
    color: getRandomColor()
};

// Arrow properties
const arrow = {
    x: canvas.width - 100, 
    y: canvas.height / 2,   
    length: 50,             
    headSize: 15,          
    color: '#333333'
};

// Animation properties
const animation = {
    isMoving: false,
    speed: 5,
    impact: {
        active: false,
        scale: 1,
        duration: 0
    }
};

// Event listeners
hitBtn.addEventListener('click', startAnimation);
resetBtn.addEventListener('click', resetGame);

function startAnimation() {
    if (!animation.isMoving) {
        animation.isMoving = true;
        hitBtn.disabled = true;
        hitBtn.style.opacity = '0.5';
    }
}

function resetGame() {
    arrow.x = canvas.width - 100;
    animation.isMoving = false;
    hitBtn.disabled = false;
    hitBtn.style.opacity = '1';
    circle.color = getRandomColor();
    render();
}

function drawCircle() {
    ctx.save();
    ctx.beginPath();
    
    if (animation.impact.active) {
        ctx.translate(circle.x, circle.y);
        ctx.scale(animation.impact.scale, animation.impact.scale);
        ctx.translate(-circle.x, -circle.y);
    }
    
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.restore();
}

function drawArrow() {
    ctx.beginPath();
    ctx.strokeStyle = arrow.color;
    ctx.fillStyle = arrow.color;
    ctx.lineWidth = 3;

    // Draw the line (shaft)
    ctx.moveTo(arrow.x + arrow.length, arrow.y);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + arrow.headSize, arrow.y - arrow.headSize/2);
    ctx.lineTo(arrow.x + arrow.headSize, arrow.y + arrow.headSize/2);
    ctx.closePath();
    ctx.fill();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    drawArrow();
}

function animate() {
    if (animation.isMoving) {
        arrow.x -= animation.speed;
        
        if (arrow.x <= circle.x + circle.radius) {
            animation.isMoving = false;
            animation.impact.active = true;
            animation.impact.duration = 0;
        }
    }

    if (animation.impact.active) {
        animation.impact.duration += 1;
        
        if (animation.impact.duration < 10) {
            animation.impact.scale = 1 + (animation.impact.duration * 0.05);
        } else if (animation.impact.duration < 20) {
            animation.impact.scale = 1.5 - ((animation.impact.duration - 10) * 0.05);
        } else {
            animation.impact.active = false;
            animation.impact.scale = 1;
            circle.color = getRandomColor();
        }
    }

    render();
    requestAnimationFrame(animate);
}

// Initial render and start animation loop
render();
animate();