// ═══════════════════════════════════════════════════════════════════════
// BIOVAULT v4 — TypeScript Data Generation Module
// 1100+ Global Companies, Normalized & Deduplicated
// ═══════════════════════════════════════════════════════════════════════

// ── Controlled vocabularies ──

export const TA = ["Oncology","Immunology","Neurology","Cardiology","Rare Disease","Infectious Disease","Metabolic","Ophthalmology","Hematology","Dermatology","Respiratory","GI","Endocrinology","Nephrology","CNS","Virology","Genetic Medicine","Hepatology","Pulmonology","Urology","Women's Health","Musculoskeletal"];
export const MOD = ["Small Molecule","mAb","ADC","Gene Therapy","Cell Therapy","mRNA","siRNA","Bispecific Ab","Peptide","Degrader","ASO","Fusion Protein","Gene Editing","Radioligand","ERT","Vaccine","Nanobody","Multispecific"];
export const PH = ["Preclinical","Phase 1","Phase 1/2","Phase 2","Phase 2/3","Phase 3","NDA/BLA","Approved"];
export const STS = ["Recruiting","Active","Completed","Terminated","Not yet recruiting"];
export const MOA_L = ["PD-1i","PD-L1i","CDK4/6i","KRASG12Ci","BTKi","JAK1i","JAK1/2i","GLP-1ag","VEGFi","HER2","EGFRi","BCL-2i","PI3Ki","PARPi","CAR-T CD19","CAR-T BCMA","IL-17i","TNFi","PCSK9i","SGLT2i","ALKi","FGFRi","TYK2i","IL-23i","FcRni","C5i","CFTRmod","GLP-1/GIP","CGRPant","BiTE","Anti-Aβ","Anti-Tau","KRASG12Di","RAS(ON)i","Menini","WEE1i","CD3xCD20","TROP-2 ADC","Cl18.2","DLL3 ADC","BCMA ADC","FXIai","IL-13i","STINGag","SHP2i","CDK2i","MDM2i","USP1i","BETi","EZH2i","PRMT5i","CD47i","SOS1i","MALT1i","AHRant","KIF18Ai","WRNi","PLK4i","HPK1i","AuroraAi"];
export const TGT = ["PD-1","PD-L1","CDK4/6","KRASG12C","BTK","JAK1","JAK2","GLP-1R","VEGF","HER2","EGFR","BCL-2","PI3Kα","PARP","CD19","IL-17A","TNFα","PCSK9","SGLT2","ALK","FGFR","FLT3","RET","MET","TROP-2","Cl18.2","TIM-3","LAG-3","TIGIT","TYK2","IL-23","FcRn","C5","SMN2","CFTR","GIP-R","CGRP","CD3","Aβ","Tau","KRASG12D","Menin","WEE1","CD20","DLL3","GPRC5D","BCMA","FXIa","APOC3","IL-13","CD38","PSMA","B7-H3","Nectin-4","CD47","SHP2","CD123","BET","EZH2","CDK2","MDM2","USP1","AuroraA","PRMT5","SOS1","AHR","MALT1","KIF18A","PLK4","WRN"];
export const IND = ["NSCLC","Breast Ca","AML","CLL","Melanoma","Prostate Ca","CRC","Pancreatic Ca","MM","DLBCL","RA","Psoriasis","Crohn's","UC","SLE","Alzheimer's","Parkinson's","T2D","Heart Failure","NASH","Atopic Derm","Asthma","Ovarian Ca","Bladder Ca","HNSCC","HCC","GBM","SCD","DMD","SMA","CF","Hemophilia A","IgAN","MG","MS","Migraine","Obesity","RSV","MDS","FL","MCL","RCC","Gastric Ca","SCLC","Urothelial Ca","Endometrial Ca","Wet AMD","GA","Huntington's","ALS","Epilepsy","Schizophrenia","MDD","Myelofibrosis","PV","CKD","FSGS","TTR Amyloidosis","PNH","NMOSD","Fabry","Pompe","Rett","Angelman","IPF","PAH","LN","AS","PsA","HS","CSU","EoE","Celiac","PBC","ADPKD","Dravet","LGS","FTD","PSP","Narcolepsy","ADHD","OCD","PTSD","Cholangiocarcinoma","Cervical Ca","MCC","BCC","CTCL","Meso","Ewing Sarcoma","NB","Wilms","ALL","CML","ET","WM","GIST","RB","ACC","Thymoma"];
export const PW = ["PD-1/PD-L1","RAS/MAPK","PI3K/AKT","JAK/STAT","Wnt","NF-κB","Apoptosis","DDR","Cell Cycle","Angiogenesis","Checkpoint","T-cell","Incretin","Complement","Amyloid","Tau","Neuroinflam","RNA Splicing","Epigenetic","Innate Imm","Fibrosis","Lipid Met","STING","Notch","Proteasome","Sphingolipid","Ferroptosis","Autophagy","Hedgehog","mTOR"];
export const EP = ["OS","PFS","ORR","DOR","CR","Safety","Biomarker","CfB","ACR20","PASI75","HbA1c","LiverFat","EFS","MRD","FEV1","EDSS","HAM-D","PANSS","eGFR","UPCR","VA","SeizFreq","UPDRS","BodyWt","DAS28","Mayo","SRI-4","EASI-75","6MWD","NT-proBNP"];

// ── Seeded RNG ──

function S(s: number) {
  let x = s;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}
const R = S(2025);
const pk = <T>(a: T[]): T => a[~~(R() * a.length)];
const pkN = <T>(a: T[], n: number): T[] => {
  const s = [...a], r: T[] = [];
  for (let i = 0; i < Math.min(n, s.length); i++) r.push(s.splice(~~(R() * s.length), 1)[0]);
  return r;
};
const ri = (a: number, b: number) => ~~(R() * (b - a + 1)) + a;

// ── TypeScript Interfaces ──

export interface Company {
  id: string;
  name: string;
  ticker: string | null;
  exchange: string;
  hq: string;
  country: string;
  type: string;
  founded: number | null;
  employees: number | null;
  marketCap: number | null;
  therapeuticAreas: string[];
  platform: string;
  source: string;
  isPublic: boolean;
  fundingStatus: string;
  website: string | null;
}

export interface Drug {
  id: string;
  name: string | null;
  code: string;
  modality: string;
  moa: string;
  target: string;
  pathway: string;
  phase: string;
  indications: string[];
  companyId: string;
  companyName: string;
  aliases: string[];
  canonicalName: string | null;
  source: string;
  trialCount?: number;
  highestPhase?: string;
  allIndications?: string[];
}

export interface Trial {
  id: string;
  nctId: string;
  drugId: string;
  drugCode: string;
  drugName: string | null;
  phase: string;
  indication: string;
  enrollment: number;
  status: string;
  startDate: string;
  estCompletion: string;
  endpoint: string;
  companyId: string;
  companyName: string;
  registry: string;
  lastSynced: string;
  validated: boolean;
  syncSource: string;
}

export interface Catalyst {
  id: string;
  date: string;
  type: string;
  drugId: string;
  drugCode: string;
  drugName: string | null;
  companyId: string;
  companyName: string;
  indication: string;
}

export interface BioVaultDB {
  companies: Company[];
  drugs: Drug[];
  trials: Trial[];
  catalysts: Catalyst[];
}

// ── Compact Company Database ──

