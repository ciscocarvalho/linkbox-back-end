import { Router } from "express";
import fetch from "node-fetch";
import parse from "node-html-parser";

const urlTitlesRouter = Router();

const getUrlTitle = async (url: string) => {
  url = url.trim();

  if (!url) {
    throw new Error("No URL provided")
  }

  const res = await fetch(url, { method: "get" });

  const page = parse(await res.text());
  const title = page.querySelector("title")?.textContent;
  return title ?? null;
}

urlTitlesRouter.get("/:url", async (req, res) => {
  try {
    const { url } = req.params;
    res.status(200).json({ data: { title: await getUrlTitle(url) } });
  } catch (error: any) {
    res.status(404).json({ error: { message: error.message } });
  }
});

export default urlTitlesRouter;
