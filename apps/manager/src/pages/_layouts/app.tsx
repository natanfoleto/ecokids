import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FBF4F4]">
      {/* <Header /> */}

      <main className="mx-[168px] mt-5 flex items-center">
        <Outlet />
      </main>
    </div>
  )
}
