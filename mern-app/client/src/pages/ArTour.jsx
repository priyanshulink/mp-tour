import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Compass, MapPin } from 'lucide-react';

const ACES_FILMIC_TONE_MAPPING = 'aces-filmic';

const scenes = {
    greatStupa: {
        id: 'greatStupa',
        image: '/img/sanchi_great_stupa_8k.png',
        title: 'The Great Stupa',
        description: 'The oldest stone structure in India, originally commissioned by Emperor Ashoka in the 3rd century BCE. Its massive dome symbolizes the universe.',
        rotation: '0 -90 0',
        hotspots: [
            {
                id: 'toNorthGateway',
                position: '8 1.5 -5',
                rotation: '0 -45 0',
                text: 'Go to North Gateway',
                targetScene: 'northGateway'
            }
        ]
    },
    northGateway: {
        id: 'northGateway',
        image: '/img/sanchi_north_gateway_8k.png',
        title: 'North Gateway (Torana)',
        description: 'The best-preserved gateway, featuring elaborate carvings depicting scenes from the life of Buddha and Jataka tales.',
        rotation: '0 0 0',
        hotspots: [
            {
                id: 'toGreatStupa',
                position: '-5 1.5 8',
                rotation: '0 135 0',
                text: 'Back to Great Stupa',
                targetScene: 'greatStupa'
            }
        ]
    }
};

const SanchiVrTour = () => {
    const navigate = useNavigate();
    const [currentScene, setCurrentScene] = useState(scenes.greatStupa);
    const [showInfo, setShowInfo] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleSceneChange = (targetSceneId) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentScene(scenes[targetSceneId]);
            setIsTransitioning(false);
        }, 500); // Wait for fade out
    };

    useEffect(() => {
        // A-Frame component registration for click handling (if not already done)
        if (!window.AFRAME.components['hotspot-click']) {
            window.AFRAME.registerComponent('hotspot-click', {
                init: function () {
                    this.el.addEventListener('click', (evt) => {
                        const target = this.el.getAttribute('data-target');
                        if (target) {
                            // Dispatch custom event that React can listen to, or access global function
                            // Since React state is outside, we trigger a DOM event on the scene
                            const sceneEl = document.querySelector('a-scene');
                            sceneEl.emit('changeScene', { targetScene: target });
                        }
                    });
                }
            });
        }
    }, []);

    // Listen for scene change events from A-Frame
    useEffect(() => {
        const sceneEl = document.querySelector('a-scene');
        const handler = (e) => {
            handleSceneChange(e.detail.targetScene);
        };
        if (sceneEl) {
            sceneEl.addEventListener('changeScene', handler);
        }
        return () => {
            if (sceneEl) sceneEl.removeEventListener('changeScene', handler);
        }
    }, []);


    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>

            {/* Fade Transition Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                opacity: isTransitioning ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                pointerEvents: 'none',
                zIndex: 2000
            }}></div>

            {/* UI Overlay - Top Left Back Button */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
                <button
                    onClick={() => navigate('/virtual-tours')}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ArrowLeft size={24} color="#333" />
                </button>
            </div>

            {/* UI Overlay - Top Right Info Toggle */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <Info size={24} color="#333" />
                </button>
            </div>

            {/* Info Card Overlay */}
            {showInfo && (
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: '500px',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        padding: '24px',
                        borderRadius: '20px',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Compass size={20} color="#8b5cf6" />
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{currentScene.title}</h2>
                        </div>
                        <p style={{ fontSize: '15px', lineHeight: '1.5', margin: '0 0 15px 0', opacity: 0.9 }}>
                            {currentScene.description}
                        </p>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', opacity: 0.8 }}>
                            <span>👆 Drag to look around</span>
                            <span>🔍 Scroll to zoom</span>
                            <span>🔘 Click blue dots to move</span>
                        </div>
                    </div>
                </div>
            )}

            {/* A-Frame Scene */}
            <a-scene
                embedded
                vr-mode-ui="enabled: true"
                renderer={`antialias: true; colorManagement: true; highRefreshRate: true; toneMapping: ${ACES_FILMIC_TONE_MAPPING};`}
                cursor="rayOrigin: mouse"
                raycaster="objects: .clickable"
            >
                {/* Assets */}
                <a-assets>
                    {/* Preload both images */}
                    <img id="greatStupa" src={scenes.greatStupa.image} crossorigin="anonymous" />
                    <img id="northGateway" src={scenes.northGateway.image} crossorigin="anonymous" />
                </a-assets>

                {/* 360 Skybox */}
                <a-sky
                    src={currentScene.id === 'greatStupa' ? '#greatStupa' : '#northGateway'}
                    rotation={currentScene.rotation}
                    animation__fade="property: components.material.material.opacity; type: isRawProperty; from: 0; to: 1; dur: 500; startEvents: fadein"
                ></a-sky>

                {/* Camera */}
                <a-entity position="0 0 0">
                    <a-camera
                        reverse-mouse-drag="true"
                        wasd-controls-enabled="false"
                        look-controls="enabled: true"
                    >
                        {/* Reticle for VR mode gaze interaction */}
                        <a-cursor
                            id="cursor"
                            color="white"
                            fuse="true"
                            fuse-timeout="1500"
                            raycaster="objects: .clickable"
                            scale="0.5 0.5 0.5"
                            visible="false" // Hidden in non-VR mode due to mouse cursor
                        ></a-cursor>
                    </a-camera>
                </a-entity>

                {/* Hotspots for current scene */}
                {currentScene.hotspots.map((hotspot) => (
                    <a-entity
                        key={hotspot.id}
                        position={hotspot.position}
                        rotation={hotspot.rotation}
                        scale="1 1 1"
                        class="clickable"
                        hotspot-click=""
                        data-target={hotspot.targetScene}
                        animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; dur: 2000; loop: true"
                    >
                        {/* Outer Glow Ring */}
                        <a-ring
                            color="white"
                            radius-inner="0.4"
                            radius-outer="0.5"
                            opacity="0.6"
                            look-at="#camera"
                        ></a-ring>

                        {/* Inner Dot */}
                        <a-circle
                            color="#3b82f6"
                            radius="0.3"
                            opacity="0.9"
                            look-at="#camera"
                        ></a-circle>

                        {/* Arrow Icon inside */}
                        <a-entity position="0 0 0.01" look-at="#camera">
                            <a-ring color="white" radius-inner="0.1" radius-outer="0.15" theta-length="270" rotation="0 0 45"></a-ring>
                            <a-triangle color="white" vertex-a="0 0.15 0" vertex-b="-0.1 0 0" vertex-c="0.1 0 0" position="0 0.15 0"></a-triangle>
                        </a-entity>

                        {/* Label Text */}
                        <a-text
                            value={hotspot.text}
                            align="center"
                            position="0 0.8 0"
                            width="6"
                            color="#FFF"
                            font="roboto"
                            look-at="#camera"
                            bg-color="rgba(0,0,0,0.6)"
                            bg-height="0.5"
                            bg-width="2.5"
                            padding="0.2"
                        ></a-text>
                    </a-entity>
                ))}

            </a-scene>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
            </style>
        </div>
    );
};

export default SanchiVrTour;
