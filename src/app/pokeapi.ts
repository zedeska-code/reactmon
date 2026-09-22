// Library of functions reaching the pokeapi API
//
// Get the list of every pokemon
export default async function allPokemon({ offset = 0 }: { offset?: number }) {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=" + offset;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.error((error as Error).message);
    return [];
  }
}
// Get the info of one single pokemon
export async function pokemonInfo(name: string) {
  const url = "https://pokeapi.co/api/v2/pokemon/" + name;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error((error as Error).message);
    return [];
  }
}
