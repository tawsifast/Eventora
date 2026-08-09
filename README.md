# Eventora

Build a modern, professional frontend for a developer project and task management application called DevTrack.

Tech Stack

The frontend will be implemented separately using:

Next.js latest with App Router

TypeScript

Tailwind CSS

shadcn/ui

Lucide React icons

Do NOT create or implement a backend, database, authentication system, Prisma, Express, or API routes. This is a frontend-only design and should use realistic mock data.

The actual project will later connect to an Express + TypeScript + Prisma + PostgreSQL backend.

Product Concept

DevTrack is a personal developer project and task management dashboard.

Users can:

Manage software projects

Create and manage tasks

Track task status

Set task priorities

Set deadlines

Search and filter tasks

View project progress

See productivity statistics

The UI should feel like a polished SaaS product designed for modern developers.

Design Direction

Create a clean, minimal, premium developer-focused dashboard.

Style:

Modern SaaS dashboard

Professional rather than playful

Clean spacing

Strong typography

Subtle borders

Soft shadows

Rounded cards

Excellent visual hierarchy

Minimal use of gradients

Avoid excessive glassmorphism

Avoid overly colorful UI

Use a neutral dark/light interface

Responsive on desktop, tablet, and mobile

Use shadcn/ui components wherever appropriate instead of creating unnecessary custom UI components.

Use Lucide icons consistently.

Main Layout

Create a dashboard layout with:

Sidebar

Desktop sidebar containing:

DevTrack logo

Dashboard

Projects

Tasks

Calendar

Settings

At the bottom:

User avatar

User name

User email

Small dropdown menu

The sidebar should collapse or become a mobile drawer on smaller screens.

Top Header

Include:

Mobile menu button

Page title

Search

Notification button

User avatar

Dashboard Page

Create an attractive dashboard homepage.

Header:

"Good morning, Tawsif 👋"

Subtitle:

"Here's what's happening with your projects today."

Add a primary button:

"+ New Project"

Statistics Cards

Create four cards:

Total Projects

5

Total Tasks

32

Completed

18

In Progress

9

Each card should include:

Icon

Large number

Short label

Small trend/change indicator

Project Progress Section

Create a section called:

"Project Overview"

Display several project cards.

Example projects:

Portfolio Website

E-commerce Platform

Study Planner

Developer Blog

Each project card should contain:

Project name

Short description

Progress percentage

Progress bar

Number of tasks

Completed tasks

Deadline

Status badge

Example:

Portfolio Website

"Personal developer portfolio built with Next.js."

Progress: 75%

Tasks: 12

Completed: 9

Status: In Progress

Recent Tasks Section

Create a "Recent Tasks" section.

Use a clean table on desktop and responsive cards on mobile.

Columns:

Task

Project

Priority

Status

Due Date

Actions

Example tasks:

Build responsive navbar

Create authentication UI

Design project details page

Connect task filters

Improve mobile layout

Create dashboard statistics

Status options:

Todo

In Progress

Completed

Priority options:

Low

Medium

High

Use shadcn Badge components for status and priority.

Projects Page

Create a dedicated Projects page.

Header:

"Projects"

Subtitle:

"Manage and track all your development projects."

Primary button:

"+ New Project"

Add:

Search input

Status filter

Sort dropdown

Grid/List toggle

Project cards should contain:

Project name

Description

Progress

Task count

Status

Deadline

Created date

Three-dot action menu

Actions:

View

Edit

Delete

Project Details Page

Create a detailed project page.

Header:

Project name

Description

Status badge

Actions:

Edit Project

Delete Project

Show:

Project progress

Total tasks

Completed tasks

Remaining tasks

Deadline

Then create tabs:

Overview

Show project summary and progress.

Tasks

Show all project tasks with:

Search

Status filter

Priority filter

Sort

Activity

Show a simple activity timeline.

Example:

"Tawsif completed Build Navbar"

"Tawsif created a new task"

"Tawsif updated project status"

Tasks Page

Create a dedicated task management page.

Header:

"Tasks"

Subtitle:

"Manage everything you need to get done."

Add:

Search

Status filter

Priority filter

Project filter

Sort by deadline

Create a clean task table.

Each task should display:

Task title

Project

Priority

Status

Due date

Created date

Actions

Add:

"+ New Task"

When clicked, show a shadcn Dialog containing a task form.

Create Project Dialog

Create a polished modal using shadcn Dialog.

Fields:

Project Name

Description

Status

Deadline

Buttons:

Cancel

Create Project

Use proper form validation UI.

Create Task Dialog

Fields:

Task Title

Description

Project

Status

Priority

Due Date

Buttons:

Cancel

Create Task

Calendar Page

Create a simple task calendar.

Show tasks based on their due dates.

Include:

Month navigation

Today button

Task indicators

Clicking a task opens its details

Keep the calendar clean and easy to understand.

Settings Page

Create a basic settings interface.

Sections:

Profile

Name

Email

Profile image

Preferences

Theme

Notifications

Account

Change password

Delete account

These should be UI-only with mock interactions.

Task Details

When a user opens a task, show a task details interface containing:

Task title

Description

Project

Status

Priority

Due date

Created date

Also show:

Comments

Create a simple comment UI with:

Comment input

Send button

Comment list

Use mock comments.

Responsive Design

The application must be fully responsive.

Desktop:

Fixed sidebar

Large dashboard

Tables

Tablet:

Collapsible sidebar

Responsive cards

Adjusted grid

Mobile:

Drawer navigation

Single-column cards

Tables should transform into cards or horizontally scroll when necessary

Touch-friendly buttons

No horizontal page overflow

Components

Use reusable components such as:

Sidebar

Header

StatCard

ProjectCard

TaskTable

TaskCard

StatusBadge

PriorityBadge

ProgressBar

ProjectDialog

TaskDialog

EmptyState

SearchInput

FilterDropdown

ConfirmDialog

Keep components modular and reusable.

UX Requirements

Add:

Loading skeletons

Empty states

Hover states

Active navigation states

Form validation states

Delete confirmation dialogs

Toast notifications for mock actions

Accessible buttons and form controls

Keyboard-friendly interactions

Example empty state:

"No projects yet"

"Create your first project to start tracking your work."

Button:

"Create Project"

Mock Data

Use realistic mock data for:

Users

Projects

Tasks

Comments

Activity

Do not hardcode the same UI repeatedly. Store mock data in organized TypeScript files so it can later be replaced with API calls.

Code Quality

Follow these rules:

Use TypeScript properly

Use reusable components

Use shadcn/ui components

Use Tailwind CSS

Use Lucide React icons

Avoid unnecessary dependencies

Keep components clean and maintainable

Use semantic HTML

Make the UI accessible

Avoid excessive client components

Keep the frontend ready for future REST API integration

The frontend should be designed so that later I can replace mock data with API requests from my Express + Prisma + PostgreSQL backend without rebuilding the UI.

Do not implement backend functionality.

The final result should look like a real production SaaS dashboard rather than a basic student CRUD project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/29b9a158-5c8d-4623-be48-087fa706b698).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
