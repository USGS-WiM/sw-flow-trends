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

    allLayers = [//
        {
            "groupHeading": "sites",
            "showGroupHeading": false,
            "includeInLayerList": false,
            "layers": {
                "Q2_scaled_deficit": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/3",
                    "options": {
                        "id": "Q2_scaled_deficit",
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
                "Q2_nDays_Layer" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/4",
                    "options": {
                        "id": "Q2_nDays_Layer",
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
                "JD_Last" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/1",
                    "options": {
                        "id": "JD_Last",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
                "JD_First" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/2",
                    "options": {
                        "id": "JD_First",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, 
                "JD_Diff_Q2" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/10",
                    "options": {
                        "id": "JD_Diff_Q2",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
                "Peaks_Square_Data" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/5",
                    "options": {
                        "id": "Peaks_Square_Data",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "Mean_AnnualQ" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/6",
                    "options": {
                        "id": "Mean_AnnualQ",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "lowQ_7day" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/7",
                    "options": {
                        "id": "lowQ_7day",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "lowQ_3day" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/8",
                    "options": {
                        "id": "lowQ_3day",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "lowQ_1day" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/9",
                    "options": {
                        "id": "lowQ_1day",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "ZeroQ_nDay" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/SWFlowTrends/MapServer/0",
                    "options": {
                        "id": "ZeroQ_nDay",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
            }
        }
    ]

});