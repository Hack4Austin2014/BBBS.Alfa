      function addSpatialData(json)
      {
           
            //grad address
            addressInput = json.address.street1 + ' ' + json.address.city + ', ' + json.address.state;
            console.log(addressInput); 
          getAddress(json.address.street1,json.address.city,json.address.state, json.category, json); 
            
      
      }

      function getAddress(street, city, state, cat,json)
      {

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

    var addressInput = street + ' ' + city + ', ' + state; 
    esriConfig.defaults.io.proxyUrl = "/proxy";

    locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", ShowAddressResult);

        var address = {
            "SingleLine": addressInput
        };
        locator.outSpatialReference = new SpatialReference(102100);
        var options = {
            address: address,
            outFields: ["Loc_name"]
        }
        locator.addressToLocations(options);
        
        
            function ShowAddressResult(evt)
    {
        var candidate;
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
                
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        if (geom !== undefined) {
            //map.centerAndZoom(geom, 12);
            //Create drive time polygon
            
            var jsonString = JSON.stringify(json); 
            console.log('posting ' + json.title); 
            $.ajax({
                type: "POST",
                url: "https://amber-fire-6558.firebaseIO.com/data/events.json",
                data: jsonString,
                success: function (result) {
                    var id = result.name;    
                       addFeatureServer(id, cat, geom.x, geom.y, street, city, state); 
                }
            });

            //CreateDriveTime(geom);
        }
    }
    }
    );
    
    
    
    }
    

        function addFeatureServer(id, cat, x, y, a, c, s)
        {

            var jsonString = JSON.stringify([
                    {
                        "attributes": {
                            "ID": id,
                            "Category" : cat,
                            "Address" : a,
                            "City" :  c,
                            "State" : s
                        },
                        "geometry": {
                        
                            "x": x,
                            "y": y
                        }
                    }
            ]); 

            $.ajax({
                type: "POST",
                url: "http://services2.arcgis.com/DlASPyTb2UPEalFT/arcgis/rest/services/BBBS_Address/FeatureServer/0/addFeatures",
                data: {
                    f: 'pjson',
                    token: "oZ2I9yiTm0dJ9OFUJ8kzyc4RajFoOXyqc3okj0_ycOCa9K84o23ibh0nYr92BMwgPMQg6Qanl-I3kyiW0cdLZuHRlHPJfWR-35JQGT7IEXBbKP8evCipRzDJj1tRJMw8_WgYM8Y-6wmei-CK1L-91Q..",
                    features: jsonString

                },
                success: function (result) {
                    console.log(id + '|' + x + ' | ' + y + '  ' + result); 
                    
                }
            });
        }