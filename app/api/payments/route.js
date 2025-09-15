import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateAdminAuth, createUnauthorizedResponse } from "../../../lib/admin-auth";

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

// GET - Get all payments or specific payment
export async function GET(request) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const db = readDatabase();
    let payments = db.payments || [];

    // Filter by payment ID
    if (paymentId) {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }
      return NextResponse.json({ payment });
    }

    // Filter by user ID
    if (userId) {
      payments = payments.filter(p => p.userId === userId);
    }

    // Filter by status
    if (status) {
      payments = payments.filter(p => p.status === status);
    }

    // Sort by creation date (newest first)
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new payment
export async function POST(request) {
  try {
    // For payment creation, we don't require admin authentication
    // This is called by customers during checkout
    const body = await request.json();
    console.log('Received payment data:', JSON.stringify(body, null, 2));
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const {
      orderData,
      paymentMethod,
      paymentForm,
      amount,
      fee,
      userId,
      paymentProof
    } = body;

    // Validate required fields
    if (!orderData || !paymentMethod || amount === undefined || amount === null) {
      console.error('Missing required fields:', { 
        orderData: !!orderData, 
        paymentMethod: !!paymentMethod, 
        amount: amount,
        amountType: typeof amount
      });
      return NextResponse.json(
        { error: "Missing required fields", details: { orderData: !!orderData, paymentMethod: !!paymentMethod, amount } },
        { status: 400 }
      );
    }

    const db = readDatabase();
    console.log('Database loaded:', { hasPayments: !!db.payments, paymentsCount: db.payments?.length || 0 });
    
    if (!db.payments) {
      console.log('Creating payments array...');
      db.payments = [];
    }

    // Generate unique payment ID
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated payment ID:', paymentId);

    // Calculate total amount
    const totalAmount = amount + (fee || 0);
    console.log('Calculated total amount:', totalAmount);

    // Create payment record
    const payment = {
      id: paymentId,
      userId: userId || null,
      orderData,
      paymentMethod,
      paymentForm,
      amount,
      fee: fee || 0,
      totalAmount,
      status: "pending",
      paymentProof: paymentProof || null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      updatedAt: new Date().toISOString()
    };

    console.log('Created payment object:', JSON.stringify(payment, null, 2));

    // Add to database
    console.log('Adding payment to database array...');
    console.log('Current payments count:', db.payments.length);
    db.payments.push(payment);
    console.log('After adding payment count:', db.payments.length);

    // Write to database
    console.log('Attempting to write to database...');
    const writeResult = writeDatabase(db);
    console.log('Write result:', writeResult);
    
    if (!writeResult) {
      console.error('Failed to write payment to database');
      return NextResponse.json(
        { error: "Failed to save payment", details: "Database write failed" },
        { status: 500 }
      );
    }

    console.log('Payment created successfully:', payment.id);
    console.log('Total payments in database:', db.payments.length);
    
    return NextResponse.json({
      success: true,
      payment,
      message: "Payment created successfully"
    });

  } catch (error) {
    console.error("Error creating payment:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update payment status
export async function PUT(request) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { paymentId, status, notes } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing paymentId or status" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const paymentIndex = payments.findIndex(p => p.id === paymentId);

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment
    payments[paymentIndex] = {
      ...payments[paymentIndex],
      status,
      notes: notes || payments[paymentIndex].notes,
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
      message: "Payment updated successfully"
    });

  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete payment
export async function DELETE(request) {
  try {
    // Validate admin authentication
    const authResult = validateAdminAuth(request);
    if (!authResult.isValid) {
      return createUnauthorizedResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing payment ID" },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const payments = db.payments || [];
    const paymentIndex = payments.findIndex(p => p.id === paymentId);

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
