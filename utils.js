/** Forma de Leer un JSON en MJS **/

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url) // obtenemos la dirección del archivo actual
export const readJson = (path) => require(path)
