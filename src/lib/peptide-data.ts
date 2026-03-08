// ═══════════════════════════════════════════════════════════════════════
// PEPTIDE DATA MODULE — Therapeutic Peptides Knowledge Base
// Interfaces, Seed Data, Educational Data Merge
// ═══════════════════════════════════════════════════════════════════════

import { DB } from "./biovault-data";
import { PEPTIDE_EDUCATION } from "./peptide-education-data";

// ── Controlled Vocabularies ──

export const PEPTIDE_CLASSES = [
  "GLP-1 Agonist", "Somatostatin Analog", "CGRP Antagonist", "Vasopressin Analog",
  "Oxytocin Analog", "Integrin Antagonist", "Natriuretic Peptide", "Antimicrobial Peptide",
  "Neuropeptide", "Opioid Peptide", "Melanocortin Agonist", "Calcitonin Analog",
  "PTH Analog", "Insulin Analog", "GnRH Analog", "Proteasome Inhibitor",
  "Guanylate Cyclase Agonist", "BPI Mimetic", "Amylin Analog", "Endothelin Antagonist",
  "Growth Hormone Secretagogue", "Growth Hormone Releasing Peptide",
] as const;

export const PEPTIDE_CLASSIFICATIONS = ["Therapeutic", "Diagnostic", "Research"] as const;

export const PEPTIDE_MODIFICATIONS = [
  "Lipidation", "PEGylation", "Cyclization", "Stapling", "D-Amino Acid Substitution",
  "N-Methylation", "Disulfide Bridge", "Acylation", "Albumin Binding", "Fc Fusion",
  "Unnatural Amino Acids", "Backbone Modification",
] as const;

export const PEPTIDE_ROUTES = [
  "SC Injection", "IV Infusion", "Oral", "Intranasal", "Topical",
  "Intramuscular", "Intrathecal", "Inhalation",
] as const;

export const MFG_CAPABILITIES = [
  "SPPS", "LPPS", "GMP Manufacturing", "Custom Synthesis", "Scale-Up",
  "Flow Chemistry", "Peptide-Drug Conjugates", "Modified Peptides",
  "Long Peptides (>50aa)", "cGMP Fill-Finish", "Analytical Development",
  "Process Development", "Lyophilization",
] as const;

export const TARGET_FAMILIES = [
  "GPCR", "Ion Channel", "Enzyme", "Nuclear Receptor",
  "Transporter", "Receptor Tyrosine Kinase", "Protease",
] as const;

export const PEPTIDE_USE_CASES = [
  "Recovery", "Muscle Growth", "Fat Loss", "Anti-Aging", "Cognitive Support",
  "Gut Health", "Joint Support", "Immune Support", "Sleep", "Sexual Health",
  "Skin Health", "Hair Growth", "Metabolic Health", "Bone Health",
  "Cardiovascular", "Neuroprotection", "Anti-Inflammatory", "Wound Healing",
] as const;

// ── Interfaces ──

export interface Peptide {
  id: string;
  name: string;
  aliases: string[];
  classification: string;
  class: string;
  targetIds: string[];
  manufacturerIds: string[];
  residues: number;
  molecularWeight: number;
  route: string;
  halfLife: string;
  stability: string;
  modifications: string[];
  indications: string[];
  phase: string;
  approvalYear: number | null;
  description: string;
  source: string;
  drugIds: string[];
  companyIds: string[];
  // Educational fields
  primaryBenefit: string;
  shortSummary: string;
  benefits: string;
  administrationMethod: string;
  administrationDetails: string;
  storage: string;
  mechanism: string;
  useCases: string[];
  stacks: string[];
  safetyNotes: string;
  researchBackground: string;
  relatedPeptideIds: string[];
}

export interface PeptideTarget {
  id: string;
  name: string;
  fullName: string;
  family: string;
  pathway: string;
  peptideIds: string[];
  drugTargetName: string | null;
  description: string;
}

export interface PeptideManufacturer {
  id: string;
  name: string;
  hq: string;
  country: string;
  type: string;
  capabilities: string[];
  peptideIds: string[];
  companyId: string | null;
  founded: number | null;
  website: string | null;
  specialties: string[];
}

export interface PeptideDB {
  peptides: Peptide[];
  targets: PeptideTarget[];
  manufacturers: PeptideManufacturer[];
}

