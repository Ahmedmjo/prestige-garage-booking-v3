import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

async function checkAuth(req: NextRequest) {
  const settings = await getSettings();
  const pin = req.headers.get("x-admin-pin");
  return pin === settings.adminPin;
}

// GET a single customer with their full booking history.
// Returns only safe public fields — never password/sessionToken.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        orderBy: [{ date: "desc" }, { time: "desc" }],
        include: {
          service: { include: { variants: true } },
          branch: true,
        },
      },
    },
  });
  if (!customer) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  // Whitelist only the safe fields — strip any sensitive fields (password, sessionToken)
  // even if they exist on the model.
  const safe = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    carType: customer.carType,
    carBrand: customer.carBrand,
    carModel: customer.carModel,
    carPlate: customer.carPlate,
    bookingsCount: customer.bookingsCount,
    lastVisit: customer.lastVisit,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    totalBookings: customer._count.bookings,
  };
  return NextResponse.json({
    customer: safe,
    bookings: customer.bookings,
  });
}

