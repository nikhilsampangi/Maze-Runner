function startGame()
{
  // 425 (X), 3 (Y) RECTANGLE
  // 542 (center X), 122 (center Y) RECTANGLE
  var canvas = document.getElementById("mazecanvas");
  var context = canvas.getContext("2d");
  var currRectX = 425;
  var currRectY = 3;
  var mazeWidth = 576;
  var mazeHeight = 556; 
  var SEC=0;
  var intervalVar;

  function drawMazeAndRectangle(rectX, rectY)
  {
    FillWhite(0, 0, canvas.width, canvas.height);
    var mazeImg = new Image();
    mazeImg.onload = function ()
    {
      context.drawImage(mazeImg, 0, 0);
      drawRectangle(rectX, rectY, "#0000FF");
      context.beginPath();
      context.arc(562,276, 7, 0, 2 * Math.PI, false);
      context.closePath();
      context.fillStyle = '#00FF00';
      context.fill();
    };
    var i=1+Math.floor(Math.random() * (4));
    mazeImg.src = "maze"+i+".gif";
  }
  function drawRectangle(x, y, color)
  {
    FillWhite(currRectX, currRectY, 15, 15);
    currRectX = x;
    currRectY = y;
    context.beginPath();
    context.rect(x, y, 15, 15);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }
  function moveRect(e)
  {
    var newX;
    var newY;
    var movingAllowed;
    e = e || window.event;
    switch (e.keyCode)
    {
      case 87: // W key
        newX = currRectX;
        newY = currRectY - 6;
        break;

      case 65: // A key
        newX = currRectX - 6;
        newY = currRectY;
        break;
      case 83: // S key
        newX = currRectX;
        newY = currRectY + 6;
        break;
      case 68: // D key
        newX = currRectX + 6;
        newY = currRectY;
        break;
      default: return;
    }
    movingAllowed = MoveAllow(newX, newY);
    if (movingAllowed === 1)
    {
      // 1 means 'the rectangle can move'
      drawRectangle(newX, newY, "#0000FF");
      currRectX = newX;
      currRectY = newY;
    }
    else if (movingAllowed === 2)
    {
      // 2 means 'the rectangle reached the end point'
      clearInterval(intervalVar);
      FillWhite(0, 0, canvas.width, canvas.height);
      DisplayScore();
    }
  }
  function MoveAllow(coordX, coordY)
  {
    var imgData = context.getImageData(coordX, coordY, 15, 15);
    var data = imgData.data;
    var canMove = 1; // 1 means: the rectangle can move
    if (coordX >= 0 && coordX <= mazeWidth-15 && coordY >= 0 && coordY <= mazeHeight-15)
    {
      for (var i = 0; i < 4 * 15 * 15; i += 4)
      {
        if (data[i] ===data[i + 1] && data[i + 1]==data[i + 2] && data[i]===0)
        {
          // black color
          canMove = 0; // 0 means: the rectangle can't move
          break;
        }
        else if (data[i] === 0 && data[i + 1] === 255 && data[i + 2] === 0)
        {
          // #00FF00
          canMove = 2; // 2 means: the end point is reached
          break;
        }
      }
    }
    else
    {
      canMove = 0;
    }
    return canMove;
  }

  
  function createTimer(seconds)
  {
    
    intervalVar = setInterval(function () 
    {  
      FillWhite(mazeWidth, 0, canvas.width - mazeWidth, canvas.height);
      if (seconds === 0)
      {
        clearInterval(intervalVar);
        window.removeEventListener("keydown", moveRect, true);
        FillWhite(0, 0, canvas.width, canvas.height);
        context.font = "40px Arial";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("Time's up!", canvas.width / 2, canvas.height / 2);
        return;
      }
      context.font = "20px Arial";
      context.fillStyle = "green";
      context.textAlign = "center";
      context.textBaseline = "middle";
      var minutes = Math.floor(seconds / 60);
      var secondsToShow = (seconds - minutes * 60).toString();
      if (secondsToShow.length === 1)
      {
        secondsToShow = "0" + secondsToShow; // if the number of seconds is '5' for example, make sure that it is shown as '05'
      }
      context.fillText(minutes.toString() + ":" + secondsToShow, mazeWidth + 30, canvas.height / 2);
      seconds--;
      SEC=360-seconds;
    } , 1000);
  }

  var finalScore=0;
  function DisplayScore()
  {
    context.font = "40px Arial";
    context.fillStyle = "blue";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Hell Yeah! You solved it", canvas.width / 2, canvas.height / 2);
    finalScore=(360-SEC)/3;
    window.alert("You solved it in "+SEC+" seconds.Your score is: "+finalScore.toFixed(1));
    location.reload();
    window.removeEventListener("keydown", moveRect, true);
    document.getElementById("st").value="Play Again"
  }
  function FillWhite(x, y, w, h)
  {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
  }
  drawMazeAndRectangle(425, 3);
  window.addEventListener("keydown", moveRect, true);  
  createTimer(360); // 5 minutes
  var close=document.getElementById("st");
  close.parentNode.removeChild(close);
}
