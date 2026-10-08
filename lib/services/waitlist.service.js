import prisma from "../prisma";
import { createWaitlistRepository } from "../repositories/waitlist.repository";
import { createTicketCounterService } from "./ticket-counter.service";

export async function getWaitingList() {
  const repository = createWaitlistRepository(prisma);

  return repository.getAllEntries();
}
export async function getWaitlistEntry(ticketNumber) {
  const repository = createWaitlistRepository(prisma);

  const entry = await repository.findByTicket(ticketNumber);

  if (!entry) {
    return null;
  }

  const partiesAhead = await repository.countPartiesAhead(
    entry.joinedAt
  );

  return {
    ticketNumber: entry.ticketNumber,
    name: entry.name,
    partySize: entry.partySize,
    joinedAt: entry.joinedAt,
    partiesAhead,
  };
}

export async function removeFromWaitlist(ticketNumber) {
  const repository = createWaitlistRepository(prisma);

  const entry = await repository.findByTicket(ticketNumber);

  if (!entry) {
    return null;
  }

  await repository.deleteByTicket(ticketNumber);

  return entry;
}
export async function joinWaitlist({ name, partySize }) {
  return prisma.$transaction(async (tx) => {
    const repository = createWaitlistRepository(tx);
    const ticketCounterService = createTicketCounterService(tx);

    const ticketNumber =
      await ticketCounterService.getNextTicketNumber();

    const entry = await repository.createEntry({
      name,
      partySize,
      ticketNumber,
    });

    const partiesAhead = await repository.countPartiesAhead(
      entry.joinedAt
    );

    return {
      ticketNumber: entry.ticketNumber,
      name: entry.name,
      partySize: entry.partySize,
      partiesAhead,
    };
  });
}