// ── Seed Data: Targets ──
// Format: name|fullName|family|pathway|drugTargetName|description

const TARGET_SEED = `GLP-1R|Glucagon-Like Peptide 1 Receptor|GPCR|Incretin|GLP-1R|Key regulator of insulin secretion and glucose metabolism
GIP-R|Glucose-Dependent Insulinotropic Polypeptide Receptor|GPCR|Incretin|GIP-R|Mediates incretin effect on insulin release and energy balance
SSTR2|Somatostatin Receptor Type 2|GPCR|Somatostatin|null|Primary target for somatostatin analogs in neuroendocrine tumors
SSTR5|Somatostatin Receptor Type 5|GPCR|Somatostatin|null|Modulates growth hormone and insulin secretion
CGRP-R|Calcitonin Gene-Related Peptide Receptor|GPCR|Pain Signaling|CGRP|Central mediator of migraine pathophysiology
GnRH-R|Gonadotropin-Releasing Hormone Receptor|GPCR|HPG Axis|null|Controls reproductive hormone release from pituitary
MC4R|Melanocortin 4 Receptor|GPCR|Melanocortin|null|Central regulator of appetite and energy homeostasis
PTH1R|Parathyroid Hormone 1 Receptor|GPCR|Calcium Homeostasis|null|Regulates calcium and phosphate metabolism in bone
GC-C|Guanylate Cyclase C|Enzyme|cGMP Signaling|null|Intestinal receptor regulating fluid secretion and visceral pain
CaSR|Calcium-Sensing Receptor|GPCR|Calcium Homeostasis|null|Monitors extracellular calcium levels in parathyroid
V2R|Vasopressin V2 Receptor|GPCR|Water Balance|null|Mediates antidiuretic effect in renal collecting ducts
OTR|Oxytocin Receptor|GPCR|Neuroendocrine|null|Involved in social bonding, uterine contraction, and lactation
NK1R|Neurokinin 1 Receptor|GPCR|Nociception|null|Substance P receptor involved in pain and emesis
Proteasome 20S|20S Proteasome Complex|Enzyme|Proteasome|null|Core catalytic complex for intracellular protein degradation
CTR|Calcitonin Receptor|GPCR|Calcium Homeostasis|null|Mediates calcitonin effects on osteoclast inhibition
NPR-A|Natriuretic Peptide Receptor A|Enzyme|Natriuretic|null|Receptor for ANP and BNP regulating blood pressure
Integrin αIIbβ3|Glycoprotein IIb/IIIa|Receptor Tyrosine Kinase|Coagulation|null|Fibrinogen receptor on platelets mediating aggregation
AMYR|Amylin Receptor|GPCR|Glucose Metabolism|null|Calcitonin receptor complex modulating gastric emptying
ETR-A|Endothelin Receptor Type A|GPCR|Vasoconstriction|null|Mediates endothelin-1 induced vasoconstriction
N-type Ca|N-Type Calcium Channel|Ion Channel|Pain Signaling|null|Voltage-gated calcium channel in dorsal horn nociception
GHRH-R|Growth Hormone Releasing Hormone Receptor|GPCR|GHRH|null|Mediates growth hormone release from anterior pituitary somatotrophs
GHS-R|Growth Hormone Secretagogue Receptor|GPCR|Ghrelin|null|Receptor for ghrelin and synthetic growth hormone secretagogues
KISS1R|Kisspeptin Receptor|GPCR|HPG Axis|null|Key regulator of GnRH neuron activity and pubertal development`;

// ── Seed Data: Manufacturers ──
// Format: name|hq|country|type|founded|website|specialties (;-separated)|capabilities (;-separated)

