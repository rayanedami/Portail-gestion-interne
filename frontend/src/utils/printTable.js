import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

function createFileName(title) {
    return title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
}

export function printTable({ title, headers, rows, fileName }) {
    const document = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    document.setFontSize(16);
    document.setTextColor(16, 24, 40);
    document.text(title, 14, 15);

    autoTable(document, {
        startY: 22,
        head: [headers],
        body: rows.length ? rows : [["Aucune donnée à exporter."]],
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 3,
            overflow: "linebreak",
            textColor: [16, 24, 40],
            lineColor: [152, 162, 179],
            lineWidth: 0.2
        },
        headStyles: {
            fillColor: [242, 244, 247],
            textColor: [16, 24, 40],
            fontStyle: "bold"
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        didParseCell: (data) => {
            if (!rows.length && data.section === "body") {
                data.cell.colSpan = headers.length;
                data.cell.styles.halign = "center";
            }
        }
    });

    document.save(`${fileName || createFileName(title)}.pdf`);
}
