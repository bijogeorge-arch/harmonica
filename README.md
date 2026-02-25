# Harmonic-style VC Discovery Interface

A premium, modern interface for venture capital firms to discover and track promising startups. This MVP features a robust company discovery table, detailed profile views with live data enrichment, and list management.

## Features

- **Company Discovery**: Search and filter through a mock dataset of high-growth companies.
- **Thesis Match Engine**: Intelligent evaluation of companies against a specific fund thesis with a 0-100 score and automated justification.
- **Explainable AI**: Transparent insights that explain *why* a company matches your investment criteria.
- **Live Enrichment**: Real-time AI-powered scraping and analysis of company websites to extract summaries, capabilities, and strategic signals.
- **List Management**: Create custom lists and save companies for later review.
- **Private Notes**: Maintain internal analysis and thoughts on each company.
- **Caching**: Enriched data is cached locally for instant access on subsequent visits.
- **Keyboard Shortcuts**: Power-user navigation (Esc to back, E to enrich).

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Scraper**: [Jina AI Reader](https://jina.ai/)
- **LLM**: [OpenAI GPT-4o-mini](https://openai.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API Key (required for live enrichment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd harmonic-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   JINA_API_KEY=your_jina_api_key_here (optional)
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### Enrichment API (`/api/enrich`)

- **Method**: `POST`
- **Body**: `{ "url": "string", "id": "string" }`
- **Response**: Returns a structured JSON object containing:
  - `summary`: High-level AI summary of the company.
  - `thesisMatchScore`: 0-100 score evaluating alignment with the Fund Thesis.
  - `matchExplanation`: Detailed justification for the match score.
  - `whatTheyDo`: List of key products/services.
  - `keywords`: Industry-specific keywords.
  - `signals`: Derived business signals (e.g., "High hiring intent").
  - `sources`: URLs scraped with timestamps.

## Deployment (Vercel)

This project is fully optimized for [Vercel](https://vercel.com/new) deployment.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO)

### Manual Deploy

1. **Push your code** to a GitHub repository.
2. **Import the project** at [vercel.com/new](https://vercel.com/new).
3. **Configure Environment Variables** in the Vercel Dashboard → Settings → Environment Variables:

   | Variable | Required | Description |
   |---|---|---|
   | `OPENAI_API_KEY` | Optional | OpenAI API key for live AI enrichment |
   | `JINA_API_KEY` | Optional | Jina AI key for web scraping |
   | `OPENROUTER_API_KEY` | Optional | OpenRouter key (fallback LLM) |

4. **Deploy!** Vercel will auto-detect Next.js and configure everything.

> **Note:** If no API keys are configured, the app will automatically use mock enrichment data for demonstration purposes. This means the app is fully functional even without any API keys.

### Environment Variables

- Copy `.env.example` to `.env.local` for local development
- For production: set environment variables in the Vercel Dashboard
- **Never commit real API keys** to version control

## License

MIT
