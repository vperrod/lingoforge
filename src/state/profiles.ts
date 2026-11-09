import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CourseId } from '../content/types'
import { safeJSONStorage } from './safe-storage'
import { useProgress } from './progress'

/** crypto.randomUUID needs a secure context; crypto.getRandomValues doesn't
 *  and is available anywhere randomUUID would be missing, so it's the real
 *  fallback — Math.random is not collision-resistant enough for an id. */
function newProfileId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(10))
    return `p-${Date.now()}-${Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')}`
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export interface Profile {
  id: string
  name: string
  /** Emoji avatar shown on profile cards (display only, not UI iconography) */
  avatar: string
  courses: CourseId[]
  createdAt: number
}

interface ProfilesState {
  profiles: Profile[]
  activeProfileId: string | null
  createProfile: (name: string, avatar: string, courses: CourseId[]) => Profile
  switchProfile: (id: string | null) => void
  deleteProfile: (id: string) => void
  addCourse: (profileId: string, course: CourseId) => void
}

export const useProfiles = create<ProfilesState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfileId: null,
      createProfile: (name, avatar, courses) => {
        const profile: Profile = {
          id: newProfileId(),
          name,
          avatar,
          courses,
          createdAt: Date.now(),
        }
        set((s) => ({ profiles: [...s.profiles, profile], activeProfileId: profile.id }))
        return profile
      },
      switchProfile: (id) => set({ activeProfileId: id }),
      deleteProfile: (id) =>
        set((s) => {
          useProgress.getState().unloadProfile(id) // before removeItem, so no save can re-create the blob
          try {
            localStorage.removeItem(progressStorageKey(id))
          } catch (e) {
            // QuotaExceededError/SecurityError (Safari private mode) — the profile
            // is still removed from state below; only the orphaned progress blob
            // is left behind in storage.
            console.warn('lingoforge: failed to remove progress from localStorage', e)
          }
          return {
            profiles: s.profiles.filter((p) => p.id !== id),
            activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
          }
        }),
      addCourse: (profileId, course) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId && !p.courses.includes(course)
              ? { ...p, courses: [...p.courses, course] }
              : p,
          ),
        })),
    }),
    { name: 'lingoforge:profiles', storage: safeJSONStorage },
  ),
)

// Another tab changed the profile list: adopt it, so this tab can't re-persist a stale
// list (e.g. resurrect a profile deleted elsewhere), and drop progress of profiles that vanished.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== 'lingoforge:profiles') return
    void Promise.resolve(useProfiles.persist.rehydrate()).then(() => {
      const { profileId } = useProgress.getState()
      if (profileId && !useProfiles.getState().profiles.some((p) => p.id === profileId)) {
        useProgress.getState().unloadProfile(profileId)
      }
    })
  })
}

export function progressStorageKey(profileId: string): string {
  return `lingoforge:${profileId}:progress`
}
