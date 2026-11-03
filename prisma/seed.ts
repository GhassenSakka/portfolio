/**
 * Seed idempotent : chaque section n'est injectée que si elle est vide,
 * afin que `npm run setup` soit rejouable sans jamais créer de doublons.
 * Contenu transcrit fidèlement depuis le brief fourni ; les traductions
 * FR<->EN sont fidèles (aucun ajout, aucune suppression d'information).
 * Les légendes des actions associatives (FR/AR) sont conservées telles
 * quelles dans `captionOriginal`, sans traduction.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encodeJsonList } from "../src/lib/json-fields";

const prisma = new PrismaClient();

function d(year: number, month: number, day = 1): Date {
  // Mois 1-indexé pour la lisibilité (d(2026, 7) = juillet 2026)
  return new Date(Date.UTC(year, month - 1, day));
}

async function seedAdminUser() {
  const count = await prisma.adminUser.count();
  if (count > 0) {
    console.log("• AdminUser déjà présent — inchangé (mot de passe conservé).");
    return;
  }
  const email = process.env.ADMIN_EMAIL || "admin@local.test";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({ data: { email, passwordHash } });
  console.log(`• Compte admin créé : ${email}`);
}

async function seedProfile() {
  const existing = await prisma.profile.findFirst();
  if (existing) {
    console.log("• Profile déjà présent — inchangé.");
    return;
  }

  await prisma.profile.create({
    data: {
      fullName: "Ghassen SAKKA",
      titleFr: "Cloud Consultant @ CloudShift | Azure • Architecture Cloud • FinOps • Gouvernance",
      titleEn: "Cloud Consultant @ CloudShift | Azure • Cloud Architecture • FinOps • Governance",
      bannerFr:
        "Diplômé Ingénieur en Cloud Computing et Architecture IT, ESPRIT, remise de diplôme le 27 juillet 2026",
      bannerEn:
        "Graduate Engineer in Cloud Computing and IT Architecture, ESPRIT, graduation ceremony on July 27, 2026",
      aboutFr:
        "Cloud Consultant chez CloudShift, je conçois et développe des solutions SaaS sur Microsoft Azure autour du FinOps, de la gouvernance et de l'architecture cloud sécurisée, publiées sur la Microsoft Azure Marketplace. Diplômé Ingénieur en Cloud Computing et Architecture IT d'ESPRIT (remise de diplôme le 27 juillet 2026), je suis basé à Tunis, en Tunisie. Certifié Microsoft Azure (Information Security Administrator, Azure Virtual Desktop, Azure Administrator) ainsi que Cisco et AWS, je m'investis également dans la vie associative en tant que Vice-Président du Leo Club Boumhal La Providence et membre de l'ACM ESPRIT. Curieux et engagé, je partage mon temps entre le cloud, les voyages, la course à pied et la cuisine.",
      aboutEn:
        "I am a Cloud Consultant at CloudShift, where I design and build SaaS solutions on Microsoft Azure focused on FinOps, governance, and secure cloud architecture, published on the Microsoft Azure Marketplace. I hold an Engineering Degree in Cloud Computing and IT Architecture from ESPRIT (graduation ceremony on July 27, 2026) and I am based in Tunis, Tunisia. Certified in Microsoft Azure (Information Security Administrator, Azure Virtual Desktop, Azure Administrator) as well as Cisco and AWS, I am also active in community life as Vice-President of Leo Club Boumhal La Providence and a member of ACM ESPRIT. Curious and engaged, I split my time between cloud technology, traveling, running, and cooking.",
      location: "Tunis, Tunisie",
      email1: "sakkaghassen@gmail.com",
      email2: "ghassen.sakka@cloudshift.fr",
      phone1: "25 442 430",
      phone2: "29 770 990",
      linkedinUrl: "https://linkedin.com/in/ghassen-sakka",
      photoUrl: null,
      cvUrl: null,
    },
  });
  console.log("• Profile créé.");
}

async function seedEducation() {
  if ((await prisma.education.count()) > 0) {
    console.log("• Education déjà présent — inchangé.");
    return;
  }

  await prisma.education.createMany({
    data: [
      {
        schoolFr: "ESPRIT",
        schoolEn: "ESPRIT",
        degreeFr: "Diplôme d'Ingénieur en Cloud Computing et Architecture IT",
        degreeEn: "Engineering Degree in Cloud Computing and IT Architecture",
        fieldFr: "Informatique",
        fieldEn: "Computer Science",
        gradeFr: null,
        gradeEn: null,
        startDate: d(2023, 9),
        endDate: d(2026, 6, 30),
        isCurrent: false,
        sortOrder: 0,
      },
      {
        schoolFr: "Faculté des Sciences Mathématiques, Physiques et Naturelles de Tunis",
        schoolEn: "Faculty of Mathematical, Physical and Natural Sciences of Tunis",
        degreeFr: "Cycle préparatoire intégré",
        degreeEn: "Integrated Preparatory Cycle",
        fieldFr: "Mathématiques et Informatique",
        fieldEn: "Mathematics and Computer Science",
        startDate: d(2021, 9),
        endDate: d(2023, 8, 31),
        isCurrent: false,
        sortOrder: 1,
      },
      {
        schoolFr: "Lycée Boumhal",
        schoolEn: "Boumhal High School",
        degreeFr: "Baccalauréat",
        degreeEn: "Baccalaureate",
        fieldFr: "Sciences Informatiques",
        fieldEn: "Computer Science",
        gradeFr: "Baccalauréat en Sciences Informatiques avec mention très bien",
        gradeEn: 'Computer Science Baccalaureate with high distinction ("très bien")',
        startDate: d(2020, 9),
        endDate: d(2021, 7, 31),
        isCurrent: false,
        sortOrder: 2,
      },
    ],
  });
  console.log("• Education créée (3).");
}

async function seedCertifications() {
  if ((await prisma.certification.count()) > 0) {
    console.log("• Certifications déjà présentes — inchangées.");
    return;
  }

  await prisma.certification.createMany({
    data: [
      {
        nameFr: "Microsoft Certified: Information Security Administrator Associate",
        nameEn: "Microsoft Certified: Information Security Administrator Associate",
        issuer: "Microsoft",
        credentialId: "142D4A952E7F8CC5",
        issuedAt: d(2026, 9),
        expiresAt: d(2027, 9),
        sortOrder: 0,
      },
      {
        nameFr: "Microsoft Certified: Azure Virtual Desktop Specialty",
        nameEn: "Microsoft Certified: Azure Virtual Desktop Specialty",
        issuer: "Microsoft",
        credentialId: "5CD227E9762AE2FF",
        issuedAt: d(2026, 7),
        expiresAt: d(2027, 7),
        sortOrder: 1,
      },
      {
        nameFr: "Microsoft Certified: Azure Administrator Associate",
        nameEn: "Microsoft Certified: Azure Administrator Associate",
        issuer: "Microsoft",
        credentialId: "20274F841C111CC",
        issuedAt: d(2026, 6),
        expiresAt: d(2027, 6),
        sortOrder: 2,
      },
      {
        nameFr: "Attendance Hashgraph Developer",
        nameEn: "Attendance Hashgraph Developer",
        issuer: "The Hashgraph Association",
        credentialId: "27020373-1cca-4b66-ac25-4cfc56649001",
        issuedAt: d(2025, 10),
        expiresAt: null,
        sortOrder: 3,
      },
      {
        nameFr: "CCNA: Switching, Routing, and Wireless Essentials",
        nameEn: "CCNA: Switching, Routing, and Wireless Essentials",
        issuer: "Cisco",
        credentialId: null,
        issuedAt: d(2024, 9),
        expiresAt: null,
        sortOrder: 4,
      },
      {
        nameFr: "AWS Academy Graduate - Cloud Operations - Training Badge",
        nameEn: "AWS Academy Graduate - Cloud Operations - Training Badge",
        issuer: "Amazon Web Services (AWS)",
        credentialId: null,
        issuedAt: d(2025, 10),
        expiresAt: null,
        sortOrder: 5,
      },
    ],
  });
  console.log("• Certifications créées (6).");
}

async function seedExperiences() {
  if ((await prisma.experience.count()) > 0) {
    console.log("• Experiences déjà présentes — inchangées.");
    return;
  }

  await prisma.experience.createMany({
    data: [
      {
        groupLabel: "CloudShift",
        companyFr: "CloudShift",
        companyEn: "CloudShift",
        roleFr: "Consultant Cloud",
        roleEn: "Cloud Consultant",
        employmentType: "Full-time",
        locationFr: "Tunis, Tunisie",
        locationEn: "Tunis, Tunisia",
        workMode: "On-site",
        startDate: d(2026, 8),
        endDate: null,
        isCurrent: true,
        sortOrder: 0,
      },
      {
        groupLabel: "CloudShift",
        companyFr: "CloudShift",
        companyEn: "CloudShift",
        roleFr: "Projet de fin d'études & Consultant Cloud",
        roleEn: "End-of-Studies Project & Cloud Consultant",
        employmentType: "Full-time",
        locationFr: "Tunis, Tunisie",
        locationEn: "Tunis, Tunisia",
        workMode: "On-site",
        startDate: d(2025, 12),
        endDate: d(2026, 7, 31),
        isCurrent: false,
        sortOrder: 1,
      },
      {
        groupLabel: "CloudShift",
        companyFr: "CloudShift",
        companyEn: "CloudShift",
        roleFr: "Consultant Cloud",
        roleEn: "Cloud Consultant",
        employmentType: "Part-time",
        locationFr: null,
        locationEn: null,
        workMode: "Hybrid",
        startDate: d(2025, 9),
        endDate: d(2025, 11, 30),
        isCurrent: false,
        sortOrder: 2,
      },
      {
        groupLabel: "CloudShift",
        companyFr: "CloudShift",
        companyEn: "CloudShift",
        roleFr: "Stagiaire Consultant Cloud",
        roleEn: "Cloud Consultant Intern",
        employmentType: "Internship",
        locationFr: null,
        locationEn: null,
        workMode: "On-site",
        startDate: d(2025, 6),
        endDate: d(2025, 8, 31),
        isCurrent: false,
        sortOrder: 3,
      },
      {
        groupLabel: "INCEPTUM Junior Entreprise",
        companyFr: "INCEPTUM Junior Entreprise",
        companyEn: "INCEPTUM Junior Entreprise",
        roleFr: "Développeur Logiciel Junior",
        roleEn: "Junior Software Developer",
        employmentType: "Part-time",
        startDate: d(2024, 10),
        endDate: d(2025, 6, 30),
        isCurrent: false,
        sortOrder: 4,
      },
      {
        groupLabel: "Assurances BIAT",
        companyFr: "Assurances BIAT",
        companyEn: "Assurances BIAT",
        roleFr: "Stagiaire",
        roleEn: "Intern",
        employmentType: "Internship",
        locationFr: "Tunisie",
        locationEn: "Tunisia",
        descriptionFr:
          "Stage de 3e année – Développement Web, Conteneurisation & Cloud.\nDans le cadre de ma formation en 3e année, j'ai effectué un stage d'immersion en entreprise orienté sur le développement web et la découverte des environnements cloud et conteneurisés.\nMissions réalisées : développement d'une application web en Symfony (frontend & backend) ; création d'images et exécution de l'application en conteneur ; première approche de Microsoft Azure : déploiement de l'image sur Azure App Service.\nObjectif du stage : comprendre le cycle de vie complet d'une application web, de son développement jusqu'au déploiement dans un environnement cloud.",
        descriptionEn:
          "3rd-year internship – Web Development, Containerization & Cloud.\nAs part of my 3rd-year training, I completed a company immersion internship focused on web development and discovering cloud and containerized environments.\nTasks performed: developed a web application in Symfony (frontend & backend); built container images and ran the application in a container; first approach to Microsoft Azure: deployed the image to Azure App Service.\nInternship goal: understand the complete lifecycle of a web application, from development through deployment in a cloud environment.",
        startDate: d(2024, 7),
        endDate: d(2024, 8, 31),
        isCurrent: false,
        sortOrder: 5,
      },
      {
        groupLabel: "Easy Ways Career",
        companyFr: "Easy Ways Career",
        companyEn: "Easy Ways Career",
        roleFr: "Enseignant Algorithmique et Complexité",
        roleEn: "Algorithm and Complexity Teacher",
        employmentType: "Part-time",
        locationFr: "Tunisie",
        locationEn: "Tunisia",
        workMode: "Remote",
        descriptionFr:
          "J'ai donné des cours d'algorithme et de complexité en ligne sur la plateforme academy.easyways.tn.\nJ'ai donné des cours de programmation orientée objet C++ en ligne sur la plateforme academy.easyways.tn.",
        descriptionEn:
          "I taught algorithm and complexity courses online on the academy.easyways.tn platform.\nI taught C++ object-oriented programming courses online on the academy.easyways.tn platform.",
        linkUrl: "https://academy.easyways.tn/",
        startDate: d(2022, 9),
        endDate: d(2022, 12, 31),
        isCurrent: false,
        sortOrder: 6,
      },
    ],
  });
  console.log("• Experiences créées (7).");
}

async function seedProjects() {
  if ((await prisma.project.count()) > 0) {
    console.log("• Projects déjà présents — inchangés.");
    return;
  }

  await prisma.project.createMany({
    data: [
      {
        titleFr:
          "Solution SaaS FinOps pour l'optimisation des coûts et la gouvernance Azure, publiée sur Microsoft Azure Marketplace",
        titleEn:
          "FinOps SaaS Solution for Azure Cost Optimization and Governance, Published on Microsoft Azure Marketplace",
        descriptionFr:
          "Conception et développement d'une solution SaaS FinOps sur Azure permettant d'identifier le gaspillage cloud et les opportunités d'optimisation des coûts.\nMise en œuvre d'un accès sécurisé en lecture seule aux environnements clients via Azure Lighthouse, sans partage d'identifiants ni modification des ressources.\nDéveloppement d'une détection automatisée des ressources inactives et de fonctionnalités de redimensionnement (rightsizing) des machines virtuelles pour optimiser les coûts de l'infrastructure cloud.\nMise en place d'un workflow de gestion et de suivi des demandes d'optimisation, incluant la soumission des demandes, le suivi des statuts, la gestion back-office et les notifications par email.\nPublication et gestion de l'offre SaaS sur Microsoft Azure Marketplace, avec contribution à la préparation technique et à la certification.",
        descriptionEn:
          "Designed and developed a FinOps SaaS solution on Azure to identify cloud waste and cost optimization opportunities.\nImplemented secure, read-only access to customer environments using Azure Lighthouse, without sharing credentials or modifying resources.\nDeveloped automated detection of idle resources and VM rightsizing features to optimize cloud infrastructure costs.\nImplemented an optimization request management and tracking workflow, including request submission, status timelines, back-office management, and email notifications.\nPublished and managed the SaaS offering on Microsoft Azure Marketplace, contributing to technical preparation and certification.",
        startDate: d(2026, 6),
        endDate: null,
        isCurrent: true,
        sortOrder: 0,
      },
      {
        titleFr:
          "Solution SaaS pour le déploiement automatisé de Landing Zones Azure, publiée sur Microsoft Azure Marketplace",
        titleEn:
          "SaaS Solution for Automated Azure Landing Zone Deployment, Published on Microsoft Azure Marketplace",
        descriptionFr:
          "Conception et développement d'une solution SaaS pour le déploiement automatisé et personnalisable de Landing Zones Azure.\nAutomatisation du déploiement des composants de la Landing Zone, incluant le réseau virtuel Azure (VNet), les sous-réseaux, les groupes de sécurité réseau (NSG), le peering VNet, Azure Firewall et Azure Bastion.\nMise en œuvre d'une gestion sécurisée des accès multi-tenant via Azure Lighthouse, permettant des opérations déléguées et contrôlées sans partage des identifiants clients.\nAutomatisation du déploiement des Azure Policies afin d'appliquer les standards de sécurité, de conformité et de bonnes pratiques dès la création de l'environnement.\nConception de fonctionnalités de visualisation de la topologie de l'architecture cible et de suivi des déploiements en temps réel.\nPublication et gestion de l'offre SaaS sur Microsoft Azure Marketplace, incluant la préparation technique et le processus de validation et de certification Microsoft.",
        descriptionEn:
          "Designed and developed a SaaS solution for automated, customizable deployment of Azure Landing Zones.\nAutomated the deployment of Landing Zone components, including Azure Virtual Network (VNet), Subnets, Network Security Groups (NSGs), VNet Peering, Azure Firewall, and Azure Bastion.\nImplemented secure multi-tenant access management via Azure Lighthouse, enabling controlled, delegated operations without sharing customer credentials.\nAutomated the deployment of Azure Policies to enforce security, compliance, and best-practice standards from environment creation onward.\nDesigned features for visualizing target architecture topology and monitoring deployments in real time.\nPublished and managed the SaaS offer on Microsoft Azure Marketplace, including technical preparation and Microsoft's validation and certification process.",
        startDate: d(2026, 3),
        endDate: d(2026, 6, 30),
        isCurrent: false,
        sortOrder: 1,
      },
      {
        titleFr: "Solution SaaS de gouvernance et de conformité Azure, publiée sur Microsoft Azure Marketplace",
        titleEn: "SaaS Solution for Azure Governance and Compliance, Published on Microsoft Azure Marketplace",
        descriptionFr:
          "Conception et développement d'une solution SaaS de gouvernance et de conformité Azure, offrant une vue centralisée de la posture de conformité cloud.\nDéveloppement d'une fonctionnalité de suivi des Azure Policies permettant d'identifier les ressources conformes ou non conformes aux règles de gouvernance définies.\nDéveloppement d'un moteur d'analyse du tagging afin d'identifier les ressources Azure correctement taguées et celles qui ne le sont pas, au regard des standards de tagging.\nIntégration de contrôles de conformité réglementaire basés sur ISO 27001, NIST, MCSB et PCI-DSS via Microsoft Defender for Cloud, avec calcul et suivi d'un score de conformité.\nConception de tableaux de bord centralisés pour le suivi de la gouvernance et de la conformité.\nPublication et gestion de l'offre SaaS sur Microsoft Azure Marketplace, incluant la préparation technique et le processus de certification Microsoft.",
        descriptionEn:
          "Designed and developed a SaaS solution for Azure governance and compliance, providing a centralized view of cloud compliance posture.\nBuilt Azure Policy tracking functionality to identify resources that are compliant or non-compliant with defined governance rules.\nDeveloped a tagging analysis engine to identify properly tagged and untagged Azure resources against tagging standards.\nIntegrated regulatory compliance controls based on ISO 27001, NIST, MCSB, and PCI-DSS via Microsoft Defender for Cloud, with compliance score calculation and tracking.\nDesigned centralized dashboards for governance and compliance monitoring.\nPublished and managed the SaaS offer on Microsoft Azure Marketplace, including technical preparation and the Microsoft certification process.",
        startDate: d(2026, 5),
        endDate: d(2026, 6, 30),
        isCurrent: false,
        sortOrder: 2,
      },
      {
        titleFr: "Architecture Azure sécurisée pour un SIRH, client COFAT",
        titleEn: "Secure Azure Architecture for HRIS, COFAT Client",
        descriptionFr:
          "Conception et déploiement d'une architecture Azure sécurisée et évolutive pour un système d'information RH (SIRH) développé avec Angular, NestJS et PostgreSQL.\nMise en œuvre d'une architecture réseau privée utilisant Azure Virtual Network, des sous-réseaux dédiés, le DNS privé et un accès administratif sécurisé via Azure Bastion.\nConfiguration de l'authentification avec Microsoft Entra ID au niveau d'Angular et de NestJS, en complément des comptes locaux et du contrôle d'accès basé sur les rôles au niveau applicatif.\nDéploiement et sécurisation de services Azure incluant App Service, Container Instances, PostgreSQL Flexible Server, Blob Storage, Container Registry et Key Vault.",
        descriptionEn:
          "Designed and deployed a secure, scalable Azure architecture for a Human Resources Information System (HRIS) built with Angular, NestJS, and PostgreSQL.\nImplemented a private network architecture using Azure Virtual Network, dedicated subnets, private DNS, and secure administrative access via Azure Bastion.\nConfigured authentication with Microsoft Entra ID at both the Angular and NestJS levels, alongside local accounts and application-level role-based access control.\nDeployed and secured Azure services including App Service, Container Instances, PostgreSQL Flexible Server, Blob Storage, Container Registry, and Key Vault.",
        startDate: d(2025, 12),
        endDate: d(2026, 1, 31),
        isCurrent: false,
        sortOrder: 3,
      },
      {
        titleFr: "Automatisation CI/CD Azure DevOps / Power Platform, client Castel Afrique",
        titleEn: "Azure DevOps / Power Platform CI/CD Automation, Castel Afrique",
        descriptionFr:
          "Mise en place d'un pipeline CI/CD dans Azure DevOps pour automatiser le déploiement de solutions Power Platform.\nConception d'un pipeline d'export récupérant automatiquement les solutions depuis l'environnement de développement (DEV), les empaquetant en fichiers .zip et les archivant en tant qu'artefacts Azure DevOps pour le contrôle de version.\nDéveloppement d'un pipeline d'import permettant le déploiement automatisé des solutions validées de PREPROD vers PROD.\nRéduction de l'intervention manuelle et amélioration de la fiabilité des déploiements grâce à l'automatisation des processus DevOps.",
        descriptionEn:
          "Set up a CI/CD pipeline in Azure DevOps to automate the deployment of Power Platform solutions.\nDesigned an export pipeline that automatically retrieves solutions from the development (DEV) environment, packages them as .zip files, and archives them as Azure DevOps artifacts for version control.\nDeveloped an import pipeline enabling automated deployment of validated solutions from PREPROD to PROD.\nReduced manual intervention and improved deployment reliability through DevOps process automation.",
        startDate: d(2025, 8),
        endDate: d(2025, 8, 31),
        isCurrent: false,
        sortOrder: 4,
      },
    ],
  });
  console.log("• Projects créés (5).");
}

async function seedAssociativeRoles() {
  if ((await prisma.associativeRole.count()) > 0) {
    console.log("• AssociativeRoles déjà présents — inchangés.");
    return;
  }

  await prisma.associativeRole.createMany({
    data: [
      {
        organizationFr: "Leo Club Boumhal La Providence",
        organizationEn: "Leo Club Boumhal La Providence",
        roleFr: "Adjoint trésorier",
        roleEn: "Assistant Treasurer",
        startDate: d(2023, 7),
        endDate: d(2024, 6, 30),
        isCurrent: false,
        sortOrder: 0,
      },
      {
        organizationFr: "Leo Club Boumhal La Providence",
        organizationEn: "Leo Club Boumhal La Providence",
        roleFr: "Vice-Président",
        roleEn: "Vice President",
        startDate: d(2024, 7),
        endDate: d(2025, 7, 31),
        isCurrent: false,
        sortOrder: 1,
      },
      {
        organizationFr: "ACM ESPRIT",
        organizationEn: "ACM ESPRIT",
        roleFr: "Membre",
        roleEn: "Member",
        startDate: d(2023, 9),
        endDate: null,
        isCurrent: true,
        sortOrder: 2,
      },
      {
        organizationFr: "Leo Club Boumhal La Providence",
        organizationEn: "Leo Club Boumhal La Providence",
        roleFr: "Membre",
        roleEn: "Member",
        startDate: d(2025, 8),
        endDate: null,
        isCurrent: true,
        sortOrder: 3,
      },
    ],
  });
  console.log("• AssociativeRoles créés (4).");
}

async function seedAssociativeActions() {
  if ((await prisma.associativeAction.count()) > 0) {
    console.log("• AssociativeActions déjà présentes — inchangées.");
    return;
  }

  const actions = [
    {
      titleFr: "Action rentrée scolaire",
      titleEn: "Back-to-School Action",
      captionOriginal:
        "Une action rentrée scolaire terminé ✅ Vos dons sont bien délivré aux enfants en collaboration avec @crt_ezzahra",
      links: [
        "https://www.instagram.com/p/C_3oDd9oVNA/?img_index=1",
        "https://www.instagram.com/p/C_3wYVWofxa/?img_index=1",
      ],
    },
    {
      titleFr: "Recrutement et Welcome Day",
      titleEn: "Recruitment and Welcome Day",
      captionOriginal: "",
      links: ["https://www.instagram.com/p/DArAaXvIvlw/?img_index=5"],
    },
    {
      titleFr: "Action Octobre Rose",
      titleEn: "Pink October Action",
      captionOriginal: "",
      links: [
        "https://www.instagram.com/p/DBzMu11ICbD/?img_index=1",
        "https://www.instagram.com/p/DB4jupGKZUB/?img_index=1",
      ],
    },
    {
      titleFr: "Formation : Pour une société plus inclusive",
      titleEn: "Training: For a More Inclusive Society",
      captionOriginal:
        "Nos équipes se forment pour améliorer l'accompagnement des jeunes vulnérables au quotidien",
      links: [
        "https://www.instagram.com/p/DCXNKXxoElT/?img_index=1",
        "https://www.instagram.com/p/DCXOWumoesx/?img_index=1",
      ],
    },
    {
      titleFr: "Action Friguia",
      titleEn: "Friguia Action",
      captionOriginal:
        "Apporter des sourires et de l'émerveillement ! 🦁✨ Notre club a eu la joie d'emmener ces merveilleux enfants pour une journée inoubliable au zoo, remplie de souvenirs et de bonheur.",
      links: [
        "https://www.instagram.com/p/DCpZ7pvoXhW/?img_index=1",
        "https://www.instagram.com/p/DCpVKTAIL6v/?img_index=1",
      ],
    },
    {
      titleFr: "Action Réveillon",
      titleEn: "New Year's Eve Action",
      captionOriginal:
        "Un réveillon sous le signe du partage 🌟 / مع بعضنا، نوّرنا سهرة 25 عائلة ✨ . / هالعطاء دليل على قوة مجتمع متلاحم. شكراً لكل اللي ساهموا بها المبادرة 🙏.",
      links: [
        "https://www.instagram.com/p/DEQOfwJo3wY/?img_index=2",
        "https://www.instagram.com/p/DEQQc7OIueN/?img_index=1",
      ],
    },
    {
      titleFr: "Action SDF",
      titleEn: "Homeless Support Action",
      captionOriginal:
        "اليد في اليد مع اللي محتاجيننا 🤲❤️نهار و ليلة عشنا فيها لحظات خير وتقاسمنا الفرحة و الأمل مع الناس اللي المزيانة الي تستحق ،شكراً لـ @universelle_tunisie على المساندة. 🇹🇳",
      links: ["https://www.instagram.com/p/DE22eEyotmk/?img_index=1"],
    },
    {
      titleFr: "Hiver au chaud",
      titleEn: "Warm Winter",
      captionOriginal:
        "لحظات ما تتنساش بفضل Le @chamia_lemoulin , SFBT، @biscuits_saida_officiel اللي خلات يومنا مميز بأحلى النكهات! عيشوا معانا لحظات كيفاش الفرحة كانت حاضرة في كل تفصيل. 🙏🇹🇳 وراء كل نجاح، فمّا ناس تخدم في الظل، تؤمن وتدعم من غير تخمام. شكر خاص لـ: 🔧 General Innovative Contractors على تسهيل الخدمات اللوجستية ودعمنا بلا شروط. 📦 Mégrine Emballage على توفير المواد اللازمة لتوضيب التبرعات بطريقة منظمة.",
      links: [
        "https://www.instagram.com/p/DFim0C3o1Fh/?img_index=1",
        "https://www.instagram.com/p/DFgFjI7IAtZ/?img_index=5",
      ],
    },
    {
      titleFr: "Action Lama et Far7a",
      titleEn: "Lama et Far7a Action",
      captionOriginal:
        "نهار الأحد عشنا لحظات استثنائية مع صغار المركز المندمج للشباب والطفولة بحمام الأنف💛✨ من الضحك للألعاب والأنشطة، كل لحظة كانت مليانة بالطاقة والفرحة. شكر خاص لـ @onet_boumhal1948 على الدعم الكبير اللي خلا النهار هذا ما يتنساش. مع بعضنا، الأيام العادية تولي ذكريات استثنائية💫",
      links: ["https://www.instagram.com/p/DGBgcTbIvQK/?img_index=1"],
    },
    {
      titleFr: "Koffet Ramdahn",
      titleEn: "Koffet Ramdahn",
      captionOriginal:
        "نهار كامل من العطاء مع Lions Club Tunis La Renaissance 🤝 وين قدرنا نوفروا 20 قفة لرمضان لصالح الاتحاد الجهوي للمكفوفين بأريانة 🎁✨. هذي مبادرة صغيرة قدام احتياجات كبيرة، أما كي نكونوا مع بعضنا، ديما الخير يكبر! 🦁💛",
      links: [
        "https://www.instagram.com/p/DG1AWMjKNuG/?img_index=1",
        "https://www.instagram.com/p/DG1Fc3vKA_U/?img_index=",
      ],
    },
    {
      titleFr: "Restaurant du Cœur",
      titleEn: "Restaurant du Cœur",
      captionOriginal:
        "✨️ بقلوب مفتوحة و أيادي تخدم بالخير✨️ عدينا نهار الأحد 03/16 مع Lions Soukra Yasmine في تظاهرة Restaurant du Cœur ❤️ شكر خاص ليهم على التنظيم و على الدعوة و الفرصة باش نفرحو 120 شخص بوجبات متكاملة، من التحضير حتى التوزيع🍲💪 و ما وقفناش لهنا! ساهمنا زادة في فحوصات صحية لمراقبة نسبة السكر و التوعية بالأمراض. 🙌🩺 ولأنو الخير عمروا ما ياقف نستناوكم معانا نكملوا فرحة صغيراتنا في العيد باللبسة و كل ما يلزم💛",
      links: [
        "https://www.instagram.com/p/DHbxYPgoXvr/?img_index=1",
        "https://www.instagram.com/p/DHb04DqIGhI/?img_index=1",
      ],
    },
    {
      titleFr: "Action Les Petits Héros",
      titleEn: "Little Heroes Action",
      captionOriginal:
        "🦁🤍 كيما ديماالدائم، وعلى كل الحاجات الصحية والنظافة اللي وفرتوهم لصغار المستشفى. 🩺🎁 بفضلكم، اليوم ما كانش كان نهار فرحة، أما زادة نهار أمل واهتمام بصحة أطفالنا. 💙 شكراً على ثقتكم وعلى حبكم للعطاء! ❤️",
      links: [
        "https://www.instagram.com/p/DHrOshqorI4/?img_index=1",
        "https://www.instagram.com/p/DHrTSviISWn/?img_index=1",
      ],
    },
    {
      titleFr: "Aïd El Fitr",
      titleEn: "Aïd El Fitr",
      captionOriginal:
        "من أول خطوة خرجنا نشريو 🎽👗، للحظة إلّي لبسوهم وفرحتهم غطّت الدنيا 🥹❤️ هذا العيد كان مختلف، كان أعمق… لأنو الخير وقت يتعدّى، الفرحة تتضاعف 😍🎊 تابعو معانا كل لحظة في ڤيديو يجمع الحب، العطاء، وفرحة العيد🌟🎥",
      links: [
        "https://www.instagram.com/p/DIHcj_EoJr1/?img_index=1",
        "https://www.instagram.com/p/DIHhvgtIINo/?img_index=1",
      ],
    },
  ];

  await prisma.associativeAction.createMany({
    data: actions.map((action, index) => ({
      titleFr: action.titleFr,
      titleEn: action.titleEn,
      captionOriginal: action.captionOriginal,
      instagramLinks: encodeJsonList(action.links),
      sortOrder: index,
    })),
  });
  console.log(`• AssociativeActions créées (${actions.length}).`);
}

async function seedAwards() {
  if ((await prisma.award.count()) > 0) {
    console.log("• Awards déjà présents — inchangés.");
    return;
  }

  await prisma.award.create({
    data: {
      titleFr: "2e place, 5e édition du TLCS (Tunisian Lions Campus Seminar) 2024-2025",
      titleEn: "2nd Place, 5th Edition of TLCS (Tunisian Lions Campus Seminar) 2024-2025",
      descriptionFr:
        "J'ai eu l'honneur de participer à la 5e édition du TLCS (Tunisian Lions Campus Seminar) 2024-2025 pour présenter notre projet « Ahna Maak », une initiative chère à notre club Leo Club Boumhal La Providence. Je suis ravi d'annoncer que nous avons remporté la 2e place ! L'objectif d'« Ahna Maak » est de soutenir et d'accompagner les adolescents en difficulté en leur offrant un accompagnement, une écoute et des opportunités d'épanouissement personnel. Cette initiative s'inscrit parfaitement dans le nouvel axe « jeunesse » du Lions Clubs International, reflétant notre engagement à investir dans l'avenir et à protéger les jeunes. Un grand merci à tous les membres de notre club et aux organisateurs du séminaire pour cette expérience enrichissante. Ensemble, nous faisons la différence !",
      descriptionEn:
        'I had the honor of participating in the 5th edition of the TLCS (Tunisian Lions Campus Seminar) 2024-2025 to present our project "Ahna Maak," a cherished initiative of our club Leo Club Boumhal La Providence. I\'m thrilled to announce that we won 2nd place! The goal of "Ahna Maak" is to support and assist at-risk teenagers by providing them with guidance, a listening ear, and opportunities for personal growth. This initiative aligns perfectly with the new youth-focused axis of Lions Clubs International, reflecting our dedication to investing in the future and protecting young people. A heartfelt thank you to all our club members and the seminar organizers for this enriching experience. Together, we make a difference!',
      dateLabel: "2024-2025",
      photosUrl: "https://lnkd.in/p/eGV797QF",
      sortOrder: 0,
    },
  });
  console.log("• Award créé (1).");
}

async function seedSponsors() {
  if ((await prisma.sponsor.count()) > 0) {
    console.log("• Sponsors déjà présents — inchangés.");
    return;
  }

  const names = ["Polina", "SFBT", "Safia", "Naaroua", "Saida"];
  await prisma.sponsor.createMany({
    data: names.map((name, index) => ({ name, sortOrder: index })),
  });
  console.log(`• Sponsors créés (${names.length}).`);
}

async function seedInterests() {
  if ((await prisma.interest.count()) > 0) {
    console.log("• Interests déjà présents — inchangés.");
    return;
  }

  await prisma.interest.createMany({
    data: [
      { labelFr: "Voyages", labelEn: "Traveling", icon: "Plane", sortOrder: 0 },
      { labelFr: "Course à pied", labelEn: "Running", icon: "Footprints", sortOrder: 1 },
      { labelFr: "Vie associative", labelEn: "Community engagement", icon: "HeartHandshake", sortOrder: 2 },
      { labelFr: "Cuisine", labelEn: "Cooking", icon: "ChefHat", sortOrder: 3 },
    ],
  });
  console.log("• Interests créés (4).");
}

async function seedSocialLinks() {
  if ((await prisma.socialLink.count()) > 0) {
    console.log("• SocialLinks déjà présents — inchangés.");
    return;
  }

  await prisma.socialLink.createMany({
    data: [
      {
        platform: "linkedin",
        labelFr: "LinkedIn",
        labelEn: "LinkedIn",
        url: "https://linkedin.com/in/ghassen-sakka",
        sortOrder: 0,
      },
      {
        platform: "email",
        labelFr: "Email",
        labelEn: "Email",
        url: "mailto:sakkaghassen@gmail.com",
        sortOrder: 1,
      },
    ],
  });
  console.log("• SocialLinks créés (2).");
}

async function main() {
  console.log("Seed du portfolio Ghassen SAKKA — démarrage...");
  await seedAdminUser();
  await seedProfile();
  await seedEducation();
  await seedCertifications();
  await seedExperiences();
  await seedProjects();
  await seedAssociativeRoles();
  await seedAssociativeActions();
  await seedAwards();
  await seedSponsors();
  await seedInterests();
  await seedSocialLinks();
  console.log("Seed terminé avec succès.");
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
