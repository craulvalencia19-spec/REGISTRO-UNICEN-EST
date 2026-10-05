import { createTimeline, scrambleText, animate, stagger, splitText } from 'https://esm.sh/animejs';

// ===================================================
// MOTOR GRÁFICO DE PARTÍCULAS INTERACTIVAS (THREE.JS)
// ===================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4.0;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const videoIntro = document.getElementById('bg-video-intro'); 
const videoRobot = document.getElementById('bg-video-robot'); 
const videoLike = document.getElementById('bg-video-like');   
const logoReveal = document.getElementById('cinema-logo-reveal');

let travelSpeed = 1.0;
const pGeometry = new THREE.BufferGeometry();
const count = 250;
const positions = new Float32Array(count * 3);
const velocities = [];

for(let i=0; i<count*3; i+=3) {
    positions[i] = (Math.random() - 0.5) * 7;
    positions[i+1] = (Math.random() - 0.5) * 5;
    positions[i+2] = (Math.random() - 0.5) * 5;
    velocities.push(Math.random() * 0.008 + 0.003);
}
pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pMaterial = new THREE.PointsMaterial({ color: 0x00f3ff, size: 0.025, transparent: true, opacity: 0.5 });
const pSystem = new THREE.Points(pGeometry, pMaterial);
scene.add(pSystem);

