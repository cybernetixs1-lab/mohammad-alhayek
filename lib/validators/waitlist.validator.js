export function validateJoinWaitlistInput(body) {
  const name =
    typeof body?.name === "string"
      ? body.name.trim()
      : "";

  const partySize = Number(body?.partySize);

  if (!name) {
    return {
      valid: false,
      error: "Name is required.",
    };
  }

  if (!Number.isInteger(partySize) || partySize <= 0) {
    return {
      valid: false,
      error: "Party size must be a whole number greater than zero.",
    };
  }

  return {
    valid: true,
    data: {
      name,
      partySize,
    },
  };
}