<script lang="ts">
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';

  let { propertyCoords, surroundingArea = [], directoryProperties = [], properties = [], activeLocation, hoveredLocation = null, propertyTitle, mapVariant = 'default' } = $props();
  let mapElement: HTMLElement;
  let map = $state<any>(null);
  let markers = $state<any>({});
  let L: any;
  let defaultBounds = $state<any>(null);
  
  let markerClusterGroup = $state<any>(null); 

  onMount(() => {
    const timer = setTimeout(async () => {
      L = (await import('leaflet')).default;
      await import('leaflet.markercluster'); 

      let m = L.map(mapElement, { zoomControl: false });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(m);

        if (mapVariant === 'propose') {
          fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
            .then(res => res.json())
            .then(data => {
              const indianaGeoJSON = {
                type: 'FeatureCollection',
                features: data.features.filter((f: any) => f.properties.name === 'Indiana')
              };

              L.geoJSON(indianaGeoJSON, {
                style: {
                  color: '#09090b', 
                  weight: 3,        
                  fillColor: '#14b8a6', 
                  fillOpacity: 0.05
                },
                interactive: false 
              }).addTo(m);
            })
            .catch(err => console.error("Could not load Indiana boundary", err));
        }

    const customPopupOptions = { className: 'jax-popup', closeButton: false };

    const mainIcon = L.divIcon({
      className: 'bg-transparent',
      html: `
        <div class="animate-bounce drop-shadow-xl">
          <div class="marker-dot w-6 h-6 bg-teal-500 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 origin-bottom">
            <div class="w-1.5 h-1.5 bg-white rounded-full transition-all duration-300"></div>
          </div>
        </div>`,
      iconSize: [24, 24], 
      iconAnchor: [12, 24] 
    });

    const smallIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-zinc-800 rounded-full border-2 border-white shadow-md"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8]
    });

    let featureGroupArray: any[] = [];

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50, 
      spiderfyOnMaxZoom: true,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        return L.divIcon({
          className: 'bg-transparent',
          html: `<div class="w-10 h-10 bg-teal-600/90 backdrop-blur-sm rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-sm hover:bg-teal-500 transition-colors">
                  ${count}
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      }
    });

    let dirProps = directoryProperties.length > 0 ? directoryProperties : properties;

    // --- DIRECTORY MODE (Available/Leased Pages & Drawer) ---
    if (dirProps.length > 0) {
      dirProps.forEach((prop: any) => {
        if (prop.coordinates?.lat && prop.coordinates?.lng) {
          
          let linkHtml = prop.slug
            ? `<a href="/properties/${prop.slug}" class="mt-2 pt-2 border-t border-zinc-100 text-xs font-bold text-teal-600 hover:text-teal-700 block">View Property Details &rarr;</a>`
            : '';

          const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], { icon: mainIcon })
            .bindPopup(`
              <div class="text-center flex flex-col gap-1">
                <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">${prop.status || 'Property'}</span>
                
                <a href="/properties/${prop.slug}" class="text-sm font-bold text-zinc-950 hover:text-teal-600 transition-colors leading-tight">${prop.title}</a>
                
                ${linkHtml}
              </div>
            `, customPopupOptions);
          
          markers[prop.slug] = marker;
          clusterGroup.addLayer(marker);
          featureGroupArray.push(marker);
        }
      });
    } 
    // --- SINGLE PROPERTY MODE (Individual Property Pages) ---
    else {
      if (propertyCoords?.lat && propertyCoords?.lng) {
        const mainMarker = L.marker([propertyCoords.lat, propertyCoords.lng], { icon: mainIcon })
          .bindPopup(`<div class="text-center flex flex-col gap-1"><span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Target Property</span><span class="text-sm font-bold text-zinc-950 leading-tight">${propertyTitle || 'Main Property'}</span></div>`, customPopupOptions);
        markers['main'] = mainMarker;
        clusterGroup.addLayer(mainMarker);
        featureGroupArray.push(mainMarker);
      }

      surroundingArea.forEach((place: any) => {
        if (place.lat && place.lng && place.name) {
          const marker = L.marker([place.lat, place.lng], { icon: smallIcon })
            .bindPopup(`<div class="text-xs font-bold text-zinc-950 uppercase tracking-widest text-center">${place.name}</div>`, customPopupOptions);
          markers[place.name] = marker;
          clusterGroup.addLayer(marker);
          featureGroupArray.push(marker);
        }
      });
    }

    m.addLayer(clusterGroup);
    markerClusterGroup = clusterGroup;

    // +++ MAP CENTERING +++
    if (mapVariant === 'propose') {
      m.setView([39.7684, -86.1581], 6);
    } else if (featureGroupArray.length > 0) {
      const group = L.featureGroup(featureGroupArray);
      defaultBounds = group.getBounds();
      m.fitBounds(defaultBounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      m.setView([39.1653, -86.5264], 13);
    }

    setTimeout(() => { m.invalidateSize(); }, 100);
        map = m;

    }, 50); 

    return () => { 
      clearTimeout(timer);
      if (map) map.remove(); 
    };
  });

// --- THE FLIGHT ANIMATION ---
  $effect(() => {
    if (map && markerClusterGroup) {
      if (activeLocation) {
        const lat = activeLocation.coordinates?.lat || activeLocation.lat;
        const lng = activeLocation.coordinates?.lng || activeLocation.lng;

        if (lat && lng) {
          const identifier = activeLocation.slug || activeLocation.name || 'main';
          const targetMarker = markers[identifier];

          if (targetMarker) {
            map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
            
            map.once('moveend', () => {
              markerClusterGroup.zoomToShowLayer(targetMarker, () => {
                targetMarker.openPopup();
              });
            });
          } else {
             map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
          }
        }
      } else {
        // RESET logic
        let dirProps = directoryProperties.length > 0 ? directoryProperties : properties;
        
        if (dirProps.length > 0 && defaultBounds) {
          map.flyToBounds(defaultBounds, { padding: [50, 50], maxZoom: 15, animate: true, duration: 1.5 });
          map.closePopup();
        } else if (propertyCoords) {
          map.flyTo([propertyCoords.lat, propertyCoords.lng], 13, {
            animate: true,
            duration: 1.5
          });
          if (markers['main']) {
             map.once('moveend', () => {
               markerClusterGroup.zoomToShowLayer(markers['main'], () => {
                  markers['main'].openPopup();
               });
             });
          }
        }
      }
    }
  });

// --- CROSS-HOVER ANIMATION ---
  $effect(() => {
    if (!map || !markers) return;

    // 1. Reset all markers to their default state
    Object.values(markers).forEach((m: any) => {
      const el = m.getElement();
      if (el) {
        const dot = el.querySelector('.marker-dot');
        if (dot) {
          dot.classList.remove('scale-[1.6]', 'bg-teal-400');
          dot.classList.add('bg-teal-500');
          m.setZIndexOffset(0);
        }
      }
    });

    // 2. Enlarge and highlight the hovered marker
    if (hoveredLocation) {
      const identifier = hoveredLocation.slug || hoveredLocation.name;
      const targetMarker = markers[identifier];
      if (targetMarker) {
        const el = targetMarker.getElement();
        if (el) {
          const dot = el.querySelector('.marker-dot');
          if (dot) {
            dot.classList.remove('bg-teal-500');
            dot.classList.add('scale-[1.6]', 'bg-teal-400');
            targetMarker.setZIndexOffset(1000);
          }
        }
      }
    }
  });
</script>

<div bind:this={mapElement} class="w-full h-full min-h-[400px] z-10 rounded-sm"></div>

<style>
  :global(.jax-popup .leaflet-popup-content-wrapper) {
    background-color: white !important;
    border: 1px solid #e4e4e7 !important;
    border-radius: 4px !important;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
    padding: 6px !important;
  }
  :global(.jax-popup .leaflet-popup-tip) {
    background-color: white !important;
    border: 1px solid #e4e4e7 !important;
    border-top: none !important;
    border-left: none !important;
    box-shadow: 2px 2px 5px rgb(0 0 0 / 0.05) !important;
  }
  :global(.jax-popup .leaflet-popup-content) {
    margin: 8px 12px !important;
  }
</style>