const MFG_SEED = `Bachem|Bubendorf CH|CH|CDMO|1971|bachem.com|Long peptides;GLP-1 analogs;Complex modifications|SPPS;LPPS;GMP Manufacturing;Scale-Up;Process Development;Analytical Development
PolyPeptide Group|Malmö SE|SE|CDMO|1996|polypeptide.com|Generic APIs;Complex peptides;High-volume GMP|SPPS;LPPS;GMP Manufacturing;Custom Synthesis;Scale-Up;cGMP Fill-Finish
Lonza|Basel CH|CH|CDMO|1897|lonza.com|Mammalian expression;Peptide-ADC;Bioconjugation|GMP Manufacturing;Custom Synthesis;Scale-Up;Peptide-Drug Conjugates;Lyophilization
Corden Pharma|Basel CH|CH|CDMO|2006|cordenpharma.com|Lipid nanoparticles;GMP peptides;Injectables|SPPS;GMP Manufacturing;Scale-Up;cGMP Fill-Finish;Process Development
AmbioPharm|North Augusta US|US|API Manufacturer|2005|ambiopharm.com|GMP peptide APIs;Custom peptides;Large-scale|SPPS;LPPS;GMP Manufacturing;Custom Synthesis;Scale-Up
GenScript|Piscataway US|CN|Research Supplier|2002|genscript.com|Peptide libraries;Custom synthesis;Antibody services|SPPS;Custom Synthesis;Modified Peptides;Analytical Development
CPC Scientific|Sunnyvale US|US|API Manufacturer|2000|cpcscientific.com|GMP peptides;Cosmetic peptides;Research grade|SPPS;GMP Manufacturing;Custom Synthesis;Modified Peptides
Pepscan|Lelystad NL|NL|Research Supplier|1999|pepscan.com|Peptide arrays;CLIPS technology;Epitope mapping|Custom Synthesis;Modified Peptides;Analytical Development;Long Peptides (>50aa)
Zealand Pharma|Glostrup DK|DK|Pharma|1998|zealandpharma.com|GLP-1/GLP-2 analogs;Amylin analogs;Peptide discovery|SPPS;Custom Synthesis;Process Development;Modified Peptides
Protagonist Therapeutics|Newark US|US|Pharma|2006|protagonist-inc.com|Oral peptides;Constrained peptides;IL-17/IL-23|SPPS;Custom Synthesis;Modified Peptides;Long Peptides (>50aa)
Ferring Pharmaceuticals|Saint-Prex CH|CH|Pharma|1950|ferring.com|Reproductive peptides;Gastro peptides|GMP Manufacturing;Scale-Up;cGMP Fill-Finish;Lyophilization
Novo Nordisk|Bagsværd DK|DK|Pharma|1923|novonordisk.com|GLP-1 therapeutics;Insulin analogs;Obesity peptides|GMP Manufacturing;Scale-Up;Process Development;cGMP Fill-Finish
Ipsen|Paris FR|FR|Pharma|1929|ipsen.com|Somatostatin analogs;Neurotoxins;Rare disease|GMP Manufacturing;Scale-Up;Lyophilization;cGMP Fill-Finish
Amgen|Thousand Oaks US|US|Pharma|1980|amgen.com|Biologics;Biosimilars;Peptide therapeutics|GMP Manufacturing;Scale-Up;cGMP Fill-Finish;Process Development
Tate & Lyle (Peptisyntha)|Brussels BE|BE|CDMO|1987|null|GMP peptide manufacturing;European supply|SPPS;LPPS;GMP Manufacturing;Scale-Up;Custom Synthesis`;

// ── Seed Data: Peptides ──
// Format: name|aliases(;)|classification|class|targetId(idx)|mfgId(idx)|residues|mw|route|halfLife|stability|modifications(;)|indications(;)|phase|approvalYear|description

