# SKILLSWAP - WEB-BASED PEER-TO-PEER SKILL BARTER PLATFORM

## Mini Project Report

Submitted in partial fulfillment of the requirements for the Mini Project

### Submitted by

- Sambhav - 1MS23CI107
- Parth - 1MS23CI083

### Departments

- Department of CSE (AI & ML)
- Department of CSE (Cyber Security)

### Semester / Course

- VI Semester Mini Project
- Code: CIP67 / CYP67

### Under the Guidance of

Dr. Sahana Lokesh R  
Associate Professor

### Institution

M. S. Ramaiah Institute of Technology, Bengaluru

### Academic Year

2025-26

---

## CERTIFICATE

This is to certify that the mini project entitled **"SkillSwap - Web-Based Peer-to-Peer Skill Barter Platform"** has been carried out by **Sambhav (1MS23CI107)** and **Parth (1MS23CI083)** in partial fulfillment of the requirements for the VI Semester Mini Project. The work presented in this report is a bona fide record of the project completed under the guidance of **Dr. Sahana Lokesh R**.

The report has been prepared based on the implemented application, supporting presentation material, and the project source code. It is submitted for academic evaluation.

Project Guide: ____________________

Head of Department: ____________________

External Examiner 1: ____________________

External Examiner 2: ____________________

---

## DECLARATION

We hereby declare that the work presented in this mini project report titled **"SkillSwap - Web-Based Peer-to-Peer Skill Barter Platform"** is an original work carried out by us under the guidance of **Dr. Sahana Lokesh R**. This report has not been submitted in full or in part for the award of any other degree, diploma, or certificate in this or any other institution.

Sambhav - 1MS23CI107  
Parth - 1MS23CI083

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to our institution, department faculty, and guide **Dr. Sahana Lokesh R** for their encouragement, academic guidance, and continuous support during the development of this mini project. Their feedback helped us shape the idea into a practical full-stack web application.

We also thank our peers, friends, and family members for their support throughout the implementation and testing phases. Their suggestions helped us refine the platform features, interface, and usability.

---

## ABSTRACT

SkillSwap is a web-based peer-to-peer skill barter platform designed to help students exchange knowledge without using money. The project addresses a common gap in student communities: many learners possess useful skills but lack a structured system to teach others, learn complementary skills, and participate in fair reciprocal exchanges. Existing platforms usually depend on payments, manual discovery, or informal arrangements, which reduce participation and trust.

The proposed system introduces a **Time Credit** model in which teaching for one hour earns a credit that can later be spent to learn another skill from a different user. To reduce the cold-start problem, new users are initialized with starter credits. The platform supports skill listing, profile management, automated matching of complementary skills, swap request management, and AI-assisted guidance. The application is implemented using **Next.js 14 App Router**, **React**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL**, and **NextAuth**. AI-powered assistant and suggestion features are integrated through the **Anthropic Claude API**.

The system demonstrates that a barter-oriented digital platform can provide a fair and usable method for collaborative student learning. By combining reciprocity, atomic credit transfers, and intelligent matching, SkillSwap encourages contribution as well as consumption and creates a more sustainable knowledge-sharing community.

---

## TABLE OF CONTENTS

1. Introduction
2. Project Organization
3. Literature Survey
4. Project Management Plan
5. Software Requirement Specification
6. Design
7. Implementation
8. Testing
9. Results and Analysis
10. Conclusion and Future Scope
11. References
12. Appendix

---

## 1. INTRODUCTION

### 1.1 General Introduction

Students often have useful academic, technical, and creative skills, but there is no simple and fair way to exchange those skills within a campus community. Paid learning platforms create a financial barrier, while informal knowledge exchange systems lack accountability and discoverability. SkillSwap addresses this challenge by enabling peer-to-peer learning through a barter-based digital platform.

The platform allows students to publish what they can teach and what they want to learn. A time-credit economy encourages reciprocity by assigning value to each completed learning exchange. Students can discover others, create swap requests, and complete sessions inside a system that records and updates credits consistently.

### 1.2 Problem Statement

There is no well-structured student-focused platform that supports skill exchange without money while still ensuring fairness, trust, and reciprocal participation. Most existing systems suffer from one or more of the following limitations:

