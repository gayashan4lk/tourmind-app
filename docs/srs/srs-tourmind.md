# Software Requirements Specification
## for 
# TourMind – A Web-Based One-Day Visit Planning System

**Version 1.0**

| Field | Detail |
|---|---|
| Prepared by | W.E Gayashan |
| Date | 04 March 2026 |

---

## Revision History

| Name | Date | Reason for Changes | Version |
|---|---|---|---|
| W.E Gayashan | 04 March 2026 | Initial version | 1.0 |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience and Reading Suggestions
   - 1.4 Product Scope
   - 1.5 References
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 User Documentation
   - 2.7 Assumptions and Dependencies
3. [External Interface Requirements](#3-external-interface-requirements)
   - 3.1 User Interfaces
   - 3.2 Hardware Interfaces
   - 3.3 Software Interfaces
   - 3.4 Communications Interfaces
4. [System Features](#4-system-features)
   - 4.1 Place Listing and Browsing
   - 4.2 Category Filtering
   - 4.3 Place Detail View
   - 4.4 Interactive Map View
   - 4.5 One-Day Visit Plan Builder
   - 4.6 Host Authentication
   - 4.7 Host Place Management
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   - 5.1 Performance Requirements
   - 5.2 Safety Requirements
   - 5.3 Security Requirements
   - 5.4 Software Quality Attributes
   - 5.5 Business Rules
6. [Other Requirements](#6-other-requirements)

[Appendix A: Glossary](#appendix-a-glossary)

[Appendix B: Analysis Models](#appendix-b-analysis-models)

[Appendix C: To Be Determined List](#appendix-c-to-be-determined-list)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) describes the functional and non-functional requirements for TourMind, a web-based one-day visit planning system for the Matara area of Sri Lanka. This document covers the complete system at version 1.0, encompassing both the tourist-facing interface and the host management interface.

The purpose of this SRS is to provide a clear, complete, and agreed-upon description of the system's behaviour to guide design, development, and testing.

### 1.2 Document Conventions

This document follows the IEEE Std 830-1998 SRS template structure. The following conventions apply throughout:

- **Shall** indicates a mandatory requirement.
- **Should** indicates a desirable but non-mandatory requirement.
- **May** indicates an optional requirement.
- Functional requirements are identified with unique identifiers in the format `REQ-[FEATURE]-[NUMBER]` (e.g., REQ-PLB-01).
- Priority levels are defined as **High**, **Medium**, or **Low**. High-priority requirements are essential for the system to fulfil its core purpose. Medium-priority requirements significantly improve usability. Low-priority requirements are desirable enhancements.

### 1.3 Intended Audience and Reading Suggestions

This document is intended for the following audiences:

- **Developers** should read all sections, with particular attention to Sections 3 and 4 for interface and functional requirements, and Section 5 for non-functional constraints.
- **Project managers** should focus on Sections 1, 2, and 5 for scope, user context, and quality expectations.
- **Testers** should concentrate on Section 4 (functional requirements) to derive test cases, and Section 5 for performance and security benchmarks.
- **Stakeholders and end users** should read Sections 1 and 2 for an overview of the system, and Section 4 for a description of features.

It is recommended that all readers begin with Sections 1 and 2 before proceeding to the sections most relevant to their role.

### 1.4 Product Scope

TourMind is a web-based information and planning system designed to help tourists plan a personalised one-day visit to places of interest within a 25 km radius of a homestay located in Matara town centre, Sri Lanka. The system consolidates host-curated information — including descriptions, opening hours, entry fees, travel tips, and map locations — into a single accessible platform, eliminating the need for tourists to consult multiple unreliable external sources.

The system serves two user groups: tourists who browse and plan visits, and the homestay host who manages the content. TourMind does not support booking, payment, transport reservations, or real-time data updates. Its primary goal is to improve the quality and efficiency of one-day tourism planning in an underserved local area.

### 1.5 References

| # | Document | Source |
|---|---|---|
| 1 | TourMind Project Proposal v2 | `docs/project-proposal/project-proposal-working-v2.md` |
| 2 | Places of Interest List | `docs/project-proposal/locations-list.md` |
| 3 | Stakeholder Questionnaire Responses | `docs/stakeholder-requirements/questionnaire-feedbacks.md` |
| 4 | IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications | IEEE |
| 5 | Next.js Documentation | https://nextjs.org/docs |
| 6 | FastAPI Documentation | https://fastapi.tiangolo.com |
| 7 | PostgreSQL Documentation | https://www.postgresql.org/docs |

---

## 2. Overall Description

### 2.1 Product Perspective

TourMind is a new, self-contained web application. It is not part of an existing product family or a replacement for an existing system. There is currently no dedicated local tourism information platform for the Matara area; tourists rely on general-purpose platforms such as Google Maps, TripAdvisor, and travel blogs, none of which provide localised, host-curated, consolidated visit planning for this region.

TourMind operates as a client-server web application. The frontend (Next.js) communicates with the backend REST API (FastAPI) over HTTPS, and the backend persists all place and user data in a PostgreSQL database. The system has no integration with external booking or payment services.

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────┐
│   Tourist Browser   │◄──────►│   Next.js Frontend   │◄──────►│  FastAPI    │
│   Host Browser      │  HTTPS  │   (React / SSR)      │  REST  │  Backend    │◄──► PostgreSQL
└─────────────────────┘         └──────────────────────┘         └─────────────┘
```

### 2.2 Product Functions

The system shall provide the following high-level functions:

**Tourist Interface:**
- Browse a list of places of interest with summary information
- Filter places by category (Historical & Religious, Beach & Nature, Restaurants & Local Food)
- View detailed information for each place (description, opening hours, entry fees, travel tips, distance, dress code)
- View all places on an interactive map relative to the homestay
- Build a one-day visit plan by selecting and ordering multiple places

**Host Interface:**
- Authenticate via a secure login
- Add new places of interest via a structured form
- Edit existing place information
- Delete places that are no longer relevant

### 2.3 User Classes and Characteristics

**Tourists (Primary Users)**

Tourists are the primary intended audience of the system. This class includes both local Sri Lankan visitors and international travellers staying in or passing through the Matara area. Based on stakeholder research, tourists typically:

- Access the system primarily on mobile devices while travelling, and on desktop when planning in advance.
- Prefer brief summaries with an option to read more detailed descriptions.
- Require practical information such as opening hours, entry fees, dress codes, and parking before visiting.
- Rely on interactive maps for navigation and route planning.
- Plan their day by grouping nearby places and considering opening times and travel time.
- Have limited or no prior knowledge of the local area.

Tourists are not expected to have technical expertise and require a simple, intuitive interface.

**Host (Secondary User)**

The host is the homestay owner responsible for managing the content of the system. There is a single host user. The host acts as the local expert and curator. The host:

- Is not expected to have technical expertise beyond basic computer use.
- Requires a simple management interface for adding, editing, and deleting place information.
- Accesses the system from a desktop browser.
- Uses the system infrequently, primarily to keep information current.

### 2.4 Operating Environment

- **Client devices:** Modern desktop and mobile web browsers (Chrome, Safari, Firefox, Edge — latest two major versions). The tourist interface must be fully functional and usable on mobile screen sizes (minimum 360px viewport width).
- **Server:** Linux-based server environment capable of running Node.js (for Next.js) and Python 3.10+ (for FastAPI).
- **Database:** PostgreSQL 14 or later.
- **Network:** Standard HTTPS web access. The system shall function on typical mobile data connections encountered by tourists in Sri Lanka (3G/4G).
- **Map integration:** Internet connection required for map tile loading (e.g., Google Maps or OpenStreetMap-based provider).

### 2.5 Design and Implementation Constraints

- The frontend shall be implemented using **Next.js** (React-based framework).
- The backend shall be implemented using **FastAPI** (Python).
- The database shall be **PostgreSQL**.
- Development shall use **Visual Studio Code** and **Git** for version control.
- The system shall not include any booking, reservation, or payment functionality.
- The system shall not integrate with third-party accommodation or transport services.
- Real-time data (live crowd information, dynamic pricing) is not within scope.
- The host management interface shall be protected by password authentication; no multi-user or role-based access control beyond a single host account is required.

### 2.6 User Documentation

The following documentation shall be delivered with the system:

- **Host User Guide** – A concise guide (delivered as a markdown or PDF document) explaining how the host can log in, add places, edit existing entries, and delete places.
- **Inline interface guidance** – The system shall include placeholder text and field labels sufficient for a non-technical host to complete the place management form without external assistance.

No formal tourist user manual is required, as the tourist interface is designed to be self-explanatory.

### 2.7 Assumptions and Dependencies

**Assumptions:**

- The host will be responsible for the accuracy and timeliness of all place information entered into the system.
- Tourists are assumed to have access to an internet-connected device during use.
- A map API provider (e.g., Google Maps JavaScript API or Leaflet with OpenStreetMap) will be available and accessible.
- The deployed server environment will support Python 3.10+ and Node.js 18+.

**Dependencies:**

- The interactive map feature depends on an external map tile provider. If the provider becomes unavailable, map display will be affected.
- The system depends on the PostgreSQL database service being running and accessible from the FastAPI backend.
- Accurate coordinate data for all 12 places of interest must be collected and seeded into the database during setup.

---

## 3. External Interface Requirements

### 3.1 User Interfaces

**Tourist Interface:**

- The tourist interface shall be responsive and function correctly on mobile viewports from 360px width and desktop viewports up to 1920px width.
- The interface shall present a clean, uncluttered layout consistent with a travel-planning context.
- A persistent navigation bar shall be present on all tourist-facing pages, providing access to the place listing, map view, and visit plan builder.
- Place cards in the listing view shall display: place name, category tag, a brief summary (maximum 2–3 sentences), and distance from the homestay.
- A "View Details" action on each place card shall expand or navigate to a full detail view.
- The map view shall display interactive pins for each place of interest, with a click/tap action revealing the place name and a link to its detail page.
- The visit plan builder shall allow tourists to add and remove places from their plan and reorder them.
- Error states (e.g., failed data load) shall display a user-friendly message rather than a technical error.

**Host Interface:**

- The host interface shall be accessible via a distinct URL path (e.g., `/host`).
- The login screen shall include fields for username/email and password, and a login button.
- The management dashboard shall list all current places with options to edit or delete each entry.
- The add/edit form shall include clearly labelled fields for all place attributes (name, category, description, opening hours, entry fee, distance, travel tips, dress code, coordinates).
- Confirmation dialogs shall be presented before any delete operation is executed.

### 3.2 Hardware Interfaces

TourMind is a web-based application and does not interface directly with hardware peripherals. The system shall be accessible on any device with a standards-compliant web browser and internet connectivity. No specific hardware is required beyond what is standard for web browsing.

### 3.3 Software Interfaces

| Interface | Component | Purpose |
|---|---|---|
| Next.js Frontend | FastAPI Backend | REST API calls over HTTPS for all data retrieval and host management operations |
| FastAPI Backend | PostgreSQL | SQLAlchemy ORM for database read/write operations |
| Next.js Frontend | Map Provider API | Rendering interactive map tiles and place pins |
| FastAPI Backend | Authentication library (e.g., python-jose, passlib) | Host password hashing and JWT token generation |

The REST API shall expose JSON-formatted endpoints. All data exchanged between the frontend and backend shall use the `application/json` content type.

### 3.4 Communications Interfaces

- The system shall be accessed exclusively over **HTTPS** (TLS 1.2 or higher) in production.
- The REST API shall follow standard HTTP methods: `GET` for data retrieval, `POST` for creation, `PUT` or `PATCH` for updates, and `DELETE` for removal.
- The host authentication flow shall use **JWT (JSON Web Token)** bearer tokens, transmitted in HTTP `Authorization` headers.
- No email, SMS, or other external communication services are required.

---

## 4. System Features

### 4.1 Place Listing and Browsing

#### 4.1.1 Description and Priority

**Priority: High**

This feature provides tourists with a browsable list of all places of interest managed by the host. It is the primary entry point of the tourist interface and is essential to the core purpose of the system.

#### 4.1.2 Stimulus/Response Sequences

1. Tourist navigates to the TourMind homepage or places listing page.
2. System retrieves and displays all active places of interest from the database.
3. Each place is presented as a card showing the place name, category tag, brief summary, and distance from the homestay.
4. Tourist scrolls through the list to explore available places.

#### 4.1.3 Functional Requirements

- **REQ-PLB-01:** The system shall retrieve and display all places of interest stored in the database on the listing page.
- **REQ-PLB-02:** Each place listing entry shall display the place name, category, a short description (no more than 3 sentences), and the distance from the homestay in kilometres.
- **REQ-PLB-03:** The listing shall load within an acceptable time on a standard mobile data connection (see Section 5.1).
- **REQ-PLB-04:** If no places are available in the database, the system shall display an appropriate empty-state message.
- **REQ-PLB-05:** The listing page shall be fully functional and readable on mobile devices with a minimum viewport width of 360px.

---

### 4.2 Category Filtering

#### 4.2.1 Description and Priority

**Priority: High**

This feature allows tourists to filter the place listing by category, enabling them to quickly identify places that match their interests. Stakeholder research confirmed that all three respondents rely on attraction type when planning their visit.

#### 4.2.2 Stimulus/Response Sequences

1. Tourist views the place listing page.
2. Tourist selects one of the available category filters (Historical & Religious, Beach & Nature, Restaurants & Local Food, or All).
3. System immediately updates the listing to display only places matching the selected category.
4. Tourist selects "All" to restore the full listing.

#### 4.2.3 Functional Requirements

- **REQ-FLT-01:** The system shall provide filter controls for the following categories: All, Historical & Religious, Beach & Nature, Restaurants & Local Food.
- **REQ-FLT-02:** Applying a filter shall update the displayed listing without requiring a full page reload.
- **REQ-FLT-03:** When a filter is active, only places belonging to that category shall be displayed.
- **REQ-FLT-04:** The active filter state shall be visually indicated to the tourist.
- **REQ-FLT-05:** If no places exist for a selected category, an appropriate message shall be displayed.

---

### 4.3 Place Detail View

#### 4.3.1 Description and Priority

**Priority: High**

This feature provides tourists with comprehensive information about a selected place. It directly addresses the primary stakeholder need for practical, reliable details before committing to a visit. All three stakeholder respondents identified opening hours, entry fees, and detailed descriptions as essential.

#### 4.3.2 Stimulus/Response Sequences

1. Tourist clicks or taps "View Details" on a place card in the listing.
2. System displays the full detail page or expanded view for that place.
3. Tourist reads the description, practical details, and travel tips.
4. Tourist may add the place to their one-day plan from this view.
5. Tourist navigates back to the listing.

#### 4.3.3 Functional Requirements

- **REQ-DET-01:** The detail view shall display the full description of the place.
- **REQ-DET-02:** The detail view shall display opening hours, including any seasonal or day-of-week variations where provided.
- **REQ-DET-03:** The detail view shall display the entry fee, or indicate "Free entry" if no fee applies.
- **REQ-DET-04:** The detail view shall display the estimated distance from the homestay in kilometres.
- **REQ-DET-05:** The detail view shall display travel tips relevant to visiting the place (e.g., best time of day, dress code, parking availability, snorkelling equipment hire).
- **REQ-DET-06:** The detail view shall display the category of the place.
- **REQ-DET-07:** The detail view shall include a map pin or embedded static map showing the location of the place.
- **REQ-DET-08:** The detail view shall include an "Add to Plan" button that allows the tourist to add the place to their one-day visit plan.
- **REQ-DET-09:** If a place has already been added to the plan, the button state shall reflect this (e.g., "Added to Plan" or "Remove from Plan").

---

### 4.4 Interactive Map View

#### 4.4.1 Description and Priority

**Priority: High**

This feature displays all places of interest geographically on an interactive map, allowing tourists to visualise proximity and plan their route. All three stakeholder respondents stated they rely on maps when visiting new places and expressed a preference for an interactive map over a simple list with directions.

#### 4.4.2 Stimulus/Response Sequences

1. Tourist navigates to the Map view.
2. System loads an interactive map centred on the homestay location.
3. System renders pins/markers for all active places of interest at their respective coordinates.
4. Tourist taps or clicks a pin.
5. System displays the place name and a link to its detail view as a popup or tooltip.
6. Tourist taps the link to navigate to the detail view.

#### 4.4.3 Functional Requirements

- **REQ-MAP-01:** The system shall display an interactive map showing the geographical location of the homestay and all active places of interest.
- **REQ-MAP-02:** Each place of interest shall be represented by a distinct map marker/pin.
- **REQ-MAP-03:** Clicking or tapping a map marker shall display a popup containing the place name and a link to its detail view.
- **REQ-MAP-04:** The map shall support standard pan and zoom interactions.
- **REQ-MAP-05:** The homestay location shall be visually distinguished from place-of-interest markers on the map.
- **REQ-MAP-06:** The map shall be usable on mobile touch interfaces.
- **REQ-MAP-07:** If the map tiles fail to load, the system shall display a user-friendly error message and the place listing shall remain accessible as a fallback.

---

### 4.5 One-Day Visit Plan Builder

#### 4.5.1 Description and Priority

**Priority: High**

This feature allows tourists to select multiple places of interest and organise them into a simple ordered itinerary for the day. All three stakeholder respondents identified the ability to plan a route or sequence of places as one of their three essential features.

#### 4.5.2 Stimulus/Response Sequences

1. Tourist browses the place listing and adds places to their plan via the "Add to Plan" button.
2. Tourist navigates to the Plan Builder page.
3. System displays the tourist's selected places in their current order.
4. Tourist reorders places by dragging and dropping, or using move-up/move-down controls.
5. Tourist removes a place from the plan using a remove button.
6. Tourist views the finalised plan showing the ordered list of places with key details.
7. Tourist may clear the entire plan or continue modifying it.

#### 4.5.3 Functional Requirements

- **REQ-PLN-01:** The system shall allow a tourist to add any place of interest to their one-day plan from the listing page or the detail view.
- **REQ-PLN-02:** The system shall allow a tourist to view all places currently in their plan on a dedicated Plan page.
- **REQ-PLN-03:** The plan shall display each selected place with its name, category, distance, and opening hours.
- **REQ-PLN-04:** The tourist shall be able to reorder places within their plan.
- **REQ-PLN-05:** The tourist shall be able to remove individual places from their plan.
- **REQ-PLN-06:** The tourist shall be able to clear all places from the plan at once.
- **REQ-PLN-07:** The plan state shall persist within the same browser session (i.e., refreshing the page shall not clear the plan).
- **REQ-PLN-08:** There is no requirement to save the plan to the server or share it; the plan is local to the tourist's session.
- **REQ-PLN-09:** The plan shall be accessible from persistent navigation on all tourist-facing pages.

---

### 4.6 Host Authentication

#### 4.6.1 Description and Priority

**Priority: High**

This feature controls access to the host management interface. It ensures that only the authorised homestay owner can add, edit, or delete place information.

#### 4.6.2 Stimulus/Response Sequences

1. Host navigates to the host login page (`/host/login` or similar).
2. System displays a login form with username/email and password fields.
3. Host enters credentials and submits.
4. System validates credentials against the stored (hashed) credentials.
5. On success: system issues a JWT token and redirects the host to the management dashboard.
6. On failure: system displays an error message; credentials are not revealed.
7. Host logs out via a logout button; the session token is invalidated client-side.

#### 4.6.3 Functional Requirements

- **REQ-AUTH-01:** The host management interface shall be accessible only after successful authentication.
- **REQ-AUTH-02:** The system shall authenticate the host using a username/email and password.
- **REQ-AUTH-03:** Host passwords shall be stored in the database as cryptographic hashes (e.g., bcrypt). Plain-text passwords shall never be stored.
- **REQ-AUTH-04:** On failed login, the system shall display a generic error message that does not reveal whether the username or password was incorrect.
- **REQ-AUTH-05:** The system shall use JWT bearer tokens to maintain the authenticated host session.
- **REQ-AUTH-06:** Protected host routes shall return a 401 Unauthorised response if accessed without a valid token.
- **REQ-AUTH-07:** The host shall be able to log out, which shall clear the session token from the client.

---

### 4.7 Host Place Management

#### 4.7.1 Description and Priority

**Priority: High**

This feature provides the host with a management dashboard to add new places of interest, edit existing entries, and delete places that are no longer relevant. This is essential for keeping the system content accurate and current.

#### 4.7.2 Stimulus/Response Sequences

**Add Place:**
1. Host navigates to the management dashboard.
2. Host selects "Add New Place."
3. System presents a form with all required fields.
4. Host completes and submits the form.
5. System validates input and saves the new place to the database.
6. System confirms success; new place appears in the listing.

**Edit Place:**
1. Host selects "Edit" for an existing place on the dashboard.
2. System presents a pre-populated edit form with current values.
3. Host modifies desired fields and submits.
4. System validates and saves updated data.
5. System confirms success.

**Delete Place:**
1. Host selects "Delete" for an existing place on the dashboard.
2. System presents a confirmation prompt.
3. Host confirms the deletion.
4. System permanently removes the place from the database.
5. System confirms success; place no longer appears in the tourist listing.

#### 4.7.3 Functional Requirements

- **REQ-MGT-01:** The management dashboard shall display all places of interest currently stored in the database, with edit and delete options for each.
- **REQ-MGT-02:** The host shall be able to add a new place of interest by completing a form containing the following fields: name, category, short description, full description, opening hours, entry fee, distance from homestay (km), travel tips, dress code (optional), latitude, and longitude.
- **REQ-MGT-03:** All mandatory fields (name, category, short description, opening hours, distance, latitude, longitude) shall be validated before submission. The system shall display field-level error messages for missing or invalid values.
- **REQ-MGT-04:** The host shall be able to edit any field of an existing place entry.
- **REQ-MGT-05:** The system shall require explicit confirmation before permanently deleting a place.
- **REQ-MGT-06:** Deleted places shall be immediately removed from the tourist-facing listing and map.
- **REQ-MGT-07:** The management interface shall be accessible only to an authenticated host (see REQ-AUTH-01).

---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

- **PERF-01:** The tourist place listing page shall load and display content within 3 seconds on a standard 4G mobile data connection under normal server load.
- **PERF-02:** Filtering the place listing by category shall update the displayed results within 500 milliseconds.
- **PERF-03:** The interactive map shall render all place markers within 4 seconds on a 4G mobile connection, subject to map tile provider availability.
- **PERF-04:** The host management dashboard shall load within 3 seconds following successful authentication.
- **PERF-05:** The system shall support a minimum of 50 concurrent tourist users without degradation in response times exceeding 20% above the baseline.

### 5.2 Safety Requirements

No physical safety risks are associated with this software system. However:

- **SAFE-01:** The system shall clearly display travel tips for any place where safety considerations apply (e.g., swimming conditions at beaches, restricted areas at heritage sites, dress requirements at religious sites), as described in the host-provided travel tips field.
- **SAFE-02:** The system shall not collect or store any personally identifiable information from tourists without disclosure.

### 5.3 Security Requirements

- **SEC-01:** The host management interface shall be accessible only to an authenticated user with valid credentials (see Feature 4.6).
- **SEC-02:** All communications between the browser and the server shall be encrypted using HTTPS/TLS in the production environment.
- **SEC-03:** Host passwords shall be hashed using a recognised cryptographic algorithm (e.g., bcrypt) before storage. Plain-text passwords shall never be persisted.
- **SEC-04:** JWT tokens issued to the host shall have a defined expiry period, after which re-authentication shall be required.
- **SEC-05:** The API shall validate all inputs server-side to prevent injection attacks. User-supplied strings shall be sanitised before database insertion.
- **SEC-06:** CORS (Cross-Origin Resource Sharing) policies shall be configured to permit requests only from the designated frontend origin in production.
- **SEC-07:** The tourist interface shall be entirely read-only with respect to data — no authentication is required, and no tourist-supplied data is persisted.

### 5.4 Software Quality Attributes

- **Usability:** The tourist interface shall be navigable without prior instruction by a user unfamiliar with the system. Core tasks (finding a place, viewing details, building a plan) shall be completable in no more than 3 interactions from the homepage.
- **Responsiveness:** The tourist interface shall be fully functional and visually coherent on mobile devices with a minimum viewport width of 360px and on desktop viewports up to 1920px.
- **Maintainability:** The host interface shall allow a non-technical user to add, edit, or delete a place without assistance, using clear field labels and inline guidance.
- **Reliability:** The system shall be available to tourists during normal operating hours. Scheduled maintenance shall be performed outside of peak tourist hours.
- **Portability:** The system shall function correctly on the two most recent versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.
- **Correctness:** All place information displayed to tourists shall reflect the most recent data entered by the host, with no caching delay exceeding 60 seconds.

### 5.5 Business Rules

- **BR-01:** Only the authenticated host may create, modify, or delete place of interest records. Tourists have read-only access to all place data.
- **BR-02:** The system shall maintain a minimum of 10 active places of interest within the tourist-facing listing at all times during normal operation.
- **BR-03:** Places shall be categorised under one of three defined categories: Historical & Religious, Beach & Nature, or Restaurants & Local Food.
- **BR-04:** The one-day visit plan is personal to the tourist's browser session and is not stored on the server, transmitted to the host, or shared with any third party.
- **BR-05:** The system shall not display any booking, reservation, or payment links, or encourage tourists to make purchases through the platform.

---

## 6. Other Requirements

### Database Requirements

- The system shall use a relational PostgreSQL database with a minimum schema covering: a `places` table (storing all place attributes), and a `host_users` table (storing host credentials).
- The database shall be seeded with data for the 12 representative places of interest listed in the project scope prior to system deployment.

### Internationalisation Requirements

- The initial version of TourMind shall be delivered in **English** only.
- All place names and descriptions shall be provided in English by the host.
- No multi-language support is required for version 1.0.

### Data Integrity Requirements

- Deleting a place record shall be a hard delete; no soft-delete or archive mechanism is required for version 1.0.
- The coordinate data (latitude, longitude) for each place shall be verified against a mapping service prior to seeding to ensure accurate map pin placement.

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **Host** | The homestay owner responsible for managing the content of the TourMind system via the authenticated management interface. |
| **Tourist** | A visitor (local or international) who uses the public-facing TourMind interface to browse places and plan a one-day visit. |
| **Place of Interest** | A location, attraction, or venue within approximately 25 km of the Matara town centre homestay that is documented in the system. |
| **One-Day Visit Plan** | A personalised ordered list of places of interest assembled by a tourist for a single day of sightseeing. |
| **Homestay** | The host's accommodation property in Matara town centre, which serves as the reference point for all distances displayed in the system. |
| **Category** | A classification applied to each place of interest, one of: Historical & Religious, Beach & Nature, or Restaurants & Local Food. |
| **JWT** | JSON Web Token — a compact, URL-safe token format used to represent authenticated session claims between the frontend and backend. |
| **REST API** | Representational State Transfer Application Programming Interface — the architectural style used for communication between the Next.js frontend and FastAPI backend. |
| **CRUD** | Create, Read, Update, Delete — the four basic operations performed on place records by the host. |
| **SRS** | Software Requirements Specification — this document. |
| **TBD** | To Be Determined — used to flag requirements or details not yet confirmed. |

---

## Appendix B: Analysis Models

### B.1 Entity-Relationship Overview

The primary data entities and their relationships are described below:

```
┌──────────────────────────────┐        ┌──────────────────────┐
│           Place              │        │      HostUser         │
├──────────────────────────────┤        ├──────────────────────┤
│ id (PK)                      │        │ id (PK)              │
│ name                         │        │ username             │
│ category                     │        │ password_hash        │
│ short_description            │        └──────────────────────┘
│ full_description             │
│ opening_hours                │
│ entry_fee                    │
│ distance_km                  │
│ travel_tips                  │
│ dress_code                   │
│ latitude                     │
│ longitude                    │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘
```

### B.2 High-Level Data Flow

```
Tourist
  │
  ├── GET /api/places          → Returns list of all places
  ├── GET /api/places/{id}     → Returns full detail for one place
  └── GET /api/places?category → Returns filtered place list

Host (authenticated)
  │
  ├── POST   /api/host/login        → Returns JWT token
  ├── POST   /api/places            → Creates new place
  ├── PUT    /api/places/{id}       → Updates existing place
  └── DELETE /api/places/{id}       → Deletes a place
```

---

## Appendix C: To Be Determined List

| # | TBD Item | Section | Notes |
|---|---|---|---|
| TBD-01 | Map tile provider selection (Google Maps API vs. Leaflet/OpenStreetMap) | 2.4, 3.3, 4.4 | Decision affects API key requirements and licensing cost |
| TBD-02 | Exact GPS coordinates for all 12 places of interest | 4.7, 6 | To be verified and recorded during data collection phase |
| TBD-03 | Complete opening hours and entry fee data for all 12 places | 4.3, 4.7 | To be gathered during research and data collection |
| TBD-04 | Final host credentials setup procedure | 4.6 | Username and initial password to be confirmed with host; mechanism for password reset TBD |
| TBD-05 | Deployment environment and hosting provider | 2.4 | Server, domain name, and HTTPS certificate provider not yet confirmed |
| TBD-06 | Exact session/token expiry duration for host JWT | 5.3 | To be confirmed during security design |
