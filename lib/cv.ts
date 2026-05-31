import { z } from "zod";

export const cvSchema = z.object({
    personal: z.object({
        name: z.string().default(""),
        title: z.string().default(""),
        resumeLanguage: z.enum(["nl", "en"]).optional(),
        email: z.string().default(""),
        phone: z.string().default(""),
        location: z.string().default(""),
        address: z.string().default(""), // Full address
        postalCode: z.string().default(""), // Postal code
        summary: z.string().default(""),
        birthDate: z.string().default(""), // Geboortedatum
        birthPlace: z.string().default(""), // Geboorteplaats
        nationality: z.string().default(""), // Nationaliteit
        driversLicense: z.string().default(""), // Rijbewijs
        gender: z.string().default(""), // Geslacht
        maritalStatus: z.string().default(""), // Burgerlijke staat
        linkedIn: z.string().default(""), // LinkedIn URL
        github: z.string().default(""), // GitHub URL
        website: z.string().default(""), // Personal website
        photo: z.string().default(""), // Base64 encoded photo or URL
    }),
    experience: z.array(
        z.object({
            role: z.string().default(""),
            company: z.string().default(""),
            location: z.string().default(""),
            start: z.string().default(""),
            end: z.string().default(""),
            description: z.string().default(""),
            highlights: z.array(z.string()).default([]), // Bullet points
        })
    ).default([]),
    education: z.array(
        z.object({
            degree: z.string().default(""),
            school: z.string().default(""),
            location: z.string().default(""),
            start: z.string().default(""),
            end: z.string().default(""),
            description: z.string().default(""),
        })
    ).default([]),
    // Skills with levels (1-5)
    skills: z.array(
        z.object({
            name: z.string().default(""),
            level: z.number().min(1).max(5).default(3),
        })
    ).default([]),
    // Languages with proficiency
    languages: z.array(
        z.object({
            name: z.string().default(""),
            level: z.enum(["Moedertaal", "Vloeiend", "Goed", "Basis"]).default("Goed"),
        })
    ).default([]),
    // Internships/Stages
    internships: z.array(
        z.object({
            role: z.string().default(""),
            company: z.string().default(""),
            location: z.string().default(""),
            start: z.string().default(""),
            end: z.string().default(""),
            description: z.string().default(""),
            highlights: z.array(z.string()).default([]),
        })
    ).default([]),
    // Interests/Hobbies
    interests: z.array(z.string()).default([]),
    // Personal traits / properties
    properties: z.array(z.string()).optional(),
    // Courses/Certifications
    courses: z.array(
        z.object({
            name: z.string().default(""),
            institution: z.string().default(""),
            year: z.string().default(""),
        })
    ).default([]),
    // Awards & Achievements
    awards: z.array(z.string()).default([]),
    // References
    references: z.array(
        z.object({
            name: z.string().default(""),
            role: z.string().default(""),
            company: z.string().default(""),
            email: z.string().default(""),
            phone: z.string().default(""),
        })
    ).optional(),
    // Side activities / volunteering / board roles
    sideActivities: z.array(
        z.object({
            title: z.string().default(""),
            organization: z.string().default(""),
            start: z.string().default(""),
            end: z.string().default(""),
            description: z.string().default(""),
        })
    ).optional(),
    // User-defined custom sections
    customSections: z.array(
        z.object({
            title: z.string().default(""),
            items: z.array(z.string()).default([]),
        })
    ).optional(),
});

export type CVData = z.infer<typeof cvSchema>;

