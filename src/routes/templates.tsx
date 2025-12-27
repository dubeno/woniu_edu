import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/templates")({
  component: TemplatesComponent,
})

function TemplatesComponent() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch("/api/templates")
      if (!res.ok) throw new Error("Failed to fetch templates")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">模板管理</h1>
        <Link
          to="/templates/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          新建模板
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template: any) => (
          <div
            key={template.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.type}</p>
              </div>
              {template.is_default && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  系统模板
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">尺寸：</span>
                <span className="font-medium">
                  {template.size.width} × {template.size.height}px ({template.size.dpi} DPI)
                </span>
              </div>
              <div>
                <span className="text-gray-600">背景：</span>
                <span className="font-medium">
                  {template.background.type === "solid" && template.background.color}
                </span>
                {template.background.type === "solid" && template.background.color && (
                  <span
                    className="inline-block w-4 h-4 ml-2 rounded border"
                    style={{ backgroundColor: template.background.color }}
                  />
                )}
              </div>
              <div>
                <span className="text-gray-600">肤色：</span>
                <span className="font-medium capitalize">{template.style.skin_tone}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/templates/$templateId"
                params={{ templateId: template.id }}
                className="flex-1 text-center px-3 py-2 border border-primary-600 text-primary-600 rounded hover:bg-primary-50"
              >
                查看详情
              </Link>
              {!template.is_default && (
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  编辑
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {templates?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>暂无模板</p>
        </div>
      )}
    </div>
  )
}