const C_DATA = `
Pfizer|PFE|NYSE|New York NY|US|pharma|1849|83000|150|0,5,9,4|SM & Biologics|ex
Johnson & Johnson|JNJ|NYSE|New Brunswick NJ|US|pharma|1886|131000|380|0,1,2,3|Diversified|ex
Eli Lilly|LLY|NYSE|Indianapolis IN|US|pharma|1876|43000|750|6,0,2,1|GLP-1 & Biologics|ex
Roche|RHHBY|OTC|Basel CH|CH|pharma|1896|100000|220|0,2,1,7|Biologics & Dx|ex
Novartis|NVS|NYSE|Basel CH|CH|pharma|1996|78000|210|0,1,2,3|Targeted & Cell/Gene|ex
Merck & Co|MRK|NYSE|Rahway NJ|US|pharma|1891|69000|290|0,5,3|Keytruda & ADCs|ex
AbbVie|ABBV|NYSE|North Chicago IL|US|pharma|2013|50000|310|1,0,2|Biologics & ADCs|ex
AstraZeneca|AZN|NASDAQ|Cambridge UK|GB|pharma|1999|83100|230|0,3,10,4|ADC & Bispecific|ex
Bristol-Myers Squibb|BMY|NYSE|Princeton NJ|US|pharma|1887|34000|95|0,8,1,3|IO & Cell|ex
Sanofi|SNY|NASDAQ|Paris FR|FR|pharma|2004|91000|130|1,0,4,5|Dupixent & mRNA|ex
Novo Nordisk|NVO|NYSE|Bagsvaerd DK|DK|pharma|1923|64000|550|6,4,3|GLP-1 Platform|ex
GSK|GSK|NYSE|London UK|GB|pharma|2000|72000|80|5,0,1,10|Vaccines & Bio|ex
Takeda|TAK|NYSE|Tokyo JP|JP|pharma|1781|49000|48|4,0,2,11|Bio & Plasma|ex
Bayer|BAYRY|OTC|Leverkusen DE|DE|pharma|1863|100000|28|0,3,7|Radiopharma|ex
Daiichi Sankyo|DSNKY|OTC|Tokyo JP|JP|pharma|2005|17000|60|0,3|DXd ADC|ex
Amgen|AMGN|NASDAQ|Thousand Oaks CA|US|bio|1980|27000|160|0,3,1|Bio & Bispecific|ex
Gilead Sciences|GILD|NASDAQ|Foster City CA|US|bio|1987|17000|105|15,0,1|SM & Cell|ex
Regeneron|REGN|NASDAQ|Tarrytown NY|US|bio|1988|13000|115|1,0,7,4|VelociSuite|ex
Vertex Pharma|VRTX|NASDAQ|Boston MA|US|bio|1989|10400|120|4,16|CFTR & Gene Edit|ex
Moderna|MRNA|NASDAQ|Cambridge MA|US|bio|2010|5800|45|5,0,4|mRNA|ex
BioNTech|BNTX|NASDAQ|Mainz DE|DE|bio|2008|6200|28|0,5,1|mRNA & IO|ex
Biogen|BIIB|NASDAQ|Cambridge MA|US|bio|1978|7500|28|2,4|Bio & ASOs|ex
Alnylam|ALNY|NASDAQ|Cambridge MA|US|bio|2002|2600|32|4,3,14|RNAi/siRNA|ex
Argenx|ARGX|NASDAQ|Breda NL|NL|bio|2008|1800|30|1,2,8|FcRn Ab|ex
BeiGene|BGNE|NASDAQ|Beijing CN|CN|bio|2010|10500|22|0,8|Zanubrutinib|ex
Genmab|GMAB|NASDAQ|Copenhagen DK|DK|bio|1999|1500|16|0,8|DuoBody|ex
BioMarin|BMRN|NASDAQ|San Rafael CA|US|bio|1997|3500|16|4,16,8|ERT & Gene|ex
Incyte|INCY|NASDAQ|Wilmington DE|US|bio|1991|2200|14|0,8,9|JAK & Kinases|ex
Neurocrine|NBIX|NASDAQ|San Diego CA|US|bio|1992|1700|14|2,12|Neuroactive|ex
Sarepta|SRPT|NASDAQ|Cambridge MA|US|bio|1980|2800|14|4,16|Gene Ther RNA|ex
Legend Biotech|LEGN|NASDAQ|Somerset NJ|US|bio|2014|2800|10|0,8|CAR-T Carvykti|ex
Ionis|IONS|NASDAQ|Carlsbad CA|US|bio|1989|2800|8|2,3,4|ASO Platform|ex
Intra-Cellular|ITCI|NASDAQ|New York NY|US|bio|2002|1100|12|14|Lumateperone|ex
United Therapeutics|UTHR|NASDAQ|Silver Spring MD|US|bio|1996|1100|14|18,4|Prostacyclin|ex
Halozyme|HALO|NASDAQ|San Diego CA|US|bio|1998|900|11|0,6,1|ENHANZE|ex
Exelixis|EXEL|NASDAQ|Alameda CA|US|bio|1994|850|8|0|Cabo & ADCs|ex
Jazz Pharma|JAZZ|NASDAQ|Dublin IE|IE|pharma|2003|2400|9|2,0,4|CNS & Hem|ex
Innovent Bio|1801.HK|HKEX|Suzhou CN|CN|bio|2011|6000|6|0,1,6|Biologics|ex
Hansoh Pharma|3692.HK|HKEX|Lianyungang CN|CN|pharma|1995|12000|12|0,14,6|SM & Bio|ex
Samsung Biologics|207940.KS|KRX|Incheon KR|KR|bio|2011|7000|40|0|CDMO|ex
Ascendis Pharma|ASND|NASDAQ|Copenhagen DK|DK|bio|2007|800|8|4,12|TransCon|ex
Illumina|ILMN|NASDAQ|San Diego CA|US|bio|1998|7400|22|0|Sequencing|ex
Roivant Sciences|ROIV|NASDAQ|New York NY|US|bio|2014|300|8|1,9,0|Vant Model|ex
Blueprint Medicines|BPMC|NASDAQ|Cambridge MA|US|bio|2011|1000|7|0,8,4|Kinase Inh|ex
Revolution Medicines|RVMD|NASDAQ|Redwood City CA|US|bio|2014|500|8|0|RAS(ON)|ex
Nuvalent|NUVL|NASDAQ|Cambridge MA|US|bio|2018|200|9|0|Brain-pen Kinase|ex
Madrigal Pharma|MDGL|NASDAQ|W Conshohocken PA|US|bio|2016|430|7|6,17|Rezdiffra|ex
Viking Therapeutics|VKTX|NASDAQ|San Diego CA|US|bio|2012|45|6|6|Dual GLP-1/GIP|ex
Krystal Biotech|KRYS|NASDAQ|Pittsburgh PA|US|bio|2016|400|6|9,4,10|HSV Gene Ther|ex
Corcept|CORT|NASDAQ|Menlo Park CA|US|bio|1998|600|6|12,0|Cortisol Mod|ex
Intellia|NTLA|NASDAQ|Cambridge MA|US|bio|2014|750|5|16,4|CRISPR In Vivo|ex
Axsome|AXSM|NASDAQ|New York NY|US|bio|2012|600|5|14|Multi-CNS|ex
TG Therapeutics|TGTX|NASDAQ|New York NY|US|bio|2012|250|5|8,1|Anti-CD20|ex
Acadia Pharma|ACAD|NASDAQ|San Diego CA|US|bio|1993|900|4.5|2,14,4|Neuropsych|ex
CRISPR Therapeutics|CRSP|NASDAQ|Zug CH|CH|bio|2013|800|4|16,8|CRISPR|ex
Denali|DNLI|NASDAQ|S San Francisco CA|US|bio|2015|600|4|2|TV BBB|ex
Xenon Pharma|XENE|NASDAQ|Burnaby CA|CA|bio|1996|200|4|2|Nav1.6 Ion Ch|ex
Ideaya Bio|IDYA|NASDAQ|S San Francisco CA|US|bio|2015|190|4|0|Synth Lethality|ex
Immunocore|IMCR|NASDAQ|Abingdon UK|GB|bio|2008|700|3.5|0|ImmTAX|ex
Merus|MRUS|NASDAQ|Utrecht NL|NL|bio|2003|400|4|0|Biclonics|ex
Recursion|RXRX|NASDAQ|Salt Lake City UT|US|bio|2013|700|3.5|0,4,2|AI Drug OS|ex
Relay Therapeutics|RLAY|NASDAQ|Cambridge MA|US|bio|2016|400|3|0|Motion Design|ex
Kymera|KYMR|NASDAQ|Watertown MA|US|bio|2016|250|3|0,1|TPD|ex
Arcus Bio|RCUS|NYSE|Hayward CA|US|bio|2015|380|3|0|IO Combos|ex
Disc Medicine|IRON|NASDAQ|Cambridge MA|US|bio|2017|110|3|8,4|Iron Biology|ex
Day One Bio|DAWN|NASDAQ|Brisbane CA|US|bio|2018|200|3|0|Pediatric Onc|ex
Iovance|IOVA|NASDAQ|San Carlos CA|US|bio|2007|800|3|0|TIL Amtagvi|ex
Structure Ther|GPCR|NASDAQ|S San Francisco CA|US|bio|2018|180|3|6|GPCR SM|ex
Zealand Pharma|ZEAL|NASDAQ|Copenhagen DK|DK|bio|1998|600|6|6,4|Peptide|ex
Praxis Precision|PRAX|NASDAQ|Cambridge MA|US|bio|2015|120|3|2|Ion Channel|ex
Syndax|SNDX|NASDAQ|New York NY|US|bio|2005|110|2.5|0,8|Menin|ex
Arvinas|ARVN|NASDAQ|New Haven CT|US|bio|2013|450|2.5|0,2|PROTAC|ex
Zymeworks|ZYME|NASDAQ|Vancouver CA|CA|bio|2003|400|2.5|0|Azymetric ADC|ex
Beam|BEAM|NASDAQ|Cambridge MA|US|bio|2017|500|2.5|16,8|Base Editing|ex
Akero|AKRO|NASDAQ|S San Francisco CA|US|bio|2017|120|2.5|6,17|Efruxifermin|ex
Ultragenyx|RARE|NASDAQ|Novato CA|US|bio|2010|1600|6|4,16|ERT & Gene|ex
Apogee Ther|APGE|NASDAQ|San Francisco CA|US|bio|2022|60|5|1,9|IL-13 Ab|ex
CG Oncology|CGON|NASDAQ|Irvine CA|US|bio|2010|130|3|0|Oncolytic Ad|ex
Rocket Pharma|RCKT|NASDAQ|Cranbury NJ|US|bio|2015|500|2|4,8|LV Gene Ther|ex
iTeos|ITOS|NASDAQ|Gosselies BE|BE|bio|2012|120|2|0|TIGIT & Adeno|ex
Stoke Ther|STOK|NASDAQ|Bedford MA|US|bio|2014|150|1.2|4,2|TANGO ASO|ex
Verve|VERV|NASDAQ|Boston MA|US|bio|2018|250|1.1|3|Base Edit CV|ex
Prime Medicine|PRME|NASDAQ|Cambridge MA|US|bio|2019|280|1.2|16|Prime Editing|ex
Rapport Ther|RAPP|NASDAQ|Cambridge MA|US|bio|2020|80|1.5|2|GABA Subunit|ex
Neumora|NMRA|NASDAQ|Boston MA|US|bio|2021|250|1.8|14|AI Psychiatry|ex
Olema|OLMA|NASDAQ|San Francisco CA|US|bio|2006|120|1.5|0|CERAn ER+|ex
Mineralys|MLYS|NASDAQ|Philadelphia PA|US|bio|2020|50|1.2|3|AldoSynth Inh|ex
Alumis|ALMS|NASDAQ|S San Francisco CA|US|bio|2020|90|1.5|1,9|TYK2i|ex
Tango Ther|TNGX|NASDAQ|Cambridge MA|US|bio|2017|200|1.5|0|Synth Leth|ex
Enliven|ELVN|NASDAQ|Boulder CO|US|bio|2020|50|1|0|Switch Kinase|ex
Biomea Fusion|BMEA|NASDAQ|Redwood City CA|US|bio|2017|130|1.2|6,0|Covalent SM|ex
Ventyx Bio|VTYX|NASDAQ|Encinitas CA|US|bio|2019|120|1.2|1|Oral Immunol|ex
Acelyrin|SLRN|NASDAQ|Carlsbad CA|US|bio|2020|130|1|1|IL-15i|ex
89bio|ETNB|NASDAQ|San Francisco CA|US|bio|2018|110|1.5|6|Pegozafermin|ex
Agios|AGIO|NASDAQ|Cambridge MA|US|bio|2008|500|3.5|4,8|Cell Metab|ex
Protagonist|PTGX|NASDAQ|Newark CA|US|bio|2006|120|3.5|8,11|Peptide|ex
Vir Bio|VIR|NASDAQ|San Francisco CA|US|bio|2016|500|1.2|5,0|T-cell & Ab Eng|ex
Foghorn|FHTX|NASDAQ|Cambridge MA|US|bio|2016|150|0.5|0|Chromatin Reg|ex
Repare|RPTX|NASDAQ|Montreal CA|CA|bio|2016|180|0.6|0|Synth Leth|ex
MacroGenics|MGNX|NASDAQ|Rockville MD|US|bio|2000|450|0.8|0|DART Bispec|ex
Annexon|ANNX|NASDAQ|S San Francisco CA|US|bio|2011|150|0.8|2,7|Complement|ex
Sage|SAGE|NASDAQ|Cambridge MA|US|bio|2011|500|1|14|GABA Mod|ex
Voyager|VYGR|NASDAQ|Lexington MA|US|bio|2014|80|1.2|2|TRACER AAV|ex
Editas|EDIT|NASDAQ|Cambridge MA|US|bio|2013|340|0.5|16,7|CRISPR|ex
Fate Ther|FATE|NASDAQ|San Diego CA|US|bio|2007|450|0.5|0|iPSC NK|ex
Caribou Bio|CRBU|NASDAQ|Berkeley CA|US|bio|2011|230|0.7|0|chRDNA CAR-T|ex
Poseida|PSTX|NASDAQ|San Diego CA|US|bio|2014|200|0.6|0|piggyBac|ex
Passage Bio|PASG|NASDAQ|Philadelphia PA|US|bio|2017|160|0.3|4,2|AAV Gene|ex
Solid Bio|SLDB|NASDAQ|Charlestown MA|US|bio|2013|120|0.5|4|AAV DMD|ex
Taysha Gene|TSHA|NASDAQ|Dallas TX|US|bio|2019|120|0.6|4,2|AAV CNS|ex
Bluebird Bio|BLUE|NASDAQ|Somerville MA|US|bio|2010|600|0.3|4,8|LV Gene|ex
Uniqure|QURE|NASDAQ|Amsterdam NL|NL|bio|2012|500|1.5|4,2|AAV Gene|ex
Sangamo|SGMO|NASDAQ|Brisbane CA|US|bio|1995|300|0.15|16|ZFN Editing|ex
Y-mAbs|YMAB|NASDAQ|New York NY|US|bio|2015|250|0.6|0|Anti-GD2|ex
Novavax|NVAX|NASDAQ|Gaithersburg MD|US|bio|1987|1700|2|5|Nanopart Vax|ex
CureVac|CVAC|NASDAQ|Tubingen DE|DE|bio|2000|700|0.8|5,0|Opt mRNA|ex
Dynavax|DVAX|NASDAQ|Emeryville CA|US|bio|1996|500|1.5|5|CpG Adjuvant|ex
Arcturus|ARCT|NASDAQ|San Diego CA|US|bio|2013|200|0.6|4,5|sa-mRNA|ex
Altimmune|ALT|NASDAQ|Gaithersburg MD|US|bio|2005|80|0.5|6|GLP-1/GCG|ex
Terns|TERN|NASDAQ|Foster City CA|US|bio|2016|80|0.4|6,17|Oral GLP-1|ex
Schrodinger|SDGR|NASDAQ|New York NY|US|bio|1990|900|3.5|0|Physics DDisco|ex
Exscientia|EXAI|NASDAQ|Oxford UK|GB|bio|2012|500|0.8|0|AI Drug Design|ex
Absci|ABSI|NASDAQ|Vancouver WA|US|bio|2011|200|0.7|0|GenAI Bio|ex
10x Genomics|TXG|NASDAQ|Pleasanton CA|US|bio|2012|1400|3|0|SingleCell|ex
AbCellera|ABCL|NASDAQ|Vancouver CA|CA|bio|2012|500|1.8|1|AI Ab Disco|ex
Galapagos|GLPG|NASDAQ|Mechelen BE|BE|bio|1999|1000|2|1|Cell & IPF|ex
Bavarian Nordic|BVNRY|OTC|Kvistgaard DK|DK|bio|1994|1000|2|5|Poxvirus Vax|ex
Grifols|GRFS|NASDAQ|Barcelona ES|ES|bio|1940|23000|6|8|Plasma|ex
Sobi|SOBI.ST|OMX|Stockholm SE|SE|bio|2001|1700|10|4,8|Rare Bio|ex
CSL Limited|CSL.AX|ASX|Melbourne AU|AU|bio|1916|32000|100|8,1,4|Plasma & Recom|ex
Astellas|4503.T|TSE|Tokyo JP|JP|pharma|2005|14000|22|0,19,4|Gene & ADC|ex
Eisai|4523.T|TSE|Tokyo JP|JP|pharma|1941|11000|18|2,0|Lecanemab|ex
Chugai|4519.T|TSE|Tokyo JP|JP|pharma|1925|7800|55|0,8,1|Recycling Ab|ex
Ono Pharma|4528.T|TSE|Osaka JP|JP|pharma|1717|3500|12|0,1,2|PD-1 & SM|ex
UCB|UCB.BR|EBR|Brussels BE|BE|pharma|1928|8700|22|2,1|Bimekizumab|ex
Ipsen|IPN.PA|EPA|Paris FR|FR|pharma|1929|5700|10|0,4,2|Peptide Bio|ex
Jiangsu Hengrui|600276.SS|SSE|Lianyungang CN|CN|pharma|1970|28000|30|0,6,1|Innov Pharma|ex
Sun Pharma|SUNPHARMA.NS|NSE|Mumbai IN|IN|pharma|1983|38000|45|9,0,7|Specialty|ex
Dr Reddy's|RDY|NYSE|Hyderabad IN|IN|pharma|1984|24000|12|0,14,3|Generic & Bio|ex
Cipla|CIPLA.NS|NSE|Mumbai IN|IN|pharma|1935|25000|14|10,0,5|Complex Gen|ex
Otsuka|4578.T|TSE|Tokyo JP|JP|pharma|1964|33000|20|14,13,0|Neuropsych|ex
Shionogi|4507.T|TSE|Osaka JP|JP|pharma|1878|5500|8|5,14|Antiviral|ex
WuXi Bio|2269.HK|HKEX|Shanghai CN|CN|cro|2014|12000|14|0|Contract Bio|ex
WuXi AppTec|2359.HK|HKEX|Shanghai CN|CN|cro|2000|42000|20|0|Integrated CRO|ex
Zai Lab|ZLAB|NASDAQ|Shanghai CN|CN|bio|2014|1200|2.5|0,2|CN Licensing|ex
Hutchmed|HCM|NASDAQ|Shanghai CN|CN|bio|2000|5000|2|0|SM Disco CN|ex
Akeso|9926.HK|HKEX|Guangzhou CN|CN|bio|2012|3500|8|0|PD-1/CTLA-4|ex
Shanghai Junshi|1877.HK|HKEX|Shanghai CN|CN|bio|2012|4000|3|0,1|Toripalimab|ex
PharmaEssentia|6446.TW|TWSE|Taipei TW|TW|bio|2003|700|3|8|Besremi|ex
Aslan Pharma|ASLN|NASDAQ|Singapore SG|SG|bio|2010|60|0.2|0,1|IL-13Rα2|ex
Mesoblast|MSB.AX|ASX|Melbourne AU|AU|bio|2004|100|0.4|1,3|Cell Ther|ex
Telix Pharma|TLX.AX|ASX|Melbourne AU|AU|bio|2015|700|3|0|Radioligand|ex
Clinuvel|CUV.AX|ASX|Melbourne AU|AU|bio|1991|150|1.2|4,9|Melanocortin|ex
Evotec|EVT.DE|XETRA|Hamburg DE|DE|bio|1993|5000|2|0,14|iPSC AI DDisco|ex
BioArctic|BIOA.ST|OMX|Stockholm SE|SE|bio|2003|160|3|2|Lecanemab partner|ex
Pharming|PHARM.AS|AMS|Leiden NL|NL|bio|1988|700|1.5|4|C1-INH|ex
Emerald Health|—|Private|Victoria CA|CA|bio|2014|40|0|14|Endocannabinoid|pr
Tempus AI|TEM|NASDAQ|Chicago IL|US|bio|2015|2500|8|0|AI Precision Med|ex
IQVIA|IQV|NYSE|Durham NC|US|cro|1982|86000|45|0|CRO & RWD|ex
ICON|ICLR|NASDAQ|Dublin IE|IE|cro|1990|42000|28|0|Full CRO|ex
Charles River|CRL|NYSE|Wilmington MA|US|cro|1947|20000|12|0|Preclinical|ex
Medpace|MEDP|NASDAQ|Cincinnati OH|US|cro|1992|5500|11|0|Full CRO|ex
Catalent|CTLT|NYSE|Somerset NJ|US|cdmo|2007|18000|7|0|Drug Delivery|ex
Lonza|LONN.SW|SIX|Basel CH|CH|cdmo|1897|18000|42|0|Bio Mfg|ex
Eurofins|ERF.PA|EPA|Luxembourg LU|LU|cro|1987|62000|10|0|Lab Services|ex
Bausch Health|BHC|NYSE|Laval CA|CA|pharma|1960|21000|3|7,9,11|Specialty|ex
Aurinia|AUPH|NASDAQ|Victoria CA|CA|bio|1993|400|1.5|13,1|Voclosporin|ex
Boehringer Ingelheim|—|Private|Ingelheim DE|DE|pharma|1885|53000|0|10,0,6,1|Bispec & SM|pr
Sumitomo Pharma|4506.T|TSE|Osaka JP|JP|pharma|2005|8000|4|14,0,4|iPSC Regen|ex
Simcere|2096.HK|HKEX|Nanjing CN|CN|pharma|1995|8000|2|0,14|Innov & Gen|ex
Luye Pharma|2186.HK|HKEX|Yantai CN|CN|pharma|2002|6000|1|14,0|Microsphere|ex
Sihuan Pharma|460.HK|HKEX|Beijing CN|CN|pharma|2001|4000|1|14,3|CNS Spec|ex
Ascletis|1672.HK|HKEX|Hangzhou CN|CN|bio|2013|500|0.3|15|Antiviral|ex
Alligator Bio|ATORX.ST|OMX|Lund SE|SE|bio|2001|40|0.08|0|Bispec IO|ex
Oncopeptides|ONCO.ST|OMX|Stockholm SE|SE|bio|2000|200|0.3|8|PDC|ex
Aroa Biosurgery|ARX.NZ|NZX|Auckland NZ|NZ|bio|2008|200|0.4|0|ECM|ex
Profound Med|PRN.TO|TSX|Mississauga CA|CA|med|2008|150|0.4|0|MR-HIFU|ex
Imugene|IMU.AX|ASX|Sydney AU|AU|bio|2013|60|0.2|0|Oncolytic CF33|ex
Opthea|OPT.AX|ASX|Melbourne AU|AU|bio|2006|60|0.3|7|VEGF-C/D|ex
Memorial Sloan Kettering|—|NP|New York NY|US|acad|1884|22000|0|0|Cancer Center|ts
MD Anderson|—|NP|Houston TX|US|acad|1941|24000|0|0|Cancer Center|ts
Dana-Farber|—|NP|Boston MA|US|acad|1947|6000|0|0|Cancer Center|ts
Mayo Clinic|—|NP|Rochester MN|US|acad|1889|76000|0|0,2,3|Medical Center|ts
NCI|—|Gov|Bethesda MD|US|gov|1937|7000|0|0|Nat Cancer Inst|ts
NIAID|—|Gov|Bethesda MD|US|gov|1948|3500|0|5,1|Nat Inst Allergy|ts
Gustave Roussy|—|NP|Villejuif FR|FR|acad|1926|3500|0|0|EU Cancer Ctr|ts
Charite Berlin|—|NP|Berlin DE|DE|acad|1710|18000|0|2,0,3|Univ Hospital|ts
ECOG-ACRIN|—|NP|Philadelphia PA|US|acad|1955|0|0|0|Coop Group|ts
SWOG|—|NP|San Antonio TX|US|acad|1956|0|0|0|Coop Group|ts
Children's Oncology Grp|—|NP|Monrovia CA|US|acad|2000|0|0|0|Coop Group|ts
Samsung Medical Ctr|—|NP|Seoul KR|KR|acad|1994|10000|0|0|Academic Hosp|ts
Natl Cancer Ctr Japan|—|Gov|Tokyo JP|JP|acad|1962|2500|0|0|Natl Cancer|ts
CAMS|—|Gov|Beijing CN|CN|acad|1956|12000|0|0,1|Natl Academy|ts
Seoul Natl Univ Hosp|—|NP|Seoul KR|KR|acad|1978|8000|0|0,2|Academic Hosp|ts
Peking Univ Cancer Hosp|—|NP|Beijing CN|CN|acad|1976|3000|0|0|Cancer Center|ts
EORTC|—|NP|Brussels BE|BE|acad|1962|0|0|0|Coop Group|ts
Fred Hutch Cancer Ctr|—|NP|Seattle WA|US|acad|1975|3500|0|0|Cancer Center|ts
MSKCC Breast Svc|—|NP|New York NY|US|acad|1884|0|0|0|Service Line|ts
Johns Hopkins|—|NP|Baltimore MD|US|acad|1889|50000|0|0,2|AMC|ts
Mass General Brigham|—|NP|Boston MA|US|acad|1811|82000|0|0,2,3|AMC|ts
UCLA Health|—|NP|Los Angeles CA|US|acad|1955|36000|0|0,2|AMC|ts
Stanford Medicine|—|NP|Stanford CA|US|acad|1959|12000|0|0,2|AMC|ts
Duke Cancer Institute|—|NP|Durham NC|US|acad|1972|4000|0|0|Cancer Center|ts
UCSF|—|NP|San Francisco CA|US|acad|1864|25000|0|0,2|AMC|ts
NCI Canada|—|NP|Kingston CA|CA|acad|1960|0|0|0|Coop Group|ts
GIMEMA|—|NP|Rome IT|IT|acad|1982|0|0|8|Hem Coop|ts
HOVON|—|NP|Rotterdam NL|NL|acad|1985|0|0|8|Hem Coop|ts
Seagen (Pfizer)|—|Acq|Bothell WA|US|bio|1998|3200|0|0|ADC Platform|aq
Karuna (BMS)|—|Acq|Boston MA|US|bio|2009|800|0|14|Muscarinic|aq
Cerevel (AbbVie)|—|Acq|Cambridge MA|US|bio|2018|400|0|14|Neuroscience|aq
Mirati (BMS)|—|Acq|San Diego CA|US|bio|2012|800|0|0|KRAS Inh|aq
ImmunoGen (AbbVie)|—|Acq|Waltham MA|US|bio|1981|600|0|0|Mirvetuximab ADC|aq
Chinook (Novartis)|—|Acq|Seattle WA|US|bio|2019|200|0|13|IgAN Compl|aq
Carmot (Roche)|—|Acq|Berkeley CA|US|bio|2014|60|0|6|GLP-1/GIP/GCG|aq
Prometheus (Merck)|—|Acq|San Diego CA|US|bio|2016|250|0|1,11|TL1A|aq
Horizon (Amgen)|—|Acq|Dublin IE|IE|bio|2005|4200|0|4,1|Tepezza|aq
Forma (Novo)|—|Acq|Watertown MA|US|bio|2007|200|0|8|SCD HbF|aq
Ablynx (Sanofi)|—|Acq|Ghent BE|BE|bio|2001|400|0|4,8|Nanobody|aq
MorphoSys (Novartis)|—|Acq|Munich DE|DE|bio|1992|600|0|0,8|Ylanthia|aq
PPD (Thermo)|—|Acq|Wilmington NC|US|cro|1985|30000|0|0|Full CRO|aq
Syneos (Elliott)|—|Acq|Morrisville NC|US|cro|2017|29000|0|0|CRO+Comm|aq
Covance (LabCorp)|—|Acq|Princeton NJ|US|cro|1968|8000|0|0|Lab & CRO|aq
Insilico Medicine|—|Private|Hong Kong CN|CN|bio|2014|350|0|0|Pharma.AI|pr
Isomorphic Labs|—|Private|London UK|GB|bio|2021|100|0|0|AlphaFold|pr
XtalPi|—|Private|Shenzhen CN|CN|bio|2015|700|0|0|AI+Quantum|pr
Boundless Bio|—|Private|San Diego CA|US|bio|2018|60|0|0|ecDNA|pr
Scorpion|—|Private|Boston MA|US|bio|2020|120|0|0|Precision Onc|pr
Tessera Ther|—|Private|Cambridge MA|US|bio|2018|100|0|16|Gene Writing|pr
Aera Ther|—|Private|Cambridge MA|US|bio|2022|40|0|16|Eng Delivery|pr
Tome Bio|—|Private|Watertown MA|US|bio|2021|50|0|16|PGI|pr
Ring Ther|—|Private|Cambridge MA|US|bio|2017|80|0|16|Anellovirus|pr
EQRx|—|Private|Cambridge MA|US|bio|2019|150|0|0,1|Value Pricing|pr
Quotient Ther|—|Private|Cambridge MA|US|bio|2022|30|0|16|SC Genomics|pr
Vesalius Ther|—|Private|Cambridge MA|US|bio|2021|25|0|2|Somatic Mosaic|pr
GenEdit|—|Private|S San Francisco CA|US|bio|2015|30|0|16|NP Gene Del|pr
Affinia Ther|—|Private|Waltham MA|US|bio|2019|50|0|4,2|Synth AAV|pr
Asklepios Bio|—|Private|RTP NC|US|bio|2001|200|0|16|Pro10 AAV|pr
OncXerna|—|Private|Waltham MA|US|bio|2018|30|0|0|TME Dx|pr
ArriVent BioPharma|AVBP|NASDAQ|New Haven CT|US|bio|2019|80|1.2|0|China-US Bridge|ex
Cargo Therapeutics|CRGX|NASDAQ|S San Francisco CA|US|bio|2021|100|0.8|0,8|Auto CAR-T|ex
Vigil Neuro|VIGL|NASDAQ|Watertown MA|US|bio|2020|40|0.15|2|TREM2|ex
Tenaya|TNYA|NASDAQ|S San Francisco CA|US|bio|2016|120|0.3|3|Cardiac Gene|ex
Metagenomi|MGX|NASDAQ|Emeryville CA|US|bio|2018|160|0.5|16|Metagen Edit|ex
Cullinan Onc|CGEM|NASDAQ|Cambridge MA|US|bio|2016|60|0.6|0|Multi IO|ex
Erasca|ERAS|NASDAQ|San Diego CA|US|bio|2018|130|0.7|0|RAS/MAPK|ex
Nuvation Bio|NUVB|NYSE|New York NY|US|bio|2020|70|0.4|0|DDR Targeted|ex
Prelude|PRTX|NASDAQ|Wilmington DE|US|bio|2016|80|0.3|0|CDK9 Epigen|ex
Zentalis|ZNTL|NASDAQ|San Diego CA|US|bio|2014|120|0.5|0|WEE1 CC|ex
Elevation Onc|ELEV|NASDAQ|New York NY|US|bio|2019|30|0.1|0|Cl18.2|ex
Alector|ALEC|NASDAQ|S San Francisco CA|US|bio|2013|250|0.5|2|Immuno-neuro|ex
AC Immune|ACIU|NASDAQ|Lausanne CH|CH|bio|2003|150|0.3|2|Anti-Tau/Ab|ex
Anavex|AVXL|NASDAQ|New York NY|US|bio|2007|30|0.4|2|Sigma-1|ex
CervoMed|CRVO|NASDAQ|Bothell WA|US|bio|2019|40|0.3|2|p38a Neuro|ex
Compass Ther|CMPX|NASDAQ|Cambridge MA|US|bio|2014|80|0.4|0|Multispec Ab|ex
Agenus|AGEN|NASDAQ|Lexington MA|US|bio|1994|500|0.15|0|IO Ab & Adj|ex
Sutro Bio|STRO|NASDAQ|S San Francisco CA|US|bio|2003|250|0.4|0|Cell-free ADC|ex
Adagene|ADAG|NASDAQ|Suzhou CN|CN|bio|2012|350|0.2|0|SAFEbody|ex
Cellectis|CLLS|NASDAQ|Paris FR|FR|bio|1999|300|0.3|0|TALEN CAR-T|ex
Precision Bio|DTIL|NASDAQ|Durham NC|US|bio|2006|180|0.12|0,16|ARCUS Edit|ex
Century|IPSC|NASDAQ|Philadelphia PA|US|bio|2018|160|0.25|0|iPSC Allo|ex
Lyell Immuno|LYEL|NASDAQ|S San Francisco CA|US|bio|2018|400|0.8|0|T-cell Reprog|ex
Selecta Bio|SELB|NASDAQ|Watertown MA|US|bio|2007|80|0.15|4|ImmTOR|ex
Abeona|ABEO|NASDAQ|New York NY|US|bio|2014|120|0.15|4|AAV Nonviral|ex
Larimar|LRMR|NASDAQ|Bala Cynwyd PA|US|bio|2005|50|0.3|4|FA CTI-1601|ex
Applied Ther|APLT|NASDAQ|New York NY|US|bio|2016|70|0.3|4,6|Aldose Red|ex
Replimune|REPL|NASDAQ|Woburn MA|US|bio|2015|250|1.2|0|Oncolytic|ex
Gritstone|GRTS|NASDAQ|Emeryville CA|US|bio|2015|160|0.1|0,5|Neoantigen|ex
Inovio|INO|NASDAQ|Plymouth Meeting PA|US|bio|1983|300|0.3|0,5|DNA Med|ex
Emergent Bio|EBS|NYSE|Gaithersburg MD|US|bio|1998|2300|0.5|5|Biodefense|ex
Fractyl|GUTS|NASDAQ|Lexington MA|US|bio|2010|100|1.5|6|Revita DMR|ex
Aligos|ALGS|NASDAQ|S San Francisco CA|US|bio|2018|120|0.2|15|THR-b CHB|ex
Assembly Bio|ASMB|NASDAQ|San Diego CA|US|bio|2012|70|0.2|15|CPAMs|ex
Enanta|ENTA|NASDAQ|Watertown MA|US|bio|1995|150|0.3|15|Prot Inh|ex
Cassava Sci|SAVA|NASDAQ|Austin TX|US|bio|1998|30|0.6|2|Simufilam|ex
Parexel|—|Private|Durham NC|US|cro|1982|19000|0|0|Full CRO|pr
Imvax|—|Private|Philadelphia PA|US|bio|2016|30|0|0|Auto Tumor Imm|pr
Flagship Labs|—|Private|Cambridge MA|US|bio|2000|200|0|0|Venture Create|pr
Deerfield Mgmt|—|Private|New York NY|US|bio|2005|100|0|0|Health Invest|pr
Third Rock|—|Private|Boston MA|US|bio|2007|50|0|0|Health VC|pr
ARCH Venture|—|Private|Chicago IL|US|bio|1986|40|0|0|Biotech VC|pr
Atlas Venture|—|Private|Cambridge MA|US|bio|2001|30|0|0|Biotech VC|pr
Omega Therapeutics|OMGA|NASDAQ|Cambridge MA|US|bio|2017|90|0.15|0|Epigenomic|ex
Replicate Bio|—|Private|San Diego CA|US|bio|2021|20|0|0|Synthetic Bio|pr
Maze Ther|—|Private|San Francisco CA|US|bio|2019|50|0|4,2|Rare Lysosomal|pr
Rapport|RAPP|NASDAQ|Cambridge MA|US|bio|2020|80|1.5|2|GABA-A|ex
Metsera|—|Private|New York NY|US|bio|2022|30|0|6|Oral Obesity|pr
Septerna|SEPN|NASDAQ|S San Francisco CA|US|bio|2018|100|1|6,14|GPCR|ex
Upstream Bio|UPB|NASDAQ|Waltham MA|US|bio|2020|50|0.8|10,1|TSLP mAb|ex
Spyre Ther|SYRE|NASDAQ|Waltham MA|US|bio|2023|50|1.2|1,11|IL-13 Ab GI|ex
MBX Bio|MBX|NASDAQ|Carmel IN|US|bio|2020|30|0.6|12,4|GLP-1R Rare|ex
Aldeyra Ther|ALDX|NASDAQ|Lexington MA|US|bio|2004|80|0.3|7|RASP Inh|ex
Aerovate Ther|—|Acq|Cambridge MA|US|bio|2019|30|0|18|Imatinib inh PAH|aq
Kartos Ther|—|Private|Redwood City CA|US|bio|2018|40|0|8|Myelofibrosis|pr
Flare Ther|—|Private|Cambridge MA|US|bio|2020|45|0|4,2|Gene Reg|pr
Gyre Ther|—|Private|Waltham MA|US|bio|2022|15|0|16|Epigenome Edit|pr
PharmaCielo|PCLO.V|TSXV|Rionegro CO|CO|bio|2014|100|0.02|0|Cannabis|ex
Abivax|ABVX.PA|EPA|Paris FR|FR|bio|2013|100|0.5|1,11|ABX464 S1P|ex
Morphic Ther (Lilly)|—|Acq|Waltham MA|US|bio|2015|120|0|11,1|Integrin|aq
Gossamer Bio|GOSS|NASDAQ|San Diego CA|US|bio|2015|100|0.15|18,1|Seralutinib|ex
Corbus Pharma|CRBP|NASDAQ|Norwood MA|US|bio|2014|20|0.2|0|Nectin-4 ADC|ex
Keros Ther|KROS|NASDAQ|Lexington MA|US|bio|2017|100|1.5|8,3|TGF-β trap|ex
Nurix Ther|NRIX|NASDAQ|San Francisco CA|US|bio|2009|200|0.6|0,1|E3 Lig Degrader|ex
Inhibrx (Sanofi)|—|Acq|La Jolla CA|US|bio|2010|150|0|0,4|BiTE INBRX-101|aq
Adicet (Regeneron)|—|Acq|Redwood City CA|US|bio|2014|100|0|0|γδ T Cell|aq
Unicycive Therapeutics|UNCY|NASDAQ|Los Angeles CA|US|bio|2016|15|0.02|13|Nephrology SM|ex
Athira Pharma|ATHA|NASDAQ|Bothell WA|US|bio|2011|80|0.08|2|HGF/MET Neuro|ex
Candel Therapeutics|CADL|NASDAQ|Needham MA|US|bio|2017|50|0.06|0|Oncolytic Immuno|ex
ProQR Therapeutics|PRQR|NASDAQ|Leiden NL|NL|bio|2012|100|0.15|7|RNA Editing Ophth|ex
Nkarta|NKTX|NASDAQ|S San Francisco CA|US|bio|2015|150|0.3|0|NK CAR|ex
RAPT Therapeutics|RAPT|NASDAQ|S San Francisco CA|US|bio|2015|70|0.15|0,9|CCR4 IO|ex
TransCode Therapeutics|RNAZ|NASDAQ|Boston MA|US|bio|2016|15|0.01|0|RNA Nano Onc|ex
ProKidney|PROK|NASDAQ|Winston-Salem NC|US|bio|2022|40|0.1|13|Cell Ther CKD|ex
Forma Therapeutics|—|Acq|Watertown MA|US|bio|2007|200|0|8|SCD HbF|aq
Compass Pathways|CMPS|NASDAQ|London UK|GB|bio|2016|60|0.5|14|Psilocybin MDD|ex
Atossa Therapeutics|ATOS|NASDAQ|Seattle WA|US|bio|2009|15|0.08|0|Endoxifen BC|ex
Vera Therapeutics|VERA|NASDAQ|S San Francisco CA|US|bio|2014|80|2|13|Anti-APRIL IgAN|ex
Processa Pharma|PCSA|NASDAQ|Hanover MD|US|bio|2015|8|0.01|0|Next-PharmaKin|ex
Kala Pharma|KALA|NASDAQ|Waltham MA|US|bio|2009|120|0.04|7|AMPPLIFY Ophth|ex
ACLARION|ACON|NASDAQ|Broomfield CO|US|bio|2015|20|0.01|21|Nociscan AI|ex
Nuo Therapeutics|NURO|OTC|Reston VA|US|bio|2000|10|0.005|9|Wound CurraProx|ex
Correvio (Advanz)|—|Acq|Vancouver CA|CA|bio|2013|100|0|3|Brinavess|aq
Soligenix|SNGX|NASDAQ|Princeton NJ|US|bio|2005|10|0.01|4,9|Rare Derm|ex
CN Bio Innovations|—|Private|Oxford UK|GB|bio|2009|80|0|0|Organ-on-Chip|pr
Gelesis|GLS|NYSE|Boston MA|US|bio|2006|100|0.02|6|Hydrogel Obesity|ex
Palatin Technologies|PTN|NYSE|Cranbury NJ|US|bio|1986|15|0.02|20|MC4R Agonist|ex
Zevra Therapeutics|ZVRA|NASDAQ|Celebration FL|US|bio|2006|50|0.3|4,2|Rare Neuro|ex
Calithera Bio|CALA|NASDAQ|S San Francisco CA|US|bio|2010|60|0.03|0|CB-708 Immuno|ex
Onconova|ONTX|NASDAQ|Newtown PA|US|bio|1998|20|0.02|8|MDS Rigosertib|ex
Diffusion Pharma|DFFN|NASDAQ|Charlottesville VA|US|bio|2001|10|0.01|0|TSC O2 Carrier|ex
Lucid Diagnostics|LUCD|NASDAQ|New York NY|US|bio|2018|80|0.15|11|EsoGuard Barrett|ex
Tonix Pharma|TNXP|NASDAQ|New York NY|US|bio|2007|80|0.06|14,5|TNX Psych|ex
Neumedicines|—|Private|Pasadena CA|US|bio|2003|10|0|8|HemaMax Rad|pr
ContraFect (Phibro)|—|Acq|Yonkers NY|US|bio|2008|30|0|5|Exebacase Phage|aq
NexImmune|NEXI|NASDAQ|Gaithersburg MD|US|bio|2011|20|0.01|0|AIM nanopart|ex
Lantern Pharma|LTRN|NASDAQ|Dallas TX|US|bio|2018|20|0.04|0|RADR AI Onc|ex
Kinnate Bio|KNTE|NASDAQ|San Diego CA|US|bio|2017|40|0.05|0|RAF/MEK Onc|ex
Imago BioSciences|—|Acq|San Francisco CA|US|bio|2015|70|0|8|LSD1 MF|aq
ENDRA Life Sciences|NDRA|NASDAQ|Ann Arbor MI|US|bio|2013|20|0.01|17|TAEUS Liver|ex
Aptinyx|APTX|NASDAQ|Evanston IL|US|bio|2015|40|0.03|14|NMDA Pain|ex
CytomX Therapeutics|CTMX|NASDAQ|S San Francisco CA|US|bio|2008|180|0.2|0|Probody ADC|ex
Cellectar Bio|CLRB|NASDAQ|Madison WI|US|bio|2002|40|0.03|0,8|CLR PDC|ex
Windtree Therapeutics|WINT|NASDAQ|Warrington PA|US|bio|2016|15|0.01|10|KL4 Lung|ex
Eledon Pharma|ELDN|NASDAQ|Irvine CA|US|bio|2015|20|0.05|1|CD40L Trans|ex
Bellerophon|BLPH|NASDAQ|Warren NJ|US|bio|2014|25|0.02|18|INOpulse PAH|ex
ProMIS Neurosciences|PMN|NASDAQ|Toronto CA|CA|bio|2004|10|0.1|2|PMN310 AD|ex
GlycoMimetics|GLYC|NASDAQ|Rockville MD|US|bio|2003|40|0.02|8|Uproleselan AML|ex
Molecular Templates|MTEM|NASDAQ|Austin TX|US|bio|2001|80|0.03|0|ETB ADC|ex
NovaBay Pharma|NBY|NYSE|Emeryville CA|US|bio|2000|20|0.005|7,5|Avenova|ex
MEI Pharma|MEIP|NASDAQ|San Diego CA|US|bio|2001|30|0.02|0|Voruciclib CDK|ex
Vaxxinity|VAXX|NASDAQ|Dallas TX|US|bio|2014|60|0.1|5,2|Synth Peptide Vax|ex
Athenex|—|Acq|Buffalo NY|US|bio|2002|500|0|0|Src Kinase|aq
BioSig Technologies|BSGM|NASDAQ|Westport CT|US|bio|2009|30|0.01|3|PURE EP Signal|ex
Eyenovia|EYEN|NASDAQ|New York NY|US|bio|2014|25|0.02|7|Optejet Micro|ex
XBiotech|XBIT|NASDAQ|Austin TX|US|bio|2005|60|0.3|1,0|Anti-IL-1a|ex
Chimerix|CMRX|NASDAQ|Durham NC|US|bio|2000|40|0.1|0,15|ONC201 Glioma|ex
MiNT Therapeutics|—|Private|Stockholm SE|SE|bio|2019|15|0|8|Gene Reg Hem|pr
Cirius Therapeutics|—|Acq|Kalamazoo MI|US|bio|2016|30|0|17|FXR NASH|aq
Crinetics Pharma|CRNX|NASDAQ|San Diego CA|US|bio|2008|250|3|12,4|Acromegaly SST|ex
Spire Biotech|—|Private|Frisco TX|US|bio|2020|10|0|0|Neuro Devices|pr
Turning Point (BMS)|—|Acq|San Diego CA|US|bio|2013|300|0|0|Next-gen ALK|aq
Imago (Merck)|—|Acq|San Francisco CA|US|bio|2015|70|0|8|LSD1 MF|aq
Aadi Biosciences|—|Acq|Pacific Palisades CA|US|bio|2011|40|0|0|mTOR TSC|aq
SpringWorks|SWTX|NASDAQ|Stamford CT|US|bio|2017|300|3|0,4|Nirogacestat|ex
Rigel Pharma|RIGL|NASDAQ|S San Francisco CA|US|bio|1996|200|0.3|8|Fostamatinib|ex
CytoDyn|CYDY|OTC|Vancouver WA|US|bio|2003|20|0.08|5,0|Leronlimab CCR5|ex
Clovis Oncology|—|Acq|Boulder CO|US|bio|2009|200|0|0|Rubraca PARP|aq
Puma Biotech|PBYI|NASDAQ|Los Angeles CA|US|bio|2010|50|0.1|0|Neratinib HER2|ex
Enochian Bio|ENOB|NASDAQ|Los Angeles CA|US|bio|2017|20|0.01|5,0|HIV/HBV Gene|ex
HTG Molecular|HTGM|NASDAQ|Tucson AZ|US|bio|2003|60|0.03|0|RNA Profiling|ex
Trevena|TRVN|NASDAQ|King of Prussia PA|US|bio|2007|30|0.01|14|Oliceridine MOR|ex
Achilles Therapeutics|—|Acq|London UK|GB|bio|2016|100|0|0|Clonal Neo-Ag|aq
OncoBiologics|ONS|NASDAQ|Hackensack NJ|US|bio|2013|40|0.01|0|Biosimilar Onc|ex
Aerpio Pharmaceutics|—|Acq|Blue Ash OH|US|bio|2011|30|0|7|Tie2 DME|aq
Zynerba Pharma|ZYNE|NASDAQ|Devon PA|US|bio|2007|20|0.03|2,4|CBD Fragile X|ex
Eloxx Pharma|—|Acq|Waltham MA|US|bio|2013|40|0|4|Readthrough CF|aq
Ampio Pharma|AMPE|NYSE|Englewood CO|US|bio|2010|10|0.005|21|Ampion OA|ex
Marker Therapeutics|MRKR|NASDAQ|Houston TX|US|bio|2018|20|0.02|0|MultiTAA T|ex
Reata Pharma (Biogen)|—|Acq|Plano TX|US|bio|2002|200|0|2,13|Nrf2 FA|aq
Immunomedics (Gilead)|—|Acq|Morris Plains NJ|US|bio|1983|1200|0|0|Trodelvy ADC|aq
Theratechnologies|TH|NASDAQ|Montreal CA|CA|bio|1993|150|0.06|5|HIV Tesamorelin|ex
DiaMedica Therapeutics|DMAC|NASDAQ|Minneapolis MN|US|bio|2000|15|0.06|2,13|DM199 KLK1|ex
PharmaCyte Biotech|PMCB|OTC|Reno NV|US|bio|2013|5|0.005|0|Cell-in-a-Box|ex
Aravive|ARAV|NASDAQ|Houston TX|US|bio|2008|15|0.05|0,13|AXL Inh Onc|ex
Imunon|IMNN|NASDAQ|Lawrenceville NJ|US|bio|2000|20|0.02|0|IMNN-001 Ovarian|ex
Second Sight|—|Acq|Sylmar CA|US|bio|2003|50|0|7|Argus Retinal|aq
Corvus Pharma|—|Acq|Burlingame CA|US|bio|2014|30|0|0|A2aR Adenosine|aq
NeuBase Therapeutics|NBSE|NASDAQ|Pittsburgh PA|US|bio|2018|20|0.01|16,2|PATrOL ASO|ex
Galena Biopharma|—|Acq|Portland OR|US|bio|2006|20|0|0|NeuVax BC|aq
Marinus Pharma|MRNS|NASDAQ|Radnor PA|US|bio|2003|100|0.3|2|Ganaxolone Epilepsy|ex
Caris Life Sciences|—|Private|Irving TX|US|bio|2008|2000|0|0|Molecular Profile|pr
BioAtla|BCAB|NASDAQ|San Diego CA|US|bio|2007|80|0.1|0|CAB ADC|ex
Sutro|STRO|NASDAQ|S San Francisco CA|US|bio|2003|250|0.4|0|Cell-free ADC|ex
Aclaris Therapeutics|ACRS|NASDAQ|Wayne PA|US|bio|2012|60|0.15|9,1|JAK/MK2|ex
Inhibrx Biosciences|INBX|NASDAQ|La Jolla CA|US|bio|2016|100|1|4,0|Multi-spec Ab|ex
Cartesian Therapeutics|RNAC|NASDAQ|Gaithersburg MD|US|bio|2014|80|0.2|1|mRNA Cell|ex
Heron Therapeutics|HRTX|NASDAQ|San Diego CA|US|bio|1983|200|0.3|14|CINVANTI Pain|ex
Aveo Pharma (LG Chem)|—|Acq|Boston MA|US|bio|2002|100|0|0|Fotivda RCC|aq
AN2 Therapeutics|ANTX|NASDAQ|Menlo Park CA|US|bio|2018|20|0.05|5|NTM Epetraborole|ex
Caladrius Bio|CLBS|NASDAQ|Saddle River NJ|US|bio|2003|15|0.01|3|CLBS16 CAD|ex
NGM Biopharm|NGM|NASDAQ|S San Francisco CA|US|bio|2008|200|0.5|6,17|Aldo/FGF19|ex
Verona Pharma|VRNA|NASDAQ|London UK|GB|bio|2005|200|3|10|Ensifentrine COPD|ex
ARS Pharma|SPRY|NASDAQ|San Diego CA|US|bio|2016|80|1|1|Neffy Epi Auto|ex
Rallybio|RLYB|NASDAQ|New Haven CT|US|bio|2018|60|0.1|8,4|Anti-HPA FNAIT|ex
G1 Therapeutics (Licella)|—|Acq|RTP NC|US|bio|2008|100|0|0|Trilaciclib CDK|aq
Bicycle Therapeutics|BCYC|NASDAQ|Cambridge UK|GB|bio|2009|300|1.5|0|Bicycle Toxin|ex
Alto Neuroscience|ANRO|NYSE|Los Altos CA|US|bio|2019|50|0.6|14|ALTO-100 MDD|ex
Kiniksa Pharma|KNSA|NASDAQ|Hamilton BM|BM|bio|2015|150|2|1,4,3|IL-1 Riley-Day|ex
Vanda Pharma|VNDA|NASDAQ|Washington DC|US|bio|2002|250|0.4|14|Tradipitant GI|ex
Panbela Therapeutics|PBLAW|NASDAQ|Minneapolis MN|US|bio|2011|5|0.005|0|SBP-101 Panc|ex
Durect (Innocoll)|DRRX|NASDAQ|Cupertino CA|US|bio|1998|40|0.05|17|DUR-928 MASH|ex
Eliem Therapeutics|—|Acq|Redmond WA|US|bio|2019|30|0|14|Pain Channel|aq
Iridex|IRIX|NASDAQ|Mountain View CA|US|bio|1989|100|0.02|7|Glaucoma Laser|ex
Volato Group|—|Private|Houston TX|US|bio|2021|200|0|0|Aviation n/a|pr
ObsEva (XOMA)|—|Acq|Geneva CH|CH|bio|2012|30|0|20|Linzagolix Gyn|aq
Compass Inc|—|Private|New York NY|US|bio|2012|3000|0|0|RE Tech n/a|pr
Agora Inc|—|Private|Shanghai CN|CN|bio|2014|500|0|0|Social n/a|pr
IMV (renamed Immunovaccine)|IMV|NASDAQ|Dartmouth CA|CA|bio|2000|30|0.03|0,5|DPX Immuno|ex
Kiora Pharma|KPRX|NASDAQ|Salt Lake City UT|US|bio|2014|5|0.005|7|KIO-301 RP|ex
PharmaCyte|PMCB|OTC|Reno NV|US|bio|2013|5|0.005|0|Live Cell Encap|ex
Aileron Therapeutics|ALRN|NASDAQ|Cambridge MA|US|bio|2005|15|0.01|0|Stapled Peptide|ex
Taro Pharma|TARO|NYSE|Haifa IL|IL|pharma|1959|3000|3|9|Generic Derm|ex
Kamada|KMDA|NASDAQ|Rehovot IL|IL|bio|1990|500|0.4|10,4|AAT Plasma|ex
Kitov Pharma|KTOV|NASDAQ|Tel Aviv IL|IL|bio|2010|10|0.01|0,14|NT219 Onc|ex
Can-Fite BioPharma|CANF|NASDAQ|Petah Tikva IL|IL|bio|1994|20|0.02|0,17|A3AR Agonist|ex
Compugen|CGEN|NASDAQ|Holon IL|IL|bio|2000|100|0.15|0|Computational IO|ex
Bioventus|BVS|NYSE|Durham NC|US|bio|2012|800|0.3|21|OA Biologics|ex
Inhibrx|INBX|NASDAQ|La Jolla CA|US|bio|2016|100|1|4|Multi-spec|ex
Atea Pharma|AVIR|NASDAQ|Boston MA|US|bio|2012|50|0.3|15|Bemnifosbuvir HCV|ex
Aldeyra|ALDX|NASDAQ|Lexington MA|US|bio|2004|80|0.3|7|RASP Reproxalap|ex
Aptorum Group|APM|NASDAQ|Hong Kong CN|CN|bio|2017|30|0.02|5|ALS-4 GI|ex
Bioxcel Therapeutics|BTAI|NASDAQ|New Haven CT|US|bio|2017|150|0.1|14|IGALMI Agitation|ex
BioVie|BIVI|NASDAQ|Carson City NV|US|bio|2016|10|0.05|2,17|NE3107 AD/NASH|ex
Evofem Bio|EVFM|OTC|San Diego CA|US|bio|2014|80|0.01|20|Phexxi Contra|ex
Nuvation|NUVB|NYSE|New York NY|US|bio|2020|70|0.4|0|DDR|ex
Nuwellis (fka CHF Sol)|NUWE|NASDAQ|Eden Prairie MN|US|bio|2002|40|0.01|3|Aquadex UF|ex
BioLineRx|BLRX|NASDAQ|Modi'in IL|IL|bio|2003|60|0.08|8|Motixafortide SCD|ex
Galecto|GLTO|NASDAQ|Copenhagen DK|DK|bio|2011|40|0.06|18,17|Galectin-3 IPF|ex
NorthStar Medical|—|Private|Beloit WI|US|bio|2009|200|0|0|RadioIsotope|pr
Genprobe (Hologic)|—|Acq|San Diego CA|US|bio|1987|800|0|5|Molecular Dx|aq
Savara|SVRA|NASDAQ|Austin TX|US|bio|2008|25|0.2|10,4|Molgramostim PAP|ex
Cidara Therapeutics|CDTX|NASDAQ|San Diego CA|US|bio|2014|40|0.04|5|Rezafungin Anti|ex
MediciNova|MNOV|NASDAQ|San Diego CA|US|bio|2000|15|0.06|2,10|MN-166 ALS|ex
Paratek Pharma|PRTK|NASDAQ|Boston MA|US|bio|2006|100|0.05|5|Nuzyra Antibio|ex
Acer Therapeutics|ACER|NASDAQ|Newton MA|US|bio|2013|15|0.02|4,6|ACER-001 UCD|ex
HUTCHMED|HCM|NASDAQ|Shanghai CN|CN|bio|2000|5000|2|0|Surufatinib|ex
Shanghai Pharma|601607.SS|SSE|Shanghai CN|CN|pharma|1994|55000|10|0,3|Integrated|ex
China Biologic|—|Acq|Beijing CN|CN|bio|2002|4000|0|8|Plasma-derived|aq
I-Mab|IMAB|NASDAQ|Shanghai CN|CN|bio|2016|300|0.15|0,1|Lemzoparlimab|ex
Everest Medicines|1952.HK|HKEX|Shanghai CN|CN|bio|2017|500|0.8|0,13|CN In-license|ex
Kintor Pharma|9939.HK|HKEX|Suzhou CN|CN|bio|2009|200|0.2|9,0|AR/Hed Derm|ex
Genor BioPharma|6998.HK|HKEX|Shanghai CN|CN|bio|2017|500|0.5|0,8|GB261 Bispec|ex
CStone Pharma|2616.HK|HKEX|Suzhou CN|CN|bio|2015|400|0.5|0|Sugemalimab IO|ex
Adlai Nortye|—|Private|Hangzhou CN|CN|bio|2016|200|0|0|AN2025 BC|pr
Connect Biopharma|CNTB|NASDAQ|San Diego CA|US|bio|2012|150|0.05|9,1|CBP-201 IL-4Rα|ex
Zenas BioPharma|ZBIO|NASDAQ|Waltham MA|US|bio|2018|100|1.5|1,4|Obexelimab FcRn|ex
Kumquat Bio|—|Private|Cambridge MA|US|bio|2022|15|0|0|T-cell Bio|pr
BioNova Pharma|—|Private|Shanghai CN|CN|bio|2019|40|0|0|BN-101 CNS|pr
Sciwind Bio|—|Private|Shanghai CN|CN|bio|2011|200|0|6|GLP-1 Obesity|pr
Aimmune (Nestle)|—|Acq|Brisbane CA|US|bio|2011|300|0|1|Palforzia Peanut|aq
Acceleron (Merck)|—|Acq|Cambridge MA|US|bio|2003|300|0|8,3|Sotatercept|aq
Alexion (AZN)|—|Acq|Boston MA|US|bio|1992|3500|0|4,8,13|Complement C5|aq
Arena (Pfizer)|—|Acq|San Diego CA|US|bio|1997|300|0|1,11|Etrasimod S1P|aq
Myokardia (BMS)|—|Acq|S San Francisco CA|US|bio|2012|150|0|3|Mavacamten HCM|aq
Prevail (Lilly)|—|Acq|New York NY|US|bio|2017|100|0|2|AAV Neurodegeneration|aq
Sierra Oncology (GSK)|—|Acq|Vancouver CA|CA|bio|2003|100|0|8|Momelotinib MF|aq
Proteus Digital|—|Acq|Redwood City CA|US|bio|2001|300|0|6|Digital Pill|aq
Orchard (Kyowa Kirin)|—|Acq|London UK|GB|bio|2015|200|0|4|HSC Gene Therapy|aq
Rain (Qilu)|—|Acq|Newark CA|US|bio|2017|50|0|0|Milademetan MDM2|aq
GW Pharma (Jazz)|—|Acq|Cambridge UK|GB|bio|1998|900|0|2|Epidiolex CBD|aq
Tesaro (GSK)|—|Acq|Waltham MA|US|bio|2010|500|0|0|Zejula PARP|aq
Loxo (Lilly)|—|Acq|Stamford CT|US|bio|2013|100|0|0|Larotrectinib TRK|aq
Medivation (Pfizer)|—|Acq|San Francisco CA|US|bio|2003|500|0|0|Xtandi AR|aq
Pharmacyclics (AbbVie)|—|Acq|Sunnyvale CA|US|bio|1991|500|0|8|Imbruvica BTK|aq
Celgene (BMS)|—|Acq|Summit NJ|US|bio|1986|8000|0|8,0,1|Revlimid|aq
Allergan (AbbVie)|—|Acq|Dublin IE|IE|pharma|1950|17000|0|7,9|Botox|aq
Shire (Takeda)|—|Acq|Dublin IE|IE|pharma|1986|24000|0|4,8|Rare Disease|aq
MyoKardia (BMS)|—|Acq|S San Francisco CA|US|bio|2012|150|0|3|Camzyos HCM|aq
Flatiron Health (Roche)|—|Acq|New York NY|US|bio|2012|600|0|0|Oncology RWD|aq
Principia (Sanofi)|—|Acq|S San Francisco CA|US|bio|2008|100|0|1|BTK MS|aq
Proteon (Charles River)|—|Acq|Utrecht NL|NL|bio|2009|50|0|0|SPR Biosensors|aq
Clementia (Ipsen)|—|Acq|Montreal CA|CA|bio|2010|50|0|4,21|Palovarotene FOP|aq
Aimmune|—|Acq|Brisbane CA|US|bio|2011|300|0|1|Palforzia|aq
Retrophin (Zevra)|—|Acq|San Diego CA|US|bio|2011|120|0|4|Thiola|aq
Dermira (Lilly)|—|Acq|Menlo Park CA|US|bio|2010|200|0|9|Lebrikizumab AD|aq
Momenta (J&J)|—|Acq|Cambridge MA|US|bio|2001|200|0|1|Biosimilar|aq
Synthorx (Sanofi)|—|Acq|La Jolla CA|US|bio|2014|50|0|0|IL-2 variant|aq
Forty Seven (Gilead)|—|Acq|Menlo Park CA|US|bio|2015|100|0|0,8|CD47 magrolimab|aq
Concert Pharma (Sun)|—|Acq|Lexington MA|US|bio|2006|50|0|9|Deuterated SM|aq
Tonix|TNXP|NASDAQ|New York NY|US|bio|2007|80|0.06|14,5|TNX CNS|ex
Corvus (Angel)|—|Acq|Burlingame CA|US|bio|2014|30|0|0|A2aR Adenosine|aq
Corbus|CRBP|NASDAQ|Norwood MA|US|bio|2014|20|0.2|0|Nectin-4 ADC|ex
Keros|KROS|NASDAQ|Lexington MA|US|bio|2017|100|1.5|8,3|TGF-b Trap|ex
Nurix|NRIX|NASDAQ|San Francisco CA|US|bio|2009|200|0.6|0,1|E3 Ligase Deg|ex
NGM Bio|NGM|NASDAQ|S San Francisco CA|US|bio|2008|200|0.5|6,17|Aldo/FGF19|ex
Verona|VRNA|NASDAQ|London UK|GB|bio|2005|200|3|10|Ensifentrine|ex
Bicycle Ther|BCYC|NASDAQ|Cambridge UK|GB|bio|2009|300|1.5|0|BicycleToxin|ex
Alto Neuro|ANRO|NYSE|Los Altos CA|US|bio|2019|50|0.6|14|ALTO-100|ex
Kiniksa|KNSA|NASDAQ|Hamilton BM|BM|bio|2015|150|2|1,4|Riley-Day|ex
Vanda|VNDA|NASDAQ|Washington DC|US|bio|2002|250|0.4|14|Tradipitant|ex
Durect|DRRX|NASDAQ|Cupertino CA|US|bio|1998|40|0.05|17|DUR-928|ex
Heron Ther|HRTX|NASDAQ|San Diego CA|US|bio|1983|200|0.3|14|CINVANTI|ex
AN2 Ther|ANTX|NASDAQ|Menlo Park CA|US|bio|2018|20|0.05|5|Epetraborole|ex
Caladrius|CLBS|NASDAQ|Saddle River NJ|US|bio|2003|15|0.01|3|CLBS16 CAD|ex
Cidara|CDTX|NASDAQ|San Diego CA|US|bio|2014|40|0.04|5|Rezafungin|ex
Paratek|PRTK|NASDAQ|Boston MA|US|bio|2006|100|0.05|5|Nuzyra|ex
Acer Ther|ACER|NASDAQ|Newton MA|US|bio|2013|15|0.02|4,6|ACER-001|ex
Aptorum|APM|NASDAQ|Hong Kong CN|CN|bio|2017|30|0.02|5|ALS-4|ex
Bioxcel|BTAI|NASDAQ|New Haven CT|US|bio|2017|150|0.1|14|IGALMI|ex
IMV Inc|IMV|NASDAQ|Dartmouth CA|CA|bio|2000|30|0.03|0,5|DPX|ex
Kiora|KPRX|NASDAQ|Salt Lake City UT|US|bio|2014|5|0.005|7|KIO-301|ex
Taro|TARO|NYSE|Haifa IL|IL|pharma|1959|3000|3|9|Generic Derm|ex
Can-Fite|CANF|NASDAQ|Petah Tikva IL|IL|bio|1994|20|0.02|0,17|A3AR|ex
Zenas Bio|ZBIO|NASDAQ|Waltham MA|US|bio|2018|100|1.5|1,4|Obexelimab|ex
Inhibrx Bio|INBX|NASDAQ|La Jolla CA|US|bio|2016|100|1|4,0|Multi-spec|ex
Cartesian|RNAC|NASDAQ|Gaithersburg MD|US|bio|2014|80|0.2|1|mRNA Cell|ex
Aclaris|ACRS|NASDAQ|Wayne PA|US|bio|2012|60|0.15|9,1|JAK/MK2|ex
Marinus|MRNS|NASDAQ|Radnor PA|US|bio|2003|100|0.3|2|Ganaxolone|ex
Athira|ATHA|NASDAQ|Bothell WA|US|bio|2011|80|0.08|2|HGF/MET|ex
Candel Ther|CADL|NASDAQ|Needham MA|US|bio|2017|50|0.06|0|Oncolytic|ex
ProQR|PRQR|NASDAQ|Leiden NL|NL|bio|2012|100|0.15|7|RNA Editing|ex
Compass Path|CMPS|NASDAQ|London UK|GB|bio|2016|60|0.5|14|Psilocybin|ex
Vera Ther|VERA|NASDAQ|S San Francisco CA|US|bio|2014|80|2|13|Anti-APRIL|ex
Zevra|ZVRA|NASDAQ|Celebration FL|US|bio|2006|50|0.3|4,2|Rare Neuro|ex
Lucid Dx|LUCD|NASDAQ|New York NY|US|bio|2018|80|0.15|11|EsoGuard|ex
Lantern|LTRN|NASDAQ|Dallas TX|US|bio|2018|20|0.04|0|RADR AI|ex
Kinnate|KNTE|NASDAQ|San Diego CA|US|bio|2017|40|0.05|0|RAF/MEK|ex
CytomX|CTMX|NASDAQ|S San Francisco CA|US|bio|2008|180|0.2|0|Probody ADC|ex
Cellectar|CLRB|NASDAQ|Madison WI|US|bio|2002|40|0.03|0,8|CLR PDC|ex
Eledon|ELDN|NASDAQ|Irvine CA|US|bio|2015|20|0.05|1|CD40L Trans|ex
ProMIS Neuro|PMN|NASDAQ|Toronto CA|CA|bio|2004|10|0.1|2|PMN310|ex
Puma Bio|PBYI|NASDAQ|Los Angeles CA|US|bio|2010|50|0.1|0|Neratinib|ex
Enochian|ENOB|NASDAQ|Los Angeles CA|US|bio|2017|20|0.01|5,0|HIV Gene|ex
Rigel|RIGL|NASDAQ|S San Francisco CA|US|bio|1996|200|0.3|8|Fostamatinib|ex
Gossamer|GOSS|NASDAQ|San Diego CA|US|bio|2015|100|0.15|18,1|Seralutinib|ex
Omega Ther|OMGA|NASDAQ|Cambridge MA|US|bio|2017|90|0.15|0|Epigenomic|ex
Cargo Ther|CRGX|NASDAQ|S San Francisco CA|US|bio|2021|100|0.8|0,8|Auto CAR-T|ex
ArriVent|AVBP|NASDAQ|New Haven CT|US|bio|2019|80|1.2|0|CN-US Bridge|ex
Connect Bio|CNTB|NASDAQ|San Diego CA|US|bio|2012|150|0.05|9,1|CBP-201|ex
Everest Med|1952.HK|HKEX|Shanghai CN|CN|bio|2017|500|0.8|0,13|CN In-license|ex
Kintor|9939.HK|HKEX|Suzhou CN|CN|bio|2009|200|0.2|9,0|AR/Hed|ex
Genor Bio|6998.HK|HKEX|Shanghai CN|CN|bio|2017|500|0.5|0,8|GB261|ex
CStone|2616.HK|HKEX|Suzhou CN|CN|bio|2015|400|0.5|0|Sugemalimab|ex
Hua Medicine|2552.HK|HKEX|Shanghai CN|CN|bio|2010|200|0.2|6|Dorzagliatin|ex
Abbisko|—|Private|Shanghai CN|CN|bio|2016|100|0|0|ALK/ROS1|pr
Ascentage|6855.HK|HKEX|Suzhou CN|CN|bio|2010|500|0.5|0,8|BCL-2/IAP|ex
Jacobio|1167.HK|HKEX|Beijing CN|CN|bio|2015|300|0.2|0|SHP2/SOS1|ex
Laekna|—|Private|Shanghai CN|CN|bio|2018|50|0|0|PI3K/mTOR|pr
Sirnaomics|2257.HK|HKEX|Guangzhou CN|CN|bio|2007|200|0.1|9,17|RNAi Anti-fibrotic|ex
RemeGen|9995.HK|HKEX|Yantai CN|CN|bio|2008|1500|2|0,1|ADC/Fusion|ex
Gloria Biosciences|—|Private|Suzhou CN|CN|bio|2018|100|0|0|Anti-CD73|pr
Betta Pharma|300558.SZ|SZSE|Hangzhou CN|CN|bio|2003|3000|3|0|EGFR TKI|ex
Livzon Pharma|1513.HK|HKEX|Zhuhai CN|CN|pharma|1985|15000|4|11,0|Diversified|ex
CSPC Pharma|1093.HK|HKEX|Shijiazhuang CN|CN|pharma|1997|20000|8|0,14|Innovative|ex
Sino Biopharma|1177.HK|HKEX|Hong Kong CN|CN|pharma|2000|30000|12|0,8|CT Frontier|ex
Henlius|2696.HK|HKEX|Shanghai CN|CN|bio|2010|3000|2|0,1|Biosimilar|ex
Alphamab|9966.HK|HKEX|Suzhou CN|CN|bio|2015|600|0.5|0|PD-L1/CTLA-4|ex
Kelun-Biotech|6990.HK|HKEX|Chengdu CN|CN|bio|2022|1000|3|0|ADC Platform|ex
Transcenta|6628.HK|HKEX|Suzhou CN|CN|bio|2014|400|0.2|0,1|Bispecific|ex
BioNova|—|Private|Shanghai CN|CN|bio|2019|40|0|14|BN-101 CNS|pr
Yuhan Corp|000100.KS|KRX|Seoul KR|KR|pharma|1926|5000|6|6,0|Obesity/Onc|ex
Celltrion|068270.KS|KRX|Incheon KR|KR|bio|2002|5000|20|1,0|Biosimilar|ex
SK Bioscience|302440.KS|KRX|Seongnam KR|KR|bio|2018|600|2|5|Vaccine|ex
Hugel|145020.KQ|KOSDAQ|Chuncheon KR|KR|bio|2001|400|2|9|Botulinum|ex
Alteogen|196170.KQ|KOSDAQ|Daejeon KR|KR|bio|2008|200|3|0|SC Delivery|ex
ABL Bio|298380.KQ|KOSDAQ|Daejeon KR|KR|bio|2016|300|1|0,2|Bispecific BBB|ex
Medytox|086900.KQ|KOSDAQ|Ochang KR|KR|bio|2000|400|1|9|Botulinum|ex
GC Cell|—|Private|Yongin KR|KR|bio|2017|200|0|0|NK Cell Ther|pr
Eutilex|—|Private|Seoul KR|KR|bio|2010|50|0|0|4-1BB BiTE|pr
OliX Pharma|226950.KQ|KOSDAQ|Suwon KR|KR|bio|2010|100|0.2|9,7|RNAi asym si|ex
Dasan Zhone|—|Private|Suwon KR|KR|bio|2012|80|0|0|Platform n/a|pr
PharmAbcine|208340.KQ|KOSDAQ|Daejeon KR|KR|bio|2006|100|0.15|0|TTAC-0001 VEGF|ex
JW Therapeutics|2126.HK|HKEX|Shanghai CN|CN|bio|2016|300|0.3|0,8|CAR-T CN|ex
MiNT Ther|—|Private|Stockholm SE|SE|bio|2019|15|0|8|Gene Reg|pr
NorthStar Med|—|Private|Beloit WI|US|bio|2009|200|0|0|RadioIsotope|pr
Caris Life Sci|—|Private|Irving TX|US|bio|2008|2000|0|0|Molecular Prof|pr
Vesalius|—|Private|Cambridge MA|US|bio|2021|25|0|2|Somatic Mosaic|pr
Kartos|—|Private|Redwood City CA|US|bio|2018|40|0|8|Myelofibrosis|pr
Affinia|—|Private|Waltham MA|US|bio|2019|50|0|4,2|Synth AAV|pr
Asklepios|—|Private|RTP NC|US|bio|2001|200|0|16|Pro10 AAV|pr
Treeline|—|Private|Boston MA|US|bio|2021|40|0|0|Chromatin|pr
InveniAI|—|Private|Branford CT|US|bio|2013|50|0|0|AI Drug DDisco|pr
BigHat Bio|—|Private|San Mateo CA|US|bio|2019|40|0|0|ML Ab Design|pr
Octant Bio|—|Private|Emeryville CA|US|bio|2018|40|0|14|Multiplex GPCR|pr
Kojin Ther|—|Private|San Diego CA|US|bio|2020|30|0|0|T-cell Enrich|pr
Ajax Ther|—|Private|Boston MA|US|bio|2020|25|0|0|Neoantigen|pr
Interline Ther|—|Private|S San Francisco CA|US|bio|2019|40|0|0|Multispec Ab|pr
Quanta Ther|—|Private|S San Francisco CA|US|bio|2019|30|0|0|Gamma-delta T|pr
Sonnet Bio|—|Private|S San Francisco CA|US|bio|2021|40|0|0|Cytokine Eng|pr
Remix Ther|—|Private|Cambridge MA|US|bio|2021|30|0|16|RNA Editing|pr
Chroma Med|—|Private|Cambridge MA|US|bio|2019|40|0|16|Epigenome Ctrl|pr
Nvelop Ther|—|Private|Cambridge MA|US|bio|2020|30|0|16|LNP Delivery|pr
Orbital Ther|—|Private|Cambridge MA|US|bio|2021|20|0|16|tRNA|pr
Ambys Med|—|Private|S San Francisco CA|US|bio|2018|50|0|17|Liver Regen|pr
Immunai|—|Private|New York NY|US|bio|2018|150|0|0|Immune Map AI|pr
Insitro|—|Private|S San Francisco CA|US|bio|2018|200|0|2,17|ML Drug Disco|pr
Valo Health|—|Private|Boston MA|US|bio|2019|200|0|0|AI Computation|pr
Generate Bio|—|Private|Cambridge MA|US|bio|2018|100|0|0|GenAI Protein|pr
Terray Ther|—|Private|Pasadena CA|US|bio|2021|60|0|0|Nanotechnology|pr
Evommune|—|Private|Burlingame CA|US|bio|2021|15|0|9|EVO101 PNP|pr
Totus Med|—|Private|Cambridge MA|US|bio|2021|30|0|0|TCR-T|pr
Cellarity|—|Private|Cambridge MA|US|bio|2017|100|0|0|Single-cell|pr
Dyno Ther|—|Private|Watertown MA|US|bio|2018|70|0|16|AAV Capsid AI|pr
Panbela|PBLA|NASDAQ|Minneapolis MN|US|bio|2011|5|0.005|0|SBP-101 Panc|ex
NuCana|NCNA|NASDAQ|Edinburgh UK|GB|bio|2009|40|0.03|0|ProTide Onc|ex
MedMira|MIR.V|TSXV|Halifax CA|CA|bio|1993|25|0.01|0|Rapid HIV|ex
Liminal Bio|LMNL|NASDAQ|Laval CA|CA|bio|2002|20|0.03|4|SM Rare Dis|ex
Theratech|TH|NASDAQ|Montreal CA|CA|bio|1993|150|0.06|5|Tesamorelin|ex
DiaMedica|DMAC|NASDAQ|Minneapolis MN|US|bio|2000|15|0.06|2,13|DM199 KLK1|ex
NeuBase|NBSE|NASDAQ|Pittsburgh PA|US|bio|2018|20|0.01|16,2|PATrOL ASO|ex
Palatin|PTN|NYSE|Cranbury NJ|US|bio|1986|15|0.02|20|MC4R Agonist|ex
Diffusion|DFFN|NASDAQ|Charlottesville VA|US|bio|2001|10|0.01|0|TSC O2|ex
Windtree|WINT|NASDAQ|Warrington PA|US|bio|2016|15|0.01|10|KL4 Lung|ex
Aclarion|ACON|NASDAQ|Broomfield CO|US|bio|2015|20|0.01|21|Nociscan AI|ex
BioSig|BSGM|NASDAQ|Westport CT|US|bio|2009|30|0.01|3|PURE EP|ex
Nuwellis|NUWE|NASDAQ|Eden Prairie MN|US|bio|2002|40|0.01|3|Aquadex|ex
Processa|PCSA|NASDAQ|Hanover MD|US|bio|2015|8|0.01|0|PharmaKin|ex
Kala|KALA|NASDAQ|Waltham MA|US|bio|2009|120|0.04|7|AMPPLIFY|ex
TransCode|RNAZ|NASDAQ|Boston MA|US|bio|2016|15|0.01|0|RNA Nano|ex
ENDRA Life|NDRA|NASDAQ|Ann Arbor MI|US|bio|2013|20|0.01|17|TAEUS|ex
HTG Mol|HTGM|NASDAQ|Tucson AZ|US|bio|2003|60|0.03|0|RNA Profiling|ex
Marker|MRKR|NASDAQ|Houston TX|US|bio|2018|20|0.02|0|MultiTAA T|ex
Calithera|CALA|NASDAQ|S San Francisco CA|US|bio|2010|60|0.03|0|CB-708|ex
Mol Templates|MTEM|NASDAQ|Austin TX|US|bio|2001|80|0.03|0|ETB ADC|ex
Zynerba|ZYNE|NASDAQ|Devon PA|US|bio|2007|20|0.03|2,4|CBD FraX|ex
Ampio|AMPE|NYSE|Englewood CO|US|bio|2010|10|0.005|21|Ampion OA|ex
Atossa|ATOS|NASDAQ|Seattle WA|US|bio|2009|15|0.08|0|Endoxifen|ex
NovaBay|NBY|NYSE|Emeryville CA|US|bio|2000|20|0.005|7,5|Avenova|ex
Nuo Ther|NURO|OTC|Reston VA|US|bio|2000|10|0.005|9|CurraProx|ex
Minerva Neuro|NERV|NASDAQ|Waltham MA|US|bio|2007|50|0.15|14|MIN-101 Schiz|ex
Prothena|PRTA|NASDAQ|Dublin IE|IE|bio|2012|400|4|2|Anti-TDP43|ex
Alkermes|ALKS|NASDAQ|Dublin IE|IE|bio|1987|2200|5|14|Lybalvi CNS|ex
BioHaven (Pfizer)|—|Acq|New Haven CT|US|bio|2013|500|0|2,14|Nurtec CGRP|aq
Harmony Bio|—|Private|San Francisco CA|US|bio|2020|30|0|4|Hemophilia Gene|pr
Encoded Ther|—|Private|S San Francisco CA|US|bio|2016|50|0|16|AAV Cis-reg|pr
Capsida Bio|—|Private|Thousand Oaks CA|US|bio|2019|100|0|16|AAV Engineered|pr
4D Molecular|FDMT|NASDAQ|Emeryville CA|US|bio|2013|100|0.3|7,18|AAV Vector|ex
REGENXBIO|RGNX|NASDAQ|Rockville MD|US|bio|2009|300|0.5|7,2|NAV AAV|ex
Iveric (Astellas)|—|Acq|Parsippany NJ|US|bio|2007|200|0|7|Izervay GA|aq
Clearside Bio|CLSD|NASDAQ|Alpharetta GA|US|bio|2011|20|0.05|7|SCS Microinj|ex
Ocuphire|OCUT|NASDAQ|Farmington Hills MI|US|bio|2018|10|0.02|7|Phentolamine|ex
Kodiak Sci|KOD|NASDAQ|Palo Alto CA|US|bio|2009|100|0.5|7|ABC KSI-501|ex
Janux Ther|JANX|NASDAQ|La Jolla CA|US|bio|2017|100|2|0|TRACTr BiTE|ex
Pieris Pharma|PIRS|NASDAQ|Boston MA|US|bio|2012|60|0.05|10,0|Anticalin|ex
Lenz Ther|LENZ|NASDAQ|Del Mar CA|US|bio|2013|40|0.3|7|LNZ100 Presb|ex
Aldel Bio|—|Private|Cambridge MA|US|bio|2021|20|0|4|Aldehyde Trap|pr
Fred Hutch|—|NP|Seattle WA|US|acad|1975|3500|0|0|Cancer Center|ts
Mass General|—|NP|Boston MA|US|acad|1811|82000|0|0,2,3|AMC|ts
Stanford Med|—|NP|Stanford CA|US|acad|1959|12000|0|0,2|AMC|ts
Duke Cancer|—|NP|Durham NC|US|acad|1972|4000|0|0|Cancer Ctr|ts
Deciphera|DCPH|NASDAQ|Waltham MA|US|bio|2003|350|2.5|0|Kinase Ripretinib|ex
Mirum Pharma|MIRM|NASDAQ|Foster City CA|US|bio|2018|200|2|17,4|Livmarli PFIC|ex
Arcellx|ACLX|NASDAQ|Redwood City CA|US|bio|2015|200|3.5|0,8|ddCAR-T Anito|ex
Phathom Pharma|PHAT|NASDAQ|Florham Park NJ|US|bio|2018|100|0.8|11|Vonoprazan GERD|ex
Bridgebio|BBIO|NASDAQ|San Francisco CA|US|bio|2015|400|6|3,4|Acoramidis TTR|ex
Vaxcyte|PCVX|NASDAQ|San Carlos CA|US|bio|2018|150|8|5|Pneumococcal Vax|ex
Soleno Ther|SLNO|NASDAQ|Redwood City CA|US|bio|2016|60|1.5|4|DCCR Prader-Willi|ex
Travere Ther|TVTX|NASDAQ|San Diego CA|US|bio|2003|350|1.5|13,4|Sparsentan IgAN|ex
Rhythm Pharma|RYTM|NASDAQ|Boston MA|US|bio|2008|250|2.5|4,6|Setmelanotide Obesity|ex
Design Ther|DSGN|NASDAQ|Carlsbad CA|US|bio|2016|80|0.6|4|DT216 Fabry Gene|ex
Entrada Ther|TRDA|NASDAQ|San Diego CA|US|bio|2018|80|0.5|4,21|EEV Peptide DM1|ex
Fulcrum Ther|FULC|NASDAQ|Cambridge MA|US|bio|2016|60|0.3|4|FTX-6058 SCD|ex
Tarsus Pharma|TARS|NASDAQ|Irvine CA|US|bio|2016|150|1.2|7|TP-03 Demodex|ex
Mimetogen|—|Acq|Morgantown WV|US|bio|2012|20|0|7|MIM-D3 DryEye|aq
Catalyst Bio (Vertex)|—|Acq|S San Francisco CA|US|bio|2015|100|0|8|CTX-4430 SCD|aq
Crinetics|CRNX|NASDAQ|San Diego CA|US|bio|2008|250|3|12,4|Paltusotine|ex
Cara Ther|CARA|NASDAQ|Stamford CT|US|bio|2014|20|0.02|14,13|Korsuva Itch|ex
Eagle Pharma|EGRX|NASDAQ|Woodcliff Lake NJ|US|bio|2007|100|0.4|0,5|Ryanodex|ex
Natera|NTRA|NASDAQ|Austin TX|US|bio|2004|5000|15|0,4|Signatera cfDNA|ex
Guardant Health|GH|NASDAQ|Redwood City CA|US|bio|2012|2000|5|0|Guardant360 Liquid|ex
Sorrento Ther|—|Acq|San Diego CA|US|bio|2009|1500|0|0,14|Multimodal|aq
ACADIA|ACAD|NASDAQ|San Diego CA|US|bio|1993|900|4.5|2,14|Nuplazid Pimav|ex
Pliant Ther|PLRX|NASDAQ|S San Francisco CA|US|bio|2016|120|0.8|18,17|PLN-74809 IPF|ex
Intercept (Alfasigma)|—|Acq|New York NY|US|bio|2002|500|0|17|Ocaliva PBC|aq
CymaBay (Gilead)|—|Acq|Newark CA|US|bio|2003|100|0|17|Seladelpar PBC|aq
Viking|VKTX|NASDAQ|San Diego CA|US|bio|2012|45|6|6|VK2735 GLP-1|ex
Adamas (Supernus)|—|Acq|Emeryville CA|US|bio|2000|100|0|2|Gocovri Amant|aq
Avanir (Otsuka)|—|Acq|Aliso Viejo CA|US|bio|1988|200|0|14|Nuedexta PBA|aq
Xenon|XENE|NASDAQ|Burnaby CA|CA|bio|1996|200|4|2|XEN1101 Epilepsy|ex
Scribe Ther|—|Private|Alameda CA|US|bio|2018|60|0|16|X-Editing|pr
Arbor Bio|—|Private|Ann Arbor MI|US|bio|2012|50|0|16|rAAV Cargo|pr
StrideBio|—|Private|Durham NC|US|bio|2018|60|0|16|AAV Stealth|pr
LogicBio (closed)|—|Acq|Cambridge MA|US|bio|2014|0|0|4|GeneRide|aq
Orchard (Kyowa)|—|Acq|London UK|GB|bio|2015|200|0|4|OTL-200 HSC|aq
Avrobio|AVRO|NASDAQ|Cambridge MA|US|bio|2015|80|0.04|4|AVR-RD-04 Gene|ex
Homology Med|—|Acq|Bedford MA|US|bio|2015|80|0|4,8|HMI-102 AAVHSCs|aq
Askbio (Bayer)|—|Acq|RTP NC|US|bio|2001|200|0|16|AAV Pro10|aq
Oxford BioMedica|OXB.L|LSE|Oxford UK|GB|bio|1995|600|0.5|16|LentiVector|ex
MeiraGTx|MGTX|NASDAQ|New York NY|US|bio|2015|200|0.4|7,16|AAV Optogenetics|ex
Genethon|—|NP|Evry FR|FR|acad|1990|300|0|4,16|Gene Ther AFM|ts
Spark (Roche)|—|Acq|Philadelphia PA|US|bio|2013|400|0|7,8|Luxturna RPE65|aq
Applied DNA|APDN|NASDAQ|Stony Brook NY|US|bio|1998|100|0.03|0|LineaDNA PCR|ex
Silence Ther|SLN.L|LSE|London UK|GB|bio|2012|100|0.4|3,8|SiRNA GalNAc|ex
Arrowhead Pharma|ARWR|NASDAQ|Pasadena CA|US|bio|2003|900|5|3,17,10|RNAi TRiM|ex
Dicerna (Novo)|—|Acq|Lexington MA|US|bio|2006|200|0|17,3|GalXC RNAi|aq
Arctus|ARCT|NASDAQ|San Diego CA|US|bio|2013|200|0.6|5,4|sa-mRNA LUNAR|ex
Turnstone Bio|—|Private|Cambridge MA|US|bio|2015|30|0|0|Vaccinia OV|pr
Oncorus (sold)|—|Acq|Cambridge MA|US|bio|2015|50|0|0|oHSV Synthetic|aq
Transgene|TNG.PA|EPA|Strasbourg FR|FR|bio|1979|250|0.15|0|TG4050 MVA|ex
Genelux|GNLX|NASDAQ|San Diego CA|US|bio|2001|40|0.04|0|Olvimulogene GL-ONC1|ex
Targovax|TRVX.OL|OSE|Oslo NO|NO|bio|2010|30|0.03|0|ONCOS-102 Adeno|ex
PsiOxus (now Akeso)|—|Acq|Abingdon UK|GB|bio|2010|50|0|0|enadenotucirev|aq
Oncolytics Bio|ONCY|NASDAQ|Calgary CA|CA|bio|1998|20|0.06|0|Pelareorep Reo|ex
Istari Onc|—|Private|Durham NC|US|bio|2019|30|0|0|PVSRIPO Polio OV|pr
Sensei Bio|—|Private|S San Francisco CA|US|bio|2020|40|0|0|SNS-301 HLADR|pr
Sana Biotech|SANA|NASDAQ|Seattle WA|US|bio|2018|250|0.5|0,16|In Vivo Cell Eng|ex
Cullinan|CGEM|NASDAQ|Cambridge MA|US|bio|2016|60|0.6|0|CLN-619 IO|ex
Ikena Onc|IKNA|NASDAQ|Boston MA|US|bio|2016|50|0.15|0|IK-595 MAPK|ex
PMV Pharma|PMVP|NASDAQ|Cranbury NJ|US|bio|2013|70|0.15|0|PC14586 p53|ex
Monte Rosa|GLUE|NASDAQ|Boston MA|US|bio|2018|100|0.3|0|MRT-6160 VAV1|ex
Frontier Med|FRON|NASDAQ|S San Francisco CA|US|bio|2017|40|0.15|0|FMC-376 MEKi|ex
C4 Therapeutics|CCCC|NASDAQ|Watertown MA|US|bio|2015|100|0.2|0|CFT7455 IKZF|ex
Maplewood Bio|—|Private|Cambridge MA|US|bio|2021|20|0|0|Targeted TPD|pr
Rapafusyn|—|Private|San Antonio TX|US|bio|2017|10|0|0|Rapalink mTOR|pr
Hyku Bio|—|Private|Cambridge MA|US|bio|2021|15|0|0|Targeted IFN|pr
J&J|JNJ|NYSE|New Brunswick NJ|US|pharma|1886|131000|380|0,1,2|Tecvayli BCMA|ex
Merck|MRK|NYSE|Rahway NJ|US|pharma|1891|69000|290|0,5,3|Welireg HIF2a|ex
BMS|BMY|NYSE|Princeton NJ|US|pharma|1887|34000|95|0,8,1|Opdualag LAG3|ex
Daiichi|DSNKY|OTC|Tokyo JP|JP|pharma|2005|17000|60|0,3|Enhertu DXd|ex
Sumitomo|4506.T|TSE|Osaka JP|JP|pharma|2005|8000|4|14,0|Orexin2 iPSC|ex
Mitsubishi Tanabe|4188.T|TSE|Osaka JP|JP|pharma|1678|8000|5|2,14|Radicava ALS|ex
Kyowa Kirin|4151.T|TSE|Tokyo JP|JP|pharma|1949|5700|10|4,8,13|Crysvita FGF23|ex
Daiichi Sankyo EU|—|Private|Munich DE|DE|pharma|2005|2000|0|0|DXd EU Ops|pr
Nippon Shinyaku|4516.T|TSE|Kyoto JP|JP|pharma|1919|3000|4|4,8|Viltolarsen DMD|ex
Taiho Pharma|—|Private|Tokyo JP|JP|pharma|1963|4000|0|0|Lonsurf FTD/TPI|pr
Meiji Pharma|—|Private|Tokyo JP|JP|pharma|1946|7000|0|5,14|Meiact Antibiotic|pr
Sawai Group|4887.T|TSE|Osaka JP|JP|pharma|1929|2800|1.5|0|Generic Leader JP|ex
Nichi-Iko|—|Private|Toyama JP|JP|pharma|1965|3000|0|0|Generic JP|pr
Sosei Heptares|4565.T|TSE|Tokyo JP|JP|bio|1990|200|1|14,6|GPCR Platform|ex
PeptiDream|4587.T|TSE|Kawasaki JP|JP|bio|2006|300|3|0|PDPS Macrocyclic|ex
AnGes|4563.T|TSE|Osaka JP|JP|bio|1999|50|0.1|3|HGF Plasmid|ex
Healios|4593.T|TSE|Tokyo JP|JP|bio|2011|50|0.15|2|HLCM051 Stem|ex
CellSource|4880.T|TSE|Tokyo JP|JP|bio|2015|300|0.4|21|PFC Regen Med|ex
Chiome Bio|4583.T|TSE|Tokyo JP|JP|bio|2005|30|0.02|0|ADLib Ab Disco|ex
Modalis Ther|4883.T|TSE|Tokyo JP|JP|bio|2016|30|0.03|4|CRISPR-GNDM|ex
Noile-Immune|—|Private|Tokyo JP|JP|bio|2015|40|0|0|PRIME CAR-T|pr
GC Pharma|006280.KS|KRX|Yongin KR|KR|pharma|1967|4000|3|8,5|Plasma & Vaccine|ex
HK Inno.N|195940.KQ|KOSDAQ|Seoul KR|KR|pharma|2012|1000|1|11,0|K-CAB Tegoprazan|ex
Daewoong Pharma|069620.KQ|KOSDAQ|Seoul KR|KR|pharma|1945|2500|1.5|9,11|Fexuprazan|ex
Boryung|003850.KS|KRX|Seoul KR|KR|pharma|1957|2000|1|3|Kanarb ARB|ex
Hanmi Pharma|128940.KQ|KOSDAQ|Seoul KR|KR|pharma|1973|3000|3|6,0|HM15211 TriAg|ex
LG Chem Life|051910.KS|KRX|Seoul KR|KR|pharma|1947|5000|5|0,1|Biosimilar|ex
Green Cross|006280.KS|KRX|Yongin KR|KR|bio|1967|4000|3|8,5|Plasma & Vax|ex
Samsung Bio|207940.KS|KRX|Incheon KR|KR|bio|2011|7000|40|0|CDMO|ex
SK Bio|302440.KS|KRX|Seongnam KR|KR|bio|2018|600|2|5|GBP510 Vax|ex
OliX|226950.KQ|KOSDAQ|Suwon KR|KR|bio|2010|100|0.2|9,7|asiRNA|ex
Y-Biologics|—|Private|Daejeon KR|KR|bio|2012|60|0|0|YBL Bispec|pr
Curocell|—|Private|Seoul KR|KR|bio|2017|50|0|0|CAR-NK|pr
Abclon|174900.KQ|KOSDAQ|Seoul KR|KR|bio|2004|80|0.05|0|AT101 CAR-T|ex
Genexine|095700.KQ|KOSDAQ|Seongnam KR|KR|bio|2001|200|0.1|0,5|GX-188E DNA|ex
ToolGen|199800.KQ|KOSDAQ|Seoul KR|KR|bio|2014|100|0.15|16|CRISPR KR|ex
Biocon|BIOCON.NS|NSE|Bangalore IN|IN|bio|1978|15000|5|0,1,6|Biosimilar Plat|ex
Zydus Life|532321.NS|NSE|Ahmedabad IN|IN|pharma|1952|25000|15|0,6,5|Saroglitazar|ex
Lupin|LPC.NS|NSE|Mumbai IN|IN|pharma|1968|22000|8|10,5|Generic Resp|ex
Torrent Pharma|TORNTPHARM.NS|NSE|Ahmedabad IN|IN|pharma|1959|14000|7|3,14|Specialty IN|ex
Aurobindo|AUROPHARMA.NS|NSE|Hyderabad IN|IN|pharma|1986|22000|6|5,0|Generic API|ex
Gland Pharma|GLAND.NS|NSE|Hyderabad IN|IN|pharma|1978|6000|4|0|Injectable Gen|ex
Biocon Biologics|—|Private|Bangalore IN|IN|bio|2019|5000|0|0,1|Biosim Global|pr
Laurus Labs|LAURUSLABS.NS|NSE|Hyderabad IN|IN|pharma|2005|8000|3|5,0|API & CDMO|ex
Natco Pharma|NATCOPHARM.NS|NSE|Hyderabad IN|IN|pharma|1981|4000|2|0|Generic Onc|ex
Glenmark Pharma|GLENMARK.NS|NSE|Mumbai IN|IN|pharma|1977|15000|3|9,10|Innov Derm|ex
Piramal Pharma|PPLPHARMA.NS|NSE|Mumbai IN|IN|pharma|1988|6000|1.5|0|CDMO & OTC|ex
Strides Pharma|STAR.NS|NSE|Bangalore IN|IN|pharma|1990|5000|1|5|Soft Gel Gen|ex
Windlas Bio|—|Private|Dehradun IN|IN|pharma|2001|2500|0|0|CDMO India|pr
Shanghai Fosun|2196.HK|HKEX|Shanghai CN|CN|pharma|1994|30000|5|0,1,5|Diversified CN|ex
Henlius Bio|2696.HK|HKEX|Shanghai CN|CN|bio|2010|3000|2|0,1|Hanlikang Bios|ex
Gloria Bio|—|Private|Suzhou CN|CN|bio|2018|100|0|0|GR1801 CD73|pr
Clover Bio|2197.HK|HKEX|Chengdu CN|CN|bio|2007|400|0.2|5|SCB-2019 Trimer|ex
CanSino|6185.HK|HKEX|Tianjin CN|CN|bio|2009|3000|2|5|Ad5-nCoV Vax|ex
Sinovac|SVA|NASDAQ|Beijing CN|CN|bio|2001|3000|1|5|CoronaVac|ex
Junshi Bio|1877.HK|HKEX|Shanghai CN|CN|bio|2012|4000|3|0,1|Toripalimab|ex
Innovent|1801.HK|HKEX|Suzhou CN|CN|bio|2011|6000|6|0,1,6|Mazdutide GLP1|ex
JW Ther|2126.HK|HKEX|Shanghai CN|CN|bio|2016|300|0.3|0,8|Relmacabtagene|ex
Harbour BioMed|2142.HK|HKEX|Suzhou CN|CN|bio|2016|800|0.5|0,1|Batoclimab FcRn|ex
Ocugen|OCGN|NASDAQ|Malvern PA|US|bio|2013|100|0.2|7|OCU400 Gene|ex
Immunovant|IMVT|NASDAQ|New York NY|US|bio|2018|200|3|1,2|Batoclimab FcRn|ex
Scholar Rock|SRRK|NASDAQ|Cambridge MA|US|bio|2012|200|1.5|4,21|Apitegromab SMA|ex
Avidity Bio|RNA|NASDAQ|San Diego CA|US|bio|2012|300|3|4,21|AOC 1001 DM1|ex
Biomea|BMEA|NASDAQ|Redwood City CA|US|bio|2017|130|1.2|6,0|BMF-219 Menin|ex
Morphic (Lilly)|—|Acq|Waltham MA|US|bio|2015|120|0|11,1|MORF-057 Integrin|aq
Tango|TNGX|NASDAQ|Cambridge MA|US|bio|2017|200|1.5|0|TNG908 PRMT5|ex
Relay|RLAY|NASDAQ|Cambridge MA|US|bio|2016|400|3|0|RLY-2608 PI3Ka|ex
Revolution|RVMD|NASDAQ|Redwood City CA|US|bio|2014|500|8|0|RMC-6236 RAS|ex
Black Diamond|BDTX|NASDAQ|Cambridge MA|US|bio|2017|100|0.1|0|BDTX-1535 EGFR|ex
Oxford Biomedica|OXB.L|LSE|Oxford UK|GB|bio|1995|600|0.5|16|LentiVector CDMO|ex
Abcam (Danaher)|—|Acq|Cambridge UK|GB|bio|1998|1500|0|0|Ab Reagents|aq
Dechra Pharma|DPH.L|LSE|Northwich UK|GB|pharma|1997|2000|4|0|Vet Pharma|ex
Indivior|INDV.L|LSE|Richmond UK|GB|pharma|2014|800|2|14|Sublocade Bup|ex
Hikma Pharma|HIK.L|LSE|London UK|GB|pharma|1978|8500|5|5,0|Injectable Gen|ex
Genus|GNS.L|LSE|Basingstoke UK|GB|bio|1994|3000|4|0|Animal Genetics|ex
Vectura (PMI)|—|Acq|Chippenham UK|GB|bio|2007|500|0|10|Inhaled CDMO|aq
BTG (Boston Sci)|—|Acq|London UK|GB|bio|1991|1000|0|0|Interventional|aq
Ergomed|ERGO.L|LSE|Guildford UK|GB|cro|1997|1500|1|0|Spec CRO|ex
Clinigen|—|Acq|Burton UK|GB|pharma|2010|1000|0|0|Managed Access|aq
Circassia|—|Acq|Oxford UK|GB|bio|2006|200|0|10|Niox Asthma|aq
4D Pharma|—|Acq|Leeds UK|GB|bio|2014|80|0|11|MRx Microbiome|aq
Mereo BioPharma|MREO.L|LSE|London UK|GB|bio|2015|30|0.08|4,21|Setrusumab OI|ex
TC BioPharm|TCBP.L|LSE|Motherwell UK|GB|bio|2013|30|0.02|0|GammaDelta T|ex
Redx Pharma|REDX.L|LSE|Alderley Park UK|GB|bio|2010|100|0.1|17,0|RXC007 ROCK2|ex
Autolus Ther|AUTL|NASDAQ|London UK|GB|bio|2014|300|1.5|0,8|Obe-cel CAR-T|ex
Adaptimmune|ADAP|NASDAQ|Abingdon UK|GB|bio|2008|300|0.15|0|Afami-cel TCR-T|ex
Achilles (BMS)|—|Acq|London UK|GB|bio|2016|100|0|0|cNeT Neoantigen|aq
Kiadis (Sanofi)|—|Acq|Amsterdam NL|NL|bio|2005|80|0|8|K-NK002 NK|aq
uniQure|QURE|NASDAQ|Amsterdam NL|NL|bio|2012|500|1.5|8|Hemgenix F9 Gene|ex
Onward Medical|ONWD.AS|AMS|Eindhoven NL|NL|med|2014|120|0.3|2|ARC-EX NeuroStim|ex
Zealand|ZEAL|NASDAQ|Copenhagen DK|DK|bio|1998|600|6|6,4|Dasiglucagon|ex
Ascendis|ASND|NASDAQ|Copenhagen DK|DK|bio|2007|800|8|4,12|TransCon hGH|ex
Alligator|ATORX.ST|OMX|Lund SE|SE|bio|2001|40|0.08|0|Mitazalimab CD40|ex
Hansa Bio|HNSA.ST|OMX|Lund SE|SE|bio|2007|200|0.5|4,1|Idefirix IgG|ex
Calliditas|CALT|NASDAQ|Stockholm SE|SE|bio|2004|100|1.5|13|Tarpeyo IgAN|ex
Immunicum|IMMU.ST|OMX|Stockholm SE|SE|bio|2002|30|0.03|0|Ilixadencel DCP|ex
Sprint Bio|—|Private|Huddinge SE|SE|bio|2014|30|0|0|SBP-101|pr
Genfit|GNFT.PA|EPA|Lille FR|FR|bio|1999|100|0.15|17|Elafibranor PBC|ex
DBV Technologies|DBVT|NASDAQ|Montrouge FR|FR|bio|2002|200|0.15|1|Viaskin Peanut|ex
Innate Pharma|IPH.PA|EPA|Marseille FR|FR|bio|1999|200|0.15|0|Lacutamab KIR3|ex
Valneva|VALN.PA|EPA|Saint-Herblain FR|FR|bio|1999|800|0.8|5|Ixchiq Chikungunya|ex
Genkyotex (Calliditas)|—|Acq|Geneva CH|CH|bio|2001|30|0|17|Setanaxib NOX|aq
Boehringer|—|Private|Ingelheim DE|DE|pharma|1885|53000|0|10,0,6|Spesolimab IL36|pr
Merck KGaA|MRK.DE|XETRA|Darmstadt DE|DE|pharma|1668|60000|50|0,1,2|Xevinapant IAP|ex
Affimed|AFMD|NASDAQ|Heidelberg DE|DE|bio|2000|150|0.03|0,8|AFM13 NK Engager|ex
Immatics|IMTX|NASDAQ|Tubingen DE|DE|bio|2000|300|0.5|0|IMA401 TCR-T|ex
PharmaMar|PHM.MC|BME|Madrid ES|ES|pharma|1986|500|1.5|0|Zepzelca Lurbi|ex
Almirall|ALM.MC|BME|Barcelona ES|ES|pharma|1943|2000|2|9|Ebglyss Lebrik|ex
Recordati|REC.MI|BIT|Milan IT|IT|pharma|1926|4500|8|4|Isturisa Onc|ex
Chiesi|—|Private|Parma IT|IT|pharma|1935|6000|0|10,4|Rare Resp|pr
Menarini|—|Private|Florence IT|IT|pharma|1886|17000|0|0,3|Specialty|pr
CSL|CSL.AX|ASX|Melbourne AU|AU|bio|1916|32000|100|8,1,4|Hemgenix CSL|ex
Telix|TLX.AX|ASX|Melbourne AU|AU|bio|2015|700|3|0|Illuccix PSMA|ex
Polynovo|PNV.AX|ASX|Melbourne AU|AU|bio|2014|200|0.8|9|NovoSorb BTM|ex
Clarity Pharma|CU6.AX|ASX|Sydney AU|AU|bio|2018|100|1|0|Cu-64 SARTATE|ex
Paradigm Bio|PAR.AX|ASX|Melbourne AU|AU|bio|2015|30|0.08|21|PPS Tendon|ex
Starpharma|SPL.AX|ASX|Melbourne AU|AU|bio|1996|40|0.1|5,0|DEP Dendrimer|ex
Anteris Tech|AVR.AX|ASX|Brisbane AU|AU|bio|2014|60|0.15|3|ADAPT TAVR|ex
Avita Medical|RCEL|NASDAQ|Valencia CA|US|bio|2002|300|0.8|9|RECELL Skin|ex
Noxopharm|NOX.AX|ASX|Sydney AU|AU|bio|2015|15|0.02|0|Veyonda Idronoxil|ex
Liminal|LMNL|NASDAQ|Laval CA|CA|bio|2002|20|0.03|4|LMNL-6511|ex
Fennec Pharma|FRX.TO|TSX|Research Triangle NC|US|bio|2004|30|0.1|0|Pedmark Cisplatin|ex
Trillium (Pfizer)|—|Acq|Toronto CA|CA|bio|2004|50|0|0|TTI-622 CD47|aq
Profound|PRN.TO|TSX|Mississauga CA|CA|med|2008|150|0.4|0|TULSA-PRO|ex
Oncolytics|ONCY|NASDAQ|Calgary CA|CA|bio|1998|20|0.06|0|Pelareorep|ex
Knight Ther|GUD.TO|TSX|Montreal CA|CA|pharma|2014|200|0.5|0|Canadian Spec|ex
Bellus Health (GSK)|—|Acq|Montreal CA|CA|bio|2017|50|0|14|Camlipixant P2X3|aq
Acerus (Sun)|—|Acq|Mississauga CA|CA|bio|2010|40|0|12|Natesto T|aq
Nordic Nano|NANOV.OL|OSE|Oslo NO|NO|bio|2018|30|0.04|0|NanoTherm Glioma|ex
PCI Biotech|PCIB.OL|OSE|Oslo NO|NO|bio|2008|20|0.02|0|Fimaporfin PCI|ex
Vaccibody (Nykode)|NYKD.OL|OSE|Oslo NO|NO|bio|2007|80|0.15|0,5|VB10.NEO DNA|ex
BerGenBio|—|Acq|Bergen NO|NO|bio|2007|50|0|0|Bemcentinib AXL|aq
Photocure|PHO.OL|OSE|Oslo NO|NO|bio|1993|100|0.3|19|Hexvix Bladder|ex
Brainsway|BWAY|NASDAQ|Jerusalem IL|IL|bio|2003|80|0.15|14|Deep TMS|ex
Plurilock|—|Private|Tel Aviv IL|IL|bio|2016|20|0|0|Cyber Bio|pr
Itamar Medical (Zoll)|—|Acq|Caesarea IL|IL|bio|2001|200|0|3|WatchPAT Sleep|aq
UroGen|URGN|NASDAQ|Princeton NJ|US|bio|2004|200|0.5|19|Jelmyto UGN-101|ex
Novocure|NVCR|NASDAQ|St Helier JE|JE|bio|2000|1000|2|0|Optune TTFields|ex
CanSino Bio|6185.HK|HKEX|Tianjin CN|CN|bio|2009|3000|2|5|Convidecia|ex
WuXi XDC|2268.HK|HKEX|Wuxi CN|CN|cdmo|2020|2000|3|0|ADC CDMO|ex
Remegen|9995.HK|HKEX|Yantai CN|CN|bio|2008|1500|2|0|RC48 ADC|ex
TaiMed Bio|4147.TW|TWSE|Taipei TW|TW|bio|2007|100|0.3|5|Ibalizumab HIV|ex
Medigen Vac|6547.TW|TWSE|Taipei TW|TW|bio|2012|200|0.5|5|MVC-COV1901|ex
OBI Pharma|4174.TW|TWSE|Taipei TW|TW|bio|2002|100|0.2|0|Adagloxad Globo|ex
Yuhan|000100.KS|KRX|Seoul KR|KR|pharma|1926|5000|6|6,0|Lazertinib EGFR|ex
Hanmi|128940.KQ|KOSDAQ|Seoul KR|KR|pharma|1973|3000|3|6,0|Efinopegdutide|ex
Daewoong|069620.KQ|KOSDAQ|Seoul KR|KR|pharma|1945|2500|1.5|9,11|Fexuclue PPI|ex
LG Chem|051910.KS|KRX|Seoul KR|KR|pharma|1947|5000|5|0,1|Euclid Biosim|ex
HK Inno|195940.KQ|KOSDAQ|Seoul KR|KR|pharma|2012|1000|1|11|Tegoprazan|ex
Exact Sciences|EXAS|NASDAQ|Madison WI|US|bio|2009|6500|15|0|Cologuard cfDNA Dx|ex
Twist Bioscience|TWST|NASDAQ|S San Francisco CA|US|bio|2013|1100|3|0|Synth Bio DNA|ex
Pacific Biosciences|PACB|NASDAQ|Menlo Park CA|US|bio|2000|1100|1.5|0|HiFi Sequencing|ex
Adaptive Biotechnologies|ADPT|NASDAQ|Seattle WA|US|bio|2009|800|1.5|0,1|clonoSEQ Immuno|ex
NeoGenomics|NEO|NASDAQ|Fort Myers FL|US|bio|2001|2000|2.5|0|Onc Dx Lab|ex
Myriad Genetics|MYGN|NASDAQ|Salt Lake City UT|US|bio|1991|2500|3|0|Genetic Testing|ex
Supernus Pharma|SUPN|NASDAQ|Rockville MD|US|bio|1990|800|2|14,2|CNS Specialty|ex
Emergent BioSolutions|EBS|NYSE|Gaithersburg MD|US|bio|1998|2300|0.5|5|CBRN Biodefense|ex
Organon|OGN|NYSE|Jersey City NJ|US|pharma|2021|9000|5|20,0|Women's Health|ex
TherapeuticsMD|TXMD|NASDAQ|Boca Raton FL|US|bio|2008|300|0.1|20|Women's Endocrine|ex
Dare Bioscience|DARE|NASDAQ|San Diego CA|US|bio|2014|25|0.05|20|Women's SH|ex
Myovant Sciences|—|Acq|Basel CH|CH|bio|2016|400|0|19,0|GnRH Antagonist|aq
Ferring Pharma|—|Private|Saint-Prex CH|CH|pharma|1950|7000|0|19,20|Repro Urology|pr
Tolmar|—|Private|Fort Collins CO|US|pharma|2006|1000|0|19,0|Eligard Prostate|pr
Corcept Therapeutics|CORT|NASDAQ|Menlo Park CA|US|bio|1998|600|6|12,0|Cortisol Mod|ex
Xeris Biopharma|XERS|NASDAQ|Chicago IL|US|bio|2005|300|0.3|12,4|Gvoke Glucagon|ex
Shionogi & Co|4507.T|TSE|Osaka JP|JP|pharma|1878|5500|8|5,14|Xofluza Antiviral|ex
VBI Vaccines|VBIV|NASDAQ|Cambridge MA|US|bio|2007|100|0.02|5|VBI-2901 eVLP|ex
Assembly Biosciences|ASMB|NASDAQ|San Diego CA|US|bio|2012|70|0.2|15|HBV Capsid|ex
Fortrea|FTRE|NASDAQ|Durham NC|US|cro|2023|18000|3|0|Full CRO|ex
Novotech|—|Private|Sydney AU|AU|cro|1997|3500|0|0|APAC CRO|pr
SGS SA|SGSN.SW|SIX|Geneva CH|CH|cro|1878|98000|20|0|Lab Services|ex
Fujifilm Diosynth|—|Private|Tokyo JP|JP|cdmo|2011|5000|0|0|CDMO Bio Mfg|pr
AGC Biologics|—|Private|Bothell WA|US|cdmo|2016|3000|0|0|Contract CDMO|pr
Ajinomoto Bio-Pharma|—|Private|San Diego CA|US|cdmo|2001|1500|0|0|CDMO Oligo ADC|pr
Penumbra|PEN|NYSE|Alameda CA|US|med|2004|4000|6|2,3|Neurovasc Device|ex
Inari Medical|NARI|NASDAQ|Irvine CA|US|med|2011|1500|3|3|FlowTriever VTE|ex
Shockwave Med (J&J)|—|Acq|Santa Clara CA|US|med|2009|1000|0|3|IVL Litho|aq
Intuitive Surgical|ISRG|NASDAQ|Sunnyvale CA|US|med|1995|12000|165|0|da Vinci Robot|ex
Edwards Lifesciences|EW|NYSE|Irvine CA|US|med|1958|19000|50|3|TAVR Heart Valve|ex
Stryker|SYK|NYSE|Kalamazoo MI|US|med|1941|52000|130|21|Ortho MedSurg|ex
Hologic|HOLX|NASDAQ|Marlborough MA|US|med|1985|6800|18|20,0|Women's Dx|ex
Masimo|MASI|NASDAQ|Irvine CA|US|med|1989|3000|8|10,3|Pulse Oximetry|ex
Insulet|PODD|NASDAQ|Acton MA|US|med|2000|8500|20|12|Omnipod Insulin|ex
DexCom|DXCM|NASDAQ|San Diego CA|US|med|1999|9000|35|12|CGM Glucose|ex
Tandem Diabetes|TNDM|NASDAQ|San Diego CA|US|med|2006|4000|3|12|t:slim Pump|ex
Abiomed (J&J)|—|Acq|Danvers MA|US|med|1981|3000|0|3|Impella Heart|aq
Nevro|NVRO|NYSE|Redwood City CA|US|med|2006|1400|0.5|14|HF10 Spinal|ex
Axonics|AXNX|NASDAQ|Irvine CA|US|med|2013|800|3.5|19|SNM Bladder|ex
Globus Medical|GMED|NYSE|Audubon PA|US|med|2003|3500|8|21|Spine Robot|ex
NovoCure|NVCR|NASDAQ|Root CH|CH|med|2000|1000|3|0|TTFields GBM|ex
Idorsia|IDIA.SW|SIX|Allschwil CH|CH|pharma|2017|500|0.4|14,3|Daridorexant Insomnia|ex
Molecular Partners|MOLN.SW|SIX|Zurich CH|CH|bio|2004|150|0.2|0,5|DARPin|ex
Basilea Pharma|BSLN.SW|SIX|Basel CH|CH|bio|2000|100|0.3|5|Cresemba Antifungal|ex
Obseva (XOMA)|—|Acq|Geneva CH|CH|bio|2012|30|0|20|Linzagolix Gyn|aq
Relief Therapeutics|RLF.SW|SIX|Geneva CH|CH|bio|2016|20|0.03|10,4|Sentinox NO|ex
Polyphor|—|Acq|Allschwil CH|CH|bio|2001|50|0|5|Balixafortide CXCR4|aq
ADC Therapeutics|ADCT|NYSE|Lausanne CH|CH|bio|2012|350|0.6|8|Zynlonta ADC|ex
Evolva|—|Acq|Reinach CH|CH|bio|2004|50|0|0|Synth Bio Ingredients|aq
Orphazyme|—|Acq|Copenhagen DK|DK|bio|2009|50|0|4|HSP70 Induction|aq
Nuevolution (Amgen)|—|Acq|Copenhagen DK|DK|bio|2001|80|0|0|Chemetics|aq
Lundbeck|LUN.CO|CPSE|Copenhagen DK|DK|pharma|1915|5600|8|14,2|CNS Specialty|ex
ALK-Abello|ALK.CO|CPSE|Horsholm DK|DK|pharma|1923|6000|4|1,10|Allergy Immunother|ex
Orion Pharma|ORNAV.HE|OMX|Espoo FI|FI|pharma|1917|3500|4|0,14|Darolutamide|ex
Laboratorios Rovi|ROVI.MC|BME|Madrid ES|ES|pharma|1946|2000|3|3,5|Enoxaparin CDMO|ex
Oryzon Genomics|ORY.MC|BME|Barcelona ES|ES|bio|2000|60|0.1|0,14|LSD1 Epigenetic|ex
Grifols SA|GRF.MC|BME|Barcelona ES|ES|bio|1940|23000|6|8|Plasma Fractionation|ex
Italfarmaco|—|Private|Milan IT|IT|pharma|1938|3500|0|8,4|Hematology|pr
Newron Pharma|NWRN.MI|BIT|Milan IT|IT|bio|1999|40|0.05|14|Evenamide Schiz|ex
NTC Pharma|—|Private|Florence IT|IT|bio|2006|30|0|5|Anti-infective|pr
Philogen|PHLOG.MI|BIT|Siena IT|IT|bio|1996|200|0.5|0|F8-IL2 Immuno-cytokine|ex
Morphosys (Novartis)|—|Acq|Munich DE|DE|bio|1992|600|0|0,8|Pelabresib|aq
Bayer AG|BAYN.DE|XETRA|Leverkusen DE|DE|pharma|1863|100000|28|0,3,7|Radiopharma|ex
Evotec SE|EVT.DE|XETRA|Hamburg DE|DE|bio|1993|5000|2|0,14|iPSC AI DDisco|ex
Centogene|CNTG|NASDAQ|Rostock DE|DE|bio|2006|700|0.08|4|Rare Dx Biobank|ex
Formycon|FYB.DE|XETRA|Munich DE|DE|bio|2012|400|1|7,1|Biosimilar|ex
MagForce|—|Acq|Berlin DE|DE|bio|2002|50|0|0|NanoTherm GBM|aq
Nuvisan|—|Private|Grafing DE|DE|cro|2020|1200|0|0|Mid-size CRO|pr
Sartorius|SRT.DE|XETRA|Gottingen DE|DE|cdmo|1870|14000|20|0|Bioprocess Equip|ex
Galapagos NV|GLPG|NASDAQ|Mechelen BE|BE|bio|1999|1000|2|1,18|Cell Therapy IPF|ex
Mithra Pharma|MITRA.BR|EBR|Liege BE|BE|bio|1999|200|0.1|20|Estetrol Contra|ex
Celyad Oncology|CYAD|NASDAQ|Mont-Saint-Guibert BE|BE|bio|2007|70|0.02|0|shRNA CAR-T|ex
Biocartis|BCART.BR|EBR|Mechelen BE|BE|bio|2007|250|0.1|0|Idylla Mol Dx|ex
Hyloris|HYL.BR|EBR|Liege BE|BE|pharma|2012|30|0.1|0|IV Reformulation|ex
Vivoryon|VVY.DE|XETRA|Halle DE|DE|bio|2001|30|0.03|2|QPCT AD|ex
GSK plc|GSK|NYSE|London UK|GB|pharma|2000|72000|80|5,0,1,10|Vaccines Biologics|ex
Destiny Pharma|DEST.L|LSE|Brighton UK|GB|bio|1996|15|0.01|5|XF-73 Anti-staph|ex
Summit Therapeutics|SMMT|NASDAQ|Cambridge UK|GB|bio|2003|40|3|0,5|Ivonescimab PD-1/VEGF|ex
Silence Therapeutics|SLN|NASDAQ|London UK|GB|bio|1994|150|0.5|3,8|mRNAi GalNAc|ex
Syncona|SYNC.L|LSE|London UK|GB|bio|2012|40|0.6|0,4|LS HealthTech VC|ex
Calliditas Ther|CALT|NASDAQ|Stockholm SE|SE|bio|2006|100|2|13|Tarpeyo IgAN|ex
Hansa Biopharma|HNSA.ST|OMX|Lund SE|SE|bio|2007|200|0.8|1,13|Imlifidase IgG|ex
Camurus|CAMX.ST|OMX|Lund SE|SE|bio|1991|200|2|14|FluidCrystal Depot|ex
Oasmia|OASM.ST|OMX|Stockholm SE|SE|bio|2000|50|0.05|0|Apealea Nanopart|ex
Medivir|MVIR.ST|OMX|Huddinge SE|SE|bio|1988|20|0.02|0|DDR Onc|ex
Nanobiotix|NBTX|NASDAQ|Paris FR|FR|bio|2003|150|0.2|0|NBTXR3 Radioenhancer|ex
Biophytis|BPTS|NASDAQ|Paris FR|FR|bio|2006|40|0.02|21,4|Sarconeos Sarcopenia|ex
Erytech Pharma|ERYP|NASDAQ|Lyon FR|FR|bio|2004|100|0.03|0|RBC Encapsulation|ex
Servier|—|Private|Suresnes FR|FR|pharma|1954|22000|0|0,3|Oncology Cardio|pr
Pierre Fabre|—|Private|Castres FR|FR|pharma|1961|10000|0|9,0|Derm Onc|pr
Stallergenes Greer|—|Private|Antony FR|FR|pharma|1962|1200|0|1|Allergy Immunother|pr
Tessa Therapeutics|—|Private|Singapore SG|SG|bio|2013|120|0|0|Virus-spec T|pr
MiRXES|—|Private|Singapore SG|SG|bio|2014|100|0|0|miRNA Dx Gastric|pr
Esco Lifesciences|—|Private|Singapore SG|SG|bio|1978|2500|0|0|Lab Equipment|pr
BioVersys|—|Private|Basel CH|CH|bio|2008|50|0|5|Antibiotic Res|pr
MiNA Therapeutics|—|Private|London UK|GB|bio|2008|50|0|0|saRNA Upregulation|pr
Reaction Biology|—|Private|Malvern PA|US|bio|2001|100|0|0|Assay Services|pr
Medigen Vaccine|6547.TW|TWSE|Taipei TW|TW|bio|2012|400|0.5|5|COVID Vax Adj|ex
PharmaEngine|4162.TW|TWSE|Taipei TW|TW|bio|2003|40|0.1|0|ONIVYDE Panc|ex
TaiGen Biotherapeutics|4157.TW|TWSE|Taipei TW|TW|bio|2004|100|0.1|5|Taigexyn Antibio|ex
Orient Pharma|4166.TW|TWSE|Taipei TW|TW|pharma|1952|800|0.2|0,3|Generic CNS|ex
JHL Biotech|6540.TW|TWSE|Hsinchu TW|TW|bio|2014|500|0.3|0|Biosimilar CDMO|ex
Helixmith|084990.KQ|KOSDAQ|Seoul KR|KR|bio|2000|100|0.2|3|VM202 PAD Gene|ex
Boryung Pharm|003850.KS|KRX|Seoul KR|KR|pharma|1957|2000|1.5|3|Kanarb ARB|ex
HLB Inc|028300.KQ|KOSDAQ|Seoul KR|KR|bio|2001|100|0.5|0|Rivoceranib VEGFR|ex
Green Cross Lab|—|Private|Yongin KR|KR|cro|1967|1500|0|0|Lab Testing|pr
Hanmi Pharm|128940.KS|KRX|Seoul KR|KR|pharma|1973|3500|2.5|6,0|LAPS Platform|ex
ST Pharm|237690.KQ|KOSDAQ|Seoul KR|KR|cdmo|2008|500|0.3|0|Oligo CDMO|ex
Divi's Laboratories|DIVISLAB.NS|NSE|Hyderabad IN|IN|pharma|1990|16000|18|0|API CDMO|ex
Ajanta Pharma|AJANTPHARM.NS|NSE|Mumbai IN|IN|pharma|1973|6000|4|9,7|Branded Derm|ex
Cadila Healthcare|CADILAHC.NS|NSE|Ahmedabad IN|IN|pharma|1952|25000|10|0,3|Diversified|ex
Granules India|GRANULES.NS|NSE|Hyderabad IN|IN|pharma|1991|5000|1.5|0|API FDF CDMO|ex
Alkem Labs|ALKEM.NS|NSE|Mumbai IN|IN|pharma|1973|15000|6|5,0|Anti-infective|ex
IPCA Labs|IPCALAB.NS|NSE|Mumbai IN|IN|pharma|1949|9000|4|5,6|API Formulations|ex
Aarti Drugs|AARTIDRUGS.NS|NSE|Mumbai IN|IN|pharma|1984|3000|0.5|0|API Manufacturer|ex
Jubilant Pharmova|JUBLPHARMA.NS|NSE|Noida IN|IN|pharma|1978|6000|1|0,10|Specialty Radio|ex
Suven Pharma|SUVENPHAR.NS|NSE|Hyderabad IN|IN|pharma|2020|1200|2|14|CNS CDMO|ex
Lupin Limited|LUPIN.NS|NSE|Mumbai IN|IN|pharma|1968|16000|8|10,3|Complex Generic|ex
Wockhardt|WOCKPHARMA.NS|NSE|Mumbai IN|IN|pharma|1999|7500|0.8|5|Anti-infective|ex
Mankind Pharma|MANKIND.NS|NSE|New Delhi IN|IN|pharma|1995|12000|8|10,11|OTC Consumer|ex
Zydus Lifesciences|ZYDUSLIFE.NS|NSE|Ahmedabad IN|IN|pharma|1952|25000|12|0,6|NCE Discovery|ex
EMS Pharma|—|Private|Hortolandia BR|BR|pharma|1964|7000|0|0,3|Generic Leader|pr
Eurofarma|—|Private|Sao Paulo BR|BR|pharma|1972|8000|0|0,10|LatAm Generics|pr
Cristalia|—|Private|Itapira BR|BR|pharma|1972|5000|0|14,0|Anesthetics API|pr
Ache Laboratorios|—|Private|Guarulhos BR|BR|pharma|1966|5500|0|11,3|GI Cardio|pr
Biolab Pharma|—|Private|Sao Paulo BR|BR|pharma|1997|2000|0|3,14|Branded Generic|pr
Blau Farmaceutica|BLAU3.SA|BVMF|Cotia BR|BR|pharma|1987|2500|0.5|8,5|Specialty Heparin|ex
Hypera Pharma|HYPE3.SA|BVMF|Sao Paulo BR|BR|pharma|2001|6000|4|0,11|Consumer Health|ex
Bio-Manguinhos|—|Private|Rio de Janeiro BR|BR|gov|1976|2000|0|5|Fiocruz Vaccines|pr
Insud Pharma|—|Private|Buenos Aires AR|AR|pharma|1991|5000|0|0,5|LatAm Generics|pr
Richmond Lab|—|Private|Buenos Aires AR|AR|pharma|1991|1500|0|5|Sputnik Vax|pr
Biogenesis Bago|—|Private|Buenos Aires AR|AR|bio|1992|2000|0|5|Veterinary Bio|pr
Laboratorio Chile|—|Private|Santiago CL|CL|pharma|1896|3000|0|0|Generic Pharma|pr
Procaps Group|PROC|NASDAQ|Barranquilla CO|CO|pharma|1977|5500|0.3|0|SoftGel Tech|ex
Tecnoquimicas|—|Private|Cali CO|CO|pharma|1934|6000|0|0,11|Consumer Health|pr
Liomont|—|Private|Mexico City MX|MX|pharma|1938|3000|0|0,10|Mexican Pharma|pr
Probiomed|—|Private|Mexico City MX|MX|bio|1970|1200|0|5,1|Biosimilar MX|pr
Genomma Lab|LABB.MX|BMV|Mexico City MX|MX|pharma|1996|4000|2|11,9|OTC Consumer|ex
Kalbe Farma|KLBF.JK|IDX|Jakarta ID|ID|pharma|1966|17000|5|0,11|SE Asia Pharma|ex
Bio Farma|—|Private|Bandung ID|ID|gov|1890|3000|0|5|Vaccine Producer|pr
Duopharma|DPHARMA.KL|KLSE|Klang MY|MY|pharma|1954|1500|0.2|0|Malaysian Pharma|ex
Pharmaniaga|PHARMA.KL|KLSE|Shah Alam MY|MY|pharma|1994|2000|0.3|0,5|Generic Govt|ex
Vingroup Biotech|—|Private|Hanoi VN|VN|bio|2018|500|0|5|Vietnamese Biotech|pr
Siam Bioscience|—|Private|Bangkok TH|TH|bio|2009|400|0|5|AZ Vaccine Mfg|pr
Mega Lifesciences|MEGA.BK|SET|Bangkok TH|TH|pharma|1982|5000|1|11,0|SE Asia OTC|ex
Thai Otsuka|—|Private|Bangkok TH|TH|pharma|1979|600|0|14,11|IV Solutions|pr
SPIMACO|—|Private|Riyadh SA|SA|pharma|1986|3500|0|0,5|Saudi Pharma|pr
Tabuk Pharma|—|Private|Tabuk SA|SA|pharma|1994|1500|0|0|Saudi Generic|pr
Jamjoom Pharma|—|Private|Jeddah SA|SA|pharma|1992|2000|0|7,9|Ophtho Derm|pr
Julphar|—|Private|Ras Al Khaimah AE|AE|pharma|1980|2500|0|0,6|Gulf Pharma|pr
Neopharma|—|Private|Abu Dhabi AE|AE|pharma|2003|1000|0|0|UAE Generic|pr
Aspen Pharmacare|APN.JO|JSE|Durban ZA|ZA|pharma|1850|9000|6|8,5|Specialty Sterile|ex
Adcock Ingram|AIP.JO|JSE|Midrand ZA|ZA|pharma|1890|3000|1|0,11|OTC Hospital|ex
Abdi Ibrahim|—|Private|Istanbul TR|TR|pharma|1912|5000|0|0,3|Turkish Pharma|pr
Nobel Ilac|—|Private|Istanbul TR|TR|pharma|1964|3500|0|0,10|Turkish Generic|pr
Amoun Pharma|—|Private|Cairo EG|EG|pharma|1998|3000|0|0,5|Egyptian Pharma|pr
Teva Pharma|TEVA|NYSE|Tel Aviv IL|IL|pharma|1901|37000|20|14,0|Generic Specialty|ex
Aspen Global|—|Private|Dublin IE|IE|pharma|2009|2000|0|0|Spec Sterile Mfg|pr
Charité Berlin|—|NP|Berlin DE|DE|acad|1710|18000|0|2,0,3|University Hosp|ts
Karolinska Inst|—|NP|Stockholm SE|SE|acad|1810|6000|0|0,2|Research Univ|ts
Institut Curie|—|NP|Paris FR|FR|acad|1909|3500|0|0|Cancer Research|ts
IRCCS San Raffaele|—|NP|Milan IT|IT|acad|1971|5000|0|0,2|Research Hosp|ts
RIKEN|—|NP|Wako JP|JP|acad|1917|3000|0|0,16|Research Inst|ts
Natl Cancer Ctr Singapore|—|NP|Singapore SG|SG|acad|2000|2000|0|0|Cancer Research|ts
Tata Memorial Hosp|—|NP|Mumbai IN|IN|acad|1941|4000|0|0|Cancer Center|ts
Chinese PLA General Hosp|—|NP|Beijing CN|CN|acad|1953|6000|0|0,3|Military Hosp|ts
Asan Medical Center|—|NP|Seoul KR|KR|acad|1989|10000|0|0,8|Teaching Hosp|ts
Royal Marsden|—|NP|London UK|GB|acad|1851|4000|0|0|Cancer Center|ts
Princess Margaret|—|NP|Toronto CA|CA|acad|1952|4000|0|0|Cancer Center|ts
Peter MacCallum|—|NP|Melbourne AU|AU|acad|1949|2500|0|0|Cancer Center|ts
CAMS Peking Union|—|NP|Beijing CN|CN|acad|1921|5000|0|0,1|Teaching Hosp|ts
Fudan Cancer Hosp|—|NP|Shanghai CN|CN|acad|1931|3000|0|0|Cancer Hosp|ts
West China Hosp|—|NP|Chengdu CN|CN|acad|1892|5000|0|0,3|Teaching Hosp|ts
Cancer Hosp CAMS|—|NP|Beijing CN|CN|acad|1958|3000|0|0|Cancer Research|ts
Ruijin Hospital|—|NP|Shanghai CN|CN|acad|1907|4000|0|8,0|Teaching Hosp|ts
Severance Hospital|—|NP|Seoul KR|KR|acad|1885|5000|0|0,8|Yonsei Med|ts
Natl Taiwan Univ Hosp|—|NP|Taipei TW|TW|acad|1895|6000|0|0|Teaching Hosp|ts
AIIMS New Delhi|—|NP|New Delhi IN|IN|acad|1956|8000|0|0,3|Teaching Hosp|ts
Siriraj Hospital|—|NP|Bangkok TH|TH|acad|1888|12000|0|0|Teaching Hosp|ts
National Univ Hospital|—|NP|Singapore SG|SG|acad|1985|8000|0|0,2|Teaching Hosp|ts
Hospital Israelita Einstein|—|NP|Sao Paulo BR|BR|acad|1955|12000|0|0,3|Research Hosp|ts
Rabin Medical Center|—|NP|Petah Tikva IL|IL|acad|1936|5000|0|0,8|Teaching Hosp|ts
King Faisal Spec Hosp|—|NP|Riyadh SA|SA|acad|1975|10000|0|0,8|Tertiary Care|ts
Beacon Pharma|—|Private|Dhaka BD|BD|pharma|2006|3000|0|0,5|Bangladeshi Gen|pr
Square Pharma|—|Private|Dhaka BD|BD|pharma|1958|6000|0|0|Bangladeshi Pharma|pr
Hetero Drugs|—|Private|Hyderabad IN|IN|pharma|1993|25000|0|5,0|API ARV|pr
MSN Laboratories|—|Private|Hyderabad IN|IN|pharma|2004|7000|0|0|Generic API|pr
Intas Pharma|—|Private|Ahmedabad IN|IN|pharma|1984|16000|0|0,8|Injectable Bio|pr
Dongbao Enterprise|600867.SS|SSE|Tonghua CN|CN|pharma|1995|4000|2|12|Insulin Bio|ex
Kelun Pharma|002422.SZ|SZSE|Chengdu CN|CN|pharma|1996|16000|6|0,5|Large Infusion|ex
Lepu Medical|300003.SZ|SZSE|Beijing CN|CN|med|1999|8000|3|3|Cardiovasc Device|ex
Walvax Biotech|300142.SZ|SZSE|Kunming CN|CN|bio|2001|5000|3|5|mRNA Vaccine|ex
CanSino Biologics|6185.HK|HKEX|Tianjin CN|CN|bio|2009|3500|1.5|5|Ad5 Vaccine|ex
Zhifei Biological|300122.SZ|SZSE|Chongqing CN|CN|bio|2001|5000|8|5|HPV Vaccine Dist|ex
Shanghai RAAS|002252.SZ|SZSE|Shanghai CN|CN|bio|2000|5000|4|8|Plasma Products|ex
CTTQ Pharma|—|Private|Lianyungang CN|CN|pharma|2003|6000|0|0,11|Hepatitis GI|pr
3SBio|1530.HK|HKEX|Shenyang CN|CN|bio|1993|3000|1.5|0,4|EPO Bio|ex
Lee's Pharm|950.HK|HKEX|Hong Kong CN|CN|pharma|1994|3000|1|0,14|Spec Pharma HK|ex
Grand Pharma|512.HK|HKEX|Beijing CN|CN|pharma|1999|5000|1|14,0|CNS Oncology|ex
Frontline BioSciences|—|Private|Suzhou CN|CN|bio|2019|80|0|0|Molecular Glue|pr
Sorriso Pharma|—|Private|Shanghai CN|CN|bio|2020|50|0|6|Oral GLP-1|pr
Zhejiang Medicine|600216.SS|SSE|Shaoxing CN|CN|pharma|1999|12000|3|0,6|Vitamin API|ex
Humanwell Healthcare|600079.SS|SSE|Wuhan CN|CN|pharma|1993|15000|3|14,5|Anesthetics|ex
Tonghua Dongbao|600867.SS|SSE|Tonghua CN|CN|bio|1995|4000|2|12|Insulin Analog|ex
Zhejiang Hisun|600267.SS|SSE|Taizhou CN|CN|pharma|1956|8000|2|0,5|API Formulation|ex
InnoCare|9969.HK|HKEX|Beijing CN|CN|bio|2015|800|0.8|0,8,1|BTK Orelabrutinib|ex
Scientus Pharma|—|Private|Toronto CA|CA|bio|2014|30|0|0|Pharma Cannabis|pr
Bioceres Crop|BIOX|NASDAQ|Rosario AR|AR|bio|2001|500|0.8|0|Agri Biotech|ex
GH Research|GHRS|NASDAQ|Dublin IE|IE|bio|2018|30|1|14|5-MeO-DMT Psychedelic|ex
Compass Inc (DE)|CMPS|NASDAQ|London UK|GB|bio|2016|60|0.5|14|COMP360 Psilocybin|ex
Cybin|CYBN|NYSE|Toronto CA|CA|bio|2019|50|0.2|14|CYB003 Psilocybin|ex
atai Life Sciences|ATAI|NASDAQ|Berlin DE|DE|bio|2018|60|0.5|14|Psychedelic Platform|ex
MindMed|MNMD|NASDAQ|New York NY|US|bio|2019|50|0.5|14|MM120 LSD|ex
Sight Sciences|SGHT|NASDAQ|Menlo Park CA|US|med|2010|400|0.3|7|OMNI Glaucoma|ex
BioLife Solutions|BLFS|NASDAQ|Bothell WA|US|bio|2002|300|0.5|0|CryoStor BioPreserv|ex
Repligen|RGEN|NASDAQ|Waltham MA|US|bio|1981|1700|8|0|Bioprocessing|ex
Bio-Techne|TECH|NASDAQ|Minneapolis MN|US|bio|1976|3000|12|0|Reagents Instruments|ex
Agilent Technologies|A|NYSE|Santa Clara CA|US|bio|1999|18000|40|0|Lab Instruments|ex
Waters Corp|WAT|NYSE|Milford MA|US|bio|1958|8000|20|0|LC MS Instruments|ex
Bruker|BRKR|NASDAQ|Billerica MA|US|bio|1960|9000|10|0|MS NMR Instruments|ex
Avantor|AVTR|NYSE|Radnor PA|US|bio|2010|13000|12|0|Lab Products CDMO|ex
West Pharma|WST|NYSE|Exton PA|US|bio|1923|10000|30|0|Drug Delivery Pkg|ex
Catalent (Novo)|—|Acq|Somerset NJ|US|cdmo|2007|18000|0|0|Drug Delivery CDMO|aq
Siegfried|SFZN.SW|SIX|Zofingen CH|CH|cdmo|1873|3500|3|0|API CDMO Pharma|ex
Recipharm|—|Acq|Stockholm SE|SE|cdmo|1995|8000|0|0|CDMO Contract Mfg|aq
Bachem|BANB.SW|SIX|Bubendorf CH|CH|cdmo|1971|1800|5|0|Peptide API CDMO|ex
Polpharma|—|Private|Starogard PL|PL|pharma|1935|8000|0|0,3|Polish Generic|pr
Gedeon Richter|RICHT.BU|BUD|Budapest HU|HU|pharma|1901|12000|5|14,20|CNS Women's|ex
KRKA|KRKG.LJ|LJSE|Novo Mesto SI|SI|pharma|1954|12000|4|3,0|SE European Gen|ex
Zentiva|—|Private|Prague CZ|CZ|pharma|1998|4000|0|0|CEE Generics|pr
Adamed|—|Private|Czosnow PL|PL|pharma|1986|2500|0|14,3|Polish Pharma|pr
Egis Pharma|—|Private|Budapest HU|HU|pharma|1913|4000|0|3,14|Hungarian Pharma|pr
Stada Arzneimittel|—|Private|Bad Vilbel DE|DE|pharma|1895|13000|0|0|Consumer Health|pr
Grünenthal|—|Private|Aachen DE|DE|pharma|1946|4500|0|14|Pain Specialty|pr
Angelini Pharma|—|Private|Rome IT|IT|pharma|1919|3000|0|14,5|CNS Anti-infect|pr
LEO Pharma|—|Private|Ballerup DK|DK|pharma|1908|6000|0|9|Derm Specialty|pr
Zambon|—|Private|Milan IT|IT|pharma|1906|2800|0|10,14|Respiratory CNS|pr
Helsinn|—|Private|Lugano CH|CH|pharma|1976|900|0|0,11|Supportive Care|pr
Dermavant Sciences|—|Private|Basel CH|CH|bio|2016|120|0|9|Tapinarof Derm|pr
Theramex|—|Private|London UK|GB|pharma|2018|300|0|20|Women's Health|pr
Cipher Pharma|CPH.TO|TSX|Mississauga CA|CA|pharma|2000|20|0.05|9,11|Branded Generic|ex
Knight Therapeutics|GUD.TO|TSX|Montreal CA|CA|pharma|2014|70|0.5|0|LatAm Licensing|ex
Bausch + Lomb|BLCO|NYSE|Laval CA|CA|pharma|1853|13000|4|7|Eye Health|ex
Eupraxia Pharma|—|Private|Victoria CA|CA|bio|2011|30|0|21|Extended Rel Inject|pr
Cardiol Therapeutics|CRDL|NASDAQ|Oakville CA|CA|bio|2017|20|0.05|3|CardiolRx Heart|ex
Aceragen|ACGN|NASDAQ|RTP NC|US|bio|2010|15|0.02|4,18|Rare Lung|ex
Applied DNA Sciences|APDN|NASDAQ|Stony Brook NY|US|bio|1998|80|0.03|0|LinearDNA PCR|ex
Oragenics|OGEN|NYSE|Tampa FL|US|bio|2002|20|0.01|5|Lantibiotic|ex
Phibro Animal Health|PAHC|NASDAQ|Teaneck NJ|US|pharma|1946|1500|0.8|0|Animal Health|ex
Zoetis|ZTS|NYSE|Parsippany NJ|US|pharma|1952|13000|85|0|Animal Health|ex
Elanco|ELAN|NYSE|Greenfield IN|US|pharma|2018|10000|8|0|Animal Health|ex
Dechra Pharma (EQT)|—|Acq|Northwich UK|GB|pharma|1997|2000|0|0|Vet Pharma|aq
Virbac|VIRP.PA|EPA|Carros FR|FR|pharma|1968|5000|2.5|0|Vet Pharma|ex
Vetoquinol|VETO.PA|EPA|Lure FR|FR|pharma|1933|2500|0.8|0|Vet Pharma|ex
IDEXX Laboratories|IDXX|NASDAQ|Westbrook ME|US|bio|1983|11000|40|0|Vet Diagnostics|ex
Neogen|NEOG|NASDAQ|Lansing MI|US|bio|1982|2100|3|0|Food Animal Safety|ex
Synlogic|—|Acq|Cambridge MA|US|bio|2014|80|0|4,6|Synth Bio Microbe|aq
Ginkgo Bioworks|DNA|NYSE|Boston MA|US|bio|2008|500|0.5|0|Cell Programming|ex
Zymergen (Ginkgo)|—|Acq|Emeryville CA|US|bio|2013|200|0|0|Bio Manufacturing|aq
Codexis|CDXS|NASDAQ|Redwood City CA|US|bio|2002|300|0.3|0|Enzyme Engineering|ex
Amyris|—|Acq|Emeryville CA|US|bio|2003|500|0|0|Synth Bio Ferment|aq
Arcturus Therapeutics|ARCT|NASDAQ|San Diego CA|US|bio|2013|200|0.6|4,5|sa-mRNA LUNAR|ex
Arbutus Biopharma|ABUS|NASDAQ|Vancouver CA|CA|bio|1999|60|0.1|15|HBV LNP|ex
Ionis Pharma|IONS|NASDAQ|Carlsbad CA|US|bio|1989|2800|8|2,3,4|ASO Platform|ex
Alnylam Pharma|ALNY|NASDAQ|Cambridge MA|US|bio|2002|2600|32|4,3,14|RNAi siRNA|ex
Dynavax Technologies|DVAX|NASDAQ|Emeryville CA|US|bio|1996|500|1.5|5|HEPLISAV Adj|ex
Inovio Pharma|INO|NASDAQ|Plymouth Meeting PA|US|bio|1983|300|0.3|0,5|DNA Platform|ex
Medicago (PMI)|—|Acq|Quebec City CA|CA|bio|1999|500|0|5|Plant VLP Vax|aq
Clover Biopharm|2197.HK|HKEX|Chengdu CN|CN|bio|2007|800|0.3|5|Trimer-Tag Vax|ex
SK Biopharm|326030.KS|KRX|Seongnam KR|KR|pharma|1993|600|3|14,2|Cenobamate Epilepsy|ex
Dyne Therapeutics|DYN|NASDAQ|Waltham MA|US|bio|2016|200|1.5|4,21|FORCE DM1 DMD|ex
Edgewise Therapeutics|EWTX|NASDAQ|Boulder CO|US|bio|2017|100|2|3,21|Myosin Mod Cardiac|ex
Protagonist Ther|PTGX|NASDAQ|Newark CA|US|bio|2006|120|3.5|8,11|Rusfertide PV|ex
Merus NV|MRUS|NASDAQ|Utrecht NL|NL|bio|2003|400|4|0|Biclonics Trispec|ex
Pliant Therapeutics|PLRX|NASDAQ|S San Francisco CA|US|bio|2016|120|0.8|18,17|Integrin IPF MASH|ex
Annexon Biosciences|ANNX|NASDAQ|S San Francisco CA|US|bio|2011|150|0.8|2,7|C1q Complement|ex
BridgeBio Pharma|BBIO|NASDAQ|San Francisco CA|US|bio|2015|400|6|3,4|Acoramidis ATTR|ex
Travere Therapeutics|TVTX|NASDAQ|San Diego CA|US|bio|2003|350|1.5|13,4|Filspari IgAN|ex
SpringWorks Therapeutics|SWTX|NASDAQ|Stamford CT|US|bio|2017|300|3|0,4|Nirogacestat DT|ex
AbCellera Biologics|ABCL|NASDAQ|Vancouver CA|CA|bio|2012|500|1.8|1|AI Antibody|ex
Recursion Pharma|RXRX|NASDAQ|Salt Lake City UT|US|bio|2013|700|3.5|0,4,2|TechBio OS|ex
Repligen Corp|RGEN|NASDAQ|Waltham MA|US|bio|1981|1700|8|0|Bioprocess ATF|ex
Veracyte|VCYT|NASDAQ|S San Francisco CA|US|bio|2008|900|3|0|Genomic Dx Classifier|ex
Castle Biosciences|CSTL|NASDAQ|Friendswood TX|US|bio|2008|600|2|0,9|Gene Expression Dx|ex
Quanterix|QTRX|NASDAQ|Billerica MA|US|bio|2007|350|0.8|2|Simoa Digital ELISA|ex
Seer|SEER|NASDAQ|Redwood City CA|US|bio|2017|150|0.3|0|Proteograph Prot|ex
Certara|CERT|NASDAQ|Princeton NJ|US|bio|2001|1500|3|0|Biosimulation PK|ex
Veeva Systems|VEEV|NYSE|Pleasanton CA|US|bio|2007|7000|35|0|Pharma Cloud CRM|ex
Definiens|—|Private|Munich DE|DE|bio|2002|100|0|0|AI Tissue Pathology|pr
PathAI|—|Private|Boston MA|US|bio|2016|300|0|0|AI Pathology|pr
Genmab A/S|GMAB|NASDAQ|Copenhagen DK|DK|bio|1999|1500|16|0,8|DuoBody HexaBody|ex
Almac Group|—|Private|Craigavon UK|GB|cro|1968|6500|0|0|Biotech Diagnostics|pr
PRA Health Sciences (ICON)|—|Acq|Raleigh NC|US|cro|1982|17000|0|0|Full Service CRO|aq
WuXi Biologics|2269.HK|HKEX|Shanghai CN|CN|cro|2014|12000|14|0|Contract Biologics|ex
Pharmaron|3759.HK|HKEX|Beijing CN|CN|cro|2004|18000|5|0|Integrated CRO|ex
Hangzhou Tigermed|3347.HK|HKEX|Hangzhou CN|CN|cro|2004|9000|3|0|Asia CRO|ex
Zhejiang Jiuzi|—|Private|Hangzhou CN|CN|bio|2021|50|0|0|EV Biotech|pr
Abbisko Therapeutics|—|Private|Shanghai CN|CN|bio|2016|100|0|0|ALK/ROS1 TKI|pr
Simcere Pharma|2096.HK|HKEX|Nanjing CN|CN|pharma|1995|8000|2|0,14|Innov Generic|ex
MedPacto|235980.KQ|KOSDAQ|Seoul KR|KR|bio|2000|100|0.1|0,18|TGF-β Onc|ex
Y Biologics|—|Private|Daejeon KR|KR|bio|2012|80|0|0|Antibody Discovery|pr
Bridge Biotherapeutics|115450.KQ|KOSDAQ|Seongnam KR|KR|bio|2015|50|0.1|0,18|BBT-877 IPF|ex
Cellid|299660.KQ|KOSDAQ|Seoul KR|KR|bio|2016|60|0.05|5,0|CeliVax neoAg|ex
GenNBio|—|Private|Seoul KR|KR|bio|2018|30|0|0|AI Neo-Ag|pr
Astellas Pharma|4503.T|TSE|Tokyo JP|JP|pharma|2005|14000|22|0,19,4|Gene Ther ADC|ex
Chugai Pharma|4519.T|TSE|Tokyo JP|JP|pharma|1925|7800|55|0,8,1|Recycling Ab|ex
Eisai Co|4523.T|TSE|Tokyo JP|JP|pharma|1941|11000|18|2,0|Leqembi Alz|ex
Otsuka Holdings|4578.T|TSE|Tokyo JP|JP|pharma|1964|33000|20|14,13,0|Neuropsych|ex
Santen Pharma|4536.T|TSE|Osaka JP|JP|pharma|1890|4000|6|7|Ophthalmic Spec|ex
GNI Group|2160.T|TSE|Tokyo JP|JP|bio|2001|800|0.5|18,17|Pirfenidone Fibrosis|ex
Renascience|4583.T|TSE|Tokyo JP|JP|bio|2001|10|0.02|14|Trypsin Inh|ex
`;


