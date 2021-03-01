var WIDTH = 665;
var HEIGHT = 380;
var ctx;
var cube_w = 166;
var cube_h = 164;
var spacing_w=cube_w/2;
var spacing_h=50;
var shift_y=71;
var shift_x=cube_w/2;
var selectedCubeType=1;
var tile_spots=[
    [83,50],[249,50],[415,50],[581,50],
        [166,100],[332,100],[498,100],
    [83,150],[249,150],[415,150],[581,150],
        [166,200],[332,200],[498,200],
    [83,250],[249,250],[415,250],[581,250]
];
var board=[
    [[83,50],0],[[249,50],0],[[415,50],0],[[581,50],0],
        [[166,100],0],[[332,100],0],[[498,100],0],
    [[83,150],0],[[249,150],0],[[415,150],0],[[581,150],0],
        [[166,200],0],[[332,200],0],[[498,200],0],
    [[83,250],0],[[249,250],0],[[415,250],0],[[581,250],0]
];
var tiles_next_to=[
    [4],
    [4,5],
    [5,6],
    [6],
    [0,1,7,8],
    [1,2,8,9],
    [2,3,9,10],
    [4,11],
    [4,5,11,12],
    [5,6,12,13],
    [6,13],
    [7,8,14,15],
    [8,9,15,16],
    [9,10,16,17],
    [11],
    [11,12],
    [12,13],
    [13]
];

//Images
var blankImg=new Image();
blankImg.src='cube/blank.png';
var forestImg=new Image();
forestImg.src='cube/forest.png';
var farmImg=new Image();
farmImg.src='cube/farm.png';
var townImg=new Image();
townImg.src='cube/town.png';
var lakeImg=new Image();
lakeImg.src='cube/lake.png';
var mountainImg=new Image();
mountainImg.src='cube/mountain.png';

var sprite=[
    blankImg,
    forestImg,
    farmImg,
    townImg,
    lakeImg,
    mountainImg
]
const NUM_TILE_TYPES = 5;
const EMPTY=0;
const FOREST=1;
const FARM=2;
const TOWN=3;
const LAKE=4;
const MOUNTAIN=5;

function placeCurrentCube(element){
    element.innerHTML="<img src='png/forest_iso1.png' />";
}

function setupCanvas(){
    ctx=document.getElementById('canvas_area').getContext("2d");
    // ctx.translate(0.5, 0.5);
}

function placeCubeOnThis(event) {
    var x = event.clientX;
    var y = event.clientY;
    if(x > WIDTH || y > HEIGHT){
        return;
    }
    var pts = [x,y];
    // var cubeImg = new Image();
    // document.getElementById('debug').innerText='clicked: ' +x+', '+y;
    nearest = nearestSpot(pts);
    //check if you have any of this piece left
    if(parseInt(document.getElementById('pc'+selectedCubeType).innerText)>0 || selectedCubeType==0){

        if (setBoardAt(nearest,selectedCubeType)==true && selectedCubeType>0){
            document.getElementById('pc'+selectedCubeType).innerText = parseInt(document.getElementById('pc'+selectedCubeType).innerText) -1;
        }
    }
    drawBoard();
}

function drawBoard(){
    //clear canvas
    clearCanvas();
    
    //draw each tile
    board.forEach(element => {
        if(element[1]>=0){
            // console.log('drawing tile');
            drawCube(element[0],sprite[element[1]]);
        }
    });
}

function clearCanvas(){
    ctx=document.getElementById('canvas_area').getContext("2d");
    ctx.clearRect(0,0,WIDTH,HEIGHT);
}

function resetBoardVals(){
    board.forEach(element => {
        element[1] = 0;
    });
}

function drawCube(xy,cubeImg){
    ctx=document.getElementById('canvas_area').getContext("2d");
    ctx.drawImage(cubeImg, xy[0]-spacing_w, xy[1]-spacing_h);
}

function selectThis(pieceDiv,pieceID){
    var divs = document.getElementsByClassName('piece');
    for(var i=0;i<divs.length;i++){
        divs[i].style.backgroundColor='white';
    }
    pieceDiv.style.backgroundColor='skyblue';
    selectedCubeType = pieceID;
}

function changeAmountOfTile(id,delta){
    document.getElementById('pc'+id).innerText = parseInt(document.getElementById('pc'+id).innerText) + delta;
}

