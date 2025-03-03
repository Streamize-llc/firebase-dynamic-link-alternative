export default function EnvPage() {
  // 서버 컴포넌트에서 process.env 접근
  const envVars: Record<string, string> = {};
  
  // process.env의 모든 키를 순회하며 객체에 추가
  Object.keys(process.env).forEach((key) => {
    if (process.env[key] !== undefined) {
      envVars[key] = process.env[key] as string;
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">환경 변수 디버깅 페이지</h1>
      
      {Object.keys(envVars).length > 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-4">키</th>
                <th className="text-left py-2 px-4">값</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(envVars).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-200">
                  <td className="py-2 px-4 font-mono text-sm">{key}</td>
                  <td className="py-2 px-4 font-mono text-sm">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <p className="text-yellow-700">환경 변수가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