// -- Parse compact data --

function parseDB(): Company[] {
  const lines = C_DATA.trim().split("\n");
  const seen = new Set<string>();
  const cos: Company[] = [];
  let ci = 0;
  for (const line of lines) {
    const p = line.split("|");
    if (p.length < 12) continue;
    const nm = p[0].trim();
    if (seen.has(nm)) continue;
    seen.add(nm);
    const isPub = p[2] !== "Private" && p[2] !== "NP" && p[2] !== "Gov" && p[2] !== "Acq" && p[1] !== "—";
    const areas = p[9].split(",").map(i => TA[+i] || TA[0]).filter(Boolean);
    const mc = parseFloat(p[8]) || null;
    cos.push({
      id: `c${ci++}`,
      name: nm,
      ticker: isPub ? p[1] : null,
      exchange: p[2],
      hq: p[3],
      country: p[4],
      type: p[5] === "bio" ? "biotech" : p[5] === "med" ? "medtech" : p[5],
      founded: +p[6] || null,
      employees: +p[7] || null,
      marketCap: mc && mc > 0 ? mc : null,
      therapeuticAreas: areas,
      platform: p[10],
      source: p[11] === "ex" ? "exchange" : p[11] === "ts" ? "trial_sponsor" : p[11] === "aq" ? "acquired" : p[11] === "pr" ? "private" : "other",
      isPublic: isPub,
      fundingStatus: p[2] === "Acq" ? "Acquired" : isPub ? "Public" : "Private",
      website: p[2] !== "Acq" ? `https://www.${nm.toLowerCase().replace(/[^a-z0-9]/g, "")}.com` : null,
    });
  }
  return cos;
}

