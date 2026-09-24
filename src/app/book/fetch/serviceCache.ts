import { cache } from 'react'

import { getEngineService } from './engine'

// Jen pro serverové komponenty. Layout kroku (kontrola 404) a stránka čtou tutéž
// službu v jednom renderu — cache() z toho udělá jeden požadavek na engine
// (veřejné ručky engine mají rate-limit na IP a server Next je pro ně jedna IP).
export const getEngineServiceCached = cache(getEngineService)
