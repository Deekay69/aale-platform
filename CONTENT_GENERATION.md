# Hybrid Content Generation Guide

## 🤖 AI Content Generation (Recommended)

### Setup
1. Get a free Gemini API key: https://makersuite.google.com/app/apikey
2. Set environment variable:
   ```powershell
   $env:GEMINI_API_KEY="your-key-here"
   ```

### Generate Lessons
```bash
# Generate 20 CBC-aligned Kenyan lessons
node apps/backend/scripts/generate-ai-content.js 20

# Generate 50 lessons
node apps/backend/scripts/generate-ai-content.js 50
```

**Benefits:**
- ✅ Culturally relevant (matatus, shillings, Kenyan context)
- ✅ CBC curriculum-aligned
- ✅ High quality, diverse questions
- ✅ Free tier: 60 requests/minute

---

## 🌍 External API Content

### Fetch from Educational APIs
```bash
node apps/backend/scripts/fetch-external-content.js
```

**Sources:**
- Oak National Academy (UK curriculum) - Free
- African Storybook Initiative - Free, African-focused

---

## 🎯 Recommended Workflow

1. **Start with AI** (Fast, customized):
   ```bash
   $env:GEMINI_API_KEY="your-key"
   node apps/backend/scripts/generate-ai-content.js 50
   ```

2. **Supplement with APIs** (Diversity):
   ```bash
   node apps/backend/scripts/fetch-external-content.js
   ```

3. **Teacher Review** (Phase 2):
   - Build Teacher Dashboard
   - Let teachers edit AI-generated content
   - Teachers create custom lessons

---

## 📊 Cost Estimate

**Gemini API (Recommended):**
- Free tier: 60 requests/min
- 500 lessons = ~$0 (within free tier)
- 10,000 lessons = ~$5

**Alternative: GPT-4:**
- 500 lessons = ~$10
- Higher quality, higher cost

---

## 🚀 Quick Start

```powershell
# 1. Install dependencies
npm install @google/generative-ai --workspace=apps/backend

# 2. Get API key
# Visit: https://makersuite.google.com/app/apikey

# 3. Generate content
$env:GEMINI_API_KEY="your-key-here"
$env:DATABASE_URL="your-railway-url"
node apps/backend/scripts/generate-ai-content.js 30
```
