import { PuzzleType } from '../utils/cubingUtils';

enum Color {
    WHITE,
    ORANGE,
    GREEN,
    RED,
    BLUE,
    YELLOW,
}

type Face = Color[];
type CubeState = Face[];

type Piece = {
    face: number;
    sticker: number;
};

const ColorToFaceIndexMap = {
    [Color.WHITE]: 0,
    [Color.ORANGE]: 1,
    [Color.GREEN]: 2,
    [Color.RED]: 3,
    [Color.BLUE]: 4,
    [Color.YELLOW]: 5,
};

export default class Cube {
    private cubeState: CubeState;
    private order: number;

    constructor(scramble: string, puzzleType: PuzzleType) {
        this.order = parseInt(puzzleType[0]);
        // If the cube is even, increment it to make it odd. That way we can just hide the middle layer but keep it the same under the hood.
        if (this.order % 2 === 0) {
            this.order++;
        }
        const orderLength = this.order * this.order;
        this.cubeState = [
            Array(orderLength).fill(Color.WHITE),
            Array(orderLength).fill(Color.ORANGE),
            Array(orderLength).fill(Color.GREEN),
            Array(orderLength).fill(Color.RED),
            Array(orderLength).fill(Color.BLUE),
            Array(orderLength).fill(Color.YELLOW),
        ];

        if (scramble?.length) {
            this.scramble(scramble);
        }
    }

    resetCubeState = () => {
        const orderLength = this.order * this.order;
        this.cubeState = [
            Array(orderLength).fill(Color.WHITE),
            Array(orderLength).fill(Color.ORANGE),
            Array(orderLength).fill(Color.GREEN),
            Array(orderLength).fill(Color.RED),
            Array(orderLength).fill(Color.BLUE),
            Array(orderLength).fill(Color.YELLOW),
        ];
    };

    getState = () => {
        return this.cubeState;
    };

    scramble = (scramble: string) => {
        this.resetCubeState();
        scramble.split(' ').forEach((move) => {
            this.doMove(move);
        });
        return this.cubeState;
    };

    doMove = (move: string) => {
        switch (move) {
            case 'R':
                this.R();
                break;
            case "R'":
                this.R();
                this.R();
                this.R();
                break;
            case 'R2':
                this.R();
                this.R();
                break;

            case 'L':
                this.L();
                break;
            case "L'":
                this.L();
                this.L();
                this.L();
                break;
            case 'L2':
                this.L();
                this.L();
                break;

            case 'U':
                this.U();
                break;
            case "U'":
                this.U();
                this.U();
                this.U();
                break;
            case 'U2':
                this.U();
                this.U();
                break;

            case 'D':
                this.D();
                break;
            case "D'":
                this.D();
                this.D();
                this.D();
                break;
            case 'D2':
                this.D();
                this.D();
                break;

            case 'F':
                this.F();
                break;
            case "F'":
                this.F();
                this.F();
                this.F();
                break;
            case 'F2':
                this.F();
                this.F();
                break;

            case 'B':
                this.B();
                break;
            case "B'":
                this.B();
                this.B();
                this.B();
                break;
            case 'B2':
                this.B();
                this.B();
                break;
        }
    };

    private fourCycle = (first: Piece, second: Piece, third: Piece, fourth: Piece) => {
        const temp = this.cubeState[first.face][first.sticker];
        this.cubeState[first.face][first.sticker] = this.cubeState[second.face][second.sticker];
        this.cubeState[second.face][second.sticker] = this.cubeState[third.face][third.sticker];
        this.cubeState[third.face][third.sticker] = this.cubeState[fourth.face][fourth.sticker];
        this.cubeState[fourth.face][fourth.sticker] = temp;
    };

    private rotateFacePiecesCW = (color: Color) => {
        const face = ColorToFaceIndexMap[color];
        this.fourCycle({ face, sticker: 0 }, { face, sticker: 6 }, { face, sticker: 8 }, { face, sticker: 2 });
        this.fourCycle({ face, sticker: 1 }, { face, sticker: 3 }, { face, sticker: 7 }, { face, sticker: 5 });
    };

