// Mock Data for CampusConnect - Event & Program Management UI

export const INITIAL_CURRENT_USER = {
  id: "usr-student-01",
  name: "Alex Rivera",
  email: "alex.rivera@campus.edu",
  studentId: "CS-2023-8891",
  department: "Computer Science & Engineering",
  year: "3rd Year (Junior)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "student", // "student" | "organizer"
  organizerProfile: {
    id: "org-acm",
    name: "ACM Student Chapter",
    clubRole: "Lead Coordinator",
    verified: true,
  }
};

export const INITIAL_EVENTS = [
  {
    id: "evt-101",
    title: "HackNova '26 — 36hr National AI Hackathon",
    category: "Hackathons",
    type: "In-Person",
    shortDescription: "36 hours of relentless innovation, building generative AI & autonomous systems with top campus mentors.",
    description: "HackNova is the premier annual university hackathon bringing together over 250+ aspiring engineers, designers, and innovators. Compete for $8,000+ in grand prizes, receive direct mentorship from Google & OpenAI engineers, and attend midnight lightning workshops. Food, energy drinks, and swag bags provided!",
    date: "2026-11-15T09:00:00.000Z",
    endDate: "2026-11-16T21:00:00.000Z",
    timeString: "Nov 15, 9:00 AM – Nov 16, 9:00 PM",
    venue: "Turing Innovation Hub & Main Auditorium, Block C",
    isOnline: false,
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-acm",
    organizer: {
      id: "org-acm",
      name: "ACM Student Chapter",
      email: "acm.lead@campus.edu",
      role: "Host Club",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      badge: "Official Tech Society"
    },
    capacity: 250,
    registeredCount: 184,
    registrationDeadline: "2026-11-12T23:59:59.000Z",
    status: "Upcoming",
    featured: true,
    price: "Free",
    tags: ["Artificial Intelligence", "Hackathon", "Prizes $8K", "Swag Provided"],
    timeline: [
      { time: "09:00 AM", title: "Check-in & Swag Distribution", desc: "Turing Atrium" },
      { time: "10:30 AM", title: "Opening Ceremony & Problem Statements", desc: "Main Auditorium" },
      { time: "12:00 PM", title: "Hacking Officially Begins", desc: "Main Lab" },
      { time: "07:00 PM", title: "Mentorship Round 1", desc: "Review Booths" },
      { time: "12:00 AM", title: "Midnight Gaming & Snacks", desc: "Student Lounge" },
      { time: "05:00 PM (Day 2)", title: "Final Pitch & Demos", desc: "Auditorium" }
    ],
    speakers: [
      { name: "Dr. Elena Rostova", title: "AI Research Scientist, DeepMind", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
      { name: "Marcus Chen", title: "Principal Architect, CloudScale", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    requirements: [
      "Bring your own laptop & charger",
      "Valid Student ID card required at entrance",
      "Teams of 2 to 4 members"
    ]
  },
  {
    id: "evt-102",
    title: "Quantum Computing & Post-Silicon Architecture Workshop",
    category: "Workshops",
    type: "Hybrid",
    shortDescription: "Hands-on masterclass introducing Qiskit quantum circuits, superposition, and quantum cryptographic primitives.",
    description: "Get ahead of the quantum revolution! This intensive hands-on lab takes participants from basic qubits to executing quantum algorithms on real quantum hardware cloud simulators. Prior knowledge of basic linear algebra and Python recommended.",
    date: "2026-11-08T14:00:00.000Z",
    endDate: "2026-11-08T18:00:00.000Z",
    timeString: "Nov 8, 2:00 PM – 6:00 PM",
    venue: "Lab 402, Science Complex / Online Zoom",
    isOnline: true,
    onlineUrl: "https://campus.zoom.us/j/992817263",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-acm",
    organizer: {
      id: "org-acm",
      name: "ACM Student Chapter",
      email: "acm.lead@campus.edu",
      role: "Host Club",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      badge: "Official Tech Society"
    },
    capacity: 60,
    registeredCount: 52,
    registrationDeadline: "2026-11-07T18:00:00.000Z",
    status: "Upcoming",
    featured: false,
    price: "Free",
    tags: ["Quantum", "Qiskit", "Python", "Certificate"],
    timeline: [
      { time: "02:00 PM", title: "Foundations of Quantum Information", desc: "Bloch spheres & gates" },
      { time: "03:15 PM", title: "Hands-on: Bell States & Quantum Teleportation", desc: "Jupyter Notebook Lab" },
      { time: "04:45 PM", title: "Running circuits on IBM Quantum Hardware", desc: "Cloud deployment" },
      { time: "05:45 PM", title: "Q&A & Certificate Verification", desc: "Lab Wrap-up" }
    ],
    speakers: [
      { name: "Prof. Kenneth Meyer", title: "Chair of Physics & Quantum Lab", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    requirements: [
      "Laptop with Python 3.10+ pre-installed",
      "Free IBM Quantum account created prior to workshop"
    ]
  },
  {
    id: "evt-103",
    title: "Campus Cultural Carnival '26 — Resonance",
    category: "Cultural",
    type: "In-Person",
    shortDescription: "The biggest music, dance, theatrical, and food festival on campus featuring battle of the bands.",
    description: "Resonance brings the campus alive! Experience 15 food stalls curated by student culinary clubs, 8 student rock bands, open mic poetry slams, graffiti exhibitions, and an electrifying headline EDM set. Pass grants all-access entry.",
    date: "2026-11-20T17:00:00.000Z",
    endDate: "2026-11-20T23:30:00.000Z",
    timeString: "Nov 20, 5:00 PM – 11:30 PM",
    venue: "Central Campus Amphitheater & Lawns",
    isOnline: false,
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-arts",
    organizer: {
      id: "org-arts",
      name: "Campus Arts & Cultural Council",
      email: "arts.council@campus.edu",
      role: "Cultural Committee",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      badge: "Student Council"
    },
    capacity: 1200,
    registeredCount: 940,
    registrationDeadline: "2026-11-19T23:59:00.000Z",
    status: "Upcoming",
    featured: true,
    price: "Free",
    tags: ["Music", "Food Fest", "Live Bands", "Arts"],
    timeline: [
      { time: "05:00 PM", title: "Carnival Gates & Food Street Opens", desc: "Central Lawns" },
      { time: "06:30 PM", title: "Battle of the Campus Bands", desc: "Amphitheater Stage" },
      { time: "09:00 PM", title: "Inter-Collegiate Dance Showcase", desc: "Stage A" },
      { time: "10:15 PM", title: "Guest DJ Night & Light Show", desc: "Main Stage" }
    ],
    speakers: [],
    requirements: [
      "College Student ID card mandatory",
      "Wristband distributed at security checkpoints"
    ]
  },
  {
    id: "evt-104",
    title: "VentureSprint: Campus Startup Pitch & Angel Demo Day",
    category: "Seminars",
    type: "In-Person",
    shortDescription: "Top 10 student-led tech startups pitch live to venture capitalists and angel alumni for seed investments.",
    description: "Are you building the next generation campus startup? Join us for VentureSprint! Ten shortlisted student teams will pitch 5 minutes each to prominent Silicon Valley and campus venture funds. Network during the post-pitch VIP mixer.",
    date: "2026-11-28T10:00:00.000Z",
    endDate: "2026-11-28T15:00:00.000Z",
    timeString: "Nov 28, 10:00 AM – 3:00 PM",
    venue: "Executive Business Center, 5th Floor Hall",
    isOnline: false,
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-eclub",
    organizer: {
      id: "org-eclub",
      name: "Entrepreneurship & Innovation Cell",
      email: "ecell@campus.edu",
      role: "Incubator Partner",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      badge: "Incubator Cell"
    },
    capacity: 150,
    registeredCount: 142,
    registrationDeadline: "2026-11-25T12:00:00.000Z",
    status: "Upcoming",
    featured: false,
    price: "Free",
    tags: ["Startups", "Venture Capital", "Pitching", "Networking"],
    timeline: [
      { time: "10:00 AM", title: "Keynote: From Dorm Room to Series A", desc: "Auditorium" },
      { time: "11:00 AM", title: "Pitch Session (Teams 1-5)", desc: "Main Stage" },
      { time: "12:30 PM", title: "Lunch & Networking Break", desc: "Executive Terrace" },
      { time: "01:30 PM", title: "Pitch Session (Teams 6-10)", desc: "Main Stage" },
      { time: "02:30 PM", title: "Award Announcement & Grant Handout", desc: "Stage" }
    ],
    speakers: [
      { name: "Samantha Vance", title: "Partner at Apex Ventures", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" }
    ],
    requirements: ["Business casual attire recommended"]
  },
  {
    id: "evt-105",
    title: "Inter-Collegiate Esports Championship: Valorant & FC26",
    category: "Sports",
    type: "In-Person",
    shortDescription: "Annual varsity gaming tournament. Live casted matches, high-refresh rigs, and $3,000 prize pool.",
    description: "Campus gaming society presents the largest varsity LAN party of the semester. 16 Valorant squads and 32 FC26 solo athletes clash in double elimination brackets. Spectator seating, giant LED projection walls, and shoutcasting by popular gaming streamers.",
    date: "2026-12-05T11:00:00.000Z",
    endDate: "2026-12-06T20:00:00.000Z",
    timeString: "Dec 5 – Dec 6, 11:00 AM – 8:00 PM",
    venue: "Student Recreational Pavilion, Arena 2",
    isOnline: false,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-acm",
    organizer: {
      id: "org-acm",
      name: "ACM Student Chapter",
      email: "acm.lead@campus.edu",
      role: "Host Club",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      badge: "Official Tech Society"
    },
    capacity: 200,
    registeredCount: 200, // Fully booked example!
    registrationDeadline: "2026-12-01T23:59:00.000Z",
    status: "Upcoming",
    featured: false,
    price: "Free",
    tags: ["Esports", "Gaming", "Tournament", "Full Capacity"],
    timeline: [
      { time: "11:00 AM", title: "Group Stage Knockouts", desc: "Gaming Stations A-H" },
      { time: "03:00 PM", title: "Semi-Finals Broadcast", desc: "Main Arena LED" },
      { time: "06:30 PM", title: "Grand Finals & Trophy Ceremony", desc: "Center Stage" }
    ],
    speakers: [],
    requirements: ["Personal peripherals (mice/headsets) permitted after inspection"]
  },
  {
    id: "evt-106",
    title: "Web3 & Zero-Knowledge Cryptography Bootcamp",
    category: "Tech Talks",
    type: "Virtual",
    shortDescription: "Explore zero-knowledge rollups, zk-SNARKs, and cryptographic privacy algorithms in modern decentralized systems.",
    description: "An in-depth exploration into the cryptographic foundations powering privacy and scalability on modern blockchain networks. Learn the mathematics behind polynomial commitments and write your first Circom zero-knowledge circuit.",
    date: "2026-12-10T16:00:00.000Z",
    endDate: "2026-12-10T19:00:00.000Z",
    timeString: "Dec 10, 4:00 PM – 7:00 PM",
    venue: "Live Stream / Virtual Discord Stage",
    isOnline: true,
    onlineUrl: "https://discord.gg/campus-crypto",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80",
    organizerId: "org-blockchain",
    organizer: {
      id: "org-blockchain",
      name: "Blockchain & Cryptography Society",
      email: "crypto@campus.edu",
      role: "Student Society",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      badge: "Special Interest Group"
    },
    capacity: 300,
    registeredCount: 88,
    registrationDeadline: "2026-12-09T23:59:00.000Z",
    status: "Upcoming",
    featured: false,
    price: "Free",
    tags: ["Web3", "Cryptography", "zk-SNARKs", "Rust"],
    timeline: [
      { time: "04:00 PM", title: "ZK Math Fundamentals", desc: "Virtual Stage" },
      { time: "05:15 PM", title: "Writing Circuits with Circom", desc: "Code Along" },
      { time: "06:30 PM", title: "Verifier Smart Contract Deployment", desc: "Live Testnet" }
    ],
    speakers: [
      { name: "Devin Thorne", title: "ZK Protocol Researcher", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" }
    ],
    requirements: ["Basic familiarity with Javascript/Rust"]
  }
];

export const INITIAL_USER_REGISTRATIONS = [
  {
    id: "reg-991204",
    eventId: "evt-101",
    eventTitle: "HackNova '26 — 36hr National AI Hackathon",
    eventDate: "2026-11-15T09:00:00.000Z",
    eventVenue: "Turing Innovation Hub & Main Auditorium, Block C",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
    category: "Hackathons",
    fullName: "Alex Rivera",
    email: "alex.rivera@campus.edu",
    studentId: "CS-2023-8891",
    department: "Computer Science & Engineering",
    year: "3rd Year (Junior)",
    registeredAt: "2026-10-25T11:20:00.000Z",
    status: "Confirmed",
    ticketCode: "CC-HN26-8891",
    seatNumber: "Zone-B / Desk 42",
    qrData: "CAMPUSCONNECT:TICKET:evt-101:reg-991204:CS-2023-8891",
    checkedIn: false,
    specialNotes: "Vegetarian meal preference. Team: SynapseAI"
  },
  {
    id: "reg-991205",
    eventId: "evt-102",
    eventTitle: "Quantum Computing & Post-Silicon Architecture Workshop",
    eventDate: "2026-11-08T14:00:00.000Z",
    eventVenue: "Lab 402, Science Complex / Online Zoom",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80",
    category: "Workshops",
    fullName: "Alex Rivera",
    email: "alex.rivera@campus.edu",
    studentId: "CS-2023-8891",
    department: "Computer Science & Engineering",
    year: "3rd Year (Junior)",
    registeredAt: "2026-10-27T09:14:00.000Z",
    status: "Confirmed",
    ticketCode: "CC-QC26-1029",
    seatNumber: "Terminal 18",
    qrData: "CAMPUSCONNECT:TICKET:evt-102:reg-991205:CS-2023-8891",
    checkedIn: false,
    specialNotes: "Need access to cloud cluster"
  }
];

export const INITIAL_EVENT_ATTENDEES = {
  "evt-101": [
    {
      id: "reg-991204",
      fullName: "Alex Rivera",
      email: "alex.rivera@campus.edu",
      studentId: "CS-2023-8891",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      registeredAt: "2026-10-25T11:20:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-8891",
      checkedIn: true,
      checkedInAt: "2026-11-15T08:45:00.000Z",
      specialNotes: "Vegetarian meal preference. Team: SynapseAI"
    },
    {
      id: "reg-991208",
      fullName: "Priya Sharma",
      email: "priya.s@campus.edu",
      studentId: "EE-2024-3401",
      department: "Electrical & Computer Eng",
      year: "2nd Year",
      registeredAt: "2026-10-26T14:32:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-3401",
      checkedIn: true,
      checkedInAt: "2026-11-15T08:52:00.000Z",
      specialNotes: "Hardware track participant"
    },
    {
      id: "reg-991212",
      fullName: "Liam O'Connor",
      email: "liam.oc@campus.edu",
      studentId: "DS-2022-7712",
      department: "Data Science & AI",
      year: "4th Year",
      registeredAt: "2026-10-26T18:10:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-7712",
      checkedIn: false,
      checkedInAt: null,
      specialNotes: "None"
    },
    {
      id: "reg-991219",
      fullName: "Zoe Wang",
      email: "zoe.wang@campus.edu",
      studentId: "CS-2023-4509",
      department: "Computer Science",
      year: "3rd Year",
      registeredAt: "2026-10-27T10:05:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-4509",
      checkedIn: false,
      checkedInAt: null,
      specialNotes: "Requires wheelchair accessible desk"
    },
    {
      id: "reg-991223",
      fullName: "Ethan Miller",
      email: "emiller@campus.edu",
      studentId: "ME-2024-1188",
      department: "Mechanical Engineering",
      year: "2nd Year",
      registeredAt: "2026-10-28T09:40:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-1188",
      checkedIn: true,
      checkedInAt: "2026-11-15T09:05:00.000Z",
      specialNotes: "Robotics club member"
    },
    {
      id: "reg-991230",
      fullName: "Ananya Patel",
      email: "ananya.p@campus.edu",
      studentId: "IT-2023-9021",
      department: "Information Technology",
      year: "3rd Year",
      registeredAt: "2026-10-28T16:15:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-HN26-9021",
      checkedIn: false,
      checkedInAt: null,
      specialNotes: "Team: DevDynasty"
    }
  ],
  "evt-102": [
    {
      id: "reg-991205",
      fullName: "Alex Rivera",
      email: "alex.rivera@campus.edu",
      studentId: "CS-2023-8891",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      registeredAt: "2026-10-27T09:14:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-QC26-1029",
      checkedIn: false,
      checkedInAt: null,
      specialNotes: "Need access to cloud cluster"
    },
    {
      id: "reg-991241",
      fullName: "Mateo Silva",
      email: "mateo.s@campus.edu",
      studentId: "PH-2022-6012",
      department: "Applied Physics",
      year: "4th Year",
      registeredAt: "2026-10-27T12:00:00.000Z",
      status: "Confirmed",
      ticketCode: "CC-QC26-6012",
      checkedIn: true,
      checkedInAt: "2026-11-08T13:50:00.000Z",
      specialNotes: "Physics undergrad researcher"
    }
  ]
};
