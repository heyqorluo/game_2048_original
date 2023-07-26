import game_2048 from "../common/game_2048.js";
import R from "../common/ramda.js";
/**
 * 2048_test is a module to unit test the game 2048.
 * @namespace Test_2048
 * @author Peiqi Luo
 * @version 2022-06-30
 */

const DISPLAY_MODE = "to_string";

const display_functions = {
    "json": JSON.stringify
};
const display_board = function (board) {
    try {
        return "\n" + display_functions[DISPLAY_MODE](board);
    } catch (ignore) {
        return "\n" + JSON.stringify(board);
    }
};


const grid_columns = 4;
const grid_rows = 4;


/**
 * Returns if the board is valid.
 * A board is valid if all the following conditions are met:
 * - The board is a square 2d array.
 * - The board only contains numbers which are 0 or multiple of 2.
 * @memberof Test_2048
 * @function
 * @param {Array} board The board to check.
 * @throws {Error} If the board fails any of the above conditions.
 */

const throw_if_invalid = function (board) {
    // 2d array.
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array: " + display_board(board)
        );
    }
    const height = board.length;
    const square = R.all(
        (row) => row.length === height,
        board
    );
    // square board.
    if (!square) {
        throw new Error(
            "The board is not square: " + display_board(board)
        );
    }
    // all numbers are 0 or multiple of 2.
    const all_multiple_of_2 = R.all(
        (number) => number % 2 === 0,
        R.flatten(board)
    );
    if (!all_multiple_of_2) {
        throw new Error(
            "The board contains non-multiple of 2 numbers: " +
            display_board(board)
        );
    }
};


describe("Empty Board", function () {
    it("An empty board is valid", function () {
        const empty_board = game_2048.empty_board();
        throw_if_invalid(empty_board);
    });
    it("An empty board is not ended.", function () {
        const empty_board = game_2048.empty_board();
        if (game_2048.is_game_over(empty_board)) {
            throw new Error(
                "An empty board should not be ended: " +
                display_board(empty_board)
            );
        }
    });
    it("An empty board has only 0 cells.", function () {
        const empty_board = game_2048.empty_board();
        const all_0_cells = R.pipe(
            R.flatten,
            R.all(R.equals(0))
        )(empty_board);
        if (!all_0_cells) {
            throw new Error(
                "The empty board has non-0 cells: " +
                display_board(empty_board)
            );
        }
    });
    it(
        "An empty board has (grid_rows * grid_columns) empty cells.",
        function () {
            const empty_board = game_2048.empty_board();
            let number_of_0s = game_2048.count_empty_cells(empty_board);
            if (number_of_0s !== grid_rows * grid_columns) {
                throw new Error(
                    "The empty board has wrong number of empty cells: " +
                    display_board(empty_board)
                );
            }
        }
    );
});


const arbitrary_board = [
    [0, 0, 0, 0],
    [0, 2, 4, 16],
    [0, 2, 8, 4],
    [0, 2, 16, 2]
];
describe("Arbitrary board", function () {
    it(
        "Arbitrary board is valid",
        function () {
            throw_if_invalid(arbitrary_board);
        }
    );
    it(
        "Given a arbitrary board;" +
        "When making a move to the left;" +
        "Then the board is still valid.",
        function () {
            const moved_board = game_2048.slideLeft(arbitrary_board);
            throw_if_invalid(moved_board);
        }
    );
    it(
        "Given a arbitrary board;" +
        "When making a move to the right;" +
        "Then the board is still valid.",
        function () {
            const moved_board = game_2048.slideRight(arbitrary_board);
            throw_if_invalid(moved_board);
        }
    );
    it(
        "Given a arbitrary board;" +
        "When making a move to the up;" +
        "Then the board is still valid.",
        function () {
            const moved_board = game_2048.slideUp(arbitrary_board);
            throw_if_invalid(moved_board);
        }
    );
    it(
        "Given a arbitrary board;" +
        "When making a move to the down;" +
        "Then the board is still valid.",
        function () {
            const moved_board = game_2048.slideDown(arbitrary_board);
            throw_if_invalid(moved_board);
        }
    );
});


describe("Game over", function () {
    it(
        "Given a board with no 0 cells; " +
        "When checking if the board is full; " +
        "Returns that the board is full.",
        function () {
            const test_board = [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2]
            ];
            if (!game_2048.is_board_full(test_board)) {
                throw new Error(
                    "The board should be full: " +
                    display_board(test_board)
                );
            }
        }
    );
    it(
        "Given a board with different adjacent cells; " +
        "When checking if the adjacent cells are all different" +
        "Return that the adjacent cells are all different.",
        function () {
            const test_board = [
                [2, 4, 16, 8],
                [0, 8, 2, 4],
                [4, 2, 4, 0],
                [32, 16, 8, 4]
            ];
            if (!game_2048.is_adjacent_cells_different(test_board)) {
                throw new Error(
                    "The adjecent cells should be different in this board: " +
                    display_board(test_board)
                );
            }
        }
    );
    it(
        "Given a board with no 0 cells; " +
        "and all adjacent cells are different; " +
        "When checking if the board is ended" +
        "Return that the board is ended.",
        function () {
            const test_board = [
                [4, 8, 2, 4],
                [16, 2, 4, 2],
                [2, 16, 8, 16],
                [16, 4, 64, 32]
            ];
            if (!game_2048.is_game_over(test_board)) {
                throw new Error(
                    "The board should be ended: " +
                    display_board(test_board)
                );
            }
        }
    );
    it(
        "Given a board with no empty spaces; " +
        "After attempting to add a new tile; " +
        "Should be equivalent to the original board.",
        function () {
            const test_board = [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2]
            ];
            const new_board = game_2048.insert_cell(0, 2, test_board);
            if (!R.equals(test_board, new_board)) {
                throw new Error(
                    "The board should be unchanged: " +
                    display_board(test_board)
                );
            }
        }
    );
});


