import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { ProfessionalUploader } from "../components/ProfessionalUploader"

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

      const response = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Upload error:", error)
      alert("处理失败，请重试。")
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

  return (
    <div className="h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      {/* Lightbox */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img src={lightboxUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 bg-white text-gray-900 p-2 border border-gray-300 hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="border-b border-gray-300 bg-white flex-shrink-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link to="/" className="text-gray-600 hover:text-gray-900 active:text-gray-800 transition-colors text-sm cursor-pointer">
                    &lt; 工作台
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="relative">
                  <button
                    onClick={() => setShowSceneSwitcher(!showSceneSwitcher)}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <span className="text-xl">{scene.icon}</span>
                    <h1 className="text-base font-semibold">{scene.page.title}</h1>
                    <span className="text-xs text-gray-500">▼</span>
                  </button>
                  
                  {showSceneSwitcher && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto custom-scrollbar min-w-[300px]">
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
                                <span className="text-lg">{s.icon}</span>
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

      <div className="container mx-auto px-4 py-4 flex-1 overflow-hidden flex flex-col">
        {!result ? (
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
            />
        ) : (
            // RESULT VIEW
            <div className="max-w-6xl mx-auto flex-1 flex flex-col min-h-0">
                <div className="bg-white border border-gray-300 overflow-hidden flex flex-col flex-1 min-h-0">
                    {/* Toolbar */}
                    <div className="p-3 border-b border-gray-300 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-sm font-medium text-gray-900">
                              处理完成 ({resultUrls.length} 张)
                            </span>
                        </div>
                        <button 
                            onClick={() => setResult(null)}
                            className="text-xs text-gray-600 hover:text-gray-900 active:text-gray-800 transition-colors px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded cursor-pointer"
                        >
                            关闭
                        </button>
                    </div>
                    
                    {/* Full Width Result View */}
                    <div className="bg-gray-50 p-4 flex flex-col flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <div className={`grid ${resultUrls.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                            {resultUrls.map((url: string, index: number) => (
                              <div key={index} className="bg-white border border-gray-300 relative group">
                                  <div className="w-full bg-white flex items-center justify-center p-6 min-h-[500px]">
                                  <img 
                                    src={url} 
                                    alt={`Result ${index + 1}`} 
                                      className="max-w-full max-h-full object-contain cursor-zoom-in"
                                    onClick={() => setLightboxUrl(url)}
                                  />
                                  </div>
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a 
                                      href={url} 
                                      download={`generated-${index}.png`}
                                      className="bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 p-2 border border-gray-300 rounded transition-colors cursor-pointer"
                                      title="下载图片"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      ⬇
                                    </a>
                                  </div>
                              </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="p-4 border-t border-gray-300 flex justify-between items-center flex-shrink-0">
                        <div className="text-xs text-gray-500">
                           {result.id?.substring(0,8)}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setResult(null)
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 active:text-gray-800 text-sm transition-colors border border-gray-300 hover:bg-gray-50 rounded cursor-pointer"
                            >
                                返回修改
                            </button>
                            <button 
                                onClick={() => {
                                    setResult(null)
                                    setMainImage(null)
                                    setMainPreviewUrl("")
                                    setReferenceImages([])
                                    setRefPreviewUrls([])
                                    setUserPrompt("")
                                }}
                                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold text-sm transition-colors rounded cursor-pointer"
                            >
                                开始新任务
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
