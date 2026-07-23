import * as THREE from "three";

/* =========================================================
   WATER JUMP 3D - VERSIÓN 0.1
   ========================================================= */


/* =========================================================
   VARIABLES PRINCIPALES
   ========================================================= */

let scene;
let camera;
let renderer;

let diver;
let pool;
let water;

let animationId;

let jumping = false;
let jumpStartTime = 0;

let startDirection = "front";

let replayFrames = [];
let isReplaying = false;
let replayIndex = 0;
let replaySpeed = 1;

let score = 0;

let pose = "straight";


/* ROTACIONES CONTROLADAS POR EL JUGADOR */

let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;


/* VELOCIDAD DE ROTACIÓN */

let rotationVelocityX = 0;
let rotationVelocityY = 0;
let rotationVelocityZ = 0;


/* CONTROLES */

const controls = {

    forward: "ArrowUp",
    backward: "ArrowDown",

    rollLeft: "ArrowLeft",
    rollRight: "ArrowRight",

    spinLeft: "KeyA",
    spinRight: "KeyD",

    straight: "KeyR",
    bend: "KeyW",
    tuck: "KeyB"

};


/* =========================================================
   ELEMENTOS DE LA INTERFAZ
   ========================================================= */

const mainMenu =
    document.getElementById("mainMenu");

const preparationMenu =
    document.getElementById("preparationMenu");

const controlsMenu =
    document.getElementById("controlsMenu");

const jumpInterface =
    document.getElementById("jumpInterface");

const resultMenu =
    document.getElementById("resultMenu");

const scoreElement =
    document.getElementById("score");

const finalScoreElement =
    document.getElementById("finalScore");


/* =========================================================
   INICIAR THREE.JS
   ========================================================= */

function init() {

    /* ESCENA */

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(0x87ceeb);


    /* CÁMARA */

    camera =
        new THREE.PerspectiveCamera(

            60,

            window.innerWidth /
            window.innerHeight,

            0.1,

            1000

        );


    camera.position.set(
        14,
        9,
        18
    );


    camera.lookAt(
        0,
        4,
        0
    );


    /* RENDERIZADOR */

    renderer =
        new THREE.WebGLRenderer({

            antialias: true

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.shadowMap.enabled =
        true;


    document
        .getElementById("game")
        .appendChild(
            renderer.domElement
        );


    /* =====================================================
       ILUMINACIÓN
       ===================================================== */


    const ambientLight =
        new THREE.HemisphereLight(

            0xffffff,

            0x446677,

            2

        );


    scene.add(
        ambientLight
    );


    const sun =
        new THREE.DirectionalLight(

            0xffffff,

            3

        );


    sun.position.set(
        10,
        20,
        10
    );


    sun.castShadow =
        true;


    scene.add(
        sun
    );


    /* =====================================================
       PISCINA
       ===================================================== */


    createPool();


    /* =====================================================
       PLATAFORMA
       ===================================================== */


    createPlatform();


    /* =====================================================
       PERSONAJE
       ===================================================== */


    diver =
        createDiver();


    diver.position.set(

        0,

        7.5,

        0

    );


    scene.add(
        diver
    );


    /* =====================================================
       EVENTOS
       ===================================================== */


    window.addEventListener(

        "resize",

        onResize

    );


    setupButtons();


    setupKeyboardControls();


    createControlSettings();


    /* =====================================================
       INICIAR RENDER
       ===================================================== */


    animate();

}


/* =========================================================
   CREAR PISCINA
   ========================================================= */

function createPool() {

    const poolBottom =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                24,

                1,

                24

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0x168dcc,

                roughness:
                    0.4,

                metalness:
                    0.1

            })

        );


    poolBottom.position.y =
        -0.5;


    poolBottom.receiveShadow =
        true;


    scene.add(
        poolBottom
    );


    /* AGUA */

    water =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                22,

                0.25,

                22

            ),

            new THREE.MeshPhysicalMaterial({

                color:
                    0x159bd7,

                transparent:
                    true,

                opacity:
                    0.75,

                roughness:
                    0.1,

                metalness:
                    0.1,

                transmission:
                    0.1

            })

        );


    water.position.y =
        0;


    scene.add(
        water
    );


    /* BORDES */

    const edgeMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xffffff

        });


    const edgeGeometry =
        new THREE.BoxGeometry(

            24,

            0.5,

            0.5

        );


    const edge1 =
        new THREE.Mesh(

            edgeGeometry,

            edgeMaterial

        );


    edge1.position.set(

        0,

        0.25,

        12

    );


    scene.add(
        edge1
    );


    const edge2 =
        edge1.clone();


    edge2.position.z =
        -12;


    scene.add(
        edge2
    );


    const edgeGeometrySide =
        new THREE.BoxGeometry(

            0.5,

            0.5,

            24

        );


    const edge3 =
        new THREE.Mesh(

            edgeGeometrySide,

            edgeMaterial

        );


    edge3.position.set(

        12,

        0.25,

        0

    );


    scene.add(
        edge3
    );


    const edge4 =
        edge3.clone();


    edge4.position.x =
        -12;


    scene.add(
        edge4
    );

}