function animateParticles() {
    requestAnimationFrame(animateParticles);
    const arr = pGeometry.attributes.position.array;
    let vIdx = 0;
    for(let i=0; i<arr.length; i+=3) {
        arr[i+2] += velocities[vIdx] * travelSpeed;
        if(arr[i+2] > 3) arr[i+2] = -5;
        vIdx++;
    }
    pGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animateParticles();


// ===================================================
// CONTROL DE LA LÍNEA DE TIEMPO ESTILO PELÍCULA (INTRO)
// ===================================================
const movieTL = createTimeline({ loop: true });
movieTL.add('.movie-slide:nth-child(1)', { opacity: { to: 1, duration: 400, ease: 'linear' }, scale: [{ from: 0.92, to: 1, duration: 2500, ease: 'out(2)' }] });
movieTL.add('.movie-slide:nth-child(1) .scramble-tag', { innerHTML: scrambleText({ override: ' ', ease: 'inQuad', duration: 500, from: 'left', cursor: '░▒▓█' }) }, '<<');
movieTL.add('.movie-slide:nth-child(1) .movie-title', { innerHTML: scrambleText({ override: ' ', ease: 'inQuad', duration: 900, from: 'center', cursor: '░▒▓█' }) }, '<+=200');
movieTL.add('.movie-slide:nth-child(1)', { opacity: { to: 0, duration: 400, ease: 'linear' }, delay: 1500 });
movieTL.set('.movie-slide:nth-child(2)', { opacity: 1 }, '<<+=400');
movieTL.add('.movie-slide:nth-child(2) .movie-title', { scale: [{ from: 0.95, to: 1.05, duration: 2200, ease: 'linear' }], innerHTML: scrambleText({ override: ' ', ease: 'outQuad', duration: 1000, from: 'right', cursor: '█▓▒░' }) }, '<<');
movieTL.add('.movie-slide:nth-child(2)', { opacity: { to: 0, duration: 400, ease: 'linear' }, delay: 1200 });
movieTL.set('.movie-slide:nth-child(3)', { opacity: 1 }, '<<+=400');
movieTL.add('.movie-slide:nth-child(3) .movie-brand', { scale: [{ from: 0.88, to: 1, duration: 2000, ease: 'outExpo' }], innerHTML: scrambleText({ override: ' ', ease: 'inOutQuad', duration: 1100, from: 'center', cursor: '░▒▓█' }) }, '<<');
movieTL.add('.movie-slide:nth-child(3) .movie-slogan', { innerHTML: scrambleText({ override: ' ', ease: 'outQuad', duration: 900, from: 'center', cursor: '█' }) }, '<+=500');
movieTL.add('.movie-slide:nth-child(3)', { opacity: { to: 0, duration: 500, ease: 'linear' }, delay: 3500 });
movieTL.init();


// ===================================================
// INYECCIÓN DE TU CÓDIGO DE ANIMACIÓN LETRA POR LETRA
// ===================================================
function ejecutarAnimacionLetras(panelId) {
    const selectorH2 = `${panelId} .sub-page.active .text-xl`;
    const targetEl = document.querySelector(selectorH2);
    if (!targetEl) return;

    // Resetea cualquier división previa para evitar duplicaciones
    if(targetEl.children.length > 0) {
        targetEl.innerHTML = targetEl.textContent;
    }

    // Efecto nativo splitText v4
    const { chars } = splitText(selectorH2, { words: false, chars: true });

    // Tu bloque exacto de animación integrado
    animate(chars, {
        y: [
            { to: '-2.75rem', ease: 'outExpo', duration: 600 },
            { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
        ],
        rotate: {
            from: '-1turn',
            delay: 0
        },
        delay: stagger(50),
        ease: 'inOutCirc'
    });
}


// ===================================================
// CONTROLADOR DEL MÓDULO INTERNO: PASAR DE PÁGINA
// ===================================================
window.changeSubPage = function(buttonElement, direction) {
    const currentBlocker = buttonElement.closest('.total-blocker');
    const subPages = currentBlocker.querySelectorAll('.sub-page');
    let activeIndex = -1;

    subPages.forEach((page, index) => {
        if(page.classList.contains('active')) activeIndex = index;
    });

    if (activeIndex === -1) return;

    subPages[activeIndex].classList.remove('active');

    if (direction === 'next' && activeIndex < subPages.length - 1) {
        activeIndex++;
    } else if (direction === 'prev' && activeIndex > 0) {
        activeIndex--;
    }

    subPages[activeIndex].classList.add('active');

    // Lanzar tu animación letra por letra en la nueva página visible
    const panelParent = currentBlocker.closest('.panel');
    if (panelParent) {
        ejecutarAnimacionLetras('#' + panelParent.id);
    }
}


// ===================================================
// DESBLOQUEO DEL PORTAL HACIA EL PANEL PRINCIPAL
// ===================================================
window.unlockSystem = function() {
    const gate = document.getElementById('welcome-gate');
    const dashboard = document.getElementById('main-dashboard');
    movieTL.pause();

    videoIntro.play().then(() => {
        gate.style.opacity = '0';
        setTimeout(() => {
            gate.style.display = 'none';
            dashboard.classList.add('visible-dashboard');
            
            // Forzar reseteo de todas las secciones a la página 1 al iniciar
            document.querySelectorAll('.total-blocker').forEach(blocker => {
                const pages = blocker.querySelectorAll('.sub-page');
                pages.forEach((p, i) => {
                    if(i === 0) p.classList.add('active');
                    else p.classList.remove('active');
                });
            });

            document.getElementById('pane-inicio').classList.add('visible');
            ejecutarAnimacionLetras('#pane-inicio');
            sincronizarLogoUnicen();
        }, 600);
    }).catch(() => {
        gate.style.opacity = '0';
        setTimeout(() => { 
            gate.style.display = 'none'; 
            dashboard.classList.add('visible-dashboard');
            document.getElementById('pane-inicio').classList.add('visible');
            ejecutarAnimacionLetras('#pane-inicio');
        }, 600);
    });
}

let logoTimer;
function sincronizarLogoUnicen() {
    clearTimeout(logoTimer);
    logoReveal.classList.remove('logo-reveal-visible');
    logoReveal.classList.add('logo-reveal-hidden');
    logoTimer = setTimeout(() => {
        logoReveal.classList.remove('logo-reveal-hidden');
        logoReveal.classList.add('logo-reveal-visible');
    }, 11000); 
}

// ===================================================
// CONTROLADOR DE BOTONES LATERALES DE COMANDOS
// ===================================================
window.triggerGridAction = function(paneKey, activeIndex) {
    videoLike.classList.remove('active');
    videoLike.pause();

    document.querySelectorAll('.nav-node').forEach((btn, idx) => {
        if(idx === activeIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('visible'));

    const targetPanel = document.getElementById('pane-' + paneKey);
    if(targetPanel) {
        const pages = targetPanel.querySelectorAll('.sub-page');
        pages.forEach((p, i) => {
            if(i === 0) p.classList.add('active');
            else p.classList.remove('active');
        });
    }

    if (paneKey === 'inicio') {
        videoRobot.classList.remove('active');
        videoIntro.classList.add('active');
        videoIntro.currentTime = 0;
        videoIntro.play().catch(e => console.log(e));
        travelSpeed = 4.0;
        sincronizarLogoUnicen();

        setTimeout(() => {
            document.getElementById('pane-inicio').classList.add('visible');
            ejecutarAnimacionLetras('#pane-inicio');
            travelSpeed = 1.0;
        }, 14000);
    } else {
        clearTimeout(logoTimer);
        logoReveal.classList.remove('logo-reveal-visible');
        logoReveal.classList.add('logo-reveal-hidden');

        videoIntro.classList.remove('active');
        videoRobot.classList.add('active');
        if (videoRobot.paused) {
            videoRobot.play().catch(e => console.log(e));
        }

        targetPanel.classList.add('visible');
        ejecutarAnimacionLetras('#pane-' + paneKey);
        travelSpeed = 1.0;
    }
}

// ===================================================
// FUNCIÓN VOLVER: MANO ROBOT LIKE MULTIMEDIA
// ===================================================
window.volverAlMenuBase = function() {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('visible'));
    document.querySelectorAll('.nav-node').forEach(btn => btn.classList.remove('active'));

    videoIntro.classList.remove('active');
    videoRobot.classList.remove('active');
    videoLike.classList.add('active');
    videoLike.currentTime = 0;
    
    videoLike.play()
        .then(() => { travelSpeed = 0.5; })
        .catch(e => console.log("Error en Like: ", e));

    videoLike.onended = function() {
        videoLike.classList.remove('active');
        videoRobot.classList.add('active');
        videoRobot.play().catch(e => console.log(e));
        travelSpeed = 1.0;
    };
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});