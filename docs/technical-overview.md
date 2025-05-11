# LTI System - Technical Overview

## Project Architecture

The LTI (Talent Tracking System) project is a full-stack application with a clear separation between frontend and backend:

- **Frontend**: React-based single page application (SPA)
- **Backend**: Node.js Express API with TypeScript and Prisma ORM

The project follows a Domain-Driven Design (DDD) architecture, especially in the backend.

## Technology Stack

### Frontend

- **Framework**: React
- **Routing**: react-router-dom
- **UI Library**: React Bootstrap
- **Drag and Drop**: react-beautiful-dnd
- **Forms**: Uses React hooks for state management
- **HTTP Client**: Native fetch API

### Backend

- **Framework**: Express.js on Node.js
- **Language**: TypeScript
- **ORM**: Prisma with PostgreSQL
- **Architecture**: Domain-Driven Design with clear separation of:
  - Application layer (services)
  - Domain layer (models)
  - Presentation layer (controllers)
  - Infrastructure layer (repositories)

## Database Structure

The system uses a relational database (PostgreSQL) with the following main entities:

- Candidate
- Education
- WorkExperience
- Resume
- Position
- Application
- Interview
- InterviewFlow
- InterviewStep

## Key Features

1. **Position Management**: Create and manage job positions
2. **Candidate Management**: Track candidates through the recruitment process
3. **Interview Process**: Define and manage interview workflows
4. **Kanban-style Interface**: Visual representation of candidates' progress through interview stages

## Testing Strategy

The project implements:

- Unit tests
- Integration tests
- E2E tests with Playwright

## API Endpoints

Key endpoints relevant for E2E testing:

- `GET /positions/:id/interviewFlow`: Get the interview flow structure for a position
- `GET /positions/:id/candidates`: Get candidates for a specific position
- `PUT /candidates/:id`: Update a candidate's interview step
