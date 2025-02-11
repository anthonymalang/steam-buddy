
export async function GET() {

  try {
    const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

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
