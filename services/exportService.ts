import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const generateIncomeStatementPDF = (year: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`FiNet - Income Statement FY ${year}`, 14, 22);
    
    // Define table data matching the UI
    const tableData = [
        ['REVENUE', ''],
        ['Revenue', '$798K'],
        ['Interest', '$2K'],
        ['Total Revenue', '$800K'],
        ['', ''],
        ['EXPENSES', ''],
        ['Software & SaaS', '-$17K'],
        ['Salaries', '-$536K'],
        ['Meals & Entertainment', '-$5K'],
        ['Marketing', '-$27K'],
        ['Professional Services', '-$55K'],
        ['Utilities', '-$2K'],
        ['Transfers', '-$45K'],
        ['Equipment', '-$13K'],
        ['Taxes', '-$35K'],
        ['Rent & Facilities', '-$12K'],
        ['Insurance', '-$10K'],
        ['Travel', '-$10K'],
        ['Office Supplies', '-$420'],
        ['Total Expenses', '-$768K'],
        ['', ''],
        ['EBITDA', '$32K'],
        ['Net Income', '$32K'],
        ['Net Margin %', '4.0%']
    ];

    autoTable(doc, {
        startY: 30,
        head: [['Category', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] }, // Slate 900 equivalent
        styles: { fontSize: 10 },
        willDrawCell: (data) => {
            // Apply bold styling for headers and totals
            if (data.row.raw[0] === 'REVENUE' || data.row.raw[0] === 'EXPENSES' || 
                data.row.raw[0] === 'Total Revenue' || data.row.raw[0] === 'Total Expenses' || 
                data.row.raw[0] === 'EBITDA' || data.row.raw[0] === 'Net Income') {
                data.cell.styles.fontStyle = 'bold';
            }
            // Apply red color for negative expense values
            if (data.row.raw[1] && data.row.raw[1].toString().startsWith('-')) {
                data.cell.styles.textColor = [244, 63, 94]; // Rose 500 equivalent
            }
        }
    });

    doc.save(`FiNet_Income_Statement_${year}.pdf`);
};

export const generateIncomeStatementExcel = (year: string) => {
    // Define table data with numerical values for Excel
    const tableData = [
        ['FiNet - Income Statement FY ' + year, ''],
        ['', ''],
        ['Category', 'Amount (USD)'],
        ['REVENUE', ''],
        ['Revenue', 798000],
        ['Interest', 2000],
        ['Total Revenue', 800000],
        ['', ''],
        ['EXPENSES', ''],
        ['Software & SaaS', -17000],
        ['Salaries', -536000],
        ['Meals & Entertainment', -5000],
        ['Marketing', -27000],
        ['Professional Services', -55000],
        ['Utilities', -2000],
        ['Transfers', -45000],
        ['Equipment', -13000],
        ['Taxes', -35000],
        ['Rent & Facilities', -12000],
        ['Insurance', -10000],
        ['Travel', -10000],
        ['Office Supplies', -420],
        ['Total Expenses', -768000],
        ['', ''],
        ['EBITDA', 32000],
        ['Net Income', 32000],
        ['Net Margin %', 0.04] // Representing 4.0%
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Statement");
    
    XLSX.writeFile(workbook, `FiNet_Income_Statement_${year}.xlsx`);
};
