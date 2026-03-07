import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Companies ---
  const moderna = await prisma.company.create({
    data: {
      name: "Moderna, Inc.",
      ticker: "MRNA",
      description:
        "Moderna is a biotechnology company pioneering messenger RNA (mRNA) therapeutics and vaccines. The company's platform builds on continuous advances in basic and applied mRNA science, delivery technology and manufacturing.",
      scientificFocus: "mRNA therapeutics and vaccines",
      therapeuticAreas: JSON.stringify([
        "Infectious Disease",
        "Oncology",
        "Cardiovascular",
        "Rare Diseases",
        "Autoimmune",
      ]),
      founded: "2010",
      headquarters: "Cambridge, Massachusetts, USA",
      website: "https://www.modernatx.com",
      marketCap: 15200000000,
      stockPrice: 38.5,
      employees: 5900,
      ceo: "Stephane Bancel",
      investors: JSON.stringify([
        "Flagship Pioneering",
        "AstraZeneca",
        "Merck",
        "Vertex",
      ]),
    },
  });

  const biontech = await prisma.company.create({
    data: {
      name: "BioNTech SE",
      ticker: "BNTX",
      description:
        "BioNTech is a next-generation immunotherapy company pioneering novel therapies for cancer and other serious diseases. The company exploits a wide array of computational discovery and therapeutic drug platforms for the rapid development of novel biopharmaceuticals.",
      scientificFocus: "Immunotherapy and mRNA technology",
      therapeuticAreas: JSON.stringify([
        "Oncology",
        "Infectious Disease",
        "Autoimmune",
      ]),
      founded: "2008",
      headquarters: "Mainz, Germany",
      website: "https://www.biontech.com",
      marketCap: 26800000000,
      stockPrice: 110.25,
      employees: 6000,
      ceo: "Ugur Sahin",
      investors: JSON.stringify([
        "Struengmann Family",
        "Pfizer",
        "Fosun Pharma",
      ]),
    },
  });

  const crispr = await prisma.company.create({
    data: {
      name: "CRISPR Therapeutics AG",
      ticker: "CRSP",
      description:
        "CRISPR Therapeutics is a leading gene editing company focused on developing transformative gene-based medicines for serious diseases using its proprietary CRISPR/Cas9 gene-editing platform.",
      scientificFocus: "CRISPR/Cas9 gene editing",
      therapeuticAreas: JSON.stringify([
        "Hematology",
        "Oncology",
        "Regenerative Medicine",
        "Rare Diseases",
      ]),
      founded: "2013",
      headquarters: "Zug, Switzerland",
      website: "https://www.crisprtx.com",
      marketCap: 3400000000,
      stockPrice: 45.8,
      employees: 1200,
      ceo: "Samarth Kulkarni",
      investors: JSON.stringify([
        "Vertex Pharmaceuticals",
        "Bayer",
        "GV (Google Ventures)",
      ]),
    },
  });

  // --- Drugs ---
  const spikevax = await prisma.drug.create({
    data: {
      name: "Spikevax",
      genericName: "mRNA-1273",
      drugClass: "mRNA Vaccine",
      mechanismOfAction:
        "Encodes the SARS-CoV-2 spike protein prefusion stabilized conformation. Instructs cells to produce the spike protein, triggering an immune response including neutralizing antibodies and T-cell responses.",
      therapeuticArea: "Infectious Disease",
      developmentStage: "Approved",
      regulatoryStatus: "FDA Approved (Full Approval)",
      approvalDate: "2022-01-31",
      description:
        "COVID-19 mRNA vaccine for active immunization to prevent coronavirus disease 2019.",
      companyId: moderna.id,
    },
  });

  const mRNA4157 = await prisma.drug.create({
    data: {
      name: "mRNA-4157/V940",
      genericName: "mRNA-4157",
      drugClass: "Individualized Neoantigen Therapy (INT)",
      mechanismOfAction:
        "Personalized cancer vaccine encoding up to 34 neoantigens unique to a patient's tumor. Combined with pembrolizumab to stimulate anti-tumor immune response.",
      therapeuticArea: "Oncology",
      developmentStage: "Phase 3",
      regulatoryStatus: "Investigational",
      description:
        "Individualized neoantigen therapy for adjuvant treatment of melanoma in combination with KEYTRUDA.",
      companyId: moderna.id,
    },
  });

  const comirnaty = await prisma.drug.create({
    data: {
      name: "Comirnaty",
      genericName: "BNT162b2",
      drugClass: "mRNA Vaccine",
      mechanismOfAction:
        "Nucleoside-modified mRNA encoding the SARS-CoV-2 spike glycoprotein. Elicits both humoral and cellular immune responses against the spike protein.",
      therapeuticArea: "Infectious Disease",
      developmentStage: "Approved",
      regulatoryStatus: "FDA Approved (Full Approval)",
      approvalDate: "2021-08-23",
      description:
        "COVID-19 mRNA vaccine developed in partnership with Pfizer.",
      companyId: biontech.id,
    },
  });

  const bnt211 = await prisma.drug.create({
    data: {
      name: "BNT211",
      genericName: "BNT211",
      drugClass: "CAR-T Cell Therapy + mRNA Vaccine",
      mechanismOfAction:
        "Claudin-6 (CLDN6)-targeting CAR-T cell therapy combined with CARVac, an mRNA-based vaccine that amplifies CAR-T cells in vivo.",
      therapeuticArea: "Oncology",
      developmentStage: "Phase 1/2",
      regulatoryStatus: "Investigational",
      description:
        "Next-generation CAR-T approach for solid tumors expressing CLDN6.",
      companyId: biontech.id,
    },
  });

  const casgevy = await prisma.drug.create({
    data: {
      name: "Casgevy",
      genericName: "exagamglogene autotemcel",
      drugClass: "Gene Therapy (CRISPR/Cas9)",
      mechanismOfAction:
        "Ex vivo CRISPR/Cas9 gene-edited autologous CD34+ hematopoietic stem cells. Edits the BCL11A gene to reactivate fetal hemoglobin production.",
      therapeuticArea: "Hematology",
      developmentStage: "Approved",
      regulatoryStatus: "FDA Approved",
      approvalDate: "2023-12-08",
      description:
        "First FDA-approved CRISPR-based gene therapy for sickle cell disease and transfusion-dependent beta thalassemia.",
      companyId: crispr.id,
    },
  });

  const ctx110 = await prisma.drug.create({
    data: {
      name: "CTX110",
      genericName: "CTX110",
      drugClass: "Allogeneic CAR-T Cell Therapy",
      mechanismOfAction:
        "Allogeneic CRISPR-edited CAR-T cells targeting CD19. Gene editing used to eliminate TCR expression to reduce graft-versus-host disease risk.",
      therapeuticArea: "Oncology",
      developmentStage: "Phase 1",
      regulatoryStatus: "Investigational",
      description:
        "Allogeneic anti-CD19 CAR-T therapy for relapsed or refractory B-cell malignancies.",
      companyId: crispr.id,
    },
  });

  // --- Clinical Trials ---
  const trial1 = await prisma.clinicalTrial.create({
    data: {
      nctId: "NCT04470427",
      title:
        "A Study to Evaluate the Safety and Efficacy of mRNA-1273 Vaccine in Healthy Adults",
      phase: "Phase 3",
      status: "Completed",
      conditions: JSON.stringify(["COVID-19", "SARS-CoV-2 Infection"]),
      interventions: JSON.stringify(["mRNA-1273 (Spikevax)", "Placebo"]),
      sponsors: "Moderna, Inc.",
      startDate: "2020-07-27",
      completionDate: "2022-12-21",
      enrollment: 30420,
      studyType: "Interventional",
      locations: JSON.stringify(["United States"]),
      resultsAvailable: true,
      briefSummary:
        "Phase 3 randomized, observer-blind, placebo-controlled study to evaluate efficacy, safety, and immunogenicity of mRNA-1273 against COVID-19 in adults 18 years and older.",
      eligibility: "Adults aged 18 years and older without prior COVID-19 infection",
      companyId: moderna.id,
    },
  });

  const trial2 = await prisma.clinicalTrial.create({
    data: {
      nctId: "NCT05933577",
      title:
        "V940-001: A Study of mRNA-4157 (V940) in Combination With Pembrolizumab (MK-3475) Versus Pembrolizumab in Participants With Resected High-Risk Melanoma (KEYNOTE-942/mRNA-4157-P201)",
      phase: "Phase 3",
      status: "Recruiting",
      conditions: JSON.stringify(["Melanoma Stage IIB-IV"]),
      interventions: JSON.stringify([
        "mRNA-4157 (V940)",
        "Pembrolizumab",
      ]),
      sponsors: "Moderna, Inc. / Merck Sharp & Dohme",
      startDate: "2023-07-15",
      enrollment: 1089,
      studyType: "Interventional",
      locations: JSON.stringify([
        "United States",
        "Australia",
        "Europe",
      ]),
      resultsAvailable: false,
      briefSummary:
        "Phase 3 study evaluating mRNA-4157 (V940) combined with pembrolizumab versus pembrolizumab alone as adjuvant treatment in participants with resected high-risk melanoma.",
      eligibility:
        "Adults with completely resected cutaneous melanoma (Stage IIB-IV)",
      companyId: moderna.id,
    },
  });

  const trial3 = await prisma.clinicalTrial.create({
    data: {
      nctId: "NCT04368728",
      title:
        "Study to Describe the Safety, Tolerability, Immunogenicity, and Efficacy of RNA Vaccine Candidates Against COVID-19 in Healthy Individuals",
      phase: "Phase 2/3",
      status: "Completed",
      conditions: JSON.stringify(["COVID-19"]),
      interventions: JSON.stringify(["BNT162b2 (Comirnaty)", "Placebo"]),
      sponsors: "BioNTech SE / Pfizer",
      startDate: "2020-04-29",
      completionDate: "2023-09-15",
      enrollment: 46331,
      studyType: "Interventional",
      locations: JSON.stringify([
        "United States",
        "Germany",
        "Turkey",
        "South Africa",
        "Brazil",
        "Argentina",
      ]),
      resultsAvailable: true,
      briefSummary:
        "Pivotal phase 2/3 study of BNT162b2 mRNA vaccine against COVID-19 demonstrating 95% efficacy against symptomatic COVID-19.",
      eligibility: "Healthy adults aged 16 years and older",
      companyId: biontech.id,
    },
  });

  const trial4 = await prisma.clinicalTrial.create({
    data: {
      nctId: "NCT03745287",
      title:
        "A Safety and Efficacy Study Evaluating CTX001 in Subjects With Transfusion-Dependent β-Thalassemia",
      phase: "Phase 1/2/3",
      status: "Completed",
      conditions: JSON.stringify(["Transfusion-Dependent Beta Thalassemia"]),
      interventions: JSON.stringify(["Exagamglogene autotemcel (Casgevy)"]),
      sponsors: "CRISPR Therapeutics / Vertex Pharmaceuticals",
      startDate: "2018-11-08",
      completionDate: "2024-03-15",
      enrollment: 52,
      studyType: "Interventional",
      locations: JSON.stringify([
        "United States",
        "Canada",
        "Germany",
        "Italy",
        "United Kingdom",
      ]),
      resultsAvailable: true,
      briefSummary:
        "Study evaluating safety and efficacy of CRISPR/Cas9-edited autologous hematopoietic stem cells (CTX001/Casgevy) in patients with transfusion-dependent beta thalassemia.",
      eligibility:
        "Adults 18-35 years with transfusion-dependent beta thalassemia",
      companyId: crispr.id,
    },
  });

  const trial5 = await prisma.clinicalTrial.create({
    data: {
      nctId: "NCT04035434",
      title:
        "A Safety and Efficacy Study Evaluating CTX001 in Subjects With Severe Sickle Cell Disease",
      phase: "Phase 1/2/3",
      status: "Completed",
      conditions: JSON.stringify(["Sickle Cell Disease"]),
      interventions: JSON.stringify(["Exagamglogene autotemcel (Casgevy)"]),
      sponsors: "CRISPR Therapeutics / Vertex Pharmaceuticals",
      startDate: "2019-11-21",
      completionDate: "2024-06-20",
      enrollment: 44,
      studyType: "Interventional",
      locations: JSON.stringify(["United States", "Canada", "Europe"]),
      resultsAvailable: true,
      briefSummary:
        "Study evaluating the safety and efficacy of CTX001 (exagamglogene autotemcel/Casgevy) in patients with severe sickle cell disease.",
      eligibility:
        "Adults 18-35 years with severe sickle cell disease and history of vaso-occlusive crises",
      companyId: crispr.id,
    },
  });

  // --- Drug-Trial Links ---
  await prisma.drugTrial.createMany({
    data: [
      { drugId: spikevax.id, trialId: trial1.id },
      { drugId: mRNA4157.id, trialId: trial2.id },
      { drugId: comirnaty.id, trialId: trial3.id },
      { drugId: casgevy.id, trialId: trial4.id },
      { drugId: casgevy.id, trialId: trial5.id },
    ],
  });

  // --- Publications ---
  const pub1 = await prisma.publication.create({
    data: {
      pmid: "33378609",
      title:
        "Efficacy and Safety of the mRNA-1273 SARS-CoV-2 Vaccine",
      authors: JSON.stringify([
        "Baden LR",
        "El Sahly HM",
        "Essink B",
        "Kotloff K",
        "Frey S",
      ]),
      journal: "New England Journal of Medicine",
      publishDate: "2021-02-04",
      abstract:
        "The mRNA-1273 vaccine showed 94.1% efficacy at preventing Covid-19 illness, including severe disease. Aside from transient local and systemic reactions, no safety concerns were identified.",
      doi: "10.1056/NEJMoa2035389",
    },
  });

  const pub2 = await prisma.publication.create({
    data: {
      pmid: "33301246",
      title:
        "Safety and Efficacy of the BNT162b2 mRNA Covid-19 Vaccine",
      authors: JSON.stringify([
        "Polack FP",
        "Thomas SJ",
        "Kitchin N",
        "Absalon J",
      ]),
      journal: "New England Journal of Medicine",
      publishDate: "2020-12-31",
      abstract:
        "A two-dose regimen of BNT162b2 conferred 95% protection against Covid-19 in persons 16 years of age or older. Safety over a median of 2 months was similar to that of other viral vaccines.",
      doi: "10.1056/NEJMoa2034577",
    },
  });

  const pub3 = await prisma.publication.create({
    data: {
      pmid: "37913736",
      title:
        "Exagamglogene Autotemcel for Transfusion-Dependent β-Thalassemia",
      authors: JSON.stringify([
        "Locatelli F",
        "Thompson AA",
        "Kwiatkowski JL",
        "Porter JB",
      ]),
      journal: "New England Journal of Medicine",
      publishDate: "2024-01-25",
      abstract:
        "CRISPR-Cas9 gene-edited autologous CD34+ hematopoietic stem and progenitor cell therapy demonstrated durable transfusion independence in patients with transfusion-dependent beta thalassemia.",
      doi: "10.1056/NEJMoa2309673",
    },
  });

  // --- Trial-Publication Links ---
  await prisma.trialPublication.createMany({
    data: [
      { trialId: trial1.id, publicationId: pub1.id },
      { trialId: trial3.id, publicationId: pub2.id },
      { trialId: trial4.id, publicationId: pub3.id },
    ],
  });

  // --- Company-Publication Links ---
  await prisma.companyPublication.createMany({
    data: [
      { companyId: moderna.id, publicationId: pub1.id },
      { companyId: biontech.id, publicationId: pub2.id },
      { companyId: crispr.id, publicationId: pub3.id },
    ],
  });

  // --- Financial Data ---
  const financialEntries = [
    // Moderna quarterly
    { companyId: moderna.id, date: "2024-Q4", revenue: 966000000, netIncome: -1123000000, marketCap: 15200000000, stockPrice: 38.5, volume: 8500000 },
    { companyId: moderna.id, date: "2024-Q3", revenue: 1860000000, netIncome: -13000000, marketCap: 19800000000, stockPrice: 50.12, volume: 9200000 },
    { companyId: moderna.id, date: "2024-Q2", revenue: 241000000, netIncome: -1278000000, marketCap: 46200000000, stockPrice: 117.0, volume: 7100000 },
    { companyId: moderna.id, date: "2024-Q1", revenue: 167000000, netIncome: -1179000000, marketCap: 40300000000, stockPrice: 102.5, volume: 6800000 },
    // BioNTech quarterly
    { companyId: biontech.id, date: "2024-Q4", revenue: 1190000000, netIncome: -250000000, marketCap: 26800000000, stockPrice: 110.25, volume: 3500000 },
    { companyId: biontech.id, date: "2024-Q3", revenue: 1243000000, netIncome: 198000000, marketCap: 24500000000, stockPrice: 100.8, volume: 3200000 },
    { companyId: biontech.id, date: "2024-Q2", revenue: 128600000, netIncome: -808000000, marketCap: 21000000000, stockPrice: 86.5, volume: 2800000 },
    { companyId: biontech.id, date: "2024-Q1", revenue: 188100000, netIncome: -315000000, marketCap: 20100000000, stockPrice: 82.75, volume: 2500000 },
    // CRISPR Therapeutics quarterly
    { companyId: crispr.id, date: "2024-Q4", revenue: 4100000, netIncome: -179000000, marketCap: 3400000000, stockPrice: 45.8, volume: 2100000 },
    { companyId: crispr.id, date: "2024-Q3", revenue: 1500000, netIncome: -140000000, marketCap: 3800000000, stockPrice: 51.2, volume: 1900000 },
    { companyId: crispr.id, date: "2024-Q2", revenue: 700000, netIncome: -143000000, marketCap: 4900000000, stockPrice: 65.0, volume: 1700000 },
    { companyId: crispr.id, date: "2024-Q1", revenue: 500000, netIncome: -120000000, marketCap: 5200000000, stockPrice: 69.5, volume: 1500000 },
  ];

  await prisma.financialData.createMany({ data: financialEntries });

  console.log("Seed data created successfully!");
  console.log(`  Companies: 3`);
  console.log(`  Drugs: 6`);
  console.log(`  Clinical Trials: 5`);
  console.log(`  Publications: 3`);
  console.log(`  Financial records: ${financialEntries.length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
