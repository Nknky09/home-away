"use client";

import { jsPDF } from "jspdf";
import { formatDate, formatCurrency } from "@/app/utils/format";
import { Button } from "../ui/button"; // Adjust path if needed
import { FaFilePdf } from "react-icons/fa";

interface Property {
  name: string;
  country: string;
}

interface Reservation {
  orderTotal: number;
  totalNights: number;
  checkIn: Date; // Updated to match actual data type
  checkOut: Date; // Updated to match actual data type
  property: Property;
}

function GeneratePDFButton({ reservations }: { reservations: Reservation[] }) {
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(10);

    doc.text("Reservation Report", 20, 10);
    doc.text(`Total Bookings: ${reservations.length}`, 20, 20);

    let y = 30;
    doc.text("Property Name", 10, y);
    doc.text("Country", 60, y);
    doc.text("Nights", 90, y);
    doc.text("Total", 120, y);
    doc.text("Check In", 150, y);
    doc.text("Check Out", 200, y);
    y += 10;

    reservations.forEach(item => {
      const { orderTotal, totalNights, checkIn, checkOut } = item;
      const { name, country } = item.property;

      doc.text(name, 10, y);
      doc.text(country, 60, y);
      doc.text(String(totalNights), 90, y);
      doc.text(formatCurrency(orderTotal), 120, y);

      const formattedCheckIn = formatDate(checkIn); // No conversion needed
      const formattedCheckOut = formatDate(checkOut); // No conversion needed

      doc.text(formattedCheckIn, 150, y);
      doc.text(formattedCheckOut, 200, y);

      y += 10;
    });

    doc.save("reservations_report.pdf");
  };

  return (
    <Button
      onClick={generatePDF}
      size="lg" // Matches SubmitButton's size
      className="capitalize" // Matches SubmitButton's className
    >
      <FaFilePdf className="mr-2 h-4 w-4" />
      Download PDF Report
    </Button>
  );
}

export default GeneratePDFButton;