- lack of reciprocal enforcement;
- no automated matching between complementary skill sets;
- dependence on external trust or payment systems;
- weak onboarding support for new users.

### 1.3 Objectives of the Project

- To design and implement a peer-to-peer skill barter platform for students.
- To establish a fair time-credit economy where teaching earns credits and learning consumes credits.
- To build an automated matching mechanism that finds complementary HAVE and NEED skill relationships.
- To support end-to-end swap request workflows including request creation, acceptance, rejection, and completion.
- To integrate an AI assistant for guidance, suggestions, and communication support.

### 1.4 Project Deliverables

- A full-stack web application for student skill exchange.
- Secure user registration and login functionality.
- Skill publishing and profile management interfaces.
- Smart matching and mutual swap suggestion features.
- Atomic credit transfer logic for completed sessions.
- AI-powered assistant and skill suggestion APIs.
- A mini project report and presentation.

### 1.5 Current Scope

The current implementation focuses on a student-use web application that supports user authentication, skill posting, search and filtering, dashboard-driven matching, request handling, and AI assistance. The project uses a centralized relational database and is optimized for academic peer-learning communities.

### 1.6 Future Scope

Future work can extend the system with scheduling, notifications, live messaging, rating analytics, moderation workflows, department-wise communities, recommendation ranking, and broader institutional deployment. Support for video-based sessions, verified completion proofs, and deeper AI personalization can further improve the system.

---

## 2. PROJECT ORGANIZATION

### 2.1 Software Process Model

The project follows an **Agile-inspired iterative development approach**. Features were incrementally designed, implemented, reviewed, and refined. This helped the team validate core functionality such as authentication, skills management, and swap workflows before moving to advanced features like automated matching and AI assistance.

### 2.2 Roles and Responsibilities

| Team Member | Responsibility |
| --- | --- |
| Sambhav | Full-stack development, UI design, dashboard and skills marketplace integration |
| Parth | Database design, authentication, API workflows, matching and credit logic |
| Guide | Academic review, feedback, and technical direction |

---

## 3. LITERATURE SURVEY

### 3.1 Introduction

Peer learning platforms, knowledge-sharing communities, barter systems, and AI-assisted educational tools form the conceptual background of this project. The literature shows increasing interest in collaborative learning systems, but most platforms either emphasize monetized tutoring, open-ended community sharing, or recommendation systems without reciprocal exchange enforcement.

### 3.2 Review of Related Work

Studies such as Kumar et al. (2021) and Reddy and Nair (2020) discuss online skill-sharing platforms but do not strongly enforce reciprocity. Gupta and Sharma (2022) describe peer exchange in academic communities, yet most matching remains user-driven rather than automated. Patel and Joshi (2022) explore decentralized trust models using blockchain, but those approaches introduce substantial technical friction for ordinary students. Recent work by Martinez and Kim (2023), Huang and Zhao (2021), and Anderson (2021) highlights the role of AI in recommendation and explainable assistance for learning platforms.

### 3.3 Research Gap

The survey reveals four major gaps:

- most platforms do not guarantee reciprocal contribution;
- automated complementary matching is often weak or absent;
- trust mechanisms are either too informal or too technically heavy;
- AI support is not well integrated into student skill exchange platforms.

SkillSwap addresses these gaps using a simple time-credit economy, relational matching through Prisma queries, atomic transactional updates, and AI-backed assistance.

---

## 4. PROJECT MANAGEMENT PLAN

### 4.1 Schedule of the Project

The project was developed in iterative phases:

1. Problem identification and requirement collection
2. Literature survey and architecture planning
3. Database schema and authentication setup
4. Core UI and marketplace implementation
5. Skill management and smart matching development
6. Swap request workflow and credit logic
7. AI integration and feature polishing
8. Testing, debugging, and documentation

### 4.2 Risk Identification

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Incorrect credit updates | High | Use Prisma transactions for atomic updates |
| Unauthorized access | High | Protect routes using NextAuth session checks |
| Poor user adoption | Medium | Add starter credits and easy onboarding |
| Weak match quality | Medium | Use complementary HAVE/NEED matching logic |
| AI API failure | Medium | Keep core platform functional without AI dependency |

---

## 5. SOFTWARE REQUIREMENT SPECIFICATION

### 5.1 Purpose

