(()=>{"use strict";function e(e){return e instanceof Array?e:[e]}function o(o){return o?void 0===o.index?o:(o.data=e(o.data),o.index=e(o.index),$.map(o.index,(function(e){return o.data[e]}))):o}function r(e){var o={latlng:{}};return o.latlng.lat=e.latlng.lat,o.latlng.lng=e.latlng.lng,$.isEmptyObject(e.title)||(o.title=e.title),$.isEmptyObject(e.layer)||(o.layer=e.layer.toGeoJSON()),o}var a,t;LeafletWidget.methods.addSearchOSM=function(e){(function(){var o=this;o.searchControlOSM&&(o.searchControlOSM.remove(o),delete o.searchControlOSM),(e=e||{}).textPlaceholder=e.textPlaceholder?e.textPlaceholder:"Search using OSM Geocoder",e.url=e.url?e.url:"https://nominatim.openstreetmap.org/search?format=json&q={s}",e.jsonpParam=e.jsonpParam?e.jsonpParam:"json_callback",e.propertyName=e.propertyName?e.propertyName:"display_name",e.propertyLoc=e.propertyLoc?e.propertyLoc:["lat","lon"],e.marker=L.circleMarker([0,0],{radius:30}),e.moveToLocation&&(e.moveToLocation=function(o,r,a){var t=e.zoom||16,n=a.getMaxZoom();n&&t>n&&(t=n),a.setView(o,t)}),o.searchControlOSM=new L.Control.Search(e),o.searchControlOSM.addTo(o),o.searchControlOSM.on("search:locationfound",(function(e){HTMLWidgets.shinyMode&&Shiny.onInputChange(o.id+"_search_location_found",r(e))}))}).call(this)},LeafletWidget.methods.removeSearchOSM=function(){(function(){var e=this;e.searchControlOSM&&(e.searchControlOSM._markerSearch&&e.removeLayer(e.searchControlOSM._markerSearch),e.searchControlOSM.remove(e),delete e.searchControlOSM);var o=document.getElementById("reverseSearchOSM");o&&(o.remove(),e.off("click",a))}).call(this)},LeafletWidget.methods.clearSearchOSM=function(){(function(){var e=this;e.searchControlOSM&&e.searchControlOSM._markerSearch&&e.removeLayer(e.searchControlOSM._markerSearch)}).call(this)},LeafletWidget.methods.addReverseSearchOSM=function(e,o){(function(){var r=this;o=o||"reverse_search_osm",r.layerManager.clearGroup(o);var t=document.getElementById("reverseSearchOSM");a=function(a){var n=a.latlng,c=L.featureGroup(),s=L.stamp(c);if(e.showSearchLocation){var l=L.marker(a.latlng,{type:"query"}).bindTooltip("lat="+n.lat+" lng="+n.lng+"</P>");L.stamp(l),c.addLayer(l)}var i="https://nominatim.openstreetmap.org/reverse?format=json&polygon_geojson=1&lat="+n.lat+"&lon="+n.lng;$.ajax({url:i,dataType:"json"}).done((function(a){if(a.error&&"Unable to geocode"===a.error)t.innerHTML="Unable to geocode";else{if(!$.isEmptyObject(t)){var i="<div>";i=i+"Display Name: "+(a.display_name?a.display_name:"")+"<br/>",i+="</div>",t.innerHTML=i}var h=L.latLngBounds(L.latLng(a.boundingbox[0],a.boundingbox[2]),L.latLng(a.boundingbox[1],a.boundingbox[3]));if(e.showBounds){var d=L.rectangle(h,{weight:2,color:"#444444",clickable:!1,dashArray:"5,10",type:"result_boundingbox"});L.stamp(d),c.addLayer(d)}if(e.showFeature){var u=L.geoJson(a.geojson,{weight:2,color:"red",dashArray:"5,10",clickable:!1,type:"result_feature",pointToLayer:function(e,o){return L.circleMarker(o,{weight:2,color:"red",dashArray:"5,10",clickable:!1})}});L.stamp(u),c.addLayer(u)}var g=c.getLayers();!$.isEmptyObject(g)&&g.length>=0&&($.isEmptyObject(l)||(l.on("mouseover",(function(){$.isEmptyObject(d)||(d.setStyle({fillOpacity:.5,opacity:.8,weight:5}),d.bringToFront()),$.isEmptyObject(u)||(u.setStyle({fillOpacity:.5,opacity:.8,weight:5}),u.bringToFront())})),l.on("mouseout",(function(){$.isEmptyObject(d)||(d.setStyle({fillOpacity:.2,opacity:.5,weight:2}),d.bringToBack()),$.isEmptyObject(u)||(u.setStyle({fillOpacity:.2,opacity:.5,weight:2}),u.bringToBack())}))),r.layerManager.addLayer(c,"search",s,o),e.fitBounds&&r.fitBounds(c.getBounds())),HTMLWidgets.shinyMode&&Shiny.onInputChange(r.id+"_reverse_search_feature_found",{query:{lat:n.lat,lng:n.lng},result:a})}}))},r.on("click",a)}).call(this)},LeafletWidget.methods.searchOSMText=function(e){(function(){this.searchControlOSM&&this.searchControlOSM.searchText(e)}).call(this)},LeafletWidget.methods.addSearchGoogle=function(e){(function(){var o=this;o.searchControlGoogle&&(o.searchControlGoogle.remove(o),delete o.searchControlGoogle);var a=new google.maps.Geocoder;(e=e||{}).markerLocation=!0,e.textPlaceholder=e.textPlaceholder?e.textPlaceholder:"Search using Google Geocoder",e.marker=L.circleMarker([0,0],{radius:30}),e.moveToLocation&&(e.moveToLocation=function(o,r,a){var t=e.zoom||16,n=a.getMaxZoom();n&&t>n&&(t=n),a.setView(o,t)}),e.sourceData=function(e,o){a.geocode({address:e},o)},e.formatData=function(e){var o,r,a={};for(var t in e)o=e[t].formatted_address,r=L.latLng(e[t].geometry.location.lat(),e[t].geometry.location.lng()),a[o]=r;return a},o.searchControlGoogle=new L.Control.Search(e),o.searchControlGoogle.addTo(o),o.searchControlGoogle.on("search:locationfound",(function(e){HTMLWidgets.shinyMode&&Shiny.onInputChange(o.id+"_search_location_found",r(e))}))}).call(this)},LeafletWidget.methods.removeSearchGoogle=function(){(function(){var e=this;e.searchControlGoogle&&(e.searchControlGoogle.remove(e),delete e.searchControlGoogle);var o=document.getElementById("reverseSearchGoogle");o&&(o.remove(),e.off("click",t))}).call(this)},LeafletWidget.methods.addReverseSearchGoogle=function(e,o){(function(){var r=this;o=o||"reverse_search_google",r.layerManager.clearGroup(o);var a=document.getElementById("reverseSearchGoogle"),n=new google.maps.Geocoder;t=function(t){var c=t.latlng,s=L.featureGroup(),l=L.stamp(s);if(e.showSearchLocation){var i=L.marker(t.latlng,{type:"query"}).bindTooltip("lat="+c.lat+" lng="+c.lng+"</P>");L.stamp(i),s.addLayer(i)}n.geocode({location:{lat:c.lat,lng:c.lng}},(function(t,n){if("OK"===n)if(t[0]){var h=t[0];if(!$.isEmptyObject(a)){var d="<div>";d=d+"Address: "+(h.formatted_address?h.formatted_address:"")+"<br/>",d+="</div>",a.innerHTML=d}var u=L.latLngBounds(L.latLng(h.geometry.viewport.f.f,h.geometry.viewport.b.b),L.latLng(h.geometry.viewport.f.b,h.geometry.viewport.b.f));if(e.showBounds){var g=L.rectangle(u,{weight:2,color:"#444444",clickable:!1,dashArray:"5,10",type:"result_boundingbox"});L.stamp(g),s.addLayer(g)}if(e.showFeature){var m=L.circleMarker(L.latLng(h.geometry.location.lat(),h.geometry.location.lng()),{weight:2,color:"red",dashArray:"5,10",clickable:!1,type:"result_feature"});L.stamp(m),s.addLayer(m)}var p=s.getLayers();!$.isEmptyObject(p)&&p.length>=0&&($.isEmptyObject(i)||(i.on("mouseover",(function(e){$.isEmptyObject(g)||(g.setStyle({fillOpacity:.5,opacity:.8,weight:5}),g.bringToFront()),$.isEmptyObject(m)||(m.setStyle({fillOpacity:.5,opacity:.8,weight:5}),m.bringToFront())})),i.on("mouseout",(function(e){$.isEmptyObject(g)||(g.setStyle({fillOpacity:.2,opacity:.5,weight:2}),g.bringToBack()),$.isEmptyObject(m)||(m.setStyle({fillOpacity:.2,opacity:.5,weight:2}),m.bringToBack())}))),r.layerManager.addLayer(s,"search",l,o),e.fitBounds&&r.fitBounds(s.getBounds())),HTMLWidgets.shinyMode&&Shiny.onInputChange(r.id+"_reverse_search_feature_found",{query:{lat:c.lat,lng:c.lng},result:h})}else $.isEmptyObject(a)||(a.innerHTML="No Results Found"),console.error("No Results Found");else $.isEmptyObject(a)||(a.innerHTML="Reverse Geocoding failed due to: "+n),console.error("Reverse Geocoing failed due to: "+n)}))},r.on("click",t)}).call(this)},LeafletWidget.methods.addSearchUSCensusBureau=function(e){(function(){var o=this;o.searchControlUSCensusBureau&&(o.searchControlUSCensusBureau.remove(o),delete o.searchControlUSCensusBureau),(e=e||{}).url=e.url?e.url:"https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=jsonp&address={s}",e.textPlaceholder=e.textPlaceholder?e.textPlaceholder:"Search using US Census Bureau TEST",e.jsonpParam=e.jsonpParam?e.jsonpParam:"callback",e.formatData=function(e){var o,r,a={};for(var t in e.result.addressMatches)o=e.result.addressMatches[t].matchedAddress,r=L.latLng(e.result.addressMatches[t].coordinates.y,e.result.addressMatches[t].coordinates.x),a[o]=r;return a},e.marker=L.circleMarker([0,0],{radius:30}),e.moveToLocation&&(e.moveToLocation=function(o,r,a){var t=e.zoom||16,n=a.getMaxZoom();n&&t>n&&(t=n),a.setView(o,t)}),o.searchControlUSCensusBureau=new L.Control.Search(e),o.searchControlUSCensusBureau.addTo(o),o.searchControlUSCensusBureau.on("search:locationfound",(function(e){HTMLWidgets.shinyMode&&Shiny.onInputChange(o.id+"_search_location_found",r(e))}))}).call(this)},LeafletWidget.methods.removeSearchUSCensusBureau=function(){(function(){var e=this;e.searchControlUSCensusBureau&&(e.searchControlUSCensusBureau.remove(e),delete e.searchControlUSCensusBureau)}).call(this)},LeafletWidget.methods.addSearchFeatures=function(e,a){(function(){var t,n=this;if(n.searchControl&&(n.searchControl.remove(n),delete n.searchControl),(a=a||{}).moveToLocation&&(a.moveToLocation=function(e,o,r){var t=a.zoom||16,n=r.getMaxZoom();n&&t>n&&(t=n),r.setView(e,t)}),L.Util.isArray(e))t=n.layerManager.getLayerGroup("search",!0),n._searchFeatureGroupName="search",$.each(e,(function(e,o){var r=n.layerManager.getLayerGroup(o,!1);r?t.addLayer(r):console.warn('Group with ID "'+o+'" not Found, skipping')}));else{var c=n.layerManager.getLayerGroup(e,!1);if(!c)throw'Group with ID "'+e+'" not found';t=c,n._searchFeatureGroupName=e}var s=a.marker.icon;s&&(s.awesomemarker?(delete s.awesomemarker,s.squareMarker&&(s.className="awesome-marker awesome-marker-square"),s.prefix||(s.prefix=s.library),a.marker.icon=new L.AwesomeMarkers.icon(s)):!0===s?a.marker.icon=new L.Icon.Default:(s.iconUrl=o(s.iconUrl),s.iconRetinaUrl=o(s.iconRetinaUrl),s.shadowUrl=o(s.shadowUrl),s.shadowRetinaUrl=o(s.shadowRetinaUrl),s.iconWidth&&(s.iconSize=[s.iconWidth,s.iconHeight]),s.shadowWidth&&(s.shadowSize=[s.shadowWidth,s.shadowHeight]),s.iconAnchorX&&(s.iconAnchor=[s.iconAnchorX,s.iconAnchorY]),s.shadowAnchorX&&(s.shadowAnchor=[s.shadowAnchorX,s.shadowAnchorY]),s.popupAnchorX&&(s.popupAnchor=[s.popupAnchorX,s.popupAnchorY]),a.marker.icon=new L.Icon(s))),L.stamp(t),a.layer=t,n.searchControl=new L.Control.Search(a),n.searchControl.addTo(n),n.searchControl.on("search:cancel",(function(e){e.target.options.hideMarkerOnCollapse&&e.target._map.removeLayer(this._markerSearch)})),n.searchControl.on("search:locationfound",(function(e){a.openPopup&&e.layer._popup&&e.layer.openPopup(),HTMLWidgets.shinyMode&&Shiny.onInputChange(n.id+"_search_location_found",r(e))}))}).call(this)},LeafletWidget.methods.removeSearchFeatures=function(e){(function(){var o=this;o.searchControl&&(o.searchControl.remove(o),delete o.searchControl),e&&o._searchFeatureGroupName&&(o.layerManager.clearGroup(o._searchFeatureGroupName),delete o._searchFeatureGroupName)}).call(this)},LeafletWidget.methods.clearSearchFeatures=function(){(function(){var e=this;e.searchControl&&e.removeLayer(e.searchControl._markerSearch)}).call(this)}})();