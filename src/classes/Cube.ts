import { getLetterToAlgMapping as getM2Mapping } from '../utils/cases/3x3x3/bldm2';
import { getLetterToAlgMapping as getOpMapping } from '../utils/cases/3x3x3/op';
import { Color, getCubeOrder, PuzzleType } from '../utils/cubingUtils';

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

    doEdgeSwaps = (swaps: string) => {
        const evenLetterSwapMap: { [key: string]: string } = {
            I: 'S',
            S: 'I',
            W: 'C',
            C: 'W',
        };
        const mapping = getM2Mapping();
        const swapList = swaps.split('').filter((l) => l !== ' ');
        swapList.forEach((swap, index) => {
            const swapToDo =
                swap === '-'
                    ? 'Parity'
                    : index % 2 === 1 && Object.hasOwn(evenLetterSwapMap, swap)
                    ? evenLetterSwapMap[swap]
                    : swap;

            mapping[swapToDo]?.split(' ').forEach((move) => {
                this.doMove(move);
            });
        });
    };

    doCornerSwaps = (swaps: string) => {
        const mapping = getOpMapping();
        const swapList = swaps.split('').filter((l) => l !== ' ');
        swapList.forEach((swap) => {
            mapping[swap]?.split(' ').forEach((move) => {
                this.doMove(move);
            });
        });
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

            case 'M':
                this.M(layerWidth);
                break;
            case "M'":
                this.M(layerWidth);
                this.M(layerWidth);
                this.M(layerWidth);
                break;
            case 'M2':
                this.M(layerWidth);
                this.M(layerWidth);
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
    };

    private U = (layerWidth: number) => {
        this.rotateFacePiecesCW(Color.WHITE);
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
    };

    private M = (layerWidth: number) => {
        const startSticker = Math.trunc(this.order / 2);

        for (let layer = 0; layer < layerWidth; layer++) {
            for (let i = 0; i < this.order; i++) {
                this.fourCycle(
                    { face: 4, sticker: this.order * this.order - 1 - startSticker - this.order * i - layer },
                    { face: 5, sticker: startSticker + this.order * i - layer },
                    { face: 2, sticker: startSticker + this.order * i - layer },
                    { face: 0, sticker: startSticker + this.order * i - layer },
                );
            }
        }
    };
}
