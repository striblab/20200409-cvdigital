/**
 * Main JS file for project.
 */

/**
 * Define globals that are added through the js.globals in
 * the config.json file, here, mostly so linting won't get triggered
 * and its a good queue of what is available:
 */
// /* global $, _ */

/**
 * Adding dependencies
 * ---------------------------------
 * Import local ES6 or CommonJS modules like this:
 * import utilsFn from './shared/utils.js';
 *
 * Or import libraries installed with npm like this:
 * import module from 'module';
 */

// Dependencies
import utils from './shared/utils.js';

// DOM loaded
utils.documentReady(() => {
  // Mark page with note about development or staging
  utils.environmentNoting();
});




/**
 * Adding Svelte templates in the client
 * ---------------------------------
 * We can bring in the same Svelte templates that we use
 * to render the HTML into the client for interactivity.  The key
 * part is that we need to have similar data.
 *
 * First, import the template.  This is the main one, and will
 * include any other templates used in the project.
 *
 *   `import Content from '../templates/_index-content.svelte.html';`
 *
 * Get the data parts that are needed.  There are two ways to do this.
 * If you are using the buildData function to get data, then add make
 * sure the config for your data has a `local: "content.json"` property
 *
 *  1. For smaller datasets, just import them like other files.
 *     `import content from '../assets/data/content.json';`
 *  2. For larger data points, utilize window.fetch.
 *     `let content = await (await window.fetch('../assets/data/content.json')).json();`
 *
 * Once you have your data, use it like a Svelte component:
 *
 * utils.documentReady(() => {
 *   const app = new Content({
 *     target: document.querySelector('.article-lcd-body-content'),
 *     hydrate: true,
 *     data: {
 *       content
 *     }
 *   });
 * });
 */



// Common code to get svelte template loaded on the client and hack-ishly
// handle sharing
//
// import Content from '../templates/_index-content.svelte.html';
//
// utils.documentReady(() => {
//   // Deal with share place holder (remove the elements, then re-attach
//   // them in the app component)
//   const attachShare = utils.detachAndAttachElement('.share-placeholder');
//
//   // Main component
//   const app = new Content({
//     target: document.querySelector('.article-lcd-body-content'),
//     hydrate: true,
//     data: {
//       attachShare
//     }
//   });
// });

import tracts from '../sources/tracts.json';
import mpls from '../sources/minneapolis.json';
import stp from '../sources/stpaul.json';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRyaWJ1bmUiLCJhIjoiY2sxYjRnNjdqMGtjOTNjcGY1cHJmZDBoMiJ9.St9lE8qlWR5jIjkPYd3Wqw';

var dzoom = 5.6;
var mzoom = 10;
var center = [-93.177798, 44.953564]
var center2 = [-94.021765, 46.619261];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/startribune/ck1b7427307bv1dsaq4f8aa5h',
    center: center,
    zoom: mzoom,
    minZoom: dzoom,
    maxZoom: 12
});

// map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.doubleClickZoom.disable();


/********** SPECIAL RESET BUTTON **********/
class HomeReset {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl my-custom-control mapboxgl-ctrl-group';

    const button = this._createButton('mapboxgl-ctrl-icon StateFace monitor_button')
    this.container.appendChild(button);
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  _createButton(className) {
    const el = window.document.createElement('button')
    el.className = className;
    el.textContent = 'W';
    el.addEventListener('click',(e)=>{
      e.style.display = 'none'
      console.log(e);
      // e.preventDefault()
      e.stopPropagation()
    },false )
    return el;
  }
}

class CityReset {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl my-custom-control2 mapboxgl-ctrl-group';

    const button = this._createButton('mapboxgl-ctrl-icon monitor_button2')
    this.container.appendChild(button);
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  _createButton(className) {
    const el = window.document.createElement('button')
    el.className = className;
    el.innerHTML = '<i class="far fa-building"></i>';
    el.addEventListener('click',(e)=>{
      e.style.display = 'none'
      console.log(e);
      // e.preventDefault()
      e.stopPropagation()
    },false )
    return el;
  }
}

const toggleControl = new HomeReset();
const toggleControl2 = new CityReset();

// Setup basic map controls
map.keyboard.disable();
// map.dragPan.disable();
if (utils.isMobile()) {
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
} else {

  map.getCanvas().style.cursor = 'pointer';
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }),'top-right');
  map.addControl(toggleControl,'top-right');
  map.addControl(toggleControl2,'top-right');

  $('.my-custom-control').on('click', function(){
    map.jumpTo({
      center: center2,
      zoom: 5,
    });
  });

  $('.my-custom-control2').on('click', function(){
    map.jumpTo({
      center: center,
      zoom: 10,
    });
  });
}

                
map.on('load', function() {

    map.addSource('nb', {
        type: 'geojson',
        data: tracts
      });
     
       map.addLayer({
            'id': 'nb-layer',
            'interactive': true,
            'source': 'nb',
            'layout': {},
            'type': 'fill',
                 'paint': {
                'fill-antialias' : true,
                'fill-opacity': 0.7,
                'fill-outline-color': "#888888",
                'fill-color': {
                 "property": "tracts_no_internet_pct",
                 "stops": [
                   [0, "rgba(255, 255, 255, 0)"],
                   [0.05, "#C6D1D9"],
                   [0.1, "#A8B9C5"],
                   [0.2, "#7F98AA"],
                   [0.3, "#556E7F"],
                   [0.4, "#2C3942"]
                  ]
             }
          }
        }, 'road-primary');

      map.addSource('mpls', {
        type: 'geojson',
        data: mpls
      });

      map.addLayer({
            'id': 'mpls-layer',
            'interactive': true,
            'source': 'mpls',
            'layout': {},
            'type': 'line',
            'paint': {
              'line-width': 2,
              'line-color': '#333333'
            }
        });

        map.addSource('stp', {
          type: 'geojson',
          data: stp
        });
  
        map.addLayer({
              'id': 'stp-layer',
              'interactive': true,
              'source': 'stp',
              'layout': {},
              'type': 'line',
              'paint': {
                'line-width': 2,
                'line-color': '#333333'
              }
          });


});

// $(document).ready(function() {
//     if ($("#wrapper").width() < 600) {
//         map.flyTo({
//             center: center,
//             zoom: mzoom,
//         });
//     } else {
//         map.flyTo({
//             center: center,
//             zoom: dzoom,
//         });
//     }
//     $(window).resize(function() {
//         if ($("#wrapper").width() < 600) {
//             map.flyTo({
//                 center: center,
//                 zoom: mzoom,
//             });
//         } else {
//             map.flyTo({
//                 center: center,
//                 zoom: dzoom,
//             });
//         }
//     });
// });



!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();