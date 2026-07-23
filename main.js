import * as THREE from "three";

/* =========================================================
   WATER JUMP 3D
   Motor 3D + teclado + táctil + mando
   ========================================================= */


/* =========================================================
   VARIABLES
   ========================================================= */

let scene;
let camera;
let renderer;

let diver;

let jumping = false;
let isReplaying = false;

let jumpStartTime = 0;

let startDirection = "front";

let score = 0;

let pose = "straight";

let replayFrames = [];
let replayIndex = 0;
let replaySpeed = 1;

let lastTime = 0;


/* ROTACIONES */

let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;


/* VELOCIDADES */

let rotationVelocityX = 0;
let rotationVelocityY = 0;
let rotationVelocityZ = 0;


/* =========================================================
   CONTROLES DE TECLADO
   ========================================================= */

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
   ELEMENTOS HTML
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
   MANDO
   ========================================================= */

let connectedGamepad = null;

let previousGamepadButtons = [];


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function init() {

    createScene();

    createLights();

    createPool();

    createPlatform();

    createDiver();

    setupButtons();

    setupKeyboard();

    createControlSettings();

    window.addEventListener(
        "resize",
        onResize
    );

    window.addEventListener(
        "gamepadconnected",
        onGamepadConnected
    );

    window.addEventListener(
        "gamepaddisconnected",
        onGamepadDisconnected
    );

    animate();

}


/* =========================================================
   ESCENA
   ========================================================= */

function createScene() {

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x87ceeb
        );


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

        13,
        8,
        17

    );


    /* RENDER */

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


    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    document
        .getElementById("game")
        .appendChild(
            renderer.domElement
        );

}


/* =========================================================
   LUCES
   ========================================================= */

function createLights() {

    const ambient =
        new THREE.HemisphereLight(

            0xffffff,

            0x668899,

            2

        );


    scene.add(
        ambient
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

}


/* =========================================================
   PISCINA
   ========================================================= */

function createPool() {

    const floor =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                24,
                1,
                24

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0x178dcc,

                roughness:
                    0.4

            })

        );


    floor.position.y =
        -0.5;


    floor.receiveShadow =
        true;


    scene.add(
        floor
    );


    /* AGUA */

    const water =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                22,
                0.2,
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
                    0.1

            })

        );


    water.position.y =
        0;


    scene.add(
        water
    );


    /* BORDE DE LA PISCINA */

    const edgeMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xffffff

        });


    const edge1 =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                24,
                0.5,
                0.5

            ),

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


    const edge3 =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                0.5,
                0.5,
                24

            ),

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
   PLATAFORMA 7,5 METROS
   ========================================================= */

function createPlatform() {

    const tower =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                1.5,
                7.5,
                1.5

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0xaaaaaa,

                roughness:
                    0.7

            })

        );


    tower.position.y =
        3.75;


    tower.castShadow =
        true;


    scene.add(
        tower
    );


    const platform =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                3,
                0.35,
                3

            ),

            new THREE.MeshStandardMaterial({

                color:
                    0xeeeeee

            })

        );


    platform.position.y =
        7.5;


    platform.castShadow =
        true;


    scene.add(
        platform
    );

}


/* =========================================================
   CREAR PERSONAJE
   ========================================================= */

function createDiver() {

    diver =
        new THREE.Group();


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xff5533

        });


    const skinMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xffc49b

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


    diver.add(
        torso
    );


    diver.userData.torso =
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


    diver.add(
        head
    );


    /* BRAZOS */

    const leftArm =
        createLimb(
            bodyMaterial,
            0.2,
            1
        );


    leftArm.position.set(

        -0.55,
        1.55,
        0

    );


    diver.add(
        leftArm
    );


    diver.userData.leftArm =
        leftArm;


    const rightArm =
        createLimb(
            bodyMaterial,
            0.2,
            1
        );


    rightArm.position.set(

        0.55,
        1.55,
        0

    );


    diver.add(
        rightArm
    );


    diver.userData.rightArm =
        rightArm;


    /* PIERNAS */

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


    diver.add(
        leftLeg
    );


    diver.userData.leftLeg =
        leftLeg;


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


    diver.add(
        rightLeg
    );


    diver.userData.rightLeg =
        rightLeg;


    diver.position.set(

        0,
        7.5,
        0

    );


    scene.add(
        diver
    );

}


/* =========================================================
   EXTREMIDADES
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
   POSTURAS
   ========================================================= */

function setPose(
    newPose
) {

    if (
        !diver
    ) {

        return;

    }


    pose =
        newPose;


    const torso =
        diver.userData.torso;

    const leftArm =
        diver.userData.leftArm;

    const rightArm =
        diver.userData.rightArm;

    const leftLeg =
        diver.userData.leftLeg;

    const rightLeg =
        diver.userData.rightLeg;


    /* RESET */

    torso.rotation.set(
        0,
        0,
        0
    );


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

    }


    /* BOLA */

    if (
        newPose ===
        "tuck"
    ) {

        torso.rotation.x =
            -1.1;

        leftArm.rotation.x =
            -1.4;

        rightArm.rotation.x =
            -1.4;

        leftLeg.rotation.x =
            1.2;

        rightLeg.rotation.x =
            1.2;

    }

}


