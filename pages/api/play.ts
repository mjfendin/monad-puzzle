import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Contoh menerima webhook Farcaster untuk `fc:frame:post_url`
  if (req.method === "POST") {
    // parsing payload Farcaster disini
    console.log("Farcaster payload:", req.body);

    res.status(200).json({ message: "Received" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
