const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { describe, it } = require("node:test");
const path = require("node:path");
const { calculate } = require("../calculator");

describe("calculate", () => {
  it("adds the example values", () => {
    assert.equal(calculate(2, "+", 3), 5);
  });

  it("subtracts the example values", () => {
    assert.equal(calculate(10, "-", 4), 6);
  });

  it("multiplies the example values", () => {
    assert.equal(calculate(45, "*", 2), 90);
  });

  it("divides the example values", () => {
    assert.equal(calculate(20, "/", 5), 4);
  });

  it("supports decimal and negative operands", () => {
    assert.equal(calculate(-2.5, "+", 1.25), -1.25);
    assert.equal(calculate(-3, "*", -4), 12);
    assert.equal(calculate(7.5, "/", 2.5), 3);
  });

  it("supports zero as an operand when not dividing by zero", () => {
    assert.equal(calculate(0, "+", 5), 5);
    assert.equal(calculate(5, "*", 0), 0);
    assert.equal(calculate(0, "/", 5), 0);
  });

  it("rejects division by zero, including negative zero", () => {
    assert.throws(() => calculate(1, "/", 0), {
      message: "Cannot divide by zero.",
    });
    assert.throws(() => calculate(1, "/", -0), {
      message: "Cannot divide by zero.",
    });
  });

  it("rejects non-finite operands", () => {
    for (const operand of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      assert.throws(() => calculate(operand, "+", 1), {
        message: "Both operands must be finite numbers.",
      });
      assert.throws(() => calculate(1, "-", operand), {
        message: "Both operands must be finite numbers.",
      });
    }
  });

  it("rejects unsupported operations", () => {
    assert.throws(() => calculate(1, "%", 2), {
      message: "Unsupported operation: %",
    });
  });
});

describe("calculator CLI", () => {
  const calculatorPath = path.join(__dirname, "..", "calculator.js");

  it("prints a result for a valid expression", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "45", "*", "2"],
      { encoding: "utf8" },
    );

    assert.equal(result.status, 0);
    assert.equal(result.stdout, "90\n");
    assert.equal(result.stderr, "");
  });

  it("prints usage and fails when arguments are missing", () => {
    const result = spawnSync(process.execPath, [calculatorPath], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /^Usage:/);
  });

  it("reports division by zero and fails", () => {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, "20", "/", "0"],
      { encoding: "utf8" },
    );

    assert.equal(result.status, 1);
    assert.equal(result.stderr, "Cannot divide by zero.\n");
  });
});