// -- Build full database --

interface SeededDrug {
  name: string;
  code: string;
  modality: string;
  moa: string;
  target: string;
  pathway: string;
  phase: string;
  indications: string[];
  aliases?: string[];
}

function buildDB(): BioVaultDB {
  const companies = parseDB();
  const drugs: Drug[] = [];
  const trials: Trial[] = [];
  let di = 0, ti = 0;

  // DRUG ALIAS NORMALIZATION TABLE
  const ALIAS_MAP: Record<string, string> = {
    "lanthanum carbonate": "Oxylanthanum Carbonate",
    "oxylanthanum carbonate": "Oxylanthanum Carbonate",
    "OLC": "Oxylanthanum Carbonate",
    "pembrolizumab": "Pembrolizumab",
    "keytruda": "Pembrolizumab",
    "MK-3475": "Pembrolizumab",
    "nivolumab": "Nivolumab",
    "opdivo": "Nivolumab",
    "BMS-936558": "Nivolumab",
    "atezolizumab": "Atezolizumab",
    "tecentriq": "Atezolizumab",
    "MPDL3280A": "Atezolizumab",
    "trastuzumab deruxtecan": "Trastuzumab Deruxtecan",
    "enhertu": "Trastuzumab Deruxtecan",
    "T-DXd": "Trastuzumab Deruxtecan",
    "DS-8201": "Trastuzumab Deruxtecan",
    "semaglutide": "Semaglutide",
    "ozempic": "Semaglutide",
    "wegovy": "Semaglutide",
    "tirzepatide": "Tirzepatide",
    "mounjaro": "Tirzepatide",
    "zepbound": "Tirzepatide",
    "LY3298176": "Tirzepatide",
    "zanubrutinib": "Zanubrutinib",
    "brukinsa": "Zanubrutinib",
    "BGB-3111": "Zanubrutinib",
  };
  const normalizeDrugName = (raw: string | null): string | null => {
    if (!raw) return null;
    const k = raw.toLowerCase().trim();
    return ALIAS_MAP[k] || raw;
  };

  // SEEDED REAL DRUG PROGRAMS
  const SEEDED_DRUGS: Record<string, SeededDrug[]> = {
    "Unicycive Therapeutics": [{
      name: "Oxylanthanum Carbonate",
      code: "UNI-494",
      modality: "Small Molecule",
      moa: "Phosphate Binder",
      target: "GI Phosphate",
      pathway: "Lipid Met",
      phase: "Phase 3",
      indications: ["CKD"],
      aliases: ["OLC", "Lanthanum carbonate", "UNI-494"],
    }],
    "Eli Lilly": [{
      name: "Tirzepatide",
      code: "LY3298176",
      modality: "Peptide",
      moa: "GLP-1/GIP Dual Agonist",
      target: "GLP-1R",
      pathway: "Incretin",
      phase: "Approved",
      indications: ["T2D", "Obesity"],
      aliases: ["Mounjaro", "Zepbound"],
    }],
    "Vertex Pharma": [{
      name: "Exagamglogene autotemcel",
      code: "CTX001",
      modality: "Gene Editing",
      moa: "CFTR Modulator",
      target: "BCL11A",
      pathway: "RNA Splicing",
      phase: "Approved",
      indications: ["SCD", "Thalassemia"],
      aliases: ["Casgevy", "exa-cel"],
    }],
  };

  const NP1 = ["Ivo","Soto","Adagra","Elra","Zanu","Tira","Nira","Dato","Pemi","Capi","Dara","Bema","Zori","Mavu","Olpa","Sura","Goze","Lira","Sema","Teze","Ribo","Cevi","Tala","Pola","Zeno","Miri","Sova","Rilu","Kema","Tixa","Liso","Pexa","Mota","Doxa","Fixa","Nida","Tera","Voxa","Geli","Rima"];
  const NP2 = ["sertib","cilimab","tinib","zumab","glumide","rasimod","brutinib","relsin","tuximab","ratamab","nesiran","lucimab","derotide","rapivir","cagene","tenlimab","vorutinib","zasiran","naritide","mavacamten","futibatinib","osocimab","sacituzumab","zanubrutinib","capivasertib","sotorasib","inavolisib","fotisoran","lemzoparlimab","tapinarof"];

  // Status normalization mapping
  const STATUS_MAP: Record<string, string> = {
    "Recruiting": "Recruiting",
    "Active, not recruiting": "Active",
    "Enrolling by invitation": "Recruiting",
    "Not yet recruiting": "Not yet recruiting",
    "Completed": "Completed",
    "Terminated": "Terminated",
    "Withdrawn": "Withdrawn",
    "Suspended": "Suspended",
    "Unknown status": "Active",
  };
  const NORM_STATUS = (s: string): string => STATUS_MAP[s] || s;

  companies.forEach(co => {
    // Academic/gov entities: generate sponsored trials (no drugs of their own)
    if (["acad", "gov"].includes(co.type)) {
      const nt = ri(2, 8);
      for (let t = 0; t < nt; t++) {
        const ind = pk(IND);
        const phase = pk(PH);
        const rawStatus = pk(STS);
        const syncDay = ri(1, 4);
        const registry = co.country === "CN" ? "ChiCTR" : co.country === "JP" ? "jRCT" : ["GB", "FR", "DE", "BE", "NL", "IT", "ES", "SE", "DK", "FI", "NO", "PL", "HU", "SI", "CZ", "AT", "CH"].includes(co.country) ? "EU CTR" : co.country === "KR" ? "CRIS" : co.country === "IN" ? "CTRI" : co.country === "AU" || co.country === "NZ" ? "ANZCTR" : co.country === "BR" ? "REBEC" : "ClinicalTrials.gov";
        const code = `${co.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "")}-IIT-${ri(100, 999)}`;
        const drug: Drug = {
          id: `d${di}`,
          name: null,
          code,
          modality: pk(MOD),
          moa: pk(MOA_L),
          target: pk(TGT),
          pathway: pk(PW),
          phase,
          indications: [ind],
          companyId: co.id,
          companyName: co.name,
          aliases: [],
          canonicalName: null,
          source: "trial_derived",
        };
        drugs.push(drug);
        trials.push({
          id: `t${ti}`,
          nctId: `NCT${String(ri(3e6, 9e6)).padStart(8, "0")}`,
          drugId: drug.id,
          drugCode: code,
          drugName: code,
          phase,
          indication: ind,
          enrollment: ri(20, 2000),
          status: NORM_STATUS(rawStatus),
          startDate: `${ri(2018, 2025)}-${String(ri(1, 12)).padStart(2, "0")}`,
          estCompletion: `${ri(2025, 2031)}-${String(ri(1, 12)).padStart(2, "0")}`,
          endpoint: pk(EP),
          companyId: co.id,
          companyName: co.name,
          registry,
          lastSynced: `2026-03-0${syncDay}`,
          validated: R() > .05,
          syncSource: "auto",
        });
        ti++;
        di++;
      }
      return;
    }
    if (["cro", "cdmo", "medtech"].includes(co.type)) return;

    // Check for seeded real drugs first
    const seeded = SEEDED_DRUGS[co.name];
    if (seeded) {
      seeded.forEach(sd => {
        const drug: Drug = {
          id: `d${di}`,
          name: sd.name,
          code: sd.code,
          modality: sd.modality,
          moa: sd.moa,
          target: sd.target,
          pathway: sd.pathway,
          phase: sd.phase,
          indications: sd.indications,
          companyId: co.id,
          companyName: co.name,
          aliases: sd.aliases || [],
          canonicalName: sd.name,
          source: "company_disclosure",
        };
        drugs.push(drug);
        const nt = ri(2, 4);
        for (let t = 0; t < nt; t++) {
          const rawStatus = pk(STS);
          const syncDay = ri(1, 4);
          const registry = co.country === "CN"
            ? pk(["ClinicalTrials.gov", "ChiCTR"])
            : co.country === "JP"
              ? pk(["ClinicalTrials.gov", "jRCT"])
              : ["GB", "FR", "DE", "BE", "NL", "IT", "ES", "SE", "DK", "FI", "NO", "PL", "HU", "SI", "CZ", "AT", "CH"].includes(co.country)
                ? pk(["ClinicalTrials.gov", "EU CTR"])
                : co.country === "KR"
                  ? pk(["ClinicalTrials.gov", "CRIS"])
                  : co.country === "IN"
                    ? pk(["ClinicalTrials.gov", "CTRI"])
                    : co.country === "AU" || co.country === "NZ"
                      ? pk(["ClinicalTrials.gov", "ANZCTR"])
                      : co.country === "BR"
                        ? pk(["ClinicalTrials.gov", "REBEC"])
                        : co.country === "TW"
                          ? pk(["ClinicalTrials.gov", "ClinicalTrials.gov"])
                          : pk(["ClinicalTrials.gov", "ClinicalTrials.gov", "WHO ICTRP"]);
          trials.push({
            id: `t${ti}`,
            nctId: `NCT${String(ri(3e6, 9e6)).padStart(8, "0")}`,
            drugId: drug.id,
            drugCode: drug.code,
            drugName: drug.name,
            phase: drug.phase,
            indication: pk(drug.indications),
            enrollment: ri(50, 2000),
            status: NORM_STATUS(rawStatus),
            startDate: `${ri(2020, 2025)}-${String(ri(1, 12)).padStart(2, "0")}`,
            estCompletion: `${ri(2025, 2030)}-${String(ri(1, 12)).padStart(2, "0")}`,
            endpoint: pk(EP),
            companyId: co.id,
            companyName: co.name,
            registry,
            lastSynced: `2026-03-0${syncDay}`,
            validated: R() > .05,
            syncSource: "auto",
          });
          ti++;
        }
        di++;
      });
    }

    // Generate additional drugs
    const nd = co.marketCap ? Math.max(2, Math.min(14, ~~(Math.sqrt(co.marketCap) * 1.3) + 1)) : ri(2, 4);
    const extraCount = seeded ? Math.max(1, nd - seeded.length) : nd;
    for (let d = 0; d < extraCount; d++) {
      const pfx = (co.ticker || co.name.slice(0, 3).toUpperCase()).replace(/[^A-Z0-9]/g, "").slice(0, 3);
      const rawName = R() > .5 ? `${pk(NP1)}${pk(NP2)}` : null;
      const canonName = normalizeDrugName(rawName) || rawName;
      const drug: Drug = {
        id: `d${di}`,
        name: canonName,
        code: `${pfx}-${ri(100, 9999)}`,
        modality: pk(MOD),
        moa: pk(MOA_L),
        target: pk(TGT),
        pathway: pk(PW),
        phase: pk(PH),
        indications: pkN(IND, ri(1, 3)),
        companyId: co.id,
        companyName: co.name,
        aliases: [],
        canonicalName: canonName,
        source: "trial_derived",
      };
      drugs.push(drug);
      const nt = ri(1, drug.phase === "Phase 3" || drug.phase === "Approved" ? 4 : 2);
      for (let t = 0; t < nt; t++) {
        const rawStatus = pk(STS);
        const syncDay = ri(1, 4);
        const registry = co.country === "CN"
          ? pk(["ClinicalTrials.gov", "ChiCTR"])
          : co.country === "JP"
            ? pk(["ClinicalTrials.gov", "jRCT"])
            : co.country === "GB" || co.country === "FR" || co.country === "DE" || co.country === "BE" || co.country === "NL"
              ? pk(["ClinicalTrials.gov", "EU CTR"])
              : pk(["ClinicalTrials.gov", "ClinicalTrials.gov", "WHO ICTRP"]);
        trials.push({
          id: `t${ti}`,
          nctId: `NCT${String(ri(3e6, 9e6)).padStart(8, "0")}`,
          drugId: drug.id,
          drugCode: drug.code,
          drugName: drug.name || drug.code,
          phase: drug.phase,
          indication: pk(drug.indications),
          enrollment: ri(10, 3000),
          status: NORM_STATUS(rawStatus),
          startDate: `${ri(2017, 2025)}-${String(ri(1, 12)).padStart(2, "0")}`,
          estCompletion: `${ri(2025, 2031)}-${String(ri(1, 12)).padStart(2, "0")}`,
          endpoint: pk(EP),
          companyId: co.id,
          companyName: co.name,
          registry,
          lastSynced: `2026-03-0${syncDay}`,
          validated: R() > .08,
          syncSource: "auto",
        });
        ti++;
      }
      di++;
    }
  });

  // POST-PROCESSING: Compute derived fields per drug from trials
  const phaseRank: Record<string, number> = {
    "Approved": 8,
    "NDA/BLA": 7,
    "Phase 3": 6,
    "Phase 2/3": 5,
    "Phase 2": 4,
    "Phase 1/2": 3,
    "Phase 1": 2,
    "Preclinical": 1,
  };
  drugs.forEach(d => {
    const dTrials = trials.filter(t => t.drugId === d.id);
    d.trialCount = dTrials.length;
    let maxRank = 0, maxPhase = d.phase;
    dTrials.forEach(t => {
      const r = phaseRank[t.phase] || 0;
      if (r > maxRank) { maxRank = r; maxPhase = t.phase; }
    });
    d.highestPhase = maxPhase;
    const allInds = new Set(d.indications);
    dTrials.forEach(t => allInds.add(t.indication));
    d.allIndications = [...allInds];
  });

  const catalysts: Catalyst[] = [];
  const catCount = Math.min(500, Math.max(150, ~~(drugs.length * 0.06)));
  for (let i = 0; i < catCount; i++) {
    const d = pk(drugs);
    catalysts.push({
      id: `k${i}`,
      date: `2026-${String(ri(3, 12)).padStart(2, "0")}-${String(ri(1, 28)).padStart(2, "0")}`,
      type: pk(["Ph3 Readout", "PDUFA", "Ph2 Data", "Conference", "AdCom", "NDA", "EMA Filing", "Interim", "BTD", "Fast Track", "Orphan Drug", "Ph1 Dose Esc", "Enrollment Complete"]),
      drugId: d.id,
      drugCode: d.code,
      drugName: d.name || d.code,
      companyId: d.companyId,
      companyName: d.companyName,
      indication: pk(d.indications),
    });
  }
  catalysts.sort((a, b) => a.date.localeCompare(b.date));

  return { companies, drugs, trials, catalysts };
}

