export function createTicketCounterRepository(db) {
  return {
    async get() {
      return db.ticketCounter.findUnique({
        where: {
          id: 1,
        },
      });
    },

    async create(nextTicketNumber) {
      return db.ticketCounter.create({
        data: {
          id: 1,
          nextTicketNumber,
        },
      });
    },

    async increment() {
      return db.ticketCounter.update({
        where: {
          id: 1,
        },
        data: {
          nextTicketNumber: {
            increment: 1,
          },
        },
      });
    },
  };
}