The purpose of the system is to provide a fair, student-friendly web platform where users can exchange skills through reciprocal learning sessions instead of monetary payments.

### 5.2 Scope

The system supports student registration, authentication, skill posting, dashboard access, automated matching, request management, time-credit updates, and AI-based assistance. It is intended for campus or community learning ecosystems.

### 5.3 Overall Description

#### 5.3.1 Product Perspective

SkillSwap is a centralized web application that combines a modern React-based frontend with API routes and a relational database backend. It acts as a dedicated platform for structured knowledge exchange.

#### 5.3.2 Product Features

- user registration and login;
- skills marketplace;
- HAVE and NEED skill classification;
- dashboard with time credits and session tracking;
- recent request management;
- smart matching and mutual swap generation;
- AI assistant chat and AI suggestions;
- atomic completion and credit transfer flow.

#### 5.3.3 Operating Environment

- Frontend: Next.js 14, React, Tailwind CSS
- Backend: Next.js Route Handlers
- Database: PostgreSQL through Prisma ORM
- Authentication: NextAuth credentials provider
- AI Integration: Anthropic Claude API
- Development Platform: Node.js ecosystem

### 5.4 External Interface Requirements

#### 5.4.1 User Interface

The platform provides pages for login, registration, dashboard, profile, skill posting, and the public marketplace. Components include search, filtering, cards, modals, AI assistant chat, and request detail dialogs.

#### 5.4.2 Hardware Interface

The system requires only a standard web-enabled desktop or mobile device.

#### 5.4.3 Software Interface

- PostgreSQL database
- Prisma ORM client
- NextAuth session handling
- Anthropic API for AI-based responses and suggestions

#### 5.4.4 Communication Interface

The application uses HTTP-based request/response communication for frontend-backend interactions through route handlers.

### 5.5 System Features

#### 5.5.1 Functional Requirements

- The system shall allow a new user to register with name, email, and password.
- The system shall authenticate users securely.
- The system shall allow users to add HAVE and NEED skills.
- The system shall display marketplace skills with search and filters.
- The system shall compute smart matches from complementary skill relations.
- The system shall allow users to send, accept, reject, and complete swap requests.
- The system shall update time credits after a completed session.
- The system shall store credit transactions for completed sessions.
- The system shall provide AI-generated suggestions and chat assistance.

#### 5.5.2 Non-Functional Requirements

- usability through a modern and responsive interface;
- consistency through atomic database operations;
- maintainability through modular components and route handlers;
- scalability through relational schema design and server-rendered data fetching;
- security through session-based authorization and password hashing.

#### 5.5.3 Use Case Description

Primary use cases include registration, login, adding skills, discovering matches, sending swap requests, completing sessions, and consulting the AI assistant.

#### 5.5.4 Use Case Summary

Actors:

- Student user
- Authenticated user
- AI assistant service

Main interactions:

- create account;
- publish skills;
- search marketplace;
- view matches;
- request swap;
- accept or reject request;
- complete session and transfer credits;
- receive AI suggestions.

---

## 6. DESIGN

### 6.1 Introduction

The system is designed as a modern full-stack web application with a clear separation between presentation, business logic, and data management. The architecture supports extensibility while keeping the workflow intuitive for student users.

### 6.2 Architecture Design

The system can be viewed in three layers:

1. **Presentation Layer**  
   Built with Next.js, React, and Tailwind CSS. Includes marketplace, dashboard, profile, and modal-driven interaction flows.

2. **Application Layer**  
   Implemented using Next.js route handlers. Handles authentication, skills, requests, AI chat, AI suggestions, and mutual swap workflows.

3. **Data Layer**  
   Managed using Prisma ORM with PostgreSQL. Stores users, skills, swap requests, and credit transactions.

### 6.3 User Interface Design

The main user interface modules are:

- Home marketplace page with search and category filters
- Login and registration pages
- User dashboard with credits, sessions, requests, and matches
- Skills sidebar and management modal
- Swap request details and status actions
- Floating AI assistant chat panel

### 6.4 Database Design

The core entities are:

- **User**: stores identity, department, year, bio, time credits, rating, and sessions
- **Skill**: stores a user-owned skill with type HAVE or NEED
- **SwapRequest**: stores request status, participants, message, session time, and credit amount
- **CreditTransaction**: stores audit information for completed exchanges

