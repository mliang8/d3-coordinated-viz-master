//Mengyu Liang
// lab2
//This visualization tool, including a choropleth map and a dynamic bar graph, dispalys a set of five 
	//important measurements of the economic and sociological conditions in United States inthe year of 2010. 
	//These measurements or variables are the percentage of unemployed population by state, the percentage of 
	//college by state, the percentage of population in poverty by state, the percenatge of foreign-born population 
	//and the percentage of higntech employment by state. You could select different variable to visualize on map and 
	//compare the exacteasurements across state on bar graph. This tool ultimately reveals some possiable correlations 
	//existing among these variables in each state, such as the correlation between the state with high percentage of 
	//college gradute and the percentage of high-technology employment.

//wrap everything in a self-executing anonymous function to move to local scope
(function(){

	//psudo global variables 
	//store all the variables for data join to an array
	var attrArray =["Percentage_unemployment_population(2010)","Percentage_college_graduate(2010)","Percentage_poverty_population(2010)","Percentage_foreignborn_population(2010)","Percentage_hightechnology_employment(2010)"];
	var expressed = attrArray[0]; //initial attribute

	//chart frame dimensions in the global scale
	var chartWidth = window.innerWidth * 0.42,
		chartHeight=500,
		leftPadding=25,
		rightPadding=5,
		topBottomPadding=5,
		chartInnerWidth=chartWidth-leftPadding-rightPadding,
		chartInnerHeight=chartHeight-2*topBottomPadding,
		translate="translate("+leftPadding+","+topBottomPadding+")";

	//craete a scale to size bars proportionally to frame, also including the range and omain of the 
			//attribute value for creating incremnets
	var yScale=d3.scaleLinear()
		.range([480,10])
		.domain([0,40]);

	//start to execute the following codes when window loads
	window.onload=setMap();

	//funciton to set up a new container including the page title and the introduction text
	function setTitle(){
		//creating a new container by id before the container containing the graphics
		var titleText=d3.select("#container2")
			.append("svg")
			.attr("class","title")
			.attr("width",1440)
			.attr("height",200)
			.style("background","#d6eaf8");

		//append a rectangle in the svg
		var titleBackground= titleText.append("rect")
			.attr("class","titleBackground")
			.attr("width",1440)
			.attr("height",200)
			.attr("transform",translate);

		//append text to the rectangle
		var  pageTitle =titleText.append ("text")
			.attr("x", 80)
			.attr("y", 50)
			.attr("class","pageTitle")
			.text ("Visualization of Five Socioeconomic Factors in 2010 by State");

		//the following vaaribales each append a line of text with the tspan element into the the previous rectangle created
		var intro=titleText.append("text")
			.attr("x",80)
			.attr("y",93)
			.attr("class","intro")
			.text("This visualization tool, including a choropleth map and a dynamic bar graph, dispalys a set of five important measurements to depict the economic and sociological conditions in the US"); 
				//in United States in the year of 2010. These measurements or variables are the percentage of unemployed population by state, the percentage of college graduate by state, the percentage of population in poverty by state, the percenatge of foreign-born population and the percentage of higntech employment by state. You could select different variable to visualize on map and compare the exact measurements across state on bar graph. This tool ultimately reveals some possiablecorrelations existing among these variables in each state, such as the correlation between the state with high percentage of college gradute and the percentage of hightechnology");
	
		var intro1=intro.append("tspan")
			.attr("class","intro1")
			.attr("x",80)
			.attr("y",118)
			.text("in the year of 2010. These measurements or variables are the percentage of unemployed population by state, the percentage of college gradutaes by state, the poverty rate");

		var intro2=intro.append("tspan")
			.attr("class","intro2")
			.attr("x",80)
			.attr("y",143)
			.text("by state, the percenatge of foreign-born population and the percentage of higntech employment by state. You could select different variable to visualize on map and compare the exact");
	
		var intro3=intro.append("tspan")
			.attr("class","intro3")
			.attr("x",80)
			.attr("y",168)
			.text("easurements across state on bar graph. This tool ultimately reveals some possiable correlations existing among these variables in each state, such as the state with higher percentage");
	
		var intro4=intro.append("tspan")
			.attr("class","intro4")
			.attr("x",80)
			.attr("y",193)
			.text("of college gradutes tend to have higher percentage of high-technology employment, however, these are not causal relations.");
	};

	//set up choropleth map with a function 
	function setMap(){
		//set the map frame dimension
		var width=window.innerWidth*0.54,
			height=500;

		//append the map bloack to a svg container 
		var map=d3.select("#container")
			.append("svg")
			.attr("class","map")
			.attr("width",width)
			.attr("height",height)
			.style("background","#e8eff4");

		//create a projection for the map using the US. centric composite projection to also
			//include Hawaii and Alaska for the purpose of cretaing a choropleth map later
		var projection=d3.geoAlbersUsa()
			//this projection does not need to take in the following parameters
			//.center([0,39])
			//.rotate([-2,0,0])
			//.parallels([43,62])
			//.scale([2500])*/
			.translate([width/2,height/2]);

		//create a path generator and pass in the projection from the projection operator  
		var path=d3.geoPath()
			.projection(projection);

		//use d3.queue to load in data from different files at the same time
		d3.queue()
	        .defer(d3.csv, "data/stateData.csv") //load attribute data from the csv file
	        .defer(d3.json, "data/country.topojson") //load the North America background spatial data
	        .defer(d3.json, "data/usState.topojson") //load choropleth spatial data of the US states
	        .await(callback); //fires after all the data is loaded and sends the data to the callback function 

	    //a callback function with the loaded data from above 
		function callback(error, csvData, countries, state){
			//console.log(error); //if there is any error
			//console.log(csvData); //attribute data
			//console.log(countries);
			//console.log(state);

			//translate the topojson data back to geojson data within DOM with the obejcts within the data that we want to convert
			//var northAmerica=topojson.feature(countries,countries.objects.ne_50m_admin_0_countries),
			var	usStates=topojson.feature(state,state.objects.ne_50m_admin_1_states_provinces_lakes).features;

			//examine the resulting geojson
			//console.log(usStates);

			//join csv data to geojson enumeration units
			usStates=joinData(usStates,csvData);

			//create the color scale
			var colorScale=makeColorScale(csvData);

			//call the function to set up the page title and the into text
			setTitle();

			//add enumeration units to the map
			setEnumerationUnits(usStates, map, path, colorScale);

			//set coordinated visualization to the map
			setChart(csvData,colorScale);

			sourceInfo();

			//create a dropdown menu for attribute selection
			createDropdown(csvData);

		};

	};

	//this function joins the csv attribute data to the enumeration units in geojson based on the 
		//common filed of code_local through loops
	function joinData(usStates,csvData){
		//loop through the csv file to assign each set of csv attribute to geojson regions
		for (var i=0; i<csvData.length; i++){
			var csvRegion= csvData[i]; //access the current indexed region
			var csvKey=csvRegion.code_local;//the csv primary key 

			//loop through the geojson regions to find the correct regions 
			for (var a=0; a<usStates.length;a++){
				var geojsonProps=usStates[a].properties;//the current indexed region geojson properties
				var geojsonKey=geojsonProps.code_local;//the geojson primary key 

				//when the csv primary key matches the geojson primary key, transfer the csv data to geojson objects' properties
				if (geojsonKey==csvKey){
					//assign all attributes and values 
					attrArray.forEach(function(attr){
						var val=parseFloat(csvRegion[attr]); //get all the csv attribute values
							geojsonProps[attr]=val;//assign the attribute and values to geojson properties
						//console.log(geojsonProps[attr]);

					});
				};
			};
		};
		//returning the enumeration units with attrbite values joined
		return usStates;
	};
		
	//this function 
	function setEnumerationUnits(usStates,map, path, colorScale){
		//add each state separately as path onto the map
		var regions=map.selectAll(".state ")
			.data(usStates)
			.enter()
			.append("path")
			.attr("class",function(d){
				//assign a unique class name based on the local code of each state
				console.log(d.properties);
				return "state "+d.properties.code_local;
			})
			//draw each state with the path generator
			.attr("d",path)
			//add styles to color in the enumeration units by calling the choropleth funciton
				//with the attribute values and the colorScale later defined
			.style("fill", function(d){
				return choropleth(d.properties, colorScale);
			})
			.on("mouseover", function(d){
            	highlight(d.properties);
        	})
        	.on("mouseout", function(d){
            	dehighlight(d.properties);
        	})
        	.on("mousemove",moveLabel);

        //this appends a desc elemnt to attach the original styles of the enumeration units for dehighlighting
        var desc = regions.append("desc")
        	.text('{"stroke": "#e8eff4", "stroke-width": "1px"}');
	};

	//function to create color scale generator 
	function makeColorScale(csvData){
		var colorClasses=[
			"#ffffb2",
			"#fecc5c",
			"#fb8d3c",
			"#f03b20",
			"#bd0026"

		];
		//create color scale generator
		var colorScale=d3.scaleThreshold()
			.range(colorClasses);

		//build arrary of all values of the expressed attribute
		var domainArray= [];
		for (var i=0; i<csvData.length; i++){
			var val=parseFloat(csvData[i][expressed]);
			domainArray.push(val);
		};

		//cluster data using ckmeans clustering algorithm to create natural breaks
		var clusters=ss.ckmeans(domainArray,5);

		//reset domain arrary to cluster minimums
		domainArray=clusters.map(function(d){
			return d3.min(d);
		});

		//remove first value from domain arrary to create class breakpoints
		domainArray.shift();

		//assign array of last 4 cluster minimyms as domain
		colorScale.domain(domainArray);
		// return the varibale colorScale for easier referencing
		return colorScale;
	};

	//function to test for data value and return color
	function choropleth(props, colorScale){
		console.log(colorScale);
		//make sure attribute value is a number
		var val=parseFloat(props[expressed]);
		//if attribute value exists, assign a color; otherwise gray
		if (typeof val=='number' &&!isNaN(val)){
			return colorScale(val);
		} else {
			return "none";
		};
	};

	/*function setLegend(colorScale){
		console.log(colorScale);

		var legend=d3.select("#container")
			.append("rect")
			.attr("class","legend")
			.style("background","white");
		
		for (var i=0; i<5; i++){
			var key=legend.append("rect")
				.attr("class","box")
				.attr("x",730)
				.attr("y",function(d){
					return i*(200/5);
				})
				.attr("width",45)
				.attr("height",35)
				.style("fill", function(d){
					return colorScale;
				});
		};

	};*/

	//function to craete coordinate bar chart
	function setChart(csvData,colorScale){

		//create a second svg elemnt to hold the bar chart
		var chart = d3.select("#container")
			.append("svg")
			.attr("width",chartWidth)
			.attr("height",chartHeight)
			.attr("class","chart")
			.style("background","#e8eff4");

		//craete a rectangle for chart background fill
		var chartBackground= chart.append("rect")
			.attr("class","chartBackground")
			.attr("y",20)
			.attr("width",chartInnerWidth)
			.attr("height",chartInnerHeight-20)
			.attr("transform",translate);


		//set bars for each state
		var bars = chart.selectAll(".bar")
	        .data(csvData)
	        .enter()
	        .append("rect")

	        //this function sorts the bars based on the max to min order of the attribute values
	        .sort(function(a, b){
	            return b[expressed]-a[expressed]
	        })
	        //associte the bars to the commong field and thus could be correcty referenced
	        .attr("class", function(d){

	            return "bar " +  d.code_local;
	        })
	        /*.attr("name",function(d){
	        	return d.state;
	        })*/
	        //devide the innner chart frame width evenly accoridng to the number of attributes 
	        .attr("width", chartInnerWidth / csvData.length - 1)
	        //these are a series of listening events taht listen to the mouse actions and response by calling corresponidng fucntions
	        .on("mouseover", highlight)
	        .on("mouseout", dehighlight)
	        .on("mousemove",moveLabel);


	    //this appends a desc elemnt to attach the original styles of the enumeration units for dehighlighting
	    var desc = bars.append("desc")
        	.text('{"stroke": "none", "stroke-width": "0px"}');

		//craete text elemnt for the chart title
		var  chartTitle =chart.append ("text")
			.attr("x", 120)
			.attr("y", 30)
			.attr("class","chartTitle")
			//this text string is not yet dynamic, could be dynamic with some ajustment by 
				//slciing and indexing the strings
			.text ("Unemployment rate of 16 years or older in 2010 by state");

		//create vertical axis generator
		var yAxis = d3.axisLeft()
        	.scale(yScale);

	    //place axis by calling the previosuly defined axis generator
	    var axis = chart.append("g")
	        .attr("class", "axis")
	        .attr("transform", translate)
	        .call(yAxis);

	    //create frame for chart border
	    var chartFrame = chart.append("rect")
	        .attr("class", "chartFrame")
	        .attr("width", chartInnerWidth)
	        .attr("height", chartInnerHeight)
	        .attr("transform", translate);

	    //set bar positions, heights, and colors
    	updateChart(bars, csvData.length, colorScale);

	};
	//function to create a new svg at the bottom to include some text explaining the data sources
	function sourceInfo(){

		//create a second svg elemnt to hold the bar chart
		var bottom = d3.select("#container")
			.append("svg")
			.attr("width",1440)
			.attr("height",200)
			.attr("class","source")
			.style("background","#d6eaf8");


		var  title1 =bottom.append ("text")
			.attr("x", 80)
			.attr("y", 50)
			.attr("class","title1")
			.text ("Data sources");

		var text1=bottom.append ("text")
			.attr("x", 80)
			.attr("y", 80)
			.attr("class","text1")
			.text ("- Percenatge of college gradutes by state data is complied from the US Department of Education ");

		var text2=bottom.append ("text")
			.attr("x", 80)
			.attr("y", 110)
			.attr("class","text2")
			.text("- Percenatge of population in poverty by state data and the percentage of foreign-born population by state data are complied from the US Census Bureau");
	
		var text3=bottom.append ("text")
			.attr("x", 80)
			.attr("y", 130)
			.attr("class","text3")
			.text(  " (population in poverty are people whose income fell below the poverty guidline of the the year; this guideline is also set by the Federal Register)");

		var text4=bottom.append ("text")
			.attr("x", 80)
			.attr("y", 160)
			.attr("class","text4")
			.text("- Percenatge of hign-technology employment data by state is compiled from the National Science Fundation ");

		var text5=bottom.append ("text")
			.attr("x", 80)
			.attr("y", 190)
			.attr("class","text5")
			.text("- Percentage of unemployment (unemployment rate of age 16 or above) by state is compiled from the Bureau of Labor Statistics website.")
	};
	//function to create a dropdown menu for attribute selection
	function createDropdown(csvData){
	    //add select element
	    var dropdown = d3.select("#container")
	        .append("select")
	        .attr("class", "dropdown")
	        .on("change", function(){
            	changeAttribute(this.value, csvData);

        	});
       
	    //add initial option for the drop down manu
	    var titleOption = dropdown.append("option")
	        .attr("class", "titleOption")
	        .attr("disabled", "true")
	        .text("Select Attribute");

	    //add attribute name options
	    var attrOptions = dropdown.selectAll("attrOptions")
	        .data(attrArray)
	        .enter()
	        .append("option")
	        .attr("value", function(d){ return d })
	        .text(function(d){ return d });

	    console.log(attrOptions);
	};

	//dropdown change listener handler
	function changeAttribute(attribute, csvData){
		console.log(csvData);
	    //change the expressed attribute
	    expressed = attribute;
	    console.log(attribute);
	    //recreate the color scale
	    var colorScale = makeColorScale(csvData);

	    //recolor enumeration units
	    var regions = d3.selectAll(".state")
	    	.transition()
	        .duration(1000)
		    .style("fill", function(d){
		        return choropleth(d.properties, colorScale)
		    });
	    console.log(regions);

	    //re-sort, resize, and recolor bars
	    var bars = d3.selectAll(".bar")
	        //re-sort bars
	        .sort(function(a, b){
	            return b[expressed] - a[expressed];
	        })
	        .transition() 
	        //add animation
		    .delay(function(d, i){
		        return i * 20
		    })
		    //add a delay effect
		    .duration(500);

		//call the function to update the chart everytime the attribute changes with a new attribute selection
	    updateChart(bars, csvData.length, colorScale);
	    //console.log(colorScale);

	};

	//function to position, size, and color bars in chart
	function updateChart(bars, n, colorScale){

	    //position bars
	    //define the x locations of the bars and add the left padding to shift the bars to the left
        bars.attr("x", function(d, i){

            return i * (chartInnerWidth / n) + leftPadding;
        	})
	        //define the height of the bars accoridng to the attribute value
	        .attr("height", function(d, i){
	            return 480 - yScale(parseFloat(d[expressed]));
	        })
	        //include the top and bottom paddinsg when claculating the y values of the bars
	        .attr("y", function(d, i){
	            return yScale(parseFloat(d[expressed])) + topBottomPadding;
	        })
	        //colroing the bars by calling the choropleth fucntion with attribute values and colorscale
	        .style("fill", function(d){
	        	console.log(choropleth(d, colorScale));
	            return choropleth(d, colorScale);
	        });
        //at the bottom of updateChart()...add text to chart title
    	var chartTitle = d3.select(".chartTitle")
        	.text("Percentage of " + expressed.split("_")[1] + " "+ expressed.split("_")[2].split("(")[0]+" in 2010");
	};

	//function to highlight enumeration units and bars
	function highlight(props){
		//console.log(props);
	    //change stroke
	    if (props.code_local.length==0){
	    	return false;
	    };
	    //select by the common field code_local to add the highlighting style
	    var selected = d3.selectAll("." + props.code_local)
	        .style("stroke", "black")
	        .style("stroke-width", "4");
	    //call the labeling function to retrieve when higlighting
	    setLabel(props);
	};

	//function to reset the element style on mouseout
	function dehighlight(props){
		//console.log(props.code_local.length);
		if (props.code_local.length==0){
	    	return false;
	    };
	    //creating a selected block that restyles the stroke and stroke-width styles
	    var selected = d3.selectAll("." + props.code_local)
	        .style("stroke", function(){
	        	//console.log(getStyle(this, "stroke"));
	            return getStyle(this, "stroke")
	        })
	        .style("stroke-width", function(){
	            return getStyle(this, "stroke-width")
	        });
	    //retrieve the information stored in the <desc> element for that style
	    function getStyle(element, styleName){
	    	//returning the text content
	        var styleText = d3.select(element)
	            .select("desc")
	            .text();
	        //create a JSON object and return the correct style property's value
	        var styleObject = JSON.parse(styleText);
	        return styleObject[styleName];
	    };
	    //below Example 2.4 line 21...remove info label
    	d3.select(".infolabel")
        	.remove();
	};

	//function to create dynamic label
	function setLabel(props){
		//label content
		var labelAttribute = "<h1>" + props[expressed] +
		    "</h1><b>" + "% of "+ expressed.split("_")[1] +" "+ expressed.split("_")[2].split("(")[0]+ "</b>";

		//create info label div
		var infolabel = d3.select("#container")
		    .append("div")
		    .attr("class", "infolabel")
		    .attr("id", props.code_local + "_label")
		    .html(labelAttribute);

		//this append a div to the infolabel group and add the class name and the properties names to label
		var regionName = infolabel.append("div")
		    .attr("class", "labelname")
		    .html(props.name);
		//console.log(props.name);
	};

	//function to move info label with mouse
	function moveLabel(props){

	    //if the selected area is null, do not selct
	    //console.log(d3.select(".infolabel").node());
	    if (d3.select(".infolabel").node()==null){
	    	return false;
	    };

	    //this usses selector to get the width of the labels
	    var labelWidth = d3.select(".infolabel")
	        .node()
	        .getBoundingClientRect()
	        .width;

	    //use coordinates of mousemove event to set label coordinates
	    var x1 = d3.event.clientX + 10,
	        y1 = d3.event.clientY - 75,
	        x2 = d3.event.clientX - labelWidth - 10,
	        y2 = d3.event.clientY + 25;

	    //horizontal label coordinate, testing for overflow
	    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 

	    //vertical label coordinate, testing for overflow
	    var y = d3.event.clientY < 500 ? y2 : y1; 

	   //select the inforlabel class and stylize them by adding pixels to posit
	    d3.select(".infolabel")
	        .style("left", x + "px")
	        .style("top", y + "px");
	};

})();

