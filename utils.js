/** Forma de Leer un JSON en MJS **/

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url) // obtenemos la dirección del archivo actual
export const readJson = (path) => require(path)

// Obtener la URL del root
import * as url from "url";
const directoryUrl = new URL(".", import.meta.url);
export const directoryPath = url.fileURLToPath(directoryUrl);
