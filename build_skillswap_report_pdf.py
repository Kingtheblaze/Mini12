from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, inch
from reportlab.platypus import Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


root = Path(r"D:\Riot Games\skillswap-modern")
pdf_path = root / "SkillSwap_Mini_Project_Report_fixed.pdf"
assets = root / "report_assets"
logo_path = root / "draft_pdf_images" / "page1_img1.jpg"

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleBig",
        parent=styles["Title"],
        fontName="Times-Bold",
        fontSize=19,
        leading=24,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="SubCenter",
        parent=styles["BodyText"],
        fontName="Times-Bold",
        fontSize=11,
        leading=14,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="H1C",
        parent=styles["Heading1"],
        fontName="Times-Bold",
        fontSize=14,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=8,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="H2C",
        parent=styles["Heading2"],
        fontName="Times-Bold",
        fontSize=12,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=5,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyC",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=10.8,
        leading=16,
        alignment=TA_JUSTIFY,
        firstLineIndent=18,
        spaceAfter=9,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletC",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=10.6,
        leading=15,
        leftIndent=20,
        bulletIndent=6,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="CaptionC",
        parent=styles["BodyText"],
        fontName="Times-Italic",
        fontSize=9.8,
        leading=12,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallC",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=9.5,
        leading=12,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
)

box_style = TableStyle(
    [
        ("GRID", (0, 0), (-1, -1), 0.6, colors.black),
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.4),
        ("LEADING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
)

story = []


def para(text, style="BodyC"):
    story.append(Paragraph(text, styles[style]))


def bullets(items):
    for item in items:
        story.append(Paragraph(item, styles["BulletC"], bulletText="•"))


def fig(path, caption, max_w=6.0 * inch, max_h=4.4 * inch):
    path = Path(path)
    if not path.exists():
        return
    with PILImage.open(path) as img:
        w, h = img.size
    scale = min(max_w / w, max_h / h)
    story.append(Image(str(path), width=w * scale, height=h * scale))
    if caption:
        story.append(Spacer(1, 0.05 * inch))
        story.append(Paragraph(caption, styles["CaptionC"]))


# Title Page
story += [Spacer(1, 0.35 * inch)]
para("Department of CSE (AI & ML)", "SubCenter")
para("and", "SubCenter")
para("Department of CSE (Cyber Security)", "SubCenter")
story += [Spacer(1, 0.28 * inch)]
para("A Project Report on", "SubCenter")
para("SkillSwap - Web-Based Peer-to-Peer Skill Barter Platform", "TitleBig")
para("Submitted in partial fulfillment of the requirements for the award of the degree of", "SubCenter")
story += [Spacer(1, 0.10 * inch)]
para("Bachelor of Engineering", "SubCenter")
para("By", "SubCenter")
story += [Spacer(1, 0.10 * inch)]
para("Sambhav            1MS23CI107", "SubCenter")
para("Parth              1MS23CI083", "SubCenter")
story += [Spacer(1, 0.22 * inch)]
para("Under the guidance of", "SubCenter")
para("Dr. Sahana Lokesh R", "SubCenter")
para("Associate Professor", "SubCenter")
story += [Spacer(1, 0.18 * inch)]
if logo_path.exists():
    logo = Image(str(logo_path), width=3.6 * inch, height=1.22 * inch)
    logo.hAlign = "CENTER"
    story.append(logo)
story += [Spacer(1, 0.18 * inch)]
para("M S RAMAIAH INSTITUTE OF TECHNOLOGY", "SubCenter")
para("(Autonomous Institute, Affiliated to VTU)", "SubCenter")
para("BANGALORE-560054", "SubCenter")
para("www.msrit.edu", "SubCenter")
para("2026", "SubCenter")
story.append(PageBreak())

# Certificate
para("Department of CSE (AI & ML) and Department of CSE (Cyber Security)", "SubCenter")
story += [Spacer(1, 0.18 * inch)]
para("CERTIFICATE", "H1C")
para(
    "Certified that the mini project work entitled <b>“SkillSwap - Web-Based Peer-to-Peer Skill Barter Platform”</b> carried out by <b>Sambhav - 1MS23CI107</b> and <b>Parth - 1MS23CI083</b> are bonafide students of M. S. Ramaiah Institute of Technology, Bengaluru in partial fulfillment of the requirements of the Mini Project during the academic year 2025-26. It is certified that the corrections and suggestions indicated during review have been incorporated in the report deposited in the department.",
    "BodyC",
)
para(
    "The project report has been approved as it satisfies the academic requirements in respect of project work prescribed for the said degree.",
    "BodyC",
)
story += [Spacer(1, 0.6 * inch)]
cert = Table(
    [
        ["Project Guide", "", "Head of the Department"],
        ["Dr. Sahana Lokesh R", "", "________________________"],
        ["", "", ""],
        ["External Examiners", "", ""],
        ["1. ________________________", "", "Signature with Date"],
        ["2. ________________________", "", ""],
    ],
    colWidths=[2.6 * inch, 0.8 * inch, 2.6 * inch],
)
cert.setStyle(
    TableStyle(
        [
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, -1), "Times-Roman"),
            ("FONTSIZE", (0, 0), (-1, -1), 10.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ]
    )
)
story.append(cert)
story.append(PageBreak())

# Declaration
para("Department of CSE (AI & ML) and Department of CSE (Cyber Security)", "SubCenter")
story += [Spacer(1, 0.18 * inch)]
para("DECLARATION", "H1C")
para(
    "We hereby declare that the entire work embodied in this mini project report has been carried out by us at M. S. Ramaiah Institute of Technology, Bengaluru, under the supervision of <b>Dr. Sahana Lokesh R</b>. This report has not been submitted in part or full for the award of any diploma or degree of this or any other university.",
    "BodyC",
)
story += [Spacer(1, 0.9 * inch)]
decl = Table(
    [["Signature:", "", "Signature:"], ["Sambhav", "", "Parth"], ["1MS23CI107", "", "1MS23CI083"]],
    colWidths=[2.5 * inch, 1.1 * inch, 2.5 * inch],
)
decl.setStyle(
    TableStyle(
        [
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, -1), "Times-Roman"),
            ("FONTSIZE", (0, 0), (-1, -1), 10.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ]
    )
)
story.append(decl)
story.append(PageBreak())

