import { getCubeOrder, PuzzleType } from '../utils/cubingUtils';

export enum Color {
    WHITE,
    ORANGE,
    GREEN,
    RED,
    BLUE,
    YELLOW,
    GRAY,
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
    [Color.GRAY]: 6,
};
export const solidWhiteFace = new Array(9).fill(Color.WHITE);
export const solidOrangeFace = new Array(9).fill(Color.ORANGE);
export const solidGreenFace = new Array(9).fill(Color.GREEN);
export const solidRedFace = new Array(9).fill(Color.RED);
export const solidBlueFace = new Array(9).fill(Color.BLUE);
export const solidYellowFace = new Array(9).fill(Color.YELLOW);
export const solidGrayFace = new Array(9).fill(Color.GRAY);

export default class Cube {
    private cubeState: CubeState;
    private order: number;

    constructor(scramble: string, puzzleType: PuzzleType) {
        this.order = getCubeOrder(puzzleType);
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
        const isWideMove = move.includes('w');
        const hasLeadingWidthValue = isWideMove && !isNaN(parseInt(move[0]));
        const layerWidth = isWideMove ? (hasLeadingWidthValue ? parseInt(move[0]) : 2) : 1;
        if (isWideMove) {
            move = move.split('w').join('');
        }
        if (hasLeadingWidthValue) {
            move = move.slice(1);
        }
        switch (move) {
            case 'R':
                this.R(layerWidth);
                break;
            case "R'":
                this.R(layerWidth);
                this.R(layerWidth);
                this.R(layerWidth);
                break;
            case 'R2':
                this.R(layerWidth);
                this.R(layerWidth);
                break;

            case 'L':
                this.L(layerWidth);
                break;
            case "L'":
                this.L(layerWidth);
                this.L(layerWidth);
                this.L(layerWidth);
                break;
            case 'L2':
                this.L(layerWidth);
                this.L(layerWidth);
                break;

            case 'U':
                this.U(layerWidth);
                break;
            case "U'":
                this.U(layerWidth);
                this.U(layerWidth);
                this.U(layerWidth);
                break;
            case 'U2':
                this.U(layerWidth);
                this.U(layerWidth);
                break;

            case 'D':
                this.D(layerWidth);
                break;
            case "D'":
                this.D(layerWidth);
                this.D(layerWidth);
                this.D(layerWidth);
                break;
            case 'D2':
                this.D(layerWidth);
                this.D(layerWidth);
                break;

            case 'F':
                this.F(layerWidth);
                break;
            case "F'":
                this.F(layerWidth);
                this.F(layerWidth);
                this.F(layerWidth);
                break;
            case 'F2':
                this.F(layerWidth);
                this.F(layerWidth);
                break;

            case 'B':
                this.B(layerWidth);
                break;
            case "B'":
                this.B(layerWidth);
                this.B(layerWidth);
                this.B(layerWidth);
                break;
            case 'B2':
                this.B(layerWidth);
                this.B(layerWidth);
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

        const piecesFromCenterToEdge = Math.floor(this.order / 2);

        const maxIndex = this.order * this.order - 1;

        for (let j = 0; j < piecesFromCenterToEdge; j++) {
            for (let i = 0; i < this.order - 1 - j * 2; i++) {
                const innerOffsetPlus = j * (this.order + 1);
                const innerOffsetMinus = j * (this.order - 1);
                this.fourCycle(
                    { face, sticker: i + innerOffsetPlus },
                    { face, sticker: maxIndex + 1 - this.order - this.order * i - innerOffsetMinus },
                    { face, sticker: maxIndex - i - innerOffsetPlus },
                    { face, sticker: this.order - 1 + this.order * i + innerOffsetMinus },
                );
            }
        }

        /*this.fourCycle({ face, sticker: 0 }, { face, sticker: 6 }, { face, sticker: 8 }, { face, sticker: 2 });
        this.fourCycle({ face, sticker: 1 }, { face, sticker: 3 }, { face, sticker: 7 }, { face, sticker: 5 });*/
    };

    /*private rotateEdgePieces = (faces: number[], stickers: number[]) => {
        for (let i = 0; i < this.order; i++) {
            this.fourCycle(
                { face: faces[0], sticker: stickers[i] },
                { face: faces[1], sticker: stickers[i] },
                { face: faces[2], sticker: stickers[i] },
                { face: faces[3], sticker: stickers[i] },
            );
        }
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
    };*/

    private U = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.WHITE);
        //this.rotateEdgePieces([2, 3, 4, 1], [0, 1, 2]);
        for (let layer = 0; layer < layerWidth; layer++) {
            const layerOffset = layer * this.order;
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 2, sticker: i + layerOffset },
                    { face: 3, sticker: i + layerOffset },
                    { face: 4, sticker: i + layerOffset },
                    { face: 1, sticker: i + layerOffset },
                );
            }
        }
    };

    private D = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.YELLOW);
        //this.rotateEdgePieces([1, 4, 3, 2], [6, 7, 8]);
        const startIndex = this.order * this.order - this.order;
        for (let layer = 0; layer < layerWidth; layer++) {
            const layerOffset = layer * this.order;
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 1, sticker: startIndex + i - layerOffset },
                    { face: 4, sticker: startIndex + i - layerOffset },
                    { face: 3, sticker: startIndex + i - layerOffset },
                    { face: 2, sticker: startIndex + i - layerOffset },
                );
            }
        }
    };

    private R = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.RED);

        const orderLength = this.order * this.order;

        for (let layer = 0; layer < layerWidth; layer++) {
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 0, sticker: this.order - 1 + this.order * i - layer },
                    { face: 2, sticker: this.order - 1 + this.order * i - layer },
                    { face: 5, sticker: this.order - 1 + this.order * i - layer },
                    { face: 4, sticker: orderLength - this.order - this.order * i + layer },
                );
            }
        }

        /*this.fourCycle(
            { face: 0, sticker: 2 },
            { face: 2, sticker: 2 },
            { face: 5, sticker: 2 },
            { face: 4, sticker: 6 },
        );this.fourCycle(
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
        );*/
    };

    private L = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.ORANGE);

        const maxIndex = this.order * this.order - 1;

        for (let layer = 0; layer < layerWidth; layer++) {
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 4, sticker: maxIndex - this.order * i - layer },
                    { face: 5, sticker: this.order * i + layer },
                    { face: 2, sticker: this.order * i + layer },
                    { face: 0, sticker: this.order * i + layer },
                );
            }
        }

        /*this.fourCycle(
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
        );*/
    };

    private F = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.GREEN);

        const orderLength = this.order * this.order;
        const maxIndex = orderLength - 1;

        for (let layer = 0; layer < layerWidth; layer++) {
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 0, sticker: orderLength - this.order + i - this.order * layer },
                    { face: 1, sticker: maxIndex - this.order * i - layer },
                    { face: 5, sticker: this.order - 1 - i + this.order * layer },
                    { face: 3, sticker: i * this.order + layer },
                );
            }
        }

        /*this.fourCycle(
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
        );*/
    };

    private B = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.BLUE);

        const orderLength = this.order * this.order;
        const maxIndex = orderLength - 1;

        for (let layer = 0; layer < layerWidth; layer++) {
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 3, sticker: this.order - 1 + this.order * i - layer },
                    { face: 5, sticker: maxIndex - i - this.order * layer },
                    { face: 1, sticker: orderLength - this.order - this.order * i + layer },
                    { face: 0, sticker: i + this.order * layer },
                );
            }
        }

        /*this.fourCycle(
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
        );*/
    };
}
