export function createWaitlistRepository(db) {
  return {
    async createEntry(data) {
      return db.waitlistEntry.create({
        data,
      });
    },

    async countPartiesAhead(joinedAt) {
      return db.waitlistEntry.count({
        where: {
          joinedAt: {
            lt: joinedAt,
          },
        },
      });
    },

    async getAllEntries() {
      return db.waitlistEntry.findMany({
        orderBy: {
          joinedAt: "asc",
        },
      });
    },

    async findByTicket(ticketNumber) {
      return db.waitlistEntry.findUnique({
        where: {
          ticketNumber,
        },
      });
    },

    async deleteByTicket(ticketNumber) {
      return db.waitlistEntry.delete({
        where: {
          ticketNumber,
        },
      });
    },
  };
}