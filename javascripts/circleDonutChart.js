/*
	circleDonutChart - (c) by Valerio Neri - 2013
	Version 1.93
	
	Usage:
	create a new chart:
		var newChart = new circleDonutChart(targetElementID);
		newChart.draw(options);

	clear / reset the chart:
		newChart.clear();
		
	delete the chart:
		newChart.delete();
		
	reload the chart:
		newChart.reload();
		
	options = {...}
	
	Possible options:
	
	start					starting value, ignored if chart already has a status
	end			 			ending value [mandatory]
	outerCircleColor		ovverrides the color of outer circle
	innerCircleColor		ovverrides the color of inner circle
	textColor				ovverrides the color of text
	animationSpeed = 0		no Animation
	animationSpeed = 1		normal speed
	scaling					scaling value, 1 for normal
	size					in px, the size of the chart
	getValue()				gets actual value
	setValue()				sets a value without animation
	unitText				sets the unit for the shown number
	maxValue				optional parameter that overrides 100%  with a maximal Value
	titleText				A title for the Chart (<12 chars for inner-bottom and inner-top readibility)
	titlePosition			where the title gets displayed, ["outer-bottom" | "outer-top" | "inner-bottom" | "inner-top"]
	titleColor				ovverrides the standard colors for the title
			
*/
			

