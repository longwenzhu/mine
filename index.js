function Mine(rows, cols, mineNum){
    this.rows = rows;
    this.cols = cols;
    this.mineNum = mineNum;
    this.squares = []  
    this.surplusMine = mineNum;
    this.squaresDom = [];
     this.allRight = false;
     this.box = $('.box');
     this.$surplus = $('.info span');

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
    this.$surplus.html(this.surplusMine);
    this.update();
    this.createDom();
    this.bindEvent();
    
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
            
            let $td = $('<td>').appendTo($tr).data('pos',this.squares[i][j])
            this.squaresDom[i][j] = $td
            // if(this.squares[i][j].type == 'mine'){
            //     $td.html('e')
            // }
            // //     // $td.html(this.squares[i][j].value)
            // // }
        }
    }
    this.box.html('');
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
Mine.prototype.bindEvent = function(){
    this.box.off('mousedown');
    this.box.on('mousedown', 'td', e => {
        const $e = $(e.target);
        const val = $e.data('pos');
       if(e.which == 1 && !$e.hasClass('sign')){
        $e.addClass('show');
        if(val.type == 'number'){
            if(val.value == 0){
                const findAround = obj => {
                    const temp = this.getAround(obj);
                    for(let i = 0; i < temp.length; i++){
                        let x = temp[i][0];
                        let y = temp[i][1];
                        if(!this.squaresDom[x][y].hasClass('sign')){
                            this.squaresDom[x][y].addClass('show');
                        }
                    
                        if(obj.value == 0){
                            if(!this.squaresDom[x][y].data('ready')){
                                this.squaresDom[x][y].data('ready', true);
                                
                                findAround(this.squaresDom[x][y].data('pos'));
                            }
                        }else{
                            this.squaresDom[x][y].html(
                                this.squares[x][y].value == 0 ? '' : this.squares[x][y].value
                            )
                        }
                    }
                }
                findAround(val);
            }else{
                $e.html(val.value);
            }
        }else{
            this.gameOver($e);
           setTimeout(() => {
            alert('over');
           },100);
        }
       }else if(e.which == 3){
       
        if(!$e.hasClass('sign') && !$e.hasClass('show')){
            $e.addClass('sign click-mine');
            this.$surplus.html(--this.surplusMine);
            
            if($e.data('pos').type == 'mine'){
                this.allRight = true;
            }else{
                this.allRight = false;
            }
        }else{
            $e.removeClass("sign click-mine");
            this.$surplus.html(++this.surplusMine);
        }
        
       if(this.surplusMine == 0 ){
        if(this.allRight){
            this.gameOver();
            alert('success');
        }else{
            this.gameOver();
            setTimeout(() => {
                alert('over');
               },100)
        }
    }
} 
    }).on('contextmenu',e => {
        e.preventDefault();
    })
}
Mine.prototype.gameOver = function($e=$()){
    console.log($e)
    this.box.off('mousedown');

    $e.addClass('fail click-mine');
    for(var i = 0; i < this.squares.length; i++){
        for(var j = 0; j < this.squares[i].length; j++){
            if(this.squares[i][j].type == 'mine'){
                this.squaresDom[i][j].addClass('click-mine show');
                this.squaresDom[i][j].removeClass('sign');
            }
        }
    }
}


let n = 0;
let mine = null;
let $but = $('button');
const level = [[9, 9, 10], [16, 16, 40],[28, 28, 99]];
for(let i = 0; i < level.length; i++){
    $but.eq(i).click(function(){
        $but.eq(n).removeClass('active');
        $(this).addClass('active');
        mine = new Mine(...level[i]);
        mine.init();
        n = i;
    });
}
$but.eq(0)[0].click();
$but.eq(3).click(() => {
    mine.init();
})