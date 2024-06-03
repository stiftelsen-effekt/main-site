import { NextApiRequest, NextApiResponse } from "next";

export default async function tax(req: NextApiRequest, res: NextApiResponse) {
  if (req?.query?.locale === "SV") {
    try {
      console.log(req.body);
      const result = await fetch(
        `https://app.skatteverket.se/rakna-skatt-client-skut-skatteutrakning/api/skatteberakning-fysisk/rakna-ut-skatt`,
        {
          body: JSON.stringify(req.body),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      const data = await result.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  } else if (req?.query?.locale === "NO") {
    try {
      const result = await fetch(`https://skatteberegning.app.skatteetaten.no/2023`, {
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await result.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: (error as any).message });
    }
  }
  return res.status(400).json({ error: "Invalid locale" });
}
