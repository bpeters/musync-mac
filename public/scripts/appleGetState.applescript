tell application "iTunes"
  set cstate to "{"
  set cstate to cstate & "\"state\": \"" & player state & "\""
  set cstate to cstate & "}"

  return cstate
end tell
