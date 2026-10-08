import {
  getWaitlistEntry,
  removeFromWaitlist,
} from "../../../../lib/services/waitlist.service";

export async function GET(request, { params }) {
  try {
    const { ticketNumber: rawTicketNumber } = await params;
    const ticketNumber = Number(rawTicketNumber);

    if (!Number.isInteger(ticketNumber) || ticketNumber <= 0) {
      return Response.json(
        { error: "Invalid ticket number." },
        { status: 400 }
      );
    }

    const result = await getWaitlistEntry(ticketNumber);

    if (!result) {
      return Response.json(
        { error: "Ticket not found." },
        { status: 404 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("GET ticket failed:", error);

    return Response.json(
      {
        error: "Failed to retrieve ticket.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { ticketNumber: rawTicketNumber } = await params;
    const ticketNumber = Number(rawTicketNumber);

    if (!Number.isInteger(ticketNumber) || ticketNumber <= 0) {
      return Response.json(
        { error: "Invalid ticket number." },
        { status: 400 }
      );
    }

    const removed = await removeFromWaitlist(ticketNumber);

    if (!removed) {
      return Response.json(
        { error: "Ticket not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      ticketNumber: removed.ticketNumber,
    });
  } catch (error) {
    console.error("DELETE ticket failed:", error);

    return Response.json(
      {
        error: "Failed to remove ticket.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}