# Acknowledgement
para("ACKNOWLEDGEMENT", "H1C")
for text in [
    "We take this opportunity to express our gratitude to the people who have been instrumental in the successful completion of this project. We would like to express our sincere gratitude to the Management and the faculty of M. S. Ramaiah Institute of Technology, Bengaluru for providing us with the opportunity to work on a meaningful software project that connects technology with collaborative learning.",
    "We extend our heartfelt gratitude to our guide <b>Dr. Sahana Lokesh R</b> for her continuous encouragement, constructive feedback, and constant guidance at every stage of the project. Her suggestions helped us refine the system design, implementation flow, and presentation of the final work.",
    "We also thank the faculty members of the departments of CSE (AI & ML) and CSE (Cyber Security), our friends, and our family members for their support, motivation, and suggestions during the course of this work. Their encouragement was invaluable in carrying this project from idea to implementation.",
]:
    para(text)
story.append(PageBreak())

# Abstract
para("Abstract", "H1C")
for text in [
    "SkillSwap is a web-based peer-to-peer skill barter platform designed to enable students to exchange knowledge and expertise without monetary transactions. Many learners possess valuable technical, creative, and academic skills, yet there is no structured campus-focused platform that allows them to trade these skills fairly while also encouraging reciprocal participation. Existing platforms generally depend on payments, manual discovery, or informal arrangements, all of which reduce trust and accessibility.",
    "The proposed system introduces a <b>Time Credit</b> model in which teaching for one hour earns a credit that can later be used to learn from another user. To reduce the cold-start problem commonly seen in barter communities, new users are provided with starter credits at registration. The platform supports registration, authentication, skill publishing, skill discovery, automated smart matching, swap request workflows, and contextual AI support. The matching flow identifies complementary skill relationships by comparing the user’s HAVE skills with other users’ NEED skills, and vice versa.",
    "The application is implemented using <b>Next.js 14 App Router</b>, <b>React</b>, <b>Tailwind CSS</b>, <b>Prisma ORM</b>, <b>PostgreSQL</b>, and <b>NextAuth</b>. AI assistance is integrated through the <b>Anthropic Claude API</b> to provide recommendations, conversational help, and messaging support. In addition, critical barter operations such as credit transfer and session completion are handled atomically with Prisma transactions to preserve consistency and trust. The project demonstrates that a fair and practical knowledge-sharing ecosystem can be created for students using a modern full-stack architecture.",
]:
    para(text)
story.append(PageBreak())

# TOC
para("TABLE OF CONTENTS", "H1C")
for line in [
    "Chapter No.    Title             Page No.",
    "Abstract                            5",
    "List of Figures               8",
    "List of Tables                9",
    "1 INTRODUCTION                                                                                   10",
    "1.1 General Introduction",
    "1.2 Problem Statement",
    "1.3 Objectives of the project",
    "1.4 Project deliverables",
    "1.5 Current Scope",
    "1.6 Future Scope",
    "2 PROJECT ORGANIZATION            12",
    "2.1 Software Process Models",
    "2.2 Roles and Responsibilities",
    "3 LITERATURE SURVEY                         14",
    "3.1 Introduction",
    "3.2 Review of Related Work",
    "3.3 Conclusion of Survey",
    "4 PROJECT MANAGEMENT PLAN           19",
    "4.1 Schedule of the Project",
    "4.2 Risk Identification",
    "5 SOFTWARE REQUIREMENT SPECIFICATIONS         21",
    "5.1 Purpose",
    "5.2 Project Scope",
    "5.3 Overall description",
    "5.4 External Interface Requirements",
    "5.5 System Features",
    "6 DESIGN               26",
    "6.1 Introduction",
    "6.2 Architecture Design",
    "6.3 User Interface Design",
    "6.4 Low Level Design",
    "6.5 Conclusion",
    "7 IMPLEMENTATION                        33",
    "8 TESTING               39",
    "9 RESULTS & PERFORMANCE ANALYSIS                     41",
    "10 CONCLUSION & SCOPE FOR FUTURE WORK                    47",
    "11 REFERENCES              49",
    "12 APPENDIX               51",
]:
    para(line, "SmallC")
story.append(PageBreak())

para("List of Figures", "H1C")
for line in [
    "FIGURE NO. TITLE PAGE NO.",
    "4.1 Project Schedule 20",
    "5.1 Workflow of the Project 25",
    "6.1 System Architecture 27",
    "6.2 Use Case / Interaction Flow 31",
    "9.1 Development and suggestion incorporation snapshot 41",
    "9.2 Database design snapshot 42",
    "9.3 Dashboard / command interface snapshot 42",
    "9.4 Result snapshot of first objective 43",
    "9.5 Result snapshot of second objective 44",
]:
    para(line, "SmallC")
story.append(PageBreak())

para("List of Tables", "H1C")
for line in [
    "TABLE NO.  TITLE  PAGE NO.",
    "2.1  Roles and Responsibilities of Team Members  13",
    "4.1  Risk Identification of the Project  20",
    "8.1  Test Cases adopted for system evaluation  40",
]:
    para(line, "SmallC")
story.append(PageBreak())

# Chapter 1
para("1. INTRODUCTION", "H1C")
para("1.1 General Introduction", "H2C")
for text in [
    "Students today participate in highly diverse learning environments where technical, academic, and creative skills are distributed across peer groups. A student may be proficient in programming, design, mathematics, public speaking, music production, or communication, while simultaneously requiring help in another area. However, most existing learning platforms are designed either for formal paid tutoring or for unstructured community discussion. They rarely provide a dedicated and fair mechanism for reciprocal exchange of skills between peers.",
    "SkillSwap is proposed as a web-based peer-to-peer platform through which students can trade their knowledge or expertise without using money in the process. Instead of a currency-based marketplace, the platform adopts a barter-oriented model based on time. A user who spends one hour teaching a skill earns one time credit, and that credit may later be used to learn another skill from someone else in the community. This encourages both contribution and participation, preventing the free-rider problem commonly seen in open communities.",
    "The project also recognizes that barter communities often suffer from a cold-start challenge: new users may not yet have credits or exchange history, which reduces early engagement. To address this, SkillSwap provides starter credits to newly registered users and complements the exchange system with automated matching and AI-based guidance. Together, these features create a more supportive environment for student learning and collaboration.",
]:
    para(text)
