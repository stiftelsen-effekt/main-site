export function serializeMap(map: Map<unknown, unknown>) {
  return JSON.stringify(Array.from(map.entries()));
}

export function deserializeMap<K, V>(serializedMap: string) {
  return new Map<K, V>(JSON.parse(serializedMap));
}