const PEPTIDE_SEED = `Semaglutide|Ozempic;Wegovy;Rybelsus|Therapeutic|GLP-1 Agonist|0|11|31|4113|SC Injection|168h|High|Acylation;Albumin Binding|T2D;Obesity;NASH|Approved|2017|GLP-1 receptor agonist with extended half-life via albumin binding for once-weekly dosing
Tirzepatide|Mounjaro;Zepbound|Therapeutic|GLP-1 Agonist|0,1|11|39|4813|SC Injection|120h|High|Acylation;Lipidation|T2D;Obesity;Heart Failure|Approved|2022|Dual GLP-1/GIP receptor agonist with superior glycemic and weight outcomes
Octreotide|Sandostatin;Sandostatin LAR|Therapeutic|Somatostatin Analog|2|12|8|1019|SC Injection|1.5h|Moderate|Cyclization;D-Amino Acid Substitution|Acromegaly;NETs;Carcinoid|Approved|1988|Synthetic somatostatin analog with selective SSTR2/5 binding
Liraglutide|Victoza;Saxenda|Therapeutic|GLP-1 Agonist|0|11|31|3751|SC Injection|13h|High|Acylation;Lipidation|T2D;Obesity|Approved|2010|Acylated GLP-1 analog with albumin binding for once-daily administration
Leuprolide|Lupron;Eligard|Therapeutic|GnRH Analog|5|13|9|1209|SC Injection;Intramuscular|3h|Moderate|D-Amino Acid Substitution|Prostate Ca;Endometriosis;Precocious Puberty|Approved|1985|GnRH superagonist that downregulates pituitary gonadotropin release
Exenatide|Byetta;Bydureon|Therapeutic|GLP-1 Agonist|0|4|39|4186|SC Injection|2.4h|Moderate|none|T2D|Approved|2005|Exendin-4 based GLP-1 receptor agonist from Gila monster venom
Ziconotide|Prialt|Therapeutic|Neuropeptide|19|3|25|2639|Intrathecal|4.5h|Low|Cyclization;Disulfide Bridge|Chronic Pain;Neuropathic Pain|Approved|2004|Synthetic ω-conotoxin blocking N-type calcium channels for severe chronic pain
Carfilzomib|Kyprolis|Therapeutic|Proteasome Inhibitor|13|13|4|719|IV Infusion|<1h|Moderate|none|MM;Relapsed MM|Approved|2012|Irreversible proteasome inhibitor with improved selectivity over bortezomib
Bortezomib|Velcade|Therapeutic|Proteasome Inhibitor|13|13|2|384|IV Infusion;SC Injection|9h|High|Backbone Modification|MM;MCL|Approved|2003|First-in-class reversible proteasome inhibitor for multiple myeloma
Linaclotide|Linzess;Constella|Therapeutic|Guanylate Cyclase Agonist|8|4|14|1526|Oral|4h|Moderate|Cyclization;Disulfide Bridge|IBS-C;CIC;Chronic Constipation|Approved|2012|Guanylate cyclase-C agonist reducing visceral pain and promoting intestinal secretion
Pasireotide|Signifor|Therapeutic|Somatostatin Analog|2,3|12|6|1047|SC Injection;Intramuscular|12h|Moderate|Cyclization;Unnatural Amino Acids|Cushing's Disease;Acromegaly|Approved|2012|Multi-receptor somatostatin analog with high SSTR5 affinity
Abaloparatide|Tymlos|Therapeutic|PTH Analog|7|4|34|3960|SC Injection|1h|Moderate|none|Osteoporosis|Approved|2017|PTHrP analog activating PTH1R with reduced hypercalcemia risk
Setmelanotide|Imcivree|Therapeutic|Melanocortin Agonist|6|8|8|1117|SC Injection|11h|Moderate|Cyclization;Disulfide Bridge|Genetic Obesity;POMC Deficiency|Approved|2020|MC4R agonist for rare genetic obesity caused by POMC/PCSK1/LEPR deficiency
Dulaglutide|Trulicity|Therapeutic|GLP-1 Agonist|0|13|30|3584|SC Injection|120h|High|Fc Fusion|T2D;CV Risk Reduction|Approved|2014|GLP-1-Fc fusion peptide enabling once-weekly dosing
Teriparatide|Forteo|Therapeutic|PTH Analog|7|10|34|4117|SC Injection|1h|Low|none|Osteoporosis|Approved|2002|Recombinant PTH(1-34) fragment stimulating osteoblast bone formation
Desmopressin|DDAVP;Stimate;Nocdurna|Therapeutic|Vasopressin Analog|10|10|9|1069|Intranasal;Oral|2.5h|Moderate|D-Amino Acid Substitution;Backbone Modification|Central Diabetes Insipidus;Nocturia;Hemophilia A|Approved|1978|Synthetic vasopressin analog with selective V2R agonism and no vasopressor effect
Calcitonin-Salmon|Miacalcin;Fortical|Therapeutic|Calcitonin Analog|14|3|32|3431|Intranasal;SC Injection|1h|Low|none|Osteoporosis;Paget's Disease|Approved|1975|Salmon calcitonin peptide inhibiting osteoclast-mediated bone resorption
Lanreotide|Somatuline|Therapeutic|Somatostatin Analog|2|12|8|1096|SC Injection|23d|High|Cyclization;D-Amino Acid Substitution|Acromegaly;NETs;Carcinoid|Approved|2007|Long-acting somatostatin analog with deep SC depot formulation
Goserelin|Zoladex|Therapeutic|GnRH Analog|5|4|10|1269|SC Injection|4.2h|Moderate|D-Amino Acid Substitution;Backbone Modification|Prostate Ca;Breast Ca;Endometriosis|Approved|1989|GnRH superagonist implant for hormone-dependent cancers
Degarelix|Firmagon|Therapeutic|GnRH Analog|5|10|10|1630|SC Injection|53d|High|D-Amino Acid Substitution;Unnatural Amino Acids|Prostate Ca|Approved|2008|GnRH antagonist with immediate testosterone suppression without flare
Pramlintide|Symlin|Therapeutic|Amylin Analog|17|13|37|3949|SC Injection|0.8h|Low|none|T1D;T2D|Approved|2005|Synthetic amylin analog slowing gastric emptying and reducing postprandial glucose
Nesiritide|Natrecor|Therapeutic|Natriuretic Peptide|15|13|32|3464|IV Infusion|0.3h|Low|none|Acute Heart Failure|Approved|2001|Recombinant BNP for acute decompensated heart failure
Eptifibatide|Integrilin|Therapeutic|Integrin Antagonist|16|6|7|831|IV Infusion|2.5h|Moderate|Cyclization;D-Amino Acid Substitution|ACS;PCI|Approved|1998|Cyclic peptide GPIIb/IIIa inhibitor preventing platelet aggregation
Teduglutide|Gattex;Revestive|Therapeutic|GLP-1 Agonist|0|11|33|3752|SC Injection|2h|Moderate|none|Short Bowel Syndrome|Approved|2012|GLP-2 analog promoting intestinal mucosal growth and nutrient absorption
Icatibant|Firazyr|Therapeutic|Neuropeptide|12|0|10|1304|SC Injection|1.4h|Moderate|D-Amino Acid Substitution;Unnatural Amino Acids|Hereditary Angioedema|Approved|2011|Bradykinin B2 receptor antagonist for acute HAE attacks
Afamelanotide|Scenesse|Therapeutic|Melanocortin Agonist|6|3|13|1647|SC Injection|0.5h|Moderate|none|EPP;Vitiligo|Approved|2019|Alpha-MSH analog stimulating melanogenesis for erythropoietic protoporphyria
Survodutide|BI 456906|Therapeutic|GLP-1 Agonist|0,1|0|30|3480|SC Injection|156h|High|Acylation;Albumin Binding|Obesity;NASH;T2D|Phase 3|null|Dual glucagon/GLP-1 receptor agonist for obesity and metabolic liver disease
Pemvidutide|ALT-801|Therapeutic|GLP-1 Agonist|0,1|0|29|3311|SC Injection|144h|High|Acylation;Lipidation|NASH;Obesity|Phase 2|null|GLP-1/glucagon dual agonist optimized for liver fat reduction
Retatrutide|LY3437943|Therapeutic|GLP-1 Agonist|0,1|11|39|4706|SC Injection|168h|High|Acylation;Albumin Binding|Obesity;T2D;Sleep Apnea|Phase 3|null|Triple incretin agonist targeting GLP-1/GIP/glucagon receptors
Orforglipron|LY3502970|Therapeutic|GLP-1 Agonist|0|11|0|554|Oral|25h|High|N-Methylation;Backbone Modification|T2D;Obesity|Phase 3|null|Non-peptide oral GLP-1 receptor agonist with small-molecule-like properties
Imeglimin|Twymeeg|Therapeutic|GLP-1 Agonist|0|6|0|209|Oral|5h|High|Backbone Modification|T2D|Approved|2021|Novel oral anti-diabetic targeting mitochondrial bioenergetics
CagriSema|NN9535+NN9838|Therapeutic|Amylin Analog|0,17|11|37|4018|SC Injection|168h|High|Acylation;Albumin Binding|Obesity;T2D|Phase 3|null|Fixed-dose combination of semaglutide and cagrilintide (amylin analog)
Rusfertide|PTG-300|Therapeutic|BPI Mimetic|17|9|22|2567|SC Injection|40h|Moderate|PEGylation;Cyclization|PV;Hemochromatosis|Phase 3|null|Hepcidin mimetic peptide reducing iron-driven erythrocytosis
Zilucoplan|RA101495|Therapeutic|Neuropeptide|14|4|15|1782|SC Injection|25h|Moderate|Cyclization;PEGylation|MG;PNH;NMOSD|Approved|2023|Macrocyclic peptide complement C5 inhibitor for myasthenia gravis
Difelikefalin|Korsuva|Therapeutic|Opioid Peptide|19|3|4|579|IV Infusion|2h|Moderate|D-Amino Acid Substitution|CKD-Associated Pruritus;Prurigo Nodularis|Approved|2021|Peripherally acting kappa opioid receptor agonist for itch
BPC-157|Body Protection Compound-157|Research|Neuropeptide|99|5|15|1419|SC Injection;Oral|2h|Moderate|none|Gut Healing;Tendon Repair;Wound Healing|Research|null|Gastric pentadecapeptide with broad tissue-protective and regenerative properties
TB-500|Thymosin Beta-4 Fragment|Research|Neuropeptide|99|5|43|4963|SC Injection|2h|Moderate|none|Tissue Repair;Inflammation;Wound Healing|Research|null|Synthetic fragment of thymosin beta-4 promoting tissue repair and reducing inflammation
Thymosin Beta-4|Tβ4|Research|Neuropeptide|99|5|43|4963|SC Injection|2h|Low|none|Wound Healing;Tissue Repair;Cell Migration|Research|null|Naturally occurring peptide involved in tissue repair cell migration and anti-inflammatory processes
Thymosin Alpha-1|Zadaxin;Tα1|Therapeutic|Neuropeptide|99|6|28|3108|SC Injection|2h|Moderate|none|Immune Modulation;Hepatitis B;Hepatitis C|Approved|1999|Thymic peptide that enhances immune function by modulating T-cell and dendritic cell activity
CJC-1295|CJC-1295 DAC;Modified GRF 1-29|Research|Growth Hormone Secretagogue|20|5|30|3367|SC Injection|8d|High|Lipidation|Growth Hormone Deficiency;Anti-Aging|Research|null|Synthetic GHRH analog with Drug Affinity Complex for extended growth hormone release
Ipamorelin|NNC 26-0161|Research|Growth Hormone Releasing Peptide|21|6|5|711|SC Injection|2h|Moderate|none|Growth Hormone Release;Recovery;Anti-Aging|Research|null|Selective growth hormone secretagogue with minimal effect on cortisol and prolactin
AOD-9604|Anti-Obesity Drug 9604|Research|Neuropeptide|99|5|16|1815|SC Injection|1h|Moderate|none|Fat Loss;Metabolism|Research|null|Modified fragment of human growth hormone (hGH 177-191) studied for fat metabolism
GHK-Cu|Copper Peptide GHK|Research|Neuropeptide|99|6|3|403|Topical;SC Injection|1h|Moderate|none|Skin Rejuvenation;Wound Healing;Hair Growth|Research|null|Tripeptide-copper complex with tissue remodeling and anti-aging properties
PT-141|Bremelanotide;Vyleesi|Therapeutic|Melanocortin Agonist|6|9|7|1025|SC Injection|2.7h|Moderate|Cyclization|Hypoactive Sexual Desire Disorder|Approved|2019|Melanocortin receptor agonist for hypoactive sexual desire disorder in premenopausal women
DSIP|Delta Sleep-Inducing Peptide|Research|Neuropeptide|99|5|9|848|SC Injection;IV Infusion|0.25h|Low|none|Insomnia;Sleep Disorders|Research|null|Neuropeptide originally isolated from rabbit brain involved in sleep regulation
Melanotan II|MT-II|Research|Melanocortin Agonist|6|6|7|1024|SC Injection|1h|Moderate|Cyclization|Skin Tanning;Sexual Dysfunction|Research|null|Synthetic analog of alpha-melanocyte stimulating hormone with broad melanocortin receptor activity
MOTS-c|Mitochondrial ORF of Twelve S rRNA Type-c|Research|Neuropeptide|99|5|16|2174|SC Injection|2h|Moderate|none|Metabolic Regulation;Exercise Mimetic|Research|null|Mitochondrial-derived peptide that regulates metabolic homeostasis and insulin sensitivity
Kisspeptin|Kisspeptin-54;Metastin|Research|Neuropeptide|22|5|54|5861|IV Infusion;SC Injection|0.5h|Low|none|Reproductive Function;Puberty|Research|null|Hypothalamic neuropeptide that stimulates GnRH release and regulates reproductive function
Sermorelin|Geref;GRF 1-29|Therapeutic|Growth Hormone Secretagogue|20|10|29|3357|SC Injection|0.2h|Low|none|Growth Hormone Deficiency;Anti-Aging|Approved|1997|Synthetic analog of growth hormone releasing hormone fragment 1-29
Tesamorelin|Egrifta|Therapeutic|Growth Hormone Secretagogue|20|0|44|5135|SC Injection|0.4h|Moderate|none|HIV Lipodystrophy;Abdominal Fat|Approved|2010|Synthetic GHRH analog for reducing excess abdominal fat in HIV-associated lipodystrophy
Epitalon|Epithalon;Epithalone|Research|Neuropeptide|99|5|4|390|SC Injection|2h|Moderate|none|Anti-Aging;Telomere Elongation|Research|null|Synthetic tetrapeptide based on epithalamin studied for telomerase activation
LL-37|Cathelicidin|Research|Antimicrobial Peptide|99|5|37|4493|Topical;SC Injection|1h|Low|none|Antimicrobial;Wound Healing;Immune Modulation|Research|null|Human cathelicidin antimicrobial peptide with broad-spectrum antimicrobial and immunomodulatory properties
Selank|TP-7|Therapeutic|Neuropeptide|99|6|7|751|Intranasal|1h|Moderate|none|Anxiety;Cognitive Enhancement|Approved|2009|Synthetic analog of tuftsin with anxiolytic and nootropic properties
Semax|ACTH 4-10 Analog|Therapeutic|Neuropeptide|99|6|7|813|Intranasal|1h|Moderate|none|Cognitive Enhancement;Neuroprotection|Approved|2011|Synthetic analog of ACTH fragment 4-10 with neuroprotective and cognitive-enhancing properties
Gonadorelin|Factrel;Lutrepulse|Therapeutic|GnRH Analog|5|10|10|1182|SC Injection;IV Infusion|0.2h|Low|none|Hypogonadism;Fertility Testing|Approved|1982|Synthetic gonadotropin-releasing hormone for diagnostic and therapeutic use`;

