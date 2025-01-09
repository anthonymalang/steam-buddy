
export async function GET() {

  const API_KEY = process.env.API_KEY;
  const STEAM_ID = '76561198062732953';
  // const STEAM_ID = '76561198129243213';

  try {
    const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`);

    if (!response.ok) {
      throw new Error(`Steam API error: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data as a JSON response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ message: 'Failed to fetch data', error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
