import uFuzzy from "@leeoniya/ufuzzy";
import { For, Show, batch, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const autocompletes = [
  "Alfalfa Sprouts",
  "Apple",
  "Apricot",
  "Artichoke",
  "Asian Pear",
  "Asparagus",
  "Atemoya",
  "Avocado",
  "Bamboo Shoots",
  "Banana",
  "Bean Sprouts",
  "Beans",
  "Beets",
  "Belgian Endive",
  "Bell Peppers",
  "Bitter Melon",
  "Blackberries",
  "Blueberries",
  "Bok Choy",
  "Boniato",
  "Boysenberries",
  "Broccoflower",
  "Broccoli",
  "Brussels Sprouts",
  "Cabbage",
  "Cactus Pear",
  "Cantaloupe",
  "Carambola",
  "Carrots",
  "Casaba Melon",
  "Cauliflower",
  "Celery",
  "Chayote",
  "Cherimoya",
  "Cherries",
  "Coconuts",
  "Collard Greens",
  "Corn",
  "Cranberries",
  "Cucumber",
  "Dates",
  "Dried Plums",
  "Eggplant",
  "Endive",
  "Escarole",
  "Feijoa",
  "Fennel",
  "Figs",
  "Garlic",
  "Gooseberries",
  "Grapefruit",
  "Grapes",
  "Green Beans",
  "Green Onions",
  "Greens",
  "Guava",
  "Hominy",
  "Honeydew Melon",
  "Horned Melon",
  "Iceberg Lettuce",
  "Jerusalem Artichoke",
  "Jicama",
  "Kale",
  "Kiwifruit",
  "Kohlrabi",
  "Kumquat",
  "Leeks",
  "Lemons",
  "Lettuce",
  "Lima Beans",
  "Limes",
  "Longan",
  "Loquat",
  "Lychee",
  "Madarins",
  "Malanga",
  "Mandarin Oranges",
  "Mangos",
  "Mulberries",
  "Mushrooms",
  "Napa",
  "Nectarines",
  "Okra",
  "Onion",
  "Oranges",
  "Papayas",
  "Parsnip",
  "Passion Fruit",
  "Peaches",
  "Pears",
  "Peas",
  "Peppers",
  "Persimmons",
  "Pineapple",
  "Plantains",
  "Plums",
  "Pomegranate",
  "Potatoes",
  "Prickly Pear",
  "Prunes",
  "Pummelo",
  "Pumpkin",
  "Quince",
  "Radicchio",
  "Radishes",
  "Raisins",
  "Raspberries",
  "Red Cabbage",
  "Rhubarb",
  "Romaine Lettuce",
  "Rutabaga",
  "Shallots",
  "Snow Peas",
  "Spinach",
  "Sprouts",
  "Squash",
  "Strawberries",
  "String Beans",
  "Sweet Potato",
  "Tangelo",
  "Tangerines",
  "Tomatillo",
  "Tomato",
  "Turnip",
  "Ugli Fruit",
  "Water Chestnuts",
  "Watercress",
  "Watermelon",
  "Waxed Beans",
  "Yams",
  "Yellow Squash",
  "Yuca/Cassava",
  "Zucchini Squash",
];

export default function Home() {
  let prevSearchText = "";
  const [searchText, setSearchText] = createSignal("");
  const [dropdownShown, setDropdownShown] = createSignal(true);
  const [inputEl, setInputEl] = createSignal<HTMLInputElement>();

  const [results, setResults] = createStore<string[]>([]);
  const typeAhead = () => {
    const text = results.filter((r) => r.toLowerCase().startsWith(searchText().toLowerCase()))[0];
    if (!text) return;
    return text.length <= searchText().length ? undefined : text;
  };

  const update = (
    e: Event & {
      currentTarget: HTMLInputElement;
    },
  ) => {
    setSearchText((p) => {
      prevSearchText = p;
      return e.currentTarget.value;
    });
  };

  const fuzzy = new uFuzzy({ intraMode: 1 });

  createEffect(() => {
    const [idxs] = fuzzy.search(autocompletes, searchText(), 1);
    setResults((idxs ?? []).map((idx) => autocompletes[idx]));
  });

  return (
    <main class="w-full flex items-center justify-center p-16 text-neutral-900 dark:text-neutral-100">
      <div class="max-w-md w-full">
        <div class="relative block w-full border border-neutral-300 rounded-lg bg-neutral-50 p-2.5 text-base text-neutral-900 outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white placeholder-neutral-500/80 dark:placeholder-neutral-400">
          <input
            class="absolute top-0 z-10 h-full w-full bg-transparent color-transparent caret-black outline-none dark:caret-white"
            ref={setInputEl}
            value={searchText()}
            onKeyDown={(e) => {
              if (prevSearchText !== searchText()) {
                prevSearchText = searchText();
                setDropdownShown(true);
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setDropdownShown(false);
              }
              if (dropdownShown() && (e.key === "Tab" || e.key === "Enter") && results.length > 0) {
                e.preventDefault();
                setDropdownShown(false);
                setSearchText(typeAhead() ?? results[0]);
              }
            }}
            onFocus={[setDropdownShown, true]}
            onBlur={(e) => {
              setTimeout(() => setDropdownShown(false), 100);
            }}
            onInput={update}
          />
          <span class="inline-block h-full w-full whitespace-nowrap bg-transparent outline-none">
            {searchText().replaceAll(" ", "\u00A0")}
            <span class="opacity-50">{(typeAhead() ?? "").slice(searchText().length)}</span>
          </span>
        </div>
        <Show when={dropdownShown()}>
          <div class="contain-paint z-10 mt-2 flex flex-col rounded-lg shadow-md divide-y">
            <For each={results.filter((res) => res.length >= searchText().length)}>
              {(result) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <div
                  class="margin-0 cursor-pointer border-neutral-300 bg-neutral-50 p-2.5 text-base text-neutral-900 outline-none dark:border-neutral-600 dark:bg-neutral-700 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-600"
                  onClick={(e) => {
                    e.preventDefault();
                    batch(() => {
                      setDropdownShown(false);
                      setSearchText(result);
                    });
                    prevSearchText = result;
                    inputEl()?.focus();
                  }}
                >
                  {result}
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </main>
  );
}