/* =========================================================
   CREAR PLATAFORMA DE 7,5 METROS
   ========================================================= */

function createPlatform() {

    const towerMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xaaaaaa,

            roughness:
                0.7

        });


    const tower =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                1.5,

                7.5,

                1.5

            ),

            towerMaterial

        );


    tower.position.set(

        0,

        3.75,

        0

    );


    tower.castShadow =
        true;


    scene.add(
        tower
    );


    /* PLATAFORMA SUPERIOR */

    const platform =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                3,

                0.35,

                3

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0xdddddd,

                roughness:
                    0.7

            })

        );


    platform.position.set(

        0,

        7.5,

        0

    );


    platform.castShadow =
        true;


    scene.add(
        platform
    );

}


/* =========================================================
   CREAR PERSONAJE 3D
   ========================================================= */

function createDiver() {

    const root =
        new THREE.Group();


    /* MATERIAL */

    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xff5533,

            roughness:
                0.7

        });


    const skinMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xffc49b,

            roughness:
                0.8

        });


    /* TORSO */

    const torso =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(

                0.35,

                0.9,

                8,

                16

            ),

            bodyMaterial

        );


    torso.position.y =
        1.5;


    torso.castShadow =
        true;


    root.add(
        torso
    );


    root.userData.torso =
        torso;


    /* CABEZA */

    const head =
        new THREE.Mesh(

            new THREE.SphereGeometry(

                0.28,

                16,

                16

            ),

            skinMaterial

        );


    head.position.y =
        2.35;


    head.castShadow =
        true;


    root.add(
        head
    );


    root.userData.head =
        head;


    /* BRAZO IZQUIERDO */

    const leftArm =
        createLimb(

            bodyMaterial,

            0.22,

            1.0

        );


    leftArm.position.set(

        -0.55,

        1.55,

        0

    );


    root.add(
        leftArm
    );


    root.userData.leftArm =
        leftArm;


    /* BRAZO DERECHO */

    const rightArm =
        createLimb(

            bodyMaterial,

            0.22,

            1.0

        );


    rightArm.position.set(

        0.55,

        1.55,

        0

    );


    root.add(
        rightArm
    );


    root.userData.rightArm =
        rightArm;


    /* PIERNA IZQUIERDA */

    const leftLeg =
        createLimb(

            bodyMaterial,

            0.25,

            1.1

        );


    leftLeg.position.set(

        -0.22,

        0.5,

        0

    );


    root.add(
        leftLeg
    );


    root.userData.leftLeg =
        leftLeg;


    /* PIERNA DERECHA */

    const rightLeg =
        createLimb(

            bodyMaterial,

            0.25,

            1.1

        );


    rightLeg.position.set(

        0.22,

        0.5,

        0

    );


    root.add(
        rightLeg
    );


    root.userData.rightLeg =
        rightLeg;


    return root;

}


