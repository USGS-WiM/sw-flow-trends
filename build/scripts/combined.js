function addCommas(e){e+="";for(var t=e.split("."),a=t[0],i=t.length>1?"."+t[1]:"",n=/(\d+)(\d{3})/;n.test(a);)a=a.replace(n,"$1,$2");return a+i}function camelize(e){return e.replace(/(?:^\w|[A-Z]|\b\w)/g,function(e,t){return 0==t?e.toLowerCase():e.toUpperCase()}).replace(/\s+/g,"")}var allLayers;require(["esri/geometry/Extent","esri/layers/WMSLayerInfo","esri/layers/FeatureLayer","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol","dojo/domReady!"],function(e,t,a,i,n){allLayers=[{groupHeading:"sites",showGroupHeading:!1,includeInLayerList:!1,layers:{"Trend Results":{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/swFlowTrends_test/MapServer/30",options:{id:"trendResults",opacity:1,mode:a.MODE_SNAPSHOT,outFields:["*"],visible:!0},wimOptions:{type:"layer",layerType:"agisFeature",includeInLayerList:!1,hasOpacitySlider:!0,includeLegend:!1}},"For layer info":{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/swFlowTrends_test/MapServer",options:{id:"layerInfo",opacity:1,outFields:["*"],visible:!0},wimOptions:{type:"layer",layerType:"agisDynamic",includeInLayerList:!1,hasOpacitySlider:!0,includeLegend:!0}},trends_by_year:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWFlowTrends/trends_by_year/MapServer/",options:{id:"trendsByYear",opacity:0,outFields:["*"],visible:!1},wimOptions:{type:"layer",layerType:"agisDynamic",includeInLayerList:!1,hasOpacitySlider:!0,includeLegend:!0}},2012:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu2012_100515_test/ImageServer",options:{id:"lu2012",opacity:.5,visible:!1},wimOptions:{type:"layer",layerType:"agisImage",includeInLayerList:!0,exclusiveGroupName:"Display Land Use",hasOpacitySlider:!0,includeLegend:!0}},2002:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu2002_100515_test/ImageServer",options:{id:"lu2002",opacity:.5,visible:!1},wimOptions:{type:"layer",layerType:"agisImage",includeInLayerList:!0,exclusiveGroupName:"Display Land Use",hasOpacitySlider:!0,includeLegend:!0}},1992:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu1992_100515_test/ImageServer",options:{id:"lu1992",opacity:.5,visible:!1},wimOptions:{type:"layer",layerType:"agisImage",includeInLayerList:!0,exclusiveGroupName:"Display Land Use",hasOpacitySlider:!0,includeLegend:!0}},1982:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu1982_100515_test/ImageServer",options:{id:"lu1982",opacity:.5,visible:!1},wimOptions:{type:"layer",layerType:"agisImage",includeInLayerList:!0,exclusiveGroupName:"Display Land Use",hasOpacitySlider:!0,includeLegend:!0}},1974:{url:"https://gis.wim.usgs.gov/arcgis/rest/services/SWTrends/lu1974_100515_test/ImageServer",options:{id:"lu1974",opacity:.5,visible:!1},wimOptions:{type:"layer",layerType:"agisImage",includeInLayerList:!0,exclusiveGroupName:"Display Land Use",hasOpacitySlider:!0,includeLegend:!0}}}}]});var map,allLayers,maxLegendHeight,maxLegendDivHeight,printCount=0,dragInfoWindows=!0,defaultMapCenter=[-94.106,35.729],constObj,currentConstType="",currentSiteNo="",currentConst="Total Phosphorus",currentLayer="wrtdsSites",identifyTask,identifyParams,trendLayerInfos=[],scatterPlot,trends_by_year_array;require(["esri/arcgis/utils","esri/Color","esri/map","esri/dijit/HomeButton","esri/dijit/LocateButton","esri/layers/ArcGISImageServiceLayer","esri/layers/ArcGISTiledMapServiceLayer","esri/dijit/Geocoder","esri/dijit/PopupTemplate","esri/graphic","esri/geometry/Multipoint","esri/geometry/Point","esri/graphicsUtils","esri/layers/FeatureLayer","esri/tasks/IdentifyParameters","esri/tasks/IdentifyTask","esri/symbols/PictureMarkerSymbol","esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleMarkerSymbol","esri/tasks/LegendLayer","esri/tasks/PrintTask","esri/tasks/PrintParameters","esri/tasks/PrintTemplate","esri/tasks/query","esri/geometry/webMercatorUtils","dojo/dnd/Moveable","dojo/query","dojo/dom","dojo/dom-class","dojo/on","dojo/domReady!"],function(e,t,a,i,n,s,r,o,l,c,d,p,u,y,g,m,f,h,v,b,w,L,S,x,T,_,k,I,O,M,P){function D(){var e="";return e}function q(){$("#siteInfoPanel").hasClass("content-loading")?$("#siteInfoPanel").removeClass("content-loading"):$("#siteInfoPanel").addClass("content-loading")}function C(){$("#siteInfoDiv").lobiPanel({unpin:!1,reload:!1,minimize:!1,close:!1,expand:!1,editTitle:!1,maxWidth:800,maxHeight:800});var e=$("#siteInfoDiv").data("lobiPanel"),t=$("#mapDiv").height(),a=$("#mapDiv").width(),i=event.x,n=event.y;.5*a<=event.x&&(i=event.x-$("#siteInfoDiv").width()),.5*t<=event.y&&(n=event.y-.65*$("#siteInfoDiv").height()),e.setPosition(i,n),1==e.isPinned()&&e.unpin(),$("#siteInfoClose").click(function(){N()})}function N(){$("#siteInfoDiv").css("visibility","hidden"),$("#chartDiv").empty(),map.graphics.clear()}function E(){$("#geosearchModal").modal("show")}function z(e,t,a,i,n){return new f({angle:0,xoffset:t,yoffset:a,type:"esriPMS",url:e,contentType:"image/png",width:i,height:n})}function F(){var e=new S;e.map=map;var t=new x;t.exportOptions={width:500,height:400,dpi:300},t.format="PDF",t.layout="TEMPLATE NAME HERE",t.preserveScale=!1;var a=new w;a.layerId="1";var i=[],n=D();t.layoutOptions={titleText:n,authorText:"",copyrightText:"This page was produced by the surface water flow trends mapper",legendLayers:i};t.layoutOptions.titleText;e.template=t;new L("https://gis.wim.usgs.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task")}if(!jQuery.support.cors&&window.XDomainRequest){var j=/^https?:\/\//i,B=/^get|post$/i,A=new RegExp("^"+location.protocol,"i"),G=/\/xml/i;jQuery.ajaxTransport("text html xml json",function(e,t,a){if(e.crossDomain&&e.async&&B.test(e.type)&&j.test(t.url)&&A.test(t.url)){var i=null,n=(t.dataType||"").toLowerCase();return{send:function(a,s){i=new XDomainRequest,/^\d+$/.test(t.timeout)&&(i.timeout=t.timeout),i.ontimeout=function(){s(500,"timeout")},i.onload=function(){var e="Content-Length: "+i.responseText.length+"\r\nContent-Type: "+i.contentType,t={code:200,message:"success"},a={text:i.responseText};try{if("json"===n)try{a.json=JSON.parse(i.responseText)}catch(r){t.code=500,t.message="parseerror"}else if("xml"===n||"text"!==n&&G.test(i.contentType)){var o=new ActiveXObject("Microsoft.XMLDOM");o.async=!0;try{o.loadXML(i.responseText)}catch(r){o=void 0}if(!o||!o.documentElement||o.getElementsByTagName("parsererror").length)throw t.code=500,t.message="parseerror","Invalid XML: "+i.responseText;a.xml=o}}catch(l){throw l}finally{s(t.code,t.message,a,e)}},i.onerror=function(){s(500,"error",{text:i.responseText})},i.open(e.type,e.url),i.send()},abort:function(){i&&i.abort()}}}})}jQuery.support.cors=!0,map=a("mapDiv",{basemap:"topo",center:defaultMapCenter,zoom:5});var H=new i({map:map},"homeButton");H.startup();var R=new n({map:map},"locateButton");R.startup(),$("#legendButton").click(),$(window).resize(function(){}),$("#IEwarnContinue").click(function(){$("#aboutModal").modal({backdrop:"static"}),$("#aboutModal").modal("show")}),-1!==navigator.userAgent.indexOf("MSIE")||navigator.appVersion.indexOf("Trident/")>0?$("#IEwarningModal").modal("show"):($("#aboutModal").modal({backdrop:"static"}),$("#aboutModal").modal("show")),$("#printExecuteButton").click(function(e){e.preventDefault(),$(this).button("loading"),F()}),map.on("extent-change",function(e){}),$("#printNavButton").click(function(){}),$("#layerSelect").change(function(){trendLayerInfos=map.getLayer("layerInfo").layerInfos;var e=document.getElementById("layerSelect").value+"_"+$("input[name=trendType]:checked").val()+"_"+$("input[name=trendPeriod]:checked").val();for(var t in trendLayerInfos)if(trendLayerInfos[t].name==e){map.removeLayer(map.getLayer("trendResults"));var a=new y(map.getLayer("layerInfo").url+"/"+t,{id:"trendResults",opacity:1,mode:y.MODE_SNAPSHOT,outFields:["*"],visible:!0});map.addLayer(a)}gtag("event","filter",{event_category:"Trend Select",event_label:"trend: "+document.getElementById("layerSelect").value+"; time-series: "+$("input[name=trendType]:checked").val()+"; "+$("input[name=trendPeriod]:checked").val(),value:1})}),$(".trendPeriod").on("change",function(e){trendLayerInfos=map.getLayer("layerInfo").layerInfos;var t=document.getElementById("layerSelect").value+"_"+$("input[name=trendType]:checked").val()+"_"+$("input[name=trendPeriod]:checked").val();for(var a in trendLayerInfos)if(trendLayerInfos[a].name==t){map.removeLayer(map.getLayer("trendResults"));var i=new y(map.getLayer("layerInfo").url+"/"+a,{id:"trendResults",opacity:1,mode:y.MODE_SNAPSHOT,outFields:["*"],visible:!0});map.addLayer(i)}gtag("event","filter",{event_category:"Trend Select",event_label:"trend: "+document.getElementById("layerSelect").value+"; time-series: "+$("input[name=trendType]:checked").val()+"; "+$("input[name=trendPeriod]:checked").val(),value:1})}),$(".trendType").on("change",function(e){trendLayerInfos=map.getLayer("layerInfo").layerInfos;var t=document.getElementById("layerSelect").value+"_"+$("input[name=trendType]:checked").val()+"_"+$("input[name=trendPeriod]:checked").val();for(var a in trendLayerInfos)if(trendLayerInfos[a].name==t){map.removeLayer(map.getLayer("trendResults"));var i=new y(map.getLayer("layerInfo").url+"/"+a,{id:"trendResults",opacity:1,mode:y.MODE_SNAPSHOT,outFields:["*"],visible:!0});map.addLayer(i)}gtag("event","filter",{event_category:"Trend Select",event_label:"trend: "+document.getElementById("layerSelect").value+"; time-series: "+$("input[name=trendType]:checked").val()+"; "+$("input[name=trendPeriod]:checked").val(),value:1})}),P(map,"load",function(){var e=map.getScale().toFixed(0);$("#scale")[0].innerHTML=addCommas(e);var t=_.webMercatorToGeographic(map.extent.getCenter());if($("#latitude").html(t.y.toFixed(3)),$("#longitude").html(t.x.toFixed(3)),1==dragInfoWindows){var a=I(".title",map.infoWindow.domNode)[0],i=new k(map.infoWindow.domNode,{handle:a});P(i,"FirstMove",function(){var e=I(".outerPointer",map.infoWindow.domNode)[0];M.add(e,"hidden");var e=I(".pointer",map.infoWindow.domNode)[0];M.add(e,"hidden")}.bind(this))}}),P(map,"zoom-end",function(){var e=map.getScale().toFixed(0);$("#scale")[0].innerHTML=addCommas(e)}),P(map,"mouse-move",function(e){if($("#mapCenterLabel").css("display","none"),null!=e.mapPoint){var t=_.webMercatorToGeographic(e.mapPoint);$("#latitude").html(t.y.toFixed(3)),$("#longitude").html(t.x.toFixed(3))}}),P(map,"pan-end",function(){$("#mapCenterLabel").css("display","inline");var e=_.webMercatorToGeographic(map.extent.getCenter());$("#latitude").html(e.y.toFixed(3)),$("#longitude").html(e.x.toFixed(3))});var W=new r("https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer",{id:"nationalMap"});P(O.byId("btnStreets"),"click",function(){map.setBasemap("streets"),map.removeLayer(W)}),P(O.byId("btnSatellite"),"click",function(){map.setBasemap("satellite"),map.removeLayer(W)}),P(O.byId("btnHybrid"),"click",function(){map.setBasemap("hybrid"),map.removeLayer(W)}),P(O.byId("btnTerrain"),"click",function(){map.setBasemap("terrain"),map.removeLayer(W)}),P(O.byId("btnGray"),"click",function(){map.setBasemap("gray"),map.removeLayer(W)}),P(O.byId("btnNatGeo"),"click",function(){map.setBasemap("national-geographic"),map.removeLayer(W)}),P(O.byId("btnOSM"),"click",function(){map.setBasemap("osm"),map.removeLayer(W)}),P(O.byId("btnTopo"),"click",function(){map.setBasemap("topo"),map.removeLayer(W)}),P(O.byId("btnNatlMap"),"click",function(){map.addLayer(W,1)}),$("#siteInfoMin").click(function(){$("#siteInfoDiv").css("visibility","hidden")}),$("#siteInfoDiv").resize(function(){$("#chartDiv").highcharts().reflow()});var U;map.on("layer-add",function(e){var a=e.layer.id;(""!=$("#siteInfoDiv").innerText||void 0!=$("#siteInfoDiv").innerText)&&N(),"trendResults"==a&&(map.getLayer(a).on("click",function(e){map.graphics.clear();var i=new b;i.setStyle(b.STYLE_SQUARE),i.setColor(new t([0,0,0,0])),i.setSize("20");var n=new v(v.STYLE_SOLID,new t([0,255,255]),2);i.setOutline(n);var s=(new p(e.mapPoint.x,e.mapPoint.y,map.spatialReference),new c(e.graphic.geometry,i));map.graphics.add(s),"1"==$("#pvalue").html()?$("#pvalue").html('<i class="text-fade">click to calculate</i>'):$("#pvalue").html()&&$("#pvalue").html(""),"1"==$("#slope").html()?$("#slope").html('<i class="text-fade">click to calculate</i>'):$("#slope").html()&&$("#slope").html(""),C(),$("#siteInfoDiv").css("visibility","visible"),q();var r,o=e.graphic.attributes,l="sym_"+$("input[name=trendType]:checked").val()+"_"+$("input[name=trendPeriod]:checked").val(),d=Number(o[l]);if(-.05>d?r="Non-significant trend down":d>=-.05&&0>d?r="Significant trend down":0==d?r="No trend":d>0&&.05>=d?r="Significant trend up":d>.05&&(r="Non-significant trend up"),$("#siteInfoTabPane").empty(),currentLayer=a,"trendResults"==a){var u;u="HCDN"==o.trend_gages_gage_class?"Reference":o.trend_gages_gage_class,currentSiteNo=o.trend_gages_site_id,$("#siteInfoTabPane").append("<b>Station Name: </b>"+o.trend_gages_station_nm+"<br/><b>Site number: </b>"+o.trend_gages_site_id+"<br/><b>Gage class: </b>"+u+"<br/><b>Latitude: </b>"+Number(o.trend_gages_dec_lat_va).toFixed(2).toString()+"<br/><b>Longitude: </b>"+Number(o.trend_gages_dec_long_va).toFixed(2).toString()+"<br/><b>Drainage area: </b>"+Number(o.trend_gages_drainSqKm).toFixed(2).toString()+" (km<sup>2</sup>)<br/><b>Trend: </b>"+r)}var y,g=[{layerSelected:"lowQ_1day",mapLayer:"1",chartTitle:"Low Q - 1 day",yAxis:"Streamflow (cfs)",tooltipUnits:"cfs"},{layerSelected:"lowQ_3day",mapLayer:"6",chartTitle:"Low Q - 3 day",yAxis:"Streamflow (cfs)",tooltipUnits:"cfs"},{layerSelected:"lowQ_7day",mapLayer:"5",chartTitle:"Low Q - 7 day",yAxis:"Streamflow (cfs)",tooltipUnits:"cfs"},{layerSelected:"peak_flows",mapLayer:"3",chartTitle:"Peak Flows",yAxis:"Streamflow (cfs)",tooltipUnits:"cfs"},{layerSelected:"mean_annual_Q",mapLayer:"4",chartTitle:"Mean Annual Q",yAxis:"Streamflow (cfs)",tooltipUnits:"cfs"}];$.each(g,function(e,t){document.getElementById("layerSelect").options[document.getElementById("layerSelect").selectedIndex].value==g[e].layerSelected&&(y=e)});var m;switch($('input[name="trendPeriod"]:checked').val()){case"1916":m=1916;break;case"1941":m=1941;break;case"1966":m=1966}null!=y||void 0!=y?(void 0==$("#chartTab").attr("data-toggle")&&($("#chartTab").attr("data-toggle","tab").css("cursor","default"),$("#chartTab").show()),$.ajax({dataType:"json",type:"GET",url:map.getLayer("trendsByYear").url+"/"+g[y].mapLayer+"/query?where=site_id+%3D+%27"+o.trend_gages_site_id+"%27&outFields=*&f=json",headers:{Accept:"*/*"},success:function(e){trends_by_year_array=[],$.each(e.features[0].attributes,function(e,t){if("NA"!=t&&"site_id"!=e){var a=Number(e.split("_yr")[0]);a>=m&&trends_by_year_array.push([a,Number(t)])}}),void 0!==scatterPlot&&scatterPlot.destroy(),scatterPlot=new Highcharts.chart("chartDiv",{chart:{type:"scatter",zoomType:"xy"},responsive:{rules:[{condition:{maxWidth:470}}]},title:{text:g[y].chartTitle},credits:{enabled:!1},xAxis:{title:{enabled:!0,text:"Year"},startOnTick:!1,endOnTick:!1,showLastLabel:!0,min:m},yAxis:{title:{text:g[y].yAxis}},legend:{layout:"vertical",align:"left",verticalAlign:"top",x:100,y:70,floating:!0,backgroundColor:Highcharts.defaultOptions.chart.backgroundColor,borderWidth:1},plotOptions:{scatter:{marker:{radius:5,states:{hover:{enabled:!0,lineColor:"rgb(100,100,100)"}}},states:{hover:{marker:{enabled:!1}}},tooltip:{headerFormat:"<b>"+g[y].chartTitle+"</b><br>",pointFormat:"{point.x}, {point.y} "+g[y].tooltipUnits}}},series:[{name:g[y].yAxis,color:"rgba(223, 83, 83, .5)",data:trends_by_year_array}]}),$("#trend-period-slider").slider({range:!0,min:m,max:2015,values:[m,2015],slide:function(e,t){$("#years").text(t.values[0]+" - "+t.values[1]),scatterPlot.update({xAxis:{min:t.values[0],max:t.values[1]}}),void 0!==scatterPlot.get("trend-line")&&(scatterPlot.get("trend-line").remove(),$("#pvalue").html('<i class="text-fade">click to calculate</i>'),$("#slope").html('<i class="text-fade">click to calculate</i>'))}}),$("#years").text($("#trend-period-slider").slider("values",0)+" - "+$("#trend-period-slider").slider("values",1))},error:function(e){console.log("Error processing the JSON. The error is:"+e)}}),q()):($('.nav-tabs a[href="#siteInfoTabPane"]').tab("show"),$("#chartTab").removeAttr("data-toggle").css("cursor","not-allowed"),$("#chartTab").hide(),q())}),void 0===U&&(U=$("#trendCalcButton").click(function(e){q();var t=[],a=[],i=[];trends_by_year_array[0][1];$.each(trends_by_year_array,function(e,n){n[0]>=scatterPlot.xAxis[0].min&&n[0]<=scatterPlot.xAxis[0].max&&(t.push(n[0]),a.push(n[1]),(e%2==1||1==e)&&i.push([trends_by_year_array[e-1][1],trends_by_year_array[e][1]]))});var n=scatterPlot.xAxis[0].min.toFixed(0),s=scatterPlot.xAxis[0].max.toFixed(0),r=currentSiteNo,o=document.getElementById("layerSelect").options[document.getElementById("layerSelect").selectedIndex].value;$.ajax({dataType:"json",type:"GET",url:"https://nawqatrends.wim.usgs.gov/thiel-sen-node-service?inputs="+t+"&outputs="+a+"&begin_year="+n+"&end_year="+s+"&s_id="+r+"&layer_selected="+o,headers:{Accept:"*/*"},success:function(e){void 0!==scatterPlot.get("trend-line")&&scatterPlot.get("trend-line").remove(),void 0!==scatterPlot.get("py-trend-line")&&scatterPlot.get("py-trend-line").remove(),scatterPlot.addSeries({id:"trend-line",name:"Trend",type:"line",color:"rgba(0, 0, 0, 1.0)",marker:{enabled:!1},data:[[t[0],e["point-a"]],[t[t.length-1],e["point-b"]]]});var a=e.regg_slope.toFixed(2);$("#slope").html(a.toString()+" cfs/yr");var i=Number(e.p_value).toFixed(5);$("#pvalue").html(i.toString()),q()},error:function(e){console.log("Error processing the JSON. The error is: ",e),q()}})})))}),$("#geosearchNav").click(function(){function e(){$("#searchDownModal").modal("show")}var t=!0;try{search_api}catch(a){t=!1,console.log("did not work")}t?(E(),console.log("init"),search_api.create("geosearch",{on_result:function(e){require(["esri/geometry/Extent"],function(t){var a=["GNIS_MAJOR","GNIS_MINOR","ZIPCODE","AREACODE"],i=a.indexOf(e.result.properties.Source);$("#geosearchModal").modal("hide"),-1==i?map.setExtent(new esri.geometry.Extent({xmin:e.result.properties.LonMin,ymin:e.result.properties.LatMin,xmax:e.result.properties.LonMax,ymax:e.result.properties.LatMax,spatialReference:{wkid:4326}}),!0):require(["esri/geometry/Point"],function(t){map.centerAndZoom(new t(e.result.properties.Lon,e.result.properties.Lat),12)})})},include_usgs_sw:!0,include_usgs_gw:!0,include_usgs_sp:!0,include_usgs_at:!0,include_usgs_ot:!0,include_huc2:!0,include_huc4:!0,include_huc6:!0,include_huc8:!0,include_huc10:!0,include_huc12:!0,on_failure:function(e){$("#test").html("Sorry, a location could not be found in search for '"+e.val()+"'"),$("#invalidSearchLocationModal").modal("show")}})):e()});z("../images/purple-pin.png",0,12,13,24);map.on("load",function(){map.infoWindow.set("highlight",!1),map.infoWindow.set("titleInBody",!1)}),$(document).ready(function(){function e(){$("#aboutModal").modal("show")}$("#aboutNav").click(function(){e()}),$(".showUserGuide").click(function(){$("#searchTab").trigger("click"),$("#geosearchModal").modal("hide"),$("#aboutModal").modal("hide"),$("#faqModal").modal("hide"),$("#userGuideModal").modal("show")}),$(".showUserGuide2").click(function(){$("#geosearchModal").modal("hide"),$("#aboutModal").modal("hide"),$("#faqModal").modal("hide"),$("#userGuideModal").modal("show"),$("#iconTab").trigger("click")}),$(".showUserGuide3").click(function(){$("#geosearchModal").modal("hide"),$("#aboutModal").modal("hide"),$("#faqModal").modal("hide"),$("#userGuideModal").modal("show"),$("#layersTab").trigger("click")}),$("#userGuideNav").click(function(){$("#userGuideModal").modal("show"),$("#searchTab").trigger("click")}),$("#trendResultHelp").click(function(){$("#trendResultsHelpBox").slideToggle(200)}),$("#faqNav").click(function(){$("#faqModal").modal("show")}),$(".showFAQNav").click(function(){$("#faqModal").modal("show")}),$("#html").niceScroll(),$("#sidebar").niceScroll(),$("#sidebar").scroll(function(){$("#sidebar").getNiceScroll().resize()}),maxLegendHeight=.9*$("#mapDiv").height(),$("#legendElement").css("max-height",maxLegendHeight),$("#legendCollapse").on("shown.bs.collapse",function(){maxLegendHeight=.9*$("#mapDiv").height(),$("#legendElement").css("max-height",maxLegendHeight),maxLegendDivHeight=$("#legendElement").height()-parseInt($("#legendHeading").css("height").replace("px",""))}),$("#legendCollapse").on("hide.bs.collapse",function(){$("#legendElement").css("height","initial")}),$(".faq-header").click(function(){$(this).next(".faq-body").slideToggle(250)}),$(".fullsize").click(function(){var e=window.open($(this).attr("src"),"_blank");e.focus()}),$("#thielSenHelp").on("click",function(){$("#faqModal").modal("show"),$("#faq11body").slideDown(250),$("#faqModalBody").scroll(),$("#faqModalBody").animate({scrollTop:600},500)}),$("#trendTypeHelp").on("click",function(){$("#faqModal").modal("show"),$("#faq5body").slideDown(250),$("#faqModalBody").scroll(),$("#faqModalBody").animate({scrollTop:200},500)}),$("#indeHelp").click(function(){$("#faqModal").modal("show"),$("#faq6body").slideDown(250),$("#faqModalBody").scroll(),$("#faqModalBody").animate({scrollTop:250},500)})}),require(["esri/dijit/Legend","esri/tasks/locator","esri/tasks/query","esri/tasks/QueryTask","esri/graphicsUtils","esri/geometry/Point","esri/geometry/Extent","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/FeatureLayer","esri/SpatialReference","esri/layers/WMSLayer","esri/layers/WMSLayerInfo","dijit/form/CheckBox","dijit/form/RadioButton","dojo/query","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/on"],function(e,t,a,i,n,r,o,l,c,d,p,u,y,g,m,f,h,v,b,w){function L(e,t,a,i,n,s,r){if(map.addLayer(a),x.push([n,camelize(i),a]),n){if(!$("#"+camelize(n)).length){var o;if("Data Source"==n)var o=$('<div id="'+camelize(n+" Root")+'" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan far fa-check-square"></i>&nbsp;&nbsp;'+n+'<span id="info'+camelize(n)+'" title="Data Source identifies the scale, year and emulsion of the imagery that was used to map the wetlands and riparian areas for a given area. It also identifies areas that have Scalable data, which is an interim data product in areas of the nation where standard compliant wetland data is not yet available. Click for more info on Scalable data." class="glyphspan far fa-question pull-right"></span><span id="opacity'+camelize(n)+'" style="padding-right: 5px" class="glyphspan far fa-adjust pull-right"></span></button> </div>');else var o=$('<div id="'+camelize(n+" Root")+'" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default "  style="font-weight: bold;text-align: left"><i class="glyphspan far fa-square"></i>'+n+"</button> </div>");o.click(function(e){o.find("i.glyphspan").toggleClass("fa-check-square fa-square"),$.each(x,function(e,t){var a=map.getLayer(t[2].id);if(t[0]==n)if($("#"+t[1]).find("i.glyphspan").hasClass("fa-dot-circle")&&o.find("i.glyphspan").hasClass("fa-check-square")){map.addLayer(t[2]);var a=map.getLayer(t[2].id);a.setVisibility(!0)}else if(o.find("i.glyphspan").hasClass("fa-square")){var a=map.getLayer(t[2].id);a.setVisibility(!1)}})});var l=$('<div id="'+camelize(n)+'" class="btn-group-vertical" data-toggle="buttons"></div>');$("#toggle").append(l)}if(a.visible)var c=$('<div id="'+camelize(i)+'" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"><label class="btn btn-default"  style="font-weight: bold;text-align: left"><input type="radio" name="'+camelize(n)+'" autocomplete="off"><i class="glyphspan fa fa-dot-circle '+camelize(n)+'"></i>'+i+"</label> </div>");else var c=$('<div id="'+camelize(i)+'" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"><label class="btn btn-default"  style="font-weight: bold;text-align: left"><input type="radio" name="'+camelize(n)+'" autocomplete="off"><i class="glyphspan fa fa-circle '+camelize(n)+'"></i>'+i+"</label> </div>");$("#"+camelize(n)).append(c),c.click(function(e){if($(this).find("i.glyphspan").hasClass("fa-circle")){$(this).find("i.glyphspan").toggleClass("fa-dot-circle fa-circle");var t=$(this)[0].id;$.each(x,function(e,a){if(a[0]==n)if(a[1]==t&&$("#"+camelize(n+" Root")).find("i.glyphspan").hasClass("fa-check-square")){console.log("adding layer: ",a[1]),map.addLayer(a[2]);var i=map.getLayer(a[2].id);i.setVisibility(!0)}else if(a[1]==t&&$("#"+camelize(n+" Root")).find("i.glyphspan").hasClass("fa-square"))console.log("group heading not checked");else{var i=map.getLayer(a[2].id);i.setVisibility(!1),$("#"+a[1]).find("i.glyphspan").hasClass("fa-dot-circle")&&$("#"+a[1]).find("i.glyphspan").toggleClass("fa-dot-circle fa-circle")}})}})}else if(r.includeInLayerList){if(a.visible&&void 0!==r.hasOpacitySlider&&1==r.hasOpacitySlider&&void 0!==r.moreinfo&&r.moreinfo)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;'+i+'<span id="info'+camelize(i)+'" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity'+camelize(i)+'" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');else if(!a.visible&&void 0!==r.hasOpacitySlider&&1==r.hasOpacitySlider&&void 0!==r.moreinfo&&r.moreinfo)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;'+i+'<span id="info'+camelize(i)+'" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity'+camelize(i)+'" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');else if(a.visible&&void 0!==r.hasOpacitySlider&&1==r.hasOpacitySlider)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;'+i+'<span id="info'+camelize(i)+'" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');else if(a.visible||void 0===r.hasOpacitySlider||1!=r.hasOpacitySlider)if(a.visible&&void 0!==r.moreinfo&&r.moreinfo)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;'+i+'<span id="opacity'+camelize(i)+'" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');else if(!a.visible&&void 0!==r.moreinfo&&r.moreinfo)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;'+i+'<span id="info'+camelize(i)+'" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');else if(a.visible)var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square"></i>&nbsp;&nbsp;'+i+"</button></span></div>");else var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;'+i+"</button> </div>");else var c=$('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square"></i>&nbsp;&nbsp;'+i+'<span id="opacity'+camelize(i)+'" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');c.click(function(e){$(this).find("i.glyphspan").toggleClass("fa-check-square fa-square"),$(this).find("button").button("toggle"),a.visible?a.setVisibility(!1):a.setVisibility(!0),r.otherLayersToggled&&$.each(r.otherLayersToggled,function(e,t){var i=map.getLayer(t);i.setVisibility(a.visible)})})}if(void 0!==t){var d=camelize(e);if(!$("#"+d).length){if(t)var p=$('<div id="'+d+'"><div class="alert alert-info" role="alert"><strong>'+e+"</strong></div></div>");else var p=$('<div id="'+d+'"></div>');$("#toggle").append(p)}if(n){if($("#"+d).append(o),$("#"+d).append(l),void 0!==r.moreinfo&&r.moreinfo){var u="#info"+camelize(n),y=$(u);y.click(function(e){window.open(r.moreinfo,"_blank"),e.preventDefault(),e.stopPropagation()})}if($("#opacity"+camelize(n)).length>0){var u="#opacity"+camelize(n),g=$(u);g.click(function(e){e.preventDefault(),e.stopPropagation(),$(".opacitySlider").remove();var t=map.getLayer(s.id).opacity,a=$('<div class="opacitySlider"><label id="opacityValue">Opacity: '+t+'</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');$("body").append(a),$("#slider")[0].value=100*t,$(".opacitySlider").css("left",event.clientX-180),$(".opacitySlider").css("top",event.clientY-50),$(".opacitySlider").mouseleave(function(){$(".opacitySlider").remove()}),$(".opacityClose").click(function(){$(".opacitySlider").remove()}),$("#slider").change(function(e){var t=$("#slider")[0].value/100;$("#opacityValue").html("Opacity: "+t),map.getLayer(s.id).setOpacity(t),r.otherLayersToggled&&$.each(r.otherLayersToggled,function(e,a){var i=map.getLayer(a);i.setOpacity(t)})})})}}else{if($("#"+d).append(c),void 0!==r.moreinfo&&r.moreinfo){var u="#info"+camelize(i),y=$(u);y.click(function(e){window.open(r.moreinfo,"_blank"),e.preventDefault(),e.stopPropagation()})}$("#opacity"+camelize(i)).length>0&&$("#opacity"+camelize(i)).click(function(e){e.preventDefault(),e.stopPropagation(),$(".opacitySlider").remove();var t=map.getLayer(s.id).opacity,a=$('<div class="opacitySlider"><label id="opacityValue">Opacity: '+t+'</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');$("body").append(a),$("#slider")[0].value=100*t,$(".opacitySlider").css("left",event.clientX-180),$(".opacitySlider").css("top",event.clientY-50),$(".opacitySlider").mouseleave(function(){$(".opacitySlider").remove()}),$(".opacityClose").click(function(){$(".opacitySlider").remove()}),$("#slider").change(function(e){var t=$("#slider")[0].value/100;$("#opacityValue").html("Opacity: "+t),map.getLayer(s.id).setOpacity(t),r.otherLayersToggled&&$.each(r.otherLayersToggled,function(e,a){var i=map.getLayer(a);i.setOpacity(t)})})})}}else if($("#toggle").append(c),void 0!==r.moreinfo&&r.moreinfo){var u="#info"+camelize(i),y=$(u);y.click(function(e){alert(e.currentTarget.id),e.preventDefault(),e.stopPropagation()})}}var S=[],x=[];$.each(allLayers,function(e,t){$.each(t.layers,function(e,a){var i=e;("lowQ_1Day"==i||"lowQ_3Days"==i||"lowQ_7Day"==i||"mean_annual"==i||"peak_square_data"==i||"zeroQ_nDays"==i)&&(i=e);var n="";if(a.wimOptions.exclusiveGroupName&&(n=a.wimOptions.exclusiveGroupName),"agisFeature"===a.wimOptions.layerType){var r=new c(a.url,a.options);void 0!==a.wimOptions.renderer&&r.setRenderer(a.wimOptions.renderer),a.wimOptions&&1==a.wimOptions.includeLegend&&S.push({layer:r,title:i}),L(t.groupHeading,t.showGroupHeading,r,e,n,a.options,a.wimOptions);
}else if("agisWMS"===a.wimOptions.layerType){var r=new p(a.url,{resourceInfo:a.options.resourceInfo,visibleLayers:a.options.visibleLayers},a.options);a.wimOptions&&1==a.wimOptions.includeLegend&&S.push({layer:r,title:i}),L(t.groupHeading,t.showGroupHeading,r,e,n,a.options,a.wimOptions)}else if("agisDynamic"===a.wimOptions.layerType){var r=new l(a.url,a.options);if(a.visibleLayers&&r.setVisibleLayers(a.visibleLayers),a.wimOptions&&a.wimOptions.layerDefinitions){var o=[];$.each(a.wimOptions.layerDefinitions,function(e,t){o[e]=t}),r.setLayerDefinitions(o)}a.wimOptions&&1==a.wimOptions.includeLegend&&S.push({layer:r,title:i}),L(t.groupHeading,t.showGroupHeading,r,e,n,a.options,a.wimOptions)}else if("agisImage"===a.wimOptions.layerType){var r=new s(a.url,a.options);a.wimOptions&&1==a.wimOptions.includeLegend&&S.push({layer:r,title:i}),a.visibleLayers&&r.setVisibleLayers(a.visibleLayers),L(t.groupHeading,t.showGroupHeading,r,e,n,a.options,a.wimOptions)}})});var T=new e({map:map,layerInfos:S},"legendDiv");T.startup()})}),$(document).ready(function(){});