    private rotateEdgePieces = (faces: number[], stickers: number[]) => {
        this.fourCycle(
            { face: faces[0], sticker: stickers[0] },
            { face: faces[1], sticker: stickers[0] },
            { face: faces[2], sticker: stickers[0] },
            { face: faces[3], sticker: stickers[0] },
        );
        this.fourCycle(
            { face: faces[0], sticker: stickers[1] },
            { face: faces[1], sticker: stickers[1] },
            { face: faces[2], sticker: stickers[1] },
            { face: faces[3], sticker: stickers[1] },
        );
        this.fourCycle(
            { face: faces[0], sticker: stickers[2] },
            { face: faces[1], sticker: stickers[2] },
            { face: faces[2], sticker: stickers[2] },
            { face: faces[3], sticker: stickers[2] },
        );
    };

    private U = () => {
        this.rotateFacePiecesCW(Color.WHITE);
        this.rotateEdgePieces([2, 3, 4, 1], [0, 1, 2]);
    };

    private D = () => {
        this.rotateFacePiecesCW(Color.YELLOW);
        this.rotateEdgePieces([1, 4, 3, 2], [6, 7, 8]);
    };

    private R = () => {
        this.rotateFacePiecesCW(Color.RED);
        this.fourCycle(
            { face: 0, sticker: 2 },
            { face: 2, sticker: 2 },
            { face: 5, sticker: 2 },
            { face: 4, sticker: 6 },
        );
        this.fourCycle(
            { face: 0, sticker: 5 },
            { face: 2, sticker: 5 },
            { face: 5, sticker: 5 },
            { face: 4, sticker: 3 },
        );
        this.fourCycle(
            { face: 0, sticker: 8 },
            { face: 2, sticker: 8 },
            { face: 5, sticker: 8 },
            { face: 4, sticker: 0 },
        );
    };

    private L = () => {
        this.rotateFacePiecesCW(Color.ORANGE);
        this.fourCycle(
            { face: 4, sticker: 8 },
            { face: 5, sticker: 0 },
            { face: 2, sticker: 0 },
            { face: 0, sticker: 0 },
        );
        this.fourCycle(
            { face: 4, sticker: 5 },
            { face: 5, sticker: 3 },
            { face: 2, sticker: 3 },
            { face: 0, sticker: 3 },
        );
        this.fourCycle(
            { face: 4, sticker: 2 },
            { face: 5, sticker: 6 },
            { face: 2, sticker: 6 },
            { face: 0, sticker: 6 },
        );
    };

    private F = () => {
        this.rotateFacePiecesCW(Color.GREEN);
        this.fourCycle(
            { face: 0, sticker: 6 },
            { face: 1, sticker: 8 },
            { face: 5, sticker: 2 },
            { face: 3, sticker: 0 },
        );
        this.fourCycle(
            { face: 0, sticker: 7 },
            { face: 1, sticker: 5 },
            { face: 5, sticker: 1 },
            { face: 3, sticker: 3 },
        );
        this.fourCycle(
            { face: 0, sticker: 8 },
            { face: 1, sticker: 2 },
            { face: 5, sticker: 0 },
            { face: 3, sticker: 6 },
        );
    };

    private B = () => {
        this.rotateFacePiecesCW(Color.BLUE);
        this.fourCycle(
            { face: 3, sticker: 2 },
            { face: 5, sticker: 8 },
            { face: 1, sticker: 6 },
            { face: 0, sticker: 0 },
        );
        this.fourCycle(
            { face: 3, sticker: 5 },
            { face: 5, sticker: 7 },
            { face: 1, sticker: 3 },
            { face: 0, sticker: 1 },
        );
        this.fourCycle(
            { face: 3, sticker: 8 },
            { face: 5, sticker: 6 },
            { face: 1, sticker: 0 },
            { face: 0, sticker: 2 },
        );
    };
}
