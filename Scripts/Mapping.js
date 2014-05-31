var map, locator;
var serviceAreaTask, params, clickpoint, ServiceAreaParameters, arrayUtils;
var addressGraphic; var areaGraphic;
var eventLayer;

require([
  "esri/map", "esri/config", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/tasks/locator", "esri/graphic",
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
  Map, esriConfig, SpatialReference, FeatureLayer, Locator, Graphic,
  InfoTemplate, SimpleMarkerSymbol,
  Font, TextSymbol,
  arrayUtils, Color,
  number, parser, dom, registry, ServiceAreaTask, ServiceAreaParameters
    ) {
    parser.parse();


    esriConfig.defaults.io.proxyUrl = "/proxy";

    map = new Map("map", {
        basemap: "streets",
        center: [-93.5, 41.431],
        zoom: 5,
        spatialreference: new SpatialReference(102100)
    });

    eventLayer = new FeatureLayer("https://services2.arcgis.com/DlASPyTb2UPEalFT/arcgis/rest/services/BBBS_Address/FeatureServer/0", { "id": "BPPAS" });

    locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);
    map.addLayer(eventLayer);
    // listen for button click then geocode
    registry.byId("locate").on("click", locate);

    map.infoWindow.resize(200, 125);

    function locate() {
        map.graphics.clear();
        var address = {
            "SingleLine": dom.byId("address").value
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
            CreateDriveTime(geom);
        }
    }

});

function CreateDriveTime(geom) {
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

        queryTask = new QueryTask("https://services2.arcgis.com/DlASPyTb2UPEalFT/ArcGIS/rest/services/BBBS_Address/FeatureServer/0/query");
        queryTask.execute(query, showResults);

        //eventLayer.queryFeatures(query, showResults); 

    });
}

function showResults(result) {
    alert("Number of results: " + result.features.length);
}