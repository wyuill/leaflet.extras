(()=>{function n(n){return n instanceof Array?n:[n]}function o(o){return o?void 0===o.index?o:(o.data=n(o.data),o.index=n(o.index),$.map(o.index,(function(n,e){return o.data[n]}))):o}LeafletWidget.methods.addBounceMarkers=function(n,e,i,t,c,a,r,d,h,l,s,p,u,w){(function(){let f,g;if(i&&(i.iconUrl=o(i.iconUrl),i.iconRetinaUrl=o(i.iconRetinaUrl),i.shadowUrl=o(i.shadowUrl),i.shadowRetinaUrl=o(i.shadowRetinaUrl),f=(new LeafletWidget.DataFrame).cbind(i),g=function(n){let o=f.get(n);return o.iconUrl?(o.iconWidth&&(o.iconSize=[o.iconWidth,o.iconHeight]),o.shadowWidth&&(o.shadowSize=[o.shadowWidth,o.shadowHeight]),o.iconAnchorX&&(o.iconAnchor=[o.iconAnchorX,o.iconAnchorY]),o.shadowAnchorX&&(o.shadowAnchor=[o.shadowAnchorX,o.shadowAnchorY]),o.popupAnchorX&&(o.popupAnchor=[o.popupAnchorX,o.popupAnchorY]),new L.Icon(o)):new L.Icon.Default}),!$.isEmptyObject(n)&&!$.isEmptyObject(e)||$.isNumeric(n)&&$.isNumeric(e)){var A=(new LeafletWidget.DataFrame).col("lat",n).col("lng",e).col("layerId",t).col("group",r).col("popup",h).col("popupOptions",l).col("label",u).col("labelOptions",w).cbind(d);i&&(f.effectiveLength=A.nrow()),LeafletWidget.methods.addGenericMarkers(this,A,r,s,p,((n,o)=>{var e=n.get(o);return i&&(e.icon=g(o)),e.bounceOnAdd=!0,e.bounceOnAddOptions={duration:c,height:a},L.marker([n.get(o,"lat"),n.get(o,"lng")],e)}))}}).call(this)}})();
//# sourceMappingURL=lfx-bouncemarker-bindings.js.map