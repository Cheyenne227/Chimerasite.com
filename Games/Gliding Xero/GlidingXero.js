var PlayerCharacter;
var ObstaclesGX = [];
var BackgroundGX;
var ScoreGX;

function startGame() 
{
    PlayerCharacter = new component(200, 100, "Gliding_Pilot.png", 10, 120, "image");
    PlayerCharacter.gravity = 0.05;
    ScoreGX = new component("30px", "Consolas", "white", 800, 30, "text");
    BackgroundGX = new component(1000, 600, "Infinity_Background.png", 0, 0, "background");
    GlidingXero.start();
}
  
  var GlidingXero = {
    canvas : document.createElement("canvas"),
    start : function() 
    {
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.getElementById("GameArea-GX").appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGlidingXero, 20);
        window.addEventListener('keydown', function (e) {
            move(-0.2);
          })
          window.addEventListener('keyup', function (e) {
            clearmove(0.05);
          })
    },
    clear : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) 
{
    this.type = type;
    if (type == "image" || type == "background") 
    {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;  
    this.gravity = 0;
    this.gravitySpeed = 0;  
    this.update = function() {
        ctx = GlidingXero.context;
        if (this.type == "text") 
        {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if (type == "image" || type == "background") 
        {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
                if (type == "background") 
                {
                    ctx.drawImage(this.image, 
                        this.x + this.width, 
                        this.y,
                        this.width, this.height);
                }
        }
        else 
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() 
    {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;      
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
        this.hitBottom();  
    }
    this.hitBottom = function() {
        var rockbottom = GlidingXero.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 25);
        var mytop = this.y;
        var mybottom = this.y + (this.height - 25);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 			{
            crash = false;
        }
        return crash;
    }
}

function updateGlidingXero() 
{
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < ObstaclesGX.length; i += 1) {
        if (PlayerCharacter.crashWith(ObstaclesGX[i])) {
            return;
        } 
    }
    GlidingXero.clear();
    BackgroundGX.speedX = -1;
    BackgroundGX.newPos();    
    BackgroundGX.update();
    GlidingXero.frameNo += 1;
    if (GlidingXero.frameNo == 1 || everyinterval(400)) {
        x = GlidingXero.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 150;
        maxGap = 300;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        ObstaclesGX.push(new component(10, height, "red", x, 0));
        ObstaclesGX.push(new component(10, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < ObstaclesGX.length; i += 1) {
        ObstaclesGX[i].x += -1;
        ObstaclesGX[i].update();
    }
    var ScoreNumber; 
    if ((ObstaclesGX.length /2 -2) > 0)
    {
        ScoreNumber = (ObstaclesGX.length /2 -2);
    }
    else
    {
        ScoreNumber = 0;
    }
    ScoreGX.text="SCORE: " + ScoreNumber;
    ScoreGX.update(); 
    PlayerCharacter.newPos();
    PlayerCharacter.update();
}

function everyinterval(n) {
    if ((GlidingXero.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function move(n) {
    if (!GlidingXero.interval) {GlidingXero.interval = setInterval(updateGlidingXero, 20);}
    PlayerCharacter.image.src = "Flapping_Pilot.png";
    PlayerCharacter.gravity = n;
}

function clearmove(n) {
    if (!GlidingXero.interval) {GlidingXero.interval = setInterval(updateGlidingXero, 20);}
    PlayerCharacter.image.src = "Gliding_Pilot.png";
    PlayerCharacter.gravity = n;
}