para("1.2 Problem Statement", "H2C")
for text in [
    "While students are endowed with varied capabilities, there exists no proper platform where they can exchange these abilities without paying money. Existing systems do not strongly encourage the practice of reciprocal knowledge exchange and often depend on manual discovery, informal communication, or paid tutor models. As a result, students tend either to hoard expertise or consume knowledge without contributing back to the community.",
    "There is also no automatic system that helps match complementary abilities between students. A learner who needs help in Java may not easily discover another student who teaches Java and needs help in a skill such as UI design or machine learning. Without structured discovery, many useful peer-learning opportunities remain unrealized.",
]:
    para(text)
para("1.3 Objectives of the Project", "H2C")
bullets(
    [
        "To establish a fair time-credit economy in which one hour of teaching is treated as one transferable learning credit.",
        "To develop a peer-to-peer student platform that supports skill posting, browsing, and structured exchange workflows.",
        "To automate the identification of complementary skills between users based on HAVE and NEED relationships.",
        "To support reliable barter operations through transactional update logic for requests and credit transfers.",
        "To integrate AI assistance for onboarding, recommendations, and messaging support.",
    ]
)
para("1.4 Project Deliverables", "H2C")
bullets(
    [
        "A working full-stack SkillSwap web application.",
        "Credentials-based registration and login system.",
        "Marketplace and dashboard views for skill discovery and exchange.",
        "Smart match and mutual swap workflow.",
        "Atomic credit transfer and transaction logging subsystem.",
        "AI assistant and AI recommendation endpoints.",
        "Project presentation and mini project report.",
    ]
)
para("1.5 Current Scope", "H2C")
para(
    "The current scope covers the implementation of a campus-focused web application with secure login, profile creation, skill management, public skill marketplace, dashboard-based smart matching, swap request lifecycle support, and AI-powered suggestions. The project focuses on the digital coordination layer of peer-to-peer learning rather than on actual scheduling or live instructional delivery."
)
para("1.6 Future Scope", "H2C")
para(
    "Future enhancements include live messaging, calendar scheduling, ratings and verification, department-wise communities, recommendation ranking, analytics dashboards for campus usage, and integration of video-based session support. Additional work can also improve recommendation quality using historical exchange behavior and reputation-aware matching."
)
story.append(PageBreak())

# Chapter 2
para("2. PROJECT ORGANIZATION", "H1C")
para("2.1 Software Process Models", "H2C")
for text in [
    "For this project, an Agile methodology with iterative refinement was followed. The platform contains multiple moving parts, including authentication, database design, user interface modules, matching logic, request handling, and AI integration. An iterative model was suitable because it allowed the team to prioritize a working core system first and then add intelligent features gradually.",
    "The work was organized in short implementation cycles similar to Scrum-style sprints. In the early stage, effort was focused on schema design and authentication. Once a reliable data model was available, attention shifted to the marketplace, dashboard, and skill management flows. In subsequent iterations, the team implemented smart matching, mutual swap support, and AI recommendations. This process supported continuous feedback incorporation and reduced the risk of late-stage integration issues.",
]:
    para(text)
scrum = Table(
    [
        ["Iteration", "Primary Focus"],
        ["Cycle 1", "Requirements, schema design, authentication"],
        ["Cycle 2", "Marketplace, dashboard, profile and skill management"],
        ["Cycle 3", "Smart matching, request flow, mutual swaps"],
        ["Cycle 4", "AI recommendations, assistant integration, testing and documentation"],
    ],
    colWidths=[1.25 * inch, 4.95 * inch],
)
scrum.setStyle(box_style)
story.append(scrum)
story.append(Spacer(1, 0.08 * inch))
para("Fig 2.1: Iterative Agile development cycle used in the project", "CaptionC")
para("2.2 Roles and Responsibilities", "H2C")
roles = Table(
    [
        ["Role", "Responsibilities", "Team Member"],
        [
            "Project Planning and Full-Stack Development",
            "Requirement analysis, architecture planning, server-side implementation, dashboard logic, request workflow integration, and overall coordination.",
            "Sambhav",
        ],
        [
            "Database, Authentication, and Matching Logic",
            "Prisma schema design, NextAuth integration, user registration flow, skill matching logic, and transactional operations for credits.",
            "Parth",
        ],
        ["Guide", "Technical review, academic feedback, and periodic progress monitoring.", "Dr. Sahana Lokesh R"],
    ],
    colWidths=[1.8 * inch, 3.4 * inch, 1.1 * inch],
)
roles.setStyle(
    TableStyle(
        [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
            ("FONTSIZE", (0, 0), (-1, -1), 9.5),
            ("LEADING", (0, 0), (-1, -1), 11),
        ]
    )
)
story.append(roles)
story.append(Spacer(1, 0.08 * inch))
para("Table 2.1: Roles and Responsibilities of Team Members", "CaptionC")
story.append(PageBreak())

# Chapter 3
para("3. LITERATURE SURVEY", "H1C")
para("3.1 Introduction", "H2C")
for text in [
    "The conceptual basis of SkillSwap lies at the intersection of peer learning systems, online knowledge-sharing communities, barter-based exchange models, trust mechanisms, and AI-assisted recommendations. A literature survey helps position the project within this broader context and identify the specific gaps that motivate the proposed system.",
    "Although many digital learning systems support community interaction, most do not treat knowledge exchange as a reciprocal resource flow. In practice, students often need lightweight mechanisms to both teach and learn, with incentives that encourage balanced contribution. The following review summarizes relevant work on skill-sharing platforms, peer exchange communities, trust models, and AI-enhanced educational recommendations.",
]:
    para(text)
