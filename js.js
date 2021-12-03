 const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

//mouse
let mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener('mousemove',
function(event){
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;

});
function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    class Particle{
        constructor(x, y, color, size){
            this.x = x + canvas.width / 2 - png.width * 2,
            this.y = y + canvas.height / 2 - png.width * 2,
            this.color = color,
            this.size = 2,
            this.baseX =  x + canvas.width / 2 - png.width * 2,
            this.baseY =  y + canvas.height / 2 - png.width * 2,
            this.density = (Math.random() * 10) + 2;

        }   
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0 , Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;
            
            // collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            //max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force < 0) force = 0;


            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);
            
            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else 
            {
                if (this.x !== this.baseX){
                    let dx = this.x  - this.baseX;
                    this.x -= dx / 20;
                }if(this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for(let y = 0, y2 = data.height; y < y2; y++){
            for(let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[( y * 4 * data.width) + (x * 4) + 3] > 128){
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," + 
                                         data.data[(y * 4 * data.width) + (x * 4) + 1 ] + "," +
                                         data.data[(y * 4 * data.width) + (x * 4) + 2 ] + ")";
                  particleArray.push(new Particle(positionX * 4, positionY * 4,color ));
                }
            }
        }
    }
    function animate (){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgb(0,0,0,.05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; 1 < particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();
    window.addEventListener ('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
} 
const png = new Image();
png.src = "data:image/png;base64,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";

window.addEventListener('load', (event) => {
    console.log('Page hase loaded'); 
    ctx.drawImage(png, 0, 0);
    drawImage();
});