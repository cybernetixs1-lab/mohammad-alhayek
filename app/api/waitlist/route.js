import { validateJoinWaitlistInput } from "../../../lib/validators/waitlist.validator";
import {
  joinWaitlist,
  getWaitingList,
} from "../../../lib/services/waitlist.service";

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = validateJoinWaitlistInput(body);

    if (!validation.valid) {
      return Response.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const result = await joinWaitlist(validation.data);

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/waitlist failed:", error);

    return Response.json(
      {
        error: "Failed to join the waitlist.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await getWaitingList();

    return Response.json(entries);
  } catch (error) {
    console.error("GET /api/waitlist failed:", error);

    return Response.json(
      {
        error: "Failed to retrieve the waitlist.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}