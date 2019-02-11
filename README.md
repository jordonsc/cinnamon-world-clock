World Clock Applet for Cinnamon
===============================
This applet allows you to add multiple clocks to your Cinnamon system tray with different time zones.

Installation
------------
Add the contents of this repository to:
	
	~/.local/share/cinnamon/applets/worldclock@jordon

Configuration
-------------
To display multiple time zones simply add the applet multiple times to your panel. Clicking on the applet will bring up
the configuration screen.

### Short name for clock
Use something meaningful to indicate what time zone this clock is for, eg `LON`.

### Timezone offset in hours
The GMT offset in hours, eg `11` for Sydney time during daylight savings, or "1.5" for +01:30.

Notes
-----
Unfortunately due to the difficulties with date formatting in Javascript, I was unable to use a timezone code and 
automatically adjust DLS. If you have any genius ideas, please let me know!

