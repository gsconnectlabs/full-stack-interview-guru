# CLAUDE_INSTRUCTIONS.md

# FullStackInterviewGuru (FIG)
# Development Instructions for Claude

This document defines the engineering standards for the FullStackInterviewGuru (FIG) project.

Read this document before making any code changes.

Follow these rules unless explicitly instructed otherwise.

---

# Mission

Build one of the world's most trusted interview preparation platforms.

Prioritize

Trust

Performance

Accessibility

Learning Experience

Maintainability

over unnecessary features.

---

# General Rules

Think like

Senior Software Architect

Senior Product Designer

Senior Frontend Engineer

Senior UX Engineer

Senior SEO Engineer

Do not make assumptions.

Always preserve existing functionality.

Never break SEO.

Never redesign simply because something looks better.

Every change must have a measurable benefit.

---

# Development Philosophy

Content First.

Trust First.

Performance First.

Simple is better than complex.

Readable is better than clever.

Consistency is better than creativity.

---

# Tech Stack

Next.js

React

TypeScript

Tailwind CSS

App Router

Modern ES features

Use server components whenever appropriate.

Avoid unnecessary client components.

---

# Code Quality

Write production-ready code.

Never write quick hacks.

Avoid duplicated code.

Prefer reusable components.

Keep components small.

Keep functions focused.

Meaningful variable names.

Strong typing.

No unnecessary comments.

Self-documenting code.

---

# Component Guidelines

Prefer reusable components.

Avoid page-specific duplicated UI.

Examples

QuestionCard

TopicCard

DifficultyBadge

CopyButton

AISection

RelatedQuestions

Breadcrumb

RoadmapCard

ThemeToggle

SearchBox

---

# Folder Structure

/app

Routes

/components

Reusable UI

/lib

Utilities

/hooks

Custom hooks

/types

Type definitions

/constants

Project constants

/public

Images

Icons

Favicons

Manifest

Avoid placing business logic inside pages.

---

# Styling

Use Tailwind CSS.

Avoid inline styles.

Maintain consistent spacing.

Use design tokens.

Prefer utility classes.

Avoid deeply nested class names.

---

# Theme

Default

Light

Support

Dark Mode

using

prefers-color-scheme

Maintain

Teal

Gold

branding.

Dark theme should feel premium.

---

# Typography

Readable.

Large headings.

Comfortable line height.

Proper spacing.

Never reduce readability for aesthetics.

---

# Responsive Design

Mobile First.

Support

Mobile

Tablet

Desktop

Large Desktop

Test all layouts.

Avoid horizontal scrolling.

---

# Accessibility

Keyboard navigation.

Screen reader friendly.

Proper labels.

ARIA where necessary.

Visible focus states.

High contrast.

Semantic HTML.

---

# Performance

Target Lighthouse

95+

Avoid unnecessary JavaScript.

Lazy load images.

Optimize fonts.

Optimize icons.

Avoid unnecessary rerenders.

Use memoization only when beneficial.

---

# SEO Rules

Never change URLs without approval.

Preserve page hierarchy.

Maintain

Q&A Schema

Breadcrumb Schema

Canonical URLs

Meta Tags

Open Graph

Twitter Cards

Meaningful titles.

Meaningful descriptions.

Never reduce crawlability.

---

# Browser Branding

Maintain

FIG

branding.

Support

favicon.ico

SVG favicon

Apple Touch Icon

Android Icons

Manifest

Theme color

Browser title

Examples

FIG – Java Interview Questions

FIG – REST API Interview Questions

FIG – AWS Lambda Interview Questions

---

# Question Page Standards

Every interview page should include

Question

Short Answer

Detailed Explanation

Real-world Example

Interviewer's Expectation

Common Mistakes

Follow-up Questions

Related Questions

Difficulty

Reading Time

Last Updated

Report Issue

Share

Copy Link

Continue Learning with AI

---

# AI Section

Generate prompts for

ChatGPT

Gemini

Claude

Levels

Beginner

Intermediate

Senior Engineer

Architect

Include

Copy Prompt

---

# Internal Linking

Every page should recommend

Prerequisites

Related Topics

Next Topic

Learning Path

Avoid orphan pages.

---

# New Content Priority

Priority 1

Java Collections

Java Concurrency

REST API

Spring Boot

Priority 2

System Design

AWS

SQL

Priority 3

React

Docker

Kubernetes

Behavioral Interviews

---

# Animations

Subtle only.

Fast.

Professional.

No distracting effects.

No excessive motion.

---

# Icons

Use consistent icon library.

Keep icon size consistent.

Avoid decorative icons without purpose.

---

# Error Handling

Provide user-friendly messages.

Never expose stack traces.

Gracefully handle missing content.

---

# Forms

Validate input.

Accessible labels.

Helpful validation messages.

Prevent duplicate submissions.

---

# Security

Escape user input.

Avoid XSS.

Avoid exposing secrets.

Follow Next.js security best practices.

---

# Maintainability

Keep files organized.

Avoid massive components.

Prefer composition.

Prefer reusable utilities.

Avoid tight coupling.

---

# Testing Checklist

Before completing any task

Check

✓ Mobile

✓ Desktop

✓ Dark Theme

✓ Accessibility

✓ Performance

✓ SEO

✓ Broken Links

✓ TypeScript Errors

✓ Build Success

---

# Pull Request Checklist

Before considering work complete

Confirm

✓ No duplicated code

✓ No SEO regression

✓ No accessibility regression

✓ No layout break

✓ Responsive

✓ Dark mode supported

✓ Reusable implementation

✓ Performance maintained

---

# Important Rule

Never remove existing features unless explicitly instructed.

Improve incrementally.

Preserve stability.

Protect SEO.

Protect performance.

---

# Final Goal

When a user opens FIG,

they should immediately feel

"This is the most professional interview preparation platform I have ever used."

Every line of code should contribute toward that goal.

---

## Version Information

- **Version:** 1.0.0
- **Last Updated:** 2026-07-18 23:30 IST
- **Project:** FullStackInterviewGuru (FIG)
- **Status:** Active
- **Owner:** Gurusankar M