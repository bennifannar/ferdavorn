'use client';
import { useEffect, useMemo, useRef } from 'react';
import type { Vehicle } from '@/lib/risk/riskEngine';
import segments from '@/lib/geo/segments.sample.geojson' assert { type: 'json' };
import { crosswindScore, icingScore, fordScore, totalRisk } from '@/lib/risk/riskEngine';

export default function MapView({ vehicle }: { vehicle: Vehicle }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Reiknum einfalt risk fyrir demo
  const data = useMemo(() => {
    const clone: any = structuredClone(segments);
    clone.features = (segments as any).features.map((f: any) => {
      const base = { ...f };
      if (f.properties.type === 'road') {
        const { windGustMs, windDirDeg, tempC, precipMmH, isNight } =
          { windGustMs: 18, windDirDeg: 260, tempC: 1, precipMmH: 0.3, isNight: false };
        const W = crosswindScore(windGustMs, windDirDeg, f.properties.roadDirDeg ?? 0, vehicle);
        const I = icingScore(tempC, precipMmH, isNight);
        const { level } = totalRisk(W, I, 0);
        base.properties.risk_level = level;
      } else if (f.properties.type === 'ford') {
        const H = fordScore(0.35, 0.6);
        const { level } = totalRisk(0, 0, H);
        base.properties.risk_level = level;
      }
      return base;
    });
    return clone;
  }, [vehicle]);

  useEffect(() => {
    let map: any;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');
      map = new maplibregl.Map({
        container: ref.current!,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [-19, 64.9],
        zoom: 6
      });
      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.on('load', () => {
        map.addSource('segments', { type: 'geojson', data });

        map.addLayer({
          id: 'roads',
          type: 'line',
          source: 'segments',
          filter: ['==', ['get', 'type'], 'road'],
          paint: {
            'line-width': 5,
            'line-color': [
              'match', ['get', 'risk_level'],
              'red', '#e11d48',
              'yellow', '#f59e0b',
              'green', '#22c55e',
              '#94a3b8'
            ]
          }
        });

        map.addLayer({
          id: 'fords',
          type: 'circle',
          source: 'segments',
          filter: ['==', ['get', 'type'], 'ford'],
          paint: {
            'circle-radius': 7,
            'circle-color': [
              'match', ['get', 'risk_level'],
              'red', '#e11d48',
              'yellow', '#f59e0b',
              'green', '#22c55e',
              '#94a3b8'
            ],
            'circle-stroke-color': '#111',
            'circle-stroke-width': 1
          }
        });
      });

      return () => map && map.remove();
    })();
  }, [data]);

  return <div ref={ref} style={{ width: '100%', height: '70vh' }} />;
}
