import { PrismaClient, CategoryType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { CVData } from '../lib/cv';
import 'dotenv/config';

// Create Prisma client with pg adapter (same as lib/prisma.ts)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ============================================================================
// SAMPLE CV DATA FOR EACH NICHE
// Using the correct CVData schema from lib/cv.ts
// ============================================================================

const sampleCVs: Record<string, CVData> = {
    // Tech & SaaS
    'zendesk-support-medewerker': {
        personal: {
            name: 'Daan van der Berg',
            title: 'Zendesk Support Specialist',
            email: 'daan.vdberg@email.nl',
            phone: '06-12345678',
            location: 'Amsterdam',
            address: 'Herengracht 100',
            postalCode: '1015 BS',
            summary: 'Enthousiaste Zendesk Support Specialist met 3 jaar ervaring in B2B SaaS-omgevingen. Expert in het optimaliseren van support workflows, het creëren van kennisbankartikelen en het behalen van hoge klanttevredenheidsscores (CSAT 95%+).',
            birthDate: '15 maart 1995',
            birthPlace: 'Utrecht',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/daanvdberg',
            github: '',
            
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Senior Support Specialist',
                company: 'TechFlow B.V.',
                location: 'Amsterdam',
                start: 'januari 2022',
                end: 'heden',
                description: 'Eerstelijns en tweedelijns support voor SaaS-platform met 50.000+ gebruikers.',
                highlights: [
                    'CSAT-score verhoogd van 87% naar 96% door verbeterde response templates',
                    'Zendesk workflow geautomatiseerd waardoor responstijd met 40% daalde',
                    '200+ kennisbankartikelen geschreven en onderhouden',
                ],
            },
            {
                role: 'Customer Support Agent',
                company: 'CloudServe Nederland',
                location: 'Rotterdam',
                start: 'juni 2020',
                end: 'december 2021',
                description: 'Klantenservice voor cloud hosting diensten via Zendesk en live chat.',
                highlights: [
                    'Gemiddeld 60+ tickets per dag afgehandeld',
                    'Hoogste NPS-score van het team (72)',
                ],
            },
        ],
        education: [
            {
                degree: 'HBO Communicatie',
                school: 'Hogeschool van Amsterdam',
                location: 'Amsterdam',
                start: 'september 2016',
                end: 'juni 2020',
                description: 'Minor in Digital Marketing',
            },
        ],
        skills: [
            { name: 'Zendesk Suite', level: 5 },
            { name: 'Intercom', level: 4 },
            { name: 'Jira Service Desk', level: 4 },
            { name: 'Salesforce', level: 3 },
            { name: 'SQL Basics', level: 3 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
            { name: 'Duits', level: 'Goed' },
        ],
        interests: ['Tech podcasts', 'UX Design', 'Escape rooms'],
        courses: [
            { name: 'Zendesk Administrator Certification', institution: 'Zendesk', year: '2023' },
            { name: 'ITIL Foundation', institution: 'AXELOS', year: '2022' },
        ],
        internships: [],
        awards: [],
    },

    'backend-developer-nodejs': {
        personal: {
            name: 'Thomas de Vries',
            title: 'Backend Developer Node.js',
            email: 'thomas.devries@email.nl',
            phone: '06-98765432',
            location: 'Rotterdam',
            address: 'Westerstraat 50',
            postalCode: '3016 DH',
            summary: 'Ervaren Backend Developer gespecialiseerd in Node.js en TypeScript met 5+ jaar ervaring in het bouwen van schaalbare microservices en REST APIs. Track record in high-traffic applicaties (1M+ requests/dag).',
            birthDate: '22 augustus 1992',
            birthPlace: 'Rotterdam',
            nationality: 'Nederlands',
            driversLicense: '',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/thomasdevries',
            github: '',
            website: 'github.com/thomasdevries',
            photo: '',
        },
        experience: [
            {
                role: 'Senior Backend Developer',
                company: 'ScaleUp Tech',
                location: 'Rotterdam',
                start: 'maart 2021',
                end: 'heden',
                description: 'Lead developer voor het payment processing platform.',
                highlights: [
                    'Microservices architectuur ontworpen voor 2M+ transacties per dag',
                    'API response time gereduceerd van 800ms naar 120ms',
                    'CI/CD pipeline opgezet met GitHub Actions en AWS',
                ],
            },
            {
                role: 'Backend Developer',
                company: 'Digital Agency XYZ',
                location: 'Amsterdam',
                start: 'september 2018',
                end: 'februari 2021',
                description: 'Full-stack development voor enterprise clients.',
                highlights: [
                    'REST APIs gebouwd voor 15+ client projecten',
                    'Unit test coverage verhoogd naar 85%',
                ],
            },
        ],
        education: [
            {
                degree: 'MSc Computer Science',
                school: 'TU Delft',
                location: 'Delft',
                start: 'september 2014',
                end: 'juli 2017',
                description: 'Specialisatie: Distributed Systems',
            },
        ],
        skills: [
            { name: 'Node.js', level: 5 },
            { name: 'TypeScript', level: 5 },
            { name: 'PostgreSQL', level: 4 },
            { name: 'MongoDB', level: 4 },
            { name: 'Docker/Kubernetes', level: 4 },
            { name: 'AWS', level: 4 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
        ],
        interests: ['Open Source', 'Tech Meetups', 'Chess'],
        courses: [
            { name: 'AWS Solutions Architect', institution: 'Amazon', year: '2023' },
        ],
        internships: [],
        awards: [],
    },

    'frontend-react-developer': {
        personal: {
            name: 'Lisa Jansen',
            title: 'Frontend React Developer',
            email: 'lisa.jansen@email.nl',
            phone: '06-11223344',
            location: 'Utrecht',
            address: 'Oudegracht 200',
            postalCode: '3511 NR',
            summary: 'Creatieve Frontend Developer met passie voor React en moderne web technologies. 4 jaar ervaring in het bouwen van responsive, toegankelijke web applicaties.',
            birthDate: '8 november 1994',
            birthPlace: 'Amersfoort',
            nationality: 'Nederlands',
            driversLicense: '',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/lisajansen',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Frontend Developer',
                company: 'FinTech Startup',
                location: 'Utrecht',
                start: 'juni 2021',
                end: 'heden',
                description: 'Lead frontend development voor banking dashboard.',
                highlights: [
                    'React dashboard gebouwd met 50+ componenten en 100% TypeScript',
                    'Lighthouse score verbeterd naar 95+ op alle metrics',
                    'Design system opgezet met Storybook en Figma integratie',
                ],
            },
            {
                role: 'Junior Frontend Developer',
                company: 'E-commerce Platform',
                location: 'Amsterdam',
                start: 'september 2019',
                end: 'mei 2021',
                description: 'Frontend development voor webshop met 100k+ producten.',
                highlights: [
                    'Product filtering component gebouwd met React Query',
                    'Performance geoptimaliseerd: load time -60%',
                ],
            },
        ],
        education: [
            {
                degree: 'HBO Informatica',
                school: 'Hogeschool Utrecht',
                location: 'Utrecht',
                start: 'september 2015',
                end: 'juli 2019',
                description: 'Specialisatie Web Development',
            },
        ],
        skills: [
            { name: 'React', level: 5 },
            { name: 'TypeScript', level: 5 },
            { name: 'Next.js', level: 4 },
            { name: 'Tailwind CSS', level: 5 },
            { name: 'Testing (Jest/RTL)', level: 4 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
        ],
        interests: ['UI/UX Design', 'Web Accessibility', 'Yoga'],
        courses: [
            { name: 'Advanced React Patterns', institution: 'Frontend Masters', year: '2023' },
        ],
        internships: [],
        awards: [],
    },

    'junior-data-analist-python': {
        personal: {
            name: 'Sven Bakker',
            title: 'Junior Data Analist',
            email: 'sven.bakker@email.nl',
            phone: '06-55667788',
            location: 'Groningen',
            address: 'Grote Markt 15',
            postalCode: '9712 HS',
            summary: 'Ambitieuze Junior Data Analist met sterke Python skills en passie voor data-gedreven besluitvorming. Recent afgestudeerd met hands-on ervaring in data cleaning, visualisatie en machine learning basics.',
            birthDate: '14 februari 1998',
            birthPlace: 'Groningen',
            nationality: 'Nederlands',
            driversLicense: '',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/svenbakker',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Data Analyst Intern',
                company: 'Marketing Bureau Noord',
                location: 'Groningen',
                start: 'februari 2023',
                end: 'augustus 2023',
                description: 'Data analyse voor marketing campagnes.',
                highlights: [
                    'Dashboard gebouwd in Python/Streamlit voor campagne performance',
                    'Customer segmentatie uitgevoerd met K-means clustering',
                    'Rapportages geautomatiseerd waardoor 8 uur/week bespaard werd',
                ],
            },
        ],
        education: [
            {
                degree: 'BSc Econometrie',
                school: 'Rijksuniversiteit Groningen',
                location: 'Groningen',
                start: 'september 2019',
                end: 'juli 2023',
                description: 'Minor in Data Science. Scriptie over predictive analytics in retail.',
            },
        ],
        skills: [
            { name: 'Python', level: 4 },
            { name: 'Pandas/NumPy', level: 4 },
            { name: 'SQL', level: 4 },
            { name: 'Power BI', level: 3 },
            { name: 'Scikit-learn', level: 3 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
        ],
        interests: ['Machine Learning', 'Statistiek', 'Schaatsen'],
        courses: [
            { name: 'Google Data Analytics Certificate', institution: 'Google', year: '2023' },
        ],
        internships: [],
        awards: [],
    },

    // Logistics
    'magazijnmedewerker-nachtdienst': {
        personal: {
            name: 'Kevin Smit',
            title: 'Magazijnmedewerker',
            email: 'kevin.smit@email.nl',
            phone: '06-33445566',
            location: 'Tilburg',
            address: 'Industrieweg 88',
            postalCode: '5015 BX',
            summary: 'Betrouwbare en fysiek fitte magazijnmedewerker met 6 jaar ervaring in nachtdiensten. Gewend aan werken onder tijdsdruk en het halen van strakke deadlines. Pick-rate van 150+ items per uur.',
            birthDate: '20 juni 1990',
            birthPlace: 'Breda',
            nationality: 'Nederlands',
            driversLicense: 'B, Heftruck',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Senior Magazijnmedewerker',
                company: 'E-commerce Fulfillment Center',
                location: 'Tilburg',
                start: 'maart 2020',
                end: 'heden',
                description: 'Nachtdienst orderpicking en expeditie.',
                highlights: [
                    'Teamleider voor nachtploeg van 8 medewerkers',
                    'Pick-rate van 150+ items per uur (team gemiddelde: 110)',
                    'Foutpercentage onder 0.1% gehouden',
                ],
            },
            {
                role: 'Magazijnmedewerker',
                company: 'Logistiek Bedrijf Zuid',
                location: 'Breda',
                start: 'mei 2017',
                end: 'februari 2020',
                description: 'Goederenontvangst, opslag en orderverzameling.',
                highlights: [
                    'Reachtruck en EPT gecertificeerd',
                    'Geen ongevallen in 3 jaar',
                ],
            },
        ],
        education: [
            {
                degree: 'MBO Logistiek Niveau 2',
                school: 'ROC Tilburg',
                location: 'Tilburg',
                start: 'september 2014',
                end: 'april 2017',
                description: '',
            },
        ],
        skills: [
            { name: 'Orderpicking', level: 5 },
            { name: 'WMS Systemen', level: 4 },
            { name: 'Heftruck (reachtruck)', level: 5 },
            { name: 'Voorraadbeheer', level: 4 },
            { name: 'EPT', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Basis' },
        ],
        interests: ['Fitness', 'Voetbal', 'Klussen'],
        courses: [
            { name: 'VCA Basis', institution: 'SSVV', year: '2020' },
            { name: 'Heftruck Certificaat', institution: 'BMWT', year: '2018' },
        ],
        internships: [],
        awards: [],
    },

    'heftruckchauffeur-certificaat': {
        personal: {
            name: 'Patrick de Groot',
            title: 'Heftruckchauffeur',
            email: 'patrick.degroot@email.nl',
            phone: '06-77889900',
            location: 'Rotterdam',
            address: 'Havenweg 42',
            postalCode: '3089 JK',
            summary: 'Gecertificeerd heftruckchauffeur met 10+ jaar ervaring in haven- en industriële omgevingen. Alle heftruckcertificaten (reachtruck, frontheftruck, EPT, PPT). Uitstekende staat van dienst op het gebied van veiligheid.',
            birthDate: '3 december 1985',
            birthPlace: 'Rotterdam',
            nationality: 'Nederlands',
            driversLicense: 'B, C, Heftruck alle categorieën',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Senior Heftruckchauffeur',
                company: 'Havenbedrijf Rotterdam',
                location: 'Rotterdam',
                start: 'januari 2018',
                end: 'heden',
                description: 'Laden en lossen van containers en bulk goederen.',
                highlights: [
                    '0 incidenten in 5+ jaar',
                    'Mentor voor 20+ nieuwe chauffeurs',
                    'Specialist in zware lasten tot 25 ton',
                ],
            },
            {
                role: 'Heftruckchauffeur',
                company: 'Bouwmaterialen Groothandel',
                location: 'Dordrecht',
                start: 'april 2013',
                end: 'december 2017',
                description: 'Magazijnwerk en klantbelevering.',
                highlights: [
                    'Alle heftruckcertificaten behaald',
                    'Voorraadadministratie in SAP',
                ],
            },
        ],
        education: [
            {
                degree: 'MBO Transport en Logistiek Niveau 2',
                school: 'ROC Albeda',
                location: 'Rotterdam',
                start: 'september 2010',
                end: 'maart 2013',
                description: '',
            },
        ],
        skills: [
            { name: 'Heftruck (alle types)', level: 5 },
            { name: 'Reachtruck', level: 5 },
            { name: 'EPT/PPT', level: 5 },
            { name: 'SAP WM', level: 3 },
            { name: 'Veiligheidsprotocollen', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Goed' },
        ],
        interests: ['Motorsport', 'Vissen', 'Techniek'],
        courses: [
            { name: 'VCA VOL', institution: 'SSVV', year: '2023' },
            { name: 'Heftruck Instructeur', institution: 'BMWT', year: '2021' },
        ],
        internships: [],
        awards: [],
    },

    'vrachtwagenchauffeur-internationaal': {
        personal: {
            name: 'Marco Visser',
            title: 'Internationaal Vrachtwagenchauffeur',
            email: 'marco.visser@email.nl',
            phone: '06-11229988',
            location: 'Roosendaal',
            address: 'Transportlaan 5',
            postalCode: '4703 RB',
            summary: 'Ervaren internationaal vrachtwagenchauffeur met 12 jaar ervaring in heel Europa. Specialisatie in temperatuurgecontroleerd transport en ADR-goederen. Bekend met rij- en rusttijdenwetgeving.',
            birthDate: '17 september 1982',
            birthPlace: 'Bergen op Zoom',
            nationality: 'Nederlands',
            driversLicense: 'B, C, CE, Code 95',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Internationaal Chauffeur',
                company: 'Euro Transport Solutions',
                location: 'Roosendaal',
                start: 'juni 2016',
                end: 'heden',
                description: 'Internationaal transport door heel Europa.',
                highlights: [
                    'Routes naar 15+ Europese landen',
                    'Specialisatie koeltransport (-25°C)',
                    'ADR basis + tank gecertificeerd',
                ],
            },
            {
                role: 'Vrachtwagenchauffeur',
                company: 'Nationaal Vervoer BV',
                location: 'Breda',
                start: 'maart 2011',
                end: 'mei 2016',
                description: 'Nationaal distributievervoer.',
                highlights: [
                    'Dagelijks 15-20 afleveradressen',
                    'Geen schades in 5 jaar',
                ],
            },
        ],
        education: [
            {
                degree: 'Rijbewijs CE + Code 95',
                school: 'Rijschool Transport',
                location: 'Breda',
                start: 'januari 2010',
                end: 'december 2010',
                description: 'Groot rijbewijs met aanhanger',
            },
        ],
        skills: [
            { name: 'Internationaal transport', level: 5 },
            { name: 'Koeltransport', level: 5 },
            { name: 'ADR', level: 4 },
            { name: 'Douaneprocedures', level: 4 },
            { name: 'Routeplanning', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Goed' },
            { name: 'Duits', level: 'Goed' },
        ],
        interests: ['Reizen', 'Fotografie', 'Campers'],
        courses: [
            { name: 'Code 95 Nascholing', institution: 'SOOB', year: '2023' },
            { name: 'ADR Basis + Tank', institution: 'CBR', year: '2022' },
        ],
        internships: [],
        awards: [],
    },

    // Healthcare
    'verpleegkundige-icu': {
        personal: {
            name: 'Emma van Dijk',
            title: 'IC-Verpleegkundige',
            email: 'emma.vandijk@email.nl',
            phone: '06-44556677',
            location: 'Utrecht',
            address: 'Zorgstraat 25',
            postalCode: '3511 KJ',
            summary: 'Gedreven IC-verpleegkundige met 7 jaar ervaring in acute zorg en complexe patiëntenzorg. Specialisatie in beademing, hemodynamische bewaking en post-operatieve zorg.',
            birthDate: '12 april 1991',
            birthPlace: 'Nijmegen',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'IC-Verpleegkundige',
                company: 'UMC Utrecht',
                location: 'Utrecht',
                start: 'maart 2019',
                end: 'heden',
                description: 'Intensive Care afdeling, 24 bedden.',
                highlights: [
                    'Zorg voor complexe IC-patiënten (trauma, cardio, neuro)',
                    'ECMO-team lid',
                    'Mentor voor 10+ verpleegkundigen in opleiding',
                ],
            },
            {
                role: 'Verpleegkundige Spoedeisende Hulp',
                company: 'Radboud UMC',
                location: 'Nijmegen',
                start: 'september 2016',
                end: 'februari 2019',
                description: 'SEH en acute opname afdeling.',
                highlights: [
                    'Triage volgens Manchester systeem',
                    'ALS en ATLS getraind',
                ],
            },
        ],
        education: [
            {
                degree: 'HBO-V Verpleegkunde',
                school: 'HAN University',
                location: 'Nijmegen',
                start: 'september 2012',
                end: 'juli 2016',
                description: '',
            },
            {
                degree: 'Specialisatie IC-Verpleegkundige',
                school: 'CZO',
                location: 'Utrecht',
                start: 'september 2019',
                end: 'juli 2021',
                description: '2-jarige vervolgopleiding Intensive Care',
            },
        ],
        skills: [
            { name: 'IC-verpleegkunde', level: 5 },
            { name: 'Beademing', level: 5 },
            { name: 'ECMO', level: 4 },
            { name: 'Hemodynamiek', level: 5 },
            { name: 'ALS/ATLS', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Goed' },
        ],
        interests: ['Yoga', 'Hardlopen', 'Medische innovatie'],
        courses: [
            { name: 'ALS Provider', institution: 'Nederlandse Reanimatieraad', year: '2023' },
        ],
        internships: [],
        awards: [],
    },

    'verzorgende-ig-ouderenzorg': {
        personal: {
            name: 'Marieke Hoekstra',
            title: 'Verzorgende IG',
            email: 'marieke.hoekstra@email.nl',
            phone: '06-99887766',
            location: 'Wierden',
            address: 'Dorpsstraat 12',
            postalCode: '7642 AK',
            summary: 'Warme en betrokken Verzorgende IG met 8 jaar ervaring in de ouderenzorg. Specialist in dementiezorg en palliatieve zorg. Sterke communicator met oog voor bewoners en hun families.',
            birthDate: '25 juli 1988',
            birthPlace: 'Almelo',
            nationality: 'Nederlands',
            driversLicense: '',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Verzorgende IG',
                company: 'Zorggroep Twente',
                location: 'Wierden',
                start: 'april 2018',
                end: 'heden',
                description: 'Psychogeriatrische afdeling met 30 bewoners.',
                highlights: [
                    'Coördinator voor 2 woongroepen',
                    'Specialisatie dementiezorg (Alzheimer, vasculair)',
                    'Familie-avonden georganiseerd',
                ],
            },
            {
                role: 'Verzorgende',
                company: 'Thuiszorg Overijssel',
                location: 'Almelo',
                start: 'juni 2015',
                end: 'maart 2018',
                description: 'Thuiszorg voor ouderen.',
                highlights: [
                    'Zelfstandig werken bij 15+ cliënten per week',
                    'ADL-ondersteuning en medicatiebeheer',
                ],
            },
        ],
        education: [
            {
                degree: 'MBO Verzorgende IG Niveau 3',
                school: 'ROC Twente',
                location: 'Almelo',
                start: 'september 2012',
                end: 'juni 2015',
                description: '',
            },
        ],
        skills: [
            { name: 'ADL-ondersteuning', level: 5 },
            { name: 'Dementiezorg', level: 5 },
            { name: 'Palliatieve zorg', level: 4 },
            { name: 'Medicatiebeheer', level: 4 },
            { name: 'ECD/Zorgplannen', level: 4 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Duits', level: 'Basis' },
        ],
        interests: ['Tuinieren', 'Wandelen', 'Koken'],
        courses: [
            { name: 'Dementie Specialist', institution: 'Vilans', year: '2022' },
            { name: 'Palliatieve Zorg', institution: 'IKNL', year: '2021' },
        ],
        internships: [],
        awards: [],
    },

    // Career Situations
    'carrièreswitch-naar-it': {
        personal: {
            name: 'Jeroen Peters',
            title: 'Junior Developer (Career Switch)',
            email: 'jeroen.peters@email.nl',
            phone: '06-22334455',
            location: 'Arnhem',
            address: 'Parkweg 88',
            postalCode: '6811 KL',
            summary: 'Ambitieuze professional in carrièreswitch van sales naar IT. 8 jaar ervaring in B2B sales waarbij analytisch denken centraal stond. Recent omgeschoold tot Junior Developer met focus op Python en webdevelopment.',
            birthDate: '30 maart 1987',
            birthPlace: 'Arnhem',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/jeroenpeters',
            github: 'github.com/jeroenpeters',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Junior Developer (Trainee)',
                company: 'Freelance',
                location: 'Arnhem',
                start: 'september 2023',
                end: 'heden',
                description: 'Zelfstandige projecten tijdens omscholing.',
                highlights: [
                    'Portfolio website gebouwd met React en Next.js',
                    'Python automatiseringsscripts voor lokale ondernemers',
                    'Open source bijdragen aan 2 GitHub projecten',
                ],
            },
            {
                role: 'Senior Account Manager',
                company: 'Tech Solutions BV',
                location: 'Arnhem',
                start: 'januari 2017',
                end: 'augustus 2023',
                description: 'B2B sales van IT-oplossingen aan MKB.',
                highlights: [
                    'Portfolio van €2M+ jaarlijkse omzet beheerd',
                    'Beste verkoper 2020 en 2021',
                ],
            },
        ],
        education: [
            {
                degree: 'Full Stack Web Development',
                school: 'Codecademy / Udemy',
                location: 'Online',
                start: 'januari 2023',
                end: 'augustus 2023',
                description: 'Intensieve zelfstudie: Python, JavaScript, React, SQL',
            },
            {
                degree: 'HBO Commerciële Economie',
                school: 'Hogeschool Arnhem Nijmegen',
                location: 'Arnhem',
                start: 'september 2010',
                end: 'juni 2014',
                description: '',
            },
        ],
        skills: [
            { name: 'Python', level: 3 },
            { name: 'JavaScript/React', level: 3 },
            { name: 'SQL', level: 3 },
            { name: 'Communicatie', level: 5 },
            { name: 'Probleemoplossend', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
            { name: 'Duits', level: 'Goed' },
        ],
        interests: ['Programmeren', 'Tech Podcasts', 'Mountainbiken'],
        courses: [
            { name: 'CS50 Introduction to Computer Science', institution: 'Harvard/edX', year: '2023' },
        ],
        internships: [],
        awards: [],
    },

    'zonder-ervaring-horeca': {
        personal: {
            name: 'Fleur de Jong',
            title: 'MBO Student Horeca',
            email: 'fleur.dejong@email.nl',
            phone: '06-66778899',
            location: 'Groningen',
            address: 'Studentenlaan 42',
            postalCode: '9747 AG',
            summary: 'Enthousiaste en leergierige MBO-student op zoek naar eerste baan in de horeca. Sociaal, energiek en niet bang om aan te pakken. Beschikbaar in avonden en weekenden.',
            birthDate: '22 november 2004',
            birthPlace: 'Groningen',
            nationality: 'Nederlands',
            driversLicense: '',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Vrijwilliger Kantine',
                company: 'Sportvereniging GVAV',
                location: 'Groningen',
                start: 'september 2022',
                end: 'heden',
                description: 'Bardienst tijdens wedstrijden.',
                highlights: [
                    'Klanten helpen en bestellingen opnemen',
                    'Kassa bedienen en afrekenen',
                ],
            },
        ],
        education: [
            {
                degree: 'MBO Horeca Assistent Niveau 2',
                school: 'Noorderpoort College',
                location: 'Groningen',
                start: 'september 2023',
                end: 'heden',
                description: 'Verwachte afstudeerdatum 2025',
            },
            {
                degree: 'VMBO Basis/Kader',
                school: 'Zernike College',
                location: 'Groningen',
                start: 'september 2019',
                end: 'juli 2023',
                description: 'Diploma behaald',
            },
        ],
        skills: [
            { name: 'Klantvriendelijkheid', level: 4 },
            { name: 'Teamwork', level: 4 },
            { name: 'Stressbestendig', level: 3 },
            { name: 'Flexibiliteit', level: 5 },
            { name: 'Leergierigheid', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Goed' },
        ],
        interests: ['Koken', 'Muziek', 'Vrienden'],
        courses: [],
        internships: [],
        awards: [],
    },

    'gat-in-cv-burn-out': {
        personal: {
            name: 'Linda Vermeer',
            title: 'Senior Project Manager',
            email: 'linda.vermeer@email.nl',
            phone: '06-11223344',
            location: 'Tilburg',
            address: 'Rustoord 15',
            postalCode: '5038 NS',
            summary: 'Ervaren projectmanager met bewezen track record in complexe IT-projecten. Na een periode van herstel volledig gemotiveerd om weer aan de slag te gaan. Verbeterde work-life balance skills en zelfinzicht.',
            birthDate: '14 augustus 1985',
            birthPlace: 'Eindhoven',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: 'linkedin.com/in/lindavermeer',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Persoonlijke ontwikkeling',
                company: 'Sabbatical / Herstelperiode',
                location: 'Tilburg',
                start: 'juni 2022',
                end: 'december 2023',
                description: 'Periode van herstel en reflectie.',
                highlights: [
                    'Succesvolle burnout-revalidatie afgerond',
                    'Coaching traject gevolgd voor stressmanagement',
                    'Vrijwilligerswerk bij lokale stichting',
                ],
            },
            {
                role: 'Senior Project Manager',
                company: 'IT Consultancy Firm',
                location: 'Eindhoven',
                start: 'januari 2016',
                end: 'mei 2022',
                description: 'IT-projecten voor enterprise clients.',
                highlights: [
                    '15+ projecten succesvol opgeleverd (€500K-€3M)',
                    'Teams van 5-20 personen aangestuurd',
                ],
            },
        ],
        education: [
            {
                degree: 'WO Bedrijfskunde',
                school: 'Tilburg University',
                location: 'Tilburg',
                start: 'september 2006',
                end: 'juli 2011',
                description: 'Master Information Management',
            },
        ],
        skills: [
            { name: 'Project Management', level: 5 },
            { name: 'Agile/Scrum', level: 5 },
            { name: 'PRINCE2', level: 4 },
            { name: 'Stakeholder Management', level: 5 },
            { name: 'Stressmanagement', level: 4 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
        ],
        interests: ['Mindfulness', 'Wandelen', 'Lezen'],
        courses: [
            { name: 'Stress & Burnout Preventie', institution: 'GITP', year: '2023' },
            { name: 'PMP Certificering', institution: 'PMI', year: '2018' },
        ],
        internships: [],
        awards: [],
    },

    // Office/Admin
    'directiesecretaresse': {
        personal: {
            name: 'Carla Hendriks',
            title: 'Directiesecretaresse',
            email: 'carla.hendriks@email.nl',
            phone: '06-55443322',
            location: 'Hilversum',
            address: 'Raadhuisplein 3',
            postalCode: '1211 PK',
            summary: 'Ervaren directiesecretaresse met 15+ jaar ervaring op C-level niveau. Expert in agenda- en vergadermanagement, vertrouwelijke correspondentie en het organiseren van complexe evenementen.',
            birthDate: '28 februari 1978',
            birthPlace: 'Amsterdam',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Executive Assistant / Directiesecretaresse',
                company: 'Multinational Finance Corp',
                location: 'Amsterdam',
                start: 'maart 2015',
                end: 'heden',
                description: 'Ondersteuning CEO en CFO.',
                highlights: [
                    'Agenda management voor 2 C-level executives',
                    'Internationale reisplanning en visumaanvragen',
                    'Board meetings georganiseerd (kwartaal)',
                ],
            },
            {
                role: 'Juridisch Secretaresse',
                company: 'Advocatenkantoor De Hoog',
                location: 'Hilversum',
                start: 'juni 2008',
                end: 'februari 2015',
                description: 'Ondersteuning 4 partners.',
                highlights: [
                    'Juridische correspondentie en contracten',
                    'Declaraties en tijdsregistratie',
                ],
            },
        ],
        education: [
            {
                degree: 'HBO Executive Secretary',
                school: 'Schoevers',
                location: 'Amsterdam',
                start: 'september 2005',
                end: 'juni 2008',
                description: '',
            },
        ],
        skills: [
            { name: 'Agenda Management', level: 5 },
            { name: 'MS Office (Expert)', level: 5 },
            { name: 'Notuleren', level: 5 },
            { name: 'Event Organisatie', level: 5 },
            { name: 'Vertrouwelijkheid', level: 5 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Vloeiend' },
            { name: 'Duits', level: 'Goed' },
        ],
        interests: ['Theater', 'Reizen', 'Kunst'],
        courses: [
            { name: 'Executive Assistant Masterclass', institution: 'Schoevers', year: '2022' },
        ],
        internships: [],
        awards: [],
    },

    'financial-controller-mkb': {
        personal: {
            name: 'Bas van Leeuwen',
            title: 'Financial Controller',
            email: 'bas.vanleeuwen@email.nl',
            phone: '06-88776655',
            location: 'Barneveld',
            address: 'Bedrijvenpark 100',
            postalCode: '3771 MA',
            summary: 'Hands-on Financial Controller met 10+ jaar ervaring in MKB-omgevingen. Sterk in het opzetten van financiële processen, forecasting en het adviseren van directie.',
            birthDate: '10 juni 1983',
            birthPlace: 'Amersfoort',
            nationality: 'Nederlands',
            driversLicense: 'B',
            gender: '',
            maritalStatus: '',
            linkedIn: '',
            github: '',
            website: '',
            photo: '',
        },
        experience: [
            {
                role: 'Financial Controller',
                company: 'Groeiend Techbedrijf BV',
                location: 'Amersfoort',
                start: 'september 2018',
                end: 'heden',
                description: 'Verantwoordelijk voor gehele financiële administratie.',
                highlights: [
                    'Maand- en jaarafsluiting (binnen 5 werkdagen)',
                    'Rapportages voor directie en investeerders',
                    'ERP-implementatie geleid (Exact)',
                ],
            },
            {
                role: 'Senior Financieel Medewerker',
                company: 'Familiebedrijf Industrie',
                location: 'Barneveld',
                start: 'april 2013',
                end: 'augustus 2018',
                description: 'Financiële administratie en controlling.',
                highlights: [
                    'Krediet- en debiteurbeheer',
                    'BTW- en jaaraangiftes',
                ],
            },
        ],
        education: [
            {
                degree: 'HBO Accountancy',
                school: 'Hogeschool Utrecht',
                location: 'Utrecht',
                start: 'september 2005',
                end: 'juli 2009',
                description: '',
            },
        ],
        skills: [
            { name: 'Financiële rapportage', level: 5 },
            { name: 'Exact Online/Globe', level: 5 },
            { name: 'Excel (Advanced)', level: 5 },
            { name: 'Budgettering', level: 5 },
            { name: 'Power BI', level: 4 },
        ],
        languages: [
            { name: 'Nederlands', level: 'Moedertaal' },
            { name: 'Engels', level: 'Goed' },
        ],
        interests: ['Golf', 'Financiële markten', 'Wijn'],
        courses: [
            { name: 'Registercontroller (RC)', institution: 'VRC', year: '2021' },
        ],
        internships: [],
        awards: [],
    },
};

// Default sample CV for categories without specific content
const defaultSampleCV: CVData = {
    personal: {
        name: 'Jan de Vries',
        title: 'Functietitel',
        email: 'jan.devries@email.nl',
        phone: '06-12345678',
        location: 'Amsterdam',
        address: 'Hoofdstraat 1',
        postalCode: '1234 AB',
        summary: 'Gemotiveerde professional met relevante ervaring in dit vakgebied.',
        birthDate: '',
        birthPlace: '',
        nationality: 'Nederlands',
        driversLicense: '',
        gender: '',
        maritalStatus: '',
        linkedIn: '',
        github: '',
        website: '',
        photo: '',
    },
    experience: [
        {
            role: 'Functietitel',
            company: 'Voorbeeldbedrijf B.V.',
            location: 'Amsterdam',
            start: 'januari 2020',
            end: 'heden',
            description: 'Beschrijving van werkzaamheden.',
            highlights: ['Prestatie 1', 'Prestatie 2'],
        },
    ],
    education: [
        {
            degree: 'HBO Studierichting',
            school: 'Hogeschool',
            location: 'Amsterdam',
            start: 'september 2016',
            end: 'juli 2020',
            description: '',
        },
    ],
    skills: [
        { name: 'Vaardigheid 1', level: 4 },
        { name: 'Vaardigheid 2', level: 4 },
    ],
    languages: [
        { name: 'Nederlands', level: 'Moedertaal' },
        { name: 'Engels', level: 'Goed' },
    ],
    interests: ['Hobby 1', 'Hobby 2'],
    courses: [],
    internships: [],
    awards: [],
};

// ============================================================================
// CATEGORY DATA
// ============================================================================

interface CategoryData {
    slug: string;
    name: string;
    nameDutch: string;
    description: string;
    type: CategoryType;
    parentSlug?: string;
    heroTitle?: string;
    heroText?: string;
    tips: string[];
    metaTitle: string;
    metaDesc: string;
    keywords: string[];
    sampleCV?: CVData;
}

const categories: CategoryData[] = [
    // =========================================================================
    // PILLAR 1: Tech & SaaS
    // =========================================================================
    {
        slug: 'ict-en-software',
        name: 'Tech & SaaS',
        nameDutch: 'ICT & Software',
        description: 'CV voorbeelden voor developers, data specialisten, support medewerkers en andere tech professionals. Van junior tot senior, van startup tot enterprise.',
        type: 'pillar',
        heroTitle: 'CV Voorbeelden ICT & Software',
        heroText: 'Werk je in de tech? Vind het perfecte CV voorbeeld voor jouw specialisatie. Of je nu developer bent, data analist, of support specialist - wij hebben een passend template met voorbeeldteksten.',
        tips: [
            'Vermeld specifieke technologieën en frameworks (React, Node.js, Python)',
            'Toon meetbare resultaten: performance verbeteringen, bugs opgelost',
            'Link naar je GitHub, portfolio of LinkedIn profiel',
            'Gebruik technische termen die relevant zijn voor de vacature',
        ],
        metaTitle: 'CV Voorbeeld ICT & Software | Tech CV Templates | WerkCV.nl',
        metaDesc: 'Professionele CV voorbeelden voor ICT professionals. Developer, Data Analist, Support Specialist en meer. Download gratis templates met voorbeeldteksten.',
        keywords: ['cv voorbeeld ict', 'cv developer', 'cv software engineer', 'tech cv', 'it cv voorbeeld'],
    },

    // Tech Sub-hubs and Spokes
    {
        slug: 'developer',
        name: 'Developer',
        nameDutch: 'Developer',
        description: 'CV voorbeelden voor software developers. Backend, frontend, fullstack - vind het perfecte template voor jouw tech stack.',
        type: 'subhub',
        parentSlug: 'ict-en-software',
        tips: [
            'Highlight je tech stack prominent',
            'Toon GitHub projecten of portfolio',
            'Vermeld CI/CD en testing ervaring',
        ],
        metaTitle: 'CV Voorbeeld Developer | Software Developer CV | WerkCV.nl',
        metaDesc: 'CV voorbeelden speciaal voor developers. Backend, Frontend, Fullstack templates met voorbeeldteksten. Start direct.',
        keywords: ['cv developer', 'cv software developer', 'cv programmeur'],
    },
    {
        slug: 'backend-developer-nodejs',
        name: 'Backend Developer Node.js',
        nameDutch: 'Backend Developer Node.js',
        description: 'Specialistisch CV voorbeeld voor Node.js backend developers. Inclusief voorbeeldteksten voor REST APIs, microservices en database ervaring.',
        type: 'spoke',
        parentSlug: 'developer',
        heroTitle: 'CV Voorbeeld Backend Developer Node.js',
        heroText: 'Als Node.js developer wil je je technische skills en projectervaring goed presenteren. Dit CV voorbeeld toont hoe je je expertise in JavaScript, TypeScript en server-side development overtuigend neerzet.',
        tips: [
            'Vermeld Node.js versies en relevante frameworks (Express, NestJS, Fastify)',
            'Toon ervaring met databases (PostgreSQL, MongoDB, Redis)',
            'Highlight API design en microservices architectuur',
            'Vermeld testing (Jest, Mocha) en CI/CD ervaring',
        ],
        metaTitle: 'CV Voorbeeld Backend Developer Node.js | WerkCV.nl',
        metaDesc: 'Professioneel CV voorbeeld voor Node.js Backend Developers. Met voorbeeldteksten voor APIs, microservices en databases. Download gratis.',
        keywords: ['cv backend developer nodejs', 'cv nodejs developer', 'backend cv voorbeeld'],
        sampleCV: sampleCVs['backend-developer-nodejs'],
    },
    {
        slug: 'frontend-react-developer',
        name: 'Frontend React Developer',
        nameDutch: 'Frontend React Developer',
        description: 'CV voorbeeld specifiek voor React developers. Laat zien hoe je je component architecture, state management en UI/UX skills presenteert.',
        type: 'spoke',
        parentSlug: 'developer',
        heroTitle: 'CV Voorbeeld Frontend React Developer',
        heroText: 'React is een van de meest gevraagde skills. Dit CV voorbeeld helpt je om je React expertise, moderne tooling kennis en design skills overtuigend te presenteren.',
        tips: [
            'Vermeld React versie en gerelateerde libraries (Redux, React Query)',
            'Toon ervaring met TypeScript en moderne build tools',
            'Highlight responsive design en accessibility kennis',
            'Link naar live projecten of CodeSandbox voorbeelden',
        ],
        metaTitle: 'CV Voorbeeld Frontend React Developer | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor React Frontend Developers. Met voorbeeldteksten voor componenten, state management en moderne tooling.',
        keywords: ['cv frontend react', 'cv react developer', 'frontend cv voorbeeld'],
        sampleCV: sampleCVs['frontend-react-developer'],
    },
    {
        slug: 'data-specialist',
        name: 'Data Specialist',
        nameDutch: 'Data Specialist',
        description: 'CV voorbeelden voor data professionals. Data analysts, data engineers en data scientists.',
        type: 'subhub',
        parentSlug: 'ict-en-software',
        tips: [
            'Toon je analytische projecten en resultaten',
            'Vermeld tools: Python, SQL, Power BI, Tableau',
            'Highlight business impact van je analyses',
        ],
        metaTitle: 'CV Voorbeeld Data Specialist | Data Analyst CV | WerkCV.nl',
        metaDesc: 'CV voorbeelden voor data professionals. Data Analyst, Data Engineer, Data Scientist templates.',
        keywords: ['cv data analyst', 'cv data specialist', 'cv data scientist'],
    },
    {
        slug: 'junior-data-analist-python',
        name: 'Junior Data Analist Python',
        nameDutch: 'Junior Data Analist Python',
        description: 'CV voorbeeld voor starters in data analyse. Perfect als je net afgestudeerd bent of aan het omscholen bent naar data.',
        type: 'spoke',
        parentSlug: 'data-specialist',
        heroTitle: 'CV Voorbeeld Junior Data Analist',
        heroText: 'Start je carrière als data analist? Dit CV voorbeeld toont hoe je je Python skills, statistische kennis en eerste projecten overtuigend presenteert, ook zonder veel werkervaring.',
        tips: [
            'Vermeld je Python data stack (Pandas, NumPy, Matplotlib)',
            'Toon projecten uit studie of persoonlijke projecten',
            'Highlight relevante certificeringen (Google, DataCamp)',
            'Benadruk analytisch denken en leervermogen',
        ],
        metaTitle: 'CV Voorbeeld Junior Data Analist Python | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor Junior Data Analisten met Python. Perfect voor starters. Met voorbeeldteksten en tips.',
        keywords: ['cv junior data analist', 'cv data analist python', 'cv starter data'],
        sampleCV: sampleCVs['junior-data-analist-python'],
    },
    {
        slug: 'zendesk-support-medewerker',
        name: 'Zendesk Support Medewerker',
        nameDutch: 'Zendesk Support Medewerker',
        description: 'CV voorbeeld voor customer support professionals met Zendesk expertise. Ideaal voor SaaS en tech bedrijven.',
        type: 'spoke',
        parentSlug: 'ict-en-software',
        heroTitle: 'CV Voorbeeld Zendesk Support Medewerker',
        heroText: 'Support in een SaaS omgeving vraagt specifieke skills. Dit CV voorbeeld toont hoe je je Zendesk expertise, CSAT scores en technische troubleshooting vaardigheden presenteert.',
        tips: [
            'Vermeld specifieke Zendesk kennis (macros, triggers, automations)',
            'Toon CSAT, NPS of andere klanttevredenheidsmetrics',
            'Highlight technische troubleshooting ervaring',
            'Vermeld ervaring met kennisbanken en documentatie',
        ],
        metaTitle: 'CV Voorbeeld Zendesk Support Medewerker | WerkCV.nl',
        metaDesc: 'Professioneel CV voorbeeld voor Zendesk Support Specialists. Met voorbeeldteksten voor CSAT, tickets en SaaS support.',
        keywords: ['cv zendesk support', 'cv customer support', 'cv support medewerker saas'],
        sampleCV: sampleCVs['zendesk-support-medewerker'],
    },

    // =========================================================================
    // PILLAR 2: Logistics & Transport
    // =========================================================================
    {
        slug: 'logistiek-en-transport',
        name: 'Logistics & Transport',
        nameDutch: 'Logistiek & Transport',
        description: 'CV voorbeelden voor magazijnmedewerkers, chauffeurs en logistiek planners. Van MBO tot HBO niveau.',
        type: 'pillar',
        heroTitle: 'CV Voorbeelden Logistiek & Transport',
        heroText: 'Werk je in de logistiek of transport sector? Vind CV voorbeelden voor magazijn, transport en planning functies. Met tips voor certificaten en praktijkervaring.',
        tips: [
            'Vermeld alle relevante certificaten (heftruck, VCA, ADR)',
            'Toon ervaring met WMS systemen',
            'Highlight fysieke fitheid en bereidheid tot ploegendiensten',
            'Vermeld rijbewijzen en vervoersvergunningen',
        ],
        metaTitle: 'CV Voorbeeld Logistiek & Transport | WerkCV.nl',
        metaDesc: 'CV voorbeelden voor logistiek en transport professionals. Magazijn, chauffeur, planning functies. Inclusief certificaat tips.',
        keywords: ['cv logistiek', 'cv transport', 'cv magazijn', 'cv chauffeur'],
    },

    // Logistics Spokes
    {
        slug: 'magazijnmedewerker-nachtdienst',
        name: 'Magazijnmedewerker Nachtdienst',
        nameDutch: 'Magazijnmedewerker Nachtdienst',
        description: 'CV voorbeeld specifiek voor magazijnwerk in nachtdiensten. Benadruk je flexibiliteit en ervaring met orderpicking onder tijdsdruk.',
        type: 'spoke',
        parentSlug: 'logistiek-en-transport',
        heroTitle: 'CV Voorbeeld Magazijnmedewerker Nachtdienst',
        heroText: 'Nachtdiensten in het magazijn vragen specifieke kwaliteiten. Dit CV voorbeeld toont hoe je je beschikbaarheid, snelheid en nauwkeurigheid presenteert aan werkgevers.',
        tips: [
            'Benadruk bereidheid tot nacht- en weekendwerk expliciet',
            'Vermeld pick-rates of efficiëntiecijfers indien beschikbaar',
            'Toon ervaring met WMS en barcodescanners',
            'Highlight teamwork en zelfstandig kunnen werken',
        ],
        metaTitle: 'CV Voorbeeld Magazijnmedewerker Nachtdienst | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor magazijnmedewerkers in nachtdienst. Tips voor orderpicking, certificaten en beschikbaarheid.',
        keywords: ['cv magazijnmedewerker nachtdienst', 'cv orderpicker nacht', 'cv magazijn'],
        sampleCV: sampleCVs['magazijnmedewerker-nachtdienst'],
    },
    {
        slug: 'heftruckchauffeur-certificaat',
        name: 'Heftruckchauffeur met Certificaat',
        nameDutch: 'Heftruckchauffeur met Certificaat',
        description: 'CV voorbeeld voor gecertificeerde heftruckchauffeurs. Toon je certificaten en veiligheidsbewustzijn.',
        type: 'spoke',
        parentSlug: 'logistiek-en-transport',
        heroTitle: 'CV Voorbeeld Heftruckchauffeur',
        heroText: 'Als heftruckchauffeur zijn certificaten en veiligheid cruciaal. Dit CV voorbeeld toont hoe je je kwalificaties en ongevallenvrije staat van dienst presenteert.',
        tips: [
            'Vermeld alle heftruckcertificaten (reachtruck, EPT, heftruck)',
            'Toon VCA en BHV certificeringen',
            'Highlight veiligheidsrecord en incidentvrije periodes',
            'Vermeld ervaring met specifieke heftruckmerken',
        ],
        metaTitle: 'CV Voorbeeld Heftruckchauffeur met Certificaat | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor heftruckchauffeurs. Met tips voor certificaten, veiligheid en ervaring tonen.',
        keywords: ['cv heftruckchauffeur', 'cv heftruck certificaat', 'cv reachtruck'],
        sampleCV: sampleCVs['heftruckchauffeur-certificaat'],
    },
    {
        slug: 'vrachtwagenchauffeur-internationaal',
        name: 'Vrachtwagenchauffeur Internationaal',
        nameDutch: 'Vrachtwagenchauffeur Internationaal',
        description: 'CV voorbeeld voor internationaal vrachtwagenchauffeurs. Inclusief tips voor rijbewijzen, talenkennis en grensoverschrijdend transport.',
        type: 'spoke',
        parentSlug: 'logistiek-en-transport',
        heroTitle: 'CV Voorbeeld Internationaal Vrachtwagenchauffeur',
        heroText: 'Internationaal rijden vraagt meer dan alleen een groot rijbewijs. Dit CV voorbeeld toont hoe je je talen, ADR kennis en internationale ervaring presenteert.',
        tips: [
            'Vermeld alle rijbewijzen en Code 95 status',
            'Toon taalvaardigheid (Engels, Duits, Frans)',
            'Highlight ADR en koeltransport certificeringen',
            'Vermeld ervaring met digitale tachograaf en rij-rusttijden',
        ],
        metaTitle: 'CV Voorbeeld Vrachtwagenchauffeur Internationaal | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor internationale vrachtwagenchauffeurs. Tips voor rijbewijzen, ADR en talenkennis.',
        keywords: ['cv vrachtwagenchauffeur internationaal', 'cv chauffeur ce', 'cv internationaal transport'],
        sampleCV: sampleCVs['vrachtwagenchauffeur-internationaal'],
    },

    // =========================================================================
    // PILLAR 3: Healthcare
    // =========================================================================
    {
        slug: 'zorg-en-welzijn',
        name: 'Healthcare',
        nameDutch: 'Zorg & Welzijn',
        description: 'CV voorbeelden voor verpleegkundigen, verzorgenden en andere zorgprofessionals. Van MBO tot HBO, van ziekenhuis tot thuiszorg.',
        type: 'pillar',
        heroTitle: 'CV Voorbeelden Zorg & Welzijn',
        heroText: 'Werk je in de zorg? Vind professionele CV voorbeelden voor verpleging, verzorging en welzijn. Met tips voor BIG-registratie en specialisaties.',
        tips: [
            'Vermeld BIG-registratie en nummer',
            'Toon specialisaties en bijscholingen',
            'Highlight patiëntveiligheid en kwaliteit',
            'Vermeld ervaring met EPD systemen',
        ],
        metaTitle: 'CV Voorbeeld Zorg & Welzijn | Verpleegkundige CV | WerkCV.nl',
        metaDesc: 'CV voorbeelden voor zorgprofessionals. Verpleegkundige, Verzorgende IG, Thuiszorg templates. Met BIG-registratie tips.',
        keywords: ['cv zorg', 'cv verpleegkundige', 'cv verzorgende', 'zorg cv voorbeeld'],
    },

    // Healthcare Spokes
    {
        slug: 'verpleegkundige-icu',
        name: 'Verpleegkundige ICU',
        nameDutch: 'IC-Verpleegkundige',
        description: 'CV voorbeeld voor IC-verpleegkundigen. Specialist in acute zorg, beademing en complexe patiëntenzorg.',
        type: 'spoke',
        parentSlug: 'zorg-en-welzijn',
        heroTitle: 'CV Voorbeeld IC-Verpleegkundige',
        heroText: 'Als IC-verpleegkundige heb je specialistische vaardigheden. Dit CV voorbeeld toont hoe je je IC-opleiding, technische skills en ervaring met kritieke patiënten presenteert.',
        tips: [
            'Vermeld CZO IC-verpleegkundige registratie',
            'Toon specialisaties (ECMO, beademing, hemodynamiek)',
            'Highlight ALS/ATLS certificeringen',
            'Vermeld ervaring met specifieke patiëntgroepen',
        ],
        metaTitle: 'CV Voorbeeld IC-Verpleegkundige | WerkCV.nl',
        metaDesc: 'Professioneel CV voorbeeld voor IC-verpleegkundigen. Met voorbeeldteksten voor acute zorg en specialisaties.',
        keywords: ['cv ic verpleegkundige', 'cv intensive care', 'cv verpleegkundige icu'],
        sampleCV: sampleCVs['verpleegkundige-icu'],
    },
    {
        slug: 'verzorgende-ig-ouderenzorg',
        name: 'Verzorgende IG Ouderenzorg',
        nameDutch: 'Verzorgende IG Ouderenzorg',
        description: 'CV voorbeeld voor verzorgenden in de ouderenzorg. Met focus op dementiezorg, palliatieve zorg en familiebegeleiding.',
        type: 'spoke',
        parentSlug: 'zorg-en-welzijn',
        heroTitle: 'CV Voorbeeld Verzorgende IG Ouderenzorg',
        heroText: 'Ouderenzorg vraagt warme, betrokken professionals. Dit CV voorbeeld toont hoe je je ervaring met dementie, palliatieve zorg en ouderenbegeleiding presenteert.',
        tips: [
            'Vermeld specialisaties in dementiezorg of palliatief',
            'Toon ervaring met verschillende cliëntgroepen',
            'Highlight communicatie met familie',
            'Vermeld ECD-systemen die je kent',
        ],
        metaTitle: 'CV Voorbeeld Verzorgende IG Ouderenzorg | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor Verzorgende IG in ouderenzorg. Tips voor dementiezorg en familiebegeleiding.',
        keywords: ['cv verzorgende ig', 'cv ouderenzorg', 'cv verzorgende verpleeghuis'],
        sampleCV: sampleCVs['verzorgende-ig-ouderenzorg'],
    },

    // =========================================================================
    // PILLAR 4: Career Situations
    // =========================================================================
    {
        slug: 'situatie',
        name: 'Career Situations',
        nameDutch: 'Specifieke Situaties',
        description: 'CV voorbeelden voor bijzondere carrièresituaties. Carrièreswitch, zonder ervaring, gat in CV - wij helpen je verder.',
        type: 'pillar',
        heroTitle: 'CV Voorbeelden voor Specifieke Situaties',
        heroText: 'Iedereen heeft een uniek carrièreverhaal. Of je nu van baan wisselt, net begint, of een gat in je CV moet uitleggen - hier vind je het juiste template.',
        tips: [
            'Focus op transferable skills bij een carrièreswitch',
            'Wees eerlijk maar positief over gaten in je CV',
            'Benadruk leervermogen en motivatie als starter',
            'Toon hoe je groeit van elke ervaring',
        ],
        metaTitle: 'CV Voorbeeld Specifieke Situaties | Carrièreswitch | WerkCV.nl',
        metaDesc: 'CV voorbeelden voor bijzondere situaties. Carrièreswitch, starter, gat in CV. Praktische tips en templates.',
        keywords: ['cv carrièreswitch', 'cv zonder ervaring', 'cv gat', 'cv starter'],
    },

    // Career Situation Spokes
    {
        slug: 'carrièreswitch-naar-it',
        name: 'Carrièreswitch naar IT',
        nameDutch: 'Carrièreswitch naar IT',
        description: 'CV voorbeeld voor professionals die overstappen naar IT. Van sales naar developer, van marketing naar data - toon je potentieel.',
        type: 'spoke',
        parentSlug: 'situatie',
        heroTitle: 'CV Voorbeeld Carrièreswitch naar IT',
        heroText: 'Een carrièreswitch naar IT is een slimme keuze. Dit CV voorbeeld toont hoe je je transferable skills combineert met je nieuwe technische vaardigheden.',
        tips: [
            'Benadruk transferable skills (analytisch denken, communicatie)',
            'Toon je technische omscholing en certificaten',
            'Link naar portfolio projecten en GitHub',
            'Vertel je motivatie voor de switch kort maar krachtig',
        ],
        metaTitle: 'CV Voorbeeld Carrièreswitch naar IT | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor een carrièreswitch naar IT. Tips voor transferable skills en technische omscholing.',
        keywords: ['cv carrièreswitch it', 'cv overstap naar tech', 'cv carrière verandering'],
        sampleCV: sampleCVs['carrièreswitch-naar-it'],
    },
    {
        slug: 'zonder-ervaring-horeca',
        name: 'Zonder Ervaring Horeca',
        nameDutch: 'Starter Horeca',
        description: 'CV voorbeeld voor starters in de horeca zonder werkervaring. Perfect voor studenten en schoolverlaters.',
        type: 'spoke',
        parentSlug: 'situatie',
        heroTitle: 'CV Voorbeeld Starter Horeca',
        heroText: 'Iedereen begint ergens. Dit CV voorbeeld toont hoe je als starter zonder ervaring toch een overtuigend horeca CV schrijft door te focussen op motivatie en soft skills.',
        tips: [
            'Focus op soft skills: klantvriendelijkheid, teamwork',
            'Vermeld vrijwilligerswerk en bijbaantjes',
            'Toon flexibiliteit qua beschikbaarheid',
            'Benadruk je motivatie en leergierigheid',
        ],
        metaTitle: 'CV Voorbeeld Starter Horeca Zonder Ervaring | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor starters in de horeca zonder ervaring. Tips voor studenten en schoolverlaters.',
        keywords: ['cv zonder ervaring horeca', 'cv starter horeca', 'cv student bijbaan'],
        sampleCV: sampleCVs['zonder-ervaring-horeca'],
    },
    {
        slug: 'gat-in-cv-burn-out',
        name: 'Gat in CV na Burn-out',
        nameDutch: 'Gat in CV (Burn-out)',
        description: 'CV voorbeeld voor professionals die terugkeren na een burn-out. Eerlijk, positief en gericht op de toekomst.',
        type: 'spoke',
        parentSlug: 'situatie',
        heroTitle: 'CV Voorbeeld na Burn-out',
        heroText: 'Een burn-out is geen falen, maar een leerpunt. Dit CV voorbeeld toont hoe je eerlijk maar positief je herstelperiode presenteert en je sterker terugkeert.',
        tips: [
            'Wees eerlijk maar kort over de reden van het gat',
            'Focus op wat je geleerd hebt (stressmanagement, zelfinzicht)',
            'Toon activiteiten tijdens herstel (vrijwilligerswerk, cursussen)',
            'Benadruk dat je klaar bent voor de volgende stap',
        ],
        metaTitle: 'CV Voorbeeld Gat in CV na Burn-out | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor terugkeer na burn-out. Eerlijke en positieve presentatie van je herstelperiode.',
        keywords: ['cv gat burn-out', 'cv na burn-out', 'cv werkonderbreking'],
        sampleCV: sampleCVs['gat-in-cv-burn-out'],
    },

    // =========================================================================
    // PILLAR 5: Office & Admin
    // =========================================================================
    {
        slug: 'kantoor-en-administratie',
        name: 'Office & Admin',
        nameDutch: 'Kantoor & Administratie',
        description: 'CV voorbeelden voor administratief medewerkers, secretaresses en office managers. Van MBO tot HBO niveau.',
        type: 'pillar',
        heroTitle: 'CV Voorbeelden Kantoor & Administratie',
        heroText: 'Werk je op kantoor? Vind CV voorbeelden voor administratie, secretariaat en finance functies. Met tips voor software skills en organisatorische vaardigheden.',
        tips: [
            'Vermeld specifieke software (MS Office, SAP, Exact)',
            'Toon organisatorische en planningsvaardigheden',
            'Highlight discretie en vertrouwelijkheid',
            'Vermeld taalvaardigheid voor internationale rollen',
        ],
        metaTitle: 'CV Voorbeeld Kantoor & Administratie | WerkCV.nl',
        metaDesc: 'CV voorbeelden voor kantoor en administratie. Secretaresse, administratief medewerker, office manager templates.',
        keywords: ['cv administratie', 'cv secretaresse', 'cv kantoor', 'cv office manager'],
    },

    // Office Spokes
    {
        slug: 'directiesecretaresse',
        name: 'Directiesecretaresse',
        nameDutch: 'Directiesecretaresse',
        description: 'CV voorbeeld voor ervaren directiesecretaresses. Focus op C-level ondersteuning, vertrouwelijkheid en internationale ervaring.',
        type: 'spoke',
        parentSlug: 'kantoor-en-administratie',
        heroTitle: 'CV Voorbeeld Directiesecretaresse',
        heroText: 'Als directiesecretaresse ben je de rechterhand van het management. Dit CV voorbeeld toont hoe je je discretie, organisatiekracht en internationale ervaring presenteert.',
        tips: [
            'Benadruk ervaring op C-level of directieniveau',
            'Toon vertrouwelijke projecten (zonder details)',
            'Vermeld talen en internationale ervaring',
            'Highlight event organisatie en board support',
        ],
        metaTitle: 'CV Voorbeeld Directiesecretaresse | WerkCV.nl',
        metaDesc: 'Professioneel CV voorbeeld voor directiesecretaresses. Tips voor C-level ondersteuning en vertrouwelijkheid.',
        keywords: ['cv directiesecretaresse', 'cv executive assistant', 'cv management assistente'],
        sampleCV: sampleCVs['directiesecretaresse'],
    },
    {
        slug: 'financial-controller-mkb',
        name: 'Financial Controller MKB',
        nameDutch: 'Financial Controller MKB',
        description: 'CV voorbeeld voor financial controllers in het MKB. Hands-on financieel management en directie advies.',
        type: 'spoke',
        parentSlug: 'kantoor-en-administratie',
        heroTitle: 'CV Voorbeeld Financial Controller MKB',
        heroText: 'In het MKB ben je als controller een allrounder. Dit CV voorbeeld toont hoe je je brede financiële expertise en hands-on mentaliteit presenteert.',
        tips: [
            'Toon ervaring met maand- en jaarafsluiting',
            'Vermeld specifieke ERP systemen (Exact, SAP B1)',
            'Highlight rapportage voor directie/eigenaren',
            'Benadruk pragmatische, hands-on aanpak',
        ],
        metaTitle: 'CV Voorbeeld Financial Controller MKB | WerkCV.nl',
        metaDesc: 'CV voorbeeld voor Financial Controllers in MKB. Hands-on finance met directie advies.',
        keywords: ['cv financial controller mkb', 'cv controller', 'cv financieel manager'],
        sampleCV: sampleCVs['financial-controller-mkb'],
    },
];

// ============================================================================
// SEEDING FUNCTION
// ============================================================================

async function main() {
    console.log('🌱 Starting category seed...\n');

    // Create a map to store created categories for parent lookup
    const createdCategories = new Map<string, string>();

    // First pass: Create all categories without parent relations
    for (const cat of categories) {
        const existing = await prisma.cVCategory.findUnique({
            where: { slug: cat.slug },
        });

        if (existing) {
            console.log(`⏭️  Skipping existing: ${cat.slug}`);
            createdCategories.set(cat.slug, existing.id);
            continue;
        }

        const created = await prisma.cVCategory.create({
            data: {
                slug: cat.slug,
                name: cat.name,
                nameDutch: cat.nameDutch,
                description: cat.description,
                type: cat.type,
                heroTitle: cat.heroTitle,
                heroText: cat.heroText,
                tips: cat.tips,
                metaTitle: cat.metaTitle,
                metaDesc: cat.metaDesc,
                keywords: cat.keywords,
                sampleCV: cat.sampleCV || defaultSampleCV,
                siblingIds: [],
            },
        });

        createdCategories.set(cat.slug, created.id);
        console.log(`✅ Created: ${cat.slug} (${cat.type})`);
    }

    // Second pass: Update parent relations
    console.log('\n🔗 Setting up parent relations...\n');

    for (const cat of categories) {
        if (cat.parentSlug) {
            const parentId = createdCategories.get(cat.parentSlug);
            const childId = createdCategories.get(cat.slug);

            if (parentId && childId) {
                await prisma.cVCategory.update({
                    where: { id: childId },
                    data: { parentId },
                });
                console.log(`🔗 ${cat.slug} → ${cat.parentSlug}`);
            }
        }
    }

    // Third pass: Set up sibling relations for internal linking
    console.log('\n🔗 Setting up sibling relations...\n');

    // Group spokes by parent
    const spokesByParent = new Map<string, string[]>();
    for (const cat of categories) {
        if (cat.type === 'spoke' && cat.parentSlug) {
            const parentSlug = cat.parentSlug;
            if (!spokesByParent.has(parentSlug)) {
                spokesByParent.set(parentSlug, []);
            }
            spokesByParent.get(parentSlug)!.push(cat.slug);
        }
    }

    // For each spoke, set siblings to other spokes in same parent
    for (const [parentSlug, siblingsSlugs] of spokesByParent) {
        for (const slug of siblingsSlugs) {
            const catId = createdCategories.get(slug);
            const siblingIds = siblingsSlugs
                .filter(s => s !== slug)
                .slice(0, 3)
                .map(s => createdCategories.get(s))
                .filter(Boolean) as string[];

            if (catId && siblingIds.length > 0) {
                await prisma.cVCategory.update({
                    where: { id: catId },
                    data: { siblingIds },
                });
                console.log(`🔗 ${slug} siblings: ${siblingIds.length} categories`);
            }
        }
    }

    console.log('\n✅ Seed completed!');
    console.log(`   - ${categories.filter(c => c.type === 'pillar').length} pillars`);
    console.log(`   - ${categories.filter(c => c.type === 'subhub').length} sub-hubs`);
    console.log(`   - ${categories.filter(c => c.type === 'spoke').length} spokes`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
