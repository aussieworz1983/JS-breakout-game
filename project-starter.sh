#!/bin/bash
	code -r .
	gnome-terminal --tab -e live-server
	npm run watch:sass 
	
