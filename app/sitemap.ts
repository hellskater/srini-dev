import { promises as fs } from "fs";
import path from "path";

async function getBlogSlugs(dir: string) {
  const entries = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile() && entry.name === "page.mdx")
    .map((entry) => {
      const relativePath = path.relative(
        dir,
        path.join(entry.parentPath, entry.name)
      );
      return path.dirname(relativePath);
    })
    .map((slug) => slug.replace(/\\/g, "/"));
}

export default async function sitemap() {
  const notesDirectory = path.join(process.cwd(), "app", "blog");
  const slugs = await getBlogSlugs(notesDirectory);

  const blogs = slugs.map((slug) => ({
    url: `https://sriniously.xyz/blog/${slug}`,
    lastModified: new Date().toISOString(),
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `https://sriniously.xyz${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...blogs];
}
