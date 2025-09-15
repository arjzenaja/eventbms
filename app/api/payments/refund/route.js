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

// POST - Request refund for a payment
export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, reason, refundAmount } = body;
    
    console.log('Refund request:', { paymentId, reason, refundAmount });
    
    // Validate required fields
    if (!paymentId || !reason) {
      return NextResponse.json(
        { error: "Payment ID and reason are required" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    
    // Find the payment
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    const payment = payments[paymentIndex];
    
    // Check if payment is eligible for refund
    if (payment.status === 'completed') {
      return NextResponse.json(
        { error: "Completed payments cannot be refunded" },
        { status: 400 }
      );
    }

    // Calculate refund amount (default to total amount if not specified)
    const finalRefundAmount = refundAmount || payment.totalAmount;
    
    // Create refund record
    const refund = {
      id: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paymentId: paymentId,
      amount: finalRefundAmount,
      reason: reason,
      status: 'pending', // pending, approved, rejected, processed
      requestedAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null,
      refundMethod: payment.paymentMethod?.name || 'Original Payment Method'
    };

    // Update payment with refund information
    payments[paymentIndex] = {
      ...payment,
      refund: refund,
      status: 'refund_requested',
      updatedAt: new Date().toISOString()
    };

    // Write to database
    const success = writeDatabase(db);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save refund request" },
        { status: 500 }
      );
    }

    console.log('Refund request created:', refund.id);

    return NextResponse.json({
      success: true,
      message: "Refund request submitted successfully",
      refund: refund
    });

  } catch (error) {
    console.error("Refund request error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Process refund (admin only)
export async function PUT(request) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { refundId, action, adminNote } = body; // action: 'approve' or 'reject'
    
    console.log('Processing refund:', { refundId, action, adminNote });
    
    // Validate required fields
    if (!refundId || !action) {
      return NextResponse.json(
        { error: "Refund ID and action are required" },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    
    // Find the payment with refund
    const paymentIndex = payments.findIndex(p => p.refund?.id === refundId);
    if (paymentIndex === -1) {
      return NextResponse.json(
        { error: "Refund not found" },
        { status: 404 }
      );
    }

    const payment = payments[paymentIndex];
    const refund = payment.refund;
    
    // Check if refund is already processed
    if (refund.status !== 'pending') {
      return NextResponse.json(
        { error: "Refund has already been processed" },
        { status: 400 }
      );
    }

    // Update refund status
    const updatedRefund = {
      ...refund,
      status: action === 'approve' ? 'approved' : 'rejected',
      processedAt: new Date().toISOString(),
      processedBy: authResult.admin.email,
      adminNote: adminNote || null
    };

    // Update payment
    payments[paymentIndex] = {
      ...payment,
      refund: updatedRefund,
      status: action === 'approve' ? 'refunded' : 'refund_rejected',
      updatedAt: new Date().toISOString()
    };

    // Write to database
    const success = writeDatabase(db);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to process refund" },
        { status: 500 }
      );
    }

    console.log('Refund processed:', { refundId, action });

    return NextResponse.json({
      success: true,
      message: `Refund ${action}d successfully`,
      refund: updatedRefund
    });

  } catch (error) {
    console.error("Refund processing error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get refund status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    const refundId = searchParams.get("refundId");
    
    if (!paymentId && !refundId) {
      return NextResponse.json(
        { error: "Payment ID or Refund ID is required" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    
    let payment;
    if (paymentId) {
      payment = payments.find(p => p.id === paymentId);
    } else if (refundId) {
      payment = payments.find(p => p.refund?.id === refundId);
    }
    
    if (!payment || !payment.refund) {
      return NextResponse.json(
        { error: "Refund not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      refund: payment.refund,
      payment: {
        id: payment.id,
        status: payment.status,
        totalAmount: payment.totalAmount
      }
    });

  } catch (error) {
    console.error("Get refund error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
