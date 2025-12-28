import { useState, useEffect } from "react"

interface CustomFieldConfig {
  key: string
  label: string
  type: string
  required: boolean
  placeholder: string
}

interface ProfessionalUploaderProps {
  mainImage: File | null
  referenceImages: File[]
  mainPreviewUrl: string
  refPreviewUrls: string[]
  userPrompt: string
  negativePrompt: string
  guidanceScale: number
  size: "1K" | "2K" | "4K"
  showAdvanced: boolean
  customFields?: Record<string, string>
  sceneCustomFields?: CustomFieldConfig[]
  onMainImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReferenceImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveReference: (index: number) => void
  onPromptChange: (value: string) => void
  onNegativePromptChange: (value: string) => void
  onGuidanceScaleChange: (value: number) => void
  onSizeChange: (value: "1K" | "2K" | "4K") => void
  onToggleAdvanced: () => void
  onCustomFieldChange?: (key: string, value: string) => void
  onOptimizePrompt?: () => void
  onUpload: () => void
  uploading: boolean
  resultImageUrl?: string
}

export function ProfessionalUploader(props: ProfessionalUploaderProps) {
  const {
    mainImage,
    referenceImages,
    mainPreviewUrl,
    refPreviewUrls,
    userPrompt,
    negativePrompt,
    guidanceScale,
    size,
    showAdvanced,
    customFields = {},
    sceneCustomFields = [],
    onMainImageSelect,
    onReferenceImageSelect,
    onRemoveReference,
    onPromptChange,
    onNegativePromptChange,
    onGuidanceScaleChange,
    onSizeChange,
    onToggleAdvanced,
    onCustomFieldChange,
    onOptimizePrompt,
    onUpload,
    uploading,
    resultImageUrl
  } = props

  // 进度状态：0-100
  const [progress, setProgress] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [currentPhrase, setCurrentPhrase] = useState("")

  // 等待哲理文案
  const waitingPhrases = [
    "美好的事物值得等待",
    "每一秒的等待，都在创造奇迹",
    "耐心是创作的一部分",
    "时间会证明，等待是值得的",
    "慢工出细活，好作品需要时间",
    "在等待中，我们学会了欣赏",
    "每一帧的完美，都需要精雕细琢",
    "等待，是为了更好的呈现",
    "静待花开，静待完美",
    "最好的作品，值得最耐心的等待",
    "时间沉淀，品质升华",
    "等待是创作的艺术",
    "每一秒的等待，都在接近完美",
    "耐心等待，惊喜即将到来",
    "好作品，值得等待",
  ]

  // 进度更新逻辑
  useEffect(() => {
    if (uploading) {
      setProgress(0)
      setShowResult(false)
      setShowFireworks(false)
      // 随机选择一句哲理
      setCurrentPhrase(waitingPhrases[Math.floor(Math.random() * waitingPhrases.length)])
      
      // 模拟进度更新
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          // 前期快，后期慢
          const increment = prev < 50 ? 8 + Math.random() * 7 : 3 + Math.random() * 4
          const newProgress = Math.min(prev + increment, 95)
          
          // 每20%进度更换一次哲理文案
          if (Math.floor(newProgress / 20) !== Math.floor(prev / 20)) {
            setCurrentPhrase(waitingPhrases[Math.floor(Math.random() * waitingPhrases.length)])
          }
          
          return newProgress
        })
      }, 400)
      return () => clearInterval(interval)
    } else if (resultImageUrl && !uploading) {
      // 生成完成，进度到100，然后显示结果
      setProgress(100)
      // 显示烟花效果
      setShowFireworks(true)
      setTimeout(() => {
        setShowResult(true)
        // 3秒后隐藏烟花
        setTimeout(() => setShowFireworks(false), 3000)
      }, 500)
    } else {
      // 重置状态
      setProgress(0)
      setShowResult(false)
      setShowFireworks(false)
      setCurrentPhrase("")
    }
  }, [uploading, resultImageUrl])

  return (
    <>
      {/* Fireworks Effect */}
      {showFireworks && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute firework"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${1.2 + Math.random() * 0.6}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Lightbox for Image Preview */}
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
              onClick={(e) => {
                e.stopPropagation()
                setLightboxUrl(null)
              }}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <a
              href={lightboxUrl}
              download="generated.png"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
              title="下载图片"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0 overflow-hidden">
      {/* LEFT COLUMN: Controls Panel */}
      <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar min-h-0">
        
        {/* Main Control Panel */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              输入素材
            </h3>
          </div>

          {/* Main Image Upload Area */}
          <div className="relative group">
            {/* Hidden input - always present */}
            <input
              id="main-image-input"
              type="file"
              accept="image/*"
              onChange={onMainImageSelect}
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg p-1 transition-all hover:border-gray-500 hover:bg-gray-100 active:border-gray-600 relative">
              {mainPreviewUrl ? (
                <div className="relative group/preview w-full aspect-[16/9] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  <img 
                    src={mainPreviewUrl} 
                    alt="Main" 
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* File Size Info */}
                  {mainImage && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {(mainImage.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        document.getElementById('main-image-input')?.click()
                      }}
                      className="bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                    >
                      更换主图
                    </button>
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="main-image-input"
                  className="w-full aspect-[16/9] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors rounded"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center mb-2 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0v1.5a3 3 0 11-6 0v-1.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">点击上传主图</span>
                  <span className="text-xs text-gray-500 mt-1">支持 JPG、PNG，最大 10MB</span>
                </label>
              )}
            </div>
          </div>

          {/* Reference Images Area */}
          <div className="mt-4 pt-3 border-t border-gray-300">
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-xs font-medium text-gray-700">参考素材</h3>
               <span className="text-xs text-gray-500">{referenceImages.length}/9</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent snap-x">
              {/* Add Button */}
              {referenceImages.length < 9 && (
                <label className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-100 active:border-gray-600 transition-colors flex flex-col items-center justify-center snap-start group">
                  <span className="text-2xl text-gray-400 group-hover:text-gray-600 transition-colors">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onReferenceImageSelect}
                    className="hidden"
                  />
                </label>
              )}
              
              {refPreviewUrls.map((url, index) => (
                <div key={index} className="flex-shrink-0 w-16 h-16 relative group border-2 border-gray-300 hover:border-gray-400 bg-white rounded-lg overflow-hidden snap-start transition-colors">
                  <img src={url} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveReference(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white w-5 h-5 flex items-center justify-center text-xs rounded transition-colors cursor-pointer font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parameters Panel */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              参数配置
            </h3>
          </div>

          {/* Custom Fields (Dynamic) */}
          {sceneCustomFields.length > 0 && (
            <div className="space-y-3 mb-4 pb-3 border-b border-gray-300">
              {sceneCustomFields.map(field => (
                <div key={field.key} className="group">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                    <span>{field.label}</span>
                    {field.required && <span className="text-xs text-red-600">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={customFields[field.key] || ""}
                      onChange={(e) => onCustomFieldChange?.(field.key, e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-all resize-none block"
                      rows={3}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={customFields[field.key] || ""}
                      onChange={(e) => onCustomFieldChange?.(field.key, e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-all block"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Prompt Engineering */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-700">创作描述</label>
                {onOptimizePrompt && userPrompt && (
                  <button 
                    onClick={onOptimizePrompt} 
                    className="text-xs text-gray-600 hover:text-gray-900 active:text-gray-800 px-2 py-1 border border-gray-300 hover:bg-gray-50 rounded transition-colors cursor-pointer font-medium"
                  >
                    AI 优化
                  </button>
                )}
             </div>
             <textarea
                value={userPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-all resize-none"
                rows={4}
                placeholder="在此描述具体的画面细节、光影、风格等..."
              />
          </div>

          {/* Advanced Settings Toggle */}
          <div className="mt-4">
            <button
              onClick={onToggleAdvanced}
              className="w-full flex items-center justify-between text-xs font-medium text-gray-700 hover:text-gray-900 active:text-gray-800 py-2.5 border-t border-gray-300 transition-colors cursor-pointer"
            >
              <span>高级设置</span>
              <span className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-4 pt-2 pb-3">
                {/* Guidance Scale */}
                <div>
                  <div className="flex justify-between text-xs mb-2 items-end">
                    <span className="text-gray-700">提示词相关性</span>
                    <span className="text-gray-900 font-mono">{guidanceScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={guidanceScale}
                    onChange={(e) => onGuidanceScaleChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>更有创意</span>
                    <span>严格遵循</span>
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <span className="text-xs text-gray-700 block mb-2">输出分辨率</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1K', '2K', '4K'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => onSizeChange(s)}
                        className={`py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          size === s
                            ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button Area - Fixed at bottom of scroll or static */}
        <div className="sticky bottom-0 bg-white pt-3 pb-2 z-10">
          <button
            onClick={onUpload}
            disabled={!mainImage || uploading}
            className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white font-semibold py-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI 处理中...</span>
              </>
            ) : (
              <span>开始生成</span>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Result Display Area */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-0">
        <div className="bg-white border border-gray-200 rounded-xl flex-1 relative overflow-hidden flex flex-col shadow-sm">
          {/* Canvas Area - Progress & Result Display */}
          <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {uploading ? (
              // 生成中：在图片上显示进度
              <div className="w-full h-full flex items-center justify-center p-6 relative">
                {/* 模糊的原图作为背景 */}
                {mainPreviewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img 
                      src={mainPreviewUrl} 
                      alt="Processing" 
                      className="max-w-full max-h-full object-contain rounded-lg blur-xl opacity-30 transition-opacity duration-500"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        filter: 'blur(20px)',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </div>
                )}
                
                {/* 进度覆盖层 */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 mb-4 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                        className="text-gray-900 transition-all duration-300 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-semibold text-gray-900">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-2">AI 处理中</p>
                  {currentPhrase && (
                    <p className="text-xs text-gray-500 max-w-xs text-center leading-relaxed px-4">
                      {currentPhrase}
                    </p>
                  )}
                </div>
              </div>
            ) : resultImageUrl && showResult ? (
              // 生成完成：逐步显示结果（淡入效果）
              <div className="w-full h-full flex items-center justify-center p-6">
                <div className="relative w-full h-full flex items-center justify-center group">
                  <img 
                    src={resultImageUrl} 
                    alt="Result" 
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xl transition-opacity duration-700 cursor-zoom-in"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      opacity: showResult ? 1 : 0
                    }}
                    onClick={() => setLightboxUrl(resultImageUrl)}
                  />
                  {/* 操作按钮组 - 悬停显示 */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setLightboxUrl(resultImageUrl)}
                      className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200"
                      title="预览大图"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                    <a 
                      href={resultImageUrl} 
                      download="generated.png"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200"
                      title="下载图片"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // 初始状态：等待上传
              <div className="text-center px-8 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">准备就绪</h2>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                  上传素材后，AI 生成的高清结果将在此优雅呈现
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
