on escape_quotes(string_to_escape)
  set AppleScript's text item delimiters to the "\""
  set the item_list to every text item of string_to_escape
  set AppleScript's text item delimiters to the "\\\""
  set string_to_escape to the item_list as string
  set AppleScript's text item delimiters to ""
  return string_to_escape
end escape_quotes

tell application "iTunes"
  set cstate to "{"
  set cstate to cstate & "\"trackId\": " & current track's id
  set cstate to cstate & ",\"name\": \"" & my escape_quotes(current track's name) & "\""
  set cstate to cstate & ",\"artist\": \"" & my escape_quotes(current track's artist) & "\""
  set cstate to cstate & ",\"album\": \"" & my escape_quotes(current track's album) & "\""
  set cstate to cstate & ",\"duration\": " & (current track's duration as integer)
  set cstate to cstate & ",\"position\": " & (player position as integer)
  set cstate to cstate & ",\"state\": \"" & player state & "\""
  set cstate to cstate & "}"

  return cstate
end tell
