import fs from "fs";
import path from "path";

const API_URL =
  "https://routerhub-backend.onrender.com/api/products";

const OUTPUT_FILE = path.join(
  process.cwd(),
  "public",
  "sitemap-products.xml"
);

async function generateSitemap() {
  try {
    console.log("Fetching products...");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Adjust this if your API returns products differently
    const products = Array.isArray(data)
      ? data
      : data.products || [];

    console.log(`Found ${products.length} products`);

    const urls = products
      .filter((product) => product._id)
      .map(
        (product) => `  <url>
    <loc>https://routerkart.in/product/${product._id}</loc>
  </url>`
      )
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), {
      recursive: true,
    });

    fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

    console.log("✅ Product sitemap generated:");
    console.log(OUTPUT_FILE);
  } catch (error) {
    console.error("❌ Sitemap generation failed:");
    console.error(error.message);
    process.exit(1);
  }
}

generateSitemap();