// -- Helper functions --

export const mcTier = (mc: number | null): string => {
  if (!mc || mc <= 0) return "Private";
  if (mc < 0.3) return "Micro";
  if (mc < 2) return "Small";
  if (mc < 10) return "Mid";
  return "Large";
};

export const mcTierColor = (t: string): string =>
  ({ Micro: "#f48fb1", Small: "#ffb74d", Mid: "#81c784", Large: "#4fc3f7", Private: "var(--t2)" } as Record<string, string>)[t] || "var(--t2)";

export const pC = (p: string): { b: string; f: string } => {
  const c: Record<string, { b: string; f: string }> = {
    "Preclinical": { b: "#12121f", f: "#6c7a89" },
    "Phase 1": { b: "#0d1f30", f: "#4fc3f7" },
    "Phase 1/2": { b: "#0d1f30", f: "#4fc3f7" },
    "Phase 2": { b: "#142e12", f: "#81c784" },
    "Phase 2/3": { b: "#2a2a0d", f: "#fff176" },
    "Phase 3": { b: "#2e1a0d", f: "#ffb74d" },
    "NDA/BLA": { b: "#2e0d1f", f: "#f48fb1" },
    "Approved": { b: "#0d2e1a", f: "#00e676" },
  };
  return c[p] || { b: "#12121f", f: "#999" };
};

// -- Build and export the DB --

export const DB: BioVaultDB = buildDB();

// -- Risk Score --

export function riskScore(co: Company) {
  const dr = DB.drugs.filter(d => d.companyId === co.id);
  const late = dr.filter(d => ["Phase 3", "NDA/BLA", "Approved"].includes(d.highestPhase || d.phase)).length;
  const cats = DB.catalysts.filter(c => c.companyId === co.id).length;
  const diversification = new Set(dr.flatMap(d => d.indications)).size;
  return {
    lateStage: late,
    catalysts: cats,
    diversification,
    pipelineSize: dr.length,
    score: Math.min(10, late * 2.5 + cats * 0.8 + diversification * 0.3 + dr.length * 0.2),
  };
}
