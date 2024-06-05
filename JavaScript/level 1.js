/*=========== יצירת טבלה=============*/
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
    if (this.x === 2) return null;  
    return new Box(this.x + 1, this.y);  
  }  
  getBottomBox() {  
    if (this.y === 2) return null;  
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
    /*============ הגדרת מטריצה=========== */
  const swapBoxes = (grid1, box1, box2) => {  
    const temp = grid1[box1.y][box1.x];  
    grid1[box1.y][box1.x] = grid1[box2.y][box2.x];  
    grid1[box2.y][box2.x] = temp;  
  };  
    /*===============השוואת מטריצות =========== */
  const isSolved = grid1 => {  
    return (  
      grid1[0][0] === 1 &&  
      grid1[0][1] === 2 &&  
      grid1[0][2] === 3 &&  
      grid1[1][0] === 4 &&  
      grid1[1][1] === 5 &&  
      grid1[1][2] === 6 &&  
      grid1[2][0] === 7 &&  
      grid1[2][1] === 8 &&  
      grid1[2][2] === 0 
    );  
  };  
    /*======== רינדום מספרים לפי גודל טריצה  */
  const getRandomGrid = () => {  
    let grid1 = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];  
    let blankBox = new Box(2, 2);  
    for (let i = 0; i < 1000; i++) {  
      const randomNextdoorBox = blankBox.getRandomNextdoorBox();  
      swapBoxes(grid1, blankBox, randomNextdoorBox);  
      blankBox = randomNextdoorBox;  
    }  
    if (isSolved(grid1)) return getRandomGrid();  
    return grid1;  
  };  
   /*===========מצב התחלתי ================== */ 
  class State {  
    constructor(grid1, move, time, status) {  
      this.grid1 = grid1;  
      this.move = move;  
      this.time = time;  
      this.status = status;  
    }    
    static ready() {  
      return new State(  
        [[0, 0, 0], [0, 0, 0], [0, 0, 0]],0,0, 
        "ready"  
      );  
    }    
    static start() {  
      return new State(getRandomGrid(), 0, 0, "playing");  
    }  
  }  
   /*========== פונקצית המשחק ===============*/ 
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
    /*=========סיפרת הזמן-עלייה ב1 ==================*/
    tick() {  
      this.setState({ time: this.state.time + 1 });  
    }   
    setState(newState) {  
      this.state = { ...this.state, ...newState };  
      this.render();  
    }  
   /*==========בדיקת צעדים אם אפשורת לזוז רק מקום אחד ימינה או שמאלה או למעלה או למטה=================== */ 
    handleClickBox(box) {  
      return function() {  
        const nextdoorBoxes = box.getNextdoorBoxes();  
        const blankBox = nextdoorBoxes.find(  
          nextdoorBox => this.state.grid1[nextdoorBox.y][nextdoorBox.x] === 0  );  
        if (blankBox) {  
          const newGrid = [...this.state.grid1];  
          swapBoxes(newGrid, box, blankBox); 
          /*======בדיקה האם הסידור הושלם וספירת צעדים בכל מקרה=============== */ 
          if (isSolved(newGrid)) {  
            clearInterval(this.tickId);  
            this.setState({  
              status: "won",  
              grid1: newGrid,  
              move: this.state.move + 1  
            });  
          } else {  
            this.setState({  
              grid1: newGrid,  
              move: this.state.move + 1  
            });  
          }  
        }  
      }.bind(this);  
    }  
    render() {  
      /*================קבלת נתונים================= */
      const { grid1, move, time, status } = this.state;  
      const newGrid = document.createElement("div");  
      newGrid.className = "grid1";  
      for (let i = 0; i < 3; i++) {  
        for (let j = 0; j < 3; j++) {  
          const button = document.createElement("button");  
    /*==========אם לחצנו על PLAYING*/
          if (status === "playing") {  
            /*אז יוגדר מטריצה*/
            button.addEventListener("click", this.handleClickBox(new Box(j, i)));  
          }  
           /*תתחיל בדיקה שרק מה שסביב הכפתור הריק יכול לזוז*/
          button.textContent = grid1[i][j] === 0 ? "" : grid1[i][j].toString();  
          newGrid.appendChild(button);  
        }  
      }  
      document.querySelector(".grid1").replaceWith(newGrid);  
      /*כפתורי פעולה בהתאם למצב כרגע */ 
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
     // שינוי ההודעה על מספר הצעדים שנעשו בהתאם  
      document.getElementById("move").textContent = `Move: ${move}`;  
      // שינוי ההודעה על הזמן שעבר בהתאם  
      document.getElementById("time").textContent = `Time: ${time}`;  
      // אם סיים ישלח לדף של HTML שידפיס ניצחת 
      if (status === "won"){
        location.replace("win.html")
        // אם לא ימשיך לרוץ
    } else {  
        document.querySelector(".message").textContent = "";  
      }  
    }  
  }  
/*פנוקצית להפעלת המוזיקת רקע */
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
    } 
  else{
  document.getElementById("winText").innerHTML="Well Done, "+nameplayer+"!<br>You Won!!";
}
}