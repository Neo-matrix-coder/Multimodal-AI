<div align="center">

# ⚖️ Multimodal AI

### Legal help for the disputes nobody has time to fight.

<a href="https://readme-typing-svg.demolab.com">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=18&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=AI-powered+legal+assistance+for+India;Fast+Chat+%2B+4-Agent+Deep+Research;Traffic+challans+%C2%B7+MRP+%C2%B7+Refunds+%C2%B7+Consumer+disputes" alt="Typing animation" />
</a>

<br/>

![Version](https://img.shields.io/badge/version-v1.1-22c55e?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js)
![Gemini](https://img.shields.io/badge/Gemini_2.5-Vertex_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Agents](https://img.shields.io/badge/4--Agent-Deep_Research-8b5cf6?style=for-the-badge)

[**Overview**](#-overview) · [**Modes**](#-two-modes) · [**Agents**](#-deep-research-the-4-agent-team) · [**Features**](#-features) · [**Architecture**](#-architecture) · [**Quick Start**](#-quick-start) · [**Roadmap**](#-roadmap)

</div>

---

## 🎯 Overview

Fighting a ₹1,000 challan or a ₹5,000 refund denial in India costs more in time, money, and paperwork than it's worth. So people give up, and unfair practices go unchallenged.

**Justice AI is the first layer of legal defense.** It tells you your rights, whether your case is winnable, and exactly what to do next, grounded in Indian law.

| 🚦 Traffic Challans | 🏷️ MRP Overcharging | 🛒 E-commerce Refunds | 📋 Consumer Grievances |
|:---:|:---:|:---:|:---:|
| Motor Vehicles Act | Legal Metrology Act | Consumer Protection Act | NCH · eDaakhil |

---

## 🔀 Two Modes

Two independent sessions on a shared database, OCR, and LLM stack. Deep Research was added without touching Normal Chat's code path.

| | 💬 **Normal Chat** | 🧠 **Deep Research** |
|---|---|---|
| **Think of it as** | A quick consult | A full legal brief |
| **Speed** | < 1 s to first token | 15–40 s |
| **Pipeline** | RAG → Gemini → answer (single pass) | 4 agents in a verify loop |
| **Output** | Conversational answer | Structured report |
| **Citations** | Inline cards | Expandable panel |
| **Confidence score** | — | 🟢🟡🔴 traffic light |
| **Agent trace** | — | Full step-by-step log |
| **Auto-retry** | — | Up to 2 passes if weak |
| **Best for** | *"Is my challan valid?"* | *"Give me a complete legal analysis."* |

---

## 🤖 Deep Research: The 4-Agent Team

Four agents work like a small law firm.

```mermaid
flowchart TD
    Q([User question]) --> O
    O["🧠 Orchestrator<br/><sub>detects category, runs the loop</sub>"] --> R
    R["🔍 Research Agent<br/><sub>top_k=8 · score ≥ 0.55</sub>"] --> A
    A["⚖️ Analysis Agent<br/><sub>5,000-token thinking · cites [N]</sub>"] --> V
    V{"✅ Verifier<br/><sub>score 0–1</sub>"}
    V -- "confidence ≥ 0.6" --> F([Final report + citations + score])
    V -- "< 0.6 (max 2 passes)" --> R
```

| Agent | Role | What it does |
|---|---|---|
| 🧠 **Orchestrator** | The Manager | Detects the legal category, runs the research → analyze → verify loop, orders retries, and attaches a disclaimer if confidence stays low. |
| 🔍 **Research** | The Librarian | Searches the vector store with wider settings than Normal Chat (top_k 8 vs 3, threshold 0.55 vs 0.65) and returns ranked chunks. |
| ⚖️ **Analysis** | The Lawyer | Gemini 2.5 Flash with a 5,000-token thinking budget. Writes a 5-section report: *Issue Summary · Win Probability · Applicable Law · Action Plan · Caveats*. Every claim is tied to a source `[N]`. |
| ✅ **Verifier** | The Checker | Grades the draft on three dimensions and computes a weighted confidence score. Below 0.6, the draft goes back for another pass. |

**Verifier scoring**

| Dimension | Weight | Question it answers |
|---|:---:|---|
| Retrieval | 30% | Were the right legal sources used? |
| Citation | 45% | Do claims actually match their sources? |
| Reasoning | 25% | Is the legal logic internally consistent? |

**Confidence traffic light**

| Score | Badge | Meaning |
|:---:|:---:|---|
| ≥ 0.80 | 🟢 High | Well-sourced, citation-verified |
| 0.60 – 0.79 | 🟡 Medium | Mostly sourced, minor gaps |
| < 0.60 | 🔴 Low | Disclaimer added. Consult a lawyer. |

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 💬 Chat
- **Normal Chat:** streaming RAG Q&A, single LLM call
- **Deep Research:** verified, structured legal report
- **Source attribution:** every answer is flagged `corpus`, `web_fallback`, or `greeting`
- **Citation cards:** claims mapped to specific Acts and sections

</td>
<td width="50%" valign="top">

### 🎙️ Voice & 📄 OCR
- **Nyay Voice AI:** bilingual (English/Hindi) real-time consultation with Neural2 voices (`en-IN-Neural2-B`, `hi-IN-Neural2-C`)
- **OCR ingestion:** upload challans, bills, invoices; Gemini 2.0 Vision extracts text, then a parser pulls out fine amounts, section numbers, and merchant names

</td>
</tr>
<tr>
<td valign="top">

### 🔒 Platform
- Google OAuth + email/password (NextAuth.js, PostgreSQL)
- Dark-mode SaaS dashboard with case cards and quick actions

</td>
<td valign="top">

### 🛡️ Trust by design
- LLM used as a synthesis engine over retrieved text, not as a legal oracle
- Confidence-gated output with automatic disclaimers

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TD
    classDef fe fill:#3b82f6,stroke:#1d4ed8,color:#fff;
    classDef be fill:#10b981,stroke:#047857,color:#fff;
    classDef ag fill:#8b5cf6,stroke:#5b21b6,color:#fff;
    classDef db fill:#f59e0b,stroke:#b45309,color:#fff;
    classDef ai fill:#6366f1,stroke:#3730a3,color:#fff;

    subgraph Frontend["Frontend · Next.js"]
        UI[Normal Chat]:::fe
        DR[Deep Research]:::fe
        VO[Voice AI]:::fe
        OC[OCR Upload]:::fe
        AU[NextAuth.js]:::fe
    end

    subgraph Backend["Backend · FastAPI"]
        CA["/api/chat"]:::be
        DA["/api/deep-research"]:::be
        OS[OCR Service]:::be
        VR[Voice Router]:::be
        RAG[RAG Pipeline]:::be
        VS[Vector Store]:::be
        subgraph Agents["4-Agent System"]
            Or[Orchestrator]:::ag --> Re[Research]:::ag --> An[Analysis]:::ag --> Ve[Verifier]:::ag
        end
    end

    subgraph Data["Databases"]
        PG[(PostgreSQL<br/>users & auth)]:::db
        SQ[(SQLite<br/>legal corpus)]:::db
    end

    subgraph AI["AI Providers"]
        VX[Vertex AI · Gemini 2.5]:::ai
        GV[Gemini 2.0 Vision]:::ai
        GC[Google Cloud STT/TTS]:::ai
        GQ[Groq · Llama 3.3]:::ai
    end

    UI --> CA --> RAG --> VS --> SQ
    RAG --> VX
    RAG -.fallback.-> GQ
    DR --> DA --> Or
    Re --> VS
    An --> VX
    Ve -.retry.-> Re
    VO <--> VR <--> GC
    OC --> OS --> GV
    AU --> PG
```

<details>
<summary><b>🧱 Tech stack</b></summary>

<br/>

**Frontend**

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, file-based routing, API proxy |
| Language | TypeScript + React | Type safety, reusable components |
| Styling | Tailwind CSS (dark theme) | Fast custom design system |
| Auth | NextAuth.js v4 | Google OAuth + credentials, JWT sessions |
| Motion | Framer Motion | Transitions, agent stepper |

**Backend**

| Layer | Choice | Why |
|---|---|---|
| API | FastAPI (Python) | Async, fast, auto-generated docs |
| Auth DB | PostgreSQL | Relational integrity for users |
| Vector DB | SQLite (`legal_resources.db`) | Portable, zero-config, fast reads |
| Agents | Custom Python classes | Modular, testable, independently replaceable |

</details>

<details>
<summary><b>🧠 AI & LLM stack</b></summary>

<br/>

**Model routing (automatic fallback)**

```
Request ─► 1. Vertex AI (GCP ADC)             gemini-2.5-flash
        ─► 2. Google AI Studio (API key)      gemini-2.5-flash
        ─► 3. Groq                            llama-3.3-70b-versatile
```

**Dynamic thinking budget**

| Use case | Budget | Why |
|---|---:|---|
| Normal Chat answer | 2,000 | Solid reasoning, still fast |
| Deep Research analysis | 5,000 | Maximum depth for a full report |
| Verifier grading | 0 | Lightweight classification, speed |
| Greeting / generic | 0 | No reasoning needed |

**Embeddings**

| Priority | Model | Dims |
|---|---|---:|
| Primary | `text-embedding-004` (Vertex AI) | 768 |
| Fallback | `text-embedding-004` (AI Studio) | 768 |
| Fallback | OpenAI `text-embedding-3-small` | 1536 |
| Offline | Token-hash bag-of-words (no API) | 384 |

**Other services:** OCR via `gemini-2.0-flash` · STT via browser Web Speech API, falling back to Google Cloud STT · TTS via Google Cloud TTS.

</details>

<details>
<summary><b>🔍 RAG pipeline (Normal Chat)</b></summary>

<br/>

```mermaid
flowchart LR
    Q[Query] --> E[Embed<br/>text-embedding-004] --> S[Vector search<br/>SQLite] --> T{score ≥ 0.65?}
    T -- yes --> C[Inject context]
    T -- no --> W["Inject 'limited context' warning"]
    C --> G[Gemini 2.5 Flash<br/>thinking 2000]
    W --> G
    G --> R["Response + source_type + citations[]"]
```

**Design decisions**
- **No CRAG.** LLM-based document grading added 3–5 s per turn and broke the UX, so we use score-threshold filtering.
- **SQLite over Pinecone/Milvus.** Zero ops at the current corpus size.
- **Source attribution.** Users should know whether the AI cited a real law or is guessing.

Deep Research uses the same vector store with wider parameters (top_k=8, threshold=0.55).

</details>

<details>
<summary><b>📚 Data sources & 🗄️ database design</b></summary>

<br/>

**Verified Indian sources only:** India Code (Motor Vehicles Act, Consumer Protection Act, Legal Metrology Act) · Indian Kanoon · Supreme Court & High Court portals · NCH & eDaakhil.

| Database | Stores | Why |
|---|---|---|
| **SQLite** `legal_resources.db` | Corpus chunks, embeddings, metadata | Portable, read-heavy |
| **PostgreSQL** `justiceai` | Users, sessions, auth tokens | Concurrent writes, integrity |

</details>

<details>
<summary><b>🧗 Challenges solved & 💡 key learnings</b></summary>

<br/>

| Challenge | Problem | Fix |
|---|---|---|
| CRAG latency | +3–5 s per turn | Score-threshold filtering |
| Legal hallucination | Invented section numbers | Strict prompts + confidence-gated output |
| Retrieval quality | Chunking split legal context | Custom chunking + metadata tags |
| OCR accuracy | Mixed Hindi/English PDFs | Gemini 2.0 Vision with structured JSON |
| STT reliability | Empty transcripts on short clips | 1 KB guard, echo cancellation, mono capture |
| Answer reliability | No trust signal | 3-dimension Verifier + retry loop |

**Learnings**
1. **Speed is a feature.** A 90%-accurate answer in 1 s beats a 95% one in 15 s.
2. **Modular agents beat monoliths.** Each can be swapped without touching the rest.
3. **Constrain the LLM.** Synthesize over verified text; never treat it as a legal oracle.
4. **Two sessions, not one.** One UX can't serve both quick questions and serious analysis.
5. **Show confidence.** A legal AI that hides its uncertainty is dangerous.

</details>

---

## 🚀 Quick Start

**Prerequisites:** Python 3.10+ · Node.js 18+ · PostgreSQL · a GCP account *or* a `GEMINI_API_KEY`

### 1. Configure environment

<table>
<tr><th><code>backend/.env</code></th><th><code>frontend/.env.local</code></th></tr>
<tr>
<td>

```env
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
# Optional: use GCP ADC instead
# gcloud auth application-default login
```

</td>
<td>

```env
NEXTAUTH_SECRET=long_random_string
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
DATABASE_URL=postgresql://postgres:password@localhost:5432/justiceai
```

</td>
</tr>
</table>

For GCP voice and Vertex AI:
`gcloud services enable speech.googleapis.com texttospeech.googleapis.com aiplatform.googleapis.com`

### 2. Create the database

```bash
createdb -U postgres justiceai   # users table auto-creates on first login
```

### 3. Run

**Windows one-click:** double-click `start-dev.bat`

**Manual:**

```bash
# Backend
cd backend
python -m venv venv && venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### 4. Open

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| Normal Chat | http://localhost:3000/chat |
| Deep Research | http://localhost:3000/deep-research |
| Voice AI | http://localhost:3000/voice |
| OCR | http://localhost:3000/ocr |
| API docs | http://localhost:8000/docs |

---

## 🔮 Roadmap

- [x] RAG chat with streaming
- [x] OCR uploads (challans, invoices)
- [x] Bilingual voice AI
- [x] Source attribution
- [x] 4-agent Deep Research
- [x] Verifier confidence scores
- [ ] Complaint generator (auto-draft NCH / eDaakhil notices)
- [ ] Case success prediction (ML on historical judgements)
- [ ] Filing agent (submit to consumer forums)
- [ ] Docker + GCP deployment with Pinecone/Milvus

---

<details>
<summary><b>📁 Project structure</b></summary>

```text
Justice-AI/
├── backend/
│   ├── agents/                  # 4-agent Deep Research system
│   │   ├── orchestrator_agent.py
│   │   ├── research_agent.py
│   │   ├── analysis_agent.py
│   │   └── verifier_agent.py
│   ├── rag/                     # Pipelines, vector store, embeddings
│   │   ├── crag_pipeline.py
│   │   ├── vector_store.py
│   │   └── embeddings.py
│   ├── routers/                 # chat · deep_research · ocr · voice
│   ├── ocr/                     # OCR service + metadata parser
│   ├── scraper/                 # Data ingestion, PDF processor
│   ├── data/                    # SQLite DB + raw corpus
│   └── main.py
├── frontend/src/
│   ├── app/                     # chat · deep-research · voice · ocr · dashboard · api
│   └── components/              # deep-research · chat · shared · voice
├── documents/                   # Legal PDFs and references
├── start-dev.bat
├── README.md
└── TROUBLESHOOTING.md
```

</details>

---

<div align="center">

**Built to bridge the justice gap in India.** ⚖️ 🇮🇳

<sub>Justice AI provides legal information, not legal advice. For serious matters, consult a qualified lawyer.</sub>

</div>
