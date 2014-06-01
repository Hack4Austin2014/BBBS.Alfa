var map, locator;
var serviceAreaTask, params, clickpoint, ServiceAreaParameters, arrayUtils;
var addressGraphic; var areaGraphic;
var eventLayer;
var trafficLayer; 

require([
  "esri/map", "esri/config", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/tasks/locator", "esri/graphic",
  "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Font", "esri/symbols/TextSymbol",
  "dojo/_base/array", "esri/Color",              "esri/tasks/GeometryService",
          "esri/tasks/BufferParameters","esri/tasks/IdentifyTask","esri/tasks/IdentifyParameters",
          "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol",
  "dojo/number", "dojo/parser", "dojo/dom", "dijit/registry",
  "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters",
  "dijit/form/Button", "dijit/form/Textarea",
  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dojo/domReady!"
],
function (
  Map, esriConfig, ArcGISDynamicMapServiceLayer, SpatialReference, FeatureLayer, Locator, Graphic,
  InfoTemplate, SimpleMarkerSymbol,
  Font, TextSymbol,
  arrayUtils, Color,GeometryService, BufferParameters,IdentifyTask, IdentifyParameters,
  SimpleFillSymbol,SimpleLineSymbol,number, parser, dom, registry, ServiceAreaTask, ServiceAreaParameters
    ) {
    parser.parse();


    esriConfig.defaults.io.proxyUrl = "/proxy";

    map = new Map("map", {
        basemap: "streets",
        center: [-93.5, 41.431],
        zoom: 5,
        autoResize: true,
        spatialReference: new SpatialReference(102100)
    });

    var gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

    map.on("click", executeIdentifyTask);
          //create identify tasks and setup parameters
          identifyTask = new IdentifyTask("http://services2.arcgis.com/DlASPyTb2UPEalFT/arcgis/rest/services/BBBS_Address/FeatureServer/0/query");

          identifyParams = new IdentifyParameters();
          identifyParams.tolerance = 10;
          identifyParams.returnGeometry = true;
          //identifyParams.layerIds = [0];
          identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
          identifyParams.width = map.width;
          identifyParams.height = map.height;

   // trafficLayer = new ArcGISDynamicMapServiceLayer("http://gis.srh.noaa.gov/arcgis/rest/services/RIDGERadar/MapServer"); 
  
//    map.addLayer(trafficLayer); 

    eventLayer = new FeatureLayer("http://services2.arcgis.com/DlASPyTb2UPEalFT/arcgis/rest/services/BBBS_Address/FeatureServer/0", { "id": "BPPAS" });

    locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);
    map.addLayer(eventLayer);
    
    
    var identifyTask, identifyParams;

    // listen for button click then geocode
    
    $( "#locate" ).click(locate); 



//    var searchbtn = registry.byId("locate"); 
//   searchbtn.on("click", locate);
//    searchbtn.set('Class', 'searchbtn'); 
//    map.infoWindow.resize(200, 125);

  function executeIdentifyTask (event) {
        var g = event.mapPoint;
          g.setSpatialReference(new SpatialReference(102100));
  
  var params = new BufferParameters();
      params.distances = [ 500 ];
      params.bufferSpatialReference = new esri.SpatialReference({wkid: 102100});
      params.outSpatialReference = map.spatialReference;
      params.unit = GeometryService['Feet'];
      params.geometries = [g];
    gsvc.buffer(params, showBuffer);
}

function showBuffer(bufferedGeometries) {
      var symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([255,0,0,0.65]), 2
        ),
        new Color([255,0,0,0.35])
      );

   // var graphic = new Graphic(bufferedGeometries[0], symbol);
   //     map.graphics.add(graphic);


          identifyParams.geometry = bufferedGeometries[0];
          var e = map.extent;
          e.setSpatialReference(new SpatialReference(102100));
          identifyParams.mapExtent = e;

          var deferred = identifyTask
            .execute(identifyParams)
            .addCallback(function (response) {
              // response is an array of identify result objects
              // Let's return an array of features.
              return arrayUtils.map(response, function (result) {
                var feature = result.feature;
                alert(feature.attributes['ID']); 
              });
            });

      }



          // InfoWindow expects an array of features from each deferred
          // object that you pass. If the response from the task execution
          // above is not an array of features, then you need to add a callback
          // like the one above to post-process the response and return an
          // array of features.
          //map.infoWindow.setFeatures([deferred]);
          //map.infoWindow.show(event.mapPoint);
        

