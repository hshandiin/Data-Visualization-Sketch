var geojson;
var legend;

////////////////////////////////////////////////////////////////
//                  MAKE THE MAP                              //
////////////////////////////////////////////////////////////////

var map = L.map('map').setView([37.8, -96], 4);
////////////////////////////////////////////////////////////////
//                  GET MAPBOX TILE LAYER                     //
////////////////////////////////////////////////////////////////
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.light'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4> Native Women who ran for election in 2018</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + '</b><br/>' + props.ran + ' <sup></sup>' :
        'Hover over a state');
};

info.addTo(map);


// get color depending on how many Native women ran in that state
function getColor(d) {
    return d > 8 ? '#ff566d' :
        d >7 ? '#ff566d' :
        d > 6 ? '#ff566d' :
        d > 5 ? '#60e06d' :
        d > 4 ? '#20e5de' :
        d > 3 ? '#77efc9' :
        d > 2 ? '#8b7fdb' :
        d > 1 ? '#e2b3d3' :
        d > 0 ? '#e2b3d3' :
        '#ffefdd';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'gray',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.ran)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#ce5876',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

////////////////////////////////////////////////////////////////
//                  CREATE THE LEGEND                         //
////////////////////////////////////////////////////////////////
legend = L.control({
    position: 'bottomright'
});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,2, 4, 6],
        labels = ['# of candidates'],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);