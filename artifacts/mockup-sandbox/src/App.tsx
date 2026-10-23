import { useEffect, useState, type ComponentType } from "react";

import { modules as discoveredModules } from "./.generated/mockup-components";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

function _resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const fns = Object.values(mod).filter(
    (v) => typeof v === "function",
  ) as ComponentType[];
  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    fns[fns.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
  modules,
}: {
  componentPath: string;
  modules: ModuleMap;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setComponent(null);
    setError(null);

    async function loadComponent(): Promise<void> {
      const key = `./components/mockups/${componentPath}.tsx`;
      const loader = modules[key];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) {
          return;
        }
        const name = componentPath.split("/").pop()!;
        const comp = _resolveComponent(mod, name);
        if (!comp) {
          setError(
            `No exported React component found in ${componentPath}.tsx\n\nMake sure the file has at least one exported function component.`,
          );
          return;
        }
        setComponent(() => comp);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(`Failed to load preview.\n${message}`);
      }
    }

    void loadComponent();

    return () => {
      cancelled = true;
    };
  }, [componentPath, modules]);

  if (error) {
    return (
      <pre style={{ color: "red", padding: "2rem", fontFamily: "system-ui" }}>
        {error}
      </pre>
    );
  }

  if (!Component) return null;

  return <Component />;
}

function getBasePath(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

const SCREEN_LABELS: Record<string, string> = {
  Vendedor: "Espaço do vendedor",
  Gestor: "Área do gestor",
  Dados: "Dados e integrações",
  Painel: "Painel",
  Institucional: "Site institucional",
  InstitucionalMapa: "Mapa institucional",
  RespostaCliente: "Resposta ao cliente",
  SistemaVisual: "Sistema visual",
  ChatFaroPreview: "Chat do Faro",
};

const SCREEN_HINTS: Record<string, string> = {
  Vendedor: "Oportunidades do dia, próximo passo e registro de contato.",
  Institucional: "A apresentação pública do Faro IA.",
};

const PRIMARY_SCREENS = ["Institucional", "Vendedor"];

type Screen = { name: string; label: string; href: string };

function getScreens(): Screen[] {
  const basePath = getBasePath();
  return Object.keys(discoveredModules)
    .map((key) =>
      key.replace(/^\.\/components\/mockups\//, "").replace(/\.tsx$/, ""),
    )
    .filter((path) => !path.split("/").some((seg) => seg.startsWith("_")))
    .map((path) => {
      const name = path.split("/").pop() ?? path;
      return {
        name,
        label: SCREEN_LABELS[name] ?? name,
        href: `${basePath}/preview/${path}`,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function Gallery() {
  const screens = getScreens();
  const primary = PRIMARY_SCREENS.map((name) =>
    screens.find((s) => s.name === name),
  ).filter((s): s is Screen => Boolean(s));
  const secondary = screens.filter((s) => !PRIMARY_SCREENS.includes(s.name));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-8 sm:py-20">
        <header className="mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Encontre a oportunidade. Saiba o próximo passo.
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Faro IA
          </h1>
          <p className="mt-3 max-w-xl text-base text-stone-600 sm:text-lg">
            Protótipo do painel comercial. Escolha uma tela para navegar.
          </p>
        </header>

        {primary.length > 0 && (
          <section aria-labelledby="principais" className="mb-12">
            <h2 id="principais" className="sr-only">
              Telas principais
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {primary.map((s, i) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className={`group flex h-full min-h-44 flex-col justify-between rounded-2xl p-6 shadow-sm ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 active:translate-y-0 sm:p-8 ${
                      i === 0
                        ? "bg-stone-900 text-stone-50 ring-stone-900"
                        : "bg-white text-stone-900 ring-stone-200 hover:ring-stone-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        i === 0 ? "text-amber-300" : "text-amber-700"
                      }`}
                    >
                      Comece aqui
                    </span>
                    <span>
                      <span className="block text-2xl font-semibold tracking-tight sm:text-3xl">
                        {s.label}
                      </span>
                      {SCREEN_HINTS[s.name] && (
                        <span
                          className={`mt-2 block text-sm ${
                            i === 0 ? "text-stone-300" : "text-stone-500"
                          }`}
                        >
                          {SCREEN_HINTS[s.name]}
                        </span>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                        Abrir tela <ArrowIcon />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {secondary.length > 0 && (
          <section aria-labelledby="outras">
            <h2
              id="outras"
              className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500"
            >
              Outras telas
            </h2>
            <ul className="divide-y divide-stone-200 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 sm:bg-stone-200">
              {secondary.map((s) => (
                <li key={s.href} className="bg-white sm:odd:last:col-span-2">
                  <a
                    href={s.href}
                    className="group flex items-center justify-between gap-4 px-5 py-4 text-base font-medium text-stone-800 transition-colors hover:bg-amber-50 hover:text-stone-950 focus-visible:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500 active:bg-amber-100"
                  >
                    {s.label}
                    <span className="text-stone-400 group-hover:text-amber-700 group-focus-visible:text-amber-700">
                      <ArrowIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {screens.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-stone-600 ring-1 ring-stone-200">
            Nenhuma tela disponível no momento.
          </p>
        )}

        <footer className="mt-16 text-xs text-stone-400">
          Faro IA · Protótipo em português brasileiro
        </footer>
      </main>
    </div>
  );
}

function getPreviewPath(): string | null {
  const basePath = getBasePath();
  const { pathname } = window.location;
  const local =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const match = local.match(/^\/preview\/(.+)$/);
  return match ? match[1] : null;
}

function App() {
  const previewPath = getPreviewPath();

  if (previewPath) {
    return (
      <PreviewRenderer
        componentPath={previewPath}
        modules={discoveredModules}
      />
    );
  }

  return <Gallery />;
}

export default App;