/* =========================================================
   CREAR EXTREMIDAD
   ========================================================= */

function createLimb(

    material,

    radius,

    height

) {

    const limb =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(

                radius,

                height,

                8,

                12

            ),

            material

        );


    limb.castShadow =
        true;


    return limb;

}


/* =========================================================
   CAMBIAR POSTURA
   ========================================================= */

function setPose(
    newPose
) {

    pose =
        newPose;


    const leftArm =
        diver.userData.leftArm;


    const rightArm =
        diver.userData.rightArm;


    const leftLeg =
        diver.userData.leftLeg;


    const rightLeg =
        diver.userData.rightLeg;


    const torso =
        diver.userData.torso;


    /* REINICIAR */

    leftArm.rotation.set(
        0,
        0,
        0
    );


    rightArm.rotation.set(
        0,
        0,
        0
    );


    leftLeg.rotation.set(
        0,
        0,
        0
    );


    rightLeg.rotation.set(
        0,
        0,
        0
    );


    torso.rotation.set(
        0,
        0,
        0
    );


    /* RECTO */

    if (
        newPose ===
        "straight"
    ) {

        return;

    }


    /* DOBLADO */

    if (
        newPose ===
        "bend"
    ) {

        torso.rotation.x =
            -0.8;

        leftArm.rotation.x =
            -0.6;

        rightArm.rotation.x =
            -0.6;

        leftLeg.rotation.x =
            0.5;

        rightLeg.rotation.x =
            0.5;

        return;

    }


    /* BOLA */

    if (
        newPose ===
        "tuck"
    ) {

        torso.rotation.x =
            -1.2;

        leftArm.rotation.x =
            -1.5;

        rightArm.rotation.x =
            -1.5;

        leftLeg.rotation.x =
            1.3;

        rightLeg.rotation.x =
            1.3;

    }

}


/* =========================================================
   CONFIGURAR BOTONES
   ========================================================= */

function setupButtons() {


    /* MODO LIBRE */

    document
        .getElementById(
            "freeMode"
        )
        .onclick = () => {

            mainMenu
                .classList
                .add(
                    "hidden"
                );

            preparationMenu
                .classList
                .remove(
                    "hidden"
                );

        };


    /* CONTROLES */

    document
        .getElementById(
            "settings"
        )
        .onclick = () => {

            mainMenu
                .classList
                .add(
                    "hidden"
                );

            controlsMenu
                .classList
                .remove(
                    "hidden"
                );

        };


    /* CERRAR CONTROLES */

    document
        .getElementById(
            "closeControls"
        )
        .onclick = () => {

            controlsMenu
                .classList
                .add(
                    "hidden"
                );

            mainMenu
                .classList
                .remove(
                    "hidden"
                );

        };


    /* DE FRENTE */

    document
        .getElementById(
            "frontStart"
        )
        .onclick = () => {

            startDirection =
                "front";

        };


    /* DE ESPALDAS */

    document
        .getElementById(
            "backStart"
        )
        .onclick = () => {

            startDirection =
                "back";

        };


    /* COMENZAR */

    document
        .getElementById(
            "startJump"
        )
        .onclick =
        startJump;


    /* VOLVER */

    document
        .getElementById(
            "backToMenu"
        )
        .onclick = () => {

            preparationMenu
                .classList
                .add(
                    "hidden"
                );

            mainMenu
                .classList
                .remove(
                    "hidden"
                );

        };


    /* BOTONES DE POSTURA */

    document
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(

            button => {

                button
                    .addEventListener(

                        "pointerdown",

                        () => {

                            performAction(

                                button
                                    .dataset
                                    .action

                            );

                        }

                    );

            }

        );


    /* REPETIR */

    document
        .getElementById(
            "replay"
        )
        .onclick = () => {

            startReplay(
                1
            );

        };


    /* CÁMARA LENTA */

    document
        .getElementById(
            "slowReplay"
        )
        .onclick = () => {

            startReplay(
                0.35
            );

        };


    /* NUEVO SALTO */

    document
        .getElementById(
            "newJump"
        )
        .onclick = () => {

            resultMenu
                .classList
                .add(
                    "hidden"
                );

            preparationMenu
                .classList
                .remove(
                    "hidden"
                );

        };

}