function setAmountOfTile(id,amount){
    document.getElementById('pc'+id).innerText = amount;
}

function setBoardAt(pts,i){
    ret=false;
    board.forEach(element => {
        if(element[0][0]==pts[0]&&element[0][1]==pts[1]&&element[1]!=selectedCubeType){
            //refill if needed
            if(element[1]>0){
                changeAmountOfTile(element[1],1);
            }

            element[1]=i;
            ret=true;
        }
    });
    return ret;
}

function snapToNearest(a,spacing){
    return Math.round(a/spacing)*spacing;
}
function snapToPoints(x,y){
    x=Math.round(x/(cube_w/2))*cube_w/2;
    y=Math.round(y/(cube_h/2))*cube_h/2;
    return [x,y];
}

function nearestSpot(pts){
    d = 1000000000;
    ret = pts;
    tile_spots.forEach(element => {
        v = dist(element,pts);
        if (v < d){
            ret=element;
            d=v;
        }
    });
    return ret;
}

function dist(pts1, pts2){
    return Math.sqrt( (pts1[0]-pts2[0])*(pts1[0]-pts2[0]) + (pts1[1]-pts2[1])*(pts1[1]-pts2[1]));
}

function startGame(gametype){
    clearCanvas();
    resetBoardVals();
    drawBoard();
    document.getElementById('score_value').innerText = "0 points";

    //reset counts
    for(var i = 1;i<sprite.length;i++){
        setAmountOfTile(i,0);
    }

    if (gametype == 0){
        //set up random game
        for(var i=0;i<18;i++){
            var j = Math.floor(Math.random() * NUM_TILE_TYPES) + 1;
            document.getElementById('pc'+j).innerText = parseInt(document.getElementById('pc'+j).innerText) + 1;
        }
        //write the seed value to the seed input
        var new_seed = "";
        for(var i=1;i<=NUM_TILE_TYPES;i++){
            new_seed += document.getElementById('pc'+i).innerText;
        }
        document.getElementById('seed').value = new_seed;
    } else if (gametype == 1){
        //set up game from the seed
        var seed_val = document.getElementById('seed').value;
        if (parseInt(seed_val) >= Math.pow(10,NUM_TILE_TYPES) || parseInt(seed_val) < 0){
            //out of bounds, set it to 0
            seed_val = "00000";
        }
        var seed_array = Array.from(seed_val).map(Number);
        // console.log(seed_array);
        for(var i=1;i<=NUM_TILE_TYPES;i++){
            if(seed_array.length<i) {
                document.getElementById('pc'+i).innerText = 0;
            }
            else {
                document.getElementById('pc'+i).innerText = seed_array[i-1];
            }
        }
    }
}

function scoreGame(gametype){
    // document.getElementById('debug').innerText = "scoring game";
    game_score = 0;

    if (gametype == 0){
        //loop through each tile
        for(var i=0;i<18;i++){
            game_score += scoreTile(i);
        }
    }
   
    document.getElementById('score_value').innerText = game_score + " points";
}

function scoreTile(tileId){
    score = 0;
    //get tile type
    tile_type = board[tileId][1];
    // console.log(tile_type);

    //get surrounding tiles 
    //and go thru each to score
    tiles_next_to[tileId].forEach(element => {
        neighbour = board[element][1];
        if (tile_type == FOREST){
            //forests together good
            if(neighbour == FOREST) score += 1;
        }
        if (tile_type == FARM){
            //farms need forests
            if(neighbour == FOREST) score += 1;
            //farms should not be by mountain (rocky dirt)
            if(neighbour == MOUNTAIN) score -= 2;
        }
        if (tile_type == TOWN){
            //towns like a farm nearby
            if(neighbour == FARM) score += 3;
            //waterfront property is good
            if(neighbour == LAKE) score += 1;
            //towns by moutains are good for climate
            if(neighbour == MOUNTAIN) score += 2;
        }
        if (tile_type == LAKE){
            //Bigger areas for fish are good
            if(neighbour == LAKE) score += 2;
        }
        if (tile_type == MOUNTAIN){
            //too many mountains create impassable terrain
            if(neighbour == MOUNTAIN) score -= 1;
        }

    });
    
    return score;
}

document.addEventListener("click", placeCubeOnThis);