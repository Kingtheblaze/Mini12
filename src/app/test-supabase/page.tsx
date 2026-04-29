import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: users, error } = await supabase.from('User').select('id, name, email')

  if (error) {
    return (
      <div className="p-8 glass m-8 rounded-2xl border border-red-500/20">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Supabase Connection Status</h1>
        <div className="p-4 bg-red-500/10 rounded-xl mb-4">
            <p className="text-sm text-red-300 font-bold">Error: {error.message}</p>
            <p className="text-xs text-red-400 mt-1">Status Code: {error.code}</p>
        </div>
        <p className="text-sm text-gray-400">
            If you see "Could not find the table 'public.User'", it means your connection is working, but the table name in Supabase might be different (e.g. lowercase 'user' or 'users').
        </p>
        <pre className="p-4 mt-6 bg-black/40 rounded-xl text-xs text-red-300 overflow-auto whitespace-pre-wrap">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold gradient-text">Supabase Connected</h1>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">Users Table Data</h2>
            {!users || users.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-gray-500 italic">Connected successfully, but the 'User' table is currently empty.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                {users.map((user: any) => (
                    <li key={user.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-purple-300">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold">Verified</span>
                    </li>
                ))}
                </ul>
            )}
        </div>
    </div>
  )
}
