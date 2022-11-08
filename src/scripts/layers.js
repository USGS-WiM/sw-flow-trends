/**
 * Created by njestes on 12/11/18.
 */
var allLayers;

require([
    "esri/geometry/Extent",
    "esri/layers/WMSLayerInfo",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/domReady!"
], function(
    Extent,
    WMSLayerInfo,
    FeatureLayer,
    SimpleLineSymbol,
    SimpleMarkerSymbol
) {

    allLayers = [
        {
            "groupHeading": "sites",
            "showGroupHeading": false,
            "includeInLayerList": false,
            "layers": {
                "Trend Results": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWFlowTrends/swFlowTrends/MapServer/30",
                    "options": {
                        "id": "trendResults",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend": false
                    }
                },
                "For layer info" : {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWFlowTrends/swFlowTrends/MapServer",
                    "options": {
                        "id": "layerInfo",
                        "opacity": 1.00,
                        "outFields": ["*"],
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
                "trends_by_year" : {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWFlowTrends/trends_by_year/MapServer/",
                    "options": {
                        "id": "trendsByYear",
                        "opacity": 0.00,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
                "2012": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWTrends/lu2012_100515_test/ImageServer",
                    "options": {
                        "id": "lu2012",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Display Land Use",
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "2002": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWTrends/lu2002_100515_test/ImageServer",
                    "options": {
                        "id": "lu2002",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Display Land Use",
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "1992": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWTrends/lu1992_100515_test/ImageServer",
                    "options": {
                        "id": "lu1992",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Display Land Use",
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "1982": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWTrends/lu1982_100515_test/ImageServer",
                    "options": {
                        "id": "lu1982",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Display Land Use",
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "1974": {
                    "url": "https://gis1.wim.usgs.gov/server/rest/services/SWTrends/lu1974_100515_test/ImageServer",
                    "options": {
                        "id": "lu1974",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "exclusiveGroupName":"Display Land Use",
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                }
            }
        }
    ]

});