# 🏛️ Monastery Preservation System - AI Analysis Guide

## How the AI Model Detects Affected Areas

### 🧠 Overview
The preservation system uses **Computer Vision** and **Machine Learning** algorithms to analyze structural changes in monastery images over time. It combines **OpenCV**, **SSIM (Structural Similarity Index)**, and **Contour Detection** to identify and highlight areas of deterioration.

---

## 🔬 Technical Process

### 1. **Image Preprocessing**
```
Input: Two images (Baseline & Current)
↓
Resize to standard dimensions (800x600 pixels)
↓
Convert to grayscale for analysis
↓
Apply Gaussian blur (reduces noise)
```

**Why?** Standardizing images ensures accurate pixel-by-pixel comparison.

### 2. **SSIM Algorithm (Structural Similarity Index)**
```python
score, diff_map = ssim(baseline_gray, current_gray, full=True)
```

**What it does:**
- Compares structural information between images
- Returns similarity score: 0 (completely different) to 1 (identical)
- Generates a **difference map** showing changed pixels

**SSIM Score Interpretation:**
- **0.95 - 1.00**: EXCELLENT (minimal changes)
- **0.85 - 0.95**: GOOD (minor changes)
- **0.70 - 0.85**: MODERATE (noticeable changes)
- **0.50 - 0.70**: POOR (significant damage)
- **< 0.50**: CRITICAL (severe deterioration)

### 3. **Contour Detection (Finding Affected Areas)**
```python
# Threshold the difference map
thresh = cv2.threshold(diff_image, 50, 255, THRESH_BINARY_INV)

# Find contours (boundaries of changed regions)
contours = cv2.findContours(thresh, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE)

# Filter significant areas (>50 pixels)
significant_contours = [c for c in contours if cv2.contourArea(c) > 50]
```

**What it detects:**
- **Cracks** in walls
- **Missing** or **damaged** sections
- **Color changes** (water damage, fading)
- **Structural shifts**
- **New additions** or **removed elements**

### 4. **Affected Area Calculation**
```python
total_pixels = image_width × image_height
affected_pixels = count_non_zero(threshold_image)
affected_percentage = (affected_pixels / total_pixels) × 100
```

**Example:**
- Image: 800×600 = 480,000 pixels
- Changed pixels: 24,000
- Affected area: **5%** of monastery

### 5. **Visual Highlighting**
The system creates a **difference image** with:
- 🔴 **Red contours**: Outline each detected change
- 🟡 **Yellow boxes**: Bounding rectangles around affected regions
- 🔴 **Semi-transparent overlay**: Highlights exact changed pixels

---

## 📊 How Report is Generated

### Step 1: Analyze Image Data
```javascript
{
  ssim_score: 0.87,           // 87% similar
  contour_count: 15,          // 15 distinct affected areas
  affected_area: 4.2,         // 4.2% of image affected
  severity: "MODERATE"        // Classification
}
```

### Step 2: Generate Affected Areas List
Based on **contour count** and **locations**, the system generates descriptive names:

```javascript
// Example with 15 contours detected
affectedAreas = [
  "North Wall Section",
  "Roof Section", 
  "Main Entrance",
  "Prayer Hall",
  "East Facade"
]
```

**How it works:**
- Maps contour positions to architectural components
- More contours = more areas listed
- Uses predefined monastery structure vocabulary

### Step 3: Generate Recommendations
Based on **severity level**, AI generates actionable recommendations:

**CRITICAL (SSIM < 0.50):**
```
🚨 URGENT: Immediate on-site inspection required
- Schedule emergency structural assessment
- Document all damage with detailed photography
- Implement temporary protective measures
- Contact heritage conservation authorities
```

**MODERATE (SSIM 0.70-0.85):**
```
📋 ATTENTION: Notable deterioration observed
- Schedule maintenance inspection within 1 month
- Monitor identified areas for progression
- Plan preventive conservation measures
- Document changes for historical records
```

**EXCELLENT (SSIM > 0.95):**
```
✓ STABLE: Excellent preservation condition
- Continue current maintenance protocols
- Conduct annual monitoring assessments
- Maintain photographic documentation
```

