import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'

export default function ProfilePage() {
  const { user, profileForm, setProfileForm, saveProfile, orders } = useStore()

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Account"
        title="Manage your shopper profile"
        description="Personal information, loyalty status and a compact order history view."
      />

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-black text-white">
              {user.name.split(' ').map((part) => part[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
            <p className="text-sm text-slate-300">Membership</p>
            <p className="mt-2 text-2xl font-black">{user.membership}</p>
            <p className="mt-4 text-sm text-slate-300">Priority delivery, bonus discounts and special drop alerts.</p>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-card">
            <h3 className="text-xl font-black text-slate-900">Profile Details</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Full Name</span>
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Email Address</span>
                <input
                  value={profileForm.email}
                  onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>City</span>
                <input
                  value={profileForm.city}
                  onChange={(event) => setProfileForm({ ...profileForm, city: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Membership</span>
                <input
                  value={profileForm.membership}
                  onChange={(event) => setProfileForm({ ...profileForm, membership: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                />
              </label>
            </div>
            <button onClick={saveProfile} className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">
              Save Changes
            </button>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-card">
            <h3 className="text-xl font-black text-slate-900">Recent Orders</h3>
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-100 px-4 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-500">Placed on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">₹{order.total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-emerald-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
