import prisma from "@/lib/prisma";
import { createWaitlistRepository } from "@/lib/repositories/waitlist.repository";

const repository = createWaitlistRepository(prisma);

export async function joinWaitlist({ name, partySize }) {
  return prisma.$transaction(async (tx) => {
    const transactionRepository = createWaitlistRepository(tx);

    const counter = await transactionRepository.getCounter();

    let ticketNumber;

    if (!counter) {
      ticketNumber = 1;

      await transactionRepository.createCounter(2);
    } else {
      ticketNumber = counter.nextTicketNumber;

      await transactionRepository.incrementCounter();
    }

    const entry = await transactionRepository.createEntry({
      name,
      partySize,
      ticketNumber,
    });

    const partiesAhead =
      await transactionRepository.countPartiesAhead(
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