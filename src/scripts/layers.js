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
                "pest layer": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/0",
                    "options": {
                        "id": "pestSites",
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
                        "includeLegend": true
                    }
                },
                "Eco Sites layer" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/1",
                    "options": {
                        "id": "ecoSites",
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
                "WRTDS Concentration Sites" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/2",
                    "options": {
                        "id": "wrtdsSites",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["wrtds_sites.Station_nm","wrtds_sites.Site_no","wrtds_sites.staAbbrev","wrtds_sites.agency1","wrtds_trends_wm_new.agency_1_full","wrtds_trends_wm_new.agency_2_full","wrtds_sites.db_source","wrtds_sites.dec_lat_va","wrtds_sites.dec_long_va","wrtds_sites.drainSqKm","wrtds_sites.huc_cd","wrtds_trends_wm_new.DA"],
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
                "WRTDS Flux Sites" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/swTrendSites/MapServer/3",
                    "options": {
                        "id": "wrtdsFluxSites",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["wrtds_sites.Station_nm","wrtds_sites.Site_no","wrtds_sites.staAbbrev","wrtds_sites.agency1","wrtds_trends_wm_new.agency_1_full","wrtds_trends_wm_new.agency_2_full","wrtds_sites.db_source","wrtds_sites.dec_lat_va","wrtds_sites.dec_long_va","wrtds_sites.drainSqKm","wrtds_sites.huc_cd","wrtds_trends_wm_new.DA"],
                        "visible": false
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