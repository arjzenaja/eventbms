import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateAdminAuth, createUnauthorizedResponse } from "../../../../lib/admin-auth";

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

// GET - Get specific payment by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const payment = payments.find(p => p.id === id);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update specific payment
export async function PUT(request, { params }) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes, paymentProof, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const paymentIndex = payments.findIndex(p => p.id === id);

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment
    const updatedPayment = {
      ...payments[paymentIndex],
      status: status || payments[paymentIndex].status,
      notes: notes || payments[paymentIndex].notes,
      paymentProof: paymentProof || payments[paymentIndex].paymentProof,
      adminNotes: adminNotes || payments[paymentIndex].adminNotes,
      updatedAt: new Date().toISOString()
    };

    // If status is being updated to 'completed', add completion timestamp
    if (status === 'completed' && payments[paymentIndex].status !== 'completed') {
      updatedPayment.completedAt = new Date().toISOString();
    }

    // If status is being updated to 'cancelled', add cancellation timestamp
    if (status === 'cancelled' && payments[paymentIndex].status !== 'cancelled') {
      updatedPayment.cancelledAt = new Date().toISOString();
    }

    payments[paymentIndex] = updatedPayment;

    // Write to database
    if (!writeDatabase(db)) {
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: "Payment updated successfully"
    });

  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete specific payment
export async function DELETE(request, { params }) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const paymentIndex = payments.findIndex(p => p.id === id);

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Remove payment
    payments.splice(paymentIndex, 1);

    // Write to database
    if (!writeDatabase(db)) {
      return NextResponse.json(
        { error: "Failed to delete payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
