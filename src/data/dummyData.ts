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

// Technical Assessment Data Types
export type AssessmentDifficulty = "Easy" | "Medium" | "Hard";
export type AssessmentStatus = "active" | "inactive" | "draft";
export type AssessmentType = "code_fix" | "sql_query";

export interface TechnicalAssessment {
  id: string;
  type: AssessmentType;
  courseId: string;
  category: string;
  title: string;
  description?: string;
  topic?: string;
  difficulty: AssessmentDifficulty;
  status: AssessmentStatus;
  author?: string;
  order?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;

  // For code_fix type
  brokenCode?: string;
  correctOutput?: string;
  hint?: string;
  testCases?: string[];
  explanation?: string;

  // For sql_query type
  expected_query?: string;
  expected_result?: {
    columns: string[];
    rows: Array<Record<string, any>>;
  };
  sample_table?: {
    name: string;
    columns: string[];
    rows: Array<Record<string, any>>;
  };
  hints?: string[];
}

// Sample Technical Assessments Data
export const technicalAssessments: TechnicalAssessment[] = [
  {
    id: "python_assess_1",
    type: "code_fix",
    courseId: "python_101",
    category: "Python",
    title: "Simple Print Loop",
    description: "Fix the broken Python loop code to print numbers from 1 to 5",
    topic: "Loops",
    difficulty: "Easy",
    status: "active",
    author: "Admin",
    order: 1,
    tags: ["Python", "Loops", "Syntax"],
    brokenCode: "# Task: Print numbers from 1 to 5\n# Bug: Missing colon and wrong indentation\nfor i in range(1,6)\nprint(i)",
    correctOutput: "1 2 3 4 5",
    hint: "Check the loop syntax — something might be missing after the range.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    testCases: ["Input: range(1, 6)", "Expected: 1 2 3 4 5"],
    explanation: "The for loop is missing a colon (:) after the range() statement, and print(i) needs proper indentation.",
  },
  {
    id: "sql_challenge_05_count",
    type: "sql_query",
    courseId: "sql_fundamentals",
    category: "SQL",
    title: "Count Total Students",
    description: "Write an SQL query to count the total number of students in the students table.",
    topic: "Aggregate Functions",
    difficulty: "Easy",
    status: "active",
    author: "Jerico Jimenez",
    order: 5,
    tags: ["COUNT", "aggregates", "functions"],
    expected_query: "SELECT COUNT(*) AS count FROM students;",
    expected_result: {
      columns: ["count"],
      rows: [{ count: 3 }],
    },
    sample_table: {
      name: "students",
      columns: ["id", "name", "age"],
      rows: [
        { id: 1, name: "Jerico", age: 20 },
        { id: 2, name: "Maria", age: 21 },
        { id: 3, name: "John", age: 22 },
      ],
    },
    hints: [
      "Use the COUNT() aggregate function",
      "COUNT(*) counts all rows",
      "Use AS to name the result column 'count'",
    ],
    createdAt: "2025-10-28T08:20:00Z",
    updatedAt: "2025-10-28T08:20:00Z",
  },
  {
    id: "js_assess_1",
    type: "code_fix",
    courseId: "javascript_101",
    category: "JavaScript",
    title: "Fix Variable Declaration",
    brokenCode: "// Task: Create a variable and assign your name\n// Bug: Missing keyword\nname = 'John';\nconsole.log(name);",
    correctOutput: "John",
    difficulty: "Easy",
    hint: "Variables should be declared using 'let', 'const', or 'var'.",
    status: "active",
    createdAt: "2024-01-16T10:00:00Z",
    explanation: "The variable 'name' should be declared with 'let' or 'const' keyword.",
  },
  {
    id: "python_assess_2",
    courseId: "python_101",
    title: "Fix Function Definition",
    brokenCode: "# Task: Create a function that adds two numbers\n# Bug: Missing parentheses\ndef add_numbers a, b\n    return a + b\n\nprint(add_numbers(5, 3))",
    correctOutput: "8",
    difficulty: "Easy",
    hint: "Function parameters should be enclosed in parentheses.",
    status: "active",
    createdAt: "2024-01-17T10:00:00Z",
    testCases: ["Input: add_numbers(5, 3)", "Expected: 8"],
    explanation: "Function parameters must be enclosed in parentheses and the function definition needs a colon.",
  },
  {
    id: "react_assess_1",
    courseId: "react_fundamentals",
    title: "Fix useState Hook",
    brokenCode: "// Task: Create a counter component\n// Bug: Incorrect useState syntax\nimport React from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState;\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}",
    correctOutput: "Component renders with initial count: 0",
    difficulty: "Medium",
    hint: "useState needs to be called as a function with an initial value.",
    status: "active",
    createdAt: "2024-01-18T10:00:00Z",
    explanation: "useState must be called as a function: useState(0) to initialize the state.",
  },
  {
    id: "python_assess_3",
    courseId: "python_101",
    title: "List Iteration Bug",
    brokenCode: "# Task: Print each item in a list\n# Bug: Incorrect variable name\nfruits = ['apple', 'banana', 'orange']\nfor fruit in fruits:\n    print(fruits)",
    correctOutput: "apple\nbanana\norange",
    difficulty: "Easy",
    hint: "Check what you're printing inside the loop.",
    status: "active",
    createdAt: "2024-01-19T10:00:00Z",
    testCases: ["Input: ['apple', 'banana', 'orange']", "Expected: Print each item"],
    explanation: "Should print 'fruit' (singular) not 'fruits' (the entire list).",
  },
  {
    id: "js_assess_2",
    courseId: "javascript_101",
    title: "Array Method Bug",
    brokenCode: "// Task: Get the first element of an array\n// Bug: Incorrect array method\nconst numbers = [10, 20, 30, 40];\nconst first = numbers.get(0);\nconsole.log(first);",
    correctOutput: "10",
    difficulty: "Medium",
    hint: "Arrays don't have a 'get' method. Use bracket notation instead.",
    status: "active",
    createdAt: "2024-01-20T10:00:00Z",
    explanation: "Use numbers[0] or numbers.at(0) to access array elements, not .get(0).",
  },
  {
    id: "sql_assess_1",
    courseId: "sql_basics",
    title: "SELECT Query Bug",
    brokenCode: "-- Task: Select all users older than 25\n-- Bug: Missing WHERE keyword\nSELECT * FROM users\nage > 25;",
    correctOutput: "All users with age > 25",
    difficulty: "Easy",
    hint: "SQL conditions need a specific keyword before them.",
    status: "active",
    createdAt: "2024-01-21T10:00:00Z",
    explanation: "The WHERE keyword is missing before the condition 'age > 25'.",
  },
  {
    id: "python_assess_4",
    courseId: "python_201",
    title: "Dictionary Access Error",
    brokenCode: "# Task: Get the value for key 'name'\n# Bug: Using list syntax\nperson = {'name': 'Alice', 'age': 30}\nprint(person[0])",
    correctOutput: "Alice",
    difficulty: "Medium",
    hint: "Dictionaries use keys, not numeric indexes.",
    status: "active",
    createdAt: "2024-01-22T10:00:00Z",
    explanation: "Use person['name'] to access dictionary values by key.",
  },
  {
    id: "react_assess_2",
    courseId: "react_fundamentals",
    title: "Props Destructuring",
    brokenCode: "// Task: Display user name from props\n// Bug: Incorrect destructuring\nfunction UserCard(props) {\n  const { user.name } = props;\n  return <div>{name}</div>;\n}",
    correctOutput: "Displays user name correctly",
    difficulty: "Hard",
    hint: "You can't use dot notation in destructuring. Destructure the object first.",
    status: "active",
    createdAt: "2024-01-23T10:00:00Z",
    explanation: "Should be: const { user } = props; then access user.name",
  },
  {
    id: "js_assess_3",
    courseId: "javascript_201",
    title: "Async/Await Error",
    brokenCode: "// Task: Fetch data from API\n// Bug: Missing await keyword\nasync function fetchData() {\n  const response = fetch('https://api.example.com/data');\n  const data = response.json();\n  return data;\n}",
    correctOutput: "Returns parsed JSON data",
    difficulty: "Hard",
    hint: "Asynchronous operations need the 'await' keyword.",
    status: "active",
    createdAt: "2024-01-24T10:00:00Z",
    explanation: "Both fetch() and response.json() return promises and need 'await'.",
  },
];
