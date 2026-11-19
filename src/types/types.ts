export interface Pokemons {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
}

export interface PokemonSummary {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}
