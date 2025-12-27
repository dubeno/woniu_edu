export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Introduction */}
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">关于 DuckFish</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            DuckFish 是专业的 AI 影像处理平台，致力于让 AI 影像处理如鱼得水般自然流畅。
            我们集成 Seedream 4.5 旗舰模型，提供 4K 商业级输出和影楼级工作流。
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            极简设计，零学习成本。让创作更简单，让专业更普及。
          </p>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2025 DuckFish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

