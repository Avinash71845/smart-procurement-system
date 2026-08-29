# 🌾 Smart Procurement Management System

### Smart India Hackathon 2026 — Problem Statement 26032

> A digital procurement management platform designed to reduce farmer waiting time, improve procurement-centre coordination, provide real-time queue visibility, and keep farmers informed about procurement and payment status.

---

# 📌 Problem Statement

**Problem Statement ID:** SIH26032

**Title:** Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.

**Organization:** Ministry of Consumer Affairs, Food & Public Distribution

**Department:** Department of Consumer Affairs (DoCA)

**Category:** Software

**Theme:** Smart Automation

---

# 🎯 Our Solution

We are building a **Smart Procurement Management System** with two types of users:

```text
                 SMART PROCUREMENT SYSTEM
                          │
             ┌────────────┴────────────┐
             │                         │
          FARMER                  PROCUREMENT
          LOGIN                       LOGIN
             │                         │
             ▼                         ▼
       Farmer Portal            Centre Portal
```

## 👨‍🌾 Farmer

The farmer can:

* Register/Login
* Receive procurement information
* Know procurement schedule and deadline
* Find/recommend nearby procurement centres
* View available slots
* Enter expected grain weight
* Book a slot
* Receive a token number
* Track real-time queue
* Track procurement progress
* Track payment status
* Receive important notifications in the farmer's language

## 🏢 Procurement Centre

The procurement user can:

* Login securely
* View today's bookings
* Check-in farmers
* Manage the real-time queue
* Verify documents
* Perform weighing
* Perform quality check
* Complete procurement
* Update procurement status
* Update payment status
* Trigger farmer notifications

---

# 🔄 Complete System Flow

```text
                    FARMER
                       │
                       ▼
                 Registration
                       │
                       ▼
             Procurement Information
                       │
                       ▼
              Find Nearby Centre
                       │
                       ▼
                Select Date
                       │
                       ▼
               View Available Slots
                       │
                       ▼
             Enter Expected Weight
                       │
                       ▼
            Weight-Based Capacity Check
                       │
                 ┌─────┴─────┐
                 │           │
             Available    Not Available
                 │           │
                 ▼           ▼
             Book Slot   Select Another
                 │
                 ▼
             Token Number
                 │
                 ▼
              Check-In
                 │
                 ▼
          Real-Time Queue
                 │
                 ▼
         Document Verification
                 │
                 ▼
               Weighing
                 │
                 ▼
            Quality Check
                 │
                 ▼
       Procurement Completed
                 │
                 ▼
            Payment Status
                 │
                 ▼
        Payment Credited
                 │
                 ▼
          Farmer Notification
```

---

# 🧭 Three Main Stages

## 1️⃣ BEFORE PROCUREMENT CENTRE

```text
Registration
     ↓
Information
     ↓
Scheduling
     ↓
Slot Booking
```

## 2️⃣ AT PROCUREMENT CENTRE

```text
Check-In
   ↓
Real-Time Queue
   ↓
Document Verification
   ↓
Weighing
   ↓
Quality Check
   ↓
Procurement Completed
```

## 3️⃣ AFTER PROCUREMENT

```text
Payment Processing
       ↓
Payment Status
       ↓
Payment Credited
       ↓
Notification
```

---

# 🔔 Notification Strategy

Notifications should **not be excessive**.

Only important events should notify the farmer.

| Event                                    | Notification |
| ---------------------------------------- | ------------ |
| Registration completed                   | ✅            |
| Procurement started / deadline announced | ✅            |
| Slot successfully booked                 | ✅            |
| Farmer's turn approaching                | ✅            |
| Important queue update                   | ✅            |
| Payment status changed                   | ✅            |
| Payment credited                         | ✅            |

Notifications should be available in the **farmer's preferred language**, including Hindi.

Example:

```text
आपका स्लॉट सफलतापूर्वक बुक हो गया है।

दिनांक: 10 सितम्बर
समय: 10:00 AM - 12:00 PM
टोकन: #35

कृपया निर्धारित समय पर खरीद केंद्र पर पहुंचें।
```

---

# 🏗️ Technology Stack

## Frontend

* React
* JavaScript
* HTML
* CSS
* Axios
* React Router

## Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Spring Security
* JWT
* WebSocket
* STOMP

## Database

* PostgreSQL

## Development Tools

* IntelliJ IDEA
* VS Code
* Postman
* Git
* GitHub
* Maven

## External Services

Potential integrations:

