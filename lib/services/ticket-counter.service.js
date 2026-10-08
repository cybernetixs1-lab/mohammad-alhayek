import { createTicketCounterRepository } from "@/lib/repositories/ticket-counter.repository";

export function createTicketCounterService(db) {
  const repository = createTicketCounterRepository(db);

  return {
    async getNextTicketNumber() {
      const counter = await repository.get();

      if (!counter) {
        await repository.create(2);
        return 1;
      }

      const ticketNumber = counter.nextTicketNumber;

      await repository.increment();

      return ticketNumber;
    },
  };
}