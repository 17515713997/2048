//animation2048.js

//定义一个animation功能

var _animation = {
	DURA : 100,//总时间
	STEPS : 25,//总步数
	moved : 0,//当前移动的步数
	timer : null,//保存当前的定时器
	tasks :[],//放入每次任务需要移动的元素及距离
	addTasks : function(divObj,currR,currC,tarR,tarC){
		//divObj 要移动的对象
		//currR  当前行
		//currC  当前列
		//tarR   目标行
		//tarC   目标列
		var topDist = (tarR - currR) * (98 + 12);
		//	 (目标的下标 - 当前的下标) * (宽度 + 1个空隙)
		var leftDist = (tarC - currC) * (98 + 12);
		var topStep = topDist/this.STEPS;//距离/步数 = 步长
		var leftStep = leftDist/this.STEPS;//距离/步数 = 步长
		console.log(topStep + ":" + leftStep);
		this.tasks.push(
			{obj:divObj,top:topStep,left:leftStep}
			//把div对象及步长以对象的形式，装到this.tasks中
		);
		console.log(this.tasks);
		//this.move();
	},
	move : function(){
		//循环遍历this.tasks里面的每一个对象，取出每个要移动的元素。
		for(var i = 0;i < this.tasks.length;i++){
			var task = this.tasks[i];//取出每一个div对象的数值集合
			var _style = getComputedStyle(task.obj);//获取每一个准备移动div元素的样式			
			console.log(_style.left);//获取当前要移动元素的坐标
			console.log(_style.top);//获取当前要移动元素的坐标			
			//移动
			//div的left = 当前的left值 + 步长
			task.obj.style.left = parseFloat(_style.left) + task.left + "px";
			task.obj.style.top = parseFloat(_style.top) + task.top + "px";
		}
		//设定move() 停止的条件
		if(--this.moved == 0){
			clearInterval(this.timer);
			//先循环遍历this.tasks 里面的每一个对象，并把对象属性(left.top)设置为""
			for(var i = 0;i< this.tasks.length;i++){
				var task = this.tasks[i];
				task.obj.style.top ="";
				task.obj.style.left ="";
			}
			//当前移动事件停止之后，要把数组清空
			this.tasks = [];
			//在移动事件停止之后，在生成随机数
			Game.randomNum();
			//把游戏的运行状态该为运行中
			Game.state = Game.RUNNING;
			//把新生成的随机数，渲染到页面中
			Game.upDataView();
		}
	},
	start : function(){
		//把游戏的状态改为动画播放中
		Game.state = Game.PLAYING;
		var self = this;//留住this ---_animation
		//设置当前移动的步数
		self.moved = self.STEPS;
		self.timer = setInterval(function(){
			self.move();
		},self.DURA/self.STEPS);
	}
}


