### Step 4: Create Visual Report
```
┌─────────────────────────────────────┐
│  SIMILARITY: 87%                    │
│  CHANGES: 15 contours               │
│  SEVERITY: MODERATE                 │
├─────────────────────────────────────┤
│  [Difference Image with highlights] │
├─────────────────────────────────────┤
│  AFFECTED AREAS:                    │
│  • North Wall Section               │
│  • Roof Section                     │
│  • Main Entrance                    │
├─────────────────────────────────────┤
│  RECOMMENDATIONS:                   │
│  1. Schedule inspection...          │
│  2. Monitor identified areas...     │
│  3. Plan conservation measures...   │
└─────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend Analysis (Python)
- **OpenCV**: Image processing and contour detection
- **scikit-image**: SSIM algorithm implementation
- **NumPy**: Mathematical operations
- **Flask**: API server for analysis service

### Integration (Node.js)
- **Express.js**: Backend API
- **Multer**: Image file handling
- **Axios**: Communication with Python service
- **FormData**: Image data transmission

### Frontend (React)
- **React 18**: User interface
- **Base64 encoding**: Display difference images
- **Real-time updates**: Live analysis progress

---

## 🚀 Setup Instructions

### 1. Start Python Analysis Service
```bash
cd Monastery-Preservation/python-service
python -m venv venv
.\venv\Scripts\Activate   # Windows
pip install -r requirements.txt
python app.py
```
**Runs on:** http://localhost:5001

### 2. Start MERN Backend
```bash
cd mern-app/server
npm install
npm run dev
```
**Runs on:** http://localhost:5000

### 3. Start React Frontend
```bash
cd mern-app/client
npm install
npm run dev
```
**Runs on:** http://localhost:5173

---

## 📡 API Flow

```
User uploads images
    ↓
React Frontend (Preservation.jsx)
    ↓
POST /api/preservation/compare (Node.js)
    ↓
POST /api/compare (Python Service)
    ↓
OpenCV + SSIM Analysis
    ↓
Returns: {score, contours, difference_image}
    ↓
Node.js generates recommendations
    ↓
Returns full analysis to React
    ↓
Display results with visualizations
```

---

## 🎯 Accuracy & Reliability

### What the System Can Detect:
✅ **Cracks** and structural damage  
✅ **Missing** pieces or sections  
✅ **Color changes** (weathering, water damage)  
✅ **Deformation** and structural shifts  
✅ **Surface erosion**  
✅ **New damage** since baseline

### Limitations:
⚠️ Requires similar camera angle and lighting  
⚠️ Large perspective differences may affect accuracy  
⚠️ Very small cracks (<5 pixels) may not be detected  
⚠️ Shadows and lighting changes can trigger false positives

### Best Practices:
✓ Use consistent camera position  
✓ Take photos in similar lighting conditions  
✓ Avoid extreme weather (rain, fog, harsh shadows)  
✓ Use high-resolution images (minimum 800x600)  
✓ Keep camera distance consistent

---

## 📈 Example Analysis Output

```json
{
  "success": true,
  "analysis": {
    "ssimScore": 0.873,
    "similarityPercentage": "87.30",
    "changesDetected": 15,
    "deteriorationLevel": "MODERATE",
    "differencePercentage": "12.70",
    "affectedAreaPercentage": "4.20",
    "affectedAreas": [
      "North Wall Section",
      "Roof Section",
      "Main Entrance"
    ],
    "recommendations": [
      "📋 ATTENTION: Notable deterioration observed",
      "Schedule maintenance inspection within 1 month",
      "Monitor identified areas for progressive deterioration"
    ],
    "differenceImage": "base64_encoded_image_data...",
    "changeDetected": true,
    "message": "Structural changes detected. Severity: MODERATE"
  }
}
```

---

## 🔧 Troubleshooting

### Python Service Not Responding
```bash
# Check if service is running
curl http://localhost:5001/health

# Restart service
cd python-service
python app.py
```

### Images Not Comparing
- Ensure both images are uploaded
- Check file size (<10MB each)
- Verify image format (JPEG, PNG, WebP)
- Check Python service status

### Low Accuracy Results
- Use similar camera angles
- Ensure good lighting conditions
- Use higher resolution images
- Reduce perspective differences

---

## 📚 Further Reading

- **SSIM Algorithm**: [Wikipedia](https://en.wikipedia.org/wiki/Structural_similarity)
- **OpenCV Contours**: [OpenCV Docs](https://docs.opencv.org/master/d4/d73/tutorial_py_contours_begin.html)
- **Image Preprocessing**: [OpenCV Tutorials](https://docs.opencv.org/master/d2/d96/tutorial_py_table_of_contents_imgproc.html)

---

## 👥 Support

For technical support or questions:
- Check system health: `/api/preservation/health`
- Review Python service logs
- Verify Node.js server logs
- Check browser console for frontend errors

---

**Last Updated**: December 27, 2025  
**Version**: 1.0.0  
**Technology**: MERN Stack + Python + OpenCV
