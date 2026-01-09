export {}
declare global {
  const $: typeof import('clsx')['clsx']
  const Timer: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index')['Timer']
  const atom: typeof import('jotai')['atom']
  const atomWithStorage: typeof import('jotai/utils')['atomWithStorage']
  const calculatePrice: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['calculatePrice']
  const delay: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/utils')['delay']
  const getAllCategories: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getAllCategories']
  const getAllScenes: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getAllScenes']
  const getDefaultScene: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getDefaultScene']
  const getEnabledScenes: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getEnabledScenes']
  const getSceneAIConfig: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getSceneAIConfig']
  const getSceneById: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getSceneById']
  const getScenePricing: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getScenePricing']
  const getScenesByCategory: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['getScenesByCategory']
  const goToTopAtom: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/atoms/index')['goToTopAtom']
  const isPageReload: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useOnReload')['isPageReload']
  const isSceneAvailable: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['isSceneAvailable']
  const isiOS: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index')['isiOS']
  const jwtAtom: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useLogin')['jwtAtom']
  const myFetch: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index')['myFetch']
  const projectDir: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/dir')['projectDir']
  const randomItem: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/utils')['randomItem']
  const randomUUID: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/utils')['randomUUID']
  const relativeTime: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/utils')['relativeTime']
  const safeParseString: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index')['safeParseString']
  const sceneConfig: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')['default']
  const sources: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/sources')['sources']
  const toastAtom: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useToast')['toastAtom']
  const typeSafeObjectEntries: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/type.util')['typeSafeObjectEntries']
  const typeSafeObjectFromEntries: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/type.util')['typeSafeObjectFromEntries']
  const typeSafeObjectValues: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/type.util')['typeSafeObjectValues']
  const useAtom: typeof import('jotai')['useAtom']
  const useAtomValue: typeof import('jotai')['useAtomValue']
  const useCallback: typeof import('react')['useCallback']
  const useContext: typeof import('react')['useContext']
  const useDark: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useDark')['useDark']
  const useEffect: typeof import('react')['useEffect']
  const useLogin: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useLogin')['useLogin']
  const useMemo: typeof import('react')['useMemo']
  const useOnReload: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useOnReload')['useOnReload']
  const usePWA: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/usePWA')['usePWA']
  const useReducer: typeof import('react')['useReducer']
  const useRef: typeof import('react')['useRef']
  const useRelativeTime: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useRelativeTime')['useRelativeTime']
  const useSetAtom: typeof import('jotai')['useSetAtom']
  const useState: typeof import('react')['useState']
  const useToast: typeof import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/hooks/useToast')['useToast']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { SceneConfig, CategoryConfig, ScenesData } from 'E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config'
  import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/scene-config')
  // @ts-ignore
  export type { OmitNever, UnionToIntersection, MaybePromise } from 'E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/type.util'
  import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/type.util')
  // @ts-ignore
  export type { UserInfo, Order, Photo, Restoration, Subscription } from 'E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/types'
  import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/shared/types')
  // @ts-ignore
  export type { Timer } from 'E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index'
  import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/utils/index')
  // @ts-ignore
  export type { Update, ToastItem } from 'E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/atoms/types'
  import('E:/CodeRepo/MVP/Production/Wow/newsnow-ppl/src/atoms/types')
}