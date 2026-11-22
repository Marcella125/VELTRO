import { spawn } from "node:child_process";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const appRoot = path.join(projectRoot, "src", "app");
const serverDirectories = ["api", "admin"];
const dynamicPages = [
  path.join(appRoot, "(site)", "page.tsx"),
  path.join(appRoot, "(site)", "fleet", "page.tsx"),
];
const carPage = path.join(appRoot, "(site)", "cars", "[slug]", "page.tsx");
const originalFiles = new Map();
const disabledFiles = [];

const staticCarPage = `import { notFound } from "next/navigation";
import { getPublicCars } from "@/controllers/car.controller";
import { CarDetails } from "@/views/sections/CarDetails";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicCars().map((car) => ({ slug: car.slug }));
}

type CarDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { slug } = await params;
  const car = getPublicCars().find((entry) => entry.slug === slug);
  if (!car) notFound();
  return <CarDetails car={car} returnHref="/fleet" returnLabel="Back to fleet" />;
}
`;

async function prepare() {
  for (const directory of serverDirectories) {
    await disableRouteFiles(path.join(appRoot, directory));
  }

  for (const file of dynamicPages) {
    const source = await readFile(file, "utf8");
    originalFiles.set(file, source);
    await writeFile(file, source.replace('export const dynamic = "force-dynamic";\n', ""), "utf8");
  }

  originalFiles.set(carPage, await readFile(carPage, "utf8"));
  await writeFile(carPage, staticCarPage, "utf8");
}

async function disableRouteFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await disableRouteFiles(file);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    const disabledFile = `${file}.pages-disabled`;
    await rename(file, disabledFile);
    disabledFiles.push({ file, disabledFile });
  }
}

async function restore() {
  for (const [file, source] of originalFiles) {
    await writeFile(file, source, "utf8");
  }

  for (const { file, disabledFile } of disabledFiles.reverse()) {
    await rename(disabledFile, file);
  }
}

function build() {
  const nextCli = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextCli, "build"], {
      cwd: projectRoot,
      env: { ...process.env, GITHUB_ACTIONS: "true" },
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`Pages build exited with code ${code}`)));
  });
}

let buildError;
try {
  await prepare();
  await build();
} catch (error) {
  buildError = error;
} finally {
  await restore();
}

if (buildError) throw buildError;
