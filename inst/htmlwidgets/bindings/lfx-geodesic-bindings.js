/* global $, LeafletWidget, L, HTMLWidgets */
LeafletWidget.methods.addGeodesicPolylines  = function(
  polygons, layerId, group, options, popup, popupOptions,
  label, labelOptions, highlightOptions) {
  if(polygons.length > 0) {
    var df = new LeafletWidget.DataFrame()
      .col('shapes', polygons)
      .col('layerId', layerId)
      .col('group', group)
      .col('popup', popup)
      .col('popupOptions', popupOptions)
      .col('label', label)
      .col('labelOptions', labelOptions)
      .col('highlightOptions', highlightOptions)
      .cbind(options);

    LeafletWidget.methods.addGenericLayers(this, 'shape', df,
      function(df, i) {
        var shapes = df.get(i, 'shapes');
        var ret_shapes = [];
        for (var j = 0; j < shapes.length; j++) {
          for (var k = 0; k < shapes[j].length; k++) {
            ret_shapes.push(
              HTMLWidgets.dataframeToD3(shapes[j][k])
            );
          }
        }
        return L.geodesic(ret_shapes, df.get(i));
      });
  }
};

LeafletWidget.methods.addGreatCircles  = function(
  lat, lng, radius, layerId, group, options, icon, popup, popupOptions,
  label, labelOptions, highlightOptions, markerOptions) {
  if(!($.isEmptyObject(lat) || $.isEmptyObject(lng)) ||
      ($.isNumeric(lat) && $.isNumeric(lng))) {

    const map = this;

    // Icon (Copy form Leaflet)
    let icondf;
    let getIcon;
    if (icon) {
      // Unpack icons
      icon.iconUrl         = unpackStrings(icon.iconUrl);
      icon.iconRetinaUrl   = unpackStrings(icon.iconRetinaUrl);
      icon.shadowUrl       = unpackStrings(icon.shadowUrl);
      icon.shadowRetinaUrl = unpackStrings(icon.shadowRetinaUrl);

      // This cbinds the icon URLs and any other icon options; they're all
      // present on the icon object.
      icondf = new LeafletWidget.DataFrame().cbind(icon);

      // Constructs an icon from a specified row of the icon dataframe.
      getIcon = function(i) {
        let opts = icondf.get(i);
        if (!opts.iconUrl) {
          return new L.Icon.Default();
        }

        // Composite options (like points or sizes) are passed from R with each
        // individual component as its own option. We need to combine them now
        // into their composite form.
        if (opts.iconWidth) {
          opts.iconSize = [opts.iconWidth, opts.iconHeight];
        }
        if (opts.shadowWidth) {
          opts.shadowSize = [opts.shadowWidth, opts.shadowHeight];
        }
        if (opts.iconAnchorX) {
          opts.iconAnchor = [opts.iconAnchorX, opts.iconAnchorY];
        }
        if (opts.shadowAnchorX) {
          opts.shadowAnchor = [opts.shadowAnchorX, opts.shadowAnchorY];
        }
        if (opts.popupAnchorX) {
          opts.popupAnchor = [opts.popupAnchorX, opts.popupAnchorY];
        }

        return new L.Icon(opts);
      };
    }
    if (icon) icondf.effectiveLength = lat.length;

    // Make DataFrame
    let df = new LeafletWidget.DataFrame()
      .col("lat", lat)
      .col("lng", lng)
      .col("radius", radius)
      .col("layerId", layerId)
      .col("group", group)
      .col("popup", popup)
      .col("popupOptions", popupOptions)
      .col("label", label)
      .col("labelOptions", labelOptions)
      .col("highlightOptions", highlightOptions)
      .col("markerOptions", markerOptions)
      .cbind(options)

    // Show Statistics in InfoControl
    if (options.showStats) {
      // Info control
      var info = L.control();
      info.onAdd = function(map) {
          this._div = L.DomUtil.create('div', 'info');
          return this._div;
      };
      info.addTo(map);

      // Define a function to update the info control based on passed statistics
      function updateInfo(stats, statsFunction) {
        var infoHTML = "";
        if (typeof options.statsFunction === "function") {
          // If additionalInput is a function, use it to generate content exclusively
          infoHTML = options.statsFunction(stats);
        } else {
          // Default content generation logic
          const totalDistance = stats.totalDistance ? (stats.totalDistance > 10000 ? (stats.totalDistance / 1000).toFixed(0) + ' km' : stats.totalDistance.toFixed(0) + ' m') : 'invalid';
          infoHTML = '<h4>Statistics</h4>' +
            '<b>Total Distance</b><br/>' + totalDistance +
            '<br/><br/><b>Points</b><br/>' + stats.points +
            '<br/><br/><b>Vertices</b><br/>' + stats.vertices;
        }
        // Update the innerHTML of the info div with the constructed info HTML or leave it empty
        info._div.innerHTML = infoHTML;
      }
    }

    // Add Layer using addGenericLayers
    LeafletWidget.methods.addGenericLayers(this, 'shape', df,
      function(df, i) {
        var options = df.get(i);

        // Create LatLong Centers
        const latlong = new L.LatLng(df.get(i, "lat"), df.get(i, "lng"))

        // Create Geodesic Circle
        const Geodesic = new L.GeodesicCircle(latlong, options)

        // Create a marker for each location
        if (options.showCenter) {
          markerOptions = markerOptions ? markerOptions : {};
          if (options.showCenter && icon) markerOptions.icon = getIcon(i);
          const marker = L.marker(latlong, markerOptions)

          if (label !== null) {
            if (labelOptions !== null) {
              marker.bindTooltip(df.get(i, "label"), labelOptions)
            } else {
              marker.bindTooltip(df.get(i, "label"))
            }
          }
          if (popup !== null) {
            if (popupOptions  !== null) {
              marker.bindPopup(df.get(i, "popup"), popupOptions)
            } else {
              marker.bindPopup(df.get(i, "popup"))
            }
          }
          map.on('layeradd', function(e) {
            if(e.layer === Geodesic) {
              map.layerManager.addLayer(marker, "marker", df.get(i, "layerId"), df.get(i, "group"), null, null);
            }
          });
          map.on('layerremove', function(e) {
            if(e.layer === Geodesic) {
              map.layerManager.removeLayer("marker", df.get(i, "layerId"))
            }
          });

          // Event listener for Center / Circles
          marker.on('drag', (e) => {
            Geodesic.setLatLng(e.latlng);
            handleEvent(e, "_geodesic_stats", options, df, i, Geodesic.statistics, updateInfo);
          });
          marker.on('click', (e) => {
            handleEvent(e, "_geodesic_click", options, df, i, Geodesic.statistics, updateInfo);
          });
        }

        Geodesic.on('click', (e) => {
          handleEvent(e, "_geodesic_click", options, df, i, Geodesic.statistics, updateInfo);
        });
        Geodesic.on('mouseover', (e) => {
          handleEvent(e, "_geodesic_mouseover", options, df, i, Geodesic.statistics, updateInfo);
        });

        return Geodesic;
    });
  }
};


// from https://github.com/rstudio/leaflet/blob/dc772e780317481e25335449b957c5f50082bcfd/javascript/src/methods.js#L221
function unpackStrings(iconset) {
  if (!iconset) {
    return iconset;
  }
  if (typeof(iconset.index) === "undefined") {
    return iconset;
  }

  iconset.data = asArray(iconset.data);
  iconset.index = asArray(iconset.index);

  return $.map(iconset.index, function(e, i) {
    return iconset.data[e];
  });
}
function handleEvent(e, eventName, options, df, i, statistics, updateInfo) {
  if (options.showStats) {
      updateInfo(statistics);
  }
  var group = df.get(i, "group");
  // Pass Events to Shiny
  if (HTMLWidgets.shinyMode) {
      let latLng = e.target.getLatLng ? e.target.getLatLng() : e.latlng;
      if (latLng) {
          let latLngVal = L.latLng(latLng);
          latLng = { lat: latLngVal.lat, lng: latLngVal.lng };
      }
      let eventInfo = $.extend({
          id: df.get(i, "layerId"),
          ".nonce": Math.random()
        },
        group !== null ? { group: group } : null,
        latLng,
        statistics);
      Shiny.onInputChange(map.id + eventName, eventInfo);
  }
}
