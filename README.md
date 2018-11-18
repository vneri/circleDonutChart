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
```
<script type="text/javascript" src="circleDonutChart.js"></script>
```
and instatiate as many circles as you need.

```
var circle = new circleDonutChart('myChartTitle');
```
The 'myChartTitle' is the ID of the target element, into which the SVG will be created.

Provided Methods
----------------

The library provides the following methods for the chart object:
<table>
	<tr><td>draw</td><td>draws the chart based on the given options</td></tr>
	<tr><td>draw (after first draw)</td><td>omitting color options possible</td></tr>
	<tr><td>setValue</td><td>sets a value, without animating the circle</td></tr>
	<tr><td>getValue</td><td>returns the actual value</td></tr>
	<tr><td>delete</td><td>delete the chart object</td></tr>
	<tr><td>reload</td><td>reload the chart object and initialize with standard parameters</td></tr>

</table>

Drawing Options
---------------

The drawing options are passed as an object to the "draw" method.
```
circle.draw({end:90,start:0, maxValue:100, titlePosition:"outer-top", titleText:"Consumption", outerCircleColor:'#0085c8', innerCircleColor:'#909081', angleOfStart:0});
```

There are several drawing options that can influence, how your chart is displayed.
<table>
	<tr><td>start</td><td>starting value, ignored if chart already has a status</td></tr>
	<tr><td>end</td><td>ending value [mandatory]</td></tr>
	<tr><td>outerCircleColor</td><td>ovverrides the color of outer circle</td></tr>
	<tr><td>innerCircleColor</td><td>ovverrides the color of inner circle</td></tr>
	<tr><td>textColor</td><td>ovverrides the color of text</td></tr>
	<tr><td>animationSpeed = 0</td><td>no Animation</td></tr>
	<tr><td>animationSpeed = 1</td><td>normal speed</td></tr>
	<tr><td>scaling</td><td>scaling value, 1 for normal</td></tr>
	<tr><td>size</td><td>in px, the size of the chart</td></tr>
	<tr><td>getValue()</td><td>gets actual value</td></tr>
	<tr><td>setValue()</td><td>sets a value without animation</td></tr>
	<tr><td>unitText</td><td>sets the unit for the shown number</td></tr>
	<tr><td>maxValue</td><td>optional parameter that overrides 100%  with a maximal Value</td></tr>
	<tr><td>titleText</td><td>A title for the Chart (less than 12 chars for inner-bottom and inner-top readibility)</td></tr>
	<tr><td>titlePosition</td><td>where the title gets displayed, ["outer-bottom" | "outer-top" | "inner-bottom" | "inner-top"]</td></tr>
	<tr><td>titleColor</td><td>overrides the standard colors for the title</td></tr>
	<tr><td>angleOfStart</td><td>overrides the start of the circle. Standard is 90 degrees (3 o'clock)</td></tr>
</table>

Example
-------
See http://vneri.github.io/circleDonutChart/

License
-------
Copyright 2013-2014 by Valerio Neri
http://opensource.org/licenses/MIT
