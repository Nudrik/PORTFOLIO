// ============================================================
// BAHATAM NUDRIK RAJU | PORTFOLIO 3D & INTERACTIVE SCRIPTS
// Vibrant Colorful 3D Globe, Dynamic Physics, and UI Engine
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 1. THREE.JS 3D ANIMATED NETWORKING PLEXUS & NETWORK GLOBE
    // ========================================================
    const initThreeGlobe = () => {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1600);
        camera.position.z = 270;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group containing all rotating 3D network elements
        const networkMasterGroup = new THREE.Group();
        scene.add(networkMasterGroup);

        // Circular glow particle texture
        const createGlowTexture = () => {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
            grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
            grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);
            return new THREE.CanvasTexture(canvas);
        };

        const particleTexture = createGlowTexture();

        // Spectrum color generator
        const getSpectrumColor = (t) => {
            const color = new THREE.Color();
            color.setHSL((t * 1.1 + 0.05) % 1.0, 0.9, 0.6);
            return color;
        };

        // --- 1. Dimmed Holographic Globe Core (Network Node Surface) ---
        const globeRadius = 100;
        const globeParticleCount = 950;
        const globeGeometry = new THREE.BufferGeometry();
        const globePositions = new Float32Array(globeParticleCount * 3);
        const globeColors = new Float32Array(globeParticleCount * 3);

        for (let i = 0; i < globeParticleCount; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / globeParticleCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            const r = globeRadius + (Math.random() - 0.5) * 4;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            globePositions[i * 3] = x;
            globePositions[i * 3 + 1] = y;
            globePositions[i * 3 + 2] = z;

            const colorFactor = (y / (globeRadius * 2) + 0.5 + (x / (globeRadius * 2) * 0.2) + 1.0) % 1.0;
            const c = getSpectrumColor(colorFactor);

            globeColors[i * 3] = c.r;
            globeColors[i * 3 + 1] = c.g;
            globeColors[i * 3 + 2] = c.b;
        }

        globeGeometry.setAttribute('position', new THREE.BufferAttribute(globePositions, 3));
        globeGeometry.setAttribute('color', new THREE.BufferAttribute(globeColors, 3));

        const globeMaterial = new THREE.PointsMaterial({
            size: 3.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.65,
            map: particleTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const globePoints = new THREE.Points(globeGeometry, globeMaterial);
        networkMasterGroup.add(globePoints);

        // --- 2. 3D Animated Networking Mesh / Plexus Nodes & Dynamic Edges ---
        const nodeCount = 110;
        const nodePositions = [];
        const nodeVelocities = [];
        const nodeColorsArray = [];
        const maxDistance = 68;
        const bounds = 150;

        const nodeGeometry = new THREE.BufferGeometry();
        const nodePosBuffer = new Float32Array(nodeCount * 3);
        const nodeColBuffer = new Float32Array(nodeCount * 3);

        const networkColors = [
            new THREE.Color(0xF59E0B), // Amber
            new THREE.Color(0x10B981), // Emerald
            new THREE.Color(0x06B6D4), // Cyan
            new THREE.Color(0xA855F7), // Purple
            new THREE.Color(0xFF3366), // Coral
            new THREE.Color(0x3B82F6)  // Azure
        ];

        for (let i = 0; i < nodeCount; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * bounds * 2.2,
                (Math.random() - 0.5) * bounds * 1.8,
                (Math.random() - 0.5) * bounds * 1.5
            );
            nodePositions.push(pos);

            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 0.35,
                (Math.random() - 0.5) * 0.35,
                (Math.random() - 0.5) * 0.35
            );
            nodeVelocities.push(vel);

            const col = networkColors[i % networkColors.length];
            nodeColorsArray.push(col);

            nodePosBuffer[i * 3] = pos.x;
            nodePosBuffer[i * 3 + 1] = pos.y;
            nodePosBuffer[i * 3 + 2] = pos.z;

            nodeColBuffer[i * 3] = col.r;
            nodeColBuffer[i * 3 + 1] = col.g;
            nodeColBuffer[i * 3 + 2] = col.b;
        }

        nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePosBuffer, 3));
        nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColBuffer, 3));

        const nodeMaterial = new THREE.PointsMaterial({
            size: 4.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            map: particleTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const nodePointsMesh = new THREE.Points(nodeGeometry, nodeMaterial);
        networkMasterGroup.add(nodePointsMesh);

        // Dynamic Connecting Network Lines
        const maxLines = nodeCount * (nodeCount - 1);
        const linePositions = new Float32Array(maxLines * 6);
        const lineColors = new Float32Array(maxLines * 6);

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        networkMasterGroup.add(linesMesh);

        // --- 3. Travelling Data Packets (Pulsing Network Signals) ---
        const packetCount = 28;
        const packetGeometry = new THREE.BufferGeometry();
        const packetPositions = new Float32Array(packetCount * 3);
        const packetColors = new Float32Array(packetCount * 3);

        const packetsData = [];
        for (let p = 0; p < packetCount; p++) {
            const startIdx = Math.floor(Math.random() * nodeCount);
            let endIdx = Math.floor(Math.random() * nodeCount);
            while (endIdx === startIdx) endIdx = Math.floor(Math.random() * nodeCount);

            packetsData.push({
                startIdx: startIdx,
                endIdx: endIdx,
                progress: Math.random(),
                speed: 0.006 + Math.random() * 0.012,
                color: networkColors[p % networkColors.length]
            });

            packetPositions[p * 3] = 0;
            packetPositions[p * 3 + 1] = 0;
            packetPositions[p * 3 + 2] = 0;

            const c = networkColors[p % networkColors.length];
            packetColors[p * 3] = c.r;
            packetColors[p * 3 + 1] = c.g;
            packetColors[p * 3 + 2] = c.b;
        }

        packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3).setUsage(THREE.DynamicDrawUsage));
        packetGeometry.setAttribute('color', new THREE.BufferAttribute(packetColors, 3));

        const packetMaterial = new THREE.PointsMaterial({
            size: 6.0,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            map: particleTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const packetsMesh = new THREE.Points(packetGeometry, packetMaterial);
        networkMasterGroup.add(packetsMesh);

        // --- 4. Multiple Orbital Data Rings ---
        const ringConfigs = [
            { radius: 135, tiltX: 0.8, tiltY: 0.3, tiltZ: 0.1, color: 0xF59E0B, speed: 0.008 },
            { radius: 155, tiltX: -0.5, tiltY: 0.8, tiltZ: -0.4, color: 0x10B981, speed: -0.007 },
            { radius: 180, tiltX: 1.1, tiltY: -0.4, tiltZ: 0.7, color: 0xA855F7, speed: 0.009 }
        ];

        const orbitalRings = [];
        ringConfigs.forEach(cfg => {
            const ringCount = 120;
            const ringGeom = new THREE.BufferGeometry();
            const ringPos = new Float32Array(ringCount * 3);
            const ringCol = new Float32Array(ringCount * 3);
            const baseColor = new THREE.Color(cfg.color);

            for (let j = 0; j < ringCount; j++) {
                const angle = (j / ringCount) * Math.PI * 2;
                ringPos[j * 3] = Math.cos(angle) * cfg.radius;
                ringPos[j * 3 + 1] = Math.sin(angle) * cfg.radius;
                ringPos[j * 3 + 2] = (Math.random() - 0.5) * 3;

                ringCol[j * 3] = baseColor.r;
                ringCol[j * 3 + 1] = baseColor.g;
                ringCol[j * 3 + 2] = baseColor.b;
            }

            ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
            ringGeom.setAttribute('color', new THREE.BufferAttribute(ringCol, 3));

            const ringMat = new THREE.PointsMaterial({
                size: 2.8,
                vertexColors: true,
                transparent: true,
                opacity: 0.55,
                map: particleTexture,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const ringPoints = new THREE.Points(ringGeom, ringMat);
            ringPoints.rotation.x = cfg.tiltX;
            ringPoints.rotation.y = cfg.tiltY;
            ringPoints.rotation.z = cfg.tiltZ;

            networkMasterGroup.add(ringPoints);
            orbitalRings.push({ mesh: ringPoints, speed: cfg.speed });
        });

        // --- 5. Mouse Parallax & Smooth Physics Loop ---
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const onMouseMove = (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Animation Loop
        let clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            targetX += (mouseX - targetX) * 0.04;
            targetY += (mouseY - targetY) * 0.04;

            // Slow cinematic group rotation with parallax
            networkMasterGroup.rotation.y = elapsed * 0.06 + targetX * 1.2;
            networkMasterGroup.rotation.x = 0.15 + Math.sin(elapsed * 0.04) * 0.08 + targetY * 1.2;

            // Rotate orbital rings
            orbitalRings.forEach(r => {
                r.mesh.rotation.z += r.speed;
            });

            // 1. Update Node Positions with Soft Boundary Bounce
            const nodePosArr = nodeGeometry.attributes.position.array;
            for (let i = 0; i < nodeCount; i++) {
                const pos = nodePositions[i];
                const vel = nodeVelocities[i];

                pos.add(vel);

                // Bounce off soft bounding sphere
                if (pos.x < -bounds || pos.x > bounds) vel.x *= -1;
                if (pos.y < -bounds * 0.9 || pos.y > bounds * 0.9) vel.y *= -1;
                if (pos.z < -bounds * 0.8 || pos.z > bounds * 0.8) vel.z *= -1;

                nodePosArr[i * 3] = pos.x;
                nodePosArr[i * 3 + 1] = pos.y;
                nodePosArr[i * 3 + 2] = pos.z;
            }
            nodeGeometry.attributes.position.needsUpdate = true;

            // 2. Compute Real-Time Dynamic Network Connections (Plexus Lines)
            let lineIndex = 0;
            let lineColIndex = 0;
            let connectedSegments = 0;

            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    const dist = nodePositions[i].distanceTo(nodePositions[j]);
                    if (dist < maxDistance) {
                        const alpha = 1.0 - (dist / maxDistance); // Closer = brighter

                        // Vertex 1
                        linePositions[lineIndex++] = nodePositions[i].x;
                        linePositions[lineIndex++] = nodePositions[i].y;
                        linePositions[lineIndex++] = nodePositions[i].z;

                        // Vertex 2
                        linePositions[lineIndex++] = nodePositions[j].x;
                        linePositions[lineIndex++] = nodePositions[j].y;
                        linePositions[lineIndex++] = nodePositions[j].z;

                        const col1 = nodeColorsArray[i];
                        const col2 = nodeColorsArray[j];

                        lineColors[lineColIndex++] = col1.r * alpha * 0.7;
                        lineColors[lineColIndex++] = col1.g * alpha * 0.7;
                        lineColors[lineColIndex++] = col1.b * alpha * 0.7;

                        lineColors[lineColIndex++] = col2.r * alpha * 0.7;
                        lineColors[lineColIndex++] = col2.g * alpha * 0.7;
                        lineColors[lineColIndex++] = col2.b * alpha * 0.7;

                        connectedSegments++;
                    }
                }
            }

            lineGeometry.setDrawRange(0, connectedSegments * 2);
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;

            // 3. Update Travelling Data Packets
            const packetPosArr = packetGeometry.attributes.position.array;
            for (let p = 0; p < packetCount; p++) {
                const pkt = packetsData[p];
                pkt.progress += pkt.speed;

                if (pkt.progress >= 1.0) {
                    pkt.progress = 0;
                    pkt.startIdx = pkt.endIdx;
                    // Find a nearby node to travel to
                    let nearestIdx = Math.floor(Math.random() * nodeCount);
                    for (let n = 0; n < nodeCount; n++) {
                        if (n !== pkt.startIdx && nodePositions[pkt.startIdx].distanceTo(nodePositions[n]) < maxDistance) {
                            nearestIdx = n;
                            break;
                        }
                    }
                    pkt.endIdx = nearestIdx;
                }

                const pStart = nodePositions[pkt.startIdx];
                const pEnd = nodePositions[pkt.endIdx];
                const currentPos = new THREE.Vector3().lerpVectors(pStart, pEnd, pkt.progress);

                packetPosArr[p * 3] = currentPos.x;
                packetPosArr[p * 3 + 1] = currentPos.y;
                packetPosArr[p * 3 + 2] = currentPos.z;
            }
            packetGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initThreeGlobe();

    // ========================================================
    // 2. VANILLA TILT 3D CARD INTERACTIONS
    // ========================================================
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.tilt-card, .profile-3d-card, .tilt-element'), {
            max: 10,
            speed: 400,
            glare: true,
            'max-glare': 0.12,
            scale: 1.015,
            perspective: 1000
        });
    }

    // ========================================================
    // 3. ROLE TYPING EFFECT
    // ========================================================
    const roleElement = document.getElementById('roleText');
    if (roleElement) {
        const roles = [
            'Application Developer',
            'Python Programmer',
            'Full-Stack MERN Engineer',
            'React.js Developer',
            'AI & ML Specialist'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeRole = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                roleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 45;
            } else {
                roleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 95;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 1900; // Pause at full text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 350;
            }

            setTimeout(typeRole, typingSpeed);
        };

        setTimeout(typeRole, 500);
    }

    // ========================================================
    // 4. NAVBAR SCROLL & ACTIVE SECTION TRACKING
    // ========================================================
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========================================================
    // 5. MOBILE HAMBURGER MENU
    // ========================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
    }

    // ========================================================
    // 6. INTERACTIVE TERMINAL CODE TABS & CLIPBOARD
    // ========================================================
    const terminalTabs = document.querySelectorAll('.terminal-tab');
    const terminalCodes = document.querySelectorAll('.terminal-code');
    const copyCodeBtn = document.getElementById('copyCodeBtn');

    terminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            terminalTabs.forEach(t => t.classList.remove('active'));
            terminalCodes.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetCode = document.getElementById(`tab-${targetTab}`);
            if (targetCode) {
                targetCode.classList.add('active');
            }
        });
    });

    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            const activeCode = document.querySelector('.terminal-code.active');
            if (activeCode) {
                navigator.clipboard.writeText(activeCode.innerText).then(() => {
                    showToast('Code snippet copied to clipboard!', 'success');
                    copyCodeBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyCodeBtn.innerHTML = '<i class="far fa-copy"></i>';
                    }, 2000);
                }).catch(() => {
                    showToast('Failed to copy code', 'error');
                });
            }
        });
    }

    // 1-Click Copy Email
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'nudrikraju396@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Email copied: ${email}`, 'success');
                copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied</span>';
                setTimeout(() => {
                    copyEmailBtn.innerHTML = '<i class="far fa-copy"></i> <span>Copy</span>';
                }, 2200);
            }).catch(() => {
                showToast('Failed to copy email', 'error');
            });
        });
    }

    // ========================================================
    // 7. PROJECT CATEGORY FILTERS
    // ========================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-3d');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ========================================================
    // 8. TOAST NOTIFICATION SYSTEM
    // ========================================================
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ========================================================
    // 9. DIRECT CONTACT FORM HANDLER
    // ========================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            const origHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Email...';
                submitBtn.disabled = true;
            }

            // Compose direct mailto link to personal inbox
            const mailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
            const mailSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : `[Portfolio] Message from ${name}`);
            const mailtoUri = `mailto:nudrikraju396@gmail.com?subject=${mailSubject}&body=${mailBody}`;

            setTimeout(() => {
                window.location.href = mailtoUri;
                showToast('Email client opened successfully!', 'success');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Email Ready!';
                    setTimeout(() => {
                        submitBtn.innerHTML = origHtml;
                        submitBtn.disabled = false;
                    }, 2500);
                }
                contactForm.reset();
            }, 500);
        });
    }

    // ========================================================
    // 10. INTERACTIVE RESUME MODAL & PRINT ENGINE
    // ========================================================
    const resumeModal = document.getElementById('resumeModalOverlay');
    const openResumeBtn = document.getElementById('openResumeModalBtn');
    const closeResumeBtn = document.getElementById('closeResumeModalBtn');
    const printResumeBtn = document.getElementById('printResumeBtn');

    const openModal = () => {
        if (!resumeModal) return;
        resumeModal.classList.add('active');
        resumeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!resumeModal) return;
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (openResumeBtn) {
        openResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeResumeBtn) {
        closeResumeBtn.addEventListener('click', closeModal);
    }

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });
    }

    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Direct, bulletproof PDF download helper
    document.querySelectorAll('a[download*="Resume.pdf"]').forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            const href = this.getAttribute('href') || '/Bahatam_Nudrik_Raju_Resume.pdf';
            const filename = this.getAttribute('download') || 'Bahatam_Nudrik_Raju_Resume.pdf';
            
            try {
                showToast('Downloading Bahatam Nudrik Raju Resume...', 'info');
                const response = await fetch(href);
                if (!response.ok) throw new Error('Network response was not ok');
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobUrl;
                tempLink.setAttribute('download', filename);
                document.body.appendChild(tempLink);
                tempLink.click();
                setTimeout(() => {
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobUrl);
                    showToast('Resume downloaded successfully!', 'success');
                }, 200);
            } catch (err) {
                // Fallback to window open / direct location
                window.location.href = href;
            }
        });
    });

    // Keyboard ESC listener to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ========================================================
    // 11. SMOOTH SCROLLING FOR INTERNAL ANCHORS
    // ========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('%c🌟 NUDRIK RAJU PORTFOLIO INITIALIZED', 'background: #000; color: #FFF; font-weight: bold; padding: 4px 10px; border: 1px solid #333;');
});
