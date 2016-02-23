var map;

function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 25.657071, lng: -100.366366},
		zoom: 13
	});

	var origenInput = document.getElementById('origen');
	var destinoInput = document.getElementById('destino');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(origenInput);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinoInput);
  
  var autocompleteOrigen = new google.maps.places.Autocomplete(origenInput);
  autocompleteOrigen.bindTo('bounds', map);

  var autocompleteDestino = new google.maps.places.Autocomplete(destinoInput);
  autocompleteDestino.bindTo('bounds', map);

  autocompleteOrigen.addListener('place_changed', function() {

    var place = autocompleteOrigen.getPlace();
    
    console.log(place);

    var location = place && place.geometry && place.geometry.location;
    
  });

  autocompleteDestino.addListener('place_changed', function() {
    
    var place = autocompleteDestino.getPlace();
    
    console.log(place);

    var location = place && place.geometry && place.geometry.location;
    
  });
}