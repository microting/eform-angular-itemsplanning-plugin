#!/bin/bash

if [ -d "~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn"]; then
	rm -fR ~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn
fi

cp -av ~/Documents/workspace/microting/eform-angular-frontend/eform-client/src/app/plugins/modules/items-planning-pn ~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eform-client/src/app/plugins/modules/items-planning-pn

if [ -d "~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn"]; then
	~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn
fi

cp -av ~/Documents/workspace/microting/eform-angular-frontend/eFormAPI/Plugins/ItemsPlanning.Pn ~/Documents/workspace/microting/eform-angular-itemsplanning-plugin/eFormAPI/Plugins/ItemsPlanning.Pn
