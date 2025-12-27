import { useState, useRef, useEffect } from "react"

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
    uploading
  } = props

  // 使用 ref 来平滑滚动，防止布局跳动
  const advancedRef = useRef<HTMLDivElement>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
      {/* LEFT COLUMN: Controls Panel */}
      <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
        
        {/* Main Control Panel */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              输入素材
            </h3>
          </div>

          {/* Main Image Upload Area */}
          <div className="relative group">
             <div className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg p-1 transition-all hover:border-gray-500 hover:bg-gray-100 active:border-gray-600 relative">
              {mainPreviewUrl ? (
                <div className="relative group/preview w-full aspect-[16/9] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  <img 
                    src={mainPreviewUrl} 
                    alt="Main" 
                    className="max-w-full max-h-full object-contain"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => document.getElementById('main-image-input')?.click()}
                      className="bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                    >
                      更换主图
                    </button>
                  </div>
                </div>
              ) : (
                <label className="w-full aspect-[16/9] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors rounded">
                  <div className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center mb-2 transition-colors">
                    <span className="text-xl">📸</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">点击上传主图</span>
                  <input
                    id="main-image-input"
                    type="file"
                    accept="image/*"
                    onChange={onMainImageSelect}
                    className="hidden"
                  />
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

      {/* RIGHT COLUMN: Preview Area - Enhanced */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-0">
        <div className="bg-white border border-gray-300 rounded-lg flex-1 relative overflow-hidden flex flex-col">
          {/* Toolbar - Enhanced */}
          <div className="h-9 bg-gray-50 border-b border-gray-300 flex items-center justify-between px-3 flex-shrink-0">
             <div className="flex items-center gap-2">
               <span className="text-xs text-gray-600">预览区</span>
             </div>
             {mainPreviewUrl && (
               <div className="flex items-center gap-2 text-xs text-gray-500">
                 <span>4K 输出</span>
                 <span>·</span>
                 <span>商业级</span>
               </div>
             )}
          </div>

          {/* Canvas Area - Enhanced */}
          <div className="flex-1 relative flex items-center justify-center bg-gray-50">
             {mainPreviewUrl ? (
               <div className="w-full h-full flex items-center justify-center p-4">
                 <div className="relative max-w-full max-h-full">
                   <img 
                     src={mainPreviewUrl} 
                     alt="Preview" 
                     className="max-w-full max-h-full object-contain rounded-lg border border-gray-200"
                   />
                   <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
                     原图预览
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-center">
                 <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center mx-auto mb-3">
                   <span className="text-2xl">🖼️</span>
                 </div>
                 <h2 className="text-lg font-semibold text-gray-900 mb-1">工作区就绪</h2>
                 <p className="text-sm text-gray-600 max-w-sm mx-auto px-4 mb-3">
                   请在左侧面板上传素材并配置参数，AI 生成的高清结果将在此处显示。
                 </p>
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded border border-gray-200">
                   <span className="text-xs font-medium text-gray-700">DuckFish</span>
                   <span className="text-xs text-gray-500">AI影像，如鱼得水</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