// ── Build Functions ──

function parseTargets(): PeptideTarget[] {
  return TARGET_SEED.trim().split("\n").map((line, i) => {
    const p = line.split("|");
    return {
      id: `ptgt-${i}`,
      name: p[0],
      fullName: p[1],
      family: p[2],
      pathway: p[3],
      peptideIds: [],
      drugTargetName: p[4] === "null" ? null : p[4],
      description: p[5],
    };
  });
}

function parseManufacturers(): PeptideManufacturer[] {
  return MFG_SEED.trim().split("\n").map((line, i) => {
    const p = line.split("|");
    const specs = p[6].split(";");
    const caps = p[7].split(";");
    // Try to find matching company in main DB
    const mfgName = p[0].split(" (")[0]; // strip parenthetical
    const match = DB.companies.find(c =>
      c.name.toLowerCase().includes(mfgName.toLowerCase()) ||
      mfgName.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])
    );
    return {
      id: `pmfg-${i}`,
      name: p[0],
      hq: p[1],
      country: p[2],
      type: p[3],
      founded: parseInt(p[4]) || null,
      website: p[5] === "null" ? null : p[5],
      specialties: specs,
      capabilities: caps,
      peptideIds: [],
      companyId: match?.id || null,
    };
  });
}

function parsePeptides(targets: PeptideTarget[], mfgs: PeptideManufacturer[]): Peptide[] {
  return PEPTIDE_SEED.trim().split("\n").map((line, i) => {
    const p = line.split("|");
    const aliases = p[1] === "none" ? [] : p[1].split(";");
    const tgtIdxs = p[4].split(",").map(Number);
    const mfgIdxs = p[5].split(",").map(Number);
    const mods = p[11] === "none" ? [] : p[11].split(";");
    const inds = p[12].split(";");
    const approvalYear = p[14] === "null" ? null : parseInt(p[14]);

    return {
      id: `pep-${i}`,
      name: p[0],
      aliases,
      classification: p[2],
      class: p[3],
      targetIds: tgtIdxs.map(idx => targets[idx]?.id).filter(Boolean),
      manufacturerIds: mfgIdxs.map(idx => mfgs[idx]?.id).filter(Boolean),
      residues: parseInt(p[6]) || 0,
      molecularWeight: parseInt(p[7]) || 0,
      route: p[8],
      halfLife: p[9],
      stability: p[10],
      modifications: mods,
      indications: inds,
      phase: p[13],
      approvalYear,
      description: p[15] || "",
      source: "curated",
      drugIds: [],
      companyIds: [],
      // Educational defaults (merged later)
      primaryBenefit: "",
      shortSummary: "",
      benefits: "",
      administrationMethod: "",
      administrationDetails: "",
      storage: "",
      mechanism: "",
      useCases: [],
      stacks: [],
      safetyNotes: "",
      researchBackground: "",
      relatedPeptideIds: [],
    };
  });
}

