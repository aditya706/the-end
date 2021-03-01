//creating variables for game state
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//creating variables for percy jackson and his animation
var percy, percyImage, percy_attack;
//creating variables for obstacles (clarisse,ares and luke) and obstacles group
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
//creating variables for background and its image
var backGround, backGroundImage;
//creating variables for gameover sprite,gameover image and gameover sound
var gameOver, gameOverImage, gameOverSound;
//creating variable for jumping sound
var percyJumpSound;
//creating variable for score
var score;
//creating variable for the ground
var ground;

function preload() {
  //loading animations to percy  jackson
  percyImage = loadAnimation("percy_standing.png");
  percy_dead = loadAnimation("perce.jpg");

  //loading image to background
  backGroundImage = loadImage("background.png");
  //loading image to gameover sprite
  gameOverImage = loadImage("gameover.png");
  //loading image to ares
  obstacle1 = loadImage("ares.png");
  //loading image to clarisse la rue
  obstacle2 = loadImage("larue.jpg");
  //loading image to luke castellan
  obstacle3 = loadImage("luke.jpg");

  //loading sounds
  gameOverSound = loadSound("gameover.mp3");
  percyJumpSound = loadSound("jumpSound.mp3");
}

function setup() {
  //creating a canvas
  createCanvas(1500, 800);

  //creating a background sprite
  backGround = createSprite(0, 200, 800, 10);
  //adding image to the background sprite
  backGround.addImage(backGroundImage);
  //assigning a velocity
  backGround.velocityX = -4;
  //adding a scale
  backGround.scale = 0.5;
  //resetting the background to the centre of the screen
  backGround.x = backGround.width / 2;
  //printing the x position of the background on the console
  console.log("x position of background = ", backGround.x);

  //creating a sprite for percy jackson
  percy = createSprite(70, 300, 50, 50);
  //adding animations to percy "standing" and "dead"
  percy.addAnimation("standing", percyImage);
  percy.addAnimation("dead", percy_dead);
  //reducing the size of the animation
  percy.scale = 0.2;

  //creating a ground sprite
  ground = createSprite(400, 383, 900, 10);
  //adding a velocity
  ground.velocityX = -4;
  //resetting the ground
  ground.x = ground.width / 2;
  //setting the visibility of the ground to false
  ground.visible = false;

  //creating a new obstacle group
  obstaclesGroup = new Group();

  //score = 0
  score = 0;
}

function draw() {
  //clearing background to white
  background("white");

  //increasing the size of the text
  textSize(20);
  //displaying and updating the score
  text("Score: " + score, 250, 50);

  //if game state = PLAY, do this:
  if (gameState === PLAY) {
    //collide percy to the ground
    percy.collide(ground);
    //updating the score according to frame count
    score = score + Math.round(frameCount / 60);
    //making percy jump when space key is pressed and play the jump sound
    if (keyDown("space") && percy.y >= 200) {
      percyJumpSound.play();
      percy.velocityY = -13;
    }
    //add gravity so that percy comes down
    percy.velocityY = percy.velocityY + 0.8;

    //assigning velocities to the ground and background
    ground.velocityX = -4;
    backGround.velocityX = -4;

    //makingn the obstacles collide with percy
    obstaclesGroup.collide(percy);

    //resetting the ground and the background to the centre of the screen
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (backGround.x < 100) {
      backGround.x = backGround.width / 2;
    }

    //calling function spawn obstacles
    spawnObstacles();

    //change the gamestate to end if obstacles touch percy
    if (obstaclesGroup.isTouching(percy)) {
      gameState = END;
    }
    //if gametstae = END, do this:
  } else if (gameState === END) {
    //destroy the obstacles
    obstaclesGroup.destroyEach();
    //creating a gameover sprite
    gameOver = createSprite(300, 200, 30, 30);
    //adding image to the gameover sprite
    gameOver.addImage(gameOverImage);
    //play the gameover sound
    gameOverSound.play();
    //destroy the background
    backGround.destroy();
    //change percys animation to "dead"
    percy.changeAnimation("dead", percy_dead);
    //stop the ground and the background from moving
    ground.velocityX = 0;
    backGround.velocityX = 0;
    //reducing the gravity of percy to 0
    percy.velocityY = 0;
    //set velocity of obstacles group to 0
    obstaclesGroup.setVelocityXEach(0);
    //set lifetime of the obstacles so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
  }
  //the camera moves with the position of percy
  camera.position.x = displayWidth/2;
  camera.position.y = percy.position.y - 30;

  //draw the sprites
  drawSprites();
}
//function to spawn obstacles after every 60 frames
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    //create obstacle sprite
    var obstacle = createSprite(400, 340, 10, 40);

    //assign velocity
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        obstacle.scale = 0.3;
        break;
      case 2:
        obstacle.addImage(obstacle2);
        obstacle.scale = 0.1;
        break;
      case 3:
        obstacle.addImage(obstacle3);
        obstacle.scale = 0.05;
        break;
      default:
        break;
    }
    //assign lifetime to the obstacle           
    obstacle.lifetime = 60;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}