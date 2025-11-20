export const modules = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript",
    lessons: 8,
    duration: "4 weeks",
    progress: 75,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
  },
  {
    id: "2",
    title: "React Fundamentals",
    description: "Master React components, hooks, and state management",
    lessons: 12,
    duration: "6 weeks",
    progress: 45,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Backend Development with Node.js",
    description: "Build scalable server-side applications with Node.js and Express",
    lessons: 10,
    duration: "5 weeks",
    progress: 20,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Database Design & SQL",
    description: "Design efficient databases and master SQL queries",
    lessons: 9,
    duration: "4 weeks",
    progress: 0,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
  },
];

export const lessons = [
  {
    id: "1",
    moduleId: "1",
    title: "HTML Basics",
    content: "Learn the structure of HTML documents and essential tags.",
    duration: "45 min",
    completed: true,
  },
  {
    id: "2",
    moduleId: "1",
    title: "CSS Fundamentals",
    content: "Style your web pages with CSS selectors, properties, and layouts.",
    duration: "60 min",
    completed: true,
  },
  {
    id: "3",
    moduleId: "1",
    title: "JavaScript Introduction",
    content: "Get started with JavaScript variables, functions, and DOM manipulation.",
    duration: "90 min",
    completed: false,
  },
  {
    id: "4",
    moduleId: "2",
    title: "React Components",
    content: "Build reusable UI components with React.",
    duration: "75 min",
    completed: true,
  },
  {
    id: "5",
    moduleId: "2",
    title: "State and Props",
    content: "Manage component state and pass data with props.",
    duration: "80 min",
    completed: false,
  },
];

