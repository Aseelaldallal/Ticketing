const LandingPage = ({ currentUser, tickets }) => {
  console.log('Tickets', tickets);
  return currentUser ? <h1> You are signed in </h1> : <h1> You are not signed in</h1>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log('hello');
  const { data } = await client.get('/api/tickets');
  console.log('Data', data);
  return { tickets: data };
};

export default LandingPage;
