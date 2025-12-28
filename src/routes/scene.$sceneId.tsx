import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { jwtAtom } from "~/hooks/useLogin"
import { ProfessionalUploader } from "../components/ProfessionalUploader"
import { SceneIcon } from "../components/SceneIcon"

export const Route = createFileRoute("/scene/$sceneId")({
  component: SceneDetailPage,
})

interface CustomFieldConfig {
  key: string
  label: string
  type: string
  required: boolean
  placeholder: string
}

interface Scene {
  id: string
  name: string
  description: string
  icon: string
  category: string
  page: {
    title: string
    subtitle: string
    features: string[]
    uploadText: string
    customFields?: CustomFieldConfig[]
  }
  pricing: {
    display: string
    unit: string
  }
}

function SceneDetailPage() {
  const { sceneId } = Route.useParams()
  const navigate = useNavigate()
  const [jwt] = useAtom(jwtAtom) // 使用atom而不是直接从localStorage读取（避免JSON序列化问题）
  const [scene, setScene] = useState<Scene | null>(null)
  const [allScenes, setAllScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [showSceneSwitcher, setShowSceneSwitcher] = useState(false)
  
  // Upload State
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [referenceImages, setReferenceImages] = useState<File[]>([])
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string>("")
  const [refPreviewUrls, setRefPreviewUrls] = useState<string[]>([])
  
  // User Config
  const [userPrompt, setUserPrompt] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")
  const [guidanceScale, setGuidanceScale] = useState<number>(5.5)
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [enableOptimization, setEnableOptimization] = useState<boolean>(false)
  
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  // Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/scenes")
      .then(res => res.json())
      .then(data => {
        const scenes = data.scenes || []
        setAllScenes(scenes)
        const foundScene = scenes.find((s: Scene) => s.id === sceneId)
        setScene(foundScene || null)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load scene:", err)
        setLoading(false)
      })
  }, [sceneId])

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 文件大小验证 (10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`图片太大！最大支持 10MB，当前文件 ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        e.target.value = '' // 清空选择
        return
      }
      
      // 文件类型验证
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！')
        e.target.value = ''
        return
      }
      
      setMainImage(file)
      setMainPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }
  
  const handleReferenceImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setReferenceImages(prev => [...prev, ...files].slice(0, 9))
      const urls = files.map(f => URL.createObjectURL(f))
      setRefPreviewUrls(prev => [...prev, ...urls].slice(0, 9))
    }
  }
  
  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
    setRefPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields(prev => ({ ...prev, [key]: value }))
  }
  
  const handleOptimizePrompt = async () => {
    if (!userPrompt.trim()) return
    setEnableOptimization(true)
    alert("✅ 已启用 AI 提示词智能优化！")
  }

  const handleUpload = async () => {
    if (!mainImage || !scene) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("scene_id", sceneId)
      formData.append("main_image", mainImage)
      
      referenceImages.forEach(img => {
        formData.append("reference_images", img)
      })
      
      formData.append("prompt", userPrompt)
      formData.append("negative_prompt", negativePrompt)
      formData.append("guidance_scale", guidanceScale.toString())
      formData.append("size", size)
      formData.append("enable_optimization", enableOptimization.toString())
      
      Object.entries(customFields).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      const headers: HeadersInit = {}
      if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`
        console.log("上传图片，已传递 JWT token")
      } else {
        console.warn("上传图片，未登录（历史记录不会被保存）")
      }
      
      const response = await fetch("/api/restore", {
        headers,
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Upload failed" }))
        const errorMessage = errorData.message || `上传失败 (${response.status})`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      console.error("Upload error:", error)
      const errorMessage = error.message || "处理失败，请重试。"
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-amber-500 animate-pulse font-mono tracking-widest">INITIALIZING WORKSTATION...</div>
      </div>
    )
  }

  if (!scene) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="mb-4">SCENE CONFIGURATION NOT FOUND</div>
          <Link to="/" className="text-amber-500 hover:text-amber-400 font-mono">
            &lt; 返回工作台
          </Link>
        </div>
      </div>
    )
  }

  // Helper to get result URLs
  const resultUrls = result?.restored_urls || (result?.restored_url ? [result.restored_url] : [])
  const firstResultUrl = resultUrls[0] || null

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      {/* Elegant Lightbox */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] group">
            <img 
              src={lightboxUrl} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300" 
              alt="Preview" 
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Minimal Header Bar - 更简洁的设计 */}
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm flex-shrink-0 z-40">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors text-xs cursor-pointer">
                    &lt; 工作台
                </Link>
                <div className="h-3 w-px bg-gray-300"></div>
                <div className="relative">
                  <button
                    onClick={() => setShowSceneSwitcher(!showSceneSwitcher)}
                    className="flex items-center gap-1.5 text-gray-900 hover:text-gray-700 transition-colors text-sm"
                  >
                    <SceneIcon sceneId={scene.id} className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{scene.page.title}</span>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {showSceneSwitcher && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto custom-scrollbar min-w-[280px]">
                      <div className="p-2">
                        {allScenes.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              navigate({ to: "/scene/$sceneId", params: { sceneId: s.id } })
                              setShowSceneSwitcher(false)
                            }}
                            className={`w-full text-left p-2 rounded hover:bg-gray-50 transition-colors ${
                              s.id === sceneId ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <SceneIcon sceneId={s.id} className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-900">{s.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">¥{s.pricing.display}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>

      {/* Overlay to close switcher */}
      {showSceneSwitcher && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSceneSwitcher(false)}
        />
      )}

      <div className="container mx-auto px-4 py-4 flex-1 overflow-hidden flex flex-col min-h-0">
        <ProfessionalUploader
          mainImage={mainImage}
          referenceImages={referenceImages}
          mainPreviewUrl={mainPreviewUrl}
          refPreviewUrls={refPreviewUrls}
          userPrompt={userPrompt}
          negativePrompt={negativePrompt}
          guidanceScale={guidanceScale}
          size={size}
          showAdvanced={showAdvanced}
          customFields={customFields}
          sceneCustomFields={scene.page.customFields}
          onMainImageSelect={handleMainImageSelect}
          onReferenceImageSelect={handleReferenceImageSelect}
          onRemoveReference={removeReferenceImage}
          onPromptChange={setUserPrompt}
          onNegativePromptChange={setNegativePrompt}
          onGuidanceScaleChange={setGuidanceScale}
          onSizeChange={setSize}
          onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
          onCustomFieldChange={handleCustomFieldChange}
          onOptimizePrompt={handleOptimizePrompt}
          onUpload={handleUpload}
          uploading={uploading}
          resultImageUrl={firstResultUrl}
        />
      </div>
    </div>
  )
}
