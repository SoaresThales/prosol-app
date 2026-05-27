# Pro Sol ERP - Solar Energy Proposal Generator

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A robust backend engine and automated document generator designed for the solar energy sector. This system calculates photovoltaic system requirements based on consumption history and climatic variables, applies commercial pricing rules, and generates highly customized, professional PDF proposals.

**Current Scope Note (v1.0.0):** This initial release is strictly focused on the core engineering calculation engine and the automated PDF generation pipeline. It does not currently include user authentication, a database layer, or a public-facing landing page. It operates as a standalone calculation and document generation service.

## Core Features

* **Engineering Calculation Engine:** Precisely calculates required system power (kWp) and estimated monthly generation (kWh) using localized Peak Sun Hours (HSP) and custom system efficiency factors.
* **Commercial Pricing Logic:** Automatically calculates suggested retail prices applying operational costs and desired profit margins (markup) over wholesale equipment costs.
* **Financial Projections:** Estimates 25-year accumulated savings and calculates Return on Investment (Payback/ROI) based on localized energy tariffs.
* **Headless PDF Generation:** Utilizes Puppeteer running in a headless Linux Docker container to render dynamic Handlebars HTML templates into production-ready PDF documents.
* **Fully Dockerized:** Containerized architecture ensuring consistency across development, testing, and deployment environments without local dependency conflicts.

## Prerequisites

To run this application, you will need the following installed on your machine or server:
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Installation and Setup

### 1. Fork or Clone the Repository

You can fork this repository to your own GitHub account and clone it, or clone it directly:

```bash
git clone [https://github.com/your-username/prosol-erp.git](https://github.com/your-username/prosol-erp.git)
cd prosol-erp