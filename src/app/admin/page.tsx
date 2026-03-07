'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'settings' | 'prayer' | 'announcements' | 'notices' | 'users' | 'tributes' | 'photos' | 'marriage'>('settings')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    masjidName: 'Zeenat-ul-Islam',
    location: 'Bulawayo, Zimbabwe',
    phone: '',
    email: '',
    address: '',
    jumuahTime: '1:00 PM',
    khutbahTime: '12:45 PM',
    liveStreamUrl: '',
    emergencyContact: '',
    imamPhone: '',
    janazaCoordinator: '',
  })

  // Announcements state
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: '', content: '', category: 'general', priority: 1 }
  ])

  // Prayer times state
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: '05:00',
    sunrise: '06:15',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:00',
    isha: '19:15',
  })

  // Notices state
  const [notices, setNotices] = useState([
    { id: 1, title: '', content: '', type: 'general', pinned: false }
  ])

  // Users state
  const [users, setUsers] = useState<User[]>([])

  // Tributes state
  const [tributes, setTributes] = useState<{
    id: string
    name: string
    relationship: string | null
    message: string
    isApproved: boolean
    isHighlighted: boolean
    submittedAt: string
  }[]>([])

  // Photos state
  const [photos, setPhotos] = useState<{
    id: string
    title: string
    description: string | null
    imageUrl: string
    category: string
    uploadedBy: string
    uploaderName: string | null
    isApproved: boolean
    isFeatured: boolean
    createdAt: string
  }[]>([])

  // Marriage profiles state
  const [marriageProfiles, setMarriageProfiles] = useState<{
    id: string
    displayName: string
    gender: string
    age: number
    maritalStatus: string
    aboutMe: string | null
    isApproved: boolean
    isVerified: boolean
    isVisible: boolean
    createdAt: string
    photos: { id: string; imageUrl: string; isApproved: boolean }[]
  }[]>([])

  // Load saved data on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('masjid-admin-settings')
    if (savedSettings) setSettings(JSON.parse(savedSettings))
    
    const savedAnnouncements = localStorage.getItem('masjid-admin-announcements')
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements))
    
    const savedNotices = localStorage.getItem('masjid-admin-notices')
    if (savedNotices) setNotices(JSON.parse(savedNotices))
    
    const savedPrayer = localStorage.getItem('masjid-admin-prayer')
    if (savedPrayer) setPrayerTimes(JSON.parse(savedPrayer))

    // Check for existing session
    const savedUser = localStorage.getItem('masjid-admin-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setLoggedIn(true)
    }
  }, [])

  // Handle login
  const handleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        setLoggedIn(true)
        localStorage.setItem('masjid-admin-user', JSON.stringify(data.user))
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    setLoggedIn(false)
    setUser(null)
    localStorage.removeItem('masjid-admin-user')
  }

  // Save all settings
  const handleSave = async () => {
    setSaving(true)
    
    localStorage.setItem('masjid-admin-settings', JSON.stringify(settings))
    localStorage.setItem('masjid-admin-announcements', JSON.stringify(announcements))
    localStorage.setItem('masjid-admin-notices', JSON.stringify(notices))
    localStorage.setItem('masjid-admin-prayer', JSON.stringify(prayerTimes))
    
    // Sync announcements to database
    try {
      for (const ann of announcements) {
        if (ann.title && ann.content) {
          await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ann),
          })
        }
      }
    } catch {
      console.log('Saved locally (offline mode)')
    }
    
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 500)
  }

  // Announcement functions
  const addAnnouncement = () => {
    setAnnouncements([...announcements, {
      id: Date.now(),
      title: '',
      content: '',
      category: 'general',
      priority: 1
    }])
  }

  const removeAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const updateAnnouncement = (id: number, field: string, value: string | number) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  // Notice functions
  const addNotice = () => {
    setNotices([...notices, {
      id: Date.now(),
      title: '',
      content: '',
      type: 'general',
      pinned: false
    }])
  }

  const removeNotice = (id: number) => {
    setNotices(notices.filter(n => n.id !== id))
  }

  const updateNotice = (id: number, field: string, value: string | boolean) => {
    setNotices(notices.map(n => 
      n.id === id ? { ...n, [field]: value } : n
    ))
  }

  // Load users
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/auth')
      const data = await response.json()
      setUsers(data)
    } catch {
      console.log('Could not load users')
    }
  }

  // Load tributes
  const loadTributes = async () => {
    try {
      const response = await fetch('/api/tributes?admin=true')
      const data = await response.json()
      if (data.success) {
        setTributes(data.tributes)
      }
    } catch {
      console.log('Could not load tributes')
    }
  }

  // Update tribute status
  const updateTributeStatus = async (id: string, isApproved: boolean, isHighlighted: boolean) => {
    try {
      await fetch('/api/tributes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved, isHighlighted, reviewedBy: user?.email }),
      })
      loadTributes()
    } catch {
      console.log('Could not update tribute')
    }
  }

  // Delete tribute
  const deleteTribute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tribute?')) return
    try {
      await fetch(`/api/tributes?id=${id}`, { method: 'DELETE' })
      loadTributes()
    } catch {
      console.log('Could not delete tribute')
    }
  }

  // Load photos
  const loadPhotos = async () => {
    try {
      const response = await fetch('/api/photos?admin=true')
      const data = await response.json()
      if (data.success) {
        setPhotos(data.photos)
      }
    } catch {
      console.log('Could not load photos')
    }
  }

  // Update photo status
  const updatePhotoStatus = async (id: string, isApproved: boolean, isFeatured: boolean) => {
    try {
      await fetch('/api/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved, isFeatured, approvedBy: user?.email }),
      })
      loadPhotos()
    } catch {
      console.log('Could not update photo')
    }
  }

  // Delete photo
  const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    try {
      await fetch(`/api/photos?id=${id}`, { method: 'DELETE' })
      loadPhotos()
    } catch {
      console.log('Could not delete photo')
    }
  }

  // Load marriage profiles
  const loadMarriageProfiles = async () => {
    try {
      const response = await fetch('/api/marriage?admin=true')
      const data = await response.json()
      if (data.success) {
        setMarriageProfiles(data.profiles)
      }
    } catch {
      console.log('Could not load marriage profiles')
    }
  }

  // Update marriage profile status
  const updateMarriageProfile = async (id: string, isApproved: boolean, isVerified: boolean, isVisible: boolean) => {
    try {
      await fetch('/api/marriage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved, isVerified, isVisible, reviewedBy: user?.email }),
      })
      loadMarriageProfiles()
    } catch {
      console.log('Could not update marriage profile')
    }
  }

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
    if (activeTab === 'tributes') {
      loadTributes()
    }
    if (activeTab === 'photos') {
      loadPhotos()
    }
    if (activeTab === 'marriage') {
      loadMarriageProfiles()
    }
  }, [activeTab])

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🕌</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Masjid Hub Management</p>
            <p className="text-gray-400 text-xs mt-2">Zeenat-ul-Islam, Bulawayo</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-primary focus:outline-none transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-primary focus:outline-none transition"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}
            
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center mb-2">Test Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border">
                <p className="font-medium text-primary">Imam</p>
                <p className="text-gray-500">imam@zeenatulislam.org</p>
                <p className="text-gray-400">Password: imam2024</p>
              </div>
              <div className="bg-white p-2 rounded-lg border">
                <p className="font-medium text-primary">Tech Support</p>
                <p className="text-gray-500">tech@zeenatulislam.org</p>
                <p className="text-gray-400">Password: tech2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">🛠️ Admin Panel</h1>
            <p className="text-xs opacity-80">Welcome, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-2 py-1 rounded">{user?.role}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="flex overflow-x-auto max-w-4xl mx-auto">
          {[
            { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
            { id: 'prayer', label: '🕐 Prayer Times', icon: '🕐' },
            { id: 'announcements', label: '📢 Announcements', icon: '📢' },
            { id: 'notices', label: '📋 Notice Board', icon: '📋' },
            { id: 'tributes', label: '💌 Tributes', icon: '💌' },
            { id: 'photos', label: '📸 Photos', icon: '📸' },
            { id: 'marriage', label: '💍 Marriage', icon: '💍' },
            { id: 'users', label: '👥 Users', icon: '👥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4 max-w-4xl mx-auto">
        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-4">🕌 Masjid Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Masjid Name</label>
                  <input
                    type="text"
                    value={settings.masjidName}
                    onChange={(e) => setSettings({...settings, masjidName: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({...settings, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="+263 XX XXX XXXX"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    placeholder="info@masjid.org"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    placeholder="Full address"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-4">📍 Jumu&apos;ah Settings</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumu&apos;ah Time</label>
                  <input
                    type="text"
                    value={settings.jumuahTime}
                    onChange={(e) => setSettings({...settings, jumuahTime: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khutbah Time</label>
                  <input
                    type="text"
                    value={settings.khutbahTime}
                    onChange={(e) => setSettings({...settings, khutbahTime: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-4">🚨 Emergency Contacts (Janaza)</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={settings.emergencyContact}
                    onChange={(e) => setSettings({...settings, emergencyContact: e.target.value})}
                    placeholder="+263 XX XXX XXXX"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imam Phone</label>
                  <input
                    type="text"
                    value={settings.imamPhone}
                    onChange={(e) => setSettings({...settings, imamPhone: e.target.value})}
                    placeholder="+263 XX XXX XXXX"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Janaza Coordinator</label>
                  <input
                    type="text"
                    value={settings.janazaCoordinator}
                    onChange={(e) => setSettings({...settings, janazaCoordinator: e.target.value})}
                    placeholder="Name and phone"
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-4">📺 Live Stream</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube/Live Stream URL</label>
                <input
                  type="url"
                  value={settings.liveStreamUrl}
                  onChange={(e) => setSettings({...settings, liveStreamUrl: e.target.value})}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* PRAYER TIMES TAB */}
        {activeTab === 'prayer' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-lg text-primary mb-4">🕐 Today&apos;s Prayer Times</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'fajr', label: 'Fajr', icon: '🌅' },
                { key: 'sunrise', label: 'Sunrise', icon: '☀️' },
                { key: 'dhuhr', label: 'Dhuhr', icon: '🌞' },
                { key: 'asr', label: 'Asr', icon: '🌤️' },
                { key: 'maghrib', label: 'Maghrib', icon: '🌅' },
                { key: 'isha', label: 'Isha', icon: '🌙' },
              ].map((prayer) => (
                <div key={prayer.key} className="flex items-center gap-2">
                  <span className="text-xl">{prayer.icon}</span>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{prayer.label}</label>
                    <input
                      type="time"
                      value={prayerTimes[prayer.key as keyof typeof prayerTimes]}
                      onChange={(e) => setPrayerTimes({...prayerTimes, [prayer.key]: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Update these daily or weekly based on your local prayer time calendar. 
                Changes reflect immediately on the main app.
              </p>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-primary">📢 Announcements</h2>
              <button
                onClick={addAnnouncement}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition"
              >
                + Add New
              </button>
            </div>
            
            {announcements.map((ann, index) => (
              <div key={ann.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                    #{index + 1}
                  </span>
                  {announcements.length > 1 && (
                    <button
                      onClick={() => removeAnnouncement(ann.id)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={ann.title}
                    onChange={(e) => updateAnnouncement(ann.id, 'title', e.target.value)}
                    placeholder="Announcement title..."
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                  
                  <textarea
                    value={ann.content}
                    onChange={(e) => updateAnnouncement(ann.id, 'content', e.target.value)}
                    placeholder="Announcement details..."
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={ann.category}
                      onChange={(e) => updateAnnouncement(ann.id, 'category', e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="general">📢 General</option>
                      <option value="event">📅 Event</option>
                      <option value="fundraiser">💰 Fundraiser</option>
                      <option value="emergency">🚨 Emergency</option>
                      <option value="madressa">📚 Madressa</option>
                    </select>
                    
                    <select
                      value={ann.priority}
                      onChange={(e) => updateAnnouncement(ann.id, 'priority', parseInt(e.target.value))}
                      className="px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value={1}>🟢 Normal</option>
                      <option value={2}>🟡 High</option>
                      <option value={3}>🔴 Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTICES TAB */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-primary">📋 Live Notice Board</h2>
              <button
                onClick={addNotice}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition"
              >
                + Add Notice
              </button>
            </div>
            
            {notices.map((notice, index) => (
              <div key={notice.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-accent text-primary px-2 py-1 rounded font-medium">
                    #{index + 1}
                  </span>
                  {notices.length > 1 && (
                    <button
                      onClick={() => removeNotice(notice.id)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={notice.title}
                    onChange={(e) => updateNotice(notice.id, 'title', e.target.value)}
                    placeholder="Notice title..."
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                  />
                  
                  <textarea
                    value={notice.content}
                    onChange={(e) => updateNotice(notice.id, 'content', e.target.value)}
                    placeholder="Notice details..."
                    className="w-full px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    rows={2}
                  />
                  
                  <div className="flex justify-between items-center">
                    <select
                      value={notice.type}
                      onChange={(e) => updateNotice(notice.id, 'type', e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="general">📌 General</option>
                      <option value="urgent">🔴 Urgent</option>
                      <option value="event">📅 Event</option>
                      <option value="fundraiser">💰 Fundraiser</option>
                    </select>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notice.pinned}
                        onChange={(e) => updateNotice(notice.id, 'pinned', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm">📌 Pin to Top</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-4">👥 Admin Users</h2>
              <p className="text-sm text-gray-500 mb-4">
                These users can access the admin panel to manage content.
              </p>
              
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">{u.name?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      u.role === 'ADMIN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="font-bold text-yellow-800 mb-2">🔑 Login Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Imam Account:</span>
                  <span className="font-mono text-yellow-800">imam@zeenatulislam.org / imam2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Tech Account:</span>
                  <span className="font-mono text-yellow-800">tech@zeenatulislam.org / tech2024</span>
                </div>
              </div>
              <p className="text-xs text-yellow-600 mt-3">
                ⚠️ Change these passwords in production for security!
              </p>
            </div>
          </div>
        )}

        {/* TRIBUTES TAB */}
        {activeTab === 'tributes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-2">💌 Tributes for Hajji Dawood Cassim</h2>
              <p className="text-sm text-gray-500 mb-4">
                Review, approve, and manage tributes submitted by community members.
              </p>

              {tributes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl">💌</span>
                  <p className="mt-2">No tributes submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tributes.map((tribute) => (
                    <div 
                      key={tribute.id} 
                      className={`p-4 rounded-xl border-2 ${
                        tribute.isApproved 
                          ? tribute.isHighlighted 
                            ? 'border-yellow-400 bg-yellow-50' 
                            : 'border-green-200 bg-green-50'
                          : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tribute.isHighlighted ? 'bg-yellow-400 text-white' : 'bg-primary/10 text-primary'
                          }`}>
                            <span className="font-bold">{tribute.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-bold">{tribute.name}</p>
                            {tribute.relationship && (
                              <p className="text-xs text-gray-500">{tribute.relationship}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {tribute.isApproved && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Approved</span>
                          )}
                          {tribute.isHighlighted && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ Featured</span>
                          )}
                          {!tribute.isApproved && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">⏳ Pending</span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{tribute.message}</p>

                      <p className="text-xs text-gray-400 mb-3">
                        Submitted: {new Date(tribute.submittedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        {!tribute.isApproved && (
                          <button
                            onClick={() => updateTributeStatus(tribute.id, true, false)}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {tribute.isApproved && !tribute.isHighlighted && (
                          <button
                            onClick={() => updateTributeStatus(tribute.id, true, true)}
                            className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                          >
                            ⭐ Feature
                          </button>
                        )}
                        {tribute.isHighlighted && (
                          <button
                            onClick={() => updateTributeStatus(tribute.id, true, false)}
                            className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                          >
                            Unfeature
                          </button>
                        )}
                        {!tribute.isApproved && (
                          <button
                            onClick={() => updateTributeStatus(tribute.id, false, true)}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                          >
                            ⭐ Approve & Feature
                          </button>
                        )}
                        <button
                          onClick={() => deleteTribute(tribute.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-2">📸 Photo Album Management</h2>
              <p className="text-sm text-gray-500 mb-4">
                Review, approve, and manage photos submitted by community members.
              </p>

              {photos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">📸</span>
                  <p>No photos submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {photos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className={`p-4 rounded-xl border-2 ${
                        photo.isApproved 
                          ? photo.isFeatured 
                            ? 'border-yellow-400 bg-yellow-50' 
                            : 'border-green-200 bg-green-50'
                          : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold">{photo.title}</p>
                              {photo.description && (
                                <p className="text-sm text-gray-600 mt-1">{photo.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {photo.category}
                                </span>
                                {photo.isApproved && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Approved</span>
                                )}
                                {photo.isFeatured && (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ Featured</span>
                                )}
                                {!photo.isApproved && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">⏳ Pending</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                Uploaded by {photo.uploaderName || 'Anonymous'} • {new Date(photo.createdAt).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3 flex-wrap">
                            {!photo.isApproved && (
                              <button
                                onClick={() => updatePhotoStatus(photo.id, true, false)}
                                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                              >
                                ✓ Approve
                              </button>
                            )}
                            {photo.isApproved && !photo.isFeatured && (
                              <button
                                onClick={() => updatePhotoStatus(photo.id, true, true)}
                                className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                              >
                                ⭐ Feature
                              </button>
                            )}
                            {photo.isFeatured && (
                              <button
                                onClick={() => updatePhotoStatus(photo.id, true, false)}
                                className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                              >
                                Unfeature
                              </button>
                            )}
                            <button
                              onClick={() => deletePhoto(photo.id)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MARRIAGE TAB */}
        {activeTab === 'marriage' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="font-bold text-lg text-primary mb-2">💍 Marriage Board (Halal Matrimonial)</h2>
              <p className="text-sm text-gray-500 mb-4">
                Review and approve marriage profiles. Ensure all content is halal and appropriate.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-emerald-800">
                  <strong>Quran 24:32:</strong> "And marry those among you who are single and the pious of your slaves and maidservants. If they are poor, Allah will enrich them from His Bounty."
                </p>
              </div>

              {marriageProfiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">💍</span>
                  <p>No marriage profiles yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marriageProfiles.map((profile) => (
                    <div 
                      key={profile.id} 
                      className={`p-4 rounded-xl border-2 ${
                        profile.isApproved 
                          ? profile.isVerified 
                            ? 'border-emerald-400 bg-emerald-50' 
                            : 'border-green-200 bg-green-50'
                          : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                            profile.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                          }`}>
                            {profile.gender === 'male' ? '👨' : '👩'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-lg">{profile.displayName}</p>
                              <p className="text-sm text-gray-600">
                                {profile.age} years • {profile.maritalStatus.replace('_', ' ')} • {profile.gender}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {profile.isApproved && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Approved</span>
                              )}
                              {profile.isVerified && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">✓ Verified</span>
                              )}
                              {!profile.isApproved && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">⏳ Pending</span>
                              )}
                              {!profile.isVisible && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">👁️ Hidden</span>
                              )}
                            </div>
                          </div>

                          {profile.aboutMe && (
                            <p className="text-sm text-gray-600 mt-2">{profile.aboutMe}</p>
                          )}

                          {profile.photos.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {profile.photos.slice(0, 3).map((photo) => (
                                <img 
                                  key={photo.id}
                                  src={photo.imageUrl}
                                  alt="Profile"
                                  className={`w-12 h-12 rounded object-cover ${!photo.isApproved ? 'opacity-50' : ''}`}
                                />
                              ))}
                              {profile.photos.length > 3 && (
                                <span className="text-xs text-gray-500">+{profile.photos.length - 3} more</span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(profile.createdAt).toLocaleDateString('en-GB')}
                          </p>

                          <div className="flex gap-2 mt-3 flex-wrap">
                            {!profile.isApproved && (
                              <button
                                onClick={() => updateMarriageProfile(profile.id, true, false, true)}
                                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                              >
                                ✓ Approve
                              </button>
                            )}
                            {profile.isApproved && !profile.isVerified && (
                              <button
                                onClick={() => updateMarriageProfile(profile.id, true, true, true)}
                                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
                              >
                                ✓ Verify
                              </button>
                            )}
                            {profile.isVisible && (
                              <button
                                onClick={() => updateMarriageProfile(profile.id, profile.isApproved, profile.isVerified, false)}
                                className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                              >
                                👁️ Hide
                              </button>
                            )}
                            {!profile.isVisible && (
                              <button
                                onClick={() => updateMarriageProfile(profile.id, profile.isApproved, profile.isVerified, true)}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                              >
                                👁️ Show
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto flex gap-3">
            <a
              href="/"
              className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary/5 transition"
            >
              👀 Preview App
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 hover:bg-primary-dark transition"
            >
              {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : '💾 Save All'}
            </button>
          </div>
        </div>
        
        <div className="h-24"></div>
      </main>
    </div>
  )
}