This schema supports relational queries for matching and transactional consistency for credit updates.

### 6.5 Conclusion

The design supports a clean flow from user discovery to learning exchange. The layered structure and relational model make the system practical for extension and academic demonstration.

---

## 7. IMPLEMENTATION

### 7.1 Tools Introduction

The project is implemented using:

- Next.js 14 App Router
- React 18
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- Anthropic SDK
- TypeScript

### 7.2 Technology Overview

The application uses server-side data fetching and route handlers provided by Next.js. Prisma provides typed database access and transaction support. Credentials-based login is implemented through NextAuth, and password hashes are checked using bcrypt. The interface uses reusable React components and animated interactions powered by Framer Motion.

### 7.3 Overall View of Implementation

The home page loads posted skills from the database and displays them through a marketplace client with search and filter controls. The dashboard verifies the logged-in session, loads the user profile and skill data, computes smart matches, and renders requests, AI suggestions, and skill panels.

### 7.4 Important Modules

#### 7.4.1 Authentication Module

The credentials provider validates the user through email and password and stores the user identifier in the session token. Protected routes redirect unauthenticated users to the login page.

#### 7.4.2 Skills Module

Users can create skills with a name, category, and type (HAVE or NEED). The skills API also supports filtering by type and category for marketplace views.

#### 7.4.3 Matching Module

The dashboard computes the current user's HAVE and NEED skills and then queries other users' skills to find complementary relationships. The `SmartMatches` component further checks for mutual exchange opportunities and allows mutual swap creation.

#### 7.4.4 Request and Credit Module

Users can create swap requests, view request details, accept or reject requests, and mark accepted sessions as completed. When a request is completed, Prisma executes an atomic transaction that:

- marks the request as completed,
- deducts credits from the learner,
- adds credits to the teacher,
- increments completed sessions,
- stores a credit transaction record.

#### 7.4.5 AI Integration Module

The AI chat route sends the user's skill profile and credit state to Claude so the assistant can give personalized help. Another route generates structured JSON skill suggestions based on the user's HAVE and NEED profile.

### 7.5 Implementation Highlights

- starter user credits help solve the cold-start problem;
- matching is based on explicit relational skill complementarity;
- mutual swaps reduce friction when both users can help each other;
- AI is used as an assistive layer without replacing the core product logic.

### 7.6 Conclusion

The implementation successfully combines modern web development, relational data design, transactional consistency, and assistive AI into a coherent student platform.

---

## 8. TESTING

### 8.1 Introduction

Testing focused on verifying user workflows, database consistency, and correct interaction between the UI and backend route handlers.

### 8.2 Testing Approach

The following areas were tested:

- registration and login flow;
- skill creation and listing;
- marketplace search and filters;
- dashboard rendering for authenticated users;
- smart match generation;
- swap request creation and status transitions;
- credit transfer on request completion;
- AI route invocation and response handling.

### 8.3 Sample Test Cases

| Test Case | Expected Result |
| --- | --- |
| Register a new user | User account is created successfully |
| Add HAVE and NEED skills | Skills appear in dashboard and marketplace |
| Send swap request | Request is stored with PENDING status |
| Receiver accepts request | Status changes to ACCEPTED |
| Complete request | Credits transfer atomically and transaction is stored |
| Open AI assistant | User gets contextual response |
| Request AI suggestions | Structured suggestions are returned |

### 8.4 Testing Outcome

The implemented modules support the intended platform flow. The transactional logic especially strengthens reliability by preventing partial updates during session completion.

---

## 9. RESULTS AND ANALYSIS

### 9.1 Outcome of Objective 1: Fair Time Credit Economy

The dashboard presents each user's current time-credit balance and session statistics. This confirms that the platform successfully tracks learning currency and encourages reciprocal participation rather than one-sided consumption.

### 9.2 Outcome of Objective 2: Automated Matching

The smart match module identifies users who offer skills the current student needs or need skills the current student can offer. This reduces manual search effort and improves discoverability within the peer-learning network.

### 9.3 Outcome of Objective 3: Atomic Credit Transfers

The request completion flow updates request status, user credits, and transaction records inside a single Prisma transaction. This improves correctness and avoids inconsistent states during barter exchanges.

### 9.4 Outcome of Objective 4: AI Assistance