// ── Educational Data Merge ──

function mergeEducationalData(peptides: Peptide[]): void {
  for (const pep of peptides) {
    const edu = PEPTIDE_EDUCATION[pep.name];
    if (edu) {
      pep.primaryBenefit = edu.primaryBenefit;
      pep.shortSummary = edu.shortSummary;
      pep.benefits = edu.benefits;
      pep.administrationMethod = edu.administrationMethod;
      pep.administrationDetails = edu.administrationDetails;
      pep.storage = edu.storage;
      pep.mechanism = edu.mechanism;
      pep.useCases = edu.useCases;
      pep.stacks = edu.stacks;
      pep.safetyNotes = edu.safetyNotes;
      pep.researchBackground = edu.researchBackground;
    }
  }
}

function resolveRelatedPeptides(peptides: Peptide[]): void {
  const nameToId = new Map<string, string>();
  for (const pep of peptides) nameToId.set(pep.name, pep.id);
  for (const pep of peptides) {
    const edu = PEPTIDE_EDUCATION[pep.name];
    if (edu?.relatedPeptideNames) {
      pep.relatedPeptideIds = edu.relatedPeptideNames
        .map(name => nameToId.get(name))
        .filter((id): id is string => !!id);
    }
  }
}

// ── Cross-Linking ──

