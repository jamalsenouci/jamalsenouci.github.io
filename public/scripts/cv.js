'use strict';

var normalize = function (data){
		var format = d3.time.format('%Y-%m-%d');
		var parseDate = format.parse;
		var a = 0;
		data.forEach(function(d) {
			d.id = a++;
			d.from = parseDate(d.from);
			if (d.to === null){
				d.pto = new Date();
			}
			else
			{
				d.to = parseDate(d.to);
				d.pto = d.to;
			}
		});
	};
var calculateDiameter = function (data, x)
	{
		data.forEach(function(d) {
			d.diameter = x(d.pto) - x(d.from);
			if (d.to === null){
				d.diameter = d.diameter * 2;
			}
		});
		data.sort(function(a,b){
			return b.diameter - a.diameter;
		});
	};

var getPath = function (diameter, position)
	{
		var radius = diameter/2;
		var height = position * (100 + radius * 0.7);
		return 'M0,0 q '+radius+' '+height+' '+diameter+' 0 z';
	};
var showInfo = function (className)
{
	d3.selectAll('div.cv').transition().style('opacity', '0').style('z-index',0);
	d3.selectAll('div.'+className).transition().style('opacity', '1').style('z-index',9);
};


var drawPaths = function(graphContainer, data, className, position, x, color){
	graphContainer
		.selectAll('path.'+className)
		.data(data)
		.enter()
			.append('path')
			.classed(className, true)
		    .attr('fill',  function(d,i){
				return color(position * i);
			})
		    .attr('fill-opacity', 0.6)
		    .attr('d',function(d){ return getPath(d.diameter, position); })
		    .attr('transform', function(d) {
				return 'translate(' + [x(d.from),  0] + ')';
			})
			.on('mouseover', function(d){
				graphContainer.selectAll('path.item').transition();
				d3.select(this).transition()
						.attr('stroke-width', '2')
						.attr('fill-opacity', 1);
		        showInfo(d.class);
		    }).on('mouseout', function(){
					graphContainer.selectAll('path.item').transition();
					d3.select(this).transition()
						.attr('stroke-width', '1')
						.attr('fill-opacity', 0.6);
	                //lastTimeout = setTimeout(hideInfo,3000);
	            });
};

var data = [
[
        {
            'type':'Work',
            'institution':'Glan Ceirw Caravan Park',
            'class':'glanceirw',
            'title':'Web Developer',
            'from':'2011-06-01',
            'to':'2011-09-01',
            'description':'',
            'default_item':false
        },
				{
            'type':'Work',
            'institution':'Dunnhumby',
            'class':'dunnhumby',
            'title':'Product Manager',
            'from':'2016-08-01',
            'to':null,
            'description':'',
            'default_item':false
        },
        {
            'type':'Work',
            'institution':'Ohal Ltd',
            'class':'ohal',
            'title':'Senior Analyst',
            'from':'2012-10-01',
            'to':'2014-10-11',
            'description':'',
            'default_item':false
        },
        {
            'type':'Work',
            'institution':'Starcom MediaVest Group',
            'class':'starcom',
            'title':'Senior Data Scientist',
            'from':'2014-10-15',
            'to':'2015-03-31',
            'description':'',
            'default_item':true
        },
        {
            'type':'Work',
            'institution':'MediaCom',
            'class':'mediacom',
            'title':'Senior Analyst',
            'from':'2015-04-13',
            'to':'2016-08-01',
            'description':'',
            'default_item':true
        }
    ],
    [
        {
            'type':'Study',
            'institution':'University of York',
            'class':'york',
            'title':'Bachelors of Economics',
            'from':'2008-10-13',
            'to':'2011-07-10',
            'description':'',
            'default_item':false
        },
        {
            'type':'Study',
            'institution':'University of Warwick',
            'class':'warwick',
            'title':'Msc in Economics and International Financial Economics',
            'from':'2011-09-01',
            'to': '2013-03-01',
            'description':'',
            'default_item':false
        },
        {
            'type':'Study',
            'institution':'University of Essex',
            'class':'essex',
            'title':'Agent-based Modelling Course',
            'from':'2014-07-01',
            'to': '2014-07-10',
            'description':'',
            'default_item':false
        },
        {
            'type':'Study',
            'institution':'Stanford University',
            'class':'stanford',
            'title':'Mining of Massive Datasets and Machine Learning',
            'from':'2014-09-01',
            'to': '2014-12-12',
            'description':'',
            'default_item':false
        }
    ]
];

var init = function(startDate, endDate, categories=['work', 'study']){
	var viewBox = '0 0 960 500',
	aspectRatio = 'xMidYMid';
	var width = document.getElementById('cv-vis').offsetWidth - 20,
	height = 500;

	document.querySelector('#cv-vis').innerHTML='';
	var svg = d3.select('body')
		.select('#cv-vis')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', viewBox)
		.attr('preserveAspectRatio', aspectRatio);

	
	var x = d3.time.scale().domain([startDate, endDate]).range([0, 960]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.tickFormat(d3.time.format('%b %Y'));

	var graphContainer = svg
		.append('g')
		.attr('class', 'graph-container')
		.attr('transform', 'translate(' + [0,height /3] + ')');

	graphContainer.append('g')
			.attr('class', 'x axis')
			.call(xAxis);
	var multipliers = [-1, 1],
		colorscale = [d3.scale.category10(),d3.scale.category10()];
	if (categories.indexOf('work') > -1){
		calculateDiameter(data[0], x);
		drawPaths(graphContainer, data[0], categories[0], multipliers[0] , x, colorscale[0]);	
	}
	if (categories.indexOf('study') > -1){
		calculateDiameter(data[1], x);
		drawPaths(graphContainer, data[1], categories[1], multipliers[1] , x, colorscale[1]);	
	}
	
};


$( document ).ready(function(){
	var today = new Date();
	$.fn.datepicker.defaults.format = "dd/mm/yyyy";
	$('#start').datepicker('update', new Date(2008, 9, 13));
	$('#end').datepicker('setStartDate', new Date(2008, 9, 13));
	$.fn.datepicker.defaults.format = "dd/mm/yyyy";
	$('#end').datepicker('update', today);
	$('#end').datepicker('setEndDate', today);
	var startDate = $('#start').datepicker('getDate')
	var endDate = $('#end').datepicker('getDate')

	data.forEach(function(d,i) {
		normalize(d);
	});

	init(startDate, endDate);

	$('#start').datepicker().on('changeDate', function(e) {
		var endDate = $('#end').datepicker('getDate')
        init(e.date, endDate)
    });
    $('#end').datepicker().on('changeDate', function(e) {
    	var startDate = $('#start').datepicker('getDate')
        init(startDate, e.date)
    });
    var categories = ['work', 'study']
    $('#workbox').change(function() {
	    if(this.checked) {
	    	categories.push('work')
	    }
	    else{
	    	var index =  categories.indexOf('work')
	    	categories.splice(index, 1);
	    }
		var startDate = $('#start').datepicker('getDate')
		var endDate = $('#end').datepicker('getDate')
	    init(startDate, endDate, categories)
	});
	$('#studybox').change(function() {
	    if(this.checked) {
	    	categories.push('study')
	    }
	    else{
	    	var index =  categories.indexOf('study')
	    	categories.splice(index, 1);
	    }
		var startDate = $('#start').datepicker('getDate')
		var endDate = $('#end').datepicker('getDate')
	    init(startDate, endDate, categories)
	});
})


