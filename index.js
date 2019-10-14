function Mine(rows, cols, mineNum){
    this.rows = rows;
    this.cols = cols;
    this.mineNum = mineNum;
    this.squares = []  
    this.surplusMine = mineNum;
    this.squaresDom = [];
     this.allRight = false;
     this.box = $('.box');

}
Mine.prototype.init = function(){
    let minePos = this.randomNum(); 
    let n = 0;
    for(var i = 0; i < this.rows; i++){
        this.squares[i] = [];
        for(var j = 0; j < this.cols; j++){
            if(minePos.indexOf(++n) != -1){
                this.squares[i][j] = {
                    type: 'mine',
                    x: j,
                    y: i
                }
            }else{
                this.squares[i][j] = {
                    type: 'number',
                    x: j,
                    y: i,
                    value: 0
                }  
            }
        }
    }
    this.update();
    this.createDom();
    
}
Mine.prototype.randomNum = function(){
    const squares = new Array(this.rows * this.cols );
    for(var i = 0; i < squares.length; i++){
        squares[i] = i;
    }
    squares.sort(() => Math.random() - 0.5);
    
    return squares.splice(0, this.mineNum);  
}
Mine.prototype.createDom = function(){
    const $tab = $('<table>');
    for(var i = 0; i < this.rows; i++){
        const $tr = $('<tr>').appendTo($tab);
        this.squaresDom[i] = [];
        for(var j = 0; j < this.cols; j++){
            
            let $td = $('<td>').appendTo($tr);
            this.squaresDom[i][j] = $td
            if(this.squares[i][j].type == 'mine'){
                $td.html('lei');
            }else{
                $td.html(this.squares[i][j].value)
            }
        }
    }
    this.box.append($tab)
}
Mine.prototype.getAround = function(square){
    let x = square.x;
    let y = square.y;
    let result = [];
    for(let i = x - 1; i <= x+ 1; i++){
        for(let j = y - 1; j <= y + 1; j++){
            if(
                i < 0||
                j < 0||
                i > this.rows - 1||
                j > this.cols - 1 ||
                (i == x && j == y) ||
                this.squares[j][i].type == 'mine'
            ){
                continue;
            }
            result.push([j, i]);
        }
    }
    return result;
}
Mine.prototype.update = function(){
    for(var i = 0; i < this.rows; i ++){
        for(var j = 0; j < this.cols; j++){
            if(this.squares[i][j].type == 'number'){
                continue;
            }
            var num = this.getAround(this.squares[i][j]);
            for(var k = 0; k < num.length; k++){
                this.squares[num[k][0]][num[k][1]].value += 1
            }
        }
    }
}
const mine = new Mine(28, 28, 99);
mine.init();
// console.log(mine.getAround(mine.squares[0][0]));
// console.log(mine.squares)