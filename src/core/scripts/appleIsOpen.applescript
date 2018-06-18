tell application "System Events"
  if application process "iTunes" exists then
    return true
  end if
end tell
