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