para("3.2 Review of Related Work", "H2C")
lit_items = [
    ("1. Kumar et al. (2021)", "This work discusses a knowledge-sharing platform for peer communities and highlights the benefits of decentralized learning participation. However, the system mainly emphasizes access and sharing rather than enforcing reciprocity. This limitation is important because communities without a strong give-and-take model tend to accumulate passive users. SkillSwap improves on this by explicitly binding learning to time-credit expenditure and teaching to time-credit earning."),
    ("2. Gupta and Sharma (2022)", "The authors explore peer-to-peer knowledge exchange in academic communities. Their work supports the value of campus-based exchange systems but relies heavily on users manually searching for appropriate collaborators. In contrast, SkillSwap automates discovery by comparing HAVE and NEED skills across users and surfacing direct or mutual matches on the dashboard."),
    ("3. Wang and Lee (2023)", "This systematic review on knowledge exchange mechanisms in online communities reinforces the importance of trust, discoverability, and low-friction participation. It also shows that users disengage when interaction costs are high or when the quality of exchange is uncertain. SkillSwap addresses this through a transparent credit model and lightweight workflow design."),
    ("4. Patel and Joshi (2022)", "Their decentralized peer learning approach uses blockchain-backed trust. While technically interesting, such systems often demand additional user effort, such as wallet setup or understanding tokenized mechanisms. SkillSwap aims to achieve practical trust using simpler application-level transactional guarantees through Prisma rather than introducing extra external dependencies."),
    ("5. Martinez and Kim (2023)", "This work studies AI-powered recommendation systems for peer learning and shows that AI can improve discovery, relevance, and user support. However, recommendation alone is not sufficient unless paired with a clear transactional and social exchange model. SkillSwap uses AI as an assistive layer over a barter-driven platform rather than as a standalone recommendation engine."),
    ("6. Huang and Zhao (2021)", "The study emphasizes AI-driven skill matching in online learning platforms. It confirms that data-informed pairing improves the chance of useful exchanges. SkillSwap adopts this insight in a simpler relational form by matching users through structured skill entries and contextual assistance."),
    ("7. Botsman and Rogers (2021)", "Their discussion of collaborative consumption and resource-sharing economies is relevant because it frames underused assets as shareable community resources. In the SkillSwap context, time and knowledge are treated as the key shareable resources."),
    ("8. Deterding et al. (2021)", "This work on gamification and collaborative learning shows that engagement improves when systems provide visible progression and incentives. SkillSwap’s time-credit balance, session count, and request flow align with this insight by making contribution measurable and rewarding."),
]
for head, body in lit_items:
    para(f"<b>{head}</b> {body}")
para("3.3 Conclusion of Survey", "H2C")
for text in [
    "The survey indicates that while several systems support peer learning, most do not integrate all of the following at once: reciprocal enforcement, low-friction trust, automated complementary matching, and AI assistance. Existing solutions typically solve only one or two of these concerns.",
    "This gap motivates the proposed system. SkillSwap combines barter economics, automated relational matching, transactional consistency, and conversational AI support in a single student-centric platform. The literature therefore supports both the feasibility and the relevance of the proposed work.",
]:
    para(text)
story.append(PageBreak())

# Chapter 4
para("4. PROJECT MANAGEMENT PLAN", "H1C")
para("4.1 Schedule of the Project", "H2C")
for text in [
    "The project was executed in phases beginning with problem identification and requirement gathering. This was followed by literature review and architectural planning, after which the team designed the relational schema and authentication flow. Once the backend foundation was stable, attention moved to user interface construction, smart matching, request lifecycle handling, and AI-assisted features. The final phase focused on testing, refinement, presentation preparation, and report writing.",
    "The phased approach reduced integration risk and ensured that the most essential platform features were implemented first. User-facing modules such as the dashboard and marketplace were developed only after the database schema and authentication layer were sufficiently stable.",
]:
    para(text)
