const assert = require("node:assert/strict");
const test = require("node:test");

const { calcAvgGrade, normalizeText } = require("../index.js");

function row(text, grade = "", ects = "") {
    const children = Array.from({ length: 6 }, () => ({ innerText: "" }));
    children[3].innerText = grade;
    children[5].innerText = ects;
    return { children, innerText: text };
}

test("calculates the ECTS-weighted average", () => {
    const average = calcAvgGrade([
        row("Mathematik", "1,0", "5"),
        row("Informatik", "2,0", "10")
    ]);

    assert.equal(average, 5 / 3);
});

test("excludes all grades below the voluntary courses heading", () => {
    const average = calcAvgGrade([
        row("Pflichtleistungen"),
        row("Mathematik", "2,0", "5"),
        row("  Freiwillige, zusätzliche Leistungen\n(keine Prüfungen)  "),
        row("Sprachkurs", "1,0", "10")
    ]);

    assert.equal(average, 2);
});

test("returns null if there are no relevant grades", () => {
    assert.equal(calcAvgGrade([
        row("Freiwillige, zusätzliche Leistungen (keine Prüfungen)"),
        row("Sprachkurs", "1,0", "5")
    ]), null);
});

test("normalizes whitespace for reliable section matching", () => {
    assert.equal(normalizeText("  zusätzliche\n  Leistungen "), "zusätzliche Leistungen");
});
