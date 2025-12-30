const BASE_URL = "https://api.dune.com/api/v1";

export async function fetchDuneResults(queryId: number, page = 1, limit = 10) {
  const res = await fetch(
    `${BASE_URL}/query/${queryId}/results?limit=${limit}&offset=${(page - 1) * limit}`,
    {
      headers: {
        "X-Dune-API-Key": process.env.NEXT_PUBLIC_DUNE_API_KEY as string
      },
      cache: "no-store"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Dune data");
  }

  const data = await res.json();
  return data.result?.rows ?? [];
}
