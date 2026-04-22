// general request func with conveniences
export async function request<Response>(
  url: string | URL,
  options: RequestInit,
  parse: "json" | "text" = "json",
): Promise {
  // construct request
  const request = new Request(url, options);
  // make request
  const response = await fetch(request);
  // check status code
  if (!response.ok) throw Error("Response not OK");
  // parse response
  try {
    if (parse === "text") return (await response.text()) as Response;
    else return (await response.json()) as Response;
  } catch (e) {
    throw Error(`Couldn't parse response as ${parse}`);
  }
}
