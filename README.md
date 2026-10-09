# Musterbox

Musterbox is a multi-tenant HRMS and payroll management platform designed for Indian businesses. The application provides a single web experience for managing employee lifecycle operations, workforce attendance, approvals, payroll, expenses, compliance, and company administration.

This repository contains the frontend application built with Angular and TypeScript. It is intended to work with a separate backend API service that provides authentication, employee data, payroll logic, attendance processing, and operational APIs.

## Project overview

Musterbox is designed for organizations that need:

- Multi-company and child-company hierarchy support
- Role-based access for employees, HR admins, sub-admins, dealers, and super admins
- Attendance and time tracking with leave and overtime workflows
- Payroll and pay-slip management
- Employee master data, documents, assets, and policies
- Notifications, chat, approvals, and workflow tracking
- Export and reporting capabilities for operational and compliance needs

The application is organized around a central tenant model where each employee and company record belongs to a specific company or child-company context. Access is not only based on user login but also on permissions, company scope, and authorization rules.

## Technology stack

- Angular 22
- TypeScript
- RxJS
- Angular Material / Bootstrap-based UI patterns
- FullCalendar for scheduling and calendar features
- Chart.js for dashboards and analytics
- Firebase integration (legacy template support, but real auth is backend-driven)
- Socket.IO for chat and notifications
- ExcelJS, XLSX, PDF generation libraries for reports and exports

## Prerequisites

Before starting, make sure the following are installed and available:

- Node.js 20.x or a compatible LTS version
- npm (comes with Node.js)
- Git
- A modern browser such as Chrome, Edge, or Firefox
- A running backend API service for authentication and data access
- Access to the project environment configuration that matches your deployment

If you use nvm, the repository includes an `install_nvm.sh` helper script that can assist with Node setup on Unix-like systems.

## Project structure

```text
Musterbox/
├── angular.json
├── package.json
├── tsconfig.json
├── karma.conf.js
├── README.md
├── docs/
│   ├── 01-product-overview.md
│   ├── 02-getting-started.md
│   ├── 03-architecture.md
│   ├── 04-roles-and-permissions.md
│   ├── 05-ui-walkthrough.md
│   ├── 06-module-catalogue.md
│   ├── 07-backend-api.md
│   ├── 08-adding-a-screen.md
│   ├── 09-gotchas-and-glossary.md
│   └── 10-angular-migration-plan.md
├── patches/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── test.ts
└── ...
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Musterbox
```

2. Install dependencies:

```bash
npm install
```

3. Ensure the environment configuration is correct. Review the files in `src/environments/`:

- `environment.ts` for local development
- `environment.prod.ts` for production build settings

4. Confirm the backend API endpoints and authentication flow are reachable from your local environment.

## Running the app locally

The project includes the following scripts in `package.json`:

```bash
npm start
```

This starts the Angular development server. By default, Angular serves the app on a local development port such as:

```text
http://localhost:4200
```

If you need to run a production-style build locally:

```bash
npm run build
```

For production build configuration:

```bash
npm run build:prod
```

## Available scripts

```bash
npm start
npm run build
npm run build:prod
npm run build:stage
npm test
npm run lint
npm run format
```

### Script descriptions

- `npm start`: starts the Angular development server for local work
- `npm run build`: builds the application in development mode
- `npm run build:prod`: builds a production bundle
- `npm run build:stage`: builds for staging configuration
- `npm test`: runs unit tests through Karma
- `npm run lint`: checks project linting issues
- `npm run format`: formats the codebase with Prettier

## Features

### Employee lifecycle management

- Employee master records and profiles
- Joining, transfer, promotion, and exit workflows
- Document management for employee files
- Assets, policies, and company-specific employee records

### Attendance and workforce tracking

- Punch-in and punch-out tracking
- Attendance policy configuration
- Leave application and approval flows
- Overtime and short-leave tracking
- Biometric device integration support
- Attendance reporting and summaries

### Payroll and compensation

- Salary structure and pay head management
- Payroll processing, salary calculations, and payslips
- Incentives, reimbursements, and expense support
- Tax-related salary reporting and adjustment workflows

### Leave, approvals, and authorization

- Leave applications and balance tracking
- Approval chains and user authorization rules
- Manager and HR review flows
- Request-based workflows for leave and expense decisions

### Organizational administration

- Company, branch, department, division, and designation management
- Shift policies and working-area configuration
- Role and permission management
- User access control based on company scope and authorization rules

### Communication and collaboration

- Internal notifications
- Chat and in-app messaging support
- Approval notifications and user alerts
- Dashboard summaries of pending actions and status updates

### Reporting and data export

- Dashboard metrics and company overview cards
- CSV, Excel, and PDF export support
- Report pages for attendance, payroll, and operations
- Financial and compliance-related data views

### Integration support

- Biometric attendance device connectivity
- Google Maps and location-aware workflows
- Chat and notification services over socket communication
- ERP sync integrations for finance and accounting modules

## App behavior and architecture notes

This frontend expects a backend service and a secure authentication model:

- JWT tokens are typically stored in browser storage after login
- User access is determined by permission matrices and user type
- Company identity is often carried through local storage or request data
- The app is designed around a multi-tenant structure with nested company hierarchies

The project docs in the `docs/` folder provide deeper technical guidance on the product, architecture, role model, and adding feature screens.

## Recommended workflow for local development

1. Install dependencies with `npm install`
2. Ensure backend services and environment variables are configured
3. Start the app using `npm start`
4. Sign in with the appropriate test credentials from your backend environment
5. Use the module menu to test employee, attendance, payroll, and admin flows
6. Run `npm run build` before deployment to confirm the app compiles cleanly

## Troubleshooting tips

- If dependency installation fails, verify your Node/npm version matches the project requirements
- If the app does not load data, check whether the backend API is running and the environment configuration points to the correct host
- If lint or build errors appear, ensure there are no stale package-lock or node_modules issues by reinstalling dependencies
- If the app behaves unexpectedly, review the documentation in `docs/` for product and architecture context

## Documentation

The project includes a knowledge base in the `docs/` folder. It is recommended to review these in order when onboarding:

- `docs/01-product-overview.md`
- `docs/02-getting-started.md`
- `docs/03-architecture.md`
- `docs/04-roles-and-permissions.md`
- `docs/05-ui-walkthrough.md`
- `docs/06-module-catalogue.md`
- `docs/07-backend-api.md`
- `docs/08-adding-a-screen.md`
- `docs/09-gotchas-and-glossary.md`

## Summary

Musterbox is a broad, enterprise-grade HR and payroll platform with a strong emphasis on multi-tenant access, employee lifecycle management, attendance controls, payroll workflows, and operational approvals. The frontend is built as a modular Angular application and is intended to be paired with a backend service to provide the data and permission model required for real deployment.

This README gives the essential onboarding path; for deeper technical details, continue with the documentation inside the `docs/` directory.
