import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of the ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  // Save the ticket to DB
  await ticket.save(); // update-if-current should assign version
  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // Make two seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // save the first fetched ticket
  await firstInstance!.save();
  // save the second fetched ticket --> It'll have an outdated version number because
  // when we saved first fetched ticket it would have increment version number in DB
  // so expect error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
  throw new Error('should not reach this point');
  // Normally the below would work, but jest has issues with TS, so we had to do hack above
  //   expect(async () => {
  //     await secondInstance!.save();
  //   }).toThrow();
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