export const defaultCV: CVData = {
    personal: {
        name: "",
        title: "",
        resumeLanguage: "nl",
        email: "",
        phone: "",
        location: "",
        address: "",
        postalCode: "",
        summary: "",
        birthDate: "",
        birthPlace: "",
        nationality: "",
        driversLicense: "",
        gender: "",
        maritalStatus: "",
        linkedIn: "",
        github: "",
        website: "",
        photo: "",
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    internships: [],
    interests: [],
    properties: [],
    courses: [],
    awards: [],
    references: [],
    sideActivities: [],
    customSections: [],
};

// Sample CV data for previews (Dutch professional)
export const sampleCV: CVData = {
    personal: {
        name: "Simone van Roodenburg",
        title: "Leerkracht Basisonderwijs",
        resumeLanguage: "nl",
        email: "simone1994@outlook.com",
        phone: "06 12345678",
        location: "Naarden",
        address: "Wilhelminastraat 78",
        postalCode: "7001 DV Doetinchem",
        summary: "Gemotiveerde en enthousiaste lerares basisonderwijs met een passie voor het inspireren en begeleiden van jonge leerlingen. Met vijf jaar ervaring in het onderwijs ben ik bedreven in het creëren van een stimulerende leeromgeving waarin elk kind zich kan ontwikkelen. Mijn lessen zijn interactief en gericht op het ontdekken van de unieke talenten van ieder kind.",
        birthDate: "15 maart 1994",
        birthPlace: "Naarden",
        nationality: "Nederlandse",
        driversLicense: "B",
        gender: "Vrouw",
        maritalStatus: "Gehuwd",
        linkedIn: "linkedin.com/in/simone",
        github: "",
        website: "",
        photo: "",
    },
    experience: [
        {
            role: "Leerkracht Groep 4",
            company: "Basisschool De Regenboog",
            location: "Doetinchem",
            start: "augustus 2020",
            end: "heden",
            description: "",
            highlights: [
                "Creëren van een positieve leeromgeving met aandacht voor individuele behoeften en gebruik van moderne leermiddelen om betrokkenheid te stimuleren.",
                "Actieve deelname aan schoolcommissies, educatieve excursies en gastlessen voor een praktische benadering van het onderwijs.",
                "Regelmatig bijscholen via cursussen en conferenties om op de hoogte te blijven van nieuwe onderwijsmethoden.",
            ],
        },
        {
            role: "Lerarenondersteuner Groep 2",
            company: "De Parel",
            location: "Rotterdam",
            start: "augustus 2018",
            end: "juli 2020",
            description: "",
            highlights: [
                "Ondersteunen van de leerkracht bij het begeleiden van kleuters in hun sociale, motorische en cognitieve ontwikkeling.",
                "Organiseren van speelse activiteiten en leermiddelen om een veilige, stimulerende leeromgeving te creëren.",
            ],
        },
    ],
    education: [
        {
            degree: "Bachelor Lerarenopleiding Basisonderwijs",
            school: "Hogeschool Arnhem Nijmegen",
            location: "Nijmegen",
            start: "september 2012",
            end: "juni 2016",
            description: "Tijdens mijn opleiding heb ik me gespecialiseerd in de ontwikkeling van leerlingen en het ontwerpen van effectieve leerplannen.",
        },
    ],
    skills: [
        { name: "Gedifferentieerd lesgeven", level: 5 },
        { name: "Klassenmanagement", level: 5 },
        { name: "Interactieve leermethoden", level: 4 },
        { name: "Communicatieve vaardigheden", level: 5 },
        { name: "Gebruik van educatieve technologie", level: 4 },
    ],
    languages: [
        { name: "Nederlands", level: "Moedertaal" },
        { name: "Engels", level: "Goed" },
        { name: "Duits", level: "Basis" },
    ],
    internships: [
        {
            role: "Stage Groep 2",
            company: "Basisschool De Bloementuin",
            location: "Arnhem",
            start: "februari 2016",
            end: "juni 2016",
            description: "Mijn stage-ervaring in groep 2 gaf me waardevolle inzichten in de vroege stadia van de ontwikkeling van kinderen.",
            highlights: [
                "Intensief samengewerkt met de leerkracht om activiteiten te organiseren die de taal- en sociale vaardigheden van de kleuters bevorderen.",
            ],
        },
    ],
    interests: ["Schilderen", "Kinderen", "Lezen", "Natuur"],
    properties: ["Communicatief", "Empathisch", "Geduldig"],
    courses: [
        {
            name: "Cursus Hoogbegaafdheid",
            institution: "ECHA",
            year: "2021",
        },
    ],
    awards: [],
    references: [],
    sideActivities: [],
    customSections: [],
};
