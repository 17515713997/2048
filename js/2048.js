var Game = {
	data:[],//存储所有单元格数据的二维数组
	RN:4,//RowNumber总行数
	CN:4,//ColNumber总列数
	//获取背景16个div
	score:0,//游戏得分
	state:1,//保存游戏状态，运行中，游戏结束
	RUNNING:1,//运行中
	GAMEOVER:0,//游戏结束
	PLAYING : 2,//动画播放中
	getGridHTML:function(){
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="d'+arr.join('" class="grid"></div><div id="d')+'" class="grid"></div>';
		/*此处应该返回16个div.grid*/;
	},
	//获取前景16个div
	getCellHTML:function(){
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
		/*此处应该返回16个div.cell*/;
	},
	
	start:function(){//游戏开始
		var oBox = document.querySelector("#box");
		oBox.innerHTML = this.getGridHTML()+this.getCellHTML();
		
		this.data = [];//在游戏开始的时候，要清空以前的存储数据
		//循环遍历行数 i从0开始 到RN-1结束 
		for(var i = 0;i < this.RN;i++){
			//在对应的行数位置添加[]；
			this.data[i] = [];
			//循环遍历列，
			for(var j = 0 ; j <this.CN ; j++){
				this.data[i][j] = 0;
			}
			//在对应的列位置 添加0
		}
		this.score = 0;//在开始游戏时，分数重置为0
		this.state = this.RUNNING;//重置游戏运行状态为运行中
		var oZheZhao = document.querySelector(".zhezhao");
		oZheZhao.style.display = "none";
	
		/*随机生成2个数，添加到页面*/
		this.randomNum();
		this.randomNum();
		/*在控制台中输出data数组的数据*/
		
		//console.log(this.data.join("\n"));
		//console.log(this.getGridHTML());
		//console.log(this.getCellHTML());
		this.upDataView();
	},
	randomNum : function(){
		if(!this.isFull()){//如果16个格子不满的情况下，追加2或者4
			for(;;){
				//在0~RN-1之间生成一个行下标，存到r中
				var r = Math.round(Math.random()*(this.RN-1));
				//console.log(r);
				//在0~CN-1之间生成一个列下标，存到c中
				var c = Math.round(Math.random()*(this.CN-1));
				//console.log(c);
				//如果data中r行c列等于0
				if(this.data[r][c] == 0){
					//生成一个0~1之间的随机数数，如果>0.5就在r行c列中放入4
					//否则放入2
					this.data[r][c] = Math.random()>0.5?4:2;
					//退出循环
					break;
				}		
			}
		}
	},
	isFull:function(){
		//遍历data数组中的每一个值，
		for(var r = 0 ; r <this.RN ;r++){
			for(var c = 0 ; c < this.CN ; c++){
				//如果取出的值 == 0；
				if(this.data[r][c] == 0){
					//则返回 false 
					return false;
				}	
			}	
		}
		//遍历结束都没有返回值的话，说明 data中没有0的存在，则代表格子满了
			//返回 ture	
		return true;
	},
	moveLeft:function(){//键盘左移事件，左移所有行内的值
		//保留移动之前 数组的值
		var _before = this.data.toString();
		for(var r = 0 ; r <this.RN; r++){
			this.moveLeftInRow(r);
		}
		//保留移动之后 数组的值
		var _after = this.data.toString();
		//如果移动前和移动后不一样，，则创建新的随机数
		if(_before != _after){
			//在刷新页面之前需要在里面继续添加一个随机数
			//this.randomNum();
			//this.upDataView();
			_animation.start();
		}
	},
	moveLeftInRow:function(r){//左移一行,传入行的行号r
		for(var c = 0; c <this.CN-1; c++){
			//获取第二列的值？
			var nextC = this.getLeftInRow(r,c);
			//console.log(nextC);
			if(nextC == -1){
				break;//退出循环
			}else{
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[r][nextC];
					this.data[r][nextC] = 0;
					var div = document.querySelector("#c"+r+nextC);
					_animation.addTasks(div,r,nextC,r,c);
					c--;
				}else if(this.data[r][c] == this.data[r][nextC]){
					this.data[r][c]*=2;
					this.score += this.data[r][c];
					this.data[r][nextC] = 0;
					var div = document.querySelector("#c"+r+nextC);
					_animation.addTasks(div,r,nextC,r,c);
				}
			}
			//this.upDataView();提升到在this.moveLeft()中书写;
		}
	},
	getLeftInRow:function(r,c){//接收r和c，找r行c列位置之后，不为0的下一个位置
		for(var nextC = c + 1; nextC < this.CN; nextC++){
			if(this.data[r][nextC] != 0){
				return nextC;// 1或者2或者3
			}
		}//循环停止之前都没有返回的话，说明this.data[r][nextC]取到的值都是0；
		return -1;
	},
	
	
	
	
	
	moveRight:function(){
		var _before = this.data.toString();
		for(var r = 0 ; r <this.RN; r++){
			this.moveRightInRow(r);
		}
		var _after = this.data.toString();
		if(_before != _after){
//			this.randomNum();
//			this.upDataView();
			_animation.start();
		}
	},
	moveRightInRow:function(r){
		for(var c = this.CN-1; c > 0; c--){
			var prevc = this.getRightInRow(r,c);
			console.log(prevc);
			if(prevc == -1){
				break;
			}else{
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[r][prevc];
					this.data[r][prevc] = 0;
					var div = document.querySelector("#c"+r+prevc);
					_animation.addTasks(div,r,prevc,r,c);
					c++;
				}else if(this.data[r][c] == this.data[r][prevc]){
					this.data[r][c]*=2;
					this.score += this.data[r][c];
					this.data[r][prevc] = 0;
					var div = document.querySelector("#c"+r+prevc);
					_animation.addTasks(div,r,prevc,r,c);
				}
			}
		}
	},
	getRightInRow:function(r,c){
		for(var prevc = c - 1; prevc >=0 ; prevc--){
			if(this.data[r][prevc] != 0){
				return prevc;
			}
		}
		return -1;
	},
	

	
	
	moveTop:function(){
		var _before = this.data.toString();
		for(var c = 0 ; c <this.CN; c++){
			this.moveTopInCol(c);
		}
		var _after = this.data.toString();
		if(_before != _after){
			//this.randomNum();
			//this.upDataView();
			_animation.start();
		}
	},
	moveTopInCol:function(c){
		for(var r = 0; r < this.RN-1; r++){
			var top = this.getNextInCol(r, c);
			//console.log(top);
			if(top == -1){
				break;
			}else{
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[top][c];
					this.data[top][c] = 0;
					var div = document.querySelector("#c"+top+c);
					_animation.addTasks(div,top,c,r,c);
					r--;
				}else if(this.data[r][c] == this.data[top][c]){
					this.data[r][c]*=2;
					this.score += this.data[r][c];
					this.data[top][c] = 0;
					var div = document.querySelector("#c"+top+c);
					_animation.addTasks(div,top,c,r,c);
				}
			}
		}
	},
	getNextInCol:function(r,c){
		for(var top = r + 1; top < this.RN ; top++){
			if(this.data[top][c] != 0){
				return top;
			}
		}
		return -1;
	},
	
	

	
	moveBottom:function(){
		var _before = this.data.toString();
		for(var c = 0 ; c <this.CN; c++){
			this.moveBottomInCol(c);
		}
		var _after = this.data.toString();
		if(_before != _after){
			//this.randomNum();
			//this.upDataView();
			_animation.start();
		}
	},
	moveBottomInCol:function(c){
		for(var r = this.RN-1; r > 0; r--){
			var Bottom = this.getPrevInCol(r,c);
			if(Bottom == -1){
				break;
			}else{
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[Bottom][c];
					this.data[Bottom][c] = 0;
					var div = document.querySelector("#c"+Bottom+c);
					_animation.addTasks(div,Bottom,c,r,c);
					r++;
				}else if(this.data[r][c] == this.data[Bottom][c]){
					this.data[r][c]*=2;
					this.score += this.data[r][c];
					this.data[Bottom][c] = 0;
					var div = document.querySelector("#c"+Bottom+c);
					_animation.addTasks(div,Bottom,c,r,c);
				}
			}
		}
	},
	getPrevInCol:function(r,c){
		for(var Bottom = r - 1; Bottom >= 0; Bottom--){
			if(this.data[Bottom][c] != 0){
				return Bottom;
			}
		}
		return -1;
	},
	
	
	
	upDataView : function(){//在页面中输入data数组中的值
		for(var r = 0; r<this.RN ; r++){
			for(var c = 0 ; c<this.CN; c++){
				var divObj = document.querySelector("#c"+r+c);
				if(this.data[r][c] == "0"){
					divObj.innerHTML = "";
					divObj.className = "cell";
				}else{
					divObj.innerHTML = this.data[r][c];
					divObj.className = "cell n"+this.data[r][c];
				}
			}
		}
		var oSpan = document.querySelector("#score");
		oSpan.innerHTML = this.score;
		if(this.isGameOver()){//判定游戏结束
			this.state=this.GAMEOVER;
			var allSpan = document.querySelector("#allScore");
			allSpan.innerHTML = this.score;
			var oZheZhao = document.querySelector(".zhezhao");
			oZheZhao.style.display = "block";
		}
	},
	isGameOver:function(){
		for(var r = 0;r < this.RN;r++){
			for(var c = 0; c < this.CN;c++){
				if(this.data[r][c] == 0){
					return false;
				}else if(c < this.RN-1  && this.data[r][c] == this.data[r][c+1] ){
					return false;
				}else if(r < this.RN-1 && this.data[r][c] == this.data[r+1][c]  ){
					return false;
				}
			}
		}
		return true;
	}
}


window.onload = function(){
	Game.start();
	/*键盘事件*/
	document.onkeydown = function(ev){
		var ev = ev || window.event;
		//if(!Game.isGameOver()){
		if(Game.state == Game.RUNNING){
			//console.log(ev.keyCode);
			var code = ev.keyCode;
			//console.log(ev.keyCode);
			if(code == 37){
				Game.moveLeft();
			}else if(code == 38){
				//上移
				Game.moveTop();
			}else if(code == 39){
				//右移
				Game.moveRight();
			}else if(code == 40){
				//下移
				Game.moveBottom();
			}
		}
	}
}





  

//var a = 10;
//var a = 100;
//let b = 10;
//b = 20;//不会出错
////let b = 20;//报错。b已经存在
//const C = 10;//常量在定义的时候，一定要使用大写名称定义
////const常量(不可更改的变量,也不能从新定义)
////c = 30;//报错。c已经存在，不能改变值
//console.log(a);
//console.log(b);
//console.log(c);