import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Report } from '../types/Report';
import { Box, CircularProgress } from '@mui/material';

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapProps {
  reports: Report[];
  loading: boolean;
  selectedCategory: string | null;
}

const Map = ({ reports, loading, selectedCategory }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-107.3940, 24.8057], // Sinaloa, Mexico
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map when reports change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Add reports source and layer if they don't exist
    if (!map.current.getSource('reports')) {
      map.current.addSource('reports', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add clusters
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'reports',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      // Add cluster count
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'reports',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Add unclustered point
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'reports',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'category'],
            'narcobloqueo', '#FF0000',
            'robo', '#FFA500',
            'accidente', '#FFFF00',
            'otro', '#0000FF',
            '#000000' // default color
          ],
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // Add heatmap layer
      map.current.addLayer({
        id: 'reports-heat',
        type: 'heatmap',
        source: 'reports',
        maxzoom: 15,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            15, 0
          ],
        }
      }, 'waterway-label');

      // Add click event for report details
      map.current.on('click', 'unclustered-point', (e) => {
        if (!e.features || e.features.length === 0) return;
        
        const feature = e.features[0];
        const props = feature.properties || {};
        
        new mapboxgl.Popup()
          .setLngLat([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
          .setHTML(`
            <h3>${props.category}</h3>
            <p>${props.description}</p>
            <p>Fecha: ${new Date(props.created_at).toLocaleString()}</p>
            ${props.image_url ? `<img src="${props.image_url}" alt="Reporte" style="max-width: 200px;" />` : ''}
          `)
          .addTo(map.current!);
      });
    }

    // Update source data with new reports
    if (reports.length > 0) {
      const filteredReports = selectedCategory 
        ? reports.filter(report => report.category === selectedCategory)
        : reports;
        
      const geoJsonData = {
        type: 'FeatureCollection',
        features: filteredReports.map(report => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [report.longitude, report.latitude]
          },
          properties: {
            id: report.id,
            category: report.category,
            description: report.description,
            created_at: report.created_at,
            image_url: report.image_url
          }
        }))
      };
      
      (map.current.getSource('reports') as mapboxgl.GeoJSONSource).setData(geoJsonData as any);
    }
  }, [mapLoaded, reports, selectedCategory]);

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {loading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            p: 2,
            borderRadius: 1
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
    </Box>
  );
};

export default Map;