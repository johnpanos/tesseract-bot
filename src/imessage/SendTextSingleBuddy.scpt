on run argv
	tell application "Messages"
		set targetService to 1st service whose service type = iMessage
		set myid to item 2 of argv
		set mymessage to item 1 of argv
		set theBuddy to a reference to buddy myid of targetService
		send mymessage to theBuddy
	end tell
end run