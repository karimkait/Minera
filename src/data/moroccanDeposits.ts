import { MoroccanDepositFactSheet } from "../types";

export const MOROCCAN_DEPOSITS_CATALOG: MoroccanDepositFactSheet[] = [
  {
    id: "bou-azzer",
    name: "Mine de Bou Azzer",
    arabicName: "منجم بو عازر",
    category: "cobalt",
    region: "Drâa-Tafilalet / Anti-Atlas Central",
    province: "Province de Ouarzazate & Zagora",
    coordinates: {
      latitude: 30.5283,
      longitude: -6.9121,
    },
    primarySubstances: ["Cobalt (Co)", "Nickel (Ni)", "Arsenic lié (As)"],
    secondarySubstances: ["Argent (Ag)", "Or (Au)", "Bismuth (Bi)"],
    operator: "CTI (Compagnie de Tifnout Tiranimine) / Groupe Managem",
    geologicalEra: "Néoprotérozoïque supérieur (Panafricain)",
    geologicalContext:
      "Boutonnière précambrienne de Bou Azzer-El Graara. Minéralisations filiniennes hydrothermales à arséniures de cobalt et nickel (skuttérudite, safflorite, cobaltite) logées au contact des serpentinites ophiolitiques et des formations volcano-sédimentaires.",
    annualProductionOrCapacity:
      "~2 000 à 2 300 tonnes de cobalt métal contenu par an. Seul gisement au monde où le cobalt est extrait comme minerai primaire principal (non pas en simple sous-produit du cuivre ou du nickel).",
    averageCommercialGrades:
      "Teneur tout-venant: 1.1% à 1.8% Co. Concentrés marchands: 12% à 16% Co après enrichissement gravimétrique et flottation.",
    strategicImportance:
      "Acteur stratégique de la transition énergétique mondiale. Fournisseur certifié éco-responsable de cobalt pour les chaînes de valeur de batteries pour véhicules électriques (partenariat exclusif BMW Group et Groupe Renault). Traçabilité blockchain IRMA (Initiative for Responsible Mining Assurance).",
    environmentalCompliance:
      "Certifié ISO 14001 et ISO 45001. Recyclage en circuit fermé des eaux d'exhaure et confinement étanche des stériles arséniés.",
    historyAndDiscovery:
      "Découvert en 1928 suite à l'identification d'érythrite (fleur de cobalt rose) utilisée comme poison pour rongeurs dans les souks locaux de l'Anti-Atlas. Exploitation industrielle continue depuis 1934.",
    sources: [
      {
        title: "ONHYM - Office National des Hydrocarbures et des Mines (Fiche Métaux de Base & Cobalt)",
        url: "https://www.onhym.com",
        snippet: "Référence géologique sur l'ophiolite de Bou Azzer et la métallogénie des arséniures de cobalt.",
      },
      {
        title: "Groupe Managem - Activités Mines et Cobalt de Bou Azzer",
        url: "https://www.managemgroup.com",
        snippet: "Producteur de référence internationale de cathodes et sels de cobalt haute pureté pour l'industrie des batteries.",
      },
      {
        title: "Ministère de la Transition Énergétique et du Développement Durable (Royaume du Maroc)",
        url: "https://www.mem.gov.ma",
        snippet: "Statistiques officielles de la production minière nationale et stratégie des minéraux critiques 2030.",
      },
      {
        title: "Société Géologique de France / Chronique de la Recherche Minière",
        url: "https://www.geosoc.fr",
        snippet: "Études métallogéniques sur le district à cobalt-nickel-arsenic de Bou Azzer (Anti-Atlas, Maroc).",
      },
    ],
  },
  {
    id: "khouribga",
    name: "Bassin d'Oulad Abdoun (Khouribga)",
    arabicName: "حوض أولاد عبدون - خريبكة",
    category: "phosphate",
    region: "Béni Mellal-Khénifra / Chaouia",
    province: "Province de Khouribga",
    coordinates: {
      latitude: 32.8851,
      longitude: -6.9052,
    },
    primarySubstances: ["Phosphate de roche (P2O5)", "Phosphorite sédimentaire"],
    secondarySubstances: ["Fluor (F)", "Uranium (U)", "Terres Rares (REE)", "Gypse"],
    operator: "Groupe OCP S.A. (Office Chérifien des Phosphates)",
    geologicalEra: "Crétacé supérieur (Maastrichtien) à Éocène moyen (Lutétien)",
    geologicalContext:
      "Plateforme sédimentaire mésétienne. Dépôts phosphatés stratiformes réguliers intercalés de marnes et de calcaires à silex, formés en milieu marin peu profond soumis à des upwellings côtiers riches en nutriments minéraux.",
    annualProductionOrCapacity:
      "Plus de 20 à 25 millions de tonnes de roche phosphatée marchande par an. Premier et plus grand centre mondial d'extraction de phosphate.",
    averageCommercialGrades:
      "Teneurs marchandes de 68% à 75% BPL (Bone Phosphate of Lime), équivalent à 31% - 34.5% P2O5.",
    strategicImportance:
      "Pivot mondial absolu de la sécurité alimentaire et de la fertilisation agricole internationale. Le Maroc détient plus de 70% des réserves prouvées de phosphate de la planète. Alimente via pipeline de minerai (slurry pipeline Khouribga-Jorf Lasfar) le plus grand complexe d'engrais du globe.",
    environmentalCompliance:
      "Transport du phosphate par slurry pipeline économisant 3 millions de m³ d'eau et 90% d'énergie par rapport au train. Remise en état des sols par plantation d'arbres fruitiers (programme Mines Vertes OCP).",
    historyAndDiscovery:
      "Découvert en 1917 par le géologue Brives. Création de l'Office Chérifien des Phosphates par Dahir royal le 7 août 1920. Première expédition depuis le port de Casablanca le 23 juillet 1921.",
    sources: [
      {
        title: "Groupe OCP - Le Complexe Minier de Khouribga",
        url: "https://www.ocpgroup.ma",
        snippet: "Leader mondial de la nutrition des plantes et de la valorisation industrielle durable du phosphate.",
      },
      {
        title: "USGS Minerals Yearbook - Phosphate Rock & Moroccan Deposits",
        url: "https://www.usgs.gov",
        snippet: "World phosphate reserves, production capacity and geochemical benchmarks.",
      },
      {
        title: "ONHYM - Carte Géologique et Ressources Non-Métalliques du Maroc",
        url: "https://www.onhym.com",
        snippet: "Inventaire et cartographie des formations phosphatées du bassin d'Oulad Abdoun.",
      },
    ],
  },
  {
    id: "zgounder",
    name: "Gisement d'Argent de Zgounder",
    arabicName: "منجم الفضة زكوندر",
    category: "argent",
    region: "Souss-Massa / Anti-Atlas Occidental",
    province: "Province de Taroudant (Massif du Siroua)",
    coordinates: {
      latitude: 30.7321,
      longitude: -7.7654,
    },
    primarySubstances: ["Argent natif (Ag)", "Sulfures et amalgames d'argent"],
    secondarySubstances: ["Cuivre (Cu)", "Zinc (Zn)", "Plomb (Pb)"],
    operator: "Aya Gold & Silver Inc. (Zgounder Millennium Silver Mining)",
    geologicalEra: "Néoprotérozoïque supérieur (Précambrien II-III)",
    geologicalContext:
      "Flanc nord du massif volcanique du Jbel Siroua. Minéralisation épithermale à mésothermale associée à des tufs pyroclastiques, grès felsiques et intrusions andésitiques fracturées.",
    annualProductionOrCapacity:
      "Expansion majeure à plus de 6 à 8 millions d'onces d'argent par an (usine de cyanuration et de flottation de 2 700 tonnes/jour). Deuxième plus grande mine d'argent en exploitation au Maroc.",
    averageCommercialGrades:
      "Teneurs d'exploitation exceptionnelles comprises entre 240 g/t et 380 g/t Ag (et jusqu'à plusieurs kilogrammes d'argent par tonne dans les passées natives).",
    strategicImportance:
      "Ressource critique pour l'industrie photovoltaïque (pâte d'argent pour cellules solaires), l'électronique de pointe et l'électrification des transports.",
    environmentalCompliance:
      "Usine moderne de traitement à résidus filtrés à sec (dry stacking), éliminant les risques de digues à boues classiques. Alimentation par énergie verte renouvelable.",
    historyAndDiscovery:
      "Exploité initialement dès le Moyen-Âge sous les dynasties Almoravides et Almohades (Xe - XIIe siècles). Réactivé et modernisé au XXe siècle par le BRPM/ONHYM puis développé à grande échelle par Aya Gold & Silver.",
    sources: [
      {
        title: "Aya Gold & Silver - Zgounder Silver Mine Operations",
        url: "https://ayagoldsilver.com",
        snippet: "Derniers rapports techniques conformes NI 43-101 et mises à jour de production d'argent.",
      },
      {
        title: "ONHYM - Partenariats et Projets Miniers Argentifères",
        url: "https://www.onhym.com",
        snippet: "Historique d'exploration et valorisation des gisements argentifères du Siroua.",
      },
    ],
  },
  {
    id: "bleida",
    name: "Gisement Cuprifère de Bleïda",
    arabicName: "منجم النحاس البليدة",
    category: "cuivre",
    region: "Drâa-Tafilalet / Anti-Atlas Sud-Oriental",
    province: "Province de Zagora",
    coordinates: {
      latitude: 30.4052,
      longitude: -6.535,
    },
    primarySubstances: ["Cuivre (Cu) : Bornite, Chalcosine, Malachite"],
    secondarySubstances: ["Or (Au)", "Argent (Ag)", "Cobalt résiduel"],
    operator: "Groupe Managem / Coopératives artisanales CADEX",
    geologicalEra: "Précambrien II supérieur (Infracambrien)",
    geologicalContext:
      "Boutonnière de Bou Azzer-El Graara (secteur oriental). Amas et lentilles stratoïdes à bornite-chalcosine encaissés dans des schistes, siltites et grès de la formation de Bleïda en bordure du socle panafricain.",
    annualProductionOrCapacity:
      "Capacité de traitement de 1 200 à 1 500 tonnes de minerai tout-venant/jour. Production de concentrés de cuivre pour métallurgie et fonderies.",
    averageCommercialGrades:
      "Teneurs de minerai tout-venant de 2.2% à 4.5% Cu. Concentrés marchands enrichis à 28% - 35% Cu avec teneurs payables en or (1 à 2 g/t Au).",
    strategicImportance:
      "Le cuivre est le métal électro-conducteur numéro 1 pour la transition énergétique, les parcs éoliens, réseaux haute tension et moteurs électriques.",
    environmentalCompliance:
      "Réhabilitation des anciens terrils et bassins de décantation, contrôle rigoureux du drainage acide des roches.",
    historyAndDiscovery:
      "Vestiges de travaux miniers anciens remontant à l'Antiquité et à l'époque médiévale. Mise en exploitation industrielle moderne au début des années 1970 par la Somifer.",
    sources: [
      {
        title: "ONHYM - Métallogénie du Cuivre dans l'Anti-Atlas Marocain",
        url: "https://www.onhym.com",
        snippet: "Synthèse géologique des formations cuprifères néoprotérozoïques de Bleïda.",
      },
      {
        title: "Managem - Pôle Cuivre et Métaux de Base",
        url: "https://www.managemgroup.com",
        snippet: "Valorisation métallurgique des gisements cuprifères du Sud marocain.",
      },
    ],
  },
  {
    id: "draa-sfar-guemassa",
    name: "Amas Polymétallique de Draa Sfar & Guemassa (Mine de Hajar)",
    arabicName: "منجم درعة الصفار وحجر (الڭماسة)",
    category: "zinc",
    region: "Marrakech-Safi / Plaine du Haouz et Jebilet",
    province: "Province de Marrakech & Al Haouz",
    coordinates: {
      latitude: 31.428,
      longitude: -8.115,
    },
    primarySubstances: ["Zinc (Zn)", "Plomb (Pb)", "Cuivre (Cu)"],
    secondarySubstances: ["Argent (Ag)", "Soufre (S)", "Cadmium (Cd)"],
    operator: "CMG (Compagnie Minière des Guemassa) / Groupe Managem",
    geologicalEra: "Paléozoïque (Carbonifère inférieur / Dinantien)",
    geologicalContext:
      "Massif hercynien des Jebilet Centrales et bloc des Guemassa. Amas sulfurés polymétalliques massifs (VMS - Volcanogenic Massive Sulfide) encaissés dans des pélites et roches volcano-sédimentaires viséennes métamorphisées.",
    annualProductionOrCapacity:
      "Mine la plus profonde d'Afrique du Nord (puits descendant à plus de 1 200 m de profondeur). Plus de 1.2 million de tonnes de minerai traité par an.",
    averageCommercialGrades:
      "Teneurs moyennes combinées: 5.5% Zn, 1.8% Pb, 0.6% Cu, 40 g/t Ag. Concentrés marchands: 52% Zn (blende), 65% Pb (galène).",
    strategicImportance:
      "Fourniture majeure de concentrés de zinc pour galvanisation et protection anticorrosion des aciers d'infrastructure et de carrosserie automobile.",
    environmentalCompliance:
      "Pionnier au Maroc de la technologie de remblai cimenté en pâte (paste backfill) qui réinjecte plus de 60% des rejets de flottation sous terre pour combler les chantiers et stabiliser le massif rocheux.",
    historyAndDiscovery:
      "Découvert par géophysique au sol et sondages profonds menés conjointement par le BRPM et le Bureau de Recherches Géologiques et Minières dans les années 1980.",
    sources: [
      {
        title: "Compagnie Minière des Guemassa (CMG) - Rapport d'Exploitation",
        url: "https://www.managemgroup.com",
        snippet: "Dépilement sous remblai et valorisation des sulfures polymétalliques massifs.",
      },
      {
        title: "Revue Canadienne des Sciences de la Terre - Metallogeny of Draa Sfar VMS",
        url: "https://cdnsciencepub.com",
        snippet: "Étude pétrologique et tectonique sur le gisement polymétallique profond de Draa Sfar.",
      },
    ],
  },
  {
    id: "zelmou",
    name: "Bassin de Barytine de Zelmou",
    arabicName: "حوض الباريتين بزلمو - بوعرفة",
    category: "barite",
    region: "L'Oriental / Hauts Plateaux de Bouarfa",
    province: "Province de Figuig",
    coordinates: {
      latitude: 32.5312,
      longitude: -1.968,
    },
    primarySubstances: ["Barytine (Sulfate de Baryum - BaSO4)"],
    secondarySubstances: ["Strontium (Sr)", "Fluorine résiduelle (CaF2)"],
    operator: "Sociétés minières de l'Oriental & Comptoirs d'Export de Baryte",
    geologicalEra: "Jurassique moyen à supérieur / Paléozoïque rehaussé",
    geologicalContext:
      "Domaine présaharien et chaîne des Horsts. Filons hydrothermaux et amas stratiformes de barytine blanche à grise très dense et pure, associés aux failles décrochantes mésozoïques.",
    annualProductionOrCapacity:
      "Production annuelle estimée entre 150 000 et 250 000 tonnes de barytine brute et calibrée. Le Maroc figure au top 3 des exportateurs mondiaux de barytine de forage.",
    averageCommercialGrades:
      "Densité spécifique marchande garantie ≥ 4.20 g/cm³ à 4.30 g/cm³ (norme internationale stricte API 13A pour boues de forage pétrolières et gazières), teneur en BaSO4 supérieure à 92% - 95%.",
    strategicImportance:
      "Produit minéral critique pour l'industrie mondiale du forage pétrolier, géothermique et gazier (agent alourdissant pour équilibrer la pression hydrostatique au fond des puits). Utilisé aussi dans les bétons anti-radiations pour hôpitaux et centrales.",
    environmentalCompliance:
      "Traitement physique par séparation gravimétrique dense (jigs et tables à secousses) sans réactifs chimiques toxiques, préservant la nappe phréatique désertique.",
    historyAndDiscovery:
      "Intensification de l'exploration dans les années 1980 avec l'essor des exportations de minéraux industriels via le port de Nador et le port de Casablanca.",
    sources: [
      {
        title: "API Specification 13A - Drilling Fluids Materials (Barite)",
        url: "https://www.api.org",
        snippet: "Spécifications de densité minérale et de granulométrie requises pour la baryte de forage.",
      },
      {
        title: "ONHYM - Roches et Minéraux Industriels du Maroc",
        url: "https://www.onhym.com",
        snippet: "Potentiel et cartographie des gisements de barytine et fluorine de l'Oriental marocain.",
      },
    ],
  },
  {
    id: "imiter",
    name: "Mine d'Argent d'Imiter",
    arabicName: "منجم الفضة إيميضر",
    category: "argent",
    region: "Drâa-Tafilalet / Anti-Atlas Oriental",
    province: "Province de Tinghir (Jbel Saghro)",
    coordinates: {
      latitude: 31.352,
      longitude: -5.811,
    },
    primarySubstances: ["Argent (Ag) sous forme de sulfosels et amalgames d'argent-mercure"],
    secondarySubstances: ["Mercure (Hg)", "Antimoine (Sb)", "Plomb (Pb)"],
    operator: "SMI (Société Métallurgique d'Imiter) / Groupe Managem",
    geologicalEra: "Néoprotérozoïque terminal (Éocambrien)",
    geologicalContext:
      "Dôme d'Imiter dans le Jbel Saghro. Réseau dense de filons hydrothermaux à argent et quartz/dolomie encaissés dans des pélites et grès noirs protérozoïques coupés par des granites panafricains tardifs.",
    annualProductionOrCapacity:
      "Capacité de 200 à 250 tonnes d'argent fin sous forme de lingots certifiés de pureté 99.9% (billon et anodes). Une des mines d'argent à plus haute teneur au monde.",
    averageCommercialGrades:
      "Teneurs exceptionnelles pouvant dépasser 500 à 1 000 g/t Ag dans les zones d'enrichissement supergène.",
    strategicImportance:
      "Lingots d'argent 999.9‰ côtés à l'international, utilisés dans la bijouterie de luxe, les investissements de réserve et l'industrie photovoltaïque.",
    environmentalCompliance:
      "Raffinage hydrométallurgique in situ, recyclage à 100% de la solution de cyanuration en boucle fermée et contrôle atmosphérique rigoureux.",
    historyAndDiscovery:
      "Site séculaire connu depuis le VIIIe siècle sous les Abbassides et les Idrissides (frappe monétaire du dirham d'argent à Todgha). Modernisé au XXe siècle.",
    sources: [
      {
        title: "Société Métallurgique d'Imiter (SMI) - Bourse de Casablanca",
        url: "https://www.casablanca-bourse.com",
        snippet: "Rapports financiers, teneurs extraites et production annuelle d'argent d'Imiter.",
      },
      {
        title: "ONHYM - Le District Argentifère d'Imiter (Jbel Saghro)",
        url: "https://www.onhym.com",
        snippet: "Modèle gitologique des épithermaux argentifères néoprotérozoïques du Maroc.",
      },
    ],
  },
  {
    id: "mibladen",
    name: "District Minier de Mibladen & Aouli",
    arabicName: "منطقة ميبلادن وعولي - ميدلت",
    category: "plomb",
    region: "Drâa-Tafilalet / Haute Moulouya",
    province: "Province de Midelt",
    coordinates: {
      latitude: 32.7485,
      longitude: -4.6521,
    },
    primarySubstances: ["Plomb (Galène - PbS)", "Barytine"],
    secondarySubstances: ["Vanadinite cristallisée", "Cérusite", "Zinc (Sphalérite)"],
    operator: "Exploitations artisanales agréées & Coopératives minières de Midelt",
    geologicalEra: "Jurassique inférieur (Lias) sur socle hercynien",
    geologicalContext:
      "Minéralisations stratoïdes et karstiques plombo-barytiques dans des dolomies et calcaires liasiques du Haut Atlas Oriental. Réputé mondialement pour les plus beaux spécimens de vanadinite rouge gemme de la planète.",
    annualProductionOrCapacity:
      "Production de concentrés de plomb artisanal et gisement de référence mondiale pour les minéraux de collection gemmologiques exportés vers les musées et collectionneurs internationaux.",
    averageCommercialGrades:
      "Concentrés de plomb galène: 60% à 72% Pb. Spécimens minéralogiques de vanadinite haut de gamme cotés à plusieurs milliers de dollars la pièce.",
    strategicImportance:
      "Patrimoine minéralogique national exceptionnel et économie minière artisanale encadrée par la CADEX et le Ministère des Mines.",
    environmentalCompliance:
      "Sécurité des galeries artisanales et surveillance de la qualité des cours d'eau de la Moulouya.",
    historyAndDiscovery:
      "Exploité à grande échelle de 1930 à 1975 par la Société des Mines d'Aouli et la Société de Mibladen, puis poursuivi par les artisans mineurs locaux.",
    sources: [
      {
        title: "Mindat.org - Mibladen Mining District (World Mineral Reference)",
        url: "https://www.mindat.org/loc-2384.html",
        snippet: "Global database of mineral species, crystal formations and geology of Mibladen.",
      },
      {
        title: "CADEX - Centrale d'Achat et de Développement de la Région Minière du Tafilalet",
        url: "https://www.mem.gov.ma",
        snippet: "Encadrement de l'artisanat minier dans les provinces d'Errachidia, Tinghir et Midelt.",
      },
    ],
  },
];