schedule = Table(
    [
        ["Phase", "Activity"],
        ["Week 1", "Problem identification, literature survey, objective definition"],
        ["Week 2", "Architecture planning, Prisma schema and auth design"],
        ["Week 3", "Marketplace, dashboard, profile and skills modules"],
        ["Week 4", "Matching logic, request lifecycle, credit transaction flow"],
        ["Week 5", "AI integration, UI refinement, testing and report preparation"],
    ],
    colWidths=[1.1 * inch, 5.1 * inch],
)
schedule.setStyle(box_style)
story.append(schedule)
story.append(Spacer(1, 0.08 * inch))
para("Fig 4.1: Project Schedule", "CaptionC")
para("4.2 Risk Identification", "H2C")
para(
    "Risk analysis was carried out to identify issues that could affect correctness, usability, or successful delivery of the SkillSwap platform. The following table summarizes the main implementation risks and the controls adopted during development."
)
risk = Table(
    [
        ["Risk", "Description", "Impact", "Mitigation"],
        [
            "Incorrect credit updates",
            "A request completion may leave credits inconsistent if request status, debit, credit, and transaction logging are not performed together.",
            "High",
            "Prisma transaction logic is used so all related updates succeed or fail together.",
        ],
        [
            "Unauthorized access",
            "Protected pages or APIs could be used by unauthenticated users if session checks are missing.",
            "High",
            "NextAuth session validation and guarded dashboard/API flows are enforced.",
        ],
        [
            "Weak user adoption",
            "New users may not engage if there is no immediate exchange value or if onboarding feels empty.",
            "Medium",
            "Starter credits and AI-assisted suggestions improve initial participation.",
        ],
        [
            "Poor match relevance",
            "Users may fail to discover useful peers if discovery depends only on manual browsing.",
            "Medium",
            "Complementary HAVE/NEED matching and mutual swap prompts are used.",
        ],
        [
            "AI service unavailability",
            "Recommendation and assistant features may degrade if the external AI service is unavailable.",
            "Medium",
            "Core marketplace, request, and credit workflows remain usable without AI.",
        ],
    ],
    colWidths=[1.45 * inch, 2.7 * inch, 0.7 * inch, 1.45 * inch],
)
risk.setStyle(
    TableStyle(
        [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.9),
            ("LEADING", (0, 0), (-1, -1), 10.5),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(KeepTogether([risk]))
story.append(Spacer(1, 0.08 * inch))
para("Table 4.1: Risk Identification of the Project", "CaptionC")
story.append(PageBreak())

# Chapter 5
para("5. SOFTWARE REQUIREMENT SPECIFICATIONS", "H1C")
sections_5 = [
    ("5.1 Purpose", "The purpose of this document is to define the functional and non-functional requirements for the development of SkillSwap, a peer-to-peer student platform that enables reciprocal learning without monetary payment."),
    ("5.2 Project Scope", "This project focuses on designing and implementing a web-based system that supports student registration, skill publication, skill discovery, automated complementary matching, request-based exchange workflows, AI-assisted recommendations, and reliable time-credit management."),
    ("5.3 Overall Description", "SkillSwap functions as a centralized full-stack web application that connects a modern React-based user interface to application logic and a relational database backend. It is intended for use within academic communities where students can teach one another and learn from peers."),
    ("5.3.1 Product Perspective", "The system acts as a dedicated exchange layer for skills. It does not attempt to replace formal classroom teaching; rather, it supplements it by unlocking peer capability. The application integrates authentication, data storage, discovery, and exchange management in one platform."),
    ("5.3.2 Product Features", ""),
    ("5.3.3 Operating Environment", "The application is built using Next.js 14 App Router, React, Tailwind CSS, Prisma ORM, PostgreSQL, and NextAuth. AI-backed services are integrated using the Anthropic SDK. The system runs in a Node.js development and deployment environment."),
    ("5.4 External Interface Requirements", ""),
    ("5.4.1 User Interfaces", "The system provides a public marketplace page, login and registration pages, a protected dashboard, a profile page, a skill-posting page, modals for skill management and requests, and a floating AI assistant panel."),
    ("5.4.2 Hardware Interfaces", "No specialized hardware interface is required. The platform runs on common desktop and mobile devices with browser access."),
    ("5.4.3 Software Interfaces", "Software interfaces include PostgreSQL, Prisma client, NextAuth, and the Anthropic AI API."),
    ("5.4.4 Communication Interfaces", "Communication occurs over standard HTTP request-response flows between frontend components and backend route handlers."),
    ("5.5 System Features", ""),
    ("5.5.1 Functional Requirements", ""),
    ("5.5.2 Nonfunctional Requirements", ""),
    ("5.5.3 Use case description", "A user creates an account, logs in, adds HAVE and NEED skills, explores other users, receives recommendations and smart matches, sends a swap request, and finally completes a session that updates credits in the system."),
    ("5.5.4 Use case diagram", "The main actors are Student User and AI Assistant Service. Core actions include register, login, manage skills, view matches, send request, accept/reject request, complete session, and ask AI for suggestions."),
]
for head, body in sections_5:
    para(head, "H2C")
    if body:
        para(body)
    if head == "5.3.2 Product Features":
        bullets(
            [
                "Secure registration and login.",
                "Public skill marketplace with search and category filtering.",
                "HAVE and NEED skill classification.",
                "Dashboard with time-credit balance and session count.",
                "Recent request tracking and status handling.",
                "Smart matching and mutual swap initiation.",
                "AI chat and AI-generated skill recommendations.",
            ]
        )
        workflow = Table(
            [
                ["Step", "Workflow"],
                ["1", "User registers and receives starter credits."],
                ["2", "User adds HAVE and NEED skills."],
                ["3", "Marketplace and dashboard surface matching opportunities."],
                ["4", "User sends or accepts a swap request."],
                ["5", "Completed session triggers atomic credit transfer and transaction logging."],
            ],
            colWidths=[0.55 * inch, 5.65 * inch],
        )
        workflow.setStyle(box_style)
        story.append(workflow)
        story.append(Spacer(1, 0.08 * inch))
        para("Fig 5.1: Workflow of the Project", "CaptionC")
    if head == "5.4 External Interface Requirements":
        para("The system interacts with end users through a browser-based interface and with external services through backend APIs.")
    if head == "5.5 System Features":
        para("System features are divided into functional and non-functional requirements to reflect both capability and quality expectations.")
    if head == "5.5.1 Functional Requirements":
        bullets(
            [
                "The system shall allow users to register with name, email, and password.",
                "The system shall authenticate users securely before granting dashboard access.",
                "The system shall allow users to add, view, and remove skills.",
                "The system shall support browsing and filtering skills in the marketplace.",
                "The system shall identify complementary skill matches.",
                "The system shall allow users to send, accept, reject, and complete swap requests.",
                "The system shall transfer time credits when a session is completed.",
                "The system shall record completed barter transactions.",
                "The system shall provide AI-based recommendations and chat assistance.",
            ]
        )
    if head == "5.5.2 Nonfunctional Requirements":
        bullets(
            [
                "Usability: the interface should remain simple and visually clear for student users.",
                "Reliability: credit transfer operations should be transactionally safe.",
                "Security: passwords must be hashed and protected routes must require authentication.",
                "Maintainability: the project should follow modular code organization.",
                "Extensibility: the system should support future additions such as scheduling and messaging.",
            ]
        )
story.append(PageBreak())

# Chapter 6
para("6. DESIGN", "H1C")
para("6.1 Introduction", "H2C")
for text in [
    "The design of SkillSwap aims to provide a simple but extensible learning exchange platform. The architecture separates user presentation, backend business logic, and data persistence so that features such as matching, request handling, and AI integration remain manageable.",
    "The system emphasizes modularity. Each major capability is represented either as a page, a component, or an API route. This allows individual modules to evolve without requiring a redesign of the entire application.",
]:
    para(text)
para("6.2 Architecture Design", "H2C")
for text in [
    "The architecture may be viewed in three layers. The first layer is the presentation layer built using Next.js and React components. The second is the application layer, composed of API routes for authentication, skills, requests, and AI functions. The third is the data layer, which uses Prisma to communicate with PostgreSQL and maintain the persistent records of users, skills, requests, and transactions.",
    "This layered approach makes it possible to keep data access rules centralized while still allowing the UI to remain responsive and component-driven. It also simplifies future expansion, such as adding notifications or more advanced recommendation logic.",
]:
    para(text)
architecture = Table(
    [
        ["Layer", "Description"],
        ["Presentation Layer", "Next.js pages and React components for marketplace, dashboard, profile, and modal interactions."],
        ["Application Layer", "Route handlers for auth, skills, requests, mutual swaps, AI chat, and AI suggestions."],
        ["Data Layer", "Prisma ORM with PostgreSQL storing users, skills, swap requests, and credit transactions."],
    ],
    colWidths=[1.55 * inch, 4.65 * inch],
)
architecture.setStyle(box_style)
story.append(architecture)
story.append(Spacer(1, 0.08 * inch))
para("Fig 6.1: System Architecture", "CaptionC")
para("6.3 User Interface Design", "H2C")
for head, body in [
    ("6.3.1 Home Page", "The home page displays the public marketplace of available skills. Skills are loaded from the database and rendered in card form with search and category filtering options. This page acts as the discovery layer of the system."),
    ("6.3.2 Dashboard", "The dashboard is the core personalized space for the authenticated user. It displays time credits, total sessions, recent swap requests, AI recommendations, smart matches, and the user’s own skills."),
    ("6.3.3 Skill Management Interface", "A modal-driven skill management interface allows users to add HAVE and NEED skills quickly, view their current skill lists, and remove outdated entries. AI recommendation chips also assist users in expanding their profiles."),
    ("6.3.4 Request Details Interface", "Users can open request detail dialogs to inspect messages, view status, accept or reject a request, and mark it completed when the exchange is finished."),
    ("6.3.5 AI Assistant Interface", "A floating conversational assistant is accessible from the dashboard and allows users to ask contextual questions about their profile, credits, or general platform usage."),
    ("6.3.6 Filters and Navigation", "The marketplace supports search terms, type-based filtering, and category selection to reduce friction in finding useful skills and collaborators."),
]:
    para(head, "H2C")
    para(body)
para("6.4 Low Level Design", "H2C")
for text in [
    "The low-level design is driven by four key domain models: User, Skill, SwapRequest, and CreditTransaction. A User may own multiple skills and participate in requests as either requester or receiver. Each request captures a workflow state and a credit value. Completed exchanges create transaction records so that the system maintains an audit trail of barter movement.",
    "On the server side, route handlers are responsible for validating sessions, reading request payloads, querying Prisma, and returning JSON responses. On the client side, components fetch data, display status, and trigger mutations using these routes. This creates a clean separation between data operations and presentation logic.",
]:
    para(text)
use_flow = Table(
    [
        ["Stage", "Interaction Flow"],
        ["Login", "User authenticates through credentials provider."],
        ["Profile Setup", "User adds HAVE and NEED skills from the dashboard."],
        ["Discovery", "Marketplace search and smart matches identify useful peers."],
        ["Swap", "Request is created, accepted or rejected, and later completed."],
        ["Settlement", "Credits are transferred atomically and a transaction is logged."],
    ],
    colWidths=[1.2 * inch, 5.0 * inch],
)
use_flow.setStyle(box_style)
story.append(use_flow)
story.append(Spacer(1, 0.08 * inch))
para("Fig 6.2: Use Case / Interaction Flow", "CaptionC")
para("6.5 Conclusion", "H2C")
para("The design supports clarity, modular growth, and reliable data flow. It also aligns well with the project’s academic goal of demonstrating how a real-world collaborative platform can be built using current full-stack technologies.")
story.append(PageBreak())

# Chapter 7
para("7. IMPLEMENTATION", "H1C")
sections_7 = [
    ("7.1 Tools Introduction", ""),
    ("7.2 Technology Introduction", "This project applies a modern full-stack web architecture. Server-rendered pages and API routes are provided by Next.js. Prisma enables typed relational queries and transaction support. NextAuth handles login sessions through a credentials provider, and bcrypt is used for password hashing. Tailwind CSS and reusable React components provide the user-facing experience."),
    ("7.3 Overall view of Project Implementation", "The implementation begins with user onboarding through registration and login. Once authenticated, the user can create skills, browse the marketplace, receive personalized dashboard data, discover matches, and interact with the AI assistant. Requests between users move through PENDING, ACCEPTED, REJECTED, and COMPLETED states. Completion triggers credit transfer and transaction recording."),
    ("7.4 Explanation of Modules and Implementation", ""),
    ("7.5 Implementation of Modules", ""),
    ("7.6 Conclusion", "The implementation successfully transforms the barter-learning idea into a functional application with secure authentication, persistent data management, intelligent matching, and AI augmentation."),
]
for head, body in sections_7:
    para(head, "H2C")
    if body:
        para(body)
    if head == "7.1 Tools Introduction":
        bullets(
            [
                "Next.js 14 App Router",
                "React 18",
                "Tailwind CSS",
                "Prisma ORM",
                "PostgreSQL",
                "NextAuth.js",
                "Anthropic SDK",
                "Framer Motion",
                "TypeScript",
            ]
        )
    if head == "7.4 Explanation of Modules and Implementation":
        for subh, txt in [
            ("7.4.1 Authentication Module", "The credentials provider checks user email and password against the database. The authenticated user identifier is stored in the JWT/session callbacks, enabling protected access to user-specific routes and pages."),
            ("7.4.2 Registration Module", "The registration route validates required fields, checks for existing users, hashes the password using bcrypt, and creates the user with starter credits. This starter-credit setup directly reflects the barter onboarding strategy described in the project presentation."),
            ("7.4.3 Skills Module", "The skills API supports skill creation, retrieval, filtering, and deletion. Each skill stores a name, type, category, and owning user relation. HAVE and NEED labels are central to all matching logic."),
            ("7.4.4 Smart Matching Module", "The dashboard derives the current user’s HAVE and NEED skill sets, then queries other user skills to find complementary relationships. The SmartMatches component also checks whether the relationship is mutually beneficial and supports mutual swap initiation."),
            ("7.4.5 Request and Credit Module", "Swap requests are created through API routes and displayed in the dashboard. The request details modal enables acceptance, rejection, and completion actions. When a request is marked completed, Prisma transaction logic updates the request status, decrements the learner’s credits, increments the teacher’s credits, and stores the credit transaction record."),
            ("7.4.6 AI Assistance Module", "The AI chat route sends the user’s current credits and skills to the Claude API so that responses remain contextual. Another route generates structured recommendation data that is displayed through the recommendation cards and skill-management suggestion chips."),
        ]:
            para(subh, "H2C")
            para(txt)
    if head == "7.5 Implementation of Modules":
        for text in [
            "The public home page queries skills from the database together with basic owner information and passes them to the marketplace client. The dashboard page uses server-side loading to assemble user details, requests, and matching opportunities before rendering the personalized interface.",
            "Client-side components are used where local interactivity is important, such as the AI assistant, AI suggestions, smart matches, and skill management modal. This combination of server-side and client-side responsibilities keeps initial data loading efficient while preserving interactive behavior.",
            "Animated transitions, hover states, and responsive card layouts are incorporated to improve usability and perceived polish. Although the project is primarily evaluated as a functional academic system, visual clarity remains important because it affects onboarding and adoption.",
        ]:
            para(text)
story.append(PageBreak())

# Chapter 8
para("8. TESTING", "H1C")
para("8.1 Introduction", "H2C")
para("Testing was carried out to ensure that the implemented system behaves correctly across important user workflows. Particular attention was given to request status transitions, authentication checks, database consistency, and AI integration behavior.")
para("8.2 Testing Tools and Environment", "H2C")
para("Testing was performed in the same Next.js and Prisma-based environment used during development. Browser-based verification was used for UI workflows, while backend behavior was validated through route interactions and observed database state changes. The PostgreSQL-backed Prisma schema and the application server together formed the primary evaluation environment.")
para("8.3 Test Cases", "H2C")
case_table = Table(
    [
        ["S.No.", "Module", "Description", "Expected Outcome"],
        ["01", "Registration", "Create a new user with required details.", "User account is created and starter credits are assigned."],
        ["02", "Login", "Authenticate an existing user.", "Valid user is redirected to the dashboard."],
        ["03", "Skill Management", "Add HAVE and NEED skills.", "Skills appear in the sidebar and contribute to matching."],
        ["04", "Marketplace", "Search and filter visible skills.", "Displayed cards match the selected criteria."],
        ["05", "Swap Requests", "Create and inspect a request.", "Request is stored with PENDING status."],
        ["06", "Request Action", "Accept or reject a request as receiver.", "Status changes correctly according to selected action."],
        ["07", "Completion Logic", "Mark a request completed.", "Credits transfer atomically and transaction record is created."],
        ["08", "AI Suggestions", "Load recommendation cards.", "Contextual suggestions are returned and displayed."],
    ],
    colWidths=[0.55 * inch, 1.05 * inch, 2.45 * inch, 2.35 * inch],
)
case_table.setStyle(
    TableStyle(
        [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.8),
            ("LEADING", (0, 0), (-1, -1), 10),
        ]
    )
)
story.append(case_table)
story.append(Spacer(1, 0.08 * inch))
para("Table 8.1 Test Cases adopted for system evaluation", "CaptionC")
para("8.4 Testing Outcome", "H2C")
for text in [
    "The platform supported the core exchange workflow as intended. Registration, login, skill management, matching, request handling, and AI suggestion flows were all observed to function in sequence. Most importantly, the completion flow maintained consistency by grouping all critical state changes inside a single database transaction.",
    "This improves trust in the barter model because users can be confident that time credits are not lost or duplicated due to partially executed actions.",
]:
    para(text)
story.append(PageBreak())

# Chapter 9
para("9. RESULTS & PERFORMANCE ANALYSIS", "H1C")
para("9.1 Result Snapshots", "H2C")
para("The following result snapshots are taken from the project presentation and illustrate the completed state of the application, its interface, and the fulfillment of the stated objectives.")
fig(assets / "image5.png", "Fig 9.1: Development and suggestion incorporation snapshot")
para("The above figure captures the development progress and shows how project feedback was incorporated into the implemented system. It reflects the iterative nature of the project and the gradual movement from concept to functional application.")
fig(assets / "image6.png", "Fig 9.2: Database design snapshot")
para("The database design view corresponds to the relational foundation of the project. The implemented schema in the codebase includes the User, Skill, SwapRequest, and CreditTransaction entities, which collectively support authentication, skill ownership, barter requests, and audit-safe credit transfers.")
fig(assets / "image7.png", "Fig 9.3: Dashboard / command interface snapshot")
para("The dashboard view demonstrates that personalized platform data is surfaced effectively. Users can see their current time-credit balance, session count, recent requests, skill inventory, and AI-supported recommendations. This confirms that the frontend is correctly integrated with backend data loading.")
fig(assets / "image8.png", "Fig 9.4: Result snapshot of first objective")
para("This result supports the first major objective of establishing a fair time-credit economy. The user dashboard visibly reflects credit values and profile-based skill information, confirming that the barter model is not merely conceptual but actually implemented in the product interface.")
fig(assets / "image9.png", "Fig 9.5: Result snapshot of second objective")
para("This snapshot demonstrates the smart match feature. The system is able to identify another user whose offered skill corresponds to the current user’s NEED entry. This validates the effectiveness of the complementary HAVE/NEED matching strategy.")
para("9.2 Result Comparison", "H2C")
for text in [
    "The project objectives were centered on fairness, automation, transactional reliability, and AI assistance. When comparing the proposed system against common alternatives such as informal peer learning groups or generic marketplace listings, SkillSwap provides stronger structure. It combines visible credits, explicit skill categories, request-based coordination, and automated matching in a single platform.",
    "Compared with manual search alone, the smart matching flow shortens the discovery path. Compared with simple skill-posting boards, the request lifecycle and transactional completion logic provide greater accountability. Compared with AI-only suggestion systems, the platform grounds recommendations inside an actual exchange workflow.",
]:
    para(text)
para("9.3 Performance Analysis", "H2C")
for text in [
    "The strongest performance outcome of the project is correctness in workflow integration. The system successfully links user registration, authentication, skill management, dashboard loading, request creation, request status changes, and credit transfer into one coherent application. This integration quality is especially important in barter-based platforms because errors in credit accounting directly affect trust.",
    "From a usability perspective, the interface also performs well as an academic prototype. The marketplace makes skill discovery easier through search and filters, while the dashboard groups the most relevant user information together. AI recommendations and chat support reduce the cognitive load on new users and can improve profile completeness and participation over time.",
    "Overall, the results show that SkillSwap is a feasible and technically sound implementation of a peer-to-peer skill barter model for student communities. The current project scope validates the core system design and leaves clear room for future scale and refinement.",
]:
    para(text)
story.append(PageBreak())

# Chapter 10
para("10. CONCLUSION & SCOPE FOR FUTURE WORK", "H1C")
para("10.1 Findings and suggestions", "H2C")
for text in [
    "The project demonstrates that a reciprocal knowledge-sharing platform can be implemented in a practical and user-friendly way using a modern web technology stack. The main findings are that students can be represented as both providers and consumers of knowledge, barter interactions can be tracked through time credits, and smart matching reduces the effort needed to discover relevant peers.",
    "The project also suggests that relational matching and AI assistance work well together. Structured data provides the foundation for reliable exchange, while AI makes the system easier to use and more helpful during onboarding and skill discovery.",
]:
    para(text)
para("10.2 Significance of the Proposed Research Work", "H2C")
para("This project is significant because it applies full-stack software engineering to a meaningful educational problem. Instead of treating learning purely as a paid service, it reframes knowledge as a shared community resource. In a student environment, such a system can strengthen collaboration, reduce barriers to learning, and encourage contribution-oriented participation.")
para("10.3 Limitation of this Research Work", "H2C")
for text in [
    "The current matching model is rule-based and does not yet rank results by deeper relevance, availability, or exchange history. The platform also does not currently include built-in scheduling, real-time messaging, or video-based learning sessions.",
    "In addition, AI features depend on the availability of an external API service. While the core platform remains usable without AI, the enhanced assistant and recommendation features are limited by that dependency.",
]:
    para(text)
para("10.4 Directions for the Future works", "H2C")
for text in [
    "Future work can introduce ranking-based recommendations, calendars, reminders, live communication, and stronger reputation or rating systems. The project may also be extended to support department-wise communities, institution-level reporting, or event-based group exchanges.",
    "Another promising direction is the introduction of analytics and behavior-aware recommendations that use past swaps, skill popularity, and completion patterns to improve discovery quality. These additions can take SkillSwap from an academic prototype toward a deployable campus platform.",
]:
    para(text)
story.append(PageBreak())

# References
para("11. REFERENCES", "H1C")
for ref in [
    "[1] Kumar, A., et al. (2021). Skill Share: A Knowledge Sharing Platform for Peer Communities. International Journal of Advanced Scientific Research and Engineering Trends.",
    "[2] Gupta, R., & Sharma, P. (2022). A Peer-to-Peer Skills and Knowledge Exchange Platform for Academic Communities.",
    "[3] Wang, J., & Lee, C. (2023). Knowledge Exchange Mechanisms in Online Communities: A Systematic Review.",
    "[4] Chen, L., & Zhao, Y. (2021). Ontology-based Skill Matching Algorithms for Human Resource Systems.",
    "[5] Patel, K., & Joshi, H. (2022). A Decentralized Peer Learning Model Using Smart Contracts and Blockchain.",
    "[6] Martinez, J., & Kim, S. (2023). Enhancing Peer-to-Peer Learning through AI-Powered Recommendation Systems.",
    "[7] Singh, A., & Verma, R. (2022). Gamification and User Engagement in Skill-Sharing Platforms.",
    "[8] Kas, J. (2021). Trust and Reputation in the Peer-to-Peer Platform Economy.",
    "[9] Reddy, V., & Nair, S. (2020). Skill Swap: A Web-Powered Platform for Knowledge Exchange Among Students.",
    "[10] Tan, Z., & Chua, K. (2022). Deep Learning for Personalized Learning Paths in Educational Platforms.",
    "[11] Botsman, R., & Rogers, R. (2021). Collaborative Consumption and the Resource-Saving Economy.",
    "[12] Huang, C., & Zhao, Y. (2021). AI-Driven Skill Matching in Online Learning Platforms.",
    "[13] Deterding, S., et al. (2021). Gamification in Collaborative Learning: Synthesizing the Evidence.",
    "[14] Anderson, J. (2021). Smart Matching: Intelligent Tutoring Systems and Personalized Learning.",
]:
    para(ref)
story.append(PageBreak())

# Appendix
para("12. APPENDIX", "H1C")
para("a. Project summary draft", "H2C")
for text in [
    "<b>Abstract -</b> SkillSwap presents a student-centric knowledge exchange model in which teaching and learning are coordinated through time credits instead of money. The system combines full-stack web development, relational data management, matching logic, and AI support to create a structured barter learning platform.",
    "<b>Keywords -</b> Peer-to-peer learning, barter platform, time credits, Prisma, Next.js, skill matching, AI assistant.",
    "<b>Summary -</b> The project contributes a practical software implementation of reciprocal learning for student communities. By combining user accounts, structured skills, transaction-safe exchange workflows, and AI assistance, it demonstrates how community learning can be organized beyond informal chat groups or paid tutoring models.",
]:
    para(text)


def add_page_number(canvas, doc):
    canvas.setFont("Times-Roman", 10)
    canvas.drawCentredString(A4[0] / 2.0, 0.45 * inch, str(doc.page))


def add_first_page(canvas, doc):
    # Cover page in the sample does not show the page number.
    pass


doc = SimpleDocTemplate(
    str(pdf_path),
    pagesize=A4,
    rightMargin=2.2 * cm,
    leftMargin=2.4 * cm,
    topMargin=2.0 * cm,
    bottomMargin=1.5 * cm,
)
doc.build(story, onFirstPage=add_first_page, onLaterPages=add_page_number)
print(f"REGENERATED: {pdf_path}")
