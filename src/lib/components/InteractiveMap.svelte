<script lang="ts">
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let { propertyCoords, surroundingArea = [], directoryProperties = [], activeLocation, propertyTitle } = $props();
  
  let mapElement: HTMLElement;
  let map = $state<any>(null);
  let markers = $state<any>({});
  let L: any;
  let defaultBounds = $state<any>(null); // Stores the perfect camera angle to see all pins

  onMount(async () => {
    L = (await import('leaflet')).default;

    let m = L.map(mapElement, { zoomControl: false });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(m);

    const customPopupOptions = { className: 'jax-popup', closeButton: false };

    const mainIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-6 h-6 bg-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce"><div class="w-1.5 h-1.5 bg-white rounded-full"></div></div>`,
      iconSize: [24, 24], iconAnchor: [12, 12]
    });

    const smallIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-zinc-800 rounded-full border-2 border-white shadow-md"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8]
    });

    let featureGroupArray: any[] = [];

    // --- DIRECTORY MODE (Multiple Properties) ---
    if (directoryProperties.length > 0) {
      directoryProperties.forEach((prop: any) => {
        if (prop.coordinates?.lat && prop.coordinates?.lng) {
          const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], { icon: mainIcon }).addTo(m)
            .bindPopup(`
              <div class="text-center flex flex-col gap-1">
                <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">${prop.status || 'Property'}</span>
                <span class="text-sm font-bold text-zinc-950 leading-tight">${prop.title}</span>
              </div>
            `, customPopupOptions);
          
          markers[prop.slug] = marker;
          featureGroupArray.push(marker);
        }
      });
    } 
    // --- SINGLE PROPERTY MODE ---
    else {
      if (propertyCoords?.lat && propertyCoords?.lng) {
        const mainMarker = L.marker([propertyCoords.lat, propertyCoords.lng], { icon: mainIcon }).addTo(m)
          .bindPopup(`<div class="text-center flex flex-col gap-1"><span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Target Property</span><span class="text-sm font-bold text-zinc-950 leading-tight">${propertyTitle || 'Main Property'}</span></div>`, customPopupOptions);
        markers['main'] = mainMarker;
        featureGroupArray.push(mainMarker);
      }

      surroundingArea.forEach((place: any) => {
        if (place.lat && place.lng && place.name) {
          const marker = L.marker([place.lat, place.lng], { icon: smallIcon }).addTo(m)
            .bindPopup(`<div class="text-xs font-bold text-zinc-950 uppercase tracking-widest text-center">${place.name}</div>`, customPopupOptions);
          markers[place.name] = marker;
          featureGroupArray.push(marker);
        }
      });
    }

    // Auto-frame the camera to fit all pins perfectly
    if (featureGroupArray.length > 0) {
      const group = L.featureGroup(featureGroupArray);
      defaultBounds = group.getBounds();
      m.fitBounds(defaultBounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      m.setView([39.1653, -86.5264], 13);
    }

    setTimeout(() => { m.invalidateSize(); }, 100);
    map = m;

    return () => { if (map) map.remove(); };
  });

// --- THE FLIGHT ANIMATION ---
  $effect(() => {
    if (map) {
      // Check if activeLocation has coordinates
      if (activeLocation && activeLocation.coordinates) {
        map.flyTo([activeLocation.coordinates.lat, activeLocation.coordinates.lng], 17, { animate: true, duration: 1.5 });
        
        // Open the popup using the slug
        if (markers[activeLocation.slug]) {
          markers[activeLocation.slug].openPopup();
        }
      } else {
        // RESET: Zoom back out to see all properties.
        if (directoryProperties.length > 0 && defaultBounds) {
          map.flyToBounds(defaultBounds, { padding: [50, 50], maxZoom: 15, animate: true, duration: 1.5 });
          map.closePopup();
        } else if (propertyCoords) {
          map.flyTo([propertyCoords.lat, propertyCoords.lng], 13, { animate: true, duration: 1.5 });
          if (markers['main']) markers['main'].openPopup();
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