/* =========================================================
   BOTONES
   ========================================================= */

function setupButtons() {


    document
        .getElementById("freeMode")
        .onclick = () => {

            mainMenu
                .classList
                .add("hidden");

            preparationMenu
                .classList
                .remove("hidden");

        };


    document
        .getElementById("settings")
        .onclick = () => {

            mainMenu
                .classList
                .add("hidden");

            controlsMenu
                .classList
                .remove("hidden");

        };


    document
        .getElementById("closeControls")
        .onclick = () => {

            controlsMenu
                .classList
                .add("hidden");

            mainMenu
                .classList
                .remove("hidden");

        };


    document
        .getElementById("frontStart")
        .onclick = () => {

            startDirection =
                "front";

        };


    document
        .getElementById("backStart")
        .onclick = () => {

            startDirection =
                "back";

        };


    document
        .getElementById("startJump")
        .onclick =
        startJump;


    document
        .getElementById("backToMenu")
        .onclick = () => {

            preparationMenu
                .classList
                .add("hidden");

            mainMenu
                .classList
                .remove("hidden");

        };


    document
        .querySelectorAll(
            "#jumpInterface [data-action]"
        )
        .forEach(

            button => {

                button.addEventListener(

                    "pointerdown",

                    event => {

                        event.preventDefault();

                        performAction(

                            button.dataset.action

                        );

                    }

                );

            }

        );


    document
        .getElementById("replay")
        .onclick = () => {

            startReplay(
                1
            );

        };


    document
        .getElementById("slowReplay")
        .onclick = () => {

            startReplay(
                0.35
            );

        };


    document
        .getElementById("newJump")
        .onclick = () => {

            resultMenu
                .classList
                .add("hidden");

            preparationMenu
                .classList
                .remove("hidden");

        };

}


/* =========================================================
   TECLADO
   ========================================================= */

