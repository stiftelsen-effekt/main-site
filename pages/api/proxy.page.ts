import type { NextApiRequest, NextApiResponse } from "next";

interface ProxyErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ProxyErrorResponse>, // Use `any` for proxied response, or define a more specific type if possible
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const targetUrl = decodeURIComponent(req.query.targetUrl as string);
  console.log("Target URL:", targetUrl);

  if (typeof targetUrl !== "string" || !targetUrl) {
    return res
      .status(400)
      .json({ error: "Target URL is required as a query parameter (targetUrl)." });
  }

  try {
    // Prepare the headers to forward. Be selective.
    const headersToForward: Record<string, string> = {};
    if (req.headers["content-type"]) {
      headersToForward["Content-Type"] = req.headers["content-type"];
    } else {
      headersToForward["Content-Type"] = "application/json"; // Default if not provided
    }
    if (req.headers["accept"]) {
      headersToForward["Accept"] = req.headers["accept"];
    } else {
      headersToForward["Accept"] = "application/json"; // Default if not provided
    }

    // Add any other specific headers you need to forward, e.g., Authorization
    if (req.headers["authorization"]) {
      headersToForward["Authorization"] = req.headers["authorization"] as string;
    }
    // Add other custom headers as needed:
    // if (req.headers['x-custom-header']) {
    //   headersToForward['X-Custom-Header'] = req.headers['x-custom-header'] as string;
    // }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headersToForward,
      body:
        req.method === "POST"
          ? typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body)
          : undefined, // Handle if body is already stringified or an object
      redirect: "manual", // Important: handle redirects manually to pass them on
    });

    console.log(response.status, response.statusText);

    // Forward headers from the target API to the client
    response.headers.forEach((value, name) => {
      // Be careful about which headers you forward.
      // Some headers like 'set-cookie' might need special handling or shouldn't be blindly forwarded.
      // 'content-encoding' and 'transfer-encoding' can also cause issues if not handled correctly by Next.js.
      // Next.js/Node.js might handle these automatically or they might need to be stripped.
      if (name.toLowerCase() !== "content-encoding" && name.toLowerCase() !== "transfer-encoding") {
        res.setHeader(name, value);
      }
    });

    // Handle redirects
    if (response.status >= 300 && response.status < 400 && response.headers.has("location")) {
      const locationHeader = response.headers.get("location");
      if (locationHeader) {
        res.redirect(response.status, locationHeader);
        return;
      } else {
        // This case should ideally not happen if status is 3xx and Location is expected
        console.warn(`Redirect status ${response.status} but no Location header found.`);
        // Fall through to send body if any, or just status
      }
    }

    // Send the response body from the target API
    const responseData = await response.text(); // Get as text to handle various content types
    res.status(response.status).send(responseData);
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "An error occurred while proxying the request.",
      details: error.message || String(error),
    });
  }
}
