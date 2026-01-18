# 🧪 Testing & Sample Data Guide

Complete guide for testing the KisanMitra system.

---

## 📸 Where to Find Test Images

### Real Soil Health Card Images

1. **Government Sources**
   - Search "Soil Health Card" on Google Images
   - Look for Government of India seal
   - Files: ICAR, NITI Aayog official docs

2. **Sample URLs**
   ```
   - https://shc.nic.in/ (Official SHC portal)
   - ICAR research papers with card images
   - State agriculture department websites
   ```

3. **Create Your Own**
   - Take photo of a real SHC under good lighting
   - Ensure text is clear and readable
   - JPG format, 1-5 MB file size

---

## 🧪 Test Cases

### Test Case 1: Clear English Card
**Expected:** ✅ Extracts all 12 parameters, generates recommendations

**Process:**
1. Find clear SHC image with English text
2. Upload to frontend
3. Verify all parameters extracted
4. Check status indicators (Low/Medium/High)

**Success Criteria:**
- Farmer name extracted
- All 12 parameters visible
- Status indicators show colors
- Advisory section populated

---

### Test Case 2: Handwritten/Hindi Card
**Expected:** ✅ Still extracts key info, some values might be "Unknown"

**Process:**
1. Find SHC with handwritten text or Hindi
2. Upload image
3. Check what was extracted
4. Toggle to Hindi language mode

**Success Criteria:**
- At least farmer name extracted
- Major parameters visible
- Advisory text in Hindi
- System doesn't crash

---

### Test Case 3: Low Quality Image
**Expected:** ⚠️ Partial extraction, some unknowns

**Process:**
1. Take blurry/dark photo of card
2. Upload
3. Check extraction accuracy
4. Note what failed

**Success Criteria:**
- System doesn't crash
- Error handling works
- Clear message to user
- Suggestion to upload better image

---

### Test Case 4: Mobile Device
**Expected:** ✅ Works on phone/tablet

**Process:**
1. Open http://localhost:3000 on phone
2. Test drag-drop (or tap to upload)
3. Upload image from phone camera
4. Verify results display correctly

**Success Criteria:**
- Layout responsive on phone
- Touch-friendly buttons
- Results readable on small screen
- Voice button works

---

### Test Case 5: Multiple Parameters
**Expected:** ✅ All 12 parameters with traffic lights

**Process:**
1. Upload card with all 12 parameters visible
2. Check each parameter card displays:
   - Value
   - Unit
   - Status badge
   - Progress bar

**Success Criteria:**
- All 12 parameter cards visible
- Color coding correct (🔴🟡🟢)
- Progress bars animate
- Layout organized

---

## 🔍 Sample Output Validation

### Valid Response Format

```json
{
  "success": true,
  "data": {
    "farmer_name": "String (not empty)",
    "health_card_id": "String (SHC-YYYY-xxxxx)",
    "test_date": "YYYY-MM-DD format",
    "village": "String",
    "district": "String",
    "parameters": {
      // All should have value, unit, status
      "N": { "value": number, "unit": "kg/ha", "status": "Low|Medium|High" },
      // ... 11 more parameters
    },
    "advisory": {
      "summary": "2+ sentences",
      "fertilizer_recommendation": ["Step 1...", "Step 2...", ...],
      "organic_alternative": "String with suggestion",
      "crop_suggestion": "String with crops"
    }
  }
}
```

### Validation Checklist

- [ ] `success: true`
- [ ] `farmer_name` not "Unknown"
- [ ] `health_card_id` follows SHC format
- [ ] `test_date` in YYYY-MM-DD format
- [ ] All 12 parameters present
- [ ] Each parameter has value, unit, status
- [ ] Status is Low/Medium/High (or pH-specific)
- [ ] Advisory summary is 2+ sentences
- [ ] fertilizer_recommendation is array
- [ ] Each recommendation is actionable step
- [ ] organic_alternative mentions specific dosage

---

## 🚀 Performance Testing

### Load Testing

**Test:** Upload image 5 times in sequence

**Expected:** All complete successfully in 5-15 seconds each

**Metrics to Check:**
- Average response time
- Error rate (should be 0%)
- Backend memory usage
- API quota not exceeded

### Concurrent Testing

**Test:** Upload 2 images simultaneously

**Expected:** Both process without interference

**Metrics:**
- Backend handles parallel requests
- No data mixing
- Both responses correct

---

## 🎯 Feature Testing

### Traffic Light System

| Status | Color | Field | Expected |
|--------|-------|-------|----------|
| Low | 🔴 Red | Parameter card | Shows red background |
| Medium | 🟡 Amber | Parameter card | Shows amber background |
| High | 🟢 Green | Parameter card | Shows green background |

**Test:** Upload card, verify colors match status

---

### Voice Output

**Test:**
1. Click "Play Advisory" button
2. Listen for audio
3. Verify text matches what's spoken
4. Test in both English and Hindi

**Expected:**
- Audio plays immediately
- Clear pronunciation
- Complete advisory read
- No errors

---

### Language Toggle

**Test:**
1. Switch to Hindi
2. Verify button text changes
3. Upload new image
4. Verify advisory in Hindi
5. Switch back to English
6. Verify advisory in English

**Expected:**
- All text switches language
- Gemini responds in requested language
- No functionality broken

---

## 📊 Data Validation

### Soil Parameter Ranges