describe("Example based testing", function () {
    it("Left moves perform as expected", function () {
        const start = [
            [2, 2, 4, 4],
            [2, 0, 0, 2],
            [0, 0, 2, 2],
            [0, 2, 4, 8]
        ];
        const expected = [
            [4, 8, 0, 0],
            [4, 0, 0, 0],
            [4, 0, 0, 0],
            [2, 4, 8, 0]
        ];
        const move_left = game_2048.slideLeft(start);
        if (!R.equals(move_left, expected)) {
            throw new Error(
                "Left moves do not perform as expected: " +
                display_board(move_left)
            );
        }
    });
    it("Right moves perform as expected", function () {
        const start = [
            [2, 2, 4, 4],
            [2, 0, 0, 2],
            [0, 0, 2, 2],
            [0, 2, 4, 8]
        ];
        const expected = [
            [0, 0, 4, 8],
            [0, 0, 0, 4],
            [0, 0, 0, 4],
            [0, 2, 4, 8]
        ];
        const move_right = game_2048.slideRight(start);
        if (!R.equals(move_right, expected)) {
            throw new Error(
                "Right moves do not perform as expected: " +
                display_board(move_right)
            );
        }
    });
    it("Up moves perform as expected", function () {
        const start = [
            [2, 2, 4, 4],
            [2, 0, 0, 2],
            [0, 0, 2, 2],
            [0, 2, 4, 8]
        ];
        const expected = [
            [4, 4, 4, 4],
            [0, 0, 2, 4],
            [0, 0, 4, 8],
            [0, 0, 0, 0]
        ];
        const move_up = game_2048.slideUp(start);
        if (!R.equals(move_up, expected)) {
            throw new Error(
                "Up moves do not perform as expected: " +
                display_board(move_up)
            );
        }
    });
    it("Down moves perform as expected", function () {
        const start = [
            [2, 2, 4, 4],
            [2, 0, 0, 2],
            [0, 0, 2, 2],
            [0, 2, 4, 8]
        ];
        const expected = [
            [0, 0, 0, 0],
            [0, 0, 4, 4],
            [0, 0, 2, 4],
            [4, 4, 4, 8]
        ];
        const move_down = game_2048.slideDown(start);
        if (!R.equals(move_down, expected)) {
            throw new Error(
                "Down moves do not perform as expected: " +
                display_board(move_down)
            );
        }
    });
    it(
        "Given an arbitrary board;" +
        "when counting the number of empty cells;" +
        "then the number of empty cells is correct.",
        function () {
            const start = [
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 2, 0, 4],
                [0, 0, 16, 2]
            ];
            const empty_cells = game_2048.count_empty_cells(start);
            if (empty_cells !== 10) {
                throw new Error(
                    "The number of empty cells is not correct: " +
                    display_board(start)
                );
            }
        }
    );
    it(
        "Given an arbitrary board;" +
        "when inserting a new cell;" +
        "A new cell is inserted into specified empty position",
        function () {
            const start = [
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 2, 0, 4],
                [0, 0, 16, 2]
            ];
            const expected = [
                [0, 0, 0, 0],
                [0, 2, 4, 0],
                [0, 2, 0, 4],
                [2, 0, 16, 2]
            ];
            let inserted_board = game_2048.insert_cell(8, 2, start);
            if (!R.equals(inserted_board, expected)) {
                throw new Error(
                    "A new cell is not inserted into specified empty position: "
                    + display_board(inserted_board)
                );
            }
        }
    );
});


describe("Score calculator", function () {
    it(
        "Given an empty board; " +
        "When calculating the score; " +
        "The score is 0.",
        function () {
            const empty_board = game_2048.empty_board();
            const score = game_2048.calculate_score(empty_board);
            if (score !== 0) {
                throw new Error(
                    "The score should be 0: " +
                    display_board(empty_board)
                );
            }
        }
    );
    it(
        "Given a valid board; " +
        "After moving left, " +
        "when calculating the score; " +
        "the score remains the same.",
        function () {
            const test_board = [
                [2, 2, 4, 4],
                [2, 0, 0, 2],
                [0, 0, 2, 2],
                [0, 2, 4, 8]
            ];
            const score = game_2048.calculate_score(test_board);
            const moved_board = game_2048.slideLeft(test_board);
            const moved_score = game_2048.calculate_score(moved_board);
            if (score !== moved_score) {
                throw new Error(
                    "The score should remain the same: " +
                    display_board(test_board)
                );
            }
        }
    );
});