/* =========================================================
   CONTROLES DE TECLADO
   ========================================================= */

function setupKeyboardControls() {

    window.addEventListener(

        "keydown",

        event => {

            if (
                !jumping
            ) {

                return;

            }


            const action =
                Object.keys(
                    controls
                )
                .find(

                    key =>
                        controls[key] ===
                        event.code

                );


            if (
                action
            ) {

                performAction(
                    action
                );

            }

        }

    );

}


/* =========================================================
   EJECUTAR ACCIÓN
   ========================================================= */

function performAction(

    action

) {

    if (
        !jumping
    ) {

        return;

    }


    const rotationPower =
        0.035;


    if (
        action ===
        "forward"
    ) {

        rotationVelocityX -=
            rotationPower;

    }


    if (
        action ===
        "backward"
    ) {

        rotationVelocityX +=
            rotationPower;

    }


    if (
        action ===
        "rollLeft"
    ) {

        rotationVelocityZ -=
            rotationPower;

    }


    if (
        action ===
        "rollRight"
    ) {

        rotationVelocityZ +=
            rotationPower;

    }


    if (
        action ===
        "spinLeft"
    ) {

        rotationVelocityY -=
            rotationPower;

    }


    if (
        action ===
        "spinRight"
    ) {

        rotationVelocityY +=
            rotationPower;

    }


    if (
        action ===
        "straight"
    ) {

        setPose(
            "straight"
        );

    }


    if (
        action ===
        "bend"
    ) {

        setPose(
            "bend"
        );

    }


    if (
        action ===
        "tuck"
    ) {

        setPose(
            "tuck"
        );

    }


    score +=
        0.1;


    updateScore();

}


/* =========================================================
   COMENZAR SALTO
   ========================================================= */

