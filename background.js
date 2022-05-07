const WIDTH = 10;

class ConwayBackground {
  constructor(width, height, size){
    this.size = size;
    
    this.domElement = document.createElement("canvas");
    this.domElement.id = "conway-background";
    this.domElement.width = width * size;
    this.domElement.height = height * size;
    
    this.context = this.domElement.getContext('2d');
    
    document.body.insertBefore(this.domElement, document.body.firstChild);
    
    this.setupDataGrid(width, height, size);
    this.init();
    
  }

  setupDataGrid(width, height, size){
    let rate = 0.85;
    
    this.data = []; 
    for(let y = 0; y < height - 12; y++){ 
      let row = [];
      for(let x = 0; x < width; x++){
        if(Math.random() > rate) { 
          row.push(1); 
        }
        else { row.push(0); }   
      }
      this.data.push([...row]);
    }
    
    for(let y = height - 12; y < height; y++){ 
      let row = [];
      for(let x = 0; x < width; x++){
        if(Math.random() > (height - y) / 12) { 
          row.push(2); 
        }
        else { row.push(Math.random() > rate ? 1 : 0); }   
      }
      this.data.push([...row]);
    }
    

    console.log(this.data);
  } // Set up grid of cells

  get(x, y){
    if(this.data[y] == null || this.data[y][x] == null){ return 0; }
    return this.data[y][x];
  } // Get data of pixel at coordinate 
  
  renderGrid(){
    let FILL_SQUARE = "#151515";
    let FILL_BACKGROUND = "#101010";
    let FILL_OUTSIDE = "#DDDDDD";
    
    this.context.fillStyle = FILL_BACKGROUND;
    this.context.fillRect(0, 0, this.domElement.width, this.domElement.height);
    
    this.context.fillStyle = FILL_SQUARE;
    for(let y = 0; y < this.data.length; y++){
      let row = this.data[y];
      for(let x = 0; x < row.length; x++){
        let cell = row[x];
        
        if(cell === 1){
          this.context.fillRect(x * this.size, y * this.size, this.size, this.size);
        }
        if(cell === 2){
          this.context.fillStyle = FILL_OUTSIDE;
          this.context.fillRect(x * this.size, y * this.size, this.size, this.size);
          this.context.fillStyle = FILL_SQUARE;
        }
        
      }
    }
  } // Render grid of cells

  async init(){
    this.renderGrid();
    while(true){
      await this.sleep(100);
      this.step();
    }
  } // Begin stepping cells
  
  step(){
    let nextData = [];
    for(let y = 0; y < this.data.length; y++){
      let row = this.data[y];
      let nextRow = [];
      for(let x = 0; x < row.length; x++){
        let cell = row[x];
        let aliveNeighbors = 0; // 0, 1 DIES 2 LIVES 3 REPRODUCES 4, 5, 6, 7, 8 DIES

        if(cell === 2) { aliveNeighbors = 9; }
        
        if(this.get(x + 1, y + 1) === 1){ aliveNeighbors++}
        if(this.get(x + 1, y) === 1){ aliveNeighbors++ }
        if(this.get(x + 1, y - 1) === 1){ aliveNeighbors++ }
        
        if(this.get(x, y + 1) === 1){ aliveNeighbors++ }
        if(this.get(x, y - 1) === 1){ aliveNeighbors++ }
        
        if(this.get(x - 1, y + 1) === 1){ aliveNeighbors++ }
        if(this.get(x - 1, y) === 1){ aliveNeighbors++ }
        if(this.get(x - 1, y - 1) === 1){ aliveNeighbors++ }
        
        if(aliveNeighbors < 2){ cell = 0; }
        if(aliveNeighbors === 3){ cell = 1; }
        if(aliveNeighbors > 3){ cell = 0; }

        if(aliveNeighbors > 8){ cell = 2; }

        //console.log(x + "," + y + " " + aliveNeighbors + " || " + row[x] + " > " + cell)
        nextRow.push(cell);
      }
      nextData.push(nextRow);
    }
    
    this.data = nextData;
    this.renderGrid();
  } // Generate next iteration of cells


  sleep(ms) { return new Promise((resolve) => { setTimeout(resolve, ms); })}
}

var conwayBackground;

window.addEventListener("load", () => {
  conwayBackground = new ConwayBackground(Math.ceil(window.innerWidth / WIDTH), Math.ceil(window.innerHeight / WIDTH) + 16, WIDTH);
})
