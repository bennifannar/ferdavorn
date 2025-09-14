'use client';
import { useMemo, useState } from 'react';
import MapView from '@/components/MapView';
import type { Vehicle } from '@/lib/risk/riskEngine';

export default function Home() {
  const [plate, setPlate] = useState('');
  const [klass, setKlass] = useState<'jeppi' | 'sendibil' | 'husbil'>('jeppi');

  const vehicle: Vehicle = useMemo(() => {
    if (klass === 'husbil') return { class: 'husbil', wheelHeightM: 0.46, wadingM: 0.35 };
    if (klass === 'sendibil') return { class: 'sendibil', wheelHeightM: 0.42, wadingM: 0.30 };
    return { class: 'jeppi', wheelHeightM: 0.48, wadingM: 0.40 };
  }, [klass]);

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>FerðVörn – prufa</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12 }}>Bílnúmer (valkvætt)</label><br />
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="t.d. ABC12"
            style={{ border: '1px solid #ccc', borderRadius: 8, padding: '8px 12px' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12 }}>Bílflokkur</label><br />
          <select
            value={klass}
            onChange={(e) => setKlass(e.target.value as any)}
            style={{ border: '1px solid #ccc', borderRadius: 8, padding: '8px 12px' }}
          >
            <option value="jeppi">Jeppi</option>
            <option value="sendibil">Sendibíll</option>
            <option value="husbil">Húsbíll</option>
          </select>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>⚠️ Prufu-gildi – sýnir litaða kafla og vöð.</div>
      </div>

      <MapView vehicle={vehicle} />
    </main>
  );
}
