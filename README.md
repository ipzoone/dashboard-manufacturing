# Intelligent Manufacturing Dashboard

Modern React dashboard for AI-powered equipment monitoring and predictive maintenance.

## Architecture

```
React Frontend (Port 3000)
        ↓
    Vite Proxy (/api)
        ↓
FastAPI Backend (Port 8000)
        ↓
    ┌───────┴────────┐
    ↓                ↓
Analyzer         ChromaDB RAG
    ↓                ↓
    └────────┬───────┘
             ↓
     EdgeOne Makers LLM
             ↓
    AI Analysis & Recommendations
```

## Features

### ✅ Dashboard View
- Real-time equipment health monitoring
- KPI metrics (Critical count, Incidents, Availability)
- Equipment status cards with anomaly detection
- Historical incident tracking

### ✅ Equipment Analysis
- Full analyzer + RAG + LLM integration
- Detailed signal analysis with trend data
- Engineering knowledge references from RAG
- AI-powered explanations and recommendations
- Historical incident correlation

### ✅ Knowledge Base
- Semantic search across technical documentation
- Filter by failure mode
- Source citation with document + page number
- 1583 chunks from 6 PDF documents

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Lucide React (icons)
- CSS Modules

**Backend:**
- FastAPI (Python)
- ChromaDB (vector database)
- Sentence Transformers (embeddings)
- EdgeOne Makers (LLM)

## Prerequisites

**Backend:**
- Python 3.10+
- Backend running on `http://127.0.0.1:8000`
- RAG system ingested (1583 chunks)

**Frontend:**
- Node.js 18+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify Backend is Running

```bash
curl http://127.0.0.1:8000/
# Should return: {"name":"Intelligent Manufacturing AI","status":"running","version":"1.0.0"}

curl http://127.0.0.1:8000/rag/health
# Should return: {"status":"ok","collection":"engineering_knowledge","chunks":1583}
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## API Proxy

Vite proxy configuration (`vite.config.ts`):

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

All requests to `/api/*` are proxied to backend `http://127.0.0.1:8000/*`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure

```
hackathon_manufacturing/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Equipment overview
│   │   ├── Dashboard.css
│   │   ├── Equipment.tsx       # Full analysis page
│   │   ├── Equipment.css
│   │   ├── Knowledge.tsx       # RAG search
│   │   └── Knowledge.css
│   ├── api.ts                  # Backend API client
│   ├── types.ts                # TypeScript types
│   ├── App.tsx                 # Main app with routing
│   ├── App.css
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Equipment List

Dashboard monitors 5 equipment:

1. **PU-2101B** - Pump (Mechanical Seal Leakage)
2. **KO-3201** - Compressor (Bearing Distress)
3. **PM-4405B** - Pump Motor (Motor Bearing Overheating)
4. **HE-3301** - Heat Exchanger (Fouling)
5. **BL-5702** - Blower (Coupling Misalignment)

## API Endpoints Used

**Equipment:**
- `GET /equipment` - Get equipment list
- `POST /analyze` - Analyze equipment (analyzer only)
- `POST /analyze-with-llm` - Full analysis (analyzer + RAG + LLM)

**RAG:**
- `GET /rag/health` - Check RAG system status
- `POST /rag/query` - Query engineering knowledge

## Design System

**Color Palette:**
```css
--bg-primary: #0a0e14        /* Dark background */
--bg-secondary: #151a23      /* Card background */
--bg-tertiary: #1a2030       /* Input background */
--border-color: #2a3441      /* Borders */

--text-primary: #e6e8eb      /* Primary text */
--text-secondary: #9ca3af    /* Secondary text */
--text-muted: #6b7280        /* Muted text */

--status-normal: #10b981     /* Green - Normal */
--status-alarm: #f59e0b      /* Amber - Warning */
--status-critical: #ef4444   /* Red - Critical */

--accent-blue: #3b82f6       /* Primary accent */
--accent-cyan: #06b6d4       /* Secondary accent */
```

**Typography:**
- System font stack
- Courier New for equipment tags
- Status badges: uppercase, tracking

**UI Principles:**
- Industrial dark theme
- Dense but readable
- Clear status indicators
- Minimal borders
- Professional technical aesthetic

## Usage Examples

### Dashboard
1. Open `http://localhost:3000`
2. View equipment health overview
3. See KPI metrics and critical counts
4. Click equipment cards for details

### Equipment Analysis
1. Navigate to "Equipment Analysis"
2. Select equipment (e.g., BL-5702)
3. Choose analysis mode (failure/current)
4. Click "Run Analysis"
5. View:
   - Equipment status
   - Signal analysis with trends
   - RAG engineering references
   - Historical incidents
   - LLM recommendations

### Knowledge Base
1. Navigate to "Engineering Knowledge"
2. Enter search query (e.g., "vibration analysis bearing fault")
3. Optional: Filter by failure mode
4. Click "Search Knowledge Base"
5. View results with source citation

## LLM Integration

EdgeOne Makers LLM is configured in backend `.env`:

```env
LLM_ENABLED=true
LLM_BASE_URL=https://ai-gateway.edgeone.link/v1
LLM_API_KEY=sk-***
LLM_MODEL=@makers/deepseek-v4-flash
```

**Security:** API key is only used by backend, never exposed to frontend.

## Troubleshooting

### Backend not responding
```bash
# Check backend status
curl http://127.0.0.1:8000/rag/health

# Restart backend
cd ~/Downloads/manufacturing_ai_v1
uvicorn app.main:app --reload
```

### CORS errors
Backend should have CORS enabled. Check `app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- --port 3001
```

## Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
# Serve with any static server
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Contact

For questions or support, contact the development team.