* SMS Gateway
* Location/Maps API
* Optional notification service

> External APIs should be integrated only after the core MVP works.

---

# 📁 Project Structure

```text
smart-procurement-system/
│
├── frontend/
│   └── smart-procurement-frontend/
│
├── backend/
│   └── smart-procurement-backend/
│
├── README.md
└── .gitignore
```

---

# 🎨 Frontend Structure

```text
frontend/
└── smart-procurement-frontend/
    │
    ├── src/
    │   ├── assets/
    │   │
    │   ├── components/
    │   │   ├── common/
    │   │   ├── farmer/
    │   │   └── procurement/
    │   │
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── farmer/
    │   │   └── procurement/
    │   │
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── farmerService.js
    │   │   ├── centreService.js
    │   │   ├── slotService.js
    │   │   ├── bookingService.js
    │   │   ├── queueService.js
    │   │   ├── procurementService.js
    │   │   ├── paymentService.js
    │   │   └── notificationService.js
    │   │
    │   ├── context/
    │   ├── hooks/
    │   ├── utils/
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    └── package.json
```

---

# ☕ Backend Structure

```text
backend/
└── smart-procurement-backend/
    │
    ├── src/main/java/com/smartprocurement/
    │
    ├── auth/
    ├── user/
    ├── farmer/
    ├── centre/
    ├── slot/
    ├── booking/
    ├── queue/
    ├── procurement/
    ├── payment/
    ├── notification/
    │
    ├── security/
    ├── config/
    ├── exception/
    └── common/
```

---

# 🧩 Backend Package Architecture

Every major feature should follow:

```text
feature/
│
├── controller/
├── dto/
├── entity/
├── repository/
└── service/
```

Example:

```text
booking/
│
├── controller/
│   └── BookingController.java
│
├── dto/
│   ├── BookingRequest.java
│   └── BookingResponse.java
│
├── entity/
│   ├── Booking.java
│   └── BookingStatus.java
│
├── repository/
│   └── BookingRepository.java
│
└── service/
    └── BookingService.java
```

---

# 👨‍💻 Backend Ownership

## Developer 1 — Farmer / Booking / Payment

**Owner: [Your Name/GitHub Username]**

Responsible modules:

```text
farmer/
centre/
slot/
booking/
payment/
```

### Main responsibilities

* Farmer registration business logic
* Farmer profile
* Procurement centre data
* Nearby centre recommendation
* Slot availability
* Weight-based capacity calculation
* Slot booking
* Token generation
* Booking status
* Booking history
* Farmer procurement tracking
* Payment status
* Farmer dashboard APIs

### Main classes

```text
FarmerController
FarmerService
FarmerRepository

CentreController
CentreService
CentreRepository

SlotController
SlotService
SlotRepository

BookingController
BookingService
BookingRepository

PaymentController
PaymentService
PaymentRepository
```

### Important concepts to know

```text
REST API
Controller
DTO
Service
Repository
Spring Data JPA
Hibernate
PostgreSQL
Entity Relationships
Validation
Exception Handling
Transactions
Business Logic
Java Enum
```

---

# 👨‍💻 Backend Ownership

## Developer 2 — Security / Queue / Procurement / Notification

