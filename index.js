/**
 * Enhanced QIS
 * by Oshimani
 * 
 * THIS RUNS ON EVERY NAVIGATION
 */

// consts
const URL_PARAM_KEY_STATE = "state";
const URL_PARAM_VALUE_NOTEN_UEBERSICHT = "notenspiegelStudent";
const URL_PARAM_VALUE_PRUEFUNGS_ANMELDUNG = "prfAnmStudent";
const VOLUNTARY_COURSES_HEADING = "Freiwillige, zusätzliche Leistungen (keine Prüfungen)";

// run
if (typeof location !== "undefined" && typeof document !== "undefined") {
    const urlParams = new URLSearchParams(location.search);
    const state = urlParams.get(URL_PARAM_KEY_STATE);

    // check site (Prüfungsan- und abmeldung, Info über angemeldete Prüfungen, ..., Notenübersicht)
    switch (state) {
        // NOTENÜBERSICHT/NOTENSPIEGEL
        case URL_PARAM_VALUE_NOTEN_UEBERSICHT:
            initNotenUebersicht();
            break;
        case URL_PARAM_VALUE_PRUEFUNGS_ANMELDUNG:
            initPruefungsAnmeldung();
            break;
        /**
         * insert other states here if functions on other pages are implemented
         */
        default:
            console.log("[Enhanced QIS] could not identify site. No modifications.");
    }
}


function initNotenUebersicht() {
    const tableRows = getTableRows();

    formatTableCells(tableRows);
    const avgGrade = calcAvgGrade(tableRows);

    let noteCell;
    document.querySelectorAll("th.tabelleheader").forEach(e => {
        if (e.innerText === "Note") {
            noteCell = e;
        }
    });
    if (noteCell && avgGrade !== null) {
        noteCell.innerText += ` (${avgGrade.toFixed(2)})`;
    }
}

function getTableRows() {
    /* return second table on the page */
    return document.querySelectorAll("form table ~ table tbody tr");
}

function calcAvgGrade(tableRows) {
    const grades = [];
    let reachedVoluntaryCourses = false;

    tableRows.forEach(row => {
        if (normalizeText(row.innerText).includes(normalizeText(VOLUNTARY_COURSES_HEADING))) {
            reachedVoluntaryCourses = true;
        }

        // The voluntary section is the final section of the QIS grade overview.
        // Its entries are additional achievements and must not affect the average.
        if (reachedVoluntaryCourses) {
            return;
        }

        const gradeCell = row.children[3];
        const ectsCell = row.children[5];

        if (!gradeCell || !ectsCell) {
            return;
        }

        const gradeValue = parseFloat(gradeCell.innerText.replace(",", "."));
        const ectsValue = parseFloat(ectsCell.innerText.replace(",", "."));
        // skip missing grades and failed exams
        if (gradeValue > 0 && gradeValue < 5 && ectsValue > 0) {
            grades.push({
                ects: ectsValue,
                weighted: gradeValue * ectsValue
            });
        }
    });

    if (grades.length === 0) {
        return null;
    }

    const totals = grades.reduce((sum, grade) => ({
        ects: sum.ects + grade.ects,
        weighted: sum.weighted + grade.weighted
    }), { ects: 0, weighted: 0 });

    return totals.weighted / totals.ects;
}

function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
}

function formatTableCells(tableRows) {
    tableRows.forEach(row => {
        const pruefungsTextCell = row.children[1];
        const semesterCell = row.children[2];
        const statusCell = row.children[4];
        const vermerkCell = row.children[6];
        /* make BE green */
        if (statusCell.innerText === "BE") {
            statusCell.style.backgroundColor = "#00ef00";
        }
        /* make NB red */
        if (statusCell.innerText === "NB") {
            statusCell.style.backgroundColor = "#ef0000";
        }
        /* make AN yellow */
        if (statusCell.innerText === "AN" && vermerkCell.innerText !== "AT") {
            statusCell.style.backgroundColor = "#ebef00";
        }

        /* make AN + AT green in current year */
        if (vermerkCell.innerText === "AT") {
            const currentYear = String(new Date().getFullYear()).substr(2);
            if (semesterCell.innerText.indexOf(currentYear) > 1) {
                /* is current year => green */
                vermerkCell.style.backgroundColor = "#00ef00";
            } else {
                /* remove row */
                row.remove();
            }
        }

        /* remove rows with RT */
        if (vermerkCell.innerText === "RT") {
            row.remove();
        }


        /* remove modules */
        if (pruefungsTextCell.innerText.substr(0, 6) === "Modul:") {
            row.remove();
        }
    });
}

function initPruefungsAnmeldung() {
    setIndicatorsForCompletedCourses();
}

function setIndicatorsForCompletedCourses() {
    document.querySelectorAll("ul li.treelist a.Konto")
        .forEach(e => {
            if (e.innerText.includes("[Status: BE]")) {
                e.style.color = "rgb(0, 151, 0)";
                // e.innerText += " ✔️";
            }
        });
}

if (typeof module !== "undefined") {
    module.exports = { calcAvgGrade, normalizeText };
}