function setupKeyboard() {

    window.addEventListener(

        "keydown",

        event => {

            if (
                !jumping ||
                isReplaying
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
   ACCIONES
   ========================================================= */

function performAction(
    action
) {

    if (
        !jumping ||
        isReplaying
    ) {

        return;

    }


    const power =
        0.025;


    if (
        action ===
        "forward"
    ) {

        rotationVelocityX -=
            power;

    }


    if (
        action ===
        "backward"
    ) {

        rotationVelocityX +=
            power;

    }


    if (
        action ===
        "rollLeft"
    ) {

        rotationVelocityZ -=
            power;

    }


    if (
        action ===
        "rollRight"
    ) {

        rotationVelocityZ +=
            power;

    }


    if (
        action ===
        "spinLeft"
    ) {

        rotationVelocityY -=
            power;

    }


    if (
        action ===
        "spinRight"
    ) {

        rotationVelocityY +=
            power;

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


    diver.position.set(

        0,
        7.5,
        0

    );


    diver.rotation.set(

        0,
        rotationY,
        0

    );


    preparationMenu
        .classList
        .add("hidden");


    resultMenu
        .classList
        .add("hidden");


    jumpInterface
        .classList
        .remove("hidden");

}


/* =========================================================
   ACTUALIZAR SALTO
   ========================================================= */

function updateJump(
    delta
) {

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


    const duration =
        4;


    const progress =

        Math.min(

            elapsed /
            duration,

            1

        );


    /* TRAYECTORIA */

    const startHeight =
        7.5;


    const endHeight =
        0.8;


    const vertical =
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

        vertical +
        arc;


    /* ROTACIONES */

    rotationX +=

        rotationVelocityX *
        delta *
        60;


    rotationY +=

        rotationVelocityY *
        delta *
        60;


    rotationZ +=

        rotationVelocityZ *
        delta *
        60;


    /* FRENADO */

    rotationVelocityX *=
        Math.pow(
            0.985,
            delta * 60
        );


    rotationVelocityY *=
        Math.pow(
            0.985,
            delta * 60
        );


    rotationVelocityZ *=
        Math.pow(
            0.985,
            delta * 60
        );


    diver.rotation.set(

        rotationX,

        rotationY,

        rotationZ

    );


    /* GUARDAR REPETICIÓN */

    replayFrames.push({

        x:
            diver.position.x,

        y:
            diver.position.y,

        z:
            diver.position.z,

        rotationX:
            rotationX,

        rotationY:
            rotationY,

        rotationZ:
            rotationZ,

        pose:
            pose

    });


    if (
        progress >=
        1
    ) {

        finishJump();

    }

}


/* =========================================================
   FINAL
   ========================================================= */

function finishJump() {

    jumping =
        false;


    jumpInterface
        .classList
        .add("hidden");


    const rotations =

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

            rotations,

            20

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
        .remove("hidden");

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
        .add("hidden");


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
            .remove("hidden");


        return;

    }


    const frame =

        replayFrames[
            Math.floor(
                replayIndex
            )
        ];


    diver.position.set(

        frame.x,

        frame.y,

        frame.z

    );


    diver.rotation.set(

        frame.rotationX,

        frame.rotationY,

        frame.rotationZ

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
   MANDO - CONECTAR
   ========================================================= */

function onGamepadConnected(
    event
) {

    connectedGamepad =
        event.gamepad;


    previousGamepadButtons =
        [];


    console.log(

        "Mando conectado:",

        connectedGamepad.id

    );

}


/* =========================================================
   MANDO - DESCONECTAR
   ========================================================= */

function onGamepadDisconnected(
    event
) {

    if (

        connectedGamepad &&

        connectedGamepad.index ===
        event.gamepad.index

    ) {

        connectedGamepad =
            null;

    }

}


/* =========================================================
   OBTENER MANDO
   ========================================================= */

function getGamepad() {

    const gamepads =

        navigator.getGamepads
            ? navigator.getGamepads()
            : [];


    if (
        connectedGamepad
    ) {

        return (

            gamepads[
                connectedGamepad.index
            ]

            ||
            connectedGamepad

        );

    }


    for (
        const gamepad
        of gamepads
    ) {

        if (
            gamepad
        ) {

            connectedGamepad =
                gamepad;

            return gamepad;

        }

    }


    return null;

}


/* =========================================================
   LEER MANDO
   ========================================================= */

function updateGamepad() {

    if (
        !jumping ||
        isReplaying
    ) {

        return;

    }


    const gamepad =
        getGamepad();


    if (
        !gamepad
    ) {

        return;

    }


    /*
    STICK IZQUIERDO

    EJE 0:
    IZQUIERDA / DERECHA

    EJE 1:
    ARRIBA / ABAJO
    */


    let leftX =
        gamepad.axes[0] || 0;


    let leftY =
        gamepad.axes[1] || 0;


    /*
    STICK DERECHO
    */


    let rightX =
        gamepad.axes[2] || 0;


    let rightY =
        gamepad.axes[3] || 0;


    /*
    ZONA MUERTA
    */


    const deadzone =
        0.12;


    if (
        Math.abs(leftX)
        <
        deadzone
    ) {

        leftX =
            0;

    }


    if (
        Math.abs(leftY)
        <
        deadzone
    ) {

        leftY =
            0;

    }


    if (
        Math.abs(rightX)
        <
        deadzone
    ) {

        rightX =
            0;

    }


    if (
        Math.abs(rightY)
        <
        deadzone
    ) {

        rightY =
            0;

    }


    /*
    MORTAL DELANTE / ATRÁS
    */


    rotationVelocityX +=

        -leftY *
        0.0008;


    /*
    GIRO LATERAL
    */


    rotationVelocityZ +=

        leftX *
        0.0008;


    /*
    ROTACIÓN SOBRE EJE VERTICAL
    */


    rotationVelocityY +=

        rightX *
        0.0008;


    /*
    STICK DERECHO VERTICAL

    CONTROL DE POSTURA
    */


    if (
        rightY <
        -0.7
    ) {

        setPose(
            "straight"
        );

    }


    if (
        rightY >
        0.7
    ) {

        setPose(
            "tuck"
        );

    }


    /*
    BOTONES

    0 = A / X
    1 = B / O
    2 = X / CUADRADO
    3 = Y / TRIÁNGULO
    */


    const buttons =
        gamepad.buttons;


    /*
    A / X
    */


    if (
        buttons[0] &&
        buttons[0].pressed
    ) {

        setPose(
            "straight"
        );

    }


    /*
    B / O
    */


    if (
        buttons[1] &&
        buttons[1].pressed
    ) {

        setPose(
            "tuck"
        );

    }


    /*
    Y / TRIÁNGULO
    */


    if (
        buttons[3] &&
        buttons[3].pressed
    ) {

        setPose(
            "bend"
        );

    }


    /*
    L2

    MORTAL HACIA ATRÁS
    */


    if (
        buttons[6] &&
        buttons[6].value >
        0.1
    ) {

        rotationVelocityX +=

            buttons[6].value *
            0.001;

    }


    /*
    R2

    MORTAL HACIA DELANTE
    */


    if (
        buttons[7] &&
        buttons[7].value >
        0.1
    ) {

        rotationVelocityX -=

            buttons[7].value *
            0.001;

    }

}


/* =========================================================
   CONFIGURACIÓN DE CONTROLES
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
   ANIMACIÓN
   ========================================================= */

function animate(
    currentTime = 0
) {

    requestAnimationFrame(
        animate
    );


    let delta =

        (
            currentTime -
            lastTime
        )
        /
        1000;


    if (
        delta <= 0 ||
        delta > 0.1
    ) {

        delta =
            0.016;

    }


    lastTime =
        currentTime;


    updateGamepad();


    updateJump(
        delta
    );


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

                17

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
   REDIMENSIONAR
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
   INICIAR
   ========================================================= */

init();