function startJump() {

    jumping =
        true;


    isReplaying =
        false;


    jumpStartTime =
        performance.now();


    rotationX =
        0;


    rotationY =
        startDirection ===
        "back"
            ? Math.PI
            : 0;


    rotationZ =
        0;


    rotationVelocityX =
        0;


    rotationVelocityY =
        0;


    rotationVelocityZ =
        0;


    score =
        0;


    replayFrames =
        [];


    setPose(
        "straight"
    );


    preparationMenu
        .classList
        .add(
            "hidden"
        );


    resultMenu
        .classList
        .add(
            "hidden"
        );


    jumpInterface
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   ACTUALIZAR SALTO
   ========================================================= */

function updateJump() {

    if (
        !jumping ||
        isReplaying
    ) {

        return;

    }


    const elapsed =
        (
            performance.now()
            -
            jumpStartTime
        )
        /
        1000;


    /* DURACIÓN */

    const duration =
        4;


    const progress =
        Math.min(

            elapsed /
            duration,

            1

        );


    /* MOVIMIENTO PARABÓLICO */

    const startHeight =
        7.5;


    const endHeight =
        0.8;


    const jumpHeight =
        startHeight
        +
        (
            endHeight -
            startHeight
        )
        *
        progress;


    const arc =
        Math.sin(
            progress *
            Math.PI
        )
        *
        5;


    diver.position.y =
        jumpHeight +
        arc;


    /* APLICAR ROTACIÓN */

    rotationX +=
        rotationVelocityX;


    rotationY +=
        rotationVelocityY;


    rotationZ +=
        rotationVelocityZ;


    /* FRICCIÓN */

    rotationVelocityX *=
        0.985;


    rotationVelocityY *=
        0.985;


    rotationVelocityZ *=
        0.985;


    diver.rotation.set(

        rotationX,

        rotationY,

        rotationZ

    );


    /* GUARDAR REPETICIÓN */

    replayFrames.push({

        position: {

            x:
                diver.position.x,

            y:
                diver.position.y,

            z:
                diver.position.z

        },

        rotation: {

            x:
                rotationX,

            y:
                rotationY,

            z:
                rotationZ

        },

        pose:
            pose

    });


    /* FINAL */

    if (
        progress >=
        1
    ) {

        finishJump();

    }

}


/* =========================================================
   FINALIZAR SALTO
   ========================================================= */

function finishJump() {

    jumping =
        false;


    jumpInterface
        .classList
        .add(
            "hidden"
        );


    /* BONIFICACIÓN POR ROTACIONES */

    const totalRotation =

        Math.abs(
            rotationX
        )
        +
        Math.abs(
            rotationY
        )
        +
        Math.abs(
            rotationZ
        );


    score +=

        Math.min(

            totalRotation,

            10

        );


    score =
        Math.min(

            score,

            100

        );


    updateScore();


    finalScoreElement
        .textContent =

        Math.round(
            score
        );


    resultMenu
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   REPETICIÓN
   ========================================================= */

function startReplay(

    speed

) {

    if (
        replayFrames.length ===
        0
    ) {

        return;

    }


    replaySpeed =
        speed;


    replayIndex =
        0;


    isReplaying =
        true;


    resultMenu
        .classList
        .add(
            "hidden"
        );


    playReplay();

}


function playReplay() {

    if (
        !isReplaying
    ) {

        return;

    }


    if (
        replayIndex >=
        replayFrames.length
    ) {

        isReplaying =
            false;


        resultMenu
            .classList
            .remove(
                "hidden"
            );


        return;

    }


    const frame =
        replayFrames[
            replayIndex
        ];


    diver.position.set(

        frame.position.x,

        frame.position.y,

        frame.position.z

    );


    diver.rotation.set(

        frame.rotation.x,

        frame.rotation.y,

        frame.rotation.z

    );


    setPose(
        frame.pose
    );


    replayIndex +=
        replaySpeed;


    requestAnimationFrame(
        playReplay
    );

}


/* =========================================================
   ACTUALIZAR PUNTUACIÓN
   ========================================================= */

function updateScore() {

    scoreElement
        .textContent =

        Math.round(
            score
        );

}


/* =========================================================
   CONTROLES CONFIGURABLES
   ========================================================= */

function createControlSettings() {

    const container =
        document.getElementById(
            "keySettings"
        );


    container.innerHTML =
        "";


    Object.keys(
        controls
    )
    .forEach(

        action => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "binding";


            const label =
                document.createElement(
                    "span"
                );


            label.textContent =
                action;


            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                controls[action];


            button.onclick = () => {

                button.textContent =
                    "PULSA UNA TECLA";


                const listener =

                    event => {

                        controls[action] =
                            event.code;


                        button.textContent =
                            event.code;


                        window.removeEventListener(

                            "keydown",

                            listener

                        );

                    };


                window.addEventListener(

                    "keydown",

                    listener

                );

            };


            row.appendChild(
                label
            );


            row.appendChild(
                button
            );


            container.appendChild(
                row
            );

        }

    );

}


/* =========================================================
   ANIMACIÓN PRINCIPAL
   ========================================================= */

function animate() {

    animationId =
        requestAnimationFrame(
            animate
        );


    updateJump();


    /* CÁMARA */

    if (
        diver
    ) {

        const target =
            new THREE.Vector3(

                diver.position.x,

                diver.position.y,

                diver.position.z

            );


        const desiredCamera =
            new THREE.Vector3(

                12,

                diver.position.y
                +
                4,

                18

            );


        camera.position.lerp(

            desiredCamera,

            0.03

        );


        camera.lookAt(
            target
        );

    }


    renderer.render(

        scene,

        camera

    );

}


/* =========================================================
   RESIZE
   ========================================================= */

function onResize() {

    camera.aspect =

        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );

}


/* =========================================================
   ARRANCAR
   ========================================================= */

init();
