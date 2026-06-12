import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useProfiles } from './state/profiles'
import { useProgress } from './state/progress'
import { ProfilePicker } from './app/ProfilePicker'
import { Layout } from './app/Layout'
import { PathScreen } from './app/PathScreen'
import { LessonScreen } from './app/LessonScreen'
import { AlphabetScreen } from './app/AlphabetScreen'
import { ReviewScreen } from './app/ReviewScreen'
import { StatsScreen } from './app/StatsScreen'

export default function App() {
  const { profiles, activeProfileId } = useProfiles()
  const profile = profiles.find((p) => p.id === activeProfileId)
  const loadForProfile = useProgress((s) => s.loadForProfile)
  const loadedProfileId = useProgress((s) => s.profileId)

  useEffect(() => {
    if (profile) loadForProfile(profile.id, profile.courses[0])
  }, [profile, loadForProfile])

  if (!profile) return <ProfilePicker />
  // wait until the right profile's progress is in the store
  if (loadedProfileId !== profile.id) return null

  return (
    <HashRouter>
      <Routes>
        <Route path="/lesson/:courseId/:lessonId" element={<LessonScreen />} />
        <Route element={<Layout />}>
          <Route path="/" element={<PathScreen />} />
          <Route path="/alphabet" element={<AlphabetScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
