# infotech-timetable

🗓️ INFOTECH Schedule System
A unified and lightweight scheduling system for the Institute of Information Technology (INFOTECH). Built on Node.js, uses EJS templating, jQuery for dynamic front-end interactions, and stores data in JSON format.

🚀 Features
📅 Timetable management by lessons, teachers, students, and disciplines
📊 Unified reporting and lecturer statistics
🔍 Filters by teacher, group, classroom, and time
🖥️ Web interface built with EJS + jQuery
📂 File-based JSON storage (no external DB required)
🌐 Modular and extendable REST API structure

Project structure:
infotex/
├── api/                      # Standalone APIs (used for backend logic or REST)
│   ├── teachersAPI.js
│   ├── studentsAPI.js
│   ├── reportsAPI.js
│   ├── publicAPI.js
│   └── ...
│
├── assets/                   # Static assets (JS, CSS, icons)
│
├── cron/                     # Scheduled tasks (e.g. backups, reports)
│
├── logs/                     # App logs
│
├── middlewares/             # Express middlewares
│
├── modules/                 # Custom utility modules
│
├── routes/                  # Express route definitions
│   ├── public.js
│   └── pages/
│       ├── lessons.js
│       ├── students.js
│       └── ...
│
├── storage/                 # JSON-based data store
│   ├── teachers.json
│   ├── students.json
│   └── ...
│
├── views/                   # EJS templates (with embedded jQuery)
│   ├── index.ejs
│   ├── students.ejs
│   └── ...
│
├── server.js                # Main server file
├── package.json
├── project.drawio           # Diagram of system architecture (editable)
└── README.md                # You’re here

🧰 Tech Stack
Backend: Node.js + Express
Frontend: EJS + jQuery
Storage: Flat-file JSON
Templating: EJS
Scheduling: cron-based scripts
Statistics & Analytics: Basic calculation/reporting system