function locate() {
     map.graphics.clear();
      var address = {
          "SingleLine": $('#address').val()
      };
      locator.outSpatialReference = map.spatialReference;
      var options = {
          address: address,
          outFields: ["Loc_name"]
      }
      locator.addressToLocations(options);
  }
    function showResults(evt) {
        var candidate;
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
          "Location",
          "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}"
        );
        symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
        symbol.setColor(new Color([153, 0, 51, 0.75]));

        var geom;
        arrayUtils.every(evt.addresses, function (candidate) {
            console.log(candidate.score);
            if (candidate.score > 80) {
                console.log(candidate.location);
                var attributes = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };
                geom = candidate.location;
                addressGraphic = new Graphic(geom, symbol, attributes, infoTemplate);
                //add a graphic to the map at the geocoded location
                map.graphics.add(addressGraphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = candidate.address;
                var font = new Font(
                  "16pt",
                  Font.STYLE_NORMAL,
                  Font.VARIANT_NORMAL,
                  Font.WEIGHT_BOLD,
                  "Helvetica"
                );

                var textSymbol = new TextSymbol(
                  displayText,
                  font,
                  new Color("#666633")
                );
                textSymbol.setOffset(0, 8);

                map.graphics.add(new Graphic(geom, textSymbol));
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        if (geom !== undefined) {
            map.centerAndZoom(geom, 12);
            //Create drive time polygon
            CreateDriveTime();
        }
    }

});


function wtf() {
alert('wtf'); }


function addTraffic()
{

require(["esri/layers/ArcGISDynamicMapServiceLayer"], function(ArcGISDynamicMapServiceLayer) 
{ 
 // trafficLayer = new ArcGISDynamicMapServiceLayer("http://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer?token=XYOPXRdr3-Po6ikWBhtkvm1Wa-LGSnljjGZ3zjczIh9cKnku4Xcy6CTgGXDpNhpn_vPnMUC0auVX92wcSEOKTlYNXHUHdN734wac26PymYiNBvHmqD4ZTikdXH4nLLXlwv8f122ZxKnrv1HJhJP4Ew.."); 
  
});
}
function ZoomLocation(lng, lat)
{

require([
  "esri/map", "esri/config","esri/geometry/Point", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/tasks/locator", "esri/graphic",
  "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Font", "esri/symbols/TextSymbol",
  "dojo/_base/array", "esri/Color",
  "dojo/number", "dojo/parser", "dojo/dom", "dijit/registry",
  "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters",
  "dijit/form/Button", "dijit/form/Textarea",
  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dojo/domReady!"
],


function (
  Map, esriConfig, Point, SpatialReference, FeatureLayer, Locator, Graphic,
  InfoTemplate, SimpleMarkerSymbol,
  Font, TextSymbol,
  arrayUtils, Color,
  number, parser, dom, registry, ServiceAreaTask, ServiceAreaParameters
    ) {
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
          "Location",
          "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}"
        );
        symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
        symbol.setColor(new Color([153, 0, 51, 0.75]));

        var geom = new Point(lng, lat); 
addressGraphic = new Graphic(geom, symbol);
                //add a graphic to the map at the geocoded location
                map.graphics.add(addressGraphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = "Your current location";
                var font = new Font(
                  "16pt",
                  Font.STYLE_NORMAL,
                  Font.VARIANT_NORMAL,
                  Font.WEIGHT_BOLD,
                  "Helvetica"
                );

                var textSymbol = new TextSymbol(
                  displayText,
                  font,
                  new Color("#666633")
                );
                textSymbol.setOffset(0, 8);

                map.graphics.add(new Graphic(geom, textSymbol)); 

            map.centerAndZoom(geom, 12);     
            CreateDriveTime(); 
    }
    
);
}

