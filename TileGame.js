
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

//fade off splashscreen
$('.enter_link').click(function () {
    $(this).parent('#splashscreen').fadeOut(500);
});


//8 by 8 grid
var map = [
            [0, 0, 1, 0, 2, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 2, 0],
            [0, 2, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 2, 0, 1],
            [0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 2, 0],
            [1, 0, 0, 0, 1, 0, 0, 3], 
];

var gameObjects =
[
  [4, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 5, 0, 0, 0, 0]
];


//map code
var rock = 5;
var explorer = 4;
var home = 3;
var chest = 2;
var fox = 1;
var ground = 0;

//map sizing
var size = 50;

var rows = map.length;
var columns = map[0].length;

//player variable
var expRow;
var expColumn;
var rockRow;
var rockColumn;

for(var row = 0; row < rows; row++)
{
  for(var column = 0; column < columns; column++)
  {
    if(gameObjects[row][column] === explorer)
    {
      expRow = row;
      expColumn = column;
    }
     if(gameObjects[row][column] === rock)
    {
      rockRow = row;
      rockColumn = column;
    }
  }
}

render();

//game variables
var rescueFox = 0;
var gold = 10;
var health = 30;
var gameMessage = "Use the arrow keys to find your way home.";

//keystrokes
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;
          
//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);

//keyboard stroke function
function keydownHandler(event)
{
  switch(event.keyCode)
  {
    case UP:

      //move will be within the playing field
      if(expRow > 0)
      {
        //If it is, clear the ship's current cell
        gameObjects[expRow][expColumn] = 0;

        //Subtract 1 from the row to move it up one row on the map
        expRow--;

        //Apply the new updated position to the array
        gameObjects[expRow][expColumn] = explorer;
      }
      break;

  case DOWN:
    if(expRow < rows - 1)
    {
      gameObjects[expRow][expColumn] = 0;
      expRow++; 
      gameObjects[expRow][expColumn] = explorer;
    }
    break;

  case LEFT:
    if(expColumn > 0)
    {
      gameObjects[expRow][expColumn] = 0;
      expColumn--;
      gameObjects[expRow][expColumn] = explorer;
    }
    break;

  case RIGHT:
    if(expColumn < columns - 1)
    {
      gameObjects[expRow][expColumn] = 0;
      expColumn++;
      gameObjects[expRow][expColumn] = explorer;
    }
    break;
  }
 //Find out what kind of cell the ship is on
  switch(map[expRow][expColumn])
  {
        case ground:
          gameMessage = "You find your way through the dark cave.";
          break;

        case fox:
          rescue();
          break;

        case chest:
          loot();
          break;

        case home:
          endgame();
          break;
      }

    //health lowers by 1 each turn.
health--;
    if (health === 0)
        {
            endgame();
        }
    //move the rock
    moveRock();
    if(gameObjects[expRow][expColumn] === rock)
{
  endgame();
}
  //Render the game
  render();
}

//game functions
function rescue(){
        
        var foxGold = 10;
        var friendOrFoe = Math.ceil((Math.random()*10)+1);
        if (friendOrFoe < 7)
        { 
        //fox needs rescuing 6/10 times
            gameMessage = "A cute fox lies injured. You tend to its wounds, and it scampers off. On a whim, you follow it and find" + foxGold +"gold.";
            gold += foxGold;
            rescueFox++;
        }
        else
        {
        //fox turns into monster 4/10 times
            var foxStrength = (Math.ceil((Math.random()*10)+2));
            gameMessage = "A cute fox lies injured. As you get closer, it transforms into a terrible beast, and rushes towards you.";
            if((foxStrength * 10) <= gold)
               {
                    gameMessage += "You somehow manage to beat down the beast with your trusty bag of treasure, only doing 2 damage. It scurries off into the cave, leaving" + foxGold + "gold behind.";
                   health = health - 2;
                   gold += foxGold;
                   rescueFox++; //saving self counts as rescuing a fox
               }
            else
            {
                  gameMessage += "You try to beat down the beast with trusty bag of treasure, but it's too strong. It attacks for" + foxStrength + " damage, then roars in triumph and disappears.";
                   health = health - foxStrength;
            }
        }
}