var circleDonutChart = function(chartElementID){
	var centerx = 0;
	var centery = 0;
	var sizex = 0;
	var sizey = 0;
	var scaling = 0;
	var radius = 0;
	var startx = 0;
	var starty = 0;
	var endx = 0;
	var endy = 0;
	var animationSpeed = 1;
	var firedAnimation = false;
	var innerCircleColor = "#666666";
	var outerCircleColor = "#aade87";
	var textColor = "#ffffff";
	var unitText = "%";
	var innerCircleDOM = undefined;
	var outerCircleDOM = undefined;
	var tNumberDOM = undefined;
	var textDOM = undefined;
	var tUnitDOM = undefined;
	var titleDOM = undefined;
	var svg = undefined;
	var chartID = chartElementID;
	var chart = undefined;
	var lastValue = -1;
	var startValue = 0;
	var endValue = 0;
	var loaded = false;
	var that=this;
	var maxValue = 100;
	var titleText ="";
	var titlePosition = "top";
	var titleColor = "#ffffff";
	var textShift = 20; // this is required for moving the chart
	var textScaling = 1;

	// update: unfortunately in some cases the event is fired, and nobody tells us - that's why we just wait for the element to be available
	// wait for the DOM, otherwise you won't find the reference to elements
	//document.addEventListener("DOMContentLoaded", onLoad);
	onLoad();
	
	// this is used for refreshing the animation
	(function() {
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	})();

	this.getValue = function(){
		if (lastValue>-1)
			return Math.round(lastValue/360*maxValue*10)/10;
		else
			return 0;
	}
	
	this.setValue = function(value){
		that.draw({end:value, animationSpeed:0});
	}
	
	function setAnimate(fromD, toD, duration){
		dAct = fromD;
		// determine direction (up or down)
		if (dAct<toD)
			doIt(dAct, toD, duration, "up");
		else
			doIt(dAct, toD, duration, "down");
	}	

	// this function is used for the animation - it uses an exponential acceleration
	function calculateAccValue(xx, m){
		var mxValue = m;
		var x=Math.round(xx);
		if (m==0){
			mxValue=1;
		}
		if (x==0){
			x=1;
		}
		if (Math.abs(x)>=mxValue){
			return mxValue;
		}else{
			//return ( Math.pow( (-2),( (-1*x) + (Math.log(maxValue)/Math.log(2)) ) ) + maxValue);
			var num1 = -2;
			var num2 = Math.round( ((-1*x)+(Math.log(mxValue)/Math.log(2))) );
			return Math.pow(num1 , num2 )+mxValue;
		}
	}

	function textSetter(DOM, text){
		// text scaling
		if ((text>=1000)&&(textScaling=1)){
			textScaling=1-((Math.floor( (Math.log(text)/Math.log(10))-2))/10)-0.1;
			tNumberDOM.setAttribute('font-size', 50*scaling*textScaling);
			tUnitDOM.setAttribute('font-size', 30*scaling*textScaling);
		} else{
			textScaling = 1;
			tNumberDOM.setAttribute('font-size', 50*scaling*textScaling);
			tUnitDOM.setAttribute('font-size', 30*scaling*textScaling);
		}	
		DOM.textContent = text;
	}
	
	function doIt(dAct, toD, duration, direction){
		var toString = "";
		// -0.0001 is used for preventing IE reach 360 and close the circle
		toString = getD(dAct-0.0001);
		outerCircleDOM.setAttribute('d',toString);
		
		textSetter(tNumberDOM, Math.round(dAct/360*maxValue*10)/10);
		
		//console.log('dAct '+dAct+ '   toD'+toD);
		// determine direction (up or down)
		if (direction=="up")
			dAct = dAct + 5.5;
		else
			dAct = dAct - 5.5;
			
		duration = duration - calculateAccValue(duration, 500);
		if (direction=="up"){
			if (dAct < toD){
				setTimeout(function(){
					// animate it according to refresh rate
					requestAnimationFrame(function(){
						doIt(dAct, toD, duration, direction);
					})
				},duration);
			} else {
				
				outerCircleDOM.setAttribute('d',getD((toD-0.0001)));
				textSetter(tNumberDOM, Math.round(toD/360*maxValue*10)/10);
			}
		} else {
			if (dAct >= toD){
				setTimeout(function(){
					// animate it according to refresh rate
					requestAnimationFrame(function(){
						doIt(dAct, toD, duration, direction);
					})
				},duration);
			} else {
				outerCircleDOM.setAttribute('d',getD(toD-0.0001));
				textSetter(tNumberDOM ,Math.round(toD/360*maxValue*10)/10);
			}
		}
		
	};

	// this function gives us the circle coordinates
	function getCoordinates(radius,offset,degrees){
		var radians =  degreesToRadians(degrees);
		var x = offset.x + radius * Math.cos(radians)
		var y = offset.y + radius * Math.sin(radians)
		return {x:x,y:y};
	};
	
	// small converstion beween degrees and radians
	function degreesToRadians(degrees){
		var radians = (degrees * Math.PI) / 180;
		return radians
	};

	// this function returns the "d" string for the path, according to the degrees
	function getD(degree){
		radius = 100*scaling;
		startx = centerx+radius;
		starty = centery;
		var coor = getCoordinates(radius, {x:startx,y:starty},degree);
		endx = coor.x;
		endy = coor.y;
		var largearc = 0;
		if (degree>180){
			largearc=1;
		} else {
			largearc=0;
		}
		// don't ask me how I did it folks
		d="M "+startx+" "+starty+" a "+radius+" "+radius+" 0 "+largearc+" 1 "+(endx-startx-radius)+" "+(endy-starty)+" L "+(centerx)+" "+(centery)+" Z";
		//console.log('GETd '+degree+ "    "+d);
		return d;
	}

	// this function checks, if an element is fully visible (according to the scrolling)
	function checkVisible(){
		if (firedAnimation){
			// animation has already fired, detach the event listeners
			document.removeEventListener("scroll", checkVisible, false);
			window.removeEventListener("resize", checkVisible, false);
			return;
		}
		var rect = chart.getBoundingClientRect();
		var top = window.pageYOffset || document.documentElement.scrollTop;
		var left = window.pageXOffset || document.documentElement.scrollLeft;
		if ((rect.top>=0)&&(rect.top+rect.height<window.innerHeight) && 
			(rect.left>=0)&&(rect.left+rect.width<window.innerWidth)){
			// this means that we fully see the chart
			// fire the animation (only once)
			firedAnimation = true;
			setAnimate(startValue, endValue, (500/animationSpeed));					
		}
	}
	
	var waitingLoad =0;
	
	function onLoad(){
		// get the container for the chart
		chart = document.getElementById(chartID);
		
		// if the container is not ready in the DOM, then retry
		// try for around 20secs, then throw an exception
		if (chart==null){
			
			// after 10 seconds, pause a little bit
			if ((waitingLoad > 10000)&&(waitingLoad<20000)){
				setTimeout(onLoad, 1000);
				waitingLoad = waitingLoad +1000;
				return;
			}
			if (waitingLoad > 20000){
				throw('circleDonutChart: onLoad() - The chart element "'+chartID+'" could not be loaded in the last 20 seconds');
			}
			setTimeout(onLoad, 500);
			waitingLoad = waitingLoad +500;
			return;
		}
		// create an svg object and all other things - thanks to Thoka
		svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		innerCircleDOM = document.createElementNS('http://www.w3.org/2000/svg','circle');
		outerCircleDOM = document.createElementNS('http://www.w3.org/2000/svg','path');
		textDOM = document.createElementNS('http://www.w3.org/2000/svg','text');
		tNumberDOM = document.createElementNS('http://www.w3.org/2000/svg','tspan');
		tUnitDOM = document.createElementNS('http://www.w3.org/2000/svg','tspan');
		titleDOM = document.createElementNS('http://www.w3.org/2000/svg','text');
		
		// append to the chart
		chart.appendChild(svg);
		svg.appendChild(outerCircleDOM);
		svg.appendChild(innerCircleDOM);
		svg.appendChild(textDOM);
		svg.appendChild(titleDOM);
		
		textDOM.appendChild(tNumberDOM);
		textDOM.appendChild(tUnitDOM);
		loaded = true;
	}
	
	this.reload = function(){
		if (!loaded)
			onLoad();
	}
	
	this.clear = function(){
		// reinitialize some parameters
		firedAnimation = false;
		animationSpeed = 1;
		maxValue = 100;
		unitText = "%";
		lastValue = -1;
		this.setValue(0);
	}
	
	this.delete = function(){
		// remove everything
		this.clear();
		textDOM.removeChild(tNumberDOM);
		textDOM.removeChild(tUnitDOM);
		svg.removeChild(textDOM);
		svg.removeChild(titleDOM);
		svg.removeChild(outerCircleDOM);
		svg.removeChild(innerCircleDOM);
		chart.removeChild(svg);
		loaded = false;
		// yes but we leave chart, because it was provided
	}
	
	this.draw = function(options){
		// check if main function has already loaded, if not, reiterate
		if (!loaded){
			setTimeout(function(){
				that.draw(options);
			}, 500);
			return;
		}

		// OPTION CHECK - contains the options
		// check if all options are set
		var oTester = [];
		oTester.options = typeof(options)!="undefined";
		
		if (! (oTester.options)){
			throw('circleDonutChart: draw() - Not enough parameters or no parameters set in object');
			return;
		}
		
		oTester.end = typeof(options.end)!="undefined";
		oTester.start = typeof(options.start)!="undefined";
		oTester.scaling = typeof(options.scaling)!="undefined";
		oTester.size = typeof(options.size)!="undefined";
		oTester.animationSpeed = typeof(options.animationSpeed)!="undefined";
		oTester.textColor = typeof(options.textColor)!="undefined";
		oTester.innerCircleColor = typeof(options.innerCircleColor)!="undefined";
		oTester.outerCircleColor = typeof(options.outerCircleColor)!="undefined";
		oTester.unitText = typeof(options.unitText)!="undefined";
		oTester.maxValue = typeof(options.maxValue)!="undefined";
		oTester.titleText = typeof(options.titleText)!="undefined";
		oTester.titleColor = typeof(options.titleColor)!="undefined";
		oTester.titlePosition = typeof(options.titlePosition)!="undefined";
		
		if (! (oTester.end)){
			throw('circleDonutChart: draw() - No "end" value specified');
			return;
		}
		
		// reinitialize some parameters
		firedAnimation = false;
		animationSpeed = 1;
		maxValue = 100;
		unitText = "%";
		textShift = 20;
		textScaling = 1;
		
		// if the values are not set, set the standard
		if (!oTester.size){
			options.size = 200;
		}
		
		if (!oTester.scaling){
			options.scaling = 1;
		}
		
		// if size ist not set, then take the options.scaling and the standard size of 200x200
		if (!oTester.size){
			svg.setAttribute('width', 200*options.scaling);
			svg.setAttribute('height', 200*options.scaling);
			options.size = 200*options.scaling;
		}
		// if scaling not set, then take the size anc calculate the options.scaling
		if (!oTester.scaling){
			svg.setAttribute('width', options.size);
			svg.setAttribute('height', options.size);
			if (svg.getAttribute('width')<svg.getAttribute('height')){
				options.scaling = svg.getAttribute('width') / 200;
			} else{
				options.scaling = svg.getAttribute('height') / 200;
			}
		}
		
		// set the colors, if set
		if (oTester.outerCircleColor){
			outerCircleColor = options.outerCircleColor;
		}
		if (oTester.innerCircleColor){
			innerCircleColor = options.innerCircleColor;
		}
		if (oTester.textColor){
			textColor = options.textColor;
		}
		
		// set the unitText, if set
		if (oTester.unitText){
			unitText = options.unitText;
		}
		
		// set the title, if set
		if (oTester.titleText){
			titleText = options.titleText;
		}
		if (oTester.titleColor){
			titleColor = options.titleColor;
		}
		if (oTester.titlePosition){
			titlePosition = options.titlePosition;
		}		
		
		
		// set the maxValue, if set
		if (oTester.maxValue){
			maxValue = options.maxValue;
		}

		// set the starting position, if set
		if (oTester.start){
			options.start = Math.round(parseFloat(options.start)*10)/10;
			if (options.start>maxValue)
				options.start = maxValue;
			if (options.start<0)
				options.start = 0;
			if (isNaN(options.start)){
				// not a number and not parseable, ignore
				options.start = 0;
				oTester.start = false;
			}
			startValue = options.start/maxValue*360;
		}
		
		options.end = Math.round(parseFloat(options.end)*10)/10;

		if (options.end>maxValue)
			options.end = maxValue;
		if (options.end<0)
			options.end = 0;
		
		if (isNaN(options.end)){
			// not a number and not parseable, ignore
			return;
		}
		
		options.end = options.end/maxValue*360;
		endValue = options.end;
		
		textShift = textShift*options.scaling;
		
		// set the size and the center
		sizex = options.size;
		sizey = options.size+2*textShift;
		centerx = sizex/2;
		centery = (sizey/2);
		scaling = options.scaling;
		
		// set animation speed (0 = no animation), standard is one
		if(oTester.animationSpeed){
			animationSpeed = options.animationSpeed;
		}
		
		
		
		// initialise with start position
		outerCircleDOM.setAttribute('d', getD(startValue));
		
		chart.style.width = sizex;
		chart.style.height = sizey;
		
		svg.setAttribute('height', sizey);
		svg.setAttribute('class', 'circleDonutChart');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('version', '1.1');

		innerCircleDOM.setAttribute('cx', centerx);
		innerCircleDOM.setAttribute('cy', centery);
		innerCircleDOM.setAttribute('r', 80*options.scaling);
		innerCircleDOM.setAttribute('stroke', 'none');
		innerCircleDOM.setAttribute('stroke-width', '2');
		innerCircleDOM.setAttribute('fill', innerCircleColor);

		outerCircleDOM.setAttribute('fill', outerCircleColor);
		outerCircleDOM.setAttribute('stroke', 'none');
		outerCircleDOM.setAttribute('stroke-width', '36');
		
		tNumberDOM.setAttribute('x', centerx);
		tNumberDOM.setAttribute('y', centery+Math.round(18.75*options.scaling));
		tNumberDOM.setAttribute('font-size', 50*options.scaling);
		tNumberDOM.setAttribute('fill', textColor);
		tNumberDOM.setAttribute('font-family', 'arial');
		tNumberDOM.setAttribute('font-weight', 'normal');
		tNumberDOM.setAttribute('text-anchor', 'middle');
		
		tUnitDOM.setAttribute('font-size', 30*options.scaling);
		tUnitDOM.textContent = unitText;
		tUnitDOM.setAttribute('fill', textColor);
		tUnitDOM.setAttribute('text-anchor', 'middle');
		tUnitDOM.setAttribute('font-family', 'arial');
		tUnitDOM.setAttribute('font-weight', 'normal');
		
		titleDOM.setAttribute('x', centerx);
		// set the position of the title
		switch(titlePosition){
			case "inner-bottom":
				if (!oTester.titleColor)
					titleColor = "#ffffff";
				titleDOM.setAttribute('y', centery+sizey/5+textShift/2);
				break;

				case "outer-bottom":
				if (!oTester.titleColor)
					titleColor = "#666666";
				
				titleDOM.setAttribute('y', sizey-textShift/2);
				break;

			case "inner-top":
				if (!oTester.titleColor)
					titleColor = "#ffffff";
				titleDOM.setAttribute('y', centery-sizey/5-textShift/2);
				break;

				default:
			case "outer-top":
				if (!oTester.titleColor)
					titleColor = "#666666";
				
				titleDOM.setAttribute('y', textShift/2);
				break;
		}
		
		titleDOM.setAttribute('font-size', 12*options.scaling);
		titleDOM.setAttribute('fill', titleColor);
		titleDOM.setAttribute('font-family', 'arial');
		titleDOM.setAttribute('font-weight', 'normal');
		titleDOM.setAttribute('text-anchor', 'middle');
		titleDOM.textContent = titleText;
		
		
		// if the animation has been chosen
		if (animationSpeed>0){
			// ignore start value if lastvalue is already set
			if (lastValue>-1){
				startValue = lastValue;
			}
			window.addEventListener("resize", checkVisible, false);
			document.addEventListener("scroll", checkVisible, false);
			tNumberDOM.textContent = Math.round(startValue/360*maxValue*10)/10;
			checkVisible();
		} else {
			// set the circle to the end position, without animation
			// the 0.0001 is for avoiding the circle to disappear, due to some browser
			outerCircleDOM.setAttribute('d', getD(options.end-0.0001));
			tNumberDOM.textContent = Math.round(options.end/360*maxValue*10)/10;
		}
		lastValue = endValue;
	}
}
