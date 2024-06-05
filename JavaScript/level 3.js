class Box {  
  constructor(x, y) {  
    this.x = x;  
    this.y = y;  
  }  
  
  getTopBox() {  
    if (this.y === 0) return null;  
    return new Box(this.x, this.y - 1);  
  }  
  
  getRightBox() {  
    if (this.x === 4) return null;  
    return new Box(this.x + 1, this.y);  
  }  
  
  getBottomBox() {  
    if (this.y === 4) return null;  
    return new Box(this.x, this.y + 1);  
  }  
  
  getLeftBox() {  
    if (this.x === 0) return null;  
    return new Box(this.x - 1, this.y);  
  } getNextdoorBoxes() {  
      return [  
        this.getTopBox(),  
        this.getRightBox(),  
        this.getBottomBox(),  
        this.getLeftBox()  
      ].filter(box => box !== null);  
    }  
    
    getRandomNextdoorBox() {  
      const nextdoorBoxes = this.getNextdoorBoxes();  
      return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];  
    }  
  }  
    
  const swapBoxes = (grid3, box1, box2) => {  
    const temp = grid3[box1.y][box1.x];  
    grid3[box1.y][box1.x] = grid3[box2.y][box2.x];  
    grid3[box2.y][box2.x] = temp;  
  };  
    
  const isSolved = grid3 => {  
    return (  
      grid3[0][0] === 1 &&  
      grid3[0][1] === 2 &&  
      grid3[0][2] === 3 &&  
      grid3[0][3] === 4 && 
      grid3[0][4] === 5 &&
      grid3[1][0] === 6 &&  
      grid3[1][1] === 7 &&  
      grid3[1][2] === 8 &&  
      grid3[1][3] === 9 && 
      grid3[1][4] === 10 && 
      grid3[2][0] === 11 &&  
      grid3[2][1] === 12 &&  
      grid3[2][2] === 13 &&  
      grid3[2][3] === 14 && 
      grid3[2][4] === 15 &&  
      grid3[3][0] === 16 &&  
      grid3[3][1] === 17 &&  
      grid3[3][2] === 18 &&  
      grid3[3][3] === 19  &&
      grid3[3][4] === 20  &&
      grid3[4][0] === 21 &&  
      grid3[4][1] === 22 &&  
      grid3[4][2] === 23 &&  
      grid3[4][3] === 24  &&
      grid3[4][4] === 0  
    );  
  };  
    
  const getRandomGrid = () => {  
    let grid3 = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 0]];  
    
    // Shuffle  
    let blankBox = new Box(4, 4);  
    for (let i = 0; i < 1000; i++) {  
      const randomNextdoorBox = blankBox.getRandomNextdoorBox();  
      swapBoxes(grid3, blankBox, randomNextdoorBox);  
      blankBox = randomNextdoorBox;  
    }  
    
    if (isSolved(grid3)) return getRandomGrid();  
    return grid3;  
  };  
    
  class State {  
    constructor(grid3, move, time, status) {  
      this.grid3 = grid3;  
      this.move = move;  
      this.time = time;  
      this.status = status;  
    }  
    
    static ready() {  
      return new State(  
        [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],  
        0,  
        0,  
        "ready"  
      );  
    }  
    
    static start() {  
      return new State(getRandomGrid(), 0, 0, "playing");  
    }  
  }  
  var movesTotal;
  class Game {  
    constructor(state) {  
      this.state = state;  
      this.tickId = null;  
      this.tick = this.tick.bind(this);  
      this.render();  
      this.handleClickBox = this.handleClickBox.bind(this);  
    }  
    
    static ready() {  
      return new Game(State.ready());  
    }  
    
    tick() {  
      this.setState({ time: this.state.time + 1 });  
    }  
    
    setState(newState) {  
      this.state = { ...this.state, ...newState };  
      this.render();  
    }  
    
    handleClickBox(box) {  
      return function() {  
        const nextdoorBoxes = box.getNextdoorBoxes();  
        const blankBox = nextdoorBoxes.find(  
          nextdoorBox => this.state.grid3[nextdoorBox.y][nextdoorBox.x] === 0  
        );  
        if (blankBox) {  
          const newGrid = [...this.state.grid3];  
          swapBoxes(newGrid, box, blankBox);  
          if (isSolved(newGrid)) {  
            clearInterval(this.tickId);  
            this.setState({  
              status: "won",  
              grid3: newGrid,  
              move: this.state.move + 1  
            });  
          } else {  
            this.setState({  
              grid3: newGrid,  
              move: this.state.move + 1  
            });  
          }  
        }  
      }.bind(this);  
    }  
    
    render() {  
      const { grid3, move, time, status } = this.state;  
    
      // Render grid  
      const newGrid = document.createElement("div");  
      newGrid.className = "grid3";  
      for (let i = 0; i < 5; i++) {  
        for (let j = 0; j < 5; j++) {  
          const button = document.createElement("button");  
    
          if (status === "playing") {  
            button.addEventListener("click", this.handleClickBox(new Box(j, i)));  
          }  
    
          button.textContent = grid3[i][j] === 0 ? "" : grid3[i][j].toString();  
          newGrid.appendChild(button);  
        }  
      }  
      document.querySelector(".grid3").replaceWith(newGrid);  
    
      
      const newButton = document.createElement("button");  
      if (status === "ready") newButton.textContent = "Play";  
      if (status === "playing") newButton.textContent = "Reset";  
      if (status === "won") newButton.textContent = "Play";  
      newButton.addEventListener("click", () => {  
        clearInterval(this.tickId);  
        this.tickId = setInterval(this.tick, 1000);  
        this.setState(State.start());  
      });  
      document.querySelector(".footer button").replaceWith(newButton);  
    
      
      document.getElementById("move").textContent = `Move: ${move}`;  
    
       
      document.getElementById("time").textContent = `Time: ${time}`;  
    
      
      if (status === "won") {  
        movesTotal=this.state.move;
        location.replace("win.html")
      } else {  
        document.querySelector(".message").textContent = "";  
      }  
    }  
  }  
    
  const GAME = Game.ready(); 
  function startMusic() {
    document.getElementById("music").play()
};
function playTune() {
    var source = DarkRedWine.ogg;
    var audio = document.createElement("audio");
    audio.src = source;
    audio.load();
    audio.play();

}
var nameplayer;
//nameplayer = document.getElementById("");
function savename(s)
{
    //localStorage.setItem("nameofplayer", s);
    nameplayer=s;
}
function youWon(){
  if(nameplayer==null){
   document.getElementById("winText").innerHTML="Well done,  You won!!";
   document.getElementById("points").innerHTML="The number of moves you had is "+Game.move;
    } 
  else{
  document.getElementById("winText").innerHTML="Well Done, "+nameplayer+"!<br>You Won!!";
  document.getElementById("points").innerHTML="The number of moves you had is "+Game.move;
}
}