var map, markerOrigen, markerDestino, directionsService, directionsDisplay, uberServerToken;
function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 25.657071, lng: -100.366366},
		zoom: 13,
		disableDefaultUI : true
	});

	directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ markerOptions: { visible: false} });

  directionsDisplay.setMap(map);

	var origenInput = document.getElementById('origen');
	var destinoInput = document.getElementById('destino');

	var uberDetails = document.getElementById('uberDetails');

	uberDetails.innerHTML = "<h2>Uber Info</h2>";

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(origenInput);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinoInput);

	map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(uberDetails);
	
	var autocompleteOrigen = new google.maps.places.Autocomplete(origenInput);
	autocompleteOrigen.bindTo('bounds', map);

	var autocompleteDestino = new google.maps.places.Autocomplete(destinoInput);
	autocompleteDestino.bindTo('bounds', map);

	autocompleteOrigen.addListener('place_changed', function() {

		var place = autocompleteOrigen.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerOrigen)
				markerOrigen = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerOrigen.setPosition(location);

		showRoute();
	});

	autocompleteDestino.addListener('place_changed', function() {
		
		var place = autocompleteDestino.getPlace();
		
		console.log(place);

		var location = place && place.geometry && place.geometry.location;
		
		if (location)
			if (!markerDestino)
				markerDestino = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			else
				markerDestino.setPosition(location);
				
		showRoute();
	});
}

function showRoute() {
  if (!markerDestino || !markerOrigen)
  	return;
  directionsService.route({
    origin: markerOrigen.getPosition(),
    destination: markerDestino.getPosition(),
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      console.log(response);
      directionsDisplay.setDirections(response);
      getEstimadePrice();
    } else {
      console.log(status);
    }
  });
}

function getEstimadePrice () {
	var origen = markerOrigen.getPosition();
	var destino = markerDestino.getPosition();
	$.ajax({
		url: "https://api.uber.com/v1/estimates/price",
		headers: {
			Authorization: "Token " + uberServerToken
		},
		data: {
			start_latitude: origen.lat(),
			start_longitude: origen.lng(),
			end_latitude: destino.lat(),
			end_longitude:  destino.lng()
		},
		success: function(result) {
			displayUberInfo(result);
		}
	});
}

function displayUberInfo (result) {
	var uberDetails = document.getElementById('uberDetails');
	info = "";
	var prices = result.prices;
	for(var i in prices){
		info += "<h4>"+ prices[i].display_name + "</h4>";
		info += "<label class='detail'><b>Distancia</b>"+ prices[i].distance + "</label>";
		info += "<label class='detail'><b>Duración</b>"+ prices[i].duration + "</label>";
		info += "<label class='detail'><b>Costo estimado</b>"+ prices[i].estimate + "</label>";
	}
	uberDetails.innerHTML = info;
}