| Parameter | Min | Max | Unit | Example |
|-----------|-----|-----|------|---------|
| N | 0 | 500 | kg/ha | 200 |
| P | 0 | 100 | kg/ha | 25 |
| K | 0 | 400 | kg/ha | 150 |
| pH | 4 | 9 | - | 7.2 |
| OC | 0 | 3 | % | 0.8 |
| EC | 0 | 5 | dS/m | 1.2 |
| S | 0 | 100 | mg/kg | 30 |
| Zn | 0 | 5 | mg/kg | 1.0 |
| Fe | 0 | 50 | mg/kg | 8 |
| Cu | 0 | 2 | mg/kg | 0.5 |
| Mn | 0 | 20 | mg/kg | 5 |
| B | 0 | 3 | mg/kg | 1.0 |

**Test:** Verify extracted values fall within reasonable ranges

---

## 🐛 Error Handling Testing

### Test: No API Key
**Input:** Upload without API key
**Expected:** Clear error message with instructions

### Test: Invalid API Key
**Input:** Use random/expired key
**Expected:** "Invalid API Key" error, suggest getting new one

### Test: Invalid Image Format
**Input:** Upload text file as image
**Expected:** File validation error, ask for image file

### Test: Blank Image
**Input:** Upload blank/white image
**Expected:** "Could not extract data" message, suggest better image

### Test: Too Large File
**Input:** Upload 15MB image
**Expected:** File size warning, suggest compression

---

## 📱 Mobile Testing Checklist

- [ ] Responsive layout on mobile
- [ ] Touch targets large enough (48px minimum)
- [ ] Text readable on small screen
- [ ] Upload works via file picker
- [ ] Results visible without horizontal scroll
- [ ] Voice button works
- [ ] Language toggle accessible
- [ ] No console errors on mobile

---

## 🌐 Browser Compatibility

### Test on Browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Primary |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ✅ Supported |
| Edge | Latest | ✅ Supported |
| Opera | Latest | ⚠️ May work |

**Test:** Open http://localhost:3000 on each browser

---

## ⚡ Performance Benchmarks

### Optimal Performance
- **Page Load:** < 2 seconds
- **Image Upload:** < 1 second
- **Processing:** 8-12 seconds
- **Results Display:** < 1 second

### Acceptable Performance
- **Image Upload:** 1-3 seconds
- **Processing:** 10-20 seconds
- **Results Display:** 1-2 seconds

### Unacceptable Performance
- **Page Load:** > 5 seconds
- **Processing:** > 30 seconds
- Any crashes or freezes

---

## 🔍 Debug Mode

### Enable Backend Logging

Edit `server/app.py`:
```python
logging.basicConfig(level=logging.DEBUG)
```

Then run:
```bash
python app.py
```

### Frontend Console Logs

Open browser F12:
```javascript
// Check network requests
console.log('API Response:', response);

// Check parameters extraction
console.log('Parameters:', result.data.parameters);
```

---

## 📋 Test Report Template

```markdown
## Test Report - KisanMitra [DATE]

### Environment
- Backend: Running at localhost:5000
- Frontend: Running at localhost:3000
- Browser: Chrome Version X
- OS: Windows/macOS/Linux

### Test Cases Executed
- [ ] Basic upload and analysis
- [ ] Language toggle
- [ ] Voice output
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Performance

### Results Summary
- Total Tests: X
- Passed: X
- Failed: X
- Warnings: X

### Issues Found
1. Issue #1: [Description]
   - Severity: High/Medium/Low
   - Steps to reproduce: ...
   - Workaround: ...

### Performance Metrics
- Average response time: X seconds
- Slowest request: X seconds
- Memory usage: X MB

### Recommendation
[Ready for production / Needs fixes / Under investigation]
```

---

## 🎯 Quick Test Checklist

Before showing to someone:

- [ ] Backend running
- [ ] Frontend running
- [ ] Test image ready
- [ ] API key configured
- [ ] Upload works
- [ ] Results display correctly
- [ ] Traffic lights show correct colors
- [ ] Voice button works
- [ ] Language toggle works
- [ ] No console errors
- [ ] Mobile layout responsive

---

## 📈 Testing Coverage

| Component | Test Cases | Coverage |
|-----------|-----------|----------|
| Upload | 5 | 80% |
| Processing | 10 | 90% |
| Display | 8 | 85% |
| Voice | 3 | 75% |
| Language | 2 | 100% |
| Mobile | 5 | 70% |
| Error Handling | 6 | 85% |

---

## 🚀 Test Data Sets

### Dataset 1: Perfect Cards (High Quality)
- Clear, well-lit images
- All text readable
- All parameters visible
- Expected: 95%+ accuracy

### Dataset 2: Real-World Cards (Medium Quality)
- Some handwriting
- Slight shadows/glare
- Some parameters unclear
- Expected: 70-85% accuracy

### Dataset 3: Challenging Cards (Low Quality)
- Blurry images
- Poor lighting
- Handwritten text
- Missing parameters
- Expected: 40-60% accuracy

---

## ✅ Sign-Off Criteria

System is ready when:
✅ All 12 parameters extract correctly
✅ Traffic lights display correctly
✅ Advisory recommendations make sense
✅ Voice output works
✅ Language toggle works
✅ Mobile responsive
✅ No crashes or errors
✅ Performance acceptable

---

**Testing is complete when you're confident it works! 🎉**

