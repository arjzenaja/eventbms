import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

// Helper function to read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { payments: [] };
  }
};

// Helper function to write database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
};

// POST - Verify payment (for manual verification by admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, verificationStatus, adminNotes, paymentProof } = body;

    if (!paymentId || !verificationStatus) {
      return NextResponse.json(
        { error: "Missing paymentId or verificationStatus" },
        { status: 400 }
      );
    }

    const validStatuses = ['verified', 'rejected', 'pending'];
    if (!validStatuses.includes(verificationStatus)) {
      return NextResponse.json(
        { error: "Invalid verification status" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const paymentIndex = payments.findIndex(p => p.id === paymentId);

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const payment = payments[paymentIndex];

    // Update payment with verification details
    payments[paymentIndex] = {
      ...payment,
      status: verificationStatus === 'verified' ? 'completed' : verificationStatus,
      verificationStatus,
      adminNotes: adminNotes || payment.adminNotes,
      paymentProof: paymentProof || payment.paymentProof,
      verifiedAt: verificationStatus === 'verified' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    // Write to database
    if (!writeDatabase(db)) {
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: payments[paymentIndex],
      message: `Payment ${verificationStatus} successfully`
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Get payment verification status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      verificationStatus: payment.verificationStatus || 'pending',
      verifiedAt: payment.verifiedAt,
      adminNotes: payment.adminNotes,
      paymentProof: payment.paymentProof
    });

  } catch (error) {
    console.error("Error fetching payment verification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