function loot(){
    var goldchance = Math.ceil((Math.random()*10)+1);
    var chestgold = 0;

    if (goldchance > 7){
        //big haul
        var size = Math.ceil(Math.random());
        if (size == 1)
        {chestgold = 20; }
        else
        {chestgold = 30; }

        gameMessage = "You found a big chest! You've gained" + chestgold + "gold, and stuffed it in your bag!";
    }
    if (goldchance > 3){
        chestgold = 10;
        gameMessage = "You found meager chest! You've gained" + chestgold + "gold, and stuffed it in your bag!";
    }
    else{
        gameMessage = "You found an empty chest. It looks like someone.. or something.. got to it first.";
    }
      gold += chestgold;
}

function endgame(){
    if(map[expRow][expColumn] === home)
  {
     //Calculate the score
     var score = (rescueFox * 10) + gold + health;

     //Display the game message
     gameMessage = "You made it out of the cave alive! " + "Final Score: " + score;
      //play win audio
      var audioWin = new Audio('ffWin.mp3');
      audioWin.play();
  }
    else if (gameObjects[rockRow][rockColumn])
    {
        gameMessage = "You have been crushed by an enormous boulder! Your consciousness starts to fade...";
        //play lose audio
        var audioLose1 = new Audio('fflose.mp3');
        audioLose1.play();
    }
    else
    {
        gameMessage = "Your health has reached 0! Your consciousness starts to fade...";
        //play lose audio
        var audioLose2 = new Audio('fflose.mp3');
        audioLose2.play();
    }
       //Remove the keyboard listener to end the game
   window.removeEventListener("keydown", keydownHandler, false);
}


//render function
function render()
{
  //Clear the stage
    
  if(stage.hasChildNodes())
  {
    for(var i = 0; i < rows * columns; i++)
    {
      stage.removeChild(stage.firstChild);
    }
      
      
  }
    for(var row = 0; row < rows; row++)
  {
    for(var column = 0; column < columns; column++)
    {
      var cell = document.createElement("img");

      cell.setAttribute("class", "cell");

      stage.appendChild(cell);

      switch(map[row][column])
      {
        case ground:
          cell.src = "GrSprite.png";
          break;

        case fox:
          cell.src = "FXSprite.png";
          break;

        case chest:
          cell.src = "TCSprite.png";
          break;

        case home:
          cell.src = "HMSprite.png";
          break;
      }

         switch(gameObjects[row][column])
      {
        case explorer:
        cell.src = "EXSprite.jpg";
        break;
  
        case rock:
        cell.src = "BRSprite.png";
        break;
 
      }

      //Position the cell
      cell.style.top = row * size + "px";
      cell.style.left = column * size + "px";
        
        //Display the game message
   output.innerHTML = gameMessage;

   //Display the player's food, gold, and experience
   output.innerHTML += `<br>Gold: ${gold}, Foxes Rescued: ${rescueFox} + , Health:  + ${health}`;
}
    }
  }

function moveRock()
{
  let UP = 1;
  let DOWN = 2;
  let LEFT = 3;
  let RIGHT = 4;

    //valid directions
    var validDirections = [];

    //The final direction that the monster will move in
    var direction;

    if(rockRow > 0)
    {
     var thingAbove = map[rockRow - 1][rockColumn];

      if(thingAbove === ground)
      {
        validDirections.push(UP);
      }
    }
    if(rockRow < rows - 1)
    {
      var thingBelow = map[rockRow + 1][rockColumn];
      if(thingBelow === ground)
      {
        validDirections.push(DOWN);
      }
    }
    if(rockColumn > 0)
    {
      var thingToTheLeft = map[rockRow][rockColumn - 1];
      if(thingToTheLeft === ground)
      {
        validDirections.push(LEFT);
      }
    }
    if(rockColumn < columns - 1)
    {
      var thingToTheRight = map[rockRow][rockColumn + 1];
      if(thingToTheRight === ground)
      {
        validDirections.push(RIGHT);
      }
    }

    //choose from valid directions
    if(validDirections.length !== 0)
      {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
      }

      //move
      switch(direction)
      {
        case UP:
              
          gameObjects[rockRow][rockColumn] = 0;
          rockRow--;
          gameObjects[rockRow][rockColumn] = rock;
          break;

    case DOWN:
      gameObjects[rockRow][rockColumn] = 0;
      rockRow++;
      gameObjects[rockRow][rockColumn] = rock;
      break;

    case LEFT:
      gameObjects[rockRow][rockColumn] = 0;
      rockColumn--;
      gameObjects[rockRow][rockColumn] = rock;
      break;

    case RIGHT:
      gameObjects[rockRow][rockColumn] = 0;
      rockColumn++;
      gameObjects[rockRow][rockColumn] = rock;
  }
}