function crossLink(peptides: Peptide[], targets: PeptideTarget[], mfgs: PeptideManufacturer[]): void {
  // Link peptides ↔ targets
  for (const pep of peptides) {
    for (const tid of pep.targetIds) {
      const tgt = targets.find(t => t.id === tid);
      if (tgt && !tgt.peptideIds.includes(pep.id)) tgt.peptideIds.push(pep.id);
    }
    for (const mid of pep.manufacturerIds) {
      const mfg = mfgs.find(m => m.id === mid);
      if (mfg && !mfg.peptideIds.includes(pep.id)) mfg.peptideIds.push(pep.id);
    }
  }

  // Cross-reference to main DB drugs
  const pepDrugs = DB.drugs.filter(d => d.modality === "Peptide");
  for (const pep of peptides) {
    const nameL = pep.name.toLowerCase();
    const aliasL = pep.aliases.map(a => a.toLowerCase());
    for (const drug of pepDrugs) {
      const drugNameL = (drug.name || drug.code).toLowerCase();
      const drugAliases = drug.aliases.map(a => a.toLowerCase());
      if (
        drugNameL.includes(nameL) || nameL.includes(drugNameL) ||
        aliasL.some(a => drugAliases.includes(a)) ||
        drugAliases.some(a => aliasL.includes(a))
      ) {
        if (!pep.drugIds.includes(drug.id)) pep.drugIds.push(drug.id);
        if (!pep.companyIds.includes(drug.companyId)) pep.companyIds.push(drug.companyId);
      }
    }
  }
}

// ── Build Database ──

function buildPeptideDB(): PeptideDB {
  const targets = parseTargets();
  const manufacturers = parseManufacturers();
  const peptides = parsePeptides(targets, manufacturers);
  mergeEducationalData(peptides);
  resolveRelatedPeptides(peptides);
  crossLink(peptides, targets, manufacturers);
  return { peptides, targets, manufacturers };
}

export const PDB: PeptideDB = buildPeptideDB();