**Owner: [Friend's Name/GitHub Username]**

Responsible modules:

```text
auth/
security/
queue/
procurement/
notification/
```

### Main responsibilities

* Login
* Authentication
* Password encryption
* JWT
* Role-based authorization
* Procurement login
* Farmer check-in
* Queue creation
* Queue ordering
* Call next token
* Queue status updates
* Real-time queue
* WebSocket/STOMP
* Document verification
* Weighing
* Quality check
* Procurement completion
* Hindi notification templates
* SMS integration

### Main classes

```text
AuthController
AuthService

JwtService
JwtAuthenticationFilter
CustomUserDetailsService
SecurityConfig

QueueController
QueueService
QueueRepository

ProcurementController
ProcurementService
ProcurementRepository

NotificationService
SmsService
WebSocketConfig
```

### Important concepts to know

```text
Spring Security
Authentication
Authorization
PasswordEncoder
BCrypt
UserDetails
SecurityFilterChain
JWT
JWT Filter
Role-based Authorization
WebSocket
STOMP
Queue Management
REST API
JPA
Transactions
External API Integration
```

---

# 🔗 Critical Module Relationships

The entire system is connected through this flow:

```text
Farmer
   │
   ▼
Booking
   │
   ▼
QueueEntry
   │
   ▼
Procurement
   │
   ▼
Payment
```

Conceptually:

```text
Farmer
  1
  │
  │
  ▼
Booking
  1
  │
  ▼
QueueEntry
  1
  │
  ▼
Procurement
  1
  │
  ▼
Payment
```

---

# 🔥 Critical Integration Points

## 1. Booking → Queue

Developer 1 creates:

```text
bookingId
farmerId
centreId
slotId
tokenNumber
expectedWeight
bookingStatus
```

Developer 2 uses the booking to create the queue entry.

```text
Booking
   ↓
QueueEntry
```

---

## 2. Queue → Farmer

Developer 2 manages:

```text
WAITING
CALLED
PROCESSING
COMPLETED
SKIPPED
```

Developer 1 exposes farmer-facing tracking.

```text
GET /api/queue/{bookingId}
```

---

## 3. Procurement → Tracking

Developer 2 updates:

```text
CHECKED_IN
DOCUMENT_VERIFIED
WEIGHING
QUALITY_CHECK
COMPLETED
```

Developer 1 provides the farmer-facing API.

```text
GET /api/procurement/{bookingId}
```

---

## 4. Procurement → Payment

When procurement is completed:

```text
Procurement
     ↓
Payment
     ↓
PENDING
     ↓
PROCESSING
     ↓
CREDITED
```

---

## 5. Payment → Notification

When payment becomes credited:

```text
PaymentStatus = CREDITED
       ↓
NotificationService
       ↓
SMS / App Notification
       ↓
Farmer
```

---

# 🧮 Weight-Based Slot Booking Logic

The farmer **does not calculate the required time**.

The system calculates it.

```text
Farmer selects slot
       ↓
Farmer enters expected grain weight
       ↓
Backend calculates estimated processing requirement
       ↓
Check slot's remaining capacity
       ↓
       ┌───────────────┐
       │ Enough space? │
       └───────┬───────┘
          YES │ NO
              │
       ▼      ▼
     BOOK   REJECT
       │      │
       ▼      ▼
    Token   Suggest
            another slot
```

Example:

```text
Slot: 10:00 – 12:00

Available processing capacity:
5000 kg

Already booked:
3500 kg

Remaining:
1500 kg

Farmer expected weight:
1000 kg

Result:
BOOKING ALLOWED
```

If expected weight is:

```text
2000 kg
```

then:

```text
2000 > 1500

→ Slot unavailable for this booking
```

---

# 🎫 Token Flow

Example:

```text
Booking #501
      ↓
Token #35
      ↓
Check-in
      ↓
Queue Position
      ↓
Procurement calls #35
      ↓
#35 Processing
      ↓
#35 Completed
      ↓
Call #36
```

---

# ⚡ Real-Time Queue

The procurement operator changes the queue:

```text
#35 → PROCESSING
```

The farmer should immediately see:

```text
Your Token: #35

Current Token: #34

Status:
Your turn is approaching.
```

Recommended technology:

```text
Spring Boot WebSocket
        +
STOMP
        +
React WebSocket client
```

REST APIs can still be used for initial data loading.

WebSocket is used for live updates.

---

# 🔐 Authentication Flow

```text
React Login
     ↓
POST /api/auth/login
     ↓
Spring Security
     ↓
Verify username/password
     ↓
Generate JWT
     ↓
Return JWT
     ↓
React stores token
     ↓
Token sent with protected requests
     ↓
JWT Filter validates token
     ↓
Request allowed/rejected
```

Roles:

```text
FARMER
PROCUREMENT
```

Protected examples:

```text
FARMER
→ Book Slot
→ Track Queue
→ Track Procurement
→ Track Payment

PROCUREMENT
→ Check-in
→ Manage Queue
→ Verify Documents
→ Weighing
→ Quality Check
→ Complete Procurement
→ Update Payment
```

---

# 🌐 REST API Naming Convention

Use:

```text
/api/auth
/api/farmers
/api/centres
/api/slots
/api/bookings
/api/queue
/api/procurement
/api/payments
/api/notifications
```

Example:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/centres/nearby
GET    /api/slots/available

POST   /api/bookings
GET    /api/bookings/my

GET    /api/queue/{bookingId}

POST   /api/queue/check-in
PUT    /api/queue/{id}/status

GET    /api/procurement/{bookingId}
PUT    /api/procurement/{id}/weighing
PUT    /api/procurement/{id}/quality
PUT    /api/procurement/{id}/complete

GET    /api/payments/{bookingId}

GET    /api/notifications
```

> Exact endpoints can change during implementation. Update this README whenever the API contract changes.

---

# 🗃️ Initial Database Entities

Recommended MVP entities:

```text
User
Farmer
ProcurementCentre
Slot
Booking
QueueEntry
Procurement
Payment
Notification
```

Possible relationships:

```text
User
 │
 ├── Farmer
 │
 └── ProcurementUser


Farmer
  │
  └── Booking
          │
          ├── Slot
          │
          ├── QueueEntry
          │
          └── Procurement
                    │
                    └── Payment
```

---

# 📊 Important Status Enums

## BookingStatus

```text
BOOKED
CANCELLED
RESCHEDULED
EXPIRED
```

## QueueStatus

```text
WAITING
CALLED
PROCESSING
COMPLETED
SKIPPED
```

## ProcurementStatus

```text
CHECKED_IN
DOCUMENT_VERIFIED
WEIGHING
QUALITY_CHECK
COMPLETED
```

## PaymentStatus

```text
PENDING
PROCESSING
INITIATED
CREDITED
FAILED
```

---

# 🧪 Development Order

## Phase 1 — Foundation

```text
Spring Boot project
       ↓
PostgreSQL connection
       ↓
JPA configuration
       ↓
Entities
       ↓
Repositories
       ↓
Basic REST APIs
```

---

## Phase 2 — Parallel Development

### Developer 1

```text
Farmer
   ↓
Centre
   ↓
Slot
   ↓
Booking
   ↓
Token
   ↓
Payment
```

### Developer 2

```text
Auth
   ↓
Security
   ↓
JWT
   ↓
Procurement Login
   ↓
Queue
   ↓
WebSocket
```

---

## Phase 3 — Integration

```text
Booking
   ↓
Queue
   ↓
Procurement
   ↓
Payment
   ↓
Notification
```

---

## Phase 4 — Frontend Integration

```text
React
 ↓
REST APIs
 ↓
Spring Boot
 ↓
PostgreSQL
```

and:

```text
React
 ↕
WebSocket
 ↕
Spring Boot
```

---

# 🚦 MVP Priority

## 🔴 P0 — Must Work

```text
1. Registration
2. Login
3. Slot Booking
4. Weight-based availability
5. Token generation
6. Check-in
7. Real-time Queue
8. Procurement Tracking
9. Payment Status
10. Important Notifications
```

## 🟠 P1 — After P0

```text
1. Nearby centre recommendation improvements
2. Better document workflow
3. Rescheduling improvements
4. Better notification templates
5. UI improvements
```

## 🟢 P2 — Optional

```text
1. AI features
2. Advanced analytics
3. Advanced map features
4. Additional automation
5. Advanced integrations
```

---

# 🌿 Git Workflow

Main branches:

```text
main
  │
  └── develop
```

Developer 1:

```text
feature/farmer
feature/centre
feature/slot
feature/booking
feature/payment
```

Developer 2:

```text
feature/auth-security
feature/jwt
feature/queue
feature/websocket
feature/procurement
feature/notification
```

---

# 🔀 Git Rules

### Before starting work

```bash
git checkout develop
git pull origin develop
```

Create your branch:

```bash
git checkout -b feature/booking
```

After completing work:

```bash
git add .
git commit -m "feat: implement slot booking"
git push origin feature/booking
```

Then create a Pull Request into:

```text
develop
```

Do not directly push unfinished work to `main`.

---

# 📝 Commit Convention

Use:

```text
feat:
fix:
refactor:
docs:
test:
chore:
```

Examples:

```text
feat: implement farmer registration
feat: add JWT authentication
feat: implement slot booking
feat: add real-time queue
fix: prevent slot overbooking
test: add booking service tests
docs: update API documentation
```

---

# 🤝 Collaboration Rules

### Rule 1

Before creating a new class, check the package structure.

### Rule 2

Do not randomly change another developer's module.

### Rule 3

If an API response/request changes, inform the other developer.

### Rule 4

Keep business logic inside the `service` layer.

### Rule 5

Controllers should remain thin.

```text
Controller
   ↓
Service
   ↓
Repository
```

### Rule 6

Do not expose JPA entities directly when a DTO is appropriate.

### Rule 7

Do not merge untested code.

### Rule 8

Always pull the latest `develop` before starting new work.

---

# 🧠 Backend Golden Rule

For normal REST features:

```text
Controller
     ↓
DTO
     ↓
Service
     ↓
Repository
     ↓
Database
```

For real-time features:

```text
Procurement Action
       ↓
Service
       ↓
Database Update
       ↓
WebSocket Event
       ↓
React
       ↓
Farmer sees updated queue
```

---

# 🧪 Testing Strategy

Before connecting React, test APIs using Postman.

Example:

```text
1. Register farmer
2. Login
3. Get centres
4. Get slots
5. Book slot
6. Get booking
7. Check queue
8. Check procurement
9. Check payment
10. Check notification
```

The backend should work independently before frontend integration.

---

# ✅ Developer Checklist

## Developer 1

```text
[ ] Farmer entity
[ ] Farmer registration
[ ] Farmer profile
[ ] Centre entity
[ ] Centre APIs
[ ] Nearby centre logic
[ ] Slot entity
[ ] Slot APIs
[ ] Weight calculation
[ ] Slot availability
[ ] Booking entity
[ ] Booking API
[ ] Token generation
[ ] Prevent overbooking
[ ] Booking history
[ ] Procurement tracking API
[ ] Payment entity
[ ] Payment API
[ ] Validation
[ ] Exception handling
[ ] Postman testing
```

## Developer 2

```text
[ ] User entity
[ ] Login
[ ] Spring Security
[ ] PasswordEncoder
[ ] JWT
[ ] JWT Filter
[ ] Role authorization
[ ] Procurement login
[ ] Check-in
[ ] Queue entity
[ ] Queue API
[ ] Queue ordering
[ ] Call next token
[ ] Queue status
[ ] WebSocket
[ ] STOMP
[ ] Procurement entity
[ ] Document verification
[ ] Weighing
[ ] Quality check
[ ] Procurement completion
[ ] Notification service
[ ] Hindi notification templates
[ ] SMS API
[ ] Postman testing
```

---

# 🎯 Definition of Done — MVP

The MVP is considered successful when the team can demonstrate this complete scenario:

```text
Farmer Registers
       ↓
Farmer Logs In
       ↓
Sees Procurement Information
       ↓
Selects Nearby Centre
       ↓
Selects Date
       ↓
Views Available Slots
       ↓
Enters Expected Weight
       ↓
System Checks Capacity
       ↓
Slot Booked
       ↓
Token #35 Generated
       ↓
Farmer Arrives
       ↓
Procurement User Checks In #35
       ↓
Queue Updates in Real Time
       ↓
#35 Called
       ↓
Document Verification
       ↓
Weighing
       ↓
Quality Check
       ↓
Procurement Completed
       ↓
Payment Status = PROCESSING
       ↓
Payment Status = CREDITED
       ↓
Farmer Receives Hindi Notification
```

---

# 🚀 Current Development Rule

> **Build the golden flow first.**

Do not spend too much time on:

```text
AI
Advanced maps
Analytics
Complex dashboards
Unnecessary animations
Extra notification types
```

until this works:

```text
REGISTER
   ↓
BOOK
   ↓
QUEUE
   ↓
PROCUREMENT
   ↓
PAYMENT
   ↓
NOTIFICATION
```

---

# 📌 Quick Start for a New Collaborator

If you are joining this project and don't know where to start:

### Step 1

Read:

```text
Problem Statement
↓
Complete System Flow
↓
Backend Ownership
```

### Step 2

Check:

```text
src/main/java/com/smartprocurement/
```

### Step 3

Check the current Git branch:

```bash
git branch
```

### Step 4

Pull latest code:

```bash
git checkout develop
git pull origin develop
```

### Step 5

Check your assigned module.

### Step 6

Create a feature branch.

### Step 7

Implement:

```text
Controller
Service
Repository
Entity
DTO
```

where required.

### Step 8

Test with Postman.

### Step 9

Commit and push.

### Step 10

Create Pull Request → `develop`.

---

# 🌾 Project Philosophy

The goal is not simply to create another CRUD application.

The goal is to create a system where:

```text
Farmer knows
     ↓
When to come
     ↓
Where to come
     ↓
What token they have
     ↓
How long they may wait
     ↓
What stage their procurement is in
     ↓
When their payment is credited
```

while the procurement centre gets:

```text
Bookings
   ↓
Expected workload
   ↓
Farmer check-in
   ↓
Live queue
   ↓
Processing workflow
   ↓
Procurement completion
   ↓
Payment updates
```

This is the core value of the **Smart Procurement Management System**.