function CreateDriveTime() {
    require([
      "esri/map", "esri/config", "esri/SpatialReference",
      "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
      "esri/geometry/Point", "esri/graphic",
      "dojo/parser", "dojo/dom", "dijit/registry",
      "esri/Color", "dojo/_base/array",
      "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
      "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dijit/form/HorizontalSlider",
      "dojo/domReady!"
    ], function (
      Map, esriConfig, SpatialReference,
      ServiceAreaTask, ServiceAreaParameters, FeatureSet,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Point, Graphic,
      parser, dom, registry,
      Color, arrayUtils
    ) {
        parser.parse();

        //This sample requires a proxy page to handle communications with the ArcGIS Server services. You will need to  
        //replace the url below with the location of a proxy on your machine. See the 'Using the proxy page' help topic 
        //for details on setting up a proxy page.
        esriConfig.defaults.io.proxyUrl = "/proxy";

        params = new ServiceAreaParameters();
        params.defaultBreaks = [5];
        params.outSpatialReference = new SpatialReference(102100);
        params.returnFacilities = false;

        serviceAreaTask = new ServiceAreaTask("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Service Area");


        var features = [];
        features.push(addressGraphic);
        var facilities = new FeatureSet();
        facilities.features = features;
        params.facilities = facilities;

        //solve 
        serviceAreaTask.solve(params, function (solveResult) {
            var result = solveResult;
            var serviceAreaSymbol = new SimpleFillSymbol(
              "solid",
              new SimpleLineSymbol(
                "solid",
                new dojo.Color([232, 104, 80]), 2
              ),
              new dojo.Color([232, 104, 80, 0.25])
            );
            var polygonSymbol = new SimpleFillSymbol(
              "solid",
              new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2),
              new Color([232, 104, 80, 0.25])
            );
            arrayUtils.forEach(solveResult.serviceAreaPolygons, function (serviceArea) {
                serviceArea.setSymbol(polygonSymbol);
                map.graphics.add(serviceArea);
                areaGraphic = serviceArea;
                QueryAddress();
            });

        }, function (err) {
            console.log(err.message);
        });
    });
}

function QueryAddress() {
    require([
      "esri/tasks/query", "esri/tasks/QueryTask", "esri/SpatialReference", "esri/geometry/webMercatorUtils"
    ], function (Query, QueryTask, SpatialReference, webMercatorUtils) {
        var query = new Query();
        //                var geom = webMercatorUtils.geographicToWebMercator(g.geometry);
        var g = areaGraphic;
        g.geometry.setSpatialReference(new SpatialReference(102100));
        query.geometry = g.geometry;
        query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
        query.outSpatialReference = { wkid: 102100 };
        query.returnGeometry = true;
        query.outFields = ["Category", "ID"];

        queryTask = new QueryTask("http://services2.arcgis.com/DlASPyTb2UPEalFT/ArcGIS/rest/services/BBBS_Address/FeatureServer/0/query");
        queryTask.execute(query, showResults);

        //eventLayer.queryFeatures(query, showResults); 

    });
}

function showResults(result) {
    //alert("Number of results: " + result.features.length);
    var fbID = []; 
    for (i = 0; i < result.features.length; i++)
    {
        console.log(result.features[i].attributes.ID); 
        fbID.push(result.features[i].attributes.ID); 
    }
    if (fbID.length > 0)
    {
      GetEvents(fbID); 
    }
}


function GetEvents(ids)
{
  var arrayTest = new Array();
  var fb = new Firebase("https://amber-fire-6558.firebaseio.com/data/events");

  $('#InfoDiv').empty(); 
  fb.once('value', function(snapshot) {
    snapshot.forEach(function(userSnap) {
      var resultHtml = ''; 
      var i = 0;
      // jQuery("#eventsDiv").append("Event: " + userSnap.val().title + "<br/>");
      if (ids == undefined)
      {
          jQuery("#eventsDiv").append("Event: " + userSnap.val().title + "<br/>");
      }
      else
      {
        ids.forEach(function(idName)
        {
          if (userSnap.name() == idName || ids == undefined)
          {
            arrayTest.push(userSnap);
            var info = userSnap.val(); 
            // console.log(userSnap.val());
            resultHtml += "<img src='eventpics/" + info.picture + "' width='60px' height='60px'>" + info.title + "<br/>";
            ids.splice(i, 1);
          }
        });
      }
      console.log(resultHtml); 
      $('#InfoDiv').append('<div>' + resultHtml + '</div>'); 
    });
    
//    setIds(arrayTest);

 //   console.log(arrayTest);

    // console.log(arrayTest[0]);
    // console.log(arrayTest.length);
  });

}
