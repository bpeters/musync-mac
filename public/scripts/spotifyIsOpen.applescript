tell application "System Events"
  if application process "Spotify" exists then
    return true
  end if
end tell
