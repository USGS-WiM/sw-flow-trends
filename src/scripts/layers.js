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
            "showGroupHeading": true,
            "includeInLayerList": true,
            "layers": {
                "lowQ_1Day": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/0",
                    "options": {
                        "id": "0",
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
                        "includeLegend": true
                    }
                },
                "lowQ_3Days" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/1",
                    "options": {
                        "id": "1",
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
                        "includeLegend" : true
                    }
                },
                "lowQ_7Day" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/2",
                    "options": {
                        "id": "2",
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
                        "includeLegend" : true
                    }
                },
                "mean_annual" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/3",
                    "options": {
                        "id": "3",
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
                        "includeLegend" : true
                    }
                },
                "peak_square_data" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/4",
                    "options": {
                        "id": "4",
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
                        "includeLegend" : true
                    }
                },
                "zeroQ_nDays" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/5",
                    "options": {
                        "id": "5",
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
                        "includeLegend" : true
                    }
                }
            }
        }
    ]

});