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
    if (this.x === 3) return null;  
    return new Box(this.x + 1, this.y);  
  }  
  
  getBottomBox() {  
    if (this.y === 3) return null;  
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
    
  const swapBoxes = (grid2, box1, box2) => {  
    const temp = grid2[box1.y][box1.x];  
    grid2[box1.y][box1.x] = grid2[box2.y][box2.x];  
    grid2[box2.y][box2.x] = temp;  
  };  
    
  const isSolved = grid2 => {  
    return (  
      grid2[0][0] === 1 &&  
      grid2[0][1] === 2 &&  
      grid2[0][2] === 3 &&  
      grid2[0][3] === 4 &&  
      grid2[1][0] === 5 &&  
      grid2[1][1] === 6 &&  
      grid2[1][2] === 7 &&  
      grid2[1][3] === 8 &&  
      grid2[2][0] === 9 &&  
      grid2[2][1] === 10 &&  
      grid2[2][2] === 11 &&  
      grid2[2][3] === 12 &&  
      grid2[3][0] === 13 &&  
      grid2[3][1] === 14 &&  
      grid2[3][2] === 15 &&  
      grid2[3][3] === 0  
    );  
  };  
    
  const getRandomGrid = () => {  
    let grid2 = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];  
    
    // Shuffle  
    let blankBox = new Box(3, 3);  
    for (let i = 0; i < 1000; i++) {  
      const randomNextdoorBox = blankBox.getRandomNextdoorBox();  
      swapBoxes(grid2, blankBox, randomNextdoorBox);  
      blankBox = randomNextdoorBox;  
    }  
    
    if (isSolved(grid2)) return getRandomGrid();  
    return grid2;  
  };  
    
  class State {  
    constructor(grid2, move, time, status) {  
      this.grid2 = grid2;  
      this.move = move;  
      this.time = time;  
      this.status = status;  
    }  
    
    static ready() {  
      return new State(  
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],  
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
          nextdoorBox => this.state.grid2[nextdoorBox.y][nextdoorBox.x] === 0  
        );  
        if (blankBox) {  
          const newGrid = [...this.state.grid2];  
          swapBoxes(newGrid, box, blankBox);  
          if (isSolved(newGrid)) {  
            clearInterval(this.tickId);  
            this.setState({  
              status: "won",  
              grid2: newGrid,  
              move: this.state.move + 1  
            });  
          } else {  
            this.setState({  
              grid2: newGrid,  
              move: this.state.move + 1  
            });  
          }  
        }  
      }.bind(this);  
    }  
    
    render() {  
      const { grid2, move, time, status } = this.state;  
    

      const newGrid = document.createElement("div");  
      newGrid.className = "grid2";  
      for (let i = 0; i < 4; i++) {  
        for (let j = 0; j < 4; j++) {  
          const button = document.createElement("button");  
    
          if (status === "playing") {  
            button.addEventListener("click", this.handleClickBox(new Box(j, i)));  
          }  
    
          button.textContent = grid2[i][j] === 0 ? "" : grid2[i][j].toString();  
          newGrid.appendChild(button);  
        }  
      }  
      document.querySelector(".grid2").replaceWith(newGrid);  
    

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
   document.getElementById("points").innerHTML="The number of moves you had is "+movesTotal;
    } 
  else{
  document.getElementById("winText").innerHTML="Well Done, "+nameplayer+"!<br>You Won!!";
  document.getElementById("points").innerHTML="The number of moves you had is "+movesTotal;
}
}