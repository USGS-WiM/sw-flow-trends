//for jshint
'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

/**
 * Created by njestes on 12/11/18.
 */

var map;
var allLayers;
var maxLegendHeight;
var maxLegendDivHeight;
var printCount = 0;
var dragInfoWindows = true;
var defaultMapCenter = [-94.106, 35.729];

var constObj;

var currentConstType = "";
var currentSiteNo = "";
var currentConst = "Total Phosphorus";
var currentLayer = "wrtdsSites";

var identifyTask, identifyParams;

var trendLayerInfos = [];

var scatterPlot;
var trends_by_year_array;

require([
    'esri/arcgis/utils',
    'esri/Color',
    'esri/map',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/dijit/Geocoder',
    'esri/dijit/PopupTemplate',
    'esri/graphic',
    'esri/geometry/Multipoint',
    'esri/geometry/Point',
    'esri/graphicsUtils',
    'esri/layers/FeatureLayer',
    'esri/tasks/IdentifyParameters',
    'esri/tasks/IdentifyTask',
    'esri/symbols/PictureMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/LegendLayer',
    'esri/tasks/PrintTask',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate',
    'esri/tasks/query',
    'esri/geometry/webMercatorUtils',
    'dojo/dnd/Moveable',
    'dojo/query',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/on',
    'dojo/domReady!'
], function (
    arcgisUtils,
    Color,
    Map,
    HomeButton,
    LocateButton,
    ArcGISImageServiceLayer,
    ArcGISTiledMapServiceLayer,
    Geocoder,
    PopupTemplate,
    Graphic,
    Multipoint,
    Point,
    graphicsUtils,
    FeatureLayer,
    IdentifyParameters,
    IdentifyTask,
    PictureMarkerSymbol,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    LegendLayer,
    PrintTask,
    PrintParameters,
    PrintTemplate,
    esriQuery,
    webMercatorUtils,
    Moveable,
    query,
    dom,
    domClass,
    on
) {

    //bring this line back after experiment////////////////////////////
    //allLayers = mapLayers;

    // Added for handling of ajaxTransport in IE
    if (!jQuery.support.cors && window.XDomainRequest) {
        var httpRegEx = /^https?:\/\//i;
        var getOrPostRegEx = /^get|post$/i;
        var sameSchemeRegEx = new RegExp('^'+location.protocol, 'i');
        var xmlRegEx = /\/xml/i;

        /*esri.addProxyRule({
            urlPrefix: "http://commons.wim.usgs.gov/arcgis/rest/services/Utilities/PrintingTools",
            proxyUrl: "http://commons.wim.usgs.gov/resource-proxy/proxy.ashx"
        });*/

        // ajaxTransport exists in jQuery 1.5+
        jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR){
            // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
            if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                var xdr = null;
                var userType = (userOptions.dataType||'').toLowerCase();
                return {
                    send: function(headers, complete){
                        xdr = new XDomainRequest();
                        if (/^\d+$/.test(userOptions.timeout)) {
                            xdr.timeout = userOptions.timeout;
                        }
                        xdr.ontimeout = function(){
                            complete(500, 'timeout');
                        };
                        xdr.onload = function(){
                            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                            var status = {
                                code: 200,
                                message: 'success'
                            };
                            var responses = {
                                text: xdr.responseText
                            };

                            try {
                                if (userType === 'json') {
                                    try {
                                        responses.json = JSON.parse(xdr.responseText);
                                    } catch(e) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        //throw 'Invalid JSON: ' + xdr.responseText;
                                    }
                                } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                    doc.async = true;
                                    try {
                                        doc.loadXML(xdr.responseText);
                                    } catch(e) {
                                        doc = undefined;
                                    }
                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        throw 'Invalid XML: ' + xdr.responseText;
                                    }
                                    responses.xml = doc;
                                }
                            } catch(parseMessage) {
                                throw parseMessage;
                            } finally {
                                complete(status.code, status.message, responses, allResponseHeaders);
                            }
                        };
                        xdr.onerror = function(){
                            complete(500, 'error', {
                                text: xdr.responseText
                            });
                        };
                        xdr.open(options.type, options.url);
                        //xdr.send(userOptions.data);
                        xdr.send();
                    },
                    abort: function(){
                        if (xdr) {
                            xdr.abort();
                        }
                    }
                };
            }
        });
    };

    jQuery.support.cors = true;

    map = Map('mapDiv', {
        basemap: 'topo',
        //center: [-95.6, 38.6],
        center: defaultMapCenter,
        zoom: 5
    });
    //button for returning to initial extent
    var home = new HomeButton({
        map: map
    }, "homeButton");
    home.startup();
    //button for finding and zooming to user's location
    var locate = new LocateButton({
        map: map
    }, "locateButton");
    locate.startup();

    $('#legendButton').click();

    //following block forces map size to override problems with default behavior
    $(window).resize(function () {
        /*if ($("#legendCollapse").hasClass('in')) {
            maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('height', maxLegendHeight);
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);
        }
        else {
            $('#legendElement').css('height', 'initial');
        }*/
    });

    // All code for handling IE warning popup
    $("#IEwarnContinue").click(function () {
        $('#aboutModal').modal({backdrop: 'static'});
        $('#aboutModal').modal('show');
    });

    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        $("#IEwarningModal").modal('show');
    } else {
        $('#aboutModal').modal({backdrop: 'static'});
        $('#aboutModal').modal('show');
    }
    // End IE warning code

    $('#printExecuteButton').click(function (e) {
        e.preventDefault();
        $(this).button('loading');
        printMap();
    });

    function showPrintModal() {
        $('#printModal').modal('show');
    }

    map.on('extent-change', function(event) {
        //alert(event);
    });

    $('#printNavButton').click(function(){
        /*var trendPeriodVal = $("input:radio[name='trendPeriod']:checked").val();

        var trendPeriod = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "2002";
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "1992";
        } else if (trendPeriodVal == "P30") {
            trendPeriod = "1982";
        } else if (trendPeriodVal == "P40") {
            trendPeriod = "1972";
        }

        var trendTypeVal = $('input[name=trendType]:checked').val();
        trendTypeVal = trendTypeVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        var printTitle = getPrintTitle();
        $("#printTitle").html(printTitle);
        showPrintModal();*/
    });

    function getPrintTitle() {
        var printTitle = ""

        /*var trendPeriodVal = $("input:radio[name='trendPeriod']:checked").val();

        var trendPeriod = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "2002";
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "1992";
        } else if (trendPeriodVal == "P30") {
            trendPeriod = "1982";
        } else if (trendPeriodVal == "P40") {
            trendPeriod = "1972";
        }

        var trendTypeVal = $('input[name=trendType]:checked').val();
        trendTypeVal = trendTypeVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        var selectVal = $("#typeSelect")[0].value;
        if (selectVal == "Pesticides" || selectVal == "Nutrients" || selectVal == "Carbon" || selectVal == "Major ions" || selectVal == "Salinity" || selectVal == "Sediment") {
            printTitle = trendTypeVal + " trend results (flow normalized) for " + currentConst + " in surface water for " + trendPeriod + "-2012";
        } else if (selectVal == "Algae" || selectVal == "Fish" || selectVal == "Macroinvertebrates") {
            printTitle = "Trend results (flow normalized) for " + currentConst + " in surface water for " + trendPeriod + "-2012";
        }*/

        return printTitle;
    }

    $('#layerSelect').change(function(){ 
        // Get all info for layer change and update trendLayer with the selected layer/model/trend
        trendLayerInfos = map.getLayer("layerInfo").layerInfos;
        
        var newLayerName = document.getElementById("layerSelect").value + "_" + $('input[name=trendType]:checked').val() + "_" + $('input[name=trendPeriod]:checked').val();

        for (var index in trendLayerInfos) {
            if (trendLayerInfos[index].name == newLayerName) {
                map.removeLayer(map.getLayer("trendResults"));

                var featureLayer = new FeatureLayer(map.getLayer("layerInfo").url + "/" + index,{
                    id: "trendResults",
                    opacity: 1.00,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"],
                    visible: true
                });
                map.addLayer(featureLayer)
            }
        }
    });

    $(".trendPeriod").on("change", function(event) {
        trendLayerInfos = map.getLayer("layerInfo").layerInfos;
        
        var newLayerName = document.getElementById("layerSelect").value + "_" + $('input[name=trendType]:checked').val() + "_" + $('input[name=trendPeriod]:checked').val();

        for (var index in trendLayerInfos) {
            if (trendLayerInfos[index].name == newLayerName) {
                map.removeLayer(map.getLayer("trendResults"));

                var featureLayer = new FeatureLayer(map.getLayer("layerInfo").url + "/" + index,{
                    id: "trendResults",
                    opacity: 1.00,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"],
                    visible: true
                });
                map.addLayer(featureLayer)
            }
        }
    });

    $(".trendType").on("change", function(event) {
        trendLayerInfos = map.getLayer("layerInfo").layerInfos;
        
        var newLayerName = document.getElementById("layerSelect").value + "_" + $('input[name=trendType]:checked').val() + "_" + $('input[name=trendPeriod]:checked').val();

        for (var index in trendLayerInfos) {
            if (trendLayerInfos[index].name == newLayerName) {
                map.removeLayer(map.getLayer("trendResults"));

                var featureLayer = new FeatureLayer(map.getLayer("layerInfo").url + "/" + index,{
                    id: "trendResults",
                    opacity: 1.00,
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"],
                    visible: true
                });
                map.addLayer(featureLayer)
            }
        }
    });

    //displays map scale on map load
    on(map, "load", function() {
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
        var initMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
        $('#latitude').html(initMapCenter.y.toFixed(3));
        $('#longitude').html(initMapCenter.x.toFixed(3));

        //code for adding draggability to infoWindow. http://www.gavinr.com/2015/04/13/arcgis-javascript-draggable-infowindow/
        if (dragInfoWindows == true) {
            var handle = query(".title", map.infoWindow.domNode)[0];
            var dnd = new Moveable(map.infoWindow.domNode, {
                handle: handle
            });

            // when the infoWindow is moved, hide the arrow:
            on(dnd, 'FirstMove', function() {
                // hide pointer and outerpointer (used depending on where the pointer is shown)
                var arrowNode =  query(".outerPointer", map.infoWindow.domNode)[0];
                domClass.add(arrowNode, "hidden");

                var arrowNode =  query(".pointer", map.infoWindow.domNode)[0];
                domClass.add(arrowNode, "hidden");
            }.bind(this));
        }
    });
    //displays map scale on scale change (i.e. zoom level)
    on(map, "zoom-end", function () {
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
    });

    //Supdates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes "map center" label
    on(map, "mouse-move", function (cursorPosition) {
        $('#mapCenterLabel').css("display", "none");
        if (cursorPosition.mapPoint != null) {
            var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
            $('#latitude').html(geographicMapPt.y.toFixed(3));
            $('#longitude').html(geographicMapPt.x.toFixed(3));
        }
    });
    //updates lat/lng indicator to map center after pan and shows "map center" label.
    on(map, "pan-end", function () {
        //displays latitude and longitude of map center
        $('#mapCenterLabel').css("display", "inline");
        var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
        $('#latitude').html(geographicMapCenter.y.toFixed(3));
        $('#longitude').html(geographicMapCenter.x.toFixed(3));
    });

    var nationalMapBasemap = new ArcGISTiledMapServiceLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer', {id: "nationalMap"});
    //on clicks to swap basemap. map.removeLayer is required for nat'l map b/c it is not technically a basemap, but a tiled layer.
    on(dom.byId('btnStreets'), 'click', function () {
        map.setBasemap('streets');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnSatellite'), 'click', function () {
        map.setBasemap('satellite');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnHybrid'), 'click', function () {
        map.setBasemap('hybrid');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnTerrain'), 'click', function () {
        map.setBasemap('terrain');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnGray'), 'click', function () {
        map.setBasemap('gray');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnNatGeo'), 'click', function () {
        map.setBasemap('national-geographic');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnOSM'), 'click', function () {
        map.setBasemap('osm');
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnTopo'), 'click', function () {
        map.setBasemap('topo');
        map.removeLayer(nationalMapBasemap);
    });

    on(dom.byId('btnNatlMap'), 'click', function () {
        map.addLayer(nationalMapBasemap, 1);
    });

    //end code for adding draggability to infoWindow

    function toggleLoadingScreen(){
        //only works for the siteInfoDiv as written
        if ( $("#siteInfoPanel").hasClass("content-loading") ){
            $("#siteInfoPanel").removeClass("content-loading");
        } else {
            $("#siteInfoPanel").addClass("content-loading");
        }  
    }

    function createPanel(){
        // Using Lobipanel: https://github.com/arboshiki/lobipanel
        $("#siteInfoDiv").lobiPanel({
            unpin: false,
            reload: false,
            minimize: false,
            close: false,
            expand: false,
            editTitle: false,
            maxWidth: 800,
            maxHeight: 800
        });
        
        //only create buttons if they don't already exist
        // if ( $("#siteInfoClose").length == 0 ) {
        //     $("#siteInfoDiv .dropdown").prepend("<div id='siteInfoClose' title='close'><b>X</b></div>");
        //     $("#siteInfoDiv .dropdown").prepend("<div id='siteInfoMin' title='collapse'><b>_</b></div>");
        // }

        var instance = $('#siteInfoDiv').data('lobiPanel');
                var docHeight = $("#mapDiv").height();
                var docWidth = $("#mapDiv").width();

                var instanceX = event.x;
                var instanceY = event.y;

                //rough adjust to keep panel more central in map
                if ( (docWidth*0.5 ) <= event.x){
                    //for clicks in right half of map
                    instanceX = event.x - $('#siteInfoDiv').width();
                } 
                if ( (docHeight*0.5)  <= event.y){
                    //for clicks in bottom half of map
                    instanceY = event.y - $('#siteInfoDiv').height()*0.65;
                } 

                instance.setPosition(instanceX, instanceY);
                if (instance.isPinned() == true) {
                    instance.unpin();
                }
        

        $("#siteInfoClose").click(function(){
            closeSiteInfo();
        });

    }// END createPanel

    function closeSiteInfo(){
        $("#siteInfoDiv").css("visibility", "hidden");
        $("#chartDiv").empty(); //ensures removal of highcharts elements lurking in DOM
        map.graphics.clear();
    }

    

    $("#siteInfoMin").click(function(){
        $("#siteInfoDiv").css("visibility", "hidden");
    });

   

    $("#siteInfoDiv").resize(function(){
        $("#chartDiv").highcharts().reflow(); //NOTE: this works but it seems to cause a bit of jankiness
    });


    //variable to store listener for custom trend calc button click
    var trendCalcListener;

    map.on('layer-add', function (event) {
        var layer = event.layer.id;
        if ( $('#siteInfoDiv').innerText != "" || $('#siteInfoDiv').innerText != undefined){
            closeSiteInfo();
        }

        if (layer == "trendResults") {

            map.getLayer(layer).on('click', function (event) {

                // Add graphic to highlight clicked site
                map.graphics.clear();
                var symbol = new SimpleMarkerSymbol();
                symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                symbol.setColor(new Color([0,0,0,0.0]));
                symbol.setSize("20");
                var outline = new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([0,255,255]),
                    2
                );
                symbol.setOutline(outline);

                var pt = new Point(event.mapPoint.x,event.mapPoint.y,map.spatialReference)
                var newGraphic = new Graphic(event.graphic.geometry, symbol);
                map.graphics.add(newGraphic);
                
				// Set up Lobipanel for popup
				// Initial set to 'click to calculate'
				if ($('#pvalue').html() == '1'){
					$("#pvalue").html('<i class="text-fade">click to calculate</i>');
					
                }else if ($('#pvalue').html()){
                    //reset pval input
                    $("#pvalue").html('')
                }
                if ($('#slope').html() == '1'){
					$("#slope").html('<i class="text-fade">click to calculate</i>');
					
                }else if ($('#slope').html()){
                    //reset slope input
                    $("#slope").html('')
                }
                createPanel();
                $("#siteInfoDiv").css("visibility", "visible");
                toggleLoadingScreen();
                
                

                var attr = event.graphic.attributes;
                
                // Calculate trend liklihood here. Could possibly use the graphic and work from that. Or just calculate again using the sym_model_year value
                var trendField = "sym_" + $('input[name=trendType]:checked').val() + "_" + $('input[name=trendPeriod]:checked').val();
                var trend = Number(attr[trendField]);
                var trendText;

                if (trend < -0.05) {
                    trendText = "Non-significant trend down";
                } else if (trend >= -0.05 && trend <= -0.000001) {
                    trendText = "Significant trend down";
                } else if (trend > -0.000001 && trend < 0.000001) {
                    trendText = "No trend";
                } else if (trend >= 0.000001 && trend <= 0.05) {
                    trendText = "Significant trend up";
                } else if (trend > 0.05) {
                    trendText = "Non-significant trend up";
                }

                $("#siteInfoTabPane").empty();

                currentLayer = layer;

                if (layer == "trendResults") {
                    var gage_class;
                    if (attr.trend_gages_gage_class == "HCDN") {
                        gage_class = "Reference";
                    } else {
                        gage_class = attr.trend_gages_gage_class;
                    }
                    currentSiteNo = attr.trend_gages_site_id;
                    $("#siteInfoTabPane").append(
						"<b>Station Name: </b>" + attr.trend_gages_station_nm + "<br/>" +
                        "<b>Site number: </b>" + attr.trend_gages_site_id + "<br/>" +
                        /*"<b>Agency: </b>U.S. Geological Survey<br/>" +*/
                        "<b>Gage class: </b>" + gage_class + "<br/>" +
                        "<b>Latitude: </b>" + attr.trend_gages_dec_lat_va + "<br/>" +
                        "<b>Longitude: </b>" + attr.trend_gages_dec_long_va + "<br/>" +
                        "<b>Drainage area: </b>" + attr.trend_gages_drainSqKm + " (km<sup>2</sup>)<br/>" +
                        "<b>Trend: </b>" + trendText);
                }

                var trendLayerForQuery;

                var trendConfig = [
                    {
                        "layerSelected": "lowQ_1day",
                        "mapLayer": "1",
                        "chartTitle": "Low Q - 1 day",
                        "yAxis": "Stream Flow (cfs)",
                        "tooltipUnits": "cfs"
                    },
                    {
                        "layerSelected": "lowQ_3day",
                        "mapLayer": "6",
                        "chartTitle": "Low Q - 3 day",
                        "yAxis": "Stream Flow (cfs)",
                        "tooltipUnits": "cfs"
                    },
                    {
                        "layerSelected": "lowQ_7day",
                        "mapLayer": "5",
                        "chartTitle": "Low Q - 7 day",
                        "yAxis": "Stream Flow (cfs)",
                        "tooltipUnits": "cfs"
                    },
                   /*  {
                        "layerSelected": "zeroQ_nDays",
                        "mapLayer": "2",
                        "chartTitle": "Zero Q - nDays",
                        "yAxis": "Days",
                        "tooltipUnits": "days"
                    }, */
                    {
                        "layerSelected": "peak_flows",
                        "mapLayer": "3",
                        "chartTitle": "Peak Flows",
                        "yAxis": "Stream Flow (cfs)",
                        "tooltipUnits": "cfs"
                    },
                    {
                        "layerSelected": "mean_annual_Q",
                        "mapLayer": "4",
                        "chartTitle": "Mean Annual Q",
                        "yAxis": "Stream Flow (cfs)",
                        "tooltipUnits": "cfs"
                    }
                ];

                $.each(trendConfig, function(index, object) {
                    if (document.getElementById("layerSelect").options[document.getElementById("layerSelect").selectedIndex].value == trendConfig[index].layerSelected) {
                        trendLayerForQuery = index;
                    }
                });

                var xMin;

                switch($('input[name="trendPeriod"]:checked').val()) {
                    case "1916":
                        xMin = 1916;
                        break;
                    case "1941":
                        xMin = 1941
                        break;
                    case "1966":
                        xMin = 1966
                            break;
                    default:
                        // code block
                  }
                
                //get scatterplot data + build plot

                if (trendLayerForQuery != null || trendLayerForQuery != undefined){
                    //enable chartTab if it was previously turned off
                    if ( $('#chartTab').attr('data-toggle') == undefined ){
                        $('#chartTab').attr('data-toggle', 'tab').css('cursor', 'default');
                        $('#chartTab').show();
                    }
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: map.getLayer("trendsByYear").url + "/" + trendConfig[trendLayerForQuery].mapLayer + "/query?where=site_id+%3D+%27" + attr.trend_gages_site_id + "%27&outFields=*&f=json",
                        headers: {'Accept': '*/*'},
                        success: function (data) {
    
                            trends_by_year_array = [];
                            
                            $.each(data.features[0].attributes, function(field, value) {
                                if (value != "NA" && field != "site_id") {
                                    var year = Number(field.split("_yr")[0]);
                                    if (year >= xMin) {
                                        trends_by_year_array.push([year, Number(value)]);
                                    }
                                }
                            });
    
                            if (scatterPlot !== undefined) {
                                scatterPlot.destroy();
                            }
    
                            scatterPlot = new Highcharts.chart('chartDiv', {
                                chart: {
                                    type: 'scatter',
                                    zoomType: 'xy'
                                },
								responsive: {  
									rules: [{  
										condition: {  
											maxWidth: 470  
										},  
									}]  
								},
                                title: {
                                    text: trendConfig[trendLayerForQuery].chartTitle
                                },
                                subtitle: {
                                    text: 'data'
                                },
                                credits: {
                                    enabled: false
                                },
                                xAxis: {
                                    title: {
                                        enabled: true,
                                        text: 'Year'
                                    },
                                    startOnTick: false,
                                    endOnTick: false,
                                    showLastLabel: true,
                                    min: xMin
                                },
                                yAxis: {
                                    title: {
                                        text: trendConfig[trendLayerForQuery].yAxis
                                    }
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'left',
                                    verticalAlign: 'top',
                                    x: 100,
                                    y: 70,
                                    floating: true,
                                    backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                                    borderWidth: 1
                                },
                                plotOptions: {
                                    scatter: {
                                        marker: {
                                            radius: 5,
                                            states: {
                                                hover: {
                                                    enabled: true,
                                                    lineColor: 'rgb(100,100,100)'
                                                }
                                            }
                                        },
                                        states: {
                                            hover: {
                                                marker: {
                                                    enabled: false
                                                }
                                            }
                                        },
                                        tooltip: {
                                            headerFormat: '<b>' + trendConfig[trendLayerForQuery].chartTitle + '</b><br>',
                                            pointFormat: '{point.x}, {point.y} ' + trendConfig[trendLayerForQuery].tooltipUnits
                                        }
                                    }
                                },
                                series: [{
                                    name: trendConfig[trendLayerForQuery].yAxis,
                                    color: 'rgba(223, 83, 83, .5)',
                                    data: trends_by_year_array
                                }]
                            });
    
                            $( "#trend-period-slider" ).slider({
                                range: true,
                                min: xMin,
                                max: 2015,
                                values: [ xMin, 2015 ],
                                slide: function( event, ui ) {
                                    $( "#years" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                                    scatterPlot.update({
                                        xAxis: {
                                            min: ui.values[0],
                                            max: ui.values[1]
                                        }
                                    });
                                    if( scatterPlot.get('trend-line') !== undefined ){
                                        //remove old pval and trend lines after slider moves
                                        //scatterPlot.get('py-trend-line').remove();
                                        scatterPlot.get('trend-line').remove();
                                        $("#pvalue").html('<i class="text-fade">click to calculate</i>');
                                        $("#slope").html('<i class="text-fade">click to calculate</i>');
                                    }
                                }
                            });
    
                            $( "#years" ).text( $( "#trend-period-slider" ).slider( "values", 0 ) + " - " + $( "#trend-period-slider" ).slider( "values", 1 ) );
    
                        },
                        error: function (error) {
                            console.log("Error processing the JSON. The error is:" + error);
                        }
                    });
                    toggleLoadingScreen();
                } else{
                    //Switch to SiteInfoTab and Disable chart tab for layers without chart data.
                    $('.nav-tabs a[href="#siteInfoTabPane"]').tab('show');
                    $('#chartTab').removeAttr('data-toggle').css('cursor', 'not-allowed');
                    $('#chartTab').hide();
                    toggleLoadingScreen();
                }
            });

            if (trendCalcListener === undefined) {

                trendCalcListener = $("#trendCalcButton").click(function(evt) {
                    toggleLoadingScreen();

                    /*require(["dojo/node!ml-regression-theil-sen"], function(thielSen){
                        
                        var inputs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                        var outputs = [2, 3, 4, 20, 6, 7, 8, 9, 10];

                        var regression = new thielSen(inputs, outputs);
                        var y = regression.predict(85);

                        console.log("y:", y);

                    });*/
                    
                    var inputs = [];
                    var outputs = [];
                    var forPCalc = [];
                    var firstY = trends_by_year_array[0][1];

                    $.each(trends_by_year_array, function(index, value) {
                        if (value[0] >= scatterPlot.xAxis[0].min && value[0] <= scatterPlot.xAxis[0].max) {
                            inputs.push(value[0]);
                            outputs.push(value[1]);
                            if (index % 2 == 1 || index == 1) {
                                //forPCalc.push([value[0],value[1]-firstY]);
                                forPCalc.push([trends_by_year_array[index-1][1],trends_by_year_array[index][1]]);
                            } /*else if (index == trends_by_year_array.length - 1) {
                                //forPCalc.push([value[0],firstY]);
                                forPCalc.push([value[0],value[1]]);
                            }*/
                        }
                    });

                    //var jstat = this.jStat([[1, 2], [3, 4, 5], [6], [7, 8]]);

                    //var pValues = jStat.tukeyhsd(forPCalc);

                    //TODO: Should probably just change this to use inputs array
                    var begin_year = scatterPlot.xAxis[0].min.toFixed(0);
                    var end_year = scatterPlot.xAxis[0].max.toFixed(0);
                    var s_id = currentSiteNo;
                    var layer_selected = document.getElementById("layerSelect").options[document.getElementById("layerSelect").selectedIndex].value;
                    
                    $.ajax({
                        dataType: 'json',
                        type: 'GET',
                        url: "https://nawqatrends.wim.usgs.gov/thiel-sen-node-service?inputs=" + inputs + "&outputs=" + outputs + "&begin_year=" + begin_year + "&end_year=" + end_year + "&s_id=" + s_id + "&layer_selected=" + layer_selected,
                        headers: {'Accept': '*/*'},
                        success: function (data) {

                            if (scatterPlot.get('trend-line') !== undefined) {
                                scatterPlot.get('trend-line').remove();
                            }
                            if (scatterPlot.get('py-trend-line') !== undefined) {
                                scatterPlot.get('py-trend-line').remove();
                            }

                            //using values from thiel-sen regression
                            scatterPlot.addSeries(
                                {
                                    id: 'trend-line',
                                    name: 'Trend',
                                    type: 'line',
                                    color: 'rgba(0, 0, 0, 1.0)',
                                    marker: {
                                        enabled: false
                                    },
                                    data: [
                                        [inputs[0], data["point-a"]],
                                        [inputs[inputs.length-1], data["point-b"]]
                                    ]
                                });

                            //trend slope handling TODO: get value from thiel-sen calc in service
                            var trendSlopeNum = (data["regg_slope"]).toFixed(2);
                            $("#slope").html(trendSlopeNum.toString() + " cfs/yr");

                            //p value handling
                            var pValNum = Number(data["p_value"]).toFixed(5);
                            $("#pvalue").html(pValNum.toString());
                            toggleLoadingScreen();
                          
                        },
                        error: function (error) {
                            console.log("Error processing the JSON. The error is: ", error);
                            toggleLoadingScreen();
                           
                        }
                    });
                }); //END trendCalcListener
            }
        }
    });

    search_api.create( "geosearch", {
        on_result: function(o) {
            // what to do when a location is found
            // o.result is geojson point feature of location with properties
            // zoom to location
            require(["esri/geometry/Extent"], function(Extent) {
                var noExtents = ["GNIS_MAJOR", "GNIS_MINOR", "ZIPCODE", "AREACODE"];
                var noExtentCheck = noExtents.indexOf(o.result.properties["Source"])
                $("#geosearchModal").modal('hide');
                if (noExtentCheck == -1) {
                    map.setExtent(
                        new esri.geometry.Extent({
                            xmin: o.result.properties.LonMin,
                            ymin: o.result.properties.LatMin,
                            xmax: o.result.properties.LonMax,
                            ymax: o.result.properties.LatMax,
                            spatialReference: {wkid :4326}
                        }),
                        true
                    );
                } else {
                    require( ["esri/geometry/Point"], function(Point) {
                        map.centerAndZoom(
                            new Point( o.result.properties.Lon, o.result.properties.Lat ),
                            12
                        );
                    });
                }
            });
             
        },
        "include_usgs_sw": true,
        "include_usgs_gw": true,
        "include_usgs_sp": true,
        "include_usgs_at": true,
        "include_usgs_ot": true,
        "include_huc2": true,
        "include_huc4": true,
        "include_huc6": true,
        "include_huc8": true,
        "include_huc10": true,
        "include_huc12": true,
        
    });

    // Symbols
    var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24);

    map.on('load', function (){
        map.infoWindow.set('highlight', false);
        map.infoWindow.set('titleInBody', false);
    });

    // Geosearch functions
    /* on(dom.byId('btnGeosearch'),'click', geosearch); */

    // Optionally confine search to map extent
    function setSearchExtent (){
        if (dom.byId('chkExtent').checked === 1) {
            geocoder.activeGeocoder.searchExtent = map.extent;
        } else {
            geocoder.activeGeocoder.searchExtent = null;
        }
    }
    function geosearch() {
        setSearchExtent();
        var def = geocoder.find();
        def.then(function (res){
            geocodeResults(res);
        });
        // Close modal
        $('#geosearchModal').modal('hide');
    }
    function geocodeSelect(item) {
        clearFindGraphics();
        var g = (item.graphic ? item.graphic : item.result.feature);
        g.setSymbol(sym);
        //addPlaceGraphic(item.result,g.symbol);
        // Close modal
        //$('#geosearchModal').modal('hide');
    }
    function geocodeResults(places) {

        places = places.results;
        if (places.length > 0) {
            clearFindGraphics();
            var symbol = sym;
            // Create and add graphics with pop-ups
            for (var i = 0; i < places.length; i++) {
                //addPlaceGraphic(places[i], symbol);
            }
            //zoomToPlaces(places);
            var centerPoint = new Point(places[0].feature.geometry);
            map.centerAndZoom(centerPoint, 17);
            //map.setLevel(15);

        } else {
            //alert('Sorry, address or place not found.');  // TODO
        }
    }
    function stripTitle(title) {
        var i = title.indexOf(',');
        if (i > 0) {
            title = title.substring(0,i);
        }
        return title;
    }
    function addPlaceGraphic(item,symbol)  {
        var place = {};
        var attributes,infoTemplate,pt,graphic;
        pt = item.feature.geometry;
        place.address = item.name;
        place.score = item.feature.attributes.Score;
        // Graphic components
        attributes = { address:stripTitle(place.address), score:place.score, lat:pt.getLatitude().toFixed(2), lon:pt.getLongitude().toFixed(2) };
        infoTemplate = new PopupTemplate({title:'{address}', description: 'Latitude: {lat}<br/>Longitude: {lon}'});
        graphic = new Graphic(pt,symbol,attributes,infoTemplate);
        // Add to map
        map.graphics.add(graphic);
    }

    function zoomToPlaces(places) {
        var multiPoint = new Multipoint(map.spatialReference);
        for (var i = 0; i < places.length; i++) {
            multiPoint.addPoint(places[i].feature.geometry);
        }
        map.setExtent(multiPoint.getExtent().expand(2.0));
    }

    function clearFindGraphics() {
        map.infoWindow.hide();
        map.graphics.clear();
    }

    function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
        return new PictureMarkerSymbol(
            {
                'angle': 0,
                'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                'url': url,
                'contentType': 'image/png',
                'width':xWidth, 'height': yHeight
            });
    }

    // Show modal dialog; handle legend sizing (both on doc ready)
    $(document).ready(function(){
        function showModal() {
            $('#geosearchModal').modal('show');
        }
        // Geosearch nav menu is selected
        $('#geosearchNav').click(function(){
            showModal();
        });

        function showAboutModal () {
            $('#aboutModal').modal('show');
        }
        $('#aboutNav').click(function(){
            showAboutModal();
        });

        // Show User Guide
        $('.showUserGuide').click(function(){
            $('#searchTab').trigger('click');
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
        });
        // Show User Guide tab2
        $('.showUserGuide2').click(function(){
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
            $('#iconTab').trigger('click');
            //console.log("Opening tab 2 user guide");
        });
        // Show User Guide tab3
        $('.showUserGuide3').click(function(){
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
            //console.log("Opening tab 3 user guide");
            $('#layersTab').trigger('click');
        });
        $('#userGuideNav').click(function(){
            $('#userGuideModal').modal('show');
            $('#searchTab').trigger('click');
        });
        $('#trendResultHelp').click(function(){
            $('#trendResultsHelpBox').slideToggle(200);
        });
        $('#faqNav').click(function(){
            $('#faqModal').modal('show');
        });

        $("#html").niceScroll();
        $("#sidebar").niceScroll();
        $("#sidebar").scroll(function () {
            $("#sidebar").getNiceScroll().resize();
        });

        $("#legendDiv").niceScroll();

        maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
        $('#legendElement').css('max-height', maxLegendHeight);

        $('#legendCollapse').on('shown.bs.collapse', function () {
            maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);
        });

        $('#legendCollapse').on('hide.bs.collapse', function () {
            $('#legendElement').css('height', 'initial');
        });

        // FAQ Toggle
		$('.faq-header').click(function(){
			$(this).next('.faq-body').slideToggle(250);
		});

        $('.fullsize').click(function(){
            //var data = "<img src='"+$(this).attr('src')+"'/>";
            var myWindow = window.open($(this).attr('src'),"_blank");
            myWindow.focus();
		});
		

		// Tooltips to open help modal
		$('#thielSenHelp').click(function(){
            $('#faqModal').modal('show');
			$("#faq12body").slideDown(250);
			$('#faqModalBody').scroll();
			$("#faqModalBody").animate({
				scrollTop: 600
			}, 500);
		});
		$('#indeHelp').click(function(){
            $('#faqModal').modal('show');
			$("#faq6body").slideDown(250);
			$('#faqModalBody').scroll();
			$("#faqModalBody").animate({
				scrollTop: 250
			}, 500);
		});	


	});
	

    function printMap() {

        var printParams = new PrintParameters();
        printParams.map = map;

        var template = new PrintTemplate();
        template.exportOptions = {
            width: 500,
            height: 400,
            dpi: 300
        };
        template.format = "PDF";
        template.layout = "TEMPLATE NAME HERE" //"Letter ANSI A Landscape sw-trends fix";
        template.preserveScale = false;
        var trendsLegendLayer = new LegendLayer();
        trendsLegendLayer.layerId = "1";
        //legendLayer.subLayerIds = [*];

        var legendLayers = [];
        //legendLayers.push(trendsLegendLayer);

        var printTitle = getPrintTitle();

        template.layoutOptions = {
            "titleText": printTitle,
            "authorText" : "",
            "copyrightText": "This page was produced by the surface water flow trends mapper",
            "legendLayers": legendLayers
        }

        var docTitle = template.layoutOptions.titleText;

        printParams.template = template;
        var printMap = new PrintTask("https://gis.wim.usgs.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task");
        //uncomment when ready to execute print
        //printMap.execute(printParams, printDone, printError);

        function printDone(event) {
            //alert(event.url);
            //window.open(event.url, "_blank");
            printCount++;
            //var printJob = $('<a href="'+ event.url +'" target="_blank">Printout ' + printCount + ' </a>');
            var printJob = $('<p><label>' + printCount + ': </label>&nbsp;&nbsp;<a href="'+ event.url +'" target="_blank">' + docTitle +' </a></p>');
            //$("#print-form").append(printJob);
            $("#printJobsDiv").find("p.toRemove").remove();
            $("#printModalBody").append(printJob);
            $("#printTitle").val("");
            $("#printExecuteButton").button('reset');
        }

        function printError(event) {
            alert("Sorry, an unclear print error occurred. Please try refreshing the application to fix the problem");
        }
    }

    require([
        'esri/dijit/Legend',
        'esri/tasks/locator',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/graphicsUtils',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/SpatialReference',
        'esri/layers/WMSLayer',
        'esri/layers/WMSLayerInfo',
        'dijit/form/CheckBox',
        'dijit/form/RadioButton',
        'dojo/query',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/on'
    ], function(
        Legend,
        Locator,
        Query,
        QueryTask,
        graphicsUtils,
        Point,
        Extent,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        SpatialReference,
        WMSLayer,
        WMSLayerInfo,
        CheckBox,
        RadioButton,
        query,
        dom,
        domClass,
        domConstruct,
        domStyle,
        on
    ) {

        var legendLayers = [];
        var layersObject = [];
        var layerArray = [];
        var staticLegendImage;
        var identifyTask, identifyParams;
        var navToolbar;
        var locator;

        //create global layers lookup
        var mapLayers = [];

        $.each(allLayers, function (index,group) {
            //console.log('processing: ', group.groupHeading)


            //sub-loop over layers within this groupType
            $.each(group.layers, function (layerName,layerDetails) {

                var legendLayerName = layerName; 
                if (legendLayerName == "lowQ_1Day" || legendLayerName == "lowQ_3Days" || legendLayerName == "lowQ_7Day" || legendLayerName == "mean_annual" || legendLayerName == "peak_square_data" || legendLayerName == "zeroQ_nDays") {
                  legendLayerName = layerName; 
                }
                //check for exclusiveGroup for this layer
                var exclusiveGroupName = '';
                if (layerDetails.wimOptions.exclusiveGroupName) {
                    exclusiveGroupName = layerDetails.wimOptions.exclusiveGroupName;
                }

                if (layerDetails.wimOptions.layerType === 'agisFeature') {
                    var layer = new FeatureLayer(layerDetails.url, layerDetails.options);
                    if (layerDetails.wimOptions.renderer !== undefined) {
                        layer.setRenderer(layerDetails.wimOptions.renderer);
                    }
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisWMS') {
                    var layer = new WMSLayer(layerDetails.url, {resourceInfo: layerDetails.options.resourceInfo, visibleLayers: layerDetails.options.visibleLayers }, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisDynamic') {
                    var layer = new ArcGISDynamicMapServiceLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    if (layerDetails.wimOptions && layerDetails.wimOptions.layerDefinitions) {
                        var layerDefs = [];
                        $.each(layerDetails.wimOptions.layerDefinitions, function (index, def) {
                            layerDefs[index] = def;
                        });
                        layer.setLayerDefinitions(layerDefs);
                    }
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisImage') {
                    var layer = new ArcGISImageServiceLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }
            });
        });

        function addLayer(groupHeading, showGroupHeading, layer, layerName, exclusiveGroupName, options, wimOptions) {

            //add layer to map
            //layer.addTo(map);
            map.addLayer(layer);

            //add layer to layer list
            mapLayers.push([exclusiveGroupName,camelize(layerName),layer]);

            //check if its an exclusiveGroup item
            if (exclusiveGroupName) {

                if (!$('#' + camelize(exclusiveGroupName)).length) {
                    var exGroupRoot;
                    if (exclusiveGroupName == "Data Source") {
                        var exGroupRoot = $('<div id="' + camelize(exclusiveGroupName +" Root") + '" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan far fa-check-square"></i>&nbsp;&nbsp;' + exclusiveGroupName + '<span id="info' + camelize(exclusiveGroupName) + '" title="Data Source identifies the scale, year and emulsion of the imagery that was used to map the wetlands and riparian areas for a given area. It also identifies areas that have Scalable data, which is an interim data product in areas of the nation where standard compliant wetland data is not yet available. Click for more info on Scalable data." class="glyphspan far fa-question pull-right"></span><span id="opacity' + camelize(exclusiveGroupName) + '" style="padding-right: 5px" class="glyphspan far fa-adjust pull-right"></span></button> </div>');
                    } else {
                        var exGroupRoot = $('<div id="' + camelize(exclusiveGroupName +" Root") + '" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default "  style="font-weight: bold;text-align: left"><i class="glyphspan far fa-square"></i>&nbsp;&nbsp;' + exclusiveGroupName + '</button> </div>');
                    }

                    exGroupRoot.click(function(e) {
                        exGroupRoot.find('i.glyphspan').toggleClass('fa-check-square fa-square');

                        $.each(mapLayers, function (index, currentLayer) {

                            var tempLayer = map.getLayer(currentLayer[2].id);

                            if (currentLayer[0] == exclusiveGroupName) {
                                if ($("#" + currentLayer[1]).find('i.glyphspan').hasClass('fa-dot-circle') && exGroupRoot.find('i.glyphspan').hasClass('fa-check-square')) {
                                    //console.log('adding layer: ',currentLayer[1]);
                                    map.addLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(true);
                                } else if (exGroupRoot.find('i.glyphspan').hasClass('fa-square')) {
                                    //console.log('removing layer: ',currentLayer[1]);
                                    //map.removeLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(false);
                                }
                            }

                        });
                    });

                    var exGroupDiv = $('<div id="' + camelize(exclusiveGroupName) + '" class="btn-group-vertical" data-toggle="buttons"></div>');
                    $('#toggle').append(exGroupDiv);
                    //console.log('here');
                }

                //create radio button
                //var button = $('<input type="radio" name="' + camelize(exclusiveGroupName) + '" value="' + camelize(layerName) + '"checked>' + layerName + '</input></br>');
                if (layer.visible) {
                    var button = $('<div id="' + camelize(layerName) + '" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"> <label class="btn btn-default"  style="font-weight: bold;text-align: left"> <input type="radio" name="' + camelize(exclusiveGroupName) + '" autocomplete="off"><i class="glyphspan fa fa-dot-circle ' + camelize(exclusiveGroupName) + '"></i>&nbsp;&nbsp;' + layerName + '</label> </div>');
                } else {
                    var button = $('<div id="' + camelize(layerName) + '" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"> <label class="btn btn-default"  style="font-weight: bold;text-align: left"> <input type="radio" name="' + camelize(exclusiveGroupName) + '" autocomplete="off"><i class="glyphspan fa fa-circle ' + camelize(exclusiveGroupName) + '"></i>&nbsp;&nbsp;' + layerName + '</label> </div>');
                }

                $('#' + camelize(exclusiveGroupName)).append(button);

                //click listener for radio button
                button.click(function(e) {

                    if ($(this).find('i.glyphspan').hasClass('fa-circle')) {
                        $(this).find('i.glyphspan').toggleClass('fa-dot-circle fa-circle');

                        var newLayer = $(this)[0].id;

                        $.each(mapLayers, function (index, currentLayer) {

                            if (currentLayer[0] == exclusiveGroupName) {
                                if (currentLayer[1] == newLayer && $("#" + camelize(exclusiveGroupName + " Root")).find('i.glyphspan').hasClass('fa-check-square')) {
                                    console.log('adding layer: ',currentLayer[1]);
                                    map.addLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(true);
                                    ////$('#' + camelize(currentLayer[1])).toggle();
                                }
                                else if (currentLayer[1] == newLayer && $("#" + camelize(exclusiveGroupName + " Root")).find('i.glyphspan').hasClass('fa-square')) {
                                    console.log('group heading not checked');
                                }
                                else {
                                    //console.log('removing layer: ',currentLayer[1]);
                                    //map.removeLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(false);
                                    if ($("#" + currentLayer[1]).find('i.glyphspan').hasClass('fa-dot-circle')) {
                                        $("#" + currentLayer[1]).find('i.glyphspan').toggleClass('fa-dot-circle fa-circle');
                                    }
                                    //$('#' + camelize(this[1])).toggle();
                                }
                            }
                        });
                    }
                });
            }

            ////not an exclusive group item
            else if (wimOptions.includeInLayerList) {

                //create layer toggle
                //var button = $('<div align="left" style="cursor: pointer;padding:5px;"><span class="glyphspan glyphicon glyphicon-check"></span>&nbsp;&nbsp;' + layerName + '</div>');
                if ((layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');
                } else if ((!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');
                } else if (layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');
                } else if ((!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');
                } else if ((layer.visible && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');
                } else if ((!layer.visible && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');
                } else if (layer.visible) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;' + layerName + '</button></span></div>');
                } else {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;' + layerName + '</button> </div>');
                }


                //click listener for regular
                button.click(function(e) {

                    //toggle checkmark
                    $(this).find('i.glyphspan').toggleClass('fa-check-square fa-square');
                    $(this).find('button').button('toggle');



                    //$('#' + camelize(layerName)).toggle();

                    //layer toggle
                    if (layer.visible) {
                        layer.setVisibility(false);
                    } else {
                        layer.setVisibility(true);
                    }

                    if (wimOptions.otherLayersToggled) {
                        $.each(wimOptions.otherLayersToggled, function (key, value) {
                            var lyr = map.getLayer(value);
                            lyr.setVisibility(layer.visible);
                        });
                    }

                });
            }

            //group heading logic
            if (showGroupHeading !== undefined) {

                //camelize it for divID
                var groupDivID = camelize(groupHeading);

                //check to see if this group already exists
                if (!$('#' + groupDivID).length) {
                    //if it doesn't add the header
                    if (showGroupHeading) {
                        var groupDiv = $('<div id="' + groupDivID + '"><div class="alert alert-info" role="alert"><strong>' + groupHeading + '</strong></div></div>');
                    } else {
                        var groupDiv = $('<div id="' + groupDivID + '"></div>');
                    }
                    $('#toggle').append(groupDiv);
                }

                //if it does already exist, append to it

                if (exclusiveGroupName) {
                    //if (!exGroupRoot.length)$("#slider"+camelize(layerName))
                    $('#' + groupDivID).append(exGroupRoot);
                    $('#' + groupDivID).append(exGroupDiv);
                    if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                        var id = "#info" + camelize(exclusiveGroupName);
                        var moreinfo = $(id);
                        moreinfo.click(function(e) {
                            window.open(wimOptions.moreinfo, "_blank");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    if ($("#opacity"+camelize(exclusiveGroupName)).length > 0) {
                        var id = "#opacity" + camelize(exclusiveGroupName);
                        var opacity = $(id);
                        opacity.click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(".opacitySlider").remove();
                            var currOpacity = map.getLayer(options.id).opacity;
                            var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                            $("body").append(slider);
                            $("#slider")[0].value = currOpacity * 100;
                            $(".opacitySlider").css('left', event.clientX - 180);
                            $(".opacitySlider").css('top', event.clientY - 50);

                            $(".opacitySlider").mouseleave(function () {
                                $(".opacitySlider").remove();
                            });

                            $(".opacityClose").click(function () {
                                $(".opacitySlider").remove();
                            });
                            $('#slider').change(function (event) {
                                //get the value of the slider with this call
                                var o = ($('#slider')[0].value) / 100;
                                //console.log("o: " + o);
                                $("#opacityValue").html("Opacity: " + o)
                                map.getLayer(options.id).setOpacity(o);

                                if (wimOptions.otherLayersToggled) {
                                    $.each(wimOptions.otherLayersToggled, function (key, value) {
                                        var lyr = map.getLayer(value);
                                        lyr.setOpacity(o);
                                    });
                                }
                                //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                                //var e = '#' + $(this).attr('data-wjs-element');
                                //$(e).css('opacity', o)
                            });

                        });
                    }
                } else {
                    $('#' + groupDivID).append(button);
                    if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                        var id = "#info" + camelize(layerName);
                        var moreinfo = $(id);
                        moreinfo.click(function(e) {
                            window.open(wimOptions.moreinfo, "_blank");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    if ($("#opacity"+camelize(layerName)).length > 0) {
                        $("#opacity"+camelize(layerName)).click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(".opacitySlider").remove();
                            var currOpacity = map.getLayer(options.id).opacity;
                            var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                            $("body").append(slider);[0]

                            $("#slider")[0].value = currOpacity*100;
                            $(".opacitySlider").css('left', event.clientX-180);
                            $(".opacitySlider").css('top', event.clientY-50);

                            $(".opacitySlider").mouseleave(function() {
                                $(".opacitySlider").remove();
                            });

                            $(".opacityClose").click(function() {
                                $(".opacitySlider").remove();
                            });
                            $('#slider').change(function(event) {
                                //get the value of the slider with this call
                                var o = ($('#slider')[0].value)/100;
                                //console.log("o: " + o);
                                $("#opacityValue").html("Opacity: " + o)
                                map.getLayer(options.id).setOpacity(o);

                                if (wimOptions.otherLayersToggled) {
                                    $.each(wimOptions.otherLayersToggled, function (key, value) {
                                        var lyr = map.getLayer(value);
                                        lyr.setOpacity(o);
                                    });
                                }
                                //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                                //var e = '#' + $(this).attr('data-wjs-element');
                                //$(e).css('opacity', o)
                            });
                        });
                    }
                }
            }

            else {
                //otherwise append
                $('#toggle').append(button);
                if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                    var id = "#info" + camelize(layerName);
                    var moreinfo = $(id);
                    moreinfo.click(function(e) {
                        alert(e.currentTarget.id);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }
        }



        //get visible and non visible layer lists
        function addMapServerLegend(layerName, layerDetails) {


            if (layerDetails.wimOptions.layerType === 'agisFeature') {

                //for feature layer since default icon is used, put that in legend
                var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="https://raw.githubusercontent.com/Leaflet/Leaflet/master/dist/images/marker-icon.png" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItem);

            }

            else if (layerDetails.wimOptions.layerType === 'agisWMS') {

                //for WMS layers, for now just add layer title
                var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="https://placehold.it/25x41" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItem);

            }

            else if (layerDetails.wimOptions.layerType === 'agisDynamic') {

                //create new legend div
                var legendItemDiv = $('<div align="left" id="' + camelize(layerName) + '"><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItemDiv);

                //get legend REST endpoint for swatch
                $.getJSON(layerDetails.url + '/legend?f=json', function (legendResponse) {

                    //console.log(layerName,'legendResponse',legendResponse);



                    //make list of layers for legend
                    if (layerDetails.options.layers) {
                        //console.log(layerName, 'has visisble layers property')
                        //if there is a layers option included, use that
                        var visibleLayers = layerDetails.options.layers;
                    }
                    else {
                        //console.log(layerName, 'no visible layers property',  legendResponse)

                        //create visibleLayers array with everything
                        var visibleLayers = [];
                        $.grep(legendResponse.layers, function(i,v) {
                            visibleLayers.push(v);
                        });
                    }

                    //loop over all map service layers
                    $.each(legendResponse.layers, function (i, legendLayer) {

                        //var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong>');
                        //$('#' + camelize(layerName)).append(legendHeader);

                        //sub-loop over visible layers property
                        $.each(visibleLayers, function (i, visibleLayer) {

                            //console.log(layerName, 'visibleLayer',  visibleLayer);

                            if (visibleLayer == legendLayer.layerId) {

                                //console.log(layerName, visibleLayer,legendLayer.layerId, legendLayer)

                                //console.log($('#' + camelize(layerName)).find('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>'))

                                var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>');
                                $('#' + camelize(layerName)).append(legendHeader);

                                //get legend object
                                var feature = legendLayer.legend;
                                /*
                                 //build legend html for categorized feautres
                                 if (feature.length > 1) {
                                 */

                                //placeholder icon
                                //<img alt="Legend Swatch" src="http://placehold.it/25x41" />

                                $.each(feature, function () {

                                    //make sure there is a legend swatch
                                    if (this.imageData) {
                                        var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + this.imageData + '" /><small>' + this.label.replace('<', '').replace('>', '') + '</small></br>');

                                        $('#' + camelize(layerName)).append(legendFeature);
                                    }
                                });
                                /*
                                 }
                                 //single features
                                 else {
                                 var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + feature[0].imageData + '" /><small>&nbsp;&nbsp;' + legendLayer.layerName + '</small></br>');

                                 //$('#legendDiv').append(legendItem);
                                 $('#' + camelize(layerName)).append(legendFeature);

                                 }
                                 */
                            }
                        }); //each visible layer
                    }); //each legend item
                }); //get legend json
            }
        }
        /* parse layers.js */

        var legend = new Legend({
            map: map,
            layerInfos: legendLayers
        }, "legendDiv");
        legend.startup();
        
        /*var hucLayer;
        hucLayer = map.getLayer("huc8");

        hucLayer.setVisibility(false);*/

    });//end of require statement containing legend building code


});

$(document).ready(function () {
    //7 lines below are handler for the legend buttons. to be removed if we stick with the in-map legend toggle
    //$('#legendButtonNavBar, #legendButtonSidebar').on('click', function () {
    //    $('#legend').toggle();
    //    //return false;
    //});
    //$('#legendClose').on('click', function () {
    //    $('#legend').hide();
    //});
});
