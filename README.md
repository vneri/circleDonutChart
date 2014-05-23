circleDonutChart
================

A javascript library for a flexible flat donut chart

This library takes your parameters and displays a circle donut (in flat style). 
The displaying is performed by writing an SVG graphic into a provided DIV element.
Changing values of the circle leads to a smooth animation, that can also be triggered if the scrolling position
is fully showing the circle.

Library Usage
-------------

You can include the library into your project
´´´´<script type="text/javascript" src="circleDonutChart.js"></script>

and instatiate as many circles as you need.

´´´´var circle = new circleDonutChart('myChartTitle');

The 'myChartTitle' is the ID of the target element, into which the SVG will be created.

Drawing Options
---------------

There are several drawing options that can influence, how your chart is displayed.
	
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


License
-------
MIT
