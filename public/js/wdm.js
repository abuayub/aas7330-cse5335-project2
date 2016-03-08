$(document).ready(function(){
	$('#div1').hide();
	$('#visual').hide();
	
	var location = [];
	var driverVictory = {};
	var driver= []; 
	$("#getstats").click(function(){
		var dburl = "//cse5335-aas7330.herokuapp.com/db";

        	$.get(dburl, function(response){
        		//alert(response);
			$('#div1').show();
			var trHTML = '';
	        	$.each(response.results, function (i, item) {
				location.push(item.location);

				if(driverVictory[item.winner])
				{ 
					driverVictory[item.winner]=driverVictory[item.winner]+1;
				}
				else{
					driverVictory[item.winner] = 1;
					driver.push(item.winner);
				}	
        	    		trHTML += '<tr><td>' + item.race + '</td><td>' + item.gp + '</td><td>' + item.location + '</td><td>' + item.date + '</td><td>' + item.winner + '</td><td>' + item.team + '</td></tr>';
        		});
	        	$('#div1 table tbody').html(trHTML);
			$('#div1').show();
        	});
    	});

	$("#map").click(function(){
			console.log(location);
			$('#visual').show();
 			// Create a map object and specify the DOM element for display.
  			var map = new google.maps.Map(document.getElementById("mapdiv"), {
    				center: {lat: 0, lng: 0},
    				scrollwheel: false,
    				zoom: 1
  			});
			for (var x = 0; x < location.length; x++) {
	        	$.getJSON('//maps.googleapis.com/maps/api/geocode/json?address='+location[x]+'&sensor=false', null, function (data) {
        	 	   	var p = data.results[0].geometry.location;
            			var latlng = new google.maps.LatLng(p.lat, p.lng);
		    		new google.maps.Marker({
		        		position: latlng,
		        		map: map
	 	           	});

        		});
    			}

			var w = 250;
			var h = 250;
			var r = h/2;
			var color = d3.scale.category20c();
			var data =[];
			var driverper = "";
			$.each(driver, function(i,item)
			{
				data.push({label:item, value:driverVictory[item]});
				driverper +="<li><p class='ios os scnd-font-color'>"+item+"</p><p class='os-percentage'>"+(driverVictory[item]/location.length*100).toFixed(1)+"%</p></li>";
        		});
			console.log(driverper);
	        	$('.os-percentages.horizontal-list').html(driverper);


			$('#chart').html('');
			var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
			var pie = d3.layout.pie().value(function(d){return d.value;});

			// declare an arc generator function
			var arc = d3.svg.arc().outerRadius(r);

			// select paths, use arc generator to draw
			var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
			arcs.append("svg:path")
			    .attr("fill", function(d, i){
				return color(i);
			    })
			    .attr("d", function (d) {
				// log the result of the arc generator to show how cool it is :)
				console.log(arc(d));
				return arc(d);
			    });

			// add the text
			arcs.append("svg:text").attr("transform", function(d){
						d.innerRadius = 0;
						d.outerRadius = r;
			    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
			    return data[i].label;}
					);

	});

});
