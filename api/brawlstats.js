import fetch from 'node-fetch';

export async function brawlstats (message, client) {
  let playerTag = message.content.substring(message.content.indexOf(' ') + 1)
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjQzYzExZDMwLTA0MDYtNGQ2MC1hYzQzLTZmNTQ0NWRjODc4NSIsImlhdCI6MTY4ODk1OTk0Nywic3ViIjoiZGV2ZWxvcGVyLzM2NDBkODNkLWM0ZWUtYzRmZS02MDQwLWE1NWQzNGU4Nzg0NSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNDUuNzkuMjE4Ljc5Il0sInR5cGUiOiJjbGllbnQifV19.SYaEBcVL6lZGAE3G3ueP0tl7gAlJWKm6v3cfsb-oA0gSCxqhxhTxpPC9FN4nZOWp_qorTONzQP95YyDd0eulcg';
  const apiUrl = `https://bsproxy.royaleapi.dev/v1/players/%23${playerTag}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch player information.');
    }

    const data = await response.json();
    console.log(data)
    message.reply(`Your highest trophy count is ${data.highestTrophies}`)
  } catch (error) {
    console.error('Error:', error.message);
  }
}