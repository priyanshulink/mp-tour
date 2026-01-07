import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import preservationAPI from '../services/preservationAPI';

const Preservation = () => {
  const [activeTab, setActiveTab] = useState('baseline');
  const [baselineFile, setBaselineFile] = useState(null);
  const [baselinePreview, setBaselinePreview] = useState(null);
  const [comparisonFile, setComparisonFile] = useState(null);
  const [comparisonPreview, setComparisonPreview] = useState(null);
  const [baselineName, setBaselineName] = useState('');
  const [baselineLocation, setBaselineLocation] = useState('');
  const [structureComponent, setStructureComponent] = useState('');
  const [captureDate, setCaptureDate] = useState('');
  const [cameraDetails, setCameraDetails] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [baselineList, setBaselineList] = useState([]);
  const [selectedBaseline, setSelectedBaseline] = useState(null);
  const [showBaselineDropdown, setShowBaselineDropdown] = useState(false);

  // Check system health on mount and load baselines
  useEffect(() => {
    checkSystemHealth();
    loadBaselines();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Load saved baselines from localStorage
  const loadBaselines = () => {
    const saved = localStorage.getItem('savedBaselines');
    if (saved) {
      setBaselineList(JSON.parse(saved));
    } else {
      setBaselineList([]);
    }
  };

  const checkSystemHealth = async () => {
    try {
      const health = await preservationAPI.checkHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  // Handle baseline image selection
  const handleBaselineSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBaselineFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaselinePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle comparison image selection
  const handleComparisonSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComparisonFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComparisonPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload baseline image
  const handleBaselineUpload = async () => {
    if (!baselineFile || !baselineLocation || !structureComponent) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Create new baseline object
    const newBaseline = {
      id: Date.now(),
      name: baselineLocation + ' - ' + structureComponent,
      location: baselineLocation,
      structure: structureComponent,
      filename: baselineFile.name,
      fileSize: (baselineFile.size / 1024).toFixed(2) + ' KB',
      captureDate: captureDate || new Date().toISOString().split('T')[0],
      camera: cameraDetails,
      notes: additionalNotes,
      // Don't store preview or file in the saved list to avoid quota issues
    };
    
    // Add to baseline list (with preview for current session)
    const displayBaseline = {
      ...newBaseline,
      preview: baselinePreview,
      file: baselineFile
    };
    setBaselineList([...baselineList, displayBaseline]);
    
    // Save to localStorage WITHOUT preview data to avoid quota issues
    try {
      const savedList = [...baselineList, newBaseline];
      localStorage.setItem('savedBaselines', JSON.stringify(savedList));
      setUploadStatus('✓ Baseline image saved successfully!');
    } catch (error) {
      console.error('LocalStorage error:', error);
      setUploadStatus('✓ Baseline recorded (preview not persisted)');
    }
    
    setLoading(false);
    
    // Auto-switch to comparison tab
    setTimeout(() => {
      setActiveTab('comparison');
      setUploadStatus('');
    }, 1500);
  };

  // Clear baseline form
  const handleClearForm = () => {
    setBaselineFile(null);
    setBaselinePreview(null);
    setBaselineName('');
    setBaselineLocation('');
    setStructureComponent('');
    setCaptureDate('');
    setCameraDetails('');
    setAdditionalNotes('');
    setUploadStatus('');
  };

  // Handle baseline selection from dropdown
  const handleBaselineSelection = (baseline) => {
    setSelectedBaseline(baseline);
    setBaselineName(baseline.name);
    setBaselineLocation(baseline.location);
    setStructureComponent(baseline.structure);
    // Note: Preview and file may not be available for previously saved baselines
    if (baseline.preview) {
      setBaselinePreview(baseline.preview);
    } else {
      setBaselinePreview(null);
    }
    if (baseline.file) {
      setBaselineFile(baseline.file);
    } else {
      setBaselineFile(null);
    }
    setShowBaselineDropdown(false);
  };

  // Perform comparison
  const handleComparison = async () => {
    if (!comparisonFile) {
      alert('Please upload a comparison image');
      return;
    }

    if (!baselineFile) {
      alert('The selected baseline was loaded from saved data and the image file is no longer available. Please go to the "Upload Baseline" tab and upload the baseline image again to create a fresh baseline, then return here to compare.');
      return;
    }

    setLoading(true);
    setUploadStatus('🔍 Analyzing images with OpenCV + SSIM algorithm...');

    try {
      // Call real Python service API
      const result = await preservationAPI.compareImages(
        baselineFile,
        comparisonFile,
        {
          monasteryName: baselineName,
          location: baselineLocation
        }
      );

      if (result.success) {
        const analysis = result.analysis;
        
        // Transform API response to component format
        const transformedResult = {
          ssimScore: analysis.ssimScore,
          similarityPercentage: analysis.similarityPercentage,
          changesDetected: analysis.changesDetected,
          deteriorationLevel: analysis.deteriorationLevel,
          differencePercentage: analysis.differencePercentage,
          affectedAreaPercentage: analysis.affectedAreaPercentage,
          affectedAreas: analysis.affectedAreas,
          recommendations: analysis.recommendations,
          differenceImage: analysis.differenceImage,
          changeDetected: analysis.changeDetected,
          message: analysis.message,
          metadata: analysis.metadata
        };
        
        setComparisonResult(transformedResult);
        setUploadStatus('✓ Analysis complete! Click Results tab to view.');
        setTimeout(() => {
          setActiveTab('results');
          setUploadStatus('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Comparison error:', error);
      setUploadStatus('');
      
      if (error.message.includes('SERVICE_UNAVAILABLE')) {
        alert('⚠️ Python Analysis Service is offline.\n\nPlease start the Python service:\n1. Navigate to: Monastery-Preservation/python-service\n2. Run: python app.py\n3. Ensure it runs on port 5001');
      } else {
        alert('❌ Analysis failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '40px',
            borderRadius: '15px',
            marginBottom: '40px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', marginBottom: '15px' }}>
              🏛️ Monastery Preservation System
            </h1>
            <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
              AI-powered image comparison and analysis for monastery preservation
            </p>
            
            {/* System Health Indicator */}
            {systemHealth && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                padding: '10px 20px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: systemHealth.backend === 'online' ? '#4CAF50' : '#f44336'
                  }}></div>
                  Backend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: systemHealth.pythonService === 'online' ? '#4CAF50' : '#f44336'
                  }}></div>
                  AI Service
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('baseline')}
              style={{
                padding: '15px 30px',
                background: activeTab === 'baseline' ? '#667eea' : 'white',
                color: activeTab === 'baseline' ? 'white' : '#333',
                border: `2px solid ${activeTab === 'baseline' ? '#667eea' : '#ddd'}`,
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'baseline' ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
              }}
            >
              📷 Upload Baseline
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              style={{
                padding: '15px 30px',
                background: activeTab === 'comparison' ? '#667eea' : 'white',
                color: activeTab === 'comparison' ? 'white' : '#333',
                border: `2px solid ${activeTab === 'comparison' ? '#667eea' : '#ddd'}`,
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'comparison' ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
              }}
            >
              🔍 Comparison
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!comparisonResult}
              style={{
                padding: '15px 30px',
                background: activeTab === 'results' ? '#667eea' : 'white',
                color: activeTab === 'results' ? 'white' : '#333',
                border: `2px solid ${activeTab === 'results' ? '#667eea' : '#ddd'}`,
                borderRadius: '25px',
                cursor: comparisonResult ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '16px',
                transition: 'all 0.3s',
                opacity: comparisonResult ? 1 : 0.5,
                boxShadow: activeTab === 'results' ? '0 4px 12px rgba(102,126,234,0.3)' : 'none'
              }}
            >
              📊 Results {comparisonResult && '•'}
            </button>
          </div>

          {/* Baseline Upload Section */}
          {activeTab === 'baseline' && (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
                  📊 Upload Baseline Image
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                  Upload a reference image that will serve as the baseline for future comparisons. This should be a high-quality image of the structure in its current state.
                </p>
                <div style={{
                  background: '#e3f2fd',
                  border: '1px solid #90caf9',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#1976d2',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
                  <div>
                    <strong>Note:</strong> Baseline metadata is saved locally, but image previews are session-only to prevent storage quota issues. You'll need to re-upload images for comparison in future sessions.
                  </div>
                </div>
              </div>

              {/* Baseline Image Upload */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Baseline Image
                </label>
                <div
                  onClick={() => document.getElementById('baselineFileInput').click()}
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fafafa',
                    transition: 'all 0.3s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f8f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.background = '#fafafa';
                  }}
                >
                  {!baselinePreview ? (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
                      <div style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                        Click to select <span style={{ color: '#667eea', fontWeight: 'bold' }}>baseline</span> image
                      </div>
                      <div style={{ color: '#999', fontSize: '13px' }}>
                        JPG, PNG, or HTML (Max 10MB)
                      </div>
                    </>
                  ) : (
                    <img
                      src={baselinePreview}
                      alt="Baseline preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
                <input
                  id="baselineFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleBaselineSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Location & Structure Details */}
              <div style={{
                background: '#f9f9f9',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '30px',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
                  Location & Structure Details
                </h3>
                
                {/* Two Column Layout */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {/* Left Column */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Location <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={baselineLocation}
                      onChange={(e) => setBaselineLocation(e.target.value)}
                      placeholder="e.g., Main Hall, East Wing"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>
                      The building or area name
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Structure Component <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={structureComponent}
                      onChange={(e) => setStructureComponent(e.target.value)}
                      placeholder="e.g., North Wall, Ceiling"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>
                      Specific structural element
                    </div>
                  </div>

                  {/* Capture Date */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Capture Date
                    </label>
                    <input
                      type="date"
                      value={captureDate}
                      onChange={(e) => setCaptureDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>
                      When was this photo taken?
                    </div>
                  </div>

                  {/* Camera Details */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Camera Details
                    </label>
                    <input
                      type="text"
                      value={cameraDetails}
                      onChange={(e) => setCameraDetails(e.target.value)}
                      placeholder="e.g., Canon EOS 5D, iPhone 13"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>
                      Camera model used
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                    Additional Notes
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional observations or context about this baseline image..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>
                    Optional weather conditions, lighting, restoration work, etc
                  </div>
                </div>
              </div>

              {uploadStatus && (
                <div style={{
                  padding: '15px',
                  background: uploadStatus.includes('✓') ? '#d4edda' : '#fff3cd',
                  border: `1px solid ${uploadStatus.includes('✓') ? '#c3e6cb' : '#ffc107'}`,
                  borderRadius: '8px',
                  marginBottom: '20px',
                  color: uploadStatus.includes('✓') ? '#155724' : '#856404'
                }}>
                  {uploadStatus}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleClearForm}
                  style={{
                    padding: '12px 30px',
                    background: 'white',
                    color: '#666',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#999';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#ddd';
                  }}
                >
                  Clear Form
                </button>
                <button
                  onClick={handleBaselineUpload}
                  disabled={loading || !baselineFile || !baselineLocation || !structureComponent}
                  style={{
                    padding: '12px 30px',
                    background: loading || !baselineFile || !baselineLocation || !structureComponent ? '#ccc' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading || !baselineFile || !baselineLocation || !structureComponent ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && baselineFile && baselineLocation && structureComponent) {
                      e.currentTarget.style.background = '#5568d3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && baselineFile && baselineLocation && structureComponent) {
                      e.currentTarget.style.background = '#667eea';
                    }
                  }}
                >
                  <span>💾</span>
                  <span>{loading ? 'Saving...' : 'Save Baseline Image'}</span>
                </button>
              </div>

              {/* Best Practices Section */}
              <div style={{
                background: '#e8f4fd',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '30px',
                border: '1px solid #b3d9f2'
              }}>
                <h4 style={{ color: '#1976d2', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💡 Best Practices
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '13px', lineHeight: '1.8' }}>
                  <li>Use high-resolution images (minimum 2MP recommended)</li>
                  <li>Ensure good lighting and minimal shadows</li>
                  <li>Capture from a consistent angle for accurate comparison</li>
                  <li>Include reference objects for scale if possible</li>
                  <li>Avoid extreme close-ups or wide shots</li>
                </ul>
              </div>
            </div>
          )}

          {/* Comparison Section */}
          {activeTab === 'comparison' && (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
                  🔍 Comparison & Analysis
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Select a baseline image and upload current image to detect structural changes over time.
                </p>
              </div>

              {/* Select Baseline Dropdown */}
              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Select Baseline
                </label>
                <div
                  onClick={() => setShowBaselineDropdown(!showBaselineDropdown)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer',
                    color: selectedBaseline ? '#333' : '#999',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{selectedBaseline ? selectedBaseline.name : 'Select a baseline image'}</span>
                  <span style={{ transform: showBaselineDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                    ▼
                  </span>
                </div>

                {/* Custom Dropdown */}
                {showBaselineDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginTop: '5px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000
                  }}>
                    {baselineList.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        No baselines saved yet. Upload a baseline image first.
                      </div>
                    ) : (
                      baselineList.map((baseline) => (
                        <div
                          key={baseline.id}
                          onClick={() => handleBaselineSelection(baseline)}
                          style={{
                            padding: '15px',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '15px',
                            alignItems: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8f9ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          {/* Thumbnail */}
                          {baseline.preview ? (
                            <img
                              src={baseline.preview}
                              alt={baseline.name}
                              style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '80px',
                              height: '80px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f0f0f0',
                              borderRadius: '6px',
                              border: '2px solid #e0e0e0',
                              fontSize: '32px'
                            }}>
                              📷
                            </div>
                          )}
                          
                          {/* Details */}
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              color: '#333', 
                              fontWeight: '600', 
                              fontSize: '15px', 
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {baseline.name}
                              {selectedBaseline?.id === baseline.id && (
                                <span style={{ 
                                  background: '#667eea', 
                                  color: 'white', 
                                  padding: '2px 8px', 
                                  borderRadius: '10px', 
                                  fontSize: '11px' 
                                }}>
                                  Selected
                                </span>
                              )}
                            </div>
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'auto auto', 
                              gap: '8px 20px',
                              fontSize: '12px'
                            }}>
                              <div style={{ color: '#666' }}>
                                <span style={{ color: '#999' }}>📍 Location:</span> {baseline.location}
                              </div>
                              <div style={{ color: '#666' }}>
                                <span style={{ color: '#999' }}>🏛️ Structure:</span> {baseline.structure}
                              </div>
                              <div style={{ color: '#666' }}>
                                <span style={{ color: '#999' }}>📅 Date:</span> {baseline.captureDate}
                              </div>
                              <div style={{ color: '#666' }}>
                                <span style={{ color: '#999' }}>💾 Size:</span> {baseline.fileSize}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Baseline Details */}
              {selectedBaseline && (
                <div style={{
                  background: '#f9f9f9',
                  padding: '25px',
                  borderRadius: '10px',
                  marginBottom: '30px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Baseline Details
                  </h3>
                  
                  {/* Warning if baseline file is not available */}
                  {!baselineFile && (
                    <div style={{
                      background: '#fff3cd',
                      border: '1px solid #ffc107',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '20px' }}>⚠️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#856404', fontWeight: '600', marginBottom: '5px', fontSize: '14px' }}>
                          Baseline Image Not Available
                        </div>
                        <div style={{ color: '#856404', fontSize: '13px', lineHeight: '1.5' }}>
                          This baseline was loaded from saved data and the image file is no longer available in memory. To run a comparison, please go to the "Upload Baseline" tab and upload the baseline image again.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
                    {/* Baseline Image Preview */}
                    <div>
                      <img
                        src={baselinePreview}
                        alt="Baseline"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #ddd'
                        }}
                      />
                    </div>

                    {/* Baseline Metadata */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignContent: 'start' }}>
                      <div>
                        <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Location:</div>
                        <div style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{selectedBaseline.location}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Structure:</div>
                        <div style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>{selectedBaseline.structure}</div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>Filename:</div>
                        <div style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>
                          {selectedBaseline.filename}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>File Size:</div>
                        <div style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>
                          {selectedBaseline.fileSize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Current Image for Comparison */}
              <div style={{
                background: '#f9f9f9',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '30px',
                border: '1px solid #e0e0e0'
              }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📤 Upload Current Image for Comparison
                </h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
                  Upload a recent image of the same building/structure to detect structural changes.
                </p>

                {/* File Upload Area */}
                <div
                  onClick={() => document.getElementById('comparisonFileInput').click()}
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fafafa',
                    transition: 'all 0.3s',
                    marginBottom: '20px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#f8f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.background = '#fafafa';
                  }}
                >
                  {!comparisonPreview ? (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🖼️</div>
                      <div style={{ color: '#667eea', fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>
                        Select current image
                      </div>
                    </>
                  ) : (
                    <img
                      src={comparisonPreview}
                      alt="Current image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
                <input
                  id="comparisonFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleComparisonSelect}
                  style={{ display: 'none' }}
                />

                {/* Capture Date and Camera */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Capture Date
                    </label>
                    <input
                      type="date"
                      value={captureDate}
                      onChange={(e) => setCaptureDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                      Camera
                    </label>
                    <input
                      type="text"
                      value={cameraDetails}
                      onChange={(e) => setCameraDetails(e.target.value)}
                      placeholder="e.g., iPhone 13"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '13px' }}>
                    Notes
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any observations about current conditions..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Upload & Compare Button */}
                <button
                  onClick={handleComparison}
                  disabled={loading || !comparisonFile || !baselineName}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: loading || !comparisonFile || !baselineName ? '#ccc' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading || !comparisonFile || !baselineName ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && comparisonFile && baselineName) {
                      e.currentTarget.style.background = '#5568d3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && comparisonFile && baselineName) {
                      e.currentTarget.style.background = '#667eea';
                    }
                  }}
                >
                  <span>🔍</span>
                  <span>{loading ? 'Analyzing...' : 'Upload & Compare'}</span>
                </button>
              </div>

              {uploadStatus && activeTab === 'comparison' && (
                <div style={{
                  padding: '15px',
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  color: '#856404'
                }}>
                  {uploadStatus}
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          {activeTab === 'results' && comparisonResult && (
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Analysis Results</h2>

              {/* Key Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: '#e8f4fd',
                  padding: '25px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', color: '#667eea', fontWeight: 'bold' }}>
                    {comparisonResult.similarityPercentage || (comparisonResult.ssimScore * 100).toFixed(1)}%
                  </div>
                  <div style={{ color: '#555', marginTop: '10px' }}>Similarity Score (SSIM)</div>
                </div>

                <div style={{
                  background: '#fff3cd',
                  padding: '25px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', color: '#ffc107', fontWeight: 'bold' }}>
                    {comparisonResult.changesDetected}
                  </div>
                  <div style={{ color: '#555', marginTop: '10px' }}>Contours Detected</div>
                </div>

                <div style={{
                  background: '#f8d7da',
                  padding: '25px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.8rem', color: '#dc3545', fontWeight: 'bold' }}>
                    {comparisonResult.deteriorationLevel}
                  </div>
                  <div style={{ color: '#555', marginTop: '10px' }}>Severity Level</div>
                </div>
              </div>

              {/* Difference Image Visualization */}
              {comparisonResult.differenceImage && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🔍 Visual Analysis</h3>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <img
                      src={`data:image/jpeg;base64,${comparisonResult.differenceImage}`}
                      alt="Difference visualization"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <p style={{
                      marginTop: '15px',
                      color: '#666',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      Red highlights show detected structural differences • Yellow boxes mark affected regions
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis Details */}
              {comparisonResult.differencePercentage !== undefined && (
                <div style={{
                  background: '#e8f4fd',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '30px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#667eea' }}>
                      {comparisonResult.differencePercentage}%
                    </div>
                    <div style={{ color: '#555', fontSize: '14px', marginTop: '5px' }}>Difference</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#667eea' }}>
                      {comparisonResult.affectedAreaPercentage}%
                    </div>
                    <div style={{ color: '#555', fontSize: '14px', marginTop: '5px' }}>Affected Area</div>
                  </div>
                  {comparisonResult.metadata && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#667eea' }}>
                        {new Date(comparisonResult.metadata.analysisDate).toLocaleDateString()}
                      </div>
                      <div style={{ color: '#555', fontSize: '14px', marginTop: '5px' }}>Analysis Date</div>
                    </div>
                  )}
                </div>
              )}

              {/* Affected Areas */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🎯 Affected Areas</h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {comparisonResult.affectedAreas.map((area, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#f8f9fa',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid #dee2e6',
                        color: '#555',
                        fontSize: '14px'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 style={{ color: '#667eea', marginBottom: '15px' }}>💡 Recommendations</h3>
                <ul style={{ color: '#555', lineHeight: '2', fontSize: '16px' }}>
                  {comparisonResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{
                marginTop: '30px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    setActiveTab('baseline');
                    setComparisonResult(null);
                    setBaselineFile(null);
                    setBaselinePreview(null);
                    setComparisonFile(null);
                    setComparisonPreview(null);
                    setUploadStatus('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  New Analysis
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingChatbot />
    </>
  );
};

export default Preservation;