export const quizzes = [
  {
    id: "1",
    lessonId: "1",
    title: "HTML Basics Quiz",
    questions: [
      {
        id: "q1",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        id: "q2",
        question: "Which HTML element is used for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question: "What is the correct HTML element for inserting a line break?",
        options: ["<break>", "<lb>", "<br>", "<newline>"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "2",
    lessonId: "2",
    title: "CSS Fundamentals Quiz",
    questions: [
      {
        id: "q1",
        question: "What does CSS stand for?",
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Which property is used to change the background color?",
        options: ["color", "bgcolor", "background-color", "background"],
        correctAnswer: 2,
      },
    ],
  },
];

export const analyticsData = {
  progressOverTime: [
    { month: "Jan", progress: 10 },
    { month: "Feb", progress: 25 },
    { month: "Mar", progress: 40 },
    { month: "Apr", progress: 55 },
    { month: "May", progress: 70 },
    { month: "Jun", progress: 75 },
  ],
  moduleCompletion: [
    { module: "Web Dev", completion: 75 },
    { module: "React", completion: 45 },
    { module: "Node.js", completion: 20 },
    { module: "SQL", completion: 0 },
  ],
  quizScores: [
    { quiz: "HTML", score: 85 },
    { quiz: "CSS", score: 92 },
    { quiz: "JavaScript", score: 78 },
    { quiz: "React", score: 88 },
  ],
};

// Detailed Quiz Types for Management
export type DifficultyLevel = "EASY" | "NORMAL" | "HARD";

export interface DetailedQuiz {
  id: string;
  moduleId: string;
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  difficulty: DifficultyLevel;
  explanation?: string;
  createdAt: string;
}

// Detailed Quizzes for the Quiz Management Page
export const detailedQuizzes: DetailedQuiz[] = [
  {
    id: "dq1",
    moduleId: "1",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctOptionIndex: 0,
    difficulty: "EASY",
    explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "dq2",
    moduleId: "1",
    question: "Which HTML element is used for the largest heading?",
    options: ["<h6>", "<heading>", "<h1>", "<head>"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    explanation: "<h1> is used for the largest heading in HTML, while <h6> is the smallest.",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "dq3",
    moduleId: "1",
    question: "What is the correct HTML element for inserting a line break?",
    options: ["<break>", "<lb>", "<br>", "<newline>"],
    correctOptionIndex: 2,
    difficulty: "EASY",
    explanation: "The <br> tag is used to insert a line break in HTML.",
    createdAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "dq4",
    moduleId: "1",
    question: "Which attribute is used to provide alternative text for an image?",
    options: ["alt", "title", "src", "longdesc"],
    correctOptionIndex: 0,
    difficulty: "NORMAL",
    explanation: "The 'alt' attribute provides alternative text for images, improving accessibility and SEO.",
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "dq5",
    moduleId: "2",
    question: "What is the purpose of the useState hook in React?",
    options: [
      "To fetch data from an API",
      "To manage component state",
      "To handle side effects",
      "To create context",
    ],
    correctOptionIndex: 1,
    difficulty: "NORMAL",
    explanation: "useState is a React Hook that allows you to add state to functional components.",
    createdAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "dq6",
    moduleId: "2",
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctOptionIndex: 2,
    difficulty: "NORMAL",
    explanation: "useEffect is the hook used to handle side effects like data fetching, subscriptions, or manually changing the DOM.",
    createdAt: "2024-01-17T11:00:00Z",
  },
  {
    id: "dq7",
    moduleId: "2",
    question: "What is JSX in React?",
    options: [
      "A JavaScript extension",
      "A syntax extension for JavaScript",
      "A new programming language",
      "A CSS framework",
    ],
    correctOptionIndex: 1,
    difficulty: "EASY",
    explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
    createdAt: "2024-01-17T12:00:00Z",
  },
  {
    id: "dq8",
    moduleId: "3",
    question: "What is Node.js primarily used for?",
    options: [
      "Frontend development",
      "Database management",
      "Server-side JavaScript",
      "Mobile app development",
    ],
    correctOptionIndex: 2,
    difficulty: "EASY",
    explanation: "Node.js is a runtime environment that allows you to run JavaScript on the server side.",
    createdAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "dq9",
    moduleId: "3",
    question: "Which module is used to create a web server in Node.js?",
    options: ["fs", "http", "path", "url"],
    correctOptionIndex: 1,
    difficulty: "NORMAL",
    explanation: "The 'http' module in Node.js is used to create web servers.",
    createdAt: "2024-01-18T11:00:00Z",
  },
  {
    id: "dq10",
    moduleId: "4",
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Question Language",
      "Server Query Language",
      "Structured Question Language",
    ],
    correctOptionIndex: 0,
    difficulty: "EASY",
    explanation: "SQL stands for Structured Query Language, used for managing and querying relational databases.",
    createdAt: "2024-01-19T10:00:00Z",
  },
  {
    id: "dq11",
    moduleId: "4",
    question: "Which SQL statement is used to retrieve data from a database?",
    options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
    correctOptionIndex: 1,
    difficulty: "EASY",
    explanation: "The SELECT statement is used to query and retrieve data from a database.",
    createdAt: "2024-01-19T11:00:00Z",
  },
  {
    id: "dq12",
    moduleId: "1",
    question: "What is the purpose of semantic HTML?",
    options: [
      "To make code look better",
      "To improve SEO and accessibility",
      "To reduce file size",
      "To increase loading speed",
    ],
    correctOptionIndex: 1,
    difficulty: "HARD",
    explanation: "Semantic HTML uses meaningful tags that describe their content, improving both SEO and accessibility for screen readers.",
    createdAt: "2024-01-20T10:00:00Z",
  },
];

// User Progress Data Types
export interface UserProgress {
  userId: string;
  username: string;
  email: string;
  status: "online" | "offline";
  lastLogin?: string;
  coursesEnrolled: number;
  totalActivities: number;
  totalAttempts: number;
  overallPassRate: number;
  codingChallenges: {
    total: number;
    passed: number;
    passRate: number;
    attempts: number;
  };
  quizzes: {
    total: number;
    passed: number;
    passRate: number;
    averageScore: number;
  };
  createdAt: string;
}

export interface CodingChallenge {
  id: string;
  moduleId: string;
  challengeTitle: string;
  passed: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptDate: string;
}

export interface QuizPerformance {
  id: string;
  quizId: string;
  courseName: string;
  averagePercentage: number;
  highestPercentage: number;
  latestPercentage: number;
  totalAttempts: number;
  performanceLevel: "Excellent" | "Very Good" | "Good" | "Average" | "Needs Improvement";
  trend: "improving" | "declining" | "stable";
  latestPassed: boolean;
}

export interface UserDashboardData {
  user: UserProgress;
  codingChallenges: CodingChallenge[];
  quizPerformance: QuizPerformance[];
}

// Sample User Progress Data
export const usersProgress: UserProgress[] = [
  {
    userId: "user_001",
    username: "john_doe",
    email: "john.doe@example.com",
    status: "online",
    lastLogin: new Date(Date.now() - 5 * 60000).toISOString(),
    coursesEnrolled: 3,
    totalActivities: 24,
    totalAttempts: 45,
    overallPassRate: 85,
    codingChallenges: {
      total: 12,
      passed: 10,
      passRate: 83,
      attempts: 28,
    },
    quizzes: {
      total: 12,
      passed: 11,
      passRate: 92,
      averageScore: 88,
    },
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    userId: "user_002",
    username: "jane_smith",
    email: "jane.smith@example.com",
    status: "offline",
    lastLogin: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    coursesEnrolled: 2,
    totalActivities: 18,
    totalAttempts: 32,
    overallPassRate: 78,
    codingChallenges: {
      total: 8,
      passed: 6,
      passRate: 75,
      attempts: 18,
    },
    quizzes: {
      total: 10,
      passed: 8,
      passRate: 80,
      averageScore: 82,
    },
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    userId: "user_003",
    username: "mike_johnson",
    email: "mike.j@example.com",
    status: "offline",
    lastLogin: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    coursesEnrolled: 4,
    totalActivities: 35,
    totalAttempts: 58,
    overallPassRate: 92,
    codingChallenges: {
      total: 16,
      passed: 15,
      passRate: 94,
      attempts: 32,
    },
    quizzes: {
      total: 19,
      passed: 18,
      passRate: 95,
      averageScore: 94,
    },
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    userId: "user_004",
    username: "sarah_wilson",
    email: "sarah.w@example.com",
    status: "offline",
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    coursesEnrolled: 1,
    totalActivities: 8,
    totalAttempts: 15,
    overallPassRate: 60,
    codingChallenges: {
      total: 4,
      passed: 2,
      passRate: 50,
      attempts: 10,
    },
    quizzes: {
      total: 4,
      passed: 3,
      passRate: 75,
      averageScore: 72,
    },
    createdAt: "2024-02-01T16:00:00Z",
  },
  {
    userId: "user_005",
    username: "alex_brown",
    email: "alex.brown@example.com",
    status: "online",
    lastLogin: new Date(Date.now() - 2 * 60000).toISOString(),
    coursesEnrolled: 3,
    totalActivities: 28,
    totalAttempts: 48,
    overallPassRate: 88,
    codingChallenges: {
      total: 14,
      passed: 12,
      passRate: 86,
      attempts: 26,
    },
    quizzes: {
      total: 14,
      passed: 13,
      passRate: 93,
      averageScore: 90,
    },
    createdAt: "2024-01-18T12:00:00Z",
  },
];

// Detailed Coding Challenges Data
export const userCodingChallenges: Record<string, CodingChallenge[]> = {
  user_001: [
    {
      id: "ch1",
      moduleId: "1",
      challengeTitle: "HTML Structure Challenge",
      passed: true,
      bestScore: 95,
      attempts: 2,
      lastAttemptDate: "2024-02-10T15:30:00Z",
    },
    {
      id: "ch2",
      moduleId: "2",
      challengeTitle: "React Component Building",
      passed: true,
      bestScore: 88,
      attempts: 3,
      lastAttemptDate: "2024-02-15T10:20:00Z",
    },
    {
      id: "ch3",
      moduleId: "3",
      challengeTitle: "Node.js API Development",
      passed: false,
      bestScore: 65,
      attempts: 4,
      lastAttemptDate: "2024-02-18T14:45:00Z",
    },
  ],
  user_002: [
    {
      id: "ch1",
      moduleId: "1",
      challengeTitle: "HTML Structure Challenge",
      passed: true,
      bestScore: 82,
      attempts: 3,
      lastAttemptDate: "2024-02-08T09:15:00Z",
    },
    {
      id: "ch2",
      moduleId: "2",
      challengeTitle: "React Component Building",
      passed: true,
      bestScore: 75,
      attempts: 4,
      lastAttemptDate: "2024-02-12T16:30:00Z",
    },
  ],
};

// Detailed Quiz Performance Data
export const userQuizPerformance: Record<string, QuizPerformance[]> = {
  user_001: [
    {
      id: "qp1",
      quizId: "quiz_001",
      courseName: "Introduction to Web Development",
      averagePercentage: 92,
      highestPercentage: 98,
      latestPercentage: 95,
      totalAttempts: 2,
      performanceLevel: "Excellent",
      trend: "improving",
      latestPassed: true,
    },
    {
      id: "qp2",
      quizId: "quiz_002",
      courseName: "React Fundamentals",
      averagePercentage: 85,
      highestPercentage: 90,
      latestPercentage: 90,
      totalAttempts: 3,
      performanceLevel: "Very Good",
      trend: "improving",
      latestPassed: true,
    },
    {
      id: "qp3",
      quizId: "quiz_003",
      courseName: "Backend Development with Node.js",
      averagePercentage: 78,
      highestPercentage: 85,
      latestPercentage: 72,
      totalAttempts: 2,
      performanceLevel: "Good",
      trend: "declining",
      latestPassed: true,
    },
  ],
  user_002: [
    {
      id: "qp1",
      quizId: "quiz_001",
      courseName: "Introduction to Web Development",
      averagePercentage: 88,
      highestPercentage: 92,
      latestPercentage: 92,
      totalAttempts: 2,
      performanceLevel: "Very Good",
      trend: "improving",
      latestPassed: true,
    },
    {
      id: "qp2",
      quizId: "quiz_002",
      courseName: "React Fundamentals",
      averagePercentage: 75,
      highestPercentage: 80,
      latestPercentage: 80,
      totalAttempts: 3,
      performanceLevel: "Good",
      trend: "stable",
      latestPassed: true,
    },
  ],
};