The AI assistant and AI suggestion modules add usability support by helping users understand their profile, improve participation, and draft or discover better skill exchanges.

### 9.5 Overall Analysis

SkillSwap demonstrates that a student-centered barter learning platform can be implemented effectively using a modern full-stack architecture. The strongest outcomes are:

- fairness through time credits;
- practical matchmaking through relational queries;
- reliable updates through transactions;
- improved accessibility through AI guidance.

### 9.6 Result Snapshots

The project presentation includes interface snapshots that demonstrate the implemented system. These screenshots are used in the final formatted report to show the working dashboard, database-related view, user interface layout, and matching workflow.

Key screenshots included in the formatted report:

- Development and suggestion incorporation snapshot
- Database design / schema-related slide snapshot
- Dashboard and command interface snapshot
- First objective result snapshot
- Second objective result snapshot

---

## 10. CONCLUSION AND FUTURE SCOPE

### 10.1 Conclusion

SkillSwap successfully addresses the need for a non-monetary, structured, and student-friendly knowledge exchange platform. By combining a time-credit economy, complementary skill matching, swap request workflows, and AI-driven assistance, the system creates a practical environment for collaborative peer learning.

The project also demonstrates how modern web technologies can be used to build socially useful academic platforms. The application is not only functionally complete for a mini-project scope, but also extensible enough for future institutional deployment.

### 10.2 Significance of the Work

The system promotes reciprocal learning, lowers barriers to finding mentors and peers, and encourages students to treat knowledge as a community asset rather than a paid-only resource. This makes the project educationally relevant as well as technically sound.

### 10.3 Limitations

- matching is currently rule-based rather than ranking-based;
- the platform does not yet include scheduling or live communication;
- rating and moderation workflows are limited;
- AI features depend on external API availability.

### 10.4 Future Work

- add calendar scheduling and reminders;
- add chat or video-session support;
- introduce recommendation ranking and reputation models;
- support institution-wide deployment and analytics dashboards;
- add richer profile verification and moderation tools.

---

## 11. REFERENCES

1. Kumar, A., et al. (2021). Skill Share: A Knowledge Sharing Platform for Peer Communities.
2. Gupta, R., and Sharma, P. (2022). A Peer-to-Peer Skills and Knowledge Exchange Platform for Academic Communities.
3. Wang, J., and Lee, C. (2023). Knowledge Exchange Mechanisms in Online Communities: A Systematic Review.
4. Chen, L., and Zhao, Y. (2021). Ontology-based Skill Matching Algorithms for Human Resource Systems.
5. Patel, K., and Joshi, H. (2022). A Decentralized Peer Learning Model Using Smart Contracts and Blockchain.
6. Martinez, J., and Kim, S. (2023). Enhancing Peer-to-Peer Learning through AI-Powered Recommendation Systems.
7. Singh, A., and Verma, R. (2022). Gamification and User Engagement in Skill-Sharing Platforms.
8. Kas, J. (2021). Trust and Reputation in the Peer-to-Peer Platform Economy.
9. Reddy, V., and Nair, S. (2020). Skill Swap: A Web-Powered Platform for Knowledge Exchange Among Students.
10. Tan, Z., and Chua, K. (2022). Deep Learning for Personalized Learning Paths in Educational Platforms.
11. Botsman, R., and Rogers, R. (2021). Collaborative Consumption and the Resource-Saving Economy.
12. Huang, C., and Zhao, Y. (2021). AI-Driven Skill Matching in Online Learning Platforms.
13. Deterding, S., et al. (2021). Gamification in Collaborative Learning: Synthesizing the Evidence.
14. Anderson, J. (2021). Smart Matching: Intelligent Tutoring Systems and Personalized Learning.

---

## 12. APPENDIX

### Appendix A: Key Source-Informed Features

- `User`, `Skill`, `SwapRequest`, and `CreditTransaction` relational schema
- credentials-based authentication using NextAuth
- dashboard with time-credit and session summary
- smart matches and mutual swap workflow
- AI assistant chat route
- AI suggestion route for complementary skills

### Appendix B: Included Figures

- Figure 1: Development and suggestion incorporation snapshot
- Figure 2: Database design snapshot
- Figure 3: Dashboard / command interface snapshot
- Figure 4: Result snapshot for objective one
- Figure 5: Result snapshot for objective two
