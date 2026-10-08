# Restaurant Waitlist System

A simple restaurant waitlist system where customers can join a queue, receive a unique ticket number, and see how many parties are ahead of them. Staff can view the waiting list and remove parties from a separate screen.

## How to Run

### Requirements

* Node.js
* npm

### Install dependencies

```bash
npm install
```

### Set up the database

The project uses SQLite. The database connection is configured through `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
```

Push the Prisma schema to the database:

```bash
npx prisma db push
```

Generate the Prisma Client:

```bash
npx prisma generate
```

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The staff screen is available at:

```text
http://localhost:3000/staff
```

## Technology and Database

I chose Next.js with JavaScript because it provides a simple full-stack structure where the UI and API routes can be implemented in the same project. I chose SQLite with Prisma because the waitlist is a small local dataset and SQLite keeps the project simple while Prisma provides a clear and organised database access layer.

## Architecture

The project separates responsibilities into:

```text
app/
├── api/
│   └── waitlist/
│       └── route.js
├── staff/
└── page.js

lib/
├── prisma.js
├── repositories/
│   ├── waitlist.repository.js
│   └── ticket-counter.repository.js
├── services/
│   ├── waitlist.service.js
│   └── ticket-counter.service.js
└── validators/
    └── waitlist.validator.js

prisma/
└── schema.prisma
```

### Main flow

```text
Customer
   ↓
Waitlist UI
   ↓
POST /api/waitlist
   ↓
Validator
   ↓
Waitlist Service
   ↓
Ticket Counter Service
   ↓
Repository
   ↓
Prisma
   ↓
SQLite
```

## Core Features

### Customer

* Join the waitlist using a name and party size.
* Receive a unique ticket number.
* See the number of parties ahead.
* Refresh the ticket view to retrieve the current position.

### Staff

* View all waiting parties.
* Parties are displayed in the order they joined.
* Remove any party from the waitlist.

### Business Rules

* The name cannot be empty.
* Party size must be a whole number greater than zero.
* Ticket numbers are unique.
* Ticket numbers are never reused after a party is removed.
* "Parties ahead" counts waiting parties, not individual people.

## What Is Complete

The core requirements of the assignment are implemented:

* Customer waitlist joining.
* Unique ticket generation.
* Parties-ahead calculation.
* Staff waitlist view.
* Removing parties from the waitlist.
* Input validation.
* SQLite persistence through Prisma.
* API routes for waitlist operations.

## What Is Not Included

The following optional or out-of-scope features are not implemented:

* Customer accounts or login.
* SMS or other notifications.
* QR code generation.
* Multiple restaurant branches.
* Automatic real-time queue updates.
* Staff authentication.
* Customer self-removal.

These were intentionally not prioritised because the assignment states that the core criteria should be completed before optional extras.

## Verification

I manually tested the main API and database flow using PowerShell requests.

For example, joining the waitlist with:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/waitlist" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Mohammad","partySize":4}'
```

returned a ticket number and the correct initial number of parties ahead.

I also verified that ticket numbers are not reused. After removing ticket `#2`, the next customer received ticket `#3` instead of `#2`.

I checked an AI suggestion during development by testing the proposed Prisma/database configuration with `npx prisma db push` and then verifying the waitlist API with a real POST request. The database was successfully updated and the API returned the created waitlist entry.

## AI Usage

AI tools were used during development for debugging, architecture discussions, implementation assistance, and verification ideas. The final implementation was manually tested against the assignment requirements.
