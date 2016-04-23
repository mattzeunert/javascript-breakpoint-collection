# Manual pre-release testing script

1) Open devtools
2) Go to Breakpoints tab
3) Add a debugCookieReads breakpoint
4) Change breakpoint to tracepoint
5) Type document.cookie in console
=> Should show trace message saying that cookie was read
6) Click delete button for breakpoint
=> It should disappear
7) Evaluate dcument.cookie in console
=> Nothing should be logged

Would be nice to automate this...