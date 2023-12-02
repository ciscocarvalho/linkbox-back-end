import { Router } from "express";
import fetch from "node-fetch";
import parse from "node-html-parser";

const urlTitlesRouter = Router();

const getUrlTitle = async (url: string) => {
  url = url.trim();

  if (!url) {
    return null;
  }

  const res = await fetch(url, { method: "get" });

  const page = parse(await res.text());
  const title = page.querySelector("title")?.textContent;
  return title ?? null;
};

urlTitlesRouter.get("/:url", async (req, res) => {
  try {
    const { url } = req.params;
    res.sendData({ title: await getUrlTitle(url) });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default urlTitlesRouter;
