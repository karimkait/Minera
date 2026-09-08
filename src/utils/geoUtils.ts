// Moroccan Mining Basins and Geolocation Utilities

export interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  timestamp?: string;
  locationHint?: string;
}

export function detectMoroccanMiningBasin(lat: number, lng: number): {
  basinName: string;
  region: string;
  dominantMinerals: string[];
} {
  // Rough bounding boxes for famous Moroccan mining districts

  // 1. Bou Azzer - Bleida (Anti-Atlas Central / Ouarzazate / Zagora)
  if (lat >= 30.3 && lat <= 31.1 && lng >= -7.4 && lng <= -6.3) {
    return {
      basinName: "Bassin Cobalt-Cuivre de Bou Azzer & Bleida (Anti-Atlas)",
      region: "Drâa-Tafilalet (Ouarzazate / Zagora)",
      dominantMinerals: ["Cobalt (Co)", "Cuivre (Cu)", "Nickel (Ni)", "Or (Au)"],
    };
  }

  // 2. Zgounder / Jbel Siroua (Anti-Atlas Occidental)
  if (lat >= 30.5 && lat <= 31.0 && lng >= -8.0 && lng <= -7.4) {
    return {
      basinName: "Gisement Argentifère de Zgounder (Jbel Siroua)",
      region: "Souss-Massa / Drâa-Tafilalet",
      dominantMinerals: ["Argent (Ag)", "Cuivre (Cu)", "Zinc (Zn)"],
    };
  }

  // 3. Khouribga (Bassin d'Oulad Abdoun)
  if (lat >= 32.5 && lat <= 33.3 && lng >= -7.3 && lng <= -6.5) {
    return {
      basinName: "Bassin Phosphatier d'Oulad Abdoun (Khouribga)",
      region: "Béni Mellal-Khénifra / Chaouia",
      dominantMinerals: ["Phosphate de Chaux (BPL 70-74%)", "Terres Rares (traces)"],
    };
  }

  // 4. Gantour / Benguerir / Youssoufia
  if (lat >= 32.0 && lat <= 32.6 && lng >= -8.8 && lng <= -7.6) {
    return {
      basinName: "Bassin Phosphatier de Gantour (Benguerir - Youssoufia)",
      region: "Marrakech-Safi",
      dominantMinerals: ["Phosphate", "Uranium résiduel"],
    };
  }

  // 5. Tafilalet / CADEX (Mibladen, Aouli, Taouz, Alnif, Erfoud)
  if (lat >= 30.8 && lat <= 32.9 && lng >= -5.6 && lng <= -3.7) {
    return {
      basinName: "Zone Minière Artisanale & Industrielle CADEX Tafilalet",
      region: "Drâa-Tafilalet (Errachidia / Midelt / Tinghir)",
      dominantMinerals: ["Barytine (BaSO4)", "Plomb (Pb)", "Zinc (Zn)", "Vanadinite"],
    };
  }

  // 6. Zelmou / Bouarfa (Oriental Sud)
  if (lat >= 32.2 && lat <= 32.9 && lng >= -2.5 && lng <= -1.6) {
    return {
      basinName: "Bassin Minier de Zelmou & Bouarfa (Oriental)",
      region: "Oriental (Figuig / Bouarfa)",
      dominantMinerals: ["Barytine Haute Densité", "Manganèse (Mn)"],
    };
  }

  // 7. Touissit - Sidi Boubker - Jerada (Oriental Nord)
  if (lat >= 34.0 && lat <= 34.9 && lng >= -2.4 && lng <= -1.6) {
    return {
      basinName: "District Polymétallique de Touissit - Bou Beker - Jerada",
      region: "Oriental (Oujda / Jerada)",
      dominantMinerals: ["Plomb (Pb)", "Zinc (Zn)", "Argent (Ag)", "Anthracite"],
    };
  }

  // 8. Guemassa / Hajar (Al Haouz)
  if (lat >= 31.1 && lat <= 31.6 && lng >= -8.5 && lng <= -7.8) {
    return {
      basinName: "Gisement Polymétallique de Draa Sfar & Hajar (Guemassa)",
      region: "Marrakech-Safi",
      dominantMinerals: ["Zinc (Zn)", "Plomb (Pb)", "Cuivre (Cu)"],
    };
  }

  // 9. Meskala (Essaouira)
  if (lat >= 31.2 && lat <= 31.7 && lng >= -9.6 && lng <= -9.0) {
    return {
      basinName: "Bassin Phosphatier de Meskala (Essaouira)",
      region: "Marrakech-Safi",
      dominantMinerals: ["Phosphate"],
    };
  }

  // 10. Bou Craa (Provinces du Sud)
  if (lat >= 25.5 && lat <= 27.5 && lng >= -13.5 && lng <= -12.0) {
    return {
      basinName: "Bassin Phosphatier de Bou Craa (Phosboucraa)",
      region: "Laâyoune-Sakia El Hamra",
      dominantMinerals: ["Phosphate de roche enrichi (80% BPL)"],
    };
  }

  // Default fallback for any Moroccan site
  return {
    basinName: "Gisement / Périmètre Minier Marocain Certifié",
    region: lat > 32 ? "Nord / Centre du Maroc" : "Sud / Anti-Atlas Marocain",
    dominantMinerals: ["Minerais & Concentrés"],
  };
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getOpenStreetMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}
