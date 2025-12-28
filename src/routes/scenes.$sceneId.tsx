import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { ProfessionalUploader } from "../components/ProfessionalUploader"

export const Route = createFileRoute("/scenes/$sceneId")({
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
    uploadHint?: string
    customFields?: CustomFieldConfig[]
  }
  ai: {
    supports_multiple_images?: boolean
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
  
  // 支持多图上传
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [referenceImages, setReferenceImages] = useState<File[]>([])
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string>("")
  const [refPreviewUrls, setRefPreviewUrls] = useState<string[]>([])
  
  // 用户自定义需求
  const [userPrompt, setUserPrompt] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")
  const [guidanceScale, setGuidanceScale] = useState<number>(5.5)
  const [size, setSize] = useState<"1K" | "2K" | "4K">("2K")
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [enableOptimization, setEnableOptimization] = useState<boolean>(false)
  
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // 获取场景详情
  useEffect(() => {
    fetch("/api/scenes")
      .then(res => res.json())
      .then(data => {
        const foundScene = data.scenes?.find((s: Scene) => s.id === sceneId)
        if (foundScene) {
          setScene(foundScene)
        } else {
          alert("场景不存在")
          navigate({ to: "/" })
        }
      })
      .catch(err => console.error("Failed to load scene:", err))
  }, [sceneId, navigate])

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
    
    try {
      setEnableOptimization(true)
      alert("✅ 已启用AI提示词优化！生成时会自动优化你的描述。")
    } catch (error) {
      console.error("Optimization failed:", error)
    }
  }

  const handleUpload = async () => {
    if (!mainImage || !scene) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("scene_id", scene.id)
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

      if (!response.ok) {
        throw new Error("处理失败")
      }

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      alert("处理失败: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handlePay = async () => {
    if (!result) return

    try {
      const response = await fetch(`/api/restorations/${result.id}/pay`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("支付失败")
      }

      const data = await response.json()
      setResult({ ...result, payment_status: "paid", download_url: data.download_url })
      alert("✅ 支付成功！")
    } catch (error: any) {
      alert("支付失败: " + error.message)
    }
  }

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 面包屑导航 */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <span>←</span>
          <span>返回首页</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{scene.icon}</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {scene.page.title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {scene.page.subtitle}
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            {scene.page.features.map((feature, idx) => (
              <span key={idx}>{feature}</span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
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
            <div className="space-y-8 animate-fade-in">
              {/* Elegant Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {scene.name}完成
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">对比查看效果</p>
              </div>

              {/* Elegant Comparison View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">原图</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden">
                    <img 
                      src={result.original_url} 
                      alt="Original" 
                      className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{scene.name}后</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={result.restored_url} 
                      alt="Restored" 
                      className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                    {result.payment_status === "unpaid" && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-xl border border-gray-200">
                          <p className="text-sm font-medium text-gray-700">付费后查看高清图</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clean Action Buttons */}
              <div className="space-y-3 pt-2">
                {result.payment_status === "unpaid" ? (
                  <>
                    <button
                      onClick={handlePay}
                      className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-base transition-all shadow-sm hover:shadow-md"
                    >
                      支付 ¥{scene.pricing.display} 下载高清图
                    </button>
                    <button
                      onClick={() => {
                        setResult(null)
                        setMainImage(null)
                        setMainPreviewUrl("")
                        setReferenceImages([])
                        setRefPreviewUrls([])
                      }}
                      className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-medium transition-all border border-gray-200 hover:border-gray-300"
                    >
                      修复其他照片
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setResult(null)
                      setMainImage(null)
                      setMainPreviewUrl("")
                      setReferenceImages([])
                      setRefPreviewUrls([])
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-base transition-all shadow-sm hover:shadow-md"
                  >
                    继续修复其他照片
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
