/**
 * A custom TypeScript port of OrbitControls with exposed touch methods for native overrides.
 *
 * @author EvanBacon / https://github.com/evanbacon
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 * @author ScieCode / http://github.com/sciecode
 */
import { EventDispatcher, MOUSE, TOUCH, Vector3, Camera } from 'three';
export declare class OrbitControls extends EventDispatcher {
    object: Camera & {
        fov: number;
        top: number;
        right: number;
        left: number;
        bottom: number;
        zoom: number;
        updateProjectionMatrix: () => void;
        isOrthographicCamera?: boolean;
        isPerspectiveCamera?: boolean;
    };
    enabled: boolean;
    target: Vector3;
    minDistance: number;
    maxDistance: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableKeys: boolean;
    keys: {
        LEFT: number;
        UP: number;
        RIGHT: number;
        BOTTOM: number;
    };
    mouseButtons: {
        LEFT: MOUSE;
        MIDDLE: MOUSE;
        RIGHT: MOUSE;
    };
    touches: {
        ONE: TOUCH;
        TWO: TOUCH;
    };
    target0: Vector3;
    position0: Vector3;
    zoom0: number;
    update: () => boolean;
    private changeEvent;
    private startEvent;
    private endEvent;
    private state;
    private spherical;
    private sphericalDelta;
    private scale;
    private panOffset;
    private zoomChanged;
    private rotateStart;
    private rotateEnd;
    private rotateDelta;
    private panStart;
    private panEnd;
    private panDelta;
    private dollyStart;
    private dollyEnd;
    private dollyDelta;
    private panLeft;
    private panUp;
    private pan;
    domElement?: any;
    constructor(object: Camera & {
        fov: number;
        top: number;
        right: number;
        left: number;
        bottom: number;
        zoom: number;
        updateProjectionMatrix: () => void;
        isOrthographicCamera?: boolean;
        isPerspectiveCamera?: boolean;
    }, ref?: any);
    getPolarAngle: () => number;
    getAzimuthalAngle: () => number;
    saveState: () => void;
    reset: () => void;
    dispose: () => void;
    private getAutoRotationAngle;
    private getZoomScale;
    private rotateLeft;
    private rotateUp;
    private dollyIn;
    private dollyOut;
    width: number;
    getElementWidth: () => number;
    height: number;
    getElementHeight: () => number;
    private handleMouseDownRotate;
    private handleMouseDownDolly;
    private handleMouseDownPan;
    private handleMouseMoveRotate;
    private handleMouseMoveDolly;
    private handleMouseMovePan;
    private handleMouseUp;
    private handleMouseWheel;
    private handleKeyDown;
    private handleTouchStartRotate;
    private handleTouchStartPan;
    private handleTouchStartDolly;
    private handleTouchStartDollyPan;
    private handleTouchStartDollyRotate;
    private handleTouchMoveRotate;
    private handleTouchMovePan;
    private handleTouchMoveDolly;
    private handleTouchMoveDollyPan;
    private handleTouchMoveDollyRotate;
    private handleTouchEnd;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    onMouseWheel: (event: any) => void;
    onKeyDown: (event: any) => void;
    onTouchStart: (event: any) => void;
    onTouchMove: (event: any) => void;
    onTouchEnd: (event: any) => void;
    onContextMenu: (event: any) => void;
}
