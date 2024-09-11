export function processAyah(ayah, basmala) {
  // last char in basmala is ascii 10 (line feed) vs ascii 32 (space) in ayah
  if (ayah.startsWith(basmala.slice(0, -1)) && ayah.length > basmala.length) {
    ayah.slice(basmala.length);
  }
  return `{${ayah.slice(0, -1)}}`; // remove last char \n (line break)
}